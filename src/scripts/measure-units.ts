export type UnitSystem = 'metric' | 'imperial';
export type MeasureKind = 'weight' | 'height' | 'length';

const STORAGE_KEY = 'tools-units';
const LB_PER_KG = 2.2046226218;
const CM_PER_IN = 2.54;

const UNIT_LABELS: Record<MeasureKind, Record<UnitSystem, { ar: string; en: string }>> = {
  weight: {
    metric: { ar: 'كجم', en: 'kg' },
    imperial: { ar: 'رطل', en: 'lb' },
  },
  height: {
    metric: { ar: 'سم', en: 'cm' },
    imperial: { ar: 'قدم / إنش', en: 'ft / in' },
  },
  length: {
    metric: { ar: 'سم', en: 'cm' },
    imperial: { ar: 'إنش', en: 'in' },
  },
};

let bound = false;

export function getUnitSystem(): UnitSystem {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'imperial' ? 'imperial' : 'metric';
  } catch {
    return 'metric';
  }
}

export function setUnitSystem(system: UnitSystem) {
  try {
    localStorage.setItem(STORAGE_KEY, system);
  } catch {
    /* ignore */
  }
  document.querySelectorAll<HTMLElement>('.tools-scope').forEach((scope) => applySystem(scope, system));
  window.dispatchEvent(new CustomEvent('measureUnitsChanged', { detail: { system } }));
}

export function currentLang(scope?: Element | null): 'ar' | 'en' {
  let host = scope?.closest('.tools-scope') as HTMLElement | null;
  while (host && !host.getAttribute('data-lang')) {
    host = host.parentElement?.closest('.tools-scope') as HTMLElement | null;
  }
  if (!host) host = document.querySelector('.tools-scope[data-lang]');
  return host?.getAttribute('data-lang') === 'en' ? 'en' : 'ar';
}

export function kgToLb(kg: number) {
  return kg * LB_PER_KG;
}

export function lbToKg(lb: number) {
  return lb / LB_PER_KG;
}

export function cmToIn(cm: number) {
  return cm / CM_PER_IN;
}

export function inToCm(inches: number) {
  return inches * CM_PER_IN;
}

export function cmToFtIn(cm: number) {
  const totalIn = cmToIn(cm);
  const ft = Math.floor(totalIn / 12);
  const inches = totalIn - ft * 12;
  return { ft, inches };
}

export function ftInToCm(ft: number, inches: number) {
  return inToCm(ft * 12 + inches);
}

