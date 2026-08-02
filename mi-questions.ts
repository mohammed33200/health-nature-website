// بيانات اختبار الذكاءات المتعددة (ترفيهي) — 6 أنواع × 9 أسئلة = 54 سؤالاً
// Multiple Intelligences (entertainment) test data — 6 types × 9 questions = 54 questions

export type Category = "logical" | "verbal" | "spatial" | "memory" | "analytical" | "social";

export interface MIQuestion {
  id: number;
  category: Category;
  type: "mc" | "memory" | "scale";
  prompt: string;
  promptEn: string;
  study?: string;
  studyEn?: string;
  studySeconds?: number;
  options: string[];
  optionsEn: string[];
  correctIndex?: number;
}

export interface CategoryMeta {
  label: string;
  labelEn: string;
  short: string;
  shortEn: string;
  emoji: string;
  color: string;
  desc: string;
  descEn: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  logical: {
    label: "المنطقي والرياضي", labelEn: "Logical-Mathematical", short: "منطقي", shortEn: "Logical",
    emoji: "🧮", color: "#1FA79B",
    desc: "قدرتك على التفكير بالأرقام والأنماط وحل المسائل الحسابية بسرعة.",
    descEn: "Your ability to think in numbers, spot patterns, and solve math problems quickly.",
  },
  verbal: {
    label: "اللغوي واللفظي", labelEn: "Verbal-Linguistic", short: "لغوي", shortEn: "Verbal",
    emoji: "📝", color: "#E3A33B",
    desc: "قدرتك على فهم الكلمات والتناظر اللغوي والتفكير بالمفردات.",
    descEn: "Your ability to understand words, verbal analogies, and think in language.",
  },
  spatial: {
    label: "المكاني والبصري", labelEn: "Spatial-Visual", short: "مكاني", shortEn: "Spatial",
    emoji: "🧩", color: "#3D6FB4",
    desc: "قدرتك على تخيّل الأشكال وعلاقتها ببعضها في الفراغ.",
    descEn: "Your ability to visualize shapes and how they relate to each other in space.",
  },
  memory: {
    label: "الذاكرة والتركيز", labelEn: "Memory & Focus", short: "ذاكرة", shortEn: "Memory",
    emoji: "🧠", color: "#8C4B9E",
    desc: "قدرتك على حفظ معلومة لفترة قصيرة ثم استرجاعها بدقة.",
    descEn: "Your ability to hold information briefly then recall it accurately.",
  },
  analytical: {
    label: "حل المشكلات والتحليل", labelEn: "Analytical Problem-Solving", short: "تحليلي", shortEn: "Analytical",
    emoji: "💡", color: "#C4562E",
    desc: "قدرتك على التفكير المنطقي، حل الألغاز، والاستنتاج الصحيح.",
    descEn: "Your ability to reason logically, solve puzzles, and draw correct conclusions.",
  },
  social: {
    label: "الذكاء الاجتماعي والعاطفي", labelEn: "Social-Emotional Intelligence", short: "عاطفي", shortEn: "Social",
    emoji: "❤️", color: "#E4636F",
    desc: "قدرتك على فهم مشاعرك ومشاعر من حولك والتعامل معها بذكاء.",
    descEn: "Your ability to understand your own and others' feelings and handle them wisely.",
  },
};

export const SCALE_LABELS = ["أبدًا", "نادرًا", "أحيانًا", "غالبًا", "دائمًا"];
export const SCALE_LABELS_EN = ["Never", "Rarely", "Sometimes", "Often", "Always"];

