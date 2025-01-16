<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, SubmitFunction } from "./$types.js";
  import Message from "$lib/components/Message.svelte";
  import Loader from "$lib/components/Loader.svelte";
  let messageComponent;
  let loading = false;

  export let form: ActionData;
</script>

<svelte:head>
  <title>User Management</title>
</svelte:head>

<Message bind:this={messageComponent} />

<form
  class="row flex flex-center"
  method="POST"
  use:enhance={({}) => {
    loading = true;
    return async ({ result, update }) => {
      update();
      messageComponent.showMessage(result);
      loading = false;
    };
  }}
  action="?/login"
>
  <div class="col-6 form-widget">
    <h1 class="header">Supabase + SvelteKit</h1>
    <p class="description">Sign in via magic link with your email below</p>

    <label>
      Email
      <input name="email" type="email" />
    </label>
    <label>
      Password
      <input name="password" type="password" />
    </label>

    {#if form?.errors?.email}
      <span class="flex items-center text-sm error">
        {form?.errors?.email}
      </span>
    {/if}
    <div>
      <button class="button primary block"> Login </button>
      <button formaction="?/signup">Registrieren</button>
    </div>
  </div>
</form>
