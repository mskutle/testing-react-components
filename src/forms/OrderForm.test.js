import { screen, render, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
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
