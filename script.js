
// Scrolling animation for .text-banner
document.addEventListener("DOMContentLoaded", function () {
  const textBanner = document.querySelector(".text-banner");
  const originalHTML = textBanner.innerHTML;
  const screenWidth = window.innerWidth;
  const repeatedHTML = originalHTML.repeat(1000);
  textBanner.innerHTML = repeatedHTML;

  function animateScroll() {
    requestAnimationFrame(animateScroll);
    const scrollPos = performance.now() / 15; 

    const displacement = (scrollPos % screenWidth) - screenWidth;

    textBanner.style.transform = `translateX(${displacement}px)`;
  }

  animateScroll();
});
