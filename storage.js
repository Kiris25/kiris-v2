"use strict";

window.KIRIS_STORAGE_CONFIG = window.KIRIS_STORAGE_CONFIG || {
    modo: "local",
    sitioSharePoint: "https://evertecgroup.sharepoint.com/sites/UnidadEnlaceOperacional",
    lista: "RepositorioDocumentacionLista",
    tituloBorrador: "BASE_GESTOR_BORRADOR",
    tituloPublicado: "BASE_GESTOR_PUBLICADO",
    campoJson: "JsonData"
};

window.KirisStorage = (() => {
    const CLAVE_LOCAL = "kirisV2_estado_maestro";
    const CLAVE_PUBLICADO = "kirisV2_publicado";
    const config = window.KIRIS_STORAGE_CONFIG;

    function esSharePointMismoOrigen() {
        if (config.modo !== "sharepoint") return false;
        try {
            return location.protocol.startsWith("http") &&
                new URL(config.sitioSharePoint).origin === location.origin;
        } catch {
            return false;
        }
    }

    async function obtenerDigest() {
        const respuesta = await fetch(`${config.sitioSharePoint}/_api/contextinfo`, {
            method: "POST",
            headers: { Accept: "application/json;odata=nometadata" },
            credentials: "include"
        });
        if (!respuesta.ok) throw new Error(`No fue posible obtener el digest (${respuesta.status}).`);
        const datos = await respuesta.json();
        return datos.FormDigestValue;
    }

    async function buscarItem(titulo) {
        const filtro = encodeURIComponent(`Title eq '${titulo.replaceAll("'", "''")}'`);
        const url = `${config.sitioSharePoint}/_api/web/lists/getbytitle('${encodeURIComponent(config.lista)}')/items?$select=Id,Title,${config.campoJson}&$filter=${filtro}&$top=1`;
        const respuesta = await fetch(url, {
            headers: { Accept: "application/json;odata=nometadata" },
            credentials: "include"
        });
        if (!respuesta.ok) throw new Error(`No fue posible leer SharePoint (${respuesta.status}).`);
        const datos = await respuesta.json();
        return datos.value?.[0] || null;
    }

    async function guardarItem(titulo, paquete) {
        const item = await buscarItem(titulo);
        if (!item) throw new Error(`No existe el registro ${titulo} en ${config.lista}.`);
        const digest = await obtenerDigest();
        const url = `${config.sitioSharePoint}/_api/web/lists/getbytitle('${encodeURIComponent(config.lista)}')/items(${item.Id})`;
        const respuesta = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json;odata=nometadata",
                "Content-Type": "application/json;odata=nometadata",
                "X-RequestDigest": digest,
                "IF-MATCH": "*",
                "X-HTTP-Method": "MERGE"
            },
            credentials: "include",
            body: JSON.stringify({ [config.campoJson]: JSON.stringify(paquete) })
        });
        if (!respuesta.ok) throw new Error(`No fue posible actualizar SharePoint (${respuesta.status}).`);
    }

    async function cargar() {
        if (!esSharePointMismoOrigen()) {
            const local = localStorage.getItem(CLAVE_LOCAL);
            return local ? JSON.parse(local) : null;
        }
        const item = await buscarItem(config.tituloBorrador);
        return item?.[config.campoJson] ? JSON.parse(item[config.campoJson]) : null;
    }

    async function guardar(paquete) {
        if (!esSharePointMismoOrigen()) {
            localStorage.setItem(CLAVE_LOCAL, JSON.stringify(paquete));
            return { modo: "local" };
        }
        await guardarItem(config.tituloBorrador, paquete);
        return { modo: "sharepoint" };
    }

    async function publicar(paquete) {
        if (!esSharePointMismoOrigen()) {
            localStorage.setItem(CLAVE_PUBLICADO, JSON.stringify(paquete));
            return { modo: "local" };
        }
        await guardarItem(config.tituloPublicado, paquete);
        return { modo: "sharepoint" };
    }

    return { cargar, guardar, publicar, esSharePointMismoOrigen };
})();
