const configVars = require('./configvars.js');
const KEY = configVars.KEY;
const util = require('util');
var moment = require('moment');
moment().format();
var fs = require('fs');
var parseString = require('xml2js').parseString;
var request = require('request');
var reqURLBook = 'https://www.goodreads.com/book/isbn/9781610398299?key=' + KEY;
var reqURLShelf = 'https://www.goodreads.com/review/list/38233116.xml?v=2&per_page=100&page=2&sort=date_read&shelf=read&key=' + KEY;

//var date = moment(booksArray[i]['read_at'][0],"ddd MMM DD hh:mm:ss ZZ YYYY").format('DD');
//console.log(date);

request.get(reqURLShelf, function(err, res, body) {
	parseString(body, function(err,res) {
		const booksArray = res.GoodreadsResponse['reviews'][0]['review'];
		var cleanedBooksArray = [];
		
		//loop over response and only save the data points i need for each book
		for (var i = 0; i < booksArray.length; i++) {
			
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
	});
});