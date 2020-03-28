# Coronavirus (COVID-19) Data Generated Videos

This is a demo to showcase using a data source to generate videos using the [Shotstack API](https://shotstack.io/docs/api/index.html).

A NodeJS script loops through a data set of Coronavirus (Covid-19) global pandemic cases and deaths 
sourced from [Our World In Data](https://ourworldindata.org/coronavirus-source-data) and generates a 
video for a selected country.

---

## Requirements

This project was developed using Node v10.15.3 and NPM 6.4.1.

### API Key
To run the project you will need a Shotstack API key. If you do not have a key you can sign up via 
the [Shotstack website](https://shotstack.io/).

Once you have a key, copy the `.env.dist` file and name it `.env`. Then add your staging API key next to 
the `SHOTSTACK_KEY=` parameter.

Your `.env` file should look something like:

```
SHOTSTACK_ENDPOINT=https://api.shotstack.io/stage
SHOTSTACK_KEY=KnYTD1jak82B83hwvL8kT5jlT66MMVqI2zE4dPPs
```

---

## Installation

Install dependencies using the following: 

```
npm install
```

---

## Usage

### Fetch/Update Data

Fetch the latest Coronavirus dataset:

```
npm run dataset
```

A CSV file `full_data.csv` is downloaded and saved in the project root directory.

### Generate Video

Run the following command with the country you wish to generate a video for:

```
npm run generate -- --country [Country]
```

Replace [Country] with the country you want to generate a video for, i.e.

```
npm run generate -- --country 'Australia'
```

Note: the country value is case sensitive and must be entered exactly as it is stored in
the `Location` column in the CSV file. i.e. 'United States' - alternatives like 'US', 'USA' 
or lowercase  'united states' will not work.