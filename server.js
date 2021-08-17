const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(`${__dirname}`, "index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(`${__dirname}/public`, "notes.html"))
);

let notes;
app.get("/api/notes", (req, res) => {
  read();
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const getID = req.params.id;
  reRead();
  const chosenID = res.json(notes[getID]);
  return chosenID;
});

// POST
let addedID;
let newNote;
app.post("/api/notes", (req, res) => {
  newNote = req.body;
  read();
  notes.push(newNote);

  res.redirect("/");
  update();
});

// PUT
app.put("/api/notes/:id", (req, res) => {});

// DELETE
app.delete("/api/notes/:id", (req, res) => {
  reRead();
  notes.splice(req.params.id, 1);
  res.redirect("/");
  update();
  // console.log(notes);
});

const reRead = () => {
  const data = fs.readFileSync("./db/db.json", "utf8");
  notes = JSON.parse(data);
};

const read = () => {
  const data = fs.readFileSync("./db/db.json", "utf8");
  notes = JSON.parse(data);
  for (let i = 0; i < notes.length; i++) {
    addedID = i;
    notes[i].id = addedID;
  }
  update();
};

const update = () => {
  fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
    if (err) throw err;
    return true;
  });
};

app.listen(PORT, () =>
  console.log(`App listening on PORT http://localhost:${PORT}`)
);