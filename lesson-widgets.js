/* No model calls: these controls reveal the structure of an illustrative system. */
(function(){
  'use strict';
  let activeName='',step=0,selected=0;
  const root=()=>document.getElementById('lessonWidget');
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const svg=(title,body)=>`<svg class="lesson-diagram" viewBox="0 0 1660 235" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><defs><marker id="lesson-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#254b9b"/></marker></defs>${body}</svg>`;
  function node(x,y,w,h,lines,on=false,secondary=false){
    const texts=Array.isArray(lines)?lines:[lines];
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="lesson-node${on?' lesson-selected':''}${secondary?' lesson-secondary':''}"/>`+texts.map((t,i)=>`<text x="${x+w/2}" y="${y+h/2+(i-(texts.length-1)/2)*29}" class="lesson-label${on?' lesson-selected':''}">${esc(t)}</text>`).join('');
  }
  const arrow=(d,soft=false)=>`<path d="${d}" class="${soft?'lesson-soft-connector':'lesson-connector'}" marker-end="url(#lesson-arrow)"/>`;
  const label=(x,y,t)=>`<text x="${x}" y="${y}" class="lesson-small-label">${esc(t)}</text>`;
  const buttons=(items)=>`<div class="lesson-controls" role="group" aria-label="Варианты схемы">${items.map((t,i)=>`<button type="button" data-lesson-choice="${i}" aria-pressed="${selected===i}">${esc(t)}</button>`).join('')}</div>`;
  const steps=(total)=>`<div class="lesson-controls" role="group" aria-label="Шаги схемы"><button type="button" data-lesson-action="next" ${step===total-1?'disabled':''}>Следующий шаг →</button><button type="button" data-lesson-action="reset">Сначала</button><span class="lesson-count">${step+1} / ${total}</span></div>`;
  const caption=t=>`<p class="lesson-caption" aria-live="polite">${esc(t)}</p>`;
  const view={
    model(){
      const hasData=selected===1;
      return buttons(['Без данных компании','Данные переданы модели'])+svg('Контекст поступает в языковую модель, которая формирует ответ',
        node(30,65,460,94,hasData?['Вопрос + суммы','+ пояснения']:['Только вопрос:','«Почему выросли затраты?»'],true)+
        arrow('M 510 112 H 655')+node(675,65,300,94,['Языковая','модель'])+
        arrow('M 995 112 H 1140')+node(1160,65,460,94,hasData?['Черновик объяснения','по переданным сведениям']:['Общие версии причин','без фактов компании'])
      )+caption(hasData?'Переданные сведения позволяют составить предметный ответ, но правильность вывода всё равно нужно проверять.':'Без данных компании модель может предложить общие версии, но не установить реальную причину изменения затрат.');
    },
    agentloop(){
      const data=[
        ['Поручение','объяснить рост затрат'],['Выбрать','следующую проверку'],['Инструмент','получить данные'],['Наблюдение','результат проверки'],['Решить:','ещё шаг / завершить']
      ];
      const xs=[20,350,680,1010,1340];
      let body=data.map((a,i)=>node(xs[i],55,280,78,a,step===i)).join('');
      body+=xs.slice(0,4).map(x=>arrow(`M ${x+290} 94 H ${x+320}`)).join('');
      body+=arrow('M 1480 145 V 195 H 490 V 145')+label(960,224,'Если данных недостаточно — новый шаг');
      body+=arrow('M 1480 45 V 16 H 1615')+label(1260,22,'Цель достигнута');
      const captions=[
        'Цель задаёт требуемый результат: подготовить обоснованное объяснение изменения затрат.',
        'Модель выбирает разрешённую проверку: например, запросить число доставленных заказов.',
        'Приложение вызывает инструмент и получает сведения из учётной системы.',
        'Результат инструмента становится новым наблюдением для модели.',
        'По новым сведениям модель выбирает ещё одну проверку или завершает подготовку отчёта.'
      ];
      return steps(5)+svg('Агентный цикл с обратной связью и условием завершения',body)+caption(captions[step]);
    },
    enterprise(){
      const nodes=[
        [30,30,450,75,['Данные компании','учёт и документы']],
        [1180,30,450,75,['Инструменты','поиск, расчёт, сохранение']],
        [30,145,450,75,['Права доступа','разрешённые операции']],
        [1180,145,450,75,['Журнал работы','вызовы и результаты']]
      ];
      let body=node(630,82,400,90,['Модель в приложении'],false,true);
      body+=arrow('M 490 67 H 550 V 107 H 620')+arrow('M 1040 107 H 1100 V 67 H 1170');
      body+=arrow('M 490 182 H 550 V 147 H 620')+arrow('M 1040 147 H 1100 V 182 H 1170');
      body+=nodes.map((a,i)=>node(...a,selected===i)).join('');
      const captions=[
        'Данные дают модели факты компании: суммы за нужный период и документы, объясняющие изменения.',
        'Инструменты позволяют приложению получать новые сведения и выполнять разрешённые операции.',
        'Права задают границы: агент может читать расходы и сохранять черновик, но не утверждать бюджет.',
        'Журнал сохраняет использованные данные и действия, чтобы сотрудник мог разобрать ошибку.'
      ];
      return buttons(['Данные','Инструменты','Права','Журнал'])+svg('Модель соединена с данными, инструментами, правами и журналом приложения',body)+caption(captions[selected]);
    },
    patterns(){
      const names=['Цепочка','Маршрутизация','Параллельность','Проверка и исправление'];
      let body='';
      if(selected===0){
        const ns=[['Данные учёта'],['Расчёт отклонений'],['Поиск пояснений'],['Отчёт']];
        const xs=[25,440,855,1270];
        body=ns.map((n,i)=>node(xs[i],75,340,80,n,i===1)).join('')+xs.slice(0,3).map(x=>arrow(`M ${x+355} 115 H ${x+400}`)).join('');
      }else if(selected===1){
        body=node(30,78,390,80,['Определить вопрос'],true)+arrow('M 440 118 H 610');
        body+=arrow('M 610 118 V 40 H 770')+arrow('M 610 118 H 770')+arrow('M 610 118 V 196 H 770');
        body+=node(790,7,650,65,['Сумма → учётная система'])+node(790,85,650,65,['Тариф → документы'])+node(790,163,650,65,['Неясная причина → сотрудник']);
        body+=label(1540,120,'Один путь');
      }else if(selected===2){
        body=node(15,78,295,80,['Разделить анализ'])+arrow('M 325 118 H 390');
        body+=arrow('M 390 118 V 40 H 505')+arrow('M 390 118 H 505')+arrow('M 390 118 V 196 H 505');
        body+=node(525,7,590,65,['Транспорт'],true)+node(525,85,590,65,['Аренда'],true)+node(525,163,590,65,['Материалы'],true);
        body+=arrow('M 1130 40 H 1245 V 118')+arrow('M 1130 118 H 1245')+arrow('M 1130 196 H 1245 V 118');
        body+=arrow('M 1245 118 H 1310')+node(1330,78,315,80,['Объединить','результаты']);
      }else{
        body=node(40,55,390,80,['Черновик отчёта'])+arrow('M 450 95 H 620')+node(640,55,390,80,['Сверить суммы','и источники'],true)+arrow('M 1050 95 H 1220')+node(1240,55,370,80,['Принятый проект']);
        body+=arrow('M 835 145 V 200 H 235 V 145')+label(535,228,'Есть ошибка → исправить');
        body+=label(1130,75,'Ошибок не найдено');
      }
      const captions=[
        'Цепочка подходит, когда результат каждого этапа нужен для следующего: сначала расчёт, затем объяснение.',
        'Маршрутизация выбирает подходящий путь обработки в зависимости от того, какие сведения нужны.',
        'Независимые части анализа выполняются одновременно, а их результаты затем объединяются.',
        'Отдельная проверка возвращает замечания к черновику, после чего он исправляется и проверяется снова.'
      ];
      return buttons(names)+svg(names[selected]+' при подготовке отчёта о затратах',body)+caption(captions[selected]);
    },
    rag(){
      let body='<text x="25" y="24" class="lesson-phase">Подготовка документов</text><text x="25" y="139" class="lesson-phase">При каждом вопросе</text>';
      body+=node(360,0,350,68,['Документы'],step===0)+arrow('M 725 34 H 855')+node(875,0,350,68,['Фрагменты и индекс'],step===1);
      body+='<line x1="20" y1="99" x2="1640" y2="99" class="lesson-divider"/>';
      const xs=[20,455,890,1325];
      const texts=[['Вопрос о затратах'],['Поиск фрагментов'],['Контекст для модели'],['Ответ']];
      body+=texts.map((t,i)=>node(xs[i],155,i===3?315:350,68,t,step===i+2)).join('');
      body+=xs.slice(0,3).map(x=>arrow(`M ${x+365} 189 H ${x+420}`)).join('');
      body+=arrow('M 1050 78 V 118 H 630 V 145',true);
      const captions=[
        'Сначала документы организации добавляют в поисковую базу отдельно от обучения языковой модели.',
        'Документы делят на осмысленные фрагменты и создают индекс для поиска.',
        'Когда приходит вопрос, начинается поиск сведений, относящихся к конкретному поручению.',
        'Поисковый слой выбирает подходящие фрагменты из подготовленного индекса.',
        'Вопрос и найденные фрагменты вместе передаются модели как контекст.',
        'Модель формулирует ответ по доступному контексту, а сотрудник может сверить вывод с исходными документами.'
      ];
      return steps(6)+svg('RAG: подготовка документов отдельно от поиска при каждом вопросе',body)+caption(captions[step]);
    },
    tools(){
      const ns=[['Модель','что запросить?'],['Приложение','разрешено ли?'],['API системы','получить расходы'],['Результат','сумма и период']];
      const xs=[20,450,880,1310];
      let body=ns.map((n,i)=>node(xs[i],50,330,86,n,step===i)).join('');
      body+=xs.slice(0,3).map(x=>arrow(`M ${x+345} 93 H ${x+415}`)).join('');
      body+=arrow('M 1475 148 V 200 H 185 V 148')+label(830,228,'Результат возвращается модели для следующего шага');
      const captions=[
        'Модель формирует структурированный запрос: получить транспортные расходы подразделения за октябрь.',
        'Приложение проверяет права сотрудника и допустимость параметров до выполнения операции.',
        'Разрешённый запрос передаётся через API в учётную систему, где находятся актуальные данные.',
        'Ответ системы возвращается модели, которая использует полученные сведения при подготовке отчёта.'
      ];
      return steps(4)+svg('Вызов инструмента: модель, проверка приложением, API и возврат результата',body)+caption(captions[step]);
    }
  };
  function render(){const target=root();if(!target)return;target.innerHTML=view[activeName]?view[activeName]():'';}
  window.initLessonWidget=function(name){
    activeName=name;step=0;selected=0;
    const target=root();if(!target)return;
    target.onclick=function(event){
      const button=event.target.closest('button');
      if(!button||!target.contains(button))return;
      if(button.dataset.lessonChoice!==undefined)selected=Number(button.dataset.lessonChoice);
      if(button.dataset.lessonAction==='reset')step=0;
      if(button.dataset.lessonAction==='next')step++;
      render();
    };
    render();
  };
})();
