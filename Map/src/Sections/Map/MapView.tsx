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
const MapViewSection = (props: {mapView: MapView, setMapView: (mapView:MapView)=>void}) => {
  const { mapView, setMapView } = props;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [webMap, setWebMap] = useState<WebMap | null>(null);

  const PORTAL_ITEM_ID = "e691172598f04ea8881cd2a4adaa45ba"
  const onSaveMap = (item: any) => {

    webMap?.updateFrom(item)
    .then((item) => {
      const itemPageUrl = `${item.portal.url}/home/item.html?id=${item.id}`;
      const link = document.createElement("a");
      link.href = itemPageUrl
      link.target = "_blank";
    })
  }

  const initMap = () => {
    if (!mapRef.current) return;

    const webMap = new WebMap({
      portalItem: {
        id: PORTAL_ITEM_ID 
      }
    });

    setWebMap(webMap)

    const viewInfo: __esri.MapViewProperties  = {
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
      new Expand({ view,content: legend, expandTooltip: "Expand Legend" }),
      "bottom-left"
    );
    view.ui.add(
      new Expand({ view,content: layerList, expandTooltip: "Expand LayerList" }),
      "top-left"
    );
    
    setMapView(view);
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
        <CustomWidget mapView={mapView} onSaveMap={onSaveMap} />
      </div>
    </div>
  );
};

export default MapViewSection;
