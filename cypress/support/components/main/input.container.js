

class TextSender {

    sendButton() {
        return cy.get('[data-qa="texty_send_button"]', { timeout: 10000 });
    }

    get inputMessage() {
        return cy.get('[data-qa="message_input"]');
    }

    sendMessage(messageValue) {
        this.inputMessage.click();
        this.inputMessage.clear();
        cy.wait(1000);
        this.inputMessage.type(messageValue);
        this.inputMessage.type('{enter}');
        // this.sendButton
        // .should('not.have.class', 'c-wysiwyg_container__button--disabled')
        // .click();
    }
}

const InputContainer = new TextSender();
export { InputContainer };