import { useState } from "react";
import { GameState } from "../../App/GameState.js";
const useCarRental = () => {
  const [carModel, setCarModel] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const handleSearch = () => {
    if (!carModel || !city) {
      alert("MODEL I MIASTO S\u0104 WYMAGANE");
      return;
    }
    setIsSearching(true);
    setTimeout(() => {
      const found = GameState.carRentals.filter(
        (r) => r.carModel.toLowerCase().includes(carModel.toLowerCase()) && r.city.toLowerCase().includes(city.toLowerCase())
      );
      setResults(found);
      setIsSearching(false);
    }, 800);
  };
  return {
    carModel,
    setCarModel,
    city,
    setCity,
    results,
    isSearching,
    handleSearch
  };
};
export {
  useCarRental
};
