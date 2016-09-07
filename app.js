var request = require("request");
var cheerio = require("cheerio"); 
var natural = require("natural");

//scrape Wikipedia Article (Theme) and retrieve all links
themeURL = "https://en.wikipedia.org/wiki/Jazz";

request(themeURL, function(error, response, body){
	if(!error){
		var $ = cheerio.load(body);

      $('#mw-content-text a').each(function() {
        var text = $(this).text();
        var link = "http:/en.wikipedia.org"+$(this).attr('href');
		console.log(text + ": " + link);
		})
	}
});




//scrape Wikipedia Article by passing in URL
articleUrl = "https://en.wikipedia.org/wiki/Louis_Armstrong";

function aylien(criteria){
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

// for(i=0; i<criteria_terms.length; i++){
// 	aylien(criteria_terms[i]);
// };








