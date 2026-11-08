(function(){
'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
var mx=0,my=0,px=-999,py=-999,act=0;
addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;px=e.clientX;py=e.clientY;act=performance.now()+1400});
function sm(a,b,x){x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)}

/* ---------- stages: one continuous object that morphs section to section ---------- */
var secs=$$('[data-stage]'),NAMES=['LAUNCH','ABOUT','EXPERIENCE','HOW IT WORKS','ARENA','MISSION','COMMUNITY','READY'];
function stageFloat(){
  var s=scrollY+innerHeight*.5,c=secs.map(function(el){var r=el.getBoundingClientRect();return r.top+scrollY+r.height/2});
  if(s<=c[0])return 0;
  for(var i=0;i<c.length-1;i++)if(s<c[i+1])return i+sm(.3,.7,(s-c[i])/(c[i+1]-c[i]));
  return c.length-1}
var rail=$('#rail');
secs.forEach(function(el,i){var b=document.createElement('button');b.setAttribute('aria-label',NAMES[i]);b.onclick=function(){el.scrollIntoView({behavior:'smooth',block:'center'})};rail.appendChild(b)});

/* shape helpers (all return a function producing one [x,y,z] point) */
var TAU=6.2832;
function rot(x,y,z,tx,tz){var y1=y*Math.cos(tx)-z*Math.sin(tx),z1=y*Math.sin(tx)+z*Math.cos(tx);return[x*Math.cos(tz)-y1*Math.sin(tz),x*Math.sin(tz)+y1*Math.cos(tz),z1]}
function Sp(r,x,y,z,b){return function(){var u=Math.random()*2-1,a=Math.random()*TAU,q=Math.sqrt(1-u*u),k=r*(1+(b||0)*Math.sin(u*5+a*2));return[x+k*q*Math.cos(a),y+k*u,z+k*q*Math.sin(a)]}}
function Rg(r1,r2,tx,tz,x,y,z){return function(){var a=Math.random()*TAU,r=r1+Math.random()*(r2-r1),v=rot(r*Math.cos(a),(Math.random()-.5)*.05,r*Math.sin(a),tx,tz);return[v[0]+(x||0),v[1]+(y||0),v[2]+(z||0)]}}
function Tr(R,r,tx){return function(){var a=Math.random()*TAU,b=Math.random()*TAU;return rot((R+r*Math.cos(b))*Math.cos(a),r*Math.sin(b),(R+r*Math.cos(b))*Math.sin(a),tx,0)}}
function Ln(a,b,j){return function(){var t=Math.random();return[a[0]+(b[0]-a[0])*t+(Math.random()-.5)*j,a[1]+(b[1]-a[1])*t+(Math.random()-.5)*j,a[2]+(b[2]-a[2])*t+(Math.random()-.5)*j]}}
function Cy(r,y0,y1){return function(){var a=Math.random()*TAU;return[r*Math.cos(a),y0+(y1-y0)*Math.random(),r*Math.sin(a)]}}
function Co(r0,y0,y1){return function(){var t=Math.random(),a=Math.random()*TAU,r=r0*(1-t);return[r*Math.cos(a),y0+(y1-y0)*t,r*Math.sin(a)]}}
function Fin(ang){return function(){var u=Math.random(),v=Math.random();if(u+v>1){u=1-u;v=1-v}var x=.45+u*.75,y=-1-v*.5+u*.5,c=Math.cos(ang),s=Math.sin(ang);return[x*c,y,x*s]}}
function Ra(r0,r1){return function(){var u=Math.random()*2-1,a=Math.random()*TAU,q=Math.sqrt(1-u*u),r=r0+Math.random()*(r1-r0);return[r*q*Math.cos(a),r*u,r*q*Math.sin(a)]}}
var N=innerWidth<760?5000:8000;
function build(parts){var o=new Float32Array(N*3),k=0,v;parts.forEach(function(p){var c=Math.round(N*p[0]);for(var j=0;j<c&&k<N;j++,k++){v=p[1]();o[k*3]=v[0];o[k*3+1]=v[1];o[k*3+2]=v[2]}});for(;k<N;k++){o[k*3]=o[k*3-3];o[k*3+1]=o[k*3-2];o[k*3+2]=o[k*3-1]}return o}
function sat(i,r,w){var a=i*TAU/5;return[w,Sp(.3,r*Math.cos(a),r*Math.sin(a)*.55,0)]}
var SH=[
 /* hero: planet + moons + ring */ build([[.52,Sp(1.45,0,0,0,.05)],[.09,Sp(.38,2.5,.9,.5)],[.04,Sp(.17,-2.4,-1,.3)],[.25,Rg(2.1,3,.55,.25)],[.10,Rg(3.55,3.6,.9,.1)]]),
 /* about: atom of rings with CC core */ build([[.14,Sp(.75,0,0,0)],[.17,Rg(1.5,1.56,0,0)],[.17,Rg(2.1,2.16,1.1,.4)],[.17,Rg(2.7,2.76,.5,-.8)],[.05,Sp(.17,1.5,0,0)],[.05,Sp(.17,-.8,1.9,.3)],[.05,Sp(.17,1.8,-1.9,.4)],[.2,Rg(3.3,3.35,.3,.2)]]),
 /* experience: film portal */ build([[.55,Tr(1.9,.38,.6)],[.22,Sp(.7,0,0,0)],[.15,Rg(2.7,2.78,1.2,0)],[.08,Ln([-3,0,0],[3,0,0],.05)]]),
 /* how: asteroid belt behind the planet slider */ build([[.7,Rg(3.7,5.2,1.3,0)],[.2,Rg(2.9,3.05,1.3,0)],[.1,Ln([-5,0,0],[5,0,0],.2)]]),
 /* arena: three planets */ build([[.3,Sp(1.2,-3.2,0,0,.05)],[.2,Sp(.85,0,0,0,.05)],[.12,Rg(1.3,1.9,.5,.2)],[.1,Sp(.5,3.1,0,0,.05)],[.12,Ln([-3.2,0,0],[3.1,0,0],.05)],[.02,Sp(.18,1.6,1.1,0)],[.14,Ln([-3.2,-.8,0],[3.1,.8,0],.5)]]),
 /* mission: sun with rays */ build([[.4,Sp(1.3,0,0,0,.03)],[.4,Ra(1.6,3.2)],[.1,Rg(1.9,2,.3,0)],[.1,Rg(2.6,2.65,1,.4)]]),
 /* community: core + five satellites */ build([[.12,Sp(.5,0,0,0)],sat(0,2.2,.07),sat(1,2.2,.07),sat(2,2.2,.07),sat(3,2.2,.07),sat(4,2.2,.07),[.3,Rg(2.2,2.25,.99,0)],[.13,Rg(1.2,1.25,.4,.5)],[.1,Rg(3,3.1,.99,0)]]),
 /* cta: rocket */ build([[.3,Cy(.45,-1,.8)],[.15,Co(.45,.8,1.9)],[.05,Fin(0)],[.05,Fin(2.094)],[.05,Fin(4.188)],[.2,Co(.35,-1,-2.6)],[.1,Ln([0,-2.6,0],[0,-4.2,0],.5)],[.05,Sp(.17,0,.3,.46)],[.05,Rg(.5,.55,1.5708,0,0,-1,0)]])
];
/* where the object sits per stage: x,y,scale,spin,tilt-x,tilt-z */
var ST=[[3,.1,1,.12,.3,0],[3.2,0,1,.2,0,0],[3.8,.2,.75,.15,.2,0],[0,0,1.05,.04,0,0],[0,2.3,.55,0,.4,0],[3.2,0,.9,.1,0,0],[3.4,0,.95,.1,.3,0],[3.3,-.2,.95,0,0,-.45]];

