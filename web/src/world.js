import {findTrack,getTrackSpawn,onTrack} from './tracks.js';
// Fictional REV world. All coordinates are local game meters, not GPS.
// Schoolhouse department names are an artistic adaptation, not a financial-data connection.
export const SPAWNS = Object.freeze({
  drift:{...getTrackSpawn(findTrack('north-pines')),name:'NORTH PINES TANDEM'},
  highway:{...getTrackSpawn(findTrack('outer-express')),name:'OUTER EXPRESS / SCHOOLYARD CLOSED COURSE'},
  campus:{x:-50,z:-91,heading:0,name:'SCHOOLHOUSE YARD'},
  garage:{x:48,z:-30,heading:0,name:'REV COMMUNITY GARAGE'},
  meet:{x:-57,z:65,heading:0,name:'COMMUNITY CAR MEET / PARK ONLY'},
});
export const WORLD_BOUNDS = Object.freeze({minX:-525,maxX:525,minZ:-790,maxZ:790});
// Legacy compatibility for early traffic prototype, not used by the five-track scene.
export const HIGHWAY = Object.freeze({
  west:128,east:232,minZ:-420,maxZ:420,
  lanes:[145,156,167,178,189,200,211,222],
  playerStartLane:1,
});
export const DEPARTMENTS = Object.freeze([
  {id:'research',name:'RESEARCH LIBRARY',short:'RESEARCH',x:-110,z:-129,theme:'#466d67',
   lead:'Explore the evidence behind the ideas.',category:'Markets & Evidence',
   detail:'Schoolhouse reading room for research themes, course materials and sourced findings. No live financial data is connected.'},
  {id:'quant',name:'QUANT LAB',short:'QUANT',x:-90,z:-129,theme:'#517d80',
   lead:'Turn questions into measurable tests.',category:'Mathematics & Risk',
   detail:'Interactive lessons on data, probability, and risk; mathematical tools are planned. This preview does not calculate investment results.'},
  {id:'registrar',name:'REGISTRAR OFFICE',short:'REGISTRAR',x:-70,z:-129,theme:'#9b8058',
   lead:'See how progress is recorded.',category:'Records & Accountability',
   detail:'An informational preview of the Registrar department. The authoritative school ledger stays in the original private repository.'},
  {id:'director',name:"DIRECTOR'S OFFICE",short:'DIRECTOR',x:-50,z:-129,theme:'#a88b62',
   lead:'Find your next Schoolhouse assignment.',category:'Director & Campus',
   detail:'The campus office for Parker and game-world announcements. It is not an administrator interface and cannot change the Schoolhouse rules.'},
  {id:'strategy',name:'STRATEGY WORKSHOP',short:'STRATEGY',x:-30,z:-129,theme:'#7a9666',
   lead:'Build your approach, then test it.',category:'Planning & Courses',
   detail:'A preview department for tutorials, strategy projects and practice activities. No investing decisions are placed here.'},
  {id:'creative',name:'REV MEDIA STUDIO',short:'MEDIA',x:-10,z:-129,theme:'#c1815d',
   lead:'Turn the drive into something worth sharing.',category:'Media & Community',
   detail:'A future location for photo mode, livery design, replay editing and event artwork.'},
  {id:'commons',name:'COMMUNITY COMMONS',short:'COMMONS',x:-85,z:-175,theme:'#61816f',
   lead:'Meet the people behind the projects.',category:'Conversations & Events',
   detail:'A social area for future character conversations and meet recaps. There is no live chat or multiplayer in this build.'},
  {id:'depot',name:'CAR CARE WORKSHOP',short:'CAR CARE',x:-45,z:-175,theme:'#b78453',
   lead:'Care for the car you love.',category:'Garage & Service',
   detail:'A future shop for tire setups, repairs, detailing education, paint protection and original vehicle customization.'},
]);

export const WORLD_STOPS = Object.freeze([
  {id:'drift',name:'DRIFT PAD',x:SPAWNS.drift.x,z:SPAWNS.drift.z,mode:'drift'},
  {id:'highway',name:'HIGHWAY LOOP',x:SPAWNS.highway.x,z:SPAWNS.highway.z,mode:'highway'},
  {id:'campus',name:'SCHOOLHOUSE',x:SPAWNS.campus.x,z:SPAWNS.campus.z,mode:'campus'},
  {id:'garage',name:'REV GARAGE',x:SPAWNS.garage.x,z:SPAWNS.garage.z,mode:'campus'},
  {id:'meet',name:'MEET LOT',x:SPAWNS.meet.x,z:SPAWNS.meet.z,mode:'campus'},
]);
export function parked(state){
  return Number.isFinite(state?.speedKmh) && state.speedKmh < 5;
}
export function nearbyDepartment(state,reach=12){
  if(!state || !Number.isFinite(state.x) || !Number.isFinite(state.z)) return null;
  let closest=null,distance=Infinity;
  for(const place of DEPARTMENTS) {
    const gap=Math.hypot(state.x-place.x,state.z-place.z);
    if(gap<reach && gap<distance){closest=place;distance=gap;}
  }
  return closest;
}
export function canEnterDepartment(state,department,reach=12) {
  return Boolean(department && parked(state) &&
    Math.hypot(state.x-department.x,state.z-department.z) <=reach);
}
export function nearHighway(state) {
  return Boolean(state && onTrack(findTrack('outer-express'),state.x,state.z).inside);
}
