// The First Crusade, 1095–1099.
// Coordinates are [longitude, latitude].
// A chapter's `routes` sets how far each army has travelled by the end of that
// chapter, as a vertex index into the route's `points` (fractions are fine).
// Routes not named keep their progress from the chapter before.

window.CRUSADE = {
  id: "first",
  name: "The First Crusade",
  years: "1095–1099",

  routes: {
    peter: {
      label: "Peter the Hermit",
      color: "--r-peter",
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

  // Always-on reference cities. Event places are added from the chapters.
  cities: [
    { name: "Rome", at: [12.50, 41.90] },
    { name: "Constantinople", at: [28.98, 41.01] },
    { name: "Antioch", at: [36.16, 36.20] },
    { name: "Jerusalem", at: [35.23, 31.78] },
  ],

  figures: {
    urban: {
      name: "Pope Urban II",
      role: "Pope, 1088–1099",
      life: "c. 1035–1099",
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
      date: "1009–1094",
      year: 1071,
      title: "A Christian East under threat",
      place: "Manzikert, Armenia",
      at: [42.53, 39.15],
      view: { at: [33, 37], k: 2.1 },
      body: [
        "Christianity was born in the East. For a thousand years, believers had lived and worshipped across Syria, Anatolia and the Holy Land. Jerusalem had been under Muslim rule since 638, but Western pilgrims still made the long journey to the Church of the Holy Sepulchre, built over the tomb of Christ.",
        "In 1009 the Fatimid caliph al-Hakim had the Holy Sepulchre destroyed, and it was only partly rebuilt. Then in 1071 the Seljuk Turks crushed the Byzantine army at Manzikert and captured Emperor Romanos IV. Within a decade most of Anatolia was lost. Nicaea, where the Nicene Creed was written in 325, became a Turkish capital.",
        "Pilgrims coming home told of a dangerous road. The Christian East was shrinking.",
      ],
      figures: [],
    },
    {
      id: "piacenza",
      date: "March 1095",
      year: 1095,
      title: "A plea from Constantinople",
      place: "Piacenza, Italy",
      at: [9.69, 45.05],
      view: { at: [20, 44], k: 2.6 },
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
      date: "27 November 1095",
      year: 1095,
      title: "Deus vult!",
      place: "Clermont, France",
      at: [3.08, 45.78],
      view: { at: [3.5, 46], k: 4.2 },
      body: [
        "At the end of a council in central France, Urban preached in a field outside Clermont, because no church could hold the crowd. He spoke of Eastern Christians suffering and of Jerusalem in foreign hands. He told knights who spent their lives fighting each other to take up a different kind of warfare: an armed pilgrimage.",
        "The crowd answered with one cry: God wills it! Bishop Adhemar of Le Puy knelt first to take the cross. People cut cloth into crosses and sewed them onto their shoulders, taking literally Christ's words to take up the cross and follow him.",
        "The council decreed that the journey would count in place of all penance for sin.",
      ],
      quotes: [
        {
          text: "Let those who have formerly been accustomed to contend wickedly in private warfare against the faithful now fight against the infidels. Let those who for a long time have been robbers now become knights.",
          source: "Fulcher of Chartres, who was present",
        },
        {
          text: "Whoever goes to Jerusalem to free the Church of God, out of devotion alone and not to gain honour or money, may count that journey in place of all penance.",
          source: "Decree of the Council of Clermont",
        },
      ],
      figures: ["urban", "adhemar"],
    },
    {
      id: "peoples-crusade",
      date: "April–August 1096",
      year: 1096,
      title: "The People's Crusade",
      place: "Cologne to Constantinople",
      at: [6.96, 50.94],
      view: { at: [18, 46], k: 2.9 },
      routes: { peter: 9 },
      body: [
        "Urban set the departure for 15 August 1096, but many would not wait. Peter the Hermit gathered tens of thousands of commoners, along with some knights, women and children. They left Cologne at Easter and walked down the Danube.",
        "The march was disorderly. Fights over food broke out in Hungary, at Belgrade and at Niš. Other bands, led by Count Emicho, turned on the Jewish communities of the Rhineland at Speyer, Worms and Mainz. Some bishops sheltered the Jews in their own palaces. Christian chroniclers such as Albert of Aachen condemned the killings and saw the bands' later destruction in Hungary as God's judgment.",
        "Peter's column reached Constantinople on 1 August.",
      ],
      figures: ["peter"],
    },
    {
      id: "civetot",
      date: "21 October 1096",
      year: 1096,
      title: "Disaster at Civetot",
      place: "Civetot, Anatolia",
      at: [29.53, 40.66],
      view: { at: [29.4, 40.8], k: 9 },
      routes: { peter: 10 },
      body: [
        "Alexios ferried Peter's followers across the Bosporus and told them to wait for the princes. They did not. Raiding parties pushed toward Nicaea.",
        "In October, while Peter was in Constantinople seeking supplies, the army marched out and walked into an ambush by Sultan Kilij Arslan. Most were killed or enslaved. Byzantine ships rescued a few thousand survivors.",
        "Peter survived. He would march with the main army all the way to Jerusalem.",
      ],
      figures: ["peter", "alexios"],
    },
    {
      id: "princes",
      date: "August 1096 – May 1097",
      year: 1096,
      title: "The princes march",
      place: "Western Europe to Constantinople",
      at: [16.37, 48.21],
      view: { at: [14, 45], k: 2.6 },
      routes: { godfrey: 11, raymond: 12, bohemond: 7 },
      body: [
        "The main army set out on Urban's appointed day. No king went. It was led by great lords, each with his own following.",
        "Godfrey of Bouillon marched overland through Hungary. Raymond of Toulouse, with Bishop Adhemar, took the hard winter road down the Dalmatian coast. Bohemond sailed from southern Italy across the Adriatic. Hugh of Vermandois, Robert of Normandy, Robert of Flanders and Stephen of Blois led other contingents.",
        "Historians estimate 60,000 to 100,000 people in all, perhaps 7,000 of them knights. Most paid their own way. Crusading cost a fortune, and many sold or mortgaged their land to go.",
      ],
      figures: ["godfrey", "raymond", "bohemond", "adhemar", "tancred", "baldwin"],
    },
    {
      id: "constantinople",
      date: "December 1096 – April 1097",
      year: 1097,
      title: "The emperor's oath",
      place: "Constantinople",
      at: [28.98, 41.01],
      view: { at: [28.98, 41.01], k: 8 },
      body: [
        "Constantinople was the greatest Christian city in the world, with ten times the population of any city in the West. Its walls, churches and relics left the Westerners in awe.",
        "Alexios needed the princes on his side. He asked each to swear to hand back any former Byzantine land they took. Most swore. Raymond would only promise to respect the emperor's life and honour. Tancred slipped across to Asia rather than swear.",
        "In return, Alexios promised food, guides and troops. By spring the army was across the Bosporus.",
      ],
      figures: ["alexios", "godfrey", "bohemond", "raymond", "tancred"],
    },
    {
      id: "nicaea",
      date: "14 May – 19 June 1097",
      year: 1097,
      title: "The siege of Nicaea",
      place: "Nicaea",
      at: [29.72, 40.43],
      view: { at: [29.7, 40.5], k: 10 },
      routes: { main: 3 },
      body: [
        "The first target was Nicaea, the city of the first great council of the Church and now the Turkish sultan's capital.",
        "Kilij Arslan was away fighting in the east. He hurried back on 21 May and was driven off. The city's west side opened onto a lake, so the Byzantines hauled boats overland and launched them to cut it off.",
        "On 19 June the garrison surrendered to Alexios, not to the crusaders. Imperial banners went up on the walls. Many crusaders felt robbed of plunder, but the emperor rewarded the leaders generously.",
      ],
      figures: ["alexios", "godfrey", "raymond", "bohemond"],
    },
    {
      id: "dorylaeum",
      date: "1 July 1097",
      year: 1097,
      title: "The battle of Dorylaeum",
      place: "Dorylaeum",
      at: [30.52, 39.78],
      view: { at: [30.4, 39.9], k: 8 },
      routes: { main: 5 },
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
      figures: ["bohemond", "godfrey", "raymond", "adhemar"],
    },
    {
      id: "anatolia",
      date: "July – October 1097",
      year: 1097,
      title: "Across Anatolia",
      place: "Central Anatolia",
      at: [32.48, 37.87],
      view: { at: [34, 38.3], k: 4.5 },
      routes: { main: 11, baldwin: 3 },
      body: [
        "The summer march across the dry interior was brutal. Men and horses died of thirst. Knights rode oxen, and the anonymous author of the Gesta says goats, sheep and dogs carried the baggage.",
        "After Heraclea, Tancred and Baldwin of Boulogne turned south through the Cilician Gates to Tarsus. The main army took the longer road north through Caesarea and over the Anti-Taurus mountains, where Armenian Christians welcomed them.",
        "At Marash, Baldwin's wife Godehilde died. Soon after, he rode east with a small company of knights.",
      ],
      figures: ["baldwin", "tancred"],
    },
    {
      id: "antioch-siege",
      date: "21 October 1097",
      year: 1097,
      title: "Before the walls of Antioch",
      place: "Antioch",
      at: [36.16, 36.20],
      view: { at: [36.3, 36.4], k: 7 },
      routes: { main: 12 },
      body: [
        "Antioch was one of the oldest centres of the faith. By tradition St Peter led the church there, and it was where believers were first called Christians (Acts 11:26). Its walls ran for miles, with some 400 towers climbing up the mountainside. The crusaders could not surround it.",
        "The siege lasted almost eight months through a hard winter. Famine set in, foraging parties were ambushed, and some men deserted. Two relief armies from Damascus and Aleppo were beaten off.",
      ],
      figures: ["bohemond", "adhemar", "raymond", "godfrey"],
    },
    {
      id: "edessa",
      date: "10 March 1098",
      year: 1098,
      title: "The first crusader state",
      place: "Edessa",
      at: [38.79, 37.16],
      view: { at: [37.6, 36.9], k: 6 },
      routes: { baldwin: 5 },
      body: [
        "Baldwin reached Edessa, an Armenian Christian city ruled by a lord named Thoros. Thoros adopted Baldwin as his son and heir.",
        "Weeks later a revolt overthrew Thoros, and the crowd killed him. Whether Baldwin had a hand in it is still debated. On 10 March 1098 he became Count of Edessa.",
        "The County of Edessa was the first state founded by the crusaders. Its money and food would help keep the army alive at Antioch.",
      ],
      figures: ["baldwin"],
    },
    {
      id: "antioch-falls",
      date: "3 June 1098",
      year: 1098,
      title: "Antioch falls",
      place: "Antioch",
      at: [36.16, 36.20],
      view: { at: [36.16, 36.2], k: 11 },
      body: [
        "Bohemond made a secret deal with Firuz, a convert who commanded a tower on the walls.",
        "Before dawn on 3 June, a small party climbed a leather ladder into the Tower of the Two Sisters and opened a gate. The city fell within hours, though its citadel on the mountain held out.",
        "Bohemond claimed the city for himself. It would become the Principality of Antioch.",
      ],
      figures: ["bohemond"],
    },
    {
      id: "holy-lance",
      date: "14–28 June 1098",
      year: 1098,
      title: "The Holy Lance",
      place: "Antioch",
      at: [36.16, 36.20],
      view: { at: [36.5, 36.3], k: 6 },
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
      figures: ["adhemar", "bohemond", "raymond"],
    },
    {
      id: "road-south",
      date: "August 1098 – June 1099",
      year: 1099,
      title: "The road to Jerusalem",
      place: "Down the Syrian coast",
      at: [35.85, 34.44],
      view: { at: [35.8, 33.8], k: 5 },
      routes: { main: 21 },
      body: [
        "On 1 August 1098 Bishop Adhemar died of plague. Without him, the princes quarrelled for months over who would hold Antioch. That winter, at the siege of Ma'arra, famine became so severe that the chroniclers recorded, with shame, that some crusaders ate the dead.",
        "The ordinary pilgrims forced the issue. They tore down the walls of Ma'arra so the army could not stay. In January 1099 Raymond walked out barefoot as a pilgrim and led the march south. Bohemond stayed behind in Antioch.",
        "After a long siege at Arqa, the army moved fast down the coast. Local rulers paid them to pass by. In early June they reached Ramla.",
      ],
      figures: ["raymond", "adhemar", "tancred", "godfrey"],
    },
    {
      id: "jerusalem",
      date: "7 June – 15 July 1099",
      year: 1099,
      title: "Jerusalem",
      place: "Jerusalem",
      at: [35.23, 31.78],
      view: { at: [35.15, 31.8], k: 12 },
      routes: { main: 22 },
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
      figures: ["godfrey", "raymond", "tancred", "peter"],
    },
    {
      id: "defender",
      date: "22 July 1099",
      year: 1099,
      title: "A crown of thorns",
      place: "Jerusalem",
      at: [35.23, 31.78],
      view: { at: [35.23, 31.78], k: 9 },
      body: [
        "The leaders met to choose a ruler. Raymond refused the crown. They turned to Godfrey.",
        "Godfrey agreed to govern but would not be called king. He took the title Advocatus Sancti Sepulchri, Defender of the Holy Sepulchre.",
      ],
      quotes: [
        {
          text: "He would not wear a crown of gold where his Saviour had worn a crown of thorns.",
          source: "Later tradition, as remembered by William of Tyre's generation",
        },
      ],
      figures: ["godfrey", "raymond"],
    },
    {
      id: "ascalon",
      date: "12 August 1099",
      year: 1099,
      title: "The battle of Ascalon",
      place: "Ascalon",
      at: [34.55, 31.67],
      view: { at: [34.9, 31.72], k: 12 },
      routes: { ascalon: 1 },
      body: [
        "A Fatimid army under the vizier al-Afdal marched from Egypt to retake Jerusalem.",
        "Godfrey led the crusaders out. Before them went a relic of the True Cross, found in the city only days before. At dawn on 12 August they surprised the Egyptian camp outside Ascalon and routed it.",
        "Jerusalem was secure. The crusade had done what it set out to do.",
      ],
      figures: ["godfrey", "raymond", "tancred"],
    },
    {
      id: "epilogue",
      date: "1099 and after",
      year: 1099,
      title: "What came after",
      place: "The Latin East",
      at: [35.23, 31.78],
      view: { at: [33, 36], k: 3 },
      body: [
        "With their vows fulfilled, most crusaders sailed home. Godfrey stayed with perhaps 300 knights to hold Jerusalem. He died in July 1100, and his brother Baldwin became the first King of Jerusalem.",
        "Pope Urban II died in Rome on 29 July 1099, fourteen days after Jerusalem fell, before the news could reach him.",
        "The crusaders' states now stood in the East: Edessa, Antioch, Jerusalem, and from 1109 Tripoli. When Edessa fell in 1144, Christendom would answer again with the Second Crusade.",
      ],
      quotes: [
        {
          text: "For we who were Westerners have now become Easterners.",
          source: "Fulcher of Chartres, who settled in Jerusalem",
        },
      ],
      figures: ["urban", "godfrey", "baldwin", "bohemond", "raymond"],
    },
  ],
};
