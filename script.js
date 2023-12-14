
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

document.addEventListener("DOMContentLoaded", function () {
  const textBanner2 = document.querySelector(".text-banner-2");
  const originalHTML2 = textBanner2.innerHTML;
  const screenWidth2 = window.innerWidth;
  const repeatedHTML2 = originalHTML2.repeat(1000);
  textBanner2.innerHTML = repeatedHTML2;

  function animateScroll2() {
    requestAnimationFrame(animateScroll2);
    const scrollPos2 = performance.now() / 15;

    const displacement2 = (scrollPos2 % screenWidth2) - screenWidth2;

    textBanner2.style.transform = `translateX(${displacement2}px)`;
  }

  animateScroll2();
});
