import {pointOnTrack,onTrack,getTrackSpawn} from './tracks.js';
import {newCarState,stepCar} from './physics.js';

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const wrap=(v)=>Math.atan2(Math.sin(v),Math.cos(v));
export const AI_ROLES=Object.freeze(['LEAD','CHASE']);
export function createAIDriver(track,role='LEAD',carId='nova'){
  const forward=role==='CHASE'?.970:.060;
  const p=pointOnTrack(track,forward),q=pointOnTrack(track,forward+.002);
  const heading=Math.atan2(-(q.x-p.x),-(q.z-p.z));
  return {
    id:role.toLowerCase(),role,carId,
    state:{...newCarState(),x:p.x,z:p.z,heading},
    lastAction:{throttle:0,brake:0,steer:0,handbrake:false},
    resetCount:0,seconds:0
  };
}
export function calculateAIDriverAction(bot,player,track,car){
  const current=onTrack(track,bot.state.x,bot.state.z);
  const playerProgress=onTrack(track,player.x,player.z);
  const speed=bot.state.speedKmh;
  const lookahead=.012+clamp(speed/4500,0,.027);
  // AI senses authored spline and, when the player is close enough, anticipates
  // a tandem line offset; it never reads hidden game/finance state.
  let progress=current.progress;
  if(bot.role==='CHASE' && playerProgress.inside){
    const distance=Math.hypot(player.x-bot.state.x,player.z-bot.state.z);
    if(distance<75){
      const playerGap=.015;
      const chaseProgress=((playerProgress.progress-playerGap+1)%1);
      const progressError=((chaseProgress-progress+1.5)%1)-.5;
      progress=(progress+clamp(progressError,-.018,.018)+1)%1;
    }
  }
  const target=pointOnTrack(track,progress+lookahead);
  const dx=target.x-bot.state.x,dz=target.z-bot.state.z;
  const targetHeading=Math.atan2(-dx,-dz);
  const headingError=wrap(targetHeading-bot.state.heading);
  let steer=clamp(headingError*1.55,-1,1);
  const a=pointOnTrack(track,progress+lookahead),
        b=pointOnTrack(track,progress+lookahead+.013),
        c=pointOnTrack(track,progress+lookahead+.026);
  const h1=Math.atan2(-(b.x-a.x),-(b.z-a.z));
  const h2=Math.atan2(-(c.x-b.x),-(c.z-b.z));
  const curve=wrap(h2-h1);
  const turn=Math.abs(curve);
  // Drift practice: add curvature feed-forward to create controllable rear slip.
  // Steering still reacts to the path error through the same car physics as the player.
  steer=clamp(headingError*2.4+Math.sign(curve)*.7,-1,1);
  const targetSpeed=clamp(63-turn*115+(bot.role==='CHASE'?5:0),35,79);
  const throttle=clamp((targetSpeed-speed)/21+.43,0,1);
  const brake=clamp((speed-targetSpeed-8)/19,0,1);
  const handbrake=turn>.005&&speed>30&&current.inside&&Math.abs(headingError)<1;
  return {steer,throttle,brake,handbrake,progress:current.progress,offTrack:!current.inside};
}
export function stepAIDriver(bot,player,track,car,dt){
  const action=calculateAIDriverAction(bot,player,track,car);
  const next={...bot,state:stepCar(bot.state,action,car,dt,'drift',true),
    lastAction:action,seconds:bot.seconds+dt};
  const position=onTrack(track,next.state.x,next.state.z);
  // Soft recovery prevents endlessly stranded AI after a controller mistake.
  // This is an experimental arcade training pilot, not a claim of realistic autonomy.
  if(!position.inside && position.distance>track.width*1.6){
    const p=pointOnTrack(track,position.progress),
          q=pointOnTrack(track,position.progress+.002);
    const heading=Math.atan2(-(q.x-p.x),-(q.z-p.z));
    next.state={...newCarState(),x:p.x,z:p.z,heading};
    next.resetCount+=1;
  }
  return next;
}
