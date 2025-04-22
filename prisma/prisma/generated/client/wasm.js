
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.EmailConfigScalarFieldEnum = {
  id: 'id',
  panel: 'panel',
  module: 'module',
  subject: 'subject',
  action: 'action',
  html_template: 'html_template',
  smtp_host: 'smtp_host',
  smtp_secure: 'smtp_secure',
  smtp_port: 'smtp_port',
  smtp_username: 'smtp_username',
  smtp_password: 'smtp_password',
  from_email: 'from_email',
  from_name: 'from_name',
  status: 'status',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  createdByRole: 'createdByRole',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  updatedByRole: 'updatedByRole'
};

exports.Prisma.AdminScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  pr_token: 'pr_token',
  pr_expires_at: 'pr_expires_at',
  pr_last_reset: 'pr_last_reset'
};

exports.Prisma.AdminStaffScalarFieldEnum = {
  id: 'id',
  admin_id: 'admin_id',
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  pr_token: 'pr_token',
  pr_expires_at: 'pr_expires_at',
  pr_last_reset: 'pr_last_reset'
};

exports.Prisma.LoginLogScalarFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  adminRole: 'adminRole',
  action: 'action',
  response: 'response',
  ipv4: 'ipv4',
  ipv6: 'ipv6',
  internetServiceProvider: 'internetServiceProvider',
  clientInformation: 'clientInformation',
  userAgent: 'userAgent',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  createdByRole: 'createdByRole',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  updatedByRole: 'updatedByRole',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.ActivityLogScalarFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  adminRole: 'adminRole',
  module: 'module',
  action: 'action',
  endpoint: 'endpoint',
  method: 'method',
  payload: 'payload',
  response: 'response',
  result: 'result',
  data: 'data',
  ipv4: 'ipv4',
  ipv6: 'ipv6',
  internetServiceProvider: 'internetServiceProvider',
  clientInformation: 'clientInformation',
  userAgent: 'userAgent',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  createdByRole: 'createdByRole',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  updatedByRole: 'updatedByRole',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.CountryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  iso3: 'iso3',
  iso2: 'iso2',
  phonecode: 'phonecode',
  currency: 'currency',
  currencyName: 'currencyName',
  currencySymbol: 'currencySymbol',
  nationality: 'nationality',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  createdByRole: 'createdByRole',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  updatedByRole: 'updatedByRole',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.StateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  countryId: 'countryId',
  iso2: 'iso2',
  type: 'type',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  createdByRole: 'createdByRole',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  updatedByRole: 'updatedByRole',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.CityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  stateId: 'stateId',
  countryId: 'countryId',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  createdByRole: 'createdByRole',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  updatedByRole: 'updatedByRole',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.WarehouseScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  gst_number: 'gst_number',
  contact_name: 'contact_name',
  contact_number: 'contact_number',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  postal_code: 'postal_code',
  countryId: 'countryId',
  stateId: 'stateId',
  cityId: 'cityId',
  status: 'status',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  createdByRole: 'createdByRole',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  updatedByRole: 'updatedByRole',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  image: 'image',
  status: 'status',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  createdByRole: 'createdByRole',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  updatedByRole: 'updatedByRole',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.BrandScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  image: 'image',
  status: 'status',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  createdByRole: 'createdByRole',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  updatedByRole: 'updatedByRole',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  categoryId: 'categoryId',
  name: 'name',
  slug: 'slug',
  main_sku: 'main_sku',
  description: 'description',
  tags: 'tags',
  brandId: 'brandId',
  originCountryId: 'originCountryId',
  ean: 'ean',
  hsnCode: 'hsnCode',
  taxRate: 'taxRate',
  upc: 'upc',
  rtoAddress: 'rtoAddress',
  pickupAddress: 'pickupAddress',
  shippingCountryId: 'shippingCountryId',
  video_url: 'video_url',
  list_as: 'list_as',
  shipping_time: 'shipping_time',
  weight: 'weight',
  package_length: 'package_length',
  package_width: 'package_width',
  package_height: 'package_height',
  chargeable_weight: 'chargeable_weight',
  package_weight_image: 'package_weight_image',
  package_length_image: 'package_length_image',
  package_width_image: 'package_width_image',
  package_height_image: 'package_height_image',
  product_detail_video: 'product_detail_video',
  training_guidance_video: 'training_guidance_video',
  status: 'status',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  createdByRole: 'createdByRole',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  updatedByRole: 'updatedByRole',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.ProductVariantScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  image: 'image',
  color: 'color',
  sku: 'sku',
  qty: 'qty',
  currency: 'currency',
  article_id: 'article_id',
  suggested_price: 'suggested_price',
  shipowl_price: 'shipowl_price',
  rto_suggested_price: 'rto_suggested_price',
  rto_price: 'rto_price',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.emailConfigOrderByRelevanceFieldEnum = {
  panel: 'panel',
  module: 'module',
  subject: 'subject',
  action: 'action',
  html_template: 'html_template',
  smtp_host: 'smtp_host',
  smtp_username: 'smtp_username',
  smtp_password: 'smtp_password',
  from_email: 'from_email',
  from_name: 'from_name',
  createdByRole: 'createdByRole',
  updatedByRole: 'updatedByRole'
};

