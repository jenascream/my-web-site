// ⬇️ METTEZ ICI VOTRE NUMÉRO WHATSAPP : indicatif du pays + numéro, sans "+", sans espace ni tiret
var WHATSAPP_NUMBER = "22872900880";

// À modifier : devise et produits
var CUR = "FCFA";
var PRODUITS = [
  {id:1,nom:"Fruit de la passion",desc:"Sorbet acidulé, avec ses pépins.",prix:500,couleur:"#F6C445",dispo:"ok"},
  {id:2,nom:"Vanille",desc:"Crémeuse, avec de vraies gousses.",prix:500,couleur:"#F1E3BF",dispo:"ok"},
  {id:3,nom:"Matcha",desc:"Une douceure cremeuse aux notes delicates.",prix:500,couleur:"#A8C97A",dispo:"ok"},
  {id:4,nom:"Fraise",desc:"Une glace fruitée,fraiche et gourmande, au delicieux goût de fraise.",prix:500,couleur:"#F48FA6",dispo:"ok"},
  {id:5,nom:"Chocolat",desc:"Onctueuse et intense, pour les amoureux du vertable plaisir chocolat.",prix:500,couleur:"#8A5A44",dispo:"ok"},
  {id:6,nom:"Café",desc:"Une glace onctueuse aux aromes riches.",prix:500,couleur:"#C9A27E",dispo:"ok"},

  // ===== EXOTIQUE : les 3 nouveaux parfums (cat:"exotique" les place dans la section Exotique) =====
  {id:7,cat:"exotique",nom:"BISSAP",desc:"Un sorbet d'hibiscus, rafraîchissant.",prix:700,couleur:"#FFB627",dispo:"ok"},
  {id:8,cat:"exotique",nom:"CITRON",desc:"une saveur unique et exotique.",prix:700,couleur:"#EFE6D2",dispo:"ok"},
  {id:9,cat:"exotique",nom:"ORANGE",desc:"pour plus de peps dans votre vie.",prix:700,couleur:"#B0305C",dispo:"ok"}
];
var IMG = {
  "1": "passion.jpg",
  "2": "vanille.jpg",
  "3": "matcha.jpg",
  "4": "fraise.jpg",
  "5": "chocolat.jpg",
  "6": "cafe.jpg",
  "7": "bisap.jpeg",   // photos des nouveaux parfums : déposez-les à côté de passion.jpg, cafe.jpg...
  "8": "citron.jpeg",
  "9": "orange.jpeg"
};
var panier = {};
function fmt(n){return n.toFixed(2).replace(".",",")+" "+CUR}
function $(id){return document.getElementById(id)}

