# Registro de Cambios y Versiones (CHANGELOG)
## App VIDA - Oficinas Saludables 2027
**Asociación Altos de Chiapas / Unión Mexicana de Chiapas**

Todas las modificaciones notables a este proyecto están documentadas en este archivo siguiendo el estándar [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y versionado semántico [SemVer](https://semver.org/lang/es/).

---

## [1.1.0] - 2026-10-21 (Versión Estable de Pruebas y Aislamiento)

### 🔒 Seguridad y Aislamiento Estricto de Datos de Usuarios
* **Claves de almacenamiento aisladas:** Se erradicó cualquier almacenamiento compartido en `localStorage`. Ahora cada usuario cuenta con su propio espacio de nombres:
  * `vida_daily_logs_${userId}`: Registros diarios propios e independientes.
  * `vida_measurements_${userId}`: Historial antropométrico (peso, cintura, IMC) exclusivamente del usuario en sesión.
* **Limpieza de memoria en transición de sesión:** Al cerrar sesión (`handleLogout`) y al iniciar sesión (`handleLogin`), el estado de la aplicación purga inmediatamente los estados en memoria (`setLogs({})`, `setMeasurements([])`) evitando cualquier residuo visual antes de cargar la sesión entrante.
* **Purga completa de tokens:** Se unificó la eliminación de tokens de sesión (`vida_auth_user` y `vida_user_profile`) al ejecutar `authService.logout()`.
* **Guardas defensivas:** Todas las funciones de `dataService` (`getDailyLogs`, `saveDailyLog`, `getMeasurements`, `saveMeasurement`) rechazan llamadas sin un `userId` válido, registrando advertencias y protegiendo la base de datos contra registros huérfanos.

### 🎨 Experiencia Visual y Aro Tricolor
* **Aro SVG Tricolor de 3 Arcos:** Sustitución del anillo monocolor por 3 arcos independientes de 120° con los colores oficiales de identidad:
  * 💧 **Hidratación:** Azul Agua (`#0090D8`) con filtro glow cuando se alcanzan los 8 vasos y cero azúcar.
  * 🥗 **Nutrición:** Verde Vida (`#75B827`) al consumir verduras y evitar ultraprocesados.
  * 🏃 **Actividad Física:** Amarillo/Oro (`#F6A81C`) al registrar al menos 30 min (o reposo de sábado).
* **Confeti de celebración:** Se dispara al completar el día íntegro (3 de 3 hábitos cumplidos).

### 🧪 Herramienta de Pruebas: Simulador de Fechas
* **Barra interactiva provisional:** Incorporación del componente `DateSimulatorBar` que permite adelantar (`Siguiente ▶`) o retrasar (`◀ Anterior`) el día simulado en pantalla para ingresar múltiples días consecutivos y verificar el avance de rachas sin esperar al día siguiente.
* Botón de restauración rápida `📅 Hoy real` para volver a la fecha actual.
* Diseñado de manera modular para retirarse con un solo interruptor cuando concluyan las pruebas de campo.

### 📱 Navegación y Usabilidad
* **Menú inferior fijo:** Barra inferior sticky permanente con elevado índice Z para nunca ocultarse durante el scroll.
* **Registro rápido en pantalla Hoy:** Botones directos `+1 vaso`, `-1 vaso`, interruptores de nutrición y botones de minutos (`+15m`, `+30m`, `45m`).

---

## [1.0.0] - 2026-10-20 (Lanzamiento Inicial PWA)

### Agregado
* Configuración base con React 18, Vite y TypeScript adaptado a formato PWA móvil.
* Compatibilidad total para instalación en Android y pantallas de inicio de iOS (`manifest.json`, iconos y `.htaccess`).
* Integración de Firebase Firestore y Authentication con fallback local tolerante a desconexión.
* Selector de Modo Día (fondo blanco institucional con colores vivos) y Modo Noche (fondo oscuro).
* Módulo de Onboarding en 3 pasos con cálculo automático de IMC y consentimiento informado.
* Panel de Administrador con gestión de participantes, métricas de oficina y pase de lista de pausas activas laborales.
* Despliegue en subdominio `vida.iaach.org` mediante repositorio Git en GitHub y sincronización Hostinger.
