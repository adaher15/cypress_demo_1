
class Channels {

    navigateToGeneralChannel() {
        // Wait for channels list
        cy.get('div[data-qa="channels"]', { timeout: 10000 }).should('be.visible');
        // Click on General channel
        cy.get('span[data-qa="channel_sidebar_name_general"]')
        .contains('general')
        .should('be.visible')
        .click();
    }
}

const ChannelsTab = new Channels();
export { ChannelsTab };