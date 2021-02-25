import { screen, render, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import cases from "jest-in-case";
import OrderForm from "./OrderForm";

describe("OrderForm", () => {
  test("given valid input, it submits the form with the input", async () => {
    const onSubmit = jest.fn();
    render(<OrderForm onSubmit={onSubmit} />);

    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const color = screen.getByLabelText(/color/i);
    const quantity = screen.getByLabelText(/quantity/i);
    const submitButton = screen.getByText(/submit/i);

    user.type(firstName, "Bob");
    user.type(lastName, "Johnson");
    user.type(email, "bob@johnson.com");
    user.selectOptions(color, "blue");
    user.type(quantity, "5");

    user.click(submitButton);

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob@johnson.com",
        color: "blue",
        quantity: 5,
      })
    );
  });
});

const validInput = {
  firstName: "Bob",
  lastName: "Johnson",
  email: "bob@johnson.com",
  color: "red",
  quantity: "4",
};

cases(
  "invalid input will not submit the form",
  async (opts) => {
    const onSubmit = jest.fn();
    render(<OrderForm onSubmit={onSubmit} />);

    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const color = screen.getByLabelText(/color/i);
    const quantity = screen.getByLabelText(/quantity/i);
    const submitButton = screen.getByText(/submit/i);

    user.type(firstName, opts.firstName);
    user.type(lastName, opts.lastName);
    user.type(email, opts.email);
    user.selectOptions(color, opts.color);
    user.type(quantity, opts.quantity);
    user.type(email, "some invalid email");

    user.click(submitButton);

    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());
  },
  [
    { name: "missing email", ...validInput, email: "" },
    { name: "invalid email", ...validInput, email: "bob.com" },
    { name: "missing firstname", ...validInput, firstName: "" },
    { name: "missing lastname", ...validInput, lastName: "" },
    { name: "missing color", ...validInput, color: "none" },
    { name: "missing quantity", ...validInput, quantity: "" },
    { name: "invalid quantity", ...validInput, quantity: "50" },
  ]
);
