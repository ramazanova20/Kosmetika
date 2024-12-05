// src/components/Main/JewelryItem.jsx
import React, { useContext, useState, useEffect } from "react";
import { DATA } from "../../context/DataContext";
import Heart from './Heart'; 

function JeweleryItem() {
  const { jewelery } = useContext(DATA);
  const [showProductList, setShowProductList] = useState([]);
  const [sorting, setSorting] = useState("latest");
  const [quantities, setQuantities] = useState({}); // Hər məhsul üçün miqdar

  useEffect(() => {
    if (jewelery) {
      setShowProductList(jewelery); 
    }
  }, [jewelery]);

  useEffect(() => {
    if (showProductList.length > 0) {
      handleSortingChange(sorting); 
    }
  }, [sorting, jewelery]);

  const handleSortingChange = (newSorting) => {
    setSorting(newSorting);

    let sortedProducts = [...jewelery];

    if (newSorting === "high-to-low") {
      sortedProducts.sort((a, b) => b.price - a.price); 
    } else if (newSorting === "low-to-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else {
      sortedProducts = jewelery;
    }

    setShowProductList(sortedProducts); 
  };

  const updateQuantity = (id, newQuantity) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: newQuantity,
    }));
  };

  if (!jewelery) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <div>
        Sıralama:
        <select
          name="sorting"
          id="sorting"
          onChange={(e) => handleSortingChange(e.target.value)}
          value={sorting}
        >
          <option value="latest">Son Məhsullar</option>
          <option value="high-to-low">Bahadan Ucuza</option>
          <option value="low-to-high">Ucuzdan Bahaya</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-10 mx-auto justify-center m-1">
        {showProductList.map((item, i) => {
          const itemQuantity = quantities[item.id] || 1; // Varsayılan miqdar 1
          const totalPrice = Math.floor(itemQuantity * item.price); // Qiyməti yuvarlayır

          return (
            <div
              key={i}
              className="max-w-[200px] h-[500px] rounded overflow-hidden shadow-lg bg-white relative">
              <div className="rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5">
                <Heart />
              </div>
              <div className="w-full h-[280px]">
                <img className='h-full object-contain' src={item.image} alt={item.title} />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 whitespace-nowrap">
                  {item.title.slice(0, 17)}
                </h2>
                <h5 className="text-lg font-semibold mb-4">{totalPrice}₼</h5>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(itemQuantity - 1, 1))
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="px-3 py-2">{itemQuantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, itemQuantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() =>
                    alert(
                      `You selected ${itemQuantity} ${item.title}(s) for ${totalPrice} ₼.`
                    )
                  }
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Buy
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default JeweleryItem;
