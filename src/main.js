// ----- Definir variables -----

const filas = 4;  // Variable constante que define filas del tablero a 4
const columnas = 4;  // Variable constante que define columnas del tablero a 4
let tablero; 
const opcionesFicha = [2,4,8];  // Vaiable para tener las opciones de fichas a generar, 2, 4 o 8 
let contarMovimientos = 0;  // Variable para llevar una cuenta de los movimientos realizados por el jugador
let dropCounter = 0 
let ultimoTiempo = 0 // Variable para ir llevando una cuenta del tiempo
let ultimaFusion = null; // { fila, columna } o null
let segundos = 0 // variable para los segundos del tiempo
let minutos = 0  // Variable para llevar una cuenta de los minutos del tiempo
let horas = 0  // Variables para llevar una cuenta de las horas del tiempo
let tiempoConFormato = (horas < 10 ? '0' + horas : horas) + ':' + (minutos < 10 ? '0' + minutos : minutos) + ':' + (segundos < 10 ? '0' + segundos : segundos);  // Formato que va a tener el tiempo mostrado
let perder = false // Variable para saber si se perdió el juego o no

// Definir fichas activas

let fichaActiva = { 
    valor: 2, 
    fila: 0, 
    columna: Math.floor(Math.random() * columnas) 
}

// --------- Funciones -----------

// Funcion para actualizar la vista del html dependiendo de todo lo que pasa en el juego
function actualizarVista() {
  const celdas = document.querySelectorAll('.cell');

  // Pinta tablero "pegado"
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      const index = i * columnas + j;
      const valor = tablero[i][j];
      const celda = celdas[index];

      celda.textContent = valor === 0 ? '' : valor;
      celda.className = 'cell';
      celda.style.border = '';

      if (valor > 0) {
        celda.classList.add(`tile-${valor}`);
      }

      // Si esta celda fue la última fusión, aplica bump 1 frame
      if (ultimaFusion && ultimaFusion.fila === i && ultimaFusion.columna === j) {
        celda.classList.add('bump');
      }
    }
  }

  // Dibuja la ficha activa con borde naranja
  if (fichaActiva && fichaActiva.fila >= 0 && fichaActiva.fila < filas &&
      fichaActiva.columna >= 0 && fichaActiva.columna < columnas) {
    const index = fichaActiva.fila * columnas + fichaActiva.columna;
    const celdaActiva = celdas[index];
    celdaActiva.textContent = fichaActiva.valor;
    celdaActiva.classList.add(`tile-${fichaActiva.valor}`);
    celdaActiva.style.border = '2px solid orange';
  }

  // Limpia el marcador para no animar en cada frame
  ultimaFusion = null;
  // Actualiza la suma total
  actualizarSumaTotal();
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

// Funcion para actualizar el tiempo de forma progresiva
function actualizarTiempo() {

  if (perder == false) {
    segundos++; // Aumenta el valor de los segundos progresivamente

    if (segundos == 60) {  // Condicional para ver si los segundos ya llegaran a 60 y así sumar 1 a minutos
      segundos = 0;
      minutos += 1;
    }
    if (minutos == 60) {  // Condicional para ver si los minutos ya llegaron a 60 y poder sumarle 1 a la variable de horas
      minutos = 0;
      horas += 1; 
      tiempoConFormato = horas + ":" + minutos + ":" + segundos;
    }

    // Condicionales para ir cambiando la forma en que se ve la variable de tiempoConFormato
    if (minutos == 0 && horas == 0 ) {
      tiempoConFormato = (segundos < 10 ? '0' + segundos : segundos);
    }
    if (minutos >= 1 ) {
      tiempoConFormato = (minutos < 10 ? '0' + minutos : minutos) + ':' + (segundos < 10 ? '0' + segundos : segundos);
    }
    if (horas >= 1 ) {
      tiempoConFormato = (horas < 10 ? '0' + horas : horas) + ':' + (minutos < 10 ? '0' + minutos : minutos) + ':' + (segundos < 10 ? '0' + segundos : segundos);
    }

    // Cambios en el html referentes al tiempo 
    document.getElementById('stat-tiempo').textContent = tiempoConFormato;
    document.getElementById('resume-tiempo').textContent = tiempoConFormato;
    setTimeout("actualizarTiempo()",1000);  // Forma recursiva para llamar nuevamente a esta función luego de 1000 minisegundos

  }
}

// Funcion para crear una nueva ficha en la fila superior (o reiniciar el juego si no hay espacios disponibles)
function crearFichaNueva() { 
  // Determina columnas disponibles en la fila 0
  const columnasDisponibles = [];
  for (let j = 0; j < columnas; j++) {
    if (tablero[0][j] === 0) columnasDisponibles.push(j);
  }

  // Si no hay espacio, fin del juego
  if (columnasDisponibles.length === 0) {
    perder = true
    alert("Fin del juego, has perdido");
    // limpiar tablero
    for (let i = 0; i < filas; i++) {
      for (let j = 0; j < columnas; j++) tablero[i][j] = 0;
    }
    
    contarMovimientos = 0;
    actualizarContarMovimientos();

    // Se restablecen los valores iniciales de las variables asociadas a tiempo y se llama a la función
    segundos = 0;
    minutos = 0;
    horas = 0;
    actualizarTiempo();
    perder = false

    // ficha inicial
    fichaActiva = {
      valor: 2,
      fila: 0,
      columna: Math.floor(Math.random() * columnas)
    };
    actualizarVista();
    return;
  }

  // Se elige el valor y columna al azar
  const valor = opcionesFicha[Math.floor(Math.random() * opcionesFicha.length)];
  const columnaAleatoria = columnasDisponibles[Math.floor(Math.random() * columnasDisponibles.length)];

  fichaActiva = { valor, fila: 0, columna: columnaAleatoria };
}



// Codigo necesario para poder mover una ficha a la izquierda, derecha o hacia abajo

document.addEventListener('keydown', e => {
  if (e.repeat) return;
  if (e.key === 'ArrowLeft')  moverHorizontal(-1);
  if (e.key === 'ArrowRight') moverHorizontal(1);
  if (e.key === 'ArrowDown')  bajarUnPaso();
  actualizarContarMovimientos();
  actualizarVista();
});




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


// Funcion para aplicarle gravedad a fichas que quedan en el aire, luego de que se fusionen otras fichas
function aplicarGravedadFichas() {
  let algoCae = true;

  // While que se da si el valor de que algoCae es igual a true
  while (algoCae) {
    algoCae = false;

    for (let i = filas - 2; i >= 0; i--) {
      for (let j = 0; j < columnas; j++) {
        if (fichaActiva && i == fichaActiva.fila && j == fichaActiva.columna) { // Se evita esto si es la ficha activa o si hay espacio vacio
          continue;
        }
        if (tablero[i][j] === 0) {
          continue;
        }
        if (tablero [i + 1][j] === 0) {  // Condicional para ver si la celda de abajo esta vacia
          if (!(fichaActiva && fichaActiva.fila === i + 1 && fichaActiva.columna === j)) {  // Condicional para ver si la ficha activa no está en la posición de abajo
            // Se mueve la ficha hacia abajo
            tablero[i + 1][j] = tablero[i][j];
            tablero[i][j] = 0;
            algoCae = true;
          }
        }
        else if (tablero[i + 1][j] === tablero[i][j]) {  // Se verifica si se puede hacer alguna fusion después de caer
          tablero[i + 1][j] = tablero[i][j] * 2;
          tablero[i][j] = 0;
          algoCae = true;
          ultimaFusion = { fila: i + 1, columna: j};
        }
      }   
    } 
  }
  actualizarVista();
}
  


// Función para solidificar la ficha activa al tablero y preparar la siguiente (el manejo del game over ocurre en crearFichaNueva)
function solidificarFicha() {
  // Se solidifica la ficha activa en la posición actual
  tablero[fichaActiva.fila][fichaActiva.columna] = fichaActiva.valor;

  // Se Crea la siguiente ficha (si no hay espacio, crearFichaNueva reinicia el juego)
  crearFichaNueva();

  // Se aplica gravedad despues de solidicar
  aplicarGravedadFichas();

  // Actualiza la vista para reflejar cambios
  actualizarVista();
}



// Función para que la ficha vaya cayendo de forma automatica
function fichaCae (time = 0) {
    const tiempo = time - ultimoTiempo
    ultimoTiempo = time
    dropCounter = dropCounter + tiempo

    if (dropCounter > 1000) {  // Esto es cuando pasa un segundo
        bajarUnPaso();
        dropCounter = 0  // Se reinica el contador de esta variable
    }

    actualizarVista();
    window.requestAnimationFrame(fichaCae)

}

