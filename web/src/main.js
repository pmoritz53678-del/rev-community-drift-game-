import * as THREE from 'three';
import './style.css';
import {CARS,CATEGORIES,findCar} from './roster.js';
import {newCarState,stepCar,resetAt} from './physics.js';
import {TRACKS, findTrack, getTrackSpawn, pointOnTrack, sampleTrack, onTrack, newLapState, updateLapState} from './tracks.js';
import {DEPARTMENTS, nearbyDepartment, canEnterDepartment} from './world.js';
import {buildSchoolyardWorld} from './renderSchoolyard.js';
import {drawSchoolMap} from './mapUI.js';
import {createCircuitTraffic, advanceCircuitTraffic, trafficPose, evaluateCircuitTraffic} from './circuitTraffic.js';


// REV COMMUNITY DRIFT ACADEMY v0.1
// Procedural THREE.JS preview scene. The Unreal project is a separate future native build.
// All driving values are standalone arcade physics and cannot modify the You vs AI ledgers.
const $ = (id)=>document.getElementById(id);
const canvas=$('gameCanvas');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x182a2e);
scene.fog=new THREE.FogExp2(0x182a2e,0.007);
const camera=new THREE.PerspectiveCamera(63,1,0.1,700);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.75));
renderer.shadowMap.enabled=false;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.65;
scene.add(new THREE.HemisphereLight(0xb4d5dc,0x665848,2.2));
const sun=new THREE.DirectionalLight(0xffd0a0,3.3);
sun.position.set(-70,100,35);
scene.add(sun);
const clock=new THREE.Clock();
const controls={left:false,right:false,throttle:false,brake:false,handbrake:false};
let state=newCarState(),baseCar=findCar('nova'),tunedCar={...baseCar};
let vehicle=null,currentColor=baseCar.color,cameraMode=0,activeZone='SUNSET PRACTICE PAD';
let activeTab='drive',gameActive=false,portalOrbit=0;

let activeTrack=findTrack('north-pines');
let driveMode='drift';
let lapState=newLapState(),nearPasses=0,collisions=0,raceScore=0,lastMapDraw=0;
let departmentOpen=false,currentDepartment=null;
let circuitTraffic=createCircuitTraffic(11);
let circuitVehicles=[];
const trackSamples=new Map(TRACKS.map(t=>[t.id,sampleTrack(t,160)]));

let bestScore=0,lastSaved=0,lastSmoke=0,noticeTimer=0;
try{bestScore=Number(localStorage.getItem('rev-drift-best')||0)}catch{}
const PAINTS=[
  {name:'Factory Silver',value:0x9ba5ab},{name:'Midnight Black',value:0x22272a},
  {name:'Motorsport Green',value:0x416d57},{name:'Signal Orange',value:0xed6b36},
  {name:'Championship Red',value:0xd44747},{name:'Pearl White',value:0xe9e9df},
];
const CHALLENGES=[
  {target:500,title:'First Slide',description:'Earn your first 500 drift points.'},
  {target:2500,title:'Find Your Line',description:'Earn 2,500 drift points in a practice run.'},
  {target:6000,title:'Drift Academy Graduate',description:'Earn 6,000 points in a single practice session.'},
];
const asphalt=new THREE.MeshStandardMaterial({color:0x30393a,roughness:0.94});
const concrete=new THREE.MeshStandardMaterial({color:0x667277,roughness:0.95});
const chalk=new THREE.MeshBasicMaterial({color:0xd8d5bf});
const warm=new THREE.MeshStandardMaterial({color:0xd6a052,roughness:0.8});
const green=new THREE.MeshStandardMaterial({color:0x294840,roughness:0.78});

