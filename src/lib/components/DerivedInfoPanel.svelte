<script>
  import { derivedInfo, orbitState, uiText } from '../stores.js';

  function km(value, decimals = 0) {
    return `${Number(value).toLocaleString('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    })} km`;
  }

  function kmPerSec(value) {
    return `${Number(value).toFixed(3)} km/s`;
  }

  function periodText(seconds) {
    const minutes = seconds / 60;
    const hours = minutes / 60;
    if (hours >= 1) return `${hours.toFixed(2)} h`;
    return `${minutes.toFixed(1)} min`;
  }

  $: metrics = [
    { key: 'rp', value: km($derivedInfo.rp) },
    { key: 'hp', value: km($derivedInfo.hp) },
    { key: 'ra', value: km($derivedInfo.ra) },
    { key: 'ha', value: km($derivedInfo.ha) },
    { key: 'periodSec', value: periodText($derivedInfo.periodSec) },
    { key: 'r', value: km($derivedInfo.r) },
    { key: 'speed', value: kmPerSec($derivedInfo.speed) },
    { key: 'p', value: km($derivedInfo.p) }
  ];

  $: activeParameter = $orbitState.activeParameter
    ? $uiText.parameters[$orbitState.activeParameter]
    : null;
</script>

<section class="panel-section info-panel">
  <div class="section-heading">
    <h2>{$uiText.derived.heading}</h2>
    <span>{$uiText.derived.subheading}</span>
  </div>

  <div class="tag-row" aria-label={$uiText.derived.orbitTypeAria}>
    {#each $derivedInfo.orbitTagKeys as tagKey}
      <span>{$uiText.orbitTags[tagKey]}</span>
    {/each}
  </div>

  <div class="metric-grid">
    {#each metrics as metric}
      <div class="metric-tile" class:danger={metric.key === 'hp' && $derivedInfo.hp < 0}>
        <span>{$uiText.derived.metrics[metric.key]}</span>
        <strong>{metric.value}</strong>
      </div>
    {/each}
  </div>

  {#if activeParameter}
    <div class="focus-note">
      <strong>{activeParameter.label} {activeParameter.symbol}</strong>
      <p>{activeParameter.highlight}</p>
    </div>
  {:else}
    <div class="focus-note muted">
      <strong>{$uiText.derived.focusTitle}</strong>
      <p>{$uiText.derived.focusBody}</p>
    </div>
  {/if}

  {#if $derivedInfo.warningKeys.length}
    <div class="warning-list" role="status">
      {#each $derivedInfo.warningKeys as warningKey}
        <p>{$uiText.warnings[warningKey]}</p>
      {/each}
    </div>
  {/if}
</section>
