const canvas = document.getElementById('gameCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const elevator = { position: { x: 0, y: 0, z: 0 }, level: 1 };
let currentLevel = 1;

// Movement variables
const keys = {};
const speed = 0.1;

// Initialize the game
function init() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    createHospital();
    updateFloorDisplay();
    animate();

    // Event listener for keyboard controls
    window.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    document.getElementById('forwardBtn').addEventListener('click', () => {
        moveElevator('forward');
    });
}

// Create the hospital environment
function createHospital() {
    const floorGeometry = new THREE.BoxGeometry(10, 0.1, 10);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    
    // Create floors
    for (let i = 0; i < 5; i++) {
        const level = new THREE.Mesh(floorGeometry, floorMaterial);
        level.position.set(0, i * 2, 0); // Stack floors vertically
        scene.add(level);
    }

    // Create walls (simple box to represent walls)
    const wallGeometry = new THREE.BoxGeometry(10, 2, 0.1);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    for (let i = 0; i < 5; i++) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(0, i * 2, 5); // Position the walls
        scene.add(wall);
    }

    camera.position.z = 5; // Move the camera back
}

// Check for anomalies
function checkAnomaly() {
    return Math.random() < 0.3; // 30% chance of an anomaly
}

// Handle player movement
function moveElevator(direction) {
    if (direction === 'forward') {
        if (!checkAnomaly()) {
            currentLevel++;
            elevator.position.z += 1; // Move elevator forward
        } else {
            // Anomaly detected, reset to level 1
            currentLevel = 1;
            elevator.position.z = 0; // Reset position
        }
    }
    updateFloorDisplay();
}

// Update floor display
function updateFloorDisplay() {
    document.getElementById('floorDisplay').innerText = `Current Floor: ${currentLevel}`;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Handle WASD movement
    if (keys['w']) camera.position.z -= speed; // Move forward
    if (keys['s']) camera.position.z += speed; // Move backward
    if (keys['a']) camera.position.x -= speed; // Move left
    if (keys['d']) camera.position.x += speed; // Move right

    renderer.render(scene, camera);
}

// Initialize the game
init();
