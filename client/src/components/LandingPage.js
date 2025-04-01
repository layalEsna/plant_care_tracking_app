// import { useContext } from "react"
// import AppContext from "./AppContext"
// const LandingPage = () => {
    


//     const { user } = useContext(AppContext)



//     if (!user) {
//         return <div>Loading ...</div>

       
//     }

//     const uniqueCategories = user.plants ?
//         [...new Set(user.plants.map(plant => plant.category.category_name))] : []
    
    
//     return (
//         <div>
//             <h4>Welcome: {user.username}</h4>
//             {user.plants && user.plants.length ? (
//                 <div>
//                     <h5>My Categories:</h5>
//                     <div>

//                         {uniqueCategories.length ? (
//                             <div>  
//                                 <h5>My Categories:</h5>

//                                 <div>
//                                     {uniqueCategories.map(cat_name => (
//                                         <div key={cat_name.id}>{cat_name.category_name}</div>
//                                     ))}
//                                 </div>
//                         </div>

//                         ): <div>No categories found</div>
//                         }

//                         {/* {user.plants && user.plants.length ? (
//                             user.plants.map((plant) => (
//                                 <div key={plant.id}>
//                                     <a href={`/categories/${plant.category.id}`}>{plant.category.category_name}</a>
//                                 </div>
//                             ))
//                         ) : (
//                             <div>No categories found</div>
//                         )} */}

//                     </div>
//                 </div>
//             ) : (
//                 <div>No categories found</div>
//             )}


//         </div>
//     )
// }

// export default LandingPage


import { useContext } from "react";
import AppContext from "./AppContext";

const LandingPage = () => {
    const { user } = useContext(AppContext);

    if (!user) {
        return <div>Loading ...</div>;
    }

    // Extract unique category names
    const uniqueCategories = user.plants
        ? [...new Map(user.plants.map(plant => [plant.category.id, plant.category])).values()]
        : []

    return (
        <div>
            <h4>Welcome: {user.username}</h4>

            {user.plants && user.plants.length ? (
                <div>
                    <h5>My Categories:</h5>
                    <div>
                        {uniqueCategories.length ? (
                            <div>
                                {uniqueCategories.map((category) => (
                                    <div key={category.id}>
                                        <a href={`categories/${category.id}`}>🌱 {category.category_name}</a>
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
        </div>
    );
};

export default LandingPage
