// The Latin East after 1099 and the Second Crusade, 1100–1149.
// Coordinates are [longitude, latitude].
// A chapter's `routes` sets how far each army has travelled by the end of that
// chapter, as a vertex index into the route's `points` (fractions are fine).
// Routes not named keep their progress from the chapter before.
(() => {
  // Scene colours, kept in step with the route colours below.
  const C = {
    louis: "#2a4f9c", conrad: "#a07a12", jerusalem: "#a8301d", baldwin: "#7d2a52",
    lisbon: "#9c2b2b", flemish: "#2f6e8f", portugal: "#2e6a4f", aquitaine: "#6b2a7a",
    edessa: "#8a3b2e", templar: "#f2efe6", plain: "#7a6a55",
    zengi: "#3f6b6b", damascus: "#5d6b3a", moors: "#cbbf9f",
  };

  window.CRUSADES = window.CRUSADES || [];
  window.CRUSADES.push({
    id: "second",
    order: 2,
    name: "The Kingdom and the Second Crusade",
    years: "1100–1149",
    blurb: "Fifty years of the Latin East, the fall of Edessa, and the great crusade of two kings that broke at Damascus.",

    routes: {
      baldwin1100: {
        label: "Baldwin",
        color: C.baldwin,
        until: "second-coast",
        column: ["leader", "knight", "knight", "knight", "foot", "foot", "foot"],
        points: [
          [38.79, 37.16],  // 0 Edessa
          [37.73, 36.92],  // 1 Turbessel
          [36.16, 36.20],  // 2 Antioch
          [35.78, 35.52],  // 3 Latakia
          [35.88, 34.89],  // 4 Tortosa
          [35.85, 34.44],  // 5 Tripoli
          [35.63, 33.96],  // 6 Dog River
          [35.50, 33.89],  // 7 Beirut
          [35.37, 33.56],  // 8 Sidon
          [35.20, 33.27],  // 9 Tyre
          [35.07, 32.92],  // 10 Acre
          [34.89, 32.50],  // 11 Caesarea
          [34.75, 32.05],  // 12 Jaffa
          [34.87, 31.93],  // 13 Ramla
          [35.23, 31.78],  // 14 Jerusalem
          [35.20, 31.70],  // 15 Bethlehem
        ],
      },
      conrad: {
        label: "Conrad III",
        color: C.conrad,
        until: "second-dorylaeum",
        column: ["leader", "knight", "knight", "knight", "foot", "foot", "foot", "pilgrim", "pilgrim"],
        points: [
          [12.10, 49.01],  // 0 Regensburg
          [16.37, 48.21],  // 1 Vienna
          [18.74, 47.79],  // 2 Esztergom
          [20.41, 44.84],  // 3 Belgrade
          [21.90, 43.32],  // 4 Niš
          [23.32, 42.70],  // 5 Sofia
          [24.75, 42.15],  // 6 Philippopolis
          [26.56, 41.68],  // 7 Adrianople
          [28.98, 41.01],  // 8 Constantinople
          [29.72, 40.43],  // 9 Nicaea
          [30.15, 40.15],  // 10 Leuke
          [30.52, 39.78],  // 11 Dorylaeum
          [30.85, 39.55],  // 12 farthest point of the march
          [30.52, 39.78],  // 13 Dorylaeum, in retreat
          [29.72, 40.43],  // 14 back to Nicaea
        ],
      },
      conradSea: {
        label: "Conrad III",
        color: C.conrad,
        until: "second-antioch",
        column: ["leader", "knight", "knight"],
        points: [
          [28.98, 41.01],  // 0 Constantinople
          [27.80, 40.75],  // 1 Sea of Marmara
          [26.40, 40.18],  // 2 Dardanelles
          [25.90, 39.70],  // 3 Aegean
          [25.60, 38.50],  // 4 west of Chios
          [25.90, 37.20],  // 5 the Cyclades
          [26.90, 36.40],  // 6 Dodecanese
          [28.50, 36.10],  // 7 off Rhodes
          [30.50, 35.80],  // 8 off Lycia
          [32.00, 34.60],  // 9 south-west of Cyprus
          [34.00, 34.30],  // 10 south of Cyprus
          [34.80, 33.20],  // 11 off Tyre
          [35.07, 32.92],  // 12 Acre
        ],
      },
      louis: {
        label: "Louis VII",
        color: C.louis,
        until: "second-antioch",
        column: ["leader", "knight", "knight", "knight", "foot", "foot", "foot", "foot", "pilgrim", "pilgrim", "pilgrim"],
        points: [
          [2.36, 48.94],   // 0 Saint-Denis
          [6.18, 49.12],   // 1 Metz
          [8.36, 49.63],   // 2 Worms
          [12.10, 49.01],  // 3 Regensburg
          [16.37, 48.21],  // 4 Vienna
          [18.74, 47.79],  // 5 Esztergom
          [20.41, 44.84],  // 6 Belgrade
          [21.90, 43.32],  // 7 Niš
          [23.32, 42.70],  // 8 Sofia
          [24.75, 42.15],  // 9 Philippopolis
          [26.56, 41.68],  // 10 Adrianople
          [28.98, 41.01],  // 11 Constantinople
          [29.72, 40.43],  // 12 Nicaea
          [28.43, 40.13],  // 13 Lopadion
          [27.02, 39.60],  // 14 Adramyttium
          [27.18, 39.12],  // 15 Pergamum
          [27.14, 38.42],  // 16 Smyrna
          [27.34, 37.94],  // 17 Ephesus
          [28.52, 37.87],  // 18 crossing of the Meander
          [29.11, 37.84],  // 19 Laodicea
          [29.27, 37.70],  // 20 Mount Cadmus
          [29.95, 37.30],  // 21 Pisidian hills
          [30.70, 36.89],  // 22 Attalia
        ],
      },
      louisSea: {
        label: "Louis VII",
        color: C.louis,
        until: "second-damascus",
        column: ["leader", "knight", "knight", "knight"],
        points: [
          [30.70, 36.89],  // 0 Attalia
          [31.30, 36.55],  // 1 Gulf of Antalya
          [32.50, 35.90],  // 2 off Anamur
          [33.80, 35.85],  // 3 between Cilicia and Cyprus
          [34.80, 36.15],  // 4 Gulf of Alexandretta
          [35.70, 36.08],  // 5 approach to the Orontes
          [35.93, 36.05],  // 6 port of St Symeon
          [36.16, 36.20],  // 7 Antioch
          [35.78, 35.52],  // 8 Latakia
          [35.85, 34.44],  // 9 Tripoli
          [35.50, 33.89],  // 10 Beirut
          [35.20, 33.27],  // 11 Tyre
          [35.07, 32.92],  // 12 Acre
          [35.23, 31.78],  // 13 Jerusalem
        ],
      },
      lisbon: {
        label: "The northern fleet",
        color: "#7a3b8f",
        until: "second-lisbon",
        column: ["leader", "knight", "foot", "foot", "archer", "foot", "pilgrim"],
        points: [
          [-3.58, 50.35],  // 0 Dartmouth
          [-5.00, 49.60],  // 1 off the Lizard
          [-6.50, 47.50],  // 2 Bay of Biscay
          [-8.00, 44.30],  // 3 off Galicia
          [-9.60, 43.30],  // 4 off Cape Finisterre
          [-9.40, 42.20],  // 5 off Vigo
          [-9.10, 41.60],  // 6 coast of Portugal
          [-8.67, 41.15],  // 7 Porto
          [-9.10, 40.60],  // 8 at sea again
          [-9.60, 39.40],  // 9 off Peniche
          [-9.60, 38.65],  // 10 past Cabo da Roca
          [-9.28, 38.67],  // 11 mouth of the Tagus
          [-9.135, 38.71], // 12 Lisbon
        ],
      },
      damascus: {
        label: "Three kings",
        color: C.jerusalem,
        until: "second-damascus",
        column: ["leader", "knight", "templar", "knight", "knight", "foot", "foot", "foot", "foot"],
        points: [
          [35.07, 32.92],  // 0 Acre
          [35.53, 32.79],  // 1 Tiberias
          [35.62, 33.05],  // 2 up the Jordan valley
          [35.69, 33.25],  // 3 Banias
          [35.88, 33.31],  // 4 Beit Jinn, below Mount Hermon
          [36.23, 33.46],  // 5 Darayya
          [36.26, 33.505], // 6 the orchards west of Damascus
          [36.29, 33.48],  // 7 south of the walls
          [36.335, 33.505], // 8 the eastern plain
        ],
      },
    },

    regions: [
      { name: "Kingdom of France", at: [2.4, 47.2] },
      { name: "Kingdom of England", at: [-1.8, 52.4] },
      { name: "Holy Roman Empire", at: [10.6, 51.2] },
      { name: "Kingdom of Hungary", at: [19.6, 47.6] },
      { name: "Kingdom of Portugal", at: [-8.2, 40.3] },
      { name: "Al-Andalus", at: [-4.8, 37.6] },
      { name: "Wendish lands", at: [13.6, 53.8] },
      { name: "Byzantine Empire", at: [22.6, 39.2] },
      { name: "Sultanate of Rûm", at: [33.2, 39.1] },
      { name: "Zengi's Mosul and Aleppo", at: [40.6, 36.0], from: "second-zengi" },
      { name: "Damascus", at: [37.2, 33.1] },
      { name: "Fatimid Caliphate", at: [30.8, 29.0] },
      { name: "Mediterranean Sea", at: [18.5, 35.2], sea: true },
      { name: "Black Sea", at: [34.5, 43.2], sea: true },
      { name: "Atlantic Ocean", at: [-14.0, 44.0], sea: true },
      { name: "Bay of Biscay", at: [-5.0, 45.4], sea: true },
      { name: "Kingdom of Jerusalem", at: [35.4, 32.4], state: true },
      { name: "Principality of Antioch", at: [36.6, 36.6], state: true },
      { name: "County of Edessa", at: [38.9, 37.7], until: "second-edessa", state: true },
      { name: "Turbessel, last of Edessa", at: [37.6, 37.1], from: "second-bull", until: "second-damascus", state: true },
      { name: "County of Tripoli", at: [36.2, 34.6], from: "second-coast", state: true },
    ],

    landmarks: [
      { name: "Jerusalem", at: [35.23, 31.78], icon: "jerusalem", major: true },
      { name: "Temple Mount", at: [35.2355, 31.7765], icon: "goldendome", today: "Haram al-Sharif and al-Aqsa Mosque, Jerusalem" },
      { name: "Constantinople", at: [28.98, 41.01], icon: "hagia", major: true, today: "Istanbul, Turkey" },
      { name: "Antioch", at: [36.16, 36.20], icon: "antioch", major: true, today: "Antakya, Turkey" },
      { name: "Edessa", at: [38.79, 37.16], icon: "citadel", major: true, today: "Şanlıurfa, Turkey" },
      { name: "Damascus", at: [36.30, 33.51], icon: "walled", major: true, today: "Damascus, Syria" },
      { name: "Bethlehem", at: [35.20, 31.70], icon: "basilica", today: "Bethlehem, West Bank" },
      { name: "Acre", at: [35.07, 32.92], icon: "port", today: "Akko, Israel" },
      { name: "Tyre", at: [35.20, 33.27], icon: "walled", today: "Sour, Lebanon" },
      { name: "Tripoli", at: [35.85, 34.44], icon: "walled", today: "Tripoli, Lebanon" },
      { name: "Banias", at: [35.69, 33.25], icon: "castle", today: "Banias, Golan Heights" },
      { name: "Tiberias", at: [35.53, 32.79], icon: "town", today: "Tiberias, Israel" },
      { name: "Aleppo", at: [37.16, 36.20], icon: "citadel", today: "Aleppo, Syria" },
      { name: "Turbessel", at: [37.73, 36.92], icon: "castle", today: "Tell Bashir, near Gaziantep, Turkey" },
      { name: "Field of Blood", at: [36.76, 36.22], icon: "battle", today: "Near Sarmada, Syria" },
      { name: "Attalia", at: [30.70, 36.89], icon: "port", today: "Antalya, Turkey" },
      { name: "Mount Cadmus", at: [29.27, 37.70], icon: "battle", today: "Honaz Dağı, near Denizli, Turkey" },
      { name: "Dorylaeum", at: [30.52, 39.78], icon: "battle", today: "Eskişehir, Turkey" },
      { name: "Nicaea", at: [29.72, 40.43], icon: "walled", today: "İznik, Turkey" },
      { name: "Ephesus", at: [27.34, 37.94], icon: "town", today: "Ruins near Selçuk, Turkey" },
      { name: "Vézelay", at: [3.745, 47.466], icon: "basilica", today: "Vézelay, Burgundy, France" },
      { name: "Clairvaux", at: [4.785, 48.145], icon: "cathedral", today: "Ville-sous-la-Ferté, France" },
      { name: "Troyes", at: [4.074, 48.297], icon: "cathedral", today: "Troyes, France" },
      { name: "Saint-Denis", at: [2.36, 48.94], icon: "basilica", today: "Saint-Denis, Paris, France" },
      { name: "Speyer", at: [8.43, 49.32], icon: "cathedral", today: "Speyer, Germany" },
      { name: "Regensburg", at: [12.10, 49.01], icon: "town", today: "Regensburg, Germany" },
      { name: "Dartmouth", at: [-3.58, 50.35], icon: "port", today: "Dartmouth, England" },
      { name: "Porto", at: [-8.61, 41.15], icon: "town", today: "Porto, Portugal" },
      { name: "Lisbon", at: [-9.135, 38.71], icon: "citadel", today: "Lisbon, Portugal" },
    ],

    figures: {
      baldwin: {
        name: "Baldwin of Boulogne",
        role: "Count of Edessa; first King of Jerusalem, 1100–1118",
        life: "c. 1060–1118",
        portrait: { kind: "king", color: "#7d2a52", color2: "#d2a33a", beard: true, emblem: "cross" },
        bio: [
          "Godfrey of Bouillon's younger brother. He founded the County of Edessa in 1098, the first crusader state.",
          "When Godfrey died he came south and was crowned King of Jerusalem in Bethlehem on Christmas Day 1100. Unlike his brother, he took the title of king.",
          "With Italian fleets he took most of the coastal cities, which gave the kingdom its ports. He died in 1118 on campaign in Egypt.",
        ],
      },
      baldwin2: {
        name: "Baldwin II of Jerusalem",
        role: "Count of Edessa; King of Jerusalem, 1118–1131",
        life: "d. 1131",
        portrait: { kind: "king", color: "#5a3d7a", color2: "#d2a33a", beard: true, emblem: "cross" },
        bio: [
          "Baldwin of Bourcq, a cousin of Baldwin I, who left him Edessa in 1100. He became king in 1118.",
          "He saved Antioch after the Field of Blood and spent over a year as a prisoner of the Turks. He gave the first Templars a home in his palace on the Temple Mount.",
          "He had four daughters and no son. On his deathbed he left the kingdom to his eldest, Melisende, with her husband Fulk and their infant son.",
        ],
      },
      melisende: {
        name: "Melisende of Jerusalem",
        role: "Queen of Jerusalem, 1131–1153",
        life: "c. 1105–1161",
        portrait: { kind: "queen", color: "#3d5a9c", color2: "#d2a33a", emblem: "cross" },
        bio: [
          "Daughter of Baldwin II and the Armenian princess Morphia of Melitene. She was born and raised in the Latin East.",
          "She ruled beside her husband Fulk of Anjou, and after his death in 1143 beside her young son Baldwin III. William of Tyre admired her wisdom and her skill in government.",
          "She was a great patron of churches and convents. The Melisende Psalter, a prayer book made in Jerusalem, is linked with her name.",
        ],
      },
      hughpayns: {
        name: "Hugh of Payns",
        role: "First Master of the Knights Templar",
        life: "c. 1070–1136",
        portrait: { kind: "templar", color: "#f2efe6", color2: "#a8301d", beard: true, emblem: "templar" },
        bio: [
          "A knight from Payns, near Troyes in Champagne. He went east early in the century and stayed.",
          "Around 1119 he and a few companions took religious vows in Jerusalem and promised to guard the pilgrim roads. They became the Poor Knights of the Temple.",
          "In 1127–1129 he toured the West for recruits and money and won a rule for his order at the Council of Troyes. He died in the East in 1136.",
        ],
      },
      bernard: {
        name: "Bernard of Clairvaux",
        role: "Abbot of Clairvaux; preacher of the Second Crusade",
        life: "1090–1153",
        portrait: { kind: "monk", color: "#ece6d6", color2: "#8a7a5a", emblem: "none" },
        bio: [
          "A Burgundian noble who joined the strict new abbey of Cîteaux with thirty relatives and friends. In 1115 he founded Clairvaux and became its abbot.",
          "He was the most famous churchman of his age. He backed the Templars at Troyes and wrote In Praise of the New Knighthood for them.",
          "At the pope's command he preached the Second Crusade in France and Germany, and he stopped attacks on the Jews of the Rhineland. He was made a saint in 1174.",
        ],
      },
      eugenius: {
        name: "Pope Eugenius III",
        role: "Pope, 1145–1153",
        life: "d. 1153",
        portrait: { kind: "pope", color: "#f2efe6", color2: "#d2a33a", emblem: "keys" },
        bio: [
          "Bernardo of Pisa, a Cistercian monk and Bernard of Clairvaux's former pupil. He was the first Cistercian pope.",
          "Rome's commune drove him from the city for much of his reign. From exile he issued Quantum praedecessores, the bull that launched the Second Crusade.",
          "He extended crusading to Spain and to the Wendish lands on the Baltic. He was beatified in 1872.",
        ],
      },
      louis: {
        name: "Louis VII of France",
        role: "King of France, 1137–1180",
        life: "1120–1180",
        portrait: { kind: "king", color: "#2a4f9c", color2: "#d2a33a", emblem: "lilies" },
        bio: [
          "A second son raised for the Church, he became heir when his elder brother died. He married Eleanor of Aquitaine in 1137 and became king the same year.",
          "He was the first king to take the cross. He was pious and brave, but he could not keep his army together on the road.",
          "His marriage to Eleanor was annulled in 1152. He ruled France for another three decades.",
        ],
      },
      eleanor: {
        name: "Eleanor of Aquitaine",
        role: "Queen of France, later Queen of England",
        life: "c. 1122–1204",
        portrait: { kind: "queen", color: "#6b2a7a", color2: "#d2a33a", emblem: "none" },
        bio: [
          "Duchess of Aquitaine in her own right, the greatest heiress in France. She married Louis VII at about fifteen.",
          "She took the cross at Vézelay and went east with her husband. At Antioch she sided with her uncle Raymond against Louis, and the marriage never recovered.",
          "After the annulment in 1152 she married Henry of Anjou, the future Henry II of England. Two of their sons, Richard and John, became kings.",
        ],
      },
      conrad3: {
        name: "Conrad III",
        role: "King of the Romans (Germany), 1138–1152",
        life: "1093–1152",
        portrait: { kind: "king", color: "#a07a12", color2: "#1d1d1d", beard: true, emblem: "eagle" },
        bio: [
          "The first Hohenstaufen king of Germany. He was never crowned emperor.",
          "He had been to Jerusalem as a pilgrim in his youth. Bernard of Clairvaux persuaded him to take the cross at Speyer at Christmas 1146.",
          "His army was destroyed in Anatolia, but he reached the Holy Land by sea and fought at Damascus. His nephew Frederick Barbarossa marched with him.",
        ],
      },
      manuel: {
        name: "Manuel I Komnenos",
        role: "Byzantine Emperor, 1143–1180",
        life: "1118–1180",
        portrait: { kind: "emperor", color: "#6b2f7d", color2: "#d2a33a", beard: true, emblem: "cross" },
        bio: [
          "Grandson of Alexios I. He came to the throne in 1143, only four years before the crusade arrived at his gates.",
          "He moved the crusaders across the Bosporus quickly and made a truce with the Sultan of Rûm, which the Franks took as betrayal.",
          "When Conrad fell ill he nursed him himself in Constantinople. He later married a princess of Antioch and became a patron of the crusader states.",
        ],
      },
      zengi: {
        name: "Imad ad-Din Zengi",
        role: "Atabeg of Mosul and Aleppo",
        life: "c. 1085–1146",
        portrait: { kind: "sultan", color: "#3f6b6b", color2: "#c9b26b", beard: true, emblem: "none" },
        bio: [
          "A Turkish commander who became ruler of Mosul in 1127 and of Aleppo in 1128. He joined northern Iraq and Syria under one hand.",
          "He spent much of his career fighting other Muslim rulers, and long tried to take Damascus. In 1144 he took Edessa, the first crusader state to fall.",
          "He was murdered in his tent by a slave in September 1146.",
        ],
      },
      nuraddin: {
        name: "Nur ad-Din",
        role: "Ruler of Aleppo, later of Damascus",
        life: "1118–1174",
        portrait: { kind: "sultan", color: "#5d6b3a", color2: "#d8cfa8", beard: true, emblem: "none" },
        bio: [
          "Zengi's son, who took Aleppo when his father died in 1146. He crushed Joscelin II's attempt to retake Edessa that same year.",
          "He made holy war against the Franks the centre of his rule. In 1149 he killed Raymond of Antioch at Inab, and in 1154 he took Damascus.",
          "He sent Saladin's uncle Shirkuh to Egypt, which opened the way for Saladin.",
        ],
      },
      odo: {
        name: "Odo of Deuil",
        role: "Monk of Saint-Denis; chaplain to Louis VII",
        life: "c. 1110–1162",
        portrait: { kind: "monk", color: "#2b2622", color2: "#8a7a5a", emblem: "none" },
        bio: [
          "A Benedictine monk of the royal abbey of Saint-Denis, and a protégé of its abbot Suger.",
          "He rode with Louis VII as his chaplain and wrote the main eyewitness account of the French march, De profectione Ludovici VII in Orientem. It breaks off at Antioch.",
          "He blames the Greeks for much of the army's suffering. He became abbot of Saint-Denis in 1151.",
        ],
      },
      joscelin2: {
        name: "Joscelin II of Edessa",
        role: "Count of Edessa, 1131–1150",
        life: "d. 1159",
        portrait: { kind: "knight", color: "#8a3b2e", color2: "#d2a33a", emblem: "cross" },
        bio: [
          "Son of Joscelin I and an Armenian princess. He held his court at Turbessel, west of the Euphrates, rather than in Edessa.",
          "He was away when Zengi besieged his capital in 1144. In 1146 he briefly retook the city, and lost it again to Nur ad-Din.",
          "Captured in 1150, he was blinded and died in prison at Aleppo. The last of his county was sold to the Byzantines.",
        ],
      },
      raymondpoitiers: {
        name: "Raymond of Poitiers",
        role: "Prince of Antioch, 1136–1149",
        life: "c. 1115–1149",
        portrait: { kind: "knight", color: "#4a7a3a", color2: "#d2a33a", beard: true, emblem: "cross" },
        bio: [
          "A younger son of the Duke of Aquitaine, and Eleanor's uncle. He came east to marry the heiress of Antioch.",
          "He welcomed Louis VII in 1148 and urged him to attack Aleppo. Louis refused and went on to Jerusalem.",
          "He was killed fighting Nur ad-Din at Inab in June 1149.",
        ],
      },
      baldwin3: {
        name: "Baldwin III of Jerusalem",
        role: "King of Jerusalem, 1143–1163",
        life: "1130–1163",
        portrait: { kind: "king", color: "#7d2a52", color2: "#e0c060", emblem: "cross" },
        bio: [
          "Son of Melisende and Fulk of Anjou. He was crowned with his mother at Christmas 1143, aged thirteen.",
          "At eighteen he rode at the head of the march on Damascus. In 1152 he took full power from his mother after a short civil war.",
          "In 1153 he took Ascalon, the last Fatimid fortress on the coast. William of Tyre thought him a model king.",
        ],
      },
    },

    chapters: [
      {
        id: "second-prologue",
        date: "October – 25 December 1100",
        year: 1100,
        mapYear: 1100.9,
        title: "A king in Bethlehem",
        place: "Bethlehem",
        at: [35.20, 31.70],
        view: { at: [36.4, 34.4], k: 4 },
        routes: { baldwin1100: 15 },
        caption: "Godfrey is dead. His brother Baldwin rides south from Edessa, fights through an ambush near Beirut, and is crowned the first King of Jerusalem at Bethlehem on Christmas Day 1100.",
        body: [
          "Godfrey of Bouillon died in Jerusalem on 18 July 1100. His knights sent word north to his brother Baldwin, Count of Edessa. Baldwin handed Edessa to his cousin, Baldwin of Bourcq, and set out with a small army.",
          "Near the Dog River, north of Beirut, the ruler of Damascus laid an ambush on the coast road. Baldwin fought his way through. His chaplain, Fulcher of Chartres, rode with him and admitted that he was badly frightened.",
          "Godfrey had refused to wear a crown in Jerusalem. Baldwin had no such doubts. On Christmas Day 1100, in the Church of the Nativity at Bethlehem, Patriarch Daimbert crowned him King of Jerusalem.",
        ],
        today: "Bethlehem, West Bank. The Church of the Nativity still stands, much as the crusaders knew it.",
        figures: ["baldwin"],
      },
      {
        id: "second-coast",
        date: "1101–1110",
        year: 1104,
        mapYear: 1109.6,
        title: "The ports and the fourth state",
        place: "Acre and the Levant coast",
        at: [35.07, 32.92],
        view: { at: [35.5, 33.6], k: 5.2 },
        caption: "With Genoese and other Italian fleets, Baldwin takes the coastal cities one by one. Acre falls in 1104. In 1109 Tripoli falls and becomes the fourth crusader state.",
        body: [
          "The kingdom could not live without ports. Pilgrims, settlers and supplies all came by sea, and most of the coast was still in Muslim hands. The Italian trading cities had the ships. In return for their help, Baldwin gave them a share of the spoils and a quarter of each city to trade from.",
          "With a Genoese fleet he took Arsuf and Caesarea in 1101. Acre, the best harbour on the coast, surrendered on 26 May 1104. Beirut fell in 1110, and Sidon that December with the help of King Sigurd of Norway, who had sailed out with a fleet of Norwegian crusaders.",
          "In the north, Raymond of Toulouse had besieged Tripoli from a castle he built on a hill outside it, Mount Pilgrim. He died there in 1105. His son Bertrand took the city on 12 July 1109, again with Genoese ships. The County of Tripoli joined Edessa, Antioch and Jerusalem as the fourth crusader state.",
          "Only Tyre and Ascalon now held out on the coast. Tyre fell in 1124, to a siege backed by a Venetian fleet.",
        ],
        today: "Akko, Israel. The great halls of the crusader city survive beneath the Ottoman town.",
        figures: ["baldwin"],
      },
      {
        id: "second-ager",
        fight: true,
        date: "28 June 1119",
        year: 1119,
        mapYear: 1119.5,
        title: "The Field of Blood",
        place: "Near Sarmada, west of Aleppo",
        at: [36.76, 36.22],
        view: { at: [36.6, 36.2], k: 8 },
        caption: "Roger of Antioch marches out without waiting for help. Ilghazi of Mardin surrounds his camp at dawn. Roger dies beneath his cross, and the Latins call the place the Field of Blood.",
        body: [
          "Baldwin I died in 1118 on a raid into Egypt, and his cousin Baldwin of Bourcq became King Baldwin II. The next summer Ilghazi, the Turkish lord of Mardin, invaded the lands of Antioch.",
          "Roger of Salerno, who governed Antioch, would not wait for the king and the Count of Tripoli. He camped in a valley near Sarmada. At dawn on 28 June 1119 the Turks surrounded the camp. Roger was killed fighting beneath a great jewelled cross, and almost his whole army was killed or taken. Many prisoners were tortured to death at Aleppo.",
          "Walter, Roger's chancellor, wrote the Latin account of the battle. The Franks called the place Ager Sanguinis, the Field of Blood. In Antioch the patriarch armed the clergy to guard the walls until Baldwin II arrived and saved the city.",
        ],
        today: "Near Sarmada, Idlib province, Syria.",
        sources: [{ title: "Walter the Chancellor, The Antiochene Wars" }],
        figures: ["baldwin2"],
      },
      {
        id: "second-templars",
        moment: "templars",
        date: "1113–1120",
        year: 1120,
        mapYear: 1120,
        title: "Poor knights of the Temple",
        place: "The Temple Mount, Jerusalem",
        at: [35.2355, 31.7765],
        view: { at: [35.234, 31.777], k: 12 },
        caption: "Hugh of Payns and a handful of knights vow to live as religious men and guard the pilgrim roads. King Baldwin II gives them a home in the Temple of Solomon.",
        body: [
          "Two new kinds of brotherhood grew up in Jerusalem. The first was the Hospital of St John, a hostel for poor and sick pilgrims near the Holy Sepulchre, run by a man named Gerard. In 1113 Pope Paschal II took it under papal protection. It would later take up arms too.",
          "The roads were dangerous. At Easter 1119 a band of pilgrims was massacred on the way to the River Jordan. Around this time Hugh of Payns, a knight from Champagne, and Godfrey of Saint-Omer, with a few companions, took vows of poverty, chastity and obedience before the patriarch. Their task was to protect pilgrims.",
          "King Baldwin II gave them part of his palace in the al-Aqsa mosque, which the Franks called the Temple of Solomon. From it they took their name. William of Tyre says they were only nine for their first nine years, and wore ordinary clothes given them as alms.",
        ],
        quotes: [
          {
            text: "Their primary duty was that, as far as their strength permitted, they should keep the roads and highways safe from the menace of robbers and highwaymen, with especial regard for the protection of pilgrims.",
            source: "William of Tyre, History, book 12 (abridged)",
          },
        ],
        myth: {
          myth: "The Templars were founded to dig for treasure or the Holy Grail beneath Solomon's Temple.",
          fact: "No medieval source says so. The earliest accounts describe a few poor knights guarding pilgrim roads. The treasure stories were invented centuries later.",
        },
        today: "Jerusalem. The al-Aqsa Mosque, the Templars' first headquarters, is a mosque again.",
        figures: ["hughpayns", "baldwin2"],
      },
      {
        id: "second-troyes",
        date: "13 January 1129",
        year: 1129,
        mapYear: 1129,
        title: "The Council of Troyes",
        place: "Troyes, Champagne",
        at: [4.074, 48.297],
        view: { at: [4.4, 48.2], k: 7 },
        caption: "Hugh of Payns comes west for recruits. At Troyes a council of churchmen, with Bernard of Clairvaux among them, gives the Templars a rule of their own.",
        body: [
          "In 1127 Hugh of Payns sailed west to raise men and money. King Baldwin II also gave him a second errand: to find a husband for his daughter Melisende. Hugh helped bring Count Fulk of Anjou into the match.",
          "In January 1129 a church council met at Troyes under the papal legate. Bernard, abbot of the nearby abbey of Clairvaux, was there. The council gave the Templars a rule, drawn partly from the customs of monks. Their knights would wear white.",
          "At Hugh's request Bernard wrote In Praise of the New Knighthood. It praised a new kind of man, a knight who was also a monk. Gifts of land and money soon poured in, and Hugh went back east with new brothers.",
        ],
        quotes: [
          {
            text: "He is truly a fearless knight and secure on every side, for his soul is protected by the armour of faith just as his body is protected by armour of steel.",
            source: "Bernard of Clairvaux, In Praise of the New Knighthood",
          },
        ],
        today: "Troyes, France. Payns, Hugh's home village, is a few miles to the north-west.",
        figures: ["hughpayns", "bernard"],
      },
      {
        id: "second-melisende",
        date: "1129–1143",
        year: 1131,
        mapYear: 1135,
        title: "Queen Melisende",
        place: "Jerusalem",
        at: [35.23, 31.78],
        view: { at: [35.3, 32.3], k: 6 },
        caption: "Baldwin II leaves his kingdom to his daughter Melisende. She rules beside Fulk of Anjou, and after his death beside her young son, Baldwin III.",
        body: [
          "Melisende married Fulk of Anjou in 1129. When Baldwin II died in August 1131 he left the kingdom to Melisende, Fulk and their baby son together. They were crowned in the Holy Sepulchre that September.",
          "Fulk tried to rule without his wife. A revolt by her kinsman Hugh of Le Puiset in 1134 ended in her favour, and William of Tyre says that afterwards Fulk did nothing, even in small matters, without her consent.",
          "She founded a convent at Bethany for her youngest sister and gave richly to the churches of Jerusalem. In November 1143 Fulk was killed when his horse fell while chasing a hare near Acre. At Christmas Melisende was crowned again, with her thirteen-year-old son, Baldwin III.",
        ],
        figures: ["melisende", "baldwin2", "baldwin3"],
      },
      {
        id: "second-zengi",
        date: "1127–1144",
        year: 1137,
        mapYear: 1140,
        title: "Zengi",
        place: "Aleppo and Mosul",
        at: [37.16, 36.20],
        view: { at: [38.4, 35.4], k: 4.2 },
        caption: "A Turkish commander, Zengi, takes Mosul and Aleppo. The crusader states, used to divided enemies, now face one strong neighbour in the north.",
        body: [
          "For thirty years the Franks had survived partly because the Muslim rulers of Syria were divided. That began to change in 1127, when the Turkish commander Imad ad-Din Zengi became ruler of Mosul. A year later he took Aleppo.",
          "In 1137 he trapped King Fulk in the castle of Montferrand and let him go only in exchange for it. Zengi wanted Damascus most of all. Its ruler, Unur, turned to Jerusalem for help, and in 1140 Damascenes and Franks besieged Banias together.",
          "In the far north, Count Joscelin II of Edessa kept his court at Turbessel, west of the Euphrates. William of Tyre, writing later, blamed him for neglecting his capital.",
        ],
        figures: ["zengi", "joscelin2", "melisende"],
      },
      {
        id: "second-edessa",
        camp: "foe",
        fight: true,
        battle: "edessa",
        date: "28 November – 24 December 1144",
        year: 1144,
        mapYear: 1144.95,
        title: "The fall of Edessa",
        place: "Edessa",
        at: [38.79, 37.16],
        view: { at: [38.6, 37.1], k: 9 },
        days: { from: "1144-11-28", to: "1144-12-24", label: "of the siege" },
        caption: "While Joscelin is away, Zengi besieges Edessa. His miners bring down the wall on Christmas Eve 1144. The first crusader state has lost its capital.",
        body: [
          "In late 1144 Joscelin II took his troops west of the Euphrates. Zengi moved fast and was before Edessa on 28 November. The city had few soldiers. Its Latin archbishop, Hugh, led the defence with the Armenian and Syrian bishops and the townsmen.",
          "Zengi's miners dug under the north wall and propped their tunnels with timber. On 24 December they fired the props and a long stretch of wall fell. The Turks poured in. Many townspeople were crushed in the rush to the citadel, and Archbishop Hugh was among the dead. The citadel surrendered two days later.",
          "Zengi put the Franks to death and spared the native Christians. Help from Jerusalem came too late. In 1146 Zengi was murdered, and Joscelin briefly got back into the city. Zengi's son Nur ad-Din retook it, and this time the Christian population was killed or carried off.",
        ],
        today: "Şanlıurfa, Turkey. The citadel hill and the Pools of Abraham are still the heart of the city.",
        figures: ["zengi", "joscelin2", "nuraddin"],
      },
      {
        id: "second-bull",
        date: "1 December 1145 – 1 March 1146",
        year: 1145,
        mapYear: 1146,
        title: "Quantum praedecessores",
        place: "Vetralla, near Viterbo",
        at: [12.06, 42.32],
        view: { at: [8, 45.5], k: 3.2 },
        caption: "News of Edessa reaches the West. Pope Eugenius III calls a new crusade, addressed to King Louis VII and the knights of France.",
        body: [
          "Envoys from the East brought the news to Pope Eugenius III, who was living outside Rome after its citizens drove him out. On 1 December 1145 he issued a bull, known from its first words as Quantum praedecessores, \"How much our predecessors\".",
          "It recalled the First Crusade and called on the French to defend what their fathers had won. Crusaders' wives, children and property would be under the Church's protection. Interest on their debts was suspended, and they could pledge their lands to raise money. They should go plainly, without fine clothes, hunting dogs or hawks.",
          "At Christmas, at Bourges, King Louis VII told his barons he meant to go. They were cool. The pope reissued the bull on 1 March 1146 and asked Bernard of Clairvaux to preach it.",
        ],
        quotes: [
          {
            text: "Whoever shall devoutly begin and complete so holy a journey, or shall die on it, shall obtain absolution for all his sins which he has confessed with a contrite and humble heart.",
            source: "Eugenius III, Quantum praedecessores (abridged)",
          },
        ],
        myth: {
          myth: "A crusade vow let a knight buy forgiveness, or sin freely.",
          fact: "The bull offered remission only for sins confessed with a contrite heart. The crusade was a penance, taken on by a solemn vow, and breaking the vow was itself a grave sin.",
        },
        figures: ["eugenius", "louis", "bernard"],
      },
      {
        id: "second-vezelay",
        moment: "vezelay1146",
        date: "31 March 1146",
        year: 1146,
        mapYear: 1146.25,
        title: "Vézelay",
        place: "Vézelay, Burgundy",
        at: [3.745, 47.466],
        view: { at: [3.745, 47.466], k: 10 },
        caption: "On Easter Sunday Bernard preaches from a wooden platform in a field below Vézelay. The crowd shouts for crosses, and when they run out he tears up his own habit.",
        body: [
          "The crowd at Vézelay was too big for the abbey church, so a wooden platform was built in a field below the hill. Bernard climbed it with King Louis, who already wore a cross the pope had sent him.",
          "Bernard read the pope's letter and preached. The people cried out for crosses. Many great lords took the cross that day, and so did Queen Eleanor.",
          "Odo of Deuil, a monk of Saint-Denis who would ride east as the king's chaplain, recorded what happened when the crosses ran out.",
        ],
        quotes: [
          {
            text: "Since the packet of crosses which had been prepared beforehand was exhausted, he was forced to tear his clothes into crosses and sow them.",
            source: "Odo of Deuil, De profectione Ludovici VII in Orientem, book 1",
          },
          {
            text: "I opened my mouth; I spoke; and at once the crusaders have multiplied to infinity. Villages and towns are now deserted. You will scarcely find one man for every seven women.",
            source: "Bernard of Clairvaux, letter to Eugenius III (abridged)",
          },
        ],
        myth: {
          myth: "Eleanor rode out to the crusade dressed as an Amazon, at the head of a troop of armed ladies.",
          fact: "No eyewitness says so. A Byzantine writer described some armoured women riding with the German army. The tale of Eleanor's Amazons grew up much later.",
        },
        today: "Vézelay, France. The Romanesque abbey church of Sainte-Madeleine still crowns the hill.",
        figures: ["bernard", "louis", "eleanor", "odo"],
      },
      {
        id: "second-germany",
        date: "Autumn 1146 – spring 1147",
        year: 1146,
        mapYear: 1147,
        title: "Bernard in Germany",
        place: "Speyer, the Rhineland",
        at: [8.43, 49.32],
        view: { at: [10.5, 51], k: 4.4 },
        caption: "In the Rhineland a monk named Radulf stirs up attacks on Jews. Bernard stops him. At Speyer, at Christmas 1146, Bernard persuades King Conrad III to take the cross.",
        body: [
          "A Cistercian monk named Radulf went preaching through the Rhineland without leave and urged attacks on the Jews. Bernard came in person, silenced him and sent him back to his monastery.",
          "Bernard preached through the Rhineland that winter, often through interpreters. Conrad III, King of Germany, had troubles at home and was reluctant. At Speyer, on 27 December 1146, after a sermon from Bernard aimed straight at him, he took the cross. His nephew Frederick, later called Barbarossa, did too.",
          "In March 1147 the Saxon lords asked to fight the pagan Wends on their own eastern border instead. Bernard and the pope agreed. The Wendish Crusade that summer achieved little. Eugenius also blessed war against the Moors in Spain. The crusade now ran from the Baltic to the Tagus.",
        ],
        quotes: [
          {
            text: "The Jews are not to be persecuted, killed, or even put to flight.",
            source: "Bernard of Clairvaux, letter to the people of England and Germany",
          },
        ],
        today: "Speyer, Germany. The great cathedral where Conrad took the cross still stands.",
        figures: ["bernard", "conrad3", "eugenius"],
      },
      {
        id: "second-march",
        date: "May – October 1147",
        year: 1147,
        mapYear: 1147.7,
        title: "Two kings on the road",
        place: "Regensburg to Constantinople",
        at: [28.98, 41.01],
        view: { at: [18, 46], k: 2.6 },
        routes: { conrad: 8, louis: 11 },
        caption: "Conrad leaves Regensburg in May, Louis leaves Saint-Denis in June. Both armies follow the Danube to Constantinople, where Emperor Manuel hurries them across into Asia.",
        body: [
          "Conrad set out from Regensburg in May 1147. On 11 June Louis took the oriflamme, the sacred banner of Saint-Denis, from the altar of the abbey with Pope Eugenius present, and left Abbot Suger to govern France. Both armies marched down the Danube through Hungary and into Byzantine lands.",
          "The Germans went first, and fought with Byzantine troops over food in Thrace. In September a flash flood swept through their camp. Conrad reached Constantinople that month and crossed to Asia without waiting for the French.",
          "Louis arrived on 4 October. Emperor Manuel I received him with honour. Some French lords, angry that Manuel had made a truce with the Turks, urged an attack on the city. Louis refused.",
        ],
        quotes: [
          {
            text: "Constantinople, the glory of the Greeks, rich in renown and richer still in possessions, is laid out in a triangular shape like a ship's sail.",
            source: "Odo of Deuil, De profectione Ludovici VII in Orientem, book 4",
          },
        ],
        figures: ["conrad3", "louis", "eleanor", "manuel", "odo"],
      },
      {
        id: "second-lisbon",
        camp: "cru",
        battle: "lisbon",
        date: "May – 24 October 1147",
        year: 1147,
        mapYear: 1147.8,
        title: "The siege of Lisbon",
        place: "Lisbon, Portugal",
        at: [-9.135, 38.71],
        view: { at: [-7.6, 44.2], k: 3.8 },
        routes: { lisbon: 12 },
        days: { from: "1147-07-01", to: "1147-10-24", label: "of the siege" },
        caption: "A fleet of English, Norman, Flemish and Rhineland crusaders sails from Dartmouth for the Holy Land. At Porto they are asked to help King Afonso take Lisbon, and they stay.",
        body: [
          "In May 1147 a fleet of over 150 ships left Dartmouth. Its crusaders came from England, Normandy, Flanders and the Rhineland, and they bound themselves by a sworn compact to keep the peace among themselves. At Porto, the bishop preached to them on behalf of Afonso Henriques, King of Portugal, and asked them to help take Lisbon from the Moors.",
          "They reached the Tagus at the end of June and agreed terms: the plunder to the crusaders, the city to the king. Some wanted to sail on, but most were persuaded to stay. The siege lasted four months. The Flemings and Germans brought down part of the wall with a mine. The English and Normans pushed a siege tower to the wall. On 24 October the starving city surrendered.",
          "Some of the Flemish and Rhineland crusaders broke the terms and sacked the city. The old Christian bishop of Lisbon was killed. An Englishman, Gilbert of Hastings, became its new bishop. Many of the crusaders sailed on to the Holy Land the next spring.",
        ],
        today: "Lisbon, Portugal. The castle of São Jorge stands on the hill where the Moorish citadel held out.",
        sources: [{ title: "De expugnatione Lyxbonensi, an eyewitness account by an Anglo-Norman priest" }],
        figures: ["eugenius"],
      },
      {
        id: "second-dorylaeum",
        fight: true,
        date: "October – November 1147",
        year: 1147,
        mapYear: 1147.85,
        title: "Conrad's army destroyed",
        place: "Near Dorylaeum",
        at: [30.52, 39.78],
        view: { at: [30.2, 40.0], k: 6 },
        routes: { conrad: 14, louis: 13 },
        caption: "Conrad strikes inland from Nicaea with too little food. Near Dorylaeum the Turks wear his army down, and the retreat becomes a slaughter.",
        body: [
          "Conrad set out from Nicaea in mid-October on the old road across Anatolia, where the First Crusade had won its great battle fifty years before. His army carried food for only about eight days, and the country was dry.",
          "Near Dorylaeum, about 25 October, the Turks began to attack the column from all sides. Men and horses weakened from hunger and thirst. Conrad's lords decided to go back. The retreat to Nicaea became a rout, and most of the army was lost. Conrad himself was wounded by arrows.",
          "A second German column, which had taken a coastal road, was also cut to pieces. Conrad met Louis near Lopadion and joined him for a time. Then he fell ill at Ephesus and went back to Constantinople, where Manuel nursed him himself.",
        ],
        today: "Eskişehir, Turkey.",
        figures: ["conrad3", "louis", "manuel"],
      },
      {
        id: "second-cadmus",
        fight: true,
        battle: "cadmus",
        date: "January 1148",
        year: 1148,
        mapYear: 1148.05,
        title: "Mount Cadmus",
        place: "Mount Cadmus, near Laodicea",
        at: [29.27, 37.70],
        view: { at: [29.0, 37.9], k: 7 },
        routes: { louis: 21 },
        caption: "In a mountain pass the French vanguard goes on too far. The Turks fall on the stranded column, and King Louis survives only by climbing a rock.",
        body: [
          "Louis took the longer road down the Aegean coast, through Pergamum, Smyrna and Ephesus, where the army kept Christmas. In early January it beat a Turkish force at a crossing of the Meander and pushed on past Laodicea.",
          "At Mount Cadmus the king ordered the vanguard to camp on the heights. Its commander, Geoffrey of Rancon, went over the summit and camped beyond. The Turks seized the ground between and fell on the baggage and the foot. Louis rode up with his guard, which was cut down around him. Odo of Deuil says he escaped by scrambling up a rock, holding on to tree roots, and fought off his attackers until dark.",
          "The army put itself under the Templars who rode with it. Their master, Everard des Barres, divided it into companies of fifty, each under a brother of the Temple. In that order it reached Attalia.",
        ],
        myth: {
          myth: "Eleanor's baggage train and her ladies held up the march and caused the disaster.",
          fact: "Odo of Deuil, who was there, blames Geoffrey of Rancon, who commanded the vanguard. Geoffrey was Eleanor's vassal, but Odo does not blame the queen.",
        },
        today: "Honaz Dağı, above Denizli, Turkey.",
        figures: ["louis", "odo", "eleanor"],
      },
      {
        id: "second-antioch",
        date: "January – May 1148",
        year: 1148,
        mapYear: 1148.3,
        title: "Attalia and Antioch",
        place: "Attalia and Antioch",
        at: [36.16, 36.20],
        view: { at: [33.4, 36.2], k: 4.2 },
        routes: { louis: 22, louisSea: 7, conradSea: 12 },
        caption: "At Attalia there are too few ships. Louis sails for Antioch with his knights and leaves the foot behind. At Antioch his wife's uncle asks for help against Aleppo, and Louis says no.",
        body: [
          "Attalia was a Byzantine port. Food was scarce and dear, and there were not enough ships for everyone. Louis sailed with his lords and knights. He paid the Greeks to escort the foot soldiers and pilgrims overland, but they were left to the Turks. Many died. Odo says some found more pity among the Turks than among the Greeks, and went over to them.",
          "Louis landed at St Symeon, the port of Antioch, on 19 March 1148. Prince Raymond, Eleanor's uncle, welcomed him and urged an attack on Aleppo, Nur ad-Din's city. Louis refused. He had vowed to go to Jerusalem.",
          "Eleanor took her uncle's side and spoke of ending the marriage. Louis took her away from Antioch by night. William of Tyre and John of Salisbury both report the rumours that followed. Meanwhile Conrad sailed from Constantinople and landed at Acre in April.",
        ],
        figures: ["louis", "eleanor", "raymondpoitiers", "conrad3", "odo"],
      },
      {
        id: "second-damascus",
        camp: "cru",
        fight: true,
        battle: "damascus",
        date: "24 June – 28 July 1148",
        year: 1148,
        mapYear: 1148.55,
        title: "The siege of Damascus",
        place: "Damascus",
        at: [36.30, 33.51],
        view: { at: [35.8, 33.2], k: 7.5 },
        routes: { louisSea: 13, damascus: 8 },
        days: { from: "1148-07-24", to: "1148-07-28", label: "of the siege" },
        caption: "Three kings decide to take Damascus. They fight through the orchards to the walls, then move to the dry eastern side. Four days after they arrived, they give up.",
        body: [
          "On 24 June 1148 a great council met at Palmarea near Acre: Conrad, Louis, the young Baldwin III, Queen Melisende, the patriarch, the masters of the Temple and the Hospital, and the barons of the kingdom. They chose to attack Damascus, the richest city in reach, though its ruler had been Jerusalem's ally against Zengi.",
          "The army gathered at Tiberias and marched by Banias round Mount Hermon. On 24 July it came up through the orchards west of Damascus, a maze of mud walls and lanes where defenders lay in wait. The Germans fought their way on foot to the river, and the army camped among the trees.",
          "Then the leaders moved the army round to the east side, where the walls were said to be weaker. There was no water there, and the orchards behind them filled with the enemy again. With Nur ad-Din's army on its way, the crusaders retreated on 28 July, harassed all the way back to Galilee.",
        ],
        myth: {
          myth: "The barons of Jerusalem were bribed by the Damascenes to wreck the siege.",
          fact: "William of Tyre heard that story and recorded it, but says he could never find out the truth. Quarrels over who would rule Damascus, and the move to the waterless side, explain the failure well enough.",
        },
        today: "Damascus, Syria. The Ghouta orchards that stopped the crusade still ring the old city in places.",
        figures: ["conrad3", "louis", "baldwin3", "melisende"],
      },
      {
        id: "second-epilogue",
        date: "1148–1154",
        year: 1149,
        mapYear: 1149.5,
        title: "After the failure",
        place: "The Latin East",
        at: [36.30, 33.51],
        view: { at: [34, 35.5], k: 3 },
        caption: "The kings go home with nothing won. Nur ad-Din kills Raymond of Antioch, takes the last of Edessa, and in 1154 takes Damascus. Syria is united against the Franks.",
        body: [
          "Conrad sailed home in September 1148. Louis kept Easter in Jerusalem in 1149 and then left. He and Eleanor travelled home on separate ships, and their marriage was annulled in 1152. Eleanor married Henry of Anjou, the future King of England.",
          "In the West the failure was felt as a judgment. Bernard defended his preaching and said the crusaders' own sins had brought the disaster on them. In the East, Nur ad-Din killed Raymond of Antioch at Inab in June 1149. Joscelin II was captured the next year, and the last of his county was sold to the Byzantines. In 1154 Nur ad-Din took Damascus, and Muslim Syria was one.",
          "The kingdom still had victories ahead. Baldwin III took Ascalon in 1153. But the Franks now faced a united enemy. Nur ad-Din's general Shirkuh and his nephew Saladin would carry that unity into Egypt, and in 1187 Saladin would take Jerusalem.",
        ],
        figures: ["nuraddin", "bernard", "louis", "eleanor", "baldwin3", "melisende"],
      },
    ],

    battles: {
      templars: {
        id: "templars",
        title: "The Poor Knights of the Temple",
        date: "c. 1120",
        place: "The Temple Mount, Jerusalem",
        terrain: [
          { type: "floor", poly: [[28, 8], [86, 6], [88, 58], [30, 60]] },
          { type: "walls", path: [[87, 1], [88, 30], [89, 61]] },
          { type: "hills", at: [97, 30], w: 8, h: 30, label: "Mount of Olives", labelAt: [95, 3] },
          { type: "landmark", kind: "goldendome", at: [58, 22], size: 8, label: "Temple of the Lord", labelAt: [58, 30] },
          { type: "landmark", kind: "basilica", at: [60, 50], size: 7, label: "Temple of Solomon (al-Aqsa)", labelAt: [60, 58] },
          { type: "dais", at: [40, 47], w: 14, h: 4 },
          { type: "road", path: [[0, 32], [28, 32]] },
          { type: "label", text: "Jerusalem", at: [12, 10] },
          { type: "label", text: "to Jaffa and the coast", at: [10, 38] },
        ],
        units: {
          king: { label: "King Baldwin II", side: "cru", kind: "king", rows: 1, cols: 1, color: "#5a3d7a", leader: true, at: [37, 45] },
          patr: { label: "Patriarch Warmund", side: "cru", kind: "bishop", rows: 1, cols: 1, at: [44, 45] },
          pilg: { label: "Pilgrims", side: "cru", kind: "pilgrim", rows: 2, cols: 5, start: [-8, 30] },
          hugh: { label: "Hugh of Payns", side: "cru", kind: "knight", rows: 1, cols: 1, color: C.plain, leader: true, start: [-6, 33] },
          comp: { label: "Godfrey of Saint-Omer and companions", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.plain, start: [-10, 33] },
        },
        phases: [
          {
            caption: "Jerusalem, around 1120. Pilgrims come up from the coast in their thousands, but the roads are not safe. At Easter 1119 a band of pilgrims was massacred on the way to the Jordan.",
            set: { pilg: { at: [22, 24], state: "march" }, king: { state: "hold" }, patr: { state: "hold" } },
            dur: 6400,
          },
          {
            caption: "Hugh of Payns, a knight from Champagne, comes to the Temple Mount with Godfrey of Saint-Omer and a few companions. They stand before King Baldwin II and Patriarch Warmund.",
            set: { hugh: { at: [40, 38] }, comp: { at: [40, 31] }, pilg: { at: [18, 20], state: "hold" } },
          },
          {
            caption: "They vow poverty, chastity and obedience, like canons, and take on one duty: to keep the roads safe for pilgrims.",
            set: { hugh: { at: [40, 39], state: "hold" }, comp: { state: "hold" } },
          },
          {
            caption: "The king gives them a home in his palace in the al-Aqsa mosque, which the Franks call the Temple of Solomon. From it they take their name.",
            set: { hugh: { at: [56, 42], state: "march", facing: 1 }, comp: { at: [56, 35], state: "march", facing: 1 } },
          },
          {
            caption: "For nine years, says William of Tyre, they were only nine. They ride out to guard the pilgrims on the road to Jaffa and the Jordan.",
            set: {
              pilg: { at: [-6, 30], state: "march", facing: -1 },
              hugh: { at: [8, 34], state: "march", facing: -1 }, comp: { at: [14, 30], state: "march", facing: -1 },
            },
            dur: 6400,
          },
        ],
      },

      edessa: {
        id: "edessa",
        title: "The fall of Edessa",
        date: "28 November – 24 December 1144",
        place: "Edessa",
        terrain: [
          { type: "hills", at: [28, 56], w: 34, h: 10, label: "Citadel hill", labelAt: [12, 59] },
          { type: "walls", path: [[20, 12], [50, 8], [76, 14], [80, 34], [72, 48], [42, 50], [22, 46], [16, 30]], closed: true },
          { type: "landmark", kind: "citadel", at: [30, 45], size: 6, label: "Citadel", labelAt: [30, 51.5] },
          { type: "landmark", kind: "cathedral", at: [56, 28], size: 5, label: "Cathedral", labelAt: [56, 33.5] },
          { type: "tents", at: [86, 5], n: 8, r: 8, color: C.zengi, label: "Zengi's camp", labelAt: [86, 13] },
          { type: "tents", at: [90, 50], n: 5, r: 6, color: C.zengi },
          { type: "road", path: [[0, 30], [16, 30]] },
          { type: "label", text: "Edessa", at: [44, 38] },
          { type: "label", text: "to Turbessel and the Euphrates", at: [10, 25] },
        ],
        units: {
          zengi: { label: "Zengi", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.zengi, leader: true, at: [88, 28] },
          zfoot: { label: "Zengi's infantry", side: "foe", kind: "foot", rows: 2, cols: 5, color: C.zengi, at: [34, 3] },
          treb: { label: "Siege engines", side: "foe", kind: "trebuchet", rows: 1, cols: 2, color: C.zengi, at: [66, 3] },
          sap: { label: "Miners", side: "foe", kind: "foot", rows: 1, cols: 3, color: C.zengi, start: [50, 3] },
          def: { label: "Townsmen on the walls", side: "cru", kind: "foot", rows: 1, cols: 6, color: C.edessa, at: [34, 13] },
          clergy: { label: "Priests and monks", side: "cru", kind: "priest", rows: 1, cols: 3, at: [64, 15] },
          hugh: { label: "Archbishop Hugh", side: "cru", kind: "bishop", rows: 1, cols: 1, leader: true, at: [46, 22] },
          town: { label: "Townspeople", side: "cru", kind: "crowd", rows: 2, cols: 5, at: [54, 40] },
        },
        phases: [
          {
            caption: "28 November 1144. Zengi arrives before Edessa with a large army. Count Joscelin is away at Turbessel, beyond the Euphrates, and the defence falls to Archbishop Hugh and the townsmen.",
            set: { zengi: { at: [86, 26], state: "hold", facing: -1 }, zfoot: { state: "hold" }, def: { state: "hold" }, town: { state: "hold" }, hugh: { state: "hold" } },
            dur: 6400,
          },
          {
            caption: "Zengi's engines batter the walls day and night. His miners begin a tunnel beneath the north wall and prop it with timber as they dig.",
            set: { treb: { state: "fight" }, sap: { at: [48, 6], state: "fight" } },
            fx: [{ type: "stones", from: "treb", to: "def", rate: 4 }, { type: "arrows", from: "zfoot", to: "def", rate: 7 }],
          },
          {
            caption: "Everyone who can stand fights on the walls: Franks, Armenians and Syrians, with priests and monks among them. Messengers ride for Jerusalem and Antioch.",
            set: { def: { state: "fight" }, clergy: { state: "fight" } },
            fx: [{ type: "arrows", from: "def", to: "zfoot", rate: 6 }, { type: "arrows", from: "zfoot", to: "def", rate: 8 }, { type: "stones", from: "treb", to: "clergy", rate: 3 }],
          },
          {
            caption: "24 December. The miners fire the timber props. The tunnel caves in, and a long stretch of the north wall comes down with it.",
            set: { sap: { state: "hidden" } },
            fx: [{ type: "fire", at: [47, 9], r: 7 }, { type: "stones", from: "treb", to: "def", rate: 5 }],
          },
          {
            caption: "Zengi's men storm the breach. Townspeople run for the citadel, and many are crushed in the crowd at its gate. Archbishop Hugh is among the dead.",
            set: {
              zfoot: { at: [46, 22], state: "fight" }, zengi: { at: [66, 26], state: "fight", facing: -1 },
              def: { at: [24, 40], state: "flee", facing: -1 }, hugh: { at: [30, 42], state: "flee", facing: -1 },
              town: { at: [32, 44], state: "flee", facing: -1 }, clergy: { at: [70, 40], state: "flee" },
            },
            fx: [{ type: "clash", a: "zfoot", b: "def" }, { type: "fire", at: [47, 9], r: 5 }],
          },
          {
            caption: "The citadel surrenders two days later. Zengi puts the Franks to death and spares the native Christians. The first crusader state has lost its capital.",
            set: { zengi: { at: [46, 30], state: "hold" }, zfoot: { at: [52, 38], state: "hold" }, treb: { state: "hold" } },
          },
        ],
      },

      vezelay1146: {
        id: "vezelay1146",
        title: "Bernard preaches at Vézelay",
        date: "31 March 1146",
        place: "Below the hill of Vézelay",
        terrain: [
          { type: "hills", at: [82, 10], w: 36, h: 14, label: "Hill of Vézelay", labelAt: [66, 3] },
          { type: "landmark", kind: "basilica", at: [84, 8], size: 7, label: "Abbey of Sainte-Madeleine", labelAt: [84, 17] },
          { type: "trees", at: [12, 10], r: 8, n: 10 },
          { type: "trees", at: [90, 52], r: 6, n: 7 },
          { type: "road", path: [[100, 22], [72, 24], [50, 30], [30, 40], [0, 46]] },
          { type: "dais", at: [44, 20], w: 16, h: 4 },
          { type: "label", text: "Field below Vézelay", at: [20, 58] },
        ],
        units: {
          bern: { label: "Bernard of Clairvaux", side: "cru", kind: "priest", rows: 1, cols: 1, leader: true, start: [72, 22] },
          louis: { label: "King Louis VII", side: "cru", kind: "king", rows: 1, cols: 1, color: C.louis, leader: true, start: [74, 25] },
          bish: { label: "Bishops of France", side: "cru", kind: "bishop", rows: 1, cols: 2, start: [72, 27] },
          lords: { label: "Barons of France", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.louis, at: [66, 38] },
          crowd1: { label: "Knights, townsfolk and peasants", side: "cru", kind: "crowd", rows: 3, cols: 6, at: [44, 42] },
          crowd2: { label: "Still arriving", side: "cru", kind: "crowd", rows: 2, cols: 5, start: [-8, 47] },
        },
        phases: [
          {
            caption: "Easter Sunday, 31 March 1146. So many people come to Vézelay that the abbey church cannot hold them. They gather in a field below the hill, where a wooden platform has been built.",
            set: { crowd1: { state: "hold" }, lords: { state: "hold", facing: -1 }, crowd2: { at: [20, 47] } },
            dur: 6400,
          },
          {
            caption: "Bernard of Clairvaux climbs the platform with King Louis VII. The king already wears a cross sent to him by Pope Eugenius.",
            set: { bern: { at: [42, 18], state: "hold", facing: -1 }, louis: { at: [50, 19], state: "hold", facing: -1 }, bish: { at: [34, 20], state: "hold", facing: 1 } },
          },
          {
            caption: "Bernard reads the pope's letter and preaches. The crowd begins to shout for crosses.",
            set: { crowd1: { at: [44, 33], state: "march" }, crowd2: { at: [28, 40], state: "march", facing: 1 } },
          },
          {
            caption: "The great lords come forward to take the cross, and Queen Eleanor takes it with them.",
            set: { lords: { at: [58, 28], state: "march", facing: -1 }, crowd1: { state: "hold" }, crowd2: { state: "hold" } },
          },
          {
            caption: "The crosses run out. Odo of Deuil says Bernard tore up his own clothes to make more, and went on giving them out until night.",
            set: { crowd1: { at: [44, 29] }, crowd2: { at: [32, 34], state: "march" }, lords: { state: "hold" } },
            dur: 6400,
          },
        ],
      },

      lisbon: {
        id: "lisbon",
        title: "The siege of Lisbon",
        date: "1 July – 24 October 1147",
        place: "Lisbon",
        terrain: [
          { type: "sea", poly: [[0, 50], [100, 48], [100, 62], [0, 62]], label: "River Tagus", labelAt: [86, 57] },
          { type: "hills", at: [54, 16], w: 32, h: 12 },
          { type: "walls", path: [[34, 48], [40, 22], [52, 10], [62, 12], [70, 24], [72, 48]], closed: true },
          { type: "landmark", kind: "citadel", at: [56, 14], size: 6, label: "Citadel", labelAt: [56, 6] },
          { type: "label", text: "Lisbon", at: [54, 32] },
          { type: "tents", at: [16, 32], n: 8, r: 8, color: C.lisbon, label: "English and Normans", labelAt: [16, 22] },
          { type: "tents", at: [88, 30], n: 8, r: 8, color: C.flemish, label: "Flemings and Germans", labelAt: [88, 20] },
          { type: "tents", at: [26, 6], n: 5, r: 6, color: C.portugal, label: "King Afonso", labelAt: [26, 13] },
        ],
        units: {
          ships: { label: "The crusader fleet", side: "cru", kind: "ship", rows: 1, cols: 5, color: C.lisbon, at: [20, 56] },
          afonso: { label: "King Afonso Henriques", side: "cru", kind: "king", rows: 1, cols: 1, color: C.portugal, leader: true, start: [24, -4] },
          eng: { label: "English and Normans", side: "cru", kind: "foot", rows: 2, cols: 5, color: C.lisbon, start: [14, 54] },
          flem: { label: "Flemings and Rhinelanders", side: "cru", kind: "foot", rows: 2, cols: 5, color: C.flemish, start: [86, 54] },
          tower: { label: "Siege tower", side: "cru", kind: "siegetower", color: C.lisbon, start: [22, 44] },
          defw: { label: "Defenders", side: "foe", kind: "archer", rows: 1, cols: 4, color: C.moors, at: [37, 36] },
          defe: { label: "Defenders", side: "foe", kind: "archer", rows: 1, cols: 4, color: C.moors, at: [70, 36] },
          gar: { label: "Garrison", side: "foe", kind: "foot", rows: 2, cols: 4, color: C.moors, at: [54, 26] },
        },
        phases: [
          {
            caption: "28 June 1147. The crusader fleet sails up the Tagus to Lisbon. King Afonso Henriques of Portugal meets them, and they agree terms: the plunder to the crusaders, the city to the king.",
            set: { ships: { at: [52, 55] }, afonso: { at: [26, 8], state: "hold" }, defw: { state: "hold" }, defe: { state: "hold" }, gar: { state: "hold" } },
            dur: 6600,
          },
          {
            caption: "1 July. The crusaders land, take the suburbs, and pitch camp on both sides of the city. The siege begins.",
            set: { eng: { at: [22, 40] }, flem: { at: [84, 40], facing: -1 }, ships: { at: [52, 55], state: "hold" } },
            fx: [{ type: "arrows", from: "defw", to: "eng", rate: 6 }, { type: "arrows", from: "defe", to: "flem", rate: 6 }],
          },
          {
            caption: "All summer the attacks are beaten back and the engines burn. Inside the walls, food runs out.",
            set: { eng: { at: [26, 40], state: "fight" }, flem: { at: [80, 40], state: "fight", facing: -1 } },
            fx: [{ type: "arrows", from: "eng", to: "defw", rate: 6 }, { type: "arrows", from: "defw", to: "eng", rate: 6 }, { type: "arrows", from: "flem", to: "defe", rate: 6 }],
          },
          {
            caption: "October. The Flemings and Germans dig a mine under the eastern wall and fire it. The wall falls, but the garrison holds the breach.",
            set: { flem: { at: [75, 40], state: "fight", facing: -1 }, gar: { at: [66, 38], state: "fight", facing: 1 } },
            fx: [{ type: "fire", at: [71, 40], r: 6 }, { type: "clash", a: "flem", b: "gar" }],
          },
          {
            caption: "The English and Normans push their siege tower up to the wall by the river. Cut off by the tide for a time, it finally reaches the wall.",
            set: { tower: { at: [32, 42], state: "fight" }, eng: { at: [26, 44], state: "fight" }, gar: { at: [60, 34], state: "hold" }, flem: { state: "hold" } },
            fx: [{ type: "arrows", from: "defw", to: "tower", rate: 9 }, { type: "fire", unit: "tower", lift: 4, r: 3 }],
          },
          {
            caption: "With the tower's bridge ready to drop onto the wall, the starving defenders ask for terms. Lisbon surrenders on 24 October 1147.",
            set: { defw: { state: "hold" }, defe: { state: "hold" }, tower: { state: "hold" }, eng: { state: "hold" }, afonso: { at: [44, 20], state: "march" } },
          },
        ],
      },

      cadmus: {
        id: "cadmus",
        title: "Mount Cadmus",
        date: "January 1148",
        place: "Mount Cadmus, near Laodicea",
        terrain: [
          { type: "hills", at: [30, 8], w: 44, h: 14, label: "Mount Cadmus", labelAt: [14, 2] },
          { type: "hills", at: [74, 9], w: 36, h: 12 },
          { type: "hills", at: [50, 52], w: 40, h: 10 },
          { type: "hills", at: [14, 57], w: 26, h: 8 },
          { type: "hills", at: [86, 54], w: 28, h: 8 },
          { type: "road", path: [[0, 44], [18, 40], [34, 34], [48, 28], [60, 24], [74, 26], [100, 30]] },
          { type: "trees", at: [42, 42], r: 5, n: 6 },
          { type: "tents", at: [88, 34], n: 6, r: 6, color: C.aquitaine },
          { type: "label", text: "Summit", at: [60, 19] },
          { type: "label", text: "from Laodicea", at: [8, 49] },
          { type: "label", text: "to Attalia", at: [93, 25] },
        ],
        units: {
          van: { label: "Vanguard: Geoffrey of Rancon", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.aquitaine, leader: true, at: [42, 31] },
          bag: { label: "Baggage and pilgrims", side: "cru", kind: "pilgrim", rows: 2, cols: 6, at: [26, 38] },
          foot: { label: "Foot soldiers", side: "cru", kind: "foot", rows: 2, cols: 4, color: C.louis, at: [15, 42] },
          louis: { label: "King Louis VII", side: "cru", kind: "king", rows: 1, cols: 1, color: C.louis, leader: true, at: [4, 45] },
          guard: { label: "The king's guard", side: "cru", kind: "knight", rows: 1, cols: 4, color: C.louis, at: [6, 50] },
          t1: { label: "Turkish horse archers", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.zengi, leader: true, start: [46, 8] },
          t2: { label: "Turkish horse archers", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.zengi, start: [46, 58] },
          tem: { label: "Templars under Everard des Barres", side: "cru", kind: "templar", rows: 2, cols: 3, color: C.templar, leader: true, start: [-8, 40] },
        },
        phases: [
          {
            caption: "January 1148. The French column climbs Mount Cadmus. The king has ordered the vanguard to halt on the heights and camp there, so the army can cross together.",
            set: { van: { at: [52, 26] }, bag: { at: [32, 35] }, foot: { at: [19, 40] }, louis: { at: [6, 44] }, guard: { at: [8, 49] } },
            dur: 6400,
          },
          {
            caption: "Geoffrey of Rancon, who leads the vanguard, reaches the heights early and goes on over the summit to camp beyond. The column stretches out, and the baggage crowds the narrow track.",
            set: { van: { at: [86, 28] }, bag: { at: [42, 31] }, foot: { at: [26, 37] } },
          },
          {
            caption: "The Turks seize the heights between the two halves of the army and fall on the baggage. Men and pack animals are driven over the edge.",
            set: { t1: { at: [46, 18], state: "fight", facing: 1 }, t2: { at: [46, 44], state: "fight", facing: -1 }, bag: { state: "hold" } },
            fx: [{ type: "arrows", from: "t1", to: "bag", rate: 10 }, { type: "arrows", from: "t2", to: "bag", rate: 10 }, { type: "arrows", from: "t2", to: "foot", rate: 6 }],
          },
          {
            caption: "The king rides up with his guard into the fight. His guard is cut down around him. Odo says Louis scrambled up a rock, holding on to tree roots, and fought off his attackers alone.",
            set: { louis: { at: [36, 39], state: "fight" }, guard: { at: [40, 42], state: "fight" }, t2: { at: [44, 45], state: "fight", facing: -1 } },
            fx: [{ type: "clash", a: "guard", b: "t2" }, { type: "arrows", from: "t1", to: "louis", rate: 7 }],
            dur: 6600,
          },
          {
            caption: "Night falls. The Turks draw off to plunder the baggage, and Louis finds his way in the dark to the vanguard's camp.",
            set: {
              guard: { state: "hidden" }, t1: { at: [40, 22], state: "hold" }, t2: { at: [38, 46], state: "hold" },
              louis: { at: [82, 32], state: "march" }, foot: { at: [74, 30], state: "march" }, bag: { at: [64, 26], state: "march" },
            },
          },
          {
            caption: "The army puts itself under the Templars. Their master, Everard des Barres, divides it into companies of fifty, and the march to Attalia goes on in order.",
            set: {
              tem: { at: [70, 30] }, t1: { at: [-10, 8], state: "flee", facing: -1 }, t2: { at: [-10, 58], state: "flee", facing: -1 },
              louis: { state: "hold" }, foot: { state: "hold" }, bag: { state: "hold" }, van: { state: "hold" },
            },
          },
        ],
      },

      damascus: {
        id: "damascus",
        title: "The siege of Damascus",
        date: "24–28 July 1148",
        place: "Damascus",
        terrain: [
          { type: "hills", at: [52, 5], w: 60, h: 10, label: "Mount Qasiyun", labelAt: [84, 3] },
          { type: "river", path: [[0, 20], [30, 18], [56, 19], [80, 17], [100, 20]], w: 2.4, label: "River Barada", labelAt: [14, 15] },
          { type: "trees", at: [20, 34], r: 12, n: 18, label: "Orchards", labelAt: [14, 50] },
          { type: "trees", at: [38, 28], r: 8, n: 10 },
          { type: "trees", at: [32, 46], r: 7, n: 8 },
          { type: "walls", path: [[56, 24], [78, 23], [82, 34], [76, 44], [58, 44], [52, 34]], closed: true },
          { type: "landmark", kind: "citadel", at: [57, 27], size: 5 },
          { type: "label", text: "Damascus", at: [68, 36] },
          { type: "desert", poly: [[86, 24], [100, 24], [100, 62], [80, 62], [80, 48]] },
          { type: "label", text: "Eastern plain, no water", at: [91, 52] },
          { type: "road", path: [[0, 58], [20, 56], [40, 50], [52, 40]] },
          { type: "label", text: "from Darayya", at: [10, 61] },
        ],
        units: {
          bal: { label: "Baldwin III and the barons", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.jerusalem, leader: true, start: [-6, 56] },
          tem: { label: "Templars", side: "cru", kind: "templar", rows: 1, cols: 3, color: C.templar, start: [-6, 52] },
          lou: { label: "Louis VII", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.louis, leader: true, start: [-10, 58] },
          con: { label: "Conrad III, on foot", side: "cru", kind: "foot", rows: 2, cols: 5, color: C.conrad, leader: true, start: [-14, 60] },
          amb: { label: "Ambushers in the orchards", side: "foe", kind: "foot", rows: 2, cols: 4, color: C.damascus, at: [26, 34] },
          arc: { label: "Defenders on the walls", side: "foe", kind: "archer", rows: 1, cols: 5, color: C.damascus, at: [56, 31] },
          amb2: { label: "Damascene militia", side: "foe", kind: "foot", rows: 2, cols: 4, color: C.damascus, start: [58, 40] },
          relief: { label: "Turkish reinforcements", side: "foe", kind: "horsearcher", rows: 2, cols: 5, color: C.zengi, start: [104, 10] },
        },
        phases: [
          {
            caption: "24 July 1148. The crusaders come up from the south-west. Baldwin III and the barons of Jerusalem lead, Louis follows, and Conrad brings up the rear. Before them lie the orchards of Damascus.",
            set: { bal: { at: [16, 50] }, tem: { at: [22, 47] }, lou: { at: [8, 55] }, con: { at: [2, 58] }, amb: { state: "hold" }, arc: { state: "hold" } },
            dur: 6600,
          },
          {
            caption: "The orchards are a maze of mud walls and narrow lanes. Defenders hide behind the walls and spear the riders through gaps as they pass.",
            set: { bal: { at: [20, 40], state: "fight" }, tem: { at: [26, 40], state: "fight" }, amb: { at: [24, 32], state: "fight", facing: -1 }, lou: { at: [12, 50] }, con: { at: [8, 54] } },
            fx: [{ type: "clash", a: "bal", b: "amb" }, { type: "clash", a: "tem", b: "amb" }],
          },
          {
            caption: "Conrad's Germans dismount and fight their way through on foot to the river. The defenders fall back behind the walls, and the army camps among the trees.",
            set: {
              con: { at: [36, 22], state: "fight", facing: 1 }, amb: { at: [60, 36], state: "flee", facing: 1 },
              bal: { at: [34, 38], state: "hold" }, tem: { at: [38, 34], state: "hold" }, lou: { at: [26, 30], state: "hold" },
            },
            fx: [{ type: "clash", a: "con", b: "amb" }, { type: "arrows", from: "arc", to: "con", rate: 6 }],
          },
          {
            caption: "Turkish reinforcements ride into the city from the north. The townsmen sally out, and the orchards fill with enemies again.",
            set: { relief: { at: [76, 14], state: "march", facing: -1 }, amb2: { at: [30, 44], state: "fight", facing: -1 }, con: { state: "hold" } },
            fx: [{ type: "clash", a: "amb2", b: "bal" }, { type: "arrows", from: "arc", to: "tem", rate: 6 }],
          },
          {
            caption: "27 July. The leaders move the whole army round to the east side, where the walls are said to be weaker. There is no water there and no shelter.",
            set: {
              bal: { at: [88, 40], state: "hold", facing: -1 }, tem: { at: [86, 34], state: "hold", facing: -1 },
              lou: { at: [90, 48], state: "hold", facing: -1 }, con: { at: [90, 30], state: "hold", facing: -1 },
              amb2: { at: [22, 36], state: "hold" }, relief: { at: [70, 30], state: "hold" },
            },
            dur: 6400,
          },
          {
            caption: "With Nur ad-Din's army on the way, the crusaders give up on 28 July. Horse archers harass them all the way back to Galilee.",
            set: {
              relief: { at: [84, 44], state: "fight", facing: 1 },
              bal: { at: [104, 58], state: "flee", facing: 1 }, tem: { at: [104, 54], state: "flee", facing: 1 },
              lou: { at: [106, 60], state: "flee", facing: 1 }, con: { at: [104, 50], state: "flee", facing: 1 },
            },
            fx: [{ type: "arrows", from: "relief", to: "con", rate: 8 }, { type: "arrows", from: "relief", to: "lou", rate: 8 }],
          },
        ],
      },
    },
  });
})();
