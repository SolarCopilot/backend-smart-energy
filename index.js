const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.post("/api/zapier-webhook", async (req, res) => {
  console.log("Received Zapier webhook request:", req.body);
  const { data } = req.body;

  if (!data) {
    console.log("No data provided in Zapier webhook request");
    return res
      .status(400)
      .json({ status: "error", message: "No data provided" });
  }

  try {
    console.log("Sending data to Zapier:", data);
    const response = await fetch(
      "https://hooks.zapier.com/hooks/catch/4525203/21zk4op/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      console.error("Zapier API error:", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Zapier API response:", responseData);

    if (responseData.status === "success") {
      console.log("Zapier webhook successful");
      res.status(200).json({ status: "Success", data: responseData });
    } else {
      console.log("Zapier webhook failed:", responseData);
      res.status(400).json({ status: "Bad Request", data: responseData });
    }
  } catch (error) {
    console.error("Zapier webhook error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/solarcopilot", async (req, res) => {
  console.log("Received SolarCopilot request:", req.body);
  const { data } = req.body;

  async function postToSolarCopilot(data) {
    console.log("Sending data to SolarCopilot:", data);
    const response = await fetch(
      `https://solarcopilot.leadbyte.co.uk/restapi/v1.3/leads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          X_KEY: "7644d21b4597db181c55097f72c1eaa9",
        },
        body: JSON.stringify(data),
      }
    );
    const responseBody = await response.text();
    console.log("SolarCopilot raw response:", responseBody);

    if (!response.ok) {
      console.error("SolarCopilot API error:", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return JSON.parse(responseBody);
  }

  try {
    const response2 = await postToSolarCopilot(data);
    console.log("SolarCopilot successful response:", response2);
    res.status(200).json({ status: "Success", data: response2 });
  } catch (error) {
    console.error("SolarCopilot error:", error);
    res.status(500).json({ status: "Internal Server Error" });
  }
});

// Start the server (for local dev)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
