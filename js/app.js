<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>app.js modificado - Control de Versiones</title>
<style>body{font-family:Segoe UI,Arial,sans-serif;margin:24px;background:#f5f5f5;color:#222}h1{color:#c64f00}.nota{background:#fff3e8;border-left:5px solid #ff6c0c;padding:12px;margin-bottom:16px}table{width:100%;border-collapse:collapse;background:white}td{border:1px solid #ddd;padding:0}pre{margin:0;padding:16px;white-space:pre;overflow:auto;font:13px/1.45 Consolas,monospace}</style></head>
<body><h1>app.js modificado</h1><div class="nota">El importador de Control de Versiones acepta el mismo Excel generado por Exportar EXCEL y reemplaza todos los registros existentes.</div><table><tr><td><pre>&quot;use strict&quot;;  
 
const $ = (id) =&gt; document.getElementById(id);  
const STORAGE_KEY = &quot;kirisV2_estado_maestro&quot;;  
const PUBLISHED_KEY = &quot;kirisV2_publicado&quot;;  
const MESES = [  
  &quot;Enero&quot;,  
  &quot;Febrero&quot;,  
  &quot;Marzo&quot;,  
  &quot;Abril&quot;,  
  &quot;Mayo&quot;,  
  &quot;Junio&quot;,  
  &quot;Julio&quot;,  
  &quot;Agosto&quot;,  
  &quot;Septiembre&quot;,  
  &quot;Octubre&quot;,  
  &quot;Noviembre&quot;,  
  &quot;Diciembre&quot;,  
];  
const DIAS = [&quot;Lun&quot;, &quot;Mar&quot;, &quot;Mié&quot;, &quot;Jue&quot;, &quot;Vie&quot;, &quot;Sáb&quot;, &quot;Dom&quot;];  
 
const COLUMNAS_MANUALES = [  
  { key: &quot;seleccion&quot;, label: &quot;&quot;, width: 42, especial: &quot;seleccion&quot; },  
  { key: &quot;orden&quot;, label: &quot;#&quot;, width: 62, especial: &quot;orden&quot; },  
  { key: &quot;codigo&quot;, label: &quot;Código&quot;, width: 120 },  
  { key: &quot;titulo&quot;, label: &quot;Título&quot;, width: 280 },  
  {  
    key: &quot;idioma&quot;,  
    label: &quot;Idioma&quot;,  
    width: 110,  
    tipo: &quot;select&quot;,  
    opciones: [&quot;Español&quot;, &quot;Inglés&quot;],  
  },  
  {  
    key: &quot;archivoElectronico&quot;,  
    label: &quot;Archivo electrónico&quot;,  
    width: 145,  
    tipo: &quot;select&quot;,  
    opciones: [&quot;&quot;, &quot;Sí&quot;, &quot;No&quot;],  
  },  
  { key: &quot;ocRelacionado&quot;, label: &quot;OC relacionado&quot;, width: 135 },  
  {  
    key: &quot;prioridad&quot;,  
    label: &quot;Prioridad&quot;,  
    width: 110,  
    tipo: &quot;select&quot;,  
    opciones: [&quot;&quot;, &quot;Alta&quot;, &quot;Media&quot;, &quot;Baja&quot;],  
  },  
  {  
    key: &quot;tipo&quot;,  
    label: &quot;Tipo&quot;,  
    width: 85,  
    tipo: &quot;select&quot;,  
    opciones: [&quot;&quot;, &quot;N&quot;, &quot;T&quot;, &quot;A&quot;, &quot;R&quot;],  
  },  
  { key: &quot;paginas&quot;, label: &quot;Páginas&quot;, width: 95, tipo: &quot;number&quot; },  
  { key: &quot;diasEsfuerzo&quot;, label: &quot;Días esfuerzo&quot;, width: 120, tipo: &quot;number&quot; },  
  { key: &quot;horasEsfuerzo&quot;, label: &quot;Horas esfuerzo&quot;, width: 125, tipo: &quot;number&quot; },  
  {  
    key: &quot;tiempoInvertido&quot;,  
    label: &quot;Tiempo invertido&quot;,  
    width: 125,  
    calculado: true,  
  },  
  { key: &quot;fechaInicio&quot;, label: &quot;Fecha inicio&quot;, width: 130, tipo: &quot;date&quot; },  
  {  
    key: &quot;fechaFinalizacion&quot;,  
    label: &quot;Fecha finalización&quot;,  
    width: 145,  
    tipo: &quot;date&quot;,  
  },  
  { key: &quot;fechaPublicado&quot;, label: &quot;Fecha publicado&quot;, width: 140, tipo: &quot;date&quot; },  
  { key: &quot;estado&quot;, label: &quot;Estado&quot;, width: 145, calculado: true },  
  { key: &quot;acciones&quot;, label: &quot;Acciones&quot;, width: 110, especial: &quot;acciones&quot; },  
];  
 
const COLUMNAS_TRAMITES = [  
  { key: &quot;seleccion&quot;, label: &quot;&quot;, width: 42, especial: &quot;seleccion&quot; },  
  { key: &quot;requerimiento&quot;, label: &quot;Requerimiento&quot;, width: 135 },  
  { key: &quot;detalle&quot;, label: &quot;Detalle&quot;, width: 230 },  
  {
    key: &quot;tipoGestion&quot;,
    label: &quot;Tipo T / R&quot;,
    width: 120,
    tipo: &quot;select&quot;,
    opciones: [&quot;&quot;, &quot;T&quot;, &quot;R&quot;],
  },
  { key: &quot;fechaIngreso&quot;, label: &quot;Fecha ingreso&quot;, width: 130, tipo: &quot;date&quot; },  
  {
    key: &quot;tiempoEstimado&quot;,
    label: &quot;Tiempo estimado de entrega&quot;,
    width: 190,
    calculado: true,
  },
  {
    key: &quot;fechaLimite&quot;,
    label: &quot;Fecha límite&quot;,
    width: 135,
    tipo: &quot;date&quot;,
    calculado: true,
  },
  {
    key: &quot;cumplimiento&quot;,
    label: &quot;Cumplimiento&quot;,
    width: 165,
    calculado: true,
  },
  { key: &quot;fechaInicio&quot;, label: &quot;Fecha inicio&quot;, width: 125, tipo: &quot;date&quot; },  
  { key: &quot;manualActualizar&quot;, label: &quot;Manual a actualizar&quot;, width: 220 },  
  { key: &quot;temaGeneral&quot;, label: &quot;Tema general&quot;, width: 170 },  
  { key: &quot;baAsignado&quot;, label: &quot;BA asignado&quot;, width: 150 },  
  {  
    key: &quot;consultas&quot;,  
    label: &quot;Consultas / comentarios&quot;,  
    width: 260,  
    tipo: &quot;textarea&quot;,  
  },  
  {  
    key: &quot;respuestaConsulta&quot;,  
    label: &quot;Respuesta a consulta&quot;,  
    width: 250,  
    tipo: &quot;textarea&quot;,  
  },  
  {  
    key: &quot;justificacionGestor&quot;,  
    label: &quot;Justificación en Gestor&quot;,  
    width: 180,  
    tipo: &quot;select&quot;,  
    opciones: [&quot;&quot;, &quot;SÍ&quot;, &quot;NO&quot;, &quot;NO APLICA&quot;],  
  },  
  { key: &quot;fechaPublicado&quot;, label: &quot;Fecha publicado&quot;, width: 130, tipo: &quot;date&quot; },  
  {  
    key: &quot;versionTraducir&quot;,  
    label: &quot;Versión para traducir agregada&quot;,  
    width: 210,  
    tipo: &quot;select&quot;,  
    opciones: [&quot;&quot;, &quot;SÍ&quot;, &quot;NO&quot;, &quot;NO APLICA&quot;],  
  },  
  {  
    key: &quot;justificacionIngles&quot;,  
    label: &quot;Justificación Gestor Inglés&quot;,  
    width: 200,  
    tipo: &quot;select&quot;,  
    opciones: [&quot;&quot;, &quot;SÍ&quot;, &quot;NO&quot;, &quot;AÚN NO SE HA TRADUCIDO&quot;, &quot;NO APLICA&quot;],  
  },  
  {  
    key: &quot;listo&quot;,  
    label: &quot;Listo&quot;,  
    width: 230,  
    tipo: &quot;select&quot;,  
    opciones: [  
      &quot;&quot;,  
      &quot;PENDIENTE&quot;,  
      &quot;PENDIENTE / NO SE VE EL CAMBIO&quot;,  
      &quot;PENDIENTE / FALTA INFORMACIÓN&quot;,  
      &quot;PENDIENTE DE PUBLICAR / LISTA LA ACTUALIZACIÓN&quot;,  
      &quot;SOLO ESPAÑOL / NO APLICA INGLÉS&quot;,  
      &quot;SOLO ESPAÑOL / FALTA INGLÉS&quot;,  
      &quot;SOLO INGLÉS&quot;,  
      &quot;AMBOS IDIOMAS&quot;,  
    ],  
  },  
  { key: &quot;acciones&quot;, label: &quot;Acciones&quot;, width: 110, especial: &quot;acciones&quot; },  
];  
 
const COLUMNAS_VERSIONES = [  
  { key: &quot;seleccion&quot;, label: &quot;&quot;, width: 42, especial: &quot;seleccion&quot; },  
  {  
    key: &quot;sistema&quot;,  
    label: &quot;Sistema&quot;,  
    width: 115,  
    tipo: &quot;select&quot;,  
    opciones: [&quot;SISCARD&quot;, &quot;siscard+&quot;],  
  },  
  { key: &quot;codigo&quot;, label: &quot;Código&quot;, width: 125 },  
  { key: &quot;manual&quot;, label: &quot;Manual&quot;, width: 280 },  
  {  
    key: &quot;idioma&quot;,  
    label: &quot;Idioma&quot;,  
    width: 110,  
    tipo: &quot;select&quot;,  
    opciones: [&quot;Español&quot;, &quot;Inglés&quot;],  
  },  
  { key: &quot;numero&quot;, label: &quot;Versión disponible&quot;, width: 145 },  
  { key: &quot;ubicacionEService&quot;, label: &quot;Ubicación en E-service&quot;, width: 190 },  
  { key: &quot;fecha&quot;, label: &quot;Fecha de versión&quot;, width: 135, tipo: &quot;date&quot; },  
  {  
    key: &quot;estado&quot;,  
    label: &quot;Estado&quot;,  
    width: 130,  
    tipo: &quot;select&quot;,  
    opciones: [&quot;Disponible&quot;, &quot;Pendiente&quot;, &quot;En revisión&quot;, &quot;Obsoleta&quot;],  
  },  
  {  
    key: &quot;observaciones&quot;,  
    label: &quot;Observaciones&quot;,  
    width: 280,  
    tipo: &quot;textarea&quot;,  
  },  
  { key: &quot;acciones&quot;, label: &quot;Acciones&quot;, width: 110, especial: &quot;acciones&quot; },  
];  
 
function id(prefijo) {  
  return `${prefijo}_${Date.now()}_${Math.random().toString(16).slice(2)}`;  
}  
 
function estadoInicial() {  
  return {  
    modo: &quot;editor&quot;,  
    ultimaCopia: &quot;&quot;,  
    manuales: [  
      {  
        id: id(&quot;manual&quot;),  
        codigo: &quot;MAN001&quot;,  
        titulo: &quot;Manual de prueba&quot;,  
        idioma: &quot;Español&quot;,  
        archivoElectronico: &quot;Sí&quot;,  
        ocRelacionado: &quot;&quot;,  
        prioridad: &quot;Alta&quot;,  
        tipo: &quot;N&quot;,  
        paginas: 20,  
        diasEsfuerzo: 3,  
        horasEsfuerzo: 8,  
        fechaInicio: fechaISOHoy(),  
        fechaFinalizacion: &quot;&quot;,  
        fechaPublicado: &quot;&quot;,  
        color: &quot;#FF6C0C&quot;,  
      },  
    ],  
    tramites: [  
      {  
        id: id(&quot;tramite&quot;),  
        requerimiento: &quot;REQ001&quot;,  
        detalle: &quot;Trámite de prueba&quot;,  
        tipoGestion: &quot;T&quot;,
        fechaIngreso: fechaISOHoy(),  
        fechaInicio: &quot;&quot;,  
        manualActualizar: &quot;Manual de prueba&quot;,  
        temaGeneral: &quot;Parámetros&quot;,  
        baAsignado: &quot;&quot;,  
        consultas: &quot;&quot;,  
        respuestaConsulta: &quot;&quot;,  
        justificacionGestor: &quot;&quot;,  
        fechaPublicado: &quot;&quot;,  
        versionTraducir: &quot;&quot;,  
        justificacionIngles: &quot;&quot;,  
        listo: &quot;PENDIENTE&quot;,  
      },  
    ],  
    bitacora: [],  
    versiones: [  
      {  
        id: id(&quot;version&quot;),  
        sistema: &quot;SISCARD&quot;,  
        codigo: &quot;MAN001&quot;,  
        manual: &quot;Manual de prueba&quot;,  
        idioma: &quot;Español&quot;,  
        numero: &quot;1.0&quot;,  
        ubicacionEService: &quot;&quot;,  
        fecha: fechaISOHoy(),  
        estado: &quot;Disponible&quot;,  
        observaciones: &quot;&quot;,  
      },  
    ],  
    comentarios: [],  
    ciclo: [],  
    columnasOcultasManuales: [],  
    columnasOcultasTramites: [],  
    anchosManuales: {},  
    anchosTramites: {},  
    anchosVersiones: {},  
  };  
}  
 
function normalizarEstadoCargado(datos) {
  const base = estadoInicial();
  const origen = datos?.datos || datos?.data || datos || {};
  const configuracion = origen.configuracion || {};
  return {
    ...base,
    ...origen,
    manuales: Array.isArray(origen.manuales) ? origen.manuales : (Array.isArray(origen.calendario) ? origen.calendario : []),
    tramites: Array.isArray(origen.tramites) ? origen.tramites : [],
    bitacora: Array.isArray(origen.bitacora) ? origen.bitacora : [],
    versiones: Array.isArray(origen.versiones) ? origen.versiones : (Array.isArray(origen.controlVersiones) ? origen.controlVersiones : []),
    ciclo: Array.isArray(origen.ciclo) ? origen.ciclo : (Array.isArray(origen.dashboardProduccion) ? origen.dashboardProduccion : []),
    comentarios: Array.isArray(origen.comentarios) ? origen.comentarios : [],
    ultimaCopia: configuracion.ultimaCopia || origen.ultimaCopia || origen.fechaPublicacion || &quot;&quot;,
    columnasOcultasManuales: configuracion.columnasOcultasManuales || origen.columnasOcultasManuales || [],
    columnasOcultasTramites: configuracion.columnasOcultasTramites || origen.columnasOcultasTramites || [],
    anchosManuales: configuracion.anchosManuales || origen.anchosManuales || {},
    anchosTramites: configuracion.anchosTramites || origen.anchosTramites || {},
    anchosVersiones: configuracion.anchosVersiones || origen.anchosVersiones || {},
    modo: &quot;editor&quot;,
  };
}

async function cargarEstado() {
  try {
    if (!window.KirisStorage?.cargarPublicado) {
      throw new Error(&quot;El módulo storage.js no está disponible.&quot;);
    }
    const publicado = await window.KirisStorage.cargarPublicado();
    const estadoPublicado = normalizarEstadoCargado(publicado);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estadoPublicado));
    return estadoPublicado;
  } catch (errorPublicado) {
    console.error(&quot;No fue posible cargar data.json. Se intentará recuperar la copia local.&quot;, errorPublicado);
    try {
      const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (guardado &amp;&amp; typeof guardado === &quot;object&quot;) {
        return normalizarEstadoCargado(guardado);
      }
    } catch (errorLocal) {
      console.error(&quot;No fue posible recuperar la copia local.&quot;, errorLocal);
    }
    return estadoInicial();
  }
}

let estado = estadoInicial();

function normalizarTramitesCargados() {
  estado.tramites = (estado.tramites || []).map((tramite) =&gt; ({
    id: tramite.id || id(&quot;tramite&quot;),
    ...tramite,
    listo: normalizarEstadoListo(tramite.listo),
  }));
}
const VISTA_USUARIO_KEY = &quot;kirisV2_vista_usuario&quot;;
let filtros = { manuales: {}, tramites: {}, versiones: {} };
let ordenamientosVista = { manuales: null, tramites: null, versiones: null };

function leerVistaUsuario() {
  try {
    const vista = JSON.parse(localStorage.getItem(VISTA_USUARIO_KEY));
    return vista &amp;&amp; typeof vista === &quot;object&quot; ? vista : {};
  } catch (error) {
    console.warn(&quot;No fue posible leer la vista guardada.&quot;, error);
    return {};
  }
}

function guardarVistaUsuario() {
  try {
    localStorage.setItem(
      VISTA_USUARIO_KEY,
      JSON.stringify({
        filtros,
        ordenamientos: ordenamientosVista,
        ordenManuales: (estado.manuales || []).map((manual) =&gt; manual.id),
      }),
    );
  } catch (error) {
    console.warn(&quot;No fue posible guardar la vista del usuario.&quot;, error);
  }
}

function aplicarOrdenGuardado(lista, ids) {
  if (!Array.isArray(lista) || !Array.isArray(ids) || !ids.length) return lista;
  const posiciones = new Map(ids.map((id, indice) =&gt; [id, indice]));
  return lista
    .map((item, indiceOriginal) =&gt; ({ item, indiceOriginal }))
    .sort((a, b) =&gt; {
      const pa = posiciones.has(a.item.id) ? posiciones.get(a.item.id) : Number.MAX_SAFE_INTEGER;
      const pb = posiciones.has(b.item.id) ? posiciones.get(b.item.id) : Number.MAX_SAFE_INTEGER;
      return pa - pb || a.indiceOriginal - b.indiceOriginal;
    })
    .map(({ item }) =&gt; item);
}

function restaurarVistaUsuario() {
  const vista = leerVistaUsuario();
  const guardados = vista.filtros || {};
  filtros = {
    manuales: guardados.manuales || {},
    tramites: guardados.tramites || {},
    versiones: guardados.versiones || {},
  };
  ordenamientosVista = {
    manuales: vista.ordenamientos?.manuales || null,
    tramites: vista.ordenamientos?.tramites || null,
    versiones: vista.ordenamientos?.versiones || null,
  };
  estado.manuales = aplicarOrdenGuardado(estado.manuales, vista.ordenManuales);
}

let fechaCalendario = new Date();  
let fechaBitacora = new Date();  
let fechaDashboard = new Date();  
let fechasDestinoCopia = [];  
let editorActivo = true;  
 
function guardarEstado(mensaje = &quot;Cambios guardados&quot;) {  
  estado.ultimaCopia = new Date().toISOString();  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));  
  guardarVistaUsuario();
  actualizarEstadoGuardado();  
  if (mensaje) mostrarToast(mensaje);  
}  
 
