import prisma from "@/lib/prisma";
import path from "path";
import { deleteFile } from '@/utils/saveFiles';
import { logMessage } from "@/utils/commonUtils";

interface Product {
    productId: number;
    supplierId: number;
    stock: number;
    price: number;
    status: boolean;
    createdBy?: number | null;
    createdByRole?: string | null;
    updatedBy?: number | null;
    updatedAt?: Date;
    updatedByRole?: string | null;
    deletedBy?: number | null;
    deletedAt?: Date;
    deletedByRole?: string | null;
}

type ProductFilters = {
    categoryId?: number;
    brandId?: number;
};

type ProductType = "all" | "my" | "notmy";
type ProductStatus = "active" | "inactive" | "deleted" | "notDeleted";

const serializeBigInt = <T>(obj: T): T => {
    // If it's an array, recursively apply serializeBigInt to each element
    if (Array.isArray(obj)) {
        return obj.map(serializeBigInt) as T;
    }
    // If it's an object, recursively apply serializeBigInt to each key-value pair
    else if (obj && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        ) as T;
    }
    // If it's a BigInt, convert it to a string
    else if (typeof obj === 'bigint') {
        return obj.toString() as T;
    }

    // Return the value unchanged if it's not an array, object, or BigInt
    return obj;
};

export async function createSupplierProduct(supplierId: number, supplierRole: string, product: Product) {
    try {
        const {
            productId,
            supplierId,
            stock,
            price,
            status,
            createdBy,
            createdByRole
        } = product;

        // Create the product in the database
        const newProduct = await prisma.supplierProduct.create({
            data: {
                productId,
                supplierId,
                stock,
                price,
                status,
                createdBy,
                createdByRole,
                createdAt: new Date(),
            },
        });

        return { status: true, product: serializeBigInt(newProduct) };
    } catch (error) {
        console.error(`Error creating product:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}

export const updateSupplierProduct = async (
    supplierId: number,
    supplierRole: string,
    supplierProductId: number,
    product: Product
) => {
    try {
        const {
            productId,
            supplierId,
            stock,
            price,
            status,
            updatedBy,
            updatedByRole
        } = product;

        // Fetch existing product once
        const productResult = await checkSupplierProductForSupplier(supplierId, supplierProductId);
        if (!productResult?.status || !productResult.existsInSupplierProduct) {
            return {
                status: false,
                message: productResult.message || "Product not found.",
            };
        }

        // Update the product details
        const updatedProduct = await prisma.supplierProduct.update({
            where: { id: supplierProductId },
            data: {
                productId: productResult?.supplierProduct?.productId,
                supplierId,
                stock,
                price,
                status,
                updatedBy,
                updatedByRole,
                updatedAt: new Date(),
            },
        });

        const sanitizedProducts = serializeBigInt(updatedProduct);
        logMessage('debug', 'fetched products :', sanitizedProducts);

        return { status: true, product: sanitizedProducts };
    } catch (error) {
        console.error("❌ updateProduct Error:", error);
        return { status: false, message: "Error updating product" };
    }
};

export const getProductsByFiltersAndStatus = async (
    type: ProductType,
    filters: ProductFilters,
    supplierId: number,
    status: ProductStatus
) => {
    try {
        const statusCondition = (() => {
            switch (status) {
                case "active": return { status: true, deletedAt: null };
                case "inactive": return { status: false, deletedAt: null };
                case "deleted": return { deletedAt: { not: null } };
                case "notDeleted": return { deletedAt: null };
                default: throw new Error("Invalid status");
            }
        })();

        const baseFilters = {
            ...statusCondition,
            ...(filters.categoryId && { categoryId: filters.categoryId }),
            ...(filters.brandId && { brandId: filters.brandId }),
        };

        let products;

        if (type === "all") {
            products = await prisma.product.findMany({
                where: baseFilters,
                orderBy: { id: "desc" },
                include: { variants: true },
            });
        }

        if (type === "my") {
            const supplierProducts = await prisma.supplierProduct.findMany({
                where: { ...baseFilters, supplierId },
                include: { product: { include: { variants: true } } },
                orderBy: { id: "desc" },
            });
            products = supplierProducts.map((sp) => sp.product);
        }

        if (type === "notmy") {
            const myProductIds = await prisma.supplierProduct.findMany({
                where: { supplierId },
                select: { productId: true },
            }).then(data => data.map(d => d.productId));

            products = await prisma.product.findMany({
                where: {
                    ...baseFilters,
                    id: { notIn: myProductIds.length ? myProductIds : [0] },
                },
                orderBy: { id: "desc" },
                include: { variants: true },
            });
        }

        return { status: true, products };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { status: false, message: "Error fetching products" };
    }
};

export const getProductsByStatus = async (
    type: "all" | "my" | "notmy",
    supplierId: number,
    status: "active" | "inactive" | "deleted" | "notDeleted"
) => {
    try {
        console.log(`type - ${type} // supplierId - ${supplierId} // status - ${status}`);
        const statusCondition = (() => {
            switch (status) {
                case "active":
                    return { status: true, deletedAt: null };
                case "inactive":
                    return { status: false, deletedAt: null };
                case "deleted":
                    return { deletedAt: { not: null } };
                case "notDeleted":
                    return { deletedAt: null };
                default:
                    throw new Error("Invalid status");
            }
        })();

        let products = [];
        if (type === "all") {
            products = await prisma.product.findMany({
                where: statusCondition,
                orderBy: { id: "desc" },
                include: { variants: true },
            });
        } else if (type === "my") {
            const supplierProducts = await prisma.supplierProduct.findMany({
                where: { ...statusCondition, supplierId },
                include: { product: { include: { variants: true } } },
                orderBy: { id: "desc" },
            });
            products = supplierProducts.map((sp) => sp.product);
        } else if (type === "notmy") {
            const myProductIds = await prisma.supplierProduct
                .findMany({
                    where: { supplierId },
                    select: { productId: true },
                })
                .then((data) => data.map((d) => d.productId));

            products = await prisma.product.findMany({
                where: {
                    ...statusCondition,
                    id: { notIn: myProductIds.length ? myProductIds : [0] },
                },
                orderBy: { id: "desc" },
                include: { variants: true },
            });
        } else {
            return { status: false, message: "Invalid type parameter", products: [] };
        }

        return { status: true, message: "Products fetched successfully", products: serializeBigInt(products) };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { status: false, message: "Error fetching products", products: [] };
    }
};


export const checkProductForSupplier = async (
    supplierId: number,
    productId: number
) => {
    try {
        // 1. Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { variants: true }, // optional: remove if you don't need variants
        });

        if (!product) {
            return {
                status: false,
                message: "Product not found",
                existsInProduct: false,
                existsInSupplierProduct: false,
            };
        }

        // 2. Check if product exists for the given supplier
        const supplierProduct = await prisma.supplierProduct.findFirst({
            where: {
                supplierId,
                productId,
            },
            select: { id: true },
        });

        if (!supplierProduct) {
            return {
                status: true,
                message: "Product exists but is not assigned to the supplier",
                existsInProduct: true,
                existsInSupplierProduct: false,
                product,
            };
        }

        return {
            status: true,
            message: "Product exists and is assigned to the supplier",
            existsInProduct: true,
            existsInSupplierProduct: true,
            product,
        };
    } catch (error) {
        console.error("Error checking product for supplier:", error);
        return {
            status: false,
            message: "Internal server error",
            existsInProduct: false,
            existsInSupplierProduct: false,
        };
    }
};

