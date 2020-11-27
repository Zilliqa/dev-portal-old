import convict from 'convict';
import * as path from 'path';
import {
  getPubKeyFromPrivateKey,
  getAddressFromPrivateKey,
} from '@zilliqa-js/crypto';

export const config = convict({
  api: {
    doc: 'The seed/lookup node URL.',
    default: 'https://community-api.aws.z7a.xyz',
    arg: 'api',
    format: 'url',
  },
  env: {
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    default: 8080,
    arg: 'port',
    format: 'port',
  },
  mnemonic: {
    default:
      'detail barely electric powder pear long such toddler abstract client oak shadow skirt repair income',
  },
  keystore: {
    doc: 'Location of keystore file for hot wallet',
    default: '',
    format: String,
  },
});

config.loadFile(path.join(process.cwd(), 'config.dev.json'));
config.set('keystore', path.join(process.cwd(), 'hot_wallet_key.json'));