function round(n: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function formatWeight(kg: number, digits = 1) {
  const system = getUnitSystem();
  const value = system === 'imperial' ? kgToLb(kg) : kg;
  return value.toFixed(digits);
}

export function formatHeight(cm: number, digits = 0) {
  const system = getUnitSystem();
  if (system !== 'imperial') return cm.toFixed(digits);
  const { ft, inches } = cmToFtIn(cm);
  const lang = currentLang();
  const inStr = inches.toFixed(Math.min(digits, 1) === 0 ? 0 : 1);
  return lang === 'ar' ? `${ft} قدم ${inStr} إنش` : `${ft} ft ${inStr} in`;
}

export function formatLength(cm: number, digits = 1) {
  const system = getUnitSystem();
  const value = system === 'imperial' ? cmToIn(cm) : cm;
  return value.toFixed(digits);
}

export function unitLabel(kind: MeasureKind, lang?: 'ar' | 'en') {
  const system = getUnitSystem();
  const l = lang || currentLang();
  return UNIT_LABELS[kind][system][l];
}

export function setWeightOutput(el: HTMLElement | null, kg: number, digits = 1) {
  if (!el) return;
  el.dataset.output = 'weight';
  el.dataset.kg = String(kg);
  el.dataset.digits = String(digits);
  el.textContent = formatWeight(kg, digits);
}

export function setHeightOutput(el: HTMLElement | null, cm: number, digits = 0) {
  if (!el) return;
  el.dataset.output = 'height';
  el.dataset.cm = String(cm);
  el.dataset.digits = String(digits);
  el.textContent = formatHeight(cm, digits);
}

export function setWeightRangeOutput(el: HTMLElement | null, minKg: number, maxKg: number, digits = 1) {
  if (!el) return;
  el.dataset.output = 'weight-range';
  el.dataset.kgMin = String(minKg);
  el.dataset.kgMax = String(maxKg);
  el.dataset.digits = String(digits);
  el.textContent = `${formatWeight(minKg, digits)}–${formatWeight(maxKg, digits)}`;
}

export function refreshMeasureOutputs(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>('[data-output="weight"]').forEach((el) => {
    const kg = parseFloat(el.dataset.kg || '');
    if (!Number.isFinite(kg)) return;
    el.textContent = formatWeight(kg, parseInt(el.dataset.digits || '1', 10));
  });
  scope.querySelectorAll<HTMLElement>('[data-output="height"]').forEach((el) => {
    const cm = parseFloat(el.dataset.cm || '');
    if (!Number.isFinite(cm)) return;
    el.textContent = formatHeight(cm, parseInt(el.dataset.digits || '0', 10));
  });
  scope.querySelectorAll<HTMLElement>('[data-output="weight-range"]').forEach((el) => {
    const minKg = parseFloat(el.dataset.kgMin || '');
    const maxKg = parseFloat(el.dataset.kgMax || '');
    if (!Number.isFinite(minKg) || !Number.isFinite(maxKg)) return;
    const digits = parseInt(el.dataset.digits || '1', 10);
    el.textContent = `${formatWeight(minKg, digits)}–${formatWeight(maxKg, digits)}`;
  });
  scope.querySelectorAll<HTMLElement>('[data-unit-label]').forEach((el) => {
    const kind = el.dataset.unitLabel as MeasureKind;
    if (!UNIT_LABELS[kind]) return;
    const lang = el.hasAttribute('data-en') ? 'en' : el.hasAttribute('data-ar') ? 'ar' : currentLang(el);
    el.textContent = unitLabel(kind, lang);
  });
}

function labeled(original: string, kind: MeasureKind, system: UnitSystem, lang: 'ar' | 'en') {
  const unit = `(${UNIT_LABELS[kind][system][lang]})`;
  const unitParens = /\((?:كجم|كغ|سم|kg|cm|رطل|إنش|lb|in|قدم \/ إنش|ft \/ in)\)/gi;
  if (unitParens.test(original)) {
    return original.replace(/\((?:كجم|كغ|سم|kg|cm|رطل|إنش|lb|in|قدم \/ إنش|ft \/ in)\)/gi, unit);
  }
  return `${original} ${unit}`;
}

function updateFieldLabels(root: HTMLElement, system: UnitSystem) {
  const kind = root.dataset.measure as MeasureKind;
  if (!UNIT_LABELS[kind]) return;
  root.querySelectorAll<HTMLElement>('[data-ar], [data-en]').forEach((node) => {
    if (node.closest('[data-measure]') !== root) return;
    if (node.matches('input, select, button') || node.closest('.measure-imperial')) return;
    const lang: 'ar' | 'en' = node.hasAttribute('data-en') ? 'en' : 'ar';
    const attr = lang === 'ar' ? 'data-ar' : 'data-en';
    const original = node.getAttribute(attr);
    const source = original && original.length ? original : node.textContent || '';
    if (!node.dataset.measureStem) {
      node.dataset.measureStem = source;
    }
    const next = labeled(node.dataset.measureStem, kind, system, lang);
    if (original != null) node.setAttribute(attr, next);
    node.textContent = next;
  });
}

function syncWeightImperial(canonical: HTMLInputElement, imperial: HTMLInputElement) {
  const kg = parseFloat(canonical.value);
  imperial.value = Number.isFinite(kg) && kg > 0 ? String(round(kgToLb(kg), 1)) : '';
}

function syncLengthImperial(canonical: HTMLInputElement, imperial: HTMLInputElement) {
  const cm = parseFloat(canonical.value);
  imperial.value = Number.isFinite(cm) && cm > 0 ? String(round(cmToIn(cm), 1)) : '';
}

function syncHeightImperial(canonical: HTMLInputElement, ftEl: HTMLInputElement, inEl: HTMLInputElement) {
  const cm = parseFloat(canonical.value);
  if (!Number.isFinite(cm) || cm <= 0) {
    ftEl.value = '';
    inEl.value = '';
    return;
  }
  const { ft, inches } = cmToFtIn(cm);
  ftEl.value = String(ft);
  inEl.value = String(round(inches, 1));
}

function copyBounds(from: HTMLInputElement, to: HTMLInputElement, convert: (n: number) => number, digits: number) {
  ['min', 'max', 'placeholder'].forEach((attr) => {
    const raw = from.getAttribute(attr);
    if (raw == null || raw === '') {
      to.removeAttribute(attr);
      return;
    }
    const n = parseFloat(raw);
    to.setAttribute(attr, Number.isFinite(n) ? String(round(convert(n), digits)) : raw);
  });
  to.step = from.step || '0.1';
}

function enhanceField(root: HTMLElement) {
  if (root.dataset.measureReady === '1') return;
  const kind = root.dataset.measure as MeasureKind;
  const canonical = root.querySelector<HTMLInputElement>('input[type="number"]');
  if (!canonical || !UNIT_LABELS[kind]) return;
  root.dataset.measureReady = '1';
  canonical.classList.add('measure-canonical');
  canonical.dataset.wasRequired = canonical.required ? '1' : '0';

  if (kind === 'weight' || kind === 'length') {
    const imperial = document.createElement('input');
    imperial.type = 'number';
    imperial.inputMode = 'decimal';
    imperial.className = 'measure-imperial';
    imperial.setAttribute('aria-label', kind === 'weight' ? 'lb' : 'in');
    if (kind === 'weight') copyBounds(canonical, imperial, kgToLb, 1);
    else copyBounds(canonical, imperial, cmToIn, 1);
    imperial.addEventListener('input', () => {
      const n = parseFloat(imperial.value);
      if (!Number.isFinite(n)) {
        canonical.value = '';
      } else {
        canonical.value = String(round(kind === 'weight' ? lbToKg(n) : inToCm(n), 2));
      }
      canonical.dispatchEvent(new Event('input', { bubbles: true }));
    });
    canonical.insertAdjacentElement('afterend', imperial);
    (root as HTMLElement & { _imp?: HTMLInputElement })._imp = imperial;
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'measure-imperial measure-ftin';
  wrap.dir = 'ltr';
  wrap.innerHTML = `
    <label class="measure-ftin-part">
      <span class="measure-ftin-hint" data-hint="ft"></span>
      <input type="number" class="measure-ft" inputmode="numeric" min="1" max="8" step="1">
    </label>
    <label class="measure-ftin-part">
      <span class="measure-ftin-hint" data-hint="in"></span>
      <input type="number" class="measure-in" inputmode="decimal" min="0" max="11.9" step="0.1">
    </label>
  `;
  const ftEl = wrap.querySelector<HTMLInputElement>('.measure-ft')!;
  const inEl = wrap.querySelector<HTMLInputElement>('.measure-in')!;
  const writeCm = () => {
    const ft = parseFloat(ftEl.value);
    const inches = parseFloat(inEl.value) || 0;
    if (!Number.isFinite(ft) && !inEl.value) {
      canonical.value = '';
    } else {
      canonical.value = String(round(ftInToCm(ft || 0, inches), 1));
    }
    canonical.dispatchEvent(new Event('input', { bubbles: true }));
  };
  ftEl.addEventListener('input', writeCm);
  inEl.addEventListener('input', writeCm);
  canonical.insertAdjacentElement('afterend', wrap);
  (root as HTMLElement & { _ft?: HTMLInputElement; _in?: HTMLInputElement; _wrap?: HTMLElement })._ft = ftEl;
  (root as HTMLElement & { _in?: HTMLInputElement })._in = inEl;
  (root as HTMLElement & { _wrap?: HTMLElement })._wrap = wrap;
}

function applyField(root: HTMLElement, system: UnitSystem) {
  enhanceField(root);
  const kind = root.dataset.measure as MeasureKind;
  const canonical = root.querySelector<HTMLInputElement>('.measure-canonical');
  if (!canonical) return;
  const imperialOn = system === 'imperial';
  canonical.hidden = imperialOn;
  canonical.required = imperialOn ? false : canonical.dataset.wasRequired === '1';

  if (kind === 'height') {
    const wrap = root.querySelector<HTMLElement>('.measure-ftin');
    const ftEl = root.querySelector<HTMLInputElement>('.measure-ft');
    const inEl = root.querySelector<HTMLInputElement>('.measure-in');
    if (wrap && ftEl && inEl) {
      wrap.hidden = !imperialOn;
      if (imperialOn) {
        syncHeightImperial(canonical, ftEl, inEl);
        ftEl.required = canonical.dataset.wasRequired === '1';
        const lang = currentLang(root);
        wrap.querySelectorAll<HTMLElement>('[data-hint]').forEach((hint) => {
          const key = hint.dataset.hint;
          hint.textContent = key === 'ft' ? (lang === 'ar' ? 'قدم' : 'ft') : lang === 'ar' ? 'إنش' : 'in';
        });
      } else {
        ftEl.required = false;
      }
    }
  } else {
    const imperial = root.querySelector<HTMLInputElement>('input.measure-imperial:not(.measure-ft):not(.measure-in)');
    if (imperial) {
      imperial.hidden = !imperialOn;
      imperial.required = imperialOn && canonical.dataset.wasRequired === '1';
      if (imperialOn) {
        if (kind === 'weight') syncWeightImperial(canonical, imperial);
        else syncLengthImperial(canonical, imperial);
      }
    }
  }

  updateFieldLabels(root, system);
}

function ensureToggle(scope: HTMLElement) {
  const row = scope.querySelector('.lang-toggle-row');
  if (!row || row.querySelector('.units-toggle')) return;
  const wrap = document.createElement('div');
  wrap.className = 'units-toggle';
  wrap.setAttribute('role', 'group');
  wrap.innerHTML = `
    <button type="button" class="units-toggle-btn" data-system="metric"></button>
    <button type="button" class="units-toggle-btn" data-system="imperial"></button>
  `;
  row.prepend(wrap);
  wrap.querySelectorAll<HTMLButtonElement>('.units-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', () => setUnitSystem(btn.dataset.system as UnitSystem));
  });
}

