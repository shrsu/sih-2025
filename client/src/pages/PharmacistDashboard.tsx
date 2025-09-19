import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Package, TrendingUp, AlertTriangle, Search, X } from 'lucide-react';
type Medicine = {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: string;
  supplier: string;
  minStock: number;
  batchNo: string;
};
type Sale = {
  id: number;
  medicineId: number;
  medicineName: string;
  quantity: number;
  price: number;
  date: string;
  prescriptionId: string;
  customer: string;
};
type ModalType = 'add' | 'edit' | 'delete';
const PharmaDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic', stock: 150, price: 2.5, expiryDate: '2025-12-30', supplier: 'MedCorp Ltd', minStock: 50, batchNo: 'PC2024-001' },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 25, price: 8.75, expiryDate: '2025-08-15', supplier: 'PharmaCo', minStock: 30, batchNo: 'AM2024-045' },
    { id: 3, name: 'Ibuprofen 400mg', category: 'Anti-inflammatory', stock: 200, price: 3.25, expiryDate: '2026-03-22', supplier: 'HealthSupply Inc', minStock: 40, batchNo: 'IB2024-012' },
    { id: 4, name: 'Metformin 850mg', category: 'Antidiabetic', stock: 80, price: 4.5, expiryDate: '2025-11-10', supplier: 'DiabeCare', minStock: 60, batchNo: 'MT2024-078' },
  ]);
  const [salesHistory] = useState<Sale[]>([
    { id: 1, medicineId: 1, medicineName: 'Paracetamol 500mg', quantity: 10, price: 25.0, date: '2024-09-18', prescriptionId: 'RX-2024-001', customer: 'John Smith' },
    { id: 2, medicineId: 2, medicineName: 'Amoxicillin 250mg', quantity: 5, price: 43.75, date: '2024-09-17', prescriptionId: 'RX-2024-002', customer: 'Sarah Johnson' },
    { id: 3, medicineId: 3, medicineName: 'Ibuprofen 400mg', quantity: 8, price: 26.0, date: '2024-09-16', prescriptionId: 'RX-2024-003', customer: 'Michael Brown' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('add');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');
  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    name: '',
    category: '',
    stock: 0,
    price: 0,
    expiryDate: '',
    supplier: '',
    minStock: 0,
    batchNo: '',
  });
  const categories: string[] = ['Analgesic', 'Antibiotic', 'Anti-inflammatory', 'Antidiabetic', 'Cardiovascular', 'Respiratory'];
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      stock: 0,
      price: 0,
      expiryDate: '',
      supplier: '',
      minStock: 0,
      batchNo: '',
    });
  };
  const openModal = (type: ModalType, medicine: Medicine | null = null) => {
    setModalType(type);
    setSelectedMedicine(medicine);
    if (medicine && type === 'edit') {
      setFormData({
        name: medicine.name,
        category: medicine.category,
        stock: medicine.stock,
        price: medicine.price,
        expiryDate: medicine.expiryDate,
        supplier: medicine.supplier,
        minStock: medicine.minStock,
        batchNo: medicine.batchNo,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setPrescriptionId('');
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'add') {
      const newMedicine: Medicine = {
        id: Date.now(),
        ...formData,
        stock: Number(formData.stock),
        price: Number(formData.price),
        minStock: Number(formData.minStock),
      };
      setMedicines([...medicines, newMedicine]);
    } else if (modalType === 'edit' && selectedMedicine) {
      setMedicines(
        medicines.map((med) =>
          med.id === selectedMedicine.id
            ? { ...med, ...formData, stock: Number(formData.stock), price: Number(formData.price), minStock: Number(formData.minStock) }
            : med
        )
      );
    }
    closeModal();
  };
  const handleDelete = () => {
    if (!prescriptionId.trim()) {
      alert('Prescription ID is required to delete medicine');
      return;
    }
    if (selectedMedicine) {
      setMedicines(medicines.filter((med) => med.id !== selectedMedicine.id));
    }
    closeModal();
  };
  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || med.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || med.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  const lowStockMedicines = medicines.filter((med) => med.stock <= med.minStock);
  const totalValue = medicines.reduce((sum, med) => sum + med.stock * med.price, 0);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pharma Dashboard</h1>
                <p className="text-sm text-gray-600">Medicine Stock Management System</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-green-800 font-medium">Total Medicines: {medicines.length}</p>
              </div>
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Total Value: Rs.{totalValue.toFixed(2)}</p>
              </div>
              {lowStockMedicines.length > 0 && (
                <div className="bg-red-100 px-4 py-2 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">Low Stock: {lowStockMedicines.length}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-md p-1 mb-6">
          <div className="flex space-x-1">
            {[
              { id: 'inventory' as const, label: 'Medicine Inventory', icon: Package },
              { id: 'history' as const, label: 'Sales History', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all Rs.{
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <>
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => openModal('add')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-md hover:shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Medicine</span>
                </button>
              </div>
            </div>
            {/* Alerts */}
            {lowStockMedicines.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="text-red-800 font-semibold">Low Stock Alert</h3>
                </div>
                <p className="text-red-700 text-sm">
                  {lowStockMedicines.length} medicine(s) are running low on stock: {lowStockMedicines.map((m) => m.name).join(', ')}
                </p>
              </div>
            )}
            {/* Medicines */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((m) => (
                <div key={m.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{m.name}</h3>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">{m.category}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => openModal('edit', m)} className="text-blue-600 hover:text-blue-800 p-1">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => openModal('delete', m)} className="text-red-600 hover:text-red-800 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock:</span>
                        <span className={`font-semibold Rs.{m.stock <= m.minStock ? 'text-red-600' : 'text-green-600'}`}>{m.stock} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-gray-900">Rs.{m.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expiry:</span>
                        <span className="text-gray-900">{m.expiryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Batch:</span>
                        <span className="text-gray-900 text-sm">{m.batchNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Supplier:</span>
                        <span className="text-gray-900 text-sm">{m.supplier}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Sales History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prescription ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesHistory.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{s.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.medicineName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{s.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{s.quantity} units</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">Rs.{s.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-mono">{s.prescriptionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {modalType === 'add' ? 'Add New Medicine' : modalType === 'edit' ? 'Edit Medicine' : 'Delete Medicine'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              {modalType === 'delete' ? (
                <div>
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                      Are you sure you want to delete <strong>{selectedMedicine?.name}</strong>?
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prescription ID (Required) *</label>
                      <input
                        type="text"
                        placeholder="Enter prescription ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={prescriptionId}
                        onChange={(e) => setPrescriptionId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Medicine Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Minimum Stock *</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.minStock}
                        onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price per Unit (Rs.) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expiry Date *</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Batch Number *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.batchNo}
                      onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Supplier *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      {modalType === 'add' ? 'Add Medicine' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PharmaDashboard;