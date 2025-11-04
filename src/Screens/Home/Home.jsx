import React, { useEffect, useState } from 'react'
import './Home.css'
import Header from '../../Components/Header/Header'
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import AppDownload from '../../Components/AppDownload/AppDownload'

const Home = () => {
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const removeHash = () => {
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    };
    removeHash();

    window.addEventListener("hashchange", removeHash);

    return () => {
      window.removeEventListener("hashchange", removeHash);
    };
  }, []);

  return (
    <div>
      <Header />
      <div id="explore-menu">
        <ExploreMenu category={category} setCategory={setCategory} />
      </div>

      <div id="food-display">
        <FoodDisplay category={category} />
      </div>

      <div id="app-download">
        <AppDownload />
      </div>
    </div>
  )
}

export default Home
