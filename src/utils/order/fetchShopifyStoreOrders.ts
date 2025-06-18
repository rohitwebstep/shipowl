import axios from 'axios';
import { logMessage } from '../commonUtils';

const SHOPIFY_API_VERSION = '2024-04'; // Replace with the correct version

interface OrdersResult {
  status: boolean;
  message?: string;
  orders?: any[]; // Replace `any` with your Order type if available
  details?: unknown;
}

export async function fetchShopifyStoreOrders(shop: string, access_token: string): Promise<OrdersResult> {
  if (!shop || !access_token) {
    logMessage('warn', 'Missing shop or access token', { shop });
    return {
      status: false,
      message: 'Missing shop or access token',
    };
  }

  const gql = `{
    orders(first: 10, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
          currencyCode
          totalPriceSet { shopMoney { amount currencyCode } }
          subtotalPriceSet { shopMoney { amount currencyCode } }
          totalShippingPriceSet { shopMoney { amount currencyCode } }
          totalTaxSet { shopMoney { amount currencyCode } }
          displayFinancialStatus
          displayFulfillmentStatus
          customer {
            id
            email
            firstName
            lastName
            phone
          }
          billingAddress {
            address1
            address2
            city
            province
            country
            zip
            phone
          }
          shippingAddress {
            address1
            address2
            city
            province
            country
            zip
            phone
          }
          lineItems(first: 50) {
            edges {
              node {
                title
                sku
                quantity
                discountedTotalSet { shopMoney { amount currencyCode } }
                originalTotalSet { shopMoney { amount currencyCode } }
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const response = await axios.post(
      `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      { query: gql },
      {
        headers: {
          'X-Shopify-Access-Token': access_token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.errors) {
      logMessage('error', 'Shopify GraphQL errors', response.data.errors);
      return {
        status: false,
        message: 'GraphQL errors from Shopify',
        details: response.data.errors,
      };
    }

    const orders = response.data.data.orders.edges.map((edge: any) => edge.node);

    logMessage('info', 'Orders fetched successfully', { count: orders.length });
    return {
      status: true,
      message: 'Fetched orders successfully',
      orders,
    };
  } catch (err: any) {
    const errorMessage = err.response?.data || err.message || err;
    logMessage('error', 'Fetch orders error', errorMessage);
    return {
      status: false,
      message: 'Failed to fetch orders',
      details: errorMessage,
    };
  }
}
