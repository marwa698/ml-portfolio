// بناء الشريط الجانبي (sidebar) المشترك في كل صفحات لوحة الأدمن
// كل صفحة لازم يكون فيها <div id="admin-sidebar"></div> وتستدعي الدالة دي

function renderAdminSidebar(activePage) {
  const container = document.getElementById('admin-sidebar');
  if (!container) return;

  const navItems = [
    { id: 'dashboard', href: 'dashboard.html', icon: 'fa-gauge', label: 'Dashboard' },
    { id: 'projects', href: 'manage-projects.html', icon: 'fa-diagram-project', label: 'Projects' },
    { id: 'certificates', href: 'manage-certificates.html', icon: 'fa-certificate', label: 'Certificates' },
    { id: 'skills', href: 'manage-skills.html', icon: 'fa-layer-group', label: 'Skills' },
    { id: 'messages', href: 'manage-messages.html', icon: 'fa-envelope', label: 'Messages' },
    { id: 'settings', href: 'settings.html', icon: 'fa-gear', label: 'Settings' },
  ];

  container.innerHTML = `
    <div class="admin-logo-row">
      <span class="admin-logo-text">MY<span>.</span></span>
      <span class="admin-logo-badge">Admin</span>
    </div>
    <nav class="admin-nav">
      ${navItems
        .map(
          (item) => `
        <a href="${item.href}" class="admin-nav-link ${item.id === activePage ? 'active' : ''}">
          <i class="fa-solid ${item.icon}"></i>
          <span>${item.label}</span>
          ${item.id === 'messages' ? '<span class="admin-nav-badge" id="sidebar-unread-badge" style="display:none">0</span>' : ''}
        </a>
      `
        )
        .join('')}
    </nav>
    <div class="admin-logout-row">
      <button class="btn btn-outline" id="admin-logout-btn" style="width: 100%;">
        <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
      </button>
    </div>
  `;

  // نحدث عدد الرسائل غير المقروءة في الـ badge
  updateUnreadBadge();
}

async function updateUnreadBadge() {
  try {
    const messages = await adminApiRequest('/messages');
    const unreadCount = messages.filter((m) => !m.isRead).length;
    const badge = document.getElementById('sidebar-unread-badge');
    if (badge && unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'inline-flex';
    }
  } catch (error) {
    // لو فشل الطلب (مثلاً التوكن باظ)، الدالة adminApiRequest بنفسها هتتعامل مع التحويل لصفحة اللوجين
  }
}