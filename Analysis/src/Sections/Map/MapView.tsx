import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Locate from "@arcgis/core/widgets/Locate";
import Search from "@arcgis/core/widgets/Search";
import CustomWidget from "../../Components/Widgets/CustomWidget";
import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";
import LayerList from "@arcgis/core/widgets/LayerList";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import LinearUnit from "@arcgis/core/rest/support/LinearUnit";
import SpacialReference from "@arcgis/core/geometry/SpatialReference";
import * as geoprocessor from "@arcgis/core/rest/geoprocessor";
import * as route from "@arcgis/core/rest/route";
import RouteWidget from "../../Components/Widgets/RouteWidget";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";

const MapViewSection = (props: any) => {
  const { mapView, setMapView } = props;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [routeMode, setRouteMode] = useState(false);
  const VIEW_SHED_SERVER_URL =
    "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed";
  const HOTSPOT_SERVER_URL =
    "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot";

  const ROUTE_SERVER_URL =
    "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

  const initMap = () => {
    if (!mapRef.current) return;

    const webMap = new Map({
      basemap: "dark-gray-vector",
    });

    const bufferLayer = new GraphicsLayer({ title: "Buffer Layer" });
    const pointLayer = new GraphicsLayer({ title: "Point Layer" });
    const viewShedLayer = new GraphicsLayer({ title: "Viewshed Layer" });
    const routeLayer = new GraphicsLayer({ title: "Route Layer" });

    webMap.addMany([bufferLayer, pointLayer, viewShedLayer, routeLayer]);

    const viewInfo: __esri.MapViewProperties = {
      container: mapRef.current,
      map: webMap,
      // center: [39, 34],
      center: [-122.812, 45.474],
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
    view.ui.add(document.getElementById("route-widget")!, "top-right");
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

    view
      .when(() => {
        setMapView(view);
      })
      .then(() => {
        view.on("click", (event: any) => {
          handleOnMapclick(
            event,
            pointLayer,
            bufferLayer,
            viewShedLayer,
            routeLayer
          );
        });
      });
  };

  const handleOnMapclick = (
    event: any,
    pointLayer: GraphicsLayer,
    bufferLayer: GraphicsLayer,
    viewShedLayer: GraphicsLayer,
    routeLayer: GraphicsLayer
  ) => {
    if (routeMode===true) {
      addRoute(event.mapPoint, routeLayer);
      return;
    }
    const point = new Point({
      longitude: event.mapPoint.longitude,
      latitude: event.mapPoint.latitude,
    });
    addPoint(point, pointLayer);

    const buffer = geometryEngine.geodesicBuffer(point, 560, "kilometers");
    addBuffer(buffer, bufferLayer);

    const viewShedPoint = new Point({
      longitude: event.mapPoint.longitude,
      latitude: event.mapPoint.latitude,
    });
    computeViewShed(viewShedPoint, viewShedLayer);
  };

  const addRoute = (geometry: any, layer: GraphicsLayer) => {
    const stop = new Graphic({
      geometry: geometry,
      symbol: new SimpleMarkerSymbol({
        style: "cross",
        size: 15,
        outline: {
          width: 4,
        },
      }),
    });

    const routeParams = new RouteParameters({
      apiKey: "%YOUR_API_KEY%",
      stops: new FeatureSet(),
      outSpatialReference: {
        wkid: 3857,
      },
    });

    (routeParams.stops as FeatureSet).features.push(stop);
    if ((routeParams.stops as FeatureSet).features.length >= 2) {
      route.solve(ROUTE_SERVER_URL, routeParams).then((data: any) => {
        drawRouteData(data, layer);
      });
    }
  };

  const addPoint = (geometry: Point, layer: GraphicsLayer) => {
    layer.removeAll();
    const pointGraphic = new Graphic({
      geometry: geometry,
      symbol: new SimpleMarkerSymbol({
        color: [255, 0, 0],
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
        size: 7,
      }),
    });
    layer.add(pointGraphic);
  };

  const addBuffer = (geometry: Polygon | Polygon[], layer: GraphicsLayer) => {
    layer.removeAll();
    const bufferGraphic = new Graphic({
      geometry: geometry as Polygon,
      symbol: new SimpleFillSymbol({
        color: [140, 140, 222, 0.5],
        outline: {
          color: [0, 0, 0, 0.5],
          width: 2,
        },
      }),
    });

    layer.add(bufferGraphic);
  };

  const computeViewShed = (point: Point, layer: GraphicsLayer) => {
    layer.removeAll();
    const inputGraphic = new Graphic({
      geometry: point,
      symbol: new SimpleMarkerSymbol({
        color: [226, 119, 40, 0.75],
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
      }),
    });

    layer.add(inputGraphic);

    const inputGraphicContainer = [];
    inputGraphicContainer.push(inputGraphic);
    const featureSet = new FeatureSet();
    featureSet.features = inputGraphicContainer;

    const vsDistance = new LinearUnit();
    vsDistance.distance = 5;
    vsDistance.units = "miles";

    const params = {
      Input_Observation_Point: featureSet,
      Viewshed_Distance: vsDistance,
    };

    const options: any = {
      outSpatialReference: new SpacialReference({
        wkid: 102100,
      }),
    };

    geoprocessor
      .execute(VIEW_SHED_SERVER_URL, params, options)
      .then((result: any) => drawResultViewShedData(result, layer));
  };

  const drawRouteData = (data: any, routeLayer: any) => {
    const routeSymbol = {
      type: "simple-line", // autocasts as SimpleLineSymbol()
      color: [0, 0, 255, 0.5],
      width: 5,
    };
    const routeResult = data.routeResults[0].route;
    routeResult.symbol = routeSymbol;
    routeLayer.add(routeResult);
  };

  const drawResultViewShedData = (result: any, layer: GraphicsLayer) => {
    const resultFeatures = result.results[0].value.features;

    const viewshedGraphics = resultFeatures.map((feature: Graphic) => {
      feature.symbol = new SimpleFillSymbol({
        color: [226, 119, 40, 0.75],
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
      });
      return feature;
    });

    layer.addMany(viewshedGraphics);

    mapView.goTo({
      target: viewshedGraphics,
      tilt: 0,
    });
  };

  const onAnalyzeClick = () => {
    mapView.map.layers.forEach((layer: any) => {
      if (layer.title === "HotspotLayer") {
        mapView.map.layers.remove(layer);
      }
    });

    const params = {
      Query: buildDefinitionQuery(),
    };

    geoprocessor
      .submitJob(HOTSPOT_SERVER_URL, params)
      .then((jobInfo) => {
        jobInfo.waitForJobCompletion().then((jobInfo2) => {
          drawRestultHotspotData(jobInfo2);
        });
      })
      .catch((error) => {
        alert(`Failed to successfully submitJob:\n
        ${error}`);
      })
      .finally(() => {});
  };

  const drawRestultHotspotData = (result: any) => {
    result
      .fetchResultMapImageLayer(result.jobId)
      .then((resultLayer: MapImageLayer) => {
        resultLayer.opacity = 0.7;
        resultLayer.title = "HotspotLayer";
        mapView.map.layers.add(resultLayer);
      });
  };

  function buildDefinitionQuery() {
    let defQuery;
    // get dates and build definition expression

    const startDate = "1998-01-01 00:00:00";
    const endDate = "1998-05-31 00:00:00";
    const def = [];
    def.push(
      "(Date >= date '" + startDate + "' and Date <= date '" + endDate + "')"
    );

    if (def.length > 1) {
      defQuery = def.join(" AND ");
    }
    return defQuery;
  }

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
        <CustomWidget mapView={mapView} onClick={onAnalyzeClick} />
      </div>
      <div id="route-widget">
        <RouteWidget routeMode={routeMode} setRouteMode={setRouteMode} />
      </div>
    </div>
  );
};

export default MapViewSection;
