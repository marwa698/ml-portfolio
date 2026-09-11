// عرض قسم Achievements (كروت أيقونة + عنوان + مصدر + وصف)

async function renderAchievements() {
  const container = document.getElementById('achievements-grid');
  if (!container) return;

  const items = await fetchAchievements();

  if (!items.length) {
    container.innerHTML = `<p class="empty-state" data-en="No achievements added yet" data-ar="لم تتم إضافة إنجازات بعد">No achievements added yet</p>`;
    return;
  }

  container.innerHTML = items.map(renderAchievementCard).join('');

  const lang = document.documentElement.getAttribute('lang') || localStorage.getItem('portfolio-lang') || 'en';
  container.querySelectorAll('[data-en][data-ar]').forEach((el) => {
    el.textContent = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
  });
}

function renderAchievementCard(item) {
  const logoUrl = item.logoUrl ? buildImageUrl(item.logoUrl) : '';
  const esc = (s) => (s || '').replace(/"/g, '&quot;');

  const cardInner = `
    <div class="ach-icon">
      ${logoUrl ? `<img src="${logoUrl}" alt="${item.titleEn}" />` : '<i class="fa-solid fa-trophy"></i>'}
    </div>
    <h3 class="ach-title" data-en="${esc(item.titleEn)}" data-ar="${esc(item.titleAr)}">${item.titleEn}</h3>
    <div class="ach-subtitle" data-en="${esc(item.subtitleEn)}" data-ar="${esc(item.subtitleAr)}">${item.subtitleEn}</div>
    <p class="ach-desc" data-en="${esc(item.descriptionEn)}" data-ar="${esc(item.descriptionAr)}">${item.descriptionEn}</p>
  `;

  return item.link
    ? `<a href="${item.link}" target="_blank" rel="noopener" class="ach-card">${cardInner}</a>`
    : `<div class="ach-card">${cardInner}</div>`;
}

document.addEventListener('DOMContentLoaded', renderAchievements);