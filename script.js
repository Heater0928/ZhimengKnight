// script.js - 幹員資料陣列（之後會從這裡讀取生成卡片與詳細資訊）

const operators = [
    {
        name: "小暖爐",
        portrait: "images/portraits/littleheater_portrait.png", // 頭像圖檔（列表用）
        fullPortrait: "images/operator/littleheater.png",  // 全身立繪（詳細頁用）
        serial_number: 1,
    },
    {
        name: "花",
        portrait: "images/portraits/flower_portrait.png", // 頭像圖檔（列表用）
        fullPortrait: "images/operator/flower.png",  // 全身立繪（詳細頁用）
        serial_number: 2,
    },
    {
        name: "參兔丙酮",
        portrait: "images/portraits/TATP_portrait.png", // 頭像圖檔（列表用）
        fullPortrait: "images/operator/TATP.png",  // 全身立繪（詳細頁用）
        serial_number: 3,
    },
        {
        name: "哈爐",
        portrait: "images/portraits/haloo_portrait.png", // 頭像圖檔（列表用）
        fullPortrait: "images/operator/haloo.png",  // 全身立繪（詳細頁用）
        serial_number: 4,
    },
        {
        name: "歸燕",
        portrait: "images/portraits/redux_portrait.png", // 頭像圖檔（列表用）
        fullPortrait: "images/operator/redux.png",  // 全身立繪（詳細頁用）
        serial_number: 5,
    },
    {
        name: "剪",
        portrait: "images/portraits/cut_portrait.png", // 頭像圖檔（列表用）
        fullPortrait: "images/operator/cut.png",  // 全身立繪（詳細頁用）
        serial_number: 6,
    },
    // 之後加新幹員就繼續在這裡加物件
];
// ==================== 主頁背景系統 ====================
const availableBackgrounds = [
    { id: "default", name: "雨中街頭", filename: "background.png" },
    { id: "bg001", name: "臨時住所", filename: "backgrounds/bg001.png" },
    { id: "bg002", name: "舉殤酒館", filename: "backgrounds/bg002.png" },
    { id: "bg003", name: "羅德島甲板", filename: "backgrounds/bg003.png" },
];

function getCurrentBackground(userId) {
    if (!userId) return "default";
    const key = 'player_background_' + userId;
    return localStorage.getItem(key) || "default";
}

function setCurrentBackground(userId, bgId) {
    if (!userId) return;
    const key = 'player_background_' + userId;
    localStorage.setItem(key, bgId);
    applyBackground(bgId);
}

function applyBackground(bgId) {
    const bg = availableBackgrounds.find(b => b.id === bgId) || availableBackgrounds[0];
    const bgElement = document.getElementById('background');
    
    if (bgElement) {
        const fullPath = `images/${bg.filename}`;
        console.log(`[背景載入] 嘗試載入: ${fullPath}`);  // 方便除錯
        
        bgElement.src = fullPath;
        
        // 載入失敗時的後備機制
        bgElement.onerror = () => {
            console.error(`背景圖片載入失敗: ${fullPath}`);
            bgElement.src = 'images/background.png';  // 回退到預設
        };
    }
}
// ==================== 看板角色系統 ====================
function getPlayerOperatorCenter(userId) {
    const key = 'player_operator_center_' + userId;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : { 
        operatorId: null, 
        top: "50%", 
        left: "50%", 
        scale: 1.0 
    };
}

function setPlayerOperatorCenter(userId, data) {
    const key = 'player_operator_center_' + userId;
    localStorage.setItem(key, JSON.stringify(data));
    applyOperatorCenter(data);
}

function applyOperatorCenter(centerData) {
    const img = document.getElementById('operator-center');
    if (!img) return;

    if (!centerData.operatorId) {
        img.src = "images/operator/default.png";
        img.style.transform = 'translate(-50%, -50%) scale(1)';
        return;
    }

    const op = operators.find(o => o.serial_number === centerData.operatorId);
    if (op) {
        img.src = op.fullPortrait;
    }

    img.style.top = centerData.top || "50%";
    img.style.left = centerData.left || "50%";
    
    const scale = parseFloat(centerData.scale) || 1.0;
    
    // 重要修正：強制清除可能干擾的 CSS 限制，並直接套用 transform
    img.style.maxHeight = 'none';
    img.style.maxWidth = 'none';
    img.style.width = 'auto';
    img.style.height = 'auto';
    
    img.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    console.log(`[看板角色] 已套用位置與縮放: scale = ${scale}`);
}
// ==================== 看板角色位置調整（優化版） ====================
let currentEditingOpId = null;
let currentScale = 1.0;
let isDraggingMode = false;   // 新增：是否處於拖曳模式

