import test from 'node:test';
import assert from 'node:assert/strict';
import {CARS} from '../src/roster.js';
import {buildCar} from '../src/carVisuals.js';
test('every fictional car generates a 3D mesh without licensed model assets',()=>{
  for(const car of CARS){
    const mesh=buildCar(car,car.color,{bodyKit:'factory',wheels:'five',wing:'none'});
    assert.ok(mesh.isGroup);
    assert.ok(mesh.children.length>15,car.id);
    assert.ok(mesh.getObjectByName('REV-original-'+car.id));
  }
});
test('wide JDM aero setup changes actual visible geometry, with red brake calipers',()=>{
  const car=CARS.find(c=>c.id==='nova');
  const base=buildCar(car,car.color,{bodyKit:'factory',wheels:'five',wing:'none'});
  const tuned=buildCar(car,0x5a87a4,{bodyKit:'wide',wheels:'mesh',wing:'gt'});
  let baselineMeshes=0,tunedMeshes=0,calipers=0;
  base.traverse(x=>{if(x.isMesh)baselineMeshes++;});
  tuned.traverse(x=>{if(x.isMesh)tunedMeshes++;if(x.isMesh&&x.material?.color?.getHex()===0xd13d35)calipers++;});
  assert.ok(tunedMeshes>baselineMeshes,'body kits and wings must produce new geometry');
  assert.equal(calipers,4,'all wheels show red brake calipers');
  assert.equal(tuned.userData.customization.bodyKit,'wide');
});
