/**
 * KINETIX LABS - EFFECTS & TRANSITIONS MANAGER
 * Handles effects, transitions, and color presets
 */

class EffectsManager {
    constructor() {
        this.effects = this.initializeEffects();
        this.transitions = this.initializeTransitions();
        this.presets = this.initializePresets();
    }
    
    /**
     * Initialize available effects
     */
    initializeEffects() {
        return {
            brightness: { min: 0, max: 200, default: 100, unit: '%' },
            contrast: { min: 0, max: 200, default: 100, unit: '%' },
            saturation: { min: 0, max: 200, default: 100, unit: '%' },
            grayscale: { min: 0, max: 100, default: 0, unit: '%' },
            sepia: { min: 0, max: 100, default: 0, unit: '%' },
            hueRotate: { min: 0, max: 360, default: 0, unit: 'deg' },
            blur: { min: 0, max: 20, default: 0, unit: 'px' },
            invert: { min: 0, max: 100, default: 0, unit: '%' },
            dropShadow: { min: 0, max: 20, default: 0, unit: 'px' },
            opacity: { min: 0, max: 100, default: 100, unit: '%' },
            scale: { min: 50, max: 200, default: 100, unit: '%' },
            rotate: { min: 0, max: 360, default: 0, unit: 'deg' }
        };
    }
    
    /**
     * Initialize available transitions
     */
    initializeTransitions() {
        return {
            fade: { duration: 1, easing: 'ease-in-out' },
            slideLeft: { duration: 1, easing: 'ease-out' },
            slideRight: { duration: 1, easing: 'ease-out' },
            slideUp: { duration: 1, easing: 'ease-out' },
            slideDown: { duration: 1, easing: 'ease-out' },
            zoomIn: { duration: 1, easing: 'ease-out' },
            zoomOut: { duration: 1, easing: 'ease-out' },
            rotateIn: { duration: 1, easing: 'ease-out' },
            flip: { duration: 1.2, easing: 'ease-in-out' },
            crossFade: { duration: 1, easing: 'ease-in-out' }
        };
    }
    
    /**
     * Initialize color presets
     */
    initializePresets() {
        return {
            cinematic: {
                brightness: 95,
                contrast: 120,
                saturation: 90,
                hueRotate: 5
            },
            vintage: {
                brightness: 110,
                contrast: 85,
                saturation: 60,
                sepia: 30
            },
            dramatic: {
                brightness: 80,
                contrast: 140,
                saturation: 110,
                hueRotate: 0
            },
            vivid: {
                brightness: 105,
                contrast: 130,
                saturation: 140,
                hueRotate: 10
            },
            cool: {
                brightness: 100,
                contrast: 110,
                saturation: 80,
                hueRotate: 220
            },
            noir: {
                brightness: 70,
                contrast: 160,
                grayscale: 100,
                saturation: 0
            },
            warmth: {
                brightness: 110,
                contrast: 105,
                saturation: 100,
                hueRotate: 15
            },
            dream: {
                brightness: 120,
                contrast: 70,
                saturation: 85,
                blur: 2
            }
        };
    }
    
    /**
     * Apply single effect to element
     */
    applyEffect(element, effectType, value) {
        if (!element) return false;
        
        const effect = this.effects[effectType];
        if (!effect) {
            Kinetix.Console.warn(`Unknown effect: ${effectType}`);
            return false;
        }
        
        const clampedValue = Kinetix.Math.clamp(value, effect.min, effect.max);
        
        let filter = element.style.filter || '';
        
        // Remove existing effect of same type
        const regex = new RegExp(`${effectType}\\([^)]*\\)`, 'i');
        filter = filter.replace(regex, '').trim();
        
        // Add new effect
        switch (effectType) {
            case 'brightness':
                filter += ` brightness(${clampedValue}%)`;
                break;
            case 'contrast':
                filter += ` contrast(${clampedValue}%)`;
                break;
            case 'saturation':
                filter += ` saturate(${clampedValue}%)`;
                break;
            case 'grayscale':
                filter += ` grayscale(${clampedValue}%)`;
                break;
            case 'sepia':
                filter += ` sepia(${clampedValue}%)`;
                break;
            case 'hueRotate':
                filter += ` hue-rotate(${clampedValue}deg)`;
                break;
            case 'blur':
                filter += ` blur(${clampedValue}px)`;
                break;
            case 'invert':
                filter += ` invert(${clampedValue}%)`;
                break;
            case 'dropShadow':
                filter += ` drop-shadow(0 0 ${clampedValue}px rgba(0, 212, 255, 0.5))`;
                break;
            case 'opacity':
                element.style.opacity = clampedValue / 100;
                return true;
            case 'scale':
                element.style.transform = `scale(${clampedValue / 100})`;
                return true;
            case 'rotate':
                element.style.transform = `rotate(${clampedValue}deg)`;
                return true;
        }
        
        element.style.filter = filter.trim();
        return true;
    }
    
    /**
     * Apply multiple effects
     */
    applyEffects(element, effectsArray) {
        effectsArray.forEach(effect => {
            this.applyEffect(element, effect.type, effect.value);
        });
    }
    
    /**
     * Apply transition animation
     */
    applyTransition(element, transitionType, duration = 1) {
        if (!element) return false;
        
        const transition = this.transitions[transitionType];
        if (!transition) {
            Kinetix.Console.warn(`Unknown transition: ${transitionType}`);
            return false;
        }
        
        const keyframes = this.getTransitionKeyframes(transitionType);
        const animationName = `transition-${transitionType}-${Date.now()}`;
        
        // Create animation
        Kinetix.Animation.createKeyframeAnimation(animationName, keyframes);
        
        // Apply animation
        element.style.animation = `${animationName} ${duration}s ${transition.easing}`;
        
        return true;
    }
    
    /**
     * Get keyframes for transition
     */
    getTransitionKeyframes(transitionType) {
        const keyframes = {
            fade: [
                { opacity: '0' },
                { opacity: '1' }
            ],
            slideLeft: [
                { transform: 'translateX(100%)', opacity: '0' },
                { transform: 'translateX(0)', opacity: '1' }
            ],
            slideRight: [
                { transform: 'translateX(-100%)', opacity: '0' },
                { transform: 'translateX(0)', opacity: '1' }
            ],
            slideUp: [
                { transform: 'translateY(100%)', opacity: '0' },
                { transform: 'translateY(0)', opacity: '1' }
            ],
            slideDown: [
                { transform: 'translateY(-100%)', opacity: '0' },
                { transform: 'translateY(0)', opacity: '1' }
            ],
            zoomIn: [
                { transform: 'scale(0)', opacity: '0' },
                { transform: 'scale(1)', opacity: '1' }
            ],
            zoomOut: [
                { transform: 'scale(2)', opacity: '0' },
                { transform: 'scale(1)', opacity: '1' }
            ],
            rotateIn: [
                { transform: 'rotate(-180deg)', opacity: '0' },
                { transform: 'rotate(0deg)', opacity: '1' }
            ],
            flip: [
                { transform: 'rotateY(90deg)', opacity: '0' },
                { transform: 'rotateY(0deg)', opacity: '1' }
            ],
            crossFade: [
                { opacity: '0' },
                { opacity: '0.5' },
                { opacity: '1' }
            ]
        };
        
        return keyframes[transitionType] || keyframes.fade;
    }
    
    /**
     * Apply color preset
     */
    applyPreset(element, presetName) {
        const preset = this.presets[presetName];
        if (!preset) {
            Kinetix.Console.warn(`Unknown preset: ${presetName}`);
            return false;
        }
        
        Object.entries(preset).forEach(([effectType, value]) => {
            this.applyEffect(element, effectType, value);
        });
        
        Kinetix.Console.success(`Preset applied: ${presetName}`);
        return true;
    }
    
    /**
     * Clear all effects
     */
    clearEffects(element) {
        if (!element) return false;
        
        element.style.filter = '';
        element.style.opacity = '1';
        element.style.transform = '';
        
        return true;
    }
    
    /**
     * Get all available effects
     */
    getEffects() {
        return Object.keys(this.effects);
    }
    
    /**
     * Get all available transitions
     */
    getTransitions() {
        return Object.keys(this.transitions);
    }
    
    /**
     * Get all available presets
     */
    getPresets() {
        return Object.keys(this.presets);
    }
}

// Initialize effects manager
document.addEventListener('DOMContentLoaded', () => {
    window.effectsManager = new EffectsManager();
    Kinetix.Console.success('Effects manager initialized');
});
