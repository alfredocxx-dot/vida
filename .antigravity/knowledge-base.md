# Sistema de Memoria y Conocimiento Agéntico — Proyecto VIDA

> Este documento registra las directrices, aprendizajes acumulados y decisiones aprobadas por @Alfredo Jiménez para que el equipo agéntico mantenga coherencia absoluta.

---

## 🏛️ Estructura Agéntica del Proyecto

### 👑 Agente Supremo (Moderador & Orquestador)
* **Función:** Punto único de contacto con Alfredo. Recibe la visión, desglosa requerimientos, delega a los especialistas, audita calidad y entrega reportes consolidados.

---

### 1. ⚙️ Agente Backend & Cloud Architect
* **1.1 Base de Datos (Firestore & LocalStorage):**
  - Colecciones: `usuarios`, `registros_diarios`, `medidas`, `asistencias`.
  - Sistema dual: Funciona 100% en local y sincroniza en la nube con Firestore cuando hay credenciales.
* **1.2 Conexiones & Sincronización:**
  - Proyecto Firebase actual: `adelante-6366d`.
  - Compatibilidad universal de prefijos `NEXT_PUBLIC_` y `VITE_`.
* **1.3 Seguridad & Roles:**
  - Participante: Solo tiene lectura y escritura de sus propios registros.
  - Administrador: Acceso al tablero de oficina, pases de lista y evaluaciones.

---

### 2. 🎨 Agente Frontend & Creative Director
* **2.1 Experiencia de Usuario (UX & Hábitos):**
  - Registro ultra-rápido en menos de 30 segundos mediante toques (sin tecleo).
  - Gamificación: Anillo de 3 pilares, racha de días completos con fuego, e insignias de 7, 21 y 40 días.
* **2.2 Responsive & Mobile Architecture (PWA):**
  - App web instalable en iPhone (Safari) y Android (Chrome).
  - Standalone (pantalla completa, sin barra de URL).
* **2.3 Branding & Design System (Logotipo Oficial VIDA):**
  - **Modo Día (Predeterminado):** Fondo blanco limpio `#F8FAFC` / `#FFFFFF` con colores vivos del logo.
  - **Modo Noche:** Fondo oscuro `#0D1620` para descanso visual.
  - **Paleta oficial extraída del logo:**
    - Verde Hoja (Nutrición - Letra V): `#75B827`
    - Azul Marino (Fundamento - Letra I): `#3B658C`
    - Azul Celeste (Movimiento / Hidratación - Letra D): `#0090D8`
    - Amarillo Dorado (Cruz / Biblia - Letra A): `#F6A81C`

---

### 3. 🛡️ Agente Governance & Admin Operations
* **3.1 Protección de Acceso:**
  - La vista de Administrador está protegida y oculta para cualquier usuario que no tenga `rol: 'Administrador'`.
* **3.2 Métricas del Documento Rector:**
  - Tablero semanal: % de participación, promedio de agua, minutos semanales y días completos.
  - Asistencia de lunes y jueves: Estados Activa (A), Parcial (P), Nula (N).
  - Formato de Línea Base institucional (Tabla 1) listo para exportar.

---

### 4. 👤 Agente User Lifecycle & Onboarding
* **4.1 Onboarding Ligero:**
  - 3 pasos no invasivos: Saludo, Estatura/Peso base, y Aviso de privacidad/consentimiento.
* **4.2 Autenticación Clásica:**
  - Usuario y contraseña directa (sin Google Sign-In para evitar configuraciones complejas de OAuth).
  - Usuarios iniciales preconfigurados:
    - `alfredo` / `vida2027` (Administrador de campo)
    - `ana.g` / `vida2027` (Participante de prueba)
    - `benjamin.r` / `vida2027` (Participante de prueba)

---

## 📌 Reglas de Oro Aprendidas
1. **Regla del Sábado:** El sábado es día de reposo espiritual y físico; no rompe la racha de actividad física.
2. **Despliegue automatizado por Git:** Cada entrega se compila y se empuja a la rama `main` en `https://github.com/alfredocxx-dot/vida.git`.
3. **Subdominio de producción:** `https://vida.iaach.org`.
