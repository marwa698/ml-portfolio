// عرض قسم المهارات (Skills) في الصفحة الرئيسية كتابات حسب الفئة، بجلبها من الباك إند

const SKILL_CATEGORY_ORDER = ['Technical', 'Soft Skills', 'Tools', 'Languages'];

const SKILL_CATEGORY_LABELS_AR = {
  'Technical': 'تقنية',
  'Soft Skills': 'مهارات شخصية',
  'Tools': 'أدوات',
  'Languages': 'لغات',
};

const SKILL_CATEGORY_DESC = {
  'Technical': {
    en: 'Core machine learning, deep learning and applied AI techniques I work with.',
    ar: 'أساسيات تعلم الآلة والتعلم العميق وتقنيات الذكاء الاصطناعي التطبيقية التي أعمل بها.',
  },
  'Soft Skills': {
    en: 'How I work with clients and teams — communication, research and problem solving.',
    ar: 'طريقتي في العمل مع العملاء والفرق — التواصل والبحث وحل المشكلات.',
  },
  'Tools': {
    en: 'The libraries, frameworks and platforms I use to build and ship AI solutions.',
    ar: 'المكتبات والأطر والمنصات التي أستخدمها لبناء وتسليم حلول الذكاء الاصطناعي.',
  },
  'Languages': {
    en: 'Programming and spoken languages I work in.',
    ar: 'لغات البرمجة واللغات المحكية التي أعمل بها.',
  },
};

let allSkillsCache = [];
let activeSkillCategory = null;

async function renderSkills() {
  const gridContainer = document.getElementById('skills-grid');
  if (!gridContainer) return;

  allSkillsCache = await fetchSkills();

  const tabsContainer = document.getElementById('skills-tabs');
  const descContainer = document.getElementById('skills-tab-desc');

  if (!allSkillsCache.length) {
    if (tabsContainer) tabsContainer.innerHTML = '';
    if (descContainer) descContainer.innerHTML = '';
    gridContainer.innerHTML = `<p class="empty-state" data-en="No skills added yet" data-ar="لم تتم إضافة مهارات بعد">No skills added yet</p>`;
    return;
  }

  const categories = getOrderedCategories(allSkillsCache);
  activeSkillCategory = categories[0];

  renderSkillTabs(categories);
  renderSkillPanel(activeSkillCategory);
}

function getOrderedCategories(skills) {
  const present = [...new Set(skills.map((s) => s.category || 'General'))];
  const ordered = SKILL_CATEGORY_ORDER.filter((c) => present.includes(c));
  const extra = present.filter((c) => !SKILL_CATEGORY_ORDER.includes(c));
  return [...ordered, ...extra];
}

function renderSkillTabs(categories) {
  const tabsContainer = document.getElementById('skills-tabs');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = categories
    .map((cat) => {
      const arLabel = SKILL_CATEGORY_LABELS_AR[cat] || cat;
      return `
        <button
          class="skill-tab-btn ${cat === activeSkillCategory ? 'active' : ''}"
          data-category="${cat}"
          data-en="${cat}"
          data-ar="${arLabel}"
          role="tab"
          aria-selected="${cat === activeSkillCategory}"
        >${cat}</button>
      `;
    })
    .join('');

  tabsContainer.querySelectorAll('.skill-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeSkillCategory = btn.dataset.category;
      tabsContainer.querySelectorAll('.skill-tab-btn').forEach((b) => {
        const isActive = b.dataset.category === activeSkillCategory;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive);
      });
      renderSkillPanel(activeSkillCategory);
    });
  });
}

function renderSkillPanel(category) {
  const descContainer = document.getElementById('skills-tab-desc');
  const gridContainer = document.getElementById('skills-grid');
  if (!gridContainer) return;

  const info = SKILL_CATEGORY_DESC[category];
  const arLabel = SKILL_CATEGORY_LABELS_AR[category] || category;

  if (descContainer) {
    descContainer.innerHTML = `
      <h3 class="skills-tab-title" data-en="${category}" data-ar="${arLabel}">${category}</h3>
      ${
        info
          ? `<p class="skills-tab-text" data-en="${info.en}" data-ar="${info.ar}">${info.en}</p>`
          : ''
      }
    `;
  }

  const items = allSkillsCache
    .filter((s) => (s.category || 'General') === category)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  gridContainer.innerHTML = items.map(renderSkillCard).join('');
}

function renderSkillCard(skill) {
  return `
    <div class="skill-card">
      <div class="skill-icon"><i class="${skill.icon}"></i></div>
      <div class="skill-name">${skill.name}</div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderSkills);