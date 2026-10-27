import test from 'node:test';
import assert from 'node:assert/strict';
import {TRACKS,pointOnTrack,sampleTrack,getTrackSpawn,onTrack,newLapState,updateLapState} from '../src/tracks.js';
test('exactly three drift and two racing circuits',()=>{
 assert.equal(TRACKS.length,5);
 assert.equal(TRACKS.filter(t=>t.kind==='drift').length,3);
 assert.equal(TRACKS.filter(t=>t.kind==='race').length,2);
 assert.equal(new Set(TRACKS.map(t=>t.id)).size,5);
 assert.ok(TRACKS.slice(0,3).every(t=>t.width>=28));
});
test('all centers have finite coordinates, and track loops close',()=>{
 for(const t of TRACKS){
   const a=pointOnTrack(t,0),b=pointOnTrack(t,1);
   assert.deepEqual(a,b);
   assert.equal(sampleTrack(t).length,240);
   assert.ok(onTrack(t,a.x,a.z).inside);
   assert.ok(Number.isFinite(getTrackSpawn(t).heading));
 }
});
test('lap needs ordered sectors and no off-course travel',()=>{
  let valid=newLapState();
  let offTrack=newLapState();
  for(let i=0;i<=690;i++){
    const progress=(.02+i/620)%1;
    valid=updateLapState(valid,progress,true,.05).state;
    offTrack=updateLapState(offTrack,progress,!(i>300&&i<320),.05).state;
  }
  assert.equal(valid.lap,1);
  assert.ok(valid.bestSeconds>25);
  assert.equal(offTrack.lap,0);
});
