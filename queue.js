'use strict'

require('dotenv').config();

const fs = require('fs');
const csv = require('fast-csv');
const argv = require('yargs').argv;
const Shotstack = require('shotstack-sdk');
const moment = require('moment');

const API_KEY = process.env.SHOTSTACK_KEY;
const ENDPOINT = process.env.SHOTSTACK_ENDPOINT;
const CUSTOMER_ID = process.env.SHOTSTACK_CUSTOMER_ID;
const PREVIEW_URL = process.env.SHOTSTACK_PREVIEW_URL;
const DATASET = './full_data.csv';
const MAX_LIMIT = 1000;
const SKIP = argv.skip || 0;
const LIMIT = Math.min(argv.limit || MAX_LIMIT, MAX_LIMIT);

let countries = [];
let count = 0;

const generateVideo = (country, cases) => {
    let start = 0;
    let videoLength = 0;
    const VIDEO_TAIL_LENGTH = 5;
    const FRAME_LENGTH = 0.04;
    const COUNTER_LENGTH = FRAME_LENGTH * 1;

    let textClips = [];
    const dateOffset = new Shotstack.Offset;
    const countryOffset = new Shotstack.Offset;

    for (let i = 0; i < cases.length; i++) {
        const totalCases = cases[i].total_cases;
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
            .setSize('xx-large');

        let casesClip = new Shotstack.Clip;
        casesClip
            .setAsset(casesText)
            .setStart(Number(clipStart))
            .setLength(Number(clipLength));

        let dateText = new Shotstack.TitleAsset;
        dateText
            .setStyle('future')
            .setText(date)
            .setSize('small')
            .setOffset(dateOffset.setY(-1));

        let dateClip = new Shotstack.Clip;
        dateClip
            .setAsset(dateText)
            .setStart(Number(clipStart))
            .setLength(Number(clipLength));

        start = (Number(start) + Number(clipLength) + Number(FRAME_LENGTH));

        textClips.push(casesClip);
        textClips.push(dateClip);
    };

    let textTrack = new Shotstack.Track;
    textTrack
        .setClips(textClips);

    let countryText = new Shotstack.TitleAsset;
    countryText
        .setStyle('future')
        .setText(country)
        .setSize('medium')
        .setPosition('top');

    let countryClip = new Shotstack.Clip;
    countryClip
        .setAsset(countryText)
        .setStart(0)
        .setLength(videoLength);

    let covidText = new Shotstack.TitleAsset;
    covidText
        .setStyle('future')
        .setText('COVID-19 CASES')
        .setSize('x-small')
        .setPosition('top')
        .setOffset(countryOffset.setY(-0.3));

    let covidClip = new Shotstack.Clip;
    covidClip
        .setAsset(covidText)
        .setStart(0)
        .setLength(videoLength);

    let countryTrack = new Shotstack.Track;
    countryTrack
        .setClips([countryClip, covidClip]);

    let backgroundVideo = new Shotstack.VideoAsset;
    backgroundVideo
        .setSrc('https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/private/virus.mp4');

    let backgroundClip = new Shotstack.Clip;
    backgroundClip
        .setAsset(backgroundVideo)
        .setStart(0)
        .setLength(videoLength);

    let backgroundTrack = new Shotstack.Track;
    backgroundTrack
        .setClips([backgroundClip]);

    let soundtrack = new Shotstack.Soundtrack;
    soundtrack
        .setSrc('https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/private/bad-news.mp3')
        .setEffect('fadeInFadeOut');

    let timeline = new Shotstack.Timeline;
    timeline
        .setBackground('#000000')
        .setSoundtrack(soundtrack)
        .setTracks([countryTrack, textTrack, backgroundTrack]);

    let output = new Shotstack.Output;
    output
        .setFormat('mp4')
        .setResolution('sd');

    let edit = new Shotstack.Edit;
    edit
        .setTimeline(timeline)
        .setOutput(output);

    //console.log(JSON.stringify(edit, null, 2)); return;

    const defaultClient = Shotstack.ApiClient.instance;
    const DeveloperKey = defaultClient.authentications['DeveloperKey'];
    const api = new Shotstack.EndpointsApi();

    defaultClient.basePath = ENDPOINT;
    DeveloperKey.apiKey = API_KEY;

    api.postRender(edit).then((data) => {
        let message = data.response.message;
        let id = data.response.id

        console.log(message + '\n');
        console.log(PREVIEW_URL + CUSTOMER_ID + '/' + id + '.mp4');

    }, (error) => {
        console.error('Request failed: ', error);
        process.exit(1);
    })
}

const prepareVideos = countries => {
    for (let country in countries) {
        const name = country;
        const cases = countries[country].sort((a, b) => a.date - b.date);

        generateVideo(name, cases);
    }
}

fs.createReadStream(DATASET)
    .pipe(csv.parse({ headers: true }))
    .on('data', row => {
        count = count + 1;

        if (count <= SKIP || count > (SKIP + LIMIT)) {
            return;
        }

        const location = row['location'];

        countries[location] = countries[location] || [];
        countries[location].push({
            date: new Date(row['date']),
            new_cases: row['new_cases'],
            new_deaths: row['new_deaths'],
            total_cases: row['total_cases'],
            total_deaths: row['total_deaths']
        });
    })
    .on('finish', () => {
        prepareVideos(countries);
    });
