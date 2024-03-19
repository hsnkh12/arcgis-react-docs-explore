import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Locate from "@arcgis/core/widgets/Locate";
import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";
import LayerList from "@arcgis/core/widgets/LayerList";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import TableWidget from "../../Components/Widgets/TableWidget";
import Basemap from "@arcgis/core/Basemap";
import { parkPopupTemplate } from "../../Helpers/MapHelpers";
import { createRoot } from "react-dom/client";
import Graphic from "@arcgis/core/Graphic";
import QueryWidget from "../../Components/Widgets/QueryWidget";

const MapViewSection = (props: any) => {
  const { mapView, setMapView } = props;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mainLayer, setMainLayer] = useState<FeatureLayer | null>(null);
  const [queryForm, setQueryForm] = useState({
    num_deaths: 1,
    year_: "*",
    sec: 0,
  });

  const [attributesData, setAttributesData] = useState<Graphic[]>([]);

  const initMap = () => {
    if (!mapRef.current) return;

    const basemap = new Basemap({
      portalItem: {
        id: "4f2e99ba65e34bb8af49733d9778fb8e",
      },
    });

    const layer = new FeatureLayer({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/MapServer/0",
      outFields: ["*"],
      popupTemplate: parkPopupTemplate(),
    });

    setMainLayer(layer);

    const webMap = new Map({
      basemap: basemap,
      layers: [layer],
    });

    const viewInfo: __esri.MapViewProperties = {
      container: mapRef.current,
      map: webMap,
      center: [39, 34],
      zoom: 5,
      popup: {
        dockEnabled: true,
        dockOptions: {
          position: "top-left",
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
    const legend = new Legend({
      view,
    });
    const layerList = new LayerList({
      view,
    });

    view.ui.add(document.getElementById("query")!, "top-right");
    view.ui.add(document.getElementById("table")!, "bottom-right");
    view.ui.add(locateWidget, "top-left");
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

  useEffect(() => {
    initMap();
    updateAttributesData();
    return () => {
      mapView && mapView.destroy();
    };
  }, []);

  const updateAttributesData = async (query: any = undefined) => {
    const result = await mainLayer?.queryFeatures();
    if (!result) setAttributesData([]);
    else
      setAttributesData(result.features.map((feature) => feature.attributes));
  };

  useEffect(() => {
    if (!mainLayer) return;
    const filter = async () => {
      const query = mainLayer.createQuery();
      let whereClause = `num_deaths <= ${queryForm.num_deaths} AND sec >= ${queryForm.sec}`;
      if (queryForm.year_ !== "*") {
        whereClause += ` AND year_=${queryForm.year_}`;
      }
      mainLayer.definitionExpression = whereClause;
      query.where = whereClause;
      query.outFields = ["*"];

      updateAttributesData(query);
    };
    filter();
  }, [queryForm]);

  return (
    <div>
      <div
        className="mapDiv col-span-5"
        ref={mapRef}
        style={{ height: "100vh", width: "100%" }}
      ></div>
      <div id="query">
        <QueryWidget setQueryForm={setQueryForm} />
      </div>
      <div id="table">
        <TableWidget data={attributesData} />
      </div>
    </div>
  );
};

export default MapViewSection;