export const checkSupplierProductForSupplier = async (
    supplierId: number,
    supplierProductId: number
) => {
    try {
        // Check if the supplier product exists for the given supplier
        const supplierProduct = await prisma.supplierProduct.findFirst({
            where: {
                id: supplierProductId,
                supplierId,
            },
        });

        if (!supplierProduct) {
            return {
                status: true,
                message: "Supplier product not found or not assigned to the supplier.",
                existsInSupplierProduct: false,
                supplierProduct: null,
            };
        }

        return {
            status: true,
            message: "Supplier product exists and is assigned to the supplier.",
            existsInSupplierProduct: true,
            supplierProduct,
        };
    } catch (error) {
        console.error("❌ Error checking supplier product for supplier:", error);
        return {
            status: false,
            message: "Internal server error while checking supplier product.",
            existsInSupplierProduct: false,
            supplierProduct: null,
        };
    }
};

// 🟢 RESTORE (Restores a soft-deleted product and its variants by setting deletedAt to null)
export const restoreSupplierProduct = async (supplierId: number, supplierRole: string, id: number) => {
    try {
        // Restore the product
        const restoredSupplierProduct = await prisma.supplierProduct.update({
            where: { id },
            data: {
                deletedBy: null,      // Reset the deletedBy field
                deletedAt: null,      // Set deletedAt to null
                deletedByRole: null,  // Reset the deletedByRole field
                updatedBy: supplierId,   // Record the user restoring the product
                updatedByRole: supplierRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field
            },
        });

        return {
            status: true,
            message: "Supplier Product restored successfully",
            restoredSupplierProduct: serializeBigInt(restoredSupplierProduct)
        };
    } catch (error) {
        console.error("❌ restoreProduct Error:", error);
        return { status: false, message: "Error restoring Supplier Product" };
    }
};

export const softDeleteSupplierProduct = async (supplierId: number, supplierRole: string, id: number) => {
    try {
        // Soft delete the supplierProduct
        const updatedSupplierProduct = await prisma.supplierProduct.update({
            where: { id },
            data: {
                deletedBy: supplierId,
                deletedAt: new Date(),
                deletedByRole: supplierRole,
            },
        });

        return {
            status: true,
            message: "Product and variants soft deleted successfully",
            updatedSupplierProduct
        };
    } catch (error) {
        console.error("❌ softDeleteSupplierProduct Error:", error);
        return { status: false, message: "Error soft deleting supplier product" };
    }
};

// 🔴 DELETE
export const deleteSupplierProduct = async (id: number) => {
    try {
        await prisma.supplierProduct.delete({ where: { id } });
        return { status: true, message: "Supplier Product deleted successfully" };
    } catch (error) {
        console.error("❌ deleteProduct Error:", error);
        return { status: false, message: "Error deleting supplier product" };
    }
};