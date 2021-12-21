import renderNavBar from "/pages/navbar/navbar.js";
let apiKey="";
let userJWTToken = "";

export default () => {
    userJWTToken =  JSON.parse(localStorage.getItem("user"));
    if(isUser()){
    const content = document.querySelector(".content");
    apiKey= `${window.apiUrl}api/`;

    fetch("./pages/main/main.html")
      .then((response) => response.text())
      .then((mainHtml) => {
        content.innerHTML = mainHtml;
        handleMainPage();
        renderNavBar();
      });
    }else{
      alert("You have to be loged in as user to access this site.")
      window.router.navigate("/")
    }
  };

  async function handleMainPage(){
    const tableContainer = document.getElementById("tableContainer");
    let candidates = await getCandidates();
    handleCandidates(tableContainer, candidates);
  }

  function getCandidates(){
    const key = apiKey+"candidate";
    const candidates = fetch(key, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
    return candidates;
  }

function handleCandidates(tableCon, candidates){
  try{
    candidates = groupBy(candidates,"party");
    generateTables(tableCon,candidates);
  }catch(err){}
}

function groupBy(arr, party) {
  //Really cool function for splitiing an array into object containing subarrays based
  //on a property of the object. In this case, party name.
  return arr.reduce(function(memo, x) {
    if (!memo[x[party].name]) { memo[x[party].name] = []; }
    memo[x[party].name].push(x);
    return memo;
  }, {});
}

function generateTables(tableCon, candidates){
  for(let key in candidates){
    const candidateCon = candidates[key];
    const partyDescription = document.createElement("h3");
    const party = candidateCon[0].party;
    partyDescription.textContent=party.name+" - "+party.symbol;
    tableCon.appendChild(partyDescription);
    let table = generateTable();
    candidateCon.forEach(candidate =>generateRows(candidate,table))
    tableCon.appendChild(table)
  }
  function generateTable(){
    const table = document.createElement("table");
    const firstRow = table.insertRow();

    const cellName = firstRow.insertCell();
    const text0 = document.createTextNode("Full Name");
    cellName.appendChild(text0);

    const cellVote = firstRow.insertCell();
    const text1 = document.createTextNode("Vote");
    cellVote.appendChild(text1);

    return table;
  }

  function generateRows(candidate,table){
    const row = table.insertRow();
    const cell = row.insertCell();
    const text = document.createTextNode(candidate.fullName);
    cell.appendChild(text);
    const buttonCell = row.insertCell();

    const voteButton = document.createElement("button");
    voteButton.classList.add('btn','btn-primary');
    voteButton.setAttribute("role","button");
    voteButton.innerHTML="Vote";
    voteButton.addEventListener("click",()=>vote(candidate.id))
    buttonCell.appendChild(voteButton);
  }

  function vote(id){
    let key = apiKey+"candidate/vote/"+id;
    fetch(key, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + userJWTToken.accessToken,
      },
    })
      .then(() => {window.router.navigate("/thanks");})
      .catch((error) => {
        console.log(error);
      });
  }
}

function isUser(){
  //Function to check if the user has an admin role.
  if(userJWTToken==null){return false;}
  return userJWTToken.roles.includes("ROLE_CUSTOMER");
}