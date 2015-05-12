/**
 * Created by fabiolombardi on 10/05/15.
 */
// server.js
// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('mongodb://localhost/toDoListTutorial');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var ToDo = require('./app/models/todo');

// routes =================
//Get all tasks of the todolist
app.get('/api/todos', function(req, res){
    ToDo.find(function(err, todos){
        if(err)
            res.send(err);
        res.json(todos);
    });
});

//Add a new task to the todolist
app.post('/api/todos', function(req, res){
    var todo = new ToDo();
    todo.text = req.body.text;
    todo.save(function (err) {
        if(err)
            res.send(err);
        ToDo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

//Get a single task from the todolist
app.get('/api/todos/:todo_id', function(req, res){
   ToDo.findById(req.params.todo_id, function(err, todo){
       if(err)
           res.send(err);
       res.json(todo);
   });
});

//Edit a task of the todolist
app.put('/api/todos/:todo_id', function(req, res){
    ToDo.findById(req.params.todo_id, function(err, todo){
        if(err)
            res.send(err)
        todo.text = req.body.text;
        todo.save(function (err) {
            if(err)
                res.send(err);
            //it sends back the todolist
            ToDo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });
});

//Delete/perform a todo task
app.delete('/api/todos/:todo_id', function(req, res){
    ToDo.remove({
        _id : req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);
        //it sends back the todolist
        ToDo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    })
});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("Magic happening on port 8080");