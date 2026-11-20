import { useEffect, useRef, useState } from 'react';

const CLAVES_ALMACENAMIENTO = {
  planes: 'kronodo_planes_v1',
  mensajes: 'kronodo_mensajes_v1',
  tareas: 'kronodo_tareas_v1',
  fallas: 'kronodo_fallas_v1',
  rol: 'kronodo_rol_v1',
  usuarioActual: 'kronodo_usuario_actual_v1',
  cuentas: 'kronodo_cuentas_v1',
  recorridoListo: 'kronodo_recorrido_listo_v1'
};

const URL_FORMULARIO_CONTACTO = 'https://formspree.io/f/xljblkdb';

const ESTRELLAS = Array.from({ length: 85 }, (_, indice) => ({
  id: indice,
  tamano: `${(Math.random() * 2.2 + 1).toFixed(1)}px`,
  izquierda: `${(Math.random() * 100).toFixed(2)}%`,
  arriba: `${(Math.random() * 100).toFixed(2)}%`,
  duracion: `${(Math.random() * 3.5 + 2).toFixed(2)}s`,
  retraso: `${(Math.random() * 4).toFixed(2)}s`
}));

const PLANES_INICIALES = [
  {
    nombre: 'Plan Gratuito',
    precioMensual: 0,
    insignia: '',
    destacado: false,
    descripcion: 'Ideal para conocer Krono Do y estructurar tu día a día básico sin costo.',
    herramientas: [
      {
        etiqueta: 'To-Do List 1-3-5',
        queEs: 'Organizador diario estructurado en 1 tarea crítica, 3 medianas y 5 ligeras.',
        oferta: 'Incluye hasta 15 tareas activas por día.'
      },
      {
        etiqueta: 'Brain Dump IA',
        queEs: 'Convierte notas sueltas en tareas ordenadas automáticamente.',
        oferta: 'Límite de 5 volcados mentales por día.'
      },
      {
        etiqueta: 'Modos de Energía',
        queEs: 'Filtra tus pendientes según tu nivel de concentración.',
        oferta: 'Acceso a modos Alta y Cansado.'
      },
      {
        etiqueta: 'Reprogramación',
        queEs: 'Ajuste de bloques cuando cambian tus horarios.',
        oferta: 'Reprogramación manual en la vista Panorama.'
      }
    ]
  },
  {
    nombre: 'Plan Pro',
    precioMensual: 4.99,
    insignia: 'Más Recomendado',
    destacado: true,
    descripcion: 'Potencia completa con IA ilimitada y reajuste automático para máxima productividad.',
    herramientas: [
      {
        etiqueta: 'To-Do List Ilimitado',
        queEs: 'Gestión sin límites de proyectos, etiquetas y subtareas inteligentes.',
        oferta: 'Tareas y proyectos ilimitados todos los días.'
      },
      {
        etiqueta: 'Brain Dump IA Pro',
        queEs: 'Análisis semántico avanzado con estimación automática de tiempos.',
        oferta: 'Uso 100% ilimitado por texto y notas rápidas.'
      },
      {
        etiqueta: '3 Modos de Energía',
        queEs: 'Adapta tu lista al instante según tu estado físico y mental.',
        oferta: 'Incluye Alta, Cansado y Micro-Bloques de 15 min.'
      },
      {
        etiqueta: 'Reajuste Automático',
        queEs: 'Recalcula toda tu agenda con un clic ante cualquier retraso.',
        oferta: 'Reprogramación elástica ilimitada + Sync Calendario.'
      }
    ]
  },
  {
    nombre: 'Plan Equipos & Estudio',
    precioMensual: 8.99,
    insignia: 'Colaborativo',
    destacado: false,
    descripcion: 'Diseñado para grupos de estudio, proyectos académicos y equipos de trabajo.',
    herramientas: [
      {
        etiqueta: 'Tableros Compartidos',
        queEs: 'Espacios colaborativos para dividir entregas y responsabilidades.',
        oferta: 'Hasta 8 integrantes por espacio compartido.'
      },
      {
        etiqueta: 'Plantillas de Estudio',
        queEs: 'Estructuras listas para preparación de exámenes y sprints.',
        oferta: 'Biblioteca completa de plantillas académicas y técnicas.'
      },
      {
        etiqueta: 'Resumen Semanal IA',
        queEs: 'Reporte automático de horas enfocadas y metas cumplidas.',
        oferta: 'Métricas detalladas exportables cada semana.'
      },
      {
        etiqueta: 'Todo Plan Pro',
        queEs: 'Incluye todas las funciones individuales sin restricciones.',
        oferta: 'IA ilimitada y soporte prioritario incluido.'
      }
    ]
  }
];

const TAREAS_INICIALES = [
  { id: 't1', etiqueta: '1. Prototipo final Krono Do', categoria: 'Crítica', minutos: 45, completada: false },
  { id: 't2', etiqueta: '2. Guía de ejercicios de física', categoria: 'Media', minutos: 30, completada: false },
  { id: 't3', etiqueta: '3. Ordenar carpeta de evidencias', categoria: 'Ligera', minutos: 15, completada: false }
];

const FALLAS_INICIALES = [
  {
    id: 'falla-1',
    titulo: 'Revisión de sincronización en vista Panorama',
    prioridad: 'Media',
    seccion: 'Panorama',
    descripcion: 'Verificar comportamiento al acumular más de 4 retrasos seguidos en el mismo día.',
    estado: 'Abierta',
    fecha: 'Hoy'
  }
];

function leerAlmacenamiento(clave, respaldo) {
  try {
    const crudo = window.localStorage.getItem(clave);
    return crudo ? JSON.parse(crudo) : respaldo;
  } catch {
    return respaldo;
  }
}

function guardarAlmacenamiento(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Ignorar errores de almacenamiento
  }
}

function clasificarTextoBrainDump(textoCrudo) {
  const fragmentos = textoCrudo
    .split(/,|;|\n|\by\b/gi)
    .map((parte) => parte.trim())
    .filter(Boolean);

  const elementosAClasificar = fragmentos.length > 0 ? fragmentos : [textoCrudo.trim()];

  return elementosAClasificar.map((segmento, indice) => {
    const minusculas = segmento.toLowerCase();
    let categoria = 'Media';
    let minutos = 25;

    if (
      indice === 0 ||
      minusculas.includes('examen') ||
      minusculas.includes('entrega') ||
      minusculas.includes('prototipo')
    ) {
      categoria = 'Crítica';
      minutos = 45;
    } else if (
      minusculas.includes('correo') ||
      minusculas.includes('ordenar') ||
      minusculas.includes('comprar') ||
      minusculas.includes('repasar')
    ) {
      categoria = 'Ligera';
      minutos = 15;
    }

    return {
      id: `tarea-${Date.now()}-${indice}-${Math.random().toString(36).slice(2, 6)}`,
      etiqueta: segmento,
      categoria,
      minutos,
      completada: false
    };
  });
}

function obtenerRespuestaKrono(consulta, tareasActuales = []) {
  const minusculas = consulta.toLowerCase();
  if (minusculas.includes('gratuito') || minusculas.includes('pro') || minusculas.includes('precio')) {
    return 'El Plan Gratuito ($0) te permite hasta 15 tareas diarias y 5 volcados en Brain Dump IA al día. El Plan Pro ($4.99/mes o $3.99/mes anual) desbloquea IA ilimitada, los 3 modos de energía y la reprogramación automática ante imprevistos.';
  }
  if (minusculas.includes('1-3-5') || minusculas.includes('metodología')) {
    return 'La metodología 1-3-5 estructura tu día con realismo: 1 tarea crítica de alto impacto, 3 tareas medianas de avance y 5 tareas ligeras o rápidas. Así evitas saturarte y siempre avanzas en lo importante.';
  }
  if (minusculas.includes('química') || minusculas.includes('estudio') || minusculas.includes('organízame')) {
    const pendientes = tareasActuales.filter((t) => !t.completada).length;
    return `Propuesta Krono Do (tienes ${pendientes} pendientes activos): 1) Bloque Crítico (45 min, Energía Alta): resolver ejercicios clave de química. 2) Bloque Medio (30 min): estructurar las diapositivas de la exposición. 3) Bloque Ligero (15 min): ensayo final en voz alta.`;
  }
  return 'Puedo ayudarte a dividir tus pendientes en bloques según tu energía actual o recomendarte el plan ideal de Krono Do. Prueba escribir una lista de tareas que tengas pendiente hoy.';
}

function sumarMinutosAHora(minutosBaseMedianoche, desplazamiento) {
  const total = minutosBaseMedianoche + desplazamiento;
  const horas = String(Math.floor(total / 60) % 24).padStart(2, '0');
  const minutos = String(total % 60).padStart(2, '0');
  return `${horas}:${minutos}`;
}

