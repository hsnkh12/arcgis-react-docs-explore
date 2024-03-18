import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Locate from "@arcgis/core/widgets/Locate";
import Search from "@arcgis/core/widgets/Search";
import CustomWidget from "../../Components/Widgets/CustomWidget";
import ReactDOM from "react-dom";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Legend from "@arcgis/core/widgets/Legend";
import LayerList from "@arcgis/core/widgets/LayerList";
import Expand from "@arcgis/core/widgets/Expand";
import SeasonsFilterWidget from "../../Components/Widgets/SeasonFilterWidget";

const MapViewSection = (props: any) => {
  const { mapView, setMapView } = props;
  const [features, setFeatures] = useState<any>([]);
  const [mainLayer, setMainLayer] = useState<FeatureLayer | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const initMap = () => {
    if (!mapRef.current) return;

    const countryLayer = new FeatureLayer({
      portalItem: {
        id: "a5210df5ce0f4f4fbda203ac4c291f1a",
      },
    });

    const floodLayer = new FeatureLayer({
      portalItem: {
        id: "f9e348953b3848ec8b69964d5bceae02",
      },
      outFields: ["SEASON"],
    });

    const map = new Map({
      basemap: "topo-vector",
      layers: [countryLayer, floodLayer],
    });

    const viewInfo: __esri.MapViewProperties = {
      container: mapRef.current,
      map: map,
      center: [39, 34],
      zoom: 5,
      extent: {
        spatialReference: {
          wkid: 102100,
        },
        xmin: -14488954,
        ymin: 3457304,
        xmax: -10656095,
        ymax: 5250211,
      },
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

    const customWidgetElement = document.createElement("div");
    const seasonFilterElement = document.createElement("div");
    ReactDOM.render(
      <SeasonsFilterWidget floodLayer = {floodLayer} />,
      seasonFilterElement
    );
    ReactDOM.render(
      <CustomWidget
        mapView={view}
        features={features}
        setFeatures={setFeatures}
      />,
      customWidgetElement
    );

    view.ui.add(new Expand({ view,content: seasonFilterElement, expandIcon:"filter"}), "top-left");
    view.ui.add(
      new Expand({ view,content: legend, expandTooltip: "Expand Legend" }),
      "bottom-left"
    );
    view.ui.add(new Expand({ view,content: customWidgetElement }), "top-right");
    view.ui.add(locateWidget, "top-left");
    view.ui.add(search, "top-right");
    view.ui.add(
      new Expand({ view,content: layerList, expandTooltip: "Expand LayerList" }),
      "top-left"
    );

    const customLayer = new FeatureLayer({
      title: "Custom Layer",
      fields: [
        {
          name: "ObjectID",
          alias: "ObjectID",
          type: "oid",
        },
        {
          name: "Name",
          alias: "Name",
          type: "string",
        },
        {
          name: "Type",
          alias: "Type",
          type: "string",
        },
      ],
      objectIdField: "ObjectID",
      geometryType: "point",
      spatialReference: { wkid: 4326 },
      source: [],
      popupTemplate: {
        title: "{NAME}",
        content: "This is a {NAME} located at {LATITUDE}, {LONGITUDE}",
      },
    });

    setMainLayer(customLayer);
    view.map.add(customLayer);
    setMapView(view);
  };

  const zoomToFeateurLayer = (layer: FeatureLayer) => {
    layer?.queryExtent().then((response) => {
      mapView?.goTo(response.extent);
    });
  };

  useEffect(() => {
    initMap();

    return () => {
      mapView && mapView.destroy();
    };
  }, []);

  useEffect(() => {
    if (!mapView || !mainLayer) return;

    if (features.length === 0) {
      mainLayer.queryFeatures().then((results) => {
        const deleteEdits = {
          deleteFeatures: results.features,
        };
        mainLayer.applyEdits(deleteEdits);
      });
      return;
    }

    const graphics = features.map((feature: any, index: number) => {
      return new Graphic({
        geometry: new Point({
          x: feature.LONGITUDE,
          y: feature.LATITUDE,
          spatialReference: { wkid: 4326 },
        }),
        attributes: feature,
      });
    });

    mainLayer.applyEdits({
      addFeatures: graphics,
    });

    zoomToFeateurLayer(mainLayer);
  }, [features]);



  return (
    <div
      className="mapDiv col-span-5"
      ref={mapRef}
      style={{ height: "100vh", width: "100%" }}
    ></div>
  );
};

export default MapViewSection;
