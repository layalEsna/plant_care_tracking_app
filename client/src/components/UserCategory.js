


import { useContext } from "react";
import AppContext from "./AppContext";
import PlantForm from "./PlantForm";

const UserCategory = () => {
  const { user, plants, categories, selectedCategoryId } = useContext(AppContext)

  if (!user) {
    return <p>Loading...</p>
  }
  console.log("Selected Category ID:", selectedCategoryId)

  
  if (!selectedCategoryId) {
    return <p>No category selected.</p>
  }

  
  const category = categories.find(cat => cat.id === selectedCategoryId)
  const categoryName = category ? category.category_name : "Unknown Category"

  
  const filteredPlants = plants.filter(plant => plant.category.id === selectedCategoryId)

  return (
    <div>
      <h4>{user.username}</h4>
      <p>{categoryName}</p>

      {filteredPlants.length > 0 ? (
        <div>
          {filteredPlants.map((plant) => (
            <div key={plant.id}>{plant.plant_name}</div>
          ))}
        </div>
      ) : (
        <p>No plants available in this category.</p>
          )}
          {/* <div>
          <PlantForm/>
          </div> */}
          
    </div>
  )
}

export default UserCategory

