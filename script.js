(()=>{
const $=id=>document.getElementById(id);
const LS = {
    get(k, d) {
        try {
            const v = localStorage.getItem(k);
            return v === null ? d : JSON.parse(v);
        } catch (e) {
            console.warn(
                `PANIK PODIUM: Gagal membaca data "${k}".`,
                e
            );
            return d;
        }
    },

    set(k, v) {
        try {
            localStorage.setItem(k, JSON.stringify(v));
            return true;
        } catch (e) {
            console.warn(
                `PANIK PODIUM: Gagal menyimpan data "${k}".`,
                e
            );
            return false;
        }
    }
};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function cfm(m){return new Promise(r=>{if(document.getElementById('cfm'))return r(false);const o=document.createElement('div'),pv=document.activeElement;o.id='cfm';o.className='ovl cfm';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Konfirmasi');o.innerHTML='<div class="clay cfmb"><p></p><div class="bar"><button class="o" data-v="0">Batal</button><button class="p" data-v="1">Lanjutkan</button></div></div>';o.querySelector('p').textContent=m;
const end=v=>{document.removeEventListener('keydown',kd,true);o.remove();pv&&pv.focus&&pv.focus();r(v)},kd=e=>{if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();end(false)}else if(e.key==='Tab'){const b=[...o.querySelectorAll('button')],i=b.indexOf(document.activeElement);e.preventDefault();b[(i+(e.shiftKey?-1:1)+b.length)%b.length].focus()}};
o.onclick=e=>{const v=e.target.dataset&&e.target.dataset.v;if(v!==undefined)end(v==='1');else if(e.target===o)end(false)};document.addEventListener('keydown',kd,true);document.body.appendChild(o);o.querySelector('.p').focus()})}
const DEMO=['Kopi Hitam','Tim Deadline','Sapu Jagat','Nasi Padang','Bintang Kampus','Anak Perpus','Laptop Lowbat','Revisi Terus'];
const MING=2,MAXG=12,MAXH=20,MAX_GROUP_NAME=28,MAX_STUDENT_NAME=40;
const storedGroups=LS.get('lmp_groups',null);
let groups=Array.isArray(storedGroups)?storedGroups.slice(0,MAXG).map(g=>String(g??'').slice(0,MAX_GROUP_NAME)):DEMO.slice();
if(groups.length<MING)groups=DEMO.slice();
const storedMuted=LS.get('lmp_muted',false),storedVol=Number(LS.get('lmp_vol',.5));
let state='SETUP',R=null,current=null,muted=storedMuted===true,vol=Number.isFinite(storedVol)?Math.max(0,Math.min(1,storedVol)):.5,ac=null;
function show(id){$('setup').classList.toggle('on',id==='setup');$('results').classList.toggle('on',id==='results');
 $('hud').style.display=id==='hud'?'block':'none';$('cv').style.display=(id==='hud'||id==='ts3d')?'block':'none';tsShow(id)}
function rnd(n){const c=window.crypto;if(!c||!c.getRandomValues)return Math.floor(Math.random()*n);const a=new Uint32Array(1),lim=Math.floor(4294967296/n)*n;do{c.getRandomValues(a)}while(a[0]>=lim);return a[0]%n}
function shuffle(x){const a=x.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}

/* setup */
function rows(){const seen=new Set(),dup=new Set();groups.forEach(g=>{const k=String(g??'').trim().toLowerCase();if(k&&seen.has(k))dup.add(k);if(k)seen.add(k)});
 const used=new Set();groups.forEach((g,i)=>{const k=sxKey(g);if(!k)return;if(!sexNorm(SX.g[k]))SX.g[k]=CK_DEFAULT_SEX(i);used.add(k)});Object.keys(SX.g).forEach(k=>{if(!used.has(k))delete SX.g[k]});LS.set('lmp_sx_g',SX.g);
 $('rows').innerHTML=groups.map((g,i)=>`<div class="row"><span class="n">${i+1}</span><input type="text" data-i="${i}" maxlength="28" aria-label="Nama kelompok ${i+1}" value="${esc(g)}" class="${!g.trim()||dup.has(g.trim().toLowerCase())?'bad':''}">${((X,LBL)=>'<button type="button" class="sx" data-s="'+i+'" data-v="'+X+'" aria-label="Karakter '+LBL+' '+(i+1)+': '+(X==='F'?'Perempuan, Pink Astronaut':'Laki-laki, Green Astronaut')+'. Klik untuk mengganti." title="'+(X==='F'?'Pink Astronaut (perempuan)':'Green Astronaut (laki-laki)')+' - klik untuk mengganti">'+(X==='F'?'♀':'♂')+'</button>')(sxGet(SX.g,g,i),'kelompok')}<button class="o" data-d="${i}" aria-label="Hapus kelompok ${i+1}"><i class="ic ic-x" aria-hidden="true"></i></button></div>`).join('');
 $('cnt').value=groups.length;LS.set('lmp_groups',groups);$('err').textContent=dup.size?'Peringatan: ada nama kelompok yang sama.':''}
$('rows').addEventListener('input',e=>{if(e.target.dataset.i!==undefined){const i=+e.target.dataset.i,ko=sxKey(groups[i]),kn=sxKey(e.target.value);groups[i]=e.target.value;if(kn&&ko!==kn&&sexNorm(SX.g[ko]))SX.g[kn]=SX.g[ko];LS.set('lmp_groups',groups);LS.set('lmp_sx_g',SX.g)}});
$('rows').addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button.sx');if(!b)return;const i=+b.dataset.s,k=sxKey(groups[i]);if(!k)return;SX.g[k]=sxGet(SX.g,groups[i],i)==='F'?'M':'F';LS.set('lmp_sx_g',SX.g);rows()});
$('rows').addEventListener('change',rows);
$('rows').addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button[data-d]');if(!b)return;const d=b.dataset.d;if(d===undefined)return;if(groups.length<=MING){$('err').textContent='Minimal '+MING+' kelompok.';return}groups.splice(+d,1);rows()});
$('add').onclick=()=>{if(groups.length>=MAXG){$('err').textContent='Maksimal '+MAXG+' kelompok.';return}groups.push('Kelompok '+(groups.length+1));rows();mascotReact('add')/*MASKOT*/};
$('cnt').onchange=()=>{const n=Math.max(MING,Math.min(MAXG,+$('cnt').value||MING));while(groups.length<n)groups.push('Kelompok '+(groups.length+1));groups.length=n;rows()};
$('demo').onclick=()=>{groups=DEMO.slice();rows()};
$('reset').onclick=async()=>{if(await cfm('Kembalikan ke default?')){groups=DEMO.slice();rows();mascotReact('reset')/*MASKOT*/}};

/* audio */
function actx(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(ac.state==='suspended')ac.resume().catch(()=>{});return ac.state==='running'?ac:null}
function tone(f,d=.12,type='square',v=.15,dl=0){if(muted)return;const c=actx();if(!c)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+dl;o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v*vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(c.destination);o.start(t);o.stop(t+d+.02)}
const sfx={tick:()=>tone(520,.15),go:()=>{tone(784,.15);tone(1047,.35,'square',.2,.12)},boing:()=>tone(300+Math.random()*200,.18,'sine',.25),
 fin:()=>{tone(660,.15,'triangle',.25);tone(990,.3,'triangle',.25,.12)},win:()=>[523,659,784,1047,1319].forEach((f,i)=>tone(f,.3,'triangle',.3,i*.14)),beat:()=>tone(90,.12,'sine',.5)};
let music=false,mT=0,mI=0,mGap=.26;const SC=[523,659,784,659,587,698,880,698];
function musicStep(dt){if(!music)return;mT-=dt;if(mT<=0){mT=mGap;tone(SC[mI%8]/2,.15,'triangle',.08);if(mI%2===0)sfx.beat();if(slow&&mI%2===1)tone(70,.1,'sine',.5);mI++}}
$('mute').textContent='Suara: '+(muted?'OFF':'ON');$('vol').value=vol;
$('mute').onclick=()=>{muted=!muted;LS.set('lmp_muted',muted);$('mute').textContent='Suara: '+(muted?'OFF':'ON');actx()};
$('vol').oninput=()=>{vol=+$('vol').value;LS.set('lmp_vol',vol)};
const FSB=['fs','fsHome','fsModes','fsTs','tsFs'].map($),de=document.documentElement,fsOn=()=>document.fullscreenElement||document.webkitFullscreenElement,fsOK=!!(de.requestFullscreen||de.webkitRequestFullscreen);
$('fs').onclick=()=>{try{Promise.resolve(fsOn()?(document.exitFullscreen||document.webkitExitFullscreen).call(document):(de.requestFullscreen||de.webkitRequestFullscreen).call(de)).catch(()=>{})}catch(e){}};
const fsUpd=()=>FSB.forEach(b=>b.textContent=fsOn()?'Keluar Layar Penuh':'Layar Penuh');
FSB.forEach(b=>{b.onclick=$('fs').onclick;b.hidden=!fsOK});document.addEventListener('fullscreenchange',fsUpd);document.addEventListener('webkitfullscreenchange',fsUpd);

/* 3D */
const L=60,START=0;let scene,camera,renderer,chars=[],glOK=false,followCam=true,SUN=null,Q=Math.max(0,Math.min(2,+LS.get('lmp_q',1)|0));
try{renderer=new THREE.WebGLRenderer({canvas:$('cv'),antialias:true});glOK=true;renderer.outputEncoding=THREE.sRGBEncoding;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setPixelRatio(Math.min(devicePixelRatio||1,[1,1.25,2][Q]));camera=new THREE.PerspectiveCamera(45,1,.1,300)}catch(e){glOK=false}
function resize(){if(!glOK)return;renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
addEventListener('resize',resize);

/* ===== KONTROL KAMERA INTERAKTIF (offset orbit di atas kamera sinematik; tanpa library tambahan) ===== */
const OB={ws:0,yaw:0,pit:0,zm:1,ty:0,tp:0,tz:1,pts:new Map(),v:new THREE.Vector3(),YM:Math.PI,PM:.9,ZMIN:.15,ZMAX:1.8,EMIN:.1,EMAX:1.3};
const obCl=(v,a,b)=>Math.max(a,Math.min(b,v));
const obOn=()=>!!scene&&(TS.on||state==='COUNTDOWN'||state==='RUNNING'||state==='REVEAL');
const obLock=()=>!!TS.on&&TS.ph==='ann';
function obReset(snap){OB.ty=OB.tp=0;OB.tz=1;if(snap){OB.yaw=OB.pit=0;OB.zm=1;OB.ws=0;if(TS)TS.ws=0}}
function obApply(tx,ty,tz,dt,x0,x1,z0,z1){
 const k=1-Math.exp(-Math.min(dt||0,.05)*12);
 OB.yaw+=(OB.ty-OB.yaw)*k;OB.pit+=(OB.tp-OB.pit)*k;OB.zm+=(OB.tz-OB.zm)*k;
 if(Math.abs(OB.yaw)<1e-3&&Math.abs(OB.pit)<1e-3&&Math.abs(OB.zm-1)<1e-3&&!OB.ty&&!OB.tp&&OB.tz===1){OB.yaw=OB.pit=0;OB.zm=1;return}
 const v=OB.v.set(camera.position.x-tx,camera.position.y-ty,camera.position.z-tz),len=v.length(),
  el=obCl(Math.atan2(v.y,Math.hypot(v.x,v.z))+OB.pit,OB.EMIN,OB.EMAX),az=Math.atan2(v.x,v.z)+OB.yaw,r=obCl(len*OB.zm,4,150);
 camera.position.set(obCl(tx+r*Math.cos(el)*Math.sin(az),x0,x1),obCl(ty+r*Math.sin(el),1.6,110),obCl(tz+r*Math.cos(el)*Math.cos(az),z0,z1));
 camera.lookAt(tx,ty,tz)}
(function(){const cv=$('cv'),P=OB.pts;
 const end=e=>{if(P.delete(e.pointerId)&&!P.size)cv.classList.remove('drag');try{cv.releasePointerCapture(e.pointerId)}catch(_){}};
 cv.addEventListener('pointerdown',e=>{if(!obOn()||obLock()||(e.pointerType==='mouse'&&e.button!==0))return;
  P.set(e.pointerId,{x:e.clientX,y:e.clientY});try{cv.setPointerCapture(e.pointerId)}catch(_){}cv.classList.add('drag');e.preventDefault()});
 cv.addEventListener('pointermove',e=>{const p=P.get(e.pointerId);if(!p||!obOn()||obLock())return;
  if(P.size>=2){let o=null;P.forEach((q,id)=>{if(id!==e.pointerId&&!o)o=q});
   if(o){const d0=Math.hypot(p.x-o.x,p.y-o.y),d1=Math.hypot(e.clientX-o.x,e.clientY-o.y);if(d0>8&&d1>8)OB.tz=obCl(OB.tz*d0/d1,OB.ZMIN,OB.ZMAX)}}
  else{OB.ty=obCl(OB.ty-(e.clientX-p.x)*.008,-OB.YM,OB.YM);OB.tp=obCl(OB.tp+(e.clientY-p.y)*.005,-OB.PM,OB.PM)}
  p.x=e.clientX;p.y=e.clientY});
 cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);cv.addEventListener('lostpointercapture',end);
 addEventListener('blur',()=>{P.clear();cv.classList.remove('drag')});
 cv.addEventListener('wheel',e=>{if(!obOn())return;e.preventDefault();if(obLock())return;OB.tz=obCl(OB.tz*Math.exp(e.deltaY*(e.deltaMode===1?.05:.0012)),OB.ZMIN,OB.ZMAX)},{passive:false});
 cv.addEventListener('contextmenu',e=>{if(obOn())e.preventDefault()});
 $('camReset').onclick=$('tsCamReset').onclick=()=>obReset()})();
function applyQ(){if(!glOK)return;renderer.setPixelRatio(Math.min(devicePixelRatio||1,[1,1.25,2][Q]));renderer.shadowMap.enabled=Q>0;
 if(SUN&&scene){const m=Q>1?2048:1024;if(SUN.shadow.mapSize.x!==m){SUN.shadow.mapSize.set(m,m);if(SUN.shadow.map){SUN.shadow.map.dispose();SUN.shadow.map=null}}scene.traverse(o=>{if(o.material)o.material.needsUpdate=true})}resize()}
const M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.95,metalness:0});
const add=(p,g,c,x=0,y=0,z=0)=>{const m=new THREE.Mesh(g,M(c));m.position.set(x,y,z);p.add(m);return m};
const bx=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);return m};
function label(text,col){const c=document.createElement('canvas');c.width=512;c.height=140;const x=c.getContext('2d');
 x.fillStyle='#CFCCE6';x.beginPath();x.roundRect?x.roundRect(10,14,492,112,50):x.rect(10,14,492,112);x.fill();x.globalAlpha=.75;x.lineWidth=8;x.strokeStyle=col;x.stroke();x.globalAlpha=1;
 x.fillStyle='#2D2A44';x.font='600 54px Fredoka,system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';let t=text;while(x.measureText(t).width>440&&t.length>3)t=t.slice(0,-2);if(t!==text)t+='…';x.fillText(t,256,72);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:Object.assign(new THREE.CanvasTexture(c),{encoding:THREE.sRGBEncoding}),depthTest:false}));s.scale.set(4.6,1.26,1);s.position.y=3.7;s.renderOrder=9;return s}
const gc={},mc={};
const geo=(k,f)=>gc[k]||(gc[k]=f());
const lin=h=>new THREE.Color(h).convertSRGBToLinear();
const dk=c=>{const o=new THREE.Color(c),h={};o.getHSL(h);return o.setHSL(h.h,Math.min(h.s*.9,.5),.08+h.l*.62).getHex()};
const mat=(c,r=.84)=>{const k=c+'_'+r;if(!mc[k]){const m=new THREE.MeshStandardMaterial({color:dk(c),roughness:r,metalness:0});m.color.convertSRGBToLinear();m.userData.keep=1;mc[k]=m}return mc[k]};
const sp=(p,c,x,y,z,sx,sy,sz,r)=>{const m=new THREE.Mesh(geo('s',()=>new THREE.SphereGeometry(1,20,14)),mat(c,r));m.position.set(x,y,z);m.scale.set(sx,sy===undefined?sx:sy,sz===undefined?sx:sz);m.castShadow=true;p.add(m);return m};
const cyl=(p,c,x,y,z,r,h)=>{const m=new THREE.Mesh(geo('c',()=>new THREE.CylinderGeometry(1,1,1,20)),mat(c));m.position.set(x,y,z);m.scale.set(r,h,r);m.castShadow=true;p.add(m);return m};
function rbox(w,h,d,r){const g=new THREE.BoxGeometry(w,h,d,4,4,4),p=g.attributes.position,v=new THREE.Vector3(),q=new THREE.Vector3(),a=w/2-r,b=h/2-r,e=d/2-r,cl=(x,m)=>Math.max(-m,Math.min(m,x));
 for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);q.set(cl(v.x,a),cl(v.y,b),cl(v.z,e));v.sub(q);if(v.lengthSq()>0)v.setLength(r);v.add(q);p.setXYZ(i,v.x,v.y,v.z)}
 g.computeVertexNormals();g.userData.own=1;return g}
const SHIRT=[0xF4BFD2,0xA9D8F5,0xC9B9F0,0xAEE8CC,0xF7E6A1,0xF6C5A8,0xE89DB8,0x86C3EA,0xAE98E6,0x8ED9B8,0xEFD06E,0xEEA882],HAIR=[0x5A4770,0x9B6B55,0xE0B95A,0xD98BA8,0x5FAF8E,0x4B5E8F],SKIN=[0xFFDCC2,0xF1BE98,0xD9A07A,0xFFE6D2],PANT=[0x7C6BAA,0x6FA3C7,0xC98BA5];
const hex=c=>'#'+c.toString(16).padStart(6,'0');
function profile(){const N=240,a=new Float32Array(N+1),p1=Math.random()*6,p2=Math.random()*6,f1=2+Math.random()*3,f2=5+Math.random()*4;let s=0;
 for(let i=0;i<N;i++){const u=i/N;s+=Math.max(.2,1+.6*Math.sin(u*f1*6.283+p1)+.35*Math.sin(u*f2*6.283+p2));a[i+1]=s}for(let i=0;i<=N;i++)a[i]/=s;return a}
function prof(a,s){const N=240,x=s*N,i=Math.min(N-1,Math.floor(x));return a[i]+(a[i+1]-a[i])*(x-i)}
/* ===== KARAKTER CHIBI ASTRONAUT TOY (acuan: figur helm mint, rambut hijau, mata teal, setelan hijau pastel) =====
   Setiap bagian rigid digabung jadi 1 mesh + vertex color: objek sedikit, permukaan mulus.
   Warna identitas kelompok (SHIRT[i%12]) dipakai sebagai aksen: telinga kucing, manset, sepatu, tombol dada, kantong tas. */
