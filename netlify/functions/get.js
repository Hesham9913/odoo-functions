export async function handler(event, context) {
  const ODOO_URL = "https://amsterdam.odoo.com";
  const DB_NAME = "amsterdam";
  const USERNAME = "ahmedhesham99133@gmail.com";
  const PASSWORD = "Moodz@Hesham@1998";

  try {
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

    if (loginData.error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Authentication failed", loginData }),
      };
    }

    const session_id = loginResponse.headers.get("set-cookie")?.split(";")[0];
    const uid = loginData.result?.uid;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login successful",
        uid,
        session_id,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
