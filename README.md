# Test Tools Hub

Каталог ваших утилит. Каждый инструмент живёт в **своём** репозитории и деплоится отдельно на Vercel. Этот репозиторий — только хаб со ссылками.

## Деплой на Vercel

1. Создайте репозиторий на GitHub, например `tools-hub`.
2. Залейте **содержимое этой папки** (не родительский `test_tools`):

   ```bash
   cd tools-hub
   git init
   git add .
   git commit -m "Initial hub"
   git remote add origin git@github.com:YOU/tools-hub.git
   git push -u origin main
   ```

3. На [vercel.com](https://vercel.com) → **Add New Project** → импорт `tools-hub`.
4. Framework Preset: **Other** (статический сайт, сборка не нужна).
5. Root Directory: `.` (корень репозитория).
6. Deploy.

После деплоя скопируйте URL (например `https://tools-hub.vercel.app`) и пропишите его в инструментах в `config.js` → `hubUrl`.

## Добавить инструмент в каталог

Отредактируйте `tools.json`:

```json
{
  "id": "my-tool",
  "name": "Название",
  "description": "Кратко что делает",
  "tags": ["tag"],
  "status": "live",
  "repo": "tool-my-tool",
  "url": "https://tool-my-tool.vercel.app",
  "localUrl": "http://127.0.0.1:8770"
}
```

- `status`: `live` | `draft` | `soon` — для `draft`/`soon` кнопка «Открыть» не показывается.
- На localhost хаб подставляет `localUrl`, если он задан.

## Локальная разработка

```bash
python -m http.server 8765
```

Откройте http://127.0.0.1:8765

## Структура

| Файл | Назначение |
|------|------------|
| `tools.json` | Список инструментов и URL |
| `hub.js` | Рендер карточек |
| `index.html` | Страница каталога |
| `vercel.json` | Настройки Vercel |

Подробнее: [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
