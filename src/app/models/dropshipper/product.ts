import prisma from "@/lib/prisma";
import { logMessage } from "@/utils/commonUtils";

interface Product {
    productId?: number;
    supplierId?: number,
    supplierProductId: number,
    dropshipperId: number;
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

export const getSupplierProductById = async (id: number, includeOtherSuppliers: boolean = false) => {
    try {
        const supplierProduct = await prisma.supplierProduct.findFirst({
            where: {
                id,
            },
            include: {
                product: {
                    include: {
                        brand: true,
                        category: true,
                        variants: true,
                    }
                },
                supplier: true
            }
        });

        if (!supplierProduct) {
            return {
                status: false,
                message: "Supplier product not found.",
                supplierProduct: null,
                otherSuppliers: [],
            };
        }

        let otherSuppliers: { id: number; productId: number; supplierId: number }[] = [];

        if (includeOtherSuppliers) {
            otherSuppliers = await prisma.supplierProduct.findMany({
                where: {
                    productId: supplierProduct.productId,
                    supplierId: { not: supplierProduct.supplierId },
                },
                include: {
                    supplier: true,
                }
            });
        }

        return {
            status: true,
            message: "Supplier product fetched successfully.",
            supplierProduct: serializeBigInt(supplierProduct),
            otherSuppliers: serializeBigInt(otherSuppliers),
        };
    } catch (error) {
        console.error("❌ Error in getSupplierProductById:", error);
        return {
            status: false,
            message: "Internal server error.",
            supplierProduct: null,
            otherSuppliers: [],
        };
    }
};

export async function createDropshipperProduct(
    dropshipperId: number,
    dropshipperRole: string,
    product: Product
) {
    try {
        const {
            supplierProductId,
            stock,
            price,
            status,
            createdBy,
            createdByRole,
        } = product;

        const supplierProductResult = await getSupplierProductById(
            supplierProductId
        );

        if (
            !supplierProductResult.status ||
            !supplierProductResult.supplierProduct
        ) {
            return {
                status: false,
                message: "Invalid supplier product.",
            };
        }

        const supplierProduct = supplierProductResult.supplierProduct;

        const newProduct = await prisma.dropshipperProduct.create({
            data: {
                productId: supplierProduct.productId,
                supplierId: supplierProduct.supplierId,
                supplierProductId,
                dropshipperId,
                stock,
                price,
                status,
                createdBy,
                createdByRole,
                createdAt: new Date(),
            },
        });

        return {
            status: true,
            product: serializeBigInt(newProduct),
        };
    } catch (error) {
        console.error("❌ Error creating dropshipper product:", error);
        return {
            status: false,
            message: "Internal Server Error",
        };
    }
}

export const updateDropshipperProduct = async (
    dropshipperId: number,
    dropshipperRole: string,
    dropshipperProductId: number,
    product: Product
) => {
    try {
        const {
            dropshipperId,
            stock,
            price,
            status,
            updatedBy,
            updatedByRole
        } = product;

        // Fetch existing product once
        const productResult = await checkDropshipperProductForDropshipper(dropshipperId, dropshipperProductId);
        if (!productResult?.status || !productResult.existsInDropshipperProduct) {
            return {
                status: false,
                message: productResult.message || "Product not found.",
            };
        }

        // Update the product details
        const updatedProduct = await prisma.dropshipperProduct.update({
            where: { id: dropshipperProductId },
            data: {
                productId: productResult?.dropshipperProduct?.productId,
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
    dropshipperId: number,
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
            products = await prisma.supplierProduct.findMany({
                where: baseFilters,
                orderBy: { id: "desc" },
                include: {
                    product: {
                        include: {
                            variants: true,
                            category: true,
                            brand: true,
                        }
                    }
                },
            });
        }

        if (type === "my") {
            products = await prisma.dropshipperProduct.findMany({
                where: { ...baseFilters, dropshipperId },
                include: { product: { include: { variants: true } } },
                orderBy: { id: "desc" },
            });
        }

        if (type === "notmy") {
            const myProductIds = await prisma.dropshipperProduct.findMany({
                where: { dropshipperId },
                select: { productId: true },
            }).then(data => data.map(d => d.productId));

            const supplierProducts = await prisma.supplierProduct.findMany({
                where: {
                    ...baseFilters,
                    id: { notIn: myProductIds.length ? myProductIds : [0] },
                },
                orderBy: { id: "desc" },
                include: {
                    product: {
                        include: {
                            variants: true,
                            category: true,
                            brand: true,
                        }
                    }
                },
            });

            // For each supplierProduct, find the lowest price from other suppliers for the same product
            const productsWithLowestPrice = await Promise.all(
                supplierProducts.map(async (sp) => {
                    const lowestPriceDropshipper = await prisma.dropshipperProduct.findFirst({
                        where: {
                            productId: sp.productId,
                        },
                        orderBy: { price: "asc" },
                        select: { price: true },
                    });

                    return {
                        ...sp,
                        lowestOtherDropshipperPrice: lowestPriceDropshipper ? lowestPriceDropshipper.price : null,
                    };
                })
            );

            products = productsWithLowestPrice;
        }

        return { status: true, products };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { status: false, message: "Error fetching products" };
    }
};

export const getProductsByStatus = async (
    type: "all" | "my" | "notmy",
    dropshipperId: number,
    status: "active" | "inactive" | "deleted" | "notDeleted"
) => {
    try {
        console.log(`type - ${type} // dropshipperId - ${dropshipperId} // status - ${status}`);
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
            products = await prisma.supplierProduct.findMany({
                where: statusCondition,
                orderBy: { id: "desc" },
                include: {
                    product: {
                        include: {
                            variants: true,
                            category: true,
                            brand: true,
                        }
                    }
                },
            });
        } else if (type === "my") {
            products = await prisma.dropshipperProduct.findMany({
                where: { ...statusCondition, dropshipperId },
                include: { product: { include: { variants: true } } },
                orderBy: { id: "desc" },
            });
        } else if (type === "notmy") {
            const myProductIds = await prisma.dropshipperProduct
                .findMany({
                    where: { dropshipperId },
                    select: { productId: true },
                })
                .then((data) => data.map((d) => d.productId));

            const supplierProducts = await prisma.supplierProduct.findMany({
                where: {
                    ...statusCondition,
                    id: { notIn: myProductIds.length ? myProductIds : [0] },
                },
                orderBy: { id: "desc" },
                include: {
                    product: {
                        include: {
                            variants: true,
                            category: true,
                            brand: true,
                        }
                    }
                },
            });

            // For each supplierProduct, find the lowest price from other suppliers for the same product
            const productsWithLowestPrice = await Promise.all(
                supplierProducts.map(async (sp) => {
                    const lowestPriceDropshipper = await prisma.dropshipperProduct.findFirst({
                        where: {
                            productId: sp.productId,
                        },
                        orderBy: { price: "asc" },
                        select: { price: true },
                    });

                    return {
                        ...sp,
                        lowestOtherDropshipperPrice: lowestPriceDropshipper ? lowestPriceDropshipper.price : null,
                    };
                })
            );

            products = productsWithLowestPrice;
        } else {
            return { status: false, message: "Invalid type parameter", products: [] };
        }

        return { status: true, message: "Products fetched successfully", products: serializeBigInt(products) };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { status: false, message: "Error fetching products", products: [] };
    }
};


export const checkProductForDropshipper = async (
    dropshipperId: number,
    supplierProductId: number
) => {
    try {
        // 1. Check if product exists
        const product = await prisma.supplierProduct.findUnique({
            where: { id: supplierProductId },
            include: {
                product: {
                    include: {
                        variants: true,
                        category: true,
                        brand: true,
                    }
                }
            },
        });

        if (!product) {
            return {
                status: false,
                message: "Product not found",
                existsInProduct: false,
                existsInDropshipperProduct: false,
            };
        }

        // 2. Check if product exists for the given dropshipper
        const dropshipperProduct = await prisma.dropshipperProduct.findFirst({
            where: {
                dropshipperId,
                supplierProductId,
            },
            select: { id: true },
        });

        if (!dropshipperProduct) {
            return {
                status: true,
                message: "Product exists but is not assigned to the dropshipper",
                existsInProduct: true,
                existsInDropshipperProduct: false,
                product,
            };
        }

        return {
            status: true,
            message: "Product exists and is assigned to the dropshipper",
            existsInProduct: true,
            existsInDropshipperProduct: true,
            product,
        };
    } catch (error) {
        console.error("Error checking product for dropshipper:", error);
        return {
            status: false,
            message: "Internal server error",
            existsInProduct: false,
            existsInDropshipperProduct: false,
        };
    }
};

export const checkDropshipperProductForDropshipper = async (
    dropshipperId: number,
    dropshipperProductId: number
) => {
    try {
        // Check if the dropshipper product exists for the given dropshipper
        const dropshipperProduct = await prisma.dropshipperProduct.findFirst({
            where: {
                id: dropshipperProductId,
                dropshipperId,
            },
        });

        if (!dropshipperProduct) {
            return {
                status: false,
                message: "Dropshipper product not found or not assigned to the dropshipper.",
                existsInDropshipperProduct: false,
                dropshipperProduct: null,
            };
        }

        return {
            status: true,
            message: "Dropshipper product exists and is assigned to the dropshipper.",
            existsInDropshipperProduct: true,
            dropshipperProduct,
        };
    } catch (error) {
        console.error("❌ Error checking dropshipper product for dropshipper:", error);
        return {
            status: false,
            message: "Internal server error while checking dropshipper product.",
            existsInDropshipperProduct: false,
            dropshipperProduct: null,
        };
    }
};

// 🟢 RESTORE (Restores a soft-deleted product and its variants by setting deletedAt to null)
export const restoreDropshipperProduct = async (dropshipperId: number, dropshipperRole: string, id: number) => {
    try {
        // Restore the product
        const restoredDropshipperProduct = await prisma.dropshipperProduct.update({
            where: { id },
            data: {
                deletedBy: null,      // Reset the deletedBy field
                deletedAt: null,      // Set deletedAt to null
                deletedByRole: null,  // Reset the deletedByRole field
                updatedBy: dropshipperId,   // Record the user restoring the product
                updatedByRole: dropshipperRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field
            },
        });

        return {
            status: true,
            message: "Dropshipper Product restored successfully",
            restoredDropshipperProduct: serializeBigInt(restoredDropshipperProduct)
        };
    } catch (error) {
        console.error("❌ restoreProduct Error:", error);
        return { status: false, message: "Error restoring Dropshipper Product" };
    }
};

export const softDeleteDropshipperProduct = async (dropshipperId: number, dropshipperRole: string, id: number) => {
    try {
        // Soft delete the dropshipperProduct
        const updatedDropshipperProduct = await prisma.dropshipperProduct.update({
            where: { id },
            data: {
                deletedBy: dropshipperId,
                deletedAt: new Date(),
                deletedByRole: dropshipperRole,
            },
        });

        return {
            status: true,
            message: "Product and variants soft deleted successfully",
            updatedDropshipperProduct
        };
    } catch (error) {
        console.error("❌ softDeleteDropshipperProduct Error:", error);
        return { status: false, message: "Error soft deleting dropshipper product" };
    }
};

// 🔴 DELETE
export const deleteDropshipperProduct = async (id: number) => {
    try {
        await prisma.dropshipperProduct.delete({ where: { id } });
        return { status: true, message: "Dropshipper Product deleted successfully" };
    } catch (error) {
        console.error("❌ deleteProduct Error:", error);
        return { status: false, message: "Error deleting dropshipper product" };
    }
};