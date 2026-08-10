// ==========================================
// 系統變數與選單資料庫
// ==========================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbz1BKmcuIs6CbIi7d5U8qpD381QwZhUT550DAtSi1S1OSRVg1GOzlSiSBM3ERa2rGzj4A/exec";

// 💡 資安防護：密碼設定區
const SYSTEM_PWD = "96831088"; // 第一層：系統密碼
const ROLE_PASSWORDS = {
  "9683": "admin",      // 總管理員 (可看全部、歸檔、作廢)
  "1111": "李家蓁",     // 個人密碼 
  "1007": "呂函優",     // 更新個人密碼
  "0505": "呂佩穎"      // 更新個人密碼
};
let currentRole = sessionStorage.getItem('currentRole') || null;

let draftBase64Data = "";
let signedBase64Data = "";
let currentOrderId = "";
let currentTimeString = "";

let inactivityTimer;
const INACTIVITY_LIMIT = 10 * 60 * 1000; 

const technicians = ["李家蓁", "呂函優", "呂佩穎", "店面收支"];

const menuData = {
  "💅 美甲-手部": { "設計款-不指定設計師優惠價": 999, "設計款-指定設計師優惠價": 1299, "服務費": "*", "造型飾品": "*", "造型凝膠設計": "*", "變化貓眼": "*", "客製沙龍造型": "*", "活動優惠價": "*", "單色美甲": 799, "亮片美甲": 799, "貓眼美甲": 899, "透明建甲": 600, "單指延長甲": 120, "十指延長甲": 1000, "單色漸層": 999, "變化法式": 1100, "變化跳色": 1000, "美甲鏡面造型(單指)": 80, "美甲鏡面造型(十指)": 500, "兒童美甲": 700 },
  "🦶 美甲-足部": { "設計款-不指定設計師優惠價": 1199, "設計款-指定設計師優惠價": 1499, "服務費": "*", "造型飾品": "*", "造型凝膠設計": "*", "變化貓眼": "*", "活動優惠價": "*", "單色美甲": 999, "亮片美甲": 999, "貓眼美甲": 1099, "透明建甲": 800, "客製沙龍造型": "*", "單色漸層": 1199, "變化法式": 1300, "變化跳色": 1200, "美甲鏡面造型(單指)": 80, "美甲鏡面造型(十指)": 500 },
  "🌿 健康甲": { "微晶補甲(大拇指)": 200, "微晶補甲(其他小指)": 100, "指甲強韌處理(十指)": 300, "嵌甲(大拇指)": 100, "嵌甲(其他小指)": 50, "捲甲矯正(大拇指)": 300, "捲甲矯正(其他小指)": 200, "重建甲床(大拇指)": 500, "重建甲床(其他小指)": 300, "異型調整": 300, "矯正貼片": 1500 },
  "🏥 特殊指甲護理": { "咬甲矯正": 1000, "肉包甲強化塑型(大拇指)": 200, "肉包甲強化塑型(其他小指)": 100, "矯正貼片": 1500, "特殊甲護理-(足部十趾)": 700, "特殊指甲/捲甲矯正(大拇指)": 500, "特殊指甲/捲甲矯正(其他小趾)": 300, "特殊甲/嵌甲(大拇指)": 100, "特殊甲/嵌甲(其他小指)": 100, "異型增生/菌絲養護(大拇指)": 500, "異型增生/菌絲養護(其他小指)": 300, "特殊甲護理(手部)": 500, "特殊甲/甲床重建(其他小指/單指計費)": 300, "特殊甲/甲床重建(大拇指/單指計費)": 500, "特殊甲足繭(嚴重)": 1300, "特殊甲足繭(一般)": 1100 },
  "👁️ 美睫": { "自然裸妝": 1000, "濃密": 1300, "爆濃款": 1500, "加購(下睫毛)": 200, "純卸睫毛(本店)": 300, "純卸睫毛(他店)": 500, "卸睫續接卸睫費(本店)": 100, "卸睫續接卸睫費(他店)": 200, "自訂": "*", "服務費": "*", "睫毛管理(上睫毛)": 1199, "睫毛管理(下睫毛)": 699, "睫毛管理(增黑)": 300, "睫毛管理體驗價(上睫毛)": 999 },
  "👂 采耳": { "專業採耳": 999, "兒童耳道清潔": 699, "耳氤氳肩頸舒緩": 899, "身心減壓套餐": 1599, "服務費": "*" },
  "🧴 手足保養": { "淨化保養-手部淨化指甲保養續作": 300, "淨化保養-足部指甲": 500, "淨化保養-手部純保養": 400, "淨化保養-手工拋光": 100, "深層保養-短膜手足膜": 299, "深層保養-長膜手足膜": 399, "深層保養-手部深層保養": 1200, "深層保養-足部深層保養": 1800, "深層保養-足繭護理(嚴重)": 1000, "深層保養-足繭護理(一般)": 800, "深層保養-拋棄式足搓": 99 },
  "💧 卸甲": { "卸甲(他店續做)": 300, "卸甲(本店不續做)": 300, "卸甲(他店不續做)": 500, "卸甲(本店續做)": 200 },
  "🛍️ 產品": { "特殊甲產品-修甲套組": 1500, "特殊甲產品-防潮平衡液": 280, "特殊甲產品-BAOGAAO": 350, "特殊甲產品-灰指甲修護液": 980, "特殊甲產品-淨銀乳": 680, "特殊甲產品-磨板類": 40, "特殊甲產品-煥采抗菌噴霧": 480, "指緣修護油": 280, "指緣軟化液": 350, "鈣元素硬甲油": 375, "手足滋潤修護霜": 280 },
  "🪒 除毛": { "腋下": 400, "腳趾/手指": 250, "全背": 800, "小花": 300, "小腿": 800, "大腿": 800, "上手臂/小手臂": 700, "比基尼式": 1300, "膝蓋": 200, "巴西式全除": 1600, "特殊護理(保濕鎮定敷膜A)": 99, "特殊護理(保濕鎮定敷膜B)": 299 },
  "💰 定金及加費": { "定金": 500, "定金(抵扣)": "*", "指定費": "*", "服務費": "*", "加班費": 200, "年節服務費": 100, "儲值金(儲值)": "*", "儲值金(抵扣)": "*", "課堂購買": "*" }
};

function getCategoryByItemName(itemName) {
  for (const category in menuData) {
    if (menuData[category][itemName] !== undefined) { return category; }
  }
  return "其他項目"; 
}

window.onload = () => { 
  if (!sessionStorage.getItem('systemUnlocked')) {
    document.getElementById('systemLoginModal').style.display = 'flex';
  }
  
  initCheckoutTime();
  initCashierOptions(); 
  renderCategoryButtons(); 
  addPaymentRow();
  document.getElementById('commissionMonthSelector').value = new Date().toISOString().slice(0,7);
  updateLogoutButton();

  ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, resetInactivityTimer);
  });
  resetInactivityTimer(); 
};

function lockSystem() {
  sessionStorage.removeItem('systemUnlocked');
  sessionStorage.removeItem('currentRole');
  currentRole = null;
  updateLogoutButton();
  
  switchTab('checkout'); 
  
  document.getElementById('systemLoginModal').style.display = 'flex';
  document.getElementById('roleLoginModal').style.display = 'none';
  document.getElementById('sysPwdInput').value = "";
  document.getElementById('rolePwdInput').value = "";
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  if (sessionStorage.getItem('systemUnlocked')) {
    inactivityTimer = setTimeout(lockSystem, INACTIVITY_LIMIT);
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    lockSystem();
  }
});

function verifySystemPassword() {
  if (document.getElementById('sysPwdInput').value === SYSTEM_PWD) {
    sessionStorage.setItem('systemUnlocked', 'true');
    document.getElementById('systemLoginModal').style.display = 'none';
    resetInactivityTimer(); 
  } else {
    alert("❌ 系統密碼錯誤！請輸入正確的密碼。");
    document.getElementById('sysPwdInput').value = "";
  }
}

function verifyRolePassword() {
  const pwd = document.getElementById('rolePwdInput').value;
  if (ROLE_PASSWORDS[pwd]) {
    currentRole = ROLE_PASSWORDS[pwd];
    sessionStorage.setItem('currentRole', currentRole);
    document.getElementById('roleLoginModal').style.display = 'none';
    document.getElementById('rolePwdInput').value = ""; 
    updateLogoutButton();
    const targetTab = document.getElementById('roleLoginModal').dataset.targetTab;
    switchTab(targetTab); 
  } else {
    alert("❌ 密碼錯誤，權限不足！");
    document.getElementById('rolePwdInput').value = "";
  }
}

function closeRoleModal() {
  document.getElementById('roleLoginModal').style.display = 'none';
  document.getElementById('rolePwdInput').value = "";
}

function logoutRole() {
  currentRole = null;
  sessionStorage.removeItem('currentRole');
  alert("🔒 已登出報表權限。");
  updateLogoutButton();
  switchTab('checkout');
}

function updateLogoutButton() {
  const btn = document.getElementById('btnLogoutRole');
  if (currentRole) {
    btn.style.display = 'block';
    btn.innerText = `🔒 登出 (${currentRole === 'admin' ? '管理員' : currentRole})`;
  } else {
    btn.style.display = 'none';
  }
}

document.getElementById('sysPwdInput').addEventListener('keyup', function(e) { if (e.key === 'Enter') verifySystemPassword(); });
document.getElementById('rolePwdInput').addEventListener('keyup', function(e) { if (e.key === 'Enter') verifyRolePassword(); });

function initCheckoutTime() {
  const now = new Date();
  const pad = num => String(num).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const localISO = `${year}-${month}-${day}T${hours}:${minutes}`;
  document.getElementById('checkoutDateTime').value = localISO;
}

// 💡 更新：只攔截「分潤與薪水報表」，開放「店務與對帳報表」給所有人
function switchTab(tabName) {
  if (tabName === 'commission' && !currentRole) {
    document.getElementById('roleLoginModal').style.display = 'flex';
    document.getElementById('roleLoginModal').dataset.targetTab = tabName;
    return;
  }

  document.querySelectorAll('.nav-tabs button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  document.getElementById('content-' + tabName).classList.add('active');
  
  if (tabName === 'report') loadReport('today'); 
  if (tabName === 'commission') loadCommissions();
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
    btn.onclick = () => addToCart(category, subName, price);
    grid.appendChild(btn);
  }
}

