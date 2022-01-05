import { Search } from "../head/nav.search";

class MainMessages {
  /**
   * Find an element with text messageValue and return it
   * @param {string} messageValue
   * @returns element
   */
  getMessage(messageValue) {
    return cy
      .get('[data-qa="message_container"]')
      .get('div[data-qa="message_content"]', { timeout: 10000 })
      .contains(messageValue);
  }

  deleteAllMessages() {
    cy
    .get('div[data-qa="message_content"] div.p-rich_text_section', { timeout: 10000 })
    .each(($el, index) => {
        cy.log('_____ ', $el, index);
        const messageValue = $el.text();
        this.deleteMessage(messageValue)
    });
  }

  getSearchedMessage(message, retries, key) {
    cy.get("div.c-search__container", { timeout: 10000 }).then(($container) => {
      if (
        $container.find(
          '[data-qa="search_result"] [data-qa="block-kit-renderer"]'
        ).length > 0
      ) {
        $container.find(".p-rich_text_section", { timeout: 10000 }).each(
          ($el, index) => {
            const text = $el.text();
            cy.log("_____", index, text, message);
            if (message == text) {
              return true;
            }
          }
        );
      }
      // Message was not found repeat the search
      if (retries === 0) {
        return false;
      }
      cy.wait(5000);
      Search.retryLatestSearch();
      return this.getSearchedMessage(message, retries - 1);
    });

    // cy.get(".p-rich_text_section", { timeout: 10000 }).each(($el, index) => {
    //   const text = $el.text();
    //   cy.log("_____", index, text, message);
    //   if (message == text) {
    //     return true;
    //   }
    // });
    // if (retries === 0) {
    //   return false;
    // }
    // // Message was not found repeat the search
    // cy.wait(4000);
    // Search.searchText(key);
    // return this.getSearchedMessage(message, retries - 1);
  }

  expandMoreMenu() {
    cy.get('[data-qa="more_message_actions"]').click();
  }

  clickDeleteButton() {
    cy.get('[data-qa="delete_message"]').click();
  }

  clickSaveIcon() {
    cy.get('[data-qa="save_message"]').click();
  }

  saveMessage(messageValue) {
    cy.wait(1000);
    this.getMessage(messageValue).click();

    // click on save icon
    this.clickSaveIcon();
  }

  deleteMessage(messageValue) {
    this.getMessage(messageValue).should("be.visible");
    cy.wait(1000);
    this.getMessage(messageValue).click();

    // find delete menu and delete message
    this.expandMoreMenu();
    this.clickDeleteButton();
    // confirm delete
    cy.get('button[data-qa="dialog_go"]').click();
  }

  /**
   * Retry until you find the text we search for.
   * There is an issue with Slack search: there is a delay
   * @param {number} retries
   * @param {string} text
   * @returns
   */
  recursiveSearch(retries, text) {
    Search.searchText(text);
    if (retries == 0) {
      return undefined;
    }
    cy.get("div.c-search__container", { timeout: 10000 }).then(($container) => {
      // cy.log($container.find('[data-qa="search_result"] [data-qa="block-kit-renderer"]').length);
      if (
        $container.find(
          '[data-qa="search_result"] [data-qa="block-kit-renderer"]'
        ).length === 0
      ) {
        cy.wait(1000);
        // Search.searchText(text);
        this.recursiveSearch(retries - 1);
      }
    });
  }

  getNumberOfResults() {
    let len = 0;
    cy.get("div.c-search__container").then(($container) => {
      len = $container.find(
        '[data-qa="search_result"] [data-qa="block-kit-renderer"]'
      ).length;
      cy.log(
        "__----__---!!!: ",
        len,
        " | ",
        $container.find(
          '[data-qa="search_result"] [data-qa="block-kit-renderer"]'
        ).length
      );
      cy.log("__----__---NO !!!: ", $container.find("#no-results").length);
    });
    return len;
  }

  findSearchResult(shouldFindOne) {
    // There is a probably a caching issue with Slack search
    // We have to repeat the search many times to work.
    let retry = 5;
    // cy.log(this.getNumberOfResults(), '__222____ _____ ', $container.find('[data-qa="search_result"] [data-qa="block-kit-renderer"]').length);
    while (retry > 0) {
      cy.log("----2-2-2--------", MainMessage.getNumberOfResults());
      // If we are supposed to find a result but we have zero, we should wait and retry
      if (this.getNumberOfResults() === 0 && shouldFindOne) {
        cy.wait(500);
        retry -= 1;
        cy.pause();
        Search.retryLatestSearch();
      } else {
        cy.log("__---_____- FOUND ONE");
        return cy
          .get('[data-qa="search_result"] [data-qa="block-kit-renderer"]')
          .get("div.p-rich_text_section");
      }
    }
    // cy.get("div.c-search__container").then($container => {
    //     let retry = 5;
    //     while (retry > 0 ){
    //         cy.log('__111____ _____ ', $container.find("#no-results").length);
    //         cy.log('__222____ _____ ', $container.find('[data-qa="search_result"] [data-qa="block-kit-renderer"]').length);
    //         if ($container.find("#no-results").length > 0 && shouldFindOne) {
    //             //repeat the search
    //             cy.wait(500);
    //             Search.retryLatestSearch();
    //             cy.pause();
    //             retry -=1;
    //         }else{
    //             return cy.get('[data-qa="search_result"] [data-qa="block-kit-renderer"]')
    //             .get('div.p-rich_text_section');
    //         }

    //     }
    // });
  }
}

const MainMessage = new MainMessages();
export { MainMessage };
