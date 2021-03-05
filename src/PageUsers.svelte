<script>
  import CrudUser from './CrudUser.svelte'
  import InfoUser from './InfoUser.svelte'
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="flex flex-col space-y-2">
    <CrudUser />
  </div>
  <div class="flex flex-col space-y-2 col-span-full sm:col-span-1 lg:col-span-2">

    <InfoUser />
  </div>
</div>
