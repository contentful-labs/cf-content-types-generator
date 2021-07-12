import {Field} from 'contentful';
import {OptionalKind, PropertySignatureStructure, SourceFile, TypeAliasDeclarationStructure} from 'ts-morph';
import {propertyImports} from '../cf-property-imports';
import {renderTypeGeneric} from '../renderer';
import {CFContentType} from '../types';
import {createDefaultContext} from './create-default-context';
import {ContentTypeRenderer, RenderContext} from './render-types';

export class DefaultContentTypeRenderer implements ContentTypeRenderer {
    public render(contentType: CFContentType, file: SourceFile): void {
        const context = this.createContext();

        this.addDefaultImports(context);
        this.renderFieldsInterface(contentType, file, context);

        file.addTypeAlias(this.renderEntry(contentType, context));

        context.imports.forEach(structure => {
            file.addImportDeclaration(structure);
        });
    }

    protected renderFieldsInterface(
        contentType: CFContentType,
        file: SourceFile,
        context: RenderContext) {
        const fieldsInterfaceName = context.moduleFieldsName(contentType.sys.id);
        const interfaceDeclaration = file.addInterface({
            name: fieldsInterfaceName,
            isExported: true,
        });

        contentType.fields.forEach(field => {
            interfaceDeclaration.addProperty(this.renderField(field, context));
            propertyImports(field, context, file.getBaseNameWithoutExtension()).forEach(pImport => {
                context.imports.add(pImport);
            });
        });
    }

    protected addDefaultImports(context: RenderContext): void {
        context.imports.add({
            moduleSpecifier: 'contentful',
            namespaceImport: 'Contentful',
        });
    }

    protected renderField(
        field: Field,
        context: RenderContext): OptionalKind<PropertySignatureStructure> {
        return {
            name: field.id,
            hasQuestionToken: field.omitted || (!field.required),
            type: this.renderFieldType(field, context),
        };
    }

    protected renderFieldType(field: Field, context: RenderContext): string {
        return context.getFieldRenderer(field.type)(field, context);
    }

    protected renderEntry(
        contentType: CFContentType,
        context: RenderContext): OptionalKind<TypeAliasDeclarationStructure> {
        return {
            name: context.moduleName(contentType.sys.id),
            isExported: true,
            type: this.renderEntryType(contentType, context),
        };
    }

    protected renderEntryType(contentType: CFContentType, context: RenderContext): string {
        return renderTypeGeneric('Contentful.Entry', context.moduleFieldsName(contentType.sys.id));
    }

    public createContext(): RenderContext {
        return createDefaultContext();
    }
}
