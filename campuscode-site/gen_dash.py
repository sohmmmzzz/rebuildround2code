# Generates student.html (Overview), events.html and my-events.html. The page content is rendered by dash.js.
IC={
'overview':'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
'trophy':'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
'clock':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
'sparkle':'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
'award':'<circle cx="12" cy="9" r="5"/><path d="M9 13.5L8 21l4-2 4 2-1-7.5"/>',
'id':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h4M7 14h4M15 10h2M15 14h2"/>',
'bot':'<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>',
'book':'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM8 7h7"/>',
'bell':'<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20a2 2 0 0 0 4 0"/>',
'help':'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01"/>',
'user':'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
'refresh':'<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
'menu':'<path d="M4 7h16M4 12h16M4 17h16"/>'}
svg=lambda k:'<svg viewBox="0 0 24 24" aria-hidden="true">%s</svg>'%IC[k]
NAV=[('Overview','overview','student.html','overview'),('Events','trophy','events.html','events'),('My Events','clock','my-events.html','my-events'),('HackMate AI','sparkle','#',None),('IdeaCheck AI','sparkle','#',None),('Certificates','award','#',None),('Digital Card','id','#',None),('RuleBot AI','bot','#',None,'AI'),('Student Guide','book','#',None),('Official Communication','bell','#',None),('Notifications','bell','#',None),('Help & Support','help','#',None),('Profile','user','#',None)]
def nav(cur):
    o=''
    for n in NAV:
        lab,ic,href,route=n[:4];tag='<em>%s</em>'%n[4] if len(n)>4 else ''
        o+='<a href="%s"%s class="%s">%s%s%s</a>'%(href,' data-route="%s"'%route if route else ' data-soon',' on' if route==cur else '',svg(ic),lab,tag)
    return o
T={'overview':'OVERVIEW','events':'EVENTS','my-events':'MY EVENTS'}
def page(cur,file):
    return '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>%(t)s – CampusCode Student</title>
<script>try{if(localStorage.getItem("cc-theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}</script>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800;900&family=Sora:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="dash.css">
<link rel="stylesheet" href="polish.css">
</head>
<body class="d" data-page="%(cur)s">
<canvas id="orb" aria-hidden="true"></canvas>
<div class="dshell">
<aside class="side" id="side">
  <a class="logo" href="student.html"><i><b></b><b></b><b></b></i><span><strong>CAMPUSCODE</strong><small>HACKATHON ARENA</small></span></a>
  <div class="slabel">WORKSPACE</div>
  <nav class="snav" aria-label="Student navigation">%(nav)s</nav>
  <div class="sacct"><small>ACCOUNT</small><div class="suser"><span class="av">SK</span><div>Soham Kiran Patil<small>STUDENT</small></div></div></div>
</aside>
<div class="sback" id="sback"></div>
<div class="dmain">
  <header class="dtop">
    <div style="display:flex;gap:14px;align-items:center"><button class="ibtn mbtn" id="mbtn" aria-label="Open menu">%(menu)s</button><div class="dcrumb"><small>CAMPUSCODE / STUDENT</small><b id="ptitle">%(t)s</b></div></div>
    <div class="dact">
      <button class="ibtn" id="bell" aria-label="Notifications">%(bell)s<span class="nb" id="nb">2</span></button>
      <div class="nd" id="nd" hidden></div>
      <button class="rbtn" id="rf">%(ref)s<span>REFRESH</span></button>
      <button class="theme" id="theme" aria-label="Switch to light theme" aria-pressed="false"><canvas id="tc" width="88" height="88"></canvas></button>
      <div class="pchip"><span class="av">SK</span><span>Soham Kiran Patil</span></div>
    </div>
  </header>
  <main class="dview" id="view"></main>
</div>
</div>
<div class="ov" id="ov" hidden></div>
<div class="toasts" id="toasts" aria-live="polite"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="dash.js"></script>
</body>
</html>
'''%dict(t=T[cur],cur=cur,nav=nav(cur),menu=svg('menu'),bell=svg('bell'),ref=svg('refresh'))
for c,f in (('overview','student.html'),('events','events.html'),('my-events','my-events.html')): open(f,'w').write(page(c,f))
print('generated')
