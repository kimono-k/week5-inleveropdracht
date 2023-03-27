const video = document.getElementById("video");
// Knn variables
const k = 40;
const knn = new kNear(k);

const bananaButton = document.getElementById("banana-expression");
const angryButton = document.getElementById("angry-expression");
const disgustedButton = document.getElementById("disgusted-expression");
const happyButton = document.getElementById("happy-expression");
const neutralButton = document.getElementById("neutral-expression");
const sadButton = document.getElementById("sad-expression");
const surprisedButton = document.getElementById("surprised-expression");
const boredButton = document.getElementById("bored-expression");
const anxiousButton = document.getElementById("anxious-expression");
const jealousButton = document.getElementById("jealous-expression");

const predictionButton = document.getElementById("prediction");
const predictionResult = document.getElementById("prediction-result");

// De sicke beats
let rick = new Audio('songs/rick.mp3');
let elevatorMusic = new Audio("songs/elevatormusic.mp3");

// Array for position x and y iteration
let expressionsCollection = [];

/** Loads the models and gives data to startvideo */
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("../week5-inleveropdracht/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../week5-inleveropdracht/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri(
    "../week5-inleveropdracht/models"),
]).then(startVideo);

/**
 * Boots up the webcam
 */
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  const leukeInterval = setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()

      console.log(detections);
    
      clearInterval(leukeInterval);

      // toon de hele array in een log. gebruik deze data voor KNN
      for (let i = 0; i < 20; i++) {
        expressionsCollection.push(detections[0].landmarks.positions[i].x);  
        expressionsCollection.push(detections[0].landmarks.positions[i].y); 
        console.log(expressionsCollection); 
      };
  }, 10000);
});

/**
 * Deze functies wil ik refactoren, er komt een herhalend patroon hierin voor
 * Hoe maak je hier een elegante oplossing voor, want dit is prut.
 */
function bananaExpression() {
  knn.learn(expressionsCollection, "banana");
}

function angryExpression() {
  knn.learn(expressionsCollection, "angry");
}

function disgustedExpression() {
  knn.learn(expressionsCollection, "disgusted");
}

function happyExpression() {
  knn.learn(expressionsCollection, "happy");
}

function neutralExpression() {
  knn.learn(expressionsCollection, "neutral");
}

function sadExpression() {
  knn.learn(expressionsCollection, "sad");
}

function surprisedExpression() {
  knn.learn(expressionsCollection, "surprised");
}

function boredExpression() {
  knn.learn(expressionsCollection, "bored");
}

function anxiousExpression() {
  knn.learn(expressionsCollection, "anxious");
}

function jealousExpression() {
  knn.learn(expressionsCollection, "jealous");
}

function predictExpression() {
  // predicting
  let prediction = knn.classify(expressionsCollection);
  
  if (prediction === "happy") {
    elevatorMusic?.pause();
    rick.play();
  }

  if (prediction === "neutral") {
    rick.pause();
    elevatorMusic?.play();
  }

  predictionResult.innerHTML = `I think you are ${prediction}!`;
}

bananaButton.addEventListener("click", () => bananaExpression());
angryButton.addEventListener("click", () =>  angryExpression());
disgustedButton.addEventListener("click", () => disgustedExpression());
happyButton.addEventListener("click", () => happyExpression());
neutralButton.addEventListener("click", () => neutralExpression());
sadButton.addEventListener("click", () => sadExpression());
surprisedButton.addEventListener("click", () => surprisedExpression());
boredButton.addEventListener("click", () => boredExpression());
anxiousButton.addEventListener("click", () => anxiousExpression());
jealousButton.addEventListener("click", () => jealousExpression());

predictionButton.addEventListener("click", () => predictExpression());
