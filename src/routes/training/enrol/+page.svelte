<script lang="ts">
  import { enhance } from "$app/forms";
  import { formatDate } from "$lib/functions/formatDate";
  import { getWeekday } from "$lib/functions/getWeekday";
  import { fromStore } from "svelte/store";
  import Message from "$lib/components/Message.svelte";
  import Loader from "$lib/components/Loader.svelte";

  export let data;

  $: ({ session, supabase, trainings, profile } = data);

  let messageComponent;
  let loading = false;
  let enrollments: { check: boolean; id: string }[] = [];

  $: {
    if (trainings?.length) {
      enrollments = trainings.map(() => ({
        check: false,
        id: "",
      }));
      checkEnrollment();
    }
  }

  function checkEnrollment() {
    for (var i = 0; i < trainings?.length; i++) {
      for (var j = 0; j < profile?.trainings_profiles?.length; j++) {
        if (trainings[i].id === profile.trainings_profiles[j].trainings.id) {
          enrollments[i].check = true;
          enrollments[i].id = profile.trainings_profiles[j].id;
        }
      }
    }
  }
</script>

<Message bind:this={messageComponent} />

{#each trainings as training, i}
  <form
    action="?/enrol"
    method="POST"
    use:enhance={({}) => {
      loading = true;
      return async ({ result }) => {
        messageComponent.showMessage(result);
        loading = false;
      };
    }}
  >
    <div class="flex">
      <p>
        {getWeekday(training?.day)}, {formatDate(training?.day)}
      </p>

      <input type="text" name="training_id" bind:value={training.id} hidden />

      {#if enrollments[i].check}
        <input
          type="text"
          name="trainings_profiles_id"
          bind:value={enrollments[i].id}
          hidden
        />
        <button formaction="?/unenrol" class="bg-red-600 hover:bg-red-500">
          ausschreiben
        </button>
      {:else}
        <button> einschreiben </button>
      {/if}
    </div>
  </form>
{/each}
