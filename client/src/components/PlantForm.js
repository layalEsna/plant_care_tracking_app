
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useContext } from "react"
import AppContext from "./AppContext"

const PlantForm = () => {
    const { allCategories, addNewCategory, user, addNewCategoryToDb } = useContext(AppContext)




    const formik = useFormik(
        {
            initialValues: {
                plant_name: '',
                image: '',
                created_at: '',
                category_id: '',
                new_cat: ''
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
                    .test(
                        "category-or-new",
                        "You must select a category or add a new one.",
                        function (value) {
                            return value || this.parent.new_cat; // Valid if either category_id or new_cat is provided
                        }
                    )

                    .required('Category ID is required.')
                    .positive('Category must be a valid number.')
                    .integer('Category must be an integer.')


                


            }),
            onSubmit: (values) => {
                console.log("Submitting form with values:", values)
                let requestBody = {
                    plant_name: values.plant_name,
                    image: values.image,
                    created_at: values.created_at,
                    user_id: user.user.id
                }

                if (values.new_cat) {
                    requestBody.new_category_name = values.new_cat;  // Send new category
                } else {
                    requestBody.category_id = Number(values.category_id);
                }
                console.log("Sending request with body:", requestBody)

                fetch('/new_plant', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(requestBody)

                    // body: JSON.stringify({ ...values, user_id: user.user.id, category_id: Number(values.category_id) })
                })
                    .then(res => {

                        if (!res.ok) {
                            throw new Error('failed to fetch data.')
                        }
                        return res.json()
                    })
                    .then(data => {
                        console.log("API response:", data)
                        if (data.category) {
                            console.log("New Category Added:", data.category)

                            addNewCategory(data.category)
                            addNewCategoryToDb(data.category)
                        }

                        if (data.plant) {
                            console.log("New Plant Added:", data.plant);
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
                {/* new */}

                <div>
                    <label htmlFor="category_id">Categories</label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formik.values.category_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={formik.values.new_cat.trim().length > 0}

                        // disabled={!!formik.values.new_cat}


                    >
                        <option value=''>select one</option>
                        {allCategories && allCategories.length && (
                            allCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                            ))
                        )



                        }
                    </select>
                    <div>
                        <label htmlFor="new_cat">Add New Category</label>
                        <input
                            id="new_cat"
                            name="new_cat"
                            value={formik.values.new_cat}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            disabled={formik.values.category_id !== ''}

                            // disabled={formik.values.new_cat.trim().length > 0}


                            // disabled={!!formik.values.category_id}

                        />

                    </div>
                </div>



                {/* new */}




                {/* <div>
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
                        <option value='other'>other
                           
                        </option>

                    </select>
                    {formik.errors.category && formik.touched.category && (
                        <div>{formik.errors.category}</div>
                    )}
                </div> */}



                <div>
                    <button type="submit">Add Plant</button>
                </div>

            </form>





        </div>
    )


}

export default PlantForm