function fechaISOHoy() {  
  const d = new Date();  
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, &quot;0&quot;)}-${String(d.getDate()).padStart(2, &quot;0&quot;)}`;  
}  
 
function escaparHTML(valor) {  
  return String(valor ?? &quot;&quot;)  
    .replaceAll(&quot;&amp;&quot;, &quot;&amp;amp;&quot;)  
    .replaceAll(&quot;&lt;&quot;, &quot;&amp;lt;&quot;)  
    .replaceAll(&quot;&gt;&quot;, &quot;&amp;gt;&quot;)  
    .replaceAll(&#x27;&quot;&#x27;, &quot;&amp;quot;&quot;)  
    .replaceAll(&quot;&#x27;&quot;, &quot;&amp;#039;&quot;);  
}  
 
function normalizar(valor) {  
  return String(valor ?? &quot;&quot;)  
    .toLowerCase()  
    .normalize(&quot;NFD&quot;)  
    .replace(/[\u0300-\u036f]/g, &quot;&quot;);  
}  
 
function normalizarEstadoListo(valor) {  
  const texto = String(valor ?? &quot;&quot;)  
    .trim()  
    .replace(/AMBOS\s*[ÍI]\s*IDIOMAS/gi, &quot;AMBOS IDIOMAS&quot;);  
  return texto;  
}  
 
function claseListo(valor) {  
  const texto = normalizar(normalizarEstadoListo(valor));  
  if (texto.startsWith(&quot;pendiente&quot;)) return &quot;listo-pendiente&quot;;  
  if (texto === &quot;ambos idiomas&quot;) return &quot;listo-ambos&quot;;  
  if (texto.startsWith(&quot;solo espanol&quot;)) return &quot;listo-espanol&quot;;  
  return &quot;&quot;;  
}  
 
function claseEstado(valor) {  
  return `estado-${normalizar(valor).replace(/\s+/g, &quot;-&quot;)}`;  
}  
 
function calcularEstadoManual(manual) {  
  if (manual.fechaPublicado) return &quot;Publicado&quot;;  
  if (manual.fechaFinalizacion) return &quot;Completado&quot;;  
  if (manual.fechaInicio) return &quot;En proceso&quot;;  
  return &quot;No iniciado&quot;;  
}  
 
function horasBitacoraManual(manual) {  
  return estado.bitacora  
    .filter(  
      (registro) =&gt;  
        registro.manual === manual.titulo || registro.manual === manual.codigo,  
    )  
    .reduce((total, registro) =&gt; total + Number(registro.horas || 0), 0);  
}  
 
function mostrarToast(texto) {  
  const toast = $(&quot;toast&quot;);  
  if (!toast) return;  
  toast.textContent = texto;  
  toast.hidden = false;  
  clearTimeout(mostrarToast.temporizador);  
  mostrarToast.temporizador = setTimeout(() =&gt; {  
    toast.hidden = true;  
  }, 2600);  
}  
 
function actualizarEstadoGuardado() {  
  const texto = $(&quot;ultimaCopiaTexto&quot;);  
  const estadoTexto = $(&quot;estadoSincronizacion&quot;);  
  if (texto)  
    texto.textContent = estado.ultimaCopia  
      ? new Date(estado.ultimaCopia).toLocaleString(&quot;es-CR&quot;)  
      : &quot;Sin guardado registrado&quot;;  
  if (estadoTexto) {
    estadoTexto.textContent = &quot;Fuente oficial: data.json · copia local de recuperación activa&quot;;
  }  
}  
 
function entrar() {  
  estado.modo = &quot;editor&quot;;  
  editorActivo = true;  
  document.body.classList.remove(&quot;modo-visitante&quot;);  
  const app = $(&quot;app&quot;);  
  if (app) app.hidden = false;  
  const badge = $(&quot;modoUsuarioBadge&quot;);  
  if (badge) {  
    badge.textContent = &quot;Editor&quot;;  
    badge.className = &quot;modo-badge-editor&quot;;  
  }  
  renderTodo();  
}  
function cerrarSesion() {  
  entrar();  
}  
function configurarLogin() {  
  entrar();  
}  
function activarTab(tabId) {  
  document.querySelectorAll(&quot;.tab-btn&quot;).forEach((boton) =&gt; {  
    const activo = boton.dataset.tab === tabId;  
    boton.classList.toggle(&quot;active&quot;, activo);  
    boton.setAttribute(&quot;aria-selected&quot;, String(activo));  
  });  
  document  
    .querySelectorAll(&quot;.tab-content&quot;)  
    .forEach((panel) =&gt; panel.classList.toggle(&quot;active&quot;, panel.id === tabId));  
  if (tabId === &quot;tabCalendario&quot;) renderCalendario();  
  if (tabId === &quot;tabBitacora&quot;) renderBitacora();  
  if (tabId === &quot;tabDashboard&quot;) renderDashboard();  
  if (tabId === &quot;tabTramites&quot;) renderTramites();  
  if (tabId === &quot;tabVersiones&quot;) renderVersiones();  
}  
 
function configurarTabs() {  
  document  
    .querySelectorAll(&quot;.tab-btn&quot;)  
    .forEach((boton) =&gt;  
      boton.addEventListener(&quot;click&quot;, () =&gt; activarTab(boton.dataset.tab)),  
    );  
}  
 
function fechaLocalDesdeISO(valor) {
  if (!valor) return null;
  const fecha = new Date(`${valor}T00:00:00`);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}
function fechaISODesdeLocal(fecha) {
  if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) return &quot;&quot;;
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, &quot;0&quot;)}-${String(fecha.getDate()).padStart(2, &quot;0&quot;)}`;
}
function esDiaHabil(fecha) {
  return fecha.getDay() !== 0 &amp;&amp; fecha.getDay() !== 6;
}
function sumarDiasHabiles(fechaInicial, cantidad) {
  const fecha = new Date(fechaInicial);
  let agregados = 0;
  while (agregados &lt; cantidad) {
    fecha.setDate(fecha.getDate() + 1);
    if (esDiaHabil(fecha)) agregados += 1;
  }
  return fecha;
}
function contarDiasHabiles(desde, hasta) {
  const inicio = new Date(desde);
  const fin = new Date(hasta);
  if (inicio.getTime() === fin.getTime()) return 0;
  const sentido = inicio &lt; fin ? 1 : -1;
  let total = 0;
  const cursor = new Date(inicio);
  while ((sentido === 1 &amp;&amp; cursor &lt; fin) || (sentido === -1 &amp;&amp; cursor &gt; fin)) {
    cursor.setDate(cursor.getDate() + sentido);
    if (esDiaHabil(cursor)) total += sentido;
  }
  return total;
}
function diasEstimadosTramite(tramite) {
  if (tramite.tipoGestion === &quot;T&quot;) return 40;
  if (tramite.tipoGestion === &quot;R&quot;) return 15;
  return 0;
}
function tiempoEstimadoTramite(tramite) {
  if (tramite.tipoGestion === &quot;T&quot;) return &quot;2 meses (40 días hábiles)&quot;;
  if (tramite.tipoGestion === &quot;R&quot;) return &quot;3 semanas (15 días hábiles)&quot;;
  return &quot;&quot;;
}
function fechaLimiteTramite(tramite) {
  const ingreso = fechaLocalDesdeISO(tramite.fechaIngreso);
  const dias = diasEstimadosTramite(tramite);
  if (!ingreso || !dias) return &quot;&quot;;
  return fechaISODesdeLocal(sumarDiasHabiles(ingreso, dias));
}
function informacionCumplimientoTramite(tramite) {
  const limiteISO = fechaLimiteTramite(tramite);
  if (!limiteISO) return { texto: &quot;Sin calcular&quot;, clase: &quot;cumplimiento-sin-calcular&quot; };
  const limite = fechaLocalDesdeISO(limiteISO);
  if (tramite.fechaPublicado) {
    const publicado = fechaLocalDesdeISO(tramite.fechaPublicado);
    if (publicado &amp;&amp; publicado &lt;= limite) return { texto: &quot;Finalizado a tiempo&quot;, clase: &quot;cumplimiento-finalizado&quot; };
    return { texto: &quot;Finalizado tarde&quot;, clase: &quot;cumplimiento-tarde&quot; };
  }
  const hoy = fechaLocalDesdeISO(fechaISOHoy());
  const restantes = contarDiasHabiles(hoy, limite);
  if (hoy &gt; limite) return { texto: &quot;Tarde&quot;, clase: &quot;cumplimiento-tarde&quot; };
  if (restantes &lt;= 5) return {
    texto: restantes === 0 ? &quot;Vence hoy&quot; : `Próximo · ${restantes} día(s) hábil(es)`,
    clase: &quot;cumplimiento-proximo&quot;,
  };
  return { texto: `En tiempo · ${restantes} día(s) hábil(es)`, clase: &quot;cumplimiento-en-tiempo&quot; };
}

function valorVisible(objeto, columna) {  
  if (columna.key === &quot;tiempoEstimado&quot;) return tiempoEstimadoTramite(objeto);
  if (columna.key === &quot;fechaLimite&quot;) return fechaLimiteTramite(objeto);
  if (columna.key === &quot;cumplimiento&quot;) return informacionCumplimientoTramite(objeto).texto;
  if (columna.key === &quot;tiempoInvertido&quot;)  
    return horasBitacoraManual(objeto).toFixed(2);  
  if (columna.key === &quot;estado&quot; &amp;&amp; objeto.codigo !== undefined)  
    return calcularEstadoManual(objeto);  
  return objeto[columna.key] ?? &quot;&quot;;  
}  
 
 
function crearColgroup(elemento, columnas, anchos, ocultas = []) {  
  elemento.innerHTML = columnas  
    .map((columna) =&gt; {  
      const oculto = ocultas.includes(columna.key) ? &quot;display:none&quot; : &quot;&quot;;  
      const ancho = anchos[columna.key] || columna.width || 120;  
      return `&lt;col data-key=&quot;${columna.key}&quot; style=&quot;width:${ancho}px;${oculto}&quot;&gt;`;  
    })  
    .join(&quot;&quot;);  
}  
 
 
function campoCelda(objeto, columna, tipoEntidad) {  
  const valor = valorVisible(objeto, columna);  
  if (!editorActivo || columna.calculado) {  
    if (columna.key === &quot;cumplimiento&quot;) {
      const info = informacionCumplimientoTramite(objeto);
      return `&lt;span class=&quot;cumplimiento-indicador ${info.clase}&quot;&gt;${escaparHTML(info.texto)}&lt;/span&gt;`;
    }
    if (columna.key === &quot;fechaLimite&quot;) return `&lt;span class=&quot;fecha-limite-tramite&quot;&gt;${escaparHTML(valor)}&lt;/span&gt;`;
    if (columna.key === &quot;tiempoEstimado&quot;) return `&lt;span class=&quot;tiempo-estimado-tramite&quot;&gt;${escaparHTML(valor)}&lt;/span&gt;`;
    if (columna.key === &quot;estado&quot;)  
      return `&lt;span class=&quot;estado ${claseEstado(valor)}&quot;&gt;${escaparHTML(valor)}&lt;/span&gt;`;  
    if (columna.key === &quot;listo&quot;)  
      return `&lt;span class=&quot;estado-listo ${claseListo(valor)}&quot;&gt;${escaparHTML(normalizarEstadoListo(valor))}&lt;/span&gt;`;  
    return escaparHTML(valor);  
  }  
  if (columna.tipo === &quot;select&quot;) {  
    const valorSelect =  
      columna.key === &quot;listo&quot; ? normalizarEstadoListo(valor) : valor;  
    const opciones = columna.opciones  
      .map(  
        (opcion) =&gt;  
          `&lt;option ${String(opcion) === String(valorSelect) ? &quot;selected&quot; : &quot;&quot;}&gt;${escaparHTML(opcion)}&lt;/option&gt;`,  
      )  
      .join(&quot;&quot;);  
    const claseExtra =  
      columna.key === &quot;listo&quot; ? ` estado-listo ${claseListo(valorSelect)}` : &quot;&quot;;  
    return `&lt;select class=&quot;cell-select${claseExtra}&quot; data-entidad=&quot;${tipoEntidad}&quot; data-id=&quot;${objeto.id}&quot; data-key=&quot;${columna.key}&quot;&gt;${opciones}&lt;/select&gt;`;  
  }  
  if (columna.tipo === &quot;textarea&quot;)  
    return `&lt;textarea class=&quot;cell-textarea&quot; data-entidad=&quot;${tipoEntidad}&quot; data-id=&quot;${objeto.id}&quot; data-key=&quot;${columna.key}&quot;&gt;${escaparHTML(valor)}&lt;/textarea&gt;`;  
  return `&lt;input class=&quot;cell-input&quot; type=&quot;${columna.tipo || &quot;text&quot;}&quot; data-entidad=&quot;${tipoEntidad}&quot; data-id=&quot;${objeto.id}&quot; data-key=&quot;${columna.key}&quot; value=&quot;${escaparHTML(valor)}&quot;&gt;`;  
}  
 
function enlazarEdicionTabla(contenedor) { 
 
    contenedor 
        .querySelectorAll( 
            &quot;.cell-input,.cell-select,.cell-textarea&quot; 
        ) 
        .forEach((campo) =&gt; { 
 
            const guardarCampo = () =&gt; { 
 
                const coleccion = 
                    estado[campo.dataset.entidad]; 
 
                const registro = 
                    coleccion.find( 
                        item =&gt; 
                            item.id === campo.dataset.id 
                    ); 
 
                if (!registro) return; 
 
                registro[campo.dataset.key] = 
                    campo.type === &quot;number&quot; 
                        ? Number(campo.value || 0) 
                        : campo.dataset.key === &quot;listo&quot; 
                            ? normalizarEstadoListo( 
                                campo.value 
                            ) 
                            : campo.value; 
 
                guardarEstado(&quot;&quot;);
                if (campo.dataset.entidad === &quot;tramites&quot; &amp;&amp; [&quot;tipoGestion&quot;, &quot;fechaIngreso&quot;, &quot;fechaPublicado&quot;].includes(campo.dataset.key)) {
                    renderTramites();
                } 
 
            }; 
 
            campo.addEventListener( 
                &quot;input&quot;, 
                guardarCampo 
            ); 
 
            campo.addEventListener( 
                &quot;change&quot;, 
                guardarCampo 
            ); 
 
        }); 
 
} 
 
function copiarRegistro(tipoEntidad, registroId) {
  const coleccion = estado[tipoEntidad];

  if (!Array.isArray(coleccion)) {
    mostrarToast(&quot;No fue posible localizar la colección.&quot;);
    return;
  }

  const indiceOriginal = coleccion.findIndex(
    (registro) =&gt; registro.id === registroId,
  );

  if (indiceOriginal === -1) {
    mostrarToast(&quot;No fue posible localizar el registro.&quot;);
    return;
  }

  const prefijos = {
    manuales: &quot;manual&quot;,
    tramites: &quot;tramite&quot;,
    versiones: &quot;version&quot;,
  };

  const registroOriginal = coleccion[indiceOriginal];
  const registroCopiado = {
    ...registroOriginal,
    id: id(prefijos[tipoEntidad]),
  };

  coleccion.splice(indiceOriginal + 1, 0, registroCopiado);
  guardarEstado(&quot;Registro copiado y guardado&quot;);

  if (tipoEntidad === &quot;manuales&quot;) {
    renderManuales();
    abrirManual(registroCopiado.id);
    return;
  }

  if (tipoEntidad === &quot;tramites&quot;) {
    renderTramites();
    abrirTramite(registroCopiado.id);
    return;
  }

  if (tipoEntidad === &quot;versiones&quot;) {
    renderVersiones();
    abrirVersion(registroCopiado.id);
  }
}

function renderManuales() {  
  const ocultas = estado.columnasOcultasManuales || [];  
  crearColgroup(  
    $(&quot;colgroupManuales&quot;),  
    COLUMNAS_MANUALES,  
    estado.anchosManuales || {},  
    ocultas,  
  );  
  crearEncabezado($(&quot;theadManuales&quot;), COLUMNAS_MANUALES, &quot;manuales&quot;, ocultas);  
  const lista = estado.manuales.filter((objeto) =&gt;  
    cumpleFiltros(objeto, &quot;manuales&quot;, COLUMNAS_MANUALES),  
  );  
  $(&quot;tbodyManuales&quot;).innerHTML = lista.length  
    ? lista  
        .map(  
          (manual) =&gt;  
            `&lt;tr data-id=&quot;${manual.id}&quot;&gt;${COLUMNAS_MANUALES.map((columna) =&gt; {  
              const oculto = ocultas.includes(columna.key)  
                ? &quot;display:none&quot;  
                : &quot;&quot;;  
              if (columna.especial === &quot;seleccion&quot;)  
                return `&lt;td style=&quot;${oculto}&quot;&gt;&lt;input class=&quot;seleccion-manual&quot; type=&quot;checkbox&quot; data-id=&quot;${manual.id}&quot;&gt;&lt;/td&gt;`;  
              if (columna.especial === &quot;orden&quot;)  
                return `&lt;td class=&quot;numero-manual&quot; style=&quot;${oculto}&quot;&gt;&lt;span class=&quot;numero-manual-valor&quot;&gt;${estado.manuales.findIndex((item) =&gt; item.id === manual.id) + 1}&lt;/span&gt;&lt;button class=&quot;drag-handle drag-manual&quot; type=&quot;button&quot; draggable=&quot;true&quot; data-id=&quot;${manual.id}&quot; title=&quot;Arrastrar para reordenar&quot; aria-label=&quot;Mover fila ${estado.manuales.findIndex((item) =&gt; item.id === manual.id) + 1}&quot;&gt;⋮⋮&lt;/button&gt;&lt;/td&gt;`;  
              if (columna.especial === &quot;acciones&quot;)  
                return `&lt;td style=&quot;${oculto};white-space:nowrap&quot;&gt;&lt;button class=&quot;btn-icon editor-only&quot; type=&quot;button&quot; data-editar-manual=&quot;${manual.id}&quot; title=&quot;Editar registro&quot; aria-label=&quot;Editar registro&quot;&gt;✏️&lt;/button&gt; &lt;button class=&quot;btn-icon editor-only&quot; type=&quot;button&quot; data-copiar-manual=&quot;${manual.id}&quot; title=&quot;Copiar registro&quot; aria-label=&quot;Copiar registro&quot;&gt;📋&lt;/button&gt;&lt;/td&gt;`;  
              return `&lt;td style=&quot;${oculto}&quot;&gt;${campoCelda(manual, columna, &quot;manuales&quot;)}&lt;/td&gt;`;  
            }).join(&quot;&quot;)}&lt;/tr&gt;`,  
        )  
        .join(&quot;&quot;)  
    : `&lt;tr&gt;&lt;td class=&quot;empty-state&quot; colspan=&quot;${COLUMNAS_MANUALES.length}&quot;&gt;No se encontraron manuales que coincidan con la búsqueda.&lt;/td&gt;&lt;/tr&gt;`;  
  enlazarEdicionTabla($(&quot;tbodyManuales&quot;));  
  $(&quot;seleccionarTodos_manuales&quot;)?.addEventListener(&quot;change&quot;, (e) =&gt;  
    document.querySelectorAll(&quot;.seleccion-manual&quot;).forEach((c) =&gt; {  
      c.checked = e.target.checked;  
    }),  
  );  
  document
    .querySelectorAll(&quot;[data-editar-manual]&quot;)
    .forEach((boton) =&gt;
      boton.addEventListener(&quot;click&quot;, () =&gt;
        abrirManual(boton.dataset.editarManual),
      ),
    );
  document
    .querySelectorAll(&quot;[data-copiar-manual]&quot;)
    .forEach((boton) =&gt;
      boton.addEventListener(&quot;click&quot;, () =&gt;
        copiarRegistro(&quot;manuales&quot;, boton.dataset.copiarManual),
      ),
    );  
  habilitarReordenamientoManuales();  
  habilitarRedimensionamiento();  
}  
 
function renderTramites() {  
  const ocultas = estado.columnasOcultasTramites || [];  
  crearColgroup(  
    $(&quot;colgroupTramites&quot;),  
    COLUMNAS_TRAMITES,  
    estado.anchosTramites || {},  
    ocultas,  
  );  
  crearEncabezado($(&quot;theadTramites&quot;), COLUMNAS_TRAMITES, &quot;tramites&quot;, ocultas);  
  const lista = estado.tramites.filter((objeto) =&gt;  
    cumpleFiltros(objeto, &quot;tramites&quot;, COLUMNAS_TRAMITES),  
  );  
  $(&quot;tbodyTramites&quot;).innerHTML = lista.length  
    ? lista  
        .map(  
          (tramite) =&gt;  
            `&lt;tr data-id=&quot;${tramite.id}&quot;&gt;${COLUMNAS_TRAMITES.map((columna) =&gt; {  
              const oculto = ocultas.includes(columna.key)  
                ? &quot;display:none&quot;  
                : &quot;&quot;;  
              if (columna.especial === &quot;seleccion&quot;)  
                return `&lt;td style=&quot;${oculto}&quot;&gt;&lt;input class=&quot;seleccion-tramite&quot; type=&quot;checkbox&quot; data-id=&quot;${tramite.id}&quot;&gt;&lt;/td&gt;`;  
              if (columna.especial === &quot;acciones&quot;)  
                return `&lt;td style=&quot;${oculto};white-space:nowrap&quot;&gt;&lt;button class=&quot;btn-icon editor-only&quot; type=&quot;button&quot; data-editar-tramite=&quot;${tramite.id}&quot; title=&quot;Editar registro&quot; aria-label=&quot;Editar registro&quot;&gt;✏️&lt;/button&gt; &lt;button class=&quot;btn-icon editor-only&quot; type=&quot;button&quot; data-copiar-tramite=&quot;${tramite.id}&quot; title=&quot;Copiar registro&quot; aria-label=&quot;Copiar registro&quot;&gt;📋&lt;/button&gt;&lt;/td&gt;`;  
              return `&lt;td style=&quot;${oculto}&quot;&gt;${campoCelda(tramite, columna, &quot;tramites&quot;)}&lt;/td&gt;`;  
            }).join(&quot;&quot;)}&lt;/tr&gt;`,  
        )  
        .join(&quot;&quot;)  
    : `&lt;tr&gt;&lt;td class=&quot;empty-state&quot; colspan=&quot;${COLUMNAS_TRAMITES.length}&quot;&gt;No se encontraron trámites que coincidan con la búsqueda.&lt;/td&gt;&lt;/tr&gt;`;  
  enlazarEdicionTabla($(&quot;tbodyTramites&quot;));  
  $(&quot;seleccionarTodos_tramites&quot;)?.addEventListener(&quot;change&quot;, (e) =&gt;  
    document.querySelectorAll(&quot;.seleccion-tramite&quot;).forEach((c) =&gt; {  
      c.checked = e.target.checked;  
    }),  
  );  
  document
    .querySelectorAll(&quot;[data-editar-tramite]&quot;)
    .forEach((boton) =&gt;
      boton.addEventListener(&quot;click&quot;, () =&gt;
        abrirTramite(boton.dataset.editarTramite),
      ),
    );
  document
    .querySelectorAll(&quot;[data-copiar-tramite]&quot;)
    .forEach((boton) =&gt;
      boton.addEventListener(&quot;click&quot;, () =&gt;
        copiarRegistro(&quot;tramites&quot;, boton.dataset.copiarTramite),
      ),
    );  
  habilitarRedimensionamiento();  
}  
 
function renderVersiones() {  
  crearColgroup(  
    $(&quot;colgroupVersiones&quot;),  
    COLUMNAS_VERSIONES,  
    estado.anchosVersiones || {},  
  );  
  crearEncabezado($(&quot;theadVersiones&quot;), COLUMNAS_VERSIONES, &quot;versiones&quot;);  
  const lista = estado.versiones.filter((objeto) =&gt;  
    cumpleFiltros(objeto, &quot;versiones&quot;, COLUMNAS_VERSIONES),  
  );  
  $(&quot;tbodyVersiones&quot;).innerHTML = lista.length  
    ? lista  
        .map(  
          (version) =&gt;  
            `&lt;tr data-id=&quot;${version.id}&quot;&gt;${COLUMNAS_VERSIONES.map((columna) =&gt; {  
              if (columna.especial === &quot;seleccion&quot;)  
                return `&lt;td&gt;&lt;input class=&quot;seleccion-version&quot; type=&quot;checkbox&quot; data-id=&quot;${version.id}&quot;&gt;&lt;/td&gt;`;  
              if (columna.especial === &quot;acciones&quot;)  
                return `&lt;td style=&quot;white-space:nowrap&quot;&gt;&lt;button class=&quot;btn-icon editor-only&quot; type=&quot;button&quot; data-editar-version=&quot;${version.id}&quot; title=&quot;Editar registro&quot; aria-label=&quot;Editar registro&quot;&gt;✏️&lt;/button&gt; &lt;button class=&quot;btn-icon editor-only&quot; type=&quot;button&quot; data-copiar-version=&quot;${version.id}&quot; title=&quot;Copiar registro&quot; aria-label=&quot;Copiar registro&quot;&gt;📋&lt;/button&gt;&lt;/td&gt;`;  
              return `&lt;td&gt;${campoCelda(version, columna, &quot;versiones&quot;)}&lt;/td&gt;`;  
            }).join(&quot;&quot;)}&lt;/tr&gt;`,  
        )  
        .join(&quot;&quot;)  
    : `&lt;tr&gt;&lt;td class=&quot;empty-state&quot; colspan=&quot;${COLUMNAS_VERSIONES.length}&quot;&gt;No se encontraron versiones que coincidan con la búsqueda.&lt;/td&gt;&lt;/tr&gt;`;  
  enlazarEdicionTabla($(&quot;tbodyVersiones&quot;));  
  $(&quot;seleccionarTodos_versiones&quot;)?.addEventListener(&quot;change&quot;, (e) =&gt;  
    document.querySelectorAll(&quot;.seleccion-version&quot;).forEach((c) =&gt; {  
      c.checked = e.target.checked;  
    }),  
  );  
  document
    .querySelectorAll(&quot;[data-editar-version]&quot;)
    .forEach((boton) =&gt;
      boton.addEventListener(&quot;click&quot;, () =&gt;
        abrirVersion(boton.dataset.editarVersion),
      ),
    );
  document
    .querySelectorAll(&quot;[data-copiar-version]&quot;)
    .forEach((boton) =&gt;
      boton.addEventListener(&quot;click&quot;, () =&gt;
        copiarRegistro(&quot;versiones&quot;, boton.dataset.copiarVersion),
      ),
    );  
  renderResumenVersiones();  
  habilitarRedimensionamiento();  
}  
 
