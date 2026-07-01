// تأثيرات السكرول: إظهار العناصر تدريجياً + تفعيل نقطة القسم الحالي في النافيجيشن الجانبي

document.addEventListener('DOMContentLoaded', function () {
  // === Scroll spy: تفعيل النقطة الصحيحة في side-nav حسب القسم المعروض ===
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.side-nav-item');

  if (sections.length && navItems.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach(function (item) {
              item.classList.toggle('active', item.getAttribute('data-section') === id);
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // === نقر على نقطة النافيجيشن الجانبي ينقل للقسم المطلوب ===
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const targetId = item.getAttribute('data-section');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // === ظهور تدريجي للعناصر عند السكرول ===
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // === زرار الرجوع لأعلى الصفحة ===
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === فتح/قفل قائمة الموبايل ===
  // === فتح/قفل قائمة الموبايل ===
const mobileToggle = document.getElementById('nav-toggle-mobile');
const navLinks = document.getElementById('nav-links');
if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', function () {
    navLinks.classList.toggle('mobile-open');
  });

  // نقفل القائمة تلقائيًا لما المستخدم يدوس على أي رابط جواها
  const navLinkItems = navLinks.querySelectorAll('a');
  navLinkItems.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('mobile-open');
    });
  });
}
});