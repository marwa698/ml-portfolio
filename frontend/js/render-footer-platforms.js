// عرض شريط منصات العمل الحر في الفوتر (Fiverr, Upwork, Mostaql, إلخ)

async function renderFooterPlatforms() {
  const container = document.getElementById('footer-platforms');
  if (!container) return;

  const items = await fetchPlatformLinks();
  if (!items.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
      <a href="${item.url}" target="_blank" rel="noopener" class="footer-platform-badge" aria-label="${item.name}" title="${item.name}">
        <img src="${buildImageUrl(item.logoUrl)}" alt="${item.name}" />
      </a>
    `
    )
    .join('');
}

document.addEventListener('DOMContentLoaded', renderFooterPlatforms);