/* ---------- three.js ---------- */
var theme=document.documentElement.dataset.theme||'dark',applyPts=function(){};
var gl,cur=0,burst=0,bs='idle',bt=0,dirty=true,lastKey='';
try{
  if(!window.THREE)throw 0;
  var R=new THREE.WebGLRenderer({canvas:$('#gl'),antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
  var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(42,1,.1,60);C.position.z=9;
  var cat=new Uint8Array(N),pos=new Float32Array(N*3),dirs=new Float32Array(N*3),rd=new Float32Array(N),col=new Float32Array(N*3);
  for(var i=0;i<N;i++){var u=Math.random()*2-1,a=Math.random()*TAU,q=Math.sqrt(1-u*u);dirs[i*3]=q*Math.cos(a);dirs[i*3+1]=u;dirs[i*3+2]=q*Math.sin(a);rd[i]=Math.random();
    var r=Math.random();cat[i]=r<.6?0:r<.88?1:2}
  var geo=new THREE.BufferGeometry(),pa=new THREE.BufferAttribute(pos,3);pa.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position',pa);geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  var pts=new THREE.Points(geo,new THREE.PointsMaterial({size:.02,vertexColors:true,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));
  pts.frustumCulled=false;
  var PD=[[.55,.62,1],[.46,.4,1],[.66,.9,.18]],PL=[[.22,.26,.78],[.35,.25,.9],[.38,.58,.04]];
  applyPts=function(th){var P=th==='light'?PL:PD,k=th==='light'?1:.8,m=pts.material;for(var i=0;i<N;i++){var c=P[cat[i]];col[i*3]=c[0]*k;col[i*3+1]=c[1]*k;col[i*3+2]=c[2]*k}geo.attributes.color.needsUpdate=true;m.blending=th==='light'?THREE.NormalBlending:THREE.AdditiveBlending;m.opacity=th==='light'?.75:.55;m.needsUpdate=true};
  applyPts(theme);var grp=new THREE.Group();grp.add(pts);S.add(grp);
  var rs=function(){R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()};rs();addEventListener('resize',rs);gl=true;
}catch(e){gl=false}
var last=0;
addEventListener('pointerdown',function(e){if(e.target.closest('a,button,nav,.film'))return;var n=performance.now();if(n-last<340&&bs==='idle'){bs='out';bt=n;$('#hint').style.opacity=0}last=n});

function frame(now,dt,t){
  cur+=(stageFloat()-cur)*(reduce?1:.07);
  var a=Math.min(SH.length-2,Math.floor(cur)),tt=Math.min(1,cur-a);
  if(bs==='out'){var p=Math.min(1,(now-bt)/1100);burst=1-Math.pow(1-p,3);if(p>=1){bs='hold';bt=now}}
  else if(bs==='hold'&&now-bt>900){bs='in';bt=now}
  else if(bs==='in'){var q=Math.min(1,(now-bt)/1800);burst=1-q*q*(3-2*q);if(q>=1){bs='idle';burst=0}}
  var idx=Math.round(cur);$('#cn').textContent=('0'+(idx+1)).slice(-2);$('#cl').textContent=NAMES[idx];
  $$('button',rail).forEach(function(b,i){b.classList.toggle('on',i===idx)});
  if(!gl)return;
  var key=a+'|'+tt.toFixed(3)+'|'+burst.toFixed(3);
  if(key!==lastKey){lastKey=key;var A=SH[a],B=SH[a+1];
    for(var i=0;i<N;i++){var e=Math.min(1,Math.max(0,tt*1.7-rd[i]*.7));e=e*e*(3-2*e);
      var sc=Math.sin(e*3.1416)*.8+burst*(5+rd[i]*12),j=i*3;
      pos[j]=A[j]+(B[j]-A[j])*e+dirs[j]*sc;pos[j+1]=A[j+1]+(B[j+1]-A[j+1])*e+dirs[j+1]*sc;pos[j+2]=A[j+2]+(B[j+2]-A[j+2])*e+dirs[j+2]*sc}
    pa.needsUpdate=true}
  var nw=innerWidth<760,P=ST[a],Q=ST[a+1],L=function(k){return P[k]+(Q[k]-P[k])*tt};
  var tx=nw?0:L(0),ty=nw?(L(1)>1?3.1:2.5):L(1),ts=L(2)*(nw?.62:1);
  grp.position.x+=(tx+mx*.5-grp.position.x)*.08;grp.position.y+=(ty-my*.4-grp.position.y)*.08;
  grp.scale.setScalar(grp.scale.x+(ts-grp.scale.x)*.1);
  grp.rotation.y+=L(3)*dt*(reduce?0:1);grp.rotation.x=L(4);grp.rotation.z=L(5);
  R.render(S,C)}

/* ---------- background: tiny orbits, tracks and planets ---------- */
var OP={dark:['168,230,46','118,101,255','200,208,255'],light:['91,138,8','100,80,230','60,70,140']};
var oc=$('#orb'),o2=oc.getContext('2d'),W=0,H=0,DP=1,orbs=[],stars=[];
function orsize(){DP=Math.min(devicePixelRatio,2);W=innerWidth;H=innerHeight;oc.width=W*DP;oc.height=H*DP;o2.setTransform(DP,0,0,DP,0,0)}
orsize();addEventListener('resize',orsize);
for(var i=0;i<11;i++)orbs.push({a:50+i*i*9+i*22,b:.34+(i%4)*.09,rot:i*.55,sp:(.5+Math.random()*.4)/Math.sqrt(1+i),ph:Math.random()*TAU,c:i%3});
for(var i=0;i<110;i++)stars.push([Math.random(),Math.random(),Math.random()*.6+.2]);
function orbit(t){
  o2.clearRect(0,0,W,H);
  stars.forEach(function(s){o2.fillStyle='rgba('+(theme==='light'?'50,55,120':'200,205,255')+','+(.15+.15*Math.sin(t+s[0]*40))*s[2]+')';o2.fillRect(s[0]*W,s[1]*H,1,1)});
  var cx=W*(nwide()?.62:.5)+mx*-24,cy=H*.5-scrollY*.04+my*-24;
  var LC=theme==='light'?'70,75,150':'140,150,255';o2.lineWidth=1;o2.strokeStyle='rgba('+LC+',.05)';
  for(var k=0;k<10;k++){var ang=k*TAU/10+t*.01;o2.beginPath();o2.moveTo(cx,cy);o2.lineTo(cx+Math.cos(ang)*W,cy+Math.sin(ang)*W);o2.stroke()}
  orbs.forEach(function(o){
    var oc2=OP[theme][o.c];o2.strokeStyle='rgba('+LC+(theme==='light'?',.16)':',.1)');o2.beginPath();o2.ellipse(cx,cy,o.a,o.a*o.b,o.rot,0,TAU);o2.stroke();
    var g=t*o.sp+o.ph;
    o2.strokeStyle='rgba('+oc2+',.4)';o2.beginPath();o2.ellipse(cx,cy,o.a,o.a*o.b,o.rot,g-.7,g);o2.stroke();
    var X=o.a*Math.cos(g),Y=o.a*o.b*Math.sin(g),c=Math.cos(o.rot),s=Math.sin(o.rot);
    o2.fillStyle='rgba('+oc2+',.95)';o2.beginPath();o2.arc(cx+X*c-Y*s,cy+X*s+Y*c,1.7,0,TAU);o2.fill()})}
function nwide(){return innerWidth>760}

/* ---------- moving letters: they flee the cursor ---------- */
var chs=[];
$$('[data-split]').forEach(function(el){
  el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
  (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType===3){var f=document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}
        var ws=document.createElement('span');ws.className='w';ws.setAttribute('aria-hidden','true');
        w.split('').forEach(function(ch){var s=document.createElement('span');s.className='ch';s.textContent=ch;ws.appendChild(s);chs.push({el:s,x:0,y:0,r:0})});f.appendChild(ws)});
      c.parentNode.replaceChild(f,c)}
    else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})})(el)});
