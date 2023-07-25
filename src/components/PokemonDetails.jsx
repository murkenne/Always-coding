import React, { useState } from "react";
import axios from "axios";

const PokemonDetails = () => {
  const [pokemon, setPokemon] = useState("");
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonType, setPokemonType] = useState("");
  const [originalWindow, setOriginalWindow] = useState(null);

  const handleChange = (e) => {
    setPokemon(e.target.value.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await getPokemon();
  };

  const getPokemon = async () => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
      );

      const data = response.data;
      setPokemonData([data]);
      setPokemonType(data.types[0].type.name);
      openPokemonWindow(data);
    } catch (error) {
      console.log(error);
    }
  };

  const openPokemonWindow = (data) => {
    const pokemonWindow = window.open("", "_blank");
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
            <h3>Type: ${pokemonType}</h3>
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

  const handleReturn = () => {
    if (originalWindow) {
      originalWindow.focus();
      originalWindow.close();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={pokemon}
            onChange={handleChange}
            placeholder="Search Pokemon by name"
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {pokemonData.map((data) => (
        <div key={data.id}>
          <h2>{data.name}</h2>
          <img src={data.sprites.front_default} alt={data.name} />
          <div>
            <h3>Type: {pokemonType}</h3>
            <p>Height: {Math.round(data.height * 3.9)} inches</p>
            <p>Weight: {Math.round(data.weight / 4.3)} lbs</p>
            <p>Number of Battles: {data.game_indices.length}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PokemonDetails;
