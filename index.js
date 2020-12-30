const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const puppeteer = require("puppeteer");

app.get("/", async (req, res) => {
  const { query } = req;

  // Generate the full URL out of the given query parameters
  let url = `https://sarudoli.axiohm.cz/private-print/layer/${query.token}?layerId=${query.layerId}`;

  if (query.areaId !== undefined) {
    url = url + "&areaId=" + query.areaId;
  }

  url = `${url}#/${query.viewParams}`;

  //   url =
  //     "http://localhost:8080/?layerId=547&areaId=33#/4@50.11149878997134,14.369878116845927,15,hybrid;false,true,false,false-%5B332,414,532,415,416,399,29,542,426,547,659,588,589,590,591,592,593,594,595,596,656,657,585,586,587,658,671,672,673,674,675,676,677,678,680%5D-%7B%22399%22:%2250%22,%22415%22:%2250%22,%22416%22:%2250%22,%22547%22:%221%22,%22585%22:%220%22,%22680%22:%220.3%22%7D-%5B547,658,659%5D-%5B547,658%5D-%5B72,100,168,169,170,171,110,624,585,532,414,674,671%5D-%5B1347,1300,1293,1352,1359,1335,1391%5D";

  try {
    // Start puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    // const page = await browser.newPage();
    // await page.goto("http://google.com");
    // const image = await page.screenshot({ fullPage: true });
    // await browser.close();
    // res.set("Content-Type", "image/png");
    // res.send(image);

    const page = await browser.newPage();
    console.log(url, "goto");
    // Load URL
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60 * 1000,
    });

    console.log("waitForTimeout");
    await page.waitForTimeout(3000);
    console.log("[DONE] waitForTimeout");

    const data = await page.pdf({
      format: "A3",
      landscape: false,
      margin: {
        top: "8mm",
        right: "8mm",
        bottom: "8mm",
        left: "8mm",
      },
      preferCSSPageSize: true,
      // printBackground: true,
    });
    console.log("[DONE] pdf");
    await browser.close();
    console.log("[DONE] browser.close()");
    // Set the s-maxage property which caches the images then on the Vercel edge
    // res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
    res.setHeader("Content-Type", "application/pdf");
    // write the image to the response with the specified Content-Type
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () =>
  console.log(`sample-expressjs app listening on port ${port}!`)
);
