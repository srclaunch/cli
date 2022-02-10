import { Model, Primitives } from '@srclaunch/types';

export function getTypescriptTypeFromPrimitive(type: Primitives) {
  switch (type) {
    case Primitives.Boolean:
      return 'boolean';
    case Primitives.DayOfMonth:
      return 'number';
    case Primitives.Weekday:
      return 'string';
    case Primitives.Float:
      return 'number';
    case Primitives.CurrencyCode:
      return 'string';
    case Primitives.DateTime:
      return 'Date';
    case Primitives.Image:
        return 'Image[]';
    case Primitives.JSON:
      return 'Record<string, any>';
    case Primitives.LongText:
      return 'string';
    case Primitives.Markdown:
      return 'string';
    case Primitives.Menu:
      return 'Menu';
    case Primitives.Month:
      return 'number';
    case Primitives.Number:
      return 'number';
    case Primitives.Tags:
      return 'string[]';
    case Primitives.String:
      return 'string';
    case Primitives.UUID:
      return 'string';
    // case Primitives.UnofficialCurrencyCode:
    //   return 'string';
    default:
      return 'unknown';
  }
}

function constructClassPropsWithTypes(fields: Model['fields']): string {
  let fieldsStr = ` public readonly id!: string;
  public readonly created_date!: Date;
  public readonly updated_date!: Date;
  `;

  for (const field of [...Object.entries(fields)].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    fieldsStr += `public ${field[0]}!: ${getTypescriptTypeFromPrimitive(
      field[1].type,
    )} ${!field[1].required ? '| null' : ''};\n`;
  }

  return fieldsStr;
}

export function constructTypesStr(model: Model): string {
  const typePropertiesStr = constructTypePropsFromFields(model.fields);
  const classPropertiesStr = constructClassPropsWithTypes(model.fields);

  return `import { Menu } from '@srclaunch/types';
  
export type ${model.name}Attributes = {
  ${typePropertiesStr}
};

export default class ${model.name} implements ${model.name}Attributes {
${classPropertiesStr}
}
`;
}

export function constructTypePropsFromFields(fields: Model['fields']): string {
  let fieldsStr = `  id: string;
  created_date: DateTime;
  updated_date: DateTime;
`;

  for (const field of [...Object.entries(fields)].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    fieldsStr += `  ${field[0]}${
      !field[1].required ? '?' : ''
    }: ${getTypescriptTypeFromPrimitive(field[1].type)} ${
      !field[1].required ? '| null' : ''
    };\n`;
  }

  return fieldsStr;
}
