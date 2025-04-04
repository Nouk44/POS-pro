function updateDateTime() {
  const now = new Date();
  const dateTimeElement = document.getElementById("date-time");
  dateTimeElement.textContent = now.toLocaleString();
}

setInterval(updateDateTime, 1000); // update every second
updateDateTime(); // initial call

// Setup Screen Password Logic
const CORRECT_SETUP_PASSWORD = "pos123"; // 🔐 Change this to your desired setup password

function checkPassword() {
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
  document.getElementById("admin-btn").style.display = "none";
}

function showPOS() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("pos-app").style.display = "block";
  document.getElementById("admin-btn").style.display = "block";
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
    document.getElementById("admin-btn").style.display = "none";
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);
  renderMenu();
  renderMenuManagement();
};
let orderItems = []; // Array to hold the ordered items
let totalAmount = 0; // Total price for the order

// Add selected item to the order list
function addToOrder(itemName, itemPrice) {
  // Add item to the order list
  orderItems.push({ name: itemName, price: itemPrice });
  totalAmount += itemPrice;

  // Update the order list in the UI
  updateOrderList();

  // Update the total amount
  updateTotal();
}

// Update the order list UI
function updateOrderList() {
  const orderList = document.getElementById('order-list');
  orderList.innerHTML = ''; // Clear current order list

  orderItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name} - $${item.price.toFixed(2)} 
      <button onclick="removeItem(${index})" style="margin-left: 10px;">❌</button>`;
    orderList.appendChild(li);
  });
}

function removeItem(index) {
  totalAmount -= orderItems[index].price;
  orderItems.splice(index, 1);
  updateOrderList();
  updateTotal();
}

// Update the total price UI
function updateTotal() {
  const totalElement = document.getElementById('total');
  totalElement.textContent = totalAmount.toFixed(2);
}

function checkout() {
  if (orderItems.length === 0) {
    alert("No items in the order!");
    return;
  }

  // Generate receipt content
  let receiptHTML = "<h3>My Restaurant Receipt</h3><ul>";
  orderItems.forEach(item => {
    receiptHTML += `<li>${item.name} - $${item.price.toFixed(2)}</li>`;
  });
  receiptHTML += `</ul><p><strong>Total: $${totalAmount.toFixed(2)}</strong></p>`;

  // Show the receipt
  document.getElementById("receipt-content").innerHTML = receiptHTML;
  document.getElementById("receipt").style.display = "block";

  // Clear the order after checkout
  orderItems = [];
  totalAmount = 0;
  updateOrderList();
  updateTotal();
}

function printReceipt() {
  const receiptContent = document.getElementById("receipt-content").innerHTML;
  const printWindow = window.open("", "", "width=600,height=400");
  printWindow.document.write(`<html><head><title>Receipt</title></head><body>${receiptContent}</body></html>`);
  printWindow.document.close();
  printWindow.print();
}

// Save all orders (to simulate history)
let allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];

function checkout() {
  if (orderItems.length === 0) {
    alert("No items in the order!");
    return;
  }

  const note = document.getElementById("order-note").value.trim(); // Grab the note

  // Generate receipt content
  let receiptHTML = "<h3>My Restaurant Receipt</h3><ul>";
  orderItems.forEach(item => {
    receiptHTML += `<li>${item.name} - $${item.price.toFixed(2)}</li>`;
  });
  receiptHTML += `</ul><p><strong>Total: $${totalAmount.toFixed(2)}</strong></p>`;

  if (note) {
    receiptHTML += `<p><strong>Note:</strong> ${note}</p>`;
  }

  // Show the receipt
  document.getElementById("receipt-content").innerHTML = receiptHTML;
  document.getElementById("receipt").style.display = "block";

  // Save order to admin dashboard
  allOrders.push({
    items: [...orderItems],
    total: totalAmount.toFixed(2),
    time: new Date().toLocaleString(),
    note: note
  });
  localStorage.setItem("allOrders", JSON.stringify(allOrders));

  // Clear order and note
  orderItems = [];
  totalAmount = 0;
  document.getElementById("order-note").value = "";
  updateOrderList();
  updateTotal();
}

function toggleAdmin() {
  const dashboard = document.getElementById("admin-dashboard");
  if (dashboard.style.display === "none" || dashboard.style.display === "") {
    showAdminOrders();
    dashboard.style.display = "block";
  } else {
    dashboard.style.display = "none";
  }
}
function showAdminOrders() {
  const container = document.getElementById("admin-orders");
  container.innerHTML = "";

  if (allOrders.length === 0) {
    container.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  allOrders.forEach((order, index) => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.marginBottom = "10px";
    div.style.padding = "10px";

    let itemsHTML = order.items.map(i => `${i.name} - $${i.price.toFixed(2)}`).join("<br>");
    div.innerHTML = `<strong>Order #${index + 1}</strong><br>${itemsHTML}<br><strong>Total:</strong> $${order.total}<br><small>${order.time}</small>`;
    container.appendChild(div);
  });
}

