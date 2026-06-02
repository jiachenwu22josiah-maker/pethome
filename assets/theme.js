// Petal & Pine Theme JS

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCartDrawer();
  initEmailPopup();
  initReviewForm();
  initStarPicker();
  initPhotoUpload();
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

// ===== Email Popup =====
function initEmailPopup() {
  const popup = document.getElementById('email-popup');
  const overlay = document.getElementById('popup-overlay');
  if (!popup) return;

  // Show after 4 seconds, only once per session
  if (!sessionStorage.getItem('pp_popup_seen')) {
    setTimeout(() => {
      popup.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, 4000);
  }

  document.getElementById('popup-close')?.addEventListener('click', closePopup);
  overlay.addEventListener('click', closePopup);
}

function closePopup() {
  const popup = document.getElementById('email-popup');
  const overlay = document.getElementById('popup-overlay');
  popup?.classList.remove('active');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
  sessionStorage.setItem('pp_popup_seen', '1');
}

function claimOffer(e) {
  e.preventDefault();
  const email = document.getElementById('popup-email').value;
  if (!email) return;
  document.getElementById('popup-form').style.display = 'none';
  document.getElementById('popup-coupon').style.display = 'block';
  sessionStorage.setItem('pp_popup_seen', '1');
  // Here you'd send email to your mailing list via API
}

function copyCoupon() {
  const code = document.getElementById('coupon-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    document.getElementById('coupon-code').textContent = 'Copied! ✓';
    setTimeout(() => {
      document.getElementById('coupon-code').textContent = code;
    }, 2000);
  });
}

// ===== Review Form =====
function initReviewForm() {
  const btn = document.getElementById('write-review-btn');
  const wrap = document.getElementById('review-form-wrap');
  btn?.addEventListener('click', () => {
    wrap.classList.add('open');
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function closeReviewForm() {
  document.getElementById('review-form-wrap')?.classList.remove('open');
}

function submitReview(e) {
  e.preventDefault();
  const rating = document.getElementById('rating-input').value;
  if (rating === '0') {
    alert('Please select a star rating.');
    return;
  }
  document.getElementById('review-form').style.display = 'none';
  document.getElementById('review-success').style.display = 'block';
}

// ===== Star Picker =====
function initStarPicker() {
  const stars = document.querySelectorAll('.star-opt');
  const input = document.getElementById('rating-input');
  if (!stars.length) return;

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.val);
      input.value = val;
      stars.forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.val) <= val);
      });
    });
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.dataset.val);
      stars.forEach(s => {
        s.style.color = parseInt(s.dataset.val) <= val ? '#F4C23B' : '';
      });
    });
  });
  document.getElementById('star-picker')?.addEventListener('mouseleave', () => {
    const val = parseInt(input.value);
    stars.forEach(s => {
      s.style.color = parseInt(s.dataset.val) <= val ? '#F4C23B' : '';
    });
  });
}

// ===== Photo Upload =====
function initPhotoUpload() {
  const input = document.getElementById('photo-input');
  const previews = document.getElementById('photo-previews');
  if (!input) return;

  input.addEventListener('change', () => {
    const files = Array.from(input.files).slice(0, 3);
    previews.innerHTML = '';
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const div = document.createElement('div');
        div.className = 'photo-preview-item';
        div.innerHTML = `<img src="${e.target.result}" alt="preview">
          <div class="photo-preview-remove" onclick="this.parentNode.remove()">✕</div>`;
        previews.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
  });
}

// ===== Helpful Button =====
function markHelpful(btn) {
  if (btn.classList.contains('active')) return;
  btn.classList.add('active');
  const match = btn.textContent.match(/\((\d+)\)/);
  if (match) {
    btn.textContent = btn.textContent.replace(`(${match[1]})`, `(${parseInt(match[1]) + 1})`);
  }
}
