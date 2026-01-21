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
  const hasVueCoreKeyword = text.includes('vue') || text.includes('v-bind') || text.includes('v-model') || text.includes('v-for');
  const vueErrorPatterns = [
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
    /vue component/,
    /vue directive/,
    /vue router/,
    /vuex/,
    /pinia/,
    /vue warn/,
    /vue error/,
    /vue compiler/,
    /vue runtime/,
    /hydration mismatch/,
    /invalid v-for/,
    /invalid v-bind/,
    /invalid v-model/,
    /props validation/,
    /emits validation/,
    /vue-loader/,
    /vue-cli/,
    /vite-plugin-vue/
  ];
  const hasVueSpecificError = vueErrorPatterns.some(pattern => pattern.test(text));
  if (hasVueCoreKeyword || hasVueSpecificError) {
    return '/images/onVue.png';
  }
  if (
    text.includes('type') ||
    text.includes('typeerror') ||
    text.includes('is not a function') ||
    text.includes('is not an object') ||
    text.includes('is not a constructor') ||
    text.includes('is not iterable') ||
    text.includes('is not a string') ||
    text.includes('is not a number') ||
    text.includes('is not a boolean') ||
    text.includes('is not an array') ||
    text.includes('is not a bigint') ||
    text.includes('is not a symbol') ||
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