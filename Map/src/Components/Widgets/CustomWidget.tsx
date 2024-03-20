import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import { useState } from "react";

const CustomWidget = (props: { webMap: WebMap | null, mapView: MapView}) => {
  const { webMap, mapView} = props;
  const [formValues, setFormValues] = useState<any>({
    title: "My map",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, title: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await webMap?.updateFrom(mapView);
      const item = await webMap?.saveAs(formValues);
      const itemPageUrl = `${item?.portal.url}/home/item.html?id=${item?.id}`;
      window.alert("Map saved successfully! You can view it at " + itemPageUrl);
    } catch (err) {
      window.alert("Failed to save map");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
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
        {isLoading && <p>Loading...</p>}
      </form>
    </div>
  );
};

export default CustomWidget;
