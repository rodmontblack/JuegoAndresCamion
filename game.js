// game.js
document.addEventListener('DOMContentLoaded', () => {
    const truck = document.getElementById('truck');
    const gameContainer = document.getElementById('game-container');
    const redLight = document.getElementById('red-light');
    const greenLight = document.getElementById('green-light');
    const trafficLight = document.getElementById('traffic-light');
    const stopArea = document.getElementById('stop-area');
    const upArrow = document.getElementById('up-arrow');
    const downArrow = document.getElementById('down-arrow');

    const upArrowPressedImage = 'arrow-up.png';  // Ruta de la imagen de flecha arriba presionada
    const downArrowPressedImage = 'arrow-up.png';  // Ruta de la imagen de flecha abajo presionada

    const upArrowImage = 'arrow-up2.png';  // Ruta de la imagen original de flecha arriba
    const downArrowImage = 'arrow-up2.png';  // Ruta de la imagen original de flecha abajo

    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;

    let position = { top: 0, left: (containerWidth - truck.offsetWidth) / 2 }; // Inicializar en la parte superior y centrado
    let lightIsRed = true;
    let truckRotation = 90; // Inicialmente hacia arriba
    let moveInterval = null;

    setInterval(() => {
        lightIsRed = !lightIsRed;
        if (lightIsRed) {
            redLight.classList.add('red-light');
            greenLight.classList.remove('green-light');
        } else {
            redLight.classList.remove('red-light');
            greenLight.classList.add('green-light');
        }
    }, 3000); // Cambiar la luz cada 3 segundos

    function moveTruck(direction) {
        let newTop = position.top;

        if (direction === 'up') {
            newTop -= 10;
            truckRotation = 90; // Rotar 90 grados a la derecha (mirando hacia arriba)
        } else if (direction === 'down') {
            newTop += 10;
            truckRotation = -90; // Rotar 90 grados a la izquierda (mirando hacia abajo)
        }

        if (newTop >= 0 && newTop + truck.offsetHeight <= containerHeight) { // Limitar el movimiento dentro de la pista
            if (lightIsRed && isTruckInStopArea(newTop, position.left)) {
                return; // Detener el camión en el semáforo rojo
            }
            position.top = newTop;
            updatePosition();
        }
    }

    function startMoving(direction) {
        if (moveInterval) clearInterval(moveInterval);
        moveTruck(direction);
        moveInterval = setInterval(() => moveTruck(direction), 100);
    }

    function stopMoving() {
        clearInterval(moveInterval);
        moveInterval = null;
    }

    function addTouchListeners(element, direction) {
        element.addEventListener('touchstart', () => {
            element.classList.add('selected');
            element.src = direction === 'up' ? upArrowPressedImage : downArrowPressedImage;
            startMoving(direction);
        });

        element.addEventListener('touchend', () => {
            element.classList.remove('selected');
            element.src = direction === 'up' ? upArrowImage : downArrowImage;
            stopMoving();
        });

        element.addEventListener('touchcancel', () => {
            element.classList.remove('selected');
            element.src = direction === 'up' ? upArrowImage : downArrowImage;
            stopMoving();
        });
    }

    upArrow.addEventListener('mousedown', () => {
        upArrow.classList.add('selected');
        upArrow.src = upArrowPressedImage;  // Cambiar a la imagen de flecha arriba presionada
        startMoving('up');
    });

    upArrow.addEventListener('mouseup', () => {
        upArrow.classList.remove('selected');
        upArrow.src = upArrowImage;  // Revertir a la imagen original de flecha arriba
        stopMoving();
    });

    upArrow.addEventListener('mouseleave', () => {
        upArrow.classList.remove('selected');
        upArrow.src = upArrowImage;  // Revertir a la imagen original de flecha arriba
        stopMoving();
    });

    downArrow.addEventListener('mousedown', () => {
        downArrow.classList.add('selected');
        downArrow.src = downArrowPressedImage;  // Cambiar a la imagen de flecha abajo presionada
        startMoving('down');
    });

    downArrow.addEventListener('mouseup', () => {
        downArrow.classList.remove('selected');
        downArrow.src = downArrowImage;  // Revertir a la imagen original de flecha abajo
        stopMoving();
    });

    downArrow.addEventListener('mouseleave', () => {
        downArrow.classList.remove('selected');
        downArrow.src = downArrowImage;  // Revertir a la imagen original de flecha abajo
        stopMoving();
    });

    addTouchListeners(upArrow, 'up');
    addTouchListeners(downArrow, 'down');

    document.addEventListener('keydown', (event) => {
        let newTop = position.top;

        switch (event.key) {
            case 'ArrowUp':
                newTop = position.top - 10;
                truckRotation = 90; // Rotar 90 grados a la derecha (mirando hacia arriba)
                break;
            case 'ArrowDown':
                newTop = position.top + 10;
                truckRotation = -90; // Rotar 90 grados a la izquierda (mirando hacia abajo)
                break;
        }

        if (newTop >= 0 && newTop + truck.offsetHeight <= containerHeight) { // Limitar el movimiento dentro de la pista
            if (lightIsRed && isTruckInStopArea(newTop, position.left)) {
                return; // Detener el camión en el semáforo rojo
            }
            position.top = newTop;
            updatePosition();
        }
    });

    function isTruckInStopArea(top, left) {
        const stopAreaTop = stopArea.offsetTop;
        const stopAreaHeight = stopArea.offsetHeight;

        // Ajustamos la lógica para que el camión se detenga correctamente en la parte superior del rectángulo blanco
        const truckTopEdge = top;
        const truckBottomEdge = top + truck.offsetHeight;
        const stopAreaBottomEdge = stopAreaTop + stopAreaHeight;

        return (
            truckTopEdge < stopAreaBottomEdge && truckBottomEdge > stopAreaTop
        );
    }

    function updatePosition() {
        truck.style.top = `${position.top}px`;
        truck.style.left = `${position.left}px`;
        truck.style.transform = `rotate(${truckRotation}deg)`; // Aplicar la rotación
    }

    // Iniciar la posición del camión
    updatePosition();
});
