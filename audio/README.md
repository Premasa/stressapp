# Audio Files for Stress Relief App

This folder should contain ambient sound files for the app.

## Required Files:

1. **rain.mp3** - Rain/rainfall sound (loopable)
2. **ocean.mp3** - Ocean waves sound (loopable)
3. **forest.mp3** - Forest ambience with birds (loopable)
4. **fire.mp3** - Fireplace crackling sound (loopable)

## Where to Get Free Ambient Sounds:

### Recommended Free Sources:
1. **Pixabay** (https://pixabay.com/sound-effects/search/ambient/)
   - Free for commercial use
   - No attribution required
   - High quality MP3 files

2. **Freesound** (https://freesound.org/)
   - Free sound library
   - Various licenses (check each file)
   - Search for: "rain loop", "ocean waves", "forest ambience", "fireplace"

3. **YouTube Audio Library** (https://www.youtube.com/audiolibrary)
   - Free music and sound effects
   - Download as MP3

4. **ZapSplat** (https://www.zapsplat.com/)
   - Free sound effects
   - Requires free account

## How to Add Files:

1. Download the ambient sound files from one of the sources above
2. Rename them to match the required names (rain.mp3, ocean.mp3, forest.mp3, fire.mp3)
3. Place them in this `audio` folder
4. The app will automatically use these files

## File Specifications:

- **Format**: MP3 (recommended) or WAV
- **Duration**: At least 30 seconds (longer is better for seamless looping)
- **Quality**: 128kbps or higher
- **Sample Rate**: 44.1kHz recommended

## Fallback:

If audio files are not found, the app will use a fallback pink noise generator that simulates ambient sounds using Web Audio API.
