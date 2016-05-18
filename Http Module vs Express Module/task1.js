var http = require('http');
var fs = require('fs');
var util = require('util');
var querystring = require('querystring');

var details = {
    name:[],
    langs :[],
    days :[],
    fav_langs: []
};


var server = http.createServer(function (req,res) {
    if(req.method.toLowerCase() == 'get'){
        if(req.url == '/coders'){
            displayCoders(req,res);
        }else if(req.url =='/') {
          displayFrom(res);
        }else{
            displayFiltered(req,res);
        }


    }else if(req.method.toLowerCase() == 'post'){
        if(req.url == '/post_coder'){
            processForm(req,res);
        }

    }
});

function displayFrom(res) {
    fs.readFile('form.html',function (err,data) {
        res.writeHead(200,{
            'Content-Type' : 'text/html',
            'Content-Length' : data.length
        });
        res.write(data);
        res.end();
    });
}

function processForm(req,res){
    console.log("[200] " + req.method + " to " + req.url);
    var formdata = '';
    req.on('data', function(chunk) {
        console.log("Received body data:");
        formdata += chunk.toString();
    });

    req.on('end', function() {
        res.writeHead(200, "OK", {'Content-Type': 'text/html'});

        var postParams = querystring.parse(formdata);
        res.writeHead(200, "OK", {'Content-Type': 'text/html'});
        res.write('<html><head><title>Post Coder!</title></head><body>');

            details.name.push(postParams.coder_name);
            details.langs.push(postParams.coder_langs);
            details.days.push(postParams.coder_days);
            details.fav_langs.push(postParams.coder_fav_lang);
            res.write('Entry Successful....<br/><br/>');

            //res.write('<h1>Parameters Cannot be empty.. </h1> <br/><br/>');


        res.write('Total number of Entries : '+details.name.length+' <br/> ');
        console.log(details.name + ", " + details.langs + ", " +details.days + ", " +details.fav_langs);

        fs.readFile('form.html',function (err,data) {
            res.write(data);
            res.end();
        });

    });
}

function displayCoders(req,res) {
    var isChrome =  req.headers['user-agent'];
    console.log(isChrome);
    res.writeHead(200, {
        'Cache-Control': 'no-cache'
    });
    res.write('<html><head><title>Post Coder!</title></head>');
        if(isChrome.toString().indexOf('Chrome') != -1){
            res.write('<body bgcolor="#ff69b4">');
        }else{
        res.write('<body>');
        }

    var i = 0;
    while(details.name.length > i){
        res.write('First Name : = '+details.name[i] +' <br/> ');
        res.write('Languages : = ');
        res.write(details.langs[i]+' , ');
        res.write('<br/>');
        res.write('Days : = ');
        res.write(details.days[i]+' , ');
        res.write('<br/>');
        res.write('Favourite Language : = '+details.fav_langs[i]+' <br/> ');
        res.write('<br/>');
        res.write('<br/>');
        i++;
    }
    res.write('</body></html>');
    res.end();
}

function displayFiltered(req,res) {
    var str = req.url.toString();

    if(str.indexOf('firstname') > -1 || str.indexOf('languages') > -1 || str.indexOf('day') > -1 || str.indexOf('favLang') > -1){

        var parseIt = querystring.parse(require('url').parse(str).query);
        var nameRes = parseIt.firstname;
        var langsRes = parseIt.languages;
        var langsArray = [];
        var daysArray = [];
        console.log(parseIt);
        var daysRes = parseIt.day;

        var favLangRes = parseIt.favLang;

        res.writeHead(200, {
            'Cache-Control': 'no-cache'
        });
        res.write('<html><head><title>Post Coder!</title></head>');



        var  i;
            for(i=0;i<details.name.length;i++){

                var daysAreThere = 0;
                var langsAreThere = 0;

                var langsIntheFile = [];
                var daysIntheFile = [];

                if(langsRes != null) {
                    langsArray = langsRes.split(' ');
                    langsIntheFile = details.langs[i].split(' ');

                    for(var x=0;x<langsArray.length;x++){
                        for(var y=0;y<langsIntheFile.length;y++){
                            if((langsIntheFile[y].toLowerCase()).indexOf(langsArray[x].toLowerCase()) > -1){
                                langsAreThere = 1;
                            }
                        }
                    }
                }

                if(daysRes != null){
                    daysArray = daysRes.split(' ');
                    daysIntheFile = details.days[i];
                    console.log('Days we have : '+daysIntheFile);
                    console.log('Days we got : '+daysArray);
                    for(var x=0;x<daysArray.length;x++){
                        for(var y=0;y<daysIntheFile.length;y++){
                            if((daysIntheFile[y].toLowerCase()).indexOf(daysArray[x].toLowerCase()) > -1){
                                daysAreThere = 1;
                            }
                        }
                    }
                }
                if((nameRes != null && details.name[i].toLowerCase().indexOf(nameRes.toString().toLowerCase()) > -1) || nameRes == null)
                {
                    if((favLangRes != null && details.fav_langs[i].toLowerCase().indexOf(favLangRes.toString().toLowerCase()) > -1) || favLangRes == null){
                        if(langsAreThere == 1 || langsRes == null){
                            if(daysAreThere == 1 || daysRes == null){

                                res.write('First Name : = '+details.name[i] +' <br/> ');
                                res.write('Languages : = ');
                                res.write(details.langs[i]+' , ');
                                res.write('<br/>');
                                res.write('Days : = ');
                                res.write(details.days[i]+' , ');
                                res.write('<br/>');
                                res.write('Favourite Language : = '+details.fav_langs[i]+' <br/> ');
                                res.write('<br/>');
                                res.write('<br/>');

                            }
                        }
                    }

                }
            }

    }
    res.end('</body></html>');
}

server.listen(8081);
console.log("server listening on 8081");
