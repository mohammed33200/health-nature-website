export function bi(ar, en) {
	return `<span class="t-ar">${ar}</span><span class="t-en">${en || ar}</span>`;
}

export function setLang(lang) {
	document.documentElement.setAttribute('lang', lang);
	document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
	try {
		localStorage.setItem('siteLang', lang);
	} catch (e) { /* ignore */ }
	
    const btn = document.getElementById('lang-toggle-btn');
    if(btn){ btn.textContent = (lang==='en') ? 'العربية' : 'English'; }

	window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
}

export function toggleLang() {
	const cur = document.documentElement.getAttribute('lang') || 'ar';
	setLang(cur === 'en' ? 'ar' : 'en');
}

export function initLangOnLoad() {
	let saved = null;
	try {
		saved = localStorage.getItem('siteLang');
	} catch (e) { /* ignore */ }
	if (saved === 'en' || saved === 'ar') {
		document.addEventListener('DOMContentLoaded', () => {
			// The main language is set by Header.astro, this is a fallback.
			if (!document.documentElement.lang) {
				setLang(saved);
			}
		});
	}
}

export function initQuiz(CONFIG) {
	const answers = {};
	const qSection = document.getElementById('quiz-section');
	const introSection = document.getElementById('intro-section');
	const resultSection = document.getElementById('result-section');
	const progressFill = document.getElementById('progress-fill');
	const progressLabel = document.getElementById('progress-label');
	const total = CONFIG.questions.length;

	function progressText(n) {
		return bi(`تمت الإجابة على ${n} من ${total} سؤال`, `Answered ${n} of ${total} questions`);
	}

	function renderQuestions() {
		let html = '';
		CONFIG.questions.forEach((q, i) => {
			html += `<div class="question" id="q-wrap-${i}">`;
			html += `<div class="q-text"><span class="q-num">${i + 1}</span><span>${bi(q.text.ar, q.text.en)}</span></div>`;
			html += '<div class="options">';
			q.options.forEach((opt, oi) => {
				const checked = answers[i] === opt.v ? 'checked' : '';
				html += `<label class="opt" id="opt-${i}-${oi}">` +
					`<input type="radio" name="q${i}" value="${opt.v}" onchange="quizAnswer(${i},${oi},${opt.v})" ${checked}>` +
					`<span>${bi(opt.label.ar, opt.label.en)}</span></label>`;
			});
			html += '</div></div>';
		});
		qSection.querySelector('.questions-list').innerHTML = html;

		Object.keys(answers).forEach((qIndex) => {
			const wrap = document.getElementById(`q-wrap-${qIndex}`);
			if (wrap) {
                const opts = wrap.querySelectorAll('.opt');
                opts.forEach(function(o){ o.classList.remove('checked'); });
				const selectedOpt = wrap.querySelector(`input[value="${answers[qIndex]}"]`);
				if (selectedOpt) {
					selectedOpt.parentElement.classList.add('checked');
				}
			}
		});
	}

	window.quizAnswer = function (qIndex, optIndex, value) {
		answers[qIndex] = value;
		const wrap = document.getElementById(`q-wrap-${qIndex}`);
		const opts = wrap.querySelectorAll('.opt');
		opts.forEach((o) => { o.classList.remove('checked'); });
		document.getElementById(`opt-${qIndex}-${optIndex}`).classList.add('checked');
		wrap.classList.remove('missing');
		updateProgress();
	};

	function updateProgress() {
		const answered = Object.keys(answers).length;
		const pct = Math.round((answered / total) * 100);
		progressFill.style.width = `${pct}%`;
		progressLabel.innerHTML = progressText(answered);
	}

	window.startQuiz = function () {
		introSection.style.display = 'none';
		qSection.style.display = 'block';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	window.submitQuiz = function () {
		const missing = [];
		for (let i = 0; i < total; i++) {
			if (!(i in answers)) missing.push(i);
		}
		if (missing.length) {
			const first = document.getElementById(`q-wrap-${missing[0]}`);
			missing.forEach((i) => {
				document.getElementById(`q-wrap-${i}`).classList.add('missing');
			});
			first.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}
		computeAndShowResult();
	};

	function groupTotal(groupName) {
		let sum = 0;
		CONFIG.questions.forEach((q, i) => {
			if ((q.group || 'main') === groupName) sum += answers[i];
		});
		return sum;
	}

	function pickBand(score, bands) {
		for (let i = 0; i < bands.length; i++) {
			const b = bands[i];
			if (score >= b.min && score <= b.max) return b;
		}
		return bands[bands.length - 1];
	}

	function computeAndShowResult() {
		let html = '';
		if (CONFIG.mode === 'category') {
			const sums = {};
			Object.keys(CONFIG.categories).forEach((k) => { sums[k] = 0; });
			CONFIG.questions.forEach((q, i) => { sums[q.group] += answers[i]; });
			let winner = null, winnerScore = -1;
			Object.keys(sums).forEach((k) => {
				if (sums[k] > winnerScore) { winnerScore = sums[k]; winner = k; }
			});
			const cat = CONFIG.categories[winner];
			html += `<div class="result-badge high"><span class="label">${bi(cat.label.ar, cat.label.en)}</span></div>`;
			html += `<div class="result-text">${bi(cat.text.ar, cat.text.en)}</div>`;
			html += `<div class="training-box"><b>${bi('خطوة عملية مقترحة', 'Practical suggested step')}</b>${bi(cat.training.ar, cat.training.en)}</div>`;
			if (CONFIG.showBreakdown) {
				html += `<div class="training-box"><b>${bi('توزيع نقاطك على الفئات', 'Your score breakdown')}</b><ul style="margin:6px 0 0;padding-right:18px">`;
				Object.keys(CONFIG.categories).forEach((k) => {
					html += `<li>${bi(CONFIG.categories[k].label.ar, CONFIG.categories[k].label.en)}: ${sums[k]}</li>`;
				});
				html += '</ul></div>';
			}
		} else if (CONFIG.mode === 'grouped_sum') {
			let overall = 0;
			let breakdownHtml = '';
			Object.keys(CONFIG.groups).forEach((g) => {
				const raw = groupTotal(g);
				const weight = CONFIG.groups[g].weight || 1;
				const val = raw * weight;
				overall += val;
				if (CONFIG.groups[g].label) {
					breakdownHtml += `<li>${bi(CONFIG.groups[g].label.ar, CONFIG.groups[g].label.en)}: ${Math.round(val * 100) / 100}</li>`;
				}
			});
			overall = Math.round(overall * 100) / 100;
			const band = pickBand(overall, CONFIG.bands);
			html += `<div class="result-badge ${band.cls}"><span class="score">${overall}</span><span class="label">${bi(band.label.ar, band.label.en)}</span></div>`;
			html += `<div class="result-text">${bi(band.text.ar, band.text.en)}</div>`;
			if (band.training && (band.training.ar || band.training.en)) {
				html += `<div class="training-box"><b>${bi('خطوة عملية مقترحة', 'Practical suggested step')}</b>${bi(band.training.ar, band.training.en)}</div>`;
			}
			if (CONFIG.showBreakdown && breakdownHtml) {
				html += `<div class="training-box"><b>${bi('تفصيل حسب المحاور', 'Breakdown by domain')}</b><ul style="margin:6px 0 0;padding-right:18px">${breakdownHtml}</ul></div>`;
			}
			if (CONFIG.specialBand) {
				const sgRaw = groupTotal(CONFIG.specialBand.group);
				const sband = pickBand(sgRaw, CONFIG.specialBand.bands);
				html += `<div class="training-box"><b>${bi(CONFIG.specialBand.label.ar, CONFIG.specialBand.label.en)} (${sgRaw})</b>${bi(sband.text.ar, sband.text.en)}</div>`;
			}
		} else { // 'sum' mode
			const score = groupTotal('main');
			const band = pickBand(score, CONFIG.bands);
			html += `<div class="result-badge ${band.cls}"><span class="score">${score}</span><span class="label">${bi(band.label.ar, band.label.en)}</span></div>`;
			html += `<div class="result-text">${bi(band.text.ar, band.text.en)}</div>`;
			if (band.training && (band.training.ar || band.training.en)) {
				html += `<div class="training-box"><b>${bi('خطوة عملية مقترحة', 'Practical suggested step')}</b>${bi(band.training.ar, band.training.en)}</div>`;
			}
		}
		resultSection.querySelector('.result-content').innerHTML = html;
		qSection.style.display = 'none';
		resultSection.style.display = 'block';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	window.resetQuiz = function () {
		// Clear answers object
		for (const key in answers) {
			delete answers[key];
		}
		resultSection.style.display = 'none';
		introSection.style.display = 'block';
		renderQuestions();
		updateProgress();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Initial setup
	renderQuestions();
	updateProgress();

    window.renderQuestionsGlobal = renderQuestions;

	// Re-render questions on language change
	window.addEventListener('languageChanged', () => {
		renderQuestions();
		updateProgress();
	});
}