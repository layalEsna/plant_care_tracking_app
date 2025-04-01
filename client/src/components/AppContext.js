
import React, { createContext, useState, useEffect} from 'react'

const AppContext = createContext()
export const AppProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const [plants, setPlants] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)

    function setPlantsData(plantsData) {
        setPlants(plantsData)
    }

    useEffect(() => {
        // Retrieve selectedCategoryId from localStorage on initial load
        const storedCategoryId = localStorage.getItem('selectedCategoryId');
        if (storedCategoryId) {
            setSelectedCategoryId(parseInt(storedCategoryId));
        }

        fetch('/check_session')
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log("Data from /check_session:", data); // Add this log
                setUser(data)
                console.log("User state after setting:", data)
                setCategories(data.categories)
                setPlantsData(data.plants)
            })
            .catch(e => console.error("AppProvider useEffect error:", e))
    }, [])

    return (
        <AppContext.Provider value={{ user, setUser, plants, setPlants, categories, setCategories, selectedCategoryId, setSelectedCategoryId }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext