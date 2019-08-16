/*

Static initialization of the posts
*/

//Taken from: https://stackoverflow.com/a/4611809/8618678
function toDateTime(secs) {

    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t.toLocaleString();
}

function updateField(feedList, res){
    for (var i = 0; i < Object.keys(res.posts).length; i++) {
        var li = document.createElement("li");
        li.setAttribute("class", "post");
        li.setAttribute("data-id-post", "");

        var upvoteDiv = document.createElement("div");
        upvoteDiv.setAttribute("class", "vote");
        upvoteDiv.style.width = "70px";

        var upvotes = Object.keys(res.posts[i].meta.upvotes).length;

        var upvoteText = document.createElement("p");
        upvoteText.innerText = "Upvotes\n\n " + upvotes;
        upvoteText.setAttribute("data-id-upvotes", "");

        upvoteDiv.appendChild(upvoteText);


        var contentDiv = document.createElement("div");
        contentDiv.setAttribute("class", "flex-container");
        contentDiv.style.display = "flex";
        contentDiv.style.flexWrap = "wrap";
        contentDiv.style.flexDirection = "column";
        contentDiv.style.justifyContent = "flex-end";
        contentDiv.style.margin = "0px";

        var titleDiv = document.createElement("div");
        titleDiv.setAttribute("class", "content");

        var h4 = document.createElement("h4");
        h4.setAttribute("data-id-title", "");
        h4.setAttribute("class", "post-title alt-text");
        h4.innerText = res.posts[i].title;
        titleDiv.appendChild(h4);

        contentDiv.appendChild(titleDiv);

        var postDiv = document.createElement("div");
        postDiv.setAttribute("class", "content");
        var para = document.createElement("p");
        para.innerText = res.posts[i].text;

        postDiv.appendChild(para);
        contentDiv.appendChild(postDiv);

        var bottomRowList = document.createElement("ul");
        bottomRowList.setAttribute("class", "flat-list");
        //bottomRowList.style.display = "inline";
        bottomRowList.style.zoom = 1;
        bottomRowList.style.listStyleType = "none";
        bottomRowList.style.margin = 0;
        bottomRowList.style.padding = 0;
        bottomRowList.style.overflow = "hidden";
        bottomRowList.style.textAlign = "center";
        bottomRowList.style.alignSelf = "flex-end";

        var userli = document.createElement("li");
        userli.setAttribute("class", "user");
        //userli.style.marginLeft = "200px";
        userli.style.display = "inline-block";

        var userName = document.createElement("p");
        userName.innerText = "Submitted by: " + res.posts[i].meta.author;
        userName.setAttribute("data-id-author", "");

        userli.appendChild(userName);
        bottomRowList.appendChild(userli);

        var subredditLi = document.createElement("li");
        subredditLi.setAttribute("class", "content");
        subredditLi.style.display = "inline-block";

        var para2 = document.createElement("p");
        para2.innerText = "to /s/" + res.posts[i].meta.subseddit;

        subredditLi.appendChild(para2);

        bottomRowList.appendChild(subredditLi);


        var timeLi = document.createElement("li");
        timeLi.setAttribute("class", "content");
        timeLi.style.display = "inline-block";
        var time = document.createElement("p");
        time.innerText = "Submitted at " + toDateTime(res.posts[i].meta.published);

        timeLi.appendChild(time);

        var commentsLi = document.createElement("li");
        commentsLi.setAttribute("class", "comments");
        commentsLi.style.display = "inline-block";
        var comments = Object.keys(res.posts[i].comments).length;

        var commentText = document.createElement("p");
        commentText.innerText = "Comments " + comments;

        commentsLi.appendChild(commentText);

        bottomRowList.appendChild(timeLi);
        bottomRowList.appendChild(commentsLi);

        contentDiv.appendChild(bottomRowList);
        li.appendChild(upvoteDiv);
        if (res.posts[i].image) {
            var imageDiv = document.createElement("div");
            imageDiv.setAttribute("class", "thumbnail");
            var image = new Image(80, 80);
            image.src = 'data:image/jpeg;base64,' + res.posts[i].image;

            imageDiv.appendChild(image);
            imageDiv.style.marginLeft = "15px";
            li.appendChild(imageDiv);
        }
        else {
            contentDiv.style.marginLeft = "95px";
        }
        li.appendChild(contentDiv);
        feedList.appendChild(li);

    }
}

function initializePosts(apiUrl) {

    const main = document.getElementById("main");
    var element = main.lastChild;
    while (element) {
        main.removeChild(element);
        element = main.lastChild;
    }
    const feedListDiv = document.createElement("div");
    feedListDiv.setAttribute("class", "flex-container");
    feedListDiv.style.position = "relative";

    const feedList = document.createElement("ul");
    feedList.setAttribute("class", "feed");
    feedList.setAttribute("data-id-feed", "");
    feedListDiv.appendChild(feedList);

    const feedHeader = document.createElement("div");
    feedHeader.setAttribute("class", "feed-header");

    const feedTitle = document.createElement("h3");
    feedTitle.innerText = "Most recent posts";

    const postButton = document.createElement("button");
    const emptyFeedLi = document.createElement("li");
    emptyFeedLi.setAttribute("class", "post");
    emptyFeedLi.style.position = "center";
    const emptyFeed = document.createElement("p");
    emptyFeed.style.fontSize = "15";
    emptyFeed.style.position = "center";
    emptyFeed.innerText = "There seems to be nothing here!";
    emptyFeedLi.appendChild(emptyFeed);

    if (sessionStorage.getItem('username')) {
        document.getElementById("signupBtn").style.visibility = "hidden";
        document.getElementById("loginBtn").style.visibility = "hidden";
        const usertext = document.createElement("label");
        usertext.innerText = "Hi " + sessionStorage.getItem('username') + "!";
        usertext.style.fontSize = "15px";
        const ulItem = document.createElement("li");
        ulItem.setAttribute("class", "nav-item");
        ulItem.appendChild(usertext);
        const list = document.getElementById("buttonList");
        list.appendChild(ulItem);
    }

    feedHeader.appendChild(feedTitle);
    feedList.appendChild(feedHeader);
    if (sessionStorage.getItem("token")) {
        fetch(apiUrl + "/user/feed", {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': "Token " + sessionStorage.getItem("token")
            }
        }).then(result => result.json()).then(function(res){
            feedTitle.innerText = "Your personalized feed";
            if(res.posts.length === 0){
                feedList.appendChild(emptyFeedLi);
            }else{
                var child = feedList.firstChild;
                while (feedList.firstChild){
                    feedList.remove(child);
                    child = feedList.firstChild;
                }
                updateField(feedList, res);
            }
        });
    } else {
        fetch(apiUrl + "/post/public", {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        }).then(result => result.json()).then(function(res){
            feedTitle.innerText = "Most recent posts";
            updateField(feedList, res);
        });
    }
    
    main.appendChild(feedListDiv);
}

export default initializePosts