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


// Scrolling animation for text banners
document.addEventListener("DOMContentLoaded", function () {

  const textBanner = document.getElementById("text-banner");
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

  const textBanner2 = document.getElementById("text-banner-2");
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








