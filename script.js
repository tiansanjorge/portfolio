// Dropdown navbar button

function dropdown() {
  const dropdownMenu = document.getElementById("dropdown-menu");
  const barIcon = document.getElementById("bar-icon");
  const xIcon = document.getElementById("x-icon");

  if (dropdownMenu.classList.contains("active")) {
    dropdownMenu.classList.remove("active");

    barIcon.classList.remove("d-none");
    barIcon.classList.add("d-block");

    xIcon.classList.remove("d-block");
    xIcon.classList.add("d-none");
  } else {
    dropdownMenu.classList.add("active");

    barIcon.classList.remove("d-block");
    barIcon.classList.add("d-none");

    xIcon.classList.remove("d-none");
    xIcon.classList.add("d-block");
  }
}

// Scroll-triggered animations
document.addEventListener("DOMContentLoaded", function () {
  const scrollElements = document.querySelectorAll(".scroll-reveal");

  if (scrollElements.length > 0) {
    const elementInView = (el, percentageScroll = 100) => {
      const elementTop = el.getBoundingClientRect().top;
      return (
        elementTop <=
        (window.innerHeight || document.documentElement.clientHeight) *
          (percentageScroll / 100)
      );
    };

    const displayScrollElement = (element) => {
      element.classList.add("visible");
    };

    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el, 85)) {
          displayScrollElement(el);
        }
      });
    };

    window.addEventListener("scroll", () => {
      handleScrollAnimation();
    });

    // Trigger on page load for elements already in view
    handleScrollAnimation();
  }
});

// Scrolling animation for text banners
document.addEventListener("DOMContentLoaded", function () {
  const textBanner = document.getElementById("text-banner");
  if (!textBanner) return;

  const originalHTML = textBanner.innerHTML;
  // Duplicate the content enough times to ensure seamless loop
  const repeatedHTML = originalHTML.repeat(50);
  textBanner.innerHTML = repeatedHTML;

  // Measure the width of a single repetition
  const tempDiv = document.createElement("div");
  tempDiv.style.cssText =
    "position: absolute; visibility: hidden; white-space: nowrap;";
  tempDiv.className = textBanner.className;
  tempDiv.innerHTML = originalHTML;
  document.body.appendChild(tempDiv);
  const singleWidth = tempDiv.offsetWidth;
  document.body.removeChild(tempDiv);

  let position = 0;
  const speed = 0.5; // pixels per frame

  function animateScroll() {
    requestAnimationFrame(animateScroll);

    position -= speed;

    // Reset position seamlessly when one full cycle completes
    if (Math.abs(position) >= singleWidth) {
      position = position % singleWidth;
    }

    textBanner.style.transform = `translateX(${position}px)`;
  }

  animateScroll();
});

document.addEventListener("DOMContentLoaded", function () {
  const textBanner2 = document.getElementById("text-banner-2");
  if (!textBanner2) return;

  const originalHTML2 = textBanner2.innerHTML;
  const repeatedHTML2 = originalHTML2.repeat(50);
  textBanner2.innerHTML = repeatedHTML2;

  const tempDiv2 = document.createElement("div");
  tempDiv2.style.cssText =
    "position: absolute; visibility: hidden; white-space: nowrap;";
  tempDiv2.className = textBanner2.className;
  tempDiv2.innerHTML = originalHTML2;
  document.body.appendChild(tempDiv2);
  const singleWidth2 = tempDiv2.offsetWidth;
  document.body.removeChild(tempDiv2);

  let position2 = 0;
  const speed2 = 0.5;

  function animateScroll2() {
    requestAnimationFrame(animateScroll2);

    position2 -= speed2;

    if (Math.abs(position2) >= singleWidth2) {
      position2 = position2 % singleWidth2;
    }

    textBanner2.style.transform = `translateX(${position2}px)`;
  }

  animateScroll2();
});
