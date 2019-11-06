/// <reference types="Cypress" />

describe("My first test", function() {
  it("visit kitchen sink", function() {
    cy.visit("https://example.cypress.io");
    cy.contains("type").click();
    cy.url().should("include", "/commands/actions");
  });
});
