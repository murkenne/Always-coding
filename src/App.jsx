import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import PokemonDetails from './components/PokemonDetails';

function Header({ searchedPokemon, onSearchChange, onSearchSubmit }) {
  return (
    <header>
      <h1>Choose Your Pokemon!</h1>
    </header>
  );
}

function PreviewList({ items, onAbandonItem, onSummonPokemon }) {
  return (
    <div className="preview-list">
      {items.map((item) => (
        <div key={item.id} className="preview-item">
          <h3>{item.title}</h3>
          <button onClick={() => onSummonPokemon(item)}>Summon Pokemon</button>
          <button onClick={() => onAbandonItem(item.id)}>Abandon</button>
        </div>
      ))}
    </div>
  );
}

function FeaturedPokemon({ item, onReturn }) {
  return (
    <div className="featured-pokemon">
      <h2>Featured Pokémon</h2>
      {item ? (
        <>
          <img src={item.sprites.front_default} alt="Featured Pokemon" />
          <div>
            <h3>{item.name}</h3>
            <p>Height: {Math.round(item.height * 3.9)} inches</p>
            <p>Weight: {Math.round(item.weight / 4.3)} lbs</p>
            <p>Number of Battles: {item.game_indices.length}</p>
            {/* Display other details as desired */}
          </div>
          <button onClick={onReturn}>Return</button>
        </>
      ) : (
        <p>No item selected</p>
      )}
    </div>
  );
}

function Loading() {
  return <div className="loading">Loading...</div>;
}

function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [featuredPokemon, setFeaturedPokemon] = useState(null);
  const [searchedPokemon, setSearchedPokemon] = useState('');
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(false);
  const [originalWindow, setOriginalWindow] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=25');
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      const fetchedItems = data.results.map((result) => ({
        id: result.name,
        title: result.name,
      }));
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbandonItem = (itemId) => {
    const confirmed = window.confirm('Are you sure you want to abandon this Pokémon?');
    if (confirmed) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      setSelectedItem((prevItem) => (prevItem?.id === itemId ? null : prevItem));
    }
  };

  const openPokemonWindow = (data) => {
    const pokemonWindow = window.open('', '_blank');
    pokemonWindow.document.write(`
      <html>
        <head>
          <title>${data.name}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h2 { margin-top: 0; }
            img { max-width: 200px; }
          </style>
        </head>
        <body>
          <h2>${data.name}</h2>
          <img src="${data.sprites.front_default}" alt="Featured Pokemon" />
          <div>
            <h3>Type: ${data.types[0].type.name}</h3>
            <p>Height: ${Math.round(data.height * 3.9)} inches</p>
            <p>Weight: ${Math.round(data.weight / 4.3)} lbs</p>
            <p>Number of Battles: ${data.game_indices.length}</p>
          </div>
          <button onclick="window.opener.focus(); window.close();">Return</button>
        </body>
      </html>
    `);

    setOriginalWindow(pokemonWindow);
  };

  const handleSummonPokemon = async (item) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${item.id}`);
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      setFeaturedPokemon(data);
      openPokemonWindow(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = () => {
    if (originalWindow) {
      originalWindow.focus();
      originalWindow.close();
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchedPokemon === '') {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchedPokemon}`);
      const data = response.data;
      setFeaturedPokemon(data);
      openPokemonWindow(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setSearchedPokemon('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchedPokemon(e.target.value.toLowerCase());
  };

  return (
    <div className="app">
      <Header
        searchedPokemon={searchedPokemon}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearch}
      />
      <PokemonDetails /> {/* PokemonDetails component at the top */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PreviewList
            items={items}
            onAbandonItem={handleAbandonItem}
            onSummonPokemon={handleSummonPokemon}
          />
          {isFeaturedOpen && (
            <div className="featured-window">
              <FeaturedPokemon item={featuredPokemon} onReturn={handleReturn} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
                    