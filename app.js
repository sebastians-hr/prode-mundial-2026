// ============================================================
// PRODE MUNDIAL 26 · FORO!
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCq5_wwdc7lipXPqaH6_CYZSIUEFj81yBI",
  authDomain: "prode-mundial-26.firebaseapp.com",
  projectId: "prode-mundial-26",
  storageBucket: "prode-mundial-26.firebasestorage.app",
  messagingSenderId: "112140770068",
  appId: "1:112140770068:web:7c364985a7a4f05b3b0001"
};

const JUGADORES_INICIALES = [
  'Sebastián Suez','Dario Vulpes','Alexis Wolff','Axel Meunier',
  'Felix Llambias','Inda Videla','Ivan Kerchen','Lucas Pistoia',
  'Martin Picasso','Mati Antolin','Maxi Suez','Pedro Wolson',
  'Santi Teitel','Walter Korn','Zucho Ramos Mejia','~Du'
];

const ADMIN_PASSWORD = 'sebasuez26';
const MP_LINK = 'https://link.mercadopago.com.ar/sebastiansuez';
const POZO_TOTAL = 800000;
const ENTRADA = 50000;
const FICHAS_INICIALES = 104;

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot,
  collection, getDocs
} from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

let firebaseApp, db;
try {
  firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
} catch(e) {
  console.warn('Firebase no inicializado:', e);
}

