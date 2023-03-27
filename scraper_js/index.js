import puppeteer from "puppeteer";
import fs from "fs";

const links = [
  // "https://wolnelektury.pl/katalog/lektura/mickiewicz-ballady-i-romanse-to-lubie.html",
  // "https://wolnelektury.pl/katalog/lektura/ballady-i-romanse-lilje.html",
  // "https://wolnelektury.pl/katalog/lektura/ballady-i-romanse-romantycznosc.html",
  // "https://wolnelektury.pl/katalog/lektura/oda-do-mlodosci.html",
  // "https://wolnelektury.pl/katalog/lektura/pan-tadeusz.html",
  // "https://wolnelektury.pl/katalog/lektura/kordian.html",
  // "https://wolnelektury.pl/katalog/lektura/sonety-krymskie-motto-i-dedykacja.html",
  // "https://wolnelektury.pl/katalog/lektura/sonety-krymskie-stepy-akermanskie.html",
  // "https://wolnelektury.pl/katalog/lektura/sonety-krymskie-cisza-morska.html",
  // "https://wolnelektury.pl/katalog/lektura/sonety-krymskie-zegluga.html",
  // "https://wolnelektury.pl/katalog/lektura/sonety-krymskie-widok-gor-ze-stepow-kozlowa.html",
  // "https://wolnelektury.pl/katalog/lektura/sonety-krymskie-bakczysaraj.html",
  // "https://wolnelektury.pl/katalog/lektura/sonety-krymskie-bakczysaraj-w-nocy.html",
  // "https://wolnelektury.pl/katalog/lektura/sonety-krymskie-grob-potockiej.html",
  // "https://wolnelektury.pl/katalog/lektura/sonety-krymskie-mogily-haremu.html",
  // "https://wolnelektury.pl/katalog/lektura/ballady-i-romanse-switezianka.html",
  // "https://wolnelektury.pl/katalog/lektura/reduta-ordona.html",
  // "https://wolnelektury.pl/katalog/lektura/ballady-i-romanse-switez.html",
  // "https://wolnelektury.pl/katalog/lektura/ballady-i-romanse-lilje.html",
  // "https://wolnelektury.pl/katalog/lektura/ballady-i-romanse-rybka.html",
  // "https://wolnelektury.pl/katalog/lektura/dziady-dziady-poema-dziady-czesc-iii.html",
  // "https://wolnelektury.pl/katalog/lektura/dziady-dziady-widowisko-czesc-i.html",
  // "https://wolnelektury.pl/katalog/lektura/mickiewicz-sen.html",
  // "https://wolnelektury.pl/katalog/lektura/sonety-odeskie-w-imionniku-c-s.html",
  // "https://wolnelektury.pl/katalog/lektura/ksiegi-narodu-polskiego-i-pielgrzymstwa-polskiego.html",
  // "https://wolnelektury.pl/katalog/lektura/liryki-lozanskie-ach-juz-i-w-rodzicielskim-domu.html",
  // "https://wolnelektury.pl/katalog/lektura/liryki-lozanskie-bron-mnie-przed-soba.html",
  // "https://wolnelektury.pl/katalog/lektura/liryki-lozanskie-do-b-z.html",
  // "https://wolnelektury.pl/katalog/lektura/liryki-lozanskie-nad-woda-wielka-i-czysta.html",
  // "https://wolnelektury.pl/katalog/lektura/liryki-lozanskie-pytasz-za-co-bog.html",
  // "https://wolnelektury.pl/katalog/lektura/liryki-lozanskie-rece-za-lud-walczace.html",
  // "https://wolnelektury.pl/katalog/lektura/liryki-lozanskie-snuc-milosc.html",
  // "https://wolnelektury.pl/katalog/lektura/liryki-lozanskie-snila-sie-zima.html",
  "https://wolnelektury.pl/katalog/lektura/slowacki-ksiaze-niezlomny.html",
  "https://wolnelektury.pl/katalog/lektura/grob-agamemnona.html",
  "https://wolnelektury.pl/katalog/lektura/testament-moj.html",
  "https://wolnelektury.pl/katalog/lektura/smierc-pulkownika.html",
  "https://wolnelektury.pl/katalog/lektura/balladyna.html",
  "https://wolnelektury.pl/katalog/lektura/mickiewicz-kochanek-duchow.html",
  "https://wolnelektury.pl/katalog/lektura/mickiewicz-do-na-alpach-w-splugen-1829.html",
  "https://wolnelektury.pl/katalog/lektura/sonety-odeskie-niepewnosc.html",
  "https://wolnelektury.pl/katalog/lektura/renegat.html",
];

let counter = 0;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getBook = async (book_URL) => {
  counter += 1;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(book_URL, {
    waitUntil: "domcontentloaded",
  });

  let book;
  try {
    book = await page.evaluate(() => {
      const textElement = document.querySelector("#book-text");
      const elementArray = [
        textElement.querySelector("#footnotes"),
        textElement.querySelector("div#themes"),
        textElement.querySelector("span.author"),
        textElement.querySelector("span.title"),
        ...textElement.querySelectorAll(".annoy-banner"),
        ...textElement.querySelectorAll(".dynamic-insert.with-image"),
        ...textElement.querySelectorAll(".annotation"),
        ...textElement.querySelectorAll(".theme-begin"),
        ...textElement.querySelectorAll("a.anchor"),
      ];

      elementArray.forEach((element) => {
        try {
          element.remove();
        } catch {}
      });

      return textElement.textContent
        .replace("\n\n\n", "")
        .replace("\n\n\n", "")
        .replace("\n\n", "")
        .replaceAll("\n\n", "\n")
        .replaceAll("\n\n", "\n");
    });
  } catch (error) {
    console.log(`${counter}/${links.length}   ERROR, skipping ${book_URL}`);
    return "";
  }

  await browser.close();
  console.log(`${counter}/${links.length}   SUCCESS, ${book_URL}`);
  return book;
};

const stream = fs.createWriteStream("input.txt", {
  flags: "a",
  encoding: "utf-8",
});

for (const link of links) {
  const text = await getBook(link);
  stream.write(text);
  await delay(1000);
}

stream.end();
