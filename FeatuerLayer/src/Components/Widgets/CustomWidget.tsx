const CustomWidget = (props: any) => {
  const { mapView, features, setFeatures } = props;

  const onBulkUpload = () => {
    setFeatures([
      {
        LATITUDE: 32.6735,
        LONGITUDE: -117.2425,
        TYPE: "National Monument",
        NAME: "Cabrillo National Monument",
      },
      {
        LATITUDE: 35.2234,
        LONGITUDE: -118.559,
        TYPE: "National Monument",
        NAME: "Cesar E. Chavez National Monument",
      },
      {
        LATITUDE: 37.6251,
        LONGITUDE: -119.085,
        TYPE: "National Monument",
        NAME: "Devils Postpile National Monument",
      },
      {
        LATITUDE: 35.2915,
        LONGITUDE: -115.0935,
        TYPE: "National Monument",
        NAME: "Castle Mountains National Monument",
      },
      {
        LATITUDE: 41.7588,
        LONGITUDE: -121.5267,
        TYPE: "National Monument",
        NAME: "Lava Beds National Monument",
      },
      {
        LATITUDE: 37.897,
        LONGITUDE: -122.5811,
        TYPE: "National Monument",
        NAME: "Muir Woods National Monument",
      },
      {
        LATITUDE: 41.8868,
        LONGITUDE: -121.3717,
        TYPE: "National Monument",
        NAME: "Tule Lake National Monument",
      },
    ]);
  };

  const onEmpty = () => {
    setFeatures([]);
  };

  return (
    <div className="bg-white p-6">
      <button
        onClick={onBulkUpload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
      >
        Bulk Upload
      </button>
      <button
        onClick={onEmpty}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Empty
      </button>
    </div>
  );
};

export default CustomWidget;
