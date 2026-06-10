const toolsGrid = document.getElementById("tools-grid");
const catalogStatus = document.getElementById("catalog-status");
const heroLead = document.getElementById("hero-lead");

const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

function resolveToolUrl(tool) {
  if (isLocal && tool.localUrl) {
    return tool.localUrl;
  }
  return tool.url;
}

function statusLabel(status) {
  const map = {
    live: "live",
    draft: "draft",
    soon: "soon",
  };
  return map[status] ?? status;
}

function iconSrc(tool) {
  if (tool.icon) {
    return `icons/${tool.id}.svg`;
  }
  return null;
}

function createToolCard(tool) {
  const url = resolveToolUrl(tool);
  const isDraft = tool.status !== "live";
  const card = document.createElement("article");
  card.className = "tool-card card";

  const tags = (tool.tags ?? [])
    .map((t) => `<span class="tool-card__tag">${t}</span>`)
    .join("");

  const icon = iconSrc(tool);
  const iconHtml = icon
    ? `<img class="tool-card__icon" src="${icon}" width="28" height="28" alt="" />`
    : "";

  card.innerHTML = `
    <div class="tool-card__head">
      <div class="tool-card__id">
        ${iconHtml}
        <p class="label">${tool.id}</p>
      </div>
      <span class="tool-card__status tool-card__status--${tool.status}">${statusLabel(tool.status)}</span>
    </div>
    <h3 class="tool-card__title">${tool.name}</h3>
    <p class="body secondary tool-card__desc">${tool.description}</p>
    <div class="tool-card__tags">${tags}</div>
    ${
      isDraft
        ? `<p class="body secondary tool-card__soon">Скоро</p>`
        : `<a class="button-primary tool-card__cta" href="${url}" target="_blank" rel="noopener noreferrer">Открыть</a>`
    }
  `;

  return card;
}

async function loadCatalog() {
  catalogStatus.hidden = false;

  try {
    const res = await fetch("tools.json", { cache: "no-store" });
    if (!res.ok) throw new Error("tools.json not found");

    const data = await res.json();
    const tools = data.tools ?? [];

    if (data.hubName && heroLead) {
      document.title = `${data.hubName} — каталог`;
    }

    toolsGrid.innerHTML = "";
    tools.forEach((tool) => toolsGrid.appendChild(createToolCard(tool)));
    catalogStatus.hidden = true;

    if (!tools.length) {
      catalogStatus.textContent = "Пока нет инструментов. Добавьте запись в tools.json.";
      catalogStatus.hidden = false;
    }
  } catch {
    catalogStatus.textContent =
      "Не удалось загрузить каталог. Проверьте tools.json.";
    catalogStatus.hidden = false;
  }
}

loadCatalog();
