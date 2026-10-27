// REV Schoolyard Motorsports Campus — five original, closed-course tracks.
// World coordinates are fictional meters. Positive z is screen south on the 2D map.
// Curves are deterministic Catmull-Rom loops for geometry, physics checks and minimap.
export const TRACKS = Object.freeze([
  {
    id:'north-pines',name:'NORTH PINES TANDEM',short:'NORTH PINES',kind:'drift',number:'D1',
    theme:'#df9c55',width:29,description:'Fast, flowing sweepers with room to hold twin lines.',
    points:[[-365,-270],[-334,-360],[-260,-402],[-188,-368],[-145,-311],[-151,-239],
      [-206,-182],[-279,-174],[-347,-211]],
    clipping:[0.12,0.43,0.74],difficulty:'INTERMEDIATE',
  },
  {
    id:'east-bowl',name:'EAST BOWL',short:'EAST BOWL',kind:'drift',number:'D2',
    theme:'#d87f53',width:32,description:'Two wide hairpins, a massive carousel and linked transitions.',
    points:[[164,-276],[194,-369],[295,-386],[370,-346],[380,-286],[344,-233],
      [302,-262],[257,-286],[225,-250],[234,-181],[323,-156],[382,-185],[393,-230]],
    clipping:[0.26,0.60,0.89],difficulty:'ADVANCED',
  },
  {
    id:'south-switch',name:'SOUTH SWITCHBACKS',short:'SWITCHBACKS',kind:'drift',number:'D3',
    theme:'#c2a56f',width:28,description:'Oversized S-bends, banked-looking entries and long tandem zones.',
    points:[[-380,171],[-421,253],[-391,337],[-330,379],[-256,357],[-209,292],
      [-137,279],[-130,218],[-187,149],[-259,136],[-314,189]],
    clipping:[0.22,0.47,0.78],difficulty:'EXPERT',
  },
  {
    id:'schoolyard-gp',name:'SCHOOLYARD GRAND PRIX',short:'SCHOOLYARD GP',kind:'race',number:'R1',
    theme:'#6cb7a2',width:22,description:'A real circuit rhythm: straights, braking zones and lap checkpoints.',
    points:[[164,113],[276,83],[384,118],[430,208],[415,308],[339,363],
      [251,341],[204,286],[148,300],[129,228]],
    clipping:[0.23,0.47,0.72],difficulty:'RACE',
  },
  {
    id:'outer-express',name:'OUTER EXPRESS',short:'OUTER EXPRESS',kind:'race',number:'R2',
    theme:'#78b6d5',width:30,description:'Closed expressway course with high-grip handling and optional moving traffic.',
    points:[[-125,476],[-65,421],[27,420],[145,442],[222,505],[213,587],
      [136,654],[24,672],[-73,638],[-150,577]],
    clipping:[0.25,0.50,0.75],difficulty:'HIGH SPEED',
  }
]);

const modulus=(n,d)=>((n%d)+d)%d;
const catmull=(a,b,c,d,t)=>0.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
export function pointOnTrack(track,progress=0){
  const p=track.points, n=p.length;
  const f=modulus(progress,1)*n, i=Math.floor(f),t=f-i;
  const a=p[modulus(i-1,n)],b=p[i],c=p[(i+1)%n],d=p[(i+2)%n];
  return {x:catmull(a[0],b[0],c[0],d[0],t),
          z:catmull(a[1],b[1],c[1],d[1],t)};
}
export function sampleTrack(track,count=240){
  return Array.from({length:count},(_,i)=>pointOnTrack(track,i/count));
}
export function onTrack(track,x,z,samples=sampleTrack(track,160)){
  let nearest=Infinity,index=0;
  for(let i=0;i<samples.length;i++){
    const p=samples[i];const d=(x-p.x)**2+(z-p.z)**2;
    if(d<nearest){nearest=d;index=i;}
  }
  return {inside:Math.sqrt(nearest)<track.width/2+1.5,distance:Math.sqrt(nearest),progress:index/samples.length};
}
export function getTrackSpawn(track){
  const a=pointOnTrack(track,.015),b=pointOnTrack(track,.020);
  const dx=b.x-a.x,dz=b.z-a.z;
  return {x:a.x,z:a.z,heading:Math.atan2(-dx,-dz)};
}
export function findTrack(id){return TRACKS.find(t=>t.id===id)||TRACKS[0];}
export function newLapState(){
  return {lap:0,lapSeconds:0,bestSeconds:null,lastProgress:null,sectors:[false,false,false],valid:true};
}
export function updateLapState(previous,progress,inside,dt){
  const s={...previous,sectors:[...previous.sectors]};
  s.lapSeconds+=Math.max(0,Math.min(.05,dt));
  if(!inside){s.valid=false;s.lastProgress=progress;return {state:s,completed:false};}
  if(progress>.23 && progress<.40)s.sectors[0]=true;
  if(progress>.48 && progress<.66 && s.sectors[0])s.sectors[1]=true;
  if(progress>.72 && progress<.91 && s.sectors[1])s.sectors[2]=true;
  const crossed=s.lastProgress!==null && s.lastProgress>.92 && progress<.08;
  const completed=crossed && s.valid && s.sectors.every(Boolean) && s.lapSeconds>14;
  if(completed){
    s.lap+=1;
    s.bestSeconds=s.bestSeconds===null?s.lapSeconds:Math.min(s.bestSeconds,s.lapSeconds);
    s.lapSeconds=0;s.sectors=[false,false,false];s.valid=true;
  } else if(crossed){
    s.lapSeconds=0;s.sectors=[false,false,false];s.valid=true;
  }
  s.lastProgress=progress;
  return {state:s,completed};
}
