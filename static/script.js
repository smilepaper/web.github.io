window.onload = function() {
  alert(1)
};

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("showTimeButton");
  button.addEventListener("click", function () {
    displayCurrentTime();
  });

  function displayCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById("timeDisplay").innerText =
      "現在時間: " + console.log(document.cookie);
  }
});
