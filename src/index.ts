import * as fs from 'fs-extra';
import {Command, flags} from '@oclif/command';
import CFDefinitionsBuilder from './cf-definitions-builder';

const contentfulExport = require('contentful-export');

class ContentfulMdg extends Command {
    static description = ' Content Types Generator (TS)';

    static flags = {
        version: flags.version({char: 'v'}),
        help: flags.help({char: 'h'}),
        out: flags.string({char: 'o', description: 'output directory'}),
        spaceId: flags.string({char: 's', description: 'space id'}),
        token: flags.string({char: 't', description: 'management token'}),
        environment: flags.string({char: 'e', description: 'environment'}),
    };

    static args = [{name: 'file', description: 'local export (.json)'}];

    async run() {
        const {args, flags} = this.parse(ContentfulMdg);

        if (args.file && !fs.existsSync(args.file)) {
            this.error(`file ${args.file} doesn't exists.`);
        }

        let content;

        if (args.file) {
            content = await fs.readJSON(args.file);
            if (!content.contentTypes) {
                this.error(`file ${args.file} is missing "contentTypes" field`);
            }
        } else {
            if (!flags.spaceId) this.error('Please specify "spaceId".');
            if (!flags.token) this.error('Please specify "token".');

            content = await contentfulExport({
                spaceId: flags.spaceId,
                managementToken: flags.token,
                environmentId: flags.environment,
                skipEditorInterfaces: true,
                skipContent: true,
                skipRoles: true,
                skipWebhooks: true,
                saveFile: false,
            });
        }

        const builder = new CFDefinitionsBuilder();
        content.contentTypes.forEach(builder.appendType);

        if (flags.out) {
            await builder.write(flags.out);
        } else {
            this.log(builder.toString());
        }
    }
}

export = ContentfulMdg
