// Independent, deterministic arcade drift prototype. 1 world unit = 1 meter.
// NOT a replacement for Unreal Chaos vehicle/wheel physics.
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export function newCarState() {
  return {x:0,z:0,heading:0,forward:0,lateral:0,speedKmh:0,slipAngle:0,
    score:0,combo:1,driftSeconds:0,drifting:false,totalDistance:0};
}
export function stepCar(previous, input, car, deltaSeconds, mode='drift', scoringEnabled=true) {
  const dt = clamp(Number.isFinite(deltaSeconds) ? deltaSeconds : 0,0,0.05);
  const s = {...previous};
  const steer=clamp(input.steer || 0,-1,1);
  const throttle=clamp(input.throttle || 0,0,1);
  const brake=clamp(input.brake || 0,0,1);
  const handbrake=Boolean(input.handbrake);
  const powerRatio=car.power/350;
  const gripMode=mode==='grip';
  const maxSpeed=gripMode ? clamp(41+powerRatio*24,50,105) : clamp(29+powerRatio*17,37,87);
  const accel=clamp((gripMode?9.0:7.4)*powerRatio*(1450/car.weight),4.6,22.0);
  const rolling=(0.6 + Math.abs(s.forward)*0.014);
  const brakeForce=brake*18;
  const fwdSign=s.forward>=0?1:-1;
  s.forward += (throttle*accel - fwdSign*(rolling+brakeForce))*dt;
  if(!throttle && !brake && Math.abs(s.forward)<0.25) s.forward=0;
  s.forward=clamp(s.forward,-6,maxSpeed);
  const steerPower=(gripMode?0.63:1.32)*(0.7+car.handling/180);
  const speedFactor=clamp(Math.abs(s.forward)/11,0,1);
  const driftIntent=!gripMode && (handbrake || (throttle>0.25 && Math.abs(steer)>0.45 && s.forward>10));
  const lateralGrip=gripMode ? 11.5+(car.grip/15) : handbrake ? 0.42 : driftIntent ? 1.38 : (3.5+car.grip/34);
  const kick=gripMode ? 0.065 : driftIntent ? 0.27+car.drift/300 : 0.14;
  s.lateral += (steer*s.forward*kick - s.lateral*lateralGrip)*dt;
  s.lateral=clamp(s.lateral,-18,18);
  s.heading += steer*steerPower*speedFactor*dt*(s.forward<0?-1:1);
  const forwardX=-Math.sin(s.heading),forwardZ=-Math.cos(s.heading);
  const rightX=Math.cos(s.heading),rightZ=-Math.sin(s.heading);
  const dx=(forwardX*s.forward+rightX*s.lateral)*dt;
  const dz=(forwardZ*s.forward+rightZ*s.lateral)*dt;
  s.x+=dx; s.z+=dz;
  s.totalDistance+=Math.hypot(dx,dz);
  s.speedKmh=Math.hypot(s.forward,s.lateral)*3.6;
  s.slipAngle=Math.atan2(Math.abs(s.lateral),Math.max(0.1,Math.abs(s.forward)))*180/Math.PI;
  s.drifting=!gripMode && scoringEnabled && s.speedKmh>22 && s.slipAngle>=10 && s.slipAngle<72 && (handbrake || throttle>0.13);
  if (s.drifting) {
    s.driftSeconds+=dt;
    s.combo=1+Math.min(4,Math.floor(s.driftSeconds/2.3));
    s.score+=Math.round((s.speedKmh*0.12+s.slipAngle*0.32)*s.combo*dt*12);
  } else {
    s.driftSeconds=Math.max(0,s.driftSeconds-dt*2.5);
    if(s.driftSeconds===0) s.combo=1;
  }
  return s;
}
export function resetAt(x=0,z=0,heading=0) {
  return {...newCarState(),x,z,heading};
}
