/** -------------------------------------------------
 *  3D PARTICLE BACKGROUND (CANVAS)
 * -------------------------------------------------*/
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d", { alpha: true });

let W, H, DPR;
let particles = [];
const COUNT = 140;
const MAX_DIST = 140;
const DEPTH_NEAR = 0.4;
const DEPTH_FAR = 1.8;
let mouse = { x: 0, y: 0, vx: 0, vy: 0, moved: false };

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.width = Math.floor(innerWidth * DPR);
  H = canvas.height = Math.floor(innerHeight * DPR);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
}
resize();
addEventListener("resize", resize);

class Particle {
  constructor() {
    this.reset(true);
  }
  reset(spawnRandom = false) {
    this.z = DEPTH_NEAR + Math.random() * (DEPTH_FAR - DEPTH_NEAR);
    const px = spawnRandom ? Math.random() * W : Math.random() < 0.5 ? 0 : W;
    const py = spawnRandom ? Math.random() * H : Math.random() * H;
    this.x = px;
    this.y = py;
    const base = 0.2 + Math.random() * 0.8;
    this.vx = (Math.random() - 0.5) * base * this.z * 0.6;
    this.vy = (Math.random() - 0.5) * base * this.z * 0.6;
    this.size = (0.8 + Math.random() * 2.2) * this.z * DPR;
    this.alpha = 0.4 + Math.random() * 0.6;
  }
  step() {
    const parallax = 12 * (this.z - 0.5);
    this.x += this.vx + mouse.vx * 0.02 * this.z;
    this.y += this.vy + mouse.vy * 0.02 * this.z;

    if (mouse.moved) {
      this.x += ((mouse.x * DPR) - W * 0.5) / W * parallax;
      this.y += ((mouse.y * DPR) - H * 0.5) / H * parallax;
    }

    if (this.x < -20) this.x = W + 20;
    if (this.x > W + 20) this.x = -20;
    if (this.y < -20) this.y = H + 20;
    if (this.y > H + 20) this.y = -20;
  }
  draw() {
    ctx.beginPath();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#19e28a";
    ctx.shadowBlur = 20 * this.z;
    ctx.shadowColor = "rgba(25,226,138,0.55)";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
}
initParticles();

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      const limit = MAX_DIST * Math.min(a.z, b.z);
      if (dist < limit) {
        const alpha = 0.12 * (1 - dist / limit);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(25,226,138,${alpha})`;
        ctx.lineWidth = 1 * DPR * 0.6;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

function tick() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.step();
    p.draw();
  });
  drawConnections();
  mouse.vx *= 0.92;
  mouse.vy *= 0.92;
  requestAnimationFrame(tick);
}
tick();

addEventListener("mousemove", (e) => {
  mouse.moved = true;
  mouse.vx += (e.clientX - mouse.x) * 0.25;
  mouse.vy += (e.clientY - mouse.y) * 0.25;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
addEventListener("mouseleave", () => (mouse.moved = false));

/** -------------------------------------------------
 *  NAV + ACTIVE SECTION + REVEAL
 * -------------------------------------------------*/
document.getElementById("year").textContent = new Date().getFullYear();

const toggle = document.querySelector(".nav-toggle");
const list = document.querySelector(".nav-links");

toggle?.addEventListener("click", () => {
  list.classList.toggle("show");
});

const sections = [...document.querySelectorAll("section[id]")];
const links = [...document.querySelectorAll(".nav-link")];
const getLink = (id) => links.find(a => a.getAttribute("href") === `#${id}`);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove("active"));
        getLink(entry.target.id)?.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0.1 }
);
sections.forEach((sec) => observer.observe(sec));

/* Reveal Animation */
const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
revealItems.forEach((item) => revealObserver.observe(item));

/** -------------------------------------------------
 *  SWIPER SLIDERS
 * -------------------------------------------------*/
window.addEventListener("load", () => {

  new Swiper(".projectSwiper", {
    slidesPerView: 2,
    spaceBetween: 20,
    loop: true,
    autoplay: { delay: 2500 },
    navigation: {
      nextEl: ".projectSwiper .swiper-button-next",
      prevEl: ".projectSwiper .swiper-button-prev",
    },
    pagination: {
      el: ".projectSwiper .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
    },
  });

  new Swiper(".certSwiper", {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    autoplay: { delay: 2600 },
    navigation: {
      nextEl: ".certSwiper .swiper-button-next",
      prevEl: ".certSwiper .swiper-button-prev",
    },
    pagination: {
      el: ".certSwiper .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      600: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
});

/** -------------------------------------------------
 *  RESUME MODAL (OPEN / CLOSE / ZOOM / FULLSCREEN)
 * -------------------------------------------------*/

const modal = document.getElementById("resumeModal");
const openBtn = document.getElementById("openResume");
const closeBtn = document.querySelector(".resume-close");
const iframe = document.querySelector(".resume-frame");
const wrap = document.querySelector(".resume-frame-wrap");

const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const fullscreenBtn = document.getElementById("openFullscreen");

let zoom = 1;

/* Open Modal */
openBtn?.addEventListener("click", () => {
  modal.setAttribute("aria-hidden", "false");
  zoom = 1;
  iframe.style.transform = "scale(1)";
});

/* Close Modal */
function closeModal() {
  modal.setAttribute("aria-hidden", "true");
}

closeBtn?.addEventListener("click", closeModal);

/* Close on background click */
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

/* ESC to close */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* Zoom In */
zoomIn?.addEventListener("click", () => {
  zoom += 0.1;
  iframe.style.transform = `scale(${zoom})`;
});

/* Zoom Out */
zoomOut?.addEventListener("click", () => {
  if (zoom > 0.5) zoom -= 0.1;
  iframe.style.transform = `scale(${zoom})`;
});

/* Fullscreen */
fullscreenBtn?.addEventListener("click", () => {
  if (iframe.requestFullscreen) iframe.requestFullscreen();
});
/* -------------------------------------------------
 *  CV MODAL (SECOND MODAL)
 * -------------------------------------------------*/
const cvModal = document.getElementById("cvModal");
const openCV = document.getElementById("openCV");
const cvClose = document.querySelector(".cv-close");
const cvFrame = document.getElementById("cvFrame");

const cvZoomIn = document.getElementById("cvZoomIn");
const cvZoomOut = document.getElementById("cvZoomOut");
const cvFullscreen = document.getElementById("openCVFullscreen");

let cvZoom = 1;

// OPEN CV MODAL
openCV?.addEventListener("click", () => {
  cvModal.setAttribute("aria-hidden", "false");
  cvZoom = 1;
  cvFrame.style.transform = "scale(1)";
});

// CLOSE CV MODAL
function closeCVModal() {
  cvModal.setAttribute("aria-hidden", "true");
}

cvClose?.addEventListener("click", closeCVModal);

// CLICK OUTSIDE TO CLOSE
cvModal?.addEventListener("click", (e) => {
  if (e.target === cvModal) closeCVModal();
});

// ESC KEY CLOSE
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCVModal();
});

// ZOOM IN
cvZoomIn?.addEventListener("click", () => {
  cvZoom += 0.1;
  cvFrame.style.transform = `scale(${cvZoom})`;
});

// ZOOM OUT
cvZoomOut?.addEventListener("click", () => {
  if (cvZoom > 0.5) cvZoom -= 0.1;
  cvFrame.style.transform = `scale(${cvZoom})`;
});

// FULLSCREEN
cvFullscreen?.addEventListener("click", () => {
  if (cvFrame.requestFullscreen) cvFrame.requestFullscreen();
});
