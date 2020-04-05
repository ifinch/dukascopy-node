import { program } from 'commander';
import { validateConfig, schema, validator, Format, Timeframe, Price } from 'dukascopy-core';
import { CliConfig } from './types';

program
  .option('-d, --debug', 'Output extra debugging')
  .option('-s, --silent', 'Prints out the search config', false)
  .requiredOption('-i, --instrument <value>', 'Trading instrument')
  .requiredOption('-dr, --date-range <value>', 'Date range', (v: string): string[] => v.split(' '))
  .requiredOption('-t, --timeframe <value>', 'Timeframe aggregation', Timeframe.d1)
  .option('-p, --price-type <value>', 'Price type: (bid, ask)', Price.bid)
  .option('-utc, --utc-offset <value>', 'UTC offset in minutes', Number, 0)
  .option('-v, --volumes', 'Include volumes', true)
  .option('-fl, --flats', 'Include flats (0 volumes)', true)
  .option('-f, --format <value>', 'Output format (csv, json, array)', Format.json)
  .option('-dir, --directory <value>', 'Download directory', './download');

program.parse(process.argv);

const options = program.opts();

if (program.debug) console.log(options);

export const cliConfig: CliConfig = {
  instrument: options.instrument,
  dates: {
    from: options.dateRange[0],
    to: options.dateRange[1]
  },
  timeframe: options.timeframe,
  priceType: options.priceType,
  utcOffset: options.utcOffset,
  volumes: options.volumes,
  ignoreFlats: !options.flats,
  dir: options.directory,
  silent: options.silent,
  format: options.format
};

const cliValidationSchema = {
  ...schema,
  ...{
    dir: { type: 'string', required: true },
    silent: { type: 'boolean', required: true }
  }
} as typeof schema;

const cliCheck = validator.compile(cliValidationSchema);

export const { isValid, validationErrors } = validateConfig(cliConfig, cliCheck);
