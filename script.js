// script.js - 幹員資料陣列（之後會從這裡讀取生成卡片與詳細資訊）

const operators = [
    {
        name: "小暖爐",
        portrait: "images/portraits/littleheater_portrait.png", // 頭像圖檔（列表用）
        fullPortrait: "images/operator/littleheater.png",       // 全身立繪（詳細頁用）
        level: 1,                                               // 當前等級
        maxLevel: 50,                                           // 當前階段上限（會隨精英化變）
        elite: 0,                                               // 當前精英化階段 (0,1,2)
        rarity: 5,
        class: "pioneer",
        subclass: "情報官",
        serial_number: 1,
        portraitAlt: "小暖爐頭像",
        // 基礎數值 + 成長率（用來計算當前數值）
        baseStats: {
            hp: 857,  //生命
            atk: 236,  //攻擊
            def: 94,  //防禦
            magicResist: 0,  //法抗
            redeployTime: 35,  //再部屬
            cost: 10,  //費用
            blockCount: 1,  //阻擋
            attackInterval: 1.0,  // 攻速(秒)
            position: "近戰位",  //站位
            trust: 0,  //信賴
            label: ["費用回復", "快速復活"]  //標籤
        },
        growthRates: {
            hp: [7.5, 5, 4.4],     // [精英0, 精英1, 精英2] 每級成長
            atk: [2.3, 1.6, 1.3],
            def: [1.3, 1, 0.5],
            magicResist: 0
        },
        // 技能（最多3個）
        skills: [
            {
                name: "觀火",
                icon: "images/skills/littelheater_skill(1).png",  // 你之後放的技能圖標
                descriptionTemplate: "部署後攻擊力+{atk_bonus}%，每次攻擊時可獲得1點部署費用",  //技能描述
                levels: [  //等級,數值變化,技能持續時間,初始能量,啟動所需能量,能量恢復方式"自動恢復/攻擊恢復/阻擋恢復",技能啟動方式"自動/手動"
                    { level: 1, atk_bonus: 35, duration: 13, spInitial: 0, spCost: 0, spType: "無", trigger: "自動" },
                    { level: 2, atk_bonus: 40, duration: 13, spInitial: 0, spCost: 0, spType: "無", trigger: "自動" },
                    { level: 3, atk_bonus: 45, duration: 13, spInitial: 0, spCost: 0, spType: "無", trigger: "自動" },
                    { level: 4, atk_bonus: 50, duration: 14, spInitial: 0, spCost: 0, spType: "無", trigger: "自動" },
                    { level: 5, atk_bonus: 55, duration: 15, spInitial: 0, spCost: 0, spType: "無", trigger: "自動" },
                    { level: 6, atk_bonus: 60, duration: 16, spInitial: 0, spCost: 0, spType: "無", trigger: "自動" },
                    { level: 7, atk_bonus: 70, duration: 17, spInitial: 0, spCost: 0, spType: "無", trigger: "自動" }
                ]
            },
            {
                name: "浮光",
                icon: "images/skills/littelheater_skill(2).png",
                descriptionTemplate: "攻擊力+{atk_bonus}%，攻擊速度+{aspd_bonus}，自身獲得迷彩，每次攻擊時獲得1點部署費用\n攻擊裝有{ammo}發彈藥，打完後結束（可隨時停止技能）",
                levels: [
                    { level: 1, atk_bonus: 10, aspd_bonus: 10, ammo: 13, duration: "無", spInitial: 10, spCost: 34, spType: "自動恢復", trigger: "手動" },
                    { level: 2, atk_bonus: 13, aspd_bonus: 14, ammo: 13, duration: "無", spInitial: 10, spCost: 33, spType: "自動恢復", trigger: "手動" },
                    { level: 3, atk_bonus: 16, aspd_bonus: 18, ammo: 13, duration: "無", spInitial: 10, spCost: 32, spType: "自動恢復", trigger: "手動" },
                    { level: 4, atk_bonus: 19, aspd_bonus: 22, ammo: 14, duration: "無", spInitial: 15, spCost: 31, spType: "自動恢復", trigger: "手動" },
                    { level: 5, atk_bonus: 22, aspd_bonus: 26, ammo: 14, duration: "無", spInitial: 15, spCost: 30, spType: "自動恢復", trigger: "手動" },
                    { level: 6, atk_bonus: 25, aspd_bonus: 30, ammo: 14, duration: "無", spInitial: 15, spCost: 29, spType: "自動恢復", trigger: "手動" },
                    { level: 7, atk_bonus: 28, aspd_bonus: 34, ammo: 15, duration: "無", spInitial: 20, spCost: 28, spType: "自動恢復", trigger: "手動" },
                ]
            },
            null  // 沒有3技能就放 null (如果沒有2技能也不需要放兩個)
        ],
        // 天賦
        talents: [
            {
                name: "萬全",
                description: "未阻擋敵人時攻擊速度+{aspd_bonus}，阻擋敵人時攻擊力+{atk_bonus}%",  //天賦描述
                unlockElite: 1,  //解鎖天賦所需精英階段
                levels: [  //精英化階段,數值變化
                    { elite: 1, aspd_bonus: 6, atk_bonus: 6 },
                    { elite: 2, aspd_bonus: 12, atk_bonus: 12 }
                ]
            }
        ],
        // 潛能（6級）
        potential: [
            {potential: 1, descriptionTemplate: "無效果"}, //當前潛能數, 對應解鎖效果
            {potential: 2, descriptionTemplate: "部署費用-1"},
            {potential: 3, descriptionTemplate: "再部署時間-4秒"},
            {potential: 4, descriptionTemplate: "攻擊速度+5"},
            {potential: 5, descriptionTemplate: "天賦效果增強"},
            {potential: 6, descriptionTemplate: "部署費用-1"},
        ],
        // 精英化階段
        eliteStages: [  //精英化階段,等級上限,技能等級上限,費用增加值,解鎖技能,解鎖天賦
            { elite: 0, maxLevel: 50, skillLevelMax: 4, costBonus: 0 },
            { elite: 1, maxLevel: 70, skillLevelMax: 7, costBonus: 2, unlockSkill: "浮光", unlockTalent: "萬全"},
            { elite: 2, maxLevel: 80, skillLevelMax: 7, costBonus: 0}
        ]
    },
    {
        name: "錦",
        portrait: "images/portraits/jin_portrait.png",
        fullPortrait: "images/operator/jin.png",  // 全身立繪（詳細頁用）
        level: 1,
        maxLevel: 40, // 當前階段上限（會隨精英化變）
        elite: 0,    // 當前精英化階段 (0,1)
        rarity: 3,
        class: "guard",
        subclass: "無畏者",
        serial_number: 2,
        portraitAlt: "錦頭像",
        // 基礎數值 + 成長率（用來計算當前數值）
        baseStats: {
            hp: 1395,  //生命
            atk: 396,  //攻擊
            def: 83,  //防禦
            magicResist: 0,  //法抗
            redeployTime: 70,  //再部屬
            cost: 13,  //費用
            blockCount: 1,  //阻擋
            attackInterval: 1.5,  // 攻速(秒)
            position: "近戰位",  //站位
            trust: 0, //信賴
            label: ["輸出", "生存"]  //標籤
        },
        growthRates: {
            hp: [15.3, 13.9],     // [精英0, 精英1] 每級成長
            atk: [4.8, 2.9],
            def: [0.9, 0.7],
            magicResist: 0
        },
        // 技能（最多3個）
        skills: [
            {
                name: "攻擊力強化·α",
                icon: "images/skills/jin_skill(1).png",  // 你之後放的技能圖標
                descriptionTemplate: "攻擊力+{atk_bonus}%",  //技能描述
                levels: [  //等級,數值變化,技能持續時間,初始能量,啟動所需能量,能量恢復方式"自動恢復/攻擊恢復/阻擋恢復",技能啟動方式"自動/手動"
                    { level: 1, atk_bonus: 10, duration: 20, spInitial: 0, spCost: 50, spType: "自動恢復", trigger: "手動" },
                    { level: 2, atk_bonus: 15, duration: 20, spInitial: 0, spCost: 50, spType: "自動恢復", trigger: "手動" },
                    { level: 3, atk_bonus: 20, duration: 20, spInitial: 0, spCost: 50, spType: "自動恢復", trigger: "手動" },
                    { level: 4, atk_bonus: 30, duration: 20, spInitial: 0, spCost: 45, spType: "自動恢復", trigger: "手動" },
                    { level: 5, atk_bonus: 35, duration: 20, spInitial: 0, spCost: 45, spType: "自動恢復", trigger: "手動" },
                    { level: 6, atk_bonus: 40, duration: 20, spInitial: 0, spCost: 45, spType: "自動恢復", trigger: "手動" },
                    { level: 7, atk_bonus: 50, duration: 20, spInitial: 0, spCost: 40, spType: "自動恢復", trigger: "手動" }
                ]
            },
            null  // 沒有3技能就放 null (如果沒有2技能也不需要放兩個)
        ],
        // 天賦
        talents: [
            {
                name: "攻擊提升",
                description: "攻擊力+{atk_bonus}%",  //天賦描述
                unlockElite: 1,  //解鎖天賦所需精英階段
                levels: [  //精英化階段,數值變化
                    { elite: 1, atk_bonus: 4 },
                    { elite: 1, level:55, atk_bonus: 8 }
                ]
            },
            null  // 沒有2天賦就放 null
        ],
        // 潛能（6級）
        potential: [
            {potential: 1, descriptionTemplate: "無效果"}, //當前潛能數, 對應解鎖效果
            {potential: 2, descriptionTemplate: "部署費用-1"},
            {potential: 3, descriptionTemplate: "再部署時間-4秒"},
            {potential: 4, descriptionTemplate: "攻擊力+25"},
            {potential: 5, descriptionTemplate: "再部署時間-6秒"},
            {potential: 6, descriptionTemplate: "部署費用-1"},
        ],
        // 精英化階段
        eliteStages: [  //精英化階段,等級上限,技能等級上限,費用增加值,解鎖技能,解鎖天賦
            { elite: 0, maxLevel: 40, skillLevelMax: 4, costBonus: 0 },
            { elite: 1, maxLevel: 55, skillLevelMax: 7, costBonus: 2, unlockTalent: "攻擊提升"},
        ]
        
    },
    {
        name: "刻璃曦",
        portrait: "images/portraits/chrissy_portrait.png",
        fullPortrait: "images/operator/chrissy.png",  // 全身立繪（詳細頁用）
        level: 1,
        maxLevel: 40, // 當前階段上限（會隨精英化變）
        elite: 0,    // 當前精英化階段 (0,1)
        rarity: 3,
        class: "caster",
        subclass: "擴散術士",
        serial_number: 3,
        portraitAlt: "刻璃曦頭像",
        // 基礎數值 + 成長率（用來計算當前數值）
        baseStats: {
            hp: 614,  //生命
            atk: 321,  //攻擊
            def: 41,  //防禦
            magicResist: 10,  //法抗
            redeployTime: 70,  //再部屬
            cost: 27,  //費用
            blockCount: 1,  //阻擋
            attackInterval: 2.9,  // 攻速(秒)
            position: "遠程位",  //站位
            trust: 0,  //信賴
            label: ["群攻"] //標籤
        },
        growthRates: {
            hp: [6.1, 4.9],     // [精英0, 精英1, 精英2] 每級成長
            atk: [3.4, 2.4],
            def: [0.7, 0.5],
            magicResist: [0, 0.1],
        },
        // 技能（最多3個）
        skills: [
            {
                name: "戰術詠唱·α型",
                icon: "images/skills/chrissy_skill(1).png",  // 你之後放的技能圖標
                descriptionTemplate: "攻击速度+{aspd_bonus}",  //技能描述
                levels: [  //等級,數值變化,技能持續時間,初始能量,啟動所需能量,能量恢復方式"自動恢復/攻擊恢復/阻擋恢復",技能啟動方式"自動/手動"
                    { level: 1, aspd_bonus: 35, duration: 20, spInitial: 0, spCost: 50, spType: "自動恢復", trigger: "手動" },
                    { level: 2, aspd_bonus: 40, duration: 20, spInitial: 0, spCost: 50, spType: "自動恢復", trigger: "手動" },
                    { level: 3, aspd_bonus: 45, duration: 20, spInitial: 0, spCost: 50, spType: "自動恢復", trigger: "手動" },
                    { level: 4, aspd_bonus: 50, duration: 20, spInitial: 0, spCost: 45, spType: "自動恢復", trigger: "手動" },
                    { level: 5, aspd_bonus: 55, duration: 20, spInitial: 0, spCost: 45, spType: "自動恢復", trigger: "手動" },
                    { level: 6, aspd_bonus: 60, duration: 20, spInitial: 0, spCost: 45, spType: "自動恢復", trigger: "手動" },
                    { level: 7, aspd_bonus: 70, duration: 20, spInitial: 0, spCost: 40, spType: "自動恢復", trigger: "手動" }
                ]
            },
            null  // 沒有3技能就放 null (如果沒有2技能也不需要放兩個)
        ],
        // 天賦
        talents: [
            {
                name: "快速技能使用",
                description: "部署後立即獲得{spInitial}點技力",  //天賦描述
                unlockElite: 1,  //解鎖天賦所需精英階段
                levels: [  //精英化階段,數值變化
                    { elite: 1, spInitial: 15},
                    { elite: 1, level: 55, spInitial: 30}
                ]
            }
        ],
        // 潛能（6級）
        potential: [
            {potential: 1, descriptionTemplate: "無效果"}, //當前潛能數, 對應解鎖效果
            {potential: 2, descriptionTemplate: "部署費用-1"},
            {potential: 3, descriptionTemplate: "再部署時間-4秒"},
            {potential: 4, descriptionTemplate: "攻擊速度+8"},
            {potential: 5, descriptionTemplate: "天賦效果增強"},
            {potential: 6, descriptionTemplate: "部署費用-1"},
        ],
        // 精英化階段
        eliteStages: [  //精英化階段,等級上限,技能等級上限,費用增加值,解鎖技能,解鎖天賦
            { elite: 0, maxLevel: 40, skillLevelMax: 4, costBonus: 0 },
            { elite: 1, maxLevel: 55, skillLevelMax: 7, costBonus: 3, unlockTalent: "快速技能使用"},
        ]
    },
    {
        name: "繁恩",
        portrait: "images/portraits/vann_portrait.png",
        fullPortrait: "images/operator/vann.png",  // 全身立繪（詳細頁用）
        level: 1,
        maxLevel: 40, // 當前階段上限（會隨精英化變）
        elite: 0,    // 當前精英化階段 (0,1)
        rarity: 3,
        class: "sniper",
        subclass: "炮手",
        serial_number: 4,
        portraitAlt: "繁恩頭像",
        // 基礎數值 + 成長率（用來計算當前數值）
        baseStats: {
            hp: 736,  //生命
            atk: 340,  //攻擊
            def: 51,  //防禦
            magicResist: 0,  //法抗
            redeployTime: 70,  //再部屬
            cost: 21,  //費用
            blockCount: 1,  //阻擋
            attackInterval: 2.8,  // 攻速(秒)
            position: "遠程位",  //站位
            trust: 0 , //信賴
            label: ["群攻"] //標籤
        },
        growthRates: {
            hp: [4.7, 4.3],     // [精英0, 精英1, 精英2] 每級成長
            atk: [3.8, 2.4],
            def: [0.3, 0.4],
            magicResist: 0
        },
        // 技能（最多3個）
        skills: [
            {
                name: "爆破範圍提升·α型",
                icon: "images/skills/vann_skill(1).png",  // 你之後放的技能圖標
                descriptionTemplate: "普通攻擊的爆炸範圍提升至{Explosion_range}%",  //技能描述
                levels: [  //等級,數值變化,技能持續時間,初始能量,啟動所需能量,能量恢復方式"自動恢復/攻擊恢復/阻擋恢復",技能啟動方式"自動/手動"
                    { level: 1, Explosion_range: 150, duration: 20, spInitial: 0, spCost: 55, spType: "自動恢復", trigger: "手動" },
                    { level: 2, Explosion_range: 150, duration: 22, spInitial: 0, spCost: 53, spType: "自動恢復", trigger: "手動" },
                    { level: 3, Explosion_range: 150, duration: 24, spInitial: 0, spCost: 51, spType: "自動恢復", trigger: "手動" },
                    { level: 4, Explosion_range: 175, duration: 25, spInitial: 0, spCost: 50, spType: "自動恢復", trigger: "手動" },
                    { level: 5, Explosion_range: 175, duration: 27, spInitial: 0, spCost: 48, spType: "自動恢復", trigger: "手動" },
                    { level: 6, Explosion_range: 175, duration: 29, spInitial: 0, spCost: 46, spType: "自動恢復", trigger: "手動" },
                    { level: 7, Explosion_range: 200, duration: 30, spInitial: 0, spCost: 45, spType: "自動恢復", trigger: "手動" }
                ]
            },
            null  // 沒有3技能就放 null (如果沒有2技能也不需要放兩個)
        ],
        // 天賦
        talents: [
            {
                name: "輕量化",
                description: "自身部署費用-{cost}",  //天賦描述
                unlockElite: 1,  //解鎖天賦所需精英階段
                levels: [  //精英化階段,數值變化
                    { elite: 1, cost: 1},
                    { elite: 1, level: 55, cost: 1}
                ]
            }
        ],
        // 潛能（6級）
        potential: [
            {potential: 1, descriptionTemplate: "無效果"}, //當前潛能數, 對應解鎖效果
            {potential: 2, descriptionTemplate: "部署費用-1"},
            {potential: 3, descriptionTemplate: "再部署時間-4秒"},
            {potential: 4, descriptionTemplate: "攻擊力+27"},
            {potential: 5, descriptionTemplate: "再部署時間-6秒"},
            {potential: 6, descriptionTemplate: "部署費用-1"},
        ],
        // 精英化階段
        eliteStages: [  //精英化階段,等級上限,技能等級上限,費用增加值,解鎖技能,解鎖天賦
            { elite: 0, maxLevel: 50, skillLevelMax: 4, costBonus: 0 },
            { elite: 1, maxLevel: 55, skillLevelMax: 7, costBonus: 2, unlockTalent: "輕量化"},
        ]
    },
        {
        name: "哈爐",
        portrait: "images/portraits/haloo_portrait.png",
        fullPortrait: "images/operator/haloo.png",  // 全身立繪（詳細頁用）
        level: 1,
        maxLevel: 45, // 當前階段上限（會隨精英化變）
        elite: 0,    // 當前精英化階段 (0,1)
        rarity: 4,
        class: "medic",
        subclass: "醫師",
        serial_number: 5,
        portraitAlt: "哈爐頭像",
        // 基礎數值 + 成長率（用來計算當前數值）
        baseStats: {
            hp: 725,  //生命
            atk: 173,  //攻擊
            def: 53,  //防禦
            magicResist: 0,  //法抗
            redeployTime: 70,  //再部屬
            cost: 15,  //費用
            blockCount: 1,  //阻擋
            attackInterval: 2.85,  // 攻速(秒)
            position: "遠程位",  //站位
            trust: 0,  //信賴
            label: ["治療"] //標籤
        },
        growthRates: {
            hp: [6.1, 3, 2.5],     // [精英0, 精英1, 精英2] 每級成長
            atk: [2.5, 1.9, 1.3],
            def: [0.5, 0.3, 0.4],
            magicResist: 0
        },
        // 技能（最多3個）
        skills: [
            {
                name: "治療強化·β型",
                icon: "images/skills/haloo_skill(1).png",  // 你之後放的技能圖標
                descriptionTemplate: "攻擊力+{atk_bonus}%",  //技能描述
                levels: [  //等級,數值變化,技能持續時間,初始能量,啟動所需能量,能量恢復方式"自動恢復/攻擊恢復/阻擋恢復",技能啟動方式"自動/手動"
                    { level: 1, atk_bonus: 15, duration: 25, spInitial: 10, spCost: 40, spType: "自動恢復", trigger: "手動" },
                    { level: 2, atk_bonus: 20, duration: 25, spInitial: 10, spCost: 40, spType: "自動恢復", trigger: "手動" },
                    { level: 3, atk_bonus: 25, duration: 25, spInitial: 10, spCost: 40, spType: "自動恢復", trigger: "手動" },
                    { level: 4, atk_bonus: 30, duration: 25, spInitial: 10, spCost: 35, spType: "自動恢復", trigger: "手動" },
                    { level: 5, atk_bonus: 35, duration: 25, spInitial: 10, spCost: 35, spType: "自動恢復", trigger: "手動" },
                    { level: 6, atk_bonus: 40, duration: 25, spInitial: 10, spCost: 35, spType: "自動恢復", trigger: "手動" },
                    { level: 7, atk_bonus: 50, duration: 25, spInitial: 10, spCost: 32, spType: "自動恢復", trigger: "手動" }
                ]
            },
            {
                name: "深度治療",
                icon: "images/skills/haloo_skill(2).png",
                descriptionTemplate: "攻擊力+{atk_bonus}%，攻擊速度+{aspd_bonus}\n同一次作戰最多使用2次",
                levels: [
                    { level: 1, atk_bonus: 40, aspd_bonus: 40, duration: 20, spInitial: 0, spCost: 25, spType: "自動恢復", trigger: "手動" },
                    { level: 2, atk_bonus: 45, aspd_bonus: 45, duration: 21, spInitial: 0, spCost: 25, spType: "自動恢復", trigger: "手動" },
                    { level: 3, atk_bonus: 50, aspd_bonus: 50, duration: 22, spInitial: 0, spCost: 25, spType: "自動恢復", trigger: "手動" },
                    { level: 4, atk_bonus: 55, aspd_bonus: 55, duration: 25, spInitial: 0, spCost: 22, spType: "自動恢復", trigger: "手動" },
                    { level: 5, atk_bonus: 60, aspd_bonus: 60, duration: 26, spInitial: 0, spCost: 22, spType: "自動恢復", trigger: "手動" },
                    { level: 6, atk_bonus: 65, aspd_bonus: 65, duration: 27, spInitial: 0, spCost: 22, spType: "自動恢復", trigger: "手動" },
                    { level: 7, atk_bonus: 70, aspd_bonus: 70, duration: 30, spInitial: 0, spCost: 19, spType: "自動恢復", trigger: "手動" },
                ]
            },
            null  // 沒有3技能就放 null (如果沒有2技能也不需要放兩個)
        ],
        // 天賦
        talents: [
            {
                name: "微創治療",
                description: "編入隊伍時，所有初始費用不超過10的幹員所受到的治療效果提升{healing_received}%",  //天賦描述
                unlockElite: 1,  //解鎖天賦所需精英階段
                levels: [
                    { elite: 1, healing_received: 10 },
                    { elite: 2, healing_received: 20 }
                ]
            }
        ],
        // 潛能（6級）
        potential: [
            {potential: 1, descriptionTemplate: "無效果"}, //當前潛能數, 對應解鎖效果
            {potential: 2, descriptionTemplate: "部署費用-1"},
            {potential: 3, descriptionTemplate: "再部署時間-4秒"},
            {potential: 4, descriptionTemplate: "攻擊力+23"},
            {potential: 5, descriptionTemplate: "天賦效果增強"},
            {potential: 6, descriptionTemplate: "部署費用-1"},
        ],
        // 精英化階段
        eliteStages: [  //精英化階段,等級上限,技能等級上限,費用增加值,解鎖技能,解鎖天賦
            { elite: 0, maxLevel: 50, skillLevelMax: 4, costBonus: 0 },
            { elite: 1, maxLevel: 60, skillLevelMax: 7, costBonus: 2, unlockSkill: "深度治療", unlockTalent: "微創治療"},
            { elite: 2, maxLevel: 70, skillLevelMax: 7, costBonus: 0 }
        ]
    },
        {
        name: "歸燕",
        portrait: "images/portraits/redux_portrait.png",
        fullPortrait: "images/operator/redux.png",  // 全身立繪（詳細頁用）
        level: 1,
        maxLevel: 50, // 當前階段上限（會隨精英化變）
        elite: 0,    // 當前精英化階段 (0,1)
        rarity: 6,
        class: "sniper",
        subclass: "速射手",
        serial_number: 6,
        portraitAlt: "歸燕頭像",
        // 基礎數值 + 成長率（用來計算當前數值）
        baseStats: {
            hp: 711,  //生命
            atk: 183,  //攻擊
            def: 57,  //防禦
            magicResist: 0,  //法抗
            redeployTime: 70,  //再部屬
            cost: 12,  //費用
            blockCount: 1,  //阻擋
            attackInterval: 1.0,  // 攻速(秒)
            position: "遠程位",  //站位
            trust: 0,  //信賴
            label: ["輸出"] //標籤
        },
        growthRates: {
            hp: [6.2, 4.1, 3.8],     // [精英0, 精英1, 精英2] 每級成長
            atk: [2.5, 1.7, 1.2],
            def: [0.8, 0.5, 0.3],
            magicResist: 0
        },
        // 技能（最多3個）
        skills: [
            {
                name: "衝鋒模式",
                icon: "images/skills/redux_skill(1).png",  // 你之後放的技能圖標
                descriptionTemplate: "下次攻擊變成3連射，每次射擊造成相當於攻擊力{damage_bonus}%的傷害",  //技能描述
                levels: [  //等級,數值變化,技能持續時間,初始能量,啟動所需能量,能量恢復方式"自動恢復/攻擊恢復/阻擋恢復",技能啟動方式"自動/手動"
                    { level: 1, damage_bonus: 105, duration: "無", spInitial: 0, spCost: 0, spType: 5, trigger: "自動" },
                    { level: 2, damage_bonus: 107, duration: "無", spInitial: 0, spCost: 0, spType: 5, trigger: "自動" },
                    { level: 3, damage_bonus: 109, duration: "無", spInitial: 0, spCost: 0, spType: 5, trigger: "自動" },
                    { level: 4, damage_bonus: 113, duration: "無", spInitial: 0, spCost: 0, spType: 4, trigger: "自動" },
                    { level: 5, damage_bonus: 115, duration: "無", spInitial: 0, spCost: 0, spType: 4, trigger: "自動" },
                    { level: 6, damage_bonus: 117, duration: "無", spInitial: 0, spCost: 0, spType: 4, trigger: "自動" },
                    { level: 7, damage_bonus: 121, duration: "無", spInitial: 0, spCost: 0, spType: 4, trigger: "自動" }
                ]
            },
            {
                name: "掃射模式",
                icon: "images/skills/redux_skill(2).png",
                descriptionTemplate: "攻擊變成4連射，每次射擊造成相當於攻擊力{damage_bonus}%的傷害",
                levels: [
                    { level: 1, damage_bonus: 100, duration: 15, spInitial: 15, spCost: 45, spType: "自動恢復", trigger: "手動" },
                    { level: 2, damage_bonus: 100, duration: 15, spInitial: 15, spCost: 44, spType: "自動恢復", trigger: "手動" },
                    { level: 3, damage_bonus: 100, duration: 15, spInitial: 15, spCost: 43, spType: "自動恢復", trigger: "手動" },
                    { level: 4, damage_bonus: 105, duration: 15, spInitial: 15, spCost: 42, spType: "自動恢復", trigger: "手動" },
                    { level: 5, damage_bonus: 105, duration: 15, spInitial: 15, spCost: 41, spType: "自動恢復", trigger: "手動" },
                    { level: 6, damage_bonus: 105, duration: 15, spInitial: 15, spCost: 40, spType: "自動恢復", trigger: "手動" },
                    { level: 7, damage_bonus: 120, duration: 15, spInitial: 18, spCost: 39, spType: "自動恢復", trigger: "手動" },
                ]
            },
            {
                name: "超載模式",
                icon: "images/skills/redux_skill(3).png",
                descriptionTemplate: "攻擊變成5連射，攻擊間隔縮短-{attack_interva}\n技能會自動開啟",
                levels: [
                    { level: 1, attack_interva: 0, duration: 15, spInitial: 20, spCost: 50, spType: "自動恢復", trigger: "自動" },
                    { level: 2, attack_interva: 0, duration: 15, spInitial: 20, spCost: 48, spType: "自動恢復", trigger: "自動" },
                    { level: 3, attack_interva: 0, duration: 15, spInitial: 20, spCost: 46, spType: "自動恢復", trigger: "自動" },
                    { level: 4, attack_interva: 0.1, duration: 15, spInitial: 20, spCost: 44, spType: "自動恢復", trigger: "自動" },
                    { level: 5, attack_interva: 0.1, duration: 15, spInitial: 20, spCost: 42, spType: "自動恢復", trigger: "自動" },
                    { level: 6, attack_interva: 0.1, duration: 15, spInitial: 20, spCost: 40, spType: "自動恢復", trigger: "自動" },
                    { level: 7, attack_interva: 0.16, duration: 15, spInitial: 20, spCost: 38, spType: "自動恢復", trigger: "自動" },
                ]
            },
        ],
        // 天賦
        talents: [
            {
                name: "快速彈匣",
                description: "攻擊速度+{aspd_bonus}",  //天賦描述
                unlockElite: 1,  //解鎖天賦所需精英階段
                levels: [  //精英化階段,數值變化
                    { elite: 1, aspd_bonus: 6},
                    { elite: 2, aspd_bonus: 12}
                ]
            },
            {
                name: "天使的祝福",
                description: "攻擊力+{aspd_bonus}%，生命上限+{hp_bonus}%。置入戰場後這個效果會同樣賦予一名隨機友方單位",  //天賦描述
                unlockElite: 2,  //解鎖天賦所需精英階段
                levels: [  //精英化階段,數值變化
                    { elite: 2, atk_bonus: 6, hp_bonus: 10 },
                ]
            },
        ],
        // 潛能（6級）
        potential: [
            {potential: 1, descriptionTemplate: "無效果"}, //當前潛能數, 對應解鎖效果
            {potential: 2, descriptionTemplate: "部署費用-1"},
            {potential: 3, descriptionTemplate: "第一天賦效果增強"},
            {potential: 4, descriptionTemplate: "攻擊力+27"},
            {potential: 5, descriptionTemplate: "部署費用-1"},
            {potential: 6, descriptionTemplate: "第二天賦效果增強"},
        ],
        // 精英化階段
        eliteStages: [  //精英化階段,等級上限,技能等級上限,費用增加值,解鎖技能,解鎖天賦
            { elite: 0, maxLevel: 50, skillLevelMax: 4, costBonus: 0 },
            { elite: 1, maxLevel: 80, skillLevelMax: 7, costBonus: 2, unlockSkill: "掃射模式", unlockTalent: "快速彈匣" },
            { elite: 2, maxLevel: 90, skillLevelMax: 7, costBonus: 0, unlockSkill: "超載模式", unlockTalent: "天使的祝福" }
        ]
    }
    // 之後加新幹員就繼續在這裡加物件
];