const VG=(()=>{const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.42,metalness:0});m.userData.keep=1;return m})();
const VS=(()=>{const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.7,metalness:0});m.userData.keep=1;return m})();
const CKB={},CKS={};
const ckBase=k=>typeof k!=='string'?k:CKB[k]||(CKB[k]=k==='H'?new THREE.SphereGeometry(1,30,22):k==='M'?new THREE.SphereGeometry(1,14,10):k==='L'?new THREE.SphereGeometry(1,9,7):k==='C'?new THREE.CylinderGeometry(1,1,1,18,1):k==='K'?new THREE.ConeGeometry(1,1,5,1):k==='U'?new THREE.TorusGeometry(1,.06,6,18,Math.PI):k==='N'?new THREE.SphereGeometry(1,20,14):k==='T'?new THREE.TorusGeometry(1,.2,8,18,Math.PI):new THREE.TorusGeometry(1,.1,8,26));
/* raw: 0 = gelap malam (dk), 1 = apa adanya, 2 = pastel (sedikit diredam supaya mint tetap cerah) */
const ckCol=(h,raw)=>{if(raw===2){const o=new THREE.Color(h),q={};o.getHSL(q);return o.setHSL(q.h,q.s*.9,q.l*.86).convertSRGBToLinear()}return new THREE.Color(raw?h:dk(h)).convertSRGBToLinear()};
const _M=new THREE.Matrix4(),_Q=new THREE.Quaternion(),_E=new THREE.Euler(),_V=new THREE.Vector3(),_S=new THREE.Vector3(),_N=new THREE.Matrix3(),_W=new THREE.Vector3();
/* part = [jenis|geometri,warna,x,y,z,sx,sy,sz,rotasi(Euler[]|Quaternion),raw] */
function ckMerge(parts){let nv=0,ni=0;for(const p of parts){const g=ckBase(p[0]);nv+=g.attributes.position.count;ni+=g.index.count}
 const pos=new Float32Array(nv*3),nor=new Float32Array(nv*3),col=new Float32Array(nv*3),idx=nv<65535?new Uint16Array(ni):new Uint32Array(ni);let vo=0,io=0;
 for(const p of parts){const g=ckBase(p[0]),pa=g.attributes.position,na=g.attributes.normal,ia=g.index,r=p[8];
  if(r&&r.isQuaternion)_Q.copy(r);else{if(r)_E.set(r[0],r[1],r[2]);else _E.set(0,0,0);_Q.setFromEuler(_E)}
  _M.compose(_V.set(p[2],p[3],p[4]),_Q,_S.set(p[5],p[6],p[7]));_N.getNormalMatrix(_M);const c=ckCol(p[1],p[9]);
  for(let i=0;i<pa.count;i++){const o=(vo+i)*3;_W.fromBufferAttribute(pa,i).applyMatrix4(_M);pos[o]=_W.x;pos[o+1]=_W.y;pos[o+2]=_W.z;
   _W.fromBufferAttribute(na,i).applyMatrix3(_N).normalize();nor[o]=_W.x;nor[o+1]=_W.y;nor[o+2]=_W.z;col[o]=c.r;col[o+1]=c.g;col[o+2]=c.b}
  for(let i=0;i<ia.count;i++)idx[io+i]=ia.getX(i)+vo;vo+=pa.count;io+=ia.count}
 const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(pos,3));G.setAttribute('normal',new THREE.BufferAttribute(nor,3));G.setAttribute('color',new THREE.BufferAttribute(col,3));G.setIndex(new THREE.BufferAttribute(idx,1));return G}
const ckShared=(k,f)=>CKS[k]||(CKS[k]=f());
const ckMesh=(G,own,cast,mat)=>{if(own)G.userData.own=true;const m=new THREE.Mesh(G,mat||VG);m.castShadow=!!cast;return m};
const CKX=new THREE.Vector3(1,0,0),CKZ=new THREE.Vector3(0,0,1),HX=1.12,HY=1.02,HZ=1.06,HEADY=2.95,CK_SC=.72;
/* ===== KONFIGURASI KARAKTER (mudah diubah) =====
   F = Pink Astronaut (perempuan), M = Green Astronaut (laki-laki).
   Warna helm, baju, celana, sepatu, rambut, mata, dan titik peringkat dikumpulkan di sini. */
const CK_PAL={
 F:{k:'F',name:'Pink Astronaut',main:0xFFD6E6,main2:0xFFBFD8,light:0xFFEEF5,dark:0xF59BC0,white:0xFFF6FA,acc:0xCDB4F5,acc2:0xAE86E6,gold:0xFFE08A,
    iris:0x8B63D6,irisL:0xE2C8FF,pupil:0x2A1745,lash:1,dot:0xF4A6C8,hair:[0xF28DB7,0xB88BE3,0x8A5A4B,0xF6A9C6]},
 M:{k:'M',name:'Green Astronaut',main:0x9BE8BC,main2:0x86DDA6,light:0xC4F5D8,dark:0x4DB87C,white:0xEAF6F1,acc:0x7BDCEB,acc2:0x4FC3D8,gold:0xFFE08A,
    iris:0x2FB9B6,irisL:0x7FF0E4,pupil:0x12202A,lash:0,dot:0x86DDA6,hair:[0x2B2F45,0x2EB8A8,0x3C5B50,0x6B4B3A]}};
/* jenis karakter: tidak ditebak dari nama. Dipilih manual lewat tombol ♀/♂ di tiap baris daftar;
   bila belum dipilih, dipakai CK_DEFAULT_SEX (ubah fungsi ini untuk default lain, mis. ()=>'F'). */
const CK_DEFAULT_SEX=i=>i%2?'M':'F';
const sexNorm=v=>{v=String(v==null?'':v).trim().toLowerCase();return/^(f|female|perempuan|wanita|p)$/.test(v)?'F':/^(m|male|laki-laki|laki|pria|l)$/.test(v)?'M':null};
const cleanSexMap=value=>{const out=Object.create(null);if(value&&typeof value==='object'&&!Array.isArray(value)){Object.keys(value).forEach(k=>{const v=sexNorm(value[k]);if(k&&v)out[String(k).slice(0,80)]=v})}return out};
const SX={g:cleanSexMap(LS.get('lmp_sx_g',{})),n:cleanSexMap(LS.get('lmp_sx_n',{}))};
const sxKey=n=>String(n==null?'':n).trim().toLowerCase();
const sxGet=(m,name,i)=>sexNorm(m[sxKey(name)])||CK_DEFAULT_SEX(i);
/* titik di permukaan elipsoid (sumbu x = depan) + arah normal */
function ckEs(rx,ry,rz,y,z,off){const t=Math.max(1-(y/ry)**2-(z/rz)**2,1e-4),x=rx*Math.sqrt(t),n=new THREE.Vector3(x/(rx*rx),y/(ry*ry),z/(rz*rz)).normalize();
 return{p:new THREE.Vector3(x,y,z).addScaledVector(n,off||0),n,q:new THREE.Quaternion().setFromUnitVectors(CKX,n),qz:new THREE.Quaternion().setFromUnitVectors(CKZ,n)}}
const hsf=(y,z,off)=>ckEs(HX,HY,HZ,y,z,off);
const ckRot=(q,ex,ey,ez)=>q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(ex,ey,ez)));
const ckLoc=(e,x,y,z)=>new THREE.Vector3(x,y,z).applyQuaternion(e.q).add(e.p);
/* ---- ornamen datar yang menempel di permukaan (frame lokal e: x = normal, y = atas, z = samping) ---- */
function ckStar(e,r,col,out,raw){out.push(['M',col,e.p.x,e.p.y,e.p.z,.05,r*.5,r*.5,e.q,raw==null?1:raw]);
 for(let k=0;k<5;k++){const a=k/5*Math.PI*2,p=ckLoc(e,0,Math.cos(a)*r*.5,Math.sin(a)*r*.5);out.push(['K',col,p.x,p.y,p.z,.035,r,r*.34,ckRot(e.q,a,0,0),raw==null?1:raw])}}
function ckHeart(e,s,col,out,raw){for(const z of[-1,1]){const p=ckLoc(e,0,.22*s,z*.3*s);out.push(['M',col,p.x,p.y,p.z,.05,.38*s,.38*s,e.q,raw==null?1:raw])}
 const b=ckLoc(e,0,-.27*s,0);out.push(['K',col,b.x,b.y,b.z,.05,.8*s,.66*s,ckRot(e.q,Math.PI,0,0),raw==null?1:raw])}
function ckBow(e,col,knot,out,k){k=k||1;for(const s of[-1,1]){const p=ckLoc(e,0,0,s*.17*k);out.push(['M',col,p.x,p.y,p.z,.07*k,.1*k,.17*k,ckRot(e.q,-s*.45,0,0),2])}out.push(['M',knot,e.p.x,e.p.y,e.p.z,.085*k,.075*k,.075*k,e.q,2])}
/* ---- helm: cangkang bola dengan jendela wajah + bingkai + cuping + ventilasi ---- */
const HRX=1.38,HRY=1.3,HRZ=1.4,OPY=.66,OPZ=.72,OPC=-.06;
function ckHelmet(P){return ckShared('helm'+P.k,()=>{
 const g0=new THREE.SphereGeometry(1,36,26),pa=g0.attributes.position,ia=g0.index,keep=[];
 for(let t=0;t<ia.count;t+=3){let cx=0,cy=0,cz=0;for(let k=0;k<3;k++){const v=ia.getX(t+k);cx+=pa.getX(v);cy+=pa.getY(v);cz+=pa.getZ(v)}cx/=3;cy/=3;cz/=3;
  const iy=(cy-OPC)/OPY,iz=cz/OPZ;if(cx>0&&iy*iy+iz*iz<1.0)continue;keep.push(ia.getX(t),ia.getX(t+1),ia.getX(t+2))}
 g0.setIndex(keep);
 const A=[[g0,P.main,0,0,0,HRX,HRY,HRZ,0,2]];
 {const pts=[];for(let k=0;k<48;k++){const a=k/48*Math.PI*2,y=OPC+OPY*Math.sin(a),z=OPZ*Math.cos(a),x=Math.sqrt(Math.max(1-y*y-z*z,0));pts.push(new THREE.Vector3(x*HRX*1.004,y*HRY*1.004,z*HRZ*1.004))}
  A.push([new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),72,.1,8,true),P.light,0,0,0,1,1,1,0,2])}
 /* cuping telinga (headphone) di kedua sisi */
 for(const s of[-1,1]){A.push(['N',P.main2,0,.0,s*1.4,.5,.7,.36,0,2]);A.push(['N',P.light,0,.0,s*1.72,.36,.54,.12,0,2]);A.push(['L',P.dark,.05,.0,s*1.8,.16,.2,.08,0,2])}
 {const e=ckEs(HRX,HRY,HRZ,1.2,0,.01);A.push(['M',P.light,e.p.x,e.p.y,e.p.z,.03,.13,.34,e.q,2])}
 {const e=ckEs(HRX,HRY,HRZ,.92,.55,.012);A.push(['M',0xFFFFFF,e.p.x,e.p.y,e.p.z,.02,.4,.075,ckRot(e.q,.5,0,0),1]);const f=ckEs(HRX,HRY,HRZ,.62,.98,.012);A.push(['L',0xFFFFFF,f.p.x,f.p.y,f.p.z,.02,.1,.07,f.q,1])}
 return ckMerge(A)})}
/* ---- telinga kucing + aksesori helm (per jenis & varian) ---- */
function ckCap(P,ai){return ckShared('cap'+P.k+ai,()=>{const A=[];
 for(const s of[-1,1])A.push(['K',P.light,-.2,1.28,s*.82,.5,.72,.2,[s*.55,0,-.15],2]);
 const e=ckEs(HRX,HRY,HRZ,.9,-.5,.012);
 if(P.k==='F'){if(ai===0)ckStar(e,.3,P.gold,A,1);else if(ai===1)ckBow(e,P.dark,P.acc2,A,1.5);else ckHeart(e,.38,P.dark,A,2)}
 else{if(ai===0)ckStar(e,.3,0xFFFFFF,A,1);
  else if(ai===1){A.push(['M',P.light,e.p.x,e.p.y,e.p.z,.05,.3,.3,e.q,2]);for(const a of[-1,1])for(const b of[-1,1]){const p=ckLoc(e,0,a*.19,b*.19);A.push(['L',P.acc2,p.x,p.y,p.z,.05,.05,.05,e.q,2])}A.push(['M',P.acc,e.p.x,e.p.y,e.p.z,.08,.1,.1,e.q,2])}
  else for(let k=0;k<3;k++){const p=ckLoc(e,0,(k-1)*.14,0);A.push(['M',k===1?P.acc:P.acc2,p.x,p.y,p.z,.04,.055,.34-.06*Math.abs(k-1),e.q,2])}}
 return ckMerge(A)})}
/* ---- rambut: yang terlihat lewat jendela helm = poni + rambut sisi wajah ---- */
function ckHair(sx,st,hc,P){
 const fr=(y,z,rx,ry,rz,q)=>{const e=hsf(y,z,.03);P.push(['M',hc,e.p.x,e.p.y,e.p.z,rx,ry,rz,q||0,2])},
  side=(z,len,w)=>{const e=hsf(-.12,z,.02);P.push(['M',hc,e.p.x,e.p.y,e.p.z,.15,len*.55,w||.16,0,2])};
 P.push(['H',hc,.04,.34,0,1.16,.86,1.12,0,2]);
 if(sx==='F'){
  if(st===0){[[-.58,.6],[-.3,.66],[0,.68],[.3,.66],[.58,.6]].forEach(a=>fr(a[1],a[0],.2,.17,.25));side(-.88,.6);side(.88,.6)}
  else if(st===1){[[-.58,.62],[-.3,.68],[0,.72],[.3,.66],[.58,.52]].forEach(a=>fr(a[1],a[0],.2,.18,.26,[0,0,.0]));fr(.46,.66,.2,.15,.22);side(-.88,.34);side(.88,.44)}
  else{[[-.62,.5],[-.42,.58],[-.2,.66]].forEach(a=>{fr(a[1],a[0],.2,.16,.22);fr(a[1],-a[0],.2,.16,.22)});side(-.9,.78,.12);side(.9,.78,.12)}}
 else{
  if(st===0){[[-.5,.7],[-.25,.74],[0,.76],[.25,.74],[.5,.7]].forEach(a=>fr(a[1],a[0],.19,.14,.23));side(-.88,.2,.13);side(.88,.2,.13)}
  else if(st===1){[[.5,.62],[.26,.7],[0,.76],[-.26,.8],[-.5,.78]].forEach(a=>fr(a[1],a[0],.2,.16,.24));side(-.88,.22,.13);side(.88,.3,.13)}
  else{[-.6,-.3,0,.3,.6].forEach((z,k)=>{const e=hsf(.6-Math.abs(z)*.12,z,.045);P.push(['K',hc,e.p.x,e.p.y,e.p.z,.15,.34,.15,[Math.PI+(k-2)*.12,0,0],2])});fr(.78,0,.24,.14,.7);side(-.88,.2,.13);side(.88,.2,.13)}}
}
function ckGeos(P){
 return{
  eye:ckShared('eye'+P.k,()=>{const K=1.2,u=P.lash?1.1:1,A=[['M',0xE8E4F2,0,0,0,.075*K,.30*K,.27*K,0,1],['M',P.iris,.06*K,0,0,.09*K,.265*K,.235*K,0,1],['M',P.irisL,.085*K,-.1*K,0,.07*K,.11*K,.16*K,0,1],['M',P.pupil,.105*K,.01,0,.085*K,.15*K,.13*K,0,1],
    ['L',0xFFFFFF,.165*K,.11*K,.09*K,.062*K,.068*K,.062*K,0,1],['L',0xFFFFFF,.14*K,-.12*K,-.07*K,.032*K,.034*K,.032*K,0,1],['U',0x4A2E2E,.05*K,0,0,.29*K*u,.33*K*u,.29*K*u,[0,Math.PI/2,0],1]];
    if(P.lash)A.push(['U',0x4A2E2E,.052*K,.015,0,.3*K*u,.345*K*u,.3*K*u,[0,Math.PI/2,0],1]);return ckMerge(A)}),
  sm:ckShared('sm2',()=>ckMerge([['T',0xB5476B,0,0,.07,.1,.07,.1,[0,Math.PI/2,Math.PI]],['T',0xB5476B,0,0,-.07,.1,.07,.1,[0,Math.PI/2,Math.PI]]])),
  mo:ckShared('mo2',()=>ckMerge([['M',0x5A1F3E,0,0,0,.08,.15,.15],['M',0xF08FA8,.03,-.09,0,.06,.07,.1],['M',0xFFF7E8,.05,.12,0,.04,.035,.11,0,1]])),
  sw:ckShared('sw2',()=>ckMerge([['M',0xA8DCFF,0,0,0,.08,.13,.08,0,1],['L',0xA8DCFF,0,.13,0,.04,.07,.04,0,1]]))}}
function ckBrow(){return ckShared('brow2',()=>ckMerge([['C',0x9B6B55,0,0,0,.03,.22,.03,[Math.PI/2,0,0]],['L',0x9B6B55,0,0,.11,.03,.03,.03],['L',0x9B6B55,0,0,-.11,.03,.03,.03]]))}
/* ---- badan, tas, tangan, kaki: identik untuk satu jenis => geometri dibagi pakai ---- */
function ckTorso(P){return ckShared('torso'+P.k,()=>{
 const tp=[['H',P.main2,0,0,0,.62,.6,.58,0,2],['M',P.main2,0,-.42,0,.6,.3,.55,0,2]],es=(y,z,off)=>ckEs(.62,.6,.58,y,z,off||0);
 {const f=Math.sqrt(1-(.55/.6)**2);tp.push(['R',P.white,0,.55,0,.62*f*1.2,.58*f*1.2,.9,[Math.PI/2,0,0],2])}
 {const f=Math.sqrt(1-(.3/.6)**2);tp.push(['R',P.dark,0,-.3,0,.62*f*1.01,.58*f*1.01,.5,[Math.PI/2,0,0],2])}
 {const e=es(.13,0,.02);tp.push(['M',P.acc,e.p.x,e.p.y,e.p.z,.05,.17,.17,e.q,2]);
  if(P.k==='F')ckHeart(es(.13,0,.05),.17,P.white,tp,1);
  else for(const r of[Math.PI/4,-Math.PI/4]){const d=es(.13,0,.055);tp.push(['M',P.acc2,d.p.x,d.p.y,d.p.z,.02,.17,.025,ckRot(d.q,r,0,0),2])}}
 for(const z of[-.34,.34]){const e=es(.1,z,.02);tp.push(['M',P.light,e.p.x,e.p.y,e.p.z,.04,.18,.06,e.q,2])}
 {const e=es(-.2,0,.02);tp.push(['M',P.acc,e.p.x,e.p.y,e.p.z,.045,.1,.1,e.q,2]);tp.push(['L',0xFFFFFF,e.p.x+.035,e.p.y,e.p.z,.02,.04,.04,e.q,1])}
 return ckMerge(tp)})}
