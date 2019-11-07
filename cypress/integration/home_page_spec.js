/// <reference types="Cypress" />

describe("Visit Petservice", function() {
  it("should show dashboard", function() {
    cy.visit("/");

    cy.get("input[name=username]")
      .type("vutnq@gmail.com")
      .then(username => {
        cy.get("input[name=password]")
          .type("123456")
          .then(password => {
            cy.get("form")
              .submit()
              .then(() => {
                cy.window()
                  .its("localStorage.token")
                  .should("not.be.undefined");
              });
          });
      });
  });
});
