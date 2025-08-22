// ----- Definir variables -----

const filas = 4;  // Variable constante que define filas del tablero a 4
const columnas = 4;  // Variable constante que define columnas del tablero a 4
let tablero; 
const opcionesFicha = [2,4,8];  // Vaiable para tener las opciones de fichas a generar, 2, 4 o 8 
let contarMovimientos = 0;  // Variable para llevar una cuenta de los movimientos realizados por el jugador
let dropCounter = 0 
let ultimoTiempo = 0 // Variable para ir llevando una cuenta del tiempo


// Definir fichas activas

let fichaActiva = { 
    valor: 2, 
    fila: 0, 
    columna: Math.floor(Math.random() * columnas) 
}

// --------- Funciones -----------


// Funcion para actualizar la vista del html según de todo lo que se pasa en el juego
function actualizarVista() {
    const celdas = document.querySelectorAll('.cell');
    
    // Resetea todos los bordes y muestra el tablero base
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const index = i * columnas + j;
            const valor = tablero[i][j];
            const celda = celdas[index];
            
            celda.textContent = valor === 0 ? '' : valor;
            celda.className = 'cell';
            celda.style.border = ''; // Quita el borde de todas las celdas
            
            if (valor > 0) {
                celda.classList.add(`tile-${valor}`);
            }
        }
    }
    
    // Dibuja o crea la ficha activa con borde naranja
    if (fichaActiva && fichaActiva.fila >= 0 && fichaActiva.fila < filas && 
        fichaActiva.columna >= 0 && fichaActiva.columna < columnas) {
        
        const index = fichaActiva.fila * columnas + fichaActiva.columna;
        const celdaActiva = celdas[index];
        
        celdaActiva.textContent = fichaActiva.valor;
        celdaActiva.classList.add(`tile-${fichaActiva.valor}`);
        celdaActiva.style.border = '2px solid orange'; // Solo esta celda tiene borde
    }
}


// Funcion para crear el tablero 4x4 inicial del jeugo
function crearTablero(filas, columnas) {
    let nuevoTablero = []; 
    for (let i = 0; i < filas; i++) {
        nuevoTablero[i] = [];
        for (let j = 0; j < columnas; j++) {
            nuevoTablero[i][j] = 0;
        }
    }
    return nuevoTablero;
}

// ----- Inicializa el tablero -----
tablero = crearTablero(filas, columnas);

// ----- Llama a la función actualizarVista después de que se haya creado el tablero -----
actualizarVista();



// Funcion para actualizar el contador de movimientos realizados por el jugador
function actualizarContarMovimientos() {
    document.getElementById('stat-mov').textContent = contarMovimientos;
    document.getElementById('resume-mov').textContent = contarMovimientos;
}


// Codigo necesario para poder mover una ficha a la izquierda, derecha o hacia abajo

document.addEventListener('keydown', event => {
    if (event.key == 'ArrowLeft') {  // Permite mover la ficha hacia la izquierda
        fichaActiva.columna-- 
        if (verColision()) {
            fichaActiva.columna++
        } else {
            contarMovimientos++;
        }
    }
    if (event.key == 'ArrowRight') {  // Permite mover la ficha hacia la derecha
        fichaActiva.columna++
        if (verColision()) {
            fichaActiva.columna--
        } else {
            contarMovimientos++;
        }
    } 
    if (event.key == 'ArrowDown') {  // Permite mover la ficha hacia abajo
        fichaActiva.fila++
        if (verColision()) {
            fichaActiva.fila--
            solidificarFicha()
        } else {
            contarMovimientos++;
        }

    } 

    actualizarContarMovimientos();  // Llamamos a esta función para llevar un conteo de los movimientos realizados
    actualizarVista();  // Llamamos a esta función para que en tiempo real se vea como se va moviendo la ficha

})



// Funcion para ver colisiones de la ficha
function verColision () {

     // Verifica límites  a la izquierda/derecha
    if (fichaActiva.columna < 0 || fichaActiva.columna >= columnas) {
        return true; // Colisión con pared
    }

     // Verificar límites abajo
    if (fichaActiva.fila >= filas) {
        return true; // Colisión con fondo inferior
    }

    // Verificar colisión con otras fichas (solo si no es 0)
    if (tablero[fichaActiva.fila] && tablero[fichaActiva.fila][fichaActiva.columna] !== 0) {
        return true; // Colisión con otra ficha
    }
    
    return false; // No hay colisión

}



// Funcion para solidificar ficha
function solidificarFicha()  {
    
     tablero[fichaActiva.fila][fichaActiva.columna] = fichaActiva.valor;

    // Verificamos qué columnas tienen espacio disponible
    const columnasDisponibles = [];  // Creamos esta variable para llevar un conteo de las columnasDisponibles
    for (let j = 0; j < columnas; j++) {
        if (tablero[0][j] == 0) {  // Verifica si la celda superior esta vacía, para poder agregar una ficha nueva ahí 
            columnasDisponibles.push(j);
        }
    } 
     
    // En caso de que ya no hayan columnas disponibles se pierde la partida
    if (columnasDisponibles.length == 0) {
        window-alert("Fin del juego, has perdido");  // Mostramos esta alerta, para indicar que se perdio la partida

        for (let i = 0; i < filas; i++ ) {
            for (let j = 0; j < columnas; j++) {
                tablero[i][j] = 0;
            }
        }
        // Reiniciamos el contador de movimientos
        contarMovimientos = 0;
        actualizarContarMovimientos();

        // Se crea una nueva ficha inicial
        fichaActiva = {
            valor: 2,
            fila: 0,
            columna: Math.floor(Math.random() * columnas)  // Indica que se va a generar en cualquiera de las 4 columnas
        };

        actualizarVista();  // Llamamos a esta funcion para que se vea todo lo que sigue ocurriendo en el juego
        return;
    } 

    // En caso de que haya alguna columna disponible, se va a elegir una de forma aleatoria entre las disponibles
    const numeroAleatorio = Math.floor(Math.random() * opcionesFicha.length);  // Variable para elegir entre el numero 2,4,8 de la ficha
    const columnaAleatoria = columnasDisponibles[Math.floor(Math.random() * columnasDisponibles.length)];

    // Reinicia la ficha activa para generar una nueva
     fichaActiva = {
        valor: opcionesFicha[numeroAleatorio],
        fila: 0,
        columna: columnaAleatoria
    };

}


// Funcion para que la ficha vaya cayendo de forma automatica
function fichaCae (time = 0) {
    const tiempo = time - ultimoTiempo
    ultimoTiempo = time
    dropCounter = dropCounter + tiempo

    if (dropCounter > 1000) {  // Esto es cuando pasa un segundo
        fichaActiva.fila++  // Se aumenta el cmapo de fila, para que la ficha vaya cayendo

        if (verColision()) {  // Verificamos si hay colision mientras la ficha de forma automatica
            fichaActiva.fila--;  // En caso de que haya colision le restamos para que regrese a la posicion que estaba
            solidificarFicha(); // Solidificar
        }

        dropCounter = 0  // Se reinica el contador de esta variable
    }

    actualizarVista();
    window.requestAnimationFrame(fichaCae)

}


fichaCae()  // Se llama a esta funcion para que la fichaActiva siempre vaya cayendo de forma automatica