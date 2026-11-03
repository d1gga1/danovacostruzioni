/* Danova Costruzioni - interattività (03/11/2026)
   1) Preventivo guidato dentro i moduli "form.dt-lead": tipo di lavoro, immobile, superficie, comune.
      Preimpostato in base alla pagina (servizio / città). Nell'email i valori arrivano sempre in italiano
      (campi con data-lead, letti da contatto.js). Nessun prezzo mostrato.
   2) Mappa interattiva delle zone servite nella sezione #dove-lavoriamo (home in tutte le lingue):
      punti posizionati con le coordinate reali, distanza in linea d'aria dalla sede di Mansuè, link alle pagine città. */
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
   '.dt-mq input[type=range]{flex:1;accent-color:var(--blue,#83b06d);height:28px;cursor:pointer}'+
   '.dt-mq output{min-width:78px;text-align:right;font-variant-numeric:tabular-nums;font-weight:600;color:var(--text,#ecebe4)}'+
   '.dt-mq.unk output{color:var(--muted,#a6a99a);font-weight:400}'+
   /* mappa */
   '.dt-map{position:relative;margin:8px auto 38px;max-width:980px;border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px;'+
     'background:radial-gradient(120% 90% at 55% 35%,rgba(131,176,109,.10),rgba(255,255,255,.015) 60%);overflow:hidden}'+
   '.dt-map svg{display:block;width:100%;height:auto}'+
   '.dt-map .rg{fill:none;stroke:rgba(169,193,159,.22);stroke-dasharray:4 7}.dt-map .rgl{fill:rgba(169,193,159,.55);font:500 15px Inter,system-ui,sans-serif}'+
   '.dt-map .ln{stroke:rgba(169,193,159,.0);stroke-width:2;transition:stroke .25s}.dt-map a.on .ln{stroke:rgba(169,193,159,.55)}'+
   '.dt-map .pt{fill:#a9c19f;transition:r .25s,fill .25s}.dt-map .halo{fill:rgba(169,193,159,.18);transform-box:fill-box;transform-origin:center;transform:scale(0);transition:transform .3s}'+
   '.dt-map a:hover .halo,.dt-map a:focus .halo,.dt-map a.on .halo{transform:scale(1)}.dt-map a:hover .pt,.dt-map a:focus .pt,.dt-map a.on .pt{fill:#fff}'+
   '.dt-map .lb{fill:#ecebe4;font:600 17px Inter,system-ui,sans-serif;paint-order:stroke;stroke:#080907;stroke-width:5px;stroke-linejoin:round;pointer-events:none;opacity:.9}'+
   '.dt-map .lb.min{opacity:0;transition:opacity .2s}.dt-map a:hover .lb.min,.dt-map a:focus .lb.min,.dt-map a.on .lb.min{opacity:1}'+
   '.dt-map a:focus{outline:none}.dt-map a:focus-visible .pt{stroke:#fff;stroke-width:3}'+
   '.dt-map .hq{fill:var(--blue,#83b06d)}.dt-map .hqp{fill:none;stroke:var(--blue,#83b06d);stroke-width:2;transform-box:fill-box;transform-origin:center;animation:dtPulse 2.4s ease-out infinite}'+
   '@keyframes dtPulse{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.6);opacity:0}}'+
   '@media (prefers-reduced-motion:reduce){.dt-map .hqp{animation:none}}'+
   '.dt-map-tip{position:absolute;left:0;top:0;pointer-events:none;background:rgba(8,9,7,.92);border:1px solid var(--line-strong,rgba(255,255,255,.25));'+
     'border-radius:12px;padding:8px 12px;font-size:13px;line-height:1.35;color:#ecebe4;transform:translate(-50%,calc(-100% - 14px));opacity:0;transition:opacity .15s;white-space:nowrap;z-index:2}'+
   '.dt-map-tip.on{opacity:1}.dt-map-tip b{display:block;font-size:14px}'+
   '.dt-map-cap{margin:0;padding:12px 18px 16px;font-size:13px;color:var(--muted,#a6a99a);text-align:center}'+
   '.pg-altri a.dt-hl{border-color:var(--line-strong,rgba(255,255,255,.25));color:#fff;background:var(--panel-2,rgba(255,255,255,.06))}'+
   '@media (max-width:640px){.dt-map .lb{font-size:24px;stroke-width:6px}.dt-map .rgl{font-size:20px}.dt-map{border-radius:16px}}';
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

  /* ================= 2. MAPPA ZONE SERVITE ================= */
  var zone=document.getElementById('dove-lavoriamo');
  if(zone && !zone.querySelector('.dt-map')){
    var links={};   /* slug -> href della pagina ristrutturazioni nella lingua corrente */
    var first=zone.querySelector('.pg-altri');
    if(first) first.querySelectorAll('a[href]').forEach(function(a){
      var h=a.getAttribute('href'); for(var s in CITY){ if(h.slice(-(s.length+2))==='-'+s+'/'){ links[s]={href:h,label:a.textContent.trim()}; break; } }
    });
    if(Object.keys(links).length>5){
      var K=600, C=Math.cos(45.7*Math.PI/180), LON0=10.80, LAT0=46.27;
      var X=function(lon){ return ((lon-LON0)*C*K).toFixed(1); }, Y=function(lat){ return ((LAT0-lat)*K).toFixed(1); };
      var W=Math.ceil((13.95-LON0)*C*K), H=Math.ceil((LAT0-44.98)*K);
      var hx=X(HQ.lon), hy=Y(HQ.lat), u=K/111.2;
      var svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+T.cap.replace(/"/g,'')+'">';
      [25,50,100].forEach(function(r){ var R=(r*u).toFixed(1);
        svg+='<circle class="rg" cx="'+hx+'" cy="'+hy+'" r="'+R+'"/><text class="rgl" x="'+(+hx+4)+'" y="'+(hy-R-6)+'">'+r+' km</text>'; });
      var dots='', order=Object.keys(links).sort(function(a,b){ return CITY[b][1]-CITY[a][1]; });
      order.forEach(function(s){
        var c=CITY[s], x=X(c[2]), y=Y(c[1]), d=km(HQ,{lat:c[1],lon:c[2]}), L=links[s];
        var anchor=(x>W-160)?'end':'start', tx=anchor==='end'?(+x-13):(+x+13);
        dots+='<a href="'+L.href+'" data-s="'+s+'" data-km="'+d+'" aria-label="'+L.label+', '+T.km.replace('%d',d).replace(/"/g,'')+'">'+
          '<line class="ln" x1="'+hx+'" y1="'+hy+'" x2="'+x+'" y2="'+y+'"/>'+
          '<circle class="halo" cx="'+x+'" cy="'+y+'" r="20"/><circle class="pt" cx="'+x+'" cy="'+y+'" r="6.5"/>'+
          '<text class="lb'+(c[3]?'':' min')+'" x="'+tx+'" y="'+(+y+6)+'" text-anchor="'+anchor+'">'+L.label+'</text></a>';
      });
      svg+=dots+'<circle class="hqp" cx="'+hx+'" cy="'+hy+'" r="11"/><circle class="hq" cx="'+hx+'" cy="'+hy+'" r="9"/>'+
        '<text class="lb" x="'+(+hx+15)+'" y="'+(+hy-12)+'">'+HQ.n+' · '+T.hq+'</text></svg>';
      var map=el('div',{'class':'dt-map','data-rv':'up'},svg+'<div class="dt-map-tip" aria-hidden="true"></div><p class="dt-map-cap">'+T.cap+'</p>');
      var head=zone.querySelector('.sec-head'); (head&&head.nextSibling)? head.parentNode.insertBefore(map,head.nextSibling) : zone.querySelector('.wrap').appendChild(map);
      map.classList.add('in');
      var tip=map.querySelector('.dt-map-tip'), sv=map.querySelector('svg');
      function show(s,on){
        var a=sv.querySelector('a[data-s="'+s+'"]'); if(!a) return;
        a.classList.toggle('on',on);
        zone.querySelectorAll('.pg-altri a[href]').forEach(function(x){ var h=x.getAttribute('href'); if(h.slice(-(s.length+2))==='-'+s+'/') x.classList.toggle('dt-hl',on); });
        if(on){
          var p=a.querySelector('.pt'), r=sv.getBoundingClientRect(), m=map.getBoundingClientRect(), sc=r.width/W;
          tip.innerHTML='<b>'+links[s].label+'</b>'+T.km.replace('%d',a.getAttribute('data-km'));
          tip.style.left=(r.left-m.left+p.cx.baseVal.value*sc)+'px'; tip.style.top=(r.top-m.top+p.cy.baseVal.value*sc)+'px';
          tip.classList.add('on');
        } else tip.classList.remove('on');
      }
      sv.querySelectorAll('a[data-s]').forEach(function(a){
        var s=a.getAttribute('data-s');
        a.addEventListener('mouseenter',function(){ show(s,true); }); a.addEventListener('mouseleave',function(){ show(s,false); });
        a.addEventListener('focus',function(){ show(s,true); }); a.addEventListener('blur',function(){ show(s,false); });
        a.addEventListener('click',function(){ track('mappa_citta',{citta:s}); });
      });
      zone.querySelectorAll('.pg-altri a[href]').forEach(function(x){
        var h=x.getAttribute('href'), s=null; for(var k in links){ if(h.slice(-(k.length+2))==='-'+k+'/'){ s=k; break; } }
        if(!s) return;
        x.addEventListener('mouseenter',function(){ show(s,true); }); x.addEventListener('mouseleave',function(){ show(s,false); });
      });
    }
  }
})();
