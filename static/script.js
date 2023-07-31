// // script.js

// // Initialize the total score, question number, and question score to zero
// let totalScore = 0;
// let questionNumber = 1;
// let questionScore = 0;

// // Create an object to hold the names of all the models
// const models = {
//     "GPT-1": "gpt-1",
//     "GPT-2": "gpt-2",
//     "GPT-3": "gpt-3",
//     "GPT-4": "gpt-4",
// }

// // When the document is ready
// $(document).ready(function(){

//     // Initialize the model displays variable to an empty string
//     let model_displays = '';

//     addDOMElements();
//     resetDOMElements();

//     $(".correctness").hide().change(function() {
//         // When the correctness div changes, calculate the new score and add it to the total and question scores
//         let predictedProbability = $(this).siblings(".input_wrapper").children(".probability").val();
//         let isCorrect = $(this).find("input[name='correctness']:checked").val() === "true";
//         let score = calculateScore(predictedProbability, isCorrect);

//         totalScore += score;
//         questionScore += score;

//     });

//     // When the score button is clicked
//     $("#score-btn").click(function() {
//         // Check if the user has indicated whether the answer is correct for all models
//         let allCorrectnessChecked = true;
//         $(".correctness").each(function() {
//             if ($(this).find("input[type='radio']:checked").val() === undefined) {
//                 allCorrectnessChecked = false;
//             }
//         }
//         );

//         // If all correctness indicators have been checked, ask a new question
//         if (allCorrectnessChecked) {
//             askNewQuestion();
//         } else {
//             // If not all correctness indicators have been checked, show an alert
//             alert("Please select whether the answer was correct or not for all models.");
//             // Highlight the unchecked radio buttons in red
//             $(".correctness").each(function() {
//                 if ($(this).find("input[type='radio']:checked").val() === undefined) {
//                     $(this).addClass("invalid");
//                 }
//             }
//             );
//         }
//     } );

//     // When the probability or slider changes
//     $(".probability,.slider").change(function() {
//         // Get the slider and probability elements and the value
//         let $slider = $(this).siblings(".slider");
//         let $probability = $(this).siblings(".probability");
//         let value = $(this).val();

//         // Ensure the value is within the bounds of 0 and 100
//         const SMALL_PROBABILITY = 0.0001;
//         if (value <= 0) {
//             value = SMALL_PROBABILITY;
//         } else if (value >= 100) {
//             value = 100 - SMALL_PROBABILITY;
//         }

//         // Update the slider, probability, and this element with the new value
//         $slider.val(value);
//         $probability.val(value);
//         $(this).val(value); // To make sure the value is updated in case it was out of bounds.

//     });

//     // When the submit button is clicked
//     $("#submit").click(submitQuestion);
// });

// // Calculate the score based on the predicted probability and whether the answer is correct
// function calculateScore(predictedProbability, isCorrect) {
//     let prob = predictedProbability / 100;
//     let flippedProb = isCorrect ? prob : 1 - prob;
//     let score = Math.log2(flippedProb);
//     return score;
// }

// // Validate the submission
// function validateSubmission(){
//     let question = $("#question").val();

//     if (question === "") {
//         // Highlight the question field in red if it is empty
//         $("#question").addClass("invalid");
//         return false;
//     }

//     return true;
// }

// // The function to get a response from a specified model
// function getModelResponse(question, model, i) {
//     // Create an AJAX request
//     $.ajax({
//         url: '/generate', // The URL to which we will send the request
//         data: JSON.stringify({ 'prompt': question, 'model': model }), // The data to send in the request
//         contentType: 'application/json;charset=UTF-8', // The content type of the data being sent
//         type : 'POST', // The type of request being made
//         success: function(response) { // The function to execute upon a successful response
//             console.log(response); // Log the response to the console
//             $(".model-response").eq(i).html(response); // Display the response in the corresponding model-response element
//             $(".correctness").eq(i).show(); // Show the corresponding correctness check
//             $(".loader").eq(i).hide(); // Hide the corresponding loader

//             // Disable the corresponding slider and probability input
//             $(".probability").eq(i).prop('disabled', true);
//             $(".slider").eq(i).prop('disabled', true);
//         },
//         error: function(error) { // The function to execute if there's an error
//             console.log(error); // Log the error to the console
//         }
//     });
// }

// // The function to ask a new question
// function askNewQuestion() {
//     // Display the score for this question and the average score so far
//     $("#score").html(`Your score for this question: ${questionScore}<br>Your average score: ${totalScore / questionNumber}`);

//     // Increment the question number and reset the question score
//     questionNumber++;
//     questionScore = 0;
    
//     resetDOMElements();
// }

// // The function to reset the DOM elements

// function resetDOMElements() {
//     // Display the new question number
//     $("#question-number").html(`Question ${questionNumber}`);
    
//     // Clear the question and probability fields
//     $("#question").val("");
//     $("#probability").val("");
    
//     // Reset the model response displays and the probability and slider values
//     $(".model-response").html("???");
//     $(".probability").val(50);
//     $(".slider").val(50);
    
