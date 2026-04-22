<script>
  import OrbitScene from './lib/components/OrbitScene.svelte';
  import OrbitControlsPanel from './lib/components/OrbitControlsPanel.svelte';
  import DerivedInfoPanel from './lib/components/DerivedInfoPanel.svelte';
  import PresetPanel from './lib/components/PresetPanel.svelte';
  import { orbitState, SUPPORTED_LANGUAGES, uiText } from './lib/stores.js';
</script>

<main class="app-shell">
  <aside class="side-panel left-panel" aria-label={$uiText.app.parameterPanelAria}>
    <div class="top-toolbar">
      <img class="app-icon" src="/orbit-icon.svg" alt="" aria-hidden="true" />
      <label class="language-select">
        <span>{$uiText.app.language}</span>
        <select
          value={$orbitState.language}
          on:change={(event) => orbitState.setLanguage(event.currentTarget.value)}
        >
          {#each Object.entries(SUPPORTED_LANGUAGES) as [code, label]}
            <option value={code}>{label}</option>
          {/each}
        </select>
      </label>
    </div>

    <header class="brand">
      <p class="eyebrow">{$uiText.app.eyebrow}</p>
      <h1>{$uiText.app.title}</h1>
      <p>{$uiText.app.subtitle}</p>
    </header>
    <OrbitControlsPanel />
  </aside>

  <section class="scene-area" aria-label={$uiText.app.sceneAria}>
    <OrbitScene />
  </section>

  <aside class="side-panel right-panel" aria-label={$uiText.app.infoPanelAria}>
    <PresetPanel />
    <DerivedInfoPanel />
  </aside>
</main>
