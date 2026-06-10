// ============================================================
// PRODE CHAQUIENSE · Mundial 2026
// ============================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, getDocs
} from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

// ============================================================
// CONFIG
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyCq5_wwdc7lipXPqaH6_CYZSIUEFj81yBI",
  authDomain: "prode-mundial-26.firebaseapp.com",
  projectId: "prode-mundial-26",
  storageBucket: "prode-mundial-26.firebasestorage.app",
  messagingSenderId: "112140770068",
  appId: "1:112140770068:web:7c364985a7a4f05b3b0001"
};

const JUGADORES_DEFAULTS = [
  'Sebastián Suez','Dario Vulpes','Alexis Wolff','Axel Meunier',
  'Felix Llambias','Inda Videla','Ivan Kerchen','Lucas Pistoia',
  'Martin Picasso','Mati Antolin','Maxi Suez','Pedro Wolson',
  'Santi Teitel','Walter Korn','Zucho Ramos Mejia','~Du','Kevin Levy'
];

const ADMIN_PASS  = 'sebasuez26';
const CBU_PAGO    = '0000003100056133761644';
const FICHAS_INI  = 104;
const ENTRADA     = 20000;

const PREGUNTA_SECRETA  = '¿A qué nombre corresponde el apodo Anibal?';
const RESPUESTA_SECRETA = 'lucas';

// ============================================================
// FIREBASE
// ============================================================
const fbApp = initializeApp(firebaseConfig);
const db    = getFirestore(fbApp);

