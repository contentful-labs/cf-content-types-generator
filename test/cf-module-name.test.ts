import { expect } from "@oclif/test";
import { moduleName } from "../src/cf-module-name";

describe('A moduleName function', () => {

    const specs = [
        { input: 'helloWorld', expect: 'TypeHelloWorld' },
        { input: 'hello-World', expect: 'TypeHello__World' },
        { input: '0helloWorld', expect: 'Type0helloWorld' },
        { input: '0-helloWorld', expect: 'Type0__helloWorld' },
        { input: '1-0-helloWorld', expect: 'Type1__0__helloWorld' },
        { input: 'hello World', expect: 'TypeHelloWorld' },
        { input: 'hello-World', expect: 'TypeHello__World' },
        { input: '12345', expect: 'Type12345' },
    ];

    specs.forEach(spec => {
        it('transforms \'' + spec.input + '\' to valid module name \'' + spec.expect + '\'', () => {
            expect(moduleName(spec.input)).to.equal(spec.expect);
        });
    })
});