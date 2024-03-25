import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const ProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Item added successfully");
    } catch (error) {
      toast.error("Items Added Successfully");
      setImage(res.image);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const { data } = await updateProduct({productId: params._id, formData});

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success();
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product Update failed. Try Again.");
    }
  };

  // const uploadFileHandler = async (e) => {
  //   const formData = new FormData();
  //   formData.append("image", e.target.files[0]);
  //   try {
  //     const res = await uploadProductImage(formData).unwrap();
  //     toast.success("Item added successfully");
  //     setImage(res.image);
  //   } catch (err) {
  //     toast.success("Item added successfully");
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const formData = new FormData();
  //     formData.append("image", image);
  //     formData.append("name", name);
  //     formData.append("description", description);
  //     formData.append("price", price);
  //     formData.append("category", category);
  //     formData.append("quantity", quantity);
  //     formData.append("brand", brand);
  //     formData.append("countInStock", stock);

  //     // Update product using the RTK Query mutation
  //     const { data } = await updateProduct({ productId: params._id, formData });

  //     if (data?.error) {
  //       toast.error(data.error);
  //     } else {
  //       toast.success(`Product successfully updated`);
  //       navigate("/admin/allproductslist");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Product update failed. Try again.");
  //   }
  // };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`);
      navigate("/admin/allproductslist");
    } catch (error) {
      console.log(error);
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col mr-[16rem]">
        <AdminMenu />
        <div className="md:w-3/4 p-3">Create Product</div>

        {image && (
          <div className="text-center">
            <img
              src={image}
              alt="product"
              className="block mx-auto max-h-[200px]"
            />
          </div>
        )}

        <div className="mb-3  bg-[#101011] ">
          <label className="border border-stone-500	 text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11   ">
            {image ? image.name : "Upload Image"}

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className={!image ? "hidden" : "text-white"}
            />
          </label>
        </div>
        <div className="p-3">
          <div className="flex flex-wrap">
            <div className="one ">
              <label htmlFor="name">Name</label> <br />
              <input
                type="text"
                id="name"
                className="p-4 mt-1 mb-3 w-[30rem] border border-stone-500 rounded-lg bg-[#101011] text-white "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="two ml-10">
              <label htmlFor="price">Price</label> <br />
              <input
                id="price"
                type="number"
                className="p-4  mt-1 mb-3 w-[30rem] border border-stone-500 rounded-lg bg-[#101011] text-white "
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="one">
              <label htmlFor="quantity">Quantity</label> <br />
              <input
                type="number"
                id="quantity"
                className="p-4  mt-1 mb-3 w-[30rem] border border-stone-500 rounded-lg bg-[#101011] text-white "
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="two ml-10">
              <label htmlFor="brand">Brand</label> <br />
              <input
                type="text"
                id="brand"
                className="p-4  mt-1 mb-3 w-[30rem] border border-stone-500 rounded-lg bg-[#101011] text-white "
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <label htmlFor="desc" className="my-5">
            {" "}
            Description
          </label>
          <textarea
            id="desc"
            className="p-2  mt-1 mb-3 bg-[#101011] border border-stone-500 rounded-lg w-[100%] text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className="flex justify-between">
            <div>
              <label htmlFor="stock"> Count In Stock</label> <br />
              <input
                type="text"
                id="stock"
                className="p-4  mt-1 mb-3 w-[30rem] border border-stone-500 rounded-lg bg-[#101011] text-white"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cat">Category</label>
              <br />
              <select
                id="cat"
                placeholder="Choose category"
                className="p-4  mt-1 mb-3 w-[30rem] border border-stone-500 rounded-lg bg-[#101011] text-white"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button
              onClick={handleUpdate}
              className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 mr-6"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
