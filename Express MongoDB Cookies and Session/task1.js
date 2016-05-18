var express = require('express');
var mongodb = require('mongodb');
var jade =  require('jade');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', jade.__express);
app.use(cookieParser());
app.use(session({secret: 'MAGICALEXPRESSKEY',
    resave: true,
    saveUninitialized: true}));


app.get('/',function (req,res) {
    //for the first time
    if(req.cookies.hasVisited){
        res.render('sorted_list',{'matched':matched_people.coders});

    }else if(req.session.fname != null && req.session.lname != null){
        res.render('new_coder',{val1:req.session.fname,val2:req.session.lname});
    }else{
        res.render('new_coder');
    }
});

var matched_people = {coders : [] };

app.post('/',function (req,res) {

    //call database to check if the man is in there or not
    var freshmaal = "true";
    var user = {
        fname : "",
        lname : "",
        langs : "",
        days : "",
        favLang : ""
    };

    matched_people =  {coders : [] };
    var sortedList ={
        coders : []
    }
    user.fname = req.body.coder_fname;
    user.lname = req.body.coder_lname;

    var url = 'mongodb://localhost:27017/coder';

    var MongoClient = mongodb.MongoClient;

    //if he is not there
    if(req.body.coder_fname != null && req.body.coder_fname != ""){
        req.session.fname = req.body.coder_fname;
        console.log( req.session.fname);
    }else{
        res.send("Fields Cannot be empty");
    }
    if(req.body.coder_lname != null && req.body.coder_lname != ""){
        req.session.lname = req.body.coder_lname;
        console.log(req.body.coder_lname);
    }else{
        res.send("Fields Cannot be empty");
    }

    MongoClient.connect(url,function (err,db) {
        if(err){
            console.log("Connection could not be Established");
            res.status(500).send('Connection could not be Established');
        }else{
            console.log("Connection successfully Established");
            
            var collection = db.collection('coderdetail');

            collection.find({}).toArray(function (err,results) {
                if(err){
                   console.log(err);
                    res.status(500).send('Something broke!');
                }else if(results.length){
                   for(var i=0;i<results.length;i++){
                        if(user.fname.toString() == results[i].first_name.toString()){
                            console.log('user exists...');
                            freshmaal = "false";
                            user.langs = results[i].languages.toString();
                            user.days = results[i].days.toString();
                            user.favLang = results[i].favLang.toString();
                        }
                   }
                   if(freshmaal == "false"){
                        var days_user_has = user.days.toLowerCase().split(" ");
                        var langs_user_has = user.langs.toLowerCase().split(" ");

                        for(var i=0;i<results.length;i++){

                            var hits = 0;
                            if(user.fname.toLowerCase() != results[i].first_name.toString().toLowerCase()){

                            var days_each_has = results[i].days.toString().toLowerCase().split(" ");
                            var langs_each_has= results[i].languages.toString().toLowerCase().split(" ");
                            
                            console.log("Languages of "+user.fname+" :  " + langs_user_has);
                            console.log("Languages of "+results[i].first_name.toString()+" :" + langs_each_has);
                            console.log(".");
                            console.log(".");
                                var temp = 0;


                                for(var x = 0;x<langs_user_has.length;x++){
                                    if( (langs_each_has.indexOf(langs_user_has[x].toLowerCase()) > -1) )
                                    {
                                        hits++;
                                    }
                                }
                                for(var y = 0;(y<days_user_has.length);y++){
                                    if(days_each_has.indexOf(days_user_has[y].toLowerCase()) > -1){
                                        hits++;
                                    }
                                }
                                if(user.favLang == results[i].favLang.toString()){
                                    hits++;
                                }

                                sortedList.coders.push({
                                    "name" :results[i].first_name.toString() ,
                                    "hits" : hits
                                });
                            }
                                
                        }
                       sortedList.coders.sort(function(a, b) {
                           return parseFloat(a.hits) - parseFloat(b.hits);
                       });
                        console.log("Sorted List has : "+sortedList.coders.length);
                       var badcode = 0;
                       for(var i=sortedList.coders.length-1;i>=0;i--){

                               for(var j=0;j<results.length;j++){
                                   if(sortedList.coders[i].name.toLowerCase() == results[j].first_name.toString().toLowerCase()){
                                        if(badcode <3){
                                            matched_people.coders.push({
                                                "first_name" : results[j].first_name.toString(),
                                                "last_name" : results[j].last_name.toString(),
                                                "languages" : results[j].languages.toString(),
                                                "days" : results[j].days.toString(),
                                                "favLang" : results[j].favLang.toString()
                                            });
                                            badcode++;
                                        }
                                   }
                               }
                            console.log(sortedList.coders[i].name.toLowerCase() +" : " + sortedList.coders[i].hits);

                       }


                        for(var j=0;j<matched_people.coders.length;j++){
                            var obj = matched_people.coders[j];
                            console.log("People Who matched are : "+obj.first_name);    
                        }
                        
                   }
                } else{
                    console.log('No Documents Found');
                }
                if(freshmaal == "true"){
                    console.log("Navo maal aayo bapuuu");
                    res.redirect(307,'add_coder_langs');
                }else{
                    console.log("Juno maal chhe laa");
                    res.cookie('hasVisited', '1',
                        { maxAge: 60*60*1000,
                            httpOnly: true,
                            path:'/'});
                    res.render('sorted_list',{'matched':matched_people.coders});
                }
                db.close();
                 console.log('Connection Closed.');
            });

        }
    });

});

