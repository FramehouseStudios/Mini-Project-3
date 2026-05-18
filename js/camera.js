const cameraRoot = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)");

const SETTLE_EPSILON = 0.05;
const ENABLE_CAMERA_PARALLAX = false;

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let currentScroll = 0;
let animationFrame = null;
let bound = false;

function writeVar(name, value) {
  cameraRoot.style.setProperty(name, `${value.toFixed(2)}px`);
}

function tick() {
  currentX += (targetX - currentX) * 0.075;
  currentY += (targetY - currentY) * 0.075;

  const targetScroll = window.scrollY * 0.08;
  currentScroll += (targetScroll - currentScroll) * 0.18;

  writeVar("--camera-x", currentX);
  writeVar("--camera-y", currentY);
  writeVar("--camera-depth", Math.hypot(currentX, currentY));
  writeVar("--camera-scroll", currentScroll);

  const settled =
    Math.abs(targetX - currentX) < SETTLE_EPSILON &&
    Math.abs(targetY - currentY) < SETTLE_EPSILON &&
    Math.abs(targetScroll - currentScroll) < SETTLE_EPSILON;

  // Stop the loop once motion has settled; wake() restarts it on the next input.
  animationFrame = settled ? null : window.requestAnimationFrame(tick);
}

function wake() {
  if (animationFrame === null && !prefersReducedMotion.matches && !document.hidden) {
    animationFrame = window.requestAnimationFrame(tick);
  }
}

function handlePointerMove(event) {
  targetX = (event.clientX / window.innerWidth - 0.5) * 5.5;
  targetY = (event.clientY / window.innerHeight - 0.5) * 4.5;
  wake();
}

function handlePointerLeave() {
  targetX = 0;
  targetY = 0;
  wake();
}

function startCamera() {
  if (!ENABLE_CAMERA_PARALLAX || prefersReducedMotion.matches || bound) {
    return;
  }

  if (!coarsePointer.matches) {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
  }
  window.addEventListener("scroll", wake, { passive: true });
  bound = true;
  wake();
}

function stopCamera() {
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerleave", handlePointerLeave);
  window.removeEventListener("scroll", wake);
  bound = false;

  if (animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  targetX = targetY = currentX = currentY = currentScroll = 0;
  writeVar("--camera-x", 0);
  writeVar("--camera-y", 0);
  writeVar("--camera-depth", 0);
  writeVar("--camera-scroll", 0);
}

prefersReducedMotion.addEventListener("change", () => {
  if (prefersReducedMotion.matches) {
    stopCamera();
  } else {
    startCamera();
  }
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    wake();
  }
});

startCamera();

// Lightweight navbar collapse toggle (replaces Bootstrap's bundled JS).
document.querySelectorAll('[data-bs-toggle="collapse"]').forEach((toggler) => {
  const target = document.querySelector(toggler.getAttribute("data-bs-target"));
  if (!target) {
    return;
  }

  toggler.addEventListener("click", () => {
    const open = target.classList.toggle("show");
    toggler.setAttribute("aria-expanded", String(open));
  });

  target.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      target.classList.remove("show");
      toggler.setAttribute("aria-expanded", "false");
    }
  });
});
