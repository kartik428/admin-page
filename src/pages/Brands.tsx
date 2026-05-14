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

type BrandType = {
  _id: string;
  title: string;
  banner?: string;
  totalProducts?: number;
};
const BASE_URL = import.meta.env.VITE_API_URL;

export default function Brands() {
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [banner, setBanner] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const handleSubmit = async () => {
    try {
      if (!title) {
        alert("Title is required");
        return;
      }

      const form = new FormData();
      form.append("title", title);

      if (banner) {
        form.append("banner", banner);
      }

      let res;

      if (editId) {
        // 🔥 UPDATE
        res = await axios.put(
          `${BASE_URL}/brands/${editId}`,
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
          `${BASE_URL}/brands`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log(res.data);

      await fetchBrands();

      // reset
      setEditId(null);
      setTitle("");
      setBanner(null);

    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/brands/${id}`);
      await fetchBrands();
    } catch (error) {
      console.error(error);

    }
  }
  const handleEdit = (brand: BrandType) => {
    setEditId(brand._id);
    setTitle(brand.title);
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`https://ecombackend-mbpg.onrender.com/api/brands`);
      setBrands(res.data.data);
      setTotal(res.data.total || res.data.data.length);
      console.log(res.data.data);
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {

    fetchBrands();
  }, []);

  const filtered = brands.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="p-6 space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold">Manage Brands</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= LEFT FORM ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Add / Edit Brand</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">

            {/* Brand Name */}
            <div>
              <label className="text-sm font-medium">Brand Title</label>
              <Input name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter brand name" />
            </div>

            {/* Logo */}
            <div>
              <label className="text-sm font-medium">Brand Logo</label>
              <Input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setBanner(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* Button */}
            <Button className="w-full" onClick={handleSubmit}>
              {editId ? "Update Brand" : "Add Brand"}
            </Button>

          </CardContent>
        </Card>

        {/* ================= RIGHT TABLE ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Listed Brands</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">

            {/* Search */}
            <div className="flex justify-end">
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
                  <TableHead>S.No</TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Total Products</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((brand: BrandType, index: number) => (
                  <TableRow key={brand._id}>

                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <img
                        src={brand.banner ? `https://beritrave.tech/${brand.banner}` : "/placeholder.png"}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                    </TableCell>

                    <TableCell className="font-medium">
                      {brand.title}
                    </TableCell>

                    <TableCell>{brand.totalProducts}</TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(brand)}
                      >
                        <Pencil />
                      </Button>

                      <Button onClick={() => handleDelete(brand._id)} size="sm" variant="destructive">
                        <Trash />
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-400">
                      No brands found
                    </TableCell>
                  </TableRow>
                )}
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