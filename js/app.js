/**
 * KINETIX LABS - MAIN APPLICATION
 * Core app logic, project management, and state handling
 */

class KinetixApp extends EventTarget {
    constructor() {
        super();
        this.projects = [];
        this.currentProject = null;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
        this.initialized = false;
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        this.loadProjects();
        this.setupKeyboardShortcuts();
        this.setupUI();
        this.initialized = true;
        Kinetix.Console.success('Kinetix Labs initialized');
    }
    
    /**
     * Create new project
     */
    newProject(projectName = 'Untitled Project') {
        const project = {
            id: `project-${Date.now()}`,
            name: projectName,
            created: new Date(),
            modified: new Date(),
            timeline: null,
            metadata: {
                resolution: '1920x1080',
                framerate: 30,
                audioChannels: 2
            }
        };
        
        this.projects.push(project);
        this.currentProject = project;
        this.history = [];
        this.historyIndex = -1;
        
        // Create new timeline for project
        window.timeline.clear();
        window.timeline.addTrack('video');
        window.timeline.addTrack('audio');
        
        this.saveProjects();
        this.dispatchEvent(new CustomEvent('projectCreated', { detail: { project } }));
        Kinetix.Console.success(`Project created: ${projectName}`);
        
        return project;
    }
    
    /**
     * Open existing project
     */
    openProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            Kinetix.Console.error(`Project not found: ${projectId}`);
            return false;
        }
        
        this.currentProject = project;
        if (project.timeline) {
            window.timeline.import(project.timeline);
        }
        
        this.dispatchEvent(new CustomEvent('projectOpened', { detail: { project } }));
        Kinetix.Console.success(`Project opened: ${project.name}`);
        
        return true;
    }
    
    /**
     * Save current project
     */
    saveProject() {
        if (!this.currentProject) {
            Kinetix.Console.warn('No project selected');
            return false;
        }
        
        this.currentProject.modified = new Date();
        this.currentProject.timeline = window.timeline.export();
        
        this.saveProjects();
        this.dispatchEvent(new CustomEvent('projectSaved', { detail: { project: this.currentProject } }));
        Kinetix.Console.success(`Project saved: ${this.currentProject.name}`);
        
        return true;
    }
    
    /**
     * Delete project
     */
    deleteProject(projectId) {
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index === -1) return false;
        
        const project = this.projects[index];
        this.projects.splice(index, 1);
        
        if (this.currentProject && this.currentProject.id === projectId) {
            this.currentProject = null;
            window.timeline.clear();
        }
        
        this.saveProjects();
        this.dispatchEvent(new CustomEvent('projectDeleted', { detail: { project } }));
        
        return true;
    }
    
    /**
     * Export project as JSON
     */
    exportProject() {
        if (!this.currentProject) {
            Kinetix.Console.warn('No project selected');
            return false;
        }
        
        const data = JSON.stringify(this.currentProject, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentProject.name}.kinetix`;
        a.click();
        
        Kinetix.Console.success('Project exported');
        return true;
    }
    
    /**
     * Import project from file
     */
    importProject(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const project = JSON.parse(e.target.result);
                    project.id = `project-${Date.now()}`;
                    project.created = new Date();
                    project.modified = new Date();
                    
                    this.projects.push(project);
                    this.currentProject = project;
                    
                    if (project.timeline) {
                        window.timeline.import(project.timeline);
                    }
                    
                    this.saveProjects();
                    this.dispatchEvent(new CustomEvent('projectImported', { detail: { project } }));
                    Kinetix.Console.success('Project imported');
                    
                    resolve(project);
                } catch (error) {
                    Kinetix.Console.error('Failed to import project');
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }
    
    /**
     * Add media clip
     */
    addClip(file, trackType = 'video') {
        if (!this.currentProject) {
            Kinetix.Console.warn('No project selected');
            return null;
        }
        
        let track = window.timeline.tracks.find(t => t.type === trackType);
        if (!track) {
            track = window.timeline.addTrack(trackType);
        }
        
        const clip = window.timeline.addClip(track.id, {
            name: file.name,
            duration: 5,
            file: file
        });
        
        this.pushHistory('Add clip');
        this.dispatchEvent(new CustomEvent('mediaAdded', { detail: { clip, file } }));
        
        return clip;
    }
    
    /**
     * Undo last action
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.applyHistoryState();
            this.dispatchEvent(new CustomEvent('undo', { detail: { action: this.history[this.historyIndex] } }));
            Kinetix.Console.log('Undo');
        }
    }
    
    /**
     * Redo last undo
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.applyHistoryState();
            this.dispatchEvent(new CustomEvent('redo', { detail: { action: this.history[this.historyIndex] } }));
            Kinetix.Console.log('Redo');
        }
    }
    
    /**
     * Push action to history
     */
    pushHistory(action) {
        // Remove future history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        // Add new action
        this.history.push({
            action: action,
            timestamp: Date.now(),
            state: window.timeline.export()
        });
        
        // Maintain max history
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }
    
    /**
     * Apply history state
     */
    applyHistoryState() {
        const state = this.history[this.historyIndex];
        if (state) {
            window.timeline.import(state.state);
        }
    }
    
    /**
     * Toggle playback
     */
    togglePlayPause() {
        if (window.timeline.isPlaying) {
            window.timeline.pause();
        } else {
            window.timeline.play();
        }
    }
    
    /**
     * Stop playback
     */
    stop() {
        window.timeline.stop();
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const ctrl = isMac ? e.metaKey : e.ctrlKey;
            
            if (ctrl && e.key === 's') {
                e.preventDefault();
                this.saveProject();
            } else if (ctrl && e.key === 'z') {
                e.preventDefault();
                this.undo();
            } else if ((ctrl && e.key === 'y') || (ctrl && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                this.redo();
            } else if (ctrl && e.key === 'e') {
                e.preventDefault();
                this.exportProject();
            } else if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlayPause();
            } else if (e.key === 'Delete') {
                // Delete selected clip (would require selection tracking)
            }
        });
    }
    
    /**
     * Setup UI elements
     */
    setupUI() {
        // Create new project
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.includes('New Project')) {
                btn.addEventListener('click', () => {
                    const name = prompt('Project name:', 'My Video');
                    if (name) this.newProject(name);
                });
            }
        });
    }
    
    /**
     * Save projects to localStorage
     */
    saveProjects() {
        Kinetix.Storage.save('kinetix_projects', this.projects);
    }
    
    /**
     * Load projects from localStorage
     */
    loadProjects() {
        const projects = Kinetix.Storage.load('kinetix_projects', []);
        this.projects = projects;
    }
    
    /**
     * Get app statistics
     */
    getStats() {
        return {
            projectCount: this.projects.length,
            currentProject: this.currentProject ? this.currentProject.name : 'None',
            historyLength: this.history.length,
            timelineInfo: window.timeline.getInfo()
        };
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new KinetixApp();
});
