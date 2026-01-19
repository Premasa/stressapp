// ===== Ambient Sounds Module =====
class AmbientSounds {
    constructor() {
        this.sounds = {};
        this.videoElement = document.getElementById('immersion-video');
        this.immersionContainer = document.querySelector('.immersion-container');

        // Video URL Mappings
        this.videoUrls = {
            rain: 'https://assets.mixkit.co/videos/22729/22729-720.mp4',
            ocean: 'https://assets.mixkit.co/videos/6891/6891-720.mp4',
            forest: 'https://assets.mixkit.co/videos/50635/50635-720.mp4', // Forest path video
            fire: 'https://assets.mixkit.co/videos/17158/17158-720.mp4',
            night: 'https://assets.mixkit.co/videos/4148/4148-720.mp4',
            wind: 'https://assets.mixkit.co/videos/2408/2408-720.mp4',
            space: 'https://assets.mixkit.co/videos/3163/3163-720.mp4', // Night sky with stars
            meditation: 'https://assets.mixkit.co/videos/34565/34565-720.mp4' // Zen meditation stones
        };

        this.init();
    }

    init() {
        const soundCards = document.querySelectorAll('.sound-card');

        soundCards.forEach(card => {
            const soundType = card.dataset.sound;
            const playBtn = card.querySelector('.play-btn');
            const volumeSlider = card.querySelector('.volume-slider');

            // Create audio element for each sound
            this.sounds[soundType] = {
                audio: this.createAudioElement(soundType),
                isPlaying: false,
                button: playBtn,
                slider: volumeSlider
            };

            // Play/Pause button
            playBtn.addEventListener('click', () => {
                this.toggleSound(soundType);
            });

            // Volume control
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(soundType, e.target.value / 100);
            });

            // Set initial volume
            this.setVolume(soundType, 0.5);
        });

        // Ensure clean state on initialization - prevent auto-play
        Object.values(this.sounds).forEach(sound => {
            sound.isPlaying = false;
            if (sound.audio && !sound.audio.paused) {
                sound.audio.pause();
                sound.audio.currentTime = 0;
            }
            sound.button.textContent = 'Play';
            sound.button.classList.remove('playing');
        });
    }

    createAudioElement(soundType) {
        const audio = new Audio();
        audio.loop = true;
        audio.preload = 'none';

        // Local audio file paths (prioritize these)
        const localUrls = {
            rain: 'audio/rain.mp3',
            ocean: 'audio/ocean.mp3',
            forest: 'audio/forest.mp3',
            fire: 'audio/fire.mp3',
            // Renamed to force fallback to online 'Starry Night' sound
            night: 'audio/night.mp3',
            wind: 'audio/wind.mp3',
            space: 'audio/space.mp3',
            meditation: 'audio/meditation.mp3'
        };

        // Online source URLs (fallback)
        const onlineUrls = {
            rain: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
            ocean: 'https://actions.google.com/sounds/v1/nature/ocean_waves_large_sweep_1.ogg',
            forest: 'https://actions.google.com/sounds/v1/birds/forest_birds_ambience.ogg',
            fire: 'https://actions.google.com/sounds/v1/ambiences/fireplace.ogg',
            night: 'https://actions.google.com/sounds/v1/nature/crickets_chirping_at_night.ogg',
            wind: 'https://actions.google.com/sounds/v1/weather/strong_wind.ogg',
            space: 'https://actions.google.com/sounds/v1/ambiences/deep_space.ogg', // (This one might be missing, but fallback covers it)
            meditation: 'https://actions.google.com/sounds/v1/relax/meditation_bell.ogg' // Placeholder
        };

        // Try local file first
        if (localUrls[soundType]) {
            audio.src = localUrls[soundType];

            audio.addEventListener('error', () => {
                console.log(`Local audio file not found for ${soundType}, trying online source...`);
                // Try online source as fallback
                if (onlineUrls[soundType]) {
                    audio.src = onlineUrls[soundType];
                    audio.addEventListener('error', () => {
                        console.log(`Online audio source failed for ${soundType}, using fallback audio generator...`);
                        this.sounds[soundType].audio = this.createFallbackAudio(soundType);
                    }, { once: true });
                } else {
                    console.log(`No online source for ${soundType}, using fallback audio generator...`);
                    this.sounds[soundType].audio = this.createFallbackAudio(soundType);
                }
            }, { once: true });
        } else if (onlineUrls[soundType]) {
            // No local file, try online
            audio.src = onlineUrls[soundType];
            audio.addEventListener('error', () => {
                console.log(`Online audio source failed for ${soundType}, using fallback audio generator...`);
                this.sounds[soundType].audio = this.createFallbackAudio(soundType);
            }, { once: true });
        } else {
            // No sources available, use fallback
            console.log(`No audio sources for ${soundType}, using fallback audio generator...`);
            return this.createFallbackAudio(soundType);
        }

        return audio;
    }

    createFallbackAudio(soundType) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const nodes = []; // Keep track of nodes to disconnect later
        const gainNode = audioContext.createGain();
        let source;

        // Helper to create Noise buffer
        const createNoiseBuffer = () => {
            const bufferSize = 2 * audioContext.sampleRate;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
            return buffer;
        };
        let lastOut = 0;

        switch (soundType) {
            case 'ocean':
                // Pink Noise + Modulated Filter/Gain for waves
                const oceanBufferSize = 10 * audioContext.sampleRate;
                const oceanBuffer = audioContext.createBuffer(1, oceanBufferSize, audioContext.sampleRate);
                const oceanData = oceanBuffer.getChannelData(0);
                for (let i = 0; i < oceanBufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    oceanData[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = oceanData[i];
                    oceanData[i] *= 3.5;
                }

                source = audioContext.createBufferSource();
                source.buffer = oceanBuffer;
                source.loop = true;

                // Lowpass filter to muffle the noise
                const oceanFilter = audioContext.createBiquadFilter();
                oceanFilter.type = 'lowpass';
                oceanFilter.frequency.value = 400;

                // LFO to modulate volume (simulating waves)
                const waveLfo = audioContext.createOscillator();
                waveLfo.type = 'sine';
                waveLfo.frequency.value = 0.1; // 1 wave every 10 seconds

                const lfoGain = audioContext.createGain();
                lfoGain.gain.value = 500; // Modulate volume significantly

                // Connect graph
                // LFO -> Filter Freq (simulate rushing water)
                waveLfo.connect(lfoGain);
                // lfoGain.connect(oceanFilter.frequency); // Optional: modulate cutoff

                // LFO -> Main Gain (Volume Swell)
                const swellGain = audioContext.createGain();
                swellGain.gain.value = 0.3;
                waveLfo.connect(swellGain.gain);

                source.connect(oceanFilter);
                oceanFilter.connect(swellGain);
                swellGain.connect(gainNode);

                nodes.push(source, oceanFilter, waveLfo, lfoGain, swellGain);
                waveLfo.start();
                source.start();
                break;

            case 'meditation':
            case 'space':
                // Drone: 3 Sine oscillators
                const osc1 = audioContext.createOscillator();
                const osc2 = audioContext.createOscillator();
                const osc3 = audioContext.createOscillator();

                osc1.type = 'sine';
                osc2.type = 'sine';
                osc3.type = 'sine';

                // Root, Fifth, Octave (A2 approx 110Hz)
                const root = soundType === 'space' ? 65 : 110; // Lower for space
                osc1.frequency.value = root;
                osc2.frequency.value = root * 1.5; // Fifth
                osc3.frequency.value = root * 2;   // Octave

                const droneGain = audioContext.createGain();
                droneGain.gain.value = 0.15;

                osc1.connect(droneGain);
                osc2.connect(droneGain);
                osc3.connect(droneGain);
                droneGain.connect(gainNode);

                nodes.push(osc1, osc2, osc3, droneGain);
                osc1.start();
                osc2.start();
                osc3.start();

                // Add a slow LFO for "movement"
                const droneLfo = audioContext.createOscillator();
                droneLfo.frequency.value = 0.2;
                const droneLfoGain = audioContext.createGain();
                droneLfoGain.gain.value = 0.05;
                droneLfo.connect(droneLfoGain);
                droneLfoGain.connect(droneGain.gain);
                nodes.push(droneLfo, droneLfoGain);
                droneLfo.start();

                break;

            case 'rain':
            case 'forest':
            case 'wind':
            default:
                // Standard Brown/Pinkish Noise
                const bufferSize = 2 * audioContext.sampleRate;
                const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    output[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = output[i];
                    output[i] *= 3.5;
                }

                source = audioContext.createBufferSource();
                source.buffer = noiseBuffer;
                source.loop = true;

                const filter = audioContext.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = soundType === 'wind' ? 400 : 800; // Lower for wind

                source.connect(filter);
                filter.connect(gainNode);

                nodes.push(source, filter);
                source.start();
                break;
        }

        gainNode.connect(audioContext.destination);

        return {
            context: audioContext,
            source: source, // Main source (might be null if multiple oscillators)
            nodes: nodes,   // ALL nodes to stop later
            gainNode: gainNode,
            isFallback: true,
            started: true,
            type: soundType
        };
    }

    toggleSound(soundType) {
        const sound = this.sounds[soundType];
        if (sound.isPlaying) {
            this.stopSound(soundType);
        } else {
            // Stop other sounds first to keep video focused
            Object.keys(this.sounds).forEach(type => {
                if (type !== soundType && this.sounds[type].isPlaying) {
                    this.stopSound(type);
                }
            });
            this.playSound(soundType);
        }
    }

    playSound(soundType) {
        const sound = this.sounds[soundType];

        try {
            if (sound.audio.isFallback) {
                // For synthesized audio, we rely on context suspension/resumption
                if (sound.audio.context.state === 'suspended') {
                    sound.audio.context.resume();
                }
            } else {
                sound.audio.play().catch(err => console.log('Playback failed:', err));
            }

            sound.isPlaying = true;
            sound.button.textContent = 'Stop';
            sound.button.classList.add('playing');

            // Trigger video immersion
            this.updateVideoImmersion(soundType, true);
        } catch (error) {
            console.log('Audio playback error:', error);
        }
    }

    stopSound(soundType) {
        const sound = this.sounds[soundType];

        try {
            if (sound.audio.isFallback) {
                // For synthesized audio, we rely on context suspension
                if (sound.audio.context.state === 'running') {
                    sound.audio.context.suspend();
                }
            } else {
                sound.audio.pause();
            }

            sound.isPlaying = false;
            sound.button.textContent = 'Play';
            sound.button.classList.remove('playing');

            // Stop video immersion
            this.updateVideoImmersion(soundType, false);
        } catch (error) {
            console.log('Audio stop error:', error);
        }
    }

    updateVideoImmersion(soundType, active) {
        if (active) {
            const videoUrl = this.videoUrls[soundType];
            if (videoUrl) {
                // If it's a new video source, update it
                if (this.videoElement.src !== videoUrl) {
                    this.videoElement.src = videoUrl;
                    this.videoElement.load();
                }
                this.videoElement.play();
                this.immersionContainer.classList.add('active');
                document.querySelector('.app-container').classList.add('immersive');
            }
        } else {
            // Only deactivate if no other sounds are playing
            const anyPlaying = Object.values(this.sounds).some(s => s.isPlaying);
            if (!anyPlaying) {
                this.immersionContainer.classList.remove('active');
                document.querySelector('.app-container').classList.remove('immersive');
                // Optional: stop video after fade
                setTimeout(() => {
                    if (!this.immersionContainer.classList.contains('active')) {
                        this.videoElement.pause();
                    }
                }, 1500);
            }
        }
    }

    setVolume(soundType, volume) {
        const sound = this.sounds[soundType];
        if (sound.audio.isFallback) {
            // Increased gain multiplier for audible fallback noise
            sound.audio.gainNode.gain.value = volume * 2.0;
        } else {
            sound.audio.volume = volume;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ambientSounds = new AmbientSounds();
});