app.post('/add_coder_langs',function (req,res) {
    if(req.session.langs == null){
        res.render('add_coder_langs');
    }else{
        res.render('add_coder_langs',{val:req.session.langs});
    }
});

app.post('/add_coder_days',function (req,res) {

    if( req.body.coder_langs != null && req.body.coder_langs != "" ){
        req.session.langs = req.body.coder_langs;
        console.log(req.body.coder_langs);
    }else{
        res.send("Fields cannot be empty");
    }

    if(req.session.days == null){
        res.render('add_coder_days');
    }else{
        res.render('add_coder_days',{val:req.session.days});
    }



});


app.post('/add_coder_favLang',function (req,res) {

    if(req.body.coder_days != null && req.body.coder_days != ""){
        req.session.days =   req.body.coder_days;
    }else{
        res.send("Fields cannot be empty");
    }
    if(req.session.favLang != null){
        res.render('add_coder_favLang',{val:req.session.favLang});
    }else{
        res.render('add_coder_favLang');
    }



});

app.post('/display_coder',function (req,res) {

    if(req.body.coder_favLang != null && req.body.coder_favLang != ""){
        req.session.favLang = req.body.coder_favLang;
    }else{
        res.send("Fields cannot be empty");
    }

    if(req.session.fname != null && req.session.lname != null && req.session.langs != null && req.session.days != null && req.session.favLang != null){
        res.render('display_coder',{first_name:req.session.fname,last_name:req.session.lname,languages:req.session.langs,coder_day:req.session.days,favourite:req.session.favLang});
    }else{
        res.send("Fields cannot be null");
    }
});

app.post('/adding_coder',function (req,res) {

    var url = 'mongodb://localhost:27017/coder';

    var MongoClient = mongodb.MongoClient;

    MongoClient.connect(url,function (err,db) {
        if(err){
            console.log("Unabel to conncet");
            res.status(500).send('Something broke!');
        }else {
            console.log("Connection Established...");

            var collection = db.collection('coderdetail');

            var coder_detail = {
                first_name: req.session.fname,
                last_name: req.session.lname,
                languages: req.session.langs,
                days: req.session.days,
                favLang: req.session.favLang
            }

            collection.insert([coder_detail],function (err,result) {
                if(err){
                    console.log(err);
                    res.status(500).send('Something broke!');
                }else{
                    console.log("Data entered successfully");
                    res.redirect(307,"/display");
                }
                req.session.destroy();
                db.close();
            });

        }
        });

});

app.post('/clearAll',function (req,res) {
    req.session.destroy();
    res.redirect("/");
});

app.post('/display',function (req,res) {

    var url = 'mongodb://localhost:27017/coder';

    var MongoClient = mongodb.MongoClient;

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("Unabel to conncet");
            res.status(500).send('Something broke!');

        } else {
            console.log("Connection Established...");

            var collection = db.collection('coderdetail');

            collection.find({}).toArray(function (err, results) {
                if (err) {
                    res.status(500).send('Something broke!');
                } else if (results.length) {
                    res.render('coderlist', {'coderlist': results});
                } else {
                    res.status(500).send("No Document Found...");
                }

            });
        }
    });
});

app.all('*', function(req, res, next){
    if((req.method === 'GET' && req.url === '/add_coder_langs') ||
        (req.method === 'GET' && req.url === '/add_coder_days') ||
        (req.method === 'GET' && req.url === '/add_coder_favLang') ||
        (req.method === 'GET' && req.url === '/display_coder') ||
        (req.method === 'GET' && req.url === '/adding_coder') ||
        (req.method === 'GET' && req.url === '/display')
    )
    {
        var err = new Error();
        err.status = 405;
        next(err);
    }
    else
    {
        var err = new Error();
        err.status = 404;
        next(err);
    }
});
app.use(function(err,req, res,next) {
    if(err.status == 405)
    {
        res.status(405).send("I am sorry, This method is not allowed");
    }
    else if(err.status == 404)
    {
        res.send(404,"404 : The page that you are looking for does not exist ! :'(");

    }
    else if(err.status == 400)
    {
        res.send(404,"404 : Something went wrong with the parameters...");
    }
    else
    {
        console.log("error:"+err);
        var error = new Error(err);
        next(error);
    }
});

//For Handling 500 error
app.use(function(err,req, res,next) {
    res.status(500).send("Damnit... I am sorry.. We broke Something");

});


app.listen(8081,function () {
    console.log('Server Started at 8081');
});

