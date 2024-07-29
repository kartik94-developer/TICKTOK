// script.js

let xScore = 0;
let oScore = 0;
let totalGames = 0;
let currentPlayer = 'X'; // Player starts first

const xScoreElement = document.getElementById('xScore');
const oScoreElement = document.getElementById('oScore');
const totalGamesElement = document.getElementById('totalGames');
const cells = document.querySelectorAll('.cell');
const messageElement = document.getElementById('message');
const difficultySelect = document.getElementById('difficulty');

let board = Array(9).fill(''); // Board state

function startGame() {
    board = Array(9).fill('');
    currentPlayer = 'X'; // Player starts first
    updateBoard();
    messageElement.style.display = 'none'; // Hide message
    if (currentPlayer === 'O') {
        botPlay(); // Ensure bot starts if currentPlayer is 'O'
    }
}

function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        cell.className = 'cell'; // Reset class
        if (board[index] === 'X') {
            cell.classList.add('x');
        } else if (board[index] === 'O') {
            cell.classList.add('o');
        }
    });
}

function handleClick(event) {
    const index = Array.from(cells).indexOf(event.target);
    if (board[index] === '' && currentPlayer === 'X') {
        board[index] = 'X';
        updateBoard();
        if (checkWinner(board, 'X')) {
            setTimeout(() => showMessage('Player X Wins!'), 100);
            xScore++;
            totalGames++;
            xScoreElement.innerText = `X Score: ${xScore}`;
            totalGamesElement.innerText = `Total Games: ${totalGames}`;
            setTimeout(startGame, 1000);
        } else if (board.every(cell => cell !== '')) {
            setTimeout(() => showMessage('It\'s a Draw!'), 100);
            totalGames++;
            totalGamesElement.innerText = `Total Games: ${totalGames}`;
            setTimeout(startGame, 1000);
        } else {
            currentPlayer = 'O';
            botPlay(); // Bot's turn
        }
    }
}

function botPlay() {
    const availableMoves = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    if (availableMoves.length === 0) return; // No moves left

    const difficulty = difficultySelect.value;
    let bestMove;

    if (difficulty === 'easy') {
        bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
        bestMove = minimax(board, 'O').index; // Use minimax for medium and hard
    }

    board[bestMove] = 'O';
    updateBoard();

    if (checkWinner(board, 'O')) {
        setTimeout(() => showMessage('Bot Wins!'), 100);
        oScore++;
        totalGames++;
        oScoreElement.innerText = `O Score: ${oScore}`;
        totalGamesElement.innerText = `Total Games: ${totalGames}`;
        setTimeout(startGame, 1000);
    } else if (board.every(cell => cell !== '')) {
        setTimeout(() => showMessage('It\'s a Draw!'), 100);
        totalGames++;
        totalGamesElement.innerText = `Total Games: ${totalGames}`;
        setTimeout(startGame, 1000);
    } else {
        currentPlayer = 'X'; // Switch back to player
    }
}

function minimax(board, player) {
    // Minimax algorithm implementation
    const availableMoves = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    if (availableMoves.length === 0) return { index: null };

    let bestMove = null;
    let bestScore = player === 'O' ? -Infinity : Infinity;

    for (const move of availableMoves) {
        board[move] = player;
        const score = minimaxScore(board, player === 'O' ? 'X' : 'O');
        board[move] = '';

        if ((player === 'O' && score > bestScore) || (player === 'X' && score < bestScore)) {
            bestScore = score;
            bestMove = move;
        }
    }

    return { index: bestMove };
}

function minimaxScore(board, player) {
    if (checkWinner(board, 'X')) return -1;
    if (checkWinner(board, 'O')) return 1;
    if (board.every(cell => cell !== '')) return 0;

    const availableMoves = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    let bestScore = player === 'O' ? -Infinity : Infinity;

    for (const move of availableMoves) {
        board[move] = player;
        const score = minimaxScore(board, player === 'O' ? 'X' : 'O');
        board[move] = '';

        if ((player === 'O' && score > bestScore) || (player === 'X' && score < bestScore)) {
            bestScore = score;
        }
    }

    return bestScore;
}

function checkWinner(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

function showMessage(message) {
    messageElement.innerText = message;
    messageElement.style.display = 'block';
    setTimeout(() => messageElement.style.display = 'none', 2000);
}

function restartGame() {
    startGame();
}

function resetScores() {
    xScore = 0;
    oScore = 0;
    totalGames = 0;
    xScoreElement.innerText = `X Score: ${xScore}`;
    oScoreElement.innerText = `O Score: ${oScore}`;
    totalGamesElement.innerText = `Total Games: ${totalGames}`;
    startGame();
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('resetScoresButton').addEventListener('click', resetScores);

startGame();