//     // Hide the correctness check
//     $(".correctness").hide();
    
//     // Clear the correctness radio button selections
//     $("input[name='correctness']:checked").prop('checked', false);
    
//     // Enable the probability inputs and sliders
//     $(".probability").prop('disabled', false);
//     $(".slider").prop('disabled', false);

//     // Reset the model response displays
//     $(".model-response").html("???");

//     // Clear the correctness radio button selections
//     $("input[type='radio']:checked").prop('checked', false);

//     // Hide the calculate score button
//     $("#score-btn").hide();

//     // Show the submit button
//     $("#submit").show();
// }

// // The function to add DOM elements

// function addDOMElements() {
//     // Create the model divs for each model and add them to model_displays
//     let i = 0;
//     for (let model in models) {
//         let model_div = `<div class="model-div">
            
//             <p>${model}: <span class="model-response">???</span><span class="loader">(loading new response, please wait)</span></p> 
//             <div class="input_wrapper">
//                 <input type="range" min="1" max="100" value="50" class="slider"><input type="number" class="probability" min="0" max="100" value="50"/>
//             </div>
//             <div class="correctness">
//                 <p>Was the answer correct?</p>

//                 <div class="radio_btn_container">
//                     <input type="radio" class="yes" name="correctness_${i}" value="true" id="yes_${i}">
//                     <label for="yes_${i}">Yes</label>
//                 </div>
//                 <div class="radio_btn_container">
//                     <input type="radio" class="no" name="correctness_${i}" value="false" id="no_${i}">
//                     <label for="no_${i}">No</label>
//                 </div>
//             </div>
//         </div>`;

//         i++;
//         model_displays += model_div;
//     }

//     // Display the model divs in the HTML
//     $("#model-displays").html(model_displays);

// }

// function submitQuestion () {
//     // Validate the submission
//     if (!validateSubmission()) {
//         return;
//     }

//     // Get the question
//     let question = $("#question").val();

//     // For each model, get a response
//     let i = 0;
//     for (let model in models) {
//         $(".loader").eq(i).show();

//         // Clear the previous response
//         $(".model-response").eq(i).html("");

//         getModelResponse(question, model, i);
//         i++;
//     }

//     // Remove the red border from any field
//     $("*").removeClass("invalid");

//     // Show the correctness check
//     $("#correctness").show();

//     // Hide the submit button
//     $("#submit").hide();

//     // Show the score button
//     $("#score-btn").show();
// }

// script.js

// Initialize the total score, question number, and question score to zero
let totalScore = 0;
let questionNumber = 1;
let questionScore = 0;

// Create an object to hold the names of all the models
const models = {
    "GPT-1": "gpt-1",
    "GPT-2": "gpt-2",
    "GPT-3": "gpt-3",
    "GPT-4": "gpt-4",
}

// When the document is ready
$(document).ready(function() {
    addDOMElements();
    resetDOMElements();

    // When the score button is clicked
    $("#score-btn").click(clickScoreBtn);

    // When the probability or slider changes
    $(".probability,.slider").change(syncProbabilityAndSlider);

    // When the submit button is clicked
    $("#submit").click(submitQuestion);
});

// Calculate the score based on the predicted probability and whether the answer is correct
function calculateScore(predictedProbability, isCorrect) {
    let prob = predictedProbability / 100;
    let flippedProb = isCorrect ? prob : 1 - prob;
    let score = (Math.log2(flippedProb) + 0.5) * 100; // Add 0.5 to the score to make it more intuitive (ie you get 0 points for 50% probability)
    return score;
}

// Validate the submission
function validateSubmission() {
    let question = $("#question").val();

    if (question === "") {
        // Highlight the question field in red if it is empty
        $("#question").addClass("invalid");
        return false;
    }

    return true;
}

// The function to get a response from a specified model
function getModelResponse(question, model, i) {
    // Create an AJAX request
    $.ajax({
        url: '/generate', // The URL to which we will send the request
        data: JSON.stringify({ 'prompt': question, 'model': model }), // The data to send in the request
        contentType: 'application/json;charset=UTF-8', // The content type of the data being sent
        type : 'POST', // The type of request being made
        success: function(response) { // The function to execute upon a successful response
            console.log(response); // Log the response to the console
            $(".model-response").eq(i).html(response); // Display the response in the corresponding model-response element
            $(".correctness").eq(i).show(); // Show the corresponding correctness check
            $(".loader").eq(i).hide(); // Hide the corresponding loader

            // Disable the corresponding slider and probability input
            $(".probability").eq(i).prop('disabled', true);
            $(".slider").eq(i).prop('disabled', true);
        },
        error: function(error) { // The function to execute if there's an error
            console.log(error); // Log the error to the console

            $(".model-response").eq(i).html("It seems like this model is having some issues right now. Sorry.") // Display the error in the corresponding model-response element
                .addClass("invalid"); // Highlight the model-response element in red
        }
    });
}

