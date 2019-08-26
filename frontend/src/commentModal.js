import viewProfile from './profile.js';
import initializePosts from './initPosts.js';

function toDateTime(secs) {

    var t = new Date(1970, 0, 1); // Epoch
    var options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: 'true' };
    t.setSeconds(secs);
    return t.toLocaleString('en-GB', options);
}

function commentListener(apiUrl, comments) {

    if (!sessionStorage.getItem('token')) {
        alert("This feature is only available to members of Seddit! Make an account today");
        return;
    }

    const commentModalDiv = document.createElement("div");
    document.body.appendChild(commentModalDiv);
    commentModalDiv.setAttribute("id", "myModal");
    commentModalDiv.setAttribute("class", "modal");

    commentModalDiv.classList.add('modal');

    const commentContent = document.createElement("div");
    commentContent.setAttribute("class", "comment-content");

    const commentSpan = document.createElement("span");
    commentSpan.setAttribute("class", "close");
    commentSpan.innerText = "X"
    commentSpan.style.fontSize = "15px";
    commentSpan.classList.add('close');

    commentContent.appendChild(commentSpan);
    commentModalDiv.appendChild(commentContent);

    commentModalDiv.style.display = "block";

    const modalHeader = document.createElement("h3");
    const subseddit = document.createElement("p");
    subseddit.setAttribute("class", "subseddit");

    const username = document.createElement("p");
    username.setAttribute("class", "comment-author");

    fetch(apiUrl + "/post/?id=" + comments, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Token ' + sessionStorage.getItem('token')
        }
    })
        .then(res => res.json())
        .then(function (response) {
            subseddit.innerText = "/s/"+ response.meta.subseddit;
            modalHeader.innerText = response.title;

            username.innerText = "/u/" + response.meta.author;

            modalHeader.classList.add('postHeader');
            commentContent.appendChild(subseddit);
            commentContent.appendChild(username);
            username.addEventListener('click', function(event){

                event.preventDefault();
                viewProfile(apiUrl, username.innerText.substring(3));
                commentModalDiv.style.display ="none";
            });

            commentContent.appendChild(modalHeader);
            if (response.thumbnail) {
                const image = new Image(150, 150);
                image.src = 'data:image/jpeg;base64,' + response.thumbnail;
                commentContent.appendChild(image);
            }
            const content = document.createElement("p");
            content.innerText = response.text;
            commentContent.appendChild(content);

            commentContent.appendChild(document.createElement("hr"));
            commentContent.appendChild(document.createElement("br"));

            const commentArea = document.createElement("TEXTAREA");
            commentArea.setAttribute("placeholder", "Enter your comment here");
            commentArea.style.width = "500px";
            commentArea.style.height = "100px";
            commentArea.style.resize = "none";
            commentContent.appendChild(commentArea);
            commentContent.appendChild(document.createElement("br"));

            const commentButton = document.createElement("button");
            commentButton.innerText = "Submit";
            commentButton.setAttribute("class", "button button-primary");
            commentContent.appendChild(commentButton);

            commentButton.addEventListener('click', function (event) {
                event.preventDefault();
                if (!commentArea.value.trim()) {
                    commentArea.focus();
                    commentArea.setAttribute("placeholder", "Can't post empty comment!");

                }
                else {
                    const commentData = { "comment": commentArea.value };
                    fetch(apiUrl + "/post/comment?id=" + comments, {
                        method: 'PUT',
                        body: JSON.stringify(commentData),
                        headers: {
                            'Content-type': 'application/json',
                            'accept': 'application/json',
                            'Authorization': 'Token ' + sessionStorage.getItem('token')
                        }
                    }).then(resp => resp.json()).then(function (response) {
                        //console.log(response);
                        commentModalDiv.style.display = "none";
                        commentListener(apiUrl, comments);
                    });

                }
            })

            const list = document.createElement("ul");
            list.setAttribute("id", "commentFeed");
            var commentsArray = response.comments;
            commentsArray.sort(function(a,b){return b.published-a.published});
            for (var i = 0; i < commentsArray.length; i++) {
                var li = document.createElement("li");
                li.setAttribute("class", "comment-post");

                var commentAuthor = document.createElement("p");
                commentAuthor.setAttribute("class", "comment-author");
                commentAuthor.innerText = "/u/" + commentsArray[i].author;

                var actualComment = document.createElement("p");
                actualComment.innerText = commentsArray[i].comment;
                actualComment.style.marginLeft = "5px";

                var commentTime = document.createElement("p");
                commentTime.setAttribute("class", "time");
                commentTime.innerText = toDateTime(commentsArray[i].published);
                commentTime.style.fontSize = "12px";

                li.appendChild(commentAuthor);
                li.appendChild(actualComment);
                li.appendChild(commentTime);

                list.appendChild(li);
            }
            commentContent.appendChild(list);
            list.addEventListener('click', function (event) {
                event.preventDefault();
                if (event.target.className === "comment-author") {
                    var listenerAuthor = event.target.innerText;
                    listenerAuthor = listenerAuthor.substring(3);
                    //console.log(listenerAuthor);
                    viewProfile(apiUrl, listenerAuthor);
                }
            });

        });

    commentSpan.addEventListener('click', function (event) {
        initializePosts(apiUrl);
        commentModalDiv.style.display = "none";
    });

    window.addEventListener('click', function (event) {
        if (event.target == commentModalDiv) {
            initializePosts(apiUrl);
            commentModalDiv.style.display = "none";
        }
    });

}

export default commentListener;