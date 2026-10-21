// Builds the narration script from the crusade data.
// Usage: node tools/build-script.js > script.json
// Each segment is one audio file: a part intro, a chapter, or a scene.
// Each item has `sub` (subtitle text, as written) and `say` (what the voice reads).

global.window = {};
for (const f of ["first", "second", "third"]) require(`../data/${f}-crusade.js`);
const MODULES = window.CRUSADES.slice().sort((a, b) => a.order - b.order);

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const ORD = ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh",
  "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"];
const two = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : ""));
function ordinal(n) {
  if (n < 20) return ORD[n];
  if (n % 10 === 0) return TENS[n / 10].replace(/y$/, "ieth");
  return TENS[Math.floor(n / 10)] + "-" + ORD[n % 10];
}
function year(y) {
  const h = Math.floor(y / 100), r = y % 100;
  if (r === 0) return two(h) + " hundred";
  if (r < 10) return two(h) + " oh " + ONES[r];
  return two(h) + " " + two(r);
}
const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";
const ROMAN = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10 };
const REGNAL = /\b(Urban|Gregory|Eugenius|Alexios|Romanos|Manuel|Baldwin|Louis|Philip|Conrad|Henry|Richard|Frederick|Raymond|Joscelin|Bohemond|Innocent|Celestine|Clement|Isaac|William|Amalric|Fulk|Arslan|Andronikos|Leo|Roger|Coloman|Alexander|Lucius|Paschal|Calixtus|Honorius|Bertrand|Hugh|Guy|Kilij Arslan) (I|II|III|IV|V|VI|VII|VIII|IX|X)\b/g;

function speak(s) {
  let t = s;
  t = t.replace(/\s*\((abridged|paraphrased)\)/gi, "");
  t = t.replace(/\bActs (\d+):(\d+)/g, (_, a, b) => `Acts chapter ${two(+a)}, verse ${two(+b)}`);
  t = t.replace(/\(([^)]*)\)/g, ", $1,");
  t = t.replace(new RegExp(`\\b(\\d{1,2})\\s*[–-]\\s*(\\d{1,2}) (${MONTHS})`, "g"), (_, a, b, m) => `the ${ordinal(+a)} to the ${ordinal(+b)} of ${m}`);
  t = t.replace(new RegExp(`\\b(\\d{1,2}) (${MONTHS})`, "g"), (_, a, m) => `the ${ordinal(+a)} of ${m}`);
  t = t.replace(/\b(1[0-2]\d\d)\s*[–-]\s*(\d\d)\b(?!\d)/g, (_, a, b) => `${year(+a)} to ${year(Math.floor(+a / 100) * 100 + +b)}`);
  t = t.replace(/\b(1[0-2]\d\d)\s*[–-]\s*(1[0-2]\d\d)\b/g, (_, a, b) => `${year(+a)} to ${year(+b)}`);
  t = t.replace(/\b(1[0-2]\d0)s\b/g, (_, a) => year(+a).replace(/y$/, "ie") + "s");
  t = t.replace(/(?<!\d,|\d)\b(1[0-2]\d\d)\b(?!\d|,\d)/g, (_, a) => year(+a));
  t = t.replace(/\bc\.\s*(?=\w)/g, "around ");
  t = t.replace(/\bSt\.? (?=[A-Z])/g, "Saint ");
  t = t.replace(REGNAL, (_, n, r) => `${n} the ${ORD[ROMAN[r]] || r}`);
  t = t.replace(/\b(II|III|IV|VI|VII|VIII)\b/g, (r) => `the ${ORD[ROMAN[r]]}`);
  t = t.replace(/\s+[–—]\s+/g, " to ").replace(/[–—]/g, " to ");
  t = t.replace(/&/g, "and");
  t = t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  t = t.replace(/\s+,/g, ",").replace(/,\s*,/g, ",").replace(/([!?])\./g, "$1").replace(/\s{2,}/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// Split prose into sentences for subtitles, without breaking at "c." or initials.
function sentences(p) {
  return p
    .split(/(?<=[.!?])["”’]?\s+(?=["“A-Z])/)
    .reduce((acc, s) => {
      if (acc.length && /\b(c|St|Mt|vs)\.$/.test(acc[acc.length - 1])) acc[acc.length - 1] += " " + s;
      else acc.push(s);
      return acc;
    }, [])
    .map((s) => s.trim())
    .filter(Boolean);
}

const segments = [];
const item = (kind, sub, voice = "n", extra = {}) => ({ kind, voice, sub, say: speak(sub), ...extra });

segments.push({
  id: "intro",
  items: [
    item("line", "Between 1095 and 1192, tens of thousands of men and women from Western Europe sewed a cloth cross to their clothes and set out for Jerusalem."),
    item("line", "Knights and peasants, bishops and kings. Most never came home."),
    item("line", "This is their story, told as the Christian chroniclers of the time told it."),
  ],
});

const PART = ["One", "Two", "Three", "Four", "Five"];
MODULES.forEach((m, mi) => {
  segments.push({
    id: `part:${m.id}`,
    items: [
      item("title", `Part ${PART[mi]}. ${m.name}. ${m.years}.`),
      ...sentences(m.blurb || "").map((s) => item("line", s)),
    ],
  });
  for (const ch of m.chapters) {
    const items = [item("title", `${ch.date}. ${ch.title}${/[.!?]$/.test(ch.title) ? "" : "."}`)];
    for (const p of ch.body) for (const s of sentences(p)) items.push(item("line", s));
    for (const q of ch.quotes || []) items.push(item("quote", q.text, "q", { source: q.source }));
    segments.push({ id: `ch:${m.id}:${ch.id}`, items });
  }
  for (const [id, sc] of Object.entries(m.battles || {})) {
    const items = [item("title", sc.title + ".")];
    sc.phases.forEach((ph, i) => items.push(item("phase", ph.caption, "n", { phase: i })));
    segments.push({ id: `sc:${m.id}:${id}`, items });
  }
});

segments.push({
  id: "outro",
  items: [
    item("line", "The crusader kingdom on the coast would last another hundred years, until Acre fell in 1291."),
    item("line", "Here ends the chronicle."),
  ],
});

process.stdout.write(JSON.stringify(segments, null, 1));
