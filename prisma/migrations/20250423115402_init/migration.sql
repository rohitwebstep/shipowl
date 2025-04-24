-- CreateTable
CREATE TABLE `emailConfig` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `panel` VARCHAR(191) NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `html_template` LONGTEXT NULL,
    `smtp_host` VARCHAR(191) NOT NULL,
    `smtp_secure` BOOLEAN NOT NULL,
    `smtp_port` INTEGER NOT NULL,
    `smtp_username` VARCHAR(191) NOT NULL,
    `smtp_password` VARCHAR(191) NOT NULL,
    `from_email` VARCHAR(191) NOT NULL,
    `from_name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,

    INDEX `emailConfig_createdBy_idx`(`createdBy`),
    INDEX `emailConfig_updatedBy_idx`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `pr_token` VARCHAR(191) NULL,
    `pr_expires_at` DATETIME(3) NULL,
    `pr_last_reset` DATETIME(3) NULL,

    UNIQUE INDEX `admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adminStaff` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `pr_token` VARCHAR(191) NULL,
    `pr_expires_at` DATETIME(3) NULL,
    `pr_last_reset` DATETIME(3) NULL,

    UNIQUE INDEX `adminStaff_admin_id_key`(`admin_id`),
    UNIQUE INDEX `adminStaff_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loginLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `adminRole` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `response` VARCHAR(191) NULL,
    `ipv4` VARCHAR(191) NULL,
    `ipv6` VARCHAR(191) NULL,
    `internetServiceProvider` VARCHAR(191) NULL,
    `clientInformation` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deletedBy` INTEGER NULL,
    `deletedByRole` VARCHAR(191) NULL,

    INDEX `loginLog_adminId_idx`(`adminId`),
    INDEX `loginLog_adminRole_idx`(`adminRole`),
    INDEX `loginLog_action_idx`(`action`),
    INDEX `loginLog_createdAt_idx`(`createdAt`),
    INDEX `loginLog_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activityLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `adminRole` VARCHAR(191) NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `endpoint` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `payload` LONGTEXT NULL,
    `response` LONGTEXT NULL,
    `result` BOOLEAN NOT NULL,
    `data` LONGTEXT NULL,
    `ipv4` VARCHAR(191) NULL,
    `ipv6` VARCHAR(191) NULL,
    `internetServiceProvider` VARCHAR(191) NULL,
    `clientInformation` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deletedBy` INTEGER NULL,
    `deletedByRole` VARCHAR(191) NULL,

    INDEX `activityLog_adminId_idx`(`adminId`),
    INDEX `activityLog_adminRole_idx`(`adminRole`),
    INDEX `activityLog_module_idx`(`module`),
    INDEX `activityLog_action_idx`(`action`),
    INDEX `activityLog_createdAt_idx`(`createdAt`),
    INDEX `activityLog_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `iso3` VARCHAR(191) NULL,
    `iso2` VARCHAR(191) NULL,
    `phonecode` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NULL,
    `currencyName` VARCHAR(191) NULL,
    `currencySymbol` VARCHAR(191) NULL,
    `nationality` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deletedBy` INTEGER NULL,
    `deletedByRole` VARCHAR(191) NULL,

    INDEX `country_createdBy_idx`(`createdBy`),
    INDEX `country_updatedBy_idx`(`updatedBy`),
    INDEX `country_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `state` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `countryId` BIGINT NOT NULL,
    `iso2` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deletedBy` INTEGER NULL,
    `deletedByRole` VARCHAR(191) NULL,

    INDEX `state_countryId_idx`(`countryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `stateId` BIGINT NOT NULL,
    `countryId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deletedBy` INTEGER NULL,
    `deletedByRole` VARCHAR(191) NULL,

    INDEX `city_stateId_idx`(`stateId`),
    INDEX `city_countryId_idx`(`countryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warehouse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `gst_number` VARCHAR(191) NOT NULL,
    `contact_name` VARCHAR(191) NOT NULL,
    `contact_number` VARCHAR(191) NOT NULL,
    `address_line_1` VARCHAR(191) NOT NULL,
    `address_line_2` VARCHAR(191) NULL,
    `postal_code` VARCHAR(191) NOT NULL,
    `countryId` BIGINT NULL,
    `stateId` BIGINT NULL,
    `cityId` BIGINT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deletedBy` INTEGER NULL,
    `deletedByRole` VARCHAR(191) NULL,

    UNIQUE INDEX `warehouse_slug_key`(`slug`),
    INDEX `warehouse_countryId_idx`(`countryId`),
    INDEX `warehouse_stateId_idx`(`stateId`),
    INDEX `warehouse_cityId_idx`(`cityId`),
    INDEX `warehouse_createdBy_idx`(`createdBy`),
    INDEX `warehouse_updatedBy_idx`(`updatedBy`),
    INDEX `warehouse_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `image` LONGTEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deletedBy` INTEGER NULL,
    `deletedByRole` VARCHAR(191) NULL,

    UNIQUE INDEX `category_slug_key`(`slug`),
    INDEX `category_createdBy_idx`(`createdBy`),
    INDEX `category_updatedBy_idx`(`updatedBy`),
    INDEX `category_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `image` LONGTEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deletedBy` INTEGER NULL,
    `deletedByRole` VARCHAR(191) NULL,

    UNIQUE INDEX `brand_slug_key`(`slug`),
    INDEX `brand_createdBy_idx`(`createdBy`),
    INDEX `brand_updatedBy_idx`(`updatedBy`),
    INDEX `brand_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `main_sku` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `tags` JSON NULL,
    `brandId` INTEGER NOT NULL,
    `originCountryId` BIGINT NOT NULL,
    `ean` VARCHAR(191) NULL,
    `hsnCode` VARCHAR(191) NULL,
    `taxRate` DOUBLE NULL,
    `upc` VARCHAR(191) NULL,
    `rtoAddress` VARCHAR(191) NULL,
    `pickupAddress` VARCHAR(191) NULL,
    `shippingCountryId` BIGINT NOT NULL,
    `video_url` VARCHAR(191) NULL,
    `list_as` VARCHAR(191) NULL,
    `shipping_time` VARCHAR(191) NULL,
    `weight` DOUBLE NULL,
    `package_length` DOUBLE NULL,
    `package_width` DOUBLE NULL,
    `package_height` DOUBLE NULL,
    `chargeable_weight` DOUBLE NULL,
    `package_weight_image` VARCHAR(191) NULL,
    `package_length_image` VARCHAR(191) NULL,
    `package_width_image` VARCHAR(191) NULL,
    `package_height_image` VARCHAR(191) NULL,
    `product_detail_video` VARCHAR(191) NULL,
    `training_guidance_video` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deletedBy` INTEGER NULL,
    `deletedByRole` VARCHAR(191) NULL,

    UNIQUE INDEX `product_slug_key`(`slug`),
    UNIQUE INDEX `product_main_sku_key`(`main_sku`),
    INDEX `product_categoryId_idx`(`categoryId`),
    INDEX `product_brandId_idx`(`brandId`),
    INDEX `product_originCountryId_idx`(`originCountryId`),
    INDEX `product_shippingCountryId_idx`(`shippingCountryId`),
    INDEX `product_createdBy_idx`(`createdBy`),
    INDEX `product_updatedBy_idx`(`updatedBy`),
    INDEX `product_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productVariant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `article_id` VARCHAR(191) NULL,
    `suggested_price` DOUBLE NULL,
    `shipowl_price` DOUBLE NULL,
    `rto_suggested_price` DOUBLE NULL,
    `rto_price` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `createdByRole` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,
    `updatedByRole` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deletedBy` INTEGER NULL,
    `deletedByRole` VARCHAR(191) NULL,

    UNIQUE INDEX `productVariant_sku_key`(`sku`),
    INDEX `productVariant_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `adminStaff` ADD CONSTRAINT `adminStaff_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `state` ADD CONSTRAINT `state_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `state`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warehouse` ADD CONSTRAINT `warehouse_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warehouse` ADD CONSTRAINT `warehouse_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `state`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warehouse` ADD CONSTRAINT `warehouse_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `city`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_originCountryId_fkey` FOREIGN KEY (`originCountryId`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_shippingCountryId_fkey` FOREIGN KEY (`shippingCountryId`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productVariant` ADD CONSTRAINT `productVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
