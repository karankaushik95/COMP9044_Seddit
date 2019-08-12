/*

Static initialization of the posts
*/

//Taken from: https://stackoverflow.com/a/4611809/8618678
function toDateTime(secs) {

    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t.toLocaleString();
}

function initializePosts(apiUrl) {
    
    const main = document.getElementById("main");
    var element = main.lastChild;
    while (element) {
        main.removeChild(element);
        element = main.lastChild;
    }
    const feedListDiv = document.createElement("div");
    feedListDiv.setAttribute("class", "flex-container") ;
    
    const feedList = document.createElement("ul");
    feedList.setAttribute("class", "feed");
    feedList.setAttribute("data-id-feed", "");
    feedListDiv.appendChild(feedList);

    const feedHeader = document.createElement("div");
    feedHeader.setAttribute("class", "feed-header");

    const feedTitle = document.createElement("h3");
    feedTitle.innerHTML = "Most recent posts";

    const postButton = document.createElement("button");

    feedHeader.appendChild(feedTitle);
    feedList.appendChild(feedHeader);
    if(sessionStorage.getItem("token")){
        console.log("Logged in");
        fetch(apiUrl + "/user/feed",  {
            method : 'GET',
            headers:{
                'accept'    : 'application/json',
                'Authorization' : "Token " + sessionStorage.getItem("token")
            }
        }).then(result => result.json()).then(res => console.log(res));
    }else{
        console.log("WOOP");
        fetch(apiUrl + "/post/public", {
            method : 'GET',
            headers:{
                'accept'    : 'application/json'
            }
        }).then(result => result.json()).then(res => console.log(res));
    }
    fetch("../data/feed.json", { credentials: 'include' })
        .then(response => response.json())
        .then((posts) => {

            for (var i = 0; i < Object.keys(posts.posts).length; i++) {
                var li = document.createElement("li");
                li.setAttribute("class", "post");
                li.setAttribute("data-id-post", "");

                var upvoteDiv = document.createElement("div");
                upvoteDiv.setAttribute("class", "vote");
                upvoteDiv.style.width = "70px";
                
                var upvotes = Object.keys(posts.posts[i].meta.upvotes).length;

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
                h4.innerText = posts.posts[i].title;
                titleDiv.appendChild(h4);

                contentDiv.appendChild(titleDiv);

                var postDiv = document.createElement("div");
                postDiv.setAttribute("class", "content");
                var para = document.createElement("p");
                para.innerText = posts.posts[i].text;

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
                userName.innerText = "Submitted by: " + posts.posts[i].meta.author;
                userName.setAttribute("data-id-author", "");

                userli.appendChild(userName);
                bottomRowList.appendChild(userli);
                
                var subredditLi = document.createElement("li");
                subredditLi.setAttribute("class", "content");
                subredditLi.style.display = "inline-block";

                var para2 = document.createElement("p");
                para2.innerText = "to /s/" + posts.posts[i].meta.subseddit;

                subredditLi.appendChild(para2);

                bottomRowList.appendChild(subredditLi);


                var timeLi = document.createElement("li");
                timeLi.setAttribute("class", "content");
                timeLi.style.display = "inline-block";    
                var time = document.createElement("p");
                time.innerText = "Submitted at " + toDateTime(posts.posts[i].meta.published);

                timeLi.appendChild(time);

                var commentsLi = document.createElement("li");
                commentsLi.setAttribute("class", "comments");
                commentsLi.style.display = "inline-block";
                var comments = Object.keys(posts.posts[i].comments).length;

                var commentText = document.createElement("p");
                commentText.innerText = "Comments " + comments;

                commentsLi.appendChild(commentText);

                bottomRowList.appendChild(timeLi);
                bottomRowList.appendChild(commentsLi);

                contentDiv.appendChild(bottomRowList);    
                li.appendChild(upvoteDiv);
                if (posts.posts[i].image) {
                    var imageDiv = document.createElement("div");
                    imageDiv.setAttribute("class", "thumbnail");
                    var image = new Image(80,80);
                    image.src = 'data:image/jpeg;base64,' + posts.posts[i].image;
            
                    imageDiv.appendChild(image);
                    imageDiv.style.marginLeft = "15px";
                    li.appendChild(imageDiv);
                }
                else{
                    contentDiv.style.marginLeft = "95px";
                }
                li.appendChild(contentDiv);
                feedList.appendChild(li);

            }
        });

    main.appendChild(feedListDiv);
}

export default initializePosts