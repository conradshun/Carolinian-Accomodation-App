"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';

export default function Home() {
    const [foodData, setFoodData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTagTerm, setSearchTagTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [tagResults, setTagResults] = useState([]);

    useEffect(() => {
        const fetchFoodData = async () => {
            try {
                const response = await fetch(`/api/food_items?includeTags=true`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (Array.isArray(data)) {
                    setFoodData(data);
                } else if (data?.data && Array.isArray(data.data)) {
                    setFoodData(data.data);
                } else {
                    console.error('Unexpected API response format:', data);
                    setFoodData([]);
                }
            } catch (error) {
                console.error('Error fetching food data:', error);
                setFoodData([]);
            }
        };

        fetchFoodData();
    }, []);

    // Make sure these are inside the component!
    const handleSearch = async () => {
      try {
          const response = await fetch(`/api/search?query=${searchTerm}`);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const results = await response.json();
          setSearchResults(results);
      } catch (error) {
          console.error('Error during search:', error);
          setSearchResults([]);
      }
    };

    const handleTagSearch = async () => {
      try {
          const response = await fetch(`/api/tagSearch?query=${searchTagTerm}`);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const results = await response.json();
          setTagResults(results);
      } catch (error) {
          console.error('Error during tag search:', error);
          setTagResults([]);
      }
    };

    return (
        <div>
            <h1>Food Places</h1>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for food..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Display search results */}
            {searchResults.length > 0 && (
                <div className="search-results">
                    <h2>Search Results:</h2>
                    <ul>
                        {searchResults.map((item) => (
                            <li key={item.id}>
                                <Link href={`/food_places/food_items/${item.id}`}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Tag Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by tags..."
                    value={searchTagTerm}
                    onChange={(e) => setSearchTagTerm(e.target.value)}
                />
                <button onClick={handleTagSearch}>Search</button>
            </div>

            {/* Display tag search results */}
            {tagResults.length > 0 && (
                <div className="search-results">
                    <h2>Search Results:</h2>
                    <ul>
                        {tagResults.map((item) => (
                            <li key={item.id}>
                                <Link href={`/food_places/food_items/${item.id}`}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Food Item List */}
            <ul>
                {foodData?.map((item) => (
                    <FoodItem key={item.id} item={item} />
                ))}
            </ul>
        </div>
    );
}


function FoodItem({ item }) {
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        if (item?.image) {
            const byteArray = new Uint8Array(item.image);
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
    }, [item.image]);

    return (
        <li>
            <Link href={`/food_places/food_items/${item.id}`}>{item.name}</Link>
            <br />
            <Link href={`/food_places/food_items/${item.id}`}>{item.description}</Link>
            <br />
            {imageSrc ? (
                <img className="h-48 w-96 object-cover ..." src={imageSrc} alt={item.name} />
            ) : (
                <p>No image available</p>
            )}
            <br />
            <Link href={`/food_places/food_items/${item.id}`}>{item.directionLink}</Link>
            <br />
            <Link href={`/food_places/food_items/${item.id}`}>{item.openHours}</Link>
            <br />
            <br />
            {/* Display the tags */}
            <div>
                <h2>Tags:</h2>
                {item.tags && item.tags.length > 0 ? (
                    <ul>
                        {item.tags.map((foodItemTag) => (
                            <li key={foodItemTag.tag.id}>{foodItemTag.tag.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No tags available</p>
                )}
            </div>
        </li>
    );
}
