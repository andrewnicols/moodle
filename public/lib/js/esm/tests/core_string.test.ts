import {getStrings} from '@moodle/lms/core/String';
import {requireAsync} from '@moodle/lms/core/amd';

jest.mock('@moodle/lms/core/amd');

const mockRequireAsync = jest.mocked(requireAsync);

// The core/str uses snake_case (Moodle AMD convention). The eslint-disable block
// keeps the mock shape readable while avoiding repeated per-line suppressions.
/* eslint-disable camelcase */
type CoreStr = {get_strings(reqs: Array<{key: string; component: string}>): Promise<string[]>};

function mockCoreStr(strings: string[]): {mock: jest.MockedFunction<CoreStr['get_strings']>; module: CoreStr} {
    const mock = jest.fn<Promise<string[]>, [Array<{key: string; component: string}>]>().mockResolvedValue(strings);
    return {mock, module: {get_strings: mock}};
}
/* eslint-enable camelcase */

describe('getStrings', () => {
    it('loads core/str via requireAsync', async() => {
        const {module} = mockCoreStr(['Hello']);
        mockRequireAsync.mockResolvedValue(module);

        await getStrings([{key: 'hello', component: 'core'}]);

        expect(mockRequireAsync).toHaveBeenCalledWith('core/str');
    });

    it('passes the request array to get_strings', async() => {
        const {mock, module} = mockCoreStr(['Forum', 'Submit']);
        mockRequireAsync.mockResolvedValue(module);

        await getStrings([
            {key: 'pluginname', component: 'mod_forum'},
            {key: 'submit', component: 'core'},
        ]);

        expect(mock).toHaveBeenCalledWith([
            {key: 'pluginname', component: 'mod_forum'},
            {key: 'submit', component: 'core'},
        ]);
    });

    it('returns the strings resolved by get_strings', async() => {
        const {module} = mockCoreStr(['Forum', 'Submit']);
        mockRequireAsync.mockResolvedValue(module);

        const result = await getStrings([
            {key: 'pluginname', component: 'mod_forum'},
            {key: 'submit', component: 'core'},
        ]);

        expect(result).toEqual(['Forum', 'Submit']);
    });
});
