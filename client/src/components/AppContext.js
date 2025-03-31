
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
        console.log("AppProvider useEffect started");
        fetch('/check_session')
            .then(res => {
                console.log("AppProvider fetch response:", res);
                return res.json();
            })
            .then(data => {
                console.log("AppProvider check session data:", data);
                setUser(data);
                setCategories(data.categories);
                setPlantsData(data.plants);
                console.log("AppProvider categories state:", data.categories)
                console.log("AppProvider plants state:", data.plants)
            })
            .catch(e => console.error("AppProvider useEffect error:", e));
        console.log("AppProvider useEffect finished");
    }, []);
    return (
        <AppContext.Provider value={{ user, setUser, plants, setPlants, categories, setCategories }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext