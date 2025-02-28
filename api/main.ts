import express from "@express";

const app = express();

app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.listen(8000);

export default app;
