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
 * Tests for the mockFetchResponse helper defined in .jest/globalSetup.ts.
 *
 * These tests verify that the fetch module mock infrastructure works correctly,
 * following the same pattern as mockModule.test.ts for the AMD mock helpers.
 *
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {
    request,
    performGet,
    performHead,
    performPost,
    performPut,
    performPatch,
    performDelete,
} from '@moodle/lms/core/fetch';

describe('mockFetchResponse helper', () => {
    it('makes performGet return the mocked data', async () => {
        mockFetchResponse('mod_forum', 'posts', {items: [{id: 1, title: 'Hello'}]});

        const response: any = await performGet('mod_forum', 'posts');

        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({items: [{id: 1, title: 'Hello'}]});
    });

    it('makes performPost return the mocked data', async () => {
        mockFetchResponse('mod_forum', 'create', {id: 42});

        const response: any = await performPost('mod_forum', 'create');

        expect(response.ok).toBe(true);
        await expect(response.json()).resolves.toEqual({id: 42});
    });

    it('makes request return the mocked data', async () => {
        mockFetchResponse('mod_quiz', 'attempts', [1, 2, 3]);

        const response: any = await request('mod_quiz', 'attempts');

        await expect(response.json()).resolves.toEqual([1, 2, 3]);
    });

    it('throws for unmocked routes', () => {
        expect(() => performGet('unmocked', 'route')).toThrow(
            'Unexpected call to performGet with route: unmocked/route',
        );
    });

    it('throws descriptive errors for each method', () => {
        expect(() => performHead('a', 'b')).toThrow('Unexpected call to performHead');
        expect(() => performPost('a', 'b')).toThrow('Unexpected call to performPost');
        expect(() => performPut('a', 'b')).toThrow('Unexpected call to performPut');
        expect(() => performPatch('a', 'b')).toThrow('Unexpected call to performPatch');
        expect(() => performDelete('a', 'b')).toThrow('Unexpected call to performDelete');
        expect(() => request('a', 'b')).toThrow('Unexpected call to request');
    });

    it('rejects with statusText for error status codes', async () => {
        mockFetchResponse('mod_forum', 'missing', null, {status: 404, statusText: 'Not Found'});

        await expect(performGet('mod_forum', 'missing')).rejects.toBe('Not Found');
    });

    it('uses default statusText for error codes when not specified', async () => {
        mockFetchResponse('mod_forum', 'broken', null, {status: 500});

        await expect(performGet('mod_forum', 'broken')).rejects.toBe('OK');
    });

    it('supports multiple independent routes', async () => {
        mockFetchResponse('mod_forum', 'posts', {type: 'posts'});
        mockFetchResponse('mod_quiz', 'attempts', {type: 'attempts'});

        const forumResponse: any = await performGet('mod_forum', 'posts');
        const quizResponse: any = await performGet('mod_quiz', 'attempts');

        await expect(forumResponse.json()).resolves.toEqual({type: 'posts'});
        await expect(quizResponse.json()).resolves.toEqual({type: 'attempts'});
    });

    it('provides text() that returns a JSON string of the data', async () => {
        mockFetchResponse('mod_forum', 'posts', {key: 'value'});

        const response: any = await performGet('mod_forum', 'posts');

        await expect(response.text()).resolves.toBe('{"key":"value"}');
    });

    it('provides text() that returns raw string data as-is', async () => {
        mockFetchResponse('mod_forum', 'raw', 'plain text response');

        const response: any = await performGet('mod_forum', 'raw');

        await expect(response.text()).resolves.toBe('plain text response');
    });
});

describe('mockFetchResponse isolation between tests', () => {
    it('registers a route in the first test', async () => {
        mockFetchResponse('mod_forum', 'posts', {test: 1});

        const response: any = await performGet('mod_forum', 'posts');
        await expect(response.json()).resolves.toEqual({test: 1});
    });

    it('does not see routes from the previous test', () => {
        // The route registered above should have been cleared by afterEach.
        expect(() => performGet('mod_forum', 'posts')).toThrow(
            'Unexpected call to performGet with route: mod_forum/posts',
        );
    });
});
