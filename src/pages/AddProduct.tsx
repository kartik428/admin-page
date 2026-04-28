import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useParams, useNavigate } from "react-router-dom";

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    discountPrice: "",
    color: "",
    fabric: "",
    sizes: [],
    description: "",
    categoryId: "",
    subCategoryId: "",
    brandId: "",
  });

  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchBrands();
  }, []);



  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/category");
    setCategories(res.data.data);
  };

  const fetchSubCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/subcategory");
    setSubCategories(res.data.data);
  };

  const fetchBrands = async () => {
    const res = await axios.get("http://localhost:5000/api/brands");
    setBrands(res.data.data);
  };
  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    console.log(res.data.data);
  };

  // ================= HANDLE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.title.trim()) return alert("Product name is required");

      if (!form.categoryId) return alert("Category is required");

      if (!form.subCategoryId) return alert("SubCategory is required");

      if (!form.brandId) return alert("Brand is required");

      if (!form.price) return alert("Price is required");

      if (Number(form.price) <= 0) return alert("Price must be greater than 0");

      if (form.discountPrice && Number(form.discountPrice) >= Number(form.price)) {
        return alert("Discount price must be less than price");
      }

      if (!form.sizes.length) return alert("Select at least one size");

      if (!image) return alert("Product image is required");
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "sizes") {
          fd.append("sizes", JSON.stringify(form.sizes));
        } else {
          fd.append(key, form[key]);
        }
      });

      if (image) fd.append("image", image);

      // 🔥 MAIN CHANGE
      if (id) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/products/${id}`,
          fd
        );
        alert("Product Updated ✅");
      } else {
        // CREATE
        await axios.post(
          "http://localhost:5000/api/products",
          fd
        );
        alert("Product Added ✅");
      }

      navigate("/allprod");

      setForm({
        title: "",
        slug: "",
        price: "",
        discountPrice: "",
        color: "",
        fabric: "",
        sizes: [],
        description: "",
        categoryId: "",
        subCategoryId: "",
        brandId: "",
      });

      setImage(null);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id && categories.length && subCategories.length && brands.length) {
      fetchSingleProduct();
    }
  }, [id, categories, subCategories, brands]);
  
  const fetchSingleProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      console.log("API RESPONSE:", res.data);

      const data = res.data?.product;

      if (!data) {
        console.error("No product data found");
        return;
      }

      setForm({
        title: data.title || "",
        slug: data.slug || "",
        price: data.price || "",
        discountPrice: data.discountPrice || "",
        color: data.color || "",
        fabric: data.fabric || "",
        sizes: data.sizes || [],
        description: data.description || "",
        categoryId: data.categoryId?._id || data.categoryId || "",
        subCategoryId: data.subCategoryId?._id || data.subCategoryId || "",
        brandId: data.brandId?._id || data.brandId || "",
      });

    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add/Edit New Product</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT */}
        <Card>
          <CardHeader>
            <CardTitle>Add/Edit Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">

            {/* CATEGORY */}
            <div>
              <Label >Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(val) => setForm({ ...form, categoryId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SUBCATEGORY */}
            <div>
              <Label >Sub Category</Label>
              <Select
                value={form.subCategoryId}
                onValueChange={(val) => setForm({ ...form, subCategoryId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SubCategory" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* BRAND */}
            <div>
              <Label >Brand</Label>
              <Select
                value={form.brandId}
                onValueChange={(val) => setForm({ ...form, brandId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* NAME */}
            <div>
              <Label >Product Name</Label>
              <Input name="title" value={form.title} onChange={handleChange} placeholder="Enter Product Name" />
            </div>

            {/* SLUG */}
            <div>
              <Label >Slug</Label>
              <Input name="slug" value={form.slug} onChange={handleChange} placeholder="Enter Slug" />
            </div>

            {/* PRICE */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label >Price</Label>
                <Input name="price" value={form.price} onChange={handleChange} />
              </div>

              <div>
                <Label >Discount Price</Label>
                <Input name="discountPrice" value={form.discountPrice} onChange={handleChange} />
              </div>
            </div>

            {/* COLOR & FABRIC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label >Color</Label>
                <Input name="color" value={form.color} onChange={handleChange} />
              </div>

              <div>
                <Label >Fabric</Label>
                <Input name="fabric" value={form.fabric} onChange={handleChange} />
              </div>
            </div>

            {/* SIZES */}
            <div>
              <Label >Sizes</Label>
              <div className="flex gap-2 flex-wrap mt-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant={form.sizes.includes(size) ? "default" : "outline"}
                    onClick={() => handleSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label >Description</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={10}
                className="mt-2"
                placeholder="Enter the short description"
              />
            </div>

            {/* IMAGE */}
            <div>
              <Label >Product Image</Label>
              <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>

          </CardContent>
        </Card>

        {/* RIGHT */}
        <Card>
          <CardContent className="pt-6">

          </CardContent>
        </Card>

      </div>

      {/* SUBMIT */}
      <Button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 rounded-xl"
      >
        {id ? "Update Product" : "Add Product"}
      </Button>
    </div>
  );
}