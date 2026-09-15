/* ============================================================
   Shared fasting-medication engine — used by all 9 fasting tool
   pages. Load this file BEFORE each page's own inline script:
     <script is:inline src="/js/fasting-engine.js"></script>
   Every function here is attached to the global scope (plain
   script, not a module) so existing inline onclick handlers and
   page scripts can call them directly.
   ============================================================ */

// ---------- Basic time helpers ----------
function timeToMin(hhmm){ const [h,m] = hhmm.split(':').map(Number); return h*60+m; }
function minToTime(mins){ mins=((mins%1440)+1440)%1440; const h=Math.floor(mins/60), m=mins%60; return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'); }
function round5(mins){ return Math.round(mins/5)*5; }
function foodOffset(rel){ if(rel==='before') return -30; if(rel==='after') return 30; return 0; }

// ---------- Medication categories ----------
const CATEGORY_LABELS = {
  ar: { insulin:'أنسولين', 'oral-diabetes':'دواء سكري فموي', diuretic:'مدر بول', bp:'ضغط', antibiotic:'مضاد حيوي', other:'أخرى' },
  en: { insulin:'Insulin', 'oral-diabetes':'Oral diabetes medicine', diuretic:'Diuretic', bp:'Blood pressure', antibiotic:'Antibiotic', other:'Other' }
};
const DIABETES_CATS = ['insulin','oral-diabetes'];

// ---------- Base daily schedule (shared by every page) ----------
// meds: [{id, name, category, freqType:'times'|'interval', freqValue, foodRelation, precision, preferredAnchor}]
// profile: {wake:'HH:MM', sleep:'HH:MM', workStart, workEnd, meals:{breakfast:{enabled,time}, dinner:{enabled,time}, lunch:{enabled,time}}}
function computeBaseSchedule(profile, meds){
  const wake = timeToMin(profile.wake), sleep = timeToMin(profile.sleep);
  const awakeLen = sleep - wake;
  const mealKeys = ['breakfast','lunch','dinner'].filter(k => profile.meals && profile.meals[k]);
  const enabledMeals = mealKeys.filter(k => profile.meals[k].enabled);
  const results = [];

  meds.forEach(med => {
    let doseTimes = [];
    if (med.freqType === 'interval'){
      const X = med.freqValue;
      const doses = Math.round(24/X);
      const medPrecision = med.precision || 'strict';
      if (medPrecision === 'strict'){
        const ws = (profile.workStart && profile.workEnd) ? timeToMin(profile.workStart) : null;
        const we = (profile.workStart && profile.workEnd) ? timeToMin(profile.workEnd) : null;
        const isAsleep = t => (t < wake || t > sleep);
        const isAtWork = t => (ws !== null && t >= ws && t <= we);
        let bestPhase = wake % (X*60), bestBad = Infinity, bestDist = Infinity;
        for (let phase = 0; phase < X*60; phase += 10){
          let bad = 0;
          for (let i=0;i<doses;i++){
            const t = (phase + i*X*60) % 1440;
            if (isAsleep(t)) bad += 2; else if (isAtWork(t)) bad += 1;
          }
          const dist = Math.min(Math.abs(phase - (wake % (X*60))), X*60 - Math.abs(phase - (wake % (X*60))));
          if (bad < bestBad || (bad === bestBad && dist < bestDist)){ bestBad = bad; bestDist = dist; bestPhase = phase; }
        }
        for (let i=0;i<doses;i++){
          const t = (bestPhase + i*X*60) % 1440;
          doseTimes.push({time: t, tag:null, strictSleep: isAsleep(t), strictWork: isAtWork(t)});
        }
      } else {
        if (doses === 1) doseTimes.push({time: wake+60, tag:null});
        else {
          const step = awakeLen/(doses-1);
          for (let i=0;i<doses;i++) doseTimes.push({time: round5(wake+i*step), tag:'flex'});
        }
      }
    } else {
      const N = med.freqValue;
      if (N === 1){
        let base;
        const anchor = med.preferredAnchor || 'auto';
        if (anchor === 'morning') base = enabledMeals.includes('breakfast') ? timeToMin(profile.meals.breakfast.time) : wake+60;
        else if (anchor === 'noon') base = enabledMeals.includes('lunch') ? timeToMin(profile.meals.lunch.time) : wake + awakeLen/2;
        else if (anchor === 'evening') base = enabledMeals.includes('dinner') ? timeToMin(profile.meals.dinner.time) : sleep-120;
        else { if (med.foodRelation !== 'none' && enabledMeals.length>0) base = timeToMin(profile.meals[enabledMeals[0]].time); else base = wake + awakeLen/2; }
        base += foodOffset(med.foodRelation);
        doseTimes.push({time: round5(base), tag:null});
      } else {
        if (med.foodRelation !== 'none' && enabledMeals.length>0){
          let anchors;
          if (N <= enabledMeals.length){
            anchors = [];
            for (let i=0;i<N;i++){ const idx = Math.round(i*(enabledMeals.length-1)/(N-1||1)); anchors.push(enabledMeals[idx]); }
          } else {
            anchors = enabledMeals.slice();
            const extra = N - enabledMeals.length;
            for (let i=0;i<extra;i++){ const t = wake + (i+1)*awakeLen/(extra+1); anchors.push({customTime:t}); }
          }
          anchors.forEach(a => {
            let t = typeof a === 'string' ? timeToMin(profile.meals[a].time) : a.customTime;
            t += typeof a === 'string' ? foodOffset(med.foodRelation) : 0;
            doseTimes.push({time: round5(t), tag: typeof a === 'string' ? a : null});
          });
        } else {
          for (let i=0;i<N;i++){ const seg = awakeLen/N; const t = wake + seg*i + seg/2 + foodOffset(med.foodRelation); doseTimes.push({time: round5(t), tag:null}); }
        }
      }
    }
    doseTimes.forEach(dt => results.push({
      medId: med.id, medName: med.name, category: med.category, time: dt.time,
      flex: dt.tag==='flex', mealTag: (typeof dt.tag==='string'? dt.tag: null),
      foodRelation: med.foodRelation, strictSleep: !!dt.strictSleep, strictWork: !!dt.strictWork
    }));
  });

  if (profile.workStart && profile.workEnd){
    const ws = timeToMin(profile.workStart), we = timeToMin(profile.workEnd);
    results.forEach(r => { if (r.duringWork === undefined) r.duringWork = (r.time>=ws && r.time<=we); });
  }

  results.sort((a,b)=>a.time-b.time);
  return results;
}

// ---------- Conflict checking (declared drug-drug separations) ----------
function checkConflicts(results, meds){
  meds.forEach(med => {
    (med.separations||[]).forEach(sep => {
      const thisTimes = results.filter(r=>r.medId===med.id).map(r=>r.time);
      const targetTimes = results.filter(r=>r.medId===sep.target).map(r=>r.time);
      thisTimes.forEach(t1 => targetTimes.forEach(t2 => {
        const gapH = Math.abs(t1-t2)/60;
        if (gapH < sep.hours){
          results.filter(r=>r.medId===med.id && r.time===t1).forEach(r=>{
            r.conflicts = r.conflicts || [];
            r.conflicts.push({withTarget: (meds.find(m=>m.id===sep.target)||{}).label || '', required: sep.hours, actual:+gapH.toFixed(1)});
          });
        }
      }));
    });
  });
}

// ---------- Single fasting-window adjustment (dry intermittent / Islamic / Baháʼí / Jewish minor) ----------
// A dose during [fastStart, fastEnd) moves to the nearest edge of the eating window,
// except diabetes/diuretic doses which always move to the break-fast edge (eatingStart).
function isDuringFast(t, fastStart, fastEnd){
  if (fastEnd < fastStart) return (t>=fastStart) || (t<fastEnd);
  return (t>=fastStart && t<fastEnd);
}
function distToBoundary(t, boundary){ const d=Math.abs(t-boundary); return Math.min(d,1440-d); }

// fastingType: 'regular' (doses stay put, diabetes meds become advisory-only) or 'dry' (redistribute)
function applyFastingAdjustment(baseResults, fastStart, fastEnd, fastingType){
  const type = fastingType || 'dry';
  const results = baseResults.map(r => ({...r}));
  if (type === 'regular'){
    results.forEach(r => { if (DIABETES_CATS.includes(r.category)) r.advisoryOnly = true; });
    return results;
  }
  const eatingStart = (fastEnd + 15) % 1440;
  const eatingEnd = (fastStart - 15 + 1440) % 1440;
  results.forEach(r => {
    if (isDuringFast(r.time, fastStart, fastEnd)){
      const originalTime = r.time;
      if (DIABETES_CATS.includes(r.category) || r.category === 'diuretic'){
        r.time = eatingStart; r.movedReason = 'diabetes-diuretic';
      } else {
        const dStart = distToBoundary(originalTime, eatingStart), dEnd = distToBoundary(originalTime, eatingEnd);
        r.time = (dStart<=dEnd) ? eatingStart : eatingEnd; r.movedReason = 'nearest';
      }
      r.wasMoved = true; r.originalTime = originalTime;
    }
  });
  results.sort((a,b)=>a.time-b.time);
  return results;
}

// ---------- Two-day model (fasts spanning >24h: full-day Hindu/Jewish major fast) ----------
function adjustDay1(baseResults, fastStart){
  return baseResults.map(r=>{
    const rr = {...r};
    if (r.time >= fastStart){ rr.wasMoved = true; rr.originalTime = r.time; rr.time = fastStart - 15; }
    return rr;
  }).sort((a,b)=>a.time-b.time);
}
function adjustDay2(baseResults, fastEnd){
  return baseResults.map(r=>{
    const rr = {...r};
    if (r.time < fastEnd){ rr.wasMoved = true; rr.originalTime = r.time; rr.time = fastEnd + 15; }
    return rr;
  }).sort((a,b)=>a.time-b.time);
}
function flagClusters(results){
  const byTime = {};
  results.filter(r=>r.wasMoved).forEach(r => { (byTime[r.time] = byTime[r.time]||[]).push(r); });
  Object.values(byTime).forEach(group => { if (group.length>1) group.forEach(r => r.clustered = true); });
}

// ---------- Astronomical Fajr/Maghrib (or sunrise/sunset, or dawn/nightfall) ----------
function julianDate(y,m,d){
  if (m<=2){ y-=1; m+=12; }
  const A = Math.floor(y/100), B = 2-A+Math.floor(A/4);
  return Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + d + B - 1524.5;
}
function sunPosition(jd){
  const D = jd - 2451545.0;
  const g = (357.529 + 0.98560028*D) % 360;
  const q = (280.459 + 0.98564736*D) % 360;
  const L = (q + 1.915*Math.sin(g*Math.PI/180) + 0.020*Math.sin(2*g*Math.PI/180)) % 360;
  const e = 23.439 - 0.00000036*D;
  const RAr = Math.atan2(Math.cos(e*Math.PI/180)*Math.sin(L*Math.PI/180), Math.cos(L*Math.PI/180));
  let RA = RAr*180/Math.PI; RA = RA - 360*Math.floor(RA/360); RA = RA/15;
  const decl = Math.asin(Math.sin(e*Math.PI/180)*Math.sin(L*Math.PI/180)) * 180/Math.PI;
  const EqT = q/15 - RA;
  return { decl, eqt: EqT };
}
function timeForAngle(jd, lat, lng, angle, isFajr){
  const { decl, eqt } = sunPosition(jd);
  const latR = lat*Math.PI/180, declR = decl*Math.PI/180;
  const cosH = (-Math.sin(angle*Math.PI/180) - Math.sin(latR)*Math.sin(declR)) / (Math.cos(latR)*Math.cos(declR));
  if (cosH > 1 || cosH < -1) return null;
  let H = Math.acos(cosH) * 180/Math.PI / 15;
  if (isFajr) H = -H;
  const noon = 12 - lng/15 - eqt;
  return noon + H;
}
// fajrAngle: 18.5 (Islamic Fajr), 0.833 (sunrise/sunset, Baháʼí), 16.1 (Jewish dawn)
// duskAngle: defaults to 0.833 (sunset); pass 8.5 for Jewish nightfall approximation
function sunTimes(y,m,d, lat, lng, tzOffsetHours, fajrAngle, duskAngle){
  const jd0 = julianDate(y,m,d);
  const fajrUTC = timeForAngle(jd0, lat, lng, fajrAngle, true);
  const sunsetUTC = timeForAngle(jd0, lat, lng, (duskAngle!==undefined?duskAngle:0.833), false);
  const toLocal = h => h===null ? null : ((h + tzOffsetHours + 24) % 24);
  return { fajr: toLocal(fajrUTC), maghrib: toLocal(sunsetUTC) };
}

// ---------- Hijri (Umm al-Qura) conversion — used by the Ramadan page ----------
function gregorianToHijri(date){
  const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {year:'numeric', month:'numeric', day:'numeric'});
  const parts = fmt.formatToParts(date);
  const o = {}; parts.forEach(p => o[p.type] = p.value);
  return { year: parseInt(o.year), month: parseInt(o.month), day: parseInt(o.day) };
}
function hijriToGregorian(hY, hM, hD){
  const estDays = Math.round((hY - 1) * 354.36667 + (hM - 1) * 29.53 + hD - 1);
  let guess = new Date(622, 6, 16);
  guess.setDate(guess.getDate() + estDays);
  for (let i = 0; i < 60; i++){
    const h = gregorianToHijri(guess);
    if (h.year === hY && h.month === hM && h.day === hD) return guess;
    let cmp = h.year - hY; if (cmp===0) cmp = h.month - hM; if (cmp===0) cmp = h.day - hD;
    if (cmp < 0) guess.setDate(guess.getDate()+1); else guess.setDate(guess.getDate()-1);
  }
  return guess;
}
function buildRamadanRange(referenceDate){
  const h = gregorianToHijri(referenceDate);
  const targetYear = h.month <= 9 ? h.year : h.year + 1;
  let d = hijriToGregorian(targetYear, 9, 1);
  const days = [];
  while (true){
    const hh = gregorianToHijri(d);
    if (hh.month !== 9) break;
    days.push(new Date(d));
    d = new Date(d); d.setDate(d.getDate()+1);
  }
  return { start: days[0], end: days[days.length-1], hijriYear: targetYear };
}

