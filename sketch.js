// People Sound
// Arleth Vega

// declare global variables
let mic;
let fft;
let tx, ty;
let fr = 10;
let radius;

function setup() {
  // set width and height to full screen
  createCanvas(windowWidth, windowHeight);

  // we make the radius of the topology constant between devices
  if (width < height) {
    radius = width / 8;
  } else {
    radius = height / 8;
  }

  // set the frame rate
  frameRate(fr);
  // change the angle mode from radians to degrees
  angleMode(DEGREES);

  // background, initial color and initial position
  background(10);
  fill(random(255), random(255), random(255), 255 / (fr * 2));
  strokeWeight(1);
  stroke(255, 100);
  tx = random(radius * 2, width - radius * 2);
  ty = random(radius * 2, height - radius * 2);

  // create and start audio input
  mic = new p5.AudioIn();
  mic.start();

  // create fft analyzer and set mic as input
  // the parameters in p5.FFT set the smoothing and the frequency bands
  fft = new p5.FFT(0.9, 128);
  fft.setInput(mic);

  // some browsers don't start the audio without this function
  userStartAudio();
}

function draw() {
  // fft.analyze gives you the amplitude for each frequency in the spectrum
  // default is 1024 bands
  let spectrum = fft.analyze();

  // translate the topology to the x and y coordinates
  translate(tx, ty);

  // begin to draw a shape
  beginShape();
  // we select the 3rd quarter of the bands to make smoother circles
  for (
    i = spectrum.length / 2;
    i < spectrum.length - spectrum.length / 4;
    i++
  ) {
    // we map the spectrum to each degree from a circle
    let angle = map(
      i,
      spectrum.length / 2,
      spectrum.length - spectrum.length / 4 - 1,
      0,
      360
    );
    let amp = spectrum[i];
    // we map the frquencies of a space into a circle
    let r = map(amp, 0, 255, radius, radius * 4);
    let x = r * sin(angle);
    let y = r * cos(angle);
    vertex(x, y);
  }
  endShape();

  // every 2 seconds change color and move the position of the topology
  if (frameCount % (fr * 2) == 0) {
    tx = random(radius * 2, width - radius * 2);
    ty = random(radius * 2, height - radius * 2);
    fill(random(255), random(255), random(255), 255 / (fr * 2));
  }
  // every 20 seconds reset the count of topologies
  if (frameCount % (fr * 20) == 0) {
    background(0);
  }
}
