// game.js - 遊戲主頁面 + 進階對話系統

let currentDialogue = null;
let currentLineIndex = 0;

// 返回主頁
function goBackToMain() {
    window.location.href = 'index.html';
}

// ==================== 對話資料 ====================
const dialogues = {
    start: {
        lines: [
            { text: "歡迎光臨地下傭兵聯盟會館...好吧，我承認我也不喜歡這個冗長的名稱", image: "images/npcs/Nikaido_Hiro_npcs.png" },
            { text: "容我重新介紹一次...", image: "images/npcs/Nikaido_Hiro_npcs.png" },
            { text: "歡迎光臨「公會」", image: "images/npcs/Nikaido_Hiro_npcs.png" }
        ],
        options: [
            { text: "這裡是什麼地方?", next: "whatPlace" },
            { text: "你是誰?", next: "whoAreYou" },
            { text: "沒事，叫爽的", next: "FAQ" },     // 修改成 exitToMain
            { text: "點錯了，打擾了", next: "sorry" }
        ]
    },

    whatPlace: {
        lines: [
            { text: "你連這裡是哪都不知道就闖進來?你拿我尋開心?", image: "images/npcs/Nikaido_Hiro_What_npcs.png" },
            { text: "唉...簡單來說，就是不管你遇到什麼麻煩，或者需要接受保護，又或者想解決誰...", image: "images/npcs/Nikaido_Hiro_Unhappy_npcs.png" },
            { text: "總之，只要錢到位，我就幫你聯絡合適的人幫你處理事情", image: "images/npcs/Nikaido_Hiro_Unhappy_npcs.png" }
        ],
        options: [
            { text: "明白了", action: "exit" }        // 修改：點擊後直接退出對話
        ]
    },

    whoAreYou: {
        lines: [
            { text: "唔嗯...你去買菜的時候難道也會問店員'你是誰'嗎?", image: "images/npcs/Nikaido_Hiro_Unhappy_npcs.png" },
            { text: "真是的，我是誰不重要，你只要知道我能幫你把人叫出來給你用就夠了", image: "images/npcs/Nikaido_Hiro_Smill_npcs.png" }
        ],
        options: [
            { text: "明白了", action: "exit" }
        ]
    },

    FAQ: {
        lines: [
            { text: "......", image: "images/npcs/Nikaido_Hiro_Angry_npcs.png" }
        ],
        options: [
            { text: "(快逃)", action: "exitToMain" }
        ]
    },

    sorry: {
        lines: [
            { text: "...啥?點錯了是什麼意思?", image: "images/npcs/Nikaido_Hiro_What_npcs.png" }
        ],
        options: [
            { text: "咳，沒事", action: "exit" }
        ]
    }
};

// ==================== 對話顯示功能 ====================
function startDialogue() {
    currentDialogue = dialogues["start"];
    currentLineIndex = 0;
    document.getElementById('dialogue-system').style.display = 'flex';
    showNextLine();
}

function showNextLine() {
    const textEl = document.getElementById('dialogue-text');
    const charImg = document.getElementById('dialogue-character');
    const optionsEl = document.getElementById('dialogue-options');

    if (currentLineIndex < currentDialogue.lines.length) {
        // 顯示當前句子
        const currentLine = currentDialogue.lines[currentLineIndex];
        textEl.textContent = currentLine.text;
        charImg.src = currentLine.image;

        // 隱藏選項（逐句模式時不顯示選項）
        optionsEl.style.display = 'none';

        currentLineIndex++;
    } else {
        // 句子結束，顯示選項
        textEl.textContent = currentDialogue.lines[currentDialogue.lines.length - 1].text;
        charImg.src = currentDialogue.lines[currentDialogue.lines.length - 1].image;
        optionsEl.style.display = 'block';
        showOptions();
    }
}

function showOptions() {
    const optionsEl = document.getElementById('dialogue-options');
    optionsEl.innerHTML = '';

    currentDialogue.options.forEach(option => {
        const btn = document.createElement('div');
        btn.className = 'dialogue-option';
        btn.textContent = option.text;
        
        btn.onclick = () => {
            if (option.action === "exit") {
                endDialogue();                    // 普通退出對話（回到遊戲畫面）
            } 
            else if (option.action === "exitToMain") {
                endDialogue();
                goBackToMain();                   // 直接回到主頁
            } 
            else if (option.next) {
                currentDialogue = dialogues[option.next];
                currentLineIndex = 0;
                showNextLine();
            }
        };
        
        optionsEl.appendChild(btn);
    });
}

function endDialogue() {
    document.getElementById('dialogue-system').style.display = 'none';
}

// 點擊畫面任意處推進文字（除了選項按鈕）
document.getElementById('dialogue-system').addEventListener('click', (e) => {
    // 如果點擊的是選項按鈕，就不要推進句子
    if (e.target.classList.contains('dialogue-option') || 
        e.target.closest('.dialogue-option')) {
        return;
    }

    // 如果目前正在顯示選項，就不要推進
    if (document.getElementById('dialogue-options').style.display === 'block') {
        return;
    }

    showNextLine();
});

// 點擊 NPC 開始對話
document.getElementById('back-btn').addEventListener('click', startDialogue);

// 初始化
window.addEventListener('load', () => {
    console.log('✅ 遊戲頁面已載入');
});