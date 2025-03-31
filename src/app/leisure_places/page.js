"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';

export default function Home() {
    const [leisureData, setLeisureData] = useState([]);
    useEffect(() => {
        const fetchLeisureData = async () => {
            try {
                const response = await fetch('/api/leisureItem');
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
                    <li key={item.id}>
                        <Link href={`/leisure_places/${item.id}`}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
