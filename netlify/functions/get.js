export async function handler(event, context) {
  const ODOO_URL = "https://amsterdam.odoo.com";
  const DB_NAME = "amsterdam";
  const USERNAME = "ahmedhesham9913@gmail.com";
  const PASSWORD = "Moodz@Hesham@1998";

  try {
    // Step 1: Login to Odoo
    const loginRes = await fetch(`${ODOO_URL}/web/session/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: DB_NAME,
          login: USERNAME,
          password: PASSWORD,
        },
      }),
    });

    const loginData = await loginRes.json();
    const sessionCookie = loginRes.headers.get("set-cookie");
    const session_id = sessionCookie?.split(";")[0]?.split("=")[1];

    if (!session_id || !loginData.result || !loginData.result.uid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "❌ Authentication failed: Invalid session or credentials" }),
      };
    }

    // Step 2: Make API call using session_id
    const apiRes = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `session_id=${session_id}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "res.partner", // Example model
          method: "search_read",
          args: [],
          kwargs: {
            domain: [["is_company", "=", true]],
            fields: ["name", "email"],
            limit: 5,
          },
        },
      }),
    });

    const apiData = await apiRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(apiData, null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "🔥 Internal error", message: error.message }),
    };
  }
}
