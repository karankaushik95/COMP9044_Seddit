/*
Initialization of the posts
*/

import initApp from './main.js';
import viewProfile from './profile.js';

//Taken from: https://stackoverflow.com/a/4611809/8618678
function toDateTime(secs) {

    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t.toLocaleString();
}

function updateField(feedList, res) {

    for (var i = 0; i < Object.keys(res.posts).length; i++) {
        const li = document.createElement("li");
        li.setAttribute("class", "post");
        li.setAttribute("data-id-post", "");
        li.style.objectFit = "cover";
        const upvoteDiv = document.createElement("div");
        upvoteDiv.setAttribute("class", "vote");
        upvoteDiv.setAttribute("data-id-upvotes", "");


        const upvotes = Object.keys(res.posts[i].meta.upvotes).length;
        const upArrow = document.createElement("div");
        upArrow.setAttribute("class", "arrow-up");
        const upvoteText = document.createElement("p");
        upvoteText.setAttribute("class", "upvoteText");
        upvoteText.innerText = upvotes;
        
        upvoteDiv.appendChild(upArrow);
        upvoteDiv.appendChild(upvoteText);


        const contentDiv = document.createElement("div");
        
        contentDiv.style.backgroundColor = "#D0E5F5";
        contentDiv.setAttribute("class", "flex-container");
        contentDiv.style.display = "flex";
        contentDiv.style.flexWrap = "wrap";
        contentDiv.style.flexDirection = "column";
        contentDiv.style.justifyContent = "flex-end";
        contentDiv.style.margin = "0px";

        const topRow = document.createElement("div");
        const subsedditText = document.createElement("p");
        subsedditText.innerText = "/s/" + res.posts[i].meta.subseddit;
        
        const userName = document.createElement("p");
        userName.innerText = "Submitted by u/" + res.posts[i].meta.author;
        userName.setAttribute("data-id-author", "");
        
        topRow.appendChild(subsedditText);
        topRow.appendChild(userName);
        contentDiv.appendChild(topRow);

        const titleDiv = document.createElement("div");
        titleDiv.setAttribute("class", "content");

        const h4 = document.createElement("h4");
        h4.setAttribute("data-id-title", "");
        h4.setAttribute("class", "post-title alt-text");
        h4.innerText = res.posts[i].title;
        titleDiv.appendChild(h4);

        contentDiv.appendChild(titleDiv);

        const postDiv = document.createElement("div");
        postDiv.setAttribute("class", "content");
        
        const para = document.createElement("p");
        para.innerText = res.posts[i].text;
        const lastRow = document.createElement("div");

        const time = document.createElement("p");
        time.innerText = toDateTime(res.posts[i].meta.published);

        
        lastRow.appendChild(time);
        
        
        const comments = Object.keys(res.posts[i].comments).length;

        const commentText = document.createElement("p");
        commentText.innerText = "Comments " + comments;
        lastRow.appendChild(commentText);
        
        if (res.posts[i].image) {
            const image = new Image(80, 80);
            image.src = 'data:image/jpeg;base64,' + res.posts[i].image;
            postDiv.appendChild(image);
        }
        postDiv.appendChild(para);
        contentDiv.appendChild(postDiv);
        contentDiv.appendChild(lastRow);
        
        li.appendChild(upvoteDiv);
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

    const feedList = document.createElement("ul");
    feedList.setAttribute("id", "feed");
    feedList.setAttribute("data-id-feed", "");
    feedList.classList.add('feed');

    const feedHeader = document.createElement("div");
    feedHeader.setAttribute("class", "feed-header");
    feedHeader.classList.add('feed-header');
    
    const feedTitle = document.createElement("h3");
    feedTitle.setAttribute("class", "feed-title alt-text");
    feedTitle.innerText = "Most recent posts";
    feedHeader.classList.add('feed-header');

    const postButton = document.createElement("button");
    postButton.setAttribute('class', 'button button-secondary');
    postButton.innerText = "Post";

    const emptyFeedLi = document.createElement("li");
    emptyFeedLi.setAttribute("class", "post");
    emptyFeedLi.style.position = "center";
    const emptyFeed = document.createElement("p");
    emptyFeed.style.fontSize = "15";
    emptyFeed.style.position = "center";
    emptyFeed.innerText = "There seems to be nothing here!";
    emptyFeedLi.appendChild(emptyFeed);

    
    feedHeader.appendChild(feedTitle);
    feedHeader.appendChild(postButton);

    feedList.appendChild(feedHeader);

    if (sessionStorage.getItem('username')) {
        document.getElementById("signupBtn").style.visibility = "hidden";
        document.getElementById("loginBtn").style.visibility = "hidden";
        const userText = document.createElement("button");
        userText.setAttribute("class", "button button-link");
        userText.innerText = "Hi " + sessionStorage.getItem('username') + "!";
        userText.style.backgroundColor = "white";
        userText.style.border = "none";
        userText.style.textTransform = "inherit";
        userText.setAttribute("data-toggle","modal");
        
        userText.addEventListener('click', function(event){
            // Had to do it this way otherwise it was just triggering on load which is not fun
            event.preventDefault();
            viewProfile(apiUrl, sessionStorage.getItem('username'));
            userText.setAttribute("data-target",document.getElementById("profileModal"));
        });

        const ulItem = document.createElement("li");
        ulItem.setAttribute("class", "nav-item");
        ulItem.setAttribute("id", "userText");
        ulItem.appendChild(userText);

        

        const ulItem1 = document.createElement("li");
        ulItem1.setAttribute("class", "nav-item");
        ulItem1.setAttribute("id", "signOutText");

        const signOutBtn = document.createElement("button");
        signOutBtn.setAttribute("id", "signOutBtn");
        signOutBtn.setAttribute("class", "button button-primary");
        signOutBtn.innerText = "Sign out";

        ulItem1.appendChild(signOutBtn);

        const list = document.getElementById("buttonList");
        list.appendChild(ulItem);
        list.appendChild(ulItem1);


        userText.addEventListener('mouseenter', e => {
            userText.style.color = "blue";
            userText.style.textDecoration = "underline";
        });

        userText.addEventListener('mouseleave', e => {
            userText.style.color = "black";
            userText.style.textDecoration = "none";
        });

        signOutBtn.addEventListener('click', e => {
            sessionStorage.clear();
            alert("We're sorry to see you go! Hope to see you again soon!");
            
            var temp = list.firstChild;
            while (temp){
                list.removeChild(temp);
                temp = list.firstChild;
            }
            initApp(apiUrl);
        });
    }

    if (sessionStorage.getItem("token")) {
        fetch(apiUrl + "/user/feed", {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': "Token " + sessionStorage.getItem("token")
            }
        }).then(result => result.json()).then(function (res) {
            feedTitle.innerText = "Your personalized feed";
            if (res.posts.length === 0) {
                feedList.appendChild(emptyFeedLi);
            } else {
                var child = feedList.firstChild;
                while (feedList.firstChild) {
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
        }).then(result => result.json()).then(function (res) {
            feedTitle.innerText = "Most recent posts";
            updateField(feedList, res);
        });
    }

    main.appendChild(feedList);
}

export default initializePosts