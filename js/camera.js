const cameraRoot = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let animationFrame = null;

function updateCameraVariables() {
  currentX += (targetX - currentX) * 0.075;
  currentY += (targetY - currentY) * 0.075;

  cameraRoot.style.setProperty("--camera-x", `${currentX.toFixed(2)}px`);
  cameraRoot.style.setProperty("--camera-y", `${currentY.toFixed(2)}px`);
  cameraRoot.style.setProperty("--camera-depth", `${Math.hypot(currentX, currentY).toFixed(2)}px`);
  cameraRoot.style.setProperty("--camera-scroll", `${(window.scrollY * 0.08).toFixed(2)}px`);

  animationFrame = window.requestAnimationFrame(updateCameraVariables);
}

function handlePointerMove(event) {
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;

  targetX = x * 5.5;
  targetY = y * 4.5;
}

function handlePointerLeave() {
  targetX = 0;
  targetY = 0;
}

function startCamera() {
  if (prefersReducedMotion.matches || animationFrame) {
    return;
  }

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerleave", handlePointerLeave);
  animationFrame = window.requestAnimationFrame(updateCameraVariables);
}

function stopCamera() {
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerleave", handlePointerLeave);
  window.cancelAnimationFrame(animationFrame);
  animationFrame = null;
  targetX = 0;
  targetY = 0;
  currentX = 0;
  currentY = 0;
  cameraRoot.style.setProperty("--camera-x", "0px");
  cameraRoot.style.setProperty("--camera-y", "0px");
  cameraRoot.style.setProperty("--camera-depth", "0px");
  cameraRoot.style.setProperty("--camera-scroll", "0px");
}

prefersReducedMotion.addEventListener("change", () => {
  if (prefersReducedMotion.matches) {
    stopCamera();
  } else {
    startCamera();
  }
});

startCamera();
