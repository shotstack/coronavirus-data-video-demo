const Shotstack = require('shotstack-sdk');
const timeline = require('./timeline');
const output = require('./output');

module.exports = (country, cases) => {
    const videoTimeline = timeline(country, cases);
    const videoOutput = output('mp4', 'sd');

    let edit = new Shotstack.Edit;
    edit
        .setTimeline(videoTimeline)
        .setOutput(videoOutput);

    return edit;
}