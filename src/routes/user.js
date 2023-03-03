import { Router } from "express";
import userModel from "../models/user.js";
// import {userSchema} from '../models/joiSchema.js'
// import Joi from 'joi';

const user = Router();

user.get("/", async (req, res) => {
  const result = await userModel.findAll();
  return res.json(result);
});

user.get("/:id", async (req, res) => {
  const result = await userModel.findById(req.params.id);
  return res.json(result);
});
user.post("/", async (req, res) => {
  // const validation = userSchema.validate(req.body);
  // if(validation.error)
  // return res.json(validation.error.details)

  const result = await userModel.create(req.body);
  return res.json(result);
});
user.put("/:id", async (req, res) => {
  const result = await userModel.findByIdAndUpdate(req.params.id, req.body);
  return res.json(result);
});
user.delete("/:id", async (req, res) => {
  const result = await userModel.findByIdAndDeleteWithRelationships(
    req.params.id
  );
  return res.json(result);
});

user.post("/createRelationship", async (req, res) => {
  const { n1, n2, r1 } = req.body;
  const result = await userModel.createRelationship(n1, n2, r1);
  return res.json(result);
});

user.get("/getRelationship/:id", async (req, res) => {
  const result = await userModel.findAllUserRelationships(req.params.id);
  return res.json(result);
});

export default user;
