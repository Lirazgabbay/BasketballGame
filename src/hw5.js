import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias: true});
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
  return degrees * (pi / 180);
}

// Create basketball court - Textured surfaces for court (Bonus)
function createBasketballCourt() {
  // Court floor -
  const textureLoader = new THREE.TextureLoader();
  const courtTexture = textureLoader.load('src/court_texture.jpg');

  const courtGeometry = new THREE.BoxGeometry(28, 0.2, 15);
  const courtMaterial = new THREE.MeshPhongMaterial({
    map: courtTexture, shininess: 50
  });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.receiveShadow = true;
  court.castShadow = true;
  scene.add(court);

  // Note: All court lines, hoops, and other elements have been removed
  // Students will need to implement these features

  // PARAMETERS
  const poleHeight = 4.0; 
  const poleRadius = 0.1; 
  const armLength = 1.2;  
  const poleDistanceBehindCourt = 1.2; 
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
  const poleMaterial = new THREE.MeshPhongMaterial({color: 0x666666});
  // Left pole (behind left baseline)
  const leftPole = new THREE.Mesh(poleGeometry, poleMaterial);
  leftPole.position.set(-14 - poleDistanceBehindCourt, poleHeight / 2, 0);
  leftPole.castShadow = true;
  leftPole.receiveShadow = true;
  scene.add(leftPole);
  // Right pole (behind right baseline)
  const rightPole = new THREE.Mesh(poleGeometry, poleMaterial);
  rightPole.position.set(14 + poleDistanceBehindCourt, poleHeight / 2, 0);
  rightPole.castShadow = true;
  rightPole.receiveShadow = true;
  scene.add(rightPole);

  // SUPPORT ARM SECTION
  const armGeometry = new THREE.BoxGeometry(armLength, 0.15, 0.15);
  const armMaterial = new THREE.MeshPhongMaterial({color: 0x666666});
  // Left support arm (extends from left pole towards court)
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set((-14 - poleDistanceBehindCourt) + (armLength / 2), 3.05 + 0.5, 0);
  leftArm.castShadow = true;
  leftArm.receiveShadow = true;
  scene.add(leftArm);
  // Right support arm (extends from right pole towards court)
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set((14 + poleDistanceBehindCourt) - (armLength / 2), 3.05 + 0.5, 0);
  rightArm.castShadow = true;
  rightArm.receiveShadow = true;
  scene.add(rightArm);

  //More detailed hoop models - branded backboards
  const backboardTexture = textureLoader.load('src/backboard_brand.jpg');  
  const backboardGeometry = new THREE.BoxGeometry(backboardThickness, backboardHeight, backboardWidth);
  const backboardMaterial = new THREE.MeshPhongMaterial({
    map: backboardTexture, transparent: true, opacity: 0.8
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
  const rimMaterial = new THREE.MeshPhongMaterial({color: 0xff6600});  
  // Left rim
  const leftRim = new THREE.Mesh(rimGeometry, rimMaterial);
  leftRim.position.set(-14 + (RIM_RADIUS + backboardThickness), RIM_HEIGHT, 0);
  leftRim.rotation.x = Math.PI / 2;
  leftRim.castShadow = true;
  leftRim.receiveShadow = true;
  scene.add(leftRim);
  // Right rim
  const rightRim = new THREE.Mesh(rimGeometry, rimMaterial);
  rightRim.position.set(14 - (RIM_RADIUS + backboardThickness), RIM_HEIGHT, 0);
  rightRim.rotation.x = Math.PI / 2;
  rightRim.castShadow = true;
  rightRim.receiveShadow = true;
  scene.add(rightRim);

  function createRealisticChainNet(x, y, z) {
    const netGroup = new THREE.Group();
    const chainSegments = 12;
    const linksPerChain = 8;
    const linkLength = 0.05;
    const linkRadius = 0.008;
    const chainMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc, shininess: 100, specular: 0x444444
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
        link.receiveShadow = true;
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
        connector.castShadow = true;
        connector.receiveShadow = true;
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
  const lineMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
  const centerLineGeometry = new THREE.BoxGeometry(lineWidth, lineHeight, COURT_WIDTH);
  const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial);
  centerLine.position.set(0, 0.11, 0);  
  centerLine.castShadow = true;
  centerLine.receiveShadow = true;
  scene.add(centerLine);

  const CENTER_CIRCLE_RADIUS = 1.8;  
  const centerCircleGeometry = new THREE.RingGeometry(CENTER_CIRCLE_RADIUS - 0.025, CENTER_CIRCLE_RADIUS + 0.025, 64);
  const centerCircle = new THREE.Mesh(centerCircleGeometry, lineMaterial);
  centerCircle.castShadow = true;
  centerCircle.receiveShadow = true;
  centerCircle.rotation.x = -Math.PI / 2;
  centerCircle.position.y = 0.11;  
  scene.add(centerCircle);

  // THREE POINT ARCS
  const leftArcX = -14.3 + (backboardThickness / 2) + RIM_RADIUS;
  const rightArcX = 14.3 - (backboardThickness / 2) - RIM_RADIUS;
  const arcGeometry = new THREE.RingGeometry(THREE_POINT_RADIUS - 0.025, THREE_POINT_RADIUS + 0.025, 64, 64, 0, Math.PI);
  const leftThreePoint = new THREE.Mesh(arcGeometry, lineMaterial);
  leftThreePoint.castShadow = true;
  leftThreePoint.receiveShadow = true;
  leftThreePoint.rotation.x = -Math.PI / 2;
  leftThreePoint.rotation.z = -Math.PI / 2;
  leftThreePoint.position.set(leftArcX, 0.11, 0);
  scene.add(leftThreePoint);
  const rightThreePoint = new THREE.Mesh(arcGeometry, lineMaterial);
  rightThreePoint.castShadow = true;
  rightThreePoint.receiveShadow = true;
  rightThreePoint.rotation.x = -Math.PI / 2;
  rightThreePoint.rotation.z = Math.PI / 2;
  rightThreePoint.position.set(rightArcX, 0.11, 0);
  scene.add(rightThreePoint);

  // FREE THROW CIRCLES
  const freeThrowGeometry = new THREE.RingGeometry(FREE_THROW_CIRCLE_RADIUS - 0.025, FREE_THROW_CIRCLE_RADIUS + 0.025, 64, 64, 0, Math.PI);
  const leftKeyCircle = new THREE.Mesh(freeThrowGeometry, lineMaterial);
  leftKeyCircle.castShadow = true;
  leftKeyCircle.receiveShadow = true;
  leftKeyCircle.rotation.x = -Math.PI / 2;
  leftKeyCircle.rotation.z = -Math.PI / 2;
  leftKeyCircle.position.set(-14 + keyLength, 0.11, 0);
  scene.add(leftKeyCircle);
  const rightKeyCircle = new THREE.Mesh(freeThrowGeometry, lineMaterial);
  rightKeyCircle.castShadow = true;
  rightKeyCircle.receiveShadow = true;
  rightKeyCircle.rotation.x = -Math.PI / 2;
  rightKeyCircle.rotation.z = Math.PI / 2;
  rightKeyCircle.position.set(14 - keyLength, 0.11, 0);
  scene.add(rightKeyCircle);

  const dashedSegments = 16;
  const totalAngle = Math.PI; 
  const dashAngle = totalAngle / (dashedSegments * 2); 
  const dashGap = dashAngle; 

  for (let i = 0; i < dashedSegments; i++) {
    const startAngle = i * (dashAngle + dashGap);
    const dashGeometry = new THREE.RingGeometry(FREE_THROW_CIRCLE_RADIUS - 0.025, FREE_THROW_CIRCLE_RADIUS + 0.025, 32, 1, startAngle, dashAngle);
    const dash = new THREE.Mesh(dashGeometry, lineMaterial);
    dash.rotation.x = -Math.PI / 2;
    dash.rotation.z = Math.PI / 2;
    dash.position.set(-14 + keyLength, 0.1, 0);
    scene.add(dash);
  }
  // RIGHT SIDE
  for (let i = 0; i < dashedSegments; i++) {
    const startAngle = i * (dashAngle + dashGap);
    const dashGeometry = new THREE.RingGeometry(FREE_THROW_CIRCLE_RADIUS - 0.025, FREE_THROW_CIRCLE_RADIUS + 0.025, 32, 1, startAngle, dashAngle);
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
  leftKeyTop.castShadow = true;
  leftKeyTop.receiveShadow = true;
  leftKeyTop.position.set(-14 + keyLength / 2, 0.11, keyWidth / 2);
  scene.add(leftKeyTop);
  const leftKeyBottom = new THREE.Mesh(keyTopGeometry, lineMaterial);
  leftKeyBottom.castShadow = true;
  leftKeyBottom.receiveShadow = true;
  leftKeyBottom.position.set(-14 + keyLength / 2, 0.11, -keyWidth / 2);
  scene.add(leftKeyBottom);
  const leftKeyFarSide = new THREE.Mesh(keySideGeometry, lineMaterial);
  leftKeyFarSide.castShadow = true;
  leftKeyFarSide.receiveShadow = true;
  leftKeyFarSide.position.set(-14 + keyLength, 0.11, 0);
  scene.add(leftKeyFarSide);
  // RIGHT key
  const rightKeyTop = new THREE.Mesh(keyTopGeometry, lineMaterial);
  rightKeyTop.castShadow = true;
  rightKeyTop.receiveShadow = true;
  rightKeyTop.position.set(14 - keyLength / 2, 0.11, keyWidth / 2);
  scene.add(rightKeyTop);
  const rightKeyBottom = new THREE.Mesh(keyTopGeometry, lineMaterial);
  rightKeyBottom.castShadow = true;
  rightKeyBottom.receiveShadow = true;
  rightKeyBottom.position.set(14 - keyLength / 2, 0.11, -keyWidth / 2);
  scene.add(rightKeyBottom);
  const rightKeyFarSide = new THREE.Mesh(keySideGeometry, lineMaterial);
  rightKeyFarSide.castShadow = true;
  rightKeyFarSide.receiveShadow = true;
  rightKeyFarSide.position.set(14 - keyLength, 0.11, 0);
  scene.add(rightKeyFarSide);

  // COURT BOUNDARY LINES (Sidelines and Baselines)
  const COURT_LENGTH = 28;
  const boundaryLineWidth = 0.07;
  const boundaryLineHeight = 0.02;
  const boundaryY = 0.11; 
  // Side boundaries (long sides)
  const sideBoundaryGeometry = new THREE.BoxGeometry(COURT_LENGTH, boundaryLineHeight, boundaryLineWidth);
  const topBoundary = new THREE.Mesh(sideBoundaryGeometry, lineMaterial);
  topBoundary.castShadow = true;
  topBoundary.receiveShadow = true;
  topBoundary.position.set(0, boundaryY, COURT_WIDTH / 2);
  scene.add(topBoundary);
  const bottomBoundary = new THREE.Mesh(sideBoundaryGeometry, lineMaterial);
  bottomBoundary.castShadow = true;
  bottomBoundary.receiveShadow = true;
  bottomBoundary.position.set(0, boundaryY, -COURT_WIDTH / 2);
  scene.add(bottomBoundary);
  // End boundaries (short sides)
  const endBoundaryGeometry = new THREE.BoxGeometry(boundaryLineWidth, boundaryLineHeight, COURT_WIDTH);
  const leftBoundary = new THREE.Mesh(endBoundaryGeometry, lineMaterial);
  leftBoundary.castShadow = true;
  leftBoundary.receiveShadow = true;
  leftBoundary.position.set(-COURT_LENGTH / 2, boundaryY, 0);
  scene.add(leftBoundary);
  const rightBoundary = new THREE.Mesh(endBoundaryGeometry, lineMaterial);
  rightBoundary.castShadow = true;
  rightBoundary.receiveShadow = true;
  rightBoundary.position.set(COURT_LENGTH / 2, boundaryY, 0);
  scene.add(rightBoundary);

}

// Global basketball group and movement state
let basketballGroup = null;
let basketball = null;
let basketballVelocity = { x: 0, z: 0 };
const BASKETBALL_RADIUS = 0.12; 
const COURT_HALF_LENGTH = 14; 
const COURT_HALF_WIDTH = 7.5; 
const BASKETBALL_Y = 2 + BASKETBALL_RADIUS;  
const BASKETBALL_SPEED = 6; 
const BASKETBALL_DAMPING = 0.85; 
const BASKETBALL_EPSILON = 0.001;
let keyState = { left: false, right: false, up: false, down: false };

// Shot power state
let shotPower = 0.5; // Start at 50%
const SHOT_POWER_MIN = 0.0;
const SHOT_POWER_MAX = 1.0;
const SHOT_POWER_STEP = 0.01;

// Physics and shooting state
let isShooting = false;
let ballPhysicsVelocity = { x: 0, y: 0, z: 0 };
const GRAVITY = -9.8;
const SHOT_BASE_SPEED = 12;
const RIM_POSITIONS = [
  { x: -14 + 0.225 + 0.05, y: 3.05, z: 0 }, // Left rim
  { x: 14 - 0.225 - 0.05, y: 3.05, z: 0 }   // Right rim
];

// Create power meter UI
const powerMeterContainer = document.createElement('div');
powerMeterContainer.className = 'power-meter-container';
const powerMeterBar = document.createElement('div');
powerMeterBar.className = 'power-meter-bar';
powerMeterBar.style.width = (shotPower * 100) + '%'; 
const powerMeterLabel = document.createElement('span');
powerMeterLabel.className = 'power-meter-label';
powerMeterLabel.innerText = 'Power: ' + Math.round(shotPower * 100) + '%';
powerMeterContainer.appendChild(powerMeterBar);
powerMeterContainer.appendChild(powerMeterLabel);
document.body.appendChild(powerMeterContainer);

function updatePowerMeter() {
  powerMeterBar.style.width = (shotPower * 100) + '%';
  powerMeterLabel.innerText = 'Power: ' + Math.round(shotPower * 100) + '%';
}

function createBasketball() {
  const textureLoader = new THREE.TextureLoader();
  const basketballTexture = textureLoader.load('./src/basketball_texture.jpg');
  const ballGeometry = new THREE.SphereGeometry(BASKETBALL_RADIUS, 64, 64);
  const ballMaterial = new THREE.MeshPhongMaterial({
    map: basketballTexture, shininess: 50, specular: 0x333333
  });
  basketballGroup = new THREE.Group();
  basketball = new THREE.Mesh(ballGeometry, ballMaterial);
  basketball.position.set(0, 0, 0); // center of group
  basketball.castShadow = true;
  basketball.receiveShadow = true;
  basketballGroup.add(basketball);
  const seamMaterial = new THREE.LineBasicMaterial({color: 0x000000});
  const verticalSeamCount = 2;
  for (let j = 0; j < verticalSeamCount; j++) {
    const angleOffset = (j / verticalSeamCount) * Math.PI;
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(BASKETBALL_RADIUS, 0.005, 8, 100, Math.PI * 2),
      new THREE.MeshPhongMaterial({color: 0x000000})
    );
    torus.rotation.y = angleOffset;
    torus.castShadow = true;
    torus.receiveShadow = true;
    torus.position.set(0, 0, 0); // relative to group center
    basketballGroup.add(torus);
  }
  const horizontalTorus = new THREE.Mesh(
    new THREE.TorusGeometry(BASKETBALL_RADIUS, 0.005, 8, 100),
    new THREE.MeshPhongMaterial({color: 0x000000})
  );
  horizontalTorus.rotation.x = Math.PI / 2;
  horizontalTorus.castShadow = true;
  horizontalTorus.receiveShadow = true;
  horizontalTorus.position.set(0, 0, 0);
  basketballGroup.add(horizontalTorus);
  basketballGroup.position.set(0, BASKETBALL_Y, 0);
  scene.add(basketballGroup);
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
  const seatMaterial = new THREE.MeshPhongMaterial({color: 0x3B5AA3, shininess: 20});
  for (let row = 0; row < bleacherRows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const geometry = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth);
      const mesh = new THREE.Mesh(geometry, seatMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
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
  const seatMaterial = new THREE.MeshPhongMaterial({color: 0x3B5AA3, shininess: 20});

  for (let row = 0; row < bleacherRows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const geometry = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth);
      const mesh = new THREE.Mesh(geometry, seatMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const x = startX + seat * (seatWidth + 0.05);
      const y = row * seatHeight;
      const z = startZ - row * (seatDepth + 0.1); 
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

function createStadiumScoreboard() {
  const canvas = Object.assign(document.createElement('canvas'), {width: 1024, height: 256});
  const ctx = canvas.getContext('2d');
  let textures = [];

  const drawScore = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background and frame
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#1a1a1a');
    grad.addColorStop(0.5, '#0a0a0a');
    grad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    // Main score
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 80px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`HOME ${homeScore} - ${guestScore} GUEST`, canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;

    // Refresh textures
    textures.forEach(tex => tex.needsUpdate = true);
  };

  // Initialize
  drawScore();
  const geo = new THREE.PlaneGeometry(12, 3);
  const createBoardPair = (zPos, frontRot, backRot) => {
    const tex1 = new THREE.CanvasTexture(canvas);
    const tex2 = new THREE.CanvasTexture(canvas);
    textures.push(tex1, tex2);
    [tex1, tex2].forEach(t => {
      t.magFilter = t.minFilter = THREE.LinearFilter;
    });

    const makeBoard = (tex, rotY) => {
      const mat = new THREE.MeshBasicMaterial({map: tex, side: THREE.FrontSide});
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(0, 10, zPos);
      mesh.rotation.y = rotY;
      scene.add(mesh);
    };

    makeBoard(tex1, frontRot);
    makeBoard(tex2, backRot);
  };

  createBoardPair(-18, 0, Math.PI);
  createBoardPair(18, Math.PI, 0);

  const supportGeo = new THREE.CylinderGeometry(0.1, 0.1, 8);
  const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 10);
  const supportMat = new THREE.MeshBasicMaterial({color: 0x444444});

  [-18, 18].forEach(z => {
    [[-5, 6], [5, 6]].forEach(([x, y]) => {
      const s = new THREE.Mesh(supportGeo, supportMat);
      s.castShadow = true;
      s.receiveShadow = true;
      s.position.set(x, y, z);
      scene.add(s);
    });
    const beam = new THREE.Mesh(beamGeo, supportMat);
    beam.castShadow = true;
    beam.receiveShadow = true;
    beam.position.set(0, 2, z);
    beam.rotation.z = Math.PI / 2;
    scene.add(beam);
  });

  const prevUpdate = updateScoreboard;
  updateScoreboard = () => {
    prevUpdate();
    drawScore();
  };
}

createBasketballCourt(); 
createBasketball();
createBleachers();
createBleachersMirror();
updateScoreboard();
createStadiumScoreboard();


const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Instructions display
const instructionsElement = document.createElement('div');
instructionsElement.id = 'instructions-panel';
instructionsElement.style.position = 'absolute';
instructionsElement.innerHTML = `
  <h3>Controls:</h3>
  <ul>
    <li>O - Toggle Orbit Camera</li>
    <li>← → - Move left/right (HW06)</li>
    <li>↑ ↓ - Move forward/backward (HW06)</li>
    <li>W - - Move up (HW06)</li>
    <li>S - Move down (HW06)</li>
    <li>Spacebar - Shoot basketball (HW06)</li>
    <li>R - Reset ball position (HW06)</li>
  </ul>
`;
document.body.appendChild(instructionsElement);

function findNearestRim() {
  const ballPos = basketballGroup.position;
  let nearestRim = RIM_POSITIONS[0];
  let minDistance = ballPos.distanceTo(new THREE.Vector3(nearestRim.x, nearestRim.y, nearestRim.z));
  for (let i = 1; i < RIM_POSITIONS.length; i++) {
    const rim = RIM_POSITIONS[i];
    const distance = ballPos.distanceTo(new THREE.Vector3(rim.x, rim.y, rim.z));
    if (distance < minDistance) {
      minDistance = distance;
      nearestRim = rim;
    }
  }
  return nearestRim;
}

function calculateShotVelocity(targetRim, power) {
  const ballPos = basketballGroup.position;
  const dx = targetRim.x - ballPos.x;
  const dy = targetRim.y - ballPos.y;
  const dz = targetRim.z - ballPos.z;
  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
  // Calculate initial speed based on power
  const speed = SHOT_BASE_SPEED * (0.5 + power * 1.5);
  // Calculate time to reach the rim horizontally
  const t = horizontalDistance / speed;
  // Calculate required initial vertical velocity to reach the rim height
  const vy = (dy - 0.5 * GRAVITY * t * t) / t;
  // Normalize horizontal direction
  const norm = Math.sqrt(dx * dx + dz * dz);
  const vx = (dx / norm) * speed;
  const vz = (dz / norm) * speed;
  return { x: vx, y: vy, z: vz };
}

function shootBasketball() {
  if (isShooting) return;
  isShooting = true;
  const targetRim = findNearestRim();
  ballPhysicsVelocity = calculateShotVelocity(targetRim, shotPower);
  // Stop any existing movement
  basketballVelocity.x = 0;
  basketballVelocity.z = 0;
}

function resetBasketball() {
  isShooting = false;
  ballPhysicsVelocity = { x: 0, y: 0, z: 0 };
  basketballVelocity = { x: 0, z: 0 };
  basketballGroup.position.set(0, BASKETBALL_Y, 0);
  shotPower = 0.5;
  updatePowerMeter();
}

function checkRimCollision() {
  if (!isShooting) return false;
  const rim = findNearestRim();
  const dx = basketballGroup.position.x - rim.x;
  const dz = basketballGroup.position.z - rim.z;
  const dy = basketballGroup.position.y - rim.y;
  const distXZ = Math.sqrt(dx * dx + dz * dz);
  const rimThreshold = 0.04; // vertical tolerance
  if (distXZ < (0.225 + BASKETBALL_RADIUS)) {
    if (Math.abs(dy) < rimThreshold) {
      // Score!
      resetBasketball();
      return true;
    } else if (dy > -0.3 && dy < 0.3) {
      // Bounce off rim: reflect and dampen velocity
      const norm = Math.sqrt(dx * dx + dz * dz);
      if (norm > 0.0001) {
        const nx = dx / norm;
        const nz = dz / norm;
        // Reflect velocity in XZ
        const dot = ballPhysicsVelocity.x * nx + ballPhysicsVelocity.z * nz;
        ballPhysicsVelocity.x -= 2 * dot * nx;
        ballPhysicsVelocity.z -= 2 * dot * nz;
        ballPhysicsVelocity.x *= 0.5;
        ballPhysicsVelocity.z *= 0.5;
        ballPhysicsVelocity.y *= 0.7;
      }
    }
  }
  
  return false;
}

// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
  if (e.key === "ArrowLeft") keyState.left = true;
  if (e.key === "ArrowRight") keyState.right = true;
  if (e.key === "ArrowUp") keyState.up = true;
  if (e.key === "ArrowDown") keyState.down = true;
  // ADD THESE LINES:
  if (e.key === " " || e.code === "Space") {
    e.preventDefault();
    shootBasketball();
  }
  if (e.key === "r" || e.key === "R") {
    resetBasketball();
  }
  // Shot power control
  if (e.key === "w" || e.key === "W") {
    shotPower = Math.min(SHOT_POWER_MAX, shotPower + SHOT_POWER_STEP);
    updatePowerMeter();
  }
  if (e.key === "s" || e.key === "S") {
    shotPower = Math.max(SHOT_POWER_MIN, shotPower - SHOT_POWER_STEP);
    updatePowerMeter();
  }
}
function handleKeyUp(e) {
  if (e.key === "ArrowLeft") keyState.left = false;
  if (e.key === "ArrowRight") keyState.right = false;
  if (e.key === "ArrowUp") keyState.up = false;
  if (e.key === "ArrowDown") keyState.down = false;
}
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  controls.enabled = isOrbitEnabled;
  controls.update();
  // Basketball movement and physics
  if (basketballGroup) {
    const dt = 1 / 60;
    if (isShooting) {
      // Physics-based movement during shot
      ballPhysicsVelocity.y += GRAVITY * dt;
      basketballGroup.position.x += ballPhysicsVelocity.x * dt;
      basketballGroup.position.y += ballPhysicsVelocity.y * dt;
      basketballGroup.position.z += ballPhysicsVelocity.z * dt;
      // Rotate ball during flight for realism
      basketball.rotation.x += ballPhysicsVelocity.z * dt * 0.2;
      basketball.rotation.z -= ballPhysicsVelocity.x * dt * 0.2;
      // Rim collision/score check
      if (checkRimCollision()) {
        // Already handled in checkRimCollision
      } else {
        // --- Realistic ground bounce and rolling for missed shots ---
        let bounced = false;
        if (basketballGroup.position.y <= BASKETBALL_Y) {
          basketballGroup.position.y = BASKETBALL_Y;
          // If still moving down, bounce with energy loss
          if (ballPhysicsVelocity.y < 0) {
            ballPhysicsVelocity.y = Math.abs(ballPhysicsVelocity.y) * 0.35;
            ballPhysicsVelocity.x *= 0.7;
            ballPhysicsVelocity.z *= 0.7;
            bounced = true;
          }
          // If bounce is weak, stop vertical motion
          if (Math.abs(ballPhysicsVelocity.y) < 0.5) {
            ballPhysicsVelocity.y = 0;
          }
          // If all velocities are low, stop shooting mode
          if (Math.abs(ballPhysicsVelocity.y) < 0.2 && 
              Math.abs(ballPhysicsVelocity.x) < 0.2 && 
              Math.abs(ballPhysicsVelocity.z) < 0.2) {
            isShooting = false;
            ballPhysicsVelocity = { x: 0, y: 0, z: 0 };
          }
        }
        // Prevent ball from going below the court
        if (basketballGroup.position.y < BASKETBALL_Y) {
          basketballGroup.position.y = BASKETBALL_Y;
          ballPhysicsVelocity.y = 0;
        }
        // Out of bounds check (keep ball inside court)
        if (basketballGroup.position.x < -COURT_HALF_LENGTH + BASKETBALL_RADIUS) {
          basketballGroup.position.x = -COURT_HALF_LENGTH + BASKETBALL_RADIUS;
          ballPhysicsVelocity.x = -ballPhysicsVelocity.x * 0.5;
        }
        if (basketballGroup.position.x > COURT_HALF_LENGTH - BASKETBALL_RADIUS) {
          basketballGroup.position.x = COURT_HALF_LENGTH - BASKETBALL_RADIUS;
          ballPhysicsVelocity.x = -ballPhysicsVelocity.x * 0.5;
        }
        if (basketballGroup.position.z < -COURT_HALF_WIDTH + BASKETBALL_RADIUS) {
          basketballGroup.position.z = -COURT_HALF_WIDTH + BASKETBALL_RADIUS;
          ballPhysicsVelocity.z = -ballPhysicsVelocity.z * 0.5;
        }
        if (basketballGroup.position.z > COURT_HALF_WIDTH - BASKETBALL_RADIUS) {
          basketballGroup.position.z = COURT_HALF_WIDTH - BASKETBALL_RADIUS;
          ballPhysicsVelocity.z = -ballPhysicsVelocity.z * 0.5;
        }
        // --- Rolling friction after bounce ---
        if (basketballGroup.position.y === BASKETBALL_Y && ballPhysicsVelocity.y === 0) {
          ballPhysicsVelocity.x *= 0.92;
          ballPhysicsVelocity.z *= 0.92;
          if (Math.abs(ballPhysicsVelocity.x) < 0.01) ballPhysicsVelocity.x = 0;
          if (Math.abs(ballPhysicsVelocity.z) < 0.01) ballPhysicsVelocity.z = 0;
          // After any shot (hit or miss), reset when the ball comes to rest
          if (isShooting && ballPhysicsVelocity.x === 0 && ballPhysicsVelocity.z === 0) {
            resetBasketball();
          }
        }
      }
      // --- End realistic ground bounce and rolling ---
      // If shooting mode is over, transfer any remaining velocity to normal movement
      if (!isShooting && (Math.abs(ballPhysicsVelocity.x) > 0 || Math.abs(ballPhysicsVelocity.z) > 0)) {
        basketballVelocity.x = ballPhysicsVelocity.x;
        basketballVelocity.z = ballPhysicsVelocity.z;
        ballPhysicsVelocity = { x: 0, y: 0, z: 0 };
      }
    } else {
      // Normal movement when not shooting
      let moveX = 0, moveZ = 0;
      if (keyState.left) moveX -= 1;
      if (keyState.right) moveX += 1;
      if (keyState.up) moveZ += 1;
      if (keyState.down) moveZ -= 1;
      if (moveX !== 0 || moveZ !== 0) {
        const cameraDir = new THREE.Vector3();
        camera.getWorldDirection(cameraDir);
        cameraDir.y = 0;
        cameraDir.normalize();
        const right = new THREE.Vector3();
        right.crossVectors(cameraDir, new THREE.Vector3(0, 1, 0)).normalize();
        const moveDir = new THREE.Vector3();
        moveDir.addScaledVector(right, moveX);
        moveDir.addScaledVector(cameraDir, moveZ);
        moveDir.normalize();
        basketballVelocity.x = moveDir.x * BASKETBALL_SPEED;
        basketballVelocity.z = moveDir.z * BASKETBALL_SPEED;
      } else {
        basketballVelocity.x *= BASKETBALL_DAMPING;
        basketballVelocity.z *= BASKETBALL_DAMPING;
        if (Math.abs(basketballVelocity.x) < BASKETBALL_EPSILON) basketballVelocity.x = 0;
        if (Math.abs(basketballVelocity.z) < BASKETBALL_EPSILON) basketballVelocity.z = 0;
      }
      basketballGroup.position.x += basketballVelocity.x * dt;
      basketballGroup.position.z += basketballVelocity.z * dt;
      basketballGroup.position.x = Math.max(-COURT_HALF_LENGTH + BASKETBALL_RADIUS, 
                                           Math.min(COURT_HALF_LENGTH - BASKETBALL_RADIUS, basketballGroup.position.x));
      basketballGroup.position.z = Math.max(-COURT_HALF_WIDTH + BASKETBALL_RADIUS, 
                                           Math.min(COURT_HALF_WIDTH - BASKETBALL_RADIUS, basketballGroup.position.z));
    }
    // --- Add rolling friction for realistic stop ---
    if (!isShooting && basketballGroup.position.y === BASKETBALL_Y) {
      basketballVelocity.x *= 0.92; // strong friction
      basketballVelocity.z *= 0.92;
      if (Math.abs(basketballVelocity.x) < 0.01) basketballVelocity.x = 0;
      if (Math.abs(basketballVelocity.z) < 0.01) basketballVelocity.z = 0;
    }
    // --- End rolling friction ---
  }
  updatePowerMeter();
  renderer.render(scene, camera);
}

animate();