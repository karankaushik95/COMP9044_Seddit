function viewProfile(apiUrl, username){

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

    profileSpan.addEventListener('click', function(event){
        profileModalDiv.style.display = "none";
    });
    
    window.addEventListener('click', function(event){
        if(event.target == profileModalDiv)
            profileModalDiv.style.display = "none";
    });

    fetch(apiUrl + "/user/" + "?" + username,{
        method : 'GET',
        headers:{
            'accept'    : 'application/json',
            'Authorization' : 'Token ' + sessionStorage.getItem('token')
        }
    }).then (res => res.json()).then( function(response){
        if(!response.username){
            alert("Something went wrong!");
        }else{
            console.log(response);
            const numberOfPosts = document.createElement("p");
            numberOfPosts.innerText = "Number of posts: "+response.posts.length;
            let upvotes = 0;
            for (var i = 0; i< response.posts.length; i++){
                fetch(apiUrl + "/post/" + "?" + response.post[i],{
                    method : 'GET',
                    headers:{
                        'accept'    : 'application/json',
                        'Authorization' : 'Token ' + sessionStorage.getItem('token')
                    }
                }).then (result => result.json()).then( function(upvoters){
                    upvotes += upvoters.upvotes.length;            
                });
            }
            const upvoteKarma = document.createElement("p");
            upvoteKarma.innerText = "Upvote karma: " + upvotes;
            profileContent.appendChild(numberOfPosts);
            profileContent.appendChild(upvoteKarma);
        }
    });

}

export default viewProfile;