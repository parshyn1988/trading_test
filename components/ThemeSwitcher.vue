<template>
	<button @click="toggleTheme"
	        class="fixed bottom-4 left-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800
	        dark:text-gray-200 shadow-md transition"
	        aria-label="Toggle Theme"
	>
		{{ isDark ? '🌙 Dark' : '☀️ Light' }}
	</button>
</template>

<script setup lang="ts">
const isDark = ref(false);

function toggleTheme() {
	isDark.value = !isDark.value
	document.documentElement.classList.toggle('dark', isDark.value)
	localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		isDark.value = savedTheme === 'dark';
		document.documentElement.classList.toggle('dark', isDark.value)
	}
})
</script>

