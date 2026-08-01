// ==========================================
// 系統變數與選單資料庫
// ==========================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbz1BKmcuIs6CbIi7d5U8qpD381QwZhUT550DAtSi1S1OSRVg1GOzlSiSBM3ERa2rGzj4A/exec";

let draftBase64Data = "";
let signedBase64Data = "";
let currentOrderId = "";
let currentTimeString = "";
const technicians = ["李家蓁", "呂函優", "呂佩穎", "無指定"];

const menuData = {
  "💅 美甲-手部": { "設計款-不指定設計師優惠價": 999, "設計款-指定設計師優惠價": 1299, "服務費": "*", "造型飾品": "*", "造型凝膠設計": "*", "變化貓眼": "*", "客製沙龍造型": "*", "活動優惠價": "*", "單色美甲": 799, "亮片美甲": 799, "貓眼美甲": 899, "透明建甲": 600, "單指延長甲": 120, "十指延長甲": 1000, "單色漸層": 999, "變化法式": 1100, "變化跳色": 1000, "美甲鏡面造型(單指)": 80, "美甲鏡面造型(十指)": 500, "兒童美甲": 700 },
  "🦶 美甲-足部": { "設計款-不指定設計師優惠價": 1199, "設計款-指定設計師優惠價": 1499, "服務費": "*", "造型飾品": "*", "造型凝膠設計": "*", "變化貓眼": "*", "活動優惠價": "*", "單色美甲": 999, "亮片美甲": 999, "貓眼美甲": 1099, "透明建甲": 800, "客製沙龍造型": "*", "單色漸層": 1199, "變化法式": 1300, "變化跳色": 1200, "美甲鏡面造型(單指)": 80, "美甲鏡面造型(十指)": 500 },
  "🌿 健康甲": { "微晶補甲(大拇指)": 200, "微晶補甲(其他小指)": 100, "指甲強韌處理(十指)": 300, "嵌甲(大拇指)": 100, "嵌甲(其他小指)": 50, "捲甲矯正(大拇指)": 300, "捲甲矯正(其他小指)": 200, "重建甲床(大拇指)": 500, "重建甲床(其他小指)": 300, "異型調整": 300, "矯正貼片": 1500 },
  "🏥 特殊指甲護理": { "咬甲矯正": 1000, "肉包甲強化塑型(大拇指)": 200, "肉包甲強化塑型(其他小指)": 100, "矯正貼片": 1500, "特殊甲護理-(足部十趾)": 700, "特殊指甲/捲甲矯正(大拇指)": 500, "特殊指甲/捲甲矯正(其他小趾)": 300, "特殊甲/嵌甲(大拇指)": 100, "特殊甲/嵌甲(其他小指)": 100, "異型增生/菌絲養護(大拇指)": 500, "異型增生/菌絲養護(其他小指)": 500, "特殊甲護理(手部)": 500, "特殊甲/甲床重建(其他小指/單指計費)": 300, "特殊甲/甲床重建(大拇指/單指計費)": 500, "特殊甲足繭(嚴重)": 1300, "特殊甲足繭(一般)": 1100 },
  "👁️ 美睫": { "自然裸妝": 1000, "濃密": 1300, "爆濃款": 1500, "加購(下睫毛)": 200, "純卸睫毛(本店)": 300, "純卸睫毛(他店)": 500, "卸睫續接卸睫費(本店)": 100, "卸睫續接卸睫費(他店)": 200, "自訂": "*", "服務費": "*", "睫毛管理(上睫毛)": 1199, "睫毛管理(下睫毛)": 699, "睫毛管理(增黑)": 300, "睫毛管理體驗價(上睫毛)": 999 },
  "👂 采耳": { "專業採耳": 999, "兒童耳道清潔": 699, "耳氤氳肩頸舒緩": 899, "身心減壓套餐": 1599, "服務費": "*" },
  "🧴 手足保養": { "淨化保養-手部淨化指甲保養續作": 300, "淨化保養-足部指甲": 500, "淨化保養-手部純保養": 400, "淨化保養-手工拋光": 100, "深層保養-短膜手足膜": 299, "深層保養-長膜手足膜": 399, "深層保養-手部深層保養": 1200, "深層保養-足部深層保養": 1800, "深層保養-足繭護理(嚴重)": 1000, "深層保養-足繭護理(一般)": 800, "深層保養-拋棄式足搓": 99 },
  "💧 卸甲": { "卸甲(他店續做)": 300, "卸甲(本店不續做)": 300, "卸甲(他店不續做)": 500, "卸甲(本店續做)": 200 },
  "🛍️ 產品": { "特殊甲產品-修甲套組": 1500, "特殊甲產品-防潮平衡液": 280, "特殊甲產品-BAOGAAO": 350, "特殊甲產品-灰指甲修護液": 980, "特殊甲產品-淨銀乳": 680, "特殊甲產品-磨板類": 40, "特殊甲產品-煥采抗菌噴霧": 480, "指緣修護油": 280, "指緣軟化液": 350, "鈣元素硬甲油": 375, "手足滋潤修護霜": 280 },
  "🪒 除毛": { "腋下": 400, "腳趾/手指": 250, "全背": 800, "小花": 300, "小腿": 800, "大腿": 800, "上手臂/小手臂": 700, "比基尼式": 1300, "膝蓋": 200, "巴西式全除": 1600, "特殊護理(保濕鎮定敷膜A)": 99, "特殊護理(保濕鎮定敷膜B)": 299 },
  "💰 定金及加費": { "定金": 500, "指定費": "*", "服務費": "*", "加班費": 200, "年節服務費": 100, "儲值金(儲值)": "*", "儲值金(抵扣)": "*", "課堂購買": "*" }
};

