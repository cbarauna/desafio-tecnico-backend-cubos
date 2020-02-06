import fs from "fs";

const file = "./src/files/day.json";

class DayController {
  public index(req, res) {
    console.log(req);
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.send("Não há regra criada");
          return;
        }
        throw err;
      }

      let dataDb = JSON.parse(data);

      res.json(dataDb);
    });
  }
}

export default new DayController();
