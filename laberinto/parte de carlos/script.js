document.addEventListener("DOMContentLoaded", function () {
    const paredes = document.querySelectorAll(".pared");
    const meta = document.querySelector(".meta");
    const screamer = document.getElementById("screamer");
    const screamerSound = document.getElementById("screamerSound");
    const victoria = document.getElementById("victoria");
    const inicio = document.querySelector(".camino.inicio"); // Seleccionar el div de salida correctamente
    let paredContacto = 0;

    // Crear el cursor personalizado
    const cursor = document.createElement("div");
    cursor.classList.add("cursor");
    document.body.appendChild(cursor);

    // Obtener las dimensiones y posición del laberinto y el área de inicio
    const laberinto = document.getElementById("laberinto");
    const laberintoRect = laberinto.getBoundingClientRect();
    const inicioRect = inicio.getBoundingClientRect();

    // Función para mover el cursor al área de inicio
    function moverCursorAInicio() {
        cursor.style.left = `${inicioRect.left + inicioRect.width / 2 - cursor.offsetWidth / 2}px`;
        cursor.style.top = `${inicioRect.top + inicioRect.height / 2 - cursor.offsetHeight / 2}px`;
    }

    // Verificar si el cursor colisiona con una pared
    function colisionaConPared(cursorRect) {
        return Array.from(paredes).some((pared) => {
            const paredRect = pared.getBoundingClientRect();
            return (
                cursorRect.left < paredRect.right &&
                cursorRect.right > paredRect.left &&
                cursorRect.top < paredRect.bottom &&
                cursorRect.bottom > paredRect.top
            );
        });
    }

    // Mover el cursor con el mouse
    document.addEventListener("mousemove", (e) => {
        // Calcular nueva posición del cursor
        let cursorX = e.pageX - cursor.offsetWidth / 2;
        let cursorY = e.pageY - cursor.offsetHeight / 2;

        // Limitar el movimiento del cursor dentro del laberinto
        if (cursorX < laberintoRect.left) cursorX = laberintoRect.left;
        else if (cursorX + cursor.offsetWidth > laberintoRect.right) cursorX = laberintoRect.right - cursor.offsetWidth;

        if (cursorY < laberintoRect.top) cursorY = laberintoRect.top;
        else if (cursorY + cursor.offsetHeight > laberintoRect.bottom) cursorY = laberintoRect.bottom - cursor.offsetHeight;

        // Aplicar la posición provisional del cursor para verificar colisiones
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        const cursorRect = cursor.getBoundingClientRect();

        // Verificar colisión con paredes y mover a inicio si hay colisión
        if (colisionaConPared(cursorRect)) {
            paredContacto++;
            if (paredContacto === 2) {
                mostrarScreamer();
                paredContacto = 0;
            }
            moverCursorAInicio(); // Mover al inicio si colisiona con una pared
        } else {
            cursor.style.display = 'block'; // Mostrar el cursor cuando se mueve
        }
    });

    // Mostrar mensaje de victoria al pasar el cursor sobre la meta
    meta.addEventListener("mouseenter", () => {
        mostrarVictoria();
    });

    // Función para mostrar el screamer
    function mostrarScreamer() {
        screamer.style.display = "flex";
        screamerSound.play();

        setTimeout(() => {
            screamer.style.display = "none";
        }, 2000); // Screamer visible por 2 segundos
    }

    // Función para mostrar el mensaje de victoria
    function mostrarVictoria() {
        victoria.style.display = "block";

        setTimeout(() => {
            victoria.style.display = "none";
        }, 5000); // Mensaje de victoria visible por 5 segundos
    }

    // Ocultar el cursor al salir del laberinto
    laberinto.addEventListener("mouseleave", () => {
        cursor.style.display = 'none'; // Oculta el cursor
    });

    // Colocar el cursor en la posición de inicio al cargar la página
    moverCursorAInicio();
});






