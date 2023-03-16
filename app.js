import express from "express";
import cors from "cors";
import Blockchain from "./block.js";
const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/:id", async (req, res) => {
  let data = await Blockchain.getById(req.params.id);
  res.json({ data: data });
});

app.post("/", async (req, res) => {
  let data = await Blockchain.addNew(req.body);
  res.json({ data: data });
});

Blockchain.onready = () => {
  app.listen(port, () => {
    console.log(`Storage listening on ${port}`);
  });
};

Blockchain.create();

// app.post("/all", async (req, res) => {
//   console.log(req.body.keys);
//   let data = [];
//   req.body.keys.map(async (element) => {
//     let r = await Blockchain.getById(element);
//     console.log(r + "/n");
//     data.push(r);
//   });
//   res.json({ data: data });
// });
