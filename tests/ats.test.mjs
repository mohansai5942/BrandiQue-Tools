import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeResume,extractRequirements,terms} from '../public/assets/ats-core.js';
const resume=`Jane Example
jane@example.com | +91 9876543210 | github.com/jane
Summary
Software developer focused on accessible web applications, reliable automation and thoughtful interfaces for everyday users.
Education
Bachelor of Technology in Computer Science, Example University 2020
Experience
Developer, Example Organisation 2021 - 2024
• Built a reporting dashboard for 100 users with JavaScript and Python.
• Reduced processing time by 30% through automated data validation with Python.
• Designed customer workflows and implemented accessible navigation across web applications using React.
• Led delivery of 5 projects with clear documentation and careful testing using Git.
Skills
Python JavaScript HTML CSS SQL Git React`;
const relevant='Required skills: Python, JavaScript, React. Preferred: Git.';
const unrelated='Required skills: Accounting, bookkeeping, financial analysis. Preferred: Excel.';
test('deterministic score, categories sum and explicit limits',()=>{
 const r=analyzeResume(resume);assert.equal(r.score,r.categories.reduce((s,c)=>s+c.earned,0));assert.deepEqual(r,analyzeResume(resume));assert.match(r.warnings.at(-1),/not a score from an employer/);assert.ok(r.score>=0&&r.score<=100);
});
test('blank/scanned/non-resume content rejected',()=>{for(const t of ['', 'Page 1 image', 'This is a recipe about cooking food with fresh vegetables and spices. '.repeat(10)])assert.throws(()=>analyzeResume(t));});
test('JD changes the MAIN score and the formula is visible/reproducible',()=>{
 const good=analyzeResume(resume,{job:relevant}),bad=analyzeResume(resume,{job:unrelated});
 assert.ok(good.score>bad.score+20);assert.equal(good.score,Math.round(good.readinessScore*.4+good.jobMatch.score*.6));assert.equal(good.readinessScore,bad.readinessScore);
});
test('no Java substring match in JavaScript; short and punctuation skills preserved',()=>{
 const r=analyzeResume(resume,{job:'Java C++ C# SQL'});assert.ok(r.jobMatch.missing.includes('java'));assert.ok(r.jobMatch.missing.includes('c++'));assert.ok(r.jobMatch.missing.includes('c#'));assert.ok(r.jobMatch.matched.includes('sql'));assert.ok(!terms('javascript').includes('java'));
});
test('aliases recognise equivalent names',()=>{const r=analyzeResume(resume+'\nNodeJS AWS',{job:'Node.js and Amazon Web Services'});assert.ok(r.jobMatch.matched.includes('node.js'));assert.ok(r.jobMatch.matched.includes('aws'));});
test('skills mentions earn less than project evidence',()=>{
 const mention=resume+'\nDocker';
 const evidence=resume.replace('Skills','Projects\nBuilt a Docker deployment pipeline for a real application with documented release steps.\nSkills');
 const a=analyzeResume(mention,{job:'Docker'}),b=analyzeResume(evidence,{job:'Docker'});
 assert.equal(a.jobMatch.items[0].status,'Mention only');assert.equal(b.jobMatch.items[0].status,'Evidence found');assert.ok(b.score>a.score);
});
test('keyword repetition cannot improve JD match',()=>{
 const a=analyzeResume(resume,{job:'Rust Python'});const b=analyzeResume(resume+'\n'+'Python '.repeat(100),{job:'Rust Python'});assert.equal(a.jobMatch.score,b.jobMatch.score);
});
test('duplicate achievements receive no extra evidence credit',()=>{
 const a=analyzeResume(resume);const b=analyzeResume(resume.replace('Skills',('• Built a reporting dashboard for 100 users with JavaScript and Python.\n').repeat(15)+'Skills'));
 assert.equal(a.categories[3].earned,b.categories[3].earned);assert.ok(b.warnings.some(x=>x.includes('Repeated')));
});
test('empty headings and action word lists do not equal substantive evidence',()=>{
 const weak=`Jane Example jane@example.com
Education
Experience
Skills
Summary
built developed implemented automated improved created designed led trained deployed
I am eager to learn and interested in a role where I can grow and contribute to a team and learn new things every day.`;
 const a=analyzeResume(weak),b=analyzeResume(resume);assert.ok(a.score<b.score-20);assert.equal(a.categories[2].earned,0);assert.equal(a.categories[3].earned,0);
});
test('missing contact data lowers contact score',()=>{const r=analyzeResume(resume.replace('jane@example.com | +91 9876543210 | github.com/jane',''));assert.equal(r.categories.find(c=>c.name==='Contact details').earned,0);});
test('preferred terms lower priority than core skills',()=>{const req=extractRequirements('Required: Python\nPreferred: Rust');assert.equal(req.find(x=>x.term==='python').weight,2);assert.equal(req.find(x=>x.term==='rust').weight,1);});
test('simple negated experience not credited',()=>{const r=analyzeResume(resume+'\nNo experience with Rust',{job:'Rust'});assert.ok(r.jobMatch.missing.includes('rust'));});
test('target advice comes from actual missing/mention gaps',()=>{const r=analyzeResume(resume,{job:'Rust SQL'});assert.ok(r.improvements.some(x=>x.detail.includes('rust')));assert.ok(r.improvements.some(x=>x.detail.includes('sql')));assert.equal(r.target.gap,Math.max(0,95-r.score));});
test('input limits and unusable JD',()=>{assert.throws(()=>analyzeResume('a'.repeat(150001)));const r=analyzeResume(resume,{job:'the and for'});assert.equal(r.jobMatch,null);assert.ok(r.warnings.some(x=>x.includes('No usable')));});
test('freshers projects count as experience evidence',()=>{const r=analyzeResume(resume.replace('Experience','Projects'));assert.ok(r.categories[3].earned>15);});
