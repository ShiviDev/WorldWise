/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useReducer, useState } from "react";

const CititesContext = createContext()

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
}

function reducer(state, action) {
    switch (action.type) {
        case 'loading':
            return { ...state, isLoading: true }
        case 'cities/loaded':
            return {
                ...state, isLoading: false, cities: action.payload,
            }
        case 'city/loaded': return { ...state, isLoading: false, currentCity: action.payload }
        case 'city/created':
            return {
                ...state, isLoading: false, cities: [...state.cities, action.payload],
                currentCity: action.payload
            }
        case 'city/deleted':
            return {
                ...state, isLoading: false, cities: state.cities.filter((city) => city.id !== action.payload),
                currentCity: {}
            }
        case 'rejected':
            return {
                ...state, isLoading: false, error: action.payload
            }
        default:
            throw new Error("")
    }
}


function CitiesProvider({ children }) {
    const BASIC_URL = 'http://localhost:9000'
    const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState)
    // const [cities, setCities] = useState([])
    // const [isLoading, setIsLoading] = useState(false)
    // const [currentCity, setCurrentCity] = useState({})

    useEffect(function () {
        async function fetchData() {
            dispatch({ type: "loading" })
            try {

                const res = await fetch(`${BASIC_URL}/cities`)
                const data = await res.json()
                dispatch({ type: 'cities/loaded', payload: data })
            } catch (err) {
                dispatch({ type: 'rejected', payload: 'There was an error loading cities' })
            }
        }
        fetchData()
    }, [])
    async function getCity(id) {
        if (Number(id) === currentCity.id) return
        dispatch({ type: "loading" })
        try {

            const res = await fetch(`${BASIC_URL}/cities/${id}`)
            const data = await res.json()
            dispatch({ type: 'city/loaded', payload: data })
        } catch (err) {
            dispatch({ type: 'rejected', payload: 'There was an error loading city' })
        }
    }
    async function deleteCity(id) {
        dispatch({ type: "loading" })
        try {

            await fetch(`${BASIC_URL}/cities/${id}`, {
                method: 'DELETE',
            })
            dispatch({ type: 'city/deleted', payload: id })
        } catch (err) {
            dispatch({ type: 'rejected', payload: 'There was an error deleting city' })
        }
    }

    async function createCity(newCity) {
        dispatch({ type: "loading" })
        try {

            const res = await fetch(`${BASIC_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': "application/json",
                },
            })
            const data = await res.json()
            dispatch({ type: 'city/created', payload: data })
        } catch (err) {
            dispatch({ type: 'rejected', payload: 'There was an error creating city' })
        }
    }
    return (
        <CititesContext.Provider value={{
            cities, isLoading,
            currentCity,
            getCity,
            createCity,
            deleteCity
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