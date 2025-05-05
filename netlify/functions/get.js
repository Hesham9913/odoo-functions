export async function handler(event, context) {
  const ODOO_URL = "https://amsterdam.odoo.com";
  const DB_NAME = "amsterdam";
  const USERNAME = "ahmedhesham9913@gmail.com";
  const PASSWORD = "Moodz@Hesham@1998"; // ده الباسورد اللي انت كتبته

  try {
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

    // اطبع بيانات الدخول كلها
    console.log("🔥 Login Response:", loginData);

    if (!loginData.result) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Authentication failed", loginData }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ Logged in successfully!",
        uid: loginData.result.uid,
        session_id: loginResponse.headers.get("set-cookie")?.split(";")[0],
      }),
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