function createBox(w,h,d,material,x,y,z, parent=scene) {
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
  mesh.position.set(x,y,z);parent.add(mesh);return mesh;
}
function paintStripe(x,z,w,d,color=0xd5cfb8,y=0.015) {
  createBox(w,0.025,d,new THREE.MeshBasicMaterial({color}),x,y,z);
}
function makeTextTexture(text,background='#1c3432',foreground='#f5e4ca'){
  const cv=document.createElement('canvas');cv.width=1024;cv.height=256;
  const ctx=cv.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,1024,256);
  ctx.fillStyle='#e4a55d';ctx.fillRect(0,0,1024,9);
  ctx.font='bold 59px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=foreground;ctx.fillText(text,512,132,970);
  const texture=new THREE.CanvasTexture(cv);texture.colorSpace=THREE.SRGBColorSpace;
  return texture;
}
function sign(text,w,h,x,y,z,angle=Math.PI) {
  const material=new THREE.MeshBasicMaterial({map:makeTextTexture(text),side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);
  mesh.rotation.y=angle;mesh.position.set(x,y,z);scene.add(mesh);
}
function addCones(cx,cz,radius,count=12) {
  for(let n=0;n<count;n++){
    const t=(n/count)*Math.PI*2;
    const x=cx+Math.cos(t)*radius,z=cz+Math.sin(t)*radius;
    const cone=new THREE.Mesh(new THREE.ConeGeometry(.44,1.15,7),new THREE.MeshStandardMaterial({color:0xf58b47,roughness:0.8}));
    cone.position.set(x,.58,z);scene.add(cone);
    createBox(.65,.07,.65,new THREE.MeshStandardMaterial({color:0xf3e4cc}),x,.05,z);
  }
}
function buildCar(car,color){
  const g=new THREE.Group();g.name='original-fictional-car';
  const isExotic=car.shape==='exotic'||car.shape==='hyper';
  const isWagon=car.shape==='wagon';
  const length=isExotic?4.6:isWagon?5.2:4.35;
  const width=isExotic?2.18:2.0;
  const bodyH=isExotic?.39:.51;
  const mat=new THREE.MeshStandardMaterial({color,metalness:.7,roughness:.29});
  const carbon=new THREE.MeshStandardMaterial({color:0x151c20,metalness:.25,roughness:.33});
  const glass=new THREE.MeshStandardMaterial({color:0x3c606c,metalness:.25,roughness:.15,transparent:true,opacity:.85});
  const light=new THREE.MeshBasicMaterial({color:0xe6e7e4});
  const rearLight=new THREE.MeshBasicMaterial({color:0xde443c});
  // Body, nose, hood, and cockpit.
  createBox(width,bodyH,length,mat,0,.73,0,g);
  createBox(width*.89,.17,length*.43,mat,0,.98,-length*.23,g);
  createBox(width*.76,isExotic?.33:.41,length*(isWagon?.56:.42),glass,0,1.21,isWagon?.19:.10,g);
  const roof=createBox(width*.77,.13,length*(isWagon?.56:.39),mat,0,1.42,isWagon?.18:.11,g);
  if(isExotic){roof.position.y=1.31;}
  createBox(width*.71,.1,.08,carbon,0,1.03,-length*.27,g);
  createBox(width*.8,.24,.12,carbon,0,.70,-length/2+.01,g);
  createBox(width*.81,.17,.08,carbon,0,.66,length/2-.04,g);
  // Light clusters and grille.
  for(const side of [-1,1]){
    createBox(.44,.11,.06,light,side*width*.31,.88,-length/2-.03,g);
    createBox(.48,.12,.06,rearLight,side*width*.30,.81,length/2+.03,g);
    const tire=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.27,18),new THREE.MeshStandardMaterial({color:0x0e1114,roughness:.96}));
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.29,.29,.285,10),new THREE.MeshStandardMaterial({color:0x8b9594,metalness:.82,roughness:.25}));
    for(const z of [-length*.32,length*.32]){
      const wheel=tire.clone(),rim=hub.clone();
      wheel.rotation.z=Math.PI/2;rim.rotation.z=Math.PI/2;
      wheel.position.set(side*(width/2+.04),.42,z);
      rim.position.set(side*(width/2+.09),.42,z);
      g.add(wheel,rim);
      const caliper=createBox(.09,.30,.20,new THREE.MeshStandardMaterial({color:0xc84137,metalness:.2,roughness:.35}),side*(width/2-.05),.46,z-.15,g);
      caliper.name='red-brake-caliper';
    }
  }
  if(isExotic){
    createBox(width*.92,.08,.30,carbon,0,1.02,length*.47,g);
    createBox(.12,.35,.08,carbon,-width*.35,.90,length*.47,g);
    createBox(.12,.35,.08,carbon,width*.35,.90,length*.47,g);
  }
  if(car.id==='ranger'){
    const stripe=createBox(.06,.17,length*.7,warm,width*.51,.71,0,g);
    stripe.name='community-support-accent';
  }
  return g;
}
function resize(){
  const rect=canvas.parentElement.getBoundingClientRect();
  const width=Math.max(1,Math.round(rect.width)),height=Math.max(1,Math.round(rect.height));
  renderer.setSize(width,height,false);
  camera.aspect=width/height;camera.updateProjectionMatrix();
}
buildSchoolyardWorld(scene);
function showToast(message){
  const toast=$('toast');toast.textContent=message;
  toast.classList.add('show');clearTimeout(noticeTimer);
  noticeTimer=setTimeout(()=>toast.classList.remove('show'),2500);
}
function updateTuning(){
  const grip=Number($('gripTune').value),handling=Number($('handlingTune').value);
  $('gripValue').textContent=grip;$('handlingValue').textContent=handling;
  tunedCar={...baseCar,grip,handling};
}
function setCar(id){
  baseCar=findCar(id);
  $('gripTune').value=baseCar.grip;$('handlingTune').value=baseCar.handling;
  updateTuning();
  currentColor=baseCar.color;
  if(vehicle)scene.remove(vehicle);
  vehicle=buildCar(baseCar,currentColor);scene.add(vehicle);
  state=resetAt(state.x,state.z,state.heading);
  $('carName').textContent=baseCar.brand+' '+baseCar.model;
  $('driveCar').textContent=baseCar.brand+' '+baseCar.model;
  $('driveDrive').textContent=baseCar.drive==='RWD'?'REAR WHEEL':'ALL WHEEL';
  $('driveType').textContent=baseCar.drive;
  $('makeDisplay').textContent=baseCar.brand;
  $('modelDisplay').textContent=baseCar.model;
  $('carClass').textContent=baseCar.category;
  $('carStory').textContent=baseCar.story;
  $('power').textContent=baseCar.power+' HP';
  $('weight').textContent=baseCar.weight+' KG';
  $('drivetrain').textContent=baseCar.drive;
  document.querySelectorAll('.paint-chip').forEach(chip=>chip.classList.toggle('selected',Number(chip.dataset.paint)===currentColor));
}
function selectCategory(){
  const selected=$('category').value;
  const options=CARS.filter(car=>selected==='All'||car.category===selected);
  $('carSelect').innerHTML='';
  for(const car of options){
    const option=document.createElement('option');
    option.value=car.id;option.textContent=car.brand+' '+car.model;
    $('carSelect').append(option);
  }
  if(options.length){$('carSelect').value=options[0].id;setCar(options[0].id);}
}
function renderPaints(){
  for(const paint of PAINTS){
    const chip=document.createElement('button');
    chip.className='paint-chip';chip.title=paint.name;
    chip.dataset.paint=String(paint.value);
    chip.setAttribute('aria-label','Apply '+paint.name);
    chip.style.background='#'+paint.value.toString(16).padStart(6,'0');
    chip.addEventListener('click',()=>{
      currentColor=paint.value;
      if(vehicle)scene.remove(vehicle);
      vehicle=buildCar(baseCar,currentColor);scene.add(vehicle);
      document.querySelectorAll('.paint-chip').forEach(el=>el.classList.toggle('selected',Number(el.dataset.paint)===currentColor));
      showToast(paint.name+' paint applied');
    });
    $('paints').append(chip);
  }
}
function showTab(name){
  activeTab=name;
  for(const control of Object.keys(controls)) controls[control]=false;
  document.querySelectorAll('[data-pane]').forEach(el=>el.classList.toggle('hidden',el.dataset.pane!==name));
  document.querySelectorAll('[data-tab]').forEach(el=>el.classList.toggle('active',el.dataset.tab===name));
  if(name==='challenges')renderChallenges();
}
function renderChallenges(){
  $('challengeList').innerHTML='';
  const value=Math.max(bestScore,Math.floor(state.score));
  for(const challenge of CHALLENGES){
    const percent=Math.min(100,100*value/challenge.target);
    const item=document.createElement('div');
    item.className='challenge'+(percent===100?' done':'');
    item.innerHTML='<h3>'+challenge.title+'</h3><p>'+challenge.description+'</p><div class="progress"><b style="width:'+percent+'%"></b></div><div class="value">'+Math.min(value,challenge.target).toLocaleString()+' / '+challenge.target.toLocaleString()+' POINTS'+(percent===100?' · COMPLETED':'')+'</div>';
    $('challengeList').append(item);
  }
}
function setDriveMode(mode,{announce=true}={}){
  driveMode=mode==='grip'?'grip':'drift';
  $('driftMode').classList.toggle('selected',driveMode==='drift');
  $('gripMode').classList.toggle('selected',driveMode==='grip');
  $('modeName').textContent=driveMode==='grip'?'GRIP':'DRIFT';
  $('sideMode').textContent=driveMode==='grip'?'HIGH GRIP / RACE':'DRIFT / TANDEM';
  lapState=newLapState();
  if(announce)showToast(driveMode==='grip'?'HIGH GRIP MODE / CIRCUIT SETUP':'DRIFT MODE / TANDEM SETUP');
}
function setActiveTrack(id,{announce=true,reset=true}={}){
  activeTrack=findTrack(id);
  $('quickTrack').value=activeTrack.id;
  $('trackName').textContent=activeTrack.short;
  $('sideTrack').textContent=activeTrack.short;
  activeZone=activeTrack.name;
  $('location').textContent=activeZone;
  if(reset){
    const spawn=getTrackSpawn(activeTrack);
    state=resetAt(spawn.x,spawn.z,spawn.heading);
    lapState=newLapState();nearPasses=0;collisions=0;raceScore=0;
    circuitTraffic=createCircuitTraffic(11);
  }
  if(announce)showToast(activeTrack.name+' / '+activeTrack.difficulty);
}
function teleportDepartment(dept){
  state=resetAt(dept.x,dept.z+8,0);
  $('location').textContent=dept.name+' / PARK HERE';
  activeZone='SCHOOLYARD CAMPUS';
  showTab('drive');
  showToast('Park fully and press E to enter '+dept.short);
}
for(const track of TRACKS){
  const option=document.createElement('option');option.value=track.id;
  option.textContent=track.number+' / '+track.short;
  $('quickTrack').append(option);
  const btn=document.createElement('button');
  btn.className='zone track-zone';
  btn.style.setProperty('--track-color',track.theme);
  const text=document.createElement('span');
  const title=document.createElement('strong');title.textContent=track.name;
  const type=document.createElement('small');type.className='zone-type';
  type.textContent=(track.kind==='drift'?'DRIFT / WIDE CORNERS':'RACE / CIRCUIT')+' · '+track.difficulty;
  const desc=document.createElement('small');desc.textContent=track.description;
  text.append(title,type,desc);
  const go=document.createElement('span');go.textContent='GO ›';
  btn.append(text,go);
  btn.addEventListener('click',()=>{
    setDriveMode(track.kind==='race'?'grip':'drift',{announce:false});
    setActiveTrack(track.id);showTab('drive');
  });
  $('zones').append(btn);
}
for(const dept of DEPARTMENTS){
  const btn=document.createElement('button');btn.className='zone';
  const content=document.createElement('span'),title=document.createElement('strong'),subtitle=document.createElement('small');
  title.textContent=dept.name;subtitle.textContent=dept.category;
  content.append(title,subtitle);
  const go=document.createElement('span');go.textContent='PARK ›';
  btn.append(content,go);
  btn.addEventListener('click',()=>teleportDepartment(dept));
  $('departmentList').append(btn);
}
$('quickTrack').addEventListener('change',e=>{
  const track=findTrack(e.target.value);
  setDriveMode(track.kind==='race'?'grip':'drift',{announce:false});
  setActiveTrack(track.id);
});
$('driftMode').addEventListener('click',()=>setDriveMode('drift'));
$('gripMode').addEventListener('click',()=>setDriveMode('grip'));
$('worldButton').addEventListener('click',()=>showTab('world'));
$('expandMap').addEventListener('click',()=>showTab('world'));
$('departmentPrompt').addEventListener('click',openNearbyDepartment);
$('closeDepartment').addEventListener('click',closeDepartment);
function openNearbyDepartment(){
  const dept=nearbyDepartment(state,14);
  if(!dept||!canEnterDepartment(state,dept,14)){
    showToast('Stop and park closer to a department entrance');
    return;
  }
  currentDepartment=dept;departmentOpen=true;
  $('departmentCategory').textContent=dept.category.toUpperCase();
  $('departmentTitle').textContent=dept.name;
  $('departmentLead').textContent=dept.lead;
  $('departmentDetail').textContent=dept.detail;
  $('departmentModal').hidden=false;
  for(const key of Object.keys(controls))controls[key]=false;
}
function closeDepartment(){
  departmentOpen=false;currentDepartment=null;
  $('departmentModal').hidden=true;
}

