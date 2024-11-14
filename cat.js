// script.js

// Get DOM elements
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const catMessage = document.getElementById('catMessage');
const audio = document.getElementById('backgroundMusic');

// Canvas center
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const scale = 10;

// Heart shape points
let currentIndex = 0;
const points = [];
for (let t = 0; t < 2 * Math.PI; t += 0.01) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    points.push({
        x: centerX + x * scale,
        y: centerY - y * scale
    });
}

// Heart image variables
const images = [];
const imagePaths = ['JSA1.png', 'JSA2.png', 'JSA3.png', 'JSA4.png'];
let currentImageIndex = 0;
let imageOpacity = 0;
let imagesLoaded = 0;

// Load heart images
imagePaths.forEach((path) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
        images.push(img);
        imagesLoaded++;
        if (imagesLoaded === imagePaths.length) {
            playButton.disabled = false;
        }
    };
});

// Snowfall variables
const stars = [];
function createSnowfall() {
    for (let i = 0; i < 100; i++) { // Increased to 100 for denser snowfall
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 1.5 + 1,
            size: Math.random() * 3 + 1,
        });
    }
}

function drawSnowfall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas

    stars.forEach((star, index) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.speedX;
        star.y += star.speedY;

        // Reset star position if it goes beyond the canvas
        if (star.y > canvas.height) {
            stars[index] = {
                x: Math.random() * canvas.width,
                y: 0,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 1.5 + 1,
                size: Math.random() * 3 + 1,
            };
        }
    });
}

// Heart outline drawing
function drawHeartOutline(scaleFactor) {
    ctx.strokeStyle = '#EB3678';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
        const scaledX = (points[i].x - centerX) * scaleFactor + centerX;
        const scaledY = (points[i].y - centerY) * scaleFactor + centerY;
        const nextScaledX = (points[i + 1].x - centerX) * scaleFactor + centerX;
        const nextScaledY = (points[i + 1].y - centerY) * scaleFactor + centerY;

        ctx.moveTo(scaledX, scaledY);
        ctx.lineTo(nextScaledX, nextScaledY);
    }
    ctx.stroke();
    ctx.closePath();
}

// Flower drawing variables
let flowerRotationAngle = 0; // Rotation angle for flowers

// Function to draw flowers around the heart
function drawFlowers() {
    const flowerColorSequence = [
        '#FF0000',  // Red
        '#FF7F7F',  // Light Red
        '#FFFFFF',  // White
        '#FFFF00',  // Yellow
    ];

    // Set flower color based on the current color index
    const flowerColor = flowerColorSequence[currentColorIndex % flowerColorSequence.length];

    for (let i = 0; i < 5; i++) {
        const flowerX = centerX - 50 + i * 25;
        const flowerY = centerY - 150;

        ctx.save(); // Save current canvas state
        ctx.translate(flowerX, flowerY); // Move origin to flower center
        ctx.rotate(flowerRotationAngle); // Apply rotation to the flower

        // Draw flower center
        ctx.fillStyle = flowerColor;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Draw petals
        for (let j = 0; j < 5; j++) {
            const angle = (j * 2 * Math.PI) / 5;
            const petalX = 15 * Math.cos(angle);
            const petalY = 15 * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(petalX, petalY, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore(); // Restore canvas state
    }

    flowerRotationAngle += 0.02; // Increment the rotation angle for continuous rotation
}

// Text drawing inside the heart
function drawTextInHeart() {
    ctx.font = "400 40px 'Courier New', Courier, monospace"; // Set a nice font for the text
    ctx.fillStyle = "white"; // Set text color
    ctx.textAlign = "center"; // Center align the text horizontally
    ctx.textBaseline = "middle"; // Center align the text vertically
    ctx.fillText("Adrian", centerX, centerY); // Draw text at the heart's center
}

// Image appearance variables
let currentImageIndexAppearance = 0; // To track current image for appearance
let imageOpacityAppearance = 0;

// Function to handle image appearance and background change
function startImageAppearance() {
    const fadeInterval = setInterval(() => {
        // Clear canvas but retain snowfall and other elements
        drawSnowfall();
        drawHeartOutline(1); // Draw heart without scaling
        drawFlowers();
        drawTextInHeart();

        // Draw current image with opacity
        if (images[currentImageIndexAppearance]) {
            ctx.save();
            ctx.globalAlpha = imageOpacityAppearance;
            ctx.drawImage(images[currentImageIndexAppearance], centerX - images[currentImageIndexAppearance].width / 2, centerY - images[currentImageIndexAppearance].height / 2);
            ctx.restore();
        }

        // Increment opacity
        if (imageOpacityAppearance < 1) {
            imageOpacityAppearance += 0.05;
        } else {
            clearInterval(fadeInterval);
            setTimeout(() => {
                currentImageIndexAppearance = (currentImageIndexAppearance + 1) % images.length;
                imageOpacityAppearance = 0;

                // Change background image to match current heart image
                document.body.style.backgroundImage = `url(${imagePaths[currentImageIndexAppearance]})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';

                startImageAppearance(); // Restart the appearance cycle
            }, 1000); // Wait for 1 second before changing the image
        }
    }, 50);
}

// Heartbeat animation variables
let heartbeatScaleFactor = 1;
let heartbeatGrowing = true;

// Function to animate the heart rate (scaling effect)
function animateHeartRate() {
    const heartbeatInterval = setInterval(() => {
        drawSnowfall();
        drawHeartOutline(heartbeatScaleFactor);
        drawFlowers();
        drawTextInHeart();

        // Control the scaling factor to create a heartbeat effect
        if (heartbeatGrowing) {
            heartbeatScaleFactor += 0.02;
            if (heartbeatScaleFactor >= 1.2) heartbeatGrowing = false;
        } else {
            heartbeatScaleFactor -= 0.02;
            if (heartbeatScaleFactor <= 1) heartbeatGrowing = true;
        }
    }, 100); // Adjust the interval for heartbeat speed
}

// Function to display the cat message and start the animation after a delay
function showCatMessageAndStartAnimation() {
    catMessage.style.display = 'block'; // Show the cat message

    setTimeout(() => {
        catMessage.style.display = 'none'; // Hide the cat message
        startAnimation(); // Start the main animation
    }, 3000); // Display the cat message for 3 seconds
}

// Main animation function
function startAnimation() {
    audio.play(); // Play background music
    playButton.style.display = 'none'; // Hide the play button

    createSnowfall(); // Initialize snowfall

    // Draw the heart outline incrementally
    let drawInterval = setInterval(() => {
        if (currentIndex < points.length - 1) {
            ctx.beginPath();
            ctx.moveTo(points[currentIndex].x, points[currentIndex].y);
            ctx.lineTo(points[currentIndex + 1].x, points[currentIndex + 1].y);
            ctx.strokeStyle = '#d32f2f';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
            currentIndex++;
        } else {
            clearInterval(drawInterval); // Stop drawing when done
            drawFlowers(); // Draw flowers around the heart
            drawTextInHeart(); // Draw text inside the heart
            startImageAppearance(); // Start changing background images
            setTimeout(() => {
                animateHeartRate(); // Start the heartbeat animation after a short delay
            }, 500);
        }
    }, 20); // Adjust the interval for drawing speed
}

// Event listener for the play button
playButton.addEventListener('click', showCatMessageAndStartAnimation);

// Optional: Disable the play button until images are loaded
playButton.disabled = true;

// Optional: Preload the cat image to ensure it's available when needed
const catImg = new Image();
catImg.src = 'cat.png';
catImg.onload = () => {
    console.log('Cat image loaded');
};
