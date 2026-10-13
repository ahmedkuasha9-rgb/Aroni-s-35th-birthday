window.twemoji = window.twemoji || { parse: function () {} };

document.addEventListener('DOMContentLoaded', function() {
            // Fade in animation
            setTimeout(() => {
                document.querySelector('.container').style.opacity = 1;
            }, 500);

            // Typewriter effect for letter
            // Edit the text between the backticks to personalize your letter.
            // Leave a blank line between paragraphs.
            const letterContent = `My dearest,

As I sit here thinking about all our memories together, my heart just fills with warmth and a smile I can't wipe away. From our late-night talks to our spontaneous adventures, you've completely transformed my world, filling it with so much joy, love, and laughter.

You are my safe haven when things get heavy, my partner in every little adventure, and my absolute biggest supporter. On your special day, I want you to know just how endlessly grateful I am to share my life with you. You make every single day brighter simply by being who you are so brilliantly kind, wonderfully funny, and incredibly thoughtful.

Happy Birthday to the love of my life and my favorite person in the entire world. Here’s to countless more years of us, hand in hand, making beautiful memories together. Tomake valobashiiiiiiiiiiiiii

With all my love, always and forever
Kuasha`;
            
            new Typed('#typed-text', {
                strings: [letterContent],
                typeSpeed: 30,
                showCursor: true,
                cursorChar: '|',
                onComplete: function() {
                    setTimeout(() => {
                        document.querySelector('.surprise-button').classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
                    }, 1000);
                }
            });

            // Create floating elements
            const floatingElements = [];
            for (let i = 0; i < 90; i++) {
                const tierScale = i < 45 ? 1.1 : i < 77 ? 1.15 : 1.3;
                floatingElements.push({
                    type: 'heart',
                    emoji: String.fromCodePoint(0x2764, 0xFE0F),
                    size: `${(26 + Math.random() * 10) * 1.1 * tierScale}px`
                });
            }
            for (let i = 0; i < 20; i++) {
                floatingElements.push({ type: 'teddy', emoji: String.fromCodePoint(0x1F9F8), size: `${13 + Math.random() * 4}px` });
            }
            for (let i = 0; i < 20; i++) {
                floatingElements.push({
                    type: 'star',
                    color: i % 2 ? '#ffecb3' : '#ffd54f',
                    size: `${13 + Math.random() * 4}px`
                });
            }

            const occupiedPositions = [];
            floatingElements.forEach((element) => {
                createFloatingElement(element, occupiedPositions);
            });
            setTimeout(() => {
                confetti({ particleCount: 100, spread: 80, startVelocity: 28, origin: { y: 0.65 } });
            }, 700);

            // Cursor effect
            document.addEventListener('mousemove', createCursorEffect);

            // Surprise button functionality
            const surpriseButton = document.getElementById('surprise-button');
            const modalOverlay = document.getElementById('modal-overlay');
            const modalClose = document.getElementById('modal-close');
            const showFinalGift = document.getElementById('showFinalGift');
            const finalGiftOverlay = document.getElementById('finalGiftOverlay');
            const closeFinalGift = document.getElementById('closeFinalGift');
            const clickSound = document.getElementById('click-sound');

            surpriseButton.addEventListener('click', function() {
                if (window.parent && typeof window.parent.pauseLetterTrackForPlaylist === 'function') {
                    window.parent.pauseLetterTrackForPlaylist();
                }
                clickSound.play();
                modalOverlay.classList.add('active');
                confetti({
                    particleCount: 260,
                    spread: 100,
                    startVelocity: 42,
                    origin: { y: 0.6 }
                });
            });

            modalClose.addEventListener('click', function() {
                modalOverlay.classList.remove('active');
            });

            showFinalGift.addEventListener('click', function() {
                modalOverlay.classList.remove('active');
                finalGiftOverlay.classList.add('active');
                finalGiftOverlay.setAttribute('aria-hidden', 'false');
                closeFinalGift.focus();
            });

            function hideFinalGift() {
                finalGiftOverlay.classList.remove('active');
                finalGiftOverlay.setAttribute('aria-hidden', 'true');
                showFinalGift.focus();
            }
            closeFinalGift.addEventListener('click', hideFinalGift);
            finalGiftOverlay.addEventListener('click', function(event) {
                if (event.target === finalGiftOverlay) hideFinalGift();
            });
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && finalGiftOverlay.classList.contains('active')) {
                    hideFinalGift();
                }
            });

            function syncPlaylistIcons() {
                document.querySelectorAll('.playlist-item-play').forEach((button) => {
                    const trackIndex = Number(button.closest('.playlist-item').dataset.track);
                    const isPlaying = window.parent && typeof window.parent.isPlaylistTrackPlaying === 'function'
                        && window.parent.isPlaylistTrackPlaying(trackIndex);
                    button.querySelector('i').className = isPlaying ? 'fas fa-volume-up' : 'fas fa-play';
                });
            }
            if (window.parent && window.parent.addEventListener) {
                window.parent.addEventListener('site-music-state-change', syncPlaylistIcons);
            }

            document.querySelectorAll('.playlist-item-play').forEach((button) => {
                button.addEventListener('click', function() {
                    const trackIndex = Number(this.closest('.playlist-item').dataset.track);
                    if (window.parent && typeof window.parent.togglePlaylistTrack === 'function') {
                        window.parent.togglePlaylistTrack(trackIndex);
                        syncPlaylistIcons();
                    }
                });
            });

            // Music controls
            const musicToggle = document.getElementById('music-toggle');
            const musicIcon = document.getElementById('music-icon');
            function syncMusicIcon() {
                const playing = window.parent && typeof window.parent.isMusicPlaying === 'function'
                    && window.parent.isMusicPlaying();
                musicIcon.classList.toggle('fa-volume-up', playing);
                musicIcon.classList.toggle('fa-volume-mute', !playing);
            }
            if (window.parent && window.parent.addEventListener) {
                window.parent.addEventListener('site-music-state-change', syncMusicIcon);
            }
            musicToggle.addEventListener('click', function() {
                if (window.parent && typeof window.parent.toggleMusic === 'function') {
                    window.parent.toggleMusic();
                    syncMusicIcon();
                }
            });
            syncMusicIcon();

            // Helper Functions
            function createFloatingElement(element, occupiedPositions) {
                const floatingElement = document.createElement('div');
                floatingElement.classList.add('floating-element', 'heart-pulse');
                
                if (element.emoji) {
                    floatingElement.textContent = element.emoji;
                    twemoji.parse(floatingElement);
                    floatingElement.style.fontSize = element.size;
                } else if (element.type === 'heart') {
                    floatingElement.innerHTML = '<i class="fas fa-heart"></i>';
                    floatingElement.style.color = element.color;
                    floatingElement.style.fontSize = element.size;
                } else if (element.type === 'star') {
                    floatingElement.innerHTML = '<i class="fas fa-star"></i>';
                    floatingElement.style.color = element.color;
                    floatingElement.style.fontSize = element.size;
                }
                
                // Scatter the decorations with a minimum gap so they don't overlap.
                const margin = 24;
                const minGap = Math.max(43, Math.min(52, Math.min(window.innerWidth, window.innerHeight) / 14));
                const maxX = Math.max(margin, window.innerWidth - margin);
                const maxY = Math.max(margin, window.innerHeight - margin);
                let x = margin;
                let y = margin;
                for (let attempt = 0; attempt < 240; attempt++) {
                    const candidateX = margin + Math.random() * Math.max(1, maxX - margin);
                    const candidateY = margin + Math.random() * Math.max(1, maxY - margin);
                    if (occupiedPositions.every((position) => Math.hypot(position.x - candidateX, position.y - candidateY) >= minGap)) {
                        x = candidateX;
                        y = candidateY;
                        break;
                    }
                }
                occupiedPositions.push({ x, y });
                floatingElement.style.left = `${x}px`;
                floatingElement.style.top = `${y}px`;
                
                // Animation duration and delay
                const duration = 5 + Math.random() * 5;
                const delay = Math.random() * 4;
                floatingElement.style.animationDuration = `${duration}s`;
                floatingElement.style.animationDelay = `${delay}s`;
                
                document.body.appendChild(floatingElement);
            }

            function createCursorEffect(e) {
                const cursorEffect = document.createElement('div');
                cursorEffect.classList.add('cursor-effect');
                cursorEffect.style.left = `${e.pageX}px`;
                cursorEffect.style.top = `${e.pageY}px`;
                document.body.appendChild(cursorEffect);
                
                setTimeout(() => {
                    cursorEffect.style.opacity = 1;
                    cursorEffect.style.transform = `translate(-50%, -50%) scale(${Math.random() * 0.5 + 0.5})`;
                    
                    setTimeout(() => {
                        cursorEffect.style.opacity = 0;
                        setTimeout(() => {
                            cursorEffect.remove();
                        }, 500);
                    }, 300);
                }, 10);
            }
        });

twemoji.parse(document.body);
