"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';

export default function Home() {
    const [leisureData, setLeisureData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTagTerm, setSearchTagTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [tagResults, setTagResults] = useState([]);

    useEffect(() => {
        const fetchLeisureData = async () => {
            try {
                const response = await fetch(`/api/leisure_items?includeTags=true`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLeisureData(data);
            } catch (error) {
                console.error('Error fetching leisure data:', error);
            }
        };

        fetchLeisureData();

    }, []);

    //Implementing search functionality
    const handleSearch = async () => {
      try {
          const response = await fetch(`/api/search?query=${searchTerm}`); //This will create a request to the search API route to communicate the search term
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const results = await response.json();
          setSearchResults(results); //This will update the search result state based on the validity of the API
      } catch (error) {
          console.error('Error during search:', error);
          setSearchResults([]); // Clear results on error
      }
  };

  const handleTagSearch = async () => {
    try {
        const response = await fetch(`/api/tagSearch?query=${searchTagTerm}`); //This will create a request to the search API route to communicate the search term
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const results = await response.json();
        setTagResults(results); //This will update the search result state based on the validity of the API
    } catch (error) {
        console.error('Error during search:', error);
        setTagResults([]); // Clear results on error
    }
};
    

    return (
        <div>
            <h1>Leisure Places</h1>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for leisure..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} //Every character will cause the state to update
                />
                <button onClick={handleSearch}>Search</button> {/* Click the button to call the function to commence the API search */}
            </div>

            {/* Display search results */}
            {searchResults.length > 0 && (
                <div className="search-results">
                    <h2>Search Results:</h2>
                    <ul>
                        {searchResults.map((item) => (
                            <li key={item.id}>
                                <Link href={`/leisure_places/leisure_items/${item.id}`}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

          {/* Search Bar */}
          <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by tags..."
                    value={searchTagTerm}
                    onChange={(e) => setSearchTagTerm(e.target.value)} //Every character will cause the state to update
                />
                <button onClick={handleTagSearch}>Search</button> {/* Click the button to call the function to commence the API search */}
            </div>

            {/* Display search results */}
            {tagResults.length > 0 && (
                <div className="search-results">
                    <h2>Search Results:</h2>
                    <ul>
                        {tagResults.map((item) => (
                            <li key={item.id}>
                                <Link href={`/leisure_places/leisure_items/${item.id}`}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {/*leisure Item List */}
            <ul>
                {leisureData.map((item) => (
                    <LeisureItem key={item.id} item={item} />
                ))}
            </ul>
        </div>
    );
}


function LeisureItem({ item }) {
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
            <Link href={`/leisure_places/leisure_items/${item.id}`}>{item.name}</Link>
            <br />
            <Link href={`/leisure_places/leisure_items/${item.id}`}>{item.description}</Link>
            <br />
            {imageSrc ? (
                <img className="h-48 w-96 object-cover ..." src={imageSrc} alt={item.name} />
            ) : (
                <p>No image available</p>
            )}
            <br />
            <Link href={`/leisure_places/leisure_items/${item.id}`}>{item.directionLink}</Link>
            <br />
            <Link href={`/leisure_places/leisure_items/${item.id}`}>{item.openHours}</Link>
            <br />
            <br />
            {/* Display the tags */}
      <div>
        <h2>Tags:</h2>
        <ul>
         {item.tags && item.tags.length > 0 ? (
        <ul>
          {item.tags.map((leisureItemTag) => (
            <li key={leisureItemTag.tag.id}>{leisureItemTag.tag.name}</li>
          ))}
        </ul>
      ) : (
        <p>No tags available</p>
      )}

        </ul>
      </div>
            
        </li>
    );
}
