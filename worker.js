const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  }
});

const html = (body, status = 200) => new Response(body, {
  status,
  headers: {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store"
  }
});

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));

const products = [
  {
    id: 1,
    title: "تكييف Carrier 1.5 حصان",
    brand: "Carrier",
    price: "اطلب السعر",
    description: "تكييف مناسب للمساحات المتوسطة بأداء قوي."
  },
  {
    id: 2,
    title: "تكييف Midea 2.25 حصان",
    brand: "Midea",
    price: "اطلب السعر",
    description: "حل عملي للتبريد المنزلي بتصميم عصري."
  },
  {
    id: 3,
    title: "تكييف LG 2.25 حصان",
    brand: "LG",
    price: "اطلب السعر",
    description: "تكييف LG بأداء قوي ومزايا حديثة."
  }
];

const services = [
  {
    title: "تركيب التكييف",
    description: "تركيب احترافي لأجهزة التكييف."
  },
  {
    title: "صيانة",
    description: "فحص وصيانة وإصلاح أجهزة التكييف."
  },
  {
    title: "شحن فريون",
    description: "فحص الدائرة وشحن الفريون عند الحاجة."
  },
  {
    title: "تكييف مركزي و VRF",
    description: "حلول وأنظمة تكييف للمشروعات."
  }
];

function api(path) {
  if (path === "/api/health") {
    return json({
      ok: true,
      service: "XENOR",
      version: "1.0.0"
    });
  }

  if (path === "/api/public") {
    return json({
      ok: true,
      products,
      services,
      brands: ["Carrier", "Midea", "LG"]
    });
  }

  if (path === "/api/products") {
    return json({
      ok: true,
      products
    });
  }

  if (path === "/api/services") {
    return json({
      ok: true,
      services
    });
  }

  return null;
}

function renderProduct(product) {
  return (
    '<article class="card">' +
      '<div class="product-icon">✕</div>' +
      '<div>' +
        '<span class="tag">' + esc(product.brand) + '</span>' +
        '<h3>' + esc(product.title) + '</h3>' +
        '<p class="muted">' + esc(product.description) + '</p>' +
        '<strong>' + esc(product.price) + '</strong>' +
      '</div>' +
    '</article>'
  );
}

function renderService(service) {
  return (
    '<article class="card">' +
      '<div class="product-icon">✓</div>' +
      '<div>' +
        '<h3>' + esc(service.title) + '</h3>' +
        '<p class="muted">' + esc(service.description) + '</p>' +
      '</div>' +
    '</article>'
  );
}

