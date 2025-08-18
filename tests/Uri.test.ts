import { describe, it, expect } from 'vitest';
import Scheme from '../src/Scheme';
import Uri from '../src/Uri';

const pathAfterRoot = 'one/two/three.html';
const path = '/' + pathAfterRoot;
const params = [['four', 'five'], ['six', 'seven']];
const query = '?' + params[0].join('=') + '&' + params[1].join('=');

// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-function-return-type
const BLANK = ()=>{};

const u = Uri.from(path + query);

describe('.scheme', ()=>
{
	it('should equal', ()=>
	{
		expect((new Uri(null, '', '', null, '')).scheme).toBe(null);
		expect((new Uri("http", '', '', null, '')).scheme).toBe("http");
		expect((new Uri(Scheme.HTTP, '', '', null, '')).scheme).toBe("http");
	});

	it('should throw', ()=>
	{
		expect(() => {new Uri(64 as any, '', '', null, '', null as any);}).toThrow();
	});
});

describe('.port', ()=>
{
	it('should equal', ()=>
	{
		const d = 'x.com', port = 80;
		expect((new Uri(null, '', d, 0, '')).port).toBe(0);
		expect((new Uri(null, '', d, null, '')).port).toBe(null);
		expect((new Uri(null, '', d, '' as any, '')).port).toBe(null);
		expect((new Uri(null, '', d, NaN, '')).port).toBe(null);
		expect((new Uri(null, '', d, port, '')).port).toBe(port);
		expect((new Uri(null, '', d, (port + '') as any, '')).port).toBe(port);
	});
	it('should throw', ()=>
	{
		expect(() => {new Uri(null, '', '', 'foo' as any, '');}).toThrow();
		expect(() => {new Uri(null, '', '', {} as any, '');}).toThrow();
		expect(() => {new Uri(null, '', '', -1, '');}).toThrow();
		expect(() => {new Uri(null, '', '', Infinity, '');}).toThrow();
	});

});

describe('.path', ()=>
{
	it('should equal ' + path, ()=>
	{
		expect(u.path).toBe(path);
		expect((new Uri(null, null, null, null, pathAfterRoot)).path).toBe(pathAfterRoot);
		expect(Uri.toString({
			path: pathAfterRoot,
			fragment: '#x'
		})).toBe(pathAfterRoot + "#x");
	});

	it('should allow null', ()=>
	{
		expect((new Uri(null, '', '', null, '')).path).toBe(null);
		expect((new Uri(Scheme.HTTP, '', '', null, '')).path).toBe(null);
		expect((new Uri('http', '', '', null, '')).path).toBe(null);
	});
});

describe('.fragment', ()=>
{
	it('should equal', ()=>
	{
		expect(u.path).toBe(path);
	});

	it('should allow null', ()=>
	{
		expect((new Uri(null, '', '', null, '')).path).toBe(null);
		expect((new Uri(Scheme.HTTP, '', '', null, '')).path).toBe(null);
		expect((new Uri('http', '', '', null, '')).path).toBe(null);
	});
});

describe('.from(uri)', ()=>
{
	it('should be equal', ()=>
	{
		const c1 = Uri.from(u);
		expect(u.equals(c1)).toBe(true);

		const c2 = Uri.from({}, u);
		expect(u.equals(c2)).toBe(true);

	});
});

describe('.updateQuery(query)', ()=>
{
	it('should be equal', ()=>
	{
		const c = u.updateQuery("x=y");
		expect(c.queryParams["x"]).toBe("y");
	});
});

describe('.pathSegments', ()=>
{
	it('should be equal', ()=>
	{
		expect(u.pathSegments.join('')).toBe(u.path);
	});
});

describe('.getAuthority(uri)', ()=>
{
	it('should be equal', ()=>
	{
		expect(Uri.getAuthority({
			host: 'a',
			port: 80,
			userInfo: 'b',
			path: 'xxx'
		})).toBe("//b@a:80");
		expect(Uri.getAuthority({host: 'a', port: 80, path: 'xxx'})).toBe("//a:80");
		expect(Uri.getAuthority({host: 'a', userInfo: 'b', path: 'xxx'})).toBe("//b@a");
		expect(Uri.getAuthority({host: 'a'})).toBe("//a");
	});

	it('should throw', ()=>
	{
		expect(() =>
		{
			Uri.getAuthority({userInfo: 'b'});
		}).toThrow();
		expect(() =>
		{
			Uri.getAuthority({port: 80});
		}).toThrow();
	});

});

describe('.copyOf(), .copyTo() & .equals()', ()=>
{
	it('should equal the copy', ()=>
	{
		expect(u.equals(Uri.copyOf(u))).toBe(true);
		expect(u.equals(u.copyTo({}))).toBe(true);
	});
});

describe('.parse(url)', ()=>
{
	it('should throw', ()=>
	{
		expect(()=>Uri.parse(null as any, true)).toThrow();
	});
});

describe('.toString(uri)', ()=>
{
	it('should throw', ()=>
	{
		expect(()=>Uri.toString({
			scheme: "http", // Can't target a scheme when no authority is provided.
			path: pathAfterRoot,
			fragment: '#x'
		})).toThrow();
	});

	it('should equal', ()=>
	{
		expect(Uri.toString({
			scheme: "http",
			host: "x.com",
			path: pathAfterRoot,
			fragment: '#x',
		})).toBe("http://x.com" + path + "#x");
	});
});

describe('.tryParse(uri)', ()=>
{
	it('should return false if invalid', ()=>
	{
		expect(Uri.tryParse(null as any, BLANK)).toBe(false);
	});

	it('should parse correctly', ()=>
	{
		const fragment = "x##?y", full = "http://x.com/y/z#" + fragment;
		expect(Uri.tryParse(full, out=>
		{
			expect(out.fragment).toBe(fragment);
			expect(Uri.toString(out)).toBe(full);
		})).toBe(true);

		expect(Uri.tryParse("http://x.com/y/z?#", out=>
		{
			expect(out.query).toBe(undefined);
			expect(out.fragment).toBe(undefined);
		})).toBe(true);

		expect(Uri.tryParse("hello//x.com/y/z#" + fragment, BLANK)).toBe(false);
		expect(Uri.tryParse("hello://x.com/y/z#" + fragment, BLANK)).toBe(false);
		expect(Uri.tryParse(" ://x.com/y/z#" + fragment, BLANK)).toBe(true);
		expect(Uri.tryParse("x.com", out=>
		{
			expect(out.path).toBe(undefined);
		})).toBe(true);
		expect(Uri.tryParse("x.com/", out=>
		{
			expect(out.path).toBe('/');
		})).toBe(true);
		expect(Uri.tryParse("me@x.com/" + fragment, out=>
		{
			expect(out.userInfo).toBe('me');
		})).toBe(true);
		expect(Uri.tryParse("@x.com/" + fragment, out=>
		{
			expect(out.userInfo).toBe(undefined);
		})).toBe(true);

		expect(Uri.tryParse("@x.com:80" + fragment, out=>
		{
			expect(out.port).toBe(80);
		})).toBe(true);
		expect(Uri.tryParse("@x.com:" + fragment, BLANK)).toBe(false);

		expect(Uri.tryParse("", out=>
		{
			expect(out.scheme).toBe(undefined);
			expect(out.host).toBe(undefined);
			expect(out.userInfo).toBe(undefined);
			expect(out.port).toBe(undefined);
			expect(out.path).toBe(undefined);
			expect(out.query).toBe(undefined);
			expect(out.fragment).toBe(undefined);
		})).toBe(false);
	});

});

describe('.baseUri', ()=>
{
	it('should equal ' + path, ()=>
	{
		expect(u.baseUri).toBe(path);
	});
});

describe('.query', ()=>
{
	it('should equal ' + query, ()=>
	{
		expect(u.query).toBe(query);
	});
});


describe('.queryParams', ()=>
{
	it('should equal contain correct values', ()=>
	{
		expect(u.queryParams[params[0][0]]).toBe(params[0][1]);
		expect(u.queryParams[params[1][0]]).toBe(params[1][1]);
	});


});


describe('KVP versus Tuple', ()=>
{

	it('should be equal', ()=>
	{
		const uTuples = new Uri(u.scheme, u.userInfo, u.host, u.port, u.path, params as any);
		const uKvp = new Uri(u.scheme, u.userInfo, u.host, u.port, u.path, u.queryParams);

		expect(uTuples.toString()).toBe(uKvp.toString());
	});


});

