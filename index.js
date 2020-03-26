'use strict'

require('dotenv').config();

const fs = require('fs');
const csv = require('fast-csv');
const argv = require('yargs').argv;
const Shotstack = require('shotstack-sdk');
const Edit = require('./edit');

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

    const edit = Edit(country, cases);
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
