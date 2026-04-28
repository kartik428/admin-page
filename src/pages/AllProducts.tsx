import { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // ================= FETCH =================
    const getProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/products");
            setProducts(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            await getProducts();
        } catch (error) {
            console.error(error);
        }
    }
    const handleStatus = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/products/${id}/status`);
            await getProducts();
        } catch (error) {
            console.error(error);

        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    // ================= SEARCH =================
    const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Listed Products</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                    {/* SEARCH */}
                    <div className="flex justify-end">
                        <Input
                            placeholder="Search..."
                            className="w-60"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* TABLE */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>S.No</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filtered.map((item, index) => (
                                <TableRow key={item._id}>

                                    {/* SNO */}
                                    <TableCell>{index + 1}</TableCell>

                                    {/* IMAGE */}
                                    <TableCell>
                                        <img
                                            src={`http://localhost:5000/${item.image}`}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </TableCell>

                                    {/* PRODUCT */}
                                    <TableCell>
                                        <p className="font-medium">{item.title}</p>


                                    </TableCell>

                                    {/* CATEGORY */}
                                    <TableCell>
                                        {item.categoryId?.title} / {item.subCategoryId?.title}

                                        {/* COLOR */}
                                        <div className="flex gap-2 mt-1">
                                            {item.color && (
                                                <span className="bg-pink-500 text-white px-2 py-0.5 rounded text-xs">
                                                    {item.color}
                                                </span>
                                            )}
                                            {item.fabric && (
                                                <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs">
                                                    {item.fabric}
                                                </span>
                                            )}
                                        </div>

                                        {/* SIZES */}
                                        <div className="flex gap-1 mt-1">
                                            {item.sizes?.map((s, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-black text-white px-1.5 py-[2px] rounded text-[10px] leading-none"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>

                                    {/* PRICE */}
                                    <TableCell>
                                        Retail Price ₹{item.price}/-
                                        {/* {item.discountPrice && (
                                            <span className="text-green-600 ml-2 text-sm">
                                               ₹{item.discountPrice}
                                            </span>
                                        )} */}
                                    </TableCell>

                                    {/* ACTION */}
                                    <TableCell className="flex gap-2">
                                        <Button size="sm" onClick={() => handleStatus(item._id)} variant="outline">
                                            {item.status === "active" ? "Disable" : "Enable"}
                                        </Button>
                                        <Button size="sm"  onClick={() => navigate(`/addprod/${item._id}`)} variant="secondary"> <Pencil/> </Button>
                                        <Button size="sm" onClick={() => handleDelete(item._id)} variant="destructive"> <Trash/> </Button>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>
        </div>
    );
}