const fetch = require("node-fetch");
const cheerio = require("cheerio");
const delay = require("delay");
const readline = require("readline-sync");
const colors = require("./lib/colors");
const fss = require("fs");
const { URLSearchParams } = require("url");
const moment = require("moment");

console.log("#####################");
console.log("Panggil w Amin Tamvan");
console.log("#####################");

console.log("");
console.log("");

const Reff = readline.question("Masukan Kode Referal : ");
const file = readline.question("Masukan nama file letak gmail berada : ");
const DelaY = readline.question("Mau Berapa Lama (millisecond) : ");

console.log("");
console.log("");

const functionRegister = email =>
  new Promise((resolve, reject) => {
    const body = {
      password: "Coegsekali1!",
      monetize: true,
      email: `${email}`,
      referral_id: Reff
    };

    fetch("https://api.bigtoken.com/signup", {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        Referer: "https://my.bigtoken.com/signup",
        Origin: "https://my.bigtoken.com",
        "X-Requested-With": "XMLHttpRequest",
        "X-Srax-Big-Api-Version": 2,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.text())
      .then(json => resolve(json.length))
      .catch(err => reject(err));
  });

(async () => {
  console.log(
    "[" + " " + moment().format("HH:mm:ss") + " " + "]" + " " + "MEMULAI ...."
  );
  await fss.readFile(file, async function(err, data) {
    if (err) throw err;
    const array = data
      .toString()
      .replace(/\r\n|\r|\n/g, " ")
      .split(" ");

    const regEX = /[.-\w]+@[\w\-]{3,}(.\w{2,})+/;
    const test = array.map(ury => {
      return ury.match(regEX);
    });

    test.map(async eml => {
      await delay(DelaY);
      const regist = await functionRegister(eml[0]);
      if (regist == 0) {
        console.log(
          "[" +
            " " +
            moment().format("HH:mm:ss") +
            " " +
            "]" +
            " " +
            "BERHASIL REGIST :" +
            " " +
            eml[0]
        );
      } else {
        console.log(
          "[" +
            " " +
            moment().format("HH:mm:ss") +
            " " +
            "]" +
            " " +
            "EMAIL SUDAH TERDAFTAR :" +
            " " +
            eml[0]
        );
      }
    });
  });
})();
