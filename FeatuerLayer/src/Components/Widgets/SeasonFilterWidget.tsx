import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const SeasonsFilterWidget = (props: { floodLayer: FeatureLayer }) => {
  const { floodLayer } = props;
  const seasons = ["Winter", "Spring", "Summer", "Fall"];
  return (
    <div className="bg-white">
      <ul>
        {seasons.map((season, index) => {
          return (
            <li key={index}>
              <button
                className="p-3"
                onClick={() => {
                    floodLayer.definitionExpression = `SEASON = '${season}'`;
                }}
              >
                {season}
              </button>
            </li>
          );
        })}

        <li>
            <button className="p-3" onClick={() => {
                floodLayer.definitionExpression = "";
            }}>Clear Filter</button>
        </li>
      </ul>
    </div>
  );
};

export default SeasonsFilterWidget;
