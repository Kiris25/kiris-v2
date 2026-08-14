"use strict";

const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "kirisV2_estado_maestro";
const PUBLISHED_KEY = "kirisV2_publicado";
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const HEADERS_CICLO = [
    "Change #", "Link To", "Seq", "Task", "Company", "Affected End User",
    "Priority", "Assignee", "Group", "Start Date", "Pres. Date", "Est Comp Date",
    "Task Status", "Change Status", "Change Category", "Project", "Need By",
    "Comp Date", "Task Description", "Task Comments", "Change Description", "Order Comments"
];


const COLUMNAS_MANUALES = [
    { key: "seleccion", label: "", width: 42, especial: "seleccion" },
    { key: "orden", label: "", width: 42, especial: "orden" },
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
        modo: "visitante",
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
            idioma: "Español", numero: "1.0", fecha: fechaISOHoy(), estado: "Disponible", observaciones: ""
        }],
        ciclo: [],
        columnasOcultasManuales: [],
        columnasOcultasTramites: [],
        anchosManuales: {},
        anchosTramites: {},
        anchosVersiones: {}
    };
}

async function cargarEstado() {
    try {
        if (window.KirisStorage) {
            const guardado = await window.KirisStorage.cargar();
            return guardado && typeof guardado === "object" ? { ...estadoInicial(), ...guardado } : estadoInicial();
        }
        const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return guardado && typeof guardado === "object" ? { ...estadoInicial(), ...guardado } : estadoInicial();
    } catch (error) {
        console.error("No fue posible cargar los datos.", error);
        return estadoInicial();
    }
}

let estado = estadoInicial();
let filtros = { manuales: {}, tramites: {}, versiones: {} };
let filtrosSeleccion = { manuales: {}, tramites: {}, versiones: {} };
let fechaCalendario = new Date();
let fechaBitacora = new Date();
let fechaDashboard = new Date();
let fechasDestinoCopia = [];
let editorActivo = false;

async function guardarEstado(mensaje = "Cambios guardados") {
    estado.ultimaCopia = new Date().toISOString();
    if (window.KirisStorage) await window.KirisStorage.guardar(estado);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
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

function entrar(modo) {
    estado.modo = modo;
    editorActivo = modo === "editor";
    document.body.classList.toggle("modo-visitante", !editorActivo);
    $("loginScreen").hidden = true;
    $("app").hidden = false;
    const badge = $("modoUsuarioBadge");
    badge.textContent = editorActivo ? "Editor" : "Visitante";
    badge.className = editorActivo ? "modo-badge-editor" : "modo-badge-visitante";
    renderTodo();
}

function cerrarSesion() {
    $("app").hidden = true;
    $("loginScreen").hidden = false;
    $("loginPassword").value = "";
}

function configurarLogin() {
    $("btnIngresarEditor").addEventListener("click", () => entrar("editor"));
    $("btnIngresarVisitante").addEventListener("click", () => entrar("visitante"));
    $("btnCerrarSesion").addEventListener("click", cerrarSesion);
}

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
        const valor = String(valorVisible(objeto, columna) ?? "");
        const texto = filtros[tipo][columna.key];
        const seleccion = filtrosSeleccion[tipo][columna.key];
        if (texto && !normalizar(valor).includes(normalizar(texto))) return false;
        if (Array.isArray(seleccion) && seleccion.length && !seleccion.includes(valor)) return false;
        return true;
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
        return `<th data-key="${columna.key}" style="${oculto}"><div class="th-content"><span>${escaparHTML(columna.label)}</span><button type="button" class="excel-filter-btn" data-filtro-tipo="${tipo}" data-filtro-key="${columna.key}" title="Filtro tipo Excel">▼</button><span class="resize-handle" data-tipo="${tipo}" data-key="${columna.key}"></span></div></th>`;
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
    elemento.querySelectorAll(".excel-filter-btn").forEach((boton) => boton.addEventListener("click", (evento) => {
        evento.stopPropagation();
        abrirFiltroExcel(boton.dataset.filtroTipo, boton.dataset.filtroKey, boton);
    }));
}


function coleccionPorTipo(tipo) {
    return estado[tipo] || [];
}

function cerrarFiltroExcel() {
    const menu = $("filterMenu");
    menu.hidden = true;
    menu.innerHTML = "";
}

function abrirFiltroExcel(tipo, key, boton) {
    const columnas = tipo === "manuales" ? COLUMNAS_MANUALES : tipo === "tramites" ? COLUMNAS_TRAMITES : COLUMNAS_VERSIONES;
    const columna = columnas.find((item) => item.key === key);
    const valores = [...new Set(coleccionPorTipo(tipo).map((item) => String(valorVisible(item, columna) ?? "")))].sort((a, b) => a.localeCompare(b, "es"));
    const activos = filtrosSeleccion[tipo][key] || [];
    const menu = $("filterMenu");
    menu.innerHTML = `
        <div class="excel-filter-title">${escaparHTML(columna.label)}</div>
        <input id="excelFilterSearch" class="filter-input" type="search" placeholder="Buscar valores...">
        <label class="excel-filter-option"><input id="excelFilterAll" type="checkbox" ${!activos.length || activos.length === valores.length ? "checked" : ""}> Seleccionar todo</label>
        <div id="excelFilterValues" class="excel-filter-values">
            ${valores.map((valor) => `<label class="excel-filter-option" data-value-text="${escaparHTML(normalizar(valor))}"><input type="checkbox" value="${escaparHTML(valor)}" ${!activos.length || activos.includes(valor) ? "checked" : ""}> <span>${escaparHTML(valor || "(Vacío)")}</span></label>`).join("")}
        </div>
        <div class="excel-filter-actions"><button id="excelFilterClear" class="btn btn-light" type="button">Borrar filtro</button><button id="excelFilterApply" class="btn btn-primary" type="button">Aplicar</button></div>`;
    const rect = boton.getBoundingClientRect();
    menu.style.left = `${Math.min(rect.left, window.innerWidth - 340)}px`;
    menu.style.top = `${Math.min(rect.bottom + 4, window.innerHeight - 430)}px`;
    menu.hidden = false;
    $("excelFilterSearch").addEventListener("input", (e) => menu.querySelectorAll("[data-value-text]").forEach((label) => { label.hidden = !label.dataset.valueText.includes(normalizar(e.target.value)); }));
    $("excelFilterAll").addEventListener("change", (e) => menu.querySelectorAll('#excelFilterValues input[type="checkbox"]').forEach((c) => { if (!c.closest("label").hidden) c.checked = e.target.checked; }));
    $("excelFilterClear").addEventListener("click", () => { delete filtrosSeleccion[tipo][key]; cerrarFiltroExcel(); renderSegunTipo(tipo); });
    $("excelFilterApply").addEventListener("click", () => { const seleccion = [...menu.querySelectorAll('#excelFilterValues input[type="checkbox"]:checked')].map((c) => c.value); filtrosSeleccion[tipo][key] = seleccion.length === valores.length ? [] : seleccion; cerrarFiltroExcel(); renderSegunTipo(tipo); });
}

function renderSegunTipo(tipo) {
    if (tipo === "manuales") renderManuales();
    if (tipo === "tramites") renderTramites();
    if (tipo === "versiones") renderVersiones();
}

function campoCelda(objeto, columna, tipoEntidad) {
    const valor = valorVisible(objeto, columna);
    if (!editorActivo || columna.calculado) {
        if (columna.key === "estado") return `<span class="estado ${claseEstado(valor)}">${escaparHTML(valor)}</span>`;
        return escaparHTML(valor);
    }
    if (columna.tipo === "select") {
        const opciones = columna.opciones.map((opcion) => `<option ${String(opcion) === String(valor) ? "selected" : ""}>${escaparHTML(opcion)}</option>`).join("");
        return `<select class="cell-select" data-entidad="${tipoEntidad}" data-id="${objeto.id}" data-key="${columna.key}">${opciones}</select>`;
    }
    if (columna.tipo === "textarea") return `<textarea class="cell-textarea" data-entidad="${tipoEntidad}" data-id="${objeto.id}" data-key="${columna.key}">${escaparHTML(valor)}</textarea>`;
    return `<input class="cell-input" type="${columna.tipo || "text"}" data-entidad="${tipoEntidad}" data-id="${objeto.id}" data-key="${columna.key}" value="${escaparHTML(valor)}">`;
}

function enlazarEdicionTabla(contenedor) {
    contenedor.querySelectorAll(".cell-input,.cell-select,.cell-textarea").forEach((campo) => campo.addEventListener("change", () => {
        const coleccion = estado[campo.dataset.entidad];
        const registro = coleccion.find((item) => item.id === campo.dataset.id);
        if (!registro) return;
        registro[campo.dataset.key] = campo.type === "number" ? Number(campo.value || 0) : campo.value;
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
        if (columna.especial === "orden") return `<td class="drag-handle" style="${oculto}">⋮⋮</td>`;
        if (columna.especial === "acciones") return `<td style="${oculto}"><button class="btn-icon editor-only" data-editar-manual="${manual.id}" title="Editar">✏️</button></td>`;
        return `<td style="${oculto}">${campoCelda(manual, columna, "manuales")}</td>`;
    }).join("")}</tr>`).join("") : `<tr><td class="empty-state" colspan="${COLUMNAS_MANUALES.length}">No hay manuales que coincidan con los filtros.</td></tr>`;
    enlazarEdicionTabla($("tbodyManuales"));
    $("seleccionarTodos_manuales")?.addEventListener("change", (e) => document.querySelectorAll(".seleccion-manual").forEach((c) => { c.checked = e.target.checked; }));
    document.querySelectorAll("[data-editar-manual]").forEach((b) => b.addEventListener("click", () => abrirManual(b.dataset.editarManual)));
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
    }).join("")}</tr>`).join("") : `<tr><td class="empty-state" colspan="${COLUMNAS_TRAMITES.length}">No hay trámites que coincidan con los filtros.</td></tr>`;
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
    }).join("")}</tr>`).join("") : `<tr><td class="empty-state" colspan="${COLUMNAS_VERSIONES.length}">No hay versiones que coincidan con los filtros.</td></tr>`;
    enlazarEdicionTabla($("tbodyVersiones"));
    $("seleccionarTodos_versiones")?.addEventListener("change", (e) => document.querySelectorAll(".seleccion-version").forEach((c) => { c.checked = e.target.checked; }));
    document.querySelectorAll("[data-editar-version]").forEach((b) => b.addEventListener("click", () => abrirVersion(b.dataset.editarVersion)));
    renderResumenVersiones();
    habilitarRedimensionamiento();
}

function renderResumenVersiones() {
    const sistemas = new Set(estado.versiones.map((v) => v.sistema)).size;
    const vigentes = estado.versiones.filter((v) => v.estado === "Disponible").length;
    $("resumenVersiones").innerHTML = [
        ["Total de versiones", estado.versiones.length],
        ["Sistemas", sistemas],
        ["Disponibles", vigentes],
        ["Idiomas", new Set(estado.versiones.map((v) => v.idioma)).size]
    ].map(([label, value]) => `<div class="kpi-card"><div class="label">${label}</div><div class="value">${value}</div></div>`).join("");
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

function renderCalendario() {
    poblarSelectMesAnio($("selectorMesCalendario"), $("selectorAnioCalendario"), fechaCalendario);
    $("tituloCalendario").textContent = `${MESES[fechaCalendario.getMonth()]} ${fechaCalendario.getFullYear()}`;
    const hoy = fechaISOHoy();
    const dias = matrizMes(fechaCalendario);
    const encabezados = DIAS.map((d) => `<div class="calendario-encabezado">${d}</div>`).join("");
    const celdas = dias.map((dia) => {
        const iso = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`;
        const eventos = estado.manuales.filter((m) => [m.fechaInicio, m.fechaFinalizacion, m.fechaPublicado].includes(iso));
        return `<div class="calendario-dia ${dia.getMonth() !== fechaCalendario.getMonth() ? "fuera-mes" : ""} ${iso === hoy ? "hoy" : ""}" data-fecha="${iso}">
            <div class="calendario-numero">${dia.getDate()}</div>
            ${eventos.map((m) => `<div class="calendario-evento tipo-${normalizar(m.tipo)}" style="background:${m.color || "#FF6C0C"}" title="${escaparHTML(m.titulo)}">${escaparHTML(m.codigo)} · ${escaparHTML(m.titulo)}</div>`).join("")}
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
            ${registros.map((r) => `<div class="calendario-evento tipo-${normalizar(r.tipo)}" data-registro-id="${r.id}" title="${escaparHTML(r.detalle)}">${escaparHTML(r.manual)} · ${Number(r.horas || 0).toFixed(2)} h</div>`).join("")}
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
    $("versionSistema").value = v?.sistema || "SISCARD"; $("versionCodigo").value = v?.codigo || ""; $("versionManual").value = v?.manual || ""; $("versionIdioma").value = v?.idioma || "Español"; $("versionNumero").value = v?.numero || ""; $("versionFecha").value = v?.fecha || ""; $("versionEstado").value = v?.estado || "Disponible"; $("versionObservaciones").value = v?.observaciones || ""; abrirPantalla("versionScreen");
}

function guardarVersionFormulario(evento) {
    evento.preventDefault(); const existenteId = $("versionId").value; const datos = { id: existenteId || id("version"), sistema: $("versionSistema").value, codigo: $("versionCodigo").value.trim(), manual: $("versionManual").value.trim(), idioma: $("versionIdioma").value, numero: $("versionNumero").value.trim(), fecha: $("versionFecha").value, estado: $("versionEstado").value, observaciones: $("versionObservaciones").value.trim() };
    const indice = estado.versiones.findIndex((x) => x.id === existenteId); if (indice >= 0) estado.versiones[indice] = datos; else estado.versiones.unshift(datos);
    guardarEstado("Versión guardada"); cerrarPantalla("versionScreen"); renderVersiones();
}

