# Sincronización Automática con Google Drive y Google Sheets por Ficha SENA

Plan integral para almacenar y sincronizar en tiempo real las respuestas de caracterización, avance de módulos y resultados de evaluación de los aprendices en hojas de cálculo dedicadas en Google Drive, estructuradas por número de ficha con pestañas temáticas.

## User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones confirmadas a través del proceso de aclaración:
> - **Conexión de Cuenta:** El instructor o coordinador conecta una cuenta institucional de Google desde el panel administrativo, permitiendo centralizar la creación y propiedad de las hojas de cálculo sin requerir que cada aprendiz inicie sesión con Google.
> - **Estructura del Libro:** Cada archivo de Google Sheets se titulará con el número de la ficha (ej. `Ficha 2873190 - Inducción SENA`) y contendrá tres pestañas organizadas: `Caracterización`, `Progreso Módulos` y `Evaluación`.
> - **Mecanismo de Sincronización:** Híbrido, combinando sincronización automática en segundo plano cada vez que el aprendiz guarda o avanza, y un botón de sincronización y validación manual con enlace directo al archivo en Google Drive.

## 1. Overview & Core Concept

- **Qué hace:** Crea y mantiene actualizada automáticamente una hoja de cálculo en Google Drive para cada número de ficha de formación SENA. A medida que los aprendices se registran, completan su ficha socioeconómica y demográfica, firman el pacto 2026, avanzan por los módulos de inducción o presentan la evaluación de apropiación, sus registros se reflejan inmediatamente en la hoja correspondiente.
- **Audiencia objetivo:** Instructores técnicos y transversales, coordinadores académicos y personal de Bienestar al Aprendiz del SENA que necesitan reportes en tiempo real, trazabilidad institucional y exportación inmediata a herramientas ofimáticas.
- **Valor clave:** Elimina la pérdida de información local, permite supervisión centralizada en la nube de Google Workspace y genera un archivo oficial por ficha que puede compartirse fácilmente con la subdirección del centro de formación.

## 2. User Experience & Visual Design

- **Flujo del Instructor / Bienestar:**
  1. En el **Panel del Instructor**, se incorpora un bloque destacado de integración con Google Workspace en la parte superior.
  2. Si la cuenta institucional no está conectada, se muestra el botón oficial institucional de conexión con Google Drive / Sheets.
  3. Una vez autenticado, se visualiza el estado: cuenta vinculada, identificador del archivo de la ficha activa, enlace directo `Abrir en Google Drive`, indicador de última sincronización y botón `Sincronizar Ficha Ahora`.
  4. Los instructores pueden alternar entre fichas y el sistema localizará o generará automáticamente la hoja de cálculo de cada ficha correspondiente.

- **Flujo del Aprendiz:**
  1. El aprendiz no tiene que realizar pasos adicionales con Google ni lidiar con permisos complejos.
  2. Al completar la ficha de caracterización (género, población, teléfono, dirección, etc.), el sistema guarda localmente y despacha la sincronización a la pestaña `Caracterización`.
  3. Al completar módulos o firmar el Pacto de Convivencia 2026, se actualiza la pestaña `Progreso Módulos`.
  4. Al finalizar la evaluación interactiva de apropiación, se registra el puntaje, estado (Aprobado/Requiere Refuerzo) y código de constancia en la pestaña `Evaluación`.
  5. Se muestra una notificación sutil de confirmación ("Sincronizado con la ficha institucional en Drive").

- **Identidad Visual & Estilo:**
  - Alineado con la paleta institucional SENA: Verde institucional (`#39A900`), fondos limpios en modo claro (`bg-slate-50`) y modo oscuro (`bg-[#070b12]`).
  - Tarjeta de integración con Google Workspace de elevación limpia, sin marcos sobrecargados ni píldoras estáticas decorativas.
  - Estados claros: Conectado (icono sobrio y enlace), Sincronizando (animación suave de carga), y Error/Desconectado (aviso accesible con acción de reintento).

## 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Autenticación OAuth centralizada en el Instructor vs. Aprendices individuales**
  - *Enfoque elegido:* El instructor/coordinador vincula la cuenta de Google Drive para la ficha.
  - *Por qué:* Los aprendices acceden con su número de documento en el portal de inducción y muchos pueden tener dificultades con inicios de sesión cruzados. Al centralizar la vinculación en el rol de instructor, los archivos quedan resguardados en la unidad institucional del docente o centro de formación.
  - *Alternativas consideradas:* Forzar login con Google a cada aprendiz (descartado por fricción innecesaria y riesgo de fragmentación de archivos).

- **Decisión 2: Estructura de pestañas múltiples (`Caracterización`, `Progreso Módulos`, `Evaluación`)**
  - *Enfoque elegido:* Un libro por ficha con tres pestañas especializadas.
  - *Por qué:* Facilita la auditoría pedagógica: Bienestar consulta directamente `Caracterización`, los instructores de seguimiento revisan `Progreso Módulos`, y la coordinación académica valida `Evaluación` para emitir constancias.
  - *Alternativas consideradas:* Una sola hoja con 30 columnas (descartada por dificultad de lectura y saturación visual).

