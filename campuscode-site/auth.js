(function(){
'use strict';
var NEXT='student.html';           // where "Open dashboard" goes after login
var page=document.body.dataset.page,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,TAU=6.2832;
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
var mx=0,my=0,px=-999,py=-999,act=0,theme=document.documentElement.dataset.theme||'dark',applyPts=function(){};
addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;px=e.clientX;py=e.clientY;act=performance.now()+1400});
$('#next')&&($('#next').href=NEXT);

/* ---------- 3D object: planet (login) / rocket (register), assembles on load, bursts on double-tap ---------- */
function rot(x,y,z,tx,tz){var y1=y*Math.cos(tx)-z*Math.sin(tx),z1=y*Math.sin(tx)+z*Math.cos(tx);return[x*Math.cos(tz)-y1*Math.sin(tz),x*Math.sin(tz)+y1*Math.cos(tz),z1]}
function Sp(r,x,y,z,b){return function(){var u=Math.random()*2-1,a=Math.random()*TAU,q=Math.sqrt(1-u*u),k=r*(1+(b||0)*Math.sin(u*5+a*2));return[x+k*q*Math.cos(a),y+k*u,z+k*q*Math.sin(a)]}}
function Rg(r1,r2,tx,tz,x,y,z){return function(){var a=Math.random()*TAU,r=r1+Math.random()*(r2-r1),v=rot(r*Math.cos(a),(Math.random()-.5)*.05,r*Math.sin(a),tx,tz);return[v[0]+(x||0),v[1]+(y||0),v[2]+(z||0)]}}
function Ln(a,b,j){return function(){var t=Math.random();return[a[0]+(b[0]-a[0])*t+(Math.random()-.5)*j,a[1]+(b[1]-a[1])*t+(Math.random()-.5)*j,a[2]+(b[2]-a[2])*t+(Math.random()-.5)*j]}}
function Cy(r,y0,y1){return function(){var a=Math.random()*TAU;return[r*Math.cos(a),y0+(y1-y0)*Math.random(),r*Math.sin(a)]}}
function Co(r0,y0,y1){return function(){var t=Math.random(),a=Math.random()*TAU,r=r0*(1-t);return[r*Math.cos(a),y0+(y1-y0)*t,r*Math.sin(a)]}}
function Fin(ang){return function(){var u=Math.random(),v=Math.random();if(u+v>1){u=1-u;v=1-v}var x=.45+u*.75,y=-1-v*.5+u*.5,c=Math.cos(ang),s=Math.sin(ang);return[x*c,y,x*s]}}
var N=innerWidth<760?4500:7000;
function build(parts){var o=new Float32Array(N*3),k=0,v;parts.forEach(function(p){var c=Math.round(N*p[0]);for(var j=0;j<c&&k<N;j++,k++){v=p[1]();o[k*3]=v[0];o[k*3+1]=v[1];o[k*3+2]=v[2]}});for(;k<N;k++){o[k*3]=o[k*3-3];o[k*3+1]=o[k*3-2];o[k*3+2]=o[k*3-1]}return o}
var SHAPE=page==='login'
 ?build([[.52,Sp(1.45,0,0,0,.05)],[.09,Sp(.38,2.5,.9,.5)],[.04,Sp(.17,-2.4,-1,.3)],[.25,Rg(2.1,3,.55,.25)],[.10,Rg(3.55,3.6,.9,.1)]])
 :build([[.3,Cy(.45,-1,.8)],[.15,Co(.45,.8,1.9)],[.05,Fin(0)],[.05,Fin(2.094)],[.05,Fin(4.188)],[.2,Co(.35,-1,-2.6)],[.1,Ln([0,-2.6,0],[0,-4.2,0],.5)],[.05,Sp(.17,0,.3,.46)],[.05,Rg(.5,.55,1.5708,0,0,-1,0)]]);
var gl=false,burst=0,bs='idle',bt=0,intro=0,R,S,C,grp,pts,pa,pos,dirs,rd,cat,col,geo,last=0;
try{
  if(!window.THREE)throw 0;
  R=new THREE.WebGLRenderer({canvas:$('#gl'),antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
  S=new THREE.Scene();C=new THREE.PerspectiveCamera(42,1,.1,60);C.position.z=9;
  pos=new Float32Array(N*3);dirs=new Float32Array(N*3);rd=new Float32Array(N);cat=new Uint8Array(N);col=new Float32Array(N*3);
  for(var i=0;i<N;i++){var u=Math.random()*2-1,a=Math.random()*TAU,q=Math.sqrt(1-u*u),r=Math.random();dirs[i*3]=q*Math.cos(a);dirs[i*3+1]=u;dirs[i*3+2]=q*Math.sin(a);rd[i]=Math.random();cat[i]=r<.6?0:r<.88?1:2}
  geo=new THREE.BufferGeometry();pa=new THREE.BufferAttribute(pos,3);pa.setUsage(THREE.DynamicDrawUsage);geo.setAttribute('position',pa);geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  pts=new THREE.Points(geo,new THREE.PointsMaterial({size:.02,vertexColors:true,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));pts.frustumCulled=false;
  grp=new THREE.Group();grp.add(pts);S.add(grp);
  var PD=[[.55,.62,1],[.46,.4,1],[.66,.9,.18]],PL=[[.22,.26,.78],[.35,.25,.9],[.38,.58,.04]];
  applyPts=function(th){var P=th==='light'?PL:PD,k=th==='light'?1:.8,m=pts.material;for(var i=0;i<N;i++){var c=P[cat[i]];col[i*3]=c[0]*k;col[i*3+1]=c[1]*k;col[i*3+2]=c[2]*k}geo.attributes.color.needsUpdate=true;m.blending=th==='light'?THREE.NormalBlending:THREE.AdditiveBlending;m.opacity=th==='light'?.75:.55;m.needsUpdate=true};
  applyPts(theme);
  var rs=function(){R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()};rs();addEventListener('resize',rs);gl=true;
}catch(e){gl=false}
addEventListener('pointerdown',function(e){if(e.target.closest('a,button,input,select,label,form'))return;var n=performance.now();if(n-last<340&&bs==='idle'){bs='out';bt=n}last=n});
function obj(now,dt,t){
  if(!gl)return;
  intro=Math.min(1,intro+dt/(reduce?.01:2.6));
  if(bs==='out'){var p=Math.min(1,(now-bt)/1100);burst=1-Math.pow(1-p,3);if(p>=1){bs='hold';bt=now}}
  else if(bs==='hold'&&now-bt>900){bs='in';bt=now}
  else if(bs==='in'){var q=Math.min(1,(now-bt)/1800);burst=1-q*q*(3-2*q);if(q>=1){bs='idle';burst=0}}
  for(var i=0;i<N;i++){var e=Math.min(1,Math.max(0,intro*1.7-rd[i]*.7));e=e*e*(3-2*e);var sc=(1-e)*(1-e)*9+burst*(5+rd[i]*12),j=i*3;
    pos[j]=SHAPE[j]+dirs[j]*sc;pos[j+1]=SHAPE[j+1]+dirs[j+1]*sc;pos[j+2]=SHAPE[j+2]+dirs[j+2]*sc}
  pa.needsUpdate=true;
  var nw=innerWidth<980,tx=nw?0:.5,ty=nw?3:(page==='login'?0:-.1);
  grp.position.x+=(tx+mx*.5-grp.position.x)*.06;grp.position.y+=(ty-my*.4-grp.position.y)*.06;grp.scale.setScalar(nw?.55:.95);
  if(page==='login'){grp.rotation.y=t*.15+mx;grp.rotation.x=.3+my*.4}else{grp.rotation.y=t*.25+mx;grp.rotation.z=-.45;grp.position.y+=Math.sin(t*1.2)*.004}
  R.render(S,C)}

/* ---------- background orbits ---------- */
var OP={dark:['168,230,46','118,101,255','200,208,255'],light:['91,138,8','100,80,230','60,70,140']};
var oc=$('#orb'),o2=oc.getContext('2d'),W=0,H=0,orbs=[],stars=[];
function orsize(){var D=Math.min(devicePixelRatio,2);W=innerWidth;H=innerHeight;oc.width=W*D;oc.height=H*D;o2.setTransform(D,0,0,D,0,0)}orsize();addEventListener('resize',orsize);
for(var i=0;i<11;i++)orbs.push({a:50+i*i*9+i*22,b:.34+(i%4)*.09,rot:i*.55,sp:(.5+Math.random()*.4)/Math.sqrt(1+i),ph:Math.random()*TAU,c:i%3});
for(var i=0;i<110;i++)stars.push([Math.random(),Math.random(),Math.random()*.6+.2]);
function orbit(t){
  o2.clearRect(0,0,W,H);var L=theme==='light',LC=L?'70,75,150':'140,150,255';
  stars.forEach(function(s){o2.fillStyle='rgba('+(L?'50,55,120':'200,205,255')+','+(.15+.15*Math.sin(t+s[0]*40))*s[2]+')';o2.fillRect(s[0]*W,s[1]*H,1,1)});
  var cx=W*.55+mx*-24,cy=H*.5-scrollY*.04+my*-24;o2.lineWidth=1;o2.strokeStyle='rgba('+LC+',.05)';
  for(var k=0;k<10;k++){var an=k*TAU/10+t*.01;o2.beginPath();o2.moveTo(cx,cy);o2.lineTo(cx+Math.cos(an)*W,cy+Math.sin(an)*W);o2.stroke()}
  orbs.forEach(function(o){var c2=OP[theme][o.c];o2.strokeStyle='rgba('+LC+(L?',.16)':',.1)');o2.beginPath();o2.ellipse(cx,cy,o.a,o.a*o.b,o.rot,0,TAU);o2.stroke();
    var g=t*o.sp+o.ph;o2.strokeStyle='rgba('+c2+',.4)';o2.beginPath();o2.ellipse(cx,cy,o.a,o.a*o.b,o.rot,g-.7,g);o2.stroke();
    var X=o.a*Math.cos(g),Y=o.a*o.b*Math.sin(g),c=Math.cos(o.rot),s=Math.sin(o.rot);o2.fillStyle='rgba('+c2+',.95)';o2.beginPath();o2.arc(cx+X*c-Y*s,cy+X*s+Y*c,1.7,0,TAU);o2.fill()})}

/* ---------- letters that flee the cursor ---------- */
var chs=[];
$$('[data-split]').forEach(function(el){el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
  (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}
      var ws=document.createElement('span');ws.className='w';ws.setAttribute('aria-hidden','true');w.split('').forEach(function(ch){var s=document.createElement('span');s.className='ch';s.textContent=ch;ws.appendChild(s);chs.push({el:s,x:0,y:0,r:0})});f.appendChild(ws)});c.parentNode.replaceChild(f,c)}
    else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})})(el)});
function letters(now){if(reduce||now>act)return;
  chs.forEach(function(c){var b=c.el.getBoundingClientRect();if(b.bottom<-60||b.top>innerHeight+60)return;
    var cx=b.left+b.width/2-c.x,cy=b.top+b.height/2-c.y,dx=cx-px,dy=cy-py,d=Math.hypot(dx,dy),pu=Math.max(0,1-d/190);
    c.x+=(dx/(d||1)*pu*60-c.x)*.14;c.y+=(dy/(d||1)*pu*60-c.y)*.14;c.r+=(pu*(dx>0?1:-1)*24-c.r)*.14;
    c.el.style.transform='translate('+c.x.toFixed(1)+'px,'+c.y.toFixed(1)+'px) rotate('+c.r.toFixed(1)+'deg)'})}

/* ---------- theme toggle: grainy moon <-> sun ---------- */
function sm(a,b,x){x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)}
var tb=$('#theme'),tc=$('#tc'),tx=tc.getContext('2d'),GN=520,MP=[],SP=[],TR=[],tk=theme==='light'?1:0,tg=tk,tlast=0,tfr=0;
(function(){var i,a,r,x,y,dd;
  while(MP.length<GN){a=Math.random()*TAU;r=14.5*Math.sqrt(Math.random());x=20+r*Math.cos(a);y=23+r*Math.sin(a);dd=Math.hypot(x-27,y-18)-12;if(dd>0&&Math.random()<.3+.7*Math.exp(-dd/5))MP.push([x,y])}
  for(i=0;i<GN;i++){if(i<300){a=Math.random()*TAU;r=8*Math.sqrt(Math.random());if(Math.random()>.45+.55*(r/8)){i--;continue}SP.push([22+r*Math.cos(a),22+r*Math.sin(a)])}
    else{a=Math.floor(Math.random()*8)*Math.PI/4;r=12+Math.random()*7;var j=(Math.random()-.5)*1.1;SP.push([22+r*Math.cos(a)-j*Math.sin(a),22+r*Math.sin(a)+j*Math.cos(a)])}}
  for(i=0;i<GN;i++){a=Math.random()*TAU;TR.push({r:Math.random(),dx:Math.cos(a),dy:Math.sin(a)})}})();
