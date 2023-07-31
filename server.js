require('dotenv').config();
const path = require('path');

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'static')))


const openaiApiKey = process.env.OPENAI_API_KEY;
const huggingfaceToken = process.env.HUGGINGFACE_TOKEN;

const API_URL_BASE = "https://api-inference.huggingface.co/models/";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);




function generateHuggingfaceText(model, prompt) {
    const fullPrompt = `Test answer key:\nQuestion: ${prompt}\nAnswer:`;
    const data = {inputs: fullPrompt, parameters: {return_full_text: false}};
    try {
        axios.post(API_URL_BASE + model, data, {
            headers: {'Authorization': `Bearer ${huggingfaceToken}`}
        });
    } catch (error) {
        console.error(error)
    }
        
}

const models = {
    "GPT-1": (prompt) => generateHuggingfaceText("openai-gpt", prompt),
    "GPT-2": (prompt) => generateHuggingfaceText("gpt2-xl", prompt),
    "GPT-3": (prompt) => generateOpenaiText("gpt-3.5-turbo", prompt),
    "GPT-4": (prompt) => generateOpenaiText("gpt-4", prompt)
};

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/dataset', (req, res) => {
    res.render('dataset_qs');
});

app.get('/custom', (req, res) => {
    res.render('custom_qs');
});


app.post('/generate', async (req, res) => {
    const { prompt, model: modelName } = req.body;
    // Set a default model name if none is provided

    console.log(modelName)
    const generateText = models[modelName];  // This gets you the function to generate text
    

    try {

        const chatCompletion = await generateText(prompt);


        // Check if the response has valid data
        const hasValidData = chatCompletion.data && chatCompletion.data.choices && chatCompletion.data.choices.length > 0;

        if (!hasValidData) {
            console.error('Unexpected response:', chatCompletion.data);
            return res.status(500).send('Unexpected response from model');
        }

        const content = chatCompletion.data.choices[0].message.content;
        console.log(content);
        return res.send(content);

    } 
    catch (error) {
        console.error('Error:', error);
        //res.status(500).send('Error in generating text');
    }
});


app.get('/testOAI', async (req, res) => {
    // const prompt = req.body.prompt;
    try {
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: "Hello, World!"}]
        });
        // res.json(chatCompletion.data.choices[0].message);
        console.log(chatCompletion.data.choices[0].message.content)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while generating text');
    }
});

async function generateOpenaiText(model, prompt) {
    console.log("generateOpenaiText",model)
    const chatCompletion = await openai.createChatCompletion({
        model: model,
        messages: [{role: "user", content: prompt}],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    });
    return chatCompletion;
}

app.listen(3000, () => console.log('Server started on port 3000'));