function renderResumenVersiones() {  
  const ingles = estado.versiones.filter(  
    (v) =&gt; normalizar(v.idioma) === &quot;ingles&quot;,  
  ).length;  
  const espanol = estado.versiones.filter(  
    (v) =&gt; normalizar(v.idioma) === &quot;espanol&quot;,  
  ).length;  
  const siscardPlusIngles = estado.versiones.filter(  
    (v) =&gt;  
      normalizar(v.sistema).includes(&quot;siscard+&quot;) &amp;&amp;  
      normalizar(v.idioma) === &quot;ingles&quot;,  
  ).length;  
  const siscardPlusEspanol = estado.versiones.filter(  
    (v) =&gt;  
      normalizar(v.sistema).includes(&quot;siscard+&quot;) &amp;&amp;  
      normalizar(v.idioma) === &quot;espanol&quot;,  
  ).length;  
  $(&quot;resumenVersiones&quot;).innerHTML = [  
    [&quot;Total en Inglés&quot;, ingles],  
    [&quot;Total en Español&quot;, espanol],  
    [&quot;Total siscard+ Inglés&quot;, siscardPlusIngles],  
    [&quot;Total siscard+ Español&quot;, siscardPlusEspanol],  
  ]  
    .map(  
      ([label, value]) =&gt;  
        `&lt;div class=&quot;kpi-card&quot;&gt;&lt;div class=&quot;label&quot;&gt;${label}&lt;/div&gt;&lt;div class=&quot;value&quot;&gt;${value}&lt;/div&gt;&lt;/div&gt;`,  
    )  
    .join(&quot;&quot;);  
}  
 
let manualArrastradoId = &quot;&quot;;  
function habilitarReordenamientoManuales() {  
  const cuerpo = $(&quot;tbodyManuales&quot;);  
  if (!cuerpo) return;  
  cuerpo.querySelectorAll(&quot;.drag-manual&quot;).forEach((handle) =&gt; {  
    handle.ondragstart = (evento) =&gt; {  
      manualArrastradoId = handle.dataset.id || &quot;&quot;;  
      evento.dataTransfer.effectAllowed = &quot;move&quot;;  
      evento.dataTransfer.setData(&quot;text/plain&quot;, manualArrastradoId);  
      handle.closest(&quot;tr&quot;)?.classList.add(&quot;dragging&quot;);  
    };  
    handle.ondragend = () =&gt; {  
      cuerpo  
        .querySelectorAll(&quot;tr&quot;)  
        .forEach((fila) =&gt; fila.classList.remove(&quot;dragging&quot;, &quot;drop-target&quot;));  
      manualArrastradoId = &quot;&quot;;  
    };  
  });  
  cuerpo.querySelectorAll(&quot;tr[data-id]&quot;).forEach((filaDestino) =&gt; {  
    filaDestino.ondragover = (evento) =&gt; {  
      if (!manualArrastradoId || manualArrastradoId === filaDestino.dataset.id)  
        return;  
      evento.preventDefault();  
      evento.dataTransfer.dropEffect = &quot;move&quot;;  
      cuerpo  
        .querySelectorAll(&quot;tr.drop-target&quot;)  
        .forEach((fila) =&gt; fila.classList.remove(&quot;drop-target&quot;));  
      filaDestino.classList.add(&quot;drop-target&quot;);  
    };  
    filaDestino.ondragleave = () =&gt; filaDestino.classList.remove(&quot;drop-target&quot;);  
    filaDestino.ondrop = (evento) =&gt; {  
      evento.preventDefault();  
      const origenId =  
        evento.dataTransfer.getData(&quot;text/plain&quot;) || manualArrastradoId;  
      const destinoId = filaDestino.dataset.id;  
      const origen = estado.manuales.findIndex(  
        (manual) =&gt; manual.id === origenId,  
      );  
      const destino = estado.manuales.findIndex(  
        (manual) =&gt; manual.id === destinoId,  
      );  
      if (origen &lt; 0 || destino &lt; 0 || origen === destino) return;  
      const [movido] = estado.manuales.splice(origen, 1);  
      const posicionDestino = estado.manuales.findIndex(  
        (manual) =&gt; manual.id === destinoId,  
      );  
      estado.manuales.splice(posicionDestino, 0, movido);  
      guardarEstado(&quot;Orden de manuales guardado&quot;);  
      renderManuales();  
    };  
  });  
}  
 
function habilitarRedimensionamiento() {  
  document.querySelectorAll(&quot;.resize-handle&quot;).forEach((handle) =&gt; {  
    handle.onpointerdown = (evento) =&gt; {  
      const th = handle.closest(&quot;th&quot;);  
      const inicioX = evento.clientX;  
      const inicioAncho = th.offsetWidth;  
      const tipo = handle.dataset.tipo;  
      const key = handle.dataset.key;  
      const mover = (e) =&gt; {  
        const ancho = Math.max(60, inicioAncho + e.clientX - inicioX);  
        const col = document.querySelector(  
          `#colgroup${tipo[0].toUpperCase() + tipo.slice(1)} col[data-key=&quot;${key}&quot;]`,  
        );  
        if (col) col.style.width = `${ancho}px`;  
      };  
      const terminar = (e) =&gt; {  
        document.removeEventListener(&quot;pointermove&quot;, mover);  
        document.removeEventListener(&quot;pointerup&quot;, terminar);  
        const ancho = Math.max(60, inicioAncho + e.clientX - inicioX);  
        const destino =  
          tipo === &quot;manuales&quot;  
            ? estado.anchosManuales  
            : tipo === &quot;tramites&quot;  
              ? estado.anchosTramites  
              : estado.anchosVersiones;  
        destino[key] = ancho;  
        guardarEstado(&quot;&quot;);  
      };  
      document.addEventListener(&quot;pointermove&quot;, mover);  
      document.addEventListener(&quot;pointerup&quot;, terminar);  
    };  
  });  
}  
 
function poblarSelectMesAnio(selectMes, selectAnio, fecha) {  
  selectMes.innerHTML = MESES.map(  
    (mes, i) =&gt;  
      `&lt;option value=&quot;${i}&quot; ${i === fecha.getMonth() ? &quot;selected&quot; : &quot;&quot;}&gt;${mes}&lt;/option&gt;`,  
  ).join(&quot;&quot;);  
  const anio = fecha.getFullYear();  
  selectAnio.innerHTML = Array.from({ length: 11 }, (_, i) =&gt; anio - 5 + i)  
    .map((a) =&gt; `&lt;option ${a === anio ? &quot;selected&quot; : &quot;&quot;}&gt;${a}&lt;/option&gt;`)  
    .join(&quot;&quot;);  
}  
 
function matrizMes(fecha) {  
  const primero = new Date(fecha.getFullYear(), fecha.getMonth(), 1);  
  const inicioSemana = (primero.getDay() + 6) % 7;  
  const inicio = new Date(  
    fecha.getFullYear(),  
    fecha.getMonth(),  
    1 - inicioSemana,  
  );  
  return Array.from(  
    { length: 42 },  
    (_, i) =&gt;  
      new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i),  
  );  
}  
 
function colorManualCalendario(manual) {  
  if (manual.colorCalendario) return manual.colorCalendario;  
  const paleta = [  
    &quot;#FF6C0C&quot;,  
    &quot;#E63946&quot;,  
    &quot;#2A9D8F&quot;,  
    &quot;#3A86FF&quot;,  
    &quot;#8338EC&quot;,  
    &quot;#F4A261&quot;,  
    &quot;#00A896&quot;,  
    &quot;#D62828&quot;,  
    &quot;#6A994E&quot;,  
    &quot;#4D908E&quot;,  
    &quot;#F72585&quot;,  
    &quot;#4361EE&quot;,  
  ];  
  const clave = String(manual.id || manual.codigo || manual.titulo || &quot;manual&quot;);  
  let hash = 0;  
  for (let i = 0; i &lt; clave.length; i++)  
    hash = (hash &lt;&lt; 5) - hash + clave.charCodeAt(i);  
  manual.colorCalendario = paleta[Math.abs(hash) % paleta.length];  
  return manual.colorCalendario;  
}  
function fechaValidaManual(valor) {  
  if (!valor) return null;  
  const d = new Date(`${valor}T00:00:00`);  
  return Number.isNaN(d.getTime()) ? null : d;  
}  
function posicionEventoManual(manual, fechaISO) {  
  const inicio = fechaValidaManual(manual.fechaInicio);  
  const fin = fechaValidaManual(  
    manual.fechaFinalizacion || manual.fechaPublicado || manual.fechaInicio,  
  );  
  const actual = fechaValidaManual(fechaISO);  
  if (!inicio || !fin || !actual || actual &lt; inicio || actual &gt; fin) return &quot;&quot;;  
  if (inicio.getTime() === fin.getTime()) return &quot;unico&quot;;  
  if (actual.getTime() === inicio.getTime()) return &quot;inicio&quot;;  
  if (actual.getTime() === fin.getTime()) return &quot;final&quot;;  
  return &quot;continuacion&quot;;  
}  
function resumenCalendarioManual(manual) {  
  const horas = horasBitacoraManual(manual);  
  return [  
    `Manual: ${manual.codigo || &quot;&quot;} - ${manual.titulo || &quot;&quot;}`,  
    `Tipo: ${manual.tipo || &quot;&quot;}`,  
    `Fecha de inicio: ${manual.fechaInicio || &quot;&quot;}`,  
    `Fecha de finalización: ${manual.fechaFinalizacion || manual.fechaPublicado || &quot;&quot;}`,  
    `Tiempo invertido: ${horas.toFixed(2)} h`,  
    `Total de horas registradas: ${horas.toFixed(2)} h`,  
  ].join(&quot;\n&quot;);  
}  
function renderCalendario() {  
  poblarSelectMesAnio(  
    $(&quot;selectorMesCalendario&quot;),  
    $(&quot;selectorAnioCalendario&quot;),  
    fechaCalendario,  
  );  
  $(&quot;tituloCalendario&quot;).textContent =  
    `${MESES[fechaCalendario.getMonth()]} ${fechaCalendario.getFullYear()}`;  
  const hoy = fechaISOHoy();  
  const dias = matrizMes(fechaCalendario);  
  const encabezados = DIAS.map(  
    (d) =&gt; `&lt;div class=&quot;calendario-encabezado&quot;&gt;${d}&lt;/div&gt;`,  
  ).join(&quot;&quot;);  
  const celdas = dias  
    .map((dia) =&gt; {  
      const iso = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, &quot;0&quot;)}-${String(dia.getDate()).padStart(2, &quot;0&quot;)}`;  
      const eventos = estado.manuales  
        .map((m) =&gt; ({ manual: m, posicion: posicionEventoManual(m, iso) }))  
        .filter((x) =&gt; x.posicion);  
      return `&lt;div class=&quot;calendario-dia ${dia.getMonth() !== fechaCalendario.getMonth() ? &quot;fuera-mes&quot; : &quot;&quot;} ${iso === hoy ? &quot;hoy&quot; : &quot;&quot;}&quot; data-fecha=&quot;${iso}&quot;&gt;     
            &lt;div class=&quot;calendario-numero&quot;&gt;${dia.getDate()}&lt;/div&gt;     
            ${eventos.map(({ manual, posicion }) =&gt; `&lt;div class=&quot;calendario-evento evento-${posicion}&quot; style=&quot;--evento-color:${colorManualCalendario(manual)};background:${colorManualCalendario(manual)}&quot; title=&quot;${escaparHTML(resumenCalendarioManual(manual))}&quot;&gt;${escaparHTML(manual.codigo || manual.titulo)}&lt;/div&gt;`).join(&quot;&quot;)}     
        &lt;/div&gt;`;  
    })  
    .join(&quot;&quot;);  
  $(&quot;calendarioManuales&quot;).innerHTML = encabezados + celdas;  
}  
 
function renderBitacora() {  
  poblarSelectMesAnio(  
    $(&quot;selectorMesBitacora&quot;),  
    $(&quot;selectorAnioBitacora&quot;),  
    fechaBitacora,  
  );  
  $(&quot;tituloBitacora&quot;).textContent =  
    `Bitácora · ${MESES[fechaBitacora.getMonth()]} ${fechaBitacora.getFullYear()}`;  
  const dias = matrizMes(fechaBitacora);  
  $(&quot;calendarioBitacora&quot;).innerHTML =  
    DIAS.map((d) =&gt; `&lt;div class=&quot;calendario-encabezado&quot;&gt;${d}&lt;/div&gt;`).join(&quot;&quot;) +  
    dias  
      .map((dia) =&gt; {  
        const iso = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, &quot;0&quot;)}-${String(dia.getDate()).padStart(2, &quot;0&quot;)}`;  
        const registros = estado.bitacora.filter((r) =&gt; r.fecha === iso);  
        const horas = registros.reduce((t, r) =&gt; t + Number(r.horas || 0), 0);  
        return `&lt;div class=&quot;calendario-dia ${dia.getMonth() !== fechaBitacora.getMonth() ? &quot;fuera-mes&quot; : &quot;&quot;}&quot; data-bitacora-fecha=&quot;${iso}&quot;&gt;       
            &lt;div class=&quot;calendario-numero&quot;&gt;${dia.getDate()}&lt;/div&gt;       
            ${registros.map((r) =&gt; `&lt;div class=&quot;calendario-evento tipo-${normalizar(r.tipo)}&quot; data-registro-id=&quot;${r.id}&quot; title=&quot;${escaparHTML(`Manual: ${r.manual || &quot;&quot;}\nTipo: ${r.tipo || &quot;&quot;}\nHora inicio: ${r.horaInicio || &quot;&quot;}\nHora fin: ${r.horaFin || &quot;&quot;}\nHoras: ${Number(r.horas || 0).toFixed(2)}\nPáginas: ${r.paginas ?? &quot;&quot;}\nDetalle: ${r.detalle || &quot;&quot;}`)}&quot;&gt;${escaparHTML(r.manual)} · ${Number(r.horas || 0).toFixed(2)} h&lt;/div&gt;`).join(&quot;&quot;)}       
            &lt;div class=&quot;bitacora-resumen-dia&quot;&gt;${registros.length ? `${registros.length} registro(s) · ${horas.toFixed(2)} h` : &quot;&quot;}&lt;/div&gt;       
        &lt;/div&gt;`;  
      })  
      .join(&quot;&quot;);  
  document  
    .querySelectorAll(&quot;[data-bitacora-fecha]&quot;)  
    .forEach((celda) =&gt;  
      celda.addEventListener(  
        &quot;dblclick&quot;,  
        () =&gt; editorActivo &amp;&amp; abrirBitacora(&quot;&quot;, celda.dataset.bitacoraFecha),  
      ),  
    );  
  document.querySelectorAll(&quot;[data-registro-id]&quot;).forEach((evento) =&gt; {
    evento.addEventListener(&quot;click&quot;, (e) =&gt; {
      e.stopPropagation();
      if (editorActivo) abrirBitacora(evento.dataset.registroId);
    });
    evento.addEventListener(&quot;contextmenu&quot;, (e) =&gt; {
      e.preventDefault();
      e.stopPropagation();
      if (editorActivo) {
        abrirMenuRegistroBitacora(e, evento.dataset.registroId);
      }
    });
  });
}  
 
function renderDashboard() {  
  const totalHoras = estado.bitacora.reduce(  
    (t, r) =&gt; t + Number(r.horas || 0),  
    0,  
  );  
  const publicados = estado.manuales.filter(  
    (m) =&gt; calcularEstadoManual(m) === &quot;Publicado&quot;,  
  ).length;  
  const enProceso = estado.manuales.filter(  
    (m) =&gt; calcularEstadoManual(m) === &quot;En proceso&quot;,  
  ).length;  
  const prioridadAlta = estado.manuales.filter(
    (m) =&gt; m.prioridad === &quot;Alta&quot;,
  ).length;
  const noIniciados = estado.manuales.filter(
    (m) =&gt; calcularEstadoManual(m) === &quot;No iniciado&quot;,
  ).length;  
  $(&quot;kpiCards&quot;).innerHTML = [  
    [&quot;Total de manuales&quot;, estado.manuales.length],  
    [&quot;Publicados&quot;, publicados],  
    [&quot;En proceso&quot;, enProceso],  
    [&quot;No iniciados&quot;, noIniciados],
    [&quot;Prioridad alta&quot;, prioridadAlta],  
    [&quot;Horas registradas&quot;, totalHoras.toFixed(2)],  
  ]  
    .map(  
      ([l, v]) =&gt;  
        `&lt;div class=&quot;kpi-card&quot;&gt;&lt;div class=&quot;label&quot;&gt;${l}&lt;/div&gt;&lt;div class=&quot;value&quot;&gt;${v}&lt;/div&gt;&lt;/div&gt;`,  
    )  
    .join(&quot;&quot;);  
 
  const porTipo = [&quot;N&quot;, &quot;T&quot;, &quot;A&quot;, &quot;R&quot;].map((tipo) =&gt; ({  
    tipo,  
    horas: estado.bitacora  
      .filter((r) =&gt; r.tipo === tipo)  
      .reduce((t, r) =&gt; t + Number(r.horas || 0), 0),  
  }));  
  const max = Math.max(1, ...porTipo.map((x) =&gt; x.horas));  
  $(&quot;graficoTiposMes&quot;).innerHTML = porTipo  
    .map(  
      (x) =&gt;  
        `&lt;div class=&quot;dashboard-cycle-row&quot;&gt;&lt;div class=&quot;dashboard-cycle-label&quot;&gt;${x.tipo}&lt;/div&gt;&lt;div class=&quot;dashboard-cycle-bar-wrap&quot;&gt;&lt;div class=&quot;dashboard-cycle-bar&quot; style=&quot;width:${(x.horas / max) * 100}%&quot;&gt;&lt;/div&gt;&lt;/div&gt;&lt;div class=&quot;dashboard-cycle-meta&quot;&gt;${x.horas.toFixed(2)} h&lt;/div&gt;&lt;/div&gt;`,  
    )  
    .join(&quot;&quot;);  
 
  $(&quot;selectorMesDashboard&quot;).innerHTML = MESES.map(  
    (m, i) =&gt;  
      `&lt;option value=&quot;${i}&quot; ${i === fechaDashboard.getMonth() ? &quot;selected&quot; : &quot;&quot;}&gt;${m}&lt;/option&gt;`,  
  ).join(&quot;&quot;);  
  $(&quot;selectorAnioDashboard&quot;).value = fechaDashboard.getFullYear();  
  const registrosMes = estado.bitacora.filter((r) =&gt; {  
    const d = new Date(`${r.fecha}T00:00:00`);  
    return (  
      d.getMonth() === fechaDashboard.getMonth() &amp;&amp;  
      d.getFullYear() === fechaDashboard.getFullYear()  
    );  
  });  
  const mapa = {};  
  registrosMes.forEach((r) =&gt; {  
    mapa[r.manual] = (mapa[r.manual] || 0) + Number(r.horas || 0);  
  });  
  $(&quot;topManualesHoras&quot;).innerHTML =  
    Object.entries(mapa)  
      .sort((a, b) =&gt; b[1] - a[1])  
      .map(  
        ([manual, horas]) =&gt;  
          `&lt;div class=&quot;fecha-destino-item&quot;&gt;&lt;strong&gt;${escaparHTML(manual)}&lt;/strong&gt;&lt;span&gt;${horas.toFixed(2)} h&lt;/span&gt;&lt;/div&gt;`,  
      )  
      .join(&quot;&quot;) || `&lt;div class=&quot;empty-state&quot;&gt;Sin registros para el mes.&lt;/div&gt;`;  
  $(&quot;estrategiaSemanal&quot;).innerHTML =  
    `&lt;p&gt;&lt;strong&gt;Lunes, martes y jueves:&lt;/strong&gt; traducciones, actualizaciones y manuales nuevos.&lt;/p&gt;&lt;p&gt;&lt;strong&gt;Miércoles:&lt;/strong&gt; requerimientos.&lt;/p&gt;`;  
  $(&quot;analisisTipos&quot;).innerHTML = [&quot;N&quot;, &quot;T&quot;, &quot;A&quot;, &quot;R&quot;]  
    .map(  
      (tipo) =&gt;  
        `&lt;div class=&quot;fecha-destino-item&quot;&gt;&lt;strong&gt;${tipo}&lt;/strong&gt;&lt;span&gt;${estado.manuales.filter((m) =&gt; m.tipo === tipo).length} manual(es)&lt;/span&gt;&lt;/div&gt;`,  
    )  
    .join(&quot;&quot;);  
  renderCiclo();  
}  
 
