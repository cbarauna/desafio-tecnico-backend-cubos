import { Request, Response } from "express";
import fs from "fs";
import moment from "moment";

import * as util from "../utils/Utils";
const fileRule = "./src/files/rules.json";

class RegraController {
  public index(req: Request, res: Response) {
    let { query } = req;

    fs.readFile(fileRule, "utf8", (err: any, data: any) => {
      if (err) {
        return res.status(400).json({ msg: "Ocorreu um erro!", err });
      }

      if (Object.keys(query).length !== 0) {
        let db = JSON.parse(data);

        if (db.regras.length == 0) {
          return res.send(db);
        }

        let result = <any>[];

        db.regras.forEach(rule => {
          if (rule.daily) {
            result.push(rule);
          }
        });

        for (let i = 0; i < db.regras.length; i++) {
          let row = db.regras[i];
          if (row.daily) {
            result.push(row);
          }

          const momentStart = moment(query.start, "MM-DD-YYYY")
          const momentEnd = moment(query.end, "MM-DD-YYYY");

          if (!!row.weekly) {
            let daysWeek = [
              { number: 0, day: "sunday" },
              { number: 1, day: "monday" },
              { number: 2, day: "tuesday" },
              { number: 3, day: "wednesday" },
              { number: 4, day: "thursday" },
              { number: 5, day: "friday" },
              { number: 6, day: "saturday" }
            ];

            if (momentStart.day() != momentEnd.day()) {
              daysWeek = daysWeek.filter(item => {
                if (
                  item.number >= momentStart.day() &&
                  item.number <= momentEnd.day()
                ) {
                  return item;
                }
              });

              let controleWeek = false;
              for (let i = 0; i < daysWeek.length; i++) {
                controleWeek = util.findWeek(row, daysWeek[i].day);

                if (!controleWeek) {
                  break;
                }
              }

              if (controleWeek) {
                result.push(row);
              }
            } else {
              result.push(row);
            }

            continue;
          }

          if (row.day) {

            let lastDate = moment(row.day, "MM-DD-YYYY")

            if (momentEnd.isAfter(lastDate) && momentStart.isBefore(lastDate)) {
              result.push(row);
            }
          }
        }

        return res.send({ regras: result });
      }

      let json = JSON.parse(data);
      res.send(json);
    });
  }

  public store(req: Request, res: Response) {
    let body = req.body;

    if (body.daily && body.weekly) {
      return res.status(400).json({
        msg:
          "Regra inválida. Não pode ter uma regra que é diariamente e semanalmente ao mesmo tempo!."
      });
    }

    if (body.daily && body.day) {
      return res.status(400).json({
        msg: "Regra inválida. Não é possivel ter uma regra diariamente"
      });
    }

    if (body.weekly && body.day) {
      return res.status(400).json({
        msg:
          "Regra inválida. Não é possivel ter uma regra semanal infomando o dia."
      });
    }
    if (!body.daily && !body.weekly && !body.day) {
      return res
        .status(400)
        .json({ msg: "Regra inválida. Um tipo de regra deve ser informado." });
    }

    for (let i = 0; i < body.intervals.length; i++) {
      let row = body.intervals[i];

      let startHour = row.start.split(":");
      let endHour = row.end.split(":");

      let start = moment(startHour[0]).minute(startHour[1]);
      let end = moment(endHour[0]).minute(endHour[1]);

      if (start.isAfter(end)) {
        return res
          .status(400)
          .json({ msg: "Horário Inicial não pode ser Maior que final" });
      }

      if (i != 0) {
        let previousHour = body.intervals[i - 1];
        let previous = previousHour.end.split(":");
        let beforeHour = moment()
          .hour(previous[0])
          .minute(previous[1]);
        if (start.isBefore(beforeHour)) {
          return res.status(400).json({
            msg: "Conflito de Horários favor verificar!"
          });
        }
      }
    }

    fs.readFile(fileRule, "utf8", (err: any, data: any) => {
      if (err) {
        return res.status(400).json({ msg: "Tente novamente." });
      }

      const file = JSON.parse(data);

      if (file.regras.length == 0) {
        file.regras.push(body);

        const json = JSON.stringify(file);

        fs.writeFile(fileRule, json, "utf8", (err: any) => {
          if (err) {
            return res.status(400).json({ msg: "Tente novamente." });
          }
        });

        return res.send({ msg: "Regra salva com sucesso." });
      }

      for (let i = 0; i < file.regras.length; i++) {
        let row = file.regras[i];

        if (
          row.daily &&
          row.daily == body.daily &&
          util.checkExists(row.intervals, body.intervals)
        ) {
          return res.status(400).json({ msg: "Regra já cadastrada." });
        }

        if (
          row.day &&
          row.day == body.day &&
          util.checkExists(row.intervals, body.intervals)
        ) {
          return res.status(400).json({ msg: "Regra já cadastrada." });
        }

        if (row.weekly && row.weekly == body.weekly) {
          if (
            util.daysWeek(body.daysWeek, row.daysWeek) &&
            util.checkExists(row.intervals, body.intervals)
          ) {
            return res.status(400).json({ msg: "Regra já cadastrada." });
          }
        }
      }

      file.regras.push(body);

      const json = JSON.stringify(file);

      fs.writeFile(fileRule, json, "utf8", (err: any) => {
        if (err) {
          return res.status(400).json({ msg: "Tente novamente." });
        }
      });

      return res.send({ msg: "Regra cadastrada com sucesso." });
    });
  }

  public delete(req: Request, res: Response) {
    let body = req.body;

    fs.readFile(fileRule, "utf8", (err: any, data: any) => {
      if (err) throw err;

      let json = JSON.parse(data);

      if (!json.regras || json.regras.length == 0) {
        return res.send({ msg: "Regra não encontrada" });
      }

      let dataReturn = false;

      let dataResul = <any>[];

      for (let i = 0; i < json.regras.length; i++) {
        let row = json.regras[i];

        if (
          row.weekly != body.weekly ||
          row.daily != body.daily ||
          row.day != body.day
        ) {
          dataResul.push(row);
          continue;
        } else if (
          util.daysWeek(body.daysWeek, row.daysWeek) ||
          !util.checkExists(row.intervals, body.intervals)
        ) {
          dataResul.push(row);
          continue;
        } else {
          dataReturn = true;
        }
      }

      let final = { regras: dataResul };

      fs.writeFile(fileRule, JSON.stringify(final), "utf8", (err: any) => {
        if (err) {
          return res.status(400).json({
            msg:
              "Não foi possivel Deletar, reveja os paramentros e tente novamente"
          });
        }

        if (dataReturn) {
          return res.send({ msg: "Regra excluída com sucesso." });
        }

        return res.send({ msg: "Nenhuma regra foi encontrada" });
      });
    });
  }
}

export default new RegraController();
