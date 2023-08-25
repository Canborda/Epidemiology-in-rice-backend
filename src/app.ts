import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import express, { Application } from 'express';

import requestMiddleware from './middlewares/request.middleware';
import responseMiddleware from './middlewares/response.middleware';
import errorMiddleware from './middlewares/error.middleware';

import { ROUTES } from './utils/constants';
import userRouter from './routers/user.router';
import cropRouter from './routers/crop.router';
import mapRouter from './routers/map.router';
import varietyRouter from './routers/variety.router';
import geeRouter from './routers/gee.router';

class App {
  private _app: Application;

  constructor() {
    this._app = express();
    // Add middlewares
    this.initMiddleware();
    this.requestMiddleware();
    this.initRoutes();
    this.responseMiddleware();
    this.errorMiddleware();
  }

  private initMiddleware() {
    this._app.use(cors());
    this._app.use(helmet());
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
  }

  private initRoutes() {
    // Add routers
    this._app.use(ROUTES.users.BASE, userRouter);
    this._app.use(ROUTES.crops.BASE, cropRouter);
    this._app.use(ROUTES.maps.BASE, mapRouter);
    this._app.use(ROUTES.varieties.BASE, varietyRouter);
    this._app.use(ROUTES.gee.BASE, geeRouter);
  }

  private requestMiddleware() {
    this._app.use(requestMiddleware);
  }

  private responseMiddleware() {
    this._app.use(responseMiddleware);
  }

  private errorMiddleware() {
    this._app.use(errorMiddleware);
  }

  public get app() {
    return this._app;
  }
}

export default new App();
