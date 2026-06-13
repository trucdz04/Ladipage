  
  //////////////FAQ/////////////
$(document).ready(function () {
    // Toggle the component with class accordion_body
    $(".accordion_head").click(function () {
        if ($('.accordion_body').is(':visible')) {
            $(".accordion_body").slideUp(300);
            $(".plusminus").html('<i class="fa fa-angle-down" aria-hidden="true"></i>');
        }
        if ($(this).next(".accordion_body").is(':visible')) {
            $(this).next(".accordion_body").slideUp(300);
            $(this).find(".plusminus").html('<i class="fa fa-angle-down" aria-hidden="true"></i>');
        } else {
            $(this).next(".accordion_body").slideDown(300);
            $(this).find(".plusminus").html('<i class="fa fa-angle-up" aria-hidden="true"></i>');
        }
    });
}); 

//bannder-slider
const multiplier = {
  translate: .1,
  rotate: .015
}

new Swiper('.swiper1', {
  slidesPerView: 2.2,
  spaceBetween: 150,
  centeredSlides: true,
  loop: true,
  grabCursor: true,
  navigation: {
    nextEl: '.swiper-button-next.swiper1-button-next',
    prevEl: '.swiper-button-prev.swiper1-button-prev',
  },
  breakpoints: {
    1500: { spaceBetween: 150 }, 
    1400: { spaceBetween: 100 },
    992: { spaceBetween: 50 },
    768: { spaceBetween: 30 },
    640: {
      slidesPerView: 1,  
      spaceBetween: 0,
    },
    100: {
      slidesPerView: 1,  
      spaceBetween: 0,
    } 
  },
});
 
function calculateWheel() {
  const slides = document.querySelectorAll('.single')
  slides.forEach((slide, i) => {
      const rect = slide.getBoundingClientRect()
      const r = window.innerWidth * .5 - (rect.x + rect.width * .5)
      let ty = Math.abs(r) * multiplier.translate - rect.width * multiplier.translate

      if (ty < 0) {
          ty = 0
      }
      const transformOrigin = r < 0 ? 'left top' : 'right top'
      slide.style.transform = `translate(0, ${ty}px) rotate(${-r * multiplier.rotate}deg)`
      slide.style.transformOrigin = transformOrigin
  })
}

function raf() {
  requestAnimationFrame(raf)
  calculateWheel()
}

raf();


////////////
 
document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".intro-detail-img");
    if (!wrapper) return;
    const video = wrapper.querySelector(".my-video");

    // Play / Pause
    const playBtn = wrapper.querySelector(".play-toggle");
    const playIcon = wrapper.querySelector(".icon-play");
    const pauseIcon = wrapper.querySelector(".icon-pause");

    // Mute / Unmute
    const muteBtn = wrapper.querySelector(".mute-toggle");
    const mutedIcon = wrapper.querySelector(".icon-muted");
    const unmutedIcon = wrapper.querySelector(".icon-unmuted");

    /* PLAY / PAUSE */
    playBtn.addEventListener("click", () => {
        // Ensure sources are loaded (fix for Firefox lazy loading)
        var sources = video.querySelectorAll("source");
        var needsLoad = false;
        sources.forEach(function(source) {
            if (!source.src && source.dataset.src) {
                source.src = source.dataset.src;
                needsLoad = true;
            }
        });
        
        if (needsLoad) {
            video.load();
            video.classList.remove("lazy");
            // Wait for video to be ready then play
            video.addEventListener("canplay", function onCanPlay() {
                video.removeEventListener("canplay", onCanPlay);
                video.play();
            }, { once: true });
        } else {
            video.paused ? video.play() : video.pause();
        }
    });

    video.addEventListener("play", () => {
        wrapper.classList.add("playing");
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
    });

    video.addEventListener("pause", () => {
        wrapper.classList.remove("playing");
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
    });

    /* MUTE / UNMUTE */
    muteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // IMPORTANT
        video.muted = !video.muted;

        mutedIcon.style.display = video.muted ? "block" : "none";
        unmutedIcon.style.display = video.muted ? "none" : "block";
    });
});
