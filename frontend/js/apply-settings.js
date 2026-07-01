// تطبيق بيانات الإعدادات العامة (الإيميل، التليفون، الموقع، الروابط، الصورة، CV)
// على أي عنصر في الصفحة عنده data-settings-field المناسب
// كده الأدمن يقدر يغير البيانات دي بدون لمس الكود

async function applySettings() {
  const settings = await fetchSettings();
  if (!settings) return;

  // النصوص: إيميل، تليفون، موقع
  document.querySelectorAll('[data-settings-field="email"]').forEach((el) => {
    if (el.tagName === 'A') {
      // الرابط فيه أيقونة جواه، فنحدث الـ href بس مش الـ textContent
      el.href = `mailto:${settings.email}`;
    } else {
      el.textContent = settings.email;
    }
  });

  document.querySelectorAll('[data-settings-field="phone"]').forEach((el) => {
    el.textContent = settings.phone;
  });

  document.querySelectorAll('[data-settings-field="location"]').forEach((el) => {
    el.textContent = settings.location;
  });

  // روابط التواصل الاجتماعي
  const links = settings.socialLinks || {};
  applySocialLink('github', links.github);
  applySocialLink('linkedin', links.linkedin);
  applySocialLink('whatsapp', links.whatsapp);
  applySocialLink('instagram', links.instagram);

  // الصورة الشخصية - لو مرفوعة من لوحة الأدمن، تظهر بدل الـ placeholder
  // لو مش مرفوعة، نعرض رسالة واضحة بدل ما تفضل الصفحة على حالة "جارِ التحميل"
  const photoEl = document.getElementById('hero-photo');
  const placeholderEl = document.getElementById('hero-photo-placeholder');

  if (settings.profileImage && photoEl) {
    photoEl.src = buildImageUrl(settings.profileImage);
    photoEl.style.display = 'block';
    if (placeholderEl) placeholderEl.style.display = 'none';
  } else if (placeholderEl) {
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    placeholderEl.textContent =
      currentLang === 'ar' ? 'رفعي صورتك من لوحة الأدمن' : 'Upload your photo from the admin panel';
    placeholderEl.style.display = 'flex';
  }

  // رابط تحميل السيرة الذاتية
  if (settings.cvFile) {
    document.querySelectorAll('[data-settings-field="cv-link"]').forEach((el) => {
      el.href = buildImageUrl(settings.cvFile);
    });
  }
}

function applySocialLink(platform, url) {
  const els = document.querySelectorAll(`[data-social="${platform}"]`);
  els.forEach((el) => {
    if (url) {
      el.href = url;
      el.style.display = '';
    } else {
      // لو الرابط مش متضاف من لوحة الأدمن، نخبي الأيقونة بدل ما تروح لرابط فاضي
      el.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', applySettings);