// Game State
let gameState = {
    score: 0,
    wickets: 0,
    balls: 0,
    target: 150,
    maxBalls: 120, // 20 overs
    maxWickets: 10,
    currentOver: [],
    totalFours: 0,
    totalSixes: 0,
    highestScore: 0
};

// Ball types with difficulty
const ballTypes = [
    { name: 'Good Length', difficulty: 0.5 },
    { name: 'Full Toss', difficulty: 0.2 },
    { name: 'Bouncer', difficulty: 0.7 },
    { name: 'Yorker', difficulty: 0.8 },
    { name: 'Spin', difficulty: 0.6 },
    { name: 'Slower Ball', difficulty: 0.5 }
];

// Shot types with risk levels
const shotTypes = {
    defend: {
        name: 'Defense',
        wicketChance: 0.02,
        runs: () => 0
    },
    single: {
        name: 'Single',
        wicketChance: 0.1,
        runs: () => Math.random() < 0.7 ? 1 : 2
    },
    boundary: {
        name: 'Boundary Shot',
        wicketChance: 0.25,
        runs: () => Math.random() < 0.6 ? 4 : 0
    },
    six: {
        name: 'Big Shot',
        wicketChance: 0.4,
        runs: () => Math.random() < 0.4 ? 6 : 0
    }
};

// Commentary lines
const commentary = {
    defend: [
        "Solid defense! The ball is blocked safely.",
        "Good technique! Defended with a straight bat.",
        "Well played! No run but no risk taken."
    ],
    single: [
        "Quick single taken! Good running between the wickets.",
        "Nicely placed for a single!",
        "Easy single! Good rotation of strike.",
        "Two runs! Excellent placement and running!"
    ],
    boundary: [
        "FOUR! What a shot! Ball races to the boundary!",
        "FOUR RUNS! Perfectly timed!",
        "Beautiful stroke! That's four runs!",
        "Edged and missed! Dot ball."
    ],
    six: [
        "SIX! MASSIVE HIT! That's out of the park!",
        "MAXIMUM! What a strike!",
        "SIX RUNS! Absolutely hammered!",
        "Swing and a miss! Beaten by the bowler."
    ],
    wicket: [
        "OUT! Caught by the fielder!",
        "BOWLED! The stumps are shattered!",
        "WICKET! LBW! That was plumb!",
        "OUT! Caught behind by the keeper!",
        "WICKET! What a delivery!"
    ]
};

// Start the game
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    resetGame();
    updateUI();
}

// Reset game state
function resetGame() {
    gameState = {
        score: 0,
        wickets: 0,
        balls: 0,
        target: 150,
        maxBalls: 120,
        maxWickets: 10,
        currentOver: [],
        totalFours: 0,
        totalSixes: 0,
        highestScore: gameState.highestScore || 0
    };
}

// Play a shot
function playShot(shotType) {
    if (gameState.wickets >= gameState.maxWickets || gameState.balls >= gameState.maxBalls) {
        return;
    }

    // Disable buttons during animation
    disableButtons(true);

    // Get random ball type
    const ball = ballTypes[Math.floor(Math.random() * ballTypes.length)];

    // Calculate outcome
    const shot = shotTypes[shotType];
    const wicketChance = shot.wicketChance * (1 + ball.difficulty * 0.3);
    const isWicket = Math.random() < wicketChance;

    // Animate the ball
    animateBall(isWicket);

    // Process result after animation
    setTimeout(() => {
        let result;
        let commentaryText;

        if (isWicket) {
            gameState.wickets++;
            result = 'W';
            commentaryText = getRandomCommentary('wicket');
            gameState.currentOver.push({ type: 'wicket', value: 'W' });
        } else {
            const runs = shot.runs();
            gameState.score += runs;
            result = runs;

            if (runs === 4) {
                gameState.totalFours++;
                commentaryText = commentary.boundary[Math.floor(Math.random() * commentary.boundary.length)];
            } else if (runs === 6) {
                gameState.totalSixes++;
                commentaryText = commentary.six[Math.floor(Math.random() * commentary.six.length)];
            } else if (runs > 0) {
                commentaryText = getRandomCommentary('single');
            } else {
                commentaryText = runs === 0 && shotType !== 'defend' ?
                    commentary[shotType][commentary[shotType].length - 1] :
                    getRandomCommentary('defend');
            }

            // Add to current over
            const ballType = runs === 0 ? 'dot' :
                           runs === 4 ? 'four' :
                           runs === 6 ? 'six-ball' : 'runs';
            gameState.currentOver.push({ type: ballType, value: result });
        }

        gameState.balls++;

        // Clear over display every 6 balls
        if (gameState.balls % 6 === 0) {
            gameState.currentOver = [];
        }

        // Update commentary
        document.getElementById('commentary').innerHTML =
            `<strong>${ball.name}</strong> - ${commentaryText}`;

        // Update UI
        updateUI();

        // Check game over conditions
        checkGameOver();

        // Re-enable buttons
        disableButtons(false);
    }, 1000);
}

