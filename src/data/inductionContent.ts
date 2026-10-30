import { InductionModule, RightDutyItem, EvaluationQuestion } from '../types/induction';

export const INDUCTION_MODULES: InductionModule[] = [
  {
    id: 'identidad',
    order: 1,
    title: 'Identidad, Valores y Símbolos del SENA',
    shortDescription: 'Conoce la historia, misión, visión, principios éticos y los símbolos institucionales que representan el orgullo de ser aprendiz.',
    estimatedMinutes: 25,
    category: 'identidad',
    icon: 'Landmark',
    topics: [
      {
        id: 'historia-mision',
        title: 'Historia, Misión y Visión Institucional',
        summary: 'El SENA nació en 1957 gracias a la visión de Rodolfo Martínez Tono para formar integralmente a la fuerza laboral colombiana.',
        content: [
          'El Servicio Nacional de Aprendizaje (SENA) fue fundado el 21 de junio de 1957 mediante el Decreto Ley 118 de 1957, impulsado por Rodolfo Martínez Tono con el respaldo de organizaciones sindicales y empresariales.',
          'MISIÓN INSTITUCIONAL: El SENA está encargado de cumplir la función que le corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos, ofreciendo y ejecutando la formación profesional integral, para la incorporación y el desarrollo de las personas en actividades productivas que contribuyan al desarrollo social, económico y tecnológico del país.',
          'VISIÓN: Ser una entidad referente nacional e internacional en formación técnica y tecnológica con altos estándares de calidad, pertinencia e innovación, dinamizando la productividad y el empleo digno en todas las regiones de Colombia.'
        ],
        keyPoints: [
          'Fundado en 1957 por Rodolfo Martínez Tono.',
          'Formación Profesional Integral (FPI) orientada al saber, saber hacer y saber ser.',
          'Presencia en las 33 regionales y más de 117 centros de formación en todo el país.',
          'Educación 100% gratuita y pública sin intermediarios.'
        ],
        legalReference: 'Decreto Ley 118 de 1957 / Ley 119 de 1994 (Reestructuración del SENA)'
      },
      {
        id: 'simbolos-institucionales',
        title: 'Símbolos Patrios e Institucionales del SENA',
        summary: 'El escudo, la bandera, el logo-símbolo y el himno encarnan el trabajo, los tres sectores de la economía y el progreso.',
        content: [
          'EL ESCUDO: Diseñado en los primeros años de la entidad, refleja los tres sectores económicos que dinamizan a la nación: el sector primario y extractivo (representado por el café y las espigas agrícolas), el sector secundario o industrial (representado por la rueda dentada/engranaje) y el sector terciario (servicios y comercio, representado por el caduceo).',
          'LA BANDERA: De fondo blanco puro que simboliza la paz, la tranquilidad y la libertad con las que se construye el porvenir. En su centro lleva estampado el escudo del SENA.',
          'EL LOGO-SÍMBOLO: Representa gráficamente a un ser humano que camina con paso firme hacia adelante por un sendero de superación, proyectándose al futuro a través del estudio, el esfuerzo y la innovación tecnológica.',
          'EL HIMNO: Con letra del poeta Luis Alfredo Sánchez y música del maestro Daniel Marlez, convoca a los aprendices a forjar la patria con trabajo, estudio y fraternidad.'
        ],
        keyPoints: [
          'Escudo: Los 3 sectores de la economía (Agrícola, Industrial, Servicios y Comercio).',
          'Bandera: Fondo blanco con escudo central.',
          'Logo-símbolo: El aprendiz erguido marchando hacia el porvenir.',
          'Himno: Llamado al trabajo fecundo y la dignidad nacional.'
        ],
        legalReference: 'Manual de Imagen e Identidad Corporativa SENA'
      },
      {
        id: 'principios-valores',
        title: 'Principios Éticos y Valores Institucionales',
        summary: 'Los pilares del comportamiento ético que todo aprendiz y servidor del SENA debe interiorizar y practicar.',
        content: [
          'La cultura SENA se fundamenta en principios universales que guían la convivencia pacífica y el desarrollo ciudadano en los ambientes de aprendizaje y las empresas.',
          'VALORES CLAVE: Respeto (reconocimiento del valor y dignidad de cada ser humano), Honestidad (actuar con rectitud y verdad en evaluaciones y vida diaria), Solidaridad (apoyo mutuo y trabajo colaborativo), Responsabilidad (cumplir con compromisos formativos y laborales), Justicia y Equidad (trato imparcial sin discriminación), Libre Pensamiento y Actitud Crítica.'
        ],
        keyPoints: [
          'Dignidad humana como centro de toda acción formativa.',
          'Cero tolerancia al plagio, la suplantación o conductas deshonestas.',
          'Convivencia pacífica y respeto por la diversidad cultural y de pensamiento.'
        ],
        legalReference: 'Código de Integridad SENA'
      }
    ]
  },
  {
    id: 'derechos-deberes',
    order: 2,
    title: 'Reglamento del Aprendiz: Derechos y Deberes',
    shortDescription: 'Domina el Acuerdo 009 de 2024 (Reglamento del Aprendiz vigente): tus derechos inalienables, tus deberes como aprendiz, el Comité de Evaluación y Seguimiento (Art. 48) y las garantías del debido proceso.',
    estimatedMinutes: 35,
    category: 'reglamento',
    icon: 'Scale',
    badgeText: 'Acuerdo 009 de 2024',
    topics: [
      {
        id: 'derechos-aprendiz',
        title: 'Derechos del Aprendiz (Capítulo II, Art. 5º)',
        summary: 'Prerrogativas garantizadas para asegurar tu formación integral, participación y bienestar.',
        content: [
          '1. Recibir formación profesional integral de calidad acorde al programa matriculado y los estándares del SENA.',
          '2. Recibir oportunamente al iniciar la formación el carné institucional que lo acredita como aprendiz SENA.',
          '3. Disfrutar de los programas institucionales de Bienestar al Aprendiz (salud, deporte, cultura, apoyos económicos).',
          '4. Ser escuchado y atendido en sus peticiones respetuosas por instructores, coordinadores y directivos.',
          '5. Exigir el debido proceso y la presunción de inocencia en cualquier procedimiento disciplinario.',
          '6. Recibir retroalimentación oportuna y justificada de las evidencias y evaluaciones de aprendizaje.',
          '7. Elegir y ser elegido como vocero de ficha o representante general de aprendices del centro.'
        ],
        keyPoints: [
          'Carné institucional gratuito y oportuno.',
          'Calidad formativa y acceso a ambientes dotados.',
          'Garantía plena del debido proceso y derecho a la defensa.',
          'Retroalimentación pedagógica a tiempo.'
        ],
        legalReference: 'Acuerdo 009 de 2024, Capítulo II, Artículo 5º'
      },
      {
        id: 'deberes-aprendiz',
        title: 'Deberes del Aprendiz (Capítulo III, Art. 8º)',
        summary: 'Obligaciones éticas, formativas y comunitarias para asegurar la excelencia y la sana convivencia.',
        content: [
          '1. Portar visiblemente el carné institucional en todo momento dentro de las sedes del SENA y en actividades externas de representación.',
          '2. Asistir con puntualidad y constancia a todas las sesiones presenciales o virtuales del programa.',
          '3. Justificar inasistencias por escrito dentro de los tres (3) días hábiles siguientes ante el instructor correspondiente aportando soportes válidos (ej. incapacidad EPS).',
          '4. Cuidar la infraestructura, equipos, maquinaria, herramientas y recursos puestos a su disposición.',
          '5. Portar el uniforme reglamentario y elementos de protección personal (EPP) de acuerdo con las normas de Seguridad y Salud en el Trabajo (SG-SST).',
          '6. Mantener relaciones interpersonales cordiales y respetuosas con toda la comunidad educativa.',
          '7. Informar de inmediato cualquier situación que ponga en riesgo la seguridad física o la convivencia.'
        ],
        keyPoints: [
          'Porte permanente y visible del carné.',
          'Plazo máximo de justificación: 3 días hábiles con soporte legal/médico.',
          'Uso estricto de EPP en talleres y laboratorios.',
          'Cuidado de los bienes públicos del SENA.'
        ],
        legalReference: 'Acuerdo 009 de 2024, Capítulo III, Artículo 8º'
      },
      {
        id: 'comite-evaluacion-2026',
        title: 'Comité de Evaluación y Seguimiento (Acuerdo 009 de 2024, Art. 48)',
        summary: 'Composición paritaria, garantías del debido proceso y primacía absoluta de las medidas pedagógicas formativas.',
        isUpdate2026: true,
        badgeText: 'Acuerdo 009 de 2024',
        content: [
          'ÓRGANO COLEGIADO CONSULTOR: El Comité de Evaluación y Seguimiento en cada Centro de Formación se consolida como instancia paritaria con participación activa del vocero de aprendices del centro, un representante de Bienestar al Aprendiz, el instructor coordinador y el coordinador académico.',
          'PRIMACÍA FORMATIVA: El Acuerdo 009 de 2024 establece expresamente que el Comité debe priorizar el carácter pedagógico y formativo sobre el sancionatorio. Antes de emitir cualquier recomendación de sanción (como condicionamiento o cancelación), es obligatorio formular y agotar un Plan de Mejoramiento Integral con acompañamiento tutorial.',
          'NOTIFICACIÓN OFICIAL VINCULANTE: Las citaciones a comités, traslados de quejas y pliegos de descargos deben realizarse formalmente al correo institucional oficial @soy.sena.edu.co con un mínimo de tres (3) días hábiles de anticipación, garantizando el derecho inalienable a la defensa y aportación de pruebas.'
        ],
        keyPoints: [
          'Composición paritaria con participación activa del vocero de aprendices.',
          'Obligatoriedad de agotar planes pedagógicos antes de considerar sanciones.',
          'Notificación oficial vinculante vía correo @soy.sena.edu.co con 3 días de antelación.'
        ],
        legalReference: 'Acuerdo 009 de 2024, Artículo 48'
      },
      {
        id: 'prohibiciones-faltas-sanciones',
        title: 'Prohibiciones, Faltas y Procedimiento Disciplinario',
        summary: 'Conductas no permitidas, clasificación de faltas (leves, graves, gravísimas) y medidas formativas.',
        content: [
          'PROHIBICIONES (Art. 9º): Ingresar o permanecer bajo efectos de alcohol o sustancias psicoactivas; portar armas; participar en riñas o agresiones; comercializar productos sin autorización; hurtar o dañar bienes; cometer fraude o plagio en evaluaciones o evidencias.',
          'CLASIFICACIÓN DE FALTAS: Las faltas pueden ser de carácter Académico (incumplimiento en evidencias o proyectos) o Disciplinario (violación de normas de convivencia). Se tipifican como Leves, Graves o Gravísimas según los criterios de premeditación, reincidencia y perjuicio.',
          'MEDIDAS FORMATIVAS: Llamado de atención verbal reflexivo, llamado de atención escrito con copia a la hoja de vida, o Plan de Mejoramiento Académico / Disciplinario.',
          'SANCIONES DISCIPLINARIAS (Impuestas por Subdirector tras Comité de Evaluación y Seguimiento): Condicionamiento de matrícula o Cancelación de matrícula (con inhabilidad formal para reingresar al SENA).'
        ],
        keyPoints: [
          'Prohibido el ingreso de alcohol, armas o sustancias ilícitas.',
          'El plagio y fraude académico son causales de investigación disciplinaria.',
          'Comité de Evaluación y Seguimiento garantiza pruebas y descargos antes de cualquier sanción.',
          'Cancelación de matrícula conlleva inhabilidad formal.'
        ],
        legalReference: 'Acuerdo 009 de 2024, Capítulos III, IV, V, VI y VII'
      },
      {
        id: 'etica-digital-ia-2026',
        title: 'Deberes Digitales, Uso Ético de Tecnologías y Convivencia',
        summary: 'Lineamientos institucionales para el uso responsable de tecnologías, IA y netiqueta en plataformas SENA.',
        isUpdate2026: true,
        badgeText: 'Acuerdo 009 de 2024',
        content: [
          'USO RESPONSABLE DE HERRAMIENTAS DIGITALES E IA: En los ambientes virtuales y presenciales, los aprendices pueden usar herramientas tecnológicas e Inteligencia Artificial como apoyo formativo, siempre que se declare de manera transparente su uso y se citen adecuadamente las fuentes. Presentar contenidos íntegros sin análisis propio ni citación se tipifica como falta por plagio o fraude académico en el Acuerdo 009 de 2024 (Art. 9º).',
          'NETIQUETA Y CONVIVENCIA EN PLATAFORMAS: Respeto absoluto en foros de Zajuna, sesiones sincrónicas por Teams/Meet y grupos de trabajo. Queda prohibida toda forma de ciberacoso, suplantación de identidad en plataformas digitales o difusión de material lesivo.',
          'CANAL OFICIAL @soy.sena.edu.co: El aprendiz debe revisar permanentemente su buzón institucional para citaciones oficiales, ofertas de la Agencia Pública de Empleo (APE) y convocatorias de apoyos socioeconómicos de Bienestar.'
        ],
        keyPoints: [
          'Declaración y citación obligatoria de fuentes y herramientas de IA en evidencias.',
          'Cero tolerancia al ciberacoso y suplantación en plataformas SENA.',
          'Revisión diaria del correo institucional @soy.sena.edu.co.'
        ],
        legalReference: 'Acuerdo 009 de 2024 / Guía de Ambientes Virtuales de Aprendizaje SENA'
      }
    ]
  },
  {
    id: 'ruta-formacion',
    order: 3,
    title: 'Ruta de Formación y Novedades del Aprendiz',
    shortDescription: 'Descubre cómo transitas por la Etapa Lectiva y la Etapa Productiva bajo el marco normativo del Acuerdo 009 de 2024, la Ley 789 de 2002 y el Decreto 1072 de 2015.',
    estimatedMinutes: 30,
    category: 'ruta',
    icon: 'Compass',
    badgeText: 'Normatividad Vigente',
    topics: [
      {
        id: 'etapas-lectiva-productiva',
        title: 'Etapa Lectiva y Modalidades de Etapa Productiva',
        summary: 'Marco normativo de vinculación formativa, tutor de práctica y garantías de seguridad social integral.',
        isUpdate2026: true,
        badgeText: 'Ley 789 / Dec. 1072',
        content: [
          'ETAPA LECTIVA: Periodo en el que el aprendiz adquiere y desarrolla competencias técnicas, transversales (comunicación, ética, TIC, bilingüismo, emprendimiento y SG-SST) y claves en ambientes de aprendizaje simulados o reales.',
          'MARCO NORMATIVO DE ETAPA PRODUCTIVA (Acuerdo 009 de 2024, Ley 789 de 2002 y Decreto 1072 de 2015): Regula la aplicación práctica de conocimientos en el sector productivo mediante modalidades legalmente reconocidas:',
          '1. Contrato de Aprendizaje: Modalidad formativa especial con apoyo de sostenimiento mensual regulado por ley y cobertura obligatoria en salud y riesgos laborales (ARL).',
          '2. Vínculo Laboral o Contractual: Desempeño de funciones directamente afines al programa formativo acreditadas mediante certificación.',
          '3. Proyecto Productivo: Desarrollo de iniciativas de I+D+i, unidades productivas o Fondo Emprender.',
          '4. Pasantía Formativa: Concertada con entidades públicas, privadas o comunitarias.',
          '5. Monitoría SENA: Acompañamiento en ambientes de formación o áreas técnicas institucionales.',
          'GARANTÍAS Y SEGUIMIENTO: Asignación obligatoria de un tutor por la empresa o entidad co-formadora, afiliación efectiva a ARL desde el inicio de la práctica y registro periódico de bitácoras en Zajuna concertadas con el instructor de seguimiento SENA.'
        ],
        keyPoints: [
          'Modalidades reguladas: Contrato de Aprendizaje, Vínculo Laboral, Proyecto, Pasantía y Monitoría.',
          'Afiliación obligatoria a ARL por la empresa patrocinadora desde el día uno de práctica.',
          'Tutor empresarial asignado y plan formativo concertado.',
          'Registro de bitácoras de seguimiento periódicas en la plataforma Zajuna.'
        ],
        legalReference: 'Acuerdo 009 de 2024 / Ley 789 de 2002 / Decreto 1072 de 2015'
      },
      {
        id: 'tramites-novedades',
        title: 'Novedades del Aprendiz: Traslado, Aplazamiento y Deserción',
        summary: 'Trámites oficiales en SOFIA Plus y consecuencias de la inasistencia injustificada.',
        content: [
          'TRASLADO: Solicitud formal para cambiar de centro de formación, de jornada o de programa afín, previa disponibilidad de cupo y justificación sustentada.',
          'APLAZAMIENTO: Suspensión temporal de la matrícula por motivos de salud, fuerza mayor o servicio militar, hasta por un máximo de seis (6) meses continuos o discontinuos (prorrogables según caso especial).',
          'REINGRESO: Trámite para reactivar la formación antes de que venza el periodo de aplazamiento autorizado.',
          'RETIRO VOLUNTARIO: Renuncia voluntaria a la formación radicada formalmente ante coordinación académica, sin acarrear sanción.',
          'DESERCIÓN: Se declara cuando el aprendiz deja de asistir injustificadamente durante tres (3) días hábiles consecutivos, no presenta justificación médica o legal dentro de los 3 días hábiles siguientes, o no reporta inicio de etapa productiva en los plazos fijados. Previo debido proceso ante el Comité de Evaluación y Seguimiento, genera cancelación de matrícula e inhabilidad para inscribirse en el SENA.'
        ],
        keyPoints: [
          'Deserción por 3 días consecutivos de inasistencia sin justificación médica o legal.',
          'Aplazamiento debe solicitarse antes y no después de ausentarse.',
          'Todo trámite debe registrarse a través de SOFIA Plus con visto bueno de coordinación.'
        ],
        legalReference: 'Acuerdo 009 de 2024 (Régimen de Deserción e Incumplimiento)'
      }
    ]
  },
  {
    id: 'bienestar',
    order: 4,
    title: 'Bienestar al Aprendiz y Liderazgo',
    shortDescription: 'Conoce los programas de acompañamiento, apoyos socioeconómicos, salud, deporte, cultura y representación.',
    estimatedMinutes: 20,
    category: 'bienestar',
    icon: 'HeartHandshake',
    topics: [
      {
        id: 'ejes-bienestar',
        title: 'Ejes Estratégicos del Plan Nacional de Bienestar',
        summary: 'Estrategias orientadas al bienestar físico, mental, socioeconómico y cultural del aprendiz.',
        content: [
          'El área de Bienestar al Aprendiz acompaña integralmente tu ciclo formativo para mitigar la deserción y potenciar tus talentos.',
          'LÍNEAS DE ACCIÓN: 1. Salud integral (talleres de prevención, primeros auxilios, salud sexual y reproductiva), 2. Deporte y actividad física (torneos intercentros, gimnasio, selecciones), 3. Arte y Cultura (teatro, danza, música, artes plásticas), 4. Acompañamiento psicológico y consejería individual, 5. Desarrollo de habilidades socioemocionales y liderazgo.'
        ],
        keyPoints: [
          'Acceso libre y gratuito a actividades culturales y deportivas.',
          'Atención psicológica y orientación vocacional en cada centro.',
          'Encuentros deportivos y culturales regionales y nacionales.'
        ],
        legalReference: 'Resolución de Bienestar al Aprendiz SENA'
      },
      {
        id: 'apoyos-representacion',
        title: 'Apoyos Socioeconómicos y Representación Estudiantil',
        summary: 'Beneficios económicos para aprendices vulnerables y mecanismos democráticos de elección de voceros.',
        content: [
          'APOYOS DE SOSTENIMIENTO: Recursos monetarios mensuales para aprendices en condición de vulnerabilidad socioeconómica, estratos 1 y 2, que cumplan con rendimiento académico destacado y sin sanciones disciplinarias. Incluye el Apoyo Regular SENA y el Fondo de la Industria de la Construcción (FIC) para aprendices del sector constructor.',
          'VOCEROS DE FICHA: Cada grupo elige democráticamente un aprendiz principal y suplente que actúa como puente de comunicación con instructores y directivos.',
          'REPRESENTANTE DEL CENTRO: Máxima figura de representación elegida por voto popular de todos los aprendices del centro para sesionar ante el Consejo de Centro y defender los intereses de la comunidad.'
        ],
        keyPoints: [
          'Apoyo regular y FIC asignados por convocatoria pública y baremo de vulnerabilidad.',
          'Prohibido tener sanciones activas para aspirar a apoyos o representación.',
          'Elección democrática anual de representantes de centro.'
        ],
        legalReference: 'Resolución 1-0036 de 2024 / Acuerdo 009 de 2024, Art. 7º'
      }
    ]
  },
  {
    id: 'tecnologia',
    order: 5,
    title: 'Ecosistema Digital y Servicios Tecnológicos',
    shortDescription: 'Aprende a usar SOFIA Plus, el LMS Zajuna, tu correo MiSena y la firma del Compromiso Institucional del Aprendiz (Acuerdo 009 de 2024).',
    estimatedMinutes: 20,
    category: 'tecnologia',
    icon: 'Laptop',
    badgeText: 'Ecosistema Digital',
    topics: [
      {
        id: 'plataformas-sena',
        title: 'SOFIA Plus, Zajuna y Correo MiSena',
        summary: 'Las plataformas obligatorias para consultar notas, enviar evidencias y comunicarte.',
        content: [
          'SOFIA PLUS (portal.senasofiaplus.edu.co): Sistema optimizado para la formación integral y el aprendizaje activo. Permite consultar matrícula, notas/juicios evaluativos, certificados de estudio, novedades y ofertas de empleo.',
          'ZAJUNA (LMS OFICIAL SENA): El entorno virtual de aprendizaje exclusivo del SENA, donde se alojan las guías de aprendizaje, foros de discusión, cuestionarios interactivos y buzón de entrega de evidencias con bitácoras de seguimiento de etapa productiva.',
          'CORREO INSTITUCIONAL @soy.sena.edu.co: Canal oficial y formal vinculante para toda comunicación institucional, convocatorias de empleo, citaciones al Comité de Evaluación y alertas de bienestar.'
        ],
        keyPoints: [
          'Juicio evaluativo: "Aprobado (A)" o "No Aprobado (D)". No se califica con números en el SENA.',
          'Zajuna como entorno virtual exclusivo para evidencias y bitácoras.',
          'Revisión constante del correo @soy.sena.edu.co para citaciones y notificaciones oficiales.'
        ],
        legalReference: 'Guía de Ambientes Virtuales de Aprendizaje SENA'
      },
      {
        id: 'pacto-convivencia-2026',
        title: 'Compromiso Institucional y Pacto de Convivencia del Aprendiz',
        summary: 'Firma digital del compromiso formativo requerida para la legalización formal de la matrícula.',
        isUpdate2026: true,
        badgeText: 'Acuerdo 009 de 2024',
        content: [
          'INDUCCIÓN INSTITUCIONAL SENA: La Dirección de Formación Profesional del SENA establece como requisito formativo que todo aprendiz, al culminar su ruta de inducción y evaluación de conocimientos, suscriba formalmente el Pacto de Convivencia y Compromiso Institucional.',
          'ALCANCE DEL COMPROMISO: El aprendiz asume voluntariamente el deber de acatar el Reglamento del Aprendiz (Acuerdo 009 de 2024), cuidar los recursos públicos asignados, mantener una conducta respetuosa e inclusiva y comprometerse con la culminación exitosa de sus etapas lectiva y productiva.',
          'LEGALIZACIÓN DE MATRÍCULA: La ratificación digital queda registrada en el sistema de gestión académica, habilitando plenamente al aprendiz para la recepción de beneficios de bienestar, emisión de constancias oficiales y postulación a modalidades de etapa productiva (Ley 789 de 2002).'
        ],
        keyPoints: [
          'Firma digital obligatoria al finalizar la inducción institucional.',
          'Ratificación formal del respeto al Reglamento del Aprendiz (Acuerdo 009 de 2024).',
          'Habilita la legalización de matrícula y acceso pleno a beneficios institucionales.'
        ],
        legalReference: 'Acuerdo 009 de 2024 / Manual de Inducción SENA'
      }
    ]
  }
];

