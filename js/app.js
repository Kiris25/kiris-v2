function exportarCSV(tipo) {
  const columnas =
    tipo === "manuales"
      ? COLUMNAS_MANUALES
      : tipo === "tramites"
        ? COLUMNAS_TRAMITES
        : COLUMNAS_VERSIONES;
  const utiles = columnas.filter((c) => !c.especial && !c.calculado);
  const filas = [
    utiles.map((c) => c.label),
    ...estado[tipo].map((item) => utiles.map((c) => item[c.key] ?? "")),
  ];
  descargar(
    `${tipo}.csv`,
    filas  
      .map((fila) =>  
        fila.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","),  
      )  
      .join("\n"),  
    "text/csv;charset=utf-8",  
  );  
}

function exportarManualesExcel() {
  try {
    if (typeof XLSX === "undefined") {
      throw new Error("No se cargó la librería de Excel");
    }

    const columnas = COLUMNAS_MANUALES.filter(
      (columna) => !columna.especial && !columna.calculado,
    );

    const datos = (estado.manuales || []).map((manual) => {
      const fila = {};
      columnas.forEach((columna) => {
        fila[columna.label] = valorVisible(manual, columna);
      });
      return fila;
    });

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Avance_Manuales");
    XLSX.writeFile(libro, `Avance_Manuales_${fechaISOHoy()}.xlsx`);
    mostrarToast("Avance de manuales exportado a Excel");
  } catch (error) {
    console.error("No fue posible exportar Avance de Manuales.", error);
    mostrarToast(`No fue posible exportar Excel: ${error.message}`);
  }
}

function exportarTramitesExcel() { 

    const columnas = COLUMNAS_TRAMITES 
        .filter((c) => !c.especial); 

    const datos = estado.tramites.map(tramite => { 

        const fila = {}; 

        columnas.forEach(columna => { 

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
        "Tramites" 
    ); 

    XLSX.writeFile( 
        libro, 
        "Tramites_Requerimientos.xlsx" 
    ); 

} 
