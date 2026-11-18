const $ = (id) => document.getElementById(id);
let language = "my";
const categories = [...new Set(BOOKS.map(book => book.category).filter(Boolean))];
categories.forEach(category => $("categoryFilter").add(new Option(category, category)));
$("bookCount").textContent = BOOKS.length;
$("audioCount").textContent = AUDIOS.length;
$("year").textContent = new Date().getFullYear();

function safeLink(url) {
  if (!url) return "";
  try { const parsed = new URL(url); return ["https:","http:"].includes(parsed.protocol) ? parsed.href : ""; }
  catch { return ""; }
}
function renderBooks() {
  const term = $("searchInput").value.trim().toLowerCase();
  const category = $("categoryFilter").value;
  const found = BOOKS.filter(b => `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(term) && (category === "all" || b.category === category));
  $("bookGrid").innerHTML = found.length ? found.map((b) => {
    const read = safeLink(b.readUrl), download = safeLink(b.downloadUrl);
    return `<article class="book-card"><div class="cover" aria-hidden="true">စာအုပ်</div><div class="book-content"><h3>${escapeHtml(b.title)}</h3><p>${escapeHtml(b.author)} · ${escapeHtml(b.category)}</p><p>${escapeHtml(b.description || "")}</p><div class="actions">${read ? `<a class="small-btn" href="${read}" target="_blank" rel="noopener">ဖတ်ရန်</a>` : `<span class="small-btn secondary">ဖတ်ရန်လင့်ခ်မရှိသေး</span>`}${download ? `<a class="small-btn secondary" href="${download}" target="_blank" rel="noopener">ဒေါင်းရန်</a>` : ""}</div></div></article>`;
  }).join("") : `<div class="empty">ရှာဖွေမှုနှင့် ကိုက်ညီသော စာအုပ် မတွေ့ပါ။</div>`;
}
function renderAudio() {
  $("audioList").innerHTML = AUDIOS.length ? AUDIOS.map((a,i) => {
    const url = safeLink(a.audioUrl), download = safeLink(a.downloadUrl || a.audioUrl);
    return `<div class="audio-row"><div class="audio-icon">♫</div><div class="audio-meta"><strong>${escapeHtml(a.title)}</strong><small>${escapeHtml(a.author || "")} · ${escapeHtml(a.description || "")}</small></div>${url ? `<button class="small-btn" type="button" data-play="${i}">နားထောင်ရန်</button>` : `<span class="small-btn secondary">လင့်ခ်မရှိသေး</span>`}${download ? `<a class="small-btn secondary" href="${download}" target="_blank" rel="noopener">ဒေါင်းရန်</a>` : ""}</div>`;
  }).join("") : `<div class="empty">အသံဖိုင် မရှိသေးပါ။</div>`;
}
function escapeHtml(value="") {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
$("bookGrid").addEventListener("click", () => {});
$("audioList").addEventListener("click", event => {
  const button = event.target.closest("[data-play]");
  if (!button) return;
  const item = AUDIOS[Number(button.dataset.play)];
  const url = safeLink(item.audioUrl);
  if (!url) return;
  $("audioPlayer").src = url;
  $("nowPlaying").textContent = item.title;
  $("audioPlayer").play().catch(() => alert("အသံဖွင့်ရန် Play ကို ထပ်နှိပ်ပါ။"));
});
$("searchInput").addEventListener("input", renderBooks);
$("categoryFilter").addEventListener("change", renderBooks);
$("langBtn").addEventListener("click", () => {
  language = language === "my" ? "en" : "my";
  document.querySelectorAll("[data-my][data-en]").forEach(el => el.textContent = el.dataset[language]);
  $("langBtn").textContent = language === "my" ? "English" : "မြန်မာ";
});
renderBooks();
renderAudio();