function letters(now){
  if(reduce||now>act)return;
  chs.forEach(function(c){var b=c.el.getBoundingClientRect();if(b.bottom<-60||b.top>innerHeight+60)return;
    var cx=b.left+b.width/2-c.x,cy=b.top+b.height/2-c.y,dx=cx-px,dy=cy-py,d=Math.hypot(dx,dy),pu=Math.max(0,1-d/190);
    c.x+=(dx/(d||1)*pu*60-c.x)*.14;c.y+=(dy/(d||1)*pu*60-c.y)*.14;c.r+=(pu*(dx>0?1:-1)*24-c.r)*.14;
    c.el.style.transform='translate('+c.x.toFixed(1)+'px,'+c.y.toFixed(1)+'px) rotate('+c.r.toFixed(1)+'deg)'})}

/* ---------- how it works: 3D planet slider ---------- */
var PS=[
 {n:'DISCOVER',d:'Find a challenge that makes you want to build.',c:[[.03,.1,.34],[.08,.42,.68],[.4,.7,.32]],sc:2.1,band:0,atm:[.35,.65,1]},
 {n:'TEAM UP',d:'Find people who share your ambition.',c:[[.3,.18,.62],[.62,.5,.92],[.85,.95,.5]],sc:1.6,band:1,atm:[.7,.6,1],ring:1},
 {n:'BUILD',d:'Turn your idea into something people can use.',c:[[.22,.04,.02],[.82,.28,.07],[1,.78,.32]],sc:3,band:0,atm:[1,.5,.2]},
 {n:'SHIP',d:'Submit your work and take it to the arena.',c:[[.5,.62,.86],[.86,.92,1],[.3,.4,.78]],sc:1.8,band:1,atm:[.6,.8,1],moon:1}
];
var pst=$('#pst'),pcv=$('#plc'),pinfo=$('#pinfo'),PR=null,PSC,PC,pls=[],si=0,sp=0,pvis=false,pdrag=null,pcur=-1;
var PV='varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
var PF='uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 atm;uniform vec3 L;uniform float sc;uniform float band;uniform float al;uniform float t;varying vec3 vN;varying vec3 vP;'+
 'float hs(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}'+
 'float no(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hs(i),hs(i+vec3(1,0,0)),f.x),mix(hs(i+vec3(0,1,0)),hs(i+vec3(1,1,0)),f.x),f.y),mix(mix(hs(i+vec3(0,0,1)),hs(i+vec3(1,0,1)),f.x),mix(hs(i+vec3(0,1,1)),hs(i+vec3(1,1,1)),f.x),f.y),f.z);}'+
 'float fb(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*no(p);p*=2.03;a*=.5;}return s;}'+
 'void main(){vec3 p=vP;float n=band>.5?.5+.5*sin(p.y*sc*3.+fb(p*sc*.8+t*.02)*4.):fb(p*sc+t*.01);'+
 'vec3 c=mix(c1,c2,smoothstep(.3,.55,n));c=mix(c,c3,smoothstep(.58,.78,n));'+
 'vec3 N=normalize(vN);float d=max(dot(N,L),0.);float rim=pow(1.-max(N.z,0.),3.);'+
 'c=c*(.12+d*1.05)+atm*rim*(.25+d*.9);gl_FragColor=vec4(c,al);}';
var RF='uniform float al;varying vec3 vN;varying vec3 vP;void main(){float r=length(vP.xy);float s=.5+.5*sin(r*46.);s=s*.6+.4*step(.5,sin(r*17.));'+
 'float a=smoothstep(1.5,1.62,r)*(1.-smoothstep(2.35,2.5,r))*(.2+.6*s)*al;gl_FragColor=vec4(mix(vec3(.84,.95,.5),vec3(.7,.62,1.),s),a);}';
function pmat(p){var V=function(a){return{value:new THREE.Vector3(a[0],a[1],a[2])}};
  return new THREE.ShaderMaterial({uniforms:{c1:V(p.c[0]),c2:V(p.c[1]),c3:V(p.c[2]),atm:V(p.atm),L:{value:new THREE.Vector3(-.6,.5,.7).normalize()},sc:{value:p.sc},band:{value:p.band},al:{value:1},t:{value:0}},vertexShader:PV,fragmentShader:PF,transparent:true})}
try{
  if(!window.THREE)throw 0;
  PR=new THREE.WebGLRenderer({canvas:pcv,antialias:true,alpha:true});PR.setPixelRatio(Math.min(devicePixelRatio,2));
  PSC=new THREE.Scene();PC=new THREE.PerspectiveCamera(32,1,.1,50);PC.position.z=8.4;
  PS.forEach(function(p){var g=new THREE.Group(),mat=pmat(p),m=new THREE.Mesh(new THREE.SphereGeometry(1,64,48),mat),o={g:g,m:m,mat:mat};g.add(m);
    if(p.ring){var rm=new THREE.ShaderMaterial({uniforms:{al:{value:1}},vertexShader:PV,fragmentShader:RF,transparent:true,side:THREE.DoubleSide,depthWrite:false}),r=new THREE.Mesh(new THREE.RingGeometry(1.45,2.5,128),rm);r.rotation.x=1.25;r.rotation.y=.25;g.add(r);o.ring=rm}
    if(p.moon){var piv=new THREE.Group(),mmat=pmat({c:[[.3,.3,.34],[.6,.6,.64],[.8,.8,.85]],sc:3,band:0,atm:[.5,.5,.6]}),mm=new THREE.Mesh(new THREE.SphereGeometry(.22,32,24),mmat);mm.position.x=1.9;piv.add(mm);piv.rotation.x=.4;g.add(piv);o.moon=piv;o.mm=mmat}
    PSC.add(g);pls.push(o)});
  var prs=function(){var w=pst.clientWidth,h=pst.clientHeight;if(!w||!h)return;PR.setSize(w,h,false);PC.aspect=w/h;PC.updateProjectionMatrix()};
  prs();if(window.ResizeObserver)new ResizeObserver(prs).observe(pst);else addEventListener('resize',prs);
}catch(e){PR=null}
var pdots=$('#pdots');
PS.forEach(function(p,i){var b=document.createElement('button');b.setAttribute('aria-label',p.n);b.onclick=function(){var d=i-pidx();if(d>2)d-=4;if(d<-2)d+=4;si+=d};pdots.appendChild(b)});
function pidx(){return((Math.round(sp)%4)+4)%4}
$('#pprev').onclick=function(){si--};$('#pnext').onclick=function(){si++};
function pshow(i,now){var apply=function(){$('#pn').textContent='0'+(i+1);$('#pt').textContent=PS[i].n;$('#pd').textContent=PS[i].d;$$('button',pdots).forEach(function(b,k){b.classList.toggle('on',k===i)});pinfo.classList.remove('out')};
  if(pcur<0)apply();else{pinfo.classList.add('out');setTimeout(apply,200)}pcur=i}
