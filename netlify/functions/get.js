export async function handler(event, context) {
  const ODOO_URL = "https://amsterdam.odoo.com";
  const DB_NAME = "amsterdam";
  const USERNAME = "ahmedhesham9913@gmail.com";
  const PASSWORD = "Moodz@Hesham@1998";

  try {
    const loginResponse = await fetch(`${ODOO_URL}/web/session/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: DB_NAME,
          login: USERNAME,
          password: PASSWORD
        }
      })
    });

    const rawText = await loginResponse.text();
    console.log("🔥 Raw Response:", rawText); // 👈 هنا هنطبع في اللوج بس

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: "Check Netlify Logs!" }) // نطبع رسالة سريعة بس
    };
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
