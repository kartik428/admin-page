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
import { Mail, Phone, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";

type UserType = {
  _id: string;
  name: string;
  email: string;
  accountType: string;
  phone: string;
  createdAt: string;
  totalOrders?: number;
  totalPurchase?: number;
};
type FormType = {
  accountType: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};




export default function ManageCustomers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormType>({
    accountType: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {

    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const usersRes = await axios.get<{ data: UserType[] }>(
        "http://localhost:5000/auth"
      );

      const statsRes = await axios.get<any[]>(
        "http://localhost:5000/auth/user-stats"
      );

      const usersData = usersRes.data.data;
      const statsData = statsRes.data;

      const finalData = usersData.map((user: UserType) => {
        const stat = statsData.find((s) => s._id === user.email);

        return {
          ...user,
          totalOrders: stat?.totalOrders || 0,
          totalPurchase: stat?.totalAmount || 0,
        };
      });

      setUsers(finalData);

    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCustomer = async () => {
    try {
      setLoading(true)
      if (!form.name || !form.email || !form.phone || !form.password) {
        return alert("All fields required");
      }

      await axios.post("http://localhost:5000/auth", form);

      alert("Customer Added ✅");

      setOpen(false);

      setForm({
        accountType: "B2C",
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      await fetchData();

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm("Delete this user?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/auth/${id}`);

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Listed Users</CardTitle>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setOpen(true)}
          >
            Add New Customer
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Purchase</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user: UserType, index: number) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${user.accountType === "B2B"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                        }`}
                    >
                      {user.accountType}
                    </span>
                  </TableCell>

                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="font-medium ">
                    {user.name}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1" >
                      <Mail className="w-3.5 text-gray-500" />{user.email}
                    </div>
                    <div className="text-sm flex gap-1 text-gray-500">
                      <Phone className="w-3.5" />{user.phone}
                    </div>
                  </TableCell>

                  <TableCell>{user.totalOrders}</TableCell>

                  <TableCell>
                    ₹{user.totalPurchase?.toFixed(2) || 0}
                  </TableCell>

                  <TableCell className="flex gap-2">
                    <Button onClick={() => navigate('/orders/pending')} size="sm" className="bg-green-500 hover:bg-green-600">
                      ({user.totalOrders}) View Orders
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>

              {/* FORM */}
              <div className="space-y-4">
                <select
                  value={form.accountType}
                  onChange={(e) =>
                    setForm({ ...form, accountType: e.target.value })
                  }
                  className="w-full border rounded-md p-2 text-sm"
                >
                  <option value="">Select Type</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                </select>

                <Input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <Input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <Input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <Button
                  className="w-full bg-red-500 hover:bg-red-600"
                  onClick={handleAddCustomer}
                >
                  {loading ? "Adding..." : "Add Customer"}
                </Button>

              </div>
            </DialogContent>
          </Dialog>


        </CardContent>
      </Card>
    </div>
  );
}