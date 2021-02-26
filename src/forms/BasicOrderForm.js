import { useState } from "react";
import { Input, Select, Option, Button } from "./FormInputs";

function isValidEmail(email) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}

export default function OrderForm(props) {
  const [state, setState] = useState({
    firstName: { value: "", valid: false },
    lastName: { value: "", valid: false },
    email: { value: "", valid: false },
    color: { value: "red", valid: true },
    quantity: { value: "", valid: false },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formIsValid = Object.values(state).every((field) => field.valid);

    if (formIsValid) {
      const data = {
        firstName: state.firstName.value,
        lastName: state.lastName.value,
        email: state.email.value,
        color: state.color.value,
        quantity: parseInt(state.quantity.value),
      };
      props.onSubmit(data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const isEmpty = value === "" || value === undefined;

    let isValid = true;

    if (isEmpty) {
      isValid = false;
    }

    if (name === "email" && !isValidEmail(value)) {
      isValid = false;
    }

    if (name === "quantity" && parseInt(value) > 5) {
      isValid = false;
    }

    setState({
      ...state,
      [name]: {
        ...state[name],
        value,
        valid: isValid,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-10">
      <div className="space-y-2">
        <div className="flex space-x-4">
          <label htmlFor="firstName" className="flex flex-col">
            First name
            <Input
              type="text"
              id="firstName"
              name="firstName"
              onChange={handleInputChange}
              value={state.firstName.value}
            />
          </label>
          <label htmlFor="lastName" className="flex flex-col">
            Last name
            <Input
              type="text"
              id="lastName"
              name="lastName"
              onChange={handleInputChange}
              value={state.lastName.value}
            />
          </label>
        </div>
        <label htmlFor="email" className="flex flex-col">
          Email
          <Input
            type="text"
            id="email"
            name="email"
            onChange={handleInputChange}
            value={state.email.value}
          />
        </label>
      </div>
      <div className="space-y-2">
        <div className="flex space-x-4">
          <label htmlFor="color" className="flex flex-col">
            Color
            <Select
              name="color"
              id="color"
              onChange={handleInputChange}
              value={state.color.value}
            >
              <Option value="">Select...</Option>
              <Option value="red">Red</Option>
              <Option value="blue">Blue</Option>
              <Option value="green">Green</Option>
            </Select>
          </label>
          <label htmlFor="quantity" className="flex flex-col">
            Quantity
            <Input
              type="number"
              value={state.quantity.value}
              name="quantity"
              id="quantity"
              min="1"
              max="5"
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="my-6">
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </form>
  );
}
