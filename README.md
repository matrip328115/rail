# Rail

**Zero-dependency, data-aware chip rail for web apps.**

Give it a data array → get a horizontal, scrollable chip rail with deduplication, counts, colors, and recent-value memory — in one `<script>` tag.

```js
Rail.create({
  items: Rail.fromData({ data: rows, key: 'person', sort: 'count' })
}).mount('#filters');
```

[**Live demo**](https://matrip328115.github.io/rail/demo.html) · [Report bug](https://github.com/matrip328115/rail/issues)

---

## Why Rail?

Most chip components give you a **container**. Rail gives you a **dataset → UI** pipeline.

| What you usually get | What Rail adds |
|---|---|
| Chip UI | `Rail.fromData()` — dedupe + count in one line |
| Single-select | Single **and** multi-select, same API |
| Static items | `loadItems()` — async with auto skeleton + error |
| Manual theming | CSS variables — restyle everything from outside |
| Framework-bound | Zero dependencies. Plain `<script>`. |

Perfect for: **filters, tag pickers, recent-value rails, date/month navigation, amount buckets** — anywhere you need "pick from a known set".

---

## Install

### Option 1 — CDN

```html
<script src="https://cdn.jsdelivr.net/gh/YOURNAME/rail@1.0.1/rail.js"></script>
```

### Option 2 — npm

```bash
npm install @yourname/rail
```

```js
import Rail from '@yourname/rail';
```

### Option 3 — Manual

Download `rail.js` → drop into your project → include with a `<script>` tag.

**Zero dependencies. ~7 KB minified. Works everywhere.**

---

## Quick Start

### Basic

```html
<div id="picker"></div>
<script>
  Rail.create({
    items: [
      { value: 'Ram' },
      { value: 'Shyam' },
      { value: 'Raju' },
    ],
    onSelect: (item) => console.log('picked', item.value),
  }).mount('#picker');
</script>
```

### From raw data (auto-dedupe + count)

```js
const rows = [
  { person: 'Ram',   amount: 500 },
  { person: 'Ram',   amount: 100 },
  { person: 'Shyam', amount: 200 },
  { person: 'Raju',  amount: 300 },
];

Rail.create({
  items: Rail.fromData({ data: rows, key: 'person', sort: 'count' }),
  onSelect: (item) => filterTable({ person: item.value }),
  onClear: () => filterTable({ person: null }),
}).mount('#personRail');
```

Result: `[ Ram · 2 ] [ Raju · 1 ] [ Shyam · 1 ]` — deduped, sorted by count.

### Async

```js
Rail.create({
  loadItems: async () => {
    const r = await fetch('/api/categories');
    const data = await r.json();
    return Rail.fromData({ data, key: 'id', label: 'name' });
  },
  onSelect: (item) => navigate(item.value),
}).mount('#cats');
```

Shows shimmer skeletons while loading, red error chip on failure.

---

## API Reference

### `Rail.create(opts)`

Returns a `Rail` instance. Call `.mount(target)` to attach it.

#### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `items` | `Item[]` | `[]` | Array of chip objects (see below) |
| `active` | `string \| number \| Array` | `null` / `[]` | Current selection |
| `multiple` | `boolean` | `false` | Enable multi-select |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Chip height & font size |
| `dense` | `boolean` | `false` | Tighter chip gap |
| `showAll` | `boolean` | `true` (single) | Show the "All" reset chip |
| `allLabel` | `string` | `'All'` | Label for the reset chip |
| `accentColor` | `string` | `null` | Override accent color (any CSS color) |
| `colorize` | `boolean` | `true` | Show colored dot per text chip |
| `autoColorText` | `boolean` | `true` | Auto-generate dot color from value |
| `emptyMessage` | `string` | `null` | Message when no items and `showAll: false` |
| `loadItems` | `() => Promise<Item[]>` | `null` | Async loader for items |
| `renderItem` | `(item) => html` | `null` | Custom chip inner HTML |
| `onSelect` | `(item, rail) => void` | `null` | Fired when a chip becomes active |
| `onDeselect` | `(item, rail) => void` | `null` | Fired when a multi-select chip is turned off |
| `onClear` | `(rail) => void` | `null` | Fired when "All" is tapped or active chip is re-tapped |

#### Item shape

```ts
{
  value: string | number,       // required, unique
  label?: string,               // display text (defaults to value)
  count?: number,               // badge number
  color?: string | false,       // dot color, or false to hide
  icon?: string,                // emoji or single char
  disabled?: boolean,           // dim and disable
  className?: string,           // extra class on the chip
}
```

#### Methods

| Method | Description |
|---|---|
| `.mount(target)` | Attach to a DOM element or CSS selector |
| `.destroy()` | Remove from DOM, detach listeners |
| `.setItems(items)` | Replace all items |
| `.setActive(value)` | Programmatically set active value(s) |
| `.getActive()` | Read current active value(s) |
| `.setLoading(bool)` | Show/hide skeleton |
| `.setError(string \| Error)` | Show error chip |
| `.on(event, fn)` | Subscribe to `'select'`, `'deselect'`, `'clear'` |
| `.off(event, fn)` | Unsubscribe |

#### Behaviour notes

- **`__ALL__` is reserved.** Do not use it as an item `value`. It powers the "All" reset chip.
- **`showAll` is forced off in multi-select mode.** To reset in multi-select, call `setActive([])` or trigger your own reset.
- **String comparison for active state.** `active: 5` matches item `value: '5'` and vice versa. Numeric and string values are treated as equivalent.
- **Deterministic colors.** `Rail.colorOf('Ram')` always returns the same color. Colors survive reloads, sessions, and machines.
- **Async race protection.** Calling `.destroy()` while `loadItems` is pending cancels the update safely.

### `Rail.fromData(config)`

Build items from a raw data array. Dedupes, counts, sorts.

| Option | Type | Default | Description |
|---|---|---|---|
| `data` | `Array` | required | Source rows |
| `key` | `string \| (row) => any` | required | Unique key for each chip |
| `label` | `string \| (row) => string` | same as `key` | Display text |
| `sort` | `'asc' \| 'desc' \| 'count' \| fn` | `'asc'` | Sort order |
| `filterEmpty` | `boolean` | `true` | Skip null/undefined/empty keys |

### `Rail.colorOf(string)`

Deterministic color from any string. Same input → same color, always.

```js
Rail.colorOf('Ram')    // → "hsl(87 62% 62%)"
Rail.colorOf('Ram')    // → "hsl(87 62% 62%)"  (same)
Rail.colorOf('Shyam')  // → "hsl(342 62% 62%)"
```

---

## Cookbook

### 1. Table filter bar

```js
const rail = Rail.create({
  items: Rail.fromData({ data: rows, key: 'person', sort: 'count' }),
  active: state.filters.person,
  onSelect: (item) => {
    state.filters.person = item.value;
    renderTable();
  },
  onClear: () => {
    state.filters.person = null;
    renderTable();
  },
}).mount('#personFilter');
```

### 2. Multi-select tag picker

```js
Rail.create({
  multiple: true,
  items: allTags.map(t => ({ value: t.id, label: t.name, icon: '#' })),
  active: selectedTagIds,
  onSelect: (item, rail) => { selectedTagIds = rail.getActive(); },
  onDeselect: (item, rail) => { selectedTagIds = rail.getActive(); },
}).mount('#tagPicker');
```

### 3. Recent values above a form input

```js
const input = document.querySelector('#entityInput');

Rail.create({
  size: 'sm',
  showAll: false,
  items: recentList.map(v => ({ value: v, color: false })),
  onSelect: (item) => {
    input.value = item.value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  },
}).mount('#recentMount');
```

### 4. Month rail with "has data" dot

```js
Rail.create({
  showAll: false,
  items: MONTHS.map((m, i) => ({ value: i, label: m, hasData: monthStats[i] > 0 })),
  active: currentMonth,
  onSelect: item => goToMonth(item.value),
  renderItem: (item) => `
    <span style="position:relative;padding-bottom:6px">
      ${item.label}
      ${item.hasData ? '<span style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--rc-accent)"></span>' : ''}
    </span>
  `,
}).mount('#monthRail');
```

### 5. Async with error handling

```js
Rail.create({
  loadItems: async () => {
    const r = await fetch('/api/categories');
    if (!r.ok) throw new Error('Failed to load categories');
    const data = await r.json();
    return Rail.fromData({ data, key: 'id', label: 'name', sort: 'asc' });
  },
  onSelect: (item) => filterByCategory(item.value),
}).mount('#cats');
```

### 6. Live updates

```js
function updatePeopleRail(){
  rail.setItems(Rail.fromData({
    data: currentRows,
    key: 'person',
    sort: 'count',
  }));
}

document.addEventListener('data-changed', updatePeopleRail);
```

---

## Theming

Every visual element is controlled by CSS variables. Override on any ancestor:

```css
.my-theme .rail-c{
  --rc-accent: #5CC8FF;
  --rc-bg: #0A0C0F;
  --rc-bg-hover: #1A2028;
  --rc-border: #2A333C;
  --rc-border-hover: #3A4550;
  --rc-text: #8B98A8;
  --rc-text-hover: #E9EEF4;
  --rc-text-active: #5CC8FF;
  --rc-badge-bg: rgba(255,255,255,.06);
  --rc-badge-text: #6A7685;
  --rc-radius: 999px;
  --rc-gap: 8px;
  --rc-h: 36px;
  --rc-font: 13px;
  --rc-font-weight: 600;
  --rc-pad-x: 14px;
}
```

Or set accent per-instance:

```js
Rail.create({
  accentColor: '#FF6B6B',
  items: [...],
}).mount('#alert');
```

### Full variable list

| Variable | Purpose |
|---|---|
| `--rc-bg` | Chip background |
| `--rc-bg-hover` | Chip background on hover |
| `--rc-border` | Chip border |
| `--rc-border-hover` | Chip border on hover |
| `--rc-text` | Chip text |
| `--rc-text-hover` | Chip text on hover |
| `--rc-text-active` | Chip text when active |
| `--rc-accent` | Accent (borders, dots, focus) |
| `--rc-accent-soft` | Active chip background tint |
| `--rc-accent-glow` | Active badge background |
| `--rc-accent-ring` | Focus ring |
| `--rc-badge-bg` | Badge background (inactive) |
| `--rc-badge-text` | Badge text (inactive) |
| `--rc-radius` | Corner radius (try `999px` for pills) |
| `--rc-gap` | Space between chips |
| `--rc-h` | Chip height |
| `--rc-font` | Font size |
| `--rc-font-weight` | Font weight |
| `--rc-pad-x` | Horizontal padding |

---

## Accessibility

- **`role="listbox"`** on the container
- **`role="option"`** + **`aria-selected`** on every chip
- **`aria-multiselectable="true"`** when `multiple: true`
- **Keyboard navigation**: `←` `→` move, `Home` / `End` jump, `Enter` / `Space` toggle
- **Visible focus ring** on all chips
- **Disabled chips** are non-focusable and non-clickable

---

## Browser Support

Chrome 49+, Firefox 45+, Safari 10+, Edge 15+. Anything with ES5 + flexbox works.

Zero polyfills needed.

---

## Difference from Material Web / ChipGroup

Material Web chips are a **UI primitive**. Rail is a **data → UI pipeline**:

- **`Rail.fromData()`** — dedupe + count from a raw array (Material doesn't do this)
- **Async loader with skeleton + error** built-in (Material doesn't do this)
- **`setItems` / `setActive` / `setLoading` / `setError`** — full lifecycle API
- **Zero-dependency** — one `<script>` tag, works anywhere, no bundler
- **Form-recent-values pattern** — remember and show recent input values as chips

If you need a filter bar, tag picker, or "recent values" rail — Rail is that.

---

## License

MIT © matrip328115
