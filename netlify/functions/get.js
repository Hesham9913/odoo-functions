export async function handler(event, context) {
  const ODOO_URL = "https://amsterdam.odoo.com";
  const DB_NAME = "amsterdam";
  const USERNAME = "ahmedhesham9913@gmail.com";
  const PASSWORD = "Moodz@Hesham@1998";

  try {
    // Step 1: Authenticate
    const loginResponse = await fetch(`${ODOO_URL}/web/session/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    const uid = loginData.result?.uid;

    console.log("Login Data:", loginData);
    console.log("Session ID:", session_id);
    console.log("UID:", uid);

    return {
      statusCode: 200,
      body: JSON.stringify({ loginData, session_id, uid }, null, 2),
    };
  } catch (error) {
    console.error("Authentication error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Authentication failed", details: error.message }),
    };
  }
}
