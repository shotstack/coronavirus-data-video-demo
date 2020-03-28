
const Shotstack = require('shotstack-sdk');
const counter = require('./clips/counter');
const date = require('./clips/date');
const moment = require('moment');

module.exports = (cases, videoTopLength, videoTailLength, frameLength) => {
    const counterLength = frameLength * 2;
    let start = videoTopLength;
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
        let clipLength = counterLength;

        if (i === cases.length - 1) {
            clipLength = videoTailLength;
            videoLength = start + videoTailLength;
        }

        const casesClip = counter(Number(totalCases).toLocaleString(), clipStart, clipLength, 0, 0.5);
        const deathsClip = counter(Number(totalDeaths).toLocaleString(), clipStart, clipLength, 0, -0.9);
        const dateClip = date(casesDate, clipStart, clipLength, 0, -0.35);

        textClips.push(casesClip);
        textClips.push(deathsClip);
        textClips.push(dateClip);

        start = (Number(start) + Number(clipLength) + Number(frameLength));
    };

    let dataTrack = new Shotstack.Track;
    dataTrack
        .setClips(textClips);

    return [dataTrack, videoLength];
}