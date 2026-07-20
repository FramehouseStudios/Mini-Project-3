(function attachBlockbusterLogic(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.BlockbusterLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createBlockbusterLogic() {
  const MOOD_LEXICON = {
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

  const WEATHER_LEXICON = {
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

  const NEED_LEXICON = {
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

  const STOPWORDS = new Set(
    "the a an and or but i im me my we you it its to of in on at is are be been being feel feeling felt want need something some really very just so that this with for like about into out up down was were have has had do does did not no yes too more most night tonight movie film watch watching".split(
      " ",
    ),
  );

  function scanLexicon(text, lexicon) {
    return Object.entries(lexicon)
      .filter(([, synonyms]) => synonyms.some((synonym) => text.includes(synonym)))
      .map(([key]) => key);
  }

  function parseMoodText(rawText) {
    const text = String(rawText || "").toLowerCase();

    if (!text.trim()) {
      return { raw: "", moods: [], weathers: [], need: null, tokens: [], hasText: false };
    }

    const needs = scanLexicon(text, NEED_LEXICON);
    const tokens = [
      ...new Set(
        text
          .replace(/[^a-z\s'-]/g, " ")
          .split(/\s+/)
          .filter((word) => word.length >= 4 && !STOPWORDS.has(word)),
      ),
    ];

    return {
      raw: text.trim(),
      moods: scanLexicon(text, MOOD_LEXICON),
      weathers: scanLexicon(text, WEATHER_LEXICON),
      need: needs[0] || null,
      tokens,
      hasText: true,
    };
  }

  function scoreFreeText(film, signals) {
    if (!signals?.hasText) {
      return { score: 0, reasons: [] };
    }

    const reasons = [];
    let score = 0;
    const moodHits = signals.moods.filter((mood) => (film.moods || []).includes(mood));
    const weatherHits = signals.weathers.filter((weather) => (film.weatherTags || []).includes(weather));

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
    const overlap = signals.tokens.filter((token) => corpus.includes(token));

    if (overlap.length) {
      score += Math.min(overlap.length * 8, 40);
      if (overlap.length >= 2) {
        reasons.push(`echoes your words (${overlap.slice(0, 3).join(", ")})`);
      }
    }

    return { score: Math.min(score, 130), reasons: reasons.slice(0, 2) };
  }

  function serializeRentalBagIds(rentalBag) {
    return JSON.stringify((rentalBag || []).map((film) => film.id));
  }

  function hydrateRentalBagFromIds(savedIds, films) {
    if (!Array.isArray(savedIds)) {
      return [];
    }

    const hydrated = [];
    savedIds.forEach((id) => {
      const film = (films || []).find((movie) => movie.id === id);
      if (film && !hydrated.some((rental) => rental.id === id)) {
        hydrated.push(film);
      }
    });
    return hydrated;
  }

  function buildTrailerEmbedSrc(trailerUrl) {
    if (!trailerUrl) {
      return "";
    }
    return `${trailerUrl}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }

  function resolveTrailerFilmById(films, id) {
    return (films || []).find((film) => String(film.id) === String(id) && film.trailer) || null;
  }

  return {
    parseMoodText,
    scoreFreeText,
    serializeRentalBagIds,
    hydrateRentalBagFromIds,
    buildTrailerEmbedSrc,
    resolveTrailerFilmById,
  };
});
