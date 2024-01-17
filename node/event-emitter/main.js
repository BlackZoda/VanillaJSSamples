const MyEventEmitter = require("./myEventEmitter");

class Em extends MyEventEmitter {}

const em = new Em();

const orderFn = (name, qty) =>
  console.log(`Order |\tItem: ${name}\tQty:${qty}`);

const testFn = (test) => console.log("test", test);

const shippingFn = (day) => console.log(`Shipped ${day}`);

em.on("order", orderFn);

em.emit("order", "cigarettes", 20);
em.emit("order", "beer", 6);

em.off("order", orderFn);

em.emit("order", "shouldn't work", 2);

em.on("order", orderFn);
em.on("order", testFn);
em.on("shipping", orderFn);

em.emit("order", "apples", 4);

em.once("single", () => console.log("this event only happens once"));

em.emit("single");
em.emit("single");

console.log(em.listenerCount("order"));

console.log(em.rawListeners("single"));
console.log(em.rawListeners("none"));
console.log(em.rawListeners("order"));
