// ==========================================
// 系統變數設定
// ==========================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbz1BKmcuIs6CbIi7d5U8qpD381QwZhUT550DAtSi1S1OSRVg1GOzlSiSBM3ERa2rGzj4A/exec";

let draftBase64Data = "";
let signedBase64Data = "";

const technicians = ["李家蓁", "呂函優", "呂佩穎", "無指定"];

// 建立服務項目與對應的固定價格
const servicePrices = {
  "美甲": 1500,
  "手足保養": 1200,
  "美睫": 1800,
  "問題指甲": 2000,
  "睫毛管理": 1600,
  "產品": 500,
  "採耳": 800,
  "除毛": 1000,
  "特殊折扣": 0,
  "不入業績": 0
};
const services = Object.keys(servicePrices);

// ==========================================
// 網頁初始化與購物車邏輯
// ==========================================
window.onload = () => { 
  initCashierOptions(); 
  addCartItem(); 
};

function initCashierOptions() {
  const cashierSelect = document.getElementById("cashier");
  cashierSelect.innerHTML = technicians.map(t => `<option value="${t}">${t}</option>`).join('');
}

function addCartItem() {
  const tbody = document.getElementById("cartBody");
  const tr = document.createElement("tr");

  const serviceOptions = services.map(s => `<option value="${s}">${s}</option>`).join('');
  const techOptions = technicians.map(t => `<option value="${t}">${t}</option>`).join('');
  const defaultService = services[0]; 
  const defaultPrice = servicePrices[defaultService]; 

  // 加入 oninput="calculateTotal()" 讓輸入時能即時計算總金額
  tr.innerHTML = `
    <td><select class="item-name" onchange="updatePrice(this)">${serviceOptions}</select></td>
    <td><select class="item-tech">${techOptions}</select></td>
    <td><input type="number" class="item-price" value="${defaultPrice}" oninput="calculateTotal()" readonly></td>
    <td><button class="btn-remove" onclick="removeCartItem(this)">刪除</button></td>
  `;
  tbody.appendChild(tr);
  calculateTotal();
}

// 自動更新價格與解鎖特殊折扣的函數
function updatePrice(selectElement) {
  const selectedService = selectElement.value; 
  const tr = selectElement.closest("tr");      
  const priceInput = tr.querySelector(".item-price"); 
  
  if (selectedService === "特殊折扣") {
    // 如果選了特殊折扣，解除唯讀狀態讓使用者填寫，並將預設值歸零
    priceInput.readOnly = false;
    priceInput.value = 0;
  } else {
    // 其他項目則鎖定唯讀，並帶入預設價格
    priceInput.readOnly = true;
    priceInput.value = servicePrices[selectedService]; 
  }
  
  calculateTotal(); 
}

function removeCartItem(btn) {
  btn.closest("tr").remove();
  calculateTotal();
}

function calculateTotal() {
  let total = 0;
  const rows = document.querySelectorAll("#cartBody tr");
  
  rows.forEach(row => {
    const serviceName = row.querySelector(".item-name").value;
    let price = parseInt(row.querySelector(".item-price").value) || 0;
    
    // 判斷如果是特殊折扣，則將金額用減法扣除
    if (serviceName === "特殊折扣") {
      total -= Math.abs(price);
    } else {
      total += price;
    }
  });
  
  document.getElementById("totalAmount").innerText = total;
  return total;
}

// ==========================================
// 簽名板畫布 (Canvas) 邏輯
// ==========================================
const canvas = document.getElementById("sigCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;

function startDrawing(e) { isDrawing = true; draw(e); }
function stopDrawing() { isDrawing = false; ctx.beginPath(); }
function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.lineTo(clientX - rect.left, clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(clientX - rect.left, clientY - rect.top);
}
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", draw);

function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

// ==========================================
// 結帳與截圖核心流程
// ==========================================
async function startCheckout() {
  const memberName = document.getElementById("memberName").value.trim();
  if (!memberName) return alert("請輸入會員名稱！");
  if (document.querySelectorAll(".item-price").length === 0) return alert("請至少新增一項明細！");

  const btn = document.getElementById("btnGenerate");
  btn.disabled = true;
  btn.innerText = "處理中...";

  try {
    document.querySelectorAll(".btn-add, .btn-remove").forEach(el => el.style.display = "none");
    const receiptArea = document.getElementById("receiptArea");
    const draftCanvas = await html2canvas(receiptArea, { scale: 1.5 });
    draftBase64Data = draftCanvas.toDataURL("image/jpeg", 0.7);
    
    document.getElementById("signatureModal").style.display = "flex";
    btn.innerText = "等待顧客簽名...";
  } catch (err) {
    alert("截圖發生錯誤，請重試！");
    btn.disabled = false;
    btn.innerText = "產生確認單並簽名";
  }
}

async function confirmSignature() {
  const blank = document.createElement('canvas');
  blank.width = canvas.width; blank.height = canvas.height;
  if (canvas.toDataURL() === blank.toDataURL()) return alert("請顧客完成簽名！");

  document.getElementById("signatureModal").style.display = "none";
  document.getElementById("finalSignatureImg").src = canvas.toDataURL("image/png");
  document.getElementById("receiptSignature").style.display = "block";

  const receiptArea = document.getElementById("receiptArea");
  const finalCanvas = await html2canvas(receiptArea, { scale: 1.5 });
  signedBase64Data = finalCanvas.toDataURL("image/jpeg", 0.7);

  submitToGAS();
}

function submitToGAS() {
  document.getElementById("btnGenerate").innerText = "資料上傳雲端中，請稍候...";

  const now = new Date();
  const pad = num => String(num).padStart(2, '0');
  const timeString = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const orderId = `POS-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  const cartItems = [];
  document.querySelectorAll("#cartBody tr").forEach(row => {
    const serviceName = row.querySelector(".item-name").value;
    let finalPrice = parseInt(row.querySelector(".item-price").value) || 0;
    
    // 在寫入資料庫前，將特殊折扣的金額轉為負數
    if (serviceName === "特殊折扣") {
      finalPrice = -Math.abs(finalPrice);
    }

    cartItems.push({
      item_name: serviceName,
      technician: row.querySelector(".item-tech").value,
      price: finalPrice
    });
  });

  const payload = {
    checkout_time: timeString,
    order_id: orderId,
    member_name: document.getElementById("memberName").value,
    cashier: document.getElementById("cashier").value,
    payment_method: document.getElementById("paymentMethod").value,
    payment_unit: document.getElementById("paymentUnit").value,
    total_amount: calculateTotal(),
    cart_items: cartItems,
    note: document.getElementById("orderNote").value,
    draft_base64: draftBase64Data,
    signed_base64: signedBase64Data
  };

  fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === "success") {
      alert("結帳成功！單據與截圖已存入 Google 雲端。");
      location.reload(); 
    } else {
      alert("儲存失敗：" + result.message);
      resetBtn();
    }
  })
  .catch(error => {
    alert("網路連線錯誤，請檢查網路狀況後重試。");
    console.error(error);
    resetBtn();
  });
}

function resetBtn() {
  document.getElementById("btnGenerate").disabled = false;
  document.getElementById("btnGenerate").innerText = "重新上傳";
}
