// game.js - 遊戲主頁面

function goBackToMain() {
    window.location.href = 'index.html';
}

// 簡化版：先恢復正常點擊功能
window.addEventListener('load', () => {
    console.log('✅ 遊戲頁面已載入');

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.style.pointerEvents = 'auto';   // 強制恢復可點擊
        backBtn.style.cursor = 'pointer';
        
        // 直接綁定點擊事件（不使用 canvas 判斷，先確保能返回）
        backBtn.addEventListener('click', () => {
            console.log('✅ 返回主頁按鈕被點擊');
            goBackToMain();
        });
    }
});