import crypto from 'crypto';

interface CoupangApiConfig {
  accessKey: string;
  secretKey: string;
}

interface RequestOptions {
  method: string;
  path: string;
  query?: Record<string, string>;
}

export function generateHmacSignature(
  config: CoupangApiConfig,
  options: RequestOptions
): { authorization: string; datetime: string } {
  const datetime = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const method = options.method.toUpperCase();
  const path = options.path;

  // Build query string
  const queryString = options.query
    ? Object.entries(options.query)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
    : '';

  // Create message to sign
  const message = `${datetime}${method}${path}${queryString}`;

  // Generate HMAC signature
  const signature = crypto
    .createHmac('sha256', config.secretKey)
    .update(message)
    .digest('hex');

  const authorization = `CEA algorithm=HmacSHA256, access-key=${config.accessKey}, signed-date=${datetime}, signature=${signature}`;

  return { authorization, datetime };
}

export interface CoupangProduct {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket: boolean;
  isFreeShipping: boolean;
  categoryName: string;
  rank: number;
}

export interface CoupangSearchResponse {
  rCode: string;
  rMessage: string;
  data: {
    productData: CoupangProduct[];
  };
}

export interface CoupangGoldboxResponse {
  rCode: string;
  rMessage: string;
  data: CoupangProduct[];
}

export async function searchProducts(
  keyword: string,
  limit: number = 20
): Promise<CoupangProduct[]> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) {
    throw new Error('Coupang API credentials are not configured');
  }

  const config: CoupangApiConfig = { accessKey, secretKey };
  const path = '/v2/providers/affiliate_open_api/apis/openapi/products/search';

  const query: Record<string, string> = {
    keyword: keyword,
    limit: limit.toString(),
  };

  const { authorization } = generateHmacSignature(config, {
    method: 'GET',
    path,
    query,
  });

  const queryString = Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  const url = `https://api-gateway.coupang.com${path}?${queryString}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Coupang API error: ${response.status} - ${errorText}`);
  }

  const data: CoupangSearchResponse = await response.json();

  if (data.rCode !== '0') {
    throw new Error(`Coupang API error: ${data.rMessage}`);
  }

  return data.data?.productData || [];
}

export async function getGoldboxProducts(
  subId?: string
): Promise<CoupangProduct[]> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) {
    throw new Error('Coupang API credentials are not configured');
  }

  const config: CoupangApiConfig = { accessKey, secretKey };
  const path = '/v2/providers/affiliate_open_api/apis/openapi/v1/products/goldbox';

  const query: Record<string, string> = {};
  if (subId) {
    query.subId = subId;
  }

  const { authorization } = generateHmacSignature(config, {
    method: 'GET',
    path,
    query: Object.keys(query).length > 0 ? query : undefined,
  });

  let url = `https://api-gateway.coupang.com${path}`;
  if (Object.keys(query).length > 0) {
    const queryString = Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    url += `?${queryString}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Coupang API error: ${response.status} - ${errorText}`);
  }

  const data: CoupangGoldboxResponse = await response.json();

  if (data.rCode !== '0') {
    throw new Error(`Coupang API error: ${data.rMessage}`);
  }

  return data.data || [];
}

export async function getDeeplink(
  originalUrl: string
): Promise<string> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) {
    throw new Error('Coupang API credentials are not configured');
  }

  const config: CoupangApiConfig = { accessKey, secretKey };
  const path = '/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink';

  const { authorization } = generateHmacSignature(config, {
    method: 'POST',
    path,
  });

  const url = `https://api-gateway.coupang.com${path}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      coupangUrls: [originalUrl],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Coupang API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (data.rCode !== '0') {
    throw new Error(`Coupang API error: ${data.rMessage}`);
  }

  return data.data?.[0]?.shortenUrl || originalUrl;
}
