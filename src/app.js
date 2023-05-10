import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import path from "path";
import { petsRouter } from "./routes/pets.router.js";
import { usersHtmlRouter } from "./routes/users.html.router.js";
import { usersRouter } from "./routes/users.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { Server } from "socket.io";

const app = express();
const port = 3000;

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

//HANDLERS SOCKET
socketServer.on("connection", (socket) => {
  console.log("Un cliente se ha conectado: " + socket.id);

  //ACA RECIBO LOS DATOS DEL FRONT
  socket.on("msg_front_to_back", (data) => {
    console.log(JSON.stringify(data));
  });

  socket.emit("msg_back_to_front", { msg: "hola desde el back al socket" });

  socket.broadcast.emit("msg_back_to_todos_menos_socket", {
    msg: "hola desde el back a todos menos el socket",
  });

  socketServer.emit("msg_back_todos", { msg: "hola desde el back a todos" });

  setInterval(() => {
    socket.emit("msg", { msg: Date.now() + " hola desde el front" });
  }, 3000);
});

//API REST CON JSON
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);

//HTML RENDER SERVER SIDE
app.use("/", viewsRouter);
app.use("/users", usersHtmlRouter);

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "no encontrado",
    data: {},
  });
});
