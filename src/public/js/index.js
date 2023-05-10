const socket = io();

setInterval(() => {
  socket.emit("msg_front_to_back", {
    msg: Date.now() + " hola desde el front",
  });
}, 3000);

//ACA RECIBO LOS DATOS DEL BACK
socket.on("msg_back_to_front", (data) => {
  console.log(JSON.stringify(data));
});

socket.on("msg_back_to_todos_menos_socket", (data) => {
  console.log(JSON.stringify(data));
});

socket.on("msg_back_todos", (data) => {
  console.log(JSON.stringify(data));
});
