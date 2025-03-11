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

    console.log("Rotation periods:");
    for (const planet of planets) {
        console.log(`${planet.englishName}: rotation period = ${planet.sideralRotation} hours`);
    }
    
    const answer3 = "Jupiter";
    console.log(`Planet with shortest day: ${answer3}`);
    const fourthChallengeData = await submitAnswer(answer3);

    console.log('Challenge 4:', fourthChallengeData.nextChallenge);
    const jupiterData = await getSolarData('bodies/jupiter');
    console.log("Jupiter data:", jupiterData);
    const moonCount = jupiterData.moons ? jupiterData.moons.length : 0;

    console.log(`Jupiter has ${moonCount} moons`);
    const answer4 = moonCount.toString();
    const fifthChallengeData = await submitAnswer(answer4);

    console.log('Challenge 5:', fifthChallengeData.nextChallenge);
    const allMoons = await getSolarData('bodies?filter[]=aroundPlanet,eq,jupiter');
    console.log("Jupiter's moons and their sizes:");
    let largestMoon = null;
    let largestRadius = 0;
    
    for (const moon of allMoons.bodies) {
        if (moon.meanRadius) {
            console.log(`${moon.englishName}: Mean Radius = ${moon.meanRadius} km`);
            if (moon.meanRadius > largestRadius) {
                largestRadius = moon.meanRadius;
                largestMoon = moon;
            }
        }
    }
    console.log(`Jupiter's largest moon: ${largestMoon ? largestMoon.englishName : 'Not found'}`);
    const answer5 = largestMoon ? largestMoon.englishName : "";
    const sixthChallengeData = await submitAnswer(answer5);

        const plutoData = await getSolarData('bodies/pluton');
        console.log("Pluto data:", plutoData);
        console.log(`Pluto's classification: ${plutoData.bodyType}`);
        
        const answer6 = plutoData.bodyType;
        const skeletonKey = await submitAnswer(answer6);
}

main();