function addToCart(category, itemName, itemPrice) {
  const tbody = document.getElementById("cartBody");
  const tr = document.createElement("tr");
  const currentCashier = document.getElementById("cashier").value;
  
  const techOptions = technicians.map(t => {
    const isSelected = (t === currentCashier) ? "selected" : "";
    return `<option value="${t}" ${isSelected}>${t}</option>`;
  }).join('');

  const inputHTML = (itemPrice === "*") 
    ? `<input type="number" class="item-price" placeholder="輸入金額" oninput="calculateTotal()">` 
    : `<input type="number" class="item-price" value="${itemPrice}" oninput="calculateTotal()" readonly style="background:#eee;">`;
  
  let qtyOptions = "";
  for (let i = 1; i <= 8; i++) {
    qtyOptions += `<option value="${i}">${i}</option>`;
  }
  
  const qtyHTML = `<select class="item-qty" onchange="calculateTotal()" style="width: 100%; text-align: center; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background-color: #FCFAFA; font-size: 1em; cursor: pointer;">
                     ${qtyOptions}
                   </select>`;
  
  tr.innerHTML = `<td style="text-align:left; font-weight:bold;">
                    <input type="hidden" class="item-category" value="${category}">
                    <input type="hidden" class="item-name" value="${itemName}">
                    <div style="font-size:0.75em; color:#888; font-weight:normal; margin-bottom:3px;">${category}</div>
                    ${itemName}
                  </td>
                  <td><select class="item-tech">${techOptions}</select></td>
                  <td>${inputHTML}</td>
                  <td>${qtyHTML}</td>
                  <td><button class="btn-remove" onclick="removeCartItem(this)">刪除</button></td>`;
  tbody.appendChild(tr); 
  
  tr.querySelector(".item-tech").value = currentCashier;
  calculateTotal();
}

function removeCartItem(btn) { btn.closest("tr").remove(); calculateTotal(); }

let paymentRowCount = 0;
const maxPaymentRows = 3; 

function addPaymentRow() {
  if (paymentRowCount >= maxPaymentRows) return;
  paymentRowCount++;
  
  const container = document.getElementById("paymentMethodsContainer");
  const row = document.createElement("div");
  row.className = "payment-row";
  row.style.cssText = "display: flex; gap: 10px; margin-bottom: 10px; align-items: center;";
  row.id = `paymentRow_${paymentRowCount}`;
  
  const deleteBtnHTML = paymentRowCount > 1 
    ? `<button type="button" onclick="removePaymentRow('${row.id}')" style="background: var(--danger-color); color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight:bold;">刪除</button>` 
    : `<div style="width: 62px;"></div>`; 
  
  row.innerHTML = `
    <select class="pay-method-sel" style="flex: 2; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background-color: white;">
      <option value="現金">現金</option>
      <option value="匯款">匯款</option>
      <option value="刷卡">刷卡</option>
      <option value="扣堂">扣堂</option>
      <option value="儲值金">儲值金</option>
    </select>
    <input type="number" class="pay-amount-input" placeholder="金額" style="flex: 3; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color);" oninput="checkPaymentTotal()">
    ${deleteBtnHTML}
  `;
  container.appendChild(row);
  
  if (paymentRowCount >= maxPaymentRows) { document.getElementById("btnAddPayment").style.display = "none"; }
  checkPaymentTotal();
}

function removePaymentRow(rowId) {
  document.getElementById(rowId).remove(); paymentRowCount--;
  document.getElementById("btnAddPayment").style.display = "block"; checkPaymentTotal();
}

function checkPaymentTotal() {
  const cartTotal = parseInt(document.getElementById("totalAmount").innerText) || 0;
  let paymentSum = 0;
  document.querySelectorAll(".pay-amount-input").forEach(input => { paymentSum += (parseInt(input.value) || 0); });
  
  const feedback = document.getElementById("paymentFeedback");
  if (paymentSum === cartTotal) {
    feedback.innerHTML = `<span style="color: var(--success-color);">✅ 分配完美！目前分配: $${paymentSum} / 總計: $${cartTotal}</span>`;
  } else {
    feedback.innerHTML = `<span style="color: var(--danger-color);">❌ 金額不符！目前分配: $${paymentSum} / 總計: $${cartTotal}</span>`;
  }
}

function calculateTotal() {
  let total = 0;
  document.querySelectorAll("#cartBody tr").forEach(row => {
    const sName = row.querySelector(".item-name").value;
    let price = parseInt(row.querySelector(".item-price").value) || 0;
    let qty = parseInt(row.querySelector(".item-qty").value) || 1;
    let subtotal = price * qty;
    if (sName.includes("抵扣")) { total -= Math.abs(subtotal); } else { total += subtotal; }
  });
  document.getElementById("totalAmount").innerText = total; 
  if (paymentRowCount === 1) { document.querySelector(".pay-amount-input").value = total; }
  checkPaymentTotal(); 
  return total;
}

function getFinalPaymentString() {
  let paymentParts = [];
  document.querySelectorAll(".payment-row").forEach(row => {
     const method = row.querySelector(".pay-method-sel").value;
     const amount = parseInt(row.querySelector(".pay-amount-input").value) || 0;
     if (amount !== 0) { paymentParts.push(`${method}:${amount}`); }
  });
  return paymentParts.join(", ");
}

let allReportData = []; 
let currentFilter = 'today';
let currentTechFilter = null; 
let loadedMonthStr = ""; 

function getWeekBoundaries(baseDate) {
  const dateObj = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const day = dateObj.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1; 
  const startOfWeek = new Date(dateObj);
  startOfWeek.setDate(dateObj.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0); 
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999); 
  return { startOfWeek, endOfWeek };
}

// 💡 更新：移除卡片點擊的權限攔截，讓大家都能自由篩選報表
function toggleTechFilter(techName) {
  if (techName === "全店金流") return; 
  if (currentTechFilter === techName) currentTechFilter = null; 
  else currentTechFilter = techName; 
  processReportData(currentFilter);
}

function loadReport(filterType) {
  currentFilter = filterType;
  currentTechFilter = null; 
  document.querySelectorAll('.report-controls button').forEach(b => b.classList.remove('active'));
  
  const now = new Date();
  let reqMonths = [String(now.getMonth() + 1).padStart(2, '0')]; 

  if (filterType !== 'custom' && filterType !== 'customMonth') {
    document.getElementById('filter-' + filterType).classList.add('active');
    document.getElementById('customDateFilter').value = ""; 
    document.getElementById('customMonthFilter').value = "";
    if (filterType === 'week') {
       const bounds = getWeekBoundaries(now);
       const startM = String(bounds.startOfWeek.getMonth() + 1).padStart(2, '0');
       const endM = String(bounds.endOfWeek.getMonth() + 1).padStart(2, '0');
       if (startM !== endM) { reqMonths = [startM, endM]; }
    }
  } else if (filterType === 'custom') {
    const customDate = document.getElementById("customDateFilter").value;
    document.getElementById('customMonthFilter').value = "";
    if (!customDate) return; 
    reqMonths = [customDate.split('-')[1]]; 
  } else if (filterType === 'customMonth') {
    const customMonth = document.getElementById("customMonthFilter").value; 
    document.getElementById('customDateFilter').value = "";
    if (!customMonth) return; 
    reqMonths = [customMonth.split('-')[1]]; 
  }
  
  const reqMonthStr = reqMonths.join(','); 
  const summaryDiv = document.getElementById("reportSummary");
  const detailedBody = document.getElementById("detailedReportBody");
  const loadingDiv = document.getElementById("loadingReport");

  if (allReportData.length === 0 || loadedMonthStr !== reqMonthStr) {
    summaryDiv.innerHTML = ""; detailedBody.innerHTML = "";
    loadingDiv.style.display = "block";
    fetch(GAS_URL + "?month=" + reqMonthStr)
      .then(res => res.json())
      .then(res => {
        if(res.status === "success") { 
          allReportData = res.data; 
          loadedMonthStr = reqMonthStr;
          processReportData(filterType); 
        }
        loadingDiv.style.display = "none";
      }).catch(err => { loadingDiv.style.display = "none"; });
  } else { 
    processReportData(filterType); 
  }
}

