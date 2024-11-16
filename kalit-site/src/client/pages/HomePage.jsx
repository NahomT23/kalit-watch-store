// import React, { useState, useEffect } from 'react';
// import ItemList from '../components/ItemList';
// import Cart from '../cart/Cart';
// import SearchAndFilter from '../components/SearchAndFilter';
// import ScrollToTopButton from '../components/ScrollToTopButton'; 



// function HomePage() {
//     const [items, setItems] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [sortOrder, setSortOrder] = useState("");
//     const [minPrice, setMinPrice] = useState("");
//     const [maxPrice, setMaxPrice] = useState("");
//     const [showSortOptions, setShowSortOptions] = useState(false); 

//     useEffect(() => {
//         const fetchLatestItems = async () => {
//             try {
//                 const response = await fetch("/api/items");
//                 const data = await response.json();
//                 setItems(data);
//             } catch (error) {
//                 console.error("Error fetching latest items:", error);
//             }
//         };

//         fetchLatestItems();
//         const interval = setInterval(fetchLatestItems, 5000);
//         return () => clearInterval(interval);
//     }, []);

//     const handleSendToTelegram = async (id, name, price) => {
//         try {
//             await fetch("/api/sendToTelegram", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ id, name, price }),
//             });
//         } catch (error) {
//             console.error("Error sending to Telegram:", error);
//         }
//     };

//     const parsePrice = (price) => {
//         const sanitizedPrice = price.replace(/,/g, '');
//         const number = parseFloat(sanitizedPrice);
//         return isNaN(number) ? 0 : number;
//     };

//     let filteredItems = items
//         .filter(item =>
//             item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
//             (minPrice === "" || parsePrice(item.price) >= parsePrice(minPrice)) &&
//             (maxPrice === "" || parsePrice(item.price) <= parsePrice(maxPrice))
//         );

//     if (sortOrder === "asc") {
//         filteredItems = filteredItems.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
//     } else if (sortOrder === "desc") {
//         filteredItems = filteredItems.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
//     }






//     return (
//         <div className="app-container flex flex-col items-center">
             
//                 <div className="flex justify-center text-center">
//                     <p className="w-full whitespace-nowrap overflow-hidden animate-typing font-baskervville text-3xl text-red-950 my-2">
//                         KALIT WATCH STORE
//                     </p>

//                 </div>
//             <SearchAndFilter
//                 searchQuery={searchQuery}
//                 setSearchQuery={setSearchQuery}
//                 sortOrder={sortOrder}
//                 setSortOrder={setSortOrder}
//                 minPrice={minPrice}
//                 setMinPrice={setMinPrice}
//                 maxPrice={maxPrice}
//                 setMaxPrice={setMaxPrice}
//                 showSortOptions={showSortOptions}
//                 setShowSortOptions={setShowSortOptions}
//             />
//             <ItemList items={filteredItems} onSendToTelegram={handleSendToTelegram} searchQuery={searchQuery} />
//             {/* <Cart items={items} /> */}
//             <ScrollToTopButton /> {/* Add the ScrollToTopButton component */}
//         </div>
//     );
// }

// export default HomePage;

import React, { useState, useEffect } from 'react';
import ItemList from '../components/ItemList';
import Cart from '../cart/Cart';
import SearchAndFilter from '../components/SearchAndFilter';
import ScrollToTopButton from '../components/ScrollToTopButton'; 

function HomePage() {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false); 

    useEffect(() => {
        const fetchLatestItems = async () => {
            try {
                const response = await fetch("/api/items");
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error fetching items: ${response.status} - ${errorText}`);
                    return; // Exit the function if there's an error
                }
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error("Error fetching latest items:", error);
            }
        };

        fetchLatestItems();
        const interval = setInterval(fetchLatestItems, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSendToTelegram = async (id, name, price) => {
        try {
            await fetch("/api/sendToTelegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, name, price }),
            });
        } catch (error) {
            console.error("Error sending to Telegram:", error);
        }
    };

    const parsePrice = (price) => {
        const sanitizedPrice = price.replace(/,/g, '');
        const number = parseFloat(sanitizedPrice);
        return isNaN(number) ? 0 : number;
    };

    let filteredItems = items
        .filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (minPrice === "" || parsePrice(item.price) >= parsePrice(minPrice)) &&
            (maxPrice === "" || parsePrice(item.price) <= parsePrice(maxPrice))
        );

    if (sortOrder === "asc") {
        filteredItems = filteredItems.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOrder === "desc") {
        filteredItems = filteredItems.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return (
        <div className="app-container flex flex-col items-center">
            <div className="flex justify-center text-center">
                <p className="w-full whitespace-nowrap overflow-hidden animate-typing font-baskervville text-3xl text-red-950 my-2">
                    KALIT WATCH STOREe
                </p>
            </div>
            <SearchAndFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                showSortOptions={showSortOptions}
                setShowSortOptions={setShowSortOptions}
            />
            <ItemList items={filteredItems} onSendToTelegram={handleSendToTelegram} searchQuery={searchQuery} />
            {/* <Cart items={items} /> */}
            <ScrollToTopButton /> {/* Add the ScrollToTopButton component */}
        </div>
    );
}

export default HomePage;
