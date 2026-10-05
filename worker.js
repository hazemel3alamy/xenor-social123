const APP="XENOR";

const SCHEMA=`
CREATE TABLE IF NOT EXISTS users(
 id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,
 password_hash TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'user',
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions(
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL,created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS posts(
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL,content TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS likes(
 user_id TEXT NOT NULL,post_id TEXT NOT NULL,
 PRIMARY KEY(user_id,post_id)
);
CREATE TABLE IF NOT EXISTS products(
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL,name TEXT NOT NULL,
 description TEXT DEFAULT '',price TEXT DEFAULT '',image TEXT DEFAULT '',
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS messages(
 id TEXT PRIMARY KEY,sender_id TEXT NOT NULL,receiver_id TEXT NOT NULL,
 content TEXT NOT NULL,created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS friendships(
 user_id TEXT NOT NULL,friend_id TEXT NOT NULL,status TEXT NOT NULL,
 created_at TEXT NOT NULL,PRIMARY KEY(user_id,friend_id)
);
CREATE TABLE IF NOT EXISTS stories(
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL,content TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS reels(
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL,content TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS services(
 id TEXT PRIMARY KEY,name TEXT NOT NULL,description TEXT DEFAULT '',
 price TEXT DEFAULT '',created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS academy(
 id TEXT PRIMARY KEY,title TEXT NOT NULL,description TEXT DEFAULT '',
 url TEXT DEFAULT '',created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS notifications(
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL,text TEXT NOT NULL,
 created_at TEXT NOT NULL
);
`;

