import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useParams, useNavigate } from "react-router-dom";

type CategoryType = {
  _id: string;
  title: string;
};

type SubCategoryType = {
  _id: string;
  title: string;
};

type BrandType = {
  _id: string;
  title: string;
};

type FormType = {

  title: string;
  slug: string;
  price: string;
  discountPrice: string;
  color: string;
  fabric: string;
  sizes: string[];
  description: string;
  categoryId: string;
  subCategoryId: string;
  brandId: string;
};

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AddProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormType>({
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

  const [image, setImage] = useState<File | null>(null);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  // ================= FETCH =================
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchBrands();
  }, []);



  const fetchCategories = async () => {
    const res = await axios.get(`${BASE_URL}/category`);
    setCategories(res.data.data);
  };

  const fetchSubCategories = async () => {
    const res = await axios.get(`${BASE_URL}/subcategory`);
    setSubCategories(res.data.data);
  };

  const fetchBrands = async () => {
    const res = await axios.get(`${BASE_URL}/brands`);
    setBrands(res.data.data);
  };


  // ================= HANDLE =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSize = (size: string) => {
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

      (Object.keys(form) as (keyof FormType)[]).forEach((key) => {
        if (key === "sizes") {
          fd.append("sizes", JSON.stringify(form.sizes));
        } else {
          fd.append(key, form[key] as string);
        }
      });

      if (image) fd.append("image", image);

      // 🔥 MAIN CHANGE
      if (id) {
        // UPDATE
        await axios.put(
          `${BASE_URL}/products/${id}`,
          fd
        );
        alert("Product Updated ✅");
      } else {
        // CREATE
        await axios.post(
          `${BASE_URL}/products`,
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
      const res = await axios.get(`${BASE_URL}/products/${id}`);
      console.log("API RESPONSE:", res.data);

      const data = res.data?.product;

      if (!data) {
        console.error("No product data found");
        return;
      }

      setForm({
        title: data.title || "",
        slug: data.slug || "",
        price: String(data.price || ""),
        discountPrice: String(data.discountPrice || ""),
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
    <div className="p-6 space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold">Add/Edit New Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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
                  {categories.map((c: CategoryType) => (
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
                  {subCategories.map((s: SubCategoryType) => (
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
                  {brands.map((b: BrandType) => (
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
            {/* <div>
              <Label >Product Image</Label>
              <Input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                  }
                }}
              />
            </div> */}
            <div>
              <Input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setImage(file);

                    // create preview
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-md mt-2 border"
                />
              )}
            </div>


            {/* SUBMIT */}
            <Button
              onClick={handleSubmit}
              className="mt-6 px-6 py-2 rounded-xl"
            >
              {id ? "Update Product" : "Add Product"}
            </Button>

          </CardContent>
        </Card>

        {/* RIGHT */}
        {/* <Card>
          <CardContent className="pt-6">

          </CardContent>
        </Card> */}

      </div>


    </div>
  );
}