import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  TrendingUp,
  AlertTriangle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/themes/mode-toggle";

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

type ModalType = "add" | "edit" | "delete";

const PharmacistDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"inventory" | "history">(
    "inventory"
  );
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Analgesic",
      stock: 150,
      price: 2.5,
      expiryDate: "2025-12-30",
      supplier: "MedCorp Ltd",
      minStock: 50,
      batchNo: "PC2024-001",
    },
    {
      id: 2,
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      stock: 25,
      price: 8.75,
      expiryDate: "2025-08-15",
      supplier: "PharmaCo",
      minStock: 30,
      batchNo: "AM2024-045",
    },
  ]);
  const [salesHistory] = useState<Sale[]>([
    {
      id: 1,
      medicineId: 1,
      medicineName: "Paracetamol 500mg",
      quantity: 10,
      price: 25.0,
      date: "2024-09-18",
      prescriptionId: "RX-2024-001",
      customer: "John Smith",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("add");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [prescriptionId, setPrescriptionId] = useState("");
  const [formData, setFormData] = useState<Omit<Medicine, "id">>({
    name: "",
    category: "",
    stock: 0,
    price: 0,
    expiryDate: "",
    supplier: "",
    minStock: 0,
    batchNo: "",
  });

  const categories: string[] = [
    "Analgesic",
    "Antibiotic",
    "Anti-inflammatory",
    "Antidiabetic",
    "Cardiovascular",
    "Respiratory",
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      stock: 0,
      price: 0,
      expiryDate: "",
      supplier: "",
      minStock: 0,
      batchNo: "",
    });
  };

  const openModal = (type: ModalType, medicine: Medicine | null = null) => {
    setModalType(type);
    setSelectedMedicine(medicine);
    if (medicine && type === "edit") {
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
    setPrescriptionId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "add") {
      const newMedicine: Medicine = {
        id: Date.now(),
        ...formData,
        stock: Number(formData.stock),
        price: Number(formData.price),
        minStock: Number(formData.minStock),
      };
      setMedicines([...medicines, newMedicine]);
    } else if (modalType === "edit" && selectedMedicine) {
      setMedicines(
        medicines.map((med) =>
          med.id === selectedMedicine.id
            ? {
                ...med,
                ...formData,
                stock: Number(formData.stock),
                price: Number(formData.price),
                minStock: Number(formData.minStock),
              }
            : med
        )
      );
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!prescriptionId.trim()) {
      alert("Prescription ID is required to delete medicine");
      return;
    }
    if (selectedMedicine) {
      setMedicines(medicines.filter((med) => med.id !== selectedMedicine.id));
    }
    closeModal();
  };

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || med.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockMedicines = medicines.filter(
    (med) => med.stock <= med.minStock
  );
  const totalValue = medicines.reduce(
    (sum, med) => sum + med.stock * med.price,
    0
  );

  return (
    <main className="flex w-full flex-col min-h-screen">
      {/* Header */}
      <header className="flex w-full justify-between pr-8 h-16 pl-4 py-4 sticky top-0 bg-background z-10 border-b">
        <h1 className="text-xl font-bold">Pharma Dashboard</h1>
        <ModeToggle />
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6 w-full">
        {/* Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pharma Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Medicine Stock Management System
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="rounded-lg px-4 py-2 shadow-2xs bg-secondary text-secondary-foreground">
              Total Medicines: {medicines.length}
            </div>
            <div className="rounded-lg px-4 py-2 shadow-2xs bg-accent text-accent-foreground">
              Total Value: Rs.{totalValue.toFixed(2)}
            </div>
            {lowStockMedicines.length > 0 && (
              <div className="rounded-lg px-4 py-2 shadow-2xs bg-destructive text-destructive-foreground">
                Low Stock: {lowStockMedicines.length}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl shadow-sm p-1 mb-6 border">
          <div className="flex space-x-1">
            {[
              { id: "inventory" as const, label: "Medicine Inventory", icon: Package },
              { id: "history" as const, label: "Sales History", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <>
            {/* Controls */}
            <div className="bg-card rounded-xl shadow-sm p-6 mb-6 border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring bg-background"
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
                  onClick={() => openModal("add")}
                  className="bg-primary hover:brightness-95 text-primary-foreground px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Medicine</span>
                </button>
              </div>
            </div>

            {/* Alerts */}
            {lowStockMedicines.length > 0 && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <h3 className="text-destructive font-semibold">
                    Low Stock Alert
                  </h3>
                </div>
                <p className="text-destructive text-sm">
                  {lowStockMedicines.length} medicine(s) are running low on
                  stock: {lowStockMedicines.map((m) => m.name).join(", ")}
                </p>
              </div>
            )}

            {/* Medicines */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((m) => (
                <div
                  key={m.id}
                  className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{m.name}</h3>
                        <span className="inline-block bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                          {m.category}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal("edit", m)}
                          className="text-primary hover:underline p-1"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openModal("delete", m)}
                          className="text-destructive hover:underline p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stock:</span>
                        <span
                          className={`font-semibold ${
                            m.stock <= m.minStock
                              ? "text-destructive"
                              : "text-green-600"
                          }`}
                        >
                          {m.stock} units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold">
                          Rs.{m.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expiry:</span>
                        <span>{m.expiryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Batch:</span>
                        <span className="text-sm">{m.batchNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Supplier:</span>
                        <span className="text-sm">{m.supplier}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-card rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Sales History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                      Medicine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                      Prescription ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {salesHistory.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/40">
                      <td className="px-6 py-4 text-sm">{s.date}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {s.medicineName}
                      </td>
                      <td className="px-6 py-4 text-sm">{s.customer}</td>
                      <td className="px-6 py-4 text-sm">{s.quantity} units</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        Rs.{s.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-primary">
                        {s.prescriptionId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PharmacistDashboard;
