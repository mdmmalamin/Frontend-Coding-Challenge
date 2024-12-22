"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Product } from "@/types";
import { BackToHome } from "@/components/backToHome/backToHome";
import { PaginationControls } from "@/views/products/paginationControls/paginationControls";
import { usePagination } from "@/hooks/usePagination";
import { PRODUCTS_DATA } from "@/data/productsData";
import ProductList from "./productList/productList";
import { useRouter, useSearchParams } from "next/navigation";
import ProductModal from "./productModal/productModal";

export const Products: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handlePageChange,
  } = usePagination({ items: PRODUCTS_DATA, itemsPerPage: 5 });

  const handleOpenModal = useCallback(
    (product: Product) => {
      setSelectedProduct(product);

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("productId", product.id);
      router.push(`/products?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("productId");
    router.push(`/products?${newParams.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const productId = searchParams.get("productId");
    if (productId) {
      const product = PRODUCTS_DATA.find((p) => p.id === productId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [searchParams]);

  return (
    <div>
      <BackToHome />
      <ProductList products={paginatedProducts} onOpenModal={handleOpenModal} />
      <div className="h-4" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};
