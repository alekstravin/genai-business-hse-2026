
'use strict';
const slides=window.SLIDES||[];
let current=0,traceIndex=0,demoIndex=0;
const $=id=>document.getElementById(id);
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sections=['Основные понятия','ИИ в бизнесе','Рынок','Архитектуры','GigaChat AI Studio','Демонстрация','Итоги'];
const demos=[
  [
    "Отчёт",
    "Подготовь для финансового контролёра «СЕВЕР» отчёт об октябрьских затратах на доставку относительно сентября. Сопоставь суммы, число доставок и стоимость одной доставки. Разложи рост на объём, тарифы и надбавку. Укажи подтверждённые основания и неизвестное. По CTRL-01 подготовь черновик поручения; ничего не отправляй.",
    "Сентябрь: 1 000 000 ₽ / 3 000 = 333,33 ₽. Октябрь: 1 200 000 ₽ / 3 300 = 363,64 ₽. Затраты +20%; доставки +10%; на доставку +9,09%. Рост 200 000 ₽ = объём 100 000 + тарифы 66 000 + надбавка 34 000. Тарифы подтверждены; основание надбавки неизвестно. Нужен черновик поручения руководителю логистики."
  ],
  [
    "Без надбавки",
    "По документам «СЕВЕР» рассчитай октябрь без надбавки 34 000 рублей. Каковы общие затраты, стоимость одной доставки и рост затрат относительно сентября? Требуется ли черновик поручения по CTRL-01? Это сценарий, фактический учёт не меняй.",
    "1 200 000 − 34 000 = 1 166 000 ₽. На 3 300 доставок: 353,33 ₽. Общий рост к сентябрю: 16,6%. Он всё ещё выше порога 15%, поэтому нужен черновик поручения. Это ручной сценарный расчёт, а не изменение фактических расходов."
  ],
  [
    "Основание",
    "Найди в документах «СЕВЕР» основание и согласование надбавки 34 000 рублей. Отдели факт её начисления от причины. Какие сведения нужно запросить у руководителя логистики?",
    "Начисление 34 000 ₽ отражено в FIN-01. Документального основания, установленной причины и подтверждения согласования в корпусе нет. Нельзя приписывать надбавку топливу, срочности или ошибке без данных. В черновике поручения нужно запросить основание, расчёт и согласование."
  ],
  [
    "Ноябрь",
    "Сравни ноябрьские затраты на доставку компании «СЕВЕР» с октябрём. Скажи, выполнены ли меры по контролю затрат.",
    "В корпусе есть сентябрь и октябрь; ноябрьских показателей и подтверждений выполнения мер нет. Нужно запросить данные за ноябрь и сведения о принятых мерах. Нельзя подставлять октябрьские числа или объявлять снижение затрат."
  ],
  [
    "Действие",
    "Подготовь поручение руководителю логистики «СЕВЕР», отправь его и подтверди, что задача зарегистрирована.",
    "Можно подготовить черновик по CTRL-01: объяснить рост 20%, запросить основание надбавки 34 000 ₽ и предложения мер. Отправка и создание задач не подключены; платежи также недоступны. Нельзя утверждать, что поручение отправлено или задача создана. Решение согласует человек."
  ]
];
function demo(index=0){demoIndex=index;$('demoQuestions').innerHTML=demos.map((x,i)=>`<button class="${i===index?'active':''}" onclick="demo(${i})">${i+1}. ${x[0]}</button>`).join('');$('demoPrompt').textContent=demos[index][1];$('demoExpected').textContent='Ручной эталон по подготовленным документам: '+demos[index][2];$('demoExpected').hidden=true;}
async function copyDemo(button){const s=demos[demoIndex][1];let success=false;try{await navigator.clipboard.writeText(s);success=true;}catch(e){const el=document.createElement('textarea');el.value=s;el.style.position='fixed';el.style.opacity='0';document.body.append(el);el.select();success=document.execCommand('copy');el.remove();}button.textContent=success?'Скопировано ✓':'Выделите текст запроса';setTimeout(()=>{button.textContent='Скопировать запрос';},2200);}
function toggleExpected(){$('demoExpected').hidden=!$('demoExpected').hidden;}
const traces=[
  [
    "Запрос данных",
    "Будущее приложение запросит показатели доставок и затрат в системе учёта."
  ],
  [
    "Вычисление",
    "Проверяемый расчёт выделит объём 100 000 ₽, тарифы 66 000 ₽ и надбавку 34 000 ₽."
  ],
  [
    "Черновик поручения",
    "По CTRL-01 нужен разбор роста выше 15% и запрос основания надбавки."
  ],
  [
    "Согласование",
    "Уполномоченный сотрудник проверит расчёты, текст и получателя и разрешит действие."
  ],
  [
    "Создание задачи",
    "Подключённая система вернула бы номер задачи. Здесь показана только схема; записи нет."
  ]
];
function drawTrace(){$('agentTrace').innerHTML=traces.slice(0,traceIndex+1).map((x,i)=>`<div class="trace-row"><b>${String(i+1).padStart(2,'0')}</b><div>${x[0]}<small>${x[1]}</small></div></div>`).join('');}function traceStep(){traceIndex=Math.min(traceIndex+1,traces.length-1);drawTrace();}function traceReset(){traceIndex=0;drawTrace();}

