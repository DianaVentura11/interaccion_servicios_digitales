
const archivo = document.getElementById("archivo");
const cargar = document.getElementById("cargar");
const tabla = document.getElementById("tabla");
const buscar = document.getElementById("buscar");
const mensaje = document.getElementById("mensaje");
const cantidad = document.getElementById("cantidad");
const resultados = document.getElementById("resultados");
const descargar = document.getElementById("descargar");
const columna = document.getElementById("columna");
const botonCalcular = document.getElementById("calcular");

let encabezados = [];
let datos = [];
let estadisticas = [];

// Cargar archivo CSV
cargar.addEventListener("click", function () {
    if (!archivo.files[0]) {
        mensaje.textContent = "Selecciona un archivo.";
        return;
    }
    mensaje.textContent = "Leyendo archivo, espera un momento...";
    const lector = new FileReader();
    lector.onload = function (evento) {
        try {
            const contenido = evento.target.result.replace(/^\uFEFF/, "");
            const primera = contenido.split(/\r?\n/)
                .find(linea => linea.trim() !== "");

            if (!primera) {
                throw new Error("El archivo está vacío.");
            }
            const separador = detectarSeparador(primera);
            const filas = comillasCSV(contenido, separador);
            encabezados = filas.shift().map(valor => valor.trim());
            datos = filas.filter(fila =>
                fila.some(valor => valor.trim() !== "")
            );
            datos = datos.filter(fila => {
                if (fila.length > encabezados.length) return false;

                while (fila.length < encabezados.length) {
                    fila.push("");
                }
                return true;
            });
            if (datos.length === 0) {
                throw new Error("No se encontraron registros válidos.");
            }
            // Llenar el selector con las columnas del archivo
            columna.replaceChildren();
            const opcionInicial = document.createElement("option");
            opcionInicial.value = "";
            opcionInicial.textContent = "Selecciona una columna";
            columna.appendChild(opcionInicial);
            encabezados.forEach(function (nombre, indice) {
                const opcion = document.createElement("option");
                opcion.value = indice;
                opcion.textContent = nombre;
                columna.appendChild(opcion);
            });
            columna.disabled = false;
            botonCalcular.disabled = false;
            buscar.disabled = false;
            descargar.disabled = true;
            estadisticas = [];
            resultados.textContent =
                "Selecciona una columna y pulsa Calcular.";
            mostrarTabla(datos);
            mensaje.textContent =
                "Archivo leído correctamente: " +
                datos.length.toLocaleString("es-MX") +
                " registros.";
        } catch (error) {
            mensaje.textContent = "Error: " + error.message;
        }
    };

    lector.onerror = function () {
        mensaje.textContent = "No se pudo abrir el archivo.";
    };

    // Leer el archivo con codificación compatible con CSV de Windows
    lector.readAsText(archivo.files[0], "windows-1252");
});

// Detectar el separador del CSV
function detectarSeparador(linea) {
    const opciones = [",", ";", "\t", "|"];
    let mejor = ",";
    let mayor = -1;
    opciones.forEach(function (separador) {
        const total = contar(linea, separador);

        if (total > mayor) {
            mayor = total;
            mejor = separador;
        }
    });
    return mejor;
}

function contar(linea, separador) {
    let total = 0;
    let comillas = false;

    for (let i = 0; i < linea.length; i++) {
        if (linea[i] === '"') {
            if (comillas && linea[i + 1] === '"') {
                i++;
            } else {
                comillas = !comillas;
            }
        } else if (linea[i] === separador && !comillas) {
            total++;
        }
    }
    return total;
}

// Leer filas respetando las comillas
function comillasCSV(texto, separador) {
    const filas = [];
    let fila = [];
    let valor = "";
    let comillas = false;
    for (let i = 0; i < texto.length; i++) {
        const caracter = texto[i];
        if (caracter === '"') {
            if (comillas && texto[i + 1] === '"') {
                valor += '"';
                i++;
            } else {
                comillas = !comillas;
            }
        } else if (caracter === separador && !comillas) {
            fila.push(valor);
            valor = "";
        } else if (
            (caracter === "\n" || caracter === "\r") &&
            !comillas
        ) {
            if (caracter === "\r" && texto[i + 1] === "\n") {
                i++;
            }

            fila.push(valor);
            filas.push(fila);

            fila = [];
            valor = "";
        } else {
            valor += caracter;
        }
    }
    if (valor !== "" || fila.length > 0) {
        fila.push(valor);
        filas.push(fila);
    }
    return filas;
}

