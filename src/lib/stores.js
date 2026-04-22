import { derived, writable } from 'svelte/store';
import {
  advanceTrueAnomalyFixed,
  advanceTrueAnomalyKepler,
  ANIMATION_MODES,
  buildOrbitVisualization,
  calculateDerived,
  clampOrbitState,
  ELEMENT_LIMITS
} from './orbitMath.js';
import { dictionaries, SUPPORTED_LANGUAGES } from './i18n.js';

const defaultState = clampOrbitState({
  a: 12000,
  e: 0.22,
  iDeg: 52,
  raanDeg: 35,
  argPerigeeDeg: 45,
  trueAnomalyDeg: 35,
  showEarth: true,
  showEquatorialPlane: true,
  showOrbitalPlane: true,
  showAxes: true,
  showEarthAxis: true,
  showNodes: true,
  showPerigeeVector: true,
  showVelocityVector: true,
  animationPlaying: false,
  animationMode: ANIMATION_MODES.fixed.id,
  animationSpeed: 1,
  language: 'en',
  activeParameter: null,
  selectedPreset: null
});

function createOrbitStore() {
  const { subscribe, set, update } = writable(defaultState);

  return {
    subscribe,
    set: (state) => set(clampOrbitState({ ...defaultState, ...state })),
    reset: () => set(defaultState),
    setParameter: (key, rawValue) =>
      update((state) => {
        const value = Number(rawValue);
        return clampOrbitState({
          ...state,
          [key]: value,
          selectedPreset: null,
          activeParameter: key
        });
      }),
    setActiveParameter: (key) => update((state) => ({ ...state, activeParameter: key })),
    clearActiveParameter: () => update((state) => ({ ...state, activeParameter: null })),
    setAnimationPlaying: (playing) =>
      update((state) => ({ ...state, animationPlaying: Boolean(playing) })),
    setLanguage: (language) =>
      update((state) =>
        clampOrbitState({
          ...state,
          language
        })
      ),
    setAnimationMode: (mode) =>
      update((state) =>
        clampOrbitState({
          ...state,
          animationMode: mode,
          activeParameter: 'trueAnomalyDeg'
        })
      ),
    toggleLayer: (key) => update((state) => ({ ...state, [key]: !state[key] })),
    setLayer: (key, value) => update((state) => ({ ...state, [key]: Boolean(value) })),
    setAnimationSpeed: (rawValue) =>
      update((state) =>
        clampOrbitState({
          ...state,
          animationSpeed: Number(rawValue),
          activeParameter: 'trueAnomalyDeg'
        })
      ),
    advanceAnomaly: (deltaSeconds) =>
      update((state) => {
        if (!state.animationPlaying) return state;
        const nextAnomaly =
          state.animationMode === ANIMATION_MODES.kepler.id
            ? advanceTrueAnomalyKepler(state, deltaSeconds, state.animationSpeed)
            : advanceTrueAnomalyFixed(state.trueAnomalyDeg, deltaSeconds, state.animationSpeed);
        return clampOrbitState({
          ...state,
          trueAnomalyDeg: nextAnomaly,
          activeParameter: 'trueAnomalyDeg'
        });
      }),
    resetAnomaly: () =>
      update((state) =>
        clampOrbitState({
          ...state,
          trueAnomalyDeg: 0,
          animationPlaying: false,
          activeParameter: 'trueAnomalyDeg'
        })
      ),
    applyPreset: (preset) =>
      update((state) =>
        clampOrbitState({
          ...state,
          ...preset.elements,
          selectedPreset: preset.id,
          animationPlaying: false,
          activeParameter: null
        })
      )
  };
}

export const orbitState = createOrbitStore();

export const derivedInfo = derived(orbitState, ($orbitState) => calculateDerived($orbitState));

export const uiText = derived(
  orbitState,
  ($orbitState) => dictionaries[$orbitState.language] ?? dictionaries.zh
);

export const orbitVisualization = derived(orbitState, ($orbitState) =>
  buildOrbitVisualization($orbitState, 420)
);

export { ELEMENT_LIMITS };
export { ANIMATION_MODES };
export { SUPPORTED_LANGUAGES };
