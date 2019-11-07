/// <reference types="Cypress" />

describe("Shop management", function() {
  this.beforeEach(function() {
    cy.visit("/");
    cy.get("input[name=username]").type("vutnq@gmail.com");
    cy.get("input[name=password]").type("123456");
    cy.get("form")
      .submit()
      .wait(1000);
  });

  it("should create a shop", function() {
    cy.visit("/shops/new");

    cy.get("input#shop-name").type("Cypress Testing Shop");
    cy.get("form").submit();
    cy.get("table").should("contain.text", "Cypress Testing Shop");
  });

  it("should edit a shop", function() {
    cy.visit("/shops/1/edit");

    cy.get("input#shop-name")
      .clear()
      .type("Shop SH100 from Cypress");
    cy.get("form").submit();

    cy.get("table").should("contain.text", "Shop SH100 from Cypress");
  });
});
