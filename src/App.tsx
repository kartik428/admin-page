import React from "react";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Category from "./pages/Category";
import Layout from "./pages/Layout";
import SubCategory from "./pages/SubCategory";
import Brands from "./pages/Brands";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AddProduct from "./pages/AddProduct";
import AllProducts from "./pages/AllProducts";
import ManageCustomers from "./pages/ManageCustomers";

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="/category" element={<Category />} />
          <Route path="/subcategory" element={<SubCategory />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/addprod" element={<AddProduct />} />
          <Route path="/addprod/:id" element={<AddProduct />} />
          <Route path="/allprod" element={<AllProducts />} />
          <Route path="/customer" element={<ManageCustomers/> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;