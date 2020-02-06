import fs from "fs";

const rulesFile = "./src/files/rules.json";
import { readFile } from "../utils/Utils";

class RullesController {
  public index(req, res) {
    fs.readFile(rulesFile, "utf-8", (err, data) => {
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
  create(req, res) {
    const dateRules = req.body;

    fs.appendFile(
      rulesFile,
      JSON.stringify(dateRules),
      { enconding: "utf-8", flag: "w" },
      function(err) {
        if (err) throw err;
        console.log("Arquivo salvo!");
        res.send("Regra salva com sucesso!");
      }
    );

    // fs.readFile(rulesFile, "utf-8", (err, data) => {
    //   if (err) {
    //     if (err.code === "ENOENT") {
    //       fs.appendFile(
    //         rulesFile,
    //         JSON.stringify(dateRules),
    //         { enconding: "utf-8", flag: "w" },
    //         function(err) {
    //           if (err) throw err;
    //           console.log("Arquivo salvo!");
    //           res.send("Regra salva com sucesso!");
    //         }
    //       );
    //     }
    //     throw err;
    //   }
    //   if (!!data && moment(req.body.day, "DD-MM-YYYY").isValid()) {
    //     const date = JSON.parse(data);
    //     if (
    //       _.isArray(_.filter(data, { day: req.body.day })) &&
    //       _.filter(data, { day: req.body.day }).length > 0
    //     ) {
    //       res.send("Data já cadastrada!");
    //       return;
    //     } else {
    //       let dataJson = date.concat(dateRules);
    //       fs.appendFile(
    //         file,
    //         JSON.stringify(dataJson),
    //         { enconding: "utf-8", flag: "w" },
    //         function(err) {
    //           if (err) throw err;
    //           console.log("Arquivo salvo!");
    //           res.send("Regra salva com sucesso!");
    //         }
    //       );
    //     }
    //   }
    // });
  }
}

export default new RullesController();
