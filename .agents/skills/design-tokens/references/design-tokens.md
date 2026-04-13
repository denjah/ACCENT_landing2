# Дизайн-токены: Визуальная система v1.0
Характер: Технический B2B-портал — строгий, плотный, инженерный

## 1. Характер дизайна
- Строгий, инженерный, плотный. Минимум декора.
- Один акцентный цвет против ахроматической базы.
- Доверие и экспертность важнее визуальной развлекательности.
- Типографика — главный инструмент иерархии.
- Скругления малые, тени мягкие, анимации сдержанные.

## 2. Цветовые токены

Глобальная палитра:
  --brand-red-50:  #FCE8EB
  --brand-red-100: #F8C0C8
  --brand-red-300: #ED6E84
  --brand-red-500: #C41E3A   ОСНОВНОЙ АКЦЕНТ
  --brand-red-700: #93162C   hover
  --brand-red-900: #5C0E1C   active
  --gray-50:  #F8F9FA   фон страницы
  --gray-100: #F1F3F5   фон карточек
  --gray-200: #E9ECEF   разделители
  --gray-400: #CED4DA   границы инпутов, disabled
  --gray-600: #868E96   вторичный текст
  --gray-800: #343A40   основной текст
  --gray-900: #212529   заголовки H1-H3
  --white:    #FFFFFF

Семантические токены:
  --color-primary-base:   var(--brand-red-500)
  --color-primary-hover:  var(--brand-red-700)
  --color-primary-active: var(--brand-red-900)
  --color-bg-canvas:      var(--gray-50)
  --color-bg-surface:     var(--white)
  --color-bg-elevated:    var(--gray-100)
  --color-text-main:      var(--gray-800)
  --color-text-heading:   var(--gray-900)
  --color-text-muted:     var(--gray-600)
  --color-text-inverse:   var(--white)
  --color-border-default: var(--gray-200)
  --color-border-input:   var(--gray-400)
  --color-border-focus:   var(--color-primary-base)
  --color-error:   #D92D20
  --color-success: #027A48
  --color-warning: #B54708

Правила применения:
- Акцент — только CTA-кнопки, активные иконки, счётчики, ошибки
- Никаких акцентных фонов на больших площадях
- Не более одного акцентного оттенка на экране

## 3. Типографика

Шрифты:
  --font-sans: 'Inter', 'Roboto', 'Arial', sans-serif
  --font-mono: 'IBM Plex Mono', 'Courier New', monospace
  --font-mono обязателен для артикулов, кодов, технических таблиц

Шкала размеров:
  --text-h1:        clamp(32px, 4vw, 48px)    700 / line-height 1.2
  --text-h2:        clamp(24px, 3vw, 36px)    700 / line-height 1.3
  --text-h3:        clamp(20px, 2.5vw, 28px)  600 / line-height 1.3
  --text-h4:        clamp(18px, 2vw, 24px)    600 / line-height 1.4
  --text-body-lg:   18px   400 / line-height 1.6
  --text-body-base: 16px   400 / line-height 1.5
  --text-body-sm:   14px   400 / line-height 1.5
  --text-caption:   12px   400 / line-height 1.4
  --text-button:    16px   600 / line-height 1.0

Правила:
- Минимальный размер: 12px
- Body text: 16px
- Letter-spacing заголовков: -0.01em
- Letter-spacing меток uppercase: +0.04em
- Длина строки: max-width 70ch

## 4. Пространственная матрица (шаг 8px)

  --space-1:  4px    иконка + текст кнопки
  --space-2:  8px    тесные элементы
  --space-3:  16px   padding карточек, инпутов
  --space-4:  24px   гаттер сетки
  --space-5:  32px   padding крупных блоков
  --space-6:  48px   между подгруппами секции
  --space-8:  64px   между глобальными секциями
  --space-10: 80px   hero-отступы

## 5. Сетка и контейнеры

  --grid-max-width: 1440px
  --grid-columns:   12
  --grid-gutter:    var(--space-4)   24px
  --grid-margin:    var(--space-4)   боковые поля на мобильных

Компоновки:
- Каталог с сайдбаром: 3 кол. + 9 кол.
- Карточки: 4 кол. (3 в ряд) или 3 кол. (4 в ряд)
- Текст/статья: max-width 800px

Брейкпоинты:
  --bp-xs:  375px   мобильный min
  --bp-sm:  576px   мобильный large
  --bp-md:  768px   планшет
  --bp-lg:  1024px  десктоп min
  --bp-xl:  1280px  десктоп
  --bp-xxl: 1440px  широкий десктоп

## 6. Компонентные токены

Кнопки:
  --btn-border-radius:  4px
  --btn-padding-y:      12px
  --btn-padding-x:      24px
  --btn-font-weight:    600
  --btn-transition:     all 0.2s ease-in-out
  --btn-primary-bg:     var(--color-primary-base)
  --btn-primary-text:   var(--color-text-inverse)
  --btn-primary-hover:  var(--color-primary-hover)
  --btn-primary-active: var(--color-primary-active)
  --btn-secondary-bg:           transparent
  --btn-secondary-text:         var(--gray-800)
  --btn-secondary-border:       1px solid var(--gray-400)
  --btn-secondary-hover-text:   var(--color-primary-base)
  --btn-secondary-hover-border: var(--color-primary-base)
  --btn-focus-shadow: 0 0 0 3px rgba(196, 30, 58, 0.3)

Поля ввода:
  --input-bg:            var(--color-bg-surface)
  --input-border:        1px solid var(--color-border-input)
  --input-border-radius: 4px
  --input-padding-y:     10px
  --input-padding-x:     16px
  --input-font-size:     var(--text-body-base)
  --input-border-focus:  1px solid var(--color-border-focus)
  --input-shadow-focus:  var(--btn-focus-shadow)
  --input-border-error:  1px solid var(--color-error)
  --input-bg-error:      #FFF5F5

Тени:
  --shadow-sm: 0 1px 2px rgba(33, 37, 41, 0.05)        карточки
  --shadow-md: 0 4px 6px -1px rgba(33, 37, 41, 0.10)   hover карточек
  --shadow-lg: 0 10px 15px -3px rgba(33, 37, 41, 0.12) дропдауны
  --shadow-xl: 0 20px 25px -5px rgba(33, 37, 41, 0.15) модалки

Радиусы:
  --radius-none: 0px
  --radius-sm:   4px     кнопки инпуты теги
  --radius-md:   6px     карточки
  --radius-lg:   8px     модалки крупные блоки
  --radius-full: 9999px

## 7. Правила интерактивности
- Все переходы: transition: all 0.2s ease-in-out
- Hover карточек: box-shadow sm->md + transform translateY(-2px)
- Focus: box-shadow 0 0 0 3px rgba(196, 30, 58, 0.3)
- Disabled: opacity 0.45, cursor not-allowed, без hover
- Только функциональные анимации

## 8. Запрещённые паттерны
- Акцентный фон на больших площадях
- Градиентные кнопки
- Скругления больше 8px на кнопках и инпутах
- Тени с высокой непрозрачностью чёрного
- Более двух шрифтовых семейств
- Текст меньше 12px
- Выравнивание основного текста по центру в блоках
- Декоративные фоновые элементы (блобы, пятна, волны, орнаменты)
- Иконки в цветных кружках
- Одинаковая высота и отступы у всех секций подряд
