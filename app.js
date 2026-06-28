// ============================================================
// PRODE CHAQUIENSE · Torneo 2 · Eliminatorias 2026
// ============================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, getDocs
} from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCq5_wwdc7lipXPqaH6_CYZSIUEFj81yBI",
  authDomain: "prode-mundial-26.firebaseapp.com",
  projectId: "prode-mundial-26",
  storageBucket: "prode-mundial-26.firebasestorage.app",
  messagingSenderId: "112140770068",
  appId: "1:112140770068:web:7c364985a7a4f05b3b0001"
};

const ADMIN_PASS = 'sebasuez26';
const T2_ENTRADA = 40000;
const T2_ALIAS   = 'sebastiansuez.mp';
const PREGUNTA_SECRETA  = '¿A qué nombre corresponde el apodo Anibal?';
const RESPUESTA_SECRETA = 'lucas';

const fbApp = initializeApp(firebaseConfig);
const db    = getFirestore(fbApp);

const EQ = {
  MEX:{n:'México',f:'🇲🇽'}, RSA:{n:'Sudáfrica',f:'🇿🇦'}, KOR:{n:'Corea del Sur',f:'🇰🇷'}, CZE:{n:'Rep. Checa',f:'🇨🇿'},
  CAN:{n:'Canadá',f:'🇨🇦'}, SUI:{n:'Suiza',f:'🇨🇭'}, QAT:{n:'Qatar',f:'🇶🇦'}, BIH:{n:'Bosnia',f:'🇧🇦'},
  BRA:{n:'Brasil',f:'🇧🇷'}, MAR:{n:'Marruecos',f:'🇲🇦'}, HAI:{n:'Haití',f:'🇭🇹'}, SCO:{n:'Escocia',f:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
  USA:{n:'Estados Unidos',f:'🇺🇸'}, PAR:{n:'Paraguay',f:'🇵🇾'}, AUS:{n:'Australia',f:'🇦🇺'}, TUR:{n:'Turquía',f:'🇹🇷'},
  GER:{n:'Alemania',f:'🇩🇪'}, CUW:{n:'Curazao',f:'🇨🇼'}, CIV:{n:'Costa de Marfil',f:'🇨🇮'}, ECU:{n:'Ecuador',f:'🇪🇨'},
  NED:{n:'Países Bajos',f:'🇳🇱'}, JPN:{n:'Japón',f:'🇯🇵'}, TUN:{n:'Túnez',f:'🇹🇳'}, SWE:{n:'Suecia',f:'🇸🇪'},
  BEL:{n:'Bélgica',f:'🇧🇪'}, EGY:{n:'Egipto',f:'🇪🇬'}, IRN:{n:'Irán',f:'🇮🇷'}, NZL:{n:'Nueva Zelanda',f:'🇳🇿'},
  ESP:{n:'España',f:'🇪🇸'}, CPV:{n:'Cabo Verde',f:'🇨🇻'}, KSA:{n:'Arabia Saudita',f:'🇸🇦'}, URU:{n:'Uruguay',f:'🇺🇾'},
  FRA:{n:'Francia',f:'🇫🇷'}, SEN:{n:'Senegal',f:'🇸🇳'}, IRQ:{n:'Irak',f:'🇮🇶'}, NOR:{n:'Noruega',f:'🇳🇴'},
  ARG:{n:'Argentina',f:'🇦🇷'}, ALG:{n:'Argelia',f:'🇩🇿'}, AUT:{n:'Austria',f:'🇦🇹'}, JOR:{n:'Jordania',f:'🇯🇴'},
  POR:{n:'Portugal',f:'🇵🇹'}, COD:{n:'R.D. Congo',f:'🇨🇩'}, UZB:{n:'Uzbekistán',f:'🇺🇿'}, COL:{n:'Colombia',f:'🇨🇴'},
  ENG:{n:'Inglaterra',f:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'}, CRO:{n:'Croacia',f:'🇭🇷'}, GHA:{n:'Ghana',f:'🇬🇭'}, PAN:{n:'Panamá',f:'🇵🇦'},
  SRB:{n:'Serbia',f:'🇷🇸'}, TRI:{n:'Trinidad y Tobago',f:'🇹🇹'}, SLO:{n:'Eslovenia',f:'🇸🇮'}, CMR:{n:'Camerún',f:'🇨🇲'},
  MAL:{n:'Mali',f:'🇲🇱'}, VEN:{n:'Venezuela',f:'🇻🇪'}, ITA:{n:'Italia',f:'🇮🇹'}, DEN:{n:'Dinamarca',f:'🇩🇰'},
  POL:{n:'Polonia',f:'🇵🇱'}, UKR:{n:'Ucrania',f:'🇺🇦'}, HUN:{n:'Hungría',f:'🇭🇺'}, WAL:{n:'Gales',f:'🏴󠁧󠁢󠁷󠁬󠁳󠁿'}
};

// FIXTURE TORNEO 2 — eliminatorias
// Formato: [id, fecha dd/mm, hora HH:MM AR, local, visita, fase, label]
// Equipos con ? = placeholder, se reemplazan cuando se definan los cruces
const FX = [
  // 16AVOS
  ['T1' ,'28/06','16:00','RSA','CAN','r32','16avos'],
  ['T2' ,'29/06','14:00','BRA','JPN','r32','16avos'],
  ['T3' ,'29/06','17:30','GER','PAR','r32','16avos'],
  ['T4' ,'29/06','22:00','NED','MAR','r32','16avos'],
  ['T5' ,'30/06','14:00','CIV','NOR','r32','16avos'],
  ['T6' ,'30/06','18:00','FRA','SWE','r32','16avos'],
  ['T7' ,'30/06','22:00','MEX','ECU','r32','16avos'],
  ['T8' ,'01/07','13:00','ENG','COD','r32','16avos'],
  ['T9' ,'01/07','17:00','BEL','SEN','r32','16avos'],
  ['T10','01/07','21:00','USA','BIH','r32','16avos'],
  ['T11','02/07','16:00','ESP','AUT','r32','16avos'],
  ['T12','02/07','20:00','POR','CRO','r32','16avos'],
  ['T13','03/07','15:00','AUS','EGY','r32','16avos'],
  ['T14','03/07','19:00','ARG','CPV','r32','16avos'],
  ['T15','03/07','22:30','COL','GHA','r32','16avos'],
  ['T16','03/07','00:00','SUI','ALG','r32','16avos'],
  // OCTAVOS
  ['T17','11/07','14:00','?OA','?OB','r16','Octavos'],
  ['T18','11/07','17:00','?OC','?OD','r16','Octavos'],
  ['T19','12/07','14:00','?OE','?OF','r16','Octavos'],
  ['T20','12/07','17:00','?OG','?OH','r16','Octavos'],
  ['T21','13/07','14:00','?OI','?OJ','r16','Octavos'],
  ['T22','13/07','17:00','?OK','?OL','r16','Octavos'],
  ['T23','14/07','14:00','?OM','?ON','r16','Octavos'],
  ['T24','14/07','17:00','?OO','?OP','r16','Octavos'],
  // CUARTOS
  ['T25','17/07','17:00','?QA','?QB','qf','Cuartos'],
  ['T26','17/07','21:00','?QC','?QD','qf','Cuartos'],
  ['T27','18/07','17:00','?QE','?QF','qf','Cuartos'],
  ['T28','18/07','21:00','?QG','?QH','qf','Cuartos'],
  // SEMIS
  ['T29','22/07','17:00','?SA','?SB','sf','Semis'],
  ['T30','22/07','21:00','?SC','?SD','sf','Semis'],
  // FINAL
  ['T31','25/07','17:00','?FA','?FB','final','3er Puesto'],
  ['T32','26/07','17:00','?FC','?FD','final','FINAL'],
];

const S = {
  jugador: null,
  isAdmin: false,
  misPron: {},
  pronGuardados: {},
  resultados: {},
  ranking: [],
  faseFiltro: 'todos',
  soloPendientes: false,
  soloHoy: false,
  dirty: false,
  totalJugadores: 0,
  verJugados: false,
};

function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }

let toastT;
function toast(msg, tipo=''){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast' + (tipo ? ' '+tipo : '');
  el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(()=>el.classList.remove('show'), 2800);
}

function mkId(n){ return n.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,20)||'j' }

