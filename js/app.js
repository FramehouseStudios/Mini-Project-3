const movieGrid = document.querySelector("#movieGrid");
const searchInput = document.querySelector("#searchInput");
const genreFilter = document.querySelector("#genreFilter");
const resultsCount = document.querySelector("#resultsCount");
const bagCountLabel = document.querySelector("#bagCountLabel");
const bagCounter = document.querySelector("#bagCounter");
const rentalBagButton = document.querySelector("#rentalBagButton");
const rentalBagPanel = document.querySelector("#rentalBagPanel");
const closeBagPanel = document.querySelector("#closeBagPanel");
const bagItems = document.querySelector("#bagItems");
const bagTotal = document.querySelector("#bagTotal");
const watchlistCount = document.querySelector("#watchlistCount");
const watchlistRuntime = document.querySelector("#watchlistRuntime");
const watchlistRewatches = document.querySelector("#watchlistRewatches");
const watchlistMood = document.querySelector("#watchlistMood");
const watchlistVibes = document.querySelector("#watchlistVibes");
const recentActivity = document.querySelector("#recentActivity");
const tonightQueueList = document.querySelector("#tonightQueueList");
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

let films = [];
const rentalBag = [];
let flippedFilmId = null;
let featuredFilmIndex = 0;
let projectorTimer = null;
let isShelfDragging = false;
let shelfDragStartX = 0;
let shelfScrollStart = 0;
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
    const response = await fetch("data/films.json");

    if (!response.ok) {
      throw new Error("Film data could not be loaded.");
    }

    films = await response.json();
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
  if (!films.length) {
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
  display.classList.remove("is-switching");
  window.requestAnimationFrame(() => {
    display.classList.add("is-switching");
  });
}

function showNextProjectorFilm() {
  renderProjectorFeature(featuredFilmIndex + 1);
  startProjectorRotation();
}

function startProjectorRotation() {
  window.clearInterval(projectorTimer);
  projectorTimer = window.setInterval(() => {
    renderProjectorFeature(featuredFilmIndex + 1);
  }, 6500);
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
    const caseCondition = getCaseCondition(film, index);
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
        aria-label="Inspect ${film.title} VHS rental box"
      >
        <div class="vhs-case-inner">
          <div class="vhs-face vhs-front">
            <div class="vhs-spine" aria-hidden="true">
              <span>${getAisleName(film.genre)}</span>
            </div>
            <div class="poster-frame">
              <img src="${film.poster}" class="card-img-top" alt="${film.title} VHS cover">
              <span class="rental-sticker">BLOCKBUSTER VIDEO</span>
              <span class="rewind-label">BE KIND REWIND</span>
              <span class="shelf-tag">${shelfTag}</span>
              <span class="staff-pick-sticker">${staffPick.employee} pick</span>
              <span class="condition-sticker">${caseCondition}</span>
              <span class="barcode-label">${barcodeLabel}</span>
              <span class="fingerprint-smudge" aria-hidden="true"></span>
              <span class="scratch-map" aria-hidden="true"></span>
              <span class="pull-tab">Inspect box</span>
              <span class="bagged-badge ${isBagged ? "is-visible" : ""}">Bagged</span>
            </div>
            <div class="card-body d-flex flex-column">
              <div class="badge-row movie-meta">
                <span>${getAisleName(film.genre)}</span>
                <span>${film.year}</span>
                <span>${film.rating.toFixed(1)} match</span>
                <span>HD</span>
              </div>
              <h3 class="card-title">${film.title}</h3>
              <p class="director">Directed by ${film.director}</p>
              <p class="card-text">${film.description}</p>
              <div class="culture-tags">
                ${getCultureTags(film, index)
                  .map((tag) => `<span>${tag}</span>`)
                  .join("")}
              </div>
              <div class="mini-review">
                <span class="review-avatar">${getReview(film).avatar}</span>
                <div>
                  <p class="review-stars">${renderStars(getReview(film).stars)}</p>
                  <blockquote>“${getReview(film).quote}”</blockquote>
                  <cite>— @${getReview(film).username}</cite>
                </div>
              </div>
              <div class="employee-note">
                <span>${staffPick.tag}</span>
                <p>${staffPick.note}</p>
              </div>
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
            <div class="vhs-back-spine" aria-hidden="true">
              <span>${getAisleName(film.genre)}</span>
            </div>
            <div class="back-cover-content">
              <p class="back-label">Back Cover</p>
              <h3>${film.title}</h3>
              <div class="back-detail-grid">
                <span>Runtime</span>
                <strong>${backDetails.runtime}</strong>
                <span>Critic Rating</span>
                <strong>${backDetails.criticRating}</strong>
              </div>
              <p class="back-synopsis">${backDetails.synopsis}</p>
              <div class="back-cast">
                <span>Cast</span>
                <p>${backDetails.cast.join(" · ")}</p>
              </div>
              <div class="back-vibes">
                <span>Favorite Scene</span>
                <p>${film.favoriteScene || "Ask the counter clerk for the scene everyone talks about."}</p>
              </div>
              <div class="back-barcode" aria-hidden="true"></div>
              <p class="back-hint">Click the shelf case to inspect the full rental box</p>
            </div>
          </div>
        </div>
      </div>
    `;

    movieGrid.appendChild(cardColumn);
  });

  resultsCount.textContent = `Now Renting: ${movieList.length} available`;
}

function getBackCoverDetails(film) {
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

  return {
    employee: staffPick.employee,
    staffTag: staffPick.tag,
    staffNote: staffPick.note,
    ...details,
    synopsis: `${film.description} A Blockbuster+ rental-card favorite with shelf-worn charm, late-fee energy, and enough replay value for one more weekend checkout.`,
  };
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

function getReview(film) {
  return (
    film.review || {
      stars: 4,
      username: "videostoreregular",
      avatar: "VR",
      quote: "Exactly the kind of tape you hope to find on the shelf.",
    }
  );
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
        <img src="${film.poster}" alt="${film.title} VHS cover">
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

function addFilmToRentalBag(film, sourceButton) {
  if (!film || rentalBag.some((rental) => rental.id === film.id)) {
    return false;
  }

  rentalBag.push(film);
  updateRentalBag();
  if (films[featuredFilmIndex]?.id === film.id) {
    updateProjectorBagButton(film);
  }
  prependActivity(film, `@you added ${film.title} to Tonight's Watchlist ${renderStars(getReview(film).stars)}`);
  animateRentalBag();
  playInteractionSound("bag");
  if (sourceButton) {
    animateTinyVhs(sourceButton);
  }
  return true;
}

function handleSwipeBag() {
  const film = getCurrentSwipeFilm();
  const added = addFilmToRentalBag(film, swipeBag);

  if (added) {
    const shelfButton = document.querySelector(`.bag-button[data-film-id="${film.id}"]`);
    shelfButton?.classList.remove("btn-warning");
    shelfButton?.classList.add("btn-light");
    if (shelfButton) {
      shelfButton.textContent = "In The Bag";
      shelfButton.setAttribute("aria-pressed", "true");
    }
    document
      .querySelector(`.vhs-card[data-card-film-id="${film.id}"] .bagged-badge`)
      ?.classList.add("is-visible");
    document
      .querySelector(`.vhs-card[data-card-film-id="${film.id}"] .bag-confirmation`)
      ?.classList.add("is-visible");
  }

  advanceSwipe("right");
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
  reviewCloseButton.focus();
}

function closeSwipeReviews() {
  reviewDrawer.classList.remove("is-open");
  reviewDrawer.setAttribute("aria-hidden", "true");
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
    Action: "Staff Picks Wall",
    Drama: "Indie Shelf",
    Horror: "Horror Vault",
    "Sci-Fi": "Sci-Fi Corridor",
    Romance: "Friday Night Favorites",
    Animation: "Family Matinee Aisle",
  };

  return aisleNames[genre] || `${genre} Aisle`;
}

function updateRentalBag() {
  const bagSize = rentalBag.length;
  const label = `Rental Bag: ${bagSize} film${bagSize === 1 ? "" : "s"}`;

  bagCountLabel.textContent = label;
  bagCounter.textContent = bagSize;
  bagTotal.textContent = `Total rentals: ${bagSize}`;
  updateWatchlistPanel();
  updateTonightQueue();

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
      <img src="${film.poster}" alt="${film.title} poster thumbnail">
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

function updateTonightQueue() {
  if (!tonightQueueList) {
    return;
  }

  if (rentalBag.length === 0) {
    tonightQueueList.innerHTML = `<li class="queue-empty">No tapes selected yet.</li>`;
    return;
  }

  tonightQueueList.innerHTML = rentalBag
    .map(
      (film, index) => `
        <li class="queue-tape" style="--queue-delay: ${index * 70}ms">
          <span>${index + 1}</span>
          <div>
            <strong>${film.title}</strong>
            <p>${getAisleName(film.genre)} · ${film.runtime || "??"} min</p>
          </div>
        </li>
      `,
    )
    .join("");
}

function updateWatchlistPanel() {
  if (!watchlistCount || !watchlistRuntime || !watchlistRewatches || !watchlistMood || !watchlistVibes) {
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
      ? "Throw tapes into the bag to build a late-night watchlist with runtime, rewatches, and mood tags."
      : `Tonight feels like ${vibes.slice(0, 3).join(", ")}.`;
  watchlistVibes.innerHTML = (vibes.length ? vibes : ["vhs glow", "staff picked", "11PM rental"])
    .map((vibe) => `<span>${vibe}</span>`)
    .join("");
}

function renderActivityFeed(movieList) {
  if (!recentActivity) {
    return;
  }

  const activityTemplates = [
    (film) => `@jawsh watched ${film.title} ${renderStars(getReview(film).stars)}`,
    (film) => `@videostorekid rewatched ${film.title} ${renderStars(Math.max(4, getReview(film).stars - 0.5))}`,
    (film) => `@midnightmovies added ${film.title} to their bag`,
    (film) => `@filmnerd99 logged favorite scene: ${film.favoriteScene || film.title}`,
  ];

  recentActivity.innerHTML = "";
  movieList.slice(0, 4).forEach((film, index) => {
    const item = document.createElement("article");
    item.className = "feed-item";
    item.innerHTML = `
      <span class="feed-avatar">${getReview(film).avatar}</span>
      <p>${activityTemplates[index % activityTemplates.length](film)}</p>
      <span>${getCultureTags(film, index)[0]}</span>
    `;
    recentActivity.appendChild(item);
  });
}

function prependActivity(film, message) {
  if (!recentActivity) {
    return;
  }

  const item = document.createElement("article");
  item.className = "feed-item is-new";
  item.innerHTML = `
    <span class="feed-avatar">${getReview(film).avatar}</span>
    <p>${message}</p>
    <span>JUST NOW</span>
  `;
  recentActivity.prepend(item);

  while (recentActivity.children.length > 5) {
    recentActivity.lastElementChild.remove();
  }
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
    movieCard.classList.toggle("is-flipped", isFlipped);
    movieCard.setAttribute("aria-pressed", String(isFlipped));
  });
}

function openMovieDetail(film) {
  playInteractionSound("pull");
  const details = getBackCoverDetails(film);
  const isBagged = rentalBag.some((rental) => rental.id === film.id);

  detailExpansionContent.innerHTML = `
    <div class="detail-vhs-case" aria-label="${film.title} expanded VHS rental box">
      <div class="detail-vhs-spine">
        <span>${getAisleName(film.genre)}</span>
      </div>
      <div class="detail-vhs-front">
        <img src="${film.poster}" alt="${film.title} expanded VHS front cover">
        <span class="detail-store-sticker">BLOCKBUSTER VIDEO</span>
        <span class="detail-release-sticker">${getShelfTag(film, film.id)}</span>
        <span class="detail-handwritten-sticker">${details.employee} recommends</span>
        <span class="detail-barcode-sticker">${getBarcodeLabel(film)}</span>
        <span class="detail-condition-sticker">${getCaseCondition(film, film.id)}</span>
        <h2 id="detailExpansionTitle">${film.title}</h2>
      </div>
      <div class="detail-vhs-back">
        <p class="back-label">Backside of the box</p>
        <h3>${film.title}</h3>
        <p class="detail-director">Directed by ${film.director}</p>
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
        <div class="detail-copy-block">
          <span>Rental Synopsis</span>
          <p>${details.synopsis}</p>
        </div>
        <div class="detail-copy-block">
          <span>Cast</span>
          <p>${details.cast.join(" · ")}</p>
        </div>
        <div class="detail-social-block">
          <div class="mini-review detail-review">
            <span class="review-avatar">${getReview(film).avatar}</span>
            <div>
              <p class="review-stars">${renderStars(getReview(film).stars)}</p>
              <blockquote>“${getReview(film).quote}”</blockquote>
              <cite>— @${getReview(film).username}</cite>
            </div>
          </div>
          <div class="detail-vibe-tags">
            ${(film.vibeTags || []).map((tag) => `<span>${tag}</span>`).join("")}
          </div>
        </div>
        <div class="employee-recommendation">
          <span>${details.employee}'s Employee Recommendation</span>
          <strong>${details.staffTag}</strong>
          <p>${details.employeeRecommendation}</p>
          <em>${details.staffNote}</em>
        </div>
        <button
          class="btn ${isBagged ? "btn-light" : "btn-warning"} detail-bag-button"
          type="button"
          data-film-id="${film.id}"
          aria-pressed="${isBagged}"
        >
          ${isBagged ? "In The Bag" : "Throw In Bag"}
        </button>
      </div>
    </div>
  `;

  movieDetailExpansion.classList.add("is-open");
  movieDetailExpansion.setAttribute("aria-hidden", "false");
  document.body.classList.add("detail-open");
  detailCloseButton.focus();
}

function closeMovieDetail() {
  movieDetailExpansion.classList.remove("is-open");
  movieDetailExpansion.setAttribute("aria-hidden", "true");
  document.body.classList.remove("detail-open");
}

function handleCardDetailOpen(event) {
  if (event.target.closest("button, a, input, select")) {
    return;
  }

  const card = event.target.closest(".vhs-card");

  if (!card) {
    return;
  }

  const filmId = Number(card.dataset.cardFilmId);
  const film = films.find((movie) => movie.id === filmId);

  if (film) {
    openMovieDetail(film);
  }
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
  const filmId = Number(card.dataset.cardFilmId);
  const film = films.find((movie) => movie.id === filmId);

  if (film) {
    openMovieDetail(film);
  }
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

function animateTinyVhs(button) {
  const buttonRect = button.getBoundingClientRect();
  const bagRect = rentalBagButton.getBoundingClientRect();
  const tinyVhs = document.createElement("span");
  const startX = buttonRect.left + buttonRect.width / 2;
  const startY = buttonRect.top + buttonRect.height / 2;
  const endX = bagRect.left + bagRect.width / 2;
  const endY = bagRect.top + bagRect.height / 2;

  tinyVhs.className = "tiny-vhs-flight";
  tinyVhs.innerHTML = "<span>VHS</span>";
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

function handleBagClick(event) {
  const button = event.target.closest(".bag-button, .detail-bag-button");

  if (!button) {
    return;
  }

  const filmId = Number(button.dataset.filmId);
  const film = films.find((movie) => movie.id === filmId);

  if (!film || rentalBag.some((rental) => rental.id === filmId)) {
    return;
  }

  rentalBag.push(film);
  button.textContent = "In The Bag";
  button.classList.remove("btn-warning");
  button.classList.add("btn-light");
  button.setAttribute("aria-pressed", "true");
  const card = button.closest(".vhs-card");
  if (card) {
    card.querySelector(".bag-confirmation").classList.add("is-visible");
    card.querySelector(".bagged-badge").classList.add("is-visible");
  }
  updateRentalBag();
  if (films[featuredFilmIndex]?.id === film.id) {
    updateProjectorBagButton(film);
  }
  prependActivity(film, `@you added ${film.title} to Tonight's Watchlist ${renderStars(getReview(film).stars)}`);
  playInteractionSound("bag");
  animateRentalBag();
  animateTinyVhs(button);

  if (button.classList.contains("detail-bag-button")) {
    document
      .querySelector(`.vhs-card[data-card-film-id="${filmId}"] .bagged-badge`)
      ?.classList.add("is-visible");
    document
      .querySelector(`.vhs-card[data-card-film-id="${filmId}"] .bag-confirmation`)
      ?.classList.add("is-visible");
    const shelfButton = document.querySelector(`.bag-button[data-film-id="${filmId}"]`);
    shelfButton?.classList.remove("btn-warning");
    shelfButton?.classList.add("btn-light");
    if (shelfButton) {
      shelfButton.textContent = "In The Bag";
      shelfButton.setAttribute("aria-pressed", "true");
    }
  }
}

function addFeaturedRentalToBag() {
  if (!films.length) {
    return;
  }

  const film = films[featuredFilmIndex];

  if (!film || rentalBag.some((rental) => rental.id === film.id)) {
    updateProjectorBagButton(film);
    return;
  }

  rentalBag.push(film);
  updateRentalBag();
  updateProjectorBagButton(film);
  prependActivity(film, `@you added ${film.title} to Tonight's Watchlist ${renderStars(getReview(film).stars)}`);
  playInteractionSound("bag");
  animateRentalBag();
  animateTinyVhs(projectorBag);

  const shelfButton = document.querySelector(`.bag-button[data-film-id="${film.id}"]`);
  shelfButton?.classList.remove("btn-warning");
  shelfButton?.classList.add("btn-light");
  if (shelfButton) {
    shelfButton.textContent = "In The Bag";
    shelfButton.setAttribute("aria-pressed", "true");
  }
  document
    .querySelector(`.vhs-card[data-card-film-id="${film.id}"] .bagged-badge`)
    ?.classList.add("is-visible");
  document
    .querySelector(`.vhs-card[data-card-film-id="${film.id}"] .bag-confirmation`)
    ?.classList.add("is-visible");
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
  if (event.target.closest("#emptyReset")) {
    resetFilters();
  }
}

function updateCaseGlare(event) {
  const card = event.target.closest(".vhs-card");

  if (!card) {
    return;
  }

  const rect = card.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  card.style.setProperty("--case-glare-x", `${Math.max(0, Math.min(100, x))}%`);
  card.style.setProperty("--case-glare-y", `${Math.max(0, Math.min(100, y))}%`);
}

function resetCaseGlare(event) {
  const card = event.target.closest(".vhs-card");

  if (!card) {
    return;
  }

  card.style.setProperty("--case-glare-x", "38%");
  card.style.setProperty("--case-glare-y", "16%");
}

function openRentalBag() {
  rentalBagPanel.classList.add("is-open");
  rentalBagPanel.setAttribute("aria-hidden", "false");
}

function closeRentalBag() {
  rentalBagPanel.classList.remove("is-open");
  rentalBagPanel.setAttribute("aria-hidden", "true");
}

function removeRental(filmId) {
  const rentalIndex = rentalBag.findIndex((film) => film.id === filmId);

  if (rentalIndex === -1) {
    return;
  }

  rentalBag.splice(rentalIndex, 1);
  updateRentalBag();
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

function handleBagPanelClick(event) {
  const removeButton = event.target.closest("button[data-remove-id]");

  if (!removeButton) {
    return;
  }

  removeRental(Number(removeButton.dataset.removeId));
}

function handleDetailExpansionClick(event) {
  if (
    event.target === detailExpansionBackdrop ||
    event.target === detailCloseButton ||
    event.target.closest("#detailCloseButton")
  ) {
    closeMovieDetail();
    return;
  }

  handleBagClick(event);
}

function handleEscapeKey(event) {
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
}

function openSecretVault() {
  secretVhsVault.classList.add("is-open");
  secretVhsVault.setAttribute("aria-hidden", "false");
  document.body.classList.add("secret-open");
  easterToast.classList.add("is-visible");
  window.setTimeout(() => {
    easterToast.classList.remove("is-visible");
  }, 2800);
  secretCloseButton.focus();
}

function closeSecretVault() {
  secretVhsVault.classList.remove("is-open", "is-rewinding");
  secretVhsVault.setAttribute("aria-hidden", "true");
  document.body.classList.remove("secret-open");
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
movieGrid.addEventListener("pointermove", updateCaseGlare);
movieGrid.addEventListener("pointerout", resetCaseGlare);
quickFilters.addEventListener("click", handleQuickFilterClick);
resetFiltersButton.addEventListener("click", resetFilters);
soundToggle.addEventListener("click", toggleSound);
swipeSkip.addEventListener("click", handleSwipeSkip);
swipeBag.addEventListener("click", handleSwipeBag);
swipeReviews.addEventListener("click", openSwipeReviews);
swipeCard.addEventListener("click", handleSwipeCardClick);
reviewDrawer.addEventListener("click", handleReviewDrawerClick);
projectorNext.addEventListener("click", showNextProjectorFilm);
projectorInspect.addEventListener("click", inspectProjectorFilm);
projectorBag.addEventListener("click", addFeaturedRentalToBag);
rentalBagButton.addEventListener("click", openRentalBag);
closeBagPanel.addEventListener("click", closeRentalBag);
bagItems.addEventListener("click", handleBagPanelClick);
movieDetailExpansion.addEventListener("click", handleDetailExpansionClick);
secretVhsVault.addEventListener("click", handleSecretVaultClick);
rewindSecretTapeButton.addEventListener("click", rewindSecretTape);
window.addEventListener("keydown", handleEscapeKey);
window.addEventListener("keydown", handleKonamiCode);
vhsShelf.addEventListener("pointerdown", startShelfDrag);
window.addEventListener("pointermove", moveShelfDrag);
window.addEventListener("pointerup", endShelfDrag);

fetchFilms();
updateRentalBag();
