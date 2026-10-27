// ORIGINAL fictional manufacturers and cars. No licensed vehicle geometry, trademarks or scans.
// Keep roster separate from the private You vs AI source data and all real financial records.
export const CATEGORIES = ['All','JDM','Euro','Exotic','Hypercar','Utility'];

export const CARS = [
  {id:'seiran',brand:'KISORA',model:'Seiran GT',category:'JDM',shape:'coupe',color:0x345f87,power:340,weight:1450,handling:80,grip:78,drift:77,drive:'AWD',story:'The all-weather grand tourer built for mountain roads.'},
  {id:'arcade',brand:'KISORA',model:'Arcade R',category:'JDM',shape:'coupe',color:0xf1f1ed,power:410,weight:1550,handling:77,grip:81,drift:75,drive:'AWD',story:'A cult favorite for late-night circuits.'},
  {id:'nova',brand:'KISORA',model:'Nova S',category:'JDM',shape:'coupe',color:0xffb13b,power:285,weight:1220,handling:88,grip:69,drift:92,drive:'RWD',story:'Light, balanced, and born for tandem practice.'},
  {id:'ember',brand:'MIREN',model:'Ember Twin',category:'JDM',shape:'coupe',color:0xc94147,power:320,weight:1270,handling:87,grip:72,drift:90,drive:'RWD',story:'A compact, responsive favorite of grassroots drifters.'},
  {id:'ion',brand:'MIREN',model:'Ion X',category:'JDM',shape:'exotic',color:0xe8e7df,power:390,weight:1370,handling:86,grip:83,drift:78,drive:'RWD',story:'A sharp mid-engine-inspired sports concept.'},
  {id:'circuit',brand:'EISEN',model:'Circuit 46',category:'Euro',shape:'coupe',color:0x6b8b98,power:350,weight:1490,handling:84,grip:75,drift:87,drive:'RWD',story:'A classic rear-drive platform for technical corners.'},
  {id:'vanta',brand:'EISEN',model:'Vanta 92',category:'Euro',shape:'coupe',color:0x2b2d31,power:430,weight:1620,handling:79,grip:82,drift:80,drive:'RWD',story:'A precise performance coupe with measured power.'},
  {id:'tourer',brand:'EISEN',model:'Grand Tourer S',category:'Utility',shape:'wagon',color:0x65877a,power:540,weight:1920,handling:68,grip:86,drift:64,drive:'AWD',story:'The fast family wagon of the support crew.'},
  {id:'falcon',brand:'FERRON',model:'Falcon 40',category:'Exotic',shape:'exotic',color:0xe04432,power:490,weight:1380,handling:78,grip:89,drift:72,drive:'RWD',story:'A dramatic wedge-shaped analog exotic.'},
  {id:'stella',brand:'FERRON',model:'Stella GT',category:'Exotic',shape:'exotic',color:0xf2bf46,power:580,weight:1460,handling:84,grip:88,drift:76,drive:'RWD',story:'A high-revving street-to-track machine.'},
  {id:'nocturne',brand:'VELLARO',model:'Nocturne V12',category:'Exotic',shape:'exotic',color:0x8d69c6,power:650,weight:1630,handling:81,grip:87,drift:73,drive:'AWD',story:'A broad-shouldered flagship from the design studio.'},
  {id:'horizon',brand:'VELLARO',model:'Horizon SV',category:'Exotic',shape:'exotic',color:0x63bc7e,power:710,weight:1510,handling:82,grip:91,drift:71,drive:'AWD',story:'An expressive experimental aero coupe.'},
  {id:'helios',brand:'AERON',model:'Helios One',category:'Hypercar',shape:'hyper',color:0xf6ede6,power:1020,weight:1410,handling:73,grip:95,drift:61,drive:'RWD',story:'A purpose-built hyper GT with extreme acceleration.'},
  {id:'solstice',brand:'AERON',model:'Solstice R',category:'Hypercar',shape:'hyper',color:0x40b3b8,power:850,weight:1320,handling:86,grip:94,drift:67,drive:'RWD',story:'A low-drag carbon prototype for the open track.'},
  {id:'ranger',brand:'MERIDIAN',model:'Ranger 4',category:'Utility',shape:'wagon',color:0x718276,power:415,weight:1800,handling:70,grip:84,drift:66,drive:'AWD',story:'REV Community support and camera vehicle.'},
];
export function findCar(id) { return CARS.find(car => car.id === id) || CARS[2]; }
