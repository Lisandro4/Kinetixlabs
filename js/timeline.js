/**
 * KINETIX LABS - TIMELINE MANAGER
 * Manages tracks, clips, and playback control
 */

class TimelineManager extends EventTarget {
    constructor() {
        super();
        this.tracks = [];
        this.clips = [];
        this.currentTime = 0;
        this.duration = 0;
        this.isPlaying = false;
        this.playbackRate = 1;
        this.trackIdCounter = 0;
        this.clipIdCounter = 0;
    }
    
    /**
     * Add a new track
     */
    addTrack(type = 'video', name = null) {
        const track = {
            id: `track-${this.trackIdCounter++}`,
            type: type,
            name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Track`,
            clips: [],
            muted: false,
            volume: 100,
            visible: true
        };
        
        this.tracks.push(track);
        this.dispatchEvent(new CustomEvent('trackAdded', { detail: { track } }));
        
        return track;
    }
    
    /**
     * Remove track
     */
    removeTrack(trackId) {
        const index = this.tracks.findIndex(t => t.id === trackId);
        if (index === -1) return false;
        
        const track = this.tracks[index];
        
        // Remove all clips in track
        track.clips.forEach(clipId => {
            this.removeClip(clipId);
        });
        
        this.tracks.splice(index, 1);
        this.dispatchEvent(new CustomEvent('trackRemoved', { detail: { track } }));
        
        return true;
    }
    
    /**
     * Add clip to track
     */
    addClip(trackId, clipData) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return null;
        
        const clip = {
            id: `clip-${this.clipIdCounter++}`,
            trackId: trackId,
            name: clipData.name || 'Clip',
            startTime: clipData.startTime || 0,
            duration: clipData.duration || 5,
            endTime: (clipData.startTime || 0) + (clipData.duration || 5),
            effects: [],
            transitions: [],
            properties: {
                opacity: 100,
                scale: 100,
                rotation: 0,
                speed: 1
            }
        };
        
        this.clips.push(clip);
        track.clips.push(clip.id);
        
        // Update timeline duration
        this.updateDuration();
        
        this.dispatchEvent(new CustomEvent('clipAdded', { detail: { clip } }));
        
        return clip;
    }
    
    /**
     * Remove clip
     */
    removeClip(clipId) {
        const clipIndex = this.clips.findIndex(c => c.id === clipId);
        if (clipIndex === -1) return false;
        
        const clip = this.clips[clipIndex];
        const track = this.tracks.find(t => t.id === clip.trackId);
        
        if (track) {
            const idx = track.clips.indexOf(clipId);
            if (idx !== -1) {
                track.clips.splice(idx, 1);
            }
        }
        
        this.clips.splice(clipIndex, 1);
        this.updateDuration();
        
        this.dispatchEvent(new CustomEvent('clipRemoved', { detail: { clip } }));
        
        return true;
    }
    
    /**
     * Update clip properties
     */
    updateClip(clipId, updates) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip) return false;
        
        Object.assign(clip, updates);
        
        if (updates.duration) {
            clip.endTime = clip.startTime + updates.duration;
            this.updateDuration();
        }
        
        this.dispatchEvent(new CustomEvent('clipUpdated', { detail: { clip } }));
        
        return true;
    }
    
    /**
     * Apply effect to clip
     */
    applyEffect(clipId, effectType, value) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip) return false;
        
        const effect = clip.effects.find(e => e.type === effectType);
        
        if (effect) {
            effect.value = value;
        } else {
            clip.effects.push({ type: effectType, value: value });
        }
        
        return true;
    }
    
    /**
     * Apply transition to clip
     */
    applyTransition(clipId, transitionType, duration = 1) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip) return false;
        
        clip.transitions.push({
            type: transitionType,
            duration: duration
        });
        
        return true;
    }
    
    /**
     * Play timeline
     */
    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        const startTime = performance.now();
        const initialTime = this.currentTime;
        
        const animate = (currentTime) => {
            if (!this.isPlaying) return;
            
            const elapsed = (currentTime - startTime) / 1000;
            this.currentTime = initialTime + elapsed * this.playbackRate;
            
            if (this.currentTime >= this.duration) {
                this.currentTime = this.duration;
                this.stop();
                this.dispatchEvent(new CustomEvent('timelineComplete'));
            } else {
                this.dispatchEvent(new CustomEvent('timeUpdate', {
                    detail: { currentTime: this.currentTime }
                }));
                requestAnimationFrame(animate);
            }
        };
        
        this.dispatchEvent(new CustomEvent('play'));
        requestAnimationFrame(animate);
    }
    
    /**
     * Pause playback
     */
    pause() {
        this.isPlaying = false;
        this.dispatchEvent(new CustomEvent('pause', {
            detail: { currentTime: this.currentTime }
        }));
    }
    
    /**
     * Stop playback and reset
     */
    stop() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.dispatchEvent(new CustomEvent('stop'));
    }
    
    /**
     * Seek to time
     */
    seek(time) {
        this.currentTime = Kinetix.Math.clamp(time, 0, this.duration);
        this.dispatchEvent(new CustomEvent('seek', {
            detail: { currentTime: this.currentTime }
        }));
    }
    
    /**
     * Update timeline duration
     */
    updateDuration() {
        this.duration = 0;
        
        this.clips.forEach(clip => {
            if (clip.endTime > this.duration) {
                this.duration = clip.endTime;
            }
        });
        
        this.dispatchEvent(new CustomEvent('durationUpdate', {
            detail: { duration: this.duration }
        }));
    }
    
    /**
     * Get timeline info
     */
    getInfo() {
        return {
            trackCount: this.tracks.length,
            clipCount: this.clips.length,
            duration: this.duration,
            currentTime: this.currentTime,
            isPlaying: this.isPlaying,
            playbackRate: this.playbackRate
        };
    }
    
    /**
     * Clear timeline
     */
    clear() {
        this.stop();
        this.tracks = [];
        this.clips = [];
        this.currentTime = 0;
        this.duration = 0;
        this.trackIdCounter = 0;
        this.clipIdCounter = 0;
    }
    
    /**
     * Export timeline data
     */
    export() {
        return {
            tracks: JSON.parse(JSON.stringify(this.tracks)),
            clips: JSON.parse(JSON.stringify(this.clips)),
            duration: this.duration
        };
    }
    
    /**
     * Import timeline data
     */
    import(data) {
        if (!data) return false;
        
        this.clear();
        
        this.tracks = data.tracks || [];
        this.clips = data.clips || [];
        this.duration = data.duration || 0;
        
        // Update counters
        if (this.tracks.length > 0) {
            this.trackIdCounter = Math.max(...this.tracks.map(t => 
                parseInt(t.id.split('-')[1]) || 0
            )) + 1;
        }
        
        if (this.clips.length > 0) {
            this.clipIdCounter = Math.max(...this.clips.map(c => 
                parseInt(c.id.split('-')[1]) || 0
            )) + 1;
        }
        
        this.dispatchEvent(new CustomEvent('import', { detail: { data } }));
        
        return true;
    }
}

// Initialize timeline
document.addEventListener('DOMContentLoaded', () => {
    window.timeline = new TimelineManager();
    Kinetix.Console.success('Timeline manager initialized');
});
