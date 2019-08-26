import initializePosts from './initPosts.js';

function newPost(apiUrl) {

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
    modalHeader.innerText = "Make a new submission to Seddit";
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

    const labelSubseddit = document.createElement("label");
    labelSubseddit.setAttribute("for", "email");
    labelSubseddit.innerText = "Subseddit:";
    labelSubseddit.style.fontStyle = "Strong";

    var subseddit = document.createElement("input"); //input element, text
    subseddit.setAttribute('type', "text");
    subseddit.setAttribute('name', "title");
    subseddit.setAttribute("placeholder", "Enter subseddit to post to");
    subseddit.style.marginLeft = "5px";


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
    form.appendChild(labelSubseddit);
    form.appendChild(subseddit);
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
        if (!title.value.trim()) {
            alert("Title cannot be empty");
            title.focus();
            return;
        } else {
            title.style.border = "black";
        }

        if (!text.value.trim()) {
            alert("Text cannot be empty");
            text.focus();
            return;
        } else {
            text.style.border = "black";
        }
        if (!subseddit.value.trim()) {
            alert("Subseddit cannot be empty");
            subseddit.focus();
            return;
        } else {
            subseddit.style.border = "black";
        }

        var reader = new FileReader();
        var result;
        reader.onloadend = function () {
            result = reader.result;
            result = result.split(',')[1];
            const data = {
                'title': title.value.trim(),
                'text': text.value.trim(),
                'subseddit': subseddit.value.trim(),
                'image': result
            };
            //console.log(JSON.stringify(data));
            fetch(apiUrl + "/post/", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': 'Token ' + sessionStorage.getItem('token')
                }
            }).then(res => res.json()).then(function (response) {
                postModalDiv.style.display = "none";
                initializePosts(apiUrl);
            });
        }
        if (imageUpload.value) {
            result = reader.readAsDataURL(imageUpload.files[0]);
        } else {
            const data = {
                'title': title.value.trim(),
                'text': text.value.trim(),
                'subseddit': subseddit.value.trim(),
            };
            fetch(apiUrl + "/post/", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': 'Token ' + sessionStorage.getItem('token')
                }
            }).then(res => res.json()).then(function (response) {
                postModalDiv.style.display = "none";
                initializePosts(apiUrl);
            });
        }

    });

}

export default newPost;