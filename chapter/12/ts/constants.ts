const CURRENCY = {
  DOLLAR: 'USD',
  FRANC: 'CHF',
} as const;

type CurrencyKeyTypes = keyof typeof CURRENCY;
type CurrencyTypes = typeof CURRENCY[CurrencyKeyTypes];

export { CURRENCY, CurrencyTypes };
