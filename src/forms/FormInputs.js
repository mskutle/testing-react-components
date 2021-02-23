import React from "react";

export const Input = React.forwardRef((props, ref) => (
  <input
    ref={ref}
    className="border rounded-md focus:outline-none focus:border-blue-500 px-2 py-1"
    {...props}
  />
));

export const Select = React.forwardRef((props, ref) => (
  <select
    ref={ref}
    className="border rounded-md focus:outline-none focus:border-blue-500 px-2 py-1 appearance-none"
    {...props}
  >
    {props.children}
  </select>
));

export const Option = React.forwardRef((props, ref) => (
  <option ref={ref} {...props}>
    {props.children}
  </option>
));

export const Button = (props) => (
  <button
    className="bg-purple-900 text-white px-6 py-2 rounded-full mt-4 focus:outline-none focus:border focus:border-blue-500 w-min"
    {...props}
  >
    {props.children}
  </button>
);
