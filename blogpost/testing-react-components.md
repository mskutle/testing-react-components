# Enhetstesting av React-komponenter

Automatiserte tester hjelper oss å sikre at kodeendringer ikke forårsaker utilsiktede endringer andre steder i kodebasen. Dette gjør det lettere å refaktorere, man sparer tid ved å bruke mindre tid på manuell testing og man kan forhindre en rekke bugs. God testdekning er med på å øke kvaliteten på kodebasen.

## Intro

Det finnes flere biblioteker som hjelper deg med å teste React-komponenter. De meste kjente er Enzyme og React Testing Library (RTL).

Hvor Enzyme lar deg inspisere state og annen implementasjon av en komponent, er RTL designet for å gjøre det enkelt å teste en komponent uten å måtte forholde seg til hvordan den er implementert. Dette er en god ting! I det øyeblikket testen din begynner å involvere seg i hvordan komponenten er implementert vil du oppleve at refaktorering av den samme komponenten kan få testene til å feile, selv om du ikke har endret på hvordan den fungerer for brukeren.

Vi kommer til å bruke React Testing Library i eksempelet senere, og da får du også se at vi kan bytte ut hele implementasjonen uten å måtte gjøre noen endringer i testen!

La oss se på et eksempel.

## Skjema for bestilling av munnbind

<img src="./screenshots/OrderForm.png" />

Skjemaet er forholdsvis enkelt, men vi ønsker å sikre noen ting:

- Alle feltene er påkrevd, og man skal ikke kunne sende inn skjemaet uten å ha fylt dem ut.
- E-postadressen må være en gyldig e-postadresse.
- Munnbind er mangelvare, så vi tillater maks 5stk per kunde.

#### OrderForm.js

```jsx
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
              <Option value="null">Select...</Option>
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
```

Her tegner vi opp skjemaet ved hjelp av `react-hook-form` (sammen med `yup` for å validere input).
Dersom man klikker på "Submit"-knappen - og alle påkrevde felter er utfylt - så kaller vi `props.onSubmit` med de utfylte dataene. Det er deretter opp til brukeren av OrderForm å definere hva som skjer med dataene.

### Vår første test

React Testing Library inneholder en rekke hjelpefunksjoner for å

- Rendre en komponent
- Kjøre spørringer mot DOM-en
- Interagere med komponenten - f.eks fylle ut skjemafelter, trykke på knapper osv.

La oss ta en titt på hvordan vi kan gjøre dette.

#### OrderForm.test.js

```jsx
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
```

1. Vi oppretter en en _mock-funksjon_ ved hjelp av `jest.fn()` og sender denne inn til OrderForm sin `onSubmit`.
   > En mock-funksjon er en funksjon som inneholder informasjon om hvor mange ganger den har blitt kalt, hvilke parametre den har blitt kalt med osv. Se https://jestjs.io/docs/en/mock-functions
2. Så bruker vi RTL's _render_-funksjon og rendrer komponenten.
3. Deretter finner vi alle skjemaelementene basert på elementenes label.
4. Vi simulerer så en utfylling av alle feltene, før vi klikker på submit-knappen.
5. Til slutt verifiserer vi at `onSubmit`-funksjonen blir kalt med dataene vi la inn.