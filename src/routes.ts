import { Router } from "express";
import DayController from "./controllers/DayController";
import RullesController from "./controllers/RulesController";

const routes = Router();

routes.get("/", DayController.index);
routes.get("/rules", RullesController.index);
routes.post("/rules", RullesController.create);

export default routes;
