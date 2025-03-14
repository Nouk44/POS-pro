function updateDateTime() {
    const now = new Date();
    const dateTimeElement = document.getElementById("date-time");
    dateTimeElement.textContent = now.toLocaleString();
  }
  
  setInterval(updateDateTime, 1000); // update every second
  updateDateTime(); // initial call

const CORRECT_PASSWORD = "pos123"; // 🔐 Change this to your desired setup password

  function checkPassword() {
    const input = document.getElementById("setup-password").value;
    const error = document.getElementById("setup-error");
  
    if (input === CORRECT_PASSWORD) {
      localStorage.setItem("isSetupDone", "true");
      document.getElementById("setup-screen").style.display = "none";
    } else {
      error.textContent = "Incorrect password. Try again.";
    }
  }
  
  window.onload = function () {
    const isSetupDone = localStorage.getItem("isSetupDone");
  
    if (isSetupDone === "true") {
      document.getElementById("setup-screen").style.display = "none";
    } else {
      document.getElementById("setup-screen").style.display = "flex";
    }
  
    updateDateTime();
    setInterval(updateDateTime, 1000);
  };
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('✅ Service Worker registered'))
      .catch(err => console.error('❌ Service Worker failed', err));
  }