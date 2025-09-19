# AI 3D Emoji Animator — Railway деплой

Этот репозиторий содержит минимальный Node.js-сервер для деплоя на Railway.
Он раздаёт `public/index.html` и имеет два API-эндоинта:

- `GET /api/key` — возвращает ключ из переменной окружения `GOOGLE_API_KEY` (виден в браузере).
- `POST /api/generate` — **более безопасный** прокси, который сам ходит в Google API и не раскрывает ключ.

> В текущем `index.html` используется именно `/api/key` (как в вашей версии). Если захотите повысить безопасность, можно поменять фронтенд на запрос к `/api/generate` с JSON: `{ "prompt": "<ваш промпт>" }`.

## Локальный запуск

```bash
cp .env.example .env
# отредактируйте .env и вставьте свой GOOGLE_API_KEY
npm install
npm start
# откройте http://localhost:3000
```

## Деплой на Railway (через GitHub)

1. **Создайте репозиторий на GitHub.**
   - Загрузите файлы из этого архива.
2. **На Railway** зайдите в панель → **New Project** → **Deploy from GitHub Repo** → выберите репозиторий.
3. После первого билда зайдите в **Settings → Variables** и добавьте переменную окружения:
   - `GOOGLE_API_KEY` = ваш ключ от Google (Imagen/Gemini).
4. Убедитесь, что команда запуска — `npm start` (она в `package.json`).
5. Откройте развернутый домен Railway. Приложение будет доступно по `https://<ваш-сабдомен>.up.railway.app`.

Готово!
