document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const uploadedImage = document.getElementById("uploaded-image");
  const uploadInput = document.getElementById("upload-input");
  const captureBtn = document.getElementById("capture-btn");
  const resetBtn = document.getElementById("reset-btn");
  const flipBtn = document.getElementById("flip-btn");

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
          video.srcObject = stream;
          video.classList.add("active");
      } catch (error) {
          console.error('Error accessing the camera: ', error);
      }
  }

  // Handle image upload
  uploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = () => {
              uploadedImage.src = reader.result;
              uploadedImage.classList.add("active");
              video.classList.remove("active");
              downloadImage(reader.result, 'uploaded-image.jpg');
          };
          reader.readAsDataURL(file);
      }
  });

  // Capture photo from video
  captureBtn.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg");
      uploadedImage.src = dataUrl;
      uploadedImage.classList.add("active");
      video.classList.remove("active");

      // Automatically download the captured image
      downloadImage(dataUrl, 'captured-image.jpg');
  });

  // Reset to video stream
  resetBtn.addEventListener("click", () => {
      uploadedImage.classList.remove("active");
      video.classList.add("active");
      uploadInput.value = ''; // Clear the file input value
  });

  // Flip camera
  flipBtn.addEventListener("click", () => {
      useFrontCamera = !useFrontCamera;
      startCamera();
  });

  // Function to download an image
  function downloadImage(dataUrl, filename) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  startCamera();
});
