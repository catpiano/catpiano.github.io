

// pitch series
Math.pow(2, 1/12)
//1.0594630943592953

440/Math.pow(2, 9/12)
//261.6255653005986

Array.apply(0, Array(9)).map(function (x, y) { return y + 1; });
//[1, 2, 3, 4, 5, 6, 7, 8, 9]

var downwardSeries = Array.apply(0, Array(9)).map(function (x, y) { return y + 1; })
var downwardPitches = downSeries.map(function(number) {
    return 440 / Math.pow(2, number/12)
}).reverse()

var upwardSeries = Array.apply(0, Array(3)).map(function (x, y) { return y + 1; })
var upwardPitches = upwardSeries.map(function(number) {
    return 440 * Math.pow(2, number/12)
})

var oneOctave = downwardPitches.concat(440).concat(upwardPitches)
//[261.6255653005986, 277.18263097687213, 293.6647679174076, 311.12698372208087, 329.6275569128699, 349.2282314330039, 369.9944227116344, 391.99543598174927, 415.3046975799451, 440, 466.1637615180899, 493.8833012561241, 523.2511306011972]


