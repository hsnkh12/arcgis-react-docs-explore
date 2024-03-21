const CustomWidget = (props: any) => {
  const { mapView, onClick } = props;

  return (
    <div className="bg-white p-2">
      <button onClick={onClick} className="p-2 bg-gray">
        Analyze 911 calls
      </button>
    </div>
  );
};

export default CustomWidget;
