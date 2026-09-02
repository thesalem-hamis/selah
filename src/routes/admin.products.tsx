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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <p className="eyebrow text-primary flex items-center gap-2">
            <Package className="size-4" />
            Catalogue
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your product inventory and catalogue
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 transition-all">
            <Upload className="size-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 transition-all">
            <Download className="size-4" />
            Export
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus className="size-4" />
            Add product
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            label: "Total Products",
            value: stats.total,
            icon: Boxes,
            color: "from-blue-500 to-cyan-500",
            shadow: "shadow-blue-500/20",
          },
          {
            label: "Active",
            value: stats.active,
            icon: CheckCircle2,
            color: "from-emerald-500 to-green-500",
            shadow: "shadow-emerald-500/20",
          },
          {
            label: "Low Stock",
            value: stats.lowStock,
            icon: AlertTriangle,
            color: "from-orange-500 to-amber-500",
            shadow: "shadow-orange-500/20",
          },
          {
            label: "Inventory Value",
            value: formatPrice(stats.totalValue),
            icon: DollarSign,
            color: "from-purple-500 to-pink-500",
            shadow: "shadow-purple-500/20",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative overflow-hidden p-5 rounded-xl border border-border bg-background/80 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/10" />
            <div className="relative flex items-center justify-between">
              <div
                className={cn(
                  "size-10 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg",
                  stat.color,
                  stat.shadow,
                )}
              >
                <stat.icon className="size-5 text-white" />
              </div>
              {index === 0 && <TrendingUp className="size-4 text-emerald-500" />}
            </div>
            <p className="relative mt-3 text-2xl font-semibold">{stat.value}</p>
            <p className="relative text-sm text-muted-foreground">{stat.label}</p>
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
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 flex-1 sm:flex-none hover:bg-primary/5 transition-all"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-4" />
            Filters
          </Button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-10 px-3 rounded-lg border border-input bg-background/80 backdrop-blur-sm text-sm focus:border-primary focus:outline-none flex-1 sm:flex-none"
          >
            <option value="newest">Newest</option>
            <option value="name">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock">Stock Level</option>
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
            <div className="p-4 rounded-lg border border-border bg-muted/30 backdrop-blur-sm">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {(["all", "active", "draft", "archived"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-all",
                          statusFilter === status
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "bg-background border border-border hover:bg-muted",
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
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20 backdrop-blur-sm"
          >
            <p className="text-sm">
              <span className="font-semibold">{selectedProducts.size}</span> products selected
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => setSelectedProducts(new Set())}
              >
                Clear selection
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="gap-2 flex-1 sm:flex-none"
              >
                <Trash2 className="size-4" />
                Delete selected
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-x-auto rounded-xl border border-border bg-background/80 backdrop-blur-sm shadow-sm"
      >
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr className="text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.size === paginatedProducts.length &&
                    paginatedProducts.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-input"
                />
              </th>
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "hover:bg-muted/30 transition-colors",
                  selectedProducts.has(product.id) && "bg-primary/5",
                )}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleSelectProduct(product.id)}
                    className="rounded border-input"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="size-12 rounded-lg object-cover shadow-sm"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-medium",
                        product.stock < 10 ? "text-red-600" : "text-foreground",
                      )}
                    >
                      {product.stock}
                    </span>
                    {product.stock < 10 && <AlertTriangle className="size-4 text-red-500" />}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize",
                      product.status === "active" &&
                        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
                      product.status === "draft" &&
                        "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
                      product.status === "archived" &&
                        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                    )}
                  >
                    {product.status === "active" && <CheckCircle2 className="size-3" />}
                    {product.status === "draft" && <Clock className="size-3" />}
                    {product.status === "archived" && <Archive className="size-3" />}
                    {product.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-muted transition-all"
                      onClick={() => setSelectedProduct(product)}
                      title="View product"
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-muted transition-all"
                      onClick={() => handleDuplicate(product.id)}
                      title="Duplicate product"
                    >
                      <Copy className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-all"
                      onClick={() => setDeleteConfirm(product.id)}
                      title="Delete product"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {paginatedProducts.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Package className="size-12 mx-auto mb-3 opacity-40" />
            <p>No products found</p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(currentPage === page && "bg-primary shadow-lg shadow-primary/20")}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
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
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="size-5" />
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
              <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="mt-1 font-medium">{formatPrice(selectedProduct.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stock</p>
                  <p className="mt-1 font-medium">{selectedProduct.stock}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">SKU</p>
                  <p className="mt-1 font-medium">{selectedProduct.sku}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                  Close
                </Button>
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
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                  <AlertTriangle className="size-5 text-red-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Delete product?</h2>
                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
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
                </Button>
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

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const { data, error } = await supabase
            .from("categories")
            .select("id, slug, name")
            .eq("active", true)
            .order("name");
          
          if (error) {
            console.error("Failed to fetch categories:", error);
          } else {
            setCategories(data || []);
          }
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      };
      
      fetchCategories();
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
      const sku = String(formData.get("sku") || `SLH-${Date.now().toString(36).toUpperCase()}`);

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
        subcategory: "New release",
        price: Math.round(priceRaw * 100),
        oldPrice: undefined,
        sku,
        stock: Number(formData.get("stock") ?? 0),
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: [
          { name: "Olive", hex: "#6E7A50" },
          { name: "Cream", hex: "#F1E9D9" },
        ],
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.form
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="eyebrow text-primary">Catalogue</p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl">Add New Product</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fill in the details below to create a new product
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Error message */}
            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {submitError}
              </div>
            )}

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Product Name */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-2 block">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  required
                  placeholder="Enter product name"
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price (£) <span className="text-red-500">*</span>
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>

              {/* Category - Dynamic Dropdown */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  defaultValue=""
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className="text-sm font-medium mb-2 block">SKU</label>
                <input
                  name="sku"
                  placeholder="Auto-generated if left empty"
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-2 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  placeholder="Enter product description"
                  className="w-full min-h-24 px-4 py-3 rounded-lg border border-input bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-2 block">Product Images</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}

                  {imageFiles.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <ImagePlus className="size-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add Image</span>
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
                <p className="mt-2 text-xs text-muted-foreground">
                  Upload up to 5 images. First image will be used as the main product image.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all w-full sm:w-auto"
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
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
