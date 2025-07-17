
import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const chapters = [
  {
    name: "Epsilon Chapter",
    university: "University of California, Berkeley",
    coordinates: [-122.2585, 37.8719],
  },
  {
    name: "Theta Beta Chapter",
    university: "University of Washington",
    coordinates: [-122.3035, 47.6553],
  },
  {
    name: "Lambda Delta Chapter",
    university: "University of the Pacific",
    coordinates: [-121.2796, 37.9799],
  },
  {
    name: "Mu Delta Chapter",
    university: "University of California, Merced",
    coordinates: [-120.4249, 37.3643],
  },
  {
    name: "Rho Delta Chapter",
    university: "University of Nevada, Reno",
    coordinates: [-119.8138, 39.5439],
  },
  {
    name: "Upsilon Epsilon Chapter",
    university: "Santa Clara University",
    coordinates: [-121.9393, 37.3497],
  },
  {
    name: "Omega Epsilon Chapter",
    university: "San Jose State University",
    coordinates: [-121.8813, 37.3352],
  },
];

const InteractiveMap = () => {
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const [annotationOpacity, setAnnotationOpacity] = useState(0);

  useEffect(() => {
    if (hoveredChapter) {
      setAnnotationOpacity(1);
    } else {
      setAnnotationOpacity(0);
    }
  }, [hoveredChapter]);

  return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        rotate: [115, -41, 0],
        scale: 1800,
      }}
      style={{ height: "400px", width: "100%" }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: {
                  fill: "#ffffff",
                  stroke: "#c4c4c4",
                  outline: "none",
                },
                hover: {
                  fill: "#ffffff",
                  stroke: "#c4c4c4",
                  outline: "none",
                },
                pressed: {
                  fill: "#ffffff",
                  stroke: "#c4c4c4",
                  outline: "none",
                },
              }}
            />
          ))
        }
      </Geographies>
      {chapters.map((chapter) => (
        <Marker
          key={chapter.name}
          coordinates={chapter.coordinates}
          onMouseEnter={() => setHoveredChapter(chapter)}
          onMouseLeave={() => setHoveredChapter(null)}
        >
          <circle r={5} fill="#990000" />
        </Marker>
      ))}
    </ComposableMap>
  );
};

export default InteractiveMap;
