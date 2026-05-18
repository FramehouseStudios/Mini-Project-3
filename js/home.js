const homeMidnightForm = document.querySelector("#midnightForm");
const homeMidnightTime = document.querySelector("#midnightTime");
const homeMidnightMood = document.querySelector("#midnightMood");
const homeMidnightWeather = document.querySelector("#midnightWeather");
const homeMidnightNeed = document.querySelector("#midnightNeed");
const homeMidnightIntensity = document.querySelector("#midnightIntensity");
const homeMidnightIntensityLabel = document.querySelector("#midnightIntensityLabel");
const homeMidnightResult = document.querySelector("#midnightResult");
const homeMidnightCount = document.querySelector("#homeMidnightCount");
const homeMidnightStack = document.querySelector("#homeMidnightStack");

let homeFilms = [];
let homeNightBag = [];
let currentHomeMidnightFilm = null;
let homeFilmsReady = Promise.resolve();

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

function getHomeMidnightRecommendation(context) {
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
  if (currentHomeMidnightFilm && rankedFilms.length > 1) {
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
  homeMidnightResult.innerHTML = `
    <div class="midnight-result-card">
      <div class="midnight-vhs-feature">
        <div class="midnight-vhs-spine"><span>${escapeHomeHtml(getHomeAisleName(film.genre))}</span></div>
        <img src="${escapeHomeHtml(film.poster)}" alt="${escapeHomeHtml(film.title)} midnight VHS recommendation">
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

async function handleHomeMidnightSubmit(event) {
  event.preventDefault();
  await homeFilmsReady;

  if (!homeFilms.length) {
    return;
  }

  const context = {
    time: homeMidnightTime.value,
    mood: homeMidnightMood.value,
    weather: homeMidnightWeather.value,
    need: homeMidnightNeed.value,
    intensity: Number(homeMidnightIntensity.value),
  };
  renderHomeMidnightRecommendation(getHomeMidnightRecommendation(context), context);
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
}

async function loadHomeMidnightFilms() {
  if (!homeMidnightForm || !homeMidnightResult) {
    return;
  }

  try {
    const response = await fetch("data/films.json");
    if (!response.ok) {
      throw new Error("Could not load films.");
    }

    homeFilms = await response.json();
  } catch (error) {
    homeMidnightResult.innerHTML = `
      <div class="midnight-empty">
        <span>Signal Lost</span>
        <p>The night clerk could not reach the rental shelf. Try refreshing the page.</p>
      </div>
    `;
  }
}

homeMidnightForm?.addEventListener("submit", handleHomeMidnightSubmit);
homeMidnightResult?.addEventListener("click", handleHomeMidnightResultClick);
homeMidnightIntensity?.addEventListener("input", updateHomeIntensityLabel);
updateHomeIntensityLabel();
homeFilmsReady = loadHomeMidnightFilms();