- **Decisión 3: Modo de persistencia dual (Local + Google Drive API)**
  - *Enfoque elegido:* El portal mantiene su funcionamiento ágil y resiliente en `localStorage`, encolando y enviando actualizaciones a Google Sheets en tiempo real con mecanismo de respaldo por lotes.
  - *Por qué:* Garantiza que si la conexión a internet es inestable durante la sesión del aprendiz, los datos no se pierdan y se reintenten sincronizar.

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PORTAL INDUCCIÓN SENA                           │
│                                                                             │
│  ┌───────────────────────┐                    ┌──────────────────────────┐  │
│  │   Módulo Aprendiz     │                    │    Panel Instructor      │  │
│  │  - Caracterización    │                    │  - Conexión Google Drive │  │
│  │  - Módulos / Pacto    │                    │  - Sincronización Manual │  │
│  │  - Evaluación         │                    │  - Enlace al Sheet Ficha │  │
│  └───────────┬───────────┘                    └────────────┬─────────────┘  │
│              │                                             │                │
│              ▼                                             ▼                │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                       Google Sheets Sync Service                      │  │
│  │  - Gestión de Token OAuth (Google Workspace API)                      │  │
│  │  - Búsqueda / Creación de Sheet: "Ficha [Número] - Inducción SENA"   │  │
│  │  - Inicialización de Pestañas y Encabezados Institucionales           │  │
│  │  - Actualización por Documento (Upsert en filas)                      │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │ Bearer Access Token
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       GOOGLE WORKSPACE APIS (CLOUD)                         │
│                                                                             │
│  ┌───────────────────────────────┐       ┌───────────────────────────────┐  │
│  │       Google Drive API        │       │      Google Sheets API        │  │
│  │   - Búsqueda de archivo       │       │   - Create Spreadsheet        │  │
│  │   - Creación en carpeta       │       │   - batchUpdate (3 pestañas)  │  │
│  │   - Permisos institucionales  │       │   - append / update values    │  │
│  └───────────────────────────────┘       └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Esquema de Pestañas de la Hoja de Cálculo

1. **Pestaña `Caracterización`:**
   - Columnas: `Documento`, `Tipo Doc`, `Nombre Completo`, `Correo Institucional`, `Teléfono`, `Ciudad`, `Dirección`, `Regional`, `Centro de Formación`, `Género`, `Tipo de Población`, `Fecha de Registro`.

2. **Pestaña `Progreso Módulos`:**
   - Columnas: `Documento`, `Nombre Completo`, `Módulos Completados (0-5)`, `Porcentaje Avance`, `Estado Inducción`, `Pacto 2026 Firmado (Sí/No)`, `Fecha Firma Pacto`, `Última Actividad`.

3. **Pestaña `Evaluación`:**
   - Columnas: `Documento`, `Nombre Completo`, `Calificación (%)`, `Resultado (Aprobado/Requiere Refuerzo)`, `Preguntas Correctas`, `Total Preguntas`, `Código de Constancia`, `Fecha y Hora Evaluación`.

## 5. Guardado Automático en Carpeta Drive: "BOOT CAMP INDUCCÓN"

- **Carpeta Institucional de Destino:**
  - El sistema localiza o crea automáticamente la carpeta nombrada `BOOT CAMP INDUCCÓN` (reconociendo también `BOOT CAMP INDUCCIÓN`) en Google Drive.
  - Tanto la hoja de cálculo de Google Sheets como el archivo binario de Excel nativo (`.xlsx`) son organizados dentro de esta carpeta.
- **Formato Excel Nativo (.xlsx):**
  - Generación de libro `.xlsx` con hojas `Caracterización`, `Progreso Módulos` y `Evaluación` con anchos de columna dinámicos ajustados y tipado formal.
  - Subida directa mediante Drive Multipart Upload API hacia la carpeta `BOOT CAMP INDUCCÓN`.
  - Enlace directo en el panel del instructor para abrir la carpeta institucional en Google Drive con un solo clic.

### Componentes y Archivos Clave a Implementar
- **`src/services/googleDriveSync.ts`**: Lógica de cliente para interactuar con la API de Google Sheets y Google Drive (búsqueda de archivo por nombre `Ficha {num}`, creación con pestañas estructuradas, inserción y actualización por documento de identidad).
- **`src/components/GoogleDriveSyncCard.tsx`**: Componente visual para el Panel del Instructor con estado de conexión, indicador de sincronización, botón de reintento y enlace directo al archivo.
- **Hook / Integración en `App.tsx`**: Suscripción de eventos para disparar la sincronización tras la actualización de perfil del aprendiz, suscripción del pacto y registro de resultados de evaluación.
- **Configuración OAuth**: Acreditación de scopes mínimos necesarios (`https://www.googleapis.com/auth/drive.file` y `https://www.googleapis.com/auth/spreadsheets`) mediante la herramienta oficial `set_up_oauth`.
