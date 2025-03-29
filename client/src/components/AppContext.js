
import React, { createContext, useState, useEffect} from 'react'

const AppContext = createContext()
export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [plants, setPlants] = useState([])
    const [categories, setCategories] = useState([])
    function setPlantsData(plantsData) {
        setPlants(plantsData)
    }


    useEffect(() => {
        
        fetch('/check_session')
            .then(res => {
                if (!res.ok) {
                    

                throw new Error('Failed to fetch data.')
                }
                return res.json()
        })
            .then(data => {
                console.log("Parsed JSON Data:", data); // Log the parsed JSON data
            
                if (data) {
                    setUser(data)
                    setCategories(data.categories)
                }

                
        })
        .catch(e=> console.error(e))
    }, [])

   
    return (
        <AppContext.Provider value={{ user, setUser, plants, setPlants, categories, setCategories }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext