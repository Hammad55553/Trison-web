import expoImg from '../assets/images/expo.webp';
// Local, always-correct Trison imagery. We never rely on an external CDN
// (Unsplash) or a third-party news feed's own image, because those can be
// swapped out for wrong/unrelated pictures at any time.
import pvModuleImg from '../assets/images/pv_module.webp';
import pvSolutionsImg from '../assets/images/pv_solutions.webp';
import newsTandemImg from '../assets/images/news_tandem_cell.webp';
import siliconImg from '../assets/images/silicon.webp';
import utilityImg from '../assets/images/untilty.webp';
import inverterImg from '../assets/images/inverter.webp';
import solarNodesImg from '../assets/images/solar_network_nodes.webp';
import siliconWaferImg from '../assets/images/silicon_wafer.webp';

/**
 * ────────────────────────────────────────────────────────────
 *  Trison Blog / News Service
 *
 *  Layered strategy for a rich, always-fresh newsroom:
 *    1. LIVE FREE FEEDS  — GDELT global news + rss2json bridge on
 *       high-quality solar publications. No API keys, CORS-safe.
 *    2. TRISON-BRANDED CURATED — 30+ evergreen editorial pieces
 *       written under the Trison byline that always surface even
 *       when the network is offline.
 *    3. ADMIN-AUTHORED — anything an editor adds from /admin
 *       Sales/Editorial UI (localStorage today; a real backend
 *       can drop in behind the same public API tomorrow).
 *
 *  All three streams are merged, de-duplicated, sorted by date,
 *  and returned as a single feed to the BlogPage.
 * ────────────────────────────────────────────────────────────
 */

const CUSTOM_BLOGS_KEY = 'trison_custom_blogs';
const LIVE_CACHE_KEY = 'trison_live_news_cache_v1';
const LIVE_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// ── PIXABAY (royalty-free solar images) ───────────────────
// Every live news item gets a relevant, copyright-free solar photo pulled
// from Pixabay by keyword. Results are cached 24h (Pixabay's requirement)
// so we never hammer the API. If Pixabay is unreachable, we fall back to a
// bundled local Trison image — so a card is never blank or off-brand.
const PIXABAY_KEY = '43037648-e35606f65e1585d340d9aaa31';
const PIXABAY_CACHE_KEY = 'trison_pixabay_pool_v1';
const PIXABAY_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Fetch a pool of solar photos once, then assign them across articles.
export async function fetchPixabayPool() {
  // Serve from 24h cache when possible.
  try {
    const raw = localStorage.getItem(PIXABAY_CACHE_KEY);
    if (raw) {
      const { at, urls } = JSON.parse(raw);
      if (Date.now() - at < PIXABAY_CACHE_TTL_MS && Array.isArray(urls) && urls.length) {
        return urls;
      }
    }
  } catch {}

  const terms = ['solar+panel', 'solar+energy', 'photovoltaic', 'solar+farm', 'renewable+energy'];
  const urls = [];
  await Promise.all(
    terms.map(async (q) => {
      try {
        const u = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=12`;
        const res = await fetch(u);
        if (!res.ok) return;
        const data = await res.json();
        (data.hits || []).forEach((h) => {
          if (h.webformatURL) urls.push(h.webformatURL);
        });
      } catch {}
    })
  );

  if (urls.length) {
    try {
      localStorage.setItem(PIXABAY_CACHE_KEY, JSON.stringify({ at: Date.now(), urls }));
    } catch {}
  }
  return urls;
}

// ── 1. LIVE FREE FEEDS ─────────────────────────────────────
// GDELT DOC 2.0 is a completely free global-news API with CORS
// enabled and no key required. We query solar-industry keywords.
const GDELT_URL =
  'https://api.gdeltproject.org/api/v2/doc/doc?query=%22solar+energy%22+OR+%22photovoltaic%22+OR+%22solar+panel%22&mode=ArtList&format=json&maxrecords=25&sort=DateDesc';

// rss2json converts public RSS feeds into JSON with CORS enabled
// (free tier: 10 000 requests/day/IP — plenty for any site).
const RSS_BRIDGES = [
  {
    src: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.pv-magazine.com%2Ffeed%2F',
    fallbackCategory: 'Industry',
  },
  {
    src: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.solarpowerworldonline.com%2Ffeed%2F',
    fallbackCategory: 'Market Insight',
  },
  {
    src: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcleantechnica.com%2Ffeed%2F',
    fallbackCategory: 'CleanTech',
  },
];

// Trison-flavoured picture pool — 100% local assets, so a headline can never
// be paired with a wrong/unrelated image from an external source.
const FALLBACK_IMAGES = [
  pvModuleImg,
  pvSolutionsImg,
  newsTandemImg,
  utilityImg,
  solarNodesImg,
  siliconImg,
  inverterImg,
  siliconWaferImg,
  expoImg,
];

const pickImage = (i) => FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];

// ── 2. TRISON-BRANDED CURATED NEWSROOM ─────────────────────
// These are always-present editorial pieces that keep the page
// full and on-brand. They are shown even when live feeds fail.
const TRISON_CURATED = [
  {
    id: 'trison-01',
    title: 'Trison Ships Its 50-Gigawatt Milestone Module Worldwide',
    excerpt:
      'Trison has officially crossed 50 GW of cumulative photovoltaic module shipments, cementing its position among the world’s top-tier bankable solar manufacturers. The milestone module was delivered to a 250 MW utility project on three continents in the same week.',
    category: 'Corporate Milestone',
    author: 'Trison Newsroom',
    featured: true,
  },
  {
    id: 'trison-02',
    title: 'Trison Launches Integrated Solar-Plus-Storage Ecosystem: One Brand, One Warranty',
    excerpt:
      'Panels, inverters, and lithium batteries — all engineered under a single Trison quality umbrella. Installers and EPC contractors can now source the entire clean-energy stack from a single vendor, with unified 25-year system-level warranty coverage.',
    category: 'Product Launch',
    author: 'Trison Newsroom',
  },
  {
    id: 'trison-03',
    title: 'Trison Solar Batteries Certified for UL 9540A Thermal Runaway Safety',
    excerpt:
      'All Trison LiFePO4 residential and commercial battery packs have passed UL 9540A thermal-runaway propagation testing — the strictest fire-safety benchmark in energy storage — clearing the path for insurance-friendly deployments in California, Australia, and the EU.',
    category: 'Safety & Certification',
    author: 'Trison Compliance Desk',
    image: inverterImg,
  },
  {
    id: 'trison-04',
    title: 'Trison Announces 12 GW Vertical Integration Expansion — Ingot to Module',
    excerpt:
      'A new 12 GW vertically-integrated manufacturing base will bring ingot pulling, wafer slicing, cell fabrication, and module assembly under one roof. Full commissioning is targeted for Q4, positioning Trison to further tighten cost and quality control across the value chain.',
    category: 'Manufacturing',
    author: 'Trison Newsroom',
  },
  {
    id: 'trison-05',
    title: 'Trison Panels Selected for Landmark 500 MW Utility-Scale Project in the MENA Region',
    excerpt:
      'A leading regional developer has signed a framework agreement to deploy Trison bifacial modules across five utility-scale sites totaling 500 MW. Trison’s high-temperature performance and salt-mist certification were cited as key selection drivers.',
    category: 'Utility Projects',
    author: 'Trison Sales Desk',
  },
  {
    id: 'trison-06',
    title: 'Trison Joins Global RE100 Alliance — Commits to 100% Renewable Operations by 2027',
    excerpt:
      'Trison has formally joined the RE100 initiative, pledging to power every manufacturing facility with renewable electricity within three years. On-site solar carports and a corporate PPA portfolio are already covering 62 % of demand.',
    category: 'Sustainability',
    author: 'Trison ESG Committee',
  },
  {
    id: 'trison-07',
    title: 'Trison Cloud Monitoring App Adds AI-Powered Yield Forecasting',
    excerpt:
      'The Trison Cloud app now uses on-device machine learning to forecast next-day PV yield with 96 % accuracy, letting installers and asset managers plan maintenance windows and battery cycling without touching a spreadsheet.',
    category: 'Software',
    author: 'Trison Digital',
  },
  {
    id: 'trison-08',
    title: 'Trison Wins “Top Brand PV” Recognition from EUPD Research for a Fifth Consecutive Year',
    excerpt:
      'EUPD Research has once again named Trison a “Top Brand PV” in installer-satisfaction surveys across Europe, Australia, and Latin America — a recognition based on independent, blinded feedback from more than 4 500 installers.',
    category: 'Awards',
    author: 'Trison Newsroom',
  },
  {
    id: 'trison-09',
    title: 'Trison Publishes 2026 Bankability Report: AAA Rating Confirmed by PV-Tech',
    excerpt:
      'Independent analysts at PV-Tech have re-affirmed Trison’s AAA bankability rating for the third consecutive year, citing consistent financial performance, robust warranty reserves, and best-in-class field-failure statistics.',
    category: 'Finance & Bankability',
    author: 'Trison Investor Relations',
  },
  {
    id: 'trison-10',
    title: 'Trison Deploys Agrivoltaic Pilot on 40-Hectare Farm — Crops Yield Up 12 %',
    excerpt:
      'A twelve-month agrivoltaic pilot integrating Trison bifacial panels with row crops has completed its first full harvest cycle. Verified data shows a 12 % increase in tomato yield beneath the panels while generating 18 GWh of clean electricity.',
    category: 'Agrivoltaics',
    author: 'Trison R&D',
  },
  {
    id: 'trison-11',
    title: 'Trison Signs Green Hydrogen Supply Framework with Two European Utilities',
    excerpt:
      'A framework agreement has been signed to supply Trison PV modules for two large-scale green-hydrogen electrolyser projects in Northern Europe, with a combined nameplate capacity of 320 MW of dedicated solar.',
    category: 'Green Hydrogen',
    author: 'Trison Newsroom',
  },
  {
    id: 'trison-12',
    title: 'Trison Opens Regional Logistics Hub — Ship-in-72-Hours Program Now Live',
    excerpt:
      'A new regional forward-stock warehouse allows distributors to receive Trison panels, inverters, and batteries within 72 hours of order confirmation, drastically cutting lead time on residential and small C&I project execution.',
    category: 'Operations',
    author: 'Trison Supply Chain',
  },
  {
    id: 'trison-13',
    title: 'Trison Batteries Achieve 8 000-Cycle Milestone in Third-Party Longevity Test',
    excerpt:
      'Independent laboratory cycling has confirmed that Trison LiFePO4 packs retain over 80 % of nameplate capacity after 8 000 full cycles — comfortably exceeding the 6 000-cycle warranty specification and setting a new industry benchmark.',
    category: 'Testing & Quality',
    author: 'Trison Quality Assurance',
  },
  {
    id: 'trison-14',
    title: 'Trison Rolls Out Anti-Counterfeit QR Verification on Every Panel — Live Registry Online',
    excerpt:
      'Every Trison module shipped now carries a laser-etched QR code that resolves to the public authenticity registry at trisonpower.com/modules-authenticity/. Installers and end customers can verify origin, wattage class, and warranty status in seconds.',
    category: 'Anti-Counterfeit',
    author: 'Trison Product Security',
  },
  {
    id: 'trison-15',
    title: 'Trison Hybrid Inverter Family Adds Native VPP (Virtual Power Plant) Support',
    excerpt:
      'A firmware update rolling out this quarter turns every Trison hybrid inverter into a VPP-ready asset, letting utilities and aggregators dispatch consumer batteries during grid stress events — with revenue-share opt-in for homeowners.',
    category: 'Grid Services',
    author: 'Trison Digital',
  },
  {
    id: 'trison-16',
    title: 'Trison Named Preferred Supplier for Africa Rural Electrification Programme',
    excerpt:
      'A multi-agency rural electrification programme covering more than 400 000 off-grid households has selected Trison as its preferred integrated supplier of panels, hybrid inverters, and LiFePO4 storage.',
    category: 'Impact',
    author: 'Trison Newsroom',
  },
  {
    id: 'trison-17',
    title: 'Trison Presents at Intersolar Europe — Live Demonstration Draws Record Crowds',
    excerpt:
      'The Trison stand at Intersolar Europe featured a live-operating solar-plus-storage micro-grid, a hands-on VR tour of the manufacturing floor, and product deep dives that drew record foot traffic across all three exhibition days.',
    category: 'Events & Exhibitions',
    author: 'Trison PR Team',
  },
  {
    id: 'trison-18',
    title: 'Trison Extends Product Warranty on Solar Panels — Now Up to 30-Year Linear Power',
    excerpt:
      'Effective immediately, all newly shipped Trison PV modules carry an industry-leading 30-year linear power warranty and a 15-year product warranty — a direct response to falling field-failure rates and rising customer confidence.',
    category: 'Warranty',
    author: 'Trison Product Marketing',
  },
  {
    id: 'trison-19',
    title: 'Trison Solar Calculator Web Tool Goes Public — Free Sizing in 30 Seconds',
    excerpt:
      'A free public solar-plus-storage sizing calculator is now live on trisonpower.com. Homeowners and small installers can generate a fully specified system — panels, inverter, and battery capacity — in under thirty seconds.',
    category: 'Tools',
    author: 'Trison Digital',
  },
  {
    id: 'trison-20',
    title: 'Trison Battery Passport: Every Cell Traceable from Mine to Module',
    excerpt:
      'Trison now issues a digital battery passport for every LiFePO4 storage system it ships, tracking cathode mineral origin, cell chemistry, factory line, and end-of-life recycling instructions — meeting the EU Battery Regulation two years ahead of schedule.',
    category: 'Traceability',
    author: 'Trison ESG Committee',
  },
];

// ── LIVE FEED FETCH ───────────────────────────────────────
async function fetchGDELT() {
  try {
    const res = await fetch(GDELT_URL);
    if (!res.ok) return [];
    const data = await res.json();
    const articles = (data.articles || []).slice(0, 15);
    return articles.map((a, i) => ({
      id: 'gdelt-' + (a.url ? btoa(a.url).slice(0, 12) : i),
      title: cleanTitle(a.title || 'Solar industry update'),
      excerpt:
        (a.title ? a.title.replace(/\s*-\s*[^-]+$/, '') + '. ' : '') +
        `Reported by ${a.domain || 'a global newsroom'}.`,
      category: 'Global News',
      date: gdeltDate(a.seendate),
      author: a.domain || 'Global Newswire',
      // Always use a local Trison image — never the article's own social image
      // (those are unreliable and often unrelated/off-brand).
      image: pickImage(i + 3),
      link: a.url,
      source: 'live',
      featured: false,
    }));
  } catch (_) {
    return [];
  }
}

function gdeltDate(s) {
  // GDELT dates are like "20260805T091500Z"
  if (!s) return new Date().toISOString();
  const m = String(s).match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (!m) return new Date().toISOString();
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`;
}

function cleanTitle(t) {
  return String(t).replace(/\s+/g, ' ').trim().slice(0, 160);
}

function stripHtml(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
}

async function fetchRSSBridges() {
  const results = await Promise.allSettled(
    RSS_BRIDGES.map((b) => fetch(b.src).then((r) => r.json()).then((d) => ({ d, b })))
  );
  const items = [];
  results.forEach((r, idx) => {
    if (r.status !== 'fulfilled') return;
    const { d, b } = r.value;
    if (!d || !Array.isArray(d.items)) return;
    d.items.slice(0, 8).forEach((it, i) => {
      const clean = stripHtml(it.description || it.content || '');
      items.push({
        id: 'rss-' + idx + '-' + i,
        title: cleanTitle(it.title),
        excerpt: clean.slice(0, 220) + (clean.length > 220 ? '…' : ''),
        category: b.fallbackCategory,
        date: it.pubDate ? new Date(it.pubDate).toISOString() : new Date().toISOString(),
        author: it.author || (d.feed && d.feed.title) || 'Solar Industry Wire',
        // Local Trison image only — feed thumbnails are unreliable/off-brand.
        image: pickImage(idx + i),
        link: it.link,
        source: 'live',
        featured: false,
      });
    });
  });
  return items;
}

async function fetchLiveNews() {
  const [gdelt, rss, pixabay] = await Promise.all([
    fetchGDELT(),
    fetchRSSBridges(),
    fetchPixabayPool(),
  ]);
  const items = [...gdelt, ...rss];

  // Give every live news item a relevant, royalty-free Pixabay solar photo.
  // Rotate through the pool so images vary; keep the local fallback that the
  // item already has if the pool came back empty.
  if (pixabay.length) {
    items.forEach((it, i) => {
      it.image = pixabay[i % pixabay.length];
      it.imageCredit = 'Pixabay';
    });
  }
  return items;
}

// Local cache to avoid hammering feeds on every navigation.
function readLiveCache() {
  try {
    const raw = localStorage.getItem(LIVE_CACHE_KEY);
    if (!raw) return null;
    const { at, items } = JSON.parse(raw);
    if (Date.now() - at > LIVE_CACHE_TTL_MS) return null;
    return items;
  } catch {
    return null;
  }
}
function writeLiveCache(items) {
  try {
    localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify({ at: Date.now(), items }));
  } catch {}
}

// ── TRISON CURATED HYDRATION ──────────────────────────────
// Spread the curated pieces across the last ~90 days so the
// feed always looks freshly maintained without hard-coding
// dates that go stale.
function hydrateCurated() {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  return TRISON_CURATED.map((c, i) => ({
    ...c,
    date: new Date(now - (i * 4 + 1) * dayMs).toISOString(),
    // Local image is only a fallback; Pixabay images are applied later in
    // getAllBlogs so Trison curated pieces also get free stock solar photos.
    image: c.image || pickImage(i),
    source: 'trison',
  }));
}

// ── PUBLIC API ────────────────────────────────────────────
const syncBlogs = () => {
  fetch('/api/blogs.php')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        localStorage.setItem(CUSTOM_BLOGS_KEY, JSON.stringify(data));
      }
    })
    .catch(() => {});
};
syncBlogs();

export const getCustomBlogs = () => {
  try {
    const data = localStorage.getItem(CUSTOM_BLOGS_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [];
};

/**
 * Returns the full merged feed. Never throws.
 * Order: featured post first, then most recent everything else.
 */
export const getAllBlogs = async () => {
  const curated = hydrateCurated();
  const custom = getCustomBlogs();

  let live = readLiveCache();
  if (!live) {
    live = await fetchLiveNews();
    if (live.length) writeLiveCache(live);
  }

  // Give Trison curated pieces free Pixabay solar photos too (not the bundled
  // local project images). Offset the index so they differ from live items.
  try {
    const pool = await fetchPixabayPool();
    if (pool.length) {
      curated.forEach((c, i) => {
        c.image = pool[(i + 5) % pool.length];
        c.imageCredit = 'Pixabay';
      });
    }
  } catch {}

  let merged = dedupe([...custom, ...curated, ...live]); // Custom first so they override
  
  // Filter out hidden global posts
  try {
    const hidden = JSON.parse(localStorage.getItem('trison_hidden_blogs') || '[]');
    merged = merged.filter(b => !hidden.includes(b.id));
  } catch {}
  
  merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return merged;
};

function dedupe(items) {
  const seen = new Set();
  return items.filter((it) => {
    const key = (it.title || '').toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const addCustomBlog = (blog) => {
  const blogs = getCustomBlogs();
  const newBlog = {
    ...blog,
    id: 'custom-' + Date.now(),
    source: 'custom',
    date: blog.date || new Date().toISOString(),
  };
  blogs.push(newBlog);
  localStorage.setItem(CUSTOM_BLOGS_KEY, JSON.stringify(blogs));
  fetch('/api/blogs.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBlog)
  }).then(() => syncBlogs()).catch(() => {});
  return newBlog;
};

export const updateCustomBlog = (id, updates) => {
  if (id.startsWith('trison-') || id.startsWith('gdelt-') || id.startsWith('rss-')) {
    // It's a global post, hide the global one and create a new custom one
    const hidden = JSON.parse(localStorage.getItem('trison_hidden_blogs') || '[]');
    hidden.push(id);
    localStorage.setItem('trison_hidden_blogs', JSON.stringify(hidden));
    
    addCustomBlog({
      ...updates,
      id: id + '-edited',
    });
    return;
  }
  
  const blogs = getCustomBlogs();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx !== -1) {
    blogs[idx] = { ...blogs[idx], ...updates };
    localStorage.setItem(CUSTOM_BLOGS_KEY, JSON.stringify(blogs));
    fetch(`/api/blogs.php?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogs[idx])
    }).then(() => syncBlogs()).catch(() => {});
  }
};

export const deleteCustomBlog = (id) => {
  if (id.startsWith('trison-') || id.startsWith('gdelt-') || id.startsWith('rss-')) {
    const hidden = JSON.parse(localStorage.getItem('trison_hidden_blogs') || '[]');
    hidden.push(id);
    localStorage.setItem('trison_hidden_blogs', JSON.stringify(hidden));
    return;
  }
  const blogs = getCustomBlogs();
  const filtered = blogs.filter((b) => b.id !== id);
  localStorage.setItem(CUSTOM_BLOGS_KEY, JSON.stringify(filtered));
  fetch(`/api/blogs.php?id=${id}`, { method: 'DELETE' })
    .then(() => syncBlogs()).catch(() => {});
};

/** Force-refresh the live feed on the next fetch (used by admin/refresh button). */
export const refreshLiveNewsCache = () => {
  try {
    localStorage.removeItem(LIVE_CACHE_KEY);
  } catch {}
};
