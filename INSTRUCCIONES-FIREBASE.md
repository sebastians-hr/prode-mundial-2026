# 🔥 Configurar Firebase para el Prode

Tiempo estimado: **5-7 minutos**.
Es **gratis** y no necesitás tarjeta de crédito.

## 1. Crear el proyecto Firebase

1. Andá a **https://console.firebase.google.com**
2. Logueate con tu cuenta de Google (la misma que usás para Gmail)
3. Clic en **"Crear un proyecto"** (o "Add project" si está en inglés)
4. Nombre del proyecto: `prode-mundial-26` (o el que quieras)
5. **Desactivá Google Analytics** (no lo necesitás)
6. Clic en **Crear proyecto**, esperá ~30 segundos.

## 2. Crear la base de datos (Firestore)

1. En el menú lateral izquierdo → **Build** → **Firestore Database**
2. Clic en **Crear base de datos**
3. Elegí **"Comenzar en modo de prueba"** (importante, sino no funciona)
4. Ubicación: elegí **`southamerica-east1` (San Pablo)** que es la más cercana a Argentina
5. Clic en **Habilitar**

## 3. Obtener las credenciales

1. En el menú lateral → ⚙️ **Configuración del proyecto** (engranaje arriba)
2. Bajá hasta **"Tus apps"**
3. Clic en el icono `</>` (Web)
4. Apodo de la app: `Prode 26 Web`
5. **NO** marques "Configurar Firebase Hosting"
6. Clic en **Registrar app**
7. Te muestra un bloque de código con `firebaseConfig`. **Copiá ese objeto entero**, se ve así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...........",
  authDomain: "prode-mundial-26.firebaseapp.com",
  projectId: "prode-mundial-26",
  storageBucket: "prode-mundial-26.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## 4. Pegar la config en `app.js`

1. Abrí el archivo **`app.js`** del prode (en GitHub: clic en el archivo → ícono lápiz)
2. Las primeras líneas tienen esto:

```javascript
const firebaseConfig = {
  apiKey: "REEMPLAZAR_AQUI",
  authDomain: "REEMPLAZAR_AQUI.firebaseapp.com",
  ...
};
```

3. **Reemplazá todo el bloque** con el que copiaste de Firebase
4. Clic en **Commit changes** abajo

¡Listo! En 1-2 minutos la app va a funcionar conectada a tu Firebase.

## 5. Reglas de seguridad (importante)

Para evitar que alguien rompa la base de datos:

1. En Firestore → pestaña **Reglas**
2. Reemplazá el contenido por esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cualquiera autenticado puede leer/escribir
    // (es un prode entre amigos, no banco)
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Clic en **Publicar**

⚠️ **Esto es laxo a propósito** porque la app no tiene login real (solo PIN de 4 dígitos). Para 16 amigos confiables alcanza. Si querés algo más estricto, avisame.

## 6. ¿Cuánto cuesta?

**Gratis** para tu uso. El plan gratuito de Firebase incluye:
- 50.000 lecturas / día
- 20.000 escrituras / día
- 1 GB de almacenamiento

Tu prode con 16 amigos no va a llegar ni al 5% de ese límite. **No te van a cobrar nada.**

## 7. ¿Algo no funciona?

Errores comunes:
- **"Permission denied":** revisá el paso 5 (reglas)
- **"Firebase: Error (auth/...)":** revisá que copiaste bien el `firebaseConfig`
- **La app dice "Configurá Firebase":** todavía no pegaste la config en `app.js`

Si algo se rompe, abrí la consola del navegador (F12 → Console) y mandame el error.
