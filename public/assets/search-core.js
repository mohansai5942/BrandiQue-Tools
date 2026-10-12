// Tool search: tokenized, case-insensitive matching over title, aliases/keywords,
// category and description. Every query word must match somewhere ("word counter"
// matches "Word & Character Counter"). Light normalisation handles & / and, plurals
// and common punctuation.
const SYNONYMS={and:'&',colour:'color',colours:'colors'};
export function normalize(text){return String(text||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/[^\p{L}\p{N}%°²³/+.#-]+/gu,' ').replace(/\s+/g,' ').trim()}
export function tokens(query){return normalize(query).split(' ').filter(Boolean).map(w=>SYNONYMS[w]&&SYNONYMS[w]!=='&'?SYNONYMS[w]:w)}
const stem=w=>w.length>3?w.replace(/(?:ies)$/,'y').replace(/(?:es|s)$/,''):w;
export function matchesQuery(query,haystack){const words=tokens(query);if(!words.length)return true;const hay=normalize(haystack),hayWords=hay.split(' '),stems=new Set(hayWords.map(stem));return words.every(w=>hay.includes(w)||stems.has(stem(w))||hayWords.some(h=>stem(h).startsWith(stem(w))))}
export function scoreTool(query,{name='',keywords='',category='',description=''}={}){if(!matchesQuery(query,`${name} ${keywords} ${category} ${description}`))return 0;const q=normalize(query),n=normalize(name);return n===q?100:n.startsWith(q)?80:n.includes(q)?60:matchesQuery(query,name)?50:matchesQuery(query,`${name} ${keywords}`)?30:10}
