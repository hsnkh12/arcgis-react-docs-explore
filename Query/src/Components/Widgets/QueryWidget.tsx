import { useEffect, useState } from "react";

const QueryWidget: React.FC<any> = (props: any) => {
  const { mapView, setQueryForm } = props;

  const [formValues, setFormValues] = useState({
    num_deaths: 1,
    year_: "*",
    sec: 0,
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
        <label className="text-gray-700">
          Deaths {"< or ="} {formValues.num_deaths}:
        </label>
        <input
          type="range"
          min="1"
          max="200"
          name="num_deaths"
          onChange={handleFormChange}
          value={formValues.num_deaths}
          className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />

        <label className="text-gray-700">
          Seconds {"> or ="} {formValues.sec}:
        </label>
        <input
          type="range"
          min="1"
          max="100"
          name="sec"
          onChange={handleFormChange}
          value={formValues.sec}
          className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />

        <label className="text-gray-700">Year:</label>
        <select
          name="year_"
          id="year_"
          className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={handleFormChange}
          value={formValues.year_}
        >
          <option value="*">all</option>
          {[
            "2000",
            "2001",
            "2002",
            "2003",
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
          ].map((year) => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
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

export default QueryWidget;
