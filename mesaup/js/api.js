const API = 'http://localhost:8081';

async function get(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function post(path, body) {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


async function postParams(path, params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(API + path + '?' + query, { method: 'POST' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function put(path, body) {
  const res = await fetch(API + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


async function putSemBody(path) {
  const res = await fetch(API + path, { method: 'PUT' });
  if (!res.ok) throw new Error(await res.text());
}

async function del(path) {
  const res = await fetch(API + path, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}
