export default () => {
    const content = document.querySelector(".content");
  
    fetch("./pages/mainAdmin/mainAdmin.html")
      .then((response) => response.text())
      .then((mainAdminHtml) => {
        content.innerHTML = mainAdminHtml;
      });
  };
  