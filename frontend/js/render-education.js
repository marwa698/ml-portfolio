// عرض قسم Education (التايم لاين) في الصفحة الرئيسية بجلبه من الباك إند
// كل حقل بيتحط كـ data-en/data-ar عشان lang-toggle.js يبدله زي باقي الموقع

const educationTypeLabels = {
  'Undergraduate': { en: 'Undergraduate', ar: 'بكالوريوس' },
  'Online Course': { en: 'Online Course', ar: 'كورس أونلاين' },
  'Professional Training': { en: 'Professional Training', ar: 'تدريب مهني' },
};

async function renderEducation() {
  const container = document.getElementById('education-timeline');
  if (!container) return;

  const items = await fetchEducation();

  if (!items.length) {
    container.innerHTML = `<p class="empty-state" data-en="No education entries added yet" data-ar="لم تتم إضافة بيانات تعليمية بعد">No education entries added yet</p>`;
    return;
  }

  container.innerHTML = items.map(renderEducationItem).join('');

  // تطبيق اللغة الحالية على العناصر اللي اتضافت لتوها (لو الصفحة كانت أصلاً بالعربي)
  const lang = document.documentElement.getAttribute('lang') || localStorage.getItem('portfolio-lang') || 'en';
  container.querySelectorAll('[data-en][data-ar]').forEach((el) => {
    el.textContent = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
  });
}

function esc(str) {
  return (str || '').replace(/"/g, '&quot;');
}

function renderEducationItem(item) {
  const logoUrl = item.logoUrl ? buildImageUrl(item.logoUrl) : '';
  const typeLabel = educationTypeLabels[item.type] || { en: item.type, ar: item.type };

  return `
    <div class="edu-item">
      <div class="edu-period">
        <div class="edu-period-year" data-en="${esc(item.periodEn)}" data-ar="${esc(item.periodAr)}">${item.periodEn}</div>
        ${
          item.statusEn
            ? `<div class="edu-period-status" data-en="${esc(item.statusEn)}" data-ar="${esc(item.statusAr)}">${item.statusEn}</div>`
            : ''
        }
      </div>
      <div class="edu-dot-col">
        <div class="edu-dot"></div>
        <div class="edu-line"></div>
      </div>
      <div class="edu-card">
        <div class="edu-logo">
          ${logoUrl ? `<img src="${logoUrl}" alt="${item.institutionEn}" />` : '<i class="fa-solid fa-graduation-cap"></i>'}
        </div>
        <div class="edu-content">
          <div class="edu-header-row">
            <h3 class="edu-institution" data-en="${esc(item.institutionEn)}" data-ar="${esc(item.institutionAr)}">${item.institutionEn}</h3>
            <div class="edu-side">
              <span class="edu-badge" data-en="${typeLabel.en}" data-ar="${typeLabel.ar}">${typeLabel.en}</span>
              ${
                item.link
                  ? `<a href="${item.link}" target="_blank" rel="noopener" class="edu-link-btn" aria-label="Open link"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
                  : ''
              }
            </div>
          </div>
          <div class="edu-program" data-en="${esc(item.programEn)}" data-ar="${esc(item.programAr)}">${item.programEn}</div>
          ${
            item.descriptionEn
              ? `<p class="edu-desc" data-en="${esc(item.descriptionEn)}" data-ar="${esc(item.descriptionAr)}">${item.descriptionEn}</p>`
              : ''
          }
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderEducation);