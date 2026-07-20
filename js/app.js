const movieGrid = document.querySelector("#movieGrid");
const searchInput = document.querySelector("#searchInput");
const genreFilter = document.querySelector("#genreFilter");
const resultsCount = document.querySelector("#resultsCount");
const bagCountLabel = document.querySelector("#bagCountLabel");
const bagCounter = document.querySelector("#bagCounter");
const rentalBagButton = document.querySelector("#rentalBagButton");
const rentalBagCaseStack = document.querySelector("#rentalBagCaseStack");
const bagDropToast = document.querySelector("#bagDropToast");
const rentalBagPanel = document.querySelector("#rentalBagPanel");
const closeBagPanel = document.querySelector("#closeBagPanel");
const bagItems = document.querySelector("#bagItems");
const bagTotal = document.querySelector("#bagTotal");
const checkoutVhs = document.querySelector("#checkoutVhs");
const watchlistCount = document.querySelector("#watchlistCount");
const watchlistRuntime = document.querySelector("#watchlistRuntime");
const watchlistRewatches = document.querySelector("#watchlistRewatches");
const watchlistMood = document.querySelector("#watchlistMood");
const watchlistVibes = document.querySelector("#watchlistVibes");
const watchlistTapeStack = document.querySelector("#watchlistTapeStack");
const watchlistTapeList = document.querySelector("#watchlistTapeList");
const moodboardEnergy = document.querySelector("#moodboardEnergy");
const moodboardPairing = document.querySelector("#moodboardPairing");
const moodboardClerkNotes = document.querySelector(".moodboard-clerk-notes");
const recentActivity = document.querySelector("#recentActivity");
const activityTabs = document.querySelector("#activityTabs");
const activityRailPrev = document.querySelector("#activityRailPrev");
const activityRailNext = document.querySelector("#activityRailNext");
const tonightStackSection = document.querySelector("#tonightStackSection");
const tonightQueueList = document.querySelector("#tonightQueueList");
const receiptList = document.querySelector("#receiptList");
const receiptTotal = document.querySelector("#receiptTotal");
const stackClerkNote = document.querySelector("#stackClerkNote");
const stackFlareMessage = document.querySelector("#stackFlareMessage");
const startStackScreening = document.querySelector("#startStackScreening");
const nextStackReel = document.querySelector("#nextStackReel");
const pauseStackScreening = document.querySelector("#pauseStackScreening");
const projectorSessionCard = document.querySelector("#projectorSessionCard");
const projectorSessionTitle = document.querySelector("#projectorSessionTitle");
const projectorSessionMeta = document.querySelector("#projectorSessionMeta");
const projectorTheater = document.querySelector("#projectorTheater");
const projectorTheaterBackdrop = document.querySelector("#projectorTheaterBackdrop");
const projectorTheaterClose = document.querySelector("#projectorTheaterClose");
const projectorTrailerFrame = document.querySelector("#projectorTrailerFrame");
const projectorTheaterTitle = document.querySelector("#projectorTheaterTitle");
const projectorTheaterMeta = document.querySelector("#projectorTheaterMeta");
const projectorProgressBar = document.querySelector("#projectorProgressBar");
const soundToggle = document.querySelector("#soundToggle");
const swipeCard = document.querySelector("#swipeCard");
const swipeSkip = document.querySelector("#swipeSkip");
const swipeBag = document.querySelector("#swipeBag");
const swipeReviews = document.querySelector("#swipeReviews");
const reviewDrawer = document.querySelector("#reviewDrawer");
const reviewDrawerBackdrop = document.querySelector("#reviewDrawerBackdrop");
const reviewCloseButton = document.querySelector("#reviewCloseButton");
const reviewDrawerTitle = document.querySelector("#reviewDrawerTitle");
const reviewDrawerList = document.querySelector("#reviewDrawerList");
const movieDetailExpansion = document.querySelector("#movieDetailExpansion");
const detailExpansionContent = document.querySelector("#detailExpansionContent");
const detailCloseButton = document.querySelector("#detailCloseButton");
const detailExpansionBackdrop = document.querySelector("#detailExpansionBackdrop");
const secretVhsVault = document.querySelector("#secretVhsVault");
const secretVaultBackdrop = document.querySelector("#secretVaultBackdrop");
const secretCloseButton = document.querySelector("#secretCloseButton");
const rewindSecretTapeButton = document.querySelector("#rewindSecretTape");
const easterToast = document.querySelector("#easterToast");
const projectorDescription = document.querySelector("#projectorDescription");
const projectorMeta = document.querySelector("#projectorMeta");
const projectorImage = document.querySelector("#projectorImage");
const featuredVhsImage = document.querySelector("#featuredVhsImage");
const featuredVhsTitle = document.querySelector("#featuredVhsTitle");
const projectorNext = document.querySelector("#projectorNext");
const projectorInspect = document.querySelector("#projectorInspect");
const projectorBag = document.querySelector("#projectorBag");
const quickFilters = document.querySelector(".quick-filters");
const resetFiltersButton = document.querySelector("#resetFilters");
const vhsShelf = document.querySelector(".vhs-shelf");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
const sharedLogic = window.BlockbusterLogic || {};
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

let films = [];
const rentalBag = [];
let flippedFilmId = null;
let featuredFilmIndex = 0;
let projectorTimer = null;
let isShelfDragging = false;
let shelfDragStartX = 0;
let shelfScrollStart = 0;
let draggedTapeIndex = null;
let previousRentalBagSize = 0;
let activeProjectionIndex = 0;
let projectorSessionPaused = true;
let swipeIndex = 0;
let isSwipeAnimating = false;
let soundEnabled = false;
let audioContext = null;
const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let konamiProgress = [];

const RENTAL_BAG_STORAGE_KEY = "blockbusterRentalBag";
let bagHydrated = false;
let activeFocusTrap = null;
let activityItems = [];
let activeActivityFilter = "all";
let activityPulseIndex = 0;
let activityPulseTimer = null;

function getFocusableElements(container) {
  return [...(container?.querySelectorAll(FOCUSABLE_SELECTOR) || [])].filter(
    (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
  );
}

function activateFocusTrap(container, preferredFocus) {
  if (!container) {
    return;
  }

  activeFocusTrap = {
    container,
    previousFocus: document.activeElement instanceof HTMLElement ? document.activeElement : null,
  };

  window.requestAnimationFrame(() => {
    const firstFocusable = getFocusableElements(container)[0];
    (preferredFocus || firstFocusable || container).focus?.({ preventScroll: true });
  });
}

function releaseFocusTrap(container, fallbackFocus) {
  if (!activeFocusTrap || activeFocusTrap.container !== container) {
    return;
  }

  const previousFocus = activeFocusTrap.previousFocus;
  activeFocusTrap = null;
  (fallbackFocus || previousFocus)?.focus?.({ preventScroll: true });
}

function trapFocus(event) {
  if (event.key !== "Tab" || !activeFocusTrap) {
    return false;
  }

  const focusable = getFocusableElements(activeFocusTrap.container);
  if (!focusable.length) {
    event.preventDefault();
    activeFocusTrap.container.focus?.({ preventScroll: true });
    return true;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return true;
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
    return true;
  }

  return false;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const vhsDetails = {
  "The Dark Knight": {
    runtime: "152 min",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    criticRating: "A+ Staff Shelf",
    employee: "Josh",
    staffTag: "Friday night essential",
    staffNote: "Josh recommends: lights off, sound up.",
    employeeRecommendation:
      "For the customer who wants cape-movie scale with old-school crime-thriller bite. Rent it when the room is quiet and the volume can climb.",
  },
  Moonlight: {
    runtime: "111 min",
    cast: ["Trevante Rhodes", "Ashton Sanders", "Mahershala Ali"],
    criticRating: "A Art House Pick",
    employee: "Maya",
    staffTag: "Quiet masterpiece",
    staffNote: "Maya says: return it when your heart recovers.",
    employeeRecommendation:
      "A beautiful late-night rental when you want something intimate, poetic, and impossible to shake after the credits.",
  },
  Hereditary: {
    runtime: "127 min",
    cast: ["Toni Collette", "Alex Wolff", "Milly Shapiro"],
    criticRating: "A- Midnight Rental",
    employee: "Luis",
    staffTag: "Do not watch alone",
    staffNote: "Luis warns: keep the hallway light on.",
    employeeRecommendation:
      "Only pull this one from the Horror Vault if everyone agreed to be scared before the tape goes in.",
  },
  "Everything Everywhere All At Once": {
    runtime: "139 min",
    cast: ["Michelle Yeoh", "Ke Huy Quan", "Stephanie Hsu"],
    criticRating: "A+ Multiverse Pick",
    employee: "Sam",
    staffTag: "Cult classic energy",
    staffNote: "Sam says: weird, warm, totally worth it.",
    employeeRecommendation:
      "The staff pick for a group that wants chaos, laughs, tears, and a giant swing that actually lands.",
  },
};

async function fetchFilms() {
  try {
    const result = window.BlockbusterApi
      ? await window.BlockbusterApi.loadFilms()
      : { films: await fetch("data/films.json").then((response) => response.json()), source: "curated-json" };
    films = result.films;
    document.documentElement.dataset.catalogSource = result.source;
    hydrateRentalBag();
    populateGenreFilter(films);
    renderFilms(films);
    renderActivityFeed(films);
    renderProjectorFeature(0);
    renderSwipeCard();
    startProjectorRotation();
  } catch (error) {
    movieGrid.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <h2>Rental shelf unavailable</h2>
          <p>${error.message}</p>
        </div>
      </div>
    `;
    resultsCount.textContent = "No data available";
  }
}

function renderProjectorFeature(index) {
  if (
    !films.length ||
    !projectorDescription ||
    !projectorMeta ||
    !projectorImage ||
    !featuredVhsImage ||
    !featuredVhsTitle
  ) {
    return;
  }

  featuredFilmIndex = (index + films.length) % films.length;
  const film = films[featuredFilmIndex];
  const details = getBackCoverDetails(film);
  const staffPick = getStaffPick(film, featuredFilmIndex);

  projectorDescription.textContent = `${staffPick.employee}'s current projector pick: ${film.description}`;
  projectorMeta.innerHTML = `
    <span>${staffPick.tag}</span>
    <span>${getAisleName(film.genre)}</span>
    <span>${details.runtime}</span>
  `;
  projectorImage.src = film.poster;
  projectorImage.alt = "";
  featuredVhsImage.src = film.poster;
  featuredVhsImage.alt = `${film.title} featured VHS cover`;
  featuredVhsTitle.textContent = film.title;
  updateProjectorBagButton(film);

  const display = document.querySelector(".featured-vhs-display");
  if (!display) {
    return;
  }

  display.classList.remove("is-switching");
  window.requestAnimationFrame(() => {
    display.classList.add("is-switching");
  });
}

function showNextProjectorFilm() {
  renderProjectorFeature(featuredFilmIndex + 1);
  startProjectorRotation();
}

let projectorInView = true;

function startProjectorRotation() {
  window.clearInterval(projectorTimer);
  projectorTimer = null;

  // Don't burn timers/animations while the tab is hidden or the
  // projector section is scrolled out of view.
  if (
    document.hidden ||
    reducedMotionQuery.matches ||
    !projectorInView ||
    !films.length ||
    !projectorDescription
  ) {
    return;
  }

  projectorTimer = window.setInterval(() => {
    renderProjectorFeature(featuredFilmIndex + 1);
  }, 6500);
}

function refreshProjectorRotation() {
  startProjectorRotation();
}

function inspectProjectorFilm() {
  if (!films.length) {
    return;
  }

  openMovieDetail(films[featuredFilmIndex]);
}

function updateProjectorBagButton(film) {
  if (!projectorBag) {
    return;
  }

  const isBagged = rentalBag.some((rental) => rental.id === film.id);
  projectorBag.textContent = isBagged ? "In The Bag" : "Throw In Bag";
  projectorBag.classList.toggle("btn-light", isBagged);
  projectorBag.classList.toggle("btn-warning", !isBagged);
  projectorBag.setAttribute("aria-pressed", String(isBagged));
}

function populateGenreFilter(movieList) {
  const genres = ["All", ...new Set(movieList.map((film) => film.genre))];

  genreFilter.innerHTML = "";
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre === "All" ? "All aisles" : getAisleName(genre);
    genreFilter.appendChild(option);
  });
}

function getLiveViewerCount(film, index = 0) {
  return 18 + ((film.id * 19 + index * 7) % 86);
}

function renderLiveWatchingStrip(film, index = 0) {
  const count = getLiveViewerCount(film, index);
  const label = count === 1 ? "person" : "people";

  return `
    <div class="live-watch-strip" aria-label="${count} ${label} streaming ${film.title} right now">
      <span class="live-dot" aria-hidden="true"></span>
      <strong>${count}</strong>
      <span>streaming right now</span>
      <span class="live-mini-eq" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </span>
    </div>
  `;
}

function renderFilms(movieList) {
  movieGrid.innerHTML = "";

  if (movieList.length === 0) {
    movieGrid.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <h2>No rentals found</h2>
          <p>No rentals found. Try another title or aisle.</p>
          <button class="btn btn-warning" type="button" id="emptyReset">
            Reset filters
          </button>
        </div>
      </div>
    `;
    resultsCount.textContent = "Now Renting: 0 rentals";
    return;
  }

  movieList.forEach((film, index) => {
    const isBagged = rentalBag.some((rental) => rental.id === film.id);
    const shelfTag = getShelfTag(film, index);
    const backDetails = getBackCoverDetails(film);
    const staffPick = getStaffPick(film, index);
    const review = getReview(film);
    const barcodeLabel = getBarcodeLabel(film);
    const cardColumn = document.createElement("article");
    cardColumn.className = "col-lg-4 col-md-6 vhs-slot";
    cardColumn.style.animationDelay = `${index * 80}ms`;

    cardColumn.innerHTML = `
      <div class="shelf-shadow" aria-hidden="true"></div>
      <div
        class="card movie-card vhs-card catalog-card h-100 ${flippedFilmId === film.id ? "is-flipped" : ""}"
        tabindex="0"
        role="button"
        data-card-film-id="${film.id}"
        aria-pressed="${flippedFilmId === film.id}"
        aria-label="Flip ${film.title} VHS case to the back cover"
      >
        <div class="vhs-case-inner">
          <div class="vhs-face vhs-front">
            <div class="vhs-gloss" aria-hidden="true"></div>
            <div class="vhs-spine" aria-hidden="true">
              <span>${getAisleName(film.genre)}</span>
            </div>
            <div class="poster-frame">
              <img src="${film.poster}" class="card-img-top" alt="${film.title} VHS cover" width="500" height="750" loading="lazy" decoding="async">
              <span class="rental-sticker">BLOCKBUSTER VIDEO</span>
              <span class="rewind-label">BE KIND REWIND</span>
              <span class="shelf-tag">${shelfTag}</span>
              <span class="staff-pick-sticker">${staffPick.employee} pick</span>
              <span class="barcode-label">${barcodeLabel}</span>
              <span class="fingerprint-smudge" aria-hidden="true"></span>
              <span class="scratch-map" aria-hidden="true"></span>
              <span class="pull-tab">Click to flip</span>
              <span class="bagged-badge ${isBagged ? "is-visible" : ""}">Bagged</span>
            </div>
            ${renderLiveWatchingStrip(film, index)}
            <div class="card-body d-flex flex-column">
              <div class="badge-row movie-meta">
                <span>${getAisleName(film.genre)}</span>
                <span>${film.year}</span>
              </div>
              <h3 class="card-title">${film.title}</h3>
              <p class="front-cover-hint">Flip for synopsis, cast, reviews, and clerk notes.</p>
              <button
                class="btn ${isBagged ? "btn-light" : "btn-warning"} bag-button mt-auto"
                type="button"
                data-film-id="${film.id}"
                aria-pressed="${isBagged}"
              >
                ${isBagged ? "In The Bag" : "Throw In Bag"}
              </button>
              <p class="bag-confirmation ${isBagged ? "is-visible" : ""}">
                Dropped into your rental bag
              </p>
            </div>
          </div>
          <div class="vhs-face vhs-back">
            <div class="vhs-gloss" aria-hidden="true"></div>
            <div class="vhs-back-spine" aria-hidden="true">
              <span>${getAisleName(film.genre)}</span>
            </div>
            <div class="back-cover-content">
              <p class="back-label">Rental Back Cover</p>
              <h3>${film.title}</h3>
              <button class="flip-front-button" type="button" data-flip-front="${film.id}">
                Flip Front
              </button>
              <div class="back-detail-grid">
                <span>Director</span>
                <strong>${film.director}</strong>
                <span>Aisle</span>
                <strong>${getAisleName(film.genre)}</strong>
                <span>Year</span>
                <strong>${film.year}</strong>
                <span>Runtime</span>
                <strong>${backDetails.runtime}</strong>
                <span>Critic Rating</span>
                <strong>${backDetails.criticRating}</strong>
              </div>
              <p class="back-synopsis">${backDetails.synopsis}</p>
              <div class="back-staff-note">
                <span>${staffPick.tag}</span>
                <p>${staffPick.note}</p>
              </div>
              <div class="mini-review back-review">
                <span class="review-avatar">${review.avatar}</span>
                <div>
                  <p class="review-stars">${renderStars(review.stars)}</p>
                  <blockquote>“${review.quote}”</blockquote>
                  <cite>— @${review.username}</cite>
                </div>
              </div>
              <div class="back-cast">
                <span>Cast</span>
                <p>${backDetails.cast.join(" · ")}</p>
              </div>
              <div class="back-vibes">
                <span>Favorite Scene</span>
                <p>${film.favoriteScene || "Ask the counter clerk for the scene everyone talks about."}</p>
              </div>
              <div class="back-barcode" aria-hidden="true"></div>
              <p class="back-hint">Click case to flip front, or open the full rental box.</p>
            </div>
          </div>
        </div>
        <button class="btn btn-warning btn-sm back-info-button back-info-hotspot" type="button" data-open-detail="${film.id}">
          Open Full Box
        </button>
      </div>
    `;

    movieGrid.appendChild(cardColumn);
  });

  resultsCount.textContent = `Now Renting: ${movieList.length} available`;
}

const backCoverCache = new Map();

function getBackCoverDetails(film) {
  const cached = backCoverCache.get(film.id);
  if (cached) {
    return cached;
  }

  const fallback = {
    runtime: `${film.runtime || 100 + film.id * 7} min`,
    cast: ["Store Favorite", "Cult Performer", "Friday Night Regular"],
    criticRating: film.rating >= 8 ? "A Staff Pick" : "B+ Rental Shelf",
    employeeRecommendation: getStaffPick(film, film.id).recommendation,
    employee: getStaffPick(film, film.id).employee,
    staffTag: getStaffPick(film, film.id).tag,
    staffNote: getStaffPick(film, film.id).note,
  };
  const details = vhsDetails[film.title] || fallback;
  const staffPick = getStaffPick(film, film.id);

  const result = {
    employee: staffPick.employee,
    staffTag: staffPick.tag,
    staffNote: staffPick.note,
    ...details,
    synopsis: `${film.description} A Blockbuster+ rental-card favorite with shelf-worn charm, late-fee energy, and enough replay value for one more weekend checkout.`,
  };
  backCoverCache.set(film.id, result);
  return result;
}

function getStaffPick(film, index) {
  const staffPicks = {
    Action: {
      employee: "Josh",
      tag: "Friday night essential",
      note: "Josh recommends: loud, late, and rented with snacks.",
      recommendation:
        "Josh keeps this one near the counter for anyone who wants a big-screen rush without gambling on movie night.",
    },
    Drama: {
      employee: "Maya",
      tag: "Employee favorite",
      note: "Maya says: the kind you talk about after.",
      recommendation:
        "Maya recommends this for the customer who wanders the aisles looking for something honest and beautifully made.",
    },
    Horror: {
      employee: "Luis",
      tag: "Midnight dare",
      note: "Luis warns: rent with brave friends.",
      recommendation:
        "Luis says this is the shelf pull for a rainy 11PM watch when everyone claims they do not scare easily.",
    },
    "Sci-Fi": {
      employee: "Sam",
      tag: "Cult classic",
      note: "Sam says: weird in the best possible way.",
      recommendation:
        "Sam recommends this when the group wants imagination, neon chaos, and something with real rewatch gravity.",
    },
    Romance: {
      employee: "Nina",
      tag: "Date night pick",
      note: "Nina says: bittersweet, glossy, perfect.",
      recommendation:
        "Nina keeps this ready for date night customers who want glow, music, and a little heartbreak.",
    },
    Animation: {
      employee: "Chris",
      tag: "Weekend crowd-pleaser",
      note: "Chris says: impossible not to grin.",
      recommendation:
        "Chris recommends this for a mixed room where everyone wants color, jokes, and heart.",
    },
  };
  const fallbackNames = ["Josh", "Maya", "Luis", "Sam"];
  const fallbackTags = ["Staff pick", "Friday night essential", "Cult classic", "Counter favorite"];
  const pick = staffPicks[film.genre] || {
    employee: fallbackNames[index % fallbackNames.length],
    tag: fallbackTags[index % fallbackTags.length],
    note: "Staff says: worth the late fee.",
    employeeRecommendation:
      "A dependable weekend checkout with enough replay value to earn a spot near the counter.",
  };

  return {
    employee: pick.employee,
    tag: pick.tag,
    note: pick.note,
    recommendation: pick.recommendation || pick.employeeRecommendation,
  };
}

function getCultureTags(film, index) {
  if (Array.isArray(film.cultureTags) && film.cultureTags.length > 0) {
    return film.cultureTags.slice(0, 1);
  }

  return [getShelfTag(film, index), film.rating >= 8 ? "MOST REWATCHED" : "COUNTER FAVORITE"];
}

const reviewCache = new Map();

function getReview(film) {
  let review = reviewCache.get(film.id);
  if (!review) {
    review = film.review || {
      stars: 4,
      username: "videostoreregular",
      avatar: "VR",
      quote: "Exactly the kind of tape you hope to find on the shelf.",
    };
    reviewCache.set(film.id, review);
  }
  return review;
}

function getReviews(film) {
  if (Array.isArray(film.reviews) && film.reviews.length > 0) {
    return film.reviews;
  }

  const mainReview = getReview(film);
  return [
    mainReview,
    {
      stars: Math.max(3.5, mainReview.stars - 0.5),
      username: "videostorekid",
      avatar: "VK",
      quote: "Midnight rental energy with a shelf-worn soul.",
    },
    {
      stars: Math.min(5, mainReview.stars + 0.5),
      username: "aisleregular",
      avatar: "AR",
      quote: "The kind of tape you recommend before the credits finish.",
    },
  ];
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const stars = "★".repeat(fullStars) + (hasHalf ? "½" : "");
  return stars.padEnd(5, "☆");
}

function getCurrentSwipeFilm() {
  return films[swipeIndex] || null;
}

function renderSwipeCard() {
  if (!swipeCard) {
    return;
  }

  const film = getCurrentSwipeFilm();

  swipeCard.classList.remove("is-swiping-left", "is-swiping-right");

  if (!film) {
    swipeCard.innerHTML = `
      <div class="swipe-end-state">
        <p class="eyebrow">End of shelf</p>
        <h3>You reached the end of the shelf.</h3>
        <p>Start over to keep browsing the digital VHS wall.</p>
        <button class="btn btn-warning" id="swipeStartOver" type="button">Start Over</button>
      </div>
    `;
    swipeSkip.disabled = true;
    swipeBag.disabled = true;
    swipeReviews.disabled = true;
    return;
  }

  const isBagged = rentalBag.some((rental) => rental.id === film.id);
  swipeSkip.disabled = false;
  swipeBag.disabled = false;
  swipeReviews.disabled = false;
  swipeBag.textContent = isBagged ? "In The Bag" : "Throw In Bag";
  swipeBag.classList.toggle("btn-light", isBagged);
  swipeBag.classList.toggle("btn-warning", !isBagged);

  swipeCard.innerHTML = `
    <article class="swipe-vhs-case" aria-label="${film.title} swipeable VHS rental">
      <div class="swipe-vhs-spine"><span>${getAisleName(film.genre)}</span></div>
      <div class="swipe-vhs-cover">
        <img src="${film.poster}" alt="${film.title} VHS cover" width="500" height="750" loading="lazy" decoding="async">
        <span class="swipe-store-sticker">BLOCKBUSTER VIDEO</span>
        <span class="swipe-rewind-sticker">BE KIND REWIND</span>
        <span class="swipe-barcode">${getBarcodeLabel(film)}</span>
        <div class="swipe-copy">
          <div class="culture-tags">
            ${getCultureTags(film, swipeIndex)
              .map((tag) => `<span>${tag}</span>`)
              .join("")}
          </div>
          <h3>${film.title}</h3>
          <p>${film.description}</p>
          <div class="mini-review">
            <span class="review-avatar">${getReview(film).avatar}</span>
            <div>
              <p class="review-stars">${renderStars(getReview(film).stars)}</p>
              <blockquote>“${getReview(film).quote}”</blockquote>
              <cite>— @${getReview(film).username}</cite>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function advanceSwipe(direction) {
  if (isSwipeAnimating || !getCurrentSwipeFilm()) {
    return;
  }

  isSwipeAnimating = true;
  swipeCard.classList.add(direction === "left" ? "is-swiping-left" : "is-swiping-right");
  window.setTimeout(() => {
    swipeIndex += 1;
    isSwipeAnimating = false;
    renderSwipeCard();
  }, 420);
}

function handleSwipeSkip() {
  playInteractionSound("skip");
  advanceSwipe("left");
}

function addFilmToRentalBag(film, sourceButton, activityMessage) {
  if (!film || rentalBag.some((rental) => rental.id === film.id)) {
    return false;
  }

  if (sourceButton) {
    animateTinyVhs(sourceButton, film);
  }
  rentalBag.push(film);
  updateRentalBag();
  if (films[featuredFilmIndex]?.id === film.id) {
    updateProjectorBagButton(film);
  }
  syncFilmBagState(film);
  prependActivity(
    film,
    activityMessage ||
      `@you dropped ${film.title} into the rental bag`,
  );
  animateRentalBag();
  showBagDropToast("Dropped into the rental bag");
  playInteractionSound("bag");
  return true;
}

function shouldLeadToCheckout(sourceButton) {
  return Boolean(
    sourceButton?.closest("#movieGrid") ||
      sourceButton?.closest(".movie-detail-expansion")
  );
}

function leadShelfRentalToCheckout(film, sourceButton, alreadyInBag = false) {
  if (!tonightStackSection || !shouldLeadToCheckout(sourceButton)) {
    return;
  }

  if (stackFlareMessage) {
    stackFlareMessage.textContent = alreadyInBag
      ? `${film.title} is already waiting at checkout.`
      : `${film.title} is waiting beside the register.`;
  }

  window.setTimeout(() => {
    if (sourceButton.closest(".movie-detail-expansion")) {
      closeMovieDetail();
    }

    tonightStackSection.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
    tonightStackSection.classList.remove("is-guiding");
    window.requestAnimationFrame(() => {
      tonightStackSection.classList.add("is-guiding");
    });
  }, alreadyInBag ? 120 : 780);

  window.setTimeout(() => {
    tonightStackSection.classList.remove("is-guiding");
  }, 2300);
}

function handleSwipeBag() {
  addFilmToRentalBag(getCurrentSwipeFilm(), swipeBag);
  advanceSwipe("right");
}

function syncFilmBagState(film) {
  if (!film) {
    return;
  }

  const isBagged = rentalBag.some((rental) => rental.id === film.id);
  document.querySelectorAll(`[data-film-id="${film.id}"]`).forEach((button) => {
    if (
      button.classList.contains("bag-button") ||
      button.classList.contains("detail-bag-button") ||
      button.classList.contains("midnight-bag-button") ||
      button.classList.contains("midnight-queue-button")
    ) {
      button.classList.toggle("btn-warning", !isBagged);
      button.classList.toggle("btn-light", isBagged);
      button.setAttribute("aria-pressed", String(isBagged));
      if (button.classList.contains("midnight-queue-button")) {
        button.textContent = isBagged ? "Saved To Night Bag" : "Save To Night Bag";
      } else {
        button.textContent = isBagged ? "In The Bag" : "Throw In Bag";
      }
    }
  });

  document
    .querySelector(`.vhs-card[data-card-film-id="${film.id}"] .bagged-badge`)
    ?.classList.toggle("is-visible", isBagged);
  document
    .querySelector(`.vhs-card[data-card-film-id="${film.id}"] .bag-confirmation`)
    ?.classList.toggle("is-visible", isBagged);

  if (films[featuredFilmIndex]?.id === film.id) {
    updateProjectorBagButton(film);
  }
}

function openSwipeReviews() {
  const film = getCurrentSwipeFilm();

  if (!film) {
    return;
  }

  reviewDrawerTitle.textContent = `${film.title} Reviews`;
  reviewDrawerList.innerHTML = getReviews(film)
    .slice(0, 3)
    .map(
      (review) => `
        <article class="drawer-review">
          <span class="review-avatar">${review.avatar}</span>
          <div>
            <p class="review-stars">${renderStars(review.stars)}</p>
            <blockquote>“${review.quote}”</blockquote>
            <cite>— @${review.username}</cite>
          </div>
        </article>
      `,
    )
    .join("");
  reviewDrawer.classList.add("is-open");
  reviewDrawer.setAttribute("aria-hidden", "false");
  activateFocusTrap(reviewDrawer, reviewCloseButton);
}

function closeSwipeReviews() {
  reviewDrawer.classList.remove("is-open");
  reviewDrawer.setAttribute("aria-hidden", "true");
  releaseFocusTrap(reviewDrawer, swipeReviews);
}

function handleReviewDrawerClick(event) {
  if (
    event.target === reviewDrawerBackdrop ||
    event.target === reviewCloseButton ||
    event.target.closest("#reviewCloseButton")
  ) {
    closeSwipeReviews();
  }
}

function handleSwipeCardClick(event) {
  if (!event.target.closest("#swipeStartOver")) {
    return;
  }

  swipeIndex = 0;
  renderSwipeCard();
}

function getShelfTag(film, index) {
  if (film.year >= 2020) {
    return "NEW RELEASE";
  }

  if (index % 3 === 0 || film.rating >= 8) {
    return "STAFF PICK";
  }

  return getAisleName(film.genre).toUpperCase();
}

function getCaseCondition(film, index) {
  const conditions = [
    "WORN EDGES",
    "COUNTER COPY",
    "MOST RENTED",
    "FRIDAY PICK",
    "EMPLOYEE FAVORITE",
    "RETURN BY MONDAY",
  ];

  if (film.rating >= 8.5) {
    return "MOST RENTED";
  }

  return conditions[index % conditions.length];
}

function getBarcodeLabel(film) {
  return `BB+ ${String(film.id).padStart(3, "0")}-${film.year}`;
}

function getAisleName(genre) {
  const aisleNames = {
    Action: "Desert Chrome",
    Drama: "Quiet Apartment Movies",
    Horror: "Midnight Horror",
    "Sci-Fi": "Existential Sci-Fi",
    Romance: "Rainy Tokyo",
    Animation: "Sleepover Rentals",
  };

  return aisleNames[genre] || `${genre} Aisle`;
}

function persistRentalBag() {
  if (!bagHydrated) {
    return;
  }

  try {
    localStorage.setItem(
      RENTAL_BAG_STORAGE_KEY,
      sharedLogic.serializeRentalBagIds
        ? sharedLogic.serializeRentalBagIds(rentalBag)
        : JSON.stringify(rentalBag.map((film) => film.id)),
    );
  } catch (error) {
    /* storage unavailable (private mode / quota) — bag stays in-memory only */
  }
}

function hydrateRentalBag() {
  let savedIds = [];

  try {
    savedIds = JSON.parse(localStorage.getItem(RENTAL_BAG_STORAGE_KEY) || "[]");
  } catch (error) {
    savedIds = [];
  }

  const hydratedFilms = sharedLogic.hydrateRentalBagFromIds
    ? sharedLogic.hydrateRentalBagFromIds(savedIds, films)
    : [];

  if (hydratedFilms.length) {
    rentalBag.push(...hydratedFilms);
  } else if (Array.isArray(savedIds)) {
    savedIds.forEach((id) => {
      const film = films.find((movie) => movie.id === id);
      if (film && !rentalBag.some((rental) => rental.id === id)) {
        rentalBag.push(film);
      }
    });
  }

  bagHydrated = true;
  previousRentalBagSize = rentalBag.length;
  updateRentalBag();
}

function updateRentalBag() {
  const bagSize = rentalBag.length;
  const label = `Rental Bag: ${bagSize} film${bagSize === 1 ? "" : "s"}`;
  const addedToStack = bagSize > previousRentalBagSize;

  bagCountLabel.textContent = label;
  bagCounter.textContent = bagSize;
  bagTotal.textContent = `Total rentals: ${bagSize}`;
  renderFloatingRentalStack();
  checkoutVhs.textContent = bagSize === 0 ? "Add a Tape First" : "Checkout VHS";
  checkoutVhs.disabled = bagSize === 0;
  updateWatchlistPanel();
  updateTonightQueue();
  if (addedToStack) {
    animateTonightStackDrop(rentalBag[bagSize - 1]);
  }
  previousRentalBagSize = bagSize;
  persistRentalBag();

  if (bagSize === 0) {
    bagItems.innerHTML = `
      <div class="bag-empty-state">
        <p>Your plastic checkout bag is empty.</p>
      </div>
    `;
    return;
  }

  bagItems.innerHTML = "";
  rentalBag.forEach((film) => {
    const item = document.createElement("article");
    item.className = "bag-item";
    item.innerHTML = `
      <img src="${film.poster}" alt="${film.title} poster thumbnail" width="80" height="120" loading="lazy" decoding="async">
      <div>
        <h3>${film.title}</h3>
        <p>${getAisleName(film.genre)} · ${film.year}</p>
      </div>
      <button type="button" data-remove-id="${film.id}" aria-label="Remove ${film.title}">
        Remove
      </button>
    `;
    bagItems.appendChild(item);
  });
}

function renderFloatingRentalStack() {
  if (!rentalBagCaseStack) {
    return;
  }

  const visibleFilms = rentalBag.slice(-5);
  const hiddenCount = Math.max(0, rentalBag.length - visibleFilms.length);

  rentalBagCaseStack.innerHTML = visibleFilms
    .map((film, index) => {
      const order = visibleFilms.length - index - 1;
      return `
        <article
          class="bag-stack-case"
          aria-label="${film.title} stacked in the rental bag"
          style="--bag-case-order: ${order}; --bag-case-tilt: ${[-5, 4, -2, 3, -4][index % 5]}deg;"
        >
          <span class="bag-stack-spine" aria-hidden="true"></span>
          <img src="${film.poster}" alt="" width="80" height="120" loading="lazy" decoding="async">
          <strong>${film.title}</strong>
        </article>
      `;
    })
    .join("");

  if (hiddenCount > 0) {
    rentalBagCaseStack.insertAdjacentHTML("beforeend", `<span class="bag-stack-more">+${hiddenCount} more</span>`);
  }

  rentalBagCaseStack.classList.toggle("is-empty", rentalBag.length === 0);
  rentalBagCaseStack.classList.remove("is-stacking");
  window.requestAnimationFrame(() => {
    rentalBagCaseStack.classList.add("is-stacking");
  });
}

function renderCheckoutShelfStack() {
  const placeholderLabels = ["MOVIES", "TV SHOWS", "SPORTS", "HOME VIDEOS", "WEDDING", "CONCERTS", "COMMERCIALS"];
  const visibleTapeLimit = 4;
  const stackItems = rentalBag.length
    ? rentalBag.slice(0, visibleTapeLimit).map((film, index) => ({
        id: film.id,
        label: film.title,
        meta: `${getAisleName(film.genre)} • ${film.runtime || "??"} min`,
        removable: true,
        index,
      }))
    : placeholderLabels.slice(0, visibleTapeLimit).map((label, index) => ({
        id: null,
        label,
        meta: index === 0 ? "waiting for tonight's first rental" : "blank counter tape",
        removable: false,
        index,
      }));
  const hiddenCount = Math.max(0, rentalBag.length - stackItems.length);

  return `
    <li class="checkout-vhs-stack-wrap ${rentalBag.length === 0 ? "is-empty" : "has-rentals"}">
      <div class="checkout-vhs-stack" aria-label="${rentalBag.length ? "VHS tapes stacked on the checkout counter" : "Empty VHS stack waiting for rentals"}">
        ${stackItems
          .map(
            (item) => `
              <div
                class="checkout-vhs-case ${item.removable ? "is-rental" : "is-placeholder"}"
                style="--case-index: ${item.index}; --case-tilt: ${(item.index % 2 === 0 ? -0.45 : 0.36).toFixed(2)}deg"
              >
                <span class="checkout-vhs-spine">${item.removable ? String(item.index + 1).padStart(2, "0") : "BB+"}</span>
                <span class="checkout-vhs-label">${escapeHtml(item.label)}</span>
                <span class="checkout-vhs-meta">${escapeHtml(item.meta)}</span>
                ${
                  item.removable
                    ? `<button type="button" data-stack-remove="${item.id}" aria-label="Remove ${escapeHtml(item.label)} from Tonight's Stack">×</button>`
                    : ""
                }
              </div>
            `,
          )
          .join("")}
        ${hiddenCount ? `<span class="checkout-vhs-more">+${hiddenCount} more tapes behind the counter</span>` : ""}
      </div>
      <p class="checkout-vhs-stack-caption">
        ${
          rentalBag.length
            ? `${rentalBag.length} tape${rentalBag.length === 1 ? "" : "s"} stacked beside the register.`
            : "NO TAPES ON THE COUNTER. Pull a VHS from the shelf to start the stack."
        }
      </p>
    </li>
  `;
}

function updateTonightQueue() {
  if (!tonightQueueList || !receiptList || !receiptTotal || !stackClerkNote || !startStackScreening) {
    return;
  }

  if (rentalBag.length === 0) {
    // Keep "Start Projector" clickable so it can show the cinematic
    // "No tape loaded into the projector." warning (spec'd empty state).
    startStackScreening.disabled = false;
    nextStackReel.disabled = true;
    pauseStackScreening.disabled = true;
    receiptList.innerHTML = `
      <li class="receipt-meta"><span>STORE</span> BB+ 0482 / AFTER HOURS</li>
      <li class="receipt-meta"><span>COUNTER</span> EMPTY VHS STACK</li>
      <li>Waiting for rentals...</li>
      <li class="receipt-meta"><span>CLERK</span> projector warming under blue light</li>
    `;
    receiptTotal.textContent = "0 tapes • projector idle • return before sunrise";
    stackClerkNote.textContent = "Pull a VHS from the shelf and the clerk will call the vibe.";
    projectorSessionPaused = true;
    activeProjectionIndex = 0;
    updateProjectorSession();
    tonightQueueList.innerHTML = renderCheckoutShelfStack();
    return;
  }

  const totalRuntime = rentalBag.reduce((total, film) => total + (film.runtime || 0), 0);
  const hours = Math.floor(totalRuntime / 60);
  const minutes = totalRuntime % 60;
  const runtimeLabel = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  const projectedMood = getProjectedMood(rentalBag);
  const lateFeeRisk = getLateFeeRisk(totalRuntime, rentalBag.length);
  const firstFilm = rentalBag[0];
  const mostReplayedScene = firstFilm?.favoriteScene || "front counter scene";
  const stormRental = rentalBag.some((film) => (film.weatherTags || []).includes("Thunderstorm") || film.genre === "Horror");
  const receiptWeather = stormRental ? "Projected during rainstorm" : "Best watched after midnight";

  startStackScreening.disabled = false;
  nextStackReel.disabled = false;
  pauseStackScreening.disabled = projectorSessionPaused && !projectorSessionCard?.classList.contains("is-live");
  stackClerkNote.textContent = getClerkNote(rentalBag);
  receiptList.innerHTML = `
    <li class="receipt-meta"><span>STORE</span> BB+ 0482 / AFTER HOURS</li>
    <li class="receipt-meta"><span>RETURN</span> BY SUNRISE</li>
    <li class="receipt-meta"><span>NOTE</span> ${receiptWeather}</li>
    ${rentalBag
      .map((film, index) => `<li><span>${String(index + 1).padStart(2, "0")}.</span> ${film.title}</li>`)
      .join("")}
    <li class="receipt-meta"><span>REPLAY</span> ${mostReplayedScene}</li>
  `;
  receiptTotal.textContent = `${rentalBag.length} tape${rentalBag.length === 1 ? "" : "s"} • ${runtimeLabel} • ${projectedMood} • ${lateFeeRisk}`;
  updateProjectorSession();

  tonightQueueList.innerHTML = renderCheckoutShelfStack();
}

function updateProjectorSession() {
  if (!projectorSessionCard || !projectorSessionTitle || !projectorSessionMeta || !projectorProgressBar) {
    return;
  }

  if (rentalBag.length === 0) {
    projectorSessionCard.classList.remove("is-live", "is-paused");
    projectorSessionTitle.textContent = "Projector idle";
    projectorSessionMeta.textContent = "Start the projector when your stack is ready.";
    projectorProgressBar.style.width = "0%";
    pauseStackScreening.textContent = "Pause Screening";
    pauseStackScreening.disabled = true;
    return;
  }

  activeProjectionIndex = Math.min(activeProjectionIndex, rentalBag.length - 1);
  const film = rentalBag[activeProjectionIndex];
  const runtime = film.runtime || 0;
  const progress = projectorSessionPaused ? Math.max(16, (activeProjectionIndex / rentalBag.length) * 100) : 42;
  const state = projectorSessionPaused ? "paused at the counter" : "currently projecting";

  projectorSessionCard.classList.toggle("is-live", !projectorSessionPaused);
  projectorSessionCard.classList.toggle("is-paused", projectorSessionPaused);
  projectorSessionTitle.textContent = film.title;
  projectorSessionMeta.textContent = `${state} • ${getAisleName(film.genre)} • ${runtime} min • ${film.director}`;
  projectorProgressBar.style.width = `${Math.min(96, Math.max(10, progress))}%`;
  pauseStackScreening.textContent = projectorSessionPaused ? "Resume Screening" : "Pause Screening";
  pauseStackScreening.disabled = false;
}

function getProjectedMood(stack) {
  const genres = stack.map((film) => film.genre);

  if (genres.filter((genre) => genre === "Horror").length >= 1) {
    return "midnight horror spiral";
  }

  if (genres.includes("Drama") && genres.includes("Romance")) {
    return "neon loneliness";
  }

  if (genres.includes("Action") && stack.length >= 2) {
    return "adrenaline double bill";
  }

  if (stack.length >= 3) {
    return "sleep-deprived film student energy";
  }

  return "clerk-approved movie night";
}

function getLateFeeRisk(totalRuntime, stackSize) {
  if (totalRuntime >= 360) {
    return "late fee risk: legendary";
  }

  if (stackSize >= 3) {
    return "late fee risk: emotionally unsafe";
  }

  return "late fee risk: manageable";
}

function getClerkNote(stack) {
  const firstFilm = stack[0];
  const hasHorror = stack.some((film) => film.genre === "Horror");
  const hasDrama = stack.some((film) => film.genre === "Drama");
  const hasAction = stack.some((film) => film.genre === "Action");

  if (hasHorror) {
    return "Don't start the scary tape after midnight unless you're emotionally prepared.";
  }

  if (hasDrama && stack.length > 1) {
    return "Excellent rainy-night stack. Keep the lights low and your phone across the room.";
  }

  if (hasAction) {
    return "This lineup pairs well with cherry coke, loud speakers, and no early bedtime.";
  }

  return `${firstFilm.title} is a strong first pull. The clerk approves this shelf energy.`;
}

function getMoodboardEnergy(stack) {
  const genres = stack.map((film) => film.genre);
  const hasHorror = genres.includes("Horror");
  const hasSciFi = genres.includes("Sci-Fi");
  const hasDrama = genres.includes("Drama");
  const hasRomance = genres.includes("Romance");
  const hasAction = genres.includes("Action");

  if (stack.length === 0) {
    return "The projector is waiting.";
  }

  if (hasHorror && hasSciFi) {
    return "Emotionally unsafe after-hours spiral.";
  }

  if (hasDrama && hasRomance) {
    return "Rainy-window heartbreak double feature.";
  }

  if (hasAction && stack.length > 1) {
    return "Cherry-coke adrenaline counter stack.";
  }

  if (stack.length >= 4) {
    return "Sleep-deprived film-club ritual.";
  }

  return `${stack[0].title} sets the room tone.`;
}

function getMoodboardPairing(stack) {
  if (stack.length === 0) {
    return "No double-feature pinned yet.";
  }

  if (stack.length === 1) {
    return `Start with ${stack[0].title}, then let the shelf argue back.`;
  }

  return `Double-feature spine: ${stack[0].title} + ${stack[1].title}`;
}

function getMoodboardNotes(stack) {
  if (stack.length === 0) {
    return [
      "Pull a case from the aisle.",
      "Build a beautiful shelf mess.",
      "Emotional damage gets a late-fee waiver.",
    ];
  }

  const notes = [
    getClerkNote(stack),
    getMoodboardEnergy(stack),
    stack[0]?.favoriteScene ? `Most replayed scene: ${stack[0].favoriteScene}.` : "Ask for the scene everyone talks about.",
  ];

  if (stack.some((film) => film.genre === "Horror")) {
    notes.push("Do NOT watch the horror tape alone.");
  } else if (stack.some((film) => film.genre === "Drama")) {
    notes.push("Apartment movie certified.");
  } else {
    notes.push("Late-night essential. Snacks required.");
  }

  return notes.slice(0, 4);
}

function renderMoodboardNotes(stack) {
  if (!moodboardClerkNotes) {
    return;
  }

  const noteClasses = ["", "is-blue", "is-red", "is-small"];
  moodboardClerkNotes.innerHTML = getMoodboardNotes(stack)
    .map((note, index) => `<span class="sticky-note ${noteClasses[index] || ""}">${note}</span>`)
    .join("");
}

function updateWatchlistPanel() {
  if (
    !watchlistCount ||
    !watchlistRuntime ||
    !watchlistRewatches ||
    !watchlistMood ||
    !watchlistVibes ||
    !watchlistTapeStack ||
    !watchlistTapeList
  ) {
    return;
  }

  const bagSize = rentalBag.length;
  const totalRuntime = rentalBag.reduce((total, film) => total + (film.runtime || 0), 0);
  const totalRewatches = rentalBag.reduce((total, film) => total + (film.rewatches || 0), 0);
  const vibes = [...new Set(rentalBag.flatMap((film) => film.vibeTags || []))].slice(0, 5);

  watchlistCount.textContent = `${bagSize} tape${bagSize === 1 ? "" : "s"}`;
  watchlistRuntime.textContent = `${totalRuntime} min`;
  watchlistRewatches.textContent = `${totalRewatches.toLocaleString()} rewatches`;
  watchlistMood.textContent =
    bagSize === 0
      ? "Pull cases from the aisles and build a tactile movie-night shelf with runtime, rewatches, clerk notes, and emotional pairings."
      : `${getMoodboardEnergy(rentalBag)} ${vibes.length ? `The shelf is giving ${vibes.slice(0, 3).join(", ")}.` : ""}`;
  if (moodboardEnergy) {
    moodboardEnergy.textContent = getMoodboardEnergy(rentalBag);
  }
  if (moodboardPairing) {
    moodboardPairing.textContent = getMoodboardPairing(rentalBag);
  }
  renderMoodboardNotes(rentalBag);
  watchlistTapeStack.innerHTML =
    bagSize === 0
      ? `<span class="stack-empty">The bookshelf is empty. Pull a DVD or VHS case from the aisles.</span>`
      : rentalBag
          .map((film, index) => {
            const stackIndex = Math.min(index, 5);
            const rotationPattern = [-2.4, 1.5, -0.8, 2.1, -1.6, 0.8];
            const shelfColumn = (index % 6) + 1;
            const liveCount = getLiveViewerCount(film);

            return `
              <article
                class="counter-vhs-tape dvd-bookshelf-case"
                draggable="true"
                tabindex="0"
                aria-label="${film.title}, shelf case ${index + 1} of ${bagSize}. Drag to reorder."
                data-stack-index="${index}"
                data-film-id="${film.id}"
                style="--tape-order: ${index}; --tape-x: ${stackIndex * 2.25}rem; --tape-y: ${(index % 3) * 0.32}rem; --tape-rotate: ${
                  rotationPattern[index % rotationPattern.length]
                }deg; --tape-delay: ${index * 60}ms; --shelf-col: ${shelfColumn};"
              >
                <span class="counter-vhs-spine">${String(index + 1).padStart(2, "0")}</span>
                <span class="dvd-case-edge" aria-hidden="true"></span>
                <span class="counter-vhs-poster" aria-hidden="true">
                  <img src="${film.poster}" alt="" width="80" height="120" loading="lazy" decoding="async">
                </span>
                <span class="dvd-case-label">BB+ shelf copy</span>
                <div class="counter-vhs-copy">
                  <strong>${film.title}</strong>
                  <small>${getAisleName(film.genre)} &middot; ${film.runtime || "??"} min</small>
                  <em>${film.vibeTags?.[0] || "counter pick"}</em>
                </div>
                <span class="dvd-case-live"><span></span>${liveCount} watching</span>
                <div class="counter-vhs-controls" aria-label="Tape controls">
                  <button type="button" data-stack-move="left" data-stack-index="${index}" aria-label="Move ${film.title} earlier" ${
                    index === 0 ? "disabled" : ""
                  }>‹</button>
                  <button type="button" data-stack-move="right" data-stack-index="${index}" aria-label="Move ${film.title} later" ${
                    index === bagSize - 1 ? "disabled" : ""
                  }>›</button>
                  <button type="button" data-stack-remove="${film.id}" aria-label="Remove ${film.title} from counter stack">×</button>
                </div>
              </article>
            `;
          })
          .join("");
  watchlistTapeList.innerHTML =
    bagSize === 0
      ? ""
      : rentalBag
          .map(
            (film, index) => `
              <article class="counter-tape-row" draggable="true" data-stack-index="${index}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${film.title}</strong>
                <small>${getAisleName(film.genre)}</small>
                <div>
                  <button type="button" data-stack-move="left" data-stack-index="${index}" aria-label="Move ${film.title} earlier on the counter" ${
                    index === 0 ? "disabled" : ""
                  }>Earlier</button>
                  <button type="button" data-stack-move="right" data-stack-index="${index}" aria-label="Move ${film.title} later on the counter" ${
                    index === bagSize - 1 ? "disabled" : ""
                  }>Later</button>
                  <button type="button" data-stack-remove="${film.id}" aria-label="Remove ${film.title} from the counter">Remove</button>
                </div>
              </article>
            `,
          )
          .join("");
  watchlistVibes.innerHTML = (vibes.length ? vibes : ["vhs glow", "staff picked", "11PM rental"])
    .map((vibe) => `<span>${vibe}</span>`)
    .join("");
}

function renderActivityFeed(movieList) {
  if (!recentActivity) {
    return;
  }

  const activityTemplates = [
    (film) => ({
      id: `rented-${film.id}`,
      type: "rented",
      user: "@jawsh",
      verb: "rented",
      movie: film.title,
      note: "instead of sleeping",
      tag: "live from counter",
      time: "2 min ago",
      stars: renderStars(getReview(film).stars),
      avatar: getReview(film).avatar,
    }),
    (film) => ({
      id: `rewatched-${film.id}`,
      type: "rewatched",
      user: "@videostorekid",
      verb: "rewatched",
      movie: film.title,
      note: "for the favorite scene",
      tag: "most rewound",
      time: "9 min ago",
      stars: renderStars(Math.max(4, getReview(film).stars - 0.5)),
      avatar: getReview(film).avatar,
    }),
    (film) => ({
      id: `bagged-${film.id}`,
      type: "bagged",
      user: "@midnightmovies",
      verb: "bagged",
      movie: film.title,
      note: "at the checkout counter",
      tag: "live rental",
      time: "14 min ago",
      stars: renderStars(getReview(film).stars),
      avatar: getReview(film).avatar,
    }),
    (film) => ({
      id: `clerk-${film.id}`,
      type: "clerk",
      user: "@filmnerd99",
      verb: "clerk picked",
      movie: film.title,
      note: `${film.favoriteScene || "a favorite scene"} keeps replaying`,
      tag: "clerk picks",
      time: "22 min ago",
      stars: renderStars(getReview(film).stars),
      avatar: getReview(film).avatar,
    }),
  ];

  activityItems = movieList.slice(0, 8).map((film, index) => activityTemplates[index % activityTemplates.length](film));
  renderActivityRail();
  startActivityPulse();
}

function activityMatchesFilter(activity) {
  if (activeActivityFilter === "all") {
    return true;
  }

  if (activeActivityFilter === "live") {
    return activity.time === "JUST NOW" || activity.tag.toLowerCase().includes("live");
  }

  return activity.type === activeActivityFilter;
}

function renderActivityRail() {
  if (!recentActivity) {
    return;
  }

  const visibleItems = activityItems.filter(activityMatchesFilter);
  recentActivity.innerHTML = visibleItems.length
    ? visibleItems
        .map(
          (activity, index) => `
            <article class="feed-item activity-pill ${index === activityPulseIndex % visibleItems.length ? "is-live-pulse" : ""}" data-activity-type="${activity.type}" tabindex="0" aria-label="${activity.user} ${activity.verb} ${activity.movie}, ${activity.time}">
              <span class="feed-avatar" aria-hidden="true">${activity.avatar}</span>
              <div class="activity-copy">
                <p>
                  <strong>${activity.user}</strong>
                  <span>${activity.verb}</span>
                  <em>${activity.movie}</em>
                </p>
                <small>${activity.note}</small>
                <span class="activity-stars">${activity.stars}</span>
              </div>
              <div class="activity-meta">
                <span>${activity.time}</span>
                <b>${activity.tag}</b>
              </div>
            </article>
          `,
        )
        .join("")
    : `<p class="activity-empty">No activity on this aisle yet.</p>`;
}

function updateActivityPulse() {
  if (!recentActivity) {
    return;
  }

  const cards = recentActivity.querySelectorAll(".activity-pill");
  cards.forEach((card, index) => {
    card.classList.toggle("is-live-pulse", index === activityPulseIndex % cards.length);
  });
}

function startActivityPulse() {
  if (!recentActivity || activityPulseTimer || reducedMotionQuery.matches) {
    return;
  }

  activityPulseTimer = window.setInterval(() => {
    const visibleCount = activityItems.filter(activityMatchesFilter).length;
    if (!visibleCount) {
      return;
    }
    activityPulseIndex = (activityPulseIndex + 1) % visibleCount;
    updateActivityPulse();
  }, 4200);
}

function setActivityFilter(filter) {
  activeActivityFilter = filter;
  activityPulseIndex = 0;
  activityTabs?.querySelectorAll("[data-activity-filter]").forEach((button) => {
    const isActive = button.dataset.activityFilter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.setAttribute("aria-selected", String(isActive));
  });
  renderActivityRail();
}

function handleActivityTabClick(event) {
  const button = event.target.closest("[data-activity-filter]");
  if (!button) {
    return;
  }

  setActivityFilter(button.dataset.activityFilter || "all");
}

function scrollActivityRail(direction) {
  if (!recentActivity) {
    return;
  }

  const scrollAmount = Math.max(260, recentActivity.clientWidth * 0.72);
  recentActivity.scrollBy({
    left: direction * scrollAmount,
    behavior: reducedMotionQuery.matches ? "auto" : "smooth",
  });
}

function prependActivity(film, message) {
  if (!recentActivity) {
    return;
  }

  activityItems.unshift({
    id: `you-${film.id}-${Date.now()}`,
    type: "bagged",
    user: "@you",
    verb: "dropped",
    movie: film.title,
    note: message.replace(/^@you\s+/, "") || "into the rental bag",
    tag: "live from checkout",
    time: "JUST NOW",
    stars: renderStars(getReview(film).stars),
    avatar: getReview(film).avatar,
  });

  activityItems = activityItems.slice(0, 10);
  activityPulseIndex = 0;
  renderActivityRail();
  recentActivity.scrollTo({ left: 0, behavior: reducedMotionQuery.matches ? "auto" : "smooth" });
}

function filterFilms() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreFilter.value;

  const filteredFilms = films.filter((film) => {
    const matchesTitle = film.title.toLowerCase().includes(searchTerm);
    const matchesGenre = selectedGenre === "All" || film.genre === selectedGenre;
    return matchesTitle && matchesGenre;
  });

  renderFilms(filteredFilms);
}

function resetFilters() {
  searchInput.value = "";
  genreFilter.value = "All";
  flippedFilmId = null;
  renderFilms(films);
}

function toggleFlippedCard(card) {
  const filmId = Number(card.dataset.cardFilmId);
  flippedFilmId = flippedFilmId === filmId ? null : filmId;

  document.querySelectorAll(".vhs-card").forEach((movieCard) => {
    const isFlipped = Number(movieCard.dataset.cardFilmId) === flippedFilmId;
    const title = movieCard.querySelector(".card-title, .back-cover-content h3")?.textContent?.trim() || "this VHS case";
    movieCard.classList.toggle("is-flipped", isFlipped);
    movieCard.setAttribute("aria-pressed", String(isFlipped));
    movieCard.setAttribute(
      "aria-label",
      isFlipped ? `Flip ${title} VHS case back to the front cover` : `Flip ${title} VHS case to the back cover`,
    );
  });

  playInteractionSound("pull");
}

function openMovieDetail(film) {
  playInteractionSound("pull");
  const details = getBackCoverDetails(film);
  const isBagged = rentalBag.some((rental) => rental.id === film.id);

  detailExpansionContent.innerHTML = `
    <div class="detail-view-controls" aria-label="VHS inspection view controls">
      <button class="detail-view-button" type="button" data-detail-view="front">
        View Front
      </button>
      <button class="detail-view-button is-active" type="button" data-detail-view="back">
        View Back
      </button>
    </div>
    <div class="detail-vhs-case is-view-back" data-detail-case aria-label="${film.title} expanded VHS rental box">
      <div class="detail-vhs-object">
        <section class="detail-vhs-side detail-vhs-front-side" aria-label="${film.title} front cover">
          <div class="detail-vhs-spine">
            <span>${getAisleName(film.genre)}</span>
          </div>
          <div class="detail-vhs-front">
            <img src="${film.poster}" alt="${film.title} expanded VHS front cover" width="500" height="750" decoding="async">
            <span class="detail-store-sticker">BLOCKBUSTER VIDEO</span>
            <span class="detail-release-sticker">${getShelfTag(film, film.id)}</span>
            <span class="detail-handwritten-sticker">${details.employee} recommends</span>
            <span class="detail-barcode-sticker">${getBarcodeLabel(film)}</span>
            <span class="detail-condition-sticker">${getCaseCondition(film, film.id)}</span>
            <span class="detail-rental-copy-sticker">Rental Copy</span>
            <h2 id="detailExpansionTitle">${film.title}</h2>
          </div>
        </section>
        <section class="detail-vhs-side detail-vhs-back-side" aria-label="${film.title} back cover">
          <div class="detail-back-cover-art" aria-hidden="true">
            <div class="detail-vhs-spine detail-vhs-spine-back">
              <span>${getAisleName(film.genre)}</span>
            </div>
            <img src="${film.poster}" alt="" width="500" height="750" decoding="async">
            <span>Rental Box</span>
          </div>
          <div class="detail-vhs-back">
            <p class="back-label">Backside of the box</p>
            <h3>${film.title}</h3>
            <p class="detail-director">Directed by ${film.director}</p>
            <div class="detail-back-stickers" aria-label="Rental box labels">
              <span>Rental Label</span>
              <span>Return by Monday</span>
              <span>Be Kind Rewind</span>
              <span>Staff Pick</span>
              <span>Rental Copy</span>
              <span>Store #0427</span>
              <span>Late fee risk</span>
              <span>${getBarcodeLabel(film)}</span>
            </div>
            <div class="detail-info-grid">
              <span>Aisle</span>
              <strong>${getAisleName(film.genre)}</strong>
              <span>Year</span>
              <strong>${film.year}</strong>
              <span>Runtime</span>
              <strong>${details.runtime}</strong>
              <span>Critic Rating</span>
              <strong>${details.criticRating}</strong>
            </div>
            <div class="detail-copy-block detail-synopsis-block">
              <span>Rental Synopsis</span>
              <p>${details.synopsis}</p>
            </div>
            <div class="detail-copy-block">
              <span>Cast</span>
              <p>${details.cast.join(" · ")}</p>
            </div>
            <div class="detail-social-block">
              <span class="detail-section-label">Community Review</span>
              <div class="mini-review detail-review">
                <span class="review-avatar">${getReview(film).avatar}</span>
                <div>
                  <p class="review-stars">${renderStars(getReview(film).stars)}</p>
                  <blockquote>“${getReview(film).quote}”</blockquote>
                  <cite>— @${getReview(film).username}</cite>
                </div>
              </div>
            </div>
            <div class="employee-recommendation">
              <span>${details.employee}'s Employee Recommendation</span>
              <strong>${details.staffTag}</strong>
              <p>${details.employeeRecommendation}</p>
              <em>${details.staffNote}</em>
            </div>
            <div class="detail-action-row">
              <button
                class="btn ${isBagged ? "btn-light" : "btn-warning"} detail-bag-button"
                type="button"
                data-film-id="${film.id}"
                aria-pressed="${isBagged}"
              >
                ${isBagged ? "In The Bag" : "Throw In Bag"}
              </button>
              <button class="btn btn-outline-light detail-close-box-button" type="button" data-close-detail>
                Close Box
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;

  movieDetailExpansion.classList.add("is-open");
  movieDetailExpansion.setAttribute("aria-hidden", "false");
  document.body.classList.add("detail-open");
  activateFocusTrap(movieDetailExpansion, detailCloseButton);
}

function setDetailVhsView(view) {
  const detailCase = detailExpansionContent.querySelector("[data-detail-case]");

  if (!detailCase) {
    return;
  }

  const nextView = view === "front" ? "front" : "back";
  detailCase.classList.toggle("is-view-front", nextView === "front");
  detailCase.classList.toggle("is-view-back", nextView === "back");
  detailExpansionContent.querySelectorAll("[data-detail-view]").forEach((button) => {
    const isActive = button.dataset.detailView === nextView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  playInteractionSound("pull");
}

function closeMovieDetail() {
  movieDetailExpansion.classList.remove("is-open");
  movieDetailExpansion.setAttribute("aria-hidden", "true");
  document.body.classList.remove("detail-open");
  releaseFocusTrap(movieDetailExpansion);
}

function handleDetailButtonClick(event) {
  const detailButton = event.target.closest("[data-open-detail]");

  if (!detailButton) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const filmId = Number(detailButton.dataset.openDetail);
  const film = films.find((movie) => movie.id === filmId);

  if (film) {
    openMovieDetail(film);
  }
}

function handleCardDetailOpen(event) {
  const flipFrontButton = event.target.closest("[data-flip-front]");

  if (flipFrontButton) {
    event.preventDefault();
    event.stopPropagation();
    const card = flipFrontButton.closest(".vhs-card");

    if (card) {
      toggleFlippedCard(card);
    }

    return;
  }

  const detailButton = event.target.closest("[data-open-detail]");

  if (detailButton) {
    handleDetailButtonClick(event);
    return;
  }

  if (event.target.closest("button, a, input, select")) {
    return;
  }

  const card = event.target.closest(".vhs-card");

  if (!card) {
    return;
  }

  toggleFlippedCard(card);
}

function handleCardKeyboard(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const card = event.target.closest(".vhs-card");

  if (!card) {
    return;
  }

  event.preventDefault();
  toggleFlippedCard(card);
}

function animateRentalBag() {
  rentalBagButton.classList.remove("is-catching");
  bagCounter.classList.remove("is-bumping");
  window.requestAnimationFrame(() => {
    rentalBagButton.classList.add("is-catching");
    bagCounter.classList.add("is-bumping");
  });
  window.setTimeout(() => {
    rentalBagButton.classList.remove("is-catching");
    bagCounter.classList.remove("is-bumping");
  }, 980);
}

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playInteractionSound(type = "click") {
  if (!soundEnabled) {
    return;
  }

  const context = ensureAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const settings = {
    click: [190, 90, 0.045],
    bag: [128, 54, 0.08],
    skip: [260, 140, 0.055],
    pull: [95, 160, 0.11],
  }[type];

  oscillator.type = type === "bag" ? "triangle" : "square";
  oscillator.frequency.setValueAtTime(settings[0], now);
  oscillator.frequency.exponentialRampToValueAtTime(settings[1], now + settings[2]);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.035, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + settings[2]);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + settings[2] + 0.02);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "Sound On" : "Sound Off";
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));

  if (soundEnabled) {
    ensureAudioContext();
    playInteractionSound("click");
  }
}

function applyLateNightMode() {
  const hour = new Date().getHours();
  document.body.classList.toggle("late-night-mode", hour >= 22 || hour <= 5);
}

function showBagDropToast(message) {
  if (!bagDropToast) {
    return;
  }

  bagDropToast.textContent = message;
  bagDropToast.classList.remove("is-visible");
  window.requestAnimationFrame(() => {
    bagDropToast.classList.add("is-visible");
  });
  window.setTimeout(() => {
    bagDropToast.classList.remove("is-visible");
  }, 1500);
}

function animateTinyVhs(button, film) {
  if (!button || !rentalBagButton) {
    return;
  }

  const buttonRect = button.getBoundingClientRect();
  const bagRect = rentalBagButton.getBoundingClientRect();
  const tinyVhs = document.createElement("span");
  const startX = buttonRect.left + buttonRect.width / 2;
  const startY = buttonRect.top + buttonRect.height / 2;
  const endX = bagRect.left + bagRect.width / 2;
  const endY = bagRect.top + bagRect.height / 2;

  tinyVhs.className = "tiny-vhs-flight";
  tinyVhs.innerHTML = `
    <span class="tiny-vhs-spine" aria-hidden="true"></span>
    <img src="${film?.poster || ""}" alt="" width="80" height="120" decoding="async">
    <strong>${film?.title ? film.title.slice(0, 18) : "VHS"}</strong>
  `;
  tinyVhs.style.left = `${startX}px`;
  tinyVhs.style.top = `${startY}px`;
  tinyVhs.style.setProperty("--fly-x", `${endX - startX}px`);
  tinyVhs.style.setProperty("--fly-y", `${endY - startY}px`);
  tinyVhs.style.setProperty("--fly-x-18", `${(endX - startX) * 0.18}px`);
  tinyVhs.style.setProperty("--fly-y-08", `${(endY - startY) * 0.08 - 88}px`);
  tinyVhs.style.setProperty("--fly-x-48", `${(endX - startX) * 0.48}px`);
  tinyVhs.style.setProperty("--fly-y-34", `${(endY - startY) * 0.34 - 98}px`);
  tinyVhs.style.setProperty("--fly-x-86", `${(endX - startX) * 0.86}px`);
  tinyVhs.style.setProperty("--fly-y-78", `${(endY - startY) * 0.78 - 18}px`);
  document.body.appendChild(tinyVhs);
  tinyVhs.addEventListener("animationend", () => tinyVhs.remove());
}

function animateTonightStackDrop(film) {
  if (!tonightStackSection || !stackFlareMessage || !film) {
    return;
  }

  tonightStackSection.classList.remove("is-stacking", "is-projecting");
  stackFlareMessage.textContent = `Dropped ${film.title} on the counter.`;
  window.requestAnimationFrame(() => {
    tonightStackSection.classList.add("is-stacking");
  });
  window.setTimeout(() => {
    tonightStackSection.classList.remove("is-stacking");
    stackFlareMessage.textContent = "";
  }, 1600);
}

function handleBagClick(event) {
  if (event.target.closest("[data-open-detail]")) {
    return;
  }

  const button = event.target.closest(".bag-button, .detail-bag-button");

  if (!button) {
    return;
  }

  const film = films.find((movie) => movie.id === Number(button.dataset.filmId));
  const added = addFilmToRentalBag(film, button);

  if (film) {
    leadShelfRentalToCheckout(film, button, !added);
  }
}

function addFeaturedRentalToBag() {
  if (!films.length) {
    return;
  }

  const film = films[featuredFilmIndex];
  addFilmToRentalBag(film, projectorBag);
  updateProjectorBagButton(film);
}

function handleQuickFilterClick(event) {
  const button = event.target.closest("button[data-genre]");

  if (!button) {
    return;
  }

  searchInput.value = "";
  genreFilter.value = button.dataset.genre;
  filterFilms();
}

function handleGridUtilityClick(event) {
  const detailButton = event.target.closest("[data-open-detail]");

  if (detailButton) {
    handleDetailButtonClick(event);
    return;
  }

  if (event.target.closest("#emptyReset")) {
    resetFilters();
  }
}

function updateCaseGlare(event) {
  const card = event.target.closest(".vhs-card");

  if (!card) {
    return;
  }

  if (card.caseGlareFrame) {
    card.caseGlareEvent = event;
    return;
  }

  card.caseGlareEvent = event;
  card.caseGlareFrame = window.requestAnimationFrame(() => {
    const latestEvent = card.caseGlareEvent;
    const rect = card.getBoundingClientRect();
    const x = ((latestEvent.clientX - rect.left) / rect.width) * 100;
    const y = ((latestEvent.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--case-glare-x", `${Math.max(0, Math.min(100, x))}%`);
    card.style.setProperty("--case-glare-y", `${Math.max(0, Math.min(100, y))}%`);
    card.caseGlareFrame = null;
  });
}

function resetCaseGlare(event) {
  const card = event.target.closest(".vhs-card");

  if (!card) {
    return;
  }

  if (card.caseGlareFrame) {
    window.cancelAnimationFrame(card.caseGlareFrame);
    card.caseGlareFrame = null;
  }

  card.style.setProperty("--case-glare-x", "38%");
  card.style.setProperty("--case-glare-y", "16%");
}

function openRentalBag() {
  rentalBagPanel.classList.add("is-open");
  rentalBagPanel.setAttribute("aria-hidden", "false");
  activateFocusTrap(rentalBagPanel, closeBagPanel);
}

function closeRentalBag() {
  rentalBagPanel.classList.remove("is-open");
  rentalBagPanel.setAttribute("aria-hidden", "true");
  releaseFocusTrap(rentalBagPanel, rentalBagButton);
}

function removeRental(filmId) {
  const rentalIndex = rentalBag.findIndex((film) => film.id === filmId);

  if (rentalIndex === -1) {
    return;
  }

  rentalBag.splice(rentalIndex, 1);
  updateRentalBag();
  syncFilmBagState({ id: filmId });
  if (films[featuredFilmIndex]?.id === filmId) {
    updateProjectorBagButton(films[featuredFilmIndex]);
  }
  if (getCurrentSwipeFilm()?.id === filmId) {
    renderSwipeCard();
  }
  renderFilms(
    films.filter((film) => {
      const matchesTitle = film.title.toLowerCase().includes(searchInput.value.trim().toLowerCase());
      const matchesGenre = genreFilter.value === "All" || film.genre === genreFilter.value;
      return matchesTitle && matchesGenre;
    }),
  );
}

function moveRentalTape(fromIndex, toIndex) {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= rentalBag.length ||
    toIndex >= rentalBag.length
  ) {
    return;
  }

  const [movedFilm] = rentalBag.splice(fromIndex, 1);
  rentalBag.splice(toIndex, 0, movedFilm);
  updateRentalBag();
  playInteractionSound("pull");
}

function openProjectorTheater(film) {
  if (!projectorTheater || !projectorTrailerFrame || !film || !film.trailer) {
    return;
  }

  projectorTrailerFrame.src = sharedLogic.buildTrailerEmbedSrc
    ? sharedLogic.buildTrailerEmbedSrc(film.trailer)
    : `${film.trailer}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  if (projectorTheaterTitle) {
    projectorTheaterTitle.textContent = film.title;
  }
  if (projectorTheaterMeta) {
    const details = getBackCoverDetails(film);
    projectorTheaterMeta.textContent = `${film.genre} · ${film.year} · ${details.runtime}`;
  }

  projectorTheater.classList.add("is-open");
  projectorTheater.setAttribute("aria-hidden", "false");
  document.body.classList.add("theater-open");
  playInteractionSound("pull");
  activateFocusTrap(projectorTheater, projectorTheaterClose);
}

function closeProjectorTheater() {
  if (!projectorTheater || !projectorTheater.classList.contains("is-open")) {
    return;
  }

  // Clearing src fully stops YouTube playback (pause alone keeps audio buffered).
  if (projectorTrailerFrame) {
    projectorTrailerFrame.src = "";
  }
  projectorTheater.classList.remove("is-open");
  projectorTheater.setAttribute("aria-hidden", "true");
  document.body.classList.remove("theater-open");
  releaseFocusTrap(projectorTheater, startStackScreening);
}

function showStackFlare(message, duration = 1800) {
  if (!stackFlareMessage || !tonightStackSection) {
    return;
  }

  stackFlareMessage.textContent = message;
  tonightStackSection.classList.add("is-projecting");
  window.setTimeout(() => {
    tonightStackSection.classList.remove("is-projecting");
    stackFlareMessage.textContent = "";
  }, duration);
}

function startTonightStackScreening() {
  if (rentalBag.length === 0) {
    showStackFlare("No tape loaded into the projector.");
    playInteractionSound("skip");
    return;
  }

  // Play whatever reel the Checkout Stack is currently cued to, so the trailer
  // always matches the "Currently Projecting" panel and the highlighted tape
  // (fresh state: activeProjectionIndex is 0 -> plays the top of the stack).
  activeProjectionIndex = Math.min(Math.max(activeProjectionIndex, 0), rentalBag.length - 1);
  const selectedFilm = rentalBag[activeProjectionIndex];
  projectorSessionPaused = false;
  const selectedFilmIndex = films.findIndex((film) => film.id === selectedFilm.id);

  if (selectedFilmIndex !== -1) {
    renderProjectorFeature(selectedFilmIndex);
  }

  tonightStackSection?.classList.remove("is-stacking");
  updateProjectorSession();
  prependActivity(selectedFilm, `@you started projecting ${selectedFilm.title} from tonight's stack`);
  playInteractionSound("click");
  showStackFlare("Projector rolling...");
  openProjectorTheater(selectedFilm);
}

function playNextStackReel() {
  if (rentalBag.length === 0) {
    return;
  }

  activeProjectionIndex = (activeProjectionIndex + 1) % rentalBag.length;
  projectorSessionPaused = false;
  updateProjectorSession();
  prependActivity(rentalBag[activeProjectionIndex], `@you cued the next reel: ${rentalBag[activeProjectionIndex].title}`);
  playInteractionSound("pull");
  showStackFlare("Next reel threaded.");
}

function toggleProjectorPause() {
  // If the cinematic theater is live, "Pause Screening" closes it and stops
  // playback completely (fade-out handled by CSS on .is-open removal).
  if (projectorTheater?.classList.contains("is-open")) {
    closeProjectorTheater();
    playInteractionSound("click");
    showStackFlare("Projection paused at the counter.", 1300);
    return;
  }

  if (rentalBag.length === 0) {
    return;
  }

  projectorSessionPaused = !projectorSessionPaused;
  updateProjectorSession();
  playInteractionSound("click");
  showStackFlare(projectorSessionPaused ? "Projection paused at the counter." : "Projector rolling again.", 1300);
}

function handleWatchlistStackClick(event) {
  const removeButton = event.target.closest("button[data-stack-remove]");
  const moveButton = event.target.closest("button[data-stack-move]");

  if (removeButton) {
    removeRental(Number(removeButton.dataset.stackRemove));
    return;
  }

  if (!moveButton) {
    return;
  }

  const currentIndex = Number(moveButton.dataset.stackIndex);
  const direction = moveButton.dataset.stackMove === "left" ? -1 : 1;
  moveRentalTape(currentIndex, currentIndex + direction);
}

function handleWatchlistDragStart(event) {
  const tape = event.target.closest(".counter-vhs-tape, .counter-tape-row");

  if (!tape || event.target.closest("button")) {
    return;
  }

  draggedTapeIndex = Number(tape.dataset.stackIndex);
  tape.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(draggedTapeIndex));
}

function handleWatchlistDragOver(event) {
  const tape = event.target.closest(".counter-vhs-tape, .counter-tape-row");

  if (!tape || draggedTapeIndex === null) {
    return;
  }

  event.preventDefault();
  tape.classList.add("is-drop-target");
  event.dataTransfer.dropEffect = "move";
}

function handleWatchlistDragLeave(event) {
  event.target.closest(".counter-vhs-tape, .counter-tape-row")?.classList.remove("is-drop-target");
}

function handleWatchlistDrop(event) {
  const tape = event.target.closest(".counter-vhs-tape, .counter-tape-row");

  if (!tape || draggedTapeIndex === null) {
    return;
  }

  event.preventDefault();
  const targetIndex = Number(tape.dataset.stackIndex);
  document.querySelectorAll(".counter-vhs-tape, .counter-tape-row").forEach((stackTape) => {
    stackTape.classList.remove("is-drop-target", "is-dragging");
  });
  moveRentalTape(draggedTapeIndex, targetIndex);
  draggedTapeIndex = null;
}

function handleWatchlistDragEnd() {
  draggedTapeIndex = null;
  document.querySelectorAll(".counter-vhs-tape, .counter-tape-row").forEach((tape) => {
    tape.classList.remove("is-drop-target", "is-dragging");
  });
}

function handleBagPanelClick(event) {
  const removeButton = event.target.closest("button[data-remove-id]");

  if (!removeButton) {
    return;
  }

  removeRental(Number(removeButton.dataset.removeId));
}

function checkoutRentalBag() {
  if (rentalBag.length === 0) {
    checkoutVhs.textContent = "Bag Is Empty";
    window.setTimeout(updateRentalBag, 900);
    return;
  }

  const receiptId = `BB-${String(Date.now()).slice(-5)}`;
  const totalRuntime = rentalBag.reduce((total, film) => total + (film.runtime || 0), 0);
  bagTotal.textContent = `${receiptId} • ${rentalBag.length} rental${rentalBag.length === 1 ? "" : "s"} • ${totalRuntime} min`;
  checkoutVhs.textContent = "Receipt Printed";
  checkoutVhs.disabled = true;
  playInteractionSound("click");

  window.setTimeout(() => {
    checkoutVhs.disabled = false;
    updateRentalBag();
  }, 2200);
}

function handleDetailExpansionClick(event) {
  const viewButton = event.target.closest("[data-detail-view]");

  if (viewButton) {
    event.preventDefault();
    setDetailVhsView(viewButton.dataset.detailView);
    return;
  }

  if (
    event.target === detailExpansionBackdrop ||
    event.target === detailCloseButton ||
    event.target.closest("#detailCloseButton") ||
    event.target.closest("[data-close-detail]")
  ) {
    closeMovieDetail();
    return;
  }

  handleBagClick(event);
}

function handleEscapeKey(event) {
  if (trapFocus(event)) {
    return;
  }

  if (event.key !== "Escape") {
    return;
  }

  if (secretVhsVault.classList.contains("is-open")) {
    closeSecretVault();
  }

  if (reviewDrawer.classList.contains("is-open")) {
    closeSwipeReviews();
  }

  if (movieDetailExpansion.classList.contains("is-open")) {
    closeMovieDetail();
  }

  if (rentalBagPanel.classList.contains("is-open")) {
    closeRentalBag();
  }

  if (projectorTheater?.classList.contains("is-open")) {
    closeProjectorTheater();
  }
}

function openSecretVault() {
  secretVhsVault.classList.add("is-open");
  secretVhsVault.setAttribute("aria-hidden", "false");
  document.body.classList.add("secret-open");
  easterToast.classList.add("is-visible");
  window.setTimeout(() => {
    easterToast.classList.remove("is-visible");
  }, 2800);
  activateFocusTrap(secretVhsVault, secretCloseButton);
}

function closeSecretVault() {
  secretVhsVault.classList.remove("is-open", "is-rewinding");
  secretVhsVault.setAttribute("aria-hidden", "true");
  document.body.classList.remove("secret-open");
  releaseFocusTrap(secretVhsVault);
}

function rewindSecretTape() {
  secretVhsVault.classList.remove("is-rewinding");
  window.requestAnimationFrame(() => {
    secretVhsVault.classList.add("is-rewinding");
  });
}

function handleSecretVaultClick(event) {
  if (
    event.target === secretVaultBackdrop ||
    event.target === secretCloseButton ||
    event.target.closest("#secretCloseButton")
  ) {
    closeSecretVault();
  }
}

function handleKonamiCode(event) {
  if (event.target.closest("input, select, textarea")) {
    return;
  }

  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  konamiProgress.push(key);
  konamiProgress = konamiProgress.slice(-konamiCode.length);

  if (konamiCode.every((codeKey, index) => codeKey === konamiProgress[index])) {
    konamiProgress = [];
    openSecretVault();
  }
}

function startShelfDrag(event) {
  if (event.target.closest("button, a, input, select")) {
    return;
  }

  isShelfDragging = true;
  shelfDragStartX = event.clientX;
  shelfScrollStart = vhsShelf.scrollLeft;
  vhsShelf.classList.add("is-dragging");
}

function moveShelfDrag(event) {
  if (!isShelfDragging) {
    return;
  }

  const dragDistance = event.clientX - shelfDragStartX;
  vhsShelf.scrollLeft = shelfScrollStart - dragDistance;
}

function endShelfDrag() {
  isShelfDragging = false;
  vhsShelf.classList.remove("is-dragging");
}

searchInput.addEventListener("input", filterFilms);
genreFilter.addEventListener("change", filterFilms);
movieGrid.addEventListener("click", handleBagClick);
movieGrid.addEventListener("click", handleCardDetailOpen);
movieGrid.addEventListener("click", handleGridUtilityClick);
movieGrid.addEventListener("keydown", handleCardKeyboard);
if (finePointerQuery.matches && !reducedMotionQuery.matches) {
  movieGrid.addEventListener("pointermove", updateCaseGlare, { passive: true });
  movieGrid.addEventListener("pointerout", resetCaseGlare, { passive: true });
}
document.addEventListener("click", handleDetailButtonClick, true);
quickFilters.addEventListener("click", handleQuickFilterClick);
resetFiltersButton.addEventListener("click", resetFilters);
soundToggle.addEventListener("click", toggleSound);
activityTabs?.addEventListener("click", handleActivityTabClick);
activityRailPrev?.addEventListener("click", () => scrollActivityRail(-1));
activityRailNext?.addEventListener("click", () => scrollActivityRail(1));
swipeSkip.addEventListener("click", handleSwipeSkip);
swipeBag.addEventListener("click", handleSwipeBag);
swipeReviews.addEventListener("click", openSwipeReviews);
swipeCard.addEventListener("click", handleSwipeCardClick);
reviewDrawer.addEventListener("click", handleReviewDrawerClick);
projectorNext?.addEventListener("click", showNextProjectorFilm);
projectorInspect?.addEventListener("click", inspectProjectorFilm);
projectorBag?.addEventListener("click", addFeaturedRentalToBag);
rentalBagButton.addEventListener("click", openRentalBag);
closeBagPanel.addEventListener("click", closeRentalBag);
bagItems.addEventListener("click", handleBagPanelClick);
checkoutVhs.addEventListener("click", checkoutRentalBag);
startStackScreening.addEventListener("click", startTonightStackScreening);
nextStackReel.addEventListener("click", playNextStackReel);
pauseStackScreening.addEventListener("click", toggleProjectorPause);
projectorTheaterClose?.addEventListener("click", closeProjectorTheater);
projectorTheaterBackdrop?.addEventListener("click", closeProjectorTheater);
watchlistTapeStack.addEventListener("click", handleWatchlistStackClick);
watchlistTapeList.addEventListener("click", handleWatchlistStackClick);
tonightQueueList.addEventListener("click", handleWatchlistStackClick);
watchlistTapeStack.addEventListener("dragstart", handleWatchlistDragStart);
watchlistTapeStack.addEventListener("dragover", handleWatchlistDragOver);
watchlistTapeStack.addEventListener("dragleave", handleWatchlistDragLeave);
watchlistTapeStack.addEventListener("drop", handleWatchlistDrop);
watchlistTapeStack.addEventListener("dragend", handleWatchlistDragEnd);
watchlistTapeList.addEventListener("dragstart", handleWatchlistDragStart);
watchlistTapeList.addEventListener("dragover", handleWatchlistDragOver);
watchlistTapeList.addEventListener("dragleave", handleWatchlistDragLeave);
watchlistTapeList.addEventListener("drop", handleWatchlistDrop);
watchlistTapeList.addEventListener("dragend", handleWatchlistDragEnd);
movieDetailExpansion.addEventListener("click", handleDetailExpansionClick);
secretVhsVault.addEventListener("click", handleSecretVaultClick);
rewindSecretTapeButton.addEventListener("click", rewindSecretTape);
window.addEventListener("keydown", handleEscapeKey);
window.addEventListener("keydown", handleKonamiCode);
vhsShelf.addEventListener("pointerdown", startShelfDrag);
window.addEventListener("pointermove", moveShelfDrag);
window.addEventListener("pointerup", endShelfDrag);

document.addEventListener("visibilitychange", refreshProjectorRotation);

const currentlyPlayingSection = document.querySelector(".currently-playing");
if (currentlyPlayingSection && "IntersectionObserver" in window) {
  const projectorObserver = new IntersectionObserver(
    (entries) => {
      projectorInView = entries[0].isIntersecting;
      refreshProjectorRotation();
    },
    { threshold: 0.15 },
  );
  projectorObserver.observe(currentlyPlayingSection);
}

fetchFilms();
updateRentalBag();
applyLateNightMode();
