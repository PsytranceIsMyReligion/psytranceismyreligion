import EventEmitter from "events";

const karmicKudoEmitter = new EventEmitter();
karmicKudoEmitter.setMaxListeners(0);
export default karmicKudoEmitter;