function valorCampoCiclo(registro, nombres) {
  const original = registro?.original || registro || {};
  const claves = Object.keys(original);
  const limpiar = (valor) =&gt; normalizar(valor).replace(/[^a-z0-9]/g, &quot;&quot;);
  for (const nombre of nombres) {
    const clave = claves.find((item) =&gt; limpiar(item) === limpiar(nombre));
    if (clave !== undefined) return original[clave];
  }
  return &quot;&quot;;
}
function fechaCampoCiclo(valor) {
  if (valor === &quot;&quot; || valor == null) return null;
  if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : valor;
  if (typeof valor === &quot;number&quot;) {
    const fecha = new Date(Math.round((valor - 25569) * 86400 * 1000));
    return Number.isNaN(fecha.getTime()) ? null : fecha;
  }
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}
function diasHabilesEntreCiclo(inicio, fin) {
  if (!inicio || !fin || fin &lt; inicio) return null;
  const actual = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const limite = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate());
  let dias = 0;
  while (actual &lt; limite) {
    actual.setDate(actual.getDate() + 1);
    if (actual.getDay() !== 0 &amp;&amp; actual.getDay() !== 6) dias += 1;
  }
  return dias;
}
function filasDiasPorTarea() {
  return (estado.ciclo || []).map((registro) =&gt; {
    const inicio = fechaCampoCiclo(valorCampoCiclo(registro, [&quot;Start Date&quot;]));
    const fin = fechaCampoCiclo(valorCampoCiclo(registro, [&quot;Comp Date&quot;]));
    return {
      dias: diasHabilesEntreCiclo(inicio, fin),
      cambio: valorCampoCiclo(registro, [&quot;Change #&quot;]),
      categoria: valorCampoCiclo(registro, [&quot;Change Category&quot;]),
      secuencia: valorCampoCiclo(registro, [&quot;Seq&quot;]),
      estadoTarea: valorCampoCiclo(registro, [&quot;Task Status&quot;]),
      inicio: valorCampoCiclo(registro, [&quot;Start Date&quot;]),
      fin: valorCampoCiclo(registro, [&quot;Comp Date&quot;]),
    };
  }).filter((fila) =&gt; fila.dias !== null).sort((a, b) =&gt; b.dias - a.dias);
}
function abrirDiasPorTarea() {
  if (!(estado.ciclo || []).length) return mostrarToast(&quot;Primero importe export.xlsx&quot;);
  const filas = filasDiasPorTarea();
  const datos = JSON.stringify(filas).replace(/&lt;/g, &quot;\\u003c&quot;);
  const html = `&lt;!doctype html&gt;&lt;html lang=&quot;es&quot;&gt;&lt;head&gt;&lt;meta charset=&quot;utf-8&quot;&gt;&lt;title&gt;Días hábiles por tarea&lt;/title&gt;&lt;style&gt;body{font-family:Segoe UI;margin:0;background:#f3f3f3;color:#333}header{background:#FF6C0C;color:#fff;padding:16px 22px}.wrap{margin:14px;overflow:auto;background:#fff}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}th{background:#666;color:#fff;position:sticky;top:0}&lt;/style&gt;&lt;/head&gt;&lt;body&gt;&lt;header&gt;&lt;h2&gt;Días hábiles por tarea&lt;/h2&gt;&lt;/header&gt;&lt;div class=&quot;wrap&quot;&gt;&lt;table&gt;&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Días&lt;/th&gt;&lt;th&gt;Change #&lt;/th&gt;&lt;th&gt;Change Category&lt;/th&gt;&lt;th&gt;Seq&lt;/th&gt;&lt;th&gt;Task Status&lt;/th&gt;&lt;th&gt;Start Date&lt;/th&gt;&lt;th&gt;Comp Date&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;&lt;tbody id=&quot;body&quot;&gt;&lt;/tbody&gt;&lt;/table&gt;&lt;/div&gt;&lt;script&gt;const filas=${datos};const esc=v=&gt;String(v??&quot;&quot;).replace(/&amp;/g,&quot;&amp;amp;&quot;).replace(/&lt;/g,&quot;&amp;lt;&quot;).replace(/&gt;/g,&quot;&amp;gt;&quot;);body.innerHTML=filas.map(x=&gt;` + &quot;`&quot; + `&lt;tr&gt;&lt;td&gt;${x.dias}&lt;/td&gt;&lt;td&gt;${esc(x.cambio)}&lt;/td&gt;&lt;td&gt;${esc(x.categoria)}&lt;/td&gt;&lt;td&gt;${esc(x.secuencia)}&lt;/td&gt;&lt;td&gt;${esc(x.estadoTarea)}&lt;/td&gt;&lt;td&gt;${esc(x.inicio)}&lt;/td&gt;&lt;td&gt;${esc(x.fin)}&lt;/td&gt;&lt;/tr&gt;` + &quot;`&quot; + `).join(&quot;&quot;);&lt;\/script&gt;&lt;/body&gt;&lt;/html&gt;`;
  const ventana = open(&quot;&quot;, &quot;_blank&quot;);
  if (!ventana) return mostrarToast(&quot;Permita ventanas emergentes para ver el detalle&quot;);
  ventana.document.write(html);
  ventana.document.close();
}
function renderCiclo() {
  const grupos = {};
  let pendientes = 0;
  let totalValidos = 0;
  (estado.ciclo || []).forEach((registro) =&gt; {
    if (normalizar(valorCampoCiclo(registro, [&quot;Task Status&quot;])).includes(&quot;pending&quot;)) pendientes += 1;
    const inicio = fechaCampoCiclo(valorCampoCiclo(registro, [&quot;Start Date&quot;]));
    const fin = fechaCampoCiclo(valorCampoCiclo(registro, [&quot;Comp Date&quot;]));
    const dias = diasHabilesEntreCiclo(inicio, fin);
    if (dias === null) return;
    const categoria = String(valorCampoCiclo(registro, [&quot;Change Category&quot;]) || &quot;Sin categoría&quot;);
    (grupos[categoria] ||= []).push(dias);
    totalValidos += 1;
  });
  const resumen = Object.entries(grupos).map(([tipo, valores]) =&gt; ({
    tipo,
    promedio: valores.reduce((a, b) =&gt; a + b, 0) / valores.length,
    cantidad: valores.length,
  }));
  if ($(&quot;pendingTasksCount&quot;)) $(&quot;pendingTasksCount&quot;).textContent = pendientes;
  $(&quot;resumenDashboardCiclo&quot;).innerHTML = `&lt;div class=&quot;small-note&quot;&gt;${totalValidos} registros con Start Date y Comp Date válidos&lt;/div&gt;`;
  const max = Math.max(1, ...resumen.map((item) =&gt; item.promedio));
  $(&quot;graficoDashboardCiclo&quot;).innerHTML = resumen.map((item) =&gt;
    `&lt;div class=&quot;dashboard-cycle-row&quot;&gt;&lt;div class=&quot;dashboard-cycle-label&quot;&gt;${escaparHTML(item.tipo)}&lt;/div&gt;&lt;div class=&quot;dashboard-cycle-bar-wrap&quot;&gt;&lt;div class=&quot;dashboard-cycle-bar&quot; style=&quot;width:${(item.promedio / max) * 100}%&quot;&gt;&lt;/div&gt;&lt;/div&gt;&lt;div class=&quot;dashboard-cycle-meta&quot;&gt;${item.promedio.toFixed(1)} días&lt;/div&gt;&lt;/div&gt;`,
  ).join(&quot;&quot;) || `&lt;div class=&quot;empty-state&quot;&gt;Importe datos de ciclo para visualizar resultados.&lt;/div&gt;`;
}

function abrirPantalla(idPantalla) {  
  $(idPantalla).hidden = false;  
}  
function cerrarPantalla(idPantalla) {  
  $(idPantalla).hidden = true;  
}  
 
function abrirManual(manualId = &quot;&quot;) {  
  const manual = estado.manuales.find((m) =&gt; m.id === manualId);  
  $(&quot;manualForm&quot;).reset();  
  $(&quot;manualId&quot;).value = manual?.id || &quot;&quot;;  
  $(&quot;manualFormTitle&quot;).textContent = manual  
    ? &quot;Editar manual&quot;  
    : &quot;Agregar manual&quot;;  
  [  
    &quot;codigo&quot;,  
    &quot;titulo&quot;,  
    &quot;idioma&quot;,  
    &quot;archivoElectronico&quot;,  
    &quot;ocRelacionado&quot;,  
    &quot;prioridad&quot;,  
    &quot;tipo&quot;,  
    &quot;paginas&quot;,  
    &quot;diasEsfuerzo&quot;,  
    &quot;fechaInicio&quot;,  
    &quot;fechaFinalizacion&quot;,  
    &quot;fechaPublicado&quot;,  
    &quot;horasEsfuerzo&quot;,  
  ].forEach((key) =&gt; {  
    const campo = $(`manual${key[0].toUpperCase()}${key.slice(1)}`);  
    if (campo) campo.value = manual?.[key] ?? &quot;&quot;;  
  });  
  $(&quot;manualEstado&quot;).value = manual  
    ? calcularEstadoManual(manual)  
    : &quot;No iniciado&quot;;  
  abrirPantalla(&quot;manualScreen&quot;);  
}  
 
function guardarManualFormulario(evento) {  
  evento.preventDefault();  
  const existenteId = $(&quot;manualId&quot;).value;  
  const datos = {  
    id: existenteId || id(&quot;manual&quot;),  
    codigo: $(&quot;manualCodigo&quot;).value.trim(),  
    titulo: $(&quot;manualTitulo&quot;).value.trim(),  
    idioma: $(&quot;manualIdioma&quot;).value,  
    archivoElectronico: $(&quot;manualArchivoElectronico&quot;).value,  
    ocRelacionado: $(&quot;manualOcRelacionado&quot;).value.trim(),  
    prioridad: $(&quot;manualPrioridad&quot;).value,  
    tipo: $(&quot;manualTipo&quot;).value,  
    paginas: Number($(&quot;manualPaginas&quot;).value || 0),  
    diasEsfuerzo: Number($(&quot;manualDiasEsfuerzo&quot;).value || 0),  
    fechaInicio: $(&quot;manualFechaInicio&quot;).value,  
    fechaFinalizacion: $(&quot;manualFechaFinalizacion&quot;).value,  
    fechaPublicado: $(&quot;manualFechaPublicado&quot;).value,  
    horasEsfuerzo: Number($(&quot;manualHorasEsfuerzo&quot;).value || 0),  
    color:  
      estado.manuales.find((m) =&gt; m.id === existenteId)?.color || &quot;#FF6C0C&quot;,  
  };  
  const indice = estado.manuales.findIndex((m) =&gt; m.id === existenteId);  
  if (indice &gt;= 0) estado.manuales[indice] = datos;  
  else estado.manuales.unshift(datos);  
  guardarEstado(&quot;Manual guardado&quot;);  
  cerrarPantalla(&quot;manualScreen&quot;);  
  renderTodo();  
}  
 
function abrirTramite(tramiteId = &quot;&quot;) {  
  const t = estado.tramites.find((x) =&gt; x.id === tramiteId);  
  $(&quot;tramiteForm&quot;).reset();  
  $(&quot;tramiteId&quot;).value = t?.id || &quot;&quot;;  
  $(&quot;tramiteFormTitle&quot;).textContent = t ? &quot;Editar trámite&quot; : &quot;Nuevo trámite&quot;;  
  const mapa = {  
    Requerimiento: &quot;requerimiento&quot;,  
    Detalle: &quot;detalle&quot;,  
    TipoGestion: &quot;tipoGestion&quot;,
    FechaIngreso: &quot;fechaIngreso&quot;,  
    FechaInicio: &quot;fechaInicio&quot;,  
    ManualActualizar: &quot;manualActualizar&quot;,  
    TemaGeneral: &quot;temaGeneral&quot;,  
    BAAsignado: &quot;baAsignado&quot;,  
    Consultas: &quot;consultas&quot;,  
    RespuestaConsulta: &quot;respuestaConsulta&quot;,  
    JustificacionGestor: &quot;justificacionGestor&quot;,  
    FechaPublicado: &quot;fechaPublicado&quot;,  
    VersionTraducir: &quot;versionTraducir&quot;,  
    JustificacionIngles: &quot;justificacionIngles&quot;,  
    Listo: &quot;listo&quot;,  
  };  
  Object.entries(mapa).forEach(([sufijo, key]) =&gt; {  
    $(`tramite${sufijo}`).value = t?.[key] ?? &quot;&quot;;  
  });  
  abrirPantalla(&quot;tramiteScreen&quot;);  
}  
 
function guardarTramiteFormulario(evento) {  
  evento.preventDefault();  
  const existenteId = $(&quot;tramiteId&quot;).value;  
  const datos = {  
    id: existenteId || id(&quot;tramite&quot;),  
    requerimiento: $(&quot;tramiteRequerimiento&quot;).value.trim(),  
    detalle: $(&quot;tramiteDetalle&quot;).value.trim(),  
    tipoGestion: $(&quot;tramiteTipoGestion&quot;).value,
    fechaIngreso: $(&quot;tramiteFechaIngreso&quot;).value,  
    fechaInicio: $(&quot;tramiteFechaInicio&quot;).value,  
    manualActualizar: $(&quot;tramiteManualActualizar&quot;).value.trim(),  
    temaGeneral: $(&quot;tramiteTemaGeneral&quot;).value.trim(),  
    baAsignado: $(&quot;tramiteBAAsignado&quot;).value.trim(),  
    consultas: $(&quot;tramiteConsultas&quot;).value.trim(),  
    respuestaConsulta: $(&quot;tramiteRespuestaConsulta&quot;).value.trim(),  
    justificacionGestor: $(&quot;tramiteJustificacionGestor&quot;).value,  
    fechaPublicado: $(&quot;tramiteFechaPublicado&quot;).value,  
    versionTraducir: $(&quot;tramiteVersionTraducir&quot;).value,  
    justificacionIngles: $(&quot;tramiteJustificacionIngles&quot;).value,  
    listo: $(&quot;tramiteListo&quot;).value,  
  };  
  const indice = estado.tramites.findIndex((x) =&gt; x.id === existenteId);  
  if (indice &gt;= 0) estado.tramites[indice] = datos;  
  else estado.tramites.unshift(datos);  
  guardarEstado(&quot;Trámite guardado&quot;);  
  cerrarPantalla(&quot;tramiteScreen&quot;);  
  renderTramites();  
}  
 
function calcularHoras(inicio, fin) {  
  if (!inicio || !fin) return 0;  
  const [hi, mi] = inicio.split(&quot;:&quot;).map(Number);  
  const [hf, mf] = fin.split(&quot;:&quot;).map(Number);  
  let minutos = hf * 60 + mf - (hi * 60 + mi);  
  if (minutos &lt; 0) minutos += 1440;  
  return minutos / 60;  
}  
 
function abrirBitacora(registroId = &quot;&quot;, fecha = fechaISOHoy()) {  
  const r = estado.bitacora.find((x) =&gt; x.id === registroId);  
  $(&quot;bitacoraForm&quot;).reset();  
  $(&quot;bitacoraId&quot;).value = r?.id || &quot;&quot;;  
  $(&quot;bitacoraFormTitle&quot;).textContent = r  
    ? &quot;Editar registro de Bitácora&quot;  
    : &quot;Registro de Bitácora&quot;;  
  $(&quot;bitacoraFecha&quot;).value = r?.fecha || fecha;  
  $(&quot;bitacoraManual&quot;).value = r?.manual || &quot;&quot;;  
  $(&quot;bitacoraTipo&quot;).value = r?.tipo || &quot;&quot;;  
  $(&quot;bitacoraHoraInicio&quot;).value = r?.horaInicio || &quot;&quot;;  
  $(&quot;bitacoraHoraFin&quot;).value = r?.horaFin || &quot;&quot;;  
  $(&quot;bitacoraHoras&quot;).value = r?.horas || &quot;&quot;;  
  $(&quot;bitacoraPaginas&quot;).value = r?.paginas || &quot;&quot;;  
  $(&quot;bitacoraDetalle&quot;).value = r?.detalle || &quot;&quot;;  
  abrirPantalla(&quot;bitacoraScreen&quot;);  
}  
 
 
function abrirVersion(versionId = &quot;&quot;) {  
  const v = estado.versiones.find((x) =&gt; x.id === versionId);  
  $(&quot;versionForm&quot;).reset();  
  $(&quot;versionId&quot;).value = v?.id || &quot;&quot;;  
  $(&quot;versionFormTitle&quot;).textContent = v ? &quot;Editar versión&quot; : &quot;Agregar versión&quot;;  
  $(&quot;versionSistema&quot;).value = v?.sistema || &quot;SISCARD&quot;;  
  $(&quot;versionCodigo&quot;).value = v?.codigo || &quot;&quot;;  
  $(&quot;versionManual&quot;).value = v?.manual || &quot;&quot;;  
  $(&quot;versionIdioma&quot;).value = v?.idioma || &quot;Español&quot;;  
  $(&quot;versionNumero&quot;).value = v?.numero || &quot;&quot;;  
  $(&quot;versionUbicacionEService&quot;).value = v?.ubicacionEService || &quot;&quot;;  
  $(&quot;versionFecha&quot;).value = v?.fecha || &quot;&quot;;  
  $(&quot;versionEstado&quot;).value = v?.estado || &quot;Disponible&quot;;  
  $(&quot;versionObservaciones&quot;).value = v?.observaciones || &quot;&quot;;  
  abrirPantalla(&quot;versionScreen&quot;);  
}  
 
function guardarVersionFormulario(evento) {  
  evento.preventDefault();  
  const existenteId = $(&quot;versionId&quot;).value;  
  const datos = {  
    id: existenteId || id(&quot;version&quot;),  
    sistema: $(&quot;versionSistema&quot;).value,  
    codigo: $(&quot;versionCodigo&quot;).value.trim(),  
    manual: $(&quot;versionManual&quot;).value.trim(),  
    idioma: $(&quot;versionIdioma&quot;).value,  
    numero: $(&quot;versionNumero&quot;).value.trim(),  
    ubicacionEService: $(&quot;versionUbicacionEService&quot;).value.trim(),  
    fecha: $(&quot;versionFecha&quot;).value,  
    estado: $(&quot;versionEstado&quot;).value,  
    observaciones: $(&quot;versionObservaciones&quot;).value.trim(),  
  };  
  const indice = estado.versiones.findIndex((x) =&gt; x.id === existenteId);  
  if (indice &gt;= 0) estado.versiones[indice] = datos;  
  else estado.versiones.unshift(datos);  
  guardarEstado(&quot;Versión guardada&quot;);  
  cerrarPantalla(&quot;versionScreen&quot;);  
  renderVersiones();  
}  
 
 
 
function abrirColumnas(tipo) {  
  const esManual = tipo === &quot;manuales&quot;;  
  const panel = $(esManual ? &quot;columnsPanelManuales&quot; : &quot;columnsPanelTramites&quot;);  
  const lista = $(esManual ? &quot;columnsListManuales&quot; : &quot;columnsListTramites&quot;);  
  const columnas = esManual ? COLUMNAS_MANUALES : COLUMNAS_TRAMITES;  
  const ocultas = esManual  
    ? estado.columnasOcultasManuales  
    : estado.columnasOcultasTramites;  
  lista.innerHTML = columnas  
    .filter((c) =&gt; !c.especial)  
    .map(  
      (c) =&gt;  
        `&lt;label&gt;&lt;input type=&quot;checkbox&quot; data-columna=&quot;${c.key}&quot; ${!ocultas.includes(c.key) ? &quot;checked&quot; : &quot;&quot;}&gt;${escaparHTML(c.label)}&lt;/label&gt;`,  
    )  
    .join(&quot;&quot;);  
  lista.querySelectorAll(&quot;input&quot;).forEach((input) =&gt;  
    input.addEventListener(&quot;change&quot;, () =&gt; {  
      const destino = esManual  
        ? estado.columnasOcultasManuales  
        : estado.columnasOcultasTramites;  
      if (input.checked)  
        estado[  
          esManual ? &quot;columnasOcultasManuales&quot; : &quot;columnasOcultasTramites&quot;  
        ] = destino.filter((x) =&gt; x !== input.dataset.columna);  
      else if (!destino.includes(input.dataset.columna))  
        destino.push(input.dataset.columna);  
      guardarEstado(&quot;&quot;);  
      esManual ? renderManuales() : renderTramites();  
    }),  
  );  
  panel.hidden = false;  
}  
 
function descargar(nombre, contenido, tipo = &quot;text/plain;charset=utf-8&quot;) {  
  const blob = new Blob([contenido], { type: tipo });  
  const enlace = document.createElement(&quot;a&quot;);  
  enlace.href = URL.createObjectURL(blob);  
  enlace.download = nombre;  
  enlace.click();  
  URL.revokeObjectURL(enlace.href);  
}  
 
function exportarCSV(tipo) {  
  const columnas =  
    tipo === &quot;manuales&quot;  
      ? COLUMNAS_MANUALES  
      : tipo === &quot;tramites&quot;  
        ? COLUMNAS_TRAMITES  
        : COLUMNAS_VERSIONES;  
  const utiles = columnas.filter((c) =&gt; !c.especial &amp;&amp; !c.calculado);  
  const filas = [  
    utiles.map((c) =&gt; c.label),  
    ...estado[tipo].map((item) =&gt; utiles.map((c) =&gt; item[c.key] ?? &quot;&quot;)),  
  ];  
  descargar(  
    `${tipo}.csv`,  
    filas  
      .map((fila) =&gt;  
        fila.map((v) =&gt; `&quot;${String(v).replaceAll(&#x27;&quot;&#x27;, &#x27;&quot;&quot;&#x27;)}&quot;`).join(&quot;,&quot;),  
      )  
      .join(&quot;\n&quot;),  
    &quot;text/csv;charset=utf-8&quot;,  
  );  
}  
 
function exportarTramitesExcel() { 
 
    const columnas = COLUMNAS_TRAMITES 
        .filter((c) =&gt; !c.especial); 
 
    const datos = estado.tramites.map(tramite =&gt; { 
 
        const fila = {}; 
 
        columnas.forEach(columna =&gt; { 
 
            fila[columna.label] = 
                valorVisible(tramite, columna); 
 
        }); 
 
        return fila; 
 
    }); 
 
    const hoja = XLSX.utils.json_to_sheet(datos); 
 
    const libro = XLSX.utils.book_new(); 
 
    XLSX.utils.book_append_sheet( 
        libro, 
        hoja, 
        &quot;Tramites&quot; 
    ); 
 
    XLSX.writeFile( 
        libro, 
        &quot;Tramites_Requerimientos.xlsx&quot; 
    ); 
 
} 
 
function exportarVersionesExcel() { 
  try { 
    if (typeof XLSX === &quot;undefined&quot;) { 
      throw new Error(&quot;No se cargó la librería de Excel&quot;); 
    } 
 
    const columnas = COLUMNAS_VERSIONES.filter( 
      (columna) =&gt; !columna.especial &amp;&amp; !columna.calculado, 
    ); 
    const datos = estado.versiones.map((version) =&gt; { 
      const fila = {}; 
      columnas.forEach((columna) =&gt; { 
        fila[columna.label] = version[columna.key] ?? &quot;&quot;; 
      }); 
      return fila; 
    }); 
    const hoja = XLSX.utils.json_to_sheet(datos); 
    const libro = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(libro, hoja, &quot;ControlVersiones&quot;); 
    XLSX.writeFile( 
      libro, 
      `Control_Versiones_${fechaISOHoy()}.xlsx`, 
    ); 
    mostrarToast(&quot;Control de Versiones exportado a Excel&quot;); 
  } catch (error) { 
    console.error(&quot;No fue posible exportar Control de Versiones.&quot;, error); 
    mostrarToast(`No fue posible exportar Excel: ${error.message}`); 
  } 
} 
 
 
 

function ajustarHojaReporte(hoja, datos) {
  const filas = Array.isArray(datos) ? datos : [];
  const encabezados = filas.length ? Object.keys(filas[0]) : [];
  hoja[&quot;!cols&quot;] = encabezados.map((encabezado) =&gt; {
    const maximo = Math.max(
      String(encabezado).length,
      ...filas.map((fila) =&gt; String(fila[encabezado] ?? &quot;&quot;).length),
    );
    return { wch: Math.min(Math.max(maximo + 2, 12), 45) };
  });
  if (hoja[&quot;!ref&quot;]) hoja[&quot;!autofilter&quot;] = { ref: hoja[&quot;!ref&quot;] };
}

function agregarHojaReporte(libro, nombre, datos) {
  const filas = datos.length ? datos : [{ Información: &quot;Sin registros&quot; }];
  const hoja = XLSX.utils.json_to_sheet(filas);
  ajustarHojaReporte(hoja, filas);
  XLSX.utils.book_append_sheet(libro, hoja, nombre);
}

function generarReporteCompletoExcel() {
  try {
    if (typeof XLSX === &quot;undefined&quot;) {
      throw new Error(&quot;No se cargó la librería de Excel&quot;);
    }

    const libro = XLSX.utils.book_new();
    const manuales = (estado.manuales || []).map((manual, indice) =&gt; ({
      &quot;#&quot;: indice + 1,
      Código: manual.codigo ?? &quot;&quot;,
      Título: manual.titulo ?? &quot;&quot;,
      Idioma: manual.idioma ?? &quot;&quot;,
      &quot;Archivo electrónico&quot;: manual.archivoElectronico ?? &quot;&quot;,
      &quot;OC relacionado&quot;: manual.ocRelacionado ?? &quot;&quot;,
      Prioridad: manual.prioridad ?? &quot;&quot;,
      Tipo: manual.tipo ?? &quot;&quot;,
      Páginas: Number(manual.paginas || 0),
      &quot;Días esfuerzo&quot;: Number(manual.diasEsfuerzo || 0),
      &quot;Horas esfuerzo&quot;: Number(manual.horasEsfuerzo || 0),
      &quot;Tiempo invertido&quot;: Number(horasBitacoraManual(manual).toFixed(2)),
      &quot;Fecha inicio&quot;: manual.fechaInicio ?? &quot;&quot;,
      &quot;Fecha finalización&quot;: manual.fechaFinalizacion ?? &quot;&quot;,
      &quot;Fecha publicado&quot;: manual.fechaPublicado ?? &quot;&quot;,
      Estado: calcularEstadoManual(manual),
    }));

    const calendario = (estado.manuales || []).map((manual) =&gt; ({
      Código: manual.codigo ?? &quot;&quot;,
      Manual: manual.titulo ?? &quot;&quot;,
      Tipo: manual.tipo ?? &quot;&quot;,
      &quot;Fecha inicio&quot;: manual.fechaInicio ?? &quot;&quot;,
      &quot;Fecha finalización&quot;: manual.fechaFinalizacion ?? &quot;&quot;,
      &quot;Fecha publicación&quot;: manual.fechaPublicado ?? &quot;&quot;,
      Estado: calcularEstadoManual(manual),
      &quot;Horas registradas&quot;: Number(horasBitacoraManual(manual).toFixed(2)),
    }));

    const bitacora = (estado.bitacora || []).map((registro) =&gt; ({
      Fecha: registro.fecha ?? &quot;&quot;,
      Manual: registro.manual ?? &quot;&quot;,
      Tipo: registro.tipo ?? &quot;&quot;,
      &quot;Hora inicio&quot;: registro.horaInicio ?? &quot;&quot;,
      &quot;Hora fin&quot;: registro.horaFin ?? &quot;&quot;,
      Horas: Number(registro.horas || 0),
      Páginas: Number(registro.paginas || 0),
      &quot;Datos adicionales&quot;: registro.detalle ?? &quot;&quot;,
    }));

    const totalHoras = (estado.bitacora || []).reduce(
      (total, registro) =&gt; total + Number(registro.horas || 0),
      0,
    );
    const dashboard = [
      { Indicador: &quot;Total de manuales&quot;, Valor: (estado.manuales || []).length },
      {
        Indicador: &quot;Publicados&quot;,
        Valor: (estado.manuales || []).filter(
          (manual) =&gt; calcularEstadoManual(manual) === &quot;Publicado&quot;,
        ).length,
      },
      {
        Indicador: &quot;En proceso&quot;,
        Valor: (estado.manuales || []).filter(
          (manual) =&gt; calcularEstadoManual(manual) === &quot;En proceso&quot;,
        ).length,
      },
      {
        Indicador: &quot;Prioridad alta&quot;,
        Valor: (estado.manuales || []).filter(
          (manual) =&gt; manual.prioridad === &quot;Alta&quot;,
        ).length,
      },
      { Indicador: &quot;Horas registradas&quot;, Valor: Number(totalHoras.toFixed(2)) },
      ...[&quot;N&quot;, &quot;T&quot;, &quot;A&quot;, &quot;R&quot;].map((tipo) =&gt; ({
        Indicador: `Horas tipo ${tipo}`,
        Valor: Number(
          (estado.bitacora || [])
            .filter((registro) =&gt; registro.tipo === tipo)
            .reduce((total, registro) =&gt; total + Number(registro.horas || 0), 0)
            .toFixed(2),
        ),
      })),
    ];

    const tramites = (estado.tramites || []).map((tramite) =&gt; {
      const fila = {};
      COLUMNAS_TRAMITES.filter((columna) =&gt; !columna.especial).forEach((columna) =&gt; {
        fila[columna.label] = valorVisible(tramite, columna);
      });
      return fila;
    });

    const versiones = (estado.versiones || []).map((version) =&gt; {
      const fila = {};
      COLUMNAS_VERSIONES.filter(
        (columna) =&gt; !columna.especial &amp;&amp; !columna.calculado,
      ).forEach((columna) =&gt; {
        fila[columna.label] = version[columna.key] ?? &quot;&quot;;
      });
      return fila;
    });

    agregarHojaReporte(libro, &quot;Avance Manuales&quot;, manuales);
    agregarHojaReporte(libro, &quot;Calendario&quot;, calendario);
    agregarHojaReporte(libro, &quot;Bitácora&quot;, bitacora);
    agregarHojaReporte(libro, &quot;Dashboard&quot;, dashboard);
    agregarHojaReporte(libro, &quot;Trámites&quot;, tramites);
    agregarHojaReporte(libro, &quot;Control Versiones&quot;, versiones);

    XLSX.writeFile(libro, `Reporte_KIRIS_${fechaISOHoy()}.xlsx`);
    mostrarToast(&quot;Reporte completo de KIRIS generado&quot;);
  } catch (error) {
    console.error(&quot;No fue posible generar el reporte completo.&quot;, error);
    mostrarToast(`No fue posible generar el reporte: ${error.message}`);
  }
}

function configurarCalendarios() {  
  $(&quot;btnCalendarioAnterior&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    fechaCalendario.setMonth(fechaCalendario.getMonth() - 1);  
    renderCalendario();  
  });  
  $(&quot;btnCalendarioSiguiente&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    fechaCalendario.setMonth(fechaCalendario.getMonth() + 1);  
    renderCalendario();  
  });  
  $(&quot;btnCalendarioHoy&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    fechaCalendario = new Date();  
    renderCalendario();  
  });  
  $(&quot;selectorMesCalendario&quot;).addEventListener(&quot;change&quot;, (e) =&gt; {  
    fechaCalendario.setMonth(Number(e.target.value));  
    renderCalendario();  
  });  
  $(&quot;selectorAnioCalendario&quot;).addEventListener(&quot;change&quot;, (e) =&gt; {  
    fechaCalendario.setFullYear(Number(e.target.value));  
    renderCalendario();  
  });  
  $(&quot;btnBitacoraAnterior&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    fechaBitacora.setMonth(fechaBitacora.getMonth() - 1);  
    renderBitacora();  
  });  
  $(&quot;btnBitacoraSiguiente&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    fechaBitacora.setMonth(fechaBitacora.getMonth() + 1);  
    renderBitacora();  
  });  
  $(&quot;selectorMesBitacora&quot;).addEventListener(&quot;change&quot;, (e) =&gt; {  
    fechaBitacora.setMonth(Number(e.target.value));  
    renderBitacora();  
  });  
  $(&quot;selectorAnioBitacora&quot;).addEventListener(&quot;change&quot;, (e) =&gt; {  
    fechaBitacora.setFullYear(Number(e.target.value));  
    renderBitacora();  
  });  
  $(&quot;btnDashboardMesAnterior&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    fechaDashboard.setMonth(fechaDashboard.getMonth() - 1);  
    renderDashboard();  
  });  
  $(&quot;btnDashboardMesSiguiente&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    fechaDashboard.setMonth(fechaDashboard.getMonth() + 1);  
    renderDashboard();  
  });  
  $(&quot;selectorMesDashboard&quot;).addEventListener(&quot;change&quot;, (e) =&gt; {  
    fechaDashboard.setMonth(Number(e.target.value));  
    renderDashboard();  
  });  
  $(&quot;selectorAnioDashboard&quot;).addEventListener(&quot;change&quot;, (e) =&gt; {  
    fechaDashboard.setFullYear(Number(e.target.value));  
    renderDashboard();  
  });  
}  
 
