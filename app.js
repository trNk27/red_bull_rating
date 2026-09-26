(() => {
  const STORE_KEY = "rb-ranker-v1";
  const $ = (s, el = document) => el.querySelector(s);
  const byId = Object.fromEntries(EDITIONS.map((e) => [e.id, e]));
  const GROUPS = ["All", ...new Set(EDITIONS.map((e) => e.group))];

  // ---------- state ----------
  // entries: [{ id, score|null, note, added, img?, custom?: {name, flavor, color} }]
  let state = load();
  let sortBy = "score";
  let activeGroup = "All";
  let imgTarget = null;

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY));
      if (raw && Array.isArray(raw.entries)) return raw;
    } catch {}
    return { entries: [] };
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch { toast("Couldn't save — storage full? Try a smaller photo."); }
  }

  const edition = (entry) =>
    entry.custom
      ? { id: entry.id, name: entry.custom.name, flavor: entry.custom.flavor || "", color: entry.custom.color, accent: "#ffffff", emoji: "⭐", group: "Custom" }
      : byId[entry.id] || { id: entry.id, name: entry.id, flavor: "", color: "#555", accent: "#aaa", emoji: "?" };

  // ---------- drawing ----------
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v + amt * 255))));
    return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  let uid = 0;
  function canSVG(ed) {
    const id = "c" + ++uid;
    const ink = ed.dark ? "#1b2340" : "#ffffff";
    const label = (ed.flavor || ed.name).replace(/\s*\(.*\)/, "");
    const words = label.split(/\s+/);
    const lines = [];
    for (const w of words) {
      if (lines.length && (lines[lines.length - 1] + " " + w).length <= 10) lines[lines.length - 1] += " " + w;
      else lines.push(w);
    }
    const text = lines.slice(0, 3).map((l, i) =>
      `<text x="30" y="${80 + i * 7}" text-anchor="middle" font-family="Roboto, Arial, sans-serif" font-weight="700" font-size="6" fill="${ink}">${esc(l.toUpperCase())}</text>`
    ).join("");
    return `<svg viewBox="0 0 60 112" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(ed.name)}">
      <defs>
        <linearGradient id="${id}b" x1="0" x2="1">
          <stop offset="0" stop-color="${shade(ed.color, -0.22)}"/>
          <stop offset=".35" stop-color="${shade(ed.color, 0.12)}"/>
          <stop offset=".6" stop-color="${ed.color}"/>
          <stop offset="1" stop-color="${shade(ed.color, -0.28)}"/>
        </linearGradient>
        <linearGradient id="${id}s" x1="0" x2="1">
          <stop offset="0" stop-color="#8b95a5"/><stop offset=".4" stop-color="#eef1f5"/><stop offset="1" stop-color="#7c8595"/>
        </linearGradient>
        <clipPath id="${id}c"><rect x="7" y="12" width="46" height="90" rx="3"/></clipPath>
      </defs>
      <path d="M11 4 h38 l4 8 h-46z" fill="url(#${id}s)"/>
      <ellipse cx="30" cy="4.5" rx="19" ry="2.5" fill="#dfe4ea" stroke="#9aa3b1" stroke-width=".6"/>
      <rect x="7" y="12" width="46" height="90" rx="3" fill="url(#${id}b)"/>
      <g clip-path="url(#${id}c)">
        <path d="M0 30 Q30 20 60 30 L60 44 Q30 34 0 44z" fill="${ed.accent}" opacity=".9"/>
        <rect x="7" y="12" width="46" height="90" fill="url(#${id}b)" opacity=".15"/>
        <rect x="16" y="12" width="5" height="90" fill="#fff" opacity=".18"/>
      </g>
      <text x="30" y="24" text-anchor="middle" font-family="Roboto, Arial, sans-serif" font-weight="700" font-size="6.2" fill="${ink}" letter-spacing=".3">RED BULL</text>
      <circle cx="30" cy="57" r="11" fill="${ed.accent}" opacity=".95"/>
      <text x="30" y="61.5" text-anchor="middle" font-size="12">${ed.emoji || ""}</text>
      ${text}
      <path d="M7 100 h46 l-3 7 h-40z" fill="url(#${id}s)"/>
    </svg>`;
  }
  function canHTML(ed, customImg) {
    const src = customImg || ed.image;
    if (!src) return canSVG(ed);
    // If the photo fails to load, fall back to the drawn can.
    return `<img src="${esc(src)}" alt="${esc(ed.name)}" loading="lazy" data-fallback="${ed.id}">`;
  }
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && img.dataset.fallback) {
      const entry = state.entries.find((x) => x.id === img.dataset.fallback);
      const ed = entry ? edition(entry) : byId[img.dataset.fallback];
      if (ed) img.outerHTML = canSVG(ed);
    }
  }, true);

  const scoreColor = (s) => `hsl(${((s - 1) / 9) * 125}, 70%, 42%)`;
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------- list ----------
  function sorted() {
    const arr = [...state.entries];
    if (sortBy === "name") arr.sort((a, b) => edition(a).name.localeCompare(edition(b).name));
    else if (sortBy === "added") arr.sort((a, b) => b.added - a.added);
    else arr.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.added - b.added);
    return arr;
  }

  function render() {
    const list = $("#list");
    const entries = sorted();
    $("#empty").hidden = entries.length > 0;
    $("#exportBtn").hidden = entries.length === 0;
    $(".sort").hidden = entries.length === 0;

    let rank = 0, prev = null, seen = 0;
    list.innerHTML = entries.map((entry) => {
      const ed = edition(entry);
      seen++;
      if (entry.score != null && entry.score !== prev) { rank = seen; prev = entry.score; }
      const showRank = sortBy === "score" && entry.score != null;
      const buttons = Array.from({ length: 10 }, (_, i) => {
        const v = i + 1;
        const on = entry.score != null && v <= entry.score;
        return `<button data-act="score" data-v="${v}" class="${on ? "on" : ""} ${v === entry.score ? "cur" : ""}"
          aria-label="Score ${v}">${v}</button>`;
      }).join("");
      return `<li class="item" data-id="${esc(entry.id)}">
        <div class="rank ${showRank ? "scored" : ""}">${showRank ? rank : "–"}</div>
        <div class="can-box" data-act="img" title="Change picture">${canHTML(ed, entry.img)}</div>
        <div class="info">
          <div class="title-row">
            <div>
              <div class="name">${esc(ed.name)}${ed.isNew ? '<span class="badge">New</span>' : ""}</div>
              <div class="flavor">${esc(ed.flavor)}</div>
            </div>
            ${entry.score != null
              ? `<div class="big-score"><i style="background:${scoreColor(entry.score)}"></i>${entry.score}<small> / 10</small></div>`
              : `<div class="big-score none">Not rated</div>`}
          </div>
          <div class="scores">${buttons}</div>
          <div class="bottom-row">
            <input class="note" data-act="note" placeholder="Tasting notes…" value="${esc(entry.note || "")}" maxlength="200">
            <button class="icon-btn" data-act="remove" title="Remove" aria-label="Remove">🗑</button>
          </div>
        </div>
      </li>`;
    }).join("");

  }

  $("#list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const li = btn.closest(".item");
    const entry = state.entries.find((x) => x.id === li.dataset.id);
    const act = btn.dataset.act;
    if (act === "score") {
      const v = +btn.dataset.v;
      entry.score = entry.score === v ? null : v;
      save(); render();
      flash(entry.id);
    } else if (act === "remove") {
      const ed = edition(entry);
      state.entries = state.entries.filter((x) => x !== entry);
      save(); render();
      toast(`Removed ${ed.name}`, () => { state.entries.push(entry); save(); render(); });
    } else if (act === "img") {
      openImgDialog(entry);
    }
  });
  $("#list").addEventListener("change", (e) => {
    if (e.target.dataset.act !== "note") return;
    const entry = state.entries.find((x) => x.id === e.target.closest(".item").dataset.id);
    entry.note = e.target.value.trim();
    save();
  });

  function flash(id) {
    const el = document.querySelector(`.item[data-id="${CSS.escape(id)}"]`);
    if (!el) return;
    el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // ---------- add dialog ----------
  const addDlg = $("#addDlg");
  function openAdd() {
    $("#search").value = "";
    activeGroup = "All";
    renderChips(); renderGrid();
    addDlg.showModal();
    $("#search").focus();
  }
  function renderChips() {
    $("#chips").innerHTML = GROUPS.map((g) => `<button class="chip ${g === activeGroup ? "on" : ""}" data-g="${g}">${g}</button>`).join("");
  }
  function renderGrid() {
    const q = $("#search").value.trim().toLowerCase();
    const have = new Set(state.entries.map((e) => e.id));
    const items = EDITIONS.filter((e) =>
      (activeGroup === "All" || e.group === activeGroup) &&
      (!q || `${e.name} ${e.flavor} ${e.group}`.toLowerCase().includes(q))
    );
    $("#grid").innerHTML = items.length
      ? items.map((e) => `<button class="tile" data-id="${e.id}" ${have.has(e.id) ? "disabled" : ""}>
          ${e.isNew ? '<span class="badge">New</span>' : ""}
          ${have.has(e.id) ? '<span class="done">✓</span>' : ""}
          <div class="can-mini">${canHTML(e)}</div>
          <div class="t-name">${esc(e.name)}</div>
          <div class="t-flavor">${esc(e.flavor)}</div>
        </button>`).join("")
      : `<div class="no-results">Nothing found. Add it as a custom one below 👇</div>`;
  }
  $("#chips").addEventListener("click", (e) => {
    const g = e.target.dataset.g;
    if (!g) return;
    activeGroup = g; renderChips(); renderGrid();
  });
  $("#search").addEventListener("input", renderGrid);
  $("#search").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    // Without this, focus returns to "+ Add" on close and Enter re-opens the dialog.
    e.preventDefault();
    const first = $("#grid .tile:not([disabled])");
    if (first) first.click();
  });
  $("#grid").addEventListener("click", (e) => {
    const tile = e.target.closest(".tile");
    if (!tile || tile.disabled) return;
    addEntry({ id: tile.dataset.id });
  });
  $("#customForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const name = f.get("name").trim();
    if (!name) return;
    addEntry({ id: "custom-" + Date.now().toString(36), custom: { name, flavor: f.get("flavor").trim(), color: f.get("color") } });
    e.target.reset();
  });
  function addEntry(partial) {
    state.entries.push({ score: null, note: "", added: Date.now(), ...partial });
    save();
    addDlg.close();
    render();
    flash(partial.id);
    toast(`Added ${edition(partial).name} — now give it a score`);
  }

  // ---------- image dialog ----------
  const imgDlg = $("#imgDlg");
  function openImgDialog(entry) {
    imgTarget = entry;
    $("#imgForm").reset();
    $("#imgForm [name=url]").value = entry.img && !entry.img.startsWith("data:") ? entry.img : "";
    imgDlg.showModal();
  }
  $("#imgForm [name=file]").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file || !imgTarget) return;
    imgTarget.img = await shrink(file);
    save(); render(); imgDlg.close();
  });
  $("#imgForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const url = $("#imgForm [name=url]").value.trim();
    if (url) imgTarget.img = url; else delete imgTarget.img;
    save(); render(); imgDlg.close();
  });
  $("#imgReset").addEventListener("click", () => {
    delete imgTarget.img;
    save(); render(); imgDlg.close();
  });
  // Downscale uploads so they fit in localStorage.
  function shrink(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 320 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        resolve(c.toDataURL("image/webp", 0.85));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // ---------- misc ----------
  document.querySelectorAll("dialog").forEach((d) => {
    d.addEventListener("click", (e) => {
      if (e.target === d || e.target.closest("[data-close]")) d.close();
    });
  });
  $("#addBtn").addEventListener("click", openAdd);
  $("#emptyAdd").addEventListener("click", openAdd);
  $("#sortSel").addEventListener("change", (e) => { sortBy = e.target.value; render(); });

  $("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `red-bull-ranking-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $("#importInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data.entries)) throw new Error();
      state = data; save(); render();
      toast(`Imported ${data.entries.length} Red Bulls`);
    } catch { toast("That file doesn't look like a ranking export"); }
    e.target.value = "";
  });

  let toastTimer;
  function toast(msg, undo) {
    const t = $("#toast");
    t.innerHTML = esc(msg) + (undo ? ' &nbsp;<u style="cursor:pointer">Undo</u>' : "");
    t.style.pointerEvents = undo ? "auto" : "none";
    t.onclick = undo ? () => { undo(); t.classList.remove("show"); } : null;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), undo ? 5000 : 2600);
  }

  // Decorative cans on the empty screen
  $("#emptyCans").innerHTML = ["winter-2026-pistachio", "red-watermelon", "original", "yellow", "sea-blue"]
    .map((id, i) => `<span style="--r:${(i - 2) * 6}deg;display:contents">${canSVG(byId[id]).replace("<svg", `<svg style="--r:${(i - 2) * 6}deg"`)}</span>`)
    .join("");

  render();
})();
