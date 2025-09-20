import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  TrendingUp,
  VerifiedIcon,
  Search,
} from "lucide-react";
import { User, MapPin, Briefcase } from "lucide-react";

import { ModeToggle } from "@/themes/mode-toggle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Medicine = {
  name: string;
  category: string;
  requiresPrescription: boolean;
  status: "in stock" | "out of stock";
};

type ModalType = "add" | "edit" | "delete";

const user = JSON.parse(localStorage.getItem("nirmaya-user") || "{}");
const pharmacyId = user?.id;

const PharmacistDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"inventory" | "history" | "nirmay">(
    "inventory"
  );
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("add");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    name: "",
    category: "",
    requiresPrescription: false,
    status: "in stock",
  });

  const [nirmayPhone, setNirmayPhone] = useState("");
  const [nirmayData, setNirmayData] = useState<{
    isActive: string;
    prescriptions: string[];
  } | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const pharmacyDetails = {
    name: user.name || "Pharma Dashboard",
    role: user.role || "",
    location: user.location || "",
  };

  useEffect(() => {
  if (activeTab !== "nirmay") {
    setNirmayPhone("");
    setOtpCode("");
    setOtpSent(false);
    setOtpVerified(false);
    setNirmayData(null);
  }
}, [activeTab]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!pharmacyId) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URI}/inventory?pharmacy_id=${pharmacyId}`
        );
        const data = await res.json();

        if (res.ok) {
          const normalized = (data.inventory || []).map((m: any) => ({
            name: m.name,
            category: m.category,
            requiresPrescription: m.requires_prescription,
            status: m.status,
          }));

          setMedicines(normalized);

          // Extract unique categories dynamically
          const uniqueCategories = Array.from(
            new Set(normalized.map((m) => m.category))
          );
          setCategories(uniqueCategories);
        } else {
          alert(data.error || "Failed to fetch inventory");
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };

    fetchInventory();
  }, []);

  const filteredMedicines = medicines.filter((med) => {
    const name = med.name || "";
    const category = med.category || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filterCategory || category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Backend interaction handlers
  const handleAddMedicine = async () => {
    if (!newMedicine.name || !newMedicine.category) {
      alert("Name and category are required");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/inventory/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacy_id: pharmacyId,
          medicine: {
            name: newMedicine.name,
            category: newMedicine.category,
            requires_prescription: newMedicine.requiresPrescription,
            status: newMedicine.status,
          },
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const normalized = (data.inventory || []).map((m: any) => ({
          name: m.name,
          category: m.category,
          requiresPrescription: m.requires_prescription,
          status: m.status,
        }));
        setMedicines(normalized);
        setShowModal(false);
        setNewMedicine({
          name: "",
          category: "",
          requiresPrescription: false,
          status: "in stock",
        });
      } else {
        alert(data.error || "Failed to add medicine");
      }
    } catch (err) {
      console.error("Error adding medicine:", err);
    }
  };

  const handleEditMedicine = async () => {
    if (!selectedMedicine || !newMedicine.name || !newMedicine.category) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/inventory/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacy_id: pharmacyId,
          name: selectedMedicine.name,
          updates: {
            name: newMedicine.name,
            category: newMedicine.category,
            requires_prescription: newMedicine.requiresPrescription,
            status: newMedicine.status,
          },
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const normalized = (data.inventory || []).map((m: any) => ({
          name: m.name,
          category: m.category,
          requiresPrescription: m.requires_prescription,
          status: m.status,
        }));
        setMedicines(normalized);
        setShowModal(false);
      } else {
        alert(data.error || "Failed to update medicine");
      }
    } catch (err) {
      console.error("Error updating medicine:", err);
    }
  };

  const handleDeleteMedicine = async () => {
    if (!selectedMedicine) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/inventory/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacy_id: pharmacyId,
          name: selectedMedicine.name,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMedicines(data.inventory);
        setShowModal(false);
      } else {
        alert(data.error || "Failed to delete medicine");
      }
    } catch (err) {
      console.error("Error deleting medicine:", err);
    }
  };

  return (
    <main className="flex w-full flex-col min-h-screen bg-background dark:bg-gray-900">

<header className="flex w-full justify-between items-center px-6 py-4 sticky top-0 z-10 bg-card border-b shadow-sm">
  {/* Left - Title */}
  <div className="flex items-center space-x-3">
    <Package className="w-8 h-8 text-primary" />
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
        Pharma Dashboard
      </h1>
      <p className="text-sm text-muted-foreground">Manage your inventory & sales</p>
    </div>
  </div>

  {/* Right - Profile / Info */}
  <div className="flex items-center space-x-6">
    <div className="flex flex-col text-right">
      <div className="flex items-center justify-end gap-2">
        <User className="w-5 h-5 text-muted-foreground" />
        <span className="font-semibold text-foreground">{pharmacyDetails.name}</span>
      </div>
      <div className="flex items-center justify-end gap-4 text-sm text-muted-foreground mt-1">
        <span className="flex items-center gap-1">
          <Briefcase className="w-4 h-4 text-muted-foreground" /> {pharmacyDetails.role}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-muted-foreground" /> {pharmacyDetails.location}
        </span>
      </div>
    </div>

    {/* Optional: Mode toggle or profile dropdown */}
    <ModeToggle />
  </div>
</header>


      <div className="mx-auto max-w-7xl px-6 py-6 w-full">
        {/* Navigation */}
        <div className="bg-card rounded-xl shadow-sm p-1 mb-6 border dark:border-gray-700">
          <div className="flex space-x-1">
            {[
              { id: "inventory" as const, label: "Inventory", icon: Package },
              { id: "history" as const, label: "Sales History", icon: TrendingUp },
              { id: "nirmay" as const, label: "Nirmay Verification", icon: VerifiedIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted dark:text-gray-400 dark:hover:bg-gray-700"
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
            <div className="bg-card rounded-xl shadow-sm p-6 mb-6 border dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring bg-background dark:bg-gray-800 text-gray-800 dark:text-gray-100"
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
                  onClick={() => {
                    setModalType("add");
                    setSelectedMedicine(null);  // clear any selected medicine
                    setNewMedicine({            // reset form fields
                      name: "",
                      category: "",
                      requiresPrescription: false,
                      status: "in stock",
                    });
                    setShowModal(true);
                  }}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Medicine</span>
                </button>

              </div>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border p-6 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
                        {m.name}
                      </h3>
                      <span className="inline-block bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                        {m.category}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMedicine(m);
                          setNewMedicine(m);
                          setModalType("edit");
                          setShowModal(true);
                        }}
                        className="text-primary p-1"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMedicine(m);
                          setModalType("delete");
                          setShowModal(true);
                        }}
                        className="text-destructive p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                    <div className="flex justify-between">
                      <span>Prescription Required:</span>
                      <span>{m.requiresPrescription ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span
                        className={`font-medium ${
                          m.status === "in stock"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {m.status === "in stock" ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add/Edit/Delete Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-96 p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  {modalType === "add" && <Plus className="w-5 h-5 text-green-500" />}
                  {modalType === "edit" && <Edit3 className="w-5 h-5 text-blue-500" />}
                  {modalType === "delete" && <Trash2 className="w-5 h-5 text-red-500" />}
                  {modalType === "add"
                    ? "Add Medicine"
                    : modalType === "edit"
                    ? "Edit Medicine"
                    : "Delete Medicine"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              {modalType !== "delete" && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    value={newMedicine.name}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    value={newMedicine.category}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, category: e.target.value })
                    }
                  />
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    value={newMedicine.status}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        status: e.target.value as "in stock" | "out of stock",
                      })
                    }
                  >
                    <option value="in stock">In Stock</option>
                    <option value="out of stock">Out of Stock</option>
                  </select>
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={newMedicine.requiresPrescription}
                      onChange={(e) =>
                        setNewMedicine({
                          ...newMedicine,
                          requiresPrescription: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-blue-500"
                    />
                    Requires Prescription
                  </label>
                </div>
              )}

              {modalType === "delete" && selectedMedicine && (
                <p className="text-gray-800 dark:text-gray-100 text-center">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-red-500">{selectedMedicine.name}</span> from inventory?
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  Cancel
                </button>

                {modalType === "add" && (
                  <button
                    onClick={handleAddMedicine}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                )}
                {modalType === "edit" && (
                  <button
                    onClick={handleEditMedicine}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Save
                  </button>
                )}
                {modalType === "delete" && (
                  <button
                    onClick={handleDeleteMedicine}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Nirmay Verification Tab */}
        {activeTab === "nirmay" && (
          <div className="bg-card rounded-xl shadow-sm p-6 mb-6 border dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Verify Nirmay Prescription
            </h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                value={nirmayPhone}
                onChange={(e) => setNirmayPhone(e.target.value)}
                placeholder="Enter 10 digit phone number"
              />
            </div>

            {!otpSent ? (
              <button
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg"
                onClick={async () => {
                  if (!nirmayPhone.trim()) {
                    alert("Enter phone number");
                    return;
                  }
                  const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URI}/otp/send`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ phoneNumber: nirmayPhone }),
                    }
                  );
                  if (res.ok) setOtpSent(true);
                }}
              >
                Send OTP
              </button>
            ) : !otpVerified ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border rounded-lg"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter OTP"
                />
                <button
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg"
                  onClick={async () => {
                    const res = await fetch(
                      `${import.meta.env.VITE_BACKEND_URI}/otp/verify`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          phoneNumber: nirmayPhone,
                          code: otpCode,
                        }),
                      }
                    );
                    const data = await res.json();
                    if (res.ok) {
                      setOtpVerified(true);
                      setNirmayData({
                        isActive: data.isActive ? "true" : "false",
                        prescriptions: data.prescriptions || [],
                      });
                    }
                  }}
                >
                  Verify
                </button>
              </div>
            ) : (
              nirmayData && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/10 text-gray-800 dark:text-gray-100">
                  <p>
                    <strong>Is Active:</strong> {nirmayData.isActive}
                  </p>
                  {nirmayData.prescriptions.length > 0 && (
                    <ul className="list-disc ml-5">
                      {nirmayData.prescriptions.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default PharmacistDashboard;