function configurarComentarios() {  
  $(&quot;feedbackFloatingBtn&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    $(&quot;feedbackPanel&quot;).hidden = !$(&quot;feedbackPanel&quot;).hidden;  
    renderComentarios();  
  });  
  $(&quot;btnCerrarFeedback&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    $(&quot;feedbackPanel&quot;).hidden = true;  
  });  
  $(&quot;feedbackForm&quot;).addEventListener(&quot;submit&quot;, (e) =&gt; {  
    e.preventDefault();  
    estado.comentarios.unshift({  
      id: id(&quot;comentario&quot;),  
      nombre: $(&quot;feedbackNombre&quot;).value.trim(),  
      seccion: $(&quot;feedbackSeccion&quot;).value,  
      comentario: $(&quot;feedbackComentario&quot;).value.trim(),  
      fecha: new Date().toISOString(),  
    });  
    guardarEstado(&quot;Comentario guardado&quot;);  
    e.target.reset();  
    renderComentarios();  
  });  
}  
 
function renderComentarios() {  
  $(&quot;feedbackList&quot;).innerHTML =  
    estado.comentarios  
      .map(  
        (c) =&gt;  
          `&lt;article class=&quot;feedback-card&quot;&gt;&lt;div class=&quot;feedback-card-title&quot;&gt;${escaparHTML(c.seccion)}&lt;/div&gt;&lt;div class=&quot;feedback-card-meta&quot;&gt;${escaparHTML(c.nombre)} · ${new Date(c.fecha).toLocaleString(&quot;es-CR&quot;)}&lt;/div&gt;&lt;div&gt;${escaparHTML(c.comentario)}&lt;/div&gt;&lt;/article&gt;`,  
      )  
      .join(&quot;&quot;) || `&lt;div class=&quot;empty-state&quot;&gt;Sin comentarios.&lt;/div&gt;`;  
}  
 
function configurarFormularios() {  
  $(&quot;manualForm&quot;).addEventListener(&quot;submit&quot;, guardarManualFormulario);  
  $(&quot;tramiteForm&quot;).addEventListener(&quot;submit&quot;, guardarTramiteFormulario);  
  $(&quot;bitacoraForm&quot;).addEventListener(&quot;submit&quot;, guardarBitacoraFormulario);  
  $(&quot;versionForm&quot;).addEventListener(&quot;submit&quot;, guardarVersionFormulario);  
  [  
    [&quot;btnCerrarManual&quot;, &quot;manualScreen&quot;],  
    [&quot;btnCancelarManual&quot;, &quot;manualScreen&quot;],  
    [&quot;btnCerrarTramite&quot;, &quot;tramiteScreen&quot;],  
    [&quot;btnCancelarTramite&quot;, &quot;tramiteScreen&quot;],  
    [&quot;btnCerrarBitacora&quot;, &quot;bitacoraScreen&quot;],  
    [&quot;btnCancelarBitacora&quot;, &quot;bitacoraScreen&quot;],  
    [&quot;btnCerrarVersion&quot;, &quot;versionScreen&quot;],  
    [&quot;btnCancelarVersion&quot;, &quot;versionScreen&quot;],  
  ].forEach(([boton, pantalla]) =&gt;  
    $(boton).addEventListener(&quot;click&quot;, () =&gt; cerrarPantalla(pantalla)),  
  );  
  [&quot;bitacoraHoraInicio&quot;, &quot;bitacoraHoraFin&quot;].forEach((campo) =&gt;  
    $(campo).addEventListener(&quot;change&quot;, () =&gt; {  
      $(&quot;bitacoraHoras&quot;).value = calcularHoras(  
        $(&quot;bitacoraHoraInicio&quot;).value,  
        $(&quot;bitacoraHoraFin&quot;).value,  
      ).toFixed(2);  
    }),  
  );  
  $(&quot;bitacoraManual&quot;).addEventListener(&quot;change&quot;, () =&gt; {  
    const m = estado.manuales.find(  
      (x) =&gt;  
        x.titulo === $(&quot;bitacoraManual&quot;).value ||  
        x.codigo === $(&quot;bitacoraManual&quot;).value,  
    );  
    $(&quot;bitacoraTipo&quot;).value = m?.tipo || &quot;&quot;;  
  });  
}  
 
function parsearCSV(texto) {  
  const filas = [];  
  let fila = [],  
    campo = &quot;&quot;,  
    comillas = false;  
  for (let i = 0; i &lt; texto.length; i++) {  
    const ch = texto[i],  
      sig = texto[i + 1];  
    if (ch === &#x27;&quot;&#x27; &amp;&amp; comillas &amp;&amp; sig === &#x27;&quot;&#x27;) {  
      campo += &#x27;&quot;&#x27;;  
      i++;  
    } else if (ch === &#x27;&quot;&#x27;) {  
      comillas = !comillas;  
    } else if (ch === &quot;,&quot; &amp;&amp; !comillas) {  
      fila.push(campo);  
      campo = &quot;&quot;;  
    } else if ((ch === &quot;\n&quot; || ch === &quot;\r&quot;) &amp;&amp; !comillas) {  
      if (ch === &quot;\r&quot; &amp;&amp; sig === &quot;\n&quot;) i++;  
      fila.push(campo);  
      if (fila.some((v) =&gt; String(v).trim() !== &quot;&quot;)) filas.push(fila);  
      fila = [];  
      campo = &quot;&quot;;  
    } else {  
      campo += ch;  
    }  
  }  
  fila.push(campo);  
  if (fila.some((v) =&gt; String(v).trim() !== &quot;&quot;)) filas.push(fila);  
  return filas;  
}  
function normalizarEncabezado(v) {  
  return normalizar(v).replace(/[^a-z0-9]/g, &quot;&quot;);  
}  
async function importarCSV(tipo, archivo) {  
  if (!archivo) return;  
  try {  
    const matriz = parsearCSV(await archivo.text());  
    if (matriz.length &lt; 2) throw new Error(&quot;El archivo no contiene registros&quot;);  
    const columnas =  
      tipo === &quot;manuales&quot;  
        ? COLUMNAS_MANUALES  
        : tipo === &quot;tramites&quot;  
          ? COLUMNAS_TRAMITES  
          : COLUMNAS_VERSIONES;  
    const utiles = columnas.filter((c) =&gt; !c.especial &amp;&amp; !c.calculado),  
      headers = matriz[0].map(normalizarEncabezado);  
    const nuevos = matriz  
      .slice(1)  
      .map((fila) =&gt; {  
        const obj = { id: id(tipo.slice(0, -1)) };  
        utiles.forEach((c) =&gt; {  
          const ix = headers.findIndex(  
            (h) =&gt;  
              h === normalizarEncabezado(c.label) ||  
              h === normalizarEncabezado(c.key),  
          );  
          let v = ix &gt;= 0 ? (fila[ix] ?? &quot;&quot;) : &quot;&quot;;  
          if (c.tipo === &quot;number&quot;) v = Number(v || 0);  
          obj[c.key] = v;  
        });  
       if (!obj.id) { 
    obj.id = id(tipo.slice(0, -1)); 
} 
        return obj;  
      })  
      .filter((o) =&gt; utiles.some((c) =&gt; String(o[c.key] ?? &quot;&quot;).trim() !== &quot;&quot;));  
    if (!nuevos.length) throw new Error(&quot;No se encontraron filas válidas&quot;);  
    if (  
      confirm(  
        `¿Reemplazar los registros de ${tipo}?\nAceptar = reemplazar. Cancelar = agregar.`,  
      )  
    )  
      estado[tipo] = nuevos;  
    else estado[tipo].push(...nuevos);  
    guardarEstado(`${nuevos.length} registro(s) importado(s)`);  
    renderTodo();  
  } catch (error) {  
    console.error(error);  
    mostrarToast(`No fue posible importar: ${error.message}`);  
  }  
}  
function exportarRespaldoCompleto() {  
  const respaldo = {  
    tipo: &quot;KIRIS_V2_RESPALDO_COMPLETO&quot;,  
    version: 2,  
    fechaExportacion: new Date().toISOString(),  
    datos: {  
      manuales: estado.manuales || [],  
      calendario: estado.manuales || [],  
      bitacora: estado.bitacora || [],  
      dashboardProduccion: estado.ciclo || [],  
      tramites: estado.tramites || [],  
      controlVersiones: estado.versiones || [],  
      comentarios: estado.comentarios || [],  
      configuracion: {  
        ultimaCopia: estado.ultimaCopia || &quot;&quot;,  
        columnasOcultasManuales: estado.columnasOcultasManuales || [],  
        columnasOcultasTramites: estado.columnasOcultasTramites || [],  
        anchosManuales: estado.anchosManuales || {},  
        anchosTramites: estado.anchosTramites || {},  
        anchosVersiones: estado.anchosVersiones || {},  
      },  
    },  
  };  
  descargar(  
    `KIRIS_RESPALDO_COMPLETO_${fechaISOHoy()}.json`,  
    JSON.stringify(respaldo, null, 2),  
    &quot;application/json;charset=utf-8&quot;,  
  );  
  mostrarToast(&quot;Copia de seguridad completa generada&quot;);  
}  
async function importarRespaldoCompleto(archivo) {  
  if (!archivo) return;  
  try {  
    const respaldo = JSON.parse(await archivo.text());  
    const origen =  
      respaldo?.tipo === &quot;KIRIS_V2_RESPALDO_COMPLETO&quot;  
        ? respaldo.datos  
        : respaldo;  
    if (!origen || typeof origen !== &quot;object&quot;) throw new Error(&quot;JSON inválido&quot;);  
    if (!confirm(&quot;¿Reemplazar toda la información actual con este respaldo?&quot;))  
      return;  
    const config = origen.configuracion || {};  
    estado = {  
      ...estadoInicial(),  
      manuales: origen.manuales || origen.calendario || [],  
      bitacora: origen.bitacora || [],  
      ciclo: origen.dashboardProduccion || origen.ciclo || [],  
      tramites: origen.tramites || [],  
      versiones: origen.controlVersiones || origen.versiones || [],  
      comentarios: origen.comentarios || [],  
      ultimaCopia: config.ultimaCopia || origen.ultimaCopia || &quot;&quot;,  
      columnasOcultasManuales:  
        config.columnasOcultasManuales || origen.columnasOcultasManuales || [],  
      columnasOcultasTramites:  
        config.columnasOcultasTramites || origen.columnasOcultasTramites || [],  
      anchosManuales: config.anchosManuales || origen.anchosManuales || {},  
      anchosTramites: config.anchosTramites || origen.anchosTramites || {},  
      anchosVersiones: config.anchosVersiones || origen.anchosVersiones || {},  
      modo: &quot;editor&quot;,  
    };  
    editorActivo = true;  
    guardarEstado(&quot;Respaldo completo restaurado&quot;);  
    renderTodo();  
  } catch (error) {  
    console.error(error);  
    mostrarToast(`No fue posible restaurar: ${error.message}`);  
  }  
}  
function crearPaquetePublicado() {
  return {
    version: 1,
    fechaPublicacion: new Date().toISOString(),
    manuales: estado.manuales,
    bitacora: estado.bitacora,
    tramites: estado.tramites,
    versiones: estado.versiones,
    ciclo: estado.ciclo,
  };
}

async function guardarYPublicarCambios() {
  const boton = $(&quot;btnGuardarNube&quot;);
  const textoOriginal = boton?.textContent || &quot;💾 Guardar y publicar&quot;;

  try {
    if (boton) {
      boton.disabled = true;
      boton.textContent = &quot;Guardando y publicando...&quot;;
    }

    guardarEstado(&quot;&quot;);

    if (!window.KirisStorage?.publicar) {
      throw new Error(&quot;El módulo storage.js no está disponible&quot;);
    }

    const paquete = crearPaquetePublicado();
    await window.KirisStorage.publicar(paquete);
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(paquete));
    mostrarToast(&quot;Información guardada y publicada en el visor&quot;);
  } catch (error) {
    console.error(error);
    mostrarToast(error.message || &quot;No fue posible guardar y publicar&quot;);
  } finally {
    if (boton) {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  }
}

