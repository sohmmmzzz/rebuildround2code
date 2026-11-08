# Generates login.html and register.html (edit here, or edit the generated files directly).
HEAD='''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>%(title)s – CampusCode</title>
<script>try{if(localStorage.getItem("cc-theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}</script>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800;900&family=Sora:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="auth.css">
<link rel="stylesheet" href="polish.css">
</head>
<body data-page="%(page)s">
<canvas id="orb" aria-hidden="true"></canvas>
<canvas id="gl" aria-hidden="true"></canvas>
<header class="nav">
  <a class="logo" href="index.html"><i><b></b><b></b><b></b></i><span><strong>CAMPUSCODE</strong><small>HACKATHON ARENA</small></span></a>
  <div class="act"><button class="theme" id="theme" aria-label="Switch to light theme" aria-pressed="false"><canvas id="tc" width="88" height="88"></canvas></button><a class="login" href="index.html">← BACK TO HOME</a></div>
</header>
<main class="auth">
'''
FOOT='''</main>
<div class="afoot"><span>CAMPUSCODE © 2026</span><span>LEARN · BUILD · COMPETE · SHIP</span><span>ALL SYSTEMS OPERATIONAL</span></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="auth.js"></script>
</body>
</html>
'''
CAP='''<div class="afld"><span>CAPTCHA</span><div class="cap"><canvas id="cap" width="300" height="108" role="img" aria-label="Captcha image with 5 digits"></canvas><button type="button" id="capn">↻ NEW</button></div><div class="ain"><input id="code" data-v="code" inputmode="numeric" maxlength="5" autocomplete="off" placeholder="Enter the code above" aria-label="Captcha code"></div><small class="aerr"></small></div>'''
STAT='''<div class="astat" id="stat" data-s="wait" role="status"><div class="mark"><i></i><i></i><i></i></div><span class="zz">Zzz</span><b id="stl">WAITING</b><em class="bar"></em></div>'''
def fld(label,id,v,icon,ph,typ='text',ac='off',pw=False):
    show='<button type="button" class="show" data-t="%s">SHOW</button>'%id if pw else ''
    return '<label class="afld"><span>%s</span><div class="ain"><i>%s</i><input id="%s" data-v="%s" type="%s" autocomplete="%s" placeholder="%s">%s</div><small class="aerr"></small></label>'%(label,icon,id,v,typ,ac,ph,show)

login=HEAD%dict(title='Login',page='login')+'''<section class="aleft">
  <p class="acrumb"><i></i>CAMPUSCODE / AUTHENTICATION</p>
  <div class="arow"><span>ACCESS</span><span>01 / 02</span></div>
  <h1 data-split>ENTER<br>THE<br><span class="out">ARENA.</span></h1>
  <p class="adesc">Sign in to continue building, collaborating and competing with the CampusCode community.</p>
  <div class="atiles"><div class="atile"><small>01</small><b>BUILD</b></div><div class="atile"><small>02</small><b>COMPETE</b></div><div class="atile"><small>03</small><b>SHIP</b></div></div>
  <div class="arow foot"><span><i></i>AUTHENTICATION READY</span><span>SECURE ACCESS</span><span>2026</span></div>
</section>
<section class="acard">
  <form id="f" class="pane" novalidate>
    <div class="achead"><span>EXISTING ACCOUNT</span><span>CC 01</span></div>
    <h2 data-split>LOGIN</h2><p class="asub">Access your CampusCode account.</p>
    '''+fld('EMAIL ADDRESS','email','email','@','you@example.com','email','email')+'''
    '''+fld('PASSWORD','pw','pwl','•','Enter your password','password','current-password',True)+'''
    '''+CAP+STAT+'''
    <button class="abtn" id="go" type="submit"><span>LOGIN</span><b>↗</b></button>
    <div class="alinks"><a href="#" id="forgot">FORGOT PASSWORD?</a></div>
    <div class="alinks top"><span>DON’T HAVE AN ACCOUNT?</span><a href="register.html">CREATE ACCOUNT →</a></div>
  </form>
  <div class="pane" id="ok" hidden><p class="label">CC 01 / ACCESS</p><h2 class="big">ACCESS GRANTED.</h2><p class="okp">You’re in. This is a front-end demo, so nothing was sent anywhere.</p><a class="abtn" id="next" href="student.html"><span>OPEN DASHBOARD</span><b>↗</b></a></div>
  <div class="acap"><span>AUTH / 2026</span><span>SECURE LOGIN</span></div>
</section>
'''+FOOT

