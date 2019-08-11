/*

Static initialization of the posts
*/
//https://stackoverflow.com/a/4611809/8618678
function toDateTime(secs) {

    //console.log(secs.toDateTime);
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t
}

function initializePosts() {

    const main = document.getElementById("main");
    var element = main.lastChild;
    while (element) {
        main.removeChild(element);
        element = main.lastChild;
    }
    const feedList = document.createElement("ul");
    feedList.setAttribute("class", "feed");
    feedList.setAttribute("data-id-feed", "");

    const feedHeader = document.createElement("div");
    feedHeader.setAttribute("class", "feed-header");

    const feedTitle = document.createElement("h3");
    feedTitle.innerHTML = "Most recent posts";

    const postButton = document.createElement("button");

    feedHeader.appendChild(feedTitle);
    feedList.appendChild(feedHeader);
    fetch("../data/feed.json", { credentials: 'include' })
        .then(response => response.json())
        .then((posts) => {

            for (var i = 0; i < Object.keys(posts.posts).length; i++) {
                var li = document.createElement("li");
                li.setAttribute("class", "post");
                li.setAttribute("data-id-post", "");

                var userDiv = document.createElement("div");
                userDiv.setAttribute("class", "user");
                userDiv.setAttribute("data-id-author", "");

                var userName = document.createElement("p");
                userName.innerText = posts.posts[i].meta.author;

                userDiv.appendChild(userName);

                var upvoteDiv = document.createElement("div");
                upvoteDiv.setAttribute("class", "vote");
                upvoteDiv.setAttribute("data-id-upvotes", "");

                var upvotes = Object.keys(posts.posts[i].meta.upvotes).length;

                var upvoteText = document.createElement("p");
                upvoteText.innerText = "Upvotes " + upvotes;

                upvoteDiv.appendChild(upvoteText);

                var titleDiv = document.createElement("div");
                titleDiv.setAttribute("class", "content");

                var h4 = document.createElement("h4");
                h4.setAttribute("data-id-title", "");
                h4.setAttribute("class", "post-title alt-text");
                h4.innerText = posts.posts[i].title;
                titleDiv.appendChild(h4);

                var contentDiv = document.createElement("div");
                contentDiv.setAttribute("class", "content");

                var para = document.createElement("p");
                para.innerText = posts.posts[i].text;

                contentDiv.appendChild(para);

                var subredditDiv = document.createElement("div");
                subredditDiv.setAttribute("class", "content");

                var para2 = document.createElement("p");
                para2.innerText = "SubSeddit: " + posts.posts[i].meta.subseddit;

                subredditDiv.appendChild(para2);


                var timeDiv = document.createElement("div");
                timeDiv.setAttribute("class", "content");

                var time = document.createElement("p");
                time.innerText = "Submitted at " + toDateTime(posts.posts[i].meta.published);

                timeDiv.appendChild(time);

                var commentsDiv = document.createElement("div");
                commentsDiv.setAttribute("class", "comments");

                var comments = Object.keys(posts.posts[i].comments).length;

                var commentText = document.createElement("p");
                commentText.innerText = "Comments " + comments;

                commentsDiv.appendChild(commentText);



                li.appendChild(userDiv);
                if (posts.posts[i].image) {
                    var imageDiv = document.createElement("div");
                    imageDiv.setAttribute("class", "thumbnail");
                    var image = new Image(200,200);
                    image.src = 'data:image/jpeg;base64,' + posts.posts[i].image;
            
                    imageDiv.appendChild(image);
                    li.appendChild(imageDiv);
                }
                li.appendChild(upvoteDiv);
                li.appendChild(titleDiv);
                li.appendChild(contentDiv);
                li.appendChild(subredditDiv);
                li.appendChild(timeDiv);
                li.appendChild(commentsDiv);

                feedList.appendChild(li);

            }



        });

    main.appendChild(feedList);
}

export default initializePosts