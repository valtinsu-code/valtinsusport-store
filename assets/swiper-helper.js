// assets/swiper-helper.js
window.SwiperHelper = window.SwiperHelper || {
  duplicateSlideSelector: '.swiper-slide-duplicate, .showcase-loop-clone',

  getContainer: function(container) {
    return typeof container === 'string' ? document.querySelector(container) : container;
  },

  isLoopEnabled: function(swiperInstance, container) {
    if (swiperInstance && swiperInstance.params && swiperInstance.params.loop) return true;
    if (swiperInstance && swiperInstance.originalParams && swiperInstance.originalParams.loop) return true;

    const wrapper = this.getContainer(container);
    return !!(wrapper && wrapper.querySelector(this.duplicateSlideSelector));
  },

  replaceDuplicateTags: function(container, sourceSelector = 'h1, h2, h3, h4, h5, h6', targetTagName = 'div', options = {}) {
    const wrapper = this.getContainer(container);
    if (!wrapper) return;

    const duplicateSlides = wrapper.querySelectorAll(this.duplicateSlideSelector);
    if (!duplicateSlides.length) return;

    if (options.onlyWhenLoop !== false && !this.isLoopEnabled(options.swiperInstance, wrapper)) {
      return;
    }

    duplicateSlides.forEach(function(slide) {
      const targets = slide.querySelectorAll(sourceSelector);

      targets.forEach(function(element) {
        const newEl = document.createElement(targetTagName);

        Array.from(element.attributes).forEach(function(attr) {
          newEl.setAttribute(attr.name, attr.value);
        });

        newEl.innerHTML = element.innerHTML;
        element.parentNode.replaceChild(newEl, element);
      });
    });
  },

  bind: function(swiperInstance, sourceSelector, targetTagName) {
    if (!swiperInstance) return;

    const self = this;
    const performReplacement = function() {
      self.replaceDuplicateTags(swiperInstance.el, sourceSelector, targetTagName, {
        swiperInstance: swiperInstance
      });
    };

    if (swiperInstance.initialized) {
      performReplacement();
    }

    swiperInstance.on('init', performReplacement);
    swiperInstance.on('loopFix', performReplacement);
    swiperInstance.on('observerUpdate', performReplacement);
    window.setTimeout(performReplacement, 0);
  }
};
