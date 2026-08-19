"use strict";   
 
const $ = (id) => document.getElementById(id);   
const STORAGE_KEY = "kirisV2_estado_maestro";   
const PUBLISHED_KEY = "kirisV2_publicado";   
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];   
const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];   
 
const COLUMNAS_MANUALES = [   
    { key: "seleccion", label: "", width: 42, especial: "seleccion" },   
    { key: "orden", label: "#", width: 62, especial: "orden" },   
    { key: "codigo", label: "Código", width: 120 },   
    { key: "titulo", label: "Título", width: 280 },   
    { key: "idioma", label: "Idioma", width: 110, tipo: "select", opciones: ["Español", "Inglés"] },   
    { key: "archivoElectronico", label: "Archivo electrónico", width: 145, tipo: "select", opciones: ["", "Sí", "No"] },   
    { key: "ocRelacionado", label: "OC relacionado", width: 135 },   
    { key: "prioridad", label: "Prioridad", width: 110, tipo: "select", opciones: ["", "Alta", "Media", "Baja"] },   
    { key: "tipo", label: "Tipo", width: 85, tipo: "select", opciones: ["", "N", "T", "A", "R"] },   
    { key: "paginas", label: "Páginas", width: 95, tipo: "number" },   
    { key: "diasEsfuerzo", label: "Días esfuerzo", width: 120, tipo: "number" },   
    { key: "horasEsfuerzo", label: "Horas esfuerzo", width: 125, tipo: "number" },   
    { key: "tiempoInvertido", label: "Tiempo invertido", width: 125, calculado: true },   
    { key: "fechaInicio", label: "Fecha inicio", width: 130, tipo: "date" },   
    { key: "fechaFinalizacion", label: "Fecha finalización", width: 145, tipo: "date" },   
    { key: "fechaPublicado", label: "Fecha publicado", width: 140, tipo: "date" },   
    { key: "estado", label: "Estado", width: 145, calculado: true },   
    { key: "acciones", label: "Acciones", width: 110, especial: "acciones" }   
];   
 
const COLUMNAS_TRAMITES = [   
    { key: "seleccion", label: "", width: 42, especial: "seleccion" },   
    { key: "requerimiento", label: "Requerimiento", width: 135 },   
    { key: "detalle", label: "Detalle", width: 230 },   
    { key: "fechaIngreso", label: "Fecha ingreso", width: 130, tipo: "date" },   
    { key: "fechaInicio", label: "Fecha inicio", width: 125, tipo: "date" },   
    { key: "manualActualizar", label: "Manual a actualizar", width: 220 },   
    { key: "temaGeneral", label: "Tema general", width: 170 },   
    { key: "baAsignado", label: "BA asignado", width: 150 },   
    { key: "consultas", label: "Consultas / comentarios", width: 260, tipo: "textarea" },   
    { key: "respuestaConsulta", label: "Respuesta a consulta", width: 250, tipo: "textarea" },   
    { key: "justificacionGestor", label: "Justificación en Gestor", width: 180, tipo: "select", opciones: ["", "SÍ", "NO", "NO APLICA"] },   
    { key: "fechaPublicado", label: "Fecha publicado", width: 130, tipo: "date" },   
    { key: "versionTraducir", label: "Versión para traducir agregada", width: 210, tipo: "select", opciones: ["", "SÍ", "NO", "NO APLICA"] },   
    { key: "justificacionIngles", label: "Justificación Gestor Inglés", width: 200, tipo: "select", opciones: ["", "SÍ", "NO", "AÚN NO SE HA TRADUCIDO", "NO APLICA"] },   
    { key: "listo", label: "Listo", width: 230, tipo: "select", opciones: ["", "PENDIENTE", "PENDIENTE / NO SE VE EL CAMBIO", "PENDIENTE / FALTA INFORMACIÓN", "PENDIENTE DE PUBLICAR / LISTA LA ACTUALIZACIÓN", "SOLO ESPAÑOL / NO APLICA INGLÉS", "SOLO ESPAÑOL / FALTA INGLÉS", "SOLO INGLÉS", "AMBOS IDIOMAS"] },   
    { key: "acciones", label: "Acciones", width: 110, especial: "acciones" }   
];   
 
const COLUMNAS_VERSIONES = [   
    { key: "seleccion", label: "", width: 42, especial: "seleccion" },   
    { key: "sistema", label: "Sistema", width: 115, tipo: "select", opciones: ["SISCARD", "siscard+"] },   
    { key: "codigo", label: "Código", width: 125 },   
    { key: "manual", label: "Manual", width: 280 },   
    { key: "idioma", label: "Idioma", width: 110, tipo: "select", opciones: ["Español", "Inglés"] },   
    { key: "numero", label: "Versión disponible", width: 145 },   
    { key: "ubicacionEService", label: "Ubicación en E-service", width: 190 },   
    { key: "fecha", label: "Fecha de versión", width: 135, tipo: "date" },   
    { key: "estado", label: "Estado", width: 130, tipo: "select", opciones: ["Disponible", "Pendiente", "En revisión", "Obsoleta"] },   
    { key: "observaciones", label: "Observaciones", width: 280, tipo: "textarea" },   
    { key: "acciones", label: "Acciones", width: 110, especial: "acciones" }   
];   
 
function id(prefijo) {   
    return `${prefijo}_${Date.now()}_${Math.random().toString(16).slice(2)}`;   
}   
 
function estadoInicial() {   
    return {   
        modo: "editor",   
        ultimaCopia: "",   
        manuales: [{   
            id: id("manual"), codigo: "MAN001", titulo: "Manual de prueba", idioma: "Español",   
            archivoElectronico: "Sí", ocRelacionado: "", prioridad: "Alta", tipo: "N",   
            paginas: 20, diasEsfuerzo: 3, horasEsfuerzo: 8, fechaInicio: fechaISOHoy(),   
            fechaFinalizacion: "", fechaPublicado: "", color: "#FF6C0C"   
        }],   
        tramites: [{   
            id: id("tramite"), requerimiento: "REQ001", detalle: "Trámite de prueba",   
            fechaIngreso: fechaISOHoy(), fechaInicio: "", manualActualizar: "Manual de prueba",   
            temaGeneral: "Parámetros", baAsignado: "", consultas: "", respuestaConsulta: "",   
            justificacionGestor: "", fechaPublicado: "", versionTraducir: "",   
            justificacionIngles: "", listo: "PENDIENTE"   
        }],   
        bitacora: [],   
        versiones: [{   
            id: id("version"), sistema: "SISCARD", codigo: "MAN001", manual: "Manual de prueba",   
            idioma: "Español", numero: "1.0", ubicacionEService: "", fecha: fechaISOHoy(), estado: "Disponible", observaciones: ""   
        }],   
        comentarios: [],   
        ciclo: [],   
        columnasOcultasManuales: [],   
        columnasOcultasTramites: [],   
        anchosManuales: {},   
        anchosTramites: {},   
        anchosVersiones: {}   
    };   
}   
 
function cargarEstado() {   
    try {   
        const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));   
        return guardado && typeof guardado === "object" ? { ...estadoInicial(), ...guardado } : estadoInicial();   
    } catch (error) {   
        console.error("No fue posible cargar los datos locales.", error);   
        return estadoInicial();   
    }   
}   
 
let estado = cargarEstado(); 
estado.tramites = (estado.tramites || []).map((tramite) => ({ ...tramite, listo: normalizarEstadoListo(tramite.listo) })); 
estado.versiones = (estado.versiones || []).map((version) => ({ ubicacionEService: "", ...version }));   
let filtros = { manuales: {}, tramites: {}, versiones: {} };   
let fechaCalendario = new Date();   
let fechaBitacora = new Date();   
let fechaDashboard = new Date();   
let fechasDestinoCopia = [];   
let editorActivo = true;   
 
function guardarEstado(mensaje = "Cambios guardados") {   
    estado.ultimaCopia = new Date().toISOString();   
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));   
    actualizarEstadoGuardado();   
    if (mensaje) mostrarToast(mensaje);   
}   
 
function fechaISOHoy() {   
    const d = new Date();   
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;   
}   
 
function escaparHTML(valor) {   
    return String(valor ?? "")   
        .replaceAll("&", "&amp;")   
        .replaceAll("<", "&lt;")   
        .replaceAll(">", "&gt;")   
        .replaceAll('"', "&quot;")   
        .replaceAll("'", "&#039;");   
}   
 
function normalizar(valor) {   
    return String(valor ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");   
}   
 
function normalizarEstadoListo(valor) { 
    const texto = String(valor ?? "").trim().replace(/AMBOS\s*[ÍI]\s*IDIOMAS/gi, "AMBOS IDIOMAS"); 
    return texto; 
} 
 
function claseListo(valor) { 
    const texto = normalizar(normalizarEstadoListo(valor)); 
    if (texto.startsWith("pendiente")) return "listo-pendiente"; 
    if (texto === "ambos idiomas") return "listo-ambos"; 
    if (texto.startsWith("solo espanol")) return "listo-espanol"; 
    return ""; 
} 
 
function claseEstado(valor) {   
    return `estado-${normalizar(valor).replace(/\s+/g, "-")}`;   
}   
 
function calcularEstadoManual(manual) {   
    if (manual.fechaPublicado) return "Publicado";   
    if (manual.fechaFinalizacion) return "Completado";   
    if (manual.fechaInicio) return "En proceso";   
    return "No iniciado";   
}   
 
function horasBitacoraManual(manual) {   
    return estado.bitacora   
        .filter((registro) => registro.manual === manual.titulo || registro.manual === manual.codigo)   
        .reduce((total, registro) => total + Number(registro.horas || 0), 0);   
}   
 
function mostrarToast(texto) {   
    const toast = $("toast");   
    if (!toast) return;   
    toast.textContent = texto;   
    toast.hidden = false;   
    clearTimeout(mostrarToast.temporizador);   
    mostrarToast.temporizador = setTimeout(() => { toast.hidden = true; }, 2600);   
}   
 
function actualizarEstadoGuardado() {   
    const texto = $("ultimaCopiaTexto");   
    const estadoTexto = $("estadoSincronizacion");   
    if (texto) texto.textContent = estado.ultimaCopia ? new Date(estado.ultimaCopia).toLocaleString("es-CR") : "Sin guardado registrado";   
    if (estadoTexto) estadoTexto.textContent = "Guardado local en este navegador";   
}   
 
function entrar() {   
    estado.modo = "editor";   
    editorActivo = true;   
    document.body.classList.remove("modo-visitante");   
    const app = $("app");   
    if (app) app.hidden = false;   
    const badge = $("modoUsuarioBadge");   
    if (badge) { badge.textContent = "Editor"; badge.className = "modo-badge-editor"; }   
    renderTodo();   
}   
function cerrarSesion() { entrar(); }   
function configurarLogin() { entrar(); }   
function activarTab(tabId) {   
    document.querySelectorAll(".tab-btn").forEach((boton) => {   
        const activo = boton.dataset.tab === tabId;   
        boton.classList.toggle("active", activo);   
        boton.setAttribute("aria-selected", String(activo));   
    });   
    document.querySelectorAll(".tab-content").forEach((panel) => panel.classList.toggle("active", panel.id === tabId));   
    if (tabId === "tabCalendario") renderCalendario();   
    if (tabId === "tabBitacora") renderBitacora();   
    if (tabId === "tabDashboard") renderDashboard();   
    if (tabId === "tabTramites") renderTramites();   
    if (tabId === "tabVersiones") renderVersiones();   
}   
 
function configurarTabs() {   
    document.querySelectorAll(".tab-btn").forEach((boton) => boton.addEventListener("click", () => activarTab(boton.dataset.tab)));   
}   
 
function valorVisible(objeto, columna) {   
    if (columna.key === "tiempoInvertido") return horasBitacoraManual(objeto).toFixed(2);   
    if (columna.key === "estado" && objeto.codigo !== undefined) return calcularEstadoManual(objeto);   
    return objeto[columna.key] ?? "";   
}   
 
function cumpleFiltros(objeto, tipo, columnas) {   
    return columnas.every((columna) => {   
        const filtro = filtros[tipo][columna.key];   
        if (!filtro) return true;   
        return normalizar(valorVisible(objeto, columna)).includes(normalizar(filtro));   
    });   
}   
 
function crearColgroup(elemento, columnas, anchos, ocultas = []) {   
    elemento.innerHTML = columnas.map((columna) => {   
        const oculto = ocultas.includes(columna.key) ? "display:none" : "";   
        const ancho = anchos[columna.key] || columna.width || 120;   
        return `<col data-key="${columna.key}" style="width:${ancho}px;${oculto}">`;   
    }).join("");   
}   
 
function crearEncabezado(elemento, columnas, tipo, ocultas = []) {   
    const filaTitulos = columnas.map((columna) => {   
        const oculto = ocultas.includes(columna.key) ? "display:none" : "";   
        if (columna.especial === "seleccion") return `<th style="${oculto}"><input id="seleccionarTodos_${tipo}" type="checkbox" aria-label="Seleccionar todos"></th>`;   
        return `<th data-key="${columna.key}" style="${oculto}"><div class="th-content"><span>${escaparHTML(columna.label)}</span><span class="resize-handle" data-tipo="${tipo}" data-key="${columna.key}"></span></div></th>`;   
    }).join("");   
    const filaFiltros = columnas.map((columna) => {   
        const oculto = ocultas.includes(columna.key) ? "display:none" : "";   
        if (columna.especial) return `<th style="${oculto}"></th>`;   
        return `<th style="${oculto}"><input class="filter-input" data-tipo="${tipo}" data-key="${columna.key}" value="${escaparHTML(filtros[tipo][columna.key] || "")}" placeholder="Filtrar"></th>`;   
    }).join("");   
    elemento.innerHTML = `<tr>${filaTitulos}</tr><tr class="filters-row">${filaFiltros}</tr>`;   
    elemento.querySelectorAll(".filter-input").forEach((input) => input.addEventListener("input", () => {   
        filtros[input.dataset.tipo][input.dataset.key] = input.value;   
        if (input.dataset.tipo === "manuales") renderManuales();   
        if (input.dataset.tipo === "tramites") renderTramites();   
        if (input.dataset.tipo === "versiones") renderVersiones();   
        const nuevo = document.querySelector(`.filter-input[data-tipo="${input.dataset.tipo}"][data-key="${input.dataset.key}"]`);   
        nuevo?.focus(); nuevo?.setSelectionRange(nuevo.value.length, nuevo.value.length);   
    }));   
}   
 
function campoCelda(objeto, columna, tipoEntidad) {   
    const valor = valorVisible(objeto, columna);   
    if (!editorActivo || columna.calculado) {   
        if (columna.key === "estado") return `<span class="estado ${claseEstado(valor)}">${escaparHTML(valor)}</span>`;   
        if (columna.key === "listo") return `<span class="estado-listo ${claseListo(valor)}">${escaparHTML(normalizarEstadoListo(valor))}</span>`; 
        return escaparHTML(valor);   
    }   
    if (columna.tipo === "select") {   
        const valorSelect = columna.key === "listo" ? normalizarEstadoListo(valor) : valor; 
        const opciones = columna.opciones.map((opcion) => `<option ${String(opcion) === String(valorSelect) ? "selected" : ""}>${escaparHTML(opcion)}</option>`).join("");   
        const claseExtra = columna.key === "listo" ? ` estado-listo ${claseListo(valorSelect)}` : ""; 
        return `<select class="cell-select${claseExtra}" data-entidad="${tipoEntidad}" data-id="${objeto.id}" data-key="${columna.key}">${opciones}</select>`;   
    }   
    if (columna.tipo === "textarea") return `<textarea class="cell-textarea" data-entidad="${tipoEntidad}" data-id="${objeto.id}" data-key="${columna.key}">${escaparHTML(valor)}</textarea>`;   
    return `<input class="cell-input" type="${columna.tipo || "text"}" data-entidad="${tipoEntidad}" data-id="${objeto.id}" data-key="${columna.key}" value="${escaparHTML(valor)}">`;   
}   
 
function enlazarEdicionTabla(contenedor) {   
    contenedor.querySelectorAll(".cell-input,.cell-select,.cell-textarea").forEach((campo) => campo.addEventListener("change", () => {   
        const coleccion = estado[campo.dataset.entidad];   
        const registro = coleccion.find((item) => item.id === campo.dataset.id);   
        if (!registro) return;   
        registro[campo.dataset.key] = campo.type === "number" ? Number(campo.value || 0) : (campo.dataset.key === "listo" ? normalizarEstadoListo(campo.value) : campo.value);   
        guardarEstado("");   
        if (campo.dataset.entidad === "manuales") { renderManuales(); renderCalendario(); }   
        if (campo.dataset.entidad === "tramites") renderTramites();   
        if (campo.dataset.entidad === "versiones") renderVersiones();   
    }));   
}   
 
function renderManuales() {   
    const ocultas = estado.columnasOcultasManuales || [];   
    crearColgroup($("colgroupManuales"), COLUMNAS_MANUALES, estado.anchosManuales || {}, ocultas);   
    crearEncabezado($("theadManuales"), COLUMNAS_MANUALES, "manuales", ocultas);   
    const lista = estado.manuales.filter((objeto) => cumpleFiltros(objeto, "manuales", COLUMNAS_MANUALES));   
    $("tbodyManuales").innerHTML = lista.length ? lista.map((manual) => `<tr data-id="${manual.id}">${COLUMNAS_MANUALES.map((columna) => {   
        const oculto = ocultas.includes(columna.key) ? "display:none" : "";   
        if (columna.especial === "seleccion") return `<td style="${oculto}"><input class="seleccion-manual" type="checkbox" data-id="${manual.id}"></td>`;   
        if (columna.especial === "orden") return `<td class="numero-manual" style="${oculto}"><span class="numero-manual-valor">${estado.manuales.findIndex((item) => item.id === manual.id) + 1}</span><button class="drag-handle drag-manual" type="button" draggable="true" data-id="${manual.id}" title="Arrastrar para reordenar" aria-label="Mover fila ${estado.manuales.findIndex((item) => item.id === manual.id) + 1}">⋮⋮</button></td>`;   
        if (columna.especial === "acciones") return `<td style="${oculto}"><button class="btn-icon editor-only" data-editar-manual="${manual.id}" title="Editar">✏️</button></td>`;   
        return `<td style="${oculto}">${campoCelda(manual, columna, "manuales")}</td>`;   
    }).join("")}</tr>`).join("") : `<tr><td class="empty-state" colspan="${COLUMNAS_MANUALES.length}">No se encontraron manuales que coincidan con la búsqueda.</td></tr>`;   
    enlazarEdicionTabla($("tbodyManuales"));   
    $("seleccionarTodos_manuales")?.addEventListener("change", (e) => document.querySelectorAll(".seleccion-manual").forEach((c) => { c.checked = e.target.checked; }));   
    document.querySelectorAll("[data-editar-manual]").forEach((b) => b.addEventListener("click", () => abrirManual(b.dataset.editarManual)));   
    habilitarReordenamientoManuales(); 
    habilitarRedimensionamiento();   
}   
 
function renderTramites() {   
    const ocultas = estado.columnasOcultasTramites || [];   
    crearColgroup($("colgroupTramites"), COLUMNAS_TRAMITES, estado.anchosTramites || {}, ocultas);   
    crearEncabezado($("theadTramites"), COLUMNAS_TRAMITES, "tramites", ocultas);   
    const lista = estado.tramites.filter((objeto) => cumpleFiltros(objeto, "tramites", COLUMNAS_TRAMITES));   
    $("tbodyTramites").innerHTML = lista.length ? lista.map((tramite) => `<tr data-id="${tramite.id}">${COLUMNAS_TRAMITES.map((columna) => {   
        const oculto = ocultas.includes(columna.key) ? "display:none" : "";   
        if (columna.especial === "seleccion") return `<td style="${oculto}"><input class="seleccion-tramite" type="checkbox" data-id="${tramite.id}"></td>`;   
        if (columna.especial === "acciones") return `<td style="${oculto}"><button class="btn-icon editor-only" data-editar-tramite="${tramite.id}" title="Editar">✏️</button></td>`;   
        return `<td style="${oculto}">${campoCelda(tramite, columna, "tramites")}</td>`;   
    }).join("")}</tr>`).join("") : `<tr><td class="empty-state" colspan="${COLUMNAS_TRAMITES.length}">No se encontraron trámites que coincidan con la búsqueda.</td></tr>`;   
    enlazarEdicionTabla($("tbodyTramites"));   
    $("seleccionarTodos_tramites")?.addEventListener("change", (e) => document.querySelectorAll(".seleccion-tramite").forEach((c) => { c.checked = e.target.checked; }));   
    document.querySelectorAll("[data-editar-tramite]").forEach((b) => b.addEventListener("click", () => abrirTramite(b.dataset.editarTramite)));   
    habilitarRedimensionamiento();   
}   
 
function renderVersiones() {   
    crearColgroup($("colgroupVersiones"), COLUMNAS_VERSIONES, estado.anchosVersiones || {});   
    crearEncabezado($("theadVersiones"), COLUMNAS_VERSIONES, "versiones");   
    const lista = estado.versiones.filter((objeto) => cumpleFiltros(objeto, "versiones", COLUMNAS_VERSIONES));   
    $("tbodyVersiones").innerHTML = lista.length ? lista.map((version) => `<tr data-id="${version.id}">${COLUMNAS_VERSIONES.map((columna) => {   
        if (columna.especial === "seleccion") return `<td><input class="seleccion-version" type="checkbox" data-id="${version.id}"></td>`;   
        if (columna.especial === "acciones") return `<td><button class="btn-icon editor-only" data-editar-version="${version.id}" title="Editar">✏️</button></td>`;   
        return `<td>${campoCelda(version, columna, "versiones")}</td>`;   
    }).join("")}</tr>`).join("") : `<tr><td class="empty-state" colspan="${COLUMNAS_VERSIONES.length}">No se encontraron versiones que coincidan con la búsqueda.</td></tr>`;   
    enlazarEdicionTabla($("tbodyVersiones"));   
    $("seleccionarTodos_versiones")?.addEventListener("change", (e) => document.querySelectorAll(".seleccion-version").forEach((c) => { c.checked = e.target.checked; }));   
    document.querySelectorAll("[data-editar-version]").forEach((b) => b.addEventListener("click", () => abrirVersion(b.dataset.editarVersion)));   
    renderResumenVersiones();   
    habilitarRedimensionamiento();   
}   
 
function renderResumenVersiones() { 
    const ingles = estado.versiones.filter(v => normalizar(v.idioma) === "ingles").length; 
    const espanol = estado.versiones.filter(v => normalizar(v.idioma) === "espanol").length; 
    const siscardPlusIngles = estado.versiones.filter(v => normalizar(v.sistema).includes("siscard+") && normalizar(v.idioma) === "ingles").length; 
    const siscardPlusEspanol = estado.versiones.filter(v => normalizar(v.sistema).includes("siscard+") && normalizar(v.idioma) === "espanol").length; 
    $("resumenVersiones").innerHTML = [ 
        ["Total en Inglés", ingles], 
        ["Total en Español", espanol], 
        ["Total siscard+ Inglés", siscardPlusIngles], 
        ["Total siscard+ Español", siscardPlusEspanol] 
    ].map(([label,value]) => `<div class="kpi-card"><div class="label">${label}</div><div class="value">${value}</div></div>`).join(""); 
}   
 
let manualArrastradoId = ""; 
function habilitarReordenamientoManuales() { 
    const cuerpo = $("tbodyManuales"); 
    if (!cuerpo) return; 
    cuerpo.querySelectorAll(".drag-manual").forEach((handle) => { 
        handle.ondragstart = (evento) => { 
            manualArrastradoId = handle.dataset.id || ""; 
            evento.dataTransfer.effectAllowed = "move"; 
            evento.dataTransfer.setData("text/plain", manualArrastradoId); 
            handle.closest("tr")?.classList.add("dragging"); 
        }; 
        handle.ondragend = () => { 
            cuerpo.querySelectorAll("tr").forEach((fila) => fila.classList.remove("dragging", "drop-target")); 
            manualArrastradoId = ""; 
        }; 
    }); 
    cuerpo.querySelectorAll("tr[data-id]").forEach((filaDestino) => { 
        filaDestino.ondragover = (evento) => { 
            if (!manualArrastradoId || manualArrastradoId === filaDestino.dataset.id) return; 
            evento.preventDefault(); 
            evento.dataTransfer.dropEffect = "move"; 
            cuerpo.querySelectorAll("tr.drop-target").forEach((fila) => fila.classList.remove("drop-target")); 
            filaDestino.classList.add("drop-target"); 
        }; 
        filaDestino.ondragleave = () => filaDestino.classList.remove("drop-target"); 
        filaDestino.ondrop = (evento) => { 
            evento.preventDefault(); 
            const origenId = evento.dataTransfer.getData("text/plain") || manualArrastradoId; 
            const destinoId = filaDestino.dataset.id; 
            const origen = estado.manuales.findIndex((manual) => manual.id === origenId); 
            const destino = estado.manuales.findIndex((manual) => manual.id === destinoId); 
            if (origen < 0 || destino < 0 || origen === destino) return; 
            const [movido] = estado.manuales.splice(origen, 1); 
            const posicionDestino = estado.manuales.findIndex((manual) => manual.id === destinoId); 
            estado.manuales.splice(posicionDestino, 0, movido); 
            guardarEstado("Orden de manuales guardado"); 
            renderManuales(); 
        }; 
    }); 
} 
 
function habilitarRedimensionamiento() {   
    document.querySelectorAll(".resize-handle").forEach((handle) => {   
        handle.onpointerdown = (evento) => {   
            const th = handle.closest("th");   
            const inicioX = evento.clientX;   
            const inicioAncho = th.offsetWidth;   
            const tipo = handle.dataset.tipo;   
            const key = handle.dataset.key;   
            const mover = (e) => {   
                const ancho = Math.max(60, inicioAncho + e.clientX - inicioX);   
                const col = document.querySelector(`#colgroup${tipo[0].toUpperCase() + tipo.slice(1)} col[data-key="${key}"]`);   
                if (col) col.style.width = `${ancho}px`;   
            };   
            const terminar = (e) => {   
                document.removeEventListener("pointermove", mover);   
                document.removeEventListener("pointerup", terminar);   
                const ancho = Math.max(60, inicioAncho + e.clientX - inicioX);   
                const destino = tipo === "manuales" ? estado.anchosManuales : tipo === "tramites" ? estado.anchosTramites : estado.anchosVersiones;   
                destino[key] = ancho;   
                guardarEstado("");   
            };   
            document.addEventListener("pointermove", mover);   
            document.addEventListener("pointerup", terminar);   
        };   
    });   
}   
 
function poblarSelectMesAnio(selectMes, selectAnio, fecha) {   
    selectMes.innerHTML = MESES.map((mes, i) => `<option value="${i}" ${i === fecha.getMonth() ? "selected" : ""}>${mes}</option>`).join("");   
    const anio = fecha.getFullYear();   
    selectAnio.innerHTML = Array.from({ length: 11 }, (_, i) => anio - 5 + i).map((a) => `<option ${a === anio ? "selected" : ""}>${a}</option>`).join("");   
}   
 
function matrizMes(fecha) {   
    const primero = new Date(fecha.getFullYear(), fecha.getMonth(), 1);   
    const inicioSemana = (primero.getDay() + 6) % 7;   
    const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1 - inicioSemana);   
    return Array.from({ length: 42 }, (_, i) => new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i));   
}   
 