function parseFechaPartido(fecha, hora){
  const [dia, mes] = fecha.split('/');
  const [hh, mm]   = hora.split(':');
  return new Date(`2026-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}T${hh}:${mm}:00-03:00`);
}

function esCerrado(p){
  if(S.resultados[p[0]]?.real) return true;
  if(p[3].startsWith('?')||p[4].startsWith('?')) return false;
  const inicio = parseFechaPartido(p[1], p[2]);
  return Date.now() >= inicio.getTime() - 2 * 60 * 1000;
}

function normPron(v){
  if(!v) return {op:null, gL:null, gV:null};
  if(typeof v === 'string') return {op:v, gL:null, gV:null};
  return v;
}

async function fbGetJugadores(){
  const snap = await getDocs(collection(db,'jugadores'));
  return snap.docs.map(d=>d.data());
}
async function fbGetJugador(id){
  const s = await getDoc(doc(db,'jugadores',id));
  return s.exists() ? s.data() : null;
}
async function fbSetJugador(j){ await setDoc(doc(db,'jugadores',j.id),j) }
async function fbUpdatePron2(id, pron2){
  await updateDoc(doc(db,'jugadores',id),{pron2, ts2:new Date().toISOString()});
}
async function fbGetResultados(){
  const s = await getDoc(doc(db,'resultados','t2'));
  return s.exists() ? (s.data().resultados||{}) : {};
}
async function fbSetResultados(r){
  await setDoc(doc(db,'resultados','t2'),{resultados:r, ts:new Date().toISOString()});
}

const SYNC_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';
const N2C = {
  'Mexico':'MEX','South Africa':'RSA','South Korea':'KOR','Czech Republic':'CZE','Czechia':'CZE',
  'Canada':'CAN','Switzerland':'SUI','Qatar':'QAT','Bosnia and Herzegovina':'BIH','Bosnia & Herzegovina':'BIH',
  'Brazil':'BRA','Morocco':'MAR','Haiti':'HAI','Scotland':'SCO',
  'USA':'USA','United States':'USA','Paraguay':'PAR','Australia':'AUS','Türkiye':'TUR','Turkey':'TUR',
  'Germany':'GER','Curaçao':'CUW','Curacao':'CUW','Ivory Coast':'CIV',"Côte d'Ivoire":'CIV','Ecuador':'ECU',
  'Netherlands':'NED','Japan':'JPN','Tunisia':'TUN','Sweden':'SWE',
  'Belgium':'BEL','Egypt':'EGY','Iran':'IRN','New Zealand':'NZL',
  'Spain':'ESP','Cape Verde':'CPV','Cabo Verde':'CPV','Saudi Arabia':'KSA','Uruguay':'URU',
  'France':'FRA','Senegal':'SEN','Iraq':'IRQ','Norway':'NOR',
  'Argentina':'ARG','Algeria':'ALG','Austria':'AUT','Jordan':'JOR',
  'Portugal':'POR','DR Congo':'COD','Uzbekistan':'UZB','Colombia':'COL',
  'England':'ENG','Croatia':'CRO','Ghana':'GHA','Panama':'PAN'
};

async function sincronizar(silencioso=false){
  if(!silencioso) toast('🔄 Sincronizando con openfootball...');
  try{
    const res = await fetch(SYNC_URL,{cache:'no-store'});
    if(!res.ok) throw new Error(res.status);
    const data = await res.json();
    let n=0;
    (data.matches||[]).forEach(m=>{
      if(!m.score?.ft) return;
      const c1=N2C[m.team1], c2=N2C[m.team2];
      if(!c1||!c2) return;
      const p=FX.find(x=>(x[3]===c1&&x[4]===c2)||(x[3]===c2&&x[4]===c1));
      if(!p) return;
      const lp=p[3]===c1;
      const gL=lp?m.score.ft[0]:m.score.ft[1];
      const gV=lp?m.score.ft[1]:m.score.ft[0];
      const real=gL>gV?'1':(gL<gV?'2':'X');
      const prev=S.resultados[p[0]];
      if(prev?.manual && prev.real===real) return;
      if(!prev || prev.real!==real || prev.gL!==gL || prev.gV!==gV){
        S.resultados[p[0]]={real,gL,gV};
        n++;
      }
    });
    if(n>0){ await fbSetResultados(S.resultados); await recalcRanking(); renderPartidos(); }
    if(!silencioso) toast(n>0?`✓ ${n} resultados actualizados`:'✓ Todo al día','success');
  }catch(e){
    if(!silencioso) toast('Error al sincronizar (openfootball puede no haber cargado aún)','error');
  }
}

// Historial de un país en el Mundial (desde openfootball: grupos + eliminatorias)
let _histCache = null;
async function getHistorialFeed(){
  if(_histCache) return _histCache;
  const res = await fetch(SYNC_URL,{cache:'no-store'});
  if(!res.ok) throw new Error(res.status);
  _histCache = await res.json();
  return _histCache;
}

async function verHistorialPais(code){
  const EQinfo = EQ[code];
  if(!EQinfo){ toast('Equipo no disponible','error'); return; }
  const nombre = EQinfo.n;
  const ov=document.createElement('div');
  ov.id='modal-historial';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;overflow-y:auto;padding:20px 12px';
  ov.innerHTML=`<div style="max-width:560px;margin:0 auto;background:var(--bg2,#10182a);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px">
    <h3 style="margin:0 0 4px;color:var(--dorado,#f5b800);font-family:var(--condensed)">${EQinfo.f} ${esc(nombre)} · EN EL MUNDIAL</h3>
    <div id="hist-cuerpo" style="font-size:13px;color:#9fb3cc;margin-top:10px">Cargando partidos...</div>
    <button class="btn-grande btn-secundario" data-action="cerrar-historial" style="margin-top:14px;width:100%">Cerrar</button>
  </div>`;
  ov.addEventListener('click',ev=>{ if(ev.target===ov) ov.remove(); });
  document.body.appendChild(ov);

  try{
    const data = await getHistorialFeed();
    const ms = (data.matches||[]).filter(m=>{
      const c1=N2C[m.team1], c2=N2C[m.team2];
      return (c1===code||c2===code) && m.score?.ft;
    });
    const cuerpo = document.getElementById('hist-cuerpo');
    if(!cuerpo) return;
    if(!ms.length){ cuerpo.innerHTML='<div style="padding:14px 0;text-align:center">Todavía no hay partidos jugados de este equipo en el torneo.</div>'; return; }
    cuerpo.innerHTML = ms.map(m=>{
      const c1=N2C[m.team1], c2=N2C[m.team2];
      const esLocal = c1===code;
      const rival = esLocal ? c2 : c1;
      const rivalInfo = EQ[rival]||{n:(esLocal?m.team2:m.team1),f:'🌍'};
      const gf = esLocal ? m.score.ft[0] : m.score.ft[1];
      const gc = esLocal ? m.score.ft[1] : m.score.ft[0];
      const res = gf>gc?'G':(gf<gc?'P':'E');
      const color = res==='G'?'#2ecc71':(res==='P'?'#e74c3c':'#9fb3cc');
      const etiqueta = m.group ? esc(m.group) : (m.round?esc(m.round):'');
      const fechaTxt = m.date ? m.date.split('-').reverse().slice(0,2).join('/') : '';
      return `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="color:${color};font-weight:800;width:16px">${res}</span>
          <span style="color:#dfe9f5">vs ${rivalInfo.f} ${esc(rivalInfo.n)}</span>
        </div>
        <div style="text-align:right">
          <div style="color:#fff;font-weight:700">${gf}-${gc}</div>
          <div style="font-size:10px;color:#7d8da3">${etiqueta}${fechaTxt?' · '+fechaTxt:''}</div>
        </div>
      </div>`;
    }).join('');
  }catch(e){
    const cuerpo=document.getElementById('hist-cuerpo');
    if(cuerpo) cuerpo.innerHTML='<div style="padding:14px 0;text-align:center;color:#e74c3c">No se pudo cargar el historial (openfootball no disponible).</div>';
  }
}

