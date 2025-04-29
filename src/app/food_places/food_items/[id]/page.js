"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function FoodItemDetails() {
  const { id } = useParams();
  const [foodItem, setFoodItem] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [tags, setTags] = useState([]); // New state for tags

  useEffect(() => {
    if (id) {
      const fetchFoodItem = async () => {
        try {
          const response = await fetch(`/api/food_items/${id}?includeTags=true`); //Fetch tags
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setFoodItem(data);
          setTags(data.tags.map(tag => tag.tag)); // Extract tags
        } catch (error) {
          console.error("Error fetching food item:", error);
        }
      };
      fetchFoodItem();
    }
  }, [id]);

  useEffect(() => {
    if (foodItem && foodItem.image) {
      const byteArray = new Uint8Array(foodItem.image);
      let binary = '';
      const len = byteArray.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(byteArray[i]);
      }
      const base64String = btoa(binary);
      setImageSrc(`data:image/jpeg;base64,${base64String}`);
    } else {
      setImageSrc('');
    }
  }, [foodItem]);

  if (!foodItem) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{foodItem.name}</h1>
      <p>Description: {foodItem.description}</p>
      <div>
        Image:
        {imageSrc ? (
          <img className="h-48 w-96 object-cover ..." src={imageSrc} alt={foodItem.name} />
        ) : (
          <p>No image available</p>
        )}
      </div>
      <p>
        Location Link:
        <Link href={foodItem.directionLink}>{foodItem.directionLink}</Link>
      </p>
      <p>Open Hours: {foodItem.openHours}</p>

      {/* Display the tags */}
      <div>
        <h2>Tags:</h2>
        <ul>
          {tags.map((tag) => (
            <li key={tag.id}>{tag.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}