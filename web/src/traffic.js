import {HIGHWAY} from './world.js';
// Scripted closed-course AI cars. This is not networked real traffic or real road mapping.
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
export function newTraffic(count=23) {
  const cars=[];
  for(let i=0;i<count;i++){
    const lane=(i*5+3)%HIGHWAY.lanes.length;
    cars.push({
      id:i,x:HIGHWAY.lanes[lane],
      z:HIGHWAY.minZ+((i*153+75)%800),
      previousZ:0,
      speed:14+(i*7%13),
      color:[0xd9dedb,0x5b7c8d,0x8c9f92,0xc4b49d,0x556068,0xc8664b][i%6],
      counted:false,cooldown:0
    });
  }
  return cars;
}
export function stepTraffic(traffic,dt){
  dt=clamp(Number.isFinite(dt)?dt:0,0,0.05);
  return traffic.map(c=>{
    const next={...c,previousZ:c.z,cooldown:Math.max(0,c.cooldown-dt)};
    next.z-=next.speed*dt;
    if(next.z<HIGHWAY.minZ){next.z+=HIGHWAY.maxZ-HIGHWAY.minZ;next.counted=false;}
    return next;
  });
}
// Separation scoring only within the fictional restricted highway mode.
// Collision scoring is one event rather than a penalty repeated on each frame.
export function scoreTraffic(previous,current,traffic,dt){
  let nearMisses=0,collisions=0,points=0,blocked=false;
  const updated=traffic.map(car=>{
    const next={...car};
    const dx=Math.abs(current.x-car.x);
    const dz=Math.abs(current.z-car.z);
    const prevRelative=previous.z-car.previousZ;
    const relative=current.z-car.z;
    // Car is close in both axes; one collision then cooldown.
    if(dx<2.6 && dz<4.8 && next.cooldown===0){
      collisions++;
      next.cooldown=2.4;
      next.counted=true;
      blocked=true;
      return next;
    }
    // Count pass only if player's car moves from behind to ahead and remains clear.
    if(prevRelative>0 && relative<=0 && dx>=2.6 && dx<6.5 && !next.counted &&
        current.speedKmh>65){
      nearMisses++;
      points+=Math.round(50+current.speedKmh*0.4);
      next.counted=true;
    }
    // Reset pass flag if player falls substantially behind the same car.
    if(relative>25) next.counted=false;
    return next;
  });
  return {traffic:updated,nearMisses,collisions,points,blocked};
}
