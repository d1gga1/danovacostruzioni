/* Danova Costruzioni - interattività (03/11/2026)
   1) Preventivo guidato dentro i moduli "form.dt-lead": tipo di lavoro, immobile, superficie, comune.
      Preimpostato in base alla pagina (servizio / città). Nell'email i valori arrivano sempre in italiano
      (campi con data-lead, letti da contatto.js). Nessun prezzo mostrato.
   2) "Trova la tua zona": in home subito dopo l'apertura, nelle altre pagine dentro #dove-lavoriamo. Ricerca del comune,
      posizione del visitatore, mappa con 80+ comuni (coordinate reali), zoom e arco dalla sede, scheda con distanza,
      pagina della zona e sopralluogo gratuito con il comune gia' compilato nel modulo. */
(function(){
  'use strict';
  var hl=(document.documentElement.lang||'it').slice(0,2).toLowerCase();
  function track(n,p){ try{ if(window.gtag) window.gtag('event',n,p||{}); }catch(_){} }
  function el(tag,attrs,html){ var e=document.createElement(tag); if(attrs) for(var k in attrs) e.setAttribute(k,attrs[k]); if(html!=null) e.innerHTML=html; return e; }

  /* ---------------- città servite (coordinate reali) ---------------- */
  var HQ={n:'Mansuè',lat:45.8416,lon:12.5250};
  var CITY={
    'treviso':['Treviso',45.6669,12.2430,1],'oderzo':['Oderzo',45.7806,12.4930],'conegliano':['Conegliano',45.8864,12.2970],
    'motta-di-livenza':['Motta di Livenza',45.7800,12.6080],'castelfranco-veneto':['Castelfranco Veneto',45.6717,11.9270],
    'montebelluna':['Montebelluna',45.7760,12.0450],'venezia':['Venezia',45.4408,12.3155,1],'mestre':['Mestre',45.4906,12.2381],
    'san-dona-di-piave':['San Donà di Piave',45.6297,12.5650],'portogruaro':['Portogruaro',45.7756,12.8378],
    'padova':['Padova',45.4064,11.8768,1],'vicenza':['Vicenza',45.5455,11.5354,1],'verona':['Verona',45.4384,10.9916,1],
    'pordenone':['Pordenone',45.9564,12.6615,1],'udine':['Udine',46.0711,13.2346,1],'sacile':['Sacile',45.9541,12.5016],
    'trieste':['Trieste',45.6495,13.7768,1],'gorizia':['Gorizia',45.9409,13.6217,1],'monfalcone':['Monfalcone',45.8090,13.5330],
    'belluno':['Belluno',46.1425,12.2167,1],'feltre':['Feltre',46.0180,11.9100],'rovigo':['Rovigo',45.0700,11.7900,1],
    'bassano-del-grappa':['Bassano del Grappa',45.7660,11.7340],'schio':['Schio',45.7120,11.3560],'cittadella':['Cittadella',45.6480,11.7840],
    'chioggia':['Chioggia',45.2190,12.2790],'jesolo':['Jesolo',45.5340,12.6440],'vittorio-veneto':['Vittorio Veneto',45.9870,12.2970],
    'codroipo':['Codroipo',45.9620,12.9770],'cividale-del-friuli':['Cividale del Friuli',46.0930,13.4320]
  };
  var EXTRA={'bibione':'Bibione','caorle':'Caorle','cavallino-treporti':'Cavallino-Treporti','sottomarina':'Chioggia',
    'lignano':'Lignano Sabbiadoro','grado':'Grado','cortina':'Cortina d’Ampezzo'};
  function km(a,b){ var R=6371,r=Math.PI/180,dl=(b.lat-a.lat)*r,dn=(b.lon-a.lon)*r;
    var x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)*Math.sin(dn/2);
    return Math.round(2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))); }

  /* ---------------- testi ---------------- */
  var TX={
    it:{s1:'Il progetto',s2:'I tuoi contatti',q1:'Che lavoro devi fare?',h1:'Puoi sceglierne più di uno.',q2:'Che immobile è?',q3:'Superficie indicativa',dk:'Non lo so',q4:'Comune dell’immobile',
        hq:'Sede',km:'%d km in linea d’aria dalla sede di Mansuè',cap:'Passa su un punto o su una città per vedere la distanza dalla sede. Clic per aprire la pagina.'},
    en:{s1:'Your project',s2:'Your details',q1:'What do you need done?',h1:'You can pick more than one.',q2:'What type of property?',q3:'Approximate size',dk:'Don’t know',q4:'Town where the property is',
        hq:'Head office',km:'%d km as the crow flies from our base in Mansuè',cap:'Hover a dot or a town to see the distance from our base. Click to open its page.'},
    de:{s1:'Ihr Projekt',s2:'Ihre Kontaktdaten',q1:'Was soll gemacht werden?',h1:'Mehrfachauswahl möglich.',q2:'Um welche Immobilie geht es?',q3:'Ungefähre Fläche',dk:'Weiß nicht',q4:'Ort der Immobilie',
        hq:'Sitz',km:'%d km Luftlinie von unserem Sitz in Mansuè',cap:'Fahren Sie über einen Punkt oder Ort, um die Entfernung zu sehen. Klick öffnet die Seite.'},
    ro:{s1:'Proiectul',s2:'Datele dvs.',q1:'Ce lucrări aveți de făcut?',h1:'Puteți alege mai multe.',q2:'Ce tip de imobil?',q3:'Suprafață aproximativă',dk:'Nu știu',q4:'Localitatea imobilului',
        hq:'Sediu',km:'%d km în linie dreaptă de sediul din Mansuè',cap:'Treceți peste un punct sau un oraș pentru a vedea distanța. Clic pentru a deschide pagina.'},
    sq:{s1:'Projekti',s2:'Të dhënat tuaja',q1:'Çfarë pune keni për të bërë?',h1:'Mund të zgjidhni më shumë se një.',q2:'Çfarë prone është?',q3:'Sipërfaqja e përafërt',dk:'Nuk e di',q4:'Komuna e pronës',
        hq:'Selia',km:'%d km në vijë ajrore nga selia në Mansuè',cap:'Kaloni mbi një pikë ose qytet për të parë distancën. Klikoni për të hapur faqen.'},
    hi:{s1:'आपका प्रोजेक्ट',s2:'आपकी जानकारी',q1:'आपको कौन-सा काम करवाना है?',h1:'आप एक से ज़्यादा चुन सकते हैं।',q2:'प्रॉपर्टी किस तरह की है?',q3:'अनुमानित क्षेत्रफल',dk:'पता नहीं',q4:'प्रॉपर्टी किस शहर में है',
        hq:'मुख्यालय',km:'Mansuè मुख्यालय से सीधी दूरी लगभग %d km',cap:'दूरी देखने के लिए किसी बिंदु या शहर पर जाएँ। पेज खोलने के लिए क्लिक करें।'}
  };
  var T=TX[hl]||TX.en;
  /* [valore italiano per l'email, en, de, ro, sq, hi] */
  var LAV=[
    ['Bagno','Bathroom','Bad','Baie','Banjo','बाथरूम'],
    ['Casa o appartamento intero','Whole house or flat','Ganzes Haus / Wohnung','Casă / apartament întreg','Shtëpi / apartament i plotë','पूरा घर / अपार्टमेंट'],
    ['Facciata e cappotto','Facade and insulation','Fassade und Dämmung','Fațadă și izolație','Fasadë dhe termoizolim','फ़साड और इंसुलेशन'],
    ['Tetto e sottotetto','Roof and loft','Dach und Dachboden','Acoperiș și pod','Çati dhe papafingo','छत और अटारी'],
    ['Cartongesso e pareti','Drywall and partitions','Trockenbau und Wände','Rigips și pereți','Gipskarton dhe mure','ड्राईवॉल और दीवारें'],
    ['Pavimenti, porte e serramenti','Floors, doors and windows','Böden, Türen und Fenster','Pardoseli, uși și ferestre','Dysheme, dyer dhe dritare','फ़र्श, दरवाज़े और खिड़कियाँ'],
    ['Hotel, negozio o ufficio','Hotel, shop or office','Hotel, Laden oder Büro','Hotel, magazin sau birou','Hotel, dyqan ose zyrë','होटल, दुकान या ऑफ़िस'],
    ['Arredo e mobili su misura','Furniture and custom joinery','Möbel und Maßanfertigung','Mobilier la comandă','Mobilje me porosi','फ़र्नीचर और कस्टम फ़र्नीचर'],
    ['Altro','Other','Anderes','Altceva','Tjetër','अन्य']
  ];
  var IMM=[
    ['Appartamento','Apartment','Wohnung','Apartament','Apartament','अपार्टमेंट'],
    ['Casa o villa','House or villa','Haus oder Villa','Casă sau vilă','Shtëpi ose vilë','घर या विला'],
    ['Hotel o B&B','Hotel or B&B','Hotel oder B&B','Hotel sau pensiune','Hotel ose B&B','होटल या B&B'],
    ['Negozio, ufficio o ristorante','Shop, office or restaurant','Laden, Büro oder Restaurant','Magazin, birou sau restaurant','Dyqan, zyrë ose restorant','दुकान, ऑफ़िस या रेस्टोरेंट'],
    ['Condominio o capannone','Apartment block or warehouse','Mehrfamilienhaus oder Halle','Bloc sau hală','Pallat ose kapanon','अपार्टमेंट बिल्डिंग या गोदाम']
  ];
  var LI={it:0,en:1,de:2,ro:3,sq:4,hi:5}[hl]; if(LI==null) LI=1;

  /* percorso italiano della pagina (vale per tutte le lingue grazie a hreflang="it") */
  var itPath=location.pathname;
  try{ var alt=document.querySelector('link[rel="alternate"][hreflang="it"]'); if(alt) itPath=new URL(alt.href).pathname; }catch(_){}

  /* ---------------- stile ---------------- */
  var st=el('style',{id:'dt-int-css'});
  st.textContent=
   '.dt-prj{border:0;padding:0;margin:0 0 4px;min-width:0;display:grid;gap:16px}'+
   '.dt-step{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted,#a6a99a);margin-top:2px}'+
   '.dt-step b{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--blue,#83b06d);color:#0b0d08;font-size:12px;letter-spacing:0}'+
   '.dt-step::after{content:"";flex:1;height:1px;background:var(--line,rgba(255,255,255,.12))}'+
   '.dt-ql{font-size:13.5px;font-weight:600;color:var(--text,#ecebe4);margin-bottom:10px}.dt-ql small{font-weight:400;color:var(--muted,#a6a99a);margin-left:6px}'+
   '.dt-mq{display:grid;gap:8px}.dt-mq-row{display:flex;align-items:center;gap:14px}'+
   '.dt-mq input[type=range]{flex:1 1 auto;min-width:0;width:100%;accent-color:var(--blue,#83b06d);height:28px;cursor:pointer}'+
   '.dt-mq output{flex:none;white-space:nowrap;min-width:78px;text-align:right;font-variant-numeric:tabular-nums;font-weight:600;color:var(--text,#ecebe4)}'+
   '.dt-mq.unk output{color:var(--muted,#a6a99a);font-weight:400}';
  document.head.appendChild(st);

  /* ================= 1. PREVENTIVO GUIDATO ================= */
  function pills(list, multi, hidden, name){
    var wrap=el('div',{'class':'dt-urg-p',role:'group'});
    list.forEach(function(row,i){
      var b=el('button',{type:'button','aria-pressed':'false','data-i':i}); b.textContent=row[LI];
      b.addEventListener('click',function(){
        var on=b.getAttribute('aria-pressed')==='true';
        if(!multi) wrap.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed','false'); });
        b.setAttribute('aria-pressed', on?'false':'true');
        sync(); track('preventivo_scelta',{campo:name,valore:row[0],attivo:!on});
      });
      wrap.appendChild(b);
    });
    function sync(){
      hidden.value=[].slice.call(wrap.querySelectorAll('button[aria-pressed=true]')).map(function(b){ return list[+b.getAttribute('data-i')][0]; }).join(', ');
    }
    wrap._sync=sync;
    return wrap;
  }
  function presetLavoro(){
    var p=itPath;
    if(/arredo|mobili-su-misura|cabine-armadio/.test(p)) return 7;
    if(/bagno|doccia/.test(p)) return 0;
    if(/facciat|cappotto/.test(p)) return 2;
    if(/tetto|sottotetto|grondaie/.test(p)) return 3;
    if(/cartongesso|pareti-divisorie|soppalchi/.test(p)) return 4;
    if(/pavimenti|porte|serramenti|microcemento|resina|scale-interne/.test(p)) return 5;
    if(/hotel|negozi|condomini/.test(p)) return 6;
    if(/appartamenti-e-case|chiavi-in-mano|casali|costruzione-case|compriamo-case|affitti-brevi/.test(p)) return 1;
    return -1;
  }
  function presetComune(){
    var m=itPath.match(/^\/(?:ristrutturazioni|general-contractor|arredo-hotel)-([a-z-]+)\/$/);
    if(!m) return '';
    if(CITY[m[1]]) return CITY[m[1]][0];
    return EXTRA[m[1]]||'';
  }
  var dl=null;
  function datalist(){
    if(dl) return dl.id;
    dl=el('datalist',{id:'dt-comuni'});
    var names={}; for(var k in CITY) names[CITY[k][0]]=1; for(var x in EXTRA) names[EXTRA[x]]=1; names['Mansuè']=1;
    Object.keys(names).sort().forEach(function(n){ var o=el('option'); o.value=n; dl.appendChild(o); });
    document.body.appendChild(dl); return dl.id;
  }

  document.querySelectorAll('form.dt-lead').forEach(function(f,fi){
    if(f.querySelector('.dt-prj')) return;
    var box=el('fieldset',{'class':'dt-prj'});
    box.appendChild(el('div',{'class':'dt-step'},'<b>1</b>'+T.s1));

    /* lavori */
    var hLav=el('input',{type:'hidden',name:'lavori','data-lead':'Lavori richiesti'});
    var q1=el('div',{'class':'dt-q'}); q1.appendChild(el('div',{'class':'dt-ql'},T.q1+'<small>'+T.h1+'</small>'));
    var pL=pills(LAV,true,hLav,'lavori'); q1.appendChild(pL); q1.appendChild(hLav); box.appendChild(q1);
    /* immobile */
    var hImm=el('input',{type:'hidden',name:'immobile','data-lead':'Tipo di immobile'});
    var q2=el('div',{'class':'dt-q'}); q2.appendChild(el('div',{'class':'dt-ql'},T.q2));
    var pI=pills(IMM,false,hImm,'immobile'); q2.appendChild(pI); q2.appendChild(hImm); box.appendChild(q2);
    /* superficie + comune */
    var row=el('div',{'class':'dt-lead-2'});
    var hMq=el('input',{type:'hidden',name:'mq','data-lead':'Superficie indicativa'});
    var mq=el('div',{'class':'dt-mq dt-q unk'});
    mq.innerHTML='<div class="dt-ql" id="dt-mq-l'+fi+'">'+T.q3+'</div><div class="dt-mq-row"><input type="range" min="10" max="400" step="5" value="80" aria-labelledby="dt-mq-l'+fi+'"><output>'+T.dk+'</output></div>';
    var rg=mq.querySelector('input'), out=mq.querySelector('output');
    function showMq(){ var v=+rg.value; out.textContent=(v>=400?'400+':v)+' m²'; hMq.value=(v>=400?'oltre 400':'circa '+v)+' m²'; mq.classList.remove('unk'); }
    rg.addEventListener('input',showMq);
    rg.addEventListener('change',function(){ track('preventivo_scelta',{campo:'mq',valore:rg.value}); });
    mq.appendChild(hMq); row.appendChild(mq);
    var cid='dtl-comune'+fi;
    var fc=el('div',{'class':'fld'},'<input type="text" id="'+cid+'" name="comune" list="'+datalist()+'" autocomplete="address-level2" placeholder=" " data-lead="Comune dell’immobile"><label for="'+cid+'">'+T.q4+'</label>');
    row.appendChild(fc); box.appendChild(row);
    box.appendChild(el('div',{'class':'dt-step'},'<b>2</b>'+T.s2));

    f.insertBefore(box,f.firstChild);

    /* preimpostazioni dalla pagina */
    var pl=presetLavoro(); if(pl>=0){ pL.children[pl].setAttribute('aria-pressed','true'); pL._sync(); }
    var pc=presetComune(); if(pc) fc.querySelector('input').value=pc;

    f.addEventListener('reset',function(){ setTimeout(function(){
      [pL,pI].forEach(function(w){ w.querySelectorAll('button').forEach(function(b){ b.setAttribute('aria-pressed','false'); }); w._sync(); });
      hMq.value=''; rg.value=80; out.textContent=T.dk; mq.classList.add('unk');
      if(pl>=0){ pL.children[pl].setAttribute('aria-pressed','true'); pL._sync(); }
      if(pc) fc.querySelector('input').value=pc;
    },0); });
  });

  /* ================= 2. TROVA LA TUA ZONA (03/11/2026 v2) =================
     Home: sezione subito dopo l'apertura. Altre pagine con #dove-lavoriamo: dentro quella sezione.
     Ricerca del comune, "usa la mia posizione", mappa con zoom e arco dalla sede, scheda personalizzata
     (distanza, pagina della zona, sopralluogo gratuito con comune gia' compilato nel modulo). */
  var TOWNS=[ /* comuni senza pagina propria: [nome, lat, lon] */
    ['Fontanelle',45.832,12.462],['Gorgo al Monticano',45.788,12.552],['Pasiano di Pordenone',45.851,12.627],['Prata di Pordenone',45.894,12.589],
    ['Brugnera',45.900,12.542],['Cordignano',45.950,12.415],['Pieve di Soligo',45.898,12.172],['Valdobbiadene',45.900,11.998],['Asolo',45.800,11.913],
    ['Mogliano Veneto',45.562,12.237],['Villorba',45.733,12.233],['Spresiano',45.780,12.257],['Ponte di Piave',45.716,12.462],['Roncade',45.629,12.375],
    ['Preganziol',45.603,12.236],['Paese',45.675,12.150],['Vedelago',45.680,12.018],['Mirano',45.494,12.108],['Dolo',45.426,12.074],['Spinea',45.492,12.161],
    ['Noale',45.550,12.071],['Caorle',45.600,12.887],['Eraclea',45.581,12.684],['Bibione',45.636,13.040],['Cavallino-Treporti',45.457,12.479],
    ['Abano Terme',45.360,11.789],['Piove di Sacco',45.297,12.035],['Este',45.228,11.656],['Monselice',45.243,11.749],['Camposampiero',45.567,11.934],
    ['Thiene',45.708,11.477],['Arzignano',45.520,11.334],['Valdagno',45.646,11.300],['Lonigo',45.388,11.386],['Marostica',45.746,11.657],
    ['Villafranca di Verona',45.355,10.845],['Legnago',45.193,11.304],['San Bonifacio',45.396,11.274],['Bussolengo',45.473,10.851],
    ['Peschiera del Garda',45.439,10.692],['Bardolino',45.548,10.723],['Adria',45.055,12.057],['Porto Viro',45.026,12.218],
    ['Cortina d’Ampezzo',46.538,12.137],['Pieve di Cadore',46.427,12.373],['Agordo',46.282,12.033],['Tolmezzo',46.400,13.016],['Gemona del Friuli',46.276,13.139],
    ['Spilimbergo',46.111,12.900],['Maniago',46.169,12.707],['Aviano',46.072,12.594],['San Vito al Tagliamento',45.915,12.856],['Latisana',45.781,12.996],
    ['Lignano Sabbiadoro',45.676,13.137],['Palmanova',45.905,13.310],['Cervignano del Friuli',45.823,13.336],['Grado',45.678,13.395],['Tavagnacco',46.130,13.218],
    ['Azzano Decimo',45.880,12.716],['Fiume Veneto',45.928,12.735],['Cordenons',45.986,12.700],['Fiumicello',45.795,13.410],['Sesto al Reghena',45.850,12.815],
    ['Cessalto',45.712,12.613],['Meduna di Livenza',45.808,12.618],['Annone Veneto',45.796,12.687],['Santo Stino di Livenza',45.731,12.684],['Ormelle',45.775,12.425],
    ['San Polo di Piave',45.789,12.393],['Mareno di Piave',45.840,12.352],['Codognè',45.871,12.431],['Gaiarine',45.898,12.483],['Orsago',45.926,12.419],
    ['Godega di Sant’Urbano',45.930,12.396],['San Fior',45.922,12.360],['Vazzola',45.838,12.380],['Salgareda',45.703,12.495],['Chiarano',45.731,12.580]
  ];
  var TF={
    it:{ey:'La tua zona',h:'Dove si trova il tuo immobile?',ld:'Scrivi il comune o tocca la mappa: ti mostriamo la distanza dalla sede, la pagina della tua zona e prenoti il sopralluogo gratuito.',
        ph:'Es. Conegliano, Mestre, Udine…',geo:'Usa la mia posizione',ge:'Posizione non disponibile: scrivi il comune.',out:'Sei fuori dalla nostra zona: lavoriamo solo in Veneto e Friuli Venezia Giulia.',
        nf:'Non troviamo “%s” nell’elenco, ma lavoriamo in tutto il Veneto e il Friuli Venezia Giulia: scrivici lo stesso.',pick:'Oppure scegli una città:',
        t1:'Siamo a due passi',t2:'Zona servita regolarmente',t3:'Zona servita',wk:'Sopralluogo di norma entro una settimana',fr:'Sopralluogo e preventivo gratuiti',
        bf:'Sopralluogo gratuito a %s',bp:'Impresa edile a %s',near:'La pagina più vicina: %s',sea:'Mare Adriatico',rs:'Tutta la mappa'},
    en:{ey:'Your area',h:'Where is your property?',ld:'Type your town or tap the map: see the distance from our base, the page for your area, and book a free survey.',
        ph:'e.g. Conegliano, Mestre, Udine…',geo:'Use my location',ge:'Location unavailable: please type your town.',out:'You are outside our area: we only work in Veneto and Friuli Venezia Giulia.',
        nf:'“%s” is not on our list, but we work across Veneto and Friuli Venezia Giulia: get in touch anyway.',pick:'Or pick a city:',
        t1:'Right around the corner',t2:'An area we cover regularly',t3:'An area we cover',wk:'Survey usually within a week',fr:'Free survey and quote',
        bf:'Free survey in %s',bp:'Builders in %s',near:'Nearest page: %s',sea:'Adriatic Sea',rs:'Whole map'},
    de:{ey:'Ihre Gegend',h:'Wo liegt Ihre Immobilie?',ld:'Ort eingeben oder auf die Karte tippen: Entfernung zu unserem Sitz, die Seite Ihrer Gegend und kostenlose Besichtigung buchen.',
        ph:'z. B. Conegliano, Mestre, Udine…',geo:'Meinen Standort verwenden',ge:'Standort nicht verfügbar: bitte Ort eingeben.',out:'Außerhalb unseres Gebiets: wir arbeiten nur in Venetien und Friaul-Julisch Venetien.',
        nf:'„%s“ steht nicht auf unserer Liste, aber wir arbeiten in ganz Venetien und Friaul: schreiben Sie uns trotzdem.',pick:'Oder eine Stadt wählen:',
        t1:'Direkt bei uns um die Ecke',t2:'Regelmäßig betreutes Gebiet',t3:'Betreutes Gebiet',wk:'Besichtigung meist innerhalb einer Woche',fr:'Kostenlose Besichtigung und Angebot',
        bf:'Kostenlose Besichtigung in %s',bp:'Bauunternehmen in %s',near:'Nächste Seite: %s',sea:'Adria',rs:'Ganze Karte'},
    ro:{ey:'Zona dvs.',h:'Unde se află imobilul dvs.?',ld:'Scrieți localitatea sau atingeți harta: vedeți distanța față de sediu, pagina zonei și programați inspecția gratuită.',
        ph:'ex. Conegliano, Mestre, Udine…',geo:'Folosiți locația mea',ge:'Locație indisponibilă: scrieți localitatea.',out:'Sunteți în afara zonei noastre: lucrăm doar în Veneto și Friuli Venezia Giulia.',
        nf:'„%s” nu e pe listă, dar lucrăm în tot Veneto și Friuli Venezia Giulia: scrieți-ne oricum.',pick:'Sau alegeți un oraș:',
        t1:'Chiar lângă noi',t2:'Zonă deservită regulat',t3:'Zonă deservită',wk:'Inspecție de obicei în decurs de o săptămână',fr:'Inspecție și ofertă gratuite',
        bf:'Inspecție gratuită în %s',bp:'Firmă de construcții în %s',near:'Cea mai apropiată pagină: %s',sea:'Marea Adriatică',rs:'Toată harta'},
    sq:{ey:'Zona juaj',h:'Ku ndodhet prona juaj?',ld:'Shkruani komunën ose prekni hartën: shihni distancën nga selia, faqen e zonës suaj dhe rezervoni inspektimin falas.',
        ph:'p.sh. Conegliano, Mestre, Udine…',geo:'Përdor vendndodhjen time',ge:'Vendndodhja s’është e disponueshme: shkruani komunën.',out:'Jeni jashtë zonës sonë: punojmë vetëm në Veneto dhe Friuli Venezia Giulia.',
        nf:'“%s” nuk është në listë, por punojmë në gjithë Veneton dhe Friulin: na shkruani gjithsesi.',pick:'Ose zgjidhni një qytet:',
        t1:'Fare pranë nesh',t2:'Zonë që e mbulojmë rregullisht',t3:'Zonë e mbuluar',wk:'Inspektimi zakonisht brenda një jave',fr:'Inspektim dhe ofertë falas',
        bf:'Inspektim falas në %s',bp:'Kompani ndërtimi në %s',near:'Faqja më e afërt: %s',sea:'Deti Adriatik',rs:'Gjithë harta'},
    hi:{ey:'आपका इलाका',h:'आपकी प्रॉपर्टी कहाँ है?',ld:'शहर लिखें या मैप पर टैप करें: मुख्यालय से दूरी, आपके इलाके का पेज देखें और मुफ़्त साइट सर्वे बुक करें।',
        ph:'जैसे Conegliano, Mestre, Udine…',geo:'मेरी लोकेशन इस्तेमाल करें',ge:'लोकेशन उपलब्ध नहीं: शहर का नाम लिखें।',out:'आप हमारे क्षेत्र से बाहर हैं: हम केवल Veneto और Friuli Venezia Giulia में काम करते हैं।',
        nf:'“%s” सूची में नहीं है, लेकिन हम पूरे Veneto और Friuli में काम करते हैं: फिर भी हमें लिखें।',pick:'या कोई शहर चुनें:',
        t1:'हमारे बिल्कुल पास',t2:'नियमित सेवा क्षेत्र',t3:'सेवा क्षेत्र',wk:'साइट सर्वे आमतौर पर एक हफ़्ते के अंदर',fr:'मुफ़्त साइट सर्वे और कोटेशन',
        bf:'%s में मुफ़्त सर्वे',bp:'%s में कंस्ट्रक्शन कंपनी',near:'सबसे नज़दीकी पेज: %s',sea:'एड्रियाटिक सागर',rs:'पूरा मैप'}
  };
  var F=TF[hl]||TF.en;
  function fmt(s,v){ return s.replace('%s',v); }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function norm(s){ return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’']/g,' ').toLowerCase().replace(/\s+/g,' ').trim(); }

  var zone=document.getElementById('dove-lavoriamo');
  var links={};
  if(zone){ var first=zone.querySelector('.pg-altri');
    if(first) first.querySelectorAll('a[href]').forEach(function(a){
      var h=a.getAttribute('href'); for(var s in CITY){ if(h.slice(-(s.length+2))==='-'+s+'/'){ links[s]={href:h,label:a.textContent.trim()}; break; } }
    }); }
  if(zone && Object.keys(links).length>5 && !document.querySelector('.dtf')){
    /* elenco di tutti i luoghi */
    var P=[];
    Object.keys(links).forEach(function(s){ var c=CITY[s]; P.push({id:s,n:links[s].label,it:c[0],lat:c[1],lon:c[2],big:!!c[3],page:links[s]}); });
    TOWNS.forEach(function(t,i){ P.push({id:'t'+i,n:t[0],it:t[0],lat:t[1],lon:t[2],big:false,page:null}); });
    var pagesOnly=P.filter(function(p){ return p.page; });
    P.forEach(function(p){
      p.km=km(HQ,p);
      if(!p.page){ var best=null,bd=1e9; pagesOnly.forEach(function(q){ var d=km(p,q); if(d<bd){ bd=d; best=q; } }); p.near=best; }
      p.key=norm(p.n)+' '+norm(p.it);
    });
    var BYID={}; P.forEach(function(p){ BYID[p.id]=p; });

    /* proiezione */
    var K=600, C=Math.cos(45.8*Math.PI/180), LON0=10.55, LAT0=46.64;
    var W=Math.ceil((13.95-LON0)*C*K), H=Math.ceil((LAT0-44.96)*K);
    var X=function(lon){ return (lon-LON0)*C*K; }, Y=function(lat){ return (LAT0-lat)*K; };
    var hx=X(HQ.lon), hy=Y(HQ.lat), u=K/111.2;

    /* stile */
    var st2=el('style',{id:'dtf-css'});
    st2.textContent=
     '.dtf-sec{padding-top:clamp(56px,7vw,100px)}'+
     '.dtf{display:grid;grid-template-columns:minmax(290px,410px) 1fr;grid-template-areas:"p m" "c m";column-gap:clamp(22px,4vw,54px);row-gap:0;margin:0 0 clamp(30px,4vw,56px)}'+
     '.dtf-p{grid-area:p;align-self:end}.dtf-m{grid-area:m;align-self:center}.dtf>.dtf-card{grid-area:c;align-self:start}'+
     '@media (max-width:900px){.dtf{grid-template-columns:1fr;grid-template-areas:"p" "m" "c";row-gap:16px}.dtf>.dtf-card{margin-top:0}}'+
     '.dtf-p .title{margin:10px 0 14px}.dtf-p .lead{margin:0 0 20px}'+
     '.dtf-h3{font:600 clamp(1.25rem,2vw,1.6rem)/1.25 Sora,Inter,sans-serif;color:var(--text);margin:0 0 16px}'+
     '.dtf-s{position:relative;display:flex;gap:8px}'+
     '.dtf-s input{flex:1;min-width:0;height:54px;border-radius:16px;border:1px solid var(--line-strong);background:rgba(255,255,255,.04);color:var(--text);'+
       'font:inherit;font-size:16px;padding:0 16px 0 46px;outline:none;transition:border-color .2s,box-shadow .2s}'+
     '.dtf-s input:focus{border-color:var(--blue);box-shadow:0 0 0 4px rgba(131,176,109,.14)}'+
     '.dtf-s svg.ic{position:absolute;left:16px;top:17px;width:20px;height:20px;color:var(--muted);pointer-events:none}'+
     '.dtf-geo{flex:none;width:54px;height:54px;border-radius:16px;border:1px solid var(--line-strong);background:rgba(255,255,255,.04);color:var(--blue-2);cursor:pointer;display:grid;place-items:center;transition:background .2s}'+
     '.dtf-geo:hover{background:rgba(131,176,109,.14)}.dtf-geo.busy svg{animation:dtfSpin 1s linear infinite}@keyframes dtfSpin{to{transform:rotate(360deg)}}'+
     '.dtf-sug{position:absolute;left:0;right:62px;top:60px;z-index:5;background:#0d100b;border:1px solid var(--line-strong);border-radius:14px;padding:6px;display:none;box-shadow:0 18px 40px rgba(0,0,0,.5)}'+
     '.dtf-sug.on{display:block}.dtf-sug button{display:flex;justify-content:space-between;gap:10px;width:100%;text-align:left;background:none;border:0;color:var(--text);font:inherit;font-size:15px;padding:10px 12px;border-radius:10px;cursor:pointer}'+
     '.dtf-sug button small{color:var(--muted);font-size:12.5px}.dtf-sug button:hover,.dtf-sug button.act{background:rgba(131,176,109,.14)}'+
     '.dtf-card{margin-top:16px;border:1px solid var(--line);background:var(--panel);border-radius:var(--r-lg,26px);padding:20px 20px 22px;min-height:120px}'+
     '.dtf-card.pop{animation:dtfPop .45s var(--ease,ease)}@keyframes dtfPop{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'+
     '.dtf-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dtf-chips button{border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--text);border-radius:999px;padding:8px 14px;font:inherit;font-size:14px;cursor:pointer;transition:border-color .2s,background .2s}'+
     '.dtf-chips button:hover{border-color:var(--line-strong);background:rgba(131,176,109,.12)}.dtf-mut{color:var(--muted);font-size:14px;margin:0}'+
     '.dtf-tag{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--blue-2)}'+
     '.dtf-tag::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 4px rgba(131,176,109,.2)}'+
     '.dtf-name{font:600 clamp(1.5rem,2.6vw,2rem)/1.15 Sora,Inter,sans-serif;color:#fff;margin:8px 0 4px}'+
     '.dtf-km{font-size:15px;color:var(--muted);margin:0 0 14px}.dtf-km b{color:var(--text);font-size:1.25em;font-variant-numeric:tabular-nums}'+
     '.dtf-ok{list-style:none;padding:0;margin:0 0 18px;display:grid;gap:7px;font-size:14.5px;color:var(--text)}.dtf-ok li{display:flex;gap:9px;align-items:flex-start}'+
     '.dtf-ok li::before{content:"✓";color:var(--blue-2);font-weight:700}'+
     '.dtf-act{display:grid;gap:10px}.dtf-act .btn{justify-content:center;width:100%}'+
     '.dtf-lnk{display:flex;justify-content:center;align-items:center;gap:8px;padding:12px 14px;border:1px solid var(--line);border-radius:14px;color:var(--text);text-decoration:none;font-size:14.5px;transition:border-color .2s,background .2s}'+
     '.dtf-lnk:hover{border-color:var(--line-strong);background:var(--panel-2)}.dtf-lnk small{color:var(--muted)}'+
     /* mappa */
     '.dtf-m{position:relative;border:1px solid var(--line);border-radius:var(--r-lg,26px);overflow:hidden;'+
       'background:radial-gradient(90% 70% at 62% 30%,rgba(131,176,109,.13),transparent 65%),radial-gradient(60% 50% at 75% 85%,rgba(80,130,150,.10),transparent 70%),#080a07}'+
     '.dtf-m svg{display:block;width:100%;height:auto;touch-action:manipulation}'+
     '.dtf-m .grid{fill:url(#dtf-dots)}.dtf-m .rg{fill:none;stroke:rgba(169,193,159,.20);stroke-dasharray:3 8}.dtf-m .rgl{fill:rgba(169,193,159,.55);font:500 16px Inter,sans-serif}'+
     '.dtf-m .reg{fill:rgba(236,235,228,.08);font:700 28px Sora,Inter,sans-serif;letter-spacing:.24em;pointer-events:none}'+
     '.dtf-m .sea{fill:rgba(140,180,200,.22);font:italic 500 22px Inter,sans-serif;letter-spacing:.2em;pointer-events:none}'+
     '.dtf-m .pl{cursor:pointer;outline:none}.dtf-m .pt{fill:#a9c19f;transition:fill .2s}.dtf-m .pl.sm .pt{fill:rgba(169,193,159,.55)}'+
     '.dtf-m .halo{fill:rgba(169,193,159,.20);transform-box:fill-box;transform-origin:center;transform:scale(0);transition:transform .3s var(--ease,ease)}'+
     '.dtf-m .pl:hover .halo,.dtf-m .pl:focus-visible .halo,.dtf-m .pl.on .halo{transform:scale(1)}.dtf-m .pl:hover .pt,.dtf-m .pl.on .pt{fill:#fff}'+
     '.dtf-m .pl.on .halo{fill:rgba(131,176,109,.35);animation:dtfRing 1.8s ease-out infinite}@keyframes dtfRing{0%{transform:scale(.6);opacity:1}100%{transform:scale(1.9);opacity:0}}'+
     '.dtf-m .lb{fill:#ecebe4;font:600 17px Inter,sans-serif;paint-order:stroke;stroke:#080a07;stroke-width:5px;stroke-linejoin:round;pointer-events:none}'+
     '.dtf-m .lb.min{opacity:0;transition:opacity .2s}.dtf-m .pl:hover .lb.min,.dtf-m .pl:focus-visible .lb.min,.dtf-m .pl.on .lb.min{opacity:1}'+
     
     '.dtf-m .hq{fill:var(--blue)}.dtf-m .hqp{fill:none;stroke:var(--blue);stroke-width:2;transform-box:fill-box;transform-origin:center;animation:dtPulse 2.4s ease-out infinite}'+
     '@keyframes dtPulse{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.8);opacity:0}}'+
     '.dtf-m .arc{fill:none;stroke:url(#dtf-grad);stroke-width:3;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1s var(--ease,ease)}'+
     '.dtf-m .arc.go{stroke-dashoffset:0}.dtf-m .runner{fill:#fff;filter:drop-shadow(0 0 6px #a9c19f)}'+
     '.dtf-m .tip{position:absolute;left:0;top:0;pointer-events:none;background:rgba(8,9,7,.94);border:1px solid var(--line-strong);border-radius:12px;padding:7px 11px;font-size:13px;line-height:1.35;color:#ecebe4;'+
       'transform:translate(-50%,calc(-100% - 14px));opacity:0;transition:opacity .15s;white-space:nowrap;z-index:3}.dtf-m .tip.on{opacity:1}.dtf-m .tip b{display:block;font-size:14px}'+
     '.dtf-rs{position:absolute;right:12px;top:12px;z-index:3;border:1px solid var(--line-strong);background:rgba(8,9,7,.8);color:var(--text);border-radius:999px;padding:7px 13px;font:inherit;font-size:13px;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .25s}'+
     '.dtf-m.zoom .dtf-rs{opacity:1;pointer-events:auto}'+
     '.dtf-m .pl{opacity:0;transition:opacity .5s}.dtf-m.in .pl{opacity:1}'+
     '@media (prefers-reduced-motion:reduce){.dtf-m .hqp,.dtf-m .pl.on .halo{animation:none}.dtf-m .arc{transition:none}.dtf-m .pl{opacity:1}}';
    document.head.appendChild(st2);

    /* markup pannello */
    var isHome=(itPath==='/');
    var pan=el('div',{'class':'dtf-p'});
    pan.innerHTML=(isHome?'<div class="eyebrow mono">'+F.ey+'</div><h2 class="title">'+F.h+'</h2><p class="lead">'+F.ld+'</p>':'<div class="dtf-h3">'+F.h+'</div>')+
      '<div class="dtf-s"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'+
      '<input type="search" enterkeyhint="search" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="dtf-sug" aria-label="'+esc(F.h)+'" placeholder="'+esc(F.ph)+'">'+
      '<button type="button" class="dtf-geo" aria-label="'+esc(F.geo)+'" title="'+esc(F.geo)+'"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7"/></svg></button>'+
      '<div class="dtf-sug" id="dtf-sug" role="listbox"></div></div>';
    var mapBox=el('div',{'class':'dtf-m'});
    var card=el('div',{'class':'dtf-card','aria-live':'polite'});
    var wrapF=el('div',{'class':'dtf'}); wrapF.appendChild(pan); wrapF.appendChild(mapBox); wrapF.appendChild(card);
    if(isHome){
      var sec=el('section',{'class':'dtf-sec',id:'trova-zona'}); var w=el('div',{'class':'wrap'}); w.appendChild(wrapF); sec.appendChild(w);
      var hero=document.querySelector('main > section.pg-hero, main > .pg-hero');
      if(hero && hero.nextSibling) hero.parentNode.insertBefore(sec,hero.nextSibling); else zone.parentNode.insertBefore(sec,zone);
    } else {
      var head=zone.querySelector('.sec-head'); (head&&head.nextSibling)? head.parentNode.insertBefore(wrapF,head.nextSibling) : zone.querySelector('.wrap').appendChild(wrapF);
    }

    /* mappa */
    var mw=mapBox.clientWidth||700, small=mw<560, sc=W/mw, PR=small?11:7, PRs=small?8:4.5, LBF=Math.round((small?11.5:12.5)*sc);
    var g='<defs><pattern id="dtf-dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="rgba(236,235,228,.07)"/></pattern>'+
      '<linearGradient id="dtf-grad" x1="0" x2="1"><stop offset="0" stop-color="#83b06d"/><stop offset="1" stop-color="#eaf4e2"/></linearGradient></defs>'+
      '<rect class="grid" x="0" y="0" width="'+W+'" height="'+H+'"/>'+
      '<text class="reg" x="'+X(11.05).toFixed(0)+'" y="'+Y(45.08).toFixed(0)+'">VENETO</text>'+
      '<text class="reg" text-anchor="end" x="'+(X(13.92)).toFixed(0)+'" y="'+Y(46.55).toFixed(0)+'">FRIULI VENEZIA GIULIA</text>'+
      '<text class="sea" x="'+X(12.62).toFixed(0)+'" y="'+Y(45.24).toFixed(0)+'">'+esc(F.sea)+'</text>';
    [25,50,100].forEach(function(r){ var R=r*u, o=R*0.7071;
      g+='<circle class="rg" cx="'+hx.toFixed(1)+'" cy="'+hy.toFixed(1)+'" r="'+R.toFixed(1)+'"/><text class="rgl" style="font-size:calc('+Math.round(LBF*0.8)+'px * var(--z,1))" x="'+(hx+o+6).toFixed(0)+'" y="'+(hy+o+18).toFixed(0)+'">'+r+' km</text>'; });
    g+='<path class="arc" pathLength="1" d=""/>';
    P.slice().sort(function(a,b){ return (a.big?1:0)-(b.big?1:0) || a.lat-b.lat; }).forEach(function(p){
      var x=X(p.lon), y=Y(p.lat), r=p.page?PR:PRs, end=x>W-220;
      g+='<g class="pl'+(p.page?'':' sm')+'" data-id="'+p.id+'" tabindex="0" role="button" aria-label="'+esc(p.n)+'">'+
        '<circle class="halo" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(r*3).toFixed(1)+'"/><circle class="pt" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'"/>'+
        '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(small?24:14)+'" fill="transparent"/>'+
        '<text class="lb'+(p.big?'':' min')+'" style="font-size:calc('+(p.page?LBF:Math.round(LBF*0.88))+'px * var(--z,1));stroke-width:calc(5px * var(--z,1))" x="'+(end?x-r-7:x+r+7).toFixed(1)+'" y="'+(y+LBF*0.35).toFixed(1)+'" text-anchor="'+(end?'end':'start')+'">'+esc(p.n)+'</text></g>';
    });
    g+='<circle class="hqp" cx="'+hx.toFixed(1)+'" cy="'+hy.toFixed(1)+'" r="11"/><circle class="hq" cx="'+hx.toFixed(1)+'" cy="'+hy.toFixed(1)+'" r="9"/>'+
      '<text class="lb" style="font-size:calc('+LBF+'px * var(--z,1));stroke-width:calc(5px * var(--z,1))" x="'+(hx+15).toFixed(1)+'" y="'+(hy-13).toFixed(1)+'">'+HQ.n+' · '+T.hq+'</text>'+
      '<circle class="runner" r="5" cx="-20" cy="-20"/>';
    mapBox.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(F.h)+'">'+g+'</svg><div class="tip" aria-hidden="true"></div><button type="button" class="dtf-rs">'+esc(F.rs)+'</button>';
    var sv=mapBox.querySelector('svg'), tip=mapBox.querySelector('.tip'), arc=sv.querySelector('.arc'), runner=sv.querySelector('.runner');
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ mapBox.classList.add('in'); io.disconnect(); } }); },{threshold:.15});
    io.observe(mapBox);
    /* comparsa a cascata dei punti, dal centro verso l'esterno */
    sv.querySelectorAll('.pl').forEach(function(n){ var p=BYID[n.getAttribute('data-id')]; n.style.transitionDelay=Math.min(900,p.km*6)+'ms'; });

    /* zoom (viewBox animato) */
    var VB=[0,0,W,H], raf=0, RC=[].slice.call(sv.querySelectorAll('.pl circle,.hq,.hqp,.runner')); RC.forEach(function(c){ c._r=+c.getAttribute('r'); });
    function setVB(t,ms){
      cancelAnimationFrame(raf); var f=VB.slice(), t0=performance.now(); ms=RMo?0:(ms||700);
      (function step(now){ var k=ms?Math.min(1,(now-t0)/ms):1, e=1-Math.pow(1-k,3);
        VB=f.map(function(v,i){ return v+(t[i]-v)*e; }); sv.setAttribute('viewBox',VB.join(' ')); var z=VB[2]/W; sv.style.setProperty('--z',z.toFixed(3)); var rz=0.45+0.55*z; RC.forEach(function(c){ c.setAttribute('r',(c._r*rz).toFixed(2)); });
        if(k<1) raf=requestAnimationFrame(step); })(t0);
    }
    var RMo=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    function focusOn(p){
      var x=X(p.lon), y=Y(p.lat), mx=Math.min(x,hx), Mx=Math.max(x,hx), my=Math.min(y,hy), My=Math.max(y,hy);
      var w=Math.max(Mx-mx+260, W/2.3), h=w*H/W; if(My-my+200>h){ h=My-my+200; w=h*W/H; }
      var cx=(mx+Mx)/2, cy=(my+My)/2, vx=Math.max(0,Math.min(W-w,cx-w/2)), vy=Math.max(0,Math.min(H-h,cy-h/2));
      setVB([vx,vy,Math.min(w,W),Math.min(h,H)]); mapBox.classList.add('zoom');
    }
    mapBox.querySelector('.dtf-rs').addEventListener('click',function(){ setVB([0,0,W,H]); mapBox.classList.remove('zoom'); });

    function drawArc(p){
      var x=X(p.lon), y=Y(p.lat), dx=x-hx, dy=y-hy, len=Math.sqrt(dx*dx+dy*dy)||1;
      var k=0.22, mx2=(hx+x)/2, my2=(hy+y)/2, c1x=mx2-dy*k, c1y=my2+dx*k, c2x=mx2+dy*k, c2y=my2-dx*k;
      var cx=c1y<c2y?c1x:c2x, cy=c1y<c2y?c1y:c2y;
      var d='M'+hx.toFixed(1)+' '+hy.toFixed(1)+' Q'+cx.toFixed(1)+' '+cy.toFixed(1)+' '+x.toFixed(1)+' '+y.toFixed(1);
      arc.classList.remove('go'); arc.setAttribute('d',d); void arc.getBoundingClientRect(); arc.classList.add('go');
      while(runner.firstChild) runner.removeChild(runner.firstChild);
      if(!RMo && len>8){ var am=document.createElementNS('http://www.w3.org/2000/svg','animateMotion');
        am.setAttribute('dur','2.2s'); am.setAttribute('repeatCount','indefinite'); am.setAttribute('path',d); am.setAttribute('begin','indefinite');
        runner.appendChild(am); runner.setAttribute('cx',0); runner.setAttribute('cy',0); try{ am.beginElement(); }catch(_){} }
      else { runner.setAttribute('cx',-20); runner.setAttribute('cy',-20); }
    }

    /* scheda */
    function cardIntro(msg){
      var pop=['treviso','venezia','padova','pordenone','udine','vicenza','verona','trieste'].filter(function(s){ return BYID[s]; });
      card.className='dtf-card';
      card.innerHTML=(msg?'<p class="dtf-mut" style="margin-bottom:12px;color:var(--text)">'+msg+'</p>':'')+'<p class="dtf-mut">'+F.pick+'</p><div class="dtf-chips">'+
        pop.map(function(s){ return '<button type="button" data-id="'+s+'">'+esc(BYID[s].n)+'</button>'; }).join('')+'</div>';
      card.querySelectorAll('button[data-id]').forEach(function(b){ b.addEventListener('click',function(){ select(BYID[b.getAttribute('data-id')],true); }); });
    }
    var cur=null;
    function select(p,zoom,silent){
      if(!p) return; cur=p;
      sv.querySelectorAll('.pl.on').forEach(function(n){ n.classList.remove('on'); });
      var node=sv.querySelector('.pl[data-id="'+p.id+'"]'); if(node){ node.classList.add('on'); node.parentNode.appendChild(node); }
      drawArc(p); if(zoom!==false) focusOn(p);
      var tag=p.km<=30?F.t1:(p.km<=70?F.t2:F.t3), pg=p.page||(p.near&&p.near.page), pgName=p.page?p.n:(p.near?p.near.n:'');
      card.className='dtf-card'; void card.offsetWidth; card.className='dtf-card pop';
      card.innerHTML='<span class="dtf-tag">'+tag+'</span><div class="dtf-name">'+esc(p.n)+'</div>'+
        '<p class="dtf-km">'+T.km.replace('%d','<b>'+p.km+'</b>')+'</p>'+
        '<ul class="dtf-ok"><li>'+F.fr+'</li><li>'+F.wk+'</li></ul>'+
        '<div class="dtf-act"><a class="btn btn-p" href="#dt-scrivi" data-go="form"><span class="lbl">'+esc(fmt(F.bf,p.n))+'</span></a>'+
        (pg&&pg.href!==location.pathname?'<a class="dtf-lnk" href="'+pg.href+'">'+esc(p.page?fmt(F.bp,pgName):fmt(F.near,pgName))+' →</a>':'')+'</div>';
      card.querySelector('[data-go=form]').addEventListener('click',function(ev){
        var forms=document.querySelectorAll('form.dt-lead'); if(!forms.length) return;
        ev.preventDefault();
        forms.forEach(function(f){ var c=f.querySelector('[name=comune]'); if(c) c.value=p.it; });
        var f=forms[0]; f.scrollIntoView({behavior:RMo?'auto':'smooth',block:'start'});
        track('zona_sopralluogo',{comune:p.it,km:p.km});
      });
      if(!silent){ track('zona_scelta',{comune:p.it,km:p.km}); try{ localStorage.setItem('dt_zona',p.id); }catch(_){} }
    }

    /* tooltip e clic sui punti */
    function tipOn(n){ var p=BYID[n.getAttribute('data-id')], c=n.querySelector('.pt'), r=sv.getBoundingClientRect(), m=mapBox.getBoundingClientRect();
      var sx=r.width/VB[2], x=(c.cx.baseVal.value-VB[0])*sx, y=(c.cy.baseVal.value-VB[1])*sx;
      tip.innerHTML='<b>'+esc(p.n)+'</b>'+T.km.replace('%d',p.km); tip.style.left=(r.left-m.left+x)+'px'; tip.style.top=(r.top-m.top+y)+'px'; tip.classList.add('on'); }
    sv.querySelectorAll('.pl').forEach(function(n){
      n.addEventListener('mouseenter',function(){ tipOn(n); }); n.addEventListener('mouseleave',function(){ tip.classList.remove('on'); });
      n.addEventListener('click',function(){ tip.classList.remove('on'); select(BYID[n.getAttribute('data-id')],true); });
      n.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); select(BYID[n.getAttribute('data-id')],true); } });
    });

    /* ricerca */
    var inp=pan.querySelector('input'), sug=pan.querySelector('.dtf-sug'), act=-1, res=[];
    function find(q){ q=norm(q); if(!q) return [];
      return P.filter(function(p){ return p.key.indexOf(q)>-1; }).sort(function(a,b){
        var A=norm(a.n).indexOf(q)===0?0:1, B=norm(b.n).indexOf(q)===0?0:1; return A-B || (b.page?1:0)-(a.page?1:0) || a.km-b.km; }).slice(0,6); }
    function paint(){ sug.innerHTML=res.map(function(p,i){ return '<button type="button" role="option" class="'+(i===act?'act':'')+'" data-id="'+p.id+'">'+esc(p.n)+'<small>'+p.km+' km</small></button>'; }).join('');
      sug.classList.toggle('on',res.length>0); inp.setAttribute('aria-expanded',res.length?'true':'false');
      sug.querySelectorAll('button').forEach(function(b){ b.addEventListener('mousedown',function(e){ e.preventDefault(); pick(BYID[b.getAttribute('data-id')]); }); }); }
    function pick(p){ inp.value=p.n; res=[]; act=-1; paint(); select(p,true); }
    inp.addEventListener('input',function(){ res=find(inp.value); act=res.length?0:-1; paint(); });
    inp.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'&&res.length){ e.preventDefault(); act=(act+1)%res.length; paint(); }
      else if(e.key==='ArrowUp'&&res.length){ e.preventDefault(); act=(act-1+res.length)%res.length; paint(); }
      else if(e.key==='Enter'){ e.preventDefault(); if(res[act]) pick(res[act]); else if(inp.value.trim()){ var r=find(inp.value); if(r[0]) pick(r[0]); else { cardIntro(esc(fmt(F.nf,inp.value.trim()))); track('zona_non_trovata',{q:inp.value.trim()}); } } }
      else if(e.key==='Escape'){ res=[]; paint(); }
    });
    inp.addEventListener('blur',function(){ setTimeout(function(){ res=[]; paint(); },120); });

    /* posizione */
    var geo=pan.querySelector('.dtf-geo');
    geo.addEventListener('click',function(){
      if(!navigator.geolocation){ cardIntro(F.ge); return; }
      geo.classList.add('busy'); track('zona_posizione');
      navigator.geolocation.getCurrentPosition(function(pos){
        geo.classList.remove('busy'); var me={lat:pos.coords.latitude,lon:pos.coords.longitude}, best=null, bd=1e9;
        P.forEach(function(p){ var d=km(me,p); if(d<bd){ bd=d; best=p; } });
        if(bd>35 && (me.lat<44.8||me.lat>46.7||me.lon<10.6||me.lon>13.95)) { cardIntro(F.out); return; }
        inp.value=best.n; select(best,true);
      },function(){ geo.classList.remove('busy'); cardIntro(F.ge); },{enableHighAccuracy:false,timeout:9000,maximumAge:600000});
    });

    /* stato iniziale: città della pagina, oppure l'ultima scelta del visitatore */
    var start=null, pcN=presetComune();
    if(pcN) P.forEach(function(p){ if(!start && norm(p.it)===norm(pcN)) start=p; });
    if(!start){ try{ var sid=localStorage.getItem('dt_zona'); if(sid&&BYID[sid]) start=BYID[sid]; }catch(_){} }
    if(start){ inp.value=start.n; select(start,true,true); } else cardIntro('');
  }
})();
