import commentListener from './commentModal.js';

// Copied it because importing it was causing some issues that I did not feel like debugging
function toDateTime(secs) {

    var t = new Date(1970, 0, 1); // Epoch
    var options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: 'true' };
    t.setSeconds(secs);
    return t.toLocaleString('en-AU', options);
}


// Open the modal to view the user's profile
function viewProfile(apiUrl, username) {
    if (!sessionStorage.getItem('token')) {
        alert("This feature is only available to members of Seddit! Make an account today");
        return;
    }

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

    profileSpan.addEventListener('click', function (event) {
        profileModalDiv.style.display = "none";
    });

    window.addEventListener('click', function (event) {
        if (event.target == profileModalDiv)
            profileModalDiv.style.display = "none";
    });

    if (sessionStorage.getItem('username') == username) {
        const ul = document.createElement("ul");
        ul.setAttribute("class", "profile-nav-bar");
        const titleLi = document.createElement("li");
        const editLi = document.createElement("li");
        titleLi.setAttribute("class", "li-nav");
        editLi.setAttribute("class", "li-nav");
        titleLi.innerText = "Overview";
        editLi.innerText = "Edit details";

        ul.appendChild(titleLi);
        ul.appendChild(editLi);
        profileContent.appendChild(ul);
        titleLi.classList.add("active");
        profileView(apiUrl, username, profileContent, profileModalDiv);

        titleLi.addEventListener('click', function (event) {
            event.preventDefault();
            editLi.classList.remove('active');
            titleLi.classList.add("active");
            profileView(apiUrl, username, profileContent, profileModalDiv);
        });

        editLi.addEventListener('click', function (event) {

            event.preventDefault();
            titleLi.classList.remove('active');
            editLi.classList.add("active");
            editProfile(apiUrl, username, profileContent, profileModalDiv);
        });

    } else {
        profileView(apiUrl, username, profileContent, profileModalDiv);
    }

    profileModalDiv.style.display = "block";
}
// Edit profile details navBar function
function editProfile(apiUrl, username, profileContent, profileModalDiv) {

    const editDiv = document.createElement("div");
    editDiv.setAttribute("id", "editDiv");

    const modalHeader = document.createElement("h3");
    modalHeader.innerText = "Edit your personal details";
    modalHeader.style.textAlign = "center";
    modalHeader.classList.add('heading');

    editDiv.appendChild(modalHeader);

    if (document.getElementById("statsDiv"))
        document.getElementById("statsDiv").remove();
    profileContent.appendChild(editDiv);

    var form = document.createElement("form");

    const labelUsername = document.createElement("label");
    labelUsername.innerText = "Username:";
    var usernameInput = document.createElement("input");
    usernameInput.style.width = "30%";
    usernameInput.setAttribute('type', "text");
    usernameInput.setAttribute('name', "username");
    usernameInput.value = username;
    usernameInput.disabled = true;
    usernameInput.style.marginLeft = "5px";

    const labelPassword = document.createElement("label");
    labelPassword.innerText = "Password:";

    var PasswordInput = document.createElement("input");
    PasswordInput.style.width = "30%";
    PasswordInput.setAttribute('type', "text");
    PasswordInput.setAttribute('name', "username");
    PasswordInput.setAttribute("placeholder", "Leave blank for no change");
    PasswordInput.style.marginLeft = "5px";

    const labelName = document.createElement("label");
    labelName.innerText = "Name:";

    var NameInput = document.createElement("input");
    NameInput.style.width = "30%";
    NameInput.setAttribute('type', "text");
    NameInput.setAttribute('name', "username");
    NameInput.setAttribute("placeholder", "Leave blank for no change");
    NameInput.style.marginLeft = "5px";

    const labelEmail = document.createElement("label");
    labelEmail.innerText = "Email:";

    var EmailInput = document.createElement("input");
    EmailInput.style.width = "30%";
    EmailInput.setAttribute('type', "text");
    EmailInput.setAttribute('name', "username");
    EmailInput.setAttribute("placeholder", "Leave blank for no change");
    EmailInput.style.marginLeft = "5px";

    const submitButton = document.createElement("button");
    submitButton.setAttribute("class", "button button-secondary");
    submitButton.innerText = "Submit";

    submitButton.addEventListener('click', function (event) {

        event.preventDefault();
        if (!(PasswordInput.value.trim() || NameInput.value.trim() || EmailInput.value.trim())) {
            alert("At least one of the values must be entered to be updated");
            return;
        }
        var body = {};
        if (EmailInput.value.trim()) {
            if (EmailInput.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
                body["email"] = EmailInput.value.trim();
            else {
                alert("Please enter a valid email");
                EmailInput.focus();
                return;
            }
        }
        if (NameInput.value.trim()) {
            body["name"] = NameInput.value.trim();
        }
        if (PasswordInput.value.trim()) {
            body["password"] = PasswordInput.value.trim();
        }
        fetch(apiUrl + "/user/", {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json',
                'accept': 'application/json',
                'Authorization': 'Token ' + sessionStorage.getItem('token')
            }
        }).then(res => res.json()).then(function (response) {
            alert("Updated successfully!");
            profileModalDiv.style.display = "none";

        });
    });

    form.appendChild(labelUsername);
    form.appendChild(usernameInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(labelPassword);
    form.appendChild(PasswordInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(labelName);
    form.appendChild(NameInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(labelEmail);
    form.appendChild(EmailInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(submitButton);

    editDiv.appendChild(form);

}

// Regular profile view
function profileView(apiUrl, username, profileContent, profileModalDiv) {

    const statsDiv = document.createElement("div");
    statsDiv.setAttribute("id", "statsDiv");

    const numberOfPosts = document.createElement("p");

    const modalHeader = document.createElement("h3");
    modalHeader.innerText = "Overview for u/" + username;
    //modalHeader.style.textAlign = "center";
    modalHeader.style.display = "inline-block";
    modalHeader.classList.add('heading');

    statsDiv.appendChild(modalHeader);

    const posts = document.createElement("ul");
    posts.setAttribute("class", "feed");
    posts.style.margin = "0px";

    const followButton = document.createElement("button");
    followButton.setAttribute("class", "button follow");
    followButton.innerText = "Follow";
    followButton.style.cssFloat = "right";
    followButton.style.marginRight = "15px";
    followButton.style.marginTop = "10px";
    followButton.style.display = "inline-block";
    statsDiv.appendChild(followButton);

    if (sessionStorage.getItem('username') === username) {
        followButton.style.visibility = "hidden";
    }


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
            const fullName = document.createElement("p");
            const email = document.createElement("p");
            fullName.innerText = "Name: " + response.name;
            email.innerText = "Email: " + response.email;
            fetch(apiUrl + "/user/" + "?" + "username=" + sessionStorage.getItem('username'), {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Token ' + sessionStorage.getItem('token')
                }
            }).then(result => result.json()).then(function (responses) {
                if (responses.following.includes(response.id)) {
                    followButton.classList.remove("follow");
                    followButton.classList.add("following");
                    followButton.innerText = "Following";
                }
            });

            numberOfPosts.innerText = "Number of posts: " + response.posts.length;
            statsDiv.appendChild(fullName);
            statsDiv.appendChild(email);
            statsDiv.appendChild(numberOfPosts);
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
                titleDiv.style.display = "inline-flex";

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
                if (response[i].meta.author === sessionStorage.getItem('username')) {
                    var removeDiv = document.createElement("div");
                    var edit = document.createElement("p");
                    edit.setAttribute("class", "editP");

                    var remove = document.createElement("p");
                    remove.setAttribute("class", "removeP");

                    edit.setAttribute("id", response[i].id);
                    remove.setAttribute("id", response[i].id);

                    edit.innerText = "Edit";
                    remove.innerText = "Delete";

                    edit.style.display = "inline-block";
                    remove.style.display = "inline-block";

                    edit.style.cssFloat = "right";
                    remove.style.cssFloat = "right";

                    edit.style.cursor = "pointer";
                    remove.style.cursor = "pointer";

                    edit.style.textDecoration = "underline";
                    remove.style.textDecoration = "underline";

                    edit.style.marginRight = "5px";
                    remove.style.marginRight = "5px";

                    removeDiv.appendChild(remove);
                    removeDiv.appendChild(edit);
                    contentDiv.appendChild(removeDiv);
                }

                li.appendChild(contentDiv);
                posts.insertBefore(li, posts.firstChild);
            }
            return upvotes;
        }).then(function (upvotes) {
            const upvoteKarma = document.createElement("p");
            upvoteKarma.innerText = "Post karma: " + upvotes;
            statsDiv.appendChild(upvoteKarma);
            const postListTitle = document.createElement("p");
            postListTitle.innerText = "Posts:"
            postListTitle.style.fontSize = "20px";
            postListTitle.style.textDecoration = "underline";
            postListTitle.style.fontWeight = "strong";

            statsDiv.appendChild(postListTitle);
            statsDiv.appendChild(posts);

            posts.addEventListener('click', function (event) {
                event.preventDefault();
                if (event.target.className === "profile-title") {
                    profileModalDiv.style.display = "none";
                    commentListener(apiUrl, event.target.id);
                } else if (event.target.className === "removeP") {
                    fetch(apiUrl + "/post/?id=" + event.target.id, {
                        method: 'DELETE',
                        headers: {
                            'accept': 'application/json',
                            'Authorization': 'Token ' + sessionStorage.getItem('token')
                        }
                    }).then(res => res.json()).then(function (response) {
                        profileModalDiv.style.display = "none";
                        alert("Deleted!");
                        viewProfile(apiUrl, username);
                    });
                } else if (event.target.className === "editP") {
                    profileModalDiv.style.display = "none";
                    editPost(apiUrl, event.target.id, username);
                }
            });
        });
        return response;
    }).then(function (response) {
        const following = document.createElement("p");
        const follow = document.createElement("p");
        statsDiv.appendChild(following);
        statsDiv.appendChild(follow);

        if (sessionStorage.getItem('username') !== response.username) {
            following.innerText = "Follows " + response.following.length + " users";
        } else {
            var urls = [];
            for (var i = 0; i < response.following.length; i++) {
                var fetchUrl = apiUrl + "/user/" + "?id=" + response.following[i];
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
                following.innerText = "You follow:" + " ";
                for (var i = 0; i < Object.keys(response).length - 1; i++) {
                    following.innerText = following.innerText + " /u/" + response[i].username + ",";
                }
                following.innerText = following.innerText + " /u/" + response[Object.keys(response).length - 1].username;
            });
        }
        follow.innerText = "Followed by " + response.followed_num + " users";

    });

    if (document.getElementById("editDiv"))
        document.getElementById("editDiv").remove();
    profileContent.appendChild(statsDiv);

    followButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (event.target.innerText === "FOLLOW") {
            fetch(apiUrl + "/user/follow?username=" + username, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': 'Token ' + sessionStorage.getItem('token')
                }
            }).then(res => res.json()).then(function (response) {
                profileModalDiv.style.display = "none";
                viewProfile(apiUrl, username);
            });
        } else {
            fetch(apiUrl + "/user/unfollow?username=" + username, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': 'Token ' + sessionStorage.getItem('token')
                }
            }).then(res => res.json()).then(function (response) {
                profileModalDiv.style.display = "none";
                viewProfile(apiUrl, username);
            });
        }
    });

}

