export async function handler(event, context) {
  const ODOO_URL = "https://amsterdam.odoo.com";
  const DB_NAME = "amsterdam";
  const USERNAME = "ahmedhesham9913@gmail.com";
  const PASSWORD = "Moodz@Hesham@1998";

  try {
    // Step 1: Login
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
    const session_id = loginData.result?.session_id;

    if (!session_id) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Login failed: No session ID returned." }),
      };
    }

    // Step 2: Make authenticated request
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
          model: "res.partner",
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

    const data = await apiRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data, null, 2),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown error" }),
    };
  }
}
