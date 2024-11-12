<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  let numberId: string;
  let showError: boolean = false;
  let showSuccess: boolean = false;
</script>

<div class="space-y-5">
  {#if numberId}
    <h2>Whatsapp Nachricht versenden</h2>

    <form
      action="?/sendMessage"
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
            showSuccess = true;
            formElement.reset();
            invalidateAll();
          } else {
            showError = true;
            invalidateAll();
            formElement.reset();
          }
          setTimeout(() => {
            showSuccess = false;
            showError = false;
          }, 3500);
          // `result` is an `ActionResult` object
          // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
        };
      }}
    >
      <div class="space-y-3">
        <div class="md:flex md:space-x-2">
          <div class="w-full">
            <label for="text">Nachricht</label>
            <input type="text" name="text" />
          </div>
          <div class="w-full">
            <label for="text">Id</label>
            <input type="text" name="number" bind:value={numberId} disabled />
          </div>
        </div>
        <br />
        <button
          class="px-3 py-2 bg-blue-300 rounded-md shadow-md"
          type="submit"
        >
          senden
        </button>
      </div>
    </form>
  {/if}

  {#if !numberId}
    <h2>Gib deine Handynummer ein</h2>

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
        <button
          class="px-3 py-2 bg-blue-300 rounded-md shadow-md"
          type="submit"
        >
          absenden
        </button>
      </div>
    </form>
  {/if}
</div>

{#if showSuccess || showError}
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-16"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <div
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-md {showSuccess
          ? 'bg-green-500'
          : 'bg-red-500'} shadow-lg"
        transition:fly={{ y: 250, duration: 350, easing: cubicOut }}
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              {#if showSuccess}
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              {:else}
                <svg
                  class="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path
                    d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                  />
                </svg>
              {/if}
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-white">
                {showSuccess
                  ? "Nachricht erfolgreich versandt!"
                  : "Ein Fehler ist aufgetreten"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