// CALCULO 3+3 — sin cuotas
// Regla: resultado a los 120 min. Penales = empate. Alargue ganado = ese equipo gana.
function calcPuntos(j){
  let puntos=0, aciertos=0, exactos=0, fallados=0, pendientes=0;
  const pron = j.pron2||{};
  FX.forEach(p=>{
    const r = S.resultados[p[0]];
    if(r?.real){
      const ap = normPron(pron[p[0]]);
      if(ap.op && ap.op === r.real){
        puntos += 3; aciertos++;
        if(ap.gL!==null && ap.gV!==null && ap.gL===r.gL && ap.gV===r.gV){ puntos+=3; exactos++; }
      } else if(ap.op){ fallados++; }
    } else {
      const ap = normPron(pron[p[0]]);
      if(!p[3].startsWith('?')&&!p[4].startsWith('?')&&!esCerrado(p)&&!ap.op) pendientes++;
    }
  });
  return { puntos, aciertos, exactos, fallados, pendientes };
}

async function recalcRanking(){
  const todos = await fbGetJugadores();
  S.totalJugadores = todos.length;
  S.ranking = todos.map(j=>({id:j.id, nombre:j.nombre, pagoT2:!!j.pagoT2, ...calcPuntos(j)}))
    .sort((a,b)=>{
      if(a.pagoT2&&!b.pagoT2) return -1;
      if(!a.pagoT2&&b.pagoT2) return 1;
      return b.puntos-a.puntos||b.exactos-a.exactos||b.aciertos-a.aciertos;
    });
  renderRanking();
  renderUserBars();
  actualizarPozo();
}

function actualizarPozo(){
  const el = document.getElementById('pozo-monto');
  if(!el) return;
  const n = S.ranking.filter(r=>r.pagoT2).length;
  el.textContent = `$${(n * T2_ENTRADA).toLocaleString('es-AR')}`;
}

function renderUserBars(){
  const el = document.getElementById('user-info');
  if(!el||!S.jugador) return;
  const yo = S.ranking.find(r=>r.id===S.jugador.id);
  if(!yo) return;
  const pagados = S.ranking.filter(r=>r.pagoT2);
  const pos = yo.pagoT2 ? pagados.findIndex(r=>r.id===S.jugador.id)+1 : 0;
  el.innerHTML = `<span style="color:var(--celeste)">${esc(S.jugador.nombre.split(' ')[0])}</span>`
    + (yo.pagoT2
      ? `<span style="color:var(--dorado)"> · ${yo.puntos} pts${pos>0?' · '+pos+'°':''}</span>`
      : `<span style="color:#e74c3c;font-size:12px"> · DEBE</span>`);
}

function renderInicio(){
  renderUserBars();
  actualizarPozo();
  const cardHoy = document.getElementById('card-hoy');
  if(cardHoy){
    try{
      const ahoraAR = new Date(Date.now()-3*60*60*1000);
      const hoyStr = String(ahoraAR.getUTCDate()).padStart(2,'0')+'/'+String(ahoraAR.getUTCMonth()+1).padStart(2,'0');
      const deHoy = FX.filter(p=>p[1]===hoyStr&&!p[3].startsWith('?')&&!p[4].startsWith('?'));
      const faltan = deHoy.filter(p=>!esCerrado(p)&&!normPron(S.misPron[p[0]]).op).length;
      cardHoy.innerHTML = deHoy.length
        ? `<div class="card" data-action="ir-hoy" style="cursor:pointer;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px"><div><div style="font-family:var(--condensed);font-weight:700;font-size:15px;letter-spacing:0.5px;color:var(--dorado,#f5b800)">📅 PARTIDOS DE HOY · ${deHoy.length}</div><div style="font-size:13px;color:${faltan?'#e74c3c':'#9fb3cc'};margin-top:2px">${faltan?`Te faltan ${faltan} pronósticos ⚠️`:'✅ Ya pronosticaste todos'}</div></div><div style="font-size:22px;color:var(--celeste,#74acdf)">›</div></div>`
        : '';
    }catch(e){}
  }
  const pagoArea = document.getElementById('pago-area');
  if(pagoArea&&S.jugador){
    const yo = S.ranking.find(r=>r.id===S.jugador.id);
    pagoArea.innerHTML = yo?.pagoT2
      ? `<div class="card" style="text-align:center;margin-bottom:12px"><div style="color:var(--verde);font-family:var(--condensed);font-weight:700;font-size:16px;letter-spacing:0.5px;margin-bottom:10px">✅ Estás en el Torneo 2</div><button data-action="revertir-pago-t2" style="width:100%;background:transparent;color:#e74c3c;border:1px solid rgba(231,76,60,0.4);border-radius:10px;padding:10px;font-size:13px;font-weight:700;cursor:pointer">Me equivoqué · sacar mi pago</button></div>`
      : `<div class="card" style="text-align:center;margin-bottom:12px;border:1px solid #e74c3c"><div style="color:#e74c3c;font-family:var(--condensed);font-weight:700;font-size:16px;margin-bottom:10px">⚠️ Aún no te anotaste</div><div style="font-size:13px;color:#9fb3cc;margin-bottom:10px">Transferí $${T2_ENTRADA.toLocaleString('es-AR')} al alias <b style="color:#fff">${T2_ALIAS}</b></div><button class="btn-grande btn-dorado" data-action="marcar-pago-t2">✅ Ya transferí · Anotarme</button></div>`;
  }
}

function renderRanking(){
  renderUserBars();
  const cont  = document.getElementById('lista-ranking');
  const podio = document.getElementById('podio-container');
  if(!cont) return;
  const pagados = S.ranking.filter(r=>r.pagoT2);
  if(!S.ranking.length){
    cont.innerHTML='<div class="empty"><div class="ico">📊</div><p>Cargando...</p></div>';
    return;
  }
  const lider = pagados[0];
  if(podio) podio.innerHTML = lider&&lider.puntos>0
    ? `<div class="podio-top"><div class="lider">🏆 LÍDER ACTUAL</div><div class="nombre">${esc(lider.nombre)}</div><div class="fichas">${lider.puntos} puntos</div></div>`
    : '';
  cont.innerHTML = S.ranking.map((r,i)=>{
    const pc = i===0&&r.pagoT2?'p1':i===1&&r.pagoT2?'p2':i===2&&r.pagoT2?'p3':'';
    const yo = S.jugador&&r.id===S.jugador.id?' yo':'';
    const tag = r.pagoT2
      ? `<span class="pago-tag"${S.isAdmin?` data-action="toggle-pago-admin" data-id="${r.id}" style="cursor:pointer;text-decoration:underline dotted"`:''}>${S.isAdmin?'INSCRIPTO ✎':'INSCRIPTO'}</span>`
      : `<span class="nopago-tag"${S.isAdmin?` data-action="toggle-pago-admin" data-id="${r.id}" style="cursor:pointer;text-decoration:underline dotted"`:''}>${S.isAdmin?'DEBE ✎':'DEBE'}</span>`;
    const pos = r.pagoT2 ? `${pagados.findIndex(x=>x.id===r.id)+1}` : '—';
    return `<div class="ranking-row${yo}" data-action="ver-pronosticos" data-id="${r.id}" style="cursor:pointer">
      <div class="ranking-pos ${pc}">${pos}</div>
      <div class="ranking-info">
        <div class="ranking-nombre">${esc(r.nombre)} ${tag}</div>
        <div class="ranking-stats">${r.aciertos}/${r.aciertos+r.fallados} aciertos · ${r.exactos} exactos · ${r.pendientes} pendientes</div>
      </div>
      <div class="ranking-fichas">${r.pagoT2?r.puntos+' pts':'—'}</div>
    </div>`;
  }).join('');
}

