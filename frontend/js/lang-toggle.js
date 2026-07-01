// إدارة تبديل اللغة بين العربي والإنجليزي
// كل النصوص القابلة للترجمة لازم تتكتب كـ data-en="English text" data-ar="النص العربي"
// والـ JS بيبدل بينهم ويغير اتجاه الصفحة (LTR/RTL) تلقائياً

(function () {
  const STORAGE_KEY = 'portfolio-lang';

  function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // كل عنصر فيه data-en و data-ar بيتبدل محتواه حسب اللغة المختارة
    document.querySelectorAll('[data-en][data-ar]').forEach(function (el) {
      const text = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      // لو العنصر عنده attribute اسمه data-html نسمح بإدخال HTML (مثلاً عشان الكلمات المتدرجة بالألوان)
      if (el.hasAttribute('data-html')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // عناصر الـ placeholder في الفورمات
    document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]').forEach(function (el) {
      el.setAttribute('placeholder', lang === 'ar' ? el.getAttribute('data-placeholder-ar') : el.getAttribute('data-placeholder-en'));
    });

    updateLangButton(lang);
  }

  function updateLangButton(lang) {
    const btn = document.getElementById('lang-toggle-btn');
    if (!btn) return;
    btn.textContent = lang === 'ar' ? 'EN' : 'AR';
  }

  function toggleLanguage() {
    const current = document.documentElement.getAttribute('lang') || 'en';
    const next = current === 'ar' ? 'en' : 'ar';
    localStorage.setItem(STORAGE_KEY, next);
    applyLanguage(next);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const saved = localStorage.getItem(STORAGE_KEY) || 'en';
    applyLanguage(saved);

    const btn = document.getElementById('lang-toggle-btn');
    if (btn) {
      btn.addEventListener('click', toggleLanguage);
    }
  });
})();