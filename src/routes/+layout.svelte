<script lang="ts">
  import "../app.css";
  import "../fonts.css";
  import { currentPage, darkMode } from "$lib/scripts/stores";
  import { titles } from "$lib/scripts/navbar";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { invalidate } from "$app/navigation";
  import { enhance } from "$app/forms";

  export let data;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let loading: boolean = false;
  let open: boolean = false;
  $: dark = $darkMode;

  let current: "cross" | "burger" = "burger";
  let pageHref;

  function menuToggle() {
    if (open) {
      current = "burger";
      open = false;
    } else {
      current = "cross";
      open = true;
    }
  }

  onMount(() => {
    pageHref = window.location.href;

    for (let i = 0; i < titles.length; i++) {
      if (pageHref.toString().includes(titles[i].href)) {
        $currentPage = i;
        pageHref = pageHref;
      }
    }

    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });

  function changeDarkMode() {
    if ($darkMode) {
      $darkMode = false;
    } else {
      $darkMode = true;
    }
  }

  async function logout() {
    const response = await fetch("/logout", { method: "POST" });

    if (response.ok) {
      window.location.href = "/";
    } else {
      console.error("Logout failed");
    }
  }
</script>

{#if dark}
  <style>
    html {
      @apply bg-gray-800;
      @apply text-gray-200;
    }
  </style>
{/if}

<nav class="sticky top-0 z-10" class:dark>
  <div
    class="bg-white dark:bg-gray-800 mx-auto max-w-7xl pt-2 pb-2 md:pb-0 px-4 sm:px-6 lg:px-8"
  >
    <div class="flex h-16 justify-between py-2">
      <div class="flex flex-shrink-0 items-center">
        <a href="/" on:click={() => ($currentPage = 0)}>
          <img
            loading="lazy"
            class="h-12 lg:hidden md:block hidden"
            src="/images/logos/turner.png"
            alt="Turnverein Nussbaumen"
          />
          <img
            loading="lazy"
            class="h-12 md:hidden lg:block block"
            src="/images/logos/logo.png"
            alt="Turnverein Nussbaumen"
          />
        </a>
      </div>
      <div class="hidden md:ml-6 md:flex md:space-x-8">
        {#each titles as title, i}
          <a
            href={title.href}
            class={$currentPage === i
              ? "inline-flex items-center border-b-2 dark:border-tvbluelight border-tvblue dark:text-white text-gray-700 px-1 pt-1 font-medium"
              : "inline-flex items-center border-b-2 border-transparent dark:text-gray-400 text-gray-500 hover:border-tvblue dark:hover:border-tvbluelight hover:text-gray-700 dark:hover:text-white px-1 pt-1 font-medium hover:transition-all hover:duration-[600ms]"}
            on:click={() => ($currentPage = i)}>{title.name}</a
          >
        {/each}

        <!-- 
				<button on:click={changeDarkMode}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="dark:fill-white fill-black"
						height="24"
						viewBox="0 -960 960 960"
						width="24"
					>
						<path
							d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"
						/>
					</svg>
				</button>
				-->
        <div>
          <button class="group" on:click={logout}>
            <p class="group-hover:scale-105">Logout</p>
          </button>
        </div>
      </div>

      <div class="-mr-2 flex items-center md:hidden gap-4">
        <button
          name="Navigation"
          type="button"
          class="block h-10 w-10"
          aria-controls="mobile-menu"
          aria-expanded="false"
          on:click={menuToggle}
        >
          <svg
            id="burger"
            class={current === "burger"
              ? "burgerMenu block h-full w-full"
              : "hidden"}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <svg
            id="cross"
            class={current === "cross"
              ? "burgerMenu block h-full w-full"
              : "hidden"}
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  {#if open}
    <div
      transition:fade
      class="md:hidden absolute bg-white dark:bg-gray-800 w-full h-screen"
    >
      <div class="mt-2 space-y-1">
        {#each titles as title, i}
          <a
            href={title.href}
            class="block px-4 py-2 hover place-content-end hover:bg-gray-100"
            on:click={menuToggle}
            on:click={() => ($currentPage = i)}>{title.name}</a
          >
        {/each}
        <div>
          <button class="group" on:click={logout}>
            <p class="group-hover:scale-105">Logout</p>
          </button>
        </div>
      </div>
      <div class="px-4 pt-5 flex space-x-10">
        <a
          href="https://www.facebook.com/people/TV-Nussbaumen/100064088556190/"
          class="hover"
        >
          <span class="sr-only">Facebook</span>
          <svg
            class="h-7 w-7"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clip-rule="evenodd"
            />
          </svg>
        </a>

        <a href="https://www.instagram.com/tvnussbaumen/" class="hover">
          <span class="sr-only">Instagram</span>
          <svg
            class="h-7 w-7"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  {/if}

  <div class="bg-white dark:bg-gray-800 h-2 md:block hidden" />
  <div
    class="bg-gradient-to-b from-white dark:from-gray-800 h-3 md:opacity-[98%]"
  />
</nav>

<div class="relative" class:dark>
  <div class="bg-white dark:bg-gray-800">
    <div class="py-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <slot />
    </div>
  </div>
  <footer>
    <div class="bg-tvblue h-1 mt-10 mb-8" />
    <div class="mx-auto max-w-7xl overflow-hidden pb-20 pt-0 px-6 lg:px-8">
      <nav
        class="-mb-6 columns-2 md:flex md:justify-center md:space-x-12"
        aria-label="Footer"
      >
        {#each titles as title, i}
          <div class="pb-6">
            <a
              href={title.href}
              class="hover"
              on:click={() => ($currentPage = i)}>{title.name}</a
            >
          </div>
        {/each}
      </nav>
      <!--
					
				<div class="flex justify-center mt-7 text-xs text-center">
					<a href="/" class="flex hover underline">login</a>
				</div>

				-->
      <div class="mt-7 flex md:justify-center space-x-10">
        <a
          href="https://www.facebook.com/people/TV-Nussbaumen/100064088556190/"
          class="hover"
        >
          <span class="sr-only">Facebook</span>
          <svg
            class="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clip-rule="evenodd"
            />
          </svg>
        </a>

        <a href="https://www.instagram.com/ussbaumen/" class="hover">
          <span class="sr-only">Instagram</span>
          <svg
            class="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
      </div>
      <div class="mt-10 text-center text-xs leading-5">
        &copy; 2023 <a
          href="/"
          class="underline hover"
          on:click={() => ($currentPage = 0)}>Turnverein Nussbaumen</a
        >.
      </div>
      <div class="mt-2 text-center text-xs leading-5">
        <a href="mailto:info@tvnussbaumen.ch"> info@tvnussbaumen.ch </a>
      </div>

      <div class="mt-3 text-center flex justify-center text-xs leading-5 gap-4">
        <a
          href="https://github.com/joergjan/tvn_webpage.git"
          class="group"
          target="_blank"
        >
          <img
            src="/images/logos/github.png"
            class="h-5 group-hover:opacity-70"
            alt="github"
          />
        </a>
        <a href="https://twint.tvnussbaumen.ch" target="_blank" class="group">
          <img
            src="/images/logos/twint.png"
            class="h-5 group-hover:opacity-70"
            alt="TWINT"
          />
        </a>
      </div>
    </div>
  </footer>
</div>
