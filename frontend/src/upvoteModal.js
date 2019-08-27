import viewProfile from './profile.js';

// Shows a list of upvoters of a post

function upvoteListener(apiUrl, upvotes) {

    if (!sessionStorage.getItem('token')) {

        alert("This feature is only available to members of Seddit! Make an account today");
        return;
    }

    const upvoteModalDiv = document.createElement("div");
    document.body.appendChild(upvoteModalDiv);
    upvoteModalDiv.setAttribute("id", "myModal");
    upvoteModalDiv.setAttribute("class", "modal");

    upvoteModalDiv.classList.add('modal');

    const upvoteContent = document.createElement("div");
    upvoteContent.setAttribute("class", "comment-content");

    const upvoteSpan = document.createElement("span");
    upvoteSpan.setAttribute("class", "close");
    upvoteSpan.innerText = "X"
    upvoteSpan.style.fontSize = "15px";
    upvoteSpan.classList.add('close');

    upvoteContent.appendChild(upvoteSpan);
    upvoteModalDiv.appendChild(upvoteContent);

    upvoteModalDiv.style.display = "block";

    const modalHeader = document.createElement("h3");

    modalHeader.innerText = "Upvoted by:";
    modalHeader.classList.add('postHeader');
    upvoteContent.appendChild(modalHeader);

    upvoteSpan.addEventListener('click', function (event) {
        upvoteModalDiv.style.display = "none";
    });

    window.addEventListener('click', function (event) {
        if (event.target == upvoteModalDiv) {
            upvoteModalDiv.style.display = "none";
        }
    });

    const userList = document.createElement("ul");
    upvoteContent.appendChild(userList);
    fetch(apiUrl + "/post/?id=" + upvotes, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Token ' + sessionStorage.getItem('token')
        }
    }).then(res => res.json())
        .then(function (response) {
            return response.meta.upvotes;
        }).then(function (upvoters) {
            var ids = [];
            for (var i = 0; i < upvoters.length; i++) {
                var fetchUrl = apiUrl + "/user/" + "?" + "id=" + upvoters[i];
                fetchUrl.replace(/'/g, "%27");
                ids.push(fetchUrl);
            }
            Promise.all(ids.map(id =>
                fetch(id, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': 'Token ' + sessionStorage.getItem('token')
                    }
                }).then(resp => resp.json())
            )).then(response => {
                for (var i in response) {
                    var li = document.createElement("li");
                    li.classList.add("upvote-author");
                    li.innerText = "/u/" + response[i].username;
                    userList.appendChild(li);
                }
            });

        });
    userList.addEventListener('click', function (event) {
        if (event.target.className === "upvote-author") {
            var listenerAuthor = event.target.innerText;
            listenerAuthor = listenerAuthor.substring(3);
            viewProfile(apiUrl, listenerAuthor);
        }

    });
}

export default upvoteListener;