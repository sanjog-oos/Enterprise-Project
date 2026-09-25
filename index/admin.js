const API = '/api';

const token = localStorage.getItem('ca_token');
const user  = JSON.parse(localStorage.getItem('ca_user') || 'null');
if (!token || !user || user.role !== 'admin') window.location.replace('index.html');
document.getElementById('navUser').textContent = (user && user.email) || '';

function apiGet(path) {
  return fetch(API + path, { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r) {
      if (r.status === 401 || r.status === 403) { localStorage.clear(); window.location.replace('index.html'); }
      return r.json();
    });
}
function apiDelete(path) {
  return fetch(API + path, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } }).then(function(r) { return r.json(); });
}
function el(id) { return document.getElementById(id); }
function showError(msg) {
  var b = el('errorBanner'); if (!b) return;
  b.textContent = msg; b.style.display = 'block';
  setTimeout(function() { b.style.display = 'none'; }, 5000);
}
function hideLoading() {
  var o = el('loadingOverlay'); if (!o) return;
  o.style.opacity = '0'; setTimeout(function() { o.style.display = 'none'; }, 400);
}
function formatDate(iso) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'2-digit' });
}
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var allUsers = [];

/* Stats */
async function loadStats() {
  try {
    var d = await apiGet('/admin/stats');
    var safe = (d.ratings && d.ratings.Safe) || 0;
    var risky = (d.ratings && d.ratings.Risky) || 0;
    var danger = (d.ratings && d.ratings.Dangerous) || 0;
    if (el('statUsers'))    el('statUsers').textContent    = d.totalUsers    != null ? d.totalUsers    : '—';
    if (el('statAttempts')) el('statAttempts').textContent = d.totalAttempts != null ? d.totalAttempts : '—';
    if (el('statAvg'))      el('statAvg').textContent      = d.avgScore      != null ? d.avgScore      : '—';
    if (el('statSafe'))     el('statSafe').textContent     = safe;
    renderRatingBar(safe, risky, danger);
    renderMiniChart(safe, risky, danger);
  } catch(e) { showError('Failed to load stats.'); }
}

function renderRatingBar(safe, risky, danger) {
  var bar = el('ratingBar'); if (!bar) return;
  var total = safe + risky + danger || 1;
  bar.innerHTML =
    '<div style="height:8px;border-radius:4px;overflow:hidden;display:flex;background:#1D2731;margin-top:8px;">' +
      '<div style="width:' + Math.round(safe/total*100) + '%;background:#4A9B7F;" title="Safe"></div>' +
      '<div style="width:' + Math.round(risky/total*100) + '%;background:#E8A33D;" title="Risky"></div>' +
      '<div style="width:' + Math.round(danger/total*100) + '%;background:#C4432B;" title="Dangerous"></div>' +
    '</div>' +
    '<div style="display:flex;gap:12px;margin-top:6px;font-size:10px;font-family:IBM Plex Mono,monospace;color:#7C8794;">' +
      '<span style="color:#4A9B7F;">Safe: ' + safe + '</span>' +
      '<span style="color:#E8A33D;">Risky: ' + risky + '</span>' +
      '<span style="color:#C4432B;">Dangerous: ' + danger + '</span>' +
    '</div>';
}

function renderMiniChart(safe, risky, danger) {
  var canvas = el('ratingChart'); if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  var data = [safe, risky, danger];
  var colors = ['#4A9B7F','#E8A33D','#C4432B'];
  var labels = ['Safe','Risky','Dangerous'];
  var max = Math.max(safe, risky, danger, 1);
  var barW = 38, gap = 16, startX = 18;
  for (var i = 0; i < 3; i++) {
    var bh = Math.round((data[i] / max) * (H - 44));
    var x = startX + i * (barW + gap);
    var y = H - 28 - bh;
    ctx.fillStyle = colors[i] + '44';
    ctx.fillRect(x, H - 28, barW, -1);
    ctx.fillStyle = colors[i];
    ctx.fillRect(x, y, barW, bh || 2);
    ctx.fillStyle = '#E4E7EB'; ctx.font = '10px IBM Plex Mono'; ctx.textAlign = 'center';
    ctx.fillText(data[i], x + barW/2, Math.max(y - 4, 12));
    ctx.fillStyle = '#7C8794'; ctx.font = '9px IBM Plex Mono';
    ctx.fillText(labels[i], x + barW/2, H - 8);
  }
}

/* Users */
async function loadUsers() {
  try { allUsers = await apiGet('/admin/users'); renderTable(allUsers); }
  catch(e) { showError('Failed to load users.'); }
}

