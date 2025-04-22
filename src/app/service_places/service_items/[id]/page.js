"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function serviceItemDetails() {
  const { id } = useParams();
  const [serviceItem, setServiceItem] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [tags, setTags] = useState([]); // New state for tags

  useEffect(() => {
    if (id) {
      const fetchServiceItem = async () => {
        try {
          const response = await fetch(`/api/service_items/${id}?includeTags=true`); //Fetch tags
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setServiceItem(data);
          setTags(data.tags.map(tag => tag.tag)); // Extract tags
        } catch (error) {
          console.error("Error fetching service item:", error);
        }
      };
      fetchServiceItem();
    }
  }, [id]);

  useEffect(() => {
    if (serviceItem && serviceItem.image) {
      const byteArray = new Uint8Array(serviceItem.image);
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
  }, [serviceItem]);

  if (!serviceItem) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{serviceItem.name}</h1>
      <p>Description: {serviceItem.description}</p>
      <div>
        Image:
        {imageSrc ? (
          <img className="h-48 w-96 object-cover ..." src={imageSrc} alt={serviceItem.name} />
        ) : (
          <p>No image available</p>
        )}
      </div>
      <p>
        Location Link:
        <Link href={serviceItem.directionLink}>{serviceItem.directionLink}</Link>
      </p>
      <p>Open Hours: {serviceItem.openHours}</p>

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
