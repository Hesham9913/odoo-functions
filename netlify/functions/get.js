export async function handler(event, context) {
  const ODOO_URL = "https://amsterdam.odoo.com";
  const DB_NAME = "amsterdam";
  const USERNAME = "ahmedhesham9913@gmail.com";
  const PASSWORD = "Moodz@Hesham@1998";

  try {
    // Step 1: Login
    const loginResponse = await fetch(`${ODOO_URL}/web/session/authenticate`, {
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

    const loginData = await loginResponse.json();
    const session_id = loginResponse.headers.get("set-cookie")?.split(";")[0];

    if (!loginData.result || !session_id) {
      throw new Error("Login failed: No session ID returned.");
    }

    // Step 2: Call search_read from correct endpoint
    const result = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": session_id,
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

    const data = await result.json();
    console.log("✅ Response from Odoo:", data);

    return {
      statusCode: 200,
      body: JSON.stringify(data, null, 2),
    };

  } catch (error) {
    console.error("🔥 Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
