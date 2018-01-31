// Using this template, the cheerio documentation,
// and what you've learned in class so far, scrape a website
// of your choice, save information from the page in a result array, and log it to the console.

const cheerio = require("cheerio");
const request = require("request");
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const db = require('./models');


mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/vibescraper');


var app = express();

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.engine("handlebars", exphbs({defaultLayout: 'main'}));
app.set("view engine", "handlebars");


var PORT = 3000;

app.get('/scrape', function(req, res){

  request("http://www.vibe.com", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $("div.post.row").each(function(i, element) {

      var results = {};


      var image = $(element).find('img').attr("src");
      var link = $(element).find('a').attr("href");
      var title = $(element).find('h2').text().replace(/\n/g,"");

      // Save these results in an object that we'll push into the results array we defined earlier
      if(title === ''){
      }else{
        results.title = title;
        results.link = link;
        results.image = image;
      }
      db.Article.create(results).then(function(dbArticle){
        console.log(dbArticle)
      })
    });
    
  });

})

app.get('/', function(req, res){

  db.Article.find({}).then(function(results){

    res.render('index', {results} );
  })
  // let vibeApi = {
  //   method: 'GET',
  //   url: 'http://localhost:3000/api/vibe'
  // }

  // request(vibeApi, function(error, response, html) {
  //   html = JSON.parse(html)
  //   // console.log(response.body)
  //   let results = html
  //   // console.log(html)
  //   // Log the results once you've looped through each of the elements found with cheerio
  //   res.render('index', {results} );
  // });

})
// Make a request call to grab the HTML body from the site of your choice


app.listen(PORT, function(){
  console.log('listening')
})
