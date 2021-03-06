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


mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/vibescraper"
);

var app = express();

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.engine("handlebars", exphbs({defaultLayout: 'main'}));
app.set("view engine", "handlebars");


var PORT = process.env.PORT || 3000;

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
      }).catch(function(err){
        console.error(err)
      })
      
    });

    res.send("scrape complete");
    
  });

})

app.get('/', function(req, res){

  db.Article.find({}).sort({_id: -1}).then(function(allArticles){
    db.SavedArticle.find({}).sort({_id: -1}).then(function(savedArticles){
      // console.log(allArticles)
      var results = {
        allArticles: allArticles,
        savedArticles: savedArticles
      }
      if(savedArticles.length == 0){
        results.noSavedArticles = true
      }
      if(allArticles.length == 0){
        results.noArticles = true
      }
      res.render('index', results);

    })
  }).catch(function(err){
    console.log(err)
  })
})

app.get('/articlenotes/:id', function(req, res){
    db.SavedArticle.findOne({_id: req.params.id}).populate({path: 'note'})
    .then(function(articleNotes){
      res.json(articleNotes);
    }).catch(function(err){
      res.json(err)
    })
})

app.post('/saved', function(req, res){

  db.SavedArticle.create(req.body).then(function(dbSavedArticle){
    res.json(dbSavedArticle)
  }).catch(function(err){
    console.log(err)
  })
})

app.post('/articlenotes', function(req, res){
    var noteInfo = {
      title: req.body.title,
      body: req.body.body
    }
  db.Note.create(noteInfo).then(function(dbNote){

    return db.SavedArticle.updateOne({_id: req.body.articleId }, {$push: {note: dbNote._id}})

  }).then(function(dbArticle){

    res.json(dbArticle)

  }).catch(function(err){

    res.json(err)
  })
})

app.delete('/', function(req, res){

  db.SavedArticle.remove(req.body).then(function(dbSavedArticle){
    res.json(dbSavedArticle)
  }).catch(function(err){
    console.log(err)
  })
})

// Make a request call to grab the HTML body from the site of your choice


app.listen(PORT, function(){
  console.log('listening')
})
