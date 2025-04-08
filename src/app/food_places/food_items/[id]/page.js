"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // Import Link from next/link


export default function FoodItemDetails() {
 const { id } = useParams(); // Use useParams to get the dynamic route parameter
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
         setFoodItem(data);
       } catch (error) {
         console.error("Error fetching food item:", error);
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
     <p>Description: {foodItem.description}</p>
     <p>
       Image:{" "}
       {foodItem.image ? (
         <img src={foodItem.image} alt={foodItem.name} />
       ) : (
         "No image available"
       )}
     </p>
     <p>
       Location Link:{" "}
       <Link href={foodItem.directionLink}>{foodItem.directionLink}</Link>
     </p>
     <p>Open Hours: {foodItem.openHours}</p>
   </div>
 );
}
