// TypeScript definitions for rail@1.0.1
// Project: https://github.com/matrip328115/rail

export type RailValue = string | number;

export interface RailItem {
  /** Unique identifier. Used for comparisons and active-state. */
  value: RailValue;
  /** Display text. Defaults to `value`. */
  label ? : string;
  /** Small badge number (e.g. count). */
  count ? : number;
  /** Dot color (any CSS color), or `false` to hide the dot. */
  color ? : string | false;
  /** Emoji / single-char icon shown before the label. */
  icon ? : string;
  /** Dim and disable the chip. */
  disabled ? : boolean;
  /** Extra CSS class(es) applied to the chip button. */
  className ? : string;
}

export interface RailOptions {
  /** Array of chip items. */
  items ? : RailItem[];
  /** Currently active value(s). Array in multi-select mode. */
  active ? : RailValue | RailValue[] | null;
  /** Enable multi-select mode. Disables the "All" chip. */
  multiple ? : boolean;
  /** Chip size preset. Default: 'md'. */
  size ? : 'sm' | 'md' | 'lg';
  /** Reduce gap between chips. */
  dense ? : boolean;
  /** Show the "All" reset chip. Forced off when `multiple: true`. Default: true. */
  showAll ? : boolean;
  /** Label for the reset chip. Default: 'All'. */
  allLabel ? : string;
  /** Override the accent color for this instance. */
  accentColor ? : string | null;
  /** Show colored dot per text chip. Default: true. */
  colorize ? : boolean;
  /** Auto-generate dot color from value (hash-based). Default: true. */
  autoColorText ? : boolean;
  /** Message shown when `items` is empty and `showAll` is false. */
  emptyMessage ? : string | null;
  /** Async loader. Resolves to an array of items. */
  loadItems ? : () => Promise < RailItem[] > ;
  /** Fully custom inner HTML for a chip. */
  renderItem ? : (item: RailItem) => string;
  /** Fired when a chip becomes active. */
  onSelect ? : (item: RailItem, rail: RailInstance) => void;
  /** Fired when a chip in multi-select mode is turned off. */
  onDeselect ? : (item: RailItem, rail: RailInstance) => void;
  /** Fired when the active chip is re-tapped, or "All" is clicked. */
  onClear ? : (rail: RailInstance) => void;
}

export interface RailInstance {
  /** Attach the rail to a DOM element or CSS selector. */
  mount(target: Element | string): RailInstance;
  /** Remove from DOM and detach listeners. */
  destroy(): RailInstance;
  /** Replace all items. Clears loading and error state. */
  setItems(items: RailItem[]): RailInstance;
  /** Programmatically set the active value(s). Pass null/[] to clear. */
  setActive(value: RailValue | RailValue[] | null): RailInstance;
  /** Read the current active value(s). */
  getActive(): RailValue | RailValue[] | null;
  /** Show the skeleton loading state. */
  setLoading(v: boolean): RailInstance;
  /** Show the error state. */
  setError(err: string | Error): RailInstance;
  /** Subscribe to an event. */
  on(event: 'select' | 'deselect' | 'clear', fn: (...args: any[]) => void): RailInstance;
  /** Unsubscribe from an event. */
  off(event: string, fn: (...args: any[]) => void): RailInstance;
}

export interface FromDataConfig < T = any > {
  /** Source rows. */
  data: T[];
  /** Unique key for each chip — a field name or an extractor function. */
  key: keyof T | ((row: T) => RailValue);
  /** Display text — a field name or an extractor function. Defaults to `key`. */
  label ? : keyof T | ((row: T) => string);
  /** Sort order. Default: 'asc'. */
  sort ? : 'asc' | 'desc' | 'count' | ((a: RailItem, b: RailItem) => number);
  /** Skip null/undefined/empty keys. Default: true. */
  filterEmpty ? : boolean;
}

/** Library version. */
export const version: string;

/** Create a new rail instance. */
export function create(opts ? : RailOptions): RailInstance;

/** Build items from a raw data array. Dedupes, counts, and sorts. */
export function fromData < T = any > (config: FromDataConfig < T > ): RailItem[];

/** Deterministic color from any string. Same input → same color. */
export function colorOf(value: any): string;

declare const Rail: {
  version: string;
  create: typeof create;
  fromData: typeof fromData;
  colorOf: typeof colorOf;
};

export default Rail;
