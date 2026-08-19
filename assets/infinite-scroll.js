const ANIMATION_OPTIONS = {
  duration: 500,
};

function debounce(fn, delay) {
  let timer = null;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), delay);
  };
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };
  return debounced;
}

function animateValue({ from, to, duration, onUpdate, easing = (t) => t * t * (3 - 2 * t), onComplete }) {
  const startTime = performance.now();
  let cancelled = false;
  let currentValue = from;

  function animate(currentTime) {
    if (cancelled) return;

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    currentValue = from + (to - from) * easedProgress;

    onUpdate(currentValue);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (typeof onComplete === 'function') {
      onComplete();
    }
  }

  requestAnimationFrame(animate);

  return {
    get current() {
      return currentValue;
    },
    cancel() {
      cancelled = true;
    },
  };
}

class MarqueeComponent extends HTMLElement {
  constructor() {
    super();
    this._animation = null;
    this._marqueeWidth = null;
    this._handleResize = debounce(this._handleResize.bind(this), 250);
    this._slowDown = debounce(this._slowDown.bind(this), ANIMATION_OPTIONS.duration);
    this._speedUp = this._speedUp.bind(this);
  }

  get refs() {
    if (!this._refs) {
      const wrapper = this.querySelector('[ref="wrapper"]');
      const content = this.querySelector('[ref="content"]');
      const marqueeItems = Array.from(this.querySelectorAll('[ref="marqueeItems[]"]'));
      this._refs = { wrapper, content, marqueeItems };
    }
    return this._refs;
  }

  connectedCallback() {
    const { marqueeItems } = this.refs;
    if (!marqueeItems || marqueeItems.length === 0) return;
    this._init();
    window.addEventListener('resize', this._handleResize);
    this.addEventListener('pointerenter', this._slowDown);
    this.addEventListener('pointerleave', this._speedUp);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this._handleResize);
    this.removeEventListener('pointerenter', this._slowDown);
    this.removeEventListener('pointerleave', this._speedUp);
  }

  async _init() {
    const { numberOfCopies } = await this._queryNumberOfCopies();
    const speed = this._calculateSpeed(numberOfCopies);
    this._addRepeatedItems(numberOfCopies);
    this._duplicateContent();
    this._setSpeed(speed);
  }

  get clonedContent() {
    const { content, wrapper } = this.refs;
    const lastChild = wrapper.lastElementChild;
    return content !== lastChild ? lastChild : null;
  }

  _setSpeed(value) {
    this.style.setProperty('--marquee-speed', `${value}s`);
  }

  async _queryNumberOfCopies() {
    const { marqueeItems } = this.refs;
    return new Promise((resolve) => {
      if (!marqueeItems[0]) {
        return setTimeout(() => resolve({ numberOfCopies: 1, isHorizontalResize: true }), 0);
      }
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          const firstEntry = entries[0];
          if (!firstEntry) return;
          intersectionObserver.disconnect();
          const { width: marqueeWidth } = firstEntry.rootBounds ?? { width: 0 };
          const { width: marqueeItemsWidth } = firstEntry.boundingClientRect;
          const isHorizontalResize = this._marqueeWidth !== marqueeWidth;
          this._marqueeWidth = marqueeWidth;
          setTimeout(() => {
            resolve({
              numberOfCopies: marqueeItemsWidth === 0 ? 1 : Math.ceil(marqueeWidth / marqueeItemsWidth),
              isHorizontalResize,
            });
          }, 0);
        },
        { root: this }
      );
      intersectionObserver.observe(marqueeItems[0]);
    });
  }

  _calculateSpeed(numberOfCopies) {
    const speedFactor = Number(this.getAttribute('data-speed-factor')) || 25;
    const speed = Math.sqrt(numberOfCopies) * speedFactor;
    return speed;
  }

  _restartAnimation() {
    const animations = this.refs.wrapper.getAnimations();
    requestAnimationFrame(() => {
      for (const animation of animations) {
        animation.currentTime = 0;
      }
    });
  }

  _duplicateContent() {
    this.clonedContent?.remove();
    const clone = this.refs.content.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('ref');
    this.refs.wrapper.appendChild(clone);
  }

  _addRepeatedItems(numberOfCopies) {
    const { content, marqueeItems } = this.refs;
    if (!marqueeItems[0]) return;
    for (let i = 0; i < numberOfCopies - 1; i++) {
      const clone = marqueeItems[0].cloneNode(true);
      content.appendChild(clone);
    }
  }

  _removeRepeatedItems(numberOfCopies) {
    const { content } = this.refs;
    const children = Array.from(content.children);
    const itemsToRemove = Math.min(numberOfCopies, children.length - 1);
    for (let i = 0; i < itemsToRemove; i++) {
      content.lastElementChild?.remove();
    }
  }

  async _handleResize() {
    const { marqueeItems } = this.refs;
    const { numberOfCopies: newNumberOfCopies, isHorizontalResize } = await this._queryNumberOfCopies();
    if (!isHorizontalResize) return;
    const currentNumberOfCopies = marqueeItems.length;
    const speed = this._calculateSpeed(newNumberOfCopies);
    if (newNumberOfCopies > currentNumberOfCopies) {
      this._addRepeatedItems(newNumberOfCopies - currentNumberOfCopies);
    } else if (newNumberOfCopies < currentNumberOfCopies) {
      this._removeRepeatedItems(currentNumberOfCopies - newNumberOfCopies);
    }
    this._duplicateContent();
    this._setSpeed(speed);
    this._restartAnimation();
  }

  _slowDown() {
    if (this._animation) return;
    const animation = this.refs.wrapper.getAnimations()[0];
    if (!animation) return;
    this._animation = animateValue({
      ...ANIMATION_OPTIONS,
      from: 1,
      to: 0,
      onUpdate: (value) => animation.updatePlaybackRate(value),
      onComplete: () => {
        this._animation = null;
      },
    });
  }

  _speedUp() {
    this._slowDown.cancel();
    const animation = this.refs.wrapper.getAnimations()[0];
    if (!animation || animation.playbackRate === 1) return;
    const from = this._animation?.current ?? 0;
    this._animation?.cancel();
    this._animation = animateValue({
      ...ANIMATION_OPTIONS,
      from,
      to: 1,
      onUpdate: (value) => animation.updatePlaybackRate(value),
      onComplete: () => {
        this._animation = null;
      },
    });
  }
}

if (!customElements.get('marquee-component')) {
  customElements.define('marquee-component', MarqueeComponent);
}