function page() {
  const productCards = products.map(renderProduct).join("");
  const serviceCards = services.map(renderService).join("");

  const adminProducts = products.map(function (p) {
    return (
      '<div class="admin-row">' +
        '<span>' + esc(p.title) + '</span>' +
        '<span class="yellow">' + esc(p.brand) + '</span>' +
      '</div>'
    );
  }).join("");

  return '<!doctype html>' +
  '<html lang="ar" dir="rtl">' +
  '<head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
    '<meta name="theme-color" content="#f5c400">' +
    '<meta name="mobile-web-app-capable" content="yes">' +
    '<meta name="apple-mobile-web-app-capable" content="yes">' +
    '<title>XENOR</title>' +

    '<style>' +
      '*{box-sizing:border-box}' +
      'html,body{margin:0;padding:0;background:#080808;color:#fff;font-family:Arial,sans-serif}' +
      'body{min-height:100vh}' +
      'button,input{font:inherit}' +
      'button{cursor:pointer}' +

      '.top{' +
        'position:sticky;' +
        'top:0;' +
        'z-index:20;' +
        'background:#080808;' +
        'border-bottom:1px solid #292929;' +
        'padding:12px 14px;' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content:space-between' +
      '}' +

      '.logo{' +
        'font-size:24px;' +
        'font-weight:900;' +
        'color:#f5c400;' +
        'letter-spacing:1px' +
      '}' +

      '.top-actions{display:flex;gap:8px}' +

      '.icon-btn,.back{' +
        'background:#151515;' +
        'color:#fff;' +
        'border:1px solid #333;' +
        'border-radius:12px;' +
        'padding:9px 12px' +
      '}' +

      'main{' +
        'max-width:760px;' +
        'margin:auto;' +
        'padding:16px 14px 90px' +
      '}' +

      '.hero{' +
        'background:linear-gradient(145deg,#171717,#0b0b0b);' +
        'border:1px solid #292929;' +
        'border-radius:22px;' +
        'padding:24px;' +
        'margin-bottom:16px' +
      '}' +

      '.hero h1{margin:0 0 8px;font-size:34px}' +
      '.yellow{color:#f5c400}' +
      '.muted{color:#aaa;line-height:1.7}' +

      '.actions{' +
        'display:flex;' +
        'gap:9px;' +
        'flex-wrap:wrap;' +
        'margin-top:16px' +
      '}' +

      '.btn{' +
        'border:0;' +
        'border-radius:12px;' +
        'padding:12px 16px;' +
        'font-weight:800' +
      '}' +

      '.primary{background:#f5c400;color:#000}' +
      '.dark{background:#181818;color:#fff;border:1px solid #333}' +

      '.section-title{' +
        'display:flex;' +
        'justify-content:space-between;' +
        'align-items:center;' +
        'margin:20px 0 10px' +
      '}' +

      '.section-title h2{margin:0}' +
      '.grid{display:grid;gap:10px}' +

      '.card{' +
        'background:#111;' +
        'border:1px solid #292929;' +
        'border-radius:17px;' +
        'padding:15px;' +
        'display:flex;' +
        'gap:13px' +
      '}' +

      '.product-icon{' +
        'width:55px;' +
        'height:55px;' +
        'min-width:55px;' +
        'border-radius:15px;' +
        'background:#f5c400;' +
        'color:#000;' +
        'display:grid;' +
        'place-items:center;' +
        'font-size:25px;' +
        'font-weight:900' +
      '}' +

      '.tag{' +
        'display:inline-block;' +
        'background:#27220b;' +
        'color:#f5c400;' +
        'border:1px solid #5a4a00;' +
        'padding:4px 8px;' +
        'border-radius:999px;' +
        'font-size:12px' +
      '}' +

      '.card h3{margin:7px 0 5px}' +

      '.nav{' +
        'position:fixed;' +
        'bottom:0;' +
        'left:0;' +
        'right:0;' +
        'background:#0c0c0c;' +
        'border-top:1px solid #292929;' +
        'display:flex;' +
        'justify-content:space-around;' +
        'padding:8px 4px;' +
        'padding-bottom:calc(8px + env(safe-area-inset-bottom));' +
        'z-index:30' +
      '}' +

      '.nav button{' +
        'background:none;' +
        'border:0;' +
        'color:#aaa;' +
        'font-size:12px;' +
        'padding:6px' +
      '}' +

      '.nav button.active{color:#f5c400}' +
      '.view{display:none}' +
      '.view.active{display:block}' +

      '.form{display:grid;gap:10px}' +

      '.form input{' +
        'background:#111;' +
        'border:1px solid #333;' +
        'color:#fff;' +
        'border-radius:12px;' +
        'padding:13px;' +
        'outline:none' +
      '}' +

      '.form input:focus{border-color:#f5c400}' +

      '.notice{' +
        'background:#181818;' +
        'border:1px solid #333;' +
        'border-radius:14px;' +
        'padding:13px;' +
        'margin-top:12px' +
      '}' +

      '.admin-box{' +
        'border:1px solid #4e4100;' +
        'background:#161306;' +
        'border-radius:18px;' +
        'padding:16px' +
      '}' +

      '.admin-list{display:grid;gap:8px;margin-top:12px}' +

      '.admin-row{' +
        'background:#101010;' +
        'border:1px solid #292929;' +
        'border-radius:12px;' +
        'padding:12px;' +
        'display:flex;' +
        'justify-content:space-between;' +
        'gap:10px' +
      '}' +

      '.hidden{display:none!important}' +
    '</style>' +
  '</head>' +

  '<body>' +

    '<header class="top">' +
      '<button class="back" id="backBtn">‹ رجوع</button>' +
      '<div class="logo">✕ XENOR</div>' +
      '<div class="top-actions">' +
        '<button class="icon-btn" id="adminBtn">الإدارة</button>' +
      '</div>' +
    '</header>' +

    '<main>' +

      '<section id="home" class="view active">' +
        '<div class="hero">' +
          '<h1>مرحبًا بك في <span class="yellow">XENOR</span></h1>' +
          '<p class="muted">منصة اجتماعية عربية بتصميم موبايل حديث.</p>' +
          '<div class="actions">' +
            '<button class="btn primary" onclick="go(\'feed\')">ابدأ الآن</button>' +
            '<button class="btn dark" onclick="go(\'products\')">استكشف</button>' +
          '</div>' +
        '</div>' +

        '<div class="section-title">' +
          '<h2>الخدمات</h2>' +
        '</div>' +

        '<div id="serviceGrid" class="grid">' +
          serviceCards +
        '</div>' +
      '</section>' +

      '<section id="feed" class="view">' +
        '<div class="hero">' +
          '<h1>الرئيسية</h1>' +
          '<p class="muted">آخر المحتوى في XENOR.</p>' +
          '<div class="notice">🚀 نسخة Cloudflare Worker جاهزة للتشغيل.</div>' +
        '</div>' +
      '</section>' +

      '<section id="products" class="view">' +
        '<div class="section-title">' +
          '<h2>المنتجات</h2>' +
        '</div>' +
        '<div id="productGrid" class="grid">' +
          productCards +
        '</div>' +
      '</section>' +

      '<section id="messages" class="view">' +
        '<div class="hero">' +
          '<h1>الرسائل</h1>' +
          '<p class="muted">قسم الرسائل في XENOR.</p>' +
        '</div>' +
      '</section>' +

      '<section id="account" class="view">' +
        '<div class="hero">' +
          '<h1>حسابي</h1>' +
          '<div class="form">' +
            '<input id="nameInput" placeholder="الاسم">' +
            '<input id="emailInput" type="email" placeholder="البريد الإلكتروني">' +
            '<button class="btn primary" onclick="saveAccount()">حفظ</button>' +
          '</div>' +
          '<div id="accountMsg" class="notice hidden"></div>' +
        '</div>' +
      '</section>' +

      '<section id="admin" class="view">' +
        '<div class="hero">' +
          '<h1>إدارة <span class="yellow">XENOR</span></h1>' +
          '<p class="muted">لوحة الإدارة الأساسية.</p>' +

          '<div class="admin-box">' +
            '<div class="form">' +
              '<input id="adminEmail" type="email" placeholder="البريد">' +
              '<input id="adminPassword" type="password" placeholder="كلمة المرور">' +
              '<button class="btn primary" onclick="adminLogin()">دخول الإدارة</button>' +
            '</div>' +

            '<div id="adminMsg" class="notice hidden"></div>' +
          '</div>' +

          '<div id="adminPanel" class="hidden">' +

            '<div class="section-title">' +
              '<h2>الإحصائيات</h2>' +
            '</div>' +

            '<div class="admin-list">' +
              '<div class="admin-row"><span>المنتجات</span><b>' +
                products.length +
              '</b></div>' +

              '<div class="admin-row"><span>الخدمات</span><b>' +
                services.length +
              '</b></div>' +

              '<div class="admin-row"><span>العلامات التجارية</span><b>3</b></div>' +
            '</div>' +

            '<div class="section-title">' +
              '<h2>المنتجات</h2>' +
            '</div>' +

            '<div class="admin-list">' +
              adminProducts +
            '</div>' +

          '</div>' +
        '</div>' +
      '</section>' +

    '</main>' +

    '<nav class="nav">' +
      '<button data-view="home" class="active">⌂<br>الرئيسية</button>' +
      '<button data-view="feed">◉<br>المنشورات</button>' +
      '<button data-view="products">＋<br>المنتجات</button>' +
      '<button data-view="messages">☏<br>الرسائل</button>' +
      '<button data-view="account">●<br>حسابي</button>' +
    '</nav>' +

    '<script>' +

      'const historyStack = [];' +

      'function go(id,push=true){' +
        'const current=document.querySelector(".view.active");' +

        'if(current && current.id!==id && push){' +
          'historyStack.push(current.id);' +
        '}' +

        'document.querySelectorAll(".view").forEach(function(v){' +
          'v.classList.toggle("active",v.id===id);' +
        '});' +

        'document.querySelectorAll(".nav button").forEach(function(b){' +
          'b.classList.toggle("active",b.dataset.view===id);' +
        '});' +

        'window.scrollTo({top:0,behavior:"smooth"});' +
      '}' +

      'document.querySelectorAll(".nav button").forEach(function(btn){' +
        'btn.addEventListener("click",function(){' +
          'go(btn.dataset.view);' +
        '});' +
      '});' +

      'document.getElementById("backBtn").addEventListener("click",function(){' +
        'if(historyStack.length){' +
          'go(historyStack.pop(),false);' +
        '}else{' +
          'go("home",false);' +
        '}' +
      '});' +

      'document.getElementById("adminBtn").addEventListener("click",function(){' +
        'go("admin");' +
      '});' +

      'function saveAccount(){' +
        'const name=document.getElementById("nameInput").value.trim();' +
        'const email=document.getElementById("emailInput").value.trim();' +

        'localStorage.setItem("xenor_account",JSON.stringify({' +
          'name:name,' +
          'email:email' +
        '}));' +

        'const msg=document.getElementById("accountMsg");' +
        'msg.textContent="تم حفظ بيانات الحساب على هذا الجهاز."; ' +
        'msg.classList.remove("hidden");' +
      '}' +

      'function loadAccount(){' +
        'try{' +
          'const a=JSON.parse(localStorage.getItem("xenor_account")||"null");' +

          'if(a){' +
            'document.getElementById("nameInput").value=a.name||"";' +
            'document.getElementById("emailInput").value=a.email||"";' +
          '}' +
        '}catch(e){}' +
      '}' +

      'function adminLogin(){' +
        'const email=document.getElementById("adminEmail").value.trim();' +
        'const password=document.getElementById("adminPassword").value;' +
        'const msg=document.getElementById("adminMsg");' +

        'if(email==="admin@xenor.app" && password==="XENOR@2026"){' +
          'msg.textContent="تم دخول الإدارة."; ' +
          'msg.classList.remove("hidden");' +
          'document.getElementById("adminPanel").classList.remove("hidden");' +
          'localStorage.setItem("xenor_admin","1");' +
        '}else{' +
          'msg.textContent="بيانات الإدارة غير صحيحة."; ' +
          'msg.classList.remove("hidden");' +
        '}' +
      '}' +

      'function loadAdmin(){' +
        'if(localStorage.getItem("xenor_admin")==="1"){' +
          'document.getElementById("adminPanel").classList.remove("hidden");' +
        '}' +
      '}' +

      'loadAccount();' +
      'loadAdmin();' +

    '<\/script>' +

  '</body>' +
  '</html>';
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const apiResponse = api(path);

    if (apiResponse) {
      return apiResponse;
    }

    if (path === "/favicon.ico") {
      return new Response("", { status: 204 });
    }

    if (path === "/manifest.json") {
      return new Response(JSON.stringify({
        name: "XENOR",
        short_name: "XENOR",
        start_url: "/",
        display: "standalone",
        background_color: "#080808",
        theme_color: "#f5c400",
        lang: "ar",
        dir: "rtl",
        icons: []
      }), {
        headers: {
          "content-type": "application/manifest+json; charset=utf-8"
        }
      });
    }

    return html(page());
  }
};
