document.addEventListener("DOMContentLoaded", () => {
    let currentPlayer = 1;
    let scores = { 1: 0, 2: 0 };
    let currentScores = { 1: 0, 2: 0 };
    let gameOver = false;

    const diceElement = document.getElementById("dice");
    const rollButton = document.getElementById("roll-btn");
    const saveButton = document.getElementById("save-btn");
    const resetButton = document.getElementById("reset-btn");
    const darkModeButton = document.getElementById("dark-mode-btn");
    const winnerText = document.getElementById("winner-text");

    function updateUI() {
        document.getElementById(`player1-score`).textContent = scores[1];
        document.getElementById(`player1-current`).textContent = currentScores[1];
        document.getElementById(`player2-score`).textContent = scores[2];
        document.getElementById(`player2-current`).textContent = currentScores[2];
    }

    function switchTurn() {
        currentScores[currentPlayer] = 0;
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateUI();
    }

    rollButton.addEventListener("click", () => {
        if (gameOver) return;

        const diceRoll = Math.floor(Math.random() * 6) + 1;
        diceElement.src = `dice${diceRoll}.png`;

        if (diceRoll === 1) {
            switchTurn();
        } else {
            currentScores[currentPlayer] += diceRoll;
            updateUI();
        }
    });

    saveButton.addEventListener("click", () => {
        if (gameOver) return;

        scores[currentPlayer] += currentScores[currentPlayer];
        if (scores[currentPlayer] >= 10) {
            winnerText.textContent = `${document.getElementById(`player${currentPlayer}-name`).value} Wins! 🎉`;
            gameOver = true;
            return;
        }

        switchTurn();
    });

    resetButton.addEventListener("click", () => {
        scores = { 1: 0, 2: 0 };
        currentScores = { 1: 0, 2: 0 };
        gameOver = false;
        winnerText.textContent = "";
        currentPlayer = 1;
        updateUI();
    });

    darkModeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    updateUI();
});