export const MI_QUESTIONS: MIQuestion[] = [
  // ---------------- المنطقي والرياضي / Logical-Mathematical ----------------
  { id: 1, category: "logical", type: "mc", prompt: "ما الرقم التالي في المتتالية: 2, 4, 8, 16, ؟", promptEn: "What's next in the sequence: 2, 4, 8, 16, ?", options: ["30", "32", "34", "36"], optionsEn: ["30", "32", "34", "36"], correctIndex: 1 },
  { id: 2, category: "logical", type: "mc", prompt: "أكمل المتتالية: 3, 6, 9, 12, ؟", promptEn: "Complete the sequence: 3, 6, 9, 12, ?", options: ["13", "14", "15", "16"], optionsEn: ["13", "14", "15", "16"], correctIndex: 2 },
  { id: 3, category: "logical", type: "mc", prompt: "إذا كان س + 5 = 12، فكم قيمة س؟", promptEn: "If x + 5 = 12, what is x?", options: ["5", "6", "7", "8"], optionsEn: ["5", "6", "7", "8"], correctIndex: 2 },
  { id: 4, category: "logical", type: "mc", prompt: "أكمل متتالية فيبوناتشي: 1, 1, 2, 3, 5, 8, ؟", promptEn: "Complete the Fibonacci sequence: 1, 1, 2, 3, 5, 8, ?", options: ["10", "11", "12", "13"], optionsEn: ["10", "11", "12", "13"], correctIndex: 3 },
  { id: 5, category: "logical", type: "mc", prompt: "ناتج 7 × 8 − 6 = ؟", promptEn: "What is 7 × 8 − 6?", options: ["48", "50", "52", "56"], optionsEn: ["48", "50", "52", "56"], correctIndex: 1 },
  { id: 6, category: "logical", type: "mc", prompt: "أكمل المتتالية: 100, 90, 80, 70, ؟", promptEn: "Complete the sequence: 100, 90, 80, 70, ?", options: ["50", "55", "60", "65"], optionsEn: ["50", "55", "60", "65"], correctIndex: 2 },
  { id: 7, category: "logical", type: "mc", prompt: "إذا كانت 3 أقلام تكلف 6 ريالات، فكم يكلف 7 أقلام؟", promptEn: "If 3 pens cost $6, how much do 7 pens cost?", options: ["12", "13", "14", "15"], optionsEn: ["$12", "$13", "$14", "$15"], correctIndex: 2 },
  { id: 8, category: "logical", type: "mc", prompt: "أكمل متتالية المربعات: 1, 4, 9, 16, 25, ؟", promptEn: "Complete the sequence of squares: 1, 4, 9, 16, 25, ?", options: ["30", "32", "34", "36"], optionsEn: ["30", "32", "34", "36"], correctIndex: 3 },
  { id: 9, category: "logical", type: "mc", prompt: "نصف عدد زائد 10 يساوي 20، فما العدد؟", promptEn: "Half a number plus 10 equals 20. What is the number?", options: ["15", "18", "20", "24"], optionsEn: ["15", "18", "20", "24"], correctIndex: 2 },

  // ---------------- اللغوي واللفظي / Verbal-Linguistic ----------------
  { id: 10, category: "verbal", type: "mc", prompt: "أكمل التماثل: «قلم : كتابة» كما «سكين : ؟»", promptEn: "Complete the analogy: \"pen : writing\" as \"knife : ?\"", options: ["طبخ", "تقطيع", "زراعة", "بناء"], optionsEn: ["cooking", "cutting", "farming", "building"], correctIndex: 1 },
  { id: 11, category: "verbal", type: "mc", prompt: "ما الكلمة الشاذة بين هذه الكلمات؟", promptEn: "Which word doesn't belong?", options: ["تفاحة", "موز", "برتقال", "طاولة"], optionsEn: ["apple", "banana", "orange", "table"], correctIndex: 3 },
  { id: 12, category: "verbal", type: "mc", prompt: "ما مرادف كلمة «سعيد»؟", promptEn: "What is a synonym for \"happy\"?", options: ["حزين", "بائس", "مسرور", "غاضب"], optionsEn: ["sad", "miserable", "joyful", "angry"], correctIndex: 2 },
  { id: 13, category: "verbal", type: "mc", prompt: "ما عكس كلمة «كبير»؟", promptEn: "What is the opposite of \"big\"?", options: ["صغير", "طويل", "قصير", "واسع"], optionsEn: ["small", "tall", "short", "wide"], correctIndex: 0 },
  { id: 14, category: "verbal", type: "mc", prompt: "أكمل التماثل: «طبيب : مستشفى» كما «معلم : ؟»", promptEn: "Complete the analogy: \"doctor : hospital\" as \"teacher : ?\"", options: ["بيت", "مدرسة", "سوق", "مصنع"], optionsEn: ["house", "school", "market", "factory"], correctIndex: 1 },
  { id: 15, category: "verbal", type: "mc", prompt: "ما الكلمة الشاذة بين هذه الكلمات؟", promptEn: "Which word doesn't belong?", options: ["أحمر", "أزرق", "أخضر", "سريع"], optionsEn: ["red", "blue", "green", "fast"], correctIndex: 3 },
  { id: 16, category: "verbal", type: "mc", prompt: "ما مرادف كلمة «ذكي»؟", promptEn: "What is a synonym for \"smart\"?", options: ["بليد", "فطن", "غبي", "بطيء"], optionsEn: ["dull", "clever", "foolish", "slow"], correctIndex: 1 },
  { id: 17, category: "verbal", type: "mc", prompt: "أكمل التماثل: «سمكة : ماء» كما «طائر : ؟»", promptEn: "Complete the analogy: \"fish : water\" as \"bird : ?\"", options: ["أرض", "هواء", "شجرة", "عش"], optionsEn: ["ground", "air", "tree", "nest"], correctIndex: 1 },
  { id: 18, category: "verbal", type: "mc", prompt: "ما الكلمة الشاذة بين هذه الكلمات؟", promptEn: "Which word doesn't belong?", options: ["قطة", "كلب", "أسد", "سيارة"], optionsEn: ["cat", "dog", "lion", "car"], correctIndex: 3 },

  // ---------------- المكاني والبصري / Spatial-Visual ----------------
  { id: 19, category: "spatial", type: "mc", prompt: "أكمل التسلسل: ⬤ ⬛ ⬤ ⬛ ⬤ ؟", promptEn: "Complete the sequence: ⬤ ⬛ ⬤ ⬛ ⬤ ?", options: ["⬤", "⬛", "▲", "★"], optionsEn: ["⬤", "⬛", "▲", "★"], correctIndex: 1 },
  { id: 20, category: "spatial", type: "mc", prompt: "أي شكل مختلف عن البقية؟", promptEn: "Which shape is different from the rest?", options: ["⬤", "⬤", "⬛", "⬤"], optionsEn: ["⬤", "⬤", "⬛", "⬤"], correctIndex: 2 },
  { id: 21, category: "spatial", type: "mc", prompt: "كم عدد المربعات الصغيرة في شبكة 3×3؟", promptEn: "How many small squares are in a 3×3 grid?", options: ["6", "9", "12", "16"], optionsEn: ["6", "9", "12", "16"], correctIndex: 1 },
  { id: 22, category: "spatial", type: "mc", prompt: "إذا طويت ورقة مربعة من المنتصف مرتين، كم جزءًا ينتج عند فردها؟", promptEn: "If you fold a square paper in half twice, how many sections appear when unfolded?", options: ["2", "3", "4", "6"], optionsEn: ["2", "3", "4", "6"], correctIndex: 2 },
  { id: 23, category: "spatial", type: "mc", prompt: "أكمل النمط: ▲ ▼ ▲ ▼ ؟", promptEn: "Complete the pattern: ▲ ▼ ▲ ▼ ?", options: ["▲", "▼", "■", "●"], optionsEn: ["▲", "▼", "■", "●"], correctIndex: 0 },
  { id: 24, category: "spatial", type: "mc", prompt: "كم عدد أضلاع الشكل السداسي؟", promptEn: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], optionsEn: ["5", "6", "7", "8"], correctIndex: 1 },
  { id: 25, category: "spatial", type: "mc", prompt: "أكمل النمط: ● ●● ●●● ؟", promptEn: "Complete the pattern: ● ●● ●●● ?", options: ["●●", "●●●", "●●●●", "●●●●●"], optionsEn: ["●●", "●●●", "●●●●", "●●●●●"], correctIndex: 2 },
  { id: 26, category: "spatial", type: "mc", prompt: "كم حركة دوران بمقدار 90° يحتاجها المربع ليعود لوضعه الأصلي؟", promptEn: "How many 90° rotations does a square need to return to its original position?", options: ["2", "3", "4", "8"], optionsEn: ["2", "3", "4", "8"], correctIndex: 2 },
  { id: 27, category: "spatial", type: "mc", prompt: "أكمل النمط: ★ ☆ ★ ☆ ★ ؟", promptEn: "Complete the pattern: ★ ☆ ★ ☆ ★ ?", options: ["★", "☆", "●", "▲"], optionsEn: ["★", "☆", "●", "▲"], correctIndex: 1 },

  // ---------------- الذاكرة والتركيز / Memory & Focus ----------------
  { id: 28, category: "memory", type: "memory", study: "4 — 9 — 2 — 7", studyEn: "4 — 9 — 2 — 7", studySeconds: 4, prompt: "ما هو التسلسل الذي حفظته للتو؟", promptEn: "What was the sequence you just memorized?", options: ["4927", "4972", "9427", "2749"], optionsEn: ["4927", "4972", "9427", "2749"], correctIndex: 0 },
  { id: 29, category: "memory", type: "memory", study: "8 — 1 — 5 — 3 — 6", studyEn: "8 — 1 — 5 — 3 — 6", studySeconds: 4, prompt: "ما هو التسلسل الذي حفظته للتو؟", promptEn: "What was the sequence you just memorized?", options: ["81536", "85136", "81563", "15836"], optionsEn: ["81536", "85136", "81563", "15836"], correctIndex: 0 },
  { id: 30, category: "memory", type: "memory", study: "تفاح — قلم — شمس", studyEn: "Apple — Pen — Sun", studySeconds: 4, prompt: "أي كلمة من التالي لم تظهر في القائمة؟", promptEn: "Which of these words did NOT appear in the list?", options: ["تفاح", "قلم", "شمس", "كرسي"], optionsEn: ["Apple", "Pen", "Sun", "Chair"], correctIndex: 3 },
  { id: 31, category: "memory", type: "memory", study: "3 — 7 — 2 — 9 — 4 — 1", studyEn: "3 — 7 — 2 — 9 — 4 — 1", studySeconds: 5, prompt: "ما الرقم الثالث في التسلسل الذي حفظته؟", promptEn: "What was the third number in the sequence?", options: ["7", "2", "9", "4"], optionsEn: ["7", "2", "9", "4"], correctIndex: 1 },
  { id: 32, category: "memory", type: "memory", study: "⬤ ▲ ■", studyEn: "⬤ ▲ ■", studySeconds: 3, prompt: "ما الترتيب الصحيح للأشكال كما ظهرت؟", promptEn: "What was the correct order of the shapes?", options: ["⬤ ▲ ■", "▲ ⬤ ■", "■ ▲ ⬤", "▲ ■ ⬤"], optionsEn: ["⬤ ▲ ■", "▲ ⬤ ■", "■ ▲ ⬤", "▲ ■ ⬤"], correctIndex: 0 },
  { id: 33, category: "memory", type: "memory", study: "6 — 3 — 9 — 1 — 5 — 8 — 2", studyEn: "6 — 3 — 9 — 1 — 5 — 8 — 2", studySeconds: 5, prompt: "ما الرقم الأخير في التسلسل الذي حفظته؟", promptEn: "What was the last number in the sequence?", options: ["8", "5", "2", "1"], optionsEn: ["8", "5", "2", "1"], correctIndex: 2 },
  { id: 34, category: "memory", type: "memory", study: "قمر — نجمة — غيمة — مطر", studyEn: "Moon — Star — Cloud — Rain", studySeconds: 4, prompt: "كم كلمة كانت في القائمة التي حفظتها؟", promptEn: "How many words were in the list you memorized?", options: ["3", "4", "5", "6"], optionsEn: ["3", "4", "5", "6"], correctIndex: 1 },
  { id: 35, category: "memory", type: "memory", study: "5 — 2 — 8 — 4", studyEn: "5 — 2 — 8 — 4", studySeconds: 4, prompt: "ما مجموع الأرقام الأربعة التي حفظتها؟", promptEn: "What is the sum of the four numbers you memorized?", options: ["17", "18", "19", "20"], optionsEn: ["17", "18", "19", "20"], correctIndex: 2 },
  { id: 36, category: "memory", type: "memory", study: "أزرق — أحمر — أخضر — أصفر", studyEn: "Blue — Red — Green — Yellow", studySeconds: 4, prompt: "ما اللون الثاني في القائمة التي حفظتها؟", promptEn: "What was the second color in the list?", options: ["أزرق", "أحمر", "أخضر", "أصفر"], optionsEn: ["Blue", "Red", "Green", "Yellow"], correctIndex: 1 },

  // ---------------- حل المشكلات والتحليل / Analytical Problem-Solving ----------------
  { id: 37, category: "analytical", type: "mc", prompt: "عمر أكبر من سالم بثلاث سنوات، وسالم أكبر من علي بسنتين. من الأصغر سنًا؟", promptEn: "Omar is 3 years older than Salem, and Salem is 2 years older than Ali. Who is the youngest?", options: ["عمر", "سالم", "علي", "لا يمكن معرفة ذلك"], optionsEn: ["Omar", "Salem", "Ali", "Can't be determined"], correctIndex: 2 },
  { id: 38, category: "analytical", type: "mc", prompt: "كل الوردات أزهار، وبعض الأزهار حمراء. فهل كل الورود حمراء بالضرورة؟", promptEn: "All roses are flowers, and some flowers are red. Must all roses be red?", options: ["نعم", "لا", "ربما", "لا توجد معلومات كافية"], optionsEn: ["Yes", "No", "Maybe", "Not enough information"], correctIndex: 1 },
  { id: 39, category: "analytical", type: "mc", prompt: "أب وابنه تعرّضا لحادث، الأب توفي والابن نُقل للمستشفى، فدخل الطبيب وقال: «لا أستطيع تشخيصه فهو ابني». كيف يكون ذلك؟", promptEn: "A father and son were in an accident. The father died and the son was taken to hospital. The doctor said: \"I can't operate, he's my son.\" How is this possible?", options: ["الطبيب هو الجد", "الطبيب هو الأم", "الابن يحلم", "خطأ في القصة"], optionsEn: ["The doctor is the grandfather", "The doctor is the mother", "The son is dreaming", "The story has an error"], correctIndex: 1 },
  { id: 40, category: "analytical", type: "mc", prompt: "لديك 5 تفاحات وأكلت 3، كم تبقى معك؟", promptEn: "You have 5 apples and eat 3. How many are left?", options: ["1", "2", "3", "5"], optionsEn: ["1", "2", "3", "5"], correctIndex: 1 },
  { id: 41, category: "analytical", type: "mc", prompt: "إذا استغرق 5 عمال 5 دقائق لصنع 5 كراسٍ، كم دقيقة يستغرق 100 عامل لصنع 100 كرسي؟", promptEn: "If 5 workers take 5 minutes to make 5 chairs, how many minutes do 100 workers take to make 100 chairs?", options: ["5 دقائق", "20 دقيقة", "100 دقيقة", "500 دقيقة"], optionsEn: ["5 minutes", "20 minutes", "100 minutes", "500 minutes"], correctIndex: 0 },
  { id: 42, category: "analytical", type: "mc", prompt: "إذا كان 2+3=10، و3+4=21، و4+5=36، فما ناتج 5+6 بنفس النمط؟", promptEn: "If 2+3=10, 3+4=21, and 4+5=36, what is 5+6 using the same pattern?", options: ["30", "45", "55", "66"], optionsEn: ["30", "45", "55", "66"], correctIndex: 2 },
  { id: 43, category: "analytical", type: "mc", prompt: "ثلاثة مفاتيح إضاءة خارج غرفة، كل واحد يتحكم بلمبة، ولا يمكنك رؤية اللمبات إلا بالدخول مرة واحدة. كيف تعرف أي مفتاح لأي لمبة؟", promptEn: "Three light switches are outside a room, each controlling one bulb, and you can only enter once. How do you determine which switch controls which bulb?", options: ["تفتح مفتاحًا واحدًا فقط وتدخل", "تشغّل كل المفاتيح معًا", "تشغّل مفتاحًا لفترة ثم تطفئه وتشغّل آخر قبل الدخول", "لا يمكن معرفة ذلك أبدًا"], optionsEn: ["Turn on just one switch and enter", "Turn on all switches together", "Turn one on for a while, turn it off, turn on another, then enter", "It can never be determined"], correctIndex: 2 },
  { id: 44, category: "analytical", type: "mc", prompt: "أي الأرقام التالية لا ينتمي للنمط: 2, 4, 6, 7, 8؟", promptEn: "Which of these numbers doesn't belong: 2, 4, 6, 7, 8?", options: ["2", "4", "7", "8"], optionsEn: ["2", "4", "7", "8"], correctIndex: 2 },
  { id: 45, category: "analytical", type: "mc", prompt: "كل المهندسين يعرفون الرياضيات، وأحمد يعرف الرياضيات. هل أحمد بالضرورة مهندس؟", promptEn: "All engineers know math, and Ahmed knows math. Must Ahmed be an engineer?", options: ["نعم بالتأكيد", "لا، هذا استنتاج خاطئ", "ربما بنسبة 50٪", "يعتمد على عمره"], optionsEn: ["Yes, definitely", "No, that's a flawed conclusion", "Maybe, 50/50", "Depends on his age"], correctIndex: 1 },

  // ---------------- الذكاء الاجتماعي والعاطفي / Social-Emotional ----------------
  { id: 46, category: "social", type: "scale", prompt: "أستطيع أن ألاحظ مشاعر الآخرين من تعابير وجوههم بسهولة.", promptEn: "I can easily notice others' feelings from their facial expressions.", options: SCALE_LABELS, optionsEn: SCALE_LABELS_EN },
  { id: 47, category: "social", type: "scale", prompt: "أتعامل مع النقد دون أن أثور بسرعة.", promptEn: "I handle criticism without quickly getting upset.", options: SCALE_LABELS, optionsEn: SCALE_LABELS_EN },
  { id: 48, category: "social", type: "scale", prompt: "أستطيع تهدئة صديق حزين بكلمات مناسبة.", promptEn: "I can calm a sad friend with the right words.", options: SCALE_LABELS, optionsEn: SCALE_LABELS_EN },
  { id: 49, category: "social", type: "scale", prompt: "أفهم سبب انزعاجي قبل أن أتصرف بناءً عليه.", promptEn: "I understand why I'm upset before acting on it.", options: SCALE_LABELS, optionsEn: SCALE_LABELS_EN },
  { id: 50, category: "social", type: "scale", prompt: "أستطيع إقناع الآخرين برأيي دون فرضه عليهم.", promptEn: "I can persuade others of my view without forcing it on them.", options: SCALE_LABELS, optionsEn: SCALE_LABELS_EN },
  { id: 51, category: "social", type: "scale", prompt: "ألاحظ عندما يحتاج شخص ما للمساعدة دون أن يطلبها.", promptEn: "I notice when someone needs help even if they don't ask.", options: SCALE_LABELS, optionsEn: SCALE_LABELS_EN },
  { id: 52, category: "social", type: "scale", prompt: "أتعامل مع الخلافات في العمل أو الحياة بهدوء.", promptEn: "I handle conflicts at work or in life calmly.", options: SCALE_LABELS, optionsEn: SCALE_LABELS_EN },
  { id: 53, category: "social", type: "scale", prompt: "أستطيع تكوين صداقات جديدة بسهولة نسبية.", promptEn: "I can make new friends relatively easily.", options: SCALE_LABELS, optionsEn: SCALE_LABELS_EN },
  { id: 54, category: "social", type: "scale", prompt: "أعتذر بصدق عندما أخطئ في حق أحد.", promptEn: "I apologize sincerely when I wrong someone.", options: SCALE_LABELS, optionsEn: SCALE_LABELS_EN },
];