"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var lusca_1 = __importDefault(require("lusca"));
var morgan_1 = __importDefault(require("morgan"));
var pouchdb_1 = __importDefault(require("pouchdb"));
var pouchdb_find_1 = __importDefault(require("pouchdb-find"));
var controllers = __importStar(require("./controllers"));
var repositories = __importStar(require("./repositories"));
var routes = __importStar(require("./routes"));
var services = __importStar(require("./services"));
var crons = __importStar(require("./cron"));
var MNEMONIC = 'detail barely electric powder pear long such toddler abstract client oak shadow skirt repair income';
var app = express_1.default();
var logger = morgan_1.default('combined');
var router = express_1.default.Router();
// In production, you would probably use a DI container to handle the
// dependency graph. However, since this is a trivial example, we'll just go
// with hand-wiring ;)
// initialise data layer
pouchdb_1.default.plugin(pouchdb_find_1.default);
var depositDB = new pouchdb_1.default('deposits');
depositDB.createIndex({ index: { fields: ['address'] } });
var depositRepo = new repositories.DepositRepository(depositDB);
// initialise services
// TODO: parameterise the api
var zilliqaSvc = new services.ZilliqaService('https://api.aws.zilliqa.com', (_a = {},
    _a[MNEMONIC] = 8,
    _a));
// boot up cron jobs
// these can also be destroyed
var depositCron = new crons.DepositCron('* * * * *', zilliqaSvc);
depositCron.start();
// instantiate controllers
var depositController = new controllers.DepositController(depositRepo);
// setup routes
routes.deposit.get(router, depositController);
// setup middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(logger);
app.use(lusca_1.default.nosniff());
app.use(lusca_1.default.xframe('SAMEORIGIN'));
app.use(lusca_1.default.xssProtection());
app.use(router);
app.listen(8080, function () {
    console.log('Server listening on port 8080.');
});
