<script>
  import { presets } from '../data/presets.js';
  import { orbitState, uiText } from '../stores.js';
</script>

<section class="panel-section presets-panel">
  <div class="section-heading">
    <h2>{$uiText.presets.heading}</h2>
    <span>{$uiText.presets.subheading}</span>
  </div>

  <div class="preset-list">
    {#each presets as preset}
      {@const presetText = $uiText.presets.items[preset.id]}
      <button
        type="button"
        class:selected={$orbitState.selectedPreset === preset.id}
        on:click={() => orbitState.applyPreset(preset)}
      >
        <span>{presetText.label}</span>
        <strong>{presetText.name}</strong>
        <small>{presetText.description}</small>
      </button>
    {/each}
  </div>
</section>
