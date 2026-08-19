document.addEventListener('DOMContentLoaded', () => {
  const imageWraps = document.querySelectorAll('.article-img-loading');

  imageWraps.forEach((wrap) => {
    const img = wrap.querySelector('img');

    if (!img) return;

    const closeLoading = () => {
      wrap.classList.add('is-loaded');
    };

    // 处理缓存图片：如果图片已经加载完成，直接关闭动画
    if (img.complete && img.naturalWidth > 0) {
      closeLoading();
    } else {
      img.addEventListener('load', closeLoading, { once: true });
      img.addEventListener('error', closeLoading, { once: true });
    }
  });
});