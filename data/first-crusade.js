// The First Crusade, 1095–1099.
// Coordinates are [longitude, latitude]. See docs/DATA.md for the format.
// A chapter's `routes` sets how far each army has travelled by the end of that
// chapter, as a vertex index into the route's `points` (fractions are fine).
// Routes not named keep their progress from the chapter before.
// Scenes (battles and moments) use a 100 × 62 space, north at top.
(() => {
  const C = {
    godfrey: "#7d2a52", raymond: "#2e6a4f", bohemond: "#5b3e8c", main: "#a8301d",
    peter: "#a5650f", flanders: "#2a5e88", adhemar: "#94701f", tancred: "#7a5fae",
    seljuk: "#3f6b6b", mosul: "#5d6b3a", fatimid: "#cbbf9f",
  };

  window.CRUSADES = window.CRUSADES || [];
  window.CRUSADES.push({
  id: "first",
  order: 1,
  name: "The First Crusade",
  years: "1095–1099",
  blurb: "Answering a plea from Byzantium, armies of knights and pilgrims cross Europe and Anatolia and take Jerusalem in 1099.",

  routes: {
    peter: {
      label: "Peter the Hermit",
      color: "--r-peter",
      until: "civetot",
      dashed: true,
      column: ["leader", "pilgrim", "foot", "pilgrim", "pilgrim", "foot", "pilgrim", "pilgrim", "pilgrim"],
      points: [
        [6.96, 50.94],   // 0 Cologne
        [12.10, 49.01],  // 1 Regensburg
        [16.37, 48.21],  // 2 Vienna
        [16.59, 47.68],  // 3 Sopron
        [20.41, 44.84],  // 4 Belgrade
        [21.90, 43.32],  // 5 Niš
        [23.32, 42.70],  // 6 Sofia
        [24.75, 42.15],  // 7 Philippopolis
        [26.56, 41.68],  // 8 Adrianople
        [28.98, 41.01],  // 9 Constantinople
        [29.53, 40.66],  // 10 Civetot
      ],
    },
    godfrey: {
      label: "Godfrey",
      color: "--r-godfrey",
      until: "constantinople",
      points: [
        [5.07, 49.79],   // 0 Bouillon
        [8.27, 50.00],   // 1 Mainz
        [12.10, 49.01],  // 2 Regensburg
        [16.37, 48.21],  // 3 Vienna
        [16.59, 47.68],  // 4 Sopron
        [20.41, 44.84],  // 5 Belgrade
        [21.90, 43.32],  // 6 Niš
        [23.32, 42.70],  // 7 Sofia
        [24.75, 42.15],  // 8 Philippopolis
        [26.56, 41.68],  // 9 Adrianople
        [28.25, 41.07],  // 10 Selymbria
        [28.98, 41.01],  // 11 Constantinople
      ],
    },
    raymond: {
      label: "Raymond",
      color: "--r-raymond",
      until: "constantinople",
      points: [
        [1.44, 43.60],   // 0 Toulouse
        [5.92, 45.57],   // 1 Savoy
        [9.19, 45.46],   // 2 Milan
        [12.33, 45.44],  // 3 Venice
        [14.44, 45.33],  // 4 Rijeka
        [16.44, 43.51],  // 5 Split
        [18.09, 42.65],  // 6 Ragusa
        [19.51, 42.07],  // 7 Scutari
        [19.45, 41.32],  // 8 Dyrrachium
        [20.80, 41.12],  // 9 Ohrid
        [22.94, 40.64],  // 10 Thessalonica
        [27.51, 40.98],  // 11 Rodosto
        [28.98, 41.01],  // 12 Constantinople
      ],
    },
    bohemond: {
      label: "Bohemond",
      color: "--r-bohemond",
      until: "constantinople",
      points: [
        [16.87, 41.12],  // 0 Bari
        [18.30, 40.85],  // 1 Adriatic crossing
        [19.49, 40.47],  // 2 Avlona
        [21.27, 40.52],  // 3 Kastoria
        [22.94, 40.64],  // 4 Thessalonica
        [23.55, 41.09],  // 5 Serres
        [26.63, 40.86],  // 6 Rusa
        [28.98, 41.01],  // 7 Constantinople
      ],
    },
    main: {
      label: "Crusader army",
      color: "--r-main",
      column: ["leader", "knight", "knight", "foot", "knight", "foot", "foot", "foot", "pilgrim", "foot", "pilgrim", "pilgrim"],
      points: [
        [28.98, 41.01],  // 0 Constantinople
        [29.35, 40.82],  // 1 Pelekanon
        [29.92, 40.77],  // 2 Nicomedia
        [29.72, 40.43],  // 3 Nicaea
        [30.15, 40.15],  // 4 Leuke
        [30.52, 39.78],  // 5 Dorylaeum
        [31.42, 38.35],  // 6 Philomelium
        [32.48, 37.87],  // 7 Iconium
        [34.05, 37.51],  // 8 Heraclea
        [35.48, 38.72],  // 9 Caesarea
        [36.50, 38.02],  // 10 Coxon
        [36.93, 37.58],  // 11 Marash
        [36.16, 36.20],  // 12 Antioch
        [36.67, 35.64],  // 13 Ma'arra
        [36.05, 34.53],  // 14 Arqa
        [35.85, 34.44],  // 15 Tripoli
        [35.50, 33.89],  // 16 Beirut
        [35.37, 33.56],  // 17 Sidon
        [35.20, 33.27],  // 18 Tyre
        [35.07, 32.92],  // 19 Acre
        [34.89, 32.50],  // 20 Caesarea Maritima
        [34.87, 31.93],  // 21 Ramla
        [35.23, 31.78],  // 22 Jerusalem
      ],
    },
    baldwin: {
      label: "Baldwin",
      color: "--r-baldwin",
      column: ["leader", "knight", "knight", "knight"],
      points: [
        [34.05, 37.51],  // 0 Heraclea
        [34.78, 37.28],  // 1 Cilician Gates
        [34.90, 36.92],  // 2 Tarsus
        [36.93, 37.58],  // 3 Marash
        [37.93, 36.84],  // 4 Turbessel
        [38.79, 37.16],  // 5 Edessa
      ],
    },
    ascalon: {
      label: "Godfrey",
      color: "--r-main",
      until: "ascalon",
      points: [
        [35.23, 31.78],  // 0 Jerusalem
        [34.55, 31.67],  // 1 Ascalon
      ],
    },
  },

  regions: [
    { name: "Kingdom of France", at: [2.4, 47.2] },
    { name: "Holy Roman Empire", at: [10.6, 51.2] },
    { name: "Kingdom of Hungary", at: [19.6, 47.6] },
    { name: "Byzantine Empire", at: [22.6, 39.2] },
    { name: "Sultanate of Rûm", at: [33.2, 39.1] },
    { name: "Great Seljuk Empire", at: [44.0, 35.0] },
    { name: "Fatimid Caliphate", at: [30.8, 29.0] },
    { name: "Mediterranean Sea", at: [18.5, 35.2], sea: true },
    { name: "Black Sea", at: [34.5, 43.2], sea: true },
    { name: "County of Edessa", at: [38.9, 37.7], from: "edessa", state: true },
    { name: "Principality of Antioch", at: [36.6, 36.6], from: "antioch-falls", state: true },
    { name: "Kingdom of Jerusalem", at: [35.4, 32.4], from: "defender", state: true },
  ],


  // Drawn landmarks. Event places without one get a battle mark or a dot.
  landmarks: [
    { name: "Jerusalem", at: [35.23, 31.78], icon: "jerusalem", major: true },
    { name: "Constantinople", at: [28.98, 41.01], icon: "hagia", major: true, today: "İstanbul, Turkey" },
    { name: "Antioch", at: [36.16, 36.20], icon: "antioch", major: true, today: "Antakya, Turkey" },
    { name: "Rome", at: [12.50, 41.90], icon: "basilica", major: true, today: "Rome, Italy" },
    { name: "Clermont", at: [3.08, 45.78], icon: "cathedral", today: "Clermont-Ferrand, France" },
    { name: "Cologne", at: [6.96, 50.94], icon: "cathedral", today: "Köln, Germany" },
    { name: "Piacenza", at: [9.69, 45.05], icon: "town", today: "Piacenza, Italy" },
    { name: "Bouillon", at: [5.07, 49.79], icon: "castle", today: "Bouillon, Belgium" },
    { name: "Toulouse", at: [1.44, 43.60], icon: "town", today: "Toulouse, France" },
    { name: "Bari", at: [16.87, 41.12], icon: "town", today: "Bari, Italy" },
    { name: "Nicaea", at: [29.72, 40.43], icon: "walled", today: "İznik, Turkey" },
    { name: "Edessa", at: [38.79, 37.16], icon: "citadel", today: "Şanlıurfa, Turkey" },
    { name: "Tripoli", at: [35.85, 34.44], icon: "town", today: "Tripoli, Lebanon" },
    { name: "Acre", at: [35.07, 32.92], icon: "town", today: "Akko, Israel" },
    { name: "Ascalon", at: [34.55, 31.67], icon: "walled", today: "Ashkelon, Israel" },
  ],

  figures: {
    urban: {
      name: "Pope Urban II",
      role: "Pope, 1088–1099",
      life: "c. 1035–1099",
      portrait: { kind: "pope", color: "#efe6d2", color2: "#c9a23a", beard: true, emblem: "keys" },
      bio: [
        "Born Odo of Châtillon in Champagne, he became a monk at the great reforming abbey of Cluny before Pope Gregory VII made him a cardinal.",
        "As pope he carried on the Gregorian reform of the Church. He answered the Byzantine plea for help and preached the crusade at Clermont, then toured France for months recruiting.",
        "He died in Rome on 29 July 1099, two weeks after Jerusalem fell and before the news could reach him. He was beatified in 1881.",
      ],
    },
    alexios: {
      name: "Alexios I Komnenos",
      role: "Byzantine Emperor, 1081–1118",
      life: "1057–1118",
      portrait: { kind: "emperor", color: "#6b2a6e", color2: "#d2a33a", beard: true, emblem: "cross" },
      bio: [
        "A soldier who seized the throne of an empire in crisis. Over fourteen years he beat back Normans, Pechenegs and Turks and rebuilt the Byzantine state.",
        "His appeal at Piacenza started the crusade. He asked for mercenaries and got a mass movement. He made the princes swear to return former Byzantine lands, and recovered Nicaea and western Anatolia.",
        "His daughter Anna Komnene wrote his biography, the Alexiad, one of the main sources for the crusade.",
      ],
    },
    peter: {
      name: "Peter the Hermit",
      role: "Preacher of the People's Crusade",
      life: "c. 1050–1115",
      portrait: { kind: "hermit", color: "#a5650f", color2: "#6b4a2a", beard: true, emblem: "none" },
      bio: [
        "A priest from around Amiens who went barefoot and rode a donkey. His preaching across northern France and the Rhineland drew huge crowds.",
        "He led the People's Crusade, which was destroyed at Civetot while he was away in Constantinople. He joined the main army and stayed with it to the end.",
        "He preached to the army on the Mount of Olives before the final assault on Jerusalem. He returned to the West and died as prior of the monastery of Neufmoustier near Huy.",
      ],
    },
    godfrey: {
      name: "Godfrey of Bouillon",
      role: "Duke of Lower Lorraine; Defender of the Holy Sepulchre",
      life: "c. 1060–1100",
      portrait: { kind: "knight", color: "#7d2a52", color2: "#e9dcc0", beard: true, emblem: "cross" },
      bio: [
        "A descendant of Charlemagne through his mother, Ida of Boulogne, who was known for her piety. He mortgaged his castle of Bouillon to the Bishop of Liège to pay for the journey.",
        "His tower was the first to reach the walls of Jerusalem. Chosen to rule the city, he refused the title of king.",
        "He died on 18 July 1100, a year after the city fell, and was buried in the Church of the Holy Sepulchre. Later generations remembered him as the model Christian knight.",
      ],
    },
    bohemond: {
      name: "Bohemond of Taranto",
      role: "Norman prince; Prince of Antioch",
      life: "c. 1054–1111",
      // Anna Komnene describes him as clean-shaven.
      portrait: { kind: "knight", color: "#5b3e8c", color2: "#d8cfe8", beard: false, emblem: "cross" },
      bio: [
        "Son of the Norman adventurer Robert Guiscard. He had already fought the Byzantines in the Balkans, so Alexios knew him as an enemy.",
        "The ablest general on the crusade. He held the line at Dorylaeum and arranged the betrayal that opened Antioch.",
        "He kept Antioch for himself rather than marching to Jerusalem, and founded the Principality of Antioch.",
      ],
    },
    raymond: {
      name: "Raymond of Toulouse",
      role: "Count of Toulouse",
      life: "c. 1041–1105",
      portrait: { kind: "knight", color: "#2e6a4f", color2: "#d2a33a", beard: true, emblem: "cross" },
      bio: [
        "The oldest and richest of the princes, and the first to take the cross after Clermont. He travelled with the papal legate Adhemar.",
        "He vowed never to return home, and he kept that vow. He backed Peter Bartholomew and the Holy Lance.",
        "After Jerusalem he refused the crown. He died in 1105 while besieging Tripoli, which became the fourth crusader state.",
      ],
    },
    adhemar: {
      name: "Adhemar of Le Puy",
      role: "Bishop of Le Puy; papal legate",
      life: "d. 1 August 1098",
      portrait: { kind: "bishop", color: "#94701f", color2: "#efe6d2", beard: true, emblem: "cross" },
      bio: [
        "Urban's personal representative and the spiritual leader of the crusade. He was the first to take the cross at Clermont.",
        "He was both pastor and soldier. He led the flanking attack at Dorylaeum, and he organised fasts and processions in the worst days at Antioch.",
        "His death from plague after Antioch's capture left the army without a unifying voice, and quarrels between the princes followed.",
      ],
    },
    baldwin: {
      name: "Baldwin of Boulogne",
      role: "Count of Edessa; first King of Jerusalem",
      life: "c. 1060–1118",
      portrait: { kind: "knight", color: "#2a5e88", color2: "#e9dcc0", beard: true, emblem: "cross" },
      bio: [
        "Godfrey's younger brother. He left the main army to carve out the first crusader state at Edessa.",
        "When Godfrey died in 1100, Baldwin came south and was crowned the first King of Jerusalem on Christmas Day 1100 in Bethlehem.",
        "Over eighteen years he took most of the coastal cities and secured the kingdom.",
      ],
    },
    tancred: {
      name: "Tancred",
      role: "Bohemond's nephew; Prince of Galilee",
      life: "c. 1075–1112",
      portrait: { kind: "knight", color: "#7a5fae", color2: "#c9a23a", beard: false, emblem: "cross" },
      bio: [
        "A young Norman knight who crossed into Asia secretly rather than swear the oath to Alexios.",
        "He took Bethlehem on the night before the army reached Jerusalem, at the request of its Christian inhabitants.",
        "He later became Prince of Galilee and regent of Antioch.",
      ],
    },
  },

  chapters: [
    {
      id: "prologue",
      fight: true,
      date: "1009–1094",
      year: 1071,
      mapYear: 1094,
      title: "A Christian East under threat",
      place: "Manzikert, Armenia",
      at: [42.53, 39.15],
      view: { at: [33, 37], k: 2.1 },
      caption: "In 1071 the Seljuk Turks crushed the Byzantine army at Manzikert. Within a decade most of Christian Anatolia was lost, and pilgrims told of a dangerous road to Jerusalem.",
      body: [
        "Christianity was born in the East. For a thousand years, believers had lived and worshipped across Syria, Anatolia and the Holy Land. Jerusalem had been under Muslim rule since 638, but Western pilgrims still made the long journey to the Church of the Holy Sepulchre, built over the tomb of Christ.",
        "In 1009 the Fatimid caliph al-Hakim had the Holy Sepulchre destroyed, and it was only partly rebuilt. Then in 1071 the Seljuk Turks crushed the Byzantine army at Manzikert and captured Emperor Romanos IV. Within a decade most of Anatolia was lost. Nicaea, where the Nicene Creed was written in 325, became a Turkish capital.",
        "Pilgrims coming home told of a dangerous road. The Christian East was shrinking.",
      ],
      myth: {
        myth: "The crusades were an unprovoked attack on a peaceful Muslim world.",
        fact: "The First Crusade answered a Byzantine appeal for help after a generation of Turkish conquests in Christian Anatolia and Syria. Whatever one thinks of the war, it was a response to those events.",
      },
      today: "Malazgirt, Muş Province, Turkey.",
      sources: [
        { title: "Peter Frankopan, The First Crusade: The Call from the East (2012)" },
        { title: "Thomas Asbridge, The First Crusade: A New History (2004)" },
      ],
      figures: [],
    },
    {
      id: "piacenza",
      date: "March 1095",
      year: 1095,
      mapYear: 1095.2,
      title: "A plea from Constantinople",
      place: "Piacenza, Italy",
      at: [9.69, 45.05],
      view: { at: [20, 44], k: 2.6 },
      caption: "March 1095. Envoys of Emperor Alexios reach a church council at Piacenza and ask Pope Urban II for Western knights to fight the Turks.",
      body: [
        "Emperor Alexios I Komnenos had spent fourteen years holding the Byzantine Empire together. In March 1095 his envoys reached a church council at Piacenza and asked Pope Urban II for Western knights to help fight the Turks.",
        "Urban saw more than a military alliance. The Great Schism of 1054 had split the Latin and Greek churches. Coming to the aid of Eastern Christians might help heal that wound.",
      ],
      quotes: [
        {
          text: "An embassy of the emperor of Constantinople came to this synod and humbly begged the lord pope and all the faithful of Christ to bring some help against the pagans for the defence of the holy Church.",
          source: "Bernold of Constance, Chronicle",
        },
      ],
      figures: ["urban", "alexios"],
    },
    {
      id: "clermont",
      moment: "clermont",
      date: "27 November 1095",
      year: 1095,
      mapYear: 1095.9,
      title: "Deus vult!",
      place: "Clermont, France",
      at: [3.08, 45.78],
      view: { at: [3.5, 46], k: 4.2 },
      caption: "27 November 1095. In a field outside Clermont, Urban II calls on the knights of the West to help the Eastern Christians and free Jerusalem. The crowd cries: God wills it!",
      body: [
        "At the end of a council in central France, Urban preached in a field outside Clermont, because no church could hold the crowd. He spoke of Eastern Christians suffering and of Jerusalem in foreign hands. He told knights who spent their lives fighting each other to take up a different kind of warfare: an armed pilgrimage.",
        "The crowd answered with one cry: God wills it! Bishop Adhemar of Le Puy knelt first to take the cross. People cut cloth into crosses and sewed them onto their shoulders, taking literally Christ's words to take up the cross and follow him.",
        "The council decreed that the journey would count in place of all penance for sin.",
      ],
      quotes: [
        {
          text: "Let those who have formerly been accustomed to contend wickedly in private warfare against the faithful now fight against the infidels. Let those who for a long time have been robbers now become knights.",
          source: "Fulcher of Chartres, who was probably present",
          url: "https://sourcebooks.web.fordham.edu/source/urban2-5vers.asp",
        },
        {
          text: "Whoever goes to Jerusalem to free the Church of God, out of devotion alone and not to gain honour or money, may count that journey in place of all penance.",
          source: "Decree of the Council of Clermont",
        },
      ],
      today: "Clermont-Ferrand, France. A fountain with a statue of Urban II stands in the Place de la Victoire.",
      sources: [
        { title: "Urban II at Clermont: the versions of Fulcher, Robert the Monk, Baldric, Guibert and the Gesta (Internet Medieval Sourcebook)", url: "https://sourcebooks.web.fordham.edu/source/urban2-5vers.asp" },
      ],
      figures: ["urban", "adhemar"],
    },
    {
      id: "peoples-crusade",
      date: "April–August 1096",
      year: 1096,
      mapYear: 1096.5,
      title: "The People's Crusade",
      place: "Cologne to Constantinople",
      at: [6.96, 50.94],
      view: { at: [18, 46], k: 2.9 },
      routes: { peter: 9 },
      days: { from: "1096-04-20", to: "1096-08-01", label: "on the road" },
      caption: "Spring 1096. Peter the Hermit leads tens of thousands of commoners down the Danube. Other bands murder the Jews of the Rhineland, and bishops try to shelter them.",
      body: [
        "Urban set the departure for 15 August 1096, but many would not wait. Peter the Hermit gathered tens of thousands of commoners, along with some knights, women and children. They left Cologne at Easter and walked down the Danube.",
        "The march was disorderly. Fights over food broke out in Hungary, at Belgrade and at Niš. Other bands, led by Count Emicho, turned on the Jewish communities of the Rhineland at Speyer, Worms and Mainz. Some bishops sheltered the Jews in their own palaces. Christian chroniclers such as Albert of Aachen condemned the killings and saw the bands' later destruction in Hungary as God's judgment.",
        "Peter's column reached Constantinople on 1 August.",
      ],
      myth: {
        myth: "The Church ordered the massacres of the Rhineland Jews.",
        fact: "Urban's preaching said nothing against the Jews, and no Church authority called for the attacks. The bishops of Speyer, Worms and Mainz tried to shelter them, the Bishop of Speyer punished some of the killers, and Christian chroniclers condemned the massacres.",
      },
      today: "Köln, Germany.",
      sources: [
        { title: "Albert of Aachen, Historia Ierosolimitana, ed. and trans. Susan B. Edgington (2007)" },
      ],
      figures: ["peter"],
    },
    {
      id: "civetot",
      fight: true,
      date: "21 October 1096",
      year: 1096,
      mapYear: 1096.8,
      title: "Disaster at Civetot",
      place: "Civetot, Anatolia",
      at: [29.53, 40.66],
      view: { at: [29.4, 40.8], k: 9 },
      routes: { peter: 10 },
      caption: "21 October 1096. Against all advice, the People's Crusade marches out from Civetot and walks into a Turkish ambush. Most are killed or enslaved.",
      body: [
        "Alexios ferried Peter's followers across the Bosporus and told them to wait for the princes. They did not. Raiding parties pushed toward Nicaea.",
        "In October, while Peter was in Constantinople seeking supplies, the army marched out and walked into an ambush by Sultan Kilij Arslan. Most were killed or enslaved. Byzantine ships rescued a few thousand survivors.",
        "Peter survived. He would march with the main army all the way to Jerusalem.",
      ],
      myth: {
        myth: "The People's Crusade was the real crusade, a popular movement later taken over by the nobles.",
        fact: "Urban's plan was always for an armed host of knights under his legate, leaving on 15 August 1096. Peter's followers went early against that plan, and after Civetot Peter himself joined the princes' army.",
      },
      today: "Near Hersek, Yalova Province, Turkey, on the Gulf of İzmit.",
      figures: ["peter", "alexios"],
    },
    {
      id: "princes",
      date: "August 1096 – May 1097",
      year: 1096,
      mapYear: 1096.9,
      title: "The princes march",
      place: "Western Europe to Constantinople",
      at: [16.37, 48.21],
      view: { at: [14, 45], k: 2.6 },
      routes: { godfrey: 11, raymond: 12, bohemond: 7 },
      days: { from: "1096-08-15", to: "1097-05-14", label: "on the road" },
      caption: "August 1096. The great lords set out on Urban's appointed day. Godfrey goes through Hungary, Raymond down the Dalmatian coast, Bohemond across the Adriatic.",
      body: [
        "The main army set out on Urban's appointed day. No king went. It was led by great lords, each with his own following.",
        "Godfrey of Bouillon marched overland through Hungary. Raymond of Toulouse, with Bishop Adhemar, took the hard winter road down the Dalmatian coast. Bohemond sailed from southern Italy across the Adriatic. Hugh of Vermandois, Robert of Normandy, Robert of Flanders and Stephen of Blois led other contingents.",
        "Historians estimate 60,000 to 100,000 people in all, perhaps 7,000 of them knights. Most paid their own way. Crusading cost a fortune, and many sold or mortgaged their land to go.",
      ],
      myth: {
        myth: "Crusaders went east for loot and land.",
        fact: "Going cost a knight several years' income, and families sold or mortgaged land to pay for it. Jonathan Riley-Smith's study of their charters found that most went for penance and pilgrimage, and most survivors went home with little.",
      },
      sources: [
        { title: "Jonathan Riley-Smith, The First Crusaders, 1095–1131 (1997)" },
      ],
      figures: ["godfrey", "raymond", "bohemond", "adhemar", "tancred", "baldwin"],
    },
    {
      id: "constantinople",
      date: "December 1096 – April 1097",
      year: 1097,
      mapYear: 1097.2,
      title: "The emperor's oath",
      place: "Constantinople",
      at: [28.98, 41.01],
      view: { at: [28.98, 41.01], k: 8 },
      caption: "Winter 1096–97. In Constantinople, the greatest Christian city in the world, Alexios asks each prince to swear to return former Byzantine lands. Most swear.",
      body: [
        "Constantinople was the greatest Christian city in the world, with ten times the population of any city in the West. Its walls, churches and relics left the Westerners in awe.",
        "Alexios needed the princes on his side. He asked each to swear to hand back any former Byzantine land they took. Most swore. Raymond would only promise to respect the emperor's life and honour. Tancred slipped across to Asia rather than swear.",
        "In return, Alexios promised food, guides and troops. By spring the army was across the Bosporus.",
      ],
      today: "İstanbul, Turkey. The Theodosian land walls and Hagia Sophia still stand.",
      figures: ["alexios", "godfrey", "bohemond", "raymond", "tancred"],
    },
    {
      id: "nicaea",
      camp: "cru",
      date: "14 May – 19 June 1097",
      year: 1097,
      mapYear: 1097.47,
      title: "The siege of Nicaea",
      place: "Nicaea",
      at: [29.72, 40.43],
      view: { at: [29.7, 40.5], k: 10 },
      routes: { main: 3 },
      days: { from: "1097-05-14", to: "1097-06-19", label: "of the siege" },
      caption: "May–June 1097. The army besieges Nicaea, the Turkish sultan's capital. Byzantine boats close the lake, and on 19 June the garrison surrenders to Alexios.",
      body: [
        "The first target was Nicaea, the city of the first great council of the Church and now the Turkish sultan's capital.",
        "Kilij Arslan was away fighting in the east. He hurried back on 21 May and was driven off. The city's west side opened onto a lake, so the Byzantines hauled boats overland and launched them to cut it off.",
        "On 19 June the garrison surrendered to Alexios, not to the crusaders. Imperial banners went up on the walls. Many crusaders felt robbed of plunder, but the emperor rewarded the leaders generously.",
      ],
      today: "İznik, Turkey. Most of the Byzantine walls and gates still ring the town.",
      figures: ["alexios", "godfrey", "raymond", "bohemond"],
    },
    {
      id: "dorylaeum",
      fight: true,
      battle: "dorylaeum",
      date: "1 July 1097",
      year: 1097,
      mapYear: 1097.5,
      title: "The battle of Dorylaeum",
      place: "Dorylaeum",
      at: [30.52, 39.78],
      view: { at: [30.4, 39.9], k: 8 },
      routes: { main: 5 },
      caption: "1 July 1097. Turkish horse archers surround Bohemond's half of the army. It holds for hours until Godfrey, Raymond and Adhemar arrive and the sultan flees.",
      body: [
        "To ease supply the army marched in two groups. Near Dorylaeum, Turkish horse archers surrounded the vanguard under Bohemond.",
        "The Christians pulled into a tight camp and held out for hours under a storm of arrows. Women carried water to the fighting men. Then Godfrey and Raymond arrived with the second army, and Bishop Adhemar's troops came over the hills behind the Turks. The sultan fled and left his camp behind.",
        "The road across Anatolia was open.",
      ],
      quotes: [
        {
          text: "Stand fast all together, trusting in Christ and in the victory of the Holy Cross.",
          source: "Gesta Francorum, the word passed along the line",
        },
      ],
      today: "Near Eskişehir, Turkey.",
      sources: [
        { title: "Gesta Francorum, selections (Internet Medieval Sourcebook)", url: "https://sourcebooks.web.fordham.edu/source/gesta-cde.asp" },
      ],
      figures: ["bohemond", "godfrey", "raymond", "adhemar"],
    },
    {
      id: "anatolia",
      date: "July – October 1097",
      year: 1097,
      mapYear: 1097.7,
      title: "Across Anatolia",
      place: "Central Anatolia",
      at: [32.48, 37.87],
      view: { at: [34, 38.3], k: 4.5 },
      routes: { main: 11, baldwin: 3 },
      days: { from: "1097-07-03", to: "1097-10-20", label: "on the march" },
      caption: "Summer 1097. Men and horses die of thirst on the march across Anatolia. Tancred and Baldwin turn south to Cilicia; the main army crosses the mountains to Marash.",
      body: [
        "The summer march across the dry interior was brutal. Men and horses died of thirst. Knights rode oxen, and the anonymous author of the Gesta says goats, sheep and dogs carried the baggage.",
        "After Heraclea, Tancred and Baldwin of Boulogne turned south through the Cilician Gates to Tarsus. The main army took the longer road north through Caesarea and over the Anti-Taurus mountains, where Armenian Christians welcomed them.",
        "At Marash, Baldwin's wife Godehilde died. Soon after, he rode east with a small company of knights.",
      ],
      today: "Iconium is Konya, Heraclea is Ereğli, and Marash is Kahramanmaraş, all in Turkey.",
      figures: ["baldwin", "tancred"],
    },
    {
      id: "antioch-siege",
      camp: "cru",
      date: "21 October 1097",
      year: 1097,
      mapYear: 1097.8,
      title: "Before the walls of Antioch",
      place: "Antioch",
      at: [36.16, 36.20],
      view: { at: [36.3, 36.4], k: 7 },
      routes: { main: 12 },
      days: { from: "1097-10-21", to: "1098-03-09", label: "of the siege" },
      caption: "21 October 1097. The army reaches Antioch, with its miles of walls and some 400 towers. A siege of almost eight months begins, through a winter of famine.",
      body: [
        "Antioch was one of the oldest centres of the faith. By tradition St Peter led the church there, and it was where believers were first called Christians (Acts 11:26). Its walls ran for miles, with some 400 towers climbing up the mountainside. The crusaders could not surround it.",
        "The siege lasted almost eight months through a hard winter. Famine set in, foraging parties were ambushed, and some men deserted. Two relief armies from Damascus and Aleppo were beaten off.",
      ],
      today: "Antakya, Turkey. Stretches of the walls survive on Mount Habib-i Neccar, the ancient Silpius.",
      figures: ["bohemond", "adhemar", "raymond", "godfrey"],
    },
    {
      id: "edessa",
      date: "10 March 1098",
      year: 1098,
      mapYear: 1098.2,
      title: "The first crusader state",
      place: "Edessa",
      at: [38.79, 37.16],
      view: { at: [37.6, 36.9], k: 6 },
      routes: { baldwin: 5 },
      caption: "10 March 1098. Baldwin of Boulogne becomes Count of Edessa, an Armenian Christian city beyond the Euphrates. It is the first state founded by the crusaders.",
      body: [
        "Baldwin reached Edessa, an Armenian Christian city ruled by a lord named Thoros. Thoros adopted Baldwin as his son and heir.",
        "Weeks later a revolt overthrew Thoros, and the crowd killed him. Whether Baldwin had a hand in it is still debated. On 10 March 1098 he became Count of Edessa.",
        "The County of Edessa was the first state founded by the crusaders. Its money and food would help keep the army alive at Antioch.",
      ],
      today: "Şanlıurfa, Turkey. The citadel still stands above the town.",
      figures: ["baldwin"],
    },
    {
      id: "antioch-falls",
      date: "3 June 1098",
      year: 1098,
      mapYear: 1098.45,
      title: "Antioch falls",
      place: "Antioch",
      at: [36.16, 36.20],
      view: { at: [36.16, 36.2], k: 11 },
      days: { from: "1097-10-21", to: "1098-06-03", label: "of the siege" },
      caption: "Before dawn on 3 June 1098, Bohemond's men climb a leather ladder into a tower held by Firuz, a traitor inside. A gate is opened, and Antioch falls within hours.",
      body: [
        "Bohemond made a secret deal with Firuz, a convert who commanded a tower on the walls.",
        "Before dawn on 3 June, a small party climbed a leather ladder into the Tower of the Two Sisters and opened a gate. The city fell within hours, though its citadel on the mountain held out.",
        "Bohemond claimed the city for himself. It would become the Principality of Antioch.",
      ],
      today: "Antakya, Turkey. Much of the old city was destroyed in the earthquakes of February 2023.",
      figures: ["bohemond"],
    },
    {
      id: "holy-lance",
      camp: "foe",
      battle: "antioch",
      moment: "lance",
      date: "14–28 June 1098",
      year: 1098,
      mapYear: 1098.49,
      title: "The Holy Lance",
      place: "Antioch",
      at: [36.16, 36.20],
      view: { at: [36.5, 36.3], k: 6 },
      days: { from: "1098-06-05", to: "1098-06-28", label: "besieged by Kerbogha" },
      caption: "June 1098. Trapped in Antioch by Kerbogha's army, the crusaders dig up a lance they believe pierced Christ's side. On 28 June they march out and rout him.",
      body: [
        "Two days later the besiegers became the besieged. Kerbogha, ruler of Mosul, arrived with a huge army. Trapped and starving, some crusaders let themselves down the walls on ropes and fled.",
        "Then Peter Bartholomew, a poor pilgrim, reported visions of St Andrew. On 14 June a lance point was dug up beneath the floor of the Cathedral of St Peter. Many believed it was the spear that pierced Christ's side. Adhemar had doubts, but the army's spirit came back.",
        "After three days of fasting and processions, the army marched out on 28 June in six divisions while priests prayed on the walls. Kerbogha's divided coalition broke and fled.",
      ],
      quotes: [
        {
          text: "There came out from the mountains countless armies on white horses, whose banners were all white. Their leaders were St George, St Mercurius and St Demetrius.",
          source: "Gesta Francorum (abridged)",
        },
      ],
      today: "The cathedral where the lance was found is lost. The cave Church of St Peter outside Antakya is a different, older site.",
      sources: [
        { title: "Raymond of Aguilers, Historia Francorum, selections including the finding of the lance (Internet Medieval Sourcebook)", url: "https://sourcebooks.web.fordham.edu/source/raymond-cde.asp" },
        { title: "Gesta Francorum, selections (Internet Medieval Sourcebook)", url: "https://sourcebooks.web.fordham.edu/source/gesta-cde.asp" },
      ],
      figures: ["adhemar", "bohemond", "raymond"],
    },
    {
      id: "road-south",
      date: "August 1098 – June 1099",
      year: 1099,
      mapYear: 1099.4,
      title: "The road to Jerusalem",
      place: "Down the Syrian coast",
      at: [35.85, 34.44],
      view: { at: [35.8, 33.8], k: 5 },
      routes: { main: 21 },
      caption: "1098–1099. Adhemar dies and the princes quarrel over Antioch. At last the pilgrims force the march south, and Raymond leads them barefoot down the coast.",
      body: [
        "On 1 August 1098 Bishop Adhemar died of plague. Without him, the princes quarrelled for months over who would hold Antioch. That winter, at the siege of Ma'arra, famine became so severe that the chroniclers recorded, with shame, that some crusaders ate the dead.",
        "The ordinary pilgrims forced the issue. They tore down the walls of Ma'arra so the army could not stay. In January 1099 Raymond walked out barefoot as a pilgrim and led the march south. Bohemond stayed behind in Antioch.",
        "After a long siege at Arqa, the army moved fast down the coast. Local rulers paid them to pass by. In early June they reached Ramla.",
      ],
      today: "Ma'arra is Maarat al-Numan in Syria; Arqa is Tell Arqa in northern Lebanon.",
      figures: ["raymond", "adhemar", "tancred", "godfrey"],
    },
    {
      id: "jerusalem",
      camp: "cru",
      battle: "jerusalem",
      moment: "procession",
      date: "7 June – 15 July 1099",
      year: 1099,
      mapYear: 1099.55,
      title: "Jerusalem",
      place: "Jerusalem",
      at: [35.23, 31.78],
      view: { at: [35.15, 31.8], k: 12 },
      routes: { main: 22 },
      days: { from: "1099-06-07", to: "1099-07-15", label: "of the siege" },
      caption: "7 June 1099. The army sees Jerusalem, and many weep. After a barefoot procession around the walls, Godfrey's tower reaches the north wall on 15 July and the city falls.",
      body: [
        "On 7 June the army saw Jerusalem, and many wept. Of the great host that had left, about 1,300 knights and perhaps 12,000 men on foot remained.",
        "A first assault failed for lack of ladders. Water was scarce and the heat was crushing. When Genoese ships arrived at Jaffa, their timber went into siege towers. On 8 July the whole army walked barefoot in procession around the walls, and Peter the Hermit preached to them on the Mount of Olives.",
        "On 15 July Godfrey's tower reached the north wall, and the city fell that day. The chroniclers record a terrible slaughter of its Muslim and Jewish inhabitants. Afterwards the crusaders went to the Holy Sepulchre to give thanks.",
      ],
      quotes: [
        {
          text: "This day, I say, will be famous in all future ages, for it turned our labours and sorrows into joy and exultation.",
          source: "Raymond of Aguilers, chaplain to Raymond of Toulouse",
        },
      ],
      myth: {
        myth: "A crusader leader at Jerusalem cried: Kill them all, God will know his own.",
        fact: "That line belongs to the Albigensian Crusade in southern France. It was attributed to the legate Arnaud Amalric at Béziers in 1209, and first written down by Caesarius of Heisterbach some twenty years later.",
      },
      today: "Jerusalem. The Church of the Holy Sepulchre today is largely the crusaders' rebuilding, consecrated in 1149.",
      sources: [
        { title: "The fall of Jerusalem, 1099: accounts from the Gesta, Raymond of Aguilers and others (Internet Medieval Sourcebook)", url: "https://sourcebooks.web.fordham.edu/source/cde-jlem.asp" },
        { title: "August C. Krey, The First Crusade: The Accounts of Eye-Witnesses and Participants (1921)" },
      ],
      figures: ["godfrey", "raymond", "tancred", "peter"],
    },
    {
      id: "defender",
      moment: "crown",
      date: "22 July 1099",
      year: 1099,
      mapYear: 1099.56,
      title: "A crown of thorns",
      place: "Jerusalem",
      at: [35.23, 31.78],
      view: { at: [35.23, 31.78], k: 9 },
      caption: "22 July 1099. The leaders choose Godfrey of Bouillon to rule Jerusalem. He agrees to govern but will not be called king, only Defender of the Holy Sepulchre.",
      body: [
        "The leaders met to choose a ruler. Raymond refused the crown. They turned to Godfrey.",
        "Godfrey agreed to govern but would not be called king. He took the title Advocatus Sancti Sepulchri, Defender of the Holy Sepulchre.",
      ],
      quotes: [
        {
          text: "He would not wear a crown of gold where his Saviour had worn a crown of thorns.",
          source: "William of Tyre, writing c. 1170–1184 (paraphrased)",
        },
      ],
      today: "Godfrey's tomb stood in the Holy Sepulchre until it was removed after the fire of 1808.",
      figures: ["godfrey", "raymond"],
    },
    {
      id: "ascalon",
      fight: true,
      battle: "ascalon",
      date: "12 August 1099",
      year: 1099,
      mapYear: 1099.62,
      title: "The battle of Ascalon",
      place: "Ascalon",
      at: [34.55, 31.67],
      view: { at: [34.9, 31.72], k: 12 },
      routes: { ascalon: 1 },
      caption: "12 August 1099. A Fatimid army marches from Egypt to retake Jerusalem. Godfrey leads the crusaders out behind the True Cross and routs it at dawn outside Ascalon.",
      body: [
        "A Fatimid army under the vizier al-Afdal marched from Egypt to retake Jerusalem.",
        "Godfrey led the crusaders out. Before them went a relic of the True Cross, found in the city only days before. At dawn on 12 August they surprised the Egyptian camp outside Ascalon and routed it.",
        "Jerusalem was secure. The crusade had done what it set out to do.",
      ],
      today: "Ashkelon, Israel. The ruined walls lie in Ashkelon National Park.",
      figures: ["godfrey", "raymond", "tancred"],
    },
    {
      id: "epilogue",
      date: "1099 and after",
      year: 1099,
      mapYear: 1100,
      title: "What came after",
      place: "The Latin East",
      at: [35.23, 31.78],
      view: { at: [33, 36], k: 3 },
      caption: "Their vows fulfilled, most crusaders sail home. Godfrey stays with a few hundred knights, and four crusader states now stand in the East.",
      body: [
        "With their vows fulfilled, most crusaders sailed home. Godfrey stayed with perhaps 300 knights to hold Jerusalem. He died in July 1100, and his brother Baldwin became the first King of Jerusalem.",
        "Pope Urban II died in Rome on 29 July 1099, fourteen days after Jerusalem fell, before the news could reach him.",
        "The crusaders' states now stood in the East: Edessa, Antioch, Jerusalem, and from 1109 Tripoli. When Edessa fell in 1144, Christendom would answer again with the Second Crusade.",
      ],
      quotes: [
        {
          text: "For we who were Westerners have now become Easterners.",
          source: "Fulcher of Chartres, who settled in Jerusalem",
          url: "https://sourcebooks.web.fordham.edu/source/Fulk3.asp",
        },
      ],
      sources: [
        { title: "Fulcher of Chartres, selections on the First Crusade (Internet Medieval Sourcebook)", url: "https://sourcebooks.web.fordham.edu/source/fulcher-cde.asp" },
        { title: "Jonathan Riley-Smith, The First Crusade and the Idea of Crusading (1986)" },
      ],
      figures: ["urban", "godfrey", "baldwin", "bohemond", "raymond"],
    },
  ],

  battles: {
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
        priests: { label: "Priests praying on the walls", side: "cru", kind: "priest", rows: 1, cols: 4, at: [22, 37] },
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

    // ---- Moments (non-battle scenes) ----

    clermont: {
      id: "clermont",
      title: "Urban II at Clermont",
      date: "27 November 1095",
      place: "A field outside Clermont",
      terrain: [
        { type: "hills", at: [24, 5], w: 40, h: 8 },
        { type: "hills", at: [80, 4], w: 36, h: 7 },
        { type: "landmark", kind: "cathedral", at: [84, 10], size: 6, label: "Clermont", labelAt: [84, 15] },
        { type: "trees", at: [8, 30], r: 6, n: 8 },
        { type: "trees", at: [93, 40], r: 6, n: 7 },
        { type: "road", path: [[100, 14], [74, 18], [62, 22]] },
        { type: "dais", at: [50, 20], w: 16, h: 4 },
        { type: "tents", at: [20, 18], n: 4, r: 5, color: C.adhemar, label: "Bishops of the council", labelAt: [20, 12] },
      ],
      units: {
        urban: { label: "Pope Urban II", side: "cru", kind: "pope", rows: 1, cols: 1, color: "#efe6d2", leader: true, at: [50, 18] },
        clergy: { label: "Bishops and abbots", side: "cru", kind: "bishop", rows: 1, cols: 4, color: "#efe6d2", at: [36, 22] },
        adh: { label: "Adhemar of Le Puy", side: "cru", kind: "bishop", rows: 1, cols: 1, color: C.adhemar, leader: true, at: [40, 26] },
        crowdL: { label: "The crowd", side: "cru", kind: "crowd", rows: 3, cols: 6, start: [-8, 44] },
        crowdR: { label: "The crowd", side: "cru", kind: "crowd", rows: 3, cols: 6, start: [108, 44] },
        knights: { label: "Knights", side: "cru", kind: "knight", rows: 2, cols: 4, color: C.main, start: [50, 68] },
        pilg: { label: "Pilgrims", side: "cru", kind: "pilgrim", rows: 2, cols: 5, start: [74, 68] },
      },
      phases: [
        {
          caption: "27 November 1095. The council of Clermont is over. No church can hold the crowd, so Urban II speaks from a platform in a field outside the town.",
          set: { crowdL: { at: [28, 42] }, crowdR: { at: [72, 42] }, knights: { at: [50, 50] }, pilg: { at: [60, 57] } },
          dur: 6200,
        },
        {
          caption: "He speaks of Eastern Christians attacked by the Turks, of churches destroyed, and of Jerusalem in foreign hands. He tells the knights to stop fighting each other.",
          set: { crowdL: { at: [32, 38], state: "hold" }, crowdR: { at: [68, 38], state: "hold" }, knights: { at: [50, 46], state: "hold" }, pilg: { at: [58, 54], state: "hold" } },
          dur: 6400,
        },
        {
          caption: "The crowd answers with one cry: Deus vult! God wills it!",
          set: { crowdL: { at: [35, 35] }, crowdR: { at: [65, 35] }, knights: { at: [50, 42] } },
        },
        {
          caption: "Adhemar, Bishop of Le Puy, comes forward and kneels before the pope. He is the first to take the cross.",
          set: { adh: { at: [50, 26], state: "hold" } },
        },
        {
          caption: "Many follow him. They cut cloth into crosses and sew them on their shoulders. The council decrees that the journey will count in place of all penance.",
          set: { knights: { at: [50, 33] }, pilg: { at: [54, 44] }, crowdL: { at: [40, 34] }, crowdR: { at: [60, 34] } },
          dur: 6400,
        },
      ],
    },

    lance: {
      id: "lance",
      title: "The finding of the Holy Lance",
      date: "14 June 1098",
      place: "Cathedral of St Peter, Antioch",
      terrain: [
        { type: "floor", poly: [[10, 8], [90, 8], [90, 58], [10, 58]] },
        { type: "columns", from: [16, 16], to: [84, 16], n: 7 },
        { type: "columns", from: [16, 50], to: [84, 50], n: 7 },
        { type: "dais", at: [50, 12], w: 18, h: 4 },
        { type: "label", text: "Altar", at: [50, 7] },
        { type: "label", text: "The pit", at: [50, 41] },
        { type: "label", text: "Doors", at: [50, 61] },
      ],
      units: {
        diggers: { label: "Twelve diggers", side: "cru", kind: "foot", rows: 1, cols: 4, color: C.main, at: [50, 34] },
        count: { label: "Raymond of Toulouse", side: "cru", kind: "foot", rows: 1, cols: 1, color: C.raymond, leader: true, at: [70, 30] },
        bish: { label: "Bishop of Orange", side: "cru", kind: "bishop", rows: 1, cols: 1, color: "#efe6d2", at: [64, 24] },
        rag: { label: "Raymond of Aguilers", side: "cru", kind: "priest", rows: 1, cols: 1, at: [32, 26] },
        pb: { label: "Peter Bartholomew", side: "cru", kind: "pilgrim", rows: 1, cols: 1, leader: true, at: [28, 32] },
        crowd: { label: "Crowd at the doors", side: "cru", kind: "crowd", rows: 2, cols: 5, at: [50, 58] },
      },
      phases: [
        {
          caption: "14 June 1098. Peter Bartholomew, a poor pilgrim, says St Andrew showed him where the lance lies: under the floor of the Cathedral of St Peter.",
          set: { diggers: { at: [50, 34], state: "hold" }, crowd: { at: [50, 58], state: "hold" }, pb: { at: [34, 32], state: "hold" } },
          dur: 6000,
        },
        {
          caption: "Twelve men dig from morning until evening. They find nothing. Count Raymond leaves to keep watch on the citadel.",
          set: { diggers: { at: [50, 36] }, count: { at: [50, 70] } },
        },
        {
          caption: "Peter Bartholomew, barefoot and in his shirt, leaps down into the pit and tells the others to pray.",
          set: { pb: { at: [50, 38], state: "hold" }, diggers: { at: [50, 31] } },
        },
        {
          caption: "The point of a lance appears in the earth. Raymond of Aguilers writes that he kissed it as soon as the point appeared.",
          set: { rag: { at: [46, 36], state: "hold" }, bish: { at: [58, 32], state: "hold" } },
          dur: 6000,
        },
        {
          caption: "The news spreads through the starving city. Many believe it is the spear that pierced Christ's side, and the army's spirit comes back.",
          set: { crowd: { at: [50, 47] } },
        },
      ],
    },

    procession: {
      id: "procession",
      title: "The procession around Jerusalem",
      date: "8 July 1099",
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
        clergy: { label: "Clergy with crosses and relics", side: "cru", kind: "priest", rows: 1, cols: 4, at: [12, 26] },
        bish: { label: "Bishops", side: "cru", kind: "bishop", rows: 1, cols: 2, color: "#efe6d2", at: [10, 32] },
        lords: { label: "The princes, barefoot", side: "cru", kind: "foot", rows: 1, cols: 4, color: C.godfrey, leader: true, at: [8, 38] },
        army: { label: "The army", side: "cru", kind: "pilgrim", rows: 2, cols: 6, at: [8, 46] },
        peter: { label: "Peter the Hermit", side: "cru", kind: "pilgrim", rows: 1, cols: 1, color: C.peter, leader: true, at: [6, 52] },
        defn: { label: "Defenders mocking from the walls", side: "foe", kind: "foot", rows: 1, cols: 6, color: C.fatimid, at: [50, 18] },
        defe: { label: "Defenders", side: "foe", kind: "foot", rows: 1, cols: 3, color: C.fatimid, at: [72, 34] },
      },
      phases: [
        {
          caption: "8 July 1099. After a three-day fast, the whole army sets out to walk barefoot around Jerusalem. Clergy go first, carrying crosses and relics.",
          set: { clergy: { at: [20, 12] }, bish: { at: [16, 16] }, lords: { at: [13, 22] }, army: { at: [12, 30] }, peter: { at: [10, 38] }, defn: { state: "hold" }, defe: { state: "hold" } },
          dur: 6200,
        },
        {
          caption: "They pass beneath the north wall singing. The defenders jeer, raise crosses on the walls and insult them.",
          set: { clergy: { at: [58, 7] }, bish: { at: [50, 7] }, lords: { at: [42, 8] }, army: { at: [30, 8] }, peter: { at: [20, 10] }, defn: { at: [52, 17], facing: -1 } },
          dur: 6200,
        },
        {
          caption: "The procession turns south along the east wall and climbs the Mount of Olives.",
          set: { clergy: { at: [90, 24] }, bish: { at: [87, 30] }, lords: { at: [84, 18] }, army: { at: [86, 12] }, peter: { at: [80, 8] }, defe: { at: [74, 26], facing: 1 } },
        },
        {
          caption: "On the Mount of Olives, Peter the Hermit preaches to the army, and the chaplain Arnulf after him. Raymond and Tancred, long at odds, are reconciled.",
          set: { peter: { at: [92, 30], state: "hold" }, clergy: { at: [88, 22], state: "hold" }, bish: { at: [96, 24], state: "hold" }, lords: { at: [86, 36], state: "hold" }, army: { at: [90, 42], state: "hold" } },
          dur: 6400,
        },
        {
          caption: "The army returns to its camps to build ladders and towers. The final assault begins on the night of 13 July.",
          set: { army: { at: [60, 4] }, lords: { at: [48, 4] }, clergy: { at: [70, 6] } },
        },
      ],
    },

    crown: {
      id: "crown",
      title: "Defender of the Holy Sepulchre",
      date: "22 July 1099",
      place: "Jerusalem",
      terrain: [
        { type: "floor", poly: [[8, 14], [92, 14], [92, 58], [8, 58]] },
        { type: "columns", from: [14, 20], to: [86, 20], n: 7 },
        { type: "columns", from: [14, 52], to: [86, 52], n: 7 },
        { type: "landmark", kind: "rotunda", at: [50, 6], size: 7, label: "Holy Sepulchre", labelAt: [72, 6] },
        { type: "label", text: "Jerusalem, a week after its capture", at: [50, 61] },
      ],
      units: {
        god: { label: "Godfrey of Bouillon", side: "cru", kind: "foot", rows: 1, cols: 1, color: C.godfrey, leader: true, at: [30, 38] },
        ray: { label: "Raymond of Toulouse", side: "cru", kind: "foot", rows: 1, cols: 1, color: C.raymond, leader: true, at: [70, 38] },
        rob: { label: "Robert of Normandy", side: "cru", kind: "foot", rows: 1, cols: 1, color: C.peter, at: [40, 46] },
        flan: { label: "Robert of Flanders", side: "cru", kind: "foot", rows: 1, cols: 1, color: C.flanders, at: [60, 46] },
        tan: { label: "Tancred", side: "cru", kind: "foot", rows: 1, cols: 1, color: C.tancred, at: [50, 48] },
        clergy: { label: "Clergy", side: "cru", kind: "bishop", rows: 1, cols: 3, color: "#efe6d2", at: [50, 28] },
        knights: { label: "Knights", side: "cru", kind: "foot", rows: 1, cols: 6, color: C.main, start: [50, 66] },
      },
      phases: [
        {
          caption: "22 July 1099. A week after the city fell, the princes and clergy meet to choose a ruler for Jerusalem.",
          set: { god: { state: "hold" }, ray: { state: "hold" }, rob: { state: "hold" }, flan: { state: "hold" }, tan: { state: "hold" }, clergy: { state: "hold" }, knights: { at: [50, 55], state: "hold" } },
        },
        {
          caption: "Some of the clergy argue that a spiritual leader should be chosen first, before any king.",
          set: { clergy: { at: [50, 33] } },
        },
        {
          caption: "The crown is offered to Raymond of Toulouse. He refuses. Raymond of Aguilers says the count would not bear the name of king in that city.",
          set: { ray: { at: [62, 36], facing: -1 } },
          dur: 6000,
        },
        {
          caption: "The princes turn to Godfrey. He agrees to govern, but he will not be called king.",
          set: { god: { at: [50, 38], facing: 1 }, ray: { at: [66, 38] }, rob: { at: [42, 44] }, flan: { at: [58, 44] } },
        },
        {
          caption: "He takes the title Advocatus Sancti Sepulchri, Defender of the Holy Sepulchre. Later tradition says he would not wear a crown of gold where Christ had worn a crown of thorns.",
          set: { god: { at: [50, 14] }, clergy: { at: [50, 22] }, knights: { at: [50, 40] } },
          dur: 6400,
        },
      ],
    },
  },
  });
})();
