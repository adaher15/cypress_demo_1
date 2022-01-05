import { InputContainer } from '../../support/components/main/input.container';
import { MainMessage } from '../../support/components/main/main.message.container';
import { ChannelsTab } from '../../support/components/sidebars/channels.bar';
import { Search } from '../../support/components/head/nav.search';


describe('example to-do app', () => {
    let messageValue;
    beforeEach(() => {
        // Make sure user is logged in
        cy.visit('/');
        cy.setCookie('shown_download_ssb_modal', '1');
        cy.setCookie('show_download_ssb_banner', '1');
        cy.setCookie('no_download_ssb_banner', '1');
        cy.get('[data-qa="login_email"]').type(Cypress.env('username'));
        cy.get('[data-qa="login_password"]').type(Cypress.env('password'));
        cy.get('[data-qa="signin_button"]').click();
        ChannelsTab.navigateToGeneralChannel();
        cy.pause();
        MainMessage.deleteAllMessages();
        cy.pause();
    });

    afterEach(() => {
        // Always make sure we are in general channel first 
        ChannelsTab.navigateToGeneralChannel();
        // clear new messages
        MainMessage.deleteMessage(messageValue);
    });

    it.skip('Send simple message', () => {
        // Navigate to general channel first 
        ChannelsTab.navigateToGeneralChannel();

        // Send message 1
        messageValue = `Hello World ${new Date().getTime()}`;
        InputContainer.sendMessage(messageValue);
        // Assert message was displayed
        MainMessage.getMessage(messageValue).should('be.visible');

    });

    it('Send and Save message', () => {
         // Navigate to general channel first 
         ChannelsTab.navigateToGeneralChannel();

         // Send message 1
         messageValue = `Hello World ${new Date().getTime()}`;
         InputContainer.sendMessage(messageValue);

         // Assert message was displayed
         MainMessage.getMessage(messageValue).should('be.visible');

        // Save message
        MainMessage.saveMessage(messageValue);
        // For some reasons there is a delay (probably caching) between
        // the time we send a message and we could search it 
        cy.wait(3000);
        Search.searchText('has:star');
        const textFound = MainMessage.getSearchedMessage(messageValue, 3, 'has:star');
        cy.log('___ FINAL ARRAY ', textFound);
        cy.pause();
        // expect(textFound).to.be.true
        // cy.expect(array).to.contains(messageValue);
        // expect(array).to.include(messageValue);
        //.recursiveSearch(5, 'has:star');
        // .invoke('text')
        // .should('eq', messageValue);

    });
})