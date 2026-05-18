const homeMidnightForm = document.querySelector("#midnightForm");
const homeMidnightTime = document.querySelector("#midnightTime");
const homeMidnightMood = document.querySelector("#midnightMood");
const homeMidnightWeather = document.querySelector("#midnightWeather");
const homeMidnightNeed = document.querySelector("#midnightNeed");
const homeMidnightIntensity = document.querySelector("#midnightIntensity");
const homeMidnightIntensityLabel = document.querySelector("#midnightIntensityLabel");
const homeMidnightSubmit = document.querySelector("#midnightSubmit");
const homeEmotionWaveform = document.querySelector("#emotionWaveform");
const homeMidnightResult = document.querySelector("#midnightResult");
const homeMidnightCount = document.querySelector("#homeMidnightCount");
const homeMidnightStack = document.querySelector("#homeMidnightStack");
const homeMidnightMoodChips = document.querySelector(".midnight-mood-chips");

let homeFilms = [];
let homeNightBag = [];
let currentHomeMidnightFilm = null;
let homeFilmsReady = Promise.resolve();
let livePreviewTimer = null;

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

function getHomeMidnightRecommendation(context, avoidCurrent = false) {
  const profile = getHomeNeedProfile(context.need);
  const rankedFilms = homeFilms
    .map((film) => {
      const moodScore = (film.moods || []).includes(context.mood) ? 46 : 0;
      const weatherScore = (film.weatherTags || []).includes(context.weather) ? 34 : 0;
      const timeScore = getHomeMidnightTimeBoost(context.time, film);
      const needScore = profile.moods.some((moodTag) => (film.moods || []).includes(moodTag)) ? 28 : 0;
      const genreScore = profile.genres.includes(film.genre) ? 16 : 0;
      const intensityScore = getHomeIntensityScore(context.intensity, film);
      const jitter = Math.floor(Math.random() * 9);
      return {
        film,
        reasons: getHomeClerkReason(film, context, profile),
        score:
          (film.lateNightScore || 70) +
          moodScore +
          weatherScore +
          timeScore +
          needScore +
          genreScore +
          intensityScore +
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
    : "<li>No tapes selected yet.</li>";
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
        ? "Saved To Tonight's Queue"
        : "Save To Tonight's Queue"
      : isBagged
        ? "In The Bag"
        : "Throw In Bag";
  });
}

function renderHomeMidnightRecommendation(recommendation, context) {
  const film = recommendation?.film;
  if (!film || !homeMidnightResult) {
    return;
  }

  currentHomeMidnightFilm = film;
  const isBagged = homeNightBag.some((rental) => rental.id === film.id);
  homeMidnightResult.classList.remove("is-visible");
  homeMidnightResult.classList.remove("is-searching");
  homeMidnightResult.innerHTML = `
    <div class="midnight-result-card">
      <div class="midnight-vhs-feature">
        <div class="midnight-projector-beam" aria-hidden="true"></div>
        <div class="midnight-vhs-spine"><span>${escapeHomeHtml(getHomeAisleName(film.genre))}</span></div>
        <img src="${escapeHomeHtml(film.poster)}" alt="${escapeHomeHtml(film.title)} midnight VHS recommendation" width="500" height="750" loading="lazy" decoding="async">
        <span class="midnight-rental-sticker">MIDNIGHT PICK</span>
        <span class="midnight-rewind-stamp">BE KIND REWIND</span>
        <h3>${escapeHomeHtml(film.title)}</h3>
      </div>
      <div class="midnight-result-copy">
        <p class="midnight-context">${escapeHomeHtml(context.time)} / ${escapeHomeHtml(context.weather.toLowerCase())} / ${escapeHomeHtml(context.mood.toLowerCase())}</p>
        <h3>${escapeHomeHtml(film.title)}</h3>
        <p class="midnight-director">Directed by ${escapeHomeHtml(film.director)} · ${escapeHomeHtml(film.year)}</p>
        <div class="midnight-match-panel">
          <div class="midnight-match-meter" style="--match-score: ${recommendation.matchScore}%">
            <span>${recommendation.matchScore}% emotional match</span>
          </div>
          <div class="midnight-audio-wave" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <p>${escapeHomeHtml(recommendation.clerkNote)}</p>
        </div>
        <p class="midnight-synopsis">${escapeHomeHtml(film.emotionalSynopsis || film.description)}</p>
        <div class="midnight-reasons" aria-label="Why the night clerk picked this movie">
          ${recommendation.reasons.map((reason) => `<span>${escapeHomeHtml(reason)}</span>`).join("")}
        </div>
        <div class="midnight-pairings">
          <article>
            <span>Drink pairing</span>
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
            ? `<p class="midnight-alternate">Backup tape if the mood shifts: <strong>${escapeHomeHtml(recommendation.alternate.title)}</strong></p>`
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
            ${isBagged ? "Saved To Tonight's Queue" : "Save To Tonight's Queue"}
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

  homeNightBag.push(film);
  updateHomeNightBagCount();
  syncHomeMidnightButtons(film);
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

function homeShelfCard(film, index) {
  return `
    <article class="col-md-6 col-xl-3 home-vhs-slot">
      <div class="card movie-card home-vhs-card h-100">
        <div class="vhs-gloss" aria-hidden="true"></div>
        <div class="home-vhs-spine"><span>${escapeHomeHtml(film.genre.toUpperCase())}</span></div>
        <img
          src="${escapeHomeHtml(film.poster)}"
          class="card-img-top"
          alt="${escapeHomeHtml(film.title)} VHS cover"
          width="500"
          height="750"
          loading="lazy"
          decoding="async"
        />
        <span class="home-vhs-sticker">BLOCKBUSTER VIDEO</span>
        <span class="home-vhs-label">${index === 0 ? "Premium Pick" : "Staff Pick"}</span>
        <span class="home-vhs-barcode">BB+ ${String(film.id).padStart(3, "0")}-${escapeHomeHtml(film.year)}</span>
        <span class="home-vhs-wear">${escapeHomeHtml((film.cultureTags && film.cultureTags[0]) || "Most rented this weekend")}</span>
        <span class="home-pull-badge">Pull from shelf</span>
        <div class="card-body">
          <p class="movie-kicker">${escapeHomeHtml(getHomeAisleName(film.genre))}</p>
          <h3 class="card-title">${escapeHomeHtml(film.title)}</h3>
          <p class="card-text">${escapeHomeHtml(film.description)}</p>
        </div>
      </div>
    </article>
  `;
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
      .slice(0, 4)
      .map((film, index) => homeShelfCard(film, index))
      .join("");
  }
}

async function loadHomeMidnightFilms() {
  try {
    const response = await fetch("data/films.json");
    if (!response.ok) {
      throw new Error("Could not load films.");
    }

    homeFilms = await response.json();
    renderHomeStorefront();
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
homeMidnightTime?.addEventListener("change", scheduleHomeMidnightLivePreview);
homeMidnightMood?.addEventListener("change", scheduleHomeMidnightLivePreview);
homeMidnightWeather?.addEventListener("change", scheduleHomeMidnightLivePreview);
homeMidnightNeed?.addEventListener("change", scheduleHomeMidnightLivePreview);
homeMidnightIntensity?.addEventListener("input", () => {
  updateHomeIntensityLabel();
  scheduleHomeMidnightLivePreview();
});
updateHomeIntensityLabel();
homeFilmsReady = loadHomeMidnightFilms();
