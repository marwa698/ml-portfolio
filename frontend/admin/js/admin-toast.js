// عرض رسالة تنبيه منبثقة (toast) أسفل الشاشة - تُستخدم بعد كل عملية حفظ أو حذف

function showAdminToast(message, type = 'success') {
  // نحذف أي toast قديم لسه موجود
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  // نخليه يظهر بعد فريم واحد عشان الـ transition يشتغل
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}