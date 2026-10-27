import test from 'node:test';
import assert from 'node:assert/strict';
import {mapProjection,WORLD_VIEW} from '../src/mapUI.js';
test('full map center is stable',()=>{
 const p=mapProjection(WORLD_VIEW.centerX,WORLD_VIEW.centerZ,550,380);
 assert.equal(p.x,275); assert.equal(p.y,190);
});
test('local player focus is centered',()=>{
 const p=mapProjection(-170,290,260,190,{local:true,focusX:-170,focusZ:290});
 assert.equal(p.x,130);assert.equal(p.y,95);
});
