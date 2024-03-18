import { BrowserRouter, Route, Link, Routes} from "react-router-dom";
import HomeScreen from "./Screens/Home/Home";
import MapScreen from "./Screens/Map/Map";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="map" element={<MapScreen />} />
        <Route path="*" element={<div><h1>Not Found</h1></div>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
