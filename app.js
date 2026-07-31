// ==========================================
// 系統變數設定
// ==========================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbz1BKmcuIs6CbIi7d5U8qpD381QwZhUT550DAtSi1S1OSRVg1GOzlSiSBM3ERa2rGzj4A/exec";

let draftBase64Data = "";
let signedBase64Data = "";

const technicians = ["李家蓁", "呂函優", "呂佩穎", "無指定"];

// 【優化2】建立服務項目與對應的固定價格 (請在此修改你們的實際售價)
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
// 從字典中自動萃取出項目名稱
const services = Object.keys(servicePrices);

// ==========================================
// 網頁初始化與購物車邏輯
// ==========================================
window.onload = () => { 
  initCashierOptions(); // 【優化1】自動生成收款人員
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
  const defaultService = services[0]; // 預設第一項服務
  const defaultPrice = servicePrices[defaultService]; // 預設第一項服務的價格

  // 【優化2】綁定 onchange 事件自動更新價格，並設定 input 為 readonly (唯讀)
  tr.innerHTML = `
    <td><select class="item-name" onchange="updatePrice(this)">${serviceOptions}</select></td>
    <td><select class="item-tech">${techOptions}</select></td>
    <td><input type="number" class="item-price" value="${defaultPrice}" readonly></td>
    <td><button class="btn-remove" onclick="removeCartItem(this)">刪除</button></td>
  `;
  tbody.appendChild(tr);
  calculateTotal();
}

// 自動更新價格的函數
function updatePrice(selectElement) {
  const selectedService = selectElement.value; // 取得選擇的項目
  const tr = selectElement.closest("tr");      // 找到目前這行
  const priceInput = tr.querySelector(".item-price"); // 找到該行的金額欄位
  
  priceInput.value = servicePrices[selectedService]; // 帶入字典中的價格
  calculateTotal(); // 重新計算總計
}

function removeCartItem(btn) {
  btn.closest("tr").remove();
  calculateTotal();
}

function calculateTotal() {
  let total = 0;
  const prices = document.querySelectorAll(".item-price");
  prices.forEach(input => {
    total += parseInt(input.value) || 0;
  });
  document.getElementById("totalAmount").innerText = total;
  return total;
}

// ==========================================
// 簽名板畫布 (Canvas) 邏輯 (保持不變)
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
    cartItems.push({
      item_name: row.querySelector(".item-name").value,
      technician: row.querySelector(".item-tech").value,
      price: parseInt(row.querySelector(".item-price").value) || 0
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
    note: document.getElementById("orderNote").value, // 【優化3】打包備註欄位資料送出
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
