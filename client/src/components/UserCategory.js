
// // import { useContext } from "react"
// // import AppContext from "./AppContext"


// // const UserCategory = () => {
// //     const { user, plants, selectedCategoryId } = useContext(AppContext)
    
// //     if (!user) {
// //         return <p>Loading...</p>
// //     }
// //     const filteredPlants = plants.filter(plant => plant.category.id === selectedCategoryId)
// //     const categoryName = filteredPlants.length > 0 ? filteredPlants[0].category.category_name : 'No plant in this category'
// //     return (
// //         <div>
// //             <h4>{user.username}</h4>
// //             <p>{categoryName}</p>
// //             {/* {plants.length && plants.length > 0(
// //                 plants.map(plant => (
// //                     <div key={plant.id}>{plant.plant_name}</div>
// //                 ))
// //             )} */}

// //         </div>
// //     )
// // }

// // export default UserCategory


// import { useContext } from "react";
// import AppContext from "./AppContext";

// const UserCategory = () => {
//   const { user, plants, selectedCategoryId } = useContext(AppContext);
  
//   if (!user) {
//     return <p>Loading...</p>;
//   }

//   // Filter plants based on the selected category ID from context
//   const filteredPlants = plants.filter(plant => plant.category.id === selectedCategoryId);

//   const categoryName = filteredPlants.length > 0 ? filteredPlants[0].category.category_name : "No plants in this category";

//   return (
//     <div>
//       <h4>{user.username}</h4>
//       <p>{categoryName}</p>

//       {filteredPlants.length > 0 ? (
//         <div>
//           {filteredPlants.map(plant => (
//             <div key={plant.id}>{plant.plant_name}</div>
//           ))}
//         </div>
//       ) : (
//         <p>No plants available in this category.</p>
//       )}
//     </div>
//   );
// };

// export default UserCategory;

import { useContext } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import AppContext from "./AppContext";

const UserCategory = () => {
  const { user, plants } = useContext(AppContext);
  const { categoryId } = useParams(); // Get categoryId from URL params
  
  if (!user) {
    return <p>Loading...</p>;
  }

  // Filter plants based on the selected category ID from URL
  const filteredPlants = plants.filter(plant => plant.category.id === parseInt(categoryId)); // Compare with categoryId

  const categoryName = filteredPlants.length > 0 ? filteredPlants[0].category.category_name : "No plants in this category";

  return (
    <div>
      <h4>{user.username}</h4>
      <p>{categoryName}</p>

      {filteredPlants.length > 0 ? (
        <div>
          {filteredPlants.map(plant => (
            <div key={plant.id}>{plant.plant_name}</div>
          ))}
        </div>
      ) : (
        <p>No plants available in this category.</p>
      )}
    </div>
  );
};

export default UserCategory;
