import renderNavBar from "/pages/navbar/navbar.js";

export default () => {
    const content = document.querySelector(".content");
  
    fetch("./pages/mainAdmin/mainAdmin.html")
      .then((response) => response.text())
      .then((mainAdminHtml) => {
        content.innerHTML = mainAdminHtml;
        handleAdminPage();
        renderNavBar();
      });
  };
  
  function handleAdminPage(){
    
  }