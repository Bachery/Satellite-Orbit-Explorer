export const EARTH_RADIUS_KM = 6378;
export const EARTH_MU_KM3_S2 = 398600.4418;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;
export const FIXED_ANGULAR_RATE_DEG_S = 10;

export const ANIMATION_MODES = {
  fixed: {
    id: 'fixed'
  },
  kepler: {
    id: 'kepler'
  }
};

export const ELEMENT_LIMITS = {
  a: { min: 6678, max: 50000, step: 10, unit: 'km', decimals: 0 },
  e: { min: 0, max: 0.85, step: 0.001, unit: '', decimals: 3 },
  iDeg: { min: 0, max: 180, step: 0.1, unit: 'deg', decimals: 1 },
  raanDeg: { min: 0, max: 360, step: 0.1, unit: 'deg', decimals: 1 },
  argPerigeeDeg: { min: 0, max: 360, step: 0.1, unit: 'deg', decimals: 1 },
  trueAnomalyDeg: { min: 0, max: 360, step: 0.1, unit: 'deg', decimals: 1 },
  animationSpeed: { min: 0.1, max: 12, step: 0.1, unit: 'x', decimals: 1 },
  keplerAnimationSpeed: { min: 1, max: 1000, step: 1, unit: 'x', decimals: 0 }
};

export function getAnimationSpeedLimit(animationMode) {
  return animationMode === ANIMATION_MODES.kepler.id
    ? ELEMENT_LIMITS.keplerAnimationSpeed
    : ELEMENT_LIMITS.animationSpeed;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

export function normalizeAngleDeg(value) {
  const number = Number.isFinite(value) ? value : 0;
  return ((number % 360) + 360) % 360;
}

export function normalizeAngleRad(value) {
  const number = Number.isFinite(value) ? value : 0;
  return ((number % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

export function degToRad(deg) {
  return deg * DEG_TO_RAD;
}

export function radToDeg(rad) {
  return rad * RAD_TO_DEG;
}

export function clampOrbitState(state) {
  const animationMode = ANIMATION_MODES[state.animationMode]?.id ?? ANIMATION_MODES.fixed.id;
  const animationSpeedLimit = getAnimationSpeedLimit(animationMode);

  return {
    ...state,
    a: clamp(Number(state.a), ELEMENT_LIMITS.a.min, ELEMENT_LIMITS.a.max),
    e: clamp(Number(state.e), ELEMENT_LIMITS.e.min, ELEMENT_LIMITS.e.max),
    iDeg: clamp(Number(state.iDeg), ELEMENT_LIMITS.iDeg.min, ELEMENT_LIMITS.iDeg.max),
    raanDeg: normalizeAngleDeg(Number(state.raanDeg)),
    argPerigeeDeg: normalizeAngleDeg(Number(state.argPerigeeDeg)),
    trueAnomalyDeg: normalizeAngleDeg(Number(state.trueAnomalyDeg)),
    language: state.language === 'zh' ? 'zh' : 'en',
    animationMode,
    animationSpeed: clamp(
      Number(state.animationSpeed),
      animationSpeedLimit.min,
      animationSpeedLimit.max
    )
  };
}

function rotateZ([x, y, z], angleRad) {
  const c = Math.cos(angleRad);
  const s = Math.sin(angleRad);
  return [c * x - s * y, s * x + c * y, z];
}

function rotateX([x, y, z], angleRad) {
  const c = Math.cos(angleRad);
  const s = Math.sin(angleRad);
  return [x, c * y - s * z, s * y + c * z];
}

export function transformPerifocalToEci(vector, elements) {
  const afterArgument = rotateZ(vector, degToRad(elements.argPerigeeDeg));
  const afterInclination = rotateX(afterArgument, degToRad(elements.iDeg));
  return rotateZ(afterInclination, degToRad(elements.raanDeg));
}

export function getSemiLatusRectum(elements) {
  return elements.a * (1 - elements.e ** 2);
}

export function getRadiusAtTrueAnomaly(elements, trueAnomalyDeg = elements.trueAnomalyDeg) {
  const nu = degToRad(trueAnomalyDeg);
  const p = getSemiLatusRectum(elements);
  return p / (1 + elements.e * Math.cos(nu));
}

export function getPositionAtTrueAnomaly(elements, trueAnomalyDeg = elements.trueAnomalyDeg) {
  const nu = degToRad(trueAnomalyDeg);
  const r = getRadiusAtTrueAnomaly(elements, trueAnomalyDeg);
  const perifocal = [r * Math.cos(nu), r * Math.sin(nu), 0];
  return transformPerifocalToEci(perifocal, elements);
}

export function getVelocityAtTrueAnomaly(elements, trueAnomalyDeg = elements.trueAnomalyDeg) {
  const nu = degToRad(trueAnomalyDeg);
  const p = getSemiLatusRectum(elements);
  const factor = Math.sqrt(EARTH_MU_KM3_S2 / p);
  const perifocal = [-factor * Math.sin(nu), factor * (elements.e + Math.cos(nu)), 0];
  return transformPerifocalToEci(perifocal, elements);
}

export function getMeanMotionRadS(elements) {
  return Math.sqrt(EARTH_MU_KM3_S2 / elements.a ** 3);
}

export function getEccentricAnomalyFromTrueAnomaly(e, trueAnomalyDeg) {
  if (e < 1e-9) return degToRad(normalizeAngleDeg(trueAnomalyDeg));
  const nu = degToRad(trueAnomalyDeg);
  const sinHalf = Math.sin(nu / 2);
  const cosHalf = Math.cos(nu / 2);
  return normalizeAngleRad(2 * Math.atan2(Math.sqrt(1 - e) * sinHalf, Math.sqrt(1 + e) * cosHalf));
}

export function getMeanAnomalyFromTrueAnomaly(elements, trueAnomalyDeg = elements.trueAnomalyDeg) {
  const eccentricAnomaly = getEccentricAnomalyFromTrueAnomaly(elements.e, trueAnomalyDeg);
  return normalizeAngleRad(eccentricAnomaly - elements.e * Math.sin(eccentricAnomaly));
}

export function solveEccentricAnomaly(meanAnomalyRad, e) {
  const normalizedMeanAnomaly = normalizeAngleRad(meanAnomalyRad);
  if (e < 1e-9) return normalizedMeanAnomaly;

  let eccentricAnomaly = e < 0.8 ? normalizedMeanAnomaly : Math.PI;
  for (let iteration = 0; iteration < 10; iteration += 1) {
    const residual = eccentricAnomaly - e * Math.sin(eccentricAnomaly) - normalizedMeanAnomaly;
    const derivative = 1 - e * Math.cos(eccentricAnomaly);
    eccentricAnomaly -= residual / derivative;
  }

  return normalizeAngleRad(eccentricAnomaly);
}

export function getTrueAnomalyFromMeanAnomaly(e, meanAnomalyRad) {
  const eccentricAnomaly = solveEccentricAnomaly(meanAnomalyRad, e);
  if (e < 1e-9) return normalizeAngleDeg(radToDeg(eccentricAnomaly));

  const sinHalf = Math.sin(eccentricAnomaly / 2);
  const cosHalf = Math.cos(eccentricAnomaly / 2);
  const trueAnomalyRad =
    2 * Math.atan2(Math.sqrt(1 + e) * sinHalf, Math.sqrt(1 - e) * cosHalf);
  return normalizeAngleDeg(radToDeg(trueAnomalyRad));
}

export function advanceTrueAnomalyFixed(trueAnomalyDeg, deltaSeconds, animationSpeed) {
  return normalizeAngleDeg(
    trueAnomalyDeg + deltaSeconds * FIXED_ANGULAR_RATE_DEG_S * animationSpeed
  );
}

export function advanceTrueAnomalyKepler(elements, deltaSeconds, animationSpeed) {
  const currentMeanAnomaly = getMeanAnomalyFromTrueAnomaly(elements);
  const nextMeanAnomaly =
    currentMeanAnomaly + getMeanMotionRadS(elements) * deltaSeconds * animationSpeed;
  return getTrueAnomalyFromMeanAnomaly(elements.e, nextMeanAnomaly);
}

export function generateOrbitPoints(elements, samples = 384) {
  const points = [];
  for (let index = 0; index <= samples; index += 1) {
    const trueAnomalyDeg = (index / samples) * 360;
    points.push(getPositionAtTrueAnomaly(elements, trueAnomalyDeg));
  }
  return points;
}

export function vectorLength([x, y, z]) {
  return Math.sqrt(x * x + y * y + z * z);
}

export function unitVector(vector) {
  const length = vectorLength(vector);
  if (length < 1e-9) return [0, 0, 0];
  return vector.map((value) => value / length);
}

export function scaleVector(vector, scalar) {
  return vector.map((value) => value * scalar);
}

export function calculateDerived(elements) {
  const p = getSemiLatusRectum(elements);
  const r = getRadiusAtTrueAnomaly(elements);
  const rp = elements.a * (1 - elements.e);
  const ra = elements.a * (1 + elements.e);
  const hp = rp - EARTH_RADIUS_KM;
  const ha = ra - EARTH_RADIUS_KM;
  const periodSec = 2 * Math.PI * Math.sqrt(elements.a ** 3 / EARTH_MU_KM3_S2);
  const speed = Math.sqrt(EARTH_MU_KM3_S2 * (2 / r - 1 / elements.a));

  const orbitTagKeys = [];
  if (elements.e < 0.005) orbitTagKeys.push('nearCircular');
  else if (elements.e > 0.5) orbitTagKeys.push('highEccentric');
  else orbitTagKeys.push('elliptic');

  if (elements.iDeg < 5 || elements.iDeg > 175) orbitTagKeys.push('nearEquatorial');
  if (Math.abs(elements.iDeg - 90) < 5) orbitTagKeys.push('nearPolar');
  if (hp < 0) orbitTagKeys.push('intersectsEarth');

  const warningKeys = [];
  if (elements.e < 0.001) {
    warningKeys.push('circularArgPerigee');
  }
  if (elements.iDeg < 0.1 || Math.abs(elements.iDeg - 180) < 0.1) {
    warningKeys.push('equatorialRaan');
  }
  if (hp < 0) {
    warningKeys.push('insideEarth');
  }

  return {
    p,
    r,
    rp,
    ra,
    hp,
    ha,
    periodSec,
    speed,
    orbitTagKeys,
    warningKeys
  };
}

export function buildOrbitVisualization(elements, samples = 384) {
  const orbitPoints = generateOrbitPoints(elements, samples);
  const satellitePosition = getPositionAtTrueAnomaly(elements);
  const velocityVector = getVelocityAtTrueAnomaly(elements);
  const perigeePosition = getPositionAtTrueAnomaly(elements, 0);
  const apogeePosition = getPositionAtTrueAnomaly(elements, 180);
  const ascendingNodeUnit = [Math.cos(degToRad(elements.raanDeg)), Math.sin(degToRad(elements.raanDeg)), 0];
  const orbitalNormalUnit = unitVector(transformPerifocalToEci([0, 0, 1], elements));

  return {
    orbitPoints,
    satellitePosition,
    velocityVector,
    perigeePosition,
    apogeePosition,
    ascendingNodeUnit,
    orbitalNormalUnit
  };
}
