// ///////////////////////////////

import { useContext } from "react"
import AppContext from "./AppContext"
import { Link } from "react-router-dom"
import PlantForm from "./PlantForm"
// fetch categories
const LandingPage = () => {
    const { user, setSelectedCategoryName, categories } = useContext(AppContext)

    if (!user || !user.username) { 
        return <div>Loading ...</div>
    }
    
    const uniqueCategories = categories ? [...new Set(categories)] : []


    const handleCategoryClick = (categoryName) => {
        setSelectedCategoryName(categoryName)
        localStorage.setItem('selectedCategoryName', categoryName)
        console.log("Category Clicked:", categoryName)
    }

    return (
        <div>
            <h3>My Categories</h3>
            {user.username && <h4>Welcome: {user.username}</h4>}

            {user.plants && user.plants.length ? (
                <div>
                    <h5>My Categories:</h5>
                    <div>
                        {uniqueCategories.length ? (
                            <div>
                                {uniqueCategories.map((category) => (
                                    <div key={category}>
                                        
                                        <Link to={`/users/categories/${category}`} onClick={() => handleCategoryClick(category)}>
                                        
                                            🌱 {category}
                                            
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>No categories found</div>
                        )}
                    </div>
                </div>
            ) : (
                <div>No categories found</div>
            )}
        

            <div>
                <h5>Add A Plant</h5>
          <PlantForm/>
          </div>
        </div>
    )
}

export default LandingPage








// import { useContext } from "react"
// import AppContext from "./AppContext"
// import { Link } from "react-router-dom"
// import PlantForm from "./PlantForm"
// // fetch categories
// const LandingPage = () => {
//     const { user, setSelectedCategoryId } = useContext(AppContext)

//     if (!user || !user.user) { 
//         return <div>Loading ...</div>
//     }

//     const uniqueCategories = user.plants
//         ? [...new Map(user.plants.map(plant => [plant.category.id, plant.category])).values()]
//         : []

//     const handleCategoryClick = (categoryId) => {
//         setSelectedCategoryId(categoryId)
//         localStorage.setItem('selectedCategoryId', categoryId)
//         console.log("Category Clicked:", categoryId)
//     }

//     return (
//         <div>
//             <h3>My Categories</h3>
//             {user.user.username && <h4>Welcome: {user.user.username}</h4>}

//             {user.plants && user.plants.length ? (
//                 <div>
//                     <h5>My Categories:</h5>
//                     <div>
//                         {uniqueCategories.length ? (
//                             <div>
//                                 {uniqueCategories.map((category) => (
//                                     <div key={category.id}>
//                                         <Link to={`/users/categories/${category.id}`} onClick={() => handleCategoryClick(category.id)}>
//                                             🌱 {category.category_name}
//                                         </Link>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div>No categories found</div>
//                         )}
//                     </div>
//                 </div>
//             ) : (
//                 <div>No categories found</div>
//             )}

//             <div>
//                 <h5>Add A Plant</h5>
//           <PlantForm/>
//           </div>
//         </div>
//     )
// }

// export default LandingPage