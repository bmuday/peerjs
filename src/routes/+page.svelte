<script lang="ts">
	import { connectToPeer, listenToEvents, sendMessage } from "$lib/hooks";
	import { onMount } from "svelte";
	import { writable, type Writable } from "svelte/store";
  import { coPeerId, videoCurrent, videoEl, conn, myPeer, messages } from "$lib/stores";

  const newMessage = writable("")

  $: {
    console.log("connection", $conn)
  }

    onMount(() => {
    listenToEvents($videoCurrent)
    })
    </script>
    <div>
      {#if $myPeer && $myPeer.id}
        <p>Your peer id: {$myPeer.id}</p>
      {/if}
      <br>
      <label for="coPeerId">Enter your co-peer ID: </label>
      <input id="coPeerId" type="text"
      bind:value={$coPeerId}>
      <!-- BUTTON CONNECT TO FRIEND -->
      <button
      on:click={() => connectToPeer($myPeer, $coPeerId, $videoCurrent)}
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

      <form on:submit={() => {
        sendMessage($newMessage)
        $newMessage = ""
      }}>
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