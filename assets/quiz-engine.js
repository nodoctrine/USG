'use strict';
// Reads QUESTIONS, CHAPTER_NAMES, QUIZ_KEY from inline script in the quiz page.

// ── STORAGE ───────────────────────────────────────────────────────
function loadData(){return JSON.parse(localStorage.getItem(QUIZ_KEY)||'{"perf":{},"log":[]}');}
function saveData(d){localStorage.setItem(QUIZ_KEY,JSON.stringify(d));}

// ── STATE ─────────────────────────────────────────────────────────
let currentMode='standard';
let quizQueue=[];
let qIndex=0;
let answers=[];
let selectedChapters=new Set();

// ── MODE ──────────────────────────────────────────────────────────
function setMode(mode){
  currentMode=mode;
  document.getElementById('mode-btn-standard').classList.toggle('active',mode==='standard');
  document.getElementById('mode-btn-weakness').classList.toggle('active',mode==='weakness');
}
function setModeAndStart(mode){setMode(mode);startQuiz();}

// ── CHAPTER FILTER ────────────────────────────────────────────────
function getFilteredPool(){
  if(selectedChapters.size===0) return QUESTIONS;
  return QUESTIONS.filter(q=>selectedChapters.has(q.chapter));
}

function updatePoolCount(){
  document.getElementById('pool-count').textContent=getFilteredPool().length;
}

function buildChapterFilter(){
  const chapters=[...new Set(QUESTIONS.map(q=>q.chapter))].sort((a,b)=>a-b);
  chapters.forEach(ch=>selectedChapters.add(ch));
  if(chapters.length<=1){document.getElementById('chapter-filter').hidden=true;updatePoolCount();return;}
  const el=document.getElementById('chapter-chips');
  el.innerHTML=chapters.map(ch=>
    `<button class="chip active" id="chip-ch${ch}" onclick="toggleChapter(${ch})">${CHAPTER_NAMES[ch]||'Chapter '+ch}</button>`
  ).join('');
  updatePoolCount();
}

function toggleChapter(ch){
  if(selectedChapters.has(ch)) selectedChapters.delete(ch); else selectedChapters.add(ch);
  document.getElementById('chip-ch'+ch).classList.toggle('active',selectedChapters.has(ch));
  updatePoolCount();
}

// ── QUESTION SELECTION ────────────────────────────────────────────
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function weightedSelect(pool,perf,count){
  const avail=pool.map(q=>{const h=perf[q.id]||{c:0,w:0};return{q,weight:(h.w+1)/(h.c+1)};});
  const result=[];
  while(result.length<count&&avail.length>0){
    const total=avail.reduce((s,x)=>s+x.weight,0);
    let r=Math.random()*total;
    for(let i=0;i<avail.length;i++){r-=avail[i].weight;if(r<=0){result.push(avail[i].q);avail.splice(i,1);break;}}
  }
  return result;
}

function selectQuestions(){
  const pool=getFilteredPool();
  const count=Math.min(10,pool.length);
  const data=loadData();
  if(currentMode==='weakness'&&Object.keys(data.perf).length>0) return weightedSelect(pool,data.perf,count);
  return shuffle(pool).slice(0,count);
}

// ── QUIZ FLOW ─────────────────────────────────────────────────────
function startQuiz(){
  if(getFilteredPool().length===0){alert('Please select at least one chapter.');return;}
  quizQueue=selectQuestions();
  qIndex=0;
  answers=new Array(quizQueue.length).fill(null);
  showScreen('quiz');
  renderQuestion();
}

function liveScore(){
  return answers.filter((a,i)=>a&&quizQueue[i]&&a.chosen===quizQueue[i].correct).length;
}

