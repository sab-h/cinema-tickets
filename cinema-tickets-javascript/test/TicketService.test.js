import TicketService from "../src/pairtest/TicketService";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

describe("TicketService", () => {
  const TicketServiceInstance = new TicketService();
  test("Returns true when the purchase is made", () => {
    expect(
      TicketServiceInstance.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1)
      )
    ).toBe(true);
    expect(
      TicketServiceInstance.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1),
        new TicketTypeRequest("INFANT", 1)
      )
    ).toBe(true);
  });

  test("Throws an error when the account ID is invalid", () => {
    expect(() =>
      TicketServiceInstance.purchaseTickets(
        0,
        new TicketTypeRequest("ADULT", 1)
      )
    ).toThrowError(new InvalidPurchaseException("Invalid account ID: 0."));

    expect(() =>
      TicketServiceInstance.purchaseTickets(
        -2,
        new TicketTypeRequest("ADULT", 1)
      )
    ).toThrowError(new InvalidPurchaseException("Invalid account ID: -2."));

    expect(() =>
      TicketServiceInstance.purchaseTickets(
        "text",
        new TicketTypeRequest("ADULT", 1)
      )
    ).toThrowError(new InvalidPurchaseException("Invalid account ID: text."));
  });

  test("Throws an error when the ticket amount is invalid", () => {
    expect(() =>
      TicketServiceInstance.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 0)
      )
    ).toThrowError(
      new InvalidPurchaseException(
        "Cannot purchase zero or negative number of tickets."
      )
    );
    expect(() =>
      TicketServiceInstance.purchaseTickets(
        5,
        new TicketTypeRequest("ADULT", -2)
      )
    ).toThrowError(
      new InvalidPurchaseException(
        "Cannot purchase zero or negative number of tickets."
      )
    );
    expect(() =>
      TicketServiceInstance.purchaseTickets(
        7,
        new TicketTypeRequest("ADULT", "text")
      )
    ).toThrowError(TypeError);
  });
  test("Throws an error when the ticket type is invalid", () => {
    expect(() =>
      TicketServiceInstance.purchaseTickets(
        3,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1),
        new TicketTypeRequest("INFANT", 1),
        new TicketTypeRequest("SOME", 1)
      )
    ).toThrowError(TypeError);
    expect(() =>
      TicketServiceInstance.purchaseTickets(
        9,
        new TicketTypeRequest("HELLOWORLD", 10)
      )
    ).toThrowError(TypeError);
  });
});