function editPost(apiUrl, postId, username) {

    const postModalDiv = document.createElement("div");
    document.body.appendChild(postModalDiv);
    postModalDiv.setAttribute("id", "myModal");
    postModalDiv.setAttribute("class", "modal");

    postModalDiv.classList.add('modal');

    const postContent = document.createElement("div");
    postContent.setAttribute("class", "comment-content");

    const postSpan = document.createElement("span");
    postSpan.setAttribute("class", "close");
    postSpan.innerText = "X"
    postSpan.style.fontSize = "15px";
    postSpan.classList.add('close');

    postContent.appendChild(postSpan);
    postModalDiv.appendChild(postContent);

    postModalDiv.style.display = "block";

    const modalHeader = document.createElement("h3");
    modalHeader.innerText = "Edit your post";
    postContent.appendChild(modalHeader);
    postContent.appendChild(document.createElement("hr"));

    var form = document.createElement("form");

    const labelTitle = document.createElement("label");
    labelTitle.setAttribute("for", "email");
    labelTitle.innerText = "Title:";
    labelTitle.style.fontStyle = "Strong";

    var title = document.createElement("input");
    title.style.width = "80%";
    title.setAttribute('type', "text");
    title.setAttribute('name', "title");
    title.setAttribute("placeholder", "Enter title");
    title.style.marginLeft = "5px";

    const labelText = document.createElement("label");
    labelText.setAttribute("for", "email");
    labelText.innerText = "Text:";
    labelText.style.fontStyle = "Strong";

    var text = document.createElement("textarea"); //input element, text
    text.setAttribute('type', "text");
    text.setAttribute('name', "title");
    text.setAttribute("placeholder", "Enter text");
    text.style.width = "500px";
    text.style.height = "60px";
    text.style.resize = "none";
    text.style.marginLeft = "5px";

    const labelImage = document.createElement("label");
    labelImage.setAttribute("for", "email");
    labelImage.innerText = "Image:";
    labelImage.style.fontStyle = "Strong";

    const imageUpload = document.createElement("input");
    imageUpload.setAttribute("type", "file");
    imageUpload.setAttribute("accept", "image/*");
    imageUpload.style.marginLeft = "5px";

    var submitBtn = document.createElement("input"); //input element, Submit button
    submitBtn.setAttribute('type', "submit");
    submitBtn.setAttribute('value', "Post");
    submitBtn.setAttribute('class', 'button button-secondary');

    form.appendChild(labelTitle);
    form.appendChild(title);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(labelText);
    form.appendChild(text);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(labelImage);
    form.appendChild(imageUpload);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(submitBtn);

    postContent.appendChild(form);


    postSpan.addEventListener('click', function (event) {
        postModalDiv.style.display = "none";
    });

    window.addEventListener('click', function (event) {
        if (event.target == postModalDiv) {
            postModalDiv.style.display = "none";
        }
    });

    submitBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (!(title.value.trim() || text.value.trim() || imageUpload.value)) {
            alert("At least one of the parameters must be provided");
            return;
        }
        var body = {};

        if (title.value.trim()) {
            body["title"] = title.value.trim();
        }
        if (text.value.trim()) {
            body["text"] = text.value.trim();
        }

        var reader = new FileReader();
        var result;
        reader.onloadend = function () {
            result = reader.result;
            result = result.split(',')[1];
            body["image"] = result;
            fetch(apiUrl + "/post/?id=" + postId, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': 'Token ' + sessionStorage.getItem('token')
                }
            }).then(res => res.json()).then(function (response) {
                postModalDiv.style.display = "none";
                alert("Successfully modified");
                viewProfile(apiUrl, username);
            });
        }
        if (imageUpload.value) {
            result = reader.readAsDataURL(imageUpload.files[0]);
        } else {
            fetch(apiUrl + "/post/?id=" + postId, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': 'Token ' + sessionStorage.getItem('token')
                }
            }).then(res => res.json()).then(function (response) {
                postModalDiv.style.display = "none";
                alert("Successfully modified");
                viewProfile(apiUrl, username);
            });
        }

    });

}


export default viewProfile;