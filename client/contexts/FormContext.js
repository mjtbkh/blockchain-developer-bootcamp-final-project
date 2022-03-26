import { useState, createContext } from "react";

export const FormContext = createContext({});

export default function FormContextProvider(props) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <FormContext.Provider
            value={{
                isFormOpen,
                setIsFormOpen,
            }}
        >
            {props.children}
        </FormContext.Provider>
    );
}