
const Shotstack = require('shotstack-sdk');
const counter = require('./clips/counter');
const date = require('./clips/date');
const moment = require('moment');

module.exports = (cases) => {
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
        const casesDate = moment(cases[i].date).format('DD MMM YYYY');

        if (totalCases <= 0) {
            continue;
        }

        let clipStart = parseFloat(start.toFixed(2));
        let clipLength = COUNTER_LENGTH;

        if (i === cases.length - 1) {
            clipLength = VIDEO_TAIL_LENGTH;
            videoLength = start + VIDEO_TAIL_LENGTH;
        }

        const casesClip = counter(Number(totalCases).toLocaleString(), clipStart, clipLength, 0, 0.5);
        const deathsClip = counter(Number(totalDeaths).toLocaleString(), clipStart, clipLength, 0, -0.9);
        const dateClip = date(casesDate, clipStart, clipLength, 0, -0.35);

        textClips.push(casesClip);
        textClips.push(deathsClip);
        textClips.push(dateClip);

        start = (Number(start) + Number(clipLength) + Number(FRAME_LENGTH));
    };

    let dataTrack = new Shotstack.Track;
    dataTrack
        .setClips(textClips);

    return [dataTrack, videoLength];
}