function ckBag(P){return ckShared('bag'+P.k,()=>ckMerge([['M',P.light,-.17,0,0,.3,.5,.44,0,2],['M',P.acc,-.38,-.2,0,.1,.2,.3,0,2],['M',P.main2,-.2,.3,.16,.14,.1,.1,0,2],['M',P.main2,-.2,.3,-.16,.14,.1,.1,0,2]]))}
function ckArm(P){return ckShared('arm'+P.k,()=>ckMerge([['M',P.main2,0,0,0,.2,.2,.2,0,2],['C',P.main2,0,-.15,0,.155,.3,.155,0,2],['C',P.dark,0,-.31,0,.162,.06,.162,0,2],['C',P.acc,0,-.38,0,.168,.1,.168,0,2],['M',0xFFFFFF,0,-.53,0,.15,.15,.15,0,1],['M',P.acc2,0,.15,0,.13,.045,.11,0,2]]))}
function ckLeg(P){return ckShared('leg'+P.k,()=>ckMerge([['C',P.main2,0,-.12,0,.2,.34,.2,0,2],['M',P.light,.19,-.1,0,.05,.13,.11,0,2],['C',P.acc,0,-.3,0,.205,.08,.205,0,2],['M',P.main,.1,-.55,0,.36,.22,.29,0,2],['M',0xFFF7E8,.1,-.72,0,.37,.075,.3]]))}
function makeChar(i,name,sx,v){sx=sexNorm(sx)||CK_DEFAULT_SEX(i);v=v==null?i:v;const P=CK_PAL[sx];
 const g=new THREE.Group(),wrap=new THREE.Group(),rig=new THREE.Group();wrap.scale.setScalar(CK_SC);g.add(wrap);wrap.add(rig);
 const sc=SHIRT[i%12],sk=SKIN[(v*3)%4],hc=P.hair[v%4],st=v%3,ai=(v+((v/3)|0))%3,G=ckGeos(P);
 const torso=new THREE.Group();torso.position.y=1.18;torso.add(ckMesh(ckTorso(P),0,1));rig.add(torso);
 /* kepala: wajah (kulit+rambut) di dalam helm mengilap */
 const head=new THREE.Group();head.position.y=HEADY;rig.add(head);
 const hp=[['H',sk,0,0,0,HX,HY,HZ,0,1]];
 for(const z of[-1,1]){const c=hsf(-.34,z*.7,0);hp.push(['L',sx==='F'?0xF48FB0:0xF29BA8,c.p.x,c.p.y,c.p.z,.03,.13,.2,c.q,1])}
 {const n=hsf(-.3,0,.03).p;hp.push(['L',sk,n.x,n.y,n.z,.07,.06,.07,0,1])}
 ckHair(sx,st,hc,hp);
 head.add(ckMesh(ckMerge(hp),1,0,VS));
 head.add(ckMesh(ckHelmet(P),0,1));
 head.add(ckMesh(ckCap(P,ai),0,1));
 const eyes=[],brows=[],bz=[],hpa=[];
 for(const z of[-1,1]){const e=ckMesh(G.eye,0,0),pz=hsf(-.06,z*.42,0);e.position.copy(pz.p);e.quaternion.copy(pz.q);head.add(e);eyes.push(e);
  const an=new THREE.Group(),pb=hsf(.4,z*.42,.02);an.position.copy(pb.p);an.quaternion.copy(pb.q);head.add(an);
  const b=ckMesh(ckBrow(),0,0);an.add(b);brows.push(b);bz.push(z);
  const a=hsf(-.06,z*.42,.08);hpa.push(['T',0x3A2530,a.p.x,a.p.y,a.p.z,.2,.2,.2,ckRot(a.q,0,Math.PI/2,0),1])}
 const hpm=ckMesh(ckMerge(hpa),1,0);hpm.visible=false;head.add(hpm);
 const sm=ckMesh(G.sm,0,0),ps=hsf(-.55,0,.012);sm.position.copy(ps.p);sm.quaternion.copy(ps.q);head.add(sm);
 const mo=ckMesh(G.mo,0,0),pm=hsf(-.57,0,0);mo.position.copy(pm.p);mo.quaternion.copy(pm.q);mo.visible=false;head.add(mo);
 const sw=ckMesh(G.sw,0,0),pw=hsf(.5,.78,.04);sw.position.copy(pw.p);sw.quaternion.copy(pw.q);sw.visible=false;sw.userData.y0=pw.p.y;head.add(sw);
 const bag=new THREE.Group();bag.position.set(-.62,1.3,0);rig.add(bag);bag.add(ckMesh(ckBag(P),0,1));
 const AG=ckArm(P),LG=ckLeg(P);
 const limb=(y,z,G2)=>{const p=new THREE.Group();p.position.set(0,y,z);p.add(ckMesh(G2,0,1));rig.add(p);return p};
 const armL=limb(1.5,-.64,AG),armR=limb(1.5,.64,AG),legL=limb(.8,-.3,LG),legR=limb(.8,.3,LG);
 const lb=label(name,hex(sc));lb.position.y=4.3+(i%2)*.75;lb.scale.set(3.8,1.04,1);g.add(lb);
 return{g,rig,head,bag,armL,armR,legL,legR,torso,eyes,brows,bz,sm,mo,hp:hpm,sw,sx,dot:P.dot,ph0:Math.random()*6.28,ft:0,ph:Math.random()*6,ev:null,evT:2+Math.random()*3,pr:profile(),fin:false,sfxT:0,s:0,sq:0,py:0,pa:0,amp:0,cel:0,bl:1+Math.random()*3}}
/* ekspresi & gerak idle: mood 0 senyum, 1 gugup, 2 semangat; happy = mata ^_^ ; idle 0..1 = goyang kepala halus */
function ckFx(c,dt,mood,happy,idle,rm){
 c.ft+=dt;const t=c.ft+c.ph0;let bk=1;if(!rm){c.bl-=dt;bk=c.bl<.12?.12:1;if(c.bl<=0)c.bl=2+Math.random()*3}
 c.eyes[0].visible=c.eyes[1].visible=!happy;c.hp.visible=!!happy;if(!happy)c.eyes[0].scale.y=c.eyes[1].scale.y=bk*(mood===1?1.1:1);
 c.sm.visible=mood===0&&!happy;const op=mood>0||happy;c.mo.visible=op;if(op)c.mo.scale.set(1,happy?1.05:mood===1?1:.8,happy?1.4:mood===1?.62:1.2);
 const by=happy?.06:mood===1?.09:mood===2?.045:0,nv=mood===1&&!happy;
 for(let k=0;k<2;k++){c.brows[k].position.y=by;c.brows[k].rotation.x=nv?.4*c.bz[k]:0}
 c.sw.visible=nv;if(nv)c.sw.position.y=c.sw.userData.y0+Math.sin(t*5)*.03;
 if(!rm){const b=Math.sin(t*2.2);c.torso.scale.set(1+b*.012,1+b*.02,1+b*.012);c.head.position.y=HEADY+b*.012;
  if(idle){c.head.rotation.z+=Math.sin(t*.8)*.03*idle;c.head.rotation.y+=Math.sin(t*.55+1.7)*.08*idle}}}
/* tangan terangkat membuka ke samping agar tidak menembus helm */
function ckArms(c,aL,aR){const f=a=>{const u=-Math.cos(a);return u>0?-1.15*u:-.1*u};c.armL.rotation.x=f(aL);c.armR.rotation.x=-f(aR)}
let conf=null,cfT=0,specs=[];const CFC=[0xD99AB4,0xD8C77F,0x92CDB5,0x92B8DE,0xAFA2DC,0xDDA993];
function mkConf(){const mt=new THREE.MeshBasicMaterial({}),im=new THREE.InstancedMesh(geo('cf',()=>new THREE.BoxGeometry(.4,.03,.25)),mt,160),d=new THREE.Object3D(),col=new THREE.Color(),P=[];
 for(let i=0;i<160;i++){P.push({l:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,r:0,vr:0});d.scale.set(0,0,0);d.updateMatrix();im.setMatrixAt(i,d.matrix);im.setColorAt(i,col.setHex(CFC[i%6]).convertSRGBToLinear())}
 im.frustumCulled=false;scene.add(im);conf={im,P,d,col,i:0,dirty:0}}
function burst(x,y,z,n){if(!conf)return;if(TS.on&&TS.rm)n=Math.ceil(n/2);for(let k=0;k<n;k++){const id=conf.i++%160,p=conf.P[id];p.l=2.8+Math.random();p.x=x+(Math.random()-.5)*4;p.y=y+Math.random()*2;p.z=z+(Math.random()-.5)*(R?R.groups.length*2.6:4);p.vx=(Math.random()-.5)*6;p.vy=4+Math.random()*6;p.vz=(Math.random()-.5)*5;p.r=Math.random()*6;p.vr=(Math.random()-.5)*14;conf.im.setColorAt(id,conf.col.setHex(CFC[k%6]).convertSRGBToLinear())}conf.im.instanceColor.needsUpdate=true}
function confUpd(dt){if(!conf)return;const{im,P,d}=conf;for(let i=0;i<160;i++){const p=P[i];if(p.l>0){p.l-=dt;p.vy-=9*dt;p.x+=p.vx*dt;p.y=Math.max(.3,p.y+p.vy*dt);p.z+=p.vz*dt;p.r+=p.vr*dt;d.position.set(p.x,p.y,p.z);d.rotation.set(p.r,p.r*.7,0);d.scale.setScalar(p.l>0?1:0);d.updateMatrix();im.setMatrixAt(i,d.matrix);conf.dirty=1}}
 if(conf.dirty){im.instanceMatrix.needsUpdate=true;conf.dirty=0}}
function clear(){
 if(scene){
  const disposedGeometry=new Set(),disposedMaterial=new Set();
  scene.traverse(o=>{
   const g=o.geometry;if(g&&g.userData&&g.userData.own&&!disposedGeometry.has(g)){g.dispose();disposedGeometry.add(g)}
   const materials=Array.isArray(o.material)?o.material:(o.material?[o.material]:[]);
   materials.forEach(m=>{if(m&&!m.userData?.keep&&!disposedMaterial.has(m)){if(m.map&&typeof m.map.dispose==='function')m.map.dispose();m.dispose();disposedMaterial.add(m)}});
  });
 }
 scene=null;chars=[];conf=null;specs=[];SUN=null;
 if(typeof RC!=='undefined'&&RC){RC.sc=null;RC.pt=null;RC.dc=[];RC.sw=[];RC.pl=[];RC.zones=null;RC.n=0}
 if(typeof OB!=='undefined'&&OB.pts){OB.pts.clear();const cv=$('cv');if(cv)cv.classList.remove('drag')}
}
const rb=(w,h,d,r,c,x,y,z,ro)=>{const m=new THREE.Mesh(rbox(w,h,d,r),mat(c,ro));m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=true;scene.add(m);return m};
const bl=(c,x,y,z,sx,sy,sz)=>{const m=sp(scene,c,x,y,z,sx,sy,sz);m.receiveShadow=true;m.castShadow=false;return m};
function arch(x,c,txt,W){const FL=[0xF4BFD2,0xF7E6A1,0xAEE8CC,0xA9D8F5];rb(.8,6,.8,.3,c,x,3,-W/2);rb(.8,6,.8,.3,c,x,3,W/2);rb(.7,1.3,W+1.4,.34,c,x,6.4,0);
 const l=label(txt,'#C9B9F0');l.scale.set(6,1.65,1);l.position.set(x,6.4,0);scene.add(l);for(let k=0;k<4;k++)rb(.14,.9,1.3,.06,FL[k],x,7.5,-W/2+.7+k*((W-1.4)/3))}