export const RIGHTS_AND_DUTIES_CATALOG: RightDutyItem[] = [
  {
    id: 'rd-01',
    type: 'derecho',
    title: 'Formación Integral y Gratuita',
    description: 'Recibir formación profesional integral de alta calidad, acorde con el programa formativo en el que se matriculó, en ambientes dignos y con recursos actualizados.',
    articleRef: 'Art. 5º, Numeral 1',
    category: 'Academico',
    practicalExample: 'El instructor debe socializar la guía de aprendizaje al inicio de cada actividad y brindar asesoría técnica.',
    consequenceOrBenefit: 'Garantiza el aprendizaje de competencias pertinentes para el mundo laboral real.'
  },
  {
    id: 'rd-02',
    type: 'derecho',
    title: 'Porte del Carné Institucional Gratuito',
    description: 'Recibir oportunamente el documento de identificación que lo acredita como aprendiz SENA de manera gratuita al inicio del programa.',
    articleRef: 'Art. 5º, Numeral 2',
    category: 'Institucional',
    practicalExample: 'El centro debe expedir el carné digital o físico durante las dos primeras semanas de inducción.',
    consequenceOrBenefit: 'Permite el ingreso al centro, préstamo de equipos en biblioteca y acceso a convenios.'
  },
  {
    id: 'rd-03',
    type: 'derecho',
    title: 'Debido Proceso y Derecho a la Defensa',
    description: 'Ser escuchado, presentar pruebas, descargos y recursos ante cualquier presunta falta disciplinaria o académica antes de emitir cualquier sanción.',
    articleRef: 'Art. 5º, Numeral 5',
    category: 'Disciplinario',
    practicalExample: 'Si se abre un comité disciplinario por inasistencia, el aprendiz tiene derecho a ser notificado con 3 días de antelación y asistir con un testigo o vocero.',
    consequenceOrBenefit: 'Impide sanciones arbitrarias o injustas.'
  },
  {
    id: 'rd-04',
    type: 'derecho',
    title: 'Retroalimentación Oportuna de Evaluaciones',
    description: 'Conocer oportunamente la evaluación de sus evidencias de aprendizaje con retroalimentación clara de los juicios (Aprobado / No Aprobado) en los tiempos establecidos.',
    articleRef: 'Art. 5º, Numeral 6',
    category: 'Academico',
    practicalExample: 'El instructor debe evaluar tus talleres dentro de los 5 días hábiles siguientes a la entrega y explicarte qué aspectos mejorar si no aprobaste.',
    consequenceOrBenefit: 'Posibilidad de concertar planes de mejoramiento antes del cierre de fase.'
  },
  {
    id: 'rd-05',
    type: 'derecho',
    title: 'Acceso a Servicios de Bienestar y Salud',
    description: 'Disfrutar de los programas recreativos, deportivos, culturales, de salud y postulación a apoyos socioeconómicos de sostenimiento.',
    articleRef: 'Art. 5º, Numeral 3',
    category: 'Institucional',
    practicalExample: 'Postularse a las convocatorias de apoyos de sostenimiento FIC o regular si se encuentra en situación de vulnerabilidad.',
    consequenceOrBenefit: 'Mejora la calidad de vida y permanencia en la institución.'
  },
  {
    id: 'rd-06',
    type: 'deber',
    title: 'Porte Visible del Carné Institucional',
    description: 'Portar el carné en lugar visible durante toda la permanencia en las instalaciones del SENA y presentarlo al personal de vigilancia y autoridades que lo requieran.',
    articleRef: 'Art. 8º, Numeral 1',
    category: 'Seguridad',
    practicalExample: 'Llevar el carné con cinta en el pecho al ingresar y permanecer en talleres, aulas y pasillos.',
    consequenceOrBenefit: 'Garantiza la seguridad integral de toda la comunidad SENA frente a personas externas no autorizadas.'
  },
  {
    id: 'rd-07',
    type: 'deber',
    title: 'Puntualidad y Asistencia Constante',
    description: 'Asistir con puntualidad a todas las actividades programadas en el plan de trabajo de la ruta formativa.',
    articleRef: 'Art. 8º, Numeral 2',
    category: 'Academico',
    practicalExample: 'Llegar a la hora estipulada a la sesión y no ausentarse sin permiso del instructor.',
    consequenceOrBenefit: 'Evita llamados de atención e investigaciones por abandono o deserción.'
  },
  {
    id: 'rd-08',
    type: 'deber',
    title: 'Justificación Oportuna de Inasistencias',
    description: 'Presentar soporte de justificación por escrito ante el instructor correspondiente dentro de los tres (3) días hábiles siguientes a la ocurrencia de la inasistencia.',
    articleRef: 'Art. 8º, Numeral 3',
    category: 'Academico',
    practicalExample: 'Si tuviste una urgencia médica el lunes, debes radicar la incapacidad de la EPS a más tardar el jueves.',
    consequenceOrBenefit: 'Impide la apertura de procesos de deserción y permite acordar entrega de evidencias extemporáneas.'
  },
  {
    id: 'rd-09',
    type: 'deber',
    title: 'Uso de EPP y Uniformes Reglamentarios',
    description: 'Portar el uniforme de acuerdo con las especificaciones del centro y usar obligatoriamente los Elementos de Protección Personal (EPP) en talleres y laboratorios.',
    articleRef: 'Art. 8º, Numeral 7',
    category: 'Seguridad',
    practicalExample: 'Usar botas con puntera dieléctrica, gafas de seguridad y casco en talleres de maquinaria pesada o electricidad.',
    consequenceOrBenefit: 'Protege la vida y previene accidentes laborales graves en los ambientes de formación.'
  },
  {
    id: 'rd-10',
    type: 'deber',
    title: 'Cuidado de Bienes e Infraestructura',
    description: 'Hacer uso responsable y cuidar las instalaciones, equipos, herramientas, software y materiales de formación entregados por la institución.',
    articleRef: 'Art. 8º, Numeral 6',
    category: 'Institucional',
    practicalExample: 'No rayar las mesas, no alterar el hardware de los computadores y apagar las máquinas al terminar la práctica.',
    consequenceOrBenefit: 'Mantiene las condiciones de estudio para las futuras generaciones de aprendices.'
  },
  {
    id: 'rd-11',
    type: 'prohibicion',
    title: 'Ingreso Bajo Efectos de Alcohol o Drogas',
    description: 'Ingresar o permanecer en el centro de formación o empresas de práctica bajo efectos de bebidas embriagantes o sustancias psicoactivas, o ingresar con ellas.',
    articleRef: 'Art. 9º, Numeral 1',
    category: 'Disciplinario',
    practicalExample: 'Asistir con aliento alcohólico a una práctica de laboratorio o taller.',
    consequenceOrBenefit: 'Constituye falta gravísima sancionable de inmediato con cancelación de matrícula.'
  },
  {
    id: 'rd-12',
    type: 'prohibicion',
    title: 'Porte de Armas u Objetos Peligrosos',
    description: 'Ingresar o portar armas de fuego, armas blancas u objetos cortopunzantes o explosivos que amenacen la vida y seguridad de la comunidad educativa.',
    articleRef: 'Art. 9º, Numeral 2',
    category: 'Seguridad',
    practicalExample: 'Llevar navajas o elementos contundentes al centro formativo.',
    consequenceOrBenefit: 'Falta gravísima con reporte a autoridades judiciales y expulsión inmediata del SENA.'
  },
  {
    id: 'rd-13',
    type: 'prohibicion',
    title: 'Plagio, Fraude y Suplantación Académica',
    description: 'Presentar como propios trabajos, investigaciones, códigos o evidencias elaboradas por otros, copiar en evaluaciones o suplantar a compañeros en listas o plataformas.',
    articleRef: 'Art. 9º, Numeral 11',
    category: 'Academico',
    practicalExample: 'Copiar un código o ensayo entero de internet y firmarlo con tu nombre sin citar la fuente.',
    consequenceOrBenefit: 'Calificación de No Aprobado con plan de mejoramiento o comité disciplinario por falta a la integridad.'
  },
  {
    id: 'rd-14',
    type: 'falta',
    title: 'Inasistencia Injustificada Reiterada (Deserción)',
    description: 'No asistir de manera injustificada durante tres (3) días hábiles consecutivos o no contactar al centro tras vencerse un aplazamiento.',
    articleRef: 'Acuerdo 009 de 2024 (Régimen de Deserción)',
    category: 'Disciplinario',
    practicalExample: 'Dejar de asistir lunes, martes y miércoles sin enviar incapacidad ni comunicarse con el vocero o instructor.',
    consequenceOrBenefit: 'El subdirector expide acto administrativo de cancelación de matrícula e inhabilidad para inscribirse en el SENA.'
  },
  {
    id: 'rd-15',
    type: 'medida_formativa',
    title: 'Plan de Mejoramiento Académico / Disciplinario',
    description: 'Medida pedagógica concertada entre el instructor y el aprendiz para superar falencias en competencias o corregir conductas contrarias a la convivencia.',
    articleRef: 'Acuerdo 009 de 2024 (Medidas Formativas)',
    category: 'Academico',
    practicalExample: 'Acordar una fecha límite de 15 días para entregar un proyecto corregido con acompañamiento de un tutor.',
    consequenceOrBenefit: 'Brinda una oportunidad real de nivelación antes de una sanción formal definitiva.'
  },
  {
    id: 'rd-16',
    type: 'derecho',
    title: 'Tutor de Práctica y Cobertura ARL en Etapa Productiva',
    description: 'Contar con la asignación obligatoria de un tutor por la empresa o entidad co-formadora y la afiliación efectiva a ARL y Salud desde el inicio de la etapa productiva.',
    articleRef: 'Acuerdo 009 de 2024 / Ley 789 de 2002 / Dec. 1072 de 2015',
    category: 'Etapa Productiva',
    practicalExample: 'La empresa patrocinadora debe designar formalmente al tutor de práctica y radicar el plan formativo conjunto con el SENA desde el inicio.',
    consequenceOrBenefit: 'Garantiza protección laboral, seguridad integral y mentoría formativa en el entorno productivo real.',
    isUpdate2026: true
  },
  {
    id: 'rd-17',
    type: 'derecho',
    title: 'Comité de Evaluación con Garantía Paritaria y Enfoque Formativo',
    description: 'Ser escuchado en audiencia con presencia del vocero de aprendices y representante de bienestar, con prioridad estricta de medidas pedagógicas y plan de mejoramiento antes de cualquier sanción formal.',
    articleRef: 'Acuerdo 009 de 2024, Art. 48',
    category: 'Disciplinario',
    practicalExample: 'Si se convoca a comité, el aprendiz recibe la citación en su correo @soy.sena.edu.co con 3 días de antelación y cuenta con el acompañamiento de su vocero de centro.',
    consequenceOrBenefit: 'Elimina decisiones unilaterales y asegura que la formación prime sobre la exclusión.',
    isUpdate2026: true
  },
  {
    id: 'rd-18',
    type: 'deber',
    title: 'Uso Ético de Tecnologías, Inteligencia Artificial y Netiqueta',
    description: 'Declarar de forma transparente el uso de herramientas de IA en evidencias de aprendizaje, citar fuentes y evitar el plagio o suplantación en plataformas SENA.',
    articleRef: 'Acuerdo 009 de 2024, Art. 9º / Guía Zajuna',
    category: 'Academico',
    practicalExample: 'Si utilizas un modelo tecnológico o IA para estructurar ideas, debes indicar en la bibliografía la fuente o herramienta y redactar las conclusiones con tu propio análisis.',
    consequenceOrBenefit: 'Desarrolla pensamiento crítico, integridad profesional y evita procesos disciplinarios por fraude.',
    isUpdate2026: true
  },
  {
    id: 'rd-19',
    type: 'deber',
    title: 'Suscripción del Compromiso Institucional y Notificación @soy.sena.edu.co',
    description: 'Firmar digitalmente el Pacto de Convivencia y Compromiso Institucional del Aprendiz al culminar la inducción y mantener activo el correo @soy.sena.edu.co para comunicaciones oficiales.',
    articleRef: 'Acuerdo 009 de 2024 / Manual de Inducción',
    category: 'Institucional',
    practicalExample: 'Completar la firma digital del compromiso para legalizar formalmente la matrícula en el sistema de gestión académica.',
    consequenceOrBenefit: 'Habilita plenamente la condición de aprendiz regular y el acceso a apoyos de bienestar.',
    isUpdate2026: true
  }
];

