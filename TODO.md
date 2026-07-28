# TODO: إصلاح أخطاء TypeScript في medical-qr-code-generator.astro

## الخطوات

- [x] تحليل الأخطاء ووضع خطة الإصلاح
- [x] موافقة المستخدم على الخطة

### تنفيذ التعديلات (ملف واحد: src/pages/apps/medical-qr-code-generator.astro)

- [ ] **Edit 1:** استبدال دالة `$` helper بتعريفات متغيرات مع `@type` JSDoc casts لأنواع DOM الصحيحة (HTMLInputElement, HTMLCanvasElement, HTMLImageElement, HTMLButtonElement, إلخ) + إضافة متغيرات btnPng/btnSvg/btnCopy
- [ ] **Edit 2:** إصلاح حدث `logoInput` — تحويل `e.target` إلى `HTMLInputElement` للوصول إلى `files`
- [ ] **Edit 3:** إصلاح `reader.onload` — تحويل `ev.target.result` إلى `string`
- [ ] **Edit 4:** إصلاح دالة `setExportEnabled` — استخدام متغيرات الأزرار المباشرة بدلاً من `$('btnPng')`
- [ ] **Edit 5:** إصلاح `window.QRGen` — تحويل window إلى `any` للوصول إلى QRGen
- [ ] **Edit 6:** إصلاح event listeners للأزرار — استخدام المتغيرات المباشرة btnPng/btnSvg/btnCopy بدلاً من `$('btn...')`

### التحقق

- [ ] التأكد من زوال جميع أخطاء TypeScript الـ 19