// ---------- Date range helper (extended / Ramadan / Baháʼí day-by-day tables) ----------
function buildDateRange(startStr, endStr){
  const dates = [];
  let [y,m,d] = startStr.split('-').map(Number);
  const cur = new Date(y, m-1, d);
  const [ey,em,ed] = endStr.split('-').map(Number);
  const end = new Date(ey, em-1, ed);
  while (cur <= end){
    dates.push(new Date(cur));
    cur.setDate(cur.getDate()+1);
  }
  return dates;
}

// ============================================================
// Local device persistence — shared across all fasting tools,
// since a person's routine and medication list are the same
// regardless of which fasting type they're using this month.
// Pure client-side (localStorage); nothing is sent anywhere.
// ============================================================
const MED_FIELD_CLASSES = ['m-name','m-category','m-freqtype','m-freqvalue','m-food','m-precision','m-anchor','m-mealsep'];

function saveFastingData(profileData, medsData){
  try {
    localStorage.setItem('fastingTools_profile', JSON.stringify(profileData));
    localStorage.setItem('fastingTools_meds', JSON.stringify(medsData));
    return true;
  } catch(e){ return false; }
}
function loadFastingProfile(){
  try { const raw = localStorage.getItem('fastingTools_profile'); return raw ? JSON.parse(raw) : null; } catch(e){ return null; }
}
function loadFastingMeds(){
  try { const raw = localStorage.getItem('fastingTools_meds'); return raw ? JSON.parse(raw) : null; } catch(e){ return null; }
}
function hasFastingSavedData(){
  try { return !!localStorage.getItem('fastingTools_profile'); } catch(e){ return false; }
}
function clearFastingData(){
  try { localStorage.removeItem('fastingTools_profile'); localStorage.removeItem('fastingTools_meds'); return true; } catch(e){ return false; }
}

