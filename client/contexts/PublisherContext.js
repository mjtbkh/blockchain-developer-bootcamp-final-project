import { useState, createContext } from "react";

export const PublisherContext = createContext({});

export default function PublisherContextProvider(props) {
    const [isPublishersOpen, setIsPublishersOpen] = useState(false);

    return (
        <PublisherContext.Provider
            value={{
                isPublishersOpen,
                setIsPublishersOpen
            }}
        >
            {props.children}
        </PublisherContext.Provider>
    )
}