# NellyKit — Tienda E-Commerce Móvil-First de Alto Rendimiento

Tienda online oficial para **NellyKit**, especializada en la venta artesanal de portamaquillajes, portacosméticos y bolsos diarios de confección 100% manual con amor y dedicación por Nelly.

Desarrollada con **Next.js 14**, **Tailwind CSS**, tokens de diseño **Slash (Dark/Light luxury)**, accesibilidad **WCAG 2.1 AAA**, ciberseguridad **OWASP** y sincronización dinámica con **Google Sheets**.

---

## 🌟 Características Principales

### 1. Experiencia de Bienvenida y Selector de Perfil
- **Pantalla de bienvenida:** Logo corporativo responsivo (tema claro y oscuro) con presentación artesanal.
- **Acceso Dual:**
  - **Ver precios por menor:** Compra individual unitaria para uso diario o regalo.
  - **Ver precios por mayor:** Precios mayoristas desde 3 unidades, souvenirs y eventos.
- **Programa de Reventa ("PRÓXIMAMENTE..."):**
  - Botón destacado: *"Generar ingresos, ver precios de reventa"*.
  - Modal clasificador de leads (Nombre, correo, canal de venta comercial o redes, y zona geográfica).
  - Envío automático de solicitud a WhatsApp preformateado.
- **Pantalla de Carga de Transición:**
  - Microsegundos con animación suave, saludo *"¡Bienvenidos!"* y logotipo mientras se inicializa el catálogo.

### 2. Experiencia Central de Catálogo (Mobile-First)
- **Historias de Instagram (Categorías circulares superiores):**
  - Círculos táctiles con anillo degradado activo, avatar en miniatura y ancla suave (`#estuches-de-maquillaje`, `#bolsos-diarios`).
- **Grilla de 2 Productos por Fila:**
  - Adaptada fielmente a la referencia de diseño (2 columnas en móvil, escalable a tablet/desktop).
  - **Carrusel deslizante dentro de cada tarjeta:** El usuario puede deslizar fotos hacia la izquierda y derecha directamente en el feed.
  - Insignia de video artesanal para modelos con demostración en video (`.mp4`).
  - Badges superiores: `DISPONIBLE` / `AGOTADO`, `MÁS VENDIDO`, `¡ÚLTIMA UNIDAD!`, `TOP VENTAS`.
  - Calificación de estrellas (★ 5.0) y contador de ventas (+42 vendidos).
  - Precios reales tachados y precios con oferta.
  - **Selector de unidades mayoristas interactivo:**
    - `3 unidades` (por defecto)
    - `10 unidades`
    - `Souvenir 20 unidades`
    - `Souvenir 30 unidades`
    - `Souvenir más de 30 unidades (Cotizar)`
  - **Acciones Rápidas:**
    - `+ Ver producto`: Modal de detalles, galería en alta resolución, reproductor de video, medidas, detalles de confección y caja para compartir enlace con botón de copiar al portapapeles y Web Share API nativa.
    - `+ Hacer pedido`: Modal emergente con nombre, selección de medio de pago (Transferencia o Mercado Pago), retiro o punto de encuentro, confirmación explícita para compras mayoristas y redirección al WhatsApp oficial (`+5491134310840`).

### 3. Módulo Legal y Ciberseguridad (OWASP)
- **Header Sticky:** Logotipo, conmutador Minorista/Mayorista, botón de modo oscuro/claro y botón de WhatsApp directo.
- **Footer Completo:**
  - *Sobre Mí:* Historia del taller y confección manual por Nelly.
  - *Medios de Pago:* Transferencia Bancaria y Mercado Pago.
  - *Términos del Servicio:* Confirmación por WhatsApp, seña del 50% y 50% antes de la entrega.
  - *Políticas de Devolución:* Piezas únicas 100% artesanales sin devolución ni garantía post-entrega.
  - *Políticas de Privacidad:* Seguridad y uso exclusivo de datos.
- **Cookie Consent Banner:** Banner accesible para cumplimiento de privacidad con persistencia en `localStorage`.
- **Cabeceras HTTP de Seguridad:** Content Security Policy, HSTS, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy y Permissions-Policy en `next.config.mjs`.
- **SEO Técnico:** `robots.txt`, `sitemap.xml` dinámico, etiquetas Open Graph, Twitter Cards y marcado JSON-LD estructurado de Schema.org para tiendas de artesanía.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS con tokens Slash (Obsidian `#08080a`, Onyx `#0f1015`, Copper `#cc9166`, Brand Red `#e53935`)
- **Iconografía:** Lucide React
- **Animaciones y Microinteracciones:** Canvas Confetti y CSS transitions
- **Hosting y Despliegue:** Vercel
- **Sincronización:** Google Apps Script + Google Sheets

---

## 🚀 Despliegue en Vercel y GitHub

### 1. Inicializar repositorio Git local
```bash
git init
git add .
git commit -m "feat: NellyKit mobile-first high performance e-commerce"
```

### 2. Subir a GitHub
1. Crea un nuevo repositorio en [github.com/new](https://github.com/new) llamado `nellykit-ecommerce`.
2. Conecta tu repositorio local y sube los cambios:
```bash
git remote add origin https://github.com/TU_USUARIO/nellykit-ecommerce.git
git branch -M main
git push -u origin main
```

### 3. Desplegar en Vercel (1 Clic)
1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **Add New...** > **Project**.
3. Importa el repositorio `nellykit-ecommerce`.
4. En las variables de entorno (Environment Variables), puedes agregar de forma opcional:
   - `NEXT_PUBLIC_SHEET_API_URL`: Tu URL de Google Apps Script (`https://script.google.com/macros/s/.../exec`).
5. Haz clic en **Deploy**. En menos de 60 segundos tu sitio estará online en producción con certificado SSL y CDN global.

---

## 📊 Conexión con Google Sheets (Google Apps Script)

Consulta la guía detallada con capturas e instrucciones paso a paso en:
👉 [`google-apps-script/INSTRUCCIONES.md`](file:///c:/Users/ALAN/Desktop/Landing%20mama/google-apps-script/INSTRUCCIONES.md)

El código listo para copiar y pegar se encuentra en:
👉 [`google-apps-script/Code.gs`](file:///c:/Users/ALAN/Desktop/Landing%20mama/google-apps-script/Code.gs)
