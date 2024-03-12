

function datosGraficar(tiempo_inicio, procesos_ordenados, tiempos_finalizacion) {
    let mandarDatos = document.createElement('div');
    
    let boton_grafica = document.createElement('button');
    boton_grafica.setAttribute('class', 'formulario__btn-guardar');
    boton_grafica.setAttribute('type', 'button');
    boton_grafica.textContent = 'Generar Gráfico';
    mandarDatos.appendChild(boton_grafica);
    
    document.body.appendChild(mandarDatos);

    boton_grafica.addEventListener('click', function() {
        // Construir la URL con los datos como parámetros de consulta
        let datosUrl = 'graficaSJF.html?tiempo_inicio=' + encodeURIComponent(JSON.stringify(tiempo_inicio)) +
                        '&procesos_ordenados=' + encodeURIComponent(JSON.stringify(procesos_ordenados)) +
                        '&tiempos_finalizacion=' + encodeURIComponent(JSON.stringify(tiempos_finalizacion));
        
        // Redirigir a la página destino con los datos en la URL
        window.location.href = datosUrl;
    });
}


function crearTable(tl, tr, wt, ts, n) {
    
    
    // Crear el contenedor para la tabla
    let contenedorTabla = document.createElement('div');
    contenedorTabla.id = 'container';

    // Crear la tabla y el cuerpo de la tabla
    let tabla = document.createElement('table');
    let tbody = document.createElement('tbody');

    // Agregar encabezados a la tabla
    let encabezados = ['Número del proceso (P.No)', 'Tiempo de ráfaga', 'Tiempo de llegada', 'Tiempo de espera', 'Tiempo de sistema'];
    let encabezadoRow = document.createElement('tr');
    encabezados.forEach(encabezado => {
        let th = document.createElement('th');
        th.textContent = encabezado;
        encabezadoRow.appendChild(th);
    });
    tbody.appendChild(encabezadoRow);

    // Crear las filas de la tabla
    for (let i = 0; i < n; i++) {
        // Crear una nueva fil≠a
        let row = document.createElement('tr');

        // Crear y agregar las celdas a la fila
        let numProcesoCell = document.createElement('td');
        numProcesoCell.textContent = i + 1;
        row.appendChild(numProcesoCell);

        let tiempoRafagaCell = document.createElement('td');
        tiempoRafagaCell.textContent = tr[i];
        row.appendChild(tiempoRafagaCell);

        let tiempoLlegadaCell = document.createElement('td');
        tiempoLlegadaCell.textContent = tl[i];
        row.appendChild(tiempoLlegadaCell);

        let tiempoEsperaCell = document.createElement('td');
        tiempoEsperaCell.textContent = wt[i];
        row.appendChild(tiempoEsperaCell);

        let tiempoSistemaCell = document.createElement('td');
        tiempoSistemaCell.textContent = ts[i];
        row.appendChild(tiempoSistemaCell);


        // Agregar la fila al tbody
        tbody.appendChild(row);
    }

    // Adjuntar el cuerpo a la tabla
    tabla.appendChild(tbody);

    
    // Agregar la tabla al contenedor
    contenedorTabla.appendChild(tabla);

    // Agregar el contenedor a la página
    document.body.appendChild(contenedorTabla);

    
}

function round_robin(tl, tr, q) {
    const n = tl.length;
    const wt = new Array(n).fill(0); // Tiempo de espera
    const ts = new Array(n).fill(0); // Tiempo de sistema

    const tiempo_inicio = [];
    const tiempos_finalizacion = [];
    const procesos_ordenados = [];  // Lista para almacenar los procesos ordenados
    let j = 0;

    let proccess = new Array(n).fill(1);
    let t_eje = 0;
    let remaining_tr = [...tr];  // Tiempo restante de ráfaga
    let actual_tl = [...tl];  // Tiempo de llegada actual
    let remaining_n = n;  // Procesos restantes

    while (remaining_tr.some(time => time > 0)) {
        if (remaining_n === 0) {
            proccess = new Array(n).fill(1);
            remaining_n = n;
        }
        let min_arrival = Infinity;
        let min_index = -1;
        for (let i = 0; i < n; i++) {
            if (remaining_tr[i] > 0 && actual_tl[i] <= t_eje && tl[i] < min_arrival && proccess[i] != 0) {
                min_arrival = tl[i];
                min_index = i;
            }
        }

        if (min_index === -1) {
            t_eje += 1;
        } else {
            console.log(`Tiempo de llegada ${t_eje}: del procesos P${min_index + 1}`);
            tiempo_inicio.push(t_eje);  // Agregar el tiempo de inicio a la lista
            procesos_ordenados.push(min_index + 1);  // Agregar el proceso ordenado
            
            const execute_time = Math.min(q, remaining_tr[min_index]);
            wt[min_index] += t_eje - actual_tl[min_index];
            t_eje += execute_time;
            remaining_tr[min_index] -= execute_time;
            ts[min_index] += t_eje - actual_tl[min_index];

            tiempos_finalizacion.push(t_eje);  // Agregar el tiempo de finalización a la lista

            actual_tl[min_index] = t_eje;
            remaining_n -= 1;
            proccess[min_index] = 0;
        }
    }

    console.log("P.No\t\tTiempo de ráfaga\t\tTiempo de llegada\t\tTiempo de espera\t\tTiempo de sistema");
    for (let i = 0; i < n; i++) {
        console.log(`${i + 1}\t\t\t${tr[i]}\t\t\t\t${tl[i]}\t\t\t\t${wt[i]}\t\t\t\t${ts[i]}`);
    }

    const promedio_tw = wt.reduce((acc, val) => acc + val, 0) / n;
    const promedio_ts = ts.reduce((acc, val) => acc + val, 0) / n;
    console.log(`El promedio del tiempo de espera es: ${promedio_tw.toFixed(2)}`);
    console.log(`El promedio del tiempo de sistema  es: ${promedio_ts.toFixed(2)}`);
    console.log(`Tiempos de inicio: ${tiempo_inicio}\nProcesos ordenados: ${procesos_ordenados}\nTiempos de finalización: ${tiempos_finalizacion}`);
    
    
    crearTable(tl, tr, wt, ts, n);

    datosGraficar(tiempo_inicio,procesos_ordenados,tiempos_finalizacion);


}