function openOperatorPositionEditor(opId) {
    currentEditingOpId = opId;
    const modal = document.getElementById('operator-edit-modal');
    const editImg = document.getElementById('edit-operator');
    const editBg = document.getElementById('edit-background');

    const op = operators.find(o => o.serial_number === opId);
    if (op) editImg.src = op.fullPortrait;

    const currentUser = localStorage.getItem('current_user');
    const currentBgId = getCurrentBackground(currentUser);
    const bgInfo = availableBackgrounds.find(b => b.id === currentBgId) || availableBackgrounds[0];
    editBg.src = `images/${bgInfo.filename}`;

    modal.style.display = 'block';

    // 恢復之前儲存的位置與大小
    const savedData = getPlayerOperatorCenter(currentUser);
    if (savedData.operatorId === opId) {
        editImg.style.top = savedData.top || '50%';
        editImg.style.left = savedData.left || '50%';
        currentScale = parseFloat(savedData.scale) || 1.0;
    } else {
        editImg.style.top = '50%';
        editImg.style.left = '50%';
        currentScale = 1.0;
    }

    editImg.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
    document.getElementById('scale-slider').value = currentScale;
    document.getElementById('scale-value').textContent = currentScale.toFixed(1);

    makeClickableDraggable(editImg);
    bindPositionButtons();
}

// 新增：點擊切換拖曳模式 + 拉桿控制
function makeClickableDraggable(element) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    // 點擊切換拖曳模式
    element.onclick = function(e) {
        isDraggingMode = !isDraggingMode;
        element.style.cursor = isDraggingMode ? 'grabbing' : 'move';
        console.log(`拖曳模式: ${isDraggingMode ? '開啟' : '關閉'}`);
    };

    element.onmousedown = (e) => {
        if (!isDraggingMode) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = element.offsetLeft;
        startTop = element.offsetTop;
        element.style.transition = 'none';
    };

    document.onmousemove = (e) => {
        if (!isDragging || !isDraggingMode) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        element.style.left = (startLeft + dx) + 'px';
        element.style.top = (startTop + dy) + 'px';
    };

    document.onmouseup = () => {
        isDragging = false;
    };

    // 拉桿控制縮放
    const slider = document.getElementById('scale-slider');
    const scaleValue = document.getElementById('scale-value');

    slider.oninput = function() {
        currentScale = parseFloat(this.value);
        scaleValue.textContent = currentScale.toFixed(1);
        element.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
    };
}
// ==================== 確認與取消按鈕（重要修正版） ====================
function bindPositionButtons() {
    console.log('🔧 正在綁定確認/取消按鈕...');
    
    const confirmBtn = document.getElementById('confirm-position-btn');
    const cancelBtn = document.getElementById('cancel-position-btn');

    if (confirmBtn) {
        confirmBtn.onclick = function() {
            console.log('✅ 確認按鈕被點擊了！');
            const editImg = document.getElementById('edit-operator');
            const modal = document.getElementById('operator-edit-modal');
            const currentUser = localStorage.getItem('current_user');

            if (!currentEditingOpId) {
                alert('錯誤：沒有選擇角色');
                return;
            }

            // 重要修正：直接從 editImg 讀取當前 transform，避免 currentScale 不同步
            let finalScale = currentScale;
            if (editImg.style.transform) {
                const match = editImg.style.transform.match(/scale\(([^)]+)\)/);
                if (match) finalScale = parseFloat(match[1]);
            }

            const centerData = {
                operatorId: currentEditingOpId,
                top: editImg.style.top,
                left: editImg.style.left,
                scale: finalScale
            };

            console.log(`[儲存] 最終 scale = ${finalScale}`);

            setPlayerOperatorCenter(currentUser, centerData);
            alert('✅ 看板角色位置已儲存！');
            modal.style.display = 'none';
        };
    } else {
        console.error('❌ 找不到 confirm-position-btn');
    }

    if (cancelBtn) {
        cancelBtn.onclick = function() {
            console.log('❌ 取消按鈕被點擊了！');
            document.getElementById('operator-edit-modal').style.display = 'none';
        };
    }
}