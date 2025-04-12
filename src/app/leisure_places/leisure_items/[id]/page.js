"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // Import Link from next/link

export default function leisureItemDetails() {
  const { id } = useParams(); // Use useParams to get the dynamic route parameter
  const [leisureItem, setLeisureItem] = useState(null);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (id) {
      const fetchLeisureItem = async () => {
        try {
          const response = await fetch(`/api/leisure_items/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setLeisureItem(data);
        } catch (error) {
          console.error("Error fetching leisure item:", error);
        }
      };
      fetchLeisureItem();
    }
  }, [id]);

  useEffect(() => {
    if (leisureItem && leisureItem.image) { // Add this check
      // Convert byte array to Base64 string
      const byteArray = new Uint8Array(leisureItem.image);
      let binary = '';
      const len = byteArray.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(byteArray[i]);
      }
      const base64String = btoa(binary);
      setImageSrc(`data:image/jpeg;base64,${base64String}`);
    } else {
      setImageSrc(''); // Reset imageSrc if there's no image
    }
  }, [leisureItem]);
  

  if (!leisureItem) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{leisureItem.name}</h1>
      <p>Description: {leisureItem.description}</p>
      <div>
        Image:{" "}
        {imageSrc ? (
          <img className="h-48 w-96 object-cover ..." src={imageSrc} alt={leisureItem.name} />
        ) : (
          <p>No image available</p>
        )}
      </div>
      <p>
        Location Link:{" "}
        <Link href={leisureItem.directionLink}>{leisureItem.directionLink}</Link>
      </p>
      <p>Open Hours: {leisureItem.openHours}</p>
    </div>
  );
} 