function main(numeroProcesos) {
    // Obtener el formulario
    let formulario = document.getElementById('formulario');

    // Limpiar los campos anteriores si los hay
    formulario.innerHTML = '';

    // Generar campos para cada proceso
    for (let i = 0; i < numeroProcesos; i++) {
        let divGrupo = document.createElement('div');
        divGrupo.classList.add('formulario__grupo');

        let label = document.createElement('label');
        label.setAttribute('for', 'proceso' + i);
        label.classList.add('formulario__label');
        label.textContent = 'P' + (i + 1);

        let inputArrival = document.createElement('input');
        inputArrival.setAttribute('type', 'number');
        inputArrival.setAttribute('min', '0');
        inputArrival.setAttribute('name', 'at' + i);
        inputArrival.setAttribute('placeholder', 'Tiempo de llegada de P' + (i + 1));
        inputArrival.classList.add('formulario__input');

        let inputBurst = document.createElement('input');
        inputBurst.setAttribute('type', 'number');
        inputBurst.setAttribute('min', '1');
        inputBurst.setAttribute('name', 'bt' + i);
        inputBurst.setAttribute('placeholder', 'Tiempo de ráfaga de P' + (i + 1));
        inputBurst.classList.add('formulario__input');


        
        
        divGrupo.appendChild(label);
        divGrupo.appendChild(inputArrival);
        divGrupo.appendChild(inputBurst);

        formulario.appendChild(divGrupo);

        if (i == numeroProcesos -1){
            let boton_guardar = document.createElement('button');
            boton_guardar.setAttribute('class', 'formulario__btn-guardar');
            boton_guardar.setAttribute('type', 'button');
            boton_guardar.setAttribute('onclick', 'guardarTiempos()');
            boton_guardar.textContent = 'Guardar';
            divGrupo.appendChild(boton_guardar);

        }
    }
    console.log('Formulario generado correctamente');
    // Mostrar el botón "Guardar Tiempos"
}





function guardarTiempos() {
    let tiempoLlegada = [];
    let tiempoRafaga = [];
    let p = [];
    let errores = false; // Bandera para indicar si se encontró algún error

    // Obtener todos los campos de tiempo de llegada y tiempo de ráfaga
    let inputsTiempoLlegada = document.querySelectorAll('input[name^="at"]');
    let inputsTiempoRafaga = document.querySelectorAll('input[name^="bt"]');
    let inputsPrioridad = document.querySelectorAll('input[name^="pr"]')

    // Recorrer los campos y validar los valores
    inputsTiempoLlegada.forEach(input => {
        let valor = parseInt(input.value);
        if (isNaN(valor) || valor < 0) {
            alert('Por favor, ingrese un número válido y positivo para el tiempo de llegada.');
            input.value = ''; // Limpiar el campo de entrada
            errores = true; // Establecer la bandera de errores en true
            return; // Salir del bucle forEach
        }
        tiempoLlegada.push(valor);
    });

    inputsTiempoRafaga.forEach(input => {


        let valor = parseInt(input.value);
        if (isNaN(valor) || valor <= 0) {
            alert('Por favor, ingrese un número válido y positivo para el tiempo de ráfaga.');
            input.value = ''; // Limpiar el campo de entrada
            errores = true; // Establecer la bandera de errores en true
            return; // Salir del bucle forEach
        }
        tiempoRafaga.push(valor);
    });



    // Si no se encontraron errores, llamar a la función sjf()
    if (!errores) {
        round_robin(tiempoLlegada, tiempoRafaga, quantum);
    }
}


function enviarNumeroProcesos() {
    let inputNumeroProcesos = document.getElementById('N.procesos');
    let inputQuantum = document.getElementById('N.quantum');
    let numeroProcesos = parseInt(inputNumeroProcesos.value);
    let quantumI = parseInt(inputQuantum.value);

    // Verificar si el valor ingresado es un número positivo
    if (isNaN(numeroProcesos) || numeroProcesos <= 0) {
        alert('Por favor, ingrese un número válido de procesos.');
        inputNumeroProcesos.value = ''; // Limpiar el campo de entrada
        return;
    }

    main(numeroProcesos);

    window.quantum = quantumI;

}


document.getElementById("N.procesos").addEventListener("keypress", function(event) {
    if (event.keyCode === 13) { // 13 es el código de la tecla Enter
      event.preventDefault(); // Prevenir el comportamiento predeterminado de la tecla Enter
      document.getElementById("boton_enviar").click(); // Simular clic en el botón
    }
  });


/*
function main() {
    // Ejemplo de uso
    let tl = [1, 0, 4, 3, 2, 5];
    let tr = [2, 3, 5, 6, 1, 2];
    let q = 3;
    roundRobin(tl, tr, q);
}

main();

*/