pst.addEventListener('pointerdown',function(e){pdrag={x:e.clientX,b:sp,m:0};pst.setPointerCapture(e.pointerId)});
pst.addEventListener('pointermove',function(e){if(!pdrag)return;var dx=e.clientX-pdrag.x;pdrag.m=Math.max(pdrag.m,Math.abs(dx));sp=pdrag.b-dx/(pst.clientWidth/3.2);si=Math.round(sp)});
function pend(e){if(!pdrag)return;var m=pdrag.m,r=pst.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;pdrag=null;
  if(m<6){si=Math.round(sp);if(x<.34)si--;else if(x>.66)si++}else si=Math.round(sp)}
pst.addEventListener('pointerup',pend);pst.addEventListener('pointercancel',pend);
pst.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();si++}if(e.key==='ArrowLeft'){e.preventDefault();si--}});
if('IntersectionObserver' in window)new IntersectionObserver(function(en){pvis=en[0].isIntersecting}).observe(pst);else pvis=true;
pshow(0);
function planets(now,dt,t){
  if(!pvis)return;
  if(!pdrag)sp+=(si-sp)*(reduce?1:.09);
  var i0=pidx();if(i0!==pcur)pshow(i0,now);
  if(!PR)return;
  var asp=PC.aspect,X=asp<1?2.5:3.3;
  pls.forEach(function(o,i){var d=i-sp;d=(((d+2)%4)+4)%4-2;var ad=Math.abs(d),al=(1-.62*Math.min(1,ad))*(1-sm(1.3,1.95,ad));
    o.g.position.set(d*X,Math.sin(t*.8+i)*.08,-Math.min(ad,1.5)*1.4);o.g.scale.setScalar((1-.52*Math.min(1,ad))*(asp<1?.8:1));
    o.mat.uniforms.al.value=al;o.mat.uniforms.t.value=t;if(o.ring)o.ring.uniforms.al.value=al;if(o.mm)o.mm.uniforms.al.value=al;
    if(!reduce){o.m.rotation.y=t*.12*(1+i*.15);if(o.moon)o.moon.rotation.y=t*.6}});
  PR.render(PSC,PC)}

