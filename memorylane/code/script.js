window.twemoji = window.twemoji || { parse: function () {} };

document.querySelectorAll(".background-love").forEach((heart) => {
        heart.style.fontSize = `${16 + Math.random() * 28}px`;
      });

// Register ScrollTrigger when the animation library is available.
      if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      // Edit these caption strings to personalize the text for each photo.
      const captions = [
        "Sunshine on us, but you are the brightest light in my life. 💖",
        "Goffassing as always",
        "I swam acorrss, I jumped for you, oh what thing to do, Cause you were yellow",
        "shuyeeeee asiiiiii",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "The best is you my love",
        "lost in your gaze, found in your heart",
        "bhaab dui jon er e",
        "you aree my lolipop, my sweet candy",
        "to you my love, my heart, my everything",
        "eeeeeeeeeeeeeeeeeeeeeeeeeee",
        "Ice cream monsterrrrr",
        "My panda on a big pandaaaa",
        "oh....to have you in my life.....",
        "uuuuuuuuuuuummmmmmmmmaaaaaaaaahhhhhhhhhhh",
        "ki dekhooo????",
        "i always love our rickshaw rides together, my love",
        "OUR FIRST EVER PHOTO TOGETHER",
        "First ring i gave but not the last, my love",
        "First time I got so close to you, lojja lagtesilo onek",
        "I want us to always shine together, my love, my everything",
      ];

      // One card for each of the 21 photos in this folder.
      const memories = Array.from({ length: 21 }, (_, index) => ({
        image: `../assets/photos/${index + 1}.jpeg`,
        caption: captions[index],
        rotationAngle: [-2, 3, -1, 2, -3, 1][index % 6],
        emoji: ["💖", "🌸", "✨", "🎂", "💕", "🌷"][index % 6],
      }));

      // Create confetti elements
      function createConfetti() {
        const confettiContainer = document.getElementById("confetti-container");
        const colors = ["#ff6ec4", "#a485ff", "#ff4e91", "#c175ff", "#75c6ff"];

        for (let i = 0; i < 100; i++) {
          const confetti = document.createElement("div");
          confetti.className = "confetti-piece";

          // Random styles
          confetti.style.left = Math.random() * 100 + "vw";
          confetti.style.width = Math.random() * 15 + 5 + "px";
          confetti.style.height = Math.random() * 15 + 5 + "px";
          confetti.style.background =
            colors[Math.floor(Math.random() * colors.length)];
          confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
          confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

          // Animation
          const duration = Math.random() * 3 + 3;
          const delay = Math.random() * 5;

          confetti.style.animation = `floatDown ${duration}s ease-in ${delay}s infinite`;
          confetti.style.opacity = Math.random();

          confettiContainer.appendChild(confetti);
        }
      }

      document.addEventListener("DOMContentLoaded", function () {
        createConfetti();

        const galleryElement = document.getElementById("memoryGallery");
        const startSlideshowBtn = document.getElementById("startSlideshow");
        const slideshowModal = document.getElementById("slideshowModal");
        const slideshowImage = document.getElementById("slideshowImage");
        const slideshowCaption = document.getElementById("slideshowCaption");
        const slideshowModalControls = slideshowModal.querySelector(".slideshow-modal-controls");
        const toggleSlideshowBtn = document.getElementById("toggleSlideshow");
        const backButton = document.getElementById("backButton");
        const nextButton = document.getElementById("nextButton");

        let slideshowInterval;
        let currentSlide = 0;

        // Generate memory cards
        memories.forEach((memory, index) => {
          const memoryCard = document.createElement("div");
          memoryCard.className = "memory-card";
          memoryCard.tabIndex = 0;
          memoryCard.setAttribute("role", "button");
          memoryCard.setAttribute("aria-label", `View photo ${index + 1}: ${memory.caption}`);
          memoryCard.style.setProperty(
            "--rotate",
            `${memory.rotationAngle}deg`
          );

          const tapeElement = document.createElement("div");
          tapeElement.className = "card-tape";
          tapeElement.style.setProperty(
            "--rotate",
            `${memory.rotationAngle * 2}deg`
          );

          const imgElement = document.createElement("img");
          imgElement.className = "memory-img";
          imgElement.src = memory.image;
          imgElement.alt = `Memory ${index + 1}`;

          const captionElement = document.createElement("div");
          captionElement.className = "memory-caption";
          captionElement.textContent = memory.caption;
          const stickerElement = document.createElement("div");
          stickerElement.className = "card-sticker";
          stickerElement.textContent = memory.emoji;
          twemoji.parse(captionElement);
          twemoji.parse(stickerElement);

          memoryCard.appendChild(tapeElement);
          memoryCard.appendChild(imgElement);
          memoryCard.appendChild(captionElement);
          memoryCard.appendChild(stickerElement);
          galleryElement.appendChild(memoryCard);

          memoryCard.addEventListener("click", () => openPhoto(index));
          memoryCard.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openPhoto(index);
            }
          });
        });
        // Make slideshow controls visible
        document.querySelector(".slideshow-controls").style.opacity = "1";

        // Intersection Observer to animate cards as they enter viewport
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.3 }
        );

        // Observe all memory cards
        document.querySelectorAll(".memory-card").forEach((card) => {
          observer.observe(card);

          // Add animation delay for staggered effect
          const index = Array.from(galleryElement.children).indexOf(card);
          card.style.animationDelay = `${0.1 * index}s`;

          // Make all cards visible initially
          setTimeout(() => {
            card.classList.add("visible");
          }, 500 + index * 150);
        });

        function showSlide() {
          const memory = memories[currentSlide];
          slideshowImage.src = memory.image;
          slideshowImage.alt = `Memory ${currentSlide + 1}`;
          slideshowCaption.textContent = memory.caption;
          twemoji.parse(slideshowCaption);
        }

        function openPhoto(index) {
          clearInterval(slideshowInterval);
          slideshowInterval = null;
          currentSlide = index;
          showSlide();
          slideshowModalControls.hidden = true;
          slideshowModal.hidden = false;
          document.body.style.overflow = "hidden";
        }

        function startSlideshow() {
          currentSlide = 0;
          showSlide();
          slideshowModalControls.hidden = false;
          slideshowModal.hidden = false;
          document.body.style.overflow = "hidden";
          toggleSlideshowBtn.textContent = "⏸️ Pause";
          twemoji.parse(toggleSlideshowBtn);
          clearInterval(slideshowInterval);
          slideshowInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % memories.length;
            showSlide();
          }, 3000);
        }

        function toggleSlideshow() {
          if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
            toggleSlideshowBtn.textContent = "▶️ Resume";
            twemoji.parse(toggleSlideshowBtn);
          } else {
            toggleSlideshowBtn.textContent = "⏸️ Pause";
            twemoji.parse(toggleSlideshowBtn);
            slideshowInterval = setInterval(() => {
              currentSlide = (currentSlide + 1) % memories.length;
              showSlide();
            }, 3000);
          }
        }

        function closeSlideshow() {
          clearInterval(slideshowInterval);
          slideshowInterval = null;
          slideshowModal.hidden = true;
          document.body.style.overflow = "";
        }

        startSlideshowBtn.addEventListener("click", startSlideshow);
        toggleSlideshowBtn.addEventListener("click", toggleSlideshow);
        document.getElementById("closeSlideshow").addEventListener("click", closeSlideshow);
        document.getElementById("previousSlide").addEventListener("click", () => {
          currentSlide = (currentSlide - 1 + memories.length) % memories.length;
          showSlide();
        });
        document.getElementById("nextSlide").addEventListener("click", () => {
          currentSlide = (currentSlide + 1) % memories.length;
          showSlide();
        });
        slideshowModal.addEventListener("click", (event) => {
          if (event.target === slideshowModal) closeSlideshow();
        });
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && !slideshowModal.hidden) closeSlideshow();
        });
        // Event listeners for navigation buttons
        backButton.addEventListener("click", function () {
          window.location.href = "../../welcome/code/welcome.html"; // Return to the welcome page inside the music player shell
        });

        nextButton.addEventListener("click", function () {
          window.location.href = "../../cake/code/cake.html"; // Adjust this to your next surprise page URL
        });

        // Scroll animations with GSAP
        gsap.from(".header", {
          duration: 1,
          y: -50,
          opacity: 0,
          ease: "back.out(1.7)",
        });

        gsap.from(".navigation-buttons", {
          duration: 1,
          y: 50,
          opacity: 0,
          delay: 0.5,
          ease: "power3.out",
        });

        // Add animation to stickers
        gsap.utils.toArray(".sticker").forEach((sticker) => {
          gsap.to(sticker, {
            rotation: "random(-20, 20)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        // Create hover effect for memory cards
        document.querySelectorAll(".memory-card").forEach((card) => {
          card.addEventListener("mouseenter", function () {
            gsap.to(this, {
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(255, 105, 180, 0.5)",
              duration: 0.3,
            });
          });

          card.addEventListener("mouseleave", function () {
            gsap.to(this, {
              scale: 1,
              boxShadow: "0 10px 25px rgba(255, 105, 180, 0.3)",
              duration: 0.3,
            });
          });
        });

        // Auto scroll to show the gallery
        setTimeout(() => {
          const galleryContainer = document.querySelector(".gallery-container");
          galleryContainer.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 2000);
      });

twemoji.parse(document.body);