function clearOrders() {
  if (confirm("Are you sure you want to delete all orders?")) {
    allOrders = [];
    localStorage.removeItem("allOrders");
    showAdminOrders();
  }
}

let menuItems = JSON.parse(localStorage.getItem("menuItems")) || [
  { name: "Burger", price: 10.00 },
  { name: "Fries", price: 5.00 },
  { name: "Soda", price: 2.00 },
];

function renderMenu() {
  const container = document.getElementById("menu-items");
  container.innerHTML = "";
  menuItems.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.innerHTML = `
      <button onclick="addToOrder('${item.name}', ${item.price})">
        ${item.name} <p>$${item.price.toFixed(2)}</p>
      </button>
    `;
    container.appendChild(div);
  });
}

function renderMenuManagement() {
  const adminContainer = document.getElementById("menu-management");
  adminContainer.innerHTML = "";
  menuItems.forEach((item, index) => {
    adminContainer.innerHTML += `
      <div>
        <input type="text" value="${item.name}" onchange="editMenuItem(${index}, 'name', this.value)" />
        <input type="number" value="${item.price}" onchange="editMenuItem(${index}, 'price', this.value)" />
        <button onclick="deleteMenuItem(${index})">❌</button>
      </div>
    `;
  });
}

function addMenuItem() {
  const name = document.getElementById("new-item-name").value;
  const price = parseFloat(document.getElementById("new-item-price").value);
  if (name && !isNaN(price)) {
    menuItems.push({ name, price });
    saveMenu();
  }
}

function editMenuItem(index, field, value) {
  if (field === "price") value = parseFloat(value);
  menuItems[index][field] = value;
  saveMenu();
}

function deleteMenuItem(index) {
  menuItems.splice(index, 1);
  saveMenu();
}

function saveMenu() {
  localStorage.setItem("menuItems", JSON.stringify(menuItems));
  renderMenu();
  renderMenuManagement();
}

function toggleHistory() {
  const section = document.getElementById("history-section");
  if (section.style.display === "none") {
    showHistory();
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
}

function showHistory() {
  const container = document.getElementById("history-orders");
  const history = JSON.parse(localStorage.getItem("allOrders")) || [];

  container.innerHTML = "";

  if (history.length === 0) {
    container.innerHTML = "<p>No past orders found.</p>";
    return;
  }

  history.forEach((order, index) => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.marginBottom = "10px";
    div.style.padding = "10px";
    let itemsHTML = order.items.map(i => `${i.name} - $${i.price.toFixed(2)}`).join("<br>");
    div.innerHTML = `<strong>Order #${index + 1}</strong><br>${itemsHTML}<br><strong>Total:</strong> $${order.total}<br><small>${order.time}</small>`;
    container.appendChild(div);
  });
}

function clearHistory() {
  if (confirm("Are you sure you want to delete all order history?")) {
    localStorage.removeItem("allOrders");
    showHistory();
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('✅ Service Worker registered'))
    .catch(err => console.error('❌ Service Worker failed', err));
}
