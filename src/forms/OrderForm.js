import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input, Select, Option, Button } from "./FormInputs";

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  color: yup.string().required(),
  quantity: yup.number().min(1).max(5).required(),
});

export default function OrderForm(props) {
  const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    props.onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-10"
    >
      <div className="space-y-2">
        <div className="flex space-x-4">
          <label htmlFor="firstName" className="flex flex-col">
            First name
            <Input ref={register} type="text" id="firstName" name="firstName" />
          </label>
          <label htmlFor="lastName" className="flex flex-col">
            Last name
            <Input ref={register} type="text" id="lastName" name="lastName" />
          </label>
        </div>
        <label htmlFor="email" className="flex flex-col">
          Email
          <Input ref={register} type="text" id="email" name="email" />
        </label>
      </div>
      <div className="space-y-2">
        <div className="flex space-x-4">
          <label htmlFor="color" className="flex flex-col">
            Color
            <Select ref={register} name="color" id="color">
              <Option value="">Select...</Option>
              <Option value="red">Red</Option>
              <Option value="blue">Blue</Option>
              <Option value="green">Green</Option>
            </Select>
          </label>
          <label htmlFor="quantity" className="flex flex-col">
            Quantity
            <Input
              ref={register}
              type="number"
              name="quantity"
              id="quantity"
              min="1"
              max="5"
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