export const EVALUATION_QUESTIONS: EvaluationQuestion[] = [
  {
    id: 'q-01',
    moduleId: 'identidad',
    category: 'Identidad Institucional',
    scenario: 'Durante el recorrido por el Centro de Formación, el instructor de inducción les muestra el escudo oficial del SENA y les pide identificar los elementos que representan los sectores de la economía colombiana.',
    question: '¿Qué elementos del escudo del SENA representan los tres sectores económicos del país?',
    options: [
      {
        text: 'La bandera tricolor, el cóndor de los Andes y el sol naciente.',
        rationale: 'Estos son símbolos patrios de Colombia, no del escudo del SENA.'
      },
      {
        text: 'El café/espiga (sector primario), la rueda dentada (sector secundario/industria) y el caduceo (sector terciario/servicios y comercio).',
        rationale: '¡Correcto! El escudo del SENA plasma fielmente la articulación con los tres grandes motores económicos del país.'
      },
      {
        text: 'Un libro abierto, una pluma de oro y una antorcha olímpica.',
        rationale: 'Son símbolos educativos genéricos, no corresponden al escudo del SENA.'
      },
      {
        text: 'Un computador portátil, un casco de obrero y una probeta química.',
        rationale: 'Aunque representan tecnología, no forman parte de la heráldica oficial del SENA.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Manual de Imagen e Identidad Corporativa SENA',
    difficulty: 'basico'
  },
  {
    id: 'q-02',
    moduleId: 'identidad',
    category: 'Identidad Institucional',
    scenario: 'En una charla con el coordinador de formación, se explica el año de nacimiento del SENA y quién fue su fundador más emblemático.',
    question: '¿En qué año fue creado el SENA y gracias a qué líder visionario?',
    options: [
      {
        text: 'En 1991 mediante la nueva Constitución Nacional promovida por Luis Carlos Galán.',
        rationale: 'En 1991 se reformó la constitución, pero el SENA ya existía desde décadas atrás.'
      },
      {
        text: 'En 1957 mediante el Decreto Ley 118, impulsado por Rodolfo Martínez Tono.',
        rationale: '¡Excelente! Rodolfo Martínez Tono fundó el SENA el 21 de junio de 1957.'
      },
      {
        text: 'En 1980 por iniciativa de un grupo de rectores universitarios de Bogotá.',
        rationale: 'El SENA no nació en los años 80 ni fue una iniciativa universitaria.'
      },
      {
        text: 'En 1948 tras el Bogotazo como un programa de auxilio del Ministerio de Trabajo.',
        rationale: 'No corresponde a la fecha ni gesta de fundación del SENA.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Historia Institucional SENA / Decreto Ley 118 de 1957',
    difficulty: 'basico'
  },
  {
    id: 'q-03',
    moduleId: 'derechos-deberes',
    category: 'Derechos y Deberes',
    scenario: 'Camilo, aprendiz de programación, sufre una virosis repentina y el médico de su EPS le expide una incapacidad de 2 días a partir del día martes.',
    question: 'Según el Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), ¿cuál es el plazo máximo que tiene Camilo para presentar la justificación médica ante su instructor?',
    options: [
      {
        text: 'Hasta el final del trimestre o cierre de fase evaluativa.',
        rationale: 'Falso. Esperar al cierre del trimestre acarreará apertura de proceso por deserción o falta injustificada.'
      },
      {
        text: 'Dentro de los tres (3) días hábiles siguientes a la ocurrencia de la inasistencia.',
        rationale: '¡Exacto! El Art. 8º numeral 3 del Acuerdo 009 de 2024 estipula 3 días hábiles para radicar los soportes válidos.'
      },
      {
        text: 'No es necesario justificar si la falta no supera los 5 días continuos.',
        rationale: 'Toda inasistencia debe ser justificada oportunamente, de lo contrario se considera falta disciplinaria.'
      },
      {
        text: 'Debe pagar una multa económica a la coordinación para que le retiren la falta.',
        rationale: 'El SENA es 100% gratuito y no cobra multas pecuniarias bajo ninguna circunstancia.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), Art. 8º, Numeral 3',
    difficulty: 'intermedio'
  },
  {
    id: 'q-04',
    moduleId: 'derechos-deberes',
    category: 'Derechos y Deberes',
    scenario: 'Al ingresar a la sede del Centro de Formación, el guarda de seguridad le solicita a una aprendiz que muestre su carné institucional. Ella responde que lo tiene guardado en el fondo del bolso y que no es necesario portarlo a la vista.',
    question: '¿Qué establece el Reglamento del Aprendiz respecto al porte del carné institucional?',
    options: [
      {
        text: 'Solo es obligatorio portarlo los días de evaluaciones finales o entrega de proyectos.',
        rationale: 'El carné debe portarse de manera permanente todos los días de formación.'
      },
      {
        text: 'Es un deber portarlo visiblemente en todo momento dentro de las instalaciones del SENA.',
        rationale: '¡Correcto! El porte visible garantiza la seguridad de toda la comunidad SENA e identifica a los aprendices activos.'
      },
      {
        text: 'El aprendiz puede negarse a mostrarlo si muestra la cédula de ciudadanía en su celular.',
        rationale: 'La cédula no reemplaza la acreditación institucional activa del SENA.'
      },
      {
        text: 'El carné es opcional y solo se utiliza para pedir libros en la biblioteca.',
        rationale: 'El carné es de carácter obligatorio para el ingreso y permanencia institucional.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), Art. 8º, Numeral 1',
    difficulty: 'basico'
  },
  {
    id: 'q-05',
    moduleId: 'derechos-deberes',
    category: 'Derechos y Deberes',
    scenario: 'Un instructor sospecha que un aprendiz descargó un proyecto de software completo de GitHub y lo presentó como evidencia individual sin citar créditos ni hacer aportes.',
    question: '¿Cómo clasifica el Reglamento del Aprendiz el plagio o fraude académico y cuál es el procedimiento legal?',
    options: [
      {
        text: 'Se le expulsa de inmediato sin necesidad de escucharlo ni presentar descargos.',
        rationale: 'Todo procedimiento requiere garantizar el debido proceso y presunción de inocencia en comité.'
      },
      {
        text: 'Es una falta contra la ética que amerita investigación, respetando el debido proceso y garantizando el derecho a la defensa ante el Comité de Evaluación.',
        rationale: '¡Muy bien! Se convoca a Comité de Evaluación y Seguimiento para analizar pruebas, escuchar descargos y recomendar medidas.'
      },
      {
        text: 'No es una falta si el código estaba en un repositorio público de acceso abierto.',
        rationale: 'Apropiarse de creaciones ajenas presentándolas como propias sin autorización o citación es plagio.'
      },
      {
        text: 'El aprendiz solo debe pedir una disculpa pública ante el grupo de WhatsApp.',
        rationale: 'Las faltas a la integridad académica se gestionan formalmente mediante el debido proceso disciplinario.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), Art. 9º y Debido Proceso',
    difficulty: 'avanzado'
  },
  {
    id: 'q-06',
    moduleId: 'ruta-formacion',
    category: 'Ruta de Formación',
    scenario: 'Laura está culminando su etapa lectiva y su instructor le solicita seleccionar una alternativa para cumplir su etapa productiva obligatoria.',
    question: '¿Cuál de las siguientes NO es una alternativa válida de etapa productiva en el SENA?',
    options: [
      {
        text: 'Contrato de Aprendizaje con una empresa patrocinadora.',
        rationale: 'Es una de las alternativas más comunes y tradicionales del SENA.'
      },
      {
        text: 'Pagar una tarifa monetaria al Centro de Formación para convalidar las horas sin hacer práctica.',
        rationale: '¡Correcto, esta NO es válida! En el SENA la formación es gratuita y la etapa productiva exige aplicación real de competencias.'
      },
      {
        text: 'Proyecto Productivo estructurado o creación de empresa con Fondo Emprender.',
        rationale: 'Es una alternativa 100% válida de etapa productiva.'
      },
      {
        text: 'Vínculo laboral o contractual si desempeña funciones directamente afines a su programa formativo.',
        rationale: 'Es una modalidad formal válida siempre que las tareas correspondan a las competencias del perfil.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), Capítulo Etapa Productiva',
    difficulty: 'intermedio'
  },
  {
    id: 'q-07',
    moduleId: 'ruta-formacion',
    category: 'Novedades y Trámites',
    scenario: 'Andrés deja de asistir al Centro de Formación durante el lunes, martes y miércoles sin comunicarse con sus compañeros, vocero ni instructores, y sin enviar ninguna justificación.',
    question: '¿Qué causal de novedad administrativa se configura ante esta inasistencia reiterada injustificada?',
    options: [
      {
        text: 'Aplazamiento automático de matrícula por un trimestre.',
        rationale: 'El aplazamiento debe ser solicitado voluntariamente antes de ausentarse y con causas justificadas.'
      },
      {
        text: 'Deserción del proceso de formación según el Acuerdo 009 de 2024, conllevando a trámite en Comité de Evaluación y Seguimiento y cancelación de matrícula.',
        rationale: '¡Exacto! La inasistencia injustificada durante 3 días hábiles continuos es causal expresa de deserción en el reglamento.'
      },
      {
        text: 'Traslado obligatorio a la jornada nocturna o virtual.',
        rationale: 'El traslado es una solicitud del aprendiz sujeta a cupos, no una sanción por inasistencia.'
      },
      {
        text: 'No sucede nada; el aprendiz puede reintegrarse cuando desee sin avisar.',
        rationale: 'El SENA mantiene estricto control de asistencia y deserción del gasto público de formación.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), Régimen de Deserción',
    difficulty: 'intermedio'
  },
  {
    id: 'q-08',
    moduleId: 'bienestar',
    category: 'Bienestar y Representación',
    scenario: 'La ficha de caracterización 2873190 necesita un enlace oficial para llevar las sugerencias, inquietudes y propuestas del grupo ante las directivas del centro de formación.',
    question: '¿Qué figura democrática eligen los aprendices dentro de cada ficha para representarlos ante instructores y coordinadores?',
    options: [
      {
        text: 'El Monitor Pagado de la Sala de Cómputo.',
        rationale: 'El monitor cumple labores de apoyo técnico/académico, no es el representante democrático de la ficha.'
      },
      {
        text: 'El Vocero de Ficha (Aprendiz líder principal y suplente).',
        rationale: '¡Correcto! Los voceros son elegidos democráticamente por sus pares para liderar la comunicación y dinamizar el grupo.'
      },
      {
        text: 'El aprendiz de mayor edad del salón por designación directa.',
        rationale: 'La elección es democrática y por votación, no por edad ni designación.'
      },
      {
        text: 'El aprendiz con el mejor promedio en pruebas ICFES.',
        rationale: 'No se asigna por puntajes previos de ingreso sino por elección popular entre compañeros.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), Art. 7º - Representación y Vocería',
    difficulty: 'basico'
  },
  {
    id: 'q-09',
    moduleId: 'bienestar',
    category: 'Bienestar y Apoyos',
    scenario: 'María es madre cabeza de hogar en estrato 1 y cursa un tecnólogo presencial con excelente rendimiento académico y sin sanciones disciplinarias.',
    question: '¿A qué beneficio institucional de Bienestar al Aprendiz puede postularse María para mitigar sus gastos diarios?',
    options: [
      {
        text: 'A un préstamo bancario con intereses condonables de Icetex.',
        rationale: 'El SENA cuenta con sus propios apoyos socioeconómicos no reembolsables.'
      },
      {
        text: 'A las convocatorias de Apoyos de Sostenimiento (Regular o FIC) según su centro y sector.',
        rationale: '¡Excelente! Los apoyos de sostenimiento son recursos monetarios directos otorgados a aprendices vulnerables destacados.'
      },
      {
        text: 'A un sueldo de instructor de medio tiempo.',
        rationale: 'Los aprendices no son vinculados como instructores de planta mientras se forman.'
      },
      {
        text: 'Exclusivamente al uso libre de la fotocopiadora del centro.',
        rationale: 'El programa de Bienestar ofrece apoyos económicos formales mucho más amplios.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Resolución Nacional de Bienestar al Aprendiz SENA',
    difficulty: 'intermedio'
  },
  {
    id: 'q-10',
    moduleId: 'tecnologia',
    category: 'Ecosistema Digital',
    scenario: 'Un aprendiz desea consultar si aprobó el resultado de aprendizaje de la competencia técnica del primer trimestre y descargar su constancia de matrícula.',
    question: '¿Cuál es la plataforma oficial del SENA para gestionar matrículas, consultar juicios evaluativos y expedir certificados?',
    options: [
      {
        text: 'LinkedIn Learning Colombia.',
        rationale: 'Es una red profesional externa, no la plataforma misional del SENA.'
      },
      {
        text: 'Portal SOFIA Plus (Sistema Optimizado para la Formación Integral del Aprendizaje Activo).',
        rationale: '¡Exacto! En SOFIA Plus se gestiona todo el historial académico, inscripciones y certificaciones.'
      },
      {
        text: 'Un grupo de mensajería de Telegram creado por los compañeros.',
        rationale: 'No tiene validez oficial institucional para consultas de juicio evaluativo.'
      },
      {
        text: 'La página de Facebook del centro de formación.',
        rationale: 'Es una red social de divulgación, no el sistema de información académico oficial.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Guía de Sistemas de Información SENA - SOFIA Plus',
    difficulty: 'basico'
  },
  {
    id: 'q-11',
    moduleId: 'ruta-formacion',
    category: 'Etapa Productiva y Prácticas',
    scenario: 'Bajo los lineamientos del Acuerdo 009 de 2024, la Ley 789 de 2002 y el Decreto 1072 de 2015, una aprendiz inicia su contrato de aprendizaje en una empresa.',
    question: '¿Qué garantías y condiciones son de carácter obligatorio para la empresa co-formadora durante la etapa productiva?',
    options: [
      {
        text: 'Permitirle trabajar sin supervisión y pagarle en bonos comerciales.',
        rationale: 'La empresa debe garantizar apoyo de sostenimiento legal y tutoría formal, no remuneración en especie no autorizada.'
      },
      {
        text: 'Designar un tutor empresarial, concertar el plan formativo con el instructor del SENA y garantizar afiliación a ARL y Salud desde el primer día de práctica.',
        rationale: '¡Excelente! La normatividad vigente (Acuerdo 009 de 2024, Ley 789 de 2002 y Dec. 1072 de 2015) exige tutor empresarial, plan formativo concertado y cobertura total de riesgos laborales.'
      },
      {
        text: 'Exigirle a la aprendiz que contrate su propia póliza contra accidentes laborales.',
        rationale: 'La afiliación y pago de ARL es responsabilidad y obligación legal exclusiva de la empresa patrocinadora.'
      },
      {
        text: 'Solo aplica si la empresa cuenta con más de 1.000 trabajadores en nómina.',
        rationale: 'La regulación de prácticas y contrato de aprendizaje aplica a toda empresa co-formadora que vincule aprendices.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Acuerdo 009 de 2024 / Ley 789 de 2002 / Decreto 1072 de 2015',
    difficulty: 'intermedio',
    isUpdate2026: true
  },
  {
    id: 'q-12',
    moduleId: 'derechos-deberes',
    category: 'Comité de Evaluación y Seguimiento',
    scenario: 'Un aprendiz es citado al Comité de Evaluación y Seguimiento de su Centro de Formación tras haber tenido dificultades de entrega en el último proyecto formativo.',
    question: 'Según el Artículo 48 del Reglamento del Aprendiz (Acuerdo 009 de 2024), ¿cuál es el principio rector que debe guiar las actuaciones del Comité?',
    options: [
      {
        text: 'La expulsión inmediata y sanción económica obligatoria.',
        rationale: 'El SENA no expulsa sin debido proceso ni cobra sanciones económicas bajo ningún motivo.'
      },
      {
        text: 'La primacía del enfoque pedagógico y formativo, priorizando la formulación de un Plan de Mejoramiento Integral antes de recomendar cualquier medida sancionatoria.',
        rationale: '¡Correcto! El Acuerdo 009 de 2024 (Art. 48) ratifica el carácter formativo del SENA, exigiendo agotar planes pedagógicos antes de contemplar sanciones.'
      },
      {
        text: 'Sesionar a puerta cerrada sin permitir el ingreso ni descargos del aprendiz.',
        rationale: 'Viola flagrantemente el derecho constitucional a la defensa y el debido proceso consagrado en el Art. 48 del Acuerdo 009 de 2024.'
      },
      {
        text: 'Delegar la decisión final en un sistema automatizado sin deliberación colegiada ni voceros.',
        rationale: 'El Comité es un órgano colegiado y paritario con participación humana de instructores, directivos y vocero de aprendices.'
      }
    ],
    correctIndex: 1,
    reglamentoCitation: 'Reglamento del Aprendiz SENA (Acuerdo 009 de 2024, Art. 48)',
    difficulty: 'intermedio',
    isUpdate2026: true
  }
];

export const INITIAL_LEARNER_PROFILE = {
  id: 'apr-001',
  fullName: 'Valentina Restrepo Morales',
  documentType: 'CC' as const,
  documentNumber: '1020485921',
  email: 'vrestrepo92@soy.sena.edu.co',
  phone: '314 892 4510',
  ficha: '2873190',
  programName: 'Análisis y Desarrollo de Software (ADSO)',
  regional: 'Regional Distrito Capital',
  trainingCenter: 'Centro de Gestión de Mercados, Logística y Tecnologías de la Información',
  inductionStartDate: '2026-10-15',
  status: 'en_induccion' as const,
  completedModules: ['identidad'],
  hasSignedPact2026: false
};
