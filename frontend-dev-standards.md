# 🧱 Frontend Developer Standards & Rules
### Industry-Grade Guide for React · JavaScript · HTML/CSS · Tailwind CSS
> Version 3.1 — Your personal rulebook. Follow this on every project, every time.

---

## ⚡ TECH STACK (STRICT — No Exceptions)

| Layer | Allowed Tools |
|---|---|
| UI Framework | React (functional components + hooks only) |
| Scripting | JavaScript (ES6+) |
| Markup | HTML5 (semantic tags) |
| Styling | Tailwind CSS + plain CSS (for custom/complex styles) |
| State | React useState, useReducer, useContext — no Redux unless team decides |
| Routing | React Router DOM |
| HTTP | fetch() or axios |
| Build Tool | Vite (preferred) or Create React App |

> ❌ NO: Angular, Vue, jQuery, Bootstrap, Material UI, Sass/SCSS (unless project already uses it), TypeScript (unless added as a team decision)

---

## 📁 PROJECT FOLDER STRUCTURE (React)

```
src/
├── assets/          # Images, fonts, icons, static files
├── components/      # Reusable UI components (Button, Modal, Card...)
│   └── ui/          # Pure visual building blocks
├── pages/           # One file per route/page (Home.jsx, Dashboard.jsx)
├── layouts/         # Wrappers like Sidebar, Navbar, PageLayout
├── hooks/           # Custom hooks (useFetch, useAuth, useDebounce)
├── context/         # React Context files (AuthContext, ThemeContext)
├── services/        # API calls (api.js, userService.js)
├── utils/           # Helper functions (formatDate, validateEmail)
├── constants/       # App-wide constants (ROUTES, API_URLS)
└── App.jsx
```

> 📌 Rule: One component per file. File name = Component name. Example: `UserCard.jsx`

---

## 🧩 COMPONENT RULES

### Structure of every React component:
```jsx
// 1. Imports
import { useState } from "react";

// 2. Component
function UserCard({ name, role }) {

  // 3. State
  const [isOpen, setIsOpen] = useState(false);

  // 4. Handlers
  const handleClick = () => setIsOpen(!isOpen);

  // 5. Return JSX
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  );
}

export default UserCard;
```

### Component Rules:
- ✅ Always use **functional components** — never class components
- ✅ Props must be **destructured** in the function signature
- ✅ Keep components **small and focused** — if it's doing too much, split it
- ✅ Name components in **PascalCase** (`UserCard`, not `userCard`)
- ✅ Name files exactly as the component (`UserCard.jsx`)
- ✅ No inline logic in JSX — move complex logic to a variable or function above the return
- ❌ Never put API calls directly inside a component — use a service file or custom hook

---

## 🎨 TAILWIND CSS RULES

### ✅ DO:
- Use Tailwind utility classes for **all spacing, sizing, colors, typography, flex/grid**
- Use `tailwind.config.js` to define **brand colors, fonts, spacing** — don't hardcode hex values
- Use **responsive prefixes** on every layout class: `sm:`, `md:`, `lg:`, `xl:`
- Use `@apply` in a CSS file only for **repeated patterns** (e.g., a button style used 20+ times)
- Use `clsx` or `cn()` utility for **conditional class names**

### ❌ DON'T:
- Don't use inline `style={{}}` for anything Tailwind can handle
- Don't write random one-off classes that break the design system
- Don't use magic numbers — define them in `tailwind.config.js`

---

## 🎨 TAILWIND CSS — COMPLETE SYNTAX GUIDE

### 📦 How Tailwind Classes Are Written

Every Tailwind class follows this pattern:
```
[variant:]property-value
```
- **variant** = optional condition (hover, focus, md, lg, dark...)
- **property** = what CSS property you're targeting (bg, text, p, m, flex...)
- **value** = the value from Tailwind's scale (4 = 1rem, blue-500, etc.)

---

### 📐 SPACING — Padding & Margin

Tailwind uses a scale where **1 unit = 4px**

| Class | CSS Output | Use for |
|---|---|---|
| `p-4` | padding: 1rem (16px) | All sides |
| `px-4` | padding left + right | Horizontal |
| `py-2` | padding top + bottom | Vertical |
| `pt-2` | padding-top only | Single side |
| `m-4` | margin: 1rem | All sides |
| `mx-auto` | margin left + right: auto | Center a block |
| `mt-6` | margin-top: 1.5rem | Push down |
| `mb-0` | margin-bottom: 0 | Reset margin |
| `space-x-4` | gap between children (horizontal) | Flex row items |
| `space-y-2` | gap between children (vertical) | Stacked items |
| `gap-4` | gap in grid/flex | Grid/flex gaps |

```jsx
// ✅ Correct usage
<div className="px-6 py-4 mt-8 mb-4">
  <p className="mb-2">Hello</p>
  <p className="mb-2">World</p>
</div>
```

---

### 🔤 TYPOGRAPHY

| Class | What it does |
|---|---|
| `text-sm` | font-size: 0.875rem (14px) |
| `text-base` | font-size: 1rem (16px) — default |
| `text-lg` | font-size: 1.125rem (18px) |
| `text-xl` | font-size: 1.25rem (20px) |
| `text-2xl` | font-size: 1.5rem (24px) |
| `text-4xl` | font-size: 2.25rem (36px) |
| `font-normal` | font-weight: 400 |
| `font-medium` | font-weight: 500 |
| `font-semibold` | font-weight: 600 |
| `font-bold` | font-weight: 700 |
| `leading-tight` | line-height: 1.25 |
| `leading-relaxed` | line-height: 1.625 |
| `tracking-wide` | letter-spacing: 0.025em |
| `text-center` | text-align: center |
| `uppercase` | text-transform: uppercase |
| `truncate` | overflow hidden + ellipsis |

