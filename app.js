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

window.onload = () => { 
  initCheckoutTime();
  initCashierOptions(); 
  renderCategoryButtons(); 
};

function initCheckoutTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('checkoutDateTime').value = now.toISOString().slice(0,16);
}

function switchTab(tabName) {
  document.querySelectorAll('.nav-tabs button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  document.getElementById('content-' + tabName).classList.add('active');
  if (tabName === 'report') loadReport('today'); 
}

function initCashierOptions() { 
  document.getElementById("cashier").innerHTML = technicians.map(t => `<option value="${t}">${t}</option>`).join(''); 
}

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
  const currentCashier = document.getElementById("cashier").value;
  
  const techOptions = technicians.map(t => {
    const isSelected = (t === currentCashier) ? "selected" : "";
    return `<option value="${t}" ${isSelected}>${t}</option>`;
  }).join('');

  const inputHTML = (itemPrice === "*") ? `<input type="number" class="item-price" placeholder="輸入金額" oninput="calculateTotal()">` : `<input type="number" class="item-price" value="${itemPrice}" oninput="calculateTotal()" readonly style="background:#eee;">`;
  const qtyHTML = `<input type="number" class="item-qty" value="1" min="1" oninput="calculateTotal()" style="width: 100%; text-align: center; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px;">`;
  
  tr.innerHTML = `<td style="text-align:left; font-weight:bold;"><input type="hidden" class="item-name" value="${itemName}">${itemName}</td>
                  <td><select class="item-tech">${techOptions}</select></td>
                  <td>${inputHTML}</td>
                  <td>${qtyHTML}</td>
                  <td><button class="btn-remove" onclick="removeCartItem(this)">刪除</button></td>`;
  tbody.appendChild(tr); 
  
  tr.querySelector(".item-tech").value = currentCashier;
  calculateTotal();
}

function removeCartItem(btn) { btn.closest("tr").remove(); calculateTotal(); }

function calculateTotal() {
  let total = 0;
  document.querySelectorAll("#cartBody tr").forEach(row => {
    const sName = row.querySelector(".item-name").value;
    let price = parseInt(row.querySelector(".item-price").value) || 0;
    let qty = parseInt(row.querySelector(".item-qty").value) || 1;
    let subtotal = price * qty;
    
    if (sName.includes("抵扣")) { total -= Math.abs(subtotal); } else { total += subtotal; }
  });
  document.getElementById("totalAmount").innerText = total; return total;
}

// ==========================================
// 店務報表 (安全時間解析，絕對不掉資料)
// ==========================================
let allReportData = []; 
let currentFilter = 'today';
let currentTechFilter = null; 
let loadedMonth = ""; 

function toggleTechFilter(techName) {
  if (currentTechFilter === techName) currentTechFilter = null; 
  else currentTechFilter = techName; 
  processReportData(currentFilter);
}

function loadReport(filterType) {
  currentFilter = filterType;
  currentTechFilter = null; 
  document.querySelectorAll('.report-controls button').forEach(b => b.classList.remove('active'));
  
  let reqMonth = String(new Date().getMonth() + 1).padStart(2, '0');

  if (filterType !== 'custom') {
    document.getElementById('filter-' + filterType).classList.add('active');
    document.getElementById('customDateFilter').value = ""; 
  } else {
    const customDate = document.getElementById("customDateFilter").value;
    if (!customDate) return; 
    reqMonth = customDate.split('-')[1]; 
  }
  
  const summaryDiv = document.getElementById("reportSummary");
  const detailedBody = document.getElementById("detailedReportBody");
  const loadingDiv = document.getElementById("loadingReport");

  if (allReportData.length === 0 || loadedMonth !== reqMonth) {
    summaryDiv.innerHTML = ""; detailedBody.innerHTML = "";
    loadingDiv.style.display = "block";
    fetch(GAS_URL + "?month=" + reqMonth)
      .then(res => res.json())
      .then(res => {
        if(res.status === "success") { 
          allReportData = res.data; 
          loadedMonth = reqMonth;
          processReportData(filterType); 
        }
        loadingDiv.style.display = "none";
      }).catch(err => { loadingDiv.style.display = "none"; });
  } else { 
    processReportData(filterType); 
  }
}

function processReportData(filterType) {
  const now = new Date();
  const pad = num => String(num).padStart(2, '0');
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const thisMonthStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}`;
  
  let customDateStr = "";
  if (filterType === 'custom') {
    customDateStr = document.getElementById("customDateFilter").value;
    if (!customDateStr) return; 
  }

  let techRevenue = {}; technicians.forEach(t => techRevenue[t] = 0);
  let cashFlow = { "現金": 0, "刷卡": 0, "匯款": 0, "扣堂": 0, "儲值金": 0 };
  let filteredTotal = 0; 
  let detailedHTML = "";

  allReportData.forEach(row => {
    const rawTimeStr = String(row["結帳時間"]);
    let rowDateObj = new Date(rawTimeStr.replace(/-/g, '/'));
    if (isNaN(rowDateObj.getTime())) return; 

    const rowDateStr = `${rowDateObj.getFullYear()}-${pad(rowDateObj.getMonth()+1)}-${pad(rowDateObj.getDate())}`;
    
    // 💡 同步讀取新的狀態欄位名稱
    const isVoid = (row["收據明細狀態"] === "作廢");

    let isMatch = false;
    if (filterType === 'today') { 
      isMatch = (rowDateStr === todayStr); 
    } else if (filterType === 'custom') {
      isMatch = (rowDateStr === customDateStr);
    } else if (filterType === 'month') { 
      isMatch = rowDateStr.startsWith(thisMonthStr); 
    } else if (filterType === 'week') {
      const diffTime = Math.abs(now - rowDateObj);
      isMatch = (Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7);
    }

    if (isMatch) {
      const rowAmount = isVoid ? 0 : (parseInt(row["總金額"]) || 0);
      filteredTotal += rowAmount;

      if (!isVoid) {
        let method = row["收款方式"] || "現金";
        if (cashFlow[method] !== undefined) {
          cashFlow[method] += rowAmount;
        } else {
          cashFlow["現金"] += rowAmount;
        }
      }

      let items = [];
      try { items = JSON.parse(row["購買明細(JSON)"]); } catch(e) {}
      
      items.forEach(item => {
        if(!isVoid && techRevenue[item.technician] !== undefined) { 
          let qty = parseInt(item.qty) || 1;
          techRevenue[item.technician] += (parseInt(item.price) || 0) * qty; 
        }
      });

      let displayItems = items;
      let rowTotalAmount = parseInt(row["總金額"]) || 0;

      if (currentTechFilter) {
        displayItems = items.filter(i => i.technician === currentTechFilter);
        if (displayItems.length === 0) return; 
        rowTotalAmount = displayItems.reduce((sum, item) => sum + ((parseInt(item.price) || 0) * (parseInt(item.qty) || 1)), 0);
      }

      const itemsStr = displayItems.map(i => {
        let qty = parseInt(i.qty) || 1;
        let qtyDisplay = qty > 1 ? ` <span style="color:#d9534f;font-weight:bold;">x${qty}</span>` : "";
        return `${i.item_name}${qtyDisplay} (${i.technician})`;
      }).join('<br>');

      const displayTime = `${rowDateStr} <br> ${pad(rowDateObj.getHours())}:${pad(rowDateObj.getMinutes())}`;
      const phoneDisplay = row["手機號碼"] ? `<br><span style="font-size:0.85em; color:#666;">📞 ${row["手機號碼"]}</span>` : "";

      let paymentBadge = "";
      if (filterType === 'today' || filterType === 'custom') {
        const pMethod = row["收款方式"] || "現金";
        paymentBadge = `<br><span style="font-size:0.8em; background:#E8E0D5; color:#5C4A3D; padding:2px 6px; border-radius:4px; display:inline-block; margin-top:3px;">💳 ${pMethod}</span>`;
      }

      const displayAmount = isVoid 
        ? `<span style="text-decoration:line-through; color:#aaa; font-size:0.9em;">$${rowTotalAmount}</span><br><strong style="color:#d9534f;">$0 [已作廢]</strong>`
        : `<strong>$${rowTotalAmount}</strong>`;
      const rowStyle = isVoid ? `background-color: #fdf5f5; color: #a0a0a0;` : ``;

      detailedHTML += `
        <tr style="${rowStyle}">
          <td style="font-size:0.85em;">${displayTime}</td>
          <td>${row["會員名稱"]} ${phoneDisplay} ${paymentBadge}</td>
          <td style="font-size:0.9em; line-height:1.4; text-align:left;">${itemsStr}</td>
          <td style="color:var(--text-dark); font-size:1.1em;">${displayAmount}</td>
        </tr>
      `;
    }
  });

  const cashFlowBox = document.getElementById("cashFlowBox");
  const cashFlowGrid = document.getElementById("cashFlowGrid");
  const archiveSection = document.getElementById("archiveSection");

  if (filterType === 'today' || filterType === 'custom') {
    cashFlowBox.style.display = "block";
    archiveSection.style.display = "block";
    cashFlowGrid.innerHTML = `
      <div class="cashflow-item">💵 現金<br><span style="color:var(--primary-hover);">NT$ ${cashFlow["現金"].toLocaleString()}</span></div>
      <div class="cashflow-item">💳 刷卡<br><span style="color:var(--primary-hover);">NT$ ${cashFlow["刷卡"].toLocaleString()}</span></div>
      <div class="cashflow-item">🏦 匯款<br><span style="color:var(--primary-hover);">NT$ ${cashFlow["匯款"].toLocaleString()}</span></div>
      <div class="cashflow-item">🎫 扣堂<br><span style="color:var(--primary-hover);">NT$ ${cashFlow["扣堂"].toLocaleString()}</span></div>
      <div class="cashflow-item">💎 儲值金<br><span style="color:var(--primary-hover);">NT$ ${cashFlow["儲值金"].toLocaleString()}</span></div>
    `;
  } else {
    cashFlowBox.style.display = "none";
    archiveSection.style.display = "none";
  }

  document.getElementById("dashboardTodayTotal").innerText = `NT$ ${filteredTotal.toLocaleString()}`;
  document.getElementById("dashboardTotalTitle").innerText = currentTechFilter ? `該區間結帳總額 (目前篩選: ${currentTechFilter})` : `該區間結帳總額 (已扣除作廢)`;

  const detailedBody = document.getElementById("detailedReportBody");
  detailedBody.innerHTML = detailedHTML !== "" ? detailedHTML : `<tr><td colspan="4" style="text-align:center; color:#999; padding:20px;">該區間/該老師尚無結帳明細</td></tr>`;

  const summaryDiv = document.getElementById("reportSummary");
  summaryDiv.innerHTML = ""; let hasData = false;
  technicians.forEach(t => {
    if(techRevenue[t] !== 0 || t !== "無指定") {
      hasData = true;
      const card = document.createElement("div"); 
      card.className = "report-card" + (currentTechFilter === t ? " active-tech" : "");
      card.onclick = () => toggleTechFilter(t); 
      card.innerHTML = `<span>👩‍💼 操作老師：${t}</span> <span class="amount">NT$ ${techRevenue[t].toLocaleString()}</span>`;
      summaryDiv.appendChild(card);
    }
  });
  if(!hasData) summaryDiv.innerHTML = "<div class='report-card' style='justify-content:center; color:#999;'>該區間尚無業績資料</div>";
}

