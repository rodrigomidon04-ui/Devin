# MUNDO CARTÓN

Página para chicos y familias con dos partes:

- **Videos**: dibujos y tutoriales para hacer cosas con cartón reciclado
  (juguetes, muebles, decoración y trucos). Podés pegar un enlace de YouTube o
  subir el archivo del video.
- **Tienda**: productos hechos con cartón (desde juguetes hasta muebles). Quien
  entra arma su pedido en el carrito y lo envía por **WhatsApp**.

Cualquiera que entre **ve** la página. Solo vos, después de **iniciar sesión**,
podés cargar o borrar videos y productos.

Si todavía no configuraste Supabase, la página abre en **modo demo** con
contenido de ejemplo: podés probar todo, pero lo que cargues queda guardado solo
en tu navegador.

El estilo (damero blanco y negro, tipografía gruesa y colores fuertes) está
inspirado en los canales de dibujos animados.

---

## Paso 1 · Preparar Supabase (una sola vez)

1. Entrá a [supabase.com](https://supabase.com) y abrí tu proyecto (o creá uno).
2. En el menú izquierdo elegí **SQL Editor → New query**.
3. Copiá y pegá todo el contenido de `mundo-carton/supabase/schema.sql`,
   **cambiá `TU-CORREO@ejemplo.com` por tu correo** y tocá **Run**. Eso crea las
   tablas `videos` y `products`, el bucket `mundo-carton` y los permisos.
4. Andá a **Authentication → Users → Add user** y creá tu usuario con tu correo y
   una contraseña (marcá "Auto confirm user").
5. Andá a **Project Settings → API** y copiá el **Project URL** y la
   **anon public key**.

## Paso 2 · Publicar en Netlify

1. Entrá a [app.netlify.com](https://app.netlify.com) → **Add new site → Import
   an existing project** → elegí GitHub y este repositorio.
2. En **Base directory** poné `mundo-carton` (el resto lo lee de
   `mundo-carton/netlify.toml`: build `npm run build`, publish `dist`).
3. En **Site configuration → Environment variables** agregá:

   | Nombre | Valor |
   | --- | --- |
   | `VITE_SUPABASE_URL` | el Project URL de Supabase |
   | `VITE_SUPABASE_ANON_KEY` | la anon public key |
   | `VITE_WHATSAPP_NUMBER` | tu WhatsApp con código de país, solo números (ej. `59899123456`) |
   | `VITE_OWNER_EMAIL` | tu correo: solo esa cuenta ve los botones de subir y borrar |
   | `VITE_SITE_TITLE` | el título que querés mostrar (opcional) |
   | `VITE_SITE_SUBTITLE` | la frase debajo del título (opcional) |

4. Tocá **Deploy site**. Si cambiás una variable después, hacé **Deploys →
   Trigger deploy → Clear cache and deploy site**.

## Paso 3 · Usar la página

1. Abrí la página y tocá **Entrar** (arriba a la derecha).
2. Con la sección **Videos** abierta, el botón **+ Video** sube un video: pegás
   el enlace de YouTube o elegís el archivo, ponés título y categoría.
3. Con la sección **Tienda** abierta, el botón **+ Producto** publica un producto
   con nombre, precio, edad recomendada, foto y descripción.
4. Para borrar algo, tocá la papelera en la esquina de la tarjeta.
5. Los pedidos llegan a tu WhatsApp: el visitante agrega productos, abre
   **Pedido** y toca **Encargar por WhatsApp**.

Límite de subida: 50 MB por archivo (en modo demo, mucho menos: el navegador
guarda poco espacio, así que conviene usar enlaces de YouTube).

---

## Desarrollo local (opcional)

```bash
cd mundo-carton
npm install
cp .env.example .env   # completá las variables
npm run dev            # http://localhost:5173
```

Otros comandos: `npm run build`, `npm run lint`, `npm run typecheck`.

Stack: React + TypeScript + Vite + Tailwind CSS + Supabase.
