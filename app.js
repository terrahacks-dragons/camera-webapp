const videoElement = document.getElementById('video');
const captureButton = document.getElementById('capture');
const flipCameraButton = document.getElementById('flipCamera');
const canvas = document.getElementById('canvas');
const downloadLink = document.getElementById('downloadLink');
const capturedImage = document.getElementById('capturedImage');
const context = canvas.getContext('2d');

let currentStream;
let useFrontCamera = true;

async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
        video: {
            facingMode: useFrontCamera ? 'user' : 'environment'
        }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = stream;
        videoElement.srcObject = stream;
    } catch (error) {
        console.error('Error accessing the camera: ', error);
    }
}

function capturePhoto() {
    // Set canvas dimensions to video dimensions
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw the video frame to the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image to a data URL
    const imageDataUrl = canvas.toDataURL('image/png');

    // Replace the video with the captured image
    videoElement.style.display = 'none';
    capturedImage.src = imageDataUrl;
    capturedImage.style.display = 'block';

    // Set the download link with the image data URL
    downloadLink.href = imageDataUrl;
    downloadLink.download = 'captured-image.png';
    downloadLink.style.display = 'block';
    downloadLink.click(); // Automatically trigger the download
}

// Event listener for the capture button
captureButton.addEventListener('click', capturePhoto);

// Event listener for the spacebar key press
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        capturePhoto();
    }
});

// Event listener for the flip camera button
flipCameraButton.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

startCamera();
