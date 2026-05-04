import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Coupon = {
  _id: string;
  code: string;
  discountValue: number;
  expiryDate: string;
};

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    expiry: "",
  });

  // Generate random coupon
  const generateCode = () => {
    const code = "BNGD" + Math.floor(1000 + Math.random() * 9000);
    setForm({ ...form, code });
  };

  // Add coupon
  const handleAddCoupon = async () => {
    try {
      if (!form.code || !form.discount || !form.expiry) {
        return alert("All fields required");
      }

      const res = await axios.post(`${BASE_URL}/coupons`, {
        code: form.code,
        discountType: "percentage", // or from form
        discountValue: Number(form.discount),
        expiryDate: form.expiry,
      });

      const newCoupon = res.data.data;

      setCoupons((prev) => [newCoupon, ...prev]);

      setForm({
        code: "",
        discount: "",
        expiry: "",
      });

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/coupons`);
      setCoupons(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  //  Delete coupon
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/coupons/${id}`);
      // setCoupons((prev) => prev.filter((c) => c._id !== id));
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* LEFT SIDE - CREATE COUPON */}
      <Card>
        <CardHeader>
          <CardTitle>Add / Generate Coupon</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Coupon Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <Button onClick={generateCode} variant="outline">
            Generate Code
          </Button>

          <Input
            type="number"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
          />

          <Input
            type="date"
            value={form.expiry}
            onChange={(e) => setForm({ ...form, expiry: e.target.value })}
          />

          <Button className="w-full" onClick={handleAddCoupon}>
            Add Coupon
          </Button>
        </CardContent>
      </Card>

      {/* RIGHT SIDE - LIST COUPONS */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {coupons.length > 0 ? (
                coupons.map((c, index) => (
                  <TableRow key={c._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{c.code}</TableCell>
                    <TableCell>{c.discountValue}%</TableCell>
                    <TableCell>{new Date(c.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedCouponId(c._id);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No coupons found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this coupon? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={async () => {
                if (selectedCouponId) {
                  await handleDelete(selectedCouponId);
                }
                setOpenDeleteDialog(false);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
