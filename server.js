const express = require("express");
const app = express();
app.use(express.urlencoded({extended : true}));

const MongoClient = require("mongodb").MongoClient;

var db;
MongoClient.connect('mongodb+srv://pmc0814:ajaxno9park@todoapp.4ssap.mongodb.net/todoapp?retryWrites=true&w=majority',{ useUnifiedTopology: true }, function(err, client) {
    if (err) {return console.log(err)};

    db = client.db("todoapp");

    app.listen(8080, function() {
        console.log("listening on 8080");
    });
});


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/write', function(req, res) {
    res.sendFile(__dirname + '/write.html');
});


db.collection("post").insertOne( {_id : 100, 이름 : "박민찬", 나이 : 25}, function(err, result) {
    console.log("저장완료!");
});


app.post('/add', function(req, res) {
    res.send("전송!");
    db.collection("post").insertOne( {_id : 200, "할 일": req.body.todo, 기한: req.body.date }, function(err, result) {
        console.log("저장완료!");
    });
}); 

