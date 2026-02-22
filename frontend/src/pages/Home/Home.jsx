import React, { useContext } from 'react'
import './Home.css'
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { StoreContext } from '../../context/StoreContext';

const Home = () => {
  const { searchQuery } = useContext(StoreContext);

  const [category, setCategory] = React.useState("All");

  return (
    <div>
      {!searchQuery && (
        <>
          <Header />
          <ExploreMenu category={category} setCategory={setCategory} />
        </>
      )}
      <FoodDisplay category={category} />
    </div>
  )
}

export default Home;
