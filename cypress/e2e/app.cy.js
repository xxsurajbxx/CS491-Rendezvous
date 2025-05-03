describe('Rendezvous', () => {
    // Ignore known harmless redirect errors from Next.js
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('NEXT_REDIRECT')) {
        return false
      }
    })
  
    it('Log in, Create Event, Delete Event, Find Event, RSVP for Event, Make Carpool, Delete Carpool', () => {
      cy.visit('http://localhost:3000/')
      cy.url().should('include', '/auth')
      cy.wait(1000)
  
      // Log in
      cy.get('input[placeholder="Email"]').type('asr27@njit.edu')
      cy.get('input[placeholder="Password"]').type('password')
      cy.get('button[type="submit"]').click()
      cy.url().should('eq', 'http://localhost:3000/')
      cy.wait(1000)
  
      // Create Event
      cy.contains('a', 'Create Event').click()
      cy.url().should('include', '/events/create')
      cy.wait(1000)
  
      cy.get('input[placeholder="Enter event name"]').type('Test Event')
      cy.wait(1000)
  
      cy.get('input[placeholder="Enter address here"]')
        .type('323 Dr. Martin Luther King Jr. Boulevard, Newark, NJ')
      cy.wait(2000)
  
      cy.get('.geoapify-autocomplete-item', { timeout: 15000 })
        .should('be.visible')
        .first()
        .click()
      cy.wait(1000)
  
      const dayjs = require('dayjs')
      const tomorrow = dayjs().add(1, 'day')
      const startTime = '07:00'
      const endTime = '17:00'
  
      cy.contains('button', 'Pick a date and time').first().click()
      cy.get('[role="gridcell"]').contains(new RegExp(`^${tomorrow.date()}$`)).click()
      cy.get('input[type="time"]').first().clear().type(startTime)
      cy.get('body').click(0, 0)
      cy.wait(1000)
  
      cy.contains('button', 'Pick a date and time').last().click()
      cy.get('[role="gridcell"]').contains(new RegExp(`^${tomorrow.date()}$`)).click()
      cy.get('input[type="time"]').last().clear().type(endTime)
      cy.get('body').click(0, 0)
      cy.wait(1000)
  
      cy.get('textarea[placeholder="Enter event description"]').type('This is the description for the test event')
      cy.contains('button', 'Create Event').click()
      cy.url().should('match', /\/events\/\d+/)
      cy.wait(1000)
  
      // Offer and delete carpool
      cy.contains('button', 'Offer a Carpool').click()
      cy.get('#seats').should('be.visible').clear().type('7')
      cy.get('#notes').clear().type('Please arrive at the station by 6 AM.')
      cy.contains('button', 'Create Carpool').click()
      cy.wait(1000)
  
      cy.contains('button', 'Delete Carpool').click()
      cy.contains('button', 'Offer a Carpool').should('be.visible')
      cy.wait(1000)
  
      // Delete event
      cy.contains('button', 'Delete Event').click()
      cy.url().should('eq', 'http://localhost:3000/')
      cy.wait(1000)
  
      // Search and RSVP
      cy.get('input[placeholder="Search..."]').type('a')
      cy.wait(1000)
      cy.contains('button', 'RSVP to Event').first().click()
      cy.wait(1000)
      cy.contains('button', 'Cancel').first().click()
      cy.wait(1000)
      cy.contains('button', 'RSVP to Event').first().click()
      cy.wait(1000)
  
      // View profile and RSVP flow
      cy.get('img[alt="Profile"]').click()
      cy.url().should('match', /\/users\/\d+/)
      cy.wait(1000)
  
      cy.get('div[data-slot="card"]').first().click()
      cy.url().should('match', /\/events\/\d+/)
      cy.wait(1000)
  
      cy.contains('button', 'Cancel RSVP').click()
      cy.wait(1000)
      cy.contains('button', 'RSVP to Event').click()
      cy.wait(1000)
      cy.contains('button', 'Cancel RSVP').click()
      cy.wait(1000)
  
      // View other user's profile
      cy.get('a[href^="/users/"]').last().click()
      cy.url().should('match', /\/users\/\d+/)
      cy.contains('button', 'Add Friend').should('be.visible')
      cy.wait(1000)
  
      // Navigate using <a> elements
      cy.contains('a', 'Discover').click()
      cy.url().should('include', '/discover')
      cy.wait(1000)
  
      cy.contains('a', 'About').click()
      cy.url().should('include', '/about')
      cy.wait(1000)
  
      // Click the link that has a span containing "Rendezvous"
      cy.contains('a span', 'Rendezvous').click()
      cy.url().should('eq', 'http://localhost:3000/')
      cy.wait(1000)
  
      // Logout
      cy.contains('button', 'Logout').click()
      cy.url().should('include', '/auth')
      cy.wait(1000)
    })
  })
  