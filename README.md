# Mi Portfolio

Página web personal para mostrar tu portfolio: subís imágenes (PNG, JPG, WEBP),
archivos de texto (TXT, MD), PDF, videos (MP4, WEBM, MOV) y enlaces a otras
páginas. Funciona en celular, tablet y computadora.

Además tiene buscador, categorías propias, edición de lo ya subido, orden manual
de las tarjetas, tema claro/oscuro y perfil (nombre, descripción y foto)
editable desde la misma página.

- Cualquiera que entre a la página **ve** tu portfolio.
- Solo vos, después de **iniciar sesión**, podés agregar o borrar cosas.
- Los archivos se guardan en **Supabase**; la página se publica en **Netlify**.

Si todavía no configuraste Supabase, la página abre en **modo demo**: podés
probar todo, pero los archivos quedan guardados solo en tu navegador.

---

## Paso 1 · Preparar Supabase (una sola vez)

1. Entrá a [supabase.com](https://supabase.com) y abrí tu proyecto (o creá uno).
2. En el menú izquierdo elegí **SQL Editor → New query**.
3. Copiá y pegá todo el contenido del archivo `supabase/schema.sql` de este
   repositorio, **cambiá `TU-CORREO@ejemplo.com` por tu correo** (solo ese
   correo va a poder subir y borrar) y tocá **Run**. Eso crea la tabla `items`,
   el bucket `portfolio` y los permisos.
4. Andá a **Authentication → Users → Add user** y creá tu usuario con tu correo
   y una contraseña (marcá "Auto confirm user"). Con ese usuario vas a entrar a
   la página para subir cosas.
5. Si ya habías corrido `schema.sql` antes, corré también
   `supabase/migration-2.sql` de la misma forma (agrega categorías, orden,
   PDF/video y la tabla del perfil).
6. Andá a **Project Settings → API** y copiá dos datos:
   - **Project URL** (algo como `https://abcdefg.supabase.co`)
   - **anon public key** (una clave larga)

## Paso 2 · Publicar en Netlify

1. Entrá a [app.netlify.com](https://app.netlify.com) → **Add new site → Import
   an existing project** → elegí GitHub y este repositorio.
2. Netlify ya lee la configuración de `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Antes de desplegar, abrí **Site configuration → Environment variables** y
   agregá:

   | Nombre | Valor |
   | --- | --- |
   | `VITE_SUPABASE_URL` | el Project URL de Supabase |
   | `VITE_SUPABASE_ANON_KEY` | la anon public key |
   | `VITE_SITE_TITLE` | el título que querés mostrar (opcional) |
   | `VITE_SITE_SUBTITLE` | la frase debajo del título (opcional) |

4. Tocá **Deploy site**. Cuando termine, tu página queda online.
   Si cambiás una variable después, hacé **Deploys → Trigger deploy → Clear
   cache and deploy site**.

## Paso 3 · Usar la página

1. Abrí tu página y tocá **Entrar** (arriba a la derecha).
2. Poné el correo y la contraseña del usuario que creaste en Supabase.
3. Tocá **Agregar**, elegí **Imagen**, **Texto**, **Enlace**, **PDF** o
   **Video**, subí el archivo o pegá la dirección web, ponele título y
   categoría, y guardá.
4. Para cambiar título, descripción o categoría de algo ya subido, tocá el lápiz
   en la tarjeta. Para borrarlo, la papelera.
5. Con **Ordenar** aparecen flechas en cada tarjeta para mover los trabajos; el
   orden queda guardado. Tocá **Listo** al terminar.
6. Con **Perfil** cambiás tu nombre, tu descripción y tu foto.
7. El botón con el sol/luna cambia entre tema claro y oscuro.

Límite de subida: 50 MB por archivo.

---

## Desarrollo local (opcional)

```bash
npm install
cp .env.example .env   # completá las variables
npm run dev            # http://localhost:5173
```

Otros comandos: `npm run build`, `npm run lint`, `npm run typecheck`.

Stack: React + TypeScript + Vite + Tailwind CSS + Supabase.
