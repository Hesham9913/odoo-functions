export async function handler(event, context) {
  const ODOO_URL = "https://amsterdam.odoo.com";
  const DB_NAME = "amsterdam";
  const USERNAME = "ahmedhesham9913@gmail.com";
  const PASSWORD = "Moodz@Hesham@1998";

  try {
    // Step 1: Authenticate
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

    // Check for login success
    if (!loginData.result || !loginData.result.session_id) {
      throw new Error("Authentication failed: Invalid credentials or session.");
    }

    const session_id = loginData.result.session_id;

    // Step 2: Call API
    const result = await fetch(`${ODOO_URL}/web/dataset/call_kw/res.partner/search_read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Openerp-Session-Id": session_id,  // Optional for some setups
        "Cookie": `session_id=${session_id}`,  // Send full cookie
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "res.partner",
          domain: [["is_company", "=", true]],
          fields: ["name", "email"],
          limit: 5,
        },
      }),
    });

    const data = await result.json();
    console.log("✅ Response from Odoo:", JSON.stringify(data));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error("🔥 Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