// The function to ask a new question
function askNewQuestion() {

    // Update the user's score based on the true value for each model
    $(".correctness").each(function() {
        // When the correctness div changes, calculate the new score and add it to the total and question scores
        let predictedProbability = $(this).siblings(".input_wrapper").children(".probability").val();
        let isCorrect = $(this).find("input[name='correctness']:checked").val() === "true";
        let score = calculateScore(predictedProbability, isCorrect);

        let numModels = Object.keys(models).length;

        totalScore += score / numModels;
        questionScore += score / numModels;
    });

    // Display the score for this question and the average score so far
    $("#score").html(`Your score for this question: ${questionScore}<br>Your average score: ${totalScore / questionNumber}`);

    // Increment the question number and reset the question score
    questionNumber++;
    questionScore = 0;
    
    resetDOMElements();
}

// The function to reset the DOM elements

function resetDOMElements() {
    // Display the new question number
    $("#question-number").html(`Question ${questionNumber}`);
    
    // Clear the question and probability fields
    $("#question").val("");
    $("#probability").val("");
    
    // Reset the model response displays and the probability and slider values
    $(".model-response").html("???");
    $(".probability").val(50);
    $(".slider").val(50);
    
    // Hide the correctness check
    $(".correctness").hide();
    
    // Clear the correctness radio button selections
    $("input[name='correctness']:checked").prop('checked', false);
    
    // Enable the probability inputs and sliders
    $(".probability").prop('disabled', false);
    $(".slider").prop('disabled', false);

    // Reset the model response displays
    $(".model-response").html("???");

    // Clear the correctness radio button selections
    $("input[type='radio']:checked").prop('checked', false);

    // Hide the calculate score button
    $("#score-btn").hide();

    // Show the submit button
    $("#submit").show();

    // Hide the loader
    $(".loader").hide();
}

// The function to add DOM elements

function addDOMElements() {
    // Create the model divs for each model and add them to modelDisplays
    let i = 0;
    let modelDisplays = "";
    for (let model in models) {
        let model_div = `<div class="model-div">
            
            <p>${model}: <span class="model-response">???</span><span class="loader">(loading new response, please wait)</span></p> 
            <div class="input_wrapper">
                <input type="range" min="1" max="100" value="50" class="slider"><input type="number" class="probability" min="0" max="100" value="50"/>
            </div>
            <div class="correctness">
                <p>Was the answer correct?</p>

                <div class="radio_btn_container">
                    <input type="radio" class="yes" name="correctness_${i}" value="true" id="yes_${i}">
                    <label for="yes_${i}">Yes</label>
                </div>
                <div class="radio_btn_container">
                    <input type="radio" class="no" name="correctness_${i}" value="false" id="no_${i}">
                    <label for="no_${i}">No</label>
                </div>
            </div>
        </div>`;

        i++;
        modelDisplays += model_div;
    }

    // Display the model divs in the HTML
    $("#model-displays").html(modelDisplays);

}

function submitQuestion() {
    // Validate the submission
    if (!validateSubmission()) {
        return;
    }

    // Get the question
    let question = $("#question").val();

    // For each model, get a response
    let i = 0;
    for (let model in models) {
        $(".loader").eq(i).show();

        // Clear the previous response
        $(".model-response").eq(i).html("");

        getModelResponse(question, model, i);
        i++;
    }

    // Remove the red border from any field
    $("*").removeClass("invalid");

    // Show the correctness check
    $("#correctness").show();

    // Hide the submit button
    $("#submit").hide();

    // Show the score button
    $("#score-btn").show();
}

function clickScoreBtn() {
    // Check if the user has indicated whether the answer is correct for all models
    let allCorrectnessChecked = true;
    $(".correctness").each(function() {
        if ($(this).find("input[type='radio']:checked").val() === undefined) {
            allCorrectnessChecked = false;
        }
    }
    );

    // If all correctness indicators have been checked, ask a new question
    if (allCorrectnessChecked) {
        askNewQuestion();
    } else {
        // If not all correctness indicators have been checked, show an alert
        alert("Please select whether the answer was correct or not for all models.");
        // Highlight the unchecked radio buttons in red
        $(".correctness").each(function() {
            if ($(this).find("input[type='radio']:checked").val() === undefined) {
                $(this).addClass("invalid");
            }
        }
        );
    }
} 

function syncProbabilityAndSlider() {
    // Get the slider and probability elements and the value
    let $slider = $(this).siblings(".slider");
    let $probability = $(this).siblings(".probability");
    let value = $(this).val();

    // Ensure the value is within the bounds of 0 and 100
    const SMALL_PROBABILITY = 0.0001;
    if (value <= 0) {
        value = SMALL_PROBABILITY;
    } else if (value >= 100) {
        value = 100 - SMALL_PROBABILITY;
    }

    // Update the slider, probability, and this element with the new value
    $slider.val(value);
    $probability.val(value);
    $(this).val(value); // To make sure the value is updated in case it was out of bounds.

}