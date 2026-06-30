const panels=[...document.querySelectorAll('.app-panel')];
const buttons=[...document.querySelectorAll('.bottom-nav button')];
buttons.forEach(btn=>btn.addEventListener('click',()=>{const tab=btn.dataset.tab;panels.forEach(p=>p.classList.toggle('active',p.id===tab));buttons.forEach(b=>b.classList.toggle('active',b===btn));window.scrollTo({top:0,behavior:'smooth'});}));
const tripStart=new Date('2026-08-31T09:00:00');
const now=new Date();
const days=Math.max(0,Math.ceil((tripStart-now)/(1000*60*60*24)));
document.getElementById('countdownDays').textContent=days;
const routeRatings={
  west:{name:'Route 1 — West & Islay',golf:9,spa:7,scenery:9,driving:5,dog:8},
  highlands:{name:'Route 2 — Highlands',golf:9,spa:5,scenery:10,driving:3,dog:7},
  east:{name:'Route 3 — East Coast',golf:9,spa:10,scenery:7,driving:9,dog:10}
};
function updateRecommendation(){
  const weights={};document.querySelectorAll('[data-priority]').forEach(i=>weights[i.dataset.priority]=+i.value);
  const scored=Object.values(routeRatings).map(r=>({name:r.name,score:Object.keys(weights).reduce((s,k)=>s+(r[k]||0)*weights[k],0)})).sort((a,b)=>b.score-a.score);
  document.getElementById('routeRecommendation').textContent=`Recommended: ${scored[0].name}`;
}
document.querySelectorAll('[data-priority]').forEach(i=>i.addEventListener('input',updateRecommendation));updateRecommendation();
function updateBudget(){let total=0;document.querySelectorAll('.budget-range').forEach(r=>{const value=+r.value;total+=value;r.parentElement.querySelector('span').textContent=value.toLocaleString();});document.getElementById('budgetTotal').textContent='£'+total.toLocaleString();}
document.querySelectorAll('.budget-range').forEach(r=>r.addEventListener('input',updateBudget));updateBudget();
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
