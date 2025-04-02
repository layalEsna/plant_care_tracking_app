
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useContext } from "react"
import AppContext from "./AppContext"

const PlantForm = () => {
    const { allCategories, addNewCategory, user} = useContext(AppContext)
    


    
    const formik = useFormik(
        {
            initialValues: {
                plant_name: '',
                image: '',
                created_at: '',
                category_id: ''
            },
            
            validationSchema: Yup.object({
                plant_name: Yup.string()
                    .min(2, 'Plant name must be between 2 and 100 characters.')
                    .max(100, 'Plant name must be between 2 and 100 characters.')
                    .required('Plant name field is required.'),
                image: Yup.string(),
                    
                created_at: Yup.date()
                    .required('created_at field is required')
                    .typeError('Invalid date format'),
                category_id: Yup.number()
                    .required('Category ID is required.')
                    .positive('Category must be a valid number.')
                    .integer('Category must be an integer.')


            }),
            onSubmit: (values) => {
                
                fetch('/new_plant', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({...values,user_id: user.user.id, category_id: Number(values.category_id)})
                })
                    .then(res => {
                        
                        if (!res.ok) {
                            throw new Error('failed to fetch data.')
                        }
                        return res.json()
                    })
                    .then(data => {
                        
                        if (data.category) {
                            
                            addNewCategory(data.category)
                        }

                    })
                    .catch(e => console.error(e))
            }
        }
    )
    
    

    
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="plant_name">Plant Name:</label>
                    <input
                        name="plant_name"
                        id="plant_name"
                        type="text"
                        value={formik.values.plant_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.plant_name && formik.touched.plant_name && (
                        <div className="error">{formik.errors.plant_name}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input
                        name="image"
                        id="image"
                        type="text"
                        value={formik.values.image}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.image && formik.touched.image && (
                        <div className="error">{formik.errors.image}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="created_at">Created at:</label>
                    <input
                        name="created_at"
                        id="created_at"
                        type="date"
                        value={formik.values.created_at}
                        onChange={formik.handleChange}
                        
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.created_at && formik.touched.created_at && (
                        <div className="error">{formik.errors.created_at}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="category_id">Categories:</label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formik.values.category_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value=''>Select one</option>
                        {allCategories && allCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.category_name}
                            </option>
                        ))}

                    </select>
                    {formik.errors.category && formik.touched.category && (
                        <div>{formik.errors.category}</div>
                    )}
                </div>
                <div>
                    <button type="submit">Add Plant</button>
                </div>

            </form>

            
            


        </div>
    )
    

}

export default PlantForm