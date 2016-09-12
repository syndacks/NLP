var request = require("request");
var cheerio = require("cheerio"); 
var natural = require("natural");
var fs = require("fs");
var articleList = require("./articleList2");
var async = require("async");
var csvWriter = require('csv-write-stream');


//scrape Wikipedia Article (Theme) and retrieve all links from body
function themeScrape(){
	themeURL = "https://en.wikipedia.org/wiki/Rock_music";
	request(themeURL, function(error, response, body){
		if(!error){
			var $ = cheerio.load(body);
	      $('#mw-content-text a').each(function() {
	        var link = '"http://en.wikipedia.org'+$(this).attr('href')+'",';
			console.log(link);
			})
		}
	});
}
// themeScrape();



//scrape Wikipedia Article by passing in URL
function aylien(article, callback){
	//request Wiki Article
	request(article, function(error, response, body) {
	  if (!error) {
	  	//scrape body content from the wiki article and place in articleBody
	    var $ = cheerio.load(body),
	      articleBody = $("#mw-content-text").text();
	      //tokenize (split all the words from articleBody into individual words or "tokens")
	      tokenizer = new natural.WordTokenizer();
	      tokenized_articleBody = (tokenizer.tokenize(articleBody));
	      //set up Terf Frequency-Inverse Document Frequency (tf-idf)
	      //use this to determine how important a criterium is to a document relative to a corpus. 
	      var TfIdf = natural.TfIdf;
	      var tfidf = new TfIdf();
	      //load tfidf with tokenized_articleBody terms
	      tfidf.addDocument(tokenized_articleBody);

	      //se criteria terms for tfidf to work with
	      var criteria_terms = ['genre', 'band', 'instrument', 'song', 'geography']
	      
	      //run the magic
	      var numCompletedNLPs = 0;
	      var scores = {};
	      for(i=0; i<criteria_terms.length; i++){
		      var currentWord = criteria_terms[i]
		      tfidf.tfidfs(currentWord, function(x, measure){
		      	numCompletedNLPs++;
		      	// scores['genre'] = 0.92;
		      	scores[currentWord] = measure;


		      	// if we've completed the async work for all the words, callback
		      	if (numCompletedNLPs === criteria_terms.length)
		      		callback(article, scores)
		      });
	  	  }
	  } 
	});
}

// this will print a set of objects with url and scores for different criteria
for(x=0; x<articleList.length; x++){
	aylien(articleList[x], function (url, scores) {
		var scoreObject = {url: url, scores}
		console.log(scoreObject);
	});
};



//scrape Wikipedia Article by passing in the criteria
function aylienByCriteria(criteria){
	articleUrl = "https://en.wikipedia.org/wiki/Louis_Armstrong";
	//request Wiki Article
	request(articleUrl, function(error, response, body) {
	  if (!error) {
	  	//scrape body content from the wiki article and place in articleBody
	    var $ = cheerio.load(body),
	      articleBody = $("#mw-content-text").text();
	      //tokenize (split all the words from articleBody into individual words or "tokens")
	      tokenizer = new natural.WordTokenizer();
	      tokenized_articleBody = (tokenizer.tokenize(articleBody));
	      //set up Terf Frequency-Inverse Document Frequency (tf-idf)
	      //use this to determine how important a word (or words) is to a document relative to a corpus. 
	      var TfIdf = natural.TfIdf;
	      var tfidf = new TfIdf();
	      //load tfidf 'addDocument' with the tokenized_articleBody terms
	      tfidf.addDocument(tokenized_articleBody);
	      
	      //run the magic
	      tfidf.tfidfs(criteria, function(i, measure){
	      	console.log("This Wikipedia article scores: " + measure + " for " + "the term " + "'"+criteria+"'");
	      });
	  }
	});
}

var criteria_terms = ['genre', 'musician', 'instrument', 'deadmau5', 'jazz', 'Armstrong']

//Use this for loop to kick off the above function
// for(i=0; i<criteria_terms.length; i++){
// 	aylienByCriteria(criteria_terms[i]);
// };



