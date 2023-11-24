import express, { json } from "express";
import cors from "cors";
require("dotenv").config();

const app = express();

// llamar archivos html en carpeta public
app.use(express.static("./public"));

// cors
app.use(cors());

// Body ready and parseo

app.use(json());

// Routs
// user
app.use("/api/auth", require("./src/routes/auth").default);
app.use("/api/user", require("./src/routes/user"));

// cryptography
app.use("/api/cryptography", require("./src/routes/cryptography"));

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
