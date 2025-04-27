import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import router from './routes/index';

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:4200",
//   credentials : true
// }));
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}))


app.get("/", (req, res) => {
  res.send({ message: "Welcome to Graphite Service!" });
});

app.use('/api', router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.json({ message: `had an error: ${err.message}` });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
