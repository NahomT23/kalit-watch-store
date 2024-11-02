import React, { useState, useEffect } from 'react';
import Item from './Item';

function ItemList({ items, onSendToTelegram, searchQuery }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Assume items are being fetched and set loading to false once fetched
        if (items.length > 0 || searchQuery !== '') {
            setLoading(false);
        }
    }, [items, searchQuery]);

    return (
        <div className="w-full flex flex-col items-center p-1">
            {loading ? (
                <p className="text-center text-2xl mt-4 text-red-800"><strong>Loading items...</strong></p>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {items.map(item => (
                        <div key={item.id} className="p-2">
                            <Item item={item} onSendToTelegram={onSendToTelegram} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-lg mt-4">
                    {searchQuery ? `${searchQuery} is not available` : 'No items available'}
                </p>
            )}
        </div>
    );
}

export default ItemList;




