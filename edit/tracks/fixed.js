const Shotstack = require('shotstack-sdk');
const heading = require('./clips/heading');
const label = require('./clips/label');
const placeholder = require('./clips/placeholder');

module.exports = (country, videoLength, videoTopLength, frameLength) => {
    const countryClip = heading(country, videoLength, 'medium', 'top', 0, 0.4);
    const covidClip = heading('CORONAVIRUS (COVID-19) PANDEMIC', videoLength, 'x-small', 'top', 0, 0.1);

    const casesLabelClip = label(videoLength, videoTopLength, frameLength, 'CONFIRMED CASES', 0, 1);
    const casesPlaceholderClip = placeholder('0', videoTopLength, frameLength, 0, 0.5);

    const deathsLabelClip = label(videoLength, videoTopLength, frameLength, 'DEATHS', 0, -0.4);
    const deathsPlaceholderClip = placeholder('0', videoTopLength, frameLength, 0, -0.9);

    let fixedTextTrack = new Shotstack.Track;
    fixedTextTrack
        .setClips([
            countryClip,
            covidClip,
            casesLabelClip,
            deathsLabelClip,
            casesPlaceholderClip,
            deathsPlaceholderClip
        ]);

    return fixedTextTrack;
}
