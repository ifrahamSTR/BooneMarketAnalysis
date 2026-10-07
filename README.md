# Boone & Blowing Rock, NC — STR Market & Location Analysis

Static site (no build step), same template as the Galveston, Bend, Gulf Shores, Park City and Charlotte market sites. It covers **Sections 2–5 only**: Market, Location Analysis by Bedroom Size, Why Location Changes the Rate, and Traveller Demographics. **No buy boxes yet.**

## Pipeline

1. `../notebooks/market_common.py` holds the market specifics:
   - workbook `../Boone - NC - Banner Elk, NC Greater Area.xlsx` (snapshot 2026-09-28) → `Cleaned_Data`, kept to entire homes via `Base_Table.roomType` (228 of 228), with the listing description merged in from `Base_Table`;
   - 6 Ward-clustered reference areas (Blowing Rock, Between Boone & Blowing Rock, West Boone & Hwy 105, North & East Boone, Foscoe & Shulls Mill, Valle Crucis & Vilas), named from centroid thresholds and checked against reverse geocoding and OSM roads;
   - bedroom buckets Studio-1BR / 2BR / 3BR / 4BR+;
   - distance to town: kilometres to the nearer of downtown Boone (King Street) and Blowing Rock's Main Street, in three bands (under 2.5 km, 2.5–6 km, 6 km+);
   - extra screening flags: Blowing Rock area, an advertised mountain or long-range view (from the title and description), and elevation of 3,800 ft or more (USGS EPQS, cached in `elevation_usgs.json`).
2. `python ../notebooks/build_overview_notebook.py`, then `jupyter nbconvert --to notebook --execute --inplace ../notebooks/boone_overview.ipynb`. This writes:
   - `region_stats.json`;
   - the interactive folium map `boone_overview_map.html` (landmarks from `landmarks.json`).
   The builder is identical across markets.
3. `python scripts/generate_webpage_data.py` writes:
   - `js/region_data.js`;
   - `assets/overview/boone_overview_map.html`;
   - `data/listings.json`.
   Don't hand-edit these files.

## Files

| File | Role |
|---|---|
| `js/data.js` | Market-specific prose and config: hero, market card (researched and fact-checked, with sources), screening-signal rows, location reads, size guide, destination areas, season strip, bridge. Prose that quotes a number computes it from `region_data.js`. |
| `js/location.js`, `js/destination.js`, `js/render.js`, `js/charts.js`, `js/main.js`, `css/styles.css` | Shared, unchanged, across the market sites. |

## Method notes

- **Location is always compared within the same bedroom size.**
  - "vs. typical" = a listing's Revenue Potential ÷ the market median for its size bucket.
  - With 228 listings, cells under 8 homes are muted ("few homes"); under 3 are hidden.
- **"Blowing Rock" is mostly the cabins northeast of town.** Of its 36 homes, 10 are within 2.5 km of Main Street; the rest sit 2.5–4.5 km out, off US-321 and Aho Road.
- **Three Valle Crucis studios–1BRs are design-led couples' retreats** (two cabins from one operator and a treehouse). They lift that area-size cell and the 6 km+ studio–1BR cell; the prose says so.
- **Elevation was tested and shows no premium** within size; it is used only as a screening flag.
- **Presentation rules:** plain English, no statistical notation, and conclusions → evidence → what to look for.
