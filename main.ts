// VLESS WebSocket 节点 for Deno Deploy
// 密码(认证key)：KIsen.xdy
const AUTH_KEY = "KIsen.xdy";
const UUID = "9A4879D2-BF7D-78B9-05B5-C8378BD39F5C";
const WS_PATH = "/vless";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  // 认证校验
  if (key !== AUTH_KEY) {
    return new Response("Access Denied", { status: 403 });
  }

  // WebSocket 升级（VLESS 核心）
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    return response;
  }

  // 输出节点信息（打开即可复制）
  const host = url.host;
  const nodeLink = `vless://${UUID}@${host}:443?path=${encodeURIComponent(WS_PATH + "?key=" + AUTH_KEY)}&security=tls&encryption=none&type=ws&host=${host}#Deno-VLESS`;

  return new Response(
`=== VLESS 节点信息 ===
地址：${host}
端口：443
UUID：${UUID}
传输：ws
路径：${WS_PATH}?key=${AUTH_KEY}
TLS：开启

=== 节点链接（直接复制导入）===
${nodeLink}`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    }
  );
});
