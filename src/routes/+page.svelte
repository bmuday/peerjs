<script lang="ts">
	import { connectToPeer, listenToEvents } from "$lib/hooks";
	import { onMount } from "svelte";
	import { writable, type Writable } from "svelte/store";
  import { coPeerId, myId, videoCurrent, videoEl, conn } from "$lib/stores";

  const newMessage = writable("")
  const messages: Writable<string[]> = writable([])

  $: console.log("connection", $conn)

    onMount(() => {
    listenToEvents()
    })

    const sendMessage = () => {
      console.log("new message", $newMessage)
      $conn.send($newMessage)
    }
    </script>
    <div>
      <p>Your peer id: {$myId}</p>
      <br>
      <label for="coPeerId">Enter your co-peer ID: </label>
      <input id="coPeerId" type="text"
      bind:value={$coPeerId}>
      <!-- BUTTON CONNECT TO FRIEND -->
      <button
      on:click={connectToPeer}
      >
      connect</button>
    
      <!-- VIDEO YOU FRIEND TAG HTML -->
      <video 
      bind:this={$videoEl}
      width="400" height="400" autoplay={true}>
        <track kind="captions" src="">
      </video>
      <br>
    
      <!-- YOU FACE CAM HERE -->
      <video 
      bind:this={$videoCurrent}
      width="400" height="400" autoplay={true}>
        <track kind="captions" src="">
      </video>

      <form>
        <input bind:value={$newMessage} type="text" placeholder="Enter your new message">
        <button type="submit">Send</button>
      </form>
      <ul>
        {#each $messages as message}
          <li>
            <p>{message}</p>
          </li>
        {/each}
      </ul>
    </div>