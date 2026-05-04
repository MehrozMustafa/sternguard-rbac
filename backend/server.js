require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.join({message: "Backend Server is Running"})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log("Server is Running on http://localhost:", {PORT})});
