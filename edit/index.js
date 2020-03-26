const moment = require('moment');
const Shotstack = require('shotstack-sdk');
const Timeline = require('./timeline');
const Output = require('./output');

module.exports = (country, cases) => {
    const VIDEO_TOP_LENGTH = 2;
    const VIDEO_TAIL_LENGTH = 4;
    const FRAME_LENGTH = 0.04;
    const COUNTER_LENGTH = FRAME_LENGTH * 2;

    let start = VIDEO_TOP_LENGTH;
    let videoLength = 0;

    let textClips = [];

    for (let i = 0; i < cases.length; i++) {
        const totalCases = cases[i].total_cases;
        const totalDeaths = cases[i].total_deaths;
        const date = moment(cases[i].date).format('DD MMM YYYY');

        if (totalCases <= 0) {
            continue;
        }

        let clipStart = parseFloat(start.toFixed(2));
        let clipLength = COUNTER_LENGTH;

        if (i === cases.length - 1) {
            clipLength = VIDEO_TAIL_LENGTH;
            videoLength = start + VIDEO_TAIL_LENGTH;
        }

        let casesText = new Shotstack.TitleAsset;
        casesText
            .setStyle('future')
            .setText(Number(totalCases).toLocaleString())
            .setSize('xx-large')
            .setOffset({ y: 0.5 });

        let casesClip = new Shotstack.Clip;
        casesClip
            .setAsset(casesText)
            .setStart(Number(clipStart))
            .setLength(Number(clipLength));

        let deathsText = new Shotstack.TitleAsset;
        deathsText
            .setStyle('future')
            .setText(Number(totalDeaths).toLocaleString())
            .setSize('xx-large')
            .setOffset({ y: -0.9 });

        let deathsClip = new Shotstack.Clip;
        deathsClip
            .setAsset(deathsText)
            .setStart(Number(clipStart))
            .setLength(Number(clipLength));

        let dateText = new Shotstack.TitleAsset;
        dateText
            .setStyle('future')
            .setText(date)
            .setSize('small')
            .setPosition('bottom')
            .setOffset({ y: -0.35 });

        let dateClip = new Shotstack.Clip;
        dateClip
            .setAsset(dateText)
            .setStart(Number(clipStart))
            .setLength(Number(clipLength));

        start = (Number(start) + Number(clipLength) + Number(FRAME_LENGTH));

        textClips.push(casesClip);
        textClips.push(deathsClip);
        textClips.push(dateClip);
    };

    let fadeIn = new Shotstack.Transition;
    fadeIn.setIn('fade');

    let dataTrack = new Shotstack.Track;
    dataTrack
        .setClips(textClips);

    let countryText = new Shotstack.TitleAsset;
    countryText
        .setStyle('chunkLight')
        .setText(country.toUpperCase())
        .setSize('medium')
        .setPosition('top')
        .setOffset({ y: 0.4 });

    let countryClip = new Shotstack.Clip;
    countryClip
        .setAsset(countryText)
        .setStart(0.5)
        .setLength(videoLength - 0.5)
        .setTransition(fadeIn);

    let covidText = new Shotstack.TitleAsset;
    covidText
        .setStyle('future')
        .setText('CORONAVIRUS (COVID-19) PANDEMIC')
        .setSize('x-small')
        .setPosition('top')
        .setOffset({ y: 0.1 });

    let covidClip = new Shotstack.Clip;
    covidClip
        .setAsset(covidText)
        .setStart(0.75)
        .setLength(videoLength - 0.75)
        .setTransition(fadeIn);

    let casesLabelText = new Shotstack.TitleAsset;
    casesLabelText
        .setStyle('chunkLight')
        .setText('CONFIRMED CASES')
        .setSize('x-small')
        .setOffset({ y: 1 });

    let casesLabelClip = new Shotstack.Clip;
    casesLabelClip
        .setAsset(casesLabelText)
        .setStart(Number(VIDEO_TOP_LENGTH - 1 - FRAME_LENGTH))
        .setLength(videoLength - Number(VIDEO_TOP_LENGTH - 1 - FRAME_LENGTH))
        .setTransition(fadeIn);

    let deathsLabelText = new Shotstack.TitleAsset;
    deathsLabelText
        .setStyle('chunkLight')
        .setText('DEATHS')
        .setSize('x-small')
        .setOffset({ y: -0.4 });

    let deathsLabelClip = new Shotstack.Clip;
    deathsLabelClip
        .setAsset(deathsLabelText)
        .setStart(Number(VIDEO_TOP_LENGTH - 1 - FRAME_LENGTH))
        .setLength(videoLength - Number(VIDEO_TOP_LENGTH - 1 - FRAME_LENGTH))
        .setTransition(fadeIn);

    let casesPlaceholderText = new Shotstack.TitleAsset;
    casesPlaceholderText
        .setStyle('future')
        .setText('0')
        .setSize('xx-large')
        .setOffset({ y: 0.5 });

    let casesPlaceholderClip = new Shotstack.Clip;
    casesPlaceholderClip
        .setAsset(casesPlaceholderText)
        .setStart(Number(VIDEO_TOP_LENGTH - 1 - FRAME_LENGTH))
        .setLength(1)
        .setTransition(fadeIn);

    let deathsPlaceholderText = new Shotstack.TitleAsset;
    deathsPlaceholderText
        .setStyle('future')
        .setText('0')
        .setSize('xx-large')
        .setOffset({ y: -0.9 });

    let deathsPlaceholderClip = new Shotstack.Clip;
    deathsPlaceholderClip
        .setAsset(deathsPlaceholderText)
        .setStart(Number(VIDEO_TOP_LENGTH - 1 - FRAME_LENGTH))
        .setLength(1)
        .setTransition(fadeIn);

    let fixedTextTrack = new Shotstack.Track;
    fixedTextTrack
        .setClips([countryClip, covidClip, casesLabelClip, deathsLabelClip, casesPlaceholderClip, deathsPlaceholderClip]);

    let backgroundVideo = new Shotstack.VideoAsset;
    backgroundVideo
        .setSrc('https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/private/virus.mp4');

    let backgroundClip = new Shotstack.Clip;
    backgroundClip
        .setAsset(backgroundVideo)
        .setStart(0.5)
        .setLength(videoLength - 0.5)
        .setTransition(fadeIn)
        .setOpacity(0.1);

    let backgroundTrack = new Shotstack.Track;
    backgroundTrack
        .setClips([backgroundClip]);
    
    const timeline = Timeline([fixedTextTrack, dataTrack, backgroundTrack])
    const output = Output('mp4', 'sd');

    let edit = new Shotstack.Edit;
    edit
        .setTimeline(timeline)
        .setOutput(output);

    return edit;
}