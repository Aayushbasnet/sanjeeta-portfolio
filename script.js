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

const audioDock = document.querySelector("[data-audio-dock]");

if (audioDock) {
  const audioIdeas = [
    {
      title: "Garden Morning",
      description: "Great for the hero or welcome section",
      hint: "Add an MP3 later in assets/audio"
    },
    {
      title: "Story Time Sparkle",
      description: "Lovely for gallery transitions and project highlights",
      hint: "This slot is ready for a gentle theme track"
    },
    {
      title: "Calm Classroom Corner",
      description: "Perfect for reflective sections or learning stories",
      hint: "Nature ambience or soft music would fit beautifully"
    }
  ];

  audioDock.innerHTML = audioIdeas
    .map(
      (item) => `
        <article class="audio-chip">
          <strong>${item.title}</strong>
          <span>${item.description}</span>
          <p>${item.hint}</p>
        </article>
      `
    )
    .join("");
}

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
