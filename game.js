const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice_text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = []

let questions = [];
fetch("questions.json").then(res =>{
    return res.json();

})
.then(loadedQuestions =>{
    questions = loadedQuestions;
    startGame();
});


//Constants:
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestions();
}

getNewQuestions = () => {
    if(availableQuestions == 0 || questionCounter> MAX_QUESTIONS+1){
        return window.location.assign("/end.html");
    }
    localStorage.setItem("mostRecentScore", score);

    questionCounter++;
    const progressWidth = (questionCounter/MAX_QUESTIONS) * 100;
    progressText.innerText ="Question "+ questionCounter + '/' + MAX_QUESTIONS;
    progressBarFull.style.width = progressWidth + "%";
    

    

    const questionIndex = Math.floor(Math.random()*availableQuestions.length);
    
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;
    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText =  currentQuestion['choice'+number];

    

    }
    
    )

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

};

choices.forEach( choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer ==currentQuestion.answer ? 'correct' : 'incorrect';

        
        selectedChoice.parentElement.classList.add(classToApply);
        
        if (classToApply == "correct"){
            incrementScore(CORRECT_BONUS);
        }


        setTimeout(() =>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestions();
        }, 1000);
       
        
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

localStorage.setItem("mostRecentScore", score);

