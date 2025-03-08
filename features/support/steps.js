const { spec } = require("pactum");
const { expect, should } = require("chai");
// const { Before, Given, When, Then } = require("@cucumber/cucumber");

describe("Get a category on querystring", () => {
  it("should return results with one params type vegan", async () => {
    await spec()
      .get("http://localhost:3200/restaurants/data")
      .withQueryParams("type", "vegan")
      .expectStatus(200);
  });

  it("should return results with params type vegan and type vegetarian", async () => {
    await spec()
      .get("http://localhost:3200/restaurants")
      .withQueryParams({
        type: ["vegan", "vegetarian", "Veg Store"],
        limit: 100,
      })
      .expectStatus(200)
      .expectJsonLike({
        pagination: {
          page: 1,
          limit: 100,
          total: 9,
        },
      })
      .expect((ctx) => {
        expect(ctx.res.json.results)
          .to.be.instanceOf(Array)
          .and.lengthOf(ctx.res.json.pagination.total);
      })
      .toss();
  });
});