/* ===== UPGRADE ARENA URUTAN PRESENTASI: garis lintasan neon, layar, ring podium, partikel ===== */
var RC={pt:null,dc:[],sc:null};
function rcDeco(n,W){RC.sc=scene;RC.dc=[];const cy=0x5FD0B5,pk=0xF08FB5,px=L+11;
 for(let i=0;i<=n;i++)tsNeon(L+22,.04,.08,L/2+3,.3,(i-n/2)*2.6,i%2?cy:0x8E83D6);
 for(const sd of[-1,1]){tsNeon(.3,7,.3,L+1,3.5,sd*W/2,pk);tsNeon(.3,5,.3,-.5,2.5,sd*W/2,cy)}
 const hs=label('URUTAN PRESENTASI','#DCE8FF');hs.scale.set(15,3.8,1);hs.position.set(px,10,-W/2-1);scene.add(hs);
 for(const[c,r]of[[0xF7E6A1,3.4],[cy,4.6]]){const rg=new THREE.RingGeometry(r,r+.18,48);rg.userData.own=1;const m=new THREE.Mesh(rg,new THREE.MeshBasicMaterial({color:lin(c),transparent:true,opacity:.7,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(px,.32,0);scene.add(m);RC.dc.push(m)}
 const k=RMq.matches?45:90,a=new Float32Array(k*3);for(let i=0;i<k;i++){a[i*3]=Math.random()*(L+34)-4;a[i*3+1]=Math.random()*12;a[i*3+2]=(Math.random()-.5)*(W+10)}
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(a,3));pg.userData.own=1;RC.pt=new THREE.Points(pg,new THREE.PointsMaterial({color:lin(0xDCE8FF),size:.3,transparent:true,opacity:.5,depthWrite:false}));scene.add(RC.pt)}
function rcFx(dt){
 if(!scene||RC.sc!==scene||!RC.pt)return;
 const quality=RMq.matches?.5:1,attr=RC.pt.geometry.attributes.position,A=attr.array;
 for(let i=1;i<A.length;i+=3){A[i]+=dt*.45*quality;if(A[i]>12)A[i]=.4}attr.needsUpdate=true;
 const q=performance.now()/1000;
 RC.dc.forEach((m,i)=>{const u=1+.045*quality*Math.sin(q*1.6+i*2);m.scale.set(u,u,1)});
 (RC.sw||[]).forEach(o=>{o.g.rotation.y+=dt*o.s*quality;o.g.rotation.z=Math.sin(q*1.4+o.phase)*.045*quality});
 (RC.pl||[]).forEach(o=>{
  const p=q*1.25+o.i*.75+o.k*1.8+o.phase;
  o.g.position.x=o.baseX+Math.sin(p*.72)*.28*quality;
  o.g.position.y=o.baseY+Math.sin(p*1.25)*.20*quality;
  o.g.position.z=o.baseZ+Math.sin(p)*.58*quality;
  o.g.rotation.z=Math.sin(p*.9)*.075*quality;
  o.g.rotation.x=Math.cos(p*.8)*.055*quality;
  if(o.surface&&o.surface.material){
   const beat=(Math.sin(p*1.7)+1)*.5;
   o.surface.material.opacity=.48+.52*beat;
   o.surface.material.emissiveIntensity=.08+.28*beat;
  }
 });
}

/* ===== RINTANGAN: Hurdle Dash, Spinning Sweep, Shifting Platforms (urutan zona diacak tiap lomba; tidak memengaruhi hasil) ===== */
function rcPH(i,k){return .28+.42*(RMq.matches?.5:1)*(.5+.5*Math.sin(performance.now()/1000*1.7+i*.9+k*2.1))}
function rcObs(n){
 RC.n=n;RC.sw=[];RC.pl=[];
 const Z=[10,26,42],T=['h','s','p'];
 for(let i=2;i>0;i--){const j=Math.random()*(i+1)|0;[T[i],T[j]]=[T[j],T[i]]}
 RC.zones=Z.map((x,i)=>({x,t:T[i]}));
 const col=[0xF08FB5,0xF7E6A1,0x5FD0B5,0x8E83D6],H=[.72,.98,1.22],W=n*2.6+6;
 const titles={h:'HURDLE DASH',s:'SWINGING HAMMERS',p:'VANISHING TILES'};
 RC.zones.forEach((Zn,zoneIndex)=>{
  const c=Zn.t==='h'?0xF08FB5:Zn.t==='s'?0x5FD0B5:0xF7E6A1;
  tsNeon(.12,.06,W,Zn.x,.31,0,c);tsNeon(.12,.06,W,Zn.x+12,.31,0,c);
  const title=label(titles[Zn.t],hex(c));title.scale.set(5.8,1.45,1);title.position.set(Zn.x+6,5.2,-W/2-1.9);scene.add(title);
  /* danger bars at both entries make the zone boundary obvious */
  for(const xx of [Zn.x+.35,Zn.x+11.65]){
   rb(.34,.065,W-.25,.04,0x29243F,xx,.255,0);
   const step=(W-.5)/Math.max(1,Math.floor(W/1.7));
   for(let k=0;k<Math.floor(W/1.7);k++){
    const zz=-(W-.5)/2+step*(k+.5);
    const stripe=rb(.38,.075,step*.58,.035,k%2?0xFFF0C7:0xF08FB5,xx,.30,zz);
   }
  }
  if(Zn.t==='p'){
   /* dark pit + separated floating tiles: now clearly reads as a hazardous crossing */
   rb(11.8,.07,W-.2,.08,0x171729,Zn.x+6,.16,0);
   rb(11.2,.035,W-.65,.04,0x3A2448,Zn.x+6,.205,0);
   for(const side of [-1,1]){
    tsNeon(11.5,.09,.18,Zn.x+6,.27,side*(W/2-.1),0xF7E6A1);
    for(let k=0;k<7;k++){
     const p=rb(.72,.045,.12,.04,k%2?0xF08FB5:0xF7E6A1,Zn.x+.75+k*1.72,.27,side*(W/2-.36));
    }
   }
   /* small hazard lamps around the edge of the pit */
   for(const side of [-1,1])for(let k=0;k<4;k++){
    const x=Zn.x+1.2+k*3.1;
    rb(.25,.52,.25,.11,0x4B4778,x,.48,side*(W/2-.25));
    bl(k%2?0xF08FB5:0xF7E6A1,x,.82,side*(W/2-.25),.16,.16,.16);
   }
   for(let i=0;i<n;i++){
    const laneZ=(i-(n-1)/2)*2.6;
    for(let k=0;k<3;k++){
     const x=Zn.x+2+k*4;
     const zig=(k%2===0?-1:1)*(.42+(i%3)*.08);
     const z=laneZ+zig,g=new THREE.Group();g.position.set(x,.2,z);scene.add(g);
     const part=(w,h,d,r,color,px,py,pz)=>{const m=rb(w,h,d,r,color,0,0,0);scene.remove(m);g.add(m);m.position.set(px,py,pz);return m};
     part(1.98,.22,1.95,.20,0x302B51,0,-.13,0);
     const surface=part(1.72,.15,1.68,.17,col[(i+k)%col.length],0,.035,0);
     surface.material=new THREE.MeshStandardMaterial({color:lin(col[(i+k)%col.length]),roughness:.58,metalness:0,emissive:lin(col[(i+k)%col.length]),emissiveIntensity:.18,transparent:true,opacity:1});
     part(1.42,.055,.12,.04,0xFFF0C7,0,.125,-.69);
     part(1.42,.055,.12,.04,0xFFF0C7,0,.125,.69);
     part(.12,.055,1.25,.04,0xD7C6FF,-.72,.125,0);
     part(.12,.055,1.25,.04,0xD7C6FF,.72,.125,0);
     part(.36,.06,.36,.1,0xF7E6A1,0,.145,0);
     /* chevrons on the tile top give a readable forward direction */
     for(let a=-1;a<=1;a++){
      const mark=part(.24,.035,.08,.025,0x29243F,a*.34,.126,.22);
      mark.rotation.y=-.35;
     }
     RC.pl.push({g,i,k,baseX:x,baseY:.2,baseZ:z,phase:Math.random()*Math.PI*2,surface});
    }
   }
  }else if(Zn.t==='h'){
   /* chunky, color-coded hurdle gates rather than thin decorative posts */
   for(let i=0;i<n;i++){
    const z=(i-(n-1)/2)*2.6;
    for(let k=0;k<3;k++){
     const h=H[(i+k)%3],hx=Zn.x+2+k*4,gateCol=col[(i+k)%col.length];
     rb(.34,h+.25,.32,.13,0x51477F,hx,h/2,z-.96);
     rb(.34,h+.25,.32,.13,0x51477F,hx,h/2,z+.96);
     /* high contrast padded crossbar in three connected segments */
     for(let seg=0;seg<3;seg++)rb(.30,.28,.68,.11,seg===1?0xFFF0C7:gateCol,hx,h,z-.68+seg*.68);
     bl(0xF7E6A1,hx,h+.28,z-.96,.13,.13,.13);bl(0xF7E6A1,hx,h+.28,z+.96,.13,.13,.13);
     rb(.42,.08,2.28,.08,0x29243F,hx,.29,z);
    }
   }
  }else{
   /* heavy swing beams with padded hammer ends and a visible pivot */
   for(let i=0;i<n;i++){
    const z=(i-(n-1)/2)*2.6,xp=Zn.x+6,g=new THREE.Group();g.position.set(xp,.98,z);scene.add(g);
    rb(.52,.48,.52,.18,0x51477F,xp,.34,z);
    rb(.38,.12,.38,.12,0xF7E6A1,xp,.62,z);
    const part=(w,h,d,r,color,px,py,pz)=>{const m=rb(w,h,d,r,color,0,0,0);scene.remove(m);g.add(m);m.position.set(px,py,pz);return m};
    part(2.85,.38,.46,.17,i%2?0x5FD0B5:0xF08FB5,0,0,0);
    part(.22,.44,.50,.12,0xFFF0C7,0,.02,0);
    for(const side of [-1,1]){
     const end=sp(g,side===1?0xF7E6A1:0xF08FB5,side*1.34,.02,0,.30,.32,.32);
     sp(g,0xFFF0C7,side*1.34,.11,.12,.09,.09,.08);
    }
    const hub=sp(g,0xD7C6FF,0,.13,.02,.37,.37,.37);
    const warning=label('AWAS!', '#FFF0C7');warning.scale.set(2.2,.62,1);warning.position.set(xp,3.2,z);scene.add(warning);
    RC.sw.push({g,s:(i%2?1:-1)*(1.15+(i%3)*.18),phase:Math.random()*Math.PI*2});
   }
  }
 });
}
function rcBump(x,c){if(!RC.zones)return 0;const i=Math.round(c.g.position.z/2.6+(RC.n-1)/2),H=[.6,.85,1.1];let b=0;
 for(const Zn of RC.zones){if(x<Zn.x||x>Zn.x+12)continue;
  if(Zn.t==='h'){for(let k=0;k<3;k++){const d=x-(Zn.x+2+k*4);if(Math.abs(d)<1.3)b=Math.max(b,(H[(i+k)%3]+.35)*Math.pow(Math.cos(d/1.3*Math.PI/2),2))}}
  else if(Zn.t==='s'){const d=x-(Zn.x+6);if(Math.abs(d)<1.1)b=Math.max(b,.65*Math.pow(Math.cos(d/1.1*Math.PI/2),2))}
  else for(let k=0;k<3;k++){const w=clp((.9-Math.abs(x-(Zn.x+2+k*4)))/.35,0,1);if(w>0)b=Math.max(b,w*rcPH(i,k))}}
 return b}
function build(){clear();scene=new THREE.Scene();const SKY=0x5F6AA3;scene.background=lin(SKY);scene.fog=new THREE.Fog(lin(SKY),90,230);
 scene.add(new THREE.HemisphereLight(lin(0xDCE4FF),lin(0x6F78B0),.9));
 const sun=SUN=new THREE.DirectionalLight(lin(0xFFF0DC),.7);sun.position.set(50,45,30);sun.target.position.set(35,0,0);sun.castShadow=true;sun.shadow.mapSize.set(Q>1?2048:1024,Q>1?2048:1024);
 const shc=sun.shadow.camera;shc.left=-34;shc.right=34;shc.top=34;shc.bottom=-34;shc.near=5;shc.far=140;sun.shadow.radius=4;sun.shadow.bias=-.0005;scene.add(sun,sun.target);
 const n=R.groups.length,W=n*2.6+6,TH=[0x5A6DB8,0x7B63B8,0x4E90B8,0xB5628A,0x4EA58F,0xC98A5E];rcDeco(n,W);
 rb(320,1.2,200,.5,0x3A4272,L/2,-.7,0);
 for(let k=0;k<7;k++)bl(0x4A5590,k*18-8,-.05,-W/2-14-(k%2)*6,9,.35,5);
 rb(L+26,.5,W,.22,0x2F3566,L/2+4,-.06,0);
 for(let i=0;i<n;i++)rb(L+22,.1,2.4,.04,i%2?0x59629C:0x4F5890,L/2+3,.22,(i-(n-1)/2)*2.6);
 rb(.5,.12,W-1,.05,0xFFF7E8,START,.3,0);
 const tn=n*2,tw=(W-1)/tn;for(let k=0;k<tn;k++)rb(.7,.12,tw,.04,k%2?0x42365F:0xFFF7E8,L+1,.3,-(W-1)/2+tw*(k+.5));
 arch(START-.5,0x5FD0B5,'START',W);arch(L+1,0xF08FB5,'FINISH',W);
 const px=L+11;rb(4,2.4,4,.5,0xF7E6A1,px,1.2,0);rb(3.4,1.6,3.6,.5,0x8E83D6,px,.8,-4);rb(3.4,1.2,3.6,.5,0x5FD0B5,px,.6,4);
 rb(.4,3.4,7.6,.18,0xF08FB5,px+4.5,5,0);rb(.3,2.6,6.4,.12,0xFFF7E8,px+4.2,5,0);rb(.3,3.2,.3,.12,0xE08F78,px+4.5,1.6,-3);rb(.3,3.2,.3,.12,0xE08F78,px+4.5,1.6,3);
 rcObs(n);
 const bz=-W/2-9;for(let k=0;k<7;k++){const w=9+(k*3%5),h=7+(k*5%6),x=k*15-6;rb(w,h,7,.8,TH[k%6],x,h/2,bz);rb(w+.8,1.2,7.8,.5,0x4B4F8A,x,h+.4,bz);
  for(let r=0;r<Math.floor((h-3)/3.2)+1;r++)for(let c=0;c<2;c++)rb(1.7,1.9,.35,.16,0xFFE9A8,x+(c-.5)*(w/2.2),4+r*3.2,bz+3.6);rb(1.8,2.8,.35,.16,0x3A3F70,x,1.4,bz+3.6)}
 const CAN=[0x3E8F82,0x4FA596,0x347A78];
 const tree=(x,z,k)=>{const th=2.2+(k%3)*.6;rb(.7,th,.7,.3,0x5A4E7A,x,th/2,z);bl(CAN[k%3],x,th+1.3,z,1.9+(k%2)*.4,1.7,1.9);bl(CAN[(k+1)%3],x+.7,th+.8,z+.4,1.2,1.1,1.2);bl(CAN[(k+2)%3],x-.6,th+2.1,z,1,.95,1)};
 for(let k=0;k<17;k++)tree(k*6-8,-W/2-3.6-(k%3)*1.3,k);for(const x of[-9,-13,L+22,L+28])tree(x,W/2+4,Math.abs(x|0));
 for(let k=0;k<4;k++){const x=12+k*15,z=-W/2-1.5;rb(3,.3,.9,.14,0xE08F78,x,.85,z);rb(3,.9,.25,.12,0xE08F78,x,1.35,z-.4);rb(.25,.7,.7,.12,0x8E83D6,x-1.1,.4,z);rb(.25,.7,.7,.12,0x8E83D6,x+1.1,.4,z);
  rb(.9,.8,.9,.35,0xF08FB5,x+3.5,.4,z);bl(0x3E8F82,x+3.5,1.3,z,.7)}
 rb(.2,2.6,.2,.09,0x3A3F70,-5,1.3,W/2+1.8);rb(.3,.9,2.4,.14,0x8E83D6,-5,2.6,W/2+1.8);
 for(let k=0;k<5;k++)bl(0xFFF7E8,k*28-10,32+(k%2)*6,-90,9,3.2,5);
 rb(16,.5,1.8,.3,0x8E83D6,L+10,.25,-W/2-1);rb(16,1.1,.5,.2,0xF08FB5,L+10,.7,-W/2-1.9);
 scene.traverse(o=>{if(o.isMesh||o.isSprite){o.updateMatrix();o.matrixAutoUpdate=false}});
 /* Cincin dekoratif dianimasikan melalui scale di rcFx, jadi matriksnya harus tetap otomatis. */
 (RC.dc||[]).forEach(o=>{o.matrixAutoUpdate=true;o.updateMatrix()});
 for(let k=0;k<10;k++){const g=new THREE.Group(),col=SHIRT[(k*5+2)%12],sk=SKIN[k%4];sp(g,col,0,.5,0,.34,.42,.3);sp(g,sk,0,1.15,0,.36,.34,.33);sp(g,HAIR[k%6],-.05,1.3,0,.37,.24,.34);for(const z of[-1,1])sp(g,sk,0,1.05,z*.45,.11);g.position.set(L+3+k*1.4,.5,-W/2-1);scene.add(g);specs.push(g)}
 const vcn={F:0,M:0};R.groups.forEach((g,i)=>{const sxg=sexNorm(g.sex)||CK_DEFAULT_SEX(i),c=makeChar(i,g.name,sxg,vcn[sxg]++);c.id=g.id;c.col=c.dot;c.g.position.set(START-2.2,0,(i-(n-1)/2)*2.6);scene.add(c.g);
  if(!mc.blob){mc.blob=new THREE.MeshBasicMaterial({color:lin(0x252431),transparent:true,opacity:.2,depthWrite:false});mc.blob.userData.keep=1}
  c.blob=new THREE.Mesh(geo('bc',()=>new THREE.CircleGeometry(1,20)),mc.blob);c.blob.rotation.x=-Math.PI/2;c.blob.scale.set(1.15,.8,1);scene.add(c.blob);chars.push(c)});
 mkConf();
 $('prog').innerHTML='<b><i class="ic ic-flag"></i></b>'+chars.map(c=>`<i style="background:${hex(c.col)};left:0%"></i>`).join('');applyQ();obReset(1);camSnap()}
let camX=2,camD=30,camZ=0;
const asp=()=>Math.max(1,1.7/(innerWidth/innerHeight));
function camTarget(dt,snap){
 const n=R.groups.length,a=asp();let tx=L/2+8,td,tz=0;
 if(state==='COUNTDOWN'){tx=3;td=(11+n*1.3)*a}
 else if(state==='REVEAL'){tx=L+3;td=(12+n*.7)*a}
 else if(followCam&&state==='RUNNING'){
  let lead=null,best=-Infinity;
  for(const c of chars){const x=c.g.position.x;if(x<L-.12&&x>best){best=x;lead=c}}
  if(!lead&&chars.length)lead=chars.reduce((aa,bb)=>aa.g.position.x>bb.g.position.x?aa:bb);
  if(lead){tx=Math.min(L-1.1,Math.max(1.5,lead.g.position.x+1.35));tz=lead.g.position.z}
  td=clp((9.2+n*.20)*a,8.4,12.2);
 }else{td=(26+n*.7)*a}
 const k=snap?1:1-Math.exp(-Math.min(dt,.05)*2.8);
 camX+=(tx-camX)*k;camZ+=(tz-camZ)*k;camD+=(td-camD)*k;
 OB.ws+=(((state==='RUNNING'&&!followCam)?1:0)-OB.ws)*(snap?1:Math.min(1,dt*1.5));
 const targetFov=state==='RUNNING'?(followCam?(slow?39.5:42):53):(state==='REVEAL'?42:45);
 if(Math.abs(camera.fov-targetFov)>.01){camera.fov+=(targetFov-camera.fov)*(snap?1:Math.min(1,dt*3.2));camera.updateProjectionMatrix()}
 const tracking=followCam&&state==='RUNNING';
 camera.position.set(camX-camD*(tracking?.44:.16),2.5+camD*(tracking?.29:.31),camZ+camD*(tracking?.58:1));
 camera.lookAt(camX+(tracking?1.65:0),tracking?1.35:1.25,camZ);
 obApply(camX+(tracking?1.1:0),tracking?1.35:1.25,camZ,snap?0:dt,-10,L+8,-(n*1.3+8),120)
}
function camSnap(){camTarget(0,1)}
const QN=['Hemat','Normal','Tinggi'];function updQ(){$('qual').textContent='Grafis: '+QN[Q]}$('qual').onclick=()=>{Q=(Q+1)%3;LS.set('lmp_q',Q);updQ();applyQ()};updQ();
$('cam').onclick=()=>{followCam=!followCam;$('cam').textContent='Kamera: '+(followCam?'Ikuti':'Seluruh Arena')};

/* animation (visual only; finish order = R.order) */
const EVT=['stumble','look','pose','shock'];
function eOf(c,s){if(s>=1)return 1;const w=c.wv||(c.wv=[(Math.random()*2-1)*.07,(Math.random()*2-1)*.04,(Math.random()*2-1)*.02]),PI=Math.PI,
 b=.4*s+.6*prof(c.pr,s)+w[0]*Math.sin(PI*s)+w[1]*Math.sin(2*PI*s)+w[2]*Math.sin(3*PI*s);return c.eM=Math.max(c.eM||0,Math.min(b,.999))}
function animate(c,dt,t,run){const s=c.T?Math.min(t/c.T,1):0;c.s=s;
 let dx=0;if(run){const e=eOf(c,s),nx=START+e*L;dx=Math.min(1,Math.max(0,nx-c.g.position.x));c.g.position.x=nx}
 const mv=run&&s<1;c.amp+=((mv?1:0)-c.amp)*(1-Math.exp(-dt*9));
 if(mv){c.ph+=Math.max(dx*6,dt*4);if(!c.ev){c.evT-=dt;if(c.evT<=0){c.ev={type:EVT[Math.random()*4|0],k:0,d:1.1};c.evT=3+Math.random()*4;if(c.ev.type==='stumble'||c.ev.type==='shock')c.sfxT=1}}}else if(!run)c.ph+=dt*2.5;
 let y=0,tilt=0,hy=0,aL,aR,mood=0;const sw=Math.sin(c.ph)*c.amp;let hop=0;
 if(mv)hop=rcBump(c.g.position.x,c);
 y=run?c.amp*.2*Math.sin(c.ph)*Math.sin(c.ph)+hop:Math.sin(c.ph)*.05;
 c.legL.rotation.z=sw*.9;c.legR.rotation.z=-sw*.9;aL=-sw*.9;aR=sw*.9;c.torso.rotation.z=-.14*c.amp;
 if(c.ev){c.ev.k+=dt/c.ev.d;const k=c.ev.k,p=Math.sin(Math.PI*Math.min(k,1));
  if(c.ev.type==='stumble'){tilt=-p*.75;y+=p*.25;aL=aL*(1-p)-2.2*p;aR=aR*(1-p)-2.2*p;mood=1}else if(c.ev.type==='look')hy=p*1.1;else if(c.ev.type==='pose'){aL=aL*(1-p)-2.6*p;aR=aR*(1-p)+2.6*p;y+=p*.4;mood=2}else{y+=p*.9;aL=aL*(1-p)-2.8*p;aR=aR*(1-p)-2.8*p;mood=1}
  if(c.sfxT){sfx.boing();c.sfxT=0}if(k>=1){c.ev=null;c.sq=.3}}
 c.cel+=((run&&s>=1?1:0)-c.cel)*(1-Math.exp(-dt*8));if(run&&s>=1){c.ph+=dt*8;const ce=c.cel;y=y*(1-ce)+Math.abs(Math.sin(c.ph))*.5*ce;const ca=-2.8+Math.sin(c.ph*2)*.4;aL=aL*(1-ce)+ca*ce;aR=aR*(1-ce)+ca*ce;c.g.rotation.y=Math.sin(c.ph*.5)*.5*ce;mood=2}
 const air=hop+(c.ev?Math.sin(Math.PI*Math.min(c.ev.k,1))*.4:0);if(c.pa>.3&&air<=.3)c.sq=.25;c.pa=air;c.sq*=Math.exp(-dt*7);
 const st=Math.min(.12,y*.1),q=c.sq;c.rig.scale.set(1-st*.4+q*.45,1+st-q,1-st*.4+q*.45);
 c.armL.rotation.z=aL;c.armR.rotation.z=aR;c.g.position.y=y;c.g.rotation.z=tilt;c.head.rotation.y=hy;c.head.rotation.z=mv?Math.sin(c.ph*2)*.05-.05:0;c.bag.rotation.x=mv?Math.sin(c.ph*2)*.2:Math.sin(c.ph)*.03;
 ckArms(c,aL,aR);ckFx(c,dt,mood,run&&s>=1&&c.cel>.5,mv?0:1);
 c.blob.position.set(c.g.position.x,.29,c.g.position.z);const sh=Math.max(.5,1-y*.18);c.blob.scale.set(1.15*sh,.8*sh,1)}

/* game */
let cd=0,t=0,revT=0,lastCd=4,lastLead=-1,cmtT=0,bigT=0,finN=0,slow=false,last=0,fpsS=0,fpsN=0,shk=0,rkT=0,cmQ=5,rvI=-1,dr2=0;
const readRaceHistory=()=>{const v=LS.get('lmp_history',[]);return Array.isArray(v)?v.filter(x=>x&&typeof x==='object'&&typeof x.time==='string'&&Array.isArray(x.order)).slice(0,MAXH).map(x=>({time:x.time,order:x.order.filter(n=>n!=null).map(n=>String(n).slice(0,MAX_GROUP_NAME)).slice(0,MAXG)})):[]};
const ST={SETUP:'SETUP',COUNTDOWN:'HITUNG MUNDUR',RUNNING:'BERLARI!',REVEAL:'PENGUMUMAN',RESULTS:'HASIL'};
function setState(s){state=s;$('status').textContent=ST[s]||s;if(s==='COUNTDOWN')mascotReact('count');else if(s==='RESULTS')mascotReact('result')/*MASKOT*/}
function say(m){$('cmt').style.display='block';$('cmt').textContent=m;cmtT=3}
function big(h,d=2){$('big').innerHTML=h;bigT=d}
function rankUpd(){const k=c=>c.fin?1e3-c.T/100:c.g.position.x,a=chars.slice().sort((x,y)=>k(y)-k(x));
 $('rank').innerHTML='<b>POSISI</b>'+a.slice(0,5).map((c,i)=>'<div'+(i?'':' class="ld"')+'><i style="background:'+hex(c.col)+'"></i>'+(i+1)+'. '+esc(R.groups[c.id].name)+(c.fin?' ✓':'')+'</div>').join('')}
async function start(){if(state==='COUNTDOWN'||state==='RUNNING'||state==='REVEAL')return;
 const names=groups.map(g=>g.trim());let e='';if(names.length<MING)e='Minimal '+MING+' kelompok.';else if(names.some(n=>!n))e='Ada nama kelompok yang kosong.';
 else if(new Set(names.map(n=>n.toLowerCase())).size!==names.length&&!(await cfm('Ada nama yang sama. Tetap lanjutkan?')))e='Ubah nama yang sama dulu.';
 if(e){rows();$('err').textContent=e;return}
 const gs=names.map((n,i)=>({id:i,name:n,sex:sxGet(SX.g,n,i)})),order=Object.freeze(shuffle(gs.map(g=>g.id)));
 R={groups:gs,order,time:new Date().toISOString(),rank:{}};order.forEach((id,i)=>R.rank[id]=i);actx();mascotReact('start');/*MASKOT*/
 if(!glOK){finish();return}
 show('hud');build();followCam=true;$('cam').textContent='Kamera: Ikuti';
 chars.forEach(c=>c.T=32+R.rank[c.id]*1.3);cd=3.99;t=0;fpsS=0;fpsN=0;lastCd=4;lastLead=-1;finN=0;slow=false;$('big').innerHTML='';$('cmt').style.display='none';$('vig').style.opacity=0;$('rank').innerHTML='';setState('COUNTDOWN')}
function finish(){if(!R||!Array.isArray(R.order)||!Array.isArray(R.groups)||!R.order.length)return;music=false;const names=R.order.map(id=>String(R.groups[id]?.name??''));
 const h=readRaceHistory();h.unshift({time:R.time,order:names});h.length=Math.min(h.length,MAXH);LS.set('lmp_history',h);
 current={names,time:R.time};clear();$('first').innerHTML='<small>Presentasi PERTAMA</small><b>'+esc(names[0])+'</b>';
 $('olist').innerHTML=names.map((n,i)=>`<li><span class="k">${i+1}</span>${esc(n)}</li>`).join('');$('when').textContent='Waktu pengundian: '+new Date(R.time).toLocaleString('id-ID');$('cmsg').textContent='';
 setState('RESULTS');show('results');$('olist').scrollTop=0;$('results').scrollTop=0;scrollTo(0,0)}
$('start').onclick=start;$('again').onclick=()=>{state='SETUP';start()};
$('toset').onclick=()=>{state='SETUP';show('setup')};$('back').onclick=async()=>{if(!await cfm('Keluar dari lomba?'))return;music=false;clear();R=null;setState('SETUP');show('setup')};
const txt=()=>'URUTAN PRESENTASI\nWaktu: '+new Date(current.time).toLocaleString('id-ID')+'\n\n'+current.names.map((n,i)=>(i+1)+'. '+n).join('\n');
const csvSafe = value => {
    const text = String(value ?? '');
    return /^[\u0000-\u0020\uFEFF]*[=+\-@]/.test(text) ? "'" + text : text;
};

const csv = () => 'Urutan,Kelompok,Waktu\n' +
    current.names.map((n, i) =>
        `${i + 1},"${csvSafe(n).replace(/"/g, '""')}",${current.time}`
    ).join('\n');
function dl(n,x,ty){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([x],{type:ty}));a.href=u;a.download=n;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
$('txt').onclick=()=>dl('urutan-presentasi.txt',txt(),'text/plain');$('csv').onclick=()=>dl('urutan-presentasi.csv',csv(),'text/csv');
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(txt());$('cmsg').textContent='Hasil disalin ✔'}catch(e){const x=document.createElement('textarea');x.value=txt();document.body.appendChild(x);x.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}x.remove();$('cmsg').textContent=ok?'Hasil disalin ✔':'Gagal menyalin.'}};
function hist(){const h=readRaceHistory();$('hlist').innerHTML=h.length?h.map((x,i)=>`<div class="h"><div class="hh"><b>${new Date(x.time).toLocaleString('id-ID')}</b><span>${x.order.length} kelompok</span><button class="o" data-x="${i}">Hapus</button></div><ol>${x.order.map(n=>'<li>'+esc(n)+'</li>').join('')}</ol></div>`).join(''):'<div class="h">Belum ada riwayat.</div>';$('history').style.display='block'}
$('hist').onclick=$('hist2').onclick=hist;$('hclose').onclick=()=>$('history').style.display='none';
$('hlist').onclick=e=>{const b=e.target.closest&&e.target.closest('button[data-x]');if(!b)return;const x=b.dataset.x;const h=readRaceHistory();h.splice(+x,1);LS.set('lmp_history',h);hist()};
$('hclear').onclick=async()=>{if(await cfm('Hapus seluruh riwayat?')){LS.set('lmp_history',[]);hist()}};

