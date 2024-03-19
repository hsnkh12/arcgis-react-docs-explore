import { useState } from "react";

const CustomWidget = (props: any) => {
  const { mapView , onSaveMap} = props;

  const [formValues, setFormValues] = useState<any>({
    title: "My map"
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, title: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSaveMap(formValues)
  };
  return (
    <div className="p-4 bg-white" style={{ width: 300 }}>
      <h1 style={{ fontWeight: "bold" }}>Save map</h1>
      <hr></hr>
      <br></br>
      <form onSubmit={handleSubmit} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Map title
        </label>
        <input
          type="text"
          name="title"
          value={formValues.title}
          onChange={handleTitleChange}
          className="border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
          required
          style={{ height: 30 }}
        />
        <button
          type="submit"
          className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default CustomWidget;
