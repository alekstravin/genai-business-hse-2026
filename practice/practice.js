(function () {
  'use strict';

  const details = document.getElementById('instructionDetails');
  const preview = document.getElementById('promptText');
  const loading = document.getElementById('promptLoading');
  const error = document.getElementById('promptError');
  const copyButton = document.getElementById('copyPrompt');
  const copyStatus = document.getElementById('copyStatus');
  if (!details || !preview || !loading || !error || !copyButton || !copyStatus) return;

  let promptText = null;
  let pendingLoad = null;
  copyButton.hidden = false;

  async function loadPrompt() {
    if (promptText !== null) return promptText;
    if (pendingLoad) return pendingLoad;
    loading.hidden = false;
    loading.textContent = 'Загружаем текст инструкции…';
    error.hidden = true;
    pendingLoad = fetch('files/system-prompt.txt', { credentials: 'same-origin' })
      .then(response => {
        if (!response.ok) throw new Error('Instruction file is unavailable');
        return response.text();
      })
      .then(value => {
        if (!value.trim()) throw new Error('Instruction file is empty');
        promptText = value;
        preview.textContent = value;
        preview.hidden = false;
        loading.hidden = true;
        return value;
      })
      .catch(cause => {
        loading.hidden = true;
        preview.hidden = true;
        error.hidden = false;
        throw cause;
      })
      .finally(() => { pendingLoad = null; });
    return pendingLoad;
  }

  function legacyCopy(value) {
    const field = document.createElement('textarea');
    field.value = value;
    field.readOnly = true;
    field.setAttribute('aria-hidden', 'true');
    field.style.position = 'fixed';
    field.style.left = '-9999px';
    field.style.top = '0';
    document.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, value.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    field.remove();
    return copied;
  }

  function selectPreview() {
    details.open = true;
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(preview);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  details.addEventListener('toggle', () => {
    if (details.open && error.hidden) loadPrompt().catch(() => {});
  });

  copyButton.addEventListener('click', async () => {
    copyButton.disabled = true;
    copyButton.setAttribute('aria-busy', 'true');
    copyButton.textContent = 'Копирование…';
    copyStatus.textContent = '';
    try {
      const value = await loadPrompt();
      let copied = false;
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try { await navigator.clipboard.writeText(value); copied = true; } catch (_) { copied = false; }
      }
      if (!copied) copied = legacyCopy(value);
      if (copied) {
        copyStatus.textContent = 'Текст инструкции скопирован. Вставьте его в поле инструкции AI Studio.';
        copyButton.textContent = 'Скопировать ещё раз';
      } else {
        selectPreview();
        copyStatus.textContent = 'Автоматическое копирование недоступно. Текст выделен — нажмите Ctrl+C или ⌘C.';
        copyButton.textContent = 'Скопировать текст';
      }
    } catch (_) {
      details.open = true;
      copyStatus.textContent = 'Не удалось загрузить инструкцию. Откройте файл по ссылке в раскрытом блоке.';
      copyButton.textContent = 'Повторить копирование';
    } finally {
      copyButton.disabled = false;
      copyButton.setAttribute('aria-busy', 'false');
    }
  });
})();
