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

  // 1. 核心 Vue 关键词（基础匹配）
  const hasVueCoreKeyword = text.includes('vue') || text.includes('v-bind') || text.includes('v-model') || text.includes('v-for');
  
  // 2. Vue 特有报错特征（精准匹配，覆盖 Vue 2/3 高频报错）
  const vueErrorPatterns = [
    // Vue 3 组合式 API 错误
    /setup script/,
    /composition api/,
    /ref\(\)/,
    /reactive\(\)/,
    /computed\(\)/,
    /watch\(/,
    /use.*hook/, // 自定义 hook 相关
    /defineprops/,
    /defineemits/,
    /defineexpose/,
    // Vue 通用语法错误
    /component template/,
    /vue component/,
    /vue directive/,
    /vue router/,
    /vuex/,
    /pinia/, // Vue 3 状态管理
    /vue warn/,
    /vue error/,
    // Vue 编译/运行时错误
    /vue compiler/,
    /vue runtime/,
    /hydration mismatch/, // Vue 服务端渲染水合错误
    /invalid v-for/,
    /invalid v-bind/,
    /invalid v-model/,
    /duplicate key/, // v-for 重复 key
    /props validation/, // props 验证错误
    /emits validation/, // emits 验证错误
    // Vue 生态错误
    /vue-loader/,
    /vue-cli/,
    /vite-plugin-vue/
  ];
  const hasVueSpecificError = vueErrorPatterns.some(pattern => pattern.test(text));
  
  if (hasVueCoreKeyword || hasVueSpecificError) {
    return '/images/onVue.png';
  }

  return null;
}
window.additionalClassifier = additionalClassifier;