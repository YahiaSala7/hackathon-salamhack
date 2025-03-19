"use client";

import { FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Slider from "react-slick";
import { Rating } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./PhaseTwo.module.css";

// Sample data for the pie chart
const budgetData = [
  { name: "Living Room", value: 30 },
  { name: "Kitchen", value: 20 },
  { name: "Bedrooms", value: 20 },
  { name: "Bathrooms", value: 15 },
  { name: "Other Rooms", value: 15 },
];

// Sample data for recommendation cards
const recommendationData = [
  {
    id: 1,
    title: "Modern Sofa",
    category: "Living Room",
    price: "50$",
    rating: 4,
    description:
      "Our team was inspired by the seven skills of highly effective programmers",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3",
  },
  {
    id: 2,
    title: "Comfort Couch",
    category: "Living Room",
    price: "50$",
    rating: 4,
    description:
      "Our team was inspired by the seven skills of highly effective programmers",
    image:
      "https://images.unsplash.com/photo-1506898667547-42e22a46e125?ixlib=rb-4.0.3",
  },
  {
    id: 3,
    title: "Luxury Sofa",
    category: "Living Room",
    price: "50$",
    rating: 4,
    description:
      "Our team was inspired by the seven skills of highly effective programmers",
    image:
      "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?ixlib=rb-4.0.3",
  },
  {
    id: 4,
    title: "Designer Couch",
    category: "Living Room",
    price: "50$",
    rating: 4,
    description:
      "Our team was inspired by the seven skills of highly effective programmers",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3",
  },
];

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#5F6368"];

const PhaseTwo: FC = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Smart Recommendations</h1>

      {/* Pie Chart Section */}
      <div className="mb-12 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={budgetData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={140}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }>
              {budgetData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className={styles.legend}>
          {budgetData.map((entry, index) => (
            <div key={`legend-${index}`} className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Living Room</h2>
        <div className={styles.sliderContainer}>
          <Slider {...sliderSettings}>
            {recommendationData.map((item) => (
              <div key={item.id} className="p-4">
                <div
                  className={`${styles.card} bg-white rounded-lg shadow-lg overflow-hidden`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <span className="text-gray-600">{item.category}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">{item.price}</span>
                      <Rating value={item.rating} readOnly />
                    </div>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default PhaseTwo;
