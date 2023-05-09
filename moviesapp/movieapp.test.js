const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});


describe("Test the Movies App", () => {
    const addMovie = async (movieTitle) => {
        await driver.get("http://localhost:3000/");
    
        await driver.findElement(By.css('input[name="movieTitle"]')).sendKeys("Encanto");
        await driver.findElement(By.css('button[type="submit"]')).click();
    
        const addedMovie = await driver.wait(until.elementLocated(By.css("#movies-list li label")),1000);
        expect(await addedMovie.getText()).toBe("Encanto");
      };
      
    test("Remove a movie", async () => {
        await driver.get("http://localhost:3000/");
        await addMovie("Encanto");
        const movieAdded = await driver.wait(until.elementLocated(By.css("#movies-list li")),1000);
        await movieAdded.findElement(By.css("button.delete-btn")).click();
        //An expectation for checking that an element is not attached to the DOM of a page. This is the opposite of 'presenceOf'.
        await driver.wait(until.stalenessOf(movieAdded),1000)
    });

    test("Can check movie watched", async() => {
        //Navigate 
        await driver.get("http://localhost:3000/");

        //add movie
        await addMovie("Encanto");

        //get the list li 
        const movieAdded = await driver.wait(until.elementLocated(By.css("#movies-list li")),1000);
        //Get the checkbox is checked
        await movieAdded.findElement(By.css('input[type="checkbox"]')).click();      
    });


    test('Notifications appear after deletion', async() => {
        //Navigate 
        await driver.get("http://localhost:3000/");

        //add movie
        await addMovie("Encanto");

        //get the list li 
        const movieAdded = await driver.wait(until.elementLocated(By.css("#movies-list li")),1000);

        //delete button
        await movieAdded.findElement(By.css("button.delete-btn")).click();

        await driver.wait(until.elementTextContains(driver.findElement(By.id("message")), "deleted!"),1000);

    }); 
})
