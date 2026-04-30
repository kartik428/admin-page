import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../components/ui/table";
import { Pencil, Trash } from "lucide-react";
import axios from "axios";

type PlanType = {
    _id: string;
    type: string;
    title: string;
    status: "active" | "inactive";
    price: number;
    maxShopping: number;
    description?: string;
    discount?: {
        b2b: number;
        b2c: number;
    };
};
const BASE_URL = import.meta.env.VITE_API_URL;

export default function SubscriptionPage() {
    const [form, setForm] = useState({
        type: "B2B",
        title: "",
        price: "",
        maxShopping: "",
        description: "",
        discountB2B: "",
        discountB2C: "",
    });

    const [plans, setPlans] = useState<PlanType[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };


    const handleSubmit = async () => {
        try {
            setLoading(true)
            if (!form.title) return alert("Title required");

            const payload = {
                type: form.type,
                title: form.title,
                price: Number(form.price),
                maxShopping: Number(form.maxShopping),
                description: form.description,
                discount: {
                    b2b: Number(form.discountB2B || 0),
                    b2c: Number(form.discountB2C || 0),
                },
            };

            let res;

            if (editingId) {
                // UPDATE
                res = await axios.put(`${BASE_URL}/plans/${editingId}`, payload);

                // update UI
                setPlans((prev) =>
                    prev.map((p) =>
                        p._id === editingId ? res.data.data : p
                    )
                );

                console.log("Plan updated ✅");

            } else {
                // CREATE
                res = await axios.post(`${BASE_URL}/plans`, payload);

                setPlans((prev) => [...prev, res.data.data]);

                console.log("Plan added ✅");
            }

            // reset form
            setForm({
                type: "B2B",
                title: "",
                price: "",
                maxShopping: "",
                description: "",
                discountB2B: "",
                discountB2C: "",
            });

            setEditingId(null);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        const res = await axios.get(`${BASE_URL}/plans`);
        const data = res.data.data;
        console.log(data);
        setPlans(data);

    }

    const handledelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/plans/${id}`);

            await fetchPlans();
        } catch (error) {
            console.error(error);
        }
    }

    const handleToggle = async (id: string) => {
        try {
            const res = await axios.patch(
                `${BASE_URL}/plans/${id}/toggle`
            );

            setPlans((prev) =>
                prev.map((item) =>
                    item._id === id ? res.data.data : item
                )
            );

        } catch (error) {
            console.error(error);
        }
    };




    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Manage Plans</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT FORM */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add / Edit Plan</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div>
                            <Label>Plan Type</Label>
                            <select
                                value={form.type}
                                onChange={(e) => handleChange("type", e.target.value)}
                                className="w-full border rounded-md p-2 text-sm"
                            >
                                <option>B2B</option>
                                <option>B2C</option>
                            </select>
                        </div>

                        <div>
                            <Label>Plan Title</Label>
                            <Input
                                value={form.title}
                                placeholder="Enter Plan Title"
                                onChange={(e) => handleChange("title", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Plan Price</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter Plan Price"
                                    value={form.price}
                                    onChange={(e) => handleChange("price", e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Max Shopping</Label>
                                <Input
                                    type="number"
                                    placeholder="ex: 10000"
                                    value={form.maxShopping}
                                    onChange={(e) => handleChange("maxShopping", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Short Description</Label>
                            <textarea
                                className="w-full border rounded-md p-2 text-sm"
                                placeholder="Enter a Short description"
                                rows={3}
                                value={form.description}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                            />
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading
                                ? editingId
                                    ? "Updating..."
                                    : "Adding..."
                                : editingId
                                    ? "Update Plan"
                                    : "Add Plan"}
                        </Button>

                    </CardContent>
                </Card>

                {/* RIGHT TABLE */}
                <Card>
                    <CardHeader>
                        <CardTitle>Listed Plans</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        {/* Discount Inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="B2B Discount"
                                value={form.discountB2B}
                                onChange={(e) => handleChange("discountB2B", e.target.value)}
                            />

                            <Input
                                placeholder="B2C Discount"
                                value={form.discountB2C}
                                onChange={(e) => handleChange("discountB2C", e.target.value)}
                            />
                        </div>

                        {/* Table */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Max Shopping</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {plans.map((p, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${p.type === "B2B"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-green-100 text-green-700"
                                                    }`}
                                            >
                                                {p.type}
                                            </span>
                                        </TableCell>
                                        <TableCell >{p.title}</TableCell>
                                        <TableCell>₹{p.price}</TableCell>
                                        <TableCell>₹{p.maxShopping}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleToggle(p._id)}
                                            >
                                                {p.status === "active" ? "Disable" : "Enable"}
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => {
                                                    setForm({
                                                        type: p.type,
                                                        title: p.title,
                                                        price: String(p.price),
                                                        maxShopping: String(p.maxShopping),
                                                        description: p.description || "",
                                                        discountB2B: String(p.discount?.b2b || ""),
                                                        discountB2C: String(p.discount?.b2c || ""),
                                                    });

                                                    setEditingId(p._id); // IMPORTANT
                                                }}
                                            >
                                                <Pencil />
                                            </Button>

                                            <Button onClick={() => handledelete(p._id)} size="sm" variant="destructive">
                                                <Trash />
                                            </Button>

                                        </TableCell>
                                    </TableRow>
                                ))}

                                {plans.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-400">
                                            No plans added
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}