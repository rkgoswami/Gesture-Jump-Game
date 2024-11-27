const URL = 'https://teachablemachine.withgoogle.com/models/LJnx4yCAB/';
let model, webcam, ctxPose, labelContainer, maxPredictions;
let startModelBtn;

async function init() {
    // hide start model button
    startModelBtn = document.getElementById("startModelBtn");

    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // load the model and metadata
    // Refer to tmPose.loadFromFiles() in the API to support files from a file picker
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(360, 360, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    const canvas = document.getElementById('poseCanvas');
    canvas.width = 360; canvas.height = 360;
    ctxPose = canvas.getContext('2d');
    labelContainer = document.getElementById('label-container');
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement('div'));
    }

    startModelBtn.style.display = "none";
    //startModelBtn.disabled = true;
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const predictions = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
        predictions[i].className + ': ' + predictions[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    // finally draw the poses
    drawPose(pose);
    predictGesture(predictions);
}

async function predictGesture(predictions) {

  const jumpPrediction = predictions.find(p => p.className === 'Jump' && p.probability > 0.8);
  const duckPrediction = predictions.find(p => p.className === 'Duck' && p.probability > 0.8);

  if (jumpPrediction) {
    if (!dino.isJumping) {
      dino.dy = dino.jumpForce;
      dino.isJumping = true;
    }
  }

  if (duckPrediction) {
    dino.isDucking = true;
  } else {
    dino.isDucking = false;
  }
}

function drawPose(pose) {
    ctxPose.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctxPose);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctxPose);
    }
}