const EQUIPOS = {
  MEX:{n:'México',f:'🇲🇽'}, RSA:{n:'Sudáfrica',f:'🇿🇦'}, KOR:{n:'Corea Sur',f:'🇰🇷'}, CZE:{n:'Chequia',f:'🇨🇿'},
  CAN:{n:'Canadá',f:'🇨🇦'}, SUI:{n:'Suiza',f:'🇨🇭'}, QAT:{n:'Qatar',f:'🇶🇦'}, BIH:{n:'Bosnia',f:'🇧🇦'},
  BRA:{n:'Brasil',f:'🇧🇷'}, MAR:{n:'Marruecos',f:'🇲🇦'}, HAI:{n:'Haití',f:'🇭🇹'}, SCO:{n:'Escocia',f:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
  USA:{n:'EE.UU.',f:'🇺🇸'}, PAR:{n:'Paraguay',f:'🇵🇾'}, AUS:{n:'Australia',f:'🇦🇺'}, TUR:{n:'Turquía',f:'🇹🇷'},
  GER:{n:'Alemania',f:'🇩🇪'}, CUW:{n:'Curazao',f:'🇨🇼'}, CIV:{n:'Costa Marfil',f:'🇨🇮'}, ECU:{n:'Ecuador',f:'🇪🇨'},
  NED:{n:'P. Bajos',f:'🇳🇱'}, JPN:{n:'Japón',f:'🇯🇵'}, TUN:{n:'Túnez',f:'🇹🇳'}, SWE:{n:'Suecia',f:'🇸🇪'},
  BEL:{n:'Bélgica',f:'🇧🇪'}, EGY:{n:'Egipto',f:'🇪🇬'}, IRN:{n:'Irán',f:'🇮🇷'}, NZL:{n:'N. Zelanda',f:'🇳🇿'},
  ESP:{n:'España',f:'🇪🇸'}, CPV:{n:'Cabo Verde',f:'🇨🇻'}, KSA:{n:'Arabia S.',f:'🇸🇦'}, URU:{n:'Uruguay',f:'🇺🇾'},
  FRA:{n:'Francia',f:'🇫🇷'}, SEN:{n:'Senegal',f:'🇸🇳'}, IRQ:{n:'Irak',f:'🇮🇶'}, NOR:{n:'Noruega',f:'🇳🇴'},
  ARG:{n:'Argentina',f:'🇦🇷'}, ALG:{n:'Argelia',f:'🇩🇿'}, AUT:{n:'Austria',f:'🇦🇹'}, JOR:{n:'Jordania',f:'🇯🇴'},
  POR:{n:'Portugal',f:'🇵🇹'}, COD:{n:'RD Congo',f:'🇨🇩'}, UZB:{n:'Uzbekistán',f:'🇺🇿'}, COL:{n:'Colombia',f:'🇨🇴'},
  ENG:{n:'Inglaterra',f:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'}, CRO:{n:'Croacia',f:'🇭🇷'}, GHA:{n:'Ghana',f:'🇬🇭'}, PAN:{n:'Panamá',f:'🇵🇦'}
};

const FIXTURE = [
  ['M1','11/06','16:00','MEX','RSA','grupos','A',1.85,3.40,4.50],
  ['M2','11/06','23:00','KOR','CZE','grupos','A',2.30,3.10,3.20],
  ['M3','12/06','19:00','CAN','BIH','grupos','B',1.95,3.30,4.00],
  ['M4','12/06','22:00','USA','PAR','grupos','D',1.75,3.50,4.80],
  ['M5','13/06','01:00','AUS','TUR','grupos','D',3.00,3.20,2.40],
  ['M6','13/06','13:00','BRA','MAR','grupos','C',1.55,4.00,6.00],
  ['M7','13/06','16:00','HAI','SCO','grupos','C',5.50,3.40,1.65],
  ['M8','13/06','19:00','SUI','QAT','grupos','B',1.40,4.50,7.50],
  ['M9','13/06','22:00','ARG','ALG','grupos','J',1.35,4.80,8.00],
  ['M10','14/06','14:00','GER','CUW','grupos','E',1.20,6.50,12.00],
  ['M11','14/06','17:00','NED','JPN','grupos','F',1.65,3.80,5.00],
  ['M12','14/06','20:00','CIV','ECU','grupos','E',2.40,3.10,3.00],
  ['M13','15/06','01:00','SWE','TUN','grupos','F',2.05,3.20,3.80],
  ['M14','15/06','13:00','ESP','CPV','grupos','H',1.20,6.00,12.00],
  ['M15','15/06','16:00','BEL','IRN','grupos','G',1.65,3.80,5.20],
  ['M16','15/06','22:00','NZL','EGY','grupos','G',4.50,3.30,1.80],
  ['M17','16/06','14:00','AUT','JOR','grupos','J',1.50,4.00,6.50],
  ['M18','16/06','18:00','FRA','SEN','grupos','I',1.65,3.80,5.00],
  ['M19','16/06','21:00','IRQ','NOR','grupos','I',5.50,3.60,1.65],
  ['M20','17/06','14:00','POR','COD','grupos','K',1.30,5.00,9.00],
  ['M21','17/06','17:00','ENG','CRO','grupos','L',2.00,3.30,3.80],
  ['M22','17/06','19:00','GHA','PAN','grupos','L',2.10,3.20,3.60],
  ['M22b','18/06','16:00','URU','KSA','grupos','H',1.50,4.00,6.50],
  ['M23','17/06','23:00','UZB','COL','grupos','K',4.50,3.30,1.80],
  ['M24','18/06','13:00','CZE','RSA','grupos','A',2.10,3.10,3.80],
  ['M25','18/06','22:00','MEX','KOR','grupos','A',2.05,3.20,3.70],
  ['M26','19/06','16:00','USA','AUS','grupos','D',1.70,3.60,5.00],
  ['M27','19/06','19:00','BIH','SUI','grupos','B',3.50,3.20,2.10],
  ['M28','20/06','00:00','TUR','PAR','grupos','D',2.10,3.10,3.70],
  ['M29','20/06','13:00','QAT','CAN','grupos','B',5.00,3.50,1.70],
  ['M30','20/06','17:00','SCO','MAR','grupos','C',3.00,3.20,2.40],
  ['M31','20/06','22:00','BRA','HAI','grupos','C',1.20,6.50,12.00],
  ['M32','21/06','14:00','NED','SWE','grupos','F',1.70,3.70,5.00],
  ['M33','21/06','17:00','GER','CIV','grupos','E',1.45,4.30,7.00],
  ['M34','21/06','21:00','CUW','ECU','grupos','E',5.50,3.70,1.55],
  ['M35','22/06','01:00','TUN','JPN','grupos','F',3.80,3.20,2.05],
  ['M36','22/06','13:00','ESP','KSA','grupos','H',1.25,5.50,10.00],
  ['M37','22/06','16:00','BEL','EGY','grupos','G',1.55,4.00,6.50],
  ['M38','22/06','19:00','URU','CPV','grupos','H',1.40,4.50,7.00],
  ['M39','22/06','22:00','NZL','IRN','grupos','G',5.00,3.40,1.75],
  ['M40','23/06','14:00','ARG','AUT','grupos','J',1.45,4.20,7.00],
  ['M41','23/06','18:00','FRA','IRQ','grupos','I',1.20,6.50,12.00],
  ['M42','23/06','21:00','NOR','SEN','grupos','I',2.30,3.30,3.10],
  ['M43','24/06','00:00','JOR','ALG','grupos','J',5.00,3.40,1.75],
  ['M44','24/06','14:00','POR','UZB','grupos','K',1.35,4.80,8.00],
  ['M45','24/06','17:00','CRO','GHA','grupos','L',1.65,3.80,5.00],
  ['M46','24/06','19:00','PAN','ENG','grupos','L',6.50,3.80,1.50],
  ['M47','24/06','23:00','COL','COD','grupos','K',1.50,4.10,6.50],
  ['M48','25/06','22:00','CZE','MEX','grupos','A',3.20,3.10,2.30],
  ['M49','25/06','22:00','RSA','KOR','grupos','A',3.20,3.20,2.25],
  ['M50','26/06','22:00','TUR','USA','grupos','D',3.00,3.20,2.40],
  ['M51','26/06','22:00','PAR','AUS','grupos','D',2.20,3.10,3.40],
  ['M52','27/06','13:00','SUI','CAN','grupos','B',2.30,3.20,3.20],
  ['M53','27/06','13:00','BIH','QAT','grupos','B',1.65,3.70,5.00],
  ['M54','27/06','16:00','SCO','BRA','grupos','C',7.00,4.00,1.45],
  ['M55','27/06','16:00','MAR','HAI','grupos','C',1.30,5.00,9.00],
  ['M56','28/06','14:00','ECU','GER','grupos','E',5.00,3.50,1.70],
  ['M57','28/06','14:00','CUW','CIV','grupos','E',7.50,4.20,1.40],
  ['M58','28/06','21:00','JPN','SWE','grupos','F',2.50,3.20,2.80],
  ['M59','28/06','21:00','TUN','NED','grupos','F',5.50,3.70,1.55],
  ['M60','29/06','21:00','CPV','KSA','grupos','H',2.80,3.10,2.60],
  ['M61','29/06','21:00','URU','ESP','grupos','H',4.00,3.40,1.85],
  ['M62','29/06','21:00','EGY','IRN','grupos','G',2.80,3.10,2.55],
  ['M63','29/06','21:00','NZL','BEL','grupos','G',7.00,4.00,1.45],
  ['M64','30/06','16:00','PAN','ENG','grupos','L',6.00,3.70,1.50],
  ['M65','30/06','16:00','CRO','GHA','grupos','L',1.55,3.90,6.00],
  ['M66','30/06','19:30','COL','POR','grupos','K',3.40,3.20,2.10],
  ['M67','30/06','19:30','COD','UZB','grupos','K',2.50,3.10,2.80],
  ['M68','01/07','22:00','ALG','AUT','grupos','J',2.80,3.20,2.50],
  ['M69','01/07','22:00','JOR','ARG','grupos','J',9.00,5.00,1.30],
  ['M70','01/07','15:00','NOR','FRA','grupos','I',2.80,3.30,2.50],
  ['M71','01/07','15:00','SEN','IRQ','grupos','I',1.45,4.00,7.50],
  ['M72','03/07','14:00','?A2','?B2','r32','-',2.10,3.20,3.30],
  ['M73','03/07','17:00','?E1','?3F','r32','-',1.80,3.40,4.20],
  ['M74','04/07','14:00','?F1','?C2','r32','-',2.00,3.30,3.50],
  ['M75','04/07','17:00','?C1','?F2','r32','-',1.85,3.40,4.00],
  ['M76','04/07','21:00','?B1','?3E','r32','-',1.85,3.40,4.00],
  ['M77','05/07','14:00','?A1','?3C','r32','-',1.85,3.40,4.00],
  ['M78','05/07','17:00','?D2','?G2','r32','-',2.10,3.20,3.30],
  ['M79','05/07','21:00','?H1','?3D','r32','-',1.80,3.40,4.20],
  ['M80','06/07','14:00','?I1','?3B','r32','-',1.80,3.40,4.20],
  ['M81','06/07','21:00','?L1','?3J','r32','-',1.85,3.40,4.00],
  ['M82','07/07','14:00','?J1','?H2','r32','-',1.95,3.30,3.70],
  ['M83','07/07','17:00','?K1','?3I','r32','-',1.85,3.40,4.00],
  ['M84','07/07','21:00','?G1','?D2b','r32','-',1.95,3.30,3.70],
  ['M85','08/07','14:00','?I2','?L2','r32','-',2.10,3.20,3.30],
  ['M86','08/07','17:00','?J2','?K2','r32','-',2.05,3.20,3.40],
  ['M87','08/07','21:00','?E2','?I2b','r32','-',2.10,3.20,3.30],
  ['M88','11/07','14:00','?W72','?W73','r16','-',2.00,3.30,3.50],
  ['M89','11/07','17:00','?W74','?W75','r16','-',2.00,3.30,3.50],
  ['M90','12/07','14:00','?W76','?W77','r16','-',2.00,3.30,3.50],
  ['M91','12/07','17:00','?W78','?W79','r16','-',2.00,3.30,3.50],
  ['M92','13/07','14:00','?W80','?W81','r16','-',2.00,3.30,3.50],
  ['M93','13/07','17:00','?W82','?W83','r16','-',2.00,3.30,3.50],
  ['M94','14/07','14:00','?W84','?W85','r16','-',2.00,3.30,3.50],
  ['M95','14/07','17:00','?W86','?W87','r16','-',2.00,3.30,3.50],
  ['M96','17/07','17:00','?W88','?W89','qf','-',2.10,3.30,3.30],
  ['M97','17/07','21:00','?W90','?W91','qf','-',2.10,3.30,3.30],
  ['M98','18/07','17:00','?W92','?W93','qf','-',2.10,3.30,3.30],
  ['M99','18/07','21:00','?W94','?W95','qf','-',2.10,3.30,3.30],
  ['M100','22/07','17:00','?W96','?W97','sf','-',2.20,3.20,3.10],
  ['M101','22/07','21:00','?W98','?W99','sf','-',2.20,3.20,3.10],
  ['M102','25/07','17:00','?L100','?L101','final','3°',2.20,3.20,3.10],
  ['M103','26/07','17:00','?W100','?W101','final','FINAL',2.30,3.20,3.00]
];

console.log(`Fixture: ${FIXTURE.length} partidos`);
const state = {
  jugadorActivo: null,
  isAdmin: false,
  pronosticos: {},
  pronosticosMios: {},
  pronosticosGuardados: {},
  resultados: {},
  ranking: [],
  ultimaSinc: null,
  faseFiltro: 'todos',
  haEditadoSinGuardar: false
};

async function fbInicializarSiVacio(){
  if(!db) return;
  try {
    const snap = await getDocs(collection(db,'jugadores'));
    if(snap.empty){
      console.log('Inicializando jugadores...');
      for(let i=0;i<JUGADORES_INICIALES.length;i++){
        const nombre = JUGADORES_INICIALES[i];
        const id = generarId(nombre);
        await setDoc(doc(db,'jugadores',id),{
          id, nombre, pin:'', pago:false,
          pronosticos:{}, fichas:FICHAS_INICIALES,
          fechaCreacion: new Date().toISOString()
        });
      }
    }
  } catch(e){ console.error('Error init:',e) }
}

function generarId(nombre){
  return nombre.toLowerCase().replace(/[^a-z0-9]/g,'').substring(0,20) || 'jugador';
}

async function fbCargarJugadores(){
  if(!db) return [];
  const snap = await getDocs(collection(db,'jugadores'));
  return snap.docs.map(d=>d.data());
}

async function fbCargarJugador(id){
  if(!db) return null;
  const s = await getDoc(doc(db,'jugadores',id));
  return s.exists() ? s.data() : null;
}

async function fbGuardarJugador(jugador){
  if(!db) return;
  await setDoc(doc(db,'jugadores',jugador.id),jugador);
}

async function fbGuardarPronosticos(jugadorId, pronosticos){
  if(!db) return;
  await updateDoc(doc(db,'jugadores',jugadorId),{
    pronosticos, ultimaActualizacion: new Date().toISOString()
  });
}

async function fbCargarResultados(){
  if(!db) return {};
  const s = await getDoc(doc(db,'resultados','main'));
  return s.exists() ? (s.data().resultados||{}) : {};
}

async function fbGuardarResultados(resultados){
  if(!db) return;
  await setDoc(doc(db,'resultados','main'),{
    resultados, ultimaActualizacion: new Date().toISOString()
  });
}

const RESULTS_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

const NOMBRE_A_CODIGO = {
  'Mexico':'MEX','South Africa':'RSA','South Korea':'KOR','Czech Republic':'CZE','Czechia':'CZE',
  'Canada':'CAN','Switzerland':'SUI','Qatar':'QAT','Bosnia and Herzegovina':'BIH','Bosnia-Herzegovina':'BIH',
  'Brazil':'BRA','Morocco':'MAR','Haiti':'HAI','Scotland':'SCO',
  'USA':'USA','United States':'USA','Paraguay':'PAR','Australia':'AUS','Türkiye':'TUR','Turkey':'TUR','Turkiye':'TUR',
  'Germany':'GER','Curaçao':'CUW','Curacao':'CUW','Ivory Coast':'CIV',"Côte d'Ivoire":'CIV','Ecuador':'ECU',
  'Netherlands':'NED','Japan':'JPN','Tunisia':'TUN','Sweden':'SWE',
  'Belgium':'BEL','Egypt':'EGY','Iran':'IRN','New Zealand':'NZL',
  'Spain':'ESP','Cape Verde':'CPV','Cabo Verde':'CPV','Saudi Arabia':'KSA','Uruguay':'URU',
  'France':'FRA','Senegal':'SEN','Iraq':'IRQ','Norway':'NOR',
  'Argentina':'ARG','Algeria':'ALG','Austria':'AUT','Jordan':'JOR',
  'Portugal':'POR','DR Congo':'COD','Congo DR':'COD','Uzbekistan':'UZB','Colombia':'COL',
  'England':'ENG','Croatia':'CRO','Ghana':'GHA','Panama':'PAN'
};

window.sincronizarResultados = async function(silencioso=false){
  if(!silencioso) toast('🔄 Sincronizando...','info');
  try {
    const res = await fetch(RESULTS_URL,{cache:'no-store'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    let actualizados = 0;
    
    data.matches.forEach(m=>{
      if(!m.score || !m.score.ft) return;
      const c1 = NOMBRE_A_CODIGO[m.team1];
      const c2 = NOMBRE_A_CODIGO[m.team2];
      if(!c1 || !c2) return;
      
      const partido = FIXTURE.find(p=>(p[3]===c1 && p[4]===c2) || (p[3]===c2 && p[4]===c1));
      if(!partido) return;
      
      const id = partido[0];
      const localPrimero = partido[3] === c1;
      const gL = localPrimero ? m.score.ft[0] : m.score.ft[1];
      const gV = localPrimero ? m.score.ft[1] : m.score.ft[0];
      
      const real = gL > gV ? '1' : (gL < gV ? '2' : 'X');
      const previo = state.resultados[id];
      
      if(!previo || previo.real !== real || previo.gL !== gL || previo.gV !== gV){
        state.resultados[id] = { real, gL, gV };
        actualizados++;
      }
    });
    
    if(actualizados > 0){
      await fbGuardarResultados(state.resultados);
      await actualizarRanking();
    }
    
    state.ultimaSinc = new Date().toISOString();
    actualizarUltimaSync();
    
    if(!silencioso){
      toast(actualizados > 0 ? `✓ ${actualizados} resultados actualizados` : '✓ Todo al día','success');
    }
    return actualizados;
  } catch(e) {
    console.error(e);
    if(!silencioso) toast('Error al sincronizar','error');
    return 0;
  }
};

function actualizarUltimaSync(){
  const el = document.getElementById('ultima-sinc');
  if(!el) return;
  if(state.ultimaSinc){
    const f = new Date(state.ultimaSinc);
    const min = Math.floor((Date.now() - f) / 60000);
    el.textContent = min < 1 ? 'recién' : (min < 60 ? `hace ${min} min` : `hace ${Math.floor(min/60)}h`);
  } else el.textContent = 'nunca';
}

function calcularFichasJugador(jugador){
  let fichas = FICHAS_INICIALES;
  let aciertos = 0, fallados = 0, sinApostar = 0, pendientes = 0;
  const pron = jugador.pronosticos || {};
  
  FIXTURE.forEach(p=>{
    const id = p[0];
    const real = state.resultados[id];
    const cuotas = { '1': p[7], 'X': p[8], '2': p[9] };
    
    if(real && real.real){
      const apuesta = pron[id];
      fichas -= 1;
      if(apuesta && apuesta === real.real){
        const pago = cuotas[apuesta] || 1;
        fichas += pago;
        aciertos++;
      } else if(apuesta){
        fallados++;
      } else {
        sinApostar++;
      }
    } else {
      pendientes++;
    }
  });
  
  return {
    fichas: Math.round(fichas * 100) / 100,
    aciertos, fallados, sinApostar, pendientes
  };
}

async function actualizarRanking(){
  const jugadores = await fbCargarJugadores();
  state.ranking = jugadores.map(j=>{
    const stats = calcularFichasJugador(j);
    return {
      id: j.id, nombre: j.nombre, pago: j.pago, ...stats
    };
  }).sort((a,b)=>b.fichas - a.fichas || b.aciertos - a.aciertos);
  renderRanking();
  if(state.jugadorActivo) renderUserBars();
}
async function inicializarLogin(){
  await fbInicializarSiVacio();
  const jugadores = await fbCargarJugadores();
  jugadores.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  
  const sel = document.getElementById('select-jugador');
  sel.innerHTML = '<option value="">— Elegí tu nombre —</option>' +
    jugadores.map(j=>{
      const tienePin = j.pin && j.pin.length === 4;
      return `<option value="${j.id}">${escapeHtml(j.nombre)}${!tienePin ? ' · primera vez' : ''}</option>`;
    }).join('');
  
  const guardado = localStorage.getItem('prode_sesion');
  if(guardado){
    try {
      const { id, pin } = JSON.parse(guardado);
      const j = jugadores.find(x=>x.id === id);
      if(j && j.pin === pin){
        await iniciarSesion(j);
        return;
      }
    } catch(e){}
  }
  
  document.getElementById('seccion-loading').style.display='none';
  document.getElementById('sec-login').classList.add('active');
}

window.intentarLogin = async function(){
  const sel = document.getElementById('select-jugador');
  const pin = document.getElementById('input-pin').value;
  const id = sel.value;
  
  if(!id){ toast('Elegí tu nombre','error'); return }
  if(!/^\d{4}$/.test(pin)){ toast('El PIN debe ser de 4 dígitos','error'); return }
  
  const j = await fbCargarJugador(id);
  if(!j){ toast('Error: jugador no encontrado','error'); return }
  
  if(!j.pin || j.pin.length !== 4){
    if(!confirm(`Vas a usar el PIN "${pin}" para entrar siempre. ¿Confirmás?\n\n⚠️ Anotalo: si lo perdés tenés que pedirle al admin que lo resetee.`)){
      return;
    }
    j.pin = pin;
    await fbGuardarJugador(j);
    toast('PIN guardado · ¡Bienvenido!','success');
  } else if(j.pin !== pin){
    toast('PIN incorrecto','error');
    return;
  }
  
  await iniciarSesion(j);
};

async function iniciarSesion(jugador){
  state.jugadorActivo = jugador;
  state.pronosticosGuardados = jugador.pronosticos || {};
  state.pronosticosMios = { ...state.pronosticosGuardados };
  state.haEditadoSinGuardar = false;
  
  localStorage.setItem('prode_sesion', JSON.stringify({ id: jugador.id, pin: jugador.pin }));
  
  state.resultados = await fbCargarResultados();
  await actualizarRanking();
  window.sincronizarResultados(true);
  
  document.getElementById('seccion-loading').style.display='none';
  document.getElementById('sec-login').classList.remove('active');
  document.getElementById('bottom-nav').style.display='grid';
  
  window.irA('inicio');
  toast(`Hola ${jugador.nombre.split(' ')[0]}!`,'success');
  mostrarBannerInstalar();
}

window.cerrarSesion = function(){
  if(!confirm('¿Salir del prode? Vas a tener que volver a poner tu PIN.')) return;
  localStorage.removeItem('prode_sesion');
  location.reload();
};

window.irA = function(tab){
  if(state.haEditadoSinGuardar && tab !== 'mi-prode'){
    if(!confirm('Tenés cambios sin guardar. ¿Salir igual?\n\nLos cambios se van a perder.')){
      return;
    }
    state.pronosticosMios = { ...state.pronosticosGuardados };
    state.haEditadoSinGuardar = false;
  }
  
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  
  const sec = document.querySelector(`[data-section="${tab}"]`);
  if(sec) sec.classList.add('active');
  
  const btn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
  if(btn) btn.classList.add('active');
  
  window.scrollTo({top:0,behavior:'smooth'});
  
  if(tab === 'mi-prode') renderPartidos();
  if(tab === 'ranking') renderRanking();
  if(tab === 'inicio') renderInicio();
};

function renderUserBars(){
  if(!state.jugadorActivo) return;
  const stats = calcularFichasJugador(state.jugadorActivo);
  const j = state.jugadorActivo;
  const inicial = j.nombre.charAt(0).toUpperCase();
  
  const html = `<div class="user-bar">
    <div class="user-avatar">${inicial}</div>
    <div class="user-info">
      <div class="user-name">${escapeHtml(j.nombre)}</div>
      <div class="user-stats">${stats.aciertos} aciertos · ${stats.pendientes} pendientes</div>
    </div>
    <div class="fichas-badge">${stats.fichas} <span style="font-size:11px;font-family:var(--condensed)">FICHAS</span></div>
  </div>`;
  
  ['user-bar-inicio','user-bar-prode','user-bar-ranking'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.innerHTML = html;
  });
}

function renderInicio(){
  renderUserBars();
  const debut = new Date('2026-06-11T16:00:00-03:00');
  const dias = Math.max(0, Math.ceil((debut - new Date())/(1000*60*60*24)));
  const el = document.getElementById('dias-restantes');
  if(el) el.textContent = dias;
}

function renderPartidos(){
  renderUserBars();
  const cont = document.getElementById('lista-partidos');
  let lista = FIXTURE.slice();
  if(state.faseFiltro !== 'todos'){
    lista = lista.filter(p => p[5] === state.faseFiltro);
  }
  
  const porFecha = {};
  lista.forEach(p=>{
    if(!porFecha[p[1]]) porFecha[p[1]] = [];
    porFecha[p[1]].push(p);
  });
  
  let html = '';
  Object.entries(porFecha).forEach(([fecha, partidos])=>{
    html += `<div class="fecha-divider">${fecha}</div>`;
    partidos.forEach(p=>{ html += renderPartido(p); });
  });
  
  cont.innerHTML = html || '<div class="empty"><div class="ico">⚽</div><p>Sin partidos en esta fase</p></div>';
  
  actualizarBotonGuardar();
  actualizarFiltrosFase();
}

function renderPartido(p){
  const [id, fecha, hora, locCod, visCod, fase, grupo, cL, cE, cV] = p;
  const local = EQUIPOS[locCod] || { n: locCod.replace('?',''), f: '❓' };
  const visit = EQUIPOS[visCod] || { n: visCod.replace('?',''), f: '❓' };
  const isPlaceholder = locCod.startsWith('?') || visCod.startsWith('?');
  
  const eleccionMia = state.pronosticosMios[id];
  const real = state.resultados[id];
  const cerrado = !!real;
  
  const claseExtra = cerrado ? (eleccionMia === real.real ? 'acertado' : (eleccionMia ? 'fallado' : 'cerrado')) : (eleccionMia ? 'guardado' : '');
  const grupoTag = fase === 'grupos' ? `Grupo ${grupo}` : faseNombre(fase, grupo);
  
  const realTag = real ? `<span class="resultado-real">${real.gL ?? ''}-${real.gV ?? ''}</span>` : '';
  
  let resultadoPago = '';
  if(cerrado && eleccionMia){
    if(eleccionMia === real.real){
      const pago = ({'1':cL,'X':cE,'2':cV})[eleccionMia];
      resultadoPago = `<div class="partido-resultado-pago gano">✓ Acertaste · +${pago} fichas</div>`;
    } else {
      resultadoPago = `<div class="partido-resultado-pago perdio">✗ Fallaste · -1 ficha</div>`;
    }
  } else if(cerrado && !eleccionMia){
    resultadoPago = `<div class="partido-resultado-pago perdio">✗ No apostaste · -1 ficha</div>`;
  }
  
  const dis = (cerrado || isPlaceholder) ? 'disabled' : '';
  
  return `<div class="partido ${claseExtra}">
    <div class="partido-meta">
      <span><span class="grupo">${grupoTag}</span> · ${fecha} ${hora}hs</span>
      ${realTag}
    </div>
    <div class="apuestas-3">
      <button class="btn-apuesta ${eleccionMia==='1'?'elegida':''} ${cerrado && eleccionMia==='1' ? (real.real==='1'?'acertado':'fallado'):''}" 
              onclick="elegir('${id}','1')" ${dis}>
        <span class="equipo-flag">${local.f}</span>
        <span class="equipo-nombre">${local.n}</span>
        <span class="cuota">${cL}</span>
      </button>
      <button class="btn-apuesta empate ${eleccionMia==='X'?'elegida':''} ${cerrado && eleccionMia==='X' ? (real.real==='X'?'acertado':'fallado'):''}"
              onclick="elegir('${id}','X')" ${dis}>
        <span class="empate-label">X</span>
        <span class="equipo-nombre" style="font-size:11px;color:var(--muted)">EMPATE</span>
        <span class="cuota">${cE}</span>
      </button>
      <button class="btn-apuesta ${eleccionMia==='2'?'elegida':''} ${cerrado && eleccionMia==='2' ? (real.real==='2'?'acertado':'fallado'):''}"
              onclick="elegir('${id}','2')" ${dis}>
        <span class="equipo-flag">${visit.f}</span>
        <span class="equipo-nombre">${visit.n}</span>
        <span class="cuota">${cV}</span>
      </button>
    </div>
    ${resultadoPago}
  </div>`;
}

function faseNombre(fase, grupo){
  if(grupo === 'FINAL') return 'FINAL';
  if(grupo === '3°') return '3er Puesto';
  return ({ r32:'Ronda 32', r16:'Octavos', qf:'Cuartos', sf:'Semis' })[fase] || fase;
}
window.elegir = function(partidoId, opcion){
  if(state.pronosticosMios[partidoId] === opcion){
    delete state.pronosticosMios[partidoId];
  } else {
    state.pronosticosMios[partidoId] = opcion;
  }
  state.haEditadoSinGuardar = true;
  renderPartidos();
};

function actualizarFiltrosFase(){
  document.querySelectorAll('#filtros-fase .filtro').forEach(b=>{
    b.classList.toggle('active', b.dataset.fase === state.faseFiltro);
    if(state.jugadorActivo){
      const fase = b.dataset.fase;
      const partidos = fase === 'todos' ? FIXTURE : FIXTURE.filter(p=>p[5] === fase);
      const pendientes = partidos.filter(p=>{
        const id = p[0];
        return !state.resultados[id] && !state.pronosticosMios[id] && !p[3].startsWith('?');
      }).length;
      const labels = { todos:'Todos', grupos:'Grupos', r32:'R32', r16:'Octavos', qf:'Cuartos', sf:'Semis', final:'Final' };
      let badge = '';
      if(pendientes > 0 && fase !== 'todos'){
        badge = ` <span class="pendiente">${pendientes}</span>`;
      }
      b.innerHTML = labels[fase] + badge;
    }
  });
}

document.querySelectorAll('#filtros-fase .filtro').forEach(b=>{
  b.addEventListener('click', ()=>{
    state.faseFiltro = b.dataset.fase;
    renderPartidos();
  });
});

function actualizarBotonGuardar(){
  const btn = document.getElementById('btn-guardar');
  if(!btn) return;
  if(!state.haEditadoSinGuardar){
    btn.textContent = '✓ Selección guardada';
    btn.disabled = true;
    btn.style.opacity = '0.6';
  } else {
    btn.textContent = '💾 Guardar selección';
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

window.guardarSeleccion = async function(){
  if(!state.jugadorActivo) return;
  if(!state.haEditadoSinGuardar){ toast('No hay cambios para guardar'); return }
  
  const btn = document.getElementById('btn-guardar');
  btn.textContent = '💾 Guardando...';
  btn.disabled = true;
  
  try {
    await fbGuardarPronosticos(state.jugadorActivo.id, state.pronosticosMios);
    state.pronosticosGuardados = { ...state.pronosticosMios };
    state.jugadorActivo.pronosticos = state.pronosticosMios;
    state.haEditadoSinGuardar = false;
    await actualizarRanking();
    toast('✓ Pronósticos guardados','success');
    actualizarBotonGuardar();
  } catch(e) {
    console.error(e);
    toast('Error al guardar','error');
    btn.disabled = false;
    btn.textContent = '💾 Guardar selección';
  }
};

function renderRanking(){
  renderUserBars();
  const cont = document.getElementById('lista-ranking');
  const podio = document.getElementById('podio-container');
  if(!cont) return;
  
  if(state.ranking.length === 0){
    cont.innerHTML = '<div class="empty"><div class="ico">📊</div><p>Cargando ranking...</p></div>';
    return;
  }
  
  const lider = state.ranking[0];
  if(lider && lider.aciertos > 0){
    podio.innerHTML = `<div class="podio-top">
      <div class="lider">🏆 LÍDER ACTUAL</div>
      <div class="nombre">${escapeHtml(lider.nombre)}</div>
      <div class="fichas">${lider.fichas} fichas</div>
    </div>`;
  } else {
    podio.innerHTML = '';
  }
  
  cont.innerHTML = state.ranking.map((r,i)=>{
    const posClass = i===0 ? 'p1' : (i===1 ? 'p2' : (i===2 ? 'p3' : ''));
    const yo = state.jugadorActivo && r.id === state.jugadorActivo.id ? 'yo' : '';
    const tag = r.pago 
      ? '<span class="pago-tag">PAGÓ</span>' 
      : '<span class="nopago-tag">DEBE</span>';
    return `<div class="ranking-row ${yo}">
      <div class="ranking-pos ${posClass}">${i+1}</div>
      <div class="ranking-info">
        <div class="ranking-nombre">${escapeHtml(r.nombre)} ${tag}</div>
        <div class="ranking-stats">${r.aciertos} aciertos · ${r.fallados} fallos · ${r.pendientes} pendientes</div>
      </div>
      <div class="ranking-fichas">${r.fichas}</div>
    </div>`;
  }).join('');
}

window.pagar = function(){
  window.open(MP_LINK,'_blank');
  toast('💳 Abriendo Mercado Pago...','info');
};

function checkAdminFromURL(){
  const params = new URLSearchParams(window.location.search);
  const k = params.get('admin');
  if(k === ADMIN_PASSWORD){
    state.isAdmin = true;
    sessionStorage.setItem('prode_admin','1');
  } else if(sessionStorage.getItem('prode_admin')==='1'){
    state.isAdmin = true;
  }
  aplicarVisibilidadAdmin();
}

window.toggleAdmin = function(){
  if(state.isAdmin){
    if(!confirm('¿Salir del modo admin?')) return;
    state.isAdmin = false;
    sessionStorage.removeItem('prode_admin');
    aplicarVisibilidadAdmin();
    toast('Modo admin desactivado');
  } else {
    const k = prompt('🔐 Clave de admin:');
    if(k === ADMIN_PASSWORD){
      state.isAdmin = true;
      sessionStorage.setItem('prode_admin','1');
      aplicarVisibilidadAdmin();
      toast('Modo admin activado','success');
    } else if(k !== null){
      toast('Clave incorrecta','error');
    }
  }
};

function aplicarVisibilidadAdmin(){
  document.querySelectorAll('.solo-admin').forEach(el=>{
    el.style.display = state.isAdmin ? '' : 'none';
  });
  const btn = document.getElementById('btn-admin');
  if(btn){
    btn.textContent = state.isAdmin ? '🔓 Admin' : '🔒';
    btn.style.background = state.isAdmin ? 'var(--dorado)' : 'rgba(0,0,0,0.3)';
    btn.style.color = state.isAdmin ? 'var(--azul-d)' : 'var(--celeste-l)';
  }
}

window.abrirModoArbitro = function(){
  alert('Próximamente: pantalla de gestión manual.\nLa sincronización automática debería ser suficiente.');
};

window.resetearTodo = async function(){
  if(!state.isAdmin){ toast('Solo admin','error'); return }
  if(!confirm('⚠️ ¿BORRAR TODOS LOS DATOS?\n\nEsto borra pronósticos, pagos, PINs y resultados.\n\nNO se puede deshacer.')) return;
  if(!confirm('¿Estás 100% seguro?')) return;
  
  toast('Reseteando...');
  for(const j of JUGADORES_INICIALES){
    const id = generarId(j);
    await setDoc(doc(db,'jugadores',id),{
      id, nombre:j, pin:'', pago:false,
      pronosticos:{}, fichas:FICHAS_INICIALES,
      fechaCreacion: new Date().toISOString()
    });
  }
  await setDoc(doc(db,'resultados','main'),{ resultados:{} });
  
  localStorage.removeItem('prode_sesion');
  sessionStorage.removeItem('prode_admin');
  setTimeout(()=>location.reload(), 1000);
};

function escapeHtml(s){
  if(typeof s!=='string') return s;
  return s.replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

let toastTimer;
window.toast = function(msg, tipo='info'){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + (tipo==='error'?'error':(tipo==='success'?'success':''));
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('show'), 2800);
};

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js').catch(e=>console.log('SW:',e));
  });
}

function detectarIPhone(){
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
function estaInstalado(){
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function mostrarBannerInstalar(){
  if(estaInstalado()) return;
  if(localStorage.getItem('prode_banner_dismiss')) return;
  setTimeout(()=>{
    const b = document.getElementById('install-banner');
    if(b) b.classList.add('show');
  }, 4000);
}
window.cerrarBannerInstalar = function(){
  document.getElementById('install-banner').classList.remove('show');
  localStorage.setItem('prode_banner_dismiss','1');
};
window.abrirInstrucciones = function(){
  const ios = detectarIPhone();
  alert(ios
    ? '📱 INSTALAR EN iPhone:\n\n1. Tocá Compartir ⬆️ abajo en Safari\n2. Bajá y tocá "Agregar a pantalla de inicio"\n3. Tocá "Agregar"'
    : '📱 INSTALAR LA APP:\n\nEn iPhone: Compartir ⬆️ → "Agregar a pantalla de inicio"\nEn Android Chrome: ⋮ → "Instalar aplicación"');
};

(async function init(){
  checkAdminFromURL();
  
  if(!db){
    document.getElementById('seccion-loading').innerHTML = `
      <div style="padding:40px 20px;text-align:center">
        <div style="font-size:48px">⚠️</div>
        <h2 style="color:var(--dorado);margin:14px 0">Configurá Firebase</h2>
        <p style="color:var(--muted);font-size:14px;line-height:1.6">
          Falta configurar Firebase para que la app funcione.
        </p>
      </div>`;
    return;
  }
  
  await inicializarLogin();
  
  setInterval(()=>{
    if(state.jugadorActivo) window.sincronizarResultados(true);
  }, 5 * 60 * 1000);
  setInterval(actualizarUltimaSync, 30000);
  setInterval(renderInicio, 60000);
})();

const inputPin = document.getElementById('input-pin');
if(inputPin){
  inputPin.addEventListener('keydown', e=>{
    if(e.key === 'Enter') window.intentarLogin();
  });
  inputPin.addEventListener('input', e=>{
    if(e.target.value.length === 4){
      setTimeout(()=>window.intentarLogin(), 200);
    }
  });
}