function colorManualCalendario(manual) { 
    if (manual.colorCalendario) return manual.colorCalendario; 
    const paleta = ["#FF6C0C","#E63946","#2A9D8F","#3A86FF","#8338EC","#F4A261","#00A896","#D62828","#6A994E","#4D908E","#F72585","#4361EE"]; 
    const clave = String(manual.id || manual.codigo || manual.titulo || "manual"); 
    let hash = 0; 
    for (let i=0;i<clave.length;i++) hash = ((hash << 5) - hash) + clave.charCodeAt(i); 
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
    const fin = fechaValidaManual(manual.fechaFinalizacion || manual.fechaPublicado || manual.fechaInicio); 
    const actual = fechaValidaManual(fechaISO); 
    if (!inicio || !fin || !actual || actual < inicio || actual > fin) return ""; 
    if (inicio.getTime() === fin.getTime()) return "unico"; 
    if (actual.getTime() === inicio.getTime()) return "inicio"; 
    if (actual.getTime() === fin.getTime()) return "final"; 
    return "continuacion"; 
} 
function resumenCalendarioManual(manual) { 
    const horas = horasBitacoraManual(manual); 
    return [ 
        `Manual: ${manual.codigo || ""} - ${manual.titulo || ""}`, 
        `Tipo: ${manual.tipo || ""}`, 
        `Fecha de inicio: ${manual.fechaInicio || ""}`, 
        `Fecha de finalización: ${manual.fechaFinalizacion || manual.fechaPublicado || ""}`, 
        `Tiempo invertido: ${horas.toFixed(2)} h`, 
        `Total de horas registradas: ${horas.toFixed(2)} h` 
    ].join("\n"); 
} 
function renderCalendario() { 
    poblarSelectMesAnio($("selectorMesCalendario"), $("selectorAnioCalendario"), fechaCalendario); 
    $("tituloCalendario").textContent = `${MESES[fechaCalendario.getMonth()]} ${fechaCalendario.getFullYear()}`; 
    const hoy = fechaISOHoy(); 
    const dias = matrizMes(fechaCalendario); 
    const encabezados = DIAS.map(d => `<div class="calendario-encabezado">${d}</div>`).join(""); 
    const celdas = dias.map(dia => { 
        const iso = `${dia.getFullYear()}-${String(dia.getMonth()+1).padStart(2,"0")}-${String(dia.getDate()).padStart(2,"0")}`; 
        const eventos = estado.manuales.map(m => ({manual:m,posicion:posicionEventoManual(m,iso)})).filter(x => x.posicion); 
        return `<div class="calendario-dia ${dia.getMonth()!==fechaCalendario.getMonth()?"fuera-mes":""} ${iso===hoy?"hoy":""}" data-fecha="${iso}"> 
            <div class="calendario-numero">${dia.getDate()}</div> 
            ${eventos.map(({manual,posicion}) => `<div class="calendario-evento evento-${posicion}" style="--evento-color:${colorManualCalendario(manual)};background:${colorManualCalendario(manual)}" title="${escaparHTML(resumenCalendarioManual(manual))}">${escaparHTML(manual.codigo || manual.titulo)}</div>`).join("")} 
        </div>`; 
    }).join(""); 
    $("calendarioManuales").innerHTML = encabezados + celdas; 
}   
 