/* ================= MASKOT: sistem animasi terpusat ================= */
const RMq=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
let mR=null,mS,mC,mCh,mB;
const TAU=6.2832,sm3=x=>x*x*(3-2*x),clp=(x,a,b)=>Math.max(a,Math.min(b,x));
/* sendi: arm.z = ayun depan/belakang, arm.x = buka ke samping; head.y = noleh, head.z = angguk, head.x = miring;
   rig.z = membungkuk, rig.x = goyang samping */
const MA={t:0,last:0,act:null,q:null,next:2.5,lastN:'',cool:0,near:false,nr:0,dx:0,px:0,py:0,pm:0,tilt:0,tiltT:0,tiltN:2,mood:0,moodN:3,rmDrawn:0,
 p:{aL:0,aR:0,aLx:0,aRx:0,hy:0,hp:0,hr:0,rz:0,rx:0,lL:0,lR:0,y:0,sq:0}};
const mVis=()=>!!mR&&$('setup').classList.contains('on')&&$('mascot').clientWidth>0;
/* satu lompatan: antisipasi (jongkok) -> lepas landas (stretch) -> mendarat (squash) */
function hop(l){if(l<.2){return{y:0,s:.22*Math.sin(l/.2*Math.PI)}}
 if(l<.82){const y=Math.sin((l-.2)/.62*Math.PI);return{y,s:-.13*y}}
 return{y:0,s:.2*Math.sin((l-.82)/.18*Math.PI)}}
function hopAct(o,u,n,H){const k=Math.min(u*n,n-1e-6),h=hop(k-Math.floor(k)),cr=Math.max(0,h.s);
 o.y+=h.y*H;o.sq+=h.s;o.aL+=-cr*2-h.y*2.3;o.aR+=-cr*2+h.y*2.3;o.lL-=h.y*.5;o.lR-=h.y*.5;if(h.y>.1)o.mood=2}
/* p = prioritas, lock = tidak boleh dipotong, then = animasi lanjutan */
const ACT={
 jump:{d:2.1,p:2,f:(o,u)=>hopAct(o,u,2,.42)},
 hop1:{d:1.1,p:2,f:(o,u)=>hopAct(o,u,1,.4)},
 spin:{d:1.7,p:2,lock:1,f:(o,u,e)=>{const s=sm3(clp((u-.08)/.84,0,1));o.spin=s*TAU;o.y+=Math.sin(Math.PI*s)*.14;o.aLx+=.9*e;o.aRx-=.9*e;o.mood=2}},
 swing:{d:2.2,p:1,f:(o,u,e)=>{const s=Math.sin(u*TAU*3);o.aL+=s*1.1*e;o.aR-=s*1.1*e;o.rx+=s*.05*e;o.hy+=s*.2*e;o.mood=2}},
 sway:{d:2.4,p:1,f:(o,u,e)=>{const s=Math.sin(u*TAU*2.2);o.rx+=s*.17*e;o.hr-=s*.12*e;o.lL+=Math.max(0,s)*.3*e;o.lR+=Math.max(0,-s)*.3*e;o.aLx+=(.3+s*.15)*e;o.aRx-=(.3-s*.15)*e;o.y+=Math.abs(s)*.03*e}},
 clap:{d:2.0,p:2,f:(o,u,e)=>{const s=Math.sin(u*TAU*5),tl=.68+.17*s;o.aL+=1.35*e;o.aR+=1.35*e;o.aLx-=tl*e;o.aRx+=tl*e;o.y+=Math.abs(s)*.03*e;o.hp-=.1*Math.abs(s)*e;o.mood=2}},
 cheer:{d:2.2,p:1,f:(o,u,e)=>{o.aL+=(-2.7+Math.sin(u*TAU*4)*.25)*e;o.aR+=(2.7+Math.sin(u*TAU*4+1)*.25)*e;o.aLx+=.25*e;o.aRx-=.25*e;o.y+=Math.abs(Math.sin(u*TAU*2.5))*.08*e;o.hp+=.18*e;o.mood=2}},
 bow:{d:2.4,p:1,f:(o,u,e)=>{o.rz-=.62*e;o.hp-=.25*e;o.mood=2}},
 stumble:{d:2.4,p:1,f:(o,u,e)=>{const dc=e*(1-u*.6),s=Math.sin(u*TAU*2.5),w=Math.sin(u*TAU*3);o.rx+=s*.3*dc;o.aL+=w*1.8*dc;o.aR-=w*1.8*dc;o.aLx+=.6*e;o.aRx-=.6*e;o.lL+=s*.5*e;o.lR-=s*.5*e;o.y+=Math.abs(s)*.05*e;o.mood=u<.6?1:2}},
 wave:{d:2.2,p:2,f:(o,u,e)=>{o.aR+=(-2.5+Math.sin(u*TAU*5)*.45)*e;o.hr+=.1*e;o.lk=e;o.y+=Math.abs(Math.sin(u*TAU*2.5))*.025*e;o.mood=2}},
 surprise:{d:1.0,p:3,then:'excited',f:(o,u,e)=>{hopAct(o,u,1,.3);o.hp+=.2*e;o.rz+=.15*e;o.mood=1}},
 excited:{d:2.6,p:3,f:(o,u,e)=>{hopAct(o,u,3,.2);o.aLx+=.2*e;o.aRx-=.2*e;o.rx+=Math.sin(u*TAU*6)*.04*e;o.mood=2}},
 celebrate:{d:3.4,p:3,lock:1,f:(o,u,e)=>{hopAct(o,u,3,.42);o.aL-=1.2*e;o.aR+=1.2*e;const s=sm3(clp((u-.4)/.5,0,1));o.spin=s*TAU;o.aLx+=.3*e;o.aRx-=.3*e;o.mood=2}}
};
const RND=['jump','spin','swing','sway','clap','cheer','bow','stumble','wave','hop1'];
function startAct(n){const a=ACT[n],c=MA.act;if(!a)return false;
 if(c&&(c.a.lock||a.p<c.a.p||c.n===n)){if(a.p>=2&&c.n!==n&&(!MA.q||ACT[MA.q].p<=a.p))MA.q=n;return false}
 MA.act={n,a,t0:MA.t,cut:0};return true}
function mascotReact(w){if(!mCh)return;
 if(w==='reset'){MA.q=null;const A=MA.act;if(A&&!A.a.lock&&!A.cut)A.cut=MA.t;MA.cool=2;return}
 const n=w==='add'?(Math.random()<.5?'clap':'hop1'):w==='start'?'surprise':w==='count'?'excited':w==='result'?'celebrate':w;
 if(!ACT[n])return;
 if(!mVis()){if(!MA.q||ACT[n].p>=ACT[MA.q].p)MA.q=n;return}
 startAct(n)}
function mascotPose(rm){
 const t=rm?0:MA.t,A=MA.act,o={y:0,sq:0,aL:0,aR:0,aLx:0,aRx:0,hy:0,hp:0,hr:0,rz:0,rx:0,lL:0,lR:0,spin:0,mood:-1,lk:0};
 let e=0,u=0;
 if(A){u=clp((MA.t-A.t0)/A.a.d,0,1);e=sm3(clp(Math.min(u/.16,(1-u)/.2),0,1));if(A.cut)e*=clp(1-(MA.t-A.cut)/.3,0,1)}
 const ia=1-e*.85;
 /* IDLE: tiap bagian punya frekuensi & fase berbeda */
 o.y=(1-Math.cos(t*2.2))*.04;o.sq=Math.sin(t*4.4)*.015;
 o.rx=Math.sin(t*1.3)*.035+Math.sin(t*.53)*.03;o.rz=Math.sin(t*1.7+1)*.02;
 o.aL=Math.sin(t*1.3)*.14*ia;o.aR=Math.sin(t*1.1+1.7)*.14*ia;
 o.aLx=(.1+Math.sin(t*.9)*.05)*ia;o.aRx=-(.1+Math.sin(t*.8+1)*.05)*ia;
 o.lL=Math.sin(t*2.2)*.07;o.lR=-Math.sin(t*2.2)*.07;
 o.hy=Math.sin(t*.9)*.2+Math.sin(t*.37+2)*.12;o.hp=-.05+Math.sin(t*2.2)*.03;o.hr=MA.tilt;
 if(A)A.a.f(o,u,e);
 const nr=Math.max(MA.nr,o.lk);
 if(nr>0)o.hy=o.hy*(1-nr)+(-.5-clp(MA.dx,-1,1)*.35)*nr;
 return o}
function initMascot(){if(!glOK)return;try{mR=new THREE.WebGLRenderer({canvas:$('mascot'),antialias:true,alpha:true});mR.outputEncoding=THREE.sRGBEncoding;mR.setPixelRatio(Math.min(devicePixelRatio||1,2));
 mS=new THREE.Scene();mS.add(new THREE.HemisphereLight(lin(0xFFF7E8),lin(0xC9B9F0),.9));const d=new THREE.DirectionalLight(lin(0xFFE6C4),.8);d.position.set(3,6,5);mS.add(d);
 mC=new THREE.PerspectiveCamera(30,1,.1,50);mC.position.set(5.2,2.6,6.4);mC.lookAt(0,1.7,0);
 mCh=makeChar(3,'','M',0);const lb=mCh.g.children[mCh.g.children.length-1];mCh.g.remove(lb);lb.material.map.dispose();lb.material.dispose();mCh.g.rotation.y=-.35;mS.add(mCh.g);
 const bd=new THREE.Mesh(new THREE.CircleGeometry(1.2,24),new THREE.MeshBasicMaterial({color:lin(0x1a1530),transparent:true,opacity:.35,depthWrite:false}));bd.rotation.x=-Math.PI/2;bd.position.y=.02;mS.add(bd);mB=bd;
 addEventListener('pointermove',e=>{MA.px=e.clientX;MA.py=e.clientY;MA.pm=1},{passive:true});
 addEventListener('blur',()=>{MA.pm=0;MA.near=false})}catch(e){mR=null}}
function mascotFrame(now){
 if(!mR||document.hidden||!mVis()){MA.last=0;return}
 const cv=$('mascot'),w=cv.clientWidth;if(!w)return;
 if(cv.width!==Math.round(w*mR.getPixelRatio())){mR.setSize(w,w,false);MA.rmDrawn=0}
 const rm=false;
 const dt=MA.last?Math.min((now-MA.last)/1000,.05):0;MA.last=now;const c=mCh;
 if(!rm){
  MA.t+=dt;if(MA.cool>0)MA.cool-=dt;
  if(MA.pm){MA.pm=0;const r=cv.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height*.55,dx=(MA.px-cx)/r.width,dy=(MA.py-cy)/r.height,nr=Math.hypot(dx,dy)<1.1;
   MA.dx=dx;if(nr&&!MA.near&&MA.cool<=0&&startAct('wave'))MA.cool=7;MA.near=nr}
  MA.nr+=((MA.near?1:0)-MA.nr)*(1-Math.exp(-dt*6));
  const A=MA.act;
  if(A&&(((MA.t-A.t0)>=A.a.d)||(A.cut&&MA.t-A.cut>=.3))){MA.act=null;const nx=A.cut?null:(MA.q||A.a.then);if(MA.q&&nx===MA.q)MA.q=null;if(nx)startAct(nx)}
  if(!MA.act&&MA.q){const n=MA.q;MA.q=null;startAct(n)}
  MA.next-=dt;if(MA.next<=0){MA.next=5+Math.random()*5;if(!MA.act&&!MA.near&&!MA.q){let n;const pool=RMq.matches?['sway','swing','bow','wave']:RND;do{n=pool[Math.random()*pool.length|0]}while(n===MA.lastN);MA.lastN=n;startAct(n)}}
  MA.tiltN-=dt;if(MA.tiltN<=0){MA.tiltT=Math.random()<.5?0:(Math.random()<.5?-1:1)*(.1+Math.random()*.1);MA.tiltN=2.5+Math.random()*3}
  MA.tilt+=(MA.tiltT-MA.tilt)*(1-Math.exp(-dt*3));
  MA.moodN-=dt;if(MA.moodN<=0){if(MA.mood===0&&Math.random()<.4){MA.mood=2;MA.moodN=1+Math.random()}else{MA.mood=0;MA.moodN=2.5+Math.random()*3}}
 }
 const o=mascotPose(rm),P=MA.p,k1=rm?1:1-Math.exp(-dt*12),k2=rm?1:1-Math.exp(-dt*28);
 if(RMq.matches){for(const k of['y','sq','aL','aR','aLx','aRx','hy','hp','hr','rz','rx','lL','lR'])o[k]*=.4;o.spin=0}
 for(const k of['aL','aR','aLx','aRx','hy','hp','hr','rz','rx','lL','lR'])P[k]+=(o[k]-P[k])*k1;
 P.y+=(o.y-P.y)*k2;P.sq+=(o.sq-P.sq)*k2;
 const t=rm?0:MA.t,sq=clp(P.sq,-.2,.3);
 c.g.position.y=P.y;c.g.rotation.y=-.35+o.spin;
 c.rig.scale.set(1+sq*.45,1-sq,1+sq*.45);c.rig.rotation.x=P.rx;c.rig.rotation.z=P.rz;
 c.head.rotation.y=P.hy;c.head.rotation.z=P.hp;c.head.rotation.x=P.hr;
 c.armL.rotation.z=P.aL;c.armL.rotation.x=P.aLx;c.armR.rotation.z=P.aR;c.armR.rotation.x=P.aRx;
 c.legL.rotation.z=P.lL;c.legR.rotation.z=P.lR;c.bag.rotation.x=Math.sin(t*2.2+1)*.03-P.rx*.5;
 const m=o.mood>=0?o.mood:MA.mood;
 ckFx(c,dt,m,false,0,rm);
 if(mB)mB.scale.setScalar(1-clp(P.y,0,.6)*.5);
 mR.render(mS,mC)}
/* ================= akhir MASKOT ================= */


/* ================= TEAM SHUFFLE (state, hasil, riwayat terpisah dari lomba) ================= */
const TS={on:false,names:LS.get('lmp_ts_names',[]),method:LS.get('lmp_ts_m','A'),num:LS.get('lmp_ts_n',5),rest:LS.get('lmp_ts_r','last'),gn:LS.get('lmp_ts_gn',''),res:null,ph:'',t:0,last:'',st:'',items:[],end:0,cf:0,gx:[],pz:0,cam:null,MAXN:60,MAXG:12};
if(!Array.isArray(TS.names))TS.names=[];
TS.names=TS.names.filter(n=>typeof n==='string').slice(0,TS.MAXN).map(n=>n.trim().slice(0,MAX_STUDENT_NAME)).filter(Boolean);
TS.method=TS.method==='B'?'B':'A';
const tsNum=Number(TS.num);TS.num=Number.isFinite(tsNum)?Math.max(1,Math.min(TS.MAXN,Math.floor(tsNum)||1)):5;
TS.rest=TS.rest==='last'?'last':'even';
TS.gn=typeof TS.gn==='string'?TS.gn.slice(0,2000):'';TS.parseWarn='';
const TSP=[0xD99AB4,0x92CDB5,0xAFA2DC,0x92B8DE,0xDDA993,0xD8C77F],TSL=i=>'Kelompok '+(i+1);
const tsParse=v=>{const lines=String(v??'').split(/\r?\n/,TS.MAXN+1),tooMany=lines.length>TS.MAXN&&!!String(lines[TS.MAXN]??'').trim(),tooLong=lines.slice(0,TS.MAXN).some(s=>s.trim().length>MAX_STUDENT_NAME);TS.parseWarn=[tooMany?'Maksimal '+TS.MAXN+' nama; nama setelah batas diabaikan.':'',tooLong?'Nama yang lebih dari '+MAX_STUDENT_NAME+' karakter dipotong.':''].filter(Boolean).join(' ');return lines.slice(0,TS.MAXN).map(s=>s.replace(/\t+/g,' ').trim().slice(0,MAX_STUDENT_NAME)).filter(Boolean)};
const tsGroupNames=()=>String(TS.gn??'').split(/\r?\n/,TS.MAXG+1).slice(0,TS.MAXG).map(s=>s.trim().slice(0,MAX_GROUP_NAME));
const gtxt=g=>g.name.toUpperCase()+'\n'+g.members.map((m,i)=>(i+1)+'. '+m).join('\n');
function tsShow(id){['modes','tsSetup','tsResults'].forEach(k=>$(k).classList.toggle('on',id===k));$('tshud').style.display=id==='ts3d'?'block':'none';if(id!=='ts3d'&&TS.on)tsStop();scrollTo(0,0)}
function tsDupes(){const m=new Map(),d=new Map();TS.names.forEach(n=>{const k=String(n??'').trim().toLowerCase();if(k&&m.has(k))d.set(k,m.get(k));else if(k)m.set(k,n)});return d}
function tsPlan(){const N=TS.names.length,k=Math.floor(+TS.num);let g,sz=[];
 if(N<2)return{err:'Masukkan minimal 2 nama mahasiswa.'};
 if(N>TS.MAXN)return{err:'Maksimal '+TS.MAXN+' mahasiswa.'};
 if(!(k>=1))return{err:'Isi angka pengaturan (minimal 1).'};
 if(TS.method==='A')g=k;else{if(k>=N)return{err:'Anggota per kelompok harus lebih kecil dari jumlah mahasiswa.'};g=Math.ceil(N/k)}
 if(g<2)return{err:'Minimal 2 kelompok.'};
 if(g>TS.MAXG)return{err:'Maksimal '+TS.MAXG+' kelompok (hasil: '+g+').'};
 if(g>N)return{err:'Jumlah kelompok melebihi jumlah mahasiswa.'};
 if(TS.method==='B'&&TS.rest==='last'){for(let i=0;i<g;i++)sz.push(k);sz[g-1]=N-k*(g-1)}
 else{const b=Math.floor(N/g),r=N%g;for(let i=0;i<g;i++)sz.push(b+(i<r?1:0))}
 return{N,g,sz}}
function tsInfo(){const d=tsDupes(),p=tsPlan(),gl=tsGroupNames();
 $('tsCount').textContent=TS.names.length+' mahasiswa terdeteksi';
 $('tsWarn').textContent=[d.size?'Peringatan: nama duplikat → '+[...d.values()].join(', '):'',TS.parseWarn].filter(Boolean).join(' ');
 $('tsLblN').textContent=TS.method==='A'?'Jumlah kelompok':'Anggota per kelompok';$('tsRestW').hidden=TS.method!=='B';
 $('tsSum').innerHTML=p.err?'<span class="msg">'+esc(p.err)+'</span>':'<b>'+p.N+'</b> mahasiswa → <b>'+p.g+'</b> kelompok<br>'+p.sz.map((n,i)=>esc(gl[i]||TSL(i))+': <b>'+n+'</b>').join(' · ')+(new Set(p.sz).size>1?'<br><span class="msg">Catatan: jumlah anggota tiap kelompok tidak sama persis.</span>':'');
 LS.set('lmp_ts_names',TS.names);LS.set('lmp_ts_m',TS.method);LS.set('lmp_ts_n',TS.num);LS.set('lmp_ts_r',TS.rest);LS.set('lmp_ts_gn',TS.gn)}
