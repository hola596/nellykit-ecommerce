# Guía Paso a Paso: Configuración de Google Apps Script para NellyKit

Esta guía te permite conectar tu Google Sheet de productos directamente con tu tienda online para que cualquier cambio en precios, stock o nuevos productos se refleje automáticamente.

---

### Paso 1: Abrir el editor de Apps Script
1. En tu hoja de cálculo de Google Sheets donde tienes las pestañas `Estuches de maquillaje` y `Bolsos diarios`:
2. Haz clic en el menú superior: **Extensiones** > **Apps Script**.
   *(O ve a la pestaña que ya tienes abierta en el navegador: `script.google.com`).*

---

### Paso 2: Pegar el código
1. En el archivo `Código.gs`, borra cualquier contenido que haya (como `function myFunction() {}`).
2. Copia todo el contenido del archivo [`google-apps-script/Code.gs`](file:///c:/Users/ALAN/Desktop/Landing%20mama/google-apps-script/Code.gs) y pégalo ahí.
3. Haz clic en el icono del **Disquete (Guardar)** o presiona `Ctrl + S`.
4. Puedes cambiarle el nombre al proyecto arriba a la izquierda (por ejemplo: `NellyKit API`).

---

### Paso 3: Implementar como Aplicación Web
1. Arriba a la derecha, haz clic en el botón azul grande **Implementar** (Deploy) > **Nueva implementación**.
2. En el engranaje ⚙️ (Seleccionar tipo), elige **Aplicación web**.
3. Configura los siguientes campos:
   - **Descripción:** `Catálogo NellyKit v1`
   - **Ejecutar como:** `Yo (tu correo electrónico)`
   - **Quién tiene acceso:** **Cualquiera** *(muy importante: "Cualquiera" o "Anyone", para que tu tienda pueda leer los datos sin pedir login).*
4. Haz clic en **Implementar**.
5. Google te pedirá "Autorizar acceso" la primera vez:
   - Selecciona tu cuenta de Google.
   - Haz clic en *Avanzado* (Configuración avanzada).
   - Haz clic en *Ir a NellyKit API (no seguro)* y luego en *Permitir*.
6. Copia la **URL de la aplicación web** que termina en `/exec`. Ejemplo:
   `https://script.google.com/macros/s/AKfycbx.../exec`

---

### Paso 4: Conectar con tu Tienda
1. En el proyecto de tu tienda, en el archivo `.env.local`:
   ```bash
   NEXT_PUBLIC_SHEET_API_URL="https://script.google.com/macros/s/TU_URL_DE_APPS_SCRIPT/exec"
   ```
2. ¡Listo! La tienda leerá automáticamente los productos desde tu hoja de cálculo.
3. **¿Cómo agregar una categoría nueva en el futuro?**
   Solo creas una nueva pestaña en tu Google Sheet (ejemplo: `Cartucheras`, `Billeteras`), agregas las mismas columnas (`Código`, `Título`, `Descripción`, `Stock`, `Precio por unidad`, etc.) y la tienda la reconocerá automáticamente como una nueva historia y sección con ancla.