function renderQuestion(){
  const q=quizQueue[qIndex];
  const ans=answers[qIndex];
  const isAnswered=ans!==null;

  document.getElementById('q-counter').textContent=`Question ${qIndex+1} of ${quizQueue.length}`;
  document.getElementById('q-score-live').textContent=qIndex>0?`${liveScore()} correct`:'';

  const btnPrev =document.getElementById('btn-prev');
  const btnCheck=document.getElementById('btn-check');
  const btnNext =document.getElementById('btn-next');
  btnPrev.hidden=qIndex===0;
  btnNext.textContent=qIndex===quizQueue.length-1?'See Results →':'Next →';

  const exp=document.getElementById('q-exp');
  exp.className='explanation';
  exp.innerHTML='';

  let html=`<div class="q-topic">${q.topic}</div><div class="q-text">${q.text}</div>`;

  if(isAnswered){
    if(q.formula) html+=`<div class="q-formula-box">${q.formula}</div>`;
    html+=`<div class="choices">`;
    ['a','b','c','d'].forEach(k=>{
      if(!q.choices[k]) return;
      let cls='choice';
      if(k===q.correct) cls+=' correct';
      else if(k===ans.chosen) cls+=' incorrect';
      const checked=k===ans.chosen?' checked':'';
      html+=`<label class="${cls}"><input type="radio" name="quiz-q" value="${k}"${checked} disabled> <span>${q.choices[k]}</span></label>`;
    });
    html+=`</div>`;
    document.getElementById('q-card').innerHTML=html;

    if(ans.revealed){
      exp.innerHTML=`<strong>Answer revealed.</strong> ${q.explanation}`;
      exp.className='explanation visible wrong';
    } else if(ans.chosen===null){
      exp.innerHTML=`<strong>Skipped.</strong> ${q.explanation}`;
      exp.className='explanation visible wrong';
    } else {
      const ok=ans.chosen===q.correct;
      exp.innerHTML=ok?`<strong>Correct!</strong> ${q.explanation}`:`<strong>Incorrect.</strong> ${q.explanation}`;
      exp.className='explanation visible'+(ok?'':' wrong');
    }
    btnCheck.hidden=true;
    btnNext.hidden=false;
  } else {
    if(q.formula) html+=`<div class="q-formula-box" id="q-formula" hidden>${q.formula}</div>`;
    html+=`<div class="choices">`;
    ['a','b','c','d'].forEach(k=>{
      if(!q.choices[k]) return;
      html+=`<label class="choice"><input type="radio" name="quiz-q" value="${k}"> <span>${q.choices[k]}</span></label>`;
    });
    html+=`</div>`;
    let hints=q.formula?`<button class="btn btn-ghost btn-sm" onclick="toggleFormulaHint()">&#128161; Hint</button>`:'';
    hints+=`<button class="btn btn-ghost btn-sm" onclick="revealAnswer()">&#128065; Show Answer</button>`;
    html+=`<div class="q-hints" id="q-hints">${hints}</div>`;
    document.getElementById('q-card').innerHTML=html;

    btnCheck.hidden=false;
    btnCheck.disabled=true;
    btnNext.hidden=true;

    document.querySelectorAll('input[name="quiz-q"]').forEach(inp=>{
      inp.addEventListener('change',()=>{
        btnCheck.disabled=false;
        btnNext.hidden=false;
      });
    });
  }
}

function commitAnswer(chosen,revealed){
  const q=quizQueue[qIndex];
  answers[qIndex]={chosen,revealed};
  const ok=chosen===q.correct;
  const data=loadData();
  if(!data.perf[q.id]) data.perf[q.id]={c:0,w:0};
  if(ok) data.perf[q.id].c++; else data.perf[q.id].w++;
  saveData(data);

  document.querySelectorAll('input[name="quiz-q"]').forEach(inp=>{
    inp.disabled=true;
    const lbl=inp.closest('.choice');
    if(inp.value===q.correct) lbl.classList.add('correct');
    else if(inp.value===chosen&&!ok) lbl.classList.add('incorrect');
  });

  const f=document.getElementById('q-formula'); if(f) f.hidden=false;
  const hints=document.getElementById('q-hints'); if(hints) hints.remove();

  const exp=document.getElementById('q-exp');
  if(revealed){
    exp.innerHTML=`<strong>Answer revealed.</strong> ${q.explanation}`;
    exp.className='explanation visible wrong';
  } else if(chosen===null){
    exp.innerHTML=`<strong>Skipped.</strong> ${q.explanation}`;
    exp.className='explanation visible wrong';
  } else {
    exp.innerHTML=ok?`<strong>Correct!</strong> ${q.explanation}`:`<strong>Incorrect.</strong> ${q.explanation}`;
    exp.className='explanation visible'+(ok?'':' wrong');
  }

  document.getElementById('btn-check').hidden=true;
  document.getElementById('btn-next').hidden=false;
  document.getElementById('q-score-live').textContent=`${liveScore()} correct`;
}

