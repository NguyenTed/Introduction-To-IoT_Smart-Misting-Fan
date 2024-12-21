import dotenv from "dotenv";
dotenv.config();

import { server } from "./app.js";

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
