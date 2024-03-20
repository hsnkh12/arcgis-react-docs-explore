const CustomWidget = (props: any) => {
  const { mapView, data } = props;

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <div className="mb-4">
        <label className="block text-gray-700">Earthquakes recorded</label>
        <p className="text-gray-900">1</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Max magnitude</label>
        <p className="text-gray-900">1</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Min magnitude</label>
        <p className="text-gray-900">1</p>
      </div>
      <div>
        <label className="block text-gray-700">Average depth</label>
        <p className="text-gray-900">1</p>
      </div>
    </div>
  );
};

export default CustomWidget;
