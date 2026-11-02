const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function sign(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return base64UrlEncode(new Uint8Array(signature));
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

/**
 * 生成带签名的 OAuth state：`<nonce>.<base64url(origin)>.<hmac>`。
 * 把登录来源域名写进 state 并由 JWT_SECRET 签名，回调落在任意域名时
 * 都能验证出来源并跳回去，且无法被伪造（避免开放重定向）。
 */
export async function createOAuthState(secret: string, origin: string): Promise<string> {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);

  const nonce = base64UrlEncode(nonceBytes);
  const payload = base64UrlEncode(encoder.encode(origin));
  const signature = await sign(secret, `${nonce}.${payload}`);

  return `${nonce}.${payload}.${signature}`;
}

/** 校验签名并取出登录来源 origin；失败返回 null */
export async function readOAuthStateOrigin(
  secret: string,
  state: string | undefined | null,
): Promise<string | null> {
  if (!state) return null;

  const parts = state.split(".");
  if (parts.length !== 3) return null;

  const [nonce, payload, signature] = parts;
  const expected = await sign(secret, `${nonce}.${payload}`);
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const origin = decoder.decode(base64UrlDecode(payload));
    const url = new URL(origin);

    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.pathname !== "/" || url.search || url.hash) return null;

    return url.origin;
  } catch {
    return null;
  }
}
