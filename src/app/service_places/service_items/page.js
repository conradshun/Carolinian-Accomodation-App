"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';

export default function Home() {
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await fetch('/api/service_items');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServiceData(data);
      } catch (error) {
        console.error('Error fetching service data:', error);
        // Optionally, you can set an error state or display an error message to the user
      }
    };

    fetchServiceData();
  }, []);

  return (
    <div>
      <h1>Service Places</h1>
      <ul>
        {serviceData.map((item) => (
          <ServiceItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

//This is the serviceItem component inside the Home component

function ServiceItem({ item }) {
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
        <Link href={`/service_places/service_items/${item.id}`}>{item.name}</Link>
        <br />
        <Link href={`/service_places/service_items/${item.id}`}>{item.description}</Link>
        <br />
        {imageSrc ? (
          <img className="h-48 w-96 object-cover ..." src={imageSrc} alt={item.name} />
        ) : (
          <p>No image available</p>
        )}
        <br />
        <Link href={`/service_places/service_items/${item.id}`}>{item.directionLink}</Link>
        <br />
        <Link href={`/service_places/service_items/${item.id}`}>{item.openHours}</Link>
        <br />
        <br />
      </li>
    );
  }
  