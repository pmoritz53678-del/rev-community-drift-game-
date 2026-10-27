import {pointOnTrack} from './tracks.js';
const frac=x=>((x%1)+1)%1;
// Artificial cars circle the fictional Outer Express closed-course.
// They are NOT live traffic, multiplayer users, or road observations.
export function createCircuitTraffic(count=11){
  return Array.from({length:count},(_,i)=>({
    id:i,progress:frac(.07+i/count),speed:19+(i*7)%14,
    lane:i%2===0?-4.3:4.3,
    color:[0xd7d9d3,0x9eaeba,0xc9b0a1,0x6a7a75,0x596b80][i%5],
    cooldown:0,passed:false
  }));
}
export function trafficPose(track,traffic){
  const t=traffic.progress;
  const p=pointOnTrack(track,t),a=pointOnTrack(track,t-.0015),b=pointOnTrack(track,t+.0015);
  const dx=b.x-a.x,dz=b.z-a.z,dist=Math.hypot(dx,dz)||1;
  const rightX=-dz/dist,rightZ=dx/dist;
  return {x:p.x+rightX*traffic.lane,z:p.z+rightZ*traffic.lane,
    heading:Math.atan2(-dx,-dz)};
}
export function advanceCircuitTraffic(list,dt,track,loopLength=1700){
  const step=Math.min(.05,Math.max(0,Number.isFinite(dt)?dt:0));
  return list.map(c=>{
    const next={...c};
    next.progress=frac(c.progress+c.speed*step/loopLength);
    next.cooldown=Math.max(0,c.cooldown-step);
    return next;
  });
}
export function evaluateCircuitTraffic(list,carState,track){
  let nearPasses=0,collisions=0,points=0;
  const next=list.map(c=>{
    const n={...c},p=trafficPose(track,c);
    const d=Math.hypot(carState.x-p.x,carState.z-p.z);
    if(d>25)n.passed=false;
    if(d<3.3&&n.cooldown===0){
      collisions++;n.cooldown=2.5;n.passed=true;
    } else if(d>=3.3&&d<8.5&&!n.passed&&carState.speedKmh>65){
      nearPasses++;points+=Math.round(75+carState.speedKmh*.55);
      n.passed=true;
    }
    return n;
  });
  return {traffic:next,nearPasses,collisions,points};
}
