import { useState, createContext } from "react";

export const FormContext = createContext({});

export default function FormContextProvider(props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [episodeObject, setEpisodeObject] = useState({
        title: '',
        link: '',
        pledge: 0
    });

    return (
        <FormContext.Provider
            value={{
                isFormOpen,
                setIsFormOpen,
                episodeObject,
                setEpisodeObject
            }}
        >
            {props.children}
        </FormContext.Provider>
    );
}