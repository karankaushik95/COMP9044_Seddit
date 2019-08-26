import commentListener from './commentModal.js';

function toDateTime(secs) {

    var t = new Date(1970, 0, 1); // Epoch
    var options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: 'true' };
    t.setSeconds(secs);
    return t.toLocaleString('en-GB', options);
}

function viewProfile(apiUrl, username) {
    if (!sessionStorage.getItem('token')) {
        alert("This feature is only available to members of Seddit! Make an account today");
        return;
    }
    const numberOfPosts = document.createElement("p");

    const profileModalDiv = document.createElement("div");
    document.body.appendChild(profileModalDiv);
    profileModalDiv.setAttribute("id", "myModal");
    profileModalDiv.setAttribute("class", "modal");

    profileModalDiv.classList.add('modal');

    const profileContent = document.createElement("div");
    profileContent.setAttribute("class", "modal-content");
    profileContent.classList.add('modal-content');

    const profileSpan = document.createElement("span");
    profileSpan.setAttribute("class", "close");
    profileSpan.innerText = "X"
    profileSpan.style.fontSize = "15px";
    profileSpan.classList.add('close');

    profileContent.appendChild(profileSpan);
    profileModalDiv.appendChild(profileContent);

    profileModalDiv.style.display = "block";

    const modalHeader = document.createElement("h3");
    modalHeader.innerText = "Overview for " + username;
    modalHeader.style.textAlign = "center";
    modalHeader.classList.add('heading');

    profileContent.appendChild(modalHeader);

    const posts = document.createElement("ul");
    posts.setAttribute("class", "feed");
    posts.style.margin = "0px";

    if (sessionStorage.getItem('username') !== username) {
        const followButton = document.createElement("button");
        followButton.setAttribute("class", "button button-secondary");

    }

    profileSpan.addEventListener('click', function (event) {
        profileModalDiv.style.display = "none";
    });

    window.addEventListener('click', function (event) {
        if (event.target == profileModalDiv)
            profileModalDiv.style.display = "none";
    });

    fetch(apiUrl + "/user/" + "?" + "username=" + username, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Token ' + sessionStorage.getItem('token')
        }
    }).then(res => res.json()).then(function (response) {
        if (!response.username) {
            alert("Something went wrong!");
        } else {
            //console.log(response);

            numberOfPosts.innerText = "Number of posts: " + response.posts.length;
            profileContent.appendChild(numberOfPosts);
            return response;
        }
    }).then(function (response) {
        let upvotes = 0;
        var urls = [];
        for (var i = 0; i < response.posts.length; i++) {
            var fetchUrl = apiUrl + "/post/" + "?" + "id=" + response.posts[i];
            urls.push(fetchUrl);
        }
        Promise.all(urls.map(url =>
            fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Token ' + sessionStorage.getItem('token')
                }
            }).then(resp => resp.json())
        )).then(response => {
            console.log(response);
            for (var i = 0; i < Object.keys(response).length; i++) {
                upvotes += response[i].meta.upvotes.length;

                var li = document.createElement("li");
                li.setAttribute("class", "post");
                li.setAttribute("data-id-post", "");

                const contentDiv = document.createElement("div");

                contentDiv.style.backgroundColor = "#D0E5F5";
                contentDiv.setAttribute("class", "flex-container");
                contentDiv.style.display = "flex";
                contentDiv.style.width = "100%";
                contentDiv.style.flexDirection = "column";

                const topRow = document.createElement("div");
                topRow.setAttribute("id", "topRow");
                const subsedditText = document.createElement("p");
                subsedditText.innerText = "/s/" + response[i].meta.subseddit;
                subsedditText.style.display = "inline-block";
                subsedditText.setAttribute("class", "subseddit");
                topRow.appendChild(subsedditText);
                contentDiv.appendChild(topRow);

                const titleDiv = document.createElement("div");
                titleDiv.setAttribute("class", "post-title");

                const h4 = document.createElement("h4");
                h4.setAttribute("data-id-title", "");
                h4.setAttribute("class", "profile-title");
                h4.setAttribute("id", response[i].id);
                h4.innerText = response[i].title;
                titleDiv.appendChild(h4);

                contentDiv.appendChild(titleDiv);

                const postDiv = document.createElement("div");
                postDiv.setAttribute("class", "post-content");


                const para = document.createElement("p");
                para.innerText = response[i].text;
                para.style.display = "inline";
                para.setAttribute("class", "post-content");

                const lastRow = document.createElement("div");

                const time = document.createElement("p");
                time.style.display = "inline-block";
                time.setAttribute("class", "time");
                time.innerText = toDateTime(response[i].meta.published);


                lastRow.appendChild(time);

                if (response[i].image) {
                    const image = new Image(80, 80);
                    image.src = 'data:image/jpeg;base64,' + response[i].image;
                    image.style.display = "inline-block";
                    image.setAttribute("class", "post-image");
                    postDiv.appendChild(image);
                }
                postDiv.appendChild(para);
                contentDiv.appendChild(postDiv);
                contentDiv.appendChild(lastRow);

                li.appendChild(contentDiv);
                posts.appendChild(li);
            }
            return upvotes;
        }).then(function (upvotes) {
            const upvoteKarma = document.createElement("p");
            upvoteKarma.innerText = "Upvote karma: " + upvotes;
            profileContent.appendChild(upvoteKarma);
            const postListTitle = document.createElement("p");
            postListTitle.innerText = "Posts:"
            postListTitle.style.fontSize = "20px";
            postListTitle.style.textDecoration = "underline";
            postListTitle.style.fontWeight = "strong";

            profileContent.appendChild(postListTitle);
            profileContent.appendChild(posts);

            posts.addEventListener('click', function(event){
                event.preventDefault();
                if(event.target.className === "profile-title"){
                    profileModalDiv.style.display = "none";
                    commentListener(apiUrl, event.target.id);
                }
            });
        });
    });
}

export default viewProfile;