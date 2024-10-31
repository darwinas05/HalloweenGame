const gameArea = document.getElementById("gameArea");
const basket = document.getElementById("basket");
const scoreDisplay = document.getElementById("score");
const messageDisplay = document.getElementById("message");
const loseImage = document.getElementById("loseImage");
const backgroundAudio = document.getElementById("backgroundAudio");
const loseAudio = document.getElementById("loseAudio");
const startButton = document.getElementById("startButton");

let score = 0;
let candySpeed = 2; // Velocidad inicial de caída de los caramelos
let candySpawnInterval = 1500; // Intervalo inicial de aparición de caramelos en ms
let candyIntervalId; // ID para controlar el intervalo de aparición de caramelos

// Mover la cesta con el ratón
document.addEventListener("mousemove", (e) => {
    const rect = gameArea.getBoundingClientRect();
    let x = e.clientX - rect.left;

    // Evitar que la cesta se salga de los límites de la pantalla
    if (x > 0 && x < rect.width - basket.offsetWidth) {
        basket.style.left = `${x}px`;
    }
});

// Crear un caramelo en posición aleatoria
function createCandy() {
    const candy = document.createElement("div");
    candy.classList.add("candy");
    candy.style.left = `${Math.random() * (gameArea.clientWidth - 30)}px`;
    gameArea.appendChild(candy);
    moveCandy(candy);
}

// Mover el caramelo hacia abajo
function moveCandy(candy) {
    let candyInterval = setInterval(() => {
        let candyTop = candy.offsetTop;

        // Verificar si el caramelo colisiona con la cesta
        if (
            candyTop + candy.offsetHeight >= gameArea.clientHeight - basket.offsetHeight &&
            candy.offsetLeft + candy.offsetWidth > basket.offsetLeft &&
            candy.offsetLeft < basket.offsetLeft + basket.offsetWidth
        ) {
            score += 1;
            scoreDisplay.textContent = `Puntos: ${score}`;
            candy.remove();
            clearInterval(candyInterval);
            updateDifficulty();
        } else if (candyTop > gameArea.clientHeight) {
            // Restar puntos por no recoger el caramelo
            score -= 1;
            candy.remove();
            clearInterval(candyInterval);
            updateScoreDisplay();
            checkGameOver();
        } else {
            // El caramelo sigue cayendo
            candy.style.top = `${candyTop + candySpeed}px`;
        }
    }, 20);
}

// Actualizar la dificultad basándose en la puntuación
function updateDifficulty() {
    if (score > 0 && score % 5 === 0) {
        candySpeed += 1; // Aumenta la velocidad de caída
        candySpawnInterval = Math.max(500, candySpawnInterval - 100); // Aumenta la frecuencia de aparición

        clearInterval(candyIntervalId);
        candyIntervalId = setInterval(createCandy, candySpawnInterval);
    }
}

// Actualizar el puntaje en pantalla y cambiar el color si es negativo
function updateScoreDisplay() {
    scoreDisplay.textContent = `Puntos: ${score}`;
    scoreDisplay.style.color = score < 0 ? "red" : "white"; // Cambiar color si el puntaje es negativo
}

// Comprobar si el juego ha terminado
function checkGameOver() {
    if (score <= -10) {
        endGame("¡Has Perdido!");
    } else if (score >= 35) {
        endGame("¡Juego Completado! La palabra es BRUJA");
    }
}

// Mostrar mensaje y detener el juego
function endGame(message) {
    clearInterval(candyIntervalId); // Detener el juego
    
    if (message === "¡Has Perdido!") {
        messageDisplay.textContent = "Vuelve a Intentarlo"; // Mensaje personalizado para pérdida
    } else {
        messageDisplay.textContent = message; // Otro mensaje en caso de ganar
    }
    
    messageDisplay.classList.remove("hidden"); // Hacer visible el mensaje
    backgroundAudio.pause(); // Detener el audio de fondo
    loseAudio.currentTime = 0; // Reiniciar el audio de pérdida
    loseAudio.play(); // Reproducir el audio de pérdida
    gameArea.style.pointerEvents = "none"; // Deshabilitar eventos de puntero
}



// Iniciar el juego
function startGame() {
    // Asegurarse de que el audio de fondo se reproduce al inicio del juego
    backgroundAudio.play().catch((error) => {
        console.log("No se puede reproducir el audio de fondo: ", error);
    });

    candyIntervalId = setInterval(createCandy, candySpawnInterval); // Crear caramelos en intervalos iniciales
    startButton.classList.add("hidden"); // Ocultar el botón de inicio
}

// Mostrar el botón de inicio y añadir el evento de clic
startButton.addEventListener("click", startGame);
