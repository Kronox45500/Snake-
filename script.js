(function(){
"use strict";

  /* ================= Data ================= */

  const SNAKES = [
    {id:"classic", name:"Classique", price:0, emoji:"🟢", head:"#7c5cff", body:"#5238c4",
      desc:"Le serpent original. Aucun bonus, aucun piège."},
    {id:"viper", name:"Vipère", price:120, emoji:"🩸", head:"#ff5470", body:"#c42f4a",
      desc:"30% plus rapide, et 50% de points en plus par proie. Écailles en losange et langue fourchue."},
    {id:"golden", name:"Doré", price:220, emoji:"👑", head:"#ffc94d", body:"#c99a2e",
      desc:"Double toutes les pièces gagnées pendant la partie. Porte une couronne."},
    {id:"ghost", name:"Fantôme", price:350, emoji:"👻", head:"#33e6c4", body:"#1f9b85",
      desc:"Traverse les bords de la carte, même sur les terrains à murs. Corps translucide qui s'estompe."},
    {id:"tank", name:"Blindé", price:480, emoji:"🛡️", head:"#8a6bff", body:"#4a3d8f",
      desc:"Absorbe une collision fatale une fois par partie. Plaques d'armure rivetées."},
    {id:"magnetic", name:"Magnétique", price:400, emoji:"🧲", head:"#4fd3ff", body:"#2c8fb8",
      desc:"Attire légèrement la nourriture en permanence. Champ électromagnétique visible autour de la tête."},
    {id:"tiny", name:"Minuscule", price:300, emoji:"🔹", head:"#9be564", body:"#5a9b34",
      desc:"Ne grandit qu'une fois sur deux : plus facile à manœuvrer longtemps. Corps compact, grands yeux."},
    {id:"lucky", name:"Chanceux", price:650, emoji:"🍀", head:"#ffd25c", body:"#e0a020",
      desc:"25% de chances qu'une proie rapporte 3x plus de points et 2x plus de pièces. Écailles chatoyantes."},
    {id:"camo", name:"Camouflage", price:550, emoji:"🦎", head:"#6b8f5a", body:"#3f5c33",
      desc:"Les chasseurs ne le repèrent jamais : ils se comportent comme de simples rôdeurs face à lui."},
    {id:"regen", name:"Régénérateur", price:500, emoji:"🌱", head:"#7fe0a0", body:"#2f8f5c",
      desc:"Perd automatiquement un anneau tous les 8 fruits, contre un petit bonus de pièces : reste toujours maniable."}
  ];

  // Premium snakes: gacha-only, active skill with a dedicated animated button.
  // recharge:true snakes regenerate charges over time during a run (except Ouroboros, a fixed one-shot resource).
  const PREMIUM_SNAKES = [
    {id:"ouroboros", name:"Ouroboros", emoji:"♾️", head:"#ff8f7a", body:"#7a1f1f", rarity:"Rare", rarityColor:"#33e6c4", weight:30,
      desc:"Compétence Sacrifice : coupe sa propre queue en deux pour s'échapper d'une situation périlleuse. 2 charges fixes, ne se rechargent pas.",
      skill:{id:"ouroboros", name:"Sacrifice", icon:"✂️", charges:2, recharge:false}},
    {id:"tempete", name:"Tempête", emoji:"⚡", head:"#eaf6ff", body:"#4fd3ff", rarity:"Rare", rarityColor:"#33e6c4", weight:24,
      desc:"Compétence Éclair : un dash fulgurant qui traverse murs, obstacles et ennemis sans dommage. 2 charges simultanées, se rechargent en 7s chacune.",
      skill:{id:"tempete", name:"Éclair", icon:"⚡", charges:2, maxCharges:2, cooldown:7000, recharge:true}},
    {id:"titan", name:"Titan", emoji:"🗿", head:"#d8c9a8", body:"#8a7a52", rarity:"Épique", rarityColor:"#7c5cff", weight:15,
      desc:"Compétence Onde de choc : fige tous les ennemis proches pendant 4 secondes sans les détruire. Se recharge en 16s.",
      skill:{id:"titan", name:"Onde de choc", icon:"💥", charges:1, maxCharges:1, cooldown:16000, recharge:true}},
    {id:"nova", name:"Nova", emoji:"☢️", head:"#eaff9e", body:"#9be564", rarity:"Épique", rarityColor:"#7c5cff", weight:14,
      desc:"Compétence Détonation : élimine tous les ennemis et pulvérise les obstacles proches. Se recharge en 18s.",
      skill:{id:"nova", name:"Détonation", icon:"☢️", charges:1, maxCharges:1, cooldown:18000, recharge:true}},
    {id:"leviathan", name:"Léviathan", emoji:"🌊", head:"#cdefff", body:"#1f6f9b", rarity:"Épique", rarityColor:"#7c5cff", weight:9,
      desc:"Compétence Raz-de-marée : balaie tous les obstacles du terrain. Se recharge en 20s — précieux sur les terrains qui régénèrent leurs obstacles.",
      skill:{id:"leviathan", name:"Raz-de-marée", icon:"🌊", charges:1, maxCharges:1, cooldown:20000, recharge:true}},
    {id:"chronos", name:"Chronos", emoji:"⏳", head:"#e4d9ff", body:"#7c5cff", rarity:"Légendaire", rarityColor:"#ffc94d", weight:2,
      desc:"Compétence Retour temporel : suspend le temps et revient 5 secondes en arrière. Se recharge en 12s.",
      skill:{id:"chronos", name:"Retour temporel", icon:"⏳", charges:1, maxCharges:1, cooldown:12000, recharge:true}},
    {id:"mirage", name:"Mirage", emoji:"🌀", head:"#ffd9f0", body:"#c15fae", rarity:"Légendaire", rarityColor:"#ffc94d", weight:2,
      desc:"Compétence Clone leurre : projette un leurre qui attire tous les chasseurs pendant 5 secondes pendant que vous filez librement. Se recharge en 20s.",
      skill:{id:"mirage", name:"Clone leurre", icon:"🌀", charges:1, maxCharges:1, cooldown:20000, recharge:true}}
  ];
  const GACHA_COST = 45;
  function rarityClass(r){ return r==="Légendaire"?"legendary":(r==="Épique"?"epic":"rare"); }

  const MAPS = [
    {id:"classic", name:"Ouvert", price:0, tone:"#7c5cff", coinMult:1,
      desc:"Terrain ouvert, les bords se traversent. Idéal pour débuter.",
      build:(c,r)=>({obstacles:[],portals:[],walls:false,chaos:false})},
    {id:"arena", name:"Arène", price:150, tone:"#ff9f43", coinMult:1.2,
      desc:"Murs mortels sur les bords, quelques blocs au centre. Pièces x1.2.",
      build:(c,r)=>({obstacles:arenaObstacles(c,r),portals:[],walls:true,chaos:false})},
    {id:"maze", name:"Labyrinthe", price:300, tone:"#8891a8", coinMult:1.4,
      desc:"Obstacles denses, bords traversables. Pièces x1.4.",
      build:(c,r)=>({obstacles:mazeObstacles(c,r,false),portals:[],walls:false,chaos:false})},
    {id:"portal", name:"Portails", price:500, tone:"#33e6c4", coinMult:1.6,
      desc:"Deux paires de portails téléportent votre tête. Pièces x1.6.",
      build:(c,r)=>({obstacles:[],portals:portalPairs(c,r),walls:false,chaos:false})},
    {id:"chaos", name:"Chaos", price:700, tone:"#ff5470", coinMult:2,
      desc:"Les obstacles se déplacent toutes les 12 secondes. Pièces x2.",
      build:(c,r)=>({obstacles:randomObstacles(c,r,Math.max(6,Math.round(c*r*0.025)),[]),portals:[],walls:false,chaos:true})},
    {id:"ice", name:"Glace", price:850, tone:"#9be3ff", coinMult:1.9, ice:true,
      desc:"Le sol glisse : chaque virage met un instant à répondre. Pièces x1.9.",
      build:(c,r)=>({obstacles:[],portals:[],walls:false,chaos:false,ice:true})},
    {id:"eclipse", name:"Éclipse", price:950, tone:"#3a2a5c", coinMult:2.1, fog:true,
      desc:"Visibilité réduite à un halo autour de la tête. Pièces x2.1.",
      build:(c,r)=>({obstacles:[],portals:[],walls:false,chaos:false,fog:true})}
  ];

  const ITEMS = [
    {id:"magnet", name:"Aimant", price:25, icon:"🧲", kind:"timed", duration:8000, desc:"Attire la nourriture proche pendant 8 secondes."},
    {id:"slow", name:"Ralenti", price:20, icon:"🐌", kind:"timed", duration:8000, desc:"Divise la vitesse par deux pendant 8 secondes."},
    {id:"shield", name:"Bouclier", price:45, icon:"🛡️", kind:"instant", desc:"Absorbe le prochain choc fatal, une seule fois."},
    {id:"coinrush", name:"Ruée dorée", price:40, icon:"💰", kind:"toggle", desc:"Triple les pièces gagnées jusqu'à la fin de la partie."},
    {id:"scoresurge", name:"Score+", price:40, icon:"⚡", kind:"toggle", desc:"Double les points gagnés jusqu'à la fin de la partie."},
    {id:"detonator", name:"Détonateur", price:50, icon:"💣", kind:"instant", desc:"Efface les ennemis proches et les obstacles juste devant vous."}
  ];

  /* ---- layout generators (relative to grid size, so any screen works) ---- */
  function arenaObstacles(cols,rows){
    const cx=Math.floor(cols/2), cy=Math.floor(rows/2);
    return [[cx,Math.floor(rows*0.25)],[cx,Math.floor(rows*0.75)],[Math.floor(cols*0.25),cy],[Math.floor(cols*0.75),cy]];
  }
  function mazeObstacles(cols,rows,light){
    const pts=[];
    const xs=[Math.floor(cols*0.22), Math.floor(cols*0.78)];
    const ysFull=[0.18,0.26,0.34,0.66,0.74,0.82].map(f=>Math.floor(rows*f));
    const ys = light? [ysFull[0],ysFull[2],ysFull[3],ysFull[5]] : ysFull;
    xs.forEach(x=>ys.forEach(y=>pts.push([x,y])));
    const cx=Math.floor(cols/2), cy=Math.floor(rows/2);
    pts.push([cx,Math.floor(rows*0.08)]);
    if(!light) pts.push([cx,Math.floor(rows*0.92)],[Math.floor(cols*0.08),cy],[Math.floor(cols*0.92),cy]);
    return pts;
  }
  function randomObstacles(cols,rows,count,avoid){
    const pts=[]; let tries=0;
    while(pts.length<count && tries<count*50){
      tries++;
      const x=1+Math.floor(Math.random()*(cols-2)), y=1+Math.floor(Math.random()*(rows-2));
      if(avoid && avoid.some(a=>Math.abs(a[0]-x)+Math.abs(a[1]-y)<4)) continue;
      if(pts.some(p=>p[0]===x&&p[1]===y)) continue;
      pts.push([x,y]);
    }
    return pts;
  }
  function portalPairs(cols,rows){
    return [
      [[Math.floor(cols*0.12),Math.floor(rows*0.12)],[Math.floor(cols*0.88),Math.floor(rows*0.88)],"#ff9f43"],
      [[Math.floor(cols*0.12),Math.floor(rows*0.88)],[Math.floor(cols*0.88),Math.floor(rows*0.12)],"#33e6c4"]
    ];
  }
  function enemyScheduleForLevel(level){
    if(level<=1) return [];
    if(level===2) return ["wanderer"];
    if(level===3) return ["wanderer","wanderer"];
    if(level===4) return ["wanderer","wanderer","hunter"];
    if(level===5) return ["wanderer","wanderer","hunter","hunter"];
    return ["wanderer","wanderer","hunter","hunter","wanderer"];
  }
  const FOOD_PER_LEVEL = 5;

  /* ================= Career: branching path, 6 chapters x 6 nodes (incl. a choice fork and a boss) ================= */

  const CHAPTER_NAMES = ["Premiers pas","Obstacles","Prédateurs","Portails","Chaos","Maîtrise"];
  const STAGE_KEYS = ["stage1","stage2","choiceA","choiceB","stage4","boss"];

  const CHAPTER_SPECS = [
    { stage1:{title:"Premières bouchées", goal:6},
      stage2:{title:"Accélération", goal:10, speedStart:130},
      choiceA:{title:"Entre quatre murs", goal:8, walls:true},
      choiceB:{title:"Chrono", goal:10, timeLimit:40},
      stage4:{title:"Terrain accidenté", goal:12, mazeLight:true},
      boss:{title:"Boss : Le Glouton", goal:20, speedStart:140, enemies:[{type:"boss"}]} },
    { stage1:{title:"Couloirs", goal:12, maze:true},
      stage2:{title:"Contre la montre", goal:12, timeLimit:45, walls:true},
      choiceA:{title:"Dans le vif du sujet", goal:12, maze:true, timeLimit:60},
      choiceB:{title:"Premier danger", goal:10, enemies:[{type:"wanderer"}]},
      stage4:{title:"Duo de rôdeurs", goal:14, enemies:[{type:"wanderer"},{type:"wanderer"}]},
      boss:{title:"Boss : Le Labyrinthe Vivant", goal:16, maze:true, timeLimit:55, enemies:[{type:"boss"}]} },
    { stage1:{title:"Prédateur", goal:10, enemies:[{type:"hunter"}]},
      stage2:{title:"Traqué entre les murs", goal:12, walls:true, enemies:[{type:"hunter"}]},
      choiceA:{title:"Chasse dans le labyrinthe", goal:14, maze:true, enemies:[{type:"wanderer"}]},
      choiceB:{title:"Sprint sous tension", goal:14, timeLimit:50, enemies:[{type:"hunter"}]},
      stage4:{title:"Double menace", goal:16, enemies:[{type:"wanderer"},{type:"hunter"}]},
      boss:{title:"Boss : La Meute", goal:18, enemies:[{type:"boss"},{type:"hunter"}]} },
    { stage1:{title:"Portails", goal:12, portal:true},
      stage2:{title:"Sauts chronométrés", goal:14, portal:true, timeLimit:55},
      choiceA:{title:"Portails et rôdeur", goal:14, portal:true, enemies:[{type:"wanderer"}]},
      choiceB:{title:"Portails muraillés", goal:16, portal:true, walls:true},
      stage4:{title:"Chasseur téléporté", goal:16, portal:true, enemies:[{type:"hunter"}]},
      boss:{title:"Boss : Le Gardien des Portails", goal:18, portal:true, walls:true, enemies:[{type:"boss"}], timeLimit:65} },
    { stage1:{title:"Chaos", goal:14, chaos:true},
      stage2:{title:"Chaos chronométré", goal:16, chaos:true, timeLimit:60},
      choiceA:{title:"Chaos et rôdeur", goal:16, chaos:true, enemies:[{type:"wanderer"}]},
      choiceB:{title:"Chaos et chasseur", goal:18, chaos:true, enemies:[{type:"hunter"}]},
      stage4:{title:"Chaos enfermé", goal:18, chaos:true, walls:true, enemies:[{type:"wanderer"}]},
      boss:{title:"Boss : Le Cœur du Chaos", goal:20, chaos:true, walls:true, enemies:[{type:"boss"}], timeLimit:70} },
    { stage1:{title:"Convergence", goal:16, mazeLight:true, walls:true, enemies:[{type:"wanderer"},{type:"hunter"}], timeLimit:70},
      stage2:{title:"Duplication", goal:18, portal:true, enemies:[{type:"wanderer"},{type:"wanderer"}], timeLimit:65},
      choiceA:{title:"Le chaos redouble", goal:18, chaos:true, walls:true, enemies:[{type:"hunter"},{type:"hunter"}]},
      choiceB:{title:"Dernière ligne droite", goal:20, mazeLight:true, portal:true, enemies:[{type:"wanderer"}], timeLimit:75},
      stage4:{title:"Épreuve ultime", goal:22, chaos:true, mazeLight:true, walls:true, enemies:[{type:"wanderer"},{type:"wanderer"},{type:"hunter"}], timeLimit:90},
      boss:{title:"Boss final : L'Ultime Épreuve", goal:26, chaos:true, mazeLight:true, walls:true, portal:true, enemies:[{type:"boss"},{type:"hunter"}], timeLimit:100} }
  ];

  function autoDesc(spec){
    let s = "Ramassez "+spec.goal+" fruits";
    if(spec.timeLimit) s += " en "+spec.timeLimit+"s";
    const hazards=[];
    if(spec.walls) hazards.push("des murs mortels");
    if(spec.maze) hazards.push("un labyrinthe dense");
    if(spec.mazeLight) hazards.push("quelques obstacles");
    if(spec.portal) hazards.push("des portails");
    if(spec.chaos) hazards.push("des obstacles mobiles");
    if(spec.enemies && spec.enemies.length){
      const w = spec.enemies.filter(e=>e.type==="wanderer").length;
      const h = spec.enemies.filter(e=>e.type==="hunter").length;
      const b = spec.enemies.filter(e=>e.type==="boss").length;
      if(w) hazards.push(w+" rôdeur"+(w>1?"s":""));
      if(h) hazards.push(h+" chasseur"+(h>1?"s":""));
      if(b) hazards.push("un boss");
    }
    if(hazards.length) s += " avec "+hazards.join(", ");
    return s+".";
  }

  function buildLevelDef(id, chapter, stageIndex, isBoss, isChoice, requires, requireMode, spec){
    const hazardCount = (spec.walls?1:0)+(spec.maze?2:0)+(spec.mazeLight?1:0)+(spec.portal?1.2:0)+(spec.chaos?2:0)+((spec.enemies||[]).length*1.4);
    const goldTime = Math.round(spec.goal*2.4 + hazardCount*3.5 + 7);
    const silverTime = Math.round(goldTime*1.55);
    const build = (c,r)=>{
      let obstacles=[];
      if(spec.chaos) obstacles = randomObstacles(c,r, Math.max(6,Math.round(c*r*(spec.mazeLight?0.018:0.024))), []);
      else if(spec.maze) obstacles = mazeObstacles(c,r,false);
      else if(spec.mazeLight) obstacles = mazeObstacles(c,r,true);
      const portals = spec.portal? portalPairs(c,r) : [];
      return {obstacles, portals, walls: !!spec.walls};
    };
    return {
      id, chapter, stageIndex, isBoss, isChoice, requires, requireMode,
      title: spec.title, desc: autoDesc(spec),
      goal: spec.goal, timeLimit: spec.timeLimit||0,
      enemiesInit: spec.enemies||[],
      goldTime: spec.timeLimit? undefined : goldTime,
      silverTime: spec.timeLimit? undefined : silverTime,
      goldRemain: spec.timeLimit? Math.max(6,Math.round(spec.timeLimit*0.38)) : undefined,
      silverRemain: spec.timeLimit? Math.max(2,Math.round(spec.timeLimit*0.12)) : undefined,
      speedStart: spec.speedStart,
      build
    };
  }

  const LEVELS = [];
  CHAPTER_SPECS.forEach((chap, chapterIdx)=>{
    const base = chapterIdx*6;
    STAGE_KEYS.forEach((key, si)=>{
      const spec = chap[key];
      const id = base+si+1;
      const isBoss = key==="boss";
      const isChoice = key==="choiceA"||key==="choiceB";
      let requires=[], requireMode="all";
      if(si===0){ requires=[]; }
      else if(key==="stage2"){ requires=[base+1]; }
      else if(key==="choiceA"||key==="choiceB"){ requires=[base+2]; }
      else if(key==="stage4"){ requires=[base+3, base+4]; requireMode="any"; }
      else if(key==="boss"){ requires=[base+5]; }
      LEVELS.push(buildLevelDef(id, chapterIdx, si, isBoss, isChoice, requires, requireMode, spec));
    });
  });
  function getLevel(id){ return LEVELS.find(l=>l.id===id); }
  function isNodeUnlocked(node){
    if(node.stageIndex===0){
      if(node.chapter===0) return true;
      const prevBossId = node.chapter*6;
      return save.career.completed.includes(prevBossId);
    }
    if(!node.requires.length) return true;
    if(node.requireMode==="any") return node.requires.some(rid=>save.career.completed.includes(rid));
    return node.requires.every(rid=>save.career.completed.includes(rid));
  }
  function findNextSingle(node){
    if(node.isBoss){
      return LEVELS.find(l=>l.chapter===node.chapter+1 && l.stageIndex===0) || null;
    }
    const followers = LEVELS.filter(l=>l.requires.includes(node.id));
    const unlocked = followers.filter(f=>isNodeUnlocked(f));
    return unlocked.length===1 ? unlocked[0] : null;
  }

  /* ================= Rank / XP ================= */

  const RANKS = [
    {name:"Bronze", emoji:"🥉", min:1},
    {name:"Argent", emoji:"🥈", min:5},
    {name:"Or", emoji:"🥇", min:10},
    {name:"Platine", emoji:"💠", min:15},
    {name:"Diamant", emoji:"💎", min:20},
    {name:"Maître", emoji:"🏆", min:25}
  ];
  function xpToNext(level){ return 80 + (level-1)*35; }
  function rankFor(level){
    let current = RANKS[0];
    for(const r of RANKS){ if(level>=r.min) current=r; }
    return current;
  }
  function renderRanksList(){
    const list = $("#ranksList");
    list.innerHTML = "";
    const myRank = rankFor(save.playerLevel);
    RANKS.forEach((r, idx)=>{
      const max = idx<RANKS.length-1 ? RANKS[idx+1].min-1 : null;
      const range = max ? ("Niveaux "+r.min+"–"+max) : ("Niveau "+r.min+"+");
      const isCurrent = r.name===myRank.name;
      const row = document.createElement("div");
      row.className = "card"+(isCurrent?" rank-current":"");
      row.innerHTML = `
        <div class="swatch" style="background:var(--surface);border:1px solid var(--border);font-size:20px;">${r.emoji}</div>
        <div class="info">
          <div class="t">${r.name}${isCurrent?' <span class="rarity-badge" style="color:var(--accent2);border-color:rgba(51,230,196,0.5);background:rgba(51,230,196,0.12);">Votre rang</span>':''}</div>
          <div class="d">${range}</div>
        </div>`;
      list.appendChild(row);
    });
  }
  function addXp(amount){
    if(amount<=0) return;
    save.xp += amount;
    let leveled = false;
    while(save.xp >= xpToNext(save.playerLevel)){
      save.xp -= xpToNext(save.playerLevel);
      save.playerLevel++;
      save.crystals += 2;
      leveled = true;
    }
    persist();
    renderRank();
    if(leveled) showXpToast();
  }
  function showXpToast(){
    const r = rankFor(save.playerLevel);
    const el = $("#xpToast");
    el.innerHTML = "Niveau "+save.playerLevel+"<small>Rang "+r.name+" "+r.emoji+" · +2💎</small>";
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(()=>el.classList.remove("show"), 1800);
  }
  function renderRank(){
    const r = rankFor(save.playerLevel);
    $("#rankBadge").textContent = r.emoji+" "+r.name+" · Niv. "+save.playerLevel;
    const need = xpToNext(save.playerLevel);
    $("#xpNow").textContent = save.xp;
    $("#xpNext").textContent = "/"+need+" XP";
    $("#xpFill").style.width = Math.min(100, Math.round(save.xp/need*100))+"%";
  }

  /* ================= Keybinds ================= */

  const DEFAULT_KEYBINDS = {up:"ArrowUp", down:"ArrowDown", left:"ArrowLeft", right:"ArrowRight", p1:"1", p2:"2", p3:"3", skill:" "};
  const BINDING_ROWS = [
    {id:"up", label:"Haut"}, {id:"down", label:"Bas"}, {id:"left", label:"Gauche"}, {id:"right", label:"Droite"},
    {id:"p1", label:"Objet 1"}, {id:"p2", label:"Objet 2"}, {id:"p3", label:"Objet 3"}, {id:"skill", label:"Compétence (serpent premium)"}
  ];
  function keyLabel(k){
    if(!k) return "—";
    const map = {ArrowUp:"↑", ArrowDown:"↓", ArrowLeft:"←", ArrowRight:"→", " ":"Espace"};
    return map[k] || (k.length===1 ? k.toUpperCase() : k);
  }

  /* ================= Save data ================= */

  const SAVE_KEY = "snakeplus_save_v8";
  function defaultSave(){
    return {
      coins:15, crystals:0, best:0, bestLevel:1, bestChrono:0,
      xp:0, playerLevel:1,
      ownedSnakes:["classic"], ownedMaps:["classic"],
      selectedSnake:"classic", selectedMap:"classic",
      inventory:{magnet:0, slow:0, shield:0, coinrush:0, scoresurge:0, detonator:0},
      loadout:[],
      career:{stars:{}, completed:[]},
      keybinds:Object.assign({}, DEFAULT_KEYBINDS),
      snakeUpgrades:{},
      stats:{totalFruits:0, totalGames:0, totalDeaths:0, totalCareerWins:0, bestCombo:0, gachaPulls:0},
      achievements:[],
      daily:{date:"", fruitsToday:0, gamesToday:0, bestComboToday:0, claimed:[]},
      settings:{musicVol:0.35, sfxVol:1}
    };
  }
  let save = load();
  function load(){
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      if(!raw) return defaultSave();
      const parsed = JSON.parse(raw);
      const merged = Object.assign(defaultSave(), parsed);
      merged.inventory = Object.assign(defaultSave().inventory, parsed.inventory||{});
      merged.career = Object.assign(defaultSave().career, parsed.career||{});
      merged.keybinds = Object.assign(Object.assign({}, DEFAULT_KEYBINDS), parsed.keybinds||{});
      merged.snakeUpgrades = Object.assign({}, parsed.snakeUpgrades||{});
      merged.stats = Object.assign(defaultSave().stats, parsed.stats||{});
      merged.daily = Object.assign(defaultSave().daily, parsed.daily||{});
      merged.settings = Object.assign(defaultSave().settings, parsed.settings||{});
      merged.achievements = parsed.achievements||[];
      return merged;
    }catch(e){ return defaultSave(); }
  }
  function persist(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }catch(e){} }

  function todayStr(){ return new Date().toISOString().slice(0,10); }
  function ensureDaily(){
    const t = todayStr();
    if(save.daily.date!==t){
      save.daily = {date:t, fruitsToday:0, gamesToday:0, bestComboToday:0, claimed:[]};
      persist();
    }
  }

  /* ---- Snake upgrades (spend coins to permanently boost an owned snake) ---- */
  function getUpgradeLevel(id){ return save.snakeUpgrades[id]||0; }
  function upgradeCost(level){ return 80*(level+1); }
  const MAX_UPGRADE = 5;

  function getSnake(id){ return SNAKES.find(s=>s.id===id) || PREMIUM_SNAKES.find(s=>s.id===id); }
  function getMap(id){ return MAPS.find(m=>m.id===id); }
  function getItem(id){ return ITEMS.find(i=>i.id===id); }

  /* ================= Achievements & daily challenges ================= */

  const ACHIEVEMENTS = [
    {id:"first_bite", name:"Première bouchée", icon:"🍎", desc:"Manger votre tout premier fruit.", reward:{coins:10}, check:s=>s.stats.totalFruits>=1},
    {id:"hundred", name:"Gourmand", icon:"🍽️", desc:"Manger 100 fruits au total.", reward:{coins:40,xp:20}, check:s=>s.stats.totalFruits>=100},
    {id:"fivehundred", name:"Glouton insatiable", icon:"🐍", desc:"Manger 500 fruits au total.", reward:{coins:120,crystals:2,xp:50}, check:s=>s.stats.totalFruits>=500},
    {id:"combo5", name:"Combo parfait", icon:"⚡", desc:"Atteindre un combo x5.", reward:{coins:30,xp:15}, check:s=>s.stats.bestCombo>=5},
    {id:"first_star", name:"Première étoile", icon:"⭐", desc:"Terminer un niveau de carrière.", reward:{coins:20,xp:10}, check:s=>s.career.completed.length>=1},
    {id:"ten_levels", name:"Sur la bonne voie", icon:"🧭", desc:"Terminer 10 niveaux de carrière.", reward:{coins:80,crystals:2,xp:30}, check:s=>s.career.completed.length>=10},
    {id:"chapter1", name:"Chapitre bouclé", icon:"🏁", desc:"Terminer tout le premier chapitre.", reward:{coins:60,crystals:2,xp:25}, check:s=>[1,2,3,4,5,6].every(id=>s.career.completed.includes(id))},
    {id:"boss_slayer", name:"Chasseur de boss", icon:"👑", desc:"Vaincre un boss de carrière.", reward:{coins:80,crystals:3,xp:30}, check:s=>[6,12,18,24,30,36].some(id=>s.career.completed.includes(id))},
    {id:"all_bosses", name:"Fléau des boss", icon:"💀", desc:"Vaincre tous les boss de la carrière.", reward:{coins:250,crystals:8,xp:100}, check:s=>[6,12,18,24,30,36].every(id=>s.career.completed.includes(id))},
    {id:"gacha_first", name:"Un tour de manège", icon:"🎰", desc:"Faire votre premier tirage gacha.", reward:{coins:15}, check:s=>s.stats.gachaPulls>=1},
    {id:"legendary", name:"Coup de chance", icon:"🌟", desc:"Obtenir un serpent premium Légendaire.", reward:{coins:100,xp:40}, check:s=>s.ownedSnakes.includes("chronos")||s.ownedSnakes.includes("mirage")},
    {id:"collection", name:"Collection complète", icon:"📚", desc:"Posséder les 10 serpents de base.", reward:{coins:150,crystals:4,xp:50}, check:s=>SNAKES.every(sk=>s.ownedSnakes.includes(sk.id))},
    {id:"rank_gold", name:"Rang Or", icon:"🥇", desc:"Atteindre le rang Or (niveau 10).", reward:{coins:60,crystals:2}, check:s=>s.playerLevel>=10},
    {id:"rank_master", name:"Rang Maître", icon:"🏆", desc:"Atteindre le rang Maître (niveau 25).", reward:{coins:300,crystals:10,xp:0}, check:s=>s.playerLevel>=25},
    {id:"veteran", name:"Vétéran", icon:"🎖️", desc:"Jouer 50 parties au total (libre, chrono ou carrière).", reward:{coins:100,xp:40}, check:s=>s.stats.totalGames>=50},
    {id:"flawless", name:"Sans faille", icon:"✨", desc:"Terminer un niveau de carrière avec 3 étoiles.", reward:{coins:40,xp:15}, check:s=>Object.values(s.career.stars).some(v=>v>=3)}
  ];

  function checkAchievements(){
    let any = false;
    ACHIEVEMENTS.forEach(a=>{
      if(save.achievements.includes(a.id)) return;
      if(!a.check(save)) return;
      save.achievements.push(a.id);
      if(a.reward.coins) save.coins += a.reward.coins;
      if(a.reward.crystals) save.crystals += a.reward.crystals;
      persist();
      if(a.reward.xp) addXp(a.reward.xp);
      showAchievementToast(a);
      any = true;
    });
    if(any){ persist(); renderTopbar(); }
  }
  function showAchievementToast(a){
    const el = $("#xpToast");
    el.innerHTML = a.icon+" Succès débloqué<small>"+a.name+"</small>";
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(()=>el.classList.remove("show"), 2200);
    playChord([523,659],0.3,0.07,"triangle");
  }

  const DAILY_DEFS = [
    {id:"d_fruits", name:"Panier garni", desc:"Manger 20 fruits aujourd'hui.", reward:{coins:15,crystals:1}, goal:20, progress:s=>s.daily.fruitsToday},
    {id:"d_games", name:"Échauffement", desc:"Terminer 1 partie aujourd'hui (libre, chrono ou carrière).", reward:{coins:10}, goal:1, progress:s=>s.daily.gamesToday},
    {id:"d_combo", name:"Enchaînement", desc:"Réussir un combo x3 ou plus aujourd'hui.", reward:{coins:15,crystals:1}, goal:3, progress:s=>s.daily.bestComboToday}
  ];
  function renderDaily(){
    ensureDaily();
    const list = $("#dailyList");
    list.innerHTML = "";
    DAILY_DEFS.forEach(d=>{
      const prog = Math.min(d.goal, d.progress(save));
      const done = prog>=d.goal;
      const claimed = save.daily.claimed.includes(d.id);
      const row = document.createElement("div");
      row.className = "card";
      row.innerHTML = `
        <div class="swatch" style="background:var(--surface);border:1px solid var(--border);font-size:16px;">${claimed?'✅':(done?'🎁':'📅')}</div>
        <div class="info">
          <div class="t">${d.name}</div>
          <div class="d">${d.desc} (${prog}/${d.goal})</div>
        </div>
        <div class="action"></div>`;
      const btn = document.createElement("button");
      btn.className = "buy-btn"+(claimed?" owned":"");
      if(claimed){ btn.textContent="Reçu"; btn.disabled=true; }
      else if(done){ btn.textContent="Réclamer"; btn.onclick=()=>{
          save.daily.claimed.push(d.id);
          if(d.reward.coins) save.coins+=d.reward.coins;
          if(d.reward.crystals) save.crystals+=d.reward.crystals;
          persist(); renderTopbar(); renderDaily();
        }; }
      else { btn.textContent="En cours"; btn.disabled=true; }
      row.querySelector(".action").appendChild(btn);
      list.appendChild(row);
    });
  }
  function renderAchievementsList(){
    const list = $("#achievementsList");
    list.innerHTML = "";
    ACHIEVEMENTS.forEach(a=>{
      const unlocked = save.achievements.includes(a.id);
      const row = document.createElement("div");
      row.className = "card"+(unlocked?"":" locked-ach");
      row.innerHTML = `
        <div class="swatch" style="background:${unlocked?'var(--accent-grad)':'var(--surface)'};color:${unlocked?'#0a0c12':'var(--text-dim)'};border:${unlocked?'none':'1px solid var(--border)'};">${unlocked?a.icon:'🔒'}</div>
        <div class="info">
          <div class="t">${a.name}</div>
          <div class="d">${a.desc}</div>
        </div>`;
      list.appendChild(row);
    });
  }

  /* ================= DOM refs ================= */

  const $ = sel => document.querySelector(sel);
  const canvas = $("#game"), ctx = canvas.getContext("2d");
  const stage = $("#stage");
  const overlays = {
    home: $("#overlay-home"), shop: $("#overlay-shop"), settings: $("#overlay-settings"), gacha: $("#overlay-gacha"),
    ranks: $("#overlay-ranks"), achievements: $("#overlay-achievements"),
    pause: $("#overlay-pause"), gameover: $("#overlay-gameover"),
    levelintro: $("#overlay-levelintro"), levelresult: $("#overlay-levelresult")
  };
  function showOverlay(name){
    Object.values(overlays).forEach(o=>o.classList.add("hidden"));
    if(name) overlays[name].classList.remove("hidden");
    requestAnimationFrame(resizeCanvas);
  }
  $("#closeRanks").onclick = ()=>{ showOverlay("home"); };
  $("#rankBadge").onclick = ()=>{ renderRanksList(); showOverlay("ranks"); };

  let achTab = "daily";
  function renderAchievementsOverlay(){
    ensureDaily();
    document.querySelectorAll(".ach-tab").forEach(t=>t.classList.toggle("active", t.dataset.achtab===achTab));
    $("#dailyPanel").classList.toggle("panel-hidden", achTab!=="daily");
    $("#achPanel").classList.toggle("panel-hidden", achTab!=="list");
    renderDaily();
    renderAchievementsList();
  }
  document.querySelectorAll(".ach-tab").forEach(t=>{
    t.onclick = ()=>{ achTab = t.dataset.achtab; renderAchievementsOverlay(); };
  });
  $("#openAchievements").onclick = ()=>{ achTab="daily"; renderAchievementsOverlay(); showOverlay("achievements"); };
  $("#closeAchievements").onclick = ()=>{ showOverlay("home"); };

  /* ================= Responsive grid-aligned canvas ================= */

  let COLS=18, ROWS=30, CELL=20;
  const TARGET_CELL = 24;

  function computeFreeDims(){
    const rect = stage.getBoundingClientRect();
    const w = Math.max(240, Math.floor(rect.width));
    const h = Math.max(240, Math.floor(rect.height));
    let cols = Math.max(10, Math.min(30, Math.floor(w/TARGET_CELL)));
    let rows = Math.max(14, Math.min(34, Math.floor(h/TARGET_CELL)));
    return {cols, rows};
  }
  function resizeCanvas(){
    const rect = stage.getBoundingClientRect();
    const w = Math.max(240, Math.floor(rect.width));
    const h = Math.max(240, Math.floor(rect.height));
    if(state!=="playing" && state!=="paused"){
      const d = computeFreeDims(); COLS = d.cols; ROWS = d.rows;
    }
    const cell = Math.min(w/COLS, h/ROWS);
    CELL = cell;
    const pxW = Math.round(COLS*cell), pxH = Math.round(ROWS*cell);
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    canvas.width = Math.round(pxW*dpr); canvas.height = Math.round(pxH*dpr);
    canvas.style.width = pxW+"px"; canvas.style.height = pxH+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    draw();
  }
  new ResizeObserver(resizeCanvas).observe(stage);
  window.addEventListener("orientationchange", ()=>setTimeout(resizeCanvas,150));

  /* ================= Top-level UI render ================= */

  function renderTopbar(){
    $("#coinCount").textContent = Math.floor(save.coins);
    $("#crystalCount").textContent = Math.floor(save.crystals);
    $("#bestScore").textContent = save.best;
    $("#coinCountShop").textContent = Math.floor(save.coins);
    $("#crystalCountShop").textContent = Math.floor(save.crystals);
    renderRank();
  }

  let homeTab = "free";
  function updatePlayButtonLabel(){
    const btn = $("#playBtn");
    if(homeTab==="chrono") btn.textContent = "Jouer en Chrono (60s)";
    else if(homeTab==="zen") btn.textContent = "Jouer en Zen";
    else btn.textContent = "Jouer en libre";
  }
  document.querySelectorAll(".modetab").forEach(t=>{
    t.onclick = ()=>{
      homeTab = t.dataset.mode;
      document.querySelectorAll(".modetab").forEach(x=>x.classList.toggle("active", x===t));
      $("#freePanel").classList.toggle("panel-hidden", homeTab==="career");
      $("#careerPanel").classList.toggle("panel-hidden", homeTab!=="career");
      if(homeTab==="career") renderCareerOverview();
      updatePlayButtonLabel();
    };
  });

  function renderHome(){
    const sk = getSnake(save.selectedSnake), mp = getMap(save.selectedMap);
    $("#snakeSwatch").style.background = sk.body;
    $("#snakeSwatch").textContent = sk.emoji;
    $("#snakeName").textContent = sk.name;
    $("#mapSwatch").style.background = mp.tone;
    $("#mapName").textContent = mp.name;
    $("#mapMult").textContent = "x"+mp.coinMult+" pièces";

    const row = $("#loadoutRow");
    row.innerHTML = "";
    const owned = ITEMS.filter(it => save.inventory[it.id] > 0);
    if(owned.length===0){
      const d = document.createElement("div");
      d.className = "chip2 empty";
      d.textContent = "Aucun objet — visitez la boutique";
      row.appendChild(d);
    } else {
      owned.forEach(it=>{
        const chip = document.createElement("div");
        const on = save.loadout.includes(it.id);
        chip.className = "chip2" + (on?" on":"");
        chip.innerHTML = it.icon + " " + it.name + ' <span class="n">x'+save.inventory[it.id]+"</span>";
        chip.onclick = ()=>{
          if(on){ save.loadout = save.loadout.filter(x=>x!==it.id); }
          else { if(save.loadout.length>=3) return; save.loadout.push(it.id); }
          persist(); renderHome();
        };
        row.appendChild(chip);
      });
    }
    renderRank();
    renderCareerOverview();
    updatePlayButtonLabel();
  }

  /* ---- Career path UI: one continuous scrollable tree across all chapters ---- */

  function renderCareerOverview(){
    let totalStars = 0;
    LEVELS.forEach(l=>{ totalStars += (save.career.stars[l.id]||0); });
    $("#careerProgress").textContent = save.career.completed.length+"/"+LEVELS.length+" niveaux terminés · "+totalStars+"★";
    renderCareerPath();
  }

  function renderCareerPath(){
    const row = $("#pathRow");
    row.innerHTML = "";
    const SPACING=100, R=26, BOSS_R=32, START_X=32, CHAPTER_GAP=48;
    const xSlotBase = {0:0,1:1,2:2,3:2,4:3,5:4};
    const CENTER_Y=104, TOP_Y=52, BOTTOM_Y=156;
    const SLOTS_PER_CHAPTER = 4; // 5 stage columns -> 4 gaps

    const chapterStartX = [];
    let cursor = START_X;
    CHAPTER_NAMES.forEach((name, ci)=>{
      chapterStartX[ci] = cursor;
      cursor += SLOTS_PER_CHAPTER*SPACING;
      if(ci<CHAPTER_NAMES.length-1) cursor += SPACING + CHAPTER_GAP;
    });
    const totalWidth = cursor + 40;
    row.style.width = totalWidth+"px";

    const nodeX = {};

    CHAPTER_NAMES.forEach((name, ci)=>{
      const segStart = chapterStartX[ci];
      const line = document.createElement("div");
      line.className = "path-line";
      line.style.left = segStart+"px"; line.style.top = CENTER_Y+"px"; line.style.width = (SLOTS_PER_CHAPTER*SPACING)+"px";
      row.appendChild(line);

      const marker = document.createElement("div");
      marker.className = "chapter-marker";
      marker.style.left = segStart+"px";
      marker.textContent = (ci+1)+". "+name;
      row.appendChild(marker);

      if(ci<CHAPTER_NAMES.length-1){
        const gapLine = document.createElement("div");
        gapLine.className = "path-line dim";
        gapLine.style.left = (segStart+SLOTS_PER_CHAPTER*SPACING)+"px"; gapLine.style.top = CENTER_Y+"px";
        gapLine.style.width = (SPACING+CHAPTER_GAP)+"px";
        row.appendChild(gapLine);
      }
    });

    LEVELS.forEach(node=>{
      const slot = xSlotBase[node.stageIndex];
      const x = chapterStartX[node.chapter] + slot*SPACING;
      nodeX[node.id] = x;
      let y = CENTER_Y;
      if(node.stageIndex===2) y = TOP_Y;
      if(node.stageIndex===3) y = BOTTOM_Y;

      if(node.isChoice){
        const conn = document.createElement("div");
        conn.className = "path-connector";
        conn.style.left = x+"px";
        if(node.stageIndex===2){ conn.style.top=(TOP_Y+R)+"px"; conn.style.height=Math.max(0,(CENTER_Y-TOP_Y-R))+"px"; }
        else { conn.style.top=(CENTER_Y)+"px"; conn.style.height=Math.max(0,(BOTTOM_Y-CENTER_Y-R))+"px"; }
        row.appendChild(conn);
      }

      const unlocked = isNodeUnlocked(node);
      const stars = save.career.stars[node.id]||0;
      const completed = save.career.completed.includes(node.id);
      const el = document.createElement("div");
      el.className = "path-node"+(node.isBoss?" boss":"")+(unlocked?" unlocked":"")+(completed?" done":"");
      el.style.left = x+"px"; el.style.top = y+"px";
      el.textContent = node.isBoss ? "👑" : (unlocked ? node.id : "🔒");
      if(unlocked) el.onclick = ()=>openLevelIntro(node.id);
      row.appendChild(el);

      const rad = node.isBoss ? BOSS_R : R;
      if(stars>0){
        const st = document.createElement("div");
        st.className = "stars-node";
        st.style.left = x+"px"; st.style.top = (y+rad+4)+"px";
        st.textContent = "★".repeat(stars);
        row.appendChild(st);
      }
      const label = document.createElement("div");
      label.className = "path-label";
      label.style.left = x+"px"; label.style.top = (y+rad+(stars>0?16:4))+"px";
      label.textContent = node.title;
      row.appendChild(label);
    });

    const target = LEVELS.find(l=> isNodeUnlocked(l) && !save.career.completed.includes(l.id)) || LEVELS[LEVELS.length-1];
    const scrollEl = row.parentElement;
    requestAnimationFrame(()=>{
      scrollEl.scrollLeft = Math.max(0, (nodeX[target.id]||0) - scrollEl.clientWidth/2);
    });
  }

  function openLevelIntro(levelId){
    const lv = getLevel(levelId);
    selectedLevelId = levelId;
    $("#liTitle").textContent = (lv.isBoss?"👑 ":"") + "Niveau "+lv.id+" — "+lv.title;
    $("#liDesc").textContent = lv.desc;
    const probe = lv.build(24,24);
    const tags = [lv.goal+" fruits"];
    if(lv.timeLimit) tags.push("⏱ "+lv.timeLimit+"s");
    if(probe.walls) tags.push("murs mortels");
    if(probe.obstacles.length>0) tags.push("obstacles");
    if(probe.portals.length>0) tags.push("portails");
    const w = lv.enemiesInit.filter(e=>e.type==="wanderer").length;
    const h = lv.enemiesInit.filter(e=>e.type==="hunter").length;
    if(w) tags.push(w+" rôdeur"+(w>1?"s":""));
    if(h) tags.push(h+" chasseur"+(h>1?"s":""));
    if(lv.isChoice) tags.push("chemin alternatif");
    $("#liTags").innerHTML = tags.map(t=>'<span class="tag'+(lv.isBoss?' boss':'')+'">'+t+'</span>').join("")
      + (lv.isBoss? '<span class="tag boss">👑 Boss</span>' : "");
    showOverlay("levelintro");
  }
  $("#liStart").onclick = ()=>{ startLevel(selectedLevelId); };
  $("#liBack").onclick = ()=>{ showOverlay("home"); };

  /* Desktop scrolling for the career tree: wheel and click-drag (no visible scrollbar) */
  (function setupPathScrollControls(){
    const scrollEl = $("#pathScroll");
    scrollEl.addEventListener("wheel", (e)=>{
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if(delta===0) return;
      e.preventDefault();
      scrollEl.scrollLeft += delta;
    }, {passive:false});

    let isDown=false, startX=0, startScroll=0, moved=false;
    scrollEl.addEventListener("mousedown",(e)=>{
      isDown=true; moved=false;
      startX=e.pageX; startScroll=scrollEl.scrollLeft;
      scrollEl.classList.add("dragging");
    });
    window.addEventListener("mousemove",(e)=>{
      if(!isDown) return;
      const dx = e.pageX-startX;
      if(Math.abs(dx)>4) moved=true;
      scrollEl.scrollLeft = startScroll-dx;
    });
    window.addEventListener("mouseup",()=>{
      isDown=false;
      scrollEl.classList.remove("dragging");
    });
    scrollEl.addEventListener("click",(e)=>{
      if(moved){ e.stopPropagation(); e.preventDefault(); moved=false; }
    }, true);
  })();

  /* ================= Shop ================= */

  let shopTab = "snakes";
  function renderShop(){
    const list = $("#shopList");
    list.innerHTML = "";
    document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active", t.dataset.tab===shopTab));

    if(shopTab==="snakes"){
      SNAKES.forEach(sk=>{
        const owned = save.ownedSnakes.includes(sk.id);
        const equipped = save.selectedSnake === sk.id;
        list.appendChild(buildCard({
          swatchColor: sk.body, emoji: sk.emoji, title: sk.name, desc: sk.desc,
          price: sk.price, owned, equipped,
          onBuy: ()=>{ if(save.coins < sk.price) return; save.coins -= sk.price; save.ownedSnakes.push(sk.id); persist(); renderShop(); renderTopbar(); },
          onEquip: ()=>{ save.selectedSnake = sk.id; persist(); renderShop(); renderHome(); }
        }));
      });
    } else if(shopTab==="maps"){
      MAPS.forEach(mp=>{
        const owned = save.ownedMaps.includes(mp.id);
        const equipped = save.selectedMap === mp.id;
        list.appendChild(buildCard({
          swatchColor: mp.tone, title: mp.name, desc: mp.desc,
          price: mp.price, owned, equipped, mult: mp.coinMult,
          onBuy: ()=>{ if(save.coins < mp.price) return; save.coins -= mp.price; save.ownedMaps.push(mp.id); persist(); renderShop(); renderTopbar(); },
          onEquip: ()=>{ save.selectedMap = mp.id; persist(); renderShop(); renderHome(); }
        }));
      });
    } else if(shopTab==="items"){
      ITEMS.forEach(it=>{
        const qty = save.inventory[it.id];
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="swatch" style="background:var(--surface);border:1px solid var(--border);">${it.icon}</div>
          <div class="info"><div class="t">${it.name} ${qty>0?'<span class="qty-badge">x'+qty+'</span>':''}</div><div class="d">${it.desc}</div></div>
          <div class="action"><button class="buy-btn">${it.price} 🪙</button></div>`;
        const btn = card.querySelector(".buy-btn");
        btn.onclick = ()=>{
          if(save.coins < it.price) return;
          save.coins -= it.price; save.inventory[it.id] = (save.inventory[it.id]||0) + 1;
          persist(); renderShop(); renderTopbar(); renderHome();
        };
        if(save.coins < it.price) btn.disabled = true;
        list.appendChild(card);
      });
    } else if(shopTab==="upgrade"){
      const owned = [].concat(SNAKES.filter(s=>save.ownedSnakes.includes(s.id)), PREMIUM_SNAKES.filter(s=>save.ownedSnakes.includes(s.id)));
      owned.forEach(sk=>{
        const lvl = getUpgradeLevel(sk.id);
        const maxed = lvl>=MAX_UPGRADE;
        const cost = upgradeCost(lvl);
        const isPremium = !!sk.skill;
        const effect = isPremium
          ? "+4% pièces, -7% recharge par niveau"+(lvl>=4?" (charge bonus active)":"")+" par niveau"
          : "+4% de pièces gagnées par niveau avec ce serpent";
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="swatch" style="background:${sk.body}">${sk.emoji}</div>
          <div class="info">
            <div class="t">${sk.name} <span class="mult-badge">${"●".repeat(lvl)}${"○".repeat(MAX_UPGRADE-lvl)}</span></div>
            <div class="d">${effect}</div>
          </div>
          <div class="action"><button class="buy-btn">${maxed?"Max":cost+" 🪙"}</button></div>`;
        const btn = card.querySelector(".buy-btn");
        if(maxed){ btn.disabled = true; btn.className += " owned"; }
        else {
          if(save.coins < cost) btn.disabled = true;
          btn.onclick = ()=>{
            if(save.coins < cost) return;
            save.coins -= cost;
            save.snakeUpgrades[sk.id] = lvl+1;
            persist(); renderShop(); renderTopbar();
          };
        }
        list.appendChild(card);
      });
      if(owned.length===0){
        const empty = document.createElement("div");
        empty.className = "gacha-hint";
        empty.textContent = "Débloquez au moins un serpent pour commencer à l'améliorer.";
        list.appendChild(empty);
      }
    } else if(shopTab==="gacha"){
      const info = document.createElement("div");
      info.className = "card gacha-panel";
      info.innerHTML = `
        <div class="gacha-crystal-row"><div class="t" style="font-size:14px;">💎 <span>${Math.floor(save.crystals)}</span> cristaux</div></div>
        <div class="gacha-hint">Un tirage coûte ${GACHA_COST} cristaux et offre un serpent premium à compétence active. Un doublon est converti en pièces. Les cristaux s'obtiennent en jouant : carrière, montées de niveau, bonnes parties en libre.</div>`;
      const pullBtn = document.createElement("button");
      pullBtn.className = "btn"; pullBtn.textContent = "Invoquer ("+GACHA_COST+" 💎)";
      pullBtn.disabled = save.crystals < GACHA_COST;
      pullBtn.onclick = doGachaPull;
      info.appendChild(pullBtn);
      list.appendChild(info);

      PREMIUM_SNAKES.forEach(sk=>{
        const owned = save.ownedSnakes.includes(sk.id);
        const equipped = save.selectedSnake === sk.id;
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="swatch" style="background:${owned?sk.body:'var(--surface)'};color:${owned?'#fff':'var(--text-dim)'}">${owned?sk.emoji:'✨'}</div>
          <div class="info">
            <div class="t">${sk.name} <span class="rarity-badge" style="color:${sk.rarityColor};border-color:${sk.rarityColor}88;background:${sk.rarityColor}18;">${sk.rarity}</span></div>
            <div class="d">${owned? sk.desc : "Compétence active à découvrir — obtenable via le Gacha."}</div>
          </div>
          <div class="action"></div>`;
        const action = card.querySelector(".action");
        const btn = document.createElement("button");
        if(!owned){ btn.className="buy-btn locked"; btn.textContent="???"; btn.disabled=true; }
        else if(equipped){ btn.className="buy-btn equipped"; btn.textContent="Équipé"; btn.disabled=true; }
        else { btn.className="buy-btn owned"; btn.textContent="Choisir"; btn.onclick=()=>{ save.selectedSnake=sk.id; persist(); renderShop(); renderHome(); }; }
        action.appendChild(btn);
        list.appendChild(card);
      });
    }
  }

  function buildCard({swatchColor, emoji, title, desc, price, owned, equipped, mult, onBuy, onEquip}){
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="swatch" style="background:${swatchColor}">${emoji||""}</div>
      <div class="info"><div class="t">${title}${mult?' <span class="mult-badge">x'+mult+'</span>':''}</div><div class="d">${desc}</div></div>
      <div class="action"></div>`;
    const action = card.querySelector(".action");
    const btn = document.createElement("button");
    btn.className = "buy-btn";
    if(!owned){
      btn.textContent = price + " 🪙";
      if(save.coins < price) btn.disabled = true;
      btn.onclick = onBuy;
    } else if(equipped){
      btn.textContent = "Équipé"; btn.className += " equipped"; btn.disabled = true;
    } else {
      btn.textContent = "Choisir"; btn.className += " owned"; btn.onclick = onEquip;
    }
    action.appendChild(btn);
    return card;
  }

  document.querySelectorAll(".tab").forEach(t=>{ t.onclick = ()=>{ shopTab = t.dataset.tab; renderShop(); }; });
  $("#openShopFromHome").onclick = ()=>{ shopTab="snakes"; renderShop(); showOverlay("shop"); };
  $("#goToSnake").onclick = ()=>{ shopTab="snakes"; renderShop(); showOverlay("shop"); };
  $("#goToMap").onclick = ()=>{ shopTab="maps"; renderShop(); showOverlay("shop"); };
  $("#closeShop").onclick = ()=>{ showOverlay("home"); renderHome(); };

  $("#resetLink").onclick = ()=>{
    if(confirm("Réinitialiser toute la progression ? Cette action est définitive.")){
      save = defaultSave(); persist(); renderTopbar(); renderHome();
    }
  };

  /* ================= Gacha (with capsule opening animation) ================= */

  function doGachaPull(){
    if(save.crystals < GACHA_COST) return;
    save.crystals -= GACHA_COST;
    const roll = Math.random()*100;
    let cum=0, picked=null;
    for(const s of PREMIUM_SNAKES){ cum += s.weight; if(roll<=cum){ picked=s; break; } }
    if(!picked) picked = PREMIUM_SNAKES[PREMIUM_SNAKES.length-1];

    const isNew = !save.ownedSnakes.includes(picked.id);
    let msg;
    if(isNew){ save.ownedSnakes.push(picked.id); msg = picked.desc; }
    else { const bonus = 120; save.coins += bonus; msg = "Doublon converti en +"+bonus+" pièces."; }
    save.stats.gachaPulls++;
    persist();
    renderTopbar();
    checkAchievements();

    playCapsuleSequence(picked, isNew, msg);
  }

  function playCapsuleSequence(picked, isNew, msg){
    const stageEl = $("#capsuleStage"), ball = $("#capsuleBall"), reveal = $("#gachaReveal");
    reveal.classList.add("hidden");
    stageEl.classList.remove("hidden");
    ball.className = "capsule rarity-"+rarityClass(picked.rarity);
    showOverlay("gacha");
    playTone(90,0.18,"sine",0.14);

    setTimeout(()=>{
      ball.classList.add("shaking");
      [0,140,280,420].forEach(t=>setTimeout(()=>playTone(280+Math.random()*120,0.05,"square",0.05),t));
    }, 520);

    setTimeout(()=>{
      ball.classList.add("cracking");
      playNoiseBurst(0.2,0.22);
      playSweep(220,900,0.3,"sawtooth",0.12);
    }, 1300);

    setTimeout(()=>{
      stageEl.classList.add("hidden");
      $("#gachaIcon").textContent = picked.emoji;
      $("#gachaRarity").textContent = picked.rarity;
      $("#gachaRarity").style.color = picked.rarityColor;
      $("#gachaName").textContent = isNew ? picked.name+" débloqué !" : picked.name+" (doublon)";
      $("#gachaMsg").textContent = msg;
      $("#gachaClose").onclick = ()=>{ showOverlay("shop"); renderShop(); renderTopbar(); };
      reveal.classList.remove("hidden");
      playGachaRevealSound(picked.rarity);
    }, 1720);
  }

  function playGachaRevealSound(rarity){
    if(rarity==="Légendaire"){
      playChord([523,659,784],0.5,0.09,"triangle");
      setTimeout(()=>playChord([784,1046,1318],0.7,0.08,"triangle"),160);
    } else if(rarity==="Épique"){
      playChord([440,554,659],0.4,0.08,"triangle");
    } else {
      playChord([392,494],0.3,0.07,"triangle");
    }
  }

  /* ================= Settings (keybinds) ================= */

  let bindingTarget = null;
  function renderSettings(){
    const list = $("#settingsList");
    list.innerHTML = "";
    BINDING_ROWS.forEach(b=>{
      const row = document.createElement("div");
      row.className = "card";
      row.innerHTML = `
        <div class="swatch" style="background:var(--surface);border:1px solid var(--border);font-size:14px;">${keyLabel(save.keybinds[b.id])}</div>
        <div class="info"><div class="t">${b.label}</div></div>
        <div class="action"><button class="buy-btn">Changer</button></div>`;
      row.querySelector(".buy-btn").onclick = ()=>startBinding(b.id, row);
      list.appendChild(row);
    });
  }
  function startBinding(id, row){
    bindingTarget = id;
    document.querySelectorAll("#settingsList .buy-btn").forEach(b=>b.disabled=true);
    row.querySelector(".swatch").textContent = "…";
  }
  document.addEventListener("keydown",(e)=>{
    if(!bindingTarget) return;
    e.preventDefault();
    const id = bindingTarget;
    if(e.key!=="Escape"){
      Object.keys(save.keybinds).forEach(k=>{
        if(k!==id && save.keybinds[k] && save.keybinds[k].toLowerCase()===e.key.toLowerCase()) save.keybinds[k]=null;
      });
      save.keybinds[id] = e.key;
      persist();
    }
    bindingTarget = null;
    renderSettings();
  }, true);
  $("#openSettings").onclick = ()=>{
    renderSettings();
    $("#musicVolume").value = Math.round(save.settings.musicVol*100);
    $("#sfxVolume").value = Math.round(save.settings.sfxVol*100);
    $("#musicVolLabel").textContent = Math.round(save.settings.musicVol*100)+"%";
    $("#sfxVolLabel").textContent = Math.round(save.settings.sfxVol*100)+"%";
    showOverlay("settings");
  };
  $("#closeSettings").onclick = ()=>{ showOverlay("home"); };
  $("#resetBinds").onclick = ()=>{ save.keybinds = Object.assign({}, DEFAULT_KEYBINDS); persist(); renderSettings(); };
  $("#musicVolume").addEventListener("input", (e)=>{ setMusicVolume(e.target.value/100); $("#musicVolLabel").textContent = e.target.value+"%"; });
  $("#sfxVolume").addEventListener("input", (e)=>{ setSfxVolume(e.target.value/100); $("#sfxVolLabel").textContent = e.target.value+"%"; });

  /* ================= Secret unlock-all ================= */

  const SECRET_CODE = "sesame";
  let secretBuffer = "";
  function secretUnlockAll(){
    SNAKES.forEach(s=>{ if(!save.ownedSnakes.includes(s.id)) save.ownedSnakes.push(s.id); });
    PREMIUM_SNAKES.forEach(s=>{ if(!save.ownedSnakes.includes(s.id)) save.ownedSnakes.push(s.id); });
    MAPS.forEach(m=>{ if(!save.ownedMaps.includes(m.id)) save.ownedMaps.push(m.id); });
    LEVELS.forEach(l=>{ save.career.stars[l.id]=3; if(!save.career.completed.includes(l.id)) save.career.completed.push(l.id); });
    save.coins += 5000;
    save.crystals += 500;
    persist();
    renderTopbar(); renderHome();
    const el = $("#xpToast");
    el.innerHTML = "Tout débloqué !<small>Mode développeur</small>";
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(()=>el.classList.remove("show"), 2200);
  }

  /* ================= Game engine ================= */

  let state = "home"; // home | playing | paused | gameover | levelresult
  let mode = "free"; // free | chrono | zen | career
  let selectedLevelId = 1;
  let snakeDef, mapDef, obstacles, portals, hasWalls, isChaos, isIce, isFog, chaosTimer;
  let iceSkip = 0;
  let snake, dir, nextDir, food, tickMs, acc, lastTime, rafId;
  let score, coinsThisRun, foodEaten, curLevel;
  let currentLevel, fruitsThisLevel, levelStartTime, pauseOffset, pauseBeganAt, timeLimitMs;
  let chronoStartTime, chronoDuration;
  let usedShieldOrTank, shieldCharge, magnetUntil, slowUntil, coinRushOn, scoreSurgeOn;
  let comboMult, lastEatTime, growToggle, regenCounter;
  let runLoadout, loadoutUsed;
  let enemies, enemyTickCounter;
  let decoy = null;
  let particles = [];
  let soundOn = true;
  let history = [];
  let skillCharges = 0, skillMaxCharges = 0, skillCooldownMs = 0, skillNextReadyAt = 0;
  let skillFx = null;
  let freezeUntil = 0;
  let chronosPending = null;

  function commonSetup(){
    const d = computeFreeDims();
    COLS = d.cols; ROWS = d.rows;
    const cx = Math.floor(COLS/2), cy = Math.floor(ROWS/2);
    snake = [[cx-1,cy],[cx-2,cy],[cx-3,cy]];
    dir = {x:1,y:0}; nextDir = {x:1,y:0};
    usedShieldOrTank = false; shieldCharge = false;
    magnetUntil = 0; slowUntil = 0; coinRushOn = false; scoreSurgeOn = false;
    comboMult = 1; lastEatTime = 0; growToggle = false; regenCounter = 0;
    particles = []; enemies = []; enemyTickCounter = 0; decoy = null;
    history = []; skillFx = null; freezeUntil = 0; chronosPending = null;

    if(snakeDef.skill){
      const lvl = getUpgradeLevel(snakeDef.id);
      skillCharges = snakeDef.skill.charges + (snakeDef.skill.recharge && lvl>=4 ? 1 : 0);
      skillMaxCharges = (snakeDef.skill.maxCharges!=null ? snakeDef.skill.maxCharges : snakeDef.skill.charges) + (snakeDef.skill.recharge && lvl>=4 ? 1 : 0);
      skillCooldownMs = Math.round((snakeDef.skill.cooldown || 0) * (1 - 0.07*lvl));
      skillNextReadyAt = 0;
    } else {
      skillCharges = 0; skillMaxCharges = 0; skillCooldownMs = 0; skillNextReadyAt = 0;
    }

    runLoadout = save.loadout.slice(0,3);
    runLoadout.forEach(id=>{ save.inventory[id] = Math.max(0,(save.inventory[id]||0)-1); });
    persist();
    loadoutUsed = runLoadout.map(()=>false);
  }

  function pushHistorySnapshot(){
    const s = mode==="free" ? score : fruitsThisLevel;
    history.push({t:performance.now(), snake:snake.map(seg=>seg.slice()), dir:Object.assign({},dir), s});
    const cutoff = performance.now()-7000;
    while(history.length && history[0].t<cutoff) history.shift();
  }

  function startRun(runMode){
    mode = runMode || "free";
    snakeDef = getSnake(save.selectedSnake);
    mapDef = getMap(save.selectedMap);
    commonSetup();
    const built = mapDef.build(COLS, ROWS);
    obstacles = built.obstacles; portals = built.portals; hasWalls = built.walls; isChaos = built.chaos;
    isIce = !!built.ice; isFog = !!built.fog; iceSkip = 0;
    score = 0; coinsThisRun = 0; foodEaten = 0; curLevel = 1;
    pauseOffset = 0; pauseBeganAt = 0;
    tickMs = 150;
    placeFood();
    pushHistorySnapshot();

    clearInterval(chaosTimer);
    if(isChaos){
      chaosTimer = setInterval(()=>{
        if(state!=="playing") return;
        obstacles = randomObstacles(COLS, ROWS, obstacles.length, [snake[0]]);
      }, 12000);
    }
    if(mode==="chrono"){ chronoStartTime = performance.now(); chronoDuration = 60000; }
    beginPlay();
    $("#modeChip").textContent = mode==="zen" ? "Zen" : (mode==="chrono" ? "60s" : "Niv. 1");
    $("#modeChip").classList.remove("low");
  }

  function startLevel(levelId){
    mode = "career";
    currentLevel = getLevel(levelId);
    snakeDef = getSnake(save.selectedSnake);
    commonSetup();
    const built = currentLevel.build(COLS, ROWS);
    obstacles = built.obstacles; portals = built.portals; hasWalls = built.walls; isChaos = false;
    clearInterval(chaosTimer);
    fruitsThisLevel = 0;
    tickMs = currentLevel.speedStart || 150;
    timeLimitMs = (currentLevel.timeLimit||0)*1000;
    levelStartTime = performance.now();
    pauseOffset = 0; pauseBeganAt = 0;
    enemies = currentLevel.enemiesInit.map(e=>{ const c = randFreeCell(6); return {x:c[0], y:c[1], type:e.type}; });
    placeFood();
    pushHistorySnapshot();
    beginPlay();
    updateCareerHud();
  }

  function beginPlay(){
    state = "playing";
    $("#hud").classList.remove("hidden");
    $("#controlsBar").classList.remove("hidden");
    $("#comboTag").classList.remove("show");
    showOverlay(null);
    renderPowerbar();
    acc = 0; lastTime = performance.now();
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  function randFreeCell(minDistFromHead){
    let tries = 0;
    while(tries++ < 900){
      const x = Math.floor(Math.random()*COLS), y = Math.floor(Math.random()*ROWS);
      if(snake.some(s=>s[0]===x&&s[1]===y)) continue;
      if(obstacles.some(o=>o[0]===x&&o[1]===y)) continue;
      if(portals.some(p=>(p[0][0]===x&&p[0][1]===y)||(p[1][0]===x&&p[1][1]===y))) continue;
      if(enemies.some(e=>e.x===x&&e.y===y)) continue;
      if(food && food[0]===x && food[1]===y) continue;
      if(minDistFromHead){
        const d = Math.abs(x-snake[0][0])+Math.abs(y-snake[0][1]);
        if(d < minDistFromHead) continue;
      }
      return [x,y];
    }
    return [1,1];
  }
  function placeFood(){ food = randFreeCell(0); }

  function applyFreeLevelUp(){
    const needed = enemyScheduleForLevel(curLevel);
    while(enemies.length < needed.length){
      const type = needed[enemies.length];
      const c = randFreeCell(6);
      enemies.push({x:c[0], y:c[1], type});
    }
    $("#modeChip").textContent = "Niv. "+curLevel;
    const toast = $("#levelToast");
    toast.innerHTML = "Niveau "+curLevel+"<small>"+(needed.length>0?"Un danger apparaît":"La cadence s'intensifie")+"</small>";
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(()=>toast.classList.remove("show"), 1500);
    beep(700,0.12,"triangle");
    if(save.bestLevel < curLevel){ save.bestLevel = curLevel; }
  }

  function updateCareerHud(){
    $("#scoreBadge").innerHTML = fruitsThisLevel+"<small>/"+currentLevel.goal+"</small>";
    if(currentLevel.timeLimit){
      const elapsed = performance.now()-levelStartTime-pauseOffset;
      const remain = Math.max(0, Math.ceil((timeLimitMs-elapsed)/1000));
      const chip = $("#modeChip");
      chip.textContent = "⏱ "+remain+"s";
      chip.classList.toggle("low", remain<=10);
    } else {
      $("#modeChip").textContent = (currentLevel.isBoss?"👑 ":"")+"Niveau "+currentLevel.id;
      $("#modeChip").classList.remove("low");
    }
  }

  function effectiveTick(){
    let t = tickMs;
    if(snakeDef.id==="viper") t = t/1.3;
    if(performance.now() < slowUntil) t = t*2;
    return Math.max(40,t);
  }

  function loop(now){
    rafId = requestAnimationFrame(loop);
    if(state!=="playing") return;

    // skill recharge (all premium skills except Ouroboros)
    if(snakeDef.skill && snakeDef.skill.recharge && skillCharges<skillMaxCharges){
      if(skillNextReadyAt===0) skillNextReadyAt = now+skillCooldownMs;
      else if(now>=skillNextReadyAt){
        skillCharges++;
        skillNextReadyAt = skillCharges<skillMaxCharges ? now+skillCooldownMs : 0;
        renderPowerbar();
      }
    }

    if(now < freezeUntil){ draw(); return; } // Chronos time-stop pause

    if(chronosPending){
      const snap = chronosPending.snap;
      snake = snap.snake.map(s=>s.slice());
      dir = Object.assign({}, snap.dir); nextDir = Object.assign({}, snap.dir);
      if(mode==="free") score = snap.s; else fruitsThisLevel = snap.s;
      if(food && snake.some(s=>s[0]===food[0]&&s[1]===food[1])) placeFood();
      renderTopbar();
      if(mode==="career") updateCareerHud();
      chronosPending = null;
      lastTime = now;
      draw();
      return; // skip this frame's tick so the rewind doesn't also move forward
    }

    const dt = now-lastTime; lastTime = now;
    acc += dt;
    const step = effectiveTick();
    if(acc >= step){ acc = 0; tickGame(); }
    updateParticles(dt);
    if(mode==="career"){
      updateCareerHud();
      if(currentLevel.timeLimit){
        const elapsed = performance.now()-levelStartTime-pauseOffset;
        if(elapsed >= timeLimitMs){ failLevel("timeout"); return; }
      }
    } else if(mode==="chrono"){
      const elapsed = now-chronoStartTime-pauseOffset;
      const remain = Math.max(0, Math.ceil((chronoDuration-elapsed)/1000));
      const chip = $("#modeChip");
      chip.textContent = "⏱ "+remain+"s";
      chip.classList.toggle("low", remain<=10);
      if(elapsed >= chronoDuration){ endChrono(); return; }
    }
    draw();
  }

  function checkHazard(){
    if(mode==="zen") return false;
    if(shieldCharge){ shieldCharge=false; markLoadoutUsed("shield"); return false; }
    if(snakeDef.id==="tank" && !usedShieldOrTank){ usedShieldOrTank=true; renderPowerbar(); return false; }
    return true;
  }
  function markLoadoutUsed(id){
    const idx = runLoadout.indexOf(id);
    if(idx>=0){ loadoutUsed[idx]=true; renderPowerbar(); }
  }

  function tickGame(){
    if(isIce){
      iceSkip = 1-iceSkip;
      if(iceSkip===0) dir = nextDir;
    } else {
      dir = nextDir;
    }
    let head = [snake[0][0]+dir.x, snake[0][1]+dir.y];

    if(hasWalls && snakeDef.id!=="ghost"){
      if(head[0]<0||head[0]>=COLS||head[1]<0||head[1]>=ROWS){
        if(checkHazard()) return endRun("wall"); else return;
      }
    } else {
      head[0] = (head[0]+COLS)%COLS; head[1] = (head[1]+ROWS)%ROWS;
    }

    for(const p of portals){
      if(head[0]===p[0][0] && head[1]===p[0][1]) head = [p[1][0],p[1][1]];
      else if(head[0]===p[1][0] && head[1]===p[1][1]) head = [p[0][0],p[0][1]];
    }

    if(obstacles.some(o=>o[0]===head[0]&&o[1]===head[1])){ if(checkHazard()) return endRun("obstacle"); else return; }
    if(enemies.some(e=>e.x===head[0]&&e.y===head[1])){ if(checkHazard()) return endRun("enemy"); else return; }
    const selfHit = snake.some((s,i)=> i<snake.length-1 && s[0]===head[0] && s[1]===head[1]);
    if(selfHit){ if(checkHazard()) return endRun("self"); else return; }

    const magnetRadius = Math.max(performance.now()<magnetUntil ? 3 : 0, snakeDef.id==="magnetic" ? 2 : 0);
    if(magnetRadius>0){
      const dx = food[0]-head[0], dy = food[1]-head[1];
      const dist = Math.abs(dx)+Math.abs(dy);
      if(dist<=magnetRadius && dist>0){
        if(Math.abs(dx)>=Math.abs(dy)) food[0] -= Math.sign(dx); else food[1] -= Math.sign(dy);
      }
    }

    snake.unshift(head);

    if(head[0]===food[0] && head[1]===food[1]){
      handleEat();
    } else {
      if(snakeDef.id==="tiny"){ growToggle = !growToggle; if(!growToggle) snake.pop(); }
      else { snake.pop(); }
    }

    enemyTickCounter++;
    if(enemyTickCounter % 2 === 0){ moveEnemies(); }

    pushHistorySnapshot();
  }

  function handleEat(){
    const now = performance.now();
    if(now - lastEatTime < 2500){ comboMult = Math.min(5, comboMult+1); } else { comboMult = 1; }
    lastEatTime = now;

    let luckyBonus = snakeDef.id==="lucky" && Math.random()<0.25;

    let pts = 10;
    if(snakeDef.id==="viper") pts = Math.round(pts*1.5);
    pts *= comboMult;
    if(scoreSurgeOn) pts *= 2;
    if(luckyBonus) pts *= 3;
    pts = Math.round(pts);

    let coins = 1;
    if(snakeDef.id==="golden") coins *= 2;
    if(coinRushOn) coins *= 3;
    if(luckyBonus) coins *= 2;
    if(mode==="free"||mode==="chrono"||mode==="zen") coins = coins * mapDef.coinMult;
    coins *= (1 + 0.04*getUpgradeLevel(snakeDef.id));
    coins = Math.round(coins);

    if(mode==="career"){ coinsThisRun = (coinsThisRun||0) + coins; save.coins += coins; fruitsThisLevel++; }
    else { score += pts; coinsThisRun += coins; save.coins += coins; }

    ensureDaily();
    save.stats.totalFruits++;
    save.daily.fruitsToday++;
    if(comboMult > save.stats.bestCombo) save.stats.bestCombo = comboMult;
    if(comboMult > save.daily.bestComboToday) save.daily.bestComboToday = comboMult;

    if(snakeDef.id==="regen"){
      regenCounter++;
      if(regenCounter%8===0 && snake.length>4){
        snake.pop();
        save.coins += 3;
      }
    }

    spawnParticles(food[0], food[1], luckyBonus?"#ffc94d":"#ff9f43", luckyBonus?16:10);
    renderTopbar();
    updateComboTag();
    beep(luckyBonus?1100:880, 0.07, "sine");
    checkAchievements();

    if(mode==="career"){
      if(fruitsThisLevel >= currentLevel.goal){ placeFood(); winLevel(); return; }
      placeFood();
    } else {
      foodEaten++;
      const newLevel = 1 + Math.floor(foodEaten/FOOD_PER_LEVEL);
      if(newLevel > curLevel && mode!=="chrono"){ curLevel = newLevel; applyFreeLevelUp(); }
      tickMs = Math.max(70, tickMs-2);
      placeFood();
    }
  }

  function updateComboTag(){
    const tag = $("#comboTag");
    if(comboMult>1 && mode!=="career"){ tag.textContent = "x"+comboMult+" combo"; tag.classList.add("show"); }
    else { tag.classList.remove("show"); }
  }

  function moveEnemies(){
    const now = performance.now();
    enemies.forEach(e=>{
      if(e.stunnedUntil && now<e.stunnedUntil) return;
      if(e.type==="boss"){
        if(!e._moveCounter) e._moveCounter=0;
        e._moveCounter++;
        if(e._moveCounter%3!==0) return; // boss moves slower, every 3rd enemy tick
        if(!e.nextTelegraph) e.nextTelegraph = now+5500;
        if(now>=e.nextTelegraph && !e.telegraphing){
          e.telegraphing = true; e.telegraphUntil = now+900;
        }
        if(e.telegraphing && now>=e.telegraphUntil){
          e.telegraphing = false; e.nextTelegraph = now+5500;
          for(let k=0;k<2;k++){
            const c = randFreeCell(3);
            if(c) obstacles.push(c);
          }
        }
      }
      let dirs = [[1,0],[-1,0],[0,1],[0,-1]];
      const targetPoint = (decoy && now<decoy.until) ? [decoy.x, decoy.y] : [snake[0][0], snake[0][1]];
      const isChaser = e.type==="hunter" || e.type==="boss";
      const evaded = snakeDef.id==="camo" && e.type==="hunter" && !(decoy && now<decoy.until);
      if(isChaser && !evaded){
        dirs.sort((a,b)=>{
          const da = Math.abs((e.x+a[0])-targetPoint[0])+Math.abs((e.y+a[1])-targetPoint[1]);
          const db = Math.abs((e.x+b[0])-targetPoint[0])+Math.abs((e.y+b[1])-targetPoint[1]);
          return da-db;
        });
      } else { dirs.sort(()=>Math.random()-0.5); }
      for(const d of dirs){
        let nx = e.x+d[0], ny = e.y+d[1];
        if(hasWalls){ if(nx<0||nx>=COLS||ny<0||ny>=ROWS) continue; }
        else { nx = (nx+COLS)%COLS; ny = (ny+ROWS)%ROWS; }
        if(obstacles.some(o=>o[0]===nx&&o[1]===ny)) continue;
        if(enemies.some(o=>o!==e && o.x===nx && o.y===ny)) continue;
        e.x = nx; e.y = ny; break;
      }
    });
    if(enemies.some(e=>e.x===snake[0][0]&&e.y===snake[0][1])){
      if(checkHazard()) endRun("enemy");
    }
  }

  function endRun(reason){
    if(mode==="career") failLevel("died");
    else if(mode==="chrono") endChrono();
    else die();
  }

  function die(){
    state = "gameover";
    $("#hud").classList.add("hidden");
    $("#controlsBar").classList.add("hidden");
    if(mode==="free" && score > save.best){ save.best = score; }
    if(mode==="free" && save.bestLevel < curLevel){ save.bestLevel = curLevel; }
    save.crystals += Math.floor(score/150);
    ensureDaily();
    save.stats.totalGames++; save.stats.totalDeaths++; save.daily.gamesToday++;
    addXp(Math.floor(score/4)+coinsThisRun);
    persist();
    renderTopbar();
    checkAchievements();
    $("#finalScore").textContent = score;
    const newRecord = mode==="free" && score>0 && score===save.best;
    $("#goDetails").innerHTML = "+"+coinsThisRun+" pièces"+(mode==="free"?" · niveau "+curLevel:"")+(newRecord? ' · <span class="record">nouveau record !</span>' : "");
    showOverlay("gameover");
    spawnParticles(snake[0][0], snake[0][1], "#ff5470", 18);
    beep(120,0.2,"sawtooth");
  }

  function endChrono(){
    state = "gameover";
    $("#hud").classList.add("hidden");
    $("#controlsBar").classList.add("hidden");
    clearInterval(chaosTimer);
    let newRecord = false;
    if(score > save.bestChrono){ save.bestChrono = score; newRecord = true; }
    save.crystals += Math.floor(score/150);
    ensureDaily();
    save.stats.totalGames++; save.daily.gamesToday++;
    addXp(Math.floor(score/4)+coinsThisRun);
    persist();
    renderTopbar();
    checkAchievements();
    $("#goDetails").innerHTML = ""; // replaced below
    $("#finalScore").textContent = score;
    $("#goDetails").innerHTML = "+"+coinsThisRun+" pièces en 60 secondes"+(newRecord? ' · <span class="record">nouveau record Chrono !</span>' : "");
    showOverlay("gameover");
    spawnParticles(snake[0][0], snake[0][1], "#ffc94d", 18);
    beep(700,0.2,"triangle");
  }

  function starsFor(level, elapsedMs, remainMs){
    if(level.timeLimit){
      const leftSec = remainMs/1000;
      if(leftSec >= level.goldRemain) return 3;
      if(leftSec >= level.silverRemain) return 2;
      return 1;
    } else {
      const elapsedSec = elapsedMs/1000;
      if(elapsedSec <= level.goldTime) return 3;
      if(elapsedSec <= level.silverTime) return 2;
      return 1;
    }
  }

  function winLevel(){
    state = "levelresult";
    $("#hud").classList.add("hidden");
    $("#controlsBar").classList.add("hidden");
    clearInterval(chaosTimer);
    const elapsed = performance.now()-levelStartTime-pauseOffset;
    const remain = timeLimitMs - elapsed;
    const stars = starsFor(currentLevel, elapsed, remain);

    const firstTime = !save.career.completed.includes(currentLevel.id);
    let reward;
    if(firstTime){ reward = 20 + stars*8 + (currentLevel.isBoss?30:0); save.career.completed.push(currentLevel.id); save.crystals += 1+stars+(currentLevel.isBoss?2:0); }
    else { reward = 6; }
    save.coins += reward;
    save.career.stars[currentLevel.id] = Math.max(save.career.stars[currentLevel.id]||0, stars);
    addXp(20 + stars*8 + (currentLevel.isBoss?20:0));
    ensureDaily();
    save.stats.totalGames++; save.stats.totalCareerWins++; save.daily.gamesToday++;
    persist(); renderTopbar();
    checkAchievements();

    $("#lrIcon").textContent = currentLevel.isBoss ? "👑" : (stars===3?"🏆":(stars===2?"⭐":"✅"));
    $("#lrTitle").textContent = currentLevel.isBoss ? "Boss vaincu !" : "Niveau réussi !";
    $("#lrStars").textContent = "★".repeat(stars)+"☆".repeat(3-stars);
    $("#lrSub").textContent = "+"+reward+" pièces"+(firstTime?" · +"+(1+stars+(currentLevel.isBoss?2:0))+"💎":"")+" · +"+(coinsThisRun||0)+" en jeu";

    const nxt = findNextSingle(currentLevel);
    const primary = $("#lrPrimary");
    primary.textContent = nxt ? "Niveau suivant" : "Carte des niveaux";
    primary.onclick = nxt ? ()=>startLevel(nxt.id) : ()=>{ showOverlay("home"); renderHome(); };
    $("#lrSecondary").onclick = ()=>{ showOverlay("home"); renderHome(); };

    showOverlay("levelresult");
    spawnParticles(snake[0][0], snake[0][1], "#ffc94d", 22);
    beep(900,0.15,"triangle");
  }

  function failLevel(reason){
    state = "levelresult";
    $("#hud").classList.add("hidden");
    $("#controlsBar").classList.add("hidden");
    clearInterval(chaosTimer);
    ensureDaily();
    save.stats.totalGames++; save.stats.totalDeaths++; save.daily.gamesToday++;
    persist();

    $("#lrIcon").textContent = "💥";
    $("#lrTitle").textContent = "Niveau échoué";
    $("#lrStars").textContent = "";
    $("#lrSub").textContent = reason==="timeout" ? "Le temps est écoulé — "+fruitsThisLevel+"/"+currentLevel.goal+" fruits" : "Collision fatale — "+fruitsThisLevel+"/"+currentLevel.goal+" fruits";

    const primary = $("#lrPrimary");
    primary.textContent = "Réessayer";
    primary.onclick = ()=>startLevel(currentLevel.id);
    $("#lrSecondary").onclick = ()=>{ showOverlay("home"); renderHome(); };

    showOverlay("levelresult");
    spawnParticles(snake[0][0], snake[0][1], "#ff5470", 18);
    beep(120,0.2,"sawtooth");
  }

  /* ================= Premium skills ================= */

  function triggerSkillAnimation(id, extra){
    skillFx = Object.assign({id, start:performance.now()}, extra||{});
  }

  const CHRONOS_FREEZE_MS = 1100;
  const CHRONOS_RELEASE_MS = 450;

  function useChronos(){
    if(history.length===0) return false;
    const now = performance.now();
    const target = now-5000;
    let idx = -1;
    for(let i=history.length-1;i>=0;i--){ if(history[i].t<=target){ idx=i; break; } }
    if(idx===-1) idx = 0;
    const snap = history[idx];
    const playFrames = history.slice(idx).slice().reverse(); // scrub from "now" back to the target frame
    const ghostBefore = snake.map(s=>s.slice());

    freezeUntil = now+CHRONOS_FREEZE_MS;
    chronosPending = {snap};
    triggerSkillAnimation("chronos", {playFrames, ghost:ghostBefore});

    playNoiseBurst(0.08,0.22);
    playTone(140,1.1,"sine",0.1);
    setTimeout(()=>playSweep(500,1300,0.35,"sine",0.15), CHRONOS_FREEZE_MS);
    return true;
  }

  function useNova(){
    enemies = [];
    const hx=snake[0][0], hy=snake[0][1];
    obstacles = obstacles.filter(o=> Math.abs(o[0]-hx)+Math.abs(o[1]-hy) > 3);
    triggerSkillAnimation("nova");
    playNoiseBurst(0.3,0.3);
    playTone(80,0.5,"sawtooth",0.16);
    playSweep(300,60,0.4,"sawtooth",0.13);
    return true;
  }

  function useOuroboros(){
    if(snake.length<=3) return false;
    const cutCount = Math.floor(snake.length/2);
    const removed = snake.splice(snake.length-cutCount, cutCount);
    removed.forEach(seg=> spawnParticles(seg[0], seg[1], "#ff8f7a", 6));
    const bonus = Math.max(1, Math.floor(cutCount/2));
    save.coins += bonus;
    triggerSkillAnimation("ouroboros");
    renderTopbar();
    playTone(900,0.05,"square",0.14);
    setTimeout(()=>playTone(600,0.08,"square",0.11),60);
    return true;
  }

  function useTempete(){
    const dashDist = 4;
    const startHead = snake[0].slice();
    let moved = 0;
    for(let i=0;i<dashDist;i++){
      let nh = [snake[0][0]+dir.x, snake[0][1]+dir.y];
      if(hasWalls && snakeDef.id!=="ghost"){
        if(nh[0]<0||nh[0]>=COLS||nh[1]<0||nh[1]>=ROWS) break;
      } else { nh[0]=(nh[0]+COLS)%COLS; nh[1]=(nh[1]+ROWS)%ROWS; }
      snake.unshift(nh); snake.pop();
      moved++;
    }
    if(moved===0) return false;
    if(food && snake[0][0]===food[0] && snake[0][1]===food[1]) handleEat();
    triggerSkillAnimation("tempete", {from:startHead, to:snake[0].slice()});
    playNoiseBurst(0.1,0.18);
    playSweep(300,1400,0.15,"square",0.16);
    return true;
  }

  function useLeviathan(){
    if(obstacles.length===0) return false;
    obstacles = [];
    triggerSkillAnimation("leviathan");
    playSweep(600,150,0.35,"sine",0.14);
    playNoiseBurst(0.4,0.1);
    return true;
  }

  function useTitan(){
    const hx=snake[0][0], hy=snake[0][1];
    const now = performance.now();
    let hit = false;
    enemies.forEach(e=>{
      if(Math.abs(e.x-hx)+Math.abs(e.y-hy) <= 5){ e.stunnedUntil = now+4000; hit = true; }
    });
    triggerSkillAnimation("titan");
    playNoiseBurst(0.15,0.2);
    playTone(110,0.35,"square",0.15);
    return true;
  }

  function useMirage(){
    decoy = {x:snake[0][0], y:snake[0][1], until:performance.now()+5000};
    triggerSkillAnimation("mirage", {decoyPos:[decoy.x, decoy.y]});
    playSweep(900,300,0.3,"sine",0.13);
    playTone(1200,0.1,"triangle",0.1);
    return true;
  }

  const SKILL_ACTIONS = {chronos:useChronos, nova:useNova, ouroboros:useOuroboros, tempete:useTempete, leviathan:useLeviathan, titan:useTitan, mirage:useMirage};

  function activateSkill(){
    if(!snakeDef.skill || skillCharges<=0 || state!=="playing") return;
    const fn = SKILL_ACTIONS[snakeDef.skill.id];
    if(!fn) return;
    const ok = fn();
    if(ok!==false){
      skillCharges--;
      if(snakeDef.skill.recharge && skillNextReadyAt===0){ skillNextReadyAt = performance.now()+skillCooldownMs; }
    }
    renderPowerbar();
  }

  /* ================= Particles ================= */

  function spawnParticles(gx,gy,color,count){
    const px = gx*CELL+CELL/2, py = gy*CELL+CELL/2;
    for(let i=0;i<count;i++){
      const ang = Math.random()*Math.PI*2;
      const spd = 0.6+Math.random()*1.8;
      particles.push({x:px, y:py, vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd, life:1, decay:0.02+Math.random()*0.02, color, size:2+Math.random()*2.5});
    }
  }
  function updateParticles(dt){
    const f = dt/16.67;
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx*f; p.y += p.vy*f; p.vy += 0.03*f; p.life -= p.decay*f;
      if(p.life<=0) particles.splice(i,1);
    }
  }

  /* ================= Rendering ================= */

  function roundRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  function drawEyes(cx,cy,tiny){
    const ex=dir.x, ey=dir.y, px=-ey, py=ex;
    const eyeOffset = CELL*(tiny?0.12:0.16);
    const eyeSize = CELL*(tiny?0.13:0.09);
    [1,-1].forEach(sgn=>{
      ctx.fillStyle="rgba(255,255,255,0.92)";
      ctx.beginPath();
      ctx.arc(cx+ex*CELL*0.15+px*eyeOffset*sgn, cy+ey*CELL*0.15+py*eyeOffset*sgn, eyeSize, 0, Math.PI*2);
      ctx.fill();
    });
  }

  function drawHeadAccessory(cx,cy,now){
    const id = snakeDef.id;
    const ex=dir.x, ey=dir.y, px=-ey, py=ex;
    if(id==="viper"){
      ctx.strokeStyle="#ff8fa3"; ctx.lineWidth=1.5;
      const tx=cx+ex*CELL*0.68, ty=cy+ey*CELL*0.68;
      ctx.beginPath(); ctx.moveTo(cx+ex*CELL*0.42, cy+ey*CELL*0.42); ctx.lineTo(tx,ty); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx+px*3,ty+py*3); ctx.moveTo(tx,ty); ctx.lineTo(tx-px*3,ty-py*3); ctx.stroke();
    } else if(id==="golden"){
      ctx.fillStyle="#fff3c4";
      ctx.beginPath();
      ctx.moveTo(cx-CELL*0.22, cy-CELL*0.32); ctx.lineTo(cx-CELL*0.1, cy-CELL*0.52); ctx.lineTo(cx, cy-CELL*0.32);
      ctx.lineTo(cx+CELL*0.1, cy-CELL*0.52); ctx.lineTo(cx+CELL*0.22, cy-CELL*0.32);
      ctx.closePath(); ctx.fill();
    } else if(id==="tank"){
      ctx.fillStyle="rgba(255,255,255,0.35)";
      ctx.fillRect(cx-CELL*0.16, cy-CELL*0.44, CELL*0.32, CELL*0.12);
    } else if(id==="magnetic"){
      const r = CELL*0.58 + Math.sin(now/220)*2;
      ctx.strokeStyle="rgba(79,211,255,0.4)"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy,r*0.7,0,Math.PI*2); ctx.stroke();
    } else if(id==="lucky"){
      ctx.save(); ctx.translate(cx, cy-CELL*0.42); ctx.rotate(now/450);
      ctx.fillStyle="#fff";
      for(let k=0;k<4;k++){ ctx.rotate(Math.PI/2); ctx.fillRect(-1, -CELL*0.13, 2, CELL*0.13); }
      ctx.restore();
    } else if(id==="chronos"){
      const r = CELL*0.4;
      ctx.strokeStyle="rgba(255,255,255,0.55)"; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.arc(cx,cy-CELL*0.02,r,0,Math.PI*2); ctx.stroke();
      const a1 = now/500, a2 = now/1400;
      ctx.beginPath(); ctx.moveTo(cx,cy-CELL*0.02); ctx.lineTo(cx+Math.cos(a1)*r*0.6, cy-CELL*0.02+Math.sin(a1)*r*0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy-CELL*0.02); ctx.lineTo(cx+Math.cos(a2)*r*0.35, cy-CELL*0.02+Math.sin(a2)*r*0.35); ctx.stroke();
    } else if(id==="nova"){
      ctx.fillStyle="rgba(155,229,100,0.85)";
      for(let k=-1;k<=1;k+=2){
        ctx.beginPath();
        ctx.moveTo(cx+k*CELL*0.18, cy-CELL*0.3);
        ctx.lineTo(cx+k*CELL*0.3, cy-CELL*0.48);
        ctx.lineTo(cx+k*CELL*0.08, cy-CELL*0.4);
        ctx.closePath(); ctx.fill();
      }
    } else if(id==="ouroboros"){
      ctx.strokeStyle="rgba(255,255,255,0.6)"; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.arc(cx,cy-CELL*0.42,CELL*0.14,0.4,Math.PI*1.8); ctx.stroke();
    } else if(id==="tempete"){
      ctx.strokeStyle="#fff"; ctx.lineWidth=1.6;
      ctx.beginPath();
      ctx.moveTo(cx-CELL*0.1, cy-CELL*0.5);
      ctx.lineTo(cx+CELL*0.06, cy-CELL*0.36);
      ctx.lineTo(cx-CELL*0.04, cy-CELL*0.34);
      ctx.lineTo(cx+CELL*0.12, cy-CELL*0.18);
      ctx.stroke();
    } else if(id==="leviathan"){
      ctx.fillStyle="rgba(205,239,255,0.7)";
      ctx.beginPath();
      ctx.moveTo(cx, cy-CELL*0.3);
      ctx.quadraticCurveTo(cx+CELL*0.2, cy-CELL*0.55, cx+CELL*0.05, cy-CELL*0.6);
      ctx.quadraticCurveTo(cx-CELL*0.05, cy-CELL*0.4, cx, cy-CELL*0.3);
      ctx.fill();
    } else if(id==="titan"){
      ctx.fillStyle="rgba(216,201,168,0.9)";
      ctx.fillRect(cx-CELL*0.24, cy-CELL*0.48, CELL*0.16, CELL*0.14);
      ctx.fillRect(cx+CELL*0.08, cy-CELL*0.48, CELL*0.16, CELL*0.14);
    } else if(id==="mirage"){
      const r = CELL*0.3 + Math.sin(now/180)*3;
      ctx.strokeStyle="rgba(193,95,174,0.6)"; ctx.lineWidth=1.3;
      for(let k=0;k<3;k++){
        ctx.beginPath(); ctx.arc(cx,cy-CELL*0.1, r+k*4, now/300+k, now/300+k+3.5); ctx.stroke();
      }
    }
  }

  function drawSnake(now){
    for(let i=snake.length-1;i>=0;i--){
      const s = snake[i];
      const isHead = i===0;
      const id = snakeDef.id;
      let cx = s[0]*CELL+CELL/2, cy = s[1]*CELL+CELL/2;
      let scale = id==="tiny" ? 0.72 : 1;
      let alpha = 1;
      if(id==="ghost") alpha = isHead ? 0.92 : Math.max(0.22, 0.85 - i*0.05);

      ctx.save();
      ctx.globalAlpha = alpha;
      if(id==="ghost"){ ctx.shadowColor = "#33e6c4"; ctx.shadowBlur = 9; }
      if(id==="nova"){ ctx.shadowColor = "#9be564"; ctx.shadowBlur = 7; }
      if(id==="chronos"){ ctx.shadowColor = "#7c5cff"; ctx.shadowBlur = 6; }

      let fill = isHead ? snakeDef.head : snakeDef.body;
      if(id==="lucky"){ const hue = (now/18 + i*20) % 360; fill = "hsl("+hue+",75%,"+(isHead?62:50)+"%)"; }
      ctx.fillStyle = fill;
      const w=(CELL-3)*scale, h=(CELL-3)*scale;
      roundRect(cx-w/2, cy-h/2, w, h, CELL*0.32*scale);
      ctx.fill();

      if(id==="viper" && !isHead){
        ctx.fillStyle="rgba(255,255,255,0.22)";
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(Math.PI/4);
        ctx.fillRect(-CELL*0.11,-CELL*0.11, CELL*0.22, CELL*0.22);
        ctx.restore();
      }
      if(id==="tank"){
        ctx.strokeStyle="rgba(255,255,255,0.28)"; ctx.lineWidth=1.4;
        roundRect(cx-w/2+2, cy-h/2+2, w-4, h-4, CELL*0.2); ctx.stroke();
      }
      if(id==="magnetic" && !isHead){
        ctx.strokeStyle="rgba(79,211,255,0.5)"; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(cx-w/2+3,cy); ctx.lineTo(cx+w/2-3,cy); ctx.stroke();
      }
      if(id==="tempete" && !isHead){
        ctx.strokeStyle="rgba(255,255,255,0.5)"; ctx.lineWidth=1.2;
        ctx.beginPath();
        ctx.moveTo(cx-w*0.25, cy-h*0.25); ctx.lineTo(cx+w*0.1, cy); ctx.lineTo(cx-w*0.1, cy); ctx.lineTo(cx+w*0.25, cy+h*0.25);
        ctx.stroke();
      }
      if(id==="leviathan" && !isHead){
        ctx.strokeStyle="rgba(205,239,255,0.45)"; ctx.lineWidth=1.4;
        ctx.beginPath(); ctx.arc(cx, cy-h*0.1, w*0.3, Math.PI*0.15, Math.PI*0.85); ctx.stroke();
      }
      if(id==="ouroboros" && !isHead){
        ctx.fillStyle="rgba(0,0,0,0.18)";
        ctx.beginPath(); ctx.arc(cx,cy,w*0.14,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();

      if(isHead){ drawHeadAccessory(cx,cy,now); drawEyes(cx,cy, id==="tiny"); }
    }
  }

  function renderChronosFx(now){
    const W = COLS*CELL, H = ROWS*CELL;
    const elapsed = now - skillFx.start;
    const TOTAL = CHRONOS_FREEZE_MS + CHRONOS_RELEASE_MS;
    if(elapsed > TOTAL){ skillFx = null; return; }
    const cx0 = W/2, cy0 = H/2;

    if(elapsed <= CHRONOS_FREEZE_MS){
      const frac = elapsed/CHRONOS_FREEZE_MS;

      ctx.save(); ctx.fillStyle = "rgba(16,14,36,0.48)"; ctx.fillRect(0,0,W,H); ctx.restore();

      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,0.28)"; ctx.lineWidth = 1;
      for(let k=0;k<12;k++){
        const a = k*Math.PI/6;
        ctx.beginPath(); ctx.moveTo(cx0,cy0);
        ctx.lineTo(cx0+Math.cos(a)*Math.max(W,H), cy0+Math.sin(a)*Math.max(W,H));
        ctx.stroke();
      }
      ctx.restore();

      const rad = Math.min(W,H)*0.32;
      ctx.save(); ctx.translate(cx0,cy0);
      ctx.strokeStyle = "rgba(124,92,255,0.55)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0,0,rad,0,Math.PI*2); ctx.stroke();
      for(let k=0;k<12;k++){
        const a = k*Math.PI/6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*rad*0.88, Math.sin(a)*rad*0.88);
        ctx.lineTo(Math.cos(a)*rad, Math.sin(a)*rad);
        ctx.stroke();
      }
      const handA1 = -now/110;
      ctx.strokeStyle = "#33e6c4"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(handA1)*rad*0.66, Math.sin(handA1)*rad*0.66); ctx.stroke();
      const handA2 = -now/280;
      ctx.strokeStyle = "#e4d9ff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(handA2)*rad*0.42, Math.sin(handA2)*rad*0.42); ctx.stroke();
      ctx.restore();

      ctx.save();
      for(let k=0;k<9;k++){
        const yy = Math.random()*H;
        ctx.fillStyle = "rgba(255,255,255,"+(Math.random()*0.16)+")";
        ctx.fillRect(0,yy,W,1+Math.random()*2);
      }
      ctx.restore();

      if(skillFx.playFrames && skillFx.playFrames.length){
        const fi = Math.min(skillFx.playFrames.length-1, Math.floor(frac*skillFx.playFrames.length));
        const fr = skillFx.playFrames[fi];
        ctx.save();
        fr.snake.forEach((s,i)=>{
          ctx.fillStyle = i===0 ? "#e4d9ff" : "#7c5cff";
          ctx.shadowColor = "#7c5cff"; ctx.shadowBlur = 11;
          roundRect(s[0]*CELL+2, s[1]*CELL+2, CELL-4, CELL-4, 6);
          ctx.fill();
        });
        ctx.restore();
      }
    } else {
      const rp = (elapsed-CHRONOS_FREEZE_MS)/CHRONOS_RELEASE_MS;
      const hx = snake[0][0]*CELL+CELL/2, hy = snake[0][1]*CELL+CELL/2;
      ctx.save(); ctx.globalAlpha = 1-rp;
      ctx.strokeStyle = "#7c5cff"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(hx,hy, 10+rp*70, 0, Math.PI*2); ctx.stroke();
      ctx.strokeStyle = "#33e6c4";
      ctx.beginPath(); ctx.arc(hx,hy, 4+rp*45, 0, Math.PI*2); ctx.stroke();
      ctx.restore();
      if(skillFx.ghost){
        ctx.save(); ctx.globalAlpha = 0.3*(1-rp);
        ctx.fillStyle = "#7c5cff";
        skillFx.ghost.forEach(s=>{ roundRect(s[0]*CELL+2,s[1]*CELL+2,CELL-4,CELL-4,6); ctx.fill(); });
        ctx.restore();
      }
    }
  }

  function renderSkillFx(now){
    if(!skillFx) return;
    if(skillFx.id==="chronos"){ renderChronosFx(now); return; }
    const DUR = {nova:550, ouroboros:400, tempete:400, leviathan:750, titan:500, mirage:450}[skillFx.id] || 500;
    const elapsed = now - skillFx.start;
    if(elapsed > DUR){ skillFx = null; return; }
    const p = Math.min(1, elapsed/DUR);
    const W = COLS*CELL, H = ROWS*CELL;

    if(skillFx.id==="titan"){
      const hx = snake[0][0]*CELL+CELL/2, hy = snake[0][1]*CELL+CELL/2;
      ctx.save(); ctx.globalAlpha = 1-p;
      ctx.strokeStyle = "#d8c9a8"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(hx,hy, p*5*CELL, 0, Math.PI*2); ctx.stroke();
      ctx.restore();
    } else if(skillFx.id==="mirage" && skillFx.decoyPos){
      const cx = skillFx.decoyPos[0]*CELL+CELL/2, cy = skillFx.decoyPos[1]*CELL+CELL/2;
      ctx.save(); ctx.globalAlpha = 1-p;
      ctx.strokeStyle = "#c15fae"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx,cy, 6+p*24, 0, Math.PI*2); ctx.stroke();
      ctx.restore();
    } else if(skillFx.id==="nova"){
      ctx.save(); ctx.globalAlpha = (1-p)*0.7;
      const grad = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2, Math.max(W,H)*p);
      grad.addColorStop(0,"rgba(180,255,150,0.9)"); grad.addColorStop(1,"rgba(180,255,150,0)");
      ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
      ctx.restore();
      const hx = snake[0][0]*CELL+CELL/2, hy = snake[0][1]*CELL+CELL/2;
      ctx.save(); ctx.globalAlpha = 1-p; ctx.strokeStyle = "#9be564"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(hx,hy, p*Math.max(W,H)*0.55, 0, Math.PI*2); ctx.stroke();
      ctx.restore();
    } else if(skillFx.id==="tempete" && skillFx.from && skillFx.to){
      ctx.save(); ctx.globalAlpha = 1-p;
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.5;
      const x1=skillFx.from[0]*CELL+CELL/2, y1=skillFx.from[1]*CELL+CELL/2;
      const x2=skillFx.to[0]*CELL+CELL/2, y2=skillFx.to[1]*CELL+CELL/2;
      ctx.beginPath(); ctx.moveTo(x1,y1);
      const midx=(x1+x2)/2+(Math.random()-0.5)*10, midy=(y1+y2)/2+(Math.random()-0.5)*10;
      ctx.lineTo(midx,midy); ctx.lineTo(x2,y2); ctx.stroke();
      ctx.restore();
    } else if(skillFx.id==="leviathan"){
      ctx.save(); ctx.globalAlpha = 0.5*(1-Math.abs(p-0.5)*2);
      const bandX = p*W*1.4-W*0.2;
      const grad = ctx.createLinearGradient(bandX-40,0,bandX+40,0);
      grad.addColorStop(0,"rgba(51,230,196,0)"); grad.addColorStop(0.5,"rgba(51,230,196,0.55)"); grad.addColorStop(1,"rgba(51,230,196,0)");
      ctx.fillStyle = grad; ctx.fillRect(bandX-40,0,80,H);
      ctx.restore();
    } else if(skillFx.id==="ouroboros"){
      const tailSeg = snake[snake.length-1] || snake[0];
      const hx = tailSeg[0]*CELL+CELL/2, hy = tailSeg[1]*CELL+CELL/2;
      ctx.save(); ctx.globalAlpha = (1-p)*0.6; ctx.strokeStyle = "#ff8f7a"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(hx,hy,10+p*30,0,Math.PI*2); ctx.stroke();
      ctx.restore();
    }
  }

  function draw(){
    const now = performance.now();
    const W = COLS*CELL, H = ROWS*CELL;
    ctx.clearRect(0,0,W,H);

    ctx.fillStyle = "rgba(255,255,255,0.035)";
    for(let x=1;x<COLS;x++){ for(let y=1;y<ROWS;y++){ ctx.beginPath(); ctx.arc(x*CELL, y*CELL, 1.1, 0, Math.PI*2); ctx.fill(); } }

    obstacles.forEach(o=>{
      ctx.fillStyle = "rgba(137,145,168,0.28)";
      roundRect(o[0]*CELL+2,o[1]*CELL+2,CELL-4,CELL-4,6); ctx.fill();
      ctx.strokeStyle = "rgba(137,145,168,0.5)"; ctx.lineWidth = 1; ctx.stroke();
    });

    portals.forEach(p=>{
      [p[0],p[1]].forEach(pt=>{
        const cx = pt[0]*CELL+CELL/2, cy = pt[1]*CELL+CELL/2;
        const grad = ctx.createRadialGradient(cx,cy,1,cx,cy,CELL/2);
        grad.addColorStop(0, "#fff"); grad.addColorStop(0.4, p[2]); grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, CELL/2-1, 0, Math.PI*2); ctx.fill();
      });
    });

    if(hasWalls){ ctx.strokeStyle = "rgba(255,159,67,0.55)"; ctx.lineWidth = 3; ctx.strokeRect(1.5,1.5,W-3,H-3); }

    enemies.forEach(e=>{
      const cx = e.x*CELL+CELL/2, cy = e.y*CELL+CELL/2;
      if(e.type==="boss"){
        const pulse = 1 + Math.sin(now/220)*0.08;
        const flashing = e.telegraphing;
        ctx.save();
        if(flashing){ ctx.shadowColor = "#ff5470"; ctx.shadowBlur = 14 + Math.sin(now/60)*8; }
        else { ctx.shadowColor = "#ff5470"; ctx.shadowBlur = 6; }
        ctx.fillStyle = flashing ? (Math.sin(now/60)>0?"#fff":"#ff5470") : "#c23a52";
        const rr = CELL*0.62*pulse;
        ctx.beginPath();
        ctx.moveTo(cx, cy-rr); ctx.lineTo(cx+rr, cy); ctx.lineTo(cx, cy+rr); ctx.lineTo(cx-rr, cy);
        ctx.closePath(); ctx.fill();
        ctx.restore();
        ctx.fillStyle="rgba(10,12,18,0.9)";
        ctx.beginPath(); ctx.arc(cx-rr*0.25, cy, 2.6, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx+rr*0.25, cy, 2.6, 0, Math.PI*2); ctx.fill();
      } else {
        ctx.save();
        if(e.stunnedUntil && now<e.stunnedUntil) ctx.globalAlpha = 0.4 + Math.sin(now/100)*0.15;
        ctx.fillStyle = e.type==="hunter" ? "#ff5470" : "#ff9f43";
        ctx.beginPath();
        ctx.moveTo(cx, cy-CELL/2+3); ctx.lineTo(cx+CELL/2-3, cy); ctx.lineTo(cx, cy+CELL/2-3); ctx.lineTo(cx-CELL/2+3, cy);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(10,12,18,0.85)";
        ctx.beginPath(); ctx.arc(cx, cy, 2.2, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    });

    if(decoy && now<decoy.until){
      const cx = decoy.x*CELL+CELL/2, cy = decoy.y*CELL+CELL/2;
      ctx.save(); ctx.globalAlpha = 0.5+Math.sin(now/150)*0.2;
      ctx.fillStyle = "#c15fae";
      roundRect(cx-CELL*0.4, cy-CELL*0.4, CELL*0.8, CELL*0.8, CELL*0.28);
      ctx.fill();
      ctx.restore();
    }

    if(food){
      const cx = food[0]*CELL+CELL/2, cy = food[1]*CELL+CELL/2;
      const grad = ctx.createRadialGradient(cx,cy,1,cx,cy,CELL/2);
      grad.addColorStop(0,"#ffd699"); grad.addColorStop(1,"#ff9f43");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, CELL/2-3, 0, Math.PI*2); ctx.fill();
    }

    drawSnake(now);
    renderSkillFx(now);

    particles.forEach(p=>{
      ctx.globalAlpha = Math.max(0,p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    if(isFog){
      const hx = snake[0][0]*CELL+CELL/2, hy = snake[0][1]*CELL+CELL/2;
      const rad = CELL*5.5;
      ctx.save();
      const grad = ctx.createRadialGradient(hx,hy,rad*0.35,hx,hy,rad);
      grad.addColorStop(0,"rgba(6,5,14,0)");
      grad.addColorStop(1,"rgba(6,5,14,0.94)");
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,W,H);
      ctx.restore();
    }

    if(mode!=="career" && (state==="playing"||state==="paused")){ $("#scoreBadge").innerHTML = score||0; }
  }

  /* ================= Power-ups in-run ================= */

  function renderPowerbar(){
    const bar = $("#powerbar");
    bar.innerHTML = "";
    if(state!=="playing"){ return; }
    if(snakeDef.skill){
      const btn = document.createElement("button");
      btn.className = "pbtn skillbtn" + (skillCharges<=0?" used":"");
      btn.innerHTML = snakeDef.skill.icon + (skillCharges>0? '<div class="charge-badge">'+skillCharges+'</div>' : "");
      if(snakeDef.skill.recharge && skillCharges<skillMaxCharges && skillNextReadyAt>0){
        const remain = Math.max(0, Math.ceil((skillNextReadyAt-performance.now())/1000));
        const cd = document.createElement("div");
        cd.className = "cooldown-badge";
        cd.textContent = remain+"s";
        btn.appendChild(cd);
      }
      btn.onclick = activateSkill;
      bar.appendChild(btn);
    }
    runLoadout.forEach((id,idx)=>{
      const it = getItem(id);
      const btn = document.createElement("button");
      btn.className = "pbtn" + (loadoutUsed[idx]?" used":"");
      btn.innerHTML = it.icon;
      const isActiveTimed = (id==="magnet" && performance.now()<magnetUntil) || (id==="slow" && performance.now()<slowUntil);
      if(isActiveTimed){ const ring = document.createElement("div"); ring.className = "active-ring"; btn.appendChild(ring); }
      btn.onclick = ()=>{ if(!loadoutUsed[idx]) activatePower(id, idx); };
      bar.appendChild(btn);
    });
  }

  function activatePower(id, idx){
    if(id==="magnet"){ magnetUntil = performance.now()+8000; loadoutUsed[idx]=true; }
    else if(id==="slow"){ slowUntil = performance.now()+8000; loadoutUsed[idx]=true; }
    else if(id==="shield"){ shieldCharge = true; loadoutUsed[idx]=true; }
    else if(id==="coinrush"){ coinRushOn = true; loadoutUsed[idx]=true; }
    else if(id==="scoresurge"){ scoreSurgeOn = true; loadoutUsed[idx]=true; }
    else if(id==="detonator"){
      const hx=snake[0][0], hy=snake[0][1];
      enemies = enemies.filter(e=> Math.abs(e.x-hx)+Math.abs(e.y-hy) > 4);
      obstacles = obstacles.filter(o=> Math.abs(o[0]-hx)+Math.abs(o[1]-hy) > 1);
      spawnParticles(hx,hy,"#7c5cff",24);
      loadoutUsed[idx]=true;
    }
    beep(500,0.08,"square");
    renderPowerbar();
  }
  setInterval(()=>{ if(state==="playing") renderPowerbar(); }, 500);

  /* ================= Input ================= */

  function setDir(x,y){
    if(state!=="playing") return;
    if(dir.x===-x && dir.y===-y) return;
    nextDir = {x,y};
  }
  function activateSlot(idx){
    if(runLoadout && runLoadout[idx] && !loadoutUsed[idx]) activatePower(runLoadout[idx], idx);
  }
  function keyMatches(e, action){
    const bound = save.keybinds[action];
    return bound && e.key.toLowerCase()===bound.toLowerCase();
  }
  document.addEventListener("keydown",(e)=>{
    if(bindingTarget) return; // handled by settings capture listener

    if(e.key.length===1){
      secretBuffer = (secretBuffer + e.key.toLowerCase()).slice(-20);
      if(secretBuffer.includes(SECRET_CODE)){ secretBuffer = ""; secretUnlockAll(); }
    }

    const kl = e.key.toLowerCase();
    if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(kl)) e.preventDefault();
    if(kl==="w") setDir(0,-1);
    else if(kl==="s") setDir(0,1);
    else if(kl==="a") setDir(-1,0);
    else if(kl==="d") setDir(1,0);
    else if(keyMatches(e,"up")) setDir(0,-1);
    else if(keyMatches(e,"down")) setDir(0,1);
    else if(keyMatches(e,"left")) setDir(-1,0);
    else if(keyMatches(e,"right")) setDir(1,0);
    else if(keyMatches(e,"p1")) activateSlot(0);
    else if(keyMatches(e,"p2")) activateSlot(1);
    else if(keyMatches(e,"p3")) activateSlot(2);
    else if(keyMatches(e,"skill")) activateSkill();
    else if(kl==="escape"||kl==="p"){ togglePause(); }
  });

  $("#dpad .up").onclick = ()=>setDir(0,-1);
  $("#dpad .down").onclick = ()=>setDir(0,1);
  $("#dpad .left").onclick = ()=>setDir(-1,0);
  $("#dpad .right").onclick = ()=>setDir(1,0);

  let touchStart = null;
  stage.addEventListener("touchstart",(e)=>{
    if(state!=="playing") return;
    const t = e.changedTouches[0]; touchStart = {x:t.clientX,y:t.clientY};
  },{passive:true});
  stage.addEventListener("touchend",(e)=>{
    if(!touchStart || state!=="playing") return;
    const t = e.changedTouches[0];
    const dx = t.clientX-touchStart.x, dy = t.clientY-touchStart.y;
    if(Math.abs(dx)<20 && Math.abs(dy)<20) return;
    if(Math.abs(dx)>Math.abs(dy)) setDir(dx>0?1:-1,0); else setDir(0,dy>0?1:-1);
    touchStart = null;
  },{passive:true});

  function togglePause(){
    if(state==="playing"){ state="paused"; pauseBeganAt = performance.now(); showOverlay("pause"); }
    else if(state==="paused"){ pauseOffset += performance.now()-pauseBeganAt; state="playing"; showOverlay(null); lastTime=performance.now(); }
  }
  $("#pauseBtn").onclick = togglePause;
  $("#resumeBtn").onclick = togglePause;
  $("#quitBtn").onclick = ()=>{
    clearInterval(chaosTimer);
    if(mode==="free"){
      if(score > save.best){ save.best = score; }
      if(save.bestLevel < curLevel){ save.bestLevel = curLevel; }
      persist(); renderTopbar();
    } else if(mode==="chrono"){
      if(score > save.bestChrono){ save.bestChrono = score; }
      persist(); renderTopbar();
    }
    state = "home";
    $("#hud").classList.add("hidden");
    $("#controlsBar").classList.add("hidden");
    showOverlay("home"); renderHome();
  };

  document.addEventListener("visibilitychange",()=>{ if(document.hidden && state==="playing") togglePause(); });

  $("#playBtn").onclick = ()=>startRun(homeTab==="career"?"free":homeTab);
  $("#retryBtn").onclick = ()=>startRun(mode==="career"?"free":mode);
  $("#homeBtn").onclick = ()=>{ state="home"; showOverlay("home"); renderHome(); renderTopbar(); };

  /* ================= Sound toolkit ================= */
  let actx;
  function ensureCtx(){ actx = actx || new (window.AudioContext||window.webkitAudioContext)(); return actx; }
  function beep(freq,dur,type){ playTone(freq,dur,type,0.05); }
  function sfxVol(){ return save.settings ? save.settings.sfxVol : 1; }
  function playTone(freq,dur,type,vol){
    if(!soundOn || sfxVol()<=0) return;
    try{
      const a = ensureCtx();
      const o = a.createOscillator(), g = a.createGain();
      o.type = type||"sine"; o.frequency.value = freq;
      g.gain.value = (vol!=null?vol:0.05) * sfxVol();
      o.connect(g); g.connect(a.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime+dur);
      o.stop(a.currentTime+dur);
    }catch(e){}
  }
  function playSweep(f1,f2,dur,type,vol){
    if(!soundOn || sfxVol()<=0) return;
    try{
      const a = ensureCtx();
      const o = a.createOscillator(), g = a.createGain();
      o.type = type||"sine";
      o.frequency.setValueAtTime(Math.max(20,f1), a.currentTime);
      o.frequency.exponentialRampToValueAtTime(Math.max(20,f2), a.currentTime+dur);
      g.gain.value = (vol!=null?vol:0.08) * sfxVol();
      o.connect(g); g.connect(a.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime+dur);
      o.stop(a.currentTime+dur);
    }catch(e){}
  }
  function playNoiseBurst(dur,vol){
    if(!soundOn || sfxVol()<=0) return;
    try{
      const a = ensureCtx();
      const size = Math.max(1,Math.floor(a.sampleRate*dur));
      const buffer = a.createBuffer(1, size, a.sampleRate);
      const data = buffer.getChannelData(0);
      for(let i=0;i<size;i++){ data[i] = (Math.random()*2-1) * (1-i/size); }
      const src = a.createBufferSource(); src.buffer = buffer;
      const g = a.createGain(); g.gain.value = (vol!=null?vol:0.15) * sfxVol();
      src.connect(g); g.connect(a.destination);
      src.start();
    }catch(e){}
  }
  function playChord(freqs,dur,vol,type){
    freqs.forEach(f=>playTone(f,dur,type||"sine",(vol||0.06)/Math.sqrt(freqs.length)));
  }

  /* ---- Procedural ambient background music ---- */
  let musicGain = null, musicTimer = null, musicChordIdx = 0;
  let customMusicActive = false;
  const MUSIC_CHORDS = [[220,277,330],[196,246,294],[174,220,261],[196,246,294]];
  function startMusic(){
    if(musicTimer || customMusicActive) return;
    try{
      const a = ensureCtx();
      musicGain = a.createGain();
      musicGain.gain.value = save.settings.musicVol;
      musicGain.connect(a.destination);
      const playChordOnce = ()=>{
        const chord = MUSIC_CHORDS[musicChordIdx % MUSIC_CHORDS.length];
        musicChordIdx++;
        chord.forEach((f,i)=>{
          const o = a.createOscillator(), g = a.createGain();
          o.type = "sine"; o.frequency.value = f/2;
          g.gain.value = 0;
          o.connect(g); g.connect(musicGain);
          const t0 = a.currentTime;
          g.gain.linearRampToValueAtTime(0.16/chord.length, t0+1.2);
          g.gain.linearRampToValueAtTime(0, t0+3.8);
          o.start(t0); o.stop(t0+4);
        });
      };
      playChordOnce();
      musicTimer = setInterval(playChordOnce, 4000);
    }catch(e){}
  }
  function stopProceduralMusic(){
    if(musicTimer){ clearInterval(musicTimer); musicTimer = null; }
    if(musicGain){ try{ musicGain.disconnect(); }catch(e){} musicGain = null; }
  }
  function setMusicVolume(v){
    save.settings.musicVol = v;
    if(musicGain) musicGain.gain.value = v;
    const audioEl = $("#customAudio");
    if(customMusicActive) audioEl.volume = v;
    persist();
  }
  function setSfxVolume(v){ save.settings.sfxVol = v; persist(); }
  function ensureMusicStarted(){
    if(!musicTimer && !customMusicActive && save.settings.musicVol>0) startMusic();
  }
  ["click","keydown","touchstart"].forEach(evt=>{
    document.addEventListener(evt, ensureMusicStarted, {once:true});
  });

  function useCustomMusicFile(file){
    stopProceduralMusic();
    const audioEl = $("#customAudio");
    const url = URL.createObjectURL(file);
    audioEl.src = url;
    audioEl.loop = true;
    audioEl.volume = save.settings.musicVol;
    audioEl.play().catch(()=>{});
    customMusicActive = true;
    $("#musicSourceLabel").textContent = "Fichier : "+file.name;
    $("#clearMusicFile").classList.remove("hidden");
  }
  function clearCustomMusicFile(){
    const audioEl = $("#customAudio");
    audioEl.pause();
    if(audioEl.src){ URL.revokeObjectURL(audioEl.src); audioEl.removeAttribute("src"); audioEl.load(); }
    customMusicActive = false;
    $("#musicSourceLabel").textContent = "Musique procédurale";
    $("#clearMusicFile").classList.add("hidden");
    $("#musicFileInput").value = "";
    if(save.settings.musicVol>0) startMusic();
  }
  $("#chooseMusicFile").onclick = ()=>{ $("#musicFileInput").click(); };
  $("#musicFileInput").addEventListener("change", (e)=>{
    const f = e.target.files && e.target.files[0];
    if(f) useCustomMusicFile(f);
  });
  $("#clearMusicFile").onclick = clearCustomMusicFile;

  /* ================= Init ================= */

  snakeDef = getSnake(save.selectedSnake);
  mapDef = getMap(save.selectedMap);
  obstacles = []; portals = []; hasWalls = false; enemies = [];
  const d0 = computeFreeDims(); COLS=d0.cols; ROWS=d0.rows;
  snake = [[Math.floor(COLS/2)-1,Math.floor(ROWS/2)],[Math.floor(COLS/2)-2,Math.floor(ROWS/2)],[Math.floor(COLS/2)-3,Math.floor(ROWS/2)]];
  dir = {x:1,y:0};
  food = [Math.min(COLS-2,Math.floor(COLS/2)+4), Math.max(1,Math.floor(ROWS/2)-3)];

  renderTopbar(); renderHome();
  resizeCanvas();
})();
