import { Link } from "react-router-dom";

const HomeScreen = () => {
  return (
    <div className="text-center">
     <br></br>
      <Link to="map" style={{textDecoration:'underline',color:'blue', fontSize: 30}}>View map</Link>
      <div className="grid justify-items-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/ArcGIS_logo.png/600px-ArcGIS_logo.png"></img>
      </div>
    </div>
  );
};

export default HomeScreen;
