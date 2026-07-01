// عرض قسم الشهادات (Achievements) في الصفحة الرئيسية بجلبها من الباك إند

async function renderCertificates() {
  const container = document.getElementById('achievements-row');
  if (!container) return;

  const certificates = await fetchCertificates();

  if (!certificates.length) {
    container.innerHTML = `<p class="empty-state" data-en="No certificates added yet" data-ar="لم تتم إضافة شهادات بعد">لم تتم إضافة شهادات بعد</p>`;
    return;
  }

  const featured = certificates.slice(0, 4);
  container.innerHTML = featured.map(renderCertificateItem).join('');
}

function renderCertificateItem(cert) {
  const logoUrl = cert.logoUrl ? buildImageUrl(cert.logoUrl) : '';

  return `
    <div class="achievement-item" onclick="window.location.href='certificate-details.html?id=${cert._id}'" style="cursor: pointer;">
      <div class="achievement-circle">
        ${logoUrl ? `<img src="${logoUrl}" alt="${cert.title}" />` : '🏆'}
      </div>
      <div class="achievement-title">${cert.title}</div>
      <div class="achievement-sub">${cert.issuer} · ${cert.year}</div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderCertificates);