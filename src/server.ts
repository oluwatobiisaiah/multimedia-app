import app from "./app";
(async () => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(
          `<<<<<<<<<<<<<<<< Yeeeep,Server running on port ${PORT}..>>>>>>>>>>>`
        );
    });
  })();