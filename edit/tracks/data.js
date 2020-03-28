
const Shotstack = require('shotstack-sdk');
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

    let dataTrack = new Shotstack.Track;
    dataTrack
        .setClips(textClips);

    return [dataTrack, videoLength];
}