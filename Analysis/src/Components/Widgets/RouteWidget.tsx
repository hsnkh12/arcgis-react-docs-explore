const RouteWidget = (props: any) => {
  const { routeMode, setRouteMode } = props;
  return (
    <div className="bg-white p-2">
      <label>Route mode:</label>
      <button
         onClick={() => {
          setRouteMode(!routeMode);
        }}
        className="p-2 bg-blue-500 text-white rounded-md w-full mt-2"
      >
        {routeMode? "Stop Route" : "Start Route"}
      </button>
    </div>
  );
};
export default RouteWidget;