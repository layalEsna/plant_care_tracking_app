
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
               
                return res.json()
            })
            .then(data => {
                
                setUser(data)
                
                setCategories(data.categories)
                setPlantsData(data.plants)
                             })
            .catch(e => console.error("AppProvider useEffect error:", e))
       
    }, [])
    return (
        <AppContext.Provider value={{ user, setUser, plants, setPlants, categories, setCategories }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext