<script>
  import Router, { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
  import wrap from 'svelte-spa-router/wrap'

  import Tailwindcss from './Tailwindcss.svelte'
  // Pages
  import PageUsers from './PageUsers.svelte'
  import PageUser from './PageUser.svelte'
  import PageHome from './PageHome.svelte'
  import PageBlueprints from './PageBlueprints.svelte'
  import PageBlueprint from './PageBlueprint.svelte'

  import { gmapsReady } from './store'
  const routes = {
    '/': PageHome,
    '/users': PageUsers,
    '/users/:id': PageUser,
    '/blueprints': PageBlueprints,
    '/blueprints/:id': PageBlueprint,
    '/stores': wrap({
      asyncComponent: () => import('./PageStores.svelte'),
    }),
  }
</script>

<main>
  <Tailwindcss />
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto">
      <div class="relative flex items-center justify-between h-10">
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex space-x-4">
            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
            <a
              href="/"
              use:link
              use:active={{ className: 'bg-gray-600' }}
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-1 rounded-sm text-sm font-medium"
              >ダウンロード</a
            >
            <a
              href="/users"
              use:link
              use:active={{ className: 'bg-gray-600' }}
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-1 rounded-sm text-sm font-medium"
              >ユーザー</a
            >
            <a
              href="/blueprints"
              use:link
              use:active={{ className: 'bg-gray-600' }}
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-1 rounded-sm text-sm font-medium"
              >クーポンテンプレート</a
            >
            <!-- <a
              href="/coupons"
              use:link
              use:active={{ className: 'bg-gray-600' }}
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-1 rounded-sm text-sm font-medium"
              >クーポン</a
            > -->
            {#if gmapsReady}
              <a
                href="/stores"
                use:link
                use:active={{ className: 'bg-gray-600' }}
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-1 rounded-sm text-sm font-medium">店</a
              >
            {/if}
          </div>
        </div>
      </div>
    </div>
  </nav>
  <div class="max-w-7xl mx-auto mt-4">
    <div class="p-2 bg-gray-200 rounded-sm">
      <Router {routes} />
    </div>
  </div>
</main>
