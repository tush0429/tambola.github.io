// Array to store selected cells
const selectedCells = [];

function generateTicket() {
    const ticketContainer = document.getElementById('tambolaTicket');
    ticketContainer.innerHTML = '';

    const ticket = getTicket();
    displayTicket(ticketContainer, ticket);
    getQuote();

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.textContent.trim() !== '') {
                if (!cell.classList.contains('selected')) {
                    cell.style.backgroundColor = 'green';
                    cell.style.color = 'white';
                    cell.classList.add('selected');
                    selectedCells.push(cell);                    
                } else {
                    cell.style.backgroundColor = 'red';
                    cell.style.color = 'white';
                    cell.classList.remove('selected');
                    const index = selectedCells.indexOf(cell);
                    if (index !== -1) {
                        selectedCells.splice(index, 1);
                    }
                }
            }
        });
    });
}

function getTicket() {
    const ticketArray = createEmptyTicket();
    const randomIndices = generateRandomIndices();

    fillRandomValues(ticketArray, randomIndices);
    sortTicketColumns(ticketArray);

    return ticketArray;
}

function createEmptyTicket() {
    const ticketArray = [];
    for (let i = 0; i < 3; i++) {
        ticketArray[i] = Array(9).fill(0);
    }
    return ticketArray;
}

function generateRandomIndices() {
    const totalIndices = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 9; j++) {
            totalIndices.push([i, j]);
        }
    }

    const randomIndices = [];
    randomIndices.push(...getRandomSample(totalIndices.slice(0, 9), 5));
    randomIndices.push(...getRandomSample(totalIndices.slice(9, 18), 5));
    randomIndices.push(...getRandomSample(totalIndices.slice(-9), 5));

    return randomIndices;
}

function getRandomSample(array, count) {
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function fillRandomValues(ticketArray, randomIndices) {
    const totalNumbers = Array.from({ length: 90 }, (_, index) => index + 1);

    randomIndices.forEach(num => {
        const [row, col] = num;
        const rangeStart = col * 10;
        const rangeEnd = rangeStart + 10;
        const number = getRandomNumberInRange(totalNumbers, rangeStart, rangeEnd);
        ticketArray[row][col] = number;
        totalNumbers[totalNumbers.indexOf(number)] = 0;
    });
}

function getRandomNumberInRange(arr, min, max) {
    const validNumbers = arr.filter(num => num >= min && num < max && num !== 0);
    const randomIndex = Math.floor(Math.random() * validNumbers.length);
    return validNumbers[randomIndex];
}

function sortTicketColumns(ticketArray) {
    for (let col = 0; col < 9; col++) {
        if (
            ticketArray[0][col] !== 0 &&
            ticketArray[1][col] !== 0 &&
            ticketArray[2][col] !== 0
        ) {
            for (let row = 0; row < 2; row++) {
                if (ticketArray[row][col] > ticketArray[row + 1][col]) {
                    const temp = ticketArray[row][col];
                    ticketArray[row][col] = ticketArray[row + 1][col];
                    ticketArray[row + 1][col] = temp;
                }
            }
        } else if (
            ticketArray[0][col] !== 0 &&
            ticketArray[1][col] !== 0 &&
            ticketArray[2][col] === 0
        ) {
            if (ticketArray[0][col] > ticketArray[1][col]) {
                const temp = ticketArray[0][col];
                ticketArray[0][col] = ticketArray[1][col];
                ticketArray[1][col] = temp;
            }
        } else if (
            ticketArray[0][col] !== 0 &&
            ticketArray[2][col] !== 0 &&
            ticketArray[1][col] === 0
        ) {
            if (ticketArray[0][col] > ticketArray[2][col]) {
                const temp = ticketArray[0][col];
                ticketArray[0][col] = ticketArray[2][col];
                ticketArray[2][col] = temp;
            }
        } else if (
            ticketArray[0][col] === 0 &&
            ticketArray[1][col] !== 0 &&
            ticketArray[2][col] !== 0
        ) {
            if (ticketArray[1][col] > ticketArray[2][col]) {
                const temp = ticketArray[1][col];
                ticketArray[1][col] = ticketArray[2][col];
                ticketArray[2][col] = temp;
            }
        }
    }
}

function displayTicket(container, ticket) {
    ticket.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        row.forEach(number => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.textContent = number !== 0 ? number : '';
            rowDiv.appendChild(cellDiv);
        });

        container.appendChild(rowDiv);
    });
}

// Fetch a random quote
function getQuote() {
    fetch("https://api.quotable.io/random")
        .then(response => response.json())
        .then(data => {
            const quoteElement = document.getElementById("quote");
            const authorElement = document.getElementById("author");

            quoteElement.textContent = data.content;
        })
        .catch(error => console.error("Error fetching quote:", error));
}

// Initialize by generating the first ticket
generateTicket();