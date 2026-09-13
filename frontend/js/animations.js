// تأثيرات السكرول: إظهار العناصر تدريجياً + تفعيل نقطة القسم الحالي في النافيجيشن الجانبي + تلوين رابط القسم الحالي في النافبار

document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.side-nav-item');
  const navLinks = document.querySelectorAll('#nav-links a[href]');

  // === Scroll spy: تفعيل النقطة الصحيحة في side-nav + الرابط الصحيح في النافبار حسب القسم المعروض ===
  if (sections.length && (navItems.length || navLinks.length)) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');

            navItems.forEach(function (item) {
              item.classList.toggle('active', item.getAttribute('data-section') === id);
            });

            // بنقارن بآخر جزء من الـ href عشان يشتغل سواء الرابط "#home" أو "index.html#home"
            navLinks.forEach(function (link) {
              const href = link.getAttribute('href') || '';
              const hrefId = href.split('#')[1];
              link.classList.toggle('active', hrefId === id);
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
  const mobileToggle = document.getElementById('nav-toggle-mobile');
  const navLinksContainer = document.getElementById('nav-links');
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', function () {
      navLinksContainer.classList.toggle('mobile-open');
    });

    const navLinkItems = navLinksContainer.querySelectorAll('a');
    navLinkItems.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinksContainer.classList.remove('mobile-open');
      });
    });
  }
});