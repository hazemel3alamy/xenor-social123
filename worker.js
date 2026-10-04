if(p==='/api/users'){
  const u=await need(req,env);
  const term='%'+String(new URL(req.url).searchParams.get('q')||'')+'%';
  const r=await q(env,
    'SELECT id,name,email,avatar,online FROM users WHERE id<>? AND (name LIKE ? OR email LIKE ?) AND id NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id=?) LIMIT 30',
    u.id,term,term,u.id
  );
  return out({users:r.results});
}