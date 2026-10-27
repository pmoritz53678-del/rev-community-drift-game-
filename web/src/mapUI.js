import {TRACKS,sampleTrack} from './tracks.js';
import {DEPARTMENTS} from './world.js';

// In-world map, NOT real-world GPS. Position is derived directly from physics state.
// The same function renders the corner minimap and full circuit overview.
export const WORLD_VIEW={centerX:-5,centerZ:112,widthMeters:1070,heightMeters:1370};
const cache=new Map();
function cachedSamples(track) {
  if(!cache.has(track.id))cache.set(track.id,sampleTrack(track,150));
  return cache.get(track.id);
}
export function mapProjection(x,z,width,height,{local=false,focusX=0,focusZ=0}={}){
  const extentX=local?340:WORLD_VIEW.widthMeters;
  const extentZ=local?280:WORLD_VIEW.heightMeters;
  const scale=Math.min(width/extentX,height/extentZ);
  const anchorX=local?focusX:WORLD_VIEW.centerX;
  const anchorZ=local?focusZ:WORLD_VIEW.centerZ;
  return {x:width*.5+(x-anchorX)*scale,y:height*.5+(z-anchorZ)*scale,scale};
}
export function drawSchoolMap(canvas,state,selectedTrackId,{local=false}={}){
  const ctx=canvas?.getContext?.('2d');if(!ctx)return;
  const w=canvas.width,h=canvas.height;
  ctx.fillStyle='#102426';ctx.fillRect(0,0,w,h);
  const options={local,focusX:state?.x||0,focusZ:state?.z||0};
  const project=(x,z)=>mapProjection(x,z,w,h,options);
  // Quiet schematic grid: no guessed physical distance or GPS.
  const center=project(0,0);
  ctx.strokeStyle='#4c67623a';ctx.lineWidth=1;
  const spacing=local?50:100;
  const minX=local?(state.x-250):-550,maxX=local?(state.x+250):550;
  const minZ=local?(state.z-225):-520,maxZ=local?(state.z+225):775;
  for(let x=Math.ceil(minX/spacing)*spacing;x<maxX;x+=spacing){
    const a=project(x,minZ),b=project(x,maxZ);
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }
  for(let z=Math.ceil(minZ/spacing)*spacing;z<maxZ;z+=spacing){
    const a=project(minX,z),b=project(maxX,z);
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }
  // Track outer line, track center, selected track overlay.
  for(const t of TRACKS){
    const points=cachedSamples(t),chosen=t.id===selectedTrackId;
    const first=project(points[0].x,points[0].z);
    ctx.beginPath();ctx.moveTo(first.x,first.y);
    for(let i=1;i<points.length;i++){const p=project(points[i].x,points[i].z);ctx.lineTo(p.x,p.y);}
    ctx.closePath();
    ctx.strokeStyle=chosen?'#ffe2a7':'#45645f';
    ctx.lineWidth=chosen? Math.max(3,local?10:6):Math.max(2,local?7:4);
    ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
    ctx.strokeStyle=t.theme;ctx.lineWidth=chosen?2.5:1.6;ctx.stroke();
    if(!local){
      const p=project(points[9].x,points[9].z);
      ctx.fillStyle=chosen?'#ffe1a5':'#b4c6bd';ctx.font='bold 11px Arial';
      ctx.fillText(t.number+' '+t.short,p.x+9,p.y-8);
    }
  }
  // The school itself is one readable place, not an unrelated city.
  const a=project(-140,-174),b=project(112,110);
  ctx.fillStyle='#54746c65';
  ctx.fillRect(a.x,a.y,b.x-a.x,b.y-a.y);
  ctx.strokeStyle='#e4c080';ctx.lineWidth=1;
  ctx.strokeRect(a.x,a.y,b.x-a.x,b.y-a.y);
  for(const d of DEPARTMENTS){
    const p=project(d.x,d.z);
    ctx.fillStyle='#deb779';ctx.fillRect(p.x-2,p.y-2,4,4);
    if(!local){ctx.font='9px Arial';ctx.fillStyle='#c4d0c4';ctx.fillText(d.short,p.x+4,p.y+2);}
  }
  if(!local){ctx.font='bold 12px Arial';ctx.fillStyle='#f0dec1';ctx.fillText('SCHOOLYARD CAMPUS',project(-137,-181).x,project(-137,-181).y-8);}
  if(state){
    const p=project(state.x,state.z);
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-state.heading);
    ctx.fillStyle='#f7f5e5';ctx.strokeStyle='#1b282a';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(-7,7);ctx.lineTo(0,3);ctx.lineTo(7,7);ctx.closePath();
    ctx.fill();ctx.stroke();ctx.restore();
  }
  ctx.fillStyle='#d9bb89';ctx.font='bold 10px Arial';
  ctx.fillText(local?'LOCAL / LIVE':'CAMPUS / ALL FIVE TRACKS',8,h-10);
}
