import type { DataConnection } from "peerjs";
import type Peer from "peerjs";
import { writable, type Writable } from "svelte/store";

export const peer: Writable<Peer> = writable();
export const conn: Writable<DataConnection> = writable();
export const coPeerId: Writable<string> = writable()
export const myId: Writable<string> = writable()
export const videoCurrent: Writable<HTMLMediaElement> = writable()
export const videoEl: Writable<HTMLMediaElement> = writable()