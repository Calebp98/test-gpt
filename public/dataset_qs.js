let dataset = {}; // Initialize an empty object
let totalQuestions;
let questionNumber = 0;
let totalScore = 0;
let subject;
let questionScore = 0;
let currentQuestion = '';

fetch('/static/sampled_questions.json')
    .then(response => response.json())
    .then(data => {
        // Save the data into your dataset object
        dataset = data;
        totalQuestions = getTotalNumberOfQuestions();

        getUniqueQuestion();

        // For demonstration, log the data
        // console.log(dataset);
    })
    .catch(error => console.error('Error:', error));

let usedQuestions = {};

function getUniqueQuestion() {
    // Get the keys (subject areas) of the dataset
    let keys = Object.keys(dataset);


    // Randomly select a subject area
    let key = keys[Math.floor(Math.random() * keys.length)];

    // If this subject hasn't been used yet, initialize its used questions array
    if (!usedQuestions[key]) {
        usedQuestions[key] = [];
    }
    console.log(usedQuestions)

    // Get the array of questions for this subject area
    let questions = dataset[key];

    // If all questions for this subject have been used, return null or a message
    if (usedQuestions[key].length === questions.length) {
        return "No more questions in this subject";
    }

    // Randomly select a question that hasn't been used yet
    let question;
    do {
        question = questions[Math.floor(Math.random() * questions.length)];
    } while (usedQuestions[key].includes(question));

    // Add this question to the used questions for this subject
    usedQuestions[key].push(question);
    console.log(question)
    question.subject = key
    updateQuestion(question)

    return question;
}


function updateQuestion(questionData) {
    let questionDisplayArea = document.getElementById('question');
    questionDisplayArea.textContent = questionData.question;
    // questionDisplayArea.innerHTML = "If $888x + 889y = 890$  and $891x + 892y = 893$, what is the value of $x - y$?" //unit test for mathjax
    currentQuestion = questionData.question;
    console.log(question)
    subject = questionData.subject
        .split('_')
        .map(word => {
            if (word.toLowerCase() === 'us') {
                return 'US';
            } else {
                return word[0].toUpperCase() + word.slice(1);
            }
        })
        .join(' ');

    document.getElementById('subject').textContent = "Subject: "+subject;


    // Get the list element
    const choicesList = document.getElementById('choices-list');

    // Remove old choices
    while (choicesList.firstChild) {
        choicesList.removeChild(choicesList.firstChild);
    }

    // Add each choice to the list
    questionData.choices.forEach((choice) => {
        const li = document.createElement('li');
        li.innerHTML = choice;
        choicesList.appendChild(li);
    });

    questionNumber++;
    document.getElementById('question-counter').textContent = questionNumber + "/" + totalQuestions;
    document.getElementById('prompt').textContent = getPrompt(questionData);
    console.log(questionNumber);
    console.log(getPrompt(questionData));

    // Show the correct answer
    const answerDisplayArea = document.getElementById('correct-answer');
    answerDisplayArea.textContent = "Correct Answer: "+['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'][questionData.answer];
    console.log(questionData.answer);

    if (window.MathJax) {
        MathJax.typesetPromise([questionDisplayArea, choicesList]).catch((err) => console.log(err));
    } else {
        console.log("error with mathjax");
    }
}


function getTotalNumberOfQuestions() {
    let totalQuestions = 0;

    // Get the keys (subject areas) of the dataset
    let keys = Object.keys(dataset);

    // For each key, add the number of questions in that subject to totalQuestions
    keys.forEach((key) => {
        totalQuestions += dataset[key].length;
    });

    return totalQuestions;
}

function getPrompt(questionData) {
    function formatChoices(questionData) {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']; // Extend if more choices are expected
        return questionData.choices.map((choice, index) => `(${letters[index]}) ${choice}`).join(' ');
    }

    subject = questionData.subject.replace(/_/g, " ");

    return "The following are multiple choice questions about " + subject + "." + questionData.question + formatChoices(questionData) + ". Answer:"
}

$(document).ready(function () {
    $(".probability,.slider").change(function () {
        let $slider = $(this).siblings(".slider");
        let $probability = $(this).siblings(".probability");
        let value = $(this).val();

        const SMALL_PROBABILITY = 0.0001;

        if (value <= 0) {
            value = SMALL_PROBABILITY;
        } else if (value >= 100) {
            value = 100 - SMALL_PROBABILITY;
        }

        $slider.val(value);
        $probability.val(value);
        $(this).val(value); // To make sure the value is updated in case it was out of bounds.
    });

    document.getElementById("generate-question").onclick = getUniqueQuestion;
});

// Create an object to hold the names of all the models
const models = {
    "GPT-1": "gpt-1",
    "GPT-2": "gpt-2",
    "GPT-3": "gpt-3",
    "GPT-4": "gpt-4",
}


// When the submit button is clicked
document.getElementById('submit').addEventListener('click', function() {
    // Get the question
    let question = currentQuestion;
    console.log(question)

    // For each model, get a response
    let i = 0;
    for (let model in models) {
        $(".loader").eq(i).show();

        // Clear the previous response
        $(".model-response").eq(i).html("");

        getModelResponse(question, model, i);
        i++;
    }

    // // Remove the red border from any field
    // $("*").removeClass("invalid");

    // // Show the correctness check
    // $("#correctness").show();

    // Hide the submit button
    $("#submit").hide();

    // Show the score button
    $("#score-btn").show();
});
