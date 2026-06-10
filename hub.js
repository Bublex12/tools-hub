const toolsGrid = document.getElementById("tools-grid");
const catalogStatus = document.getElementById("catalog-status");

function iconSrc(tool) {
  if (tool.id) {
    return `icons/${tool.id}.svg`;
  }
  return null;
}

function createToolCard(tool) {
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
      ${iconHtml}
    </div>
    <h3 class="tool-card__title">${tool.name}</h3>
    <p class="body secondary tool-card__desc">${tool.description}</p>
    <div class="tool-card__tags">${tags}</div>
    <a class="button-primary tool-card__cta" href="${tool.url}" target="_blank" rel="noopener noreferrer">Открыть</a>
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

    if (data.hubName) {
      document.title = data.hubName;
    }

    toolsGrid.innerHTML = "";
    tools.forEach((tool) => toolsGrid.appendChild(createToolCard(tool)));
    catalogStatus.hidden = true;

    if (!tools.length) {
      catalogStatus.textContent = "Пока нет инструментов.";
      catalogStatus.hidden = false;
    }
  } catch {
    catalogStatus.textContent = "Не удалось загрузить каталог.";
    catalogStatus.hidden = false;
  }
}

loadCatalog();
