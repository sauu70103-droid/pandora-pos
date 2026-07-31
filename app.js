// ==========================================
// 系統變數設定
// ==========================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbz1BKmcuIs6CbIi7d5U8qpD381QwZhUT550DAtSi1S1OSRVg1GOzlSiSBM3ERa2rGzj4A/exec";

// 暫存圖片變數
let draftBase64Data = "";
let signedBase64Data = "";

// 技師清單 (對應你的抽成表)
const technicians = ["李家蓁", "呂函優", "呂佩穎", "無指定"];
// 服務項目清單
const services = ["美甲", "手足保養", "美睫", "問題指甲", "睫毛管理", "產品", "採耳", "除毛", "特殊折扣", "不入業績"];

// ==========================================
// 購物車邏輯
// ==========================================
function addCartItem() {
  const tbody = document.getElementById("cartBody");
  const tr = document.createElement("tr");

  // 產生服務選項
  const serviceOptions = services.map(s => `<option value="${s}">${s}</option>`).join('');
  // 產生技師選項
  const techOptions = technicians.map(t => `<option value="${t}">${t}</option>`).join('');

  tr.innerHTML = `
    <td><select class="item-name">${serviceOptions}</select></td>
    <td><select class="item-tech">${techOptions}</select></td>
    <td><input type="number" class="item-price" value="0" min="0" onchange="calculateTotal()"></td>
    <td><button class="btn-remove" onclick="removeCartItem(this)">刪除</button></td>
  `;
  tbody.appendChild(tr);
  calculateTotal();
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
// 簽名板畫布 (Canvas) 邏輯
// ==========================================
const canvas = document.getElementById("sigCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;

// 支援滑鼠與手機觸控
function startDrawing(e) { isDrawing = true; draw(e); }
function stopDrawing() { isDrawing = false; ctx.beginPath(); }
function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  
  // 取得滑鼠或觸控的座標
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

// 綁定事件
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", draw);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ==========================================
// 結帳與截圖核心流程
// ==========================================

// 第一階段：按下「產生確認單並簽名」
async function startCheckout() {
  const memberName = document.getElementById("memberName").value.trim();
  if (!memberName) return alert("請輸入會員名稱！");
  if (document.querySelectorAll(".item-price").length === 0) return alert("請至少新增一項明細！");

  // 鎖定按鈕避免重複點擊
  const btn = document.getElementById("btnGenerate");
  btn.disabled = true;
  btn.innerText = "處理中...";

  try {
    // 隱藏新增與刪除按鈕，讓截圖畫面乾淨
    document.querySelectorAll(".btn-add, .btn-remove").forEach(el => el.style.display = "none");
    
    // Stage 1：第一階段截圖 (草稿圖)
    const receiptArea = document.getElementById("receiptArea");
    const draftCanvas = await html2canvas(receiptArea, { scale: 1.5 });
    draftBase64Data = draftCanvas.toDataURL("image/jpeg", 0.7); // 壓縮格式以加快傳輸

    // 顯示簽名板 Modal
    document.getElementById("signatureModal").style.display = "flex";
    
    // 恢復按鈕文字 (但不解除鎖定，直到整個流程走完)
    btn.innerText = "等待顧客簽名...";
  } catch (err) {
    alert("截圖發生錯誤，請重試！");
    btn.disabled = false;
    btn.innerText = "產生確認單並簽名";
  }
}

// 第二階段：顧客簽好名，點擊「確認簽名結帳」
async function confirmSignature() {
  // 檢查畫布是否為空 (簡易判斷)
  const blank = document.createElement('canvas');
  blank.width = canvas.width; blank.height = canvas.height;
  if (canvas.toDataURL() === blank.toDataURL()) return alert("請顧客完成簽名！");

  document.getElementById("signatureModal").style.display = "none";
  
  // 將簽名圖片放進明細下方顯示出來
  const sigDataUrl = canvas.toDataURL("image/png");
  document.getElementById("finalSignatureImg").src = sigDataUrl;
  document.getElementById("receiptSignature").style.display = "block";

  // Stage 2：第二階段截圖 (含簽名完整圖)
  const receiptArea = document.getElementById("receiptArea");
  const finalCanvas = await html2canvas(receiptArea, { scale: 1.5 });
  signedBase64Data = finalCanvas.toDataURL("image/jpeg", 0.7);

  // 執行最終資料打包與發送
  submitToGAS();
}

// ==========================================
// 打包 JSON 並送出至 GAS
// ==========================================
function submitToGAS() {
  document.getElementById("btnGenerate").innerText = "資料上傳雲端中，請稍候...";

  // 產生單號 POS-YYYYMMDD-HHMMSS
  const now = new Date();
  const pad = num => String(num).padStart(2, '0');
  const timeString = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const orderId = `POS-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  // 收集購物車陣列
  const cartItems = [];
  const rows = document.querySelectorAll("#cartBody tr");
  rows.forEach(row => {
    cartItems.push({
      item_name: row.querySelector(".item-name").value,
      technician: row.querySelector(".item-tech").value,
      price: parseInt(row.querySelector(".item-price").value) || 0
    });
  });

  // 打包 Payload
  const payload = {
    checkout_time: timeString,
    order_id: orderId,
    member_name: document.getElementById("memberName").value,
    cashier: document.getElementById("cashier").value,
    payment_method: document.getElementById("paymentMethod").value,
    payment_unit: document.getElementById("paymentUnit").value,
    total_amount: calculateTotal(),
    cart_items: cartItems,
    draft_base64: draftBase64Data,
    signed_base64: signedBase64Data
  };

  // 使用 fetch 將資料 POST 到 GAS (注意：使用 text/plain 避免 CORS 預檢請求)
  fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === "success") {
      alert("結帳成功！單據與截圖已存入 Google 雲端。");
      location.reload(); // 重新整理畫面準備下一筆
    } else {
      alert("儲存失敗：" + result.message);
      document.getElementById("btnGenerate").disabled = false;
      document.getElementById("btnGenerate").innerText = "重新上傳";
    }
  })
  .catch(error => {
    alert("網路連線錯誤，請檢查網路狀況後重試。");
    console.error(error);
    document.getElementById("btnGenerate").disabled = false;
    document.getElementById("btnGenerate").innerText = "重新上傳";
  });
}

// 網頁載入時預設新增一筆空白明細
window.onload = () => { addCartItem(); };
