import fetch from 'node-fetch';

const URL = 'https://spacescavanger.onrender.com'
const API_URL = 'https://api.le-systeme-solaire.net/rest/'
const EMAIL = 'maxleandeb@uia.no'

async function start() {
    const response = await fetch(`${URL}/start?player=${EMAIL}`);
    const data = await response.json();
    console.log('Start game:', data);
    return data;
}

async function getSolarData(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`)
    const data = await response.json();
    return data;
}

async function submitAnswer(answer) {
    console.log('Submitting answer:', answer);
    const response = await fetch(`${URL}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            answer: answer, 
            player: EMAIL 
        })
    });
    
    const result = await response.json();
    console.log('Response:', result);
    return result;
}

async function main() {
    await start(); 
    const pin = 834;
    console.log('PIN (difference between the equaRadius & meanRadius):', pin);
    const secondChallenge = await submitAnswer(pin);
    console.log('Second challenge:', secondChallenge);
}
main();