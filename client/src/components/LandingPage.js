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
                        {categories.map((cat) => (
                            <div key={cat.id}>
                                <h4>{cat.category_name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                    <div>No categories found</div>
            )}


        </div>
    )
}

export default LandingPage


