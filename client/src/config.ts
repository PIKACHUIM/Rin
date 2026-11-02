// Config constants for Rin client
// This file has no dependencies to avoid circular imports

/**
 * API 基地址。
 * - 同源部署（Cloudflare Workers 同时托管前端与接口）时留空。
 * - 前后端分离部署（例如前端静态托管在 EdgeOne Pages，接口运行在
 *   Cloudflare Workers）时，通过构建变量 VITE_API_BASE 指定完整地址，
 *   例如 VITE_API_BASE=https://api.example.com。
 */
const rawApiBase = (import.meta.env?.VITE_API_BASE as string | undefined) ?? ""

export const endpoint = rawApiBase.trim().replace(/\/+$/, "")
export const oauth_url = endpoint + '/api/user/github'
