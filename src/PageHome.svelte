<script>
import { API_URL_PUSH } from "./config";


  let title = '見出し'
  let message = 'ハロー！'
  function push() {
    fetch(API_URL_PUSH)
  }
</script>

<main class="space-y-4 p-4">
  <div class="flex space-x-2">
    <h2>プッシュ通知:</h2>
  </div>
  <div class="ml-8 space-y-2">
    <div class="flex space-x-2 buttons">
      <label><input class="px-1 rounded-sm" bind:value={title} placeholder="見出し" /></label>
    </div>
    <div class="flex space-x-2 buttons">
      <label><input class="px-1 rounded-sm" bind:value={message} placeholder="メッセージ" /></label>
    </div>
    <div class="flex space-x-2 buttons">
      <button
        class="bg-blue-700 hover:bg-blue-600 text-white border rounded-sm px-2 flex items-center"
        on:click={push}
        disabled={!message}
      >
        Send
      </button>
    </div>
  </div>
</main>