// Calcular solamente la columna elegida
botonCalcular.addEventListener("click", function () {
    if (columna.value === "") {
        alert("Selecciona la columna que quieres calcular.");
        return;
    }
    const indice = Number(columna.value);
    const nombre = encabezados[indice];
    const valoresTexto = datos
        .map(fila => fila[indice].trim())
        .filter(valor => valor !== "");
    if (valoresTexto.length === 0) {
        resultados.textContent = "La columna seleccionada no tiene datos.";
        descargar.disabled = true;
        return;
    }
    const valores = valoresTexto.map(valor => Number(valor));
    if (valores.some(valor => !Number.isFinite(valor))) {
        resultados.textContent =
            'La columna "' + nombre +
            '" contiene datos que no son numéricos. Selecciona otra columna.';

        estadisticas = [];
        descargar.disabled = true;
        return;
    }
    let suma = 0;
    let mayor = valores[0];
    let menor = valores[0];
    valores.forEach(function (numero) {
        suma += numero;
        if (numero > mayor) mayor = numero;
        if (numero < menor) menor = numero;
    });
    estadisticas = [{
        nombre: nombre,
        promedio: suma / valores.length,
        mayor: mayor,
        menor: menor,
        cantidad: valores.length
    }];
    mostrarResultados();
    descargar.disabled = false;
});

// Mostrar solo 30 filas en la tabla
function mostrarTabla(registros) {
    const thead = tabla.querySelector("thead");
    const tbody = tabla.querySelector("tbody");
    thead.replaceChildren();
    tbody.replaceChildren();
    const titulo = document.createElement("tr");
    encabezados.forEach(function (nombre) {
        const th = document.createElement("th");
        th.textContent = nombre;
        titulo.appendChild(th);
    });
    thead.appendChild(titulo);
    registros.slice(0, 30).forEach(function (fila) {
        const tr = document.createElement("tr");
        fila.forEach(function (valor) {
            const td = document.createElement("td");
            td.textContent = valor;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    cantidad.textContent =
        "Mostrando " + Math.min(registros.length, 30) +
        " de " + registros.length.toLocaleString("es-MX") +
        " registros encontrados.";
}

// Buscar en todos los registros
buscar.addEventListener("input", function () {
    const texto = buscar.value.toLowerCase().trim();
    const filtrados = datos.filter(fila =>
        fila.some(valor => valor.toLowerCase().includes(texto))
    );
    mostrarTabla(filtrados);
});

// Mostrar el resultado seleccionado
function mostrarResultados() {
    resultados.replaceChildren();
    estadisticas.forEach(function (dato) {
        const titulo = document.createElement("h4");
        titulo.textContent = "Columna analizada: " + dato.nombre;
        const promedio = document.createElement("p");
        promedio.textContent =
            "Promedio: " + dato.promedio.toFixed(4);
        const mayor = document.createElement("p");
        mayor.textContent = "Valor mayor: " + dato.mayor;
        const menor = document.createElement("p");
        menor.textContent = "Valor menor: " + dato.menor;
        const total = document.createElement("p");
        total.textContent =
            "Datos analizados: " + dato.cantidad.toLocaleString("es-MX");
        resultados.append(titulo, promedio, mayor, menor, total);
    });
}

// Descargar únicamente el cálculo seleccionado
descargar.addEventListener("click", function () {
    if (estadisticas.length === 0) {
        alert("Primero calcula una columna.");
        return;
    }
    const dato = estadisticas[0];
    let texto = "RESULTADOS ESTADÍSTICOS\n\n";
    texto += "Columna analizada: " + dato.nombre + "\n";
    texto += "Total de registros analizados: " + dato.cantidad + "\n";
    texto += "Promedio: " + dato.promedio.toFixed(4) + "\n";
    texto += "Valor mayor: " + dato.mayor + "\n";
    texto += "Valor menor: " + dato.menor + "\n";
    const blob = new Blob(["\uFEFF" + texto], {
        type: "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "resultados.txt";
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
