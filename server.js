const configVars = require('./configvars.js');
const KEY = configVars.KEY;
const util = require('util');
var fs = require('fs');
var parseString = require('xml2js').parseString;
var request = require('request');
var reqURLBook = 'https://www.goodreads.com/book/isbn/9781610398299?key=' + KEY;
var reqURLShelf = 'https://www.goodreads.com/review/list/38233116.xml?v=2&per_page=100&page=2&sort=date_read&shelf=read&key=' + KEY;

request.get(reqURLShelf, function(err, res, body) {
	parseString(body, function(err,res) {
		//write all response output into a file so i can read the output
		//this is now an array of objects, each object containing a book
		//fs.writeFileSync('test-file.txt', util.inspect(res.GoodreadsResponse['reviews'][0]['review'], {showHidden: false, depth: null}));
		//console.log(util.inspect(res.GoodreadsResponse['reviews'][0]['review'][0], {showHidden: false, depth: null}))
		const booksArray = res.GoodreadsResponse['reviews'][0]['review'];
		var cleanedBooksArray = [];
		
		//loop over response and only save the data points i need for each book
		for (var i = 0; i < booksArray.length; i++) {
			/*
			cleanedBooksArray.push({
				title: booksArray[i]['book']['title'][0],
				author: booksArray[i]['book']['authors'][0]['author'][0]['name'][0],
				pages: booksArray[i]['book']['num_pages'][0],
				rating: booksArray[i]['rating'][0]
			});
			*/

			console.log(booksArray[i]['book'][0]['title'][0])
			console.log('+++++++++++++++++++++')
		}
		
	});
});