```jsx
<h1 className="text-3xl font-bold leading-tight tracking-tight">
  Page Title
</h1>
<p className="text-base text-gray-600 leading-relaxed">
  Body text here.
</p>
```

---

### 🎨 COLORS

Tailwind color format: `property-color-shade`
- **property**: `text`, `bg`, `border`, `ring`, `shadow`
- **color**: `gray`, `red`, `blue`, `green`, `yellow`, `purple`, `pink`, `indigo`, `orange`...
- **shade**: `50` (lightest) → `950` (darkest). Common: `100`, `200`, `400`, `500`, `600`, `700`, `900`

```jsx
// Text colors
<p className="text-gray-900">Dark text</p>
<p className="text-gray-500">Muted text</p>
<p className="text-blue-600">Brand text</p>
<p className="text-red-500">Error text</p>

// Background colors
<div className="bg-white">White card</div>
<div className="bg-gray-50">Light gray section</div>
<div className="bg-blue-600">Primary button</div>

// Border colors
<div className="border border-gray-200">Subtle border</div>
<div className="border-2 border-blue-500">Highlighted</div>
```

> 📌 Rule: Never write raw hex values in className. Add your brand color to `tailwind.config.js` and use it as `bg-brand-500`, `text-brand-700` etc.

---

### 📏 SIZING — Width & Height

| Class | Value |
|---|---|
| `w-full` | width: 100% |
| `w-1/2` | width: 50% |
| `w-64` | width: 16rem (256px) |
| `w-fit` | width: fit-content |
| `w-screen` | width: 100vw |
| `max-w-sm` | max-width: 24rem |
| `max-w-md` | max-width: 28rem |
| `max-w-lg` | max-width: 32rem |
| `max-w-xl` | max-width: 36rem |
| `max-w-2xl` | max-width: 42rem |
| `max-w-7xl` | max-width: 80rem (page container) |
| `h-full` | height: 100% |
| `h-screen` | height: 100vh |
| `h-16` | height: 4rem (64px) — navbar height |
| `min-h-screen` | min-height: 100vh |

```jsx
// ✅ Page container pattern
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* content */}
</div>
```

---

### 🏗️ FLEXBOX

```jsx
// Row layout
<div className="flex items-center justify-between gap-4">
  <span>Left</span>
  <span>Right</span>
</div>

// Center everything
<div className="flex items-center justify-center min-h-screen">
  <p>Centered</p>
</div>

// Wrap cards
<div className="flex flex-wrap gap-4">
  {cards.map(...)}
</div>

// Column layout (mobile default)
<div className="flex flex-col gap-2">
  <Item />
  <Item />
</div>
```

| Class | What it does |
|---|---|
| `flex` | display: flex |
| `flex-row` | horizontal (default) |
| `flex-col` | vertical |
| `flex-wrap` | wrap to next line |
| `items-center` | align-items: center (cross axis) |
| `items-start` | align-items: flex-start |
| `justify-center` | justify-content: center (main axis) |
| `justify-between` | justify-content: space-between |
| `justify-end` | justify-content: flex-end |
| `flex-1` | flex: 1 1 0% — take remaining space |
| `shrink-0` | flex-shrink: 0 — don't shrink |

---

### 🔲 GRID

```jsx
// 3 column grid
<div className="grid grid-cols-3 gap-6">
  <Card /> <Card /> <Card />
</div>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(...)}
</div>

// Span multiple columns
<div className="col-span-2">Wide item</div>
```

| Class | What it does |
|---|---|
| `grid` | display: grid |
| `grid-cols-2` | 2 equal columns |
| `grid-cols-3` | 3 equal columns |
| `grid-cols-12` | 12-column layout |
| `col-span-2` | span 2 columns |
| `col-span-full` | span all columns |
| `gap-4` | gap between cells |
| `gap-x-4` | horizontal gap only |
| `gap-y-6` | vertical gap only |

---

### 🖼️ BORDERS & RADIUS

```jsx
<div className="border border-gray-200 rounded-xl">Card</div>
<div className="border-2 border-blue-500 rounded-lg">Highlighted</div>
<img className="rounded-full w-12 h-12" /> // Circle avatar
```

| Class | Value |
|---|---|
| `rounded` | border-radius: 0.25rem |
| `rounded-md` | border-radius: 0.375rem |
| `rounded-lg` | border-radius: 0.5rem |
| `rounded-xl` | border-radius: 0.75rem |
| `rounded-2xl` | border-radius: 1rem |
| `rounded-full` | border-radius: 9999px (circle) |
| `border` | border-width: 1px |
| `border-2` | border-width: 2px |
| `border-t` | top border only |

---

### 💡 SHADOWS & OPACITY

```jsx
<div className="shadow-sm">Subtle shadow</div>
<div className="shadow">Default shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Card shadow</div>
<div className="shadow-xl">Elevated shadow</div>
<div className="opacity-50">50% transparent</div>
```

---

### 🔀 VARIANTS (Conditions on classes)

Variants go BEFORE the class, separated by `:`

```jsx
// Hover
<button className="bg-blue-600 hover:bg-blue-700">Click</button>

// Focus
<input className="border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />

// Active
<button className="active:scale-95">Press</button>

// Disabled
<button className="disabled:opacity-50 disabled:cursor-not-allowed" disabled>Off</button>

// Dark mode
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">

// Group hover (parent hover affects child)
<div className="group">
  <span className="text-gray-500 group-hover:text-blue-600">Link</span>
</div>
```

---

### 📱 RESPONSIVE VARIANTS

Mobile-first: base class = mobile, add `sm:` / `md:` / `lg:` for bigger screens.

```jsx
// Stack on mobile, side-by-side on desktop
<div className="flex flex-col md:flex-row gap-4">

// Full width on mobile, fixed width on desktop
<div className="w-full lg:w-64">

// Hide on mobile, show on desktop
<div className="hidden lg:block">

// Show on mobile only
<div className="block lg:hidden">

// Font size changes with screen
<h1 className="text-2xl md:text-4xl lg:text-5xl">
```

---

### ⚡ TRANSITIONS & ANIMATIONS

```jsx
// Smooth color change
<button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">

// Smooth all properties
<div className="transition-all duration-300 ease-in-out">

// Scale on hover
<div className="hover:scale-105 transition-transform duration-200">

// Fade in
<div className="opacity-0 animate-fade-in">

// Built-in animations
<div className="animate-spin">  // Loading spinner
<div className="animate-pulse"> // Skeleton loader
<div className="animate-bounce"> // Bounce indicator
```

---

### ✅ REAL-WORLD PATTERNS

**Card Component:**
```jsx
<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Title</h3>
  <p className="text-sm text-gray-500 leading-relaxed">Description</p>
</div>
```

**Primary Button:**
```jsx
<button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
  Submit
</button>
```

**Input Field:**
```jsx
<input
  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
  placeholder="Enter email"
/>
```

**Navbar:**
```jsx
<nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <span className="font-bold text-xl">Logo</span>
    <div className="hidden md:flex items-center gap-6">
      <a className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Home</a>
    </div>
  </div>
</nav>
```

**Conditional Classes with clsx:**
```jsx
import clsx from "clsx";

<button
  className={clsx(
    "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
    isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
>
  Button
</button>
```

---

## 📐 HTML & SEMANTIC RULES

- Use **semantic HTML always**:
  - `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
  - `<button>` for clickable actions — never `<div onClick>`
  - `<a href>` for navigation links
  - `<ul>/<li>` for lists
- Every image must have a meaningful `alt` attribute
- Every form input must have a `<label>` linked via `htmlFor`
- Use `<h1>` → `<h6>` in proper order — don't skip heading levels

---

## 🔗 JAVASCRIPT RULES (ES6+)

```js
// ✅ Always use const/let — never var
const user = { name: "Arjun", role: "dev" };

// ✅ Arrow functions for callbacks
const names = users.map((u) => u.name);

// ✅ Destructuring
const { name, role } = user;
const [first, ...rest] = items;

// ✅ Template literals
const message = `Hello, ${name}!`;

// ✅ Async/Await — never raw .then() chains
const fetchUser = async (id) => {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

// ✅ Optional chaining & nullish coalescing
const city = user?.address?.city ?? "Unknown";
```

### JS Rules:
- ❌ No `var` — ever
- ❌ No `.then()` chains — use `async/await`
- ✅ Always handle errors with `try/catch`
- ✅ Use `===` (strict equality) — never `==`
- ✅ Keep functions **small and single-purpose**
- ✅ Name functions and variables **clearly and descriptively** (`getUserById` not `getData`)

---

## 🌐 API & DATA FETCHING RULES

- All API base URLs go in a **`.env` file**: `VITE_API_URL=https://api.example.com`
- Create a **single `api.js` service file** — all fetch logic lives there
- Always show **loading state** while data is fetching
- Always show **error state** if the request fails
- Never block the UI — use optimistic updates where it makes sense

```js
// services/api.js
const BASE_URL = import.meta.env.VITE_API_URL;

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
};
```

---

## 🧠 STATE MANAGEMENT RULES

| Situation | Solution |
|---|---|
| Local UI state (open/close, input value) | `useState` |
| Derived/computed values | useMemo or just a variable |
| Side effects (fetch, timer, subscription) | `useEffect` |
| Shared state across sibling components | Lift state up to parent |
| Shared state across the whole app | React Context |
| Complex state with many actions | `useReducer` |

> ❌ Don't reach for Context or complex solutions for simple local state
> ❌ Don't put everything in global state — most state should live close to where it's used

---

## ♿ ACCESSIBILITY (A11Y) — NON-NEGOTIABLE

- All interactive elements must be **keyboard accessible**
- Use correct ARIA attributes when needed: `aria-label`, `aria-expanded`, `role`
- Maintain **color contrast ratio** of at least 4.5:1 for text
- Never rely on **color alone** to convey information
- All modals/dialogs must trap focus and close on `Escape`
- Test with keyboard navigation before calling anything "done"

---

## 📱 RESPONSIVE DESIGN RULES

- **Mobile-first** always — design for small screen, then scale up
- Breakpoints (Tailwind defaults):
  - `sm` = 640px | `md` = 768px | `lg` = 1024px | `xl` = 1280px
- Test every UI on: 375px (mobile), 768px (tablet), 1280px (desktop)
- No fixed pixel widths on containers — use `max-w-*` with `w-full`
- Use `grid` and `flex` with responsive prefixes — never `float`

---

## ⚡ PERFORMANCE RULES

- Use `React.lazy()` + `Suspense` for **route-level code splitting**
- Use `useMemo` and `useCallback` only when you can **measure a real performance problem** — don't over-optimize
- Compress all images — use WebP format where possible
- Never import an entire library when you only need one function
  ```js
  // ❌ Bad
  import _ from "lodash";
  // ✅ Good
  import debounce from "lodash/debounce";
  ```
- Avoid unnecessary `useEffect` — most derived data is just a variable

---

## 🗂️ NAMING CONVENTIONS

| Thing | Convention | Example |
|---|---|---|
| Component files | PascalCase | `UserCard.jsx` |
| Hook files | camelCase with `use` prefix | `useAuth.js` |
| Utility files | camelCase | `formatDate.js` |
| CSS/style files | same as component | `UserCard.css` |
| Variables | camelCase | `isLoading`, `userName` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| Event handlers | `handle` prefix | `handleSubmit`, `handleClick` |
| Boolean variables | `is/has/can` prefix | `isOpen`, `hasError`, `canEdit` |

---

## 🔒 SECURITY RULES

- ❌ NEVER put API keys or secrets in frontend code
- ❌ NEVER use `dangerouslySetInnerHTML` unless you sanitize the input first
- ✅ Always validate form inputs on the frontend (and trust the backend to validate again)
- ✅ Use environment variables for all config values
- ✅ Don't log sensitive user data to the console in production

---

## 🧪 CODE QUALITY RULES

- Use **ESLint** — keep zero warnings in production code
- Use **Prettier** for formatting — configure once, follow always
- Write **self-documenting code** — good names > comments
- Add a comment only when the **why** is not obvious from the code
- Delete commented-out code before merging — use Git history instead
- Every function should do **one thing only**
- If a file is getting too long (300+ lines), split it up

---

## 🚀 GIT & WORKFLOW RULES

### Branch naming:
```
feature/user-authentication
bugfix/login-form-error
hotfix/broken-api-call
chore/update-dependencies
```

### Commit message format:
```
feat: add user profile page
fix: resolve broken redirect on logout
style: update button hover states
refactor: extract API logic into service file
chore: upgrade react-router to v6.20
```

### Before every commit checklist:
- [ ] Code works and I've tested it in the browser
- [ ] No `console.log` left behind
- [ ] No hardcoded values that should be constants/env vars
- [ ] Responsive design checked on mobile and desktop
- [ ] No unused imports or variables

---

## 🤖 RULES WHEN USING AI (Copilot, Claude, ChatGPT, etc.)

1. **AI writes code, YOU review it** — never blindly copy-paste
2. AI must follow **all rules in this document** — if it generates class components, reject it
3. Check AI output for: unused imports, inline styles, `var`, missing error handling
4. AI cannot decide project architecture — **you own the structure**
5. Never let AI add libraries outside your tech stack
6. Use AI for: boilerplate, debugging, writing utility functions, explaining concepts
7. Don't use AI for: decisions about state management strategy, folder structure, or component design — those are yours

---

## 🚨 AI CAUTION PROTOCOL — TECH STACK VIOLATION RULE

**Every time AI generates code, it MUST check against the approved tech stack.**

If ANY of the following appear in AI-generated code, AI must STOP and raise a caution BEFORE producing any code:

```
⚠️  CAUTION — EXTRA TECH STACK DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detected   : [library/tool name]
Type       : [npm package / framework / CSS lib / etc.]
Not in     : Your approved tech stack
Action     : ❌ Will NOT implement this
Alternative: [what to use instead from approved stack]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Do you want to add this to your stack? (Yes / No)
If Yes → I will proceed only after your confirmation.
If No  → I will find a solution using only your approved tools.
```

### Trigger this caution for ANY of these:
- New npm packages not already in the stack (`framer-motion`, `styled-components`, `redux`, `react-query`, `zustand`, `chakra-ui`, `ant-design`, `material-ui`, `lodash`, `moment.js`, `axios` if not already used, etc.)
- CSS frameworks other than Tailwind (`Bootstrap`, `Bulma`, `Foundation`)
- TypeScript (`.ts`, `.tsx` files) unless already in the project
- Any backend-related package (`express`, `mongoose`, `prisma`, `supabase` client, `firebase`)
- Build tools other than Vite / CRA (`webpack config`, `parcel`, `esbuild` custom setup)
- Testing libraries unless you explicitly ask (`jest`, `vitest`, `cypress`, `playwright`)
- Animation libraries (`gsap`, `framer-motion`, `anime.js`)

### Rule: AI must NEVER silently add anything. Zero exceptions.

---

## 📋 AI MUST ALWAYS: PSEUDOCODE + PLAN FIRST

**Before writing a single line of code, AI must always produce a plan.**

Every response to a coding request must follow this exact format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PLAN & PSEUDOCODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 What we are building:
   [Short description of the feature/component]

📁 Files involved:
   - CREATE: src/components/UserCard.jsx  (new file)
   - EDIT  : src/pages/Home.jsx           (adding UserCard here)
   - EDIT  : src/App.jsx                  (adding route)

🧠 Pseudocode / Logic:
   1. Create UserCard component
      - Accept props: name, role, avatarUrl
      - Show avatar image, name, role badge
      - On click → trigger onSelect callback

   2. Add UserCard to Home page
      - Map over users array
      - Pass each user's data as props

   3. Handle empty state
      - If no users → show "No users found" message

⚠️  Tech Stack Check:
   ✅ React functional component — approved
   ✅ Tailwind CSS for styling — approved
   ✅ No extra packages needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONFIRM? → Reply "yes" to proceed with code
             Reply "change [something]" to adjust the plan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

> 📌 AI must WAIT for your confirmation before writing code, unless you explicitly say "just do it" or "no need for plan".

---

## 🔍 AI CODE TRANSPARENCY — VERIFY BEFORE APPLY

**Code must be 100% clean — no inline comments, no annotations inside the code.**
All explanations happen OUTSIDE the code, in a structured visual block BEFORE and AFTER.

---

### STEP 1 — BEFORE CODE: "What I'm about to write" block

AI must show this before every code block:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 WHAT THIS CODE DOES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 File      : src/components/UserCard.jsx  (NEW file)
🎯 Purpose   : Reusable card that shows a user's avatar, name, and role
🧩 Props     : name (string), role (string), avatarUrl (string)
⚙️  State     : isExpanded (bool) — toggles extra detail section
🖱️  Behavior  : Click "Show more" → expands detail. Click again → collapses
🎨 Styling   : Tailwind only — white card, rounded, soft shadow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Verify this matches what you want — then I write the code.
```

---

### STEP 2 — CLEAN CODE (no comments inside)

```jsx
import { useState } from "react";

function UserCard({ name, role, avatarUrl }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded((prev) => !prev);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        className="mt-3 text-xs text-blue-600 hover:underline"
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>

      {isExpanded && (
        <p className="mt-2 text-sm text-gray-600">Extra details here...</p>
      )}
    </div>
  );
}

export default UserCard;
```

---

### STEP 3 — AFTER CODE: "What just changed" block

AI must show this after every code block:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 CHANGES MADE — SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CREATED   : src/components/UserCard.jsx
   → Functional component, accepts 3 props, 1 state variable, 1 handler

✅ EDITED    : src/pages/Home.jsx  (lines 12–28)
   → OLD : <div className="p-4">{user.name}</div>
   → NEW : <UserCard name={...} role={...} avatarUrl={...} />
   → Also added import at line 3

✅ NO CHANGE : All other files untouched

⚠️  YOU MUST DO:
   → No new packages to install
   → Test: click "Show more" button in browser
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Rules for this section:
- ✅ Code is always clean — zero inline comments, zero annotations
- ✅ All explanation is in the blocks BEFORE and AFTER the code
- ✅ EDITED blocks always show OLD → NEW so you see exactly what changed
- ✅ AI always ends with what YOU need to do manually (test, run, install)
- ❌ Never mix explanation into the code itself

---

## 🏆 PRODUCTION STANDARD & SENIOR ENGINEER CODE RULES

**Every line of code AI writes must be as if a Senior Frontend Engineer at a top tech company wrote it and it is going live to thousands of users today.**

### What "production standard" means in practice:

**1. No lazy shortcuts**
- No hardcoded test data left in components
- No `TODO` or `FIXME` comments in delivered code
- No `console.log` anywhere
- No `any` workarounds — solve the actual problem
- No copy-pasted duplicate logic — extract it into a util or hook

**2. Edge cases are handled, always**
- Empty states: what shows when there's no data?
- Loading states: what shows while data is fetching?
- Error states: what shows if the API fails?
- Long text: does it break the layout or truncate gracefully?
- No data / null / undefined: component must not crash

**3. Code is readable and maintainable**
- Another developer must understand this code without asking you
- Variable and function names are descriptive — `getUserById` not `getData`
- No function longer than ~30 lines — split if it grows
- No file longer than 300 lines — split into smaller components

**4. Performance is considered from the start**
- Lists always use proper `key` props
- Images are sized and not layout-breaking
- No unnecessary re-renders — don't put objects/arrays inline in JSX props
- Heavy components use `React.lazy()` + `Suspense`

**5. Accessibility is not optional**
- Every button has meaningful text or `aria-label`
- Every image has `alt`
- Every input has a `label`
- Focus states are visible — never `outline: none` without a replacement

**6. Code style is consistent throughout**
- Same patterns used across the whole project
- Same naming conventions, same file structure, same spacing
- Looks like one person wrote the entire codebase

---

## 🧭 AI SENIOR ENGINEER ADVISORY — BEST APPROACH PROTOCOL

**AI does not just do what you say. AI thinks like a Senior Engineer and advises you first.**

Every time you describe what you want to build or how you want to approach something, AI must:

1. **Acknowledge your approach**
2. **Flag any disadvantages with your approach**
3. **Suggest the real-world best approach**
4. **Compare both side by side**
5. **Let YOU decide which to follow**

---

### Format AI must always use when you propose an approach:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧭 SENIOR ENGINEER REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Your Approach:
   [Repeat what you said / what you want to do]

⚠️  Disadvantages of Your Approach:
   → [Specific problem 1 — e.g. "This will re-render every time parent updates"]
   → [Specific problem 2 — e.g. "This won't scale when you add more filters"]
   → [Specific problem 3 — e.g. "This breaks on mobile if text is long"]

💡 Best Approach (Real-World Standard):
   [What a senior engineer would actually do and why]

📊 Comparison:
┌─────────────────────┬──────────────────┬──────────────────────┐
│                     │  Your Approach   │   Best Approach      │
├─────────────────────┼──────────────────┼──────────────────────┤
│ Scalability         │  ❌ Limited       │  ✅ Scales well       │
│ Performance         │  ⚠️  Ok for now   │  ✅ Optimized         │
│ Maintainability     │  ❌ Hard to edit  │  ✅ Easy to change    │
│ Code complexity     │  ✅ Simple        │  ⚠️  Slightly more     │
│ Industry standard   │  ❌ No            │  ✅ Yes               │
└─────────────────────┴──────────────────┴──────────────────────┘

🎯 My Recommendation: Best Approach — because [one clear reason]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Which do you want to go with?
   Reply "your approach" / "best approach" / "explain more"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Real examples of when this triggers:

| You say | AI flags |
|---|---|
| "Store user data in localStorage" | Security risk, no expiry, stale data issues — suggest Context + API refetch |
| "Put all state in App.jsx" | Prop drilling hell at scale — suggest co-location or Context |
| "Use one big CSS file for everything" | Conflicts, specificity wars — suggest component-scoped Tailwind |
| "Fetch data inside the component" | Untestable, not reusable — suggest service layer + custom hook |
| "Use index as key in lists" | React reconciliation bugs — suggest unique IDs |
| "Inline all styles with style={{}}" | No responsive support, overrides Tailwind — suggest Tailwind classes |
| "Use nested ternaries in JSX" | Unreadable, hard to debug — suggest early returns or extracted variables |

---

### Rules for this section:
- ✅ AI always reviews your approach BEFORE writing code
- ✅ AI is direct about disadvantages — not harsh, but honest
- ✅ AI always gives you the choice — never forces the best approach on you
- ✅ If you say "just do it my way" — AI respects that and builds it, but still logs the tradeoff
- ✅ If both approaches are equal, AI says so clearly instead of creating fake differences

---

---

## ⚙️ ENVIRONMENT SETUP & CONFIG

### Vite + React project from scratch:
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### `tailwind.config.js` — configure this once per project:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

### `index.css` — base Tailwind setup:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `.eslintrc.cjs` — standard config:
```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  rules: {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "react/prop-types": "warn",
  },
};
```

### `.prettierrc` — format config:
```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### `.env` — environment variables:
```
VITE_API_URL=https://api.example.com
```
> ✅ Always prefix with `VITE_` for Vite projects
> ❌ Never commit `.env` — add it to `.gitignore`

---

## 📝 FORM HANDLING RULES

No extra libraries. Pure React controlled inputs only.

### Standard form pattern:
```jsx
function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (data) => {
    const errs = {};
    if (!data.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) errs.email = "Enter a valid email";
    if (!data.password) errs.password = "Password is required";
    else if (data.password.length < 8) errs.password = "Minimum 8 characters";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setIsSubmitting(true);
    try {
      await loginUser(formData);
    } catch (err) {
      setErrors({ global: "Login failed. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errors.global && (
        <p className="text-sm text-red-500">{errors.global}</p>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### Form rules:
- ✅ Always use controlled inputs (`value` + `onChange`)
- ✅ Validate on submit — clear individual field error on change
- ✅ Show error message directly under the field it belongs to
- ✅ Disable submit button while submitting
- ✅ Always handle global API error separately
- ❌ Never use `document.getElementById` to read form values
- ❌ Never use uncontrolled refs for form data

---

## 🛡️ ERROR BOUNDARY

Every app must have an Error Boundary wrapping the main content. This catches runtime crashes and shows a fallback UI instead of a blank white screen in production.

### `src/components/ErrorBoundary.jsx`:
```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
          <p className="text-sm text-gray-500">Please refresh the page or try again later.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Usage in `App.jsx`:
```jsx
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
```

> ⚠️ Error Boundaries must be class components — this is the one exception to the functional-only rule. React does not support functional Error Boundaries yet.

---

## 🪝 CUSTOM HOOK PATTERNS

Custom hooks extract reusable logic out of components. Rule: if the same logic appears in 2+ components, make it a hook.

### Standard `useFetch` hook — `src/hooks/useFetch.js`:
```jsx
import { useState, useEffect } from "react";

function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchFn()
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, deps);

  return { data, isLoading, error };
}

export default useFetch;
```

### `useDebounce` — `src/hooks/useDebounce.js`:
```jsx
import { useState, useEffect } from "react";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
```

### `useLocalStorage` — `src/hooks/useLocalStorage.js`:
```jsx
import { useState } from "react";

function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStored(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
    }
  };

  return [stored, setValue];
}

export default useLocalStorage;
```

### Custom hook rules:
- ✅ Always start with `use` — `useAuth`, `useFetch`, `useForm`
- ✅ Return an object `{ data, isLoading, error }` — not a raw array (unless it's a simple toggle)
- ✅ Handle cleanup in `useEffect` (cancel timers, abort fetch)
- ❌ Never call hooks inside conditions or loops
- ❌ Never put business logic directly in a component when it can be a hook

---

## 🏷️ PROP VALIDATION WITH PROPTYPES

No TypeScript in this stack. Use PropTypes to document and validate all component props.

### Setup:
```bash
npm install prop-types
```

### Usage pattern:
```jsx
import PropTypes from "prop-types";

function UserCard({ name, role, avatarUrl, onSelect, isActive }) {
  return ( ... );
}

UserCard.propTypes = {
  name:      PropTypes.string.isRequired,
  role:      PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  onSelect:  PropTypes.func,
  isActive:  PropTypes.bool,
};

UserCard.defaultProps = {
  avatarUrl: "/default-avatar.png",
  onSelect:  () => {},
  isActive:  false,
};

export default UserCard;
```

### PropTypes quick reference:
| Type | PropTypes syntax |
|---|---|
| String | `PropTypes.string` |
| Number | `PropTypes.number` |
| Boolean | `PropTypes.bool` |
| Function | `PropTypes.func` |
| Array | `PropTypes.array` |
| Object | `PropTypes.object` |
| Array of shape | `PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number }))` |
| One of values | `PropTypes.oneOf(["admin", "user", "guest"])` |
| Required | append `.isRequired` to any type |

> ✅ Every component with props must have PropTypes defined — no exceptions

---

## 🗺️ IMPORT ALIASES (No more `../../../`)

Set up path aliases in Vite so imports are always clean.

### `vite.config.js`:
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Now use `@/` everywhere instead of relative paths:
```jsx
// ❌ Before — messy and fragile
import UserCard from "../../../components/UserCard";
import { getUsers } from "../../services/api";

// ✅ After — clean and always correct
import UserCard from "@/components/UserCard";
import { getUsers } from "@/services/api";
```

> ✅ Use `@/` for all imports from `src/`. Only use relative paths for files in the same folder.

---

## 🌐 API RESPONSE HANDLING PATTERNS

### Auth headers:
```js
const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, { headers: getAuthHeaders() });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};
```

### Pagination pattern:
```js
export const getPaginatedUsers = async (page = 1, limit = 10) => {
  const res = await fetch(`${BASE_URL}/users?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};
```

```jsx
function UserList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useFetch(() => getPaginatedUsers(page), [page]);

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <ErrorMessage message={error} />}
      {data?.users.map((u) => <UserCard key={u.id} {...u} />)}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
          className="px-3 py-1 text-sm border rounded disabled:opacity-40">Prev</button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={!data?.hasMore}
          className="px-3 py-1 text-sm border rounded disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
```

---

## ⏳ LOADING SKELETON vs SPINNER — WHEN TO USE WHICH

| Situation | Use |
|---|---|
| Full page loading (route change, initial app load) | Spinner centered on screen |
| Card/list content loading (known layout) | Skeleton |
| Button action in progress (save, submit, delete) | Spinner inside button / disabled state |
| Background refresh (data updating silently) | Nothing — don't interrupt the user |
| Search results loading | Skeleton |
| Image loading | Skeleton placeholder behind image |

**Rule: If you know the shape of the content coming in — use Skeleton. If you don't — use Spinner.**

### Skeleton component:
```jsx
function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

function UserCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
```

### Spinner component:
```jsx
function Spinner({ size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  return (
    <div className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-300 border-t-brand-600`} />
  );
}
```

---

## 🐛 CONSOLE & DEBUGGING RULES

| Situation | Rule |
|---|---|
| During development | `console.log` is fine — temporary only |
| Before any commit | Remove ALL `console.log` |
| Actual errors in catch blocks | Use `console.error` — allowed in production |
| Warnings for developers | Use `console.warn` — allowed but use sparingly |
| Tracking API responses | Never log full response objects — log only what you need |
| Sensitive data (tokens, passwords, user info) | NEVER log — not even in dev |

### ESLint enforces this:
```js
"no-console": ["warn", { allow: ["error", "warn"] }]
```
This flags every `console.log` as a warning so it's impossible to miss before committing.

---

## ✅ AI OUTPUT REVIEW CHECKLIST

Run this on EVERY piece of code AI gives you before you use it:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔎 AI CODE REVIEW — RUN BEFORE ACCEPTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
  [ ] No new packages added without my permission
  [ ] No TypeScript (.ts/.tsx) unless I approved it
  [ ] No Bootstrap, Material UI, or other CSS frameworks
  [ ] No class components (unless it's an ErrorBoundary)

CODE QUALITY
  [ ] No var — only const and let
  [ ] No .then() chains — only async/await
  [ ] No console.log left in the code
  [ ] No hardcoded strings that should be constants or env vars
  [ ] No unused imports or variables
  [ ] Error handling exists (try/catch for all async)

REACT RULES
  [ ] Functional component only
  [ ] Props are destructured in the signature
  [ ] Lists have unique key props (not index)
  [ ] No API calls directly inside the component body
  [ ] Loading state exists
  [ ] Error state exists
  [ ] Empty state exists

TAILWIND & STYLING
  [ ] No inline style={{}} for anything Tailwind handles
  [ ] Responsive classes present (sm: md: lg:)
  [ ] No hardcoded hex colors — uses Tailwind scale or brand tokens

ACCESSIBILITY
  [ ] All images have alt text
  [ ] All inputs have labels
  [ ] All buttons have meaningful text or aria-label

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If any box is unchecked → reject and ask AI to fix it first.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎨 TAILWIND CONFIG — BRAND TOKENS SETUP

Set this up once at the start of every project. Never use raw Tailwind color names like `blue-600` in your components — always use your brand tokens.

### Full `tailwind.config.js` for a real project:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        gray: {
          50:  "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["Fira Code", "ui-monospace"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};
```

### Usage — always use tokens, never raw colors:
```jsx
// ❌ Bad — raw Tailwind color, not your brand
<button className="bg-blue-600 hover:bg-blue-700">

// ✅ Good — your brand token
<button className="bg-brand-600 hover:bg-brand-700">

// ✅ Good — semantic shadow token
<div className="shadow-card hover:shadow-card-hover">
```

---

## 🧭 REACT ROUTER DOM — ROUTING PATTERNS

### Installation:
```bash
npm install react-router-dom
```

### Standard router setup — `src/App.jsx`:
```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "profile/:userId",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

### `src/layouts/MainLayout.jsx` — shared wrapper for all pages:
```jsx
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
```

### Navigation — always use these, never `<a href>` for internal links:
```jsx
import { Link, useNavigate, useParams } from "react-router-dom";

// Link — declarative navigation
<Link to="/dashboard" className="text-brand-600 hover:underline">
  Go to Dashboard
</Link>

// useNavigate — programmatic navigation
const navigate = useNavigate();
navigate("/dashboard");           // go to page
navigate(-1);                     // go back
navigate("/login", { replace: true }); // redirect (no back history)

// useParams — read URL parameters
const { userId } = useParams();   // from path: /profile/:userId
```

### 404 Page — `src/pages/NotFound.jsx`:
```jsx
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-lg text-gray-600">Page not found</p>
      <Link to="/" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
```

### Routing rules:
- ✅ Always use `createBrowserRouter` — not the old `<BrowserRouter>` wrapping pattern
- ✅ All routes defined in one place — `App.jsx`
- ✅ Use `<Outlet />` in layouts for nested routes
- ✅ Always have a `path: "*"` catch-all for 404
- ✅ Use `replace: true` when redirecting after login/logout so user can't press Back to get back
- ❌ Never use `<a href>` for internal navigation — always `<Link>` or `useNavigate`

---

## 🔐 AUTHENTICATION FLOW PATTERN

### Full auth flow overview:
```
User logs in → API returns token → Store token → Set auth state
         → On every request: send token in header
         → On 401 response: clear token + redirect to /login
         → On page refresh: read token from storage → restore auth state
         → On logout: clear token + redirect to /login
```

### `src/context/AuthContext.jsx` — the single source of auth truth:
```jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getUserProfile } from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setIsLoading(false); return; }
    getUserProfile()
      .then((data) => setUser(data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (credentials) => {
    const { token, user } = await loginUser(credentials);
    localStorage.setItem("token", token);
    setUser(user);
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
```

### `src/components/ProtectedRoute.jsx` — auth guard:
```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

### `src/services/authService.js`:
```js
const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
};

export const getUserProfile = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};
```

### Wrap app with AuthProvider in `App.jsx`:
```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    ),
    children: [ ... ],
  },
]);
```

### Auth rules:
- ✅ Single `AuthContext` — one source of truth for user state
- ✅ Always check token on app load (`useEffect` in AuthProvider) to restore session
- ✅ `isLoading: true` on startup — show spinner, never flash the login page to a logged-in user
- ✅ `ProtectedRoute` wraps every private page — never check auth inside the page itself
- ✅ Use `replace: true` on all auth redirects so Back button doesn't loop
- ❌ Never store passwords — only tokens
- ❌ Never put raw auth logic inside page components

---

## 🌍 CONTEXT PATTERN — FULL EXAMPLE

Use React Context when state needs to be shared across many components that aren't directly related (theme, user, cart, notifications, language).

### The 3 parts of every Context:

**Part 1 — Create & provide: `src/context/ThemeContext.jsx`**
```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
```

**Part 2 — Wrap your app in `App.jsx`:**
```jsx
import { ThemeProvider } from "@/context/ThemeContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </ThemeProvider>
    ),
    children: [ ... ],
  },
]);
```

**Part 3 — Consume anywhere in the tree:**
```jsx
import { useTheme } from "@/context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900">
      <button onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </nav>
  );
}
```

### Context rules:
- ✅ Always export a custom hook (`useTheme`, `useAuth`) — never export the raw Context object
- ✅ Throw a clear error if hook is used outside Provider — catches mistakes immediately
- ✅ Keep each Context focused on one concern — don't dump everything into one giant AppContext
- ✅ Provider wraps only what needs it — not necessarily the whole app
- ❌ Never use Context for state that is only needed by one or two nearby components — just lift state up instead
- ❌ Never put rapidly-changing state (like a search input value) in Context — it re-renders everything

### When to use Context vs other solutions:

| Situation | Solution |
|---|---|
| State needed by 1–2 components | `useState` + lift up |
| State needed across many pages | Context |
| Complex state with many actions | `useReducer` inside Context |
| Server data (users list, products) | Custom hook + service layer |
| Auth state | AuthContext (always) |

---

## 🖼️ IMAGE & ASSET HANDLING

### `src/assets/` vs `public/` — know the difference:

| | `src/assets/` | `public/` |
|---|---|---|
| **Use for** | Images used inside components | Favicon, `robots.txt`, OG images, fonts |
| **How to use** | Import in JS/JSX | Reference by absolute path `/logo.png` |
| **Processed by Vite?** | ✅ Yes — hashed, optimized | ❌ No — copied as-is |
| **Can reference in CSS?** | ✅ Yes via import | ✅ Yes via `/path` |
| **Recommended for** | All component images | Static files that must keep their filename |

### Importing images in components:
```jsx
import logoImg from "@/assets/logo.png";
import heroBg  from "@/assets/hero-background.webp";

function Navbar() {
  return <img src={logoImg} alt="Company logo" className="h-8 w-auto" />;
}
```

### Always use WebP for photos and illustrations:
```jsx
<picture>
  <source srcSet="/images/hero.webp" type="image/webp" />
  <img src="/images/hero.jpg" alt="Hero image" className="w-full h-auto" />
</picture>
```

### Lazy loading — always on images below the fold:
```jsx
<img
  src={product.imageUrl}
  alt={product.name}
  loading="lazy"
  className="w-full h-48 object-cover rounded-lg"
/>
```

### Broken image fallback:
```jsx
function SafeImage({ src, alt, className }) {
  const handleError = (e) => {
    e.target.src = "/images/placeholder.png";
  };

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
}
```

### Image rules:
- ✅ Always set `alt` — descriptive for content images, `alt=""` for decorative ones
- ✅ Always set explicit `width` and `height` or use `object-cover` — prevents layout shift
- ✅ Use `loading="lazy"` on all images not visible on first load
- ✅ Use WebP format for all photos — smaller file size, same quality
- ✅ Use `SafeImage` component for any image that comes from an API or user upload
- ✅ All static images that are imported inside components go in `src/assets/`
- ✅ Favicon, OG image, `robots.txt` go in `public/`
- ❌ Never use a raw `<img>` for API/user images without an `onError` fallback
- ❌ Never use images wider than they'll actually display — always size them correctly

---

## ✅ PROJECT LAUNCH CHECKLIST

Before any project goes live:

- [ ] All pages are mobile responsive (375px tested)
- [ ] No console errors or warnings
- [ ] All images have alt text
- [ ] Environment variables are in `.env`, not hardcoded
- [ ] Loading and error states exist for all async operations
- [ ] Forms validate inputs and show clear error messages
- [ ] Keyboard navigation works
- [ ] Page titles are set correctly
- [ ] Code is cleaned up (no dead code, no commented blocks)
- [ ] Folder structure is clean and organized

---

*This document is your single source of truth. Every project, every feature, every component — follow this.*
