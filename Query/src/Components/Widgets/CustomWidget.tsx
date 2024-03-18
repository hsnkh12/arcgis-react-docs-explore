import { useState } from "react";

const CustomWidget = (props: any) => {
  const { mapView, setQueryForm } = props;

  const [formValues, setFormValues] = useState({
    orderBy: "1",
    parksPerState: "1",
    year: "*",
  });

  const handleFormChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setQueryForm(formValues);
  };

  return (
    <div className="bg-white p-3" style={{ width: 300 }}>
      <form className="flex flex-col space-y-4" onSubmit={handleFormSubmit}>
        <label className="text-gray-700">Order by:</label>
        <select
          name="orderBy"
          id="visit"
          className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={handleFormChange}
          value={formValues.orderBy}
        >
          <option value="DESC">Most visited</option>
          <option value="ASC">Least visited</option>
        </select>

        <label className="text-gray-700">Parks per state:</label>
        <select
          name="parksPerState"
          id="parks"
          className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={handleFormChange}
          value={formValues.parksPerState}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>

        <label className="text-gray-700">Year:</label>
        <select
          name="year"
          id="year"
          className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={handleFormChange}
          value={formValues.year}
        >
          <option value="TOTAL">all</option>
          <option value="F2018">2018</option>
          <option value="F2019">2019</option>
          <option value="F2020">2020</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Query
        </button>
      </form>
    </div>
  );
};

export default CustomWidget;
