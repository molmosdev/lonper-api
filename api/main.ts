import express from "npm:express@4.18.2";

const app = express();

app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.listen(8000);

export default app;
