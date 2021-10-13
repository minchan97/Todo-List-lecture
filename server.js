const express = require("express");
const app = express();
app.use(express.urlencoded({extended : true}));
const MongoClient = require("mongodb").MongoClient;
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

var db;
MongoClient.connect('mongodb+srv://pmc0814:ajaxno9park@todoapp.4ssap.mongodb.net/todoapp?retryWrites=true&w=majority',{ useUnifiedTopology: true }, function(err, client) {
    if (err) {return console.log(err)};

    db = client.db("todoapp");

    app.listen(8080, function() {
        console.log("listening on 8080");
    });
});


app.get('/', function(req, res) {
    res.render(__dirname + '/views/index.ejs');
});

app.get('/write', function(req, res) {
    res.render(__dirname + '/views/write.ejs');
});




app.post('/add', function(req, res) {
    res.send("전송!");
    db.collection("counter").findOne({name : '게시물개수'}, function(err, result) {
        var postNum = result.totalPost;

        db.collection("post").insertOne( { _id : postNum + 1, 할일: req.body.todo, 기한: req.body.date }, function(err, result) {
            db.collection('counter').updateOne({name: '게시물개수'}, { $inc : {totalPost : 1} }, function(err, result){
                if (err) {return console.log(err)}
            });
        });

    });
}); 



app.get('/list', function(req, res) {

    db.collection('post').find().toArray(function(err, result) {
        console.log(result);
    res.render('list.ejs', { posts : result });
    });
});

app.delete('/delete', function(req, res) {
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne( req.body, function(err, result) {
        console.log("done!");
        res.status(200).send({ message : 'success!' });
    });

});

app.get('/detail/:id', function(req, res) {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) { 
        res.render('detail.ejs', { data : result });
    });
});