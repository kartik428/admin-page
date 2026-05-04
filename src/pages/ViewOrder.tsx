import { useNavigate, useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;

const ViewOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // TEMP: same fake data (later replace with API)
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrderById();
    }, [id]);

    const fetchOrderById = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/orders/${id}`);
            setOrder(res.data.order);
            // console.log(res.data.order);
            
        } catch (error) {
            console.log(error.response?.data || error.message);
        }

    };


    if (!order) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold">Order Details</h1>

                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Order Id: {order._id}</CardTitle>
                        <div className="flex flex-col gap-2" >
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
                            {/* Back Button */}
                            <Button variant="outline" onClick={() => navigate(-1)}>
                                Back
                            </Button>
                        </div>

                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Customer Info */}
                        <div>
                            <p className="text-sm text-muted-foreground">Customer</p>
                            <p className="font-medium">{order.shippingAddress?.fullName}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Items */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Items</p>

                            <div className="space-y-2">
                                {order.items?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between border rounded-lg p-3"
                                    >
                                        <span>* {item.name}</span>
                                        <span>
                                            {item.quantity} × ₹{item.price}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between font-semibold text-lg pt-4 border-t">
                            <span>Total</span>
                            <span>₹{order.total.toLocaleString()}</span>
                        </div>


                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ViewOrder;