/* ---------- theme toggle: grainy icon dissolves between moon and sun ---------- */
var tb=$('#theme'),tc=$('#tc'),tx=tc.getContext('2d'),GN=520,MP=[],SP=[],TR=[],tk=theme==='light'?1:0,tg=tk,tlast=0,tfr=0;
(function(){var i,a,r,x,y,dd;
  while(MP.length<GN){a=Math.random()*TAU;r=14.5*Math.sqrt(Math.random());x=20+r*Math.cos(a);y=23+r*Math.sin(a);dd=Math.hypot(x-27,y-18)-12;
    if(dd>0&&Math.random()<.3+.7*Math.exp(-dd/5))MP.push([x,y])}
  for(i=0;i<GN;i++){if(i<300){a=Math.random()*TAU;r=8*Math.sqrt(Math.random());if(Math.random()>.45+.55*(r/8)){i--;continue}SP.push([22+r*Math.cos(a),22+r*Math.sin(a)])}
    else{a=Math.floor(Math.random()*8)*Math.PI/4;r=12+Math.random()*7;var j=(Math.random()-.5)*1.1;SP.push([22+r*Math.cos(a)-j*Math.sin(a),22+r*Math.sin(a)+j*Math.cos(a)])}}
  for(i=0;i<GN;i++){a=Math.random()*TAU;TR.push({r:Math.random(),dx:Math.cos(a),dy:Math.sin(a)})}})();