// 💡 更新：移除第二頁報表的全部權限遮蔽，全面開放檢視與操作
function processReportData(filterType) {
  const now = new Date();
  const pad = num => String(num).padStart(2, '0');
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const thisMonthStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}`;
  const bounds = getWeekBoundaries(now);

  let customDateStr = ""; let customMonthStr = "";
  if (filterType === 'custom') { customDateStr = document.getElementById("customDateFilter").value; if (!customDateStr) return; }
  if (filterType === 'customMonth') { customMonthStr = document.getElementById("customMonthFilter").value; if (!customMonthStr) return; }

  let techRevenue = {}; technicians.forEach(t => techRevenue[t] = 0);
  let cashFlow = { "現金": 0, "刷卡": 0, "匯款": 0, "扣堂": 0, "儲值金": 0 };
  let filteredTotal = 0; 
  let detailedHTML = "";

  const paymentIcons = { "現金": "💵", "刷卡": "💳", "匯款": "🏦", "扣堂": "🎫", "儲值金": "💎" };

  allReportData.forEach(row => {
    const rawTimeStr = String(row["結帳時間"]);
    let rowDateObj = new Date(rawTimeStr.replace(/-/g, '/'));
    if (isNaN(rowDateObj.getTime())) return; 

    const rowDateStr = `${rowDateObj.getFullYear()}-${pad(rowDateObj.getMonth()+1)}-${pad(rowDateObj.getDate())}`;
    const isVoid = (row["收據明細狀態"] === "作廢");

    let isMatch = false;
    if (filterType === 'today') { isMatch = (rowDateStr === todayStr); } 
    else if (filterType === 'custom') { isMatch = (rowDateStr === customDateStr); } 
    else if (filterType === 'month') { isMatch = rowDateStr.startsWith(thisMonthStr); } 
    else if (filterType === 'customMonth') { isMatch = rowDateStr.startsWith(customMonthStr); }
    else if (filterType === 'week') {
      const rowMidnight = new Date(rowDateObj.getFullYear(), rowDateObj.getMonth(), rowDateObj.getDate()).getTime();
      isMatch = (rowMidnight >= bounds.startOfWeek.getTime() && rowMidnight <= bounds.endOfWeek.getTime());
    }

    if (isMatch) {
      const rowAmount = isVoid ? 0 : (parseInt(row["總金額"]) || 0);
      filteredTotal += rowAmount;

      if (!isVoid) {
        let methodStr = row["收款方式"] || "現金";
        if (methodStr.includes(":")) {
          methodStr.split(",").forEach(part => {
            let [m, amtStr] = part.split(":");
            let amt = parseInt(amtStr) || 0; m = m.trim();
            if (cashFlow[m] !== undefined) cashFlow[m] += amt;
          });
        } else {
          let method = methodStr.trim();
          if (cashFlow[method] !== undefined) { cashFlow[method] += rowAmount; } else { cashFlow["現金"] += rowAmount; }
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
        let price = parseInt(i.price) || 0;
        let subtotal = Math.abs(price * qty);
        let category = i.category || getCategoryByItemName(i.item_name);
        let priceDisplay = (i.item_name.includes("抵扣")) ? `-$${subtotal}` : `$${subtotal}`;
        return `${category}＿${i.item_name} * ${qty} - (${priceDisplay}) (${i.technician})`;
      }).join('<br>');

      const displayTime = `${rowDateStr} <br> ${pad(rowDateObj.getHours())}:${pad(rowDateObj.getMinutes())}`;
      const phoneDisplay = row["手機號碼"] ? `<br><span style="font-size:0.85em; color:#666;">📞 ${row["手機號碼"]}</span>` : "";

      let paymentBadge = "";
      if (!isVoid) {
        const pMethodStr = row["收款方式"] || "現金";
        if (pMethodStr.includes(":")) {
           let badgeHtml = "";
           pMethodStr.split(",").forEach(part => {
             let mName = part.split(":")[0].trim();
             let mIcon = paymentIcons[mName] || "💳";
             badgeHtml += `<span style="font-size:0.8em; background:#E8E0D5; color:#5C4A3D; padding:2px 6px; border-radius:4px; display:inline-block; margin-top:3px; margin-right:3px;">${mIcon} ${part.trim()}</span>`;
           });
           paymentBadge = `<br>` + badgeHtml;
        } else {
           const pMethod = pMethodStr.trim();
           const pIcon = paymentIcons[pMethod] || "💳"; 
           paymentBadge = `<br><span style="font-size:0.8em; background:#E8E0D5; color:#5C4A3D; padding:2px 6px; border-radius:4px; display:inline-block; margin-top:3px;">${pIcon} ${pMethod}</span>`;
        }
      }

      const displayAmount = isVoid 
        ? `<span style="text-decoration:line-through; color:#aaa; font-size:0.9em;">$${rowTotalAmount}</span><br><strong style="color:#d9534f;">$0 [已作廢]</strong>`
        : `<strong>$${rowTotalAmount}</strong>`;
      const rowStyle = isVoid ? `background-color: #fdf5f5; color: #a0a0a0;` : ``;

      detailedHTML += `
        <tr style="${rowStyle}">
          <td style="font-size:0.85em;">${displayTime}</td>
          <td>${row["會員名稱"]} ${phoneDisplay} ${paymentBadge}</td>
          <td style="font-size:0.9em; line-height:1.5; text-align:left;">${itemsStr}</td>
          <td style="color:var(--text-dark); font-size:1.1em;">${displayAmount}</td>
        </tr>
      `;
    }
  });

  const cashFlowBox = document.getElementById("cashFlowBox");
  const cashFlowGrid = document.getElementById("cashFlowGrid");
  const archiveSection = document.getElementById("archiveSection");
  const adminTools = document.getElementById("adminTools");

  // 💡 完全開放第二頁報表的功能與面板
  cashFlowBox.style.display = "block";
  archiveSection.style.display = (filterType === 'today' || filterType === 'custom') ? "block" : "none";
  adminTools.style.display = "block";
  
  let boxTitle = "💵 該區間現金流結算";
  cashFlowBox.querySelector("h4").innerText = `${boxTitle} (依收款方式統整拆解)`;
  cashFlowGrid.innerHTML = `
    <div class="cashflow-item">💵 現金<br><span style="color:var(--primary-hover);">NT$ ${cashFlow["現金"].toLocaleString()}</span></div>
    <div class="cashflow-item">💳 刷卡<br><span style="color:var(--primary-hover);">NT$ ${cashFlow["刷卡"].toLocaleString()}</span></div>
    <div class="cashflow-item">🏦 匯款<br><span style="color:var(--primary-hover);">NT$ ${cashFlow["匯款"].toLocaleString()}</span></div>
    <div class="cashflow-item">🎫 扣堂<br><span style="color:var(--primary-hover);">NT$ ${cashFlow["扣堂"].toLocaleString()}</span></div>
    <div class="cashflow-item">💎 儲值金<br><span style="color:var(--primary-hover);">NT$ ${cashFlow["儲值金"].toLocaleString()}</span></div>
  `;

  let displayTitle = currentTechFilter ? `該區間結帳總額 (目前篩選: ${currentTechFilter})` : `該區間結帳總額 (已扣除作廢)`;
  if (filterType === 'week') {
    const startStr = `${bounds.startOfWeek.getFullYear()}-${pad(bounds.startOfWeek.getMonth()+1)}-${pad(bounds.startOfWeek.getDate())}`;
    const endStr = `${bounds.endOfWeek.getFullYear()}-${pad(bounds.endOfWeek.getMonth()+1)}-${pad(bounds.endOfWeek.getDate())}`;
    displayTitle = currentTechFilter ? `本週業績 (${startStr} ~ ${endStr}) - ${currentTechFilter}` : `本週業績 (${startStr} ~ ${endStr})`;
  } else if (filterType === 'customMonth') {
    displayTitle = `指定月份業績 (${document.getElementById("customMonthFilter").value})`;
  }
  
  document.getElementById("dashboardTotalTitle").innerText = displayTitle;
  document.getElementById("dashboardTodayTotal").innerText = `NT$ ${filteredTotal.toLocaleString()}`;

  const detailedBody = document.getElementById("detailedReportBody");
  detailedBody.innerHTML = detailedHTML !== "" ? detailedHTML : `<tr><td colspan="4" style="text-align:center; color:#999; padding:20px;">該區間/該老師尚無結帳明細</td></tr>`;

  const summaryDiv = document.getElementById("reportSummary");
  summaryDiv.innerHTML = ""; 

  const storeCard = document.createElement("div");
  storeCard.className = "report-card" + (currentTechFilter === "店面收支" ? " active-tech" : "");
  storeCard.onclick = () => toggleTechFilter("店面收支");
  storeCard.innerHTML = `<span>🏦 店面收支 (定金/儲值/產品)</span> <span class="amount">NT$ ${techRevenue["店面收支"].toLocaleString()}</span>`;
  summaryDiv.appendChild(storeCard);
  
  let teachersTotalRevenue = 0;
  technicians.forEach(t => {
    if(t !== "店面收支") {
      teachersTotalRevenue += techRevenue[t];
      const card = document.createElement("div"); 
      card.className = "report-card" + (currentTechFilter === t ? " active-tech" : "");
      card.onclick = () => toggleTechFilter(t); 
      card.innerHTML = `<span>👩‍💼 操作老師：${t}</span> <span class="amount">NT$ ${techRevenue[t].toLocaleString()}</span>`;
      summaryDiv.appendChild(card);
    }
  });
  
  const totalPerformanceCard = document.createElement("div");
  totalPerformanceCard.className = "report-card";
  totalPerformanceCard.style.backgroundColor = "#FDF5E6"; 
  totalPerformanceCard.style.borderColor = "#F5DEB3";
  totalPerformanceCard.style.cursor = "default"; 
  totalPerformanceCard.innerHTML = `<span style="color: #D2691E; font-weight: 900;">🏆 總業績額 (不含店面收支)</span> <span class="amount" style="color: #D2691E; font-size: 1.1em; font-weight: 900;">NT$ ${teachersTotalRevenue.toLocaleString()}</span>`;
  summaryDiv.appendChild(totalPerformanceCard);
}