export default function App() {
  const recorridoCompletado = leerAlmacenamiento(CLAVES_ALMACENAMIENTO.recorridoListo, false);

  const [vistaActiva, setVistaActiva] = useState('inicio');
  const [menuHamburguesaAbierto, setMenuHamburguesaAbierto] = useState(false);
  const [pestanaAdminCompleta, setPestanaAdminCompleta] = useState('fallas');
  const [fotoFundadoraFaltante, setFotoFundadoraFaltante] = useState(false);

  const [mostrarRecorrido, setMostrarRecorrido] = useState(!recorridoCompletado);
  const [pasoRecorrido, setPasoRecorrido] = useState(0);
  const [mostrarInicioSesion, setMostrarInicioSesion] = useState(false);
  const [modoAcceso, setModoAcceso] = useState('login');
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeErrorAcceso, setMensajeErrorAcceso] = useState('');
  const [cuentas, setCuentas] = useState(() => leerAlmacenamiento(CLAVES_ALMACENAMIENTO.cuentas, []));
  const [usuarioActual, setUsuarioActual] = useState(() =>
    leerAlmacenamiento(CLAVES_ALMACENAMIENTO.usuarioActual, null)
  );
  const [rol, setRol] = useState(() => leerAlmacenamiento(CLAVES_ALMACENAMIENTO.rol, 'Invitado'));

  const [pantallaCelular, setPantallaCelular] = useState('ahora');
  const [energia, setEnergia] = useState('alta');
  const [segundosRestantes, setSegundosRestantes] = useState(25 * 60);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);
  const [tareas, setTareas] = useState(() => leerAlmacenamiento(CLAVES_ALMACENAMIENTO.tareas, TAREAS_INICIALES));
  const [textoBrainDump, setTextoBrainDump] = useState('');
  const [avisoBrainDump, setAvisoBrainDump] = useState('');
  const [minutosRetraso, setMinutosRetraso] = useState(0);

  const [facturacion, setFacturacion] = useState('mensual');
  const [planes, setPlanes] = useState(() => leerAlmacenamiento(CLAVES_ALMACENAMIENTO.planes, PLANES_INICIALES));
  const [herramientasSeleccionadas, setHerramientasSeleccionadas] = useState({ 0: 0, 1: 0, 2: 0 });

  const [mensajes, setMensajes] = useState([
    {
      remitente: 'bot',
      texto: 'Hola, soy Krono IA. Puedo ayudarte a comparar el Plan Gratuito con el Plan Pro, explicarte cómo funciona el filtro por energía o estructurar tus pendientes del día. ¿En qué te ayudo?'
    }
  ]);
  const [entradaChat, setEntradaChat] = useState('');

  const [formularioContacto, setFormularioContacto] = useState({
    nombre: '',
    correo: '',
    tema: '',
    mensaje: ''
  });
  const [contactoEnviado, setContactoEnviado] = useState(false);
  const [errorContacto, setErrorContacto] = useState('');
  const [enviandoContacto, setEnviandoContacto] = useState(false);
  const [mensajesGuardados, setMensajesGuardados] = useState(() =>
    leerAlmacenamiento(CLAVES_ALMACENAMIENTO.mensajes, [])
  );
  const [nuevoPlan, setNuevoPlan] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    herramienta: '',
    infoHerramienta: ''
  });

  const [fallas, setFallas] = useState(() => leerAlmacenamiento(CLAVES_ALMACENAMIENTO.fallas, FALLAS_INICIALES));
  const [formularioFalla, setFormularioFalla] = useState({
    titulo: '',
    prioridad: 'Media',
    seccion: 'General',
    descripcion: ''
  });

  const [reproduciendoMusica, setReproduciendoMusica] = useState(false);
  const [volumen, setVolumen] = useState(35);
  const refAudio = useRef(null);

  useEffect(() => {
    guardarAlmacenamiento(CLAVES_ALMACENAMIENTO.planes, planes);
  }, [planes]);

  useEffect(() => {
    guardarAlmacenamiento(CLAVES_ALMACENAMIENTO.mensajes, mensajesGuardados);
  }, [mensajesGuardados]);

  useEffect(() => {
    guardarAlmacenamiento(CLAVES_ALMACENAMIENTO.tareas, tareas);
  }, [tareas]);

  useEffect(() => {
    guardarAlmacenamiento(CLAVES_ALMACENAMIENTO.fallas, fallas);
  }, [fallas]);

  useEffect(() => {
    guardarAlmacenamiento(CLAVES_ALMACENAMIENTO.rol, rol);
  }, [rol]);

  useEffect(() => {
    guardarAlmacenamiento(CLAVES_ALMACENAMIENTO.cuentas, cuentas);
  }, [cuentas]);

  useEffect(() => {
    guardarAlmacenamiento(CLAVES_ALMACENAMIENTO.usuarioActual, usuarioActual);
  }, [usuarioActual]);

  useEffect(() => {
    if (!temporizadorActivo) return;
    const intervalo = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          setTemporizadorActivo(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

  const navegarDesdeMenu = (seccionId, vistaEspecial = 'inicio') => {
    setMenuHamburguesaAbierto(false);
    if (vistaEspecial === 'adminCompleto') {
      abrirAdminCompleto();
      return;
    }
    irASeccion(seccionId);
  };

    return () => clearInterval(intervalo);
  }, [temporizadorActivo]);

  useEffect(() => {
    const audio = new Audio('/musica.mp3');
    audio.loop = true;
    audio.volume = volumen / 100;
    audio.addEventListener('ended', () => setReproduciendoMusica(false));
    refAudio.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const irASeccion = (idSeccion) => {
    setVistaActiva('inicio');
    setTimeout(() => {
      const elemento = document.getElementById(idSeccion);
      if (elemento) elemento.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 40);
  };

  const abrirPaginaEquipo = () => {
    setVistaActiva('equipo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const abrirAdminCompleto = () => {
    setVistaActiva('adminCompleto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const terminarRecorrido = () => {
    guardarAlmacenamiento(CLAVES_ALMACENAMIENTO.recorridoListo, true);
    setMostrarRecorrido(false);
    setModoAcceso('login');
    setMensajeErrorAcceso('');
    setMostrarInicioSesion(true);
  };

  const cambiarModoAcceso = (nuevoModo) => {
    setModoAcceso(nuevoModo);
    setMensajeErrorAcceso('');
  };

  const enviarInicioSesion = (e) => {
    e.preventDefault();
    const correoLimpio = correo.trim().toLowerCase();
    if (!correoLimpio || !contrasena) {
      setMensajeErrorAcceso('Completa tu correo y contraseña.');
      return;
    }

    if (contrasena === 'KronoDo2026') {
      setMensajeErrorAcceso('');
      setMostrarInicioSesion(false);
      setUsuarioActual({ nombre: 'Admin', correo: correoLimpio });
      setRol('Admin');
      setContrasena('');
      return;
    }

    const cuentaEncontrada = cuentas.find(
      (c) => c.correo.toLowerCase() === correoLimpio && c.contrasena === contrasena
    );

    if (cuentaEncontrada) {
      setMensajeErrorAcceso('');
      setMostrarInicioSesion(false);
      setUsuarioActual({ nombre: cuentaEncontrada.nombre, correo: cuentaEncontrada.correo });
      setRol('Usuario');
      setContrasena('');
      if (vistaActiva === 'adminCompleto') setVistaActiva('inicio');
    } else {
      setMensajeErrorAcceso(
        'No encontramos una cuenta con esos datos. Si es tu primera vez, cambia a la pestaña "Registrarse".'
      );
    }
  };

  const enviarRegistro = (e) => {
    e.preventDefault();
    const nombreLimpio = nombreRegistro.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (!nombreLimpio || !correoLimpio || contrasena.length < 4) {
      setMensajeErrorAcceso('Ingresa tu nombre, correo y una contraseña de al menos 4 caracteres.');
      return;
    }

    const yaExiste = cuentas.some((c) => c.correo.toLowerCase() === correoLimpio);
    if (yaExiste) {
      setMensajeErrorAcceso('Ese correo ya está registrado. Intenta iniciar sesión.');
      return;
    }

    const esAdmin = contrasena === 'KronoDo2026';
    const nuevaCuenta = {
      nombre: esAdmin ? 'Admin' : nombreLimpio,
      correo: correoLimpio,
      contrasena,
      rol: esAdmin ? 'Admin' : 'Usuario'
    };

    setCuentas((prev) => [...prev, nuevaCuenta]);
    setUsuarioActual({ nombre: nuevaCuenta.nombre, correo: nuevaCuenta.correo });
    setRol(nuevaCuenta.rol);
    setMensajeErrorAcceso('');
    setMostrarInicioSesion(false);
    setNombreRegistro('');
    setContrasena('');
    if (!esAdmin && vistaActiva === 'adminCompleto') {
      setVistaActiva('inicio');
    }
  };

  const entrarComoInvitado = () => {
    setMensajeErrorAcceso('');
    setMostrarInicioSesion(false);
    setUsuarioActual(null);
    setRol('Invitado');
    if (vistaActiva === 'adminCompleto') setVistaActiva('inicio');
  };

  const cambiarEnergia = (modo) => {
    setEnergia(modo);
    setTemporizadorActivo(false);
    if (modo === 'alta') setSegundosRestantes(25 * 60);
    else if (modo === 'cansado') setSegundosRestantes(15 * 60);
    else setSegundosRestantes(10 * 60);
  };

  const formatearTemporizador = (segs) => {
    const min = String(Math.floor(segs / 60)).padStart(2, '0');
    const seg = String(segs % 60).padStart(2, '0');
    return `${min}:${seg}`;
  };

  const enviarBrainDump = () => {
    const limpio = textoBrainDump.trim();
    if (!limpio) return;
    const generadas = clasificarTextoBrainDump(limpio);
    setTareas((prev) => [...generadas, ...prev]);
    setAvisoBrainDump(`Se agregaron ${generadas.length} tarea(s) a tu lista Ahora y Panorama.`);
    setTextoBrainDump('');
    setTimeout(() => setAvisoBrainDump(''), 3500);
  };

  const alternarTareaCompletada = (idTarea) => {
    setTareas((prev) => prev.map((t) => (t.id === idTarea ? { ...t, completada: !t.completada } : t)));
  };

  const eliminarTarea = (e, idTarea) => {
    e.stopPropagation();
    setTareas((prev) => prev.filter((t) => t.id !== idTarea));
  };

  const reiniciarDatosDemo = () => {
    setPlanes(PLANES_INICIALES);
    setTareas(TAREAS_INICIALES);
    setMensajesGuardados([]);
    setFallas(FALLAS_INICIALES);
    setMinutosRetraso(0);
    setHerramientasSeleccionadas({ 0: 0, 1: 0, 2: 0 });
    Object.values(CLAVES_ALMACENAMIENTO).forEach((clave) => {
      try {
        window.localStorage.removeItem(clave);
      } catch {
        // Ignorar
      }
    });
  };

  const enviarMensajeChat = (texto) => {
    const limpio = texto.trim();
    if (!limpio) return;
    setMensajes((prev) => [...prev, { remitente: 'usuario', texto: limpio }]);
    setTimeout(() => {
      setMensajes((prev) => [...prev, { remitente: 'bot', texto: obtenerRespuestaKrono(limpio, tareas) }]);
    }, 350);
  };

  const enviarFormularioContacto = async (e) => {
    e.preventDefault();
    setErrorContacto('');
    setEnviandoContacto(true);

    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nuevoMensaje = { ...formularioContacto, fecha: hora };

    try {
      const respuesta = await fetch(URL_FORMULARIO_CONTACTO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          nombre: formularioContacto.nombre,
          correo: formularioContacto.correo,
          tema: formularioContacto.tema,
          mensaje: formularioContacto.mensaje,
          _subject: `Nuevo mensaje Krono Do — ${formularioContacto.tema}`
        })
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo enviar el mensaje.');
      }

      setMensajesGuardados((prev) => [nuevoMensaje, ...prev]);
      setFormularioContacto({ nombre: '', correo: '', tema: '', mensaje: '' });
      setContactoEnviado(true);
      setTimeout(() => setContactoEnviado(false), 5000);
    } catch {
      setErrorContacto('No se pudo enviar el mensaje.');
    } finally {
      setEnviandoContacto(false);
    }
  };

  const agregarPlan = (e) => {
    e.preventDefault();
    const precioParseado = parseFloat(nuevoPlan.precio);
    const siguienteIndice = planes.length;
    setPlanes((prev) => [
      ...prev,
      {
        nombre: nuevoPlan.nombre.trim(),
        precioMensual: Number.isNaN(precioParseado) ? 0 : precioParseado,
        insignia: 'Nuevo',
        destacado: false,
        descripcion: nuevoPlan.descripcion.trim(),
        herramientas: [
          {
            etiqueta: nuevoPlan.herramienta.trim(),
            queEs: nuevoPlan.infoHerramienta.trim(),
            oferta: 'Incluido de forma ilimitada en este plan.'
          },
          {
            etiqueta: 'To-Do List 1-3-5',
            queEs: 'Priorización diaria inteligente.',
            oferta: 'Acceso completo incluido.'
          }
        ]
      }
    ]);
    setHerramientasSeleccionadas((prev) => ({ ...prev, [siguienteIndice]: 0 }));
    setNuevoPlan({ nombre: '', precio: '', descripcion: '', herramienta: '', infoHerramienta: '' });
  };

  const agregarFalla = (e) => {
    e.preventDefault();
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFallas((prev) => [
      {
        id: `falla-${Date.now()}`,
        titulo: formularioFalla.titulo.trim(),
        prioridad: formularioFalla.prioridad,
        seccion: formularioFalla.seccion,
        descripcion: formularioFalla.descripcion.trim(),
        estado: 'Abierta',
        fecha: hora
      },
      ...prev
    ]);
    setFormularioFalla({ titulo: '', prioridad: 'Media', seccion: 'General', descripcion: '' });
  };

  const cambiarEstadoFalla = (id) => {
    setFallas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, estado: f.estado === 'Abierta' ? 'Resuelta' : 'Abierta' } : f))
    );
  };

  const eliminarFalla = (id) => {
    setFallas((prev) => prev.filter((f) => f.id !== id));
  };

  const alternarMusica = async () => {
    const audio = refAudio.current;
    if (!audio) return;

    if (reproduciendoMusica) {
      audio.pause();
      setReproduciendoMusica(false);
    } else {
      try {
        audio.volume = volumen / 100;
        await audio.play();
        setReproduciendoMusica(true);
      } catch {
        setReproduciendoMusica(false);
      }
    }
  };

  const cambiarVolumen = (valor) => {
    const numero = Number(valor);
    setVolumen(numero);
    if (refAudio.current) {
      refAudio.current.volume = numero / 100;
    }
  };

  const etiquetasPantalla = {
    brainstorm: 'Brainstorm',
    ahora: 'Ahora',
    panorama: 'Panorama'
  };

  const tareasFiltradas = tareas.filter((t) => {
    if (energia === 'poco') return (t.minutos || 25) <= 15 || t.categoria === 'Ligera';
    if (energia === 'cansado') return t.categoria !== 'Crítica';
    return true;
  });

  let minutosInicioActual = 8 * 60 + minutosRetraso;
  const bloquesCronograma = tareas.map((t, indice) => {
    const horaBloque = sumarMinutosAHora(minutosInicioActual, 0);
    minutosInicioActual += t.minutos || 25;
    return {
      ...t,
      horaBloque,
      estadoBloque: t.completada
        ? 'Listo'
        : minutosRetraso > 0
          ? 'Reubicado'
          : indice === 0
            ? 'En curso'
            : 'Programado'
    };
  });

  const etiquetaUsuarioNav =
    rol === 'Admin'
      ? 'Admin'
      : usuarioActual
        ? `${rol} • ${usuarioActual.nombre}`
        : rol;

  return (
    <>
      <div className="fondo-galaxia" />
      <div className="capa-estrellas">
        {ESTRELLAS.map((estrella) => (
          <span
            key={estrella.id}
            className="estrella"
            style={{
              width: estrella.tamano,
              height: estrella.tamano,
              left: estrella.izquierda,
              top: estrella.arriba,
              '--dur': estrella.duracion,
              '--retraso': estrella.retraso
            }}
          />
        ))}
      </div>

      {mostrarRecorrido && (
        <div className="capa-acceso">
          <div className="tarjeta-acceso">
            <div className="contenedor-logo-acceso">
              <img src="/logo.png" alt="Krono Do" className="img-logo-marca" />
            </div>

            {pasoRecorrido === 0 && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <span className="etiqueta-seccion">Paso 1 de 3</span>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '8px' }}>
                    Vuelca tus ideas sin filtro
                  </h2>
                  <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    En Brainstorm IA escribes todo lo que tienes en mente en lenguaje natural. Krono Do detecta prioridades, tiempos y niveles de esfuerzo por ti.
                  </p>
                </div>
                <div className="caja-visual-recorrido">
                  <div className="pildora-muestra">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                    </svg>
                    <span>&quot;Estudiar química, entregar ensayo mañana y comprar materiales&quot;</span>
                  </div>
                  <div className="pildora-muestra" style={{ borderColor: 'rgba(192,132,252,0.45)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>IA clasificó: 1 tarea crítica + 2 tareas de apoyo listas para hoy</span>
                  </div>
                </div>
              </>
            )}

            {pasoRecorrido === 1 && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <span className="etiqueta-seccion">Paso 2 de 3</span>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '8px' }}>
                    Enfócate en tu pantalla Ahora
                  </h2>
                  <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Selecciona tu nivel real de energía (Alta, Cansado o 15 min) y trabaja con bloques de concentración sin distracciones ni listas interminables.
                  </p>
                </div>
                <div className="caja-visual-recorrido">
                  <div className="pildora-muestra">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Energía: Alta • Bloque activo de 25:00 min</span>
                  </div>
                  <div className="pildora-muestra" style={{ borderColor: 'rgba(168,85,247,0.45)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>Metodología 1-3-5: 1 tarea crítica + 3 medias + 5 ligeras</span>
                  </div>
                </div>
              </>
            )}

            {pasoRecorrido === 2 && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <span className="etiqueta-seccion">Paso 3 de 3</span>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '8px' }}>
                    Control total en Panorama
                  </h2>
                  <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Visualiza toda tu jornada y reacomoda cualquier imprevisto con un toque. Si algo se retrasa, Krono Do recalcula el resto del día automáticamente.
                  </p>
                </div>
                <div className="caja-visual-recorrido">
                  <div className="pildora-muestra">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Imprevisto detectado (+30 min) → Horario ajustado sin estrés</span>
                  </div>
                  <div className="pildora-muestra" style={{ borderColor: 'rgba(192,132,252,0.45)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Equilibrio de carga diaria optimizado al 84%</span>
                  </div>
                </div>
              </>
            )}

            <div className="puntos-recorrido">
              {[0, 1, 2].map((indice) => (
                <span key={indice} className={`punto-recorrido ${pasoRecorrido === indice ? 'activo' : ''}`} />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <button type="button" className="boton-secundario" onClick={terminarRecorrido}>
                Saltar guía
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                {pasoRecorrido > 0 && (
                  <button type="button" className="boton-secundario" onClick={() => setPasoRecorrido((prev) => prev - 1)}>
                    Anterior
                  </button>
                )}
                <button
                  type="button"
                  className="boton-primario"
                  onClick={() => (pasoRecorrido < 2 ? setPasoRecorrido((prev) => prev + 1) : terminarRecorrido())}
                >
                  {pasoRecorrido === 2 ? 'Ir a Iniciar Sesión' : 'Siguiente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarInicioSesion && (
        <div className="capa-acceso">
          <div className="tarjeta-acceso" style={{ maxWidth: '440px' }}>
            <div className="contenedor-logo-acceso">
              <img src="/logo.png" alt="Krono Do" className="img-logo-marca" />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>Bienvenido a Krono Do</h2>
              <p style={{ color: '#ffffff', fontSize: '0.86rem' }}>
                {modoAcceso === 'login'
                  ? 'Inicia sesión con tu cuenta o explora como invitado.'
                  : 'Crea tu cuenta en segundos para guardar tu acceso.'}
              </p>
            </div>

            <div className="selector-facturacion" style={{ width: '100%', margin: '0 0 18px' }}>
              <button
                type="button"
                className={`boton-facturacion ${modoAcceso === 'login' ? 'activo' : ''}`}
                style={{ flex: 1 }}
                onClick={() => cambiarModoAcceso('login')}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                className={`boton-facturacion ${modoAcceso === 'registro' ? 'activo' : ''}`}
                style={{ flex: 1 }}
                onClick={() => cambiarModoAcceso('registro')}
              >
                Registrarse
              </button>
            </div>

            {modoAcceso === 'login' ? (
              <form onSubmit={enviarInicioSesion}>
                <div className="grupo-campo">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    className="campo-entrada"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="usuario@correo.com"
                    required
                  />
                </div>
                <div className="grupo-campo">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    className="campo-entrada"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {mensajeErrorAcceso && (
                  <p style={{ color: '#ffffff', fontSize: '0.8rem', marginBottom: '12px', lineHeight: 1.45 }}>
                    {mensajeErrorAcceso}
                  </p>
                )}
                <button type="submit" className="boton-primario" style={{ width: '100%', marginBottom: '10px' }}>
                  Iniciar Sesión
                </button>
              </form>
            ) : (
              <form onSubmit={enviarRegistro}>
                <div className="grupo-campo">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    className="campo-entrada"
                    value={nombreRegistro}
                    onChange={(e) => setNombreRegistro(e.target.value)}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="grupo-campo">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    className="campo-entrada"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="usuario@correo.com"
                    required
                  />
                </div>
                <div className="grupo-campo">
                  <label>Crea una contraseña</label>
                  <input
                    type="password"
                    className="campo-entrada"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    required
                  />
                </div>
                {mensajeErrorAcceso && (
                  <p style={{ color: '#ffffff', fontSize: '0.8rem', marginBottom: '12px', lineHeight: 1.45 }}>
                    {mensajeErrorAcceso}
                  </p>
                )}
                <button type="submit" className="boton-primario" style={{ width: '100%', marginBottom: '10px' }}>
                  Crear Cuenta
                </button>
              </form>
            )}

            <button type="button" className="boton-secundario" style={{ width: '100%' }} onClick={entrarComoInvitado}>
              Continuar como Invitado
            </button>
          </div>
        </div>
      )}

      <div className="contenedor-barra-superior">
        <nav className="barra-navegacion">
          <button
          type="button"
          className="boton-hamburguesa-nav"
          aria-label={menuHamburguesaAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={menuHamburguesaAbierto}
          onClick={() => setMenuHamburguesaAbierto((prev) => !prev)}
        >
          {menuHamburguesaAbierto ? '✕' : '☰'}
        </button>
        <a
            href="#inicio"
            className="caja-logo-nav"
            aria-label="Krono Do Inicio"
            onClick={(e) => {
              e.preventDefault();
              irASeccion('inicio');
            }}
          >
            <img src="/logo.png" alt="Krono Do" className="img-logo-marca" />
          </a>

          <div className="enlaces-nav">
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                irASeccion('inicio');
              }}
            >
              Inicio
            </a>
            <a
              href="#metodologia"
              onClick={(e) => {
                e.preventDefault();
                irASeccion('metodologia');
              }}
            >
              Cómo Funciona
            </a>
            <a
              href="#catalogo"
              onClick={(e) => {
                e.preventDefault();
                irASeccion('catalogo');
              }}
            >
              Catálogo
            </a>
            <a
              href="#krono-ia"
              onClick={(e) => {
                e.preventDefault();
                irASeccion('krono-ia');
              }}
            >
              Krono IA
            </a>
            <a
              href="#contacto"
              onClick={(e) => {
                e.preventDefault();
                irASeccion('contacto');
              }}
            >
              Contacto
            </a>
            {rol === 'Admin' && (
              <a
                href="#admin-panel"
                onClick={(e) => {
                  e.preventDefault();
                  irASeccion('admin-panel');
                }}
              >
                Admin
              </a>
            )}
          </div>

          <div className="acciones-usuario-nav">
            <span className="insignia-usuario">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{etiquetaUsuarioNav}</span>
            </span>
            <button
              type="button"
              className="boton-cambiar-cuenta"
              onClick={() => {
                setMensajeErrorAcceso('');
                setModoAcceso('login');
                setMostrarInicioSesion(true);
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Cambiar cuenta</span>
            </button>
          </div>
        </nav>

      {menuHamburguesaAbierto && (
        <div className="ventana-menu-hamburguesa" role="menu">
          <button type="button" role="menuitem" className="item-menu-hamburguesa" onClick={() => navegarDesdeMenu('inicio')}>
            Inicio
          </button>
          <button type="button" role="menuitem" className="item-menu-hamburguesa" onClick={() => navegarDesdeMenu('como-funciona')}>
            Cómo funciona
          </button>
          <button type="button" role="menuitem" className="item-menu-hamburguesa" onClick={() => navegarDesdeMenu('catalogo')}>
            Catálogo
          </button>
          <button type="button" role="menuitem" className="item-menu-hamburguesa" onClick={() => navegarDesdeMenu('krono-ia')}>
            Krono IA
          </button>
          <button type="button" role="menuitem" className="item-menu-hamburguesa" onClick={() => navegarDesdeMenu('contacto')}>
            Contacto
          </button>
          {(rol === 'Admin' || vistaActiva === 'adminCompleto') && (
            <button type="button" role="menuitem" className="item-menu-hamburguesa destacado" onClick={() => navegarDesdeMenu('admin-panel')}>
              Admin
            </button>
          )}
        </div>
      )}
      </div>

      <main className="contenedor-principal">
        {vistaActiva === 'equipo' && (
          <section id="equipo-krono">
            <div className="encabezado-subpagina">
              <div>
                <span className="etiqueta-seccion">Fundadora & Liderazgo</span>
                <h1 className="titulo-seccion">Conoce a nuestro equipo</h1>
              </div>
              <button type="button" className="boton-secundario" onClick={() => irASeccion('contacto')}>
                ← Volver a Contacto
              </button>
            </div>

            <div className="tarjeta-cristal tarjeta-fundadora">
              <div className="caja-foto-fundadora">
                {!fotoFundadoraFaltante ? (
                  <img
                    src="/founder.jpg"
                    alt="Milagros González — Founder de Krono Do"
                    className="img-foto-fundadora"
                    onError={() => setFotoFundadoraFaltante(true)}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#ffffff', fontSize: '0.84rem' }}>
                    <p style={{ fontWeight: 600, marginBottom: '6px' }}>Milagros González</p>
                    <p style={{ color: '#ffffff', fontSize: '0.76rem' }}>
                      Guarda tu foto en <strong>public/founder.jpg</strong> para mostrarla aquí.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <span className="etiqueta-seccion" style={{ marginBottom: '10px' }}>
                  Founder de Krono Do
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>Milagros González</h2>
                <p style={{ color: '#ffffff', fontSize: '0.92rem', fontWeight: 500, marginBottom: '16px' }}>
                  Fundadora de Krono Do • STEM, Innovación y Liderazgo con Propósito
                </p>

                <p style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '22px' }}>
                  Soy Milagros González, una joven panameña apasionada por el mundo STEM, la innovación y el liderazgo con propósito. A lo largo de mi camino en programas como She Is Astronauta, Technovation Girls, Jóvenes CreaTIvos e Innova-Nation, he desarrollado herramientas técnicas y de trabajo en equipo, pero ha sido mi propia experiencia de vida la que me enseñó que el conocimiento solo cobra verdadero sentido cuando se une con la empatía. Hoy, mi mayor motivación es utilizar la tecnología y la acción comunitaria para crear entornos más seguros y devolverle oportunidades a quienes han visto sus sueños pausados por circunstancias difíciles, convencida de que cada vida tiene un valor inmenso y siempre hay tiempo para volver a empezar.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                  <a
                    href="https://www.instagram.com/_mimirl_/"
                    target="_blank"
                    rel="noreferrer"
                    className="boton-primario"
                    style={{ textDecoration: 'none' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <span>Instagram: _mimirl_</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {vistaActiva === 'adminCompleto' && rol === 'Admin' && (
          <section id="admin-completo">
            <div className="encabezado-subpagina">
              <div>
                <span className="etiqueta-seccion">Centro de Control Administrativo</span>
                <h1 className="titulo-seccion">Panel de Administración Completo</h1>
                <p className="subtitulo-seccion">
                  Gestión integral de reporte de fallas, mensajes recibidos y estado de datos de Krono Do.
                </p>
              </div>
              <button type="button" className="boton-secundario" onClick={() => irASeccion('admin-panel')}>
                ← Volver a la página principal
              </button>
            </div>

            <div className="barra-pestanas-admin">
              <button
                type="button"
                className={`boton-pestana-admin ${pestanaAdminCompleta === 'fallas' ? 'activo' : ''}`}
                onClick={() => setPestanaAdminCompleta('fallas')}
              >
                Reporte de Fallas ({fallas.length})
              </button>
              <button
                type="button"
                className={`boton-pestana-admin ${pestanaAdminCompleta === 'mensajes' ? 'activo' : ''}`}
                onClick={() => setPestanaAdminCompleta('mensajes')}
              >
                Mensajes Recibidos ({mensajesGuardados.length})
              </button>
              <button
                type="button"
                className={`boton-pestana-admin ${pestanaAdminCompleta === 'resumen' ? 'activo' : ''}`}
                onClick={() => setPestanaAdminCompleta('resumen')}
              >
                Resumen del Sistema
              </button>
            </div>

            {pestanaAdminCompleta === 'fallas' && (
              <div className="cuadricula-contacto">
                <div className="tarjeta-cristal">
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Registrar Nueva Falla</h3>
                  <form onSubmit={agregarFalla}>
                    <div className="grupo-campo">
                      <label>Título de la falla</label>
                      <input
                        type="text"
                        className="campo-entrada"
                        value={formularioFalla.titulo}
                        onChange={(e) => setFormularioFalla((prev) => ({ ...prev, titulo: e.target.value }))}
                        placeholder="Ej: Ajustar diseño en pantallas pequeñas"
                        required
                      />
                    </div>
                    <div className="grupo-campo">
                      <label>Sección afectada</label>
                      <select
                        className="campo-entrada"
                        value={formularioFalla.seccion}
                        onChange={(e) => setFormularioFalla((prev) => ({ ...prev, seccion: e.target.value }))}
                      >
                        <option value="General">General</option>
                        <option value="Simulador Móvil">Simulador Móvil</option>
                        <option value="Catálogo">Catálogo</option>
                        <option value="Krono IA">Krono IA</option>
                        <option value="Contacto">Contacto</option>
                        <option value="Audio">Audio</option>
                      </select>
                    </div>
                    <div className="grupo-campo">
                      <label>Prioridad</label>
                      <select
                        className="campo-entrada"
                        value={formularioFalla.prioridad}
                        onChange={(e) => setFormularioFalla((prev) => ({ ...prev, prioridad: e.target.value }))}
                      >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                      </select>
                    </div>
                    <div className="grupo-campo">
                      <label>Descripción del problema</label>
                      <textarea
                        rows="4"
                        className="campo-entrada"
                        value={formularioFalla.descripcion}
                        onChange={(e) => setFormularioFalla((prev) => ({ ...prev, descripcion: e.target.value }))}
                        placeholder="Describe cómo reproducir o qué revisar..."
                        required
                      />
                    </div>
                    <button type="submit" className="boton-primario" style={{ width: '100%' }}>
                      Guardar Reporte de Falla
                    </button>
                  </form>
                </div>

                <div className="tarjeta-cristal">
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Fallas Registradas ({fallas.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
                    {fallas.length === 0 ? (
                      <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>No hay fallas registradas en este momento.</p>
                    ) : (
                      fallas.map((f) => (
                        <div
                          key={f.id}
                          style={{
                            background: 'rgba(3,4,10,0.65)',
                            border: '1px solid rgba(157,78,221,0.3)',
                            borderRadius: '12px',
                            padding: '12px',
                            fontSize: '0.82rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <strong style={{ color: '#ffffff' }}>{f.titulo}</strong>
                            <span className={`insignia-estado ${f.estado === 'Resuelta' ? 'estado-resuelta' : 'estado-abierta'}`}>
                              {f.estado}
                            </span>
                          </div>
                          <p style={{ color: '#ffffff', fontSize: '0.75rem', marginBottom: '6px' }}>
                            Sección: {f.seccion} • Prioridad: {f.prioridad} • {f.fecha}
                          </p>
                          <p style={{ color: '#ffffff', lineHeight: 1.45, marginBottom: '10px' }}>{f.descripcion}</p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className="boton-secundario"
                              style={{ padding: '5px 10px', fontSize: '0.74rem' }}
                              onClick={() => cambiarEstadoFalla(f.id)}
                            >
                              {f.estado === 'Abierta' ? 'Marcar Resuelta' : 'Reabrir'}
                            </button>
                            <button
                              type="button"
                              className="boton-secundario"
                              style={{ padding: '5px 10px', fontSize: '0.74rem' }}
                              onClick={() => eliminarFalla(f.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {pestanaAdminCompleta === 'mensajes' && (
              <div className="tarjeta-cristal">
                <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>
                  Bandeja Completa de Mensajes ({mensajesGuardados.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {mensajesGuardados.length === 0 ? (
                    <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>
                      Aún no hay mensajes enviados desde el formulario de contacto.
                    </p>
                  ) : (
                    mensajesGuardados.map((m, indice) => (
                      <div
                        key={indice}
                        style={{
                          background: 'rgba(3,4,10,0.65)',
                          border: '1px solid rgba(157,78,221,0.3)',
                          borderRadius: '12px',
                          padding: '14px',
                          fontSize: '0.84rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
                          <span>
                            {m.nombre} ({m.tema})
                          </span>
                          <span>{m.fecha}</span>
                        </div>
                        <div style={{ color: '#ffffff', fontSize: '0.78rem', marginBottom: '6px' }}>{m.correo}</div>
                        <p style={{ color: '#ffffff', lineHeight: 1.5 }}>{m.mensaje}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {pestanaAdminCompleta === 'resumen' && (
              <div className="fila-metricas">
                <div className="tarjeta-metrica">
                  <div className="valor-metrica">{planes.length}</div>
                  <div className="etiqueta-metrica">Planes activos en el catálogo</div>
                </div>
                <div className="tarjeta-metrica">
                  <div className="valor-metrica">{tareas.length}</div>
                  <div className="etiqueta-metrica">Tareas registradas en el simulador</div>
                </div>
                <div className="tarjeta-metrica">
                  <div className="valor-metrica">{fallas.filter((f) => f.estado === 'Abierta').length}</div>
                  <div className="etiqueta-metrica">Fallas abiertas por revisar</div>
                </div>
              </div>
            )}
          </section>
        )}

        {vistaActiva === 'inicio' && (
          <>
            <section id="inicio">
              <div className="cuadricula-portada">
                <div>
                  <span className="etiqueta-seccion">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Productividad Neuronal Adaptativa con IA
                  </span>
                  <h1 className="titulo-portada">
                    Suelta tus ideas,
                    <br />
                    <span className="texto-degradado">Krono Do organiza tu universo.</span>
                  </h1>
                  <p className="descripcion-portada">
                    La plataforma inteligente diseñada para eliminar la parálisis por análisis y la carga mental. Vuelca tus pendientes en lenguaje natural y deja que nuestra inteligencia artificial estructure tu día según tu energía real, reacomodando imprevistos automáticamente.
                  </p>

                  <div className="fila-botones-portada">
                    <a href="#catalogo" className="boton-primario" style={{ textDecoration: 'none' }}>
                      Explorar Planes y Herramientas
                    </a>
                    <a href="#krono-ia" className="boton-secundario" style={{ textDecoration: 'none' }}>
                      Probar Krono IA
                    </a>
                    <button type="button" className="boton-secundario" onClick={reiniciarDatosDemo}>
                      Reiniciar datos guardados
                    </button>
                  </div>

                  <div className="fila-metricas">
                    <div className="tarjeta-metrica">
                      <div className="valor-metrica">-68%</div>
                      <div className="etiqueta-metrica">Carga mental diaria al planificar</div>
                    </div>
                    <div className="tarjeta-metrica">
                      <div className="valor-metrica">1-3-5</div>
                      <div className="etiqueta-metrica">Priorización científica inteligente</div>
                    </div>
                    <div className="tarjeta-metrica">
                      <div className="valor-metrica">100%</div>
                      <div className="etiqueta-metrica">Reajuste automático ante imprevistos</div>
                    </div>
                  </div>
                </div>

                <div className="contenedor-celular">
                  <div className="marco-celular">
                    <div>
                      <div className="muesca-celular" />
                      <div className="encabezado-celular">
                        <img src="/logo.png" alt="Krono Do" className="img-logo-marca" />
                        <span className="insignia-pantalla">{etiquetasPantalla[pantallaCelular]}</span>
                      </div>
                    </div>

                    <div className="cuerpo-celular">
                      {pantallaCelular === 'brainstorm' && (
                        <div className="vista-celular">
                          <p style={{ fontSize: '0.78rem', color: '#ffffff' }}>
                            Escribe ideas separadas por comas o &quot;y&quot; para dividirlas y clasificarlas:
                          </p>
                          <textarea
                            rows="3"
                            className="campo-entrada"
                            style={{ fontSize: '0.78rem' }}
                            value={textoBrainDump}
                            onChange={(e) => setTextoBrainDump(e.target.value)}
                            placeholder="Ej: Entregar ensayo de química, repasar fórmulas y enviar correo..."
                          />
                          <button
                            type="button"
                            className="boton-primario"
                            style={{ padding: '8px 12px', fontSize: '0.76rem' }}
                            onClick={enviarBrainDump}
                          >
                            Organizar con IA
                          </button>
                          {avisoBrainDump && (
                            <p className="texto-resaltado-plan" style={{ fontSize: '0.72rem' }}>
                              {avisoBrainDump}
                            </p>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '4px' }}>
                            {tareas.map((item) => (
                              <div key={item.id} className="elemento-tarea" onClick={() => alternarTareaCompletada(item.id)}>
                                <span>{item.etiqueta}</span>
                                <span className="etiqueta-tarea">
                                  {item.categoria} • {item.minutos}m
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {pantallaCelular === 'ahora' && (
                        <div className="vista-celular">
                          <div style={{ fontSize: '0.74rem', color: '#ffffff' }}>Nivel de energía actual:</div>
                          <div className="botones-energia">
                            <button
                              type="button"
                              className={`boton-energia ${energia === 'alta' ? 'activo' : ''}`}
                              onClick={() => cambiarEnergia('alta')}
                            >
                              Alta
                            </button>
                            <button
                              type="button"
                              className={`boton-energia ${energia === 'cansado' ? 'activo' : ''}`}
                              onClick={() => cambiarEnergia('cansado')}
                            >
                              Cansado
                            </button>
                            <button
                              type="button"
                              className={`boton-energia ${energia === 'poco' ? 'activo' : ''}`}
                              onClick={() => cambiarEnergia('poco')}
                            >
                              15 min
                            </button>
                          </div>

                          <div className="caja-temporizador-enfoque">
                            <div style={{ fontSize: '0.72rem', color: '#ffffff' }}>
                              {energia === 'alta' && 'Modo Enfoque Profundo • Tarea Crítica'}
                              {energia === 'cansado' && 'Modo Baja Carga • Tareas Ligeras'}
                              {energia === 'poco' && 'Modo Micro-Bloque • Acción Rápida'}
                            </div>
                            <div className="digitos-temporizador">{formatearTemporizador(segundosRestantes)}</div>
                            <button
                              type="button"
                              className="boton-primario"
                              style={{ padding: '6px 14px', fontSize: '0.74rem' }}
                              onClick={() => setTemporizadorActivo((prev) => !prev)}
                            >
                              {temporizadorActivo ? 'Pausar bloque' : 'Iniciar bloque'}
                            </button>
                          </div>

                          <div style={{ fontSize: '0.74rem', color: '#ffffff', marginTop: '2px' }}>
                            Pendientes filtrados ({tareasFiltradas.length}):
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                            {tareasFiltradas.length === 0 ? (
                              <p style={{ fontSize: '0.74rem', color: '#ffffff' }}>
                                No hay tareas compatibles con este filtro de energía.
                              </p>
                            ) : (
                              tareasFiltradas.map((t) => (
                                <div
                                  key={t.id}
                                  className={`elemento-tarea ${t.completada ? 'completada' : ''}`}
                                  onClick={() => alternarTareaCompletada(t.id)}
                                >
                                  <span>{t.etiqueta}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span className="etiqueta-tarea">{t.categoria}</span>
                                    <button
                                      type="button"
                                      aria-label="Eliminar tarea"
                                      onClick={(e) => eliminarTarea(e, t.id)}
                                      style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        lineHeight: 1
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {pantallaCelular === 'panorama' && (
                        <div className="vista-celular">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.76rem', color: '#ffffff', fontWeight: 600 }}>Línea de tiempo hoy</span>
                            <button
                              type="button"
                              className="boton-secundario"
                              style={{ padding: '4px 9px', fontSize: '0.68rem' }}
                              onClick={() => setMinutosRetraso((prev) => prev + 30)}
                            >
                              +30 min imprevisto
                            </button>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {bloquesCronograma.map((b) => (
                              <div key={b.id} className="elemento-tarea">
                                <span>
                                  {b.horaBloque} — {b.etiqueta}
                                </span>
                                <span className="etiqueta-tarea">{b.estadoBloque}</span>
                              </div>
                            ))}
                          </div>
                          <p style={{ fontSize: '0.72rem', color: '#ffffff', lineHeight: 1.45 }}>
                            {minutosRetraso > 0
                              ? `Retraso acumulado de +${minutosRetraso} min absorbido. Horario recalculado automáticamente.`
                              : 'Sin retrasos detectados. Tu carga diaria está equilibrada al 84%.'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="nav-inferior-celular">
                      <button
                        type="button"
                        className={`boton-pestana-celular ${pantallaCelular === 'brainstorm' ? 'activo' : ''}`}
                        onClick={() => setPantallaCelular('brainstorm')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                        </svg>
                        <span>Brainstorm</span>
                      </button>
                      <button
                        type="button"
                        className={`boton-pestana-celular ${pantallaCelular === 'ahora' ? 'activo' : ''}`}
                        onClick={() => setPantallaCelular('ahora')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Ahora</span>
                      </button>
                      <button
                        type="button"
                        className={`boton-pestana-celular ${pantallaCelular === 'panorama' ? 'activo' : ''}`}
                        onClick={() => setPantallaCelular('panorama')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>Panorama</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="metodologia">
              <span className="etiqueta-seccion">Metodología Inteligente</span>
              <h2 className="titulo-seccion">Tres pilares para recuperar tu claridad mental</h2>
              <p className="subtitulo-seccion">
                Krono Do combina psicología cognitiva con procesamiento de lenguaje natural para transformar listas interminables en acciones concretas y alcanzables.
              </p>

              <div className="cuadricula-pasos">
                <div className="tarjeta-cristal">
                  <div className="caja-icono">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>1. Vaciado Mental Instantáneo</h3>
                  <p style={{ color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.65 }}>
                    Captura ideas, exámenes, entregas o recados sin preocuparte por el orden. Nuestro motor semántico separa subtareas y estima la duración real de cada bloque.
                  </p>
                </div>

                <div className="tarjeta-cristal">
                  <div className="caja-icono">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>2. Filtro por Energía Real</h3>
                  <p style={{ color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.65 }}>
                    No todos los días tienes la misma concentración. Elige si estás en energía Alta, Cansado o con solo 15 minutos libres para recibir únicamente lo que puedes completar hoy.
                  </p>
                </div>

                <div className="tarjeta-cristal">
                  <div className="caja-icono">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>3. Reprogramación Elástica</h3>
                  <p style={{ color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.65 }}>
                    Si surge un imprevisto o una reunión se alarga, Krono Do recalcula tu Panorama en segundos sin generar listas atrasadas llenas de alertas rojas.
                  </p>
                </div>
              </div>
            </section>

            <section id="catalogo">
              <span className="etiqueta-seccion">Catálogo de Planes y Herramientas</span>
              <h2 className="titulo-seccion">Elige el nivel de potencia para tu ritmo diario</h2>
              <p className="subtitulo-seccion">
                Haz clic en cualquiera de los botones de herramientas dentro de cada plan para descubrir qué es exactamente y qué incluye o limita.
              </p>

              <div className="selector-facturacion">
                <button
                  type="button"
                  className={`boton-facturacion ${facturacion === 'mensual' ? 'activo' : ''}`}
                  onClick={() => setFacturacion('mensual')}
                >
                  Facturación Mensual
                </button>
                <button
                  type="button"
                  className={`boton-facturacion ${facturacion === 'anual' ? 'activo' : ''}`}
                  onClick={() => setFacturacion('anual')}
                >
                  Facturación Anual (-20%)
                </button>
              </div>

              <div className="cuadricula-catalogo">
                {planes.map((plan, pIndice) => {
                  const indiceHerramientaActiva = herramientasSeleccionadas[pIndice] ?? 0;
                  const herramientaActiva = plan.herramientas[indiceHerramientaActiva] || plan.herramientas[0];
                  const precio =
                    plan.precioMensual === 0
                      ? '$0'
                      : `$${(facturacion === 'anual' ? plan.precioMensual * 0.8 : plan.precioMensual).toFixed(2)}`;

                  return (
                    <div key={plan.nombre + pIndice} className={`tarjeta-plan ${plan.destacado ? 'destacado' : ''}`}>
                      <div>
                        {plan.insignia && <span className="insignia-plan">{plan.insignia}</span>}
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{plan.nombre}</h3>
                        <div className="precio-plan">
                          {precio} <span>/ mes</span>
                        </div>
                        <p style={{ color: '#ffffff', fontSize: '0.85rem', lineHeight: 1.55 }}>{plan.descripcion}</p>

                        <div className="cuadricula-herramientas">
                          {plan.herramientas.map((h, hIndice) => (
                            <button
                              key={h.etiqueta + hIndice}
                              type="button"
                              className={`boton-herramienta ${indiceHerramientaActiva === hIndice ? 'activo' : ''}`}
                              onClick={() => setHerramientasSeleccionadas((prev) => ({ ...prev, [pIndice]: hIndice }))}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2">
                                <polyline points="9 11 12 14 22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                              </svg>
                              <span>{h.etiqueta}</span>
                            </button>
                          ))}
                        </div>

                        <div className="panel-detalle-herramienta">
                          <div style={{ color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
                            ¿Qué es {herramientaActiva.etiqueta}?
                          </div>
                          <p style={{ color: '#ffffff', marginBottom: '6px' }}>{herramientaActiva.queEs}</p>
                          <div className="texto-resaltado-plan">En este plan: {herramientaActiva.oferta}</div>
                        </div>
                      </div>

                      <a
                        href="#contacto"
                        className={plan.destacado ? 'boton-primario' : 'boton-secundario'}
                        style={{ textDecoration: 'none', width: '100%' }}
                      >
                        Elegir {plan.nombre}
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="krono-ia">
              <span className="etiqueta-seccion">Asistente Inteligente Integrado</span>
              <h2 className="titulo-seccion">Consulta con Krono IA antes de decidir</h2>
              <p className="subtitulo-seccion">
                Pregúntale sobre los planes, límites de la versión gratuita, metodología 1-3-5 o pídele que organice tus pendientes de hoy.
              </p>

              <div className="caja-chat">
                <div className="encabezado-chat">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/logo.png" alt="Krono Do" className="img-logo-marca" />
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff' }}>Asistente Virtual</span>
                  </div>
                  <span className="estado-chat-en-linea">En línea</span>
                </div>

                <div className="mensajes-chat">
                  {mensajes.map((m, indice) => (
                    <div
                      key={indice}
                      className={`burbuja-mensaje ${m.remitente === 'usuario' ? 'mensaje-usuario' : 'mensaje-bot'}`}
                    >
                      {m.texto}
                    </div>
                  ))}
                </div>

                <div className="sugerencias-chat">
                  <button
                    type="button"
                    className="chip-sugerencia"
                    onClick={() => enviarMensajeChat('¿Qué diferencia hay entre el Plan Gratuito y el Plan Pro?')}
                  >
                    Plan Gratuito vs Pro
                  </button>
                  <button
                    type="button"
                    className="chip-sugerencia"
                    onClick={() => enviarMensajeChat('¿Cómo funciona la metodología 1-3-5?')}
                  >
                    Metodología 1-3-5
                  </button>
                  <button
                    type="button"
                    className="chip-sugerencia"
                    onClick={() => enviarMensajeChat('Tengo examen de química y exposición mañana, organízame')}
                  >
                    Organizar mi estudio
                  </button>
                </div>

                <form
                  className="barra-entrada-chat"
                  onSubmit={(e) => {
                    e.preventDefault();
                    enviarMensajeChat(entradaChat);
                    setEntradaChat('');
                  }}
                >
                  <input
                    type="text"
                    className="campo-entrada"
                    value={entradaChat}
                    onChange={(e) => setEntradaChat(e.target.value)}
                    placeholder="Escribe tu consulta para Krono IA..."
                    required
                  />
                  <button type="submit" className="boton-primario">
                    Enviar
                  </button>
                </form>
              </div>
            </section>

            <section id="contacto">
              <span className="etiqueta-seccion">Soporte y Alianzas</span>
              <h2 className="titulo-seccion">Conecta con el equipo de Krono Do</h2>
              <p className="subtitulo-seccion">
                ¿Tienes dudas sobre licencias estudiantiles, instituciones o soporte técnico? Envíanos un mensaje directo.
              </p>

              <div className="cuadricula-contacto">
                <div className="tarjeta-cristal">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Formulario de Contacto</h3>
                  <form onSubmit={enviarFormularioContacto}>
                    <div className="grupo-campo">
                      <label>Nombre completo</label>
                      <input
                        type="text"
                        className="campo-entrada"
                        value={formularioContacto.nombre}
                        onChange={(e) => setFormularioContacto((prev) => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div className="grupo-campo">
                      <label>Correo electrónico</label>
                      <input
                        type="email"
                        className="campo-entrada"
                        value={formularioContacto.correo}
                        onChange={(e) => setFormularioContacto((prev) => ({ ...prev, correo: e.target.value }))}
                        placeholder="usuario@correo.com"
                        required
                      />
                    </div>
                    <div className="grupo-campo">
                      <label>Plan o tema de interés</label>
                      <input
                        type="text"
                        className="campo-entrada"
                        value={formularioContacto.tema}
                        onChange={(e) => setFormularioContacto((prev) => ({ ...prev, tema: e.target.value }))}
                        placeholder="Ej: Plan Gratuito ($0)"
                        required
                      />
                    </div>
                    <div className="grupo-campo">
                      <label>Mensaje</label>
                      <textarea
                        rows="4"
                        className="campo-entrada"
                        value={formularioContacto.mensaje}
                        onChange={(e) => setFormularioContacto((prev) => ({ ...prev, mensaje: e.target.value }))}
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="boton-primario"
                      style={{ width: '100%' }}
                      disabled={enviandoContacto}
                    >
                      {enviandoContacto ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>
                    {errorContacto && (
                      <p style={{ color: '#ffffff', fontSize: '0.82rem', marginTop: '10px' }}>
                        {errorContacto}
                      </p>
                    )}
                    {contactoEnviado && (
                      <p className="texto-resaltado-plan" style={{ color: '#ffffff', fontSize: '0.85rem', marginTop: '10px' }}>
                        Mensaje enviado
                      </p>
                    )}
                  </form>
                </div>

                <div className="tarjeta-cristal" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Información Directa</h3>
                    <p style={{ color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '20px' }}>
                      Nuestro equipo responde consultas académicas, demostraciones de producto y activaciones de cuentas Pro en menos de 24 horas.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}>
                      <div className="pildora-muestra">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span>gonzalezmarielismilagros@gmail.com</span>
                      </div>
                      <div className="pildora-muestra">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span>Ciudad de Panamá • Plataforma Web Multiplataforma</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <button type="button" className="boton-primario" style={{ width: '100%' }} onClick={abrirPaginaEquipo}>
                      Conoce a nuestro equipo
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {rol === 'Admin' && (
              <section id="admin-panel">
                <span className="etiqueta-seccion">Panel de Administración</span>
                <h2 className="titulo-seccion">Gestión de Catálogo y Mensajes</h2>
                <p className="subtitulo-seccion">
                  Sesión administrativa activa. Los cambios que publiques aquí se guardan automáticamente y se reflejan en el catálogo.
                </p>

                <div className="cuadricula-contacto">
                  <div className="tarjeta-cristal">
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Agregar Nuevo Plan al Catálogo</h3>
                    <form onSubmit={agregarPlan}>
                      <div className="grupo-campo">
                        <label>Nombre del Plan</label>
                        <input
                          type="text"
                          className="campo-entrada"
                          value={nuevoPlan.nombre}
                          onChange={(e) => setNuevoPlan((prev) => ({ ...prev, nombre: e.target.value }))}
                          placeholder="Ej: Plan Universitario"
                          required
                        />
                      </div>
                      <div className="grupo-campo">
                        <label>Precio Mensual (USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="campo-entrada"
                          value={nuevoPlan.precio}
                          onChange={(e) => setNuevoPlan((prev) => ({ ...prev, precio: e.target.value }))}
                          placeholder="Ej: 2.99"
                          required
                        />
                      </div>
                      <div className="grupo-campo">
                        <label>Descripción corta</label>
                        <input
                          type="text"
                          className="campo-entrada"
                          value={nuevoPlan.descripcion}
                          onChange={(e) => setNuevoPlan((prev) => ({ ...prev, descripcion: e.target.value }))}
                          placeholder="Ideal para estudiantes activos"
                          required
                        />
                      </div>
                      <div className="grupo-campo">
                        <label>Herramienta destacada (Botón)</label>
                        <input
                          type="text"
                          className="campo-entrada"
                          value={nuevoPlan.herramienta}
                          onChange={(e) => setNuevoPlan((prev) => ({ ...prev, herramienta: e.target.value }))}
                          placeholder="Ej: Modo Exámenes IA"
                          required
                        />
                      </div>
                      <div className="grupo-campo">
                        <label>Detalle de la herramienta</label>
                        <input
                          type="text"
                          className="campo-entrada"
                          value={nuevoPlan.infoHerramienta}
                          onChange={(e) => setNuevoPlan((prev) => ({ ...prev, infoHerramienta: e.target.value }))}
                          placeholder="Genera cronogramas de repaso antes de parciales."
                          required
                        />
                      </div>
                      <button type="submit" className="boton-primario" style={{ width: '100%' }}>
                        Publicar en Catálogo
                      </button>
                    </form>
                  </div>

                  <div className="tarjeta-cristal" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>
                        Mensajes Recibidos ({mensajesGuardados.length})
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                        {mensajesGuardados.length === 0 ? (
                          <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>
                            Aún no hay mensajes enviados desde el formulario.
                          </p>
                        ) : (
                          mensajesGuardados.map((m, indice) => (
                            <div
                              key={indice}
                              style={{
                                background: 'rgba(3,4,10,0.65)',
                                border: '1px solid rgba(157,78,221,0.3)',
                                borderRadius: '12px',
                                padding: '12px',
                                fontSize: '0.82rem'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
                                <span>
                                  {m.nombre} ({m.tema})
                                </span>
                                <span>{m.fecha}</span>
                              </div>
                              <div style={{ color: '#ffffff', fontSize: '0.76rem', marginBottom: '6px' }}>{m.correo}</div>
                              <p style={{ color: '#ffffff', lineHeight: 1.45 }}>{m.mensaje}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <button type="button" className="boton-primario" style={{ width: '100%' }} onClick={abrirAdminCompleto}>
                        Abrir Panel de Administración Completo
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer>
        <img src="/logo.png" alt="Krono Do" className="img-logo-marca" />
        <p style={{ color: '#ffffff', fontSize: '0.84rem' }}>
          Krono Do — Productividad Adaptativa Impulsada por Inteligencia Artificial
        </p>
        <p style={{ color: '#ffffff', fontSize: '0.75rem', marginTop: '6px' }}>
          © 2026 Krono Do. Todos los derechos reservados.
        </p>
      </footer>

      <div className="widget-musica-flotante">
        <button type="button" className="boton-musica" onClick={alternarMusica}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>{reproduciendoMusica ? 'Pausar' : 'Música'}</span>
        </button>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e9d5ff" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volumen}
          className="control-volumen"
          onChange={(e) => cambiarVolumen(e.target.value)}
          aria-label="Volumen de música"
        />
        <span className="etiqueta-volumen">{volumen}%</span>
      </div>

      <div className="tiendas-flotantes-derecha" aria-label="Descargar app">
        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noreferrer"
          className="boton-tienda-flotante"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M3.6 2.3L14.7 12L3.6 21.7C3.2 21.4 3 20.9 3 20.3V3.7C3 3.1 3.2 2.6 3.6 2.3Z" fill="#32BBFF" />
            <path d="M18.4 8.7L14.7 12L18.4 15.3L21.3 13.7C22.2 13.2 22.2 11.8 21.3 11.3L18.4 8.7Z" fill="#FFBC00" />
            <path d="M3.6 2.3L18.4 8.7L14.7 12L3.6 2.3Z" fill="#00F076" />
            <path d="M3.6 21.7L14.7 12L18.4 15.3L3.6 21.7Z" fill="#FF3A44" />
          </svg>
          <span>Google Play</span>
        </a>

        <a
          href="https://www.apple.com/app-store/"
          target="_blank"
          rel="noreferrer"
          className="boton-tienda-flotante"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
          </svg>
          <span>App Store</span>
        </a>
      </div>

      <style>{`
        body, p, span, a, label, h2, h3, h4, h5, h6, li, td, th, div, button, input, select, textarea {
          color: #ffffff !important;
        }
        .titulo-portada .texto-degradado {
          color: transparent !important;
        }
        svg, svg * {
          color: inherit;
        }
        .asa-redimensionar,
        .asa-redimensionar::before,
        .asa-redimensionar::after {
          display: none !important;
        }
        textarea {
          resize: none !important;
        }
        select {
          background-image: none !important;
        }
        footer {
          background: rgba(6, 4, 18, 0.58) !important;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .tarjeta-cristal,
        .tarjeta-plan,
        .caja-chat,
        .tarjeta-metrica,
        .marco-celular {
          background: rgba(10, 7, 26, 0.64) !important;
        }
        .widget-musica-flotante {
          bottom: 18px !important;
          min-height: 40px !important;
          height: 40px !important;
          padding: 0 12px !important;
          box-sizing: border-box !important;
        }
        .tiendas-flotantes-derecha {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 95;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          height: 40px;
        }
        .boton-tienda-flotante {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          height: 40px;
          box-sizing: border-box;
          padding: 0 13px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 600;
          white-space: nowrap;
          background: rgba(18, 12, 42, 0.72);
          border: 1px solid rgba(192, 132, 252, 0.35);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .boton-tienda-flotante:hover {
          transform: translateY(-2px);
          border-color: rgba(192, 132, 252, 0.75);
          background: rgba(34, 20, 74, 0.84);
        }
        @media (max-width: 720px) {
          .tiendas-flotantes-derecha {
            right: 12px;
            bottom: 66px;
          }
        }
      `}</style>
    </>
  );
}