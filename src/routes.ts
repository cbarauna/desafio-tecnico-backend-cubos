import { Router } from "express";
import RullesController from "./controllers/RulesController";
const routes = Router();


routes.get("/rules", RullesController.index);
routes.post("/rules", RullesController.store);
routes.delete("/rules", RullesController.delete);



export default routes;