function photoManquante(img){ // si la photo n'existe pas encore : un bloc de la couleur du parfum à la place
  var d=document.createElement("div");
  d.className=(img.className?img.className+" ":"")+"ph";
  d.style.background=img.dataset.c||"#eee";
  d.setAttribute("role","img"); d.setAttribute("aria-label",img.alt||"");
  d.textContent="Photo à venir";
  img.replaceWith(d);
}
function carte(p){
  var w = p.dispo==="warn";
  return '<div class="card" style="--c:'+p.couleur+';--tint:'+p.couleur+'"><div class="head"><div><h3>'+p.nom+'</h3><p>'+p.desc+'</p></div>'+
    '<div class="pill"><span class="pr">'+fmt(p.prix)+'</span><span class="'+(w?"warn":"ok")+'">'+(w?"Presque épuisé":"En stock")+'</span></div></div>'+
    '<img class="photo" src="'+IMG[p.id]+'" alt="Glace '+p.nom.toLowerCase()+'" width="190" height="152" loading="lazy" data-c="'+p.couleur+'" onerror="photoManquante(this)"><button class="add" data-id="'+p.id+'">Ajouter</button></div>';
}
function rendreGrille(){
  $("grid").innerHTML = PRODUITS.filter(function(p){return p.cat!=="exotique"}).map(carte).join("");
  $("grid-exo").innerHTML = PRODUITS.filter(function(p){return p.cat==="exotique"}).map(carte).join("");
  document.querySelectorAll(".card").forEach(function(c){
    c.addEventListener("pointermove",function(e){
      if(e.pointerType==="touch") return;
      var F=16;
      var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      c.style.setProperty("--ry",((x/r.width-.5)*2*F).toFixed(2)+"deg");
      c.style.setProperty("--rx",(-(y/r.height-.5)*2*F).toFixed(2)+"deg");
      c.style.setProperty("--mx",x+"px");c.style.setProperty("--my",y+"px");
    });
    c.addEventListener("pointerleave",function(){c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")});
  });
}
function majPanier(){
  var n=0,t=0,h="";
  PRODUITS.forEach(function(p){
    var q=panier[p.id]||0; if(!q) return;
    n+=q; t+=q*p.prix;
    h+='<div class="line"><span>'+p.nom+'</span><span class="q"><button data-m="'+p.id+'" aria-label="Retirer un '+p.nom+'">−</button> '+q+' <button data-p="'+p.id+'" aria-label="Ajouter un '+p.nom+'">+</button></span><span>'+fmt(q*p.prix)+'</span></div>';
  });
  $("count").textContent=n;
  $("total").textContent=fmt(t);
  $("lines").innerHTML = h || '<p class="empty">Votre panier est vide. Ajoutez un parfum pour commencer.</p>';
  $("form").style.display = n ? "block" : "none";
  $("send").style.display = n ? "inline-block" : "none";
}
document.addEventListener("click",function(e){
  var a=e.target.closest("[data-id],[data-p],[data-m]"); if(!a) return;
  var id=a.dataset.id||a.dataset.p||a.dataset.m;
  if(a.dataset.m){panier[id]=Math.max(0,(panier[id]||0)-1)} else {panier[id]=(panier[id]||0)+1}
  majPanier();
  lvOn(true); clearTimeout(lvT); lvT=setTimeout(function(){if(!$("dlg").open)lvOn(false)},700); // l'icône s'anime à chaque ajout
});
var LV=document.querySelector(".lv"), lvT=0;
function lvOn(on){LV.classList.toggle("on",on)}
$("open").onclick=function(){$("msg").textContent="";$("dlg").showModal();lvOn(true)};
$("dlg").addEventListener("close",function(){lvOn(false)});
$("close").onclick=function(){$("dlg").close()};
$("send").onclick=function(){
  var nom=$("nom").value.trim(), tel=$("tel").value.trim();
  if(!nom||!tel){$("msg").textContent="Renseignez votre nom et votre téléphone.";return}
  if(/X/i.test(WHATSAPP_NUMBER)){$("msg").textContent="Numéro WhatsApp de la boutique non configuré (voir WHATSAPP_NUMBER dans le code).";return}
  var t=0,l=[];
  PRODUITS.forEach(function(p){var q=panier[p.id]||0;if(q){t+=q*p.prix;l.push("• "+q+" × "+p.nom+" ("+fmt(q*p.prix)+")")}});
  var txt="Bonjour, je souhaite commander :\n"+l.join("\n")+"\n\nTotal : "+fmt(t)+"\nNom : "+nom+"\nTéléphone : "+tel+"\nRéception : "+$("mode").value;
  var url="https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(txt);
  var w=window.open(url,"_blank","noopener");
  $("msg").innerHTML='Votre commande est prête. Si WhatsApp ne s\'ouvre pas, <a href="'+url+'" target="_blank" rel="noopener">touchez ici pour l\'envoyer</a>.';
  panier={}; majPanier();
};

// ---- Avis (exemples à remplacer par de vrais avis de clients)
var AVIS=[
  {nom:"Awa",note:5,texte:"La glace vanille est exactement comme à la maison. Je recommande!."},
  {nom:"Koffi",note:5,texte:"Le matcha est doux, pas trop sucré. Livraison rapide."},
  {nom:"Mariam",note:4,texte:"La fraise est délicieuse, j'aimerais plus de parfums en sorbet."},
  {nom:"Yao",note:5,texte:"Le chocolat est onctueux, mes enfants en redemandent."},
  {nom:"Esther",note:5,texte:"Fruit de la passion bien acidulé, très frais."},
  {nom:"Rodrigue",note:4,texte:"Le café est parfumé, et la commande par WhatsApp est très simple."}
];
function esc(x){var d=document.createElement("div");d.textContent=x;return d.innerHTML}
function etoiles(n){return "★★★★★".slice(0,n)+"☆☆☆☆☆".slice(0,5-n)}
function rendreAvis(){
  var tous=AVIS, m=tous.reduce(function(a,r){return a+r.note},0)/tous.length;
  $("rating").innerHTML='<span class="stars" aria-hidden="true">'+etoiles(Math.round(m))+'</span> '+m.toFixed(1).replace(".",",")+" / 5 sur "+tous.length+" avis";
  buildMarq(tous);
}

// ---- Défilement vertical des avis
var DUREE=20; // secondes pour un tour complet (comme speed=20)
var cols=[], hover=false, factor=1, last=0, started=false;
function card(r){return '<div class="rev"><span class="stars" role="img" aria-label="'+r.note+' sur 5">'+etoiles(r.note)+'</span><p>'+esc(r.texte)+'</p><b>'+esc(r.nom)+'</b></div>'}
function buildMarq(tous){
  var box=$("revs"), n=matchMedia("(max-width:720px)").matches?1:2, groups=[];
  for(var i=0;i<n;i++) groups.push([]);
  tous.forEach(function(r,i){groups[i%n].push(r)});
  box.innerHTML=""; box.style.gridTemplateColumns="repeat("+n+",1fr)";
  cols=groups.map(function(g,ci){
    var tr=document.createElement("div"); tr.className="track"; box.appendChild(tr);
    do{g.forEach(function(r){tr.insertAdjacentHTML("beforeend",card(r))})}while(tr.offsetHeight<box.clientHeight&&tr.children.length<60);
    var count=tr.children.length;
    for(var k=0;k<count;k++){var c=tr.children[k].cloneNode(true);c.setAttribute("aria-hidden","true");tr.appendChild(c)}
    var loop=tr.children[count].offsetTop, dir=ci%2?1:-1;
    return {tr:tr,dir:dir,loop:loop,y:dir>0?-loop:0};
  });
  if(!started&&cols.length){started=true;requestAnimationFrame(tick)}
}
function tick(t){
  var dt=Math.min((t-last)/1000,.05); last=t;
  factor+=((hover?0:1)-factor)*Math.min(1,dt*6); // ralentit en douceur au survol
  cols.forEach(function(c){
    c.y+=c.dir*(c.loop/DUREE)*factor*dt;
    if(c.y<=-c.loop)c.y+=c.loop; if(c.y>0)c.y-=c.loop;
    c.tr.style.transform="translateY("+c.y.toFixed(1)+"px)";
  });
  requestAnimationFrame(tick);
}
$("revs").addEventListener("pointerenter",function(){hover=true});
$("revs").addEventListener("pointerleave",function(){hover=false});
matchMedia("(max-width:720px)").addEventListener("change",function(){rendreAvis()});

// ---- Roue d'images : défilement automatique, les boutons choisissent la glace
var ROUE={vitesse:.35,flou:4,sombre:62,boost:30,force:1.05,satMin:55,satForce:.6,focus:.34,echelle:.06}; // vitesse = nombre de photos par seconde
var wheelEl=$("wheel"), wsec=$("roue"), wcards=[], wR=0, wActive=-1, ph=3, wGo=null, wHold=0, wVisible=true, wLast=0;
var NP=PRODUITS.length, WN=NP*2; // chaque photo apparaît deux fois sur la roue
function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
function angDist(a,b){var f=Math.PI*2,r=((a-b+Math.PI)%f)-Math.PI;if(r<-Math.PI)r+=f;return Math.abs(r)}
function focusIdx(cur){
  var phase=((ph%WN)+WN)%WN;
  if(cur<0)return Math.round(phase)%WN;
  var next=cur,d=phase-next;
  if(d>WN/2)d-=WN; if(d<-WN/2)d+=WN;
  while(d>.68){next=(next+1)%WN;d-=1}
  while(d<-.68){next=(next-1+WN)%WN;d+=1}
  return next;
}
function setActive(idx){
  wActive=idx; var a=idx%NP, pills=$("wtt").children;
  for(var i=0;i<pills.length;i++){
    var d=Math.abs(i-a);
    pills[i].style.opacity=d===0?1:d===1?.58:d===2?.32:.16;
    pills[i].style.transform=d===0?"scale(1)":"scale(.96)";
    pills[i].setAttribute("aria-current",d===0?"true":"false");
  }
  var txt=PRODUITS[a].desc;
  $("wsub").setAttribute("aria-label",txt);
  $("wsub").innerHTML=txt.split("").map(function(ch,i){return '<span aria-hidden="true" style="animation-delay:'+(i*18)+'ms">'+(ch===" "?"&nbsp;":esc(ch))+'</span>'}).join("");
  centerPill();
}
function centerPill(){
  var vp=$("wtv"), tr=$("wtt"), el=tr.children[wActive%NP]; if(!el)return;
  var x=vp.clientWidth/2-(el.offsetLeft+el.offsetWidth/2);
  x = tr.scrollWidth<=vp.clientWidth ? (vp.clientWidth-tr.scrollWidth)/2 : clamp(x,vp.clientWidth-tr.scrollWidth,0);
  tr.style.transform="translateX("+Math.round(x)+"px)";
}
function drawRoue(){
  var rot=-(ph/WN-.25)*Math.PI*2, focusArc=Math.PI*ROUE.focus, peak=100+ROUE.boost;
  wcards.forEach(function(c,i){
    var th=(i/WN)*Math.PI*2-Math.PI+rot, x=Math.cos(th)*wR, y=Math.sin(th)*wR;
    var fi=clamp(angDist(th,-Math.PI/2)/focusArc,0,1);
    var dark=clamp(fi*ROUE.force,0,1), sat=clamp(fi*ROUE.satForce,0,1);
    var bright=ROUE.sombre+(1-dark)*(peak-ROUE.sombre);
    var satur=ROUE.satMin+(1-sat)*(100-ROUE.satMin);
    var depth=clamp((1-fi)*100,0,100), tilt=clamp(x/wR,-1,1)*8, sc=1-dark*ROUE.echelle;
    c.style.transform="translate3d("+x.toFixed(1)+"px,"+y.toFixed(1)+"px,"+depth.toFixed(0)+"px) translate(-50%,-50%) rotate("+tilt.toFixed(2)+"deg) scale("+sc.toFixed(3)+")";
    c.style.filter="blur("+(dark*ROUE.flou).toFixed(1)+"px) brightness("+bright.toFixed(0)+"%) saturate("+satur.toFixed(0)+"%)";
    c.style.zIndex=Math.round(depth);
  });
  var f=focusIdx(wActive); if(f!==wActive) setActive(f);
}
function layoutRoue(){
  var vw=window.innerWidth, sh=wsec.clientHeight, size=clamp(vw*1.3,1000,2000), cw=Math.round(Math.min(clamp(vw*.17,170,300),sh*.36/1.25)), ch=Math.round(cw*1.25);
  wR=size/2;
  wheelEl.style.width=wheelEl.style.height=size+"px";
  wheelEl.style.top=Math.round(sh*.57)+"px"; // le haut de la roue = position de la photo active
  wcards.forEach(function(c){c.style.width=cw+"px";c.style.height=ch+"px"});
  drawRoue(); centerPill();
}
function allerA(j){ // clic sur un nom : la roue tourne jusqu'à cette glace, puis fait une pause
  var now=performance.now(), to=j+NP*Math.round((ph-j)/NP);
  wGo={from:ph,to:to,t0:now,dur:700}; wHold=now+4000;
}
function tickRoue(t){
  var dt=Math.min((t-wLast)/1000,.05); wLast=t;
  if(wVisible){
    if(wGo){
      var k=Math.min(1,(t-wGo.t0)/wGo.dur), e=1-Math.pow(1-k,3);
      ph=wGo.from+(wGo.to-wGo.from)*e; if(k>=1) wGo=null;
    } else if(t>wHold){ ph+=ROUE.vitesse*dt }
    drawRoue();
  }
  requestAnimationFrame(tickRoue);
}
(function(){
  var ring=$("ring"), tt=$("wtt");
  PRODUITS.concat(PRODUITS).forEach(function(p){
    var f=document.createElement("figure"); f.className="oiw";
    f.innerHTML='<img src="'+IMG[p.id]+'" alt="Glace '+esc(p.nom.toLowerCase())+'" draggable="false" data-c="'+p.couleur+'" onerror="photoManquante(this)">';
    ring.appendChild(f); wcards.push(f);
  });
  PRODUITS.forEach(function(p,j){
    var b=document.createElement("button"); b.type="button"; b.className="wp"; b.textContent=p.nom;
    b.addEventListener("click",function(){allerA(j)}); tt.appendChild(b);
  });
  if("IntersectionObserver" in window) new IntersectionObserver(function(e){wVisible=e[0].isIntersecting}).observe(wsec);
  window.addEventListener("resize",layoutRoue);
  layoutRoue();
  requestAnimationFrame(function(t){wLast=t;tickRoue(t)});
})();
rendreAvis();
rendreGrille(); majPanier();
