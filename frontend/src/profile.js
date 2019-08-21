function viewProfile(apiUrl){

    const profileModalDiv = document.createElement("div");
    document.body.appendChild(profileModalDiv);
    profileModalDiv.setAttribute("id", "myModal");
    profileModalDiv.setAttribute("class", "modal");
    
    //profileModalDiv.classList.add('modal');

    

    const profileContent = document.createElement("div");
    profileContent.setAttribute("class", "modal-content");
    
    const profileSpan = document.createElement("span");
    profileSpan.setAttribute("class", "close");

    const test = document.createElement("p");
    test.innerText = "heyyo";

    profileContent.appendChild(profileSpan);
    profileContent.appendChild(test);

    profileModalDiv.appendChild(profileContent);

    
    console.log("help");
    
    
    profileModalDiv.style.display = "block";
}

export default viewProfile;