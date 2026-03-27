/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/**
 * Extension for the message listener
 * This allows extending the message handling functionality without modifying index.js
 */
function extractTsErrorText(htmlSource) {
  if (!htmlSource) return "";

  // 匹配最后一个span中包含的错误描述（排除图标、分隔符等无关内容）
  // 正则说明：匹配最后一个</span>前的文本，且过滤掉特殊字符/图标
  const errorRegex = /<span[^>]*>[\s]*([A-Za-z].*?)[\s]*<\/span>\s*$/;
  const match = htmlSource.match(errorRegex);

  return match?.[1]?.trim() || extractLastSpanText(htmlSource); // 兜底方案
}

(function () {
  if (typeof window === "undefined") {
    return;
  }

  const originalAddEventListener = window.addEventListener;
  const messageListeners = [];
  window.addEventListener = function (type, listener, options) {
    if (type === "message") {
      messageListeners.push(listener);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  const originalRemoveEventListener = window.removeEventListener;
  window.removeEventListener = function (type, listener, options) {
    if (type === "message") {
      const index = messageListeners.indexOf(listener);
      if (index > -1) {
        messageListeners.splice(index, 1);
      }
    }
    return originalRemoveEventListener.call(this, type, listener, options);
  };
  if (window.document.readyState === "loading") {
    window.document.addEventListener(
      "DOMContentLoaded",
      addCustomMessageListener
    );
  } else {
    addCustomMessageListener();
  }
  function addCustomMessageListener() {
    // Add our own message listener that will be called after the original one
    originalAddEventListener.call(window, "message", function (event) {
      const message = event.data;
      switch (message.command) {
        case "update-content": {
          const $furryError = window.document.querySelector("#furry-error");
          if ($furryError) {
            const baseImageMap = {
              "/images/hook.png": "./images/hook.png",
              "/images/dom.png": "./images/dom.png",
              "/images/not_found_wink.png": "./images/not_found_wink.png",
              "/images/react-furry-moji.png": "./images/react-furry-moji.png",
              "/images/confused.png": "./images/confused.png",
            };
            const messageImageMap = {
              "/images/hook.png": message.hookImageUri,
              "/images/dom.png": message.domImageUri,
              "/images/not_found_wink.png": message.notFoundWinkImageUri,
              "/images/react-furry-moji.png": message.reactFurryMojiImageUri,
              "/images/confused.png": message.confusedImageUri,
            };
            const additionalBaseImageMap = {
              "/images/onVue.png": "./images/onVue.png",
              "/images/type.png": "./images/type.png",
            };
            const additionalMessageImageMap = {
              "/images/onVue.png": message.onVueImageUri,
              "/images/type.png": message.typeImageUri,
            };

            // Get the image path based on message classification
            const imagePath = window.classifyMessage(message.content);
            const additionalPath = window.additionalClassifier(message.content);

            let imageUri = baseImageMap["/images/confused.png"];
            let additionalUri;

            // Select the appropriate image URI based on the classified path
            if (baseImageMap[imagePath]) {
              imageUri = messageImageMap[imagePath] || baseImageMap[imagePath];
            }

            // Select the appropriate additional image URI based on the classified path
            if (additionalPath) {
              const additionalImageEnabled =
                (additionalPath === "/images/onVue.png" &&
                  message.onVueImageEnabled !== false) ||
                (additionalPath === "/images/type.png" &&
                  message.typeImageEnabled !== false);

              if (!additionalImageEnabled) {
                additionalUri = undefined;
              } else {
              additionalUri =
                additionalMessageImageMap[additionalPath] ||
                additionalBaseImageMap[additionalPath] ||
                additionalPath;
              }
            }

            $furryError.innerHTML = `<img src="${imageUri}" alt="Furry error" />`;
            if (additionalUri) {
              $furryError.innerHTML += `<img src="${additionalUri}" alt="Furry error 1" />`;
            }
            // $furryError.innerHTML += `<h1>${extractTsErrorText(
            //   message.content
            // )}</h1>`;
          }
          break;
        }
      }
    });
  }

  // Export for potential use in other modules
  window.furryErrorExtension = {
    getMessageListeners: () => messageListeners,
    addCustomMessageListener,
  };
})();
