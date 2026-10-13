window.twemoji = window.twemoji || { parse: function () {} };

// Global variables
      let candlesBlown = 0;
      const totalCandles = 35;
      let allCandlesBlown = false;

      // Initialize the page when it loads
      document.addEventListener("DOMContentLoaded", function () {
        createCandles();
        createBalloons();
        createConfetti();
        createDecorations();
        setTimeout(scheduleAmbientFirework, 700);

        const instructionMessage = document.getElementById("instructionMessage");
        instructionMessage.classList.add("show");
        setTimeout(() => instructionMessage.classList.remove("show"), 3000);

        const wishGif = document.getElementById("wishGif");
        const wishGifHelp = document.getElementById("wishGifHelp");
        function showWishGif() {
          wishGif.hidden = false;
          wishGifHelp.hidden = true;
        }
        wishGif.addEventListener("load", showWishGif);
        if (wishGif.complete && wishGif.naturalWidth > 0) showWishGif();

        // Add event listeners for candle interaction
        document.querySelectorAll(".candle").forEach((candle) => {
          candle.addEventListener("click", blowOutCandle);
          candle.addEventListener("touchstart", blowOutCandle); // Better for mobile
          candle.addEventListener("mouseenter", blowOutCandle);
        });

        // For better mobile experience with touch
        document.addEventListener("touchmove", function (e) {
          const touch = e.touches[0];
          const element = document.elementFromPoint(
            touch.clientX,
            touch.clientY
          );
          if (
            element &&
            element.classList.contains("candle") &&
            !element.classList.contains("blown")
          ) {
            blowOutCandle.call(element);
          }
        });

        // Optional: Listen for keyboard input
        document.addEventListener("keypress", function (e) {
          if (e.key === "b" || e.key === "B") {
            // Press 'b' to simulate blowing
            blowRandomCandle();
          }
        });
      });

      // Create candles for the cake
      function createCandles() {
        const candleRows = [
          { id: "bottomCandles", count: 20 },
          { id: "middleCandles", count: 10 },
          { id: "topCandles", count: 5 },
        ];

        candleRows.forEach(({ id, count }) => {
          const candleContainer = document.getElementById(id);
          for (let i = 0; i < count; i++) {
            const candle = document.createElement("div");
            candle.className = "candle";

            const flame = document.createElement("div");
            flame.className = "flame";

            const smoke = document.createElement("div");
            smoke.className = "smoke";

            candle.appendChild(flame);
            candle.appendChild(smoke);
            candleContainer.appendChild(candle);
          }
        });
      }

      // Create floating balloons
      function createBalloons() {
        const recentPositions = [];

        function spawnBalloon() {
          const balloon = document.createElement("div");
          balloon.className = "balloon";
          balloon.textContent = String.fromCodePoint(127880);
          twemoji.parse(balloon);
          const balloonWidth = window.innerWidth <= 600 ? 56 : 64;
          const maxLeft = Math.max(0, window.innerWidth - balloonWidth * 3);
          const minGap = Math.min(110, window.innerWidth * 0.18);
          let left = Math.random() * maxLeft;
          for (let attempt = 0; attempt < 24; attempt++) {
            const candidate = Math.random() * maxLeft;
            if (recentPositions.every((position) => Math.abs(position - candidate) >= minGap)) {
              left = candidate;
              break;
            }
          }
          recentPositions.push(left);
          if (recentPositions.length > 6) recentPositions.shift();
          balloon.style.left = `${left}px`;
          balloon.style.setProperty("--float-duration", `${8 + Math.random() * 4}s`);
          const tierRoll = Math.random();
          const tierScale = tierRoll < 0.5 ? 1.3 : tierRoll < 0.85 ? 1.4 : 1.8;
          const extraLargeScale = Math.random() < 0.3 ? 1.5 : 1;
          balloon.style.setProperty("--balloon-scale", `${1.1 * tierScale * extraLargeScale}`);

          let popped = false;
          function popBalloon() {
            if (popped) return;
            popped = true;
            createBalloonConfetti(balloon);
            balloon.classList.add("popped");
            setTimeout(() => balloon.remove(), 200);
          }

          balloon.addEventListener("click", () => {
            popBalloon();
          });
          balloon.addEventListener("animationend", (event) => {
            if (event.animationName === "floatUp") popBalloon();
          });
          document.body.appendChild(balloon);
        }

        // Stagger the balloons so they rise in a steady stream.
        for (let i = 0; i < 5; i++) setTimeout(spawnBalloon, i * 300);
        setInterval(spawnBalloon, 420);
      }

      function createBalloonConfetti(balloon) {
        const colors = ["#ff3366", "#ffcc00", "#66ccff", "#ff9966", "#99ff66", "#cc99ff"];
        const rect = balloon.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;

        for (let i = 0; i < 38; i++) {
          const piece = document.createElement("div");
          const angle = Math.random() * Math.PI * 2;
          const radius = 70 + Math.random() * 190;
          piece.className = "candle-confetti";
          piece.style.left = `${originX}px`;
          piece.style.top = `${originY}px`;
          piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          piece.style.width = `${6 + Math.random() * 7}px`;
          piece.style.height = `${8 + Math.random() * 10}px`;
          piece.style.setProperty("--burst-x", `${Math.cos(angle) * radius}px`);
          piece.style.setProperty("--burst-y", `${Math.sin(angle) * radius}px`);
          piece.style.setProperty("--burst-spin", `${Math.random() * 720 - 360}deg`);
          document.body.appendChild(piece);
          setTimeout(() => piece.remove(), 950);
        }
      }

      // Create confetti pieces
      function createConfetti() {
        const colors = ["#ffcc00", "#ff66b3", "#66ccff", "#ff9966", "#99ff66"];
        const numConfetti = 220;

        for (let i = 0; i < numConfetti; i++) {
          const confetti = document.createElement("div");
          confetti.className = "confetti";
          confetti.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
          confetti.style.left = `${Math.random() * 100}%`;
          confetti.style.top = "-12px";
          confetti.style.width = `${5 + Math.random() * 5}px`;
          confetti.style.height = `${5 + Math.random() * 10}px`;
          confetti.style.animationDuration = `${3 + Math.random() * 4}s`;
          confetti.style.animationDelay = `${Math.random() * 5}s`;
          document.body.appendChild(confetti);
        }
      }

      // Create cake decorations
      function createDecorations() {
        const cake = document.querySelector(".cake");
        const colors = ["#ff3366", "#ffcc00", "#26bde2", "#ff9966", "#99d84a", "#a986e8"];
        const tiers = cake.querySelectorAll(".cake-tier");
        const numDecorations = 36;

        for (let i = 0; i < numDecorations; i++) {
          const decoration = document.createElement("div");
          decoration.className = "decoration";
          if (Math.random() < 0.45) decoration.classList.add("star");
          decoration.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
          decoration.style.width = `${6 + Math.random() * 7}px`;
          decoration.style.height = decoration.style.width;
          decoration.style.top = `${22 + Math.random() * 65}%`;
          decoration.style.left = `${6 + Math.random() * 88}%`;
          tiers[Math.floor(Math.random() * tiers.length)].appendChild(decoration);
        }
      }

      // Blow out a candle when clicked or hovered
      function blowOutCandle() {
        if (!this.classList.contains("blown")) {
          this.classList.add("blown");
          playSoundEffect("candleBlowSound");
          candlesBlown++;

          // Create sparkle effect
          createSparkleEffect(this);
          createConfettiBurst(this, 52, 300);

          // Check if all candles are blown
          if (candlesBlown === totalCandles && !allCandlesBlown) {
            allCandlesBlown = true;
            playSoundEffect("cheerSound");
            showWishMessage();
            requestAnimationFrame(createCelebrationConfetti);
          }
        }
      }

      // Play each effect on its own audio instance so repeated candle sounds overlap cleanly.
      function playSoundEffect(audioId) {
        const source = document.getElementById(audioId);
        if (!source) return;

        const playback = source.cloneNode();
        playback.volume = Number(source.dataset.volume || 1);
        playback.addEventListener("ended", () => playback.remove(), { once: true });
        playback.addEventListener("error", () => playback.remove(), { once: true });
        document.body.appendChild(playback);
        playback.play().catch(() => playback.remove());
      }

      // Burst colorful confetti from the candle as it goes out.
      function createConfettiBurst(source, pieceCount, spread = 240) {
        const colors = ["#ff3366", "#ffcc00", "#66ccff", "#ff9966", "#99ff66", "#cc99ff"];
        const sourceRect = source.getBoundingClientRect();
        const originX = sourceRect.left + sourceRect.width / 2;
        const originY = sourceRect.top + sourceRect.height * 0.2;

        for (let i = 0; i < pieceCount; i++) {
          const piece = document.createElement("div");
          piece.className = "candle-confetti";
          piece.style.left = `${originX}px`;
          piece.style.top = `${originY}px`;
          piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          piece.style.setProperty("--burst-x", `${Math.random() * spread - spread / 2}px`);
          piece.style.setProperty("--burst-y", `${Math.random() * spread - spread * 0.7}px`);
          piece.style.setProperty("--burst-spin", `${Math.random() * 720 - 360}deg`);
          piece.style.width = `${8 + Math.random() * 7}px`;
          piece.style.height = `${10 + Math.random() * 10}px`;
          piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
          document.body.appendChild(piece);
          setTimeout(() => piece.remove(), 950);
        }
      }

      // Fill the screen with a final shower when the last candle is blown out.
      function createCelebrationConfetti() {
        const colors = ["#ff3366", "#ffcc00", "#66ccff", "#ff9966", "#99ff66", "#cc99ff"];

        for (let i = 0; i < 320; i++) {
          const piece = document.createElement("div");
          piece.className = "celebration-confetti";
          piece.style.left = `${Math.random() * 100}vw`;
          piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          piece.style.width = `${6 + Math.random() * 9}px`;
          piece.style.height = `${8 + Math.random() * 12}px`;
          piece.style.setProperty("--fall-duration", `${2.8 + Math.random() * 2.4}s`);
          piece.style.setProperty("--spin", `${Math.random() * 1080 - 540}deg`);
          piece.style.animationDelay = `${Math.random() * 0.7}s`;
          piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
          document.body.appendChild(piece);
          setTimeout(() => piece.remove(), 6000);
        }
      }

      // Simulate blowing a random candle
      function blowRandomCandle() {
        const unblownCandles = Array.from(
          document.querySelectorAll(".candle:not(.blown)")
        );
        if (unblownCandles.length > 0) {
          const randomCandle =
            unblownCandles[Math.floor(Math.random() * unblownCandles.length)];
          blowOutCandle.call(randomCandle);
        }
      }

      // Create sparkle effect around the blown candle
      function createSparkleEffect(candle) {
        const numSparkles = 18;
        const candleRect = candle.getBoundingClientRect();

        for (let i = 0; i < numSparkles; i++) {
          const sparkle = document.createElement("div");
          sparkle.className = "sparkle";
          sparkle.style.left = `${
            candleRect.left + Math.random() * candleRect.width
          }px`;
          sparkle.style.top = `${
            candleRect.top + Math.random() * (candleRect.height / 2)
          }px`;
          sparkle.style.animation = `sparkle ${
            0.5 + Math.random() * 0.5
          }s forwards`;
          document.body.appendChild(sparkle);

          // Remove sparkle after animation
          setTimeout(() => {
            sparkle.remove();
          }, 1000);
        }
      }

      // Show the wish message when all candles are blown
      function showWishMessage() {
        document.getElementById("wishMessage").classList.add("show");
        const cakeConfettiBurst = document.getElementById("cakeConfettiBurst");
        if (!cakeConfettiBurst.src) cakeConfettiBurst.src = cakeConfettiBurst.dataset.src;
        cakeConfettiBurst.classList.remove("active");
        void cakeConfettiBurst.offsetWidth;
        cakeConfettiBurst.classList.add("active");
        createFireworks();
      }

      // Close the wish message
      function closeWishMessage() {
        document.getElementById("wishMessage").classList.remove("show");
      }

      // Create fireworks effect
      function createFireworks() {
        const numFireworks = 10;
        const colors = ["#ff3366", "#ffcc00", "#66ccff", "#ff9966", "#99ff66"];

        for (let i = 0; i < numFireworks; i++) {
          setTimeout(() => {
            const firework = document.createElement("div");
            firework.className = "firework";
            firework.style.left = `${10 + Math.random() * 80}%`;
            firework.style.top = `${10 + Math.random() * 60}%`;
            firework.style.backgroundColor =
              colors[Math.floor(Math.random() * colors.length)];
            firework.style.animation = `firework ${
              1 + Math.random()
            }s forwards`;
            document.body.appendChild(firework);

            // Remove firework after animation
            setTimeout(() => {
              firework.remove();
            }, 2000);
          }, i * 300);
        }
      }

      function scheduleAmbientFirework() {
        const firework = document.createElement("div");
        const colors = ["#ff3366", "#ffcc00", "#66ccff", "#ff9966", "#cc66ff"];
        firework.className = "firework";
        firework.style.left = `${8 + Math.random() * 84}%`;
        firework.style.top = `${8 + Math.random() * 65}%`;
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        firework.style.animation = `firework ${1.2 + Math.random() * 0.8}s ease-out forwards`;
        document.body.appendChild(firework);
        setTimeout(() => firework.remove(), 2200);
        setTimeout(scheduleAmbientFirework, 900 + Math.random() * 800);
      }

      // Navigation functions
      function goBack() {
        // Replace with actual back URL

        window.location.href = "../../memorylane/code/memorylane.html";
      }

      function goNext() {
        // Replace with actual next URL

        window.location.href = "../../letter/code/letter.html";
      }

twemoji.parse(document.body);
