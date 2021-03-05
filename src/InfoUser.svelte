<script>
  import Fa from 'svelte-fa'
  import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
  import { currentUser } from './store'
  let user
  currentUser.subscribe((val) => {
    user = val
    if (user.device && user.device.length) {
      user.device = JSON.parse(user.device)
    }
  })
  /**
   * Toggles!
   */
  let showUserInfo = false
  let showUserCoupons = false
  let showAddCoupon = false
  function toggleUserInfo() {
    showUserInfo = !showUserInfo
  }
  function toggleCouponList() {
    showUserCoupons = !showUserCoupons
  }
  function toggleCouponAdd() {
    showAddCoupon = !showAddCoupon
  }
</script>

{#if user.id > 0}
  <div class="flex space-x-2 buttons">
    <button
      class="disabled:opacity-50 bg-gray-300 hover:bg-gray-200 border rounded-sm border-gray-400 px-2 flex items-center"
      on:click={toggleCouponList}
    >
      クーポン一覧
      {#if showUserCoupons}
        <Fa icon={faChevronDown} class="h-6 w-3 ml-3 text-blue-600 text-xs" />
      {:else}
        <Fa icon={faChevronRight} class="h-6 w-3 ml-3 text-xs" />
      {/if}
    </button>
  </div>
  {#if showUserCoupons}
    <div class="bg-gray-100 p-4 text-xs">
      <select name="" id="" style="width:200px" size=5/>
    </div>
  {/if}

  <!--  -->
  <!-- ADD COUPONS -->
  <!--  -->
  <div class="flex space-x-2 buttons">
    <button
      class="disabled:opacity-50 bg-gray-300 hover:bg-gray-200 border rounded-sm border-gray-400 px-2 flex items-center"
      on:click={toggleCouponAdd}
    >
      クーポン追加
      {#if showAddCoupon}
        <Fa icon={faChevronDown} class="h-6 w-3 ml-3 text-blue-600 text-xs" />
      {:else}
        <Fa icon={faChevronRight} class="h-6 w-3 ml-3 text-xs" />
      {/if}
    </button>
  </div>
  {#if showAddCoupon}
    <div class="bg-gray-100 p-4 text-xs">
      <select name="" id="" style="width:200px" />
      <button
        class="disabled:opacity-50 bg-gray-300 hover:bg-gray-200 border rounded-sm border-blue-600 px-2 flex items-center"
        >追加
      </button>
    </div>
  {/if}


    <!--  -->
  <!-- User INFO -->
  <!--  -->

  <div class="flex space-x-2 buttons">
    <button
      class="disabled:opacity-50 bg-gray-300 hover:bg-gray-200 border rounded-sm border-gray-400 px-2 flex items-center"
      on:click={toggleUserInfo}
    >
      ユーザー情報
      {#if showUserInfo}
        <Fa icon={faChevronDown} class="h-6 w-3 ml-3 text-blue-600 text-xs" />
      {:else}
        <Fa icon={faChevronRight} class="h-6 w-3 ml-3 text-xs" />
      {/if}
    </button>
  </div>
  {#if showUserInfo}
    <div class="bg-gray-100 p-4 text-xs">
      <pre>{JSON.stringify(user,null, 2)}</pre>
    </div>
  {/if}
{/if}

<style>
</style>
