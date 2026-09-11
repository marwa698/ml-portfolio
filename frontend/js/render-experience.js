// عرض قسم Work Experience (تايم لاين + كروت مختصرة + Modal بالتفاصيل الكاملة)
// كل حقل نصي بيتحط في العنصر كـ data-en/data-ar عشان lang-toggle.js يقدر يبدله زي باقي الموقع

const experienceEmploymentLabels = {
  internship: { en: 'Internship', ar: 'تدريب' },
  training: { en: 'Training Program', ar: 'برنامج تدريبي' },
  job: { en: 'Job', ar: 'وظيفة' },
  freelance: { en: 'Freelance', ar: 'عمل حر' },
};

const experienceLocationLabels = {
  remote: { en: 'Remote', ar: 'عن بعد' },
  onsite: { en: 'Onsite', ar: 'حضوري' },
  online: { en: 'Online', ar: 'أونلاين' },
  hybrid: { en: 'Hybrid', ar: 'هجين' },
};

let experienceCache = [];

function getCurrentLang() {
  return document.documentElement.getAttribute('lang') || localStorage.getItem('portfolio-lang') || 'en';
}

async function renderExperience() {
  const container = document.getElementById('experience-timeline');
  if (!container) return;

  experienceCache = await fetchExperience();

  if (!experienceCache.length) {
    container.innerHTML = `<p class="empty-state" data-en="No experience entries added yet" data-ar="لم تتم إضافة أي خبرات بعد">No experience entries added yet</p>`;
    return;
  }

  container.innerHTML = experienceCache.map(renderExperienceItem).join('');

  container.querySelectorAll('.exp-view-details-btn').forEach((btn) => {
    btn.addEventListener('click', () => openExperienceModal(btn.dataset.id));
  });

  // تطبيق اللغة الحالية على العناصر اللي اتضافت لتوها (لو الصفحة اتحملت باللغة العربية أصلاً)
  applyCurrentLangTo(container);
}

function renderExperienceItem(item) {
  const logoUrl = item.logoUrl ? buildImageUrl(item.logoUrl) : '';
  const empLabel = experienceEmploymentLabels[item.employmentType] || { en: item.employmentType, ar: item.employmentType };
  const locLabel = experienceLocationLabels[item.locationType] || { en: item.locationType, ar: item.locationType };
  const techPreview = (item.technologies || []).slice(0, 4);

  return `
    <div class="exp-item">
      <div class="exp-period">
        <div class="exp-period-year" data-en="${escapeAttr(item.periodEn)}" data-ar="${escapeAttr(item.periodAr)}">${item.periodEn}</div>
        ${
          item.statusEn
            ? `<div class="exp-period-status" data-en="${escapeAttr(item.statusEn)}" data-ar="${escapeAttr(item.statusAr)}">${item.statusEn}</div>`
            : ''
        }
      </div>
      <div class="exp-dot-col">
        <div class="exp-dot"></div>
        <div class="exp-line"></div>
      </div>
      <div class="exp-card">
        <div class="exp-logo">
          ${logoUrl ? `<img src="${logoUrl}" alt="${item.organizationEn}" />` : '<i class="fa-solid fa-briefcase"></i>'}
        </div>
        <div class="exp-content">
          <div class="exp-header-row">
            <div>
              <h3 class="exp-title" data-en="${escapeAttr(item.titleEn)}" data-ar="${escapeAttr(item.titleAr)}">${item.titleEn}</h3>
              <div class="exp-org" data-en="${escapeAttr(item.organizationEn)}" data-ar="${escapeAttr(item.organizationAr)}">${item.organizationEn}</div>
            </div>
            ${
              item.link
                ? `<a href="${item.link}" target="_blank" rel="noopener" class="exp-link-btn" aria-label="Open link"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
                : ''
            }
          </div>

          <div class="exp-meta-row">
            <span class="exp-badge" data-en="${empLabel.en}" data-ar="${empLabel.ar}">${empLabel.en}</span>
            <span class="exp-badge exp-badge-outline"><i class="fa-solid fa-location-dot"></i> <span data-en="${locLabel.en}" data-ar="${locLabel.ar}">${locLabel.en}</span></span>
          </div>

          ${item.highlightEn ? `<p class="exp-highlight" data-en="${escapeAttr(item.highlightEn)}" data-ar="${escapeAttr(item.highlightAr)}">${item.highlightEn}</p>` : ''}

          ${
            techPreview.length
              ? `<div class="exp-tech-row">
                  ${techPreview.map((t) => `<span class="exp-tech-tag">${t}</span>`).join('')}
                  ${item.technologies.length > techPreview.length ? `<span class="exp-tech-tag exp-tech-more">+${item.technologies.length - techPreview.length}</span>` : ''}
                </div>`
              : ''
          }

          <button type="button" class="exp-view-details-btn" data-id="${item._id}">
            <span data-en="View Details" data-ar="عرض التفاصيل">View Details</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============ Modal ============

function openExperienceModal(id) {
  const item = experienceCache.find((e) => e._id === id);
  if (!item) return;

  const modal = document.getElementById('experience-modal');
  const empLabel = experienceEmploymentLabels[item.employmentType] || { en: item.employmentType, ar: item.employmentType };
  const locLabel = experienceLocationLabels[item.locationType] || { en: item.locationType, ar: item.locationType };
  const logoUrl = item.logoUrl ? buildImageUrl(item.logoUrl) : '';

  document.getElementById('exp-modal-logo').innerHTML = logoUrl
    ? `<img src="${logoUrl}" alt="${item.organizationEn}" />`
    : '<i class="fa-solid fa-briefcase"></i>';

  setBilingual('exp-modal-title', item.titleEn, item.titleAr);
  setBilingual('exp-modal-org', item.organizationEn, item.organizationAr);
  setBilingual('exp-modal-emp-badge', empLabel.en, empLabel.ar);
  setBilingual('exp-modal-loc-badge', locLabel.en, locLabel.ar);
  setBilingual('exp-modal-period', item.periodEn, item.periodAr);
  setBilingual('exp-modal-desc', item.descriptionEn, item.descriptionAr);

  const bulletsList = document.getElementById('exp-modal-bullets');
  bulletsList.innerHTML = (item.bullets || [])
    .map((b) => `<li data-en="${escapeAttr(b.en)}" data-ar="${escapeAttr(b.ar)}">${b.en}</li>`)
    .join('');

  const techWrap = document.getElementById('exp-modal-tech');
  techWrap.innerHTML = (item.technologies || []).map((t) => `<span class="exp-tech-tag">${t}</span>`).join('');

  const linkWrap = document.getElementById('exp-modal-link-wrap');
  const linkEl = document.getElementById('exp-modal-link');
  if (item.link) {
    linkEl.href = item.link;
    linkWrap.style.display = 'inline-flex';
  } else {
    linkWrap.style.display = 'none';
  }

  applyCurrentLangTo(modal);
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeExperienceModal() {
  const modal = document.getElementById('experience-modal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function setBilingual(id, en, ar) {
  const el = document.getElementById(id);
  if (!el) return;
  el.setAttribute('data-en', en);
  el.setAttribute('data-ar', ar);
  el.textContent = getCurrentLang() === 'ar' ? ar : en;
}

// إعادة تطبيق اللغة الحالية على أي عناصر جديدة اتضافت للـ DOM (بعد الفetch)
function applyCurrentLangTo(scopeEl) {
  const lang = getCurrentLang();
  scopeEl.querySelectorAll('[data-en][data-ar]').forEach((el) => {
    el.textContent = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
  });
}

function escapeAttr(str) {
  return (str || '').replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', function () {
  renderExperience();

  const closeBtn = document.getElementById('exp-modal-close');
  const overlay = document.getElementById('experience-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeExperienceModal);
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeExperienceModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeExperienceModal();
  });
});