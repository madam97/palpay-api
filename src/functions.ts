/// STRING

export function ucfirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toSnakeCase(text: string): string {
  return text.split(/(?=[A-Z])/).join('_').toLowerCase();
}

export function toCamelCase(text: string): string {
  return /[-_]/g.test(text) ? text.toLowerCase().replace(/[-_][a-z0-9]/g, (group) => group.slice(-1).toUpperCase()) : text;
}

export function toPascalCase(text: string): string {
  return ucfirst( toCamelCase(text) );
}


/// OBJECT

const helperCaseObject = (data: object, caseFunc: Function): object => {
  const newData: any[][] = [];

  for (const [key, value] of Object.entries(data)) {
    newData.push([ caseFunc(key.toString()), value ]);
  }

  return Object.fromEntries(newData);
}

export function toSnakeCaseObject(data: object): object {
  return helperCaseObject(data, toSnakeCase);
}

export function toCamelCaseObject(data: object): object {
  return helperCaseObject(data, toCamelCase);
}

export function toPascalCaseObject(data: object): object {
  return helperCaseObject(data, toPascalCase);
}