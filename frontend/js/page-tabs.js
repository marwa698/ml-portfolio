// التبديل بين تاب "المشاريع" وتاب "الشهادات" في صفحة projects.html

document.addEventListener('DOMContentLoaded', function () {
  const tabButtons = document.querySelectorAll('.page-tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  if (!tabButtons.length) return;

  // روابط الهيدر العلوي اللي لازم تتزامن مع التابات
  const navProjectsLink = document.querySelector('.nav-links a[href="projects.html"]');
  const navCertificatesLink = document.querySelector('.nav-links a[href="projects.html#certificates"]');

  function activateTab(target) {
    tabButtons.forEach((b) => b.classList.toggle('active', b.getAttribute('data-tab') === target));
    panels.forEach((panel) => panel.classList.toggle('active', panel.id === target));

    // نحدث شكل الهيدر العلوي حسب التاب المفتوح
    if (navProjectsLink && navCertificatesLink) {
      navProjectsLink.classList.toggle('active', target === 'projects-panel');
      navCertificatesLink.classList.toggle('active', target === 'certificates-panel');
    }

    // نحدث الرابط في شريط العنوان بدون إعادة تحميل الصفحة
    const hash = target === 'certificates-panel' ? '#certificates' : '';
    history.replaceState(null, '', window.location.pathname + hash);
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      activateTab(btn.getAttribute('data-tab'));
    });
  });

  // لو رابط الهيدر اتدوس عليه وهو موجود بالفعل في نفس الصفحة (projects.html#certificates)
  if (navCertificatesLink) {
    navCertificatesLink.addEventListener('click', function (e) {
      e.preventDefault();
      activateTab('certificates-panel');
    });
  }
  if (navProjectsLink) {
    navProjectsLink.addEventListener('click', function (e) {
      e.preventDefault();
      activateTab('projects-panel');
    });
  }

  // لو الرابط فيه #certificates وقت فتح الصفحة لأول مرة، نفتح تاب الشهادات تلقائياً
  if (window.location.hash === '#certificates') {
    activateTab('certificates-panel');
  }
});