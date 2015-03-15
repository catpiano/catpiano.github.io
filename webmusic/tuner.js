

var downwardSeries = Array.apply(0, Array(9)).map(function (x, y) { return y + 1; })
var downwardPitches = downwardSeries.map(function(number) {
    return 440 / Math.pow(2, number/12)
}).reverse()

var upwardSeries = Array.apply(0, Array(3)).map(function (x, y) { return y + 1; })
var upwardPitches = upwardSeries.map(function(number) {
    return 440 * Math.pow(2, number/12)
})

var oneOctave = downwardPitches.concat(440).concat(upwardPitches)




var context;
//window.addEventListener('load', init, false);
function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
    //context.createBufferSource().start(0)
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
        console.log("oscillator created.")
    }
    return oscillator;
}

function terminateOscillator() {
    getOscillator().stop(0);
    oscillator = undefined;
    sounding = false;
    console.log("oscillator terminated.")
}


// public
function play() {

    oscillator = getOscillator();
    if (oscillator == null) {
        console.log("now loading.");
        return;
    }

    if (sounding) {
        console.log("still sounding.");
        return;
    }


    // Create a volume (gain) node
    var gainNode = context.createGain();
    gainNode.gain.value = 0.1;

    oscillator.frequency.value = convertStep2Pitch(pitchStep);


    oscillator.connect(context.destination);
    oscillator.start(0)

    sounding = true;
}

function stop() {
    if (!sounding) {
      console.log("No sound yet.");
      return;
    }
    terminateOscillator();
}

function changePitch(pitchStep) {
    if (sounding == false) {
      console.log("No sound yet.");
      return;
    }


    oscillator = getOscillator();
    if (oscillator == null) {
        console.log("now loading.");
        return;
    }

    var pitch = convertStep2Pitch(pitchStep)
    // display
    document.getElementById("currentHz").innerHTML = (Math.round(pitch * 100) / 100).toPrecision(5)
    oscillator.frequency.value = pitch;

}

function convertStep2Pitch(pitchStep) {
    return oneOctave[pitchStep - 1]
}


// ==== BootStrap Slider
//https://github.com/seiyria/bootstrap-slider
//http://www.eyecon.ro/bootstrap-slider/

// Without JQuery
var slider = new Slider("#pitch", {
    tooltip: 'hide',
    ticks: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    ticks_labels: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B', 'C'],
    ticks_snap_bounds: 1,
    value: 10
});

// 440 Hz
var pitchStep = 10;

slider.on('slideStart', function(ev){
    console.log("started to change step=" + pitchStep)
    pitchStep = slider.getValue();
    changePitch(pitchStep)
});
slider.on('slide', function(ev){
    console.log("changing step=" + pitchStep)
    pitchStep = slider.getValue();
    changePitch(pitchStep)
});
slider.on('slideStop', function(ev){
    console.log("stopped changing step=" + pitchStep)
    pitchStep = slider.getValue();
    changePitch(pitchStep)
});

