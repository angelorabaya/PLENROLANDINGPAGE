/**
 * Unit tests for the Facebook posts helper.
 * Run with: `node --test functions/lib/`
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  sanitizePost,
  buildPostsUrl,
  fetchPagePosts,
  resolveApiVersion,
  DEFAULT_API_VERSION,
} from './facebook-posts.mjs';

test('sanitizePost shapes a raw post safely', () => {
  const raw = {
    id: '789005134298348_123',
    message: 'Hello world',
    attachments: {
      data: [
        {
          media: {
            image: { src: 'https://scontent.fbcdn.net/x.jpg' },
          },
        },
      ],
    },
    permalink_url: 'https://www.facebook.com/123',
    created_time: '2026-08-01T09:30:00+0000',
  };
  const post = sanitizePost(raw);
  assert.equal(post.id, '789005134298348_123');
  assert.equal(post.message, 'Hello world');
  assert.equal(post.full_picture, 'https://scontent.fbcdn.net/x.jpg');
  assert.equal(post.permalink_url, 'https://www.facebook.com/123');
  assert.equal(post.created_time, '2026-08-01T09:30:00+0000');
});

test('sanitizePost truncates long messages and tolerates missing fields', () => {
  const long = 'x'.repeat(600);
  const post = sanitizePost({ id: 'a', message: long });
  assert.ok(post.message.length <= 400);
  assert.equal(post.full_picture, '');
  assert.equal(post.permalink_url, '');
  assert.equal(post.created_time, '');
});

test('buildPostsUrl encodes fields and token', () => {
  const url = buildPostsUrl('789005134298348', 'EAAtoken', 10);
  assert.ok(
    url.startsWith(`https://graph.facebook.com/${DEFAULT_API_VERSION}/789005134298348/posts?`)
  );
  assert.ok(url.includes('fields=id%2Cmessage%2Cstory%2Ccreated_time%2Cpermalink_url%2Cattachments'));
  assert.ok(url.includes('limit=10'));
  assert.ok(url.includes('access_token=EAAtoken'));
});

test('buildPostsUrl honours an explicit API version and ignores invalid ones', () => {
  const custom = buildPostsUrl('123', 'EAAtoken', 5, 'v24.0');
  assert.ok(custom.startsWith('https://graph.facebook.com/v24.0/123/posts?'));

  const invalid = buildPostsUrl('123', 'EAAtoken', 5, 'latest');
  assert.ok(invalid.startsWith(`https://graph.facebook.com/${DEFAULT_API_VERSION}/`));
});

test('resolveApiVersion validates FACEBOOK_API_VERSION', () => {
  assert.equal(resolveApiVersion({ FACEBOOK_API_VERSION: 'v24.0' }), 'v24.0');
  assert.equal(resolveApiVersion({ FACEBOOK_API_VERSION: ' v22.0 ' }), 'v22.0');
  assert.equal(resolveApiVersion({ FACEBOOK_API_VERSION: '24' }), DEFAULT_API_VERSION);
  assert.equal(resolveApiVersion({}), DEFAULT_API_VERSION);
  assert.equal(resolveApiVersion(undefined), DEFAULT_API_VERSION);
});

test('sanitizePost falls back to attachment caption and story when message is empty', () => {
  const viaAttachment = sanitizePost({
    id: 'p',
    attachments: { data: [{ description: 'Caption from photo' }] },
  });
  assert.equal(viaAttachment.message, 'Caption from photo');

  const viaTitle = sanitizePost({
    id: 'p1',
    attachments: { data: [{ title: 'Photo title' }] },
  });
  assert.equal(viaTitle.message, 'Photo title');

  const viaStory = sanitizePost({ id: 'p2', story: 'PLENRO added 3 new photos.' });
  assert.equal(viaStory.message, 'PLENRO added 3 new photos.');

  // message wins over attachment caption/story
  const all = sanitizePost({
    id: 'p3',
    message: 'Text post',
    attachments: { data: [{ description: 'Photo caption' }] },
    story: 'Added photos',
  });
  assert.equal(all.message, 'Text post');
});

test('sanitizePost resolves picture from subattachments (multi-photo posts)', () => {
  const post = sanitizePost({
    id: 'album',
    attachments: {
      data: [
        {
          subattachments: {
            data: [{ media: { image: { src: 'https://fbcdn/album1.jpg' } } }],
          },
        },
      ],
    },
  });
  assert.equal(post.full_picture, 'https://fbcdn/album1.jpg');
});

test('sanitizePost resolves picture from attachment media', () => {
  const post = sanitizePost({
    id: 'p',
    attachments: {
      data: [{ media: { image: { src: 'https://fbcdn/img.jpg' } } }],
    },
  });
  assert.equal(post.full_picture, 'https://fbcdn/img.jpg');

  // falls back to media.source for videos
  const video = sanitizePost({
    id: 'v',
    attachments: { data: [{ media: { source: 'https://fbcdn/vid.mp4' } }] },
  });
  assert.equal(video.full_picture, 'https://fbcdn/vid.mp4');
});

test('fetchPagePosts keeps image-only posts (picture from attachments)', async () => {
  const fakeFetch = async () =>
    new Response(
      JSON.stringify({
        data: [
          {
            id: 'p1',
            message: 'First post',
            attachments: {
              data: [{ media: { image: { src: 'https://fbcdn/1.jpg' } } }],
            },
            permalink_url: 'https://www.facebook.com/p1',
            created_time: '2026-08-01T09:30:00+0000',
          },
          { id: 'p2', message: 'Second post' },
          // image-only post: no message, but has a picture via attachments → kept
          {
            id: 'p4',
            attachments: {
              data: [{ media: { image: { src: 'https://fbcdn/4.jpg' } } }],
            },
            permalink_url: 'https://www.facebook.com/p4',
          },
          // permalink-only post (shared reel/link without caption) → kept
          {
            id: 'p5',
            permalink_url: 'https://www.facebook.com/p5',
            created_time: '2026-08-02T09:30:00+0000',
          },
          { id: 'p3' }, // no message, picture, or permalink → filtered out
        ],
      }),
      { status: 200 }
    );

  const { posts } = await fetchPagePosts('789005134298348', 'EAAtoken', { fetchFn: fakeFetch });
  assert.equal(posts.length, 4);
  assert.deepEqual(
    posts.map((p) => p.id),
    ['p1', 'p2', 'p4', 'p5']
  );
});

test('fetchPagePosts passes the requested API version to the Graph API', async () => {
  let requestedUrl = '';
  const fakeFetch = async (url) => {
    requestedUrl = String(url);
    return new Response(JSON.stringify({ data: [{ id: 'p1', message: 'Hi' }] }), { status: 200 });
  };

  await fetchPagePosts('123', 'EAAtoken', { fetchFn: fakeFetch, apiVersion: 'v24.0' });
  assert.ok(requestedUrl.startsWith('https://graph.facebook.com/v24.0/123/posts?'));
});

test('fetchPagePosts throws a descriptive error on Graph API failure', async () => {
  const fakeFetch = async () =>
    new Response(
      JSON.stringify({
        error: { code: 10, message: 'Permission denied' },
      }),
      { status: 403 }
    );

  await assert.rejects(
    () => fetchPagePosts('789005134298348', 'EAAtoken', { fetchFn: fakeFetch }),
    /Permission denied/
  );
});

test('fetchPagePosts throws when credentials are missing', async () => {
  await assert.rejects(() => fetchPagePosts('', 'EAAtoken'), /FACEBOOK_PAGE_ID/);
  await assert.rejects(() => fetchPagePosts('123', ''), /FACEBOOK_ACCESS_TOKEN/);
});
