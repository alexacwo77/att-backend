require("dotenv").config();

process.env.TZ = 'Europe/Helsinki';

const app = require("./app");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});