const HTML=`<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#f5c400">
<meta name="description" content="XENOR Social Platform">
<link rel="manifest" href="/manifest.json">
<title>XENOR</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#080808;color:#fff;font-family:Arial,sans-serif}
button,input,textarea{font:inherit}
button{cursor:pointer}
.top{position:sticky;top:0;z-index:10;background:#080808;border-bottom:1px solid #292929;padding:12px;display:flex;align-items:center;gap:8px}
.brand{color:#f5c400;font-size:21px;flex:1}
.alt,.yellow{border:0;border-radius:10px;background:#f5c400;color:#000;padding:9px 13px;font-weight:bold}
.wrap{max-width:700px;margin:auto;padding:14px 12px 85px}
.card{background:#111;border:1px solid #292929;border-radius:16px;padding:15px;margin:10px 0}
input,textarea{width:100%;background:#171717;color:#fff;border:1px solid #333;border-radius:10px;padding:12px;margin:5px 0}
textarea{min-height:90px;resize:vertical}
h1,h2,h3{margin-top:5px}
.muted{color:#aaa}
.nav{position:fixed;bottom:0;left:0;right:0;z-index:20;background:#0d0d0d;border-top:1px solid #292929;display:flex;overflow-x:auto}
.nav button{min-width:82px;background:transparent;border:0;color:#ddd;padding:10px 7px;font-size:12px}
.nav button:hover{color:#f5c400}
.item{border-top:1px solid #292929;padding:12px 0}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.stat{background:#191919;border-radius:12px;padding:15px;text-align:center}
.stat b{display:block;color:#f5c400;font-size:23px}
.danger{background:#c62828;color:white;border:0;border-radius:9px;padding:8px}
.ok{color:#f5c400}
a{color:#f5c400}
.hide{display:none!important}
</style>
</head>
<body>
<header class="top">
<button class="alt" onclick="goBack()">‹ رجوع</button>
<b class="brand">✕ XENOR</b>
<span id="me"></span>
</header>
<main id="app" class="wrap"></main>
<nav id="nav" class="nav"></nav>

<script>
const $=id=>document.getElementById(id);
let state={user:null};

async function api(url,opt={}){
 const r=await fetch(url,{
   credentials:"include",
   headers:{"content-type":"application/json",...(opt.headers||{})},
   ...opt
 });
 let d={};
 try{d=await r.json()}catch{}
 if(!r.ok)throw Error(d.error||"حدث خطأ");
 return d;
}

function go(x){location.hash=x}
function goBack(){
 if(history.length>1)history.back();
 else go("home");
}
function esc(x){
 return String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}
function nav(){
 let n=[
  ["home","الرئيسية"],["feed","المنشورات"],["friends","الأصدقاء"],
  ["messages","الرسائل"],["stories","Stories"],["reels","Reels"],
  ["market","السوق"],["academy","الأكاديمية"],["services","الخدمات"],
  ["profile","حسابي"],["notifications","الإشعارات"]
 ];
 if(state.user?.role==="admin")n.push(["admin","الإدارة"]);
 $("nav").innerHTML=n.map(x=>"<button onclick=\"go('"+x[0]+"')\">"+x[1]+"</button>").join("");
}

async function boot(){
 try{state.user=(await api("/api/me")).user}catch{}
 nav();
 render();
}
window.addEventListener("hashchange",render);

async function render(){
 nav();
 let p=location.hash.replace("#","")||"home";
 try{
  if(p==="home")home();
  else if(p==="login")login();
  else if(p==="feed")feed();
  else if(p==="friends")friends();
  else if(p==="messages")messages();
  else if(p==="stories")stories();
  else if(p==="reels")reels();
  else if(p==="market")market();
  else if(p==="academy")academy();
  else if(p==="services")services();
  else if(p==="profile")profile();
  else if(p==="notifications")notifications();
  else if(p==="admin")admin();
  else home();
 }catch(e){$("app").innerHTML='<div class="card">'+esc(e.message)+'</div>'}
}

function home(){
 $("app").innerHTML=`
 <div class="card">
  <h1>✕ XENOR</h1>
  <p class="muted">منصة اجتماعية وخدمات رقمية.</p>
  ${state.user?
   '<button class="yellow" onclick="go(\\'feed\\')">دخول المنصة</button>':
   '<button class="yellow" onclick="go(\\'login\\')">دخول / إنشاء حساب</button>'}
 </div>
 <div class="grid">
  <div class="stat"><b>Social</b>تواصل</div>
  <div class="stat"><b>Market</b>السوق</div>
  <div class="stat"><b>Academy</b>التعليم</div>
  <div class="stat"><b>Services</b>الخدمات</div>
 </div>`;
}

function login(){
 $("app").innerHTML=`
 <div class="card">
 <h2>دخول XENOR</h2>
 <input id="email" type="email" placeholder="البريد الإلكتروني">
 <input id="name" placeholder="الاسم عند التسجيل">
 <input id="pass" type="password" placeholder="كلمة المرور">
 <button class="yellow" onclick="signin()">دخول</button>
 <button class="alt" style="margin-right:5px" onclick="register()">إنشاء حساب</button>
 <p id="msg" class="muted"></p>
 </div>`;
}

async function signin(){
 try{
  let d=await api("/api/login",{method:"POST",body:JSON.stringify({
   email:$("email").value,password:$("pass").value
  })});
  state.user=d.user;nav();go("home");
 }catch(e){$("msg").textContent=e.message}
}

async function register(){
 try{
  let d=await api("/api/register",{method:"POST",body:JSON.stringify({
   email:$("email").value,name:$("name").value,password:$("pass").value
  })});
  state.user=d.user;nav();go("home");
 }catch(e){$("msg").textContent=e.message}
}

async function feed(){
 if(!state.user){go("login");return}
 let d=await api("/api/posts");
 $("app").innerHTML=`
 <div class="card">
 <h2>المنشورات</h2>
 <textarea id="postText" placeholder="ماذا تريد أن تنشر؟"></textarea>
 <button class="yellow" onclick="addPost()">نشر</button>
 </div>
 <div class="card">${d.posts.map(p=>`
 <div class="item">
 <b>${esc(p.name)}</b>
 <div>${esc(p.content)}</div>
 <small class="muted">${esc(p.created_at)}</small>
 <br><button class="alt" onclick="likePost('${p.id}')">♥ ${p.likes||0}</button>
 </div>`).join("")||"<p>لا توجد منشورات بعد.</p>"}</div>`;
}

async function addPost(){
 await api("/api/posts",{method:"POST",body:JSON.stringify({content:$("postText").value})});
 render();
}
async function likePost(id){
 await api("/api/posts/"+id+"/like",{method:"POST"});
 render();
}

async function friends(){
 if(!state.user){go("login");return}
 let d=await api("/api/friends");
 $("app").innerHTML=`
 <div class="card"><h2>الأصدقاء</h2>
 <input id="friendEmail" placeholder="بريد المستخدم">
 <button class="yellow" onclick="sendFriend()">إرسال طلب</button>
 </div>
 <div class="card">${d.friends.map(x=>`
 <div class="item"><b>${esc(x.name)}</b><br>${esc(x.email)}<br>${esc(x.status)}</div>
 `).join("")||"لا توجد طلبات."}</div>`;
}
async function sendFriend(){
 await api("/api/friends",{method:"POST",body:JSON.stringify({email:$("friendEmail").value})});
 friends();
}

async function messages(){
 if(!state.user){go("login");return}
 let d=await api("/api/messages");
 $("app").innerHTML=`
 <div class="card"><h2>الرسائل</h2>
 <input id="to" placeholder="بريد المستقبل">
 <textarea id="message" placeholder="اكتب رسالتك"></textarea>
 <button class="yellow" onclick="sendMessage()">إرسال</button>
 </div>
 <div class="card">${d.messages.map(x=>`
 <div class="item"><b>${esc(x.sender_name)}</b> → ${esc(x.receiver_name)}
 <div>${esc(x.content)}</div></div>`).join("")||"لا توجد رسائل."}</div>`;
}
async function sendMessage(){
 await api("/api/messages",{method:"POST",body:JSON.stringify({
  email:$("to").value,