// ============================================================
// PRODE MUNDIAL 26 · FORO!
// Event delegation: TODOS los clicks se manejan acá abajo
// ============================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import {
  getFirestore, doc, getDoc, setDoc, updateDoc,
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

const JUGADORES = [
  'Sebastián Suez','Dario Vulpes','Alexis Wolff','Axel Meunier',
  'Felix Llambias','Inda Videla','Ivan Kerchen','Lucas Pistoia',
  'Martin Picasso','Mati Antolin','Maxi Suez','Pedro Wolson',
  'Santi Teitel','Walter Korn','Zucho Ramos Mejia','~Du',
  'Kevin Levy'
];

const ADMIN_PASS = 'sebasuez26';
const MP_LINK = 'https://mpago.la/2zZxFZx';
const FICHAS_INICIALES = 104;
const ENTRADA = 50000;

// ============================================================
// FIREBASE
// ============================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
// EQUIPOS
// ============================================================
const EQ = {
  MEX:{n:'México',f:'🇲🇽'}, RSA:{n:'Sudáfrica',f:'🇿🇦'}, KOR:{n:'Corea Sur',f:'🇰🇷'}, CZE:{n:'Chequia',f:'🇨🇿'},
  CAN:{n:'Canadá',f:'🇨🇦'}, SUI:{n:'Suiza',f:'🇨🇭'}, QAT:{n:'Qatar',f:'🇶🇦'}, BIH:{n:'Bosnia',f:'🇧🇦'},
  BRA:{n:'Brasil',f:'🇧🇷'}, MAR:{n:'Marruecos',f:'🇲🇦'}, HAI:{n:'Haití',f:'🇭🇹'}, SCO:{n:'Escocia',f:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
  USA:{n:'EE.UU.',f:'🇺🇸'}, PAR:{n:'Paraguay',f:'🇵🇾'}, AUS:{n:'Australia',f:'🇦🇺'}, TUR:{n:'Turquía',f:'🇹🇷'},
  GER:{n:'Alemania',f:'🇩🇪'}, CUW:{n:'Curazao',f:'🇨🇼'}, CIV:{n:'C.Marfil',f:'🇨🇮'}, ECU:{n:'Ecuador',f:'🇪🇨'},
  NED:{n:'P.Bajos',f:'🇳🇱'}, JPN:{n:'Japón',f:'🇯🇵'}, TUN:{n:'Túnez',f:'🇹🇳'}, SWE:{n:'Suecia',f:'🇸🇪'},
  BEL:{n:'Bélgica',f:'🇧🇪'}, EGY:{n:'Egipto',f:'🇪🇬'}, IRN:{n:'Irán',f:'🇮🇷'}, NZL:{n:'N.Zelanda',f:'🇳🇿'},
  ESP:{n:'España',f:'🇪🇸'}, CPV:{n:'Cabo Verde',f:'🇨🇻'}, KSA:{n:'Arabia S.',f:'🇸🇦'}, URU:{n:'Uruguay',f:'🇺🇾'},
  FRA:{n:'Francia',f:'🇫🇷'}, SEN:{n:'Senegal',f:'🇸🇳'}, IRQ:{n:'Irak',f:'🇮🇶'}, NOR:{n:'Noruega',f:'🇳🇴'},
  ARG:{n:'Argentina',f:'🇦🇷'}, ALG:{n:'Argelia',f:'🇩🇿'}, AUT:{n:'Austria',f:'🇦🇹'}, JOR:{n:'Jordania',f:'🇯🇴'},
  POR:{n:'Portugal',f:'🇵🇹'}, COD:{n:'RD Congo',f:'🇨🇩'}, UZB:{n:'Uzbekistán',f:'🇺🇿'}, COL:{n:'Colombia',f:'🇨🇴'},
  ENG:{n:'Inglaterra',f:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'}, CRO:{n:'Croacia',f:'🇭🇷'}, GHA:{n:'Ghana',f:'🇬🇭'}, PAN:{n:'Panamá',f:'🇵🇦'}
};

// ============================================================
// FIXTURE  [id, fecha, hora, local, visit, fase, grupo, cL, cE, cV]
// ============================================================
const FX = [
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

// ============================================================
// ESTADO
// ============================================================
const S = {
  jugador: null,
  isAdmin: false,
  misPron: {},        // pronósticos en edición
  pronGuardados: {},  // últimos guardados en Firebase
  resultados: {},
  ranking: [],
  ultimaSinc: null,
  faseFiltro: 'todos',
  dirty: false        // hay cambios sin guardar
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

// ============================================================
// NAVEGACIÓN — función central, NO depende de window
// ============================================================
function irA(tab){
  if(S.dirty && tab !== 'mi-prode'){
    if(!confirm('Tenés cambios sin guardar. ¿Salir igual?')){
      return;
    }
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
// EVENT DELEGATION — UN SOLO LISTENER PARA TODA LA APP
// ============================================================
document.addEventListener('click', e=>{
  const t = e.target.closest('[data-nav]');
  const a = e.target.closest('[data-action]');
  const ap = e.target.closest('[data-apuesta]');
  const fase = e.target.closest('[data-fase]');
  const admin = e.target.closest('#btn-admin');
  const hero = e.target.closest('#hero-header');

  // Navegación (data-nav)
  if(t){
    e.stopPropagation();
    irA(t.dataset.nav);
    return;
  }

  // Hero → inicio
  if(hero && !admin){
    irA('inicio');
    return;
  }

  // Admin toggle
  if(admin){
    e.stopPropagation();
    toggleAdmin();
    return;
  }

  // Filtros de fase
  if(fase){
    S.faseFiltro = fase.dataset.fase;
    renderPartidos();
    return;
  }

  // Apuestas de partidos
  if(ap){
    const {id, op} = ap.dataset;
    if(!id || !op) return;
    if(S.misPron[id]===op){ delete S.misPron[id]; }
    else { S.misPron[id] = op; }
    S.dirty = true;
    renderPartidos();
    return;
  }

  // Acciones (data-action)
  if(a){
    const ac = a.dataset.action;
    if(ac==='pagar')         { window.open(MP_LINK,'_blank'); return; }
    if(ac==='cerrar-sesion') { cerrarSesion(); return; }
    if(ac==='guardar')       { guardarSeleccion(); return; }
    if(ac==='sincronizar')   { sincronizar(false); return; }
    if(ac==='login')         { intentarLogin(); return; }
    if(ac==='modo-arbitro')  { alert('Usá la sincronización automática o editá resultados directamente en Firebase Console.'); return; }
    if(ac==='agregar-participante') { agregarParticipante(); return; }
    if(ac==='eliminar-participante') { eliminarParticipante(); return; }
    if(ac==='resetear')      { resetearTodo(); return; }
  }
});

// ============================================================
// FIREBASE: helpers
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
async function fbUpdatePronosticos(id,pron){
  await updateDoc(doc(db,'jugadores',id),{pronosticos:pron, ts:new Date().toISOString()});
}
async function fbGetResultados(){
  const s = await getDoc(doc(db,'resultados','main'));
  return s.exists() ? (s.data().resultados||{}) : {};
}
async function fbSetResultados(r){
  await setDoc(doc(db,'resultados','main'),{resultados:r, ts:new Date().toISOString()});
}

// ============================================================
// INICIALIZACIÓN
// ============================================================
async function init(){
  // Verificar admin por URL
  const params = new URLSearchParams(location.search);
  if(params.get('admin')===ADMIN_PASS){
    S.isAdmin=true;
    sessionStorage.setItem('pa','1');
  } else if(sessionStorage.getItem('pa')==='1'){
    S.isAdmin=true;
  }
  aplicarAdmin();

  // Inicializar jugadores en Firebase si están vacíos
  const snap = await getDocs(collection(db,'jugadores'));
  if(snap.empty){
    for(const nombre of JUGADORES){
      const id = mkId(nombre);
      await setDoc(doc(db,'jugadores',id),{
        id,nombre,pin:'',pago:false,pronosticos:{},
        fechaCreacion:new Date().toISOString()
      });
    }
  }

  // Cargar jugadores en el select
  const jugadores = await fbGetJugadores();
  jugadores.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  const sel = document.getElementById('select-jugador');
  sel.innerHTML = '<option value="">— Elegí tu nombre —</option>' +
    jugadores.map(j=>`<option value="${j.id}">${esc(j.nombre)}${!j.pin?' · primera vez':''}</option>`).join('');

  // Sesión guardada?
  try{
    const g = JSON.parse(localStorage.getItem('ps')||'null');
    if(g){
      const j = jugadores.find(x=>x.id===g.id && x.pin===g.pin);
      if(j){ await iniciarSesion(j); return; }
    }
  }catch(e){}

  // Mostrar login
  document.getElementById('seccion-loading').style.display='none';
  document.getElementById('sec-login').classList.add('active');
}

// ============================================================
// LOGIN
// ============================================================
async function intentarLogin(){
  const id  = document.getElementById('select-jugador').value;
  const pin = document.getElementById('input-pin').value;
  if(!id)            { toast('Elegí tu nombre','error'); return }
  if(!/^\d{4}$/.test(pin)) { toast('PIN de 4 dígitos','error'); return }

  const j = await fbGetJugador(id);
  if(!j){ toast('Jugador no encontrado','error'); return }

  if(!j.pin){
    if(!confirm(`Usarás el PIN "${pin}" para siempre.\n⚠️ Anotalo, no se puede recuperar.`)) return;
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
  S.jugador = j;
  S.pronGuardados = j.pronosticos||{};
  S.misPron = {...S.pronGuardados};
  S.dirty = false;
  localStorage.setItem('ps', JSON.stringify({id:j.id,pin:j.pin}));

  S.resultados = await fbGetResultados();
  await recalcRanking();

  document.getElementById('seccion-loading').style.display='none';
  document.getElementById('sec-login').classList.remove('active');
  document.getElementById('bottom-nav').style.display='grid';

  irA('inicio');
  toast('Hola '+j.nombre.split(' ')[0]+'!','success');
  sincronizar(true);
}

function cerrarSesion(){
  if(!confirm('¿Salir? Vas a necesitar tu PIN para volver a entrar.')) return;
  localStorage.removeItem('ps');
  location.reload();
}

// ============================================================
// ADMIN
// ============================================================
function toggleAdmin(){
  if(S.isAdmin){
    if(!confirm('¿Salir del modo admin?')) return;
    S.isAdmin=false;
    sessionStorage.removeItem('pa');
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
  if(!nombre || !nombre.trim()) return;
  const nombreLimpio = nombre.trim();
  const id = mkId(nombreLimpio);

  const existe = await fbGetJugador(id);
  if(existe){ toast('Ya existe un jugador con ese nombre','error'); return; }

  await setDoc(doc(db,'jugadores',id),{
    id, nombre:nombreLimpio, pin:'', pago:false,
    pronosticos:{}, fechaCreacion:new Date().toISOString()
  });

  const sel = document.getElementById('select-jugador');
  const opt = document.createElement('option');
  opt.value = id;
  opt.textContent = nombreLimpio + ' · primera vez';
  sel.appendChild(opt);

  await actualizarPozo();
  await recalcRanking();
  toast(`✓ ${nombreLimpio} agregado`, 'success');
}

async function eliminarParticipante(){
  // Cargar lista actualizada
  const jugadores = await fbGetJugadores();
  jugadores.sort((a,b)=>a.nombre.localeCompare(b.nombre));

  // Armar lista numerada para mostrar en prompt
  const lista = jugadores.map((j,i)=>`${i+1}. ${j.nombre}`).join('\n');
  const respuesta = prompt(`¿Qué número querés eliminar?\n\n${lista}`);
  if(!respuesta) return;

  const idx = parseInt(respuesta) - 1;
  if(isNaN(idx) || idx < 0 || idx >= jugadores.length){
    toast('Número inválido','error');
    return;
  }

  const j = jugadores[idx];

  // No permitir eliminar al jugador activo
  if(S.jugador && j.id === S.jugador.id){
    toast('No podés eliminarte a vos mismo','error');
    return;
  }

  if(!confirm(`¿Eliminar a ${j.nombre}?\n\nSe borrarán todos sus pronósticos. No se puede deshacer.`)) return;

  // Borrar de Firebase
  const { deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js');
  await deleteDoc(doc(db,'jugadores',j.id));

  // Actualizar el select de login
  const sel = document.getElementById('select-jugador');
  const opt = sel.querySelector(`option[value="${j.id}"]`);
  if(opt) opt.remove();

  await actualizarPozo();
  await recalcRanking();
  toast(`✓ ${j.nombre} eliminado`, 'success');
}

// ============================================================
// SINCRONIZACIÓN
// ============================================================
const SYNC_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';
const N2C = {
  'Mexico':'MEX','South Africa':'RSA','South Korea':'KOR','Czech Republic':'CZE','Czechia':'CZE',
  'Canada':'CAN','Switzerland':'SUI','Qatar':'QAT','Bosnia and Herzegovina':'BIH',
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
      if(!prev||prev.real!==real){S.resultados[p[0]]={real,gL,gV};n++;}
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
// CÁLCULO DE FICHAS
// ============================================================
function calcFichas(j){
  let fichas=FICHAS_INICIALES, aciertos=0, fallados=0, sinApostar=0, pendientes=0;
  const pron=j.pronosticos||{};
  FX.forEach(p=>{
    const r=S.resultados[p[0]];
    if(r?.real){
      fichas-=1;
      const ap=pron[p[0]];
      if(ap===r.real){ fichas+=({'1':p[7],'X':p[8],'2':p[9]})[ap]||1; aciertos++; }
      else if(ap) fallados++;
      else sinApostar++;
    } else pendientes++;
  });
  return {fichas:Math.round(fichas*100)/100, aciertos, fallados, sinApostar, pendientes};
}

async function recalcRanking(){
  const todos=await fbGetJugadores();
  S.ranking=todos.map(j=>({id:j.id,nombre:j.nombre,pago:j.pago,...calcFichas(j)}))
    .sort((a,b)=>b.fichas-a.fichas||b.aciertos-a.aciertos);
  renderRanking();
  renderUserBars();
}

// ============================================================
// RENDER: USER BAR
// ============================================================
function renderUserBars(){
  if(!S.jugador) return;
  const stats=calcFichas(S.jugador);
  const html=`<div class="user-bar">
    <div class="user-avatar">${S.jugador.nombre.charAt(0).toUpperCase()}</div>
    <div class="user-info">
      <div class="user-name">${esc(S.jugador.nombre)}</div>
      <div class="user-stats">${stats.aciertos} aciertos · ${stats.pendientes} pendientes</div>
    </div>
    <div class="fichas-badge">${stats.fichas} <span style="font-size:11px;font-family:var(--condensed)">FICHAS</span></div>
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
  const debut=new Date('2026-06-11T16:00:00-03:00');
  const dias=Math.max(0,Math.ceil((debut-Date.now())/86400000));
  const el=document.getElementById('dias-restantes');
  if(el) el.textContent=dias;

  // Pozo dinámico basado en cantidad de jugadores
  actualizarPozo();
}

async function actualizarPozo(){
  const jugadores = await fbGetJugadores();
  const total = jugadores.length * ENTRADA;
  const el = document.getElementById('pozo-monto');
  const info = document.getElementById('pozo-info');
  if(el) el.textContent = '$' + total.toLocaleString('es-AR');
  if(info) info.textContent = `${jugadores.length} jugadores × $${ENTRADA.toLocaleString('es-AR')} · El campeón se lleva todo`;
}

// ============================================================
// RENDER: PARTIDOS
// ============================================================
function renderPartidos(){
  renderUserBars();
  const cont=document.getElementById('lista-partidos');
  if(!cont) return;

  let lista=S.faseFiltro==='todos' ? FX : FX.filter(p=>p[5]===S.faseFiltro);

  // Agrupar por fecha
  const porFecha={};
  lista.forEach(p=>{ (porFecha[p[1]]||(porFecha[p[1]]=[])).push(p); });

  let html='';
  Object.entries(porFecha).forEach(([fecha,ps])=>{
    html+=`<div class="fecha-divider">${fecha}</div>`;
    ps.forEach(p=>{ html+=htmlPartido(p); });
  });

  cont.innerHTML = html || '<div class="empty"><div class="ico">⚽</div><p>Sin partidos en esta fase</p></div>';

  // Actualizar filtros
  document.querySelectorAll('#filtros-fase .filtro').forEach(b=>{
    b.classList.toggle('active', b.dataset.fase===S.faseFiltro);
    const fase=b.dataset.fase;
    const labels={todos:'Todos',grupos:'Grupos',r32:'R32',r16:'Octavos',qf:'Cuartos',sf:'Semis',final:'Final'};
    if(fase!=='todos' && S.jugador){
      const ps=FX.filter(p=>p[5]===fase);
      const pend=ps.filter(p=>!S.resultados[p[0]]&&!S.misPron[p[0]]&&!p[3].startsWith('?')).length;
      b.innerHTML=labels[fase]+(pend>0?` <span class="pendiente">${pend}</span>`:'');
    } else {
      b.innerHTML=labels[fase]||fase;
    }
  });

  // Botón guardar
  const btn=document.getElementById('btn-guardar');
  if(btn){
    btn.textContent=S.dirty?'💾 Guardar selección':'✓ Selección guardada';
    btn.disabled=!S.dirty;
    btn.style.opacity=S.dirty?'1':'0.6';
  }
}

function htmlPartido(p){
  const [id,fecha,hora,lc,vc,fase,grupo,cL,cE,cV]=p;
  const L=EQ[lc]||{n:lc.replace('?',''),f:'❓'};
  const V=EQ[vc]||{n:vc.replace('?',''),f:'❓'};
  const ph=lc.startsWith('?')||vc.startsWith('?');
  const mia=S.misPron[id];
  const real=S.resultados[id];
  const cerrado=!!real;

  const clase=cerrado?(mia===real.real?'acertado':(mia?'fallado':'cerrado')):(mia?'guardado':'');
  const gt=fase==='grupos'?`Grupo ${grupo}`:({r32:'R32',r16:'Octavos',qf:'Cuartos',sf:'Semis',final:grupo==='FINAL'?'FINAL':'3er Puesto'})[fase]||fase;
  const rtag=real?`<span class="resultado-real">${real.gL}-${real.gV}</span>`:'';

  let pago='';
  if(cerrado&&mia){
    pago=mia===real.real
      ?`<div class="partido-resultado-pago gano">✓ Acertaste · +${({'1':cL,'X':cE,'2':cV})[mia]} fichas</div>`
      :`<div class="partido-resultado-pago perdio">✗ Fallaste · -1 ficha</div>`;
  } else if(cerrado&&!mia){
    pago=`<div class="partido-resultado-pago perdio">✗ No apostaste · -1 ficha</div>`;
  }

  const dis=(cerrado||ph)?'disabled':'';

  const btnCls=(op)=>{
    let c='btn-apuesta'+(op==='X'?' empate':'');
    if(mia===op) c+=' elegida';
    if(cerrado&&mia===op) c+=real.real===op?' acertado':' fallado';
    return c;
  };

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
    ${pago}
  </div>`;
}

// ============================================================
// GUARDAR PRONÓSTICOS
// ============================================================
async function guardarSeleccion(){
  if(!S.jugador) return;
  if(!S.dirty){ toast('Sin cambios para guardar'); return; }
  const btn=document.getElementById('btn-guardar');
  if(btn){ btn.textContent='💾 Guardando...'; btn.disabled=true; }
  try{
    await fbUpdatePronosticos(S.jugador.id, S.misPron);
    S.pronGuardados={...S.misPron};
    S.jugador.pronosticos=S.misPron;
    S.dirty=false;
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
  const cont=document.getElementById('lista-ranking');
  const podio=document.getElementById('podio-container');
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

  cont.innerHTML=S.ranking.map((r,i)=>{
    const pc=i===0?'p1':i===1?'p2':i===2?'p3':'';
    const yo=S.jugador&&r.id===S.jugador.id?' yo':'';
    const tag=r.pago?'<span class="pago-tag">PAGÓ</span>':'<span class="nopago-tag">DEBE</span>';
    return `<div class="ranking-row${yo}">
      <div class="ranking-pos ${pc}">${i+1}</div>
      <div class="ranking-info">
        <div class="ranking-nombre">${esc(r.nombre)} ${tag}</div>
        <div class="ranking-stats">${r.aciertos} aciertos · ${r.fallados} fallos · ${r.pendientes} pendientes</div>
      </div>
      <div class="ranking-fichas">${r.fichas}</div>
    </div>`;
  }).join('');
  actualizarSyncLabel();
}

// ============================================================
// RESET (admin)
// ============================================================
async function resetearTodo(){
  if(!S.isAdmin){ toast('Solo admin','error'); return; }
  if(!confirm('⚠️ ¿BORRAR TODO? Pronósticos, PINs y resultados.\nNO se puede deshacer.')) return;
  if(!confirm('¿Seguro?')) return;
  for(const nombre of JUGADORES){
    const id=mkId(nombre);
    await setDoc(doc(db,'jugadores',id),{id,nombre,pin:'',pago:false,pronosticos:{},fechaCreacion:new Date().toISOString()});
  }
  await setDoc(doc(db,'resultados','main'),{resultados:{}});
  localStorage.removeItem('ps');
  sessionStorage.removeItem('pa');
  setTimeout(()=>location.reload(),500);
}

// ============================================================
// PIN: enter y auto-submit a 4 dígitos
// ============================================================
const pinInput=document.getElementById('input-pin');
if(pinInput){
  pinInput.addEventListener('keydown',e=>{ if(e.key==='Enter') intentarLogin(); });
  pinInput.addEventListener('input',e=>{ if(e.target.value.length===4) setTimeout(intentarLogin,200); });
}
document.getElementById('btn-login')?.addEventListener('click', intentarLogin);

// ============================================================
// SERVICE WORKER
// ============================================================
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

// ============================================================
// AUTO-SYNC cada 5 minutos + INIT
// ============================================================
setInterval(()=>{ if(S.jugador) sincronizar(true); }, 5*60*1000);
setInterval(actualizarSyncLabel, 30000);
setInterval(()=>{ if(S.jugador) renderInicio(); }, 60000);

init().catch(e=>{
  console.error(e);
  document.getElementById('seccion-loading').innerHTML=
    '<div style="padding:40px 20px;text-align:center;color:var(--rojo)">Error al conectar con Firebase. Revisá la consola (F12).</div>';
});
