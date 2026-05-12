// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Tests for the core/fetch ESM module.
 *
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Undo the global auto-mock from setupFilesAfterEnv so we test the real module internals.
jest.unmock('@moodle/lms/core/fetch');

// Jest 27 + jsdom does not expose the Fetch API globals (Request, Response, Headers).
// Provide minimal polyfills so the module under test can construct Request objects
// and we can inspect them in assertions.

class MockHeaders {
    private map = new Map<string, string>();
    constructor(init?: Record<string, string>) {
        if (init) {
            Object.entries(init).forEach(([k, v]) => this.map.set(k.toLowerCase(), v));
        }
    }
    get(name: string): string | null {
        return this.map.get(name.toLowerCase()) ?? null;
    }
    set(name: string, value: string): void {
        this.map.set(name.toLowerCase(), value);
    }
}

class MockRequest {
    readonly url: string;
    readonly method: string;
    readonly headers: MockHeaders;
    private _body: any;

    constructor(input: string | URL, init?: any) {
        this.url = typeof input === 'string' ? input : input.toString();
        this.method = init?.method ?? 'GET';
        this.headers = new MockHeaders(init?.headers);
        this._body = init?.body ?? null;
    }

    async text(): Promise<string> {
        if (this._body === null || this._body === undefined) {
            return '';
        }
        if (typeof this._body === 'string') {
            return this._body;
        }
        return this._body.toString();
    }
}

(globalThis as any).Request = MockRequest;
(globalThis as any).Headers = MockHeaders;

// Provide M.cfg and M.util globals that the module reads at runtime.
const mockM = {
    cfg: {
        apibase: 'https://example.com',
        traceId: 'test-trace-id',
        batchFetchRequests: false,
    },
    util: {
        js_pending: jest.fn(),
        js_complete: jest.fn(),
    },
};

(globalThis as any).M = mockM;

/**
 * Build a minimal mock that satisfies the Response interface the module checks
 * (`ok` and `statusText`).
 */
function mockFetchResponse(ok: boolean, statusText = 'OK'): {ok: boolean; statusText: string} {
    return {ok, statusText};
}

// Capture the Request objects the module creates so we can inspect them.
let capturedRequest: Request | null = null;

const fetchMock = jest.fn(async (input: Request) => {
    capturedRequest = input;
    // Return a default "ok" response; individual tests override via mockImplementation.
    return mockFetchResponse(true);
});
(globalThis as any).fetch = fetchMock;

import Fetch, {
    request,
    performGet,
    performHead,
    performPost,
    performPut,
    performPatch,
    performDelete,
} from '@moodle/lms/core/fetch';

beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockImplementation(async (input: Request) => {
        capturedRequest = input;
        return mockFetchResponse(true) as any;
    });
    capturedRequest = null;
    mockM.util.js_pending.mockClear();
    mockM.util.js_complete.mockClear();
});

