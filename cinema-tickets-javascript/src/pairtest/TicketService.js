import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import {
  validateAccountID,
  getTicketData,
  validateTicketPurchase,
} from "./lib/Helpers.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #validateAccountID = validateAccountID;
  #getTicketData = getTicketData;
  #validateTicketPurchase = validateTicketPurchase;
  #ticketPaymentService = new TicketPaymentService();
  #seatReservationService = new SeatReservationService();
  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (!this.#validateAccountID(accountId)) {
      throw new InvalidPurchaseException(
        "Invalid account ID: " + accountId + "."
      );
    }

    const ALL_TICKETS = this.#getTicketData(...ticketTypeRequests);
    if (!this.#validateTicketPurchase(ALL_TICKETS)) {
      throw new InvalidPurchaseException("Invalid ticket purchase.");
    }

    const TOTAL_SEATS = ALL_TICKETS.ADULT.count + ALL_TICKETS.CHILD.count;
    const TOTAL_COST = ALL_TICKETS.ADULT.price + ALL_TICKETS.CHILD.price;
    this.#ticketPaymentService.makePayment(accountId, TOTAL_COST);
    this.#seatReservationService.reserveSeat(accountId, TOTAL_SEATS);
    return true;
  }
}
