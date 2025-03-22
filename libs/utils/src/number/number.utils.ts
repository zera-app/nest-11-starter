export class NumberUtils {
  static abbreviate(number: number, decimals: number = 2): string {
    const sizes = ['', 'K', 'M', 'B', 'T'];
    let i = 0;
    while (number >= 1000 && i < sizes.length - 1) {
      number /= 1000;
      i++;
    }
    return number.toFixed(decimals) + sizes[i];
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static currency(
    amount: number,
    currencySymbol: string = '$',
    decimals: number = 2,
  ): string {
    return `${currencySymbol}${amount.toFixed(decimals)}`;
  }

  static defaultCurrency: string = '$';

  static defaultLocale: string = 'en-US';

  static fileSize(bytes: number, decimals: number = 2): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (
      parseFloat((bytes / Math.pow(1024, i)).toFixed(decimals)) + ' ' + sizes[i]
    );
  }

  static forHumans(number: number): string {
    return new Intl.NumberFormat(NumberUtils.defaultLocale).format(number);
  }

  static format(
    number: number,
    decimals: number = 2,
    locale: string = NumberUtils.defaultLocale,
  ): string {
    return number.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  static ordinal(number: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = number % 100;
    return (
      number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
    );
  }

  static pairs(array: number[]): [number, number][] {
    const result: [number, number][] = [];
    for (let i = 0; i < array.length - 1; i++) {
      result.push([array[i], array[i + 1]]);
    }
    return result;
  }

  static percentage(part: number, whole: number, decimals: number = 2): string {
    return ((part / whole) * 100).toFixed(decimals) + '%';
  }

  static spell(number: number): string {
    const spellOut = new Intl.NumberFormat(NumberUtils.defaultLocale, {
      style: 'decimal',
    });
    return spellOut.format(number);
  }

  static trim(number: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.floor(number * factor) / factor;
  }

  static useLocale(locale: string): void {
    NumberUtils.defaultLocale = locale;
  }

  static withLocale(number: number, locale: string): string {
    return number.toLocaleString(locale);
  }

  static useCurrency(currencySymbol: string): void {
    NumberUtils.defaultCurrency = currencySymbol;
  }

  static withCurrency(
    amount: number,
    currencySymbol: string = NumberUtils.defaultCurrency,
    decimals: number = 2,
  ): string {
    return NumberUtils.currency(amount, currencySymbol, decimals);
  }
}