function renderBitacora() {   
    poblarSelectMesAnio($("selectorMesBitacora"), $("selectorAnioBitacora"), fechaBitacora);   
    $("tituloBitacora").textContent = `Bitácora · ${MESES[fechaBitacora.getMonth()]} ${fechaBitacora.getFullYear()}`;   
    const dias = matrizMes(fechaBitacora);   
    $("calendarioBitacora").innerHTML = DIAS.map((d) => `<div class="calendario-encabezado">${d}</div>`).join("") + dias.map((dia) => {   
        const iso = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`;   
        const registros = estado.bitacora.filter((r) => r.fecha === iso);   
        const horas = registros.reduce((t, r) => t + Number(r.horas || 0), 0);   
        return `<div class="calendario-dia ${dia.getMonth() !== fechaBitacora.getMonth() ? "fuera-mes" : ""}" data-bitacora-fecha="${iso}">   
            <div class="calendario-numero">${dia.getDate()}</div>   
            ${registros.map((r) => `<div class="calendario-evento tipo-${normalizar(r.tipo)}" data-registro-id="${r.id}" title="${escaparHTML(`Manual: ${r.manual || ""}\nTipo: ${r.tipo || ""}\nHora inicio: ${r.horaInicio || ""}\nHora fin: ${r.horaFin || ""}\nHoras: ${Number(r.horas || 0).toFixed(2)}\nPáginas: ${r.paginas ?? ""}\nDetalle: ${r.detalle || ""}`)}">${escaparHTML(r.manual)} · ${Number(r.horas || 0).toFixed(2)} h</div>`).join("")}   
            <div class="bitacora-resumen-dia">${registros.length ? `${registros.length} registro(s) · ${horas.toFixed(2)} h` : ""}</div>   
        </div>`;   
    }).join("");   
    document.querySelectorAll("[data-bitacora-fecha]").forEach((celda) => celda.addEventListener("dblclick", () => editorActivo && abrirBitacora("", celda.dataset.bitacoraFecha)));   
    document.querySelectorAll("[data-registro-id]").forEach((evento) => evento.addEventListener("click", (e) => { e.stopPropagation(); if (editorActivo) abrirBitacora(evento.dataset.registroId); }));   
}   
 
function renderDashboard() {   
    const totalHoras = estado.bitacora.reduce((t, r) => t + Number(r.horas || 0), 0);   
    const publicados = estado.manuales.filter((m) => calcularEstadoManual(m) === "Publicado").length;   
    const enProceso = estado.manuales.filter((m) => calcularEstadoManual(m) === "En proceso").length;   
    const prioridadAlta = estado.manuales.filter((m) => m.prioridad === "Alta").length;   
    $("kpiCards").innerHTML = [["Total de manuales", estado.manuales.length], ["Publicados", publicados], ["En proceso", enProceso], ["Prioridad alta", prioridadAlta], ["Horas registradas", totalHoras.toFixed(2)]].map(([l, v]) => `<div class="kpi-card"><div class="label">${l}</div><div class="value">${v}</div></div>`).join("");   
 
    const porTipo = ["N", "T", "A", "R"].map((tipo) => ({ tipo, horas: estado.bitacora.filter((r) => r.tipo === tipo).reduce((t, r) => t + Number(r.horas || 0), 0) }));   
    const max = Math.max(1, ...porTipo.map((x) => x.horas));   
    $("graficoTiposMes").innerHTML = porTipo.map((x) => `<div class="dashboard-cycle-row"><div class="dashboard-cycle-label">${x.tipo}</div><div class="dashboard-cycle-bar-wrap"><div class="dashboard-cycle-bar" style="width:${(x.horas / max) * 100}%"></div></div><div class="dashboard-cycle-meta">${x.horas.toFixed(2)} h</div></div>`).join("");   
 
    $("selectorMesDashboard").innerHTML = MESES.map((m, i) => `<option value="${i}" ${i === fechaDashboard.getMonth() ? "selected" : ""}>${m}</option>`).join("");   
    $("selectorAnioDashboard").value = fechaDashboard.getFullYear();   
    const registrosMes = estado.bitacora.filter((r) => { const d = new Date(`${r.fecha}T00:00:00`); return d.getMonth() === fechaDashboard.getMonth() && d.getFullYear() === fechaDashboard.getFullYear(); });   
    const mapa = {};   
    registrosMes.forEach((r) => { mapa[r.manual] = (mapa[r.manual] || 0) + Number(r.horas || 0); });   
    $("topManualesHoras").innerHTML = Object.entries(mapa).sort((a, b) => b[1] - a[1]).map(([manual, horas]) => `<div class="fecha-destino-item"><strong>${escaparHTML(manual)}</strong><span>${horas.toFixed(2)} h</span></div>`).join("") || `<div class="empty-state">Sin registros para el mes.</div>`;   
    $("estrategiaSemanal").innerHTML = `<p><strong>Lunes, martes y jueves:</strong> traducciones, actualizaciones y manuales nuevos.</p><p><strong>Miércoles:</strong> requerimientos.</p>`;   
    $("analisisTipos").innerHTML = ["N", "T", "A", "R"].map((tipo) => `<div class="fecha-destino-item"><strong>${tipo}</strong><span>${estado.manuales.filter((m) => m.tipo === tipo).length} manual(es)</span></div>`).join("");   
    renderCiclo();   
}   
 
function renderCiclo() {   
    const datos = estado.ciclo || [];   
    const grupos = {};   
    datos.forEach((d) => { const tipo = d.tipo || "Sin tipo"; (grupos[tipo] ||= []).push(Number(d.dias || 0)); });   
    const resumen = Object.entries(grupos).map(([tipo, valores]) => ({ tipo, promedio: valores.reduce((a, b) => a + b, 0) / valores.length, cantidad: valores.length }));   
    $("resumenDashboardCiclo").innerHTML = resumen.map((x) => `<div class="dashboard-cycle-card"><div class="label">${escaparHTML(x.tipo)}</div><div class="value">${x.promedio.toFixed(1)}</div><div class="small-note">${x.cantidad} caso(s)</div></div>`).join("") || `<div class="empty-state">Importe datos de ciclo para visualizar resultados.</div>`;   
    const max = Math.max(1, ...resumen.map((x) => x.promedio));   
    $("graficoDashboardCiclo").innerHTML = resumen.map((x) => `<div class="dashboard-cycle-row"><div class="dashboard-cycle-label">${escaparHTML(x.tipo)}</div><div class="dashboard-cycle-bar-wrap"><div class="dashboard-cycle-bar" style="width:${(x.promedio / max) * 100}%"></div></div><div class="dashboard-cycle-meta">${x.promedio.toFixed(1)} días</div></div>`).join("");   
}   
 
function abrirPantalla(idPantalla) { $(idPantalla).hidden = false; }   
function cerrarPantalla(idPantalla) { $(idPantalla).hidden = true; }   
 
function abrirManual(manualId = "") {   
    const manual = estado.manuales.find((m) => m.id === manualId);   
    $("manualForm").reset();   
    $("manualId").value = manual?.id || "";   
    $("manualFormTitle").textContent = manual ? "Editar manual" : "Agregar manual";   
    ["codigo", "titulo", "idioma", "archivoElectronico", "ocRelacionado", "prioridad", "tipo", "paginas", "diasEsfuerzo", "fechaInicio", "fechaFinalizacion", "fechaPublicado", "horasEsfuerzo"].forEach((key) => { const campo = $(`manual${key[0].toUpperCase()}${key.slice(1)}`); if (campo) campo.value = manual?.[key] ?? ""; });   
    $("manualEstado").value = manual ? calcularEstadoManual(manual) : "No iniciado";   
    abrirPantalla("manualScreen");   
}   
 
function guardarManualFormulario(evento) {   
    evento.preventDefault();   
    const existenteId = $("manualId").value;   
    const datos = { id: existenteId || id("manual"), codigo: $("manualCodigo").value.trim(), titulo: $("manualTitulo").value.trim(), idioma: $("manualIdioma").value, archivoElectronico: $("manualArchivoElectronico").value, ocRelacionado: $("manualOcRelacionado").value.trim(), prioridad: $("manualPrioridad").value, tipo: $("manualTipo").value, paginas: Number($("manualPaginas").value || 0), diasEsfuerzo: Number($("manualDiasEsfuerzo").value || 0), fechaInicio: $("manualFechaInicio").value, fechaFinalizacion: $("manualFechaFinalizacion").value, fechaPublicado: $("manualFechaPublicado").value, horasEsfuerzo: Number($("manualHorasEsfuerzo").value || 0), color: estado.manuales.find((m) => m.id === existenteId)?.color || "#FF6C0C" };   
    const indice = estado.manuales.findIndex((m) => m.id === existenteId);   
    if (indice >= 0) estado.manuales[indice] = datos; else estado.manuales.unshift(datos);   
    guardarEstado("Manual guardado"); cerrarPantalla("manualScreen"); renderTodo();   
}   
 
function abrirTramite(tramiteId = "") {   
    const t = estado.tramites.find((x) => x.id === tramiteId);   
    $("tramiteForm").reset(); $("tramiteId").value = t?.id || ""; $("tramiteFormTitle").textContent = t ? "Editar trámite" : "Nuevo trámite";   
    const mapa = { Requerimiento: "requerimiento", Detalle: "detalle", FechaIngreso: "fechaIngreso", FechaInicio: "fechaInicio", ManualActualizar: "manualActualizar", TemaGeneral: "temaGeneral", BAAsignado: "baAsignado", Consultas: "consultas", RespuestaConsulta: "respuestaConsulta", JustificacionGestor: "justificacionGestor", FechaPublicado: "fechaPublicado", VersionTraducir: "versionTraducir", JustificacionIngles: "justificacionIngles", Listo: "listo" };   
    Object.entries(mapa).forEach(([sufijo, key]) => { $(`tramite${sufijo}`).value = t?.[key] ?? ""; });   
    abrirPantalla("tramiteScreen");   
}   
 
function guardarTramiteFormulario(evento) {   
    evento.preventDefault(); const existenteId = $("tramiteId").value;   
    const datos = { id: existenteId || id("tramite"), requerimiento: $("tramiteRequerimiento").value.trim(), detalle: $("tramiteDetalle").value.trim(), fechaIngreso: $("tramiteFechaIngreso").value, fechaInicio: $("tramiteFechaInicio").value, manualActualizar: $("tramiteManualActualizar").value.trim(), temaGeneral: $("tramiteTemaGeneral").value.trim(), baAsignado: $("tramiteBAAsignado").value.trim(), consultas: $("tramiteConsultas").value.trim(), respuestaConsulta: $("tramiteRespuestaConsulta").value.trim(), justificacionGestor: $("tramiteJustificacionGestor").value, fechaPublicado: $("tramiteFechaPublicado").value, versionTraducir: $("tramiteVersionTraducir").value, justificacionIngles: $("tramiteJustificacionIngles").value, listo: $("tramiteListo").value };   
    const indice = estado.tramites.findIndex((x) => x.id === existenteId); if (indice >= 0) estado.tramites[indice] = datos; else estado.tramites.unshift(datos);   
    guardarEstado("Trámite guardado"); cerrarPantalla("tramiteScreen"); renderTramites();   
}   
 
function calcularHoras(inicio, fin) {   
    if (!inicio || !fin) return 0; const [hi, mi] = inicio.split(":").map(Number); const [hf, mf] = fin.split(":").map(Number); let minutos = hf * 60 + mf - (hi * 60 + mi); if (minutos < 0) minutos += 1440; return minutos / 60;   
}   
 
function abrirBitacora(registroId = "", fecha = fechaISOHoy()) {   
    const r = estado.bitacora.find((x) => x.id === registroId); $("bitacoraForm").reset(); $("bitacoraId").value = r?.id || ""; $("bitacoraFormTitle").textContent = r ? "Editar registro de Bitácora" : "Registro de Bitácora";   
    $("bitacoraFecha").value = r?.fecha || fecha; $("bitacoraManual").value = r?.manual || ""; $("bitacoraTipo").value = r?.tipo || ""; $("bitacoraHoraInicio").value = r?.horaInicio || ""; $("bitacoraHoraFin").value = r?.horaFin || ""; $("bitacoraHoras").value = r?.horas || ""; $("bitacoraPaginas").value = r?.paginas || ""; $("bitacoraDetalle").value = r?.detalle || ""; abrirPantalla("bitacoraScreen");   
}   
 
function guardarBitacoraFormulario(evento) {   
    evento.preventDefault(); const existenteId = $("bitacoraId").value; const manual = estado.manuales.find((m) => m.titulo === $("bitacoraManual").value || m.codigo === $("bitacoraManual").value);   
    const datos = { id: existenteId || id("bitacora"), fecha: $("bitacoraFecha").value, manual: $("bitacoraManual").value.trim(), tipo: $("bitacoraTipo").value || manual?.tipo || "", horaInicio: $("bitacoraHoraInicio").value, horaFin: $("bitacoraHoraFin").value, horas: calcularHoras($("bitacoraHoraInicio").value, $("bitacoraHoraFin").value), paginas: Number($("bitacoraPaginas").value || 0), detalle: $("bitacoraDetalle").value.trim() };   
    const indice = estado.bitacora.findIndex((x) => x.id === existenteId); if (indice >= 0) estado.bitacora[indice] = datos; else estado.bitacora.unshift(datos);   
    guardarEstado("Registro de Bitácora guardado"); cerrarPantalla("bitacoraScreen"); renderTodo();   
}   
 
function abrirVersion(versionId = "") {   
    const v = estado.versiones.find((x) => x.id === versionId); $("versionForm").reset(); $("versionId").value = v?.id || ""; $("versionFormTitle").textContent = v ? "Editar versión" : "Agregar versión";   
    $("versionSistema").value = v?.sistema || "SISCARD"; $("versionCodigo").value = v?.codigo || ""; $("versionManual").value = v?.manual || ""; $("versionIdioma").value = v?.idioma || "Español"; $("versionNumero").value = v?.numero || ""; $("versionUbicacionEService").value = v?.ubicacionEService || ""; $("versionFecha").value = v?.fecha || ""; $("versionEstado").value = v?.estado || "Disponible"; $("versionObservaciones").value = v?.observaciones || ""; abrirPantalla("versionScreen");   
}   
 
function guardarVersionFormulario(evento) {   
    evento.preventDefault(); const existenteId = $("versionId").value; const datos = { id: existenteId || id("version"), sistema: $("versionSistema").value, codigo: $("versionCodigo").value.trim(), manual: $("versionManual").value.trim(), idioma: $("versionIdioma").value, numero: $("versionNumero").value.trim(), ubicacionEService: $("versionUbicacionEService").value.trim(), fecha: $("versionFecha").value, estado: $("versionEstado").value, observaciones: $("versionObservaciones").value.trim() };   
    const indice = estado.versiones.findIndex((x) => x.id === existenteId); if (indice >= 0) estado.versiones[indice] = datos; else estado.versiones.unshift(datos);   
    guardarEstado("Versión guardada"); cerrarPantalla("versionScreen"); renderVersiones();   
}   
 
function eliminarSeleccionados(tipo) {   
    const singular = tipo === "manuales" ? "manual" : tipo === "tramites" ? "tramite" : "version"; const clase = `.seleccion-${singular}:checked`; const ids = [...document.querySelectorAll(clase)].map((c) => c.dataset.id);   
    if (!ids.length) return mostrarToast("No hay registros seleccionados");   
    if (!confirm(`¿Eliminar ${ids.length} registro(s)?`)) return;   
    estado[tipo] = estado[tipo].filter((item) => !ids.includes(item.id)); guardarEstado("Registros eliminados");   
    if (tipo === "manuales") renderManuales(); if (tipo === "tramites") renderTramites(); if (tipo === "versiones") renderVersiones();   
}   
 
function poblarDatalists() {   
    const opciones = estado.manuales.map((m) => `<option value="${escaparHTML(m.titulo)}">${escaparHTML(m.codigo)}</option>`).join("");   
    $("listaManualesTramite").innerHTML = opciones; $("listaManualesBitacora").innerHTML = opciones;   
    $("listaTemasTramite").innerHTML = [...new Set(estado.tramites.map((t) => t.temaGeneral).filter(Boolean))].map((x) => `<option value="${escaparHTML(x)}"></option>`).join("");   
}   
 
function abrirColumnas(tipo) {   
    const esManual = tipo === "manuales"; const panel = $(esManual ? "columnsPanelManuales" : "columnsPanelTramites"); const lista = $(esManual ? "columnsListManuales" : "columnsListTramites"); const columnas = esManual ? COLUMNAS_MANUALES : COLUMNAS_TRAMITES; const ocultas = esManual ? estado.columnasOcultasManuales : estado.columnasOcultasTramites;   
    lista.innerHTML = columnas.filter((c) => !c.especial).map((c) => `<label><input type="checkbox" data-columna="${c.key}" ${!ocultas.includes(c.key) ? "checked" : ""}>${escaparHTML(c.label)}</label>`).join("");   
    lista.querySelectorAll("input").forEach((input) => input.addEventListener("change", () => { const destino = esManual ? estado.columnasOcultasManuales : estado.columnasOcultasTramites; if (input.checked) estado[esManual ? "columnasOcultasManuales" : "columnasOcultasTramites"] = destino.filter((x) => x !== input.dataset.columna); else if (!destino.includes(input.dataset.columna)) destino.push(input.dataset.columna); guardarEstado(""); esManual ? renderManuales() : renderTramites(); }));   
    panel.hidden = false;   
}   
 
function descargar(nombre, contenido, tipo = "text/plain;charset=utf-8") {   
    const blob = new Blob([contenido], { type: tipo }); const enlace = document.createElement("a"); enlace.href = URL.createObjectURL(blob); enlace.download = nombre; enlace.click(); URL.revokeObjectURL(enlace.href);   
}   
 
function exportarCSV(tipo) {   
    const columnas = tipo === "manuales" ? COLUMNAS_MANUALES : tipo === "tramites" ? COLUMNAS_TRAMITES : COLUMNAS_VERSIONES;   
    const utiles = columnas.filter((c) => !c.especial && !c.calculado); const filas = [utiles.map((c) => c.label), ...estado[tipo].map((item) => utiles.map((c) => item[c.key] ?? ""))];   
    descargar(`${tipo}.csv`, filas.map((fila) => fila.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n"), "text/csv;charset=utf-8");   
}   
 
function publicarCambios() {   
    const paquete = { version: 1, fechaPublicacion: new Date().toISOString(), manuales: estado.manuales, bitacora: estado.bitacora, tramites: estado.tramites, versiones: estado.versiones, ciclo: estado.ciclo };   
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(paquete));   
    descargar("BASE_GESTOR_PUBLICADO.json", JSON.stringify(paquete, null, 2), "application/json;charset=utf-8");   
    mostrarToast("Versión publicada generada");   
}   
 
function configurarCalendarios() {   
    $("btnCalendarioAnterior").addEventListener("click", () => { fechaCalendario.setMonth(fechaCalendario.getMonth() - 1); renderCalendario(); });   
    $("btnCalendarioSiguiente").addEventListener("click", () => { fechaCalendario.setMonth(fechaCalendario.getMonth() + 1); renderCalendario(); });   
    $("btnCalendarioHoy").addEventListener("click", () => { fechaCalendario = new Date(); renderCalendario(); });   
    $("selectorMesCalendario").addEventListener("change", (e) => { fechaCalendario.setMonth(Number(e.target.value)); renderCalendario(); });   
    $("selectorAnioCalendario").addEventListener("change", (e) => { fechaCalendario.setFullYear(Number(e.target.value)); renderCalendario(); });   
    $("btnBitacoraAnterior").addEventListener("click", () => { fechaBitacora.setMonth(fechaBitacora.getMonth() - 1); renderBitacora(); });   
    $("btnBitacoraSiguiente").addEventListener("click", () => { fechaBitacora.setMonth(fechaBitacora.getMonth() + 1); renderBitacora(); });   
    $("selectorMesBitacora").addEventListener("change", (e) => { fechaBitacora.setMonth(Number(e.target.value)); renderBitacora(); });   
    $("selectorAnioBitacora").addEventListener("change", (e) => { fechaBitacora.setFullYear(Number(e.target.value)); renderBitacora(); });   
    $("btnDashboardMesAnterior").addEventListener("click", () => { fechaDashboard.setMonth(fechaDashboard.getMonth() - 1); renderDashboard(); });   
    $("btnDashboardMesSiguiente").addEventListener("click", () => { fechaDashboard.setMonth(fechaDashboard.getMonth() + 1); renderDashboard(); });   
    $("selectorMesDashboard").addEventListener("change", (e) => { fechaDashboard.setMonth(Number(e.target.value)); renderDashboard(); });   
    $("selectorAnioDashboard").addEventListener("change", (e) => { fechaDashboard.setFullYear(Number(e.target.value)); renderDashboard(); });   
}   
 
function configurarComentarios() {   
    $("feedbackFloatingBtn").addEventListener("click", () => { $("feedbackPanel").hidden = !$("feedbackPanel").hidden; renderComentarios(); });   
    $("btnCerrarFeedback").addEventListener("click", () => { $("feedbackPanel").hidden = true; });   
    $("feedbackForm").addEventListener("submit", (e) => { e.preventDefault(); estado.comentarios.unshift({ id: id("comentario"), nombre: $("feedbackNombre").value.trim(), seccion: $("feedbackSeccion").value, comentario: $("feedbackComentario").value.trim(), fecha: new Date().toISOString() }); guardarEstado("Comentario guardado"); e.target.reset(); renderComentarios(); });   
}   
 
function renderComentarios() {   
    $("feedbackList").innerHTML = estado.comentarios.map((c) => `<article class="feedback-card"><div class="feedback-card-title">${escaparHTML(c.seccion)}</div><div class="feedback-card-meta">${escaparHTML(c.nombre)} · ${new Date(c.fecha).toLocaleString("es-CR")}</div><div>${escaparHTML(c.comentario)}</div></article>`).join("") || `<div class="empty-state">Sin comentarios.</div>`;   
}   
 
function configurarFormularios() {   
    $("manualForm").addEventListener("submit", guardarManualFormulario); $("tramiteForm").addEventListener("submit", guardarTramiteFormulario); $("bitacoraForm").addEventListener("submit", guardarBitacoraFormulario); $("versionForm").addEventListener("submit", guardarVersionFormulario);   
    [["btnCerrarManual", "manualScreen"], ["btnCancelarManual", "manualScreen"], ["btnCerrarTramite", "tramiteScreen"], ["btnCancelarTramite", "tramiteScreen"], ["btnCerrarBitacora", "bitacoraScreen"], ["btnCancelarBitacora", "bitacoraScreen"], ["btnCerrarVersion", "versionScreen"], ["btnCancelarVersion", "versionScreen"]].forEach(([boton, pantalla]) => $(boton).addEventListener("click", () => cerrarPantalla(pantalla)));   
    ["bitacoraHoraInicio", "bitacoraHoraFin"].forEach((campo) => $(campo).addEventListener("change", () => { $("bitacoraHoras").value = calcularHoras($("bitacoraHoraInicio").value, $("bitacoraHoraFin").value).toFixed(2); }));   
    $("bitacoraManual").addEventListener("change", () => { const m = estado.manuales.find((x) => x.titulo === $("bitacoraManual").value || x.codigo === $("bitacoraManual").value); $("bitacoraTipo").value = m?.tipo || ""; });   
}   
 
function parsearCSV(texto) {   
    const filas=[]; let fila=[],campo="",comillas=false;   
    for(let i=0;i<texto.length;i++){const ch=texto[i],sig=texto[i+1];if(ch==='"'&&comillas&&sig==='"'){campo+='"';i++;}else if(ch==='"'){comillas=!comillas;}else if(ch===','&&!comillas){fila.push(campo);campo="";}else if((ch==='\n'||ch==='\r')&&!comillas){if(ch==='\r'&&sig==='\n')i++;fila.push(campo);if(fila.some(v=>String(v).trim()!==""))filas.push(fila);fila=[];campo="";}else{campo+=ch;}}   
    fila.push(campo);if(fila.some(v=>String(v).trim()!==""))filas.push(fila);return filas;   
}   
function normalizarEncabezado(v){return normalizar(v).replace(/[^a-z0-9]/g,"");}   
async function importarCSV(tipo,archivo){   
    if(!archivo)return;try{const matriz=parsearCSV(await archivo.text());if(matriz.length<2)throw new Error("El archivo no contiene registros");const columnas=tipo==="manuales"?COLUMNAS_MANUALES:tipo==="tramites"?COLUMNAS_TRAMITES:COLUMNAS_VERSIONES;const utiles=columnas.filter(c=>!c.especial&&!c.calculado),headers=matriz[0].map(normalizarEncabezado);const nuevos=matriz.slice(1).map(fila=>{const obj={id:id(tipo.slice(0,-1))};utiles.forEach(c=>{const ix=headers.findIndex(h=>h===normalizarEncabezado(c.label)||h===normalizarEncabezado(c.key));let v=ix>=0?(fila[ix]??""):"";if(c.tipo==="number")v=Number(v||0);obj[c.key]=v;});return obj;}).filter(o=>utiles.some(c=>String(o[c.key]??"").trim()!==""));if(!nuevos.length)throw new Error("No se encontraron filas válidas");if(confirm(`¿Reemplazar los registros de ${tipo}?\nAceptar = reemplazar. Cancelar = agregar.`))estado[tipo]=nuevos;else estado[tipo].push(...nuevos);guardarEstado(`${nuevos.length} registro(s) importado(s)`);renderTodo();}catch(error){console.error(error);mostrarToast(`No fue posible importar: ${error.message}`);}   
}   
function exportarRespaldoCompleto() { 
    const respaldo = { 
        tipo: "KIRIS_V2_RESPALDO_COMPLETO", 
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
                ultimaCopia: estado.ultimaCopia || "", 
                columnasOcultasManuales: estado.columnasOcultasManuales || [], 
                columnasOcultasTramites: estado.columnasOcultasTramites || [], 
                anchosManuales: estado.anchosManuales || {}, 
                anchosTramites: estado.anchosTramites || {}, 
                anchosVersiones: estado.anchosVersiones || {} 
            } 
        } 
    }; 
    descargar(`KIRIS_RESPALDO_COMPLETO_${fechaISOHoy()}.json`, JSON.stringify(respaldo,null,2), "application/json;charset=utf-8"); 
    mostrarToast("Copia de seguridad completa generada"); 
}   
async function importarRespaldoCompleto(archivo) { 
    if (!archivo) return; 
    try { 
        const respaldo = JSON.parse(await archivo.text()); 
        const origen = respaldo?.tipo === "KIRIS_V2_RESPALDO_COMPLETO" ? respaldo.datos : respaldo; 
        if (!origen || typeof origen !== "object") throw new Error("JSON inválido"); 
        if (!confirm("¿Reemplazar toda la información actual con este respaldo?")) return; 
        const config = origen.configuracion || {}; 
        estado = { 
            ...estadoInicial(), 
            manuales: origen.manuales || origen.calendario || [], 
            bitacora: origen.bitacora || [], 
            ciclo: origen.dashboardProduccion || origen.ciclo || [], 
            tramites: origen.tramites || [], 
            versiones: origen.controlVersiones || origen.versiones || [], 
            comentarios: origen.comentarios || [], 
            ultimaCopia: config.ultimaCopia || origen.ultimaCopia || "", 
            columnasOcultasManuales: config.columnasOcultasManuales || origen.columnasOcultasManuales || [], 
            columnasOcultasTramites: config.columnasOcultasTramites || origen.columnasOcultasTramites || [], 
            anchosManuales: config.anchosManuales || origen.anchosManuales || {}, 
            anchosTramites: config.anchosTramites || origen.anchosTramites || {}, 
            anchosVersiones: config.anchosVersiones || origen.anchosVersiones || {}, 
            modo: "editor" 
        }; 
        editorActivo = true; 
        guardarEstado("Respaldo completo restaurado"); 
        renderTodo(); 
    } catch(error) { 
        console.error(error); 
        mostrarToast(`No fue posible restaurar: ${error.message}`); 
    } 
}   
async function publicarCambios() {   
    const paquete={version:1,fechaPublicacion:new Date().toISOString(),manuales:estado.manuales,bitacora:estado.bitacora,tramites:estado.tramites,versiones:estado.versiones,ciclo:estado.ciclo};   
    try{if(window.KirisStorage?.publicar){await window.KirisStorage.publicar(paquete);localStorage.setItem(PUBLISHED_KEY,JSON.stringify(paquete));mostrarToast("Cambios publicados en GitHub");}else{throw new Error("El módulo storage.js no está disponible");}}catch(error){console.error(error);mostrarToast(error.message||"No fue posible publicar");}   
}   
function configurarBotones() {   
    $("btnAgregarManual").addEventListener("click", () => abrirManual()); $("btnAgregarTramite").addEventListener("click", () => abrirTramite()); $("btnAgregarVersion").addEventListener("click", () => abrirVersion());   
    $("btnEliminarManuales").addEventListener("click", () => eliminarSeleccionados("manuales")); $("btnEliminarTramites").addEventListener("click", () => eliminarSeleccionados("tramites")); $("btnEliminarVersiones").addEventListener("click", () => eliminarSeleccionados("versiones"));   
    $("btnLimpiarFiltrosManuales").addEventListener("click", () => { filtros.manuales = {}; renderManuales(); }); $("btnLimpiarFiltrosTramites").addEventListener("click", () => { filtros.tramites = {}; renderTramites(); }); $("btnLimpiarFiltrosVersiones").addEventListener("click", () => { filtros.versiones = {}; renderVersiones(); });   
    $("btnExportarManuales").addEventListener("click", () => exportarCSV("manuales")); $("btnExportarTramites").addEventListener("click", () => exportarCSV("tramites")); $("btnExportarVersiones").addEventListener("click", () => exportarCSV("versiones"));   
    $("btnColumnasManuales").addEventListener("click", () => abrirColumnas("manuales")); $("btnColumnasTramites").addEventListener("click", () => abrirColumnas("tramites"));   
    $("btnCerrarColumnasManuales").addEventListener("click", () => { $("columnsPanelManuales").hidden = true; }); $("btnCerrarColumnasTramites").addEventListener("click", () => { $("columnsPanelTramites").hidden = true; });   
    $("btnMostrarTodasManuales").addEventListener("click", () => { estado.columnasOcultasManuales = []; guardarEstado(""); renderManuales(); abrirColumnas("manuales"); }); $("btnMostrarTodasTramites").addEventListener("click", () => { estado.columnasOcultasTramites = []; guardarEstado(""); renderTramites(); abrirColumnas("tramites"); });   
    $("btnGuardarNube").addEventListener("click", () => guardarEstado("Información guardada")); $("btnPublicarCambios").addEventListener("click", publicarCambios);   
    $("btnPantallaCompleta").addEventListener("click", () => { const panel = $("panelManuales"); if (!document.fullscreenElement) panel.requestFullscreen?.(); else document.exitFullscreen?.(); });   
    $("btnExportarDashboard").addEventListener("click", () => descargar("dashboard_kiris.json", JSON.stringify({ manuales: estado.manuales, bitacora: estado.bitacora, ciclo: estado.ciclo }, null, 2), "application/json"));   
    $("btnVerDetalleCiclo").addEventListener("click", abrirDetalleProduccion);   
 
    $("btnAgregarBitacora")?.addEventListener("click", () => abrirBitacora());   
    $("btnImportarManuales")?.addEventListener("click", () => $("inputExcelManuales").click());   
    $("btnImportarTramites")?.addEventListener("click", () => $("inputExcelTramites").click());   
    $("btnImportarVersiones")?.addEventListener("click", () => $("inputExcelVersiones").click());   
    $("inputExcelManuales")?.addEventListener("change", e => importarCSV("manuales",e.target.files[0]).finally(()=>e.target.value=""));   
    $("inputExcelTramites")?.addEventListener("change", e => importarCSV("tramites",e.target.files[0]).finally(()=>e.target.value=""));   
    $("inputExcelVersiones")?.addEventListener("change", e => importarControlVersionesXLSX(e.target.files[0]).finally(()=>e.target.value=""));   
    $("btnExportarRespaldo")?.addEventListener("click", exportarRespaldoCompleto);   
    $("btnImportarRespaldo")?.addEventListener("click", () => $("inputRespaldoCompleto").click());   
    $("inputRespaldoCompleto")?.addEventListener("change", e => importarRespaldoCompleto(e.target.files[0]).finally(()=>e.target.value=""));   
}   
 
function renderTodo() {   
    actualizarEstadoGuardado(); poblarDatalists(); renderManuales(); renderCalendario(); renderBitacora(); renderDashboard(); renderTramites(); renderVersiones();   
}   
 
function inicializar() {   
    configurarLogin(); configurarTabs(); configurarCalendarios(); configurarFormularios(); configurarBotones();   
    actualizarEstadoGuardado();   
}   
 
document.addEventListener("DOMContentLoaded", inicializar);   
 
 
 
/* ===== KIRIS V3: mejoras funcionales solicitadas ===== */  
let eliminacionPendiente = null;  
function renderEntidad(tipo){if(tipo==="manuales")renderManuales();else if(tipo==="tramites")renderTramites();else renderVersiones();}  
function mostrarDeshacerEliminacion(tipo, eliminados, indices){  
    document.getElementById("undoToastKiris")?.remove();  
    const t=document.createElement("div");t.id="undoToastKiris";t.className="undo-toast";  
    t.innerHTML=`<span>${eliminados.length} registro(s) eliminado(s)</span><button type="button">↩ Deshacer eliminación</button><div class="undo-progress"></div>`;  
    document.body.appendChild(t); const token=Date.now(); eliminacionPendiente={token,tipo,eliminados,indices};  
    t.querySelector("button").onclick=()=>{if(!eliminacionPendiente||eliminacionPendiente.token!==token)return; const lista=estado[tipo]; eliminados.forEach((item,i)=>lista.splice(indices[i],0,item)); eliminacionPendiente=null; guardarEstado("");renderEntidad(tipo);t.remove();mostrarToast("Eliminación deshecha");};  
    setTimeout(()=>{if(eliminacionPendiente?.token===token)eliminacionPendiente=null;t.remove();},5000);  
}  
function eliminarSeleccionados(tipo){  
    const singular=tipo==="manuales"?"manual":tipo==="tramites"?"tramite":"version";  
    const ids=[...document.querySelectorAll(`.seleccion-${singular}:checked`)].map(c=>c.dataset.id);  
    if(!ids.length)return mostrarToast("No hay registros seleccionados");  
    if(!confirm(`¿Eliminar ${ids.length} registro(s)? Podrá deshacerse durante 5 segundos.`))return;  
    const indices=[],eliminados=[];estado[tipo].forEach((x,i)=>{if(ids.includes(x.id)){indices.push(i);eliminados.push({...x});}});  
    estado[tipo]=estado[tipo].filter(x=>!ids.includes(x.id));guardarEstado("");renderEntidad(tipo);mostrarDeshacerEliminacion(tipo,eliminados,indices);  
}  
 
/* Filtros combinados: escritura manual + casillas estilo Excel */  
let filtroMenuActivo=null;  
function valoresUnicos(tipo,columna){const cols=tipo==="manuales"?COLUMNAS_MANUALES:tipo==="tramites"?COLUMNAS_TRAMITES:COLUMNAS_VERSIONES;return [...new Set(estado[tipo].map(o=>String(valorVisible(o,columna)??"").trim()||"(Vacío)"))].sort((a,b)=>a.localeCompare(b,"es",{numeric:true,sensitivity:"base"}));}  
function cumpleFiltros(objeto,tipo,columnas){return columnas.every(col=>{const config=filtros[tipo][col.key];if(!config)return true;const valor=String(valorVisible(objeto,col)??"");if(typeof config==="string")return normalizar(valor).includes(normalizar(config));const texto=config.texto||"";const selecciones=config.valores||[];const mostrado=valor.trim()||"(Vacío)";return(!texto||normalizar(valor).includes(normalizar(texto)))&&(!selecciones.length||selecciones.includes(mostrado));});}  
function cerrarMenuFiltroKiris(){document.getElementById("excelFilterMenuKiris")?.remove();filtroMenuActivo=null;}  
function abrirMenuFiltroKiris(event,tipo,columna,input){event.stopPropagation();cerrarMenuFiltroKiris();filtroMenuActivo={tipo,key:columna.key};const config=typeof filtros[tipo][columna.key]==="object"?filtros[tipo][columna.key]:{texto:filtros[tipo][columna.key]||"",valores:[]};const menu=document.createElement("div");menu.id="excelFilterMenuKiris";menu.className="excel-filter-menu";const valores=valoresUnicos(tipo,columna);menu.innerHTML=`<h4>${escaparHTML(columna.label)}</h4><input class="excel-filter-search" placeholder="Buscar valores en la lista"><label><input class="todos" type="checkbox" ${!config.valores.length?"checked":""}> Seleccionar todos</label><div class="excel-filter-options">${valores.map(v=>`<label data-text="${escaparHTML(normalizar(v))}"><input type="checkbox" value="${escaparHTML(v)}" ${config.valores.includes(v)?"checked":""}> ${escaparHTML(v)}</label>`).join("")}</div><div class="excel-filter-actions"><button class="limpiar">Limpiar</button><button class="aplicar">Aplicar</button></div>`;document.body.appendChild(menu);const r=input.getBoundingClientRect();menu.style.left=Math.min(r.left,innerWidth-332)+"px";menu.style.top=Math.min(r.bottom+4,innerHeight-432)+"px";  
    const buscar=menu.querySelector(".excel-filter-search");buscar.oninput=()=>menu.querySelectorAll(".excel-filter-options label").forEach(l=>l.hidden=!l.dataset.text.includes(normalizar(buscar.value)));  
    menu.querySelector(".todos").onchange=e=>menu.querySelectorAll(".excel-filter-options input").forEach(ch=>{if(!ch.closest("label").hidden)ch.checked=e.target.checked;});  
    menu.querySelector(".limpiar").onclick=()=>{delete filtros[tipo][columna.key];cerrarMenuFiltroKiris();renderEntidad(tipo);};  
    menu.querySelector(".aplicar").onclick=()=>{const seleccion=[...menu.querySelectorAll(".excel-filter-options input:checked")].map(x=>x.value);filtros[tipo][columna.key]={texto:input.value,valores:seleccion.length===valores.length?[]:seleccion};cerrarMenuFiltroKiris();renderEntidad(tipo);};menu.onclick=e=>e.stopPropagation();  
}  
function opcionesFiltroInline(tipo, columna) { 
    return [...new Set(estado[tipo].map((fila) => { 
        const valor = columna.key === "listo" ? normalizarEstadoListo(valorVisible(fila, columna)) : valorVisible(fila, columna); 
        return String(valor).trim() || "(Vacío)"; 
    }))].sort((a, b) => a.localeCompare(b, "es", { numeric: true })); 
} 
function abrirFiltroInlineKiris(evento, tipo, columna, input) { 
    evento.stopPropagation(); 
    input.focus(); 
    document.querySelectorAll(".inline-filter-options").forEach((panel) => panel.remove()); 
    const cfg = filtros[tipo][columna.key]; 
    const seleccionados = typeof cfg === "object" ? (cfg.valores || []) : []; 
    const textoActual = input.value || ""; 
    const valores = opcionesFiltroInline(tipo, columna).filter((valor) => !textoActual || normalizar(valor).includes(normalizar(textoActual))); 
    const panel = document.createElement("div"); 
    panel.className = "inline-filter-options"; 
    panel.innerHTML = `<div class="inline-filter-list">${valores.map((valor) => `<label class="inline-filter-option"><input type="checkbox" value="${escaparHTML(valor)}" ${!seleccionados.length || seleccionados.includes(valor) ? "checked" : ""}><span>${escaparHTML(valor)}</span></label>`).join("")}</div><div class="inline-filter-actions"><button type="button" class="btn-inline-clear">Limpiar</button><button type="button" class="btn-inline-apply">Aplicar</button></div>`; 
    input.closest("th").appendChild(panel); 
    panel.onclick = (e) => e.stopPropagation(); 
    panel.querySelector(".btn-inline-clear").onclick = () => { delete filtros[tipo][columna.key]; renderEntidad(tipo); }; 
    panel.querySelector(".btn-inline-apply").onclick = () => { 
        const elegidos = [...panel.querySelectorAll('input[type="checkbox"]:checked')].map((c) => c.value); 
        filtros[tipo][columna.key] = { texto: input.value, valores: elegidos.length === valores.length ? [] : elegidos }; 
        renderEntidad(tipo); 
    }; 
} 
function crearEncabezado(elemento,columnas,tipo,ocultas=[]){ 
    const titulos=columnas.map(c=>{const o=ocultas.includes(c.key)?"display:none":"";if(c.especial==="seleccion")return `<th style="${o}"><input id="seleccionarTodos_${tipo}" type="checkbox" aria-label="Seleccionar todos"></th>`;return `<th data-key="${c.key}" style="${o}"><div class="th-content"><span>${escaparHTML(c.label)}</span><span class="resize-handle" data-tipo="${tipo}" data-key="${c.key}"></span></div></th>`;}).join(""); 
    const filtrosHtml=columnas.map(c=>{const o=ocultas.includes(c.key)?"display:none":"";if(c.especial)return `<th style="${o}"></th>`;const cfg=filtros[tipo][c.key],texto=typeof cfg==="object"?(cfg.texto||""):(cfg||""),activo=cfg&&(texto||(cfg.valores||[]).length);return `<th class="filter-cell" style="${o}"><input class="filter-input ${activo?"filtro-activo":""}" data-tipo="${tipo}" data-key="${c.key}" value="${escaparHTML(texto)}" placeholder="Buscar o filtrar" autocomplete="off"></th>`;}).join(""); 
    elemento.innerHTML=`<tr>${titulos}</tr><tr class="filters-row">${filtrosHtml}</tr>`; 
    elemento.querySelectorAll(".filter-input").forEach(input=>{ 
        const col=columnas.find(c=>c.key===input.dataset.key); 
        input.onclick=(e)=>abrirFiltroInlineKiris(e,tipo,col,input); 
        input.oninput=()=>{ 
            const texto=input.value; 
            const prev=filtros[tipo][col.key]; 
            filtros[tipo][col.key]={texto,valores:typeof prev==="object"?(prev.valores||[]):[]}; 
            renderEntidad(tipo); 
            const nuevo=document.querySelector(`.filter-input[data-tipo="${tipo}"][data-key="${col.key}"]`); 
            if(nuevo){nuevo.focus();nuevo.setSelectionRange(nuevo.value.length,nuevo.value.length);abrirFiltroInlineKiris({stopPropagation(){}},tipo,col,nuevo);} 
        }; 
        input.onkeydown=(e)=>{if(e.key!=="Enter")return;e.preventDefault();const prev=filtros[tipo][col.key];filtros[tipo][col.key]={texto:input.value,valores:typeof prev==="object"?(prev.valores||[]):[]};renderEntidad(tipo);}; 
    }); 
} 
document.addEventListener("click",()=>document.querySelectorAll(".inline-filter-options").forEach((panel)=>panel.remove()));  
 
/* Lectura de los XLSX adjuntos */  
async function leerLibroXLSX(archivo){if(typeof XLSX==="undefined")throw new Error("No se cargó el lector de Excel");const data=new Uint8Array(await archivo.arrayBuffer());return XLSX.read(data,{type:"array",cellDates:true});}  
function fechaXLSX(v){if(!v)return"";const d=v instanceof Date?v:new Date(v);return isNaN(d)?"":`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}  
async function importarControlVersionesXLSX(archivo){if(!archivo)return;try{const wb=await leerLibroXLSX(archivo),nuevos=[];wb.SheetNames.forEach(nombre=>{const idioma=normalizar(nombre).includes("ingles")?"Inglés":normalizar(nombre).includes("espanol")?"Español":"";if(!idioma)return;const filas=XLSX.utils.sheet_to_json(wb.Sheets[nombre],{header:1,defval:""});filas.slice(1).forEach(f=>{const codigo=String(f[0]||"").trim(),manual=String(f[1]||"").trim();if(!codigo.startsWith("UEO-")||!manual)return;nuevos.push({id:id("version"),sistema:/siscard\s*\+|siscardplus/i.test(manual)?"siscard+":"SISCARD",codigo,manual,idioma,numero:String(f[2]??"").trim()||"0",fecha:"",estado:"Disponible",observaciones:""});});});if(!nuevos.length)throw new Error("No se encontraron filas válidas");if(confirm("¿Reemplazar el Control de Versiones actual?\nAceptar = reemplazar. Cancelar = agregar."))estado.versiones=nuevos;else estado.versiones.push(...nuevos);guardarEstado(`${nuevos.length} versiones importadas`);renderVersiones();}catch(e){console.error(e);mostrarToast(`No fue posible importar Control de Versiones: ${e.message}`);}}  
async function importarDashboardProduccion(archivo){if(!archivo)return;try{const wb=await leerLibroXLSX(archivo),hoja=wb.Sheets[wb.SheetNames[0]],filas=XLSX.utils.sheet_to_json(hoja,{defval:"",raw:true});estado.ciclo=filas.map((original,i)=>{const start=original["Start Date"],comp=original["Comp Date"],cat=String(original["Change Category"]||"Sin categoría"),a=start?new Date(start):null,b=comp?new Date(comp):null,dias=a&&b&&!isNaN(a)&&!isNaN(b)?Math.max(0,Math.round((b-a)/86400000)):null;return{id:id("ciclo"),tipo:cat,dias:dias??0,diasCiclo:dias,original};});guardarEstado(`${estado.ciclo.length} registros de producción importados`);renderDashboard();}catch(e){console.error(e);mostrarToast(`No fue posible importar export.xlsx: ${e.message}`);}}  
function abrirDetalleProduccion(){if(!estado.ciclo.length)return mostrarToast("Primero importe export.xlsx");const rows=estado.ciclo.map(x=>x.original||x),headers=[...new Set(rows.flatMap(Object.keys))];const data=JSON.stringify({headers,rows},(k,v)=>v instanceof Date?v.toISOString():v).replace(/</g,"\\u003c");const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Detalle de producción</title><style>body{font-family:Segoe UI;margin:0;background:#f3f3f3;color:#333}header{background:#FF6C0C;color:white;padding:16px 22px}.bar{display:flex;gap:8px;padding:14px;align-items:center;position:sticky;top:0;background:#f3f3f3;z-index:5}.bar input{min-width:320px;padding:9px;border:1px solid #ccc;border-radius:8px}.bar button{padding:9px 12px;border:0;border-radius:8px;font-weight:700}.wrap{margin:0 14px 14px;overflow:auto;max-height:calc(100vh - 100px);background:white}table{border-collapse:collapse;width:max-content;min-width:100%;table-layout:fixed}th,td{border:1px solid #ddd;padding:7px;font-size:12px;vertical-align:top;white-space:normal;overflow-wrap:anywhere;word-break:break-word;min-width:150px;max-width:280px;line-height:1.4}thead tr:first-child th{position:sticky;top:0;background:#666;color:#fff;z-index:3}.filtros th{position:sticky;top:33px;background:#f7f7f7;z-index:2}.filtros input{min-width:125px;width:100%;box-sizing:border-box;padding:6px}</style></head><body><header><h2>Detalle de producción</h2></header><div class="bar"><input id="global" placeholder="Buscar en toda la réplica"><button onclick="limpiar()">Limpiar filtros</button><span id="count"></span></div><div class="wrap"><table id="tabla"></table></div><script>const DATA=${data};function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}function render(){const g=global.value.toLowerCase(),fs=[...document.querySelectorAll('.f')].map(x=>x.value.toLowerCase());const r=DATA.rows.filter(o=>DATA.headers.some(h=>String(o[h]??'').toLowerCase().includes(g))&&DATA.headers.every((h,i)=>!fs[i]||String(o[h]??'').toLowerCase().includes(fs[i])));tabla.innerHTML='<thead><tr>'+DATA.headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr><tr class="filtros">'+DATA.headers.map((h,i)=>'<th><input class="f" data-i="'+i+'" placeholder="Buscar o filtrar" value="'+esc(fs[i]||'')+'"></th>').join('')+'</tr></thead><tbody>'+r.map(o=>'<tr>'+DATA.headers.map(h=>'<td>'+esc(o[h])+'</td>').join('')+'</tr>').join('')+'</tbody>';count.textContent=r.length+' de '+DATA.rows.length+' registros';document.querySelectorAll('.f').forEach(x=>x.oninput=render)}function limpiar(){global.value='';document.querySelectorAll('.f').forEach(x=>x.value='');render()}global.oninput=render;render();<\/script></body></html>`;const w=open("","_blank");if(!w)return mostrarToast("Permita ventanas emergentes para ver el detalle");w.document.write(html);w.document.close();}  
 
/* Bitácora: nombre visible y copia de un único registro */  
function nombreManualBitacora(m){return `${m.codigo||""} - ${m.titulo||""}`.replace(/^\s*-\s*|\s*-\s*$/g,"");}  
function poblarDatalists(){const opciones=estado.manuales.map(m=>`<option value="${escaparHTML(nombreManualBitacora(m))}"></option>`).join("");$("listaManualesTramite").innerHTML=estado.manuales.map(m=>`<option value="${escaparHTML(m.titulo)}">${escaparHTML(m.codigo)}</option>`).join("");$("listaManualesBitacora").innerHTML=opciones;$("listaTemasTramite").innerHTML=[...new Set(estado.tramites.map(t=>t.temaGeneral).filter(Boolean))].map(x=>`<option value="${escaparHTML(x)}"></option>`).join("");}  
function guardarBitacoraFormulario(evento){evento.preventDefault();const existenteId=$("bitacoraId").value,valor=$("bitacoraManual").value.trim();const manual=estado.manuales.find(m=>[m.titulo,m.codigo,nombreManualBitacora(m)].includes(valor));const nombre=manual?nombreManualBitacora(manual):valor;const datos={id:existenteId||id("bitacora"),fecha:$("bitacoraFecha").value,manual:nombre,manualId:manual?.id||"",tipo:$("bitacoraTipo").value||manual?.tipo||"",horaInicio:$("bitacoraHoraInicio").value,horaFin:$("bitacoraHoraFin").value,horas:calcularHoras($("bitacoraHoraInicio").value,$("bitacoraHoraFin").value),paginas:Number($("bitacoraPaginas").value||0),detalle:$("bitacoraDetalle").value.trim()};const i=estado.bitacora.findIndex(x=>x.id===existenteId);if(i>=0)estado.bitacora[i]=datos;else estado.bitacora.unshift(datos);guardarEstado("Registro de Bitácora guardado");cerrarPantalla("bitacoraScreen");renderTodo();}  
function abrirCopiaRegistro(){const sel=$("registroOrigenCopia");sel.innerHTML=estado.bitacora.map(r=>`<option value="${r.id}">${escaparHTML(r.fecha)} | ${escaparHTML(r.manual)} | ${Number(r.horas||0).toFixed(2)} h</option>`).join("");$("fechaDestinoCopia").value=fechaISOHoy();actualizarPreviewCopia();abrirPantalla("panelCopiaMasiva");}  
function actualizarPreviewCopia(){const r=estado.bitacora.find(x=>x.id===$("registroOrigenCopia").value);$("previewCopia").textContent=r?`Manual: ${r.manual}\nTipo: ${r.tipo}\nHorario: ${r.horaInicio} - ${r.horaFin}\nHoras: ${Number(r.horas||0).toFixed(2)}\nPáginas: ${r.paginas||0}\nDetalle: ${r.detalle||""}`:"No hay registros disponibles.";}  
function confirmarCopiaRegistro(){const r=estado.bitacora.find(x=>x.id===$("registroOrigenCopia").value),fecha=$("fechaDestinoCopia").value;if(!r||!fecha)return mostrarToast("Seleccione un registro y una fecha");estado.bitacora.unshift({...r,id:id("bitacora"),fecha});guardarEstado("Registro copiado");cerrarPantalla("panelCopiaMasiva");renderTodo();}  
document.addEventListener("DOMContentLoaded",()=>{$("btnImportarCiclo")?.addEventListener("click",()=>$("inputExcelDashboardCiclo").click());$("inputExcelDashboardCiclo")?.addEventListener("change",e=>importarDashboardProduccion(e.target.files[0]).finally(()=>e.target.value=""));$("btnCopiarRegistros")?.addEventListener("click",abrirCopiaRegistro);$("btnCerrarCopiaMasiva")?.addEventListener("click",()=>cerrarPantalla("panelCopiaMasiva"));$("btnCancelarCopiaMasiva")?.addEventListener("click",()=>cerrarPantalla("panelCopiaMasiva"));$("registroOrigenCopia")?.addEventListener("change",actualizarPreviewCopia);$("btnConfirmarCopiaMasiva")?.addEventListener("click",confirmarCopiaRegistro);});  
 
 
 
/* ===== KIRIS V4: columnas, fila activa y cierres ===== */ 
function ocultarTodasColumnas(tipo) { 
    const columnas = tipo === "manuales" ? COLUMNAS_MANUALES : COLUMNAS_TRAMITES; 
    const todas = columnas.filter(c => !c.especial).map(c => c.key); 
    if (tipo === "manuales") estado.columnasOcultasManuales = todas; 
    else estado.columnasOcultasTramites = todas; 
    guardarEstado(""); 
    if (tipo === "manuales") renderManuales(); else renderTramites(); 
    abrirColumnas(tipo); 
} 
function cerrarPanelesColumnas(evento) { 
    const manuales = $("columnsPanelManuales"); 
    const tramites = $("columnsPanelTramites"); 
    const dentroManual = manuales && !manuales.hidden && manuales.contains(evento.target); 
    const dentroTramite = tramites && !tramites.hidden && tramites.contains(evento.target); 
    const botonManual = evento.target.closest?.("#btnColumnasManuales"); 
    const botonTramite = evento.target.closest?.("#btnColumnasTramites"); 
    if (manuales && !dentroManual && !botonManual) manuales.hidden = true; 
    if (tramites && !dentroTramite && !botonTramite) tramites.hidden = true; 
} 
function activarFilaManualDesdeEvento(evento) { 
    const fila = evento.target.closest("#tbodyManuales tr[data-id]"); 
    if (!fila) return; 
    document.querySelectorAll("#tbodyManuales tr.fila-activa").forEach(r => r.classList.remove("fila-activa")); 
    fila.classList.add("fila-activa"); 
} 
document.addEventListener("click", cerrarPanelesColumnas); 
document.addEventListener("click", activarFilaManualDesdeEvento); 
document.addEventListener("focusin", activarFilaManualDesdeEvento); 
document.addEventListener("DOMContentLoaded", () => { 
    $("btnOcultarTodasManuales")?.addEventListener("click", e => {e.stopPropagation();ocultarTodasColumnas("manuales");}); 
    $("btnOcultarTodasTramites")?.addEventListener("click", e => {e.stopPropagation();ocultarTodasColumnas("tramites");}); 
}); 
 
/* Mantener visible la fila de Manuales que está en trabajo */ 
let manualActivoId = ""; 
document.addEventListener("focusin", evento => { 
    const fila = evento.target.closest?.("#tbodyManuales tr[data-id]"); 
    if (fila) manualActivoId = fila.dataset.id || ""; 
}); 
document.addEventListener("click", evento => { 
    const fila = evento.target.closest?.("#tbodyManuales tr[data-id]"); 
    if (fila) manualActivoId = fila.dataset.id || ""; 
}); 
document.addEventListener("DOMContentLoaded", () => { 
    const cuerpo = $("tbodyManuales"); 
    if (!cuerpo) return; 
    new MutationObserver(() => { 
        if (!manualActivoId) return; 
        cuerpo.querySelectorAll("tr.fila-activa").forEach(r => r.classList.remove("fila-activa")); 
        cuerpo.querySelector(`tr[data-id="${CSS.escape(manualActivoId)}"]`)?.classList.add("fila-activa"); 
    }).observe(cuerpo,{childList:true}); 
}); 
 
 
