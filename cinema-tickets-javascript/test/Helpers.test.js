import {
    validateAccountID,
    getTicketData,
    validateTicketPurchase,
  } from "../src/pairtest/lib/Helpers.js";
  import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
  import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
  
  describe("Helpers", () => {
    test("Returns true if the purchase is valid", () => {
      expect(
        validateTicketPurchase({
          ADULT: { count: 1, price: 20 },
          CHILD: { count: 0, price: 0 },
          INFANT: { count: 0 },
        })
      ).toBe(true);
      expect(
        validateTicketPurchase({
          ADULT: { count: 1, price: 20 },
          CHILD: { count: 1, price: 10 },
          INFANT: { count: 1 },
        })
      ).toBe(true);
      expect(
        validateTicketPurchase({
          ADULT: { count: 1, price: 20 },
          CHILD: { count: 0, price: 0 },
          INFANT: { count: 1 },
        })
      ).toBe(true);
    });
  
    test("Throws an error when the number of tickets is more than 20", () => {
      expect(() =>
        validateTicketPurchase({
          ADULT: { count: 7, price: 40 },
          CHILD: { count: 13, price: 30 },
          INFANT: { count: 3 },
        })
      ).toThrowError(
        new InvalidPurchaseException(
          "Cannot purchase more than 20 tickets at a time."
        )
      );
    });
  
    test("Throws an error when the number of tickets is less than 1", () => {
      expect(() =>
        validateTicketPurchase({
          ADULT: { count: 0, price: 0 },
          CHILD: { count: 0, price: 0 },
          INFANT: { count: 0 },
        })
      ).toThrowError(
        new InvalidPurchaseException(
          "Cannot purchase zero or negative number of tickets."
        )
      );
      expect(() =>
        validateTicketPurchase({
          ADULT: { count: -5, price: 0 },
          CHILD: { count: 0, price: 0 },
          INFANT: { count: 0 },
        })
      ).toThrowError(
        new InvalidPurchaseException(
          "Cannot purchase zero or negative number of tickets."
        )
      );
    });
  
    test("Throws an error when the number of infant/child tickets is more than 0 and the number of adult tickets is 0", () => {
      expect(() =>
        validateTicketPurchase({
          ADULT: { count: 0, price: 0 },
          CHILD: { count: 0, price: 0 },
          INFANT: { count: 1 },
        })
      ).toThrowError(
        new InvalidPurchaseException(
          "Infant and child tickets cannot be purchased without adult tickets."
        )
      );
      expect(() =>
        validateTicketPurchase({
          ADULT: { count: 0, price: 0 },
          CHILD: { count: 5, price: 50 },
          INFANT: { count: 1 },
        })
      ).toThrowError(
        new InvalidPurchaseException(
          "Infant and child tickets cannot be purchased without adult tickets."
        )
      );
    });
  
    test("Checks the if price and the amount of tickets is correct", () => {
      expect(
        getTicketData(
          new TicketTypeRequest("ADULT", 5),
          new TicketTypeRequest("CHILD", 5),
          new TicketTypeRequest("INFANT", 5)
        )
      ).toEqual({
        ADULT: { count: 5, price: 100 },
        CHILD: { count: 5, price: 50 },
        INFANT: { count: 5 },
      });
    });
  
    test("Throws an error if the account ID is invalid", () => {
      expect(validateAccountID(0)).toBe(false);
      expect(validateAccountID(-2)).toBe(false);
      expect(validateAccountID("text")).toBe(false);
    });
  
    test("Returns true if the account ID is valid", () => {
      expect(validateAccountID(1)).toBe(true);
      expect(validateAccountID(2)).toBe(true);
      expect(validateAccountID(3)).toBe(true);
    });
  });
  