let keyButtons = document.querySelectorAll('.keyboard button')
let wordDisplay = document.querySelector('.word-display')
let hangmanImage = document.querySelector('.hangman-box img')
let guessText = document.querySelector('.guesses-text b')
let gameModal = document.querySelector('.game-modal')
let playAgain = document.querySelector('.play-again')
let currentWord, wrongGuessCount, correctLetters;
const maxGuesses = 6;


const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    wordDisplay.innerHTML = currentWord.split('').map(() => `<li class="letter"></li>`).join("");
    gameModal.classList.remove('show');
    guessText.innerText = `${wrongGuessCount}/${maxGuesses}`
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`
    keyButtons.forEach(btn => btn.disabled = false)


}

const gameOver = (isWin) => {
    setTimeout(() => {
        const modalText = isWin ? 'You found the word :' : 'The correct word is : ';
        gameModal.querySelector('img').src = `images/${isWin ? 'victory' : 'lost'}.gif`
        gameModal.querySelector('h4').innerText = `${isWin ? 'Congrats!' : 'Game Over!'}`
        gameModal.querySelector('p').innerHTML = `${modalText} <b>${currentWord}</b>`
        gameModal.classList.add('show');

    }, 300)

}

const getRandomWord = () => {
    fetch('data/word-list.json')
        .then(response => {
            console.log(response.ok)
            return response.json()
        })
        .then(data => {
            const { word, hint } = data.words[Math.floor(Math.random() * data.words.length)]
            console.log(word)
            currentWord = word
            document.querySelector('.hint-text b').innerText = hint;
            resetGame();
        })
        .catch(error => {
            console.log(error)

        })

}



const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter)
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add('guessed')
            }
        })
    } else {
        console.log('not exist')
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`
    }
    button.disabled = true;
    guessText.innerText = `${wrongGuessCount}/${maxGuesses}`

    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);

}

keyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        initGame(e.target, e.target.innerText.toLowerCase())

    })
})
getRandomWord();

playAgain.addEventListener('click', getRandomWord)