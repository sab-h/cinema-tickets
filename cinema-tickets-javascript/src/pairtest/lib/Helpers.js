import TicketTypeRequest from "./TicketTypeRequest.js";
import InvalidPurchaseException from "./InvalidPurchaseException.js";

// This will return false account is invalid. 
export function validateAccountID(accountId) {
  return Number.isInteger(accountId) && accountId > 0;
}

export function getTicketData(...ticketTypeRequests) {
  const TICKETS = {
    // We don't need to store the infant ticket price as they are free. 
    ADULT: { count: 0, price: 0 },
    CHILD: { count: 0, price: 0 },
    INFANT: { count: 0 },
  };

  for (let i = 0, len = ticketTypeRequests.length; i < len; i++) {
    const REQUEST = ticketTypeRequests[i];
    
    // We check and fail early if the request is not an instance of TicketTypeRequest
    if (!(REQUEST instanceof TicketTypeRequest)) {
      throw new InvalidPurchaseException("Invalid ticket type request.");
    }
    // We cache the values of the getters to avoid calling them multiple times
    const TICKET_TYPE = REQUEST.getTicketType();
    const TICKET_AMOUNT = REQUEST.getNoOfTickets();

    // We use a switch statement to check value of the 'type' variable
    // We also use the default case to throw an exception if the value is not valid
    // The price is hardcoded here. 
    switch (TICKET_TYPE) {
      case "ADULT":
        TICKETS.ADULT.count += TICKET_AMOUNT;
        TICKETS.ADULT.price += 20 * TICKET_AMOUNT;
        break;
      case "CHILD":
        TICKETS.CHILD.count += TICKET_AMOUNT;
        TICKETS.CHILD.price += 10 * TICKET_AMOUNT;
        break;
      case "INFANT":
        TICKETS.INFANT.count += TICKET_AMOUNT;
        break;
      default:
        throw new InvalidPurchaseException(
          "Invalid ticket type: " + TICKET_TYPE
        );
    }
  }

  return TICKETS;
}

export function validateTicketPurchase(ticketData) {
  if (
    ticketData.ADULT.count + ticketData.CHILD.count + ticketData.INFANT.count > 20
  ) {
    throw new InvalidPurchaseException(
      "Cannot purchase more than 20 tickets at a time."
    );
  }

  if (
    (ticketData.INFANT.count > 0 || ticketData.CHILD.count > 0) && ticketData.ADULT.count === 0
  ) {
    throw new InvalidPurchaseException(
      "Infant and child tickets cannot be purchased without adult tickets."
    );
  }
  if (
    ticketData.ADULT.count + ticketData.CHILD.count + ticketData.INFANT.count < 1
  ) {
    throw new InvalidPurchaseException(
      "Cannot purchase zero or negative number of tickets."
    );
  }

  return true;
}
