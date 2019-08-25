/*
Initialization of the posts
*/

import initApp from './main.js';
import viewProfile from './profile.js';
import commentListener from './commentModal.js';
import upvoteListener from './upvoteModal.js';
import newPost from './postModal.js';

//Taken from: https://stackoverflow.com/a/4611809/8618678
function toDateTime(secs) {

    var t = new Date(1970, 0, 1); // Epoch
    var options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: 'true' };
    t.setSeconds(secs);
    return t.toLocaleString('en-GB', options);
}

function updateField(feedList, res, apiUrl) {
    var sortable = Object.values(res);
    //console.log(sortable);
    sortable.sort(function (a, b) {
        return b.meta.published - a.meta.published;
    });
    sortable = sortable[0];
    for (var i = 0; i < sortable.length; i++) {

        const li = document.createElement("li");
        li.setAttribute("class", "post");
        li.setAttribute("data-id-post", "");

        const upvoteDiv = document.createElement("div");
        upvoteDiv.setAttribute("class", "vote");
        upvoteDiv.setAttribute("data-id-upvotes", "");
        //console.log(sortable[i].id);

        const upvotes = sortable[i].meta.upvotes.length;
        const upArrow = document.createElement("div");
        upArrow.setAttribute("class", "arrow-up" + sortable[i].id);
        upArrow.setAttribute("id", i);
        upArrow.classList.add("arrow-up");
        upArrow.setAttribute("title", "I like this!");
        if (sessionStorage.getItem('token')) {
            if (sortable[i].meta.upvotes.includes(parseInt(sessionStorage.getItem('id')))) {
                upArrow.style.borderColor = "orange";
            }
        }


        const upvoteText = document.createElement("p");
        upvoteText.setAttribute("class", "upvoteText" + sortable[i].id);
        upvoteText.classList.add("upvoteText");
        upvoteText.setAttribute("id", "upvote-text");
        upvoteText.setAttribute("title", "View Upvoters");
        upvoteText.innerText = upvotes;

        upvoteDiv.appendChild(upArrow);
        upvoteDiv.appendChild(upvoteText);


        const contentDiv = document.createElement("div");

        contentDiv.style.backgroundColor = "#D0E5F5";
        contentDiv.setAttribute("class", "flex-container");
        contentDiv.style.display = "flex";
        contentDiv.style.width = "100%";
        // contentDiv.style.flexWrap = "wrap";
        contentDiv.style.flexDirection = "column";
        //contentDiv.style.justifyContent = "flex-end";

        const topRow = document.createElement("div");
        topRow.setAttribute("id", "topRow");
        const subsedditText = document.createElement("p");
        subsedditText.innerText = "/s/" + sortable[i].meta.subseddit;
        subsedditText.style.display = "inline-block";
        subsedditText.setAttribute("class", "subseddit");

        const userName = document.createElement("p");
        userName.innerText = "Submitted by u/" + sortable[i].meta.author;
        userName.setAttribute("data-id-author", "");
        userName.setAttribute("class", "post-author");
        userName.setAttribute("title", "View profile of user " + sortable[i].meta.author);
        userName.style.display = "inline-block";

        topRow.appendChild(subsedditText);
        topRow.appendChild(userName);
        contentDiv.appendChild(topRow);

        const titleDiv = document.createElement("div");
        titleDiv.setAttribute("class", "post-title");

        const h4 = document.createElement("h4");
        h4.setAttribute("data-id-title", "");
        h4.setAttribute("class", "post-title alt-text");
        h4.innerText = sortable[i].title;
        titleDiv.appendChild(h4);

        contentDiv.appendChild(titleDiv);

        const postDiv = document.createElement("div");
        postDiv.setAttribute("class", "post-content");


        const para = document.createElement("p");
        para.innerText = sortable[i].text;
        para.style.display = "inline";
        para.setAttribute("class", "post-content");

        const lastRow = document.createElement("div");

        const time = document.createElement("p");
        time.style.display = "inline-block";
        time.setAttribute("class", "time");
        time.innerText = toDateTime(sortable[i].meta.published);


        lastRow.appendChild(time);


        const comments = sortable[i].comments.length;

        const commentText = document.createElement("p");
        commentText.innerText = "Comments: " + comments;
        commentText.style.display = "inline-block";
        commentText.setAttribute("class", "comments " + sortable[i].id);
        commentText.setAttribute("title", "View all comments");

        lastRow.appendChild(commentText);

        if (res.posts[i].image) {
            const image = new Image(80, 80);
            image.src = 'data:image/jpeg;base64,' + sortable[i].image;
            image.style.display = "inline-block";
            image.setAttribute("class", "post-image");
            postDiv.appendChild(image);
        }
        postDiv.appendChild(para);
        contentDiv.appendChild(postDiv);
        contentDiv.appendChild(lastRow);

        li.appendChild(upvoteDiv);
        li.appendChild(contentDiv);
        feedList.appendChild(li);

    }

    feedList.addEventListener('click', function (event) {
        event.preventDefault();
        if (event.target.className === "post-author") {
            //console.log();
            var username = event.target.innerText.substring(15);
            viewProfile(apiUrl, username);
        } else if (event.target.className.includes("comment")) {
            var id = event.target.className.toString();
            id = id.replace(/\D+/g, '');
            commentListener(apiUrl, id);
        } else if (event.target.className.includes("upvoteText")) {
            var id = event.target.className.toString();
            id = id.replace(/\D+/g, '');
            upvoteListener(apiUrl, id);
        } else if (event.target.className.includes("arrow-up")) {
            var id = event.target.className.toString();
            id = id.replace(/\D+/g, '');

            if (sessionStorage.getItem('token')) {
                if (sortable[event.target.id].meta.upvotes.includes(parseInt(sessionStorage.getItem('id')))) {
                    fetch(apiUrl + "/post/vote?id=" + id, {
                        method: 'DELETE',
                        headers: {
                            'accept': 'application/json',
                            'Authorization': 'Token ' + sessionStorage.getItem('token')
                        }
                    }).then(resp => resp.json()).then(function (response) {
                        initializePosts(apiUrl);
                    });
                } else {
                    fetch(apiUrl + "/post/vote?id=" + id, {
                        method: 'PUT',
                        headers: {
                            'accept': 'application/json',
                            'Authorization': 'Token ' + sessionStorage.getItem('token')
                        }
                    }).then(resp => resp.json()).then(function (response) {
                        initializePosts(apiUrl);
                    });
                }
            } else {
                alert("This feature is only available to members of Seddit! Make an account today");
                return;
            }
        }

    });
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
    postButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (!sessionStorage.getItem('token')) {
            alert("This feature is only available to members of Seddit! Make an account today");
            return;
        }else{
            newPost(apiUrl);
        }
    });

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
        if (!document.getElementById("user_exists")) {
            const userText = document.createElement("button");
            userText.setAttribute("class", "button button-link");
            userText.setAttribute("id", "user_exists");
            userText.innerText = "Hi " + sessionStorage.getItem('username') + "!";
            userText.style.backgroundColor = "white";
            userText.style.border = "none";
            userText.style.textTransform = "inherit";
            userText.setAttribute("data-toggle", "modal");

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

            userText.addEventListener('click', function (event) {
                // Had to do it this way otherwise it was just triggering on load which is not fun
                event.preventDefault();
                viewProfile(apiUrl, sessionStorage.getItem('username'));
                userText.setAttribute("data-target", document.getElementById("profileModal"));
            });

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
                while (temp) {
                    list.removeChild(temp);
                    temp = list.firstChild;
                }
                initApp(apiUrl);
            });
        }
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
                updateField(feedList, res, apiUrl);
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
            updateField(feedList, res, apiUrl);
        });
    }

    main.appendChild(feedList);
}

export default initializePosts;