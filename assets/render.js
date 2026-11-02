'use strict';

/*
 * Движок презентации: строит страницу по описанию из content/presentation.js.
 * Содержимое меняется только там; здесь — разметка типов блоков и иконки.
 */

const ICON_PATHS = {
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5M12 16v.01"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1"/><path d="M9 13v2M15 13v2"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>',
  compress: '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',
  cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
  lightbulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>',
  loop: '<path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  plug: '<path d="M9 2v6M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v4"/>',
  save: '<path d="M5 3h11l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 1-2z"/><path d="M8 3v5h7V3"/><rect x="7" y="13" width="10" height="7" rx="1"/>',
  shield: '<path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  sparkles: '<path d="m12 3 1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="m19 15 .8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
  text: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
};

const BLOCK_RENDERERS = {
  bars: renderBars,
  cards: renderCards,
  compare: renderCompare,
  cycle: renderCycle,
  equation: renderEquation,
  flow: renderFlow,
  layers: renderLayers,
  points: renderPoints,
  stacks: renderStacks,
  stats: renderStats,
};

const SECTION_NUMBER_DIGITS_QUANTITY = 2;
// Первая колонка сетки сравнения занята подписями строк, колонки значений начинаются со второй линии.
const COMPARE_FIRST_VALUE_COLUMN_NUMBER = 2;
// Текущим считается раздел, пересекающий узкую полосу посередине экрана.
const ACTIVE_SECTION_ROOT_MARGIN = '-45% 0px -54% 0px';
// Код выделяется первым: звёздочки внутри него — часть кода, а не выделение.
const CODE_FRAGMENT_PATTERN = /(`[^`]+`)/;
const HIGHLIGHT_PATTERN = /\*\*(.+?)\*\*/g;

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// **выделение** — золотом, `код` — моноширинным.
function formatText(text) {
  return String(text).split(CODE_FRAGMENT_PATTERN).map(formatTextFragment).join('');
}

// split с группой в шаблоне ставит найденный код на нечётные места.
function formatTextFragment(fragment, index) {
  if (index % 2 === 1) {
    return `<code>${escapeHtml(fragment.slice(1, -1))}</code>`;
  }
  return escapeHtml(fragment).replace(HIGHLIGHT_PATTERN, '<strong>$1</strong>');
}

function renderText(text, className, tagName = 'span') {
  if (!text) {
    return '';
  }
  return `<${tagName} class="${className}">${formatText(text)}</${tagName}>`;
}

function renderIcon(name) {
  if (!name) {
    return '';
  }
  if (!(name in ICON_PATHS)) {
    console.warn(`Неизвестная иконка: ${name}`);
    return '';
  }
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}

function renderIconBadge(name) {
  const icon = renderIcon(name);
  return icon ? `<span class="icon-badge">${icon}</span>` : '';
}

// Строка-подпись со значком: возврат по кругу в цепочке, выход из цикла, подпись под блоком.
function renderCaption(iconName, text, className) {
  if (!text) {
    return '';
  }
  return `<p class="${className}">${renderIcon(iconName)}<span>${formatText(text)}</span></p>`;
}

function renderTags(texts, className) {
  if (!texts) {
    return '';
  }
  return `<span class="${className}">${texts.map(renderTag).join('')}</span>`;
}

function renderTag(text) {
  return `<span class="tag">${formatText(text)}</span>`;
}

function getStateClassName(item) {
  return [item.isAccent && 'is-accent', item.isMuted && 'is-muted', item.isWarning && 'is-warning'].filter(Boolean).join(' ');
}

function isAccentItem(item) {
  return Boolean(item.isAccent);
}

function formatSectionNumber(index) {
  return String(index + 1).padStart(SECTION_NUMBER_DIGITS_QUANTITY, '0');
}

function renderTile(item, className, extraContent = '', style = '') {
  const styleAttribute = style ? ` style="${style}"` : '';
  return `
    <li class="tile ${className} ${getStateClassName(item)}"${styleAttribute}>
      ${renderIconBadge(item.icon)}
      <span class="tile-body">
        ${renderText(item.title, 'tile-title')}
        ${renderText(item.text, 'tile-text')}
        ${extraContent}
      </span>
    </li>`;
}

function renderFlow(block) {
  return `
    <ol class="flow">${block.steps.map(renderFlowStep).join('')}</ol>
    ${renderCaption('loop', block.loop, 'caption flow-loop')}`;
}

function renderFlowStep(step) {
  return renderTile(step, 'flow-step', renderTags(step.tags, 'tags tags--tokens'));
}

function renderBars(block) {
  return `
    ${renderText(block.prompt, 'bars-prompt', 'p')}
    <ul class="bars">${block.items.map(renderBar).join('')}</ul>`;
}

function renderBar(item) {
  const valueNumber = Number(item.value);
  return `
    <li class="bar ${getStateClassName(item)}" style="--value: ${valueNumber}%">
      <span class="bar-label">${formatText(item.label)}</span>
      <span class="bar-track"><span class="bar-fill"></span></span>
      <span class="bar-value">${valueNumber}%</span>
    </li>`;
}

function renderStats(block) {
  return `<ul class="stats">${block.items.map(renderStat).join('')}</ul>`;
}

function renderStat(item) {
  return `
    <li class="tile stat ${getStateClassName(item)}">
      ${renderText(item.value, 'stat-value')}
      ${renderText(item.label, 'tile-text')}
    </li>`;
}

function renderPoints(block) {
  return `<ul class="points">${block.items.map(renderPoint).join('')}</ul>`;
}

// Тезис — строка, а объект { text, isWarning } — когда пункт нужно выделить.
function renderPoint(item) {
  const point = typeof item === 'string' ? { text: item } : item;
  return `<li class="point ${getStateClassName(point)}">${formatText(point.text)}</li>`;
}

function renderEquation(block) {
  return `
    <ol class="equation">
      ${block.terms.map(renderEquationTerm).join('')}
      ${renderTile({ ...block.result, isAccent: true }, 'equation-result')}
    </ol>`;
}

function renderEquationTerm(term) {
  return renderTile(term, 'equation-term');
}

function renderStacks(block) {
  return `<div class="stacks">${block.columns.map(renderStack).join('')}</div>`;
}

function renderStack(column) {
  return `
    <figure class="stack">
      <div class="stack-items">${column.items.map(renderStackItem).join('')}</div>
      <figcaption class="stack-label">${formatText(column.label)}</figcaption>
    </figure>`;
}

function renderStackItem(item) {
  return `<span class="stack-item ${getStateClassName(item)}">${formatText(item.text)}</span>`;
}

function renderCycle(block) {
  return `
    <div class="cycle" style="--steps-quantity: ${block.steps.length}">
      <div class="cycle-ring" aria-hidden="true"></div>
      <div class="cycle-center">
        <span class="cycle-core">${renderIcon(block.center.icon)}</span>
        ${renderText(block.center.title, 'cycle-center-title')}
        ${renderText(block.center.text, 'cycle-center-text')}
      </div>
      <ol class="cycle-steps">${block.steps.map(renderCycleStep).join('')}</ol>
    </div>
    ${renderCaption('check', block.exit, 'caption cycle-exit')}`;
}

function renderCycleStep(step, index) {
  return renderTile(step, 'cycle-step', '', `--index: ${index}`);
}

function renderCompare(block) {
  const accentIndex = block.columns.findIndex(isAccentItem);
  const spotlight = accentIndex === -1
    ? ''
    : `<span class="compare-spotlight" style="grid-column: ${accentIndex + COMPARE_FIRST_VALUE_COLUMN_NUMBER}"></span>`;
  return `
    <div class="compare-scroll">
      <div class="compare" style="--columns-quantity: ${block.columns.length}">
        ${spotlight}
        <span class="compare-cell compare-heading"></span>
        ${block.columns.map(renderCompareHeading).join('')}
        ${renderCompareRows(block.rows, block.columns)}
      </div>
    </div>`;
}

function renderCompareHeading(column) {
  return `<span class="compare-cell compare-heading ${getStateClassName(column)}">${renderIcon(column.icon)}${escapeHtml(column.title)}</span>`;
}

function renderCompareRows(rows, columns) {
  let markup = '';
  for (const row of rows) {
    markup += `<span class="compare-cell compare-label">${formatText(row.label)}</span>`;
    for (const [index, value] of row.values.entries()) {
      markup += renderCompareValue(value, columns[index]);
    }
  }
  return markup;
}

// Название колонки нужно узкому блоку, где строка сравнения превращается в карточку.
function renderCompareValue(value, column) {
  return `
    <span class="compare-cell compare-value ${getStateClassName(column)}" data-column="${escapeHtml(column.title)}">
      ${formatText(value)}
    </span>`;
}

function renderCards(block) {
  return `<ul class="cards">${block.items.map(renderCard).join('')}</ul>`;
}

function renderCard(item) {
  return renderTile(item, 'card');
}

function renderLayers(block) {
  return `
    <div class="layers">
      ${renderText(block.frame, 'layers-frame', 'p')}
      <ol class="layers-list">${block.items.map(renderLayer).join('')}</ol>
    </div>`;
}

function renderLayer(item) {
  return renderTile(item, 'layer', renderTags(item.tags, 'tags'));
}

function renderBlock(block) {
  const renderContent = BLOCK_RENDERERS[block.type];
  if (!renderContent) {
    console.warn(`Неизвестный тип блока: ${block.type}`);
    return '';
  }
  const classNames = ['block', `block--${block.type}`];
  if (block.isHalf) {
    classNames.push('block--half');
  }
  if (block.isSpotlight) {
    classNames.push('is-spotlight');
  }
  return `
    <article class="${classNames.join(' ')}">
      ${renderText(block.title, 'block-title', 'h3')}
      ${renderContent(block)}
      ${renderCaption(block.noteIcon, block.note, 'block-note')}
    </article>`;
}

function renderBlocks(blocks) {
  if (!blocks) {
    return '';
  }
  return `<div class="blocks">${blocks.map(renderBlock).join('')}</div>`;
}

function renderNavigationLink(item, numberText) {
  return `
    <a class="navigation-link" href="#${item.id}" data-target="${item.id}">
      ${renderIcon(item.icon)}
      <span>${escapeHtml(item.shortTitle)}</span>
      ${renderText(numberText, 'navigation-number')}
    </a>`;
}

function renderSectionLink(section, index) {
  return renderNavigationLink(section, formatSectionNumber(index));
}

function renderSidebar(presentation) {
  return `
    <a class="brand" href="#${presentation.cover.id}">
      <span class="brand-mark" aria-hidden="true"></span>${escapeHtml(presentation.brand)}
    </a>
    <nav class="navigation">
      ${renderNavigationLink(presentation.cover, '')}
      ${presentation.sections.map(renderSectionLink).join('')}
    </nav>`;
}

function renderTableOfContentsCard(section, index) {
  return `
    <a class="tile contents-card" href="#${section.id}">
      <span class="contents-number">${formatSectionNumber(index)}</span>
      ${renderIconBadge(section.icon)}
      <span class="tile-title">${escapeHtml(section.shortTitle)}</span>
      ${renderText(section.summary, 'tile-text')}
    </a>`;
}

function renderCover(presentation) {
  const cover = presentation.cover;
  return `
    <header class="section cover" id="${cover.id}" data-section>
      <div class="section-header">
        <p class="kicker">${escapeHtml(cover.kicker)}</p>
        ${renderText(cover.title, 'cover-title', 'h1')}
        ${renderText(cover.lead, 'lead', 'p')}
      </div>
      ${renderBlocks(cover.blocks)}
      <nav class="contents">${presentation.sections.map(renderTableOfContentsCard).join('')}</nav>
    </header>`;
}

function renderSection(section, index) {
  return `
    <section class="section" id="${section.id}" data-section>
      <header class="section-header">
        <p class="kicker">${formatSectionNumber(index)} · ${escapeHtml(section.kicker)}</p>
        ${renderText(section.title, 'section-title', 'h2')}
        ${renderText(section.lead, 'lead', 'p')}
      </header>
      ${renderBlocks(section.blocks)}
    </section>`;
}

function highlightNavigationLink(sectionId) {
  for (const $link of document.querySelectorAll('.navigation-link')) {
    const isActive = $link.dataset.target === sectionId;
    $link.classList.toggle('is-active', isActive);
    if (isActive) {
      revealNavigationLink($link);
    }
  }
}

// На узком экране меню — прокручиваемая полоса сверху: скрытый за краем текущий пункт выводится на её середину.
// На широком полоса не прокручивается, и пункт всегда виден.
function revealNavigationLink($link) {
  const $sidebar = document.getElementById('sidebar');
  const linkStart = $link.offsetLeft;
  const linkEnd = linkStart + $link.offsetWidth;
  const isVisible = linkStart >= $sidebar.scrollLeft && linkEnd <= $sidebar.scrollLeft + $sidebar.clientWidth;
  if (isVisible) {
    return;
  }
  $sidebar.scrollTo({
    left: linkStart - ($sidebar.clientWidth - $link.offsetWidth) / 2,
    behavior: 'smooth',
  });
}

function handleSectionIntersections(entries) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      highlightNavigationLink(entry.target.id);
    }
  }
}

function observeActiveSection() {
  const observer = new IntersectionObserver(handleSectionIntersections, { rootMargin: ACTIVE_SECTION_ROOT_MARGIN });
  for (const $section of document.querySelectorAll('[data-section]')) {
    observer.observe($section);
  }
}

function renderPage(presentation) {
  document.title = presentation.title;
  document.getElementById('sidebar').innerHTML = renderSidebar(presentation);
  document.getElementById('content').innerHTML =
    renderCover(presentation) + presentation.sections.map(renderSection).join('');
  observeActiveSection();
}

renderPage(window.presentation);
