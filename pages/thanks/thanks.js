import renderNavBar from "/pages/navbar/navbar.js";

export default () => {
    const content = document.querySelector(".content");
  
    fetch("./pages/thanks/thanks.html")
      .then((response) => response.text())
      .then((aboutHtml) => {
        content.innerHTML = aboutHtml;
      });
      renderNavBar();
  };