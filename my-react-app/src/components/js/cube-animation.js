const cubePositions = [];

const isPositionValid = (newPosition) => {
    const minDistance = 40; // Минимальное расстояние между кубами, учитывая их размеры

    for (const position of cubePositions) {
        const dx = newPosition.left - position.left;
        const dy = newPosition.top - position.top;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
            return false; // Если расстояние меньше минимального, позиция не валидна
        }
    }
    return true; // Позиция валидна
};

const createCubes = (numberOfCubes) => {
    const heroElement = document.getElementById("hero");
    const heroWidth = heroElement.clientWidth;
    const heroHeight = heroElement.clientHeight;

    for (let i = 0; i < numberOfCubes; i++) {
        setTimeout(() => {
            let newPosition;
            let validPosition = false;

            while (!validPosition) {
                const randomLeft = Math.random() * (heroWidth - 50);
                const randomTop = Math.random() * (heroHeight - 50);

                newPosition = {
                    left: randomLeft,
                    top: randomTop,
                };

                validPosition = isPositionValid(newPosition); // Проверяем новую позицию
            }

            const cube = document.createElement("div");
            cube.className = "cube";
            cube.style.left = `${newPosition.left}px`;
            cube.style.top = `${newPosition.top}px`;

            // Сохраняем позицию куба
            cubePositions.push(newPosition);

            document.getElementById("hero").appendChild(cube);
        }, i * 500);
    }
};

const updateCubePositions = () => {
    const heroElement = document.getElementById("hero");
    const heroWidth = heroElement.clientWidth;
    const heroHeight = heroElement.clientHeight;

    cubePositions.forEach((position, index) => {
        let newPosition;
        let validPosition = false;

        while (!validPosition) {
            const randomLeft = Math.random() * (heroWidth - 50);
            const randomTop = Math.random() * (heroHeight - 50);

            newPosition = {
                left: randomLeft,
                top: randomTop,
            };

            validPosition = isPositionValid(newPosition); // Проверяем новую позицию
        }

        position.left = newPosition.left;
        position.top = newPosition.top;

        const cube = document.getElementsByClassName("cube")[index];
        cube.style.left = `${newPosition.left}px`;
        cube.style.top = `${newPosition.top}px`;
    });
};

window.addEventListener('resize', updateCubePositions);

export default createCubes;
