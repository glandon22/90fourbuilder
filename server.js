const configVars = require('./configvars.js');
const KEY = configVars.KEY;
const util = require('util');
const _async = require('async');
var moment = require('moment');
moment().format();
var fs = require('fs');
var parseString = require('xml2js').parseString;
var request = require('request');
var reqURLShelf = 'https://www.goodreads.com/review/list/38233116.xml?v=2&per_page=100&page=1&sort=date_read&shelf=read&key=' + KEY;

//pull in goodreads shitty xml object and extract the info that i want
function cleanGoodReadsResponse(booksArray) {
	var cleanedBooksArray = [];
		
	//loop over response and only save the data points i need for each book
	for (let i = 0; i < booksArray.length; i++) {
		
		cleanedBooksArray.push({
			title: booksArray[i]['book'][0]['title'][0],
			author: booksArray[i]['book'][0]['authors'][0]['author'][0]['name'][0],
			pages: booksArray[i]['book'][0]['num_pages'][0],
			rating: booksArray[i]['rating'][0],
			readMonth: moment(booksArray[i]['read_at'][0],"ddd MMM DD hh:mm:ss ZZ YYYY").format('MMMM'),
			readYear: moment(booksArray[i]['read_at'][0],"ddd MMM DD hh:mm:ss ZZ YYYY").format('YYYY'),
			bookLink: booksArray[i]['book'][0]['link'][0],
			bookDescription: booksArray[i]['book'][0]['description'][0],
			bookThumbnail: booksArray[i]['book'][0]['image_url'][0]
		});
	}
	//fs.writeFileSync('testd3.txt', util.inspect(cleanedBooksArray, {showHidden: false, depth: null}));
	return cleanedBooksArray;
}

//create a d3 array of abjects for books read per year linegraph
function createBooksPerYearGraph(masterBookData) {
	let booksPerYearData = {};
	let d3Array = [];
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
	//now convert this to something d3 can understand (ar array of objects)
	for (year in booksPerYearData) {
		let newYearObject = {};
		newYearObject['year'] = year;
		newYearObject['books'] = booksPerYearData[year];
		d3Array.push(newYearObject);
	}

	console.log(d3Array)
	return booksPerYearData;
}

request.get(reqURLShelf, function(err, res, body) {
	parseString(body, async function(err,res) {
		const masterBookData = await cleanGoodReadsResponse(res.GoodreadsResponse['reviews'][0]['review']);
		createBooksPerYearGraph(masterBookData);
	});
	
});