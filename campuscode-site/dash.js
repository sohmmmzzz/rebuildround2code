(function () {
    'use strict';

    var SPA = !!window.CC_SPA;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var TAU = 6.2832;

    var $ = function (s, c) {
        return (c || document).querySelector(s);
    };

    var $$ = function (s, c) {
        return [].slice.call((c || document).querySelectorAll(s));
    };

    var theme = document.documentElement.dataset.theme || 'dark';
    var USER = { first: 'Soham' };

    /* Mock data */

    var REBUILD = "ReBuild '26 is an individual dashboard-recreation hackathon by CampusCode. You participate alone, but you must create a team name for tracking and use it on your Unstop registration, the CampusCode portal, and every submission. Round 1 (Friday, 6 Nov, morning to 10 PM): Recreate the CampusCode user flow faithfully — Dashboard, Login, Register, and Student dashboard — and submit your demo any time till 10 PM. Round 2 (Saturday, 7 Nov, top performers from Round 1 only): Build a complete new UI in CampusCode's vibe. Frontend only, mock data is fine. No presentation round. Prizes: Winner certificate + CampusCode internship with ₹15,000 stipend, runner-up certificate, and participation certificates for all. Sunday, 8 Nov (Diwali) is free. This is a paid event (₹50 on Unstop). Paid students receive an invite code — enter it when you join this event on the portal.";

    var EV = [
        {
            key: 're',
            id: 'e2798ce3-a1b5-4806-9147-4d9f10c52ef1',
            reg: 'a67cd83c-3525-41cf-bceb-39ce2e21f25a',
            team: 'CODEAGAINAGAIN',
            ini: 'RE',
            title: "ReBuild '26",
            cat: 'Web Development',
            kind: 'hack',
            status: 'LIVE',
            date: '06 Nov 2026',
            mode: 'Individual participation',
            eyebrow: 'BUILD · LEARN · COLLABORATE',
            desc: REBUILD,
            pal: 0,
            paid: true,
            tag: 'THE DASHBOARD RECREATION HACKATHON',
            pills: [
                'CERTIFICATE FOR WINNERS',
                'INTERNSHIP OPPORTUNITY',
                'REGISTER BY 5 NOV 2026'
            ]
        },
        {
            key: 'fq2',
            id: '20864c76-4792-4b09-a2e9-ff6764bf20d6',
            ini: 'FQ',
            title: "FirstCommit '26 Quiz Competition 2.0",
            cat: 'Open Innovation',
            kind: 'quiz',
            status: 'COMPLETED',
            date: '—',
            mode: 'QUIZ · SOLO · TIMED',
            desc: 'This is the re-attempt quiz for those who missed the first one.',
            pal: 1
        },
        {
            key: 'fq',
            id: '80299fc1-3e30-466f-a146-fd45c77c84be',
            ini: 'FQ',
            title: "FirstCommit '26 Quiz Competition",
            cat: 'Open Innovation',
            kind: 'quiz',
            status: 'COMPLETED',
            date: '—',
            mode: 'QUIZ · SOLO · TIMED',
            desc: 'The quiz features 50 questions across technology, AI, and engineering — 42 multiple-choice questions and 8 true/false questions — to be completed in 30 minutes on Sunday, 1 November 2026. It is conducted online on the CampusCode platform, and every participant gets a single attempt.',
            pal: 2
        }
    ];

    var NT = [
        {
            t: 'Round is Live',
            d: '06 Nov 2026',
            b: "Hello students, ReBuild '26 Round 1 is live. You can submit your live demo + GitHub before 10 PM today."
        },
        {
            t: 'Create your team',
            d: '05 Nov 2026',
            b: "When you join the event using the invite code, you need to create a team. Go to HackMate AI, select the ReBuild hackathon, then create your team name."
        }
    ];

    var ST = { re: true };

    try {
        var sv = JSON.parse(localStorage.getItem('cc-joined') || 'null');

        if (sv) {
            ST = sv;
        }
    } catch (e) { }

    function save() {
        try {
            localStorage.setItem('cc-joined', JSON.stringify(ST));
        } catch (e) { }
    }

    function joined() {
        return EV.filter(function (e) {
            return ST[e.key];
        });
    }

    function stats() {
        var j = joined();

        return {
            reg: j.length,
            on: j.filter(function (e) {
                return e.status === 'LIVE';
            }).length,
            done: j.filter(function (e) {
                return e.status === 'COMPLETED';
            }).length,
            cert: 0
        };
    }

    function L(p) {
        return SPA ? '#' + p : (p === 'overview' ? 'student.html' : p + '.html');
    }

    function uuid(e) {
        return e.reg || 'a67cd83c-' + e.id.slice(9, 13) + '-41cf-bceb-' + e.id.slice(-12);
    }

    /* Planet sprites and live planet */

    var PV = 'varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';

    var PF =
        'uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 atm;uniform vec3 L;uniform float sc;uniform float band;uniform float al;uniform float t;varying vec3 vN;varying vec3 vP;' +
        'float hs(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}' +
        'float no(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hs(i),hs(i+vec3(1,0,0)),f.x),mix(hs(i+vec3(0,1,0)),hs(i+vec3(1,1,0)),f.x),f.y),mix(mix(hs(i+vec3(0,0,1)),hs(i+vec3(1,0,1)),f.x),mix(hs(i+vec3(0,1,1)),hs(i+vec3(1,1,1)),f.x),f.y),f.z);}' +
        'float fb(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*no(p);p*=2.03;a*=.5;}return s;}' +
        'void main(){vec3 p=vP;float n=band>.5?.5+.5*sin(p.y*sc*3.+fb(p*sc*.8+t*.02)*4.):fb(p*sc+t*.01);vec3 c=mix(c1,c2,smoothstep(.3,.55,n));c=mix(c,c3,smoothstep(.58,.78,n));' +
        'vec3 N=normalize(vN);float d=max(dot(N,L),0.);float rim=pow(1.-max(N.z,0.),3.);c=c*(.12+d*1.05)+atm*rim*(.25+d*.9);gl_FragColor=vec4(c,al);}';

    var RF = 'uniform float al;varying vec3 vN;varying vec3 vP;void main(){float r=length(vP.xy);float s=.5+.5*sin(r*46.);s=s*.6+.4*step(.5,sin(r*17.));float a=smoothstep(1.5,1.62,r)*(1.-smoothstep(2.35,2.5,r))*(.2+.6*s)*al;gl_FragColor=vec4(mix(vec3(.84,.95,.5),vec3(.7,.62,1.),s),a);}';

    var PALS = [
        {
            c: [[.1, .28, .04], [.5, .82, .16], [.85, 1, .55]],
            sc: 2.2,
            band: 0,
            atm: [.7, 1, .4]
        },
        {
            c: [[.18, .14, .5], [.45, .4, .95], [.8, .8, 1]],
            sc: 1.8,
            band: 1,
            atm: [.6, .55, 1]
        },
        {
            c: [[.05, .05, .07], [.2, .2, .26], [.5, .5, .6]],
            sc: 2.6,
            band: 0,
            atm: [.5, .5, .7]
        }
    ];

    function pmat(p) {
        var V = function (a) {
            return {
                value: new THREE.Vector3(a[0], a[1], a[2])
            };
        };

        return new THREE.ShaderMaterial({
            uniforms: {
                c1: V(p.c[0]),
                c2: V(p.c[1]),
                c3: V(p.c[2]),
                atm: V(p.atm),
                L: {
                    value: new THREE.Vector3(-.6, .5, .7).normalize()
                },
                sc: { value: p.sc },
                band: { value: p.band },
                al: { value: 1 },
                t: { value: 0 }
            },
            vertexShader: PV,
            fragmentShader: PF,
            transparent: true
        });
    }

    var SPR = [];

    function sprites() {
        if (!window.THREE) return;

        try {
            var r = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                preserveDrawingBuffer: true
            });

            r.setPixelRatio(1);
            r.setSize(200, 200);

            var sc = new THREE.Scene();
            var cam = new THREE.PerspectiveCamera(30, 1, .1, 20);

            cam.position.z = 4;

            PALS.forEach(function (p, i) {
                var m = new THREE.Mesh(
                    new THREE.SphereGeometry(1, 48, 36),
                    pmat(p)
                );

                m.rotation.y = i * 1.7;
                sc.add(m);
                r.render(sc, cam);

                SPR[i] = r.domElement.toDataURL();
                sc.remove(m);
            });

            r.dispose();

            if (r.forceContextLoss) {
                r.forceContextLoss();
            }
        } catch (e) { }
    }

    function badge(e, s) {
        var im = SPR[e.pal];

        return '<span class="bd' + (im ? '' : ' noimg') + '" style="--s:' + s + 'px">' +
            (im ? '<img alt="" src="' + im + '">' : '') +
            '<b>' + e.ini + '</b></span>';
    }

    var liveStop = null;

    function livePlanet(cv) {
        if (!window.THREE) return;

        try {
            var r = new THREE.WebGLRenderer({
                canvas: cv,
                alpha: true,
                antialias: true
            });

            r.setPixelRatio(Math.min(devicePixelRatio, 2));

            var sc = new THREE.Scene();
            var cam = new THREE.PerspectiveCamera(32, 1, .1, 30);

            cam.position.z = 9.5;

            var g = new THREE.Group();
            var pm = pmat(PALS[0]);

            var m = new THREE.Mesh(
                new THREE.SphereGeometry(1.2, 64, 48),
                pm
            );

            g.add(m);

            var rm = new THREE.ShaderMaterial({
                uniforms: {
                    al: { value: 1 }
                },
                vertexShader: PV,
                fragmentShader: RF,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            var ring = new THREE.Mesh(
                new THREE.RingGeometry(1.7, 2.5, 128),
                rm
            );

            ring.rotation.x = 1.25;
            ring.rotation.y = .25;
            g.add(ring);

            var piv = new THREE.Group();

            var mm = new THREE.Mesh(
                new THREE.SphereGeometry(.2, 32, 24),
                pmat({
                    c: [[.3, .3, .34], [.6, .6, .64], [.8, .8, .85]],
                    sc: 3,
                    band: 0,
                    atm: [.5, .5, .6]
                })
            );

            mm.position.x = 2.2;
            piv.add(mm);
            piv.rotation.x = .4;
            g.add(piv);

            g.rotation.x = .2;
            sc.add(g);

            var rs = function () {
                var w = cv.clientWidth || 300;
                r.setSize(w, w, false);
            };

            rs();

            addEventListener('resize', rs);

            var vis = true;
            var on = true;

            if ('IntersectionObserver' in window) {
                new IntersectionObserver(function (e) {
                    vis = e[0].isIntersecting;
                }).observe(cv);
            }

            (function loop(now) {
                if (!on) return;

                if (vis) {
                    pm.uniforms.t.value = now / 1000;

                    if (!reduce) {
                        m.rotation.y = now / 9000;
                        piv.rotation.y = now / 1500;
                        ring.rotation.z = now / 20000;
                    }

                    r.render(sc, cam);
                }

                requestAnimationFrame(loop);
            })(0);

            liveStop = function () {
                on = false;
                removeEventListener('resize', rs);
                r.dispose();

                if (r.forceContextLoss) {
                    r.forceContextLoss();
                }
            };
        } catch (e) { }
    }

    /* Background orbits */

    var OP = {
        dark: ['168,230,46', '118,101,255', '200,208,255'],
        light: ['91,138,8', '100,80,230', '60,70,140']
    };

    var oc = $('#orb');
    var o2 = oc.getContext('2d');

    var W = 0;
    var H = 0;
    var orbs = [];
    var stars = [];

    function orsize() {
        var D = Math.min(devicePixelRatio, 2);

        W = innerWidth;
        H = innerHeight;

        oc.width = W * D;
        oc.height = H * D;

        o2.setTransform(D, 0, 0, D, 0, 0);
    }

    orsize();
    addEventListener('resize', orsize);

    for (var i = 0; i < 11; i++) {
        orbs.push({
            a: 50 + i * i * 9 + i * 22,
            b: .34 + (i % 4) * .09,
            rot: i * .55,
            sp: (.5 + Math.random() * .4) / Math.sqrt(1 + i),
            ph: Math.random() * TAU,
            c: i % 3
        });
    }

    for (var i = 0; i < 90; i++) {
        stars.push([
            Math.random(),
            Math.random(),
            Math.random() * .6 + .2
        ]);
    }

    function orbit(t) {
        o2.clearRect(0, 0, W, H);

        var Lt = theme === 'light';
        var LC = Lt ? '70,75,150' : '140,150,255';

        stars.forEach(function (s) {
            o2.fillStyle = 'rgba(' +
                (Lt ? '50,55,120' : '200,205,255') +
                ',' + (.12 + .12 * Math.sin(t + s[0] * 40)) * s[2] + ')';

            o2.fillRect(s[0] * W, s[1] * H, 1, 1);
        });

        var cx = W * .72;
        var cy = H * .4 - scrollY * .03;

        o2.lineWidth = 1;
        o2.strokeStyle = 'rgba(' + LC + ',.04)';

        for (var k = 0; k < 10; k++) {
            var an = k * TAU / 10 + t * .01;

            o2.beginPath();
            o2.moveTo(cx, cy);
            o2.lineTo(cx + Math.cos(an) * W, cy + Math.sin(an) * W);
            o2.stroke();
        }

        orbs.forEach(function (o) {
            var c2 = OP[theme][o.c];

            o2.strokeStyle = 'rgba(' + LC + (Lt ? ',.14)' : ',.09)');
            o2.beginPath();
            o2.ellipse(cx, cy, o.a, o.a * o.b, o.rot, 0, TAU);
            o2.stroke();

            var g = t * o.sp + o.ph;

            o2.strokeStyle = 'rgba(' + c2 + ',.4)';
            o2.beginPath();
            o2.ellipse(cx, cy, o.a, o.a * o.b, o.rot, g - .7, g);
            o2.stroke();

            var X = o.a * Math.cos(g);
            var Y = o.a * o.b * Math.sin(g);
            var c = Math.cos(o.rot);
            var s = Math.sin(o.rot);

            o2.fillStyle = 'rgba(' + c2 + ',.95)';
            o2.beginPath();
            o2.arc(cx + X * c - Y * s, cy + X * s + Y * c, 1.7, 0, TAU);
            o2.fill();
        });
    }

    /* Theme toggle */

    var tb = $('#theme');
    var tc = $('#tc');
    var tx = tc.getContext('2d');

    var GN = 520;
    var MP = [];
    var SP = [];
    var TR = [];

    var tk = theme === 'light' ? 1 : 0;
    var tg = tk;
    var tlast = 0;
    var tfr = 0;

    (function () {
        var i, a, r, x, y, dd;

        while (MP.length < GN) {
            a = Math.random() * TAU;
            r = 14.5 * Math.sqrt(Math.random());

            x = 20 + r * Math.cos(a);
            y = 23 + r * Math.sin(a);

            dd = Math.hypot(x - 27, y - 18) - 12;

            if (dd > 0 && Math.random() < .3 + .7 * Math.exp(-dd / 5)) {
                MP.push([x, y]);
            }
        }

        for (i = 0; i < GN; i++) {
            if (i < 300) {
                a = Math.random() * TAU;
                r = 8 * Math.sqrt(Math.random());

                if (Math.random() > .45 + .55 * (r / 8)) {
                    i--;
                    continue;
                }

                SP.push([
                    22 + r * Math.cos(a),
                    22 + r * Math.sin(a)
                ]);
            } else {
                a = Math.floor(Math.random() * 8) * Math.PI / 4;
                r = 12 + Math.random() * 7;

                var j = (Math.random() - .5) * 1.1;

                SP.push([
                    22 + r * Math.cos(a) - j * Math.sin(a),
                    22 + r * Math.sin(a) + j * Math.cos(a)
                ]);
            }
        }

        for (i = 0; i < GN; i++) {
            a = Math.random() * TAU;

            TR.push({
                r: Math.random(),
                dx: Math.cos(a),
                dy: Math.sin(a)
            });
        }
    })();

    function themeIcon(now) {
        var d = Math.min(.05, (now - tlast) / 1000);

        tlast = now;
        tfr++;

        var mv = tk !== tg;

        if (mv) {
            var s = d / 1.1;

            tk += tk < tg ? s : -s;

            if (Math.abs(tk - tg) <= s) {
                tk = tg;
            }
        }

        if (!mv && tfr % 3) return;

        tx.setTransform(2, 0, 0, 2, 0, 0);
        tx.clearRect(0, 0, 44, 44);

        var m = Math.min(1, Math.max(0, tk));

        tx.fillStyle = 'rgb(' +
            Math.round(223 + 9 * m) + ',' +
            Math.round(227 - 90 * m) + ',' +
            Math.round(255 - 243 * m) + ')';

        for (var i = 0; i < GN; i++) {
            var e = Math.min(1, Math.max(0, tk * 1.7 - TR[i].r * .7));

            e = e * e * (3 - 2 * e);

            var sc = Math.sin(e * 3.1416) * 9;
            var A = MP[i];
            var B = SP[i];

            tx.globalAlpha = .45 + Math.random() * .55;

            tx.fillRect(
                A[0] + (B[0] - A[0]) * e + TR[i].dx * sc + (Math.random() - .5) * .7,
                A[1] + (B[1] - A[1]) * e + TR[i].dy * sc + (Math.random() - .5) * .7,
                1.15,
                1.15
            );
        }

        tx.globalAlpha = 1;
    }

    function setThemeUI(n) {
        tb.setAttribute('aria-pressed', n === 'light');
        tb.setAttribute('aria-label', 'Switch to ' + (n === 'light' ? 'dark' : 'light') + ' theme');
    }

    setThemeUI(theme);

    tb.addEventListener('click', function () {
        var next = theme === 'dark' ? 'light' : 'dark';
        var rc = tb.getBoundingClientRect();

        var x = rc.left + rc.width / 2;
        var y = rc.top + rc.height / 2;

        tg = next === 'light' ? 1 : 0;

        function ap() {
            theme = next;
            document.documentElement.dataset.theme = next;

            setThemeUI(next);

            try {
                localStorage.setItem('cc-theme', next);
            } catch (e) { }
        }

        if (document.startViewTransition && !reduce) {
            var vt = document.startViewTransition(ap);

            vt.ready.then(function () {
                var rad = Math.hypot(
                    Math.max(x, innerWidth - x),
                    Math.max(y, innerHeight - y)
                );

                document.documentElement.animate(
                    {
                        clipPath: [
                            'circle(0px at ' + x + 'px ' + y + 'px)',
                            'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'
                        ]
                    },
                    {
                        duration: 1000,
                        easing: 'cubic-bezier(.6,0,.3,1)',
                        pseudoElement: '::view-transition-new(root)'
                    }
                );
            });
        } else {
            ap();
        }
    });

    (function loop(now) {
        orbit(reduce ? 0 : now / 1000);
        themeIcon(now);

        requestAnimationFrame(loop);
    })(0);

    /* Dashboard views */

    function banner(e) {
        var mk = '<span class="mk"><i></i><i></i><i></i></span>';

        if (e.kind === 'hack') {
            return '<div class="dbn">' + mk +
                '<div><small>CAMPUSCODE PRESENTS</small><b>ReBuild <em>\'26</em></b><span>' +
                e.tag + '</span><p>' +
                e.pills.map(function (p) {
                    return '<i>' + p + '</i>';
                }).join('') +
                '</p></div></div>';
        }

        return '<div class="dbn">' + mk +
            '<div><small>CAMPUSCODE</small><b>FIRSTCOMMIT \'26</b><b class="a">QUIZ COMPETITION</b><span>50 QUESTIONS · TECH · AI · ENGINEERING</span><span>SUNDAY, 1 NOVEMBER 2026</span></div><u>50</u></div>';
    }

    function act(e) {
        return ST[e.key]
            ? '<span class="dbtn j">JOINED</span>'
            : (e.status === 'COMPLETED'
                ? '<button class="dbtn o" data-open="' + e.key + '">VIEW EVENT</button>'
                : '<button class="dbtn o" data-open="' + e.key + '">JOIN NOW ↗</button>');
    }

    function card(e) {
        return '<article class="dp ec tilt rv" data-kind="' + e.kind + '" style="--i:' + EV.indexOf(e) + '">' +
            banner(e) +
            '<div class="ecid"><span>' + e.id + '</span><b class="' +
            (e.status === 'LIVE' ? '' : 'done') +
            '" style="' + (e.status === 'LIVE' ? 'color:var(--lime)' : '') + '">' +
            e.status + '</b></div>' +
            '<div class="ect">' + badge(e, 64) + '<h3>' + e.title + '</h3></div>' +
            '<div class="ecm">' + e.mode + '</div>' +
            '<p class="ecd">' + e.desc + '</p>' +
            '<div class="ecb"><button class="dbtn o" data-open="' + e.key + '">VIEW DETAILS</button>' +
            act(e) + '</div></article>';
    }

    function head(lab, h, sub, n) {
        return '<header class="dhead rv">' +
            '<p class="dlab">' + lab + '</p>' +
            '<h1 class="dh1">' + h + '</h1>' +
            '<p class="dsub">' + sub + '</p>' +
            (n == null ? '' : '<div class="dcount"><b data-n="' + n + '" data-pad="1">0</b><small>DEMO DATA</small></div>') +
            '</header>';
    }

    var VIEWS = {
        overview: function () {
            var re = EV[0];
            var S = stats();

            var cur = joined().filter(function (e) {
                return e.status === 'LIVE';
            })[0];

            var st = [
                ['REGISTERED', S.reg],
                ['ONGOING', S.on],
                ['COMPLETED', S.done],
                ['CERTIFICATES', S.cert]
            ].map(function (s, i) {
                return '<div class="dp dstat rv" style="--i:' + (i + 3) + '">' +
                    '<span>' + s[0] + '</span>' +
                    '<b data-n="' + s[1] + '">0</b>' +
                    '<small>DEMO DATA</small></div>';
            }).join('');

            var mini = EV.map(function (e) {
                return '<div class="emc"><div class="emh">' +
                    badge(e, 64) +
                    '<div><small>' + e.cat + '</small><b>' + e.title + '</b><span>' +
                    (e.date !== '—' ? e.date + ' · ' + e.mode : '—') +
                    '</span></div></div>' +
                    act(e) +
                    '</div>';
            }).join('');

            var bars = [
                ['HACKATHONS', S.reg, '🏆'],
                ['ONGOING', S.on, '⚡'],
                ['COMPLETED', S.done, '✓'],
                ['CERTIFICATES', S.cert, '★']
            ].map(function (b) {
                return '<div><i>' + b[2] + '</i><em style="--w:' +
                    Math.max(6, b[1] / Math.max(1, S.reg) * 100) +
                    '%"></em><b>' + b[1] + '</b><small>' + b[0] + '</small></div>';
            }).join('');

            return head(
                'STUDENT WORKSPACE / LIVE',
                'Welcome back, <u>' + USER.first + '</u>.',
                'Your CampusCode activity, all in one orbit.'
            ) +

                '<section class="dp feat rv" style="--i:2"><div>' +
                '<p class="dlab">' + re.eyebrow + '</p>' +
                '<h2 class="dh2">' + re.title + '</h2>' +
                '<p class="ddesc">' + re.desc + '</p>' +
                '<button class="dbtn" data-open="re">OPEN EVENT <b>↗</b></button>' +
                '</div><div class="fwrap"><canvas class="fplanet" id="fp" aria-hidden="true"></canvas></div></section>' +

                '<section class="stats">' + st + '</section>' +

                '<section class="dp rv" style="--i:7">' +
                '<div class="dph"><span>03 / DISCOVER EVENTS</span>' +
                '<a href="' + L('events') + '" data-nav="events">VIEW ALL ↗</a></div>' +
                '<div class="mini">' + mini + '</div></section>' +

                '<section class="tri">' +
                '<div class="dp rv" style="--i:8">' +
                '<div class="dph"><span>UPCOMING DEADLINES</span>' +
                '<a href="' + L('events') + '" data-nav="events">VIEW ALL ↗</a></div>' +
                '<div class="empty"><b>No deadlines yet.</b>' +
                '<p>Join an event and your upcoming dates will appear here.</p>' +
                '<a class="dbtn" href="' + L('events') + '" data-nav="events">BROWSE EVENTS ↗</a></div></div>' +

                '<div class="dp spot rv" style="--i:9">' +
                '<div class="dph"><span>AI SPOTLIGHT</span></div>' +
                '<h3>Your AI teammates are ready.</h3>' +
                '<p>Check your idea, find teammates, or ask the rules — right from here.</p>' +
                '<div class="chips"><span data-soon>✦ IDEACHECK</span>' +
                '<span data-soon>◎ HACKMATE</span>' +
                '<span data-soon>▣ RULEBOT</span></div></div>' +

                '<div class="dp rv" style="--i:10">' +
                '<div class="dph"><span>YOUR JOURNEY</span>' +
                '<a href="#" data-soon>CERTIFICATES ↗</a></div>' +
                '<div class="jr">' + bars + '</div></div></section>' +

                '<section class="two">' +
                '<div class="dp rv" style="--i:11">' +
                '<div class="dph"><span>01 / CURRENT ACTIVITY</span>' +
                '<a href="' + L('my-events') + '" data-nav="my-events">VIEW EVENTS ↗</a></div>' +

                (cur
                    ? '<div class="act2"><span class="mono">' + cur.id + '</span>' +
                    '<h3 class="dh2" style="font-size:clamp(34px,3.4vw,52px)">' + cur.title + '</h3>' +
                    '<div class="pills"><span class="pill">' + cur.status + '</span>' +
                    '<span class="pill">' + cur.date.toUpperCase() + '</span></div></div>'
                    : '<div class="empty"><b>Nothing live</b><p>Join an event to see it here.</p></div>') +

                '</div>' +

                '<div class="dp rv" style="--i:12">' +
                '<div class="dph"><span>02 / NOTIFICATIONS</span>' +
                '<a href="#" data-soon>OPEN ALL ↗</a></div>' +
                '<div class="nts">' +
                NT.map(function (n) {
                    return '<div><i></i><b>' + n.t + '</b><small>' +
                        n.d.toUpperCase() + '</small><p>' + n.b + '</p></div>';
                }).join('') +
                '</div></div></section>';
        },

        events: function () {
            return head(
                'DISCOVER / ALL EVENTS',
                'Events.',
                'Explore CampusCode events — hackathons, quizzes, workshops — and join the ones you want.',
                EV.length
            ) +
                '<div class="tabs rv" style="--i:2" role="tablist">' +
                '<button class="on" data-tab="all">All events</button>' +
                '<button data-tab="hack">Hackathons</button>' +
                '<button data-tab="quiz">Quizzes</button></div>' +
                '<section class="egrid" id="eg">' + EV.map(card).join('') + '</section>';
        },

        'my-events': function () {
            var j = joined();

            return head(
                'MY ACTIVITY / DEMO DATA',
                'My events.',
                'Every event you joined, in one place. Open one to see its rounds, team, results and certificates.',
                j.length
            ) +

                (j.length
                    ? '<section class="egrid">' +
                    j.map(function (e, i) {
                        return '<article class="dp ec tilt rv" style="--i:' + (i + 2) + '">' +
                            banner(e) +
                            '<div class="ecid"><b style="color:var(--ink)">REGISTRATION</b>' +
                            '<span>' + uuid(e) + '</span></div>' +
                            '<div class="ect">' + badge(e, 64) + '<h3>' + e.title + '</h3></div>' +
                            '<div class="kv"><div>STATUS: <span>REGISTERED</span></div>' +
                            (e.team ? '<div>TEAM: <span>' + e.team + '</span></div>' : '') +
                            '</div><div class="ecb"><button class="dbtn" data-journey="' + e.key +
                            '">OPEN JOURNEY <b>↗</b></button></div></article>';
                    }).join('') +
                    '</section>'
                    : '<div class="dp empty rv" style="--i:2"><b>No events yet</b>' +
                    '<p>You haven’t joined an event. Browse the arena and pick one.</p>' +
                    '<a class="dbtn" href="' + L('events') + '" data-nav="events">BROWSE EVENTS ↗</a></div>');
        }
    };

    var TITLES = {
        overview: 'OVERVIEW',
        events: 'EVENTS',
        'my-events': 'MY EVENTS'
    };

    function cur() {
        var p = SPA
            ? (location.hash.slice(1) || 'overview')
            : document.body.dataset.page;

        return VIEWS[p] ? p : 'overview';
    }

    function counts(root) {
        $$('[data-n]', root).forEach(function (el) {
            var n = +el.dataset.n;
            var pad = el.dataset.pad;
            var t0 = performance.now();

            (function f(t) {
                var p = Math.min(1, (t - t0) / 900);
                var v = reduce ? n : Math.round(n * (1 - Math.pow(1 - p, 3)));

                el.textContent = pad ? ('0' + v).slice(-2) : v;

                if (p < 1 && !reduce) {
                    requestAnimationFrame(f);
                }
            })(t0);
        });
    }

    function render() {
        var p = cur();
        var v = $('#view');

        if (liveStop) {
            liveStop();
            liveStop = null;
        }

        v.innerHTML = VIEWS[p]();

        $('#ptitle').textContent = TITLES[p];
        document.title = TITLES[p] + ' – CampusCode Student';

        $$('.snav a[data-route]').forEach(function (a) {
            a.classList.toggle('on', a.dataset.route === p);
        });

        counts(v);

        var fp = $('#fp');

        if (fp) {
            livePlanet(fp);
        }

        $$('.tilt', v).forEach(function (el) {
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width;
                var y = (e.clientY - r.top) / r.height;

                el.style.transform = 'perspective(900px) rotateY(' +
                    (x - .5) * 5 + 'deg) rotateX(' + (.5 - y) * 5 + 'deg)';
            });

            el.addEventListener('pointerleave', function () {
                el.style.transform = '';
            });
        });

        $('#side').classList.remove('open');
        $('#sback').classList.remove('on');
    }

    /* Event details, join and journey overlays */

    var ov = $('#ov');

    function show(html, cls) {
        ov.className = 'ov ' + cls;

        ov.innerHTML =
            '<div class="ovb" data-x></div>' +
            '<div class="ovp" role="dialog" aria-modal="true">' +
            '<button class="ovx" data-x aria-label="Close">✕</button>' +
            html +
            '</div>';

        ov.hidden = false;

        requestAnimationFrame(function () {
            ov.classList.add('in');
        });

        $('.ovx', ov).focus();
    }

    function hide() {
        ov.classList.remove('in');

        setTimeout(function () {
            ov.hidden = true;
            ov.innerHTML = '';
        }, 300);
    }

    function toast(t) {
        var d = document.createElement('div');

        d.textContent = t;
        $('#toasts').appendChild(d);

        setTimeout(function () {
            d.remove();
        }, 2600);
    }

    function evt(key) {
        return EV.filter(function (e) {
            return e.key === key;
        })[0];
    }

    function openEvent(key) {
        var e = evt(key);
        var j = ST[key];
        var ended = e.status === 'COMPLETED';

        var foot = j
            ? '<div class="ecb"><span class="dbtn j">JOINED ✓</span>' +
            '<a class="dbtn" href="' + L('my-events') +
            '" data-nav="my-events">OPEN JOURNEY ↗</a></div>'

            : ended
                ? '<p class="dsub">This event has ended, so it can’t be joined any more.</p>'

                : (e.paid
                    ? '<label class="fld"><span>INVITE CODE (PAID EVENT)</span>' +
                    '<input id="inv" autocomplete="off" placeholder="Enter your invite code">' +
                    '<small id="ierr"></small></label>'
                    : '') +
                '<div class="ecb"><button class="dbtn" id="jn">JOIN EVENT <b>↗</b></button></div>';

        show(
            banner(e) +
            '<div class="ect">' + badge(e, 64) +
            '<h3 class="dh2" style="font-size:clamp(34px,4vw,54px)">' +
            e.title + '</h3></div>' +
            '<div class="ecid"><span>' + e.id + '</span><b style="' +
            (e.status === 'LIVE' ? 'color:var(--lime)' : '') + '">' +
            e.status + '</b></div>' +
            '<div class="ecm">' + e.mode + '</div>' +
            '<p class="ddesc">' + e.desc + '</p>' +
            foot,
            'modal'
        );

        var b = $('#jn');

        if (b) {
            b.onclick = function () {
                if (e.paid && ($('#inv').value.trim().length < 4)) {
                    $('#ierr').textContent = 'Enter the invite code you received (demo: any 4+ characters).';
                    return;
                }

                ST[key] = true;
                save();
                hide();
                toast('Joined ' + e.title + ' (demo)');
                render();
            };
        }
    }

    function openJourney(key) {
        var e = evt(key);

        show(
            '<p class="dlab">JOURNEY / REGISTRATION</p>' +
            '<div class="ect">' + badge(e, 64) +
            '<h3 class="dh2" style="font-size:clamp(34px,4vw,54px)">' +
            e.title + '</h3></div>' +

            '<div class="kv">' +
            '<div>STATUS: <span>REGISTERED</span></div>' +
            '<div>TEAM: <span>' + (e.team || '—') + '</span></div>' +
            '<div>REGISTRATION: <span style="font:400 11px ui-monospace,monospace">' +
            uuid(e) + '</span></div></div>' +

            '<div class="rd"><header><b>Round 1 · Recreate</b>' +
            '<span class="st2">ENDED</span></header>' +
            '<small>FRIDAY, 6 NOV · TILL 10:00 PM</small>' +
            '<p>Recreate the CampusCode user flow faithfully — Dashboard, Login, Register and Student dashboard. Frontend only, mock data is fine.</p></div>' +

            '<div class="rd"><header><b>Round 2 · New UI</b>' +
            '<span class="st2 live">LIVE</span></header>' +
            '<small>SATURDAY, 7 NOV · TOP PERFORMERS ONLY</small>' +
            '<p>Build a complete new UI in CampusCode’s vibe. Frontend only, mock data is fine. No presentation round.</p></div>' +

            '<div class="rd"><header><b>Prizes</b></header>' +
            '<p>Winner certificate + CampusCode internship with ₹15,000 stipend · Runner-up certificate · Participation certificates for all.</p></div>',
            'drawer'
        );
    }

    /* Global event handlers */

    document.addEventListener('click', function (e) {
        var t = e.target;

        var o = t.closest('[data-open]');

        if (o) {
            e.preventDefault();
            openEvent(o.dataset.open);
            return;
        }

        var j = t.closest('[data-journey]');

        if (j) {
            e.preventDefault();
            openJourney(j.dataset.journey);
            return;
        }

        var x = t.closest('[data-x]');

        if (x && ov.contains(x)) {
            hide();
            return;
        }

        var s = t.closest('[data-soon]');

        if (s) {
            e.preventDefault();
            toast('Coming soon. This page is part of the full build.');
            return;
        }

        var n = t.closest('[data-nav]');

        if (n && ov.contains(n)) {
            hide();
        }

        var tab = t.closest('[data-tab]');

        if (tab) {
            $$('[data-tab]').forEach(function (b) {
                b.classList.toggle('on', b === tab);
            });

            $$('#eg .ec').forEach(function (c) {
                c.style.display = (
                    tab.dataset.tab === 'all' ||
                    c.dataset.kind === tab.dataset.tab
                ) ? '' : 'none';
            });
        }

        if (!t.closest('#nd') && !t.closest('#bell')) {
            $('#nd').hidden = true;
        }
    });

    addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (!ov.hidden) hide();

            $('#nd').hidden = true;

            if ($('.um')) {
                $('.um').hidden = true;
            }
        }
    });

    $('#bell').onclick = function () {
        if ($('.um')) {
            $('.um').hidden = true;
        }

        var nd = $('#nd');

        nd.innerHTML = NT.map(function (n) {
            return '<div><b>' + n.t + '</b><small>' +
                n.d.toUpperCase() + '</small><p>' + n.b + '</p></div>';
        }).join('');

        nd.hidden = !nd.hidden;
        $('#nb').style.display = 'none';
    };

    $('#rf').onclick = function () {
        var b = this;

        b.classList.remove('spin');
        void b.offsetWidth;
        b.classList.add('spin');

        counts($('#view'));
        toast('Everything is up to date');
    };

    $('#mbtn').onclick = function () {
        $('#side').classList.add('open');
        $('#sback').classList.add('on');
    };

    $('#sback').onclick = function () {
        $('#side').classList.remove('open');
        $('#sback').classList.remove('on');
    };

    if (SPA) {
        addEventListener('hashchange', function () {
            render();
            scrollTo(0, 0);
        });
    }

    var pc = $('.pchip');

    if (pc) {
        pc.setAttribute('role', 'button');
        pc.tabIndex = 0;
        pc.style.cursor = 'pointer';

        var um = document.createElement('div');

        um.className = 'nd um';
        um.hidden = true;

        um.innerHTML =
            '<a href="index.html">← Back to home</a>' +
            '<a href="login.html">Log out ↗</a>';

        $('.dact').appendChild(um);

        var tgl = function (e) {
            e.stopPropagation();
            um.hidden = !um.hidden;
            $('#nd').hidden = true;
        };

        pc.onclick = tgl;

        pc.onkeydown = function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tgl(e);
            }
        };

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.um') && !e.target.closest('.pchip')) {
                um.hidden = true;
            }
        });
    }

    var sa = $('.sacct');

    if (sa) {
        var sl = document.createElement('div');

        sl.className = 'slinks';
        sl.innerHTML =
            '<a href="index.html">← Home</a>' +
            '<a href="login.html">Log out</a>';

        sa.appendChild(sl);
    }

    sprites();
    render();

    /* Setup check */

    (function () {
        function note(t, c, top) {
            var d = document.createElement('div');

            d.setAttribute('role', 'alert');

            d.style.cssText =
                'position:fixed;z-index:9999;left:12px;right:12px;' +
                (top ? 'top:12px' : 'bottom:12px') +
                ';max-width:620px;margin:auto;padding:14px 18px;border-radius:12px;' +
                'background:' + c + ';color:#fff;font:600 14px/1.45 system-ui,sans-serif;' +
                'box-shadow:0 10px 30px #0008';

            d.textContent = t;
            document.body.appendChild(d);

            setTimeout(function () {
                if (!top) {
                    d.remove();
                }
            }, 9000);
        }

        if (!getComputedStyle(document.documentElement).getPropertyValue('--panel').trim()) {
            note(
                'styles.css is missing or an old version. Copy the newest styles.css from the zip into the same folder as this page, then refresh.',
                '#e5484d',
                true
            );
        }

        if (!window.THREE) {
            note(
                'three.js did not load, so the 3D parts are off. Check your internet connection or ad-blocker, then refresh.',
                '#8a5a00',
                false
            );
        }
    })();
})();