function configurarBotones() {  
  $(&quot;btnAgregarManual&quot;).addEventListener(&quot;click&quot;, () =&gt; abrirManual());  
  $(&quot;btnAgregarTramite&quot;).addEventListener(&quot;click&quot;, () =&gt; abrirTramite());  
  $(&quot;btnAgregarVersion&quot;).addEventListener(&quot;click&quot;, () =&gt; abrirVersion());  
  $(&quot;btnEliminarManuales&quot;).addEventListener(&quot;click&quot;, () =&gt;  
    eliminarSeleccionados(&quot;manuales&quot;),  
  );  
  $(&quot;btnEliminarTramites&quot;).addEventListener(&quot;click&quot;, () =&gt;  
    eliminarSeleccionados(&quot;tramites&quot;),  
  );  
  $(&quot;btnEliminarVersiones&quot;).addEventListener(&quot;click&quot;, () =&gt;  
    eliminarSeleccionados(&quot;versiones&quot;),  
  );  
  $(&quot;btnLimpiarFiltrosManuales&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    filtros.manuales = {};  
    guardarVistaUsuario();
    renderManuales();  
  });  
  $(&quot;btnLimpiarFiltrosTramites&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    filtros.tramites = {};  
    guardarVistaUsuario();
    renderTramites();  
  });  
  $(&quot;btnLimpiarFiltrosVersiones&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    filtros.versiones = {};  
    guardarVistaUsuario();
    renderVersiones();  
  });  
  $(&quot;btnExportarManuales&quot;).addEventListener(&quot;click&quot;, () =&gt;  
    exportarCSV(&quot;manuales&quot;),  
  );  
$(&quot;btnExportarTramites&quot;).addEventListener( 
    &quot;click&quot;, 
    exportarTramitesExcel 
); 
  $(&quot;btnExportarVersiones&quot;).addEventListener( 
    &quot;click&quot;, 
    exportarVersionesExcel, 
  ); 
  $(&quot;btnColumnasManuales&quot;).addEventListener(&quot;click&quot;, () =&gt;  
    abrirColumnas(&quot;manuales&quot;),  
  );  
  $(&quot;btnColumnasTramites&quot;).addEventListener(&quot;click&quot;, () =&gt;  
    abrirColumnas(&quot;tramites&quot;),  
  );  
  $(&quot;btnCerrarColumnasManuales&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    $(&quot;columnsPanelManuales&quot;).hidden = true;  
  });  
  $(&quot;btnCerrarColumnasTramites&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    $(&quot;columnsPanelTramites&quot;).hidden = true;  
  });  
  $(&quot;btnMostrarTodasManuales&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    estado.columnasOcultasManuales = [];  
    guardarEstado(&quot;&quot;);  
    renderManuales();  
    abrirColumnas(&quot;manuales&quot;);  
  });  
  $(&quot;btnMostrarTodasTramites&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    estado.columnasOcultasTramites = [];  
    guardarEstado(&quot;&quot;);  
    renderTramites();  
    abrirColumnas(&quot;tramites&quot;);  
  });
  $(&quot;btnGuardarNube&quot;).addEventListener(&quot;click&quot;, guardarYPublicarCambios);
  $(&quot;btnGenerarReporte&quot;)?.addEventListener(
    &quot;click&quot;,
    generarReporteCompletoExcel,
  );
  
  $(&quot;btnPantallaCompleta&quot;).addEventListener(&quot;click&quot;, () =&gt; {  
    const panel = $(&quot;panelManuales&quot;);  
    if (!document.fullscreenElement) panel.requestFullscreen?.();  
    else document.exitFullscreen?.();  
  });  
  $(&quot;btnExportarDashboard&quot;).addEventListener(&quot;click&quot;, () =&gt;  
    descargar(  
      &quot;dashboard_kiris.json&quot;,  
      JSON.stringify(  
        {  
          manuales: estado.manuales,  
          bitacora: estado.bitacora,  
          ciclo: estado.ciclo,  
        },  
        null,  
        2,  
      ),  
      &quot;application/json&quot;,  
    ),  
  );  
  $(&quot;btnVerDetalleCiclo&quot;).addEventListener(&quot;click&quot;, abrirDetalleProduccion);  
 
  $(&quot;btnAgregarBitacora&quot;)?.addEventListener(&quot;click&quot;, () =&gt; abrirBitacora());  
  $(&quot;btnImportarManuales&quot;)?.addEventListener(&quot;click&quot;, () =&gt;  
    $(&quot;inputExcelManuales&quot;).click(),  
  );  
  $(&quot;btnImportarTramites&quot;)?.addEventListener(&quot;click&quot;, () =&gt;  
    $(&quot;inputExcelTramites&quot;).click(),  
  );  
  $(&quot;btnImportarVersiones&quot;)?.addEventListener(&quot;click&quot;, () =&gt;  
    $(&quot;inputExcelVersiones&quot;).click(),  
  );  
  $(&quot;inputExcelManuales&quot;)?.addEventListener(&quot;change&quot;, (e) =&gt;  
    importarCSV(&quot;manuales&quot;, e.target.files[0]).finally(  
      () =&gt; (e.target.value = &quot;&quot;),  
    ),  
  );  
  $(&quot;inputExcelTramites&quot;)?.addEventListener(&quot;change&quot;, (e) =&gt;  
    importarCSV(&quot;tramites&quot;, e.target.files[0]).finally(  
      () =&gt; (e.target.value = &quot;&quot;),  
    ),  
  );  
  $(&quot;inputExcelVersiones&quot;)?.addEventListener(&quot;change&quot;, (e) =&gt;  
    importarControlVersionesXLSX(e.target.files[0]).finally(  
      () =&gt; (e.target.value = &quot;&quot;),  
    ),  
  );  
  $(&quot;btnExportarRespaldo&quot;)?.addEventListener(&quot;click&quot;, exportarRespaldoCompleto);  
  $(&quot;btnImportarRespaldo&quot;)?.addEventListener(&quot;click&quot;, () =&gt;  
    $(&quot;inputRespaldoCompleto&quot;).click(),  
  );  
  $(&quot;inputRespaldoCompleto&quot;)?.addEventListener(&quot;change&quot;, (e) =&gt;  
    importarRespaldoCompleto(e.target.files[0]).finally(  
      () =&gt; (e.target.value = &quot;&quot;),  
    ),  
  );  
}  
 
function renderTodo() {  
  actualizarEstadoGuardado();  
  poblarDatalists();  
  renderManuales();  
  renderCalendario();  
  renderBitacora();  
  renderDashboard();  
  renderTramites();  
  renderVersiones();  
}  
 
async function inicializar() {
  estado = await cargarEstado();
  normalizarTramitesCargados();
  configurarLogin();
  configurarTabs();
  configurarCalendarios();
  configurarFormularios();
  configurarBotones();
  actualizarEstadoGuardado();
}  
 
document.addEventListener(&quot;DOMContentLoaded&quot;, inicializar);  
 
/* ===== KIRIS V3: mejoras funcionales solicitadas ===== */  
let eliminacionPendiente = null;  
function renderEntidad(tipo) {
  if (tipo === &quot;manuales&quot;) renderManuales();
  else if (tipo === &quot;tramites&quot;) renderTramites();
  else if (tipo === &quot;bitacora&quot;) renderTodo();
  else renderVersiones();
}  
function mostrarDeshacerEliminacion(tipo, eliminados, indices) {  
  document.getElementById(&quot;undoToastKiris&quot;)?.remove();  
  const t = document.createElement(&quot;div&quot;);  
  t.id = &quot;undoToastKiris&quot;;  
  t.className = &quot;undo-toast&quot;;  
  t.innerHTML = `&lt;span&gt;${eliminados.length} registro(s) eliminado(s)&lt;/span&gt;&lt;button type=&quot;button&quot;&gt;↩ Deshacer eliminación&lt;/button&gt;&lt;div class=&quot;undo-progress&quot;&gt;&lt;/div&gt;`;  
  document.body.appendChild(t);  
  const token = Date.now();  
  eliminacionPendiente = { token, tipo, eliminados, indices };  
  t.querySelector(&quot;button&quot;).onclick = () =&gt; {  
    if (!eliminacionPendiente || eliminacionPendiente.token !== token) return;  
    const lista = estado[tipo];  
    eliminados.forEach((item, i) =&gt; lista.splice(indices[i], 0, item));  
    eliminacionPendiente = null;  
    guardarEstado(&quot;&quot;);  
    renderEntidad(tipo);  
    t.remove();  
    mostrarToast(&quot;Eliminación deshecha&quot;);  
  };  
  setTimeout(() =&gt; {  
    if (eliminacionPendiente?.token === token) eliminacionPendiente = null;  
    t.remove();  
  }, 5000);  
}  
function eliminarSeleccionados(tipo) {  
  const singular =  
    tipo === &quot;manuales&quot;  
      ? &quot;manual&quot;  
      : tipo === &quot;tramites&quot;  
        ? &quot;tramite&quot;  
        : &quot;version&quot;;  
  const ids = [  
    ...document.querySelectorAll(`.seleccion-${singular}:checked`),  
  ].map((c) =&gt; c.dataset.id);  
  if (!ids.length) return mostrarToast(&quot;No hay registros seleccionados&quot;);  
  if (  
    !confirm(  
      `¿Eliminar ${ids.length} registro(s)? Podrá deshacerse durante 5 segundos.`,  
    )  
  )  
    return;  
  const indices = [],  
    eliminados = [];  
  estado[tipo].forEach((x, i) =&gt; {  
    if (ids.includes(x.id)) {  
      indices.push(i);  
      eliminados.push({ ...x });  
    }  
  });  
  estado[tipo] = estado[tipo].filter((x) =&gt; !ids.includes(x.id));  
  guardarEstado(&quot;&quot;);  
  renderEntidad(tipo);  
  mostrarDeshacerEliminacion(tipo, eliminados, indices);  
}  
 
/* Filtros combinados: escritura manual + casillas estilo Excel */  
let filtroMenuActivo = null;  
function valoresUnicos(tipo, columna) {  
  const cols =  
    tipo === &quot;manuales&quot;  
      ? COLUMNAS_MANUALES  
      : tipo === &quot;tramites&quot;  
        ? COLUMNAS_TRAMITES  
        : COLUMNAS_VERSIONES;  
  return [  
    ...new Set(  
      estado[tipo].map(  
        (o) =&gt; String(valorVisible(o, columna) ?? &quot;&quot;).trim() || &quot;(Vacío)&quot;,  
      ),  
    ),  
  ].sort((a, b) =&gt;  
    a.localeCompare(b, &quot;es&quot;, { numeric: true, sensitivity: &quot;base&quot; }),  
  );  
}  
function cumpleFiltros(objeto, tipo, columnas) {  
  return columnas.every((col) =&gt; {  
    const config = filtros[tipo][col.key];  
    if (!config) return true;  
    const valor = String(valorVisible(objeto, col) ?? &quot;&quot;);  
    if (typeof config === &quot;string&quot;)  
      return normalizar(valor).includes(normalizar(config));  
    const texto = config.texto || &quot;&quot;;  
    const selecciones = config.valores || [];  
    const mostrado = valor.trim() || &quot;(Vacío)&quot;;  
    return (  
      (!texto || normalizar(valor).includes(normalizar(texto))) &amp;&amp;  
      (!selecciones.length || selecciones.includes(mostrado))  
    );  
  });  
}  
function cerrarMenuFiltroKiris() {  
  document.getElementById(&quot;excelFilterMenuKiris&quot;)?.remove();  
  filtroMenuActivo = null;  
}  
function abrirMenuFiltroKiris(event, tipo, columna, input) {  
  event.stopPropagation();  
  cerrarMenuFiltroKiris();  
  filtroMenuActivo = { tipo, key: columna.key };  
  const config =  
    typeof filtros[tipo][columna.key] === &quot;object&quot;  
      ? filtros[tipo][columna.key]  
      : { texto: filtros[tipo][columna.key] || &quot;&quot;, valores: [] };  
  const menu = document.createElement(&quot;div&quot;);  
  menu.id = &quot;excelFilterMenuKiris&quot;;  
  menu.className = &quot;excel-filter-menu&quot;;  
  const valores = valoresUnicos(tipo, columna);  
  menu.innerHTML = `&lt;h4&gt;${escaparHTML(columna.label)}&lt;/h4&gt;&lt;input class=&quot;excel-filter-search&quot; placeholder=&quot;Buscar valores en la lista&quot;&gt;&lt;label&gt;&lt;input class=&quot;todos&quot; type=&quot;checkbox&quot; ${!config.valores.length ? &quot;checked&quot; : &quot;&quot;}&gt; Seleccionar todos&lt;/label&gt;&lt;div class=&quot;excel-filter-options&quot;&gt;${valores.map((v) =&gt; `&lt;label data-text=&quot;${escaparHTML(normalizar(v))}&quot;&gt;&lt;input type=&quot;checkbox&quot; value=&quot;${escaparHTML(v)}&quot; ${config.valores.includes(v) ? &quot;checked&quot; : &quot;&quot;}&gt; ${escaparHTML(v)}&lt;/label&gt;`).join(&quot;&quot;)}&lt;/div&gt;&lt;div class=&quot;excel-filter-actions&quot;&gt;&lt;button class=&quot;limpiar&quot;&gt;Limpiar&lt;/button&gt;&lt;button class=&quot;aplicar&quot;&gt;Aplicar&lt;/button&gt;&lt;/div&gt;`;  
  document.body.appendChild(menu);  
  const r = input.getBoundingClientRect();  
  menu.style.left = Math.min(r.left, innerWidth - 332) + &quot;px&quot;;  
  menu.style.top = Math.min(r.bottom + 4, innerHeight - 432) + &quot;px&quot;;  
  const buscar = menu.querySelector(&quot;.excel-filter-search&quot;);  
  buscar.oninput = () =&gt;  
    menu  
      .querySelectorAll(&quot;.excel-filter-options label&quot;)  
      .forEach(  
        (l) =&gt; (l.hidden = !l.dataset.text.includes(normalizar(buscar.value))),  
      );  
  menu.querySelector(&quot;.todos&quot;).onchange = (e) =&gt;  
    menu.querySelectorAll(&quot;.excel-filter-options input&quot;).forEach((ch) =&gt; {  
      if (!ch.closest(&quot;label&quot;).hidden) ch.checked = e.target.checked;  
    });  
  menu.querySelector(&quot;.limpiar&quot;).onclick = () =&gt; {  
    delete filtros[tipo][columna.key];  
    cerrarMenuFiltroKiris();  
    renderEntidad(tipo);  
  };  
  menu.querySelector(&quot;.aplicar&quot;).onclick = () =&gt; {  
    const seleccion = [  
      ...menu.querySelectorAll(&quot;.excel-filter-options input:checked&quot;),  
    ].map((x) =&gt; x.value);  
    filtros[tipo][columna.key] = {  
      texto: input.value,  
      valores: seleccion.length === valores.length ? [] : seleccion,  
    };  
    cerrarMenuFiltroKiris();  
    renderEntidad(tipo);  
  };  
  menu.onclick = (e) =&gt; e.stopPropagation();  
}  
function opcionesFiltroInline(tipo, columna) {  
  return [  
    ...new Set(  
      estado[tipo].map((fila) =&gt; {  
        const valor =  
          columna.key === &quot;listo&quot;  
            ? normalizarEstadoListo(valorVisible(fila, columna))  
            : valorVisible(fila, columna);  
        return String(valor).trim() || &quot;(Vacío)&quot;;  
      }),  
    ),  
  ].sort((a, b) =&gt; a.localeCompare(b, &quot;es&quot;, { numeric: true }));  
}  
function abrirFiltroInlineKiris(
    evento,
    tipo,
    columna,
    input
) {

    evento.stopPropagation();

    input.focus();

    document
        .querySelectorAll(&quot;.inline-filter-options&quot;)
        .forEach(panel =&gt; panel.remove());

    const cfg = filtros[tipo][columna.key];

    const seleccionados =
        typeof cfg === &quot;object&quot;
            ? cfg.valores || []
            : [];

    const textoActual =
        input.value || &quot;&quot;;

    const valores =
        opcionesFiltroInline(tipo, columna)
            .filter(valor =&gt;
                !textoActual ||
                normalizar(valor)
                    .includes(
                        normalizar(textoActual)
                    )
            );

    const panel =
        document.createElement(&quot;div&quot;);

    panel.className =
        &quot;inline-filter-options&quot;;

    panel.innerHTML = `

        &lt;div class=&quot;inline-filter-list&quot;&gt;

            ${valores
                .map(valor =&gt; `

                    &lt;label
                        class=&quot;inline-filter-option&quot;
                    &gt;

                        &lt;input
                            type=&quot;checkbox&quot;
                            value=&quot;${escaparHTML(valor)}&quot;

                            ${
                                !seleccionados.length ||
                                seleccionados.includes(valor)
                                    ? &quot;checked&quot;
                                    : &quot;&quot;
                            }
                        &gt;

                        &lt;span&gt;
                            ${escaparHTML(valor)}
                        &lt;/span&gt;

                    &lt;/label&gt;

                `)
                .join(&quot;&quot;)}

        &lt;/div&gt;

        &lt;div class=&quot;inline-filter-actions&quot;&gt;

            &lt;button
                type=&quot;button&quot;
                class=&quot;btn-inline-none&quot;
            &gt;
                Desmarcar todo
            &lt;/button&gt;

            &lt;button
                type=&quot;button&quot;
                class=&quot;btn-inline-all&quot;
            &gt;
                Seleccionar todo
            &lt;/button&gt;

            &lt;button
                type=&quot;button&quot;
                class=&quot;btn-inline-clear&quot;
            &gt;
                Limpiar
            &lt;/button&gt;

            &lt;button
                type=&quot;button&quot;
                class=&quot;btn-inline-apply&quot;
            &gt;
                Aplicar
            &lt;/button&gt;

        &lt;/div&gt;

    `;

    input
        .closest(&quot;th&quot;)
        .appendChild(panel);

    panel.onclick = e =&gt;
        e.stopPropagation();

    panel
        .querySelector(&quot;.btn-inline-none&quot;)
        .onclick = () =&gt; {

            panel
                .querySelectorAll(
                    &#x27;input[type=&quot;checkbox&quot;]&#x27;
                )
                .forEach(check =&gt; {
                    check.checked = false;
                });

        };

    panel
        .querySelector(&quot;.btn-inline-all&quot;)
        .onclick = () =&gt; {

            panel
                .querySelectorAll(
                    &#x27;input[type=&quot;checkbox&quot;]&#x27;
                )
                .forEach(check =&gt; {
                    check.checked = true;
                });

        };

    panel
        .querySelector(&quot;.btn-inline-clear&quot;)
        .onclick = () =&gt; {

            delete filtros[tipo][columna.key];

            renderEntidad(tipo);

        };

    panel
        .querySelector(&quot;.btn-inline-apply&quot;)
        .onclick = () =&gt; {

            const elegidos = [

                ...panel.querySelectorAll(
                    &#x27;input[type=&quot;checkbox&quot;]:checked&#x27;
                )

            ].map(c =&gt; c.value);

            filtros[tipo][columna.key] = {
                texto: input.value,
                valores: elegidos
            };

            renderEntidad(tipo);

        };

} 
function crearEncabezado(elemento, columnas, tipo, ocultas = []) {  
  const titulos = columnas  
    .map((c) =&gt; {  
      const o = ocultas.includes(c.key) ? &quot;display:none&quot; : &quot;&quot;;  
      if (c.especial === &quot;seleccion&quot;)  
        return `&lt;th style=&quot;${o}&quot;&gt;&lt;input id=&quot;seleccionarTodos_${tipo}&quot; type=&quot;checkbox&quot; aria-label=&quot;Seleccionar todos&quot;&gt;&lt;/th&gt;`;  
      return `&lt;th data-key=&quot;${c.key}&quot; style=&quot;${o}&quot;&gt;&lt;div class=&quot;th-content&quot;&gt;&lt;span&gt;${escaparHTML(c.label)}&lt;/span&gt;&lt;span class=&quot;resize-handle&quot; data-tipo=&quot;${tipo}&quot; data-key=&quot;${c.key}&quot;&gt;&lt;/span&gt;&lt;/div&gt;&lt;/th&gt;`;  
    })  
    .join(&quot;&quot;);  
  const filtrosHtml = columnas  
    .map((c) =&gt; {  
      const o = ocultas.includes(c.key) ? &quot;display:none&quot; : &quot;&quot;;  
      if (c.especial) return `&lt;th style=&quot;${o}&quot;&gt;&lt;/th&gt;`;  
      const cfg = filtros[tipo][c.key],  
        texto = typeof cfg === &quot;object&quot; ? cfg.texto || &quot;&quot; : cfg || &quot;&quot;,  
        activo = cfg &amp;&amp; (texto || (cfg.valores || []).length);  
      return `&lt;th class=&quot;filter-cell&quot; style=&quot;${o}&quot;&gt;&lt;input class=&quot;filter-input ${activo ? &quot;filtro-activo&quot; : &quot;&quot;}&quot; data-tipo=&quot;${tipo}&quot; data-key=&quot;${c.key}&quot; value=&quot;${escaparHTML(texto)}&quot; placeholder=&quot;Buscar o filtrar&quot; autocomplete=&quot;off&quot;&gt;&lt;/th&gt;`;  
    })  
    .join(&quot;&quot;);  
  elemento.innerHTML = `&lt;tr&gt;${titulos}&lt;/tr&gt;&lt;tr class=&quot;filters-row&quot;&gt;${filtrosHtml}&lt;/tr&gt;`;  
  elemento.querySelectorAll(&quot;.filter-input&quot;).forEach((input) =&gt; {  
    const col = columnas.find((c) =&gt; c.key === input.dataset.key);  
    input.onclick = (e) =&gt; abrirFiltroInlineKiris(e, tipo, col, input);  
    input.oninput = () =&gt; {  
      const texto = input.value;  
      const prev = filtros[tipo][col.key];  
      filtros[tipo][col.key] = {  
        texto,  
        valores: typeof prev === &quot;object&quot; ? prev.valores || [] : [],  
      };  
      renderEntidad(tipo);  
      const nuevo = document.querySelector(  
        `.filter-input[data-tipo=&quot;${tipo}&quot;][data-key=&quot;${col.key}&quot;]`,  
      );  
      if (nuevo) {  
        nuevo.focus();  
        nuevo.setSelectionRange(nuevo.value.length, nuevo.value.length);  
        abrirFiltroInlineKiris({ stopPropagation() {} }, tipo, col, nuevo);  
      }  
    };  
    input.onkeydown = (e) =&gt; {  
      if (e.key !== &quot;Enter&quot;) return;  
      e.preventDefault();  
      const prev = filtros[tipo][col.key];  
      filtros[tipo][col.key] = {  
        texto: input.value,  
        valores: typeof prev === &quot;object&quot; ? prev.valores || [] : [],  
      };  
      renderEntidad(tipo);  
    };  
  });  
}  
document.addEventListener(&quot;click&quot;, () =&gt;  
  document  
    .querySelectorAll(&quot;.inline-filter-options&quot;)  
    .forEach((panel) =&gt; panel.remove()),  
);  
 
