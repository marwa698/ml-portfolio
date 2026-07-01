// إدارة تسجيل دخول الأدمن وحماية الصفحات
// التوكن بيتحفظ في localStorage باسم 'admin_token'

const ADMIN_TOKEN_KEY = 'admin_token';

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// أي صفحة أدمن (غير صفحة اللوجين نفسها) لازم تستدعي الدالة دي فوراً
// لو مفيش توكن، يتم تحويل المستخدم لصفحة تسجيل الدخول مباشرة
function requireAdminAuth() {
  const token = getAdminToken();
  if (!token) {
    window.location.href = 'login.html';
    return null;
  }
  return token;
}

// طلبات API محمية - بترفق التوكن تلقائياً في الهيدر
async function adminApiRequest(endpoint, options = {}) {
  const token = getAdminToken();

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  // لو الـ body مش FormData (يعني JSON عادي)، نضيف Content-Type
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  // لو التوكن باظ أو انتهت صلاحيته، نرجع المستخدم لصفحة تسجيل الدخول
  if (res.status === 401) {
    clearAdminToken();
    window.location.href = 'login.html';
    throw new Error('انتهت صلاحية الجلسة، يجب تسجيل الدخول مرة أخرى');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'حصل خطأ في الطلب');
  }

  return data;
}

// تسجيل الخروج: نمسح التوكن ونرجع لصفحة اللوجين
function adminLogout() {
  clearAdminToken();
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', adminLogout);
  }
});