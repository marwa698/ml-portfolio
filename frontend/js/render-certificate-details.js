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

  document.title = `${cert.titleEn} | Marwa Yousry`;

  const displayImage = cert.certificateImageUrl
    ? buildImageUrl(cert.certificateImageUrl)
    : (cert.logoUrl ? buildImageUrl(cert.logoUrl) : '');

  const hasProjects = cert.relatedProjects && cert.relatedProjects.length > 0;
  const esc = (s) => (s || '').replace(/"/g, '&quot;');

  container.innerHTML = `
    <div class="details-header">
      <div class="details-title-group">
        <span class="project-tag">
          <span data-en="${esc(cert.issuerEn)}" data-ar="${esc(cert.issuerAr)}">${cert.issuerEn}</span> · ${cert.year}
        </span>
        <h1 class="details-title" data-en="${esc(cert.titleEn)}" data-ar="${esc(cert.titleAr)}">${cert.titleEn}</h1>
      </div>
      <div class="details-actions">
        ${cert.verificationLink ? `<a href="${cert.verificationLink}" target="_blank" class="btn btn-primary"><span data-en="Verify Certificate" data-ar="التحقق من الشهادة">Verify Certificate</span> <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
      </div>
    </div>

    ${displayImage ? `<div class="cert-image-cover"><img src="${displayImage}" alt="${cert.titleEn}" /></div>` : ''}
    <div class="details-body" style="grid-template-columns: 1fr;">
      <div class="details-main">
        ${
          cert.descriptionEn
            ? `<div class="details-block">
                <h3 class="details-block-title"><i class="fa-solid fa-align-left"></i> <span data-en="What I Learned" data-ar="ماذا تعلمت">What I Learned</span></h3>
                <p class="details-block-text" data-en="${esc(cert.descriptionEn)}" data-ar="${esc(cert.descriptionAr)}">${cert.descriptionEn}</p>
              </div>`
            : ''
        }

        ${
          hasProjects
            ? `<div class="details-block">
                <h3 class="details-block-title"><i class="fa-solid fa-diagram-project"></i> <span data-en="Related Projects" data-ar="المشاريع المرتبطة">Related Projects</span></h3>
                <ul class="cert-projects-list">
                  ${cert.relatedProjects.map((p) => `<li data-en="${esc(p.en)}" data-ar="${esc(p.ar)}">${p.en}</li>`).join('')}
                </ul>
              </div>`
            : ''
        }
      </div>
    </div>
  `;

  const lang = document.documentElement.getAttribute('lang') || localStorage.getItem('portfolio-lang') || 'en';
  container.querySelectorAll('[data-en][data-ar]').forEach((el) => {
    el.textContent = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
  });
}

document.addEventListener('DOMContentLoaded', renderCertificateDetails);