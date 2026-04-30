# 🏆 Prode Mundial 26 · FORO!

Prode del Mundial USA · Canadá · México 2026 para 16 amigos.

## ⚙️ Setup inicial (5 minutos)

**ANTES DE SUBIR A GITHUB**, tenés que configurar Firebase:

👉 Seguí los pasos en **`INSTRUCCIONES-FIREBASE.md`**

## 📁 Archivos a subir a GitHub

```
prode-mundial-2026/
├── index.html
├── app.js              ← acá pegás la config de Firebase
├── manifest.json
├── sw.js
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── apple-touch-icon.png
    ├── apple-touch-icon-120.png
    ├── apple-touch-icon-152.png
    └── apple-touch-icon-167.png
```

## 🔧 Configuración

En **`app.js`** podés editar:

- `firebaseConfig`: las credenciales de tu Firebase (obligatorio)
- `JUGADORES_INICIALES`: lista de 16 nombres (modificable)
- `ADMIN_PASSWORD`: tu clave de admin (defaul: `sebasuez26`)
- `MP_LINK`: link de Mercado Pago para pago directo
- `POZO_TOTAL`, `ENTRADA`, `FICHAS_INICIALES`: parámetros del prode
- Las **cuotas** de cada partido están en el array `FIXTURE` (las podés actualizar en cualquier momento)

## 🎮 Cómo funciona

### Para los participantes
1. Abren el link → eligen su nombre
2. Primera vez: ponen un **PIN de 4 dígitos** (lo eligen ellos, queda guardado)
3. Cada vez que entran: ponen su PIN para volver a sus pronósticos
4. En "Mi Prode" tocan el equipo / empate que apuestan en cada partido
5. Tocan **"Guardar selección"** y los datos quedan en la nube
6. En "Ranking" ven la tabla actualizada

### Sistema de fichas
- Cada uno arranca con **104 fichas** (1 por partido)
- Cada apuesta cuesta **1 ficha**
- Si acertás, ganás según la **cuota** (ej: cuota 3.50 = 3.50 fichas)
- Si fallás o no apostás, **perdés la ficha**
- **Gana el que termine con más fichas**

### Admin (vos)
- Click en el candado 🔒 arriba a la izquierda → poné la clave
- También podés entrar con `tu-link.com?admin=sebasuez26`
- Como admin podés:
  - Resetear todo el prode (cuidado)
  - Cargar resultados manualmente si la sincronización falla

## 🔄 Sincronización de resultados

La app sincroniza automáticamente los resultados desde [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json), una base de datos pública del Mundial.

Cualquier participante puede tocar **"🔄 Actualizar resultados"** en la pestaña Ranking.

## 💳 Mercado Pago

El alias está configurado como `sebastiansuez.mp`. El link de MP en el código es un placeholder — para que lleve directo a tu cuenta:

1. Andá a https://www.mercadopago.com.ar/
2. Tu perfil → "Mi link de cobro"
3. Copiá tu link personalizado (algo como `https://link.mercadopago.com.ar/sebastiansuez`)
4. En `app.js` reemplazá la línea `const MP_LINK = ...` con tu link real

## 📱 Instalación como app (PWA)

Cuando los participantes abren la página en Safari (iPhone), aparece un banner para instalarla. Una vez instalada se ve y se siente como app nativa.

## 🆘 Problemas frecuentes

- **No carga nada**: revisá que pegaste bien la config de Firebase
- **"Permission denied"**: revisá las reglas de Firestore (paso 5 de las instrucciones)
- **Cambios no se sincronizan**: refrescá la pestaña con pull-down

## 📞 Soporte

Si algo no funciona, abrí la consola del navegador (F12) y mandame el error.
