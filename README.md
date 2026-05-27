# Legisfera - Estudio Jurídico (Landing Page)

Landing page premium y moderna para el estudio jurídico **Legisfera** (Chile - Maule), enfocada en la atención online y representación jurídica. 

El sitio permite a los clientes agendar citas directamente desde la web, integrando un calendario con base de datos en **Supabase** y un diseño interactivo de alta calidad con partículas flotantes (`tsParticles`).

## Características

- 🎨 **Diseño Premium**: Paleta de colores oscuros con acentos en plata y oro, adaptada para reflejar la identidad visual corporativa.
- ✨ **Partículas Interactivas**: Fondo HD dinámico y elegante (HTML5 Canvas).
- 📅 **Agendamiento Online**: Formulario con validaciones básicas para solicitar horas de atención de Lunes a Viernes.
- 💾 **Integración con Supabase**: Backend as a Service (BaaS) listo para guardar solicitudes de clientes directamente en la nube.
- 📱 **Responsive**: Diseño adaptable a dispositivos móviles.

## Requisitos Previos

Para que el sistema de agendamiento funcione, necesitas tener una cuenta en [Supabase](https://supabase.com).

## Instalación y Configuración

1. Clona este repositorio o descarga los archivos.
2. Crea un nuevo proyecto en Supabase.
3. Copia el contenido del archivo `supabase-schema.sql` y ejecútalo en la pestaña **SQL Editor** de tu proyecto en Supabase para crear la tabla de citas (`appointments`) y configurar la seguridad (RLS).
4. Ve a **Project Settings -> API** en Supabase y copia tu `URL` del proyecto y tu `anon public key`.
5. Abre el archivo `app.js` y reemplaza las variables en la parte superior con tus credenciales:
   ```javascript
   const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
   const SUPABASE_ANON_KEY = 'TU_ANON_KEY';
   ```

## Pruebas Locales

No necesitas instalar dependencias complicadas. Puedes abrir directamente el archivo `index.html` en tu navegador, o usar una extensión de Live Server en tu editor de código. Si usas Python, puedes levantar un servidor local en esta carpeta con:

```bash
python -m http.server 8000
```
Y luego visitar `http://localhost:8000`.

## Despliegue en GitHub Pages

1. Sube todos estos archivos a un repositorio público en GitHub.
2. Ve a los **Settings** (Configuración) de tu repositorio.
3. En la barra lateral izquierda, selecciona **Pages**.
4. En "Source", selecciona la rama `main` (o `master`) y guarda.
5. ¡En un par de minutos, tu sitio estará disponible en internet!

---
*Desarrollado para Legisfera Estudio Jurídico.*
