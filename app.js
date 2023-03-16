import express from "express";
import cors from "cors";
import Blockchain from "./db-query.js";
const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  console.log(req.body);
  let data = await Blockchain.getById(req.body.id);
  console.log("id", req.body.id);
  console.log("data", data);
  // if (data.length > 0) {
  res.send(data);
  // // } else {
  // res.status(404).json({ message: "no data" });
  // }
});

app.get("/all", async (req, res) => {
  let data = await Blockchain.getAll();
  if (data.length > 0) {
    res.send(data);
  } else {
    res.status(404).json({ message: "no data" });
  }
});

// app.get("/:id", async (req, res) => {
//   let data = Blockchain.getSixImages(parseInt(req.params.id));
//   console.log("get group", req.params.id, "with ", data.items.length, "items");

//   if (data.items.length > 0) {
//     res.send(data);
//   } else {
//     res.status(404).json({ message: "no data" });
//   }
// });

app.post("/", async (req, res) => {
  console.log("post", req.body);
  Blockchain.addNew(req.body)
    .then((data) => {
      res.json({ hash: data });
    })
    .catch((err) => {
      res.status(500).json(err);
    })
    .finally(() => {
      res.end();
    });
});

Blockchain.onready = () => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
Blockchain.create();
