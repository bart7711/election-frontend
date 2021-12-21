import renderLogin from "./pages/login/login.js";
import renderMain from "./pages/main/main.js";
import renderMainAdmin from "./pages/mainAdmin/mainAdmin.js";
import renderSignUp from "./pages/signUp/signUp.js";
import renderThanks from "./pages/thanks/thanks.js";
import renderResults from "./pages/results/results.js";
import renderCreation from "./pages/createCandidate/createCandidate.js"


export default function () {
  window.router = new Navigo("/", { hash: true });

  router
    .on({
      "/": () => {
        renderLogin().then(router.updatePageLinks);
      },
      main: ()=>{
        renderMain();
      },
      admin: ()=>{
        renderMainAdmin();
      },
      signup: ()=>{
        renderSignUp();
      },
      thanks: ()=>{
        renderThanks();
      },
      results: ()=>{
        renderResults();
      },
      "create/party/:partyId":({ data }) => {
        renderCreation(data.partyId);    
      }
    })
    .resolve();
}
