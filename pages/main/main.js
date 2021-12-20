import renderNavBar from "/pages/navbar/navbar.js";

export default () => {
    const content = document.querySelector(".content");
  
    fetch("./pages/main/main.html")
      .then((response) => response.text())
      .then((mainHtml) => {
        content.innerHTML = mainHtml;
        handleMainPage();
        renderNavBar();
      });
  };

  function handleMainPage(){

  }
  