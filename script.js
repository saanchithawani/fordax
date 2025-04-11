console.log("JS file is connected!");

// 9 gate images: gate_01.jpg to gate_09.jpg
const gateImages = Array.from({ length: 9 }, (_, i) => `images/gate/gate_${String(i + 1).padStart(2, '0')}.jpg`);

// 15 door images: door_01.jpg to door_15.jpg
const doorImages = Array.from({ length: 15 }, (_, i) => `images/door/door_${String(i + 1).padStart(2, '0')}.jpg`);

let currentLabel = '';    // To keep track of the correct answer
let score = 0;
let totalAttempts = 0;

function loadRandomImage() {
    console.log("Inside loadRandomImage");

    // Randomly decide if it's a gate or door
    const isGate = Math.random() < 0.5;  // selects a number between 0 and 1 randomly and applies this condition

    const images = isGate ? gateImages : doorImages; // if true, gate images, if not, door images
    const label = isGate ? 'gate' : 'door'; // label assignment for the same

    // Pick a random image from the selected category
    const randomIndex = Math.floor(Math.random() * images.length); // number between 0 and 1, multiplied by length of array, then rounded off to closest whole
    const filename = images[randomIndex];

    console.log("Chosen image:", filename);

    const imageElement = document.getElementById('gameImage');

    // Remove fade-in class before setting new image
    imageElement.classList.remove('visible');

    // Set the new image
    imageElement.src = filename;

    // Wait for the image to load before fading in
    imageElement.onload = () => {
        imageElement.classList.add('visible');
    };

    currentLabel = label;
    document.getElementById('scoreDisplay').textContent = `Score: ${score} / ${totalAttempts}`;
}

window.onload = loadRandomImage;

function checkAnswer(userAnswer) {
    const feedback = document.getElementById('feedback');
    const buttons = document.querySelectorAll('.answer');

    // Disable buttons after answer
    buttons.forEach(btn => btn.disabled = true);

    // Reverse logic: only correct if user selects wrong label
    if (userAnswer !== currentLabel) {
        score += 1;
        feedback.textContent = "Correct!";
    } else {
        const correctLabel = currentLabel === 'gate' ? 'door' : 'gate';
        feedback.textContent = `Wrong! It is actually a ${correctLabel}.`;
    }

    totalAttempts += 1;
    document.getElementById('scoreDisplay').textContent = `Score: ${score} / ${totalAttempts}`;

    // If game is over, show popup and overlay
    if (totalAttempts === 5) {
        showPopup();
    } else {
        setTimeout(nextRound, 1500);
    }
}

function nextRound() {
    // Re-enable buttons for next round
    document.querySelectorAll('.answer').forEach(btn => btn.disabled = false);

    // Clear feedback text
    document.getElementById('feedback').textContent = "";

    // Load the next image
    loadRandomImage();
}

function showPopup() {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    document.getElementById('containerOverlay').classList.add('visible');

    document.getElementById('scoreDisplay').classList.add('dimmed-text');
    document.getElementById('feedback').classList.add('dimmed-text');

    // Update popup content and show it
    popupMessage.innerHTML = `<span class="game-over-title">Game Over</span><br>Your final score: ${score}/5`;
    popup.classList.remove('hidden');
    imageOverlay.classList.remove('hidden');
}

function closePopup() {
    // Hide popup and overlay, reset game state
    document.getElementById('popup').classList.add('hidden');
    document.getElementById('containerOverlay').classList.remove('visible');

    document.getElementById('scoreDisplay').classList.remove('dimmed-text');
    document.getElementById('feedback').classList.remove('dimmed-text');


    score = 0;
    totalAttempts = 0;
    document.getElementById('feedback').textContent = "";
    document.getElementById('scoreDisplay').textContent = "";

    document.querySelectorAll('.answer').forEach(btn => btn.disabled = false);

    loadRandomImage();
}
