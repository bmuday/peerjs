<script lang="ts">
    import {Peer} from 'peerjs'
	  import { onMount } from 'svelte';
	  import { writable, type Writable } from 'svelte/store';
    const peer: Writable<Peer> = writable(new Peer());
    let coPeerId = writable("")
    let myId = writable("")
    let videoCurrent: HTMLMediaElement
    let videoEl: HTMLMediaElement

    onMount(() => {
  
      // GET YOU ID
      $peer.on("open",(id)=>{
        $myId = id
        console.log(id)
      })
      // IF ERROR CAN GET ID
       $peer.on("error",(id)=>{
        console.log("error id "+ id)
      })
    
      $peer.on("connection",(conn)=>{
        console.log("message....")
        conn.on("data",(data)=>{
          console.log("new data " + data)
        })
        conn.on("open",()=>{
          console.log("new message")
        })
      })
    
      // HANDLE CONNECTTION
      $peer.on("call",async(call)=>{
        // open webcam
      await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
      }).then((stream)=>{
        call.answer(stream)
        call.on("stream",renderYouwebcam)
        videoCurrent.srcObject = stream
        videoCurrent.play()
      }).catch(err=>console.log("err msg" + err))
    })
    })

    const connectToPeer = async () => {
      console.log("connect")
        const conn = $peer.connect($coPeerId)
        conn.on("data",(data)=>{
          console.log("new data " + data)
        })
        conn.on("open",function(){
          conn.send("hi")
        })
        // OPEN YOU WEBAM
        await navigator.mediaDevices.getUserMedia({
          video:true,
          audio:true
        }).then(stream=>{
          let call = $peer.call($coPeerId,stream)
          videoCurrent.srcObject = stream
          videoCurrent.play()
          call.on("stream",renderYouwebcam)
        }).catch(err=>console.log("have error " + err))
    }

    // RENDER YOU WEBCAM HERE
    const renderYouwebcam = (stream: MediaStream)=>{
      console.log(stream)
      videoEl.srcObject = stream
      videoEl.play()
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
      bind:this={videoEl}
      width="400" height="400" autoplay={true}>
        <track kind="captions" src="">
      </video>
      <br>
    
      <!-- YOU FACE CAM HERE -->
      <video 
      bind:this={videoCurrent}
      width="400" height="400" autoplay={true}>
        <track kind="captions" src="">
      </video>
    </div>