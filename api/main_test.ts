import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import app from "./main.ts";

Deno.test("GET / should return 'Hello World!'", async () => {
  const request = await superoak(app);
  await request.get("/").expect(200).expect("Hello World!");
});
