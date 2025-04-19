"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';

export default function Home() {
  const [leisureData, setLeisureData] = useState([]);

  useEffect(() => {
    const fetchLeisureData = async () => {
      try {
        const response = await fetch('/api/leisure_items');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLeisureData(data);
      } catch (error) {
        console.error('Error fetching leisure data:', error);
        // Optionally, you can set an error state or display an error message to the user
      }
    };

    fetchLeisureData();
  }, []);

  return (
    <div>
      <h1>Leisure Places</h1>
      <ul>
        {leisureData.map((item) => (
          <LeisureItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

//This is the leisureItem component inside the Home component

function LeisureItem({ item }) {
    const [imageSrc, setImageSrc] = useState('');
  
    useEffect(() => {
      if (item?.image) {
        // Convert byte array to Base64 string
        const byteArray = new Uint8Array(item.image);
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
    }, [item.image]);
  
    return (
      <li>
        <Link href={`/leisure_places/leisure_items/${item.id}`}>{item.name}</Link>
        <br />
        <p href={`/leisure_places/leisure_items/${item.id}`}>{item.description}</p>
        <br />
        {imageSrc ? (
          <img className="h-48 w-96 object-cover ..." src={imageSrc} alt={item.name} />
        ) : (
          <p>No image available</p>
        )}
        <br />
        <Link href={`/leisure_places/leisure_items/${item.id}`}>{item.directionLink}</Link>
        <br />
        <p href={`/leisure_places/leisure_items/${item.id}`}>{item.openHours}</p>
        <br />
        <br />
      </li>
    );
  }
  