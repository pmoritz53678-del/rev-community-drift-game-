import test from 'node:test';
import assert from 'node:assert/strict';
import {BODY_KITS,WHEEL_KITS,WING_KITS,normalizeBuild,getBuildStats,validateCustomizations} from '../src/kits.js';
import {TRACKS} from '../src/tracks.js';
import {findCar} from '../src/roster.js';
import {createAIDriver,calculateAIDriverAction,stepAIDriver} from '../src/aiDriver.js';
test('JDM starter has 3 body kits, 4 wheels and 3 wings',()=>{
  assert.equal(BODY_KITS.length,3);assert.equal(WHEEL_KITS.length,4);assert.equal(WING_KITS.length,3);
});
test('invalid build state normalizes safely',()=>{
  assert.deepEqual(normalizeBuild({bodyKit:'unknown',wheels:'hack',wing:'invalid'}),{
    bodyKit:'factory',wheels:'five',wing:'none',paint:null
  });
  assert.deepEqual(validateCustomizations({x:null,other:{bodyKit:'wide'}}).other.bodyKit,'wide');
});
test('customization changes grip and total weight predictably',()=>{
  const car=findCar('nova');
  const out=getBuildStats(car,{bodyKit:'wide',wheels:'track',wing:'gt'});
  assert.ok(out.grip>car.grip);
  assert.ok(out.weight>car.weight);
  assert.equal(out.drive,car.drive);
});
test('AI driver senses track and returns bounded controls',()=>{
  const track=TRACKS[0],car=findCar('nova'),bot=createAIDriver(track,'LEAD');
  const action=calculateAIDriverAction(bot,bot.state,track,car);
  assert.ok(action.steer>=-1&&action.steer<=1);
  assert.ok(action.throttle>=0&&action.throttle<=1);
  assert.ok(action.brake>=0&&action.brake<=1);
  let step=bot;
  for(let i=0;i<100;i++)step=stepAIDriver(step,bot.state,track,car,1/60);
  assert.ok(Number.isFinite(step.state.x)&&Number.isFinite(step.state.z));
  assert.ok(step.state.speedKmh>0);
});

test('AI lead achieves drifting points on the wide East Bowl circuit',()=>{
  const track=TRACKS.find(x=>x.id==='east-bowl'),car=findCar('ember');
  let bot=createAIDriver(track,'LEAD');
  let driftingFrames=0;
  for(let i=0;i<1200;i++){
    bot=stepAIDriver(bot,{x:0,z:0,speedKmh:0},track,car,1/60);
    if(bot.state.drifting)driftingFrames++;
  }
  assert.ok(driftingFrames>100,'AI should actually slide, not only follow the road');
  assert.ok(bot.state.score>250,'AI pilot should earn positive drift points');
  assert.equal(bot.resetCount,0,'AI should not leave and reset repeatedly');
});
