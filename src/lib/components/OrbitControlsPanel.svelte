<script>
  import { ANIMATION_MODES, ELEMENT_LIMITS, orbitState, uiText } from '../stores.js';

  const parameterControls = [
    { key: 'a' },
    { key: 'e' },
    { key: 'iDeg' },
    { key: 'raanDeg' },
    { key: 'argPerigeeDeg' },
    { key: 'trueAnomalyDeg' }
  ];

  const layerToggles = [
    { key: 'showEarth' },
    { key: 'showEarthAxis' },
    { key: 'showEquatorialPlane' },
    { key: 'showOrbitalPlane' },
    { key: 'showAxes' },
    { key: 'showNodes' },
    { key: 'showPerigeeVector' },
    { key: 'showVelocityVector' }
  ];

  const animationModeKeys = [ANIMATION_MODES.fixed.id, ANIMATION_MODES.kepler.id];

  function displayValue(key, value) {
    const decimals = ELEMENT_LIMITS[key].decimals;
    return Number(value).toFixed(decimals);
  }

  function updateParameter(key, event) {
    orbitState.setParameter(key, event.currentTarget.value);
  }
</script>

<div class="control-stack">
  <section class="panel-section">
    <div class="section-heading">
      <h2>{$uiText.parametersHeading}</h2>
      <span>{$uiText.realtime}</span>
    </div>

    {#each parameterControls as control}
      {@const limits = ELEMENT_LIMITS[control.key]}
      {@const parameter = $uiText.parameters[control.key]}
      {@const isActive = $orbitState.activeParameter === control.key}
      <div class="control-row" class:active={isActive}>
        <div class="control-label">
          <div>
            <strong>{parameter.symbol}</strong>
            <span>{parameter.label}</span>
          </div>
          <p>{parameter.description}</p>
        </div>

        <div class="control-inputs">
          <input
            aria-label={parameter.label}
            type="range"
            min={limits.min}
            max={limits.max}
            step={limits.step}
            value={$orbitState[control.key]}
            on:focus={() => orbitState.setActiveParameter(control.key)}
            on:pointerdown={() => orbitState.setActiveParameter(control.key)}
            on:input={(event) => updateParameter(control.key, event)}
          />

          <label class="number-field">
            <input
              type="number"
              min={limits.min}
              max={limits.max}
              step={limits.step}
              value={displayValue(control.key, $orbitState[control.key])}
              on:focus={() => orbitState.setActiveParameter(control.key)}
              on:input={(event) => updateParameter(control.key, event)}
            />
            <span>{limits.unit}</span>
          </label>
        </div>
      </div>
    {/each}
  </section>

  <section class="panel-section compact">
    <div class="section-heading">
      <h2>{$uiText.animation.heading}</h2>
      <span>
        {$orbitState.animationMode === ANIMATION_MODES.kepler.id
          ? $uiText.animation.statusKepler
          : $uiText.animation.statusFixed}
      </span>
    </div>

    <div class="mode-toggle" role="group" aria-label={$uiText.animation.modeAria}>
      {#each animationModeKeys as modeId}
        {@const mode = $uiText.animation.modes[modeId]}
        <button
          type="button"
          class:selected={$orbitState.animationMode === modeId}
          aria-pressed={$orbitState.animationMode === modeId}
          on:click={() => orbitState.setAnimationMode(modeId)}
        >
          <strong>{mode.label}</strong>
          <span>{mode.description}</span>
        </button>
      {/each}
    </div>

    <div class="button-row">
      <button
        class="command-button primary"
        type="button"
        on:click={() => orbitState.setAnimationPlaying(!$orbitState.animationPlaying)}
      >
        {$orbitState.animationPlaying ? $uiText.animation.pause : $uiText.animation.play}
      </button>
      <button class="command-button" type="button" on:click={() => orbitState.resetAnomaly()}>
        {$uiText.animation.reset}
      </button>
    </div>

    <label class="speed-control">
      <span>{$uiText.animation.speed} {$orbitState.animationSpeed.toFixed(1)}x</span>
      <input
        type="range"
        min={ELEMENT_LIMITS.animationSpeed.min}
        max={ELEMENT_LIMITS.animationSpeed.max}
        step={ELEMENT_LIMITS.animationSpeed.step}
        value={$orbitState.animationSpeed}
        on:input={(event) => orbitState.setAnimationSpeed(event.currentTarget.value)}
      />
    </label>

    {#if $orbitState.animationMode === ANIMATION_MODES.kepler.id}
      <div class="formula-note">
        <strong>{$uiText.animation.formula}</strong>
        <span>{$uiText.animation.formulaNote}</span>
      </div>
    {/if}
  </section>

  <section class="panel-section compact">
    <div class="section-heading">
      <h2>{$uiText.layers.heading}</h2>
      <span>{$uiText.layers.subheading}</span>
    </div>

    <div class="toggle-grid">
      {#each layerToggles as toggle}
        <button
          type="button"
          class:enabled={$orbitState[toggle.key]}
          aria-pressed={$orbitState[toggle.key]}
          on:click={() => orbitState.toggleLayer(toggle.key)}
        >
          <span></span>
          {$uiText.layers[toggle.key]}
        </button>
      {/each}
    </div>
  </section>
</div>
