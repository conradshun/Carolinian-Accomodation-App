// src/app/food_places/food_items/[id].js
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function FoodItemDetails() {
  const router = useRouter(); // Access the router
  const { id } = router.query; // Get the ID from the query parameters
  const [foodItem, setFoodItem] = useState(null);

  useEffect(() => {
    if (id) { // Check if ID is available
      const fetchFoodItem = async () => {
        try {
          const response = await fetch(`/api/foodItem/${id}`); // Fetch by ID
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setFoodItem(data);
        } catch (error) {
          console.error('Error fetching food item:', error);
        }
      };
      fetchFoodItem();
    }
  }, [id]);

  if (!foodItem) {
    return <p>Loading...</p>; // Or handle loading state
  }

  return (
    <div>
      <h1>{foodItem.name}</h1>
      {foodItem.image && <img src={foodItem.image} alt={foodItem.name} />} 
      <p>Description: {foodItem.description}</p>
      <h4>Location Link: {foodItem.directionLink}</h4>
      <h3>Open Hours: {foodItem.openHours}</h3>
    </div>
  );
}