/* =============================================
   PSBP SHARED JS
   events.js — Google Sheets integration + nav
   ============================================= */

// ---- NAV HAMBURGER ----
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Mark active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
});

// ---- GOOGLE SHEETS EVENTS LOADER ----
// 
// HOW TO SET UP YOUR SHEET:
// 1. Create a Google Sheet with these exact column headers in Row 1:
//    Date | EndDate | Title | Description | Time | ClosedToPublic | Tag
// 2. File → Share → "Anyone with the link can view"
// 3. Publish to web: File → Share → Publish to web → Sheet1 → CSV → Publish
// 4. Copy that CSV URL and paste it as SHEET_CSV_URL below
// 5. Replace the placeholder below with your real URL
//
// SAMPLE ROW:
//   2024-12-11 | 2024-12-15 | Winter Nights Under the Lights | Holiday lights display, food trucks, live music | 6–9pm | yes | Holiday
//
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvwi51jlrvUaLBrRwSXCK2EeEd1WWgmWyEGnO6uik87-s-RgMqqhozaIveYAGjdLUq1-q6YueOW5uD/pub?output=csv';

// Demo data shown when no real sheet is connected
const DEMO_EVENTS = [
  {
    date: '2025-03-02',
    endDate: '',
    title: 'Spring Plants & More Sale',
    description: 'Plants, artisans, food, and fun. Our volunteer-grown nursery stock plus vendors from across the region. Free admission.',
    time: '10am – 3pm',
    closedToPublic: 'no',
    tag: 'Sale'
  },
  {
    date: '2025-04-12',
    endDate: '',
    title: 'Night for Nature',
    description: 'An evening in the gardens with live music, local Florida food, and libations. Silent auction. Our signature fundraiser — come meet the volunteers who make this park run.',
    time: '6 – 10pm',
    closedToPublic: 'yes',
    tag: 'Fundraiser'
  },
  {
    date: '2025-10-19',
    endDate: '',
    title: 'Fall Plants & More Sale',
    description: 'Same great energy as the spring sale. Bring a wagon. You will need it.',
    time: '10am – 3pm',
    closedToPublic: 'no',
    tag: 'Sale'
  },
  {
    date: '2025-11-15',
    endDate: '',
    title: 'CORNament — Cornhole Tournament',
    description: 'Play cornhole or just spectate. All skill levels. Proceeds support park operations. Register a team or show up and cheer.',
    time: '12 – 4pm',
    closedToPublic: 'no',
    tag: 'Community'
  },
  {
    date: '2025-12-10',
    endDate: '2025-12-15',
    title: 'Winter Nights Under the Lights',
    description: 'Acres of holiday lights, food trucks, Santa, live music. One of Bradenton\'s most beloved holiday traditions. Happens rain or shine.',
    time: '6 – 9pm',
    closedToPublic: 'yes',
    tag: 'Holiday'
  }
];

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g,''));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g,''));
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] || '');
    return obj;
  });
}

function formatDate(dateStr, endDateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  if (endDateStr) {
    const e = new Date(endDateStr + 'T12:00:00');
    // Same month
    if (d.getMonth() === e.getMonth()) {
      return `${d.toLocaleString('en-US',{month:'short'})} ${d.getDate()}–${e.getDate()}, ${d.getFullYear()}`;
    }
    return `${d.toLocaleString('en-US',{month:'short'})} ${d.getDate()} – ${e.toLocaleString('en-US',{month:'short'})} ${e.getDate()}, ${d.getFullYear()}`;
  }
  return d.toLocaleDateString('en-US', opts);
}

function isPast(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr + 'T12:00:00');
  return d < today;
}

function tagColor(tag) {
  const map = {
    'Holiday': '#c8440a',
    'Fundraiser': '#2d5016',
    'Sale': '#4a7c2f',
    'Community': '#8b6914',
    'Volunteer': '#1a6b8a',
    'Education': '#5a3d8a'
  };
  return map[tag] || '#4a7c2f';
}

function renderEvents(events, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = events.filter(e => !isPast(e.endDate || e.date));
  const past = events.filter(e => isPast(e.endDate || e.date));

  if (upcoming.length === 0 && past.length === 0) {
    container.innerHTML = '<p style="color:#777">No events found. Check back soon!</p>';
    return;
  }

  let html = '';

  if (upcoming.length > 0) {
    html += '<div class="events-section">';
    upcoming.forEach(ev => {
      const closed = ev.closedtopublic === 'yes' || ev.closedToPublic === 'yes';
      html += `
      <div class="event-card">
        <div class="event-date-col">
          <span class="event-date">${formatDate(ev.date, ev.enddate || ev.endDate)}</span>
          ${ev.time ? `<span class="event-time">${ev.time}</span>` : ''}
        </div>
        <div class="event-body">
          <div class="event-header">
            <h3 class="event-title">${ev.title}</h3>
            ${ev.tag ? `<span class="event-tag" style="background:${tagColor(ev.tag)}">${ev.tag}</span>` : ''}
          </div>
          <p class="event-desc">${ev.description}</p>
          ${closed ? '<p class="event-closed">🔴 Park closed to general visitors this day</p>' : ''}
        </div>
      </div>`;
    });
    html += '</div>';
  }

  if (past.length > 0) {
    html += `
    <details class="past-events-toggle">
      <summary>Past events (${past.length})</summary>
      <div class="events-section past">`;
    past.reverse().forEach(ev => {
      html += `
      <div class="event-card past">
        <div class="event-date-col">
          <span class="event-date">${formatDate(ev.date, ev.enddate || ev.endDate)}</span>
        </div>
        <div class="event-body">
          <h3 class="event-title">${ev.title}</h3>
          <p class="event-desc">${ev.description}</p>
        </div>
      </div>`;
    });
    html += '</div></details>';
  }

  container.innerHTML = html;
}

async function loadEvents(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (SHEET_CSV_URL === 'YOUR_GOOGLE_SHEET_CSV_URL_HERE') {
    // Use demo data
    container.innerHTML = '<p class="demo-notice">📋 Demo mode — showing sample events. <a href="setup.html">Connect your Google Sheet</a> to show real events.</p>';
    renderEvents(DEMO_EVENTS, containerId);
    return;
  }

  container.innerHTML = '<p class="loading">Loading events...</p>';
  try {
    const resp = await fetch(SHEET_CSV_URL);
    if (!resp.ok) throw new Error('Could not load sheet');
    const text = await resp.text();
    const events = parseCSV(text);
    renderEvents(events, containerId);
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p style="color:#c00">Could not load events right now. <a href="mailto:palmasolabp@aol.com">Contact us</a> for upcoming dates.</p>';
  }
}

// ---- iNATURALIST LOADER ----
// Loads recent observations from the PSBP iNaturalist project
const INAT_PROJECT = 'palma-sola-botanical-park'; // update if slug differs

async function loadINaturalist(containerId, limit = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<p class="loading">Loading from iNaturalist...</p>';
  try {
    const url = `https://api.inaturalist.org/v1/observations?project_id=${INAT_PROJECT}&order=desc&order_by=created_at&per_page=${limit}&photos=true&quality_grade=research`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('iNat API error');
    const data = await resp.json();

    if (!data.results || data.results.length === 0) {
      container.innerHTML = '<p>No observations loaded yet. <a href="https://www.inaturalist.org/projects/' + INAT_PROJECT + '" target="_blank">Be the first to add one!</a></p>';
      return;
    }

    let html = '<div class="inat-grid">';
    data.results.forEach(obs => {
      const photo = obs.photos && obs.photos[0] ? obs.photos[0].url.replace('square','medium') : null;
      const name = obs.taxon ? obs.taxon.preferred_common_name || obs.taxon.name : 'Unknown species';
      const sciName = obs.taxon ? obs.taxon.name : '';
      const date = obs.observed_on ? new Date(obs.observed_on + 'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '';
      const link = `https://www.inaturalist.org/observations/${obs.id}`;
      html += `
      <a class="inat-card" href="${link}" target="_blank" rel="noopener">
        ${photo ? `<img src="${photo}" alt="${name}" loading="lazy">` : '<div class="inat-no-photo">No photo</div>'}
        <div class="inat-info">
          <span class="inat-common">${name}</span>
          <span class="inat-sci">${sciName}</span>
          <span class="inat-date">${date}</span>
        </div>
      </a>`;
    });
    html += '</div>';
    html += `<p class="inat-link"><a href="https://www.inaturalist.org/projects/${INAT_PROJECT}" target="_blank" rel="noopener">See all observations on iNaturalist →</a></p>`;
    container.innerHTML = html;
  } catch(err) {
    console.error(err);
    container.innerHTML = `<p>Couldn't load iNaturalist data right now. <a href="https://www.inaturalist.org/projects/${INAT_PROJECT}" target="_blank">View directly on iNaturalist</a>.</p>`;
  }
}

// ---- iNATURALIST COUNTER WIDGET ----
// Loads total observation count, species count, and most recent photo.
// Used in the homepage sidebar and plants.html.
// Call: loadINatCounter('container-id')
//
async function loadINatCounter(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    // Fetch summary stats for the project
    const statsUrl = `https://api.inaturalist.org/v1/observations?project_id=${INAT_PROJECT}&per_page=1&order=desc&order_by=created_at`;
    const statsResp = await fetch(statsUrl);
    if (!statsResp.ok) throw new Error('iNat stats error');
    const statsData = await statsResp.json();

    const totalObs = statsData.total_results || 0;

    // Fetch species count separately
    const speciesUrl = `https://api.inaturalist.org/v1/observations/species_counts?project_id=${INAT_PROJECT}`;
    const speciesResp = await fetch(speciesUrl);
    const speciesData = speciesResp.ok ? await speciesResp.json() : null;
    const totalSpecies = speciesData ? speciesData.total_results : null;

    // Most recent observation with a photo
    const recentUrl = `https://api.inaturalist.org/v1/observations?project_id=${INAT_PROJECT}&per_page=1&order=desc&order_by=created_at&photos=true`;
    const recentResp = await fetch(recentUrl);
    const recentData = recentResp.ok ? await recentResp.json() : null;
    const latest = recentData && recentData.results && recentData.results[0];

    const latestPhoto = latest && latest.photos && latest.photos[0]
      ? latest.photos[0].url.replace('square', 'small')
      : null;
    const latestName = latest && latest.taxon
      ? (latest.taxon.preferred_common_name || latest.taxon.name)
      : 'Unknown species';
    const latestDate = latest && latest.observed_on
      ? new Date(latest.observed_on + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';
    const latestLink = latest ? `https://www.inaturalist.org/observations/${latest.id}` : `https://www.inaturalist.org/projects/${INAT_PROJECT}`;

    let html = `
    <div class="inat-counter">
      <div class="counter-stats">
        <div class="counter-stat">
          <span class="counter-num">${totalObs.toLocaleString()}</span>
          <span class="counter-label">Observations</span>
        </div>
        ${totalSpecies !== null ? `
        <div class="counter-stat">
          <span class="counter-num">${totalSpecies.toLocaleString()}</span>
          <span class="counter-label">Species</span>
        </div>` : ''}
      </div>
      ${latestPhoto ? `
      <div class="counter-latest">
        <span class="counter-latest-label">Most recent sighting</span>
        <a href="${latestLink}" target="_blank" rel="noopener" class="counter-photo-link">
          <img src="${latestPhoto}" alt="${latestName}" class="counter-photo">
          <span class="counter-photo-name">${latestName}</span>
          ${latestDate ? `<span class="counter-photo-date">${latestDate}</span>` : ''}
        </a>
      </div>` : ''}
      <a href="https://www.inaturalist.org/projects/${INAT_PROJECT}" target="_blank" rel="noopener" class="counter-cta">Add your observation →</a>
    </div>`;

    container.innerHTML = html;
  } catch(err) {
    console.error(err);
    container.innerHTML = `<p style="font-size:0.85rem;color:#999">Couldn't load live data. <a href="https://www.inaturalist.org/projects/${INAT_PROJECT}" target="_blank">View on iNaturalist</a>.</p>`;
  }
}
