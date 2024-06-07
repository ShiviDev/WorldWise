import { createContext, useContext, useEffect, useState } from "react";

const CititesContext = createContext()
function CitiesProvider({ children }) {
    const BASIC_URL = 'http://localhost:9000'
    const [cities, setCities] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentCity, setCurrentCity] = useState({})

    useEffect(function () {
        async function fetchData() {
            try {
                setIsLoading(true)
                const res = await fetch(`${BASIC_URL}/cities`)
                const data = await res.json()
                setCities(data)
            } catch (err) {
                alert('There was an error loading data')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])
    async function getCity(id) {
        try {
            setIsLoading(true);
            const res = await fetch(`${BASIC_URL}/cities/${id}`)
            const data = await res.json()
            setCurrentCity(data)
        } catch (err) {
            alert('There was an error loading data')
        } finally {
            setIsLoading(false)
        }
    }

    async function createCity(newCity) {
        try {
            setIsLoading(true);
            const res = await fetch(`${BASIC_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': "application/json",
                },
            })
            const data = await res.json()
            console.log(data)
        } catch (err) {
            alert('There was an error loading data')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <CititesContext.Provider value={{
            cities, isLoading,
            currentCity,
            getCity,
            createCity
        }}>
            {children}
        </CititesContext.Provider>
    )
}
function useCities() {
    const context = useContext(CititesContext)
    if (context === undefined) throw new Error("context used outside CitiesProvider")
    return context
}

export { CitiesProvider, useCities }