import { conn, messages, myPeer, videoEl } from "$lib/stores";
import { Peer } from "peerjs";
import { get } from "svelte/store";

export const listenToEvents = (videoCurrent: HTMLMediaElement) => {
  myPeer.set(new Peer());
  // GET YOUR ID
  get(myPeer).on("open", (id: string) => {
    console.log("myId", id);
  });
  // IF ERROR CAN GET ID
  get(myPeer).on("error", (id) => {
    console.log("error id " + id);
  });

  get(myPeer).on("connection", (connection) => {
    conn.set(connection);
    connection.on("data", (data) => {
      console.log("new data " + data);
      if (typeof data === "string")
        messages.update((messagesList) => [...messagesList, data]);
    });
    connection.on("open", () => {
      console.log("open connection");
    });
  });

  // HANDLE CONNECTTION
  get(myPeer).on("call", async (call) => {
    // open webcam
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      call.answer(stream);
      call.on("stream", renderYourwebcam);
      videoCurrent.srcObject = stream;
      videoCurrent.play();
    } catch (err) {
      console.log("err msg" + err);
    }
  });
};

export const connectToPeer = async (
  myPeer: Peer,
  coPeerId: string,
  videoCurrent: HTMLMediaElement
) => {
  const connection = myPeer.connect(coPeerId);
  conn.set(connection);
  connection.on("data", (data) => {
    console.log("data " + data);
    if (typeof data === "string")
      messages.update((messagesList) => [...messagesList, data]);
  });
  connection.on("open", () => {
    console.log("open connection");
  });
  // OPEN YOU WEBAM
  await navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      const call = myPeer.call(coPeerId, stream);
      videoCurrent.srcObject = stream;
      videoCurrent.play();
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

export const sendMessage = (newMessage: string) => {
  console.log("new message", newMessage);
  get(conn).send(newMessage);
  messages.update((messagesList) => [...messagesList, newMessage]);
};
