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

  return `
    <div class="certificate-card" onclick="window.location.href='certificate-details.html?id=${cert._id}'">
      <div class="certificate-icon">
        ${logoUrl ? `<img src="${logoUrl}" alt="${cert.title}" />` : '🏆'}
      </div>
      <div class="certificate-title">${cert.title}</div>
      <div class="certificate-issuer">${cert.issuer} · ${cert.year}</div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderAllCertificates);