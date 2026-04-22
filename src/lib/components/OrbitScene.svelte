<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { EARTH_RADIUS_KM, vectorLength } from '../orbitMath.js';
  import { orbitState, orbitVisualization, uiText } from '../stores.js';

  let container;

  let scene;
  let camera;
  let renderer;
  let controls;
  let resizeObserver;
  let frameId;

  let earthGroup;
  let earthAxisLine;
  let equatorialPlane;
  let orbitalPlane;
  let axesGroup;
  let orbitLine;
  let nodeLine;
  let perigeeLine;
  let radiusLine;
  let satelliteMesh;
  let perigeeMarker;
  let apogeeMarker;
  let velocityArrow;

  let currentState;
  let currentVisualization;
  let sceneExtent = 8;
  let lastFrameTime = 0;

  const origin = new THREE.Vector3(0, 0, 0);
  const zAxis = new THREE.Vector3(0, 0, 1);

  function kmToSceneVector(vector) {
    return new THREE.Vector3(
      vector[0] / EARTH_RADIUS_KM,
      vector[1] / EARTH_RADIUS_KM,
      vector[2] / EARTH_RADIUS_KM
    );
  }

  function makeLine(color, opacity = 1) {
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: opacity < 1,
      opacity
    });
    return new THREE.Line(new THREE.BufferGeometry(), material);
  }

  function setLinePoints(line, points) {
    line.geometry.setFromPoints(points);
    line.geometry.computeBoundingSphere();
  }

  function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b12);
    scene.fog = new THREE.Fog(0x070b12, 12, 34);

    camera = new THREE.PerspectiveCamera(45, 1, 0.01, 120);
    camera.up.set(0, 0, 1);
    camera.position.set(4.8, -6.8, 3.7);

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || 1, container.clientHeight || 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.4;
    controls.maxDistance = 48;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x9fb4d8, 1.05));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(4, -3, 5);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x67d9ff, 0.75);
    rim.position.set(-6, 4, -2);
    scene.add(rim);

    createEarth();
    createReferenceObjects();
    createOrbitObjects();

    resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(container);
    resizeRenderer();
  }

  function createEarth() {
    earthGroup = new THREE.Group();

    const earthGeometry = new THREE.SphereGeometry(1, 72, 36);
    earthGeometry.rotateX(Math.PI / 2);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f6feb,
      roughness: 0.78,
      metalness: 0.02,
      emissive: 0x041b33,
      emissiveIntensity: 0.45
    });
    earthGroup.add(new THREE.Mesh(earthGeometry, earthMaterial));

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x9fe8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    earthGroup.add(new THREE.Mesh(earthGeometry, wireMaterial));
    scene.add(earthGroup);

    earthAxisLine = makeLine(0xffdd66, 0.85);
    setLinePoints(earthAxisLine, [new THREE.Vector3(0, 0, -1.45), new THREE.Vector3(0, 0, 1.45)]);
    scene.add(earthAxisLine);
  }

  function createReferenceObjects() {
    const equatorMaterial = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.09,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    equatorialPlane = new THREE.Mesh(new THREE.CircleGeometry(1, 128), equatorMaterial);
    scene.add(equatorialPlane);

    const orbitalMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.11,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    orbitalPlane = new THREE.Mesh(new THREE.CircleGeometry(1, 128), orbitalMaterial);
    scene.add(orbitalPlane);

    axesGroup = new THREE.Group();
    axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 2.25, 0xff5d73, 0.16, 0.07));
    axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, 2.25, 0x3ddcff, 0.16, 0.07));
    axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, 2.25, 0xffdd66, 0.16, 0.07));
    scene.add(axesGroup);
  }

  function createOrbitObjects() {
    orbitLine = makeLine(0x45d9ff, 1);
    scene.add(orbitLine);

    nodeLine = makeLine(0x5dffb0, 0.92);
    scene.add(nodeLine);

    perigeeLine = makeLine(0xff9d4d, 0.92);
    scene.add(perigeeLine);

    radiusLine = makeLine(0xffffff, 0.36);
    scene.add(radiusLine);

    const satelliteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x36d3ff,
      emissiveIntensity: 1.1,
      roughness: 0.35
    });
    satelliteMesh = new THREE.Mesh(new THREE.SphereGeometry(0.085, 28, 16), satelliteMaterial);
    scene.add(satelliteMesh);

    perigeeMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 20, 12),
      new THREE.MeshBasicMaterial({ color: 0xff9d4d })
    );
    scene.add(perigeeMarker);

    apogeeMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 20, 12),
      new THREE.MeshBasicMaterial({ color: 0x75f0ff })
    );
    scene.add(apogeeMarker);

    velocityArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      origin,
      0.65,
      0xf6f871,
      0.16,
      0.07
    );
    scene.add(velocityArrow);
  }

  function updateSceneObjects(data) {
    if (!orbitLine || !data) return;

    const orbitPoints = data.orbitPoints.map(kmToSceneVector);
    setLinePoints(orbitLine, orbitPoints);

    sceneExtent = Math.max(
      2.4,
      data.orbitPoints.reduce((max, point) => Math.max(max, vectorLength(point) / EARTH_RADIUS_KM), 0) * 1.12
    );

    equatorialPlane.scale.set(sceneExtent, sceneExtent, 1);
    orbitalPlane.scale.set(sceneExtent, sceneExtent, 1);

    const normal = kmToSceneVector(data.orbitalNormalUnit).normalize();
    orbitalPlane.quaternion.setFromUnitVectors(zAxis, normal);

    const satellite = kmToSceneVector(data.satellitePosition);
    satelliteMesh.position.copy(satellite);
    setLinePoints(radiusLine, [origin, satellite]);

    const perigee = kmToSceneVector(data.perigeePosition);
    const apogee = kmToSceneVector(data.apogeePosition);
    perigeeMarker.position.copy(perigee);
    apogeeMarker.position.copy(apogee);
    setLinePoints(perigeeLine, [origin, perigee]);

    const nodeDirection = kmToSceneVector(data.ascendingNodeUnit).normalize().multiplyScalar(sceneExtent * 1.06);
    setLinePoints(nodeLine, [nodeDirection.clone().multiplyScalar(-1), nodeDirection]);

    const velocityDirection = kmToSceneVector(data.velocityVector).normalize();
    const speed = vectorLength(data.velocityVector);
    velocityArrow.position.copy(satellite);
    velocityArrow.setDirection(velocityDirection);
    velocityArrow.setLength(0.42 + Math.min(speed / 11, 1) * 0.58, 0.15, 0.07);

    updateVisibility();
    updateHighlights();
  }

  function updateVisibility() {
    if (!currentState || !earthGroup) return;
    earthGroup.visible = currentState.showEarth;
    earthAxisLine.visible = currentState.showEarthAxis;
    equatorialPlane.visible = currentState.showEquatorialPlane;
    orbitalPlane.visible = currentState.showOrbitalPlane;
    axesGroup.visible = currentState.showAxes;
    nodeLine.visible = currentState.showNodes;
    perigeeLine.visible = currentState.showPerigeeVector;
    perigeeMarker.visible = currentState.showPerigeeVector;
    apogeeMarker.visible = currentState.showPerigeeVector;
    velocityArrow.visible = currentState.showVelocityVector;
    radiusLine.visible = currentState.activeParameter === 'trueAnomalyDeg' || currentState.animationPlaying;
  }

  function updateHighlights() {
    if (!currentState || !orbitLine) return;
    const active = currentState.activeParameter;
    const shapeActive = active === 'a' || active === 'e';

    orbitLine.material.color.setHex(shapeActive ? 0xffcf5a : 0x45d9ff);
    orbitLine.material.opacity = shapeActive ? 1 : 0.9;

    equatorialPlane.material.opacity = active === 'iDeg' || active === 'raanDeg' ? 0.18 : 0.09;
    orbitalPlane.material.color.setHex(active === 'iDeg' ? 0xc4a2ff : 0x8b5cf6);
    orbitalPlane.material.opacity = active === 'iDeg' || active === 'raanDeg' ? 0.2 : 0.11;

    nodeLine.material.color.setHex(active === 'raanDeg' ? 0x8cffc8 : 0x5dffb0);
    nodeLine.material.opacity = active === 'raanDeg' ? 1 : 0.72;

    perigeeLine.material.color.setHex(active === 'argPerigeeDeg' ? 0xffbd72 : 0xff9d4d);
    perigeeLine.material.opacity = active === 'argPerigeeDeg' || shapeActive ? 1 : 0.68;

    radiusLine.material.opacity = active === 'trueAnomalyDeg' || currentState.animationPlaying ? 0.74 : 0.28;
    satelliteMesh.material.emissive.setHex(active === 'trueAnomalyDeg' ? 0xff7a45 : 0x36d3ff);
  }

  function resizeRenderer() {
    if (!renderer || !camera || !container) return;
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function setCameraView(view) {
    if (!camera || !controls) return;
    const distance = Math.max(sceneExtent * 1.45, 4);
    let direction = new THREE.Vector3(4.8, -6.8, 3.7).normalize();

    if (view === 'axis') direction = new THREE.Vector3(0, 0, 1);
    if (view === 'orbit' && currentVisualization) {
      direction = kmToSceneVector(currentVisualization.orbitalNormalUnit).normalize();
    }
    if (view === 'node' && currentVisualization) {
      direction = kmToSceneVector(currentVisualization.ascendingNodeUnit).normalize();
    }

    camera.up.set(0, 0, 1);
    if (Math.abs(direction.dot(zAxis)) > 0.96) camera.up.set(0, 1, 0);
    camera.position.copy(direction.multiplyScalar(distance));
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function renderLoop(time) {
    const delta = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.08) : 0;
    lastFrameTime = time;

    if (currentState?.animationPlaying) {
      orbitState.advanceAnomaly(delta);
    }

    controls?.update();
    renderer?.render(scene, camera);
    frameId = requestAnimationFrame(renderLoop);
  }

  onMount(() => {
    initScene();
    const unsubscribeState = orbitState.subscribe((state) => {
      currentState = state;
      updateVisibility();
      updateHighlights();
    });
    const unsubscribeVisualization = orbitVisualization.subscribe((data) => {
      currentVisualization = data;
      updateSceneObjects(data);
    });

    frameId = requestAnimationFrame(renderLoop);

    return () => {
      unsubscribeState();
      unsubscribeVisualization();
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      controls?.dispose();
      renderer?.dispose();
      renderer?.domElement?.remove();
    };
  });
</script>

<div class="scene-container" bind:this={container}>
  <div class="scene-toolbar" aria-label={$uiText.scene.cameraAria}>
    <button type="button" on:click={() => setCameraView('default')} title={$uiText.scene.defaultView}>
      3D
    </button>
    <button type="button" on:click={() => setCameraView('axis')} title={$uiText.scene.axisView}>Z</button>
    <button type="button" on:click={() => setCameraView('orbit')} title={$uiText.scene.orbitView}>
      Plane
    </button>
    <button type="button" on:click={() => setCameraView('node')} title={$uiText.scene.nodeView}>
      Node
    </button>
  </div>

  <div class="scene-legend" aria-label={$uiText.scene.legendAria}>
    <span><i class="orbit"></i>{$uiText.scene.legend.orbit}</span>
    <span><i class="equator"></i>{$uiText.scene.legend.equator}</span>
    <span><i class="plane"></i>{$uiText.scene.legend.plane}</span>
    <span><i class="perigee"></i>{$uiText.scene.legend.perigee}</span>
  </div>
</div>
