import parser from 'body-parser';
import express from 'express';
import lusca from 'lusca';
import morgan from 'morgan';
import PouchDB from 'pouchdb';
import pouchFind from 'pouchdb-find';
import pouchMemoryAdapter from 'pouchdb-adapter-memory';

import * as controllers from './controllers';
import * as repositories from './repositories';
import * as routes from './routes';
import * as services from './services';
import * as crons from './cron';

const MNEMONIC =
  'detail barely electric powder pear long such toddler abstract client oak shadow skirt repair income';
const app = express();
const logger = morgan('combined');
const router = express.Router();

// In production, you would probably use a DI container to handle the
// dependency graph. However, since this is a trivial example, we'll just go
// with hand-wiring ;)

// initialise data layer
// use an in-memory db
PouchDB.plugin(pouchFind);
PouchDB.plugin(pouchMemoryAdapter);
const depositDB = new PouchDB('deposits', {adapter: 'memory'});
depositDB.createIndex({index: {fields: ['address']}});
const depositRepo = new repositories.DepositRepository(depositDB);

// initialise services
// TODO: parameterise the api
const zilliqaSvc = new services.ZilliqaService(
  'https://stress-test-api.aws.z7a.xyz',
  {
    [MNEMONIC]: 8,
  },
);

// boot up cron jobs
// these can also be destroyed
const depositCron = new crons.DepositCron('* * * * *', zilliqaSvc);
depositCron.start();

// instantiate controllers
const depositController = new controllers.DepositController(depositRepo);

// setup routes
routes.deposit.get(router, depositController);

// setup middleware
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(logger);
app.use(lusca.nosniff());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection());
app.use(router);

app.listen(8080, () => {
  console.log('Server listening on port 8080.');
});
