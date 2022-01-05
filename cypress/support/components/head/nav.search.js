
class NavSearch {

    clickTopNavSearch() {
        return cy.get('[data-qa="top_nav_search"]').click();
    }

    get inputSearch() {
        return cy.get('[data-qa="focusable_search_input"]', { timeout: 10000 });
    }

    searchText(text) {
        cy.get('[data-qa="top_nav_search"]').click();
        cy.wait(500);
        this.inputSearch.clear();
        this.inputSearch.type(text)
        .type('{enter}');
        cy.wait(500);

        cy.get('[data-qa="tabs_full_width_class"]', { timeout: 10000 })
        .should('be.visible');
    }

    retryLatestSearch() {
        this.clickTopNavSearch();
        cy.get('[data-id="c-search_autcomplete__suggestion_0"]')
        .click();
    }
}

const Search = new NavSearch();
export { Search };