// ============================================================
// EQUIPOS
// ============================================================
const EQ = {
  MEX:{n:'México',f:'🇲🇽'}, RSA:{n:'Sudáfrica',f:'🇿🇦'}, KOR:{n:'Corea del Sur',f:'🇰🇷'}, CZE:{n:'República Checa',f:'🇨🇿'},
  CAN:{n:'Canadá',f:'🇨🇦'}, SUI:{n:'Suiza',f:'🇨🇭'}, QAT:{n:'Qatar',f:'🇶🇦'}, BIH:{n:'Bosnia y Herzegovina',f:'🇧🇦'},
  BRA:{n:'Brasil',f:'🇧🇷'}, MAR:{n:'Marruecos',f:'🇲🇦'}, HAI:{n:'Haití',f:'🇭🇹'}, SCO:{n:'Escocia',f:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
  USA:{n:'Estados Unidos',f:'🇺🇸'}, PAR:{n:'Paraguay',f:'🇵🇾'}, AUS:{n:'Australia',f:'🇦🇺'}, TUR:{n:'Turquía',f:'🇹🇷'},
  GER:{n:'Alemania',f:'🇩🇪'}, CUW:{n:'Curazao',f:'🇨🇼'}, CIV:{n:'Costa de Marfil',f:'🇨🇮'}, ECU:{n:'Ecuador',f:'🇪🇨'},
  NED:{n:'Países Bajos',f:'🇳🇱'}, JPN:{n:'Japón',f:'🇯🇵'}, TUN:{n:'Túnez',f:'🇹🇳'}, SWE:{n:'Suecia',f:'🇸🇪'},
  BEL:{n:'Bélgica',f:'🇧🇪'}, EGY:{n:'Egipto',f:'🇪🇬'}, IRN:{n:'Irán',f:'🇮🇷'}, NZL:{n:'Nueva Zelanda',f:'🇳🇿'},
  ESP:{n:'España',f:'🇪🇸'}, CPV:{n:'Cabo Verde',f:'🇨🇻'}, KSA:{n:'Arabia Saudita',f:'🇸🇦'}, URU:{n:'Uruguay',f:'🇺🇾'},
  FRA:{n:'Francia',f:'🇫🇷'}, SEN:{n:'Senegal',f:'🇸🇳'}, IRQ:{n:'Irak',f:'🇮🇶'}, NOR:{n:'Noruega',f:'🇳🇴'},
  ARG:{n:'Argentina',f:'🇦🇷'}, ALG:{n:'Argelia',f:'🇩🇿'}, AUT:{n:'Austria',f:'🇦🇹'}, JOR:{n:'Jordania',f:'🇯🇴'},
  POR:{n:'Portugal',f:'🇵🇹'}, COD:{n:'Rep. Dem. del Congo',f:'🇨🇩'}, UZB:{n:'Uzbekistán',f:'🇺🇿'}, COL:{n:'Colombia',f:'🇨🇴'},
  ENG:{n:'Inglaterra',f:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'}, CRO:{n:'Croacia',f:'🇭🇷'}, GHA:{n:'Ghana',f:'🇬🇭'}, PAN:{n:'Panamá',f:'🇵🇦'}
};

// ============================================================
// FIXTURE [id, fecha, hora, local, visit, fase, grupo, cL, cE, cV]
// ============================================================
const FX = [
  ['M1','11/06','16:00','MEX','RSA','grupos','A',1.85,3.40,4.50],
  ['M2','11/06','23:00','KOR','CZE','grupos','A',2.30,3.10,3.20],
  ['M3','12/06','16:00','CAN','BIH','grupos','B',1.95,3.30,4.00],
  ['M4','12/06','22:00','USA','PAR','grupos','D',1.75,3.50,4.80],
  ['M5','14/06','01:00','AUS','TUR','grupos','D',3.00,3.20,2.40],
  ['M6','13/06','19:00','BRA','MAR','grupos','C',1.55,4.00,6.00],
  ['M7','13/06','22:00','HAI','SCO','grupos','C',5.50,3.40,1.65],
  ['M8','13/06','16:00','SUI','QAT','grupos','B',1.40,4.50,7.50],
  ['M9','16/06','22:00','ARG','ALG','grupos','J',1.35,4.80,8.00],
  ['M10','14/06','14:00','GER','CUW','grupos','E',1.20,6.50,12.00],
  ['M11','14/06','17:00','NED','JPN','grupos','F',1.65,3.80,5.00],
  ['M12','14/06','20:00','CIV','ECU','grupos','E',2.40,3.10,3.00],
  ['M13','14/06','23:00','SWE','TUN','grupos','F',2.05,3.20,3.80],
  ['M14','15/06','13:00','ESP','CPV','grupos','H',1.20,6.00,12.00],
  ['M15','21/06','16:00','BEL','IRN','grupos','G',1.65,3.80,5.20],
  ['M16','21/06','22:00','NZL','EGY','grupos','G',4.50,3.30,1.80],
  ['M17','17/06','01:00','AUT','JOR','grupos','J',1.50,4.00,6.50],
  ['M18','16/06','16:00','FRA','SEN','grupos','I',1.65,3.80,5.00],
  ['M19','16/06','19:00','IRQ','NOR','grupos','I',5.50,3.60,1.65],
  ['M20','17/06','14:00','POR','COD','grupos','K',1.30,5.00,9.00],
  ['M21','17/06','17:00','ENG','CRO','grupos','L',2.00,3.30,3.80],
  ['M22','17/06','20:00','GHA','PAN','grupos','L',2.10,3.20,3.60],
  ['M22b','15/06','19:00','URU','KSA','grupos','H',1.50,4.00,6.50],
  ['M23','17/06','23:00','UZB','COL','grupos','K',4.50,3.30,1.80],
  ['M24','18/06','13:00','CZE','RSA','grupos','A',2.10,3.10,3.80],
  ['M25','18/06','22:00','MEX','KOR','grupos','A',2.05,3.20,3.70],
  ['M26','19/06','16:00','USA','AUS','grupos','D',1.70,3.60,5.00],
  ['M27','18/06','16:00','BIH','SUI','grupos','B',3.50,3.20,2.10],
  ['M28','20/06','00:00','TUR','PAR','grupos','D',2.10,3.10,3.70],
  ['M29','18/06','19:00','QAT','CAN','grupos','B',5.00,3.50,1.70],
  ['M30','19/06','19:00','SCO','MAR','grupos','C',3.00,3.20,2.40],
  ['M31','19/06','21:30','BRA','HAI','grupos','C',1.20,6.50,12.00],
  ['M32','20/06','14:00','NED','SWE','grupos','F',1.70,3.70,5.00],
  ['M33','20/06','17:00','GER','CIV','grupos','E',1.45,4.30,7.00],
  ['M34','20/06','21:00','CUW','ECU','grupos','E',5.50,3.70,1.55],
  ['M35','21/06','01:00','TUN','JPN','grupos','F',3.80,3.20,2.05],
  ['M36','21/06','13:00','ESP','KSA','grupos','H',1.25,5.50,10.00],
  ['M37','15/06','16:00','BEL','EGY','grupos','G',1.55,4.00,6.50],
  ['M38','21/06','19:00','URU','CPV','grupos','H',1.40,4.50,7.00],
  ['M39','15/06','22:00','NZL','IRN','grupos','G',5.00,3.40,1.75],
  ['M40','22/06','14:00','ARG','AUT','grupos','J',1.45,4.20,7.00],
  ['M41','22/06','18:00','FRA','IRQ','grupos','I',1.20,6.50,12.00],
  ['M42','22/06','21:00','NOR','SEN','grupos','I',2.30,3.30,3.10],
  ['M43','23/06','00:00','JOR','ALG','grupos','J',5.00,3.40,1.75],
  ['M44','23/06','14:00','POR','UZB','grupos','K',1.35,4.80,8.00],
  ['M45','27/06','18:00','CRO','GHA','grupos','L',1.65,3.80,5.00],
  ['M46','27/06','18:00','PAN','ENG','grupos','L',6.50,3.80,1.50],
  ['M47','23/06','23:00','COL','COD','grupos','K',1.50,4.10,6.50],
  ['M48','24/06','22:00','CZE','MEX','grupos','A',3.20,3.10,2.30],
  ['M49','24/06','22:00','RSA','KOR','grupos','A',3.20,3.20,2.25],
  ['M50','25/06','23:00','TUR','USA','grupos','D',3.00,3.20,2.40],
  ['M51','25/06','23:00','PAR','AUS','grupos','D',2.20,3.10,3.40],
  ['M52','24/06','16:00','SUI','CAN','grupos','B',2.30,3.20,3.20],
  ['M53','24/06','16:00','BIH','QAT','grupos','B',1.65,3.70,5.00],
  ['M54','24/06','19:00','SCO','BRA','grupos','C',7.00,4.00,1.45],
  ['M55','24/06','19:00','MAR','HAI','grupos','C',1.30,5.00,9.00],
  ['M56','25/06','17:00','ECU','GER','grupos','E',5.00,3.50,1.70],
  ['M57','25/06','17:00','CUW','CIV','grupos','E',7.50,4.20,1.40],
  ['M58','25/06','20:00','JPN','SWE','grupos','F',2.50,3.20,2.80],
  ['M59','25/06','20:00','TUN','NED','grupos','F',5.50,3.70,1.55],
  ['M60','26/06','21:00','CPV','KSA','grupos','H',2.80,3.10,2.60],
  ['M61','26/06','21:00','URU','ESP','grupos','H',4.00,3.40,1.85],
  ['M62','27/06','00:00','EGY','IRN','grupos','G',2.80,3.10,2.55],
  ['M63','27/06','00:00','NZL','BEL','grupos','G',7.00,4.00,1.45],
  ['M64','23/06','17:00','ENG','GHA','grupos','L',1.50,4.00,6.00],
  ['M65','23/06','20:00','CRO','PAN','grupos','L',1.55,3.90,6.50],
  ['M66','27/06','20:30','COL','POR','grupos','K',3.40,3.20,2.10],
  ['M67','27/06','20:30','COD','UZB','grupos','K',2.50,3.10,2.80],
  ['M68','27/06','23:00','ALG','AUT','grupos','J',2.80,3.20,2.50],
  ['M69','27/06','23:00','JOR','ARG','grupos','J',9.00,5.00,1.30],
  ['M70','26/06','16:00','NOR','FRA','grupos','I',2.80,3.30,2.50],
  ['M71','26/06','16:00','SEN','IRQ','grupos','I',1.45,4.00,7.50],
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

// cuotas override desde Firebase (se carga en init)
let cuotasOverride = {};
function getCuotas(id, defL, defE, defV){
  const o = cuotasOverride[id];
  return o ? [o.cL, o.cE, o.cV] : [defL, defE, defV];
}

// ============================================================
// ESTADO
// ============================================================
const S = {
  jugador: null,
  isAdmin: false,
  misPron: {},         // {id: {op:'1'|'X'|'2', gL:num|null, gV:num|null}}
  pronGuardados: {},
  resultados: {},      // {id: {real:'1'|'X'|'2', gL:num, gV:num}}
  ranking: [],
  ultimaSinc: null,
  faseFiltro: 'todos',
  dirty: false,
  totalJugadores: 0
};

// ============================================================
// HELPERS
// ============================================================
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

// Parsear fecha del fixture a objeto Date en zona AR
function parseFechaPartido(fecha, hora){
  const [dia, mes] = fecha.split('/');
  const [hh, mm]   = hora.split(':');
  return new Date(`2026-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}T${hh}:${mm}:00-03:00`);
}

// Partido cerrado = tiene resultado real OR faltan ≤ 2 min para empezar
function esCerrado(p){
  if(S.resultados[p[0]]?.real) return true;
  if(p[3].startsWith('?')) return false; // knockout sin equipos aún
  const inicio = parseFechaPartido(p[1], p[2]);
  return Date.now() >= inicio.getTime() - 2 * 60 * 1000;
}

// Normalizar pronóstico al nuevo formato
function normPron(v){
  if(!v) return {op:null, gL:null, gV:null};
  if(typeof v === 'string') return {op:v, gL:null, gV:null};
  return v;
}

// ============================================================
// FIREBASE helpers
// ============================================================
async function fbGetJugadores(){
  const snap = await getDocs(collection(db,'jugadores'));
  return snap.docs.map(d=>d.data());
}
async function fbGetJugador(id){
  const s = await getDoc(doc(db,'jugadores',id));
  return s.exists() ? s.data() : null;
}
async function fbSetJugador(j){ await setDoc(doc(db,'jugadores',j.id),j) }
async function fbUpdatePron(id, pron){
  await updateDoc(doc(db,'jugadores',id),{pronosticos:pron, ts:new Date().toISOString()});
}
async function fbGetResultados(){
  const s = await getDoc(doc(db,'resultados','main'));
  return s.exists() ? (s.data().resultados||{}) : {};
}
async function fbSetResultados(r){
  await setDoc(doc(db,'resultados','main'),{resultados:r, ts:new Date().toISOString()});
}
async function fbGetCuotas(){
  const s = await getDoc(doc(db,'cuotas','main'));
  return s.exists() ? (s.data().cuotas||{}) : {};
}
async function fbSetCuotas(c){
  await setDoc(doc(db,'cuotas','main'),{cuotas:c, ts:new Date().toISOString()});
}

// ============================================================
// NAVEGACIÓN
// ============================================================
function irA(tab){
  if(S.dirty && tab !== 'mi-prode'){
    if(!confirm('Tenés cambios sin guardar. ¿Salir igual?')) return;
    S.misPron = {...S.pronGuardados};
    S.dirty = false;
  }
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const sec = document.querySelector('[data-section="'+tab+'"]');
  if(sec) sec.classList.add('active');
  const btn = document.querySelector('.nav-btn[data-nav="'+tab+'"]');
  if(btn) btn.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(tab==='mi-prode') renderPartidos();
  if(tab==='ranking')  renderRanking();
  if(tab==='inicio')   renderInicio();
}

// ============================================================
// EVENT DELEGATION — CLICKS
// ============================================================
document.addEventListener('click', async e=>{
  const nav   = e.target.closest('[data-nav]');
  const ac    = e.target.closest('[data-action]');
  const ap    = e.target.closest('[data-apuesta]');
  const fase  = e.target.closest('[data-fase]');
  const admin = e.target.closest('#btn-admin');
  const hero  = e.target.closest('#hero-header');

  if(nav){ e.stopPropagation(); irA(nav.dataset.nav); return; }

  if(hero && !admin){ irA('inicio'); return; }

  if(admin){ e.stopPropagation(); toggleAdmin(); return; }

  if(fase){
    S.faseFiltro = fase.dataset.fase;
    renderPartidos();
    return;
  }

  if(ap){
    const {id, op} = ap.dataset;
    if(!id||!op) return;
    const cur = normPron(S.misPron[id]);
    if(cur.op === op){
      // toggle off: quitar apuesta completamente
      delete S.misPron[id];
    } else {
      cur.op = op;
      // auto-alinear scores si están puestos
      if(cur.gL !== null && cur.gV !== null){
        const autoOp = cur.gL > cur.gV ? '1' : cur.gL < cur.gV ? '2' : 'X';
        if(autoOp !== op){ cur.gL = null; cur.gV = null; } // inconsistente, limpiar scores
      }
      S.misPron[id] = cur;
    }
    S.dirty = true;
    renderPartidos();
    return;
  }

  if(ac){
    const a = ac.dataset.action;
    if(a==='pagar')                   { mostrarDatosTransferencia(); return; }
    if(a==='marcar-pago')             { marcarPago(); return; }
    if(a==='desmarcar-pago')          { desmarcarPago(); return; }
    if(a==='cerrar-sesion')           { cerrarSesion(); return; }
    if(a==='guardar')                 { guardarSeleccion(); return; }
    if(a==='sincronizar')             { sincronizar(false); return; }
    if(a==='login')                   { intentarLogin(); return; }
    if(a==='agregar-participante')    { agregarParticipante(); return; }
    if(a==='eliminar-participante')   { eliminarParticipante(); return; }
    if(a==='actualizar-cuotas')       { actualizarCuotas(); return; }
    if(a==='resetear-pin')            { resetearPin(); return; }
    if(a==='descargar-backup')        { descargarBackup(); return; }
    if(a==='invertidos-walter'){ aplicarInvertidosWalter(); return; }
    if(a==='ver-pronosticos')         { verPronosticosJugador(ac.dataset.id); return; }
    if(a==='cerrar-pronosticos-ajenos'){ renderRanking(); return; }
    if(a==='mostrar-registro')        { mostrarRegistro(); return; }
    if(a==='cancelar-registro')       { cancelarRegistro(); return; }
    if(a==='registrar-nuevo')         { registrarNuevo(); return; }
    if(a==='copiar-cbu'){
      const btn=e.target;
      const original=btn.innerHTML;
      btn.innerHTML='✅ Copiado';
      btn.style.background='var(--verde)';
      navigator.clipboard.writeText(CBU_PAGO)
        .then(()=>{ toast('✅ CBU copiado','success'); })
        .catch(()=>{ btn.innerHTML=original; btn.style.background='var(--dorado)'; toast('No se pudo copiar','error'); });
      return;
    }
    if(a==='cerrar-modal-cbu'){
      document.getElementById('modal-cbu')?.remove();
      return;
    }
    if(a==='toggle-pago-admin'){
      const jid=e.target.dataset.id;
      const j=await fbGetJugador(jid);
      if(!j) return;
      const nuevo=!j.pago;
      if(!confirm(`${nuevo?'Marcar pagado':'Quitar pago'}: ${j.nombre}?`)) return;
      j.pago=nuevo;
      await fbSetJugador(j);
      await recalcRanking();
      toast(`${j.nombre}: pago ${nuevo?'registrado ✅':'removido'}`, nuevo?'success':'error');
      return;
    }
    if(a==='ver-evolucion'){ abrirEvolucion(); return; }
    if(a==='cerrar-evolucion'){ document.getElementById('modal-evolucion')?.remove(); return; }
  }
});

// ============================================================
// EVENT DELEGATION — INPUTS (score exacto)
// ============================================================
document.addEventListener('input', e=>{
  const sc = e.target.closest('[data-score-id]');
  if(!sc) return;
  const id    = sc.dataset.scoreId;
  const campo = sc.dataset.campo;
  const val   = sc.value === '' ? null : Math.max(0, Math.min(20, parseInt(sc.value)||0));

  if(!S.misPron[id]) S.misPron[id] = {op:null, gL:null, gV:null};
  const cur = normPron(S.misPron[id]);
  cur[campo] = val;

  // Auto-set op si ambos scores están completos
  if(cur.gL !== null && cur.gV !== null){
    cur.op = cur.gL > cur.gV ? '1' : cur.gL < cur.gV ? '2' : 'X';
  }
  S.misPron[id] = cur;
  S.dirty = true;

  // Solo actualizar botones sin re-renderizar para no perder el foco
  actualizarBotonGuardar();
  // Resaltar el botón de apuesta correspondiente
  actualizarBotonesApuesta(id, cur.op);

  if(sc.value !== ''){
    const inputs = Array.from(document.querySelectorAll('input[data-score-id]:not([disabled])'));
    const i = inputs.indexOf(sc);
    if(i > -1 && i < inputs.length - 1) inputs[i+1].focus();
  }
});

function actualizarBotonesApuesta(id, op){
  document.querySelectorAll(`[data-apuesta][data-id="${id}"]`).forEach(btn=>{
    btn.classList.toggle('elegida', btn.dataset.op === op);
  });
}

// ============================================================
// INIT
// ============================================================
async function init(){
  const params = new URLSearchParams(location.search);
  if(params.get('admin')===ADMIN_PASS){ S.isAdmin=true; sessionStorage.setItem('pa','1'); }
  else if(sessionStorage.getItem('pa')==='1'){ S.isAdmin=true; }
  aplicarAdmin();

  // Cargar cuotas override desde Firebase
  cuotasOverride = await fbGetCuotas();

  // Inicializar jugadores si la DB está vacía
  const snap = await getDocs(collection(db,'jugadores'));
  if(snap.empty){
    for(const nombre of JUGADORES_DEFAULTS){
      const id = mkId(nombre);
      await setDoc(doc(db,'jugadores',id),{
        id, nombre, pin:'', pago:false, pronosticos:{},
        fechaCreacion: new Date().toISOString()
      });
    }
  }

  // Poblar select de login
  const jugadores = await fbGetJugadores();
  jugadores.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  S.totalJugadores = jugadores.length;
  const sel = document.getElementById('select-jugador');
  sel.innerHTML = '<option value="">— Elegí tu nombre —</option>' +
    jugadores.map(j=>`<option value="${j.id}">${esc(j.nombre)}${!j.pin?' · primera vez':''}</option>`).join('');

  // Inyectar opción de registro abierto en la pantalla de login
  document.querySelector('#sec-login .login-box').insertAdjacentHTML('beforeend',
    `<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--borde)">
      <p style="color:var(--muted);font-size:13px;margin-bottom:10px;text-align:center">¿No estás en la lista?</p>
      <button class="btn-grande btn-secundario" data-action="mostrar-registro">✍️ Crear perfil / Sumarme</button>
    </div>`
  );
  document.getElementById('sec-login').insertAdjacentHTML('beforeend',
    `<div id="registro-panel" class="login-box" style="display:none">
      <div class="ico">✍️</div>
      <h2>Crear perfil</h2>
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
  document.getElementById('reg-pin')?.addEventListener('input', e=>{
    if(e.target.value.length===4) document.getElementById('reg-respuesta')?.focus();
  });
  document.getElementById('reg-respuesta')?.addEventListener('keydown', e=>{
    if(e.key==='Enter') registrarNuevo();
  });

  // Sesión guardada
  try{
    const g = JSON.parse(localStorage.getItem('ps')||'null');
    if(g){
      const j = jugadores.find(x=>x.id===g.id && x.pin===g.pin);
      if(j){ await iniciarSesion(j); return; }
    }
  }catch(e){}

  document.getElementById('seccion-loading').style.display='none';
  document.getElementById('sec-login').classList.add('active');
}

// ============================================================
// LOGIN
// ============================================================
async function intentarLogin(){
  const id  = document.getElementById('select-jugador').value;
  const pin = document.getElementById('input-pin').value;
  if(!id)                    { toast('Elegí tu nombre','error'); return }
  if(!/^\d{4}$/.test(pin))   { toast('PIN de 4 dígitos','error'); return }
  const j = await fbGetJugador(id);
  if(!j){ toast('Jugador no encontrado','error'); return }
  if(!j.pin){
    if(!confirm(`Usarás el PIN "${pin}" siempre.\n⚠️ Anotalo, no se puede recuperar.`)) return;
    j.pin = pin;
    await fbSetJugador(j);
    toast('PIN guardado ✓','success');
  } else if(j.pin!==pin){
    toast('PIN incorrecto','error');
    return;
  }
  await iniciarSesion(j);
}

async function iniciarSesion(j){
  if(j.verificado !== true){
    const resp = prompt(`🔐 Pregunta de verificación\n\n${PREGUNTA_SECRETA}`);
    if(resp === null || resp.trim().toLowerCase() !== RESPUESTA_SECRETA){
      localStorage.removeItem('ps');
      document.getElementById('seccion-loading').style.display='none';
      document.getElementById('sec-login').classList.add('active');
      toast('Respuesta incorrecta','error');
      return;
    }
    j.verificado = true;
    await fbSetJugador(j);
  }
  S.jugador = j;
  S.pronGuardados = j.pronosticos||{};
  // Normalizar pronósticos viejos al nuevo formato
  Object.keys(S.pronGuardados).forEach(id=>{
    S.pronGuardados[id] = normPron(S.pronGuardados[id]);
  });
  S.misPron = JSON.parse(JSON.stringify(S.pronGuardados));
  S.dirty = false;
  localStorage.setItem('ps', JSON.stringify({id:j.id, pin:j.pin}));
  S.resultados = await fbGetResultados();
  await recalcRanking();
  document.getElementById('seccion-loading').style.display='none';
  document.getElementById('sec-login').classList.remove('active');
  document.getElementById('bottom-nav').style.display='grid';
  irA('inicio');
  toast('Hola '+j.nombre.split(' ')[0]+'!','success');

  // Recordatorio de cuotas los viernes
  if(S.isAdmin && new Date().getDay()===5){
    setTimeout(()=>toast('📅 Es viernes · recordá actualizar las cuotas','info'),2000);
  }
}

function cerrarSesion(){
  if(!confirm('¿Salir? Vas a necesitar tu PIN para volver.')) return;
  localStorage.removeItem('ps');
  location.reload();
}

function mostrarDatosTransferencia(){
  const html = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center" id="modal-cbu" onclick="if(event.target.id==='modal-cbu')this.remove()">
      <div style="background:var(--card);border-radius:12px;padding:24px;max-width:340px;width:90%;text-align:center">
        <div style="font-family:var(--condensed);font-size:20px;font-weight:700;margin-bottom:16px">Datos para transferencia</div>
        <div style="margin-bottom:8px;color:var(--texto-secundario);font-size:13px">Monto</div>
        <div style="font-size:24px;font-weight:700;color:var(--dorado);margin-bottom:16px">$20.000</div>
        <div style="margin-bottom:8px;color:var(--texto-secundario);font-size:13px">CBU</div>
        <div style="font-family:monospace;font-size:15px;background:rgba(255,255,255,0.05);border-radius:8px;padding:12px;letter-spacing:1px;margin-bottom:12px">${CBU_PAGO}</div>
        <button data-action="copiar-cbu" style="background:var(--dorado);color:#000;border:none;border-radius:8px;padding:10px 24px;font-weight:700;cursor:pointer;width:100%;margin-bottom:8px">📋 Copiar CBU</button>
        <button data-action="cerrar-modal-cbu" style="background:transparent;color:var(--texto-secundario);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:8px 24px;cursor:pointer;width:100%">Cerrar</button>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
}
async function marcarPago(){
  if(!S.jugador || S.jugador.pago) return;
  if(!confirm('¿Confirmás que ya pagaste tu entrada de $20.000?')) return;
  S.jugador.pago = true;
  try{
    await fbSetJugador(S.jugador);
    await recalcRanking();
    renderInicio();
    toast('✅ Pago registrado · El pozo subió $20.000','success');
  }catch(e){
    S.jugador.pago = false;
    toast('Error al guardar','error');
  }
}

async function desmarcarPago(){
  if(!S.jugador || !S.jugador.pago) return;
  if(!confirm('¿Querés desconfirmar tu pago?\n\nVas a quedar fuera del pozo hasta que lo vuelvas a confirmar.')) return;
  S.jugador.pago = false;
  try{
    await fbSetJugador(S.jugador);
    await recalcRanking();
    renderInicio();
    toast('↩ Pago desconfirmado · Ya no estás en el pozo','error');
  }catch(e){
    S.jugador.pago = true;
    toast('Error al guardar','error');
  }
}

function mostrarRegistro(){
  document.querySelector('#sec-login .login-box').style.display='none';
  document.getElementById('registro-panel').style.display='block';
  document.getElementById('reg-nombre')?.focus();
}

function cancelarRegistro(){
  document.getElementById('registro-panel').style.display='none';
  document.querySelector('#sec-login .login-box').style.display='';
}

async function registrarNuevo(){
  const nombre = document.getElementById('reg-nombre')?.value?.trim();
  const pin    = document.getElementById('reg-pin')?.value;
  const resp   = document.getElementById('reg-respuesta')?.value;

  if(!nombre)                                                { toast('Ingresá tu nombre','error'); return; }
  if(!/^\d{4}$/.test(pin))                                   { toast('PIN de 4 dígitos','error'); return; }
  if(!resp || resp.trim().toLowerCase() !== RESPUESTA_SECRETA){ toast('Respuesta incorrecta','error'); return; }

  const id  = mkId(nombre);
  const btn = document.querySelector('[data-action="registrar-nuevo"]');
  if(btn){ btn.disabled=true; btn.textContent='Creando perfil...'; }

  try{
    const existe = await fbGetJugador(id);
    if(existe){
      toast(`"${nombre}" ya existe · elegilo del dropdown para entrar con tu PIN`,'error');
      if(btn){ btn.disabled=false; btn.textContent='Crear perfil'; }
      return;
    }
    const j = {id, nombre, pin, pago:false, pronosticos:{}, verificado:true, fechaCreacion:new Date().toISOString()};
    await setDoc(doc(db,'jugadores',id), j);
    const sel = document.getElementById('select-jugador');
    if(sel){ const opt=document.createElement('option'); opt.value=id; opt.textContent=nombre; sel.appendChild(opt); }
    S.totalJugadores++;
    await iniciarSesion(j);
  }catch(e){
    toast('Error al crear perfil','error');
    if(btn){ btn.disabled=false; btn.textContent='Crear perfil'; }
  }
}

// ============================================================
// ADMIN
// ============================================================
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
  document.querySelectorAll('.solo-admin').forEach(el=>{
    el.style.display = S.isAdmin ? '' : 'none';
  });
  const btn = document.getElementById('btn-admin');
  if(!btn) return;
  btn.textContent = S.isAdmin ? '🔓 Admin' : '🔒';
  btn.style.background = S.isAdmin ? 'var(--dorado)' : 'rgba(0,0,0,0.3)';
  btn.style.color = S.isAdmin ? 'var(--azul-d)' : 'var(--celeste-l)';
}

async function agregarParticipante(){
  const nombre = prompt('Nombre del nuevo participante:');
  if(!nombre?.trim()) return;
  const n = nombre.trim();
  const id = mkId(n);
  const existe = await fbGetJugador(id);
  if(existe){ toast('Ya existe ese jugador','error'); return; }
  await setDoc(doc(db,'jugadores',id),{
    id, nombre:n, pin:'', pago:false, pronosticos:{},
    fechaCreacion: new Date().toISOString()
  });
  const sel = document.getElementById('select-jugador');
  const opt = document.createElement('option');
  opt.value=id; opt.textContent=n+' · primera vez';
  sel.appendChild(opt);
  S.totalJugadores++;
  actualizarPozo();
  await recalcRanking();
  toast(`✓ ${n} agregado`,'success');
}

async function eliminarParticipante(){
  const jugadores = await fbGetJugadores();
  jugadores.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  const lista = jugadores.map((j,i)=>`${i+1}. ${j.nombre}`).join('\n');
  const r = prompt(`¿Qué número querés eliminar?\n\n${lista}`);
  if(!r) return;
  const idx = parseInt(r)-1;
  if(isNaN(idx)||idx<0||idx>=jugadores.length){ toast('Número inválido','error'); return; }
  const j = jugadores[idx];
  if(S.jugador?.id===j.id){ toast('No podés eliminarte a vos mismo','error'); return; }
  if(!confirm(`¿Eliminar a ${j.nombre}? No se puede deshacer.`)) return;
  await deleteDoc(doc(db,'jugadores',j.id));
  document.getElementById('select-jugador').querySelector(`option[value="${j.id}"]`)?.remove();
  S.totalJugadores--;
  actualizarPozo();
  await recalcRanking();
  toast(`✓ ${j.nombre} eliminado`,'success');
}

async function resetearPin(){
  if(!S.isAdmin){ toast('Solo admin','error'); return; }
  const jugadores = await fbGetJugadores();
  jugadores.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  const lista = jugadores.map((j,i)=>`${i+1}. ${j.nombre}`).join('\n');
  const r = prompt(`¿A qué número querés resetearle el PIN?\n\n${lista}`);
  if(!r) return;
  const idx = parseInt(r)-1;
  if(isNaN(idx)||idx<0||idx>=jugadores.length){ toast('Número inválido','error'); return; }
  const j = jugadores[idx];
  if(!confirm(`¿Resetear el PIN de ${j.nombre}?\nVa a tener que elegir uno nuevo al entrar.`)) return;
  const jActual = await fbGetJugador(j.id);
  if(!jActual){ toast('Jugador no encontrado','error'); return; }
  jActual.pin = '';
  await fbSetJugador(jActual);
  toast(`PIN de ${j.nombre} reseteado · va a elegir uno nuevo al entrar`,'success');
}

async function aplicarInvertidosWalter(){
  if(!S.isAdmin){ toast('Solo admin','error'); return; }
  const jgs = await fbGetJugadores();
  const fuente = jgs.find(j=>j.nombre.toLowerCase().includes('santi')&&j.nombre.toLowerCase().includes('teitel'));
  const target = jgs.find(j=>j.nombre.toLowerCase().includes('walter')&&j.nombre.toLowerCase().includes('korn'));
  if(!fuente){ toast('No encontré a Santi Teitel','error'); return; }
  if(!target){ toast('No encontré a Walter Korn','error'); return; }
  if(!confirm(`Copiar pronósticos de ${fuente.nombre} invertidos a ${target.nombre}?\nEsto reemplaza todo lo que Walter tenga cargado.`)) return;
  const inv={};
  for(const [mid,pron] of Object.entries(fuente.pronosticos||{})){
    if(!pron||!pron.op) continue;
    const opInv = pron.op==='1'?'2': pron.op==='2'?'1':'1';
    let gLInv, gVInv;
    if(pron.op==='X'){ gLInv=1; gVInv=0; }
    else { const t=pron.gL!=null&&pron.gV!=null; gLInv=t?pron.gV:null; gVInv=t?pron.gL:null; }
    inv[mid]={ op:opInv, gL:gLInv, gV:gVInv };
  }
  target.pronosticos = inv;
  await fbSetJugador(target);
  await recalcRanking();
  toast(`Listo: pronósticos de Walter Korn actualizados ✅`,'success');
}

// Actualizar cuotas de un partido (admin)
async function actualizarCuotas(){
  const lista = FX.filter(p=>!p[3].startsWith('?')).slice(0,72);
  const r = prompt('ID del partido a actualizar (ej: M9 para ARG vs ALG):\n\nEjemplos:\nM9 = ARG vs ALG\nM1 = MEX vs RSA\nM6 = BRA vs MAR');
  if(!r) return;
  const id = r.trim().toUpperCase();
  const partido = FX.find(p=>p[0]===id);
  if(!partido){ toast('Partido no encontrado','error'); return; }
  const L = EQ[partido[3]]?.n||partido[3];
  const V = EQ[partido[4]]?.n||partido[4];
  const [dL,dE,dV] = getCuotas(id, partido[7], partido[8], partido[9]);
  const nuevas = prompt(
    `Cuotas para ${L} vs ${V}\n\nActuales: ${dL} / ${dE} / ${dV}\n\n` +
    `Ingresá las nuevas separadas por coma:\n(formato: local,empate,visitante)\n(ej: 1.80,3.50,4.20)`
  );
  if(!nuevas) return;
  const partes = nuevas.split(',').map(x=>parseFloat(x.trim()));
  if(partes.length!==3||partes.some(isNaN)||partes.some(x=>x<=0)){
    toast('Formato inválido. Ej: 1.80,3.50,4.20','error'); return;
  }
  cuotasOverride[id] = {cL:partes[0], cE:partes[1], cV:partes[2]};
  await fbSetCuotas(cuotasOverride);
  await recalcRanking();
  renderPartidos();
  toast(`✓ Cuotas de ${L} vs ${V} actualizadas`,'success');
}

// ============================================================
// SINCRONIZACIÓN
// ============================================================
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
  if(!silencioso) toast('🔄 Sincronizando...');
  try{
    const res = await fetch(SYNC_URL,{cache:'no-store'});
    if(!res.ok) throw new Error(res.status);
    const data = await res.json();
    let n=0;
    data.matches.forEach(m=>{
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
      if(!prev||prev.real!==real){ S.resultados[p[0]]={real,gL,gV}; n++; }
    });
    if(n>0){ await fbSetResultados(S.resultados); await recalcRanking(); }
    S.ultimaSinc=new Date().toISOString();
    actualizarSyncLabel();
    if(!silencioso) toast(n>0?`✓ ${n} resultados actualizados`:'✓ Todo al día','success');
  }catch(e){
    if(!silencioso) toast('Error al sincronizar','error');
  }
}

function actualizarSyncLabel(){
  const el=document.getElementById('ultima-sinc');
  if(!el) return;
  if(!S.ultimaSinc){el.textContent='nunca';return;}
  const min=Math.floor((Date.now()-new Date(S.ultimaSinc))/60000);
  el.textContent=min<1?'recién':min<60?`hace ${min} min`:`hace ${Math.floor(min/60)}h`;
}

// ============================================================
// CÁLCULO DE FICHAS (con resultado exacto)
// ============================================================
function calcFichas(j){
  let fichas=FICHAS_INI, aciertos=0, exactos=0, fallados=0, sinApostar=0, pendientes=0;
  const pron=j.pronosticos||{};
  FX.forEach(p=>{
    const r=S.resultados[p[0]];
    const [cL,cE,cV] = getCuotas(p[0], p[7], p[8], p[9]);
    if(r?.real){
      fichas -= 1; // costo de la ficha
      const ap = normPron(pron[p[0]]);
      if(!ap.op){
        sinApostar++;
      } else if(ap.op === r.real){
        const cuota = {'1':cL,'X':cE,'2':cV}[ap.op]||1;
        // Resultado exacto: cobra ×2
        if(ap.gL !== null && ap.gV !== null && ap.gL === r.gL && ap.gV === r.gV){
          fichas += cuota * 2;
          exactos++;
        } else {
          fichas += cuota;
        }
        aciertos++;
      } else {
        fallados++;
      }
    } else {
      const ap = normPron(pron[p[0]]);
      if(!p[3].startsWith('?') && !esCerrado(p) && !ap.op) pendientes++;
    }
  });
  return {
    fichas: Math.round(fichas*100)/100,
    aciertos, exactos, fallados, sinApostar, pendientes
  };
}

function calcularEvolucion(jugadores){
  const jugados = FX.filter(p=>S.resultados[p[0]]?.real)
    .sort((a,b)=>parseFechaPartido(a[1],a[2]).getTime()-parseFechaPartido(b[1],b[2]).getTime());
  const fechas=[];
  jugados.forEach(p=>{ if(!fechas.includes(p[1])) fechas.push(p[1]); });
  const series = jugadores.map(j=>{
    const pron=j.pronosticos||{};
    let f=FICHAS_INI;
    const pts=[f];
    fechas.forEach(fe=>{
      jugados.filter(p=>p[1]===fe).forEach(p=>{
        const r=S.resultados[p[0]];
        const ap=normPron(pron[p[0]]);
        const [cL,cE,cV]=getCuotas(p[0],p[7],p[8],p[9]);
        f-=1;
        if(ap.op && ap.op===r.real){
          const cuota={'1':cL,'X':cE,'2':cV}[ap.op]||1;
          f += (ap.gL!==null&&ap.gV!==null&&ap.gL===r.gL&&ap.gV===r.gV)? cuota*2 : cuota;
        }
      });
      pts.push(Math.round(f*100)/100);
    });
    return {nombre:j.nombre,id:j.id,pts};
  });
  return {fechas,series};
}

async function abrirEvolucion(){
  const jugadores = await fbGetJugadores();
  const {fechas,series} = calcularEvolucion(jugadores);
  let cuerpo;
  if(!fechas.length){
    cuerpo='<div style="text-align:center;padding:40px 10px;color:#9fb3cc">El gráfico aparece cuando se jueguen los primeros partidos ⚽</div>';
  } else {
    const W=700,H=380,padL=46,padR=14,padT=16,padB=34;
    const todos=series.flatMap(s=>s.pts);
    let yMin=Math.min(...todos), yMax=Math.max(...todos);
    if(yMin===yMax){yMin-=5;yMax+=5;}
    const span=yMax-yMin; yMin-=span*0.08; yMax+=span*0.08;
    const n=fechas.length+1;
    const x=i=> padL + (n===1?0:(i*(W-padL-padR)/(n-1)));
    const y=v=> padT + (yMax-v)*(H-padT-padB)/(yMax-yMin);
    const colores=['#74acdf','#f5b800','#e74c3c','#2ecc71','#9b59b6','#e67e22','#1abc9c','#fd79a8','#00cec9','#fab1a0','#6c5ce7','#ffeaa7','#55efc4','#ff7675','#a29bfe','#81ecec','#d63031'];
    let grid='';
    for(let g=0;g<=4;g++){
      const v=yMin+(yMax-yMin)*g/4, yy=y(v);
      grid+=`<line x1="${padL}" y1="${yy}" x2="${W-padR}" y2="${yy}" stroke="rgba(255,255,255,0.08)"/>`+`<text x="${padL-6}" y="${yy+4}" font-size="11" fill="#9fb3cc" text-anchor="end">${v.toFixed(0)}</text>`;
    }
    const cada=Math.max(1,Math.ceil(n/6));
    let labels=`<text x="${x(0)}" y="${H-10}" font-size="10" fill="#9fb3cc" text-anchor="middle">Inicio</text>`;
    fechas.forEach((f,i)=>{ if((i+1)%cada===0||i===fechas.length-1) labels+=`<text x="${x(i+1)}" y="${H-10}" font-size="10" fill="#9fb3cc" text-anchor="middle">${f}</text>`; });
    const ordenadas=[...series].sort((a,b)=>(a.id===S.jugador?.id)-(b.id===S.jugador?.id));
    let lineas='';
    ordenadas.forEach(s=>{
      const idx=series.indexOf(s);
      const col=colores[idx%colores.length];
      const esYo=s.id===S.jugador?.id;
      const ptsStr=s.pts.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
      lineas+=`<polyline points="${ptsStr}" fill="none" stroke="${col}" stroke-width="${esYo?4:1.8}" stroke-linejoin="round" stroke-linecap="round" opacity="${esYo?1:0.75}"/>`;
    });
    const leyenda=series.map((s,i)=>`<span style="display:inline-flex;align-items:center;gap:5px;margin:3px 8px 3px 0;font-size:12px;color:#dfe9f5"><span style="width:12px;height:12px;border-radius:3px;background:${colores[i%colores.length]};display:inline-block"></span>${esc(s.nombre)}${s.id===S.jugador?.id?' (vos)':''}</span>`).join('');
    cuerpo=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" xmlns="http://www.w3.org/2000/svg">${grid}${labels}${lineas}</svg><div style="margin-top:10px;display:flex;flex-wrap:wrap">${leyenda}</div>`;
  }
  const ov=document.createElement('div');
  ov.id='modal-evolucion';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;overflow-y:auto;padding:20px 12px';
  ov.innerHTML=`<div style="max-width:760px;margin:0 auto;background:var(--bg2,#10182a);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px"><h3 style="margin:0 0 12px;color:var(--dorado,#f5b800);font-family:var(--condensed)">📈 EVOLUCIÓN DE FICHAS</h3>${cuerpo}<button class="btn-grande btn-secundario" data-action="cerrar-evolucion" style="margin-top:14px;width:100%">Cerrar</button></div>`;
  ov.addEventListener('click',ev=>{ if(ev.target===ov) ov.remove(); });
  document.body.appendChild(ov);
}

async function recalcRanking(){
  const todos = await fbGetJugadores();
  S.totalJugadores = todos.length;
  S.ranking = todos.map(j=>({id:j.id,nombre:j.nombre,pago:j.pago,...calcFichas(j)}))
    .sort((a,b)=>b.fichas-a.fichas||b.aciertos-a.aciertos);
  renderRanking();
  renderUserBars();
  actualizarPozo();
}

// ============================================================
// RENDER: POZO (dinámico)
// ============================================================
function actualizarPozo(){
  const pagados = S.ranking.filter(r => r.pago).length;
  const total   = pagados * ENTRADA;
  const elMonto = document.getElementById('pozo-monto');
  const elInfo  = document.getElementById('pozo-info');
  const elRegla = document.getElementById('pozo-regla');
  if(elMonto) elMonto.textContent = '$' + total.toLocaleString('es-AR');
  if(elInfo)  elInfo.textContent  = `${pagados} de ${S.totalJugadores} pagaron · El campeón se lleva todo`;
  if(elRegla) elRegla.textContent = `$${total.toLocaleString('es-AR')}`;
}

// ============================================================
// RENDER: USER BARS
// ============================================================
function renderUserBars(){
  if(!S.jugador) return;
  const st = calcFichas(S.jugador);
  const ini = S.jugador.nombre.charAt(0).toUpperCase();
  const html = `<div class="user-bar">
    <div class="user-avatar">${ini}</div>
    <div class="user-info">
      <div class="user-name">${esc(S.jugador.nombre)}</div>
      <div class="user-stats">${st.aciertos} aciertos · ${st.exactos} exactos · ${st.pendientes} pendientes</div>
    </div>
    <div class="fichas-badge">${st.fichas} <span style="font-size:11px;font-family:var(--condensed)">FICHAS</span></div>
  </div>`;
  ['user-bar-inicio','user-bar-prode','user-bar-ranking'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.innerHTML=html;
  });
}

// ============================================================
// RENDER: INICIO
// ============================================================
function renderInicio(){
  renderUserBars();
  actualizarPozo();
  const debut = new Date('2026-06-11T16:00:00-03:00');
  const dias  = Math.max(0,Math.ceil((debut-Date.now())/86400000));
  const el    = document.getElementById('dias-restantes');
  if(el) el.textContent = dias;
  const pagoArea = document.getElementById('pago-area');
  if(pagoArea && S.jugador){
    if(S.jugador.pago){
      pagoArea.innerHTML = `<div class="card" style="text-align:center;margin-bottom:12px"><div style="color:var(--verde);font-family:var(--condensed);font-weight:700;font-size:16px;letter-spacing:0.5px;margin-bottom:8px">✅ Pagaste · Estás en el pozo</div><button class="btn-grande" style="background:rgba(230,57,70,0.15);color:var(--rojo);font-size:13px;padding:8px 16px" data-action="desmarcar-pago">↩ Desconfirmar pago</button></div>`;
    } else {
      pagoArea.innerHTML = `<button class="btn-grande btn-dorado" data-action="marcar-pago">✅ Ya pagué mi entrada</button><button class="btn-grande btn-mp" data-action="pagar">🏦 Pagar por transferencia</button>`;
    }
  }
}

// ============================================================
// RENDER: PARTIDOS
// ============================================================
function renderPartidos(){
  renderUserBars();
  const cont = document.getElementById('lista-partidos');
  if(!cont) return;

  let lista = S.faseFiltro==='todos' ? FX : FX.filter(p=>p[5]===S.faseFiltro);
  lista = [...lista].sort((a,b)=> parseFechaPartido(a[1],a[2]).getTime() - parseFechaPartido(b[1],b[2]).getTime());

  const porFecha={};
  lista.forEach(p=>{ (porFecha[p[1]]||(porFecha[p[1]]=[])).push(p); });

  let html='';
  Object.entries(porFecha).forEach(([fecha,ps])=>{
    html+=`<div class="fecha-divider">${fecha}</div>`;
    ps.forEach(p=>{ html+=htmlPartido(p); });
  });

  cont.innerHTML = html || '<div class="empty"><div class="ico">⚽</div><p>Sin partidos en esta fase</p></div>';

  // Filtros
  document.querySelectorAll('#filtros-fase .filtro').forEach(b=>{
    const fase=b.dataset.fase;
    b.classList.toggle('active', fase===S.faseFiltro);
    const labels={todos:'Todos',grupos:'Grupos',r32:'R32',r16:'Octavos',qf:'Cuartos',sf:'Semis',final:'Final'};
    if(fase!=='todos' && S.jugador){
      const pend=FX.filter(p=>p[5]===fase&&!esCerrado(p)&&!S.misPron[p[0]]?.op&&!p[3].startsWith('?')).length;
      b.innerHTML=labels[fase]+(pend>0?` <span class="pendiente">${pend}</span>`:'');
    } else {
      b.innerHTML=labels[fase]||fase;
    }
  });

  actualizarBotonGuardar();
}

function htmlPartido(p){
  const [id,fecha,hora,lc,vc,fase,grupo,dL,dE,dV] = p;
  const [cL,cE,cV] = getCuotas(id, dL, dE, dV);
  const L  = EQ[lc]||{n:lc.replace('?',''),f:'❓'};
  const V  = EQ[vc]||{n:vc.replace('?',''),f:'❓'};
  const ph = lc.startsWith('?')||vc.startsWith('?');
  const cerrado = esCerrado(p);

  const mia  = normPron(S.misPron[id]);
  const real = S.resultados[id];

  const clase = cerrado
    ? (mia.op===real?.real ? 'acertado' : (mia.op ? 'fallado' : 'cerrado'))
    : (mia.op ? 'guardado' : '');

  const gt = fase==='grupos' ? `Grupo ${grupo}`
    : ({r32:'R32',r16:'Octavos',qf:'Cuartos',sf:'Semis'})[fase]
    || (grupo==='FINAL'?'FINAL':'3er Puesto');

  const rtag = real ? `<span class="resultado-real">${real.gL}-${real.gV}</span>` : '';

  let pago='';
  if(cerrado && mia.op){
    if(mia.op===real?.real){
      const cuota = {'1':cL,'X':cE,'2':cV}[mia.op];
      if(mia.gL!==null && mia.gV!==null && mia.gL===real.gL && mia.gV===real.gV){
        pago=`<div class="partido-resultado-pago gano">⭐ EXACTO · +${(cuota*2).toFixed(2)} fichas (×2)</div>`;
      } else {
        pago=`<div class="partido-resultado-pago gano">✓ Acertaste · +${cuota} fichas</div>`;
      }
    } else {
      pago=`<div class="partido-resultado-pago perdio">✗ Fallaste · -1 ficha</div>`;
    }
  } else if(cerrado && !mia.op){
    pago=`<div class="partido-resultado-pago perdio">✗ No apostaste · -1 ficha</div>`;
  }

  const dis = (cerrado||ph) ? 'disabled' : '';

  const btnCls=(op)=>{
    let c='btn-apuesta'+(op==='X'?' empate':'');
    if(mia.op===op) c+=' elegida';
    if(cerrado&&mia.op===op) c+= real?.real===op ? ' acertado' : ' fallado';
    return c;
  };

  // Score inputs (solo si no cerrado y no placeholder)
  const scoreHtml = (!cerrado && !ph) ? `
    <div class="score-exacto">
      <span class="score-lbl">Resultado exacto (opcional · cobra ×2):</span>
      <div class="score-row">
        <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="?" class="score-in"
               data-score-id="${id}" data-campo="gL"
               value="${mia.gL!==null?mia.gL:''}">
        <span class="score-guion">-</span>
        <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="?" class="score-in"
               data-score-id="${id}" data-campo="gV"
               value="${mia.gV!==null?mia.gV:''}">
      </div>
    </div>` : (real && mia.gL!==null && !cerrado ? '' : '');

  return `<div class="partido ${clase}">
    <div class="partido-meta">
      <span><span class="grupo">${gt}</span> · ${fecha} ${hora}hs</span>
      ${rtag}
    </div>
    <div class="apuestas-3">
      <button class="${btnCls('1')}" data-apuesta data-id="${id}" data-op="1" ${dis}>
        <span class="equipo-flag">${L.f}</span>
        <span class="equipo-nombre">${L.n}</span>
        <span class="cuota">${cL}</span>
      </button>
      <button class="${btnCls('X')}" data-apuesta data-id="${id}" data-op="X" ${dis}>
        <span class="empate-label">X</span>
        <span class="equipo-nombre" style="font-size:11px;color:var(--muted)">EMPATE</span>
        <span class="cuota">${cE}</span>
      </button>
      <button class="${btnCls('2')}" data-apuesta data-id="${id}" data-op="2" ${dis}>
        <span class="equipo-flag">${V.f}</span>
        <span class="equipo-nombre">${V.n}</span>
        <span class="cuota">${cV}</span>
      </button>
    </div>
    ${scoreHtml}
    ${pago}
  </div>`;
}

function htmlPartidoAjeno(p, jugador){
  const [id,fecha,hora,lc,vc,fase,grupo,dL,dE,dV] = p;
  const [cL,cE,cV] = getCuotas(id, dL, dE, dV);
  const L  = EQ[lc]||{n:lc.replace('?',''),f:'❓'};
  const V  = EQ[vc]||{n:vc.replace('?',''),f:'❓'};
  const cerrado = esCerrado(p);
  const pron = normPron((jugador.pronosticos||{})[id]);
  const real = S.resultados[id];

  const fasesAbiertas = ['grupos','r32','r16'];
  const visible = fasesAbiertas.includes(fase) || !!real?.real;

  const gt = fase==='grupos' ? `Grupo ${grupo}`
    : ({r32:'R32',r16:'Octavos',qf:'Cuartos',sf:'Semis'})[fase]
    || (grupo==='FINAL'?'FINAL':'3er Puesto');
  const rtag = real ? `<span class="resultado-real">${real.gL}-${real.gV}</span>` : '';

  if(!visible){
    return `<div class="partido cerrado">
      <div class="partido-meta">
        <span><span class="grupo">${gt}</span> · ${fecha} ${hora}hs</span>
        ${rtag}
      </div>
      <div style="text-align:center;padding:12px;font-family:var(--condensed);font-size:13px;color:var(--muted);font-weight:700;letter-spacing:0.5px">🔒 Se revela cuando termine el partido</div>
    </div>`;
  }

  const clase = cerrado
    ? (pron.op===real?.real ? 'acertado' : (pron.op ? 'fallado' : 'cerrado'))
    : (pron.op ? 'guardado' : '');

  const btnCls=(op)=>{
    let c='btn-apuesta'+(op==='X'?' empate':'');
    if(pron.op===op) c+=' elegida';
    if(cerrado && pron.op===op && real?.real) c += pron.op===real.real ? ' acertado' : ' fallado';
    return c;
  };

  let pago='';
  if(cerrado && pron.op){
    if(pron.op===real?.real){
      const cuota={'1':cL,'X':cE,'2':cV}[pron.op];
      if(pron.gL!==null && pron.gV!==null && pron.gL===real.gL && pron.gV===real.gV){
        pago=`<div class="partido-resultado-pago gano">⭐ EXACTO · +${(cuota*2).toFixed(2)} fichas (×2)</div>`;
      } else {
        pago=`<div class="partido-resultado-pago gano">✓ Acertó · +${cuota} fichas</div>`;
      }
    } else {
      pago=`<div class="partido-resultado-pago perdio">✗ Falló · -1 ficha</div>`;
    }
  } else if(cerrado && !pron.op){
    pago=`<div class="partido-resultado-pago perdio">✗ No apostó · -1 ficha</div>`;
  }

  let scoreHtml='';
  if(pron.gL!==null && pron.gV!==null){
    scoreHtml=`<div class="score-exacto">
      <span class="score-lbl">Resultado exacto pronosticado:</span>
      <div class="score-row">
        <span class="score-in" style="display:flex;align-items:center;justify-content:center">${pron.gL}</span>
        <span class="score-guion">-</span>
        <span class="score-in" style="display:flex;align-items:center;justify-content:center">${pron.gV}</span>
      </div>
    </div>`;
  }

  return `<div class="partido ${clase}">
    <div class="partido-meta">
      <span><span class="grupo">${gt}</span> · ${fecha} ${hora}hs</span>
      ${rtag}
    </div>
    <div class="apuestas-3">
      <button class="${btnCls('1')}" disabled>
        <span class="equipo-flag">${L.f}</span>
        <span class="equipo-nombre">${L.n}</span>
        <span class="cuota">${cL}</span>
      </button>
      <button class="${btnCls('X')}" disabled>
        <span class="empate-label">X</span>
        <span class="equipo-nombre" style="font-size:11px;color:var(--muted)">EMPATE</span>
        <span class="cuota">${cE}</span>
      </button>
      <button class="${btnCls('2')}" disabled>
        <span class="equipo-flag">${V.f}</span>
        <span class="equipo-nombre">${V.n}</span>
        <span class="cuota">${cV}</span>
      </button>
    </div>
    ${scoreHtml}
    ${pago}
  </div>`;
}

// ============================================================
// GUARDAR
// ============================================================
function actualizarBotonGuardar(){
  const btn=document.getElementById('btn-guardar');
  if(!btn) return;
  btn.textContent = S.dirty ? '💾 Guardar selección' : '✓ Selección guardada';
  btn.disabled    = !S.dirty;
  btn.style.opacity = S.dirty ? '1' : '0.6';
}

async function guardarSeleccion(){
  if(!S.jugador) return;
  if(!S.dirty){ toast('Sin cambios para guardar'); return; }
  const btn=document.getElementById('btn-guardar');
  if(btn){ btn.textContent='💾 Guardando...'; btn.disabled=true; }
  try{
    await fbUpdatePron(S.jugador.id, S.misPron);
    S.pronGuardados = JSON.parse(JSON.stringify(S.misPron));
    S.jugador.pronosticos = S.misPron;
    S.dirty = false;
    await recalcRanking();
    toast('✓ Guardado','success');
  }catch(e){
    toast('Error al guardar','error');
    if(btn){ btn.textContent='💾 Guardar selección'; btn.disabled=false; }
  }
}

// ============================================================
// RENDER: RANKING
// ============================================================
function renderRanking(){
  renderUserBars();
  const cont  = document.getElementById('lista-ranking');
  const podio = document.getElementById('podio-container');
  if(!cont) return;

  if(!S.ranking.length){
    cont.innerHTML='<div class="empty"><div class="ico">📊</div><p>Cargando...</p></div>';
    return;
  }

  const lider=S.ranking[0];
  podio.innerHTML = lider?.aciertos>0
    ? `<div class="podio-top">
        <div class="lider">🏆 LÍDER ACTUAL</div>
        <div class="nombre">${esc(lider.nombre)}</div>
        <div class="fichas">${lider.fichas} fichas</div>
       </div>`
    : '';

  cont.innerHTML = S.ranking.map((r,i)=>{
    const pc=i===0?'p1':i===1?'p2':i===2?'p3':'';
    const yo=S.jugador&&r.id===S.jugador.id?' yo':'';
    const adminAttr = S.isAdmin ? `data-action="toggle-pago-admin" data-id="${r.id}" style="cursor:pointer;text-decoration:underline dotted"` : '';
    const tag = r.pago
      ? `<span class="pago-tag" ${adminAttr}>PAGÓ${S.isAdmin?' ✎':''}</span>`
      : `<span class="nopago-tag" ${adminAttr}>DEBE${S.isAdmin?' ✎':''}</span>`;
    return `<div class="ranking-row${yo}" data-action="ver-pronosticos" data-id="${r.id}" style="cursor:pointer">
      <div class="ranking-pos ${pc}">${i+1}</div>
      <div class="ranking-info">
        <div class="ranking-nombre">${esc(r.nombre)} ${tag}</div>
        <div class="ranking-stats">${r.aciertos} aciertos · ${r.exactos} exactos · ${r.pendientes} pendientes</div>
      </div>
      <div class="ranking-fichas">${r.fichas}</div>
    </div>`;
  }).join('');

  actualizarSyncLabel();
}

async function verPronosticosJugador(id){
  if(!id) return;
  const cont  = document.getElementById('lista-ranking');
  const podio = document.getElementById('podio-container');
  if(!cont) return;
  cont.innerHTML='<div class="loading"><div class="spinner"></div></div>';
  podio.innerHTML='';
  const jugador = await fbGetJugador(id);
  if(!jugador){ toast('No se pudo cargar','error'); renderRanking(); return; }
  const st = calcFichas(jugador);
  podio.innerHTML=`<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
    <button class="btn-grande btn-secundario" data-action="cerrar-pronosticos-ajenos" style="flex:0 0 auto;width:auto;padding:10px 16px;font-size:14px;min-height:44px">← Volver</button>
    <div>
      <div style="font-family:var(--display);font-size:22px;color:var(--celeste);letter-spacing:1px">${esc(jugador.nombre)}</div>
      <div style="font-size:11px;color:var(--muted);font-family:var(--condensed);font-weight:600;letter-spacing:0.5px;text-transform:uppercase">${st.fichas} fichas · ${st.aciertos} aciertos · ${st.exactos} exactos</div>
    </div>
  </div>`;
  const porFecha={};
  [...FX].sort((a,b)=>parseFechaPartido(a[1],a[2]).getTime()-parseFechaPartido(b[1],b[2]).getTime()).forEach(p=>{(porFecha[p[1]]||(porFecha[p[1]]=[])).push(p);});
  let html='';
  Object.entries(porFecha).forEach(([fecha,ps])=>{
    html+=`<div class="fecha-divider">${fecha}</div>`;
    ps.forEach(p=>{html+=htmlPartidoAjeno(p,jugador);});
  });
  cont.innerHTML=html||'<div class="empty"><div class="ico">⚽</div><p>Sin pronósticos</p></div>';
  window.scrollTo({top:0,behavior:'smooth'});
}

// ============================================================
// BACKUP
// ============================================================
async function descargarBackup(){
  try{
    const jugadores = await fbGetJugadores();
    const resultados = await fbGetResultados();
    const cuotas = await fbGetCuotas();
    const FASE_BY_ID = Object.fromEntries(FX.map(p=>[p[0],p[5]]));
    const ocultas = ['qf','sf','final'];
    const dataJugadores = S.isAdmin ? jugadores : jugadores.map(j=>{
      const {pin, ...resto} = j;
      const pron = Object.fromEntries(Object.entries(j.pronosticos||{}).filter(([mid])=>{
        const fase = FASE_BY_ID[mid];
        return !(ocultas.includes(fase) && !S.resultados[mid]?.real);
      }));
      return {...resto, pronosticos: pron};
    });
    const backup = { generado:new Date().toISOString(), app:'prode-mundial-2026', tipo:S.isAdmin?'completo':'publico', jugadores:dataJugadores, resultados, cuotas };
    const blob = new Blob([JSON.stringify(backup,null,2)], {type:'application/json'});
    const a = document.createElement('a');
    const ts = new Date().toISOString().slice(0,16).replace(/[T:]/g,'-');
    a.href = URL.createObjectURL(blob);
    a.download = `prode-backup${S.isAdmin?'-completo':''}-${ts}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
    toast(`Backup descargado: ${jugadores.length} jugadores 💾`,'success');
  }catch(err){
    console.error(err);
    toast('Error al generar backup','error');
  }
}

// ============================================================
// PIN listeners
// ============================================================
const pinEl=document.getElementById('input-pin');
if(pinEl){
  pinEl.addEventListener('keydown',e=>{ if(e.key==='Enter') intentarLogin(); });
  pinEl.addEventListener('input',e=>{ if(e.target.value.length===4) setTimeout(intentarLogin,200); });
}
document.getElementById('btn-login')?.addEventListener('click', intentarLogin);

// ============================================================
// SERVICE WORKER
// ============================================================
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

// ============================================================
// AUTO-SYNC + INIT
// ============================================================
setInterval(()=>{ if(S.jugador) sincronizar(true); }, 5*60*1000);
setInterval(actualizarSyncLabel, 30000);
setInterval(()=>{ if(S.jugador){ renderInicio(); renderPartidos(); } }, 60*1000);

init().catch(e=>{
  console.error(e);
  document.getElementById('seccion-loading').innerHTML=
    '<div style="padding:40px 20px;text-align:center;color:var(--rojo)">Error al conectar con Firebase. F12 para ver detalles.</div>';
});