// Reads the current .med-card elements into a plain-data array suitable for localStorage.
function serializeMedCards(){
  const cards = [...document.querySelectorAll('.med-card')];
  return cards.map(card => {
    const data = {};
    MED_FIELD_CLASSES.forEach(cls => {
      const el = card.querySelector('.' + cls);
      if (el) data[cls] = el.value;
    });
    const seps = [];
    card.querySelectorAll('.sep-item').forEach(row => {
      const targetEl = row.querySelector('.sep-target');
      const hoursEl = row.querySelector('.sep-hours');
      if (targetEl && targetEl.value){
        const targetIdx = cards.findIndex(c => c.dataset.medId === targetEl.value);
        if (targetIdx !== -1) seps.push({targetIndex: targetIdx, hours: hoursEl.value});
      }
    });
    if (seps.length) data.separations = seps;
    return data;
  });
}

// Rebuilds .med-card elements from saved plain-data, using the page's own
// addMed()/addSepRow()/refreshDrugDropdowns()/syncFieldVisibility() globals.
function restoreMedCards(savedList){
  const list = document.getElementById('med-list');
  if (!list || !window.addMed) return;
  list.innerHTML = '';
  savedList.forEach(() => window.addMed());
  const cards = [...document.querySelectorAll('.med-card')];
  savedList.forEach((data, i) => {
    const card = cards[i];
    if (!card) return;
    // freqtype must be restored (and its change event fired) before freqvalue,
    // since changing freqtype rebuilds the freqvalue option list.
    if (data['m-freqtype'] !== undefined){
      const el = card.querySelector('.m-freqtype');
      if (el){ el.value = data['m-freqtype']; el.dispatchEvent(new Event('change')); }
    }
    MED_FIELD_CLASSES.forEach(cls => {
      if (cls === 'm-freqtype') return;
      if (data[cls] !== undefined){
        const el = card.querySelector('.' + cls);
        if (el) el.value = data[cls];
      }
    });
    if (window.syncFieldVisibility) window.syncFieldVisibility(card.id);
  });
  if (window.refreshDrugDropdowns) window.refreshDrugDropdowns();
  savedList.forEach((data, i) => {
    if (data.separations && window.addSepRow){
      const card = cards[i];
      if (!card) return;
      data.separations.forEach(sep => {
        window.addSepRow(card.id);
        const rows = card.querySelectorAll('.sep-item');
        const lastRow = rows[rows.length-1];
        const targetCard = cards[sep.targetIndex];
        if (targetCard && lastRow){
          lastRow.querySelector('.sep-target').value = targetCard.dataset.medId;
          lastRow.querySelector('.sep-hours').value = sep.hours;
        }
      });
    }
  });
}

// ---------- Dynamic-field relocalization ----------
// <option> elements can't hold data-ar/data-en spans, so any <select>
// built dynamically by a page's own script must be re-labeled by hand
// whenever the site language changes. This helper rebuilds a select's
// options from a [value, arText, enText] list while preserving the
// currently selected value.
function relocalizeOptions(select, pairs, lang){
  if (!select) return;
  const curVal = select.value;
  select.innerHTML = pairs.map(([v, ar, en]) => `<option value="${v}">${lang==='ar' ? ar : en}</option>`).join('');
  if (curVal) select.value = curVal;
}
