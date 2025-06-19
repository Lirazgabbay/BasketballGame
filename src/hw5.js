import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court - Textured surfaces for court (Bonus)
function createBasketballCourt() {
  // Court floor -
  const textureLoader = new THREE.TextureLoader();
  const courtTexture = textureLoader.load('src/court_texture.jpg');

  const courtGeometry = new THREE.BoxGeometry(28, 0.2, 15);
  const courtMaterial = new THREE.MeshPhongMaterial({
    map: courtTexture,
    shininess: 50
  });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.receiveShadow = true;
  scene.add(court);

  // Note: All court lines, hoops, and other elements have been removed
  // Students will need to implement these features

  // PARAMETERS
  const poleHeight = 4.0; // 4 meters tall
  const poleRadius = 0.1; // 10cm radius
  const armLength = 1.2;  // 1.2 meters arm length
  const poleDistanceBehindCourt = 1.2; // poles placed 1.2 meters behind baseline
  const backboardWidth = 2.4;
  const backboardHeight = 1.4;
  const backboardThickness = 0.05;
  const RIM_RADIUS = 0.225;
  const RIM_HEIGHT = 3.05;
  const keyLength = 3.6;
  const keyWidth = 3.6;
  const FREE_THROW_CIRCLE_RADIUS = 1.8;
  const THREE_POINT_RADIUS = 6.75;

  // POLE SECTION
  const poleGeometry = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight);
  const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
  // Left pole (behind left baseline)
  const leftPole = new THREE.Mesh(poleGeometry, poleMaterial);
  leftPole.position.set(-14 - poleDistanceBehindCourt, poleHeight / 2, 0);
  leftPole.castShadow = true;
  scene.add(leftPole);
  // Right pole (behind right baseline)
  const rightPole = new THREE.Mesh(poleGeometry, poleMaterial);
  rightPole.position.set(14 + poleDistanceBehindCourt, poleHeight / 2, 0);
  rightPole.castShadow = true;
  scene.add(rightPole);

  // SUPPORT ARM SECTION
  const armGeometry = new THREE.BoxGeometry(armLength, 0.15, 0.15);
  const armMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
  // Left support arm (extends from left pole towards court)
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(
      (-14 - poleDistanceBehindCourt) + (armLength / 2),
      3.05 + 0.5,
      0
  );
  leftArm.castShadow = true;
  scene.add(leftArm);
  // Right support arm (extends from right pole towards court)
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(
      (14 + poleDistanceBehindCourt) - (armLength / 2),
      3.05 + 0.5,
      0
  );
  rightArm.castShadow = true;
  scene.add(rightArm);

  //More detailed hoop models - branded backboards
  const backboardTexture = textureLoader.load('src/backboard_brand.jpg');  // תמונה שאתה מוסיף
  const backboardGeometry = new THREE.BoxGeometry(backboardThickness, backboardHeight, backboardWidth);
  const backboardMaterial = new THREE.MeshPhongMaterial({
    map: backboardTexture,
    transparent: true,
    opacity: 0.8
  });
  // Left backboard
  const leftBackboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
  leftBackboard.position.set(-14 + (backboardThickness / 2), 3.05 + 0.45, 0);
  leftBackboard.castShadow = true;
  leftBackboard.receiveShadow = true;
  scene.add(leftBackboard);
  // Right backboard
  const rightBackboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
  rightBackboard.position.set(14 - (backboardThickness / 2), 3.05 + 0.45, 0);
  rightBackboard.castShadow = true;
  rightBackboard.receiveShadow = true;
  scene.add(rightBackboard);

  // RIM section
  const rimGeometry = new THREE.TorusGeometry(RIM_RADIUS, 0.04, 16, 64);
  const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xff6600 });  // Orange
  // Left rim
  const leftRim = new THREE.Mesh(rimGeometry, rimMaterial);
  leftRim.position.set(-14 + (RIM_RADIUS + backboardThickness), RIM_HEIGHT, 0);
  leftRim.rotation.x = Math.PI / 2;
  leftRim.castShadow = true;
  scene.add(leftRim);
  // Right rim
  const rightRim = new THREE.Mesh(rimGeometry, rimMaterial);
  rightRim.position.set(14 - (RIM_RADIUS + backboardThickness), RIM_HEIGHT, 0);
  rightRim.rotation.x = Math.PI / 2;
  rightRim.castShadow = true;
  scene.add(rightRim);

  function createRealisticChainNet(x, y, z) {
  const netGroup = new THREE.Group();
  const chainSegments = 12;
  const linksPerChain = 8;
  const linkLength = 0.05;
  const linkRadius = 0.008;
  const chainMaterial = new THREE.MeshPhongMaterial({
    color: 0xcccccc,
    shininess: 100,
    specular: 0x444444
  });
  const verticalPoints = [];
  for (let i = 0; i < chainSegments; i++) {
    const angle = (i / chainSegments) * Math.PI * 2;
    const rimX = Math.cos(angle) * (RIM_RADIUS * 0.85);
    const rimZ = Math.sin(angle) * (RIM_RADIUS * 0.85);
    const strandPoints = [];

    for (let j = 0; j < linksPerChain; j++) {
      const linkY = y - (j * linkLength);
      const point = new THREE.Vector3(rimX, linkY, rimZ);
      strandPoints.push(point);
      const linkGeometry = new THREE.TorusGeometry(linkLength * 0.6, linkRadius, 8, 16);
      const link = new THREE.Mesh(linkGeometry, chainMaterial);
      link.position.set(point.x, point.y, point.z);
      link.rotation.z = (j % 2 === 1) ? Math.PI / 2 : 0;
      link.rotation.y = Math.random() * 0.3 - 0.15;
      link.castShadow = true;
      netGroup.add(link);
    }
    verticalPoints.push(strandPoints);
  }
  for (let i = 0; i < chainSegments; i++) {
    const nextI = (i + 1) % chainSegments;
    for (let j = 0; j < linksPerChain - 1; j++) {
      const p1 = verticalPoints[i][j];
      const p2 = verticalPoints[nextI][j + 1];
      const connectorLength = p1.distanceTo(p2);
      const connectorGeometry = new THREE.CylinderGeometry(linkRadius / 2, linkRadius / 2, connectorLength, 8);
      const connector = new THREE.Mesh(connectorGeometry, chainMaterial);
      const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      connector.position.copy(midPoint);
      connector.lookAt(p2);
      connector.rotateX(Math.PI / 2);
      netGroup.add(connector);
    }
  }
  netGroup.position.set(x, 0, z);
  scene.add(netGroup);
}
  createRealisticChainNet(-14 + (RIM_RADIUS + backboardThickness), RIM_HEIGHT, 0);
  createRealisticChainNet(14 - (RIM_RADIUS + backboardThickness), RIM_HEIGHT, 0);

  // Center Line
  const lineWidth = 0.05;
  const lineHeight = 0.02;
  const COURT_WIDTH = 15;  // full court width
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const centerLineGeometry = new THREE.BoxGeometry(lineWidth, lineHeight, COURT_WIDTH);
  const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial);
  centerLine.position.set(0, 0.11, 0);  // slightly above court surface (0.2 court thickness + 0.01 gap)
  scene.add(centerLine);

  // Center circle
  const CENTER_CIRCLE_RADIUS = 1.8;  // standard size (1.8m radius)
  const centerCircleGeometry = new THREE.RingGeometry(
      CENTER_CIRCLE_RADIUS - 0.025,
      CENTER_CIRCLE_RADIUS + 0.025,
      64
  );
  const centerCircle = new THREE.Mesh(centerCircleGeometry, lineMaterial);
  // Rotate to lie flat on court (facing up)
  centerCircle.rotation.x = -Math.PI / 2;
  // Position slightly above floor to avoid z-fighting
  centerCircle.position.y = 0.11;  // same as center line height
  scene.add(centerCircle);

  // THREE POINT ARCS
  const leftArcX = -14.3 + (backboardThickness / 2) + RIM_RADIUS;
  const rightArcX = 14.3 - (backboardThickness / 2) - RIM_RADIUS;
  const arcGeometry = new THREE.RingGeometry(
      THREE_POINT_RADIUS - 0.025, THREE_POINT_RADIUS + 0.025, 64, 64, 0, Math.PI
  );
  const leftThreePoint = new THREE.Mesh(arcGeometry, lineMaterial);
  leftThreePoint.rotation.x = -Math.PI / 2;
  leftThreePoint.rotation.z = -Math.PI / 2;
  leftThreePoint.position.set(leftArcX, 0.11, 0);
  scene.add(leftThreePoint);
  const rightThreePoint = new THREE.Mesh(arcGeometry, lineMaterial);
  rightThreePoint.rotation.x = -Math.PI / 2;
  rightThreePoint.rotation.z = Math.PI / 2;
  rightThreePoint.position.set(rightArcX, 0.11, 0);
  scene.add(rightThreePoint);

  // FREE THROW CIRCLES
  const freeThrowGeometry = new THREE.RingGeometry(
      FREE_THROW_CIRCLE_RADIUS - 0.025, FREE_THROW_CIRCLE_RADIUS + 0.025, 64, 64, 0, Math.PI
  );
  const leftKeyCircle = new THREE.Mesh(freeThrowGeometry, lineMaterial);
  leftKeyCircle.rotation.x = -Math.PI / 2;
  leftKeyCircle.rotation.z = -Math.PI / 2;
  leftKeyCircle.position.set(-14 + keyLength, 0.11, 0);
  scene.add(leftKeyCircle);
  const rightKeyCircle = new THREE.Mesh(freeThrowGeometry, lineMaterial);
  rightKeyCircle.rotation.x = -Math.PI / 2;
  rightKeyCircle.rotation.z = Math.PI / 2;
  rightKeyCircle.position.set(14 - keyLength, 0.11, 0);
  scene.add(rightKeyCircle);

  // Dashed Free Throw Semi-Circle (NBA style) -- LEFT SIDE
  const dashedSegments = 16;
  const totalAngle = Math.PI; // Full semi-circle (180 degrees)
  const dashAngle = totalAngle / (dashedSegments * 2); // Account for gaps
  const dashGap = dashAngle; // Equal dash and gap sizes

  for (let i = 0; i < dashedSegments; i++) {
    const startAngle = i * (dashAngle + dashGap);
    const dashGeometry = new THREE.RingGeometry(
      FREE_THROW_CIRCLE_RADIUS - 0.025,
      FREE_THROW_CIRCLE_RADIUS + 0.025,
      32,
      1,
      startAngle,
      dashAngle
    );
    const dash = new THREE.Mesh(dashGeometry, lineMaterial);
    dash.rotation.x = -Math.PI / 2;
    dash.rotation.z = Math.PI / 2;
    dash.position.set(-14 + keyLength, 0.1, 0);
    scene.add(dash);
  }
  // RIGHT SIDE
  for (let i = 0; i < dashedSegments; i++) {
    const startAngle = i * (dashAngle + dashGap);
    const dashGeometry = new THREE.RingGeometry(
      FREE_THROW_CIRCLE_RADIUS - 0.025,
      FREE_THROW_CIRCLE_RADIUS + 0.025,
      32,
      1,
      startAngle,
      dashAngle
    );
    const dash = new THREE.Mesh(dashGeometry, lineMaterial);
    dash.rotation.x = -Math.PI / 2;
    dash.rotation.z = -Math.PI / 2;
    dash.position.set(14 - keyLength, 0.1, 0);
    scene.add(dash);
  }

  // FREE THROW LANES (paint/key areas)
  const keyTopGeometry = new THREE.BoxGeometry(keyLength, lineHeight, lineWidth);
  const keySideGeometry = new THREE.BoxGeometry(lineWidth, lineHeight, keyWidth);
  // LEFT key
  const leftKeyTop = new THREE.Mesh(keyTopGeometry, lineMaterial);
  leftKeyTop.position.set(-14 + keyLength / 2, 0.11, keyWidth / 2);
  scene.add(leftKeyTop);
  const leftKeyBottom = new THREE.Mesh(keyTopGeometry, lineMaterial);
  leftKeyBottom.position.set(-14 + keyLength / 2, 0.11, -keyWidth / 2);
  scene.add(leftKeyBottom);
  const leftKeyFarSide = new THREE.Mesh(keySideGeometry, lineMaterial);
  leftKeyFarSide.position.set(-14 + keyLength, 0.11, 0);
  scene.add(leftKeyFarSide);
  // RIGHT key
  const rightKeyTop = new THREE.Mesh(keyTopGeometry, lineMaterial);
  rightKeyTop.position.set(14 - keyLength / 2, 0.11, keyWidth / 2);
  scene.add(rightKeyTop);
  const rightKeyBottom = new THREE.Mesh(keyTopGeometry, lineMaterial);
  rightKeyBottom.position.set(14 - keyLength / 2, 0.11, -keyWidth / 2);
  scene.add(rightKeyBottom);
  const rightKeyFarSide = new THREE.Mesh(keySideGeometry, lineMaterial);
  rightKeyFarSide.position.set(14 - keyLength, 0.11, 0);
  scene.add(rightKeyFarSide);

  // COURT BOUNDARY LINES (Sidelines and Baselines)
  const COURT_LENGTH = 28; // Full length of court (already used earlier for court floor)
  const boundaryLineWidth = 0.07;
  const boundaryLineHeight = 0.02;
  const boundaryY = 0.11; // same height as other lines
  // Side boundaries (long sides)
  const sideBoundaryGeometry = new THREE.BoxGeometry(COURT_LENGTH, boundaryLineHeight, boundaryLineWidth);
  const topBoundary = new THREE.Mesh(sideBoundaryGeometry, lineMaterial);
  topBoundary.position.set(0, boundaryY, COURT_WIDTH / 2);
  scene.add(topBoundary);
  const bottomBoundary = new THREE.Mesh(sideBoundaryGeometry, lineMaterial);
  bottomBoundary.position.set(0, boundaryY, -COURT_WIDTH / 2);
  scene.add(bottomBoundary);
  // End boundaries (short sides)
  const endBoundaryGeometry = new THREE.BoxGeometry(boundaryLineWidth, boundaryLineHeight, COURT_WIDTH);
  const leftBoundary = new THREE.Mesh(endBoundaryGeometry, lineMaterial);
  leftBoundary.position.set(-COURT_LENGTH / 2, boundaryY, 0);
  scene.add(leftBoundary);
  const rightBoundary = new THREE.Mesh(endBoundaryGeometry, lineMaterial);
  rightBoundary.position.set(COURT_LENGTH / 2, boundaryY, 0);
  scene.add(rightBoundary);

}

