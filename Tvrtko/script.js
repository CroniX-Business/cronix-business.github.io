document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("modal");
    var modalImg = document.getElementById("img-modal");
    var images = document.querySelectorAll(".modal-img");
    var closeBtn = document.getElementsByClassName("close")[0];
  
    images.forEach(function(img) {
      img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
      }
    });
  
    closeBtn.onclick = function() {
      modal.style.display = "none";
    }
  
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  });