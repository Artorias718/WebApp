
import React, { useState, useEffect } from 'react';

export const DateTime = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setDateTime(new Date()), 1000);
        return () => {
            clearInterval(id);
        }
    }, []);

    return (
        <h4>{`${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`}</h4>
    );

}

// https://gist.github.com/mohanramphp/af4f0267f5b1c3c0e726e18019eb2a0b