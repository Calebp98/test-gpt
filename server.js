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

function generateOpenaiText(model, prompt) {
    const data = {
        model: model,
        messages: [{"role": "user", "content": prompt}],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    };
    return axios.post(`https://api.openai.com/v1/engines/${model}/completions`, data, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
        }
    });
}

function generateHuggingfaceText(model, prompt) {
    const fullPrompt = `Test answer key:\nQuestion: ${prompt}\nAnswer:`;
    const data = {inputs: fullPrompt, parameters: {return_full_text: false}};
    return axios.post(API_URL_BASE + model, data, {
        headers: {'Authorization': `Bearer ${huggingfaceToken}`}
    });
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

app.post('/generate', (req, res) => {
    const prompt = req.body.prompt;
    const modelName = req.body.model;
    const callModel = models[modelName];
    callModel(prompt).then(response => {
        console.log(response.data.choices[0].message.content);
        res.send(response.data.choices[0].message.content);
    }).catch(error => console.error('Error:', error));
});

app.listen(3000, () => console.log('Server started on port 3000'));
