<script lang="ts">
  import { onMount } from "svelte";
</script>

<div class="space-y-5">
  <form action="?/sendMessage" class="" method="POST">
    <div class="space-y-3">
      <label for="text">Nachricht</label>
      <input type="text" name="text" />
      <br />
      <button class="px-3 py-2 bg-blue-300 rounded-md shadow-md" type="submit">
        senden
      </button>
    </div>
  </form>

  <form action="?/getChatId" class="" method="POST">
    <div class="space-y-3">
      <label for="number">Nummer</label>
      <input type="tel" name="number" autocomplete="tel" />
      <br />
      <button class="px-3 py-2 bg-blue-300 rounded-md shadow-md" type="submit">
        senden
      </button>
    </div>
  </form>
</div>

<style>
  input[type="text"],
  input[type="number"],
  textarea {
    @apply w-full;
  }

  select,
  input,
  textarea {
    @apply border-2 rounded-md py-1 px-2 border-gray-200 shadow-sm;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="number"] {
    @apply py-1 h-10;
  }
</style>
