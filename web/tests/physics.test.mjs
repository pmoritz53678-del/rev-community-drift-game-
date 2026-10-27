import test from 'node:test';
import assert from 'node:assert/strict';
import {CARS,findCar} from '../src/roster.js';
import {newCarState,stepCar,resetAt} from '../src/physics.js';
const car=findCar('nova');
test('roster has 15 unique, entirely fictional playable profiles',()=>{
  assert.equal(CARS.length,15);
  assert.equal(new Set(CARS.map(c=>c.id)).size,15);
  for(const c of CARS){ assert.ok(c.power>0); assert.ok(c.weight>0); assert.ok(c.brand); }
});
test('zero input keeps a new car parked',()=>{
  let s=newCarState();
  for(let i=0;i<40;i++) s=stepCar(s,{},car,1/60);
  assert.equal(s.x,0); assert.equal(s.z,0); assert.equal(s.speedKmh,0);
});
test('throttle advances the car in forward direction',()=>{
  let s=newCarState();
  for(let i=0;i<180;i++) s=stepCar(s,{throttle:1},car,1/60);
  assert.ok(s.speedKmh>25);
  assert.ok(s.z<0);
});
test('time steps are capped to prevent explosive jumps',()=>{
  const a=stepCar(newCarState(),{throttle:1},car,1);
  const b=stepCar(newCarState(),{throttle:1},car,0.05);
  assert.deepEqual(a,b);
});
test('handbrake + steering generates slip and drift scoring',()=>{
  let s=newCarState();
  for(let i=0;i<320;i++) s=stepCar(s,{throttle:1},car,1/60);
  for(let i=0;i<260;i++) s=stepCar(s,{throttle:1,steer:1,handbrake:true},car,1/60);
  assert.ok(s.slipAngle>10,'drift angle must exceed 10 degrees');
  assert.ok(s.score>0,'drift must score');
});
test('reset gives fresh separate score',()=>{
  const s=resetAt(7,9);
  assert.equal(s.x,7);assert.equal(s.z,9);assert.equal(s.score,0);
});