function htmlPartido(p){
  const [id,fecha,hora,lc,vc,fase,label] = p;
  const ph = lc.startsWith('?')||vc.startsWith('?');
  const L  = EQ[lc]||{n:lc.replace(/\?/g,'').replace(/[A-Z0-9]/g,'')||'Por definir',f:'❓'};
  const V  = EQ[vc]||{n:vc.replace(/\?/g,'').replace(/[A-Z0-9]/g,'')||'Por definir',f:'❓'};
  const cerrado = esCerrado(p);
  const mia  = normPron(S.misPron[id]);
  const real = S.resultados[id];

  const clase = cerrado
    ? (real?.real ? (mia.op===real.real?'acertado':(mia.op?'fallado':'cerrado')) : 'cerrado')
    : (mia.op?'guardado':'');

  const gt = ({r32:'16avos',r16:'Octavos',qf:'Cuartos',sf:'Semis'})[fase]||(label==='FINAL'?'FINAL':'3er Puesto');
  const rtag = real ? `<span class="resultado-real">${real.gL}-${real.gV}</span>` : '';

  let pago='';
  if(cerrado&&!real?.real){
    pago=`<div class="partido-resultado-pago" style="background:rgba(116,172,223,0.12);color:var(--celeste,#74acdf)">🔴 EN JUEGO · el resultado se carga al terminar</div>`;
  } else if(cerrado&&real?.real&&mia.op){
    if(mia.op===real.real){
      pago = (mia.gL!==null&&mia.gV!==null&&mia.gL===real.gL&&mia.gV===real.gV)
        ? `<div class="partido-resultado-pago gano">⭐ EXACTO · +6 puntos</div>`
        : `<div class="partido-resultado-pago gano">✓ Acertaste · +3 puntos</div>`;
    } else {
      pago=`<div class="partido-resultado-pago perdio">✗ Fallaste · 0 puntos</div>`;
    }
  } else if(cerrado&&real?.real&&!mia.op){
    pago=`<div class="partido-resultado-pago perdio">✗ No pronosticaste · 0 puntos</div>`;
  }

  const dis = (cerrado||ph)?'disabled':'';
  const btnCls=(op)=>{
    let c='btn-apuesta'+(op==='X'?' empate':'');
    if(mia.op===op) c+=' elegida';
    if(cerrado&&mia.op===op&&real?.real) c+=real.real===op?' acertado':' fallado';
    return c;
  };

  const scoreHtml = (!cerrado&&!ph) ? `
    <div class="score-exacto">
      <span class="score-lbl">Resultado exacto (opcional · +3 pts extra):</span>
      <div class="score-row">
        <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="?" class="score-in" data-score-id="${id}" data-campo="gL" value="${mia.gL!==null?mia.gL:''}">
        <span class="score-guion">-</span>
        <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="?" class="score-in" data-score-id="${id}" data-campo="gV" value="${mia.gV!==null?mia.gV:''}">
      </div>
    </div>` : ((mia.gL!==null&&mia.gV!==null) ? `
    <div class="score-exacto"><span class="score-lbl">Tu resultado exacto:</span>
      <div class="score-row">
        <span class="score-in" style="display:flex;align-items:center;justify-content:center">${mia.gL}</span>
        <span class="score-guion">-</span>
        <span class="score-in" style="display:flex;align-items:center;justify-content:center">${mia.gV}</span>
      </div></div>` : '');

  const reglaNota = (!cerrado&&!ph) ? `<div style="font-size:10px;color:#7d8da3;text-align:center;margin-top:4px">Pronóstico a los 120 min · Penales = Empate</div>` : '';

  return `<div class="partido ${clase}">
    <div class="partido-meta">
      <span data-action="ver-todos-pron" data-id="${id}" style="cursor:pointer"><span class="grupo">${gt}</span> · ${fecha} ${hora}hs <span style="font-size:11px;color:var(--celeste,#74acdf)">👁️ ver todos</span></span>
      ${rtag}
    </div>
    <div class="apuestas-3">
      <button class="${btnCls('1')}" data-apuesta data-id="${id}" data-op="1" ${dis}>
        <span class="equipo-flag">${L.f}</span><span class="equipo-nombre">${L.n}</span>${!ph?`<span data-action="ver-historial" data-code="${lc}" style="font-size:11px;margin-left:4px;opacity:0.7">📊</span>`:''}
      </button>
      <button class="${btnCls('X')}" data-apuesta data-id="${id}" data-op="X" ${dis}>
        <span class="equipo-flag">🤝</span><span class="equipo-nombre">Empate</span>
      </button>
      <button class="${btnCls('2')}" data-apuesta data-id="${id}" data-op="2" ${dis}>
        <span class="equipo-flag">${V.f}</span><span class="equipo-nombre">${V.n}</span>${!ph?`<span data-action="ver-historial" data-code="${vc}" style="font-size:11px;margin-left:4px;opacity:0.7">📊</span>`:''}
      </button>
    </div>
    ${scoreHtml}${reglaNota}${pago}
  </div>`;
}

function htmlPartidoAjeno(p, jug){
  const [id,fecha,hora,lc,vc,fase,label] = p;
  const ph = lc.startsWith('?')||vc.startsWith('?');
  const L  = EQ[lc]||{n:lc,f:'❓'};
  const V  = EQ[vc]||{n:vc,f:'❓'};
  const cerrado = esCerrado(p);
  const real = S.resultados[id];
  const pron = normPron((jug.pron2||{})[id]);
  const gt = ({r32:'16avos',r16:'Octavos',qf:'Cuartos',sf:'Semis'})[fase]||(label==='FINAL'?'FINAL':'3er Puesto');
  const faseProtegida = (fase==='sf' || fase==='final'); // semis en adelante: revelar al arranque
  const visible = faseProtegida ? (cerrado||!!real?.real) : true;

  if(!visible) return `<div class="partido cerrado">
    <div class="partido-meta"><span class="grupo">${gt}</span> · ${fecha} ${hora}hs</div>
    <div style="text-align:center;padding:12px;font-size:13px;color:var(--muted)">🔒 Se revela al arranque del partido</div>
  </div>`;

  const lbl = pron.op ? ({'1':L.n,'X':'Empate','2':V.n}[pron.op]) : null;
  let estado='';
  if(real?.real&&pron.op){
    const ok=pron.op===real.real;
    const ex=ok&&pron.gL!==null&&pron.gV!==null&&pron.gL===real.gL&&pron.gV===real.gV;
    estado=ex?'⭐':ok?'✓':'✗';
  }
  const clase = real?.real ? (pron.op===real.real?'acertado':(pron.op?'fallado':'cerrado')) : (pron.op?'guardado':'cerrado');

  return `<div class="partido ${clase}">
    <div class="partido-meta"><span class="grupo">${gt}</span> · ${fecha} ${hora}hs ${real?`<span class="resultado-real">${real.gL}-${real.gV}</span>`:''}</div>
    ${pron.op
      ? `<div style="text-align:center;padding:10px;font-size:14px;font-weight:700;color:#dfe9f5">${estado} ${esc(lbl)}${pron.gL!==null&&pron.gV!==null?` · <b>${pron.gL}-${pron.gV}</b>`:''}</div>`
      : `<div style="text-align:center;padding:10px;font-size:13px;color:#7d8da3;font-style:italic">sin pronóstico</div>`
    }
  </div>`;
}

