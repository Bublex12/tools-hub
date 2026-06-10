const toolsGrid = document.getElementById("tools-grid");
const catalogStatus = document.getElementById("catalog-status");
const searchInput = document.getElementById("tool-search");

let allTools = [];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isSafeToolId(id) {
  return typeof id === "string" && /^[a-z0-9-]+$/.test(id);
}

function isSafeToolUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function createToolCard(tool) {
  const card = document.createElement("article");
  card.className = "tool-card card";

  const head = document.createElement("div");
  head.className = "tool-card__head";

  if (isSafeToolId(tool.id)) {
    const img = document.createElement("img");
    img.className = "tool-card__icon";
    img.src = `icons/${tool.id}.svg`;
    img.width = 28;
    img.height = 28;
    img.alt = "";
    head.appendChild(img);
  }

  card.appendChild(head);

  const title = document.createElement("h3");
  title.className = "tool-card__title";
  title.textContent = tool.name ?? "Инструмент";
  card.appendChild(title);

  const desc = document.createElement("p");
  desc.className = "body secondary tool-card__desc";
  desc.textContent = tool.description ?? "";
  card.appendChild(desc);

  const tagsWrap = document.createElement("div");
  tagsWrap.className = "tool-card__tags";
  (tool.tags ?? []).forEach((tag) => {
    const span = document.createElement("span");
    span.className = "tool-card__tag";
    span.textContent = String(tag);
    tagsWrap.appendChild(span);
  });
  card.appendChild(tagsWrap);

  if (tool.url && isSafeToolUrl(tool.url)) {
    const link = document.createElement("a");
    link.className = "button-primary tool-card__cta";
    link.href = tool.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Открыть";
    card.appendChild(link);
  }

  return card;
}

function matchesSearch(tool, query) {
  if (!query) return true;
  const haystack = [
    tool.name,
    tool.description,
    ...(tool.tags ?? []),
    tool.id,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function renderCatalog(tools) {
  toolsGrid.innerHTML = "";
  tools.forEach((tool) => toolsGrid.appendChild(createToolCard(tool)));

  if (!tools.length && allTools.length) {
    catalogStatus.textContent = "Ничего не найдено по запросу.";
    catalogStatus.hidden = false;
  } else {
    catalogStatus.hidden = true;
  }
}

function applyFilter() {
  const query = (searchInput?.value ?? "").trim().toLowerCase();
  const filtered = allTools.filter((tool) => matchesSearch(tool, query));
  renderCatalog(filtered);
}

async function loadCatalog() {
  catalogStatus.hidden = false;
  catalogStatus.textContent = "Загрузка…";

  try {
    const res = await fetch("tools.json", { cache: "no-store" });
    if (!res.ok) throw new Error("tools.json not found");

    const data = await res.json();
    allTools = (data.tools ?? []).filter(
      (tool) => tool && typeof tool === "object"
    );

    if (data.hubName) {
      document.title = String(data.hubName);
    }

    applyFilter();
  } catch {
    catalogStatus.textContent = "Не удалось загрузить каталог.";
    catalogStatus.hidden = false;
  }
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilter);
}

loadCatalog();
