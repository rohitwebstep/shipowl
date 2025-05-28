INSERT INTO `supplierproduct` (`id`, `supplierId`, `productId`, `status`, `createdAt`, `createdBy`, `createdByRole`, `updatedAt`, `updatedBy`, `updatedByRole`, `deletedAt`, `deletedBy`, `deletedByRole`) VALUES
(1, 3, 1, 1, '2025-05-28 04:58:20.637', 3, 'supplier', '2025-05-28 04:58:20.639', NULL, NULL, NULL, NULL, NULL);

INSERT INTO `supplierproductvariant` (`id`, `supplierId`, `productId`, `productVariantId`, `supplierProductId`, `price`, `stock`, `status`, `createdAt`, `createdBy`, `createdByRole`, `updatedAt`, `updatedBy`, `updatedByRole`, `deletedAt`, `deletedBy`, `deletedByRole`) VALUES
(1, 3, 1, 1, 1, 99.99, 10, 1, '2025-05-28 04:58:20.646', 3, 'supplier', '2025-05-28 04:58:20.650', NULL, NULL, NULL, NULL, NULL);
