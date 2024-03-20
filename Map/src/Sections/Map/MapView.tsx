import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Locate from "@arcgis/core/widgets/Locate";
import Search from "@arcgis/core/widgets/Search";
import CustomWidget from "../../Components/Widgets/CustomWidget";
import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";
import LayerList from "@arcgis/core/widgets/LayerList";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
const MapViewSection = (props: {
  mapView: MapView;
  setMapView: (mapView: MapView) => void;
}) => {
  const { mapView, setMapView } = props;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [webMap, setWebMap] = useState<WebMap | null>(null);
  const [testLayer, setTestLayer] = useState<FeatureLayer | null>(null);

  const initMap = () => {
    if (!mapRef.current) return;

    const layer = new FeatureLayer({
      url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/WorldCities/FeatureServer/0",
      outFields: ["*"],
    });

    const webMap = new WebMap({
      basemap: "dark-gray-vector",
      layers: [layer],
    });

    setWebMap(webMap);
    setTestLayer(layer);

    const viewInfo: __esri.MapViewProperties = {
      container: mapRef.current,
      map: webMap,
      center: [39, 34],
      zoom: 5,
      popup: {
        dockEnabled: true,
        dockOptions: {
          position: "top-right",
          breakpoint: false,
        },
      }
    };

    const view = new MapView(viewInfo);

    const locateWidget = new Locate({
      view,
      goToOverride: (view, options) => {
        options.target.scale = 1500;
        return view.goTo(options.target);
      },
    });
    const search = new Search({
      view,
    });
    const legend = new Legend({
      view,
    });
    const layerList = new LayerList({
      view,
    });

    view.ui.add(
      new Expand({ view, content: document.getElementById("custom-widget")! }),
      "top-right"
    );
    view.ui.add(locateWidget, "top-left");
    view.ui.add(search, "top-right");
    view.ui.add(
      new Expand({ view, content: legend, expandTooltip: "Expand Legend" }),
      "bottom-left"
    );
    view.ui.add(
      new Expand({
        view,
        content: layerList,
        expandTooltip: "Expand LayerList",
      }),
      "top-left"
    );
    view.padding.top = 5
    setMapView(view);

    view
      .when()
      .then(() => {
        console.log("View loaded");
        return layer.when();
      })
      .then((layer) => {
        console.log("Layer loaded");
        return view.whenLayerView(layer);
      })
      .then(() => {
        console.log("LayerView loaded")
        view.on("pointer-move", (e) => {
          handlePointerAction(e, layer, view);
        });
      });
  };

  const handlePointerAction = (e: any, layer: FeatureLayer, view: MapView) => {
    const opts = {
      include: layer,
    };

    view.hitTest(e, opts).then((response) => {
      const result: __esri.ViewHit = response.results[0];
      if (result?.type === "graphic") {
        console.log(result.graphic.attributes);
      }
    });
  };

  useEffect(() => {
    initMap();

    return () => {
      mapView && mapView.destroy();
    };
  }, []);

  return (
    <div>
      <div
        className="mapDiv col-span-5"
        ref={mapRef}
        style={{ height: "100vh", width: "100%" }}
      ></div>
      <div id="custom-widget">
        <CustomWidget webMap={webMap} mapView={mapView} />
      </div>
    </div>
  );
};

export default MapViewSection;
