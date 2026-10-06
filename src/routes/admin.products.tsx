import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Star,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Boxes,
  DollarSign,
  TrendingUp,
  Sparkles,
  Edit,
  Archive,
  RefreshCw,
  Clock,
  ImagePlus,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/productService";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/products")({ component: ProductsAdmin });

function ProductsAdmin() {
  const client = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "archived">("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "stock" | "name">(
    "newest",
  );
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const query = useQuery({
    queryKey: ["admin-products"],
    queryFn: () =>
      productService.list({
        sort: sortBy === "name" || sortBy === "stock" ? "featured" : sortBy,
      }),
  });

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let products = query.data ?? [];

    if (searchTerm) {
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.slug.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      products = products.filter((product) => product.status === statusFilter);
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        products = [...products].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products = [...products].sort((a, b) => b.price - a.price);
        break;
      case "stock":
        products = [...products].sort((a, b) => b.stock - a.stock);
        break;
      case "name":
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return products;
  }, [query.data, searchTerm, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Stats
  const stats = useMemo(() => {
    const products = query.data ?? [];
    return {
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      lowStock: products.filter((p) => p.stock < 10).length,
      totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    };
  }, [query.data]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await productService.remove(id);
      await client.invalidateQueries({ queryKey: ["admin-products"] });
      setDeleteConfirm(null);
      setSelectedProducts((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    await productService.duplicate(id);
    await client.invalidateQueries({ queryKey: ["admin-products"] });
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedProducts) {
        await productService.remove(id);
      }
      await client.invalidateQueries({ queryKey: ["admin-products"] });
      setSelectedProducts(new Set());
    } catch (error) {
      console.error("Failed to delete products:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map((p) => p.id)));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E5E5E5] pb-8"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] flex items-center gap-2">
            <Package className="size-4" />
            Catalogue
          </p>
          <h1
            className="mt-4 text-4xl text-[#1A1A1A] md:text-6xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            Products
          </h1>
          <p className="mt-4 text-[13px] text-[#777777] uppercase tracking-[0.1em]">
            Manage your product inventory and catalogue.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] transition-colors hover:bg-[#F9F9F9]">
            <Upload className="size-4" />
            Import
          </button>
          <button className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] transition-colors hover:bg-[#F9F9F9]">
            <Download className="size-4" />
            Export
          </button>
          <button
            className="flex items-center justify-center gap-2 border border-[#1A1A1A] bg-[#1A1A1A] px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-black/80 hover:border-black/80"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus className="size-4" />
            Add product
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            label: "Total Products",
            value: stats.total,
            icon: Boxes,
          },
          {
            label: "Active",
            value: stats.active,
            icon: CheckCircle2,
          },
          {
            label: "Low Stock",
            value: stats.lowStock,
            icon: AlertTriangle,
          },
          {
            label: "Inventory Value",
            value: formatPrice(stats.totalValue),
            icon: DollarSign,
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative border border-[#E5E5E5] bg-white p-6 transition-all hover:border-[#1A1A1A]"
          >
            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center justify-center">
                  <stat.icon className="size-5 text-[#1A1A1A]" />
                </div>
                {index === 0 && <TrendingUp className="size-4 text-emerald-600" />}
              </div>

              <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777]">
                {stat.label}
              </p>
              <p
                className="mt-2 text-3xl md:text-4xl text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
              >
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        {/* Search */}
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background/80 backdrop-blur-sm text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] transition-colors hover:bg-[#F9F9F9] flex-1 sm:flex-none"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-4" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-12 px-4 border border-[#E5E5E5] bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none flex-1 sm:flex-none appearance-none"
          >
            <option value="newest">NEWEST</option>
            <option value="name">NAME</option>
            <option value="price-asc">PRICE: LOW TO HIGH</option>
            <option value="price-desc">PRICE: HIGH TO LOW</option>
            <option value="stock">STOCK LEVEL</option>
          </select>
        </div>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 border border-[#E5E5E5] bg-[#F9F9F9]">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] block mb-3">Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {(["all", "active", "draft", "archived"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={cn(
                          "px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors border",
                          statusFilter === status
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                            : "bg-white text-[#777777] border-[#E5E5E5] hover:bg-[#F9F9F9] hover:text-[#1A1A1A]",
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedProducts.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-[#1A1A1A] bg-[#1A1A1A] text-white"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.1em]">
              {selectedProducts.size} products selected
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                className="flex-1 sm:flex-none px-6 h-10 border border-[#333333] bg-transparent text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-[#222222] transition-colors"
                onClick={() => setSelectedProducts(new Set())}
              >
                Clear selection
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 flex-1 sm:flex-none px-6 h-10 bg-red-600 text-white text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-red-700 transition-colors"
              >
                <Trash2 className="size-4" />
                Delete selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-x-auto border border-[#E5E5E5] bg-white"
      >
        <table className="w-full min-w-[800px] text-left">
          <thead className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
            <tr className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.size === paginatedProducts.length &&
                    paginatedProducts.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded-none border-[#E5E5E5] text-[#1A1A1A] focus:ring-[#1A1A1A]"
                />
              </th>
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {paginatedProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "hover:bg-[#F9F9F9] transition-colors",
                  selectedProducts.has(product.id) && "bg-[#F9F9F9]",
                )}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleSelectProduct(product.id)}
                    className="rounded-none border-[#E5E5E5] text-[#1A1A1A] focus:ring-[#1A1A1A]"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="size-16 object-cover border border-[#E5E5E5]"
                    />
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">{product.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#777777]">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[12px] font-bold text-[#1A1A1A]">{formatPrice(product.price)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[12px] font-bold",
                        product.stock < 10 ? "text-red-600" : "text-[#1A1A1A]",
                      )}
                    >
                      {product.stock}
                    </span>
                    {product.stock < 10 && <AlertTriangle className="size-4 text-red-600" />}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 border text-[10px] font-bold uppercase tracking-[0.1em]",
                      product.status === "active" &&
                        "border-emerald-200 bg-emerald-50 text-emerald-700",
                      product.status === "draft" &&
                        "border-yellow-200 bg-yellow-50 text-yellow-700",
                      product.status === "archived" &&
                        "border-[#E5E5E5] bg-[#F9F9F9] text-[#777777]",
                    )}
                  >
                    {product.status === "active" && <CheckCircle2 className="size-3" />}
                    {product.status === "draft" && <Clock className="size-3" />}
                    {product.status === "archived" && <Archive className="size-3" />}
                    {product.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      className="p-2 border border-transparent text-[#777777] hover:border-[#E5E5E5] hover:bg-[#F9F9F9] hover:text-[#1A1A1A] transition-all"
                      onClick={() => setSelectedProduct(product)}
                      title="View product"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      className="p-2 border border-transparent text-[#777777] hover:border-[#E5E5E5] hover:bg-[#F9F9F9] hover:text-[#1A1A1A] transition-all"
                      onClick={() => handleDuplicate(product.id)}
                      title="Duplicate product"
                    >
                      <Copy className="size-4" />
                    </button>
                    <button
                      className="p-2 border border-transparent text-[#777777] hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
                      onClick={() => setDeleteConfirm(product.id)}
                      title="Delete product"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {paginatedProducts.length === 0 && (
          <div className="p-12 text-center">
            <Package className="size-8 mx-auto mb-4 text-[#E5E5E5]" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777]">No products found</p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-2 border border-[#E5E5E5] bg-white hover:bg-[#F9F9F9] transition-colors disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "size-8 flex items-center justify-center border text-[11px] font-bold transition-colors",
                  currentPage === page
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                    : "border-[#E5E5E5] bg-white text-[#1A1A1A] hover:bg-[#F9F9F9]"
                )}
              >
                {page}
              </button>
            ))}
            <button
              className="p-2 border border-[#E5E5E5] bg-white hover:bg-[#F9F9F9] transition-colors disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close product details"
              className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#E5E5E5] bg-white p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 p-2 border border-transparent hover:border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors"
              >
                <X className="size-5 text-[#1A1A1A]" />
              </button>
              <div className="flex flex-col sm:flex-row gap-5">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="size-32 rounded-lg object-cover shadow-lg"
                />
                <div>
                  <p className="eyebrow">{selectedProduct.category}</p>
                  <h2 className="mt-2 font-display text-2xl sm:text-3xl">{selectedProduct.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>
              <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="border border-[#E5E5E5] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Price</p>
                  <p className="mt-2 text-[14px] font-bold text-[#1A1A1A]">{formatPrice(selectedProduct.price)}</p>
                </div>
                <div className="border border-[#E5E5E5] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Stock</p>
                  <p className="mt-2 text-[14px] font-bold text-[#1A1A1A]">{selectedProduct.stock}</p>
                </div>
                <div className="border border-[#E5E5E5] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">SKU</p>
                  <p className="mt-2 text-[14px] font-bold text-[#1A1A1A]">{selectedProduct.sku}</p>
                </div>
              </div>
              <div className="mt-10 flex justify-end pt-6 border-t border-[#E5E5E5]">
                <button
                  className="px-8 h-12 border border-[#E5E5E5] bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors"
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AddProductModal isOpen={showAddProduct} onClose={() => setShowAddProduct(false)} />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md border border-[#E5E5E5] bg-white p-8 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="size-10 bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="size-5 text-red-600" />
                </div>
                <div>
                  <h2
                    className="text-2xl text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
                  >
                    Delete product?
                  </h2>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex gap-4 pt-6 border-t border-[#E5E5E5]">
                <button
                  className="flex-1 h-12 border border-[#E5E5E5] bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-3 h-12 bg-red-600 text-[11px] font-bold uppercase tracking-[0.1em] text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add Product Modal Component
function AddProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const client = useQueryClient();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{id: string, slug: string, name: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use predefined collections instead of fetching old categories from the database
  useEffect(() => {
    if (isOpen) {
      const definedCategories = [
        { id: "828", slug: "828", name: "828" },
        { id: "ask-me-about-jesus", slug: "ask-me-about-jesus", name: "Ask Me About Jesus" },
        { id: "babe-i-love-jesus", slug: "babe-i-love-jesus", name: "Babe, I Love Jesus" },
        { id: "pretty-and-prayed-up", slug: "pretty-and-prayed-up", name: "Pretty And Prayed Up" },
        { id: "selah-girl-society", slug: "selah-girl-society", name: "Selah Girl Society" }
      ];
      setCategories(definedCategories);

      // Ensure categories exist in DB to prevent foreign key errors
      const ensureCategoriesInDb = async () => {
        try {
          const { data: existing } = await supabase.from("categories").select("slug");
          const existingSlugs = new Set(existing?.map(c => c.slug) || []);
          
          const missingCategories = definedCategories
            .filter(c => !existingSlugs.has(c.slug))
            .map(c => ({
              name: c.name,
              slug: c.slug,
              active: true
            }));
            
          if (missingCategories.length > 0) {
            await supabase.from("categories").insert(missingCategories);
          }
        } catch (e) {
          console.error("Failed to sync categories to db:", e);
        }
      };
      ensureCategoriesInDb();
    }
  }, [isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 5 - imageFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setImageFiles((prev) => [...prev, ...filesToAdd]);
    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const preview = prev[index];
      if (preview) URL.revokeObjectURL(preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async (productId: string): Promise<string[]> => {
    if (imageFiles.length === 0) return [];
    
    const uploaded: string[] = [];
    try {
      for (const file of imageFiles) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `products/${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        
        try {
          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(path, file, { 
              upsert: true,
              contentType: file.type
            });
            
          if (uploadError) {
            console.error("Image upload failed:", uploadError);
            continue;
          }
          
          const { data } = supabase.storage.from("product-images").getPublicUrl(path);
          if (data?.publicUrl) uploaded.push(data.publicUrl);
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }
      }
    } catch (error) {
      console.error("Upload process error:", error);
    }
    
    return uploaded;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const name = String(formData.get("name")).trim();
      const priceRaw = Number(formData.get("price"));
      const category = String(formData.get("category") || "").trim();
      
      if (!name) {
        setSubmitError("Product name is required.");
        setIsSubmitting(false);
        return;
      }
      
      if (!category) {
        setSubmitError("Please select a category.");
        setIsSubmitting(false);
        return;
      }
      
      if (Number.isNaN(priceRaw) || priceRaw < 0) {
        setSubmitError("Enter a valid price.");
        setIsSubmitting(false);
        return;
      }

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const id = `prd-${Date.now()}`;
      const SKU = String(formData.get("sku") || `SLH-${Date.now().toString(36).toUpperCase()}`);

      const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
      const sizeRangeRaw = String(formData.get("sizeRange") || "").trim();
      let sizes: string[];
      if (sizeRangeRaw) {
        if (sizeRangeRaw.includes("-") && !sizeRangeRaw.includes(",")) {
          const [from, to] = sizeRangeRaw.split("-").map((s) => s.trim().toUpperCase());
          const fromIdx = sizeOrder.indexOf(from);
          const toIdx = sizeOrder.indexOf(to);
          sizes = fromIdx >= 0 && toIdx >= 0 && fromIdx <= toIdx
            ? sizeOrder.slice(fromIdx, toIdx + 1)
            : sizeOrder;
        } else {
          sizes = sizeRangeRaw.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
        }
      } else {
        sizes = ["XS", "S", "M", "L", "XL", "XXL"];
      }

      let imageUrls: string[] = [];
      try {
        imageUrls = await uploadImages(id);
      } catch (error) {
        console.error("Image upload failed, using placeholder:", error);
      }
      
      if (imageUrls.length === 0) {
        imageUrls = ["https://placehold.co/600x800?text=Selah"];
      }

      const created = await productService.create({
        name,
        slug,
        description: String(formData.get("description") ?? ""),
        details: ["Designed for everyday wear"],
        category,
        subcategory: String(formData.get("subcategory") ?? ""),
        price: priceRaw,
        oldPrice: undefined,
        sku: SKU,
        stock: Number(formData.get("stock") ?? 0),
        sizes: sizes,
        colors: [],
        images: imageUrls,
        tags: [],
        rating: 0,
        reviewsCount: 0,
        featured: false,
        bestSeller: false,
        newArrival: true,
        status: "active",
      });

      client.setQueryData<Product[]>(["admin-products"], (prev) =>
        prev ? [created, ...prev] : [created],
      );
      client.setQueryData(["product", created.slug], created);

      onClose();
      setImageFiles([]);
      setImagePreviews([]);
      form.reset();
    } catch (error) {
      console.error("Failed to create product:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create product. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close add product"
            className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.form
            initial={{ scale: 0.98, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E5E5E5] bg-white p-8"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-8 border-b border-[#E5E5E5] pb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]">Catalogue</p>
                <h2
                  className="mt-4 text-3xl md:text-4xl text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
                >
                  Add New Product
                </h2>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                  Fill in the details below to create a new product
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-3 border border-transparent hover:border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors"
              >
                <X className="size-5 text-[#1A1A1A]" />
              </button>
            </div>

            {/* Error message */}
            {submitError && (
              <div className="mb-6 p-4 border border-red-200 bg-red-50 text-[11px] font-bold uppercase tracking-[0.1em] text-red-600">
                {submitError}
              </div>
            )}

            {/* Form Fields */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Product Name */}
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-3 block">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  required
                  placeholder="ENTER PRODUCT NAME"
                  className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-[12px] uppercase tracking-[0.1em] text-[#1A1A1A] placeholder:text-[#BBBBBB] focus:border-[#1A1A1A] focus:outline-none transition-colors"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-3 block">
                  Price (£) <span className="text-red-500">*</span>
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-[12px] uppercase tracking-[0.1em] text-[#1A1A1A] placeholder:text-[#BBBBBB] focus:border-[#1A1A1A] focus:outline-none transition-colors"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-3 block">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-[12px] uppercase tracking-[0.1em] text-[#1A1A1A] placeholder:text-[#BBBBBB] focus:border-[#1A1A1A] focus:outline-none transition-colors"
                />
              </div>

              {/* Size Range */}
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-3 block">
                  Size Range
                </label>
                <input
                  name="sizeRange"
                  type="text"
                  placeholder="E.G. XS-XL OR XS, S, M, L, XL"
                  className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-[12px] uppercase tracking-[0.1em] text-[#1A1A1A] placeholder:text-[#BBBBBB] focus:border-[#1A1A1A] focus:outline-none transition-colors"
                />
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                  Enter a range (XS-XL) or comma-separated sizes. Defaults to XS-XXL if left empty.
                </p>
              </div>

              {/* Category - Dynamic Dropdown */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-3 block">
                  Collection <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  defaultValue=""
                  className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none transition-colors appearance-none"
                >
                  <option value="" disabled>SELECT A COLLECTION</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory - General Category */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-3 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="subcategory"
                  required
                  defaultValue=""
                  className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none transition-colors appearance-none"
                >
                  <option value="" disabled>SELECT A CATEGORY</option>
                  <option value="tops">TOPS</option>
                  <option value="bottoms">BOTTOMS</option>
                  <option value="dresses">DRESSES</option>
                  <option value="outerwear">OUTERWEAR</option>
                  <option value="accessories">ACCESSORIES</option>
                  <option value="jewelry">JEWELRY</option>
                  <option value="bags">BAGS</option>
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-3 block">SKU</label>
                <input
                  name="sku"
                  placeholder="AUTO-GENERATED IF EMPTY"
                  className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-[12px] uppercase tracking-[0.1em] text-[#1A1A1A] placeholder:text-[#BBBBBB] focus:border-[#1A1A1A] focus:outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-3 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  placeholder="ENTER PRODUCT DESCRIPTION"
                  className="w-full min-h-32 px-4 py-4 border border-[#E5E5E5] bg-white text-[12px] tracking-[0.05em] text-[#1A1A1A] placeholder:text-[#BBBBBB] placeholder:uppercase placeholder:tracking-[0.1em] focus:border-[#1A1A1A] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-4 block">Product Images</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group border border-[#E5E5E5]">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 px-3 py-1 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-[0.2em]">
                          Main
                        </span>
                      )}
                    </div>
                  ))}

                  {imageFiles.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-32 border border-dashed border-[#BBBBBB] flex flex-col items-center justify-center gap-3 hover:border-[#1A1A1A] hover:bg-[#F9F9F9] transition-all"
                    >
                      <ImagePlus className="size-6 text-[#777777]" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#777777]">Add Image</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                  Upload up to 5 images. First image will be used as the main product image.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 h-12 border border-[#E5E5E5] bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 h-12 border border-[#1A1A1A] bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.1em] text-white hover:bg-black hover:border-black transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

