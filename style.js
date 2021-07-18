let countSpan = document.querySelector(".count span");
let bulletsSpan = document.querySelector(".bullets .spans");
let quizarea = document.querySelector(".qiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bull = document.querySelector(".bullets");
let results = document.querySelector(".results");
let countdown = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;
function getQuestion() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionObjects = JSON.parse(this.responseText);
            let questionCount = questionObjects.length;
            // console.log(questionCount);
            creatBullets(questionCount);
            addQuiz(questionObjects[currentIndex], questionCount);
            countDown(9, questionCount);
            submitButton.onclick = () => {
                let theRightAnswer = questionObjects[currentIndex].right_answer;
                // console.log(theRightAnswer)
                currentIndex++;
                checkAnswer(theRightAnswer, questionCount);
                quizarea.innerHTML = "";
                answersArea.innerHTML = "";
                addQuiz(questionObjects[currentIndex], questionCount);
                handBullets();
                clearInterval(countDownInterval);
                countDown(9, questionCount);

                showResult(questionCount);
            }
        }
    }
    myRequest.open("GET", "Quiez.json", true);
    myRequest.send();
}
getQuestion();

function creatBullets(e) {
    countSpan.innerHTML = e;

    for (let i = 0; i <= e; i++) {
        let bullet = document.createElement("span");
        if (i == 0) {
            bullet.className = "on";
        }
        bulletsSpan.appendChild(bullet);
    }
}

function addQuiz(obj, count) {
    if (currentIndex < count) {
        let qTitle = document.createElement("h1");
        let qText = document.createTextNode(obj.title);
        qTitle.appendChild(qText);
        quizarea.appendChild(qTitle);

        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = 'answer';
            let radioInput = document.createElement("input");
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer-${i}`;
            radioInput.dataset.answer = obj[`answer-${i}`];

            let theLabel = document.createElement("label");
            theLabel.htmlFor = `answer-${i}`
            let theLabelText = document.createTextNode(obj[`answer-${i}`]);
            theLabel.appendChild(theLabelText);
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
            answersArea.appendChild(mainDiv);
        }
    }
}
function checkAnswer(a, c) {
    //console.log(a  , c)
    let answers = document.getElementsByName("question");
    let chooseA;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            chooseA = answers[i].dataset.answer;
        }
    }
    console.log(`${a}`);
    console.log(`${chooseA}`);

    if (a === chooseA) {
        rightAnswer++;
        // console.log("goood")
    }
    else {
        //  console.log("noooo")
    }
}

function handBullets() {
    bulletSpan = document.querySelectorAll(".bullets .spans span");
    let arr = Array.from(bulletSpan);
    arr.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResult(count) {
    let result;
    if (currentIndex === count) {
        // console.log("finish")
        quizarea.remove();
        answersArea.remove();
        submitButton.remove();
        bull.remove();

        if (rightAnswer > (count / 3) && rightAnswer < count) {
            theResult = `<span class="good">GOOD</span> , ${rightAnswer} From ${count} `
        }
        else if (rightAnswer === count) {
            theResult = `<span class="excellnt">EXCELLENT</span> , ${rightAnswer} From ${count} `
        }
        else {
            theResult = `<span class="bad">Bad</span> , ${rightAnswer} From ${count} `
        }
        results.innerHTML = theResult;
    }
}

function countDown(duration, count) {
    if (currentIndex < count) {
        let minute, second;
        countDownInterval = setInterval(function () {
            minute = parseInt(duration / 60);
            second = parseInt(duration % 60);
            minute = minute < 10 ? `0${minute}` : minute;
            second = second < 10 ? `0${second}` : second;

            countdown.innerHTML = `${minute} : ${second}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }

        }, 1000);
    }
}