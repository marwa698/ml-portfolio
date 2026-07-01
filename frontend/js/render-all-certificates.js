// عرض كل الشهادات في تاب "الشهادات" بصفحة projects.html

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
  const imageUrl = cert.imageUrl ? buildImageUrl(cert.imageUrl) : '';

  return `
    <div class="certificate-card">
      <div class="certificate-icon">
        ${imageUrl ? `<img src="${imageUrl}" alt="${cert.title}" />` : '🏆'}
      </div>
      <div class="certificate-title">${cert.title}</div>
      <div class="certificate-issuer">${cert.issuer} · ${cert.year}</div>
      ${
        cert.verificationLink
          ? `<a href="${cert.verificationLink}" target="_blank" class="certificate-link"><span data-en="Verify" data-ar="تحقق">Verify</span> <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
          : ''
      }
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderAllCertificates);