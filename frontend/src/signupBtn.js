/*
Signup button eventlistener
*/

import initializePosts from './initPosts.js';


function signupBtnListener(apiUrl) {
    const signupBtn = document.getElementById("signupBtn");
    signupBtn.addEventListener("click", () => {
        //  Could have done this as a modal, ran out of time. Just to clear the UI for the Login page
        const body = document.getElementById("main");
        var element = body.lastChild;
        while (element) {
            body.removeChild(element);
            element = body.lastChild;
        }
        // Create a form and add a sign up form  to it
        var form = document.createElement("form");

        const div = document.createElement("div");
        div.setAttribute("class", "container");
        div.setAttribute("align", "center");

        const header = document.createElement("h1");
        header.innerText = "Welcome to Seddit!";

        const subHeader = document.createElement("h2");
        subHeader.innerText = "Where Shell, Perl, and Javascript get together in Holy Matrimony";

        const paragraph = document.createElement("p");
        paragraph.innerText = "Please fill out the following form to join the best community on the internet!";
        // Part of an unimplemented feature. Oh well
        // if(sessionStorage.getItem('unlogged') && !sessionStorage.getItem('token')){
        //     subHeader.innerText = "To access that and all other features of Seddit, please create an account";
        // }

        const hr = document.createElement("hr");

        const labelUserName = document.createElement("label");
        labelUserName.setAttribute("for", "username");
        labelUserName.innerText = "Username:";
        labelUserName.style.fontStyle = "Strong";
        labelUserName.style.paddingRight = "5px";
        labelUserName.style.paddingTop = "10px";
        labelUserName.style.paddingBottom = "10px";

        var username = document.createElement("input"); //input element, text
        username.setAttribute('type', "text");
        username.setAttribute('name', "username");
        username.setAttribute("placeholder", "Enter Username");
        username.style.paddingTop = "10px";
        username.style.paddingBottom = "10px";

        const labelName = document.createElement("label");
        labelName.setAttribute("for", "Name");
        labelName.innerText = "Name:";
        labelName.style.fontStyle = "Strong";
        labelName.style.paddingRight = "5px";
        labelName.style.paddingTop = "10px";
        labelName.style.paddingBottom = "10px";
        labelName.style.marginLeft = "33px";

        var name = document.createElement("input"); //input element, text
        name.setAttribute('type', "text");
        name.setAttribute('name', "Name");
        name.setAttribute("placeholder", "Enter your name");
        name.style.paddingTop = "10px";
        name.style.paddingBottom = "10px";

        const labelPwd = document.createElement("label");
        labelPwd.setAttribute("for", "password");
        labelPwd.innerText = "Password:";
        labelPwd.style.fontStyle = "Strong";
        labelPwd.style.paddingRight = "9px";
        labelPwd.style.paddingBottom = "10px";
        labelPwd.style.paddingTop = "10px";

        var password = document.createElement("input"); //input element, text
        password.setAttribute('type', "password");
        password.setAttribute('name', "password");
        password.setAttribute("placeholder", "Enter Password");
        password.style.paddingTop = "10px";
        password.style.paddingBottom = "10px";

        const labelEmail = document.createElement("label");
        labelEmail.setAttribute("for", "email");
        labelEmail.innerText = "Email:";
        labelEmail.style.fontStyle = "Strong";
        labelEmail.style.paddingRight = "5px";
        labelEmail.style.paddingTop = "10px";
        labelEmail.style.paddingBottom = "10px";
        labelEmail.style.marginLeft = "33px";

        var email = document.createElement("input"); //input element, text
        email.setAttribute('type', "text");
        email.setAttribute('name', "username");
        email.setAttribute("placeholder", "Enter Email");
        email.style.paddingTop = "10px";
        email.style.paddingBottom = "10px";
        email.style.marginLeft = "5px";

        var submitBtn = document.createElement("input"); //input element, Submit button
        submitBtn.setAttribute('type', "submit");
        submitBtn.setAttribute('value', "Sign Up");
        submitBtn.style.marginLeft = "50px";

        var cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancel";
        cancelBtn.style.marginLeft = "60px";
        cancelBtn.addEventListener("click", event => {
            event.preventDefault();
            initializePosts(apiUrl);
        });

        // Append everything to the page

        div.appendChild(header);
        div.appendChild(subHeader);
        div.appendChild(paragraph);
        div.appendChild(hr);
        div.appendChild(document.createElement("br"));
        div.appendChild(labelEmail);
        div.appendChild(email);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));
        div.appendChild(labelName);
        div.appendChild(name);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));
        div.appendChild(labelUserName);
        div.appendChild(username);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));
        div.appendChild(labelPwd);
        div.appendChild(password);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));
        div.appendChild(submitBtn);
        div.appendChild(cancelBtn);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));

        form.appendChild(div);

        body.appendChild(form);

        form.addEventListener("submit", event => {
            event.preventDefault();
            // Check if the form has valid inputs
            if (!email.value.trim()) {
                alert("Please enter your email");
                email.style.borderColor = "red";
                return;
            } else {
                //Email regex taken from https://emailregex.com/
                if (email.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
                    email.style.borderColor = "black";
                else {
                    email.style.borderColor = "red";
                    alert("Please enter a valid email");
                    return;
                }
            }

            if (!name.value.trim()) {
                alert("Please enter your name");
                name.style.borderColor = "red";
                return;
            } else {
                name.style.borderColor = "black";
            }

            if (!username.value.trim()) {
                alert("Please enter a username");
                username.style.borderColor = "red";
                return;
            } else {
                username.style.borderColor = "black";
            }

            if (!password.value.trim()) {
                alert("Please enter a password");
                password.style.borderColor = "red";
                return;
            } else {
                password.style.borderColor = "black";
            }
            // Communicate with the backend to register/give an error to the user
            const data = { "username": username.value, "password": password.value, "email": email.value, "name": name.value };
            fetch(apiUrl + "/auth/signup", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                    'accept': 'application/json'
                }
            }).then(res => res.json()).then(function (response) {
                if (!response.token) {
                    // Sorry user, 500$ and I'll delete the other user
                    alert("Username is already taken, please pick another!");
                    username.style.borderColor = "red";
                    return;
                } else {
                    // Ayy you'll love it here. You can never leave
                    alert("Welcome to Seddit " + username.value + "!");
                    sessionStorage.setItem('token', response.token);
                    sessionStorage.setItem('username', username.value);
                    fetch(apiUrl + "/user/" + "?" + "username=" + username, {
                        method: 'GET',
                        headers: {
                            'accept': 'application/json',
                            'Authorization': 'Token ' + sessionStorage.getItem('token')
                        }
                    }).then(res => res.json()).then(function (response) {
                        sessionStorage.setItem('id', response.id);
                        initializePosts(apiUrl);
                    });
                }
            });
        });



    });
}

export default signupBtnListener;