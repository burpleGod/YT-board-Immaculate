# Solution: hexToRgb() rgba Input Fix

**Date:** 2026-03-11
**Phase:** 3A
**Owner:** Karina (Full Stack)

## Problem

`hexToRgb()` in `src/utils.js` was called with the result of `ts.accentColor`, which can be either a hex string (`#d4a843`) or an rgba string (`rgba(212,168,67,0.5)`). The original implementation only handled hex input. Passing an rgba string caused it to return `null`, breaking all computed `rgba(${hexToRgb(accent)},0.12)` style expressions with a `rgba(null,0.12)` value.

## Root Cause

The function used `parseInt(hex.slice(1,3), 16)` unconditionally, which fails for non-hex input.

## Fix

Added an early-return guard at the top of `hexToRgb()`:

```js
export function hexToRgb(hex) {
  // Pass-through: already an rgb/rgba string
  if (typeof hex === "string" && hex.startsWith("rgb")) {
    const m = hex.match(/\d+/g);
    return m ? `${m[0]},${m[1]},${m[2]}` : "0,0,0";
  }
  if (!hex || hex.length < 6) return "0,0,0";
  hex = hex.replace("#", "");
  return `${parseInt(hex.slice(0,2),16)},${parseInt(hex.slice(2,4),16)},${parseInt(hex.slice(4,6),16)}`;
}
```

If the input starts with `"rgb"`, the function extracts the first three numeric groups and returns them as `"r,g,b"`, which is the format all callers expect.

## Affected Callers

Every inline style that constructs `rgba(${hexToRgb(accent)},<alpha>)` — used throughout Nav, IdeaCard, JournalEntryRow, and theme-colored elements in pages.

## Prevention

- `hexToRgb()` is now documented as accepting both hex and rgb/rgba input.
- New theme color pickers that emit rgba values will continue to work without callers needing to sanitize input.