describe('@moodle/lms/core/fetch', () => {
    describe('request', () => {
        it('sends a GET request with correct URL and headers', async () => {
            await request('mod_example', 'animals', {params: {type: 'mammal'}});

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(capturedRequest).not.toBeNull();
            expect(capturedRequest!.method).toBe('GET');
            expect(capturedRequest!.url).toBe('https://example.com/rest/v2/mod_example/animals?type=mammal');
            expect(capturedRequest!.headers.get('Accept')).toBe('application/json');
            expect(capturedRequest!.headers.get('Content-Type')).toBe('application/json');
        });

        it('strips the core_ prefix from component names', async () => {
            await request('core_course', 'list');

            expect(capturedRequest!.url).toContain('/rest/v2/course/list');
        });

        it('registers and resolves a pending operation', async () => {
            await request('mod_forum', 'posts', {method: 'GET'});

            expect(mockM.util.js_pending).toHaveBeenCalledWith(
                'Requesting mod_forum/posts with GET',
            );
            expect(mockM.util.js_complete).toHaveBeenCalledWith(
                'Requesting mod_forum/posts with GET',
            );
        });

        it('rejects when the response is not ok', async () => {
            fetchMock.mockImplementation(async (input: Request) => {
                capturedRequest = input;
                return mockFetchResponse(false, 'Not Found') as any;
            });

            await expect(request('mod_example', 'missing')).rejects.toBe('Not Found');
        });

        it('sends a JSON body for object payloads', async () => {
            await request('mod_example', 'create', {
                method: 'POST',
                body: {name: 'Test'},
            });

            expect(capturedRequest!.method).toBe('POST');
            const text = await capturedRequest!.text();
            expect(JSON.parse(text)).toEqual({name: 'Test'});
        });

        it('sends a string body as-is', async () => {
            await request('mod_example', 'raw', {
                method: 'POST',
                body: 'raw-content',
            });

            const text = await capturedRequest!.text();
            expect(text).toBe('raw-content');
        });

        it('sends FormData body without stringifying', async () => {
            const formData = new FormData();
            formData.append('file', 'data');

            await request('mod_example', 'upload', {
                method: 'POST',
                body: formData,
            });

            expect(fetchMock).toHaveBeenCalledTimes(1);
        });

        it('defaults to GET with no options', async () => {
            await request('mod_example', 'index');

            expect(capturedRequest!.method).toBe('GET');
        });
    });

    describe('performGet', () => {
        it('sends a GET request', async () => {
            await performGet('mod_example', 'list', {params: {page: '1'}});

            expect(capturedRequest!.method).toBe('GET');
            expect(capturedRequest!.url).toContain('page=1');
        });

        it('works without options', async () => {
            await performGet('mod_example', 'list');

            expect(capturedRequest!.method).toBe('GET');
        });
    });

    describe('performHead', () => {
        it('sends a HEAD request', async () => {
            await performHead('mod_example', 'check');

            expect(capturedRequest!.method).toBe('HEAD');
        });
    });

    describe('performPost', () => {
        it('sends a POST request with body', async () => {
            await performPost('mod_example', 'create', {body: {title: 'New'}});

            expect(capturedRequest!.method).toBe('POST');
            const text = await capturedRequest!.text();
            expect(JSON.parse(text)).toEqual({title: 'New'});
        });
    });

    describe('performPut', () => {
        it('sends a PUT request with body', async () => {
            await performPut('mod_example', 'update', {body: {title: 'Updated'}});

            expect(capturedRequest!.method).toBe('PUT');
        });
    });

    describe('performPatch', () => {
        it('sends a PATCH request with body', async () => {
            await performPatch('mod_example', 'patch', {body: {field: 'value'}});

            expect(capturedRequest!.method).toBe('PATCH');
        });
    });

    describe('performDelete', () => {
        it('sends a DELETE request', async () => {
            await performDelete('mod_example', 'remove', {params: {id: '42'}});

            expect(capturedRequest!.method).toBe('DELETE');
            expect(capturedRequest!.url).toContain('id=42');
        });

        it('works without options', async () => {
            await performDelete('mod_example', 'remove');

            expect(capturedRequest!.method).toBe('DELETE');
        });

        it('sends a body when provided', async () => {
            await performDelete('mod_example', 'remove', {body: {reason: 'obsolete'}});

            const text = await capturedRequest!.text();
            expect(JSON.parse(text)).toEqual({reason: 'obsolete'});
        });
    });

    describe('Fetch default export (class API)', () => {
        it('exposes static methods matching named exports', () => {
            expect(typeof Fetch.request).toBe('function');
            expect(typeof Fetch.performGet).toBe('function');
            expect(typeof Fetch.performHead).toBe('function');
            expect(typeof Fetch.performPost).toBe('function');
            expect(typeof Fetch.performPut).toBe('function');
            expect(typeof Fetch.performPatch).toBe('function');
            expect(typeof Fetch.performDelete).toBe('function');
        });

        it('can be used via Fetch.performGet()', async () => {
            const response = await Fetch.performGet('mod_example', 'items');

            expect(response).toHaveProperty('ok', true);
        });
    });
});
