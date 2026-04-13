# Code Style Rules — Accent Landing

- Весь код — статичный HTML/CSS/JS в ОДНОМ файле (стили в style, скрипты в script)
- Inter подключать через Google Fonts: wght@300..700
- IBM Plex Mono подключать отдельным запросом (для артикулов, таблиц, кодов)
- ВСЕГДА использовать CSS-переменные из design-tokens skill — никаких hardcoded hex
- Изображения: loading=lazy decoding=async alt обязателен width и height заданы
- Только семантический HTML: header nav main section footer article
- Одна единственная h1 на странице
- Все JS-анимации через IntersectionObserver — никакого setInterval для анимаций
- НЕ использовать localStorage и sessionStorage (iframe блокирует хранилище)
- Внешние ссылки: target=_blank rel=noopener noreferrer
- Форма BOM использует EmailJS (CDN) или Formspree — без серверного кода
- Загрузка файла BOM: .xls .xlsx .csv .pdf, максимум 10MB
- Комментарии в коде — только по делу, на русском языке
