"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';

export default function Home() {
    const [serviceData, setServiceData] = useState([]);
    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await fetch('/api/serviceItem');
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
                    <li key={item.id}>
                        <Link href={`/service_places/${item.id}`}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
