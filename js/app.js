/* ============================================================= 
   KIRIS V2 - MODIFICACIONES APP.JS 
   Sustituir la línea final: 
   document.addEventListener("DOMContentLoaded", inicializar); 
   por TODO este bloque. 
   ============================================================= */ 
 
/* 1. INDEX EXCLUSIVAMENTE EDITOR */ 
configurarLogin = function () { 
    $("btnIngresarEditor").addEventListener("click", () => entrar("editor")); 
    $("btnCerrarSesion").addEventListener("click", cerrarSesion); 
}; 
 
entrar = async function () { 
    editorActivo = true; 
    try { 
        const borrador = window.KirisStorage ? await window.KirisStorage.cargar() : JSON.parse(localStorage.getItem(STORAGE_KEY)); 
        if (borrador && typeof borrador === "object") estado = { ...estadoInicial(), ...borrador, modo: "editor" }; 
    } catch (error) { 
        console.error(error); 
        mostrarToast(error.message || "No fue posible cargar el borrador"); 
    } 
    estado.modo = "editor"; 
    document.body.classList.remove("modo-visitante"); 
    $("loginScreen").hidden = true; 
    $("app").hidden = false; 
    const badge = $("modoUsuarioBadge"); 
    if (badge) { badge.textContent = "Editor"; badge.className = "modo-badge-editor"; } 
    renderTodo(); 
    if ($("estadoSincronizacion")) $("estadoSincronizacion").textContent = "Borrador local"; 
}; 
 
/* 2. CONTROL DE VERSIONES: Código, Descripción, Versión más reciente */ 
COLUMNAS_VERSIONES.splice(0, COLUMNAS_VERSIONES.length, 
    { key: "seleccion", label: "", width: 42, especial: "seleccion" }, 
    { key: "codigo", label: "Código", width: 180 }, 
    { key: "descripcion", label: "Descripción", width: 520 }, 
    { key: "versionMasReciente", label: "Versión más reciente", width: 190 }, 
    { key: "acciones", label: "Acciones", width: 110, especial: "acciones" } 
); 
 
abrirVersion = function (versionId = "") { 
    const v = estado.versiones.find((x) => x.id === versionId); 
    $("versionForm").reset(); 
    $("versionId").value = v?.id || ""; 
    $("versionFormTitle").textContent = v ? "Editar versión" : "Agregar versión"; 
    $("versionCodigo").value = v?.codigo || ""; 
    $("versionDescripcion").value = v?.descripcion || v?.manual || ""; 
    $("versionMasReciente").value = v?.versionMasReciente || v?.numero || v?.version || ""; 
    abrirPantalla("versionScreen"); 
}; 
 
guardarVersionFormulario = function (evento) { 
    evento.preventDefault(); 
    const existenteId = $("versionId").value; 
    const datos = { 
        id: existenteId || id("version"), 
        codigo: $("versionCodigo").value.trim(), 
        descripcion: $("versionDescripcion").value.trim(), 
        versionMasReciente: $("versionMasReciente").value.trim() 
    }; 
    const indice = estado.versiones.findIndex((x) => x.id === existenteId); 
    if (indice >= 0) estado.versiones[indice] = datos; 
    else estado.versiones.unshift(datos); 
    guardarEstado("Versión guardada"); 
    cerrarPantalla("versionScreen"); 
    renderVersiones(); 
}; 
 
renderResumenVersiones = function () { 
    const codigos = new Set(estado.versiones.map((v) => String(v.codigo || "").trim()).filter(Boolean)).size; 
    const conVersion = estado.versiones.filter((v) => String(v.versionMasReciente || v.numero || "").trim()).length; 
    $("resumenVersiones").innerHTML = [ 
        ["Registros", estado.versiones.length], 
        ["Códigos únicos", codigos], 
        ["Con versión", conVersion] 
    ].map(([label, value]) => `<div class="kpi-card"><div class="label">${label}</div><div class="value">${value}</div></div>`).join(""); 
}; 
 
async function importarVersionesXLSX(archivo) { 
    if (!archivo) return; 
    try { 
        if (typeof XLSX === "undefined") throw new Error("No se cargó la librería XLSX."); 
        const libro = XLSX.read(await archivo.arrayBuffer(), { type: "array" }); 
        const hoja = libro.Sheets[libro.SheetNames[0]]; 
        const filas = XLSX.utils.sheet_to_json(hoja, { defval: "", raw: false }); 
        if (!filas.length) throw new Error("El archivo no contiene registros."); 
        const encabezados = Object.keys(filas[0]); 
        const buscar = (nombre) => encabezados.find((h) => normalizar(h).trim() === normalizar(nombre).trim()); 
        const hCodigo = buscar("Código"); 
        const hDescripcion = buscar("Descripción"); 
        const hVersion = buscar("Versión más reciente"); 
        const faltantes = []; 
        if (!hCodigo) faltantes.push("Código"); 
        if (!hDescripcion) faltantes.push("Descripción"); 
        if (!hVersion) faltantes.push("Versión más reciente"); 
        if (faltantes.length) throw new Error(`Faltan encabezados: ${faltantes.join(", ")}`); 
        estado.versiones = filas.filter((f) => String(f[hCodigo] || f[hDescripcion] || f[hVersion]).trim()).map((f) => ({ 
            id: id("version"), 
            codigo: String(f[hCodigo] ?? "").trim(), 
            descripcion: String(f[hDescripcion] ?? "").trim(), 
            versionMasReciente: String(f[hVersion] ?? "").trim() 
        })); 
        await guardarEstado(`${estado.versiones.length} versión(es) importada(s)`); 
        renderVersiones(); 
    } catch (error) { 
        console.error(error); 
        mostrarToast(`No fue posible importar el XLSX: ${error.message}`); 
    } finally { 
        if ($("inputExcelVersiones")) $("inputExcelVersiones").value = ""; 
    } 
} 
 
function exportarVersionesXLSX() { 
    if (typeof XLSX === "undefined") return mostrarToast("No se cargó la librería XLSX"); 
    const filas = estado.versiones.map((v) => ({ 
        "Código": v.codigo || "", 
        "Descripción": v.descripcion || v.manual || "", 
        "Versión más reciente": v.versionMasReciente || v.numero || v.version || "" 
    })); 
    const libro = XLSX.utils.book_new(); 
    const hoja = XLSX.utils.json_to_sheet(filas, { header: ["Código", "Descripción", "Versión más reciente"] }); 
    hoja["!cols"] = [{ wch: 22 }, { wch: 70 }, { wch: 24 }]; 
    XLSX.utils.book_append_sheet(libro, hoja, "Control de Versiones"); 
    XLSX.writeFile(libro, "Control_de_Versiones_KIRIS.xlsx"); 
} 
 
/* Compatibilidad con respaldos anteriores */ 
function normalizarVersionesActuales() { 
    estado.versiones = (estado.versiones || []).map((v) => ({ 
        id: v.id || id("version"), 
        codigo: v.codigo || "", 
        descripcion: v.descripcion ?? v.manual ?? v.observaciones ?? "", 
        versionMasReciente: v.versionMasReciente ?? v.numero ?? v.version ?? "" 
    })); 
} 
 
/* 3. TOOLTIP COMPLETO DE BITÁCORA */ 
function horasTotalesRegistro(registro) { 
    const objetivo = normalizar(registro.manual); 
    return estado.bitacora 
        .filter((r) => normalizar(r.manual) === objetivo) 
        .reduce((total, r) => total + Number(r.horas || 0), 0); 
} 
 
function resumenBitacora(registro) { 
    return [ 
        `Manual: ${registro.manual || ""}`, 
        `Tipo: ${registro.tipo || ""}`, 
        `Hora inicio: ${registro.horaInicio || ""}`, 
        `Hora fin: ${registro.horaFin || ""}`, 
        `Horas: ${Number(registro.horas || 0).toFixed(2)}`, 
        `Páginas: ${registro.paginas ?? ""}`, 
        `Horas totales: ${horasTotalesRegistro(registro).toFixed(2)}`, 
        `Detalle: ${registro.detalle || ""}` 
    ].join("\n"); 
} 
 
renderBitacora = function () { 
    poblarSelectMesAnio($("selectorMesBitacora"), $("selectorAnioBitacora"), fechaBitacora); 
    $("tituloBitacora").textContent = `Bitácora · ${MESES[fechaBitacora.getMonth()]} ${fechaBitacora.getFullYear()}`; 
    const dias = matrizMes(fechaBitacora); 
    $("calendarioBitacora").innerHTML = DIAS.map((d) => `<div class="calendario-encabezado">${d}</div>`).join("") + dias.map((dia) => { 
        const iso = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`; 
        const registros = estado.bitacora.filter((r) => r.fecha === iso); 
        const horas = registros.reduce((t, r) => t + Number(r.horas || 0), 0); 
        return `<div class="calendario-dia ${dia.getMonth() !== fechaBitacora.getMonth() ? "fuera-mes" : ""}" data-bitacora-fecha="${iso}"> 
            <div class="calendario-numero">${dia.getDate()}</div> 
            ${registros.map((r) => `<div class="calendario-evento tipo-${normalizar(r.tipo)}" data-registro-id="${r.id}" title="${escaparHTML(resumenBitacora(r))}">${escaparHTML(r.manual)} · ${Number(r.horas || 0).toFixed(2)} h</div>`).join("")} 
            <div class="bitacora-resumen-dia">${registros.length ? `${registros.length} registro(s) · ${horas.toFixed(2)} h` : ""}</div> 
        </div>`; 
    }).join(""); 
    document.querySelectorAll("[data-bitacora-fecha]").forEach((celda) => celda.addEventListener("dblclick", () => abrirBitacora("", celda.dataset.bitacoraFecha))); 
    document.querySelectorAll("[data-registro-id]").forEach((evento) => evento.addEventListener("click", (e) => { e.stopPropagation(); abrirBitacora(evento.dataset.registroId); })); 
}; 
 
/* 4. FILTRO: la barra permite escribir y abre las casillas en el mismo clic */ 
crearEncabezado = function (elemento, columnas, tipo, ocultas = []) { 
    const fila = columnas.map((columna) => { 
        const oculto = ocultas.includes(columna.key) ? "display:none" : ""; 
        if (columna.especial === "seleccion") return `<th style="${oculto}"><input id="seleccionarTodos_${tipo}" type="checkbox" aria-label="Seleccionar todos"></th>`; 
        if (columna.especial) return `<th data-key="${columna.key}" draggable="true" data-col-drag="${tipo}" style="${oculto}"><div class="th-content"><span>${escaparHTML(columna.label)}</span><span class="resize-handle" data-tipo="${tipo}" data-key="${columna.key}"></span></div></th>`; 
        return `<th data-key="${columna.key}" draggable="true" data-col-drag="${tipo}" style="${oculto}"> 
            <div class="th-content"><span>${escaparHTML(columna.label)}</span><span class="resize-handle" data-tipo="${tipo}" data-key="${columna.key}"></span></div> 
            <div class="filter-combo"><input class="filter-input" data-tipo="${tipo}" data-key="${columna.key}" value="${escaparHTML(filtros[tipo][columna.key] || "")}" placeholder="Buscar"><button type="button" class="excel-filter-btn" data-filtro-tipo="${tipo}" data-filtro-key="${columna.key}" aria-label="Abrir valores">▼</button></div> 
        </th>`; 
    }).join(""); 
    elemento.innerHTML = `<tr>${fila}</tr>`; 
    elemento.querySelectorAll(".filter-input").forEach((input) => { 
        input.addEventListener("focus", () => abrirFiltroExcel(input.dataset.tipo, input.dataset.key, input)); 
        input.addEventListener("click", (e) => { e.stopPropagation(); abrirFiltroExcel(input.dataset.tipo, input.dataset.key, input); }); 
        input.addEventListener("input", () => { 
            filtros[input.dataset.tipo][input.dataset.key] = input.value; 
            renderSegunTipo(input.dataset.tipo); 
            const nuevo = document.querySelector(`.filter-input[data-tipo="${input.dataset.tipo}"][data-key="${input.dataset.key}"]`); 
            nuevo?.focus(); 
            nuevo?.setSelectionRange(nuevo.value.length, nuevo.value.length); 
        }); 
    }); 
    elemento.querySelectorAll(".excel-filter-btn").forEach((boton) => boton.addEventListener("click", (e) => { e.stopPropagation(); abrirFiltroExcel(boton.dataset.filtroTipo, boton.dataset.filtroKey, boton); })); 
    habilitarMovimientoColumnas(elemento, tipo); 
}; 
 
/* 5. COLUMNAS MOVIBLES SOLO DURANTE LA SESIÓN */ 
const ordenTemporalColumnas = { 
    manuales: COLUMNAS_MANUALES.map((c) => c.key), 
    tramites: COLUMNAS_TRAMITES.map((c) => c.key), 
    versiones: COLUMNAS_VERSIONES.map((c) => c.key) 
}; 
 
function columnasBase(tipo) { 
    return tipo === "manuales" ? COLUMNAS_MANUALES : tipo === "tramites" ? COLUMNAS_TRAMITES : COLUMNAS_VERSIONES; 
} 
 
function columnasOrdenadas(tipo) { 
    const base = columnasBase(tipo); 
    const mapa = new Map(base.map((c) => [c.key, c])); 
    return (ordenTemporalColumnas[tipo] || base.map((c) => c.key)).map((key) => mapa.get(key)).filter(Boolean); 
} 
 
function habilitarMovimientoColumnas(thead, tipo) { 
    thead.querySelectorAll('th[draggable="true"]').forEach((th) => { 
        th.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", th.dataset.key); th.classList.add("columna-arrastrando"); }); 
        th.addEventListener("dragend", () => th.classList.remove("columna-arrastrando")); 
        th.addEventListener("dragover", (e) => { e.preventDefault(); th.classList.add("columna-destino"); }); 
        th.addEventListener("dragleave", () => th.classList.remove("columna-destino")); 
        th.addEventListener("drop", (e) => { 
            e.preventDefault(); th.classList.remove("columna-destino"); 
            const origen = e.dataTransfer.getData("text/plain"), destino = th.dataset.key; 
            if (!origen || origen === destino) return; 
            const orden = ordenTemporalColumnas[tipo]; 
            const desde = orden.indexOf(origen), hacia = orden.indexOf(destino); 
            if (desde < 0 || hacia < 0) return; 
            orden.splice(hacia, 0, orden.splice(desde, 1)[0]); 
            renderSegunTipo(tipo); 
        }); 
    }); 
} 
 
/* Se reutilizan los renderizadores actuales, pero con el orden temporal */ 
const _renderManualesBase = renderManuales; 
const _renderTramitesBase = renderTramites; 
const _renderVersionesBase = renderVersiones; 
 
function intercambiarArrayEnSitio(destino, origen) { 
    destino.splice(0, destino.length, ...origen); 
} 
 
renderManuales = function () { 
    const original = [...COLUMNAS_MANUALES]; 
    intercambiarArrayEnSitio(COLUMNAS_MANUALES, columnasOrdenadas("manuales")); 
    _renderManualesBase(); 
    intercambiarArrayEnSitio(COLUMNAS_MANUALES, original); 
}; 
renderTramites = function () { 
    const original = [...COLUMNAS_TRAMITES]; 
    intercambiarArrayEnSitio(COLUMNAS_TRAMITES, columnasOrdenadas("tramites")); 
    _renderTramitesBase(); 
    intercambiarArrayEnSitio(COLUMNAS_TRAMITES, original); 
}; 
renderVersiones = function () { 
    const original = [...COLUMNAS_VERSIONES]; 
    intercambiarArrayEnSitio(COLUMNAS_VERSIONES, columnasOrdenadas("versiones")); 
    _renderVersionesBase(); 
    intercambiarArrayEnSitio(COLUMNAS_VERSIONES, original); 
}; 
 
/* Ajustes de eventos para XLSX y nuevo formulario */ 
configurarFormularios = function () { 
    $("manualForm").addEventListener("submit", guardarManualFormulario); 
    $("tramiteForm").addEventListener("submit", guardarTramiteFormulario); 
    $("bitacoraForm").addEventListener("submit", guardarBitacoraFormulario); 
    $("versionForm").addEventListener("submit", guardarVersionFormulario); 
    [["btnCerrarManual","manualScreen"],["btnCancelarManual","manualScreen"],["btnCerrarTramite","tramiteScreen"],["btnCancelarTramite","tramiteScreen"],["btnCerrarBitacora","bitacoraScreen"],["btnCancelarBitacora","bitacoraScreen"],["btnCerrarVersion","versionScreen"],["btnCancelarVersion","versionScreen"]].forEach(([b,p]) => $(b).addEventListener("click", () => cerrarPantalla(p))); 
    ["bitacoraHoraInicio","bitacoraHoraFin"].forEach((campo) => $(campo).addEventListener("change", () => { $("bitacoraHoras").value = calcularHoras($("bitacoraHoraInicio").value, $("bitacoraHoraFin").value).toFixed(2); })); 
    $("bitacoraManual").addEventListener("change", () => { const m = estado.manuales.find((x) => x.titulo === $("bitacoraManual").value || x.codigo === $("bitacoraManual").value); $("bitacoraTipo").value = m?.tipo || ""; }); 
}; 
 
const _configurarBotonesBase = configurarBotones; 
configurarBotones = function () { 
    _configurarBotonesBase(); 
    const input = $("inputExcelVersiones"); 
    const reemplazo = input.cloneNode(true); 
    input.parentNode.replaceChild(reemplazo, input); 
    reemplazo.addEventListener("change", (e) => importarVersionesXLSX(e.target.files[0])); 
    const botonExportar = $("btnExportarVersiones"); 
    const nuevoExportar = botonExportar.cloneNode(true); 
    botonExportar.parentNode.replaceChild(nuevoExportar, botonExportar); 
    nuevoExportar.addEventListener("click", exportarVersionesXLSX); 
}; 
 
const _inicializarBase = inicializar; 
inicializar = async function () { 
    estado = await cargarEstado(); 
    normalizarVersionesActuales(); 
    configurarLogin(); 
    configurarTabs(); 
    configurarCalendarios(); 
    configurarFormularios(); 
    configurarBotones(); 
    actualizarEstadoGuardado(); 
}; 
 
document.addEventListener("DOMContentLoaded", inicializar); 
 
