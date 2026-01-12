/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/**
 * Extension for the message listener
 * This allows extending the message handling functionality without modifying index.js
 */
(function() {
  if (typeof window === 'undefined') {
    return;
  }

  const originalAddEventListener = window.addEventListener;
  const messageListeners = [];
  window.addEventListener = function(type, listener, options) {
    if (type === 'message') {
      messageListeners.push(listener);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  const originalRemoveEventListener = window.removeEventListener;
  window.removeEventListener = function(type, listener, options) {
    if (type === 'message') {
      const index = messageListeners.indexOf(listener);
      if (index > -1) {
        messageListeners.splice(index, 1);
      }
    }
    return originalRemoveEventListener.call(this, type, listener, options);
  };
  if (window.document.readyState === 'loading') {
    window.document.addEventListener('DOMContentLoaded', addCustomMessageListener);
  } else {
    addCustomMessageListener();
  }
  function addCustomMessageListener() {
    // Add our own message listener that will be called after the original one
    originalAddEventListener.call(window, 'message', function(event) {
      const message = event.data;
      switch (message.command) {
        case 'update-content': {
          console.log('Custom update-content handler called');
          const $furryError = window.document.querySelector('#furry-error');
          if ($furryError) {
            // Get the image path based on message classification
            const imagePath = window.classifyMessage(message.content);
            let imageUri;
            
            // Select the appropriate image URI based on the classified path
            if (imagePath === '/images/hook.png') {
              imageUri = message.hookImageUri || './images/hook.png';
            } else if (imagePath === '/images/dom.png') {
              imageUri = message.domImageUri || './images/dom.png';
            } else {
              imageUri = message.confusedImageUri || './images/confused.png';
            }
            
            // Set the innerHTML with the appropriate image
            $furryError.innerHTML = `<img src="${imageUri}" alt="Furry error" />`;
          } else {
            console.error('Could not find #furry-error element');
          }
          break;
        }
      }
    });
  }

  // Export for potential use in other modules
  window.furryErrorExtension = {
    getMessageListeners: () => messageListeners,
    addCustomMessageListener
  };
})();