const tsSync=()=>{$('tsNames').value=TS.names.join('\n')};
function tsList(){const used=new Set();TS.names.forEach((n,i)=>{const k=sxKey(n);if(!k)return;if(!sexNorm(SX.n[k]))SX.n[k]=CK_DEFAULT_SEX(i);used.add(k)});Object.keys(SX.n).forEach(k=>{if(!used.has(k))delete SX.n[k]});LS.set('lmp_sx_n',SX.n);
 $('tsList').innerHTML=TS.names.map((n,i)=>`<div class="row"><span class="n">${i+1}</span><input type="text" data-i="${i}" maxlength="40" aria-label="Nama mahasiswa ${i+1}" value="${esc(n)}">${((X,LBL)=>'<button type="button" class="sx" data-s="'+i+'" data-v="'+X+'" aria-label="Karakter '+LBL+' '+(i+1)+': '+(X==='F'?'Perempuan, Pink Astronaut':'Laki-laki, Green Astronaut')+'. Klik untuk mengganti." title="'+(X==='F'?'Pink Astronaut (perempuan)':'Green Astronaut (laki-laki)')+' - klik untuk mengganti">'+(X==='F'?'♀':'♂')+'</button>')(sxGet(SX.n,n,i),'mahasiswa')}<button class="o" data-d="${i}" aria-label="Hapus nama ${i+1}"><i class="ic ic-x" aria-hidden="true"></i></button></div>`).join('')}
function tsClean(){TS.names=TS.names.map(s=>String(s??'').trim().slice(0,MAX_STUDENT_NAME)).filter(Boolean).slice(0,TS.MAXN)}
$('tsNames').addEventListener('input',()=>{TS.names=tsParse($('tsNames').value);tsList();tsInfo()});
$('tsNames').addEventListener('blur',tsSync);
$('tsList').addEventListener('input',e=>{const i=e.target.dataset.i;if(i===undefined)return;const ko=sxKey(TS.names[+i]),kn=sxKey(e.target.value);TS.names[+i]=e.target.value;if(kn&&ko!==kn&&sexNorm(SX.n[ko]))SX.n[kn]=SX.n[ko];tsInfo();tsSync()});
$('tsList').addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button.sx');if(!b)return;const i=+b.dataset.s,k=sxKey(TS.names[i]);if(!k)return;SX.n[k]=sxGet(SX.n,TS.names[i],i)==='F'?'M':'F';LS.set('lmp_sx_n',SX.n);tsList()});
$('tsList').addEventListener('change',()=>{tsClean();tsSync();tsList();tsInfo()});
$('tsList').addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button[data-d]');if(!b)return;const d=b.dataset.d;if(d===undefined)return;TS.names.splice(+d,1);TS.parseWarn='';tsSync();tsList();tsInfo()});
document.querySelectorAll('input[name=tsM]').forEach(r=>{r.checked=r.value===TS.method;r.addEventListener('change',()=>{TS.method=r.value;tsInfo()})});
$('tsN').value=TS.num;$('tsN').addEventListener('input',()=>{TS.num=+$('tsN').value;tsInfo()});
$('tsRest').value=TS.rest;$('tsRest').addEventListener('change',()=>{TS.rest=$('tsRest').value;tsInfo()});
$('tsGN').value=TS.gn;$('tsGN').addEventListener('input',()=>{TS.gn=String($('tsGN').value??'').slice(0,2000);tsInfo()});
$('tsGNdef').onclick=()=>{TS.gn='';$('tsGN').value='';tsInfo()};
$('tsSample').onclick=()=>{TS.names='Andi Pratama,Budi Santoso,Citra Lestari,Dina Amelia,Eka Saputra,Fajar Nugroho,Gita Permata,Hendra Wijaya,Indah Sari,Joko Susilo,Kartika Dewi,Lukman Hakim,Maya Putri,Nanda Prakoso,Olivia Tan,Putra Mahendra,Qori Aulia,Rani Anggraini,Satria Utama,Tiara Maharani,Umar Faruq,Vina Oktaviani,Wahyu Hidayat,Xena Paramita,Yoga Pratama,Zahra Nabila,Agus Salim,Bella Safira,Cahya Ningrum,Dimas Aryo,Elsa Fitriani,Farhan Maulana,Galih Prasetyo,Hana Kirana,Irfan Ramadhan'.split(',').slice(0,TS.MAXN);TS.method='A';TS.num=5;TS.parseWarn='';document.querySelector('input[name=tsM][value=A]').checked=true;$('tsN').value=5;tsSync();tsList();tsInfo()};
$('tsClear').onclick=async()=>{if(TS.names.length&&!(await cfm('Kosongkan seluruh daftar nama?')))return;TS.names=[];TS.parseWarn='';tsSync();tsList();tsInfo()};
$('m1').onclick=()=>show('setup');$('m2').onclick=()=>show('tsSetup');$('toModes').onclick=()=>show('modes');
$('tsHome').onclick=$('tsToModes').onclick=()=>show('modes');$('tsToSet').onclick=()=>show('tsSetup');

/* pengacakan: hasil final ditentukan di sini, SEBELUM animasi */
async function tsStart(){tsClean();tsInfo();const p=tsPlan();$('tsErr').textContent='';if(p.err){$('tsErr').textContent=p.err;show('tsSetup');return}
 const d=tsDupes();if(d.size&&!(await cfm('Ada nama duplikat: '+[...d.values()].join(', ')+'. Tetap lanjutkan?')))return;
 const ids=shuffle(TS.names.map((_,i)=>i)),gl=tsGroupNames();TS.gn=gl.join('\n');LS.set('lmp_ts_gn',TS.gn);let o=0;
 const groups=p.sz.map((n,i)=>{const g=ids.slice(o,o+n);o+=n;return{name:gl[i]||TSL(i),color:TSP[i%6],ids:g,members:g.map(id=>TS.names[id])}});
 const all=groups.flatMap(g=>g.ids);
 if(o!==TS.names.length||all.length!==TS.names.length||new Set(all).size!==TS.names.length){$('tsErr').textContent='Validasi pembagian gagal. Coba lagi.';return}
 TS.res={time:new Date().toISOString(),groups,saved:0};actx();
 TS.note='';TS.rm=!!RMq.matches;document.body.classList.toggle('rm',TS.rm);if(!glOK){TS.note='WebGL tidak tersedia: hasil ditampilkan tanpa animasi.';tsFinish();return}
 if(TS.rm)TS.note='Mode gerak dikurangi aktif: animasi dibuat lebih ringan.';
 show('ts3d');TS.on=true;TS.paused=0;$('tsPause').textContent='Jeda';tsBuild();TS.ph='prep';TS.t=0;TS.last='';TS.st='';$('tsBig').textContent='';$('tsStatus').textContent='PERSIAPAN'}
$('tsStart').onclick=tsStart;$('tsAgain').onclick=tsStart;

function tsBuild(){clear();scene=new THREE.Scene();scene.background=lin(0x3B4377);scene.fog=new THREE.Fog(lin(0x3B4377),115,300);
 TS.hl=new THREE.HemisphereLight(lin(0xC9D3FF),lin(0x5A6296),.95);scene.add(TS.hl);const sn=new THREE.DirectionalLight(lin(0xE6E9FF),.7);sn.position.set(20,40,30);scene.add(sn);
 TS.sp=new THREE.SpotLight(lin(0xFFF7E8),0,80,.5,.6);scene.add(TS.sp,TS.sp.target);
 const G=TS.res.groups,n=G.length,N=TS.names.length,mx=Math.max(...G.map(g=>g.ids.length)),cols=Math.min(5,Math.max(2,Math.ceil(Math.sqrt(mx*.9)))),rw=Math.ceil(mx/cols),gr=n<=4?1:2,gc=Math.ceil(n/gr),ZW=cols*1.9+2.5,ZD=rw*2.1+2.4,GP=4,Wi=Math.max(gc*(ZW+GP),12),Di=gr*(ZD+GP)+4.5,DW=5.4,WC=0x4A5390,CAN=[0x3F52C9,0x2AA7C9,0x7A4FD6];
 const perRow=Math.max(4,Math.min(16,Math.floor((Wi+6)/1.9))),srows=Math.ceil(N/perRow),pdep=srows*2.1+2;
 rb(Wi+220,1.2,320,.5,0x2F3766,0,-.7,-20);rb(Wi,.3,Di,.15,0x4A5389,0,0,-Di/2);rb(DW+2,.16,24,.08,0x3C4678,0,.06,12);rb(Wi+8,.16,pdep,.15,0x3C4678,0,.06,6+pdep/2);rb(Wi+6,.1,.4,.04,0x4FC3E6,0,.2,6);
 const wl=(w,h,d,x,z,c)=>rb(w,h,d,.25,c||WC,x,h/2,z);wl(.8,2.8,Di,-Wi/2-.4,-Di/2);wl(.8,2.8,Di,Wi/2+.4,-Di/2);wl(Wi+1.6,4.6,.8,0,-Di-.4,0x4D62B0);
 const fw=(Wi-DW)/2;wl(fw,1.3,.8,-(DW/2+fw/2),0);wl(fw,1.3,.8,DW/2+fw/2,0);
 const e0=scene.children.length;for(const sd of[-1,1]){rb(.7,4.4,.9,.3,0x6A58B0,sd*(DW/2+.2),2.2,0);const dr=rb(.3,2.6,2.2,.1,0x4B5896,sd*(DW/2+1.5),1.4,1.4);dr.rotation.y=sd*.8;rb(.9,.8,.9,.35,0x6A58B0,sd*(DW/2+3.2),.4,3);bl(0x4A63C4,sd*(DW/2+3.2),1.3,3,.7)}
 rb(DW+1.6,.8,.9,.3,0x6A58B0,0,4.6,0);const ls=label('MASUK','#B9859D');ls.scale.set(4.4,1.2,1);ls.position.set(0,5.9,.6);scene.add(ls);TS.ent=scene.children.slice(e0);
 const st=label('START','#88B9A7');st.scale.set(4,1.1,1);st.position.set(-(Wi/2+3),2.6,7);scene.add(st);
 TS.bm=new THREE.MeshStandardMaterial({color:lin(0x4A5390),emissive:lin(0xD1A94A),emissiveIntensity:0});
 for(let k=0;k<12;k++){const m=sp(scene,0xB7AD78,(k-5.5)*Wi/12,4,-Di+.2,.28);m.material=TS.bm}
 for(const sd of[-1,1])for(let k=0;k<4;k++){const x=sd*(Wi/2+4+k%2*2.5),z=-4-k*Math.max(6,Di/4);rb(.7,2.4,.7,.3,0x4A5083,x,1.2,z);bl(CAN[k%3],x,3.6,z,1.9,1.7,1.9)}
 TS.gx=[];TS.gz=[];TS.zm=[];TS.lamps=[];
 G.forEach((g,k)=>{const r=Math.floor(k/gc),rc=Math.min(gc,n-r*gc),x=((k%gc)-(rc-1)/2)*(ZW+GP),z=-3.5-ZD/2-r*(ZD+GP);TS.gx.push(x);TS.gz.push(z);
  const f=rb(ZW-.5,.1,ZD-.5,.04,g.color,x,.17,z);f.material=new THREE.MeshStandardMaterial({color:lin(g.color).multiplyScalar(.8),roughness:.55,metalness:.12,emissive:lin(g.color),emissiveIntensity:0});TS.zm.push(f.material);tsPad(g,x,z,ZW,ZD);
  /* Small entry pylons and pulse lamps make each team zone read as a destination. */
  for(const side of [-1,1]){
   rb(.22,1.25,.22,.08,0x40365F,x+side*(ZW/2-.12),.72,z-ZD/2+.35);
   const lamp=sp(scene,g.color,x+side*(ZW/2-.12),1.48,z-ZD/2+.35,.16,.18,.16);TS.lamps.push(lamp);
  }
  const l=label(g.name,hex(g.color));l.scale.set(Math.min(5.4,ZW),1.5,1);l.position.set(x,3.6,z-ZD/2+.3);scene.add(l)});
 TS.pg=G.map(()=>0);TS.flash=0;TS.sfxT=0;TS.cmT=0;$('tsCmt').style.display='none';$('tsView').style.display='none';
 const order=shuffle(TS.names.map((_,i)=>i)),dep=shuffle(TS.names.map((_,i)=>i)),rank=[],gi=[];dep.forEach((id,r)=>rank[id]=r);
 G.forEach((g,k)=>g.ids.slice().sort((a,b)=>rank[a]-rank[b]).forEach((id,j)=>gi[id]={k,j}));
 if(!mc.blob){mc.blob=new THREE.MeshBasicMaterial({color:lin(0x252431),transparent:true,opacity:.2,depthWrite:false});mc.blob.userData.keep=1}
 const vcm={F:0,M:0};TS.vm=TS.names.map((n,id)=>{const s=sxGet(SX.n,n,id);return{s,v:vcm[s]++}});TS.items=[];let end=0;
 order.forEach((id,pos)=>{const{k,j}=gi[id],g=G[k],r=Math.floor(j/cols),cc=j%cols,rc=Math.min(cols,g.ids.length-r*cols),tx=TS.gx[k]+(cc-(rc-1)/2)*1.9,tz=TS.gz[k]-ZD/2+1.4+r*2.1;
  const rr=Math.floor(pos/perRow),cn=Math.min(perRow,N-rr*perRow),sx=((pos%perRow)-(cn-1)/2)*1.9,sz=7.4+rr*2.1,ln=((rank[id]%5)-2)*.9;
  /* Jalur visual punya fake-out: sebagian karakter mendekati kotak tetangga lalu berbelok ke kelompok aslinya.
     Hasil kelompok sudah dikunci sebelum animasi; jalur ini hanya menambah ketegangan visual. */
  let decoyK=k;
  if(G.length>1){
   const near=G.map((gg,gi)=>({gi,d:Math.hypot(TS.gx[gi]-tx,TS.gz[gi]-tz)})).filter(v=>v.gi!==k).sort((a,b)=>a.d-b.d).slice(0,Math.min(3,G.length-1));
   decoyK=near[Math.floor(Math.random()*near.length)].gi;
  }
  const tease=Math.random()<.82,side=Math.random()<.5?-1:1;
  const fx=tease?TS.gx[decoyK]+(Math.random()-.5)*Math.min(ZW*.42,3.2):tx+(Math.random()-.5)*Math.min(ZW*.7,4.2);
  const fz=tease?TS.gz[decoyK]+(Math.random()-.5)*Math.min(ZD*.34,2.8):tz+(Math.random()-.5)*Math.min(ZD*.35,2.6);
  const loopX=fx+side*(tease?2.15:1.1),loopZ=fz+(Math.random()<.5?-1:1)*(tease?1.8:1.0);
  const mx=(fx+tx)*.5+(Math.random()-.5)*1.8,mz=(fz+tz)*.5+(Math.random()-.5)*1.8;
  const preX=tx+(Math.random()-.5)*1.15,preZ=tz+(Math.random()-.5)*.9;
  /* Extra S-turns create deliberate uncertainty; every route still ends in the precomputed correct slot. */
  const pts=[[sx,sz],[ln+(Math.random()-.5)*1.45,4.7+(Math.random()-.5)*.8],[ln+(Math.random()-.5)*2.1,(Math.random()-.5)*1.5],
   [fx+side*(tease?1.0:.35),fz+(Math.random()-.5)*.8],[fx,fz],[loopX,loopZ],[mx,mz],[preX,preZ],[tx,tz]],L=[0];
  for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
  const c=makeChar(id,TS.names[id],TS.vm[id].s,TS.vm[id].v);c.lb=c.g.children[c.g.children.length-1];c.g.scale.setScalar(.5);c.g.position.set(sx,.2,sz);c.g.rotation.y=Math.PI/2;scene.add(c.g);
  c.blob=new THREE.Mesh(geo('bc',()=>new THREE.CircleGeometry(1,20)),mc.blob);c.blob.rotation.x=-Math.PI/2;scene.add(c.blob);
  const d=rank[id]*Math.min(.45,13/N),speed=3.75+Math.random()*.42,pauseDur=tease?.24+Math.random()*.24:0,T=L[L.length-1]/speed+pauseDur;
  end=Math.max(end,d+T);TS.items.push({c,id,k,j,pts,L,d,T,speed,pauseAt:L[4],pauseDur,tease,done:0,rev:0,rt:-9})});
 TS.mem=G.map((_,k)=>TS.items.filter(i=>i.k===k).sort((a,b)=>a.j-b.j));
 tsDeco(Wi,Di);TS.end=end+1;TS.cp=null;TS.ZW=ZW;mkConf();tsProg();const front=6+pdep,back=-Di-1;TS.cam={W:Wi+16,mid:(front+back)/2,span:front-back};TS.Wi=Wi;TS.Di=Di;TS.ZD=ZD;TS.celeCam=null;TS.camPick=null;TS.camPickUntil=0;TS.camDist=null;TS.camFov=47;obReset(1);resize()}
