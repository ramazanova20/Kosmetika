import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProductByName } from '../../services/api';
import Heart from './Heart';
import Favorites from './Favorites'; // Doğru fayl yolunu göstərin

function Cosmetics() {
  const location = useLocation();
  const url = location.search;
  const tip = new URLSearchParams(url).get('tip');
  const [data, setData] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (tip) {
      getProductByName(tip)
        .then((res) => setData(res))
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      setData(null);
    }
  }, [tip]);

  const updateQuantity = (id, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: newQuantity,
    }));
  };

  const addToFavorites = (item) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.some((fav) => fav.id === item.id)) {
        const updatedFavorites = [...prevFavorites, item];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Dərhal `localStorage`-ə yazın
        return updatedFavorites;
      }
      return prevFavorites;
    });
  };
  

  const removeFromFavorites = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((item) => item.id !== id)
    );
  };

  const shouldShowImage = !(tip === 'lipstick' || tip === 'foundation' || tip === 'eyeliner');

  return (
    <div>
      <div className="container lg:max-w-[1024px] mx-auto p-3">
        <div>
          <h6>Kosmetika</h6>
          <ul className="flex flex-col md:flex-row gap-4">
            <li><Link to="/cosmetics?tip=foundation">ÜZ üçün Kosmetika</Link></li>
            <li><Link to="/cosmetics?tip=eyeliner">GÖZ üçün Kosmetika</Link></li>
            <li><Link to="/cosmetics?tip=lipstick">DODAQ üçün Kosmetika</Link></li>
            <li><Link to="/aksesuar">Aksessuarlar</Link></li>
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-10 mx-auto justify-center m-1">
          {data && data.map((item, i) => (
            <div key={i} className="max-w-[200px] h-[500px] rounded overflow-hidden shadow-lg bg-white relative flex flex-col">
              <div className="rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5">
                {/* <Heart /> */}
                <button
                  onClick={() => addToFavorites(item)}
                 
                >
                 <Heart />
                </button>
              </div>
              <div className='w-full h-[280px]'>
                <img
                  className='h-full object-contain'
                  src={item.api_featured_image}
                  alt={item.name}
                />
              </div>

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 whitespace-nowrap">
                  {item.name.slice(0, 15)}
                </h2>
                <h5 className="text-lg font-semibold mb-4">
                  {Math.floor((quantities[item.id] || 1) * item.price)}₼
                </h5>
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max((quantities[item.id] || 1) - 1, 1))
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="px-3 py-2">{quantities[item.id] || 1}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, (quantities[item.id] || 1) + 1)
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() =>
                    alert(
                      `Seçtiğiniz məhsul: ${quantities[item.id] || 1} ədəd ${item.name} toplamda ${
                        Math.floor((quantities[item.id] || 1) * item.price)
                      } ₼.`
                    )
                  }
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Satın Al
                </button>
              </div>
            </div>
          ))}
          
          {shouldShowImage && (
            <div className="h-[400px]">
              <img 
                src="https://i.pinimg.com/originals/b0/f3/40/b0f3404f2e2f354ca713dd3bde1a3ada.gif" 
                alt="Cosmetic gif"
                className='h-[90%]' 
              />
            </div>
          )}
        </div>
        <div className="mt-4">
          <Link to="/favorites" className="text-blue-500 underline">
            Seçilmişlərə get
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cosmetics;
