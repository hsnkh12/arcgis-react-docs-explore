import { useEffect, useRef } from "react";
import MapView from "@arcgis/core/views/MapView";
import Locate from "@arcgis/core/widgets/Locate";
import Search from "@arcgis/core/widgets/Search";
import CustomWidget from "../../Components/Widgets/CustomWidget";
import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";
import LayerList from "@arcgis/core/widgets/LayerList";
import WebMap from "@arcgis/core/WebMap";
import esriConfig from "@arcgis/core/config";
import axios from "axios";

const MapViewSection = (props: any) => {
  const { mapView, setMapView } = props;
  const mapRef = useRef<HTMLDivElement | null>(null);

  const initMap = () => {
    if (!mapRef.current) return;

    const webMap = new WebMap({
      portalItem: {
        id: "d189248485af4819b81c303485be826f",
      },
    });

    const viewInfo: __esri.MapViewProperties = {
      container: mapRef.current,
      map: webMap,
      zoom: 14,
      popup: {
        dockEnabled: true,
        dockOptions: {
          position: "top-right",
          breakpoint: false,
        },
      },
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

    view.ui.add(document.getElementById("custom-widget")!, "top-right");
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

    setMapView(view);
  };

  const generateToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AUTH_PROXY_SERVER_HOST}/generateToken`
      );
      esriConfig.apiKey = response.data.token;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    generateToken();
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
        <CustomWidget mapView={mapView} />
      </div>
    </div>
  );
};

export default MapViewSection;
