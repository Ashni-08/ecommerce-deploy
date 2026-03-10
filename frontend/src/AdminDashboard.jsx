import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = "https://ecommerce-deploy-production.up.railway.app/api/products";

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        image: '',
        category: '',
        brand: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "ADMIN") {
            alert("Access Denied");
            navigate("/");
            return;
        }
        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(API_BASE_URL);
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await axios.put(`${API_BASE_URL}/${editingProduct.id}`, formData);
            } else {
                await axios.post(API_BASE_URL, formData);
            }
            setShowModal(false);
            setEditingProduct(null);
            setFormData({ title: '', description: '', price: '', image: '', category: '', brand: '' });
            fetchProducts();
        } catch (err) {
            console.error("Error saving product", err);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData(product);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`);
                fetchProducts();
            } catch (err) {
                console.error("Error deleting product", err);
            }
        }
    };

    const handleImport = async () => {
        if (window.confirm("This will import 50+ products from external APIs into your database. Continue?")) {
            try {
                alert("Importing products... please wait.");
                await axios.post(`${API_BASE_URL}/import`);
                alert("Products imported successfully!");
                fetchProducts();
            } catch (err) {
                console.error("Error importing products", err);
                alert("Import failed.");
            }
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span className="breadcrumb-separator">&gt;</span>
                <span className="breadcrumb-current">Admin Dashboard</span>
            </div>
            <div className="admin-header">
                <h2 style={{ color: "#ffffff" }}>Admin Dashboard</h2>
                <div className="admin-actions">
                    <button className="btn-import" onClick={handleImport}>Import External Products</button>
                    <button className="btn-add" onClick={() => { setEditingProduct(null); setFormData({ title: '', description: '', price: '', image: '', category: '', brand: '' }); setShowModal(true); }}>
                        + Add New Product
                    </button>
                </div>
            </div>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td><img src={product.image} alt={product.title} /></td>
                            <td>{product.title}</td>
                            <td>{product.category}</td>
                            <td>${product.price}</td>
                            <td>
                                <button className="btn-edit" onClick={() => handleEdit(product)}>Edit</button>
                                <button className="btn-delete" onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
                        <form onSubmit={handleSubmit}>
                            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                            <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} required />
                            <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
                            <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
                            <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
