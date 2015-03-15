

var standardPitch = document.querySelector("#standardPitch")

function generateSeries(standardPitch, ext) {

    var downwardSeries = Array.apply(0, Array(9 + 12 * ext)).map(function (x, y) { return y + 1; })
    var downwardPitches = downwardSeries.map(function(number) {
        return standardPitch / Math.pow(2, number/12)
    }).reverse()

    var upwardSeries = Array.apply(0, Array(3 + 12 * ext)).map(function (x, y) { return y + 1; })
    var upwardPitches = upwardSeries.map(function(number) {
        return standardPitch * Math.pow(2, number/12)
    })

    var oneOctave = downwardPitches.concat(standardPitch).concat(upwardPitches)
    return oneOctave
}

var oneOctave = generateSeries(standardPitch.value, 0)
var threeOctaves = generateSeries(standardPitch.value, 1)

standardPitch.addEventListener('change', function(e) {
    oneOctave = generateSeries(e.target.value, 0)
    threeOctaves = generateSeries(e.target.value, 1)
})


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

var oscillators = []
//var oscillator
var soundings = []
//var sounding = false

// private
function getOscillator(group) {
    if (context == undefined) {
        console.log("now loading.")
        return null
    }

    var oscillator = oscillators[group]

    if (oscillator == undefined || oscillator == null) {
        oscillator = context.createOscillator();
        console.log("oscillator created.")
    }
    oscillators[group] = oscillator

    return oscillator
}

function terminateOscillator(group) {
    getOscillator(group).stop(0);
    oscillators[group] = undefined;
    soundings[group] = false;
    console.log("oscillator terminated.")
}


// public
function play(e) {

    var group = e.getAttribute("group")

    oscillator = getOscillator(group);
    if (oscillator == null) {
        console.log("now loading.");
        return;
    }

    var sounding = soundings[group]
    if (sounding) {
        console.log("still sounding.");
        return;
    }


    // Create a volume (gain) node
    var gainNode = context.createGain();
    gainNode.gain.value = 0.1;

    var pitchStep = sliders[group].getValue();
    oscillator.frequency.value = convertStep2Pitch(group, pitchStep);


    oscillator.connect(context.destination);
    oscillator.start(0)

    sounding = true
    soundings[group] = sounding
}

function stop(e) {

  var group = e.getAttribute("group")

    if (!soundings[group]) {
      console.log("No sound yet.");
      return;
    }
    terminateOscillator(group);
}

function changePitch(group, pitchStep) {
    var sounding = soundings[group]
    if (sounding == undefined || sounding == false) {
      console.log("No sound yet.");
      return;
    }

    var oscillator = getOscillator(group);
    if (oscillator == null) {
        console.log("now loading.");
        return;
    }

    var pitch = convertStep2Pitch(group, pitchStep)
    // display
    document.getElementById("currentHz-" + group).innerHTML = (Math.round(pitch * 100) / 100).toPrecision(5)
    oscillator.frequency.value = pitch;

}

function convertStep2Pitch(group, pitchStep) {
    var octave = octaves[group]
    return octave[pitchStep - 1]
}


// ==== BootStrap Slider
//https://github.com/seiyria/bootstrap-slider
//http://www.eyecon.ro/bootstrap-slider/

// Without JQuery

var sliders = []
sliders["a"] = new Slider("#pitch-a", {
    tooltip: 'hide',
    ticks: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    ticks_labels: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B', 'C'],
    ticks_snap_bounds: 1,
    value: 10
});
sliders["b"] = new Slider("#pitch-b", {
    tooltip: 'hide',
    ticks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],
    ticks_labels: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B', 'C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B', 'C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B', 'C'],
    ticks_snap_bounds: 1,
    value: 10
});
sliders["c"] = new Slider("#pitch-c", {
    tooltip: 'hide',
    ticks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],
    ticks_labels: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B', 'C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B', 'C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B', 'C'],
    ticks_snap_bounds: 1,
    value: 10
});

var octaves = []
octaves["a"] = oneOctave
octaves["b"] = threeOctaves
octaves["c"] = threeOctaves

function setupSlider(group, slider) {

    // A/La
    var pitchStep = 10;

    slider.on('slideStart', function(ev){
        //var group = ev.getAttribute("group")
        //console.log("started to change group="+ group +"step=" + pitchStep)
        pitchStep = slider.getValue();
        changePitch(group, pitchStep)
    });
    slider.on('slide', function(ev){
        console.log(ev)
        //var group = ev.getAttribute("group")
        //console.log("started to change group="+ group +"step=" + pitchStep)
        pitchStep = slider.getValue();
        changePitch(group, pitchStep)
    });
    slider.on('slideStop', function(ev){
        //var group = ev.getAttribute("group")
        //console.log("started to change group="+ group +"step=" + pitchStep)
        pitchStep = slider.getValue();
        changePitch(group, pitchStep)
    });

}

for (var group in sliders){
  setupSlider(group, sliders[group])
}
