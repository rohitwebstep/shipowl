INSERT INTO `admin` (`id`, `name`, `email`, `password`, `role`, `status`, `createdAt`, `updatedAt`, `pr_token`, `pr_expires_at`, `pr_last_reset`) VALUES
(1, 'Rohit Admin', 'rohitwebstep-admin@gmail.com', '$2b$10$hW8vbhToemWerVuNQ5W4l.7RVppP2Y3a8hooIZTPidgugCkWMcOyC', 'admin', 'active', '2025-04-07 05:19:36.000', '2025-04-14 06:32:13.419', NULL, NULL, '2025-04-14 06:32:13.417'),
(3, 'Rohit Dropshipper', 'rohitwebstep-drop@gmail.com', '$2b$10$vws6emtcbykca5VJkQIsu.o3mzNY5Qj/g/2659P/uHooVQ79VQg5q', 'dropshipper', 'active', '2025-04-07 05:19:36.000', '2025-04-07 05:19:39.000', NULL, NULL, NULL),
(4, 'Rohit Supplier', 'rohitwebstep-sup@gmail.com', '$2b$10$vws6emtcbykca5VJkQIsu.o3mzNY5Qj/g/2659P/uHooVQ79VQg5q', 'supplier', 'active', '2025-04-07 05:19:36.000', '2025-04-07 05:19:39.000', NULL, NULL, NULL),
(1, 'Shikha Admin', 'shikhawebstep@gmail.com', '$2b$10$hW8vbhToemWerVuNQ5W4l.7RVppP2Y3a8hooIZTPidgugCkWMcOyC', 'admin', 'active', '2025-04-07 05:19:36.000', '2025-04-14 06:32:13.419', NULL, NULL, '2025-04-14 06:32:13.417');

INSERT INTO `adminstaff` (`id`, `admin_id`, `name`, `email`, `password`, `role`, `status`, `createdAt`, `updatedAt`, `pr_token`, `pr_expires_at`, `pr_last_reset`) VALUES
(2, 1, 'Rohit Admin Staff', 'rohitwebstep-admin-staff@gmail.com', '$2b$10$vws6emtcbykca5VJkQIsu.o3mzNY5Qj/g/2659P/uHooVQ79VQg5q', 'admin_staff', 'active', '2025-04-07 06:32:17.000', '2025-04-07 06:32:20.000', NULL, NULL, NULL),
(3, 3, 'Rohit Dropshipper Staff', 'rohitwebstep-drop-staff@gmail.com', '$2b$10$vws6emtcbykca5VJkQIsu.o3mzNY5Qj/g/2659P/uHooVQ79VQg5q', 'dropshipper_staff', 'active', '2025-04-07 06:32:17.000', '2025-04-07 06:32:20.000', NULL, NULL, NULL),
(4, 4, 'Rohit Supplier Staff', 'rohitwebstep-sup-staff@gmail.com', '$2b$10$vws6emtcbykca5VJkQIsu.o3mzNY5Qj/g/2659P/uHooVQ79VQg5q', 'supplier_staff', 'active', '2025-04-07 06:32:17.000', '2025-04-07 06:32:20.000', NULL, NULL, NULL);
