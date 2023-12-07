<script lang="ts">
    import {Peer} from 'peerjs'
    const peer = new Peer();
    let coPeerId: string = ""
    let videoCurrent
    let videoEl;
    let myId = ""
    
      // GET YOU ID
      peer.on("open",(id)=>{
        myId = id
        console.log(id)
      })
      // IF ERROR CAN GET ID
       peer.on("error",(id)=>{
        console.log("error id "+ id)
      })
    
      peer.on("connection",(conn)=>{
        console.log("message....")
        conn.on("data",(data)=>{
          console.log("new data " + data)
        })
        conn.on("open",()=>{
          console.log("new message")
        })
      })
    
      // HANDLE CONNECTTION
      peer.on("call",async(call)=>{
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
    // RENDER YOU WEBCAM HERE
    let renderYouwebcam = (stream)=>{
      console.log(stream)
      videoEl.srcObject = stream
      videoEl.play()
    }
    
    </script>
    <div>
      you id cam  = {myId}
      <br>
      code : <input type=""
      bind:value={coPeerId} name="">
      <!-- BUTTON CONNECT TO FRIEND -->
      <button
      on:click={async()=>{
        var conn = peer.connect(coPeerId)
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
          let call = peer.call(coPeerId,stream)
          videoCurrent.srcObject = stream
          videoCurrent.play()
          call.on("stream",renderYouwebcam)
        }).catch(err=>console.log("have error " + err))
      }}
      >
      connect</button>
    
      <!-- VIDEO YOU FRIEND TAG HTML -->
      <video 
      bind:this={videoEl}
      width="400" height="400" autoplay="true">
        <track kind="captions" src="">
      </video>
      <br>
    
      <!-- YOU FACE CAM HERE -->
      <video 
      bind:this={videoCurrent}
      width="400" height="400" autoplay="true">
        <track kind="captions" src="">
      </video>
    </div>