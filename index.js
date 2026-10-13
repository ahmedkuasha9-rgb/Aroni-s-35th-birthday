window.twemoji = window.twemoji || { parse: function () {} };

const siteMusic = document.getElementById("siteMusic");
    const musicToggle = document.getElementById("musicToggle");
    const musicVolume = document.getElementById("musicVolume");
    musicToggle.textContent = "\u25B6\uFE0F";
    const playlistTracks = [
      "letter/assets/audio/music%20player%20songs/song%201.mp3",
      "letter/assets/audio/music%20player%20songs/song%202.mp3",
      "letter/assets/audio/music%20player%20songs/song%203.mp3",
      "letter/assets/audio/music%20player%20songs/song%204.mp3",
      "letter/assets/audio/music%20player%20songs/song%205.mp3"
    ];
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const trackGain = audioContext.createGain();
    const volumeGain = audioContext.createGain();
    const peakLimiter = audioContext.createDynamicsCompressor();
    const mediaSource = audioContext.createMediaElementSource(siteMusic);
    const normalizedGains = new Map();
    let activeTrackPath = "welcome/assets/audio/main%20song.mp3";
    let currentPlaylistTrack = -1;
    let currentPageTrack = "main";
    let musicHasStarted = false;
    siteMusic.volume = 1;
    volumeGain.gain.value = 0.5;
    musicVolume.addEventListener("input", () => { volumeGain.gain.value = Number(musicVolume.value); });
    peakLimiter.threshold.value = -2;
    peakLimiter.knee.value = 0;
    peakLimiter.ratio.value = 20;
    peakLimiter.attack.value = 0.003;
    peakLimiter.release.value = 0.12;
    mediaSource.connect(trackGain);
    trackGain.connect(volumeGain);
    volumeGain.connect(peakLimiter);
    peakLimiter.connect(audioContext.destination);

    function applyTrackGain() {
      const gain = normalizedGains.get(activeTrackPath) ?? 1;
      trackGain.gain.setTargetAtTime(gain, audioContext.currentTime, 0.12);
    }

    async function normalizeTrackLevels() {
      const tracks = [
        "welcome/assets/audio/main%20song.mp3",
        "cake/assets/audio/background%20song/cake%20page%20song.mp3",
        "letter/assets/audio/background%20song/letter%20page%20song.mp3",
        ...playlistTracks
      ];
      for (const trackPath of tracks) {
        try {
          const response = await fetch(trackPath);
          if (!response.ok) continue;
          const buffer = await audioContext.decodeAudioData(await response.arrayBuffer());
          let sumSquares = 0;
          let sampleCount = 0;
          const sampleLimit = audioContext.sampleRate * 30;
          for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const samples = buffer.getChannelData(channel);
            const limit = Math.min(samples.length, sampleLimit);
            const stride = Math.max(1, Math.floor(limit / 50000));
            for (let i = 0; i < limit; i += stride) {
              sumSquares += samples[i] * samples[i];
              sampleCount++;
            }
          }
          const rms = Math.sqrt(sumSquares / Math.max(1, sampleCount));
          const gain = Math.min(2.5, Math.max(0.4, 0.12 / Math.max(rms, 0.0001)));
          normalizedGains.set(trackPath, gain);
          if (trackPath === activeTrackPath) applyTrackGain();
        } catch (error) {
          console.log(`Could not normalize ${trackPath}:`, error);
        }
      }
    }
    normalizeTrackLevels();

    window.playPlaylistTrack = function (index) {
      if (index < 0 || index >= playlistTracks.length) return;
      currentPlaylistTrack = index;
      activeTrackPath = playlistTracks[index];
      applyTrackGain();
      siteMusic.src = playlistTracks[index];
      siteMusic.loop = false;
      siteMusic.load();
      window.startMusic();
    };

    window.togglePlaylistTrack = function (index) {
      if (index === currentPlaylistTrack) {
        if (siteMusic.paused) window.startMusic();
        else siteMusic.pause();
        return;
      }
      window.playPlaylistTrack(index);
    };

    window.isPlaylistTrackPlaying = function (index) {
      return index === currentPlaylistTrack && !siteMusic.paused;
    };

    window.playPageTrack = function (trackName, trackPath) {
      if (currentPlaylistTrack >= 0) return;
      currentPageTrack = trackName;
      activeTrackPath = trackPath;
      applyTrackGain();
      siteMusic.src = trackPath;
      siteMusic.loop = true;
      siteMusic.load();
      window.startMusic();
    };

    window.pauseLetterTrackForPlaylist = function () {
      if (currentPageTrack === "letter" && currentPlaylistTrack < 0) siteMusic.pause();
    };

    window.isMusicPlaying = function () {
      return !siteMusic.paused;
    };

    const pageContent = document.getElementById("page-content");
    pageContent.addEventListener("load", () => {
      const pageName = pageContent.contentWindow.location.pathname.split("/").pop().toLowerCase();
      if (!musicHasStarted) return;

      currentPlaylistTrack = -1;
      if (pageName === "cake.html") {
        window.playPageTrack("cake", "cake/assets/audio/background%20song/cake%20page%20song.mp3");
      } else if (pageName === "letter.html") {
        window.playPageTrack("letter", "letter/assets/audio/background%20song/letter%20page%20song.mp3");
      } else if (pageName === "memorylane.html" || pageName === "welcome.html") {
        if (activeTrackPath !== "welcome/assets/audio/main%20song.mp3") {
          window.playPageTrack("main", "welcome/assets/audio/main%20song.mp3");
        } else {
          currentPageTrack = "main";
        }
      }
    });

    siteMusic.addEventListener("ended", () => {
      if (currentPlaylistTrack >= 0) {
        window.playPlaylistTrack((currentPlaylistTrack + 1) % playlistTracks.length);
      }
    });
    siteMusic.addEventListener("play", () => window.dispatchEvent(new Event("site-music-state-change")));
    siteMusic.addEventListener("pause", () => window.dispatchEvent(new Event("site-music-state-change")));

    window.startMusic = function () {
      musicHasStarted = true;
      audioContext.resume().then(() => siteMusic.play()).then(() => {
        musicToggle.textContent = '\u23F8\uFE0F';
        musicToggle.setAttribute("aria-label", "Pause music");
        twemoji.parse(musicToggle);
      }).catch((error) => console.log("Music playback was blocked:", error));
    };

    musicToggle.addEventListener("click", () => {
      if (siteMusic.paused) {
        window.startMusic();
      } else {
        siteMusic.pause();
        musicToggle.textContent = '\u25B6\uFE0F';
        musicToggle.setAttribute("aria-label", "Play music");
        twemoji.parse(musicToggle);
      }
    });
    window.toggleMusic = function () {
      if (siteMusic.paused) window.startMusic();
      else siteMusic.pause();
    };

twemoji.parse(document.body);
