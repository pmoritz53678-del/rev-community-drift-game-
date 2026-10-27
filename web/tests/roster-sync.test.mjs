import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {CARS} from '../src/roster.js';
const file=new URL('../../data/vehicles.json',import.meta.url);
test('browser garage exactly matches canonical original car data',()=>{
  const json=JSON.parse(readFileSync(fileURLToPath(file),'utf8'));
  assert.equal(json.schema_version,2);
  assert.equal(json.cars.length,15);
  assert.deepEqual(json.cars.map(c=>[c.id,c.brand,c.model]),
    CARS.map(c=>[c.id,c.brand,c.model]));
  assert.ok(json.cars.every(c=>c.design_status.includes('original')));
});
