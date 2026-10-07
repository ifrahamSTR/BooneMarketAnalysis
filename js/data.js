/**
 * Content/config layer for the Boone & Blowing Rock, NC (High Country) market
 * & location page (Sections 2-5; no buy boxes yet). Same template as the
 * Galveston, Bend and Gulf Shores sites, organised around bedroom size:
 * every location comparison is made within a size bucket ("vs. typical" =
 * revenue / market median for that size).
 *
 * Prose and config only. Every number shown is read from js/region_data.js
 * (generated from notebooks/boone_overview.ipynb); prose that quotes a number
 * computes it from that data. Qualitative statements were checked against
 * the notebook output for the 2026-09-28 snapshot (228 entire homes in the
 * Boone, Blowing Rock, Vilas and Banner Elk ZIP codes). Most "Blowing Rock"
 * homes are cabins 2.5-4.5 km northeast of Main Street (off US-321 and Aho
 * Road), not in town; three of the six Valle Crucis studios-1BRs are
 * design-led couples' retreats, which is what lifts that cell.
 */
function photo(relPath, alt, caption) {
  return { file: "assets/" + relPath, alt: alt, caption: caption };
}
const MARKET_NAME = "Boone & Blowing Rock, NC";
const _ls = (s, l) => LOCATION.locSize[s][l];
const _area = (name) => LOCATION.areas.find((a) => a.name === name);
const _lad = (s) => LOCATION.ladder.find((r) => r.size === s);
const _x = (c) => fmtX(c.idx);
const _ht = (s) => LOCATION.amenBySize.hot_tub[s];
const _drv = (k) => LOCATION.drivers.find((d) => d.driver === k);
const TOWN = "In or next to town", MID = "2.5–6 km out", FAR = "6 km+ out";
const BR = "Blowing Rock", BETWEEN = "Between Boone & Blowing Rock", WESTB = "Downtown & West Boone", NORTHB = "North & East Boone", FOSCOE = "Foscoe & Shulls Mill", VALLE = "Valle Crucis & Vilas";

// ---------------------------------------------------------------------------
// Overview (top of page)
// ---------------------------------------------------------------------------
const HERO = {
  title: "In the High Country, Blowing Rock is the address that pays",
  sub: (() => {
    const b = _area(BR), h = _ht("4BR+"), top = Object.values(LOCATION.top10BySize).reduce((a, c) => a + c, 0);
    return "Bedroom count sets the baseline. Of the six reference areas, only Blowing Rock clearly earns above it (" + fmtX(b.idx) + " typical for its sizes), led by its studios, 1BRs and 2BRs. " +
      "Being close to downtown Boone matters mainly for small homes (in Blowing Rock, the cabins just outside town out-earn the homes near Main Street); from 3BR up, being out in the country costs nothing. What separates the large homes is the hot tub: " +
      LOCATION.top10Amen.hot_tub + " of the " + top + " Top 10% listings have one, and 4BR+ homes without one earn about " + fmtX(h.idxWithout) + " typical. " +
      "This page covers the market, location by bedroom size, why guests choose each part of the High Country, and who they are. Buy boxes come next.";
  })(),
};

const FOOTER_NOTE = () =>
  "Preliminary. No property has been underwritten and no buy box has been set. Revenue figures are gross Revenue Potential benchmarks from the market dataset (" +
  MARKET_STATS.n + " entire-home listings in the Boone, Blowing Rock, Vilas and Banner Elk ZIP codes, <span class=\"nowrap\">" + MARKET_STATS.snapshot + "</span> snapshot), not a full underwriting model. Read any cell under 8 homes as directional.";

// ---------------------------------------------------------------------------
// Section 2 — Market context (MARKET_OVERVIEW is in the research section below)
// ---------------------------------------------------------------------------
const DISTRIBUTION_NOTE = () => {
  const t = LOCATION.top10BySize;
  const total = Object.values(t).reduce((a, b) => a + b, 0);
  return "Most listings earn under " + fmtK(REVENUE_DISTRIBUTION.p75) + "; the Top 10% starts at " + fmtCurrency(REVENUE_DISTRIBUTION.p90) + ". Most of that tail is large homes (" +
    t["4BR+"] + " of the " + total + " are 4BR+), but " + t["Studio-1BR"] + " are studios or 1BRs: design-led couples' retreats such as an A-frame and a treehouse. No 2BR reaches it.";
};

const LADDER_NOTE = () => {
  const s = _lad("Studio-1BR"), two = _lad("2BR"), three = _lad("3BR"), b = _lad("4BR+");
  return "A 2BR earns only a little more than a studio or 1BR (" + fmtK(two.median) + " vs " + fmtK(s.median) + "); the step up comes at 3BR (" + fmtK(three.median) + ") and 4BR+ (" + fmtK(b.median) +
    "), where the nightly rate climbs to " + fmtCurrency(b.adr) + " and occupancy dips to " + b.occ + "%. Because size moves revenue this much, every location comparison below is made within the same size.";
};

const DRIVERS_NOTE =
  "<strong>Screening signals, not proven uplift.</strong> Each row compares listings with and without a feature on two measures: how often they reach the top quarter <em>for their size</em>, and what they earn against a typical home their size (1.00× = typical). Rows with fewer than 15 homes on either side are marked \"few homes\". Game rooms and pool tables sit mostly in large homes, and about seven in ten homes with a game room, pool table or gym also have a hot tub, so their signals overlap.";

const DRIVER_ROWS = [
  { key: "Blowing Rock area", label: "Blowing Rock area", group: "Location · area", note: "The one area clearly ahead of its sizes, and not because of hot tubs: its studios–1BR and 2BRs without one still earn well above typical." },
  { key: TOWN, label: "Within 2.5 km of downtown Boone or Blowing Rock", group: "Location · distance", note: "Helps small homes only, mostly near downtown Boone (see Section 3); 3BR+ in town earn no more than those out of town." },
  { key: FAR, label: "Rural, 6 km+ out", group: "Location · distance", note: "No penalty for being out in the country from 3BR up; rural 2BRs are a little behind (see Section 3)." },
  { key: "Mountain view (listed)", label: "Advertises a mountain or long-range view", group: "Location · view", note: "A signal, strongest at 4BR+, but only alongside a hot tub: large view homes without one earn below typical." },
  { key: "3,800 ft or higher", label: "High up (3,800 ft or more)", group: "Location · elevation", note: "No premium for elevation on its own (USGS elevation at each listing's map pin)." },
  { key: "hot_tub", label: "Hot tub", group: "Amenity", note: "The most reliable signal in the market: common (" + _drv("hot_tub").nWith + " homes), it shows at every size, and the gap is widest at 4BR+ (see Section 3)." },
  { key: "game_room", label: "Game room", group: "Amenity", note: "A 4BR+ feature (" + LOCATION.amenBySize.game_room["4BR+"].nWith + " of the " + _drv("game_room").nWith + " homes with one); 4BR+ homes without one lag." },
  { key: "pool_table", label: "Pool table", group: "Amenity", note: "Mostly large homes; overlaps with game rooms and hot tubs." },
  { key: "gym", label: "Gym or fitness room", group: "Amenity", note: "Only " + _drv("gym").nWith + " homes, of every size; most also have a hot tub." },
  { key: "waterfront", label: "On a creek, river, pond or lake", group: "Amenity · water", note: "Only " + _drv("waterfront").nWith + " homes, mostly small cabins; a signal at 2–3BR, on few homes." },
  { key: "fire_pit", label: "Fire pit", group: "Amenity", note: "Two in three homes have one; a small signal." },
  { key: "Superhost", label: "Superhost", group: "Operations", note: "Little difference overall: most hosts here are Superhosts. The exception is 4BR+, where the few homes without a Superhost earn about half of typical." },
];

// ---------------------------------------------------------------------------
// Section 3 — Location by bedroom size
// ---------------------------------------------------------------------------
const MAP_CONFIG = {
  lede:
    "Bedroom count sets the baseline; location can nudge a home above or below it. Every comparison here is within the same size: <strong>1.00× = what a typical High Country home that size earns</strong>. The location question is <strong>distance to town</strong>, measured to the nearer of downtown Boone (King Street, next to Appalachian State) and Blowing Rock's Main Street, plus <strong>six reference areas</strong> from Blowing Rock to Valle Crucis. Elevation (from USGS, at each listing's map pin) was tested too and shows no premium.",
  marketInterpretation:
    "In the bottom-left panel (tap “show” on a phone), <strong>untick all but one bedroom size</strong> to see where that size earns. Green = top quarter for its size, gold = middle half, grey = bottom quarter; bigger dots = more bedrooms. Click an area outline for its numbers by size. The six areas are clusters of listing coordinates, used as reference geography only, and Airbnb shows approximate locations.",
};

const LOC_READS = {
  "Studio-1BR": (() => {
    const t = _ls("Studio-1BR", TOWN), m = _ls("Studio-1BR", MID), f = _ls("Studio-1BR", FAR);
    return "Next to town pays: " + _x(t) + " typical within 2.5 km (mostly homes near downtown Boone), " + _x(m) + " in the 2.5–6 km ring. The rural figure (" + _x(f) + ") rests on " + f.n + " homes, three of them design-led couples' retreats in Valle Crucis.";
  })(),
  "2BR": "Little difference with distance; rural 2BRs (only " + _ls("2BR", FAR).n + " homes) are a little behind.",
  "3BR": (() => "Distance doesn't matter: 3BRs earn about typical 3 km or 10 km out. Only " + _ls("3BR", TOWN).n + " sit in town.")(),
  "4BR+": "No distance premium. The 2.5–6 km ring trails only because of its large homes without a hot tub; with one, large homes earn about the same at any distance (few homes in town or 6 km+ out).",
  "All sizes": "The × figures are size-adjusted; the dollar figures are not, and partly reflect more large homes out of town.",
};

const AREA_GRID_NOTE = () => {
  const b = _area(BR), n = _area(NORTHB), v = _area(VALLE);
  return "<strong>Blowing Rock is the one area clearly ahead</strong> (" + fmtX(b.idx) + " typical for its sizes). It is the only area at or above typical at every size and leads at 2BR and 4BR+; Valle Crucis is ahead at studio–1BR (few homes) and 3BR. Only its studios–1BRs (" + fmtX(b.bySize["Studio-1BR"].idx) + ", " + b.bySize["Studio-1BR"].n +
    " homes) and 2BRs (" + fmtX(b.bySize["2BR"].idx) + ", " + b.bySize["2BR"].n + ") rest on 8 homes or more. Most of its listings are cabins just northeast of town, off US-321 and Aho Road, and those cabins, more than the homes near Main Street, carry its lead. " +
    "North & East Boone is the weakest (" + fmtX(n.idx) + "), through its 3BRs and 4BR+. Valle Crucis studios–1BRs look strongest on paper (" + fmtX(v.bySize["Studio-1BR"].idx) + ") only because three of its " + v.bySize["Studio-1BR"].n +
    " are design-led couples' retreats. Figures in grey, tagged \"few homes\", rest on fewer than 8 homes.";
};

const SIZE_GUIDE = {
  "Studio-1BR": {
    head: "Near downtown Boone, the Blowing Rock cabins, or a stand-out design.",
    look: "Within about 2.5 km of King Street in Boone, or the Blowing Rock cabins off US-321 and Aho Road. Farther out, only stand-out designs (A-frames, treehouses, couples' cabins with a hot tub) beat typical.",
    avoid: "A plain small cabin 2.5–6 km out of Boone. At this size, homes around Foscoe, and between Boone and Blowing Rock (few homes), earn well below typical.",
    proof: () => "In town " + fmtK(_ls("Studio-1BR", TOWN).median) + " (" + _x(_ls("Studio-1BR", TOWN)) + ") · 2.5–6&nbsp;km&nbsp;" + fmtK(_ls("Studio-1BR", MID).median) + " (" + _x(_ls("Studio-1BR", MID)) + ") · Blowing Rock " + fmtK(areaCellOf(BR, "Studio-1BR").median),
  },
  "2BR": {
    head: "Distance matters little; Blowing Rock is the edge.",
    look: "Blowing Rock, or anywhere within 6 km of town, where 2BRs earn about typical.",
    avoid: (() => "Rural 2BRs 6 km+ out, which earn a little below typical (only " + _ls("2BR", FAR).n + " homes).")(),
    proof: () => "In town " + fmtK(_ls("2BR", TOWN).median) + " · 2.5–6&nbsp;km&nbsp;" + fmtK(_ls("2BR", MID).median) + " · 6&nbsp;km+&nbsp;" + fmtK(_ls("2BR", FAR).median) + " (" + _ls("2BR", FAR).n + " homes) · Blowing Rock " + fmtK(areaCellOf(BR, "2BR").median),
  },
  "3BR": {
    head: "Any distance; the home matters more than the spot.",
    look: (() => "Between Boone and Blowing Rock, the deepest pool of 3BRs (" + _area(BETWEEN).bySize["3BR"].n + " homes, about typical), or Valle Crucis. A hot tub lifts a 3BR from " + fmtX(_ht("3BR").idxWithout) + " to " + fmtX(_ht("3BR").idxWith) + " typical.")(),
    avoid: "North & East Boone 3BRs, which earn well below typical.",
    proof: () => "2.5–6&nbsp;km&nbsp;" + fmtK(_ls("3BR", MID).median) + " · 6&nbsp;km+&nbsp;" + fmtK(_ls("3BR", FAR).median) + " · in town " + fmtK(_ls("3BR", TOWN).median) + " (" + _ls("3BR", TOWN).n + " homes) · North & East Boone " + fmtK(areaCellOf(NORTHB, "3BR").median),
  },
  "4BR+": {
    head: "A hot tub first; then Blowing Rock if you can.",
    look: "Any area, with a hot tub (and ideally a view). Blowing Rock's few 4BR+ homes lead the market for this size.",
    avoid: "Large homes without a hot tub, which earn well below typical in almost every area, and North & East Boone.",
    proof: () => "With a hot tub " + fmtX(_ht("4BR+").idxWith) + " (" + _ht("4BR+").nWith + " homes) · without " + fmtX(_ht("4BR+").idxWithout) + " (" + (_lad("4BR+").n - _ht("4BR+").nWith) + ") · in town " + fmtK(_ls("4BR+", TOWN).median) + " · 2.5–6&nbsp;km&nbsp;" + fmtK(_ls("4BR+", MID).median),
  },
};

// ---------------------------------------------------------------------------
// Section 5 — Demographics (area comparisons within the same size)
// ---------------------------------------------------------------------------
const DEMOGRAPHICS_NOTE = () => {
  const b = DEMOGRAPHICS.byBedroom, s = b.find((r) => r.label === "Studio-1BR"), big = b.find((r) => r.label === "4BR+");
  const A = DEMOGRAPHICS.byAreaSize, r = (v) => Math.round(v), M = DEMOGRAPHICS.marketWide;
  return "These are review-derived signals, not verified demographics. On the average listing, " + r(M.kids) + "% of reviews come from stays with kids, " + r(M.group) + "% from group trips and " + r(M.pet) + "% from stays with a pet. " +
    "Small homes are couples' and friends' trips (" + r(s.other) + "% \"Other\" at studio–1BR); families and groups take over from 3BR, and at 4BR+ " + r(big.kids) + "% of reviews are from stays with kids and " + r(big.group) + "% from groups. " +
    "Size for size, 3BRs between Boone and Blowing Rock draw more families than 3BRs in Downtown & West Boone or North & East Boone (" + r(A[BETWEEN]["3BR"].kids) + "% kids vs " + r(A[WESTB]["3BR"].kids) + "% and " + r(A[NORTHB]["3BR"].kids) + "%).";
};

// ---------------------------------------------------------------------------
// Section 2 — Market context. Researched 2026-10-07: Visit NC / Tourism
// Economics 2025 county tables, Explore Boone (Watauga County TDA), Boone Area
// Chamber of Commerce quarterly Economic Indicators (Q4 2025, Q2 2026), App
// State, NPS, the ski areas' own stats pages, Town of Boone, Avery County and
// Town of Banner Elk tax forms, and local news. County figures cover all of
// Watauga County (Boone, Blowing Rock, Valle Crucis, Vilas) or Avery County
// (Banner Elk, Sugar Mountain); no town-only visitor series is published.
// ---------------------------------------------------------------------------
const MARKET_OVERVIEW = {
  heroImage: photo(
    "overview/grandfather-mountain-from-parkway.jpg",
    "Grandfather Mountain's rocky summit ridge above forest starting to turn red and orange, seen from an overlook on the Blue Ridge Parkway under a clear sky",
    'Grandfather Mountain in early October from the Grandfather Overlook on the Blue Ridge Parkway. "Grandfather Mountain from Grandfather Overlook, Oct 2016" by Thomson200, <a href="https://commons.wikimedia.org/wiki/File:Grandfather_Mountain_from_Grandfather_Overlook,_Oct_2016.jpg" target="_blank" rel="noopener">Wikimedia Commons</a>, CC0.'
  ),
  chips: [
    { label: "Blue Ridge Parkway Runs Past Both Towns" },
    { label: "Three Ski Areas in the High Country" },
    { label: "App State: 17,000 Students in Boone" },
    { label: "6% Occupancy Tax Across the Market" },
  ],
  attractions: [
    "<strong>The Blue Ridge Parkway</strong>: mileposts 276–305 run past Boone and Blowing Rock (Moses H. Cone Memorial Park, Price Lake, the Linn Cove Viaduct). It was the most-visited unit of the National Park Service in 2025, with 16.5 million recreation visits along its full length.",
    "<strong>Skiing, mid-November to late March</strong>: Appalachian Ski Mtn sits between Boone and Blowing Rock (13 slopes); Sugar Mountain (125 acres, 1,200 ft vertical) and Beech Mountain Resort (95 acres, the highest ski area in eastern America at 5,506 ft) are near Banner Elk, west of the homes in this dataset.",
    "<strong>Appalachian State University</strong>: 21,308 students in fall 2026, 17,063 of them on the Boone campus. Six home football games at Kidd Brewer Stadium in 2026, and commencement in May and December.",
    "<strong>Towns and family attractions</strong>: downtown Boone's King Street, Blowing Rock's Main Street, Tweetsie Railroad (a Wild West theme park since 1957, with Ghost Train weekends in the fall and Tweetsie Christmas), Grandfather Mountain's Mile High Swinging Bridge, and the original Mast General Store in Valle Crucis.",
  ],
  visitorStats: {
    headline: "Watauga County (Boone, Blowing Rock, Valle Crucis) and Avery County (Banner Elk, Sugar Mountain); each tile says which area it covers",
    breakdown: [
      { value: "$531.8M", label: "Visitor Spending, Watauga County (2025, +3.1%)" },
      { value: "$259.0M", label: "Visitor Spending, Avery County (2025, +3.0%)" },
      { value: "+5.1%", label: "Occupancy Tax, Q2 2026 vs Q2 2025 (Watauga TDA Area)" },
      { value: "125.5k", label: "Non-Resident Visits to Watauga, Homecoming & Woolly Worm Weekend (Oct 17–19, 2025)" },
    ],
  },
  watchOuts: [
    "🌀 <strong>Hurricane Helene (late September 2024) hit at the start of leaf season.</strong> In the year to June 2025, Blowing Rock's occupancy tax fell 5.3% and the unincorporated county's fell nearly 19%, a drop the tourism authority tied almost entirely to short-term rentals lost outside the town limits. Boone's rose 11%. Across Watauga County as a whole (Boone, Blowing Rock and the unincorporated county combined), October 2025 occupancy tax came back more than 80% above the storm-hit October 2024, according to the Boone Area Chamber of Commerce.",
    "❄️ <strong>Winter depends on the weather.</strong> The ski areas make their own snow, but snow on the roads cuts the other way: in early 2026 Friday and Saturday snows muted two normally strong weekends after New Year's, according to the Boone Area Chamber of Commerce.",
    "📋 <strong>Town rules differ from the county's.</strong> Inside Boone's town limits, whole-house vacation rentals are allowed only in the business districts, with a $530 annual permit (homes permitted in the RA and R3 districts as of May 8, 2024 can continue). Blowing Rock also requires a short-term rental permit, renewed every year by July 1, and allows short-term rentals only in certain districts (mainly its business districts and a short-term rental overlay); confirm current rules with the town. Many homes in this dataset sit outside the town limits; check each address.",
    "🎓 <strong>Boone leans on App State.</strong> Boone-campus enrollment fell from 18,124 (fall 2025) to 17,063 (fall 2026). The Boone Area Chamber of Commerce (Q2 2026) sees \"hints of a looming downward trend in enrollment\" but still calls App State the region's most significant economic driver. Its visitor counts for Watauga County show how much football weekends matter: about 99,500 non-resident visits on October 4, 2025, the day of one of the season's highest-demand home games, and about 125,500 over Homecoming weekend (October 17–19, 2025), which also had the Woolly Worm Festival and Valle Country Fair.",
  ],
  sources: [
    { label: "Visit NC 2025 county visitor spending", url: "https://www.visitnc.com/sites/default/files/2026-08/2025%20County%20Level%20Visitor%20Expenditures.pdf" },
    { label: "Explore Boone (occupancy tax)", url: "https://www.exploreboone.com/about-us/" },
    { label: "Town of Blowing Rock (6% occupancy tax)", url: "https://www.blowingrock.gov/1211/Occupancy-Tax-Form" },
    { label: "Boone Chamber Q2 2026 indicators", url: "https://assets.noviams.com/novi-file-uploads/bacc/Economic_Indicators_Q2_2026__2_.pdf" },
    { label: "Boone Chamber Q4 2025 indicators", url: "https://assets.noviams.com/novi-file-uploads/bacc/Economic_Indicators_Q4_2025__3_.pdf" },
    { label: "Watauga Democrat (Boone occupancy tax, FY2024–25)", url: "https://www.wataugademocrat.com/main_street/boone-occupancy-tax-sees-growth-despite-helene-county-decreases/article_5af194ad-d6b3-4435-a6ea-ecbe3c653ea2.html" },
    { label: "Watauga Democrat (Blowing Rock TDA 2024–25)", url: "https://www.wataugademocrat.com/main_street/blowing-rock-tda-reports-over-29-million-in-lodging-sales-in-2024-25-annual-report/article_88b430e6-bf7e-4ba7-a5d8-4179eaaa7456.html" },
    { label: "App State (fall 2026 enrollment)", url: "https://today.appstate.edu/2026/09/04/enrollment" },
    { label: "App State (fall 2025 enrollment)", url: "https://today.appstate.edu/2025/09/05/enrollment" },
    { label: "App State 2026 football schedule", url: "https://appstatesports.com/news/2026/3/13/2026-app-state-football-schedule-unveiled.aspx" },
    { label: "NPS visitation statistics (Blue Ridge Parkway)", url: "https://irma.nps.gov/Stats/SSRSReports/Park%20Specific%20Reports/Annual%20Park%20Recreation%20Visitation%20(1904%20-%20Last%20Calendar%20Year)?Park=BLRI" },
    { label: "NPS 2025 visitation release (top 10 sites)", url: "https://www.nps.gov/orgs/1207/03-13-26-2025-visitation-statsitics.htm" },
    { label: "Explore Boone (Parkway mileposts)", url: "https://www.exploreboone.com/outdoors/blue-ridge-parkway/" },
    { label: "Appalachian Ski Mtn stats", url: "https://appskimtn.com/mountain-stats" },
    { label: "Sugar Mountain stats", url: "https://skisugar.com/sugar-mountain-stats/" },
    { label: "Beech Mountain Resort stats", url: "https://www.beechmountainresort.com/mountain/mountain-stats/" },
    { label: "Tweetsie Railroad 2026 fact sheet", url: "https://tweetsie.com/assets/audio/2026-Tweetsie-Railroad-Fact-Sheet.pdf" },
    { label: "Town of Boone (short-term rentals)", url: "https://www.townofboone.net/632/Short-Term-Rentals-Homestay-Vacation-Ren" },
    { label: "Town of Blowing Rock (short-term rental permit application)", url: "https://www.sog.unc.edu/sites/www.sog.unc.edu/files/course_materials/Short%20Term%20Rental%20Permit.pdf" },
    { label: "Watauga Democrat (Blowing Rock short-term rental zoning)", url: "https://www.wataugademocrat.com/main_street/blowing-rock-zones-regulates-short-term-rentals/article_3ac420cd-d75b-5bdf-9436-b339e825d5bc.html" },
    { label: "Grandfather Mountain (Mile High Swinging Bridge)", url: "https://grandfather.com/" },
    { label: "Mast General Store (original store, Valle Crucis)", url: "https://www.mastgeneralstore.com/" },
    { label: "Avery County TDA (6% tax)", url: "https://cms3.revize.com/revize/averycountync/AC%20TDA%20INFO%20SHEET.pdf" },
    { label: "Town of Banner Elk (6% tax form)", url: "https://townofbannerelk.org/wp-content/uploads/2023/09/Occupancy_Tax_Reporting_Form.pdf" },
  ],
};

// ---------------------------------------------------------------------------
// Section 4 — Why location changes the rate (js/destination.js engine).
// "Why it matters here" lines compute from LOCATION. Colours match the area
// colours on the Section 3 map.
// ---------------------------------------------------------------------------
const DEST_LEDE = "Why guests choose each part of the High Country, and why only Blowing Rock clearly earns more. Click an area.";
const DEST_RESEARCHED = "2026-10-07";
const DEST_KIND = {
  br: ["Town, Parkway & resort", "#C0473F"],
  boone: ["College town", "#2E7D6B"],
  corridor: ["US-321 corridor", "#D07A1F"],
  hwy105: ["Toward Grandfather & the ski areas", "#8B5FA7"],
  valley: ["Rural valleys", "#7A5C2E"],
};
function DEST_AREAS() {
  const b = _area(BR), bt = _area(BETWEEN), w = _area(WESTB), n = _area(NORTHB), f = _area(FOSCOE), v = _area(VALLE);
  return [
    {
      id: "blowingrock", name: "Blowing Rock", kind: "br", tags: ["The one area clearly ahead", "Strongest for studios–2BR"],
      zones: [{ lat: 36.1336, lng: -81.6785, r: 900, tip: "Blowing Rock Main St", tipShort: "Main St", dir: "left" }, { lat: 36.1530, lng: -81.6450, r: 1300, tip: "Cabins off US-321", tipShort: "US-321 cabins", dir: "bottom" }],
      why: "A walkable Main Street of shops, inns and restaurants, the Parkway and Moses H. Cone Memorial Park on its doorstep, Chetola Resort, and The Blowing Rock itself. Most of the listings here are cabins just northeast of town, off US-321 and Aho Road.",
      season: "Summer escapes, leaf season and couples' weekends year-round, with Appalachian Ski Mtn a few minutes away in winter.",
      matters: "The only area that clearly earns above its sizes (" + fmtX(b.idx) + " typical), led by studios–1BR (" + fmtX(b.bySize["Studio-1BR"].idx) + ") and 2BRs (" + fmtX(b.bySize["2BR"].idx) + "). Its cabins just outside town earn more than its homes near Main Street, and the lead isn't about hot tubs: its studios–1BR and 2BRs without one still earn well above typical.",
    },
    {
      id: "boone", name: "Boone & App State", kind: "boone", tags: ["Small homes near King Street", "Football & graduation weekends"],
      zones: [{ lat: 36.2120, lng: -81.6930, r: 1700, tip: "Downtown & West Boone", tipShort: "Boone", dir: "top" }, { lat: 36.2400, lng: -81.6800, r: 1700, tip: "North & East Boone", tipShort: "N & E Boone", dir: "top", off: [0, -6] }],
      why: "King Street's restaurants and bars, Appalachian State University and its stadium, and quick access to US-421, US-321 and Hwy 105.",
      season: "Football and Homecoming weekends in the fall, commencement in May and December, parents' visits, and summer.",
      matters: "Small homes close to downtown Boone earn above typical (studios–1BR within 2.5 km of King Street or Blowing Rock's Main Street: " + _x(_ls("Studio-1BR", TOWN)) + ", most of them on the Boone side). Downtown & West Boone, which holds most of the listings near King Street, is about typical overall (" + fmtX(w.idx) + "): its homes near downtown do better than those out along Hwy 105. North & East Boone is the weakest area (" + fmtX(n.idx) + "), through its 3BRs and 4BR+.",
    },
    {
      id: "corridor", name: "Between Boone & Blowing Rock", kind: "corridor", tags: ["Deepest pool of 3BR and 4BR+", "Joint-most Top 10% listings"],
      zones: [{ lat: 36.1800, lng: -81.6580, r: 1600, tip: "Tweetsie & App Ski Mtn", tipShort: "US-321", dir: "right" }],
      why: "Cabins and mountain homes along US-321 and the Parkway, next to Tweetsie Railroad and Appalachian Ski Mtn, between the two towns.",
      season: "Family summers (Tweetsie, the Parkway), leaf season, and ski weekends and holidays at Appalachian Ski Mtn.",
      matters: "About typical for its sizes (" + fmtX(bt.idx) + "), but it holds the most 3BRs (" + bt.bySize["3BR"].n + ") and 4BR+ (" + bt.bySize["4BR+"].n + ") of any area, so, with Valle Crucis, it also has the most Top 10% listings (" + bt.top10N + ").",
    },
    {
      id: "hwy105", name: "Foscoe & Shulls Mill", kind: "hwy105", tags: ["Below typical overall", "Weak for small homes"],
      zones: [{ lat: 36.1640, lng: -81.7350, r: 1800, tip: "Foscoe & Shulls Mill", tipShort: "Foscoe", dir: "bottom" }],
      why: "Foscoe, Shulls Mill and Hound Ears, along Hwy 105 south of Boone toward Banner Elk, Grandfather Mountain, Seven Devils and the Sugar and Beech ski slopes.",
      season: "Ski-season weekends, summer and leaf season.",
      matters: "Below typical for its sizes (" + fmtX(f.idx) + "), with no Top 10% listings; its studios–1BR are weak (" + fmtX(f.bySize["Studio-1BR"].idx) + ", " + f.bySize["Studio-1BR"].n + " homes). Being on the way to the ski slopes doesn't lift rates here.",
    },
    {
      id: "valley", name: "Valle Crucis & Vilas", kind: "valley", tags: ["Rural, lower and quieter", "Design-led retreats"],
      zones: [{ lat: 36.2050, lng: -81.7700, r: 1800, tip: "Valle Crucis & Vilas", tipShort: "Valle Crucis", dir: "top" }],
      why: "Farmland and river valleys around the original Mast General Store and the Watauga River. Its homes sit lower than anywhere else in the market: a median of about 2,900 ft, against about 3,400–3,550 ft in the other areas. Most of the homes in this dataset with Banner Elk addresses are here, not in Banner Elk itself.",
      season: "Leaf season, summer river trips and couples' getaways.",
      matters: "About typical overall (" + fmtX(v.idx) + "). Its 3BRs fill more nights than any other area's (" + v.bySize["3BR"].occ + "%, " + v.bySize["3BR"].n + " homes), though its 4BR+ fill among the fewest (" + v.bySize["4BR+"].occ + "%, few homes). With the corridor it has the most Top 10% listings (" + v.top10N + "). Its studios–1BR look strongest (" + fmtX(v.bySize["Studio-1BR"].idx) + ") only because three of the " + v.bySize["Studio-1BR"].n + " are design-led couples' retreats.",
    },
  ];
}
// Context markers (lat, lng, label, color), from notebooks/landmarks.json.
const DEST_POINTS = [
  [36.21758, -81.68294, "Downtown Boone: King Street", "#2E7D6B"], [36.21149, -81.68557, "App State: Kidd Brewer Stadium", "#2E7D6B"],
  [36.13364, -81.67849, "Blowing Rock Main Street", "#C0473F"], [36.1491, -81.6929, "Moses H. Cone Memorial Park", "#C0473F"],
  [36.11584, -81.65854, "The Blowing Rock", "#C0473F"], [36.17398, -81.66194, "Appalachian Ski Mtn", "#D07A1F"],
  [36.17078, -81.6485, "Tweetsie Railroad", "#D07A1F"], [36.2103, -81.78156, "Original Mast General Store", "#7A5C2E"],
  [36.12776, -81.86916, "Sugar Mountain Resort", "#8B5FA7"], [36.19144, -81.87812, "Beech Mountain Resort", "#8B5FA7"],
  [36.08502, -81.84624, "Grandfather Mountain", "#8B5FA7"],
];
// Month bands: 2025 monthly Blue Ridge Parkway recreation visits (NPS, whole
// Parkway: Oct 2.35M, Jun-Sep 1.68-1.81M, Apr-May and Nov 1.28-1.45M, Dec-Mar
// 0.40-1.11M), the ski season (mid-Nov to late Mar, Explore Boone), Boone
// Chamber reporting on October weekends, and the App State calendar.
const DEST_SEASON = {
  months: ["ski", "ski", "ski", "mid", "mid", "high", "high", "high", "high", "peak", "mid", "ski"],
  marks: ["", "", "", "", "Graduation", "", "July 4th", "", "Football starts", "Leaf peak", "Ski opens", "Christmas"],
  legend: [["peak", "October: leaf season, Homecoming and festivals"], ["high", "Summer escape from the heat, and September"], ["mid", "Spring and November"], ["ski", "Ski season: weekends and holidays, if it stays cold"]],
  caption: "<strong>Two things to price in:</strong> October carries the year (the Chamber notes that the October 17–19, 2025 weekend of App State Homecoming, the Woolly Worm Festival and the Valle Country Fair is what many consider the busiest of the year, with about 125,500 non-resident visits to Watauga County by Placer.ai's estimate), and winter rides on ski weekends and the weather. Bands from 2025 monthly Blue Ridge Parkway visits (whole Parkway), the ski season dates and local event calendars.",
};
const DEST_BRIDGE = [
  ["Blowing Rock is the one address guests clearly pay more for, mostly for the cabins just outside town, a short drive from Main Street, the Parkway and Moses Cone.", "Its small homes, and small homes near downtown Boone, carry the clearest location premium."],
  ["Everywhere else, guests come for the mountains, the Parkway and the ski slopes, all a short drive from any cabin.", "For 3BR and up, the home matters more than the spot: a hot tub (and a view) does more than being close to town."],
];
const DEST_SOURCES = [
  { label: "NPS monthly visits (Blue Ridge Parkway)", url: "https://irma.nps.gov/Stats/SSRSReports/Park%20Specific%20Reports/Recreation%20Visitors%20By%20Month%20(1979%20-%20Last%20Calendar%20Year)?Park=BLRI" },
  { label: "Explore Boone FAQ (leaf and ski timing)", url: "https://www.exploreboone.com/faq/" },
  { label: "Boone Chamber Q4 2025 indicators (October weekends)", url: "https://assets.noviams.com/novi-file-uploads/bacc/Economic_Indicators_Q4_2025__3_.pdf" },
  { label: "App State 2026 football schedule", url: "https://appstatesports.com/news/2026/3/13/2026-app-state-football-schedule-unveiled.aspx" },
  { label: "App State (spring 2026 commencement)", url: "https://today.appstate.edu/2026/05/12/commencement" },
  { label: "App State commencement dates (fall 2026: Dec. 11)", url: "https://www.appstate.edu/commencement/" },
  { label: "Tweetsie Railroad 2026 fact sheet", url: "https://tweetsie.com/assets/audio/2026-Tweetsie-Railroad-Fact-Sheet.pdf" },
  { label: "Appalachian Ski Mtn stats", url: "https://appskimtn.com/mountain-stats" },
  { label: "NPS road status (Blue Ridge Parkway)", url: "https://www.nps.gov/blri/planyourvisit/roadclosures.htm" },
];
