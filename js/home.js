const homeMidnightForm = document.querySelector("#midnightForm");
const homeMidnightTime = document.querySelector("#midnightTime");
const homeMidnightMood = document.querySelector("#midnightMood");
const homeMidnightWeather = document.querySelector("#midnightWeather");
const homeMidnightNeed = document.querySelector("#midnightNeed");
const homeMidnightIntensity = document.querySelector("#midnightIntensity");
const homeMidnightIntensityLabel = document.querySelector("#midnightIntensityLabel");
const homeMidnightSubmit = document.querySelector("#midnightSubmit");
const homeMidnightFreeText = document.querySelector("#midnightFreeText");
const homeEmotionWaveform = document.querySelector("#emotionWaveform");
const homeMidnightResult = document.querySelector("#midnightResult");
const homeMidnightCount = document.querySelector("#homeMidnightCount");
const homeMidnightStack = document.querySelector("#homeMidnightStack");
const homeMidnightMoodChips = document.querySelector(".midnight-mood-chips");
const homeProjectorDescription = document.querySelector("#homeProjectorDescription");
const homeProjectorMeta = document.querySelector("#homeProjectorMeta");
const homeProjectorImage = document.querySelector("#homeProjectorImage");
const homeFeaturedVhsImage = document.querySelector("#homeFeaturedVhsImage");
const homeFeaturedVhsTitle = document.querySelector("#homeFeaturedVhsTitle");
const homeProjectorInspect = document.querySelector("#homeProjectorInspect");
const homeProjectorBag = document.querySelector("#homeProjectorBag");
const homeProjectorNext = document.querySelector("#homeProjectorNext");
const homeProjectorStatus = document.querySelector("#homeProjectorStatus");
const homeProjectorRuntime = document.querySelector("#homeProjectorRuntime");
const homeProjectorProgress = document.querySelector("#homeProjectorProgress");
const homeProjectorIntensity = document.querySelector("#homeProjectorIntensity");
const homeProjectorRenters = document.querySelector("#homeProjectorRenters");
const homeProjectorScene = document.querySelector("#homeProjectorScene");
const homeProjectorClerkNote = document.querySelector("#homeProjectorClerkNote");
const screeningNowTitle = document.querySelector("#screeningNowTitle");
const screeningMood = document.querySelector("#screeningMood");
const screeningRuntime = document.querySelector("#screeningRuntime");
const screeningRenters = document.querySelector("#screeningRenters");
const fridayShelfPrev = document.querySelector("#fridayShelfPrev");
const fridayShelfNext = document.querySelector("#fridayShelfNext");

let homeFilms = [];
let homeNightBag = [];
let currentHomeMidnightFilm = null;
let homeProjectorIndex = 0;
let homeFilmsReady = Promise.resolve();
let livePreviewTimer = null;

function initializeHomeLateNightMode() {
  const hour = new Date().getHours();
  document.body.classList.toggle("late-night-mode", hour >= 22 || hour < 6);
}

function escapeHomeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getHomeAisleName(genre) {
  const aisleMap = {
    Action: "Staff Picks Wall",
    Drama: "Indie Shelf",
    Horror: "Horror Vault",
    "Sci-Fi": "Sci-Fi Corridor",
    Animation: "Friday Night Favorites",
  };

  return aisleMap[genre] || `${genre} Aisle`;
}

function getHomeRuntime(film) {
  return film.runtime ? `${film.runtime} min` : `${105 + film.id * 4} min`;
}

function getHomeRuntimeLong(film) {
  const runtime = film.runtime || 112;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function getHomeStaffNote(film) {
  const notes = {
    Action: ["Josh", "Friday night essential"],
    Drama: ["Maya", "Employee favorite"],
    Horror: ["Luis", "Midnight dare"],
    "Sci-Fi": ["Sam", "Cult classic"],
    Romance: ["Nina", "Date night pick"],
    Animation: ["Chris", "Weekend crowd-pleaser"],
  };

  const [employee, tag] = notes[film.genre] || ["Clerk", "Staff pick"];
  return { employee, tag };
}

function getHomeProjectorSession(film, index) {
  const runtime = film.runtime || 112;
  const elapsed = 12 + ((film.id * 7 + index * 9) % Math.max(24, Math.min(82, runtime - 14)));
  const progress = Math.min(88, Math.max(12, Math.round((elapsed / runtime) * 100)));
  const intensityMap = {
    Action: "high voltage chase",
    Drama: "quiet emotional pulse",
    Horror: "slow-burn dread",
    "Sci-Fi": "dream logic rising",
    Romance: "golden-hour ache",
    Animation: "wide-eyed lift",
  };
  const clerkNotes = {
    Action: "Let the projector get loud. This is a tape for snacks, speed, and staying up too late.",
    Drama: "If you're awake at 2AM, watch something that slows your heartbeat.",
    Horror: "Do not start this one alone unless the lights are already on.",
    "Sci-Fi": "Best watched when the room feels slightly unreal and the streetlights are humming.",
    Romance: "Put your phone away. Some movies need the whole room to get quiet.",
    Animation: "For nights when you need the screen to remember wonder for you.",
  };

  return {
    elapsed,
    runtime,
    progress,
    intensity: intensityMap[film.genre] || "midnight signal",
    renters: `${10 + ((film.id * 11 + index * 3) % 34)} renters watching tonight`,
    scene: film.favoriteScene || "favorite scene logged at the counter",
    clerkNote: clerkNotes[film.genre] || "The clerk says this one has the right kind of after-hours glow.",
  };
}

function getHomeScreeningMood(film, session) {
  const mood = (film.moods && film.moods[0]) || session.intensity || "midnight signal";
  const weather = (film.weatherTags && film.weatherTags[0]) || "projector glow";
  return `${mood.toLowerCase()} / ${weather.toLowerCase()} / ${getHomeAisleName(film.genre).toLowerCase()}`;
}

function getHomeMidnightTimeBoost(time, film) {
  const timeMap = {
    "Early Evening": ["Hopeful", "Inspired", "Romantic"],
    "10 PM": ["Nostalgic", "Romantic", "Inspired"],
    Midnight: ["Dreamy", "Lonely", "Nostalgic"],
    "2 AM": ["Lonely", "Dissociated", "Heartbroken", "Numb"],
    "4 AM": ["Numb", "Burned out", "Hopeful"],
    Sunrise: ["Hopeful", "Inspired", "Dreamy"],
  };

  return (timeMap[time] || []).some((mood) => (film.moods || []).includes(mood)) ? 18 : 0;
}

function getHomeNeedProfile(need) {
  const profiles = {
    "Comfort me": {
      moods: ["Hopeful", "Dreamy", "Romantic", "Nostalgic"],
      genres: ["Drama", "Animation", "Sci-Fi"],
      note: "Soft landing tape. Something that understands the feeling without making it heavier.",
    },
    "Destroy me gently": {
      moods: ["Heartbroken", "Lonely", "Nostalgic", "Numb"],
      genres: ["Drama"],
      note: "Beautiful ache tape. The kind a clerk recommends quietly, like a secret.",
    },
    "Wake me up": {
      moods: ["Angry", "Inspired", "Euphoric"],
      genres: ["Action", "Sci-Fi", "Animation"],
      note: "Pulse-check tape. Built for restless nights when you need the screen to move first.",
    },
    "Make it weird": {
      moods: ["Dissociated", "Dreamy", "Euphoric"],
      genres: ["Sci-Fi", "Horror"],
      note: "Strange-frequency tape. Best watched when the room already feels slightly unreal.",
    },
    "Give me hope": {
      moods: ["Hopeful", "Inspired", "Dreamy"],
      genres: ["Animation", "Drama", "Sci-Fi"],
      note: "Tiny-light tape. Not fake optimism, just enough glow to get through the night.",
    },
    "Let me spiral": {
      moods: ["Dissociated", "Angry", "Numb", "Burned out"],
      genres: ["Horror", "Action"],
      note: "Pressure-valve tape. Intense, moody, and better than staring at the ceiling.",
    },
  };

  return profiles[need] || profiles["Comfort me"];
}

function getHomeIntensityScore(intensity, film) {
  const highIntensityMoods = ["Angry", "Dissociated", "Euphoric", "Burned out"];
  const quietMoods = ["Lonely", "Nostalgic", "Dreamy", "Hopeful", "Romantic"];
  const moods = film.moods || [];

  if (intensity >= 8) {
    return moods.some((mood) => highIntensityMoods.includes(mood)) ? 24 : 4;
  }

  if (intensity <= 4) {
    return moods.some((mood) => quietMoods.includes(mood)) ? 22 : 0;
  }

  return 10;
}

function getHomeClerkReason(film, context, profile) {
  const reasons = [];

  if ((film.moods || []).includes(context.mood)) {
    reasons.push(`matches the ${context.mood.toLowerCase()} signal`);
  }

  if ((film.weatherTags || []).includes(context.weather)) {
    reasons.push(`works with ${context.weather.toLowerCase()} outside`);
  }

  if (profile.genres.includes(film.genre)) {
    reasons.push(`fits the "${context.need.toLowerCase()}" shelf`);
  }

  if (context.intensity >= 8) {
    reasons.push("has enough voltage for a loud-brain night");
  } else if (context.intensity <= 4) {
    reasons.push("keeps the emotional volume low and steady");
  }

  return reasons.slice(0, 3);
}

// --- Free-text mood engine ---------------------------------------------
// Maps natural-language input to the film catalog's emotional metadata.
const HOME_MOOD_LEXICON = {
  Lonely: ["lonely", "alone", "loneliness", "isolated", "by myself", "no one", "solitude"],
  Heartbroken: [
    "heartbroken", "heartbreak", "heart broken", "broke up", "break up", "breakup",
    "broken heart", "grief", "grieving", "miss them", "miss her", "miss him", "lost someone",
  ],
  Nostalgic: [
    "nostalgic", "nostalgia", "memories", "the past", "childhood", "old times",
    "remember when", "miss the past", "sentimental",
  ],
  Dissociated: [
    "dissociated", "dissociating", "dissociate", "detached", "unreal", "derealization",
    "out of body", "numb to everything", "spaced out", "floaty",
  ],
  Inspired: ["inspired", "motivated", "driven", "ambitious", "fired up", "create something", "make something"],
  Romantic: ["romantic", "romance", "in love", "crush", "lovesick", "date night", "tender", "yearning", "longing"],
  "Burned out": [
    "burned out", "burnt out", "burnout", "exhausted", "drained", "depleted", "fried",
    "cant anymore", "can't anymore", "tired of everything",
  ],
  Dreamy: ["dreamy", "dreaming", "daydream", "hazy", "wistful", "ethereal", "soft focus"],
  Angry: ["angry", "anger", "furious", "rage", "raging", "pissed", " mad", "frustrated", "resentful"],
  Hopeful: ["hopeful", "hope", "optimistic", "better days", "looking up", "a little light"],
  Numb: ["numb", "feel nothing", "feeling nothing", "empty", "hollow", "blank", "void", "disconnected"],
  Euphoric: ["euphoric", "ecstatic", "elated", "buzzing", "high on life", "hyped", "giddy", "joyful", "alive"],
};
const HOME_WEATHER_LEXICON = {
  Raining: ["rain", "raining", "rainy", "drizzle", "downpour", "wet streets"],
  Thunderstorm: ["thunder", "thunderstorm", "storm", "stormy", "lightning"],
  Foggy: ["fog", "foggy", "mist", "misty", "haze"],
  "Summer heat": ["heatwave", "sweltering", "humid", "summer heat", "warm night", "hot out"],
  Snowing: ["snow", "snowing", "snowy", "blizzard", "frost", "freezing"],
  Windy: ["windy", "gusty", "breeze", "blustery"],
  "Clear night": ["clear night", "clear sky", "stars", "starry", "starlit", "calm night", "still night"],
  "Neon city": ["neon", "city lights", "downtown", "city night", "streetlights", "skyline", "urban"],
  Overcast: ["overcast", "cloudy", "grey sky", "gray sky", "gloomy", "grey day", "gray day"],
};
const HOME_NEED_LEXICON = {
  "Comfort me": ["comfort", "cozy", "cosy", "safe", "soothe", "gentle", "hold me", "warm", "soft landing"],
  "Destroy me gently": [
    "destroy me", "wreck me", "make me cry", "makes me cry", "want to cry", "gut me",
    "break me", "devastate", "sob", "heartbreaking", "beautifully sad", "sad",
  ],
  "Wake me up": ["wake me", "energy", "energize", "adrenaline", "pump", "hype me", "get me moving", "loud"],
  "Make it weird": ["weird", "strange", "surreal", "trippy", "bizarre", "unhinged", "off-kilter"],
  "Give me hope": ["give me hope", "uplifting", "encourage", "get through this", "need a light", "reassure"],
  "Let me spiral": ["let me spiral", "spiral", "intense", "heavy", "dread", "unsettle", "mess me up", "sit in it"],
};
const HOME_STOPWORDS = new Set(
  "the a an and or but i im me my we you it its to of in on at is are be been being feel feeling felt want need something some really very just so that this with for like about into out up down was were have has had do does did not no yes too more most night tonight movie film watch watching".split(
    " ",
  ),
);

function parseHomeMoodText(rawText) {
  const text = String(rawText || "").toLowerCase();
  if (!text.trim()) {
    return { raw: "", moods: [], weathers: [], need: null, tokens: [], hasText: false };
  }
  const scan = (lex) =>
    Object.entries(lex)
      .filter(([, syns]) => syns.some((s) => text.includes(s)))
      .map(([key]) => key);
  const needs = scan(HOME_NEED_LEXICON);
  const tokens = [
    ...new Set(
      text
        .replace(/[^a-z\s'-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 4 && !HOME_STOPWORDS.has(w)),
    ),
  ];
  return {
    raw: text.trim(),
    moods: scan(HOME_MOOD_LEXICON),
    weathers: scan(HOME_WEATHER_LEXICON),
    need: needs[0] || null,
    tokens,
    hasText: true,
  };
}

function scoreHomeFreeText(film, signals) {
  if (!signals.hasText) {
    return { score: 0, reasons: [] };
  }
  const reasons = [];
  let score = 0;
  const moodHits = signals.moods.filter((m) => (film.moods || []).includes(m));
  const weatherHits = signals.weathers.filter((w) => (film.weatherTags || []).includes(w));

  if (moodHits.length) {
    score += Math.min(moodHits.length, 2) * 52;
    reasons.push(`reads the ${moodHits[0].toLowerCase()} in what you wrote`);
  }
  if (weatherHits.length) {
    score += 30;
    reasons.push(`tuned to the ${weatherHits[0].toLowerCase()} you described`);
  }

  const corpus = [
    film.emotionalSynopsis,
    film.cinematicQuote,
    film.visualMood,
    film.soundtrack,
    film.description,
    (film.vibeTags || []).join(" "),
    (film.moods || []).join(" "),
    (film.weatherTags || []).join(" "),
    film.genre,
    film.title,
  ]
    .join(" ")
    .toLowerCase();
  const overlap = signals.tokens.filter((t) => corpus.includes(t));
  if (overlap.length) {
    score += Math.min(overlap.length * 8, 40);
    if (overlap.length >= 2) {
      reasons.push(`echoes your words (${overlap.slice(0, 3).join(", ")})`);
    }
  }

  return { score: Math.min(score, 130), reasons: reasons.slice(0, 2) };
}

function getHomeMidnightRecommendation(context, avoidCurrent = false) {
  const signals = parseHomeMoodText(context.freeText);
  const effectiveNeed = signals.need || context.need;
  const profile = getHomeNeedProfile(effectiveNeed);
  const reasonContext = { ...context, need: effectiveNeed };
  const rankedFilms = homeFilms
    .map((film) => {
      const moodScore = (film.moods || []).includes(context.mood) ? 46 : 0;
      const weatherScore = (film.weatherTags || []).includes(context.weather) ? 34 : 0;
      const timeScore = getHomeMidnightTimeBoost(context.time, film);
      const needScore = profile.moods.some((moodTag) => (film.moods || []).includes(moodTag)) ? 28 : 0;
      const genreScore = profile.genres.includes(film.genre) ? 16 : 0;
      const intensityScore = getHomeIntensityScore(context.intensity, film);
      const free = scoreHomeFreeText(film, signals);
      // When the user wrote something, let their words lead — damp the random jitter.
      const jitter = signals.hasText ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 9);
      return {
        film,
        reasons: [...free.reasons, ...getHomeClerkReason(film, reasonContext, profile)].slice(0, 3),
        score:
          (film.lateNightScore || 70) +
          moodScore +
          weatherScore +
          timeScore +
          needScore +
          genreScore +
          intensityScore +
          free.score +
          jitter,
      };
    })
    .sort((a, b) => b.score - a.score);

  let pick = rankedFilms[0] || null;
  if (avoidCurrent && currentHomeMidnightFilm && rankedFilms.length > 1) {
    pick = rankedFilms.find(({ film }) => film.id !== currentHomeMidnightFilm.id) || rankedFilms[0];
  }

  return {
    film: pick?.film || null,
    matchScore: Math.min(99, Math.round((pick?.score || 0) / 2.55)),
    reasons: pick?.reasons?.length ? pick.reasons : ["the night clerk says the shelf is humming around this one"],
    clerkNote: profile.note,
    alternate: rankedFilms.find(({ film }) => film.id !== pick?.film.id)?.film || null,
  };
}

function getHomeMidnightContext() {
  return {
    time: homeMidnightTime.value,
    mood: homeMidnightMood.value,
    weather: homeMidnightWeather.value,
    need: homeMidnightNeed.value,
    intensity: Number(homeMidnightIntensity.value),
    freeText: homeMidnightFreeText ? homeMidnightFreeText.value : "",
  };
}

function updateHomeNightBagCount() {
  if (!homeMidnightCount) {
    return;
  }

  const count = homeNightBag.length;
  homeMidnightCount.textContent = `Night Bag: ${count} tape${count === 1 ? "" : "s"}`;

  if (!homeMidnightStack) {
    return;
  }

  homeMidnightStack.innerHTML = homeNightBag.length
    ? homeNightBag
        .map(
          (film, index) => `
            <li>
              <span>${index + 1}</span>
              <div>
                <strong>${escapeHomeHtml(film.title)}</strong>
                <small>${escapeHomeHtml(film.drinkPairing || "black coffee")} · ${escapeHomeHtml(film.soundtrack || "tape hiss")}</small>
              </div>
            </li>
          `,
        )
        .join("")
    : "<li>No tapes selected yet. Ask the Night Clerk or throw a tape in the bag.</li>";
}

function syncHomeMidnightButtons(film) {
  if (!film) {
    return;
  }

  const isBagged = homeNightBag.some((rental) => rental.id === film.id);
  document.querySelectorAll(`[data-home-film-id="${film.id}"]`).forEach((button) => {
    button.classList.toggle("btn-warning", !isBagged);
    button.classList.toggle("btn-light", isBagged);
    button.setAttribute("aria-pressed", String(isBagged));
    button.textContent = button.classList.contains("midnight-queue-button")
      ? isBagged
        ? "Saved To Night Bag"
        : "Save To Night Bag"
      : isBagged
        ? "In The Bag"
        : "Throw In Bag";
  });
}

function syncHomeProjectorButton(film) {
  if (!homeProjectorBag || !film) {
    return;
  }

  const isBagged = homeNightBag.some((rental) => rental.id === film.id);
  homeProjectorBag.classList.toggle("btn-warning", !isBagged);
  homeProjectorBag.classList.toggle("btn-light", isBagged);
  homeProjectorBag.setAttribute("aria-pressed", String(isBagged));
  homeProjectorBag.textContent = isBagged ? "In The Bag" : "Throw In Bag";
}

function renderHomeProjectorFeature(index = 0) {
  if (
    !homeFilms.length ||
    !homeProjectorDescription ||
    !homeProjectorMeta ||
    !homeProjectorImage ||
    !homeFeaturedVhsImage ||
    !homeFeaturedVhsTitle
  ) {
    return;
  }

  const preferred = homeFilms.findIndex((film) => film.title === "Blade Runner 2049");
  const startingIndex = preferred >= 0 ? preferred : 0;
  homeProjectorIndex = (index + homeFilms.length) % homeFilms.length;
  if (index === 0 && preferred >= 0) {
    homeProjectorIndex = startingIndex;
  }

  const film = homeFilms[homeProjectorIndex];
  const staff = getHomeStaffNote(film);
  const session = getHomeProjectorSession(film, homeProjectorIndex);
  const display = document.querySelector(".home-now-playing .featured-vhs-display");
  const section = document.querySelector(".home-now-playing");

  homeProjectorDescription.textContent = `${staff.employee}'s current projector pick: ${
    film.emotionalSynopsis || film.description
  }`;
  homeProjectorMeta.innerHTML = [staff.tag, getHomeAisleName(film.genre), getHomeRuntime(film)]
    .map((value) => `<span>${escapeHomeHtml(value)}</span>`)
    .join("");
  homeProjectorImage.src = film.poster;
  homeProjectorImage.alt = "";
  homeFeaturedVhsImage.src = film.poster;
  homeFeaturedVhsImage.alt = `${film.title} featured VHS cover`;
  homeFeaturedVhsTitle.textContent = film.title;
  if (homeProjectorStatus) {
    homeProjectorStatus.textContent = `Currently projecting ${film.title}`;
  }
  if (homeProjectorRuntime) {
    homeProjectorRuntime.textContent = `${String(session.elapsed).padStart(2, "0")} min / ${session.runtime} min`;
  }
  if (homeProjectorProgress) {
    homeProjectorProgress.style.width = `${session.progress}%`;
  }
  if (homeProjectorIntensity) {
    homeProjectorIntensity.textContent = session.intensity;
  }
  if (homeProjectorRenters) {
    homeProjectorRenters.textContent = session.renters;
  }
  if (homeProjectorScene) {
    homeProjectorScene.textContent = session.scene;
  }
  if (homeProjectorClerkNote) {
    homeProjectorClerkNote.textContent = session.clerkNote;
  }
  if (screeningNowTitle) {
    screeningNowTitle.textContent = film.title;
  }
  if (screeningMood) {
    screeningMood.textContent = getHomeScreeningMood(film, session);
  }
  if (screeningRuntime) {
    screeningRuntime.textContent = getHomeRuntimeLong(film);
  }
  if (screeningRenters) {
    screeningRenters.textContent = session.renters.replace("renters watching tonight", "night renters");
  }
  syncHomeProjectorButton(film);

  display?.classList.remove("is-switching");
  section?.classList.remove("is-pulling");
  window.requestAnimationFrame(() => {
    display?.classList.add("is-switching");
  });
}

function addHomeFilmToNightBag(film) {
  if (!film || homeNightBag.some((rental) => rental.id === film.id)) {
    syncHomeMidnightButtons(film);
    syncHomeProjectorButton(film);
    return;
  }

  homeNightBag.push(film);
  updateHomeNightBagCount();
  syncHomeMidnightButtons(film);
  syncHomeProjectorButton(film);

  const midnightSection = document.querySelector(".home-midnight-watchlist");
  midnightSection?.classList.add("is-bagging");
  window.setTimeout(() => {
    midnightSection?.classList.remove("is-bagging");
  }, 760);
}

function handleHomeProjectorBag() {
  addHomeFilmToNightBag(homeFilms[homeProjectorIndex]);
  document.querySelector(".home-now-playing")?.classList.add("is-pulling");
  window.setTimeout(() => {
    document.querySelector(".home-now-playing")?.classList.remove("is-pulling");
  }, 720);
}

function handleHomeProjectorNext() {
  renderHomeProjectorFeature(homeProjectorIndex + 1);
}

function handleHomeProjectorInspect() {
  const section = document.querySelector(".home-now-playing");
  section?.classList.add("is-pulling");
  window.setTimeout(() => {
    window.location.href = "films.html#movieGrid";
  }, 260);
}

function renderHomeMidnightRecommendation(recommendation, context) {
  const film = recommendation?.film;
  if (!film || !homeMidnightResult) {
    return;
  }

  currentHomeMidnightFilm = film;
  const isBagged = homeNightBag.some((rental) => rental.id === film.id);
  const staffNote = getHomeStaffNote(film);
  const clerkNames = {
    Action: "Josh",
    Drama: "Maya",
    Horror: "Luis",
    "Sci-Fi": "Sam",
    Romance: "Nina",
    Animation: "Chris",
  };
  const clerkName = clerkNames[film.genre] || staffNote.employee || "Maya";
  homeMidnightResult.classList.remove("is-visible");
  homeMidnightResult.classList.remove("is-searching");
  homeMidnightResult.classList.add("is-revealing");
  homeMidnightResult.innerHTML = `
    <div class="midnight-result-card">
      <div class="midnight-vhs-feature">
        <div class="midnight-projector-beam" aria-hidden="true"></div>
        <div class="midnight-vhs-spine"><span>${escapeHomeHtml(getHomeAisleName(film.genre))}</span></div>
        <img src="${escapeHomeHtml(film.poster)}" alt="${escapeHomeHtml(film.title)} midnight VHS recommendation" width="500" height="750" loading="lazy" decoding="async">
        <span class="midnight-rental-sticker">MIDNIGHT PICK</span>
        <span class="midnight-vhs-barcode">BB+ ${String(film.id).padStart(3, "0")}-${escapeHomeHtml(film.year)}</span>
        <span class="midnight-rewind-stamp">BE KIND REWIND</span>
        <h3>${escapeHomeHtml(film.title)}</h3>
      </div>
      <div class="midnight-result-copy">
        <p class="midnight-context">${escapeHomeHtml(context.time)} / ${escapeHomeHtml(context.weather.toLowerCase())} / ${escapeHomeHtml(context.mood.toLowerCase())}</p>
        <p class="midnight-clerk-id">Recommended by ${escapeHomeHtml(clerkName)}, overnight clerk.</p>
        <h3>${escapeHomeHtml(film.title)}</h3>
        <p class="midnight-director">Directed by ${escapeHomeHtml(film.director)} · ${escapeHomeHtml(film.year)}</p>
        <p class="midnight-reading">Tonight's Reading: This tape understands the room you are in.</p>
        <div class="midnight-match-panel">
          <span class="midnight-section-label">Emotional Signal</span>
          <div class="midnight-match-meter" style="--match-score: ${recommendation.matchScore}%">
            <span>${recommendation.matchScore}% tuned to the room</span>
          </div>
          <div class="midnight-audio-wave" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <span class="midnight-section-label">Night Clerk Note</span>
          <p>${escapeHomeHtml(recommendation.clerkNote)}</p>
        </div>
        <p class="midnight-synopsis">${escapeHomeHtml(film.emotionalSynopsis || film.description)}</p>
        <div class="midnight-reasons" aria-label="Why the night clerk picked this movie">
          ${recommendation.reasons.map((reason) => `<span>${escapeHomeHtml(reason)}</span>`).join("")}
        </div>
        <div class="midnight-pairings">
          <article>
            <span>Drink Pairing</span>
            <strong>${escapeHomeHtml(film.drinkPairing || "black coffee")}</strong>
          </article>
          <article>
            <span>Soundtrack</span>
            <strong>${escapeHomeHtml(film.soundtrack || "ambient jazz and tape hiss")}</strong>
          </article>
          <article>
            <span>Visual mood</span>
            <strong>${escapeHomeHtml(film.visualMood || "Static from a television at 3AM.")}</strong>
          </article>
        </div>
        <blockquote>${escapeHomeHtml(film.cinematicQuote || "The right movie finds you when the night gets quiet.")}</blockquote>
        ${
          recommendation.alternate
            ? `<p class="midnight-alternate"><span>Backup Tape</span><strong>${escapeHomeHtml(recommendation.alternate.title)}</strong></p>`
            : ""
        }
        <div class="midnight-actions">
          <button
            class="btn ${isBagged ? "btn-light" : "btn-warning"} midnight-bag-button"
            type="button"
            data-home-film-id="${film.id}"
            aria-pressed="${isBagged}"
          >
            ${isBagged ? "In The Bag" : "Throw In Bag"}
          </button>
          <button
            class="btn ${isBagged ? "btn-light" : "btn-outline-light"} midnight-queue-button"
            type="button"
            data-home-film-id="${film.id}"
            aria-pressed="${isBagged}"
          >
            ${isBagged ? "Saved To Night Bag" : "Save To Night Bag"}
          </button>
          <button class="btn btn-outline-light midnight-again-button" type="button">
            Generate Another
          </button>
        </div>
      </div>
    </div>
  `;

  window.requestAnimationFrame(() => {
    homeMidnightResult.classList.add("is-visible");
  });
  window.setTimeout(() => {
    homeMidnightResult.classList.remove("is-revealing");
  }, 980);
}

function renderHomeMidnightSearching() {
  if (!homeMidnightResult) {
    return;
  }

  homeMidnightResult.classList.remove("is-visible");
  homeMidnightResult.classList.add("is-searching");
  homeMidnightResult.innerHTML = `
    <div class="midnight-empty midnight-searching">
      <span>After Hours</span>
      <p>Searching the after-hours shelf...</p>
      <div class="midnight-empty-wave" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i>
      </div>
    </div>
  `;
}

async function updateHomeMidnightLivePreview() {
  await homeFilmsReady;

  if (!homeFilms.length || !homeMidnightForm) {
    return;
  }

  const context = getHomeMidnightContext();
  renderHomeMidnightRecommendation(getHomeMidnightRecommendation(context), context);
}

function scheduleHomeMidnightLivePreview() {
  window.clearTimeout(livePreviewTimer);
  livePreviewTimer = window.setTimeout(updateHomeMidnightLivePreview, 180);
}

async function handleHomeMidnightSubmit(event) {
  event.preventDefault();
  await homeFilmsReady;

  if (!homeFilms.length) {
    return;
  }

  const context = getHomeMidnightContext();
  renderHomeMidnightSearching();
  window.setTimeout(() => {
    renderHomeMidnightRecommendation(getHomeMidnightRecommendation(context, true), context);
  }, 620);
}

function handleHomeMidnightResultClick(event) {
  const actionButton = event.target.closest(
    ".midnight-bag-button, .midnight-queue-button, .midnight-again-button",
  );

  if (!actionButton) {
    return;
  }

  if (actionButton.classList.contains("midnight-again-button")) {
    handleHomeMidnightSubmit(event);
    return;
  }

  const film = homeFilms.find((movie) => movie.id === Number(actionButton.dataset.homeFilmId));
  if (!film || homeNightBag.some((rental) => rental.id === film.id)) {
    syncHomeMidnightButtons(film);
    return;
  }

  addHomeFilmToNightBag(film);
}

function updateHomeIntensityLabel() {
  if (homeMidnightIntensityLabel && homeMidnightIntensity) {
    homeMidnightIntensityLabel.textContent = homeMidnightIntensity.value;
  }

  if (homeEmotionWaveform && homeMidnightIntensity) {
    homeEmotionWaveform.style.setProperty("--wave-intensity", homeMidnightIntensity.value);
  }
}

function handleHomeMoodChipClick(event) {
  const chip = event.target.closest("button[data-mood]");

  if (!chip) {
    return;
  }

  homeMidnightMood.value = chip.dataset.mood;
  homeMidnightWeather.value = chip.dataset.weather;
  homeMidnightNeed.value = chip.dataset.need;
  homeMidnightMoodChips.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button === chip);
  });
  scheduleHomeMidnightLivePreview();
}

function setHomeText(selector, value) {
  const el = document.querySelector(selector);
  if (el) {
    el.textContent = value;
  }
}

function getHomeLiveViewerCount(film, index = 0) {
  return 18 + ((film.id * 19 + index * 7) % 86);
}

function renderHomeLiveWatchingStrip(film, index = 0) {
  const count = getHomeLiveViewerCount(film, index);
  const label = count === 1 ? "person" : "people";

  return `
    <div class="live-watch-strip home-live-watch-strip" aria-label="${count} ${label} streaming ${escapeHomeHtml(film.title)} right now">
      <span class="live-dot" aria-hidden="true"></span>
      <strong>${count}</strong>
      <span>streaming right now</span>
    </div>
  `;
}

function homeShelfCard(film, index) {
  const reactionPool = [
    "watched twice this week",
    "best rainy-night tape",
    "insane ending",
    "midnight rental favorite",
    "counter clerk approved",
    "rewind-worthy final scene",
  ];
  const reactionUsers = ["@videostorekid", "@raincityvhs", "@midnightmovies", "@filmnerd99", "@afterhourskid"];
  const progress = Math.min(86, 24 + ((film.id * 9 + index * 7) % 54));
  const isActive = index === 0;

  return `
    <article class="home-vhs-slot ${isActive ? "is-active" : ""}" data-shelf-index="${index}" style="--shelf-order: ${index};">
      <div class="card movie-card home-vhs-card h-100" tabindex="0" aria-label="${escapeHomeHtml(film.title)} Friday Night Pick VHS tape">
        <div class="vhs-gloss" aria-hidden="true"></div>
        <div class="home-vhs-edge-wear" aria-hidden="true"></div>
        <div class="home-vhs-spine"><span>${escapeHomeHtml(getHomeAisleName(film.genre))}</span></div>
        <img
          src="${escapeHomeHtml(film.poster)}"
          class="card-img-top"
          alt="${escapeHomeHtml(film.title)} VHS cover"
          width="500"
          height="750"
          loading="lazy"
          decoding="async"
        />
        ${renderHomeLiveWatchingStrip(film, index)}
        <span class="home-vhs-sticker">BLOCKBUSTER VIDEO</span>
        <span class="home-vhs-label">${index === 0 ? "Premium Pick" : "Staff Pick"}</span>
        <span class="home-vhs-barcode">BB+ ${String(film.id).padStart(3, "0")}-${escapeHomeHtml(film.year)}</span>
        <span class="home-vhs-wear">${escapeHomeHtml((film.cultureTags && film.cultureTags[0]) || "Most rented this weekend")}</span>
        <span class="home-pull-badge">Pull from shelf</span>
        <div class="home-now-projecting-badge" aria-label="Now projecting">
          <span>Now projecting</span>
          <div class="home-card-progress"><i style="width: ${progress}%"></i></div>
          <div class="home-card-eq" aria-hidden="true"><b></b><b></b><b></b><b></b></div>
        </div>
        <div class="card-body">
          <p class="movie-kicker">${escapeHomeHtml(getHomeAisleName(film.genre))}</p>
          <h3 class="card-title">${escapeHomeHtml(film.title)}</h3>
          <p class="card-text">${escapeHomeHtml(film.emotionalSynopsis || film.description)}</p>
          <div class="home-social-reaction">
            <span>${escapeHomeHtml(reactionUsers[index % reactionUsers.length])}</span>
            <p>${escapeHomeHtml(reactionPool[index % reactionPool.length])}</p>
          </div>
        </div>
      </div>
    </article>
  `;
}

function updateFridayShelfActive(targetSlot = null) {
  const grid = document.querySelector("#homeTrendingGrid");
  if (!grid) {
    return;
  }

  const slots = [...grid.querySelectorAll(".home-vhs-slot")];
  if (!slots.length) {
    return;
  }

  let activeSlot = targetSlot;
  if (!activeSlot) {
    const gridRect = grid.getBoundingClientRect();
    const centerX = gridRect.left + gridRect.width / 2;
    activeSlot = slots.reduce((closest, slot) => {
      const rect = slot.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - centerX);
      return distance < closest.distance ? { slot, distance } : closest;
    }, { slot: slots[0], distance: Number.POSITIVE_INFINITY }).slot;
  }

  slots.forEach((slot) => {
    slot.classList.toggle("is-active", slot === activeSlot);
  });
}

function renderHomeStorefront() {
  if (!homeFilms.length) {
    return;
  }

  const ranked = [...homeFilms].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const heroImage = document.querySelector("#heroFeaturedImage");
  if (heroImage) {
    const top = ranked[0];
    heroImage.src = top.poster;
    heroImage.alt = `${top.title} poster`;
    setHomeText("#heroFeaturedTitle", top.title);
    setHomeText("#heroFeaturedDescription", top.description);
    const meta = document.querySelector("#heroFeaturedMeta");
    if (meta) {
      meta.innerHTML = [getHomeAisleName(top.genre), top.year, (top.rating || 0).toFixed(1)]
        .map((value) => `<span>${escapeHomeHtml(value)}</span>`)
        .join("");
    }
  }

  const grid = document.querySelector("#homeTrendingGrid");
  if (grid) {
    grid.innerHTML = ranked
      .slice(0, 10)
      .map((film, index) => homeShelfCard(film, index))
      .join("");
    updateFridayShelfActive();
  }
}

function scrollFridayShelf(direction) {
  const grid = document.querySelector("#homeTrendingGrid");
  if (!grid) {
    return;
  }

  const distance = Math.max(280, Math.round(grid.clientWidth * 0.72));
  grid.scrollBy({ left: direction * distance, behavior: "smooth" });
}

async function loadHomeMidnightFilms() {
  try {
    const response = await fetch("data/films.json");
    if (!response.ok) {
      throw new Error("Could not load films.");
    }

    homeFilms = await response.json();
    renderHomeStorefront();
    renderHomeProjectorFeature(0);
    if (homeMidnightForm) {
      const context = getHomeMidnightContext();
      renderHomeMidnightRecommendation(getHomeMidnightRecommendation(context), context);
    }
  } catch (error) {
    if (homeMidnightResult) {
      homeMidnightResult.innerHTML = `
        <div class="midnight-empty">
          <span>Signal Lost</span>
          <p>The night clerk could not reach the rental shelf. Try refreshing the page.</p>
        </div>
      `;
    }
  }
}

homeMidnightForm?.addEventListener("submit", handleHomeMidnightSubmit);
document.addEventListener("click", (event) => {
  if (event.target.closest("#midnightSubmit")) {
    handleHomeMidnightSubmit(event);
  }
});
homeMidnightResult?.addEventListener("click", handleHomeMidnightResultClick);
homeMidnightMoodChips?.addEventListener("click", handleHomeMoodChipClick);
homeProjectorBag?.addEventListener("click", handleHomeProjectorBag);
homeProjectorNext?.addEventListener("click", handleHomeProjectorNext);
homeProjectorInspect?.addEventListener("click", handleHomeProjectorInspect);
fridayShelfPrev?.addEventListener("click", () => scrollFridayShelf(-1));
fridayShelfNext?.addEventListener("click", () => scrollFridayShelf(1));

const homeTrendingGrid = document.querySelector("#homeTrendingGrid");
let fridayShelfScrollFrame = null;

homeTrendingGrid?.addEventListener("scroll", () => {
  if (fridayShelfScrollFrame) {
    window.cancelAnimationFrame(fridayShelfScrollFrame);
  }
  fridayShelfScrollFrame = window.requestAnimationFrame(() => {
    updateFridayShelfActive();
    fridayShelfScrollFrame = null;
  });
});

homeTrendingGrid?.addEventListener("pointerover", (event) => {
  const slot = event.target.closest(".home-vhs-slot");
  if (slot && homeTrendingGrid.contains(slot)) {
    updateFridayShelfActive(slot);
  }
});

homeTrendingGrid?.addEventListener("focusin", (event) => {
  const slot = event.target.closest(".home-vhs-slot");
  if (slot && homeTrendingGrid.contains(slot)) {
    updateFridayShelfActive(slot);
  }
});
homeMidnightTime?.addEventListener("change", scheduleHomeMidnightLivePreview);
homeMidnightMood?.addEventListener("change", scheduleHomeMidnightLivePreview);
homeMidnightWeather?.addEventListener("change", scheduleHomeMidnightLivePreview);
homeMidnightNeed?.addEventListener("change", scheduleHomeMidnightLivePreview);
homeMidnightFreeText?.addEventListener("input", scheduleHomeMidnightLivePreview);
homeMidnightIntensity?.addEventListener("input", () => {
  updateHomeIntensityLabel();
  scheduleHomeMidnightLivePreview();
});
updateHomeIntensityLabel();
homeFilmsReady = loadHomeMidnightFilms();
initializeHomeLateNightMode();