function executeArchive() {
  let targetDate = "";
  const now = new Date();
  const pad = num => String(num).padStart(2, '0');
  
  if (currentFilter === 'today') {
    targetDate = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  } else if (currentFilter === 'custom') {
    targetDate = document.getElementById("customDateFilter").value;
  }
  
  if (!targetDate) return alert("請先選擇要歸檔的特定日期（或切換至今日業績）！");
  if (!confirm(`確定要將 [${targetDate}] 的所有有效業績歸檔寫入分潤資料表嗎？`)) return;
  
  const archiveBtn = document.querySelector(".btn-archive");
  archiveBtn.disabled = true; archiveBtn.innerText = "正在寫入分潤資料表，請稍候...";
  
  fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "archive", target_date: targetDate })
  })
  .then(res => res.json())
  .then(result => {
    alert(result.message);
    archiveBtn.disabled = false; archiveBtn.innerText = "📁 確認無誤，執行業績歸檔";
  })
  .catch(err => {
    alert("歸檔發生錯誤，請檢查網路連線。");
    archiveBtn.disabled = false; archiveBtn.innerText = "📁 確認無誤，執行業績歸檔";
  });
}

// ==========================================
// 單據查詢與作廢管理 (日期安全解析法)
// ==========================================
function openVoidModal() {
  document.getElementById("voidModal").style.display = "flex";
  document.getElementById("voidQueryDate").value = new Date().toISOString().split('T')[0];
  document.getElementById("voidListContainer").innerHTML = '<p style="text-align:center; color:#888;">請點選右上方「查詢單據」載入紀錄...</p>';
}

