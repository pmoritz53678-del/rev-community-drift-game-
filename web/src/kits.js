// Authored original fictional body-kit presets. CC0 pack files can replace them after import approval.
export const BODY_KITS = Object.freeze([
  {id:'factory',name:'Factory / Clean',weight:0,grip:0,handling:0,description:'Unmodified understated factory look'},
  {id:'street',name:'Street Aero',weight:16,grip:2,handling:1,description:'Front lip, sculpted side skirts and subtle flares'},
  {id:'wide',name:'Widebody Competition',weight:34,grip:5,handling:-1,description:'Flared arches, wider stance and race aero'}
]);
export const WHEEL_KITS = Object.freeze([
  {id:'five',name:'Five-Spoke Alloy',weight:0,grip:0},
  {id:'mesh',name:'Mesh Motorsport',weight:2,grip:1},
  {id:'deep',name:'Deep-Dish Classic',weight:4,grip:0},
  {id:'track',name:'Lightweight Track',weight:-5,grip:1}
]);
export const WING_KITS = Object.freeze([
  {id:'none',name:'No Wing',weight:0,grip:0},
  {id:'duck',name:'Ducktail',weight:3,grip:1},
  {id:'gt',name:'GT Wing',weight:8,grip:3}
]);
const selected=(items,id)=>items.find(item=>item.id===id)||items[0];
export function normalizeBuild(input={}){
  return {
    bodyKit:selected(BODY_KITS,input.bodyKit).id,
    wheels:selected(WHEEL_KITS,input.wheels).id,
    wing:selected(WING_KITS,input.wing).id,
    paint:Number.isInteger(input.paint)&&input.paint>=0&&input.paint<=0xffffff
      ?input.paint:null
  };
}
export function getBuildStats(car,build){
  const b=normalizeBuild(build);
  const body=selected(BODY_KITS,b.bodyKit),
        wheels=selected(WHEEL_KITS,b.wheels),
        wing=selected(WING_KITS,b.wing);
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  return {...car,weight:car.weight+body.weight+wheels.weight+wing.weight,
    grip:clamp(car.grip+body.grip+wheels.grip+wing.grip,30,100),
    handling:clamp(car.handling+body.handling,30,100)};
}
export function validateCustomizations(saved){
  if(!saved||typeof saved!=='object'||Array.isArray(saved))return {};
  return Object.fromEntries(Object.entries(saved).filter(([k,v])=>
    /^[a-z0-9-]{1,32}$/.test(k)&&v&&typeof v==='object'&&!Array.isArray(v)
  ).map(([key,value])=>[key,normalizeBuild(value)]));
}