async function executeArchive() {
  let targetDate = "";
  if (currentFilter === 'today') {
    const now = new Date(); const pad = num => String(num).padStart(2, '0');
    targetDate = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  } else if (currentFilter === 'custom') {
    targetDate = document.getElementById("customDateFilter").value;
  }
  
  if (!targetDate) return alert("請先選擇要歸檔的特定日期（或切換至今日業績）！");
  if (!confirm(`確定要將 [${targetDate}] 的所有有效業績歸檔並「拆解至分潤資料表」嗎？\n(系統將會同時進行畫面長截圖作為備份)`)) return;
  
  const archiveBtn = document.querySelector(".btn-archive");
  archiveBtn.disabled = true; 
  archiveBtn.innerText = "正在截取報表畫面並執行歸檔中，請稍候...";
  
  let base64Img = "";
  try {
    const reportNode = document.getElementById("content-report");
    const canvas = await html2canvas(reportNode, { scale: 1, backgroundColor: "#F7F3EE", useCORS: true });
    base64Img = canvas.toDataURL("image/jpeg", 0.7);
  } catch(e) {
    console.error("截圖失敗", e);
    alert("前端截圖產生失敗，這可能導致本次歸檔沒有圖片備份。錯誤碼：" + e.toString());
  }

  fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ 
      action: "archive", 
      target_date: targetDate,
      report_image_base64: base64Img 
    })
  })
  .then(res => res.json())
  .then(result => {
    alert(result.message);
    archiveBtn.disabled = false; archiveBtn.innerText = "📁 確認無誤，執行分潤拆解歸檔";
  })
  .catch(err => {
    alert("歸檔發生錯誤，請檢查網路連線。");
    archiveBtn.disabled = false; archiveBtn.innerText = "📁 確認無誤，執行分潤拆解歸檔";
  });
}

window.toggleDailyTable = function(id) {
  // 第三頁依然保有權限遮蔽
  if (currentRole !== 'admin' && !id.includes(currentRole)) return; 
  const el = document.getElementById(id);
  const arrow = document.getElementById('arrow-' + id);
  if (el.style.display === 'none') {
    el.style.display = 'block';
    if (arrow) arrow.innerText = "▲";
  } else {
    el.style.display = 'none';
    if (arrow) arrow.innerText = "▼";
  }
};

let allCommissionData = [];

function loadCommissions() {
  const monthVal = document.getElementById('commissionMonthSelector').value; 
  if (!monthVal) return;

  const loadingDiv = document.getElementById("loadingCommission");
  const summaryDiv = document.getElementById("commissionSummary");

  if (allCommissionData.length === 0) {
    summaryDiv.innerHTML = "";
    loadingDiv.style.display = "block";
    fetch(GAS_URL + "?action=get_commissions")
      .then(res => res.json())
      .then(res => {
        if(res.status === "success") { 
          allCommissionData = res.data; 
          renderCommissions(monthVal);
        }
        loadingDiv.style.display = "none";
      }).catch(err => { loadingDiv.style.display = "none"; });
  } else {
    renderCommissions(monthVal);
  }
}

