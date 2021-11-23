//server setupt
const { response } = require('express');
var express = require('express');
var app = express();

app.listen(3000, function(){
    console.log("Listening on 3000");
})


app.get('/', function(request, response){
    console.log("HTTP GET request: /");
    response.send("Hello there");
})

