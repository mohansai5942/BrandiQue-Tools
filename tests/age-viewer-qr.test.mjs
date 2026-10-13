import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ageStats,birthMoment,zodiac,chineseZodiac,generation,leapDaysLived,nextBirthday,splitDuration,milestones,birthstone,birthFlower} from '../public/assets/age-stats.js';
import {fitScale,clampPan,savedText,fmtName,clampZoom} from '../public/assets/image-viewer.js';

test('age stats: live totals, 29 Feb next birthday and estimates',()=>{
 const b=birthMoment('2000-02-29','06:30'),now=new Date(2026,9,14,6,30,0);
 const s=ageStats(b,now);
 assert.deepEqual([s.calendar.years,s.calendar.months,s.calendar.days],[26,7,15]);
 assert.equal(s.totals.days,Math.floor((now-b)/864e5));
 assert.equal(s.totals.seconds,Math.floor((now-b)/1000));
 assert.equal(s.totals.months,26*12+7);
 assert.equal(s.next.turning,27);
 assert.equal(s.next.date.getMonth(),1);assert.equal(s.next.date.getDate(),28); // 2027 is not a leap year
 assert.equal(s.bornOn,'Tuesday');
 assert.equal(s.zodiac.name,'Pisces');
 assert.equal(`${s.chinese.element} ${s.chinese.animal}`,'Metal Dragon');
 assert.equal(s.generation,'Gen Z');
 assert.equal(s.leapDays,6);
 assert.equal(s.estimates.heartbeats,Math.round((now-b)/6e4*80));
 assert.ok(s.estimates.earthKm>2.4e10&&s.estimates.earthKm<2.6e10);
 assert.equal(s.planets.find(p=>p.name==='Mercury').age.toFixed(0),String(Math.round(((now-b)/864e5)/87.969)));
 assert.throws(()=>ageStats(new Date(2030,0,1),now),/past/);
 assert.throws(()=>birthMoment('2001-02-29'),/valid/);
});
test('age stats: next birthday in a leap year lands on 29 Feb, and birthday-today handling',()=>{
 const b=birthMoment('2000-02-29');
 const n=nextBirthday(b,new Date(2028,0,10));assert.equal(n.date.getDate(),29);assert.equal(n.turning,28);
 const later=nextBirthday(birthMoment('1990-05-15','18:00'),new Date(2026,4,15,9,0));assert.equal(later.date.getFullYear(),2026);assert.equal(later.turning,36);
 assert.ok(ageStats(birthMoment('1990-05-15'),new Date(2026,4,15,9,0)).next.today);
 assert.deepEqual(splitDuration(90061000),{days:1,hours:1,minutes:1,seconds:1});
});
test('age facts tables',()=>{
 assert.equal(zodiac(1,19).name,'Capricorn');assert.equal(zodiac(1,20).name,'Aquarius');assert.equal(zodiac(12,22).name,'Capricorn');assert.equal(zodiac(3,21).name,'Aries');
 assert.equal(chineseZodiac(2024).animal,'Dragon');assert.equal(chineseZodiac(2002).animal,'Horse');
 assert.equal(generation(2002),'Gen Z');assert.equal(generation(1990),'Millennial (Gen Y)');assert.equal(generation(2015),'Generation Alpha');
 assert.equal(birthstone(10),'Opal');assert.equal(birthFlower(10),'Marigold');
 assert.equal(leapDaysLived(new Date(2001,0,1),new Date(2009,0,1)),2);
 const m=milestones(new Date(2000,0,1),new Date(2032,0,1));assert.ok(m.find(x=>x.label==='1 billion seconds').past);assert.ok(m.every((x,i)=>!i||m[i-1].date<=x.date));
});
test('image viewer math',()=>{
 assert.equal(fitScale(800,600,4000,3000),0.2);
 assert.equal(fitScale(240,320,24,16),10); // tiny images are enlarged to fill the panel
 assert.equal(clampPan(500,1000,800),100);assert.equal(clampPan(-500,1000,800),-100);assert.equal(clampPan(40,300,800),0);
 assert.equal(savedText(1000,250),'75.0% smaller');assert.equal(savedText(1000,1500),'50.0% larger');
 assert.equal(fmtName('image/jpeg'),'JPG');assert.equal(clampZoom(100),16);
});
test('QR: processing overlay clears when the scan test ends, including after an upload (regression)',async()=>{
 const s=await readFile(new URL('../public/assets/tool-qr.js',import.meta.url),'utf8');
 // Upload hands over to render() only after it has released its own busy state…
 assert.match(s,/linkFor\[type\]=url;uploadCtl=null;/);
 // …and render clears the overlay as soon as the scan test returns (pass, fail or unknown) and on invalid input.
 assert.match(s,/const ok=await scanCheck\(opts\);if\(my!==token\)return;if\(!uploadCtl\)proc\(false\);/);
 assert.match(s,/\$\(r,'\[data-check\]'\)\.textContent='';if\(!uploadCtl\)proc\(false\);return\}/);
});
test('Image Resizer keeps file type & size in the main options; both image tools use the large viewer',async()=>{
 const flow=await readFile(new URL('../public/assets/tool-flow.js',import.meta.url),'utf8'),ir=await readFile(new URL('../public/assets/tool-image-resizer.js',import.meta.url),'utf8'),ms=await readFile(new URL('../public/assets/tool-media-suite.js',import.meta.url),'utf8');
 assert.match(flow,/splitAt:'\.ir-advanced'/);
 assert.match(ir,/createViewer\(/);assert.match(ir,/tfLayout='wide'/);
 assert.match(ms,/r\.dataset\.tfLayout='wide'/);assert.match(ms,/createViewer\(/);
});
