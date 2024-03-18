import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Locate from "@arcgis/core/widgets/Locate";
import Search from "@arcgis/core/widgets/Search";
import CustomWidget from "../../Components/Widgets/CustomWidget";
import ReactDOM from "react-dom";
import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";
import LayerList from "@arcgis/core/widgets/LayerList";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import TableWidget from "../../Components/Widgets/TableWidget";
import Basemap from "@arcgis/core/Basemap";
import { parkPopupTemplate } from "../../Helpers/MapHelpers";
import TopFeaturesQuery from "@arcgis/core/rest/support/TopFeaturesQuery";
import TopFilter from "@arcgis/core/rest/support/TopFilter";

const MapViewSection = (props: any) => {
  const { mapView, setMapView } = props;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mainLayer, setMainLayer] = useState<FeatureLayer | null>(null);
  const [queryForm, setQueryForm] = useState({
    orderBy: "1",
    parksPerState: "1",
    year: "*",
  });
  const [parks, setParks] = useState([]);

  const initMap = () => {
    if (!mapRef.current) return;

    const basemap = new Basemap({
      portalItem: {
        id: "4f2e99ba65e34bb8af49733d9778fb8e",
      },
    });

    // national parks layer
    const layer = new FeatureLayer({
      url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/US_National_Parks_Annual_Visitation/FeatureServer/0",
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

    const customWidgetElement = document.createElement("div");
    const tableWidgetElement = document.createElement("div");
    ReactDOM.render(
      <CustomWidget mapView={view} setQueryForm={setQueryForm} />,
      customWidgetElement
    );
    ReactDOM.render(<TableWidget />, tableWidgetElement);

    view.ui.add(customWidgetElement, "top-right");
    view.ui.add(tableWidgetElement, "bottom-right");
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

    return () => {
      mapView && mapView.destroy();
    };
  }, []);

  useEffect(() => {
    if (!mainLayer) return;

    // const filter = async () => {
    //   const query = new TopFeaturesQuery({
    //     topFilter: new TopFilter({
    //       topCount: parseInt(queryForm.parksPerState),
    //       groupByFields: ["State"],
    //       orderByFields: [`${queryForm.orderBy} DESC`], 
    //     }),
    //     orderByFields: orderByField,
    //     outFields: ["State, TOTAL, F2018, F2019, F2020, Park"],
    //     returnGeometry: true,
    //     cacheHint: false,
    //   });
    //   await mainLayer.queryTopFeatures(query);
    // };
  }, [queryForm]);

  return (
    <div
      className="mapDiv col-span-5"
      ref={mapRef}
      style={{ height: "100vh", width: "100%" }}
    ></div>
  );
};

export default MapViewSection;
