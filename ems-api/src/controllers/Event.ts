import {Router, Request, Response} from 'express';

const router: Router = Router();

router.post("/", (req: Request, res: Response) => {
  console.log(req.query.type);
  res.send("Yay!");
});

export const EventController: Router = router;