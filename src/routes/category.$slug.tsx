import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Filter, 
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { CatalogPage } from "@/components/store/CatalogPage";
import { categoryService, isCatchAllCategory } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ");
    const title = `${name.replace(/\b\w/g, (c) => c.toUpperCase())} - Selah`;
    return {
      meta: [
        { title },
        { name: "description", content: `Shop Selah ${name}: modest, drape-first pieces cut in small runs in UK.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `Shop the Selah ${name} edit.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryRoute,
});

function CategoryRoute() {
  const { slug } = Route.useParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const category = useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoryService.bySlug(slug),
  });

  const categoryName = category.data?.name ?? slug.replace(/-/g, " ");
  const formattedName = categoryName.replace(/\b\w/g, (c) => c.toUpperCase());

  // Scroll to top on category change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  return (
    <StoreLayout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1 }}
            className="absolute -top-20 -right-20 size-96 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -bottom-40 -left-20 size-[500px] rounded-full bg-primary/20 blur-3xl"
          />
        </div>

        <div className="container-page relative py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
            >
              <span className="hover:text-foreground transition-colors cursor-pointer">Home</span>
              <ArrowRight className="size-3" />
              <span className="hover:text-foreground transition-colors cursor-pointer">Categories</span>
              <ArrowRight className="size-3" />
              <span className="text-foreground font-medium">{formattedName}</span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="size-4" />
                Collection
              </span>
              <h1 className="mt-4 font-display text-5xl md:text-6xl lg:text-7xl leading-tight">
                {formattedName}
              </h1>
            </motion.div>

            {/* Description */}
            {category.data?.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
              >
                {category.data.description}
              </motion.p>
            )}

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-6"
            >
              {[
                { label: 'Pieces', value: '45+' },
                { label: 'Avg. Rating', value: '4.8' },
                { label: 'Ships From', value: 'UK' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  {index < 2 && (
                    <div className="h-8 w-px bg-border" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50"
      >
        <div className="container-page py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden gap-2"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter className="size-4" />
              Filters
            </Button>

            {/* Result Count */}
            <p className="text-sm text-muted-foreground hidden sm:block">
              Showing <span className="font-medium text-foreground">all</span> pieces
            </p>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                  <SlidersHorizontal className="size-4" />
                  Sort by
                  <ChevronDown className="size-3 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-background shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'].map((option) => (
                    <button
                      key={option}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 rounded-lg border border-border p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === 'grid' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-muted'
                  )}
                >
                  <Grid3X3 className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === 'list' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-muted'
                  )}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Catalog */}
      <CatalogPage
        eyebrow="Collection"
        title={category.data?.name ?? slug.replace(/-/g, " ")}
        description={category.data?.description ?? ""}
        baseFilters={isCatchAllCategory(slug) ? {} : { category: slug }}
        viewMode={viewMode}
      />

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-80 bg-background shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="p-6">
                {/* Filter options would go here */}
                <p className="text-sm text-muted-foreground">
                  Filter options coming soon...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StoreLayout>
  );
}