function tsCam(dt){
 const C=TS.cam,a=innerWidth/Math.max(1,innerHeight),ph=TS.ph,t=TS.t;
 TS.ws=(TS.ws||0)+(((ph==='prep'||ph==='count')?0:1)-(TS.ws||0))*Math.min(1,dt*1.5);
 const wideD=Math.max(30,(C.W+8)/(.83*a),C.span*.8+8);
 const runD=clp(13.5+(TS.ZW||8)*.14,13.8,17.0);
 const annD=clp(14.5+(TS.ZD||8)*.24,16.5,23.5);
 const wantedD=ph==='run'?runD:ph==='ann'?annD:ph==='cele'?wideD:wideD;
 TS.camDist=(TS.camDist==null?wideD:TS.camDist)+(wantedD-TS.camDist)*(1-Math.exp(-Math.min(dt,.05)*(ph==='run'?1.45:1.8)));
 const d=TS.camDist,wantFov=ph==='run'?40.5:ph==='ann'?43:46;
 TS.camFov=(TS.camFov==null?47:TS.camFov)+(wantFov-TS.camFov)*(1-Math.exp(-Math.min(dt,.05)*2.4));
 if(Math.abs(camera.fov-TS.camFov)>.01){camera.fov=TS.camFov;camera.updateProjectionMatrix()}
 let tx=0,tz=C.mid,zm=1,ann=0;
 if(ph==='prep'){zm=(TS.rm?1.2:1.42)-(TS.rm?.15:.3)*sm3(clp(t/1.4,0,1))}
 else if(ph==='count'){zm=1-.06*sm3(clp(t/3.4,0,1))}
 else if(ph==='run'){
  /* Pindah fokus antar karakter yang sedang bergerak, dengan transisi halus. */
  const active=TS.items.filter(it=>t>=it.d+.18&&t<it.d+it.T-.16);
  const currentActive=TS.camPick&&active.some(it=>it===TS.camPick);
  if(!currentActive||t>=(TS.camPickUntil||0)){
   let pool=active.filter(it=>it!==TS.camPick);
   if(!pool.length)pool=active;
   TS.camPick=pool.length?pool[Math.floor(Math.random()*pool.length)]:null;
   TS.camPickUntil=t+3.2+Math.random()*1.45;
  }
  if(TS.camPick){
   tx=TS.camPick.c.g.position.x;
   tz=TS.camPick.c.g.position.z;
   zm=1.08;
  }else{tx=0;tz=C.mid;zm=1.08}
 }else if(ph==='ann'){tx=TS.gx[TS.gi];tz=TS.gz[TS.gi];zm=1;ann=1}
 else{tx=Math.sin(t*.6)*(TS.rm?1.5:2.2)}
 if(!TS.cp)TS.cp={x:tx,z:tz,m:zm,b:ann};
 const P=TS.cp,w=ph==='run'?(TS.rm?1.7:2.05):ph==='ann'?(TS.rm?2.6:3.1):(TS.rm?1.1:1.45),h=Math.min(dt,.05),k=Math.min(1,h*w*1.6),V=P.v||(P.v={x:0,z:0,m:0,b:0}),sd=(q,g)=>{V[q]+=(w*w*(g-P[q])-2*w*V[q])*h;P[q]+=V[q]*h};
 sd('x',tx);sd('z',tz);sd('m',zm);sd('b',ann);
 TS.camOK=Math.hypot(tx-P.x,tz-P.z)<.3&&Math.abs(ann-P.b)<.03&&Math.abs(zm-P.m)<.03&&Math.hypot(V.x,V.z)<.5;
 P.l=(P.l||0)+(clp(Math.hypot(tx-P.x,tz-P.z)*.24,0,3.8)-(P.l||0))*k;
 P.o=(P.o||0)+((ph==='run'?d*(TS.rm?.025:.055)*(1-1.45*sm3(clp(t/TS.end,0,1))):ph==='cele'?d*.1:0)-(P.o||0))*k;
 const R=clp((TS.ZW*1.5+5)/(.83*a)*1.9,18,70),b=sm3(clp(P.b,0,1)),h0=d*.48*P.m,z0=d*.82,h1=R*.82,z1=R*.48;
 camera.position.set(P.x+P.o,h0+(h1-h0)*b+P.l,P.z+z0+(z1-z0)*b);
 camera.lookAt(P.x,.8,P.z-1);
 if(ph==='cele'){
  const xs=TS.gx||[0],zs=TS.gz||[-10],halfW=(TS.ZW||10)/2,halfD=(TS.ZD||8)/2;
  const minX=Math.min(...xs)-halfW,maxX=Math.max(...xs)+halfW,minZ=Math.min(...zs)-halfD,maxZ=Math.max(...zs)+halfD;
  const targetX=(minX+maxX)/2,targetZ=(minZ+maxZ)/2,targetY=2.1,depth=maxZ-minZ,width=maxX-minX;
  const vf=camera.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*a),elev=.28;
  const dist=Math.max(width/(2*Math.tan(hf/2)),depth/(2*Math.tan(vf/2)*Math.cos(elev)))*1.06;
  const desiredPos=new THREE.Vector3(targetX,targetY+Math.sin(elev)*dist,maxZ+dist*Math.cos(elev));
  const desiredTarget=new THREE.Vector3(targetX,targetY,targetZ);
  if(!TS.celeCam)TS.celeCam={pos:camera.position.clone(),target:new THREE.Vector3(P.x,.8,P.z-1)};
  const ease=1-Math.exp(-Math.min(dt,.05)*(TS.rm?2.8:2.0));TS.celeCam.pos.lerp(desiredPos,ease);TS.celeCam.target.lerp(desiredTarget,ease);
  camera.position.copy(TS.celeCam.pos);camera.lookAt(TS.celeCam.target);
  obApply(targetX,targetY,targetZ,dt,minX-12,maxX+12,minZ-40,maxZ+dist+20);
 }else{TS.celeCam=null;obApply(P.x,.8,P.z-1,dt,-(C.W/2+12),C.W/2+12,C.mid-C.span/2+1,C.mid+C.span/2+70)}
}
const tsProg=()=>{const G=TS.res.groups;$('tsProg').innerHTML=G.map((g,i)=>'<span class="chip" style="background:'+hex(g.color)+'">'+esc(g.name)+' '+TS.pg[i]+'/'+g.ids.length+(TS.pg[i]===g.ids.length?' ✓':'')+'</span>').join('')};
function tsArrive(it){TS.pg[it.k]++;tsProg();tsRing(it);if(TS.sfxT<=0){sfx.boing();TS.sfxT=.1}}
/* animasi hanya visual: tujuan akhir = slot kelompok dari hasil; jalur: start -> pintu -> hall -> zona */
function tsAnim(it,dt,ph){const c=it.c,g=c.g,e=ph==='run'?TS.t-it.d:(ph==='prep'||ph==='count')?-1:1e9,speed=it.speed||4.9;
 const pauseStart=(it.pauseAt||0)/speed,pauseEnd=pauseStart+(it.pauseDur||0),hesitate=ph==='run'&&!!it.tease&&!!it.pauseDur&&e>=pauseStart&&e<pauseEnd;
 let dist=Math.max(0,e)*speed;if(it.pauseDur&&e>pauseStart)dist-=Math.min(e-pauseStart,it.pauseDur)*speed;
 const P=it.pts,L=it.L,last=P.length-1;
 let x=P[0][0],z=P[0][1],fa=Math.PI/2,y=0,aL=0,aR=0,sw=0,mood=0,mv=0,arr=0;
 if(e<=0){c.ph+=dt*(ph==='prep'?2.5:5.5);y=Math.abs(Math.sin(c.ph))*(ph==='prep'?.035:.13);if(ph==='count'){aL=-1.2+Math.sin(c.ph)*.6;aR=-1.2-Math.sin(c.ph)*.6;mood=2}}
 else if(dist<L[last]){let i=1;while(i<last&&L[i]<dist)i++;const f=(dist-L[i-1])/(L[i]-L[i-1]),dx=P[i][0]-P[i-1][0],dz=P[i][1]-P[i-1][1];x=P[i-1][0]+dx*f;z=P[i-1][1]+dz*f;fa=Math.atan2(-dz,dx);mv=hesitate?0:1;
  c.ph+=dt*(hesitate?3.1:7.8+speed*.48);sw=Math.sin(c.ph);y=hesitate?Math.abs(sw)*.035:Math.abs(sw)*.16;aL=hesitate?-.35+Math.sin(c.ph*1.7)*.22:-sw*.78;aR=hesitate?-.35-Math.sin(c.ph*1.7)*.22:sw*.78;
  if(hesitate){mood=1;fa+=Math.sin(c.ph*.8+it.id)*.12}}
 else{x=P[last][0];z=P[last][1];arr=1;fa=-Math.PI/2;mood=2;if(!it.done){it.done=1;tsArrive(it)}
  if(ph==='cele'){
   c.ph+=dt*(8.5+(it.id%4)*.55);
   const em=it.id%4,q=c.ph+it.id*.83;
   if(em===0){y=Math.abs(Math.sin(q*1.55))*.38;aL=-2.85+Math.sin(q*2.1)*.34;aR=2.85+Math.sin(q*2.1)*.34}
   else if(em===1){y=Math.abs(Math.sin(q*1.25))*.22;aL=-1.45-Math.abs(Math.sin(q*3.2))*.75;aR=-1.45-Math.abs(Math.sin(q*3.2+.35))*.75}
   else if(em===2){y=Math.abs(Math.sin(q*1.8))*.29;aL=-2.35+Math.sin(q*2.4)*.72;aR=2.25+Math.sin(q*2.4+Math.PI)*.72}
   else{y=Math.abs(Math.sin(q*1.4))*.34;aL=-2.65+Math.sin(q*1.7)*.28;aR=2.65+Math.sin(q*1.7+1.4)*.28}
   fa+=em===1?Math.sin(q*1.2)*.42:em===2?Math.sin(q*1.5)*.55:em===3?Math.sin(q*.8)*.25:0;
  }
  else if(ph==='ann'&&it.rev){const u=TS.ct-it.rt;c.ph+=dt*6;y=u<.6?Math.sin(Math.PI*u/.6)*.8:0;aR=-2.5+Math.sin(c.ph*2)*.45;if(u<.6)aL=-2.6}
  else{c.ph+=dt*4;y=Math.abs(Math.sin(c.ph))*.06;aL=Math.sin(c.ph)*.25;aR=-aL}}
 if(TS.rm){y*=.5;sw*=.6}
 const emStyle=it.id%4;
 if(ph==='cele')fa+=emStyle===1?Math.sin(c.ph*1.2+it.id)*.42:emStyle===2?Math.sin(c.ph*1.5+it.id)*.55:emStyle===3?Math.sin(c.ph*.8+it.id)*.25:0;
 let d=fa-g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));g.rotation.y+=d*Math.min(1,dt*10);
 const celeLean=ph==='cele'?(emStyle===2?Math.sin(c.ph*1.5)*.2:emStyle===3?Math.sin(c.ph*.9)*.12:Math.sin(c.ph*1.1)*.07):0;
 c.torso.rotation.z=(mv?-.14:0)+(hesitate?Math.sin(c.ph*1.7+it.id)*.06:0)+celeLean;c.legL.rotation.z=ph==='cele'?Math.sin(c.ph*1.7+it.id)*.22:sw*.9;c.legR.rotation.z=ph==='cele'?-Math.sin(c.ph*1.7+it.id)*.22:-sw*.9;c.armL.rotation.z=aL;c.armR.rotation.z=aR;c.head.rotation.z=(mv?Math.sin(c.ph*2)*.05:0)+(ph==='cele'?Math.sin(c.ph*1.3+it.id)*.08:0);
 if(arr&&ph==='ann'&&!it.rev)mood=1;c.head.rotation.y=hesitate?Math.sin(c.ph*.9+it.id)*.22:0;ckArms(c,aL,aR);ckFx(c,dt,mood,arr&&(ph==='cele'||(ph==='ann'&&!!it.rev)),mv?0:1);
 g.position.set(x,.2+y,z);const sh=Math.max(.5,1-y*.4);c.blob.position.set(x,.25,z);c.blob.scale.set(.6*sh,.42*sh,1);return arr}

/* ===== UPGRADE ARENA TEAM SHUFFLE: dekorasi, platform neon, partikel, ring ===== */
function tsNeon(w,h,d,x,y,z,c){const m=rb(w,h,d,.03,c,x,y,z);m.material=new THREE.MeshBasicMaterial({color:lin(c)});return m}
function tsPad(g,x,z,W,D){rb(W+.6,.2,D+.6,.14,0x2C3468,x,.02,z);const q=.1;tsNeon(W+.4,.06,q,x,.2,z-D/2,g.color);tsNeon(W+.4,.06,q,x,.2,z+D/2,g.color);tsNeon(q,.06,D,x-W/2-.05,.2,z,g.color);tsNeon(q,.06,D,x+W/2+.05,.2,z,g.color)}
function tsDeco(Wi,Di){const sc=scene,cy=0x33D6FF,vi=0x8A5CFF;TS.dc=[];
 const hs=label('THE LAST STAND · TEAM SHUFFLE','#BFE9FF');hs.scale.set(Math.min(24,Wi*.75),5.2,1);hs.position.set(0,8.2,-Di+.4);sc.add(hs);
 const rg=new THREE.Mesh(new THREE.TorusGeometry(Math.min(9,Wi*.28),.16,8,56),new THREE.MeshBasicMaterial({color:lin(vi)}));rg.geometry.userData.own=1;rg.position.set(0,8,-Di+.1);sc.add(rg);TS.dc.push(rg);
 for(const sd of[-1,1]){for(let k=0;k<5;k++)tsNeon(.45,6,.45,sd*(Wi/2+1.6),3,-2-k*Di/5,k%2?vi:cy);tsNeon(.12,.05,Di,sd*(Wi/2-1),.12,-Di/2,cy)}
 tsNeon(.14,.05,8,0,.14,2,cy);
 const n=TS.rm?50:110,pa=new Float32Array(n*3);for(let i=0;i<n;i++){pa[i*3]=(Math.random()-.5)*(Wi+10);pa[i*3+1]=Math.random()*16;pa[i*3+2]=6-Math.random()*(Di+8)}
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pa,3));pg.userData.own=1;TS.pt=new THREE.Points(pg,new THREE.PointsMaterial({color:lin(0x9FE6FF),size:.35,transparent:true,opacity:.55,depthWrite:false}));sc.add(TS.pt);
 const rgeo=new THREE.RingGeometry(.55,.75,40);rgeo.userData.own=1;TS.rg=[];
 for(let i=0;i<10;i++){const r=new THREE.Mesh(rgeo,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;r.visible=false;r.l=0;sc.add(r);TS.rg.push(r)}
 TS.ar=new THREE.Mesh(new THREE.RingGeometry(.8,1.05,40),new THREE.MeshBasicMaterial({color:lin(0xBFE9FF),transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide}));TS.ar.geometry.userData.own=1;TS.ar.rotation.x=-Math.PI/2;TS.ar.visible=false;sc.add(TS.ar);TS.act=null}
function tsRing(it){const r=(TS.rg||[]).find(q=>q.l<=0);if(!r)return;const p=it.c.g.position;r.position.set(p.x,.3,p.z);r.material.color.copy(lin(TS.res.groups[it.k].color));r.l=.75;r.visible=true}
function tsFx(dt,ph){const R=TS.rm?.5:1;
 if(TS.pt){const a=TS.pt.geometry.attributes.position,A=a.array;for(let i=1;i<A.length;i+=3){A[i]+=dt*.5*R;if(A[i]>16)A[i]=.5}a.needsUpdate=true}
 (TS.dc||[]).forEach(m=>m.rotation.z+=dt*.25*R);(TS.lamps||[]).forEach((m,i)=>{const p=1+.09*Math.sin(TS.t*3+i);m.scale.set(p,p,p)});
 (TS.rg||[]).forEach(r=>{if(r.l>0){r.l-=dt;const u=Math.min(1,1-r.l/.75),s=1+u*2.6;r.scale.set(s,s,1);r.material.opacity=.8*(1-u);if(r.l<=0)r.visible=false}});
 if(TS.ar){const a=TS.act;TS.ar.visible=!!a&&ph==='ann';if(TS.ar.visible){TS.ar.position.set(a.c.g.position.x,.3,a.c.g.position.z);const s=1+.08*Math.sin(TS.t*5*R);TS.ar.scale.set(s,s,1)}}}
function tsFrame(dt){if(TS.paused)dt=0;TS.t+=dt;let ph=TS.ph;const N=TS.names.length,G=TS.res.groups,big=$('tsBig');
 if(ph==='prep'){if(TS.t>1.4){TS.ph=ph='count';TS.t=0}}
 else if(ph==='count'){const tx=TS.t<2.7?String(3-Math.floor(TS.t/.9)):'GO!';if(tx!==TS.last){TS.last=tx;big.textContent=tx;if(tx==='GO!'){sfx.go();TS.flash=TS.rm?.4:1}else sfx.tick()}
  big.style.transform='scale('+(1.5-.5*sm3(clp((TS.t%.9)/.45,0,1)))+')';if(TS.t>3.4){big.textContent='';big.style.transform='';TS.ph=ph='run';TS.t=0}}
 else if(ph==='run'){if(TS.t>TS.end){TS.ph=ph='ann';TS.t=0;TS.gi=0;TS.ct=0;TS.lg=-1;TS.dr=0;TS.items.forEach(it=>it.c.lb.visible=false);OB.pts.clear();$('cv').classList.remove('drag');obReset()}}
 else if(ph==='ann'){if(TS.go)TS.ct+=dt;const g=G[TS.gi],mem=TS.mem[TS.gi];
  if(TS.lg!==TS.gi){TS.lg=TS.gi;TS.nr=0;TS.rv=0;TS.go=0;TS.mt=0;TS.ct=0;big.textContent='';big.style.opacity='0'}
  if(!TS.go){TS.mt+=dt;if((TS.camOK&&TS.mt>.25)||TS.mt>3.5){TS.go=1;TS.ct=0;big.textContent=g.name;big.style.fontSize=g.name.length>12?'clamp(32px,8vw,100px)':''}}
  if(TS.go){
  if(TS.ct<.7){big.style.opacity=clp(TS.ct/.25,0,1);big.style.transform='scale('+(1+(TS.rm?.04:.12)*Math.sin(TS.ct*(TS.rm?8:22)))+')';TS.dr-=dt;if(TS.dr<=0){TS.dr=.11;tone(180+TS.ct*200,.08,'triangle',.2)}}
  else{const idx=Math.floor((TS.ct-.7)/.7);while(TS.nr<=idx&&TS.nr<mem.length){const it=mem[TS.nr++];it.rev=1;it.rt=TS.ct;TS.act=it;it.c.lb.visible=true;TS.rv=TS.ct;big.textContent=TS.names[it.id];big.style.fontSize='clamp(26px,6vw,72px)';tone(520+TS.nr*40,.15,'triangle',.25);burst(TS.gx[TS.gi],3,TS.gz[TS.gi],5)}
   big.style.opacity='1';big.style.transform='scale('+(1.35-.35*sm3(clp((TS.ct-TS.rv)/.25,0,1)))+')'}
  if(TS.ct>.7+mem.length*.7+.45){big.textContent='';big.style.transform='';big.style.opacity='';big.style.fontSize='';TS.gi++;TS.ct=0;TS.lg=-1;sfx.fin();
   if(TS.gi>=G.length){TS.gi=G.length-1;TS.ph=ph='cele';TS.t=0;TS.cf=0;sfx.win();TS.items.forEach(it=>it.c.lb.visible=true);big.textContent='SEMUA TIM TERBENTUK!';big.style.fontSize='clamp(30px,7vw,90px)';$('tsView').style.display='block'}}}}
 else if(ph==='cele'){big.style.opacity='';TS.cf-=dt;if(TS.cf<=0){TS.cf=1;TS.gx.forEach((x,i)=>burst(x,4,TS.gz[i],10))}big.style.transform='scale('+(1+.05*Math.sin(TS.t*4))+')'}
 let arr=0;TS.items.forEach(it=>{if(tsAnim(it,dt,ph))arr++});
 TS.zm.forEach((m,i)=>{const tg=ph==='ann'&&i===TS.gi?.35+(TS.rm?.04:.1)*Math.sin(TS.t*9+TS.ct*9):ph==='cele'?(TS.t>i*.25?.35:.08):TS.pg[i]===G[i].ids.length&&ph==='run'?.15:0;m.emissiveIntensity+=(tg-m.emissiveIntensity)*Math.min(1,dt*8)});
 const sp_=TS.sp,on=ph==='ann';sp_.intensity+=((on?1.1:0)-sp_.intensity)*Math.min(1,dt*5);if(on){sp_.position.set(TS.gx[TS.gi],16,TS.gz[TS.gi]+8);sp_.target.position.set(TS.gx[TS.gi],0,TS.gz[TS.gi])}
 TS.bm.emissiveIntensity+=((ph==='cele'?1:0)-TS.bm.emissiveIntensity)*Math.min(1,dt*3);
 TS.hl.intensity+=((on?.8:1)+Math.max(0,TS.flash)*.6-TS.hl.intensity)*Math.min(1,dt*6);TS.flash-=dt*1.5;TS.sfxT-=dt;
 const st=ph==='prep'?'PERSIAPAN':ph==='count'?'HITUNG MUNDUR':ph==='run'?'LOMBA MASUK RUANGAN '+arr+'/'+N:ph==='ann'?'MENGUMUMKAN '+G[TS.gi].name.toUpperCase()+' ('+(TS.gi+1)+'/'+G.length+')':'SELEBRASI!';if(st!==TS.st){TS.st=st;$('tsStatus').textContent=st}
 if(TS.ent){const hide=ph==='ann'||ph==='cele';TS.ent.forEach(o=>o.visible=!hide)}tsFx(dt,ph);confUpd(dt);tsCam(dt);renderer.render(scene,camera)}
function tsStop(){TS.on=false;$('tsView').style.display='none';$('tsBig').textContent='';clear()}
const readTsHistory=()=>{const v=LS.get('lmp_ts_hist',[]);if(!Array.isArray(v))return[];return v.filter(x=>x&&typeof x==='object'&&typeof x.time==='string'&&Array.isArray(x.groups)).slice(0,MAXH).map(x=>({time:x.time,total:Number.isFinite(Number(x.total))?Number(x.total):0,groups:x.groups.filter(g=>g&&typeof g==='object'&&Array.isArray(g.members)).slice(0,TS.MAXG).map(g=>({name:String(g.name??'').slice(0,MAX_GROUP_NAME),members:g.members.filter(m=>m!=null).map(m=>String(m).slice(0,MAX_STUDENT_NAME)).slice(0,TS.MAXN)}))}))};
function tsFinish(){if(!TS.res||TS.res.saved)return;TS.res.saved=1;tsStop();const r=TS.res;
 const h=readTsHistory();h.unshift({time:r.time,total:TS.names.length,groups:r.groups.map(g=>({name:g.name,members:g.members}))});h.length=Math.min(h.length,MAXH);LS.set('lmp_ts_hist',h);
 $('tsWhen').textContent='Waktu pembagian: '+new Date(r.time).toLocaleString('id-ID')+' · '+TS.names.length+' mahasiswa · '+r.groups.length+' kelompok';$('tsMsg').textContent=TS.note||'';TS.note='';
 $('tsCards').innerHTML=r.groups.map((g,i)=>`<article class="gc" style="--gc:${hex(g.color)}"><h3>${esc(g.name)}<span>${g.members.length} anggota</span></h3><ol>${g.members.map(m=>'<li>'+esc(m)+'</li>').join('')}</ol><button class="y" data-g="${i}">Salin kelompok</button></article>`).join('');
 show('tsResults')}
