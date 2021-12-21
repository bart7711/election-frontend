import renderNavBar from "/pages/navbar/navbar.js";
let apiKey="";
let userJWTToken = "";

export default (partyId) => {
    userJWTToken =  JSON.parse(localStorage.getItem("user"));
    if (isAdmin()) {
    const content = document.querySelector(".content");
    apiKey= `${window.apiUrl}api/`;
  
    fetch("./pages/createCandidate/createCandidate.html")
      .then((response) => response.text())
      .then((mainAdminHtml) => {
        content.innerHTML = mainAdminHtml;
        handleCreatingPage(partyId);
        renderNavBar();
      });
    } else{
      alert("You have to be loged in as admin to access this site.");
      window.router.navigate("/");
    }
  };

  function handleCreatingPage(partyId){
    const nameElement = document.getElementById("full-name");
    const form = document.querySelector("form")
    form.addEventListener("submit",(event)=>create(event,nameElement, partyId))
  }

  function create(event, nameElement, partyId){
    event.preventDefault();
    const name = nameElement.value;
    fetchCreation(name,partyId)
  }

  function fetchCreation(name,partyId){
    const key = apiKey+"candidate/party/"+partyId;
    console.log(name);
    fetch(key, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + userJWTToken.accessToken,
      },
      body: JSON.stringify({
        fullName: name,
      }),
    })
      .then((response) => response.json())
      .then(()=>{window.router.navigate("/admin")})
  }

  function isAdmin(){
    if (userJWTToken == null) {
      return false;
    }
    return userJWTToken.roles.includes("ROLE_ADMIN");
  }