/* Lectura de los XLSX adjuntos */  
async function leerLibroXLSX(archivo) {  
  if (typeof XLSX === &quot;undefined&quot;)  
    throw new Error(&quot;No se cargó el lector de Excel&quot;);  
  const data = new Uint8Array(await archivo.arrayBuffer());  
  return XLSX.read(data, { type: &quot;array&quot;, cellDates: true });  
}  
function fechaXLSX(v) {  
  if (!v) return &quot;&quot;;  
  const d = v instanceof Date ? v : new Date(v);  
  return isNaN(d)  
    ? &quot;&quot;  
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, &quot;0&quot;)}-${String(d.getDate()).padStart(2, &quot;0&quot;)}`;  
}  
async function importarControlVersionesXLSX(archivo) {
  if (!archivo) return;
  try {
    const wb = await leerLibroXLSX(archivo);
    const nombreHoja = wb.SheetNames.includes(&quot;ControlVersiones&quot;)
      ? &quot;ControlVersiones&quot;
      : wb.SheetNames.find((nombre) =&gt;
          normalizar(nombre).replace(/[^a-z0-9]/g, &quot;&quot;).includes(&quot;controlversiones&quot;),
        ) || wb.SheetNames[0];

    if (!nombreHoja) throw new Error(&quot;El archivo no contiene hojas&quot;);

    const filas = XLSX.utils.sheet_to_json(wb.Sheets[nombreHoja], {
      defval: &quot;&quot;,
      raw: false,
      dateNF: &quot;yyyy-mm-dd&quot;,
    });

    const valorColumna = (fila, nombres) =&gt; {
      const claves = Object.keys(fila || {});
      const buscadas = nombres.map(normalizarEncabezado);
      const clave = claves.find((item) =&gt;
        buscadas.includes(normalizarEncabezado(item)),
      );
      return clave === undefined ? &quot;&quot; : fila[clave];
    };

    const nuevos = filas
      .map((fila) =&gt; {
        const codigo = String(valorColumna(fila, [&quot;Código&quot;, &quot;Codigo&quot;])).trim();
        const manual = String(valorColumna(fila, [&quot;Manual&quot;])).trim();
        if (!codigo &amp;&amp; !manual) return null;

        return {
          id: id(&quot;version&quot;),
          sistema:
            String(valorColumna(fila, [&quot;Sistema&quot;])).trim() || &quot;SISCARD&quot;,
          codigo,
          manual,
          idioma: String(valorColumna(fila, [&quot;Idioma&quot;])).trim() || &quot;Español&quot;,
          numero: String(
            valorColumna(fila, [&quot;Versión disponible&quot;, &quot;Version disponible&quot;, &quot;Versión&quot;, &quot;Version&quot;]),
          ).trim(),
          ubicacionEService: String(
            valorColumna(fila, [&quot;Ubicación en E-service&quot;, &quot;Ubicacion en E-service&quot;, &quot;Ubicación en Eservice&quot;, &quot;Ubicacion en Eservice&quot;]),
          ).trim(),
          fecha: fechaXLSX(
            valorColumna(fila, [&quot;Fecha de versión&quot;, &quot;Fecha de version&quot;, &quot;Fecha&quot;]),
          ),
          estado:
            String(valorColumna(fila, [&quot;Estado&quot;])).trim() || &quot;Disponible&quot;,
          observaciones: String(
            valorColumna(fila, [&quot;Observaciones&quot;]),
          ).trim(),
        };
      })
      .filter(Boolean);

    if (!nuevos.length) {
      throw new Error(
        &quot;No se encontraron filas válidas. Use el Excel generado por Exportar EXCEL en Control de Versiones.&quot;,
      );
    }

    nuevos.sort((a, b) =&gt;
      String(a.codigo || &quot;&quot;).localeCompare(String(b.codigo || &quot;&quot;), &quot;es&quot;, {
        numeric: true,
        sensitivity: &quot;base&quot;,
      }),
    );

    estado.versiones = nuevos;
    filtros.versiones = {};
    ordenamientosVista.versiones = { columna: &quot;codigo&quot;, sentido: 1 };
    guardarEstado(`${nuevos.length} versiones importadas y reemplazadas`);
    renderVersiones();
    mostrarToast(
      `Control de Versiones reemplazado con ${nuevos.length} registro(s) del Excel`,
    );
  } catch (e) {
    console.error(e);
    mostrarToast(`No fue posible importar Control de Versiones: ${e.message}`);
  }
}

async function importarDashboardProduccion(archivo) {  
  if (!archivo) return;  
  try {  
    const wb = await leerLibroXLSX(archivo),  
      hoja = wb.Sheets[wb.SheetNames[0]],  
      filas = XLSX.utils.sheet_to_json(hoja, { defval: &quot;&quot;, raw: true });  
    estado.ciclo = filas.map((original, i) =&gt; {  
      const start = original[&quot;Start Date&quot;],  
        comp = original[&quot;Comp Date&quot;],  
        cat = String(original[&quot;Change Category&quot;] || &quot;Sin categoría&quot;),  
        a = start ? new Date(start) : null,  
        b = comp ? new Date(comp) : null,  
        dias =  
          a &amp;&amp; b &amp;&amp; !isNaN(a) &amp;&amp; !isNaN(b)  
            ? Math.max(0, Math.round((b - a) / 86400000))  
            : null;  
      return {  
        id: id(&quot;ciclo&quot;),  
        tipo: cat,  
        dias: dias ?? 0,  
        diasCiclo: dias,  
        original,  
      };  
    });  
    guardarEstado(`${estado.ciclo.length} registros de producción importados`);  
    renderDashboard();  
  } catch (e) {  
    console.error(e);  
    mostrarToast(`No fue posible importar export.xlsx: ${e.message}`);  
  }  
}  
function abrirDetalleProduccion() {  
  if (!estado.ciclo.length) return mostrarToast(&quot;Primero importe export.xlsx&quot;);  
  const rows = estado.ciclo.map((x) =&gt; x.original || x),  
    headers = [...new Set(rows.flatMap(Object.keys))];  
  const data = JSON.stringify({ headers, rows }, (k, v) =&gt;  
    v instanceof Date ? v.toISOString() : v,  
  ).replace(/&lt;/g, &quot;\\u003c&quot;);  
  const html = `&lt;!doctype html&gt;&lt;html lang=&quot;es&quot;&gt;&lt;head&gt;&lt;meta charset=&quot;utf-8&quot;&gt;&lt;title&gt;Detalle de producción&lt;/title&gt;&lt;style&gt;body{font-family:Segoe UI;margin:0;background:#f3f3f3;color:#333}header{background:#FF6C0C;color:white;padding:16px 22px}.bar{display:flex;gap:8px;padding:14px;align-items:center;position:sticky;top:0;background:#f3f3f3;z-index:5}.bar input{min-width:320px;padding:9px;border:1px solid #ccc;border-radius:8px}.bar button{padding:9px 12px;border:0;border-radius:8px;font-weight:700}.wrap{margin:0 14px 14px;overflow:auto;max-height:calc(100vh - 100px);background:white}table{border-collapse:collapse;width:max-content;min-width:100%;table-layout:fixed}th,td{border:1px solid #ddd;padding:7px;font-size:12px;vertical-align:top;white-space:normal;overflow-wrap:anywhere;word-break:break-word;min-width:150px;max-width:280px;line-height:1.4}thead tr:first-child th{position:sticky;top:0;background:#666;color:#fff;z-index:3}.filtros th{position:sticky;top:33px;background:#f7f7f7;z-index:2}.filtros input{min-width:125px;width:100%;box-sizing:border-box;padding:6px}&lt;/style&gt;&lt;/head&gt;&lt;body&gt;&lt;header&gt;&lt;h2&gt;Detalle de producción&lt;/h2&gt;&lt;/header&gt;&lt;div class=&quot;bar&quot;&gt;&lt;input id=&quot;global&quot; placeholder=&quot;Buscar en toda la réplica&quot;&gt;&lt;button onclick=&quot;limpiar()&quot;&gt;Limpiar filtros&lt;/button&gt;&lt;span id=&quot;count&quot;&gt;&lt;/span&gt;&lt;/div&gt;&lt;div class=&quot;wrap&quot;&gt;&lt;table id=&quot;tabla&quot;&gt;&lt;/table&gt;&lt;/div&gt;&lt;script&gt;const DATA=${data};function esc(v){return String(v??&#x27;&#x27;).replace(/&amp;/g,&#x27;&amp;amp;&#x27;).replace(/&lt;/g,&#x27;&amp;lt;&#x27;).replace(/&gt;/g,&#x27;&amp;gt;&#x27;)}function render(){const activo=document.activeElement;  
const ciActivo=activo?.dataset?.i ?? null;  
const valorActivo=activo?.value ?? &quot;&quot;;  
const posCursor=activo?.selectionStart ?? valorActivo.length;  
 
const g=global.value.toLowerCase(),  
      fs=[...document.querySelectorAll(&#x27;.f&#x27;)].map(x=&gt;x.value.toLowerCase());const r=DATA.rows.filter(o=&gt;DATA.headers.some(h=&gt;String(o[h]??&#x27;&#x27;).toLowerCase().includes(g))&amp;&amp;DATA.headers.every((h,i)=&gt;!fs[i]||String(o[h]??&#x27;&#x27;).toLowerCase().includes(fs[i])));tabla.innerHTML=&#x27;&lt;thead&gt;&lt;tr&gt;&#x27;+DATA.headers.map(h=&gt;&#x27;&lt;th&gt;&#x27;+esc(h)+&#x27;&lt;/th&gt;&#x27;).join(&#x27;&#x27;)+&#x27;&lt;/tr&gt;&lt;tr class=&quot;filtros&quot;&gt;&#x27;+DATA.headers.map((h,i)=&gt;&#x27;&lt;th&gt;&lt;input class=&quot;f&quot; data-i=&quot;&#x27;+i+&#x27;&quot; placeholder=&quot;Buscar o filtrar&quot; value=&quot;&#x27;+esc(fs[i]||&#x27;&#x27;)+&#x27;&quot;&gt;&lt;/th&gt;&#x27;).join(&#x27;&#x27;)+&#x27;&lt;/tr&gt;&lt;/thead&gt;&lt;tbody&gt;&#x27;+r.map(o=&gt;&#x27;&lt;tr&gt;&#x27;+DATA.headers.map(h=&gt;&#x27;&lt;td&gt;&#x27;+esc(o[h])+&#x27;&lt;/td&gt;&#x27;).join(&#x27;&#x27;)+&#x27;&lt;/tr&gt;&#x27;).join(&#x27;&#x27;)+&#x27;&lt;/tbody&gt;&#x27;;count.textContent=r.length+&#x27; de &#x27;+DATA.rows.length+&#x27; registros&#x27;;document.querySelectorAll(&#x27;.f&#x27;).forEach(x=&gt;x.onkeyup=render);if(ciActivo!==null){  
    const nuevo=document.querySelector(&#x27;.f[data-i=&quot;&#x27; + ciActivo + &#x27;&quot;]&#x27;);  
    if(nuevo){  
        nuevo.focus();  
        nuevo.setSelectionRange(posCursor,posCursor);  
    }  
}}function limpiar(){global.value=&#x27;&#x27;;document.querySelectorAll(&#x27;.f&#x27;).forEach(x=&gt;x.value=&#x27;&#x27;);render()}global.onkeyup=render;render();&lt;\/script&gt;&lt;/body&gt;&lt;/html&gt;`;  
  const w = open(&quot;&quot;, &quot;_blank&quot;);  
  if (!w)  
    return mostrarToast(&quot;Permita ventanas emergentes para ver el detalle&quot;);  
  w.document.write(html);  
  w.document.close();  
}  
 
/* Bitácora: nombre visible y copia de un único registro */  
function nombreManualBitacora(m) {  
  return `${m.codigo || &quot;&quot;} - ${m.titulo || &quot;&quot;}`.replace(  
    /^\s*-\s*|\s*-\s*$/g,  
    &quot;&quot;,  
  );  
}  
function poblarDatalists() {  
  const opciones = estado.manuales  
    .map(  
      (m) =&gt;  
        `&lt;option value=&quot;${escaparHTML(nombreManualBitacora(m))}&quot;&gt;&lt;/option&gt;`,  
    )  
    .join(&quot;&quot;);  
  $(&quot;listaManualesTramite&quot;).innerHTML = estado.manuales  
    .map(  
      (m) =&gt;  
        `&lt;option value=&quot;${escaparHTML(m.titulo)}&quot;&gt;${escaparHTML(m.codigo)}&lt;/option&gt;`,  
    )  
    .join(&quot;&quot;);  
  $(&quot;listaManualesBitacora&quot;).innerHTML = opciones;  
  $(&quot;listaTemasTramite&quot;).innerHTML = [  
    ...new Set(estado.tramites.map((t) =&gt; t.temaGeneral).filter(Boolean)),  
  ]  
    .map((x) =&gt; `&lt;option value=&quot;${escaparHTML(x)}&quot;&gt;&lt;/option&gt;`)  
    .join(&quot;&quot;);  
}  
function guardarBitacoraFormulario(evento) {  
  evento.preventDefault();  
  const existenteId = $(&quot;bitacoraId&quot;).value,  
    valor = $(&quot;bitacoraManual&quot;).value.trim();  
  const manual = estado.manuales.find((m) =&gt;  
    [m.titulo, m.codigo, nombreManualBitacora(m)].includes(valor),  
  );  
  const nombre = manual ? nombreManualBitacora(manual) : valor;  
  const datos = {  
    id: existenteId || id(&quot;bitacora&quot;),  
    fecha: $(&quot;bitacoraFecha&quot;).value,  
    manual: nombre,  
    manualId: manual?.id || &quot;&quot;,  
    tipo: $(&quot;bitacoraTipo&quot;).value || manual?.tipo || &quot;&quot;,  
    horaInicio: $(&quot;bitacoraHoraInicio&quot;).value,  
    horaFin: $(&quot;bitacoraHoraFin&quot;).value,  
    horas: calcularHoras(  
      $(&quot;bitacoraHoraInicio&quot;).value,  
      $(&quot;bitacoraHoraFin&quot;).value,  
    ),  
    paginas: Number($(&quot;bitacoraPaginas&quot;).value || 0),  
    detalle: $(&quot;bitacoraDetalle&quot;).value.trim(),  
  };  
  const i = estado.bitacora.findIndex((x) =&gt; x.id === existenteId);  
  if (i &gt;= 0) estado.bitacora[i] = datos;  
  else estado.bitacora.unshift(datos);  
  guardarEstado(&quot;Registro de Bitácora guardado&quot;);  
  cerrarPantalla(&quot;bitacoraScreen&quot;);  
  renderTodo();  
}  
function abrirCopiaRegistro() {  
  const sel = $(&quot;registroOrigenCopia&quot;);  
  sel.innerHTML = estado.bitacora  
    .map(  
      (r) =&gt;  
        `&lt;option value=&quot;${r.id}&quot;&gt;${escaparHTML(r.fecha)} | ${escaparHTML(r.manual)} | ${Number(r.horas || 0).toFixed(2)} h&lt;/option&gt;`,  
    )  
    .join(&quot;&quot;);  
  $(&quot;fechaDestinoCopia&quot;).value = fechaISOHoy();  
  actualizarPreviewCopia();  
  abrirPantalla(&quot;panelCopiaMasiva&quot;);  
}  
function actualizarPreviewCopia() {  
  const r = estado.bitacora.find(  
    (x) =&gt; x.id === $(&quot;registroOrigenCopia&quot;).value,  
  );  
  $(&quot;previewCopia&quot;).textContent = r  
    ? `Manual: ${r.manual}\nTipo: ${r.tipo}\nHorario: ${r.horaInicio} - ${r.horaFin}\nHoras: ${Number(r.horas || 0).toFixed(2)}\nPáginas: ${r.paginas || 0}\nDetalle: ${r.detalle || &quot;&quot;}`  
    : &quot;No hay registros disponibles.&quot;;  
}  
function confirmarCopiaRegistro() {  
  const r = estado.bitacora.find(  
      (x) =&gt; x.id === $(&quot;registroOrigenCopia&quot;).value,  
    ),  
    fecha = $(&quot;fechaDestinoCopia&quot;).value;  
  if (!r || !fecha) return mostrarToast(&quot;Seleccione un registro y una fecha&quot;);  
  estado.bitacora.unshift({ ...r, id: id(&quot;bitacora&quot;), fecha });  
  guardarEstado(&quot;Registro copiado&quot;);  
  cerrarPantalla(&quot;panelCopiaMasiva&quot;);  
  renderTodo();  
}  
document.addEventListener(&quot;DOMContentLoaded&quot;, () =&gt; {  
  $(&quot;btnImportarCiclo&quot;)?.addEventListener(&quot;click&quot;, () =&gt;  
    $(&quot;inputExcelDashboardCiclo&quot;).click(),  
  );  
  $(&quot;inputExcelDashboardCiclo&quot;)?.addEventListener(&quot;change&quot;, (e) =&gt;  
    importarDashboardProduccion(e.target.files[0]).finally(  
      () =&gt; (e.target.value = &quot;&quot;),  
    ),  
  );  
  $(&quot;btnCopiarRegistros&quot;)?.addEventListener(&quot;click&quot;, abrirCopiaRegistro);  
  $(&quot;btnCerrarCopiaMasiva&quot;)?.addEventListener(&quot;click&quot;, () =&gt;  
    cerrarPantalla(&quot;panelCopiaMasiva&quot;),  
  );  
  $(&quot;btnCancelarCopiaMasiva&quot;)?.addEventListener(&quot;click&quot;, () =&gt;  
    cerrarPantalla(&quot;panelCopiaMasiva&quot;),  
  );  
  $(&quot;registroOrigenCopia&quot;)?.addEventListener(&quot;change&quot;, actualizarPreviewCopia);  
  $(&quot;btnConfirmarCopiaMasiva&quot;)?.addEventListener(  
    &quot;click&quot;,  
    confirmarCopiaRegistro,  
  );  
});  
 
/* ===== KIRIS V4: columnas, fila activa y cierres ===== */  
function ocultarTodasColumnas(tipo) {  
  const columnas = tipo === &quot;manuales&quot; ? COLUMNAS_MANUALES : COLUMNAS_TRAMITES;  
  const todas = columnas.filter((c) =&gt; !c.especial).map((c) =&gt; c.key);  
  if (tipo === &quot;manuales&quot;) estado.columnasOcultasManuales = todas;  
  else estado.columnasOcultasTramites = todas;  
  guardarEstado(&quot;&quot;);  
  if (tipo === &quot;manuales&quot;) renderManuales();  
  else renderTramites();  
  abrirColumnas(tipo);  
}  
function cerrarPanelesColumnas(evento) {  
  const manuales = $(&quot;columnsPanelManuales&quot;);  
  const tramites = $(&quot;columnsPanelTramites&quot;);  
  const dentroManual =  
    manuales &amp;&amp; !manuales.hidden &amp;&amp; manuales.contains(evento.target);  
  const dentroTramite =  
    tramites &amp;&amp; !tramites.hidden &amp;&amp; tramites.contains(evento.target);  
  const botonManual = evento.target.closest?.(&quot;#btnColumnasManuales&quot;);  
  const botonTramite = evento.target.closest?.(&quot;#btnColumnasTramites&quot;);  
  if (manuales &amp;&amp; !dentroManual &amp;&amp; !botonManual) manuales.hidden = true;  
  if (tramites &amp;&amp; !dentroTramite &amp;&amp; !botonTramite) tramites.hidden = true;  
}  
function activarFilaManualDesdeEvento(evento) {  
  const fila = evento.target.closest(&quot;#tbodyManuales tr[data-id]&quot;);  
  if (!fila) return;  
  document  
    .querySelectorAll(&quot;#tbodyManuales tr.fila-activa&quot;)  
    .forEach((r) =&gt; r.classList.remove(&quot;fila-activa&quot;));  
  fila.classList.add(&quot;fila-activa&quot;);  
}  
document.addEventListener(&quot;click&quot;, cerrarPanelesColumnas);  
document.addEventListener(&quot;click&quot;, activarFilaManualDesdeEvento);  
document.addEventListener(&quot;focusin&quot;, activarFilaManualDesdeEvento);  
document.addEventListener(&quot;DOMContentLoaded&quot;, () =&gt; {  
  $(&quot;btnOcultarTodasManuales&quot;)?.addEventListener(&quot;click&quot;, (e) =&gt; {  
    e.stopPropagation();  
    ocultarTodasColumnas(&quot;manuales&quot;);  
  });  
  $(&quot;btnOcultarTodasTramites&quot;)?.addEventListener(&quot;click&quot;, (e) =&gt; {  
    e.stopPropagation();  
    ocultarTodasColumnas(&quot;tramites&quot;);  
  });  
});  
 
/* Mantener visible la fila de Manuales que está en trabajo */  
let manualActivoId = &quot;&quot;;  
document.addEventListener(&quot;focusin&quot;, (evento) =&gt; {  
  const fila = evento.target.closest?.(&quot;#tbodyManuales tr[data-id]&quot;);  
  if (fila) manualActivoId = fila.dataset.id || &quot;&quot;;  
});  
document.addEventListener(&quot;click&quot;, (evento) =&gt; {  
  const fila = evento.target.closest?.(&quot;#tbodyManuales tr[data-id]&quot;);  
  if (fila) manualActivoId = fila.dataset.id || &quot;&quot;;  
});  
document.addEventListener(&quot;DOMContentLoaded&quot;, () =&gt; {  
  const cuerpo = $(&quot;tbodyManuales&quot;);  
  if (!cuerpo) return;  
  new MutationObserver(() =&gt; {  
    if (!manualActivoId) return;  
    cuerpo  
      .querySelectorAll(&quot;tr.fila-activa&quot;)  
      .forEach((r) =&gt; r.classList.remove(&quot;fila-activa&quot;));  
    cuerpo  
      .querySelector(`tr[data-id=&quot;${CSS.escape(manualActivoId)}&quot;]`)  
      ?.classList.add(&quot;fila-activa&quot;);  
  }).observe(cuerpo, { childList: true });  
});  
 
/* ===== KIRIS V5: mover a posición y ordenar por lógica de negocio ===== */  
 
/* KIRIS V2: movimiento directo y ordenamiento por lógica de negocio.     
   Cargar este archivo después de js/app.js. */  
(() =&gt; {  
  const $id = (id) =&gt; document.getElementById(id);  
  const normalizarKiris = (valor) =&gt;  
    String(valor ?? &quot;&quot;)  
      .toLowerCase()  
      .normalize(&quot;NFD&quot;)  
      .replace(/[\u0300-\u036f]/g, &quot;&quot;);  
 
  function columnasDe(tipo) {  
    if (tipo === &quot;manuales&quot;)  
      return window.COLUMNAS_MANUALES || COLUMNAS_MANUALES;  
    if (tipo === &quot;tramites&quot;)  
      return window.COLUMNAS_TRAMITES || COLUMNAS_TRAMITES;  
    return window.COLUMNAS_VERSIONES || COLUMNAS_VERSIONES;  
  }  
 
  function renderDe(tipo) {  
    if (tipo === &quot;manuales&quot;) renderManuales();  
    else if (tipo === &quot;tramites&quot;) renderTramites();  
    else renderVersiones();  
  }  
 
  function valorOrdenable(registro, columna) {  
    if (typeof valorVisible === &quot;function&quot;)  
      return valorVisible(registro, columna);  
    return registro?.[columna.key] ?? &quot;&quot;;  
  }  
 
  function compararTexto(a, b) {  
    return String(a ?? &quot;&quot;).localeCompare(String(b ?? &quot;&quot;), &quot;es&quot;, {  
      numeric: true,  
      sensitivity: &quot;base&quot;,  
    });  
  }  
 
  function compararNumero(a, b) {  
    const na = Number(a);  
    const nb = Number(b);  
    if (Number.isNaN(na) &amp;&amp; Number.isNaN(nb)) return 0;  
    if (Number.isNaN(na)) return 1;  
    if (Number.isNaN(nb)) return -1;  
    return na - nb;  
  }  
 
  function compararFecha(a, b) {  
    const ta = a  
      ? new Date(`${a}T00:00:00`).getTime()  
      : Number.POSITIVE_INFINITY;  
    const tb = b  
      ? new Date(`${b}T00:00:00`).getTime()  
      : Number.POSITIVE_INFINITY;  
    return ta - tb;  
  }  
 
  function indiceLogico(valor, opciones) {  
    const buscado = normalizarKiris(valor);  
    const indice = opciones.findIndex(  
      (opcion) =&gt; normalizarKiris(opcion) === buscado,  
    );  
    return indice &lt; 0 ? opciones.length : indice;  
  }  
 
  function ordenarColeccion(tipo, columna, sentido = 1) {  
    const lista = estado[tipo];  
    if (!Array.isArray(lista) || !columna || columna.especial) return;  
 
    const opcionesLogicas = Array.isArray(columna.opciones)  
      ? columna.opciones.filter((opcion) =&gt; String(opcion).trim() !== &quot;&quot;)  
      : [];  
 
    lista.sort((registroA, registroB) =&gt; {  
      const a = valorOrdenable(registroA, columna);  
      const b = valorOrdenable(registroB, columna);  
      let resultado;  
 
      if (tipo === &quot;manuales&quot; &amp;&amp; columna.key === &quot;estado&quot;) {
        const ordenEstados = [&quot;No iniciado&quot;, &quot;En proceso&quot;, &quot;Completado&quot;, &quot;Publicado&quot;];
        resultado = indiceLogico(a, ordenEstados) - indiceLogico(b, ordenEstados);
      } else if (opcionesLogicas.length) {
        resultado =  
          indiceLogico(a, opcionesLogicas) - indiceLogico(b, opcionesLogicas);  
        if (resultado === 0) resultado = compararTexto(a, b);  
      } else if (columna.tipo === &quot;number&quot;) {  
        resultado = compararNumero(a, b);  
      } else if (columna.tipo === &quot;date&quot;) {  
        resultado = compararFecha(a, b);  
      } else {  
        resultado = compararTexto(a, b);  
      }  
 
      return resultado * sentido;  
    });  
 
    ordenamientosVista[tipo] = { columna: columna.key, sentido };
    guardarEstado(`Orden actualizado por ${columna.label}`);  
    renderDe(tipo);  
  }  
 
  function abrirMenuOrden(evento, tipo, columna, boton) {  
    evento.preventDefault();  
    evento.stopPropagation();  
    document  
      .querySelectorAll(&quot;.sort-menu-kiris&quot;)  
      .forEach((menu) =&gt; menu.remove());  
 
    const menu = document.createElement(&quot;div&quot;);  
    menu.className = &quot;sort-menu-kiris&quot;;  
    const esLista =  
      Array.isArray(columna.opciones) &amp;&amp;  
      columna.opciones.filter(Boolean).length &gt; 0;  
    const detalle = esLista  
      ? columna.opciones  
          .filter(Boolean)  
          .map(  
            (opcion, indice) =&gt;  
              `&lt;li&gt;&lt;strong&gt;${indice + 1}.&lt;/strong&gt; ${escaparHTML(opcion)}&lt;/li&gt;`,  
          )  
          .join(&quot;&quot;)  
      : &quot;&quot;;  
 
    menu.innerHTML = `     
            &lt;div class=&quot;sort-menu-title&quot;&gt;Ordenar por ${escaparHTML(columna.label)}&lt;/div&gt;     
            ${esLista ? `&lt;div class=&quot;sort-menu-help&quot;&gt;Se aplicará el orden lógico definido para esta columna:&lt;/div&gt;&lt;ol class=&quot;sort-menu-values&quot;&gt;${detalle}&lt;/ol&gt;` : `&lt;div class=&quot;sort-menu-help&quot;&gt;Esta columna se ordena por su tipo de información.&lt;/div&gt;`}     
            &lt;button type=&quot;button&quot; data-sort=&quot;normal&quot;&gt;${esLista ? &quot;Aplicar orden lógico&quot; : columna.tipo === &quot;date&quot; ? &quot;Más antiguo a más reciente&quot; : columna.tipo === &quot;number&quot; ? &quot;Menor a mayor&quot; : &quot;A a Z&quot;}&lt;/button&gt;     
            &lt;button type=&quot;button&quot; data-sort=&quot;reverse&quot;&gt;${esLista ? &quot;Aplicar orden lógico inverso&quot; : columna.tipo === &quot;date&quot; ? &quot;Más reciente a más antiguo&quot; : columna.tipo === &quot;number&quot; ? &quot;Mayor a menor&quot; : &quot;Z a A&quot;}&lt;/button&gt;`;  
 
    document.body.appendChild(menu);  
    const rect = boton.getBoundingClientRect();  
    menu.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - 330))}px`;  
    menu.style.top = `${Math.min(rect.bottom + 5, innerHeight - menu.offsetHeight - 8)}px`;  
    menu.onclick = (e) =&gt; e.stopPropagation();  
    menu.querySelector(&#x27;[data-sort=&quot;normal&quot;]&#x27;).onclick = () =&gt; {  
      menu.remove();  
      ordenarColeccion(tipo, columna, 1);  
    };  
    menu.querySelector(&#x27;[data-sort=&quot;reverse&quot;]&#x27;).onclick = () =&gt; {  
      menu.remove();  
      ordenarColeccion(tipo, columna, -1);  
    };  
  }  
 
  function agregarFlechasOrden() {  
    const configuraciones = [  
      [&quot;theadManuales&quot;, &quot;manuales&quot;],  
      [&quot;theadTramites&quot;, &quot;tramites&quot;],  
      [&quot;theadVersiones&quot;, &quot;versiones&quot;],  
    ];  
 
    configuraciones.forEach(([theadId, tipo]) =&gt; {  
      const thead = $id(theadId);  
      if (!thead) return;  
      const columnas = columnasDe(tipo);  
      thead.querySelectorAll(&quot;tr:first-child th[data-key]&quot;).forEach((th) =&gt; {  
        const columna = columnas.find((item) =&gt; item.key === th.dataset.key);  
        if (  
          !columna ||  
          columna.especial ||  
          th.querySelector(&quot;.sort-arrow-kiris&quot;)  
        )  
          return;  
        const contenido = th.querySelector(&quot;.th-content&quot;);  
        if (!contenido) return;  
        const boton = document.createElement(&quot;button&quot;);  
        boton.type = &quot;button&quot;;  
        boton.className = &quot;sort-arrow-kiris&quot;;  
        boton.textContent = &quot;▼&quot;;  
        boton.title = `Reorganizar por ${columna.label}`;  
        boton.setAttribute(&quot;aria-label&quot;, `Reorganizar por ${columna.label}`);  
        boton.onclick = (evento) =&gt;  
          abrirMenuOrden(evento, tipo, columna, boton);  
        const resize = contenido.querySelector(&quot;.resize-handle&quot;);  
        contenido.insertBefore(boton, resize || null);  
      });  
    });  
  }  
 
  let manualCopiadoParaMoverId = &quot;&quot;;  
 
  function cerrarMenuFilaKiris() {  
    document  
      .querySelectorAll(&quot;.row-copy-menu-kiris&quot;)  
      .forEach((menu) =&gt; menu.remove());  
  }  
 
  function estiloMenuFilaKiris(menu, x, y) {  
    Object.assign(menu.style, {  
      position: &quot;fixed&quot;,  
      zIndex: &quot;2600&quot;,  
      width: &quot;248px&quot;,  
      padding: &quot;8px&quot;,  
      background: &quot;#FFFFFF&quot;,  
      color: &quot;#333333&quot;,  
      border: &quot;1px solid #D9D9D9&quot;,  
      borderTop: &quot;4px solid #FF6C0C&quot;,  
      borderRadius: &quot;12px&quot;,  
      boxShadow: &quot;0 12px 34px rgba(0,0,0,.25)&quot;,  
    });  
    document.body.appendChild(menu);  
    const ancho = menu.offsetWidth;  
    const alto = menu.offsetHeight;  
    menu.style.left = `${Math.max(8, Math.min(x, innerWidth - ancho - 8))}px`;  
    menu.style.top = `${Math.max(8, Math.min(y, innerHeight - alto - 8))}px`;  
  }  
 
  function botonMenuFilaKiris(texto, principal = false) {  
    const boton = document.createElement(&quot;button&quot;);  
    boton.type = &quot;button&quot;;  
    boton.textContent = texto;  
    Object.assign(boton.style, {  
      display: &quot;block&quot;,  
      width: &quot;100%&quot;,  
      margin: &quot;0&quot;,  
      padding: &quot;10px 11px&quot;,  
      background: principal ? &quot;#FFF0E6&quot; : &quot;#FFFFFF&quot;,  
      color: principal ? &quot;#B94700&quot; : &quot;#333333&quot;,  
      border: &quot;0&quot;,  
      borderRadius: &quot;8px&quot;,  
      fontWeight: principal ? &quot;800&quot; : &quot;700&quot;,  
      textAlign: &quot;left&quot;,  
      cursor: &quot;pointer&quot;,  
    });  
    boton.onmouseenter = () =&gt; {  
      boton.style.background = &quot;#FFD1B3&quot;;  
    };  
    boton.onmouseleave = () =&gt; {  
      boton.style.background = principal ? &quot;#FFF0E6&quot; : &quot;#FFFFFF&quot;;  
    };  
    return boton;  
  }  
 
  function copiarFilaParaMover(manualId) {  
    if (!estado.manuales.some((manual) =&gt; manual.id === manualId)) return;  
    manualCopiadoParaMoverId = manualId;  
    document  
      .querySelectorAll(&quot;#tbodyManuales tr.fila-copiada-kiris&quot;)  
      .forEach((fila) =&gt; fila.classList.remove(&quot;fila-copiada-kiris&quot;));  
    const fila = document.querySelector(  
      `#tbodyManuales tr[data-id=&quot;${CSS.escape(manualId)}&quot;]`,  
    );  
    if (fila) {  
      fila.classList.add(&quot;fila-copiada-kiris&quot;);  
      fila.style.boxShadow = &quot;inset 5px 0 0 #FF6C0C&quot;;  
    }  
    mostrarToast(  
      &quot;Fila copiada. Vaya al destino, haga clic derecho y seleccione Insertar fila copiada aquí&quot;,  
    );  
  }  
 
  function insertarFilaCopiadaEn(destinoId) {  
    const origen = estado.manuales.findIndex(  
      (manual) =&gt; manual.id === manualCopiadoParaMoverId,  
    );  
    const destinoOriginal = estado.manuales.findIndex(  
      (manual) =&gt; manual.id === destinoId,  
    );  
    if (origen &lt; 0 || destinoOriginal &lt; 0) {  
      manualCopiadoParaMoverId = &quot;&quot;;  
      mostrarToast(&quot;La fila copiada ya no está disponible&quot;);  
      return;  
    }  
    if (manualCopiadoParaMoverId === destinoId) {  
      mostrarToast(&quot;Seleccione una fila de destino diferente&quot;);  
      return;  
    }  
    const [movido] = estado.manuales.splice(origen, 1);  
    const destino = estado.manuales.findIndex(  
      (manual) =&gt; manual.id === destinoId,  
    );  
    estado.manuales.splice(destino, 0, movido);  
    manualCopiadoParaMoverId = &quot;&quot;;  
    guardarEstado(&quot;Fila insertada y nuevo orden guardado&quot;);  
    renderManuales();  
  }  
 
  function cancelarFilaCopiada() {  
    manualCopiadoParaMoverId = &quot;&quot;;  
    document  
      .querySelectorAll(&quot;#tbodyManuales tr.fila-copiada-kiris&quot;)  
      .forEach((fila) =&gt; {  
        fila.classList.remove(&quot;fila-copiada-kiris&quot;);  
        fila.style.boxShadow = &quot;&quot;;  
      });  
    mostrarToast(&quot;Copia de fila cancelada&quot;);  
  }  
 
  function abrirMenuFilaKiris(evento, fila) {  
    evento.preventDefault();  
    evento.stopPropagation();  
    cerrarMenuFilaKiris();  
    const manualId = fila.dataset.id;  
    const menu = document.createElement(&quot;div&quot;);  
    menu.className = &quot;row-copy-menu-kiris&quot;;  
 
    const titulo = document.createElement(&quot;div&quot;);  
    titulo.textContent = manualCopiadoParaMoverId  
      ? &quot;Fila copiada&quot;  
      : &quot;Opciones de fila&quot;;  
    Object.assign(titulo.style, {  
      padding: &quot;6px 10px 8px&quot;,  
      color: &quot;#FF6C0C&quot;,  
      fontSize: &quot;13px&quot;,  
      fontWeight: &quot;800&quot;,  
    });  
    menu.appendChild(titulo);  
 
    const copiar = botonMenuFilaKiris(  
      &quot;📋 Copiar fila para mover&quot;,  
      !manualCopiadoParaMoverId,  
    );  
    copiar.onclick = () =&gt; {  
      cerrarMenuFilaKiris();  
      copiarFilaParaMover(manualId);  
    };  
    menu.appendChild(copiar);  
 
    if (manualCopiadoParaMoverId) {  
      const insertar = botonMenuFilaKiris(&quot;↳ Insertar fila copiada aquí&quot;, true);  
      insertar.onclick = () =&gt; {  
        cerrarMenuFilaKiris();  
        insertarFilaCopiadaEn(manualId);  
      };  
      menu.appendChild(insertar);  
 
      const cancelar = botonMenuFilaKiris(&quot;✕ Cancelar copia&quot;);  
      cancelar.onclick = () =&gt; {  
        cerrarMenuFilaKiris();  
        cancelarFilaCopiada();  
      };  
      menu.appendChild(cancelar);  
    }  
 
    estiloMenuFilaKiris(menu, evento.clientX + 4, evento.clientY + 4);  
    menu.onclick = (e) =&gt; e.stopPropagation();  
  }  
 
  function habilitarCopiarInsertarFilas() {  
    document.querySelectorAll(&quot;#tbodyManuales tr[data-id]&quot;).forEach((fila) =&gt; {  
      fila.oncontextmenu = (evento) =&gt; abrirMenuFilaKiris(evento, fila);  
      if (fila.dataset.id === manualCopiadoParaMoverId) {  
        fila.classList.add(&quot;fila-copiada-kiris&quot;);  
        fila.style.boxShadow = &quot;inset 5px 0 0 #FF6C0C&quot;;  
      }  
    });  
  }  
 
  function actualizarControles() {  
    agregarFlechasOrden();  
    habilitarCopiarInsertarFilas();  
  }  
 
  document.addEventListener(&quot;click&quot;, () =&gt; {  
    document  
      .querySelectorAll(&quot;.sort-menu-kiris&quot;)  
      .forEach((menu) =&gt; menu.remove());  
    cerrarMenuFilaKiris();  
  });  
  document.addEventListener(&quot;DOMContentLoaded&quot;, () =&gt; {  
    actualizarControles();  
    [  
      &quot;theadManuales&quot;,  
      &quot;theadTramites&quot;,  
      &quot;theadVersiones&quot;,  
      &quot;tbodyManuales&quot;,  
    ].forEach((id) =&gt; {  
      const nodo = $id(id);  
      if (nodo)  
        new MutationObserver(actualizarControles).observe(nodo, {  
          childList: true,  
          subtree: true,  
        });  
    });  
  });  
})();  
 
 


/* ===== KIRIS: eliminar un registro específico de Bitácora ===== */
function cerrarMenuRegistroBitacora() {
  document.getElementById(&quot;menuRegistroBitacoraKiris&quot;)?.remove();
}

function eliminarRegistroBitacora(registroId) {
  const indice = estado.bitacora.findIndex(
    (registro) =&gt; registro.id === registroId,
  );
  if (indice &lt; 0) {
    mostrarToast(&quot;No fue posible localizar el registro.&quot;);
    return;
  }

  const eliminado = { ...estado.bitacora[indice] };
  estado.bitacora.splice(indice, 1);
  guardarEstado(&quot;&quot;);
  renderTodo();
  mostrarDeshacerEliminacion(
    &quot;bitacora&quot;,
    [eliminado],
    [indice],
  );
}

function abrirMenuRegistroBitacora(evento, registroId) {
  cerrarMenuRegistroBitacora();

  const registro = estado.bitacora.find(
    (item) =&gt; item.id === registroId,
  );
  if (!registro) return;

  const menu = document.createElement(&quot;div&quot;);
  menu.id = &quot;menuRegistroBitacoraKiris&quot;;
  menu.innerHTML = `
    &lt;div style=&quot;padding:6px 10px 8px;color:#FF6C0C;font-size:13px;font-weight:800;&quot;&gt;
      Opciones del registro
    &lt;/div&gt;
    &lt;button type=&quot;button&quot; data-accion=&quot;editar&quot;&gt;✏️ Editar registro&lt;/button&gt;
    &lt;button type=&quot;button&quot; data-accion=&quot;eliminar&quot;&gt;🗑️ Eliminar registro&lt;/button&gt;
  `;

  Object.assign(menu.style, {
    position: &quot;fixed&quot;,
    zIndex: &quot;2800&quot;,
    width: &quot;230px&quot;,
    padding: &quot;8px&quot;,
    background: &quot;#FFFFFF&quot;,
    color: &quot;#333333&quot;,
    border: &quot;1px solid #D9D9D9&quot;,
    borderTop: &quot;4px solid #FF6C0C&quot;,
    borderRadius: &quot;12px&quot;,
    boxShadow: &quot;0 12px 34px rgba(0,0,0,.25)&quot;,
  });

  menu.querySelectorAll(&quot;button&quot;).forEach((boton) =&gt; {
    Object.assign(boton.style, {
      display: &quot;block&quot;,
      width: &quot;100%&quot;,
      margin: &quot;0&quot;,
      padding: &quot;10px 11px&quot;,
      background: &quot;#FFFFFF&quot;,
      color: &quot;#333333&quot;,
      border: &quot;0&quot;,
      borderRadius: &quot;8px&quot;,
      fontWeight: &quot;700&quot;,
      textAlign: &quot;left&quot;,
      cursor: &quot;pointer&quot;,
    });
    boton.addEventListener(&quot;mouseenter&quot;, () =&gt; {
      boton.style.background = &quot;#FFF0E6&quot;;
    });
    boton.addEventListener(&quot;mouseleave&quot;, () =&gt; {
      boton.style.background = &quot;#FFFFFF&quot;;
    });
  });

  document.body.appendChild(menu);
  menu.style.left = `${Math.max(8, Math.min(evento.clientX + 4, innerWidth - menu.offsetWidth - 8))}px`;
  menu.style.top = `${Math.max(8, Math.min(evento.clientY + 4, innerHeight - menu.offsetHeight - 8))}px`;

  menu.addEventListener(&quot;click&quot;, (e) =&gt; e.stopPropagation());
  menu.querySelector(&#x27;[data-accion=&quot;editar&quot;]&#x27;).addEventListener(&quot;click&quot;, () =&gt; {
    cerrarMenuRegistroBitacora();
    abrirBitacora(registroId);
  });
  menu.querySelector(&#x27;[data-accion=&quot;eliminar&quot;]&#x27;).addEventListener(&quot;click&quot;, () =&gt; {
    cerrarMenuRegistroBitacora();
    eliminarRegistroBitacora(registroId);
  });
}

document.addEventListener(&quot;click&quot;, cerrarMenuRegistroBitacora);
document.addEventListener(&quot;scroll&quot;, cerrarMenuRegistroBitacora, true);
</pre></td></tr></table></body></html>
