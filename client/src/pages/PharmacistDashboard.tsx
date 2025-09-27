import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  VerifiedIcon,
  Search,
  LogOut,
  HeartPulse,
} from "lucide-react";
import { User, MapPin, Briefcase } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";
import { ModeToggle } from "@/themes/mode-toggle";
import { Button } from "@/components/ui/button";

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
  const [activeTab, setActiveTab] = useState<
    "inventory" | "history" | "nirmay"
  >("inventory");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("add");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
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

  const navigate = useNavigate();
  const { setEntity } = useLoggedInEntity();

  const handleLogout = () => {
    setEntity(null);
    navigate("/");
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
          `${
            import.meta.env.VITE_BACKEND_URI
          }/inventory?pharmacy_id=${pharmacyId}`
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
          const uniqueCategories: string[] = Array.from(
            new Set(normalized.map((m: any) => m.category))
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
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/inventory/add`,
        {
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
        }
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
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/inventory/update`,
        {
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
        }
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
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/inventory/remove`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pharmacy_id: pharmacyId,
            name: selectedMedicine.name,
          }),
        }
      );
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      {/* Subtle animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <header className="relative flex w-full justify-between px-8 py-6 backdrop-blur-sm z-10">
        <Link
          to="/"
          className="flex items-center gap-4 transition-all duration-300 hover:scale-105 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <p className="relative font-bold border-2 text-xl rounded-xl border-primary text-primary h-12 w-12 flex justify-center items-center bg-white/80 backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-all duration-300">
              <HeartPulse className="w-6 h-6" />
            </p>
          </div>
          <p className="font-bold text-2xl text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Nirmay
          </p>
        </Link>

        {/* Right - Profile / Info */}
        <div className="flex items-center space-x-6">
          <div className="flex flex-col text-right">
            <div className="flex items-center justify-end gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                {pharmacyDetails.name}
              </span>
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

          <Button variant="outline" size={"icon"} onClick={handleLogout}>
            <LogOut />
          </Button>
          <ModeToggle />
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-6 py-6 w-full z-10">
        {/* Navigation with improved styling */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-blue-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-2 shadow-xl">
            <div className="flex space-x-1">
              {[
                { id: "inventory" as const, label: "Inventory", icon: Package },
                {
                  id: "nirmay" as const,
                  label: "Nirmay Verification",
                  icon: VerifiedIcon,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden group ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-lg"
                      : "text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600"
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse"></div>
                  )}
                  <tab.icon className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <>
            {/* Search and filter section */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-blue-500/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search medicines..."
                        className="pl-10 pr-4 py-3 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-800 dark:text-gray-100 transition-all duration-300 group-hover:border-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>

                    <div className="relative group">
                      <select
                        className="px-4 py-3 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-800 dark:text-gray-100 transition-all duration-300 group-hover:border-blue-400"
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
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setModalType("add");
                      setSelectedMedicine(null);
                      setNewMedicine({
                        name: "",
                        category: "",
                        requiresPrescription: false,
                        status: "in stock",
                      });
                      setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Medicine</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((m, idx) => (
                <div
                  key={idx}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-blue-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:border-blue-300/50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                          {m.name}
                        </h3>
                        <span className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full font-medium border border-blue-200/50 dark:border-blue-700/50">
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
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMedicine(m);
                            setModalType("delete");
                            setShowModal(true);
                          }}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex justify-between items-center">
                        <span>Prescription Required:</span>
                        <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                          m.requiresPrescription 
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300" 
                            : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                        }`}>
                          {m.requiresPrescription ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Status:</span>
                        <span
                          className={`font-medium px-2 py-1 rounded-full text-xs ${
                            m.status === "in stock"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                          }`}
                        >
                          {m.status === "in stock" ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add/Edit/Delete Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="relative w-full max-w-lg mx-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-blue-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      modalType === "add" ? "bg-green-100 dark:bg-green-900/50" :
                      modalType === "edit" ? "bg-blue-100 dark:bg-blue-900/50" :
                      "bg-red-100 dark:bg-red-900/50"
                    }`}>
                      {modalType === "add" && <Plus className="w-5 h-5 text-green-600" />}
                      {modalType === "edit" && <Edit3 className="w-5 h-5 text-blue-600" />}
                      {modalType === "delete" && <Trash2 className="w-5 h-5 text-red-600" />}
                    </div>
                    {modalType === "add"
                      ? "Add Medicine"
                      : modalType === "edit"
                      ? "Edit Medicine"
                      : "Delete Medicine"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {modalType !== "delete" && (
                  <div className="space-y-4">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Medicine Name"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-800 dark:text-gray-100 transition-all duration-300 group-hover:border-blue-400"
                        value={newMedicine.name}
                        onChange={(e) =>
                          setNewMedicine({ ...newMedicine, name: e.target.value })
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>

                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Category"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-800 dark:text-gray-100 transition-all duration-300 group-hover:border-blue-400"
                        value={newMedicine.category}
                        onChange={(e) =>
                          setNewMedicine({
                            ...newMedicine,
                            category: e.target.value,
                          })
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>

                    <div className="relative group">
                      <select
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-800 dark:text-gray-100 transition-all duration-300 group-hover:border-blue-400"
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
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>

                    <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200 cursor-pointer p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={newMedicine.requiresPrescription}
                        onChange={(e) =>
                          setNewMedicine({
                            ...newMedicine,
                            requiresPrescription: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded accent-blue-600"
                      />
                      Requires Prescription
                    </label>
                  </div>
                )}

                {modalType === "delete" && selectedMedicine && (
                  <div className="text-center py-4">
                    <p className="text-gray-800 dark:text-gray-100">
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-red-600">
                        {selectedMedicine.name}
                      </span>{" "}
                      from inventory?
                    </p>
                  </div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                  >
                    Cancel
                  </button>

                  {modalType === "add" && (
                    <button
                      onClick={handleAddMedicine}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  )}
                  {modalType === "edit" && (
                    <button
                      onClick={handleEditMedicine}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <Edit3 className="w-4 h-4" />
                      Save
                    </button>
                  )}
                  {modalType === "delete" && (
                    <button
                      onClick={handleDeleteMedicine}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nirmay Verification Tab */}
        {activeTab === "nirmay" && (
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-2xl mb-6">
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
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 
              hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white font-medium 
              shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
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
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 
                  hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white font-medium 
                  shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
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
    </div>
  );
};

export default PharmacistDashboard;
