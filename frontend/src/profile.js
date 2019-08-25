function viewProfile(apiUrl, username) {
    if (!sessionStorage.getItem('token')){
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
            fetchUrl.replace(/'/g, "%27");
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
            }
            return upvotes;
        }).then(function (upvotes) {
            const upvoteKarma = document.createElement("p");
            upvoteKarma.innerText = "Upvote karma: " + upvotes;
            profileContent.appendChild(upvoteKarma);
        });
    });
}

export default viewProfile;