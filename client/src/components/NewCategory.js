
import { useFormik } from "formik";
import * as Yup from 'yup'
import { useContext } from "react";
import AppContext from "./AppContext";

const NewCategory = () => {
    const { addNewCategoryToDb } = useContext(AppContext)

    const { values, handleBlur, handleChange, handleSubmit, touched, errors, resetForm } = useFormik({
        initialValues: {
            category_name: ''
        },
        validationSchema: Yup.object({
            category_name: Yup.string()
                .required('Category name is requierd.')
                .min(5, 'Category name must be between 5 and 100 characters.')

                .max(100, 'Category name must be between 5 and 100 characters.')
        }),
        onSubmit: (values) => {
            fetch('/new_category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    console.log("Response status:", res.status)
                    if (!res.ok) {
                        throw new Error('failed to fetch data.')
                    }
                    return res.json()
                })
                .then(data => {
                 
                    addNewCategoryToDb(data)
                    
                    resetForm()
                })
                .catch(e => console.error(e))
        }
    })

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="category_name">Add New Category</label>
                <input
                    id="category_name"
                    name="category_name"
                    value={values.category_name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                
                />

            </div>
            {errors.category_name && touched.category_name && (
                <div className="error">{errors.category_name}</div>
            )}
            <button type="submit">
                Add A New Category
            </button>
        </form>
    )
}

export default NewCategory








// import { useFormik } from "formik";
// import * as Yup from 'yup'
// import { useContext } from "react";
// import AppContext from "./AppContext";

// const NewCategory = () => {
//     const { addNewCategoryToDb } = useContext(AppContext)

//     const { values, handleBlur, handleChange, handleSubmit, touched, errors, resetForm } = useFormik({
//         initialValues: {
//             category_name: ''
//         },
//         validationSchema: Yup.object({
//             category_name: Yup.string()
//                 .required('Category name is requierd.')
//                 .min(5, 'Category name must be between 5 and 100 characters.')

//                 .max(100, 'Category name must be between 5 and 100 characters.')
//         }),
//         onSubmit: (values) => {
//             fetch('/new_category', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(values)
//             })
//                 .then(res => {
//                     console.log("Response status:", res.status)
//                     if (!res.ok) {
//                         throw new Error('failed to fetch data.')
//                     }
//                     return res.json()
//                 })
//                 .then(data => {
                 
//                     addNewCategoryToDb(data)
                    
//                     resetForm()
//                 })
//                 .catch(e => console.error(e))
//         }
//     })

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label htmlFor="category_name">Add New Category</label>
//                 <input
//                     id="category_name"
//                     name="category_name"
//                     value={values.category_name}
//                     onBlur={handleBlur}
//                     onChange={handleChange}
                
//                 />

//             </div>
//             {errors.category_name && touched.category_name && (
//                 <div className="error">{errors.category_name}</div>
//             )}
//             <button type="submit">
//                 Add A New Category
//             </button>
//         </form>
//     )
// }

// export default NewCategory