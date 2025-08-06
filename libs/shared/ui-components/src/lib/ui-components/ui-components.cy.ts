import { mount } from 'cypress/angular';

import { UiComponents } from './ui-components';

describe('UiComponents', () => {
  it('should mount and display content', () => {
    mount(UiComponents);
    cy.contains('UiComponents works!').should('exist');
    cy.get('.btn-primary').should('have.css', 'border-radius', '0.375rem');
  });
});
