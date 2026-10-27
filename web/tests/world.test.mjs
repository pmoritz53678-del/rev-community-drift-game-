import test from 'node:test';
import assert from 'node:assert/strict';
import {DEPARTMENTS,SPAWNS,WORLD_STOPS,parked,nearbyDepartment,canEnterDepartment,nearHighway} from '../src/world.js';
import {newTraffic,stepTraffic,scoreTraffic} from '../src/traffic.js';
test('department IDs and locations are unique',()=>{
  assert.ok(DEPARTMENTS.length>=6);
  assert.equal(new Set(DEPARTMENTS.map(x=>x.id)).size,DEPARTMENTS.length);
});
test('park before entering department',()=>{
  const dep=DEPARTMENTS[0],s={x:dep.x,z:dep.z,speedKmh:0};
  assert.equal(nearbyDepartment(s)?.id,dep.id);
  assert.equal(canEnterDepartment(s,dep),true);
  assert.equal(canEnterDepartment({...s,speedKmh:40},dep),false);
  assert.equal(canEnterDepartment({...s,x:dep.x+100},dep),false);
});
test('mode spawn points are separate',()=>{
  assert.ok(Math.abs(SPAWNS.highway.x-SPAWNS.drift.x)>40);
  assert.ok(nearHighway(SPAWNS.highway));assert.equal(nearHighway(SPAWNS.campus),false);
});
test('traffic is deterministic and advances only in the allowed time interval',()=>{
  const a=newTraffic(),b=newTraffic();
  assert.deepEqual(a,b);assert.equal(a.length,23);
  const c=stepTraffic(a,.5),d=stepTraffic(a,.05);
  assert.deepEqual(c,d);
});
test('near pass is scored once and collisions penalized once on cooldown',()=>{
  const before={x:162,z:10,speedKmh:100};
  const after={x:162,z:5,speedKmh:100};
  const farLane={id:1,x:166,z:7,previousZ:9,speed:18,counted:false,cooldown:0};
  const near=scoreTraffic(before,after,[farLane],.05);
  assert.equal(near.nearMisses,1);assert.ok(near.points>0);
  const hit={...farLane,x:162,z:5,previousZ:5};
  const first=scoreTraffic(before,after,[hit],.05);
  const second=scoreTraffic(after,after,first.traffic,.05);
  assert.equal(first.collisions,1);
  assert.equal(second.collisions,0);
});
