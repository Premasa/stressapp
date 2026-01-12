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
            birds: 'https://assets.mixkit.co/videos/20656/20656-720.mp4',
            fire: 'https://assets.mixkit.co/videos/17158/17158-720.mp4',
            night: 'https://assets.mixkit.co/videos/4148/4148-720.mp4',
            wind: 'https://assets.mixkit.co/videos/2408/2408-720.mp4',
            stream: 'https://assets.mixkit.co/videos/45368/45368-720.mp4'
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
    }

    createAudioElement(soundType) {
        const audio = new Audio();
        audio.loop = true;
        audio.preload = 'auto';

        // Local audio file paths (prioritize these)
        const localUrls = {
            rain: 'audio/rain.mp3',
            ocean: 'audio/ocean.mp3',
            birds: 'audio/birds.mp3',
            fire: 'audio/fire.mp3',
            night: 'audio/night.mp3',
            wind: 'audio/wind.mp3',
            stream: 'audio/stream.mp3'
        };

        // Online source URLs (fallback)
        const onlineUrls = {
            rain: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3',
            ocean: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
            birds: 'https://www.freesoundslibrary.com/wp-content/uploads/2019/08/relaxing-birds-sounds.mp3',
            fire: 'https://assets.mixkit.co/active_storage/sfx/2391/2391-preview.mp3',
            night: 'https://assets.mixkit.co/active_storage/sfx/2431/2431-preview.mp3',
            wind: 'https://assets.mixkit.co/active_storage/sfx/2392/2392-preview.mp3',
            stream: 'https://assets.mixkit.co/active_storage/sfx/2394/2394-preview.mp3'
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
        const bufferSize = 4096;
        const pinkNoise = audioContext.createScriptProcessor(bufferSize, 1, 1);
        const gainNode = audioContext.createGain();
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        pinkNoise.onaudioprocess = function (e) {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11;
                b6 = white * 0.115926;
            }
        };

        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        pinkNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        return {
            context: audioContext,
            source: pinkNoise,
            gainNode: gainNode,
            filter: filter,
            isFallback: true,
            started: false
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
                if (!sound.audio.started) {
                    sound.audio.source.connect(sound.audio.filter);
                    sound.audio.started = true;
                }
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
            sound.audio.gainNode.gain.value = volume * 0.3;
        } else {
            sound.audio.volume = volume;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ambientSounds = new AmbientSounds();
});
