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
  court.castShadow = true;
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
  const armMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
  // Left support arm (extends from left pole towards court)
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(
      (-14 - poleDistanceBehindCourt) + (armLength / 2),
      3.05 + 0.5,
      0
  );
  leftArm.castShadow = true;
  leftArm.receiveShadow = true;
  scene.add(leftArm);
  // Right support arm (extends from right pole towards court)
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(
      (14 + poleDistanceBehindCourt) - (armLength / 2),
      3.05 + 0.5,
      0
  );
  rightArm.castShadow = true;
  rightArm.receiveShadow = true;
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
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const centerLineGeometry = new THREE.BoxGeometry(lineWidth, lineHeight, COURT_WIDTH);
  const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial);
  centerLine.position.set(0, 0.11, 0);  // slightly above court surface (0.2 court thickness + 0.01 gap)
  centerLine.castShadow = true;
  centerLine.receiveShadow = true;
  scene.add(centerLine);

  // Center circle
  const CENTER_CIRCLE_RADIUS = 1.8;  // standard size (1.8m radius)
  const centerCircleGeometry = new THREE.RingGeometry(
      CENTER_CIRCLE_RADIUS - 0.025,
      CENTER_CIRCLE_RADIUS + 0.025,
      64
  );
  const centerCircle = new THREE.Mesh(centerCircleGeometry, lineMaterial);
  centerCircle.castShadow = true;
  centerCircle.receiveShadow = true;
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
  const freeThrowGeometry = new THREE.RingGeometry(
      FREE_THROW_CIRCLE_RADIUS - 0.025, FREE_THROW_CIRCLE_RADIUS + 0.025, 64, 64, 0, Math.PI
  );
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
  const COURT_LENGTH = 28; // Full length of court (already used earlier for court floor)
  const boundaryLineWidth = 0.07;
  const boundaryLineHeight = 0.02;
  const boundaryY = 0.11; // same height as other lines
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
    const torus = new THREE.Mesh(
    new THREE.TorusGeometry(BASKETBALL_RADIUS, 0.005, 8, 100, Math.PI * 2),
    new THREE.MeshPhongMaterial({ color: 0x000000 })
  );
  torus.rotation.y = angleOffset;
  torus.castShadow = true;
  torus.receiveShadow = true;
  torus.position.copy(ball.position);
  scene.add(torus);
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
  const horizontalTorus = new THREE.Mesh(
  new THREE.TorusGeometry(BASKETBALL_RADIUS, 0.005, 8, 100),
  new THREE.MeshPhongMaterial({ color: 0x000000 })
);
horizontalTorus.rotation.x = Math.PI / 2;
horizontalTorus.castShadow = true;
horizontalTorus.receiveShadow = true;
horizontalTorus.position.copy(ball.position);
scene.add(horizontalTorus);
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
  const seatMaterial = new THREE.MeshPhongMaterial({ color:  0x3B5AA3 , shininess: 20 });

  for (let row = 0; row < bleacherRows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const geometry = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth);
      const mesh = new THREE.Mesh(geometry, seatMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
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

function createStadiumScoreboard() {
  const canvas = Object.assign(document.createElement('canvas'), { width: 1024, height: 256 });
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

    ctx.strokeStyle = '#333'; ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
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
    [tex1, tex2].forEach(t => { t.magFilter = t.minFilter = THREE.LinearFilter; });

    const makeBoard = (tex, rotY) => {
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide });
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
  const supportMat = new THREE.MeshBasicMaterial({ color: 0x444444 });

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

  // Wrap update
  const prevUpdate = updateScoreboard;
  updateScoreboard = () => {
    prevUpdate();
    drawScore();
  };
}

createBasketballCourt(); // Create all elements
createBasketball();
createBleachers();
createBleachersMirror();
updateScoreboard();
createStadiumScoreboard();


// Set camera position for better view
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