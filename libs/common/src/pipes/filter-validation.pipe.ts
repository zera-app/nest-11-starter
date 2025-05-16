import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

type FilterableValue = string | number | boolean | Date | null;

@Injectable()
export class FilterValidationPipe implements PipeTransform {
  transform(value: Record<string, unknown>, metadata: ArgumentMetadata) {
    // Only process query parameters
    if (metadata.type !== 'query') {
      return value;
    }

    const result: Record<string, FilterableValue> = {};

    // Iterate through all query parameters
    for (const key in value) {
      // Check if the key matches our filter pattern: filter[something]
      const matches = key.match(/filter\[(.*?)\]/);
      if (matches && matches.length > 1) {
        const filterKey = matches[1];
        const potentialValue = value[key];

        if (
          typeof potentialValue === 'string' ||
          typeof potentialValue === 'number' ||
          typeof potentialValue === 'boolean' ||
          potentialValue instanceof Date ||
          potentialValue === null
        ) {
          result[filterKey] = potentialValue;
        }
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }
}
