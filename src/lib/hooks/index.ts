import { coPeerId, myId, peer, videoCurrent, videoEl } from "$lib/stores";
import { Peer } from "peerjs";
import { get } from "svelte/store";

export const listenToEvents = (videoCurrent: HTMLMediaElement) => {
  peer.set(new Peer());
  // GET YOUR ID
  get(peer).on("open", (id: string) => {
    myId.set(id);
    console.log("myId", id);
  });
  // IF ERROR CAN GET ID
  get(peer).on("error", (id) => {
    console.log("error id " + id);
  });

  get(peer).on("connection", (connection) => {
    console.log("message....");
    connection.on("data", (data) => {
      console.log("new data " + data);
    });
    connection.on("open", () => {
      console.log("new message");
    });
  });

  // HANDLE CONNECTTION
  get(peer).on("call", async (call) => {
    // open webcam
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      call.answer(stream);
      call.on("stream", renderYourwebcam);
      get(videoCurrent).srcObject = stream;
      get(videoCurrent).play();
    } catch (err) {
      console.log("err msg" + err);
    }
  });
};

export const connectToPeer = async () => {
  const conn = get(peer).connect(get(coPeerId));
  conn.on("data", (data) => {
    console.log("new data " + data);
  });
  conn.on("open", function () {
    conn.send("hi");
  });
  // OPEN YOU WEBAM
  await navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      const call = get(peer).call(get(coPeerId), stream);
      get(videoCurrent).srcObject = stream;
      get(videoCurrent).play();
      call.on("stream", renderYourwebcam);
    })
    .catch((err) => console.log("have error " + err));
};

// RENDER YOU WEBCAM HERE
const renderYourwebcam = (stream: MediaStream) => {
  console.log("stream", stream);
  get(videoEl).srcObject = stream;
  get(videoEl).play();
};