function renderCommissions(monthVal) {
  const summaryDiv = document.getElementById("commissionSummary");
  const [yyyy, mm] = monthVal.split('-');
  const targetPrefix = `${yyyy}-${mm}`; 

  const daysInMonth = new Date(parseInt(yyyy), parseInt(mm), 0).getDate();

  let techStats = {};
  technicians.forEach(t => {
     if(t !== "店面收支") {
       techStats[t] = { rev: 0, comm: 0, daily: {} };
       for(let d = 1; d <= daysInMonth; d++) {
         const dayStr = String(d).padStart(2, '0');
         techStats[t].daily[`${yyyy}-${mm}-${dayStr}`] = { rev: 0, comm: 0 };
       }
     }
  });

  allCommissionData.forEach(row => {
     const rawDateStr = row['消費日期']; 
     if (rawDateStr && rawDateStr.startsWith(targetPrefix)) {
        const dateOnly = rawDateStr.split(' ')[0]; 
        const t = row['操作老師'];
        if (techStats[t]) {
           const rev = parseFloat(row['消費金額']) || 0;
           const comm = parseFloat(row['分潤金額']) || 0;
           
           techStats[t].rev += rev;
           techStats[t].comm += comm;
           
           if(techStats[t].daily[dateOnly]) {
              techStats[t].daily[dateOnly].rev += rev;
              techStats[t].daily[dateOnly].comm += comm;
           }
        }
     }
  });

  let html = `<h3 style="border-bottom: 2px solid var(--border-color); padding-bottom: 10px;">${yyyy} 年 ${mm} 月 分潤結算與每日明細</h3>`;
  let hasData = false;

  for (const t in techStats) {
     if (techStats[t].rev !== 0 || techStats[t].comm !== 0) {
        hasData = true;

        if (currentRole !== 'admin' && currentRole !== t) {
            html += `
              <div class="report-card" style="margin-bottom: 15px; cursor: not-allowed; background:#f5f5f5;">
                <div style="flex:1;">
                   <div style="font-size: 1.2em; font-weight:bold; color:#aaa; margin-bottom: 8px;">👩‍💼 ${t}</div>
                   <div style="font-size: 0.9em; color:#aaa;">總操作業績：***</div>
                </div>
                <div style="flex:1; text-align:right;">
                   <div style="font-size: 0.9em; color:#aaa;">結算應發分潤</div>
                   <div style="font-size: 1.5em; font-weight:bold; color:#aaa;">*** (無權限)</div>
                </div>
              </div>
            `;
            continue;
        }

        let dailyTableHTML = `
          <div id="daily-${t}" style="display: none; margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 10px;">
            <table class="detailed-table" style="width: 100%; font-size: 0.9em;">
              <thead>
                <tr>
                  <th style="width: 30%; background-color: #E2D6C8;">日期</th>
                  <th style="width: 35%; background-color: #E2D6C8;">單日業績</th>
                  <th style="width: 35%; background-color: #E2D6C8;">單日分潤</th>
                </tr>
              </thead>
              <tbody>
        `;

        for (let d = 1; d <= daysInMonth; d++) {
           const dayStr = String(d).padStart(2, '0');
           const fullDate = `${yyyy}-${mm}-${dayStr}`;
           const dailyData = techStats[t].daily[fullDate];

           const revDisplay = dailyData.rev === 0 ? `<span style="color:#bbb;">$0</span>` : `<strong>$${dailyData.rev.toLocaleString()}</strong>`;
           const commDisplay = dailyData.comm === 0 ? `<span style="color:#bbb;">$0</span>` : `<strong style="color:var(--success-color);">$${Math.round(dailyData.comm).toLocaleString()}</strong>`;
           const rowStyle = dailyData.rev === 0 ? `background-color: #fafafa;` : ``;

           dailyTableHTML += `
              <tr style="${rowStyle}">
                <td>${mm}/${dayStr}</td>
                <td>${revDisplay}</td>
                <td>${commDisplay}</td>
              </tr>
           `;
        }

        dailyTableHTML += `</tbody></table></div>`;

        html += `
          <div class="report-card" style="margin-bottom: 15px; cursor: pointer; flex-direction: column; align-items: stretch;" onclick="toggleDailyTable('daily-${t}')">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="flex:1;">
                 <div style="font-size: 1.2em; font-weight:bold; color:var(--text-dark); margin-bottom: 8px;">👩‍💼 ${t} <span id="arrow-daily-${t}" style="font-size: 0.7em; color: #999; margin-left: 5px;">▼</span></div>
                 <div style="font-size: 0.9em; color:#666;">總操作業績：$${techStats[t].rev.toLocaleString()}</div>
              </div>
              <div style="flex:1; text-align:right;">
                 <div style="font-size: 0.9em; color:#666;">結算應發分潤</div>
                 <div style="font-size: 1.5em; font-weight:bold; color:var(--success-color);">NT$ ${Math.round(techStats[t].comm).toLocaleString()}</div>
              </div>
            </div>
            ${dailyTableHTML}
          </div>
        `;
     }
  }

  if (!hasData) {
     html += `<div style="text-align:center; padding: 20px; color:#999;">本月份尚無已歸檔的分潤資料</div>`;
  }

  summaryDiv.innerHTML = html;
}

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
        container.innerHTML = ""; let hasData = false;
        res.data.forEach(row => {
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
            div.innerHTML = `<div><strong>顧客：${row["會員名稱"]}</strong> (單號：${row["交易單號"]})<br><span style="font-size:0.9em; color:#666; display:block; margin-top:5px;">時間：${row["結帳時間"]} | 應收：$${row["總金額"]}</span></div><div><button class="btn-void" onclick="executeVoid('${row["交易單號"]}', '${row["結帳時間"]}')">執行作廢</button></div>`;
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
  fetch(GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ action: "void", order_id: orderId, checkout_time: checkoutTime }) })
  .then(res => res.json())
  .then(result => { alert("作廢成功！系統將自動刷新帳務..."); allReportData = []; loadedMonthStr = ""; fetchVoidList(); loadReport(currentFilter); })
  .catch(err => alert("處理失敗請確認網路後重試"));
}

const canvas = document.getElementById("sigCanvas"); 
const ctx = canvas.getContext("2d"); 
let isDrawing = false;

function getCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  let clientX = e.clientX;
  let clientY = e.clientY;
  
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }
  
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

function startDrawing(e) { 
  isDrawing = true; 
  ctx.beginPath();
  draw(e); 
}

function stopDrawing() { 
  isDrawing = false; 
  ctx.beginPath(); 
}

function draw(e) { 
  if (!isDrawing) return; 
  e.preventDefault(); 
  
  const coords = getCoordinates(e);
  
  ctx.lineWidth = 3; 
  ctx.lineCap = "round"; 
  ctx.strokeStyle = "#000"; 
  
  ctx.lineTo(coords.x, coords.y); 
  ctx.stroke(); 
  
  ctx.beginPath(); 
  ctx.moveTo(coords.x, coords.y); 
}

canvas.addEventListener("mousedown", startDrawing); 
canvas.addEventListener("mouseup", stopDrawing); 
canvas.addEventListener("mousemove", draw); 
canvas.addEventListener("touchstart", startDrawing, {passive: false}); 
canvas.addEventListener("touchend", stopDrawing); 
canvas.addEventListener("touchmove", draw, {passive: false});

function clearCanvas() { 
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
}