function filterUsers(q) {
  if (!q || !q.trim()) return allUsers;
  var s = q.toLowerCase();
  return allUsers.filter(function(u) { return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s); });
}

function renderTable(users) {
  var tbody = el('userTableBody'); if (!tbody) return;
  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#7C8794;padding:24px;">No players yet.</td></tr>';
    return;
  }
  var rClasses = { Safe:'rating-safe', Risky:'rating-risky', Dangerous:'rating-danger' };
  tbody.innerHTML = users.map(function(u) {
    var rc = rClasses[u.latestRating] || '';
    return '<tr>' +
      '<td class="td-name" style="cursor:pointer;color:#5B8DEF;" onclick="openPlayerModal(\'' + u._id + '\')">' + escHtml(u.name) + '</td>' +
      '<td style="color:#7C8794;">' + escHtml(u.email) + '</td>' +
      '<td class="td-mono">' + (u.attemptCount || 0) + '</td>' +
      '<td class="td-mono">' + (u.latestScore != null ? u.latestScore : '—') + '</td>' +
      '<td class="td-mono">' + (u.bestScore   != null ? u.bestScore   : '—') + '</td>' +
      '<td><span class="rating-pill ' + rc + '">' + (u.latestRating || '—') + '</span></td>' +
      '<td class="td-mono">' + formatDate(u.createdAt) + '</td>' +
      '<td><button class="del-btn" data-id="' + u._id + '" data-name="' + escHtml(u.name) + '">Delete</button></td>' +
    '</tr>';
  }).join('');
  tbody.querySelectorAll('.del-btn').forEach(function(b) {
    b.addEventListener('click', function() { deleteUser(b.dataset.id, b.dataset.name); });
  });
}

async function deleteUser(id, name) {
  if (!confirm('Delete "' + name + '" and all their attempts? This cannot be undone.')) return;
  try {
    var res = await apiDelete('/admin/users/' + id);
    if (res.message) {
      allUsers = allUsers.filter(function(u) { return u._id !== id; });
      var q = el('searchInput');
      renderTable(filterUsers(q ? q.value : ''));
      loadStats();
    }
  } catch(e) { showError('Failed to delete user.'); }
}

function openPlayerModal(id) {
  var player = null;
  for (var i = 0; i < allUsers.length; i++) { if (allUsers[i]._id === id) { player = allUsers[i]; break; } }
  if (!player) return;
  var modal = el('playerModal'); if (!modal) return;
  if (el('modalName'))   el('modalName').textContent   = player.name;
  if (el('modalEmail'))  el('modalEmail').textContent  = player.email;
  if (el('modalGames'))  el('modalGames').textContent  = player.attemptCount || 0;
  if (el('modalBest'))   el('modalBest').textContent   = player.bestScore != null ? player.bestScore : '—';
  if (el('modalJoined')) el('modalJoined').textContent = formatDate(player.createdAt);
  modal.style.display = 'flex';
}
if (el('modalClose')) el('modalClose').addEventListener('click', function() {
  if (el('playerModal')) el('playerModal').style.display = 'none';
});
if (el('playerModal')) el('playerModal').addEventListener('click', function(e) {
  if (e.target === el('playerModal')) el('playerModal').style.display = 'none';
});

if (el('searchInput')) el('searchInput').addEventListener('input', function(e) {
  renderTable(filterUsers(e.target.value));
});

if (el('exportCsvBtn')) el('exportCsvBtn').addEventListener('click', function() {
  var rows = [['Name','Email','Attempts','Latest Score','Best Score','Rating','Joined']];
  allUsers.forEach(function(u) {
    rows.push([u.name, u.email, u.attemptCount||0, u.latestScore!=null?u.latestScore:'', u.bestScore!=null?u.bestScore:'', u.latestRating||'', formatDate(u.createdAt)]);
  });
  var csv = rows.map(function(r) { return r.map(function(v) { return '"' + String(v).replace(/"/g,'""') + '"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'players_' + new Date().toISOString().slice(0,10) + '.csv'; a.click();
});

/* Refresh */
if (el('refreshBtn')) el('refreshBtn').addEventListener('click', function() { loadStats(); loadUsers(); });

/* Auto-refresh every 30s */
setInterval(function() { loadStats(); loadUsers(); }, 30000);

/* Logout */
if (el('logoutBtn')) el('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('ca_token'); localStorage.removeItem('ca_user');
  window.location.replace('index.html');
});

/* Boot */
Promise.all([loadStats(), loadUsers()]).then(hideLoading).catch(function(e) { console.error(e); hideLoading(); });