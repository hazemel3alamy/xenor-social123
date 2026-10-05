const APP = "XENOR";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users(
 id TEXT PRIMARY KEY,
 email TEXT UNIQUE NOT NULL,
 name TEXT NOT NULL,
 password_hash TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'user',
 created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions(
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts(
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 content TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS likes(
 user_id TEXT NOT NULL,
 post_id TEXT NOT NULL,
 PRIMARY KEY(user_id,post_id)
);

CREATE TABLE IF NOT EXISTS products(
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 name TEXT NOT NULL,
 description TEXT DEFAULT '',
 price TEXT DEFAULT '',
 image TEXT DEFAULT '',
 created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages(
 id TEXT PRIMARY KEY,
 sender_id TEXT NOT NULL,
 receiver_id TEXT NOT NULL,
 content TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS friendships(
 user_id TEXT NOT NULL,
 friend_id TEXT NOT NULL,
 status TEXT NOT NULL,
 created_at TEXT NOT NULL,
 PRIMARY KEY(user_id,friend_id)
);

CREATE TABLE IF NOT EXISTS stories(
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 content TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reels(
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 content TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services(
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 description TEXT DEFAULT '',
 price TEXT DEFAULT '',
 created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS academy(
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 description TEXT DEFAULT '',
 url TEXT DEFAULT '',
 created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications(
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 text TEXT NOT NULL,
 created_at TEXT NOT NULL
);
`;

const HTML = `<!doctype html>
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
body{
 margin:0;
 background:#080808;
 color:#fff;
 font-family:Arial,Tahoma,sans-serif
}
button,input,textarea{font:inherit}
button{cursor:pointer}
.top{
 position:sticky;
 top:0;
 z-index:100;
 background:#080808;
 border-bottom:1px solid #292929;
 padding:11px;
 display:flex;
 align-items:center;
 gap:8px
}
.brand{
 color:#f5c400;
 font-size:21px;
 flex:1
}
.alt,.yellow{
 border:0;
 border-radius:10px;
 background:#f5c400;
 color:#000;
 padding:9px 13px;
 font-weight:bold
}
.red{
 border:0;
 border-radius:10px;
 background:#c62828;
 color:#fff;
 padding:9px 13px
}
.wrap{
 max-width:720px;
 margin:auto;
 padding:14px 12px 90px
}
.card{
 background:#111;
 border:1px solid #292929;
 border-radius:16px;
 padding:15px;
 margin:10px 0
}
input,textarea{
 width:100%;
 background:#171717;
 color:#fff;
 border:1px solid #333;
 border-radius:10px;
 padding:12px;
 margin:5px 0
}
textarea{
 min-height:100px;
 resize:vertical
}
h1,h2,h3{margin-top:5px}
.muted{color:#aaa}
.nav{
 position:fixed;
 bottom:0;
 left:0;
 right:0;
 z-index:200;
 background:#0d0d0d;
 border-top:1px solid #292929;
 display:flex;
 overflow-x:auto
}
.nav button{
 min-width:78px;
 background:transparent;
 border:0;
 color:#ddd;
 padding:10px 6px;
 font-size:12px
}
.nav button:hover{color:#f5c400}
.item{
 border-top:1px solid #292929;
 padding:12px 0
}
.grid{
 display:grid;
 grid-template-columns:1fr 1fr;
 gap:8px
}
.stat{
 background:#191919;
 border-radius:12px;
 padding:15px;
 text-align:center
}
.stat b{
 display:block;
 color:#f5c400;
 font-size:22px;
 margin-bottom:5px
}
.badge{
 display:inline-block;
 background:#f5c400;
 color:#000;
 border-radius:20px;
 padding:4px 9px;
 font-size:12px
}
.empty{
 color:#aaa;
 text-align:center;
 padding:20px
}
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

let state={
 user:null
};

async function api(url,opt={}){

 const options={
  credentials:"include",
  ...opt,
  headers:{
   "content-type":"application/json",
   ...(opt.headers||{})
  }
 };

 const r=await fetch(url,options);

 let d={};

 try{
  d=await r.json();
 }catch(e){}

 if(!r.ok){
  throw new Error(d.error||"حدث خطأ في الاتصال");
 }

 return d;
}

function esc(x){
 return String(x??"").replace(/[&<>"']/g,m=>({
  "&":"&amp;",
  "<":"&lt;",
  ">":"&gt;",
  '"':"&quot;",
  "'":"&#39;"
 }[m]));
}

function go(x){
 location.hash=x;
}

function goBack(){
 if(history.length>1){
  history.back();
 }else{
  go("home");
 }
}

function nav(){

 let n=[
  ["home","الرئيسية"],
  ["feed","المنشورات"],
  ["friends","الأصدقاء"],
  ["messages","الرسائل"],
  ["stories","Stories"],
  ["reels","Reels"],
  ["market","السوق"],
  ["academy","الأكاديمية"],
  ["services","الخدمات"],
  ["profile","حسابي"],
  ["notifications","الإشعارات"]
 ];

 if(state.user && state.user.role==="admin"){
  n.push(["admin","الإدارة"]);
 }

 $("nav").innerHTML=n.map(x=>
  '<button onclick="go(\\''+x[0]+'\\')">'+x[1]+'</button>'
 ).join("");

 $("me").textContent=state.user ? state.user.name : "";
}

async function boot(){

 try{
  const d=await api("/api/me");
  state.user=d.user||null;
 }catch(e){
  state.user=null;
 }

 nav();
 render();
}

window.addEventListener("hashchange",render);

async function render(){

 nav();

 const p=location.hash.replace("#","")||"home";

 try{

  if(p==="home")return home();
  if(p==="login")return login();
  if(p==="feed")return feed();
  if(p==="friends")return friends();
  if(p==="messages")return messages();
  if(p==="stories")return stories();
  if(p==="reels")return reels();
  if(p==="market")return market();
  if(p==="academy")return academy();
  if(p==="services")return services();
  if(p==="profile")return profile();
  if(p==="notifications")return notifications();
  if(p==="admin")return admin();

  home();

 }catch(e){

  $("app").innerHTML=
   '<div class="card"><h3>حدث خطأ</h3><p>'+esc(e.message)+'</p></div>';
 }
}

function home(){

 $("app").innerHTML=`
 <div class="card">
  <h1>✕ XENOR</h1>
  <p class="muted">
   منصة XENOR الاجتماعية والخدمات الرقمية.
  </p>

  ${
   state.user
   ?
   '<button class="yellow" onclick="go(\\'feed\\')">دخول المنصة</button>'
   :
   '<button class="yellow" onclick="go(\\'login\\')">دخول / إنشاء حساب</button>'
  }
 </div>

 <div class="grid">

  <div class="stat">
   <b>Social</b>
   تواصل
  </div>

  <div class="stat">
   <b>Market</b>
   السوق
  </div>

  <div class="stat">
   <b>Academy</b>
   الأكاديمية
  </div>

  <div class="stat">
   <b>Services</b>
   الخدمات
  </div>

 </div>
 `;
}

function login(){

 $("app").innerHTML=`
 <div class="card">

  <h2>دخول XENOR</h2>

  <input id="email"
   type="email"
   placeholder="البريد الإلكتروني">

  <input id="name"
   placeholder="الاسم عند إنشاء الحساب">

  <input id="pass"
   type="password"
   placeholder="كلمة المرور">

  <button class="yellow" onclick="signin()">
   دخول
  </button>

  <button class="alt" onclick="register()">
   إنشاء حساب
  </button>

  <p id="msg" class="muted"></p>

 </div>
 `;
}

async function signin(){

 try{

  const d=await api("/api/login",{
   method:"POST",
   body:JSON.stringify({
    email:$("email").value.trim(),
    password:$("pass").value
   })
  });

  state.user=d.user;

  nav();
  go("home");

 }catch(e){

  $("msg").textContent=e.message;
 }
}

async function register(){

 try{

  const d=await api("/api/register",{
   method:"POST",
   body:JSON.stringify({
    email:$("email").value.trim(),
    name:$("name").value.trim(),
    password:$("pass").value
   })
  });

  state.user=d.user;

  nav();
  go("home");

 }catch(e){

  $("msg").textContent=e.message;
 }
}

async function logout(){

 try{
  await api("/api/logout",{method:"POST"});
 }catch(e){}

 state.user=null;
 nav();
 go("home");
}

async function feed(){

 if(!state.user){
  go("login");
  return;
 }

 const d=await api("/api/posts");

 $("app").innerHTML=`
 <div class="card">

  <h2>المنشورات</h2>

  <textarea id="postText"
   placeholder="ماذا تريد أن تنشر؟"></textarea>

  <button class="yellow" onclick="addPost()">
   نشر
  </button>

 </div>

 <div class="card">

 ${
  d.posts.length
  ?
  d.posts.map(p=>`
   <div class="item">

    <b>${esc(p.name)}</b>

    ${p.user_id===state.user.id?
     '<span class="badge">أنت</span>':""}

    <p>${esc(p.content)}</p>

    <small class="muted">${esc(p.created_at)}</small>

    <br><br>

    <button class="alt"
     onclick="likePost('${p.id}')">
     ♥ ${p.likes||0}
    </button>

    ${
     p.user_id===state.user.id || state.user.role==="admin"
     ?
     '<button class="red" onclick="deletePost(\\''+p.id+'\\')">حذف</button>'
     :""
    }

   </div>
  `).join("")
  :
  '<div class="empty">لا توجد منشورات حتى الآن.</div>'
 }

 </div>
 `;
}

async function addPost(){

 const content=$("postText").value.trim();

 if(!content){
  alert("اكتب المنشور أولاً");
  return;
 }

 await api("/api/posts",{
  method:"POST",
  body:JSON.stringify({content})
 });

 render();
}

async function likePost(id){

 await api("/api/posts/"+id+"/like",{
  method:"POST"
 });

 render();
}

async function deletePost(id){

 if(!confirm("حذف المنشور؟"))return;

 await api("/api/posts/"+id,{
  method:"DELETE"
 });

 render();
}

async function friends(){

 if(!state.user){
  go("login");
  return;
 }

 const d=await api("/api/friends");

 $("app").innerHTML=`
 <div class="card">

  <h2>الأصدقاء</h2>

  <input id="friendEmail"
   placeholder="بريد المستخدم">

  <button class="yellow"
   onclick="sendFriend()">
   إرسال طلب صداقة
  </button>

 </div>

 <div class="card">

 ${
  d.friends.length
  ?
  d.friends.map(x=>`
   <div class="item">
    <b>${esc(x.name)}</b>
    <br>
    ${esc(x.email)}
    <br>
    <span class="muted">${esc(x.status)}</span>
   </div>
  `).join("")
  :
  '<div class="empty">لا توجد طلبات أو أصدقاء.</div>'
 }

 </div>
 `;
}

async function sendFriend(){

 const email=$("friendEmail").value.trim();

 if(!email)return;

 await api("/api/friends",{
  method:"POST",
  body:JSON.stringify({email})
 });

 friends();
}

async function messages(){

 if(!state.user){
  go("login");
  return;
 }

 const d=await api("/api/messages");

 $("app").innerHTML=`
 <div class="card">

  <h2>الرسائل</h2>

  <input id="to"
   placeholder="بريد المستقبل">

  <textarea id="message"
   placeholder="اكتب رسالتك"></textarea>

  <button class="yellow"
   onclick="sendMessage()">
   إرسال
  </button>

 </div>

 <div class="card">

 ${
  d.messages.length
  ?
  d.messages.map(x=>`
   <div class="item">

    <b>${esc(x.sender_name)}</b>
    →
    ${esc(x.receiver_name)}

    <p>${esc(x.content)}</p>

    <small class="muted">
     ${esc(x.created_at)}
    </small>

   </div>
  `).join("")
  :
  '<div class="empty">لا توجد رسائل.</div>'
 }

 </div>
 `;
}

async function sendMessage(){

 const email=$("to").value.trim();
 const content=$("message").value.trim();

 if(!email||!content){
  alert("اكتب البريد والرسالة");
  return;
 }

 await api("/api/messages",{
  method:"POST",
  body:JSON.stringify({email,content})
 });

 messages();
}

async function stories(){

 if(!state.user){
  go("login");
  return;
 }

 const d=await api("/api/stories");

 $("app").innerHTML=`
 <div class="card">

  <h2>Stories</h2>

  <textarea id="story"
   placeholder="اكتب Story"></textarea>

  <button class="yellow"
   onclick="addStory()">
   نشر Story
  </button>

 </div>

 <div class="card">

 ${
  d.stories.length
  ?
  d.stories.map(x=>`
   <div class="item">
    <b>${esc(x.name)}</b>
    <p>${esc(x.content)}</p>
   </div>
  `).join("")
  :
  '<div class="empty">لا توجد Stories.</div>'
 }

 </div>
 `;
}

async function addStory(){

 const content=$("story").value.trim();

 if(!content)return;

 await api("/api/stories",{
  method:"POST",
  body:JSON.stringify({content})
 });

 stories();
}

async function reels(){

 if(!state.user){
  go("login");
  return;
 }

 const d=await api("/api/reels");

 $("app").innerHTML=`
 <div class="card">

  <h2>Reels</h2>

  <textarea id="reel"
   placeholder="أضف Reel أو رابط فيديو"></textarea>

  <button class="yellow"
   onclick="addReel()">
   نشر Reel
  </button>

 </div>

 <div class="card">

 ${
  d.reels.length
  ?
  d.reels.map(x=>`
   <div class="item">
    <b>${esc(x.name)}</b>
    <p>${esc(x.content)}</p>
   </div>
  `).join("")
  :
  '<div class="empty">لا توجد Reels.</div>'
 }

 </div>
 `;
}

async function addReel(){

 const content=$("reel").value.trim();

 if(!content)return;

 await api("/api/reels",{
  method:"POST",
  body:JSON.stringify({content})
 });

 reels();
}

async function market(){

 const d=await api("/api/products");

 $("app").innerHTML=`
 <div class="card">

  <h2>السوق</h2>

  ${
   state.user
   ?
   `
   <input id="productName"
    placeholder="اسم المنتج">

   <input id="productPrice"
    placeholder="السعر">

   <textarea id="productDescription"
    placeholder="الوصف"></textarea>

   <button class="yellow"
    onclick="addProduct()">
    إضافة منتج
   </button>
   `
   :
   '<p>سجل الدخول لإضافة منتج.</p>'
  }

 </div>

 <div class="card">

 ${
  d.products.length
  ?
  d.products.map(p=>`
   <div class="item">

    <h3>${esc(p.name)}</h3>

    <p>${esc(p.description)}</p>

    <b class="ok">
     ${esc(p.price||"اطلب السعر")}
    </b>

    <br>

    <small class="muted">
     بواسطة ${esc(p.owner)}
    </small>

    ${
     state.user &&
     (state.user.id===p.user_id||state.user.role==="admin")
     ?
     '<br><button class="red" onclick="deleteProduct(\\''+p.id+'\\')">حذف</button>'
     :
     ""
    }

   </div>
  `).join("")
  :
  '<div class="empty">لا توجد منتجات.</div>'
 }

 </div>
 `;
}

async function addProduct(){

 const name=$("productName").value.trim();
 const price=$("productPrice").value.trim();
 const description=$("productDescription").value.trim();

 if(!name){
  alert("اكتب اسم المنتج");
  return;
 }

 await api("/api/products",{
  method:"POST",
  body:JSON.stringify({
   name,
   price,
   description
  })
 });

 market();
}

async function deleteProduct(id){

 if(!confirm("حذف المنتج؟"))return;

 await api("/api/products/"+id,{
  method:"DELETE"
 });

 market();
}

async function academy(){

 const d=await api("/api/academy");

 $("app").innerHTML=`
 <div class="card">

  <h2>الأكاديمية</h2>

 ${
  d.items.length
  ?
  d.items.map(x=>`
   <div class="item">

    <h3>${esc(x.title)}</h3>

    <p>${esc(x.description)}</p>

    ${
     x.url
     ?
     '<a href="'+esc(x.url)+'" target="_blank">فتح المحتوى</a>'
     :
     ""
    }

   </div>
  `).join("")
  :
  '<div class="empty">الأكاديمية جاهزة لإضافة المحتوى من الإدارة.</div>'
 }

 </div>
 `;
}

async function services(){

 const d=await api("/api/services");

 $("app").innerHTML=`
 <div class="card">

  <h2>الخدمات</h2>

 ${
  d.services.length
  ?
  d.services.map(x=>`
   <div class="item">

    <h3>${esc(x.name)}</h3>

    <p>${esc(x.description)}</p>

    <b class="ok">${esc(x.price||"تواصل معنا")}</b>

   </div>
  `).join("")
  :
  '<div class="empty">لا توجد خدمات حالياً.</div>'
 }

 </div>
 `;
}

async function profile(){

 if(!state.user){
  go("login");
  return;
 }

 $("app").innerHTML=`
 <div class="card">

  <h2>حسابي</h2>

  <p>
   <b>الاسم:</b>
   ${esc(state.user.name)}
  </p>

  <p>
   <b>البريد:</b>
   ${esc(state.user.email)}
  </p>

  <p>
   <b>الصلاحية:</b>
   <span class="badge">${esc(state.user.role)}</span>
  </p>

  <button class="red" onclick="logout()">
   تسجيل الخروج
  </button>

 </div>
 `;
}

async function notifications(){

 if(!state.user){
  go("login");
  return;
 }

 const d=await api("/api/notifications");

 $("app").innerHTML=`
 <div class="card">

  <h2>الإشعارات</h2>

 ${
  d.notifications.length
  ?
  d.notifications.map(x=>`
   <div class="item">
    ${esc(x.text)}
    <br>
    <small class="muted">${esc(x.created_at)}</small>
   </div>
  `).join("")
  :
  '<div class="empty">لا توجد إشعارات.</div>'
 }

 </div>
 `;
}

async function admin(){

 if(!state.user){
  go("login");
  return;
 }

 if(state.user.role!=="admin"){
  $("app").innerHTML=`
   <div class="card">
    <h2>غير مصرح</h2>
    <p>هذه الصفحة للأدمن فقط.</p>
   </div>`;
  return;
 }

 const d=await api("/api/admin/stats");
 const users=await api("/api/admin/users");
 const posts=await api("/api/admin/posts");
 const products=await api("/api/admin/products");

 $("app").innerHTML=`

 <div class="card">

  <h2>⚙️ إدارة XENOR</h2>

  <div class="grid">

   <div class="stat">
    <b>${d.users}</b>
    المستخدمون
   </div>

   <div class="stat">
    <b>${d.posts}</b>
    المنشورات
   </div>

   <div class="stat">
    <b>${d.products}</b>
    المنتجات
   </div>

   <div class="stat">
    <b>${d.admins}</b>
    الأدمن
   </div>

  </div>

 </div>

 <div class="card">

  <h3>المستخدمون</h3>

 ${
  users.users.map(u=>`
   <div class="item">

    <b>${esc(u.name)}</b>

    <br>

    ${esc(u.email)}

    <br>

    <span class="badge">${esc(u.role)}</span>

    <br><br>

    ${
     u.id!==state.user.id
     ?
     `
     <button class="yellow"
      onclick="changeRole('${u.id}','${u.role==="admin"?"user":"admin"}')">
      ${u.role==="admin"?"جعله مستخدم":"جعله أدمن"}
     </button>

     <button class="red"
      onclick="deleteUser('${u.id}')">
      حذف
     </button>
     `
     :
     "<small>حسابك</small>"
    }

   </div>
  `).join("")
 }

 </div>

 <div class="card">

  <h3>المنشورات</h3>

 ${
  posts.posts.map(p=>`
   <div class="item">

    <b>${esc(p.name)}</b>

    <p>${esc(p.content)}</p>

    <button class="red"
     onclick="adminDeletePost('${p.id}')">
     حذف
    </button>

   </div>
  `).join("")||'<div class="empty">لا توجد منشورات.</div>'
 }

 </div>

 <div class="card">

  <h3>المنتجات</h3>

 ${
  products.products.map(p=>`
   <div class="item">

    <b>${esc(p.name)}</b>

    <p>${esc(p.price)}</p>

    <button class="red"
     onclick="adminDeleteProduct('${p.id}')">
     حذف
    </button>

   </div>
  `).join("")||'<div class="empty">لا توجد منتجات.</div>'
 }

 </div>

 `;
}

async function changeRole(id,role){

 await api("/api/admin/users/"+id,{
  method:"PATCH",
  body:JSON.stringify({role})
 });

 admin();
}

async function deleteUser(id){

 if(!confirm("حذف المستخدم نهائياً؟"))return;

 await api("/api/admin/users/"+id,{
  method:"DELETE"
 });

 admin();
}

async function adminDeletePost(id){

 if(!confirm("حذف المنشور؟"))return;

 await api("/api/admin/posts/"+id,{
  method:"DELETE"
 });

 admin();
}

async function adminDeleteProduct(id){

 if(!confirm("حذف المنتج؟"))return;

 await api("/api/admin/products/"+id,{
  method:"DELETE"
 });

 admin();
}

boot();

</script>
</body>
</html>`;

function json(data,status=200){

 return new Response(JSON.stringify(data),{
  status,
  headers:{
   "content-type":"application/json;charset=UTF-8",
   "cache-control":"no-store"
  }
 });
}

function html(data,status=200){

 return new Response(data,{
  status,
  headers:{
   "content-type":"text/html;charset=UTF-8",
   "cache-control":"no-store"
  }
 });
}

function text(data,status=200){

 return new Response(data,{
  status,
  headers:{
   "content-type":"text/plain;charset=UTF-8"
  }
 });
}

function id(){

 return crypto.randomUUID();
}

async function hashPassword(password){

 const data=new TextEncoder().encode(password);

 const hash=await crypto.subtle.digest("SHA-256",data);

 return [...new Uint8Array(hash)]
  .map(x=>x.toString(16).padStart(2,"0"))
  .join("");
}

async function init(env){

 if(!env.DB)throw new Error("D1 binding DB غير موجود");

 await env.DB.exec(SCHEMA);
}

async function one(env,sql,args=[]){

 const r=await env.DB.prepare(sql).bind(...args).first();

 return r;
}

async function all(env,sql,args=[]){

 const r=await env.DB.prepare(sql).bind(...args).all();

 return r.results||[];
}

async function currentUser(req,env){

 const cookie=req.headers.get("cookie")||"";

 const m=cookie.match(/xenor_session=([^;]+)/);

 if(!m)return null;

 const session=await one(
  env,
  `SELECT u.*
   FROM sessions s
   JOIN users u ON u.id=s.user_id
   WHERE s.id=?`,
  [m[1]]
 );

 return session||null;
}

async function requireUser(req,env){

 const user=await currentUser(req,env);

 if(!user){
  throw Object.assign(
   new Error("يجب تسجيل الدخول"),
   {status:401}
  );
 }

 return user;
}

async function requireAdmin(req,env){

 const user=await requireUser(req,env);

 if(user.role!=="admin"){
  throw Object.assign(
   new Error("غير مصرح"),
   {status:403}
  );
 }

 return user;
}

function cookie(name,value,maxAge=2592000){

 return name+"="+value+
  "; Path=/; HttpOnly; SameSite=Lax; Max-Age="+maxAge;
}

async function register(req,env){

 const body=await req.json();

 const email=String(body.email||"").trim().toLowerCase();
 const name=String(body.name||"").trim();
 const password=String(body.password||"");

 if(!email||!name||!password){
  return json({error:"كل البيانات مطلوبة"},400);
 }

 if(password.length<4){
  return json({error:"كلمة المرور قصيرة"},400);
 }

 const exists=await one(
  env,
  "SELECT id FROM users WHERE email=?",
  [email]
 );

 if(exists){
  return json({error:"البريد مستخدم بالفعل"},409);
 }

 const admin=await one(
  env,
  "SELECT id FROM users WHERE role='admin' LIMIT 1"
 );

 const userId=id();

 const role=admin?"user":"admin";

 await env.DB.prepare(
  `INSERT INTO users
   (id,email,name,password_hash,role,created_at)
   VALUES(?,?,?,?,?,?)`
 ).bind(
  userId,
  email,
  name,
  await hashPassword(password),
  role,
  new Date().toISOString()
 ).run();

 const session=id();

 await env.DB.prepare(
  "INSERT INTO sessions(id,user_id,created_at) VALUES(?,?,?)"
 ).bind(
  session,
  userId,
  new Date().toISOString()
 ).run();

 return new Response(
  JSON.stringify({
   ok:true,
   user:{
    id:userId,
    email,
    name,
    role
   }
  }),
  {
   headers:{
    "content-type":"application/json;charset=UTF-8",
    "set-cookie":cookie("xenor_session",session)
   }
  }
 );
}

async function login(req,env){

 const body=await req.json();

 const email=String(body.email||"").trim().toLowerCase();
 const password=String(body.password||"");

 const user=await one(
  env,
  "SELECT * FROM users WHERE email=?",
  [email]
 );

 if(!user){
  return json({error:"البريد أو كلمة المرور غير صحيحة"},401);
 }

 const hash=await hashPassword(password);

 if(hash!==user.password_hash){
  return json({error:"البريد أو كلمة المرور غير صحيحة"},401);
 }

 const session=id();

 await env.DB.prepare(
  "INSERT INTO sessions(id,user_id,created_at) VALUES(?,?,?)"
 ).bind(
  session,
  user.id,
  new Date().toISOString()
 ).run();

 return new Response(
  JSON.stringify({
   ok:true,
   user:{
    id:user.id,
    email:user.email,
    name:user.name,
    role:user.role
   }
  }),
  {
   headers:{
    "content-type":"application/json;charset=UTF-8",
    "set-cookie":cookie("xenor_session",session)
   }
  }
 );
}

async function logout(req,env){

 const c=req.headers.get("cookie")||"";
 const m=c.match(/xenor_session=([^;]+)/);

 if(m){

  await env.DB.prepare(
   "DELETE FROM sessions WHERE id=?"
  ).bind(m[1]).run();
 }

 return new Response(
  JSON.stringify({ok:true}),
  {
   headers:{
    "content-type":"application/json",
    "set-cookie":cookie("xenor_session","",0)
   }
  }
 );
}

async function posts(req,env,user){

 if(req.method==="GET"){

  const rows=await all(
   env,
   `SELECT
    p.*,
    u.name,
    (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.id) likes
    FROM posts p
    JOIN users u ON u.id=p.user_id
    ORDER BY p.created_at DESC
    LIMIT 100`
  );

  return json({posts:rows});
 }

 if(req.method==="POST"){

  const body=await req.json();
  const content=String(body.content||"").trim();

  if(!content)return json({error:"المنشور فارغ"},400);

  const pid=id();

  await env.DB.prepare(
   `INSERT INTO posts(id,user_id,content,created_at)
    VALUES(?,?,?,?)`
  ).bind(
   pid,
   user.id,
   content,
   new Date().toISOString()
  ).run();

  return json({ok:true,id:pid});
 }

 return json({error:"Method not allowed"},405);
}

async function likePost(req,env,user,idPost){

 const exists=await one(
  env,
  "SELECT * FROM likes WHERE user_id=? AND post_id=?",
  [user.id,idPost]
 );

 if(exists){

  await env.DB.prepare(
   "DELETE FROM likes WHERE user_id=? AND post_id=?"
  ).bind(user.id,idPost).run();

 }else{

  await env.DB.prepare(
   "INSERT INTO likes(user_id,post_id) VALUES(?,?)"
  ).bind(user.id,idPost).run();
 }

 return json({ok:true});
}

async function products(req,env,user){

 if(req.method==="GET"){

  const rows=await all(
   env,
   `SELECT
    p.*,
    u.name owner
    FROM products p
    JOIN users u ON u.id=p.user_id
    ORDER BY p.created_at DESC`
  );

  return json({products:rows});
 }

 if(req.method==="POST"){

  const b=await req.json();

  const pid=id();

  await env.DB.prepare(
   `INSERT INTO products
    (id,user_id,name,description,price,image,created_at)
    VALUES(?,?,?,?,?,?,?)`
  ).bind(
   pid,
   user.id,
   String(b.name||"").trim(),
   String(b.description||""),
   String(b.price||""),
   String(b.image||""),
   new Date().toISOString()
  ).run();

  return json({ok:true,id:pid});
 }

 return json({error:"Method not allowed"},405);
}

async function stories(req,env,user){

 if(req.method==="GET"){

  const rows=await all(
   env,
   `SELECT s.*,u.name
    FROM stories s
    JOIN users u ON u.id=s.user_id
    ORDER BY s.created_at DESC
    LIMIT 100`
  );

  return json({stories:rows});
 }

 const b=await req.json();

 await env.DB.prepare(
  `INSERT INTO stories
   (id,user_id,content,created_at)
   VALUES(?,?,?,?)`
 ).bind(
  id(),
  user.id,
  String(b.content||""),
  new Date().toISOString()
 ).run();

 return json({ok:true});
}

async function reels(req,env,user){

 if(req.method==="GET"){

  const rows=await all(
   env,
   `SELECT r.*,u.name
    FROM reels r
    JOIN users u ON u.id=r.user_id
    ORDER BY r.created_at DESC
    LIMIT 100`
  );

  return json({reels:rows});
 }

 const b=await req.json();

 await env.DB.prepare(
  `INSERT INTO reels
   (id,user_id,content,created_at)
   VALUES(?,?,?,?)`
 ).bind(
  id(),
  user.id,
  String(b.content||""),
  new Date().toISOString()
 ).run();

 return json({ok:true});
}

async function friends(req,env,user){

 if(req.method==="GET"){

  const rows=await all(
   env,
   `SELECT
    f.*,
    u.name,
    u.email
    FROM friendships f
    JOIN users u ON u.id=f.friend_id
    WHERE f.user_id=?
    ORDER BY f.created_at DESC`,
   [user.id]
  );

  return json({friends:rows});
 }

 const b=await req.json();

 const target=await one(
  env,
  "SELECT id FROM users WHERE email=?",
  [String(b.email||"").trim().toLowerCase()]
 );

 if(!target){
  return json({error:"المستخدم غير موجود"},404);
 }

 if(target.id===user.id){
  return json({error:"لا يمكنك إضافة نفسك"},400);
 }

 await env.DB.prepare(
  `INSERT OR REPLACE INTO friendships
   (user_id,friend_id,status,created_at)
   VALUES(?,?,?,?)`
 ).bind(
  user.id,
  target.id,
  "pending",
  new Date().toISOString()
 ).run();

 return json({ok:true});
}

async function messages(req,env,user){

 if(req.method==="GET"){

  const rows=await all(
   env,
   `SELECT
    m.*,
    s.name sender_name,
    r.name receiver_name
    FROM messages m
    JOIN users s ON s.id=m.sender_id
    JOIN users r ON r.id=m.receiver_id
    WHERE m.sender_id=? OR m.receiver_id=?
    ORDER BY m.created_at DESC
    LIMIT 200`,
   [user.id,user.id]
  );

  return json({messages:rows});
 }

 const b=await req.json();

 const receiver=await one(
  env,
  "SELECT id FROM users WHERE email=?",
  [String(b.email||"").trim().toLowerCase()]
 );

 if(!receiver){
  return json({error:"المستخدم غير موجود"},404);
 }

 const content=String(b.content||"").trim();

 if(!content){
  return json({error:"الرسالة فارغة"},400);
 }

 await env.DB.prepare(
  `INSERT INTO messages
   (id,sender_id,receiver_id,content,created_at)
   VALUES(?,?,?,?,?)`
 ).bind(
  id(),
  user.id,
  receiver.id,
  content,
  new Date().toISOString()
 ).run();

 return json({ok:true});
}

async function adminStats(env){

 const users=await one(
  env,"SELECT COUNT(*) n FROM users"
 );

 const admins=await one(
  env,"SELECT COUNT(*) n FROM users WHERE role='admin'"
 );

 const posts=await one(
  env,"SELECT COUNT(*) n FROM posts"
 );

 const products=await one(
  env,"SELECT COUNT(*) n FROM products"
 );

 return json({
  users:Number(users?.n||0),
  admins:Number(admins?.n||0),
  posts:Number(posts?.n||0),
  products:Number(products?.n||0)
 });
}

async function adminUsers(req,env){

 if(req.method==="GET"){

  return json({
   users:await all(
    env,
    `SELECT id,email,name,role,created_at
     FROM users
     ORDER BY created_at DESC`
   )
  });
 }

 return json({error:"Method not allowed"},405);
}

async function adminUserPatch(req,env,userId){

 const b=await req.json();

 const role=b.role==="admin"?"admin":"user";

 await env.DB.prepare(
  "UPDATE users SET role=? WHERE id=?"
 ).bind(role,userId).run();

 return json({ok:true});
}

async function adminDeleteUser(req,env,userId){

 await env.DB.prepare(
  "DELETE FROM sessions WHERE user_id=?"
 ).bind(userId).run();

 await env.DB.prepare(
  "DELETE FROM likes WHERE user_id=?"
 ).bind(userId).run();

 await env.DB.prepare(
  "DELETE FROM friendships WHERE user_id=? OR friend_id=?"
 ).bind(userId,userId).run();

 await env.DB.prepare(
  "DELETE FROM messages WHERE sender_id=? OR receiver_id=?"
 ).bind(userId,userId).run();

 await env.DB.prepare(
  "DELETE FROM posts WHERE user_id=?"
 ).bind(userId).run();

 await env.DB.prepare(
  "DELETE FROM products WHERE user_id=?"
 ).bind(userId).run();

 await env.DB.prepare(
  "DELETE FROM users WHERE id=?"
 ).bind(userId).run();

 return json({ok:true});
}

async function adminPosts(env){

 return json({
  posts:await all(
   env,
   `SELECT p.*,u.name
    FROM posts p
    JOIN users u ON u.id=p.user_id
    ORDER BY p.created_at DESC`
  )
 });
}

async function adminProducts(env){

 return json({
  products:await all(
   env,
   `SELECT p.*,u.name owner
    FROM products p
    JOIN users u ON u.id=p.user_id
    ORDER BY p.created_at DESC`
  )
 });
}

async function removePost(req,env,postId){

 await env.DB.prepare(
  "DELETE FROM likes WHERE post_id=?"
 ).bind(postId).run();

 await env.DB.prepare(
  "DELETE FROM posts WHERE id=?"
 ).bind(postId).run();

 return json({ok:true});
}

async function removeProduct(req,env,productId){

 await env.DB.prepare(
  "DELETE FROM products WHERE id=?"
 ).bind(productId).run();

 return json({ok:true});
}

async function academyApi(env){

 return json({
  items:await all(
   env,
   "SELECT * FROM academy ORDER BY created_at DESC"
  )
 });
}

async function servicesApi(env){

 return json({
  services:await all(
   env,
   "SELECT * FROM services ORDER BY created_at DESC"
  )
 });
}

async function notificationsApi(env,user){

 return json({
  notifications:await all(
   env,
   `SELECT *
    FROM notifications
    WHERE user_id=?
    ORDER BY created_at DESC
    LIMIT 100`,
   [user.id]
  )
 });
}

function manifest(){

 return json({
  name:"XENOR",
  short_name:"XENOR",
  start_url:"/",
  display:"standalone",
  background_color:"#080808",
  theme_color:"#f5c400",
  description:"XENOR Social Platform",
  icons:[
   {
    src:"/icon.svg",
    sizes:"any",
    type:"image/svg+xml",
    purpose:"any maskable"
   }
  ]
 });
}

function icon(){

 return text(
 `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
 <rect width="512" height="512" rx="100" fill="#080808"/>
 <text x="256" y="330"
  text-anchor="middle"
  font-size="270"
  font-family="Arial"
  font-weight="bold"
  fill="#f5c400">X</text>
 </svg>`,
 200
 );
}

function sw(){

 return text(`
const CACHE="xenor-v1";

self.addEventListener("install",e=>{
 self.skipWaiting();
});

self.addEventListener("activate",e=>{
 e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;

 e.respondWith(
  fetch(e.request).catch(
   ()=>caches.match(e.request)
  )
 );
});
`);
}

export default {

 async fetch(req,env){

  try{

   const url=new URL(req.url);
   const path=url.pathname;

   if(
    path.startsWith("/api/")
   ){
    await init(env);
   }

   if(path==="/manifest.json"){
    return manifest();
   }

   if(path==="/icon.svg"){
    return icon();
   }

   if(path==="/sw.js"){
    return sw();
   }

   if(path==="/health"){
    return json({
     ok:true,
     service:"XENOR",
     database:!!env.DB
    });
   }

   if(path==="/api/me"){

    const user=await currentUser(req,env);

    return json({
     user:user
      ?
      {
       id:user.id,
       email:user.email,
       name:user.name,
       role:user.role
      }
      :
      null
    });
   }

   if(path==="/api/register" && req.method==="POST"){
    return register(req,env);
   }

   if(path==="/api/login" && req.method==="POST"){
    return login(req,env);
   }

   if(path==="/api/logout"){
    return logout(req,env);
   }

   if(path==="/api/posts"){

    const user=await requireUser(req,env);

    return posts(req,env,user);
   }

   if(path.startsWith("/api/posts/") &&
      path.endsWith("/like")){

    const user=await requireUser(req,env);

    const idPost=
     path.split("/")[3];

    return likePost(
     req,env,user,idPost
    );
   }

   if(path.startsWith("/api/posts/") &&
      req.method==="DELETE"){

    const user=await requireUser(req,env);

    const postId=path.split("/")[3];

    const post=await one(
     env,
     "SELECT * FROM posts WHERE id=?",
     [postId]
    );

    if(
     !post ||
     (post.user_id!==user.id &&
      user.role!=="admin")
    ){
     return json({error:"غير مصرح"},403);
    }

    return removePost(
     req,env,postId
    );
   }

   if(path==="/api/friends"){

    const user=await requireUser(req,env);

    return friends(req,env,user);
   }

   if(path==="/api/messages"){

    const user=await requireUser(req,env);

    return messages(req,env,user);
   }

   if(path==="/api/stories"){

    const user=await requireUser(req,env);

    return stories(req,env,user);
   }

   if(path==="/api/reels"){

    const user=await requireUser(req,env);

    return reels(req,env,user);
   }

   if(path==="/api/products"){

    const user=
     req.method==="GET"
     ? await currentUser(req,env)
     : await requireUser(req,env);

    return products(req,env,user);
   }

   if(path.startsWith("/api/products/") &&
      req.method==="DELETE"){

    const user=await requireUser(req,env);

    const productId=path.split("/")[3];

    const product=await one(
     env,
     "SELECT * FROM products WHERE id=?",
     [productId]
    );

    if(
     !product ||
     (product.user_id!==user.id &&
      user.role!=="admin")
    ){
     return json({error:"غير مصرح"},403);
    }

    return removeProduct(
     req,env,productId
    );
   }

   if(path==="/api/academy"){

    return academyApi(env);
   }

   if(path==="/api/services"){

    return servicesApi(env);
   }

   if(path==="/api/notifications"){

    const user=await requireUser(req,env);

    return notificationsApi(env,user);
   }

   if(path==="/api/admin/stats"){

    await requireAdmin(req,env);

    return adminStats(env);
   }

   if(path==="/api/admin/users"){

    await requireAdmin(req,env);

    return adminUsers(req,env);
   }

   if(
    path.startsWith("/api/admin/users/") &&
    req.method==="PATCH"
   ){

    await requireAdmin(req,env);

    const userId=path.split("/")[4];

    return adminUserPatch(
     req,env,userId
    );
   }

   if(
    path.startsWith("/api/admin/users/") &&
    req.method==="DELETE"
   ){

    const admin=await requireAdmin(req,env);

    const userId=path.split("/")[4];

    if(userId===admin.id){
     return json(
      {error:"لا يمكنك حذف حسابك"},
      400
     );
    }

    return adminDeleteUser(
     req,env,userId
    );
   }

   if(path==="/api/admin/posts"){

    await requireAdmin(req,env);

    return adminPosts(env);
   }

   if(path.startsWith("/api/admin/posts/") &&
      req.method==="DELETE"){

    await requireAdmin(req,env);

    const postId=path.split("/")[4];

    return removePost(
     req,env,postId
    );
   }

   if(path==="/api/admin/products"){

    await requireAdmin(req,env);

    return adminProducts(env);
   }

   if(path.startsWith("/api/admin/products/") &&
      req.method==="DELETE"){

    await requireAdmin(req,env);

    const productId=path.split("/")[4];

    return removeProduct(
     req,env,productId
    );
   }

   if(
    path==="/" ||
    path.startsWith("/#") ||
    path==="/index.html"
   ){

    return html(HTML);
   }

   return html(HTML);

  }catch(e){

   return json(
    {
     ok:false,
     error:e.message||"Server error"
    },
    e.status||500
   );
  }
 }
};