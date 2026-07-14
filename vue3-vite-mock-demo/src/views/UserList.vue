<template>
  <main class="page">
    <section class="toolbar">
      <h1>用户列表</h1>
      <div class="search">
        <input v-model="keyword" placeholder="按姓名或角色搜索" />
        <button type="button" @click="fetchUsers">查询</button>
      </div>
    </section>

    <p v-if="loading" class="state">加载中...</p>
    <p v-else-if="users.length === 0" class="state">暂无数据</p>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>姓名</th>
          <th>年龄</th>
          <th>角色</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.age }}</td>
          <td>{{ user.role }}</td>
          <td>{{ statusText[user.status] || user.status }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getUserList } from '../api/user';

const users = ref([]);
const keyword = ref('');
const loading = ref(false);

const statusText = {
  online: '在线',
  offline: '离线',
  busy: '忙碌',
};

async function fetchUsers() {
  loading.value = true;
  const res = await getUserList({ keyword: keyword.value });
  users.value = res.data.data;
  loading.value = false;
}

onMounted(fetchUsers);
</script>
