/*
Signup button eventlistener
*/

import initializePosts from './initPosts.js';

function signupBtnListener(){
    const signupBtn = document.getElementById("signupBtn");
    signupBtn.addEventListener("click", ()=>{
     
        const body = document.getElementById("main");
        var element = body.lastChild;
        while(element){
            body.removeChild(element);
            element = body.lastChild;
        }
        
        var form = document.createElement("form");
        //form.setAttribute("method", "post");
        //f.setAttribute("action", "help");
        
        const div = document.createElement("div");
        div.setAttribute("class", "container");
        div.setAttribute("align", "center");

        const header = document.createElement("h1");
        header.innerText = "Welcome to Seddit!";

        const subHeader = document.createElement("h2");
        subHeader.innerText = "Where Shell, Perl, and Javascript get together in Holy Matrimony";

        const paragraph = document.createElement("p");
        paragraph.innerText = "Please enter your credentials";
        
        const hr = document.createElement("hr");

        const labelUserName = document.createElement("label");
        labelUserName.setAttribute("for", "email");
        labelUserName.innerText = "Username:";
        labelUserName.style.fontStyle = "Strong";
        labelUserName.style.paddingRight = "5px";
        labelUserName.style.paddingTop = "10px";
        labelUserName.style.paddingBottom = "10px";

        var username = document.createElement("input"); //input element, text
        username.setAttribute('type',"text");
        username.setAttribute('name',"username");
        username.setAttribute("placeholder", "Enter Username");
        username.style.paddingTop = "10px";
        username.style.paddingBottom = "10px";

        const labelPwd = document.createElement("label");
        labelPwd.setAttribute("for", "email");
        labelPwd.innerText = "Password:";
        labelPwd.style.fontStyle = "Strong";
        labelPwd.style.paddingRight = "9px";
        labelPwd.style.paddingBottom = "10px";
        labelPwd.style.paddingTop = "10px";

        var password = document.createElement("input"); //input element, text
        password.setAttribute('type',"password");
        password.setAttribute('name',"username");
        password.setAttribute("placeholder", "Enter Password");
        password.style.paddingTop = "10px";
        password.style.paddingBottom = "10px";

        var submitBtn = document.createElement("input"); //input element, Submit button
        submitBtn.setAttribute('type',"submit");
        submitBtn.setAttribute('value',"Sign Up");
        submitBtn.style.marginLeft = "50px";

        var cancelBtn = document.createElement("button"); 
        cancelBtn.innerText = "Cancel";
        cancelBtn.style.marginLeft = "60px";
        cancelBtn.addEventListener("click", event =>{
            event.preventDefault();
            initializePosts();
        });

        div.appendChild(header);
        div.appendChild(subHeader);
        div.appendChild(paragraph);
        div.appendChild(hr);
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
            
        
            if (!username.value.trim()){
                alert ("Please enter a username");
                username.style.borderColor = "red";
                return;
            }else{
                username.style.borderColor = "black";
            }
            
            if (!password.value.trim()){
                alert ("Please enter a password");
                password.style.borderColor = "red";
                return;
            }else{
                password.style.borderColor = "black";
            }

            //Tempcode cause no backend
            alert("Connection to server failed! Please check your connection or try again later");
        });
        
    
    
    });
}

export default signupBtnListener;