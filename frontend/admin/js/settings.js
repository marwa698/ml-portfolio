requireAdminAuth();
renderAdminSidebar('settings');

// خريطة بين اسم التصنيف الحقيقي (زي ما بيتخزن في قاعدة البيانات)
// وبين الـ id بتاع حقول الفورم (مش ممكن نستخدم مسافة في id)
const SKILL_CATEGORY_FIELD_MAP = {
  'Technical': 'technical',
  'Soft Skills': 'softskills',
  'Tools': 'tools',
  'Languages': 'languages',
};

// تحميل الإعدادات الحالية وملء الحقول
async function loadSettings() {
  try {
    const settings = await fetchSettings();
    if (!settings) return;

    // الصورة الشخصية
    const preview = document.getElementById('settings-profile-preview');
    if (settings.profileImage) {
      preview.src = buildImageUrl(settings.profileImage);
    }

    // السيرة الذاتية
    const cvDiv = document.getElementById('settings-cv-current');
    if (settings.cvFile) {
      cvDiv.innerHTML = `<a href="${buildImageUrl(settings.cvFile)}" target="_blank" class="cv-current-link"><i class="fa-solid fa-file-pdf"></i> View current CV</a>`;
    } else {
      cvDiv.innerHTML = '<p style="font-size:13px;color:var(--text-muted);">No CV uploaded yet.</p>';
    }

    // بيانات التواصل
    document.getElementById('settings-email').value = settings.email || '';
    document.getElementById('settings-phone').value = settings.phone || '';
    document.getElementById('settings-location').value = settings.location || '';

    // الروابط
    const links = settings.socialLinks || {};
    document.getElementById('settings-github').value = links.github || '';
    document.getElementById('settings-linkedin').value = links.linkedin || '';
    document.getElementById('settings-whatsapp').value = links.whatsapp || '';
    document.getElementById('settings-instagram').value = links.instagram || '';

    // أوصاف تابات المهارات (بتيجي من الباك إند كـ object عادي، الـ Map بتتحول تلقائي في الـ JSON)
    const skillDescs = settings.skillCategoryDescriptions || {};
    Object.entries(SKILL_CATEGORY_FIELD_MAP).forEach(([category, fieldSlug]) => {
      const entry = skillDescs[category] || {};
      const enInput = document.getElementById(`skilldesc-${fieldSlug}-en`);
      const arInput = document.getElementById(`skilldesc-${fieldSlug}-ar`);
      if (enInput) enInput.value = entry.en || '';
      if (arInput) arInput.value = entry.ar || '';
    });
  } catch (error) {
    showAdminToast('Failed to load settings', 'error');
  }
}

// رفع الصورة الشخصية
document.getElementById('settings-profile-save-btn').addEventListener('click', async function () {
  const file = document.getElementById('settings-profile-input').files[0];
  if (!file) {
    showAdminToast('Please select a photo first', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  this.disabled = true;
  this.textContent = 'Uploading...';

  try {
    const result = await adminApiRequest('/settings/profile-image', { method: 'PUT', body: formData });
    document.getElementById('settings-profile-preview').src = buildImageUrl(result.profileImage);
    showAdminToast('Profile photo updated — refresh the portfolio to see the change');
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    this.disabled = false;
    this.innerHTML = '<i class="fa-solid fa-upload"></i> Upload photo';
  }
});

// رفع الـ CV
document.getElementById('settings-cv-save-btn').addEventListener('click', async function () {
  const file = document.getElementById('settings-cv-input').files[0];
  if (!file) {
    showAdminToast('Please select a PDF file first', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('cv', file);

  this.disabled = true;
  this.textContent = 'Uploading...';

  try {
    const result = await adminApiRequest('/settings/cv', { method: 'PUT', body: formData });
    const cvDiv = document.getElementById('settings-cv-current');
    cvDiv.innerHTML = `<a href="${buildImageUrl(result.cvFile)}" target="_blank" class="cv-current-link"><i class="fa-solid fa-file-pdf"></i> View current CV</a>`;
    showAdminToast('CV uploaded successfully');
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    this.disabled = false;
    this.innerHTML = '<i class="fa-solid fa-upload"></i> Upload CV';
  }
});

// حفظ بيانات التواصل
document.getElementById('settings-contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('settings-contact-save-btn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    await adminApiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify({
        email: document.getElementById('settings-email').value,
        phone: document.getElementById('settings-phone').value,
        location: document.getElementById('settings-location').value,
      }),
    });
    showAdminToast('Contact info saved');
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save contact info';
  }
});

// حفظ الروابط
document.getElementById('settings-social-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('settings-social-save-btn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    await adminApiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify({
        github: document.getElementById('settings-github').value,
        linkedin: document.getElementById('settings-linkedin').value,
        whatsapp: document.getElementById('settings-whatsapp').value,
        instagram: document.getElementById('settings-instagram').value,
      }),
    });
    showAdminToast('Social links saved');
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save social links';
  }
});

// حفظ أوصاف تابات المهارات
document.getElementById('settings-skills-desc-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('settings-skills-desc-save-btn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  const skillCategoryDescriptions = {};
  Object.entries(SKILL_CATEGORY_FIELD_MAP).forEach(([category, fieldSlug]) => {
    skillCategoryDescriptions[category] = {
      en: document.getElementById(`skilldesc-${fieldSlug}-en`).value,
      ar: document.getElementById(`skilldesc-${fieldSlug}-ar`).value,
    };
  });

  try {
    await adminApiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify({ skillCategoryDescriptions }),
    });
    showAdminToast('Skills descriptions saved — refresh the portfolio to see the change');
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save skills descriptions';
  }
});

loadSettings();