let firstCard = null;
let secondCard = null;
let gameStart;
let unmatchedCards = [];
let matchedCards = [];


function prepareNewGame() {
    gameStart = Date.now();
    if (unmatchedCards.length >= 1) {
        removeListenersFromAllCards();
    }
    if (matchedCards.length >= 1) {
        resetCards();
    }
    setAllCardsFaceDown();
    shuffleArray(unmatchedCards);
    setTimeout(updateCards, 800);
    setTimeout(setAllCardsFaceUp, 800);
    setTimeout(startGame, 3800);
}

function startGame() {
    setAllCardsFaceDown();
    addListenersToAllCards();
}

function endGame() {
    const gameEnd = Date.now();
    let timeSpent = gameEnd - gameStart;
    timeSpent /= 1000;
    timeSpent = Math.floor(timeSpent);
    setTimeout(
        function () {
            alert(`Fim de jogo.\nTempo gasto: ${timeSpent} segundos`)
        },
        1000
    );
}

function cardEventHandler(event) {
    const card = event.currentTarget;
    card.removeEventListener("click", cardEventHandler);
    // faz a carta desvirar
    card.classList.remove("face-down");
    if (firstCard === null) {
        firstCard = card;
    }
    else {
        secondCard = card;
    }
    if (secondCard !== null) {
        // este if checa se as cartas formam um par; caso sim elas são movidas do array de cartas que não foram pareadas para o array com cartas que já foram pareadas, e reseta as variáveis firstCard e secondCard
        if (firstCard.className.split(" ")[1] === secondCard.className.split(" ")[1]) {
            matchedCards.push(
                ...unmatchedCards.splice(unmatchedCards.indexOf(firstCard), 1)
            );
            firstCard = null;
            matchedCards.push(
                ...unmatchedCards.splice(unmatchedCards.indexOf(secondCard), 1)
            );
            secondCard = null;
            if (unmatchedCards.length === 0) {
                endGame();
            }
        }
        else {
            // remove os eventos para que o jogador não possa continuar virando enquanto as cartas atuais não forem desviradas
            removeListenersFromAllCards();
            // as cartas não formam par, então após 1.5 segundos elas serão desviradas novamente
            setTimeout(setCardFaceDown, 1500);
        }
    }
}

// esta função é usada quando as duas cartas que foram desviradas não formam um par
function setCardFaceDown() {
    firstCard.classList.add("face-down");
    secondCard.classList.add("face-down");
    firstCard = null;
    secondCard = null;
    addListenersToAllCards();
}

function removeListenersFromAllCards() {
    for (card of unmatchedCards) {
        card.removeEventListener("click", cardEventHandler);
    }
}

function addListenersToAllCards() {
    for (card of unmatchedCards) {
        card.addEventListener("click", cardEventHandler);
    }
}

function setAllCardsFaceDown() {
    for (card of unmatchedCards) {
        card.classList.add("face-down");
    }
}

function setAllCardsFaceUp() {
    for (card of unmatchedCards) {
        card.classList.remove("face-down");
    }
}

function initialSetup() {
    const faces = ["facebook",
        "android",
        "chrome",
        "firefox",
        "html5",
        "googleplus",
        "twitter",
        "windows"
    ];
    for (face of faces) {
        const tabuleiro = document.getElementById("tabuleiro");
        for (let i = 0; i < 2; i++) {
            const card = document.createElement("div");
            card.classList.add("flip-card");
            card.classList.add(face);

            const cardInner = document.createElement("div");
            cardInner.classList.add("flip-card-inner");
            card.appendChild(cardInner);

            const cardFront = document.createElement("div");
            cardFront.classList.add("flip-card-front");
            cardInner.appendChild(cardFront);

            const cardFace = document.createElement("img");
            cardFace.src = `img/${face}.png`;
            cardFace.classList.add("card-image");
            cardFace.ondragstart = function () { return false; };
            cardFront.appendChild(cardFace);

            const cardBack = document.createElement("div");
            cardBack.classList.add("flip-card-back");
            cardInner.appendChild(cardBack);

            const cardBackImage = document.createElement("img");
            cardBackImage.src = "img/cross.png";
            cardBackImage.classList.add("card-image");
            cardBackImage.ondragstart = function () { return false; };
            cardBack.appendChild(cardBackImage);

            tabuleiro.appendChild(card);
            unmatchedCards.push(card);
        }
    }
}

function resetCards() {
    unmatchedCards = unmatchedCards.concat(matchedCards.splice(0, matchedCards.length));
}

function shuffleArray(array) {
    // Durstenfeld shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateCards() {
    const tabuleiro = document.getElementById("tabuleiro");
    for (card of unmatchedCards) {
        tabuleiro.appendChild(card);
    }
}