function createBasketball() {
  const textureLoader = new THREE.TextureLoader();
  const basketballTexture = textureLoader.load('./src/basketball_texture.jpg');
  const BASKETBALL_RADIUS = 0.12;
  const ballGeometry = new THREE.SphereGeometry(BASKETBALL_RADIUS, 64, 64);
  const ballMaterial = new THREE.MeshPhongMaterial({
    map: basketballTexture,
    shininess: 50,
    specular: 0x333333
  });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 2 + BASKETBALL_RADIUS, 0);  // properly above court
  ball.castShadow = true;
  ball.receiveShadow = true;
  scene.add(ball);
  const seamMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  const verticalSeamCount = 2;
  for (let j = 0; j < verticalSeamCount; j++) {
    const angleOffset = (j / verticalSeamCount) * Math.PI;
    const verticalSeamGeometry = new THREE.BufferGeometry();
    const verticalPoints = [];
    for (let i = 0; i <= 128; i++) {
      const phi = (i / 128) * Math.PI * 2;
      verticalPoints.push(new THREE.Vector3(
        BASKETBALL_RADIUS * Math.sin(phi) * Math.cos(angleOffset),
        BASKETBALL_RADIUS * Math.cos(phi),
        BASKETBALL_RADIUS * Math.sin(phi) * Math.sin(angleOffset)
      ));
    }
    verticalSeamGeometry.setFromPoints(verticalPoints);
    const verticalSeam = new THREE.Line(verticalSeamGeometry, seamMaterial);
    verticalSeam.position.copy(ball.position);
    scene.add(verticalSeam);
  }

  const horizontalSeamGeometry = new THREE.BufferGeometry();
  const horizontalPoints = [];
  for (let i = 0; i <= 128; i++) {
    const theta = (i / 128) * Math.PI * 2;
    horizontalPoints.push(new THREE.Vector3(
      BASKETBALL_RADIUS * Math.cos(theta),
      0,
      BASKETBALL_RADIUS * Math.sin(theta)
    ));
  }
  horizontalSeamGeometry.setFromPoints(horizontalPoints);
  const horizontalSeam = new THREE.Line(horizontalSeamGeometry, seamMaterial);
  horizontalSeam.position.copy(ball.position);
  scene.add(horizontalSeam);
}

function createBleachers() {
  const COURT_LENGTH = 28;
  const COURT_WIDTH = 15;
  const bleacherRows = 10;
  const seatsPerRow = 52;
  const seatWidth = 0.5;
  const seatDepth = 0.5;
  const seatHeight = 0.4;
  const startX = -COURT_LENGTH / 2;
  const startZ = COURT_WIDTH / 2 + 2;
  const seatMaterial = new THREE.MeshPhongMaterial({ color:  0x3B5AA3, shininess: 20 });
  for (let row = 0; row < bleacherRows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const geometry = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth);
      const mesh = new THREE.Mesh(geometry, seatMaterial);
      const x = startX + seat * (seatWidth + 0.05);
      const y = row * seatHeight;
      const z = startZ + row * (seatDepth + 0.1);
      mesh.position.set(x, y, z);
      scene.add(mesh);
    }
  }
}

function createBleachersMirror() {
  const COURT_LENGTH = 28;
  const COURT_WIDTH = 15;
  const bleacherRows = 10;
  const seatsPerRow = 52;
  const seatWidth = 0.5;
  const seatDepth = 0.5;
  const seatHeight = 0.4;
  const startX = -COURT_LENGTH / 2;
  const startZ = -COURT_WIDTH / 2 - 2; // mirror side
  const seatMaterial = new THREE.MeshPhongMaterial({ color:  0x3B5AA3 , shininess: 20 });

  for (let row = 0; row < bleacherRows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const geometry = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth);
      const mesh = new THREE.Mesh(geometry, seatMaterial);
      const x = startX + seat * (seatWidth + 0.05);
      const y = row * seatHeight;
      const z = startZ - row * (seatDepth + 0.1); // negative offset for mirror
      mesh.position.set(x, y, z);
      scene.add(mesh);
    }
  }
}

let homeScore = 0;
let guestScore = 0;

function updateScoreboard() {
  document.getElementById("scoreboard").innerText = `Home: ${homeScore} - Guest: ${guestScore}`;
}

createBasketballCourt(); // Create all elements
createBasketball();
createBleachers();
createBleachersMirror();
updateScoreboard();

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Instructions display
const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '20px';
instructionsElement.style.left = '20px';
instructionsElement.style.color = 'white';
instructionsElement.style.fontSize = '16px';
instructionsElement.style.fontFamily = 'Arial, sans-serif';
instructionsElement.style.textAlign = 'left';
instructionsElement.innerHTML = `
  <h3>Controls:</h3>
  <p>O - Toggle orbit camera</p>
`;
document.body.appendChild(instructionsElement);

// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();

  renderer.render(scene, camera);
}

animate();