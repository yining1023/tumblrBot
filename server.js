// THIS TUMBLR BOT SEARCHES FOR POSTS WITH THE TAG #100daysofmaking AND REBLOGS EVERY
// POST IT IDENTIFIES EVERY NIGHT AT MIDNIGHT.

// IMPORT NECESSARY LIBRARIES
var tumblr = require('tumblr.js');

// GET THE CURRENT TIME FOR WHEN THE BOT STARTS
var currentdate = new Date(); 
var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

console.log("Bot starting at: "+ datetime);

var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 5000));

//For avoiding Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

// IMPORT API KEYS FROM SEPARATE CONFIG FILE
var config = require('./config'); //SEPARATE CONFIG FILE FOR STORING KEYS ETC

// INITIALIZE CLIENT WITH OBJECT FROM CONFIG FILE
// var client = tumblr.createClient( config );

// KEEP TRACK OF WHAT DAY IT IS FOR THE CHALLENGE (BOT WRITTEN ON DAY 15)
var dayCounter = 1;

var ESTdate = '2016-12-04';

// CREATE A BOOLEAN TO ENSURE CODE ONLY RUNS ONCE A DAY
var waiting = true;

setInterval(checkTime, 1000*15);

function checkTime() {

	console.log("checking time");
	var currentTime = new Date();
	console.log("checked at: " + currentTime);

	if (currentTime.getHours() === 4 && currentTime.getMinutes() === 59 && waiting == true) {
		setTimeout(reblogPosts, 1000 * 60);
		console.log("Waiting 1 minute before reblogging!");
		waiting = false;
	} else if (currentTime.getHours() === 12 && currentTime.getMinutes() === 0 && waiting == true) {
		// CHECK TODAY'S DATE
		var dateData = new Date(); 
		var year, month, day;
		year = dateData.getFullYear();

		// FORMAT THE DATE CORRECTLY FOR COMPARISION
		if (dateData.getMonth() < 9) month = '0' + (dateData.getMonth()+1).toString();
		else month = (dateData.getMonth()+1);
		if (dateData.getDate() < 9 ) day = '0' + (dateData.getDate()).toString();
		else day = dateData.getDate();

		var todayDate = year + '-' + month + '-' + day;

		ESTdate = todayDate;

		console.log("Saving EST date!");
	}

}

function reblogPosts() {

	console.log("Reblogging class posts");

	// Make the request
	var client = tumblr.createClient({ consumer_key: 'dCCvvgNze9Yauhy9RxAmgsxoESLHIdGgkorOFIMHuvxVPge4zE' });
	client.taggedPosts('100daysitp2017', function (err, data) {

		if (err) {
			console.log(err);
		} else {
			console.log(data);
			console.log('got ' + data.length + ' taggedPosts');
			//CHECK TODAY'S DATE
			var dateData = new Date(); 
			var year, month, day;
			year = dateData.getFullYear();

			//FORMAT THE DATE CORRECTLY FOR COMPARISION
			if (dateData.getMonth() < 9) month = '0' + (dateData.getMonth()+1).toString();
			else month = (dateData.getMonth()+1);
			if (dateData.getDate() < 9 ) day = '0' + (dateData.getDate()).toString();
			else day = dateData.getDate();

			var todayDate = year + '-' + month + '-' + day;

			// console.log(typeof(data));
			// console.log(data.length);

		 	// // UNCOMMENT TO SAVE THE JSON RESPONSE FILE
		    // var json = JSON.stringify(data,null,2);
			// fs.writeFile("tagsData.json", json, function(){console.log("writing json response")});
				
			var client = tumblr.createClient({
			  consumer_key: 'dCCvvgNze9Yauhy9RxAmgsxoESLHIdGgkorOFIMHuvxVPge4zE',
			  consumer_secret: 'VqW02VQR5Q8rEaTuJjm6zK3pUA9Ibb7W9TSEuuhDtAEQz8RlLt',
			  token: 'EWNOyDKWS63AV48nMNVREKZPs5GzTDmHxGWlY0e0otb9pyqPJy',
			  token_secret: 'RMS19QPXxAciZRbRjYkwTeEfiw84vb7stERGvqgh2NhhqPXNev'
			});
			for (var i = 0; i < data.length; i++) {
				// // //RETRIEVE TODAY'S DATE
			  var dateToCheck = (data[i].date).toString();

			  console.log("user date: " + dateToCheck);

				// // SPLIT THE STRING TO GET DATE INTO THE FORMAT YYYY-MM-DD
				var splitDate = dateToCheck.split(" ");

				var postDate = splitDate[0];

				console.log("est: " + ESTdate);
				console.log("post date: " + splitDate[0]);

				// THE DATE YYYY-MM-DD IS THE FIRST OBJECT IN THE ARRAY, CHECK THIS AGAINST THE DATE
				// FOUND IN THE RESPONSE.  IF THEY ARE THE SAME, THE POST IS FROM THE CURRENT DAY, SO
				// REPOST IT TO THE CLASS BLOG
				// if(ESTdate === todayDate) 
				// if(ESTdate === splitDate)
				if (ESTdate === postDate) {
					var name = data[i].blog_name;

					// PRINT POST DETAILS TO THE CONSOLE
					console.log("-----");
					console.log("id: " + data[i].id);
					console.log("name: " + name);
					console.log("reblog_key: " + data[i].reblog_key);
					console.log("date: " + postDate);
					console.log("-----");

					// CREATE OBJECT WITH ALL THE POSTS INFORMATION
					var postData = {
						id: data[i].id,
						reblog_key: data[i].reblog_key,
						comment: "Day " + dayCounter + " - Post by " + name + " on " + postDate
					}

					console.log(postData);

					// SUBMIT POST REQUEST
					client.reblogPost('100daysitp2017.tumblr.com', postData, function postCallBack(err, data, response)
					{
						if (err) console.log(err);
						else console.log("successfully reposted");
					});
					
				} else {
					console.log("skipping old post");
				}	
			}
		}

	});
	console.log("waiting 24 hours before next post");
	waiting = true;
	setTimeout(updateCounter, 1000*30);
}

function updateCounter() {
	var currentTime = new Date();
	var stateingDate = new Date(2017, 01, 26);
	if (currentTime.getTime() - startClass.getTime() > 0) {
		dayCounter++;
	} else {
		console.log('waiting until 2017/01/26 to add day number');
	}
}