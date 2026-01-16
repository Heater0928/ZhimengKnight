// script.js - 幹員資料陣列（之後會從這裡讀取生成卡片）

const operators = [
    {
        name: "小暖爐",
        portrait: "images/portraits/littleheater_portrait.png", //頭像圖檔
        level: 1,         // 等級
        rarity: 6,         // 星星數
        class: "pioneer",    // 對應職業圖標 key (caster.png)
        serial_number:1,     //幹員編號，幹員排列順序用
        portraitAlt: "小暖爐頭像"
    },
    {
        name: "錦",
        portrait: "images/portraits/jin_portrait.png",
        level: 1,
        rarity: 3,
        class: "guard",
        serial_number:2,
        portraitAlt: "錦頭像"
    },
    {
        name: "刻璃曦",
        portrait: "images/portraits/chrissy_portrait.png",
        level: 1,
        rarity: 3,
        class: "caster",
        serial_number:3,
        portraitAlt: "刻璃曦頭像"
    },
    {
        name: "繁恩",
        portrait: "images/portraits/vann_portrait.png",
        level: 1,
        rarity: 3,
        class: "sniper",
        serial_number:4,
        portraitAlt: "繁恩頭像"
    }
    // 之後加新幹員就繼續在這裡加物件
];