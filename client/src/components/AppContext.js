
import React, { createContext, useState, useEffect} from 'react'

const AppContext = createContext()
export const AppProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const [plants, setPlants] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)
    const [allCategories, setAllCategories] = useState([])
    // const [categoriesLoading, setCategoriesLoading] = useState(true)

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
                
                setUser(data)
                
                setCategories(data.categories)
                setPlantsData(data.plants)
            })
            .catch(e => console.error("AppProvider useEffect error:", e))
    }, [])

    useEffect(() => {
        // setCategoriesLoading(true)
        fetch('/categories')
            .then(res => {
                if (!res.ok) {
                throw new Error('Failed to fetch data.')
                }
                return res.json()
        })
            .then(data => {
                console.log('fetched categories', data)
                if(Array.isArray(data)){
                    setAllCategories(data)
                }
                else {
                    console.error(data)
                }
        })
            .catch(e => console.error(e))
            // .finally(() => setCategoriesLoading(false))
        
    }, [])

    

    return (
        <AppContext.Provider value={{ user, setUser, plants, setPlants, categories, setCategories, selectedCategoryId, setSelectedCategoryId, allCategories }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext