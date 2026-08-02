document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const cleanBtn = document.getElementById('clean-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const resultContainer = document.getElementById('result-container');
    const resultOutput = document.getElementById('result-output');
    const copyBtn = document.getElementById('copy-btn');
    const copyFeedback = document.getElementById('copy-feedback');

    // قائمة بالمتغيرات الشائعة التي تستخدم للتتبع والإعلانات
    const trackingParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'fbclid', 'gclid', 'msclkid', 'mc_cid', 'mc_eid',
        '_ga', 'gclsrc', 'dclid', 'zanpid',
        'si', 'igshid', 'ig_rid',
        '__cft__[0]', '__tn__',
    ];

    function cleanUrl() {
        const rawUrl = urlInput.value.trim();
        if (!rawUrl) {
            resultContainer.style.display = 'none';
            return;
        }

        try {
            const url = new URL(rawUrl);
            const params = url.searchParams;
            let paramsDeleted = false;

            trackingParams.forEach(param => {
                if (params.has(param)) {
                    params.delete(param);
                    paramsDeleted = true;
                }
            });

            // إزالة المتغيرات التي تبدأ بـ 'utm_'
            for (const key of [...params.keys()]) {
                if (key.startsWith('utm_')) {
                    params.delete(key);
                    paramsDeleted = true;
                }
            }

            resultOutput.value = url.toString();
            resultContainer.style.display = 'block';
            copyFeedback.textContent = '';

        } catch (error) {
            // إذا كان الإدخال ليس رابطًا صالحًا
            resultOutput.value = rawUrl;
            resultContainer.style.display = 'block';
            copyFeedback.textContent = '';
        }
    }

    async function pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            urlInput.value = text;
            cleanUrl();
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    }

    function copyToClipboard() {
        resultOutput.select();
        document.execCommand('copy');
        const lang = document.documentElement.lang || 'ar';
        copyFeedback.textContent = (lang === 'en') ? 'Copied!' : 'تم النسخ!';
        setTimeout(() => {
            copyFeedback.textContent = '';
        }, 2000);
    }

    cleanBtn.addEventListener('click', cleanUrl);
    pasteBtn.addEventListener('click', pasteFromClipboard);
    copyBtn.addEventListener('click', copyToClipboard);
    urlInput.addEventListener('input', () => {
        // إخفاء النتيجة عند تعديل الرابط الأصلي
        resultContainer.style.display = 'none';
    });
});