// Funcion para que la ficha baje un paso, en caso de que se puedan fusionar
function bajarUnPaso() {
 
    const fActual = fichaActiva.fila;
    const nf = fActual + 1;
    const nc = fichaActiva.columna;

    // fondo -> solidifica
    if (nf >= filas) {
      solidificarFicha();
      return;
    }

    const destino = tablero[nf][nc];

    if (destino === 0) {
      // baja 1 celda (solo una vez por llamada; aqui se permiten varias)
      fichaActiva.fila = nf;
      contarMovimientos++;
    }

    else if (destino === fichaActiva.valor) {
      // Se fusiona pero la ficha sigue activa
      const nuevo = destino * 2;
      tablero[nf][nc] = 0;     // pone el fusionado abajo
      fichaActiva.fila = nf;
      fichaActiva.valor = nuevo;
      ultimaFusion = { fila: nf, columna: nc };
      contarMovimientos++;
      aplicarGravedadFichas();
    }
    else { 
    // distinta -> se solidifica encima y termina
    solidificarFicha();
    }
}


// Funcion para ver si hay fusion de dos fichas de manera horizontal
function moverHorizontal(dir) { // dir: -1 izq, +1 der
  const r = fichaActiva.fila;
  
  // Un solo paso si hay hueco inmediato
  const c1 = fichaActiva.columna + dir;
  if (c1 < 0 || c1 >= columnas) return;

  const vecino = tablero[r][c1];

  if (vecino === 0) {
    fichaActiva.columna = c1;
    contarMovimientos++;
    aplicarGravedadFichas();
  } 
  else if (vecino === fichaActiva.valor) {
    // primera fusion: el resultado vive en c1 pero la ficha sigue activa
    const nuevo = vecino * 2;
    tablero[r][c1] = 0;        // c1 ahora contiene el fusionado
    fichaActiva.columna = c1;      // la activa "se vuelve" ese bloque
    fichaActiva.valor = nuevo;
    ultimaFusion = { fila: r, columna: c1 };
    contarMovimientos++;
    aplicarGravedadFichas();
  }

}

// Función para devolver la suma de todas las fichas del tablero.
// Si incluirActiva = true, agrega el valor de la ficha activa solo si aún no está pegada.
function obtenerSumaTotal(incluirActiva = true) {
  let suma = 0;

  // sumar tablero 4x4
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      suma += tablero[i][j];
    }
  }

  // sumar ficha activa si está dentro del tablero y su celda está vacía
  if (incluirActiva && fichaActiva) {
    const { fila, columna, valor } = fichaActiva;
    const dentro =
      fila >= 0 && fila < filas &&
      columna >= 0 && columna < columnas;

    if (dentro && tablero[fila][columna] === 0) {
      suma += valor;
    }
  }

  return suma;
}


// Funcion para actualizar la variable de suma que se ve en el juego
function actualizarSumaTotal() {
  const suma = obtenerSumaTotal(true); // true -> incluye ficha activa si no está solidificada
  const hud = document.getElementById('stat-suma');
  if (hud) hud.textContent = suma;

  const overlay = document.getElementById('resume-suma');
  if (overlay) overlay.textContent = suma;
}



// Funcion para reiniciar la partida
function reiniciarPartida() {
  perder = true
  for (let i = 0; i < filas; i++) {
      for (let j = 0; j < columnas; j++) tablero[i][j] = 0;
    }
  contarMovimientos = 0;
  actualizarContarMovimientos();

  // Se restablecen los valores iniciales de las variables asociadas a tiempo y se llama a la función
  segundos = 0;
  minutos = 0;
  horas = 0;
  actualizarTiempo();
  perder = false

  // ficha inicial
  fichaActiva = {
    valor: 2,
    fila: 0,
    columna: Math.floor(Math.random() * columnas)
  };
  actualizarVista();
  return;
}

 
window.onload = function() { document.getElementById('btn-reiniciar').addEventListener('click', reiniciarPartida) }; // Evento que permite reiniciar la partida al hacer click sobre el boton de reiniciar

fichaCae()  // Se llama a esta funcion para que la fichaActiva siempre vaya cayendo de forma automatica
actualizarTiempo()  // Se llama a esta funcion para que el tiempo vaya aumentando progresivamente

