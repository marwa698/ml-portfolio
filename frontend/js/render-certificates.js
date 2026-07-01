// عرض قسم الشهادات (Achievements) في الصفحة الرئيسية بجلبها من الباك إند

async function renderCertificates() {
  const container = document.getElementById('achievements-row');
  if (!container) return;

  const certificates = await fetchCertificates();

  if (!certificates.length) {
    container.innerHTML = `<p class="empty-state" data-en="No certificates added yet" data-ar="لم تتم إضافة شهادات بعد">لم تتم إضافة شهادات بعد</p>`;
    return;
  }

  // في الصفحة الرئيسية نعرض أول 4 بس
  const featured = certificates.slice(0, 4);
  container.innerHTML = featured.map(renderCertificateItem).join('');
}

function renderCertificateItem(cert) {
  const imageUrl = cert.imageUrl ? buildImageUrl(cert.imageUrl) : '';

  return `
    <div class="achievement-item">
      <div class="achievement-circle">
        ${imageUrl ? `<img src="${imageUrl}" alt="${cert.title}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />` : '🏆'}
      </div>
      <div class="achievement-title">${cert.title}</div>
      <div class="achievement-sub">${cert.issuer} · ${cert.year}</div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderCertificates);