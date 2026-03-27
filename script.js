const sectionsToReveal = document.querySelectorAll(
  ".story-card, .timeline-card, .project-card, .credential-card, .download-card, .audio-panel, .mosaic-card, .audio-idea-card, .slider"
);

sectionsToReveal.forEach((section) => section.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

sectionsToReveal.forEach((section) => observer.observe(section));

const slider = document.querySelector("[data-slider]");

if (slider) {
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const prevButton = slider.querySelector("[data-slider-prev]");
  const nextButton = slider.querySelector("[data-slider-next]");
  const dotsRoot = slider.querySelector("[data-slider-dots]");
  let activeIndex = 0;
  let autoPlayId;

  const renderDots = () => {
    dotsRoot.innerHTML = slides
      .map(
        (_, index) =>
          `<button class="slider-dot${
            index === activeIndex ? " is-active" : ""
          }" type="button" aria-label="Go to slide ${index + 1}" data-index="${index}"></button>`
      )
      .join("");
  };

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    renderDots();
  };

  const startAutoPlay = () => {
    window.clearInterval(autoPlayId);
    autoPlayId = window.setInterval(() => showSlide(activeIndex + 1), 4200);
  };

  prevButton?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    startAutoPlay();
  });

  nextButton?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    startAutoPlay();
  });

  dotsRoot?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-index]");
    if (!button) return;
    showSlide(Number(button.dataset.index));
    startAutoPlay();
  });

  showSlide(0);
  startAutoPlay();
}

const galleryPage = document.querySelector(".gallery-page");
const flowerCursor = document.querySelector(".cursor-flower");
const homePage = document.querySelector(".home-page");
const bloomCursor = document.querySelector(".cursor-bloom");

if (galleryPage && flowerCursor && window.matchMedia("(pointer: fine)").matches) {
  const flowerIcons = ["🌼", "🌸", "🌷", "🌻"];
  let trailTick = 0;

  window.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    flowerCursor.style.opacity = "1";
    flowerCursor.style.left = `${clientX}px`;
    flowerCursor.style.top = `${clientY}px`;

    trailTick += 1;
    if (trailTick % 3 !== 0) return;

    const petal = document.createElement("span");
    petal.className = "flower-trail";
    petal.textContent = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];
    petal.style.left = `${clientX}px`;
    petal.style.top = `${clientY}px`;
    document.body.appendChild(petal);

    window.setTimeout(() => {
      petal.remove();
    }, 820);
  });

  window.addEventListener("mouseleave", () => {
    flowerCursor.style.opacity = "0";
  });
}

if (homePage && bloomCursor && window.matchMedia("(pointer: fine)").matches) {
  const themedSections = Array.from(document.querySelectorAll("[data-cursor-theme]"));
  const sectionTrailMap = {
    sun: ["☀️", "✨"],
    flower: ["🌸", "🌼"],
    leaf: ["🍃", "🌿"],
    sparkle: ["✨", "🪄"],
    star: ["⭐", "🌟"],
    heart: ["💗", "💌"],
    music: ["🎵", "🎶"],
    rainbow: ["🌈", "💛"]
  };
  let activeTheme = "sun";
  let trailTick = 0;

  const applyTheme = (theme) => {
    bloomCursor.className = "cursor-bloom";
    bloomCursor.classList.add(`theme-${theme}`);
    activeTheme = theme;
  };

  applyTheme(activeTheme);

  window.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    bloomCursor.style.opacity = "1";
    bloomCursor.style.left = `${clientX}px`;
    bloomCursor.style.top = `${clientY}px`;

    const hoveredSection = themedSections.find((section) => {
      const rect = section.getBoundingClientRect();
      return clientY >= rect.top && clientY <= rect.bottom;
    });

    const nextTheme = hoveredSection?.dataset.cursorTheme || "sun";
    if (nextTheme !== activeTheme) {
      applyTheme(nextTheme);
    }

    trailTick += 1;
    if (trailTick % 4 !== 0) return;

    const bloom = document.createElement("span");
    bloom.className = "flower-trail";
    const icons = sectionTrailMap[activeTheme] || ["✨"];
    bloom.textContent = icons[Math.floor(Math.random() * icons.length)];
    bloom.style.left = `${clientX}px`;
    bloom.style.top = `${clientY}px`;
    document.body.appendChild(bloom);

    window.setTimeout(() => {
      bloom.remove();
    }, 820);
  });

  window.addEventListener("mouseleave", () => {
    bloomCursor.style.opacity = "0";
  });
}

const formatAudioTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

const audioSliders = Array.from(document.querySelectorAll("[data-audio-slider]"));

audioSliders.forEach((slider) => {
  const cards = Array.from(slider.querySelectorAll("[data-audio-card]"));
  const prevButton = slider.querySelector("[data-audio-prev]");
  const nextButton = slider.querySelector("[data-audio-next]");
  const dotsRoot = slider.querySelector("[data-audio-dots]");
  let activeIndex = 0;

  if (!cards.length || !dotsRoot) return;

  const renderDots = () => {
    dotsRoot.innerHTML = cards
      .map(
        (_, index) =>
          `<button class="slider-dot${
            index === activeIndex ? " is-active" : ""
          }" type="button" aria-label="Go to audio ${index + 1}" data-audio-index="${index}"></button>`
      )
      .join("");
  };

  const showCard = (index) => {
    activeIndex = (index + cards.length) % cards.length;
    cards.forEach((card, cardIndex) => {
      const isActive = cardIndex === activeIndex;
      card.classList.toggle("is-active", isActive);
      if (!isActive) {
        const audio = card.querySelector("[data-audio-element]");
        if (audio) audio.pause();
      }
    });
    renderDots();
  };

  prevButton?.addEventListener("click", () => showCard(activeIndex - 1));
  nextButton?.addEventListener("click", () => showCard(activeIndex + 1));
  dotsRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-audio-index]");
    if (!button) return;
    showCard(Number(button.dataset.audioIndex));
  });

  showCard(0);
});

const audioCards = Array.from(document.querySelectorAll("[data-audio-card]"));

if (audioCards.length) {
  const pauseOtherAudio = (activeAudio) => {
    audioCards.forEach((card) => {
      const audio = card.querySelector("[data-audio-element]");
      const toggle = card.querySelector("[data-audio-toggle]");
      if (audio !== activeAudio) {
        audio.pause();
        card.dataset.playing = "false";
        if (toggle) toggle.textContent = "Play";
      }
    });
  };

  audioCards.forEach((card) => {
    const audio = card.querySelector("[data-audio-element]");
    const toggle = card.querySelector("[data-audio-toggle]");
    const progress = card.querySelector("[data-audio-progress]");
    const current = card.querySelector("[data-audio-current]");
    const duration = card.querySelector("[data-audio-duration]");
    const volume = card.querySelector("[data-audio-volume]");

    if (!audio || !toggle || !progress || !current || !duration || !volume) return;

    card.dataset.playing = "false";
    audio.volume = Number(volume.value);

    const syncProgress = () => {
      const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      progress.style.width = `${percent}%`;
      current.textContent = formatAudioTime(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", () => {
      duration.textContent = formatAudioTime(audio.duration);
      syncProgress();
    });

    audio.addEventListener("timeupdate", syncProgress);

    audio.addEventListener("play", () => {
      pauseOtherAudio(audio);
      card.dataset.playing = "true";
      toggle.textContent = "Pause";
    });

    audio.addEventListener("pause", () => {
      card.dataset.playing = "false";
      toggle.textContent = "Play";
    });

    audio.addEventListener("ended", () => {
      card.dataset.playing = "false";
      toggle.textContent = "Play";
      progress.style.width = "0%";
      current.textContent = "0:00";
    });

    toggle.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    volume.addEventListener("input", () => {
      audio.volume = Number(volume.value);
    });
  });
}

function initRocketGame() {
  var rocketGame = document.querySelector("[data-game='rocket']");
  var targetEl;
  var countEl;
  var bank;
  var message;
  var resetButton;
  var rocket;
  var target = 5;
  var count = 0;

  if (!rocketGame || rocketGame.getAttribute("data-ready") === "true") {
    return;
  }

  targetEl = rocketGame.querySelector("[data-rocket-target]");
  countEl = rocketGame.querySelector("[data-rocket-count]");
  bank = rocketGame.querySelector("[data-star-bank]");
  message = rocketGame.querySelector("[data-rocket-message]");
  resetButton = rocketGame.querySelector("[data-rocket-reset]");
  rocket = rocketGame.querySelector("[data-rocket]");

  if (!targetEl || !countEl || !bank || !message || !resetButton || !rocket) {
    return;
  }

  function updateRocketMessage() {
    if (count === target) {
      message.textContent = "Blast off! You counted the perfect number of stars.";
      rocket.classList.add("launch");
    } else if (count > target) {
      message.textContent = "Oops, that was too many stars. Try a new count.";
      rocket.classList.remove("launch");
    } else {
      message.textContent = "Keep counting to get the rocket ready.";
      rocket.classList.remove("launch");
    }
  }

  function onStarClick(event) {
    var star = event.currentTarget;

    if (star.className.indexOf("used") !== -1) {
      return;
    }

    star.className += " used";
    count += 1;
    countEl.textContent = String(count);
    updateRocketMessage();
  }

  function buildStars() {
    var i;
    var star;

    target = Math.floor(Math.random() * 4) + 4;
    count = 0;
    targetEl.textContent = String(target);
    countEl.textContent = "0";
    message.textContent = "Tap stars until the count matches the target.";
    rocket.classList.remove("launch");
    bank.innerHTML = "";

    for (i = 0; i < 8; i += 1) {
      star = document.createElement("button");
      star.type = "button";
      star.className = "star-token";
      star.appendChild(document.createTextNode("⭐"));
      star.addEventListener("click", onStarClick);
      bank.appendChild(star);
    }
  }

  resetButton.addEventListener("click", buildStars);
  rocketGame.setAttribute("data-ready", "true");
  buildStars();
}

function initPondGame() {
  var pondGame = document.querySelector("[data-game='sink']");
  var items;
  var floatZone;
  var sinkZone;
  var message;
  var i;

  if (!pondGame || pondGame.getAttribute("data-ready") === "true") {
    return;
  }

  items = pondGame.querySelectorAll(".pond-item");
  floatZone = pondGame.querySelector("[data-float-zone]");
  sinkZone = pondGame.querySelector("[data-sink-zone]");
  message = pondGame.querySelector("[data-pond-message]");

  if (!items.length || !floatZone || !sinkZone || !message) {
    return;
  }

  function onPondItemClick(event) {
    var item = event.currentTarget;
    var answer = item.getAttribute("data-answer");
    var bubble = document.createElement("div");

    bubble.className = "pond-bubble";
    bubble.appendChild(document.createTextNode(item.textContent));

    if (answer === "float") {
      floatZone.appendChild(bubble);
      message.textContent = item.textContent + " floats. Great predicting!";
    } else {
      sinkZone.appendChild(bubble);
      message.textContent = item.textContent + " sinks. Nice thinking!";
    }

    item.disabled = true;
    item.style.opacity = "0.45";
  }

  for (i = 0; i < items.length; i += 1) {
    items[i].addEventListener("click", onPondItemClick);
  }

  pondGame.setAttribute("data-ready", "true");
}

function initPatternGame() {
  var patternGame = document.querySelector("[data-game='pattern']");
  var flowers = ["🌸", "🌼", "🌺", "🌷"];
  var targetRow;
  var answerRow;
  var checkButton;
  var resetButton;
  var message;
  var targetPattern = [];

  if (!patternGame || patternGame.getAttribute("data-ready") === "true") {
    return;
  }

  targetRow = patternGame.querySelector("[data-pattern-target]");
  answerRow = patternGame.querySelector("[data-pattern-answer]");
  checkButton = patternGame.querySelector("[data-pattern-check]");
  resetButton = patternGame.querySelector("[data-pattern-reset]");
  message = patternGame.querySelector("[data-pattern-message]");

  if (!targetRow || !answerRow || !checkButton || !resetButton || !message) {
    return;
  }

  function onFlowerClick(event) {
    var button = event.currentTarget;
    var currentIndex = parseInt(button.getAttribute("data-flower-index"), 10);
    var nextIndex = (currentIndex + 1) % flowers.length;

    button.setAttribute("data-flower-index", String(nextIndex));
    button.textContent = flowers[nextIndex];
  }

  function buildPattern() {
    var i;
    var targetCell;
    var answerCell;

    targetPattern = [];
    targetRow.innerHTML = "";
    answerRow.innerHTML = "";
    message.textContent = "Make the bottom row look the same as the top row.";

    for (i = 0; i < 4; i += 1) {
      targetPattern.push(flowers[Math.floor(Math.random() * flowers.length)]);
    }

    for (i = 0; i < targetPattern.length; i += 1) {
      targetCell = document.createElement("div");
      targetCell.className = "flower-cell fixed";
      targetCell.appendChild(document.createTextNode(targetPattern[i]));
      targetRow.appendChild(targetCell);

      answerCell = document.createElement("button");
      answerCell.type = "button";
      answerCell.className = "flower-cell";
      answerCell.setAttribute("data-flower-index", "0");
      answerCell.appendChild(document.createTextNode(flowers[i % flowers.length]));
      answerCell.addEventListener("click", onFlowerClick);
      answerRow.appendChild(answerCell);
    }
  }

  function checkPattern() {
    var answerCells = answerRow.children;
    var i;
    var isMatch = true;

    for (i = 0; i < answerCells.length; i += 1) {
      if (answerCells[i].textContent !== targetPattern[i]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      message.textContent = "Beautiful pattern match. You spotted every flower!";
    } else {
      message.textContent = "Not quite yet. Look closely and try again.";
    }
  }

  checkButton.addEventListener("click", checkPattern);
  resetButton.addEventListener("click", buildPattern);
  patternGame.setAttribute("data-ready", "true");
  buildPattern();
}

function initGames() {
  initRocketGame();
  initPondGame();
  initPatternGame();
}

initGames();
document.addEventListener("DOMContentLoaded", initGames);
