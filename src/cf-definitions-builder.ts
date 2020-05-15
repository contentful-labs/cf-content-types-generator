import {Field} from 'contentful';
import * as fs from 'fs-extra';
import * as path from 'path';
import {
    forEachStructureChild,
    ImportDeclarationStructure,
    InterfaceDeclaration,
    OptionalKind,
    Project,
    ScriptTarget,
    SourceFile,
    StructureKind,
} from 'ts-morph';
import {propertyImports} from './cf-property-imports';
import {renderProp} from './renderer/cf-render-prop';
import {renderGenericType} from './renderer/render-generic-type';
import {moduleFieldsName, moduleName} from './utils';

export type CFContentType = {
    name: string;
    id: string;
    sys: {
        id: string;
        type: string;
    };
    fields: Field[];
};

export default class CFDefinitionsBuilder {
    private readonly project: Project;

    constructor() {
        this.project = new Project({
            useInMemoryFileSystem: true,
            compilerOptions: {
                target: ScriptTarget.ES5,
                declaration: true,
            },
        });
    }

    public appendType = (model: CFContentType): CFDefinitionsBuilder => {
        if (model.sys.type !== 'ContentType') {
            throw new Error('given data is not describing a ContentType');
        }

        const file = this.addFile(moduleName(model.sys.id));

        this.addDefaultImports(file);

        const interfaceDeclaration = this.createInterfaceDeclaration(file, moduleFieldsName(model.sys.id));

        model.fields.forEach(field => this.addProperty(file, interfaceDeclaration, field));

        this.addEntryTypeAlias(file, model.sys.id, moduleFieldsName(model.sys.id));

        file.organizeImports({
            ensureNewLineAtEndOfFile: true,
        });

        return this;
    };

    public write = async (dir: string): Promise<void> => {
        this.addIndexFile();

        const writePromises = this.project.getSourceFiles().map(file => {
            const targetPath = path.resolve(dir, file.getFilePath().slice(1));
            return fs.writeFile(targetPath, file.getFullText());
        });
        await Promise.all(writePromises);
    };

    public toString = (): string => this.mergeFile().getFullText();

    private addFile = (name: string): SourceFile => {
        return this.project.createSourceFile(`${name}.ts`,
            undefined,
            {
                overwrite: true,
            });
    };

    private createInterfaceDeclaration = (file: SourceFile, name: string): InterfaceDeclaration => {
        return file.addInterface({name, isExported: true});
    };

    private addIndexFile = (): void => {
        const oldIndexFile = this.project.getSourceFile(file => {
            return file.getBaseNameWithoutExtension() === 'index';
        });

        if (oldIndexFile) {
            this.project.removeSourceFile(oldIndexFile);
        }

        const files = this.project
            .getSourceFiles()
            .map(file => file.getBaseNameWithoutExtension());

        const indexFile = this.addFile('index');

        files.forEach(fileName => {
            indexFile.addExportDeclaration({
                namedExports: [moduleName(fileName), moduleFieldsName(fileName)],
                moduleSpecifier: `./${fileName}`,
            });
        });

        indexFile.organizeImports();
    };

    private addEntryTypeAlias = (file: SourceFile, aliasName: string, entryType: string) => {
        file.addTypeAlias({
            isExported: true,
            name: moduleName(aliasName),
            type: renderGenericType('Contentful.Entry', entryType),
        });
    };

    private addProperty = (
        file: SourceFile,
        declaration: InterfaceDeclaration,
        field: Field
    ): void => {
        declaration.addProperty({
            name: field.id,
            hasQuestionToken: field.omitted || (!field.required),
            type: renderProp(field),
        });

        // eslint-disable-next-line no-warning-comments
        // TODO: dynamically define imports based on usage
        file.addImportDeclaration({
            moduleSpecifier: 'contentful',
            namespaceImport: 'Contentful',
        });

        file.addImportDeclaration({
            moduleSpecifier: '@contentful/rich-text-types',
            namespaceImport: 'CFRichTextTypes',
        });
        file.addImportDeclarations(propertyImports(field));
    };

    private mergeFile = (mergeFileName = 'ContentTypes'): SourceFile => {
        const mergeFile = this.addFile(mergeFileName);

        const imports: OptionalKind<ImportDeclarationStructure>[] = [];
        const types: string[] = [];

        this.project.getSourceFiles()
            .filter(sourceFile => sourceFile.getBaseNameWithoutExtension() !== mergeFileName)
            .forEach(sourceFile => forEachStructureChild(sourceFile.getStructure(),
                childStructure => {
                    switch (childStructure.kind) {
                    case StructureKind.ImportDeclaration:
                        imports.push(childStructure);
                        break;
                    case StructureKind.Interface:
                        types.push(childStructure.name);
                        mergeFile.addInterface(childStructure);
                        break;
                    case StructureKind.TypeAlias:
                        types.push(childStructure.name);
                        mergeFile.addTypeAlias(childStructure);
                        break;
                    default:
                        throw new Error(`Unhandled node type '${StructureKind[childStructure.kind]}'.`);
                    }
                }));

        // only import modules not present in merge file
        imports.forEach(importD => {
            const name = importD.moduleSpecifier.slice(2);
            if (!types.includes(name)) {
                mergeFile.addImportDeclaration(importD);
            }
        });

        mergeFile.organizeImports({
            ensureNewLineAtEndOfFile: true,
        });

        return mergeFile;
    };

    private addDefaultImports(file: SourceFile) {
        file.addImportDeclaration({
            moduleSpecifier: 'contentful',
            namespaceImport: 'Contentful',
        });
    }
}

