import {Field} from 'contentful';
import {ImportDeclarationStructure, OptionalKind} from 'ts-morph';
import {RenderContext} from './type-renderer';
import {linkContentTypeValidations} from './cf-extract-validation';

export const propertyImports = (field: Field, context: RenderContext, ignoreModule?: string): OptionalKind<ImportDeclarationStructure>[] => {
    const filterIgnoredModule = (name: string) => ignoreModule !== context.moduleName(name);

    const moduleImport = (module: string) => {
        return {
            moduleSpecifier: `./${context.moduleName(module)}`,
            namedImports: [
                context.moduleFieldsName(module),
            ],
        };
    };

    if (field.type === 'Link' && field.linkType === 'Entry') {
        return field.validations?.length > 0
            ? linkContentTypeValidations(field)
                .filter(filterIgnoredModule)
                .map((contentType: string) => moduleImport(contentType))
            : [moduleImport(field.id)];
    }
    if (field.type === 'Array' && field.items) {
        return linkContentTypeValidations(field.items)
            .filter(filterIgnoredModule)
            .map((contentType: string) => moduleImport(contentType));
    }
    return [];
};