function themeIcon(now){var d=Math.min(.05,(now-tlast)/1000);tlast=now;tfr++;var moving=tk!==tg;if(moving){var s=d/1.1;tk+=tk<tg?s:-s;if(Math.abs(tk-tg)<=s)tk=tg}
  if(!moving&&tfr%3)return;tx.setTransform(2,0,0,2,0,0);tx.clearRect(0,0,44,44);
  var m=Math.min(1,Math.max(0,tk));tx.fillStyle='rgb('+Math.round(223+9*m)+','+Math.round(227-90*m)+','+Math.round(255-243*m)+')';
  for(var i=0;i<GN;i++){var e=Math.min(1,Math.max(0,tk*1.7-TR[i].r*.7));e=e*e*(3-2*e);var sc=Math.sin(e*3.1416)*9,A=MP[i],B=SP[i];
    tx.globalAlpha=.45+Math.random()*.55;tx.fillRect(A[0]+(B[0]-A[0])*e+TR[i].dx*sc+(Math.random()-.5)*.7,A[1]+(B[1]-A[1])*e+TR[i].dy*sc+(Math.random()-.5)*.7,1.15,1.15)}tx.globalAlpha=1}
function setThemeUI(n){tb.setAttribute('aria-pressed',n==='light');tb.setAttribute('aria-label','Switch to '+(n==='light'?'dark':'light')+' theme')}setThemeUI(theme);
tb.addEventListener('click',function(){var next=theme==='dark'?'light':'dark',rc=tb.getBoundingClientRect(),x=rc.left+rc.width/2,y=rc.top+rc.height/2;tg=next==='light'?1:0;
  function ap(){theme=next;document.documentElement.dataset.theme=next;applyPts(next);setThemeUI(next);try{localStorage.setItem('cc-theme',next)}catch(e){}}
  if(document.startViewTransition&&!reduce){var vt=document.startViewTransition(ap);vt.ready.then(function(){var rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    document.documentElement.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:1000,easing:'cubic-bezier(.6,0,.3,1)',pseudoElement:'::view-transition-new(root)'})})}else ap()});

var prev=performance.now();
(function loop(now){var dt=Math.min(.05,(now-prev)/1000);prev=now;orbit(reduce?0:now/1000);letters(now);obj(now,dt,now/1000);themeIcon(now);requestAnimationFrame(loop)})(prev);

/* ---------- form: captcha, validation, mock submit (swap the setTimeout for a real API call) ---------- */
var f=$('#f'),stat=$('#stat'),stl=$('#stl'),go=$('#go'),cap=$('#cap'),capCode='';
function drawCap(){var c=cap.getContext('2d'),w=cap.width,h=cap.height,i;capCode='';c.fillStyle='#f3f3f8';c.fillRect(0,0,w,h);
  for(i=0;i<5;i++){var d=Math.floor(Math.random()*10);capCode+=d;c.save();c.translate(36+i*55,h/2+(Math.random()-.5)*14);c.rotate((Math.random()-.5)*.6);c.font='800 62px Sora,Arial,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='hsl('+Math.random()*360+',70%,52%)';c.fillText(d,0,0);c.strokeStyle='#1118';c.lineWidth=1.5;c.strokeText(d,0,0);c.restore()}
  for(i=0;i<4;i++){c.strokeStyle='hsl('+Math.random()*360+',70%,50%)';c.lineWidth=2;c.beginPath();c.moveTo(0,Math.random()*h);c.bezierCurveTo(w*.3,Math.random()*h,w*.6,Math.random()*h,w,Math.random()*h);c.stroke()}
  for(i=0;i<70;i++){c.fillStyle='rgba(0,0,0,.25)';c.fillRect(Math.random()*w,Math.random()*h,2,2)}}
drawCap();$('#capn').onclick=function(){drawCap();$('#code').value='';setErr($('#code'),'');status()};
var V={name:function(v){return v.trim().length>=2?'':'Enter your full name.'},
  email:function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())?'':'Enter a valid email address.'},
  pw:function(v){return v.length>=8?'':'Use at least 8 characters.'},pwl:function(v){return v?'':'Enter your password.'},
  pw2:function(v){return v&&v===$('#pw').value?'':'Passwords do not match.'},
  code:function(v){return v===capCode?'':'Code does not match. Try a new one.'},age:function(){return $('#age').checked?'':'Please confirm your age.'}};
