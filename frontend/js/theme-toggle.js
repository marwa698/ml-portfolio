// إدارة تبديل الوضع الليلي/النهاري (Dark / Light mode)
// التفضيل بيتحفظ في localStorage عشان يفضل ثابت بعد إعادة فتح الموقع

(function () {
  const STORAGE_KEY = 'portfolio-theme';

  // نطبق الثيم المحفوظ فوراً قبل ما الصفحة تترسم بالكامل (يمنع الفلاش)
  function applyStoredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const theme = saved || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    return theme;
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    updateToggleIcon(next);
  }

  function updateToggleIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    // لو إحنا في light mode، نعرض 🌙 (يعني دوسي عشان تحولي لداكن)
    // لو إحنا في dark mode، نعرض ☀️ (يعني دوسي عشان تحولي لفاتح)
    btn.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  document.addEventListener('DOMContentLoaded', function () {
    const theme = applyStoredTheme();
    updateToggleIcon(theme);

    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  });

  // نطبق الثيم فوراً (قبل DOMContentLoaded) عشان نمنع وميض اللون الغلط
  applyStoredTheme();
})();