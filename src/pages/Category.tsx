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
import axios from "axios";
import { Pencil, Trash } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;




export default function Category() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // form state
  const [form, setForm] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
  });

  const [image, setImage] = useState(null);

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/category`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= FORM CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.title) return alert("Title required");

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("slug", form.slug);
      fd.append("metaTitle", form.metaTitle);
      fd.append("metaKeywords", form.metaKeywords);
      fd.append("metaDescription", form.metaDescription);

      if (image) {
        fd.append("image", image);
      }

      let res;

      if (editId) {
        // 🔥 UPDATE
        res = await axios.put(
          `${BASE_URL}/category/${editId}`,
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // 🔥 CREATE
        res = await axios.post(
          `${BASE_URL}/category`,
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log(res.data);

      await fetchCategories();

      // 🔥 reset
      setEditId(null);
      setForm({
        title: "",
        slug: "",
        metaTitle: "",
        metaKeywords: "",
        metaDescription: "",
      });
      setImage(null);

    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      title: item.title || "",
      slug: item.slug || "",
      metaTitle: item.metaTitle || "",
      metaKeywords: item.metaKeywords?.join(",") || "",
      metaDescription: item.metaDescription || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/category/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };
  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/category/${id}/status`);

      // refresh data
      await fetchCategories();

    } catch (error) {
      console.error(error);
    }
  };

  // ================= FILTER =================
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold">Main Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= LEFT FORM ================= */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Add / Edit Main Category</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">

            <div>
              <label className="text-sm font-medium">Main Category Title</label>
              <Input name="title" value={form.title} onChange={handleChange} placeholder="Enter Main category name" />
            </div>

            <div>
              <label className="text-sm font-medium">Slug / URL</label>
              <Input name="slug" value={form.slug} onChange={handleChange} placeholder="Maincategory-url" />
            </div>

            <div>
              <label className="text-sm font-medium">Meta Title</label>
              <Input name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="SEO title" />
            </div>

            <div>
              <label className="text-sm font-medium">Meta Keywords</label>
              <Input name="metaKeywords" value={form.metaKeywords} onChange={handleChange} placeholder="keyword1, keyword2" />
            </div>

            <div>
              <label className="text-sm font-medium">Meta Description</label>
              <textarea name="metaDescription"
                value={form.metaDescription} onChange={handleChange} className="w-full border rounded-md p-2 text-sm" rows={4} />
            </div>

            <div>
              <label className="text-sm font-medium">Main Category Image</label>
              <Input onChange={(e) => setImage(e.target.files[0])} type="file" />
            </div>

            <Button className="w-full" onClick={handleSubmit}>
              {editId ? "Update Category" : "Add Main Category"}
            </Button>
          </CardContent>
        </Card>

        {/* ================= RIGHT TABLE ================= */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Listed Main Categories</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">

            {/* Top Controls */}
            <div className="flex justify-between items-center">
              <select className="border rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item._id}>
                      {/* Sort */}
                      <TableCell>
                        <Input value={item.sortOrder || 0} className="w-14" />
                      </TableCell>

                      <TableCell>
                        <img
                          src={
                            item.image
                              ? `http://localhost:5000/${item.image}`
                              : "https://via.placeholder.com/50"
                          }
                          className="w-12 h-12 rounded-md"
                        />
                      </TableCell>

                      <TableCell>{item.title}</TableCell>

                      <TableCell className="flex gap-2">
                        <Button onClick={() => handleToggleStatus(item._id)} size="sm" variant="outline">
                          {item.status === "active" ? "Disable" : "Enable"}
                        </Button>

                        <Button size="sm" onClick={() => handleEdit(item)} variant="secondary">
                          <Pencil />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-400">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination (static for now) */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}