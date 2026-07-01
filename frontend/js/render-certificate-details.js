async function renderCertificateDetails() {
  const params = new URLSearchParams(window.location.search);
  const certId = params.get('id');

  const container = document.getElementById('cert-details-container');
  if (!container) return;

  if (!certId) {
    container.innerHTML = `<p class="empty-state">Certificate not found</p>`;
    return;
  }

  const cert = await fetchCertificateById(certId);

  if (!cert) {
    container.innerHTML = `<p class="empty-state">Certificate not found</p>`;
    return;
  }

  document.title = `${cert.title} | Marwa Yousry`;

  // صورة الشهادة الفعلية تظهر هنا لو موجودة، وإلا اللوجو كبديل
  const displayImage = cert.certificateImageUrl
    ? buildImageUrl(cert.certificateImageUrl)
    : (cert.logoUrl ? buildImageUrl(cert.logoUrl) : '');

  const hasProjects = cert.relatedProjects && cert.relatedProjects.length > 0;

  container.innerHTML = `
    <div class="details-header">
      <div class="details-title-group">
        <span class="project-tag">${cert.issuer} · ${cert.year}</span>
        <h1 class="details-title">${cert.title}</h1>
      </div>
      <div class="details-actions">
        ${cert.verificationLink ? `<a href="${cert.verificationLink}" target="_blank" class="btn btn-primary"><span data-en="Verify Certificate" data-ar="التحقق من الشهادة">Verify Certificate</span> <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
      </div>
    </div>

    ${displayImage ? `<div class="cert-image-cover"><img src="${displayImage}" alt="${cert.title}" /></div>` : ''}
    <div class="details-body" style="grid-template-columns: 1fr;">
      <div class="details-main">
        ${
          cert.description
            ? `<div class="details-block">
                <h3 class="details-block-title"><i class="fa-solid fa-align-left"></i> <span data-en="What I Learned" data-ar="ماذا تعلمت">What I Learned</span></h3>
                <p class="details-block-text">${cert.description}</p>
              </div>`
            : ''
        }

        ${
          hasProjects
            ? `<div class="details-block">
                <h3 class="details-block-title"><i class="fa-solid fa-diagram-project"></i> <span data-en="Related Projects" data-ar="المشاريع المرتبطة">Related Projects</span></h3>
                <ul class="cert-projects-list">
                  ${cert.relatedProjects.map((p) => `<li>${p}</li>`).join('')}
                </ul>
              </div>`
            : ''
        }
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderCertificateDetails);