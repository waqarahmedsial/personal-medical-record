# PERSONAL MEDICAL RECORD APP
## Software Requirements Specification

**Document Version:** 1.0  
**Prepared for:** Personal Use / MVP Release  
**Date:** April 30, 2026  
**Design System:** AVMS Design System by AA Actuaries & Consultants

**CONFIDENTIAL**

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional, non-functional, and design requirements for the Personal Medical Record App — a client-side web application that allows a single user to manage their complete health history without requiring authentication. The document serves as the primary reference for development, design validation, and acceptance testing.

### 1.2 Scope
The application covers three main functional domains:
- **Medicines** — recording doctor visits, prescribed medications with dosage/timing, and charting medication history.
- **Lab Results** — recording laboratory visits, test results over time, and charting parameter trends.
- **Catalog Management** — maintaining master lists of medicines and lab test types shared across both domains.

User authentication is explicitly out of scope for the initial release. All data is stored locally (localStorage / IndexedDB) in the browser.

### 1.3 Definitions & Abbreviations

| Term | Definition |
|---|---|
| MRA | Personal Medical Record App — the application described in this document. |
| Catalog | Shared master list of Medicine types and Lab Test types used across the app. |
| Doctor Visit | A recorded event of a consultation with a physician, including prescribed medicines. |
| Lab Visit | A recorded event of a laboratory visit, including test results. |
| Medicine Entry | A single prescribed medicine line within a Doctor Visit record. |
| Lab Result Entry | A single test result line within a Lab Visit record. |
| Timing Schedule | The dose frequency and time-of-day instructions for a medicine (e.g., twice daily, after meals). |
| ECharts | Apache ECharts — the charting library used for all data visualisations in MRA. |
| AVMS DS | AVMS Design System by AA Actuaries & Consultants — the visual design foundation. |

### 1.4 Overview
Sections 2–4 define stakeholder needs and overall constraints. Section 5 covers the detailed functional requirements per module. Section 6 defines non-functional requirements. Sections 7–8 define the design requirements drawn from the AVMS Design System and data model.

## 2. Overall Description

### 2.1 Product Perspective
MRA is a standalone, single-page web application (SPA). It runs entirely in the browser with no backend server or cloud database. All persistent state is stored using the browser's IndexedDB (preferred) or localStorage as a fallback. The application is designed to be used by one individual on their personal device.

### 2.2 User Characteristics
The single target user is a health-conscious individual who wants to maintain a personal digital health log. The user may have limited technical expertise; the UI must be intuitive and self-explanatory. No medical credentials are assumed.

### 2.3 Operating Environment

| Attribute | Requirement |
|---|---|
| Platform | Modern desktop and mobile web browsers (Chrome 100+, Firefox 100+, Safari 15+, Edge 100+). |
| Framework | React 18+ SPA (or equivalent modern component-based framework). |
| Charting | Apache ECharts 5.x — loaded via CDN or npm. |
| Storage | Browser IndexedDB (primary) with localStorage fallback. No server-side persistence. |
| Authentication | None required for this release. |
| Network | Application must function fully offline after first load. |

### 2.4 Assumptions & Dependencies
- No login or session management is implemented in v1.
- Data portability (export/import JSON) is a desirable future feature, not required in v1.
- Apache ECharts must be integrated via npm or CDN; no other charting library is approved.
- The AVMS Design System tokens, typography, and component patterns must be faithfully applied throughout the UI.

## 3. Application Layout & Navigation

### 3.1 Shell Structure
The application uses a fixed two-panel shell:
- **Left Panel (Sidebar)** — always visible on desktop; collapsible on mobile. Contains primary navigation and a persistent Catalog shortcut at the bottom.
- **Right Panel (Content Area)** — renders the active page/module.

### 3.2 Sidebar Navigation
The sidebar contains three primary navigation items and one utility item:

| Position | Nav Item | Icon (Material Icons) | Route / Action |
|---|---|---|---|
| Top | Doctor Visits | medical_services | /visits/doctor |
| Top | Lab Results | science | /visits/lab |
| Top | Overview / Dashboard | dashboard | /dashboard (optional v2) |
| Bottom (fixed) | Manage Catalog | category | /catalog (slide-in panel or page) |

The “Manage Catalog” item is pinned to the bottom of the left panel, visually separated from primary navigation by a divider. This reflects its supporting/utility role.

### 3.3 Header Bar
A persistent top header bar spans the full application width. It displays:
- Application logo / name (“Medical Record”) on the left.
- Active page title (dynamic, driven by selected nav item) in the center.
- An icon button for toggling the sidebar on mobile on the left edge.

## 4. Functional Modules

### 4.1 Doctor Visits Module
#### 4.1.1 Module Overview
The Doctor Visits module allows the user to log consultations with physicians, attach prescribed medicines to each visit, and visualise the evolution of their medication regimen over time using Apache ECharts.

#### 4.1.2 Doctor Visit List View
The default view of the module shows a chronologically sorted list of all recorded doctor visits.

**FR-DV-001 — Visit List**
- Each visit card displays: Visit Date, Doctor Name, Specialty (if entered), and a summary count of medicines prescribed.
- Cards are sorted newest-first by default.
- A search/filter bar at the top allows filtering by doctor name or date range.
- An “+ Add Visit” primary button is prominently placed at the top-right of the list.

**FR-DV-002 — Add / Edit Visit**
Clicking “+ Add Visit” opens a full-page form (or large modal/drawer) with the following fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| Visit Date | Date picker | Yes | Defaults to today. |
| Doctor | Combobox (type + select) | Yes | User may type a new name or select existing. New names are auto-saved to the Doctor list. |
| Specialty / Clinic | Text input | No | Free text (e.g., Cardiologist, General Physician). |
| Visit Notes | Textarea | No | General observations from the visit. |
| Prescribed Medicines | Repeating section | No | See FR-DV-003. |

**FR-DV-003 — Prescribed Medicine Lines**
Within a Doctor Visit form, the user can add one or more medicine prescription lines. Each line contains:

| Field | Type | Required | Notes |
|---|---|---|---|
| Medicine Name | Combobox | Yes | Type to search catalog. If name not found, user can type new name — system prompts to save to catalog. |
| Dosage / Strength | Text | Yes | e.g., “500mg”, “1 tablet”, “10ml”. |
| Route | Dropdown | No | Oral, Topical, Injection, Inhaled, Other. |
| Frequency | Dropdown | Yes | Once daily, Twice daily, Three times daily, Four times daily, Every X hours, As needed (PRN), Weekly, Custom. |
| Timing Qualifier | Multi-select chips | No | Before meal, After meal, With meal, Before sleep, Morning, Evening, Empty stomach. |
| Duration (Days) | Number input | No | e.g., 7, 14, 30. Empty means ongoing. |
| Start Date | Date picker | No | Defaults to visit date. |
| End Date | Date picker (computed) | No | Auto-computed from Start Date + Duration. Editable. |
| Status | Dropdown | Yes | Active, Discontinued, Completed, On Hold. |
| Notes | Text | No | e.g., “Take with plenty of water”. |

**FR-DV-004 — Save New Medicine to Catalog**
When the user types a medicine name not present in the catalog and proceeds to save the visit:
- System displays an inline confirmation prompt: “‘[Name]’ is not in your catalog. Save it?” with [Save to Catalog] and [Skip] options.
- Selecting “Save to Catalog” creates a new Catalog entry of type Medicine with the provided name.
- Selecting “Skip” saves the visit entry without modifying the catalog.

**FR-DV-005 — Delete / Edit Visit**
- Each visit card has an Edit (pencil) and Delete (trash) icon.
- Delete prompts a confirmation dialog before removal.
- Deleting a visit does not remove associated medicines from the catalog.

#### 4.1.3 Medicine History Chart
**FR-DV-006 — Medicine Timeline Chart (ECharts)**
Below the visit list (or on a dedicated “Medicine Overview” sub-tab), an Apache ECharts visualisation shows the user’s medicine history:
- Chart Type: Gantt-style horizontal bar chart (ECharts custom series) or a timeline scatter chart.
- X-Axis: Time (dates). Range defaults to last 6 months; adjustable via a date range picker above the chart.
- Y-Axis: Medicine names (one row per unique medicine in the selected range).
- Each bar/segment represents a prescription period (Start Date → End Date). Colour encodes Status (Active = primary gradient, Completed = success green, Discontinued = danger red, On Hold = warning amber).
- Hovering over a segment shows a tooltip: Medicine Name, Dose, Frequency, Timing, Doctor, Visit Date.
- Adding a new medicine prescription or updating status triggers a live chart refresh without full page reload.
- Removing a medicine (discontinuing or deleting the visit) removes its bar from the chart with a smooth ECharts animation.

**FR-DV-007 — Frequency/Dose Change Indicator**
If the same medicine appears multiple times with different doses or frequencies across visits, the chart must:
- Render separate adjacent segments for each prescription instance.
- Show a visual marker (vertical dashed line or dot) at transition points.
- Tooltip at transition points must display “Dose changed: 250mg → 500mg” or “Frequency changed: Once daily → Twice daily”.

### 4.2 Lab Results Module
#### 4.2.1 Module Overview
The Lab Results module allows the user to record laboratory visits, enter test results with numeric values and units, and track changes in individual test parameters over time using Apache ECharts line charts.

#### 4.2.2 Lab Visit List View
**FR-LR-001 — Lab Visit List**
- Each visit card displays: Visit Date, Lab Name, and the number of tests recorded.
- Sorted newest-first. Filterable by lab name and date range.
- An “+ Add Lab Visit” primary button at the top-right.

**FR-LR-002 — Add / Edit Lab Visit**

| Field | Type | Required | Notes |
|---|---|---|---|
| Visit Date | Date picker | Yes | Defaults to today. |
| Lab Name | Combobox | Yes | Type new or select existing. New names auto-saved to Doctor/Lab list. |
| Report Reference | Text | No | e.g., report number or barcode for traceability. |
| Test Results | Repeating section | Yes (≥1) | See FR-LR-003. |

**FR-LR-003 — Test Result Lines**

| Field | Type | Required | Notes |
|---|---|---|---|
| Test Name | Combobox | Yes | Select from catalog or type new (prompted to save to catalog). |
| Result Value | Number or Text | Yes | Numeric preferred (enables charting). Text allowed for qualitative results. |
| Unit | Text / Dropdown | No | e.g., mg/dL, mmol/L, U/L, %. Suggested from catalog entry. |
| Reference Range Low | Number | No | Lower bound of normal range. Sourced from catalog default if available. |
| Reference Range High | Number | No | Upper bound of normal range. |
| Status | Auto-computed badge | N/A | Normal (value within range), High (above max), Low (below min), N/A (no range defined). |
| Notes | Text | No | Pathologist comment or personal note. |

**FR-LR-004 — Save New Test to Catalog**
Same flow as FR-DV-004: user is prompted to confirm adding a newly typed test name to the Lab Test catalog, with an option to include default unit and reference range.

#### 4.2.3 Lab Results Chart
**FR-LR-005 — Parameter Trend Chart (ECharts)**
Each unique lab test parameter gets its own ECharts line chart viewable in a dedicated “Trends” sub-view or expandable panel:
- Chart Type: ECharts Line Chart with markArea for the reference range band.
- X-Axis: Time (visit dates for that test).
- Y-Axis: Test result value (numeric). Unit label shown on axis.
- Reference range is rendered as a shaded band (light green fill between low and high).
- Data points are rendered as coloured dots: green if within range, red if above/below.
- Tooltip on hover: Date, Value, Unit, Status, Lab Name.
- Multiple tests can be overlaid on a single chart if they share the same unit (user toggles via legend checkboxes).

**FR-LR-006 — Parameter Summary Grid**
At the top of the Lab Results module, a summary card grid shows the most recent value of each tracked test parameter:
- Each card: Test Name, Latest Value + Unit, Date, Status badge (Normal / High / Low).
- Cards with High/Low status use danger/warning background tint.

### 4.3 Catalog Management Module
#### 4.3.1 Module Overview
The Catalog is a shared master reference list of Medicine types and Lab Test types. It is accessed via the bottom-pinned “Manage Catalog” nav item in the sidebar. The module provides a simple CRUD interface for both entity types.

#### 4.3.2 Layout
The Catalog page contains two tabs at the top: “Medicines” and “Lab Tests”. Each tab shows a searchable, paginated table of entries for that type.

**FR-CAT-001 — Medicine Catalog Table**

| Column | Description |
|---|---|
| Medicine Name | Unique name; required; displayed as the primary label in all comboboxes. |
| Category | Optional grouping: Antibiotic, Analgesic, Antihypertensive, Supplement, Other. |
| Default Route | Optional: Oral, Topical, Injection, Inhaled, Other. |
| Notes | Free text — common brand names, contraindications, etc. |
| Actions | Edit (pencil icon) \\| Delete (trash icon). |

**FR-CAT-002 — Lab Test Catalog Table**

| Column | Description |
|---|---|
| Test Name | Unique name; required. |
| Panel / Category | Optional grouping: CBC, Lipid Panel, Liver Function, Kidney Function, Thyroid, Metabolic, Other. |
| Default Unit | Suggested unit auto-filled when this test is added in a lab visit. |
| Reference Low | Default lower bound of normal range. |
| Reference High | Default upper bound of normal range. |
| Notes | Free text. |
| Actions | Edit \\| Delete. |

**FR-CAT-003 — Add / Edit Catalog Entry**
- Clicking “+ Add Medicine” or “+ Add Lab Test” opens an inline form row or a modal.
- Duplicate names within the same catalog type are rejected with an inline validation message.
- Deleting a catalog entry that is referenced by existing visits shows a warning: “This item is used in X visit(s). Deleting it from the catalog will not remove it from existing records.” Deletion proceeds only after user confirmation.

**FR-CAT-004 — Bulk Import (Optional v1.1)**
Future enhancement: allow user to paste a comma-separated list of medicine or test names to bulk-populate the catalog.

## 5. Data Model

### 5.1 Entity Overview

| Entity | Key Fields | Relationships |
|---|---|---|
| MedicineCatalog | id, name, category, defaultRoute, notes | Referenced by MedicinePrescription.medicineId |
| LabTestCatalog | id, name, panel, defaultUnit, refLow, refHigh, notes | Referenced by LabResultEntry.testId |
| Doctor | id, name, specialty | Referenced by DoctorVisit.doctorId |
| Lab | id, name | Referenced by LabVisit.labId |
| DoctorVisit | id, date, doctorId, notes | Has many MedicinePrescription |
| MedicinePrescription | id, visitId, medicineId, dosage, route, frequency, timingQualifiers[], duration, startDate, endDate, status, notes | Belongs to DoctorVisit, references MedicineCatalog |
| LabVisit | id, date, labId, reportRef | Has many LabResultEntry |
| LabResultEntry | id, visitId, testId, value, unit, refLow, refHigh, status, notes | Belongs to LabVisit, references LabTestCatalog |

### 5.2 Timing & Frequency Data
The `MedicinePrescription.frequency` field stores one of the following enum values:

| Enum Value | Label | Default Doses/Day |
|---|---|---|
| ONCE_DAILY | Once daily | 1 |
| TWICE_DAILY | Twice daily (BD) | 2 |
| THREE_DAILY | Three times daily (TDS) | 3 |
| FOUR_DAILY | Four times daily (QDS) | 4 |
| EVERY_X_HOURS | Every X hours | Variable — X stored in frequencyParam field |
| AS_NEEDED | As needed (PRN) | Variable |
| WEEKLY | Weekly | — |
| CUSTOM | Custom | Stored in frequencyCustomText field |

`timingQualifiers` is a string array with zero or more of: `BEFORE_MEAL`, `AFTER_MEAL`, `WITH_MEAL`, `BEFORE_SLEEP`, `MORNING`, `EVENING`, `EMPTY_STOMACH`.

## 6. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Performance | All page transitions and chart renders must complete within 300ms on a modern mid-range device. |
| NFR-02 | Offline | The app must be fully functional without an internet connection once loaded. PWA service worker is recommended. |
| NFR-03 | Data Persistence | All data must survive browser refresh. IndexedDB is the primary storage mechanism. |
| NFR-04 | Responsiveness | UI must be fully usable on screens from 360px (mobile) to 1920px (desktop). Sidebar collapses to icon-only or bottom tab on mobile. |
| NFR-05 | Accessibility | All interactive elements must have ARIA labels. Colour is never the sole indicator of state (Status badges include text labels). Keyboard navigation must be fully supported. |
| NFR-06 | Privacy | No data is transmitted to any external server. App does not load analytics, telemetry, or tracking scripts. |
| NFR-07 | ECharts Version | Apache ECharts 5.x must be used. No fallback to other charting libraries. |
| NFR-08 | Design Fidelity | All visual components must comply with the AVMS Design System tokens (Section 8). No ad-hoc colors or fonts. |

## 7. UX & Interaction Patterns

### 7.1 Combobox (Type-ahead + Select)
Used for Doctor, Lab, Medicine, and Lab Test fields. Behaviour:
1. User types into the input field.
2. Dropdown shows matching catalog entries filtered by substring match (case-insensitive).
3. If no match exists, a “+ Create new: [typed text]” option appears at the bottom of the dropdown.
4. Selecting the “Create new” option either (a) immediately adds to catalog or (b) opens a quick-add mini-form inline.

### 7.2 Form Validation
- Required fields are marked with a red asterisk (*) next to the label.
- Validation runs on blur (field exit) for individual fields, and on form submission for all fields.
- Error messages appear immediately below the invalid field in the danger color (`#dc2626`).
- The submit button is disabled until all required fields in the current form pass validation.

### 7.3 Delete Confirmation
All destructive delete actions are gated behind a confirmation modal with:
- Modal title: “Delete [Entity]?” in uppercase bold.
- Body text: plain-language description of what will be deleted and any cascading effects.
- Two buttons: [CANCEL] (secondary/outline) and [DELETE] (danger/filled).

### 7.4 Toast Notifications
After save, update, or delete operations, a non-blocking toast notification appears at the bottom-right of the screen for 3 seconds:
- Success: green left-border accent, checkmark icon.
- Error: red left-border accent, error icon.
- Info: blue left-border accent, info icon.

### 7.5 Empty States
When a module has no data, a centred empty-state illustration (simple SVG icon) with a short message and a primary CTA button is shown. For example: “No doctor visits recorded. [+ Add Your First Visit]”.

## 8. Design Requirements (AVMS Design System)
All UI components must comply with the following design specifications derived from the AVMS Design System by AA Actuaries & Consultants.

### 8.1 Color System

| Role | Token | Hex Value | Usage in MRA |
|---|---|---|---|
| Primary Gradient | --gradient-primary | #6b21a8 → #ec4899 | Active nav item icon boxes, primary CTA buttons, stat card icons. |
| Secondary Gradient | --gradient-secondary | #2563eb → #22d3ee | Secondary actions, links, chart accent color 2. |
| Page Background | --bg-page | #f8f9fa | Body/page background behind cards. |
| Surface (Cards) | --bg-surface | #ffffff | All card and panel backgrounds. |
| Sidebar Background | --bg-sidebar | #f8f9fa | Left navigation panel background. |
| Primary Text | --fg-primary | #334155 (slate-700) | All body text, labels, values. |
| Secondary Text | --fg-secondary | #64748b (slate-500) | Captions, helper text, timestamps. |
| Placeholder / Disabled | --fg-tertiary | #94a3b8 (slate-400) | Empty input placeholders, disabled controls. |
| Success | --color-success | #16a34a | Normal status badge, active medicine bar, success toast. |
| Danger | --color-danger | #dc2626 | Delete button, High status badge, error toast, error messages. |
| Warning | --color-warning | #d97706 | On Hold status badge, Low status badge, warning indicators. |
| Info | --color-info | #0891b2 | Info toast, informational badges. |
| Input Border | --border-default | #dee2e6 | Default input and table cell borders. |
| Input Focus Ring | --border-focus | #d946ef (fuchsia-500) | Focus ring color on interactive inputs. |

### 8.2 Typography

| Element | Font Family | Size | Weight | Case / Transform |
|---|---|---|---|---|
| Page Title (H1) | Segoe UI | 22–24px | 700 | Sentence case |
| Section Header (H2) | Segoe UI | 16–18px | 700 | Sentence case |
| Card Title (H3) | Segoe UI | 14–15px | 600 | Sentence case |
| Table Column Header | Segoe UI | 10px | 700 | ALL CAPS + letter-spacing: 0.05em |
| Body Text / Values | Segoe UI | 12–13px | 400 | Normal |
| Button Labels | Segoe UI | 10–11px | 700 | ALL CAPS + letter-spacing: -0.015em |
| Form Labels | Segoe UI | 10px | 700 | ALL CAPS + letter-spacing: 0.05em |
| Input Values | Segoe UI | 13px | 400 | Normal |
| Helper / Caption | Segoe UI | 10–11px | 400 | Normal |
| Status Badge | Segoe UI | 10px | 700 | ALL CAPS |
| Chart Tooltips | Segoe UI | 11px | 400/600 | Sentence case |

### 8.3 Spacing & Density
MRA inherits the dense, data-focused spacing model of the AVMS Design System:
- Base unit: 4px (Tailwind 4-unit scale).
- Input vertical padding: 6–7px. Input horizontal padding: 12px.
- Card inner padding: 16–20px.
- Table cell padding: 8px vertical, 12px horizontal.
- Sidebar item padding: 8px vertical, 12px horizontal.
- Between form fields: 12–16px gap.

### 8.4 Component Specifications
#### 8.4.1 Cards
- `border-radius: 16px` (rounded-2xl).
- `box-shadow: 0 20px 27px 0 rgba(0,0,0,0.05)` (soft-xl).
- Background: white. No visible border.
- Icon boxes within cards: 36–48px square, border-radius 10px, gradient background, white icon.

#### 8.4.2 Buttons

| Variant | Style | Usage |
|---|---|---|
| Primary | Background: gradient-primary; text: white; border-radius: 8px; box-shadow: soft-md; padding: 8px 20px. | Add Visit, Add Lab Visit, Save Record. |
| Secondary | Background: white; border: 1px solid slate-300; text: slate-700; border-radius: 8px. | Cancel, Back, Edit. |
| Danger | Background: gradient-danger; text: white; border-radius: 8px. | Delete confirmation button. |
| Icon Button | 36px circle; background: transparent; hover: slate-100; icon: Material Icons 20px. | Edit, Delete in table rows; sidebar toggle. |

#### 8.4.3 Form Inputs
- Height: ~36px. Font: Segoe UI 13px. Border: 1px solid #dee2e6. Border-radius: 8px.
- Focus state: border-color: #d946ef; box-shadow: 0 0 0 3px rgba(217,70,239,0.1).
- Labels: 10px, 700, ALL CAPS, slate-700, margin-bottom: 4px.
- Error state: border-color: #dc2626; helper text in #dc2626 below field.

#### 8.4.4 Status Badges

| Badge Label | Background (light) | Text Color | Usage |
|---|---|---|---|
| ACTIVE | #f0fdf4 (success-light) | #16a34a (success) | Active medicine prescription. |
| COMPLETED | #f0fdf4 | #16a34a | Completed course. |
| DISCONTINUED | #fef2f2 (danger-light) | #dc2626 (danger) | Stopped medicine. |
| ON HOLD | #fffbeb (warning-light) | #d97706 (warning) | Temporarily paused. |
| NORMAL | #f0fdf4 | #16a34a | Lab result within range. |
| HIGH | #fef2f2 | #dc2626 | Lab result above range. |
| LOW | #fffbeb | #d97706 | Lab result below range. |
| N/A | #f1f5f9 (slate-100) | #64748b (slate-500) | No reference range defined. |

All badges: `border-radius: 9999px` (pill); padding: 2px 10px; font: 10px 700 ALL CAPS.

#### 8.4.5 Sidebar
- Background: #f8f9fa. Width: 240px expanded, 64px icon-only collapsed.
- Transition: width 250ms ease-soft-in-out.
- Active nav item: icon box with gradient-primary background, white icon, item label in slate-700 bold.
- Inactive nav item: white icon box with soft-xl shadow, icon in slate-400.
- Catalog item (bottom): visually separated by a 1px divider (rgba(0,0,0,0.08)); same icon box pattern but with gradient-secondary background when active.

#### 8.4.6 Tables
- Column headers: 10px, 700, ALL CAPS, slate-700 on slate-100 background.
- Row height: 40px. Alternating row background: white / #f8fafc.
- Hover row: slate-50 background.
- Borders: 1px solid #e2e8f0 (slate-200).

### 8.5 Apache ECharts Styling
All ECharts instances must use a custom theme derived from the AVMS color tokens:

| ECharts Property | AVMS Value |
|---|---|
| color[] (palette) | #6b21a8, #ec4899, #2563eb, #22d3ee, #16a34a, #d97706, #dc2626, #94a3b8 |
| backgroundColor | transparent |
| textStyle.fontFamily | Segoe UI, sans-serif |
| textStyle.color | #64748b (slate-500) |
| axisLine.lineStyle.color | #e2e8f0 (slate-200) |
| splitLine.lineStyle.color | #f1f5f9 (slate-100) |
| tooltip.backgroundColor | #ffffff |
| tooltip.borderColor | #e2e8f0 |
| tooltip.textStyle.color | #334155 |
| markArea (reference range) | fill: rgba(22,163,74,0.08); border: none |
| legend.textStyle.color | #64748b |

### 8.6 Shadows Reference

| Token | Value | Usage in MRA |
|---|---|---|
| soft-xs | 0 3px 5px -1px rgba(0,0,0,.09), 0 2px 3px -1px rgba(0,0,0,.07) | Dropdown menus, inline tags. |
| soft-md | 0 4px 7px -1px rgba(0,0,0,.11), 0 2px 4px -1px rgba(0,0,0,.07) | Buttons, input focus state. |
| soft-xl | 0 20px 27px 0 rgba(0,0,0,.05) | Cards, modal dialogs, sidebar. |
| soft-2xl | 0 .3125rem .625rem 0 rgba(0,0,0,.12) | Active/elevated cards, chart containers. |

## 9. Requirements Traceability Matrix

| Req ID | Description | Module | Priority | Status |
|---|---|---|---|---|
| FR-DV-001 | Doctor visit list view | Doctor Visits | P1 — Must Have | Defined |
| FR-DV-002 | Add/Edit doctor visit form | Doctor Visits | P1 — Must Have | Defined |
| FR-DV-003 | Medicine prescription lines | Doctor Visits | P1 — Must Have | Defined |
| FR-DV-004 | Auto-save new medicine to catalog | Doctor Visits | P1 — Must Have | Defined |
| FR-DV-005 | Delete/Edit visit | Doctor Visits | P1 — Must Have | Defined |
| FR-DV-006 | Medicine timeline chart (ECharts) | Doctor Visits | P1 — Must Have | Defined |
| FR-DV-007 | Dose/frequency change indicator | Doctor Visits | P2 — Should Have | Defined |
| FR-LR-001 | Lab visit list view | Lab Results | P1 — Must Have | Defined |
| FR-LR-002 | Add/Edit lab visit form | Lab Results | P1 — Must Have | Defined |
| FR-LR-003 | Test result lines | Lab Results | P1 — Must Have | Defined |
| FR-LR-004 | Auto-save new test to catalog | Lab Results | P1 — Must Have | Defined |
| FR-LR-005 | Parameter trend chart (ECharts) | Lab Results | P1 — Must Have | Defined |
| FR-LR-006 | Parameter summary grid | Lab Results | P2 — Should Have | Defined |
| FR-CAT-001 | Medicine catalog CRUD | Catalog | P1 — Must Have | Defined |
| FR-CAT-002 | Lab test catalog CRUD | Catalog | P1 — Must Have | Defined |
| FR-CAT-003 | Add/Edit catalog entry with dedup | Catalog | P1 — Must Have | Defined |
| FR-CAT-004 | Bulk import (v1.1) | Catalog | P3 — Nice to Have | Future |
| NFR-01 | Page transition < 300ms | All | P1 | Defined |
| NFR-02 | Offline-first / PWA | All | P1 | Defined |
| NFR-03 | IndexedDB persistence | All | P1 | Defined |
| NFR-04 | Responsive 360px–1920px | All | P1 | Defined |
| NFR-05 | ARIA accessibility | All | P2 | Defined |
| NFR-06 | No external data transmission | All | P1 | Defined |
| NFR-07 | Apache ECharts 5.x | Charts | P1 | Defined |
| NFR-08 | AVMS Design System fidelity | All | P1 | Defined |

## 10. Document Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | Apr 30, 2026 | Project Team | Initial release — full functional, UX, and design system requirements defined. |

---
End of Document — Personal Medical Record App SRS v1.0