// Animate the ball
function animateBall(isWicket) {
    const ball = document.getElementById('ball');
    ball.className = 'ball';

    setTimeout(() => {
        ball.classList.add(isWicket ? 'bowling' : 'bowling');
    }, 10);

    if (!isWicket) {
        setTimeout(() => {
            ball.classList.remove('bowling');
            ball.classList.add('hit');
        }, 500);
    }

    setTimeout(() => {
        ball.className = 'ball';
    }, 1500);
}

// Disable/enable buttons
function disableButtons(disabled) {
    const buttons = document.querySelectorAll('.shot-btn');
    buttons.forEach(btn => btn.disabled = disabled);
}

// Get random commentary
function getRandomCommentary(type) {
    const comments = commentary[type];
    return comments[Math.floor(Math.random() * comments.length)];
}

// Update UI
function updateUI() {
    // Update scoreboard
    document.getElementById('score').textContent = `${gameState.score}/${gameState.wickets}`;
    document.getElementById('balls').textContent = `${gameState.balls}/${gameState.maxBalls}`;

    // Calculate run rate
    const overs = Math.floor(gameState.balls / 6) + (gameState.balls % 6) / 10;
    const runRate = overs > 0 ? (gameState.score / overs).toFixed(2) : '0.00';
    document.getElementById('runRate').textContent = runRate;

    // Update current over display
    const ballsDisplay = document.getElementById('ballsDisplay');
    ballsDisplay.innerHTML = '';
    gameState.currentOver.forEach(ball => {
        const ballElement = document.createElement('div');
        ballElement.className = `ball-result ${ball.type}`;
        ballElement.textContent = ball.value;
        ballsDisplay.appendChild(ballElement);
    });
}

// Check if game is over
function checkGameOver() {
    let isGameOver = false;
    let result = '';
    let resultTitle = '';

    if (gameState.wickets >= gameState.maxWickets) {
        isGameOver = true;
        resultTitle = 'All Out!';
        if (gameState.score >= gameState.target) {
            result = 'win';
        } else {
            result = 'lose';
        }
    } else if (gameState.balls >= gameState.maxBalls) {
        isGameOver = true;
        resultTitle = 'Innings Complete!';
        if (gameState.score >= gameState.target) {
            result = 'win';
        } else {
            result = 'lose';
        }
    } else if (gameState.score >= gameState.target) {
        isGameOver = true;
        resultTitle = 'Target Achieved!';
        result = 'win';
    }

    if (isGameOver) {
        showGameOver(result, resultTitle);
    }
}

// Show game over screen
function showGameOver(result, title) {
    // Update high score
    if (gameState.score > gameState.highestScore) {
        gameState.highestScore = gameState.score;
    }

    const gameOverScreen = document.getElementById('gameOver');
    const resultTitle = document.getElementById('resultTitle');
    const finalScore = document.getElementById('finalScore');
    const stats = document.getElementById('stats');

    resultTitle.textContent = title;

    if (result === 'win') {
        finalScore.innerHTML = `🏆 YOU WON! 🏆<br>${gameState.score}/${gameState.wickets}`;
        finalScore.style.color = '#28a745';
    } else {
        finalScore.innerHTML = `😔 YOU LOST<br>${gameState.score}/${gameState.wickets}`;
        finalScore.style.color = '#dc3545';
    }

    const overs = Math.floor(gameState.balls / 6) + (gameState.balls % 6) / 10;
    const runRate = overs > 0 ? (gameState.score / overs).toFixed(2) : '0.00';
    const requiredRate = gameState.target - gameState.score > 0 ?
        ((gameState.target - gameState.score) / ((gameState.maxBalls - gameState.balls) / 6)).toFixed(2) : '0.00';

    stats.innerHTML = `
        <p><strong>Final Score:</strong> ${gameState.score}/${gameState.wickets}</p>
        <p><strong>Balls Faced:</strong> ${gameState.balls}/${gameState.maxBalls}</p>
        <p><strong>Overs:</strong> ${overs.toFixed(1)}</p>
        <p><strong>Run Rate:</strong> ${runRate}</p>
        <p><strong>Boundaries:</strong> ${gameState.totalFours} fours, ${gameState.totalSixes} sixes</p>
        <p><strong>Target:</strong> ${gameState.target}</p>
        ${result === 'lose' ? `<p><strong>Needed:</strong> ${gameState.target - gameState.score} runs</p>` : ''}
        <p><strong>High Score:</strong> ${gameState.highestScore}</p>
    `;

    gameOverScreen.style.display = 'flex';
}

// Restart game
function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    resetGame();
    updateUI();
    document.getElementById('commentary').textContent = 'New match started! Choose your shot to begin.';
    document.getElementById('ballsDisplay').innerHTML = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});
