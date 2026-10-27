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
 let s=newLapState();
 for(const progress of [.02,.26,.53,.79,.95,.02]){
  ({state:s}=updateLapState(s,progress,true,4));
 }
 assert.equal(s.lap,1);assert.ok(s.bestSeconds>14);
 let wrong=newLapState();
 for(const progress of [.95,.01])({state:wrong}=updateLapState(wrong,progress,true,4));
 assert.equal(wrong.lap,0);
 let off=newLapState();
 for(const progress of [.02,.26,.53,.79,.95])({state:off}=updateLapState(off,progress,true,4));
 ({state:off}=updateLapState(off,.97,false,.05));
 ({state:off}=updateLapState(off,.02,true,.05));
 assert.equal(off.lap,0);
});
