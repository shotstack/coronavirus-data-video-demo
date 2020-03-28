const Shotstack = require('shotstack-sdk');
const heading = require('./clips/heading');
const label = require('./clips/label');
const placeholder = require('./clips/placeholder');

module.exports = (country, videoLength) => {
    const VIDEO_TOP_LENGTH = 2;
    const FRAME_LENGTH = 0.04;

    const countryClip = heading(country, videoLength, 'medium', 'top', 0, 0.4);
    const covidClip = heading('CORONAVIRUS (COVID-19) PANDEMIC', videoLength, 'x-small', 'top', 0, 0.1);

    const casesLabelClip = label(videoLength, VIDEO_TOP_LENGTH, FRAME_LENGTH, 'CONFIRMED CASES', 0, 1);
    const casesPlaceholderClip = placeholder(VIDEO_TOP_LENGTH, FRAME_LENGTH, 0.5);

    const deathsLabelClip = label(videoLength, VIDEO_TOP_LENGTH, FRAME_LENGTH, 'DEATHS', 0, -0.4);
    const deathsPlaceholderClip = placeholder(VIDEO_TOP_LENGTH, FRAME_LENGTH, -0.9);

    let fadeIn = new Shotstack.Transition;
    fadeIn.setIn('fade');

    // let casesPlaceholderText = new Shotstack.TitleAsset;
    // casesPlaceholderText
    //     .setStyle('future')
    //     .setText('0')
    //     .setSize('xx-large')
    //     .setOffset({ y: 0.5 });

    // let casesPlaceholderClip = new Shotstack.Clip;
    // casesPlaceholderClip
    //     .setAsset(casesPlaceholderText)
    //     .setStart(Number(VIDEO_TOP_LENGTH - 1 - FRAME_LENGTH))
    //     .setLength(1)
    //     .setTransition(fadeIn);

    // let deathsPlaceholderText = new Shotstack.TitleAsset;
    // deathsPlaceholderText
    //     .setStyle('future')
    //     .setText('0')
    //     .setSize('xx-large')
    //     .setOffset({ y: -0.9 });

    // let deathsPlaceholderClip = new Shotstack.Clip;
    // deathsPlaceholderClip
    //     .setAsset(deathsPlaceholderText)
    //     .setStart(Number(VIDEO_TOP_LENGTH - 1 - FRAME_LENGTH))
    //     .setLength(1)
    //     .setTransition(fadeIn);

    let fixedTextTrack = new Shotstack.Track;
    fixedTextTrack
        .setClips([countryClip, covidClip, casesLabelClip, deathsLabelClip, casesPlaceholderClip, deathsPlaceholderClip]);

    return fixedTextTrack;
}