for(const category of CATEGORIES){
  const option=document.createElement('option');option.value=category;option.textContent=category;
  $('category').append(option);
}
renderPaints();
$('category').addEventListener('change',selectCategory);
$('carSelect').addEventListener('change',e=>setCar(e.target.value));
$('gripTune').addEventListener('input',updateTuning);
$('handlingTune').addEventListener('input',updateTuning);
document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>showTab(btn.dataset.tab)));
$('driveSelected').addEventListener('click',()=>{state=resetAt();showTab('drive');showToast('Drive carefully. Find your line.');});
$('resetButton').addEventListener('click',()=>{state=resetAt(state.x,state.z,state.heading);showToast('Vehicle reset');});
$('cameraButton').addEventListener('click',()=>{cameraMode=(cameraMode+1)%3;showToast(['CHASE CAM','OVERHEAD CAM','LOW FOLLOW CAM'][cameraMode]);});
$('clearScores').addEventListener('click',()=>{bestScore=0;state=resetAt(state.x,state.z,state.heading);try{localStorage.removeItem('rev-drift-best')}catch{}renderChallenges();showToast('Practice score history cleared');});
function setKey(code,down){
  const lookup={KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',KeyW:'throttle',ArrowUp:'throttle',KeyS:'brake',ArrowDown:'brake',Space:'handbrake'};
  if(lookup[code]){controls[lookup[code]]=down;return true;}
  return false;
}
window.addEventListener('keydown',e=>{
  const typing=['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName);
  if(typing)return;
  if(setKey(e.code,true))e.preventDefault();
  if(e.repeat)return;
  if(e.code==='KeyR')state=resetAt(state.x,state.z,state.heading);
  if(e.code==='KeyC')cameraMode=(cameraMode+1)%3;
});
window.addEventListener('keyup',e=>{if(setKey(e.code,false))e.preventDefault();});
window.addEventListener('blur',()=>Object.keys(controls).forEach(k=>controls[k]=false));
document.querySelectorAll('[data-control]').forEach(btn=>{
  const control=btn.dataset.control;
  btn.addEventListener('pointerdown',e=>{e.preventDefault();controls[control]=true;btn.classList.add('pressed');btn.setPointerCapture(e.pointerId);});
  for(const eventName of ['pointerup','pointercancel','lostpointercapture']){
    btn.addEventListener(eventName,()=>{controls[control]=false;btn.classList.remove('pressed');});
  }
});
setCar('nova');$('carSelect').value='nova';
$('category').value='All';

// First-party entry screen for a future Schoolhouse / Garage button.
// The portfolio Schoolhouse does not call or receive financial services here.
// A direct URL like ?mode=drift may be linked by a separate approved host.
const portal=$('portal'),app=$('app'),portalStage=$('portalCarStage');
const viewport=document.querySelector('.viewport');
portalStage.append(canvas);
portalStage.querySelector('.portal-stage-placeholder')?.remove();

function launchMode(tab='drive') {
  portal.hidden=true;
  app.classList.remove('app-inactive');
  if(canvas.parentElement!==viewport) viewport.insertBefore(canvas,viewport.firstChild);
  gameActive=true;
  for(const key of Object.keys(controls)) controls[key]=false;
  showTab(tab);
  history.replaceState(null,'',location.pathname+'#/'+tab);
  resize();
  showToast(tab==='drive'?'WELCOME TO REV DRIFT ACADEMY':'YOUR GARAGE IS READY');
}
function returnToGarage() {
  gameActive=false;
  for(const key of Object.keys(controls)) controls[key]=false;
  state=resetAt();
  portal.hidden=false;
  app.classList.add('app-inactive');
  portalStage.append(canvas);
  history.replaceState(null,'',location.pathname+'#/home');
  try{localStorage.setItem('rev-drift-best',String(bestScore));}catch{}
  resize();
}
$('portalStart').addEventListener('click',()=>launchMode('drive'));
$('portalGarage').addEventListener('click',()=>launchMode('garage'));
$('portalWorld').addEventListener('click',()=>launchMode('world'));
$('exitToPortal').addEventListener('click',returnToGarage);
function openRequestedMode() {
  const q=new URLSearchParams(location.search);
  const hash=location.hash.replace(/^#\/?/,'').toLowerCase();
  const selected=(q.get('mode')||hash).toLowerCase();
  const known=['drift','drive','garage','world','challenges'];
  if(known.includes(selected)) launchMode(selected==='drift'?'drive':selected);
}

function createSmokePool(){
  const material=new THREE.MeshBasicMaterial({color:0xd2d0c5,transparent:true,opacity:.22,depthWrite:false});
  const pool=[];
  for(let i=0;i<35;i++){
    const cloud=new THREE.Mesh(new THREE.SphereGeometry(.55,7,5),material.clone());
    cloud.visible=false;scene.add(cloud);pool.push({cloud,life:0,velocity:0});
  }
  return pool;
}
const smokePool=createSmokePool();
function spawnSmoke(){
  const next=smokePool.find(p=>p.life<=0);if(!next)return;
  const side=Math.random()>.5?1:-1;
  next.cloud.position.set(state.x+Math.cos(state.heading)*side*.85,.3,state.z-Math.sin(state.heading)*side*.85+1.4);
  next.cloud.scale.setScalar(.6);next.life=1.7;next.velocity=.6+Math.random()*.4;
  next.cloud.material.opacity=.22;next.cloud.visible=true;
}
function animateSmoke(dt){
  for(const p of smokePool){
    if(p.life<=0)continue;
    p.life-=dt;p.cloud.position.y+=dt*p.velocity;
    p.cloud.scale.multiplyScalar(1+dt*.95);
    p.cloud.material.opacity=Math.max(0,Math.min(.22,p.life*.14));
    if(p.life<=0)p.cloud.visible=false;
  }
}
function setCamera(dt){
  const yaw=state.heading;
  const target=new THREE.Vector3(state.x,1.5,state.z);
  let desired;
  if(cameraMode===1){desired=new THREE.Vector3(state.x,43,state.z+12);target.y=0;}
  else if(cameraMode===2){desired=new THREE.Vector3(state.x+Math.sin(yaw)*8,3.8,state.z+Math.cos(yaw)*8);}
  else{desired=new THREE.Vector3(state.x+Math.sin(yaw)*15,8.5,state.z+Math.cos(yaw)*15);}
  camera.position.lerp(desired,Math.min(1,dt*5.5));
  camera.lookAt(target);
}
function hud(){
  $('speed').textContent=Math.floor(state.speedKmh).toString().padStart(3,'0');
  $('score').textContent=Math.floor(state.score).toString().padStart(6,'0');
  $('angle').textContent=Math.floor(state.slipAngle);
  $('combo').textContent=state.drifting?'DRIFTING  ×'+state.combo+' COMBO':'FIND YOUR LINE';
}
function saveBest(now){
  if(state.score>bestScore){bestScore=Math.floor(state.score);}
  if(now-lastSaved>3500){lastSaved=now;try{localStorage.setItem('rev-drift-best',String(bestScore))}catch{}}
}
function frame(now=0){
  requestAnimationFrame(frame);
  const dt=Math.min(clock.getDelta(),.05);
  const command={
    steer:Number(controls.right)-Number(controls.left),
    throttle:Number(controls.throttle),
    brake:Number(controls.brake),
    handbrake:controls.handbrake,
  };
  state=stepCar(state,command,tunedCar,dt);
  if(Math.abs(state.x)>117||Math.abs(state.z)>117){
    state=resetAt();showToast('Back inside the practice boundary');
  }
  vehicle.position.set(state.x,.1,state.z);
  vehicle.rotation.y=state.heading;
  if(state.drifting && now-lastSmoke>65){lastSmoke=now;spawnSmoke();}
  animateSmoke(dt);
  setCamera(dt);
  hud();
  saveBest(now);
  renderer.render(scene,camera);
}
function frame(now=0){
  requestAnimationFrame(frame);
  const dt=Math.min(clock.getDelta(),.05);
  if(gameActive){
    if(activeTab==='drive'){
      const command={
        steer:Number(controls.right)-Number(controls.left),
        throttle:Number(controls.throttle),
        brake:Number(controls.brake),
        handbrake:controls.handbrake,
      };
      state=stepCar(state,command,tunedCar,dt);
      if(Math.abs(state.x)>117||Math.abs(state.z)>117){
        state=resetAt();showToast('Back inside the practice boundary');
      }
      if(state.drifting && now-lastSmoke>65){lastSmoke=now;spawnSmoke();}
    }
    vehicle.position.set(state.x,.1,state.z);
    vehicle.rotation.y=state.heading;
    animateSmoke(dt);
    setCamera(dt);
    hud();
    saveBest(now);
  }else{
    // The exact same 3D car is rendered as a cinematic menu preview.
    // Steering / scoring only operate AFTER Parker presses Enter Drift Mode.
    portalOrbit+=dt*.19;
    vehicle.position.set(0,.11,0);
    vehicle.rotation.y=portalOrbit;
    camera.position.lerp(new THREE.Vector3(8.6+Math.sin(portalOrbit*.32)*2,4.9,10.8),Math.min(1,dt*3.2));
    camera.lookAt(new THREE.Vector3(0,1.05,0));
    animateSmoke(dt);
  }
  renderer.render(scene,camera);
}
const observer=new ResizeObserver(resize);
observer.observe(viewport);
observer.observe(portalStage);
resize();
camera.position.set(8,5,11);
openRequestedMode();
requestAnimationFrame(frame);
