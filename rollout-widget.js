/* Interactive rollout guide: illustrative stages, without network calls or timers. */
(function () {
  'use strict';

  const stages = [
    {
      title: 'Цель и владелец',
      brief: 'Зафиксировать результат процесса.',
      owner: 'Владелец процесса.',
      risk: 'Можно автоматизировать работу, которая не нужна для результата процесса.',
      control: 'Команда выбирает задачу, задаёт измеримую цель, оценивает пользу и затраты.',
      next: 'Утверждены цель, границы решения и критерии приёмки.'
    },
    {
      title: 'Данные и доступ',
      brief: 'Проверить источники и права.',
      owner: 'Владельцы данных, специалисты по информационным технологиям и информационной безопасности.',
      risk: 'Система может раскрыть закрытые данные или использовать устаревшие сведения.',
      control: 'Команда проверяет источники и даёт только необходимые права доступа.',
      next: 'Качество данных и доступ по ролям проверены.'
    },
    {
      title: 'Контролируемый пилот',
      brief: 'Проверить решение в безопасных границах.',
      owner: 'Команда внедрения и эксперты предметной области.',
      risk: 'Система может дать правдоподобный, но ошибочный ответ или выполнить неверное действие.',
      control: 'Полномочия ограничены; действия записываются в журнал, результаты сверяются с экспертом.',
      next: 'Результаты воспроизводятся, ошибки разобраны.'
    },
    {
      title: 'Приёмка решения',
      brief: 'Подтвердить готовность сервиса.',
      owner: 'Владелец процесса совместно со специалистами по информационным технологиям.',
      risk: 'Удачную демонстрацию можно принять за готовый рабочий сервис.',
      control: 'Команда проверяет критерии качества, работу поддержки и возможность остановить сервис.',
      next: 'Владелец принял результат и согласился с оставшимися рисками.'
    },
    {
      title: 'Ограниченный запуск',
      brief: 'Начать работу с небольшой группой.',
      owner: 'Руководитель подразделения и служба поддержки.',
      risk: 'Сотрудники могут начать слепо доверять ответам системы.',
      control: 'Запуск начинают с небольшой группы; сотрудников учат проверять ответы и давать обратную связь.',
      next: 'Сотрудники готовы к работе, поддержка работает.'
    },
    {
      title: 'Контроль и масштабирование',
      brief: 'Следить за качеством и расширять использование.',
      owner: 'Владелец сервиса.',
      risk: 'После изменений качество может снизиться, а расходы — вырасти.',
      control: 'Команда следит за качеством и затратами, фиксирует версии и готовит возврат к рабочей версии.',
      next: 'Показатели устойчивы, расширение использования одобрено.'
    }
  ];

  const escapeText = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  function stageList(selected) {
    return `<div class="rollout-stages" role="group" aria-label="Шесть этапов внедрения ИИ">${stages.map((stage, index) => `<button type="button" class="rollout-stage" data-rollout-stage="${index}" aria-pressed="${index === selected}" aria-controls="rolloutDetail"><span class="rollout-stage-number">${index + 1}</span><span class="rollout-stage-copy"><strong>${escapeText(stage.title)}</strong><span>${escapeText(stage.brief)}</span></span></button>`).join('')}</div>`;
  }

  function stageDetail(selected) {
    const stage = stages[selected];
    const facts = [
      ['Кто отвечает', stage.owner],
      ['Риск', stage.risk],
      ['Как снизить риск', stage.control],
      ['Когда идти дальше', stage.next]
    ];
    return `<section id="rolloutDetail" class="rollout-detail" role="region" aria-live="polite" aria-labelledby="rolloutDetailTitle"><h2 id="rolloutDetailTitle">${selected + 1}. ${escapeText(stage.title)}</h2><dl>${facts.map(([label, value], index) => `<div class="rollout-fact${index === 3 ? ' rollout-transition' : ''}"><dt>${escapeText(label)}</dt><dd>${escapeText(value)}</dd></div>`).join('')}</dl></section>`;
  }

  window.initRollout = function () {
    const host = document.getElementById('rolloutWidget');
    if (!host) return;
    let selected = 0;
    const render = () => {
      host.innerHTML = `<div class="rollout-layout">${stageList(selected)}${stageDetail(selected)}</div><p class="rollout-footer">При проблемах возвращаются на доработку; масштаб расширяют после проверки результата.</p>`;
    };
    host.onclick = event => {
      const button = event.target.closest('button[data-rollout-stage]');
      if (!button || !host.contains(button)) return;
      const index = Number(button.dataset.rolloutStage);
      if (!Number.isInteger(index) || index < 0 || index >= stages.length) return;
      selected = index;
      render();
      const selectedButton = host.querySelector(`[data-rollout-stage="${selected}"]`);
      if (selectedButton) selectedButton.focus({ preventScroll: true });
    };
    render();
  };
})();
