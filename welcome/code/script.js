window.twemoji = window.twemoji || { parse: function () {} };

// Music is managed by the persistent player in index.html.
        // Function to go to next page
        document.querySelector('.next-button').textContent = 'Start Your Birthday Song';

        const wishGif = document.querySelector('.wish-gif');
        const wishCopy = document.querySelector('.wish-copy');
        const ageGif = document.querySelector('.age-gif');
        const nextButton = document.querySelector('.next-button');
        const wishText = Array.from(wishCopy.textContent.trim());
        wishCopy.setAttribute('aria-label', wishText.join(''));
        wishCopy.textContent = '';

        wishGif.addEventListener('animationend', () => {
            wishCopy.classList.add('typing');
            let characterIndex = 0;

            function typeNextCharacter() {
                if (characterIndex < wishText.length) {
                    wishCopy.textContent += wishText[characterIndex++];
                    window.setTimeout(typeNextCharacter, 28);
                    return;
                }

                wishCopy.classList.remove('typing');
                wishCopy.classList.add('typed');
                ageGif.classList.add('show');
                ageGif.addEventListener('animationend', () => {
                    nextButton.classList.add('visible');
                }, { once: true });
            }

            typeNextCharacter();
        }, { once: true });

        function goToNextPage() {
            const button = document.querySelector('.next-button');
            if (button.dataset.stage !== 'ready') {
                if (window.parent !== window && window.parent.startMusic) {
                    window.parent.startMusic();
                }
                button.disabled = true;
                button.classList.add('changing');
                setTimeout(() => {
                    button.textContent = "Let's Go!";
                    button.dataset.stage = 'ready';
                    button.classList.remove('changing');
                    button.disabled = false;
                }, 250);
                return;
            }

            gsap.to('.next-button', {
                scale: 1.2,
                yoyo: true,
                repeat: 1,
                duration: 0.3,
                onComplete: () => { window.location.href = '../../memorylane/code/memorylane.html'; }
            });
        }

        const fireworksCanvas = document.createElement('canvas');
        fireworksCanvas.className = 'fireworks-canvas';
        document.body.appendChild(fireworksCanvas);
        const fireworksContext = fireworksCanvas.getContext('2d');
        const fireworkParticles = [];
        let fireworksWidth = window.innerWidth;
        let fireworksHeight = window.innerHeight;
        let fireworksPixelRatio = 1;
        let previousFrameTime = 0;

        function resizeFireworksCanvas() {
            fireworksPixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
            fireworksWidth = window.innerWidth;
            fireworksHeight = window.innerHeight;
            fireworksCanvas.width = Math.round(fireworksWidth * fireworksPixelRatio);
            fireworksCanvas.height = Math.round(fireworksHeight * fireworksPixelRatio);
            fireworksContext.setTransform(fireworksPixelRatio, 0, 0, fireworksPixelRatio, 0, 0);
        }
        window.addEventListener('resize', resizeFireworksCanvas);
        resizeFireworksCanvas();

        function createFireworkBurst(centerX, centerY) {
            const colors = ['#FF1493', '#8A2BE2', '#FFD700', '#FF4500', '#00BFFF', '#32CD32'];
            for (let i = 0; i < 44; i++) {
                const angle = (Math.PI * 2 * i / 44) + Math.random() * 0.12;
                const speed = 75 + Math.random() * 135;
                const lifetime = 0.9 + Math.random() * 0.35;
                fireworkParticles.push({
                    x: centerX,
                    y: centerY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    age: 0,
                    lifetime,
                    size: 1.8 + Math.random() * 2,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        }

        function animateFireworks(timestamp) {
            const deltaTime = previousFrameTime ? Math.min((timestamp - previousFrameTime) / 1000, 0.04) : 0;
            previousFrameTime = timestamp;
            fireworksContext.clearRect(0, 0, fireworksWidth, fireworksHeight);

            for (let i = fireworkParticles.length - 1; i >= 0; i--) {
                const particle = fireworkParticles[i];
                particle.age += deltaTime;
                if (particle.age >= particle.lifetime) {
                    fireworkParticles.splice(i, 1);
                    continue;
                }
                particle.x += particle.vx * deltaTime;
                particle.y += particle.vy * deltaTime;
                particle.vy += 95 * deltaTime;
                fireworksContext.globalAlpha = 1 - particle.age / particle.lifetime;
                fireworksContext.fillStyle = particle.color;
                fireworksContext.beginPath();
                fireworksContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                fireworksContext.fill();
            }
            fireworksContext.globalAlpha = 1;
            requestAnimationFrame(animateFireworks);
        }
        requestAnimationFrame(animateFireworks);

        function scheduleFirework() {
            const columns = 5;
            const rows = 2;
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    const xPosition = (column + 0.5 + (Math.random() - 0.5) * 0.5) / columns;
                    const yPosition = (row + 0.5 + (Math.random() - 0.5) * 0.3) / rows;
                    createFireworkBurst(
                        fireworksWidth * xPosition,
                        fireworksHeight * yPosition
                    );
                }
            }
            setTimeout(scheduleFirework, 1400 + Math.random() * 700);
        }
        window.addEventListener('load', () => setTimeout(scheduleFirework, 400));
        // Create confetti, balloons, hearts, and stars
        function createFloatingElements() {
            const colors = ['#FF1493', '#8A2BE2', '#FFD700', '#FF4500', '#00BFFF', '#32CD32'];
            const elements = ['confetti', 'balloon', 'heart', 'star'];
            const confettiShapes = ['▲', '■', '●', '★', '♥', '♦', '✦', '✧'];
            
                    for (let i = 0; i < 200; i++) {
                setTimeout(() => {
                    const element = document.createElement('div');
                    
                    // Randomly pick an element type
                    const elementType = elements[Math.floor(Math.random() * elements.length)];
                    element.className = elementType;
                    
                    // Set random position
                    element.style.left = Math.random() * 100 + 'vw';
                    element.style.top = -30 + 'px';
                    
                    // Set random color
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    
                    // Different styling based on element type
                    if (elementType === 'confetti') {
                        const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
                        element.innerHTML = shape;
                        element.style.color = color;
                        element.style.fontSize = (Math.random() * 24 + 16) + 'px';
                        element.style.transform = `rotate(${Math.random() * 360}deg)`;
                    } else if (elementType === 'balloon') {
                        element.innerHTML = '🎈';
                        element.style.fontSize = (Math.random() * 36 + 32) + 'px';
                    } else if (elementType === 'heart') {
                        element.innerHTML = '❤️';
                        element.style.fontSize = (Math.random() * 20 + 20) + 'px';
                    } else if (elementType === 'star') {
                        element.innerHTML = '✨';
                        element.style.fontSize = (Math.random() * 14 + 18) + 'px';
                    }

                    twemoji.parse(element);
                    
                    // Add to body
                    document.body.appendChild(element);
                    
                    // Animate with GSAP
                    gsap.to(element, {
                        y: window.innerHeight + 100,
                        x: '+=' + (Math.random() * 200 - 100),
                        rotation: Math.random() * 360,
                        duration: Math.random() * 10 + 5,
                        ease: "power1.out",
                        onComplete: () => {
                            document.body.removeChild(element);
                        }
                    });
                    
                }, i * 20); // Staggered start times
            }
        }

        // Start floating elements on load
        window.addEventListener('load', createFloatingElements);
        
        // Create new elements periodically
        setInterval(createFloatingElements, 5000);
        
        // Add a subtle sparkle effect to the heading
        gsap.to('h1', {
            textShadow: "0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 20, 147, 0.6)",
            repeat: -1,
            yoyo: true,
            duration: 2
        });
        
        // Responsive adjustments
        function handleResize() {
            // Add responsive adjustments if needed
        }
        
        window.addEventListener('resize', handleResize);
        handleResize();

twemoji.parse(document.body);