function fetchVoidList() {
  const targetDateStr = document.getElementById("voidQueryDate").value;
  if (!targetDateStr) return alert("請先選擇日期！");
  
  const container = document.getElementById("voidListContainer");
  container.innerHTML = "<p style='text-align:center;'>資料讀取中，請稍候...</p>";
  
  const reqMonth = targetDateStr.split("-")[1];
  
  fetch(GAS_URL + "?month=" + reqMonth)
    .then(res => res.json())
    .then(res => {
      if(res.status === "success") {
        container.innerHTML = "";
        let hasData = false;
        res.data.forEach(row => {
          // 💡 同步讀取新的狀態欄位名稱
          if (row["收據明細狀態"] === "作廢") return; 

          const rawTimeStr = String(row["結帳時間"]);
          let rowDateObj = new Date(rawTimeStr.replace(/-/g, '/'));
          if (isNaN(rowDateObj.getTime())) return;
          
          const pad = num => String(num).padStart(2, '0');
          const rowDateStr = `${rowDateObj.getFullYear()}-${pad(rowDateObj.getMonth()+1)}-${pad(rowDateObj.getDate())}`;

          if (rowDateStr === targetDateStr) {
            hasData = true;
            const div = document.createElement("div");
            div.style.cssText = "border: 1px solid #ccc; padding:15px; margin-bottom:10px; border-radius:6px; background:#fff; display:flex; justify-content:space-between; align-items:center;";
            
            div.innerHTML = `
              <div>
                <strong>顧客：${row["會員名稱"]}</strong> (單號：${row["交易單號"]})<br>
                <span style="font-size:0.9em; color:#666; display:block; margin-top:5px;">時間：${row["結帳時間"]} | 應收：$${row["總金額"]}</span>
              </div>
              <div>
                <button class="btn-void" onclick="executeVoid('${row["交易單號"]}', '${row["結帳時間"]}')">執行作廢</button>
              </div>
            `;
            container.appendChild(div);
          }
        });
        if(!hasData) container.innerHTML = "<p style='text-align:center; padding:20px; color:#999;'>該日目前沒有可以作廢的正常單據</p>";
      }
    });
}

function executeVoid(orderId, checkoutTime) {
  if (!confirm(`確定要作廢這筆單據嗎？作廢後業績將歸零，並無法再撤銷！`)) return;
  
  const container = document.getElementById("voidListContainer");
  container.innerHTML = "<p style='text-align:center; font-weight:bold; color:var(--danger-color);'>作廢處理中，請勿關閉視窗...</p>";
  
  fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "void", order_id: orderId, checkout_time: checkoutTime })
  })
  .then(res => res.json())
  .then(result => {
    alert("作廢成功！系統將自動刷新帳務...");
    allReportData = []; // 清空快取
    loadedMonth = "";
    fetchVoidList(); 
    loadReport(currentFilter); 
  })
  .catch(err => alert("處理失敗請確認網路後重試"));
}

