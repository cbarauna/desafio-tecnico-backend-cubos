import fs from "fs";

module.exports = {
  readFile(file: string) {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          return {};
        }
        throw err;
      }

      let dataDb = JSON.parse(data);

      return dataDb;
    });
  }
};
