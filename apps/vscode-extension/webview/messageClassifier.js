// Convert to a global function for use in webview
function classifyMessage(message) {
  const text = message.toLowerCase();

  if (
    text.includes('hook') ||
    text.includes('hooks') ||
    text.includes('useeffect') ||
    text.includes('usestate') ||
    text.includes('usememo') ||
    text.includes('usecallback') ||
    text.includes('usereducer')
  ) {
    return '/images/hook.png';
  }

  if (
    text.includes('objects are not valid as a react child') ||
    text.includes('cannot read properties of undefined') ||
    text.includes('cannot read property') ||
    text.includes('react child') ||
    text.includes('each child in a list should have a unique "key"') ||
    text.includes('hydrate') ||
    text.includes('hydration') ||
    text.includes('did not match') ||
    text.includes('expected server html') ||
    text.includes('adjacent jsx elements') ||
    text.includes('failed to execute') ||
    text.includes('appendchild') ||
    text.includes('removechild') ||
    text.includes('dom') ||
    text.includes('doms')
  ) {
    return '/images/dom.png';
  }

  return '/images/confused.png';
}

// Add to global window object for use in furryError.js
window.classifyMessage = classifyMessage;