// ==========================================
// 簽名板與收據截圖儲存 
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
  const pad = num => String(num).padStart(2, '0');
  const selectedTime = document.getElementById("checkoutDateTime").value;
  const d = new Date(selectedTime);
  currentTimeString = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  
  if (!currentOrderId) { currentOrderId = `F${Date.now()}`; }

  const memberName = document.getElementById("memberName").value.trim();
  document.getElementById("rcptOrderId").innerText = currentOrderId;
  document.getElementById("rcptTime").innerText = currentTimeString;
  document.getElementById("rcptPayMethod").innerText = document.getElementById("paymentMethod").value;
  document.getElementById("rcptCashier").innerText = document.getElementById("cashier").value;

  const itemsBody = document.getElementById("rcptItemsBody"); itemsBody.innerHTML = "";
  document.querySelectorAll("#cartBody tr").forEach(row => {
    const sName = row.querySelector(".item-name").value; 
    const sTech = row.querySelector(".item-tech").value;
    const sPrice = parseInt(row.querySelector(".item-price").value) || 0;
    const sQty = parseInt(row.querySelector(".item-qty").value) || 1; 
    
    const subtotal = Math.abs(sPrice) * sQty;
    let displayPrice = "$" + subtotal; 
    if (sName.includes("抵扣")) displayPrice = "-$" + subtotal;
    
    itemsBody.innerHTML += `<tr><td><div class="rcpt-item-title">${sName}</div><div class="rcpt-item-desc">${memberName}</div></td><td style="text-align: center;">${sQty}</td><td style="text-align: right;"><div class="rcpt-item-title">${displayPrice}</div><div class="rcpt-item-desc">(${sTech})</div></td></tr>`;
  });
  document.getElementById("rcptTotalAmount").innerText = "$" + calculateTotal();
}

async function startCheckout() {
  const memberName = document.getElementById("memberName").value.trim();
  if (!memberName) return alert("請輸入會員名稱！");
  
  const phone = document.getElementById("memberPhone").value.trim();
  if (!phone) return alert("請輸入手機號碼！");

  if (document.querySelectorAll("#cartBody tr").length === 0) return alert("請至少新增一項明細！");
  let priceMissing = false; 
  document.querySelectorAll(".item-price").forEach(input => { if(input.value === "") priceMissing = true; });
  if(priceMissing) return alert("有服務項目的金額尚未填寫，請確認後再結帳！");
  
  if (!document.getElementById("checkoutDateTime").value) return alert("請確認結帳時間不可為空！");

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
    const sName = row.querySelector(".item-name").value; 
    let sPrice = parseInt(row.querySelector(".item-price").value) || 0;
    let sQty = parseInt(row.querySelector(".item-qty").value) || 1;
    if (sName.includes("抵扣")) sPrice = -Math.abs(sPrice);
    cartItems.push({ item_name: sName, technician: row.querySelector(".item-tech").value, price: sPrice, qty: sQty });
  });

  const payload = {
    action: "checkout",
    checkout_time: currentTimeString, 
    order_id: currentOrderId,
    member_name: document.getElementById("memberName").value.trim(), 
    phone_number: document.getElementById("memberPhone").value.trim(), 
    cashier: document.getElementById("cashier").value,
    payment_method: document.getElementById("paymentMethod").value, 
    payment_unit: document.getElementById("paymentUnit").value,
    total_amount: calculateTotal(), 
    cart_items: cartItems, 
    note: document.getElementById("orderNote").value,
    draft_base64: draftBase64Data, 
    signed_base64: signedBase64Data
  };

  fetch(GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) })
  .then(response => response.json())
  .then(result => {
    if (result.status === "success") { alert("結帳成功！清晰版收據已存入雲端。"); location.reload(); } 
    else { alert("儲存回報異常：" + result.message); resetBtn(); }
  }).catch(error => { alert("網路錯誤，請檢查網路後重試。"); resetBtn(); });
}

function resetBtn() { document.getElementById("btnGenerate").disabled = false; document.getElementById("btnGenerate").innerText = "產生確認單並簽名"; }
