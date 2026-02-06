// Convert to a global function for use in webview
function classifyMessage(message) {
  const text = message.toLowerCase();
  if (text.includes('prettified diagnostic')) {
    return '/images/react-furry-moji.png'
  }
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
    text.includes('react child') ||
    text.includes('cannot read properties of undefined') ||
    text.includes('cannot read property') ||
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

  if (
    text.includes('found') ||
    text.includes('find') ||
    text.includes('varient') ||
    text.includes('import') || 
    text.includes('module') ||
    text.includes('export')
  ) {
    return '/images/not_found_wink.png';
  }

  return '/images/confused.png';
}

// Add to global window object for use in furryError.js
window.classifyMessage = classifyMessage;

/**
 * 精准识别 Vue 相关报错，返回对应图片路径
 * @param {string} message - VSCode 捕获的报错信息文本
 * @returns {string|null} - 匹配到则返回图片路径，否则返回 null
 */
function additionalClassifier(message) {
  const text = message.toLowerCase();
  const vueErrorPatterns = [
    /vue/, // 核心：匹配任意位置的vue（如vue、vue-router、avue都能匹配）
    /setup script/,
    /composition api/,
    /ref\(\)/,
    /reactive\(\)/,
    /computed\(\)/,
    /watch\(/,
    /use.*hook/,
    /defineprops/,
    /defineemits/,
    /defineexpose/,
    /component template/,
    /pinia/,
  ];
  if (vueErrorPatterns.some(pattern => pattern.test(text))) {
    return '/images/onVue.png';
  }
  
  if (
    text.includes('assignable') ||
    text.includes('typeerror') ||
    text.includes('is not') ||
    text.includes('cannot convert') ||
    text.includes('read properties') ||
    text.includes('instanceof') ||
    text.includes('prototype') 
  ) {
    return '/images/type.png';
  }

  return null;
}
window.additionalClassifier = additionalClassifier;