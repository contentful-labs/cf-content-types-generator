import * as path from 'path';
import {
    forEachStructureChild,
    ImportDeclarationStructure,
    OptionalKind,
    Project,
    ScriptTarget,
    SourceFile,
    StructureKind,
} from 'ts-morph';
import {ContentTypeRenderer, DefaultContentTypeRenderer} from './type-renderer';
import {CFContentType, WriteCallback} from './types';

export default class CFDefinitionsBuilder {
    private readonly project: Project;

    private contentTypeRenderer: ContentTypeRenderer;

    constructor(contentTypeRenderer?: ContentTypeRenderer) {
        this.contentTypeRenderer = contentTypeRenderer || new DefaultContentTypeRenderer();
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

        const file = this.addFile(this.contentTypeRenderer.createContext().moduleName(model.sys.id));
        this.contentTypeRenderer.render(model, file);

        file.organizeImports({
            ensureNewLineAtEndOfFile: true,
        });

        return this;
    };

    public write = async (dir: string, writeCallback: WriteCallback): Promise<void> => {
        this.addIndexFile();

        const writePromises = this.project.getSourceFiles().map(file => {
            const targetPath = path.resolve(dir, file.getFilePath().slice(1));
            return writeCallback(targetPath, file.getFullText());
        });
        await Promise.all(writePromises);
        this.removeIndexFile();
    };

    public toString = (): string => {
        const mergeFileName = 'ContentTypes';
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

        const fullText = mergeFile.getFullText();
        this.project.removeSourceFile(mergeFile);

        return fullText;
    }

    private addFile = (name: string): SourceFile => {
        return this.project.createSourceFile(`${name}.ts`,
            undefined,
            {
                overwrite: true,
            });
    };

    private getIndexFile = (): SourceFile | undefined => {
        return this.project.getSourceFile(file => {
            return file.getBaseNameWithoutExtension() === 'index';
        });
    }

    private addIndexFile = (): void => {
        this.removeIndexFile();

        const files = this.project
            .getSourceFiles()
            .map(file => file.getBaseNameWithoutExtension());

        const indexFile = this.addFile('index');

        files.forEach(fileName => {
            indexFile.addExportDeclaration({
                isTypeOnly: true,
                namedExports: [
                    this.contentTypeRenderer.createContext().moduleName(fileName),
                    this.contentTypeRenderer.createContext().moduleFieldsName(fileName),
                ],
                moduleSpecifier: `./${fileName}`,
            });
        });

        indexFile.organizeImports();
    };

    private removeIndexFile = () => {
        const indexFile = this.getIndexFile();
        if (indexFile) {
            this.project.removeSourceFile(indexFile);
        }
    }
}

