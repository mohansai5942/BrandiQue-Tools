// Live age statistics for the Age Calculator. Pure functions (no DOM) so they are unit-tested.
// Everything marked approx:true is an estimate based on stated averages, not a measurement.
import{calculateAge,addMonthsClamped}from'./media-core.js';
const DAY=864e5;
const pad=n=>String(n).padStart(2,'0');
export const isoDate=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
// Local birth moment from "YYYY-MM-DD" and optional "HH:MM".
export function birthMoment(date,time=''){if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))throw new Error('Enter a valid birth date.');const[h,m]=(time&&/^\d{1,2}:\d{2}/.test(time)?time:'00:00').split(':').map(Number);const[y,mo,d]=date.split('-').map(Number);const b=new Date(y,mo-1,d,h,m,0,0);if(b.getFullYear()!==y||b.getMonth()!==mo-1||b.getDate()!==d)throw new Error('Enter a valid birth date.');return b}
const ZODIAC=[['Capricorn','♑',1,19],['Aquarius','♒',2,18],['Pisces','♓',3,20],['Aries','♈',4,19],['Taurus','♉',5,20],['Gemini','♊',6,20],['Cancer','♋',7,22],['Leo','♌',8,22],['Virgo','♍',9,22],['Libra','♎',10,22],['Scorpio','♏',11,21],['Sagittarius','♐',12,21],['Capricorn','♑',12,31]];
export function zodiac(month,day){for(const[n,s,m,last]of ZODIAC)if(month<m||(month===m&&day<=last))return{name:n,symbol:s};return{name:'Capricorn',symbol:'♑'}}
const ANIMALS=['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
const ELEMENTS=['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
// By Gregorian birth year; the Chinese New Year falls between 21 Jan and 20 Feb, so earlier births may belong to the previous sign.
export function chineseZodiac(year,month=6,day=1){const y=year,i=((y-4)%12+12)%12,e=((y-4)%10+10)%10;return{animal:ANIMALS[i],element:ELEMENTS[e],nearNewYear:month===1||(month===2&&day<=20)}}
const STONES=['Garnet','Amethyst','Aquamarine','Diamond','Emerald','Pearl','Ruby','Peridot','Sapphire','Opal','Topaz','Turquoise'];
const FLOWERS=['Carnation','Violet','Daffodil','Daisy','Lily of the valley','Rose','Larkspur','Gladiolus','Aster','Marigold','Chrysanthemum','Narcissus'];
export const birthstone=m=>STONES[m-1];export const birthFlower=m=>FLOWERS[m-1];
export function generation(year){if(year>=2013)return'Generation Alpha';if(year>=1997)return'Gen Z';if(year>=1981)return'Millennial (Gen Y)';if(year>=1965)return'Gen X';if(year>=1946)return'Baby Boomer';if(year>=1928)return'Silent Generation';return'Greatest Generation'}
// Orbital periods in Earth days.
export const PLANETS=[['Mercury',87.969],['Venus',224.701],['Mars',686.98],['Jupiter',4332.59],['Saturn',10759.22],['Uranus',30688.5],['Neptune',60182]];
export function leapDaysLived(birth,now){let n=0;for(let y=birth.getFullYear();y<=now.getFullYear();y++){if(!(y%4===0&&(y%100!==0||y%400===0)))continue;const f=new Date(y,1,29);if(f>=birth&&f<=now)n++}return n}
// Next birthday at the birth time; 29 Feb birthdays fall on 28 Feb in non-leap years (same rule as calculateAge).
export function nextBirthday(birth,now){const B={y:birth.getFullYear(),m:birth.getMonth(),d:birth.getDate()};for(let k=Math.max(0,now.getFullYear()-B.y);k<=now.getFullYear()-B.y+1;k++){const a=addMonthsClamped(B,k*12),t=new Date(a.y,a.m,a.d,birth.getHours(),birth.getMinutes());if(t>now&&k>0)return{date:t,turning:k}}const a=addMonthsClamped(B,(now.getFullYear()-B.y+1)*12);return{date:new Date(a.y,a.m,a.d,birth.getHours(),birth.getMinutes()),turning:now.getFullYear()-B.y+1}}
export function splitDuration(ms){ms=Math.max(0,ms);const s=Math.floor(ms/1000);return{days:Math.floor(s/86400),hours:Math.floor(s%86400/3600),minutes:Math.floor(s%3600/60),seconds:s%60}}
export const MILESTONES=[['10,000 days',10000*DAY],['15,000 days',15000*DAY],['20,000 days',20000*DAY],['25,000 days',25000*DAY],['30,000 days',30000*DAY],['500 million seconds',5e11],['1 billion seconds',1e12],['2 billion seconds',2e12],['1,000 weeks',1000*7*DAY],['2,000 weeks',2000*7*DAY],['3,000 weeks',3000*7*DAY],['10,000 hours',1e4*36e5],['100,000 hours',1e5*36e5],['500,000 hours',5e5*36e5],['1 million minutes',1e6*6e4],['10 million minutes',1e7*6e4],['25 million minutes',2.5e7*6e4]];
export function milestones(birth,now){return MILESTONES.map(([label,ms])=>({label,date:new Date(birth.getTime()+ms),past:birth.getTime()+ms<=now.getTime()})).sort((a,b)=>a.date-b.date)}
// Everything the live grid shows, for a given "now".
export function ageStats(birth,now=new Date()){
 if(!(birth instanceof Date)||Number.isNaN(+birth))throw new Error('Enter a valid birth date.');
 if(birth>now)throw new Error('The birth date and time must be in the past.');
 const ms=now-birth,sec=ms/1000,min=sec/60,hr=min/60,days=ms/DAY,years=days/365.2425;
 const cal=calculateAge(isoDate(birth),isoDate(now));
 const totalMonths=cal.years*12+cal.months;const nb=nextBirthday(birth,now);
 const m=birth.getMonth()+1,d=birth.getDate();
 return{
  calendar:cal,totalMonths,
  totals:{years,months:totalMonths,weeks:Math.floor(days/7),days:Math.floor(days),hours:Math.floor(hr),minutes:Math.floor(min),seconds:Math.floor(sec)},
  next:{date:nb.date,turning:nb.turning,...splitDuration(nb.date-now),today:cal.months===0&&cal.days===0},
  bornOn:birth.toLocaleDateString('en-US',{weekday:'long'}),
  zodiac:zodiac(m,d),chinese:chineseZodiac(birth.getFullYear(),m,d),stone:birthstone(m),flower:birthFlower(m),generation:generation(birth.getFullYear()),
  leapDays:leapDaysLived(birth,now),
  estimates:{heartbeats:Math.round(min*80),breaths:Math.round(min*16),sleepHours:Math.round(hr/3),meals:Math.round(days*3),blinks:Math.round(min*15*(2/3)),steps:Math.round(Math.max(0,days-365)*6000),earthKm:Math.round(sec*29.78),fullMoons:Math.floor(days/29.530589)},
  planets:PLANETS.map(([name,p])=>({name,age:days/p})),
  milestones:milestones(birth,now)
 }}
