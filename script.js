const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const modeButton = document.getElementById('modeButton');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const modalRestartButton = document.getElementById('modalRestartButton');
const closeModalButton = document.getElementById('closeModalButton');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let isTwoPlayerMode = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(`filled-${currentPlayer}`);

    if (checkWin(currentPlayer)) {
        gameActive = false;
        showModal(`${currentPlayer} wins!`);
        return;
    }

    if (!gameState.includes('')) {
        gameActive = false;
        showModal('It\'s a draw!');
        return;
    }

    if (!isTwoPlayerMode) {
       
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `${currentPlayer}'s turn`;
        setTimeout(makeAIMove, 500); 
    } else {
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `${currentPlayer}'s turn`;
    }
}

function makeAIMove() {
   
    const emptyCells = gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const moveIndex = emptyCells[randomIndex];

    gameState[moveIndex] = currentPlayer;
    cells[moveIndex].textContent = currentPlayer;
    cells[moveIndex].classList.add(`filled-${currentPlayer}`);

    if (checkWin(currentPlayer)) {
        gameActive = false;
        showModal(`${currentPlayer} wins!`);
        return;
    }

    if (!gameState.includes('')) {
        gameActive = false;
        showModal('It\'s a draw!');
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `${currentPlayer}'s turn`;
}

function handleModeSwitch() {
    isTwoPlayerMode = !isTwoPlayerMode;
    modeButton.textContent = isTwoPlayerMode ? 'Switch to AI Mode' : 'Switch to Two Player';

    restartGame();
}

function checkWin(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === player && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return true;
        }
    }
    return false;
}

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('filled-X', 'filled-O');
    });
    closeModal();

    if (!isTwoPlayerMode && currentPlayer === 'O') {
        
        setTimeout(makeAIMove, 500); 
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);
modeButton.addEventListener('click', handleModeSwitch);
closeModalButton.addEventListener('click', closeModal);
modalRestartButton.addEventListener('click', restartGame);

