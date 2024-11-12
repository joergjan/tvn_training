<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";

  let numberId: string;
</script>

<div class="space-y-5">
  <h2>Send Message</h2>
  <form action="?/sendMessage" class="" method="POST" use:enhance>
    <div class="space-y-3">
      <div class="md:flex md:space-x-2">
        <div class="w-full">
          <label for="text">Nachricht</label>
          <input type="text" name="text" />
        </div>
        <div class="w-full">
          <label for="text">NummerId</label>
          <input type="text" name="number" />
        </div>
      </div>
      <br />
      <button class="px-3 py-2 bg-blue-300 rounded-md shadow-md" type="submit">
        senden
      </button>
    </div>
  </form>

  <br />
  <br />
  <br />
  <h2>GetNumberId</h2>

  <form
    action="?/getChatId"
    class=""
    method="POST"
    use:enhance={({ formElement, formData, action, cancel, submitter }) => {
      // `formElement` is this `<form>` element
      // `formData` is its `FormData` object that's about to be submitted
      // `action` is the URL to which the form is posted
      // calling `cancel()` will prevent the submission
      // `submitter` is the `HTMLElement` that caused the form to be submitted

      return async ({ result, update }) => {
        if (result.type === "success") {
          numberId = String(await result.data.data);
          formElement.reset();

          invalidateAll();
        } else {
          invalidateAll();
          formElement.reset();
        }
        // `result` is an `ActionResult` object
        // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
      };
    }}
  >
    <div class="space-y-3">
      <label for="number">Nummer</label>
      <input type="tel" name="number" autocomplete="tel" />
      <br />
      <button class="px-3 py-2 bg-blue-300 rounded-md shadow-md" type="submit">
        abfragen
      </button>
    </div>
  </form>
</div>
{#if numberId}
  <div class="">
    {numberId}
  </div>
{/if}

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