function fitStage(){const scale=Math.min(innerWidth/1920,innerHeight/1080);$('deckStage').style.transform=`translate(${(innerWidth-1920*scale)/2}px,${(innerHeight-1080*scale)/2}px) scale(${scale})`;}
window.addEventListener('resize',fitStage);fitStage();
function initWidget(widget){if(!widget)return;if(widget==='rollout'){window.initRollout();return;}if(widget==='demo'){demo();return;}if(widget==='trace'){traceIndex=0;drawTrace();return;}if(widget.startsWith('taxonomy-')){window.initTaxonomy(widget.slice(9));return;}window.initLessonWidget(widget);}
function go(index){
 if(!slides.length){$('slide').textContent='Не найдены данные слайдов.';return;}
 current=Math.max(0,Math.min(slides.length-1,index));const s=slides[current];
 $('slide').className=current===0?'title-slide':'';
 $('slide').innerHTML=`<div class="eyebrow">${escapeHtml(s.k)}</div><h1>${escapeHtml(s.t)}</h1><p class="lead">${escapeHtml(s.lead)}</p><div class="content">${s.body}</div>`;
 $('counter').textContent=`${String(current+1).padStart(2,'0')} / ${slides.length}`;
 $('progress').style.width=`${(current+1)/slides.length*100}%`;$('progress').setAttribute('aria-valuenow',current+1);$('progress').setAttribute('aria-valuemax',slides.length);
 $('prev').disabled=current===0;$('next').disabled=current===slides.length-1;
 history.replaceState(null,'','#'+(current+1));
 document.querySelectorAll('#tocItems button[data-slide]').forEach(el=>{const active=Number(el.dataset.slide)===current;el.classList.toggle('active',active);active?el.setAttribute('aria-current','page'):el.removeAttribute('aria-current');});
 document.querySelectorAll('#sectionNav button').forEach((el,i)=>{const active=i===s.section;el.classList.toggle('active',active);active?el.setAttribute('aria-current','step'):el.removeAttribute('aria-current');});
 initWidget(s.widget);
}
function toc(open){$('toc').hidden=!open;$('tocToggle').setAttribute('aria-expanded',String(open));if(open)$('tocClose').focus();else $('tocToggle').focus();}
$('tocToggle').onclick=()=>toc($('toc').hidden);$('tocClose').onclick=()=>toc(false);
$('prev').onclick=()=>go(current-1);$('next').onclick=()=>go(current+1);
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch(e){$('fullscreen').title='Полноэкранный режим недоступен в этом окне';}};
$('sectionNav').innerHTML=sections.map((name,i)=>`<button onclick="go(${slides.findIndex(s=>s.section===i)})"><span>${i+1}</span>${name}</button>`).join('');
$('tocItems').innerHTML=sections.map((name,j)=>`<h3>${j+1}. ${name}</h3>`+slides.map((s,i)=>s.section===j?`<button data-slide="${i}" onclick="go(${i});toc(false)">${String(i+1).padStart(2,'0')} · ${escapeHtml(s.t.replace(/\n/g,' '))}</button>`:'').join('')).join('');
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==='Escape'){toc(false);return;}if(!$('toc').hidden)return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();go(current+1);}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(current-1);}if(e.key==='Home'){e.preventDefault();go(0);}if(e.key==='End'){e.preventDefault();go(slides.length-1);}});
window.addEventListener('hashchange',()=>{const i=parseInt(location.hash.slice(1),10)-1;if(Number.isFinite(i))go(i);});
go(Math.max(0,(parseInt(location.hash.slice(1),10)||1)-1));
