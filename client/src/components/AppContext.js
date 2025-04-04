
///////////////////////////////////
import React, { createContext, useState, useEffect} from 'react'

const AppContext = createContext()
export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [plants, setPlants] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategoryName, setSelectedCategoryName] = useState(null)
    const [allCategories, setAllCategories] = useState([])
    


    useEffect(() => {
        
        const storedCategoryName = localStorage.getItem('selectedCategoryName')
        if (storedCategoryName) {
            setSelectedCategoryName(storedCategoryName)
        }

        fetch('/check_session')
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log("Session data:", data)
                setUser(data)
                
                setCategories(data.categories)
                setPlants(data.plants)
                console.log("Fetched categories:", data.categories);

            })
            .catch(e => console.error("AppProvider useEffect error:", e))
            console.log("Updated allCategories:", allCategories)
    }, [])


    
    

    useEffect(() => {
       
        fetch('/categories')
            .then(res => {
                if (!res.ok) {
                throw new Error('Failed to fetch data.')
                }
                return res.json()
        })
            .then(data => {
                
                if(Array.isArray(data)){
                    setAllCategories(data)
                }
                else {
                    console.error(data)
                }
        })
            .catch(e => console.error(e))
            
        
    }, [])

    
   

    function addNewCategory(newCategory) {
        console.log("Adding new category:", newCategory)
        setUser(prevUser => {
            const prevCategories = prevUser.categories || []
            const alreadyExists = prevCategories.some(cat => cat.id === newCategory.id)
            return {
                ...prevUser,
                categories: alreadyExists ? prevCategories : [...prevCategories, newCategory]
            }
        })
    }



    function addNewCategoryToDb(newCategory) {
        

        if (!newCategory) {
            console.error("Error: newCategory is undefined")
            return
        }
        setAllCategories(prevcat => {
            if (!prevcat.some(cat => cat.id === newCategory.id)) {
                console.log("Adding category to dropdown:", newCategory)
                return [...prevcat, newCategory]
            } else {
                return prevcat
            }
        }
        )
    }

    return (
        <AppContext.Provider value={{ user, setUser, selectedCategoryName, setSelectedCategoryName, allCategories, addNewCategory, addNewCategoryToDb, plants, categories }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext





// import React, { createContext, useState, useEffect} from 'react'

// const AppContext = createContext()
// export const AppProvider = ({ children }) => {
//     const [user, setUser] = useState({})
//     const [plants, setPlants] = useState([])
//     const [categories, setCategories] = useState([])
//     const [selectedCategoryId, setSelectedCategoryId] = useState(null)
//     const [allCategories, setAllCategories] = useState([])
    

//     function setPlantsData(plantsData) {
//         setPlants(plantsData)
//     }

//     useEffect(() => {
        
//         const storedCategoryId = localStorage.getItem('selectedCategoryId')
//         if (storedCategoryId) {
//             setSelectedCategoryId(parseInt(storedCategoryId))
//         }

//         fetch('/check_session')
//             .then(res => {
//                 return res.json()
//             })
//             .then(data => {
                
//                 setUser(data)
                
//                 setCategories(data.categories)
//                 setPlantsData(data.plants)
//             })
//             .catch(e => console.error("AppProvider useEffect error:", e))
//             console.log("Updated allCategories:", allCategories)
//     }, [])

//     useEffect(() => {
       
//         fetch('/categories')
//             .then(res => {
//                 if (!res.ok) {
//                 throw new Error('Failed to fetch data.')
//                 }
//                 return res.json()
//         })
//             .then(data => {
                
//                 if(Array.isArray(data)){
//                     setAllCategories(data)
//                 }
//                 else {
//                     console.error(data)
//                 }
//         })
//             .catch(e => console.error(e))
            
        
//     }, [])

//     function addNewCategory(newCategory) {
//         console.log("Adding new category:", newCategory)
//         setCategories(prevCat => {
//             if (!prevCat.some(cat => cat.id === newCategory.id)) {
//                 return [...prevCat, newCategory]
//             } else {
//                 return prevCat
//             }
//         })
//     }
//     function addNewCategoryToDb(newCategory) {
        

//         if (!newCategory) {
//             console.error("Error: newCategory is undefined")
//             return
//         }
//         setAllCategories(prevcat => {
//             if (!prevcat.some(cat => cat.id === newCategory.id)) {
//                 console.log("Adding category to dropdown:", newCategory)
//                 return [...prevcat, newCategory]
//             } else {
//                 return prevcat
//             }
//         }
//         )
//     }

//     return (
//         <AppContext.Provider value={{ user, setUser, plants, setPlants, categories, setCategories, selectedCategoryId, setSelectedCategoryId, allCategories, addNewCategory, addNewCategoryToDb }}>
//             {children}
//         </AppContext.Provider>
//     )
// }

// export default AppContext
