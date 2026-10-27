/**
 * Export five Schoolyard circuits to Unreal spline CSV.
 * Run: node tools/export_unreal_tracks.mjs
 * Unreal cm axes: X=-WebZ*100, Y=WebX*100, Z=0.
 */
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {TRACKS,sampleTrack,getTrackSpawn} from '../web/src/tracks.js';

const out=resolve('Generated/Tracks');
mkdirSync(out,{recursive:true});
const manifest=[];
for(const track of TRACKS){
  const samples=sampleTrack(track,240);
  const csv=['X,Y,Z,WidthCm'];
  for(const p of samples){
    csv.push([(-p.z*100).toFixed(3),(p.x*100).toFixed(3),'0',(track.width*100).toFixed(1)].join(','));
  }
  const path=resolve(out,track.id+'.csv');
  writeFileSync(path,csv.join('\n')+'\n','utf8');
  manifest.push({
    id:track.id,name:track.name,type:track.kind,
    width_m:track.width,point_count:samples.length,
    spawn_web:getTrackSpawn(track),csv:'Generated/Tracks/'+track.id+'.csv'
  });
  process.stdout.write('Wrote '+track.id+'.csv ('+samples.length+' spline points)\n');
}
writeFileSync(resolve(out,'manifest.json'),
  JSON.stringify({version:1,source:'web/src/tracks.js',tracks:manifest},null,2)+'\n');
