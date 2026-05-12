const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/devices", require("./routes/device.routes"));
app.use("/employees", require("./routes/employee.routes"));
app.use("/events", require("./routes/event.routes"));
app.use("/locations", require("./routes/location.routes"));
app.use("/pictures", require("./routes/picture.routes"));
app.use("/rewards", require("./routes/reward.routes"));
app.use("/reward_types", require("./routes/reward_type.routes"));
app.use("/user_rewards", require("./routes/user_reward.routes"));

app.use(require("./middleware/error.middleware"));

module.exports = app;