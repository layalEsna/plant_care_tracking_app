import { useContext } from "react"
import AppContext from "./AppContext"
const LandingPage = () => {
    


    const { user, categories } = useContext(AppContext)



    if (!user) {
        return <div>Loading ...</div>
    }
    return (
        <div>
            <h4>Welcome: {user.username}</h4>
            {categories && categories.length ? (
                <div>
                    <h5>My Categories:</h5>
                    <div>

                        {user.plants && user.plants.length ? (
                            user.plants.map((plant) => (
                                <div key={plant.id}>
                                    <h4>{plant.category.category_name}</h4>
                                </div>
                            ))
                        ) : (
                            <div>No categories found</div>
                        )}

                    </div>
                </div>
            ) : (
                <div>No categories found</div>
            )}


        </div>
    )
}

export default LandingPage


