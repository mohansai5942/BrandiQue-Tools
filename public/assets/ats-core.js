// Transparent, local heuristics. This is not a proprietary employer ATS model.
const aliases = {
 'javascript':['javascript','js'], 'typescript':['typescript','ts'], 'python':['python'], 'java':['java'], 'c++':['c++','cpp'], 'c#':['c#','c sharp'], 'c':['c'],
 'react':['react','react.js','reactjs'], 'node.js':['node.js','nodejs','node js'], 'next.js':['next.js','nextjs'], 'vue':['vue','vue.js','vuejs'], 'angular':['angular'],
 'html':['html','html5'], 'css':['css','css3'], 'sql':['sql'], 'postgresql':['postgresql','postgres'], 'mysql':['mysql'], 'mongodb':['mongodb','mongo db'],
 'git':['git'], 'docker':['docker'], 'kubernetes':['kubernetes','k8s'], 'aws':['aws','amazon web services'], 'azure':['azure'], 'gcp':['gcp','google cloud'],
 'rest api':['rest api','rest apis','restful','restful api'], 'graphql':['graphql'], 'spring boot':['spring boot'], '.net':['.net','dotnet','asp.net'],
 'django':['django'], 'flask':['flask'], 'fastapi':['fastapi'], 'linux':['linux'], 'ci/cd':['ci/cd','continuous integration','continuous delivery'],
 'unit testing':['unit testing','unit tests'], 'agile':['agile'], 'scrum':['scrum'], 'data structures':['data structures','dsa'], 'algorithms':['algorithms','dsa'],
 'machine learning':['machine learning','ml'], 'deep learning':['deep learning'], 'nlp':['nlp','natural language processing'], 'computer vision':['computer vision'],
 'tensorflow':['tensorflow'], 'pytorch':['pytorch'], 'pandas':['pandas'], 'numpy':['numpy'], 'scikit-learn':['scikit-learn','sklearn'],
 'excel':['excel','microsoft excel'], 'power bi':['power bi','powerbi'], 'tableau':['tableau'], 'data analysis':['data analysis','data analytics'],
 'project management':['project management'], 'customer service':['customer service','customer support'], 'sales':['sales'], 'marketing':['marketing'],
 'seo':['seo','search engine optimization','search engine optimisation'], 'figma':['figma'], 'ui/ux':['ui/ux','ux design','user experience design'],
 'accounting':['accounting'], 'financial analysis':['financial analysis'], 'bookkeeping':['bookkeeping'], 'recruitment':['recruitment','recruiting'],
 'communication':['communication','communicating'], 'leadership':['leadership'], 'problem solving':['problem solving','problem-solving'],
 'rust':['rust'], 'go':['golang','go'], 'php':['php'], 'ruby':['ruby'], 'swift':['swift'], 'kotlin':['kotlin'], 'selenium':['selenium'], 'jira':['jira']
};
const stop=new Set('the and for with that this from your you our are will have has into who all can not but using work role team job skills experience requirements required preferred years ability strong excellent responsibilities candidate must should including looking about also their they them more such good knowledge understanding demonstrated proven minimum qualification qualifications degree bachelor bachelors master masters equivalent company business opportunity equal employer benefits salary location apply application position join seeking possess relevant related working environment need needs would plus able essential proficiency proficient familiarity expertise hands on developing development build building maintain maintaining support ensure within across other both please based description of to in on a an is be as or at by we it us may'.split(' '));
const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[–—]/g,'-');
const escaped=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const has=(text,term)=>new RegExp(`(^|[^a-z0-9+#])${escaped(term)}(?=$|[^a-z0-9+#])`,'i').test(text);
export const terms=text=>[...new Set((normalize(text).match(/[a-z][a-z0-9+#.-]*/g)||[]).map(s=>s.replace(/[.-]+$/,'')).filter(s=>!stop.has(s)&&s.length>2))];
const action=/\b(built|developed|designed|implemented|improved|reduced|increased|created|led|automated|analyzed|analysed|delivered|optimized|optimised|managed|achieved|trained|deployed|tested|resolved|supported|coordinated|processed|sold|negotiated|organized|organised|maintained|integrated|researched)\b/i;
const metric=/\b\d+(?:\.\d+)?\s*(?:%|users\b|customers\b|hours\b|minutes\b|records\b|requests\b|students\b|devices\b|revenue\b)|[$₹€£]\s*\d/i;
const headings={education:/^(?:education|academic(?: background| qualifications)?|qualifications)\s*:?$/i,experience:/^(?:(?:professional |work |relevant )?experience|employment(?: history)?|work history|internships?)\s*:?$/i,projects:/^(?:(?:academic |personal |selected |technical )?projects?|portfolio)\s*:?$/i,skills:/^(?:(?:technical |core |professional )?skills|technologies|technical proficiency|competencies)\s*:?$/i,summary:/^(?:summary|professional summary|profile|objective|career objective|about me)\s*:?$/i};
export function extractRequirements(job){
 const text=normalize(job), lines=text.split(/[\n;]+|\.\s+/).filter(l=>l.trim()&&!/\b(equal opportunity|benefits include|salary range|we offer|about our company|not required|not necessary)\b/.test(l)), found=[];
 for(const [term,variants] of Object.entries(aliases)){
  const source=lines.find(l=>variants.some(v=>has(l,v)));
  if(!source)continue;
  if(/\b(?:not required|not necessary|no .*required)\b/.test(source)&&! /\brequired\b.*\bbut\b/.test(source))continue;
  const optional=/\b(preferred|nice.to.have|bonus|optional|a plus)\b/.test(source);
  found.push({term,variants,weight:optional?1:2,priority:optional?'Preferred':'Core',source:source.trim().slice(0,240),kind:'recognised skill'});
 }
 // Other JD terms are deliberately labelled: users can see the limits of extraction.
 const covered=new Set(found.flatMap(x=>x.variants.flatMap(terms)));
 const extras=terms(lines.join(" ")).filter(t=>!covered.has(t)&&!/^\d/.test(t)&&!['com','www','https','http'].includes(t));
 for(const term of extras.slice(0,35))found.push({term,variants:[term],weight:.5,priority:'Context',source:lines.find(l=>has(l,term))?.trim().slice(0,240)||'',kind:'other JD term'});
 return found;
}
export function analyzeResume(input,{job='',pages=null,fileType='text'}={}){
 const text=String(input).replace(/\u0000/g,'').trim();
 if(text.length>150000||job.length>50000)throw Error('Use a resume below 150,000 characters and a job description below 50,000 characters.');
 const words=text.split(/\s+/).filter(Boolean),count=words.length;
 if(count<30||text.length<150)throw Error('Not enough readable resume text to score. Use a text-based PDF, DOCX or TXT, or paste the extracted text. Scanned PDFs need OCR first.');
 const rawLines=text.split(/\n/).map(l=>l.trim()).filter(Boolean), unique=[...new Set(rawLines)],sections={}, annotated=[];let section='other';
 for(const line of unique){const h=Object.entries(headings).find(([,re])=>re.test(line));if(h){section=h[0];sections[section]=true}else annotated.push({line,section});}
 const email=/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text),phone=(text.match(/\+?\d[\d ()-]{7,}\d/g)||[]).some(s=>{const n=s.replace(/\D/g,'').length;return n>=10&&n<=15}),link=/\b(?:linkedin\.com|github\.com|https?:\/\/|www\.)/i.test(text);
 if(!email&&!phone&&!sections.education&&!sections.experience&&!sections.projects)throw Error('This does not look like a readable resume. Check extraction and include genuine education, projects or work history before scoring.');
 const content=annotated.filter(x=>['experience','projects'].includes(x.section));
 const bullets=content.filter(x=>action.test(x.line)&&x.line.split(/\s+/).length>=8);
 const quantified=bullets.filter(x=>metric.test(x.line));
 const dated=content.some(x=>/\b(?:19|20)\d{2}\b/.test(x.line));
 const known=Object.entries(aliases).filter(([,v])=>v.some(a=>has(normalize(text),a))).map(([t])=>t);
 const odd=(text.match(/\ufffd/g)||[]).length;
 const duplicateRatio=1-unique.length/Math.max(1,rawLines.length);
 const sectionsContent=key=>annotated.filter(x=>x.section===key).reduce((n,x)=>n+x.line.split(/\s+/).length,0);
 const warnings=[];
 if(odd)warnings.push('Some characters did not extract cleanly. Review the text preview.');
 if(duplicateRatio>.2)warnings.push('Repeated lines detected. Duplicate content does not earn extra evidence credit.');
 if(pages&&pages>3)warnings.push('This PDF is longer than three pages. Check whether all content is relevant to the role.');
 const categories=[
  {name:'Text extraction',max:15,earned:Math.max(0,15-Math.min(10,odd*2)-(rawLines.length<5?5:0)-(duplicateRatio>.2?5:0)),evidence:`${count} words, ${rawLines.length} lines, ${odd} unreadable characters. Visual layout is not verified.`,tip:'Export selectable text, check reading order in the preview and remove duplicate lines.'},
  {name:'Contact details',max:10,earned:(email?5:0)+(phone?3:0)+(link?2:0),evidence:`Email ${email?'found':'missing'}; phone ${phone?'found':'missing'}; profile/website ${link?'found':'missing'}.`,tip:`Add ${[!email&&'a professional email',!phone&&'a phone number',!link&&'a relevant profile or portfolio URL'].filter(Boolean).join(', ')} in the document body.`},
  {name:'Section content',max:20,earned:(sectionsContent('education')>=5?5:0)+(sectionsContent('experience')+sectionsContent('projects')>=25?10:0)+(sectionsContent('skills')>=3?5:0),evidence:`Education ${sectionsContent('education')} words; experience/projects ${sectionsContent('experience')+sectionsContent('projects')} words; skills ${sectionsContent('skills')} words. Empty headings earn no credit.`,tip:'Use standard headings and substantive Education, Skills, and Experience or Projects sections. For freshers, real academic/personal projects count.'},
  {name:'Experience & project evidence',max:25,earned:Math.min(12,bullets.length*3)+Math.min(9,quantified.length*3)+(dated?4:0),evidence:`${bullets.length} distinct action-led evidence lines; ${quantified.length} with numbers; project/work dates ${dated?'found':'missing'}.`,tip:`${bullets.length<4?'Describe your own contribution in up to four concise project/work bullets. ':''}${quantified.length<3?'Add genuine outcomes or scale where known, not invented metrics. ':''}${!dated?'Add project/internship/employment dates.':''}`.trim()},
  {name:'Specificity & readability',max:20,earned:Math.min(8,known.length*2)+Math.min(8,bullets.filter(x=>x.line.split(/\s+/).length<=45).length*2)+(sections.summary&&sectionsContent('summary')>=12?4:0),evidence:`${known.length} recognised skills; ${bullets.filter(x=>x.line.split(/\s+/).length<=45).length} concise evidence lines; summary ${sectionsContent('summary')} words. Skill dictionary is not exhaustive.`,tip:'Name the tools/methods you actually used, keep evidence bullets focused and add a short role-relevant summary.'},
  {name:'Content length',max:10,earned:count>=250&&count<=1000?10:count>=150&&count<=1400?7:count>=80?3:0,evidence:`${count} words${pages?` on ${pages} pages`:''}. Length is an editorial guideline, not an employer ATS rule.`,tip:count<250?'Explain relevant work/projects in more useful detail; do not pad with filler.':'Remove repetition and prioritise relevant accomplishments.'}
 ];
 const readinessScore=categories.reduce((n,c)=>n+c.earned,0);
 const requirements=extractRequirements(job);let jobMatch=null;
 if(job.trim()&&!requirements.length)warnings.push('No usable requirements detected in the JD. Paste specific responsibilities and skills.');
 if(requirements.length){
  const evidence=content.filter(x=>action.test(x.line)&&x.line.split(/\s+/).length>=8);
  const items=requirements.map(r=>{
   const matching=annotated.filter(x=>r.variants.some(v=>has(normalize(x.line),v))&&!/\b(no experience|not experienced|not familiar|never used|want to learn|planning to learn)\b/i.test(x.line));
   const example=evidence.find(x=>matching.includes(x));
   return{...r,status:example?'Evidence found':matching.length?'Mention only':'Not found',credit:example?1:matching.length ? 0.5 : 0,evidence:(example||matching[0])?.line.slice(0,300)||''};
  });
  const total=items.reduce((n,r)=>n+r.weight,0),coverage=items.reduce((n,r)=>n+(r.credit>0?r.weight:0),0)/total;
  const evidenceRatio=items.reduce((n,r)=>n+r.credit*r.weight,0)/total;
  const matchScore=Math.round((coverage*.4+evidenceRatio*.6)*100);
  jobMatch={score:matchScore,coverage:Math.round(coverage*100),evidenceScore:Math.round(evidenceRatio*100),matched:items.filter(x=>x.credit>0).map(x=>x.term),missing:items.filter(x=>!x.credit).map(x=>x.term),mentionOnly:items.filter(x=>x.credit===.5).map(x=>x.term),total:items.length,items};
  if(items.filter(x=>x.kind==='recognised skill').length<2)warnings.push('Few recognised skills in this JD. Context-term matching is limited; review the extracted requirements before relying on the result.');
  warnings.push('JD match uses word boundaries, selected aliases and nearby evidence. It does not verify qualifications, seniority, dates of employment, negation in every sentence or semantic equivalence.');
 }
 const score=jobMatch?Math.round(readinessScore*.4+jobMatch.score*.6):readinessScore;
 const improvements=categories.filter(c=>c.earned<c.max).sort((a,b)=>(b.max-b.earned)-(a.max-a.earned)).map(c=>({priority:c.max-c.earned>=8?'High':'Medium',area:c.name,detail:c.tip,availablePoints:c.max-c.earned}));
 if(jobMatch){
  const missing=jobMatch.items.filter(x=>!x.credit).sort((a,b)=>b.weight-a.weight);
  if(missing.length)improvements.unshift({priority:'High',area:'Missing job requirements',detail:`Not found: ${missing.slice(0,12).map(x=>x.term).join(', ')}. Add only skills you genuinely possess. Describe relevant work/projects; if you lack a requirement, build the experience rather than claim it.`,availablePoints:null});
  if(jobMatch.mentionOnly.length)improvements.unshift({priority:'High',area:'Show application, not just keywords',detail:`Mentioned without clear evidence: ${jobMatch.mentionOnly.slice(0,12).join(', ')}. Add a truthful project/work bullet explaining what you did, how you used the skill and the result.`,availablePoints:null});
 }
 warnings.push('This is a transparent resume-readiness estimate, not a score from an employer’s ATS. There is no universal ATS score, and 95+ here cannot guarantee shortlisting.');
 return{version:2,score,readinessScore,mode:jobMatch?'Job-targeted estimate':'General readiness estimate',categories,words:count,pages,fileType,jobMatch,warnings,improvements,target:{goal:95,gap:Math.max(0,95-score),message:score>=95?'This resume meets most checks in this model. Verify every claim and proofread before applying.':'Aim to close the gaps below, then recheck. 95+ is a target for this model, not a promised outcome or a reason to add unsupported claims.'}};
}
