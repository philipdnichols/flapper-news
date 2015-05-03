# flapper-news
Implementation and extension of the MEAN Stack tutorial from thinkster.io (https://thinkster.io/mean-stack-tutorial/)

Reddit clone :)

Independent exercises (end of the tutorial):
* feature downvote: Implement a 'downvoting' feature
* feature vote once: Only allow authenticated users to vote once.
* feature number of comments: Display the number of comments next to each post on the main page
* feature hide new comments box: use ng-hide to hide the 'new comment' and 'new post' input box until a user clicks a button to see the field
* 

Independent exercises (thought up by myself, though, Reddit itself is the design document :) )
* feature: delete comments and posts: only authenticated user (and the user who posted the post or comment) (server and client)
* feature: upvoting causes the downvote to go away, and vice versa.
* feature: upvoting and already-upvoted (and vice versa) post/comment will un-upvote/downvote the post/comment

###To run:
1. ``cd`` to ``flapper-news`` root directory
2. ``npm install``
3. ```set DEBUG=flapper-news:server & npm start``` (Windows) | ```DEBUG=flapper-news:server npm start``` (Mac and Linux)
