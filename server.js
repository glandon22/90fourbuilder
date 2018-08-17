const configVars = require('./configvars.js');
let books = require('./books.js').books;
const KEY = configVars.KEY;
const util = require('util');
const _async = require('async');
const moment = require('moment');
moment().format();

const fs = require('fs');
const parseString = require('xml2js').parseString;
const request = require('request');
const reqURLShelf = 'https://www.goodreads.com/review/list/38233116.xml?v=2&per_page=100&page=2&sort=date_read&shelf=read&key=' + KEY;

//pull in goodreads shitty xml object and extract the info that i want
function cleanGoodReadsResponse(booksArray) {
	var cleanedBooksArray = [];
		
	//loop over response and only save the data points i need for each book
	for (let i = 0; i < booksArray.length; i++) {

		cleanedBooksArray.push({
			title: booksArray[i]['book'][0]['title'][0],
			author: booksArray[i]['book'][0]['authors'][0]['author'][0]['name'][0],
			//some books do not have a page number associated from goodreads
			//if this is the case, set pages to a generic 250
			pages: booksArray[i]['book'][0]['num_pages'][0] !== '' ? booksArray[i]['book'][0]['num_pages'][0] : 250,
			rating: booksArray[i]['rating'][0],
			readMonth: moment(booksArray[i]['read_at'][0],"ddd MMM DD hh:mm:ss ZZ YYYY").format('MMMM'),
			readYear: moment(booksArray[i]['read_at'][0],"ddd MMM DD hh:mm:ss ZZ YYYY").format('YYYY'),
			bookLink: booksArray[i]['book'][0]['link'][0],
			bookDescription: booksArray[i]['book'][0]['description'][0],
			bookThumbnail: booksArray[i]['book'][0]['image_url'][0]
		});
	}
	fs.writeFileSync('books2.txt', util.inspect(cleanedBooksArray, {showHidden: false, depth: null}));
	return cleanedBooksArray;
}

//create a d3 array of abjects for books read per year linegraph
function createBooksPerYearGraph(masterBookData) {
	let booksPerYearData = {};
	for (let i = 0; i < masterBookData.length; i++) {
		//year has already been added to object
		if (booksPerYearData.hasOwnProperty(masterBookData[i]['readYear'])) {
			booksPerYearData[masterBookData[i]['readYear']]++;
		}

		//need to add year to object
		else {
			booksPerYearData[masterBookData[i]['readYear']] = 1;
		}
	}

	let chartData = {
		years: [],
		books: []
	};

	for (year in booksPerYearData) {
		chartData.years.push(year);
		chartData.books.push(booksPerYearData[year]);
	}

	return chartData;
}

function createPagesPerYearGraph(masterBookData) {
	
	let pagesPerYearData = {};

	for (let i = 0; i < masterBookData.length; i++) {
		
		if (pagesPerYearData.hasOwnProperty(masterBookData[i]['readYear'])) {
			pagesPerYearData[masterBookData[i]['readYear']] += parseInt(masterBookData[i]['pages']);
		}

		else {
			pagesPerYearData[masterBookData[i]['readYear']] = parseInt(masterBookData[i]['pages']);
		}
	}

	let chartData = {
		years: [],
		pages: []
	};

	for (year in pagesPerYearData) {
		chartData.years.push(year);
		chartData.pages.push(pagesPerYearData[year]);
	}
	console.log(chartData);
	return chartData;
}

request.get(reqURLShelf, function(err, res, body) {
	parseString(body, async function(err,res) {
		const masterBookData = await cleanGoodReadsResponse(res.GoodreadsResponse['reviews'][0]['review']);
		const booksPerYearGraphData = await createBooksPerYearGraph(masterBookData);
		const pagesperYearGraphDaya = await createPagesPerYearGraph(masterBookData);
	});
	
});