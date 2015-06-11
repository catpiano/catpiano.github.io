
var context;
//window.addEventListener('load', init, false);
function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
    context.createBufferSource().start(0)
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}
init()

var oscillator;
var sounding = false;

// private
function getOscillator() {
    if (context == undefined) {
        console.log("now loading.");
        return null;
    }
    if (oscillator == null) {
        oscillator = context.createOscillator();
    }
    return oscillator;
}

function terminateOscillator() {
    getOscillator().stop(0);
    oscillator = undefined;
    sounding = false;
}


// public
function play() {

    oscillator = getOscillator();
    if (oscillator == null) {
        console.log("now loading.");
        return;
    }

    // Create a volume (gain) node
    var gainNode = context.createGain();
    gainNode.gain.value = 0.1;


    //var pitch = document.querySelector("#pitch")
    oscillator.frequency.value = pitchHz;

    if (sounding) {
        console.log("still sounding.");
        return;
    }

    oscillator.connect(context.destination);
//    currentTime = context.currentTime;
//    oscillator.start(currentTime);
    oscillator.start(0)
    //oscillator.stop(currentTime + 2); //stop after 2 second
    sounding = true;
}

function changePitch(pitch) {
    if (sounding == false) {
      console.log("No sound yet.");
      return;
    }


    oscillator = getOscillator();
    if (oscillator == null) {
        console.log("now loading.");
        return;
    }

    //var pitch = document.querySelector("#pitch")
    //console.log("pitch="+pitch)
    oscillator.frequency.value = pitch;
    //oscillator.start()

    // oscillator.connect(context.destination);
    // currentTime = context.currentTime;
    // oscillator.start(currentTime);
    // sounding = true;  
}

function stop() {
    if (sounding == false) {
      console.log("No sound yet.");
      return;
    }
    terminateOscillator();
}

// ==== BootStrap Slider
//https://github.com/seiyria/bootstrap-slider
//http://www.eyecon.ro/bootstrap-slider/

// Without JQuery
var slider = new Slider("#pitch", {
  tooltip: 'always',
  mode: 'logarithmic'
});

// $('#ex1').bootstrapSlider({
//   formatter: function(value) {
//     return 'Current value: ' + value;
//   }
// });


var pitchHz = 440;

slider.on('slideStart', function(ev){
    console.log("started to change hz=" + pitchHz)
    pitchHz = slider.getValue();
    changePitch(pitchHz)
});
slider.on('slide', function(ev){
    console.log("changing hz=" + pitchHz)
    pitchHz = slider.getValue();
    changePitch(pitchHz)
});
slider.on('slideStop', function(ev){
    console.log("stopped changing hz=" + pitchHz)
    pitchHz = slider.getValue();
    changePitch(pitchHz)
});

