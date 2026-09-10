// عرض قسم Education (التايم لاين) في الصفحة الرئيسية بجلبه من الباك إند

async function renderEducation() {
  const container = document.getElementById('education-timeline');
  if (!container) return;

  const items = await fetchEducation();

  if (!items.length) {
    container.innerHTML = `<p class="empty-state" data-en="No education entries added yet" data-ar="لم تتم إضافة بيانات تعليمية بعد">No education entries added yet</p>`;
    return;
  }

  container.innerHTML = items.map(renderEducationItem).join('');
}

function renderEducationItem(item) {
  const logoUrl = item.logoUrl ? buildImageUrl(item.logoUrl) : '';

  return `
    <div class="edu-item">
      <div class="edu-period">
        <div class="edu-period-year">${item.period}</div>
        ${item.status ? `<div class="edu-period-status">${item.status}</div>` : ''}
      </div>
      <div class="edu-dot-col">
        <div class="edu-dot"></div>
        <div class="edu-line"></div>
      </div>
      <div class="edu-card">
        <div class="edu-logo">
          ${logoUrl ? `<img src="${logoUrl}" alt="${item.institution}" />` : '<i class="fa-solid fa-graduation-cap"></i>'}
        </div>
        <div class="edu-content">
          <div class="edu-header-row">
            <h3 class="edu-institution">${item.institution}</h3>
            <div class="edu-side">
              <span class="edu-badge">${item.type}</span>
              ${
                item.link
                  ? `<a href="${item.link}" target="_blank" rel="noopener" class="edu-link-btn" aria-label="Open link"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
                  : ''
              }
            </div>
          </div>
          <div class="edu-program">${item.program}</div>
          ${item.description ? `<p class="edu-desc">${item.description}</p>` : ''}
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderEducation);