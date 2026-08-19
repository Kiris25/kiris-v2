"use strict"; 
 
/* KIRIS V2: movimiento directo y ordenamiento por lógica de negocio. 
   Cargar este archivo después de js/app.js. */ 
(() => { 
    const $id = (id) => document.getElementById(id); 
    const normalizarKiris = (valor) => String(valor ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
 
    function columnasDe(tipo) { 
        if (tipo === "manuales") return window.COLUMNAS_MANUALES || COLUMNAS_MANUALES; 
        if (tipo === "tramites") return window.COLUMNAS_TRAMITES || COLUMNAS_TRAMITES; 
        return window.COLUMNAS_VERSIONES || COLUMNAS_VERSIONES; 
    } 
 
    function renderDe(tipo) { 
        if (tipo === "manuales") renderManuales(); 
        else if (tipo === "tramites") renderTramites(); 
        else renderVersiones(); 
    } 
 
    function valorOrdenable(registro, columna) { 
        if (typeof valorVisible === "function") return valorVisible(registro, columna); 
        return registro?.[columna.key] ?? ""; 
    } 
 
    function compararTexto(a, b) { 
        return String(a ?? "").localeCompare(String(b ?? ""), "es", { numeric: true, sensitivity: "base" }); 
    } 
 
    function compararNumero(a, b) { 
        const na = Number(a); 
        const nb = Number(b); 
        if (Number.isNaN(na) && Number.isNaN(nb)) return 0; 
        if (Number.isNaN(na)) return 1; 
        if (Number.isNaN(nb)) return -1; 
        return na - nb; 
    } 
 
    function compararFecha(a, b) { 
        const ta = a ? new Date(`${a}T00:00:00`).getTime() : Number.POSITIVE_INFINITY; 
        const tb = b ? new Date(`${b}T00:00:00`).getTime() : Number.POSITIVE_INFINITY; 
        return ta - tb; 
    } 
 
    function indiceLogico(valor, opciones) { 
        const buscado = normalizarKiris(valor); 
        const indice = opciones.findIndex((opcion) => normalizarKiris(opcion) === buscado); 
        return indice < 0 ? opciones.length : indice; 
    } 
 
    function ordenarColeccion(tipo, columna, sentido = 1) { 
        const lista = estado[tipo]; 
        if (!Array.isArray(lista) || !columna || columna.especial) return; 
 
        const opcionesLogicas = Array.isArray(columna.opciones) 
            ? columna.opciones.filter((opcion) => String(opcion).trim() !== "") 
            : []; 
 
        lista.sort((registroA, registroB) => { 
            const a = valorOrdenable(registroA, columna); 
            const b = valorOrdenable(registroB, columna); 
            let resultado; 
 
            if (opcionesLogicas.length) { 
                resultado = indiceLogico(a, opcionesLogicas) - indiceLogico(b, opcionesLogicas); 
                if (resultado === 0) resultado = compararTexto(a, b); 
            } else if (columna.tipo === "number") { 
                resultado = compararNumero(a, b); 
            } else if (columna.tipo === "date") { 
                resultado = compararFecha(a, b); 
            } else { 
                resultado = compararTexto(a, b); 
            } 
 
            return resultado * sentido; 
        }); 
 
        guardarEstado(`Orden actualizado por ${columna.label}`); 
        renderDe(tipo); 
    } 
 
    function abrirMenuOrden(evento, tipo, columna, boton) { 
        evento.preventDefault(); 
        evento.stopPropagation(); 
        document.querySelectorAll(".sort-menu-kiris").forEach((menu) => menu.remove()); 
 
        const menu = document.createElement("div"); 
        menu.className = "sort-menu-kiris"; 
        const esLista = Array.isArray(columna.opciones) && columna.opciones.filter(Boolean).length > 0; 
        const detalle = esLista 
            ? columna.opciones.filter(Boolean).map((opcion, indice) => `<li><strong>${indice + 1}.</strong> ${escaparHTML(opcion)}</li>`).join("") 
            : ""; 
 
        menu.innerHTML = ` 
            <div class="sort-menu-title">Ordenar por ${escaparHTML(columna.label)}</div> 
            ${esLista ? `<div class="sort-menu-help">Se aplicará el orden lógico definido para esta columna:</div><ol class="sort-menu-values">${detalle}</ol>` : `<div class="sort-menu-help">Esta columna se ordena por su tipo de información.</div>`} 
            <button type="button" data-sort="normal">${esLista ? "Aplicar orden lógico" : (columna.tipo === "date" ? "Más antiguo a más reciente" : columna.tipo === "number" ? "Menor a mayor" : "A a Z")}</button> 
            <button type="button" data-sort="reverse">${esLista ? "Aplicar orden lógico inverso" : (columna.tipo === "date" ? "Más reciente a más antiguo" : columna.tipo === "number" ? "Mayor a menor" : "Z a A")}</button>`; 
 
        document.body.appendChild(menu); 
        const rect = boton.getBoundingClientRect(); 
        menu.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - 330))}px`; 
        menu.style.top = `${Math.min(rect.bottom + 5, innerHeight - menu.offsetHeight - 8)}px`; 
        menu.onclick = (e) => e.stopPropagation(); 
        menu.querySelector('[data-sort="normal"]').onclick = () => { menu.remove(); ordenarColeccion(tipo, columna, 1); }; 
        menu.querySelector('[data-sort="reverse"]').onclick = () => { menu.remove(); ordenarColeccion(tipo, columna, -1); }; 
    } 
 
    function agregarFlechasOrden() { 
        const configuraciones = [ 
            ["theadManuales", "manuales"], 
            ["theadTramites", "tramites"], 
            ["theadVersiones", "versiones"] 
        ]; 
 
        configuraciones.forEach(([theadId, tipo]) => { 
            const thead = $id(theadId); 
            if (!thead) return; 
            const columnas = columnasDe(tipo); 
            thead.querySelectorAll("tr:first-child th[data-key]").forEach((th) => { 
                const columna = columnas.find((item) => item.key === th.dataset.key); 
                if (!columna || columna.especial || th.querySelector(".sort-arrow-kiris")) return; 
                const contenido = th.querySelector(".th-content"); 
                if (!contenido) return; 
                const boton = document.createElement("button"); 
                boton.type = "button"; 
                boton.className = "sort-arrow-kiris"; 
                boton.textContent = "▼"; 
                boton.title = `Reorganizar por ${columna.label}`; 
                boton.setAttribute("aria-label", `Reorganizar por ${columna.label}`); 
                boton.onclick = (evento) => abrirMenuOrden(evento, tipo, columna, boton); 
                const resize = contenido.querySelector(".resize-handle"); 
                contenido.insertBefore(boton, resize || null); 
            }); 
        }); 
    } 
 
    function moverManualAPosicion(manualId) { 
        const indiceActual = estado.manuales.findIndex((manual) => manual.id === manualId); 
        if (indiceActual < 0) return; 
        const actual = indiceActual + 1; 
        const respuesta = prompt(`Posición actual: ${actual}\nMover este manual a la posición:`, String(actual)); 
        if (respuesta === null) return; 
        const destinoSolicitado = Number.parseInt(respuesta, 10); 
        if (!Number.isInteger(destinoSolicitado) || destinoSolicitado < 1 || destinoSolicitado > estado.manuales.length) { 
            mostrarToast(`Indique una posición entre 1 y ${estado.manuales.length}`); 
            return; 
        } 
        if (destinoSolicitado === actual) return; 
        const [movido] = estado.manuales.splice(indiceActual, 1); 
        estado.manuales.splice(destinoSolicitado - 1, 0, movido); 
        guardarEstado(`Manual movido a la posición ${destinoSolicitado}`); 
        renderManuales(); 
    } 
 
    function agregarBotonesMover() { 
        document.querySelectorAll("#tbodyManuales tr[data-id]").forEach((fila) => { 
            const celda = fila.querySelector("td.numero-manual"); 
            if (!celda || celda.querySelector(".move-position-kiris")) return; 
            const boton = document.createElement("button"); 
            boton.type = "button"; 
            boton.className = "move-position-kiris"; 
            boton.textContent = "↕"; 
            boton.title = "Mover a una posición específica"; 
            boton.setAttribute("aria-label", "Mover a una posición específica"); 
            boton.onclick = (evento) => { 
                evento.preventDefault(); 
                evento.stopPropagation(); 
                moverManualAPosicion(fila.dataset.id); 
            }; 
            celda.appendChild(boton); 
        }); 
    } 
 
    function actualizarControles() { 
        agregarFlechasOrden(); 
        agregarBotonesMover(); 
    } 
 
    document.addEventListener("click", () => document.querySelectorAll(".sort-menu-kiris").forEach((menu) => menu.remove())); 
    document.addEventListener("DOMContentLoaded", () => { 
        actualizarControles(); 
        ["theadManuales", "theadTramites", "theadVersiones", "tbodyManuales"].forEach((id) => { 
            const nodo = $id(id); 
            if (nodo) new MutationObserver(actualizarControles).observe(nodo, { childList: true, subtree: true }); 
        }); 
    }); 
})(); 
 
