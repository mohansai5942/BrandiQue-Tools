import{ageStats,birthMoment,isoDate}from'./age-stats.js';
import{calculateAge}from'./media-core.js';
const $=(s,r)=>r.querySelector(s);
const n0=n=>Math.round(n).toLocaleString('en-US');
const big=n=>n>=1e12?(n/1e12).toFixed(2)+' trillion':n>=1e9?(n/1e9).toFixed(2)+' billion':n>=1e6?(n/1e6).toFixed(2)+' million':n0(n);
const fmtDate=d=>d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
const plural=(n,w)=>`${n} ${w}${n===1?'':'s'}`;
export function mountAgeCalculator(r){
 r.innerHTML=`<div class="age-app">
 <section class="age-input media-card"><h2>Your birth details</h2>
  <div class="age-fields"><label class="media-label">Birth date<input data-birth type="date" required></label><label class="media-label">Birth time <span class="age-opt">(optional)</span><input data-time type="time"></label><label class="media-label">Calendar age on<input data-asof type="date"></label></div>
  <p class="media-status" data-status aria-live="polite">Enter your birth date — everything updates instantly and keeps ticking live.</p>
  <p class="media-help">Calendar age uses real calendar months. A 29 February birthday counts as 28 February in non-leap years. Nothing leaves your device.</p></section>
 <div class="age-out" data-out hidden></div></div>`;
 const now=new Date();$('[data-asof]',r).value=isoDate(now);$('[data-birth]',r).max=isoDate(now);
 let timer=0,birth=null;
 const status=(t,c='')=>{const s=$('[data-status]',r);s.textContent=t;s.dataset.tone=c};
 function skeleton(){const o=$('[data-out]',r);o.hidden=false;o.innerHTML=`
  <section class="age-card age-hero"><p class="age-k">Calendar age</p><div class="age-value" data-cal></div><p class="age-sub" data-calsub></p></section>
  <section class="age-card age-next"><p class="age-k" data-nextk>Next birthday · live countdown</p><div class="age-count" data-count></div><p class="age-sub" data-nextsub></p></section>
  <section class="age-card age-wide"><h3>Your age right now <span class="age-live" aria-hidden="true">● live</span> <span class="age-approx" data-nowlabel hidden>based on today, not the “age on” date</span></h3><div class="age-grid age-g7" data-totals></div></section>
  <section class="age-card age-wide"><h3>About your birthday</h3><div class="age-grid age-g4" data-facts></div></section>
  <section class="age-card age-wide"><h3>Your life in numbers <span class="age-approx">approximate</span></h3><div class="age-grid age-g4" data-est></div><p class="media-help">Estimates use average rates — heart 80 beats/min, 16 breaths/min, sleep about one third of life, 3 meals a day, 15 blinks per waking minute, about 6,000 steps a day after age one, Earth moving 29.78 km/s around the Sun, a full moon every 29.53 days. Real numbers vary from person to person; this is for fun, not medical fact.</p></section>
  <section class="age-card"><h3>Your age on other planets</h3><div class="age-list" data-planets></div></section>
  <section class="age-card"><h3>Milestones</h3><div class="age-list" data-miles></div></section>`}
 const tile=(k,v,sub='')=>`<div class="age-tile"><small>${k}</small><b>${v}</b>${sub?`<span>${sub}</span>`:''}</div>`;
 // CALC-02: when “Calendar age on” is not today, the birthday panel follows that date instead of contradicting it.
 const asofDate=()=>$('[data-asof]',r).value||isoDate(new Date()),customAsof=()=>asofDate()!==isoDate(new Date());
 function asofBirthday(cal,asof){const on=fmtDate(new Date(asof+'T00:00')),next=fmtDate(new Date(cal.nextBirthday+'T00:00'));$('[data-nextk]',r).textContent=`Birthday · as of ${on}`;$('[data-count]',r).innerHTML=cal.months===0&&cal.days===0?`<b class="age-bday">🎉 Birthday — turns ${cal.years} on this date</b>`:`<div><b>${cal.daysToBirthday}</b><small>days later</small></div>`;$('[data-nextsub]',r).textContent=`Next birthday after that date: turns ${cal.years+1} on ${next}${cal.months===0&&cal.days===0?` (${cal.daysToBirthday} days later)`:''}.`}
 function staticParts(s){
  const asof=asofDate();let cal;try{cal=calculateAge(isoDate(birth),asof)}catch(e){cal=null}
  $('[data-nowlabel]',r).hidden=!customAsof();if(customAsof()&&cal)asofBirthday(cal,asof);else if(customAsof()){$('[data-nextk]',r).textContent='Next birthday';$('[data-count]',r).innerHTML='';$('[data-nextsub]',r).textContent='—'}else $('[data-nextk]',r).textContent='Next birthday · live countdown';
  $('[data-cal]',r).textContent=cal?plural(cal.years,'year'):'—';
  $('[data-calsub]',r).textContent=cal?`${plural(cal.months,'month')} and ${plural(cal.days,'day')} · on ${fmtDate(new Date(asof+'T00:00'))}`:'The “age on” date is before the birth date.';
  $('[data-facts]',r).innerHTML=tile('Day you were born',s.bornOn,fmtDate(birth))+tile('Zodiac sign',`${s.zodiac.symbol} ${s.zodiac.name}`)+tile('Chinese zodiac',`${s.chinese.element} ${s.chinese.animal}`,s.chinese.nearNewYear?'By birth year — Chinese New Year is late Jan–Feb, so check yours':'By birth year')+tile('Birthstone',s.stone)+tile('Birth flower',s.flower)+tile('Generation',s.generation)+tile('Leap days lived',n0(s.leapDays),'29 Februarys since birth')+(nd=>tile(customAsof()?'Next birthday after the “age on” date falls on':'Next birthday falls on',nd.toLocaleDateString('en-US',{weekday:'long'}),fmtDate(nd)))(customAsof()&&cal?new Date(cal.nextBirthday+'T00:00'):s.next.date);
  $('[data-planets]',r).innerHTML=s.planets.map(p=>`<div class="age-row"><span>${p.name}</span><b>${p.age<10?p.age.toFixed(2):p.age.toFixed(1)} years</b></div>`).join('');
  const nowMs=Date.now();$('[data-miles]',r).innerHTML=s.milestones.map(m=>{const dd=Math.ceil((m.date-nowMs)/864e5);return`<div class="age-row ${m.past?'is-past':''}"><span>${m.label}</span><b>${fmtDate(m.date)}</b><em>${m.past?'✓ passed':dd<=1?'tomorrow':`in ${n0(dd)} days`}</em></div>`}).join('')}
 function tick(){if(!birth)return;let s;try{s=ageStats(birth,new Date())}catch(e){stop();return status(e.message,'error')}
  const t=s.totals;
  $('[data-totals]',r).innerHTML=tile('Years',t.years.toFixed(8))+tile('Months',n0(t.months))+tile('Weeks',n0(t.weeks))+tile('Days',n0(t.days))+tile('Hours',n0(t.hours))+tile('Minutes',n0(t.minutes))+tile('Seconds',n0(t.seconds));
  const n=s.next;if(!customAsof()){$('[data-count]',r).innerHTML=n.today?'<b class="age-bday">🎉 Happy birthday!</b>':['days','hours','minutes','seconds'].map(k=>`<div><b>${k==='days'?n[k]:String(n[k]).padStart(2,'0')}</b><small>${k}</small></div>`).join('');
  $('[data-nextsub]',r).textContent=`You turn ${n.turning} on ${fmtDate(n.date)}${birth.getMonth()===1&&birth.getDate()===29&&n.date.getDate()===28?' (28 Feb — no 29 Feb this year)':''}.`}
  const e=s.estimates;$('[data-est]',r).innerHTML=tile('Heartbeats','≈ '+big(e.heartbeats))+tile('Breaths','≈ '+big(e.breaths))+tile('Hours asleep','≈ '+big(e.sleepHours),`about ${n0(e.sleepHours/8760)} years`)+tile('Meals eaten','≈ '+big(e.meals))+tile('Blinks','≈ '+big(e.blinks))+tile('Steps walked','≈ '+big(e.steps))+tile('Distance travelled around the Sun','≈ '+big(e.earthKm)+' km')+tile('Full moons seen','≈ '+n0(e.fullMoons));
  return s}
 function stop(){clearInterval(timer);timer=0}
 function start(){stop();if(!birth||document.hidden)return;timer=setInterval(tick,1000)}
 function run(){stop();const v=$('[data-birth]',r).value;if(!v){$('[data-out]',r).hidden=true;birth=null;return status('Enter your birth date — everything updates instantly and keeps ticking live.')}
  try{birth=birthMoment(v,$('[data-time]',r).value);if(birth>new Date())throw new Error('The birth date and time must be in the past.');skeleton();const s=tick();if(!s)return;staticParts(s);status('Calculated on your device — the live numbers update every second.','success');start()}
  catch(e){birth=null;$('[data-out]',r).hidden=true;status(e.message,'error')}}
 r.addEventListener('input',run);r.addEventListener('change',run);
 // Timers stop when the tab is hidden or the page is left, and resume when it is visible again.
 document.addEventListener('visibilitychange',()=>document.hidden?stop():birth&&(tick(),start()));
 addEventListener('pagehide',stop);
 return{stop,get running(){return!!timer}};
}
const root=typeof document!=='undefined'&&document.querySelector('[data-tool]');if(root)mountAgeCalculator(root);