function eliminarSeleccionados(tipo) {
    const singular = tipo === "versiones" ? "version" : tipo.slice(0, -1);
    const clase = `.seleccion-${singular}:checked`; const ids = [...document.querySelectorAll(clase)].map((c) => c.dataset.id);
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

async function publicarCambios() {
    const paquete = { version: 1, fechaPublicacion: new Date().toISOString(), manuales: estado.manuales, bitacora: estado.bitacora, tramites: estado.tramites, versiones: estado.versiones, ciclo: estado.ciclo };
    if (window.KirisStorage) await window.KirisStorage.publicar(paquete);
    else localStorage.setItem(PUBLISHED_KEY, JSON.stringify(paquete));
    descargar("BASE_GESTOR_PUBLICADO.json", JSON.stringify(paquete, null, 2), "application/json;charset=utf-8");
    mostrarToast("Versión publicada generada");
}


function leerCSV(texto) {
    const filas = [];
    let fila = [];
    let campo = "";
    let entreComillas = false;

    for (let i = 0; i < texto.length; i += 1) {
        const caracter = texto[i];
        const siguiente = texto[i + 1];

        if (caracter === '"' && entreComillas && siguiente === '"') {
            campo += '"';
            i += 1;
        } else if (caracter === '"') {
            entreComillas = !entreComillas;
        } else if (caracter === "," && !entreComillas) {
            fila.push(campo.trim());
            campo = "";
        } else if ((caracter === "\n" || caracter === "\r") && !entreComillas) {
            if (caracter === "\r" && siguiente === "\n") i += 1;
            fila.push(campo.trim());
            if (fila.some((valor) => valor !== "")) filas.push(fila);
            fila = [];
            campo = "";
        } else {
            campo += caracter;
        }
    }

    fila.push(campo.trim());
    if (fila.some((valor) => valor !== "")) filas.push(fila);
    return filas;
}

function claveDesdeEncabezado(encabezado, columnas) {
    const limpio = normalizar(encabezado).replace(/[^a-z0-9]/g, "");
    return columnas.find((columna) =>
        normalizar(columna.label).replace(/[^a-z0-9]/g, "") === limpio ||
        normalizar(columna.key).replace(/[^a-z0-9]/g, "") === limpio
    )?.key;
}

function importarCSV(tipo, archivo) {
    if (!archivo) return;
    const lector = new FileReader();

    lector.onload = () => {
        try {
            const filas = leerCSV(String(lector.result || ""));
            if (filas.length < 2) throw new Error("El archivo no contiene filas de datos.");

            const columnas = tipo === "manuales" ? COLUMNAS_MANUALES :
                tipo === "tramites" ? COLUMNAS_TRAMITES : COLUMNAS_VERSIONES;
            const encabezados = filas[0].map((encabezado) => claveDesdeEncabezado(encabezado, columnas));
            const prefijo = tipo === "manuales" ? "manual" : tipo === "tramites" ? "tramite" : "version";
            const nuevos = filas.slice(1).map((fila) => {
                const registro = { id: id(prefijo) };
                encabezados.forEach((key, indice) => {
                    if (key && !["seleccion", "orden", "acciones", "tiempoInvertido"].includes(key)) {
                        const columna = columnas.find((item) => item.key === key);
                        const valor = fila[indice] ?? "";
                        registro[key] = columna?.tipo === "number" ? Number(valor || 0) : valor;
                    }
                });
                return registro;
            });

            estado[tipo] = nuevos;
            guardarEstado(`${nuevos.length} registro(s) importado(s)`);
            renderTodo();
        } catch (error) {
            console.error(error);
            mostrarToast(`No fue posible importar: ${error.message}`);
        }
    };

    lector.readAsText(archivo, "UTF-8");
}

function agregarFechaDestinoCopia() {
    const fecha = $("fechaDestinoCopia").value;
    if (!fecha || fechasDestinoCopia.includes(fecha)) return;
    fechasDestinoCopia.push(fecha);
    renderFechasDestinoCopia();
}

function renderFechasDestinoCopia() {
    $("listaFechasDestino").innerHTML = fechasDestinoCopia.map((fecha) => `
        <div class="fecha-destino-item">
            <span>${escaparHTML(fecha)}</span>
            <button type="button" class="btn-icon" data-quitar-fecha="${fecha}">×</button>
        </div>
    `).join("");

    document.querySelectorAll("[data-quitar-fecha]").forEach((boton) =>
        boton.addEventListener("click", () => {
            fechasDestinoCopia = fechasDestinoCopia.filter((fecha) => fecha !== boton.dataset.quitarFecha);
            renderFechasDestinoCopia();
        })
    );

    const origen = $("fechaOrigenCopia").value;
    const cantidad = estado.bitacora.filter((registro) => registro.fecha === origen).length;
    $("previewCopia").textContent = `${cantidad} registro(s) se copiarán hacia ${fechasDestinoCopia.length} fecha(s).`;
}

function abrirCopiaMasiva() {
    fechasDestinoCopia = [];
    $("fechaOrigenCopia").value = fechaISOHoy();
    $("fechaDestinoCopia").value = "";
    renderFechasDestinoCopia();
    $("panelCopiaMasiva").hidden = false;
}

function confirmarCopiaMasiva() {
    const origen = $("fechaOrigenCopia").value;
    const registros = estado.bitacora.filter((registro) => registro.fecha === origen);
    if (!origen || !registros.length || !fechasDestinoCopia.length) {
        mostrarToast("Seleccione un origen con registros y al menos una fecha destino");
        return;
    }

    fechasDestinoCopia.forEach((fecha) => {
        registros.forEach((registro) => estado.bitacora.push({ ...registro, id: id("bitacora"), fecha }));
    });

    guardarEstado("Registros de Bitácora copiados");
    $("panelCopiaMasiva").hidden = true;
    renderBitacora();
    renderDashboard();
}


function columnaExcelAIndice(ref) {
    const letras = String(ref || "").replace(/[^A-Z]/gi, "").toUpperCase();
    let n = 0;
    for (let i = 0; i < letras.length; i += 1) n = n * 26 + (letras.charCodeAt(i) - 64);
    return n - 1;
}

async function leerXlsxBasico(archivo) {
    const buffer = await archivo.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);
    const u16 = (o) => view.getUint16(o, true);
    const u32 = (o) => view.getUint32(o, true);
    const textoUtf8 = (arr) => new TextDecoder("utf-8").decode(arr);
    let eocd = -1;
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 66000); i -= 1) if (u32(i) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) throw new Error("No se encontró la estructura ZIP del XLSX.");
    const total = u16(eocd + 10); let cd = u32(eocd + 16); const entries = {};
    for (let i = 0; i < total; i += 1) {
        if (u32(cd) !== 0x02014b50) break;
        const method = u16(cd + 10), compSize = u32(cd + 20), nameLen = u16(cd + 28), extraLen = u16(cd + 30), commentLen = u16(cd + 32), localOffset = u32(cd + 42);
        const name = textoUtf8(bytes.slice(cd + 46, cd + 46 + nameLen));
        const lfNameLen = u16(localOffset + 26), lfExtraLen = u16(localOffset + 28), dataStart = localOffset + 30 + lfNameLen + lfExtraLen;
        entries[name] = { method, data: bytes.slice(dataStart, dataStart + compSize) };
        cd += 46 + nameLen + extraLen + commentLen;
    }
    async function inflar(entry) {
        if (!entry) throw new Error("Entrada XLSX no encontrada.");
        if (entry.method === 0) return entry.data;
        if (entry.method !== 8 || typeof DecompressionStream === "undefined") throw new Error("Este navegador no permite leer este XLSX.");
        const stream = new Blob([entry.data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        return new Uint8Array(await new Response(stream).arrayBuffer());
    }
    const textoEntrada = async (nombre) => textoUtf8(await inflar(entries[nombre]));
    const parser = new DOMParser(); let shared = [];
    if (entries["xl/sharedStrings.xml"]) {
        const xml = parser.parseFromString(await textoEntrada("xl/sharedStrings.xml"), "application/xml");
        shared = [...xml.getElementsByTagName("si")].map((si) => [...si.getElementsByTagName("t")].map((t) => t.textContent || "").join(""));
    }
    const wb = parser.parseFromString(await textoEntrada("xl/workbook.xml"), "application/xml");
    const sheet = wb.getElementsByTagName("sheet")[0];
    const rid = sheet?.getAttribute("r:id") || "rId1"; let sheetPath = "xl/worksheets/sheet1.xml";
    if (entries["xl/_rels/workbook.xml.rels"]) {
        const rels = parser.parseFromString(await textoEntrada("xl/_rels/workbook.xml.rels"), "application/xml");
        const rel = [...rels.getElementsByTagName("Relationship")].find((r) => r.getAttribute("Id") === rid);
        if (rel?.getAttribute("Target")) sheetPath = "xl/" + rel.getAttribute("Target").replace(/^\.\//, "");
    }
    const xmlSheet = parser.parseFromString(await textoEntrada(sheetPath), "application/xml");
    const matrix = [...xmlSheet.getElementsByTagName("row")].map((row) => {
        const arr = [];
        [...row.getElementsByTagName("c")].forEach((c) => {
            const col = columnaExcelAIndice(c.getAttribute("r") || ""); const type = c.getAttribute("t") || ""; let value = "";
            if (type === "inlineStr") value = [...c.getElementsByTagName("t")].map((t) => t.textContent || "").join("");
            else { value = c.getElementsByTagName("v")[0]?.textContent || ""; if (type === "s") value = shared[Number(value)] || ""; }
            arr[col] = value;
        });
        return arr;
    }).filter((row) => row.some((v) => String(v || "").trim() !== ""));
    if (!matrix.length) return [];
    const workbookHeaders = matrix[0].map((h) => String(h || "").trim());
    return matrix.slice(1).map((row) => { const obj = {}; workbookHeaders.forEach((h, i) => { if (h) obj[h] = row[i] ?? ""; }); return obj; });
}

function parseFechaCiclo(valor) {
    if (!valor) return null;
    if (typeof valor === "number" || /^\d+(\.\d+)?$/.test(String(valor))) {
        const serial = Number(valor); if (serial > 20000) return new Date(Date.UTC(1899, 11, 30) + serial * 86400000);
    }
    const fecha = new Date(valor); return Number.isNaN(fecha.getTime()) ? null : fecha;
}

function calcularDiasCiclo(inicio, cierre) {
    const a = parseFechaCiclo(inicio), b = parseFechaCiclo(cierre);
    if (!a || !b) return null;
    return Math.max(0, Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000));
}

async function importarCicloCSV(archivo) {
    if (!archivo) return;
    try {
        const extension = archivo.name.split(".").pop().toLowerCase();
        let filas;
        if (extension === "xlsx" || extension === "xls") filas = await leerXlsxBasico(archivo);
        else filas = leerCSV(await archivo.text()).slice(1).map((fila) => Object.fromEntries(HEADERS_CICLO.map((h, i) => [h, fila[i] ?? ""])));
        const columnasArchivo = filas.length ? Object.keys(filas[0]) : [];
        const faltantes = HEADERS_CICLO.filter((h) => !columnasArchivo.some((x) => normalizar(x) === normalizar(h)));
        if (faltantes.length) throw new Error(`Faltan encabezados: ${faltantes.join(", ")}`);
        estado.ciclo = filas.map((fila) => {
            const original = {}; HEADERS_CICLO.forEach((h) => { const k = Object.keys(fila).find((x) => normalizar(x) === normalizar(h)); original[h] = k ? fila[k] : ""; });
            return { ...original, dias: calcularDiasCiclo(original["Start Date"], original["Comp Date"]), tipo: original["Change Category"] || "Sin categoría" };
        });
        await guardarEstado("Excel de ciclo importado"); renderDashboard();
    } catch (error) { console.error(error); mostrarToast(`No fue posible importar el Excel: ${error.message}`); }
}
function exportarRespaldoCompleto() {
    const respaldo = {
        tipo: "KIRIS_V2_RESPALDO_COMPLETO",
        version: 1,
        fechaExportacion: new Date().toISOString(),
        datos: estado
    };

    descargar(
        `KIRIS_V2_Respaldo_${fechaISOHoy()}.json`,
        JSON.stringify(respaldo, null, 2),
        "application/json;charset=utf-8"
    );

    mostrarToast("Copia de seguridad completa exportada");
}

function convertirRespaldoHistorico(respaldo) {
    const data = respaldo.data || {};

    const manuales = Array.isArray(data.manuales) ? data.manuales.map((manual) => ({
        ...manual,
        id: manual.id || id("manual"),
        fechaPublicado: manual.fechaPublicado ?? manual.fechaPublicadoGestor ?? "",
        paginas: manual.paginas === "" ? "" : Number(manual.paginas),
        diasEsfuerzo: manual.diasEsfuerzo === "" ? "" : Number(manual.diasEsfuerzo),
        horasEsfuerzo: manual.horasEsfuerzo === "" ? "" : Number(manual.horasEsfuerzo)
    })) : [];

    const porId = new Map(manuales.map((manual) => [manual.id, manual]));
    const bitacora = Array.isArray(data.bitacora) ? data.bitacora.map((registro) => {
        const manualRelacionado = porId.get(registro.manualId);
        return {
            ...registro,
            id: registro.id || id("bitacora"),
            manual: registro.manual ?? registro.codigo ?? manualRelacionado?.titulo ?? manualRelacionado?.codigo ?? "",
            horas: Number(registro.horas || 0),
            paginas: registro.paginas === "" ? "" : Number(registro.paginas || 0)
        };
    }) : [];

    const tramites = Array.isArray(data.tramites) ? data.tramites.map((tramite) => ({
        ...tramite,
        id: tramite.id || id("tramite")
    })) : [];

    const versionesOrigen = Array.isArray(data.controlVersiones) ? data.controlVersiones :
        Array.isArray(data.versiones) ? data.versiones : [];
    const versiones = versionesOrigen.map((version) => ({
        ...version,
        id: version.id || id("version"),
        numero: version.numero ?? version.version ?? "",
        fecha: version.fecha ?? version.fechaVersion ?? ""
    }));

    const cicloOrigen = Array.isArray(data.dashboardCicloCambios) ? data.dashboardCicloCambios :
        Array.isArray(data.ciclo) ? data.ciclo : [];
    const ciclo = cicloOrigen.map((registro) => {
        const original = registro.original && typeof registro.original === "object" ? registro.original : registro;
        return {
            ...original,
            id: registro.id || id("ciclo"),
            dias: registro.dias ?? registro.diasCiclo ?? calcularDiasCiclo(original["Start Date"], original["Comp Date"]),
            tipo: registro.tipo ?? registro.changeCategory ?? original["Change Category"] ?? "Sin categoría",
            original,
            startDate: registro.startDate ?? original["Start Date"] ?? "",
            compDate: registro.compDate ?? original["Comp Date"] ?? "",
            taskStatus: registro.taskStatus ?? original["Task Status"] ?? "",
            changeCategory: registro.changeCategory ?? original["Change Category"] ?? "",
            completo: registro.completo ?? Boolean(original["Comp Date"]),
            pendienteSinCierre: registro.pendienteSinCierre ?? !original["Comp Date"]
        };
    });

    return {
        ...estadoInicial(),
        modo: "visitante",
        ultimaCopia: data.fechaActualizacion || respaldo.fecha || "",
        manuales,
        bitacora,
        tramites,
        versiones,
        ciclo,
        columnasOcultasManuales: data.columnasOcultas || data.columnasOcultasManuales || [],
        columnasOcultasTramites: data.columnasOcultasTramites || [],
        anchosManuales: data.columnWidths || data.anchosManuales || {},
        anchosTramites: data.columnWidthsTramites || data.anchosTramites || {},
        anchosVersiones: data.columnWidthsVersiones || data.anchosVersiones || {}
    };
}

function normalizarRespaldoImportado(respaldo) {
    if (respaldo?.tipo === "KIRIS_V2_RESPALDO_COMPLETO" && respaldo.datos && typeof respaldo.datos === "object") {
        return { formato: "KIRIS V2", datos: { ...estadoInicial(), ...respaldo.datos } };
    }

    if (respaldo?.tipoArchivo === "COPIA_SEGURIDAD_REPOSITORIO_MANUALES" && respaldo.data && typeof respaldo.data === "object") {
        return { formato: "Repositorio histórico", datos: convertirRespaldoHistorico(respaldo) };
    }

    if (respaldo && typeof respaldo === "object" && Array.isArray(respaldo.manuales)) {
        return { formato: "JSON de datos", datos: { ...estadoInicial(), ...respaldo } };
    }

    throw new Error("El archivo no corresponde a un respaldo compatible de KIRIS.");
}

function importarRespaldoCompleto(archivo) {
    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = async () => {
        try {
            const respaldo = JSON.parse(String(lector.result || ""));
            const convertido = normalizarRespaldoImportado(respaldo);
            const datos = convertido.datos;
            const resumen = [
                `${datos.manuales?.length || 0} manual(es)`,
                `${datos.bitacora?.length || 0} registro(s) de Bitácora`,
                `${datos.tramites?.length || 0} trámite(s)`,
                `${datos.versiones?.length || 0} versión(es)`,
                `${datos.ciclo?.length || 0} registro(s) de ciclo`
            ].join("\n");

            const confirmar = confirm(
                `Respaldo detectado: ${convertido.formato}\n\n${resumen}\n\nLa importación reemplazará los datos actuales. ¿Desea continuar?`
            );

            if (!confirmar) return;

            estado = datos;
            await guardarEstado("Copia de seguridad restaurada");
            filtros = { manuales: {}, tramites: {}, versiones: {} };
            filtrosSeleccion = { manuales: {}, tramites: {}, versiones: {} };
            renderTodo();
            mostrarToast(`Respaldo restaurado: ${datos.manuales.length} manual(es)`);
        } catch (error) {
            console.error(error);
            mostrarToast(`No fue posible importar el respaldo: ${error.message}`);
        } finally {
            $("inputRespaldoCompleto").value = "";
        }
    };

    lector.onerror = () => {
        mostrarToast("No fue posible leer el archivo de respaldo");
        $("inputRespaldoCompleto").value = "";
    };

    lector.readAsText(archivo, "UTF-8");
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

function configurarFormularios() {
    $("manualForm").addEventListener("submit", guardarManualFormulario); $("tramiteForm").addEventListener("submit", guardarTramiteFormulario); $("bitacoraForm").addEventListener("submit", guardarBitacoraFormulario); $("versionForm").addEventListener("submit", guardarVersionFormulario);
    [["btnCerrarManual", "manualScreen"], ["btnCancelarManual", "manualScreen"], ["btnCerrarTramite", "tramiteScreen"], ["btnCancelarTramite", "tramiteScreen"], ["btnCerrarBitacora", "bitacoraScreen"], ["btnCancelarBitacora", "bitacoraScreen"], ["btnCerrarVersion", "versionScreen"], ["btnCancelarVersion", "versionScreen"]].forEach(([boton, pantalla]) => $(boton).addEventListener("click", () => cerrarPantalla(pantalla)));
    ["bitacoraHoraInicio", "bitacoraHoraFin"].forEach((campo) => $(campo).addEventListener("change", () => { $("bitacoraHoras").value = calcularHoras($("bitacoraHoraInicio").value, $("bitacoraHoraFin").value).toFixed(2); }));
    $("bitacoraManual").addEventListener("change", () => { const m = estado.manuales.find((x) => x.titulo === $("bitacoraManual").value || x.codigo === $("bitacoraManual").value); $("bitacoraTipo").value = m?.tipo || ""; });
}


function abrirDetalleCiclo() {
    if (!estado.ciclo.length) return mostrarToast("No hay un Excel de ciclo importado");
    const columnas = [...HEADERS_CICLO, "Días ciclo"];
    const filas = estado.ciclo.map((item) => columnas.map((h) => h === "Días ciclo" ? (item.dias ?? "") : (item[h] ?? "")));
    const datos = JSON.stringify({ columnas, filas }).replaceAll("<", "\u003c");
    const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Detalle ciclo</title><style>body{font-family:Segoe UI;margin:0;background:#f3f3f3}header{background:#ff6c0c;color:white;padding:16px}main{padding:16px}.wrap{overflow:auto;background:white;border-radius:12px;max-height:calc(100vh - 100px)}table{border-collapse:collapse;min-width:3000px}th{position:sticky;top:0;background:#666;color:white;padding:8px;border:1px solid #888}td{padding:8px;border:1px solid #ddd;font-size:12px}.fbtn{border:0;background:white;color:#ff6c0c;border-radius:5px;margin-left:5px}.menu{position:fixed;display:none;background:white;border:1px solid #ccc;border-radius:10px;padding:10px;box-shadow:0 8px 24px #0003;width:300px;max-height:400px;overflow:auto}.options{max-height:240px;overflow:auto}.opt{display:block;padding:4px}input{width:100%;box-sizing:border-box;padding:7px}</style></head><body><header><h2>Detalle ciclo de cambios</h2></header><main><div class="wrap"><table><thead><tr id="head"></tr></thead><tbody id="body"></tbody></table></div></main><div id="menu" class="menu"></div><script>const data=${datos};const selected={};function esc(v){return String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}function render(){head.innerHTML=data.columnas.map((h,i)=>'<th>'+esc(h)+'<button class="fbtn" onclick="openF('+i+',event)">▼</button></th>').join('');body.innerHTML=data.filas.filter(r=>Object.entries(selected).every(([i,a])=>!a.length||a.includes(String(r[i]??'')))).map(r=>'<tr>'+r.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')}function openF(i,e){e.stopPropagation();const vals=[...new Set(data.filas.map(r=>String(r[i]??'')))].sort();const active=selected[i]||[];menu.innerHTML='<input id="q" placeholder="Buscar"><label class="opt"><input id="all" type="checkbox" '+(!active.length?'checked':'')+'> Seleccionar todo</label><div id="opts" class="options">'+vals.map(v=>'<label class="opt" data-t="'+esc(v.toLowerCase())+'"><input type="checkbox" value="'+esc(v)+'" '+(!active.length||active.includes(v)?'checked':'')+'> '+esc(v||'(Vacío)')+'</label>').join('')+'</div><button onclick="clearF('+i+')">Borrar</button> <button onclick="applyF('+i+')">Aplicar</button>';menu.style.display='block';menu.style.left=Math.min(e.clientX,innerWidth-320)+'px';menu.style.top=Math.min(e.clientY,innerHeight-420)+'px';q.oninput=()=>document.querySelectorAll('[data-t]').forEach(x=>x.style.display=x.dataset.t.includes(q.value.toLowerCase())?'block':'none');all.onchange=()=>document.querySelectorAll('#opts input').forEach(x=>x.checked=all.checked)}function applyF(i){const a=[...document.querySelectorAll('#opts input:checked')].map(x=>x.value);selected[i]=a.length===document.querySelectorAll('#opts input').length?[]:a;menu.style.display='none';render()}function clearF(i){selected[i]=[];menu.style.display='none';render()}document.onclick=()=>menu.style.display='none';render();<\/script></body></html>`;
    const win = window.open("", "_blank");
    if (!win) return mostrarToast("Permita ventanas emergentes para ver el detalle");
    win.document.open(); win.document.write(doc); win.document.close();
}

function configurarBotones() {
    $("btnAgregarManual").addEventListener("click", () => abrirManual());
    $("btnAgregarBitacora").addEventListener("click", () => abrirBitacora());
    $("btnAgregarTramite").addEventListener("click", () => abrirTramite());
    $("btnAgregarVersion").addEventListener("click", () => abrirVersion());
    $("btnEliminarManuales").addEventListener("click", () => eliminarSeleccionados("manuales")); $("btnEliminarTramites").addEventListener("click", () => eliminarSeleccionados("tramites")); $("btnEliminarVersiones").addEventListener("click", () => eliminarSeleccionados("versiones"));
    $("btnLimpiarFiltrosManuales").addEventListener("click", () => { filtros.manuales = {}; filtrosSeleccion.manuales = {}; renderManuales(); }); $("btnLimpiarFiltrosTramites").addEventListener("click", () => { filtros.tramites = {}; filtrosSeleccion.tramites = {}; renderTramites(); }); $("btnLimpiarFiltrosVersiones").addEventListener("click", () => { filtros.versiones = {}; filtrosSeleccion.versiones = {}; renderVersiones(); });
    $("btnExportarManuales").addEventListener("click", () => exportarCSV("manuales")); $("btnExportarTramites").addEventListener("click", () => exportarCSV("tramites")); $("btnExportarVersiones").addEventListener("click", () => exportarCSV("versiones"));
    $("btnColumnasManuales").addEventListener("click", () => abrirColumnas("manuales")); $("btnColumnasTramites").addEventListener("click", () => abrirColumnas("tramites"));
    $("btnCerrarColumnasManuales").addEventListener("click", () => { $("columnsPanelManuales").hidden = true; }); $("btnCerrarColumnasTramites").addEventListener("click", () => { $("columnsPanelTramites").hidden = true; });
    $("btnMostrarTodasManuales").addEventListener("click", () => { estado.columnasOcultasManuales = []; guardarEstado(""); renderManuales(); abrirColumnas("manuales"); }); $("btnMostrarTodasTramites").addEventListener("click", () => { estado.columnasOcultasTramites = []; guardarEstado(""); renderTramites(); abrirColumnas("tramites"); });
    $("btnGuardarNube").addEventListener("click", () => guardarEstado("Información guardada")); $("btnPublicarCambios").addEventListener("click", publicarCambios);
    $("btnPantallaCompleta").addEventListener("click", () => { const panel = $("panelManuales"); if (!document.fullscreenElement) panel.requestFullscreen?.(); else document.exitFullscreen?.(); });
    $("btnExportarDashboard").addEventListener("click", () => descargar("dashboard_kiris.json", JSON.stringify({ manuales: estado.manuales, bitacora: estado.bitacora, ciclo: estado.ciclo }, null, 2), "application/json"));
    $("btnVerDetalleCiclo").addEventListener("click", abrirDetalleCiclo);

    $("btnExportarRespaldo").addEventListener("click", exportarRespaldoCompleto);
    $("btnImportarRespaldo").addEventListener("click", () => $("inputRespaldoCompleto").click());
    $("inputRespaldoCompleto").addEventListener("change", (e) => importarRespaldoCompleto(e.target.files[0]));

    $("btnImportarManuales").addEventListener("click", () => $("inputExcelManuales").click());
    $("btnImportarTramites").addEventListener("click", () => $("inputExcelTramites").click());
    $("btnImportarVersiones").addEventListener("click", () => $("inputExcelVersiones").click());
    $("inputExcelManuales").addEventListener("change", (e) => { importarCSV("manuales", e.target.files[0]); e.target.value = ""; });
    $("inputExcelTramites").addEventListener("change", (e) => { importarCSV("tramites", e.target.files[0]); e.target.value = ""; });
    $("inputExcelVersiones").addEventListener("change", (e) => { importarCSV("versiones", e.target.files[0]); e.target.value = ""; });

    $("btnCopiarRegistros").addEventListener("click", abrirCopiaMasiva);
    $("btnAgregarFechaDestino").addEventListener("click", agregarFechaDestinoCopia);
    $("fechaOrigenCopia").addEventListener("change", renderFechasDestinoCopia);
    $("btnCerrarCopiaMasiva").addEventListener("click", () => { $("panelCopiaMasiva").hidden = true; });
    $("btnCancelarCopiaMasiva").addEventListener("click", () => { $("panelCopiaMasiva").hidden = true; });
    $("btnConfirmarCopiaMasiva").addEventListener("click", confirmarCopiaMasiva);

    $("btnImportarCiclo").addEventListener("click", () => $("inputExcelDashboardCiclo").click());
    $("inputExcelDashboardCiclo").addEventListener("change", (e) => { importarCicloCSV(e.target.files[0]); e.target.value = ""; });
}

function renderTodo() {
    actualizarEstadoGuardado(); poblarDatalists(); renderManuales(); renderCalendario(); renderBitacora(); renderDashboard(); renderTramites(); renderVersiones();
}

async function inicializar() {
    estado = await cargarEstado();
    configurarLogin();
    configurarTabs();
    configurarCalendarios();
    configurarFormularios();
    configurarBotones();
    actualizarEstadoGuardado();
}

document.addEventListener("DOMContentLoaded", inicializar);
