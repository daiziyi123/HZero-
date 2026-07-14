export async function renderUserName(fetchUser) {
  const response = await fetchUser(1);

  if (response.code !== 200) {
    return '用户加载失败';
  }

  return `用户名：${response.data.name}`;
}
