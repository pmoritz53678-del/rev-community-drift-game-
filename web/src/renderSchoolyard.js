import * as THREE from 'three';
import {TRACKS, sampleTrack, pointOnTrack, getTrackSpawn} from './tracks.js';
import {DEPARTMENTS} from './world.js';

/**
 * Original five-track world blockout. These are procedurally drawn 3D roads, not
 * copies of another game's map or licensed cars. All units are fictional meters.
 * Meshes and decals are placeholders for eventual authored Unreal assets.
 */
const mat=(color,roughness=.92)=>new THREE.MeshStandardMaterial({color,roughness,side:THREE.DoubleSide});
const road=mat(0x30393d),asphalt=mat(0x39484c),gravel=mat(0x6b6b60);
const grass=mat(0x3d5148),stripe=mat(0xe9dcc4),amber=mat(0xdca75d),fence=mat(0x85918d);
const pine=mat(0x2c5047),trunk=mat(0x51483b);
const buildingWall=mat(0x647e79),glass=mat(0x203a42,.3);

function box(scene,w,h,d,material,x,y,z,angle=0){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
  mesh.position.set(x,y,z);mesh.rotation.y=angle;scene.add(mesh);
  return mesh;
}
function ribbon(scene, points, width, y, material, closed=true) {
  if(points.length<2) return;
  const positions=[],indices=[];
  for(let i=0;i<points.length;i++){
    const p=points[i],prior=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length];
    const tx=next.x-prior.x,tz=next.z-prior.z,len=Math.hypot(tx,tz)||1;
    const nx=-tz/len,nz=tx/len;
    positions.push(p.x+nx*width/2,y,p.z+nz*width/2,p.x-nx*width/2,y,p.z-nz*width/2);
  }
  const count=closed?points.length:points.length-1;
  for(let i=0;i<count;i++){
    const j=(i+1)%points.length,a=i*2,b=j*2;
    indices.push(a,b,a+1,a+1,b,b+1);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setIndex(indices);geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,material);
  mesh.frustumCulled=false;scene.add(mesh);
  return mesh;
}
function lineBetween(scene,a,b,width,material,y=0.005){
  const dx=b.x-a.x,dz=b.z-a.z;
  const length=Math.hypot(dx,dz);
  return box(scene,width,.05,length,material,(a.x+b.x)/2,y,(a.z+b.z)/2,Math.atan2(dx,dz));
}
function signTexture(text,color='#dfae68'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=192;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#11252a';ctx.fillRect(0,0,1024,192);
  ctx.fillStyle=color;ctx.fillRect(0,0,1024,7);
  ctx.fillStyle='#f3f4ea';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='bold 55px Arial';ctx.fillText(text,512,103,975);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function sign(scene,text,x,y,z,w=19,h=3,color='#d6a45c'){
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:signTexture(text,color),side:THREE.DoubleSide}));
  mesh.position.set(x,y,z);scene.add(mesh);return mesh;
}
function cone(scene,x,z,color=0xe9a25b){
  const mesh=new THREE.Mesh(new THREE.ConeGeometry(.5,1.4,7),mat(color));
  mesh.position.set(x,.69,z);scene.add(mesh);
}
function createOneTrack(scene,track){
  const samples=sampleTrack(track,220);
  ribbon(scene,samples,track.width+14,-.016,gravel);
  ribbon(scene,samples,track.width,.006,road);
  const left=[],right=[],center=[];
  for(let i=0;i<samples.length;i++){
    const p=samples[i],pr=samples[(i+samples.length-1)%samples.length],nx=samples[(i+1)%samples.length];
    const dx=nx.x-pr.x,dz=nx.z-pr.z,len=Math.hypot(dx,dz)||1;
    const rx=-dz/len,rz=dx/len;
    left.push({x:p.x+rx*track.width*.48,z:p.z+rz*track.width*.48});
    right.push({x:p.x-rx*track.width*.48,z:p.z-rz*track.width*.48});
    center.push(p);
  }
  ribbon(scene,left,.42,.03,stripe);
  ribbon(scene,right,.42,.03,stripe);
  // Center dashes intentionally sparse for a proper circuit surface.
  for(let i=0;i<samples.length;i+=14){
    const a=samples[i],b=samples[(i+4)%samples.length];
    lineBetween(scene,a,b,.17,mat(0x9da5a0),.028);
  }
  const start=getTrackSpawn(track);
  const tA=pointOnTrack(track,.006),tB=pointOnTrack(track,.016);
  lineBetween(scene,tA,tB,track.width*.93,stripe,.044);
  const signPos=pointOnTrack(track,.08);
  sign(scene,track.name,signPos.x,5.5,signPos.z,19,3,track.theme);
  for(const phase of track.clipping){
    const p=pointOnTrack(track,phase);
    cone(scene,p.x,p.z,0xf0a957);
  }
  return samples;
}
function addDepartment(scene,dept,index){
  const palette=[0x455f60,0x526d70,0x676a62,0x7c765d,0x52705e,0x716453,0x56736b,0x5f6b66];
  const wall=mat(palette[index%palette.length]);
  // Public doorway is placed at department point; building behind its door.
  box(scene,18,11,18,wall,dept.x,5.5,dept.z-10);
  box(scene,20,.6,20,mat(0x263f3e),dept.x,11.3,dept.z-10);
  box(scene,6,6,.35,glass,dept.x,3.2,dept.z-.81);
  box(scene,6,.45,1.5,amber,dept.x,.14,dept.z+.3);
  sign(scene,dept.short,dept.x,10.1,dept.z-.73,15,2.9,dept.theme);
  // Colored parking pad outside entrance; park within 12 m and press E.
  box(scene,13,.04,13,asphalt,dept.x,-.004,dept.z+6);
  box(scene,.15,.05,9,stripe,dept.x-4.8,.02,dept.z+6);
  box(scene,.15,.05,9,stripe,dept.x+4.8,.02,dept.z+6);
}
function trees(scene){
  const branchCount=90;
  for(let i=0;i<branchCount;i++){
    const a=i*2.399963,r=190+(i%6)*63;
    const x=Math.cos(a)*r,z=Math.sin(a)*r*1.35;
    if(x>110 && x<460 && z>-430 && z<720)continue;
    if(x<-100 && z<430 && z>-470 && x>-460)continue;
    const radius=2+(i%3)*.6;
    box(scene,.85,5,.85,trunk,x,2.5,z);
    const tree=new THREE.Mesh(new THREE.ConeGeometry(radius+1,12+(i%4)*2,7),pine);
    tree.position.set(x,11,z);scene.add(tree);
  }
}
export function buildSchoolyardWorld(scene){
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(1240,1660),grass);
  ground.rotation.x=-Math.PI/2;ground.position.y=-.13;scene.add(ground);
  // Central park-and-enter campus, self-contained and non-racing.
  box(scene,325,.1,310,asphalt,-17,-.06,-35);
  for(let x=-157;x<148;x+=25){
    box(scene,.13,.03,26,stripe,x,.01,92);
    box(scene,.13,.03,26,stripe,x,.01,-2);
  }
  box(scene,55,.04,44,mat(0x63746c),46,-.015,-97);
  sign(scene,'SCHOOLYARD MOTORSPORTS',28,11,-81,46,5);
  sign(scene,'PARK UP / EXPLORE THE DEPARTMENTS',-52,6,-93,44,3);
  const grounds=TRACKS.map(t=>({id:t.id,samples:createOneTrack(scene,t)}));
  // Campus connectors mean each circuit can be reached by driving.
  const connectors=[
    [{x:-110,z:-100},{x:-173,z:-208}],
    [{x:120,z:-95},{x:166,z:-226}],
    [{x:-148,z:60},{x:-205,z:159}],
    [{x:128,z:60},{x:162,z:122}],
    [{x:25,z:113},{x:25,z:432}]
  ];
  for(const [a,b] of connectors)lineBetween(scene,a,b,15,asphalt,-.015);
  // Departments and walk-up studios in the center.
  DEPARTMENTS.forEach((d,i)=>addDepartment(scene,d,i));
  // Community meet area is social only, with separate parking markings.
  box(scene,72,.1,40,asphalt,-46,-.015,69);
  sign(scene,'REV COMMUNITY / CAR MEET / PARK ONLY',-40,7,96,54,4);
  for(let j=0;j<7;j++){
    const x=-77+j*11;
    box(scene,.18,.04,24,stripe,x,.035,67);
  }
  // Garage, pit lane and entrance sign.
  box(scene,32,12,21,mat(0x234844),52,6,-42);
  box(scene,34,.7,23,mat(0x1c3535),52,12.5,-42);
  for(let i=0;i<3;i++) box(scene,9,7,.15,glass,40+i*12,4,-31.3);
  sign(scene,'REV COMMUNITY GARAGE',52,10.8,-31.1,28,3);
  trees(scene);
  return {tracks:grounds};
}