function msg(el){return V[el.dataset.v](el.value)}
function setErr(el,m){var fl=el.closest('.afld'),e=$('.aerr',fl),box=el.closest('.ain');if(e)e.textContent=m||'';if(box)box.classList.toggle('bad',!!m);el.setAttribute('aria-invalid',m?'true':'false')}
function valid(show){var ok=true,first=null;$$('[data-v]',f).forEach(function(el){var m=msg(el);if(m){ok=false;if(!first)first=el}if(show)setErr(el,m)});if(show&&first)first.focus();return ok}
function status(){var ok=valid(false);if(stat.dataset.s==='busy'||stat.dataset.s==='done')return;stat.dataset.s=ok?'ready':'wait';stl.textContent=ok?'READY':'WAITING'}
f.addEventListener('input',function(e){var el=e.target;if(el.dataset&&el.dataset.v&&el.getAttribute('aria-invalid')==='true')setErr(el,msg(el));status()});
f.addEventListener('change',status);
$$('.show').forEach(function(b){b.onclick=function(){var i=$('#'+b.dataset.t),h=i.type==='password';i.type=h?'text':'password';b.textContent=h?'HIDE':'SHOW'}});
function busy(on,label){stat.dataset.s=on?'busy':'wait';stl.textContent=label;go.disabled=on}
function pane(hide,show){hide.hidden=true;show.hidden=false;var h=$('.big',show)||$('h2',show);h&&h.focus&&0}
f.addEventListener('submit',function(e){e.preventDefault();
  if(!valid(true)){f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake');stat.dataset.s='wait';stl.textContent='CHECK FIELDS';return}
  busy(true,page==='login'?'CHECKING':'SENDING');
  setTimeout(function(){stat.dataset.s='done';stl.textContent=page==='login'?'ACCESS GRANTED':'CODE SENT';go.disabled=false;
    setTimeout(function(){pane(f,page==='login'?$('#ok'):$('#vf'));var first=$('#otp input');first&&first.focus()},550)},1300)});
$('#forgot')&&($('#forgot').onclick=function(e){e.preventDefault();stl.textContent='RESET LINK (DEMO)'});

/* ---------- register: 6-digit verification step ---------- */
var vf=$('#vf');
if(vf){var ins=$$('#otp input');
  ins.forEach(function(el,i){el.addEventListener('input',function(){el.value=el.value.replace(/\D/g,'').slice(0,1);if(el.value&&ins[i+1])ins[i+1].focus();$('#verr').textContent=''});
    el.addEventListener('keydown',function(e){if(e.key==='Backspace'&&!el.value&&ins[i-1])ins[i-1].focus()});
    el.addEventListener('paste',function(e){var t=(e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,6);if(!t)return;e.preventDefault();t.split('').forEach(function(d,k){ins[k].value=d});(ins[Math.min(t.length,5)]).focus()})});
  vf.addEventListener('submit',function(e){e.preventDefault();var code=ins.map(function(i){return i.value}).join('');
    if(code.length<6){$('#verr').textContent='Enter all 6 digits.';return}
    vf.hidden=true;$('#ok').hidden=false});
  $('#resend').onclick=function(e){e.preventDefault();$('#vmsg').textContent='New code sent (demo). Any 6 digits work.'}}
/* ---------- setup check: warns on screen if a file is missing/outdated or the CDN is unreachable ---------- */
(function(){function note(t,c,top){var d=document.createElement('div');d.setAttribute('role','alert');d.style.cssText='position:fixed;z-index:9999;left:12px;right:12px;'+(top?'top:12px':'bottom:12px')+';max-width:620px;margin:auto;padding:14px 18px;border-radius:12px;background:'+c+';color:#fff;font:600 14px/1.45 system-ui,sans-serif;box-shadow:0 10px 30px #0008';d.textContent=t;document.body.appendChild(d);setTimeout(function(){if(!top)d.remove()},9000)}
  if(!getComputedStyle(document.documentElement).getPropertyValue('--panel').trim())note('styles.css is missing or an old version. Copy the newest styles.css from the zip into the same folder as this page, then refresh.','#e5484d',true);
  if(!window.THREE)note('three.js did not load, so the 3D parts are off. Check your internet connection or ad-blocker, then refresh.','#8a5a00',false)})();
})();
