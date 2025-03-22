export class StrUtils {
  static random(length: number = 16): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length)),
    ).join('');
  }

  static after(subject: string, search: string): string {
    return subject.includes(search) ? subject.split(search, 2)[1] : subject;
  }

  static afterLast(subject: string, search: string): string {
    return subject.includes(search) ? subject.split(search).pop()! : subject;
  }

  static before(subject: string, search: string): string {
    return subject.includes(search) ? subject.split(search, 2)[0] : subject;
  }

  static beforeLast(subject: string, search: string): string {
    return subject.includes(search)
      ? subject.substring(0, subject.lastIndexOf(search))
      : subject;
  }

  static between(subject: string, from: string, to: string): string {
    return this.before(this.after(subject, from), to);
  }

  static camel(subject: string): string {
    return subject
      .replace(/[-_ ]+./g, (match) =>
        match.charAt(match.length - 1).toUpperCase(),
      )
      .replace(/^./, (char) => char.toLowerCase());
  }

  static charAt(subject: string, index: number): string {
    return subject.charAt(index);
  }

  static chopStart(subject: string, search: string): string {
    return subject.startsWith(search) ? subject.slice(search.length) : subject;
  }

  static chopEnd(subject: string, search: string): string {
    return subject.endsWith(search)
      ? subject.slice(0, -search.length)
      : subject;
  }

  static contains(subject: string, search: string | string[]): boolean {
    const searches = Array.isArray(search) ? search : [search];
    return searches.some((s) => subject.includes(s));
  }

  static containsAll(subject: string, search: string[]): boolean {
    return search.every((s) => subject.includes(s));
  }

  static doesntContain(subject: string, search: string | string[]): boolean {
    return !this.contains(subject, search);
  }

  static deduplicate(subject: string): string {
    return subject.replace(/(.)\1+/g, '$1');
  }

  static endsWith(subject: string, search: string): boolean {
    return subject.endsWith(search);
  }

  static excerpt(
    subject: string,
    phrase: string,
    radius: number = 50,
    end: string = '...',
  ): string {
    const position = subject.indexOf(phrase);
    if (position === -1) return '';

    const start = Math.max(position - radius, 0);
    const excerpt = subject.substring(start, position + phrase.length + radius);

    return (
      (start > 0 ? end : '') +
      excerpt +
      (position + phrase.length + radius < subject.length ? end : '')
    );
  }

  static finish(subject: string, cap: string): string {
    return subject.endsWith(cap) ? subject : subject + cap;
  }

  static headline(subject: string): string {
    return subject
      .replace(/[-_]+/g, ' ')
      .replace(
        /\w+/g,
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      );
  }

  static is(subject: string, pattern: string): boolean {
    const regex = new RegExp(`^${pattern.replace('*', '.*')}$`);
    return regex.test(subject);
  }

  static isAscii(subject: string): boolean {
    // eslint-disable-next-line no-control-regex
    return /^[\u0000-\u007F]*$/.test(subject);
  }

  static isJson(subject: string): boolean {
    try {
      JSON.parse(subject);
      return true;
    } catch {
      return false;
    }
  }

  static isUlid(subject: string): boolean {
    return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(subject);
  }

  static isUrl(subject: string): boolean {
    try {
      new URL(subject);
      return true;
    } catch {
      return false;
    }
  }

  static isUuid(subject: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      subject,
    );
  }

  static kebab(subject: string): string {
    return subject
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[-_ ]+/g, '-')
      .toLowerCase();
  }

  static lcfirst(subject: string): string {
    return subject.charAt(0).toLowerCase() + subject.slice(1);
  }

  static lengthString(subject: string): number {
    return subject.length;
  }

  static limit(subject: string, limit: number, end: string = '...'): string {
    return subject.length > limit ? subject.substring(0, limit) + end : subject;
  }

  static lower(subject: string): string {
    return subject.toLowerCase();
  }

  static mask(
    subject: string,
    mask: string,
    start: number = 0,
    length?: number,
  ): string {
    const end = typeof length === 'undefined' ? subject.length : start + length;
    return (
      subject.slice(0, start) +
      mask.repeat(Math.max(0, end - start)) +
      subject.slice(end)
    );
  }

  static padBoth(subject: string, length: number, pad: string = ' '): string {
    const totalPad = Math.max(0, length - subject.length);
    const leftPad = Math.floor(totalPad / 2);
    const rightPad = totalPad - leftPad;
    return pad.repeat(leftPad) + subject + pad.repeat(rightPad);
  }

  static padLeft(subject: string, length: number, pad: string = ' '): string {
    const totalPad = Math.max(0, length - subject.length);
    return pad.repeat(totalPad) + subject;
  }

  static padRight(subject: string, length: number, pad: string = ' '): string {
    const totalPad = Math.max(0, length - subject.length);
    return subject + pad.repeat(totalPad);
  }

  static plural(subject: string): string {
    return subject + 's'; // Simple example, for demonstration only
  }

  static singular(subject: string): string {
    return subject.endsWith('s') ? subject.slice(0, -1) : subject;
  }

  static slug(subject: string, separator: string = '-'): string {
    return subject
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, separator)
      .replace(new RegExp(`[${separator}]{2,}`, 'g'), separator)
      .replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
  }

  static snake(subject: string): string {
    return subject
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[-_ ]+/g, '_')
      .toLowerCase();
  }

  static squish(subject: string): string {
    return subject.replace(/\s+/g, ' ').trim();
  }

  static start(subject: string, prefix: string): string {
    return subject.startsWith(prefix) ? subject : prefix + subject;
  }

  static startsWith(subject: string, search: string): boolean {
    return subject.startsWith(search);
  }

  static studly(subject: string): string {
    return subject
      .replace(/[-_ ]+/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  static substr(subject: string, start: number, length?: number): string {
    return subject.substring(start, length ? start + length : undefined);
  }

  static substrCount(subject: string, search: string): number {
    return (subject.match(new RegExp(search, 'g')) || []).length;
  }

  static substrReplace(
    subject: string,
    replacement: string,
    start: number,
    length?: number,
  ): string {
    const end = typeof length === 'undefined' ? subject.length : start + length;
    return subject.slice(0, start) + replacement + subject.slice(end);
  }

  static swap(subject: string, swaps: Record<string, string>): string {
    let result = subject;
    for (const [search, replace] of Object.entries(swaps)) {
      result = result.split(search).join(replace);
    }
    return result;
  }

  static take(subject: string, limit: number): string {
    return subject.slice(0, limit);
  }

  static title(subject: string): string {
    return subject.replace(
      /\w+/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
  }

  static toBase64(subject: string): string {
    return btoa(subject);
  }

  static transliterate(subject: string): string {
    return subject.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  static trim(subject: string): string {
    return subject.trim();
  }

  static ltrim(subject: string): string {
    return subject.trimStart();
  }

  static rtrim(subject: string): string {
    return subject.trimEnd();
  }

  static ucfirst(subject: string): string {
    return subject.charAt(0).toUpperCase() + subject.slice(1);
  }

  static ucsplit(subject: string): string[] {
    return subject.split(/(?=[A-Z])/);
  }

  static upper(subject: string): string {
    return subject.toUpperCase();
  }

  static unwrap(subject: string, wrapper: string): string {
    if (subject.startsWith(wrapper) && subject.endsWith(wrapper)) {
      return subject.slice(wrapper.length, -wrapper.length);
    }
    return subject;
  }

  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static wordCount(subject: string): number {
    return subject.trim().split(/\s+/).length;
  }

  static wordWrap(
    subject: string,
    width: number,
    breakStr: string = '\n',
  ): string {
    return subject.replace(
      new RegExp(`(.{1,${width}})(\\s+|$)`, 'g'),
      `$1${breakStr}`,
    );
  }

  static words(subject: string, words: number, end: string = '...'): string {
    const wordArray = subject.trim().split(/\s+/);
    return wordArray.length > words
      ? wordArray.slice(0, words).join(' ') + end
      : subject;
  }

  static wrap(subject: string, before: string, after?: string): string {
    return `${before}${subject}${after ?? before}`;
  }
}
