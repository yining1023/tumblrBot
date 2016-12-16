var tumblr = require('tumblr.js');
var config = require('./config.js');
var postsTobe = [];
var oldPostIds = [];



// find all the current posts' ids on the 100daysitp2017 blog
console.log(config);
var client = tumblr.createClient({ config });
console.log(client);
client.blogPosts('100daysitp2017.tumblr.com', function (err, data) {
	console.log('got ' + data.posts.length + ' oldPostIds');
	data.posts.forEach(function(post) {
		oldPostIds.push(post.id);
	});

	// find all the posts with tags '100daysofmaking', limit = 20
	var client = tumblr.createClient({ config.consumer_key });
	client.taggedPosts('lol', function (err, data) {
		console.log('got ' + data.length + ' taggedPosts');
		data.forEach(function(post) {
			postsTobe.push({
				'reblog_key': post.reblog_key,
				'id': post.id
			});
		});

		// reblog a post
		postsTobe.forEach(function(post) {
			var client = tumblr.createClient({ consumer_key: 'dCCvvgNze9Yauhy9RxAmgsxoESLHIdGgkorOFIMHuvxVPge4zE' });

			var options = {
				'id': post.id,
				'reblog_key': post.reblog_key
			}

			oldPostIds.forEach(function(oldpostid) {
				// if (post.id !== oldpostid)) {
				// 	console.log('post');
				// 	client.reblogPost('100daysitp2017.tumblr.com', options, function (err, data) {
				// 		if (err) {
				// 			console.log(err);
				// 		} else {
				// 			console.log('successfully reblogged a post with id: ' + data);
				// 		}
				// 	});
				// }
			});

		});

	});
});
