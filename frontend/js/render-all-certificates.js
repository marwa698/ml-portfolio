async function renderAllCertificates() {
  const container = document.getElementById('certificates-grid');
  if (!container) return;

  const certificates = await fetchCertificates();

  if (!certificates.length) {
    container.innerHTML = `<p class="empty-state" data-en="No certificates added yet" data-ar="لم تتم إضافة شهادات بعد">No certificates added yet</p>`;
    return;
  }

  container.innerHTML = certificates.map(renderCertificateCard).join('');

  const lang = document.documentElement.getAttribute('lang') || localStorage.getItem('portfolio-lang') || 'en';
  container.querySelectorAll('[data-en][data-ar]').forEach((el) => {
    el.textContent = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
  });
}

function esc(str) {
  return (str || '').replace(/"/g, '&quot;');
}

function renderCertificateCard(cert) {
  const logoUrl = cert.logoUrl ? buildImageUrl(cert.logoUrl) : '';
  const coverUrl = cert.certificateImageUrl ? buildImageUrl(cert.certificateImageUrl) : logoUrl;

  return `
    <div class="certificate-card" onclick="window.location.href='certificate-details.html?id=${cert._id}'">
      <div class="certificate-img-wrap">
        ${
          coverUrl
            ? `<img src="${coverUrl}" alt="${cert.titleEn}" />`
            : `<div class="certificate-img-placeholder"><i class="fa-solid fa-certificate"></i></div>`
        }
      </div>
      <div class="certificate-body">
        <div class="certificate-title" data-en="${esc(cert.titleEn)}" data-ar="${esc(cert.titleAr)}">${cert.titleEn}</div>
        <div class="certificate-issuer">
          <span data-en="${esc(cert.issuerEn)}" data-ar="${esc(cert.issuerAr)}">${cert.issuerEn}</span> · ${cert.year}
        </div>
        <div class="certificate-footer">
          ${logoUrl ? `<div class="certificate-logo-wrap"><img src="${logoUrl}" alt="${cert.issuerEn}" /></div>` : '<span></span>'}
          ${
            cert.verificationLink
              ? `<a href="${cert.verificationLink}" target="_blank" rel="noopener" class="certificate-link" onclick="event.stopPropagation()">
                  <span data-en="Verify Certificate" data-ar="التحقق من الشهادة">Verify Certificate</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>`
              : ''
          }
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderAllCertificates);