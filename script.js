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
