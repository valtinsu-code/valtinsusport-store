/** Product carousel using the globally loaded Swiper bundle. */
(() => {
  if (customElements.get('product-carousel')) return;

  class ProductCarousel extends HTMLElement {
    connectedCallback() {
      if (this.swiper) return;
      if (!window.Swiper) {
        console.error('[ProductCarousel] Swiper is not loaded');
        return;
      }
      if (!this.container) {
        const slides = Array.from(this.children);
        this.slideCount = slides.length;
        if (!this.slideCount) return;
        this.container = document.createElement('div');
        this.container.className = 'product-carousel-swiper swiper';
        const wrapper = document.createElement('div');
        wrapper.className = 'swiper-wrapper';
        slides.forEach((slide) => {
          slide.classList.add('swiper-slide');
          wrapper.appendChild(slide);
        });
        this.container.appendChild(wrapper);
        this.appendChild(this.container);
        ['prev', 'next'].forEach((direction) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `slide-btn ${direction}`;
          button.setAttribute('aria-label', direction === 'prev' ? 'Previous products' : 'Next products');
          const keepMenuOpen = (event) => {
            event.preventDefault();
            event.stopPropagation();
          };
          button.addEventListener('pointerdown', keepMenuOpen);
          button.addEventListener('mousedown', keepMenuOpen);
          button.addEventListener('click', keepMenuOpen);
          button.innerHTML = direction === 'prev'
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true"><path d="M0.75 6.75L6.75 12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2.50391 4.99219L6.74655 0.749547" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 14" fill="none" aria-hidden="true"><path d="M1.59071 13.589L1.53409 13.6401C1.2395 13.8806 0.804746 13.8637 0.530054 13.589C0.255361 13.3143 0.238401 12.8795 0.478954 12.5849L0.530054 12.5283L6.5301 6.52826C6.823 6.23537 7.29787 6.23537 7.59076 6.52826C7.88366 6.82116 7.88366 7.29603 7.59076 7.58892L1.59071 13.589Z" fill="currentColor"/><path d="M0.539529 1.59031L0.487739 1.533C0.247784 1.23842 0.265054 0.804125 0.539529 0.52965C0.814004 0.255175 1.2483 0.237905 1.54288 0.47786L1.60019 0.52965L5.84283 4.77229C6.13572 5.06518 6.13572 5.54006 5.84283 5.83295C5.54994 6.12584 5.07506 6.12584 4.78217 5.83295L0.539529 1.59031Z" fill="currentColor"/></svg>';
          this.container.appendChild(button);
        });
      }
      const cardNum = Number(this.dataset.card_num) || 1;
      const compactNum = Number(this.dataset.compact_card_num) || cardNum;
      this.swiper = new window.Swiper(this.container, {
        slidesPerView: Math.min(compactNum, this.slideCount),
        breakpoints: { 1441: { slidesPerView: Math.min(cardNum, this.slideCount) } },
        spaceBetween: 12,
        loop: this.dataset.is_loop === 'true' && this.slideCount > cardNum,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        autoplay: this.dataset.is_auto === 'true' ? {
          delay: Number(this.dataset.interval) || 3000,
          disableOnInteraction: false
        } : false,
        navigation: {
          prevEl: this.container.querySelector('.prev'),
          nextEl: this.container.querySelector('.next')
        }
      });
      this.details = this.closest('details');
      this.addEventListener('mouseenter', () => {
        if (this.details) {
          window.clearTimeout(this.details.headerHoverCloseTimer);
          window.clearTimeout(this.details.headerHoverRemoveOpenTimer);
          this.details.classList.remove('header-super-menu--closing');
          this.details.setAttribute('open', '');
        }
      });
      this.onToggle = () => {
        if (this.details.open) {
          cancelAnimationFrame(this.updateFrame);
          this.updateFrame = requestAnimationFrame(() => this.swiper?.update());
        }
      };
      this.details?.addEventListener('toggle', this.onToggle);
    }

    disconnectedCallback() {
      this.details?.removeEventListener('toggle', this.onToggle);
      cancelAnimationFrame(this.updateFrame);
      this.swiper?.destroy(true, true);
      this.swiper = null;
    }
  }
  customElements.define('product-carousel', ProductCarousel);
})();
