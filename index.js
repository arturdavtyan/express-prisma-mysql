import express from "express";
import { prisma } from "./services/Prisma.js";
import Joi from "joi";

// const Joi = require("joi");
function responseDataCreator(data) {
  return {
    data,
    count: data.length,
  };
}

const app = express();
app.use(express.json());

app.get("/company", async (req, res, next) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(responseDataCreator(companies));
  } catch (e) {
    next({});
  }
});

app.post("/company", async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      address: Joi.string(),
      type: Joi.string(),
    });
    const ans = schema.validate(req.body);
    console.log("jhgf", ans);
    if (ans.error) {
      next({ statusCode: 400, message: "Bad Request" });
    }
    const company = await prisma.company.create({ data: req.body });
    // console.log(response);
    res.status(201).send(company);
  } catch (e) {
    next({});
    console.log(e.message);
  }
});
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;

  res
    .status(status)
    .json({ message: status === 500 ? "Something went wrong" : err.message });
});
app.listen(5000, () => console.log("Start"));