$('tsSkip').onclick=$('tsView').onclick=tsFinish;$('tsReroll').onclick=tsStart;$('tsPause').onclick=()=>{TS.paused=!TS.paused;$('tsPause').textContent=TS.paused?'Lanjut':'Jeda'};
$('tsVol').value=vol;$('tsMute').textContent='Suara: '+(muted?'OFF':'ON');$('tsFs').onclick=$('fs').onclick;
$('tsMute').onclick=()=>{muted=!muted;LS.set('lmp_muted',muted);$('mute').textContent=$('tsMute').textContent='Suara: '+(muted?'OFF':'ON');actx()};
$('tsVol').oninput=()=>{vol=+$('tsVol').value;LS.set('lmp_vol',vol);$('vol').value=vol};$('tsBack').onclick=async()=>{if(!await cfm('Hentikan animasi dan kembali ke pengaturan?'))return;tsStop();show('tsSetup')};
async function tsCopy(t){try{await navigator.clipboard.writeText(t);return true}catch(e){const x=document.createElement('textarea');x.value=t;document.body.appendChild(x);x.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}x.remove();return ok}}
const tsSay=async t=>{$('tsMsg').textContent=(await tsCopy(t))?'Berhasil disalin ✔':'Gagal menyalin.'};
const tsAll=()=>TS.res.groups.map(gtxt).join('\n\n');
const tsCsvCell = value =>
    '"' + csvSafe(value).replace(/"/g, '""') + '"';

const tsCsvT = () =>
    '\uFEFFKelompok,No,Nama\n' +
    TS.res.groups.flatMap(g =>
        g.members.map((m, i) =>
            `${tsCsvCell(g.name)},${i + 1},${tsCsvCell(m)}`
        )
    ).join('\n');
$('tsCards').onclick=e=>{const g=e.target.dataset.g;if(g!==undefined)tsSay(gtxt(TS.res.groups[+g]))};
$('tsCopy').onclick=()=>tsSay(tsAll());$('tsTxt').onclick=()=>dl('pembagian-kelompok.txt',tsAll(),'text/plain');$('tsCsv').onclick=()=>dl('pembagian-kelompok.csv',tsCsvT(),'text/csv;charset=utf-8');$('tsPrint').onclick=()=>window.print();
function tsHist(){const h=readTsHistory();$('tsHL').innerHTML=h.length?h.map((x,i)=>`<div class="h"><div class="hh"><b>${new Date(x.time).toLocaleString('id-ID')}</b><span>${x.total} mahasiswa · ${x.groups.length} kelompok</span><button class="o" data-x="${i}">Hapus</button></div><details><summary>Lihat hasil</summary><pre style="white-space:pre-wrap;font:inherit">${esc(x.groups.map(gtxt).join('\n\n'))}</pre></details></div>`).join(''):'<div class="h">Belum ada riwayat.</div>';$('tsHistory').style.display='block'}
$('tsHist').onclick=$('tsHist2').onclick=tsHist;$('tsHclose').onclick=()=>$('tsHistory').style.display='none';
$('tsHL').onclick=e=>{const b=e.target.closest&&e.target.closest('button[data-x]');if(!b)return;const x=b.dataset.x;const h=readTsHistory();h.splice(+x,1);LS.set('lmp_ts_hist',h);tsHist()};
$('tsHclear').onclick=async()=>{if(await cfm('Hapus seluruh riwayat Team Shuffle?')){LS.set('lmp_ts_hist',[]);tsHist()}};
tsSync();tsList();tsInfo();
/* ================= akhir TEAM SHUFFLE ================= */

/* ===== HERO TEAM SHUFFLE: dua astronaut saling berinteraksi (siklus 16 detik) ===== */
let hR=null,hS,hC,hF,hM,hT=0,hLast=0;
const HCY=16,HK=['y','sq','sway','lean','hy','hn','ht','aL','aR','aLx','aRx','lL','lR','dx'];
const hEnv=(t,a,b,r)=>{r=r||.28;return sm3(clp((t-a)/r,0,1))*sm3(clp((b-t)/r,0,1))};
const hMix=(a,b,e)=>a+(b-a)*e;
function initTsHero(){if(!glOK)return;try{hR=new THREE.WebGLRenderer({canvas:$('tsHero'),antialias:true,alpha:true});hR.outputEncoding=THREE.sRGBEncoding;hR.setPixelRatio(Math.min(devicePixelRatio||1,2));
 hS=new THREE.Scene();hS.add(new THREE.HemisphereLight(lin(0xFFF7E8),lin(0xC9B9F0),.9));const d=new THREE.DirectionalLight(lin(0xFFE6C4),.8);d.position.set(3,6,5);hS.add(d);hC=new THREE.PerspectiveCamera(30,1.5,.1,60);
 const mk=(sx,x,ry)=>{const c=makeChar(3,'',sx,0),lb=c.g.children[c.g.children.length-1];c.g.remove(lb);lb.material.map.dispose();lb.material.dispose();c.bx=x;c.by=ry;c.g.position.x=x;c.g.rotation.y=ry;hS.add(c.g);return c};
 /* menghadap kamera, sedikit saling berhadapan */
 hF=mk('F',-1.5,-Math.PI/2+.5);hM=mk('M',1.5,-Math.PI/2-.5)}catch(e){hR=null}}

/* siklus 16 dtk: idle -> lambai -> lompat kembar -> high-five -> malu/kikik. i=0 Pink, i=1 Green */
function heroPose(i,T){
 const sg=i?-1:1,t=T%HCY,w=T+i*1.7,o={y:0,sq:0,sway:0,lean:0,hy:0,hn:0,ht:0,aL:0,aR:0,aLx:0,aRx:0,lL:0,lR:0,dx:0,spin:0,mood:0,happy:false};
 /* idle dasar */
 o.y=(1-Math.cos(w*2.2))*.035;
 o.sway=Math.sin(w*1.3)*.04+Math.sin(w*.5)*.02;
 o.lean=Math.sin(w*1.7+1)*.02;
 o.hy=sg*(-.5+1.4*(.5+.5*Math.sin(w*.5)));   /* melirik antara kamera dan temannya */
 o.hn=-.05+Math.sin(w*2.2)*.03;
 o.ht=Math.sin(w*.8)*.06;
 o.aL=Math.sin(w*1.3)*.14;o.aR=Math.sin(w*1.1+1.7)*.14;
 o.aLx=.1+Math.sin(w*.9)*.05;o.aRx=-(.1+Math.sin(w*.8+1)*.05);
 o.lL=Math.sin(w*2.2)*.07;o.lR=-o.lL;
 /* 1) lambaikan tangan: Pink dulu, Green menoleh lalu membalas */
 const lp=i?hEnv(t,2.7,3.6,.2):0;if(lp>0)o.hy=hMix(o.hy,sg*.9,lp);
 const wv=i?hEnv(t,3.3,5.9):hEnv(t,2.6,5.2);
 if(wv>0){const s=-2.5+Math.sin(t*20)*.45;
  if(i){o.aL=hMix(o.aL,s,wv);o.aLx=hMix(o.aLx,.3,wv)}else{o.aR=hMix(o.aR,s,wv);o.aRx=hMix(o.aRx,-.3,wv)}
  o.hy=hMix(o.hy,-sg*.5,wv);o.ht+=.1*wv;o.y+=Math.abs(Math.sin(t*10))*.03*wv;o.mood=2}
 /* 2) lompat kembar 2x, lompatan kedua sambil berputar */
 const he=hEnv(t,8,10.8,.12);
 if(he>0){const u=clp((t-8)/2.8,0,1),k=Math.min(u*2,2-1e-6),h=hop(k-Math.floor(k)),cr=Math.max(0,h.s);
  o.y+=h.y*.45*he;o.sq+=h.s*he;o.aL=hMix(o.aL,-cr*2-h.y*2.3,he);o.aR=hMix(o.aR,-cr*2+h.y*2.3,he);
  o.lL-=h.y*.5*he;o.lR-=h.y*.5*he;o.aLx=hMix(o.aLx,.3,he);o.aRx=hMix(o.aRx,-.3,he);
  o.hy=hMix(o.hy,-sg*.5,he);o.mood=2;o.happy=h.y>.12}
 o.spin=sg*sm3(clp((t-9.5)/.85,0,1))*TAU;
 /* 3) high-five: mendekat, tangan bagian dalam bertemu, lalu "pop" */
 const fe=hEnv(t,10.9,13.4,.35);
 if(fe>0){o.dx=sg*.35*fe;o.lean-=.2*fe;o.hy=hMix(o.hy,sg*.9,fe);o.mood=2;
  if(i){o.aR=hMix(o.aR,2.3,fe);o.aRx=hMix(o.aRx,-.8,fe)}else{o.aL=hMix(o.aL,-2.3,fe);o.aLx=hMix(o.aLx,.8,fe)}}
 const pp=hEnv(t,12.1,12.6,.12);
 if(pp>0){o.sq+=.14*pp;o.y+=.1*pp;if(pp>.3){o.happy=true;o.mood=2}}
 /* 4) Pink menunduk malu, Green terkikik */
 if(i===0){const b=hEnv(t,14,15.7,.4);o.lean-=.5*b;o.hn-=.2*b;o.hy=hMix(o.hy,sg*.9,b);o.ht+=.08*b*Math.sin(t*3)}
 else{const g=hEnv(t,14.4,16,.3);o.sway+=Math.sin(t*26)*.07*g;o.y+=Math.abs(Math.sin(t*13))*.05*g;if(g>.3){o.happy=true;o.mood=2}}
 return o}

function tsHeroFrame(now){if(!hR||document.hidden||!$('tsSetup').classList.contains('on'))return;const cv=$('tsHero'),w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;
 if(cv.width!==Math.round(w*hR.getPixelRatio())||cv.height!==Math.round(h*hR.getPixelRatio())){hR.setSize(w,h,false);hC.aspect=w/h;hC.updateProjectionMatrix();hC.position.set(0,2.7,11.6*Math.max(1,1.35/(w/h)));hC.lookAt(0,1.8,0)}
 const dt=hLast?Math.min((now-hLast)/1000,.05):0;hLast=now;hT+=dt;const rm=RMq.matches,k1=1-Math.exp(-dt*14),k2=1-Math.exp(-dt*30);
 [hF,hM].forEach((c,i)=>{const o=heroPose(i,hT);
  if(rm){HK.forEach(k=>o[k]*=.4);o.spin=0}
  /* pose disimpan di c.pp (bukan c.hp, karena c.hp = mesh mata senyum milik karakter) */
  const P=c.pp||(c.pp={});if(P.y===undefined)HK.forEach(k=>P[k]=o[k]);
  HK.forEach(k=>{P[k]+=(o[k]-P[k])*(/^(y|sq|aL|aR|aLx|aRx)$/.test(k)?k2:k1)});
  const sq=clp(P.sq,-.2,.3);
  c.g.position.set(c.bx+P.dx,P.y,0);c.g.rotation.y=c.by+o.spin;
  c.rig.scale.set(1+sq*.45,1-sq,1+sq*.45);c.rig.rotation.x=P.sway;c.rig.rotation.z=P.lean;
  c.head.rotation.y=P.hy;c.head.rotation.z=P.hn;c.head.rotation.x=P.ht;
  c.armL.rotation.z=P.aL;c.armL.rotation.x=P.aLx;c.armR.rotation.z=P.aR;c.armR.rotation.x=P.aRx;
  c.legL.rotation.z=P.lL;c.legR.rotation.z=P.lR;c.bag.rotation.x=Math.sin(hT*2.2+i)*.03-P.sway*.5;
  ckFx(c,dt,o.mood,o.happy,0,false)});
 hR.render(hS,hC)}

function loop(now){requestAnimationFrame(loop);const gap=now-last,dt=Math.min(gap/1000||0,.05);last=now;try{mascotFrame(now)}catch(error){console.error('PANIK PODIUM: Maskot gagal dianimasikan.',error);try{mR?.dispose()}catch(_){}mR=null}try{tsHeroFrame(now)}catch(error){console.error('PANIK PODIUM: Hero Team Shuffle gagal dianimasikan.',error);try{hR?.dispose()}catch(_){}hR=null}if(TS.on){if(scene&&glOK){try{tsFrame(dt)}catch(error){console.error('PANIK PODIUM: Animasi Team Shuffle dihentikan karena error.',error);TS.note='Animasi mengalami kendala. Hasil pembagian tetap tersedia.';tsFinish()}}return}if(!glOK||!scene||!R||!['COUNTDOWN','RUNNING','REVEAL'].includes(state))return;
 if(gap>1000){fpsS=0;fpsN=0}
 if(state==='RUNNING'){fpsN++;if(!fpsS)fpsS=now;else if(now-fpsS>3000){const f=fpsN*1000/(now-fpsS);fpsS=now;fpsN=0;if(f<28&&Q>0){Q--;LS.set('lmp_q',Q);updQ();applyQ();say('Grafis diturunkan otomatis agar lebih lancar')}}}
 musicStep(dt);if(bigT>0){bigT-=dt;if(bigT<=0&&state!=='REVEAL')$('big').innerHTML=''}if(cmtT>0){cmtT-=dt;if(cmtT<=0)$('cmt').style.display='none'}
 if(state==='COUNTDOWN'){cd-=dt*.8;const n=Math.ceil(cd);
  if(n>0){if(n!==lastCd){lastCd=n;sfx.tick();$('big').textContent=n}}
  else{if(lastCd!==0){lastCd=0;sfx.go();shk=.8;music=true;mGap=.26;$('big').textContent='MULAI!'}if(cd<-.8){$('big').textContent='';t=0;setState('RUNNING')}}
  chars.forEach(c=>animate(c,dt,0,false))}
 else if(state==='RUNNING'){
  let lead=0,lid=-1;chars.forEach(c=>{if(c.s<1&&c.g.position.x>lead){lead=c.g.position.x;lid=c.id}});
  const near=lead>L*.86&&finN===0;if(near!==slow){slow=near;if(near){say('Dorrrrr! Siapa yang pertama?!');$('status').textContent='DORRRR!';big('<span><small>SEBENTAR LAGI</small>DORRR!</span>',1.8);tone(200,.5,'sawtooth',.2)}}
  t+=dt*(slow?.5:1);rkT-=dt;if(rkT<=0){rkT=.25;rankUpd()}$('vig').style.opacity=slow?.95:Math.max(0,Math.min(.45,(lead/L-.55)*1.4));
  cmQ-=dt;if(cmQ<=0&&lid>=0&&finN===0&&t>3){cmQ=5+Math.random()*3;const nm=R.groups[lid].name,ls=[nm+' masih di depan... tapi belum aman!','Jaraknya tipis! Siapa yang bakal maju duluan?','Jantung berdebar... jangan kedip!',nm+' memimpin posisi!'];say(ls[Math.random()*ls.length|0])}
  chars.forEach(c=>{animate(c,dt,t,true);if(!c.fin&&t>=c.T){c.fin=true;finN++;shk=.5;sfx.fin();burst(L+1,5,c.g.position.z,26);big(`<span><small>URUTAN KE-${finN}</small>${esc(c.g.children[c.g.children.length-1]?R.groups[c.id].name:'')}</span>`,2.2);$('big').style.fontSize=R.groups[c.id].name.length>14?'clamp(30px,7vw,90px)':''}});
  if(lid>=0&&lid!==lastLead&&t>3&&finN===0){if(lastLead>=0)say(R.groups[lid].name+' menyalip dan memimpin!');lastLead=lid}
  const pr=Math.min(1,t/(32+R.order.length*1.3));mGap=slow?.14:.26-.15*pr;
  const dots=$('prog').children;chars.forEach((c,i)=>{const e=eOf(c,c.s);dots[i+1].style.left=(3+e*90)+'%'});
  if(chars.every(c=>c.fin)&&t>Math.max(...chars.map(c=>c.T))+1.5){setState('REVEAL');slow=false;$('vig').style.opacity=0;$('rank').innerHTML='';revT=0;rvI=-1;music=false;bigT=0;$('big').style.fontSize=R.groups[R.order[0]].name.length>14?'clamp(30px,7vw,90px)':'';
   $('big').innerHTML=''}}
 else if(state==='REVEAL'){revT+=dt;chars.forEach(c=>animate(c,dt,t,true));
  const n=R.order.length,du=i=>{const r=n-i;return r>=4?.6:r===3?1:r===2?1.4:2.2};let acc=0,idx=0;while(idx<n&&revT>=acc+du(idx)){acc+=du(idx);idx++}
  if(idx!==rvI){rvI=idx;const bg=$('big');
   if(idx<n-1){const rk=n-idx,nm=R.groups[R.order[rk-1]].name;bg.style.fontSize=nm.length>14?'clamp(30px,7vw,90px)':'';bg.innerHTML='<span><small>URUTAN KE-'+rk+'</small>'+esc(nm)+'</span>';sfx.fin();shk=.4}
   else if(idx===n-1){bg.style.fontSize='';bg.innerHTML='<span><small>PRESENTASI PERTAMA ADALAH...</small>???</span>'}
   else{const nm=R.groups[R.order[0]].name;bg.style.fontSize=nm.length>14?'clamp(30px,7vw,90px)':'';bg.innerHTML='<span><small>PRESENTASI PERTAMA</small>'+esc(nm)+'</span>';sfx.win();burst(L+3,9,0,150);shk=1}}
  if(idx===n-1){dr2-=dt;if(dr2<=0){dr2=.07;tone(110+(revT-acc)*120,.06,'triangle',.22)}shk=Math.max(shk,.1+(revT-acc)*.1)}
  if(idx===n){cfT-=dt;if(cfT<0){cfT=.9;burst(L+3,9,0,40)}if(revT>acc+4){$('big').innerHTML='';$('big').style.fontSize='';finish();return}}}
 specs.forEach((g,i)=>{const h=state==='REVEAL'?1:(finN>0?.7:.2);g.position.y=.5+Math.abs(Math.sin(performance.now()/1000*(3+h*3)+i))*.2*(.2+h)});rcFx(dt);confUpd(dt);camTarget(dt);if(slow||shk>0){const m=(slow?.1:0)+shk;camera.position.x+=(Math.random()-.5)*m;camera.position.y+=(Math.random()-.5)*m;shk=Math.max(0,shk-dt*2)}if(SUN){SUN.target.position.x=camX;SUN.position.set(camX+15,45,30)}try{renderer.render(scene,camera)}catch(error){console.error('PANIK PODIUM: Render arena mengalami error.',error);$('err').textContent='Arena 3D mengalami kendala. Hasil pengundian tetap akan ditampilkan.';finish();return}}
requestAnimationFrame(loop);
initMascot();initTsHero();
const mainCanvas=$('cv');if(mainCanvas)mainCanvas.addEventListener('webglcontextlost',e=>{e.preventDefault();glOK=false;$('err').textContent='Koneksi grafis 3D terputus. Muat ulang halaman untuk mengaktifkannya kembali.';if(TS.on){TS.note='Koneksi grafis terputus. Hasil pembagian tetap tersedia.';tsFinish()}else if(R&&['COUNTDOWN','RUNNING','REVEAL'].includes(state))finish()});
if(!glOK)$('err').textContent='WebGL tidak tersedia: undian tetap berjalan tanpa arena 3D.';
rows();
})();

document.addEventListener('keydown',e=>{if(e.key!=='Escape'||e.defaultPrevented)return;const g=i=>document.getElementById(i),o=i=>getComputedStyle(g(i)).display!=='none';
 if(o('tsHistory'))g('tsHclose').click();else if(o('history'))g('hclose').click();else if(o('tshud'))g('tsBack').click();else if(o('hud'))g('back').click()});
['top','tsTop'].forEach(i=>{const t=document.getElementById(i);if(t&&window.ResizeObserver)new ResizeObserver(()=>t.parentNode.style.setProperty('--tbh',t.offsetHeight+'px')).observe(t)});
