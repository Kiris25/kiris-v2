"use strict";

window.KIRIS_STORAGE_CONFIG = window.KIRIS_STORAGE_CONFIG || {
    propietario: "kiris25",
    repositorio: "kiris-v2",
    rama: "main",
    archivoPublicado: "data.json",
    claveLocal: "kirisV2_estado_maestro"
};

window.KirisStorage = (() => {
    const config = window.KIRIS_STORAGE_CONFIG;

    function codificarBase64Unicode(texto) {
        const bytes = new TextEncoder().encode(texto);
        let binario = "";
        const bloque = 32768;
        for (let i = 0; i < bytes.length; i += bloque) {
            binario += String.fromCharCode(...bytes.subarray(i, i + bloque));
        }
        return btoa(binario);
    }

    async function cargar() {
        const guardado = localStorage.getItem(config.claveLocal);
        return guardado ? JSON.parse(guardado) : null;
    }

    async function guardar(paquete) {
        localStorage.setItem(config.claveLocal, JSON.stringify(paquete));
        return { modo: "local" };
    }

    async function cargarPublicado() {
        const respuesta = await fetch(`./${config.archivoPublicado}?v=${Date.now()}`, {
            cache: "no-store"
        });

        if (!respuesta.ok) {
            throw new Error(`No fue posible leer ${config.archivoPublicado} (${respuesta.status}).`);
        }

        const publicado = await respuesta.json();
        if (!publicado || typeof publicado !== "object") {
            throw new Error(`${config.archivoPublicado} no contiene un objeto JSON válido.`);
        }

        return publicado.datos || publicado.data || publicado;
    }

    async function obtenerArchivoGitHub(token) {
        const url = `https://api.github.com/repos/${config.propietario}/${config.repositorio}/contents/${config.archivoPublicado}?ref=${encodeURIComponent(config.rama)}`;
        const respuesta = await fetch(url, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${token}`,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });

        if (respuesta.status === 404) return null;
        if (!respuesta.ok) {
            const detalle = await respuesta.text();
            throw new Error(`GitHub rechazó la lectura (${respuesta.status}). ${detalle}`);
        }

        return respuesta.json();
    }

    async function publicar(paquete) {
        const token = window.prompt(
            "Pegue el token de GitHub para publicar. El token se usará una sola vez y no se guardará."
        );

        if (!token || !token.trim()) {
            throw new Error("Publicación cancelada: no se proporcionó el token.");
        }

        const tokenTemporal = token.trim();
        const archivoActual = await obtenerArchivoGitHub(tokenTemporal);
        const contenido = JSON.stringify(paquete, null, 2);
        const url = `https://api.github.com/repos/${config.propietario}/${config.repositorio}/contents/${config.archivoPublicado}`;
        const cuerpo = {
            message: `Publicar datos KIRIS ${new Date().toISOString()}`,
            content: codificarBase64Unicode(contenido),
            branch: config.rama
        };

        if (archivoActual?.sha) cuerpo.sha = archivoActual.sha;

        const respuesta = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${tokenTemporal}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28"
            },
            body: JSON.stringify(cuerpo)
        });

        if (!respuesta.ok) {
            const detalle = await respuesta.text();
            throw new Error(`GitHub rechazó la publicación (${respuesta.status}). ${detalle}`);
        }

        return respuesta.json();
    }

    return { cargar, guardar, cargarPublicado, publicar };
})();
