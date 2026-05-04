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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type OrderItem = {
    name: string;
    price: number;
    quantity: number;
};

type OrderType = {
    _id: string;
    status: "pending" | "confirmed" | "cancelled";
    total: number;
    createdAt: string;
    shippingAddress?: {
        fullName: string;
    };
    items: OrderItem[];
};


const Orders = () => {

    const { status } = useParams<{ status?: string }>();
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_URL;

    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<OrderType["status"]>("pending");



    const filteredOrders: OrderType[] =
        status && status !== "all"
            ? orders.filter((o) => o.status === status)
            : orders;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/orders`);
            setOrders(res.data.data);
            console.log(res.data.data);

        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="p-6">Loading orders...</div>;
    }

    const updateStatus = async (
        id: string,
        status: OrderType["status"]
    ) => {
        try {
            await axios.put(`${BASE_URL}/orders/${id}`, { status });

            // refresh list
            fetchOrders();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Page Title according to status */}
            <h1 className="text-2xl font-semibold capitalize">
                Orders {status && status !== "all" && `- ${status}`}
            </h1>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>All Orders</CardTitle>
                    <div>
                        {/* <Button>+ New Order</Button> */}
                        <Select
                            value={status || "all"}
                            onValueChange={(value) => navigate(`/orders/${value}`)}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>S.No.</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total Items</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Edit Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order, index) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    order.status === "confirmed"
                                                        ? "default"
                                                        : order.status === "pending"
                                                            ? "secondary"
                                                            : "destructive"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>{order.shippingAddress?.fullName}</TableCell>
                                        <TableCell>
                                            {(order.items || []).reduce((sum, item) => sum + item.quantity, 0)}
                                        </TableCell>

                                        <TableCell>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell>₹{order.total?.toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }) || 0}</TableCell>

                                        <TableCell>

                                            <Select
                                                value={order.status}
                                                onValueChange={(value) => {
                                                    setSelectedOrderId(order._id);
                                                    setSelectedStatus(value as OrderType["status"]);
                                                    setOpenDialog(true);
                                                }}
                                            >
                                                <SelectTrigger className="w-[130px]">
                                                    <SelectValue />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>

                                        <TableCell>

                                            <Button
                                                onClick={() => navigate(`/orders/view/${order._id}`)}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Eye />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Status Change</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to change order status to{" "}
                        <span className="font-medium">{selectedStatus}</span>?
                    </p>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>
                            Cancel
                        </Button>

                        <Button
                            onClick={() => {
                                if (selectedOrderId && selectedStatus) {
                                    updateStatus(selectedOrderId, selectedStatus);
                                }
                                setOpenDialog(false);
                            }}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Orders;