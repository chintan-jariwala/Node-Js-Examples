var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jade =  require('jade');
app.use(bodyParser());
app.set('views', './view');
app.set('view engine', 'jade');
app.engine('jade', jade.__express);

var details = {
    name:[],
    langs :[],
    days :[],
    fav_langs: [],
    lname:[]
};



app.get('/',function (req,res) {
    res.render('form');
});

app.post('/post_coder',function (req,res) {

    console.log('Name : - '+req.body.coder_name);
    console.log('Languages : - '+req.body.coder_langs);
    console.log('Days : - '+req.body.coder_days.toString());
    console.log('Fav Lang : - '+req.body.coder_fav_lang);
    console.log('Fav Lang : - '+req.body.coder_last_name);

    details.name.push(req.body.coder_name);
    details.langs.push(req.body.coder_langs);
    details.days.push(req.body.coder_days);
    details.fav_langs.push(req.body.coder_fav_lang);
    details.lname.push(req.body.coder_last_name);

    console.log(details.name + ", " +details.lname+ ", " + details.langs + ", " +details.days + ", " +details.fav_langs);
    var totals ='The total number of entries are : '+ details.name.length;

    res.render('form',{success:'Coder added Successfully',total:totals});
});

app.get('/coders',function (req,res) {

    var answers = {
        name:[],
        langs :[],
        days :[],
        fav_langs: [],
        lname:[]
    };

    console.log('User-Agent: ' + req.headers['user-agent']);



    var nameRes = req.param('firstname');
    var langsRes = req.param('languages');
    var langsArray = [];
    var daysArray = [];
    var daysRes = req.param('day');
    var favLangRes = req.param('Fav_Lang');

    if(nameRes != null || langsRes != null || daysRes != null || favLangRes != null) {


        for(var i=0;i<details.name.length;i++) {


            var daysAreThere = 0;
            var langsAreThere = 0;

            var langsIntheFile = [];
            var daysIntheFile = [];

            if (langsRes != null) {
                langsArray = langsRes.split(' ');
                console.log(details.langs[i]);
                langsIntheFile = details.langs[i].split(' ');

                for (var x = 0; x < langsArray.length; x++) {
                    for (var y = 0; y < langsIntheFile.length; y++) {
                        if ((langsIntheFile[y].toLowerCase()).indexOf(langsArray[x].toLowerCase()) > -1) {
                            langsAreThere = 1;
                        }
                    }
                }
            }

            if (daysRes != null) {
                daysArray = daysRes.split(' ');
                console.log(details.days[i]);
                daysIntheFile = details.days[i];
                console.log('Days we have : ' + daysIntheFile);
                console.log('Days we got : ' + daysArray);
                for (var x = 0; x < daysArray.length; x++) {
                    for (var y = 0; y < daysIntheFile.length; y++) {
                        if ((daysIntheFile[y].toLowerCase()).indexOf(daysArray[x].toLowerCase()) > -1) {
                            daysAreThere = 1;
                        }
                    }
                }
            }


            if ((nameRes != null && details.name[i].toLowerCase().indexOf(nameRes.toString().toLowerCase()) > -1) || nameRes == null) {
                if ((favLangRes != null && details.fav_langs[i].toLowerCase().indexOf(favLangRes.toString().toLowerCase()) > -1) || favLangRes == null) {
                    if (langsAreThere == 1 || langsRes == null) {
                        if (daysAreThere == 1 || daysRes == null) {

                            answers.name.push(details.name[i]);
                            answers.lname.push(details.lname[i]);
                            answers.langs.push(details.langs[i]);
                            answers.days.push(details.days[i]);
                            answers.fav_langs.push(details.fav_langs[i]);

                        }
                    }
                }

            }
        }
    }else{
        var i = 0;
        while(details.name.length > i){
            answers.name.push(details.name[i]);
            answers.lname.push(details.lname[i]);
            answers.langs.push(details.langs[i]);
            answers.days.push(details.days[i]);
            answers.fav_langs.push(details.fav_langs[i]);
            i++;
        }
    }
  
    res.setHeader('Cache-Control','no-cache');
    var isChrome =  req.headers['user-agent'];
    if(isChrome.toString().indexOf('Chrome') != -1){
        res.render('filtered_form',{values:answers,backcolor:'#FF69B4'});
    }else{
        res.render('filtered_form',{values:answers});
    }



});

app.get('/get_coder/firstname/:name',function (req,res) {
    var firstnameRes = req.params.name;

    var answers = {
        name:[],
        langs :[],
        days :[],
        fav_langs: [],
        lname:[]
    };

    if(firstnameRes != null){
        for(var i=0;i<details.name.length;i++){
            if(details.name[i].toLowerCase().indexOf(firstnameRes.toString().toLowerCase()) > -1){
                answers.name.push(details.name[i]);
                answers.lname.push(details.lname[i]);
                answers.langs.push(details.langs[i]);
                answers.days.push(details.days[i]);
                answers.fav_langs.push(details.fav_langs[i]);
            }
        }
    }
    var isChrome =  req.headers['user-agent'];
    if(isChrome.toString().indexOf('Chrome') != -1){
        res.render('filtered_form',{values:answers,backcolor:'#FF69B4'});
    }else{
        res.render('filtered_form',{values:answers});
    }

});

app.get('/get_coder/lastname/:name',function (req,res) {
    var lastnameRes = req.params.name;
    var answers = {
        name:[],
        langs :[],
        days :[],
        fav_langs: [],
        lname:[]
    };

    if(lastnameRes != null){
        for(var i=0;i<details.name.length;i++){
            if(details.lname[i].toLowerCase().indexOf(lastnameRes.toString().toLowerCase()) > -1){
                answers.name.push(details.name[i]);
                answers.lname.push(details.lname[i]);
                answers.langs.push(details.langs[i]);
                answers.days.push(details.days[i]);
                answers.fav_langs.push(details.fav_langs[i]);
            }
        }
    }
    var isChrome =  req.headers['user-agent'];
    if(isChrome.toString().indexOf('Chrome') != -1){
        res.render('filtered_form',{values:answers,backcolor:'#FF69B4'});
    }else{
        res.render('filtered_form',{values:answers});
    }

});


var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)

});