window.onload = () => { initCashierOptions(); renderCategoryButtons(); };
function switchTab(tabName) {
  document.querySelectorAll('.nav-tabs button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  document.getElementById('content-' + tabName).classList.add('active');
  if (tabName === 'report') loadReport('today'); 
}
function initCashierOptions() { document.getElementById("cashier").innerHTML = technicians.map(t => `<option value="${t}">${t}</option>`).join(''); }
function renderCategoryButtons() {
  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = "";
  for (const category in menuData) {
    const btn = document.createElement("button");
    btn.className = "btn-category"; btn.innerText = category;
    btn.onclick = () => {
      document.querySelectorAll(".btn-category").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      renderSubItems(category);
    };
    grid.appendChild(btn);
  }
}
function renderSubItems(category) {
  const container = document.getElementById("subItemContainer");
  const grid = document.getElementById("subItemGrid");
  grid.innerHTML = ""; container.style.display = "block";
  const subItems = menuData[category];
  for (const subName in subItems) {
    const price = subItems[subName];
    const btn = document.createElement("button"); btn.className = "btn-subitem";
    btn.innerText = `${subName} (${price === "*" ? "自訂" : "$" + price})`;
    btn.onclick = () => addToCart(subName, price);
    grid.appendChild(btn);
  }
}
function addToCart(itemName, itemPrice) {
  const tbody = document.getElementById("cartBody");
  const tr = document.createElement("tr");
  const techOptions = technicians.map(t => `<option value="${t}">${t}</option>`).join('');
  const inputHTML = (itemPrice === "*") ? `<input type="number" class="item-price" placeholder="輸入金額" oninput="calculateTotal()">` : `<input type="number" class="item-price" value="${itemPrice}" oninput="calculateTotal()" readonly style="background:#eee;">`;
  tr.innerHTML = `<td style="text-align:left; font-weight:bold;"><input type="hidden" class="item-name" value="${itemName}">${itemName}</td><td><select class="item-tech">${techOptions}</select></td><td>${inputHTML}</td><td><button class="btn-remove" onclick="removeCartItem(this)">刪除</button></td>`;
  tbody.appendChild(tr); calculateTotal();
}
function removeCartItem(btn) { btn.closest("tr").remove(); calculateTotal(); }
function calculateTotal() {
  let total = 0;
  document.querySelectorAll("#cartBody tr").forEach(row => {
    const sName = row.querySelector(".item-name").value;
    let price = parseInt(row.querySelector(".item-price").value) || 0;
    if (sName.includes("抵扣")) { total -= Math.abs(price); } else { total += price; }
  });
  document.getElementById("totalAmount").innerText = total; return total;
}

// ==========================================
// 店務報表 (詳細報表與資料過濾)
// ==========================================
let allReportData = []; 
function loadReport(filterType) {
  document.querySelectorAll('.report-controls button').forEach(b => b.classList.remove('active'));
  document.getElementById('filter-' + filterType).classList.add('active');
  const summaryDiv = document.getElementById("reportSummary");
  const loadingDiv = document.getElementById("loadingReport");

  if (allReportData.length === 0) {
    summaryDiv.innerHTML = ""; loadingDiv.style.display = "block";
    const now = new Date();
    fetch(GAS_URL + "?month=" + String(now.getMonth() + 1).padStart(2, '0'))
      .then(res => res.json())
      .then(res => {
        if(res.status === "success") { allReportData = res.data; processReportData(filterType); }
        loadingDiv.style.display = "none";
      }).catch(err => { loadingDiv.style.display = "none"; });
  } else { processReportData(filterType); }
}

function processReportData(filterType) {
  const now = new Date();
  let techRevenue = {}; technicians.forEach(t => techRevenue[t] = 0);
  let todayTotal = 0; 

  // 詳細報表的 HTML 結構準備
  let detailedHTML = `<h3 style="margin-bottom:10px; color:var(--text-dark);">📝 今日結帳明細</h3>
    <table class="detail-table">
      <tr>
        <th>時間 / 單號</th>
        <th>會員</th>
        <th>消費項目 (老師)</th>
        <th>總金額</th>
      </tr>`;
  let hasDetail = false;

  allReportData.forEach(row => {
    // 【重要核心】如果標記為「作廢」，完全無視這筆資料！
    if (row["單據狀態"] === "作廢") return; 

    const rowDate = new Date(row["結帳時間"]);
    let isMatch = false;

    // 計算今日總額
    if (rowDate.toDateString() === now.toDateString()) {
      todayTotal += parseInt(row["總金額"]) || 0;
    }

    if (filterType === 'today') { isMatch = (rowDate.toDateString() === now.toDateString()); } 
    else if (filterType === 'month') { isMatch = (rowDate.getMonth() === now.getMonth() && rowDate.getFullYear() === now.getFullYear()); } 
    else if (filterType === 'week') {
      const diffTime = Math.abs(now - rowDate);
      isMatch = (Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7);
    }

    if (isMatch) {
      let itemsStr = "";
      try {
        const items = JSON.parse(row["購買明細(JSON)"]);
        items.forEach(item => {
          // 計算分潤
          if(techRevenue[item.technician] !== undefined) { techRevenue[item.technician] += parseInt(item.price) || 0; }
        });
        // 準備詳細報表的字串
        itemsStr = items.map(i => `${i.item_name} <span style="color:#888;">(${i.technician})</span>`).join("<br>");
      } catch(e) {}

      // 如果選擇「今日業績」，則把這筆資料加入詳細報表
      if (filterType === 'today') {
        hasDetail = true;
        const timeStr = `${rowDate.getHours().toString().padStart(2,'0')}:${rowDate.getMinutes().toString().padStart(2,'0')}`;
        detailedHTML += `
          <tr>
            <td style="text-align:center;">${timeStr}<br><span style="font-size:0.8em; color:#999;">${row["交易單號"]}</span></td>
            <td style="text-align:center; font-weight:bold;">${row["會員名稱"]}</td>
            <td>${itemsStr}</td>
            <td style="text-align:right; font-weight:bold; color:var(--primary-hover);">NT$ ${row["總金額"]}</td>
          </tr>`;
      }
    }
  });

  detailedHTML += `</table>`;

  // 更新今日總額看板
  document.getElementById("dashboardTodayTotal").innerText = `NT$ ${todayTotal.toLocaleString()}`;

  // 更新老師分潤區塊
  const summaryDiv = document.getElementById("reportSummary");
  summaryDiv.innerHTML = ""; let hasData = false;
  technicians.forEach(t => {
    if(techRevenue[t] !== 0 || t !== "無指定") {
      hasData = true;
      const card = document.createElement("div"); card.className = "report-card";
      card.innerHTML = `<span>👩‍💼 操作老師：${t}</span> <span class="amount">NT$ ${techRevenue[t].toLocaleString()}</span>`;
      summaryDiv.appendChild(card);
    }
  });
  if(!hasData) summaryDiv.innerHTML = "<div class='report-card' style='justify-content:center; color:#999;'>該區間尚無業績資料</div>";

  // 更新下方詳細明細區塊
  const detailContainer = document.getElementById("detailedReportContainer");
  if (filterType === 'today' && hasDetail) {
    detailContainer.innerHTML = detailedHTML;
    detailContainer.style.display = "block";
  } else {
    detailContainer.style.display = "none";
  }
}

// ==========================================
// 統一單據作廢管理邏輯
// ==========================================
function openVoidModal() {
  document.getElementById("voidModal").style.display = "flex";
  // 預設選擇今天
  document.getElementById("voidQueryDate").value = new Date().toISOString().split('T')[0];
  fetchVoidList(); 
}

function fetchVoidList() {
  const targetDateStr = document.getElementById("voidQueryDate").value;
  if (!targetDateStr) return;
  const targetDate = new Date(targetDateStr);
  
  const container = document.getElementById("voidListContainer");
  container.innerHTML = "讀取中，請稍候...";
  
  const reqMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
  
  fetch(GAS_URL + "?month=" + reqMonth)
    .then(res => res.json())
    .then(res => {
      if(res.status === "success") {
        container.innerHTML = "";
        let hasData = false;
        res.data.forEach(row => {
          const rowDate = new Date(row["結帳時間"]);
          
          // 【核心修改】：這裡嚴格檢查，只要是「作廢」就直接隱藏，絕不顯示在清單中
          if (rowDate.toDateString() === targetDate.toDateString() && row["單據狀態"] !== "作廢") {
            hasData = true;
            const div = document.createElement("div");
            div.style.cssText = "border: 1px solid #E2D6C8; padding:12px; margin-bottom:10px; border-radius:8px; background:#fff; display:flex; justify-content:space-between; align-items:center;";
            
            div.innerHTML = `
              <div>
                <strong style="color:var(--text-dark); font-size:1.1em;">顧客：${row["會員名稱"]}</strong> <span style="color:#999; font-size:0.9em;">(單號：${row["交易單號"]})</span><br>
                <span style="font-size:0.95em; color:#666;">結帳時間：${row["結帳時間"]} | 總額：NT$ ${row["總金額"]}</span>
              </div>
              <div>
                <button class="btn-void" onclick="executeVoid('${row["交易單號"]}', '${row["結帳時間"]}')">將此單作廢</button>
              </div>
            `;
            container.appendChild(div);
          }
        });
        if(!hasData) container.innerHTML = "<p style='text-align:center; color:#888; padding: 20px 0;'>該日目前沒有可以作廢的正常單據。</p>";
      }
    });
}

function executeVoid(orderId, checkoutTime) {
  if (!confirm(`確定要作廢單號 ${orderId} 嗎？\n注意：作廢後該單據將完全消失，且不可復原！`)) return;
  
  document.getElementById("voidListContainer").innerHTML = "作廢處理中，請稍候...";
  
  fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "void", order_id: orderId, checkout_time: checkoutTime })
  })
  .then(res => res.json())
  .then(result => {
    alert(result.message);
    // 成功作廢後，清空所有報表快取並重新抓取，確保資料最新！
    allReportData = []; 
    fetchVoidList(); // 重新整理作廢清單(剛作廢的單會直接消失)
    if(document.getElementById('content-report').classList.contains('active')) {
      loadReport('today'); // 重新刷新背景的業績看板
    }
  })
  .catch(err => alert("處理失敗請重試"));
}

