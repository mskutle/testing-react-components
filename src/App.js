import OrderForm from "./forms/OrderForm";

function App() {
  return (
    <div className="p-8 max-w-md">
      <h1 className="text-3xl mb-8 border-b-4 border-purple-900 pb-2">
        Order face masks
      </h1>
      <OrderForm onSubmit={(data) => console.log(data)} />
    </div>
  );
}

export default App;
