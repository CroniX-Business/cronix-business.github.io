function openModal(imageUrl) {
  var modal = document.getElementById("imageResize");
  var modalImg = document.getElementById("modalImage");
  modal.style.display = "block";
  modalImg.src = imageUrl;
}

function closeModal() {
  var modal = document.getElementById("imageResize");
  modal.style.display = "none";
}
