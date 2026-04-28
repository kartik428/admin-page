import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge, Pencil, Trash } from "lucide-react";
import axios from 'axios'

export default function SubCategory() {

  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  // const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    url: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
  });
  const limit = 10;


  const handleEdit = (item) => {
    setEditId(item._id);

    setFormData({
      categoryId: item.categoryId || "",
      title: item.title || "",
      url: item.slug || "",
      metaTitle: item.metaTitle || "",
      metaKeywords: item.metaKeywords?.join(",") || "",
      metaDescription: item.metaDescription || "",
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category");

      console.log(res.data.data);

      setCategories(res.data.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchSubCategory = async () => {
    try {
      const res = await axios(
        `http://localhost:5000/api/subcategory?page=${page}&limit=${limit}&search=${search}`
      );

      console.log(res.data);
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchSubCategory();
  }, [page, search]);

  const handleSubmit = async () => {
    try {
      const form = new FormData();

      form.append("categoryId", formData.categoryId);
      form.append("title", formData.title);
      form.append("url", formData.url);
      form.append("metaTitle", formData.metaTitle);
      form.append(
        "metaKeywords",
        JSON.stringify(formData.metaKeywords.split(","))
      );
      form.append("metaDescription", formData.metaDescription);

      if (image) {
        form.append("image", image);
      }

      let res;

      if (editId) {
        // 🔥 UPDATE
        res = await axios.put(
          `http://localhost:5000/api/subcategory/${editId}`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // 🔥 CREATE
        res = await axios.post(
          "http://localhost:5000/api/subcategory",
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log(res.data);

      // 🔥 refresh table
      await fetchSubCategory();

      // 🔥 reset form
      setEditId(null);
      setFormData({
        categoryId: "",
        title: "",
        url: "",
        metaTitle: "",
        metaKeywords: "",
        metaDescription: "",
      });
      setImage(null);

    } catch (err) {
      console.error(err);
    }
  };
  const filtered = data.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/subcategory/${id}`);

      // refresh data
      await fetchSubCategory();

    } catch (error) {
      console.error(error);
    }
  };
  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/subcategory/${id}/status`);

      // refresh data
      await fetchSubCategory();

    } catch (error) {
      console.error(error);
    }
  };
  const handleToggleTrend = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/subcategory/${id}/trend`);

      await fetchSubCategory(); // refresh UI

    } catch (error) {
      console.error(error);
    }
  };
  const totalPages = Math.ceil(total / limit);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Manage Sub Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <Card>
          <CardHeader className="text-black rounded-t-lg">
            <CardTitle>Add / Edit Sub Category</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">

            {/* Parent Category */}
            <div>
              <label className="text-sm font-medium">Choose Main Category</label>
              {/* <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm"
              >
                <option value="">Select Category</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
              </select> */}
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm"
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat.title}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Sub Category Title</label>
              <Input name="title" value={formData.title} onChange={handleChange} placeholder="Enter sub category" />
            </div>

            <div>
              <label className="text-sm font-medium">Slug / URL</label>
              <Input name="url" value={formData.url} onChange={handleChange} placeholder="slug-url" />
            </div>

            <div>
              <label className="text-sm font-medium">Meta Title</label>
              <Input name="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="Meta Title" />
            </div>

            <div>
              <label className="text-sm font-medium">Meta Keywords</label>
              <Input name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} placeholder="Meta Keywords" />
            </div>

            <div>
              <label className="text-sm font-medium">Meta Description</label>
              <textarea name="metaDescription" value={formData.metaDescription} className="w-full border rounded-md p-2 text-sm" rows={4} onChange={handleChange} placeholder="Meta Description" />
            </div>

            <div>
              <label className="text-sm font-medium">Image</label>
              <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              {editId ? "Update Sub Category" : "Add Sub Category"}
            </Button>

          </CardContent>
        </Card>

        {/* ================= TABLE ================= */}
        <Card>
          <CardHeader className=" text-black rounded-t-lg">
            <CardTitle>Listed Sub Categories</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">

            {/* Controls */}
            <div className="flex justify-between">
              <select className="border rounded px-2 py-1 text-sm">
                <option>10</option>
              </select>

              <Input
                placeholder="Search..."
                className="w-40"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sort</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title / Category</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item._id}>

                    {/* Sort */}
                    <TableCell>
                      <Input value={item.sortOrder || 0} className="w-14" />
                    </TableCell>

                    {/* Image */}
                    <TableCell>
                      <img
                        src={`http://localhost:5000/${item.image}`}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </TableCell>

                    {/* Title + Category */}
                    <TableCell>
                      <p className="font-medium">{item.title}</p>

                      <span className="bg-green-500 mt-1 px-2 rounded-xl ">
                        {item.categoryId || "No Category"}
                      </span>

                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={!!item.inTrend}
                          onChange={() => handleToggleTrend(item._id)}
                        />In trend
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="flex gap-2">
                      <Button onClick={() => handleToggleStatus(item._id)} size="sm" variant="outline">
                        {item.status === "active" ? "Disable" : "Enable"}
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(item)}

                      >
                        <Pencil />
                      </Button>

                      <Button onClick={() => handleDelete(item._id)} size="sm" variant="destructive">
                        <Trash />
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-end gap-2">

              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>

              <Button size="sm">
                {page}
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>

            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}