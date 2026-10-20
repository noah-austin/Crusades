// Battle plans for the First Crusade. Scene space is 100 wide × 62 tall, north at top.
// Each phase `set`s units to a position and state: march, hold, fight, flee or hidden.
// Units keep their last setting until a later phase changes it.
(() => {
  const C = {
    godfrey: "#7d2a52", raymond: "#2e6a4f", bohemond: "#5b3e8c", main: "#a8301d",
    peter: "#a5650f", flanders: "#2a5e88", adhemar: "#94701f",
    seljuk: "#3f6b6b", mosul: "#5d6b3a", fatimid: "#cbbf9f",
  };

  window.BATTLES = {
    dorylaeum: {
      id: "dorylaeum",
      title: "The battle of Dorylaeum",
      date: "1 July 1097",
      place: "Near Dorylaeum, Anatolia",
      terrain: [
        { type: "hills", at: [22, 5], w: 34, h: 8 },
        { type: "hills", at: [64, 4], w: 40, h: 9 },
        { type: "hills", at: [93, 14], w: 18, h: 10 },
        { type: "hills", at: [74, 60], w: 44, h: 9 },
        { type: "hills", at: [12, 60], w: 26, h: 7 },
        { type: "river", path: [[0, 46], [18, 44], [38, 47], [60, 45], [82, 49], [100, 47]], label: "River", labelAt: [70, 51] },
        { type: "marsh", at: [28, 50], r: 6, n: 16, label: "Marsh", labelAt: [28, 55] },
        { type: "road", path: [[0, 30], [26, 32], [56, 30], [100, 24]] },
        { type: "tents", at: [41, 34], n: 7, r: 8, color: C.main },
        { type: "tents", at: [90, 32], n: 5, r: 6, color: C.seljuk, label: "Turkish camp", labelAt: [90, 38] },
        { type: "label", text: "from Nicaea", at: [7, 27] },
      ],
      units: {
        boh: { label: "Bohemond's knights", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.bohemond, leader: true, at: [44, 27] },
        foot: { label: "Foot soldiers", side: "cru", kind: "foot", rows: 2, cols: 5, color: C.main, at: [48, 36] },
        pilg: { label: "Pilgrims and women", side: "cru", kind: "pilgrim", rows: 2, cols: 4, at: [36, 37] },
        t1: { label: "Horse archers", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.seljuk, start: [66, -4] },
        t2: { label: "Kilij Arslan", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.seljuk, leader: true, start: [104, 34] },
        t3: { label: "Horse archers", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.seljuk, start: [62, 66] },
        god: { label: "Godfrey and Hugh", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.godfrey, leader: true, start: [-10, 24] },
        ray: { label: "Raymond", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.raymond, leader: true, start: [-10, 38] },
        adh: { label: "Bishop Adhemar", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.adhemar, leader: true, start: [104, 6] },
      },
      phases: [
        {
          caption: "Dawn, 1 July 1097. Bohemond's half of the army has camped by a river near Dorylaeum. The other half, under Godfrey and Raymond, is some miles behind.",
          set: { boh: { at: [44, 27], state: "hold" }, foot: { at: [48, 36], state: "hold" }, pilg: { at: [36, 37], state: "hold" } },
        },
        {
          caption: "Turkish horse archers pour over the hills and surround the camp. Arrows fall like rain on the Christians.",
          set: { t1: { at: [64, 17], facing: -1 }, t2: { at: [72, 33], facing: -1 }, t3: { at: [60, 51], facing: -1 } },
          fx: [{ type: "arrows", from: "t1", to: "boh" }, { type: "arrows", from: "t2", to: "foot" }, { type: "arrows", from: "t3", to: "pilg" }],
        },
        {
          caption: "Bohemond sends riders for help and orders everyone to hold together. The army draws into a tight ring, and the women carry water to the fighting men.",
          set: { boh: { at: [47, 29], state: "fight" }, t1: { at: [56, 21], state: "fight", facing: -1 }, pilg: { at: [40, 36], state: "hold" } },
          fx: [{ type: "clash", a: "boh", b: "t1" }, { type: "arrows", from: "t2", to: "foot" }, { type: "arrows", from: "t3", to: "pilg" }],
        },
        {
          caption: "Around midday the second army arrives. Godfrey and Hugh charge in from the west, then Raymond. Now the Turks are fighting on two fronts.",
          set: { god: { at: [50, 15], state: "fight" }, ray: { at: [52, 47], state: "fight" }, t1: { at: [58, 18], state: "fight", facing: -1 }, t3: { at: [61, 47], state: "fight", facing: -1 } },
          fx: [{ type: "clash", a: "god", b: "t1" }, { type: "clash", a: "ray", b: "t3" }, { type: "arrows", from: "t2", to: "foot" }],
        },
        {
          caption: "Bishop Adhemar, who had led his men around through the hills, appears behind the Turkish camp. Caught between three forces, the Turks break.",
          set: { adh: { at: [82, 16], facing: -1 }, t2: { at: [74, 32], state: "fight", facing: 1 } },
          fx: [{ type: "clash", a: "god", b: "t1" }, { type: "clash", a: "ray", b: "t3" }, { type: "arrows", from: "t2", to: "adh", rate: 5 }],
        },
        {
          caption: "Kilij Arslan flees, leaving his camp and treasure behind. The road across Anatolia is open.",
          set: {
            t1: { at: [112, 8], state: "flee", facing: 1 }, t2: { at: [114, 30], state: "flee", facing: 1 }, t3: { at: [112, 58], state: "flee", facing: 1 },
            god: { at: [68, 17] }, ray: { at: [70, 44] }, boh: { at: [62, 29] }, adh: { at: [86, 26], facing: 1 },
          },
        },
      ],
    },

    antioch: {
      id: "antioch",
      title: "The battle of Antioch",
      date: "28 June 1098",
      place: "Antioch",
      terrain: [
        { type: "hills", at: [20, 8], w: 40, h: 16, label: "Mount Silpius", labelAt: [34, 3] },
        { type: "walls", path: [[6, 12], [32, 8], [40, 26], [36, 37], [10, 38], [4, 25]] },
        { type: "landmark", kind: "citadel", at: [20, 10], size: 5 },
        { type: "river", path: [[0, 43], [24, 42], [46, 44], [72, 40], [100, 42]], w: 2.6, label: "Orontes", labelAt: [64, 37.5] },
        { type: "bridge", at: [31, 42] },
        { type: "hills", at: [82, 16], w: 34, h: 9 },
        { type: "tents", at: [87, 56], n: 8, r: 9, color: C.mosul, label: "Kerbogha's camp", labelAt: [87, 61] },
        { type: "label", text: "Antioch", at: [22, 27] },
        { type: "label", text: "Bridge Gate", at: [24, 41], size: 1.1 },
      ],
      units: {
        priests: { label: "Priests praying on the walls", side: "cru", kind: "pilgrim", rows: 1, cols: 4, at: [22, 37] },
        hugh: { label: "Hugh and Robert of Flanders", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.flanders, start: [30, 36] },
        norm: { label: "Robert of Normandy", side: "cru", mix: ["foot", "knight"], kind: "foot", rows: 2, cols: 4, color: C.peter, start: [30, 36] },
        adh: { label: "Adhemar, with the Holy Lance", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.adhemar, leader: true, start: [30, 36] },
        god: { label: "Godfrey", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.godfrey, leader: true, start: [30, 36] },
        tan: { label: "Tancred", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.bohemond, start: [30, 36] },
        boh: { label: "Bohemond", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.bohemond, leader: true, start: [30, 36] },
        saints: { label: "St George, St Demetrius, St Mercurius", side: "cru", kind: "saint", rows: 1, cols: 3, color: "#f4ead2", start: [84, 10] },
        kc: { label: "Kerbogha", side: "foe", kind: "horsearcher", rows: 2, cols: 5, color: C.mosul, leader: true, at: [86, 47] },
        ks: { label: "Allied emirs", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.seljuk, at: [80, 56] },
        kf: { label: "Turkish flanking force", side: "foe", kind: "horsearcher", rows: 2, cols: 3, color: C.mosul, start: [100, 63] },
      },
      phases: [
        {
          caption: "Dawn, 28 June 1098. After three days of fasting and prayer, the starving army marches out of Antioch through the Bridge Gate. Priests pray on the walls.",
          set: {
            hugh: { at: [48, 46] }, norm: { at: [48, 51] }, adh: { at: [48, 56] },
            god: { at: [38, 47] }, tan: { at: [38, 53] }, boh: { at: [29, 50] },
          },
          dur: 6200,
        },
        {
          caption: "Kerbogha lets them cross, hoping to destroy the whole army at once. He sends horsemen around to strike them from behind.",
          set: { kf: { at: [16, 60], facing: -1 }, boh: { at: [27, 54], facing: -1, state: "hold" } },
        },
        {
          caption: "Bohemond's division turns to hold the rear while the rest of the line advances. Raymond of Aguilers carries the Holy Lance before Adhemar's men.",
          set: {
            kf: { at: [17, 58], state: "fight", facing: 1 }, boh: { at: [25, 56], state: "fight", facing: -1 },
            hugh: { at: [62, 45] }, norm: { at: [62, 50] }, adh: { at: [62, 55] }, god: { at: [53, 47] }, tan: { at: [53, 53] },
          },
          fx: [{ type: "clash", a: "boh", b: "kf" }, { type: "arrows", from: "kc", to: "hugh" }, { type: "arrows", from: "ks", to: "adh" }],
        },
        {
          caption: "Then, as the Gesta tells it, an army of riders on white horses came down from the mountains, led by St George, St Demetrius and St Mercurius.",
          set: { saints: { at: [70, 30] } },
          fx: [{ type: "clash", a: "boh", b: "kf" }, { type: "arrows", from: "kc", to: "hugh" }, { type: "arrows", from: "ks", to: "adh" }],
          dur: 6000,
        },
        {
          caption: "Kerbogha's allies, already quarrelling, abandon him. His army breaks and flees. The crusaders take his camp, and that day the citadel surrenders.",
          set: {
            kc: { at: [114, 46], state: "flee", facing: 1 }, ks: { at: [112, 62], state: "flee", facing: 1 }, kf: { at: [-14, 62], state: "flee", facing: -1 },
            hugh: { at: [80, 45] }, norm: { at: [80, 50] }, adh: { at: [76, 55] }, god: { at: [70, 46] }, tan: { at: [70, 52] }, saints: { at: [84, 34] },
          },
        },
      ],
    },

    jerusalem: {
      id: "jerusalem",
      title: "The fall of Jerusalem",
      date: "13–15 July 1099",
      place: "Jerusalem",
      terrain: [
        { type: "hills", at: [92, 30], w: 18, h: 14, label: "Mount of Olives", labelAt: [92, 20] },
        { type: "hills", at: [42, 60], w: 30, h: 6, label: "Mount Zion", labelAt: [30, 58.5] },
        { type: "walls", path: [[28, 16], [74, 14], [77, 48], [66, 53], [34, 53], [26, 36]] },
        { type: "landmark", kind: "rotunda", at: [41, 31], size: 6, label: "Holy Sepulchre", labelAt: [41, 34.5] },
        { type: "landmark", kind: "goldendome", at: [64, 37], size: 7, label: "Temple Mount", labelAt: [64, 40.5] },
        { type: "landmark", kind: "citadel", at: [30, 41], size: 5, label: "Tower of David", labelAt: [20, 41] },
        { type: "tents", at: [44, 4], n: 6, r: 8, color: C.godfrey },
        { type: "label", text: "Kidron Valley", at: [84, 47] },
      ],
      units: {
        gtower: { label: "Godfrey's siege tower", side: "cru", kind: "siegetower", color: C.godfrey, at: [40, 9] },
        ram: { label: "Battering ram", side: "cru", kind: "ram", color: C.main, at: [52, 6] },
        god: { label: "Godfrey", side: "cru", kind: "foot", rows: 2, cols: 4, color: C.godfrey, leader: true, at: [40, 4] },
        tan: { label: "Tancred", side: "cru", kind: "foot", rows: 2, cols: 4, color: C.bohemond, at: [26, 7] },
        rtower: { label: "Raymond's siege tower", side: "cru", kind: "siegetower", color: C.raymond, at: [56, 61] },
        ray: { label: "Raymond", side: "cru", kind: "foot", rows: 2, cols: 4, color: C.raymond, leader: true, at: [44, 59] },
        defn: { label: "Defenders", side: "foe", kind: "archer", rows: 1, cols: 6, color: C.fatimid, at: [40, 18] },
        defs: { label: "Defenders", side: "foe", kind: "archer", rows: 1, cols: 5, color: C.fatimid, at: [52, 51] },
        gov: { label: "Governor Iftikhar", side: "foe", kind: "foot", rows: 1, cols: 3, color: C.fatimid, at: [30, 45] },
      },
      phases: [
        {
          caption: "Night of 13 July. Godfrey's men take their siege tower apart and rebuild it opposite a weaker stretch of the north wall, east of where the defenders expect it.",
          set: { gtower: { at: [62, 8] }, god: { at: [62, 3] }, ram: { at: [52, 7], state: "hold" }, defn: { at: [44, 18], state: "hold" } },
          dur: 6000,
        },
        {
          caption: "14 July. A battering ram smashes the outer wall so the towers can roll close. The defenders answer with stones, arrows and Greek fire.",
          set: { ram: { at: [56, 11], state: "fight" }, gtower: { at: [62, 10] }, defn: { at: [60, 18], state: "fight" }, rtower: { at: [54, 57] } },
          fx: [{ type: "arrows", from: "defn", to: "god" }, { type: "stones", from: "defn", to: "gtower", rate: 4 }, { type: "fire", unit: "gtower", lift: 4, r: 3 }, { type: "arrows", from: "defs", to: "ray" }],
        },
        {
          caption: "On Mount Zion in the south, Raymond's tower meets the fiercest defence of all. The fighting goes on all day.",
          set: { ray: { at: [44, 57], state: "fight" }, defs: { at: [50, 52], state: "fight" } },
          fx: [{ type: "arrows", from: "defs", to: "ray", rate: 14 }, { type: "fire", unit: "rtower", lift: 4, r: 3 }, { type: "stones", from: "defs", to: "rtower", rate: 4 }],
        },
        {
          caption: "Midday, 15 July. Godfrey's tower reaches the north wall. A bridge drops onto the wall, and the brothers Litold and Engelbert of Tournai are the first across, with Godfrey behind them.",
          set: { gtower: { at: [62, 12], state: "fight" }, god: { at: [64, 21], state: "fight" }, defn: { at: [58, 23], state: "fight", facing: 1 } },
          fx: [{ type: "clash", a: "god", b: "defn" }],
          dur: 6400,
        },
        {
          caption: "The north wall falls and the crusaders pour into the city. In the south, the governor surrenders the Tower of David to Raymond.",
          set: {
            tan: { at: [46, 23] }, god: { at: [56, 28] }, defn: { at: [70, 44], state: "flee", facing: 1 },
            ray: { at: [36, 46], state: "hold", facing: -1 }, defs: { at: [72, 52], state: "flee", facing: 1 }, gov: { at: [30, 47], state: "hold", facing: 1 },
          },
        },
        {
          caption: "When the fighting ended, the crusaders went to the Church of the Holy Sepulchre to give thanks at the tomb of Christ.",
          set: { god: { at: [48, 32], state: "hold" }, tan: { at: [44, 26], state: "hold" }, ray: { at: [36, 33], state: "hold", facing: 1 }, gov: { at: [18, 50], state: "flee", facing: -1 } },
        },
      ],
    },

    ascalon: {
      id: "ascalon",
      title: "The battle of Ascalon",
      date: "12 August 1099",
      place: "Outside Ascalon",
      terrain: [
        { type: "sea", poly: [[0, 0], [15, 0], [13, 20], [10, 40], [7, 62], [0, 62]], label: "Sea", labelAt: [5, 12] },
        { type: "walls", path: [[11, 38], [22, 37], [28, 46], [24, 57], [9, 59]] },
        { type: "trees", at: [38, 54], r: 7, n: 10, label: "Sycamore groves", labelAt: [38, 60] },
        { type: "trees", at: [76, 54], r: 6, n: 7 },
        { type: "tents", at: [44, 41], n: 9, r: 10, color: "#e8e0c8", label: "Fatimid camp", labelAt: [56, 37] },
        { type: "road", path: [[34, 0], [36, 20], [30, 40]] },
        { type: "label", text: "Ascalon", at: [17, 49] },
        { type: "label", text: "to Jerusalem", at: [44, 3] },
      ],
      units: {
        ray: { label: "Raymond", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.raymond, leader: true, start: [24, -6] },
        rob: { label: "Robert of Normandy", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.peter, leader: true, start: [40, -6] },
        flan: { label: "Robert of Flanders", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.flanders, start: [53, -6] },
        god: { label: "Godfrey", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.godfrey, leader: true, start: [68, -6] },
        foot: { label: "Foot soldiers", side: "cru", kind: "foot", rows: 2, cols: 6, color: C.main, start: [46, -10] },
        f1: { label: "Al-Afdal", side: "foe", kind: "foot", rows: 2, cols: 5, color: C.fatimid, leader: true, at: [44, 44] },
        f2: { label: "Fatimid cavalry", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.fatimid, at: [64, 46] },
        f3: { label: "Fatimid archers", side: "foe", kind: "archer", rows: 2, cols: 4, color: C.fatimid, at: [30, 47] },
      },
      phases: [
        {
          caption: "Dawn, 12 August 1099. The crusaders march south in battle order, with the newly found relic of the True Cross carried before them. Raymond holds the right by the sea, Godfrey the left.",
          set: { ray: { at: [26, 13] }, rob: { at: [41, 13] }, flan: { at: [54, 13] }, god: { at: [69, 13] }, foot: { at: [47, 21] } },
          dur: 6200,
        },
        {
          caption: "Al-Afdal's army is camped before Ascalon, and the attack catches it unready.",
          set: { ray: { at: [27, 26] }, rob: { at: [42, 27] }, flan: { at: [55, 27] }, god: { at: [68, 30] }, foot: { at: [48, 33] } },
          fx: [{ type: "arrows", from: "f3", to: "ray", rate: 5 }],
        },
        {
          caption: "Robert of Normandy charges straight at al-Afdal's standard and captures it. The whole line follows him in.",
          set: {
            rob: { at: [43, 38], state: "fight" }, f1: { state: "fight", at: [44, 43] }, foot: { at: [52, 38], state: "fight" },
            god: { at: [64, 40], state: "fight" }, f2: { at: [65, 45], state: "fight" }, ray: { at: [29, 40], state: "fight" }, f3: { at: [30, 46], state: "fight" },
          },
          fx: [{ type: "clash", a: "rob", b: "f1" }, { type: "clash", a: "god", b: "f2" }, { type: "clash", a: "ray", b: "f3" }, { type: "arrows", from: "f3", to: "ray" }],
        },
        {
          caption: "The Fatimid army breaks. Some flee into Ascalon, some into the sea, and some hide in the sycamore groves, which the crusaders set on fire.",
          set: {
            f1: { at: [18, 50], state: "flee" }, f3: { at: [4, 38], state: "flee" }, f2: { at: [80, 62], state: "flee", facing: 1 },
            rob: { at: [38, 44], state: "hold" }, god: { at: [70, 48], state: "hold" }, ray: { at: [24, 32], state: "hold" }, foot: { at: [44, 48], state: "hold" },
          },
          fx: [{ type: "fire", at: [38, 53], r: 8 }, { type: "fire", at: [76, 53], r: 6 }],
        },
        {
          caption: "Al-Afdal escapes by ship to Egypt. Jerusalem is safe, and the crusade has done what it set out to do.",
          set: { flan: { at: [56, 40], state: "hold" } },
          fx: [{ type: "fire", at: [38, 53], r: 6 }],
        },
      ],
    },
  };
})();
