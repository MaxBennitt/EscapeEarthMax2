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
    console.log('PIN:', pin);

    const secondChallengeData = await submitAnswer(pin);
    const earthData = await getSolarData('bodies/terre');
    console.log("Earth's axial tilt:", earthData.axialTilt);
    const allBodies = await getSolarData('bodies');
    const planets = allBodies.bodies.filter(body => body.isPlanet);
    
    for (const planet of planets) {
        if (planet.axialTilt !== undefined) {
            console.log(`${planet.englishName}: axial tilt = ${planet.axialTilt}`);
        }
    }
    const answer2 = "Mars";
    console.log(`Closest planet: ${answer2}`);
    const thirdChallengeData = await submitAnswer(answer2);
    console.log('Third challenge:', thirdChallengeData.nextChallenge);
}

main();