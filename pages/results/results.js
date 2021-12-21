import renderNavBar from "/pages/navbar/navbar.js";
let apiKey = "";
let userJWTToken = "";

export default () => {
  userJWTToken = JSON.parse(localStorage.getItem("user"));
  if (isAdmin()) {
    const content = document.querySelector(".content");
    apiKey = `${window.apiUrl}api/`;

    fetch("./pages/results/results.html")
      .then((response) => response.text())
      .then((resultsHtml) => {
        content.innerHTML = resultsHtml;
        handleResultPage();
        renderNavBar();
      });
  } else {
    alert("You have to be loged in as admin to access this site.");
    window.router.navigate("/");
  }
};

async function handleResultPage() {
  const tableContainer = document.getElementById("tableContainer");
  let candidates = await getCandidates();
  handleCandidates(tableContainer, candidates);
}

function getCandidates() {
  const key = apiKey + "candidate";
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
function handleCandidates(tableCon, candidates) {
  try {
    candidates = groupBy(candidates, "party");
    generateTables(tableCon, candidates);
  } catch (err) {}
}
function groupBy(arr, party) {
  //Really cool function for splitiing an array into object containing subarrays based
  //on a property of the object. In this case, party name.
  return arr.reduce(function (memo, x) {
    if (!memo[x[party].name]) {
      memo[x[party].name] = [];
    }
    memo[x[party].name].push(x);
    return memo;
  }, {});
}

function generateTables(tableCon, candidates) {
  const table = document.createElement("table");
  
  const firstRow = table.insertRow();

  const cellPartyName = firstRow.insertCell();
  const text0 = document.createTextNode("Party Name");
  cellPartyName.appendChild(text0);

  const cellEdit = firstRow.insertCell();
  const text1 = document.createTextNode("Vote Count");
  cellEdit.appendChild(text1);

  for (let key in candidates) {
    const candidateCon = candidates[key];
    const row = table.insertRow();
    const nameCell = row.insertCell();
    const text2 = document.createTextNode(key)
    nameCell.appendChild(text2)

    const voteCell = row.insertCell();
    const total = candidateCon.reduce((currentTotal,candidate)=>{
        return candidate.votes + currentTotal;
    },0)
    const text3 = document.createTextNode(total)
    voteCell.appendChild(text3)

  }
  tableCon.appendChild(table);
}

function isAdmin() {
  if (userJWTToken == null) {
    return false;
  }
  return userJWTToken.roles.includes("ROLE_ADMIN");
}