function themeIcon(now){
  var d=Math.min(.05,(now-tlast)/1000);tlast=now;tfr++;
  var moving=tk!==tg;if(moving){var s=d/1.1;tk+=tk<tg?s:-s;if(Math.abs(tk-tg)<=s)tk=tg}
  if(!moving&&tfr%3)return;
  tx.setTransform(2,0,0,2,0,0);tx.clearRect(0,0,44,44);
  var m=Math.min(1,Math.max(0,tk));tx.fillStyle='rgb('+Math.round(223+(232-223)*m)+','+Math.round(227+(137-227)*m)+','+Math.round(255+(12-255)*m)+')';
  for(var i=0;i<GN;i++){var e=Math.min(1,Math.max(0,tk*1.7-TR[i].r*.7));e=e*e*(3-2*e);var sc=Math.sin(e*3.1416)*9,A=MP[i],B=SP[i];
    tx.globalAlpha=.45+Math.random()*.55;tx.fillRect(A[0]+(B[0]-A[0])*e+TR[i].dx*sc+(Math.random()-.5)*.7,A[1]+(B[1]-A[1])*e+TR[i].dy*sc+(Math.random()-.5)*.7,1.15,1.15)}
  tx.globalAlpha=1}
function setThemeUI(next){tb.setAttribute('aria-pressed',next==='light');tb.setAttribute('aria-label','Switch to '+(next==='light'?'dark':'light')+' theme')}
setThemeUI(theme);
tb.addEventListener('click',function(){
  var next=theme==='dark'?'light':'dark',rc=tb.getBoundingClientRect(),x=rc.left+rc.width/2,y=rc.top+rc.height/2;tg=next==='light'?1:0;
  function ap(){theme=next;document.documentElement.dataset.theme=next;applyPts(next);setThemeUI(next);try{localStorage.setItem('cc-theme',next)}catch(e){}}
  if(document.startViewTransition&&!reduce){var vt=document.startViewTransition(ap);
    vt.ready.then(function(){var rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
      document.documentElement.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:1000,easing:'cubic-bezier(.6,0,.3,1)',pseudoElement:'::view-transition-new(root)'})})}
  else ap()});

