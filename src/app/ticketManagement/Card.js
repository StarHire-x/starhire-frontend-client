import React from "react";
import { Card } from "primereact/card";

const CustomCard = ({ title, image }) => {
  const imageStyle = {
    maxWidth: "100%", // Set the maximum width of the image
    height: "auto",  // Let the height adjust to maintain aspect ratio
  };

  return (
    <Card className="p-card">
      <img src={image} alt={title} style={imageStyle} />
      <h2>{title}</h2>
    </Card>
  );
};

export default CustomCard;


