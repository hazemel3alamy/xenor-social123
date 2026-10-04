<header>
  <div class="top">
    <button onclick="goBack()" style="background:#f5c400;color:#000;border:0;border-radius:10px;padding:8px 12px;font-weight:bold">
      ← رجوع
    </button>
    <b>✕ XENOR</b>
    <span id="me"></span>
  </div>
</header>
{key:'platforms',label:'المنصات'}
{key:'services',label:'الخدمات'},
{key:'platforms',label:'المنصات'},
{key:'profile',label:'حسابي'},
function goBack(){
  if(history.length > 1){
    history.back();
  }else{
    go('home');
  }
}case 'services': return services();
case 'platforms': return platforms();
async function platforms(){
  app.innerHTML='<div class="card"><h2>المنصات</h2><p>جاري التحميل...</p></div>';

  try{
    const data=await api('/api/platforms');

    app.innerHTML=`
      <div class="card">
        <h2>🌐 منصات XENOR</h2>
        <p>تابع XENOR على منصات التواصل</p>

        <div id="platformList"></div>
      </div>
    `;

    const list=$('#platformList');

    if(!data.length){
      list.innerHTML='<p>لا توجد منصات مضافة.</p>';
      return;
    }

    list.innerHTML=data
      .filter(x=>x.enabled)
      .map(x=>`
        <a href="${esc(x.url)}"
           target="_blank"
           rel="noopener"
           style="
             display:block;
             background:#111;
             color:#fff;
             padding:15px;
             margin:10px 0;
             border-radius:14px;
             text-decoration:none;
             border:1px solid #292929;
           ">
          <b style="color:#f5c400">${esc(x.name)}</b>
          <div style="font-size:13px;color:#aaa;margin-top:5px">
            ${esc(x.description||'تابعنا على المنصة')}
          </div>
        </a>
      `).join('');

  }catch(e){
    app.innerHTML=`
      <div class="card">
        <h2>خطأ</h2>
        <p>${esc(e.message)}</p>
      </div>
    `;
  }
}function esc(v){
  return String(v??'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#039;");
}return Response.json({error:'Not found'}
if(path==='/api/platforms' && req.method==='GET'){
  await run(env,`
    CREATE TABLE IF NOT EXISTS platforms(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT DEFAULT '',
      enabled INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  let rows=await q(env,`
    SELECT * FROM platforms
    ORDER BY id ASC
  `);

  if(!rows.length){
    const defaults=[
      ['Facebook','https://facebook.com/','صفحة XENOR على Facebook'],
      ['Instagram','https://instagram.com/','حساب XENOR على Instagram'],
      ['TikTok','https://tiktok.com/','حساب XENOR على TikTok'],
      ['LinkedIn','https://linkedin.com/','XENOR على LinkedIn'],
      ['Pinterest','https://pinterest.com/','XENOR على Pinterest'],
      ['YouTube','https://youtube.com/','قناة XENOR على YouTube'],
      ['X','https://x.com/','XENOR على X'],
      ['WhatsApp','https://wa.me/','تواصل معنا عبر WhatsApp']
    ];

    for(const p of defaults){
      await run(env,`
        INSERT INTO platforms(name,url,description,enabled)
        VALUES(?,?,?,1)
      `,...p);
    }

    rows=await q(env,`SELECT * FROM platforms ORDER BY id ASC`);
  }

  return Response.json(rows);
}if(path==='/api/admin/platforms' && req.method==='GET'){
  const u=await need(req,env);

  if(u.role!=='admin')
    return Response.json({error:'Admin only'},{status:403});

  await run(env,`
    CREATE TABLE IF NOT EXISTS platforms(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT DEFAULT '',
      enabled INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return Response.json(
    await q(env,`SELECT * FROM platforms ORDER BY id ASC`)
  );
}if(path==='/api/admin/platforms' && req.method==='POST'){
  const u=await need(req,env);

  if(u.role!=='admin')
    return Response.json({error:'Admin only'},{status:403});

  const b=await req.json();

  if(!b.name || !b.url)
    return Response.json({error:'name and url required'},{status:400});

  await run(env,`
    INSERT INTO platforms(name,url,description,enabled)
    VALUES(?,?,?,?)
  `,
    b.name,
    b.url,
    b.description||'',
    b.enabled===false?0:1
  );

  return Response.json({ok:true});
}const pm=path.match(/^\/api\/admin\/platforms\/(\d+)$/);

if(pm && req.method==='PUT'){
  const u=await need(req,env);

  if(u.role!=='admin')
    return Response.json({error:'Admin only'},{status:403});

  const b=await req.json();

  await run(env,`
    UPDATE platforms
    SET name=?,url=?,description=?,enabled=?
    WHERE id=?
  `,
    b.name,
    b.url,
    b.description||'',
    b.enabled?1:0,
    pm[1]
  );

  return Response.json({ok:true});
}

if(pm && req.method==='DELETE'){
  const u=await need(req,env);

  if(u.role!=='admin')
    return Response.json({error:'Admin only'},{status:403});

  await run(env,`
    DELETE FROM platforms WHERE id=?
  `,pm[1]);

  return Response.json({ok:true});
}