import renderNavBar from "/pages/navbar/navbar.js";
let apiKey="";
let userJWTToken = "";

export default () => {
    userJWTToken =  JSON.parse(localStorage.getItem("user"));
    if (isAdmin()) {
    const content = document.querySelector(".content");
    apiKey= `${window.apiUrl}api/`;
  
    fetch("./pages/mainAdmin/mainAdmin.html")
      .then((response) => response.text())
      .then((mainAdminHtml) => {
        content.innerHTML = mainAdminHtml;
        handleAdminPage();
        renderNavBar();
      });
    } else{
      alert("You have to be loged in as admin to access this site.");
      window.router.navigate("/");
    }
  };
  
async function handleAdminPage(){
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
    const div = document.createElement("div");
    const party = candidateCon[0].party;
    partyDescription.textContent=party.name+" - "+party.symbol;

    div.appendChild(partyDescription);
    const createButton = document.createElement("a");
    createButton.classList.add('btn','btn-primary');
    createButton.href="/#/create/party/"+party.id;
    createButton.setAttribute("role","button");
    createButton.innerHTML="Add Candidate";
    div.appendChild(createButton);

    tableCon.appendChild(div)
    const br0 = document.createElement("br")
    tableCon.appendChild(br0);

    let table = generateTable();
    candidateCon.forEach(candidate =>generateRows(candidate,table))
    tableCon.appendChild(table);
    const br = document.createElement("br")
    tableCon.appendChild(br);
  }
}
  function generateTable(){
    const table = document.createElement("table");
    const firstRow = table.insertRow();

    const cellName = firstRow.insertCell();
    const text0 = document.createTextNode("Full Name");
    cellName.appendChild(text0);

    const cellEdit = firstRow.insertCell();
    const text1 = document.createTextNode("Edit");
    cellEdit.appendChild(text1);
  
    const cellDelete = firstRow.insertCell();
    const text2 = document.createTextNode("Delete");
    cellDelete.appendChild(text2);
    return table;
  }

  function generateRows(candidate,table){
    const row = table.insertRow();
    const cell = row.insertCell();
    const text = document.createTextNode(candidate.fullName);
    cell.appendChild(text);
    const buttonEditCell = row.insertCell();
    const buttonDeleteCell = row.insertCell();
    
    const editButton = document.createElement("a");
    editButton.classList.add('btn','btn-primary');
    editButton.setAttribute("role","button");
    editButton.innerHTML="Edit";
    editButton.href="";
    buttonEditCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add('btn','btn-primary');
    deleteButton.setAttribute("role","button");
    deleteButton.innerHTML="Delete";
    deleteButton.addEventListener("click",()=> deleteCandidate(candidate.id))
    buttonDeleteCell.appendChild(deleteButton);
  }
  function deleteCandidate(id){
    let key = apiKey + "candidate/"+id;
    fetch(key, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + userJWTToken.accessToken,
      },
    })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function isAdmin(){
    //Function to check if the user has an user role.
    if (userJWTToken == null) {
      return false;
    }
    return userJWTToken.roles.includes("ROLE_ADMIN");
  }
  