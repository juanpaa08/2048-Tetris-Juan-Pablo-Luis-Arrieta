// ----- Definir variables -----

const filas = 4;  // Variable constante que define filas del tablero a 4
const columnas = 4;  // Variable constante que define columnas del tablero a 4
let tablero; 
const opcionesFicha = [2,4,8];  // Vaiable para tener las opciones de fichas a generar, 2, 4 o 8 
let contarMovimientos = 0;  // Variable para llevar una cuenta de los movimientos realizados por el jugador
let dropCounter = 0 
let ultimoTiempo = 0 // Variable para ir llevando una cuenta del tiempo
let ultimaFusion = null; // { fila, columna } o null



// Definir fichas activas

let fichaActiva = { 
    valor: 2, 
    fila: 0, 
    columna: Math.floor(Math.random() * columnas) 
}

// --------- Funciones -----------


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

  // Dibuja ficha activa con borde
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

function crearFichaNueva() { // // Crea una nueva ficha en la fila superior (o reinicia el juego si no hay espacio disponible)
  // Determina columnas disponibles en la fila 0
  const columnasDisponibles = [];
  for (let j = 0; j < columnas; j++) {
    if (tablero[0][j] === 0) columnasDisponibles.push(j);
  }

  // Si no hay espacio, fin del juego
  if (columnasDisponibles.length === 0) {
    alert("Fin del juego, has perdido");
    // limpiar tablero
    for (let i = 0; i < filas; i++) {
      for (let j = 0; j < columnas; j++) tablero[i][j] = 0;
    }
    contarMovimientos = 0;
    actualizarContarMovimientos();

    // ficha inicial
    fichaActiva = {
      valor: 2,
      fila: 0,
      columna: Math.floor(Math.random() * columnas)
    };
    actualizarVista();
    return;
  }

  // Elige valor y columna al azar
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



// Pega la ficha activa al tablero y prepara la siguiente (manejo de game over ocurre en crearFichaNueva)
function solidificarFicha() {
  // 1) Pegar la ficha activa en la posición actual
  tablero[fichaActiva.fila][fichaActiva.columna] = fichaActiva.valor;

  // 2) Crear la siguiente ficha (si no hay espacio, crearFichaNueva reinicia el juego)
  crearFichaNueva();

  // 3) Actualizar la vista para reflejar cambios
  actualizarVista();
}



// Funcion para que la ficha vaya cayendo de forma automatica
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

function bajarUnPaso() {
  // intenta cadena vertical en el mismo frame
  let hizoAlgo = false;

  while (true) {
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
      // baja 1 celda (solo una vez por llamada si prefieres; aqui permitimos varias)
      fichaActiva.fila = nf;
      hizoAlgo = true;
      // si quieres solo 1 paso por pulsacion, quita el while y deja un return aqui
      return;
    }

    if (destino === fichaActiva.valor) {
      const nuevo = destino * 2;

      // 👇 limpia la celda actual porque el bloque se mueve abajo
      if (tablero[fActual] && tablero[fActual][nc] !== undefined) {
        // normalmente sera 0 porque la activa no estaba en tablero,
        // pero si ya venia de una fusion previa en cadena vertical, puede tener valor.
        tablero[fActual][nc] = 0;
      }

      tablero[nf][nc] = nuevo;     // pone el fusionado abajo
      fichaActiva.fila = nf;
      fichaActiva.valor = nuevo;
      ultimaFusion = { fila: nf, columna: nc };
      hizoAlgo = true;

      // continua el while para intentar otra fusion en cadena
      continue;
    }

    // distinta -> se pega encima y termina
    solidificarFicha();
    return;
  }

  if (hizoAlgo) contarMovimientos++;
}



function moverHorizontal(dir) { // dir: -1 izq, +1 der
  const r = fichaActiva.fila;
  let moved = false;

  // 1) un solo paso si hay hueco inmediato
  const c1 = fichaActiva.columna + dir;
  if (c1 < 0 || c1 >= columnas) return;

  const vecino = tablero[r][c1];

  if (vecino === 0) {
    fichaActiva.columna = c1;
    moved = true;
  } else if (vecino === fichaActiva.valor) {
    // primera fusion: el resultado vive en c1
    const nuevo = vecino * 2;
    tablero[r][c1] = nuevo;        // c1 ahora contiene el fusionado
    fichaActiva.columna = c1;      // la activa "se vuelve" ese bloque
    fichaActiva.valor = nuevo;
    ultimaFusion = { fila: r, columna: c1 };
    moved = true;

    // 2) cadena: mientras el siguiente inmediato sea igual, fusiona otra vez
    while (true) {
      const cActual = fichaActiva.columna;   // donde esta AHORA el bloque fusionado
      const c2 = cActual + dir;              // siguiente vecino en la misma direccion
      if (c2 < 0 || c2 >= columnas) break;

      const vecino2 = tablero[r][c2];
      if (vecino2 === fichaActiva.valor) {
        const nuevo2 = vecino2 * 2;

        // 👇 LIMPIA la celda actual (cActual) porque el bloque se "mueve" a c2
        tablero[r][cActual] = 0;

        // el bloque pasa a c2 con el valor duplicado
        tablero[r][c2] = nuevo2;
        fichaActiva.columna = c2;
        fichaActiva.valor = nuevo2;
        ultimaFusion = { fila: r, columna: c2 };

        // sigue intentando encadenar
      } else {
        break; // distinto o vacio (no resbalamos por vacios)
      }
    }
  }

  if (moved) contarMovimientos++;
}

// Devuelve la suma de todas las fichas del tablero.
// Si incluirActiva = true, agrega el valor de la ficha activa SOLO si aún no está pegada.
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

function actualizarSumaTotal() {
  const suma = obtenerSumaTotal(true); // true -> incluye ficha activa si no está pegada
  const hud = document.getElementById('stat-suma');
  if (hud) hud.textContent = suma;

  const overlay = document.getElementById('resume-suma');
  if (overlay) overlay.textContent = suma;
}


fichaCae()  // Se llama a esta funcion para que la fichaActiva siempre vaya cayendo de forma automatica