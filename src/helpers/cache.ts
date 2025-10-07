import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60, checkperiod: 3600 });

export default cache;