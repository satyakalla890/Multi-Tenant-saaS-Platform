const app = require("./app");
const db = require("../database"); 

const PORT = process.env.PORT || 5000;

// Optional: test DB connection
db.connect()
  .then(client => {
    console.log("✅ PostgreSQL connected");
    client.release();

    // Start server only after DB is reachable
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ PostgreSQL connection failed:", err.stack);
  });
