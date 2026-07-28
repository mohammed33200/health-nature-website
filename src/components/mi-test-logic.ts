import type { Question } from '../../mi-questions';

export function initializeMITest(questions: Question[]) {
  const form = document.getElementById('mi-test-form') as HTMLFormElement | null;
  const resultsDiv = document.getElementById('results') as HTMLDivElement | null;
  const resultText = document.getElementById('result-text') as HTMLParagraphElement | null;

  if (!form || !resultsDiv || !resultText) {
    console.error('Missing required elements for the MI test.');
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const formData = new FormData(form);
    const scores: Record<string, number> = {
      logical: 0,
      verbal: 0,
      spatial: 0,
      memory: 0,
      analytical: 0,
      social: 0,
    };

    questions.forEach((question, i) => {
      const answer = Number(formData.get(`q${i}`));
      if (question.type === 'scale') {
        scores[question.category] += (answer + 1) / 5;
      } else if (answer === question.correctIndex) {
        scores[question.category]++;
      }
    });

    let maxScore = -1;
    let dominantIntelligence = 'غير محدد';
    for (const type in scores) {
      if (scores[type] > maxScore) {
        maxScore = scores[type];
        dominantIntelligence = type;
      }
    }

    resultText.textContent = `نوع الذكاء الأكثر بروزاً لديك هو: ${dominantIntelligence} بنتيجة ${maxScore} نقاط.`;
    resultsDiv.style.display = 'block'; // إظهار قسم النتائج
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  });
}