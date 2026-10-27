import test from 'node:test';
import assert from 'node:assert/strict';
import {TRACKS} from '../src/tracks.js';
import {createCircuitTraffic,advanceCircuitTraffic,trafficPose,evaluateCircuitTraffic} from '../src/circuitTraffic.js';
const outer=TRACKS.find(t=>t.id==='outer-express');
test('AI cars move along the authored fictional loop',()=>{
  const initial=createCircuitTraffic(11);
  assert.equal(initial.length,11);
  const moved=advanceCircuitTraffic(initial,.5,outer,1700);
  assert.ok(moved[0].progress>initial[0].progress);
  assert.ok(Number.isFinite(trafficPose(outer,moved[0]).heading));
});
test('contact scores once and starts a cooldown',()=>{
  const initial=createCircuitTraffic(1);
  const pose=trafficPose(outer,initial[0]);
  const player={x:pose.x,z:pose.z,speedKmh:120};
  const first=evaluateCircuitTraffic(initial,player,outer);
  const second=evaluateCircuitTraffic(first.traffic,player,outer);
  assert.equal(first.collisions,1);
  assert.equal(second.collisions,0);
});