/* ---------- main loop ---------- */
var prev=performance.now();
(function loop(now){var dt=Math.min(.05,(now-prev)/1000);prev=now;var t=now/1000;
  orbit(reduce?0:t);letters(now);frame(now,dt,t);planets(now,dt,t);themeIcon(now);requestAnimationFrame(loop)})(prev);

/* ---------- hover: 3D tilt on cards ---------- */
$$('.tilt').forEach(function(el){
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;el.style.transform='perspective(800px) rotateY('+(x-.5)*12+'deg) rotateX('+(.5-y)*12+'deg) translateZ(4px)'});
  el.addEventListener('pointerleave',function(){el.style.transform=''})});

/* ---------- film: plays when scrolled into view ---------- */
var film=$('#film'),vid=$('video',film);
function setPlay(on){film.classList.toggle('play',on);on?vid.play().catch(function(){film.classList.remove('play')}):vid.pause()}
film.addEventListener('click',function(){setPlay(vid.paused)});film.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();setPlay(vid.paused)}});
if('IntersectionObserver' in window)new IntersectionObserver(function(en){en.forEach(function(x){if(x.intersectionRatio>.6)setPlay(true);else if(!vid.paused)setPlay(false)})},{threshold:[0,.6]}).observe(film);

/* ---------- hidden menu: tap the star 3 times (or press M) ---------- */
var star=$('#star'),ring=$('#ring'),menu=$('#menu'),taps=0,tapT,CH='01<>/\\#@$%*+=';
function scramble(el){var o=el.dataset.o||(el.dataset.o=el.textContent),n=0,id=setInterval(function(){el.textContent=o.split('').map(function(c,i){return i<n||c===' '?c:CH[Math.random()*CH.length|0]}).join('');if(++n>o.length){clearInterval(id);el.textContent=o}},40)}
function openM(){document.body.classList.add('flash');setTimeout(function(){document.body.classList.remove('flash')},500);menu.hidden=false;void menu.offsetWidth;menu.classList.add('on');$$('.m',menu).forEach(function(m,i){setTimeout(function(){scramble(m)},200+i*120)});$('#close').focus()}
function closeM(){menu.classList.remove('on');setTimeout(function(){menu.hidden=true},700)}
star.addEventListener('click',function(){taps++;ring.style.strokeDashoffset=120-taps*40;clearTimeout(tapT);if(taps>=3){taps=0;ring.style.strokeDashoffset=120;openM()}else tapT=setTimeout(function(){taps=0;ring.style.strokeDashoffset=120},900)});
addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden)closeM();if((e.key==='m'||e.key==='M')&&menu.hidden&&!/input|textarea/i.test(e.target.tagName))openM()});
$('#close').addEventListener('click',closeM);
$$('.m',menu).forEach(function(m){m.addEventListener('mouseenter',function(){scramble(m)});m.addEventListener('click',closeM)});
setTimeout(function(){$('#hint').style.opacity=0},9000);
/* ---------- setup check: warns on screen if a file is missing/outdated or the CDN is unreachable ---------- */
(function(){function note(t,c,top){var d=document.createElement('div');d.setAttribute('role','alert');d.style.cssText='position:fixed;z-index:9999;left:12px;right:12px;'+(top?'top:12px':'bottom:12px')+';max-width:620px;margin:auto;padding:14px 18px;border-radius:12px;background:'+c+';color:#fff;font:600 14px/1.45 system-ui,sans-serif;box-shadow:0 10px 30px #0008';d.textContent=t;document.body.appendChild(d);setTimeout(function(){if(!top)d.remove()},9000)}
  if(!getComputedStyle(document.documentElement).getPropertyValue('--panel').trim())note('styles.css is missing or an old version. Copy the newest styles.css from the zip into the same folder as this page, then refresh.','#e5484d',true);
  if(!window.THREE)note('three.js did not load, so the 3D parts are off. Check your internet connection or ad-blocker, then refresh.','#8a5a00',false)})();
})();

document.addEventListener("mousemove", function(e) {
    document.body.style.setProperty("--mouse-x", e.clientX + "px");
    document.body.style.setProperty("--mouse-y", e.clientY + "px");
});