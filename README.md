# 🎬 Kinetix Labs - Video Editing Application

A modern, feature-rich video editing application built with HTML5, CSS3, and vanilla JavaScript.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Editing Features
- 🎥 **Multi-track Timeline** - Organize video, audio, and image clips
- 🎨 **Effects System** - 20+ built-in effects and color adjustments
- ✨ **Transitions** - 10+ smooth transition animations
- 🎬 **Presets** - Professional color grading presets (Cinematic, Vintage, Dramatic, etc.)
- ⏱️ **Playback Controls** - Play, pause, stop with real-time preview
- 🎵 **Audio Support** - Audio track management with controls
- 📊 **Property Panel** - Real-time property adjustments

### Advanced Features
- ↩️ **Undo/Redo** - Full undo/redo history (up to 50 states)
- 💾 **Project Management** - Create, save, and load projects
- 📤 **Export** - Export projects as JSON files
- 🎛️ **Drag & Drop** - Import media via drag and drop
- ⌨️ **Keyboard Shortcuts** - Comprehensive keyboard control
- 📱 **Responsive Design** - Works on desktop and tablet

### Effects & Transitions
**Effects:** Brightness, Contrast, Saturation, Grayscale, Sepia, Blur, Hue Rotate, Invert, Drop Shadow, Scale, Rotate, Opacity

**Transitions:** Fade, Slide (Left/Right/Up/Down), Zoom In/Out, Rotate In, Flip, Cross Fade

**Presets:** Cinematic, Vintage, Dramatic, Vivid, Cool

## 📁 Project Structure

```
Kinetixlabs/
├── index.html          # Main HTML file with UI structure
├── css/
│   └── style.css      # Advanced styling and animations
├── js/
│   ├── app.js         # Main application logic
│   ├── timeline.js    # Timeline manager
│   ├── effects.js     # Effects and transitions
│   └── utils.js       # Utility functions
└── README.md          # This file
```

## 🚀 Installation

### Quick Start
1. Clone the repository:
```bash
git clone https://github.com/Lisandro4/Kinetixlabs.git
cd Kinetixlabs
```

2. Open `index.html` in a web browser:
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js with http-server
npx http-server
```

3. Visit `http://localhost:8000` in your browser

## 📖 Usage

### Creating a New Project
1. Click **"New Project"** in the sidebar
2. Give your project a name
3. Start adding media files

### Adding Media
- **Drag & Drop**: Drag video, audio, or image files directly into the preview area
- **Import Button**: Click "Import Media" in the sidebar
- Supported formats: MP4, WebM, WAV, MP3, JPG, PNG, GIF

### Editing Timeline
1. **Add Clips**: Import media to automatically add to tracks
2. **Drag Clips**: Move clips along the timeline
3. **Adjust Duration**: Resize clips by dragging edges
4. **Delete Clips**: Select a clip and press Delete or click remove

### Applying Effects
1. Select a clip on the timeline
2. Use the Properties panel on the right
3. Adjust Opacity, Scale, Duration, and Speed in real-time

### Playing Back
- **Play**: Click play button or press Space
- **Pause**: Click pause button or press Space
- **Stop**: Click stop button
- **Seek**: Click on the timeline to jump to a specific time

### Saving Your Work
- **Save Project**: Ctrl+S (or Cmd+S on Mac)
- **Export Project**: Ctrl+E to export as JSON
- Projects auto-save to browser localStorage

## 🏗️ Architecture

### Application Structure
```javascript
// Global instances
window.app                 // Main KinetixApp instance
window.effectsManager      // EffectsManager instance
window.Kinetix            // Utility namespace
```

### Core Classes

#### KinetixApp
Main application controller handling projects, timeline, and state management.

```javascript
// Create project
app.newProject('My Video');

// Add media
app.addVideoClip(file);
app.addAudioClip(file);

// Playback
app.togglePlayPause();
app.stop();

// History
app.undo();
app.redo();

// Export
app.exportProject();
```

#### TimelineManager
Manages timeline tracks and clips.

```javascript
// Add track
const track = timeline.addTrack('video');

// Add clip
const clip = timeline.addClip(trackId, {
    name: 'Clip 1',
    duration: 5
});

// Playback
timeline.play();
timeline.pause();
timeline.seek(2.5);

// Export
const data = timeline.export();
timeline.import(data);
```

#### EffectsManager
Manages effects, transitions, and presets.

```javascript
// Apply effect
effectsManager.applyEffect(element, 'brightness', 120);

// Apply multiple effects
effectsManager.applyEffects(element, [
    { type: 'contrast', value: 110 },
    { type: 'saturation', value: 80 }
]);

// Apply transition
effectsManager.applyTransition(element, 'slideLeft', 1);

// Apply preset
effectsManager.applyPreset(element, 'cinematic');
```

### Utility Namespace (window.Kinetix)

#### Time Utilities
```javascript
Kinetix.Time.formatTime(125);           // "00:02:05"
Kinetix.Time.parseTime('00:02:05');     // 125
```

#### File Utilities
```javascript
Kinetix.File.isVideoFile(file);
Kinetix.File.isAudioFile(file);
Kinetix.File.isImageFile(file);
Kinetix.File.formatFileSize(1024000);   // "1000 KB"
```

#### DOM Utilities
```javascript
Kinetix.DOM.createElement('div', { class: 'my-class' }, 'Content');
Kinetix.DOM.empty(element);
Kinetix.DOM.on('.selector', 'click', callback);
```

#### Animation Utilities
```javascript
Kinetix.Animation.animate(0, 100, 1000, (value) => {
    console.log(value);
}, () => {
    console.log('Animation complete');
});
```

#### Storage Utilities
```javascript
Kinetix.Storage.save('key', data);
Kinetix.Storage.load('key', defaultValue);
Kinetix.Storage.remove('key');
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause |
| `Ctrl+S` / `Cmd+S` | Save Project |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl+E` / `Cmd+E` | Export Project |
| `Delete` | Delete Selected |

## 🔌 API Reference

### App Events
```javascript
app.addEventListener('projectCreated', (e) => {
    console.log('Project:', e.detail.project);
});

app.addEventListener('mediaAdded', (e) => {
    console.log('Media:', e.detail.media);
});

app.addEventListener('timelineUpdated', (e) => {
    console.log('Duration:', e.detail.duration);
});
```

### Timeline Events
```javascript
timeline.addEventListener('clipAdded', (e) => {
    console.log('Clip:', e.detail.clip);
});

timeline.addEventListener('timeUpdate', (e) => {
    console.log('Current time:', e.detail.currentTime);
});
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write clear, documented code
- Test your changes in multiple browsers
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Bug Reports & Feature Requests

Found a bug? Have a feature idea? Please open an issue on GitHub:
- [Bug Reports](https://github.com/Lisandro4/Kinetixlabs/issues)
- [Feature Requests](https://github.com/Lisandro4/Kinetixlabs/discussions)

## 📞 Support

For questions and support:
- 📧 Email: lisandrolunez@gmail.com
- 💬 GitHub Discussions: [Join the community](https://github.com/Lisandro4/Kinetixlabs/discussions)
- 📚 Documentation: [Full Docs](https://github.com/Lisandro4/Kinetixlabs/wiki)

## 🙌 Acknowledgments

Built with love using:
- HTML5 Canvas API
- Web Audio API
- CSS Grid & Flexbox
- Vanilla JavaScript (ES6+)

---

**Made with ❤️ by Lisandro4**
