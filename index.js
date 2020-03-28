'use strict'

require('dotenv').config();

const fs = require('fs');
const csv = require('fast-csv');
const argv = require('yargs').argv;
const Shotstack = require('shotstack-sdk');
const edit = require('./edit');

const API_KEY = process.env.SHOTSTACK_KEY;
const ENDPOINT = process.env.SHOTSTACK_ENDPOINT;
const CUSTOMER_ID = process.env.SHOTSTACK_CUSTOMER_ID;
const PREVIEW_URL = process.env.SHOTSTACK_PREVIEW_URL;
const DATASET = './full_data.csv';

const country = argv.country;

if (!country) {
    console.log('No country selected. Please pass a country using --country.\n');
    process.exit(1);
}

let countries = [];

const generateVideo = (country, cases) => {
    const request = edit(country, cases);

    if (argv.debug) {
        console.log(JSON.stringify(request, null, 2));
        return;
    }

    const defaultClient = Shotstack.ApiClient.instance;
    const DeveloperKey = defaultClient.authentications['DeveloperKey'];
    const api = new Shotstack.EndpointsApi();

    defaultClient.basePath = ENDPOINT;
    DeveloperKey.apiKey = API_KEY;

    api.postRender(request).then((data) => {
        let message = data.response.message;
        let id = data.response.id

        console.log(message);
        console.log('Your video will be ready soon at the following URL:');
        console.log(PREVIEW_URL + CUSTOMER_ID + '/' + id + '.mp4');
    }, (error) => {
        console.error('Request failed: ', error);
        process.exit(1);
    })
}

fs.createReadStream(DATASET)
    .pipe(csv.parse({ headers: true }))
    .on('data', row => {
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
        try {
            const cases = countries[country].sort((a, b) => a.date - b.date);
            generateVideo(country, cases);
        } catch (err) {
            console.log('Country could not be found. Check the `full_data.csv` file for correct spelling.\n');
            process.exit(1);
        }
    });
