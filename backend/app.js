import express from "express";
import expressLayouts from "express-ejs-layouts";

const app = express();
const PORT = process.env.PORT || 3000;

// EJS configuration
app.set("view engine", "ejs");
app.set("views", "./views");

// Common layout configuration
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Static files
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("pages/home", {
    title: "BehindTheWin | Home"
  });
});
/*
app.get("/stories", (req, res) => {
  res.render("stories", {
    title: "BehindTheWin | Stories"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "BehindTheWin | About"
  });
});
*/


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;