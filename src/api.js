var express = require('express');
var app = express();

app.post('/fund', function(req, res) {
    res.send('Hello World!');
});

app.get('/fund', function (req, res) {
    // query string to smart search
    // fund that best match a given criteria
    res.send('Hello World!');
});


app.get('/portfolio/:id', function(req, res) {
    res.send('Hello World!');
});
// TODO: autocomplete funds in portfolio
// from given criteria, for instance,
// constraints in the region/sectors

app.post('/portfolio', function(req, res) {
    res.send('Hello World!');
});


app.post('/portfolio/:id/funds/:fundid', function(req, res) {
    // use app.param /portfolio/:id
    res.send('Hello World!');

});


app.delete('/portfolio/:id/funds/:fundid', function(req, res) {
});


module.exports = {
    
    start: function() {
	app.listen(3000, function () {
	    console.log('Example app listening on port 3000!');
	});
    },
};
