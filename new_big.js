const fetch = require("node-fetch");
const cheerio = require("cheerio");
const delay = require("delay");
const readline = require("readline-sync");
const colors = require("./lib/colors");
const fs = require("async-file");
const { URLSearchParams } = require("url");
const moment = require("moment");
const rp = require("request-promise");

console.log("#####################");
console.log("Panggil w Amin Tamvan");
console.log("#####################");

console.log("");
console.log("");

const Reff = readline.question("Masukan Kode Referal : ");
const LooP = readline.question("Mau Berapa Banyak ? ");
const DelaY = readline.question(
  "Mau Berapa Lama (millisecond), semakin lama semakin besar peluang langsung verifikasi : "
);

console.log("");
console.log("");

const functionRegister = (email, domain) =>
  new Promise((resolve, reject) => {
    const body = {
      password: "Coegsekali1!",
      monetize: true,
      email: `${email}@${domain}`,
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

const functionCreateEmail = (email, domain) =>
  new Promise((resolve, reject) => {
    fetch(`https://generator.email/email-generator`, {
      method: "get",
      redirect: "follow",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "accept-encoding": "gzip, deflate, br",
        cookie: `_ga=GA1.2.1164348503.1554262465; _gid=GA1.2.905585996.1554262465; embx=%5B%22hcycl%40nongzaa.tk%22%5D; surl=${domain}/${email}/; io=_LbPUqg0408QUbi1aCWe`,
        "upgrade-insecure-requests": 1,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
      }
    })
      .then(res => resolve("success create email"))
      .catch(err => reject(err));
  });

const functionGetMessages = (email, domain) =>
  new Promise((resolve, reject) => {
    fetch(`https://generator.email/`, {
      method: "get",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "accept-encoding": "gzip, deflate, br",
        cookie: `_ga=GA1.2.1164348503.1554262465; _gid=GA1.2.905585996.1554262465; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=-aUNS6XIdbbHj__faWS_; surl=${domain}%2F${email}`,
        "upgrade-insecure-requests": 1,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
      }
    })
      .then(res => res.text())
      .then(text => {
        const $ = cheerio.load(text);
        const src = $(".button").attr("href");
        resolve(src);
      })
      .catch(err => reject(err));
  });

const functionVerification = (email, token) =>
  new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("verification_code", token);

    fetch("https://api.bigtoken.com/signup/email-verification", {
      method: "POST",
      body: params,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded ",
        "Content-Length": 387,
        Host: "api.bigtoken.com",
        Connection: "Keep-Alive",
        "Accept-Encoding": "gzip ",
        "User-Agent": "okhttp/3.14.0"
      }
    })
      .then(res => res.text())
      .then(text => resolve(text))
      .catch(err => reject(err));
  });

const functionGetLocation = domain =>
  new Promise((resolve, reject) => {
    // rp({
    //   uri: "https://bigtoken.page.link/og5e4wEN3Difa11i7",
    //   method: "GET",
    //   followAllRedirects: true

    // headers: {
    //   accept:
    //     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    //   "accept-encoding": "gzip, deflate, br",
    //   "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    //   "upgrade-insecure-requests": 1,
    //   "user-agent":
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
    // }
    // }).then(function(response) {
    //   resolve(response.headers);
    // });

    const userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36";
    const url = `${domain}`;

    const _include_headers = function(body, response, resolveWithFullResponse) {
      return {
        headers: response.headers,
        data: body,
        finalUrl: response.request.uri.href // contains final URL
      };
    };

    const options = {
      uri: url,
      followAllRedirects: true,
      method: "get",
      gzip: true,
      transform: _include_headers,
      headers: {
        "User-Agent": userAgent
      }
    };

    const p1 = rp(options).then((response, error, html) => {
      resolve(response.finalUrl);
    });
  });

const genEmail = length =>
  new Promise((resolve, reject) => {
    var text = "";
    var possible =
      "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    resolve(text);
  });

const domain = [
"creo.iotu.nctu.me",
"nasa.dmtc.edu.pl",
"41054733.mail-temp.com",
"derbydales.co.uk",
"aiot.vuforia.us",
"edu.creo.site",
"50sale.edu.vn",
"aiot.aiphone.eu.org",
"edu.dmtc.press",
  "todayemail.ga"
];
(async () => {
  for (let index = 0; index < LooP; index++) {
    const item = await domain[(Math.random() * domain.length) | 0];
    const emel = await genEmail(10);
    await delay(10000);
    const register = await functionRegister(emel, item);
    const email = emel + "@" + item;

    await console.log(
      "[" +
        " " +
        moment().format("HH:mm:ss") +
        " " +
        "]" +
        " " +
        "Membuat Email..."
    );

    if (register === 0) {
      await console.log(
        "[" +
          " " +
          moment().format("HH:mm:ss") +
          " " +
          "]" +
          " " +
          "Sukses register dengan email :" +
          " " +
          `${email}`
      );

      const createMail = await functionCreateEmail(emel, item);
      await console.log(
        "[" +
          " " +
          moment().format("HH:mm:ss") +
          " " +
          "]" +
          " " +
          "Mengambil Token..."
      );

      await delay(DelaY);

      const message = await functionGetMessages(emel, item);

      if (message === undefined) {
        console.log(
          "[" +
            " " +
            moment().format("HH:mm:ss") +
            " " +
            "]" +
            " " +
            "Gagal Mengambil Link..."
        );
        console.log(
          "[" +
            " " +
            moment().format("HH:mm:ss") +
            " " +
            "]" +
            " " +
            "Cek sendiri dan tunggu dalam beberapa menit/jam kedepan :" +
            " " +
            `https://generator.email/${email}`
        );
        fs.appendFile(
          "result_url.txt",
          `https://generator.email/${email} \n`,
          "utf-8"
        );
        console.log(
          "[" +
            " " +
            moment().format("HH:mm:ss") +
            " " +
            "]" +
            " " +
            "Lokasi Link :" +
            " " +
            `result_url.txt`
        );
        console.log("");
        console.log("");
      } else {
        await delay(DelaY);
        const getLocation = await functionGetLocation(message);
        // const decodeURL = await decodeURIComponent(getLocation);
        
        const regex = await new RegExp(/\?(?:code)\=([\S\s]*?)\&/);

        const resGex = await regex.exec(getLocation);

        console.log(
          "[" +
            " " +
            moment().format("HH:mm:ss") +
            " " +
            "]" +
            " " +
            "Proses Verifikasi"
        );
        const veryf = await functionVerification(email, resGex[1]);
        console.log(
          "[" +
            " " +
            moment().format("HH:mm:ss") +
            " " +
            "]" +
            " " +
            "Veryf Sukses"
        );
        console.log("");
        console.log("");
      }
    } else {
      console.log("Email Sudah Terdaftar");
      console.log("");
      console.log("");
    }
  }
})();