function checkAnswer(){
  if(answers[qIndex]!==null) return;
  const sel=document.querySelector('input[name="quiz-q"]:checked');
  if(!sel) return;
  commitAnswer(sel.value,false);
}

function nextQuestion(){
  if(answers[qIndex]===null){
    const sel=document.querySelector('input[name="quiz-q"]:checked');
    commitAnswer(sel?sel.value:null,false);
  }
  qIndex++;
  if(qIndex>=quizQueue.length) showResults(); else renderQuestion();
}

function prevQuestion(){
  qIndex--;
  renderQuestion();
}

function toggleFormulaHint(){
  const f=document.getElementById('q-formula');if(f) f.hidden=!f.hidden;
}

function revealAnswer(){
  if(answers[qIndex]!==null) return;
  commitAnswer(null,true);
}

// ── RESULTS ───────────────────────────────────────────────────────
function showResults(){
  answers.forEach((a,i)=>{if(a===null) answers[i]={chosen:null,revealed:false};});
  const total=quizQueue.length;
  const correctCount=answers.filter((a,i)=>a&&a.chosen===quizQueue[i].correct).length;
  const pct=Math.round((correctCount/total)*100);
  const tier=pct===100?'perfect':pct>=70?'good':pct>=50?'mid':'bad';
  const msgs={perfect:'Perfect score!',good:'Great work!',mid:'Getting there!',bad:'Keep practising!'};

  const sd=document.getElementById('score-display');
  sd.textContent=`${correctCount} / ${total}`;sd.className='score-display '+tier;
  document.getElementById('score-label').textContent=msgs[tier];

  const wrongItems=[];
  answers.forEach((a,i)=>{
    if(!a||a.chosen===quizQueue[i].correct) return;
    wrongItems.push({q:quizQueue[i],chosen:a.chosen,revealed:a.revealed});
  });
  const ws=document.getElementById('wrong-section'),wl=document.getElementById('wrong-list');
  if(wrongItems.length>0){
    ws.hidden=false;
    wl.innerHTML=wrongItems.map(({q,chosen,revealed})=>{
      const qText=q.text.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
      let yourAns;
      if(revealed) yourAns='<em>Answer revealed</em>';
      else if(chosen===null) yourAns='<em>Skipped</em>';
      else yourAns='Your answer: '+q.choices[chosen];
      return `<div class="wrong-item"><div class="wrong-item-q">${qText}</div><div class="wrong-item-ans">${yourAns} &nbsp;&middot;&nbsp;<span class="correct-ans">Correct: ${q.choices[q.correct]}</span></div></div>`;
    }).join('');
  } else {ws.hidden=true;}

  document.getElementById('btn-wk-result').hidden=currentMode==='weakness';

  const data=loadData();
  data.log.unshift({ts:Date.now(),mode:currentMode,score:correctCount,total});
  if(data.log.length>20) data.log=data.log.slice(0,20);
  saveData(data);
  renderHistory('history-results');
  showScreen('results');
}

// ── HISTORY ───────────────────────────────────────────────────────
function renderHistory(id){
  const el=document.getElementById(id);if(!el) return;
  const data=loadData();if(!data.log.length){el.innerHTML='';return;}
  const rows=data.log.map(e=>{
    const pct=Math.round((e.score/e.total)*100);
    const cls=pct>=70?'good':pct>=50?'mid':'bad';
    const date=new Date(e.ts).toLocaleDateString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    const mode=e.mode==='weakness'?'&#9889; Weakness':'Standard';
    return `<tr><td>${date}</td><td>${mode}</td><td class="history-score ${cls}">${e.score} / ${e.total}</td></tr>`;
  }).join('');
  el.innerHTML=`<div class="history-section"><div class="history-heading">Past Attempts</div><table class="history-table"><thead><tr><th>Date</th><th>Mode</th><th>Score</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

// ── SCREENS ───────────────────────────────────────────────────────
function showScreen(name){
  ['setup','quiz','results'].forEach(s=>{document.getElementById('screen-'+s).hidden=s!==name;});
  if(name==='setup') renderHistory('history-setup');
  window.scrollTo(0,0);
}
function showSetup(){showScreen('setup');}

buildChapterFilter();
renderHistory('history-setup');
