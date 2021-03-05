<script>
  import CrudStore from './CrudStore.svelte'
  import Map from './Map.svelte'
  import { gmapsReady } from './store'
  let ready = false
  gmapsReady.subscribe((val) => (ready = val))
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="flex flex-col space-y-2">
    <CrudStore />
  </div>
  <div class="flex flex-col space-y-2 col-span-full sm:col-span-1 lg:col-span-2">
    <!-- Map -->
    {#if ready}
      <Map />
    {/if}
  </div>
</div>
