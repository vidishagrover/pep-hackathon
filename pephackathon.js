const puppy = require("puppeteer");
const fs = require("fs");
const id = "fahato4360@shzsedu.com";
const pass = "Mypassword23@";
let finalData = [];
let placesTosearch = ["Goa" , "Chennai"];
async function main() {
    const browser = await puppy.launch({
        headless: false,
        defaultViewport: false,
        args : ["--start-maximized"]
    });
    const page = await browser.newPage();
    await page.goto('https://www.trivago.in/');
        for(let i = 0; i < 1; i++){
           await location(page, placesTosearch[i], i);
           console.log(placesTosearch[i])
        }
        fs.writeFileSync("hotel.json", JSON.stringify(finalData));
        await page.waitForSelector("div[data-qa = 'view-map']", { visible: true });
        await page.click("div[data-qa = 'view-map']");
        await page.waitForSelector("div[data-item='97608']", { visible: true });
        await page.click("div[data-item='97608']");
        await page.waitForSelector("div[data-item='99495']", { visible: true });
        await page.click("div[data-item='99495']");
        await page.waitForSelector("div[data-actions='imageClick']", { visible: true });
        await page.click("div[data-actions='imageClick']");
}
async function location(page, place, idx){
    await page.waitForSelector("#querytext", { visible: true });
    await page.click("#querytext");
    await page.type("#querytext", place);
    await page.keyboard.press("Enter");
if(idx == 0){
    await page.waitForSelector("tr td time[datetime='2021-04-24']", { visible: true });
    await page.click("tr td time[datetime='2021-04-24']");
    await page.click(".cal-day.cal-is-weekend.cal-is-unselectable");
    await page.click("tr td time[datetime='2021-04-25']"); 
}
     await page.click(".btn.btn--primary.btn--regular.search-button.js-search-button");
    await page.waitForSelector(".item-link.name__copytext", { visible: true });
    let tab = await page.$$(".item-link.name__copytext");
    for (let i = 0; i < tab.length; i++) {
        let hName = await page.evaluate(function (ele) {
            return ele.textContent;
        }, tab[i]);
        finalData.push({ "HotelName": hName, "Details" : []});
        await getRatings(page , i);
    }
}
async function getRatings( page , idx){
    let ratings = await page.$$("span[itemprop='ratingValue']");
    let location = await page.$$(".details-paragraph.details-paragraph--location.location-details");
    let price = await page.$$(".accommodation-list__price--71209");
    let points = await page.evaluate(function (ele) {
        return ele.textContent;
    }, ratings[idx]);
    let place = await page.evaluate(function (ele) {
        return ele.textContent;
    }, location[idx]);
    let money = await page.evaluate(function (ele) {
        return ele.textContent;
    }, price[idx]);
    finalData[idx]["Details" ].push({"Ratings " : points, "Location" : place, "Lowest Price" : money});
}


main()
// onetrust-pc-sdk