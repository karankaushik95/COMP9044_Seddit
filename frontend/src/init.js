/*

Sets up the initial UI
*/


export function initializeHeader(root) {

    const header = document.createElement("header");
    header.setAttribute("id", "nav");
    header.setAttribute("class", "banner");
    
    const logo = document.createElement("h2");
    logo.setAttribute("id", "logo");
    logo.setAttribute("class", "flex-center");
    logo.innerText = "Seddit";

    const buttonList = document.createElement("ul");
    buttonList.setAttribute("class", "nav");
    buttonList.setAttribute("id", "buttonList");

    const ulItem1 = document.createElement("li");
    ulItem1.setAttribute("class", "nav-item");
    const loginBtn = document.createElement("button");
    loginBtn.setAttribute("id", "loginBtn");
    loginBtn.setAttribute("class", "button button-primary");
    loginBtn.setAttribute("data-id-login", "");
    loginBtn.innerText = "Login";

    ulItem1.appendChild(loginBtn);

    const ulItem2 = document.createElement("li");
    ulItem2.setAttribute("class", "nav-item");
    const signupBtn = document.createElement("button");
    signupBtn.setAttribute("id", "signupBtn");
    signupBtn.setAttribute("class", "button button-primary");
    signupBtn.setAttribute("data-id-signup", "");
    signupBtn.innerText = "Sign up";

    ulItem2.appendChild(signupBtn);

    buttonList.appendChild(ulItem1);
    buttonList.appendChild(ulItem2);

    header.appendChild(logo);
    header.appendChild(buttonList);

    root.appendChild(header);
}

function initializeFooter(root){
    const footer = document.createElement("footer");
    const text = document.createElement("p");
    text.innerText = "Seddit brought to you by: COMP(2041|9044)\u2122 All rights reserved \u00A9 \u00AE";
    footer.appendChild(text);

    root.appendChild(footer);
}

function initializeUI() {
    const root = document.getElementById("root");
    // Comment this bit out before submitting
    
    var child = root.lastElementChild;
    while (child) {
        root.removeChild(child);
        child = root.lastElementChild;
    }

    initializeHeader(root);

    const main = document.createElement("main");
    main.setAttribute("role", "main");
    main.setAttribute("id", "main");
    
    root.appendChild(main);
    initializeFooter(root);
}

export default initializeUI;