function renderPartidos(){
  const cont = document.getElementById('lista-partidos');
  if(!cont) return;

  let lista = FX.filter(p=>{
    if(S.faseFiltro!=='todos'&&p[5]!==S.faseFiltro) return false;
    return true;
  });

  if(S.soloPendientes) lista=lista.filter(p=>!esCerrado(p)&&!normPron(S.misPron[p[0]]).op&&!p[3].startsWith('?')&&!p[4].startsWith('?'));

  if(S.soloHoy){
    const ahoraAR=new Date(Date.now()-3*60*60*1000);
    const hoyStr=String(ahoraAR.getUTCDate()).padStart(2,'0')+'/'+String(ahoraAR.getUTCMonth()+1).padStart(2,'0');
    lista=lista.filter(p=>p[1]===hoyStr);
  }

  const enJuego=lista.filter(p=>esCerrado(p)&&!S.resultados[p[0]]?.real&&!p[3].startsWith('?')&&!p[4].startsWith('?'));
  const jugados=lista.filter(p=>S.resultados[p[0]]?.real);
  const jugadosIds=new Set(jugados.map(p=>p[0]));
  const enJuegoIds=new Set(enJuego.map(p=>p[0]));
  const proximos=lista.filter(p=>!jugadosIds.has(p[0])&&!enJuegoIds.has(p[0]));

  let html='';

  if(jugados.length&&!S.verJugados){
    html+=`<div data-action="ir-a-jugados" style="display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;margin-bottom:14px;border:1px dashed #9fb3cc;border-radius:10px;font-size:13px;color:#9fb3cc;cursor:pointer">▼ Ver ${jugados.length} partidos jugados</div>`;
  }

  if(enJuego.length){
    html+=`<div class="fecha-divider" style="color:var(--celeste,#74acdf)">🔴 EN JUEGO</div>`;
    enJuego.forEach(p=>{ html+=htmlPartido(p); });
  }

  if(proximos.length){
    const porFecha={};
    proximos.forEach(p=>{ (porFecha[p[1]]||(porFecha[p[1]]=[])).push(p); });
    Object.entries(porFecha).forEach(([fecha,ps])=>{
      html+=`<div class="fecha-divider">${fecha}</div>`;
      ps.forEach(p=>{ html+=htmlPartido(p); });
    });
  } else if(!enJuego.length&&!jugados.length){
    html='<div class="empty"><div class="ico">⚽</div><p>Sin partidos para mostrar</p></div>';
  }

  if(jugados.length){
    const jugadosOrden=[...jugados].sort((a,b)=>parseFechaPartido(b[1],b[2]).getTime()-parseFechaPartido(a[1],a[2]).getTime());
    html+=`<div id="seccion-jugados"></div>`;
    html+=`<button data-action="toggle-jugados" style="width:100%;margin:14px 0 4px;background:transparent;border:1px dashed #9fb3cc;color:#9fb3cc;border-radius:10px;padding:11px;font-size:13px;font-weight:700;cursor:pointer">${S.verJugados?'▲ Ocultar partidos jugados':`▼ Ver partidos jugados (${jugados.length})`}</button>`;
    if(S.verJugados){
      html+=`<div>`;
      jugadosOrden.forEach(p=>{ html+=htmlPartido(p); });
      html+=`</div>`;
    }
  }

  cont.innerHTML=html;
  actualizarBotonGuardar();
  // marcar visualmente los toggles activos
  const bH=document.getElementById('btn-hoy');
  const bP=document.getElementById('btn-pendientes');
  if(bH){ bH.style.background=S.soloHoy?'var(--celeste,#74acdf)':'transparent'; bH.style.color=S.soloHoy?'#0a1226':'var(--celeste,#74acdf)'; }
  if(bP){ bP.style.background=S.soloPendientes?'var(--celeste,#74acdf)':'transparent'; bP.style.color=S.soloPendientes?'#0a1226':'var(--celeste,#74acdf)'; }
  // marcar filtro de fase activo
  document.querySelectorAll('#filtros-fase .filtro').forEach(b=>{
    b.classList.toggle('active', b.dataset.fase===S.faseFiltro);
  });
}

async function verTodosPronosticos(id){
  const p=FX.find(x=>x[0]===id); if(!p) return;
  const cerrado=esCerrado(p); const real=S.resultados[id];
  const faseProtegida=(p[5]==='sf' || p[5]==='final'); // semis en adelante: revelar al arranque
  const visible=faseProtegida ? (cerrado||!!real?.real) : true;
  const L=EQ[p[3]]||{n:p[3],f:'❓'}; const V=EQ[p[4]]||{n:p[4],f:'❓'};
  const eq=`${L.n} - ${V.n}`;
  const ov=document.createElement('div');
  ov.id='modal-todospron';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;overflow-y:auto;padding:20px 12px';
  let cuerpo;
  if(!visible){
    cuerpo=`<div style="text-align:center;padding:40px 10px;color:#9fb3cc">🔒 Los pronósticos se revelan cuando arranque el partido</div>`;
  } else {
    const jugadores=await fbGetJugadores();
    const filas=jugadores.map(j=>{
      const ap=normPron((j.pron2||{})[id]);
      if(!ap.op) return {nombre:j.nombre,vacio:true};
      const lbl={'1':L.n,'X':'Empate','2':V.n}[ap.op];
      const exacto=ap.gL!==null&&ap.gV!==null;
      let estado='';
      if(real?.real){ const ok=ap.op===real.real; const ex=ok&&exacto&&ap.gL===real.gL&&ap.gV===real.gV; estado=ex?'⭐':ok?'✓':'✗'; }
      return {nombre:j.nombre,lbl,marcador:exacto?`${ap.gL}-${ap.gV}`:'',estado};
    });
    filas.sort((a,b)=>(a.vacio?1:0)-(b.vacio?1:0)||a.nombre.localeCompare(b.nombre));
    const filaHtml=f=>f.vacio
      ?`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#7d8da3;font-size:13px"><span>${esc(f.nombre)}</span><span style="font-style:italic">sin pronóstico</span></div>`
      :`<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px"><span style="color:#dfe9f5">${f.estado} ${esc(f.nombre)}</span><span style="color:#9fb3cc;text-align:right">${esc(f.lbl)}${f.marcador?` · <b style="color:#dfe9f5">${f.marcador}</b>`:''}</span></div>`;
    const rtxt=real?.real?`<div style="font-size:13px;color:var(--dorado,#f5b800);margin-bottom:8px">Resultado: ${real.gL}-${real.gV}</div>`:(cerrado?'<div style="font-size:13px;color:var(--celeste,#74acdf);margin-bottom:8px">🔴 En juego</div>':'');
    cuerpo=rtxt+filas.map(filaHtml).join('');
  }
  ov.innerHTML=`<div style="max-width:620px;margin:0 auto;background:var(--bg2,#10182a);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px">
    <h3 style="margin:0 0 4px;color:var(--dorado,#f5b800);font-family:var(--condensed)">PRONÓSTICOS DEL FORO</h3>
    <div style="font-size:14px;color:#dfe9f5;margin-bottom:12px">${esc(eq)}</div>${cuerpo}
    <button class="btn-grande btn-secundario" data-action="cerrar-todospron" style="margin-top:14px;width:100%">Cerrar</button>
  </div>`;
  ov.addEventListener('click',ev=>{ if(ev.target===ov) ov.remove(); });
  document.body.appendChild(ov);
}

