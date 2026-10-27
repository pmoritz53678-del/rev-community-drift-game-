import * as THREE from 'three';
import {normalizeBuild} from './kits.js';

/**
 * Hand-authored original low-poly tuner prototypes (not any automaker's bodywork).
 * No licensed model source or third-party geometry. Replace with vetted FBX/GLB later.
 */
const MAT=(color,metalness=.3,roughness=.5)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const black=MAT(0x172024,.25,.38),tireMat=MAT(0x101316,0,.92);
const caliperMat=MAT(0xd13d35,.4,.34),glassMat=MAT(0x314e5b,.4,.22);
const lightMat=new THREE.MeshBasicMaterial({color:0xe9f3e8});
const tailMat=new THREE.MeshBasicMaterial({color:0xd34742});
function box(group,w,h,d,mat,x,y,z,rotY=0){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
  mesh.position.set(x,y,z);mesh.rotation.y=rotY;group.add(mesh);return mesh;
}
function wedge(group,width,height,length,material,x,y,z,taper=.72){
  const geometry=new THREE.BufferGeometry();
  const w=width/2,h=height/2,l=length/2;
  const verts=[
    -w,-h,-l, w,-h,-l, w,h,-l,-w,h,-l,
    -w*taper,-h,l, w*taper,-h,l, w*taper,h*.65,l,-w*taper,h*.65,l,
  ];
  const face=[0,1,2,0,2,3,1,5,6,1,6,2,5,4,7,5,7,6,4,0,3,4,3,7,3,2,6,3,6,7,4,5,1,4,1,0];
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  geometry.setIndex(face);geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);group.add(mesh);
  return mesh;
}
function wheel(group,x,y,z,style,wide){
  const g=new THREE.Group();g.position.set(x,y,z);group.add(g);
  const width=wide?.38:.29;
  const tire=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,width,20),tireMat);
  tire.rotation.z=Math.PI/2;g.add(tire);
  const rimColor=MAT(style==='deep'?0xc8bdb0:style==='track'?0xabb9b8:0x879697,.86,.27);
  const dish=style==='deep'?.11:.04;
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,width+dish,20),rimColor);
  cap.rotation.z=Math.PI/2;g.add(cap);
  const spokes=style==='five'?5:style==='mesh'?14:style==='deep'?6:8;
  const spokeMat=MAT(style==='deep'?0xd7bc91:0x929d9f,.7,.23);
  for(let i=0;i<spokes;i++){
    const a=i*2*Math.PI/spokes;
    // spokes lie on outer wheel face (wheel axle aligned X)
    const spoke=box(g,.035,.24,style==='mesh'?.035:.07,spokeMat,
      (x>0?1:-1)*(width*.56+dish*.5),Math.sin(a)*.13,Math.cos(a)*.13);
    spoke.rotation.x=a;
  }
  // Red caliper remains visually distinct through all wheel styles.
  box(g,.055,.29,.15,caliperMat,x>0?-.18:.18,.08,-.17);
}
function fender(group,side,z,w,paint,wide){
  const flare=new THREE.Mesh(new THREE.SphereGeometry(1,14,8),paint);
  flare.scale.set(.15+(wide?.21:.04),.29,.52+(wide?.09:0));
  flare.position.set(side*(w/2+.025),.75,z);
  group.add(flare);
}
function aero(group,w,l,build,paint,carbon){
  const wide=build.bodyKit==='wide',street=build.bodyKit==='street';
  if(!wide&&!street)return;
  const width=wide?w+0.36:w+0.12;
  box(group,width,.08,.43,carbon,0,.47,-l*.49);
  for(const side of [-1,1]){
    box(group,.19,.12,l*.64,carbon,side*(w/2+.03),.45,.07);
    if(wide){
      box(group,.08,.32,l*.37,paint,side*(w/2+.19),.78,.01);
      box(group,.28,.10,.43,carbon,side*(w/2+.14),.49,-l*.40);
    }
  }
  box(group,width,.11,.31,carbon,0,.49,l*.50);
}
function spoiler(group,width,len,wing,carbon){
  if(wing==='none')return;
  if(wing==='duck'){
    box(group,width*.75,.09,.32,carbon,0,1.06,len*.49);
    return;
  }
  for(const side of [-1,1]){
    box(group,.07,.48,.08,carbon,side*width*.30,1.22,len*.42);
  }
  box(group,width*.92,.11,.35,carbon,0,1.47,len*.43);
  for(const side of [-1,1])box(group,.06,.18,.42,carbon,side*width*.45,1.49,len*.43);
}
export function buildCar(car,color=car.color,customization={}){
  const build=normalizeBuild(customization),wide=build.bodyKit==='wide';
  const g=new THREE.Group();g.name='REV-original-'+car.id;
  const isHyper=car.shape==='hyper',isExotic=isHyper||car.shape==='exotic';
  const isWagon=car.shape==='wagon';
  const isJDM=car.category==='JDM';
  const length=isWagon?5.05:isHyper?4.6:isExotic?4.58:isJDM?4.42:4.52;
  const width=isExotic?2.04:1.95;
  const cabLength=isWagon?length*.54:isExotic?length*.34:length*.42;
  const cabZ=isWagon?.22:isExotic?.22:.10;
  const paint=MAT(color,.71,.27);
  const lower=MAT(0x18252a,.25,.47);
  // Original compact tuner shell, stepped rear fenders, distinct fictional lighting.
  box(g,width,.39,length,paint,0,.74,0);
  wedge(g,width*.92,.17,length*.43,paint,0,1.01,-length*.265,.79);
  box(g,width*.77,isExotic?.31:.40,cabLength,glassMat,0,1.2,cabZ);
  box(g,width*.78,.09,cabLength*.78,paint,0,isExotic?1.38:1.45,cabZ+.05);
  box(g,width*.92,.12,.16,lower,0,.56,-length*.52);
  box(g,width*.94,.13,.16,lower,0,.57,length*.52);
  // Recognizable imaginary design signature: offset double-square light clusters.
  for(const side of [-1,1]){
    for(const offset of [-.12,.12]){
      box(g,.17,.10,.065,lightMat,side*width*.33+offset,.91,-length*.505);
    }
    box(g,.46,.095,.06,tailMat,side*width*.33,.88,length*.505);
    fender(g,side,-length*.32,width,paint,wide);
    fender(g,side,length*.32,width,paint,wide);
    for(const z of [-length*.32,length*.32]){
      wheel(g,side*(width/2+(wide?.24:.07)),.43,z,build.wheels,wide);
    }
    // Simple side-mirror treatment.
    box(g,.23,.10,.17,lower,side*width*.54,1.11,-.45);
  }
  aero(g,width,length,build,paint,black);
  spoiler(g,width,length,build.wing,black);
  if(isExotic){
    for(const side of [-1,1])
      wedge(g,.12,.24,.47,lower,side*width*.36,.89,.39,.6);
  }
  if(isWagon){
    box(g,width*.72,.19,.08,lower,0,1.23,length*.47);
  }
  if(car.id==='ranger'){
    box(g,.055,.15,length*.68,MAT(0xe8914b),width*.50,.72,0);
  }
  g.userData.customization=build;
  return g;
}
