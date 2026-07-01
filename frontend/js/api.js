// ملف مركزي لكل الاتصالات بالباك إند
// لما نرفع المشروع على Render، نغير API_BASE_URL بس في السطر ده

const API_BASE_URL = 'https://ml-portfolio-alpha.vercel.app/api';
// دالة مساعدة عامة لطلبات GET
async function apiGet(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`فشل الطلب: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`خطأ في جلب ${endpoint}:`, error);
    return null;
  }
}

// دالة مساعدة عامة لطلبات POST (بيانات JSON، بدون توكن)
async function apiPost(endpoint, data) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'فشل الطلب');
    return { success: true, data: json };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// === دوال خاصة بكل موديل ===

async function fetchProjects() {
  return (await apiGet('/projects')) || [];
}

async function fetchProjectById(id) {
  return await apiGet(`/projects/${id}`);
}

async function fetchCertificates() {
  return (await apiGet('/certificates')) || [];
}

async function fetchSkills() {
  return (await apiGet('/skills')) || [];
}

async function fetchSettings() {
  return await apiGet('/settings');
}

async function sendContactMessage(formData) {
  return await apiPost('/messages', formData);
}

// دالة لبناء رابط صورة كاملة من اسم الملف المخزن في قاعدة البيانات
function buildImageUrl(filename) {
  if (!filename) return '';
  const base = API_BASE_URL.replace('/api', '');
  return `${base}/uploads/${filename}`;
}