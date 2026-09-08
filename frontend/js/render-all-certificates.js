async function renderAllCertificates() {
  const container = document.getElementById('certificates-grid');
  if (!container) return;

  const certificates = await fetchCertificates();

  if (!certificates.length) {
    container.innerHTML = `<p class="empty-state" data-en="No certificates added yet" data-ar="لم تتم إضافة شهادات بعد">لم تتم إضافة شهادات بعد</p>`;
    return;
  }

  container.innerHTML = certificates.map(renderCertificateCard).join('');
}

function renderCertificateCard(cert) {
  const logoUrl = cert.logoUrl ? buildImageUrl(cert.logoUrl) : '';
  const coverUrl = cert.certificateImageUrl ? buildImageUrl(cert.certificateImageUrl) : logoUrl;

  return `
    <div class="certificate-card" onclick="window.location.href='certificate-details.html?id=${cert._id}'">
      <div class="certificate-img-wrap">
        ${
          coverUrl
            ? `<img src="${coverUrl}" alt="${cert.title}" />`
            : `<div class="certificate-img-placeholder"><i class="fa-solid fa-certificate"></i></div>`
        }
      </div>
      <div class="certificate-body">
        <div class="certificate-title">${cert.title}</div>
        <div class="certificate-issuer">${cert.issuer} · ${cert.year}</div>
        <div class="certificate-footer">
          ${logoUrl ? `<img src="${logoUrl}" alt="${cert.issuer}" class="certificate-logo" />` : '<span></span>'}
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