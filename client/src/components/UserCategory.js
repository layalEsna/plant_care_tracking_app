
/////////////////////////
import { useContext } from "react";
import AppContext from "./AppContext";


const UserCategory = () => {
    const { user, selectedCategoryName, plants } = useContext(AppContext);
  
    if (!user || !user.username) {
      return <p>Loading...</p>;
    }
  
    if (!selectedCategoryName) {
      return <p>No category selected.</p>;
    }
  
    const categoryName = selectedCategoryName;
  
    const filteredPlants = plants.filter(
      (plant) => plant.category.category_name === categoryName
    );
  
    return (
      <div>
        <h4>{user.username}</h4>
        <p>Category: {categoryName}</p>
  
        {filteredPlants.length > 0 ? (
          <div>
            {filteredPlants.map((plant) => (
              <div key={plant.id}>{plant.plant_name}</div>
            ))}
          </div>
        ) : (
          <p>No plants available in this category.</p>
        )}
      </div>
    );
  };
  
export default UserCategory





// import { useContext } from "react";
// import AppContext from "./AppContext";


// const UserCategory = () => {
//   const { user, plants, categories, selectedCategoryId } = useContext(AppContext)


    
//     if (!user || !user.user) {
//         return <p>Loading...</p>
//       }
  

  
// //   if (!selectedCategoryId) {
// //     return <p>No category selected.</p>
// //   }

  
//   const category = categories.find(cat => cat.id === selectedCategoryId)
//   const categoryName = category ? category.category_name : "Unknown Category"

  
//   const filteredPlants = plants.filter(plant => plant.category.id === selectedCategoryId)

//   return (
//     <div>
//           <h4>{user.user.username}</h4>
          

//       <p>{categoryName}</p>

//       {filteredPlants.length > 0 ? (
//         <div>
//           {filteredPlants.map((plant) => (
//             <div key={plant.id}>{plant.plant_name}</div>
//           ))}
//         </div>
//       ) : (
//         <p>No plants available in this category.</p>
//           )}

          
//     </div>
//   )
// }

// export default UserCategory
