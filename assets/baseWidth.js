(function () {
  const root = document.documentElement;
  let rafId = null;
  let lastWidth = 0;
  let lastBaseWidth = '';
  let lastBaseFont = '';

  function getViewportWidth() {
    const visualWidth = window.visualViewport && window.visualViewport.width;
    return Math.round(visualWidth || window.innerWidth || root.clientWidth || 0);
  }

  function getSettingValue(key, fallback) {
    if (typeof settings === 'undefined' || settings[key] == null || settings[key] === '') {
      return fallback;
    }

    return settings[key];
  }

  function getBaseWidth(width) {
    if (width > 1800) return 1700;
    if (width > 1600) return 1600;
    if (width > 1440) return 1500;
    if (width > 1024) return 1440;
    if (width > 768) return 1024;
    return 750;
  }

  function getBaseFont(width) {
    if (width > 1920) return getSettingValue('font_1920_size', 1920);
    if (width > 1820) return getSettingValue('font_1820_size', 1820);
    if (width > 1720) return getSettingValue('font_1720_size', 1720);
    if (width > 1620) return getSettingValue('font_1620_size', 1620);
    if (width > 1520) return getSettingValue('font_1520_size', 1520);
    if (width > 1420) return getSettingValue('font_1440_size', 1440);
    if (width > 1320) return getSettingValue('font_1320_size', 1320);
    if (width > 1220) return getSettingValue('font_1220_size', 1220);
    if (width > 1120) return getSettingValue('font_1120_size', 1120);
    if (width > 1025) return getSettingValue('font_1024_size', 1024);
    if (width > 900) return getSettingValue('font_900_size', 900);
    if (width > 800) return getSettingValue('font_800_size', 800);
    if (width > 700) return getSettingValue('font_768_size', 768);
    if (width > 600) return getSettingValue('font_668_size', 668);
    if (width > 500) return getSettingValue('font_568_size', 568);
    if (width > 400) return getSettingValue('font_468_size', 468);
    return getSettingValue('font_375_size', 375);
  }

  function applyBaseWidth() {
    rafId = null;

    const width = getViewportWidth();
    const baseWidth = String(getBaseWidth(width));
    const baseFont = String(getBaseFont(width));
    const changed = width !== lastWidth || baseWidth !== lastBaseWidth || baseFont !== lastBaseFont;

    root.style.setProperty('--base-width', baseWidth);
    root.style.setProperty('--base-font', baseFont);

    if (changed) {
      lastWidth = width;
      lastBaseWidth = baseWidth;
      lastBaseFont = baseFont;
      document.dispatchEvent(new CustomEvent('baseWidthChange', {
        detail: width
      }));
    }
  }

  function scheduleBaseWidthUpdate() {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(applyBaseWidth);
  }

  function scheduleDelayedUpdate() {
    scheduleBaseWidthUpdate();
    window.setTimeout(scheduleBaseWidthUpdate, 80);
    window.setTimeout(scheduleBaseWidthUpdate, 240);
  }

  scheduleBaseWidthUpdate();

  window.addEventListener('resize', scheduleBaseWidthUpdate, { passive: true });
  window.addEventListener('orientationchange', scheduleDelayedUpdate, { passive: true });
  window.addEventListener('pageshow', scheduleBaseWidthUpdate);
  document.addEventListener('visibilitychange', scheduleBaseWidthUpdate);
  document.addEventListener('shopify:section:load', scheduleDelayedUpdate);
  document.addEventListener('shopify:section:reorder', scheduleDelayedUpdate);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleBaseWidthUpdate, { passive: true });
  }

  if (typeof ResizeObserver === 'function') {
    const resizeObserver = new ResizeObserver(scheduleBaseWidthUpdate);
    resizeObserver.observe(root);
  }

  window.updateBaseWidth = scheduleDelayedUpdate;
})();
