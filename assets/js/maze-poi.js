/**
 * Maze POI System
 * Displays floor plan with Start and Goal markers
 */
class MazePOISystem {
    constructor() {
        this.canvas = document.getElementById('minimapCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // POI coordinates based on building floor plan
        // Coordinate unit: pixels (based on original image dimensions)
        this.pois = {
            start: {
                x: 80,      // Top-left entrance area
                y: 120,
                color: '#00cc00',
                label: 'Start'
            },
            goal: {
                x: 920,     // Bottom-right target area
                y: 650,
                color: '#cc0000',
                label: 'Goal'
            }
        };

        this.floorplanImage = new Image();
        this.floorplanLoaded = false;
        
        this.init();
    }

    init() {
        this.floorplanImage.onload = () => {
            this.floorplanLoaded = true;
            
            // Set canvas size based on image dimensions
            const maxSize = 300;
            const imgRatio = this.floorplanImage.width / this.floorplanImage.height;
            
            if (imgRatio > 1) {
                this.canvas.width = maxSize;
                this.canvas.height = maxSize / imgRatio;
            } else {
                this.canvas.height = maxSize;
                this.canvas.width = maxSize * imgRatio;
            }
            
            this.render();
        };
        
        this.floorplanImage.onerror = () => {
            console.warn('Floor plan not found, using default dimensions');
            this.canvas.width = 300;
            this.canvas.height = 300;
            this.floorplanLoaded = false;
            this.render();
        };

        // Load building floor plan
        // Adjust path according to your project structure
        this.floorplanImage.src = 'assets/images/floorplan.png';
    }

    render() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Clear canvas
        this.ctx.clearRect(0, 0, w, h);

        if (this.floorplanLoaded) {
            // Draw building floor plan
            this.ctx.drawImage(this.floorplanImage, 0, 0, w, h);
        } else {
            // If image not loaded, show gray background
            this.ctx.fillStyle = '#cccccc';
            this.ctx.fillRect(0, 0, w, h);
            this.ctx.fillStyle = '#666';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Loading floor plan...', w / 2, h / 2);
        }

        // Calculate POI positions on canvas
        const scaleX = w / (this.floorplanLoaded ? this.floorplanImage.width : 1280);
        const scaleY = h / (this.floorplanLoaded ? this.floorplanImage.height : 960);

        // Draw POI markers
        this.drawPOI(this.pois.start, scaleX, scaleY);
        this.drawPOI(this.pois.goal, scaleX, scaleY);
    }

    drawPOI(poi, scaleX, scaleY) {
        const x = poi.x * scaleX;
        const y = poi.y * scaleY;
        const radius = 6;

        // Draw circle
        this.ctx.fillStyle = poi.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // White border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw label
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        
        // Label background
        const labelWidth = this.ctx.measureText(poi.label).width;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(x - labelWidth / 2 - 3, y - radius - 18, labelWidth + 6, 14);
        
        // Label text
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(poi.label, x, y - radius - 6);
    }

    // Update POI position (pixel coordinates)
    updatePOI(poiName, x, y) {
        if (this.pois[poiName]) {
            this.pois[poiName].x = x;
            this.pois[poiName].y = y;
            this.render();
        }
    }

    // Get POI position in normalized coordinates (0-1)
    getPOINormalized(poiName) {
        if (!this.pois[poiName] || !this.floorplanLoaded) return null;
        
        return {
            x: this.pois[poiName].x / this.floorplanImage.width,
            y: this.pois[poiName].y / this.floorplanImage.height
        };
    }
}

// Initialize POI system when DOM is ready
let poiSystem;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initPOISystem();
    });
} else {
    initPOISystem();
}

function initPOISystem() {
    poiSystem = new MazePOISystem();
    
    // Click to get coordinates (for debugging positioning)
    document.getElementById('minimapCanvas').addEventListener('click', (e) => {
        if (!poiSystem.floorplanLoaded) return;
        
        const rect = e.target.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        
        // Convert to original image coordinates
        const scaleX = poiSystem.floorplanImage.width / poiSystem.canvas.width;
        const scaleY = poiSystem.floorplanImage.height / poiSystem.canvas.height;
        
        const imgX = Math.round(canvasX * scaleX);
        const imgY = Math.round(canvasY * scaleY);
        
        console.log(`Original image coordinates: x: ${imgX}, y: ${imgY}`);
    });
}
