export async function getUserById(id) {
  return {
    code: 200,
    message: 'success',
    data: {
      id,
      name: '张三',
    },
  };
}
