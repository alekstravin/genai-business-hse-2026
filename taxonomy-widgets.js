/* Classification viewer. Content comes from PATTERN_TAXONOMY; no model or network calls. */
(function () {
  'use strict';

  const escapeText = value => String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  function overview(groups) {
    const links = '<svg class="taxonomy-map-lines" viewBox="0 0 1660 480" aria-hidden="true"><defs><marker id="taxonomy-map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#254b9b"/></marker></defs><path d="M 830 76 V 390" class="taxonomy-map-spine"/>' +
      ['M 830 190 H 770', 'M 830 390 H 770', 'M 830 190 H 890', 'M 830 390 H 890'].map(path => `<path d="${path}" class="taxonomy-map-branches" marker-end="url(#taxonomy-map-arrow)"/>`).join('') + '</svg>';
    const cards = groups.map((group, index) => {
      const count = group.patterns.length;
      return `<button type="button" class="taxonomy-map-group taxonomy-map-group-${index + 1}" data-taxonomy-slide="${(window.SLIDES || []).findIndex(slide => slide.widget === 'taxonomy-' + group.id)}" aria-label="${escapeText(group.title)}: ${count} пунктов. ${escapeText(group.question)} Открыть группу."><span class="taxonomy-map-number">${String(group.number).padStart(2, '0')}</span><span class="taxonomy-map-copy"><strong>${escapeText(group.title)}</strong><span>${escapeText(group.question)}</span></span><span class="taxonomy-map-count"><b>${count}</b><span>пунктов</span></span></button>`;
    }).join('');
    return `<div class="taxonomy-map">${links}<div class="taxonomy-map-hub"><strong>Агентная система</strong><span>Какие механизмы нужны для задачи?</span></div>${cards}</div><p class="taxonomy-map-caption">Группы дополняют друг друга: в конкретном приложении используют только нужные механизмы.</p>`;
  }

  function patternList(group, selectedId) {
    return `<div class="taxonomy-pattern-list" role="group" aria-label="${escapeText(group.title)}: все пункты">${group.patterns.map((pattern, index) => `<button type="button" class="taxonomy-pattern-row" data-taxonomy-pattern="${escapeText(pattern.id)}" aria-pressed="${pattern.id === selectedId}" aria-controls="taxonomyDetail" data-taxonomy-source-number="${pattern.number}"><span class="taxonomy-pattern-number">${group.number}.${index + 1}</span><span class="taxonomy-pattern-copy"><strong>${escapeText(pattern.name)}</strong><span>${escapeText(pattern.brief)}</span></span></button>`).join('')}</div>`;
  }

  function patternDetail(pattern) {
    const note = pattern.note ? `<p class="taxonomy-detail-note">${escapeText(pattern.note)}</p>` : '';
    return `<section id="taxonomyDetail" class="taxonomy-detail" role="region" aria-labelledby="taxonomyDetailTitle" aria-live="polite"><h2 id="taxonomyDetailTitle">${escapeText(pattern.title)}</h2><p class="taxonomy-definition">${escapeText(pattern.definition)}</p><div class="taxonomy-detail-meta"><span class="taxonomy-kind">${escapeText(pattern.kind)}</span><span class="taxonomy-practice">${escapeText(pattern.practice)}</span></div><div class="taxonomy-example"><span class="taxonomy-detail-label">Бизнес-пример</span><p>${escapeText(pattern.example)}</p></div><div class="taxonomy-result"><span class="taxonomy-detail-label">Результат для бизнеса</span><p>${escapeText(pattern.result)}</p></div>${note}</section>`;
  }

  window.initTaxonomy = function (groupId) {
    const host = document.getElementById('taxonomyWidget');
    if (!host) return;
    const groups = Array.isArray(window.PATTERN_TAXONOMY) ? window.PATTERN_TAXONOMY : [];
    const group = groups.find(item => item.id === groupId);
    let selectedId = group && group.patterns.some(pattern => pattern.id === group.defaultId)
      ? group.defaultId : group && group.patterns[0] ? group.patterns[0].id : '';

    function render() {
      if (groupId === 'overview') {
        host.innerHTML = overview(groups);
      } else if (group) {
        const selected = group.patterns.find(pattern => pattern.id === selectedId);
        host.innerHTML = `<div class="taxonomy-layout">${patternList(group, selectedId)}${patternDetail(selected)}</div>`;
      } else {
        host.innerHTML = '';
      }
    }

    host.onclick = event => {
      const button = event.target.closest('button');
      if (!button || !host.contains(button)) return;
      if (button.dataset.taxonomySlide !== undefined) {
        const slide = Number(button.dataset.taxonomySlide);
        if (Number.isInteger(slide) && slide >= 0 && slide < (window.SLIDES || []).length && typeof window.go === 'function') window.go(slide);
        return;
      }
      if (!group || !group.patterns.some(pattern => pattern.id === button.dataset.taxonomyPattern)) return;
      selectedId = button.dataset.taxonomyPattern;
      render();
      const selectedButton = host.querySelector(`[data-taxonomy-pattern="${selectedId}"]`);
      if (selectedButton) selectedButton.focus({ preventScroll: true });
    };
    render();
  };
})();