function preparePrintReceipt() {
  const selectedTime = document.getElementById("checkoutDateTime").value;
  currentTimeString = selectedTime.replace('T', ' '); 
  
  const nowForId = new Date();
  const p = num => String(num).padStart(2, '0');
  const timeStr = `${nowForId.getFullYear()}${p(nowForId.getMonth()+1)}${p(nowForId.getDate())}${p(nowForId.getHours())}${p(nowForId.getMinutes())}${p(nowForId.getSeconds())}`;
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  currentOrderId = `F${timeStr}${rand}`;
  
  const memberName = document.getElementById("memberName").value.trim();
  document.getElementById("rcptOrderId").innerText = currentOrderId;
  document.getElementById("rcptTime").innerText = currentTimeString;
  document.getElementById("rcptPayMethod").innerText = getFinalPaymentString(); 
  document.getElementById("rcptCashier").innerText = document.getElementById("cashier").value;
  const itemsBody = document.getElementById("rcptItemsBody"); itemsBody.innerHTML = "";
  
  document.querySelectorAll("#cartBody tr").forEach(row => {
    const sCategory = row.querySelector(".item-category").value;
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
  const memberName = document.getElementById("memberName").value.trim(); if (!memberName) return alert("請輸入會員名稱！");
  const phone = document.getElementById("memberPhone").value.trim(); if (!phone) return alert("請輸入手機號碼！");
  if (document.querySelectorAll("#cartBody tr").length === 0) return alert("請至少新增一項明細！");
  let priceMissing = false; document.querySelectorAll(".item-price").forEach(input => { if(input.value === "") priceMissing = true; });
  if(priceMissing) return alert("有服務項目的金額尚未填寫，請確認後再結帳！");
  
  if (!document.getElementById("checkoutDateTime").value) return alert("請確認結帳日期與時間不可為空！");
  
  const cartTotal = parseInt(document.getElementById("totalAmount").innerText) || 0; let paymentSum = 0; let hasEmptyPayment = false;
  document.querySelectorAll(".pay-amount-input").forEach(input => { const amt = parseInt(input.value); if (isNaN(amt)) { hasEmptyPayment = true; } else { paymentSum += amt; } });
  if (hasEmptyPayment) return alert("請確認所有的「收款方式」都已經輸入分配的金額！");
  if (paymentSum !== cartTotal) return alert(`【金額錯誤 ❌】\n收款分配總額 ($${paymentSum}) 與 顧客消費總計 ($${cartTotal}) 不符！\n請重新核對金額後再進行結帳簽名。`);
  const btn = document.getElementById("btnGenerate"); btn.disabled = true; btn.innerText = "處理收據排版中...";
  try { preparePrintReceipt(); const receiptTemplate = document.getElementById("printReceiptTemplate"); const draftCanvas = await html2canvas(receiptTemplate, { scale: 2, backgroundColor: "#ffffff" }); draftBase64Data = draftCanvas.toDataURL("image/jpeg", 0.8); document.getElementById("signatureModal").style.display = "flex"; btn.innerText = "等待顧客簽名..."; } catch (err) { alert("排版截圖發生錯誤，請重試！"); resetBtn(); }
}

async function confirmSignature() {
  const blank = document.createElement('canvas'); blank.width = canvas.width; blank.height = canvas.height;
  if (canvas.toDataURL() === blank.toDataURL()) return alert("請顧客完成簽名！");
  document.getElementById("signatureModal").style.display = "none"; document.getElementById("btnGenerate").innerText = "最終排版產生中...";
  const sigImg = document.getElementById("rcptSignatureImg"); const sigArea = document.getElementById("rcptSignatureArea");
  await new Promise((resolve) => { sigImg.onload = () => { sigArea.style.display = "block"; setTimeout(resolve, 100); }; sigImg.src = canvas.toDataURL("image/png"); });
  const receiptTemplate = document.getElementById("printReceiptTemplate"); const finalCanvas = await html2canvas(receiptTemplate, { scale: 2, backgroundColor: "#ffffff" }); signedBase64Data = finalCanvas.toDataURL("image/jpeg", 0.8); submitToGAS();
}

function submitToGAS() {
  document.getElementById("btnGenerate").innerText = "資料上傳雲端中，請稍候..."; const cartItems = [];
  document.querySelectorAll("#cartBody tr").forEach(row => { 
    const sCategory = row.querySelector(".item-category").value;
    const sName = row.querySelector(".item-name").value; 
    let sPrice = parseInt(row.querySelector(".item-price").value) || 0; 
    let sQty = parseInt(row.querySelector(".item-qty").value) || 1; 
    if (sName.includes("抵扣")) sPrice = -Math.abs(sPrice); 
    cartItems.push({ category: sCategory, item_name: sName, technician: row.querySelector(".item-tech").value, price: sPrice, qty: sQty }); 
  });
  
  const payload = { action: "checkout", checkout_time: currentTimeString, order_id: currentOrderId, member_name: document.getElementById("memberName").value.trim(), phone_number: document.getElementById("memberPhone").value.trim(), cashier: document.getElementById("cashier").value, payment_method: getFinalPaymentString(), payment_unit: document.getElementById("paymentUnit").value, total_amount: calculateTotal(), cart_items: cartItems, note: document.getElementById("orderNote").value, draft_base64: draftBase64Data, signed_base64: signedBase64Data };
  fetch(GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) }).then(response => response.json()).then(result => { if (result.status === "success") { alert("結帳成功！清晰版收據已存入雲端。"); location.reload(); } else { alert("儲存回報異常：" + result.message); resetBtn(); } }).catch(error => { alert("網路錯誤，請檢查網路後重試。"); resetBtn(); });
}
function resetBtn() { document.getElementById("btnGenerate").disabled = false; document.getElementById("btnGenerate").innerText = "產生確認單並簽名"; }
