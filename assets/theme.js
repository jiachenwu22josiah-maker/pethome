// Petal & Pine Theme JS

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCartDrawer();
  initMobileNav();
  initProductGallery();
  initProductTabs();
  initFilterTags();
  initQuantityControls();
});

// ===== Header scroll effect =====
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ===== Cart Drawer =====
function initCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('overlay');
  const openBtns = document.querySelectorAll('[data-cart-open]');
  const closeBtn = document.getElementById('cart-close');

  if (!drawer) return;

  function openCart() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openCart));
  closeBtn?.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
}

// ===== Mobile Nav =====
function initMobileNav() {
  const nav = document.getElementById('mobile-nav');
  const overlay = document.getElementById('overlay');
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-nav-close');

  if (!nav) return;

  function openNav() {
    nav.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    nav.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openNav);
  closeBtn?.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);
}

// ===== Product Gallery =====
function initProductGallery() {
  const thumbs = document.querySelectorAll('.thumb');
  const mainImg = document.getElementById('main-product-img');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) {
        const src = thumb.querySelector('img')?.src;
        if (src) mainImg.src = src;
      }
    });
  });
}

// ===== Product Tabs =====
function initProductTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + target)?.classList.add('active');
    });
  });
}

// ===== Filter Tags =====
function initFilterTags() {
  const tags = document.querySelectorAll('.filter-tag');
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
    });
  });
}

// ===== Quantity Controls =====
function initQuantityControls() {
  document.querySelectorAll('.qty-control, .qty-large').forEach(control => {
    const minus = control.querySelector('[data-qty-minus]');
    const plus = control.querySelector('[data-qty-plus]');
    const input = control.querySelector('.qty-input');

    minus?.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      if (val > 1) input.value = val - 1;
    });
    plus?.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      input.value = val + 1;
    });
  });
}

// ===== Variant Selection =====
document.querySelectorAll('.variant-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.variant-options');
    group?.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ===== Newsletter Form =====
document.querySelector('.newsletter-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const btn = e.target.querySelector('.btn');
  if (input?.value) {
    btn.textContent = 'Thank you!';
    btn.disabled = true;
    input.value = '';
  }
});
