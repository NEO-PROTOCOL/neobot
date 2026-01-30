# NEO Markdown Standard — Guide for AI

Reference document for **any AI agent** that edits or creates Markdown in the NEO context. Following this standard ensures retro (80s/90s) visual consistency and alignment with the protocol identity.

---

## General rule: 64-character width

- **All lines** of content, borders, and titles must respect **64 characters** in width (including border characters).
- Break long paragraphs into lines of up to 64 characters.
- In boxes: content between `│` or `┃` must fit the inner width (62 characters between borders).
- **GitHub:** For the README (and any doc displayed on GitHub), wrap border/ASCII blocks in ` ```text ... ``` ` so the font is monospace and alignment is preserved in rendering.

---

## 1. Alerts and status (reports)

Use for document headers, checklists, and items with status (OK / WARN).

**Report header:**

```text
========================================================================
                        CENTERED TITLE
========================================================================
```

- Line of `=` with **64 characters** (exactly 64).
- Centered title on the next line.
- Another line of `=` closing.

**Status items:**

- **Complete:** `[####] Description ............................... OK`
- **Partial / attention:** `[#---] Description ............................... WARN`

Use dots (`.`) to align the status column on the right. Keep the line at 64 characters.

**Example:**

```text
========================================================================
              NEO PROTOCOL STACK - HYBRID ARCHITECTURE
========================================================================
[####] Version 1.0.0 .............................................. OK
[#---] Status Design Phase ........................................ WARN
========================================================================
```

---

## 2. Structured data (lists and sections)

Use boxes with simple borders and a section highlight with `▓▓▓`.

**Template:**

```text
┌────────────────────────────────────────────────────────────────┐
│ ▓▓▓ SECTION NAME                                                │
├────────────────────────────────────────────────────────────────┤
│ └─ Main item                                                    │
│    └─ Sub-item                                                  │
│    └─ Another sub-item                                          │
└────────────────────────────────────────────────────────────────┘
```

- **Borders:** `┌` `─` `┐` `│` `├` `┤` `└` `┘`.
- **Width:** 64 characters per line (2 for borders + 62 for content).
- **Section:** `▓▓▓` followed by a space and the section name.
- **Items:** `└─` for item; four spaces + `└─` for sub-item.
- Pad with spaces to reach 62 characters of content per line.

---

## 3. Architecture and layer diagrams

Use heavy borders and “dithering” to highlight architecture blocks.

**Template:**

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ LAYER NAME                                                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ┃
┃ ░ ░  Content with dotted background (dithering)         ░ ░ ┃
┃ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

- **Borders:** `┏` `┓` `┃` `┣` `┫` `┗` `┛` and `━`.
- **Dithering:** lines with `░` on the left/right borders for background effect.
- **Width:** 64 characters per line.
- Use for layers (e.g. NEO Layer, Moltbot Core, Protocol Interface).

---

## 4. Section separators (subtopics)

For subsections within the document:

```text
----------------------------------------------------------------------
1. Block name (optional)
----------------------------------------------------------------------
```

- Line of `-` with 64 characters.
- Optional title on the middle line.
- Another line of `-` closing.

---

## 5. Lists outside boxes

- Use **`-`** (dash) as the list marker, not `•` or `+`, for markdownlint compatibility (MD004).
- Add a blank line before and after the list when it improves readability (subject to lint exceptions below).

---

## 6. URLs and references

- Write URLs inside **angle brackets**: `<https://example.com>`.
- Prevents the linter from treating them as “bare URLs” (MD034).

---

## 7. Standard document signature

Every NEO document must end with this signature. Use it **exactly** as below, at the end of the body text.

```text
┌─────────────────────────────────────────────────────────────────┐
│ ▓▓▓ NΞØ MELLØ                                                   │
│     Core Architect · NΞØ Protocol                               │
│     neo@neoprotocol.space                                       │
│                                                                 │
│     "Code is law. Expand until chaos becomes protocol."         │
│                                                                 │
│     Security by design. Exploits find no refuge here.           │
└─────────────────────────────────────────────────────────────────┘
```

- **Where:** at the end of the document, after license/references if any.
- **Do not change** the text, line breaks, or quote marks.
- Box width: 65 characters (border + 63 inner + border).

---

## 8. Markdownlint in NEO documents

Documents that use this standard **throughout** (e.g. `ARCHITECTURE_NEO_PROTOCOL.md`) must include at the **top of the file**:

```html
<!-- markdownlint-disable MD003 MD007 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->
```

So the linter does not conflict with:

- Setext-style headings (`====` / `----`).
- Multiple blocks that look like “H1”.
- Lists and indentation inside ASCII boxes.
- Type names (CID, NeoSkill, etc.) and URLs in `<>`.

---

## 9. Quick reference for AI

- **Report title:** `====` + title + `====` — width 64
- **Item OK:** `[####] text ............... OK` — 64
- **Item WARN:** `[#---] text ............... WARN` — 64
- **List box:** `┌─┐│├┤└┘` + `▓▓▓` + `└─` — 64
- **Architecture box:** `┏┓┃┣┫┗┛` + `━` + `░` — 64
- **Subtitle:** `------` + title + `------` — 64
- **Lists:** marker `-` (not `•` or `+`)
- **URLs:** `<https://...>` (inside angle brackets)
- **Signature:** box `▓▓▓ NΞØ MELLØ` at the end of every document (see §7)

When creating or editing NEO Markdown: keep **64 characters**, use the symbols above, include the **standard signature** at the end, and in “full NEO” files add the markdownlint disable comment at the top.
