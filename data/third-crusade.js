// The Third Crusade, 1187–1192, with the road to it from 1174.
// Coordinates are [longitude, latitude].
// A chapter's `routes` sets how far each army has travelled by the end of that
// chapter, as a vertex index into the route's `points` (fractions are fine).
// Scene space for battles and moments is 100 × 62, north at the top.
(() => {
  // Colours shared by routes, portraits and scene units.
  const C = {
    jerusalem: "#5b3e8c",   // Guy and the army of the kingdom
    richard: "#b3261e",     // Richard and the Anglo-Norman host
    philip: "#2f4f9e",      // Philip II and the French
    german: "#b8892a",      // Barbarossa and the Germans
    flanders: "#2e6a4f",
    ibelin: "#c9a227",
    tripoli: "#a8301d",
    reynald: "#8a3324",
    kingdom: "#e8e0c8",     // Baldwin IV's white and gold
    ayyubid: "#c79a2e",     // Saladin's yellow banners
    turk: "#3f6b6b",
    foot: "#cbbf9f",
    plain: "#7a6a52",
  };

  window.CRUSADES = window.CRUSADES || [];
  window.CRUSADES.push({
    id: "third",
    order: 3,
    name: "The Third Crusade",
    years: "1187–1192",
    blurb: "Jerusalem falls to Saladin, and the kings of England, France and Germany march to win it back.",

    routes: {
      kingdom: {
        label: "Army of Jerusalem",
        color: C.jerusalem,
        until: "third-hattin",
        column: ["leader", "knight", "knight", "foot", "foot", "foot", "foot", "foot"],
        points: [
          [35.07, 32.92],  // 0 Acre
          [35.28, 32.75],  // 1 Springs of Sephoria
          [35.37, 32.78],  // 2 Turan
          [35.44, 32.80],  // 3 Horns of Hattin
        ],
      },
      guy: {
        king: true,
        label: "Guy of Lusignan",
        color: C.jerusalem,
        until: "third-guy-acre",
        column: ["leader", "knight", "knight", "foot", "foot", "foot"],
        points: [
          [35.20, 33.27],  // 0 Tyre
          [35.17, 33.17],  // 1 Scandelion
          [35.10, 33.05],  // 2 Casal Imbert
          [35.07, 32.92],  // 3 Acre
        ],
      },
      barbarossa: {
        king: true, device: "eagle", color2: "#d2a33a",
        label: "Barbarossa",
        color: C.german,
        until: "third-saleph",
        column: ["leader", "knight", "knight", "knight", "foot", "knight", "foot", "foot", "pilgrim", "foot"],
        points: [
          [12.10, 49.01],  // 0 Regensburg
          [13.43, 48.57],  // 1 Passau
          [16.37, 48.21],  // 2 Vienna
          [17.11, 48.15],  // 3 Pressburg
          [18.74, 47.79],  // 4 Esztergom
          [20.46, 44.82],  // 5 Belgrade
          [21.90, 43.32],  // 6 Niš
          [23.32, 42.70],  // 7 Sofia
          [24.75, 42.15],  // 8 Philippopolis
          [26.56, 41.68],  // 9 Adrianople
          [26.67, 40.41],  // 10 Gallipoli
          [26.70, 40.33],  // 11 Lampsacus (across the Dardanelles)
          [28.52, 38.35],  // 12 Philadelphia
          [29.11, 37.84],  // 13 Laodicea
          [32.48, 37.87],  // 14 Iconium
          [33.22, 37.18],  // 15 Larende
          [33.86, 36.47],  // 16 Saleph river
        ],
      },
      germans: {
        label: "Frederick of Swabia",
        color: C.german,
        until: "third-acre",
        column: ["leader", "knight", "foot", "foot", "pilgrim"],
        points: [
          [33.86, 36.47],  // 0 Saleph river
          [33.93, 36.38],  // 1 Seleucia
          [34.90, 36.92],  // 2 Tarsus
          [36.16, 36.20],  // 3 Antioch
          [35.78, 35.52],  // 4 Latakia
          [35.85, 34.44],  // 5 Tripoli
          [35.20, 33.27],  // 6 Tyre
          [35.07, 32.92],  // 7 Acre
        ],
      },
      philip: {
        king: true, device: "lilies", color2: "#d2a33a",
        label: "Philip II",
        color: C.philip,
        until: "third-messina",
        column: ["leader", "knight", "knight", "foot", "knight", "foot", "foot", "pilgrim"],
        points: [
          [3.75, 47.47],   // 0 Vézelay
          [4.83, 45.76],   // 1 Lyon
          [8.93, 44.40],   // 2 Genoa
          [9.60, 44.00],   // 3 Ligurian Sea
          [10.10, 43.55],  // 4 off Pisa
          [10.15, 43.10],  // 5 west of Piombino
          [10.00, 42.75],  // 6 west of Elba
          [10.60, 42.25],  // 7 Tuscan islands
          [11.60, 41.90],  // 8
          [12.00, 41.50],  // 9 off Ostia
          [12.90, 40.95],  // 10 off Circeo
          [13.80, 40.60],  // 11 south of Ischia
          [14.40, 40.50],  // 12 off Capri
          [15.40, 39.90],  // 13 off Calabria
          [15.85, 39.00],  // 14
          [15.68, 38.30],  // 15 Strait of Messina
          [15.55, 38.19],  // 16 Messina
        ],
      },
      philip_sea: {
        king: true, device: "lilies", color2: "#d2a33a",
        label: "Philip II",
        color: C.philip,
        until: "third-acre",
        column: ["leader", "knight", "knight", "foot", "foot"],
        points: [
          [15.55, 38.19],  // 0 Messina
          [15.68, 37.82],  // 1 south of the Strait
          [17.00, 37.40],  // 2 Ionian Sea
          [20.50, 36.30],  // 3
          [22.40, 35.95],  // 4 south of Cape Matapan
          [24.50, 35.85],  // 5 north of Crete
          [26.60, 35.98],  // 6
          [27.45, 35.97],  // 7 between Karpathos and Rhodes
          [28.00, 35.70],  // 8 south of Rhodes
          [29.50, 35.50],  // 9
          [32.00, 34.40],  // 10 south of Cyprus
          [34.20, 33.60],  // 11
          [35.07, 32.92],  // 12 Acre
        ],
      },
      richard: {
        king: true, device: "lions", color2: "#d2a33a",
        label: "Richard I",
        color: C.richard,
        until: "third-messina",
        column: ["leader", "knight", "knight", "knight", "foot", "archer", "foot", "foot", "pilgrim"],
        points: [
          [3.75, 47.47],   // 0 Vézelay
          [4.83, 45.76],   // 1 Lyon
          [4.81, 43.95],   // 2 Avignon
          [5.37, 43.30],   // 3 Marseille
          [6.00, 42.95],   // 4 off Cap Sicié
          [6.60, 42.95],   // 5 south of the Hyères islands
          [7.50, 43.50],   // 6 off Nice
          [8.50, 44.10],   // 7 off Savona
          [8.93, 44.36],   // 8 Genoa
          [9.60, 44.00],   // 9
          [10.10, 43.55],  // 10 off Pisa
          [10.15, 43.10],  // 11
          [10.00, 42.75],  // 12 west of Elba
          [10.60, 42.25],  // 13
          [11.60, 41.90],  // 14
          [12.00, 41.50],  // 15 off Ostia
          [12.90, 40.95],  // 16 off Circeo
          [13.80, 40.60],  // 17 south of Ischia
          [14.40, 40.50],  // 18
          [14.70, 40.55],  // 19 Gulf of Salerno
          [15.20, 39.85],  // 20 off Calabria
          [15.85, 39.00],  // 21
          [15.68, 38.30],  // 22 Strait of Messina
          [15.55, 38.19],  // 23 Messina
        ],
      },
      fleet: {
        king: true, device: "lions", color2: "#d2a33a",
        label: "Richard I",
        color: C.richard,
        until: "third-acre",
        column: ["leader", "knight", "knight", "foot", "archer", "foot", "pilgrim"],
        points: [
          [15.55, 38.19],  // 0 Messina
          [15.68, 37.82],  // 1 south of the Strait
          [17.00, 37.40],  // 2 Ionian Sea
          [20.50, 36.30],  // 3
          [22.40, 35.95],  // 4 south of Cape Matapan
          [23.80, 35.75],  // 5 off western Crete
          [25.13, 35.40],  // 6 Candia
          [26.60, 35.70],  // 7
          [27.45, 36.05],  // 8 between Karpathos and Rhodes
          [27.60, 36.30],  // 9 west of Rhodes
          [28.15, 36.55],  // 10
          [28.23, 36.45],  // 11 Rhodes
          [28.40, 36.30],  // 12
          [30.50, 35.60],  // 13
          [32.30, 34.55],  // 14 off Paphos
          [33.00, 34.45],  // 15 south of Akrotiri
          [33.15, 34.60],  // 16 Akrotiri Bay
          [33.04, 34.67],  // 17 Limassol
          [33.36, 35.17],  // 18 Nicosia
          [33.94, 35.12],  // 19 Famagusta
          [34.60, 35.00],  // 20
          [35.30, 34.40],  // 21 off Tripoli
          [35.30, 33.90],  // 22 off Beirut
          [35.10, 33.30],  // 23 off Tyre
          [35.07, 32.92],  // 24 Acre
        ],
      },
      march: {
        king: true, device: "lions", color2: "#d2a33a",
        label: "Richard I",
        color: C.richard,
        until: "third-second-approach",
        column: ["leader", "knight", "knight", "knight", "foot", "archer", "foot", "foot", "pilgrim"],
        points: [
          [35.07, 32.92],  // 0 Acre
          [34.99, 32.82],  // 1 Haifa
          [34.95, 32.70],  // 2 Athlit
          [34.89, 32.50],  // 3 Caesarea
          [34.82, 32.21],  // 4 Arsuf
          [34.75, 32.05],  // 5 Jaffa
          [34.87, 31.93],  // 6 Ramla
          [34.98, 31.84],  // 7 Latrun
          [35.03, 31.85],  // 8 Beit Nuba
        ],
      },
      retreat: {
        king: true, device: "lions", color2: "#d2a33a",
        label: "Richard I",
        color: C.richard,
        until: "third-second-approach",
        column: ["leader", "knight", "foot", "foot", "pilgrim"],
        points: [
          [35.03, 31.85],  // 0 Beit Nuba
          [34.98, 31.84],  // 1 Latrun
          [34.87, 31.93],  // 2 Ramla
          [34.74, 31.88],  // 3 Ibelin
          [34.55, 31.67],  // 4 Ascalon
        ],
      },
      galleys: {
        label: "Richard's galleys",
        color: C.richard,
        until: "third-jaffa",
        column: ["leader", "knight", "archer", "archer"],
        points: [
          [35.07, 32.92],  // 0 Acre
          [34.85, 32.85],  // 1 Bay of Haifa
          [34.80, 32.40],  // 2
          [34.68, 32.10],  // 3
          [34.75, 32.05],  // 4 Jaffa
        ],
      },
      home: {
        king: true, device: "lions", color2: "#d2a33a",
        label: "Richard I",
        color: C.richard,
        column: ["leader", "knight", "foot"],
        points: [
          [35.07, 32.92],  // 0 Acre
          [34.00, 33.50],  // 1
          [32.00, 34.30],  // 2 south of Cyprus
          [29.00, 35.60],  // 3
          [28.00, 35.70],  // 4 south of Rhodes
          [27.45, 35.97],  // 5
          [25.50, 35.90],  // 6 north of Crete
          [22.60, 35.95],  // 7
          [21.00, 36.60],  // 8 off Methoni
          [20.00, 38.00],  // 9 west of Kefalonia
          [19.55, 39.60],  // 10 Corfu
          [19.00, 40.60],  // 11
          [18.00, 41.70],  // 12
          [15.20, 43.00],  // 13 mid-Adriatic
          [13.60, 44.50],  // 14 off Istria
          [13.20, 45.55],  // 15 Gulf of Trieste
          [13.37, 45.77],  // 16 Aquileia (shipwreck)
          [14.41, 46.95],  // 17 Friesach
          [16.37, 48.21],  // 18 Vienna (captured)
          [15.52, 48.39],  // 19 Dürnstein
        ],
      },
    },

    regions: [
      { name: "Kingdom of England", at: [-1.6, 52.4] },
      { name: "Kingdom of France", at: [2.4, 47.2] },
      { name: "Holy Roman Empire", at: [10.6, 51.2] },
      { name: "Kingdom of Hungary", at: [19.6, 47.4] },
      { name: "Kingdom of Sicily", at: [15.4, 40.6] },
      { name: "Byzantine Empire", at: [23.6, 40.6] },
      { name: "Sultanate of Rûm", at: [32.6, 38.8] },
      { name: "Armenian Cilicia", at: [35.2, 37.5] },
      { name: "Ayyubid Sultanate", at: [37.8, 33.0] },
      { name: "Egypt", at: [30.6, 28.6] },
      { name: "Principality of Antioch", at: [36.5, 36.4], state: true },
      { name: "County of Tripoli", at: [36.2, 34.6], state: true },
      { name: "Kingdom of Jerusalem", at: [35.5, 31.9], until: "third-hattin", state: true },
      { name: "Kingdom of Jerusalem", at: [35.0, 32.6], from: "third-acre", state: true },
      { name: "Cyprus", at: [33.3, 35.05], until: "third-messina" },
      { name: "Latin Cyprus", at: [33.3, 35.05], from: "third-cyprus", state: true },
      { name: "Mediterranean Sea", at: [18.5, 35.2], sea: true },
      { name: "Tyrrhenian Sea", at: [12.0, 39.8], sea: true },
      { name: "Aegean Sea", at: [25.2, 38.6], sea: true },
      { name: "Black Sea", at: [34.5, 43.2], sea: true },
      { name: "Red Sea", at: [36.6, 25.0], sea: true },
      { name: "Sea of Galilee", at: [35.59, 32.83], sea: true },
    ],

    landmarks: [
      { name: "Jerusalem", at: [35.23, 31.78], icon: "jerusalem", major: true },
      { name: "Acre", at: [35.07, 32.92], icon: "walled", major: true, today: "Akko, Israel" },
      { name: "Tyre", at: [35.20, 33.27], icon: "walled", major: true, today: "Sour, Lebanon" },
      { name: "Constantinople", at: [28.98, 41.01], icon: "hagia", major: true, today: "Istanbul, Turkey" },
      { name: "Damascus", at: [36.30, 33.51], icon: "citadel", today: "Damascus, Syria" },
      { name: "Cairo", at: [31.26, 30.03], icon: "citadel", today: "Cairo, Egypt" },
      { name: "Jaffa", at: [34.75, 32.05], icon: "port", today: "Tel Aviv-Yafo, Israel" },
      { name: "Ascalon", at: [34.55, 31.67], icon: "walled", today: "Ashkelon, Israel" },
      { name: "Arsuf", at: [34.81, 32.20], icon: "walled", today: "Apollonia, Israel" },
      { name: "Caesarea", at: [34.89, 32.50], icon: "town", today: "Caesarea, Israel" },
      { name: "Ramla", at: [34.87, 31.93], icon: "town", today: "Ramla, Israel" },
      { name: "Montgisard", at: [34.92, 31.86], icon: "battle", today: "Tel Gezer, Israel" },
      { name: "Sephoria", at: [35.28, 32.75], icon: "town", today: "Tzippori, Israel" },
      { name: "Horns of Hattin", at: [35.44, 32.80], icon: "battle", today: "Kurnei Hittin, Israel" },
      { name: "Tiberias", at: [35.53, 32.79], icon: "town", today: "Tiberias, Israel" },
      { name: "Kerak", at: [35.70, 31.18], icon: "castle", today: "Al-Karak, Jordan" },
      { name: "Tripoli", at: [35.85, 34.44], icon: "town", today: "Tripoli, Lebanon" },
      { name: "Antioch", at: [36.16, 36.20], icon: "antioch", today: "Antakya, Turkey" },
      { name: "Seleucia", at: [33.93, 36.38], icon: "castle", today: "Silifke, Turkey" },
      { name: "Iconium", at: [32.48, 37.87], icon: "walled", today: "Konya, Turkey" },
      { name: "Adrianople", at: [26.56, 41.68], icon: "town", today: "Edirne, Turkey" },
      { name: "Limassol", at: [33.04, 34.67], icon: "port", today: "Limassol, Cyprus" },
      { name: "Rhodes", at: [28.23, 36.44], icon: "port", today: "Rhodes, Greece" },
      { name: "Messina", at: [15.55, 38.19], icon: "port", today: "Messina, Italy" },
      { name: "Genoa", at: [8.93, 44.41], icon: "port", today: "Genoa, Italy" },
      { name: "Marseille", at: [5.37, 43.30], icon: "port", today: "Marseille, France" },
      { name: "Ferrara", at: [11.62, 44.84], icon: "town", today: "Ferrara, Italy" },
      { name: "Vézelay", at: [3.75, 47.47], icon: "cathedral", today: "Vézelay, France" },
      { name: "Gisors", at: [1.78, 49.28], icon: "castle", today: "Gisors, France" },
      { name: "Regensburg", at: [12.10, 49.01], icon: "cathedral", today: "Regensburg, Germany" },
      { name: "Vienna", at: [16.37, 48.21], icon: "town", today: "Vienna, Austria" },
      { name: "Dürnstein", at: [15.52, 48.39], icon: "castle", today: "Dürnstein, Austria" },
    ],

    figures: {
      baldwin4: {
        name: "Baldwin IV",
        role: "King of Jerusalem, 1174–1185",
        life: "1161–1185",
        portrait: { kind: "king", color: C.kingdom, color2: "#d2a33a", beard: false, emblem: "cross" },
        bio: [
          "Son of King Amalric. His tutor, the historian William of Tyre, saw the first signs of leprosy when Baldwin was a boy of nine.",
          "Crowned at thirteen, he beat Saladin at Montgisard when he was sixteen. As the disease took his sight and his hands, he kept leading armies, carried in a litter.",
          "He died in the spring of 1185, aged twenty-three. His death left the kingdom to a child and a bitter quarrel over the crown.",
        ],
      },
      saladin: {
        name: "Saladin",
        role: "Sultan of Egypt and Syria, 1174–1193",
        life: "1137–1193",
        portrait: { kind: "sultan", color: C.ayyubid, color2: "#2f5f4f", beard: true, emblem: "none" },
        bio: [
          "Salah al-Din Yusuf ibn Ayyub, a Kurd born at Tikrit. He came to Egypt as an officer of Nur al-Din's army, became its vizier in 1169 and ended the Fatimid caliphate in 1171.",
          "Over the next fifteen years he joined Egypt, Damascus, Aleppo and Mosul under one rule, and preached holy war to recover Jerusalem. He won it at Hattin in 1187.",
          "The Christians who fought him respected him. Their chroniclers record his courtesy to captive queens and his gifts to his enemies, and later Western legend made him a model of chivalry. He died at Damascus in March 1193.",
        ],
      },
      sibylla: {
        name: "Sibylla",
        role: "Queen of Jerusalem, 1186–1190",
        life: "c. 1160–1190",
        portrait: { kind: "queen", color: "#7d2a52", color2: "#d2a33a" },
        bio: [
          "Elder sister of Baldwin IV. Her second husband was Guy of Lusignan, whom she married in 1180.",
          "When her son Baldwin V died in 1186, she was crowned in the Church of the Holy Sepulchre and then crowned Guy herself, against the wishes of half the barons.",
          "She followed Guy to the siege of Acre and died of disease in the camp in 1190, with her two young daughters.",
        ],
      },
      guy: {
        name: "Guy of Lusignan",
        role: "King of Jerusalem, 1186–1192; lord of Cyprus",
        life: "c. 1150–1194",
        portrait: { kind: "king", color: C.jerusalem, color2: "#e8e0c8", beard: true, emblem: "cross" },
        bio: [
          "A younger son of a family from Poitou. He came East and married Sibylla, the king's sister, in 1180.",
          "He led the army to disaster at Hattin and was captured. Freed in 1188, he began the siege of Acre with a small force, which was perhaps his finest act.",
          "He lost the crown to Conrad of Montferrat in 1192 and was given Cyprus instead. His family ruled the island until 1474.",
        ],
      },
      reynald: {
        name: "Reynald of Châtillon",
        role: "Lord of Oultrejordain",
        life: "c. 1125–1187",
        portrait: { kind: "knight", color: C.reynald, color2: "#d2a33a", beard: true, emblem: "none" },
        bio: [
          "A French knight who became Prince of Antioch by marriage in 1153. Captured in 1160, he spent sixteen years as a prisoner in Aleppo.",
          "Freed, he married the heiress of Oultrejordain and held Kerak and Montréal. He raided caravans, and in 1182–83 he sent ships into the Red Sea.",
          "Saladin swore to kill him for breaking the truce. After Hattin he did so with his own hand.",
        ],
      },
      raymond3: {
        name: "Raymond III of Tripoli",
        role: "Count of Tripoli; regent of Jerusalem",
        life: "1140–1187",
        portrait: { kind: "knight", color: C.tripoli, color2: "#d2a33a", beard: true, emblem: "cross" },
        bio: [
          "The most powerful baron of the Latin East, and lord of Galilee through his wife Eschiva. He was regent for both Baldwin IV and Baldwin V.",
          "He opposed Guy's crowning and made a separate truce with Saladin. Before Hattin he advised the king not to march.",
          "He escaped from Hattin and died at Tripoli a few months later.",
        ],
      },
      balian: {
        name: "Balian of Ibelin",
        role: "Lord of Ibelin and Nablus",
        life: "c. 1143–1193",
        portrait: { kind: "knight", color: C.ibelin, color2: C.tripoli, beard: true, emblem: "cross" },
        bio: [
          "A baron of the kingdom, married to Maria Komnene, widow of King Amalric.",
          "He fought his way out of Hattin, then defended Jerusalem in 1187 with almost no knights and won terms for its people.",
          "He served Richard as an envoy to Saladin in 1192 and helped negotiate the Treaty of Jaffa.",
        ],
      },
      ridefort: {
        name: "Gerard of Ridefort",
        role: "Master of the Templars, c. 1185–1189",
        life: "d. 1189",
        portrait: { kind: "templar", color: "#f4ead2", color2: "#a8301d", beard: true, emblem: "templar" },
        bio: [
          "A knight from Flanders who rose to lead the Templars. He was a bitter enemy of Raymond of Tripoli.",
          "He survived the disaster at Cresson in May 1187 and urged King Guy to march to Hattin. Saladin spared him there.",
          "He was killed at Acre on 4 October 1189.",
        ],
      },
      gregory8: {
        name: "Pope Gregory VIII",
        role: "Pope, October–December 1187",
        life: "c. 1105–1187",
        portrait: { kind: "pope", color: "#f4ead2", color2: "#d2a33a", emblem: "keys" },
        bio: [
          "Born Alberto di Morra at Benevento, he served the papacy for decades as a cardinal and chancellor.",
          "Elected when the news of Hattin reached the West, he issued Audita tremendi within days, calling Christendom to penance and to the cross.",
          "He died at Pisa after less than two months as pope, while trying to make peace between Pisa and Genoa so their fleets could sail.",
        ],
      },
      henry2: {
        name: "Henry II of England",
        role: "King of England, 1154–1189",
        life: "1133–1189",
        portrait: { kind: "king", color: C.richard, color2: "#d2a33a", beard: true, emblem: "lions" },
        bio: [
          "Ruler of England and of half of France, from Normandy to the Pyrenees. He was a grandson of Fulk of Anjou, King of Jerusalem.",
          "He took the cross at Gisors in January 1188 and levied the Saladin tithe, but war with Philip and his own sons kept him at home.",
          "He died at Chinon in July 1189, defeated by Richard and Philip.",
        ],
      },
      barbarossa: {
        name: "Frederick I Barbarossa",
        role: "Holy Roman Emperor, 1155–1190",
        life: "c. 1122–1190",
        portrait: { kind: "emperor", color: C.german, color2: "#1f1f1f", beard: true, emblem: "eagle" },
        bio: [
          "Duke of Swabia, then King of Germany from 1152 and emperor from 1155. As a young man he had marched on the Second Crusade.",
          "He took the cross at the 'Court of Christ' at Mainz in March 1188 and led the largest and best-ordered army of the crusade across Hungary, Byzantium and Anatolia.",
          "He drowned in the river Saleph in June 1190, before he reached the Holy Land.",
        ],
      },
      philip2: {
        name: "Philip II of France",
        role: "King of France, 1180–1223",
        life: "1165–1223",
        portrait: { kind: "king", color: C.philip, color2: "#d2a33a", beard: false, emblem: "lilies" },
        bio: [
          "Crowned at fifteen. He spent his reign building royal power against the great vassals, above all the Angevin kings of England.",
          "He took the cross at Gisors and reached Acre in April 1191. After its surrender he fell ill and sailed home.",
          "In France he turned against Richard's lands. By 1204 he had taken Normandy, and he is remembered as Philip Augustus.",
        ],
      },
      richard: {
        name: "Richard I of England",
        role: "King of England, 1189–1199",
        life: "1157–1199",
        portrait: { kind: "king", color: C.richard, color2: "#d2a33a", beard: true, emblem: "lions" },
        bio: [
          "Son of Henry II and Eleanor of Aquitaine. As Count of Poitou he took the cross in November 1187, the first prince north of the Alps to do so.",
          "He took Cyprus on the way, finished the siege of Acre and beat Saladin at Arsuf and Jaffa. Twice he came within twelve miles of Jerusalem and turned back.",
          "Captured on his way home, he was ransomed in 1194. He died of a crossbow wound at Châlus in 1199. Later ages called him the Lionheart.",
        ],
      },
      conrad_montferrat: {
        name: "Conrad of Montferrat",
        role: "Lord of Tyre; King-elect of Jerusalem",
        life: "c. 1146–1192",
        portrait: { kind: "knight", color: "#f4ead2", color2: C.tripoli, beard: true, emblem: "cross" },
        bio: [
          "An Italian marquis who had served the Byzantine emperor. He sailed into Tyre on 14 July 1187, days after Hattin, and saved it.",
          "He refused to hand Tyre to Guy, married Queen Isabella in 1190 and claimed the crown.",
          "Elected king in April 1192, he was murdered by two Assassins in the streets of Tyre before he could be crowned.",
        ],
      },
      henry_champagne: {
        name: "Henry of Champagne",
        role: "Count of Champagne; ruler of Jerusalem, 1192–1197",
        life: "1166–1197",
        portrait: { kind: "knight", color: "#2a5e88", color2: "#d2a33a", beard: false, emblem: "cross" },
        bio: [
          "A nephew of both Richard and Philip. He reached Acre in 1190 and led the French there before the kings arrived.",
          "Days after Conrad's murder he married the widowed Queen Isabella and became ruler of the kingdom, though he never took the title of king.",
          "He governed from Acre for five years and died in 1197 in a fall from a palace window.",
        ],
      },
      joan: {
        name: "Joan of England",
        role: "Queen of Sicily",
        life: "1165–1199",
        portrait: { kind: "queen", color: "#a8301d", color2: "#d2a33a" },
        bio: [
          "Richard's younger sister, married at eleven to William II of Sicily. When William died in 1189, the new king Tancred held her and her dowry.",
          "Richard freed her at Messina. She sailed east with Berengaria.",
          "In 1191 Richard proposed that she marry Saladin's brother al-Adil and rule Jerusalem with him. She refused to marry a Muslim.",
        ],
      },
      berengaria: {
        name: "Berengaria of Navarre",
        role: "Queen of England, 1191–1199",
        life: "c. 1165–1230",
        portrait: { kind: "queen", color: "#8e2f4a", color2: "#d2a33a" },
        bio: [
          "Daughter of King Sancho VI of Navarre. Eleanor of Aquitaine brought her across the Alps to Richard at Messina.",
          "She married Richard at Limassol on 12 May 1191 and was crowned Queen of England there.",
          "She never set foot in England while Richard lived. She died at Le Mans, where she had founded an abbey.",
        ],
      },
    },

    chapters: [
      {
        id: "third-leper-king",
        date: "1174",
        year: 1174,
        mapYear: 1174.5,
        title: "The leper king",
        place: "Jerusalem",
        at: [35.23, 31.78],
        view: { at: [35.8, 32.2], k: 4.2 },
        caption: "In 1174 a boy of thirteen became King Baldwin IV of Jerusalem. His tutor, William of Tyre, had already seen the first signs of leprosy.",
        body: [
          "Seventy-five years after the First Crusade, the Kingdom of Jerusalem held the coast from Beirut to Gaza and a line of castles beyond the Jordan. In July 1174 King Amalric died, and his thirteen-year-old son was crowned Baldwin IV.",
          "William of Tyre, the boy's tutor, tells how he first noticed the illness. When the prince played rough games with other boys, he felt nothing when they scratched his arm. Doctors treated him for years. It was leprosy, and it grew worse as he grew up.",
          "That same year, Saladin entered Damascus. He had ruled Egypt since 1169 and ended its Fatimid caliphate in 1171. Now one man held Cairo and Damascus, and the kingdom lay between them.",
        ],
        myth: {
          myth: "Baldwin IV hid his face behind a silver mask.",
          fact: "No contemporary source mentions a mask. The image comes from modern film. William of Tyre describes a king who kept ruling as his body failed, and rode to war in a litter when he could no longer sit a horse.",
        },
        sources: [{ title: "William of Tyre, History of Deeds Done Beyond the Sea, book 21" }],
        figures: ["baldwin4", "saladin"],
      },
      {
        id: "third-montgisard",
        date: "25 November 1177",
        year: 1177,
        mapYear: 1177.9,
        title: "Montgisard",
        place: "Near Ramla",
        at: [34.92, 31.86],
        view: { at: [34.75, 31.78], k: 9 },
        fight: true,
        battle: "montgisard",
        caption: "With a few hundred knights and the True Cross, the sixteen-year-old Baldwin caught Saladin's army scattered near Montgisard and routed it.",
        body: [
          "In November 1177 Saladin marched out of Egypt with a large army. Many of the kingdom's knights were away in the north, besieging Harim with Count Philip of Flanders. Baldwin rode to Ascalon with a few hundred knights and was shut in there.",
          "Saladin left him behind and pushed north toward Ramla. His men spread out to plunder. Baldwin slipped out along the coast, joined by the Templars from Gaza, and on 25 November caught the sultan's army strung out near Montgisard.",
          "Bishop Albert of Bethlehem carried the True Cross before the army. The charge broke Saladin's host. The sultan escaped, and his men struggled back across the Sinai, harried by Bedouin. It was the worst defeat of his career.",
        ],
        today: "The site is usually placed at Tel Gezer, near Ramla in Israel.",
        sources: [{ title: "William of Tyre, History of Deeds Done Beyond the Sea, book 21" }],
        figures: ["baldwin4", "saladin", "reynald"],
      },
      {
        id: "third-reynald",
        date: "1180–1187",
        year: 1183,
        mapYear: 1183,
        title: "The lord of Kerak",
        place: "Kerak, beyond the Jordan",
        at: [35.70, 31.18],
        view: { at: [35.6, 30.0], k: 3.6 },
        camp: "foe",
        caption: "From Kerak, Reynald of Châtillon raided Saladin's caravans and even sent ships into the Red Sea. Saladin swore to kill him with his own hand.",
        body: [
          "Reynald of Châtillon had spent sixteen years as a prisoner in Aleppo. Freed in 1176, he married the heiress of Oultrejordain and became lord of Kerak and Montréal, the castles that watched the road between Egypt and Syria.",
          "He raided caravans in time of truce. In the winter of 1182–83 he had ships carried in pieces across the desert to the Red Sea. His men raided its coasts, toward the holy cities of Mecca and Medina, until Saladin's fleet hunted them down.",
          "In November 1183 Saladin besieged Kerak during the wedding of Reynald's stepson Humphrey to the king's half-sister Isabella. Ernoul tells how the bride's mother sent dishes from the feast out to Saladin, and he asked which tower the couple slept in so his engines would spare it. The leper king, carried in a litter, led the army that relieved the castle.",
          "Around the turn of 1187 Reynald seized a rich caravan in time of truce and refused to give it back. Saladin swore that if he ever took Reynald, he would kill him himself.",
        ],
        today: "Al-Karak, Jordan. The castle still stands above the town.",
        figures: ["reynald", "saladin", "baldwin4"],
      },
      {
        id: "third-succession",
        date: "1185 – May 1187",
        year: 1186,
        mapYear: 1186.7,
        title: "A kingdom divided",
        place: "Jerusalem",
        at: [35.23, 31.78],
        view: { at: [35.3, 32.2], k: 6.5 },
        caption: "The leper king died in 1185 and his young heir a year later. Sibylla crowned her husband Guy king, and the barons split into two parties.",
        body: [
          "Baldwin IV died in the spring of 1185, aged twenty-three. His nephew, the child Baldwin V, followed him with Raymond III of Tripoli as regent. The boy died at Acre in the summer of 1186.",
          "Sibylla, the dead king's sister, was crowned in the Holy Sepulchre and then placed the crown on her husband, Guy of Lusignan. Raymond and the Ibelins had wanted Isabella's husband, Humphrey of Toron, as king. Humphrey would not be a rival king and did homage to Guy. Raymond refused, and made his own truce with Saladin.",
          "On 1 May 1187 a Muslim force crossing Galilee with Raymond's leave met a small company of Templars and Hospitallers at the Springs of Cresson. The Master of the Hospital was killed. Gerard of Ridefort, Master of the Temple, escaped with a few men. Shaken, Raymond made peace with the king, and the kingdom called out every man it had.",
        ],
        figures: ["sibylla", "guy", "raymond3", "balian", "ridefort"],
      },
      {
        id: "third-hattin",
        date: "3–4 July 1187",
        year: 1187,
        mapYear: 1187.5,
        title: "The Horns of Hattin",
        place: "Hattin, Galilee",
        at: [35.44, 32.80],
        view: { at: [35.38, 32.8], k: 10 },
        routes: { kingdom: 3 },
        fight: true,
        battle: "hattin",
        caption: "4 July 1187. Thirsty and surrounded, the army of Jerusalem was destroyed on the Horns of Hattin. King Guy was taken and the True Cross lost.",
        body: [
          "By the end of June the kingdom had gathered about 1,200 knights and many thousands of foot soldiers at the springs of Sephoria. Saladin crossed the Jordan and stormed the town of Tiberias. Raymond's wife Eschiva held out in its citadel.",
          "Raymond advised the king to stay by the water, even if it cost him Tiberias. Gerard of Ridefort urged him to march. On 3 July the army set out across the dry hills. Harassed all day, it camped without water. At dawn the Muslims set the brush alight.",
          "On 4 July the foot soldiers broke and climbed the Horns of Hattin. Raymond cut his way out, and so did Balian. The knights fought around the king's tent and the True Cross until both fell.",
          "Saladin spared Guy, but killed Reynald with his own hand. He had the captured Templars and Hospitallers, about two hundred of them, put to death. The relic of the True Cross was carried to Damascus and never recovered.",
        ],
        myth: {
          myth: "Raymond of Tripoli betrayed the army at Hattin.",
          fact: "Some later writers said so, because he had treated with Saladin and escaped the field. The Old French Continuation of William of Tyre shows him advising against the march and leading the vanguard's charge. Most historians reject the charge.",
        },
        today: "The Horns of Hattin are an extinct volcano above Tiberias, Israel.",
        sources: [{ title: "The Old French Continuation of William of Tyre (Ernoul)" }],
        figures: ["guy", "saladin", "raymond3", "reynald", "ridefort", "balian"],
      },
      {
        id: "third-jerusalem",
        date: "20 September – 2 October 1187",
        year: 1187,
        mapYear: 1187.8,
        title: "Jerusalem surrenders",
        place: "Jerusalem",
        at: [35.23, 31.78],
        view: { at: [35.23, 31.78], k: 10 },
        camp: "foe",
        days: { from: "1187-09-20", to: "1187-10-02", label: "of the siege" },
        caption: "With a handful of knights, Balian of Ibelin held Jerusalem until he could win terms. On 2 October 1187 the city surrendered to Saladin for a ransom.",
        body: [
          "After Hattin the kingdom fell city by city. Acre opened its gates within days, and Sidon, Beirut, Jaffa and Ascalon followed. Only Tyre held out, saved by the arrival of Conrad of Montferrat on 14 July.",
          "Balian of Ibelin had escaped to Tyre. He asked Saladin for safe conduct to fetch his wife and children from Jerusalem, and swore to stay only one night. In the city the people begged him to lead them. Ernoul says Saladin released him from his oath and sent his family to Tripoli under escort.",
          "Balian had almost no knights, so he knighted noble boys and some burgesses. Saladin attacked from 20 September, and his miners broke into the north wall. Balian then threatened to kill the Muslim prisoners, wreck the holy places and fight to the last man. Saladin agreed to terms.",
          "On 2 October the city surrendered. Each Christian could go free for a ransom: ten dinars for a man, five for a woman, one for a child. Thousands of the poor could not pay and were led away as slaves, though Saladin and his brother al-Adil freed many without payment. The cross was taken down from the Dome of the Rock.",
        ],
        myth: {
          myth: "Saladin took Jerusalem and let every Christian go free.",
          fact: "He spared the city a massacre, and the Christian chroniclers praised his mercy. But the surrender was a ransom bargain, and many thousands who could not pay were enslaved.",
        },
        today: "The walls that stand today were built by the Ottomans in the 1530s.",
        sources: [{ title: "The Old French Continuation of William of Tyre (Ernoul)" }],
        figures: ["balian", "saladin", "conrad_montferrat"],
      },
      {
        id: "third-audita",
        date: "October 1187 – January 1188",
        year: 1187,
        mapYear: 1188,
        title: "Audita tremendi",
        place: "Ferrara and Gisors",
        at: [1.78, 49.28],
        view: { at: [5.5, 47.0], k: 3.4 },
        moment: "gisors",
        caption: "Pope Gregory VIII called Christendom to the cross. At the elm of Gisors the kings of England and France stopped fighting each other and took it together.",
        body: [
          "The news reached the papal court at Ferrara in October 1187. Pope Urban III died there that month, it was said of grief. His successor, Gregory VIII, issued the bull Audita tremendi on 29 October. It called the loss a judgment on the sins of Christians and summoned them to penance and to the cross.",
          "Richard, Count of Poitou and heir of Henry II, took the cross at Tours in November, the first prince north of the Alps to do so. In January 1188 Henry and Philip II of France, at war over their borders, met at the elm of Gisors. Archbishop Joscius of Tyre preached to them, and both kings took the cross.",
          "To pay for the expedition both kings levied the Saladin tithe: a tenth of a year's income and movable goods from everyone who did not go.",
        ],
        quotes: [
          {
            text: "Hearing of the severity of the awful judgment which the hand of God has dealt upon the land of Jerusalem, we and our brothers were thrown into such horror and grief that we hardly knew what to do. (abridged)",
            source: "Pope Gregory VIII, Audita tremendi, 29 October 1187",
          },
        ],
        figures: ["gregory8", "richard", "henry2", "philip2"],
      },
      {
        id: "third-guy-acre",
        date: "July 1188 – October 1189",
        year: 1189,
        mapYear: 1189.6,
        title: "Guy marches on Acre",
        place: "Tyre to Acre",
        at: [35.07, 32.92],
        view: { at: [35.15, 33.08], k: 9 },
        routes: { guy: 3 },
        camp: "cru",
        caption: "Shut out of Tyre by Conrad, the freed King Guy marched on Acre with a small army in August 1189 and laid siege to it. The siege would last two years.",
        body: [
          "Conrad held Tyre through a winter siege. On 30 December 1187 his galleys destroyed Saladin's squadron off the harbour, and the sultan withdrew.",
          "Saladin released Guy in 1188 after he swore to leave the kingdom, and the clergy freed him from the oath. When he came to Tyre, Conrad shut the gates and would not accept him as king.",
          "In late August 1189 Guy marched south with a small army, with Pisan ships keeping pace along the coast. On 28 August he camped on the hill of Toron outside Acre and laid siege to a city stronger than his army. Fleets of Danes, Frisians, Flemings and Englishmen began to arrive. On 4 October an attack on Saladin's camp failed, and Gerard of Ridefort was killed.",
        ],
        figures: ["guy", "conrad_montferrat", "sibylla", "ridefort"],
      },
      {
        id: "third-barbarossa",
        date: "May 1189 – May 1190",
        year: 1189,
        mapYear: 1189.8,
        title: "Barbarossa marches east",
        place: "Regensburg to Iconium",
        at: [32.48, 37.87],
        view: { at: [23.5, 43.5], k: 2.4 },
        routes: { barbarossa: 14 },
        days: { from: "1189-05-11", to: "1190-05-18", label: "on the march" },
        caption: "The old emperor Frederick Barbarossa led the best-ordered army of the crusade down the Danube, through hostile Byzantium and across Anatolia.",
        body: [
          "Frederick Barbarossa had marched on the Second Crusade as a young man. Now in his late sixties, he took the cross at Mainz in March 1188 and left Regensburg on 11 May 1189 with a large, well-ordered army.",
          "King Béla III of Hungary welcomed him. In Byzantine lands it went worse. Emperor Isaac II Angelos, who had come to terms with Saladin, held up the march. Frederick occupied Philippopolis, wintered at Adrianople and threatened Constantinople until Isaac gave way and provided ships to cross the Dardanelles in March 1190.",
          "In Anatolia the Turks of Rûm harried the army through barren country. On 18 May 1190 the Germans stormed Iconium, the sultan's capital, and won supplies and safe passage.",
        ],
        figures: ["barbarossa"],
      },
      {
        id: "third-saleph",
        date: "10 June 1190",
        year: 1190,
        mapYear: 1190.4,
        title: "Death in the Saleph",
        place: "River Saleph, Cilicia",
        at: [33.86, 36.47],
        view: { at: [34.6, 36.6], k: 5.5 },
        routes: { barbarossa: 16, germans: 3 },
        caption: "10 June 1190. Within sight of the Christian lands, Barbarossa drowned in the river Saleph. Much of his army turned for home.",
        body: [
          "The army crossed the Taurus mountains into Armenian Cilicia. On 10 June 1190 Frederick reached the river Saleph near Seleucia. He went into the water, to bathe or to cross, and was swept away and drowned.",
          "The army fell apart. Many went home. Frederick's son, Duke Frederick of Swabia, led the rest to Antioch, where sickness struck them. The emperor's flesh was buried at Antioch. His bones were carried on toward Jerusalem but never reached it.",
          "A much smaller German force reached Acre with Duke Frederick in October 1190. He died in the camp the following January.",
        ],
        myth: {
          myth: "Barbarossa never died, but sleeps inside the Kyffhäuser mountain, waiting to return.",
          fact: "The chroniclers of his army record his drowning in the Saleph. The legend of the sleeping emperor was first told of his grandson Frederick II and only later moved to Barbarossa.",
        },
        today: "The Göksu river near Silifke, Turkey. A memorial stands near the place where he drowned.",
        figures: ["barbarossa"],
      },
      {
        id: "third-vezelay",
        date: "4 July 1190",
        year: 1190,
        mapYear: 1190.5,
        title: "The kings set out",
        place: "Vézelay, Burgundy",
        at: [3.75, 47.47],
        view: { at: [4.3, 46.4], k: 5.5 },
        routes: { philip: 1, richard: 1 },
        moment: "vezelay",
        caption: "Three years to the day after Hattin, Richard of England and Philip of France set out together from Vézelay.",
        body: [
          "Henry II died in July 1189, at war with his own son. Richard was crowned King of England in September and spent the winter raising money. He sold offices, lands and lordships. Richard of Devizes has him say he would sell London if he could find a buyer.",
          "Crusading zeal also turned on the Jews of England. Riots broke out after the coronation, and in March 1190 the Jews of York died in the castle there, many by their own hands. William of Newburgh condemned the killers.",
          "Philip and Richard met at Vézelay on 4 July 1190. They had sworn to share their conquests equally. Together they marched to Lyon, and there they parted. Philip went to Genoa to take ship. Richard went to Marseille to meet his fleet, which had sailed from England around Spain.",
        ],
        figures: ["richard", "philip2"],
      },
      {
        id: "third-messina",
        date: "September 1190 – April 1191",
        year: 1190,
        mapYear: 1190.9,
        title: "Winter in Sicily",
        place: "Messina, Sicily",
        at: [15.55, 38.19],
        view: { at: [12.5, 41.4], k: 3.4 },
        routes: { philip: 16, richard: 23 },
        days: { from: "1190-09-23", to: "1191-04-10", label: "in Sicily" },
        caption: "The kings wintered at Messina. Richard stormed the city, freed his sister Joan and broke off his betrothal to Philip's sister.",
        body: [
          "Philip reached Messina on 16 September 1190 and Richard a week later. Sicily was in turmoil. King William II, husband of Richard's sister Joan, had died in November 1189, and the new king, Tancred, was holding Joan and her dowry.",
          "Quarrels between the crusaders and the townsmen turned into fighting. On 4 October Richard's men stormed Messina and raised his banners on its walls, to Philip's anger. Tancred made peace, released Joan and paid Richard a large sum in gold.",
          "Richard had long been betrothed to Philip's sister Alice. Now he refused her, and Philip released him for a payment. Richard's mother, Eleanor of Aquitaine, arrived with his new bride, Berengaria of Navarre. Philip sailed on 30 March 1191. Richard followed on 10 April with more than 200 ships.",
        ],
        quotes: [
          {
            text: "He had the valour of Hector, the magnanimity of Achilles; he was not inferior to Alexander, nor less than Roland in valour. (abridged)",
            source: "Itinerarium Peregrinorum et Gesta Regis Ricardi, book 2, on Richard",
          },
        ],
        figures: ["richard", "philip2", "joan", "berengaria"],
      },
      {
        id: "third-cyprus",
        date: "May 1191",
        year: 1191,
        mapYear: 1191.4,
        title: "The conquest of Cyprus",
        place: "Limassol, Cyprus",
        at: [33.04, 34.67],
        view: { at: [32.2, 35.0], k: 4.6 },
        routes: { fleet: 19, philip_sea: 12 },
        days: { from: "1191-05-06", to: "1191-06-05", label: "in Cyprus" },
        fight: true,
        caption: "Storm-driven to Cyprus, Richard took the island from its self-made emperor in a month, and married Berengaria at Limassol.",
        body: [
          "Philip reached Acre on 20 April. Richard's fleet was scattered by a storm after Crete. Some ships were wrecked on Cyprus, and its ruler, Isaac Komnenos, a Byzantine noble who had made himself emperor there, seized the survivors and their goods. The ship carrying Joan and Berengaria lay off Limassol and would not land.",
          "Richard arrived on 6 May, stormed ashore at Limassol and routed Isaac's army. On 12 May he married Berengaria there, and she was crowned Queen of England. King Guy and other lords sailed over from Acre to seek his support.",
          "Isaac submitted, then fled. Richard's forces took the island's castles. When Isaac finally surrendered, he asked not to be put in irons, so Richard had him bound in chains of silver. Cyprus stayed in Latin hands for three centuries.",
        ],
        today: "Limassol, Cyprus. Tradition places the royal wedding in the chapel of its castle.",
        figures: ["richard", "berengaria", "joan", "guy"],
      },
      {
        id: "third-acre",
        date: "August 1189 – August 1191",
        year: 1191,
        mapYear: 1191.5,
        title: "The siege of Acre",
        place: "Acre",
        at: [35.07, 32.92],
        view: { at: [35.1, 32.92], k: 10 },
        routes: { fleet: 24, germans: 7 },
        days: { from: "1189-08-28", to: "1191-07-12", label: "of the siege" },
        camp: "cru",
        fight: true,
        battle: "acre",
        caption: "For two years the besiegers of Acre were themselves besieged by Saladin. With both kings' engines battering the walls, the city surrendered on 12 July 1191.",
        body: [
          "The siege of Acre drew in all of Christendom. Saladin camped on the hills behind the besiegers, so they were besieged in turn, and dug ditches facing both ways. In the winter of 1190–91 famine and disease killed thousands. Queen Sibylla and her daughters died in the camp, and Isabella, now heiress, married Conrad of Montferrat.",
          "Philip arrived in April 1191 and Richard in June. Their engines pounded the walls day and night. The Itinerarium names Philip's great trebuchet Bad Neighbour, and the garrison's answer Bad Kinsman. Another, paid for from common funds, was called God's Own Sling, and a priest preached beside it. Miners and assaults brought down the Accursed Tower.",
          "On 12 July 1191 the garrison surrendered. Saladin was to pay 200,000 dinars, free Christian captives and return the True Cross. Leopold of Austria, slighted by the kings, went home angry. Philip, ill, sailed for France at the end of July.",
          "The payments were delayed. On 20 August Richard had about 2,700 prisoners of the garrison led out and killed in sight of Saladin's army, as the Itinerarium and Ambroise record.",
        ],
        today: "Akko, Israel. The halls of the Hospitallers survive beneath the Ottoman citadel.",
        sources: [
          { title: "Itinerarium Peregrinorum et Gesta Regis Ricardi, books 1 and 3" },
          { title: "Ambroise, Estoire de la guerre sainte" },
        ],
        figures: ["guy", "philip2", "richard", "conrad_montferrat", "saladin", "henry_champagne"],
      },
      {
        id: "third-arsuf",
        date: "7 September 1191",
        year: 1191,
        mapYear: 1191.7,
        title: "Arsuf",
        place: "Arsuf",
        at: [34.82, 32.22],
        view: { at: [34.86, 32.42], k: 8.5 },
        routes: { march: 4 },
        days: { from: "1191-08-22", to: "1191-09-07", label: "on the march" },
        fight: true,
        battle: "arsuf",
        caption: "Marching down the coast under constant attack, Richard held his knights back until the moment came, then broke Saladin's army at Arsuf.",
        body: [
          "Richard's goal was Jaffa, the port for Jerusalem. He led the army south along the coast road in short stages, with the fleet alongside carrying food. Foot soldiers on the landward side shielded the horses, and crossbowmen kept the Turkish horse archers at a distance. The Itinerarium describes foot soldiers marching on with arrows stuck all over their padded coats.",
          "On 7 September, north of Arsuf, Saladin threw his whole army at the column. Richard held his knights back. The Hospitallers at the rear were losing horses and begged to charge. At last the Marshal of the Hospital and Baldwin Carew broke ranks, and the rear followed them.",
          "Richard turned the breakout into a full charge, and Saladin's army broke. When it rallied, Richard charged again, then held his men together instead of chasing into the forest. James of Avesnes, a hero of the siege of Acre, died on the field. Three days later the army reached Jaffa.",
        ],
        today: "The ruins of Arsuf stand in Apollonia National Park, Israel.",
        sources: [{ title: "Itinerarium Peregrinorum et Gesta Regis Ricardi, book 4" }],
        figures: ["richard", "saladin"],
      },
      {
        id: "third-beit-nuba",
        date: "November 1191 – January 1192",
        year: 1191,
        mapYear: 1192,
        title: "Within reach of Jerusalem",
        place: "Beit Nuba",
        at: [35.03, 31.85],
        view: { at: [34.85, 31.8], k: 8.5 },
        routes: { march: 8, retreat: 4 },
        caption: "In rain and mud the army reached Beit Nuba, twelve miles from Jerusalem. Warned the city could not be held, Richard turned back.",
        body: [
          "Through the autumn Richard rebuilt the castles on the Jaffa road while envoys went back and forth. He even proposed that his sister Joan marry Saladin's brother al-Adil, and that the two rule Jerusalem together. Joan refused to marry a Muslim.",
          "Around the new year the army pushed inland through rain and hail to Beit Nuba, about twelve miles from Jerusalem. Food rotted and horses died in the mud. The Templars, the Hospitallers and the barons of the land warned that even if the city fell, it could not be held once the pilgrims went home.",
          "On 13 January 1192 Richard ordered the retreat. The ordinary pilgrims, who had longed to see the Holy Sepulchre, turned back in grief. Richard marched to Ascalon instead and spent the spring rebuilding its walls to cut Saladin's road to Egypt.",
        ],
        figures: ["richard", "saladin", "joan"],
      },
      {
        id: "third-second-approach",
        date: "April – July 1192",
        year: 1192,
        mapYear: 1192.4,
        title: "A king murdered, a second retreat",
        place: "Tyre and Beit Nuba",
        at: [35.03, 31.85],
        view: { at: [35.05, 32.5], k: 6 },
        caption: "Conrad was murdered in Tyre and Henry of Champagne took his place. In June the army came again within sight of Jerusalem, and again turned back.",
        body: [
          "News came from England that Richard's brother John was plotting. Richard had to settle the crown before he went home. In April 1192 the barons chose Conrad of Montferrat as king, and Richard accepted. Guy was given Cyprus instead.",
          "On 28 April, before he could be crowned, Conrad was stabbed to death in a street of Tyre by two Assassins who had lived in the city disguised as monks. Some blamed Richard, but nothing links him to it. Eight days later the widowed Isabella married Count Henry of Champagne.",
          "In June the army marched to Beit Nuba again, and Richard's men captured a great caravan from Egypt. A council of twenty, of Templars, Hospitallers, French lords and barons of the land, advised against a siege in the summer heat with the cisterns around Jerusalem destroyed. In early July the army turned back a second time.",
        ],
        quotes: [
          {
            text: "Fair Lord God, I pray Thee suffer me not to see Thy Holy City, since I cannot deliver it from the hands of Thine enemies.",
            source: "Jean de Joinville, Life of Saint Louis, retelling a story of Richard more than a century later",
          },
        ],
        figures: ["richard", "conrad_montferrat", "henry_champagne", "guy"],
      },
      {
        id: "third-jaffa",
        date: "28 July – 5 August 1192",
        year: 1192,
        mapYear: 1192.6,
        title: "Jaffa",
        place: "Jaffa",
        at: [34.75, 32.05],
        view: { at: [34.86, 32.4], k: 8.5 },
        routes: { galleys: 4 },
        fight: true,
        battle: "jaffa",
        caption: "Richard waded ashore to save Jaffa, then held off Saladin's cavalry with a few dozen knights on foot and a line of crossbowmen.",
        body: [
          "Richard had gone north to Acre, planning to attack Beirut. Saladin struck at Jaffa at once. His miners broke the walls and his troops poured into the town. The garrison, holding the citadel, agreed to surrender if no help came.",
          "Richard sailed south with a few galleys. On 1 August, seeing the citadel still held, he leapt into the sea, waded ashore with his men and drove Saladin's troops out of the town.",
          "At dawn on 5 August Saladin's cavalry attacked the small camp outside the walls. Richard had a few dozen knights, few of them mounted, and some two thousand foot. The knights knelt in a line with shields and lances braced. Behind them the crossbowmen worked in pairs, one loading while the other shot. Charge after charge turned away before the line. Late in the day Richard mounted and charged, and Saladin's army withdrew.",
          "The Christian chroniclers tell that during the fighting al-Adil sent Richard two fine horses.",
        ],
        today: "Jaffa is the old port quarter of Tel Aviv-Yafo, Israel.",
        sources: [{ title: "Itinerarium Peregrinorum et Gesta Regis Ricardi, book 6" }],
        figures: ["richard", "saladin"],
      },
      {
        id: "third-treaty",
        date: "2 September 1192",
        year: 1192,
        mapYear: 1192.7,
        title: "The Treaty of Jaffa",
        place: "Jaffa and Jerusalem",
        at: [34.75, 32.05],
        view: { at: [35.0, 32.5], k: 6 },
        caption: "Richard and Saladin agreed a truce. The Christians kept the coast from Tyre to Jaffa, and pilgrims could visit Jerusalem in peace.",
        body: [
          "Both sides were spent. Richard fell sick, and Saladin's emirs were tired of the war. On 2 September 1192 they agreed a truce of three years and eight months. The Christians kept the coast from Tyre to Jaffa. Ascalon, rebuilt at such cost, was to be pulled down. Christian pilgrims could visit Jerusalem freely.",
          "Many crusaders went up to Jerusalem in parties under safe conduct. Richard would not go. Hubert Walter, Bishop of Salisbury, met Saladin and asked that two Latin priests and two deacons might serve at the Holy Sepulchre, at Bethlehem and at Nazareth. Saladin granted it.",
          "On 9 October Richard sailed from Acre. The Kingdom of Jerusalem had survived, now as a strip of coast ruled from Acre.",
        ],
        myth: {
          myth: "Richard and Saladin met face to face.",
          fact: "They never met. They dealt through envoys, above all Saladin's brother al-Adil, whom Richard met several times. The duels between the two kings belong to later romance.",
        },
        figures: ["richard", "saladin", "henry_champagne", "balian"],
      },
      {
        id: "third-epilogue",
        date: "1192 and after",
        year: 1193,
        mapYear: 1193,
        title: "The long road home",
        place: "Austria and the Latin East",
        at: [15.52, 48.39],
        view: { at: [23, 42], k: 2.3 },
        routes: { home: 19 },
        caption: "Shipwrecked and captured in Austria, Richard was ransomed in 1194. The kingdom he had saved lasted another hundred years from Acre.",
        body: [
          "Richard's ship was wrecked at the head of the Adriatic. Travelling in disguise, he was recognised near Vienna in December 1192 and seized by Duke Leopold of Austria, whom he had offended at Acre. Leopold handed him to Emperor Henry VI, Barbarossa's son. In prison Richard wrote a song, Ja nus hons pris, complaining that his men had left him captive for two winters.",
          "He was freed in February 1194 for a ransom of 150,000 marks, raised by heavy taxes across his lands. He never returned to the East and died of a crossbow wound at Châlus in 1199. Saladin had died at Damascus on 4 March 1193.",
          "The Third Crusade did not recover Jerusalem. It did save the kingdom. From Acre, the Latin East lasted another century, until Acre fell in 1291.",
        ],
        myth: {
          myth: "The minstrel Blondel found the captive Richard by singing beneath his prison window.",
          fact: "The tale first appears in a French collection of stories written about seventy years later. The chroniclers of the time say the emperor announced the capture himself.",
        },
        today: "Dürnstein, Austria. The ruined castle where Richard was held stands above the Danube.",
        figures: ["richard", "saladin", "henry_champagne", "philip2"],
      },
    ],

    battles: {
      montgisard: {
        id: "montgisard",
        title: "The battle of Montgisard",
        date: "25 November 1177",
        place: "Near Ramla",
        terrain: [
          { type: "hills", at: [74, 14], w: 36, h: 12, label: "Mont Gisard", labelAt: [74, 5] },
          { type: "hills", at: [62, 56], w: 34, h: 7 },
          { type: "hills", at: [44, 30], w: 18, h: 4 },
          { type: "hills", at: [46, 44], w: 20, h: 4, label: "Ravine", labelAt: [36, 37] },
          { type: "road", path: [[0, 56], [24, 48], [44, 38], [62, 30], [100, 24]] },
          { type: "landmark", kind: "town", at: [16, 9], size: 5, label: "Ramla", labelAt: [16, 15] },
          { type: "tents", at: [64, 42], n: 6, r: 7, color: C.ayyubid, label: "Baggage", labelAt: [70, 49] },
          { type: "label", text: "from Ascalon", at: [7, 59] },
        ],
        units: {
          bald: { label: "Baldwin IV", side: "cru", kind: "king", rows: 1, cols: 1, color: C.kingdom, leader: true, start: [-6, 54] },
          cross: { label: "Bishop Albert with the True Cross", side: "cru", kind: "bishop", rows: 1, cols: 1, start: [-8, 58] },
          rey: { label: "Reynald of Châtillon", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.reynald, leader: true, start: [-8, 46] },
          kn: { label: "Knights of the kingdom", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.kingdom, start: [-10, 52] },
          tem: { label: "Templars from Gaza", side: "cru", kind: "templar", rows: 2, cols: 3, start: [22, 68] },
          foot: { label: "Foot soldiers", side: "cru", kind: "foot", rows: 2, cols: 4, color: C.plain, start: [-10, 60] },
          sal: { label: "Saladin", side: "foe", kind: "horsearcher", rows: 1, cols: 3, color: C.ayyubid, leader: true, at: [66, 30] },
          mam: { label: "Mamluk guard", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.ayyubid, at: [56, 26] },
          ffoot: { label: "Foot and baggage", side: "foe", kind: "foot", rows: 2, cols: 5, color: C.foot, at: [52, 40] },
          raid: { label: "Raiding parties", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.turk, at: [28, 16] },
        },
        phases: [
          {
            caption: "25 November 1177. Saladin has left the king shut up in Ascalon and marched north. His raiders spread out to plunder around Ramla.",
            set: { sal: { state: "hold" }, mam: { state: "hold" }, ffoot: { at: [50, 40] }, raid: { at: [24, 14], state: "fight" } },
            fx: [{ type: "fire", at: [16, 9], r: 4 }],
          },
          {
            caption: "Baldwin, sixteen and already sick, slips out of Ascalon with a few hundred knights. The Templars of Gaza ride to join him.",
            set: {
              bald: { at: [14, 50] }, cross: { at: [10, 55] }, rey: { at: [22, 44] }, kn: { at: [20, 51] },
              foot: { at: [8, 58] }, tem: { at: [28, 56] },
            },
            dur: 6000,
          },
          {
            caption: "Bishop Albert of Bethlehem holds up the True Cross before the army. Saladin's men are caught strung out across a ravine and try to form a line.",
            set: {
              bald: { state: "hold" }, cross: { at: [14, 54], state: "hold" },
              mam: { at: [52, 30], state: "hold", facing: -1 }, ffoot: { at: [52, 42], state: "hold", facing: -1 },
              sal: { at: [64, 32], state: "hold", facing: -1 }, raid: { at: [32, 22], facing: 1 },
            },
          },
          {
            caption: "The knights charge into the disordered host. Reynald and the Templars ride straight at the sultan's guard.",
            set: {
              rey: { at: [46, 32], state: "fight" }, kn: { at: [46, 40], state: "fight" }, tem: { at: [46, 47], state: "fight" },
              bald: { at: [36, 42], state: "fight" }, foot: { at: [30, 48], state: "fight" },
              mam: { at: [52, 31], state: "fight", facing: -1 }, ffoot: { at: [53, 42], state: "fight", facing: -1 },
            },
            fx: [{ type: "clash", a: "rey", b: "mam" }, { type: "clash", a: "kn", b: "ffoot" }, { type: "clash", a: "tem", b: "ffoot" }, { type: "arrows", from: "raid", to: "kn", rate: 5 }],
          },
          {
            caption: "The guard is cut down around Saladin. The sultan escapes south, and his whole army breaks and runs.",
            set: {
              sal: { at: [106, 60], state: "flee", facing: 1 }, mam: { at: [108, 52], state: "flee", facing: 1 },
              ffoot: { at: [104, 64], state: "flee", facing: 1 }, raid: { at: [108, 18], state: "flee", facing: 1 },
              rey: { at: [62, 34] }, kn: { at: [60, 42] }, tem: { at: [58, 50] },
            },
          },
          {
            caption: "Few of the invaders reached Egypt. Rain and Bedouin raiders harried them all the way across the Sinai.",
            set: {
              rey: { state: "hold" }, kn: { state: "hold" }, tem: { state: "hold" },
              bald: { at: [48, 40], state: "hold" }, cross: { at: [44, 44] }, foot: { at: [40, 48], state: "hold" },
            },
          },
        ],
      },

      hattin: {
        id: "hattin",
        title: "The battle of Hattin",
        date: "3–4 July 1187",
        place: "The Horns of Hattin, Galilee",
        terrain: [
          { type: "desert", poly: [[0, 6], [86, 2], [88, 62], [0, 62]] },
          { type: "lake", poly: [[91, 0], [100, 0], [100, 62], [93, 62], [89, 48], [90, 24]], label: "Sea of Galilee", labelAt: [95, 58] },
          { type: "hills", at: [62, 26], w: 14, h: 8, label: "Horns of Hattin", labelAt: [62, 18] },
          { type: "hills", at: [70, 6], w: 30, h: 6 },
          { type: "trees", at: [76, 14], r: 3, n: 4, label: "Springs of Hattin", labelAt: [80, 20] },
          { type: "road", path: [[0, 38], [28, 40], [50, 36], [70, 38], [86, 44]] },
          { type: "landmark", kind: "town", at: [85, 44], size: 5, label: "Tiberias", labelAt: [81, 50] },
          { type: "tents", at: [38, 40], n: 5, r: 6, color: C.jerusalem },
          { type: "label", text: "from Sephoria", at: [8, 34] },
        ],
        units: {
          ray: { label: "Raymond of Tripoli", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.tripoli, leader: true, at: [30, 36] },
          guy: { label: "King Guy", side: "cru", kind: "king", rows: 1, cols: 1, color: C.jerusalem, leader: true, at: [18, 37] },
          cross: { label: "The True Cross", side: "cru", kind: "bishop", rows: 1, cols: 1, at: [14, 41] },
          kn: { label: "Knights of the kingdom", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.jerusalem, at: [20, 30] },
          foot: { label: "Foot soldiers", side: "cru", kind: "foot", rows: 3, cols: 6, color: C.plain, at: [18, 46] },
          tem: { label: "Templars", side: "cru", kind: "templar", rows: 2, cols: 4, at: [5, 34] },
          hos: { label: "Hospitallers", side: "cru", kind: "hospitaller", rows: 2, cols: 3, at: [5, 42] },
          bal: { label: "Balian of Ibelin", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.ibelin, at: [5, 27] },
          sal: { label: "Saladin", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.ayyubid, leader: true, at: [76, 46] },
          taqi: { label: "Taqi al-Din", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.ayyubid, start: [104, 22] },
          gok: { label: "Gökböri", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.turk, start: [40, 68] },
          arch: { label: "Archers", side: "foe", kind: "archer", rows: 2, cols: 5, color: C.foot, start: [42, -6] },
        },
        phases: [
          {
            caption: "3 July 1187. The army leaves the springs of Sephoria to relieve Tiberias. Raymond leads the vanguard, the Templars and Balian the rearguard.",
            set: {
              ray: { at: [36, 37] }, guy: { at: [24, 38] }, cross: { at: [20, 42] }, kn: { at: [26, 31] },
              foot: { at: [24, 47] }, tem: { at: [10, 35] }, hos: { at: [10, 43] }, bal: { at: [10, 28] },
            },
          },
          {
            caption: "Saladin's horsemen close in on every side. The rear is pressed so hard that the army halts for the night on the dry plateau, with no water.",
            set: {
              gok: { at: [10, 55], state: "fight", facing: -1 }, arch: { at: [36, 18], state: "fight" },
              taqi: { at: [72, 28], state: "hold", facing: -1 }, sal: { at: [72, 44], state: "hold", facing: -1 },
              tem: { state: "fight" }, hos: { state: "fight" }, ray: { state: "hold" }, guy: { state: "hold" },
              kn: { state: "hold" }, foot: { state: "hold" }, cross: { state: "hold" }, bal: { state: "hold" },
            },
            fx: [{ type: "arrows", from: "gok", to: "hos" }, { type: "arrows", from: "arch", to: "kn" }, { type: "arrows", from: "sal", to: "ray", rate: 5 }],
          },
          {
            caption: "All night the army goes without water. At dawn the Muslims set the dry brush alight, and the smoke blows into the Christian ranks.",
            fx: [{ type: "fire", at: [30, 22], r: 6 }, { type: "fire", at: [44, 52], r: 6 }, { type: "fire", at: [6, 52], r: 5 }, { type: "arrows", from: "arch", to: "foot" }, { type: "arrows", from: "gok", to: "tem" }],
          },
          {
            caption: "4 July. The foot soldiers break away and climb the Horns of Hattin. They will not come down, though the king and the bishops beg them.",
            set: { foot: { at: [60, 30], state: "hold" } },
            fx: [{ type: "arrows", from: "arch", to: "kn" }, { type: "arrows", from: "sal", to: "foot", rate: 6 }, { type: "fire", at: [30, 22], r: 4 }],
          },
          {
            caption: "Raymond charges the enemy line. Taqi al-Din's men open their ranks to let him through, then close again. Later Balian too cuts his way out.",
            set: { ray: { at: [108, 12], state: "flee", facing: 1 }, taqi: { at: [70, 24], state: "fight", facing: -1 }, bal: { at: [-8, 22], state: "flee", facing: -1 } },
            fx: [{ type: "arrows", from: "gok", to: "hos" }, { type: "arrows", from: "arch", to: "kn" }],
          },
          {
            caption: "The king pitches his tent near the Horns. His knights charge down at Saladin and are driven back. The True Cross is taken.",
            set: {
              guy: { at: [56, 34], state: "fight" }, kn: { at: [64, 40], state: "fight" }, sal: { at: [72, 44], state: "fight", facing: -1 },
              cross: { at: [58, 38], state: "fight" }, tem: { at: [46, 34], state: "fight" }, hos: { at: [46, 42], state: "fight" },
              gok: { at: [36, 44], state: "fight", facing: 1 }, arch: { at: [50, 22], state: "fight" },
            },
            fx: [{ type: "clash", a: "kn", b: "sal" }, { type: "clash", a: "tem", b: "gok" }, { type: "clash", a: "hos", b: "gok" }, { type: "arrows", from: "arch", to: "foot" }],
          },
          {
            caption: "The king's tent falls and Guy is captured. Saladin spares him but kills Reynald with his own hand, and has the Templars and Hospitallers put to death.",
            set: {
              cross: { state: "hidden" }, kn: { state: "hidden" }, tem: { state: "hidden" }, hos: { state: "hidden" }, foot: { state: "hidden" },
              guy: { at: [62, 40], state: "hold" }, sal: { at: [70, 42], state: "hold" }, gok: { at: [52, 44], state: "hold" },
              taqi: { at: [64, 28], state: "hold" }, arch: { at: [52, 26], state: "hold" },
            },
            dur: 6600,
          },
        ],
      },

      acre: {
        id: "acre",
        title: "The siege of Acre",
        date: "August 1189 – July 1191",
        place: "Acre",
        terrain: [
          { type: "sea", poly: [[0, 0], [12, 0], [11, 14], [12, 30], [16, 44], [34, 50], [52, 56], [62, 62], [0, 62]], label: "Bay of Acre", labelAt: [24, 56] },
          { type: "walls", path: [[12, 12], [34, 10], [34, 36], [16, 42], [12, 30]], closed: true },
          { type: "label", text: "Acre", at: [22, 24] },
          { type: "label", text: "Accursed Tower", at: [42, 6], size: 1.1 },
          { type: "label", text: "Tower of Flies", at: [24, 47], size: 1.1 },
          { type: "hills", at: [58, 30], w: 14, h: 7, label: "Toron", labelAt: [58, 23] },
          { type: "tents", at: [50, 14], n: 7, r: 8, color: C.philip },
          { type: "tents", at: [52, 46], n: 7, r: 8, color: C.richard },
          { type: "tents", at: [66, 30], n: 5, r: 6, color: C.jerusalem },
          { type: "hills", at: [88, 12], w: 20, h: 6 },
          { type: "tents", at: [88, 30], n: 9, r: 9, color: C.ayyubid, label: "Saladin's camp", labelAt: [88, 41] },
          { type: "river", path: [[98, 50], [82, 52], [68, 56], [56, 59]], w: 2, label: "River Belus", labelAt: [80, 58] },
        ],
        units: {
          guy: { label: "King Guy", side: "cru", kind: "king", rows: 1, cols: 1, color: C.jerusalem, leader: true, at: [60, 28] },
          foot: { label: "Crusader foot", side: "cru", mix: ["foot", "crossbow"], kind: "foot", rows: 2, cols: 5, color: C.jerusalem, at: [46, 24] },
          ships: { label: "Christian fleet", side: "cru", kind: "ship", rows: 1, cols: 3, color: "#7d2a52", at: [5, 30] },
          phil: { label: "Philip II", side: "cru", kind: "king", rows: 1, cols: 1, color: C.philip, leader: true, start: [54, 6] },
          tre1: { label: "Bad Neighbour", side: "cru", kind: "trebuchet", color: C.philip, start: [44, 12] },
          ric: { label: "Richard I", side: "cru", kind: "king", rows: 1, cols: 1, color: C.richard, leader: true, start: [4, 52] },
          tre2: { label: "God's Own Sling", side: "cru", kind: "trebuchet", color: C.plain, start: [44, 32] },
          xb: { label: "Crossbowmen", side: "cru", kind: "crossbow", rows: 2, cols: 4, color: C.richard, start: [52, 52] },
          kn: { label: "Knights", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.richard, start: [56, 40] },
          gar: { label: "Garrison", side: "foe", kind: "archer", rows: 2, cols: 5, color: C.ayyubid, at: [24, 22] },
          sal: { label: "Saladin", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.ayyubid, leader: true, start: [106, 26] },
          sal2: { label: "Saladin's army", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.turk, start: [106, 44] },
        },
        phases: [
          {
            caption: "28 August 1189. King Guy, freed by Saladin, arrives with a small army and camps on the hill of Toron. Christian ships close the sea.",
            set: { guy: { state: "hold" }, foot: { state: "hold" }, ships: { at: [6, 26], state: "hold" }, gar: { state: "hold" } },
            fx: [{ type: "arrows", from: "gar", to: "foot", rate: 4 }],
          },
          {
            caption: "Saladin comes up and surrounds the besiegers, who are now besieged themselves. Through two winters of hunger and disease they fight on both fronts.",
            set: { sal: { at: [80, 26], state: "fight", facing: -1 }, sal2: { at: [80, 44], state: "fight", facing: -1 }, foot: { state: "fight" } },
            fx: [{ type: "arrows", from: "sal", to: "guy" }, { type: "arrows", from: "gar", to: "foot" }],
          },
          {
            caption: "April 1191. Philip of France lands and sets up his great trebuchet, Bad Neighbour. The garrison answers with an engine it calls Bad Kinsman.",
            set: { phil: { at: [52, 10], state: "hold" }, tre1: { at: [42, 12], state: "fight" }, sal: { state: "hold" }, sal2: { state: "hold" } },
            fx: [{ type: "stones", from: "tre1", to: "gar", rate: 4 }, { type: "stones", from: "gar", to: "tre1", rate: 2 }],
          },
          {
            caption: "June 1191. Richard arrives with his fleet. God's Own Sling, paid for from common funds, joins the bombardment of the Accursed Tower.",
            set: { ric: { at: [50, 48], state: "hold" }, tre2: { at: [42, 30], state: "fight" }, xb: { at: [48, 40] }, kn: { at: [58, 38] } },
            fx: [{ type: "stones", from: "tre1", to: "gar", rate: 4 }, { type: "stones", from: "tre2", to: "gar", rate: 4 }],
          },
          {
            caption: "Miners and assaults bring down the walls. Saladin attacks the camp to draw the besiegers off, but the knights and crossbowmen hold the ditches.",
            set: {
              sal: { at: [74, 30], state: "fight" }, kn: { at: [66, 32], state: "fight" },
              sal2: { at: [76, 44], state: "fight" }, xb: { at: [64, 44], state: "fight" }, gar: { state: "fight" },
            },
            fx: [{ type: "clash", a: "kn", b: "sal" }, { type: "arrows", from: "xb", to: "sal2", rate: 10 }, { type: "stones", from: "tre1", to: "gar", rate: 4 }, { type: "stones", from: "tre2", to: "gar", rate: 3 }],
          },
          {
            caption: "12 July 1191. The exhausted garrison surrenders. The kings' banners go up over Acre after nearly two years of siege.",
            set: {
              gar: { state: "hidden" }, tre1: { state: "hold" }, tre2: { state: "hold" },
              phil: { at: [24, 16], state: "hold" }, ric: { at: [26, 30], state: "hold" }, guy: { at: [18, 24], state: "hold" },
              sal: { at: [110, 26], state: "flee", facing: 1 }, sal2: { at: [110, 44], state: "flee", facing: 1 },
              kn: { state: "hold" }, xb: { state: "hold" }, foot: { state: "hold" },
            },
          },
        ],
      },

      arsuf: {
        id: "arsuf",
        title: "The battle of Arsuf",
        date: "7 September 1191",
        place: "North of Arsuf",
        terrain: [
          { type: "sea", poly: [[0, 0], [14, 0], [13, 30], [12, 62], [0, 62]], label: "Sea", labelAt: [6, 8] },
          { type: "road", path: [[24, 0], [24, 30], [22, 62]] },
          { type: "trees", at: [82, 18], r: 13, n: 18, label: "Forest of Arsuf", labelAt: [82, 4] },
          { type: "trees", at: [86, 46], r: 11, n: 12 },
          { type: "walls", path: [[14, 54], [26, 54], [26, 61], [14, 61]], closed: true },
          { type: "label", text: "Arsuf", at: [20, 51] },
          { type: "label", text: "from Caesarea", at: [32, 3] },
        ],
        units: {
          hos: { label: "Hospitallers", side: "cru", kind: "hospitaller", rows: 2, cols: 3, at: [28, 6] },
          fr: { label: "French", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.philip, at: [28, 15] },
          nor: { label: "Normans and English", side: "cru", kind: "knight", rows: 2, cols: 3, color: C.richard, at: [28, 24] },
          ric: { label: "King Richard", side: "cru", kind: "king", rows: 1, cols: 1, color: C.richard, leader: true, at: [33, 22] },
          bret: { label: "Bretons and Angevins", side: "cru", kind: "knight", rows: 2, cols: 3, color: "#7d2a52", at: [28, 33] },
          tem: { label: "Templars", side: "cru", kind: "templar", rows: 2, cols: 3, at: [28, 42] },
          bag: { label: "Baggage and pilgrims", side: "cru", kind: "pilgrim", rows: 5, cols: 1, at: [19, 22] },
          xb: { label: "Crossbowmen and foot", side: "cru", mix: ["crossbow", "foot"], kind: "crossbow", rows: 6, cols: 2, color: C.plain, at: [37, 26] },
          sal: { label: "Saladin", side: "foe", kind: "horsearcher", rows: 1, cols: 3, color: C.ayyubid, leader: true, start: [90, 32] },
          h1: { label: "Horse archers", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.turk, start: [92, 10] },
          h2: { label: "Horse archers", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.ayyubid, start: [92, 50] },
          ff: { label: "Foot archers", side: "foe", kind: "archer", rows: 2, cols: 4, color: C.foot, start: [86, 28] },
        },
        phases: [
          {
            caption: "7 September 1191. Richard's army marches south toward Arsuf in close order. The sea guards its right, and foot soldiers screen the landward side.",
            set: {
              hos: { at: [28, 10] }, fr: { at: [28, 19] }, nor: { at: [28, 28] }, ric: { at: [33, 26] }, bret: { at: [28, 37] },
              tem: { at: [28, 46] }, bag: { at: [19, 26] }, xb: { at: [37, 30] },
            },
          },
          {
            caption: "Saladin's army bursts out of the forest. Horse archers and foot swarm against the column, aiming above all at the rear.",
            set: {
              h1: { at: [56, 10], state: "fight", facing: -1 }, ff: { at: [54, 28], state: "fight", facing: -1 },
              h2: { at: [58, 46], state: "fight", facing: -1 }, sal: { at: [72, 30], state: "hold", facing: -1 },
              hos: { state: "hold" }, fr: { state: "hold" }, nor: { state: "hold" }, ric: { state: "hold" }, bret: { state: "hold" },
              tem: { state: "hold" }, bag: { state: "hold" }, xb: { state: "fight" },
            },
            fx: [{ type: "arrows", from: "h1", to: "hos", rate: 12 }, { type: "arrows", from: "ff", to: "xb" }, { type: "arrows", from: "h2", to: "tem" }, { type: "arrows", from: "xb", to: "ff", rate: 10 }],
          },
          {
            caption: "The Hospitallers are losing horses under the arrows. Their Master begs leave to charge. Richard tells him to wait for the signal.",
            set: { ric: { at: [33, 12], state: "hold" }, h1: { at: [50, 8] } },
            fx: [{ type: "arrows", from: "h1", to: "hos", rate: 14 }, { type: "arrows", from: "ff", to: "xb" }, { type: "arrows", from: "xb", to: "ff" }],
          },
          {
            caption: "The Marshal of the Hospital and Baldwin Carew break ranks and charge. The whole rear goes with them.",
            set: { hos: { at: [48, 9], state: "fight" }, fr: { at: [46, 18], state: "fight" }, h1: { at: [54, 9], state: "fight", facing: -1 } },
            fx: [{ type: "clash", a: "hos", b: "h1" }, { type: "clash", a: "fr", b: "ff" }, { type: "arrows", from: "h2", to: "tem" }],
          },
          {
            caption: "Richard sees the charge cannot be recalled and sends in the whole army. Saladin's men are thrown back toward the forest.",
            set: {
              ric: { at: [52, 24], state: "fight" }, nor: { at: [50, 28], state: "fight" }, bret: { at: [50, 37], state: "fight" }, tem: { at: [52, 46], state: "fight" },
              h1: { at: [66, 8], state: "fight" }, ff: { at: [108, 30], state: "flee", facing: 1 }, h2: { at: [64, 46], state: "fight" },
              hos: { at: [60, 10] }, fr: { at: [58, 18] },
            },
            fx: [{ type: "clash", a: "hos", b: "h1" }, { type: "clash", a: "tem", b: "h2" }, { type: "clash", a: "bret", b: "h2" }],
          },
          {
            caption: "Saladin rallies his men at the edge of the wood. Richard charges again, then halts and keeps his army together. That evening it camps at Arsuf.",
            set: {
              sal: { at: [108, 30], state: "flee", facing: 1 }, h1: { at: [108, 8], state: "flee", facing: 1 }, h2: { at: [108, 52], state: "flee", facing: 1 },
              ric: { at: [60, 26], state: "hold" }, nor: { at: [58, 30], state: "hold" }, bret: { at: [58, 38], state: "hold" }, tem: { at: [60, 46], state: "hold" },
              hos: { state: "hold" }, fr: { state: "hold" }, xb: { state: "hold" },
            },
          },
        ],
      },

      jaffa: {
        id: "jaffa",
        title: "The battle of Jaffa",
        date: "1–5 August 1192",
        place: "Jaffa",
        terrain: [
          { type: "sea", poly: [[0, 0], [16, 0], [14, 24], [12, 40], [16, 62], [0, 62]], label: "Sea", labelAt: [6, 8] },
          { type: "walls", path: [[14, 24], [30, 22], [34, 36], [28, 46], [13, 44]], closed: true },
          { type: "landmark", kind: "citadel", at: [19, 30], size: 5 },
          { type: "label", text: "Jaffa", at: [24, 42] },
          { type: "tents", at: [44, 34], n: 5, r: 6, color: C.richard },
          { type: "road", path: [[34, 34], [60, 30], [100, 26]] },
          { type: "tents", at: [88, 16], n: 8, r: 8, color: C.ayyubid, label: "Saladin's camp", labelAt: [88, 26] },
          { type: "hills", at: [78, 56], w: 34, h: 7 },
        ],
        units: {
          gar: { label: "Garrison in the citadel", side: "cru", kind: "foot", rows: 1, cols: 3, color: C.plain, at: [19, 34] },
          occ: { label: "Saladin's troops in the town", side: "foe", kind: "foot", rows: 2, cols: 4, color: C.turk, at: [26, 38] },
          ships: { label: "Richard's galleys", side: "cru", kind: "ship", rows: 1, cols: 3, color: C.richard, start: [-10, 36] },
          ric: { label: "King Richard", side: "cru", kind: "king", rows: 1, cols: 1, color: C.richard, leader: true, start: [6, 38] },
          kn: { label: "Knights on foot", side: "cru", kind: "foot", rows: 5, cols: 2, color: C.richard, start: [6, 42] },
          xb: { label: "Crossbowmen", side: "cru", kind: "crossbow", rows: 5, cols: 2, color: "#7d2a52", start: [6, 30] },
          sal: { label: "Saladin", side: "foe", kind: "horsearcher", rows: 1, cols: 3, color: C.ayyubid, leader: true, at: [86, 26] },
          c1: { label: "Mamluk cavalry", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.ayyubid, start: [92, 10] },
          c2: { label: "Turkish cavalry", side: "foe", kind: "horsearcher", rows: 2, cols: 4, color: C.turk, start: [92, 48] },
        },
        phases: [
          {
            caption: "Late July 1192. Saladin storms Jaffa while Richard is at Acre. His troops pour into the town, and the garrison holds out in the citadel.",
            set: { occ: { at: [24, 37], state: "fight", facing: -1 }, gar: { state: "fight", facing: 1 }, sal: { state: "hold" } },
            fx: [{ type: "clash", a: "occ", b: "gar" }],
          },
          {
            caption: "1 August. Richard's galleys sail in. Seeing the citadel still holds, the king leaps into the sea and wades ashore at the head of his men.",
            set: { ships: { at: [5, 36], state: "hold" }, ric: { at: [14, 38], state: "fight" }, kn: { at: [16, 42], state: "fight" }, xb: { at: [15, 30], state: "fight" } },
            fx: [{ type: "arrows", from: "xb", to: "occ", rate: 10 }, { type: "clash", a: "kn", b: "occ" }],
          },
          {
            caption: "The small force clears the town. Richard camps outside the walls with a few dozen knights, few with horses, and some two thousand foot.",
            set: {
              occ: { at: [108, 34], state: "flee", facing: 1 }, gar: { state: "hold" },
              ric: { at: [44, 30], state: "hold" }, kn: { at: [52, 32], state: "hold", facing: 1 }, xb: { at: [47, 32], state: "hold", facing: 1 },
            },
          },
          {
            caption: "5 August, dawn. Saladin's cavalry attacks. The knights kneel behind their shields with lances braced. Behind them crossbowmen work in pairs, one loading, one shooting.",
            set: { c1: { at: [72, 20], state: "fight", facing: -1 }, c2: { at: [72, 44], state: "fight", facing: -1 }, sal: { at: [84, 30], state: "hold", facing: -1 } },
            fx: [{ type: "arrows", from: "xb", to: "c1", rate: 12 }, { type: "arrows", from: "xb", to: "c2", rate: 12 }, { type: "arrows", from: "c1", to: "kn", rate: 6 }],
            dur: 7000,
          },
          {
            caption: "Wave after wave of horsemen rides at the line and turns away before the hedge of lances.",
            set: { c1: { at: [58, 26] }, c2: { at: [58, 40] } },
            fx: [{ type: "clash", a: "c1", b: "kn" }, { type: "clash", a: "c2", b: "kn" }, { type: "arrows", from: "xb", to: "c1", rate: 14 }, { type: "arrows", from: "xb", to: "c2", rate: 14 }],
          },
          {
            caption: "Late in the day Richard mounts with a handful of knights and charges. Saladin's army draws off, and Jaffa stays in Christian hands.",
            set: {
              ric: { at: [66, 30], state: "fight" }, c1: { at: [108, 14], state: "flee", facing: 1 },
              c2: { at: [108, 50], state: "flee", facing: 1 }, sal: { at: [108, 28], state: "flee", facing: 1 },
            },
            fx: [{ type: "arrows", from: "xb", to: "c2", rate: 6 }],
          },
        ],
      },

      gisors: {
        id: "gisors",
        title: "The kings take the cross",
        date: "21 January 1188",
        place: "The elm of Gisors, Normandy",
        terrain: [
          { type: "landmark", kind: "castle", at: [10, 14], size: 6, label: "Gisors", labelAt: [10, 22] },
          { type: "river", path: [[58, 0], [55, 20], [59, 40], [56, 62]], w: 2, label: "River Epte", labelAt: [66, 58] },
          { type: "trees", at: [46, 14], r: 4, n: 3, label: "The elm", labelAt: [46, 6] },
          { type: "dais", at: [46, 26], w: 12, h: 4 },
          { type: "tents", at: [16, 46], n: 5, r: 7, color: C.richard },
          { type: "tents", at: [86, 46], n: 5, r: 7, color: C.philip },
          { type: "label", text: "Normandy", at: [22, 4] },
          { type: "label", text: "France", at: [80, 4] },
        ],
        units: {
          arch: { label: "Archbishop Joscius of Tyre", side: "cru", kind: "bishop", rows: 1, cols: 1, start: [46, -6] },
          henry: { label: "Henry II of England", side: "cru", kind: "king", rows: 1, cols: 1, color: C.richard, leader: true, at: [28, 32] },
          phil: { label: "Philip II of France", side: "cru", kind: "king", rows: 1, cols: 1, color: C.philip, leader: true, at: [72, 32] },
          flan: { label: "Philip of Flanders", side: "cru", kind: "knight", rows: 1, cols: 2, color: C.flanders, at: [80, 24] },
          eng: { label: "English and Normans", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.richard, at: [20, 40] },
          fre: { label: "French", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.philip, at: [80, 40] },
          crowd: { label: "Clergy and people", side: "cru", kind: "crowd", rows: 2, cols: 6, at: [46, 50] },
        },
        phases: [
          {
            caption: "21 January 1188. Henry II and Philip II meet at the great elm between Gisors and Trie, on the border of Normandy, to argue over land.",
            set: { henry: { state: "hold", facing: 1 }, phil: { state: "hold", facing: -1 }, eng: { state: "hold" }, fre: { state: "hold", facing: -1 }, flan: { state: "hold", facing: -1 }, crowd: { state: "hold" } },
          },
          {
            caption: "Joscius, Archbishop of Tyre, comes from the East with news of Hattin and the loss of Jerusalem, and preaches the cross.",
            set: { arch: { at: [46, 25], state: "hold" } },
            dur: 6000,
          },
          {
            caption: "The two kings, long at war, make peace and take the cross together. Count Philip of Flanders follows them.",
            set: { henry: { at: [38, 32] }, phil: { at: [54, 32] }, flan: { at: [62, 26] } },
          },
          {
            caption: "Their men take the cross by nations: red crosses for the French, white for the English, green for the Flemings. Both kings then decree the Saladin tithe.",
            set: { eng: { at: [30, 40] }, fre: { at: [66, 40] }, crowd: { at: [46, 44] } },
            dur: 6400,
          },
        ],
      },

      vezelay: {
        id: "vezelay",
        title: "The kings set out from Vézelay",
        date: "4 July 1190",
        place: "Vézelay, Burgundy",
        terrain: [
          { type: "hills", at: [50, 12], w: 48, h: 14, label: "Hill of Vézelay", labelAt: [82, 6] },
          { type: "landmark", kind: "cathedral", at: [50, 9], size: 8, label: "Church of the Magdalene", labelAt: [50, 20] },
          { type: "road", path: [[50, 18], [50, 38], [30, 62]] },
          { type: "road", path: [[50, 38], [72, 62]] },
          { type: "dais", at: [50, 28], w: 14, h: 4 },
          { type: "tents", at: [16, 40], n: 7, r: 9, color: C.richard },
          { type: "tents", at: [84, 40], n: 7, r: 9, color: C.philip },
          { type: "label", text: "to Lyon", at: [50, 60] },
        ],
        units: {
          bish: { label: "Bishops and abbots", side: "cru", kind: "bishop", rows: 1, cols: 3, at: [50, 26] },
          pri: { label: "Monks of Vézelay", side: "cru", kind: "priest", rows: 1, cols: 4, at: [50, 21] },
          ric: { label: "Richard I", side: "cru", kind: "king", rows: 1, cols: 1, color: C.richard, leader: true, start: [22, 34] },
          phil: { label: "Philip II", side: "cru", kind: "king", rows: 1, cols: 1, color: C.philip, leader: true, start: [78, 34] },
          eng: { label: "Richard's knights", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.richard, at: [18, 48] },
          fra: { label: "French knights", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.philip, at: [82, 48] },
          crowd: { label: "Pilgrims and townsfolk", side: "cru", kind: "crowd", rows: 2, cols: 7, at: [50, 46] },
        },
        phases: [
          {
            caption: "4 July 1190, three years to the day after Hattin. The French and English armies gather below Vézelay, where St Bernard preached the Second Crusade.",
            set: { bish: { state: "hold" }, pri: { state: "hold" }, eng: { state: "hold" }, fra: { state: "hold", facing: -1 }, crowd: { state: "hold" } },
          },
          {
            caption: "Richard and Philip meet. They have sworn to share equally whatever they win on the journey.",
            set: { ric: { at: [43, 33], state: "hold", facing: 1 }, phil: { at: [57, 33], state: "hold", facing: -1 } },
          },
          {
            caption: "The clergy bless the host, and the two kings ride out together at the head of their armies.",
            set: { ric: { at: [46, 40] }, phil: { at: [54, 40] }, crowd: { at: [50, 52] }, eng: { at: [36, 50] }, fra: { at: [64, 50] } },
          },
          {
            caption: "At Lyon a bridge over the Rhône gives way under the crowds. There the kings part: Philip for Genoa, Richard for Marseille.",
            set: { ric: { at: [-8, 60] }, eng: { at: [-10, 54] }, phil: { at: [108, 60] }, fra: { at: [110, 54] } },
            dur: 6200,
          },
        ],
      },
    },
  });
})();
