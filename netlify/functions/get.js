export async function handler(event, context) {
  const ODOO_URL = "https://amsterdam.odoo.com";
  const DB_NAME = "amsterdam";
  const USERNAME = "ahmedhesham99133@gmail.com";
  const API_KEY = "e8a4cf4b1268f170ce9baf3181ab24cb23e97d13";

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
          password: API_KEY
        }
      }),
    });

    const loginData = await loginResponse.json();
    const session_id = loginResponse.headers.get("set-cookie")?.split(";")[0];
    const uid = loginData.result?.uid;

    if (!uid || !session_id) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Authentication failed", loginData })
      };
    }

    const searchPayload = {
      jsonrpc: "2.0",
      method: "call",
      params: {
        model: "hr.payslip",
        method: "search_read",
        args: [
          [
            ["date_from", ">=", "2025-05-01"],
            ["date_to", "<=", "2025-05-31"]
          ],
          [
            "id", "name", "employee_id",
            "date_from", "date_to", "amount_total",
            "x_studio_monthly_report"
          ]
        ],
        kwargs: {
          context: { uid },
          limit: 1000
        }
      }
    };

    const payslipResponse = await fetch(`${ODOO_URL}/web/dataset/call_kw/hr.payslip/search_read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": session_id
      },
      body: JSON.stringify(searchPayload)
    });

    const payslipData = await payslipResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ result: payslipData.result })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || error.toString() })
    };
  }
}
