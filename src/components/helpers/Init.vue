<template>
  <div class="hide hidden"></div>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import { useWindowSize, useDebounceFn } from "@vueuse/core";

const { width } = useWindowSize();
const shown = ref(false);

/* ANCHOR LINKS */
function initSmoothScroll() { 
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  function smoothScrollTo(element) {
    const startPosition = window.scrollY;
    const elementTop = element.getBoundingClientRect().top;
    const targetPosition = elementTop + startPosition;
    const duration = 800;
    let startTime = null;

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease = (t) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      const currentPos =
        startPosition + (targetPosition - startPosition) * ease(progress);

      window.scrollTo(0, currentPos);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }

  // Add click handler to each anchor link
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        smoothScrollTo(targetElement);
        history.pushState(null, "", link.getAttribute("href"));
      }
    });
  });
}

onMounted(() => {
  const root = document.documentElement;
  const html = document.getElementsByTagName("html")[0];
  const start = new Date().getTime();

  initSmoothScroll();

  /* GET TIME TO LOAD PAGE */
  window.onload = function () {
    const end = new Date().getTime();
    const timeTaken = end - start;
    document.documentElement.setAttribute(
      "data-speed",
      Math.round(timeTaken / 1000),
    );
  };
  /* CHECK IF IS IOS DEVICE */
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) {
    document.documentElement.setAttribute("data-ios", 1);
  }

  /* SCROLL OBSERVER FOR PAGE */
  let prevPos = 0;
  let isScrollingUp = false;

  function flip(attr, state) {
    root.setAttribute(attr, String(state));
  }

  const scrollHandler = useDebounceFn(() => {
    const pos = window.scrollY;
    const delta = pos - prevPos;
    const scrollDirection = Math.sign(delta) === -1;
    const isBottom =
      pos + window.innerHeight > document.body.offsetHeight - 100;
    const isTop = pos < 100;

    if (delta < -15 || delta > 15) {
      isScrollingUp = scrollDirection;
    }

    if (window.scrollY > window.innerHeight / 2) {
      root.setAttribute("data-is-hero", "false");
    } else {
      root.setAttribute("data-is-hero", "true");
    }

    flip("data-is-scrolling-up", isScrollingUp);
    flip("data-is-bottom", isBottom);
    flip("data-is-top", isTop);

    prevPos = pos;
  }, 20);

  window.addEventListener("scroll", () => scrollHandler(), { passive: true });
  /* PARALLAX ANIMATIONS */
  const parallaxReveal = document.querySelectorAll(".parallax-wrap");
  if (!document.documentElement.dataset.ios) {
    parallaxReveal.forEach((el) => {
      const img = el.querySelector(".parallax");

      if (!img) return;
      img.animate(
        {
          transform: ["none", "translateY(30%)"],
        },
        {
          fill: "both",
          timeline: new ViewTimeline({ subject: el }),
          rangeStart: { rangeName: "exit", offset: CSS.percent(5) },
          rangeEnd: { rangeName: "exit", offset: CSS.percent(100) },
        },
      );
    });
  }
});
/* CREDITS, PLEASE LEAVE THIS IN PLACE */
watch(width, (val) => {
  if (!shown.value) {
    console.log(
      "%c ♻️🔋+ 🧠👷🏽+ 🗜 = 🚀🍃🌐" +
        "\n%cThis site has a low carbon footprint " +
        "\n%c🪙CREDITS:" +
        "\n%cWebsite made with Astro + Storyblok CMS" +
        "\n%cby: https://unfolding.io",
      "font-family:Verdana; font-size: 20px; color: #2A4D47; font-weight:bold; padding: 5px 0; opacity: 0.5; ",
      "font-family:Verdana; font-size: 25px; color: #2A4D47; font-weight:bold; padding: 5px 0; ",
      "font-family:Verdana; font-size:16px; color: #2A4D47; font-weight:bold;  padding: 5px 0; ",
      "font-family:Verdana; font-size:12px; color: #2A4D47; padding: 2px 0; ",
      "font-family:Verdana; font-size:12px; color: #2A4D47; padding: 2px 0; ",
    );
    shown.value = true;
  }
});
</script>
