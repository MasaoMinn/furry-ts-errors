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
            const additionalPath = window.additionalClassifier(message.content);
            let imageUri='';
            let additionalUri;
            
            // Select the appropriate image URI based on the classified path
            if (imagePath === '/images/hook.png') {
              imageUri = message.hookImageUri || './images/hook.png';
            } else if (imagePath === '/images/dom.png') {
              imageUri = message.domImageUri || './images/dom.png';
            } else if (imagePath === '/images/not_found_wink.png') {
              imageUri = message.notFoundWinkImageUri || './images/not_found_wink.png';
            } else {
              imageUri = message.confusedImageUri || './images/confused.png';
            }
            
            // Select the appropriate additional image URI based on the classified path
            if (additionalPath) {
              if (additionalPath === '/images/onVue.png') {
                additionalUri = message.onVueImageUri || './images/onVue.png';
              } else {
                additionalUri = additionalPath;
              }
            }
            
            $furryError.innerHTML = `<img src="${imageUri}" alt="Furry error" />`;
            if(additionalUri) {
              $furryError.innerHTML += `<img src="${additionalUri}" alt="Furry error 1" />`;
            }
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