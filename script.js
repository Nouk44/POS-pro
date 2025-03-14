function updateDateTime() {
  const now = new Date();
  const dateTimeElement = document.getElementById("date-time");
  dateTimeElement.textContent = now.toLocaleString();
}

setInterval(updateDateTime, 1000); // update every second
updateDateTime(); // initial call

// Setup Screen Password Logic
const CORRECT_SETUP_PASSWORD = "12345"; // 🔐 Change this to your desired setup password

function checkSetupPassword() {
  const input = document.getElementById("setup-password").value;
  const error = document.getElementById("setup-error");

  if (input === CORRECT_SETUP_PASSWORD) {
    localStorage.setItem("isSetupDone", "true");
    document.getElementById("setup-screen").style.display = "none";
    showLogin(); // After setup is done, show login screen
  } else {
    error.textContent = "Incorrect password. Try again.";
  }
}

// POS Screen Login Logic
const POS_PASSWORD = "1234"; // Change this to your desired POS password

function checkPOSPassword() {
  const input = document.getElementById("password-input").value;
  const error = document.getElementById("login-error");

  if (input === POS_PASSWORD) {
    localStorage.setItem("pos-logged-in", "true");
    showPOS();
  } else {
    error.textContent = "Incorrect password. Try again.";
  }
}

// Show Login or POS based on stored state
function showLogin() {
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("pos-app").style.display = "none";
}

function showPOS() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("pos-app").style.display = "block";
}

// Logout Function
function logout() {
  localStorage.removeItem("pos-logged-in");
  location.reload();
}

// Window Load Logic
window.onload = () => {
  const isSetupDone = localStorage.getItem("isSetupDone");
  if (isSetupDone === "true") {
    document.getElementById("setup-screen").style.display = "none";
    const isLoggedIn = localStorage.getItem("pos-logged-in");
    if (isLoggedIn === "true") {
      showPOS();
    } else {
      showLogin();
    }
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
