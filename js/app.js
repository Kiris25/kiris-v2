"use strict"; 
 
const $ = (id) => document.getElementById(id); 
const STORAGE_KEY = "kirisV2_estado_maestro"; 
const PUBLISHED_KEY = "kirisV2_publicado"; 
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; 
const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]; 
 
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
    { key: "codigo", label: "Código", width: 180 }, 
    { key: "descripcion", label: "Descripción", width: 520 }, 
    { key: "versionMasReciente", label: "Versión más reciente", width: 190 }, 
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
            id: id("version"), codigo: "MAN001", descripcion: "Manual de prueba", versionMasReciente: "1.0" 
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
let filtros = { manuales: {}, tramites: {}, versiones: {} }; 
let filtrosSeleccion = { manuales: {}, tramites: {}, versiones: {} }; 
const ordenOriginalColumnas = { manuales: COLUMNAS_MANUALES.map(c => c.key), tramites: COLUMNAS_TRAMITES.map(c => c.key), versiones: COLUMNAS_VERSIONES.map(c => c.key) }; 
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
    $("loginScreen").hidden = true; 
    $("app").hidden = false; 
    const badge = $("modoUsuarioBadge"); 
    if (badge) { badge.textContent = "Editor"; badge.className = "modo-badge-editor"; } 
    renderTodo(); 
} 
 
function cerrarSesion() { 
    $("app").hidden = true; 
    $("loginScreen").hidden = false; 
    $("loginPassword").value = ""; 
} 
 
function configurarLogin() { 
    $("btnIngresarEditor")?.addEventListener("click", entrar); 
    $("btnCerrarSesion")?.addEventListener("click", cerrarSesion); 
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
        if (columna.especial) return true; 
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
 
function columnasPorTipo(tipo) { 
    return tipo === "manuales" ? COLUMNAS_MANUALES : tipo === "tramites" ? COLUMNAS_TRAMITES : COLUMNAS_VERSIONES; 
} 
function renderSegunTipo(tipo) { 
    if (tipo === "manuales") renderManuales(); 
    if (tipo === "tramites") renderTramites(); 
    if (tipo === "versiones") renderVersiones(); 
} 
function cerrarFiltroExcel() { 
    const menu = $("filterMenu"); 
    if (!menu) return; 
    menu.hidden = true; 
    menu.innerHTML = ""; 
} 
function abrirFiltroExcel(tipo, key, ancla) { 
    const columna = columnasPorTipo(tipo).find(c => c.key === key); 
    if (!columna) return; 
    const valores = [...new Set((estado[tipo] || []).map(item => String(valorVisible(item, columna) ?? "")))].sort((a,b) => a.localeCompare(b,"es",{numeric:true,sensitivity:"base"})); 
    const activos = filtrosSeleccion[tipo][key] || []; 
    const menu = $("filterMenu"); 
    menu.innerHTML = `<div class="excel-filter-title">${escaparHTML(columna.label)}</div><input id="excelFilterSearch" class="filter-input" type="search" placeholder="Buscar valores..."><label class="excel-filter-option"><input id="excelFilterAll" type="checkbox" ${!activos.length || activos.length === valores.length ? "checked" : ""}> Seleccionar todo</label><div id="excelFilterValues" class="excel-filter-values">${valores.map(valor => `<label class="excel-filter-option" data-value-text="${escaparHTML(normalizar(valor))}"><input type="checkbox" value="${escaparHTML(valor)}" ${!activos.length || activos.includes(valor) ? "checked" : ""}> <span>${escaparHTML(valor || "(Vacío)")}</span></label>`).join("")}</div><div class="excel-filter-actions"><button id="excelFilterClear" class="btn btn-light" type="button">Borrar filtro</button><button id="excelFilterApply" class="btn btn-primary" type="button">Aplicar</button></div>`; 
    const rect = ancla.getBoundingClientRect(); 
    menu.style.left = `${Math.max(8,Math.min(rect.left,window.innerWidth-330))}px`; 
    menu.style.top = `${Math.max(8,Math.min(rect.bottom+4,window.innerHeight-430))}px`; 
    menu.hidden = false; 
    $("excelFilterSearch").addEventListener("input", e => menu.querySelectorAll("[data-value-text]").forEach(label => label.hidden = !label.dataset.valueText.includes(normalizar(e.target.value)))); 
    $("excelFilterAll").addEventListener("change", e => menu.querySelectorAll('#excelFilterValues input[type="checkbox"]').forEach(c => { if (!c.closest("label").hidden) c.checked = e.target.checked; })); 
    $("excelFilterClear").addEventListener("click", () => { delete filtrosSeleccion[tipo][key]; cerrarFiltroExcel(); renderSegunTipo(tipo); }); 
    $("excelFilterApply").addEventListener("click", () => { const seleccion=[...menu.querySelectorAll('#excelFilterValues input[type="checkbox"]:checked')].map(c=>c.value); filtrosSeleccion[tipo][key]=seleccion.length===valores.length?[]:seleccion; cerrarFiltroExcel(); renderSegunTipo(tipo); }); 
} 
function habilitarMovimientoColumnas(elemento, tipo) { 
    elemento.querySelectorAll('th[draggable="true"]').forEach(th => { 
        th.addEventListener("dragstart", e => { if (e.target.closest("input,button,.resize-handle")) { e.preventDefault(); return; } e.dataTransfer.setData("text/plain",th.dataset.key); th.classList.add("columna-arrastrando"); }); 
        th.addEventListener("dragend", () => th.classList.remove("columna-arrastrando")); 
        th.addEventListener("dragover", e => { e.preventDefault(); th.classList.add("columna-destino"); }); 
        th.addEventListener("dragleave", () => th.classList.remove("columna-destino")); 
        th.addEventListener("drop", e => { e.preventDefault(); th.classList.remove("columna-destino"); const origen=e.dataTransfer.getData("text/plain"),destino=th.dataset.key,cols=columnasPorTipo(tipo),i=cols.findIndex(c=>c.key===origen),j=cols.findIndex(c=>c.key===destino); if(i>=0&&j>=0&&i!==j){cols.splice(j,0,cols.splice(i,1)[0]);renderSegunTipo(tipo);} }); 
    }); 
} 
function crearEncabezado(elemento, columnas, tipo, ocultas = []) { 
    elemento.innerHTML = `<tr>${columnas.map(columna => { 
        const oculto = ocultas.includes(columna.key) ? "display:none" : ""; 
        if (columna.especial === "seleccion") return `<th style="${oculto}"><input id="seleccionarTodos_${tipo}" type="checkbox" aria-label="Seleccionar todos"></th>`; 
        if (columna.especial) return `<th data-key="${columna.key}" draggable="true" style="${oculto}"><div class="th-content"><span>${escaparHTML(columna.label)}</span><span class="resize-handle" data-tipo="${tipo}" data-key="${columna.key}"></span></div></th>`; 
        return `<th data-key="${columna.key}" draggable="true" style="${oculto}"><div class="th-content"><span>${escaparHTML(columna.label)}</span><span class="resize-handle" data-tipo="${tipo}" data-key="${columna.key}"></span></div><div class="filter-combo"><input class="filter-input" data-tipo="${tipo}" data-key="${columna.key}" value="${escaparHTML(filtros[tipo][columna.key] || "")}" placeholder="Buscar"><button type="button" class="excel-filter-btn" data-filtro-tipo="${tipo}" data-filtro-key="${columna.key}">▼</button></div></th>`; 
    }).join("")}</tr>`; 
    elemento.querySelectorAll(".filter-input").forEach(input => { 
        input.addEventListener("click", e => { e.stopPropagation(); abrirFiltroExcel(tipo,input.dataset.key,input); }); 
        input.addEventListener("focus", () => abrirFiltroExcel(tipo,input.dataset.key,input)); 
        input.addEventListener("input", () => { filtros[tipo][input.dataset.key]=input.value; renderSegunTipo(tipo); const nuevo=document.querySelector(`.filter-input[data-tipo="${tipo}"][data-key="${input.dataset.key}"]`); nuevo?.focus(); nuevo?.setSelectionRange(nuevo.value.length,nuevo.value.length); }); 
    }); 
    elemento.querySelectorAll(".excel-filter-btn").forEach(b => b.addEventListener("click",e => { e.stopPropagation(); abrirFiltroExcel(tipo,b.dataset.filtroKey,b); })); 
    habilitarMovimientoColumnas(elemento,tipo); 
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
    const codigos=new Set(estado.versiones.map(v=>v.codigo).filter(Boolean)).size; const conVersion=estado.versiones.filter(v=>v.versionMasReciente||v.numero).length; 
    $("resumenVersiones").innerHTML=[["Registros",estado.versiones.length],["Códigos únicos",codigos],["Con versión",conVersion]].map(([label,value])=>`<div class="kpi-card"><div class="label">${label}</div><div class="value">${value}</div></div>`).join(""); 
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
 
function horasTotalesRegistro(registro) { 
    return estado.bitacora.filter(r => normalizar(r.manual) === normalizar(registro.manual)).reduce((t,r)=>t+Number(r.horas||0),0); 
} 
function resumenBitacora(registro) { 
    return [`Manual: ${registro.manual||""}`,`Tipo: ${registro.tipo||""}`,`Hora inicio: ${registro.horaInicio||""}`,`Hora fin: ${registro.horaFin||""}`,`Horas: ${Number(registro.horas||0).toFixed(2)}`,`Páginas: ${registro.paginas??""}`,`Horas totales: ${horasTotalesRegistro(registro).toFixed(2)}`,`Detalle: ${registro.detalle||""}`].join("\n"); 
} 
function renderBitacora() { 
    poblarSelectMesAnio($("selectorMesBitacora"), $("selectorAnioBitacora"), fechaBitacora); 
    $("tituloBitacora").textContent = `Bitácora · ${MESES[fechaBitacora.getMonth()]} ${fechaBitacora.getFullYear()}`; 
    const dias = matrizMes(fechaBitacora); 
    $("calendarioBitacora").innerHTML = DIAS.map(d => `<div class="calendario-encabezado">${d}</div>`).join("") + dias.map(dia => { 
        const iso = `${dia.getFullYear()}-${String(dia.getMonth()+1).padStart(2,"0")}-${String(dia.getDate()).padStart(2,"0")}`; 
        const registros=estado.bitacora.filter(r=>r.fecha===iso),horas=registros.reduce((t,r)=>t+Number(r.horas||0),0); 
        return `<div class="calendario-dia ${dia.getMonth()!==fechaBitacora.getMonth()?"fuera-mes":""}" data-bitacora-fecha="${iso}"><div class="calendario-numero">${dia.getDate()}</div>${registros.map(r=>`<div class="calendario-evento tipo-${normalizar(r.tipo)}" data-registro-id="${r.id}" title="${escaparHTML(resumenBitacora(r))}">${escaparHTML(r.manual)} · ${Number(r.horas||0).toFixed(2)} h</div>`).join("")}<div class="bitacora-resumen-dia">${registros.length?`${registros.length} registro(s) · ${horas.toFixed(2)} h`:""}</div></div>`; 
    }).join(""); 
    document.querySelectorAll("[data-bitacora-fecha]").forEach(c=>c.addEventListener("dblclick",()=>abrirBitacora("",c.dataset.bitacoraFecha))); 
    document.querySelectorAll("[data-registro-id]").forEach(e=>e.addEventListener("click",x=>{x.stopPropagation();abrirBitacora(e.dataset.registroId);})); 
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
    const v=estado.versiones.find(x=>x.id===versionId); $("versionForm").reset(); $("versionId").value=v?.id||""; $("versionFormTitle").textContent=v?"Editar versión":"Agregar versión"; 
    $("versionCodigo").value=v?.codigo||""; $("versionDescripcion").value=v?.descripcion??v?.manual??""; $("versionMasReciente").value=v?.versionMasReciente??v?.numero??v?.version??""; abrirPantalla("versionScreen"); 
} 
 
function guardarVersionFormulario(evento) { 
    evento.preventDefault(); const existenteId=$("versionId").value; const datos={id:existenteId||id("version"),codigo:$("versionCodigo").value.trim(),descripcion:$("versionDescripcion").value.trim(),versionMasReciente:$("versionMasReciente").value.trim()}; const indice=estado.versiones.findIndex(x=>x.id===existenteId); if(indice>=0)estado.versiones[indice]=datos;else estado.versiones.unshift(datos); guardarEstado("Versión guardada"); cerrarPantalla("versionScreen"); renderVersiones(); 
} 
 
function eliminarSeleccionados(tipo) { 
    const singular = tipo === "manuales" ? "manual" : tipo === "tramites" ? "tramite" : "version"; 
    const ids=[...document.querySelectorAll(`.seleccion-${singular}:checked`)].map(c=>c.dataset.id); 
    if(!ids.length)return mostrarToast("No hay registros seleccionados"); 
    if(!confirm(`¿Eliminar ${ids.length} registro(s)?`))return; 
    estado[tipo]=estado[tipo].filter(item=>!ids.includes(item.id)); guardarEstado("Registros eliminados"); renderSegunTipo(tipo); 
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
 
async function importarVersionesXLSX(archivo) { 
    if(!archivo)return; 
    try { if(typeof XLSX==="undefined")throw new Error("No se cargó la librería XLSX"); const libro=XLSX.read(await archivo.arrayBuffer(),{type:"array"}); const filas=XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]],{defval:"",raw:false}); if(!filas.length)throw new Error("El archivo no contiene registros"); const hs=Object.keys(filas[0]),buscar=n=>hs.find(h=>normalizar(h).trim()===normalizar(n).trim()),hc=buscar("Código"),hd=buscar("Descripción"),hv=buscar("Versión más reciente"),faltantes=[!hc&&"Código",!hd&&"Descripción",!hv&&"Versión más reciente"].filter(Boolean); if(faltantes.length)throw new Error(`Faltan encabezados: ${faltantes.join(", ")}`); estado.versiones=filas.map(f=>({id:id("version"),codigo:String(f[hc]??"").trim(),descripcion:String(f[hd]??"").trim(),versionMasReciente:String(f[hv]??"").trim()})).filter(v=>v.codigo||v.descripcion||v.versionMasReciente); guardarEstado(`${estado.versiones.length} versión(es) importada(s)`); renderVersiones(); } catch(error){console.error(error);mostrarToast(`No fue posible importar el XLSX: ${error.message}`);} finally{$("inputExcelVersiones").value="";} 
} 
function exportarVersionesXLSX() { 
    if(typeof XLSX==="undefined")return mostrarToast("No se cargó la librería XLSX"); const libro=XLSX.utils.book_new(),hoja=XLSX.utils.json_to_sheet(estado.versiones.map(v=>({"Código":v.codigo||"","Descripción":v.descripcion||"","Versión más reciente":v.versionMasReciente||""}))); hoja["!cols"]=[{wch:22},{wch:70},{wch:24}]; XLSX.utils.book_append_sheet(libro,hoja,"Control de Versiones"); XLSX.writeFile(libro,"Control_de_Versiones_KIRIS.xlsx"); 
} 
function configurarBotones() { 
    $("btnAgregarManual").addEventListener("click", () => abrirManual()); $("btnAgregarTramite").addEventListener("click", () => abrirTramite()); $("btnAgregarVersion").addEventListener("click", () => abrirVersion()); 
    $("btnEliminarManuales").addEventListener("click", () => eliminarSeleccionados("manuales")); $("btnEliminarTramites").addEventListener("click", () => eliminarSeleccionados("tramites")); $("btnEliminarVersiones").addEventListener("click", () => eliminarSeleccionados("versiones")); 
    $("btnLimpiarFiltrosManuales").addEventListener("click", () => { filtros.manuales = {}; filtrosSeleccion.manuales = {}; renderManuales(); }); $("btnLimpiarFiltrosTramites").addEventListener("click", () => { filtros.tramites = {}; filtrosSeleccion.tramites = {}; renderTramites(); }); $("btnLimpiarFiltrosVersiones").addEventListener("click", () => { filtros.versiones = {}; filtrosSeleccion.versiones = {}; renderVersiones(); }); 
    $("btnExportarManuales").addEventListener("click", () => exportarCSV("manuales")); $("btnExportarTramites").addEventListener("click", () => exportarCSV("tramites")); $("btnExportarVersiones").addEventListener("click", () => exportarCSV("versiones")); 
    $("btnColumnasManuales").addEventListener("click", () => abrirColumnas("manuales")); $("btnColumnasTramites").addEventListener("click", () => abrirColumnas("tramites")); 
    $("btnCerrarColumnasManuales").addEventListener("click", () => { $("columnsPanelManuales").hidden = true; }); $("btnCerrarColumnasTramites").addEventListener("click", () => { $("columnsPanelTramites").hidden = true; }); 
    $("btnMostrarTodasManuales").addEventListener("click", () => { estado.columnasOcultasManuales = []; guardarEstado(""); renderManuales(); abrirColumnas("manuales"); }); $("btnMostrarTodasTramites").addEventListener("click", () => { estado.columnasOcultasTramites = []; guardarEstado(""); renderTramites(); abrirColumnas("tramites"); }); 
    $("btnGuardarNube").addEventListener("click", () => guardarEstado("Información guardada")); $("btnPublicarCambios").addEventListener("click", publicarCambios); 
    $("btnPantallaCompleta").addEventListener("click", () => { const panel = $("panelManuales"); if (!document.fullscreenElement) panel.requestFullscreen?.(); else document.exitFullscreen?.(); }); 
    $("btnExportarDashboard").addEventListener("click", () => descargar("dashboard_kiris.json", JSON.stringify({ manuales: estado.manuales, bitacora: estado.bitacora, ciclo: estado.ciclo }, null, 2), "application/json")); 
    $("btnVerDetalleCiclo").addEventListener("click", () => mostrarToast(`${estado.ciclo.length} registro(s) de ciclo cargados`)); 
 
    $("btnImportarVersiones")?.addEventListener("click", () => $("inputExcelVersiones").click()); 
    $("inputExcelVersiones")?.addEventListener("change", e => importarVersionesXLSX(e.target.files[0])); 
    const exportarVersiones = $("btnExportarVersiones"); 
    if (exportarVersiones) { const nuevo = exportarVersiones.cloneNode(true); exportarVersiones.parentNode.replaceChild(nuevo, exportarVersiones); nuevo.addEventListener("click", exportarVersionesXLSX); } 
} 
 
function renderTodo() { 
    actualizarEstadoGuardado(); poblarDatalists(); renderManuales(); renderCalendario(); renderBitacora(); renderDashboard(); renderTramites(); renderVersiones(); renderComentarios(); 
} 
 
function inicializar() { 
    configurarLogin(); configurarTabs(); configurarCalendarios(); configurarComentarios(); configurarFormularios(); configurarBotones(); 
    actualizarEstadoGuardado(); 
} 
 
document.addEventListener("DOMContentLoaded", inicializar); 
 
 
