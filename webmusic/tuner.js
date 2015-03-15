

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

    var pitch = oneOctave[pitchStep - 1]
    // display
    document.getElementById("currentHz").innerHTML = (Math.round(pitch * 100) / 100).toPrecision(5)
    oscillator.frequency.value = pitch;

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
    tooltip: 'hide',
    ticks: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    ticks_labels: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B', 'C'],
    ticks_snap_bounds: 1,
    value: 9
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

