/**
 * KINETIX LABS - UTILITY FUNCTIONS
 * Common helper functions and utilities
 */

// Time formatting utilities
const TimeUtils = {
    /**
     * Format seconds to HH:MM:SS
     */
    formatTime(seconds) {
        if (!Number.isFinite(seconds)) return '00:00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    },
    
    /**
     * Convert HH:MM:SS to seconds
     */
    parseTime(timeString) {
        const parts = timeString.split(':');
        if (parts.length === 3) {
            return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        }
        return 0;
    },
    
    /**
     * Get duration string
     */
    getDurationString(duration) {
        return this.formatTime(duration);
    }
};

// File utilities
const FileUtils = {
    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },
    
    /**
     * Check if file is video
     */
    isVideoFile(file) {
        return file.type.startsWith('video/');
    },
    
    /**
     * Check if file is audio
     */
    isAudioFile(file) {
        return file.type.startsWith('audio/');
    },
    
    /**
     * Check if file is image
     */
    isImageFile(file) {
        return file.type.startsWith('image/');
    },
    
    /**
     * Get file extension
     */
    getExtension(filename) {
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
};

// Color utilities
const ColorUtils = {
    /**
     * Convert hex to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    /**
     * Convert RGB to hex
     */
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },
    
    /**
     * Get complementary color
     */
    getComplementary(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;
        return this.rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
    }
};

// Array utilities
const ArrayUtils = {
    /**
     * Shuffle array
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    /**
     * Remove duplicates
     */
    unique(array) {
        return [...new Set(array)];
    },
    
    /**
     * Find differences between arrays
     */
    difference(arr1, arr2) {
        return arr1.filter(item => !arr2.includes(item));
    },
    
    /**
     * Group array by key
     */
    groupBy(array, key) {
        return array.reduce((result, item) => {
            const group = item[key];
            if (!result[group]) result[group] = [];
            result[group].push(item);
            return result;
        }, {});
    }
};

// DOM utilities
const DOMUtils = {
    /**
     * Create element with attributes
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                element.className = value;
            } else if (key === 'style') {
                Object.entries(value).forEach(([styleProp, styleValue]) => {
                    element.style[styleProp] = styleValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },
    
    /**
     * Add event listeners to multiple elements
     */
    on(selector, event, callback) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener(event, callback);
        });
    },
    
    /**
     * Remove all children
     */
    empty(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    
    /**
     * Check if element is visible
     */
    isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }
};

// Math utilities
const MathUtils = {
    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    /**
     * Linear interpolation
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },
    
    /**
     * Ease in quad
     */
    easeInQuad(t) {
        return t * t;
    },
    
    /**
     * Ease out quad
     */
    easeOutQuad(t) {
        return t * (2 - t);
    },
    
    /**
     * Ease in out quad
     */
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    
    /**
     * Random range
     */
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
};

// Storage utilities
const StorageUtils = {
    /**
     * Save data to localStorage
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save data:', error);
            return false;
        }
    },
    
    /**
     * Load data from localStorage
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Failed to load data:', error);
            return defaultValue;
        }
    },
    
    /**
     * Remove data from localStorage
     */
    remove(key) {
        localStorage.removeItem(key);
    },
    
    /**
     * Clear all localStorage
     */
    clear() {
        localStorage.clear();
    }
};

// Animation utilities
const AnimationUtils = {
    /**
     * Animate value over time
     */
    animate(from, to, duration, onUpdate, onComplete) {
        const startTime = Date.now();
        
        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = from + (to - from) * progress;
            onUpdate(value);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else if (onComplete) {
                onComplete();
            }
        };
        
        requestAnimationFrame(update);
    },
    
    /**
     * Create keyframe animation
     */
    createKeyframeAnimation(name, frames) {
        const keyframes = frames.map((frame, index) => {
            const percent = (index / (frames.length - 1)) * 100;
            const styles = Object.entries(frame)
                .map(([key, value]) => `${key}: ${value}`)
                .join('; ');
            return `${percent}% { ${styles} }`;
        }).join('\n');
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ${name} {
                ${keyframes}
            }
        `;
        document.head.appendChild(style);
        
        return name;
    }
};

// Validation utilities
const ValidationUtils = {
    /**
     * Validate email
     */
    isEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Validate URL
     */
    isURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    /**
     * Validate hex color
     */
    isHexColor(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }
};

// Console utilities
const ConsoleUtils = {
    /**
     * Log with prefix
     */
    log(message, prefix = '🎬') {
        console.log(`${prefix} ${message}`);
    },
    
    /**
     * Log info
     */
    info(message) {
        this.log(message, 'ℹ️');
    },
    
    /**
     * Log success
     */
    success(message) {
        this.log(message, '✅');
    },
    
    /**
     * Log warning
     */
    warn(message) {
        this.log(message, '⚠️');
    },
    
    /**
     * Log error
     */
    error(message) {
        this.log(message, '❌');
    },
    
    /**
     * Log group
     */
    group(label, callback) {
        console.group(label);
        callback();
        console.groupEnd();
    }
};

// Export all utilities
window.Kinetix = {
    Time: TimeUtils,
    File: FileUtils,
    Color: ColorUtils,
    Array: ArrayUtils,
    DOM: DOMUtils,
    Math: MathUtils,
    Storage: StorageUtils,
    Animation: AnimationUtils,
    Validation: ValidationUtils,
    Console: ConsoleUtils
};
