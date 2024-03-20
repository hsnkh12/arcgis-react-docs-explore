import { useState } from "react";
import MapViewSection from "../../Sections/Map/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import MapView from "@arcgis/core/views/MapView";

const MapScreen = () => {
  const [mapView, setMapView] = useState<MapView | SceneView>();
  return (
    <div>
      <MapViewSection mapView={mapView} setMapView={setMapView} />
    </div>
  );
};

export default MapScreen;