async function verPronosticosJugador(id){
  const j=await fbGetJugador(id); if(!j) return;
  const pts=S.ranking.find(r=>r.id===id);
  const cont=document.getElementById('lista-ranking'); if(!cont) return;
  cont.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;cursor:pointer" data-action="cerrar-pronosticos-ajenos">
      <span style="color:var(--celeste)">← Volver al ranking</span>
    </div>
    <div style="font-size:16px;font-weight:700;margin-bottom:4px">${esc(j.nombre)}</div>
    <div style="font-size:13px;color:#9fb3cc;margin-bottom:14px">${pts?pts.puntos+' pts · '+pts.aciertos+' aciertos · '+pts.exactos+' exactos':''}</div>
    ${FX.map(p=>htmlPartidoAjeno(p,j)).join('')}
  `;
}

async function guardarSeleccion(){
  if(!S.jugador){ toast('Iniciá sesión','error'); return; }
  const btn=document.getElementById('btn-guardar');
  if(btn){ btn.disabled=true; btn.textContent='Guardando...'; }
  try{
    await fbUpdatePron2(S.jugador.id, S.misPron);
    S.pronGuardados=JSON.parse(JSON.stringify(S.misPron));
    S.dirty=false;
    actualizarBotonGuardar();
    toast('✓ Guardado','success');
    await recalcRanking();
    renderPartidos();
  }catch(e){ toast('Error al guardar','error'); }
  finally{ if(btn){ btn.disabled=false; btn.textContent='Guardar pronósticos'; } }
}

function actualizarBotonGuardar(){
  const btn=document.getElementById('btn-guardar');
  if(!btn) return;
  btn.style.display=S.dirty?'block':'none';
}

function actualizarBotonesApuesta(id, op){
  document.querySelectorAll(`[data-apuesta][data-id="${id}"]`).forEach(btn=>{
    btn.classList.toggle('elegida', btn.dataset.op===op);
  });
}

function cargarResultadoManual(){
  if(!S.isAdmin){ toast('Solo admin','error'); return; }
  const candidatos=FX.filter(p=>esCerrado(p)&&!p[3].startsWith('?')&&!p[4].startsWith('?'))
    .sort((a,b)=>parseFechaPartido(b[1],b[2])-parseFechaPartido(a[1],a[2]));
  if(!candidatos.length){ toast('No hay partidos cerrados','error'); return; }
  const filas=candidatos.map(p=>{
    const r=S.resultados[p[0]];
    const eq=`${EQ[p[3]]?.n||p[3]} - ${EQ[p[4]]?.n||p[4]}`;
    const estado=r?.real?`<span style="color:#2ecc71;font-weight:700">${r.gL}-${r.gV} ✓</span>`:`<span style="color:#9fb3cc">sin cargar</span>`;
    return `<div data-action="cargar-res-partido" data-id="${p[0]}" style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 8px;border-bottom:1px solid rgba(255,255,255,0.07);cursor:pointer">
      <div><div style="font-size:14px;color:#dfe9f5">${esc(eq)}</div><div style="font-size:11px;color:#7d8da3">${p[1]} ${p[2]}hs</div></div>
      <div style="font-size:13px;white-space:nowrap">${estado}</div>
    </div>`;
  }).join('');
  const ov=document.createElement('div');
  ov.id='modal-cargares';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;overflow-y:auto;padding:20px 12px';
  ov.innerHTML=`<div style="max-width:620px;margin:0 auto;background:var(--bg2,#10182a);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px">
    <h3 style="margin:0 0 4px;color:var(--dorado,#f5b800);font-family:var(--condensed)">⚽ CARGAR RESULTADO</h3>
    <div style="font-size:12px;color:#9fb3cc;margin-bottom:12px">Tocá el partido que querés cargar o corregir (${candidatos.length} cerrados). Si el partido fue a penales, cargá el resultado al final del alargue (empate).</div>
    <div>${filas}</div>
    <button class="btn-grande btn-secundario" data-action="cerrar-cargares" style="margin-top:14px;width:100%">Cerrar</button>
  </div>`;
  ov.addEventListener('click',ev=>{ if(ev.target===ov) ov.remove(); });
  document.body.appendChild(ov);
}

function cargarResPartido(id){
  const p=FX.find(x=>x[0]===id); if(!p){ toast('Partido no encontrado','error'); return; }
  const eq=`${EQ[p[3]]?.n||p[3]} - ${EQ[p[4]]?.n||p[4]}`;
  const r=S.resultados[id];
  const marc=prompt(`Resultado FINAL de ${eq}\nFormato: golesLocal-golesVisitante\nSi fue a penales, ingresá el resultado del alargue (empate si no hubo goles extra)`, r?`${r.gL}-${r.gV}`:'');
  if(marc===null) return;
  const m=marc.trim().match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
  if(!m){ toast('Formato inválido. Ej: 2-1','error'); return; }
  const gL=parseInt(m[1]), gV=parseInt(m[2]);
  const real=gL>gV?'1':(gL<gV?'2':'X');
  if(!confirm(`Confirmar: ${eq} terminó ${gL}-${gV}?\nEsto liquida los puntos de todos.`)) return;
  S.resultados[id]={real,gL,gV,manual:true};
  fbSetResultados(S.resultados).then(()=>recalcRanking()).then(()=>{
    renderPartidos();
    toast(`✓ ${eq}: ${gL}-${gV} cargado`,'success');
    document.getElementById('modal-cargares')?.remove();
  });
}

async function editarPronosticoAdmin(){
  if(!S.isAdmin){ toast('Solo admin','error'); return; }
  const jgs=await fbGetJugadores();
  const lista=jgs.map((j,i)=>`${i+1}. ${j.nombre}`).join('\n');
  const selJ=prompt(`¿A qué jugador le editás un pronóstico?\n${lista}`);
  const nJ=parseInt(selJ);
  if(!nJ||nJ<1||nJ>jgs.length){ if(selJ!==null) toast('Número inválido','error'); return; }
  const jug=jgs[nJ-1];
  const idP=(prompt(`Jugador: ${jug.nombre}\nID del partido (ej: T1):`)||'').trim().toUpperCase();
  const p=FX.find(x=>x[0]===idP); if(!p){ toast('Partido inexistente','error'); return; }
  const eq=`${EQ[p[3]]?.n||p[3]} - ${EQ[p[4]]?.n||p[4]}`;
  const actual=(jug.pron2||{})[idP];
  const marc=prompt(`${jug.nombre} · ${eq}\nActual: ${actual?JSON.stringify(actual):'NINGUNO'}\n\nIngresá golesLocal-golesVisita (ej: 2-1)`);
  if(marc===null) return;
  const m=marc.trim().match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
  if(!m){ toast('Formato inválido','error'); return; }
  const gL=parseInt(m[1]), gV=parseInt(m[2]);
  const op=gL>gV?'1':(gL<gV?'2':'X');
  if(!confirm(`Cargar para ${jug.nombre} en ${eq}:\n${gL}-${gV}\nQueda registrado como edición de admin. ¿Confirmás?`)) return;
  const pron2=jug.pron2||{};
  pron2[idP]={op,gL,gV,adminEdit:true,adminTs:new Date().toISOString()};
  await fbUpdatePron2(jug.id,pron2);
  await recalcRanking();
  renderPartidos();
  toast(`✓ ${jug.nombre}: ${eq} ${gL}-${gV} cargado`,'success');
}

async function marcarPagoT2(){
  if(!S.jugador){ toast('Iniciá sesión primero','error'); return; }
  if(!confirm(`¿Confirmás que transferiste $${T2_ENTRADA.toLocaleString('es-AR')} al alias ${T2_ALIAS} para entrar al Torneo 2?`)) return;
  const yo=await fbGetJugador(S.jugador.id); if(!yo){ toast('Error','error'); return; }
  yo.pagoT2=true;
  await fbSetJugador(yo);
  S.jugador.pagoT2=true;
  await recalcRanking();
  renderInicio();
  toast('✅ Anotado en el Torneo 2 💪','success');
}

async function revertirPagoT2(){
  if(!S.jugador){ toast('Iniciá sesión primero','error'); return; }
  if(!confirm('¿Sacar tu inscripción al Torneo 2? Vas a quedar como NO anotado (DEBE).')) return;
  const yo=await fbGetJugador(S.jugador.id); if(!yo){ toast('Error','error'); return; }
  yo.pagoT2=false;
  await fbSetJugador(yo);
  S.jugador.pagoT2=false;
  await recalcRanking();
  renderInicio();
  toast('Inscripción quitada','error');
}

function toggleAdmin(){
  if(S.isAdmin){
    if(!confirm('¿Salir del modo admin?')) return;
    S.isAdmin=false; sessionStorage.removeItem('pa');
  } else {
    const k=prompt('🔐 Clave de admin:');
    if(k===ADMIN_PASS){ S.isAdmin=true; sessionStorage.setItem('pa','1'); toast('Admin activado','success'); }
    else if(k!==null) toast('Clave incorrecta','error');
  }
  aplicarAdmin();
}

function aplicarAdmin(){
  document.querySelectorAll('.solo-admin').forEach(el=>{ el.style.display=S.isAdmin?'':'none'; });
  const btn=document.getElementById('btn-admin');
  if(!btn) return;
  btn.textContent=S.isAdmin?'🔓 Admin':'🔒';
  btn.style.background=S.isAdmin?'var(--dorado)':'rgba(0,0,0,0.3)';
  btn.style.color=S.isAdmin?'var(--azul-d)':'var(--celeste-l)';
}

async function agregarParticipante(){
  const nombre=prompt('Nombre del nuevo participante:'); if(!nombre?.trim()) return;
  const n=nombre.trim(); const id=mkId(n);
  const existe=await fbGetJugador(id); if(existe){ toast('Ya existe ese jugador','error'); return; }
  await setDoc(doc(db,'jugadores',id),{id,nombre:n,pin:'',pago:false,pagoT2:false,pronosticos:{},pron2:{},verificado:true,fechaCreacion:new Date().toISOString()});
  const sel=document.getElementById('select-jugador');
  const opt=document.createElement('option'); opt.value=id; opt.textContent=n+' · primera vez'; sel.appendChild(opt);
  S.totalJugadores++;
  await recalcRanking();
  toast(`✓ ${n} agregado`,'success');
}

async function eliminarParticipante(){
  const jugadores=await fbGetJugadores();
  jugadores.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  const lista=jugadores.map((j,i)=>`${i+1}. ${j.nombre}`).join('\n');
  const r=prompt(`¿Qué número querés eliminar?\n\n${lista}`); if(!r) return;
  const idx=parseInt(r)-1;
  if(isNaN(idx)||idx<0||idx>=jugadores.length){ toast('Número inválido','error'); return; }
  const j=jugadores[idx];
  if(S.jugador?.id===j.id){ toast('No podés eliminarte a vos mismo','error'); return; }
  if(!confirm(`¿Eliminar a ${j.nombre}? No se puede deshacer.`)) return;
  await deleteDoc(doc(db,'jugadores',j.id));
  document.getElementById('select-jugador').querySelector(`option[value="${j.id}"]`)?.remove();
  S.totalJugadores--;
  await recalcRanking();
  toast(`✓ ${j.nombre} eliminado`,'success');
}

async function resetearPin(){
  if(!S.isAdmin){ toast('Solo admin','error'); return; }
  const jugadores=await fbGetJugadores();
  jugadores.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  const lista=jugadores.map((j,i)=>`${i+1}. ${j.nombre}`).join('\n');
  const r=prompt(`¿A qué número querés resetearle el PIN?\n\n${lista}`); if(!r) return;
  const idx=parseInt(r)-1;
  if(isNaN(idx)||idx<0||idx>=jugadores.length){ toast('Número inválido','error'); return; }
  const j=jugadores[idx];
  if(!confirm(`¿Resetear el PIN de ${j.nombre}?`)) return;
  const jActual=await fbGetJugador(j.id); if(!jActual){ toast('Jugador no encontrado','error'); return; }
  jActual.pin='';
  await fbSetJugador(jActual);
  toast(`PIN de ${j.nombre} reseteado`,'success');
}

async function descargarBackup(){
  if(!S.isAdmin){ toast('Solo admin','error'); return; }
  toast('Generando backup...','info');
  const jugadores=await fbGetJugadores();
  const resultados=await fbGetResultados();
  const data={generado:new Date().toISOString(),torneo:'Torneo 2 · Eliminatorias',jugadores,resultados:[{id:'t2',resultados,ts:new Date().toISOString()}]};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`prode-t2-backup-${new Date().toISOString().slice(0,16).replace(/[T:]/g,'-')}.json`;
  a.click();
  toast('✓ Backup descargado','success');
}

function irA(tab){
  if(S.dirty&&tab!=='mi-prode'){ if(!confirm('Tenés cambios sin guardar. ¿Salir igual?')) return; S.misPron={...S.pronGuardados}; S.dirty=false; }
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const sec=document.querySelector('[data-section="'+tab+'"]'); if(sec) sec.classList.add('active');
  const btn=document.querySelector('.nav-btn[data-nav="'+tab+'"]'); if(btn) btn.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(tab==='mi-prode') renderPartidos();
  if(tab==='ranking')  renderRanking();
  if(tab==='inicio')   renderInicio();
}

document.addEventListener('click', async e=>{
  const nav=e.target.closest('[data-nav]');
  const fase=e.target.closest('[data-fase]');
  const ac=e.target.closest('[data-action]');
  const ap=e.target.closest('[data-apuesta]');
  const admin=e.target.closest('#btn-admin');
  const hero=e.target.closest('#hero-header');

  if(nav){ e.stopPropagation(); irA(nav.dataset.nav); return; }
  if(fase){ e.stopPropagation(); S.faseFiltro=fase.dataset.fase; renderPartidos(); return; }
  if(hero&&!admin){ irA('inicio'); return; }
  if(admin){ e.stopPropagation(); toggleAdmin(); return; }

  const histBtn=e.target.closest('[data-action="ver-historial"]');
  if(histBtn){ e.stopPropagation(); e.preventDefault(); verHistorialPais(histBtn.dataset.code); return; }

  if(ap){
    const {id,op}=ap.dataset; if(!id||!op) return;
    const cur=normPron(S.misPron[id]);
    if(cur.op===op){ delete S.misPron[id]; }
    else {
      cur.op=op;
      if(cur.gL!==null&&cur.gV!==null){ const auto=cur.gL>cur.gV?'1':cur.gL<cur.gV?'2':'X'; if(auto!==op){cur.gL=null;cur.gV=null;} }
      S.misPron[id]=cur;
    }
    S.dirty=true; renderPartidos(); return;
  }

  if(ac){
    const a=ac.dataset.action;
    if(a==='guardar')              { guardarSeleccion(); return; }
    if(a==='marcar-pago-t2')       { marcarPagoT2(); return; }
    if(a==='revertir-pago-t2')     { revertirPagoT2(); return; }
    if(a==='cerrar-sesion')        { if(!confirm('¿Salir?')) return; localStorage.removeItem('ps'); location.reload(); return; }
    if(a==='login')                { intentarLogin(); return; }
    if(a==='agregar-participante') { agregarParticipante(); return; }
    if(a==='eliminar-participante'){ eliminarParticipante(); return; }
    if(a==='resetear-pin')         { resetearPin(); return; }
    if(a==='sincronizar')          { sincronizar(); return; }
    if(a==='cargar-resultado')     { cargarResultadoManual(); return; }
    if(a==='cargar-res-partido')   { cargarResPartido(ac.dataset.id); return; }
    if(a==='cerrar-cargares')      { document.getElementById('modal-cargares')?.remove(); return; }
    if(a==='editar-pron-admin')    { editarPronosticoAdmin(); return; }
    if(a==='descargar-backup')     { descargarBackup(); return; }
    if(a==='ver-pronosticos')      { verPronosticosJugador(ac.dataset.id); return; }
    if(a==='cerrar-pronosticos-ajenos'){ renderRanking(); return; }
    if(a==='mostrar-registro')     { mostrarRegistro(); return; }
    if(a==='cancelar-registro')    { cancelarRegistro(); return; }
    if(a==='registrar-nuevo')      { registrarNuevo(); return; }
    if(a==='abrir-auditoria')      { window.open('auditoria.html','_blank'); return; }
    if(a==='ir-a-jugados'){
      S.verJugados=true; renderPartidos();
      setTimeout(()=>{ document.getElementById('seccion-jugados')?.scrollIntoView({behavior:'smooth',block:'start'}); },60);
      return;
    }
    if(a==='toggle-jugados'){
      const ocultando=S.verJugados; S.verJugados=!S.verJugados; renderPartidos();
      if(ocultando){ setTimeout(()=>{ document.getElementById('lista-partidos')?.scrollIntoView({behavior:'smooth',block:'start'}); },60); }
      return;
    }
    if(a==='toggle-pendientes'){ S.soloPendientes=!S.soloPendientes; renderPartidos(); return; }
    if(a==='toggle-hoy')       { S.soloHoy=!S.soloHoy; renderPartidos(); return; }
    if(a==='ir-hoy')           { S.soloHoy=true; S.soloPendientes=false; irA('mi-prode'); return; }
    if(a==='ver-todos-pron')   { verTodosPronosticos(ac.dataset.id); return; }
    if(a==='cerrar-todospron') { document.getElementById('modal-todospron')?.remove(); return; }
    if(a==='cerrar-historial') { document.getElementById('modal-historial')?.remove(); return; }
    if(a==='toggle-pago-admin'){
      const jid=ac.dataset.id; const j=await fbGetJugador(jid); if(!j) return;
      const nuevo=!j.pagoT2;
      if(!confirm(`${nuevo?'Marcar inscripto':'Quitar inscripción'}: ${j.nombre}?`)) return;
      j.pagoT2=nuevo; await fbSetJugador(j); await recalcRanking();
      toast(`${j.nombre}: ${nuevo?'inscripto ✅':'removido'}`,nuevo?'success':'error');
      return;
    }
  }
});

document.addEventListener('input', e=>{
  const sc=e.target.closest('[data-score-id]'); if(!sc) return;
  const id=sc.dataset.scoreId; const campo=sc.dataset.campo;
  const val=sc.value===''?null:Math.max(0,Math.min(20,parseInt(sc.value)||0));
  if(!S.misPron[id]) S.misPron[id]={op:null,gL:null,gV:null};
  const cur=normPron(S.misPron[id]);
  cur[campo]=val;
  if(cur.gL!==null&&cur.gV!==null){ cur.op=cur.gL>cur.gV?'1':cur.gL<cur.gV?'2':'X'; }
  S.misPron[id]=cur; S.dirty=true;
  actualizarBotonGuardar(); actualizarBotonesApuesta(id,cur.op);
  if(sc.value!==''){
    const inputs=Array.from(document.querySelectorAll('input[data-score-id]:not([disabled])'));
    const i=inputs.indexOf(sc);
    if(i>-1&&i<inputs.length-1) inputs[i+1].focus();
  }
});

function cerrarSesion(){ if(!confirm('¿Salir?')) return; localStorage.removeItem('ps'); location.reload(); }
function mostrarRegistro(){ document.querySelector('#sec-login .login-box').style.display='none'; document.getElementById('registro-panel').style.display='block'; document.getElementById('reg-nombre')?.focus(); }
function cancelarRegistro(){ document.getElementById('registro-panel').style.display='none'; document.querySelector('#sec-login .login-box').style.display=''; }

async function intentarLogin(){
  const id=document.getElementById('select-jugador').value;
  const pin=document.getElementById('input-pin').value;
  if(!id){ toast('Elegí tu nombre','error'); return; }
  if(!/^\d{4}$/.test(pin)){ toast('PIN de 4 dígitos','error'); return; }
  const j=await fbGetJugador(id);
  if(!j){ toast('Jugador no encontrado','error'); return; }
  if(!j.pin){
    if(!confirm(`Usarás el PIN "${pin}" siempre.\n⚠️ Anotalo, no se puede recuperar.`)) return;
    j.pin=pin; await fbSetJugador(j); toast('PIN guardado ✓','success');
  } else if(j.pin!==pin){ toast('PIN incorrecto','error'); return; }
  await iniciarSesion(j);
}

async function iniciarSesion(j){
  if(j.verificado!==true){
    const resp=prompt(`🔐 Pregunta de verificación\n\n${PREGUNTA_SECRETA}`);
    if(resp===null||resp.trim().toLowerCase()!==RESPUESTA_SECRETA){
      localStorage.removeItem('ps');
      document.getElementById('seccion-loading').style.display='none';
      document.getElementById('sec-login').classList.add('active');
      toast('Respuesta incorrecta','error'); return;
    }
    j.verificado=true; await fbSetJugador(j);
  }
  S.jugador=j;
  S.pronGuardados=j.pron2||{};
  Object.keys(S.pronGuardados).forEach(id=>{ S.pronGuardados[id]=normPron(S.pronGuardados[id]); });
  S.misPron=JSON.parse(JSON.stringify(S.pronGuardados));
  S.dirty=false;
  localStorage.setItem('ps',JSON.stringify({id:j.id,pin:j.pin}));
  S.resultados=await fbGetResultados();
  await recalcRanking();
  document.getElementById('seccion-loading').style.display='none';
  document.getElementById('sec-login').classList.remove('active');
  document.getElementById('bottom-nav').style.display='grid';
  irA('inicio');
  toast('Hola '+j.nombre.split(' ')[0]+'!','success');
}

async function registrarNuevo(){
  const nombre=document.getElementById('reg-nombre')?.value?.trim();
  const pin=document.getElementById('reg-pin')?.value;
  const resp=document.getElementById('reg-respuesta')?.value;
  if(!nombre){ toast('Ingresá tu nombre','error'); return; }
  if(!/^\d{4}$/.test(pin)){ toast('PIN de 4 dígitos','error'); return; }
  if(!resp||resp.trim().toLowerCase()!==RESPUESTA_SECRETA){ toast('Respuesta incorrecta','error'); return; }
  const id=mkId(nombre);
  const btn=document.querySelector('[data-action="registrar-nuevo"]');
  if(btn){ btn.disabled=true; btn.textContent='Creando perfil...'; }
  try{
    const existe=await fbGetJugador(id);
    if(existe){ toast(`"${nombre}" ya existe · elegilo del dropdown`,'error'); if(btn){ btn.disabled=false; btn.textContent='Crear perfil'; } return; }
    const j={id,nombre,pin,pago:false,pagoT2:false,pronosticos:{},pron2:{},verificado:true,fechaCreacion:new Date().toISOString()};
    await setDoc(doc(db,'jugadores',id),j);
    const sel=document.getElementById('select-jugador');
    if(sel){ const opt=document.createElement('option'); opt.value=id; opt.textContent=nombre; sel.appendChild(opt); }
    S.totalJugadores++;
    await iniciarSesion(j);
  }catch(e){ toast('Error al crear perfil','error'); if(btn){ btn.disabled=false; btn.textContent='Crear perfil'; } }
}

async function init(){
  const params=new URLSearchParams(location.search);
  if(params.get('admin')===ADMIN_PASS){ S.isAdmin=true; sessionStorage.setItem('pa','1'); }
  if(sessionStorage.getItem('pa')==='1'){ S.isAdmin=true; }
  aplicarAdmin();

  const jugadores=await fbGetJugadores();
  jugadores.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  S.totalJugadores=jugadores.length;
  const sel=document.getElementById('select-jugador');
  sel.innerHTML='<option value="">— Elegí tu nombre —</option>'+
    jugadores.map(j=>`<option value="${j.id}">${esc(j.nombre)}${!j.pin?' · primera vez':''}</option>`).join('');

  document.querySelector('#sec-login .login-box').insertAdjacentHTML('beforeend',
    `<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--borde)">
      <p style="color:var(--muted);font-size:13px;margin-bottom:10px;text-align:center">¿No estás en la lista?</p>
      <button class="btn-grande btn-secundario" data-action="mostrar-registro">✍️ Crear perfil / Sumarme</button>
    </div>`
  );
  document.getElementById('sec-login').insertAdjacentHTML('beforeend',
    `<div id="registro-panel" class="login-box" style="display:none">
      <div class="ico">✍️</div><h2>Crear perfil</h2>
      <p style="margin-bottom:18px">Completá tus datos para sumarte al prode</p>
      <input type="text" class="select-jugador" id="reg-nombre" placeholder="Tu nombre" autocomplete="off">
      <input type="tel" class="pin-input" id="reg-pin" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="PIN ••••" autocomplete="off">
      <div class="login-help" style="margin:10px 0 14px">
        <p style="font-size:13px;margin-bottom:6px;color:var(--celeste-l)">${esc(PREGUNTA_SECRETA)}</p>
      </div>
      <input type="text" class="select-jugador" id="reg-respuesta" placeholder="Tu respuesta" autocomplete="off">
      <button class="btn-grande btn-primary" data-action="registrar-nuevo">Crear perfil</button>
      <button class="btn-rojo" data-action="cancelar-registro" style="width:100%;margin-top:8px">← Volver</button>
    </div>`
  );
  document.getElementById('reg-pin')?.addEventListener('input',e=>{ if(e.target.value.length===4) document.getElementById('reg-respuesta')?.focus(); });
  document.getElementById('reg-respuesta')?.addEventListener('keydown',e=>{ if(e.key==='Enter') registrarNuevo(); });

  try{
    const g=JSON.parse(localStorage.getItem('ps')||'null');
    if(g){ const j=jugadores.find(x=>x.id===g.id&&x.pin===g.pin); if(j){ await iniciarSesion(j); return; } }
  }catch(e){}

  document.getElementById('seccion-loading').style.display='none';
  document.getElementById('sec-login').classList.add('active');
}

init();