exports.Prisma.adminOrderByRelevanceFieldEnum = {
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role',
  status: 'status',
  pr_token: 'pr_token'
};

exports.Prisma.adminStaffOrderByRelevanceFieldEnum = {
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role',
  status: 'status',
  pr_token: 'pr_token'
};

exports.Prisma.loginLogOrderByRelevanceFieldEnum = {
  adminRole: 'adminRole',
  action: 'action',
  response: 'response',
  ipv4: 'ipv4',
  ipv6: 'ipv6',
  internetServiceProvider: 'internetServiceProvider',
  clientInformation: 'clientInformation',
  userAgent: 'userAgent',
  createdByRole: 'createdByRole',
  updatedByRole: 'updatedByRole',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.activityLogOrderByRelevanceFieldEnum = {
  adminRole: 'adminRole',
  module: 'module',
  action: 'action',
  endpoint: 'endpoint',
  method: 'method',
  payload: 'payload',
  response: 'response',
  data: 'data',
  ipv4: 'ipv4',
  ipv6: 'ipv6',
  internetServiceProvider: 'internetServiceProvider',
  clientInformation: 'clientInformation',
  userAgent: 'userAgent',
  createdByRole: 'createdByRole',
  updatedByRole: 'updatedByRole',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.countryOrderByRelevanceFieldEnum = {
  name: 'name',
  iso3: 'iso3',
  iso2: 'iso2',
  phonecode: 'phonecode',
  currency: 'currency',
  currencyName: 'currencyName',
  currencySymbol: 'currencySymbol',
  nationality: 'nationality',
  createdByRole: 'createdByRole',
  updatedByRole: 'updatedByRole',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.stateOrderByRelevanceFieldEnum = {
  name: 'name',
  iso2: 'iso2',
  type: 'type',
  createdByRole: 'createdByRole',
  updatedByRole: 'updatedByRole',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.cityOrderByRelevanceFieldEnum = {
  name: 'name',
  createdByRole: 'createdByRole',
  updatedByRole: 'updatedByRole',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.warehouseOrderByRelevanceFieldEnum = {
  name: 'name',
  slug: 'slug',
  gst_number: 'gst_number',
  contact_name: 'contact_name',
  contact_number: 'contact_number',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  postal_code: 'postal_code',
  createdByRole: 'createdByRole',
  updatedByRole: 'updatedByRole',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.categoryOrderByRelevanceFieldEnum = {
  name: 'name',
  slug: 'slug',
  description: 'description',
  image: 'image',
  createdByRole: 'createdByRole',
  updatedByRole: 'updatedByRole',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.brandOrderByRelevanceFieldEnum = {
  name: 'name',
  slug: 'slug',
  description: 'description',
  image: 'image',
  createdByRole: 'createdByRole',
  updatedByRole: 'updatedByRole',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.productOrderByRelevanceFieldEnum = {
  name: 'name',
  slug: 'slug',
  main_sku: 'main_sku',
  description: 'description',
  ean: 'ean',
  hsnCode: 'hsnCode',
  upc: 'upc',
  rtoAddress: 'rtoAddress',
  pickupAddress: 'pickupAddress',
  video_url: 'video_url',
  list_as: 'list_as',
  shipping_time: 'shipping_time',
  package_weight_image: 'package_weight_image',
  package_length_image: 'package_length_image',
  package_width_image: 'package_width_image',
  package_height_image: 'package_height_image',
  product_detail_video: 'product_detail_video',
  training_guidance_video: 'training_guidance_video',
  createdByRole: 'createdByRole',
  updatedByRole: 'updatedByRole',
  deletedByRole: 'deletedByRole'
};

exports.Prisma.productVariantOrderByRelevanceFieldEnum = {
  image: 'image',
  color: 'color',
  sku: 'sku',
  currency: 'currency',
  article_id: 'article_id'
};


exports.Prisma.ModelName = {
  emailConfig: 'emailConfig',
  admin: 'admin',
  adminStaff: 'adminStaff',
  loginLog: 'loginLog',
  activityLog: 'activityLog',
  country: 'country',
  state: 'state',
  city: 'city',
  warehouse: 'warehouse',
  category: 'category',
  brand: 'brand',
  product: 'product',
  productVariant: 'productVariant'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