register=HEAD%dict(title='Register',page='register')+'''<section class="aleft">
  <p class="acrumb"><i></i>CAMPUSCODE / REGISTRATION</p>
  <div class="arow"><span>CREATE</span><span>02 / 02</span></div>
  <h1 data-split>JOIN<br>THE<br><span class="out">ARENA.</span></h1>
  <p class="adesc">Create your CampusCode identity and become part of a student ecosystem designed around ideas, teams, technology and competition.</p>
  <div class="atiles">
    <div class="atile"><small><span>01</span><span>IDENTITY</span></small><b>CREATE</b><p>Build your student profile and enter the CampusCode ecosystem.</p></div>
    <div class="atile"><small><span>02</span><span>TEAM</span></small><b>COLLABORATE</b><p>Find teammates and build projects together.</p></div>
    <div class="atile"><small><span>03</span><span>ARENA</span></small><b>COMPETE</b><p>Join hackathons and turn ideas into submissions.</p></div>
  </div>
  <div class="arow foot"><span><i></i>REGISTRATION OPEN</span><span>STUDENT INNOVATION NETWORK</span><span>2026</span></div>
</section>
<section class="acard">
  <form id="f" class="pane" novalidate>
    <div class="achead"><span>NEW ACCOUNT</span><span>CC 02</span></div>
    <h2 data-split>REGISTER</h2><p class="asub">Create your CampusCode account.</p>
    '''+fld('FULL NAME','name','name','◇','Your full name','text','name')+'''
    '''+fld('EMAIL ADDRESS','email','email','@','you@example.com','email','email')+'''
    <label class="afld"><span>ACCOUNT TYPE</span><div class="ain"><i>🎓</i><select id="type" aria-label="Account type"><option>STUDENT</option></select></div></label>
    <p class="anote">Organizer? Accounts are created by our team. Contact <a href="mailto:campuscode@gmail.com">campuscode@gmail.com</a></p>
    '''+fld('PASSWORD','pw','pw','•','Create a password','password','new-password',True)+'''
    '''+fld('CONFIRM PASSWORD','pw2','pw2','•','Repeat your password','password','new-password',True)+'''
    '''+CAP+'''
    <div class="afld"><label class="acheck"><input type="checkbox" id="age" data-v="age"><span>I confirm that I am <u>18 years of age or older</u>.</span></label><small class="aerr"></small></div>
    '''+STAT+'''
    <button class="abtn" id="go" type="submit"><span>SEND VERIFICATION CODE</span><b>↗</b></button>
    <div class="alinks top"><span>ALREADY HAVE AN ACCOUNT?</span><a href="login.html">LOGIN →</a></div>
  </form>
  <form class="pane" id="vf" hidden novalidate>
    <div class="achead"><span>VERIFY EMAIL</span><span>CC 02</span></div>
    <h2 class="big">ENTER THE CODE.</h2><p class="okp" id="vmsg">We sent a 6-digit code to your email. Demo mode: any 6 digits work.</p>
    <div class="otp" id="otp"><input inputmode="numeric" maxlength="1" aria-label="Digit 1"><input inputmode="numeric" maxlength="1" aria-label="Digit 2"><input inputmode="numeric" maxlength="1" aria-label="Digit 3"><input inputmode="numeric" maxlength="1" aria-label="Digit 4"><input inputmode="numeric" maxlength="1" aria-label="Digit 5"><input inputmode="numeric" maxlength="1" aria-label="Digit 6"></div>
    <small class="aerr" id="verr"></small>
    <button class="abtn" type="submit"><span>VERIFY AND CREATE ACCOUNT</span><b>↗</b></button>
    <div class="alinks"><a href="#" id="resend">RESEND CODE</a></div>
  </form>
  <div class="pane" id="ok" hidden><p class="label">CC 02 / WELCOME</p><h2 class="big">ACCOUNT CREATED.</h2><p class="okp">Welcome to the arena. This is a front-end demo, so nothing was sent anywhere.</p><a class="abtn" href="login.html"><span>GO TO LOGIN</span><b>↗</b></a></div>
  <div class="acap"><span>AUTH / 2026</span><span>SECURE REGISTRATION</span></div>
</section>
'''+FOOT
open('login.html','w').write(login);open('register.html','w').write(register);print('generated')