// ==========================================
// 簽名板與收據截圖儲存 (正常結帳邏輯維持不變)
// ==========================================
const canvas = document.getElementById("sigCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
function startDrawing(e) { isDrawing = true; draw(e); }
function stopDrawing() { isDrawing = false; ctx.beginPath(); }
function draw(e) {
  if (!isDrawing) return; e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const clientX = e.clientX || e.touches[0].clientX; const clientY = e.clientY || e.touches[0].clientY;
  ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.strokeStyle = "#000";
  ctx.lineTo(clientX - rect.left, clientY - rect.top); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(clientX - rect.left, clientY - rect.top);
}
canvas.addEventListener("mousedown", startDrawing); canvas.addEventListener("mouseup", stopDrawing); canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", startDrawing, {passive: false}); canvas.addEventListener("touchend", stopDrawing); canvas.addEventListener("touchmove", draw, {passive: false});
function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

function preparePrintReceipt() {
  const now = new Date(); const pad = num => String(num).padStart(2, '0');
  if (!currentOrderId) { currentTimeString = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`; currentOrderId = `F${now.getTime()}`; }
  const memberName = document.getElementById("memberName").value.trim();
  document.getElementById("rcptOrderId").innerText = currentOrderId;
  document.getElementById("rcptTime").innerText = currentTimeString;
  document.getElementById("rcptPayMethod").innerText = document.getElementById("paymentMethod").value;
  document.getElementById("rcptCashier").innerText = document.getElementById("cashier").value;

  const itemsBody = document.getElementById("rcptItemsBody"); itemsBody.innerHTML = "";
  document.querySelectorAll("#cartBody tr").forEach(row => {
    const sName = row.querySelector(".item-name").value; const sTech = row.querySelector(".item-tech").value;
    const sPrice = parseInt(row.querySelector(".item-price").value) || 0;
    let displayPrice = "$" + sPrice; if (sName.includes("抵扣")) displayPrice = "-$" + Math.abs(sPrice);
    itemsBody.innerHTML += `<tr><td><div class="rcpt-item-title">${sName}</div><div class="rcpt-item-desc">${memberName}</div></td><td style="text-align: center;">1</td><td style="text-align: right;"><div class="rcpt-item-title">${displayPrice}</div><div class="rcpt-item-desc">(${sTech})</div></td></tr>`;
  });
  document.getElementById("rcptTotalAmount").innerText = "$" + calculateTotal();
}

async function startCheckout() {
  const memberName = document.getElementById("memberName").value.trim();
  if (!memberName) return alert("請輸入會員名稱！");
  if (document.querySelectorAll("#cartBody tr").length === 0) return alert("請至少新增一項明細！");
  let priceMissing = false; document.querySelectorAll(".item-price").forEach(input => { if(input.value === "") priceMissing = true; });
  if(priceMissing) return alert("有服務項目的金額尚未填寫，請確認後再結帳！");

  const btn = document.getElementById("btnGenerate"); btn.disabled = true; btn.innerText = "處理收據排版中...";
  try {
    preparePrintReceipt(); 
    const receiptTemplate = document.getElementById("printReceiptTemplate");
    const draftCanvas = await html2canvas(receiptTemplate, { scale: 2, backgroundColor: "#ffffff" });
    draftBase64Data = draftCanvas.toDataURL("image/jpeg", 0.8);
    document.getElementById("signatureModal").style.display = "flex"; btn.innerText = "等待顧客簽名...";
  } catch (err) { alert("排版截圖發生錯誤，請重試！"); resetBtn(); }
}

async function confirmSignature() {
  const blank = document.createElement('canvas'); blank.width = canvas.width; blank.height = canvas.height;
  if (canvas.toDataURL() === blank.toDataURL()) return alert("請顧客完成簽名！");
  document.getElementById("signatureModal").style.display = "none"; document.getElementById("btnGenerate").innerText = "最終排版產生中...";
  
  const sigImg = document.getElementById("rcptSignatureImg"); const sigArea = document.getElementById("rcptSignatureArea");
  await new Promise((resolve) => { sigImg.onload = () => { sigArea.style.display = "block"; setTimeout(resolve, 100); }; sigImg.src = canvas.toDataURL("image/png"); });
  
  const receiptTemplate = document.getElementById("printReceiptTemplate");
  const finalCanvas = await html2canvas(receiptTemplate, { scale: 2, backgroundColor: "#ffffff" });
  signedBase64Data = finalCanvas.toDataURL("image/jpeg", 0.8);
  submitToGAS();
}

function submitToGAS() {
  document.getElementById("btnGenerate").innerText = "資料上傳雲端中，請稍候...";
  const cartItems = [];
  document.querySelectorAll("#cartBody tr").forEach(row => {
    const sName = row.querySelector(".item-name").value; let sPrice = parseInt(row.querySelector(".item-price").value) || 0;
    if (sName.includes("抵扣")) sPrice = -Math.abs(sPrice);
    cartItems.push({ item_name: sName, technician: row.querySelector(".item-tech").value, price: sPrice });
  });

  const payload = {
    action: "checkout",
    checkout_time: currentTimeString, order_id: currentOrderId,
    member_name: document.getElementById("memberName").value, cashier: document.getElementById("cashier").value,
    payment_method: document.getElementById("paymentMethod").value, payment_unit: document.getElementById("paymentUnit").value,
    total_amount: calculateTotal(), cart_items: cartItems, note: document.getElementById("orderNote").value,
    draft_base64: draftBase64Data, signed_base64: signedBase64Data
  };

  fetch(GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) })
  .then(response => response.json())
  .then(result => {
    if (result.status === "success") { alert("結帳成功！清晰版收據已存入雲端。"); location.reload(); } 
    else { alert("儲存回報異常：" + result.message); resetBtn(); }
  }).catch(error => { alert("網路錯誤，請檢查網路後重試。"); resetBtn(); });
}

function resetBtn() { document.getElementById("btnGenerate").disabled = false; document.getElementById("btnGenerate").innerText = "產生確認單並簽名"; }
