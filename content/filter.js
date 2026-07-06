// 滤镜层：CSS filter 直接加在视频/iframe 元素上，跨域 iframe 同样生效
if (!window.__moyuFilter) {
  window.__moyuFilter = {
    // filter 对象：{ saturate, brightness, preset }
    // preset: 'gray' 全灰 / 'off' 关闭 / 缺省则用滑块值
    build(f) {
      if (!f || f.preset === 'off') return 'none';
      if (f.preset === 'gray') return 'grayscale(1) contrast(0.85) brightness(0.9)';
      const s = typeof f.saturate === 'number' ? f.saturate : 0.3;
      const b = typeof f.brightness === 'number' ? f.brightness : 0.9;
      return 'saturate(' + s + ') brightness(' + b + ')';
    },
    apply(el, f) {
      if (!el) return;
      el.style.setProperty('filter', this.build(f), 'important');
    },
  };
}