function updateToggle(scope: HTMLElement, system: UnitSystem) {
  const lang = currentLang(scope);
  const toggle = scope.querySelector('.units-toggle');
  if (!toggle) return;
  toggle.setAttribute('aria-label', lang === 'ar' ? 'نظام القياس' : 'Measurement system');
  toggle.querySelectorAll<HTMLButtonElement>('.units-toggle-btn').forEach((btn) => {
    const isMetric = btn.dataset.system === 'metric';
    btn.textContent = isMetric ? (lang === 'ar' ? 'متري' : 'Metric') : lang === 'ar' ? 'إمبراطوري' : 'Imperial';
    btn.classList.toggle('is-active', btn.dataset.system === system);
    btn.setAttribute('aria-pressed', btn.dataset.system === system ? 'true' : 'false');
  });
}

function applySystem(scope: HTMLElement, system: UnitSystem) {
  scope.dataset.units = system;
  const fields = scope.querySelectorAll<HTMLElement>('[data-measure]');
  if (!fields.length) {
    scope.querySelector('.units-toggle')?.setAttribute('hidden', '');
    return;
  }
  ensureToggle(scope);
  scope.querySelector('.units-toggle')?.removeAttribute('hidden');
  fields.forEach((field) => applyField(field, system));
  updateToggle(scope, system);
  refreshMeasureOutputs(scope);
}

export function initMeasureUnits() {
  if (bound) {
    document.querySelectorAll<HTMLElement>('.tools-scope').forEach((scope) => applySystem(scope, getUnitSystem()));
    return;
  }
  bound = true;
  const system = getUnitSystem();
  document.querySelectorAll<HTMLElement>('.tools-scope').forEach((scope) => applySystem(scope, system));

  window.addEventListener('languageChanged', () => {
    document.querySelectorAll<HTMLElement>('.tools-scope').forEach((scope) => applySystem(scope, getUnitSystem()));
  });

  document.querySelectorAll<HTMLElement>('.tools-scope').forEach((scope) => {
    new MutationObserver(() => applySystem(scope, getUnitSystem())).observe(scope, {
      attributes: true,
      attributeFilter: ['data-lang'],
    });
  });
}
