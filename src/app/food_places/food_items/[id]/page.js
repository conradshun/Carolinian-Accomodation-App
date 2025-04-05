"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FoodItemDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [foodItem, setFoodItem] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchFoodItem = async () => {
        try {
          const response = await fetch(`/api/food_items/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

          // Convert binary data to base64
          if (data.imageBinary && data.imageMimeType) { // Assuming your API returns imageBinary and imageMimeType
            const base64Image = btoa(
              new Uint8Array(data.imageBinary).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
            data.imageDataUrl = `data:${data.imageMimeType};base64,${base64Image}`;
          }

          setFoodItem(data);
        } catch (error) {
          console.error('Error fetching food item:', error);
        }
      };
      fetchFoodItem();
    }
  }, [id]);

  if (!foodItem) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{foodItem.name}</h1>
      {foodItem.imageDataUrl && <img src={foodItem.imageDataUrl} alt={foodItem.name} />}
      <p>Description: {foodItem.description}</p>
      <h4>Location Link: {foodItem.directionLink}</h4>
      <h3>Open Hours: {foodItem.openHours}</h3>
    </div>
  );
}
