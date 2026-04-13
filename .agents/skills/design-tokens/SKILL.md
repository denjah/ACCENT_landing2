---
name: design-tokens
description: Visual design system for Accent B2B landing page. Load this skill when writing any HTML, CSS, or component code. Contains all design tokens: colors, typography, spacing, grid, breakpoints, buttons, inputs, shadows, border-radius, interactivity rules and forbidden patterns.
agents: [main_agent, general_purpose]
---

# Accent Design System v1.0

Полная спецификация — в references/design-tokens.md
Читай ПЕРЕД написанием любого CSS или HTML-компонента.

## Характер
Строгий, инженерный, плотный B2B-портал. Минимум декора. Один акцентный цвет #C41E3A против ахроматической базы. Доверие и экспертность важнее визуальной развлекательности. Скругления малые, тени мягкие, анимации сдержанные.

## Быстрая шпаргалка

| Токен | Значение | Роль |
|---|---|---|
| --color-primary-base | #C41E3A | основной акцент |
| --color-primary-hover | #93162C | hover |
| --color-primary-active | #5C0E1C | active |
| --color-bg-canvas | #F8F9FA | фон страницы |
| --color-bg-surface | #FFFFFF | фон карточек |
| --color-bg-elevated | #F1F3F5 | elevated |
| --color-text-main | #343A40 | основной текст |
| --color-text-heading | #212529 | заголовки |
| --color-text-muted | #868E96 | вторичный текст |
| --color-text-inverse | #FFFFFF | белый текст |
| --color-border-default | #E9ECEF | разделители |
| --color-border-input | #CED4DA | граница инпута |
| --font-sans | Inter | основной шрифт |
| --font-mono | IBM Plex Mono | моно шрифт |
| --radius-sm | 4px | кнопки инпуты |
| --radius-md | 6px | карточки |
| --radius-lg | 8px | блоки |
| --shadow-sm | 0 1px 2px rgba(33,37,41,0.05) | карточки |
| --shadow-md | 0 4px 6px -1px rgba(33,37,41,0.10) | hover |

Полная спецификация -> references/design-tokens.md
